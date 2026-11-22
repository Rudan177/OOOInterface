/**
 * 时间墙与信息流：壁纸模式下继续上滑，状态栏自身连续放大成顶部大时钟；
 * 再上滑进入信息流，同一个状态栏再连续缩小成顶部小时钟。
 * 视图层级为 首页 → 壁纸 → 时间墙 → 信息流，进退统一由 advanceViewStage / retreatViewStage 驱动。
 * 由 main.js 通过 Object.assign 挂载到 OOOInterface.prototype。
 */

const VIEW_STAGE_HOME = 0;
const VIEW_STAGE_WALLPAPER = 1;
const VIEW_STAGE_TIME_WALL = 2;
const VIEW_STAGE_FEED = 3;

export const TimeWallMixin = {
    advanceViewStage() {
        if (!this.isScrolled) {
            this.showWallpaper();
            return;
        }
        if (this.viewStage <= VIEW_STAGE_WALLPAPER) {
            this.enterTimeWall();
            return;
        }
        if (this.viewStage === VIEW_STAGE_TIME_WALL) {
            this.enterFeed();
        }
    },
    retreatViewStage() {
        if (this.viewStage >= VIEW_STAGE_FEED) {
            this.exitFeed();
            return;
        }
        if (this.viewStage === VIEW_STAGE_TIME_WALL) {
            this.exitTimeWall();
            return;
        }
        if (this.isScrolled) {
            this.restoreHomepage();
        }
    },
    enterTimeWall() {
        if (!this.settings.timeWallEnabled || this.viewStage >= VIEW_STAGE_TIME_WALL) return;

        // 先记下日期在一行状态栏里的位置，切换布局后把日期从旧位置接到新位置。
        const dateRect = this.captureStatusDateRect();
        this.viewStage = VIEW_STAGE_TIME_WALL;
        document.body.classList.add('time-wall-mode');
        document.body.classList.remove('feed-mode');
        this.showClockInStatusBar();
        this.animateStatusDate(dateRect);
    },
    exitTimeWall() {
        if (this.viewStage < VIEW_STAGE_TIME_WALL) return;

        const dateRect = this.captureStatusDateRect();
        this.viewStage = VIEW_STAGE_WALLPAPER;
        // 先用普通状态栏的布局与字号，但保留 time-wall-mode 和模糊配色，
        // 等缩小过程结束后再撤掉，避免动画中途掉成纯色。
        document.body.classList.add('time-wall-collapsed');
        this.animateStatusDate(dateRect);

        if (this._timeWallExitTimer) {
            clearTimeout(this._timeWallExitTimer);
        }
        this._timeWallExitTimer = setTimeout(() => {
            this._timeWallExitTimer = null;
            if (this.viewStage >= VIEW_STAGE_TIME_WALL) return;
            document.body.classList.remove('time-wall-mode', 'feed-mode', 'time-wall-collapsed');
            this.releaseClockInStatusBar();
        }, 700);
    },
    captureStatusDateRect() {
        const dateEl = document.querySelector('#status-bar .status-bar-date');
        return dateEl ? dateEl.getBoundingClientRect() : null;
    },
    /**
     * 状态栏在单行 / 两行之间切换时，日期会从时间左侧跳到时间上方。
     * 这里逐帧跟随布局的真实位置做插值：既连上横向位移，也跟得上时间字号
     * 在过渡过程中不断变化的宽度，退出时不会停在一个错的位置。
     */
    animateStatusDate(fromRect) {
        const dateEl = document.querySelector('#status-bar .status-bar-date');
        if (!fromRect || !dateEl) return;

        if (this._statusDateRaf) {
            cancelAnimationFrame(this._statusDateRaf);
            this._statusDateRaf = null;
        }

        const startCenterX = fromRect.left + fromRect.width / 2;
        const startCenterY = fromRect.top + fromRect.height / 2;
        const duration = 650;
        const startTime = window.performance && performance.now ? performance.now() : Date.now();
        const ease = (progress) => progress * progress * (3 - 2 * progress);

        const step = (now) => {
            const progress = Math.min(1, (now - startTime) / duration);
            dateEl.style.transform = 'none';
            const rect = dateEl.getBoundingClientRect();
            const naturalCenterX = rect.left + rect.width / 2;
            const naturalCenterY = rect.top + rect.height / 2;
            const eased = ease(progress);
            const dx = (startCenterX + (naturalCenterX - startCenterX) * eased) - naturalCenterX;
            const dy = (startCenterY + (naturalCenterY - startCenterY) * eased) - naturalCenterY;

            if (progress >= 1) {
                dateEl.style.transform = '';
                this._statusDateRaf = null;
                return;
            }

            dateEl.style.transform = `translate(${dx}px, ${dy}px)`;
            this._statusDateRaf = requestAnimationFrame(step);
        };

        dateEl.style.transform = 'none';
        this._statusDateRaf = requestAnimationFrame(step);
    },
    enterFeed() {
        if (!this.settings.timeWallEnabled || !this.settings.feedEnabled) return;
        if (this.viewStage >= VIEW_STAGE_FEED) return;

        if (this.viewStage < VIEW_STAGE_TIME_WALL) {
            this.enterTimeWall();
        }
        if (!this.settings.timeWallEnabled) return;

        this.viewStage = VIEW_STAGE_FEED;
        document.body.classList.add('time-wall-mode', 'feed-mode');
        // 只缩小，不重算配色：时间墙的模糊配色继续沿用，避免进入信息流时颜色消失。
        const statusBar = document.getElementById('status-bar');
        if (statusBar) statusBar.classList.add('visible');
        this.startStatusBarTimer();
    },
    exitFeed() {
        if (this.viewStage < VIEW_STAGE_FEED) return;

        this.viewStage = VIEW_STAGE_TIME_WALL;
        document.body.classList.remove('feed-mode');
    },
    clearTimeWallState() {
        const wasExtendedStage = this.viewStage >= VIEW_STAGE_TIME_WALL;
        if (this._timeWallExitTimer) {
            clearTimeout(this._timeWallExitTimer);
            this._timeWallExitTimer = null;
        }
        document.body.classList.remove('time-wall-mode', 'feed-mode', 'time-wall-collapsed');
        this.viewStage = VIEW_STAGE_HOME;
        if (wasExtendedStage) {
            this.releaseClockInStatusBar();
        }
    },
    /**
     * 时间墙/信息流都用状态栏本身当钟：确保它可见、刷新文本并开始走时。
     * 大时钟与小钟只是 .status-bar-time 的 font-size 过渡，日期始终留在上方。
     */
    showClockInStatusBar() {
        const statusBar = document.getElementById('status-bar');
        if (!statusBar) return;

        // 取消可能还在等待的退出淡出，避免刚放大就被收走。
        if (this._statusBarCollapseTimer) {
            clearTimeout(this._statusBarCollapseTimer);
            this._statusBarCollapseTimer = null;
        }
        if (this._timeWallExitTimer) {
            clearTimeout(this._timeWallExitTimer);
            this._timeWallExitTimer = null;
        }
        document.body.classList.remove('time-wall-collapsed');

        statusBar.classList.add('visible');
        document.documentElement.style.setProperty(
            '--status-bar-offset',
            this.settings.statusBarEnabled ? '44px' : '10px'
        );
        this.updateStatusBarText();
        this.startStatusBarTimer();
        this.updateStatusBarTextContrast();
    },
    /**
     * 离开时间墙：状态栏开关关着就把这块钟收回，开着则保留并恢复小字号取色。
     */
    releaseClockInStatusBar() {
        if (this.settings.statusBarEnabled) {
            this.updateStatusBarTextContrast();
            return;
        }

        // 状态栏关着时，也先让时间连续缩回小字号，再把整块钟淡出，
        // 否则退出会变成直接消失。
        if (this._statusBarCollapseTimer) {
            clearTimeout(this._statusBarCollapseTimer);
        }
        this._statusBarCollapseTimer = setTimeout(() => {
            this._statusBarCollapseTimer = null;
            if (this.viewStage >= VIEW_STAGE_TIME_WALL) return;

            const statusBar = document.getElementById('status-bar');
            if (statusBar) statusBar.classList.remove('visible');
            this.stopStatusBarTimer();
            document.documentElement.style.setProperty('--status-bar-offset', '10px');
        }, 700);
    },
    /**
     * 应用时间墙相关开关：同步设置页 UI，并在功能被关闭时把视图收回到允许的层级。
     */
    applyTimeWallSettings() {
        const toggle = document.getElementById('time-wall-toggle');
        if (toggle) toggle.checked = !!this.settings.timeWallEnabled;
        const feedToggle = document.getElementById('feed-toggle');
        if (feedToggle) feedToggle.checked = !!this.settings.feedEnabled;
        const feedGroup = document.getElementById('feed-toggle-group');
        if (feedGroup) feedGroup.style.display = this.settings.timeWallEnabled ? 'block' : 'none';

        if (!this.settings.timeWallEnabled && this.viewStage >= VIEW_STAGE_TIME_WALL) {
            this.exitTimeWall();
        } else if (!this.settings.feedEnabled && this.viewStage >= VIEW_STAGE_FEED) {
            this.exitFeed();
        } else if (this.viewStage >= VIEW_STAGE_TIME_WALL) {
            // 高级视觉效果等开关变化时，重新计算时钟的模糊配色。
            this.updateStatusBarTextContrast();
        }
    }
};

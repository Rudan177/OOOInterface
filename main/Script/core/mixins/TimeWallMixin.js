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
        document.body.classList.remove('time-wall-mode', 'feed-mode');
        this.releaseClockInStatusBar();
        this.animateStatusDate(dateRect);
    },
    captureStatusDateRect() {
        const dateEl = document.querySelector('#status-bar .status-bar-date');
        return dateEl ? dateEl.getBoundingClientRect() : null;
    },
    /**
     * 状态栏在单行 / 两行之间切换时，日期会从时间左侧跳到时间上方。
     * 用 FLIP 把这段横向位移连起来，纵向交给状态栏自身的 top 过渡。
     */
    animateStatusDate(fromRect) {
        const dateEl = document.querySelector('#status-bar .status-bar-date');
        if (!fromRect || !dateEl || typeof dateEl.animate !== 'function') return;

        const toRect = dateEl.getBoundingClientRect();
        if (!toRect.width) return;

        const dx = (fromRect.left + fromRect.width / 2) - (toRect.left + toRect.width / 2);
        if (Math.abs(dx) < 1) return;

        if (this._statusDateAnimation) {
            this._statusDateAnimation.cancel();
        }
        this._statusDateAnimation = dateEl.animate(
            [{ transform: `translateX(${dx}px)` }, { transform: 'translateX(0)' }],
            { duration: 650, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }
        );
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
        if (this.viewStage >= VIEW_STAGE_TIME_WALL) {
            this.releaseClockInStatusBar();
        }
        this.viewStage = VIEW_STAGE_HOME;
        document.body.classList.remove('time-wall-mode', 'feed-mode');
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

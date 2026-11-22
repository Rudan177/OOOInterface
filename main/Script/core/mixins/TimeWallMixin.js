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

        // 先记下日期、时间在一行状态栏里的位置，切换布局后从旧位置接过去。
        const dateRect = this.captureStatusDateRect();
        const timeRect = this.captureStatusTimeRect();
        this.viewStage = VIEW_STAGE_TIME_WALL;
        document.body.classList.add('time-wall-mode');
        document.body.classList.remove('feed-mode');
        this.showClockInStatusBar();
        this.animateStatusDate(dateRect);
        this.animateStatusTime(timeRect);
    },
    exitTimeWall() {
        if (this.viewStage < VIEW_STAGE_TIME_WALL) return;

        this.viewStage = VIEW_STAGE_WALLPAPER;
        if (this._timeWallPhaseTimer) {
            clearTimeout(this._timeWallPhaseTimer);
            this._timeWallPhaseTimer = null;
        }
        if (this._timeWallExitTimer) {
            clearTimeout(this._timeWallExitTimer);
            this._timeWallExitTimer = null;
        }

        // 第一阶段：保持上下两行，只把时间缩小、整块退回顶部。
        // 日期始终待在时间正上方，不做横向位移，返回过程中不会错位。
        document.body.classList.remove('time-wall-collapsed', 'feed-mode');
        document.body.classList.add('time-wall-returning');

        // 第二阶段：缩成小钟后再切成单行，日期从时间上方连续滑回左侧。
        // 此时字号已经稳定，横向 FLIP 的终点是精确的。
        this._timeWallPhaseTimer = setTimeout(() => {
            this._timeWallPhaseTimer = null;
            if (this.viewStage >= VIEW_STAGE_TIME_WALL) return;

            const dateRect = this.captureStatusDateRect();
            const timeRect = this.captureStatusTimeRect();
            document.body.classList.remove('time-wall-returning');
            document.body.classList.add('time-wall-collapsed');
            this.animateStatusDate(dateRect, 220);
            this.animateStatusTime(timeRect, 220);
        }, 650);

        this._timeWallExitTimer = setTimeout(() => {
            this._timeWallExitTimer = null;
            if (this.viewStage >= VIEW_STAGE_TIME_WALL) return;
            document.body.classList.remove(
                'time-wall-mode', 'feed-mode', 'time-wall-returning', 'time-wall-collapsed'
            );
            this.resetStatusTextTransforms();
            this.releaseClockInStatusBar();
        }, 920);
    },
    captureStatusDateRect() {
        const dateEl = document.querySelector('#status-bar .status-bar-date');
        return dateEl ? dateEl.getBoundingClientRect() : null;
    },
    captureStatusTimeRect() {
        const timeEl = document.querySelector('#status-bar .status-bar-time');
        return timeEl ? timeEl.getBoundingClientRect() : null;
    },
    /**
     * 状态栏在单行 / 两行之间切换时，日期与时间都会换位。
     * 这里把元素从旧位置平滑接到新布局位置：同一帧写入反向偏移，
     * 之后让偏移随动画衰减到 0，元素本身始终跟随真实布局。
     */
    animateStatusDate(fromRect, duration = 700) {
        this.animateStatusItem('_statusDateRaf', '#status-bar .status-bar-date', fromRect, duration);
    },
    animateStatusTime(fromRect, duration = 700) {
        this.animateStatusItem('_statusTimeRaf', '#status-bar .status-bar-time', fromRect, duration);
    },
    animateStatusItem(rafKey, selector, fromRect, duration) {
        const el = document.querySelector(selector);
        if (!fromRect || !el || !duration) return;

        if (this[rafKey]) {
            cancelAnimationFrame(this[rafKey]);
            this[rafKey] = null;
        }

        const startCenterX = fromRect.left + fromRect.width / 2;
        const startCenterY = fromRect.top + fromRect.height / 2;
        const startTime = window.performance && performance.now ? performance.now() : Date.now();
        const ease = (progress) => 1 - Math.pow(1 - progress, 3);

        el.style.willChange = 'transform';

        // 切换布局后立刻量一次自然位置，并在同一帧内把元素拉回旧位置，
        // 保证切换后的第一帧不会先闪到新位置。
        el.style.transform = 'none';
        const naturalRect = el.getBoundingClientRect();
        const offsetX = startCenterX - (naturalRect.left + naturalRect.width / 2);
        const offsetY = startCenterY - (naturalRect.top + naturalRect.height / 2);
        el.style.transform = `translate(${Math.round(offsetX)}px, ${Math.round(offsetY)}px)`;

        const step = (now) => {
            const progress = Math.min(1, (now - startTime) / duration);

            if (progress >= 1) {
                el.style.transform = '';
                el.style.willChange = '';
                this[rafKey] = null;
                return;
            }

            const remaining = 1 - ease(progress);
            const dx = Math.round(offsetX * remaining);
            const dy = Math.round(offsetY * remaining);
            el.style.transform = `translate(${dx}px, ${dy}px)`;
            this[rafKey] = requestAnimationFrame(step);
        };

        this[rafKey] = requestAnimationFrame(step);
    },
    resetStatusTextTransforms() {
        ['_statusDateRaf', '_statusTimeRaf'].forEach((rafKey) => {
            if (this[rafKey]) {
                cancelAnimationFrame(this[rafKey]);
                this[rafKey] = null;
            }
        });
        ['#status-bar .status-bar-date', '#status-bar .status-bar-time'].forEach((selector) => {
            const el = document.querySelector(selector);
            if (!el) return;
            el.style.transform = '';
            el.style.willChange = '';
        });
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
        if (this._timeWallPhaseTimer) {
            clearTimeout(this._timeWallPhaseTimer);
            this._timeWallPhaseTimer = null;
        }
        if (this._timeWallExitTimer) {
            clearTimeout(this._timeWallExitTimer);
            this._timeWallExitTimer = null;
        }
        this.resetStatusTextTransforms();
        document.body.classList.remove(
            'time-wall-mode', 'feed-mode', 'time-wall-returning', 'time-wall-collapsed'
        );
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
        if (this._timeWallPhaseTimer) {
            clearTimeout(this._timeWallPhaseTimer);
            this._timeWallPhaseTimer = null;
        }
        document.body.classList.remove('time-wall-collapsed', 'time-wall-returning');

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

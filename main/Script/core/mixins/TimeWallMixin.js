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

        this.viewStage = VIEW_STAGE_TIME_WALL;
        document.body.classList.add('time-wall-mode');
        document.body.classList.remove('feed-mode');
        this.showClockInStatusBar();
    },
    exitTimeWall() {
        if (this.viewStage < VIEW_STAGE_TIME_WALL) return;

        this.viewStage = VIEW_STAGE_WALLPAPER;
        document.body.classList.remove('time-wall-mode', 'feed-mode');
        this.releaseClockInStatusBar();
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
        this.showClockInStatusBar();
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
        }
    }
};

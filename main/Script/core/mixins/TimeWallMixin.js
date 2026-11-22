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

        // 先记下普通单行状态栏里日期、时间的位置，切换布局后从旧位置接过去。
        const dateRect = this.captureStatusDateRect();
        const timeRect = this.captureStatusTimeRect();

        this.viewStage = VIEW_STAGE_TIME_WALL;
        document.body.classList.add('time-wall-mode');
        document.body.classList.remove('feed-mode');
        this.enableClockBlur();
        this.showClockInStatusBar();
        this.animateStatusDate(dateRect, 320);
        this.animateStatusTime(timeRect, 320);
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
        if (this._timeWallSettleTimer) {
            clearTimeout(this._timeWallSettleTimer);
            this._timeWallSettleTimer = null;
        }

        // 一退出就让背景模糊开始淡出，不用等缩小结束。
        document.body.classList.remove('time-wall-collapsed');
        document.body.classList.add('time-wall-returning', 'time-wall-leaving', 'clock-shrinking');
        // 模糊属性本身只在时钟模式期间保留，淡出后再彻底移除，避免常驻开销。
        this.disableClockBlur(520);

        // 第一阶段（0–650ms）：保持两行，只把时间缩小、整块退回顶部。
        // 日期始终在时间上方，避免和巨大数字重叠；这段时间不做 JS 位移。
        this._timeWallPhaseTimer = setTimeout(() => {
            this._timeWallPhaseTimer = null;
            if (this.viewStage >= VIEW_STAGE_TIME_WALL) return;
            this.settleStatusBarToOneLine();
        }, 650);

        this._timeWallExitTimer = setTimeout(() => {
            this._timeWallExitTimer = null;
            if (this.viewStage >= VIEW_STAGE_TIME_WALL) return;
            document.body.classList.remove(
                'time-wall-mode', 'feed-mode', 'time-wall-returning',
                'time-wall-collapsed', 'time-wall-leaving', 'clock-shrinking'
            );
            this.resetStatusTextTransforms();
            this.releaseClockInStatusBar();
        }, 920);
    },
    /**
     * 第二阶段：字号已经缩到 12px，此时再切成单行。
     * 先在两行布局里用 transform 把日期/时间滑到最终位置（日期在上、时间在下，
     * 不会重叠），到位后切单行并清空位移，两者重合。
     */
    settleStatusBarToOneLine() {
        const dateEl = document.querySelector('#status-bar .status-bar-date');
        const timeEl = document.querySelector('#status-bar .status-bar-time');
        if (!dateEl || !timeEl) return;

        const center = (rect) => (rect
            ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
            : null);
        const columnDate = center(this.captureStatusDateRect());
        const columnTime = center(this.captureStatusTimeRect());

        // 字体已经稳定，临时切到单行量最终位置，不会触发字号过渡。
        document.body.classList.add('time-wall-collapsed');
        const rowDate = center(this.captureStatusDateRect());
        const rowTime = center(this.captureStatusTimeRect());
        document.body.classList.remove('time-wall-collapsed');

        if (!columnDate || !columnTime || !rowDate || !rowTime) return;
        // 强制回到两行布局后再启动 transform 过渡，确保起点正确。
        dateEl.offsetWidth;

        const ease = 'cubic-bezier(0.4, 0, 0.2, 1)';
        const dateX = Math.round(rowDate.x - columnDate.x);
        const dateY = Math.round(rowDate.y - columnDate.y);
        const timeX = Math.round(rowTime.x - columnTime.x);
        const timeY = Math.round(rowTime.y - columnTime.y);

        dateEl.style.transition = `transform 200ms ${ease}`;
        timeEl.style.transition = `transform 200ms ${ease}`;
        dateEl.style.transform = `translate(${dateX}px, ${dateY}px)`;
        timeEl.style.transform = `translate(${timeX}px, ${timeY}px)`;

        if (this._timeWallSettleTimer) {
            clearTimeout(this._timeWallSettleTimer);
        }
        this._timeWallSettleTimer = setTimeout(() => {
            this._timeWallSettleTimer = null;
            if (this.viewStage >= VIEW_STAGE_TIME_WALL) return;
            document.body.classList.remove('time-wall-returning');
            document.body.classList.add('time-wall-collapsed');
            [dateEl, timeEl].forEach((el) => {
                el.style.transition = '';
                el.style.transform = '';
            });
        }, 210);
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
        if (this._timeWallSettleTimer) {
            clearTimeout(this._timeWallSettleTimer);
            this._timeWallSettleTimer = null;
        }
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
            el.style.transition = '';
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
        this.disableClockBlur(0);
        document.body.classList.remove(
            'time-wall-mode', 'feed-mode', 'time-wall-returning',
            'time-wall-collapsed', 'time-wall-leaving', 'clock-shrinking'
        );
        this.viewStage = VIEW_STAGE_HOME;
        if (wasExtendedStage) {
            this.releaseClockInStatusBar();
        }
    },
    /**
     * 背景模糊只在时钟模式期间挂上，退出淡出后彻底移除，
     * 避免 opacity:0 的整屏 backdrop-filter 在首页/壁纸模式持续耗性能。
     */
    enableClockBlur() {
        if (this._clockBlurTimer) {
            clearTimeout(this._clockBlurTimer);
            this._clockBlurTimer = null;
        }
        document.body.classList.add('clock-blur');
    },
    disableClockBlur(delay = 0) {
        if (this._clockBlurTimer) {
            clearTimeout(this._clockBlurTimer);
            this._clockBlurTimer = null;
        }
        if (delay > 0) {
            this._clockBlurTimer = setTimeout(() => {
                this._clockBlurTimer = null;
                if (this.viewStage >= VIEW_STAGE_TIME_WALL) return;
                document.body.classList.remove('clock-blur');
            }, delay);
            return;
        }
        document.body.classList.remove('clock-blur');
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
        document.body.classList.remove(
            'time-wall-collapsed', 'time-wall-returning', 'time-wall-leaving', 'clock-shrinking'
        );
        this.resetStatusTextTransforms();

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

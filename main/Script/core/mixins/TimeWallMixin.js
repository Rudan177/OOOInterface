/**
 * 时间墙与信息流：壁纸模式下继续上滑显示大时钟，再上滑进入信息流占位页。
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

        const clock = document.getElementById('time-wall-clock');
        // 状态栏必须在加上 time-wall-mode 之前测量：之后它会被移出视口。
        const collapsed = this.getClockCollapsedMetrics();

        this.viewStage = VIEW_STAGE_TIME_WALL;
        document.body.classList.add('time-wall-mode');
        document.body.classList.remove('feed-mode');
        this.startTimeWallClock();

        // 始终从顶部的小时钟连续放大到大时钟：时钟锚点固定，只做 scale；
        // 状态栏开启时起始字号与状态栏文字一致，交接时几乎没有位移。
        if (clock) {
            this.runClockScaleAnimation(clock, collapsed, 'translateX(-50%) scale(1)', 650);
        }
        this.updateTimeWallClockContrast();
    },
    /**
     * 时钟收缩到顶部时的字号：状态栏可见时取状态栏字号，否则固定 12px。
     */
    getClockCollapsedMetrics() {
        const statusBar = document.getElementById('status-bar');
        const statusBarVisible = !!(this.settings.statusBarEnabled
            && statusBar
            && statusBar.classList.contains('visible'));
        if (statusBarVisible) {
            return { fontSize: parseFloat(getComputedStyle(statusBar).fontSize) || 12 };
        }
        return { fontSize: 12 };
    },
    /**
     * 收缩 transform：锚点固定在顶部中央，所以只需要一个 scale，不产生任何位移。
     */
    getClockCollapsedTransform(clock, collapsed) {
        const timeEl = clock.querySelector('.time-wall-clock-time');
        const fontSize = timeEl ? (parseFloat(getComputedStyle(timeEl).fontSize) || 120) : 120;
        if (!fontSize) return null;

        const scale = Math.max(0.04, collapsed.fontSize / fontSize);
        return `translateX(-50%) scale(${scale})`;
    },
    runClockScaleAnimation(clock, collapsed, toTransform, duration) {
        if (typeof clock.animate !== 'function') return;
        const fromTransform = this.getClockCollapsedTransform(clock, collapsed);
        if (!fromTransform) return;
        this.cancelClockAnimation();
        this._clockAnimation = clock.animate(
            [{ transform: fromTransform }, { transform: toTransform }],
            { duration, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }
        );
    },
    exitTimeWall() {
        if (this.viewStage < VIEW_STAGE_TIME_WALL) return;

        this.viewStage = VIEW_STAGE_WALLPAPER;
        const clock = document.getElementById('time-wall-clock');
        if (!clock || typeof clock.animate !== 'function') {
            this.finishExitTimeWall();
            return;
        }

        // 先把当前画面读出来：若入场放大还没结束，就从这一刻接着收缩，避免跳回终态。
        const currentTransform = getComputedStyle(clock).transform;
        this.cancelClockAnimation();

        const statusBar = document.getElementById('status-bar');
        let fontSize = 12;
        if (this.settings.statusBarEnabled && statusBar) {
            fontSize = parseFloat(getComputedStyle(statusBar).fontSize) || 12;
        }

        const collapsedTransform = this.getClockCollapsedTransform(clock, { fontSize });
        if (!collapsedTransform || currentTransform === 'none') {
            this.finishExitTimeWall();
            return;
        }

        const animation = clock.animate(
            [{ transform: currentTransform }, { transform: collapsedTransform }],
            { duration: 500, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' }
        );
        this._clockAnimation = animation;
        animation.finished.then(() => {
            if (this._clockAnimation !== animation) return;
            this.finishExitTimeWall();
        }).catch(() => {});
        // 兜底：标签页被节流时 finished 可能迟迟不回调，不能让视图卡在半程。
        setTimeout(() => {
            if (this._clockAnimation !== animation) return;
            this.finishExitTimeWall();
        }, 700);
    },
    finishExitTimeWall() {
        const clock = document.getElementById('time-wall-clock');
        this.stopTimeWallClock();
        this.cancelClockAnimation();
        document.body.classList.remove('time-wall-mode', 'feed-mode');
        if (!clock) return;
        // 收缩到状态栏位置后让时钟立即退场，交接给状态栏自身的过渡。
        clock.style.transition = 'none';
        clock.style.opacity = '0';
        requestAnimationFrame(() => {
            clock.style.transition = '';
            clock.style.opacity = '';
        });
    },
    cancelClockAnimation() {
        if (this._clockAnimation) {
            this._clockAnimation.cancel();
            this._clockAnimation = null;
        }
    },
    clearClockAnimationStyles() {
        this.cancelClockAnimation();
        const clock = document.getElementById('time-wall-clock');
        if (!clock) return;
        clock.style.transition = '';
        clock.style.transform = '';
    },
    enterFeed() {
        if (!this.settings.timeWallEnabled || !this.settings.feedEnabled) return;
        if (this.viewStage >= VIEW_STAGE_FEED) return;

        if (this.viewStage < VIEW_STAGE_TIME_WALL) {
            this.enterTimeWall();
        }
        if (!this.settings.timeWallEnabled) return;

        // 入场放大动画让位给缩小到顶部的 CSS 过渡，避免两段 transform 打架。
        this.cancelClockAnimation();

        this.viewStage = VIEW_STAGE_FEED;
        document.body.classList.add('time-wall-mode', 'feed-mode');
        // 时钟延续同一个元素缩小到顶部，计时器已在时间墙启动，这里只兜底。
        this.startTimeWallClock();
        this.updateTimeWallClockContrast();
    },
    exitFeed() {
        if (this.viewStage < VIEW_STAGE_FEED) return;

        this.viewStage = VIEW_STAGE_TIME_WALL;
        document.body.classList.remove('feed-mode');
    },
    clearTimeWallState() {
        this.viewStage = VIEW_STAGE_HOME;
        document.body.classList.remove('time-wall-mode', 'feed-mode');
        this.stopTimeWallClock();
        this.clearClockAnimationStyles();
    },
    startTimeWallClock() {
        this.stopTimeWallClock();

        const tick = () => {
            this.updateTimeWallClockText();
            const now = new Date();
            const showSeconds = this.settings.showStatusBarSeconds;
            let delay = showSeconds
                ? 1000 - now.getMilliseconds()
                : ((60 - now.getSeconds()) * 1000) - now.getMilliseconds();
            if (delay <= 0) {
                delay = showSeconds ? 1000 : 60000;
            }
            this.timeWallTimer = setTimeout(tick, delay);
        };

        this.updateTimeWallClockText();
        const now = new Date();
        const showSeconds = this.settings.showStatusBarSeconds;
        let delay = showSeconds
            ? 1000 - now.getMilliseconds()
            : ((60 - now.getSeconds()) * 1000) - now.getMilliseconds();
        if (delay <= 0) {
            delay = showSeconds ? 1000 : 60000;
        }
        this.timeWallTimer = setTimeout(tick, delay);
    },
    stopTimeWallClock() {
        if (this.timeWallTimer) {
            clearTimeout(this.timeWallTimer);
            this.timeWallTimer = null;
        }
    },
    updateTimeWallClockText() {
        const clock = document.getElementById('time-wall-clock');
        if (!clock) return;

        const timeEl = clock.querySelector('.time-wall-clock-time');
        const dateEl = clock.querySelector('.time-wall-clock-date');
        const now = new Date();
        const pad = (value) => String(value).padStart(2, '0');
        const hours = pad(now.getHours());
        const minutes = pad(now.getMinutes());
        const seconds = pad(now.getSeconds());

        if (timeEl) {
            timeEl.textContent = this.settings.showStatusBarSeconds
                ? `${hours}:${minutes}:${seconds}`
                : `${hours}:${minutes}`;
        }
        if (dateEl) {
            const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
            dateEl.textContent = `${now.getFullYear()}年${pad(now.getMonth() + 1)}月${pad(now.getDate())}日 ${weekdays[now.getDay()]}`;
        }
    },
    async updateTimeWallClockContrast() {
        const clock = document.getElementById('time-wall-clock');
        if (!clock) return;

        // 大时钟位于视口上部中央，固定取这一带来取样，避免受缩放中的元素边界影响。
        const viewportWidth = Math.max(1, window.innerWidth);
        const viewportHeight = Math.max(1, window.innerHeight);
        const sampleRect = {
            x: viewportWidth * 0.2,
            y: viewportHeight * 0.16,
            width: viewportWidth * 0.6,
            height: viewportHeight * 0.32
        };

        const tone = await this.computeWallpaperTextTone(sampleRect);
        // 取样期间可能已退出时间墙，避免把结果写到已经离场的时钟上。
        if (this.viewStage < VIEW_STAGE_TIME_WALL) return;
        this.applyTimeWallClockTone(tone || this.getFallbackStatusBarTextTone());
    },
    applyTimeWallClockTone(mode) {
        const clock = document.getElementById('time-wall-clock');
        const resolvedMode = mode === 'light' ? 'light' : 'dark';
        const isLight = resolvedMode === 'light';
        const color = isLight ? '#f8fafc' : '#1f2124';
        const panelBg = isLight ? 'rgba(16, 18, 22, 0.28)' : 'rgba(255, 255, 255, 0.30)';
        const panelBorder = isLight ? 'rgba(255, 255, 255, 0.14)' : 'rgba(255, 255, 255, 0.48)';

        if (clock) {
            clock.style.setProperty('--time-wall-text-color', color);
            clock.style.setProperty('--time-wall-panel-bg', panelBg);
            clock.style.setProperty('--time-wall-panel-border', panelBorder);
            // 浅色壁纸上用深色文字时不加白边阴影，避免小字发糊。
            clock.style.textShadow = isLight ? '0 2px 14px rgba(0, 0, 0, 0.28)' : 'none';
        }
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

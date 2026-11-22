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
        const statusBar = document.getElementById('status-bar');
        // 状态栏真正可见时才做位置衔接；否则时钟直接在大时钟位置淡入。
        const fromStatusBar = !!(this.settings.statusBarEnabled
            && statusBar
            && statusBar.classList.contains('visible'));
        const statusRect = fromStatusBar ? statusBar.getBoundingClientRect() : null;
        const statusFontSize = fromStatusBar
            ? (parseFloat(getComputedStyle(statusBar).fontSize) || 12)
            : 0;

        this.viewStage = VIEW_STAGE_TIME_WALL;
        document.body.classList.add('time-wall-mode');
        document.body.classList.remove('feed-mode');

        this.startTimeWallClock();

        // 用 FLIP 把时钟的起点精确落回状态栏的位置与字号，再过渡到时间墙终态，
        // 避免 CSS 里写死比例在不同视口下对不齐、看起来像跳一下。
        if (clock && statusRect) {
            this.animateClockFromStatusBar(clock, statusRect, statusFontSize);
        }
        this.updateTimeWallClockContrast();
    },
    /**
     * 让时钟从状态栏的位置与字号连续放大到时间墙终态。
     * 前提：调用前已经加上 time-wall-mode，时钟处于终态布局。
     */
    animateClockFromStatusBar(clock, statusRect, statusFontSize) {
        const timeEl = clock.querySelector('.time-wall-clock-time');
        const finalRect = clock.getBoundingClientRect();
        const finalFontSize = timeEl ? (parseFloat(getComputedStyle(timeEl).fontSize) || 120) : 120;
        if (!finalRect.width || !finalRect.height || !finalFontSize) return;

        const scale = Math.max(0.04, statusFontSize / finalFontSize);
        const statusCenterX = statusRect.left + statusRect.width / 2;
        const statusCenterY = statusRect.top + statusRect.height / 2;
        const dx = statusCenterX - (finalRect.left + finalRect.width / 2);
        const dy = statusCenterY - (finalRect.top + finalRect.height / 2);

        // 用 Web Animations 走完这一段：不依赖“设起始样式→等两帧→清样式”的时序，
        // 标签页被节流或 rAF 被暂停时也不会卡在缩小的起始状态。
        if (this._clockEntryAnimation) {
            this._clockEntryAnimation.cancel();
            this._clockEntryAnimation = null;
        }
        if (typeof clock.animate !== 'function') return;

        this._clockEntryAnimation = clock.animate([
            { transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(${scale})` },
            { transform: 'translate(-50%, -50%) scale(1)' }
        ], {
            duration: 650,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });
    },
    exitTimeWall() {
        if (this.viewStage < VIEW_STAGE_TIME_WALL) return;

        this.viewStage = VIEW_STAGE_WALLPAPER;
        document.body.classList.remove('time-wall-mode', 'feed-mode');
        this.stopTimeWallClock();
        this.clearClockAnimationStyles();
    },
    clearClockAnimationStyles() {
        if (this._clockEntryAnimation) {
            this._clockEntryAnimation.cancel();
            this._clockEntryAnimation = null;
        }
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
        if (this._clockEntryAnimation) {
            this._clockEntryAnimation.cancel();
            this._clockEntryAnimation = null;
        }

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

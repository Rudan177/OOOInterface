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

        this.resetStatusTextTransforms();

        const bar = document.getElementById('status-bar');
        const dateEl = document.querySelector('#status-bar .status-bar-date');
        const timeEl = document.querySelector('#status-bar .status-bar-time');
        if (!bar || !dateEl || !timeEl) {
            this.finishTimeWallExit(null, 0);
            return;
        }

        // 大钟当前所在位置。
        const bigDate = dateEl.getBoundingClientRect();
        const bigTime = timeEl.getBoundingClientRect();

        // 临时切到退出后的单行布局，量出日期/时间最终应该落在哪里，再切回来。
        // 这一步只读一次布局，动画期间不再测量，全部交给 transform。
        bar.classList.add('no-transition');
        document.body.classList.add('time-wall-collapsed');
        const finalDate = dateEl.getBoundingClientRect();
        const finalTime = timeEl.getBoundingClientRect();
        document.body.classList.remove('time-wall-collapsed');
        bar.offsetHeight;
        bar.classList.remove('no-transition');

        document.body.classList.add('time-wall-leaving');

        // 大钟保持当前字号与模糊纹理，只用 transform 连续缩小并移到最终位置；
        // 动画结束时在最终布局原位收尾，整段没有淡出淡入的空档。
        const duration = 400;
        this.disableClockBlur(duration + 20);
        this.shrinkStatusItem(dateEl, bigDate, finalDate, duration);
        this.shrinkStatusItem(timeEl, bigTime, finalTime, duration);
        this.animateStatusWeight(duration);
        this.blurStatusBarAtEnd(bar, duration);

        this._timeWallExitTimer = setTimeout(() => {
            this._timeWallExitTimer = null;
            if (this.viewStage >= VIEW_STAGE_TIME_WALL) return;
            this.finishTimeWallExit(bar, 0);
        }, duration + 20);
    },
    /**
     * 把元素从大钟里的位置连续缩到单行状态栏里的最终位置。
     * 动画只改 transform，不重排文字，也不逐帧读取布局。
     */
    shrinkStatusItem(el, fromRect, toRect, duration) {
        if (!fromRect || !toRect) return;

        const scale = Math.max(0.01, toRect.height / Math.max(1, fromRect.height));
        const dx = Math.round(
            (toRect.left + toRect.width / 2) - (fromRect.left + fromRect.width / 2)
        );
        const dy = Math.round(
            (toRect.top + toRect.height / 2) - (fromRect.top + fromRect.height / 2)
        );

        el.style.transformOrigin = 'center center';
        el.style.willChange = 'transform';
        el.style.transition = 'none';
        el.style.transform = '';
        // 先刷一次样式，让下面的过渡从「未偏移」状态开始。
        el.getBoundingClientRect();
        el.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        el.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
    },
    /**
     * 只在缩小行进途中加模糊：出现和消失都在动画进行中完成，
     * 收尾之前已经回到清晰，结束时不再有任何模糊变化。
     * 模糊加在状态栏父级上，按屏幕像素计算，不会被缩小后的 transform 一起缩掉。
     */
    blurStatusBarAtEnd(bar, duration) {
        if (!bar) return;
        const peakTime = Math.round(duration * 0.45);
        const peak = 4;

        if (this._clockBlurAnimation) {
            this._clockBlurAnimation.cancel();
            this._clockBlurAnimation = null;
        }
        if (this._timeWallBlurTimer) {
            clearTimeout(this._timeWallBlurTimer);
            this._timeWallBlurTimer = null;
        }

        // 用关键帧把模糊绑定在缩小动画的时间轴上：
        // 0% 清晰 → 45% 峰值 → 70% 已完全清晰 → 100% 保持清晰。
        // 这样出现和消失都发生在行进中，离结束还有一段干净的缩小。
        bar.style.willChange = 'filter';
        this._clockBlurAnimation = bar.animate([
            { filter: 'blur(0px)', offset: 0, easing: 'ease-out' },
            { filter: `blur(${peak}px)`, offset: 0.45, easing: 'ease-out' },
            { filter: 'blur(0px)', offset: 0.7 },
            { filter: 'blur(0px)', offset: 1 },
        ], { duration, easing: 'linear', fill: 'none' });

        // 模糊最重时把时钟从模糊纹理配色切回最终纯色，颜色变化藏在模糊里。
        this._timeWallBlurTimer = setTimeout(() => {
            this._timeWallBlurTimer = null;
            if (this.viewStage >= VIEW_STAGE_TIME_WALL) return;

            bar.classList.remove('clock-blur-palette');
            this.applyStatusBarTextTone(
                this.statusBarContrastMode || this.getFallbackStatusBarTextTone()
            );
        }, peakTime);
    },
    /**
     * 字重跟着缩小的节奏从 900/700 连续变到 500，和进入时的粗细过渡对称。
     * 与 transform 同长，收尾时字重已到 500，不会在最后一帧跳变。
     */
    animateStatusWeight(duration) {
        if (this._clockWeightAnimations) {
            this._clockWeightAnimations.forEach((animation) => animation.cancel());
        }
        this._clockWeightAnimations = [];

        const els = document.querySelectorAll(
            '#status-bar .status-bar-date, #status-bar .status-bar-time'
        );
        els.forEach((el) => {
            const from = window.getComputedStyle(el).fontWeight;
            if (!from || from === '500') return;
            this._clockWeightAnimations.push(
                el.animate(
                    [{ fontWeight: from }, { fontWeight: '500' }],
                    {
                        // 和缩小动画同长，粗细变化贯穿整段行进，收尾时正好到 500。
                        duration,
                        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                        fill: 'forwards',
                    }
                )
            );
        });
    },
    /**
     * 缩小动画结束：此时视觉位置已经和单行状态栏完全重合，
     * 关掉过渡一步切到最终布局并清掉 transform，看起来是同一块字缩小到位。
     */
    finishTimeWallExit(bar, delay) {
        const finalize = () => {
            const statusBar = bar || document.getElementById('status-bar');
            if (statusBar) statusBar.classList.add('no-transition');
            this.resetStatusTextTransforms();
            document.body.classList.remove(
                'time-wall-mode', 'feed-mode', 'time-wall-returning',
                'time-wall-collapsed', 'time-wall-leaving', 'clock-shrinking',
                'status-bar-clock-exit', 'status-bar-hidden'
            );
            // 状态栏开关关着时，这块钟缩小完就收回，不再留在顶部。
            if (!this.settings.statusBarEnabled && statusBar) {
                statusBar.classList.remove('visible');
                this.stopStatusBarTimer();
                document.documentElement.style.setProperty('--status-bar-offset', '10px');
            }
            if (statusBar) {
                statusBar.offsetHeight;
                statusBar.classList.remove('no-transition');
            }
            this.updateStatusBarTextContrast();
        };

        if (delay > 0) {
            setTimeout(finalize, delay);
            return;
        }
        finalize();
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
        if (this._timeWallBlurTimer) {
            clearTimeout(this._timeWallBlurTimer);
            this._timeWallBlurTimer = null;
        }
        if (this._clockBlurAnimation) {
            this._clockBlurAnimation.cancel();
            this._clockBlurAnimation = null;
        }
        if (this._clockWeightAnimations) {
            this._clockWeightAnimations.forEach((animation) => animation.cancel());
            this._clockWeightAnimations = [];
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
            el.style.filter = '';
            el.style.fontWeight = '';
        });
        // 收尾模糊加在状态栏父级上，这里一并清掉，避免残留到下一次进入。
        const bar = document.getElementById('status-bar');
        if (bar) {
            bar.style.filter = '';
            bar.style.transition = '';
            bar.style.willChange = '';
        }
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
            'time-wall-collapsed', 'time-wall-leaving', 'clock-shrinking',
            'status-bar-clock-exit', 'status-bar-hidden'
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
            'time-wall-collapsed', 'time-wall-returning', 'time-wall-leaving',
            'clock-shrinking', 'status-bar-clock-exit', 'status-bar-hidden'
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

/**
 * 状态栏：日期时间文本与定时刷新，并按壁纸取样亮度自适应文字明暗。
 * 由 main.js 通过 Object.assign 挂载到 OOOInterface.prototype。
 */

export const StatusBarMixin = {
    syncStatusBarUI() {
        const statusBarToggle = document.getElementById('status-bar-toggle');
        const showSecondsGroup = document.getElementById('show-seconds-group');
        const showSecondsToggle = document.getElementById('show-seconds-toggle');
        if (statusBarToggle) {
            statusBarToggle.checked = this.settings.statusBarEnabled;
        }
        if (showSecondsGroup && showSecondsToggle) {
            if (this.settings.statusBarEnabled) {
                showSecondsGroup.style.display = 'block';
                showSecondsToggle.checked = this.settings.showStatusBarSeconds;
            } else {
                showSecondsGroup.style.display = 'none';
                showSecondsToggle.checked = false;
            }
        }
        const onlineUpdateToggle = document.getElementById('online-rolling-update-toggle');
        if (onlineUpdateToggle) {
            onlineUpdateToggle.checked = this.settings.onlineRollingUpdate;
        }
    },
    formatStatusBarDate(date) {
        const pad = (value) => String(value).padStart(2, '0');
        return `${date.getFullYear()}年${pad(date.getMonth() + 1)}月${pad(date.getDate())}日`;
    },
    formatStatusBarTime(date) {
        const pad = (value) => String(value).padStart(2, '0');
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());

        if (this.settings.showStatusBarSeconds) {
            return `${hours}:${minutes}:${seconds}`;
        }

        return `${hours}:${minutes}`;
    },
    updateStatusBarText() {
        const statusBar = document.getElementById('status-bar');
        if (!statusBar) return;

        const dateEl = statusBar.querySelector('.status-bar-date');
        const timeEl = statusBar.querySelector('.status-bar-time');
        const now = new Date();
        if (dateEl) dateEl.textContent = this.formatStatusBarDate(now);
        if (timeEl) timeEl.textContent = this.formatStatusBarTime(now);
    },
    stopStatusBarTimer() {
        if (this.statusBarTimer) {
            clearTimeout(this.statusBarTimer);
            this.statusBarTimer = null;
        }
    },
    applyStatusBarTextTone(mode) {
        const statusBar = document.getElementById('status-bar');
        if (!statusBar) return;

        const resolvedMode = mode === 'light' ? 'light' : 'dark';
        const color = resolvedMode === 'light' ? '#f8fafc' : '#202124';
        const shadow = resolvedMode === 'light'
            ? '0 1px 2px rgba(0, 0, 0, 0.28)'
            : '0 1px 2px rgba(255, 255, 255, 0.18)';

        this.statusBarContrastMode = resolvedMode;
        statusBar.style.setProperty('--status-bar-text-color', color);
        statusBar.style.textShadow = shadow;
    },
    getColorBrightness(colorString) {
        const match = colorString && colorString.match(/rgba?\(([^)]+)\)/);
        if (!match) {
            return this.isDarkMode ? 32 : 245;
        }

        const parts = match[1].split(',').map(part => Number.parseFloat(part.trim()));
        if (parts.length < 3 || parts.some(value => Number.isNaN(value))) {
            return this.isDarkMode ? 32 : 245;
        }

        return (parts[0] * 0.299) + (parts[1] * 0.587) + (parts[2] * 0.114);
    },
    getFallbackStatusBarTextTone() {
        return this.isDarkMode ? 'light' : 'dark';
    },
    async ensureWallpaperAnalysisImage(url) {
        if (!url) {
            this.wallpaperAnalysisImage = null;
            this.wallpaperAnalysisUrl = null;
            this.wallpaperAnalysisPromise = null;
            return null;
        }

        if (this.wallpaperAnalysisImage && this.wallpaperAnalysisUrl === url) {
            return this.wallpaperAnalysisImage;
        }

        if (this.wallpaperAnalysisPromise && this.wallpaperAnalysisUrl === url) {
            return this.wallpaperAnalysisPromise;
        }

        this.wallpaperAnalysisUrl = url;
        this.wallpaperAnalysisPromise = new Promise((resolve) => {
            const done = (image) => {
                this.wallpaperAnalysisImage = image;
                this.wallpaperAnalysisPromise = null;
                resolve(image);
            };
            const fail = () => {
                this.wallpaperAnalysisImage = null;
                this.wallpaperAnalysisPromise = null;
                resolve(null);
            };

            // data: URL 不走 <img>：<img> 是文档资源，在 load 之前起跑会把 window.load
            // 拖到它解码完（实测一张几 MB 的上传壁纸在这里再拖约 330ms）。
            // 这条路径只需要像素：ImageBitmap 一样能 drawImage、一样有 width/height，
            // 而 fetch（含 data: URL）不占文档的 load。HTTP 壁纸仍走 <img>，
            // 因为只有 crossOrigin='anonymous' 才能把像素读进 canvas。
            if (/^data:/i.test(url)) {
                fetch(url)
                    .then((res) => res.blob())
                    .then((blob) => createImageBitmap(blob))
                    .then(done)
                    .catch(fail);
                return;
            }

            const image = new Image();
            image.crossOrigin = 'anonymous';
            image.onload = () => done(image);
            image.onerror = fail;

            image.src = url;
        });

        return this.wallpaperAnalysisPromise;
    },
    drawWallpaperPreviewToCanvas(context, viewportWidth, viewportHeight, image) {
        const fillMode = this.settings.wallpaperFill === true;
        const scale = fillMode
            ? Math.max(viewportWidth / image.width, viewportHeight / image.height)
            : Math.min(viewportWidth / image.width, viewportHeight / image.height);

        const drawWidth = image.width * scale;
        const drawHeight = image.height * scale;
        const drawX = (viewportWidth - drawWidth) / 2;
        const drawY = (viewportHeight - drawHeight) / 2;
        const wallpaperElement = this.wallpaperMain;
        const transformValue = wallpaperElement ? getComputedStyle(wallpaperElement).transform : 'none';

        context.save();
        context.clearRect(0, 0, viewportWidth, viewportHeight);

        if (transformValue && transformValue !== 'none') {
            const matrix = new DOMMatrixReadOnly(transformValue);
            context.translate(viewportWidth / 2, viewportHeight / 2);
            context.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
            context.translate(-viewportWidth / 2, -viewportHeight / 2);
        }

        context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
        context.restore();
    },
    getStatusBarSampleRect(viewportWidth, viewportHeight) {
        const statusBar = document.getElementById('status-bar');
        if (!statusBar) return null;

        // 只有时间墙的大时钟需要覆盖上部区域取样；信息流里已缩成顶部小钟。
        const inTimeWall = document.body.classList.contains('time-wall-mode')
            && !document.body.classList.contains('feed-mode');
        if (inTimeWall) {
            const sampleWidth = Math.max(320, viewportWidth * 0.5);
            const sampleHeight = Math.min(viewportHeight * 0.3, 280);
            return {
                x: Math.max(0, (viewportWidth - sampleWidth) / 2),
                y: 0,
                width: Math.min(sampleWidth, viewportWidth),
                height: Math.min(sampleHeight, viewportHeight)
            };
        }

        const rect = statusBar.getBoundingClientRect();
        const sampleWidth = Math.max(120, rect.width * 0.42);
        const sampleHeight = Math.max(18, rect.height * 0.7);
        const sampleX = Math.max(0, (viewportWidth - sampleWidth) / 2);
        const sampleY = Math.max(0, rect.top);

        return {
            x: sampleX,
            y: sampleY,
            width: Math.min(sampleWidth, viewportWidth - sampleX),
            height: Math.min(sampleHeight, viewportHeight - sampleY)
        };
    },
    getAverageBrightnessFromCanvas(context, sampleRect) {
        try {
            const imageData = context.getImageData(
                Math.round(sampleRect.x),
                Math.round(sampleRect.y),
                Math.max(1, Math.round(sampleRect.width)),
                Math.max(1, Math.round(sampleRect.height))
            );

            let totalBrightness = 0;
            let pixelCount = 0;
            const { data } = imageData;

            for (let index = 0; index < data.length; index += 4) {
                const alpha = data[index + 3] / 255;
                if (alpha <= 0) continue;

                totalBrightness += (
                    (data[index] * 0.299) +
                    (data[index + 1] * 0.587) +
                    (data[index + 2] * 0.114)
                ) * alpha;
                pixelCount += alpha;
            }

            if (pixelCount === 0) {
                return null;
            }

            return totalBrightness / pixelCount;
        } catch (error) {
            return null;
        }
    },
    /**
     * 取取样区域的平均颜色，作为高级视觉效果下时钟的「高斯模糊配色」。
     */
    getAverageColorFromCanvas(context, sampleRect) {
        try {
            const imageData = context.getImageData(
                Math.round(sampleRect.x),
                Math.round(sampleRect.y),
                Math.max(1, Math.round(sampleRect.width)),
                Math.max(1, Math.round(sampleRect.height))
            );

            let red = 0;
            let green = 0;
            let blue = 0;
            let pixelCount = 0;
            const { data } = imageData;

            for (let index = 0; index < data.length; index += 4) {
                const alpha = data[index + 3] / 255;
                if (alpha <= 0) continue;

                red += data[index] * alpha;
                green += data[index + 1] * alpha;
                blue += data[index + 2] * alpha;
                pixelCount += alpha;
            }

            if (pixelCount === 0) {
                return null;
            }

            return {
                r: red / pixelCount,
                g: green / pixelCount,
                b: blue / pixelCount
            };
        } catch (error) {
            return null;
        }
    },
    /**
     * 按壁纸在指定区域的亮度给出文字明暗，并附带平均颜色（高斯模糊配色用）。
     * 无法取样时返回 null。
     */
    async computeWallpaperTextTone(sampleRect) {
        const wallpaperUrl = this.getWallpaperUrl();
        const hasWallpaper = !!(wallpaperUrl && this.wallpaperMain && this.wallpaperMain.classList.contains('active'));

        if (!hasWallpaper || !sampleRect) {
            return null;
        }

        const analysisUrl = wallpaperUrl;
        const image = await this.ensureWallpaperAnalysisImage(analysisUrl);
        if (!image || analysisUrl !== this.getWallpaperUrl()) {
            return null;
        }

        const viewportWidth = Math.max(1, window.innerWidth);
        const viewportHeight = Math.max(1, window.innerHeight);
        const canvas = document.createElement('canvas');
        canvas.width = viewportWidth;
        canvas.height = viewportHeight;

        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) {
            return null;
        }

        this.drawWallpaperPreviewToCanvas(context, viewportWidth, viewportHeight, image);

        const brightness = this.getAverageBrightnessFromCanvas(context, sampleRect);
        if (brightness === null) {
            return null;
        }

        return {
            mode: brightness >= 160 ? 'dark' : 'light',
            brightness,
            color: this.getAverageColorFromCanvas(context, sampleRect)
        };
    },
    /**
     * 高级视觉效果下，时钟文字改用取样区域的平均色（近似高斯模糊后的配色），
     * 按背景明暗压到可读的亮度，保留色相。
     */
    applyBlurredClockColor(color, brightness) {
        const statusBar = document.getElementById('status-bar');
        if (!statusBar || !color) return;

        const red = color.r / 255;
        const green = color.g / 255;
        const blue = color.b / 255;
        const max = Math.max(red, green, blue);
        const min = Math.min(red, green, blue);
        const lightness = (max + min) / 2;
        let hue = 0;
        let saturation = 0;

        if (max !== min) {
            const delta = max - min;
            saturation = lightness > 0.5
                ? delta / (2 - max - min)
                : delta / (max + min);

            if (max === red) {
                hue = ((green - blue) / delta + (green < blue ? 6 : 0));
            } else if (max === green) {
                hue = ((blue - red) / delta + 2);
            } else {
                hue = ((red - green) / delta + 4);
            }
            hue *= 60;
        }

        const targetLightness = brightness >= 160 ? 0.34 : 0.82;
        const softSaturation = Math.min(0.8, Math.max(0.5, saturation));
        const colorString = `hsl(${Math.round(hue)}, ${Math.round(softSaturation * 100)}%, ${Math.round(targetLightness * 100)}%)`;
        statusBar.style.setProperty('--status-bar-text-color', colorString);
    },
    async updateStatusBarTextContrast() {
        const statusBar = document.getElementById('status-bar');
        if (!statusBar) return;

        const sampleRect = this.getStatusBarSampleRect(
            Math.max(1, window.innerWidth),
            Math.max(1, window.innerHeight)
        );
        const result = await this.computeWallpaperTextTone(sampleRect);
        this.applyStatusBarTextTone(result ? result.mode : this.getFallbackStatusBarTextTone());

        // 高级视觉效果下，时间墙的时钟文字改用取样区域的平均色（近似高斯模糊后的配色）。
        // 信息流里时钟已经缩小，不再套用模糊配色，避免小字发虚。
        const useBlurPalette = document.body.classList.contains('time-wall-mode')
            && !document.body.classList.contains('feed-mode')
            && this.settings.enhancedDisplay
            && result
            && result.color;
        statusBar.classList.toggle('clock-blur-palette', !!useBlurPalette);
        if (useBlurPalette) {
            this.applyBlurredClockColor(result.color, result.brightness);
        }
    },
    startStatusBarTimer() {
        this.stopStatusBarTimer();

        // 状态栏关着时也允许在时间墙/信息流里走时，这块钟此时就是时钟本身。
        if (!this.settings.statusBarEnabled && this.viewStage < 2) {
            return;
        }

        const scheduleNextTick = () => {
            const now = new Date();
            const showSeconds = this.settings.showStatusBarSeconds;
            let delay = showSeconds
                ? 1000 - now.getMilliseconds()
                : ((60 - now.getSeconds()) * 1000) - now.getMilliseconds();

            if (delay <= 0) {
                delay = showSeconds ? 1000 : 60000;
            }

            this.statusBarTimer = setTimeout(() => {
                this.updateStatusBarText();
                scheduleNextTick();
            }, delay);
        };

        this.updateStatusBarText();
        scheduleNextTick();
    },
    applyStatusBarSettings() {
        const statusBar = document.getElementById('status-bar');
        if (!statusBar) return;

        // 时间墙/信息流里状态栏本身就是时钟，即使「状态栏」开关关着也必须显示。
        const inExtendedStage = this.viewStage >= 2;
        const shouldShow = this.settings.statusBarEnabled || inExtendedStage;

        if (!shouldShow) {
            statusBar.classList.remove('visible');
            this.stopStatusBarTimer();
            document.documentElement.style.setProperty('--status-bar-offset', '10px');
            return;
        }

        statusBar.classList.add('visible');
        document.documentElement.style.setProperty(
            '--status-bar-offset',
            this.settings.statusBarEnabled ? '44px' : '10px'
        );

        if (!this.settings.statusBarEnabled) {
            // 仅因时间墙而显示：由 TimeWallMixin 负责启动计时与取色。
            return;
        }

        this.startStatusBarTimer();
        this.updateStatusBarTextContrast();
    },
};

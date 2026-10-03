// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

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
    },
    formatStatusBarDateTime(date) {
        const pad = (value) => String(value).padStart(2, '0');
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());

        if (this.settings.showStatusBarSeconds) {
            return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
        }

        return `${year}年${month}月${day}日 ${hours}:${minutes}`;
    },
    updateStatusBarText() {
        const statusBar = document.getElementById('status-bar');
        if (!statusBar) return;

        statusBar.textContent = this.formatStatusBarDateTime(new Date());
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
            const image = new Image();
            image.crossOrigin = 'anonymous';

            image.onload = () => {
                this.wallpaperAnalysisImage = image;
                this.wallpaperAnalysisPromise = null;
                resolve(image);
            };

            image.onerror = () => {
                this.wallpaperAnalysisImage = null;
                this.wallpaperAnalysisPromise = null;
                resolve(null);
            };

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
    async updateStatusBarTextContrast() {
        const statusBar = document.getElementById('status-bar');
        if (!statusBar) return;

        const wallpaperUrl = this.getWallpaperUrl();
        const hasWallpaper = !!(wallpaperUrl && this.wallpaperMain && this.wallpaperMain.classList.contains('active'));

        if (!hasWallpaper) {
            this.applyStatusBarTextTone(this.getFallbackStatusBarTextTone());
            return;
        }

        const analysisUrl = wallpaperUrl;
        const image = await this.ensureWallpaperAnalysisImage(analysisUrl);
        if (!image || analysisUrl !== this.getWallpaperUrl()) {
            this.applyStatusBarTextTone(this.getFallbackStatusBarTextTone());
            return;
        }

        const viewportWidth = Math.max(1, window.innerWidth);
        const viewportHeight = Math.max(1, window.innerHeight);
        const canvas = document.createElement('canvas');
        canvas.width = viewportWidth;
        canvas.height = viewportHeight;

        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) {
            this.applyStatusBarTextTone(this.getFallbackStatusBarTextTone());
            return;
        }

        this.drawWallpaperPreviewToCanvas(context, viewportWidth, viewportHeight, image);

        const sampleRect = this.getStatusBarSampleRect(viewportWidth, viewportHeight);
        if (!sampleRect) {
            this.applyStatusBarTextTone(this.getFallbackStatusBarTextTone());
            return;
        }

        const brightness = this.getAverageBrightnessFromCanvas(context, sampleRect);
        if (brightness === null) {
            this.applyStatusBarTextTone(this.getFallbackStatusBarTextTone());
            return;
        }

        this.applyStatusBarTextTone(brightness >= 160 ? 'dark' : 'light');
    },
    startStatusBarTimer() {
        this.stopStatusBarTimer();

        const shouldShow = this.settings.statusBarEnabled;
        if (!shouldShow) {
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

        const shouldShow = this.settings.statusBarEnabled;

        if (!shouldShow) {
            statusBar.classList.remove('visible');
            statusBar.textContent = '';
            this.stopStatusBarTimer();
            document.documentElement.style.setProperty('--status-bar-offset', '10px');
            return;
        }

        statusBar.classList.add('visible');
        document.documentElement.style.setProperty('--status-bar-offset', '44px');
        this.startStatusBarTimer();
        this.updateStatusBarTextContrast();
    },
};

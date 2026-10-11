// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

export const NotificationsMixin = {
    getNotificationColors() {
        const colorConfig = this.getColorConfig();
        const scheme = this.settings.colorScheme || 'green';

        function rgbaEffectiveLuminance(rgbaStr, pageBgLum) {
            var m = rgbaStr.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
            if (!m) return null;
            var r = parseFloat(m[1]) / 255, g = parseFloat(m[2]) / 255, b = parseFloat(m[3]) / 255, a = parseFloat(m[4]);
            function lin(v) { return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
            var cLum = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
            return cLum * a + pageBgLum * (1 - a);
        }

        if (this.settings.dynamicBlur) {
            if (scheme === 'green') {
                const bgColor = this.isDarkMode ? 'rgba(48, 49, 52, 0.85)' : 'rgba(241, 243, 244, 0.85)';
                const textColor = this.isDarkMode ? colorConfig.notificationTextDark : colorConfig.notificationText;
                const borderColor = this.isDarkMode ? 'rgba(95, 99, 104, 0.5)' : 'rgba(223, 225, 229, 0.6)';
                return { bg: bgColor, text: textColor, border: borderColor, blur: true };
            }
            if (scheme === 'black-white') {
                const isDark = this.isDarkMode;
                const bgColor = isDark ? colorConfig.notificationBgDark : colorConfig.notificationBg;
                const textColor = isDark ? colorConfig.notificationTextDark : colorConfig.notificationText;
                const borderColor = isDark ? colorConfig.notificationBorderDark : colorConfig.notificationBorder;
                return { bg: bgColor, text: textColor, border: borderColor, blur: true };
            }
            if (scheme === 'custom') {
                const bgColor = this.isDarkMode ? colorConfig.notificationBgDark : colorConfig.notificationBg;
                const textColor = this.isDarkMode ? colorConfig.notificationTextDark : colorConfig.notificationText;
                return { bg: bgColor, text: textColor, border: colorConfig.notificationBorder, blur: true };
            }
            // 蓝色主题及其他
            const bgColor = this.isDarkMode ? colorConfig.notificationBgDark : colorConfig.notificationBg;
            const textColorDark = colorConfig.notificationTextDark || '#ffffff';
            const textColorLight = colorConfig.notificationText || '#ffffff';
            // 浅色模式下，若背景有效亮度较高（偏亮），自动切换为深色文字确保对比度
            let textColor = textColorDark;
            if (!this.isDarkMode) {
                var effLum = rgbaEffectiveLuminance(bgColor, 1.0);
                textColor = effLum !== null && effLum > 0.45 ? textColorLight : textColorDark;
            }
            return { bg: bgColor, text: textColor, border: colorConfig.notificationBorder, blur: true };
        }

        // 非高级视觉效果：使用表面色
        return { bg: 'var(--surface-color)', text: 'var(--text-color)', border: 'var(--border-color)', blur: false };
    },
    // 提示框里的文字视觉上并不居中：line-height 的半行距对齐的是字体的内容区
    // （ascent + descent），而字体的 ascent/descent 本就不对称，实际画出来的墨迹
    // 因此整体偏上。偏移量随字体变（本次量到 0.8~1.6px），在 45px 高的胶囊里肉眼可辨。
    // 这里量出真实偏移，交给调用方用不对称内边距压回去。
    getNotificationInkOffset(notification) {
        // 基线探针：零尺寸 inline-block 的底边正好压在基线上（vertical-align: baseline），
        // 这是 DOM 里唯一能直接读出基线的办法。首尾各放一个，多行文案也能框住整块墨迹
        // （单行时两者重合）。只测位置、不参与布局：宽高都是 0，不会影响居中和换行。
        const probeStyle = 'display:inline-block;width:0;height:0;vertical-align:baseline;';
        const head = document.createElement('span');
        const tail = document.createElement('span');
        head.style.cssText = probeStyle;
        tail.style.cssText = probeStyle;
        notification.insertBefore(head, notification.firstChild);
        notification.appendChild(tail);

        const rect = notification.getBoundingClientRect();
        const firstBaseline = head.getBoundingClientRect().bottom;
        const lastBaseline = tail.getBoundingClientRect().bottom;
        head.remove();
        tail.remove();

        const computed = getComputedStyle(notification);
        const ink = this.measureTextInk(
            notification.textContent,
            computed.fontFamily,
            parseFloat(computed.fontSize) || 14
        );
        if (!ink) return 0;

        const inkCenter = (firstBaseline - ink.ascent + lastBaseline + ink.descent) / 2;
        const boxCenter = rect.top + rect.height / 2;
        // 限幅：万一量出离谱的值，也不至于把提示框撑歪
        return Math.max(-4, Math.min(4, inkCenter - boxCenter));
    },
    // 量一段文字"墨迹"（真正落笔的部分）相对基线的上下沿，单位是 CSS px
    measureTextInk(text, fontFamily, fontSize) {
        try {
            // 光栅化比 measureText 准：actualBoundingBoxAscent/Descent 被 Chrome 量化成
            // 整数，中文字体上能差 1px 以上；扫 alpha 通道得到的是真实落笔范围
            // （实测与逐像素量截图的结果相差 0.02px）。放大 200px 再画，1px 的量化误差
            // 摊回 14px 只剩 0.07px。
            const big = 200;
            const scale = big / fontSize;
            // 墨迹上下沿由字形决定，取开头一小段就够，长文案不必画满整张画布
            const sample = String(text || '').slice(0, 16);
            if (!sample) return null;

            const canvas = document.createElement('canvas');
            const measureCtx = canvas.getContext('2d');
            measureCtx.font = `${big}px ${fontFamily}`;
            const width = Math.ceil(measureCtx.measureText(sample).width) + 40;
            const height = 500;
            const baseline = 350;
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.font = `${big}px ${fontFamily}`;
            ctx.textBaseline = 'alphabetic';
            ctx.fillStyle = '#000000';
            ctx.fillText(sample, 20, baseline);

            const data = ctx.getImageData(0, 0, width, height).data;
            let top = -1;
            let bottom = -1;
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    // alpha > 100 ≈ 四成覆盖率，与肉眼判定"有墨"的界线接近
                    if (data[(y * width + x) * 4 + 3] > 100) {
                        if (top < 0) top = y;
                        bottom = y;
                        break;
                    }
                }
            }
            if (top < 0) return null;
            return { ascent: (baseline - top) / scale, descent: (bottom + 1 - baseline) / scale };
        } catch (_) {
            // 画布不可用（取不到像素等）时不修正，退回对称内边距
            return null;
        }
    },
    showNotification(message) {
        // 隐藏弹窗开启时，仅设置在设置页面内仍弹出
        if (this.settings && this.settings.hideNotifications) {
            const modal = document.getElementById('settings-modal');
            if (!modal || !modal.classList.contains('show')) {
                return;
            }
        }

        // 移除已存在的通知
        const existingNotification = document.getElementById('ooo-interface-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.id = 'ooo-interface-notification';

        // 获取配色（与右键菜单一致：背景/描边/文字）
        const colors = this.getNotificationColors();
        const blurStyle = colors.blur
            ? 'backdrop-filter: blur(40px) saturate(1.4); -webkit-backdrop-filter: blur(40px) saturate(1.4);'
            : '';

        // 居中底部：水平居中靠 left: 50% + translateX(-50%)，所以这个 -50% 必须并进出/入场
        // 的 transform 里，否则动画的 transform 会覆盖掉定位用的位移，提示框会甩到屏幕右半边。
        // 竖向贴底 20px——主页铭牌（bottom: 32px）和壁纸模式的引擎按钮都占着底部居中，
        // 提示框既然要贴底就必然压到它们身上，由 styles.css 里那条 :has() 规则让它们先淡出。
        // transition 先留空：下面量完墨迹要改内边距，过渡开着的话这不到 1px 的修正
        // 也会走一遍 350ms 动画，提示框刚露头时文字还在慢慢往下滑。
        notification.style.cssText = `
            position: fixed;
            left: 50%;
            bottom: 20px;
            /* width: max-content 不能省：left: 50% 且宽度 auto 时，可用宽度只剩视口右半
               （390px 屏上只有 195px），长文案会被压成一条又高又窄的竖条。给出 max-content
               让宽度先按内容算，再由 max-width 夹紧并在必要时折行。 */
            width: max-content;
            max-width: calc(100% - 40px);
            box-sizing: border-box;
            background: ${colors.bg};
            color: ${colors.text};
            padding: 12px 20px;
            border-radius: 999px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
            z-index: 1001;
            border: 1px solid ${colors.border};
            font-family: inherit;
            font-size: 14px;
            line-height: 1.5;
            text-align: center;
            ${blurStyle}
            transition: none;
            opacity: 0;
            transform: translateX(-50%);
            pointer-events: none;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // 文字纵向修正：把墨迹（而不是字体的内容区）摆到胶囊正中。上下内边距之和不变，
        // 胶囊高度和贴底位置都不动，动的只是文字。必须赶在摆入场姿势之前量——入场动画
        // 带 translateY(12px)，先摆姿势会把量到的中心整体带偏 12px。
        const inkOffset = this.getNotificationInkOffset(notification);
        if (inkOffset) {
            notification.style.paddingTop = `${12 - inkOffset}px`;
            notification.style.paddingBottom = `${12 + inkOffset}px`;
        }

        // 入场初态：自下而上浮入。先强制一次重排把修正后的几何定下来，再打开过渡，
        // 否则修正内边距这件事本身也会被当成一次过渡的起点。
        notification.style.transform = 'translateX(-50%) translateY(12px) scale(0.96)';
        void notification.offsetHeight;
        notification.style.transition = 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(-50%) translateY(0) scale(1)';
        }, 10);

        // 3秒后自动隐藏
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(12px) scale(0.96)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 350);
        }, 3000);
    },
    showInfoPopup() {
        // 禁止提示开启时不弹出
        if (this.isHideInfoPopupActive()) return;

        // 同步 UAC 连接状态
        try { this.backendConnected = localStorage.getItem('oooBackendConnected') === 'true'; } catch (_) {}
        if (this.infoPopupOpen) return;
        this.infoPopupOpen = true;

        const popup = document.createElement('div');
        popup.className = 'ooo-info-popup';
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #ffffff;
            padding: 30px;
            z-index: 10000;
            max-width: 400px;
            font-family: 'Courier New', monospace;
        `;

        // 创建弹窗内容
        const content = document.createElement('div');
        content.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 15px;
        `;

        // 版本信息
        const version = document.createElement('p');
        version.textContent = `[component.over]${this.currentVersion}`;
        version.style.cssText = `
            font-size: 14px;
            color: #000000;
            margin: 0;
            word-wrap: break-word;
        `;

        // 操作系统
        const os = document.createElement('p');
        const osName = this.getOperatingSystem();
        os.textContent = `[devtype]${osName}`;
        os.style.cssText = `
            font-size: 14px;
            color: #000000;
            margin: 0;
            word-wrap: break-word;
        `;

        // 版本标志
        const beta = document.createElement('p');
        beta.textContent = `[package.flag]${PACKAGE_FLAG}`;
        beta.style.cssText = `
            font-size: 14px;
            color: #000000;
            margin: 0;
            word-wrap: break-word;
        `;

        // 包ID
        const packageId = document.createElement('p');
        packageId.textContent = `[package.id]${PACKAGE_ID}`;
        packageId.style.cssText = `
            font-size: 14px;
            color: #000000;
            margin: 0;
            word-wrap: break-word;
        `;

        // 后端连接状态
        const uac = document.createElement('p');
        uac.textContent = `[UAC]${this.getMemoryUsage('uac')}`;
        uac.style.cssText = `
            font-size: 14px;
            color: #000000;
            margin: 0;
            word-wrap: break-word;
        `;

        // 组装弹窗
        content.appendChild(version);
        content.appendChild(os);
        content.appendChild(beta);
        content.appendChild(packageId);
        content.appendChild(uac);
        popup.appendChild(content);

        // 添加到页面
        document.body.appendChild(popup);

        // ESC键关闭弹窗（带 parentNode 检查避免重复移除报错，并及时注销监听器避免泄漏）
        const closePopup = () => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
            document.removeEventListener('keydown', handleEsc);
            popup.removeEventListener('click', closePopup);
            this.infoPopupOpen = false;
        };

        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                closePopup();
            }
        };
        document.addEventListener('keydown', handleEsc);

        // 点击弹窗也可关闭，避免弹窗长期驻留时监听器泄漏
        popup.addEventListener('click', closePopup);
    },
    showShortcutsHint() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        const box = document.createElement('div');
        box.style.cssText = `
            background: var(--background-color);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 24px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 24px 48px rgba(0,0,0,0.2);
            font-family: inherit;
        `;

        const title = document.createElement('div');
        title.textContent = '快捷键说明';
        title.style.cssText = `
            font-size: 16px;
            font-weight: 500;
            color: var(--text-color);
            letter-spacing: 0.0125em;
            margin-bottom: 16px;
        `;

        box.appendChild(title);

        const items = [
            { key: 'Alt + O', desc: '激活 OOOInterface 扩展程序' },
            { key: 'Tab', desc: '快速聚焦到搜索框' },
            { key: 'Tab（长按）', desc: '打开快捷轮盘，移动鼠标或方向键选择（斜向按两键）' },
            { key: 'Ctrl + ,', desc: '打开设置页面' },
            { key: 'Ctrl + H', desc: '展开 / 收起搜索历史框' },
            { key: 'Ctrl + S（设置页面内）', desc: '应用当前设置' }
        ];

        items.forEach((item, i) => {
            const row = document.createElement('div');
            row.style.cssText = `
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px 12px;
                background: var(--surface-color);
                border-radius: 12px;
                ${i < items.length - 1 ? 'margin-bottom: 8px;' : ''}
            `;

            const keySpan = document.createElement('span');
            keySpan.textContent = item.key;
            keySpan.style.cssText = `
                display: inline-block;
                background: var(--background-color);
                padding: 4px 12px;
                border-radius: 8px;
                font-size: 13px;
                font-weight: 600;
                color: var(--text-color);
                white-space: nowrap;
                border: 1px solid var(--border-color);
                min-width: 100px;
                text-align: center;
            `;

            const descSpan = document.createElement('span');
            descSpan.textContent = item.desc;
            descSpan.style.cssText = `
                font-size: 14px;
                color: var(--text-color);
                flex: 1;
                line-height: 1.5;
            `;

            row.appendChild(keySpan);
            row.appendChild(descSpan);
            box.appendChild(row);
        });

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.style.cssText = `
            margin-top: 16px;
            padding: 8px 24px;
            background: var(--surface-color);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            font-family: inherit;
            cursor: pointer;
            transition: all 0.2s ease;
            display: block;
            margin-left: auto;
        `;
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = 'var(--surface-variant)';
            closeBtn.style.borderColor = 'var(--primary-color)';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'var(--surface-color)';
            closeBtn.style.borderColor = 'var(--border-color)';
        });
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.removeEventListener('keydown', handleEsc);
        });

        box.appendChild(closeBtn);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                if (overlay.parentNode) {
                    document.body.removeChild(overlay);
                }
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
                document.removeEventListener('keydown', handleEsc);
            }
        });
    },
};

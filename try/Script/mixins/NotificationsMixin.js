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

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors.bg};
            color: ${colors.text};
            padding: 12px 20px;
            border-radius: 16px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
            z-index: 1001;
            border: 1px solid ${colors.border};
            font-family: inherit;
            font-size: 14px;
            line-height: 1.5;
            ${blurStyle}
            transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
            transform: translateY(-12px) scale(0.96);
            pointer-events: none;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // 显示动画
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0) scale(1)';
        }, 10);

        // 3秒后自动隐藏
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-12px) scale(0.96)';
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

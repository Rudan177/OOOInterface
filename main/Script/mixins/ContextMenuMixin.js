// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

export const ContextMenuMixin = {
    initContextMenu() {
        this.contextMenu = document.getElementById('context-menu');
        this.contextMenuItems = document.querySelectorAll('.context-menu-item');
        this.updateContextMenuIcons();
        this.initContextMenuCustomize();
    },
    updateContextMenuIcons() {
        // 更新所有可切换菜单项的图标
        const toggleMap = {
            'search-history-toggle': () => this.settings.searchHistory ? 'check_box' : 'check_box_outline_blank',
            'search-suggestions-toggle': () => this.settings.searchSuggestions ? 'check_box' : 'check_box_outline_blank',
            'wallpaper-toggle': () => this.settings.persistentWallpaper ? 'check_box' : 'check_box_outline_blank',
            'enhanced-display-toggle': () => this.settings.enhancedDisplay ? 'check_box' : 'check_box_outline_blank',
            'engine-lock-toggle': () => this.settings.engineLocked ? 'check_box' : 'check_box_outline_blank',
            'hide-notifications-toggle': () => this.settings.hideNotifications ? 'check_box' : 'check_box_outline_blank',
            'hide-info-popup-toggle': () => this.settings.hideInfoPopup.enabled ? 'check_box' : 'check_box_outline_blank'
        };
        Object.keys(toggleMap).forEach(action => {
            const el = document.querySelector(`[data-action="${action}"] .md3-icon`);
            if (el) el.textContent = toggleMap[action]();
        });
    },
    initContextMenuCustomize() {
        const btn = document.getElementById('context-menu-customize-btn');
        const panel = document.getElementById('context-menu-customize-panel');
        if (!btn || !panel) return;

        // 切换面板显示
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.settings.contextMenuStyle === 'minimal') return;
            const isOpen = !panel.classList.contains('select-hide');
            panel.classList.toggle('select-hide');
            this.syncCustomizePanelUI();
        });

        // 面板内选项点击
        panel.addEventListener('click', (e) => {
            e.stopPropagation();
            const item = e.target.closest('.customize-item');
            if (!item || item.classList.contains('disabled')) return;
            const key = item.dataset.key;
            const idx = this.settings.contextMenuCustomItems.indexOf(key);
            if (idx >= 0) {
                // 取消选择
                this.settings.contextMenuCustomItems.splice(idx, 1);
            } else {
                // 选择（最多3个）
                if (this.settings.contextMenuCustomItems.length >= 3) return;
                this.settings.contextMenuCustomItems.push(key);
            }
            this.syncCustomizePanelUI();
            this.saveSettings();
        });

        // 点击外部关闭面板
        document.addEventListener('click', (e) => {
            if (!btn.contains(e.target) && !panel.contains(e.target)) {
                panel.classList.add('select-hide');
            }
        });
    },
    syncCustomizePanelUI() {
        const panel = document.getElementById('context-menu-customize-panel');
        const btn = document.getElementById('context-menu-customize-btn');
        if (!panel) return;

        const items = panel.querySelectorAll('.customize-item');
        const selected = this.settings.contextMenuCustomItems;
        const atMax = selected.length >= 3;

        items.forEach(item => {
            const key = item.dataset.key;
            const isSelected = selected.includes(key);
            item.classList.toggle('selected', isSelected);
            item.classList.toggle('disabled', !isSelected && atMax);
            const icon = item.querySelector('.checkbox-icon');
            if (icon) {
                icon.textContent = isSelected ? 'check_box' : 'check_box_outline_blank';
            }
        });

        // 更新计数
        const countEl = document.getElementById('customize-selected-count');
        if (countEl) {
            countEl.textContent = `${selected.length}/3 已选择`;
        }

        // 极简模式下禁用
        const isMinimal = this.settings.contextMenuStyle === 'minimal';
        if (btn) btn.disabled = isMinimal;
        if (isMinimal) {
            panel.classList.add('select-hide');
        }
    },
    applyContextMenuCustomItems() {
        const toggleActions = [
            'search-history-toggle',
            'search-suggestions-toggle',
            'wallpaper-toggle',
            'enhanced-display-toggle',
            'engine-lock-toggle',
            'hide-notifications-toggle',
            'hide-info-popup-toggle'
        ];
        const selected = this.settings.contextMenuCustomItems;
        const isMinimal = this.settings.contextMenuStyle === 'minimal';

        toggleActions.forEach(action => {
            const el = document.querySelector(`.context-menu-item[data-action="${action}"]`);
            if (el) {
                if (isMinimal || !selected.includes(action)) {
                    el.style.display = 'none';
                } else {
                    el.style.display = '';
                }
            }
        });

        // 同步更新面板UI
        this.syncCustomizePanelUI();
    },
    showContextMenu(e) {
        if (!this.contextMenu) return;

        // 应用右键菜单样式（compact/minimal 类）
        this.applyContextMenuStyle();

        // 根据自定义设置显示/隐藏菜单项
        this.applyContextMenuCustomItems();

        // 先设置位置，再显示菜单
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // 计算菜单位置，确保在视口内
        let left = e.clientX;
        let top = e.clientY;

        // 临时显示菜单以获取尺寸
        this.contextMenu.style.display = 'block';
        const rect = this.contextMenu.getBoundingClientRect();

        if (left + rect.width > viewportWidth) {
            left = viewportWidth - rect.width - 10;
        }

        // 根据鼠标位置决定菜单展开方向
        const screenMidpoint = viewportHeight / 2;
        if (e.clientY < screenMidpoint) {
            // 鼠标在屏幕上半部分，菜单最高点在鼠标位置
            top = e.clientY;
        } else {
            // 鼠标在屏幕下半部分，菜单最低点在鼠标位置
            top = e.clientY - rect.height;
        }

        // 确保菜单不会超出视口
        if (top < 0) {
            top = 10;
        }
        if (top + rect.height > viewportHeight) {
            top = viewportHeight - rect.height - 10;
        }

        this.contextMenu.style.left = `${left}px`;
        this.contextMenu.style.top = `${top}px`;

        // 移除 hiding 类
        this.contextMenu.classList.remove('hiding');

        // 根据dynamicBlur设置决定是否添加动画
        if (this.settings.dynamicBlur) {
            // 移除no-animation类，启用动画
            this.contextMenu.classList.remove('no-animation');
            // 显示菜单并触发动画
            setTimeout(() => {
                this.contextMenu.classList.add('show');
            }, 10);
        } else {
            // 添加no-animation类，禁用动画
            this.contextMenu.classList.add('no-animation');
            // 直接显示菜单，无动画
            this.contextMenu.classList.add('show');
        }
    },
    hideContextMenu() {
        if (this.contextMenu && this.contextMenu.classList.contains('show')) {
            // 根据dynamicBlur设置决定是否添加动画
            if (!this.settings.dynamicBlur) {
                // 添加no-animation类，禁用动画
                this.contextMenu.classList.add('no-animation');
            }

            this.contextMenu.classList.remove('show');
            this.contextMenu.classList.add('hiding');

            // 根据dynamicBlur设置决定是否等待动画完成
            if (this.settings.dynamicBlur) {
                // 等待动画完成后再隐藏
                setTimeout(() => {
                    this.contextMenu.classList.remove('hiding');
                    this.contextMenu.style.display = 'none';
                }, 200);
            } else {
                // 直接隐藏，无动画
                this.contextMenu.classList.remove('hiding');
                this.contextMenu.style.display = 'none';
            }
        }
    },
    handleContextMenuAction(action) {
        switch (action) {
            case 'copy':
                this.copySearchContent();
                break;
            case 'paste':
                this.pasteToSearch();
                break;
            case 'settings':
                this.openSettings('context');
                break;
            case 'refresh':
                location.reload();
                break;
            case 'search-history-toggle':
                this.toggleSearchHistorySetting();
                break;
            case 'search-suggestions-toggle':
                this.toggleSearchSuggestionsSetting();
                break;
            case 'wallpaper-toggle':
                this.toggleWallpaperSetting();
                break;
            case 'enhanced-display-toggle':
                this.toggleEnhancedDisplaySetting();
                break;
            case 'engine-lock-toggle':
                this.toggleEngineLockSetting();
                break;
            case 'hide-notifications-toggle':
                this.toggleHideNotificationsSetting();
                break;
            case 'hide-info-popup-toggle':
                this.toggleHideInfoPopupSetting();
                break;
            case 'about':
                window.location.href = 'about/about.html';
                break;
            case 'feedback':
                window.location.href = 'FB/fb.html';
                break;
        }
    },
    applyContextMenuStyle() {
        const contextMenuGrid = document.querySelector('.context-menu-grid');
        if (!contextMenuGrid) return;

        // 移除所有样式类
        contextMenuGrid.classList.remove('compact', 'minimal');

        // 添加选中的样式类
        if (this.settings.contextMenuStyle === 'compact') {
            contextMenuGrid.classList.add('compact');
        } else if (this.settings.contextMenuStyle === 'minimal') {
            contextMenuGrid.classList.add('minimal');
        }

        // 根据Logo选择更新右键菜单配色
        this.updateContextMenuColors();

        // 同步自定义面板状态（极简模式禁用）
        this.syncCustomizePanelUI();
    },
    updateContextMenuColors() {
        const contextMenu = document.getElementById('context-menu');
        if (!contextMenu) return;

        const menuItems = document.querySelectorAll('.context-menu-item');
        const colorConfig = this.getColorConfig();
        const isDark = this.isDarkMode;

        let hoverColor, textColor;
        if (this.settings.dynamicBlur) {
            hoverColor = isDark ? colorConfig.accentDark : colorConfig.accent;
            // 黑白色在深色模式下：白色背景（accentDark=#ffffff）+ #d0d0d0 灰色文字 = 对比度 1.54:1 不可读
            // 改为黑色文字，对比度 21:1；其他配色保持原来的 contextMenuTextColorDark 不变
            if (this.settings.colorScheme === 'black-white' && isDark) {
                textColor = '#000000';
            } else {
                textColor = isDark ? colorConfig.contextMenuTextColorDark : colorConfig.contextMenuTextColor;
            }
        } else {
            hoverColor = isDark ? colorConfig.contextMenuHoverDark : colorConfig.contextMenuHover;
            textColor = isDark ? colorConfig.contextMenuTextColorDark : colorConfig.contextMenuTextColor;
        }

        contextMenu.style.setProperty('--context-menu-color', hoverColor);
        contextMenu.style.setProperty('--context-menu-text-color', textColor);
        menuItems.forEach(item => {
            item.style.setProperty('--context-menu-color', hoverColor);
            item.style.setProperty('--context-menu-text-color', textColor);
        });
    },
backToContextMenuStyleView (rightPanelUpper) {
    this._doBackToContextMenuStyleView(rightPanelUpper);
},
_doBackToContextMenuStyleView (rightPanelUpper) {
    delete rightPanelUpper.dataset.customizeEntered;
    const items = document.getElementById('context-menu-style-items');
    if (!items) return;
    const selected = document.getElementById('context-menu-style-selected');
    const hiddenSelect = document.getElementById('context-menu-style');
    if (!selected || !hiddenSelect) return;
    this.showSettingsMenuInRightPanel(items, selected, hiddenSelect, true);
},
renderContextMenuCustomizeView (rightPanelUpper) {
    const self = this;

    rightPanelUpper.innerHTML = '';
    rightPanelUpper.dataset.subView = 'customize-items';

    const isFirstEnter = !rightPanelUpper.dataset.customizeEntered;
    if (isFirstEnter) {
        rightPanelUpper.dataset.customizeEntered = 'true';
    }

    const container = document.createElement('div');
    container.className = 'settings-menu-container' + (isFirstEnter ? ' slide-in-right' : '');

    const title = document.createElement('div');
    title.style.cssText = 'font-size:14px;font-weight:600;color:var(--text-color);margin-bottom:12px;';
    title.textContent = '自定义菜单项 (' + self.settings.contextMenuCustomItems.length + '/3)';
    container.appendChild(title);

    const itemsList = document.createElement('div');
    itemsList.className = 'settings-menu-options';

    const allItems = [
        { key: 'search-history-toggle', label: '搜索历史' },
        { key: 'search-suggestions-toggle', label: '热搜词建议' },
        { key: 'wallpaper-toggle', label: '壁纸常显示' },
        { key: 'enhanced-display-toggle', label: '高级视觉效果' },
        { key: 'engine-lock-toggle', label: '引擎锁定' },
        { key: 'hide-notifications-toggle', label: '隐藏弹窗' },
        { key: 'hide-info-popup-toggle', label: '禁止提示' }
    ];

    allItems.forEach(item => {
        const isSelected = self.settings.contextMenuCustomItems.includes(item.key);
        const atMax = self.settings.contextMenuCustomItems.length >= 3;

        const icon = document.createElement('span');
        icon.className = 'material-icons md3-icon';
        icon.textContent = isSelected ? 'check_box' : 'check_box_outline_blank';
        icon.style.cssText = 'font-size:20px;color:var(--text-secondary);transition:all 0.2s ease;';

        const label = document.createElement('span');
        label.textContent = item.label;
        label.style.cssText = 'font-size:13px;color:var(--text-color);flex:1;';

        const option = document.createElement('div');
        option.className = 'settings-menu-option';
        option.style.cssText = 'display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:pointer;border-radius:8px;transition:background 0.15s;user-select:none;';
        option.addEventListener('mouseenter', () => {
            option.style.background = 'rgba(128,128,128,0.08)';
            icon.style.transform = 'scale(1.1)';
        });
        option.addEventListener('mouseleave', () => {
            option.style.background = 'transparent';
            icon.style.transform = 'scale(1)';
        });

        option.appendChild(icon);
        option.appendChild(label);

        if (!isSelected && atMax) {
            option.style.opacity = '0.4';
            option.style.cursor = 'not-allowed';
        } else {
            option.addEventListener('click', () => {
                const idx = self.settings.contextMenuCustomItems.indexOf(item.key);
                if (idx >= 0) {
                    self.settings.contextMenuCustomItems.splice(idx, 1);
                } else {
                    if (self.settings.contextMenuCustomItems.length >= 3) {
                        self.showNotification('最多只能选择3个菜单项');
                        return;
                    }
                    self.settings.contextMenuCustomItems.push(item.key);
                }
                self.saveSettings();
                self.renderContextMenuCustomizeView(rightPanelUpper);
            });
        }

        itemsList.appendChild(option);
    });

    container.appendChild(itemsList);
    rightPanelUpper.appendChild(container);
},
};

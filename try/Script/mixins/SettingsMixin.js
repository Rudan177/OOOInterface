// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

import { ProxyManager } from '../proxy.js';
import { SYNC_KEYS } from '../storage-sync.js';

export const SettingsMixin = {
    syncSettingsPageToggles() {
        // 主开关状态派生后再同步 UI
        this.syncSimpleVisualMode();
        const dyn = document.getElementById('dynamic-blur-toggle');
        if (dyn) dyn.checked = this.settings.dynamicBlur;
        const enh = document.getElementById('enhanced-display-toggle');
        if (enh) enh.checked = this.settings.enhancedDisplay;
        const enhancedDisplayGroup = document.getElementById('enhanced-display-group');
        if (enhancedDisplayGroup) {
            enhancedDisplayGroup.style.display = this.settings.dynamicBlur ? 'block' : 'none';
        }
        const wp = document.getElementById('persistent-wallpaper-toggle');
        if (wp) wp.checked = this.settings.persistentWallpaper;
        const sh = document.getElementById('search-history-toggle');
        if (sh) sh.checked = this.settings.searchHistory;
        const ss = document.getElementById('search-suggestions-toggle');
        if (ss) ss.checked = this.settings.searchSuggestions;
        // 固定侧边栏主开关与两个子开关
        const fs = document.getElementById('fix-sidebar-toggle');
        if (fs) fs.checked = this.settings.fixSidebarEnabled;
        const fh = document.getElementById('fix-sidebar-homepage-toggle');
        if (fh) { fh.checked = this.settings.fixSidebarEnabled && this.settings.fixSidebarHomepage; }
        const fw = document.getElementById('fix-sidebar-wallpaper-toggle');
        if (fw) { fw.checked = this.settings.fixSidebarEnabled && this.settings.fixSidebarWallpaper; }
        const fsHomepageGroup = document.getElementById('fix-homepage-group');
        if (fsHomepageGroup) fsHomepageGroup.style.display = this.settings.fixSidebarEnabled ? 'block' : 'none';
        const fsWallpaperGroup = document.getElementById('fix-wallpaper-group');
        if (fsWallpaperGroup) fsWallpaperGroup.style.display = this.settings.fixSidebarEnabled ? 'block' : 'none';
        // 侧边栏功能：摘要文字与（如打开的）右面板配置视图
        this.syncSidePanelSelectDisplay();
        const el = document.getElementById('engine-lock-toggle');
        if (el) el.checked = this.settings.engineLocked;
        const hn = document.getElementById('hide-notifications-toggle');
        if (hn) hn.checked = this.settings.hideNotifications;
        const hip = document.getElementById('hide-info-popup-toggle');
        if (hip) hip.checked = this.settings.hideInfoPopup.enabled;
        // 简洁视觉效果主开关与三个子开关（主开关开启时才显示子开关）
        const sv = document.getElementById('simple-visual-toggle');
        if (sv) sv.checked = this.settings.simpleVisualMode;
        const svSubGroups = [
            document.getElementById('simple-notifications-group'),
            document.getElementById('simple-infopopup-group'),
            document.getElementById('simple-badge-group')
        ];
        svSubGroups.forEach(group => {
            if (group) group.style.display = this.settings.simpleVisualMode ? 'block' : 'none';
        });
        const hb = document.getElementById('hidden-badge-toggle');
        if (hb) hb.checked = this.settings.hiddenBadge;
        const op = document.getElementById('ocp-player-toggle');
        if (op) op.checked = this.settings.ocpPlayerEnabled;
        this.updateHideInfoPopupLabel();
        this.syncStatusBarUI();
        this.syncWidgetPanelUI();
        this.syncBadgeOpenMethodUI();
    },
    async loadSettings() {
        const isFirstRun = localStorage.getItem('oooInterfaceFirstRun');

        if (isFirstRun === null) {
            // 首次运行，使用出厂预设
            this.isFirstRun = true;
            localStorage.setItem('oooInterfaceFirstRun', 'false');
            this.showWelcomeScreen();
        } else {
            this.isFirstRun = false;
        }

        // 优先从 chrome.storage.local 加载，回退到 localStorage（兼容旧版）
        let savedSettings = null;
        try {
            const result = await chrome.storage.local.get('oooInterfaceSettings');
            savedSettings = result.oooInterfaceSettings || null;
        } catch (e) {
            console.warn('chrome.storage.local 读取失败，尝试 localStorage:', e);
        }
        if (!savedSettings) {
            const lsRaw = localStorage.getItem('oooInterfaceSettings');
            if (lsRaw) {
                try {
                    savedSettings = JSON.parse(lsRaw);
                    // 迁移到 chrome.storage.local
                    chrome.storage.local.set({ oooInterfaceSettings: savedSettings });
                } catch (e) {
                    console.error('localStorage 解析失败:', e);
                }
            }
        }

        if (savedSettings) {
            try {
                this.settings = this.mergeSettings(savedSettings);
            } catch (error) {
                console.error('设置加载失败，使用默认设置:', error);
                this.settings = JSON.parse(JSON.stringify(this.defaultSettings));
            }
        }

        // 初始化高级视觉效果自动启用标志
        this._dynamicBlurAutoEnabled = this.settings.enhancedDisplay && this.settings.dynamicBlur;

        // 绑定底部铭牌的双击/右键动作（依设置决定，幂等）
        this.setupBadgeOpenMethod();

        // 绑定 OCP 播控的 hover 显隐与播放按钮（幂等）
        this.setupOcpPlayer();
    },
    mergeSettings(savedSettings) {
        const result = JSON.parse(JSON.stringify(this.defaultSettings));

        // 合并基础设置
        if (savedSettings.font) result.font = savedSettings.font;
        if (savedSettings.logo) result.logo = savedSettings.logo;
        if (savedSettings.logoType) result.logoType = savedSettings.logoType;
        if (savedSettings.textLogo) result.textLogo = savedSettings.textLogo;
        if (savedSettings.wallpaper) result.wallpaper = savedSettings.wallpaper;
        if (savedSettings.wallpaperUrl !== undefined) result.wallpaperUrl = savedSettings.wallpaperUrl;
        if (savedSettings.dynamicBlur !== undefined) result.dynamicBlur = savedSettings.dynamicBlur;
        if (savedSettings.persistentWallpaper !== undefined) result.persistentWallpaper = savedSettings.persistentWallpaper;
        if (savedSettings.searchHistory !== undefined) result.searchHistory = savedSettings.searchHistory;
        if (savedSettings.searchSuggestions !== undefined) result.searchSuggestions = savedSettings.searchSuggestions;
        if (savedSettings.contextMenuStyle !== undefined) result.contextMenuStyle = savedSettings.contextMenuStyle;
        if (savedSettings.hideInfoPopup !== undefined) {
            if (typeof savedSettings.hideInfoPopup === 'boolean') {
                result.hideInfoPopup = { enabled: savedSettings.hideInfoPopup, type: savedSettings.hideInfoPopup ? 'permanent' : null, timestamp: savedSettings.hideInfoPopup ? Date.now() : null };
            } else if (typeof savedSettings.hideInfoPopup === 'object') {
                result.hideInfoPopup = { enabled: savedSettings.hideInfoPopup.enabled || false, type: savedSettings.hideInfoPopup.type || null, timestamp: savedSettings.hideInfoPopup.timestamp || null };
            }
        }

        if (savedSettings.searchHistoryItems && Array.isArray(savedSettings.searchHistoryItems)) {
            result.searchHistoryItems = savedSettings.searchHistoryItems.filter(item => typeof item === 'string' && item.trim());
        }

        if (savedSettings.engineLocked !== undefined) result.engineLocked = savedSettings.engineLocked;

        if (savedSettings.developerMode !== undefined) result.developerMode = savedSettings.developerMode;
        if (savedSettings.proxyPort !== undefined) result.proxyPort = savedSettings.proxyPort;
        if (savedSettings.fontSize !== undefined) result.fontSize = savedSettings.fontSize;
        if (savedSettings.fontWeight !== undefined) result.fontWeight = savedSettings.fontWeight;
        if (savedSettings.searchBoxHeight !== undefined) result.searchBoxHeight = savedSettings.searchBoxHeight;
        if (savedSettings.enhancedDisplay !== undefined) result.enhancedDisplay = savedSettings.enhancedDisplay;
        if (savedSettings.wallpaperScale !== undefined) result.wallpaperScale = savedSettings.wallpaperScale;
        if (savedSettings.wallpaperFill !== undefined) result.wallpaperFill = savedSettings.wallpaperFill;
        if (savedSettings.colorScheme !== undefined) result.colorScheme = savedSettings.colorScheme;
        if (savedSettings.customPrimaryColor !== undefined) result.customPrimaryColor = savedSettings.customPrimaryColor;
        if (savedSettings.customSecondaryColor !== undefined) result.customSecondaryColor = savedSettings.customSecondaryColor;
        if (savedSettings.customGradientEnabled !== undefined) result.customGradientEnabled = savedSettings.customGradientEnabled;
        if (savedSettings.customGradientStart !== undefined) result.customGradientStart = savedSettings.customGradientStart;
        if (savedSettings.customGradientEnd !== undefined) result.customGradientEnd = savedSettings.customGradientEnd;
        if (savedSettings.customColors !== undefined) result.customColors = savedSettings.customColors;
        if (savedSettings.activeCustomColorIndex !== undefined) result.activeCustomColorIndex = savedSettings.activeCustomColorIndex;
        // 旧数据迁移：如果旧版有 customPrimaryColor 且 customColors 为空，迁移到 customColors[0]
        if (savedSettings.customPrimaryColor && savedSettings.customPrimaryColor.trim() && (!result.customColors || result.customColors.length === 0)) {
            result.customColors = [{
                name: '我的配色',
                primaryColor: savedSettings.customPrimaryColor || '',
                secondaryColor: savedSettings.customSecondaryColor || '',
                gradientEnabled: savedSettings.customGradientEnabled || false,
                gradientStart: savedSettings.customGradientStart !== undefined ? savedSettings.customGradientStart : 0,
                gradientEnd: savedSettings.customGradientEnd !== undefined ? savedSettings.customGradientEnd : 100
            }];
            if (savedSettings.colorScheme === 'custom') {
                result.activeCustomColorIndex = 0;
            }
        }
        if (savedSettings.badgeDblClickAction !== undefined) {
            result.badgeDblClickAction = this.normalizeBadgeAction(savedSettings.badgeDblClickAction);
        }
        if (savedSettings.badgeContextMenuAction !== undefined) {
            result.badgeContextMenuAction = this.normalizeBadgeAction(savedSettings.badgeContextMenuAction);
        }
        // 旧版 badgeOpenMethod 迁移：both / dblclick / contextmenu / none
        if (savedSettings.badgeDblClickAction === undefined && savedSettings.badgeContextMenuAction === undefined
            && savedSettings.badgeOpenMethod !== undefined) {
            const legacy = savedSettings.badgeOpenMethod;
            result.badgeDblClickAction = (legacy === 'none' || legacy === 'contextmenu') ? 'none' : 'settings';
            result.badgeContextMenuAction = (legacy === 'none' || legacy === 'dblclick') ? 'none' : 'settings';
        }
        if (savedSettings.bingRefreshEveryTime !== undefined) result.bingRefreshEveryTime = savedSettings.bingRefreshEveryTime;
        if (savedSettings.bingRefreshInterval !== undefined) result.bingRefreshInterval = savedSettings.bingRefreshInterval;
        if (savedSettings.quickAccessSidebar !== undefined) result.quickAccessSidebar = savedSettings.quickAccessSidebar;
        if (savedSettings.showQuickLinkIcons !== undefined) result.showQuickLinkIcons = savedSettings.showQuickLinkIcons;
        if (savedSettings.fixSidebarEnabled !== undefined) result.fixSidebarEnabled = savedSettings.fixSidebarEnabled;
        if (savedSettings.fixSidebarHomepage !== undefined) result.fixSidebarHomepage = savedSettings.fixSidebarHomepage;
        if (savedSettings.fixSidebarWallpaper !== undefined) result.fixSidebarWallpaper = savedSettings.fixSidebarWallpaper;

        // 侧边栏面板功能
        if (savedSettings.sidePanelEnabled !== undefined) result.sidePanelEnabled = savedSettings.sidePanelEnabled;
        if (savedSettings.sidePanelShowWidgets !== undefined) result.sidePanelShowWidgets = savedSettings.sidePanelShowWidgets;
        if (savedSettings.sidePanelShowQuickLinks !== undefined) result.sidePanelShowQuickLinks = savedSettings.sidePanelShowQuickLinks;
        if (savedSettings.sidePanelShowSearch !== undefined) result.sidePanelShowSearch = savedSettings.sidePanelShowSearch;
        if (savedSettings.sidePanelShowEngineButtons !== undefined) result.sidePanelShowEngineButtons = savedSettings.sidePanelShowEngineButtons;
        if (savedSettings.sidePanelWallpaperEnabled !== undefined) result.sidePanelWallpaperEnabled = savedSettings.sidePanelWallpaperEnabled;
        if (savedSettings.sidePanelWallpaperSync !== undefined) result.sidePanelWallpaperSync = savedSettings.sidePanelWallpaperSync;
        if (savedSettings.sidePanelWallpaperUrl !== undefined) result.sidePanelWallpaperUrl = savedSettings.sidePanelWallpaperUrl;
        if (savedSettings.sidePanelWidgetsSync !== undefined) result.sidePanelWidgetsSync = savedSettings.sidePanelWidgetsSync;
        if (savedSettings.sidePanelWidgetPanel !== undefined) result.sidePanelWidgetPanel = savedSettings.sidePanelWidgetPanel;
        if (savedSettings.sidePanelQuickLinksSync !== undefined) result.sidePanelQuickLinksSync = savedSettings.sidePanelQuickLinksSync;
        if (savedSettings.sidePanelQuickLinks !== undefined) result.sidePanelQuickLinks = savedSettings.sidePanelQuickLinks;
        if (savedSettings.sidePanelSearchSync !== undefined) result.sidePanelSearchSync = savedSettings.sidePanelSearchSync;
        if (savedSettings.sidePanelSearchBoxHeight !== undefined) result.sidePanelSearchBoxHeight = savedSettings.sidePanelSearchBoxHeight;
        if (savedSettings.sidePanelBuiltinOpen !== undefined) result.sidePanelBuiltinOpen = savedSettings.sidePanelBuiltinOpen;
        if (savedSettings.hiddenBadge !== undefined) result.hiddenBadge = savedSettings.hiddenBadge;
        if (savedSettings.ocpPlayerEnabled !== undefined) result.ocpPlayerEnabled = savedSettings.ocpPlayerEnabled;

        // 合并小组件面板配置
        // enabled 字段已废弃（开关已移除，面板显示完全由列表是否为空决定），固定为 true
        if (savedSettings.widgetPanel && typeof savedSettings.widgetPanel === 'object') {
            result.widgetPanel = {
                enabled: true,
                widgets: Array.isArray(savedSettings.widgetPanel.widgets)
                    ? savedSettings.widgetPanel.widgets.filter(w =>
                        w && typeof w === 'object' && w.type && w.id
                      )
                    : []
            };
        }
        if (savedSettings.statusBarEnabled !== undefined) result.statusBarEnabled = savedSettings.statusBarEnabled;
        if (savedSettings.showStatusBarSeconds !== undefined) result.showStatusBarSeconds = savedSettings.showStatusBarSeconds;
        if (savedSettings.hideNotifications !== undefined) result.hideNotifications = savedSettings.hideNotifications;
        if (savedSettings.shortcutsEnabled !== undefined) result.shortcutsEnabled = savedSettings.shortcutsEnabled;
        if (savedSettings.contextMenuCustomItems && Array.isArray(savedSettings.contextMenuCustomItems)) {
            result.contextMenuCustomItems = savedSettings.contextMenuCustomItems.filter(
                item => ['enhanced-display-toggle', 'wallpaper-toggle', 'search-history-toggle', 'search-suggestions-toggle', 'engine-lock-toggle', 'hide-notifications-toggle', 'hide-info-popup-toggle'].includes(item)
            );
        }

        // 合并主题相关字段
        if (savedSettings.theme !== undefined) result.theme = savedSettings.theme;
        if (savedSettings.themeEnabled !== undefined) result.themeEnabled = savedSettings.themeEnabled;
        if (savedSettings.themeColorScheme !== undefined) result.themeColorScheme = savedSettings.themeColorScheme;
        if (savedSettings.themeAspects !== undefined) result.themeAspects = savedSettings.themeAspects;

        // 合并自定义Logo列表
        if (savedSettings.customLogos && Array.isArray(savedSettings.customLogos)) {
            result.customLogos = savedSettings.customLogos.filter(logo =>
                logo && logo.name && logo.data
            );
        }

        // 合并自定义字体列表
        if (savedSettings.customFonts && Array.isArray(savedSettings.customFonts)) {
            result.customFonts = savedSettings.customFonts.filter(font =>
                font && font.name && font.data
            );
        }

        // 合并自定义壁纸列表
        if (savedSettings.customWallpapers && Array.isArray(savedSettings.customWallpapers)) {
            result.customWallpapers = savedSettings.customWallpapers.filter(wp =>
                wp && wp.name && wp.data
            );
        }

        // 合并自定义主题列表
        if (savedSettings.customThemes && Array.isArray(savedSettings.customThemes)) {
            result.customThemes = savedSettings.customThemes.filter(ct =>
                ct && ct.key && ct.data && ct.data.info && ct.data.details
            );
        }

        // 合并快速访问链接列表
        if (savedSettings.quickLinks && Array.isArray(savedSettings.quickLinks)) {
            result.quickLinks = savedSettings.quickLinks.filter(link =>
                link && link.name && link.url
            );
        }

        // 恢复用户更改Logo标记
        if (savedSettings.userChangedLogo !== undefined) {
            this.userChangedLogo = savedSettings.userChangedLogo;
        }

        // 简洁视觉效果主开关由子开关状态派生（所有恢复完成后计算，兼容旧版本数据）
        result.simpleVisualMode = !!(result.hideNotifications
            || (result.hideInfoPopup && result.hideInfoPopup.enabled)
            || result.hiddenBadge);

        return result;
    },
    showWelcomeScreen() {
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            welcomeScreen.style.display = 'flex';
        }
    },
    hideWelcomeScreen() {
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            welcomeScreen.style.display = 'none';
        }
    },
    saveSettings() {
        const settingsToSave = {
            ...this.settings,
            userChangedLogo: this.userChangedLogo
        };
        // 侧边栏子视图数据交换期间：快照里把交换出去的键还原为原始引用，
        // 避免把独立数据序列化进主槽位（内存引用在退出交换时本就会恢复）
        if (this._spSwap) {
            if (this._spSwap.quickLinks !== undefined) settingsToSave.quickLinks = this._spSwap.quickLinks;
            if (this._spSwap.widgetPanel !== undefined) settingsToSave.widgetPanel = this._spSwap.widgetPanel;
        }
        try {
            const result = chrome.storage.local.set({ oooInterfaceSettings: settingsToSave });
            if (result && typeof result.catch === 'function') {
                result.catch(error => {
                    console.warn('chrome.storage 保存失败，尝试 localStorage:', error);
                    try {
                        localStorage.setItem('oooInterfaceSettings', JSON.stringify(settingsToSave));
                    } catch (e) {
                        console.error('localStorage 保存也失败:', e);
                        this.showNotification('保存设置失败');
                    }
                });
            }
        } catch (error) {
            console.warn('chrome.storage 保存失败，尝试 localStorage:', error);
            try {
                localStorage.setItem('oooInterfaceSettings', JSON.stringify(settingsToSave));
            } catch (e) {
                console.error('localStorage 保存也失败:', e);
                this.showNotification('保存设置失败');
            }
        }
    },
    setupSettingsSync() {
        try {
            if (!chrome.storage || !chrome.storage.onChanged) return;
        } catch (e) {
            return;
        }
        // 触发重应用的门控键表：与侧边栏面板共用 storage-sync.js（Stage 9）。
        // 其中 wallpaper / wallpaperUrl 是此前这里漏掉的，补上后主页面换壁纸
        // 也能触发侧边栏重应用。语义与并集理由见该模块头部说明。

        let syncTimer = null;
        let pendingValue = null;

        chrome.storage.onChanged.addListener((changes, areaName) => {
            if (areaName !== 'local' || !changes.oooInterfaceSettings) return;
            const next = changes.oooInterfaceSettings.newValue;
            if (!next) return;

            const relevant = SYNC_KEYS.some(key => JSON.stringify(next[key]) !== JSON.stringify(this.settings[key]));
            if (!relevant) return;

            pendingValue = next;
            clearTimeout(syncTimer);
            syncTimer = setTimeout(() => {
                // 完整回填：保留全部已存键（含壁纸/字体/小组件数据），仅用默认值补缺，避免丢设置
                this.settings = Object.assign({}, this.defaultSettings, pendingValue);
                // 侧边栏子视图交换期间：重挂交换，保证管理视图继续作用于独立数据
                if (this._spSwap) {
                    if (this._spSwap.quickLinks !== undefined) this.settings.quickLinks = this.settings.sidePanelQuickLinks;
                    if (this._spSwap.widgetPanel !== undefined) this.settings.widgetPanel = this.settings.sidePanelWidgetPanel;
                }
                this._dynamicBlurAutoEnabled = this.settings.enhancedDisplay && this.settings.dynamicBlur;
                this.applySettings();
                this.updateContextMenuIcons();
                this.syncSettingsPageToggles();
            }, 150);
        });
    },
    toggleSearchHistorySetting() {
        this.settings.searchHistory = !this.settings.searchHistory;
        this.saveSettings();
        this.updateContextMenuIcons();
        this.syncSettingsPageToggles();
        this.showNotification(this.settings.searchHistory ? '搜索历史：开启' : '搜索历史：关闭');
    },
    toggleSearchSuggestionsSetting() {
        this.settings.searchSuggestions = !this.settings.searchSuggestions;
        this.saveSettings();
        this.updateContextMenuIcons();
        this.syncSettingsPageToggles();
        this.showNotification(this.settings.searchSuggestions ? '热搜词建议：开启' : '热搜词建议：关闭');
    },
    // 引擎锁定的唯一写入口：设置页开关与右键菜单开关都走这里，
    // 保证「锁定时把当前引擎写进 localStorage」这一步不会被绕过（此前设置页只改 settings，
    // 走「应用」提交时不会写 oooEngineLocked，锁定的引擎丢失）。
    setEngineLock(enabled) {
        this.settings.engineLocked = !!enabled;
        if (enabled) {
            localStorage.setItem('oooEngineLocked', this.currentEngine);
        } else {
            localStorage.removeItem('oooEngineLocked');
        }
        this.saveSettings();
        this.updateContextMenuIcons();
        this.syncSettingsPageToggles();
    },
    toggleEngineLockSetting() {
        this.setEngineLock(!this.settings.engineLocked);
        this.showNotification(this.settings.engineLocked ? '引擎锁定：开启' : '引擎锁定：关闭');
    },
    toggleWallpaperSetting() {
        this.settings.persistentWallpaper = !this.settings.persistentWallpaper;
        this.applySettings();
        this.saveSettings();
        this.updateContextMenuIcons();
        this.syncSettingsPageToggles();
        this.showNotification(this.settings.persistentWallpaper ? '壁纸常显示：开启' : '壁纸常显示：关闭');
    },
    toggleEnhancedDisplaySetting() {
        this.settings.enhancedDisplay = !this.settings.enhancedDisplay;
        if (this.settings.enhancedDisplay && !this.settings.dynamicBlur) {
            this.settings.dynamicBlur = true;
            this._dynamicBlurAutoEnabled = true;
        } else if (!this.settings.enhancedDisplay && this._dynamicBlurAutoEnabled) {
            this.settings.dynamicBlur = false;
            this._dynamicBlurAutoEnabled = false;
        }
        this.applySettings();
        this.saveSettings();
        this.updateContextMenuIcons();
        // 直接同步设置页复选框（移除监听器避免循环触发）
        const cb = document.getElementById('enhanced-display-toggle');
        if (cb) {
            cb.removeEventListener('change', this._enhancedDisplayChangeHandler);
            cb.checked = this.settings.enhancedDisplay;
            cb.addEventListener('change', this._enhancedDisplayChangeHandler);
        }
        // 同步动态模糊复选框和增强显示分组可见性
        const dyn = document.getElementById('dynamic-blur-toggle');
        if (dyn) dyn.checked = this.settings.dynamicBlur;
        const group = document.getElementById('enhanced-display-group');
        if (group) group.style.display = this.settings.dynamicBlur ? 'block' : 'none';
        this.showNotification(this.settings.enhancedDisplay ? '高级视觉效果：开启' : '高级视觉效果：关闭');
    },
    openSettings(source) {
        if (this.contextMenu) {
            this.hideContextMenu();
        }

        const modal = document.getElementById('settings-modal');

        // 记录是否需要切换回常规模式
        const needRestoreHomepage = this.isScrolled;

        // 先设置display属性，让浏览器渲染元素
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';

        // 禁用主页面滚动
        document.body.style.overflow = 'hidden';

        // 清除上一次的来源标记类
        modal.classList.remove('badge-source');
        modal.classList.remove('context-source');

        // 如果开启了高级视效，给 modal 添加 blur-effect 类
        if (this.settings.dynamicBlur) {
            modal.classList.add('blur-effect');
        } else {
            modal.classList.remove('blur-effect');
        }

        // 添加鼠标滚轮事件监听器，阻止事件冒泡
        this.modalScrollHandler = (e) => {
            // 如果事件目标在模态框内，阻止事件传播到主页面
            if (e.target.closest('.modal')) {
                e.stopPropagation();
            }
        };
        document.addEventListener('wheel', this.modalScrollHandler, { passive: false });

        // 更新设置界面
        this.updateSettingsUI();

        // 更新自定义Logo列表
        this.updateCustomLogosList();

        // 更新快速访问链接列表
        this.updateQuickLinksList();

        // 更新开发者模式UI
        this.updateDeveloperModeUI();

        // 根据dynamicBlur设置决定是否添加动画
        const modalContent = modal.querySelector('.modal-content');
        if (this.settings.dynamicBlur) {
            // 移除no-animation类，启用动画
            if (modalContent) modalContent.classList.remove('no-animation');
            // 根据来源添加标识类，用于差异化动画
            if (source === 'badge') {
                modal.classList.add('badge-source');
            } else {
                modal.classList.add('context-source');
            }
            // 使用requestAnimationFrame确保动画在下一帧触发，更加流畅
            requestAnimationFrame(() => {
                // 从铭牌打开：在渲染前计算铭牌相对弹窗的实际位置
                if (source === 'badge') {
                    this.calculateBadgeOrigin(modal);
                }
                requestAnimationFrame(() => {
                    modal.classList.add('show');

                    // 设置弹窗开始显示后，再切换回常规模式
                    if (needRestoreHomepage) {
                        this.restoreHomepage(false);
                    }
                });
            });
        } else {
            // 添加no-animation类，禁用动画
            if (modalContent) modalContent.classList.add('no-animation');
            // 无动画时仍记录来源，供关闭动画使用
            if (source === 'badge') {
                modal.classList.add('badge-source');
                this.calculateBadgeOrigin(modal);
            }
            // 直接添加show类，无动画
            modal.classList.add('show');

            // 立即切换回常规模式
            if (needRestoreHomepage) {
                this.restoreHomepage(true);
            }
        }

        // 根据当前Logo类型显示/隐藏文字Logo输入框
        const textLogoItem = document.querySelector('.select-item-text-logo');
        if (this.settings.logo === 'text-logo') {
            document.getElementById('text-logo-inline-group').style.display = 'flex';
            if (textLogoItem) textLogoItem.classList.add('selected');
        } else {
            document.getElementById('text-logo-inline-group').style.display = 'none';
            if (textLogoItem) textLogoItem.classList.remove('selected');
        }

        // 根据窗口宽度调整按钮位置
        this.updateSettingsButtonsPosition();
    },
    updateSettingsUI() {
        const fontSelect = document.getElementById('font-select');

        // 保存当前选中的字体值
        const selectedFont = this.settings.font;

        // 设置选中的值
        fontSelect.value = selectedFont;

        // 更新字体选择框的显示文本
        const fontSelectSelected = document.getElementById('font-select-selected');
        if (fontSelectSelected) {
            const themeInfo = this.getThemeDisplayInfo();
            if (themeInfo && themeInfo.fontName) {
                fontSelectSelected.textContent = themeInfo.themeName + '：' + themeInfo.fontName;
            } else {
                const fontOption = fontSelect.querySelector(`option[value="${selectedFont}"]`);
                fontSelectSelected.textContent = fontOption ? fontOption.textContent : selectedFont;
            }
        }

        // 更新其他设置
        const logoSelect = document.getElementById('logo-select');
        logoSelect.value = this.settings.logo;
        document.getElementById('text-logo-input').value = this.settings.textLogo || '';

        // 更新Logo选择框的显示文本
        const logoSelectSelected = document.getElementById('logo-select-selected');
        if (logoSelectSelected) {
            const themeInfo = this.getThemeDisplayInfo();
            if (themeInfo && themeInfo.logoName) {
                logoSelectSelected.textContent = themeInfo.themeName + '：' + themeInfo.logoName;
            } else {
                const logoOption = logoSelect.querySelector(`option[value="${this.settings.logo}"]`);
                if (logoOption) logoSelectSelected.textContent = logoOption.textContent;
            }
        }

        // 更新壁纸选择
        let wallpaperValue = 'default';
        if (this.settings.wallpaper === 'url') {
            wallpaperValue = 'url';
        } else if (this.settings.wallpaper === 'bing') {
            wallpaperValue = 'bing';
        } else if (this.settings.wallpaper !== 'default') {
            // 检查是否是自定义上传的壁纸
            const customWallpaper = this.settings.customWallpapers.find(wp => wp.data === this.settings.wallpaper);
            if (customWallpaper) {
                wallpaperValue = customWallpaper.name;
            } else {
                wallpaperValue = 'default';
            }
        }

        const wallpaperSelect = document.getElementById('wallpaper-select');
        wallpaperSelect.value = wallpaperValue;

        // 更新壁纸选择框的显示文本
        const wallpaperSelectSelected = document.getElementById('wallpaper-select-selected');
        if (wallpaperSelectSelected) {
            const themeInfo = this.getThemeDisplayInfo();
            if (themeInfo && themeInfo.wallpaperName) {
                wallpaperSelectSelected.textContent = themeInfo.themeName + '：' + themeInfo.wallpaperName;
            } else if (wallpaperValue === 'default') {
                wallpaperSelectSelected.textContent = '默认壁纸';
            } else if (wallpaperValue === 'bing') {
                wallpaperSelectSelected.textContent = '必应每日壁纸';
            } else if (wallpaperValue === 'url') {
                wallpaperSelectSelected.textContent = 'URL链接';
            } else {
                // 自定义壁纸
                const customWallpaper = this.settings.customWallpapers.find(wp => wp.name === wallpaperValue);
                if (customWallpaper) {
                    wallpaperSelectSelected.textContent = customWallpaper.name;
                }
            }
        }

        // 更新右键菜单样式
        document.getElementById('context-menu-style').value = this.settings.contextMenuStyle;

        // 更新配色方案选择
        this.updateColorSchemeSelectDisplay();

        // 更新新增的设置选项
        document.getElementById('dynamic-blur-toggle').checked = this.settings.dynamicBlur;
        document.getElementById('enhanced-display-toggle').checked = this.settings.enhancedDisplay;
        document.getElementById('persistent-wallpaper-toggle').checked = this.settings.persistentWallpaper;
        document.getElementById('wallpaper-scale-toggle').checked = this.settings.wallpaperScale;
        document.getElementById('search-history-toggle').checked = this.settings.searchHistory;
        document.getElementById('search-suggestions-toggle').checked = this.settings.searchSuggestions;
        document.getElementById('engine-lock-toggle').checked = this.settings.engineLocked;
        document.getElementById('hide-info-popup-toggle').checked = this.settings.hideInfoPopup.enabled;
        document.getElementById('quick-access-sidebar-toggle').checked = this.settings.quickAccessSidebar;
        document.getElementById('hide-notifications-toggle').checked = this.settings.hideNotifications;
        // 简洁视觉效果主开关与子开关（主开关开启时才显示子开关）
        this.syncSimpleVisualMode();
        document.getElementById('simple-visual-toggle').checked = this.settings.simpleVisualMode;
        document.getElementById('hidden-badge-toggle').checked = this.settings.hiddenBadge;
        document.getElementById('ocp-player-toggle').checked = this.settings.ocpPlayerEnabled;
        // 固定侧边栏主开关与两个子开关
        document.getElementById('fix-sidebar-toggle').checked = this.settings.fixSidebarEnabled;
        document.getElementById('fix-sidebar-homepage-toggle').checked = this.settings.fixSidebarEnabled && this.settings.fixSidebarHomepage;
        document.getElementById('fix-sidebar-wallpaper-toggle').checked = this.settings.fixSidebarEnabled && this.settings.fixSidebarWallpaper;
        // 侧边栏功能：左侧下拉摘要与右面板视图
        this.syncSidePanelSelectDisplay();
        this.updateHideInfoPopupLabel();

        // 根据动态模糊的状态显示/隐藏增强显示开关
        const enhancedDisplayGroup = document.getElementById('enhanced-display-group');
        if (enhancedDisplayGroup) {
            enhancedDisplayGroup.style.display = this.settings.dynamicBlur ? 'block' : 'none';
        }

        // 根据壁纸常显示的状态显示/隐藏壁纸缩放开关
        const wallpaperScaleGroup = document.getElementById('wallpaper-scale-group');
        if (wallpaperScaleGroup) {
            wallpaperScaleGroup.style.display = this.settings.persistentWallpaper ? 'block' : 'none';
        }

        // 根据快速访问侧边栏开关状态显示/隐藏子开关
        const iconsGroup = document.getElementById('show-quick-icons-group');
        const showIconsToggle = document.getElementById('show-quick-icons');
        if (iconsGroup && showIconsToggle) {
            iconsGroup.style.display = this.settings.quickAccessSidebar ? 'block' : 'none';
            showIconsToggle.checked = this.settings.quickAccessSidebar ? this.settings.showQuickLinkIcons : false;
        }

        // 根据固定侧边栏主开关状态显示/隐藏子开关
        const fsHomepageGroup = document.getElementById('fix-homepage-group');
        const fsWallpaperGroup = document.getElementById('fix-wallpaper-group');
        if (fsHomepageGroup) {
            fsHomepageGroup.style.display = this.settings.fixSidebarEnabled ? 'block' : 'none';
        }
        if (fsWallpaperGroup) {
            fsWallpaperGroup.style.display = this.settings.fixSidebarEnabled ? 'block' : 'none';
        }

        // 根据简洁视觉效果主开关状态显示/隐藏子开关
        const simpleVisualGroups = [
            document.getElementById('simple-notifications-group'),
            document.getElementById('simple-infopopup-group'),
            document.getElementById('simple-badge-group')
        ];
        simpleVisualGroups.forEach(group => {
            if (group) group.style.display = this.settings.simpleVisualMode ? 'block' : 'none';
        });

        this.syncWidgetPanelUI();

        // 更新底部铭牌功能（摘要文本 + 隐藏铭牌时隐藏该项）
        this.syncBadgeOpenMethodUI();

        // 更新自定义下拉菜单的显示文本
        const updateCustomSelectDisplay = (selectId, selectedValue) => {
            const select = document.getElementById(selectId);
            const customSelect = select.parentElement;
            const selectedDisplay = customSelect.querySelector('.select-selected');
            const selectItems = customSelect.querySelector('.select-items');

            if (selectedDisplay) {
                const selectedOption = select.querySelector(`option[value="${selectedValue}"]`);
                if (selectedOption) {
                    selectedDisplay.textContent = selectedOption.textContent;
                }
            }

            // 更新下拉菜单选项
            if (selectItems) {
                // 先清除所有自定义选项（支持两种标识符）
                const customItems = selectItems.querySelectorAll('.select-item[data-custom="true"], .select-item-custom-logo');
                customItems.forEach(item => item.remove());

                // 添加自定义选项（支持两种标识符）
                const customOptions = select.querySelectorAll('option[data-custom="true"], option.custom-logo-option');
                customOptions.forEach(option => {
                    const selectItem = document.createElement('div');
                    selectItem.className = 'select-item select-item-custom-logo';
                    selectItem.setAttribute('data-value', option.value);
                    selectItem.textContent = option.textContent;
                    selectItems.appendChild(selectItem);
                });
            }
        };

        // 更新每个自定义下拉菜单
        // font-select 由 updateCustomFontsList 处理
        // logo-select 由 updateCustomLogosList 处理
        // wallpaper-select 由 updateCustomWallpapersList 处理
        updateCustomSelectDisplay('context-menu-style', this.settings.contextMenuStyle);

        // 移除应用按钮的所有logo类，保持蓝色
        this.updateApplyButtonColor();
    },
    updateApplyButtonColor() {
        const applyBtn = document.getElementById('apply-settings');

        // 移除所有logo类，确保应用按钮始终为蓝色
        const logoClasses = ['logo-google', 'logo-microsoft', 'logo-apple', 'logo-huawei', 'logo-custom', 'logo-text'];
        logoClasses.forEach(logoClass => {
            applyBtn.classList.remove(logoClass);
        });

        // 应用按钮始终使用蓝色样式，不随Logo变化
        applyBtn.style.backgroundColor = '';
        applyBtn.style.color = '';
        applyBtn.style.borderColor = '';
    },
    closeSettings() {
        // 侧边栏子视图的数据交换随设置关闭而恢复
        this.exitSidePanelScope();
        const modal = document.getElementById('settings-modal');
        const modalContent = modal.querySelector('.modal-content');

        // 关闭前读取设置页的增强显示复选框，同步到 this.settings
        const enhBox = document.getElementById('enhanced-display-toggle');
        if (enhBox && this.settings.enhancedDisplay !== enhBox.checked) {
            this.settings.enhancedDisplay = enhBox.checked;
            this.applySettings();
            this.saveSettings();
        }

        // 根据dynamicBlur设置决定是否添加动画
        if (!this.settings.dynamicBlur) {
            // 添加no-animation类，禁用动画
            if (modalContent) modalContent.classList.add('no-animation');
        }

        // 添加退出动画 - 使用 hiding 类
        modal.classList.remove('show');
        modal.classList.add('hiding');

        // 根据dynamicBlur设置决定是否等待动画完成
        if (this.settings.dynamicBlur) {
            // 等待动画完成后再执行后续操作
            setTimeout(() => {
                // 移除 hiding 类和 blur-effect 类
                modal.classList.remove('hiding');
                modal.classList.remove('blur-effect');
                modal.classList.remove('badge-source');

                // 恢复主页面滚动
                document.body.style.overflow = '';

                // 移除鼠标滚轮事件监听器
                if (this.modalScrollHandler) {
                    document.removeEventListener('wheel', this.modalScrollHandler);
                    this.modalScrollHandler = null;
                }

                // 隐藏快速访问链接输入区域
                const quickLinksInputGroup = document.getElementById('quick-links-input-group');
                if (quickLinksInputGroup) {
                    quickLinksInputGroup.style.display = 'none';
                }

                // 隐藏模态框
                modal.style.display = 'none';

                // 重新读取设置状态，更新右键菜单图标
                this.updateContextMenuIcons();
            }, 400); // 等待动画完成，与CSS过渡时间匹配
        } else {
            // 直接执行后续操作，无动画
            // 移除 hiding 类
            modal.classList.remove('hiding');
            modal.classList.remove('badge-source');

            // 恢复主页面滚动
            document.body.style.overflow = '';

            // 移除 blur-effect 类
            modal.classList.remove('blur-effect');

            // 移除鼠标滚轮事件监听器
            if (this.modalScrollHandler) {
                document.removeEventListener('wheel', this.modalScrollHandler);
                this.modalScrollHandler = null;
            }

            // 隐藏快速访问链接输入区域
            const quickLinksInputGroup = document.getElementById('quick-links-input-group');
            if (quickLinksInputGroup) {
                quickLinksInputGroup.style.display = 'none';
            }

            // 隐藏模态框
            modal.style.display = 'none';

            // 重新读取设置状态，更新右键菜单图标
            this.updateContextMenuIcons();
        }
    },
    updateDeveloperModeUI() {
        const developerModeGroup = document.getElementById('developer-mode-group');
        if (developerModeGroup) {
            developerModeGroup.style.display = this.settings.developerMode ? 'block' : 'none';
        }

        const feedbackBtn = document.getElementById('feedback-btn');
        if (feedbackBtn) {
            feedbackBtn.style.display = this.settings.developerMode ? 'flex' : 'none';
        }

        const contextFeedbackItem = document.querySelector('.context-menu-item[data-action="feedback"]');
        if (contextFeedbackItem) {
            contextFeedbackItem.style.display = this.settings.developerMode ? '' : 'none';
        }

        // 仅开发者模式可见的导出/导入按钮
        document.querySelectorAll('.dev-only').forEach(btn => {
            btn.style.display = this.settings.developerMode ? '' : 'none';
        });

        if (this.settings.developerMode) {
            document.getElementById('font-size-slider').value = this.settings.fontSize;
            document.getElementById('font-size-value').value = this.settings.fontSize.toFixed(1);
            document.getElementById('font-weight-slider').value = this.settings.fontWeight;
            document.getElementById('font-weight-value').value = this.settings.fontWeight;
            document.getElementById('search-box-height').value = this.settings.searchBoxHeight;
            document.getElementById('search-box-height-value').value = this.settings.searchBoxHeight;
        }
        this.syncStatusBarUI();

        // 快捷键开关独立于开发者模式
        const shortcutsToggle = document.getElementById('shortcuts-toggle');
        if (shortcutsToggle) {
            shortcutsToggle.checked = this.settings.shortcutsEnabled;
        }

        const proxySelect = document.getElementById('proxy-select');
        const proxySelected = document.getElementById('proxy-select-selected');
        if (proxySelect && proxySelected) {
            if (this.settings.proxyPort) {
                proxySelect.value = 'custom';
                this.updateProxySelectedText(this.settings.proxyPort);
            } else {
                proxySelect.value = '';
                proxySelected.textContent = '不使用代理';
            }
            ProxyManager.setProxy(this.settings.proxyPort);
        }
    },
    applyDeveloperSettings() {
        const root = document.documentElement;

        // 主题字体粗细/大小覆盖优先
        let fontSize = this.settings.fontSize;
        let fontWeight = this.settings.fontWeight;
        if (this.settings.themeEnabled && this.themeOverrides?.font) {
            const o = this.themeOverrides.font;
            if (o.weight) {
                const w = parseInt(o.weight, 10);
                if (!isNaN(w)) fontWeight = w;
            }
            if (o.size) {
                const emMatch = String(o.size).match(/^([\d.]+)em$/);
                if (emMatch) fontSize = parseFloat(emMatch[1]);
            }
        }
        root.style.setProperty('--base-font-size', fontSize);
        root.style.setProperty('--base-font-weight', fontWeight);

        if (this.settings.searchBoxHeight > 0) {
            root.style.setProperty('--search-box-height', this.settings.searchBoxHeight + 'px');
        } else if (this.settings.searchBoxHeight === 0) {
            root.style.setProperty('--search-box-height', '1px');
        } else {
            root.style.setProperty('--search-box-height', '50px');
        }
    },
    resetDeveloperSettings() {
        this.settings.fontSize = 1;
        this.settings.fontWeight = 400;
        this.settings.searchBoxHeight = 50;
        this.settings.proxyPort = null;
        this.settings.statusBarEnabled = false;
        this.settings.showStatusBarSeconds = false;
        this.settings.hideNotifications = false;

        const fontSizeSlider = document.getElementById('font-size-slider');
        const fontWeightSlider = document.getElementById('font-weight-slider');
        const searchBoxHeightSlider = document.getElementById('search-box-height');

        if (fontSizeSlider) {
            fontSizeSlider.value = 1;
            document.getElementById('font-size-value').value = 1;
        }

        if (fontWeightSlider) {
            fontWeightSlider.value = 400;
            document.getElementById('font-weight-value').value = 400;
        }

        if (searchBoxHeightSlider) {
            searchBoxHeightSlider.value = 50;
            document.getElementById('search-box-height-value').value = 50;
        }

        const proxySelect = document.getElementById('proxy-select');
        const proxySelected = document.getElementById('proxy-select-selected');
        if (proxySelect) proxySelect.value = '';
        if (proxySelected) proxySelected.textContent = '不使用代理';
        ProxyManager.clearProxy();

        this.applyDeveloperSettings();
        this.updateDeveloperModeUI();
        this.applyStatusBarSettings();
        this.saveSettings();
    },
    handleProxyChange(value) {
        const proxySelected = document.getElementById('proxy-select-selected');
        if (!proxySelected) return;

        if (value === 'custom') {
            this.updateProxySelectedText(this.settings.proxyPort);
            const customItem = document.querySelector('#proxy-select-items .proxy-custom-item');
            if (customItem) {
                const inputWrapper = customItem.querySelector('.proxy-custom-input-wrapper');
                if (inputWrapper) {
                    inputWrapper.style.display = 'flex';
                }
            }
            return;
        }

        if (value === '') {
            this.settings.proxyPort = null;
            ProxyManager.clearProxy();
            proxySelected.textContent = '不使用代理';
            this.saveSettings();
            return;
        }

        const portNum = parseInt(value, 10);
        if (!isNaN(portNum) && portNum >= 1 && portNum <= 65535) {
            this.settings.proxyPort = portNum;
            ProxyManager.setProxy(portNum);
            proxySelected.textContent = value;
            this.saveSettings();
        }
    },
    updateProxySelectedText(port) {
        const proxySelected = document.getElementById('proxy-select-selected');
        if (proxySelected) {
            proxySelected.textContent = port ? port.toString() : '不使用代理';
        }
    },
    applySettings() {
        // 各应用分支独立容错：单个分支异常（如历史数据形态异常）不影响主页其余部分
        const safe = (name, fn) => {
            try { fn.call(this); } catch (error) { console.error('应用设置失败 [' + name + ']:', error); }
        };
        safe('applyFont', this.applyFont);
        safe('applyLogo', this.applyLogo);
        safe('applyQuickLinks', this.applyQuickLinks);
        safe('applyWallpaper', this.applyWallpaper);
        safe('applyDeveloperSettings', this.applyDeveloperSettings);
        safe('applyContextMenuStyle', this.applyContextMenuStyle);
        safe('renderWidgetPanel', this.renderWidgetPanel);

        if (this.infoManager) {
            this.infoManager.applyHideInfoPopup();
        }

        if (this.settings.dynamicBlur) {
            document.body.classList.add('dynamic-blur');
        } else {
            document.body.classList.remove('dynamic-blur');
        }

        if (this.settings.dynamicBlur && this.settings.enhancedDisplay) {
            document.body.classList.add('enhanced-display');
        } else {
            document.body.classList.remove('enhanced-display');
        }

        if (this.settings.wallpaperScale) {
            document.body.classList.add('wallpaper-scale');
        } else {
            document.body.classList.remove('wallpaper-scale');
        }

        this.handlePersistentWallpaperToggle();
        this.applyStatusBarSettings();
        this.applyColorScheme();

        // 隐藏铭牌（简洁视觉效果子项）：隐藏主页面底部铭牌
        const badge = document.getElementById('ooo-badge');
        if (badge) {
            badge.style.display = this.settings.hiddenBadge ? 'none' : '';
        }

        // 底部铭牌功能：动作绑定幂等；同步子项显隐与摘要，覆盖导入设置等整体替换路径
        this.setupBadgeOpenMethod();
        this.syncBadgeOpenMethodUI();

        // OCP 播控：绑定幂等；整体替换设置（导入等）后如已关闭则立即收起
        this.setupOcpPlayer();
        if (!this.settings.ocpPlayerEnabled) {
            this.hideOcpPlayer();
        }

        // 同步固定侧边栏状态（关闭时内部负责移除 sidebar-fixed 标记并恢复 hover 控制）
        this.syncSidebarFixedState();
    },
};

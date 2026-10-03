'use strict';

// 核心类仍直接使用：init 中创建 InfoManager
import { InfoManager } from './info.js';
// 出厂默认设置与侧边栏面板共用同一来源（Stage 9）
import { DEFAULT_SETTINGS } from './settings-defaults.js';

export class OOOInterface {
    constructor() {
        // 在线图标URL配置
        this.onlineIcons = {
            'dll.png': 'https://rudan177.github.io/OOOInterface/images/dll.png',
            'dln.png': 'https://rudan177.github.io/OOOInterface/images/dln.png'
        };
        this.onlineBackgroundUrl = 'https://rudan177.github.io/OOOInterface/images/back.png';
        this.localBackgroundUrl = 'images/back.png';
        // OCP 音源：铭牌音效与播控共用，播控的封面/曲名/艺术家也读取自该文件
        this.ocpAudioUrl = 'https://rudan177.github.io/OOOInterface/images/wow.mp3';
        // 点击播控封面后打开的在线播放器
        this.ocpPlayerUrl = 'https://rudan177.github.io/CHAPTER/player.html';
        this.iconLoadStatus = {};

        // 出厂预设配置（与侧边栏面板共用 settings-defaults.js 中的唯一来源）
        // 深拷贝一份挂在实例上：下面的 Object.assign({}, this.defaultSettings, …)
        // 是浅合并，若直接引用共享对象，其嵌套对象可能被间接改写并污染另一个页面。
        this.defaultSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));

        this.currentEngine = 'google';
        this.settings = JSON.parse(JSON.stringify(this.defaultSettings)); // 深拷贝默认设置
        this.isBadgeExpanded = false;
        this.isScrolled = false;
        this.scrollTimeout = null;
        this.isAnimating = false;
        this.infoPopupOpen = false;
        this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.isFirstRun = true;
        this.userChangedLogo = false; // 标记用户是否手动更改过Logo
        this.modalScrollHandler = null;
        this.backendConnected = false; // OUA 后端连接状态，通过 localStorage 与 about.js 同步
        this.currentVersion = VERSION; // 使用 version.js 中的版本号
        this._sidebarPushing = false; // 侧边栏壁纸推入状态
        this.statusBarTimer = null;
        // 热搜词建议：防抖计时器 + 请求序号 + 结果缓存
        this.suggestDebounceTimer = null;
        this._suggestSeq = 0;
        this._suggestCache = null;
        this.statusBarContrastMode = 'dark';
        this.wallpaperAnalysisImage = null;
        this.wallpaperAnalysisUrl = null;
        this.wallpaperAnalysisPromise = null;

        // “/” 命令列表状态
        this.commandListState = { visible: false, items: [], highlight: -1 };

        // 搜索框组件模式：null | 'web' | 'translate'；translate 下已锁定的语言对
        this.searchCommandMode = null;
        this.translateSelectedPair = null;

        // 壁纸填充层
        this.wallpaperBlur = null;
        this.wallpaperMain = null;

        // 主题系统状态
        this.themes = {};           // { key: themeObject }
        this.themeOverrides = null; // { logo, font, wallpaper } 当前主题的覆盖配置
        this.builtinThemeKeys = new Set(); // themes.json 中登记的内置主题 key

        this.init();
    }

    async init() {
        await this.loadSettings();

        if (this.settings.engineLocked) {
            const savedEngine = localStorage.getItem('oooEngineLocked');
            if (savedEngine === 'google' || savedEngine === 'bing') {
                this.currentEngine = savedEngine;
            }
        }

        this.createWallpaperLayers();

        this.preloadWallpaper();

        this.initCustomSelect();

        this.initContextMenu();

        this.initAdvancedVisualEffects();

        this.infoManager = new InfoManager(this);
        this.infoManager.init();

        this.bindEvents();
        this.setupMouseScroll();

        await this.loadCustomFonts();

        this.updateCustomFontsList();

        this.updateCustomWallpapersList();

        this.initQuickAccessSidebar();

        this.initWidgetPanel();

        // 先加载主题列表（含用户导入的自定义主题），再应用外观设置，
        // 确保页面刷新后主题在首屏渲染前即恢复，避免出现默认外观闪动
        await this.loadThemes();

        try {
            this.applySettings();
        } catch (error) {
            console.error('初始化应用设置失败:', error);
        }

        this.updateCustomSchemeDropdownDots();

        this.updateDeveloperModeUI();

        if (this.settings.wallpaper === 'bing') {
            this.checkAndFetchBingWallpaper();
        }

        this.primeWallpaperEffects();

        // 注册跨上下文设置同步（侧边栏面板 ⇄ 主页面），并处理面板跳转参数
        this.setupSettingsSync();
        this.handleOpenQuickLinksParam();

        // 自动聚焦搜索框，解决浏览器新标签页地址栏抢焦点的问题
        setTimeout(() => {
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }, 100);

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            this.isDarkMode = e.matches;
            this.applyLogo();
            this.applyColorScheme();
            this.updateStatusBarTextContrast();
        });

        window.addEventListener('resize', () => {
            this.updateStatusBarTextContrast();
            this.syncWidgetCardHeights();
            if (document.getElementById('settings-modal').style.display === 'flex') {
                this.updateSettingsButtonsPosition();
            }
        });

        let badgeClickCount = 0;
        const badge = document.getElementById('ooo-badge');
        if (badge) {
            badge.addEventListener('click', () => {
                if (this.settings.dynamicBlur) {
                    badge.classList.remove('badge-bounce');
                    void badge.offsetWidth;
                    badge.classList.add('badge-bounce');
                }

                badgeClickCount++;
                if (badgeClickCount >= 10) {
                    this.showInfoPopup();
                    badgeClickCount = 0;
                }
            });
        }

    }





















    bindEvents() {
        // 欢迎界面关闭按钮
        const welcomeCloseBtn = document.getElementById('welcome-close');
        if (welcomeCloseBtn) {
            welcomeCloseBtn.addEventListener('click', () => this.hideWelcomeScreen());
        }

        // 搜索引擎切换
        document.getElementById('google-engine').addEventListener('click', () => this.switchEngine('google'));
        document.getElementById('bing-engine').addEventListener('click', () => this.switchEngine('bing'));

        // Google按钮右键事件 - 手气不错功能
        document.getElementById('google-engine').addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.performGoogleLucky();
        });

        // 状态栏双击事件 - 切换显示秒钟
        const statusBarEl = document.getElementById('status-bar');
        if (statusBarEl) {
            statusBarEl.addEventListener('dblclick', () => {
                this.settings.showStatusBarSeconds = !this.settings.showStatusBarSeconds;
                this.saveSettings();
                const showSecondsToggle = document.getElementById('show-seconds-toggle');
                if (showSecondsToggle) showSecondsToggle.checked = this.settings.showStatusBarSeconds;
                if (this.settings.statusBarEnabled) {
                    this.updateStatusBarText();
                    this.startStatusBarTimer();
                }
                this.showNotification(this.settings.showStatusBarSeconds ? '显示秒钟：开启' : '显示秒钟：关闭');
            });
        }

        // 搜索功能
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(searchInput.value);
            }
        });

        // “/” 命令列表键盘导航（ArrowUp/Down 选择、Enter 插入命令、Esc/Backspace 删除模式 chip）
        // 注意：在拦截 Enter 时必须 preventDefault，否则随后的 keypress 仍会触发 performSearch
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const chipActive = !!this.searchCommandMode;
                if ((this.commandListState && this.commandListState.visible) || chipActive) {
                    e.preventDefault();
                    if (this.searchCommandMode) {
                        this.exitSearchCommandMode();
                    } else {
                        this.hideSearchCommandList();
                        searchInput.value = '';
                        this.syncSearchAssistantUI('');
                    }
                }
                return;
            }
            // 组件模式下按退格删除椭圆：输入为空时才生效；
            // translate 已锁定语言对时先解锁语言对，再退格彻底退出
            if (e.key === 'Backspace' && this.searchCommandMode && searchInput.value === '') {
                e.preventDefault();
                if (this.searchCommandMode === 'translate' && this.translateSelectedPair) {
                    this.translateSelectedPair = null;
                    this.updateSearchModeChip();
                    this.refreshSearchDropdownPanels();
                } else {
                    this.exitSearchCommandMode();
                }
                return;
            }
            if (!this.commandListState || !this.commandListState.visible) return;
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                this.moveSearchCommandHighlight(e.key === 'ArrowDown' ? 1 : -1);
                return;
            }
            if (e.key === 'Enter' && this.commandListState.highlight >= 0) {
                e.preventDefault();
                this.applySearchCommand(this.commandListState.items[this.commandListState.highlight]);
            }
        });

        // 搜索历史相关事件
        const searchHistoryContainer = document.getElementById('search-history-container');
        const searchHistoryList = document.querySelector('.search-history-list');

        searchInput.addEventListener('focus', () => {
            this.syncSearchAssistantUI(searchInput.value);
            const clearBtn = document.querySelector('.search-clear-btn');
            if (clearBtn) {
                clearBtn.style.display = searchInput.value.length > 0 ? 'flex' : 'none';
            }
        });

        searchInput.addEventListener('input', () => {
            this.syncSearchAssistantUI(searchInput.value);
            const clearBtn = document.querySelector('.search-clear-btn');
            if (clearBtn) {
                clearBtn.style.display = searchInput.value.length > 0 ? 'flex' : 'none';
            }
        });

        const searchClearBtn = document.querySelector('.search-clear-btn');
        if (searchClearBtn) {
            searchClearBtn.addEventListener('click', () => {
                if (this.searchCommandMode) {
                    this.exitSearchCommandMode();
                } else {
                    searchInput.value = '';
                    searchClearBtn.style.display = 'none';
                    this.syncSearchAssistantUI('');
                }
                searchInput.focus();
            });
        }

        document.addEventListener('click', (e) => {
            if (!searchHistoryContainer.contains(e.target) && !searchInput.contains(e.target)) {
                this.hideSearchHistory();
            }
            const commandContainer = document.getElementById('search-command-container');
            if (commandContainer && !commandContainer.contains(e.target) && !searchInput.contains(e.target)) {
                this.hideSearchCommandList();
            }
        });

        searchHistoryList.addEventListener('click', (e) => {
            // 删除按钮优先处理,避免命中同一行时误触发搜索
            const deleteBtn = e.target.closest('.search-history-delete');
            if (deleteBtn) {
                e.stopPropagation();
                const searchQuery = deleteBtn.dataset.query;
                if (searchQuery) {
                    this.removeFromSearchHistory(searchQuery);
                }
                return;
            }

            // 历史行与热搜行均保留 search-history-item + data-query,统一回填搜索框并搜索
            const item = e.target.closest('.search-history-item');
            if (item) {
                const searchQuery = item.dataset.query;
                if (searchQuery) {
                    searchInput.value = searchQuery;
                    this.performSearch(searchQuery);
                }
            }
        });

        // 阻止搜索历史框内的滚轮事件冒泡到window，避免触发壁纸模式
        searchHistoryContainer.addEventListener('wheel', (e) => {
            e.stopPropagation();
        });

        // “/” 命令列表 / 翻译语言历史 点击事件
        const searchCommandList = document.querySelector('.search-command-list');
        if (searchCommandList) {
            searchCommandList.addEventListener('click', (e) => {
                const item = e.target.closest('.search-command-item');
                if (!item) return;
                const index = parseInt(item.dataset.index, 10);
                if (this.commandListState && this.commandListState.items[index]) {
                    this.applySearchCommand(this.commandListState.items[index]);
                }
            });

            document.getElementById('search-command-container').addEventListener('wheel', (e) => {
                e.stopPropagation();
            });
        }

        const translateHistoryList = document.querySelector('.translate-history-list');
        if (translateHistoryList) {
            translateHistoryList.addEventListener('click', (e) => {
                // 删除按钮：按 kind 分流清理对应存储，然后刷新面板
                const deleteBtn = e.target.closest('.search-history-delete');
                if (deleteBtn) {
                    e.stopPropagation();
                    if (deleteBtn.dataset.kind === 'web') {
                        this.setWebHistory(this.getWebHistory().filter(x => x && x.key !== deleteBtn.dataset.key));
                    } else if (deleteBtn.dataset.kind === 'translate') {
                        this.setTranslateHistory(this.getTranslateHistory().filter(x => x && x.pair !== deleteBtn.dataset.pair));
                    }
                    this.refreshSearchDropdownPanels();
                    return;
                }

                // 行点击：web 按 key 回填网址；translate 套用语言对
                const item = e.target.closest('.search-history-item');
                if (!item) return;

                if (item.dataset.key !== undefined) {
                    const entry = this.getWebHistory().find(x => x && x.key === item.dataset.key);
                    if (entry) {
                        this.applyWebHistoryEntry(entry);
                    }
                } else {
                    this.applyTranslateHistoryPair(item.dataset.pair || '');
                }
            });
        }

        // 模式 chip 点击退出当前模式
        const modeChip = document.getElementById('search-mode-chip');
        if (modeChip) {
            modeChip.addEventListener('click', () => {
                if (this.searchCommandMode) {
                    this.exitSearchCommandMode();
                    this.showNotification('已退出模式');
                }
                searchInput.focus();
            });
        }

        // 铭牌点击事件 - 已在 setupBadgeOpenMethod() 中处理

        // 设置弹窗事件
        document.getElementById('close-modal').addEventListener('click', () => this.closeSettings());
        document.getElementById('export-settings-btn').addEventListener('click', () => this.exportSettingsAsMarkdown());
        document.getElementById('import-settings-btn').addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.md,text/markdown';
            input.addEventListener('change', () => {
                const file = input.files && input.files[0];
                if (!file) return;
                this.importSettingsFromMarkdown(file);
            });
            input.click();
        });
        document.getElementById('back-right-panel').addEventListener('click', () => {
            const rpu = document.getElementById('right-panel-upper');
            if (rpu && rpu.dataset.subView === 'customize-items') {
                this.backToContextMenuStyleView(rpu);
            } else if (rpu && (rpu.dataset.subView === 'quick-link-add' || rpu.dataset.subView === 'quick-link-edit')) {
                const container = rpu.querySelector('.settings-menu-container');
                if (container && container._qlinput) {
                    this.hideQuickLinksAddInterface(container, container._qlinput, container._qllist, container._qlbtn);
                }
            } else if (rpu && rpu.dataset.subView === 'custom-color-editor') {
                this.backToCustomColorView(rpu);
            } else if (rpu && rpu.dataset.menuType === 'side-panel'
                && this._sidePanelView && this._sidePanelView !== 'root') {
                // 侧边栏功能子视图：顶部返回按钮逐级返回（子视图 → 功能根视图 → 关闭右面板）
                this.exitSidePanelScope();
                this.renderSidePanelConfigView(rpu);
            } else {
                this.confirmRightPanelChanges();
                this.closeSettingsMenuInRightPanel();
            }
        });

        // ESC键关闭设置窗口
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('settings-modal');
                if (modal && modal.classList.contains('show')) {
                    if (modal.classList.contains('right-panel-open')) {
                        const rpu = document.getElementById('right-panel-upper');
                        if (rpu && rpu.dataset.subView === 'customize-items') {
                            this.backToContextMenuStyleView(rpu);
                        } else if (rpu && (rpu.dataset.subView === 'quick-link-add' || rpu.dataset.subView === 'quick-link-edit')) {
                            const container = rpu.querySelector('.settings-menu-container');
                            if (container && container._qlinput) {
                                this.hideQuickLinksAddInterface(container, container._qlinput, container._qllist, container._qlbtn);
                            }
                        } else if (rpu && (rpu.dataset.subView === 'widget-config' || rpu.dataset.subView === 'widget-type-picker')) {
                            // 小组件编辑/添加表单：ESC 返回列表（带滑出动画）
                            const listContainer = rpu.querySelector('.widget-panel-list-container');
                            if (listContainer) {
                                this.exitWidgetFormView(listContainer, () => {
                                    this.restoreWidgetPanelButtons();
                                    this.updateWidgetPanelListInMenu(listContainer);
                                });
                            }
                        } else if (rpu && rpu.dataset.subView === 'custom-color-editor') {
                            this.backToCustomColorView(rpu);
                        } else if (rpu && rpu.dataset.menuType === 'side-panel'
                            && this._sidePanelView && this._sidePanelView !== 'root') {
                            // 侧边栏功能子视图：逐级返回（子视图 → 功能根视图）
                            this.exitSidePanelScope();
                            this.renderSidePanelConfigView(rpu);
                        } else if (rpu) {
                            this.confirmRightPanelChanges();
                            this.closeSettingsMenuInRightPanel();
                        }
                    } else {
                        this.closeSettings();
                    }
                }
            }
        });

        document.getElementById('font-select').addEventListener('change', (e) => this.changeFont(e.target.value));
        document.getElementById('logo-select').addEventListener('change', (e) => this.handleLogoSelectChange(e.target.value));

        // 字体文件上传事件
        document.getElementById('font-upload').addEventListener('change', (e) => {
            this.handleFontUpload(e.target.files[0]);
            e.target.value = '';
        });

        // 主题文件上传事件
        document.getElementById('theme-upload').addEventListener('change', (e) => {
            this.handleThemeUpload(e.target.files[0]);
            e.target.value = '';
        });

        // 主题选择 change 事件：兜底应用主题（正常流程由下拉项直接调用 applyTheme）
        document.getElementById('theme-select').addEventListener('change', (e) => {
            if (e.target.value && this.themes[e.target.value]) {
                this.applyTheme(e.target.value);
            }
        });

        // Logo文件上传事件
        document.getElementById('logo-upload').addEventListener('change', (e) => {
            this.handleLogoUpload(e.target.files[0]);
        });

        // 暗色Logo文件上传事件
        document.getElementById('dark-logo-upload').addEventListener('change', (e) => {
            this.handleDarkLogoUpload(e.target.files[0]);
        });

        // 壁纸选择事件
        document.getElementById('wallpaper-select').addEventListener('change', (e) => {
            this.changeWallpaper(e.target.value);
        });

        // 壁纸文件上传事件
        document.getElementById('wallpaper-upload').addEventListener('change', (e) => {
            this.handleWallpaperUpload(e.target.files[0]);
        });

        // URL壁纸由右侧面板处理，此处无需事件绑定

        // 必应壁纸信息提示图标点击事件
        const bingInfoIcon = document.getElementById('bing-wallpaper-info');
        if (bingInfoIcon) {
            bingInfoIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showBingTooltip();
            });
        }

        // 配色方案选择事件
        document.getElementById('color-scheme-select').addEventListener('change', (e) => {
            this.settings.colorScheme = e.target.value;
            this.checkThemeConsistency('colorScheme', e.target.value);
            this.saveSettings();
            this.applyColorScheme();
            if (!this.settings.hideNotifications) {
                this.showNotification('配色已更新');
            }
        });

        // 代理端口选择事件
        document.getElementById('proxy-select').addEventListener('change', (e) => {
            this.handleProxyChange(e.target.value);
        });

        // 动态模糊开关改变时，实时显示/隐藏增强显示开关
        document.getElementById('dynamic-blur-toggle').addEventListener('change', (e) => {
            const enhancedDisplayGroup = document.getElementById('enhanced-display-group');
            if (enhancedDisplayGroup) {
                enhancedDisplayGroup.style.display = e.target.checked ? 'block' : 'none';
            }
        });

        // 增强显示复选框改变时，立即同步到 settings 并更新右键菜单
        this._enhancedDisplayChangeHandler = (e) => {
            this.settings.enhancedDisplay = e.target.checked;
            this.applySettings();
            this.saveSettings();
            this.updateContextMenuIcons();
        };
        document.getElementById('enhanced-display-toggle').addEventListener('change', this._enhancedDisplayChangeHandler);

        // 快速访问侧边栏开关改变时，显示/隐藏子开关并同步状态
        document.getElementById('quick-access-sidebar-toggle').addEventListener('change', (e) => {
            const iconsGroup = document.getElementById('show-quick-icons-group');
            const iconsToggle = document.getElementById('show-quick-icons');
            if (iconsGroup && iconsToggle) {
                if (e.target.checked) {
                    iconsGroup.style.display = 'block';
                    // 恢复上次保存的状态
                    iconsToggle.checked = this.settings.showQuickLinkIcons;
                } else {
                    iconsGroup.style.display = 'none';
                    iconsToggle.checked = false;
                }
            }
        });

        // 固定侧边栏主开关改变时，显示/隐藏两个子开关并同步状态
        document.getElementById('fix-sidebar-toggle').addEventListener('change', (e) => {
            const homepageGroup = document.getElementById('fix-homepage-group');
            const wallpaperGroup = document.getElementById('fix-wallpaper-group');
            const homepageToggle = document.getElementById('fix-sidebar-homepage-toggle');
            const wallpaperToggle = document.getElementById('fix-sidebar-wallpaper-toggle');
            if (e.target.checked) {
                if (homepageGroup) homepageGroup.style.display = 'block';
                if (wallpaperGroup) wallpaperGroup.style.display = 'block';
                // 开启主开关时，子开关一并开启
                if (homepageToggle) homepageToggle.checked = true;
                if (wallpaperToggle) wallpaperToggle.checked = true;
            } else {
                if (homepageGroup) homepageGroup.style.display = 'none';
                if (wallpaperGroup) wallpaperGroup.style.display = 'none';
                // 关闭主开关时，子开关一并关闭
                if (homepageToggle) homepageToggle.checked = false;
                if (wallpaperToggle) wallpaperToggle.checked = false;
            }
        });

        // 简洁视觉效果主开关改变时，联动全部子开关并即时生效
        // （禁止提示按默认临时7天开启，设置页内双击该子开关才为永久；程序设置 checked 不触发子开关的 change 事件）
        document.getElementById('simple-visual-toggle').addEventListener('change', (e) => {
            const checked = e.target.checked;

            this.settings.hideNotifications = checked;
            this.settings.hideInfoPopup = checked
                ? { enabled: true, type: 'temporary', timestamp: Date.now() }
                : { enabled: false, type: null, timestamp: null };
            this.settings.hiddenBadge = checked;

            this.applySettings();
            this.saveSettings();
            this.syncSettingsPageToggles();
            this.updateContextMenuIcons();
            this.showNotification(checked ? '简洁视觉效果：开启' : '简洁视觉效果：关闭');
        });

        // 隐藏弹窗子开关：立即生效
        document.getElementById('hide-notifications-toggle').addEventListener('change', (e) => {
            this.settings.hideNotifications = e.target.checked;
            this.applySettings();
            this.saveSettings();
            this.syncSettingsPageToggles();
            this.updateContextMenuIcons();
            this.showNotification(e.target.checked ? '隐藏弹窗：开启' : '隐藏弹窗：关闭');
        });

        // 隐藏铭牌子开关：立即生效
        document.getElementById('hidden-badge-toggle').addEventListener('change', (e) => {
            this.settings.hiddenBadge = e.target.checked;
            this.applySettings();
            this.saveSettings();
            this.syncSettingsPageToggles();
            this.showNotification(e.target.checked ? '隐藏铭牌：开启' : '隐藏铭牌：关闭');
        });

        // OCP 播控开关：开启后 OCP 播放过一次即可 hover 铭牌呼出播控；关闭时立即收起
        document.getElementById('ocp-player-toggle').addEventListener('change', (e) => {
            this.settings.ocpPlayerEnabled = e.target.checked;
            if (!e.target.checked) {
                this.hideOcpPlayer();
            }
            this.saveSettings();
            this.showNotification(e.target.checked ? 'OCP播控：开启' : 'OCP播控：关闭');
        });

        // 小组件列表下拉点击 → 右面板管理界面
        const widgetPanelSelectSelected = document.getElementById('widget-panel-select-selected');
        if (widgetPanelSelectSelected) {
            widgetPanelSelectSelected.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showWidgetPanelMenuInRightPanel();
            });
        }

        // 状态栏主开关改变时，显示/隐藏子开关并保留上次保存的秒钟偏好
        document.getElementById('status-bar-toggle').addEventListener('change', (e) => {
            const showSecondsGroup = document.getElementById('show-seconds-group');
            const showSecondsToggle = document.getElementById('show-seconds-toggle');
            if (showSecondsGroup && showSecondsToggle) {
                if (e.target.checked) {
                    showSecondsGroup.style.display = 'block';
                    showSecondsToggle.checked = this.settings.showStatusBarSeconds;
                } else {
                    showSecondsGroup.style.display = 'none';
                    showSecondsToggle.checked = false;
                }
            }
        });

        document.getElementById('shortcuts-toggle').addEventListener('change', (e) => {
            this.settings.shortcutsEnabled = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('shortcuts-hint').addEventListener('click', (e) => {
            e.stopPropagation();
            this.showShortcutsHint();
        });

        // 壁纸常显示开关改变时，实时显示/隐藏壁纸缩放开关
        document.getElementById('persistent-wallpaper-toggle').addEventListener('change', (e) => {
            const wallpaperScaleGroup = document.getElementById('wallpaper-scale-group');
            if (wallpaperScaleGroup) {
                wallpaperScaleGroup.style.display = e.target.checked ? 'block' : 'none';
            }
        });

        // 设置文字Logo事件
        document.getElementById('set-text-logo').addEventListener('click', (e) => {
            e.stopPropagation();
            this.setTextLogo();
        });

        // 应用按钮事件
        document.getElementById('apply-settings').addEventListener('click', () => {
            try {
                this.settings.dynamicBlur = document.getElementById('dynamic-blur-toggle').checked;
                this.settings.enhancedDisplay = document.getElementById('enhanced-display-toggle').checked;
                const oldPersistentWallpaper = this.settings.persistentWallpaper;
                this.settings.persistentWallpaper = document.getElementById('persistent-wallpaper-toggle').checked;
                this.settings.wallpaperScale = document.getElementById('wallpaper-scale-toggle').checked;
                // 读取右侧面板填满开关（如果面板打开时）
                const panelFillToggle = document.getElementById('wallpaper-fill-toggle-panel');
                if (panelFillToggle) {
                    this.settings.wallpaperFill = panelFillToggle.checked;
                }
                // 读取固定侧边栏主开关与子开关
                const fixSidebarToggle = document.getElementById('fix-sidebar-toggle');
                if (fixSidebarToggle) {
                    this.settings.fixSidebarEnabled = fixSidebarToggle.checked;
                }
                const fixHomepageToggle = document.getElementById('fix-sidebar-homepage-toggle');
                if (fixHomepageToggle) {
                    this.settings.fixSidebarHomepage = fixHomepageToggle.checked;
                }
                const fixWallpaperToggle = document.getElementById('fix-sidebar-wallpaper-toggle');
                if (fixWallpaperToggle) {
                    this.settings.fixSidebarWallpaper = fixWallpaperToggle.checked;
                }
                this.settings.searchHistory = document.getElementById('search-history-toggle').checked;
                this.settings.searchSuggestions = document.getElementById('search-suggestions-toggle').checked;
                this.settings.engineLocked = document.getElementById('engine-lock-toggle').checked;
                this.settings.contextMenuStyle = document.getElementById('context-menu-style').value;

                // 读取快速访问侧边栏开关
                const newQuickLinkToggle = document.getElementById('quick-access-sidebar-toggle');
                if (newQuickLinkToggle) {
                    this.settings.quickAccessSidebar = newQuickLinkToggle.checked;
                }

                // 读取显示图标开关
                const showIconsToggle = document.getElementById('show-quick-icons');
                if (showIconsToggle) {
                    this.settings.showQuickLinkIcons = showIconsToggle.checked;
                }

                const statusBarToggle = document.getElementById('status-bar-toggle');
                if (statusBarToggle) {
                    this.settings.statusBarEnabled = statusBarToggle.checked;
                }

                const showSecondsToggle = document.getElementById('show-seconds-toggle');
                if (showSecondsToggle && this.settings.statusBarEnabled) {
                    this.settings.showStatusBarSeconds = showSecondsToggle.checked;
                }

                // 读取隐藏弹窗开关
                const hideNotifToggle = document.getElementById('hide-notifications-toggle');
                if (hideNotifToggle) {
                    this.settings.hideNotifications = hideNotifToggle.checked;
                }

                // 读取禁止提示开关
                const hideInfoToggle = document.getElementById('hide-info-popup-toggle');
                if (hideInfoToggle) {
                    this.settings.hideInfoPopup = {
                        enabled: hideInfoToggle.checked,
                        type: hideInfoToggle.checked ? 'permanent' : null,
                        timestamp: hideInfoToggle.checked ? Date.now() : null
                    };
                }

                // 读取隐藏铭牌开关（简洁视觉效果主开关由子开关状态派生，无需读取）
                const hiddenBadgeToggle = document.getElementById('hidden-badge-toggle');
                if (hiddenBadgeToggle) {
                    this.settings.hiddenBadge = hiddenBadgeToggle.checked;
                }

                // 底部铭牌功能（双击/右键动作）在右面板选择时已即时保存，此处无需再读取

                if (oldPersistentWallpaper !== this.settings.persistentWallpaper) {
                    this.handlePersistentWallpaperToggle();
                }

                this.applySettings();
                this.saveSettings();
                this.updateContextMenuIcons();
                this.closeSettings();
                this.showNotification('设置已应用');
                // 无需刷新页面，所有设置已通过组件级更新即时生效
            } catch (err) {
                console.error('[Apply] 点击处理异常:', err);
                this.showNotification('应用设置时出错: ' + err.message);
            }
        });

        // 右键应用按钮打开/关闭开发者模式
        document.getElementById('apply-settings').addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.settings.developerMode = !this.settings.developerMode;
            this.saveSettings();
            this.updateDeveloperModeUI();
            this.applyDeveloperSettings();
            this.applyStatusBarSettings();
            this.showNotification(this.settings.developerMode ? '开发者模式已开启' : '开发者模式已关闭');
        });

        // 恢复出厂设置按钮事件（两步确认弹窗）
        document.getElementById('reset-settings').addEventListener('click', () => {
            this.showResetConfirmation(() => this.resetToDefaults());
        });

        // 关于按钮事件 - 左键打开UpdateLog.html
        document.getElementById('about-btn').addEventListener('click', () => {
            window.location.href = 'about/about.html';
        });

        // 关于按钮右键事件 - 右键打开welc.html
        document.getElementById('about-btn').addEventListener('contextmenu', (e) => {
            e.preventDefault();
            window.location.href = 'welc/welc.html?manual=true';
        });

        // 反馈按钮事件
        document.getElementById('feedback-btn').addEventListener('contextmenu', (e) => {
            e.preventDefault();
            // 播放音频
            this.playBadgeAudio();
        });
        document.getElementById('feedback-btn').addEventListener('click', () => {
            window.location.href = 'FB/fb.html';
        });

        // 字体大小滑块事件
        document.getElementById('font-size-slider').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            document.getElementById('font-size-value').value = value.toFixed(1);
            this.settings.fontSize = value;
            this.applyDeveloperSettings();
        });

        // 字体大小输入框事件
        document.getElementById('font-size-value').addEventListener('input', (e) => {
            let value = parseFloat(e.target.value);
            if (isNaN(value)) value = 1;
            if (value < 0.5) value = 0.5;
            if (value > 2) value = 2;
            document.getElementById('font-size-slider').value = value;
            this.settings.fontSize = value;
            this.applyDeveloperSettings();
        });

        // 字体大小输入框滚轮事件
        document.getElementById('font-size-value').addEventListener('wheel', (e) => {
            e.preventDefault();
            let value = parseFloat(e.target.value) || 1;
            value += e.deltaY > 0 ? -0.1 : 0.1;
            if (value < 0.5) value = 0.5;
            if (value > 2) value = 2;
            value = Math.round(value * 10) / 10;
            e.target.value = value.toFixed(1);
            document.getElementById('font-size-slider').value = value;
            this.settings.fontSize = value;
            this.applyDeveloperSettings();
        });

        // 字体粗细滑块事件
        document.getElementById('font-weight-slider').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('font-weight-value').value = value;
            this.settings.fontWeight = value;
            this.applyDeveloperSettings();
        });

        // 字体粗细输入框事件
        document.getElementById('font-weight-value').addEventListener('input', (e) => {
            let value = parseInt(e.target.value);
            if (isNaN(value)) value = 400;
            if (value < 100) value = 100;
            if (value > 900) value = 900;
            value = Math.round(value / 100) * 100;
            document.getElementById('font-weight-slider').value = value;
            this.settings.fontWeight = value;
            this.applyDeveloperSettings();
        });

        // 字体粗细输入框失焦时四舍五入显示
        document.getElementById('font-weight-value').addEventListener('blur', (e) => {
            let value = parseInt(e.target.value);
            if (isNaN(value)) value = 400;
            if (value < 100) value = 100;
            if (value > 900) value = 900;
            value = Math.round(value / 100) * 100;
            e.target.value = value;
        });

        // 字体粗细输入框滚轮事件
        document.getElementById('font-weight-value').addEventListener('wheel', (e) => {
            e.preventDefault();
            let value = parseInt(e.target.value) || 400;
            value += e.deltaY > 0 ? -100 : 100;
            if (value < 100) value = 100;
            if (value > 900) value = 900;
            e.target.value = value;
            document.getElementById('font-weight-slider').value = value;
            this.settings.fontWeight = value;
            this.applyDeveloperSettings();
        });

        // 搜索框高度滑块事件
        document.getElementById('search-box-height').addEventListener('input', (e) => {
            const value = parseInt(e.target.value) || 0;
            document.getElementById('search-box-height-value').value = value;
            this.settings.searchBoxHeight = value;
            this.applyDeveloperSettings();
        });

        // 搜索框高度输入框事件
        document.getElementById('search-box-height-value').addEventListener('input', (e) => {
            let value = parseInt(e.target.value) || 0;
            if (value < 0) value = 0;
            if (value > 600) value = 600;
            document.getElementById('search-box-height').value = value;
            this.settings.searchBoxHeight = value;
            this.applyDeveloperSettings();
        });

        // 搜索框高度输入框滚轮事件
        document.getElementById('search-box-height-value').addEventListener('wheel', (e) => {
            e.preventDefault();
            let value = parseInt(e.target.value) || 0;
            value += e.deltaY > 0 ? -1 : 1;
            if (value < 0) value = 0;
            if (value > 600) value = 600;
            e.target.value = value;
            document.getElementById('search-box-height').value = value;
            this.settings.searchBoxHeight = value;
            this.applyDeveloperSettings();
        });

        // 重置按钮事件
        document.querySelectorAll('.reset-control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetId = e.target.dataset.target;
                const defaultValue = e.target.dataset.default;
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    targetElement.value = defaultValue;

                    if (targetId === 'font-size-slider') {
                        this.settings.fontSize = parseFloat(defaultValue);
                        document.getElementById('font-size-value').value = defaultValue;
                    } else if (targetId === 'font-weight-slider') {
                        this.settings.fontWeight = parseInt(defaultValue);
                        document.getElementById('font-weight-value').value = defaultValue;
                    } else if (targetId === 'search-box-height') {
                        this.settings.searchBoxHeight = parseInt(defaultValue);
                        document.getElementById('search-box-height-value').value = defaultValue;
                    }

                    this.applyDeveloperSettings();
                    this.saveSettings();
                }
            });
        });

        // 开发者模式重置按钮事件
        const resetDeveloperBtn = document.getElementById('reset-developer-settings');
        if (resetDeveloperBtn) {
            resetDeveloperBtn.addEventListener('click', () => {
                this.resetDeveloperSettings();
            });
        }

        // 点击弹窗外部关闭
        document.getElementById('settings-modal').addEventListener('click', (e) => {
            if (e.target.id === 'settings-modal') {
                const rpu = document.getElementById('right-panel-upper');
                if (rpu && rpu.querySelector('[data-drag-just-happened]')) return;
                this.closeSettings();
            }
        });

        // 滚轮事件 - 向下滚动出现壁纸，向上恢复
        window.addEventListener('wheel', (e) => this.handleScroll(e), { passive: true });

        // 触摸滑动壁纸（移动端）
        let touchStartY = 0;
        let touchActive = false;

        window.addEventListener('touchstart', (e) => {
            if (document.body.classList.contains('widget-panel-open')) return;
            if (e.target.closest('.modal') ||
                e.target.closest('.search-section') ||
                e.target.closest('.engine-buttons') ||
                e.target.closest('.quick-access-links')) return;
            touchStartY = e.touches[0].pageY;
            touchActive = true;
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (document.body.classList.contains('widget-panel-open')) return;
            if (!touchActive || this.isAnimating) return;
            const deltaY = touchStartY - e.touches[0].pageY;
            if (Math.abs(deltaY) > 15) {
                this.handleScroll({ deltaY: deltaY, target: e.target });
                touchActive = false;
            }
        }, { passive: true });

        // 防止页面滚动
        window.addEventListener('keydown', (e) => {
            if (e.key === ' ' && e.target === document.body) {
                e.preventDefault();
            }
        });

        // 快捷键（开发者模式）
        document.addEventListener('keydown', (e) => {
            if (!this.settings.shortcutsEnabled) return;

            const ctrl = e.ctrlKey || e.metaKey;
            const modal = document.getElementById('settings-modal');
            const inSettings = modal && modal.classList.contains('show');

            // Ctrl+S - 应用设置（仅在设置页面中）
            if (ctrl && (e.key === 's' || e.key === 'S')) {
                e.preventDefault();
                if (inSettings) {
                    document.getElementById('apply-settings').click();
                }
                return;
            }

            // Ctrl+H - 切换搜索历史框
            if (ctrl && (e.key === 'h' || e.key === 'H')) {
                e.preventDefault();
                if (!inSettings) {
                    const container = document.getElementById('search-history-container');
                    if (container && container.classList.contains('show')) {
                        this.hideSearchHistory();
                    } else {
                        this.showSearchHistory(document.getElementById('search-input').value);
                    }
                }
                return;
            }

            // Ctrl+, - 打开设置页面
            if (ctrl && e.key === ',') {
                e.preventDefault();
                if (!inSettings) {
                    this.openSettings('shortcut');
                }
                return;
            }

            // Tab - 聚焦搜索框（不在设置页面时；快捷轮盘打开时跳过，避免打断选择）
            if (e.key === 'Tab' && !inSettings && !e.shiftKey &&
                !(window.oooController && window.oooController.radialActive)) {
                const searchInput = document.getElementById('search-input');
                if (searchInput && document.activeElement !== searchInput) {
                    e.preventDefault();
                    searchInput.focus();
                }
            }
        });

        // 右键菜单事件
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();

            // 搜索框右键自动粘贴剪贴板内容
            if (e.target.closest('.search-section')) {
                this.pasteToSearch();
                return;
            }

            if (!e.target.closest('.ooo-badge') &&
                !e.target.closest('.modal') &&
                !e.target.closest('.engine-buttons') &&
                !e.target.closest('.quick-access-links')) {
                this.showContextMenu(e);
            }
        });

        // 点击页面其他地方关闭右键菜单
        document.addEventListener('click', (e) => {
            if (this.contextMenu && !this.contextMenu.contains(e.target)) {
                this.hideContextMenu();
            }
        });

        // 右键菜单项目点击事件
        if (this.contextMenu) {
            this.contextMenu.addEventListener('click', (e) => {
                const menuItem = e.target.closest('.context-menu-item');
                if (menuItem) {
                    const action = menuItem.dataset.action;
                    this.handleContextMenuAction(action);
                    this.hideContextMenu();
                }
            });
        }

        // 拖拽上传功能
        this.setupDragAndDrop();

        // 文字Logo输入框回车键支持
        const textLogoInput = document.getElementById('text-logo-input');
        const textLogoInlineGroup = document.getElementById('text-logo-inline-group');
        const textLogoBtn = document.getElementById('set-text-logo');

        // 计算字符长度（中文算2个字符）
        const getCharLength = (str) => {
            let length = 0;
            for (let i = 0; i < str.length; i++) {
                const charCode = str.charCodeAt(i);
                if (charCode > 127) {
                    length += 2;
                } else {
                    length += 1;
                }
            }
            return length;
        };

        // 检查输入长度
        const checkTextLogoInputLength = () => {
            if (!textLogoInput || !textLogoBtn) return true;
            const text = textLogoInput.value;
            const length = getCharLength(text);
            if (length > 25) {
                textLogoBtn.disabled = true;
                textLogoBtn.classList.add('disabled');
                textLogoInput.classList.add('error');
                this.showNotification('超出输入范围');
                return false;
            } else {
                textLogoBtn.disabled = false;
                textLogoBtn.classList.remove('disabled');
                textLogoInput.classList.remove('error');
                return true;
            }
        };

        if (textLogoInput) {
            textLogoInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    if (!textLogoBtn.disabled) {
                        this.setTextLogo();
                    }
                }
            });
            textLogoInput.addEventListener('input', () => {
                checkTextLogoInputLength();
            });
            // 阻止点击事件冒泡，防止关闭下拉菜单
            textLogoInput.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        if (textLogoInlineGroup) {
            textLogoInlineGroup.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // 快速访问链接选择框点击事件
        const quickLinksSelectSelected = document.getElementById('quick-links-select-selected');
        const quickLinksSelectItems = document.getElementById('quick-links-select-items');

        if (quickLinksSelectSelected && quickLinksSelectItems) {
            quickLinksSelectSelected.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showQuickLinksMenuInRightPanel();
            });
        }

        this.initHideInfoPopupToggle();
    }






















    // 预设字体名称到字体文件路径的映射
    static get PRESET_FONT_PATHS() {
        return {
            'Sans Flex': '../fonts/GoogleSansFlex.ttf',
            'Ginto': '../fonts/ABCGintoVariable.ttf',
            'Josefin': '../fonts/JosefinSans.ttf',
            'Code': '../fonts/GoogleSansCode.ttf',
            'HMSC': '../fonts/HarmonyOS_SansSC.ttf'
        };
    }

}



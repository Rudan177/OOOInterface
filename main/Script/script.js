class OOOInterface {
    constructor() {
        // 在线图标URL配置
        this.onlineIcons = {
            'dll.png': 'https://rudan177.github.io/OOOInterface/images/dll.png',
            'dln.png': 'https://rudan177.github.io/OOOInterface/images/dln.png'
        };
        this.onlineBackgroundUrl = 'https://rudan177.github.io/OOOInterface/images/back.png';
        this.localBackgroundUrl = 'images/back.png';
        this.iconLoadStatus = {};

        // 出厂预设配置
        this.defaultSettings = {
            font: 'Sans Flex',
            logo: 'default',
            logoType: 'image',
            textLogo: '',
            customLogos: [],
            customFonts: [],
            customWallpapers: [],
            wallpaperSeries: [],
            quickLinks: [],
            wallpaper: 'default',
            wallpaperUrl: '',
            dynamicBlur: false,
            persistentWallpaper: false,
            searchHistory: true,
            searchHistoryItems: [],
            developerMode: false,
            proxyPort: null,
            fontSize: 1,
            fontWeight: 400,
            searchBoxHeight: 50,
            enhancedDisplay: false,
            wallpaperScale: false,
            wallpaperFill: true,
            colorScheme: 'green',
            customPrimaryColor: '',
            customSecondaryColor: '',
            customGradientEnabled: false,
            customGradientStart: 0,
            customGradientEnd: 100,
            customColors: [],
            activeCustomColorIndex: -1,
            contextMenuStyle: 'default',
            hideInfoPopup: { enabled: false, type: null, timestamp: null },
            badgeOpenMethod: 'both',
            bingRefreshEveryTime: true,
            bingRefreshInterval: 0,
            quickAccessSidebar: true,
            showQuickLinkIcons: true,
            statusBarEnabled: false,
            showStatusBarSeconds: false,
            hideNotifications: false,
            contextMenuCustomItems: ['wallpaper-toggle', 'search-history-toggle'],
            shortcutsEnabled: true,
            theme: 'default',           // 当前主题 key（文件 basename 去扩展名）
            themeEnabled: false,        // 主题功能是否开启
            themeColorScheme: null,     // 当主题 color.colorGroup === 'add' 时存放完整配色配置
            customThemes: []             // 用户导入的自定义主题 [{key, name, designer, version, data}]
        };

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
        this.currentVersion = VERSION; // 使用 version.js 中的版本号
        this._sidebarPushing = false; // 侧边栏壁纸推入状态
        this.statusBarTimer = null;
        this.statusBarContrastMode = 'dark';
        this.wallpaperAnalysisImage = null;
        this.wallpaperAnalysisUrl = null;
        this.wallpaperAnalysisPromise = null;

        // 壁纸填充层
        this.wallpaperBlur = null;
        this.wallpaperMain = null;

        // 主题系统状态
        this.themes = {};           // { key: themeObject }
        this.themeOverrides = null; // { logo, font, wallpaper } 当前主题的覆盖配置

        this.init();
    }

    init() {
        this.loadSettings();

        this.createWallpaperLayers();

        this.preloadWallpaper();

        this.initCustomSelect();

        this.initContextMenu();

        this.initAdvancedVisualEffects();

        this.infoManager = new InfoManager(this);
        this.infoManager.init();

        this.bindEvents();
        this.setupMouseScroll();

        this.loadCustomFonts();

        this.updateCustomFontsList();

        this.updateCustomWallpapersList();

        this.initQuickAccessSidebar();

        this.applySettings();

        // 异步加载主题列表（不阻塞首屏）
        this.loadThemes();

        this.updateCustomSchemeDropdownDots();

        this.updateDeveloperModeUI();

        if (this.settings.wallpaper === 'bing') {
            this.checkAndFetchBingWallpaper();
        }

        this.primeWallpaperEffects();

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

    // 初始化右键菜单
    initContextMenu() {
        this.contextMenu = document.getElementById('context-menu');
        this.contextMenuItems = document.querySelectorAll('.context-menu-item');
        this.updateContextMenuIcons();
        this.initContextMenuCustomize();
    }

    updateContextMenuIcons() {
        // 更新所有可切换菜单项的图标
        const toggleMap = {
            'search-history-toggle': () => this.settings.searchHistory ? 'check_box' : 'check_box_outline_blank',
            'wallpaper-toggle': () => this.settings.persistentWallpaper ? 'check_box' : 'check_box_outline_blank',
            'enhanced-display-toggle': () => this.settings.enhancedDisplay ? 'check_box' : 'check_box_outline_blank',
            'hide-notifications-toggle': () => this.settings.hideNotifications ? 'check_box' : 'check_box_outline_blank',
            'hide-info-popup-toggle': () => this.settings.hideInfoPopup.enabled ? 'check_box' : 'check_box_outline_blank'
        };
        Object.keys(toggleMap).forEach(action => {
            const el = document.querySelector(`[data-action="${action}"] .md3-icon`);
            if (el) el.textContent = toggleMap[action]();
        });
    }

    syncSettingsPageToggles() {
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
        const hn = document.getElementById('hide-notifications-toggle');
        if (hn) hn.checked = this.settings.hideNotifications;
        const hip = document.getElementById('hide-info-popup-toggle');
        if (hip) hip.checked = this.settings.hideInfoPopup.enabled;
        this.updateHideInfoPopupLabel();
    }

    // 初始化右键菜单项自定义面板
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
    }

    // 同步自定义面板UI
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
            countEl.textContent = `${selected.length}/5 已选择`;
        }

        // 极简模式下禁用
        const isMinimal = this.settings.contextMenuStyle === 'minimal';
        if (btn) btn.disabled = isMinimal;
        if (isMinimal) {
            panel.classList.add('select-hide');
        }
    }

    // 应用右键菜单项自定义（在显示菜单时调用）
    applyContextMenuCustomItems() {
        const toggleActions = [
            'search-history-toggle',
            'wallpaper-toggle',
            'enhanced-display-toggle',
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
    }

    // 初始化高级视觉效果
    initAdvancedVisualEffects() {
        // 创建粒子容器
        if (!document.getElementById('particles-container')) {
            const particlesContainer = document.createElement('div');
            particlesContainer.id = 'particles-container';
            document.body.appendChild(particlesContainer);
        }

        // 创建光晕容器
        if (!document.getElementById('glow-orbs-container')) {
            const glowOrbsContainer = document.createElement('div');
            glowOrbsContainer.id = 'glow-orbs-container';
            document.body.appendChild(glowOrbsContainer);
        }

        // 初始化粒子
        this.particles = [];
        this.glowOrbs = [];
        this.particleInterval = null;
        this.isAdvancedEffectsActive = false;

        // 如果开启了动态模糊（高级视觉效果），立即预启动动画
        if (this.settings.dynamicBlur) {
            // 等待 DOM 加载完成后启动
            requestAnimationFrame(() => {
                this.startAdvancedVisualEffects();
            });
        }
    }

    // 启动高级视觉效果
    startAdvancedVisualEffects() {
        if (this.isAdvancedEffectsActive) return;
        this.isAdvancedEffectsActive = true;

        // 立即创建光晕
        this.createGlowOrbs();
    }

    // 停止高级视觉效果
    stopAdvancedVisualEffects() {
        this.isAdvancedEffectsActive = false;

        // 停止粒子生成
        if (this.particleInterval) {
            clearInterval(this.particleInterval);
            this.particleInterval = null;
        }

        // 移除所有粒子
        const particlesContainer = document.getElementById('particles-container');
        if (particlesContainer) {
            particlesContainer.innerHTML = '';
        }

        // 移除所有光晕
        const glowOrbsContainer = document.getElementById('glow-orbs-container');
        if (glowOrbsContainer) {
            glowOrbsContainer.innerHTML = '';
        }

        this.particles = [];
        this.glowOrbs = [];
    }

    // 创建单个粒子
    createParticle() {
        const container = document.getElementById('particles-container');
        if (!container) return;

        // 限制同时存在的粒子数量，避免性能问题
        if (container.children.length >= 20) return;

        const particle = document.createElement('div');
        particle.className = 'particle';

        // 随机属性 - 减少计算量
        const size = Math.random() * 6 + 2;
        const left = Math.random() * 100;
        const duration = Math.random() * 8 + 6; // 缩短动画时间
        const delay = Math.random() * 2;
        const colorConfig = this.getColorConfig();
        const hue = colorConfig.particleHueMin + Math.random() * colorConfig.particleHueRange;
        const saturation = colorConfig.particleSaturation || 80;

        // 更高效的样式设置
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.background = `radial-gradient(circle, hsla(${hue}, ${saturation}%, 70%, 0.8) 0%, hsla(${hue}, ${saturation}%, 70%, 0) 70%)`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.boxShadow = `0 0 ${size * 2}px hsla(${hue}, ${saturation}%, 70%, 0.5)`;

        // 使用 requestAnimationFrame 优化渲染
        requestAnimationFrame(() => {
            container.appendChild(particle);
        });

        // 动画结束后移除粒子
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, (duration + delay) * 1000);
    }

    // 创建光晕
    createGlowOrbs() {
        const container = document.getElementById('glow-orbs-container');
        if (!container) return;

        // 清空现有光晕
        container.innerHTML = '';

        const colorConfig = this.getColorConfig();
        const colors = colorConfig.glowOrbs;

        for (let i = 0; i < 4; i++) {
            const orb = document.createElement('div');
            orb.className = 'glow-orb';

            const size = Math.random() * 150 + 120;
            const left = Math.random() * 80 + 10;
            const top = Math.random() * 80 + 10;
            const delay = Math.random() * -20;

            orb.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                top: ${top}%;
                background: ${colors[i]};
                animation-delay: ${delay}s;
            `;

            container.appendChild(orb);
            this.glowOrbs.push(orb);
        }
    }

    // 初始化自定义下拉菜单
    initCustomSelect() {
        // 获取所有自定义下拉菜单
        const customSelects = document.querySelectorAll('.custom-select');

        customSelects.forEach(select => {
            const selected = select.querySelector('.select-selected');
            const items = select.querySelector('.select-items');
            const selectItems = select.querySelectorAll('.select-item');
            const hiddenSelect = select.querySelector('select');

            // 点击选中区域显示/隐藏选项
            selected.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();

                this.showSettingsMenuInRightPanel(items, selected, hiddenSelect);
            });

            // 点击选项更新选中值
            selectItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();

                    // 更新显示的选中值
                    const value = item.getAttribute('data-value');

                    // 如果是自定义文字Logo选项，特殊处理
                    if (value === 'text-logo') {
                        // 显示输入框
                        const textLogoGroup = document.getElementById('text-logo-inline-group');
                        if (textLogoGroup) {
                            textLogoGroup.style.display = 'flex';
                        }
                        // 给选项添加selected类
                        item.classList.add('selected');
                        // 不关闭下拉菜单，让用户可以输入
                        return;
                    }

                    // 隐藏文字Logo输入框并移除selected类
                    const textLogoGroup = document.getElementById('text-logo-inline-group');
                    const textLogoItem = document.querySelector('.select-item-text-logo');
                    if (textLogoGroup) {
                        textLogoGroup.style.display = 'none';
                    }
                    if (textLogoItem) {
                        textLogoItem.classList.remove('selected');
                    }

                    // 获取文本内容，优先使用span元素
                    const spanEl = item.querySelector('span:last-child');
                    const text = spanEl ? spanEl.textContent : item.textContent;
                    selected.textContent = text;

                    // 更新隐藏的select元素的值并触发change事件
                    hiddenSelect.value = value;
                    const event = new Event('change', { bubbles: true });
                    hiddenSelect.dispatchEvent(event);

                    // 关闭下拉菜单
                    items.classList.add('select-hide');
                });
            });
        });

        // 点击页面其他地方关闭下拉菜单
        document.addEventListener('click', () => {
            document.querySelectorAll('.select-items').forEach(item => {
                item.classList.add('select-hide');
            });
        });
    }

    // 加载自定义字体
    loadCustomFonts() {
        this.settings.customFonts.forEach(font => {
            const fontFace = new FontFace(font.name, `url(${font.data})`);

            fontFace.load().then((loadedFace) => {
                document.fonts.add(loadedFace);
            }).catch((error) => {
                console.error('自定义字体加载失败:', error);
            });
        });
    }

    // ========== 主题系统 ==========

    // 加载所有主题：读取 themes.json 清单逐个加载
    // 用户新增主题时，将 .js 文件放入 Themes/ 目录，并在 themes.json 中登记文件名
    async loadThemes() {
        this.themes = {};
        let fileNames = [];

        try {
            const response = await fetch('Themes/themes.json');
            if (response.ok) {
                const data = await response.json();
                fileNames = Array.isArray(data.themes) ? data.themes : [];
            }
        } catch (e) {
            console.warn('themes.json 加载失败:', e);
        }

        for (const fileName of fileNames) {
            if (!fileName.endsWith('.js')) continue;
            try {
                const theme = await this.loadThemeFile(fileName);
                if (theme && theme.info && theme.details) {
                    const key = fileName.replace(/\.js$/, '');
                    this.themes[key] = this.normalizeThemePaths(theme);
                }
            } catch (e) {
                console.warn(`主题文件 ${fileName} 加载失败:`, e);
            }
        }

        this.populateThemeSelect();

        // 注册已导入的自定义主题
        if (this.settings.customThemes) {
            this.settings.customThemes.forEach(ct => {
                if (ct.data && !this.themes[ct.key]) {
                    this.themes[ct.key] = ct.data;
                }
            });
        }

        // 页面刷新后恢复主题样式
        if (this.settings.themeEnabled && this.settings.theme && this.themes[this.settings.theme]) {
            this.applyTheme(this.settings.theme, { silent: true });
        }
    }

    // 通过 <script> 标签加载单个主题文件，捕获 DEFAULT_THEME 全局变量
    loadThemeFile(fileName) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `Themes/${fileName}`;
            script.async = false;
            script.onload = () => {
                const theme = window.DEFAULT_THEME;
                try { delete window.DEFAULT_THEME; } catch (e) { window.DEFAULT_THEME = undefined; }
                script.remove();
                if (theme) {
                    resolve(theme);
                } else {
                    reject(new Error(`${fileName} 未声明 DEFAULT_THEME`));
                }
            };
            script.onerror = () => {
                script.remove();
                reject(new Error(`${fileName} 加载失败`));
            };
            document.head.appendChild(script);
        });
    }

    // 路径规范化：主题文件位于 main/Themes/，其内部 location 写法 ../xxx 需转为相对 main/ 的路径
    normalizeThemePaths(theme) {
        const fix = (p) => (typeof p === 'string' && p.startsWith('../')) ? p.substring(3) : p;
        const d = theme.details;
        if (!d) return theme;
        if (d.logo) {
            d.logo.location = fix(d.logo.location);
            if (d.logo.specialStyle) {
                if (d.logo.specialStyle.dark) d.logo.specialStyle.dark = fix(d.logo.specialStyle.dark);
                // online/onlineDark 是绝对 URL，不动
            }
        }
        if (d.font) d.font.location = fix(d.font.location);
        if (d.wallpaper) {
            d.wallpaper.location = fix(d.wallpaper.location);
            // online 是绝对 URL，不动
        }
        if (d.moreStyle) d.moreStyle.location = fix(d.moreStyle.location);
        return theme;
    }

    // 填充左面板"选择主题"下拉项
    populateThemeSelect() {
        const itemsContainer = document.getElementById('theme-select-items');
        const hiddenSelect = document.getElementById('theme-select');
        const selectedDisplay = document.getElementById('theme-select-selected');
        if (!itemsContainer || !hiddenSelect) return;

        itemsContainer.innerHTML = '';
        hiddenSelect.innerHTML = '';

        const keys = Object.keys(this.themes);
        keys.forEach(key => {
            const theme = this.themes[key];
            const item = document.createElement('div');
            item.className = 'select-item';
            item.setAttribute('data-value', key);
            item.textContent = theme.info.name;
            itemsContainer.appendChild(item);

            const option = document.createElement('option');
            option.value = key;
            option.textContent = theme.info.name;
            hiddenSelect.appendChild(option);
        });

        // 更新顶部显示：无主题被选择时显示"自定义主题"
        if (selectedDisplay) {
            const selected = this.settings.themeEnabled && this.themes[this.settings.theme];
            selectedDisplay.textContent = selected ? this.themes[this.settings.theme].info.name : '自定义主题';
        }
    }


    loadSettings() {
        const savedSettings = localStorage.getItem('oooInterfaceSettings');
        const isFirstRun = localStorage.getItem('oooInterfaceFirstRun');

        if (isFirstRun === null) {
            // 首次运行，使用出厂预设
            this.isFirstRun = true;
            localStorage.setItem('oooInterfaceFirstRun', 'false');
            this.saveSettings(); // 保存出厂预设
            this.showWelcomeScreen();
        } else {
            this.isFirstRun = false;
        }

        if (savedSettings) {
            try {
                const parsedSettings = JSON.parse(savedSettings);
                // 合并设置，确保新添加的字段有默认值
                this.settings = this.mergeSettings(parsedSettings);
            } catch (error) {
                console.error('设置加载失败，使用默认设置:', error);
                this.settings = JSON.parse(JSON.stringify(this.defaultSettings));
            }
        }

        // 初始化高级视觉效果自动启用标志
        this._dynamicBlurAutoEnabled = this.settings.enhancedDisplay && this.settings.dynamicBlur;

        // 添加底部铭牌打开设置页面的功能（根据设置决定）
        this.setupBadgeOpenMethod();
    }

    // 设置底部铭牌打开方式
    setupBadgeOpenMethod() {
        const badge = document.getElementById('ooo-badge');
        if (!badge) return;

        console.log('设置打开方式:', this.settings.badgeOpenMethod || 'both');

        // 移除之前的事件监听器（通过克隆元素来移除所有事件监听器）
        const newBadge = badge.cloneNode(true);
        badge.parentNode.replaceChild(newBadge, badge);

        // 重新绑定点击事件（用于切换文本）
        newBadge.addEventListener('click', () => this.toggleBadgeText());

        const method = this.settings.badgeOpenMethod || 'both';

        // 根据设置添加相应的事件监听器
        if (method !== 'none') {
            if (method === 'both' || method === 'dblclick') {
                newBadge.addEventListener('dblclick', () => {
                    console.log('触发双击打开设置');
                    this.openSettings('badge');
                });
            }

            if (method === 'both' || method === 'contextmenu') {
                newBadge.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    console.log('触发右键打开设置');
                    this.openSettings('badge');
                });
            }
        } else {
            console.log('设置打开方式已禁用');
        }
    }

    // 深度合并设置，确保新字段有默认值
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
        if (savedSettings.badgeOpenMethod !== undefined) result.badgeOpenMethod = savedSettings.badgeOpenMethod;
        if (savedSettings.bingRefreshEveryTime !== undefined) result.bingRefreshEveryTime = savedSettings.bingRefreshEveryTime;
        if (savedSettings.bingRefreshInterval !== undefined) result.bingRefreshInterval = savedSettings.bingRefreshInterval;
        if (savedSettings.quickAccessSidebar !== undefined) result.quickAccessSidebar = savedSettings.quickAccessSidebar;
        if (savedSettings.showQuickLinkIcons !== undefined) result.showQuickLinkIcons = savedSettings.showQuickLinkIcons;
        if (savedSettings.statusBarEnabled !== undefined) result.statusBarEnabled = savedSettings.statusBarEnabled;
        if (savedSettings.showStatusBarSeconds !== undefined) result.showStatusBarSeconds = savedSettings.showStatusBarSeconds;
        if (savedSettings.hideNotifications !== undefined) result.hideNotifications = savedSettings.hideNotifications;
        if (savedSettings.shortcutsEnabled !== undefined) result.shortcutsEnabled = savedSettings.shortcutsEnabled;
        if (savedSettings.contextMenuCustomItems && Array.isArray(savedSettings.contextMenuCustomItems)) {
            result.contextMenuCustomItems = savedSettings.contextMenuCustomItems.filter(
                item => ['enhanced-display-toggle', 'wallpaper-toggle', 'search-history-toggle', 'hide-notifications-toggle', 'hide-info-popup-toggle'].includes(item)
            );
        }

        // 合并主题相关字段
        if (savedSettings.theme !== undefined) result.theme = savedSettings.theme;
        if (savedSettings.themeEnabled !== undefined) result.themeEnabled = savedSettings.themeEnabled;
        if (savedSettings.themeColorScheme !== undefined) result.themeColorScheme = savedSettings.themeColorScheme;

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



        return result;
    }

    // 恢复出厂设置
    resetToDefaults() {
        this.settings = JSON.parse(JSON.stringify(this.defaultSettings));
        this.userChangedLogo = false;
        this.applySettings();
        this.saveSettings();

        // 重置欢迎界面状态
        localStorage.removeItem('hasVisited');
        localStorage.removeItem('oooInterfaceFirstRun');
        localStorage.removeItem('welcVersion');
        // 重置后刷新页面以显示欢迎页面
        location.reload();

        // 更新设置界面中的值
        if (document.getElementById('settings-modal').classList.contains('show')) {
            this.updateSettingsUI();
        }

        // 显示重置成功的提示
        this.showNotification('已重置');
    }

    // 重置确认弹窗（三步：红色警报 → 滑块验证 → 确认已知晓）
    showResetConfirmation(onConfirm) {
        const overlay = document.createElement('div');
        overlay.className = 'confirm-overlay';

        if (this.settings.dynamicBlur) {
            overlay.classList.add('blur-effect');
        }

        const close = () => {
            overlay.classList.remove('show');
            setTimeout(() => {
                if (overlay.parentNode) document.body.removeChild(overlay);
            }, 350);
        };

        // ---- 第一步：红色警报确认 ----
        overlay.innerHTML = `
            <div class="confirm-dialog" id="reset-confirm-dialog">
                <div class="confirm-dialog-icon">
                    <span class="material-icons" style="font-size:48px;color:#ffffff;">warning</span>
                </div>
                <div class="confirm-dialog-title">请确认重置</div>
                <div class="confirm-dialog-message">此操作将不可逆</div>
                <div class="confirm-dialog-buttons">
                    <button class="confirm-dialog-btn confirm-dialog-btn-cancel" id="reset-confirm-cancel1">取消</button>
                    <button class="confirm-dialog-btn confirm-dialog-btn-confirm" id="reset-confirm-ok1">确认</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('show'));

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });

        document.getElementById('reset-confirm-cancel1').addEventListener('click', close);

        document.getElementById('reset-confirm-ok1').addEventListener('click', () => {
            const d1 = document.getElementById('reset-confirm-dialog');
            d1.style.transform = 'scale(0.92) translateY(20px)';
            d1.style.opacity = '0';

            setTimeout(() => this._showCaptcha(overlay, close, onConfirm), 250);
        });
    }

    // ---- 第二步：滑块验证 ----
    _showCaptcha(overlay, close, onConfirm) {
        const pieceSize = 44;
        const imgH = 170;
        const targetY = Math.floor((imgH - pieceSize) / 2);

        overlay.innerHTML = `
            <div class="captcha-dialog" id="captcha-dialog">
                <div class="captcha-image" id="captcha-image">
                    <div class="captcha-hole" id="captcha-hole" style="top:${targetY}px;"></div>
                    <div class="captcha-piece" id="captcha-piece" style="top:${targetY}px;"></div>
                </div>
                <div class="captcha-slider-wrapper" id="captcha-track">
                    <div class="captcha-slider-fill" id="captcha-fill"></div>
                    <div class="captcha-slider-thumb" id="captcha-thumb">▶</div>
                </div>
                <div class="captcha-hint" id="captcha-hint">拖动滑块完成验证</div>
            </div>
        `;

        requestAnimationFrame(() => {
            const d = document.getElementById('captcha-dialog');
            const imgContainer = document.getElementById('captcha-image');
            const imgW = imgContainer.offsetWidth;
            const maxPiece = imgW - pieceSize;
            const minTarget = 20;
            const maxTarget = maxPiece - 20;
            const targetX = minTarget + Math.floor(Math.random() * Math.max(1, maxTarget - minTarget));

            document.getElementById('captcha-hole').style.left = targetX + 'px';
            const piece = document.getElementById('captcha-piece');
            piece.style.left = '0';
            piece.style.background = "url('images/back.png') -" + targetX + "px -" + targetY + "px / " + imgW + "px " + imgH + "px no-repeat";

            d.style.transform = 'scale(1) translateY(0)';
            d.style.opacity = '1';

            this._initCaptchaSlider(targetX, imgW, close, () => {
                d.style.transform = 'scale(0.92) translateY(20px)';
                d.style.opacity = '0';
                setTimeout(() => this._showFinalConfirm(overlay, close, onConfirm), 250);
            });
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });
    }

    // ---- 第三步：已知晓确认 ----
    _showFinalConfirm(overlay, close, onConfirm) {
        overlay.innerHTML = `
            <div class="confirm-dialog" id="reset-confirm-dialog">
                <div class="confirm-dialog-icon">
                    <span class="material-icons" style="font-size:48px;color:#ffffff;">warning</span>
                </div>
                <div class="confirm-dialog-title">请确认已知晓</div>
                <div class="confirm-dialog-message">此操作不可逆</div>
                <div class="confirm-dialog-checkbox">
                    <input type="checkbox" id="irreversible-checkbox">
                    <label for="irreversible-checkbox">我已知晓此操作不可逆</label>
                </div>
                <div class="confirm-dialog-buttons">
                    <button class="confirm-dialog-btn confirm-dialog-btn-cancel" id="reset-confirm-cancel2">取消</button>
                    <button class="confirm-dialog-btn confirm-dialog-btn-confirm" id="reset-confirm-ok2" disabled>确认</button>
                </div>
            </div>
        `;

        requestAnimationFrame(() => {
            const d = document.getElementById('reset-confirm-dialog');
            d.style.transform = 'scale(1) translateY(0)';
            d.style.opacity = '1';
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });

        document.getElementById('reset-confirm-cancel2').addEventListener('click', close);

        const checkbox = document.getElementById('irreversible-checkbox');
        const okBtn = document.getElementById('reset-confirm-ok2');

        checkbox.addEventListener('change', () => {
            okBtn.disabled = !checkbox.checked;
        });

        okBtn.addEventListener('click', () => {
            if (checkbox.checked) {
                close();
                setTimeout(() => onConfirm(), 350);
            }
        });
    }

    // ---- 滑块拖拽逻辑 ----
    _initCaptchaSlider(targetX, imgW, close, onSuccess) {
        const track = document.getElementById('captcha-track');
        const thumb = document.getElementById('captcha-thumb');
        const fill = document.getElementById('captcha-fill');
        const piece = document.getElementById('captcha-piece');
        const hint = document.getElementById('captcha-hint');
        const tolerance = 4;
        let dragging = false;
        let startX = 0;
        let thumbLeft = 0;
        let verified = false;
        let dragStartTime = 0;

        const halfThumb = 22;
        const maxOffset = track.offsetWidth - 44;
        const maxPiece = imgW - 44;

        thumb.style.left = '0';
        fill.style.width = halfThumb + 'px';
        piece.style.left = '0';

        function updatePos(clientX) {
            let dx = clientX - startX + thumbLeft;
            dx = Math.max(0, Math.min(maxOffset, dx));
            thumb.style.left = dx + 'px';
            fill.style.width = (dx + halfThumb) + 'px';
            const piecePos = (dx / maxOffset) * maxPiece;
            piece.style.left = Math.max(0, Math.min(maxPiece, piecePos)) + 'px';
            return dx;
        }

        function onStart(e) {
            if (verified) return;
            e.preventDefault();
            const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            dragging = true;
            startX = clientX;
            thumbLeft = parseInt(thumb.style.left) || 0;
            thumb.classList.remove('failed');
            hint.textContent = '拖动滑块完成验证';
            hint.className = 'captcha-hint';
            dragStartTime = Date.now();
        }

        function onMove(e) {
            if (!dragging || verified) return;
            e.preventDefault();
            updatePos(e.type === 'touchmove' ? e.touches[0].clientX : e.clientX);
        }

        function onEnd(e) {
            if (!dragging || verified) return;
            dragging = false;
            const pieceLeft = parseFloat(piece.style.left) || 0;

            if (Math.abs(pieceLeft - targetX) > tolerance) {
                thumb.classList.add('failed');
                hint.textContent = '验证失败，请重试';
                hint.className = 'captcha-hint error';
                setTimeout(() => {
                    thumb.classList.remove('failed');
                    thumb.style.left = '0';
                    fill.style.width = halfThumb + 'px';
                    piece.style.left = '0';
                }, 400);
                return;
            }

            const elapsed = Date.now() - dragStartTime;

            if (elapsed >= 1500) {
                thumb.classList.add('failed');
                hint.textContent = '验证失败，请重试';
                hint.className = 'captcha-hint error';
                setTimeout(() => {
                    thumb.classList.remove('failed');
                    thumb.style.left = '0';
                    fill.style.width = halfThumb + 'px';
                    piece.style.left = '0';
                }, 400);
                return;
            }

            verified = true;
            thumb.classList.add('verified');
            thumb.innerHTML = '<span class="material-icons" style="font-size:22px;">check</span>';

            if (elapsed < 1000) {
                hint.textContent = '我操，这么快，简直是神';
                hint.className = 'captcha-hint legend';
            } else {
                hint.textContent = '您已超过99.99%的用户';
                hint.className = 'captcha-hint top';
            }

            setTimeout(() => {
                hint.textContent = '';
                hint.className = 'captcha-hint';
                onSuccess();
            }, 1000);
        }

        thumb.addEventListener('mousedown', onStart);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);

        thumb.addEventListener('touchstart', onStart, { passive: false });
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onEnd);

    }

    // 显示通知
    // 获取通知弹窗配色（基于配色方案）
    getNotificationColors() {
        const colorConfig = this.getColorConfig();
        const scheme = this.settings.colorScheme || 'green';

        if (this.settings.dynamicBlur) {
            if (scheme === 'green') {
                const bgColor = this.isDarkMode ? 'rgba(48, 49, 52, 0.85)' : 'rgba(241, 243, 244, 0.85)';
                const textColor = this.isDarkMode ? '#d0d0d0' : '#1a1a1a';
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
                return { bg: bgColor, text: colorConfig.notificationText, border: colorConfig.notificationBorder, blur: true };
            }
            // 蓝色主题
            const bgColor = this.isDarkMode ? colorConfig.notificationBgDark : colorConfig.notificationBg;
            return { bg: bgColor, text: colorConfig.notificationText, border: colorConfig.notificationBorder, blur: true };
        }

        // 非高级视觉效果：使用表面色
        return { bg: 'var(--surface-color)', text: 'var(--text-color)', border: 'var(--border-color)', blur: false };
    }

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
    }

    // 显示信息弹窗
    showInfoPopup() {
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

        // 实际使用内存
        const pss = document.createElement('p');
        const pssValue = this.getMemoryUsage('pss');
        pss.textContent = `[pss]${pssValue}`;
        pss.style.cssText = `
            font-size: 14px;
            color: #000000;
            margin: 0;
            word-wrap: break-word;
        `;

        // 常驻内存大小
        const rss = document.createElement('p');
        const rssValue = this.getMemoryUsage('rss');
        rss.textContent = `[rss]${rssValue}`;
        rss.style.cssText = `
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
        content.appendChild(pss);
        content.appendChild(rss);
        popup.appendChild(content);

        // 添加到页面
        document.body.appendChild(popup);

        // ESC键关闭弹窗
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(popup);
                document.removeEventListener('keydown', handleEsc);
                this.infoPopupOpen = false;
            }
        };
        document.addEventListener('keydown', handleEsc);
    }

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
            { key: 'Tab', desc: '快速聚焦到搜索框' },
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
    }

    // 获取操作系统信息
    getOperatingSystem() {
        const userAgent = navigator.userAgent;
        if (userAgent.includes('Windows')) return 'Windows';
        if (userAgent.includes('Mac OS')) return 'Mac OS';
        if (userAgent.includes('Linux')) return 'Linux';
        if (userAgent.includes('Android')) return 'Android';
        if (userAgent.includes('iOS')) return 'iOS';
        return 'Unknown';
    }

    // 获取内存使用信息
    getMemoryUsage(type) {
        // 浏览器环境下无法直接获取内存信息，这里模拟返回
        if (type === 'pss') {
            return '~50MB';
        } else if (type === 'rss') {
            return '~100MB';
        }
        return 'N/A';
    }

    // 显示欢迎界面
    showWelcomeScreen() {
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            welcomeScreen.style.display = 'flex';
        }
    }

    // 隐藏欢迎界面
    hideWelcomeScreen() {
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            welcomeScreen.style.display = 'none';
        }
    }

    saveSettings() {
        const settingsToSave = {
            ...this.settings,
            userChangedLogo: this.userChangedLogo
        };
        try {
            localStorage.setItem('oooInterfaceSettings', JSON.stringify(settingsToSave));
        } catch (error) {
            console.error('保存设置失败:', error);
            this.showNotification('保存设置失败');
        }
    }

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
    }

    updateStatusBarText() {
        const statusBar = document.getElementById('status-bar');
        if (!statusBar) return;

        statusBar.textContent = this.formatStatusBarDateTime(new Date());
    }

    stopStatusBarTimer() {
        if (this.statusBarTimer) {
            clearTimeout(this.statusBarTimer);
            this.statusBarTimer = null;
        }
    }

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
    }

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
    }

    getFallbackStatusBarTextTone() {
        return this.isDarkMode ? 'light' : 'dark';
    }

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
    }

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
    }

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
    }

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
    }

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
    }

    startStatusBarTimer() {
        this.stopStatusBarTimer();

        const shouldShow = this.settings.developerMode && this.settings.statusBarEnabled;
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
    }

    // 开发者模式关闭时仅隐藏状态栏，重新开启后恢复上次保存的显示偏好。
    applyStatusBarSettings() {
        const statusBar = document.getElementById('status-bar');
        if (!statusBar) return;

        const shouldShow = this.settings.developerMode && this.settings.statusBarEnabled;

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

        // 搜索功能
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(searchInput.value);
            }
        });

        // 搜索历史相关事件
        const searchHistoryContainer = document.getElementById('search-history-container');
        const searchHistoryList = document.querySelector('.search-history-list');

        searchInput.addEventListener('focus', () => {
            if (this.settings.searchHistory && this.settings.searchHistoryItems.length > 0) {
                this.showSearchHistory();
            }
            const clearBtn = document.querySelector('.search-clear-btn');
            if (clearBtn) {
                clearBtn.style.display = searchInput.value.length > 0 ? 'flex' : 'none';
            }
        });

        searchInput.addEventListener('input', () => {
            if (this.settings.searchHistory && this.settings.searchHistoryItems.length > 0) {
                this.showSearchHistory(searchInput.value);
            }
            const clearBtn = document.querySelector('.search-clear-btn');
            if (clearBtn) {
                clearBtn.style.display = searchInput.value.length > 0 ? 'flex' : 'none';
            }
        });

        const searchClearBtn = document.querySelector('.search-clear-btn');
        if (searchClearBtn) {
            searchClearBtn.addEventListener('click', () => {
                searchInput.value = '';
                searchClearBtn.style.display = 'none';
                searchInput.focus();
                this.hideSearchHistory();
            });
        }

        document.addEventListener('click', (e) => {
            if (!searchHistoryContainer.contains(e.target) && !searchInput.contains(e.target)) {
                this.hideSearchHistory();
            }
        });

        searchHistoryList.addEventListener('click', (e) => {
            const target = e.target;

            if (target.classList.contains('search-history-item')) {
                const searchQuery = target.dataset.query;
                if (searchQuery) {
                    searchInput.value = searchQuery;
                    this.performSearch(searchQuery);
                }
            }

            if (target.classList.contains('search-history-delete') || target.closest('.search-history-delete')) {
                e.stopPropagation();
                const deleteBtn = target.classList.contains('search-history-delete') ? target : target.closest('.search-history-delete');
                const searchQuery = deleteBtn.dataset.query;
                if (searchQuery) {
                    this.removeFromSearchHistory(searchQuery);
                }
            }
        });

        // 阻止搜索历史框内的滚轮事件冒泡到window，避免触发壁纸模式
        searchHistoryContainer.addEventListener('wheel', (e) => {
            e.stopPropagation();
        });

        // 铭牌点击事件 - 已在 setupBadgeOpenMethod() 中处理

        // 设置弹窗事件
        document.getElementById('close-modal').addEventListener('click', () => this.closeSettings());
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
                        } else if (rpu && rpu.dataset.subView === 'custom-color-editor') {
                            this.backToCustomColorView(rpu);
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
        });

        // 主题文件上传事件
        document.getElementById('theme-upload').addEventListener('change', (e) => {
            this.handleThemeUpload(e.target.files[0]);
            e.target.value = '';
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
            if (this.settings.hideNotifications) {
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
            this.settings.searchHistory = document.getElementById('search-history-toggle').checked;
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

            // 保存设置打开方式
            const badgeMethodSelect = document.getElementById('badge-open-method-select');
            if (badgeMethodSelect) {
                this.settings.badgeOpenMethod = badgeMethodSelect.value;
                console.log('保存设置打开方式:', this.settings.badgeOpenMethod);
            }

            if (oldPersistentWallpaper !== this.settings.persistentWallpaper) {
                this.handlePersistentWallpaperToggle();
            }

            this.applySettings();
            // 重新绑定底部铭牌打开方式（该设置不在 applySettings 中处理）
            this.setupBadgeOpenMethod();
            this.saveSettings();
            this.updateContextMenuIcons();
            this.closeSettings();
            this.showNotification('设置已应用');
            // 无需刷新页面，所有设置已通过组件级更新即时生效
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
            const audio = new Audio('https://rudan177.github.io/OOOInterface/images/wow.mp3');
            audio.play().catch(err => {
                console.error('播放音频失败:', err);
            });
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
            if (e.target.closest('.modal') ||
                e.target.closest('.search-section') ||
                e.target.closest('.engine-buttons') ||
                e.target.closest('.quick-access-links')) return;
            touchStartY = e.touches[0].pageY;
            touchActive = true;
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
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

            // Tab - 聚焦搜索框（不在设置页面时）
            if (e.key === 'Tab' && !inSettings && !e.shiftKey) {
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

    initHideInfoPopupToggle() {
        const toggle = document.getElementById('hide-info-popup-toggle');
        if (!toggle) return;

        let clickTimer = null;
        let clickCount = 0;

        const updateToggleState = () => {
            const isEnabled = this.settings.hideInfoPopup.enabled;
            // 使用 requestAnimationFrame 确保DOM更新在浏览器的下一个渲染周期执行
            requestAnimationFrame(() => {
                toggle.checked = isEnabled;
                this.updateHideInfoPopupLabel();
            });
        };

        // 完全控制开关行为
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            clickCount++;

            if (clickCount === 1) {
                clickTimer = setTimeout(() => {
                    if (clickCount === 1) {
                        if (this.settings.hideInfoPopup.enabled) {
                            this.settings.hideInfoPopup = { enabled: false, type: null, timestamp: null };
                        } else {
                            this.settings.hideInfoPopup = { enabled: true, type: 'temporary', timestamp: Date.now() };
                        }
                        this.applySettings();
                        this.saveSettings();
                        this.updateContextMenuIcons();
                        // 立即更新状态
                        updateToggleState();
                    }
                    clickCount = 0;
                }, 100);
            } else if (clickCount === 2) {
                clearTimeout(clickTimer);
                clickCount = 0;

                this.settings.hideInfoPopup = { enabled: true, type: 'permanent', timestamp: Date.now() };
                this.applySettings();
                this.saveSettings();
                this.updateContextMenuIcons();
                // 立即更新状态
                updateToggleState();
            }
        });

        // 初始化状态
        updateToggleState();
    }

    updateHideInfoPopupLabel() {
        const settingGroup = document.getElementById('hide-info-popup-toggle')?.closest('.setting-group');
        if (!settingGroup) return;

        const label = settingGroup.querySelector('.setting-label');
        if (!label) return;

        const hideInfoPopup = this.settings.hideInfoPopup;

        if (!hideInfoPopup.enabled) {
            label.textContent = '禁止提示';
        } else if (hideInfoPopup.type === 'temporary') {
            const daysLeft = this.getHideInfoPopupDaysLeft();
            label.innerHTML = `禁止提示 <span class="hide-info-popup-days" data-days-left="${daysLeft}">剩余${daysLeft}天</span>`;
        } else if (hideInfoPopup.type === 'permanent') {
            label.textContent = '禁止提示(永久)';
        }
    }

    getHideInfoPopupDaysLeft() {
        const hideInfoPopup = this.settings.hideInfoPopup;
        if (!hideInfoPopup.enabled || !hideInfoPopup.timestamp || hideInfoPopup.type !== 'temporary') return 0;

        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
        const elapsed = Date.now() - hideInfoPopup.timestamp;
        const remaining = sevenDaysMs - elapsed;

        if (remaining <= 0) return 0;
        return Math.ceil(remaining / (24 * 60 * 60 * 1000));
    }

    isHideInfoPopupActive() {
        const hideInfoPopup = this.settings.hideInfoPopup;
        if (!hideInfoPopup.enabled) return false;

        if (hideInfoPopup.type === 'permanent') return true;

        if (hideInfoPopup.type === 'temporary' && hideInfoPopup.timestamp) {
            const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
            const elapsed = Date.now() - hideInfoPopup.timestamp;

            if (elapsed >= sevenDaysMs) {
                this.settings.hideInfoPopup = { enabled: false, type: null, timestamp: null };
                this.saveSettings();
                return false;
            }
            return true;
        }

        return false;
    }

    // 显示右键菜单
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
    }

    // 隐藏右键菜单
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
    }

    // 处理右键菜单操作
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
            case 'wallpaper-toggle':
                this.toggleWallpaperSetting();
                break;
            case 'enhanced-display-toggle':
                this.toggleEnhancedDisplaySetting();
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
    }

    // 复制搜索框内容
    copySearchContent() {
        const searchInput = document.getElementById('search-input');
        if (searchInput && searchInput.value.trim()) {
            navigator.clipboard.writeText(searchInput.value.trim())
                .then(() => {
                    this.showNotification('复制');
                })
                .catch(err => {
                    console.error('复制失败:', err);
                    this.showNotification('复制失败');
                });
        } else {
            this.showNotification('搜索框为空');
        }
    }

    // 粘贴到搜索框
    pasteToSearch() {
        const searchInput = document.getElementById('search-input');
        navigator.clipboard.readText()
            .then(text => {
                searchInput.value = text.trim();
                const clearBtn = document.querySelector('.search-clear-btn');
                if (clearBtn) {
                    clearBtn.style.display = searchInput.value.length > 0 ? 'flex' : 'none';
                }
                this.showNotification('粘贴');
            })
            .catch(err => {
                console.error('粘贴失败:', err);
                this.showNotification('粘贴失败');
            });
    }

    // 切换搜索历史设置
    toggleSearchHistorySetting() {
        this.settings.searchHistory = !this.settings.searchHistory;
        this.saveSettings();
        this.updateContextMenuIcons();
        this.syncSettingsPageToggles();
        this.showNotification(this.settings.searchHistory ? '搜索历史：开启' : '搜索历史：关闭');
    }

    // 切换壁纸常显示设置
    toggleWallpaperSetting() {
        this.settings.persistentWallpaper = !this.settings.persistentWallpaper;
        this.applySettings();
        this.saveSettings();
        this.updateContextMenuIcons();
        this.syncSettingsPageToggles();
        this.showNotification(this.settings.persistentWallpaper ? '壁纸常显示：开启' : '壁纸常显示：关闭');
    }

    // 切换高级视觉效果设置
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
    }

    // 切换隐藏弹窗设置
    toggleHideNotificationsSetting() {
        this.settings.hideNotifications = !this.settings.hideNotifications;
        this.saveSettings();
        this.updateContextMenuIcons();
        this.syncSettingsPageToggles();
        this.showNotification(this.settings.hideNotifications ? '隐藏弹窗：开启' : '隐藏弹窗：关闭');
    }

    // 切换禁止提示设置
    toggleHideInfoPopupSetting() {
        if (this.settings.hideInfoPopup.enabled) {
            this.settings.hideInfoPopup = { enabled: false, type: null, timestamp: null };
        } else {
            this.settings.hideInfoPopup = { enabled: true, type: 'permanent', timestamp: Date.now() };
        }
        this.applySettings();
        this.saveSettings();
        this.updateContextMenuIcons();
        this.syncSettingsPageToggles();
        this.showNotification(this.settings.hideInfoPopup.enabled ? '禁止提示：开启' : '禁止提示：关闭');
    }

    // 处理Logo选择变化
    handleLogoSelectChange(value) {
        const textLogoGroup = document.getElementById('text-logo-inline-group');
        const textLogoItem = document.querySelector('.select-item-text-logo');

        // 移除所有选项的selected类
        document.querySelectorAll('#logo-select-items .select-item').forEach(item => {
            item.classList.remove('selected');
        });

        if (value === 'text-logo') {
            // 给文字Logo选项添加selected类
            textLogoItem.classList.add('selected');
            // 显示文字Logo输入框
            textLogoGroup.style.display = 'flex';

            // 如果已经有文字Logo内容，直接应用
            const textInput = document.getElementById('text-logo-input');
            if (textInput.value.trim()) {
                this.setTextLogo();
            }
        } else {
            // 隐藏文字Logo输入框
            textLogoGroup.style.display = 'none';

            this.changeLogo(value);
        }

        this.updateSettingsUI();
    }

    // 设置拖拽上传功能
    setupDragAndDrop() {
        const modalBody = document.querySelector('.modal-body');

        modalBody.addEventListener('dragover', (e) => {
            e.preventDefault();
            modalBody.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
        });

        modalBody.addEventListener('dragleave', (e) => {
            e.preventDefault();
            modalBody.style.backgroundColor = '';
        });

        modalBody.addEventListener('drop', (e) => {
            e.preventDefault();
            modalBody.style.backgroundColor = '';
            // 各右面板菜单自行处理拖放，详见 showSettingsMenuInRightPanel
        });
    }

    setupMouseScroll() {
        const modalBody = document.querySelector('.modal-body');
        let isDown = false;
        let startY;
        let scrollTop;

        // 鼠标按下事件
        modalBody.addEventListener('mousedown', (e) => {
            // 如果点击的是滑块、输入框或其他可交互元素，不处理
            if (e.target.tagName === 'INPUT' ||
                e.target.tagName === 'BUTTON' ||
                e.target.tagName === 'SELECT' ||
                e.target.tagName === 'TEXTAREA' ||
                e.target.closest('.slider-input') ||
                e.target.closest('input[type="range"]')) {
                return;
            }
            isDown = true;
            startY = e.pageY - modalBody.offsetTop;
            scrollTop = modalBody.scrollTop;
            modalBody.style.cursor = 'grabbing';
        });

        // 鼠标离开事件
        modalBody.addEventListener('mouseleave', () => {
            isDown = false;
            modalBody.style.cursor = 'default';
        });

        // 鼠标松开事件
        modalBody.addEventListener('mouseup', () => {
            isDown = false;
            modalBody.style.cursor = 'default';
        });

        // 鼠标移动事件
        modalBody.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const y = e.pageY - modalBody.offsetTop;
            const walk = (y - startY) * 2; // 滚动速度
            modalBody.scrollTop = scrollTop - walk;
        });
    }

    // 处理字体上传
    handleFontUpload(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const fontData = e.target.result;
            const fontName = file.name.replace(/\.[^/.]+$/, ""); // 移除扩展名

            // 创建字体Face
            const fontFace = new FontFace(fontName, `url(${fontData})`);

            fontFace.load().then((loadedFace) => {
                document.fonts.add(loadedFace);

                // 添加到自定义字体列表
                this.settings.customFonts.push({
                    name: fontName,
                    data: fontData
                });

                // 更新自定义字体列表
                this.updateCustomFontsList();

                // 自定义字体上传必然与主题字体不一致
                this.checkThemeConsistency('font', fontName);

                this.saveSettings();
                this.showNotification(`字体"${fontName}"上传成功`);

                // 刷新右侧面板菜单（如果打开）
                const rightPanelUpper = document.getElementById('right-panel-upper');
                if (rightPanelUpper && rightPanelUpper.querySelector('.settings-menu-container')) {
                    const selected = document.getElementById('font-select-selected');
                    const hiddenSelect = document.getElementById('font-select');
                    const items = document.getElementById('font-select-items');
                    this.showSettingsMenuInRightPanel(items, selected, hiddenSelect);
                }
            }).catch((error) => {
                console.error('字体加载失败:', error);
                this.showNotification('字体加载失败');
            });
        };

        reader.onerror = () => {
            this.showNotification('文件读取失败');
        };

        reader.readAsDataURL(file);
    }

    // 处理主题文件导入
    handleThemeUpload(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                let themeData;
                const content = e.target.result;

                // 尝试解析 JSON
                try {
                    themeData = JSON.parse(content);
                } catch (jsonErr) {
                    // 不是 JSON，尝试提取 DEFAULT_THEME 变量的值
                    const match = content.match(/var\s+DEFAULT_THEME\s*=\s*(\{[\s\S]*?\});/);
                    if (match) {
                        themeData = JSON.parse(match[1].replace(/'/g, '"').replace(/(\w+):/g, '"$1":'));
                    } else {
                        // 最后尝试直接 eval（受 CSP 限制）
                        try {
                            const evalResult = eval('(' + content.replace(/var\s+DEFAULT_THEME\s*=/, '') + ')');
                            if (evalResult && evalResult.info) themeData = evalResult;
                        } catch (e) {
                            this.showNotification('无法解析主题文件');
                            return;
                        }
                    }
                }

                if (!themeData || !themeData.info || !themeData.details) {
                    this.showNotification('主题文件格式无效');
                    return;
                }

                const key = file.name.replace(/\.[^/.]+$/, '');
                const normalized = this.normalizeThemePaths(JSON.parse(JSON.stringify(themeData)));

                // 检查是否已存在同名自定义主题
                const existing = this.settings.customThemes.findIndex(ct => ct.key === key);
                if (existing !== -1) {
                    this.settings.customThemes[existing] = {
                        key, name: themeData.info.name,
                        designer: themeData.info.designer || '',
                        version: themeData.info.version || '',
                        data: normalized
                    };
                } else {
                    this.settings.customThemes.push({
                        key, name: themeData.info.name,
                        designer: themeData.info.designer || '',
                        version: themeData.info.version || '',
                        data: normalized
                    });
                }

                this.themes[key] = normalized;
                this.saveSettings();
                this.populateThemeSelect();
                this.showNotification(`主题"${themeData.info.name}"导入成功`);

                // 刷新右面板
                const rpu = document.getElementById('right-panel-upper');
                if (rpu && rpu.querySelector('.settings-menu-container')) {
                    const selected = document.getElementById('theme-select-selected');
                    const hiddenSelect = document.getElementById('theme-select');
                    const items = document.getElementById('theme-select-items');
                    this.showSettingsMenuInRightPanel(items, selected, hiddenSelect);
                }
            } catch (err) {
                console.error('主题导入失败:', err);
                this.showNotification('主题导入失败');
            }
        };

        reader.onerror = () => this.showNotification('文件读取失败');
        reader.readAsText(file);
    }

    // 处理Logo上传
    handleLogoUpload(file) {
        if (!file) return;

        // 检查文件大小（限制为2MB）
        if (file.size > 2 * 1024 * 1024) {
            this.showNotification('图片文件过大，请选择小于2MB的文件');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const logoData = e.target.result;
            const logoName = file.name.replace(/\.[^/.]+$/, ""); // 移除扩展名

            // 检查是否已存在同名Logo
            if (this.settings.customLogos.some(logo => logo.name === logoName)) {
                this.showNotification(`Logo"${logoName}"已存在`);
                return;
            }

            // 添加到自定义Logo列表
            this.settings.customLogos.push({
                name: logoName,
                data: logoData,
                darkData: null
            });

            // 更新自定义Logo列表显示
            this.updateCustomLogosList();

            // 自定义 Logo 上传必然与主题 Logo 不一致
            this.checkThemeConsistency('logo', logoName);

            this.saveSettings();
            this.showNotification(`Logo"${logoName}"上传成功`);

            // 刷新右侧面板菜单（如果打开）
            const rightPanelUpper = document.getElementById('right-panel-upper');
            if (rightPanelUpper && rightPanelUpper.querySelector('.settings-menu-container')) {
                const selected = document.getElementById('logo-select-selected');
                const hiddenSelect = document.getElementById('logo-select');
                const items = document.getElementById('logo-select-items');
                this.showSettingsMenuInRightPanel(items, selected, hiddenSelect);
            }
        };

        reader.onerror = () => {
            this.showNotification('文件读取失败');
        };

        reader.readAsDataURL(file);
    }

    // 处理暗色Logo上传
    handleDarkLogoUpload(file) {
        if (!file) return;

        // 检查文件大小（限制为2MB）
        if (file.size > 2 * 1024 * 1024) {
            this.showNotification('图片文件过大，请选择小于2MB的文件');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const darkLogoData = e.target.result;

            // 优先使用_currentDarkLogoTarget，否则使用当前选中的Logo
            const targetLogoName = this._currentDarkLogoTarget || this.settings.logo;

            // 查找目标自定义Logo
            const customLogo = this.settings.customLogos.find(logo => logo.name === targetLogoName);
            if (customLogo) {
                customLogo.darkData = darkLogoData;
                this.saveSettings();
                this.applyLogo();
                this.showNotification('暗色Logo上传');

                // 刷新右侧面板以更新按钮文字
                const rightPanelUpper = document.getElementById('right-panel-upper');
                if (rightPanelUpper && rightPanelUpper.querySelector('.settings-menu-container')) {
                    const selected = document.getElementById('logo-select-selected');
                    const hiddenSelect = document.getElementById('logo-select');
                    const items = document.getElementById('logo-select-items');
                    if (selected && hiddenSelect && items) {
                        this.showSettingsMenuInRightPanel(items, selected, hiddenSelect);
                    }
                }
            } else {
                this.showNotification('请先选择一个Logo');
            }

            // 清除临时目标
            this._currentDarkLogoTarget = null;
        };
        reader.onerror = () => {
            this.showNotification('文件读取失败');
        };

        reader.readAsDataURL(file);
    }

    handleWallpaperUpload(file) {
        if (!file) return;

        // 检查文件类型
        if (!file.type.startsWith('image/')) {
            this.showNotification('请上传图片文件');
            return;
        }

        // 检查文件大小 (限制10MB)
        if (file.size > 10 * 1024 * 1024) {
            this.showNotification('图片文件过大，请选择小于10MB的文件');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const wallpaperData = e.target.result;
            const wallpaperName = file.name.replace(/\.[^/.]+$/, "");

            // 检查是否已存在同名壁纸
            if (this.settings.customWallpapers.some(wp => wp.name === wallpaperName)) {
                this.showNotification(`壁纸"${wallpaperName}"已存在`);
                return;
            }

            // 添加到自定义壁纸列表
            this.settings.customWallpapers.push({
                name: wallpaperName,
                data: wallpaperData
            });

            this.settings.wallpaper = wallpaperData;
            this.settings.persistentWallpaper = true;

            const wallpaperSelect = document.getElementById('wallpaper-select');
            wallpaperSelect.value = wallpaperName;

            // 更新自定义壁纸列表
            this.updateCustomWallpapersList();

            // 自定义壁纸上传必然与主题壁纸不一致
            this.checkThemeConsistency('wallpaper', wallpaperData);

            this.applySettings();
            this.saveSettings();
            this.showNotification(`壁纸"${wallpaperName}"上传`);

            // 刷新右侧面板菜单（如果打开）
            const rightPanelUpper = document.getElementById('right-panel-upper');
            if (rightPanelUpper && rightPanelUpper.querySelector('.settings-menu-container')) {
                const selected = document.getElementById('wallpaper-select-selected');
                const hiddenSelect = document.getElementById('wallpaper-select');
                const items = document.getElementById('wallpaper-select-items');
                this.showSettingsMenuInRightPanel(items, selected, hiddenSelect);
            }
        };
        reader.readAsDataURL(file);
    }

    showWallpaperImportSelector(btnElement) {
        const existing = document.querySelector('.wallpaper-import-selector');
        const existingOverlay = document.querySelector('.wallpaper-import-selector-overlay');
        if (existing) existing.remove();
        if (existingOverlay) existingOverlay.remove();

        const overlay = document.createElement('div');
        overlay.className = 'wallpaper-import-selector-overlay';

        const selector = document.createElement('div');
        selector.className = 'wallpaper-import-selector';

        const singleOption = document.createElement('button');
        singleOption.className = 'wallpaper-import-selector-option';
        singleOption.innerHTML = `
            <span class="wallpaper-import-selector-option-icon"><span class="material-icons">image</span></span>
            <span class="wallpaper-import-selector-option-title">单张壁纸</span>
        `;

        const divider = document.createElement('div');
        divider.className = 'wallpaper-import-selector-divider';

        const seriesOption = document.createElement('button');
        seriesOption.className = 'wallpaper-import-selector-option';
        seriesOption.innerHTML = `
            <span class="wallpaper-import-selector-option-icon"><span class="material-icons">photo_library</span></span>
            <span class="wallpaper-import-selector-option-title">系列壁纸</span>
        `;

        selector.appendChild(singleOption);
        selector.appendChild(divider);
        selector.appendChild(seriesOption);

        const rect = btnElement.getBoundingClientRect();
        document.body.appendChild(overlay);
        document.body.appendChild(selector);

        selector.style.visibility = 'hidden';
        selector.style.pointerEvents = 'none';
        selector.style.position = 'fixed';

        let leftPos = Math.round(rect.left + rect.width / 2 - 85);
        if (leftPos < 8) leftPos = 8;
        selector.style.left = leftPos + 'px';
        selector.style.top = '0px';

        const ddHeight = selector.offsetHeight;
        const gap = 10;
        let topPos = Math.round(rect.top - ddHeight - gap);
        if (topPos < 8) topPos = rect.bottom + gap;
        selector.style.top = topPos + 'px';

        selector.style.visibility = '';
        selector.style.pointerEvents = '';

        requestAnimationFrame(() => {
            selector.classList.add('show');
        });

        const closeSelector = () => {
            selector.classList.remove('show');
            setTimeout(() => {
                if (overlay.parentNode) overlay.remove();
                if (selector.parentNode) selector.remove();
                document.removeEventListener('click', handleOutsideClick);
                document.removeEventListener('keydown', handleEsc);
            }, 200);
        };

        const handleOutsideClick = (e) => {
            if (!selector.contains(e.target) && !btnElement.contains(e.target)) {
                closeSelector();
            }
        };

        const handleEsc = (e) => {
            if (e.key === 'Escape') closeSelector();
        };

        setTimeout(() => {
            document.addEventListener('click', handleOutsideClick);
            document.addEventListener('keydown', handleEsc);
        }, 0);

        singleOption.addEventListener('click', (e) => {
            e.stopPropagation();
            closeSelector();
            document.getElementById('wallpaper-upload').click();
        });

        seriesOption.addEventListener('click', (e) => {
            e.stopPropagation();
            closeSelector();
            this.handleSeriesFolderImport();
        });
    }

    handleSeriesFolderImport() {
        if (window.showDirectoryPicker) {
            window.showDirectoryPicker({ mode: 'read' }).then(async (dirHandle) => {
                const images = [];
                for await (const entry of dirHandle.values()) {
                    if (entry.kind === 'file') {
                        const file = await entry.getFile();
                        if (file.type.startsWith('image/')) {
                            images.push(file);
                        }
                    }
                }

                if (images.length === 0) {
                    this.showNotification('所选文件夹中没有支持的图片');
                    return;
                }

                this.showSeriesImportPreview(images, dirHandle.name);
            }).catch((err) => {
                if (err.name !== 'AbortError') {
                    this.showNotification('文件夹选择失败');
                }
            });
        } else {
            let folderInput = document.getElementById('wallpaper-folder-upload');
            if (!folderInput) {
                folderInput = document.createElement('input');
                folderInput.id = 'wallpaper-folder-upload';
                folderInput.type = 'file';
                folderInput.accept = 'image/*';
                folderInput.multiple = true;
                folderInput.setAttribute('webkitdirectory', '');
                folderInput.style.display = 'none';
                document.body.appendChild(folderInput);
            }

            folderInput.value = '';

            const handleFolderChange = (e) => {
                const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
                if (files.length === 0) {
                    this.showNotification('所选文件夹中没有支持的图片');
                    return;
                }
                const folderName = files[0].webkitRelativePath.split('/')[0] || '未命名系列';
                this.showSeriesImportPreview(files, folderName);
                folderInput.removeEventListener('change', handleFolderChange);
            };

            folderInput.addEventListener('change', handleFolderChange);
            folderInput.click();
        }
    }

    showSeriesImportPreview(files, seriesName) {
        const existing = document.querySelector('.series-preview-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.className = 'series-preview-overlay';

        const panel = document.createElement('div');
        panel.className = 'series-preview-panel';

        const selectedFiles = new Set(files);

        const header = document.createElement('div');
        header.className = 'series-preview-header';
        const title = document.createElement('div');
        title.className = 'series-preview-title';
        title.textContent = seriesName;
        const count = document.createElement('div');
        count.className = 'series-preview-count';
        count.textContent = `${files.length} 张图片`;
        header.appendChild(title);
        header.appendChild(count);

        const COLS = 4;
        const BUFFER_ROWS = 2;
        const totalRows = Math.ceil(files.length / COLS);

        const grid = document.createElement('div');
        grid.className = 'series-preview-grid';

        const spacer = document.createElement('div');
        spacer.style.position = 'relative';
        spacer.style.width = '100%';
        grid.appendChild(spacer);

        let rowHeight = 108;
        const renderedMap = new Map();

        const calcRowHeight = () => {
            const w = grid.clientWidth - 48;
            rowHeight = Math.floor((w - (COLS - 1) * 8) / COLS) + 8;
        };

        const renderItem = (idx) => {
            if (idx < 0 || idx >= files.length || renderedMap.has(idx)) return;
            const file = files[idx];
            const row = Math.floor(idx / COLS);
            const col = idx % COLS;

            const item = document.createElement('div');
            item.className = 'series-preview-item' + (selectedFiles.has(file) ? ' selected' : ' unselected');
            item.dataset.idx = idx;

            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.onload = () => URL.revokeObjectURL(img.src);
            item.appendChild(img);

            const check = document.createElement('span');
            check.className = 'material-icons check-icon';
            check.textContent = 'check';
            item.appendChild(check);

            item.addEventListener('click', () => {
                if (selectedFiles.has(file)) {
                    selectedFiles.delete(file);
                    item.classList.remove('selected');
                    item.classList.add('unselected');
                } else {
                    selectedFiles.add(file);
                    item.classList.add('selected');
                    item.classList.remove('unselected');
                }
                updateCount();
            });

            item.style.position = 'absolute';
            item.style.top = (row * rowHeight) + 'px';
            item.style.left = `calc(${col * 25}% + ${col * 2}px)`;
            item.style.width = `calc(25% - 6px)`;
            item.style.height = (rowHeight - 8) + 'px';

            spacer.appendChild(item);
            renderedMap.set(idx, item);
        };

        const removeItem = (idx) => {
            const el = renderedMap.get(idx);
            if (el) {
                el.remove();
                renderedMap.delete(idx);
            }
        };

        const updateVisibleRange = () => {
            calcRowHeight();
            const scrollTop = grid.scrollTop;
            const viewH = grid.clientHeight;
            const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - BUFFER_ROWS);
            const endRow = Math.min(totalRows - 1, Math.ceil((scrollTop + viewH) / rowHeight) + BUFFER_ROWS);

            const startIdx = startRow * COLS;
            const endIdx = Math.min(files.length - 1, endRow * COLS + COLS - 1);

            spacer.style.height = (totalRows * rowHeight) + 'px';

            for (let i = startIdx; i <= endIdx; i++) renderItem(i);

            const toRemove = [];
            renderedMap.forEach((_, idx) => {
                if (idx < startIdx || idx > endIdx) toRemove.push(idx);
            });
            toRemove.forEach(removeItem);
        };

        let scrollTicking = false;
        grid.addEventListener('scroll', () => {
            if (!scrollTicking) {
                requestAnimationFrame(() => {
                    updateVisibleRange();
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        }, { passive: true });

        const updateCount = () => {
            count.textContent = `${selectedFiles.size} / ${files.length} 张`;
            importBtn.disabled = selectedFiles.size === 0;
            toggleAllBtn.textContent = selectedFiles.size === files.length ? '取消全选' : '全选';
        };

        const footer = document.createElement('div');
        footer.className = 'series-preview-footer';

        const selectActions = document.createElement('div');
        selectActions.className = 'series-preview-select-actions';

        const toggleAllBtn = document.createElement('button');
        toggleAllBtn.className = 'series-preview-select-btn';
        toggleAllBtn.textContent = '全选';
        toggleAllBtn.addEventListener('click', () => {
            if (selectedFiles.size === files.length) {
                selectedFiles.clear();
                renderedMap.forEach((el) => {
                    el.classList.remove('selected');
                    el.classList.add('unselected');
                });
            } else {
                files.forEach(f => selectedFiles.add(f));
                renderedMap.forEach((el) => {
                    el.classList.add('selected');
                    el.classList.remove('unselected');
                });
            }
            updateCount();
        });

        selectActions.appendChild(toggleAllBtn);

        const importBtn = document.createElement('button');
        importBtn.className = 'series-preview-import-btn';
        importBtn.textContent = '导入';
        importBtn.addEventListener('click', () => {
            if (selectedFiles.size === 0) return;
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 300);
            this.batchImportWallpapers(Array.from(selectedFiles), seriesName);
        });

        footer.appendChild(selectActions);
        footer.appendChild(importBtn);

        panel.appendChild(header);
        panel.appendChild(grid);
        panel.appendChild(footer);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        requestAnimationFrame(() => {
            overlay.classList.add('show');
            calcRowHeight();
            updateVisibleRange();
        });

        const closePreview = () => {
            overlay.classList.remove('show');
            setTimeout(() => {
                if (overlay.parentNode) overlay.remove();
                document.removeEventListener('keydown', handleEsc);
            }, 300);
        };

        const handleEsc = (e) => {
            if (e.key === 'Escape') closePreview();
        };

        document.addEventListener('keydown', handleEsc);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closePreview();
        });

        updateCount();
    }

    compressImage(file, maxWidth, maxHeight, quality) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    let w = img.width;
                    let h = img.height;
                    if (w > maxWidth || h > maxHeight) {
                        const ratio = Math.min(maxWidth / w, maxHeight / h);
                        w = Math.round(w * ratio);
                        h = Math.round(h * ratio);
                    }
                    const canvas = document.createElement('canvas');
                    canvas.width = w;
                    canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, w, h);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
                img.onerror = () => reject(new Error('图片加载失败'));
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error('文件读取失败'));
            reader.readAsDataURL(file);
        });
    }

    batchImportWallpapers(files, seriesName) {
        const MAX_DIMENSION = 1280;
        const COMPRESS_QUALITY = 0.5;
        const BATCH_SIZE = 10;
        const MAX_WALLPAPERS = 50;
        const validFiles = files.filter(f => f.type.startsWith('image/'));

        if (validFiles.length === 0) {
            this.showNotification('没有符合要求的图片');
            return;
        }

        let totalImported = 0;
        let totalSkipped = 0;
        const allSeriesWallpapers = [];
        let storageFull = false;

        const processBatch = (batchStart) => {
            if (storageFull || batchStart >= validFiles.length) {
                this.finishSeriesImport(seriesName, allSeriesWallpapers, totalImported, totalSkipped, storageFull);
                return;
            }

            const batchEnd = Math.min(batchStart + BATCH_SIZE, validFiles.length);
            const batch = validFiles.slice(batchStart, batchEnd);
            let batchProcessed = 0;

            this.showNotification(`正在导入 ${batchStart + 1}-${batchEnd}/${validFiles.length}...`);

            const onBatchDone = () => {
                batchProcessed++;
                if (batchProcessed < batch.length) return;

                try { this.saveSettings(); } catch (e) { }

                setTimeout(() => processBatch(batchEnd), 0);
            };

            batch.forEach((file) => {
                const wallpaperName = seriesName + '/' + file.name.replace(/\.[^/.]+$/, '');

                if (this.settings.customWallpapers.some(wp => wp.name === wallpaperName)) {
                    totalSkipped++;
                    onBatchDone();
                    return;
                }

                if (this.settings.customWallpapers.length >= MAX_WALLPAPERS) {
                    storageFull = true;
                    onBatchDone();
                    return;
                }

                this.compressImage(file, MAX_DIMENSION, MAX_DIMENSION, COMPRESS_QUALITY).then((compressedData) => {
                    if (storageFull) { onBatchDone(); return; }

                    this.settings.customWallpapers.push({ name: wallpaperName, data: compressedData });
                    allSeriesWallpapers.push({ name: wallpaperName, data: compressedData });
                    totalImported++;

                    onBatchDone();
                }).catch(() => {
                    totalSkipped++;
                    onBatchDone();
                });
            });
        };

        processBatch(0);
    }

    finishSeriesImport(seriesName, seriesWallpapers, imported, skipped, storageFull) {
        if (imported > 0) {
            this.settings.wallpaperSeries.push({
                name: seriesName,
                wallpapers: seriesWallpapers.map(w => w.name)
            });

            this.settings.wallpaper = seriesWallpapers[0].data;
            this.settings.persistentWallpaper = true;

            try {
                this.saveSettings();
            } catch (e) {
                console.error('保存设置失败:', e);
            }

            try {
                this.updateCustomWallpapersList();
                this.applySettings();
                const rightPanelUpper = document.getElementById('right-panel-upper');
                if (rightPanelUpper && rightPanelUpper.querySelector('.settings-menu-container')) {
                    const selected = document.getElementById('wallpaper-select-selected');
                    const hiddenSelect = document.getElementById('wallpaper-select');
                    const items = document.getElementById('wallpaper-select-items');
                    this.showSettingsMenuInRightPanel(items, selected, hiddenSelect);
                }
            } catch (e) {
                console.error('更新界面失败:', e);
            }
        }

        let msg = '';
        if (imported === 0) {
            msg = storageFull ? '已达50张上限，无法导入更多壁纸' : '所有图片均已存在或不符合要求';
        } else {
            msg = `系列"${seriesName}": ${imported}张壁纸已导入`;
            if (skipped > 0) msg += `，${skipped}张已跳过`;
            if (storageFull) msg += '（已达50张上限）';
        }
        this.showNotification(msg);
    }

    changeWallpaper(wallpaper) {
        if (wallpaper === 'default') {
            this.settings.wallpaper = 'default';
        } else if (wallpaper === 'bing') {
            this.settings.wallpaper = 'bing';
            this.settings.wallpaperUrl = '';  // 清空旧URL，避免异步获取前显示主题壁纸残留
            this.fetchBingWallpaper();
        } else if (wallpaper === 'url') {
            if (!this.settings.wallpaperUrl) {
                this.settings.wallpaper = 'url';
            }
        } else {
            // 处理自定义上传的壁纸
            const customWallpaper = this.settings.customWallpapers.find(wp => wp.name === wallpaper);
            if (customWallpaper) {
                this.settings.wallpaper = customWallpaper.data;
                this.settings.persistentWallpaper = true;
            }
        }

        // 一致性检测：主题壁纸用 location 标识，此处用实际生效的壁纸值对比
        const theme = this.themes[this.settings.theme];
        const expectedWp = theme?.details?.wallpaper?.location;
        let actualWp = wallpaper;
        if (wallpaper === 'url' && expectedWp && this.settings.wallpaperUrl === expectedWp) {
            actualWp = expectedWp;
        }
        this.checkThemeConsistency('wallpaper', actualWp);

        this.saveSettings();
        this.applyWallpaper();
    }

    // 检查并根据设置决定是否刷新必应壁纸
    checkAndFetchBingWallpaper() {
        // 如果开关打开，每次刷新都更新壁纸
        if (this.settings.bingRefreshEveryTime) {
            this.fetchBingWallpaper();
            return;
        }

        // 如果开关关闭且刷新间隔为0，不自动刷新
        if (this.settings.bingRefreshInterval === 0) {
            // 如果已有壁纸URL，直接使用
            if (this.settings.wallpaperUrl) {
                this.applySettings();
            } else {
                // 如果没有壁纸URL，获取一次
                this.fetchBingWallpaper();
            }
            return;
        }

        // 如果设置了刷新间隔，检查是否需要刷新
        const lastRefreshTime = localStorage.getItem('bingLastRefreshTime');
        const now = Date.now();
        const intervalMs = this.settings.bingRefreshInterval * 60 * 60 * 1000; // 小时转毫秒

        if (!lastRefreshTime || (now - parseInt(lastRefreshTime)) >= intervalMs) {
            // 需要刷新
            this.fetchBingWallpaper();
            localStorage.setItem('bingLastRefreshTime', now.toString());
        } else {
            // 不需要刷新，使用现有壁纸
            if (this.settings.wallpaperUrl) {
                this.applySettings();
            } else {
                // 如果没有壁纸URL，获取一次
                this.fetchBingWallpaper();
            }
        }
    }

    async fetchBingWallpaper() {
        var randomIdx = Math.floor(Math.random() * 8);
        var apiUrl = 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=' + randomIdx + '&n=1&mkt=zh-CN';
        var self = this;
        var lastError = null;

        function notify(msg) {
            var modal = document.getElementById('settings-modal');
            if (modal && modal.classList.contains('show')) {
                self.showNotification(msg);
            }
        }

        function tryApply(data) {
            if (data && data.images && data.images.length > 0) {
                var imageUrl = 'https://www.bing.com' + data.images[0].url;
                self.settings.wallpaperUrl = imageUrl;
                self.applySettings();
                self.saveSettings();
                notify('必应壁纸已应用');
                return true;
            }
            return false;
        }

        async function tryFetch(fetchFn, label) {
            try {
                notify('正在获取壁纸' + (label ? ' (' + label + ')' : ''));
                var response = await fetchFn(apiUrl);
                if (!response.ok) throw new Error('HTTP ' + response.status);
                var data = await response.json();
                if (tryApply(data)) return { ok: true };
                throw new Error('返回数据为空');
            } catch (err) {
                console.warn('[BingWallpaper] ' + (label || '直连') + '失败:', err.message);
                lastError = err;
                return { ok: false };
            }
        }

        try {
            var result = await tryFetch(function (url) { return fetch(url); }, null);

            if (!result.ok && ProxyManager.isProxyEnabled()) {
                result = await tryFetch(function (url) { return ProxyManager.proxiedFetch(url); }, '代理');
            }

            if (!result.ok) {
                if (lastError && (lastError.message.indexOf('Failed to fetch') !== -1 || lastError.message.indexOf('NetworkError') !== -1 || lastError.message.indexOf('cors') !== -1)) {
                    if (ProxyManager.isProxyEnabled()) {
                        notify('直连和代理均失败，请确认代理服务正常运行（端口:' + ProxyManager.getProxyPort() + '）');
                    } else {
                        notify('网络请求被拦截');
                    }
                } else {
                    notify('获取必应壁纸失败：' + (lastError ? lastError.message : '未知错误'));
                }
            }
        } catch (error) {
            console.error('获取必应壁纸失败:', error);
            notify('获取必应壁纸异常：' + error.message);
        }
    }

    showBingTooltip() {
        let overlay = document.getElementById('bing-tooltip-overlay');
        let tooltip = document.getElementById('bing-tooltip');

        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'bing-tooltip-overlay';
            overlay.className = 'bing-tooltip-overlay';
            document.body.appendChild(overlay);
        }

        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'bing-tooltip';
            tooltip.className = 'bing-tooltip';
            tooltip.textContent = '来源于Microsoft Bing，每次刷新都将切换壁纸';
            document.body.appendChild(tooltip);
        }

        setTimeout(() => {
            overlay.classList.add('show');
            tooltip.classList.add('show');
        }, 10);

        const closeTooltip = () => {
            overlay.classList.remove('show');
            tooltip.classList.remove('show');
            setTimeout(() => {
                overlay.removeEventListener('click', closeTooltip);
                document.removeEventListener('keydown', handleEsc);
            }, 300);
        };

        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                closeTooltip();
            }
        };

        overlay.addEventListener('click', closeTooltip);
        document.addEventListener('keydown', handleEsc);
    }

    // 更新自定义Logo列表显示
    updateCustomLogosList() {
        // 更新下拉菜单中的自定义Logo选项
        const logoSelectItems = document.getElementById('logo-select-items');
        const logoSelect = document.getElementById('logo-select');
        const logoSelectSelected = document.getElementById('logo-select-selected');

        if (!logoSelectItems || !logoSelect) return;

        // 移除已有的自定义Logo选项（支持多种标识符）
        const existingCustomItems = logoSelectItems.querySelectorAll('.select-item-custom-logo, .select-item[data-custom="true"]');
        existingCustomItems.forEach(item => item.remove());

        const existingCustomOptions = logoSelect.querySelectorAll('option.custom-logo-option, option[data-custom="true"]');
        existingCustomOptions.forEach(option => option.remove());

        // 添加自定义Logo选项
        this.settings.customLogos.forEach(logo => {
            // 添加到下拉菜单
            const selectItem = document.createElement('div');
            selectItem.className = 'select-item select-item-custom-logo';
            selectItem.setAttribute('data-value', logo.name);
            selectItem.textContent = logo.name;
            logoSelectItems.appendChild(selectItem);

            // 添加到隐藏的select
            const option = document.createElement('option');
            option.value = logo.name;
            option.textContent = logo.name;
            option.className = 'custom-logo-option';
            logoSelect.appendChild(option);
        });

        // 更新显示的文本
        if (logoSelectSelected) {
            // 主题模式下保持"主题名：Logo名"格式，不覆盖
            const themeInfo = this.getThemeDisplayInfo();
            if (themeInfo && themeInfo.logoName) {
                // 保持不变
            } else {
                const selectedOption = logoSelect.querySelector(`option[value="${this.settings.logo}"]`);
                if (selectedOption) {
                    logoSelectSelected.textContent = selectedOption.textContent;
                }
            }
        }

        // 重新绑定下拉菜单点击事件
        this.rebindCustomSelectItems();
    }

    // 重新绑定下拉菜单点击事件
    rebindCustomSelectItems() {
        const logoSelectItems = document.getElementById('logo-select-items');
        const logoSelect = document.getElementById('logo-select');
        const logoSelectSelected = document.getElementById('logo-select-selected');

        if (!logoSelectItems || !logoSelect || !logoSelectSelected) return;

        const selectItems = logoSelectItems.querySelectorAll('.select-item');
        selectItems.forEach(item => {
            // 移除旧的事件监听器（通过克隆节点）
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);

            // 添加新的事件监听器
            newItem.addEventListener('click', (e) => {
                e.stopPropagation();

                const value = newItem.getAttribute('data-value');

                // 如果是自定义文字Logo选项，特殊处理
                if (value === 'text-logo') {
                    const textLogoGroup = document.getElementById('text-logo-inline-group');
                    if (textLogoGroup) {
                        textLogoGroup.style.display = 'flex';
                    }
                    newItem.classList.add('selected');
                    return;
                }

                // 隐藏文字Logo输入框
                const textLogoGroup = document.getElementById('text-logo-inline-group');
                if (textLogoGroup) {
                    textLogoGroup.style.display = 'none';
                }

                // 更新选中值
                const text = newItem.textContent;
                logoSelectSelected.textContent = text;
                logoSelect.value = value;

                const event = new Event('change', { bubbles: true });
                logoSelect.dispatchEvent(event);

                // 关闭下拉菜单
                logoSelectItems.classList.add('select-hide');
            });
        });
    }

    // 删除自定义Logo
    deleteCustomLogo(index) {
        const logoName = this.settings.customLogos[index].name;

        // 从设置中移除
        this.settings.customLogos.splice(index, 1);

        // 如果当前使用的是被删除的Logo，则切换回默认Logo
        if (this.settings.logo === logoName) {
            this.settings.logo = 'default';
            this.applyLogo();
        }

        // 更新自定义Logo列表显示（会自动清理DOM）
        this.updateCustomLogosList();
        this.saveSettings();
        this.showNotification('自定义Logo删除');
    }

    // 删除自定义字体
    deleteCustomFont(index) {
        const fontName = this.settings.customFonts[index].name;

        // 从设置中移除
        this.settings.customFonts.splice(index, 1);

        // 如果当前使用的是被删除的字体，则切换回默认字体
        if (this.settings.font === fontName) {
            this.settings.font = 'Sans Flex';
            this.applyFont();
        }

        // 更新自定义字体列表显示
        this.updateCustomFontsList();
        this.saveSettings();
        this.showNotification('字体已删除');
    }

    // 更新自定义字体列表
    updateCustomFontsList() {
        const fontSelectItems = document.getElementById('font-select-items');
        const fontSelect = document.getElementById('font-select');
        const fontSelectSelected = document.getElementById('font-select-selected');

        if (!fontSelectItems || !fontSelect) return;

        // 移除已有的自定义字体选项（支持多种标识符）
        const existingCustomItems = fontSelectItems.querySelectorAll('.select-item-custom-font, .select-item[data-custom="true"]');
        existingCustomItems.forEach(item => item.remove());

        const existingCustomOptions = fontSelect.querySelectorAll('option.custom-font-option, option[data-custom="true"]');
        existingCustomOptions.forEach(option => option.remove());

        // 添加自定义字体选项
        this.settings.customFonts.forEach(font => {
            // 添加到下拉菜单
            const selectItem = document.createElement('div');
            selectItem.className = 'select-item select-item-custom-font';
            selectItem.setAttribute('data-value', font.name);
            selectItem.textContent = font.name;
            fontSelectItems.appendChild(selectItem);

            // 添加到隐藏的select
            const option = document.createElement('option');
            option.value = font.name;
            option.textContent = font.name;
            option.className = 'custom-font-option';
            fontSelect.appendChild(option);
        });

        // 更新显示的文本
        if (fontSelectSelected) {
            const themeInfo = this.getThemeDisplayInfo();
            if (!themeInfo || !themeInfo.fontName) {
                const selectedOption = fontSelect.querySelector(`option[value="${this.settings.font}"]`);
                if (selectedOption) {
                    fontSelectSelected.textContent = selectedOption.textContent;
                }
            }
        }
    }

    // 删除自定义壁纸
    deleteCustomWallpaper(index) {
        const wallpaperName = this.settings.customWallpapers[index].name;
        const wallpaperData = this.settings.customWallpapers[index].data;

        // 从设置中移除
        this.settings.customWallpapers.splice(index, 1);

        // 如果当前使用的是被删除的壁纸，则切换回默认壁纸
        if (this.settings.wallpaper === wallpaperData) {
            this.settings.wallpaper = 'default';
            this.applyWallpaper();
        }

        // 更新自定义壁纸列表显示
        this.updateCustomWallpapersList();
        this.saveSettings();
        this.showNotification('壁纸：删除');
    }

    // 更新自定义壁纸列表
    updateCustomWallpapersList() {
        const wallpaperSelectItems = document.getElementById('wallpaper-select-items');
        const wallpaperSelect = document.getElementById('wallpaper-select');
        const wallpaperSelectSelected = document.getElementById('wallpaper-select-selected');

        if (!wallpaperSelectItems || !wallpaperSelect) return;

        // 移除已有的自定义壁纸选项（支持多种标识符）
        const existingCustomItems = wallpaperSelectItems.querySelectorAll('.select-item-custom-wallpaper, .select-item[data-custom="true"]');
        existingCustomItems.forEach(item => item.remove());

        const existingCustomOptions = wallpaperSelect.querySelectorAll('option.custom-wallpaper-option, option[data-custom="true"]');
        existingCustomOptions.forEach(option => option.remove());

        // 添加自定义壁纸选项
        this.settings.customWallpapers.forEach(wp => {
            // 添加到下拉菜单
            const selectItem = document.createElement('div');
            selectItem.className = 'select-item select-item-custom-wallpaper';
            selectItem.setAttribute('data-value', wp.name);
            selectItem.textContent = wp.name;
            wallpaperSelectItems.appendChild(selectItem);

            // 添加到隐藏的select
            const option = document.createElement('option');
            option.value = wp.name;
            option.textContent = wp.name;
            option.className = 'custom-wallpaper-option';
            wallpaperSelect.appendChild(option);
        });

        // 更新显示的文本
        if (wallpaperSelectSelected) {
            const themeInfo = this.getThemeDisplayInfo();
            if (!themeInfo || !themeInfo.wallpaperName) {
                const selectedOption = wallpaperSelect.querySelector(`option[value="${this.settings.wallpaper}"]`);
                if (selectedOption) {
                    wallpaperSelectSelected.textContent = selectedOption.textContent;
                }
            }
        }
    }

    // 上传暗色Logo
    uploadDarkLogo(index) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // 检查文件大小（限制为2MB）
            if (file.size > 2 * 1024 * 1024) {
                this.showNotification('图片文件过大，请选择小于2MB的文件');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const darkLogoData = e.target.result;
                this.settings.customLogos[index].darkData = darkLogoData;
                this.saveSettings();
                this.applyLogo();
                this.updateCustomLogosList();
                this.showNotification('暗色Logo上传');
            };
            reader.onerror = () => {
                this.showNotification('文件读取失败');
            };

            reader.readAsDataURL(file);
        });

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    }

    // 删除暗色Logo
    deleteDarkLogo(index) {
        this.settings.customLogos[index].darkData = null;
        this.saveSettings();
        this.applyLogo();
        this.updateCustomLogosList();
        this.showNotification('暗色Logo删除');
    }

    // 添加快速访问链接
    addQuickLink() {
        const nameInput = document.getElementById('quick-link-name');
        const urlInput = document.getElementById('quick-link-url');

        const name = nameInput.value.trim();
        let url = urlInput.value.trim();

        if (!name) {
            this.showNotification('请输入网站名称');
            nameInput.focus();
            return;
        }

        if (!url) {
            this.showNotification('请输入网站地址');
            urlInput.focus();
            return;
        }

        // 确保URL包含协议
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        // 检查URL格式
        try {
            new URL(url);
        } catch (e) {
            this.showNotification('网站地址格式不正确');
            urlInput.focus();
            return;
        }

        // 检查是否已存在同名链接
        const existingIndex = this.settings.quickLinks.findIndex(link => link.name === name);
        if (existingIndex >= 0) {
            // 更新现有链接
            this.settings.quickLinks[existingIndex].url = url;
            this.showNotification('快速访问链接已更新');
        } else {
            // 添加新链接
            this.settings.quickLinks.push({ name, url });
            this.showNotification('快速访问链接已添加');
        }

        // 清空输入框
        nameInput.value = '';
        urlInput.value = '';

        // 更新列表和保存设置
        this.updateQuickLinksList();
        this.saveSettings();
    }

    // 更新快速访问链接列表UI
    updateQuickLinksList() {
        const quickLinksList = document.getElementById('quick-links-list');
        if (!quickLinksList) return;

        quickLinksList.innerHTML = '';

        if (this.settings.quickLinks.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'quick-links-empty';
            emptyMessage.textContent = '暂无快速访问链接';
            quickLinksList.appendChild(emptyMessage);
            return;
        }

        this.settings.quickLinks.forEach((link, index) => {
            const linkItem = document.createElement('div');
            linkItem.className = 'quick-link-menu-item';

            const linkInfo = document.createElement('div');
            linkInfo.className = 'quick-link-menu-info';

            const linkName = document.createElement('div');
            linkName.className = 'quick-link-menu-name';
            linkName.textContent = link.name;

            const linkUrl = document.createElement('div');
            linkUrl.className = 'quick-link-menu-url';
            linkUrl.textContent = link.url;

            linkInfo.appendChild(linkName);
            linkInfo.appendChild(linkUrl);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-link-menu-btn';
            deleteBtn.textContent = '删除';
            deleteBtn.addEventListener('click', () => this.deleteQuickLink(index));

            linkItem.appendChild(linkInfo);
            linkItem.appendChild(deleteBtn);

            quickLinksList.appendChild(linkItem);
        });
    }

    // 删除快速访问链接
    deleteQuickLink(index) {
        if (index >= 0 && index < this.settings.quickLinks.length) {
            const linkName = this.settings.quickLinks[index].name;
            this.settings.quickLinks.splice(index, 1);
            this.updateQuickLinksList();
            this.saveSettings();
            this.showNotification(`快速访问链接 "${linkName}" 已删除`);
        }
    }

    // 应用并显示快速访问链接按钮
    applyQuickLinks() {
        const quickAccessContainer = document.getElementById('quick-access-links');
        quickAccessContainer.innerHTML = '';

        if (this.settings.quickLinks.length === 0) {
            quickAccessContainer.style.display = 'none';
        } else if (this.settings.quickAccessSidebar) {
            // 快速访问侧边栏：隐藏原始底部链接，显示侧边栏
            quickAccessContainer.style.display = 'none';
        } else {
            quickAccessContainer.style.display = 'flex';

            this.settings.quickLinks.forEach(link => {
                const linkBtn = document.createElement('button');
                linkBtn.className = 'quick-access-btn';
                linkBtn.textContent = link.name;
                linkBtn.addEventListener('click', () => {
                    window.open(link.url, '_blank');
                });

                quickAccessContainer.appendChild(linkBtn);
            });
        }

        // 渲染侧边栏版本
        this.renderQuickAccessSidebar();
    }

    // 渲染快速访问链接侧边栏
    renderQuickAccessSidebar() {
        const sidebarLinks = document.getElementById('quick-access-sidebar-links');
        if (!sidebarLinks) return;

        sidebarLinks.innerHTML = '';

        if (this.settings.quickLinks.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'quick-access-sidebar-empty';
            emptyMsg.textContent = '暂无快速访问链接';
            sidebarLinks.appendChild(emptyMsg);
            this.updateSidebarVisibility();
            this.updateSidebarIconColors();
            // 不 return，继续渲染底部的添加按钮
        } else {

            this.settings.quickLinks.forEach((link, index) => {
                const linkItem = document.createElement('button');
                linkItem.className = 'quick-access-sidebar-link';
                linkItem.title = link.url;

                // 图标容器
                const iconEl = document.createElement('span');
                iconEl.className = 'quick-access-sidebar-link-icon';

                // 字母占位（默认显示）
                const letterEl = document.createElement('span');
                letterEl.className = 'quick-access-sidebar-link-letter';
                letterEl.textContent = link.name.charAt(0).toUpperCase();
                iconEl.appendChild(letterEl);

                // 尝试显示已缓存的 favicon
                const faviconImg = document.createElement('img');
                faviconImg.className = 'quick-access-sidebar-link-favicon';
                faviconImg.alt = '';
                faviconImg.style.display = 'none';

                const domain = this.extractDomain(link.url);
                let faviconUrl = null;
                let tryFallback = false;

                if (link._favicon) {
                    // _favicon 为空字符串表示之前已检测为无图标
                    if (link._favicon !== '') {
                        faviconUrl = link._favicon;
                    }
                } else if (domain) {
                    faviconUrl = 'https://www.google.com/s2/favicons?domain=' + domain + '&sz=32';
                    tryFallback = true;
                }

                if (faviconUrl) {
                    faviconImg.src = faviconUrl;

                    const self = this;
                    let fallbackTried = false;

                    faviconImg.onerror = function () {
                        if (tryFallback && !fallbackTried && domain) {
                            fallbackTried = true;
                            this.src = 'https://icons.duckduckgo.com/ip3/' + domain + '.ico';
                            return;
                        }
                        // 两个源都失败，回退到字母占位
                        this.style.display = 'none';
                        const letter = this.parentElement.querySelector('.quick-access-sidebar-link-letter');
                        if (letter) letter.style.display = 'flex';
                        if (!link._favicon && domain) {
                            self.cacheFavicon(link, index, domain, null);
                        }
                    };

                    faviconImg.onload = function () {
                        // 检测是否为默认图标（如 Google 的默认地球图标大小为 16x16）
                        const isDefaultIcon = this.naturalWidth <= 20 || this.naturalHeight <= 20;

                        if (isDefaultIcon && !link._favicon) {
                            // 无真实图标，回退到字母占位
                            this.style.display = 'none';
                            const letter = this.parentElement.querySelector('.quick-access-sidebar-link-letter');
                            if (letter) letter.style.display = 'flex';
                            // 标记为无图标，下次不再尝试加载
                            self.cacheFavicon(link, index, domain, null);
                            return;
                        }

                        const letter = this.parentElement.querySelector('.quick-access-sidebar-link-letter');
                        if (letter) letter.style.display = 'none';
                        this.style.display = 'block';

                        if (!link._favicon && domain) {
                            self.cacheFavicon(link, index, domain, this.src);
                        }
                    };
                }

                iconEl.appendChild(faviconImg);

                // 文字
                const textEl = document.createElement('span');
                textEl.className = 'quick-access-sidebar-link-text';
                textEl.textContent = link.name;

                linkItem.appendChild(iconEl);
                linkItem.appendChild(textEl);

                linkItem.addEventListener('click', () => {
                    window.open(link.url, '_blank');
                });

                sidebarLinks.appendChild(linkItem);
            });
        } // else 结束

        // 根据设置显示/隐藏图标
        const containerEl = document.getElementById('quick-access-sidebar-container');
        if (containerEl) {
            containerEl.classList.toggle('no-icons', !this.settings.showQuickLinkIcons);
            // 内联样式兜底，确保图标隐藏
            const linkItems = containerEl.querySelectorAll('.quick-access-sidebar-link');
            linkItems.forEach(item => {
                const icon = item.querySelector('.quick-access-sidebar-link-icon');
                if (icon) {
                    icon.style.display = this.settings.showQuickLinkIcons ? '' : 'none';
                }
            });
        }

        this.updateSidebarVisibility();
        this.updateSidebarIconColors();
    }

    // 提取域名
    extractDomain(url) {
        try {
            const u = new URL(url);
            return u.hostname;
        } catch (e) {
            return null;
        }
    }

    // 缓存 favicon 信息到设置中
    // src 有值 = 该网站有图标；src 为 null = 无图标，下次不再尝试加载
    cacheFavicon(link, index, domain, src) {
        if (src) {
            this.settings.quickLinks[index]._favicon = src;
        } else {
            // 标记为无图标，存储空字符串避免下次重复请求
            this.settings.quickLinks[index]._favicon = '';
        }
        this.saveSettings();
    }

    // 更新侧边栏图标配色（跟随配色方案）
    updateSidebarIconColors() {
        const container = document.getElementById('quick-access-sidebar-container');
        if (!container) return;

        const colorConfig = this.getColorConfig();
        container.style.setProperty('--sidebar-icon-bg', colorConfig.sidebarIcon);
    }

    // 根据 quickAccessSidebar 设置更新侧边栏可见性
    updateSidebarVisibility() {
        const sidebar = document.getElementById('quick-access-sidebar');
        if (!sidebar) return;

        if (this.settings.quickAccessSidebar) {
            sidebar.classList.add('active');
        } else {
            sidebar.classList.remove('active');
            // 同时隐藏容器
            const container = document.getElementById('quick-access-sidebar-container');
            if (container) {
                container.classList.remove('visible');
                container.classList.add('hiding');
            }
        }
    }

    // 初始化快速访问侧边栏交互
    initQuickAccessSidebar() {
        const trigger = document.getElementById('quick-access-sidebar-trigger');
        const container = document.getElementById('quick-access-sidebar-container');
        const sidebar = document.getElementById('quick-access-sidebar');
        const addBtn = document.getElementById('quick-access-sidebar-add-btn');

        if (!trigger || !container || !sidebar) return;

        // 添加按钮：打开设置并跳转到快速链接管理
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.openSettings('badge');
                // 等待设置面板打开后，显示快速链接管理
                setTimeout(() => {
                    this.showQuickLinksMenuInRightPanel();
                }, 100);
            });
        }

        let hideTimeout = null;
        let isVisible = false;
        const TRIGGER_ZONE_WIDTH = 100;  // 右侧触发区域宽度（像素）
        const HIDE_DELAY = 0;

        const pushWallpaper = (pushIn) => {
            this._sidebarPushing = pushIn && window.innerWidth >= 750;
            if (this.wallpaperMain && this.settings.wallpaperScale &&
                (this.settings.persistentWallpaper || this.isScrolled)) {
                this.wallpaperMain.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                this.applyWallpaperTransform();
            }
        };

        const showSidebar = () => {
            if (!this.settings.quickAccessSidebar) return;
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
            if (!isVisible) {
                isVisible = true;
                container.classList.remove('hiding');
                container.classList.add('visible');

                document.body.classList.add('sidebar-visible');

                pushWallpaper(true);
            }
        };

        const scheduleHide = () => {
            if (hideTimeout) clearTimeout(hideTimeout);
            hideTimeout = setTimeout(() => {
                if (isVisible) {
                    isVisible = false;
                    container.classList.remove('visible');
                    container.classList.add('hiding');
                    document.body.classList.remove('sidebar-visible');
                    pushWallpaper(false);
                }
                hideTimeout = null;
            }, HIDE_DELAY);
        };

        // 全局鼠标移动检测：在右侧边缘触发区域显示容器
        document.addEventListener('mousemove', (e) => {
            if (!this.settings.quickAccessSidebar) return;
            const viewportWidth = window.innerWidth;
            const mouseX = e.clientX;

            if (mouseX >= viewportWidth - TRIGGER_ZONE_WIDTH) {
                showSidebar();
            } else if (isVisible) {
                // 仅在容器可见时检查是否需要隐藏
                const containerRect = container.getBoundingClientRect();
                const isOverContainer = (
                    mouseX >= containerRect.left &&
                    mouseX <= containerRect.right &&
                    e.clientY >= containerRect.top &&
                    e.clientY <= containerRect.bottom
                );
                if (!isOverContainer) {
                    scheduleHide();
                }
            }
        });

        // 容器悬停维持显示
        container.addEventListener('mouseenter', () => {
            if (!this.settings.quickAccessSidebar) return;
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
            if (!isVisible) {
                isVisible = true;
                container.classList.remove('hiding');
                container.classList.add('visible');
            }
        });

        container.addEventListener('mouseleave', () => {
            scheduleHide();
        });

        // 禁用快速访问侧边栏内的滚轮事件触发壁纸模式
        sidebar.addEventListener('wheel', (e) => {
            e.stopPropagation();
        }, { passive: true });
        container.addEventListener('wheel', (e) => {
            e.stopPropagation();
        }, { passive: true });
    }

    // 设置文字Logo
    setTextLogo() {
        const textInput = document.getElementById('text-logo-input');
        const text = textInput.value.trim();

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

        if (text) {
            // 检查字符长度
            if (getCharLength(text) > 25) {
                this.showNotification('超出输入范围');
                return;
            }

            this.settings.logoType = 'text';
            this.settings.logo = 'text-logo';
            this.settings.textLogo = text;
            this.userChangedLogo = true;
            this.applyLogo();
            this.saveSettings();
            this.showNotification('文字Logo设置');

            // 更新select-selected的显示文本
            const selected = document.getElementById('logo-select-selected');
            if (selected) {
                selected.textContent = '自定义文字Logo';
            }

            // 更新隐藏的select元素的值
            const hiddenSelect = document.getElementById('logo-select');
            if (hiddenSelect) {
                hiddenSelect.value = 'text-logo';
            }

            // 关闭下拉菜单
            const items = document.getElementById('logo-select-items');
            if (items) {
                items.classList.add('select-hide');
            }
        } else {
            this.showNotification('请输入文本');
        }
    }

    handleScroll(e) {
        // 设置页面打开时，完全禁用滚动检测（避免触发壁纸模式）
        const settingsModal = document.getElementById('settings-modal');
        if (settingsModal && (settingsModal.classList.contains('show') || settingsModal.classList.contains('hiding'))) {
            return;
        }

        // Info框打开时，完全禁用滚动检测（避免误触壁纸模式）
        if (this.infoPopupOpen) {
            // 自动恢复：如果弹窗DOM已被外部移除，重置标志位
            if (!document.querySelector('.ooo-info-popup')) {
                this.infoPopupOpen = false;
            } else {
                return;
            }
        }

        // 节流：如果正在动画中，忽略新的滚动事件
        if (this.isAnimating) return;

        // 清除之前的动画定时器，允许打断
        if (this._animationTimeout) {
            clearTimeout(this._animationTimeout);
            this._animationTimeout = null;
        }

        // 向下滚动出现壁纸
        if (e.deltaY > 0 && !this.isScrolled) {
            this.showWallpaper();
        }
        // 向上滚动恢复
        else if (e.deltaY < 0 && this.isScrolled) {
            this.restoreHomepage();
        }
    }

    // 预加载壁纸并立即设置（隐藏状态）
    preloadWallpaper() {
        const wallpaperUrl = this.getWallpaperUrl();

        if (wallpaperUrl) {
            // 预加载到浏览器缓存
            const img = new Image();
            img.onload = () => { };
            img.src = wallpaperUrl;

            // 在两层的 blur 层和 main 层上设置背景图
            this.setWallpaperOnLayers(wallpaperUrl);
            // body上不设背景图（避免CSS类冲突和黑边）
            document.body.style.backgroundImage = 'none';

            // 如果没有开启壁纸常显，并且不在壁纸模式，立即隐藏层
            if (!this.settings.persistentWallpaper && !this.isScrolled) {
                setTimeout(() => {
                    this.clearWallpaperLayers();
                    document.body.style.backgroundImage = '';
                }, 0);
            }
        }
    }

    primeWallpaperEffects() {
        if (!this.settings.dynamicBlur) return;

        requestAnimationFrame(() => {
            const style = document.createElement('style');
            style.id = 'prime-wallpaper-no-transition';
            style.textContent = '*, *::before, *::after { transition: none !important; animation: none !important; }';
            document.head.appendChild(style);

            const hadDynamicBlur = document.body.classList.contains('dynamic-blur');

            document.body.classList.add('scrolled');
            document.body.classList.add('dynamic-blur');
            document.body.classList.add('user-scrolled');

            void document.body.offsetHeight;

            requestAnimationFrame(() => {
                document.body.classList.remove('scrolled');
                document.body.classList.remove('user-scrolled');

                if (!hadDynamicBlur) {
                    document.body.classList.remove('dynamic-blur');
                }

                void document.body.offsetHeight;

                if (style.parentNode) {
                    style.parentNode.removeChild(style);
                }
            });
        });
    }

    showWallpaper() {
        // 如果启用了壁纸常显功能且已经显示壁纸，则直接返回
        if (this.settings.persistentWallpaper && this.isScrolled && document.body.classList.contains('user-scrolled')) {
            if (this.settings.dynamicBlur) {
                document.body.classList.add('dynamic-blur');
            } else {
                document.body.classList.remove('dynamic-blur');
            }
            return;
        }

        this.isScrolled = true;

        // 先添加退出动画类（确保从当前状态开始动画）
        document.body.classList.add('exit-animation');

        // 使用requestAnimationFrame确保浏览器已渲染初始状态
        requestAnimationFrame(() => {
            // 下一帧再修改其他class，触发CSS transition
            document.body.classList.add('scrolled');
            document.body.classList.remove('homepage-wallpaper');

            if (!this.settings.persistentWallpaper) {
                document.body.classList.add('user-scrolled');
            }

            // 动画完成后移除退出动画类（350ms + 缓冲）
            setTimeout(() => {
                document.body.classList.remove('exit-animation');
            }, 400);
        });

        if (this.settings.dynamicBlur) {
            document.body.classList.add('dynamic-blur');
            this.startAdvancedVisualEffects();
        } else {
            document.body.classList.remove('dynamic-blur');
        }

        // 同步应用壁纸（使用模糊填充层，无黑边）
        const url = this.getWallpaperUrl();
        if (url) {
            this.setWallpaperOnLayers(url);
        }
        document.body.style.backgroundImage = 'none';

        document.body.style.transition = 'none';

        // 壁纸缩放动画：根据填充模式选择不同动画方式
        if (this.settings.persistentWallpaper && this.settings.wallpaperScale && this.wallpaperMain) {
            this.wallpaperMain.style.transition = 'none';
            // 两种模式统一使用 transform scale 做缩放动画
            // 填满模式：background-size: cover；适配模式：background-size: contain（CSS控制）
            this.wallpaperMain.style.backgroundSize = '';
            this.wallpaperMain.style.backgroundPosition = '';
            // 不在此处设置 transform，保持当前状态作为动画起点
        } else if (this.wallpaperMain) {
            this.wallpaperMain.style.backgroundSize = '';
            this.wallpaperMain.style.backgroundPosition = '';
            this.wallpaperMain.style.transform = '';
            this.wallpaperMain.style.transition = '';
        }

        const engineButtons = document.querySelector('.engine-buttons');
        if (engineButtons) {
            engineButtons.style.marginTop = '';
        }

        const searchHistoryContainer = document.getElementById('search-history-container');
        if (searchHistoryContainer) {
            searchHistoryContainer.classList.remove('show');
        }

        const quickAccessLinks = document.getElementById('quick-access-links');
        if (quickAccessLinks) {
            quickAccessLinks.style.transform = '';
            quickAccessLinks.style.opacity = '';
            quickAccessLinks.style.pointerEvents = '';
        }

        // 壁纸缩放动画：仅在常显示模式下对主层进行连贯放大和偏移
        // 两种模式统一使用 transform scale 实现缩放，background-size 由 CSS fill-mode 类控制
        if (this.settings.persistentWallpaper && this.settings.wallpaperScale && this.wallpaperMain) {
            void this.wallpaperMain.offsetHeight;
            this.wallpaperMain.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            this.applyWallpaperTransform();
        }

        this.isAnimating = true;
        this._animationTimeout = setTimeout(() => {
            this.isAnimating = false;
            this._animationTimeout = null;
        }, 450);
    }

    // 应用主页壁纸显示
    applyHomepageWallpaper() {
        if (this.settings.persistentWallpaper) {
            document.body.classList.add('homepage-wallpaper');
        } else {
            document.body.classList.remove('homepage-wallpaper');
        }
    }

    restoreHomepage(immediate = false) {
        // 不停止高级视觉效果，让它在后台继续运行，下次进入更流畅

        if (this.settings.dynamicBlur) {
            document.body.classList.add('dynamic-blur');
        } else {
            document.body.classList.remove('dynamic-blur');
        }

        this.isScrolled = false;

        if (!immediate) {
            document.body.classList.add('enter-animation');
        }

        document.body.classList.remove('scrolled');
        document.body.classList.remove('user-scrolled');

        if (this.settings.persistentWallpaper) {
            document.body.classList.add('homepage-wallpaper');
        }

        // 同步移除壁纸（使用层系统，模糊层始终覆盖无黑边）
        if (this.settings.persistentWallpaper) {
            // 壁纸常显模式下保持壁纸，但处理缩放动画
            if (this.settings.wallpaperScale && this.wallpaperMain) {
                void this.wallpaperMain.offsetHeight;
                // 两种模式统一使用 transform scale 回缩
                this.wallpaperMain.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                this.applyWallpaperTransform();
                setTimeout(() => {
                    if (this.wallpaperMain) {
                        // 动画结束后若没有侧边栏推入，清除空变换
                        if (!this._sidebarPushing) {
                            this.wallpaperMain.style.transform = '';
                        }
                        this.wallpaperMain.style.transition = '';
                    }
                }, 400);
            }
        } else {
            this.clearWallpaperLayers();
            document.body.style.backgroundImage = '';
        }

        const searchHistoryContainer = document.getElementById('search-history-container');
        if (searchHistoryContainer) {
            searchHistoryContainer.classList.remove('show');
        }

        if (!immediate) {
            requestAnimationFrame(() => {
                document.body.classList.add('enter-active');
                setTimeout(() => {
                    document.body.classList.remove('enter-animation');
                    document.body.classList.remove('enter-active');
                }, 400);
            });
        }

        if (immediate) {
            this.isAnimating = false;
            if (this._animationTimeout) {
                clearTimeout(this._animationTimeout);
                this._animationTimeout = null;
            }
        } else {
            this.isAnimating = true;
            this._animationTimeout = setTimeout(() => {
                this.isAnimating = false;
                this._animationTimeout = null;
            }, 450);
        }
    }

    switchEngine(engine) {
        this.currentEngine = engine;

        // 更新按钮状态
        document.getElementById('google-engine').classList.toggle('active', engine === 'google');
        document.getElementById('bing-engine').classList.toggle('active', engine === 'bing');

        // 自动切换Logo（仅当用户没有手动更改过Logo时）
        if (!this.userChangedLogo && this.settings.logo !== 'default') {
            if (engine === 'google') {
                this.settings.logo = 'Google';
                this.settings.logoType = 'image';
            } else {
                this.settings.logo = 'Microsoft';
                this.settings.logoType = 'image';
            }
            this.applyLogo();
            this.saveSettings();
        } else if (this.settings.logo === 'auto') {
            // 自动模式下切换引擎时更新Logo
            this.applyLogo();
        }

        // 为按钮添加logo类名
        this.updateEngineButtonClasses();

        // 如果有搜索文字，立即搜索
        const searchInput = document.getElementById('search-input');
        if (searchInput.value.trim()) {
            this.performSearch(searchInput.value);
        }
    }

    performSearch(query) {
        if (!query.trim()) return;

        this.addToSearchHistory(query);

        const trimmedQuery = query.trim();
        const lowerQuery = trimmedQuery.toLowerCase();

        if (lowerQuery.startsWith('网址/') || lowerQuery.startsWith('web/')) {
            let url = trimmedQuery.substring(trimmedQuery.indexOf('/') + 1).trim();

            if (!url) return;

            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }

            try {
                new URL(url);
                window.location.href = url;
            } catch (e) {
                this.showNotification('无效的URL地址');
            }
            return;
        }

        let searchUrl;
        if (this.currentEngine === 'google') {
            searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        } else {
            searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
        }

        window.location.href = searchUrl;
    }

    performGoogleLucky() {
        const searchInput = document.getElementById('search-input');
        const query = searchInput.value.trim();

        if (!query) {
            this.showNotification('请输入搜索内容');
            return;
        }

        this.addToSearchHistory(query);

        const luckyUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&btnI=1`;
        window.location.href = luckyUrl;
    }

    addToSearchHistory(query) {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return;

        this.settings.searchHistoryItems = this.settings.searchHistoryItems.filter(item => item !== trimmedQuery);
        this.settings.searchHistoryItems.unshift(trimmedQuery);

        if (this.settings.searchHistoryItems.length > 20) {
            this.settings.searchHistoryItems = this.settings.searchHistoryItems.slice(0, 20);
        }

        this.saveSettings();
    }

    showSearchHistory(currentInput = '') {
        if (document.body.classList.contains('scrolled')) {
            return;
        }

        const searchHistoryContainer = document.getElementById('search-history-container');
        const searchHistoryList = document.querySelector('.search-history-list');
        const quickAccessLinks = document.getElementById('quick-access-links');
        const engineButtons = document.querySelector('.engine-buttons');

        if (!searchHistoryContainer || !searchHistoryList) return;

        searchHistoryList.innerHTML = '';

        let historyItems = [...this.settings.searchHistoryItems];

        if (currentInput.trim()) {
            const inputLower = currentInput.toLowerCase();

            historyItems.sort((a, b) => {
                const aLower = a.toLowerCase();
                const bLower = b.toLowerCase();

                const scoreA = this.calculateRelevance(aLower, inputLower);
                const scoreB = this.calculateRelevance(bLower, inputLower);

                return scoreB - scoreA;
            });
        }

        historyItems.forEach((query) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'search-history-item';
            historyItem.dataset.query = query;
            historyItem.innerHTML = `
                <span class="search-history-text">${this.escapeHtml(query)}</span>
                <button class="search-history-delete" data-query="${this.escapeHtml(query)}">
                    ×
                </button>
            `;
            searchHistoryList.appendChild(historyItem);
        });

        searchHistoryContainer.classList.add('show');

        if (quickAccessLinks) {
            quickAccessLinks.style.transform = 'translateY(1000px)';
            quickAccessLinks.style.opacity = '0';
            quickAccessLinks.style.pointerEvents = 'none';
        }
    }

    hideSearchHistory() {
        const searchHistoryContainer = document.getElementById('search-history-container');
        const quickAccessLinks = document.getElementById('quick-access-links');
        const engineButtons = document.querySelector('.engine-buttons');

        if (searchHistoryContainer) {
            searchHistoryContainer.classList.remove('show');
        }

        if (quickAccessLinks) {
            quickAccessLinks.style.transform = '';
            quickAccessLinks.style.opacity = '';
            quickAccessLinks.style.pointerEvents = '';
        }
    }

    removeFromSearchHistory(query) {
        this.settings.searchHistoryItems = this.settings.searchHistoryItems.filter(item => item !== query);
        this.saveSettings();
        this.showSearchHistory(document.getElementById('search-input').value);
    }

    calculateRelevance(text, query) {
        if (!query) return 0;

        let score = 0;

        if (text.startsWith(query)) {
            score += 10;
        }

        if (text.includes(query)) {
            score += 5;
        }

        const words = query.split(' ');
        words.forEach(word => {
            if (text.includes(word)) {
                score += 2;
            }
        });

        return score;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    toggleBadgeText() {
        const badge = document.getElementById('ooo-badge');
        const hasAnimation = this.settings.dynamicBlur || this.settings.enhancedDisplay;

        if (hasAnimation) {
            badge.style.transform = 'scale(0.95)';
            badge.style.opacity = '0.8';

            setTimeout(() => {
                if (this.isBadgeExpanded) {
                    badge.innerHTML = '<span>OOOInterface</span><div id="info-indicator" class="info-indicator"></div>';
                } else {
                    badge.innerHTML = `OOOInterface(${this.currentVersion})<div id="info-indicator" class="info-indicator"></div>`;
                }

                badge.style.transform = 'scale(1)';
                badge.style.opacity = '1';

                this.isBadgeExpanded = !this.isBadgeExpanded;
            }, 100);
        } else {
            if (this.isBadgeExpanded) {
                badge.innerHTML = '<span>OOOInterface</span><div id="info-indicator" class="info-indicator"></div>';
            } else {
                badge.innerHTML = `OOOInterface(${this.currentVersion})<div id="info-indicator" class="info-indicator"></div>`;
            }

            this.isBadgeExpanded = !this.isBadgeExpanded;
        }
    }

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
    }

    // 更新设置界面中的值
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
        const colorSchemeValue = this.settings.colorScheme || 'green';
        const colorSchemeSelect = document.getElementById('color-scheme-select');
        if (colorSchemeSelect) {
            // 'theme-add' 不是有效 <option>，跳过设值避免 select 回退到第一个选项
            if (colorSchemeValue !== 'theme-add') {
                colorSchemeSelect.value = colorSchemeValue;
            }
            const colorSchemeSelected = document.getElementById('color-scheme-select-selected');
            if (colorSchemeSelected) {
                const themeInfo = this.getThemeDisplayInfo();
                if (themeInfo && themeInfo.colorName) {
                    colorSchemeSelected.textContent = themeInfo.themeName + '：' + themeInfo.colorName;
                } else {
                    colorSchemeSelected.textContent = COLOR_SCHEME_NAMES[colorSchemeValue] || '自定义';
                }
            }
        }

        // 更新新增的设置选项
        document.getElementById('dynamic-blur-toggle').checked = this.settings.dynamicBlur;
        document.getElementById('enhanced-display-toggle').checked = this.settings.enhancedDisplay;
        document.getElementById('persistent-wallpaper-toggle').checked = this.settings.persistentWallpaper;
        document.getElementById('wallpaper-scale-toggle').checked = this.settings.wallpaperScale;
        document.getElementById('search-history-toggle').checked = this.settings.searchHistory;
        document.getElementById('hide-info-popup-toggle').checked = this.settings.hideInfoPopup.enabled;
        document.getElementById('quick-access-sidebar-toggle').checked = this.settings.quickAccessSidebar;
        document.getElementById('hide-notifications-toggle').checked = this.settings.hideNotifications;
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

        // 更新设置打开方式
        const badgeOpenMethodValue = this.settings.badgeOpenMethod || 'both';
        console.log('更新设置打开方式UI:', badgeOpenMethodValue);
        const badgeMethodSelect = document.getElementById('badge-open-method-select');
        if (badgeMethodSelect) {
            badgeMethodSelect.value = badgeOpenMethodValue;
            const selectedDisplay = document.getElementById('badge-open-method-selected');
            if (selectedDisplay) {
                const selectedOption = badgeMethodSelect.querySelector(`option[value="${badgeOpenMethodValue}"]`);
                if (selectedOption) {
                    selectedDisplay.textContent = selectedOption.textContent;
                }
            }
        }

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
    }

    // 更新应用按钮颜色 - 始终保持蓝色
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
    }

    closeSettings() {
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
    }

    // 计算铭牌在弹窗内容区中的相对位置，使缩放动画精准指向铭牌
    calculateBadgeOrigin(modal) {
        const badge = document.getElementById('ooo-badge');
        const content = modal.querySelector('.modal-content');
        if (!badge || !content) return;

        const badgeRect = badge.getBoundingClientRect();
        const badgeCenterX = badgeRect.left + badgeRect.width / 2;
        const badgeCenterY = badgeRect.top + badgeRect.height / 2;

        // 临时候获取内容区未变换的尺寸（同在 rAF 内，不会触发重绘）
        const origTransform = content.style.transform;
        content.style.transform = 'none';
        const contentRect = content.getBoundingClientRect();
        content.style.transform = origTransform;

        const originX = ((badgeCenterX - contentRect.left) / contentRect.width) * 100;
        const originY = ((badgeCenterY - contentRect.top) / contentRect.height) * 100;

        content.style.setProperty('--badge-origin-x', Math.max(0, Math.min(100, originX)) + '%');
        content.style.setProperty('--badge-origin-y', Math.max(0, Math.min(100, originY)) + '%');
    }

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

        if (this.settings.developerMode) {
            document.getElementById('font-size-slider').value = this.settings.fontSize;
            document.getElementById('font-size-value').value = this.settings.fontSize.toFixed(1);
            document.getElementById('font-weight-slider').value = this.settings.fontWeight;
            document.getElementById('font-weight-value').value = this.settings.fontWeight;
            document.getElementById('search-box-height').value = this.settings.searchBoxHeight;
            document.getElementById('search-box-height-value').value = this.settings.searchBoxHeight;

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
        } else {
            const showSecondsGroup = document.getElementById('show-seconds-group');
            if (showSecondsGroup) {
                showSecondsGroup.style.display = 'none';
            }
        }

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
    }

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
    }

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
    }

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
    }

    updateProxySelectedText(port) {
        const proxySelected = document.getElementById('proxy-select-selected');
        if (proxySelected) {
            proxySelected.textContent = port ? port.toString() : '不使用代理';
        }
    }

    changeFont(font) {
        this.settings.font = font;
        this.checkThemeConsistency('font', font);
        this.saveSettings();
        // 不立即应用，等待用户点击应用按钮
    }

    changeLogo(logo) {
        this.settings.logo = logo;
        this.settings.logoType = 'image';
        this.userChangedLogo = true;
        this.checkThemeConsistency('logo', logo);
        this.saveSettings();
        this.applyLogo();

        // 移除应用按钮的所有logo类，保持蓝色
        this.updateApplyButtonColor();
    }

    // ========== 配色方案系统 ==========

    // 获取配色方案配置
    getColorConfig() {
        const scheme = this.settings.colorScheme || 'green';
        if (scheme === 'theme-add') {
            // 主题 add 模式：使用主题内联的完整配色配置
            return this.settings.themeColorScheme || getColorConfig('green');
        }
        if (scheme === 'custom') {
            const customItem = this.settings.customColors && this.settings.customColors.length > 0 && this.settings.activeCustomColorIndex >= 0
                ? this.settings.customColors[this.settings.activeCustomColorIndex]
                : null;
            const customColors = customItem ? {
                primaryColor: customItem.primaryColor || '',
                secondaryColor: customItem.secondaryColor || '',
                gradientEnabled: customItem.gradientEnabled || false,
                gradientStart: customItem.gradientStart !== undefined ? customItem.gradientStart : 0,
                gradientEnd: customItem.gradientEnd !== undefined ? customItem.gradientEnd : 100
            } : {
                primaryColor: this.settings.customPrimaryColor || '',
                secondaryColor: this.settings.customSecondaryColor || '',
                gradientEnabled: this.settings.customGradientEnabled || false,
                gradientStart: this.settings.customGradientStart !== undefined ? this.settings.customGradientStart : 0,
                gradientEnd: this.settings.customGradientEnd !== undefined ? this.settings.customGradientEnd : 100
            };
            return getColorConfig('custom', customColors);
        }
        return getColorConfig(scheme);
    }

    // 应用配色方案
    applyColorScheme() {
        const body = document.body;
        const scheme = this.settings.colorScheme || 'green';
        const colorConfig = this.getColorConfig();

        // 移除所有旧的配色方案类
        const colorClasses = ['color-scheme-green', 'color-scheme-blue', 'color-scheme-black-white', 'color-scheme-tianyi-blue', 'color-scheme-vibrant-red', 'color-scheme-classic-gold', 'color-scheme-isolation', 'color-scheme-custom', 'color-scheme-theme-add'];
        body.classList.remove(...colorClasses);
        // 添加新的配色方案类
        body.classList.add('color-scheme-' + scheme);

        if (scheme === 'custom') {
            this.updateCustomSchemeDropdownDots();
        }

        // 设置 CSS 自定义属性，让所有 UI 元素跟随配色方案
        const isDark = this.isDarkMode;
        const accent = isDark ? colorConfig.accentDark : colorConfig.accent;
        const accentRgb = isDark ? colorConfig.accentDarkRgb : colorConfig.accentRgb;
        const gradient = isDark ? (colorConfig.gradientDark || colorConfig.accentDark) : (colorConfig.gradient || colorConfig.accent);
        body.style.setProperty('--primary-color', accent);
        body.style.setProperty('--scheme-accent', accent);
        body.style.setProperty('--scheme-accent-rgb', accentRgb);
        body.style.setProperty('--scheme-gradient', gradient);
        body.style.setProperty('--scheme-accent-hover', colorConfig.accentHover);
        body.style.setProperty('--scheme-accent-active', colorConfig.accentActive);

        // 更新右键菜单配色
        this.updateContextMenuColors();

        // 更新侧边栏图标配色
        this.updateSidebarIconColors();

        // 更新引擎按钮配色类
        this.updateEngineButtonClasses();

        // 重新创建光晕（如果高级视觉效果已激活）
        if (this.isAdvancedEffectsActive) {
            this.createGlowOrbs();
        }
    }

    // 更新下拉列表中自定义配色的颜色圆点
    updateCustomSchemeDropdownDots() {
        // 兼容旧版：更新静态自定义选项的圆点（如果存在）
        const staticDot = document.querySelector('#color-scheme-select-items .color-scheme-item[data-value="custom"] .color-scheme-dot');
        if (staticDot) {
            const primary = this.settings.customPrimaryColor || '';
            const secondary = this.settings.customSecondaryColor || '';
            if (primary) {
                if (secondary) {
                    staticDot.style.background = 'linear-gradient(135deg, ' + primary + ', ' + secondary + ')';
                } else {
                    staticDot.style.background = primary;
                }
            } else {
                staticDot.style.background = 'linear-gradient(135deg, #cccccc, #dddddd)';
            }
        }
    }

    applySettings() {
        this.applyFont();
        this.applyLogo();
        this.applyQuickLinks();
        this.applyWallpaper();
        this.applyDeveloperSettings();
        this.applyContextMenuStyle();

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
    }

    // ========== 主题应用 ==========

    // 应用指定主题：把主题的各项设定写入 settings 并触发外观刷新
    applyTheme(themeKey, opts = {}) {
        const theme = this.themes[themeKey];
        if (!theme || !theme.details) return;
        const d = theme.details;

        // 清空上一主题的残留覆盖，避免不完整主题继承旧属性
        this.themeOverrides = {};

        // 1. Logo
        if (d.logo) {
            this.settings.logo = d.logo.name;
            this.settings.logoType = 'image';
            this.themeOverrides.logo = {
                location: d.logo.location,
                dark: d.logo.specialStyle?.dark || null,
                online: d.logo.specialStyle?.online || null,
                onlineDark: d.logo.specialStyle?.onlineDark || null,
                width: d.logo.specialStyle?.width || null,
                height: d.logo.specialStyle?.height || null
            };
        }

        // 2. 字体
        if (d.font) {
            this.loadThemeFont(d.font);
            this.settings.font = d.font.name;
            this.themeOverrides.font = {
                weight: d.font.specialStyle?.['font-weight'] || null,
                size: d.font.specialStyle?.['font-size'] || null
            };
        }

        // 3. 壁纸
        if (d.wallpaper) {
            this.settings.wallpaper = 'url';
            this.settings.wallpaperUrl = d.wallpaper.location;
            this.settings.wallpaperFill = d.wallpaper.specialStyle?.wallpaperFill === true;
            // 不修改 persistentWallpaper，避免保存到用户设置中
            this.themeOverrides.wallpaper = {
                online: d.wallpaper.specialStyle?.online || null
            };
        }

        // 4. 配色
        if (d.color && d.color.specialStyle) {
            if (d.color.specialStyle.colorGroup === 'cjs') {
                this.settings.colorScheme = d.color.specialStyle.colorScheme;
                this.settings.themeColorScheme = null;
            } else if (d.color.specialStyle.colorGroup === 'add') {
                this.settings.colorScheme = 'theme-add';
                this.settings.themeColorScheme = d.color.specialStyle.colorScheme;
            }
        }

        // 5. more / moreStyle
        if (d.more === true && d.moreStyle) {
            this.applyThemeMoreStyle(d.moreStyle);
        } else {
            this.applyThemeMoreStyle(null);
        }

        // 6. 记录主题状态
        this.settings.theme = themeKey;
        this.settings.themeEnabled = true;

        // 7. 保存与应用
        if (!opts.silent) {
            this.saveSettings();
            this.showNotification('已切换主题：' + theme.info.name);
        }
        this.applySettings();

        // 8. 主题壁纸独立渲染：在 applySettings 之后确保壁纸在主页面显示
        // 不修改 persistentWallpaper，复选框保持用户原有状态
        // 只有 persistentWallpaper 为 true 时才在主页面添加壁纸并显示
        if (d.wallpaper) {
            const wpUrl = this.getWallpaperUrl();
            if (wpUrl) {
                if (this.settings.persistentWallpaper) {
                    this.setWallpaperOnLayers(wpUrl);
                    document.body.style.backgroundImage = 'none';
                    if (!this.isScrolled) {
                        document.body.classList.add('homepage-wallpaper');
                    }
                } else {
                    this.clearWallpaperLayers();
                }
                // 主题壁纸在线优先回退（与 applyWallpaper 中逻辑一致）
                const onlineUrl = this.themeOverrides?.wallpaper?.online;
                if (onlineUrl && wpUrl !== onlineUrl) {
                    const localUrl = wpUrl;
                    const testImg = new Image();
                    testImg.onload = () => {
                        if (this.settings.themeEnabled
                            && (this.settings.persistentWallpaper || document.body.classList.contains('scrolled'))
                            && this.themeOverrides?.wallpaper?.online === onlineUrl
                            && this.settings.wallpaperUrl === localUrl) {
                            this.setWallpaperOnLayers(onlineUrl);
                        }
                    };
                    testImg.src = onlineUrl;
                }
            }
        }

        // 9. 更新顶部下拉显示
        const selectedDisplay = document.getElementById('theme-select-selected');
        if (selectedDisplay) selectedDisplay.textContent = theme.info.name;

        // 10. 更新所有设置选择框的显示文本（主题名：项目名）
        const fontSelected = document.getElementById('font-select-selected');
        if (fontSelected && d.font) {
            fontSelected.textContent = theme.info.name + '：' + d.font.name;
        }
        const wallpaperSelected = document.getElementById('wallpaper-select-selected');
        if (wallpaperSelected && d.wallpaper) {
            wallpaperSelected.textContent = theme.info.name + '：' + d.wallpaper.name;
        }
        const logoSelected = document.getElementById('logo-select-selected');
        if (logoSelected && d.logo) {
            logoSelected.textContent = theme.info.name + '：' + d.logo.name;
        }
        const colorSelected = document.getElementById('color-scheme-select-selected');
        if (colorSelected && d.color) {
            colorSelected.textContent = theme.info.name + '：' + d.color.name;
        }
    }

    // 加载主题字体文件（通过 FontFace API）
    loadThemeFont(fontDef) {
        if (!fontDef || !fontDef.location) return;
        try {
            const fontFace = new FontFace(fontDef.name, `url(${fontDef.location})`);
            fontFace.load().then((loadedFace) => {
                document.fonts.add(loadedFace);
            }).catch((error) => {
                console.warn('主题字体加载失败:', fontDef.name, error);
            });
        } catch (e) {
            console.warn('主题字体 FontFace 创建失败:', e);
        }
    }

    // 注入/清除主题的 moreStyle CSS
    applyThemeMoreStyle(moreStyle) {
        const existing = document.getElementById('theme-more-style');
        if (existing) existing.remove();
        if (!moreStyle || !moreStyle.specialStyle) return;

        const styleEl = document.createElement('style');
        styleEl.id = 'theme-more-style';
        let cssText = '';
        Object.keys(moreStyle.specialStyle).forEach(selector => {
            const rules = moreStyle.specialStyle[selector];
            if (Array.isArray(rules)) {
                cssText += `${selector} { ${rules.join(' ')} }\n`;
            } else if (typeof rules === 'string') {
                cssText += `${selector} { ${rules} }\n`;
            }
        });
        styleEl.textContent = cssText;
        document.head.appendChild(styleEl);
    }

    // 主题 Logo 加载：在线优先，失败回退本地
    loadThemeLogoWithFallback(onlineUrl, localUrl, logoElement) {
        if (!onlineUrl) {
            logoElement.src = localUrl;
            return;
        }
        const testImg = new Image();
        testImg.onload = () => {
            logoElement.src = onlineUrl;
        };
        testImg.onerror = () => {
            logoElement.src = localUrl;
        };
        testImg.src = onlineUrl;
        // 先用本地占位，避免等待
        logoElement.src = localUrl;
    }

    // 一致性检测：用户改动与当前主题不一致时，关闭主题功能
    checkThemeConsistency(settingName, newValue) {
        if (!this.settings.themeEnabled || !this.settings.theme) return;
        const theme = this.themes[this.settings.theme];
        if (!theme || !theme.details) return;
        const d = theme.details;
        let expected;
        switch (settingName) {
            case 'font':
                expected = d.font?.name;
                break;
            case 'logo':
                expected = d.logo?.name;
                break;
            case 'wallpaper':
                // 主题壁纸用 location 标识
                expected = d.wallpaper?.location;
                break;
            case 'colorScheme':
                expected = d.color?.specialStyle?.colorGroup === 'cjs'
                    ? d.color.specialStyle.colorScheme
                    : 'theme-add';
                break;
            default:
                return;
        }
        if (expected === undefined) return;
        // 当主题壁纸就是默认壁纸时，切换到"默认壁纸"选项不算不一致
        if (settingName === 'wallpaper' && newValue === 'default' && expected === this.localBackgroundUrl) {
            return;
        }
        if (newValue !== expected) {
            this.settings.themeEnabled = false;
            this.themeOverrides = null;
            this.applyThemeMoreStyle(null);
            // 移除主题的壁纸显示（homepage-wallpaper 类由 applyTheme 步骤 8 添加）
            document.body.classList.remove('homepage-wallpaper');
            // 重置仍为主题旧值的设置为默认值，但保留用户刚修改的值
            if (d.logo && this.settings.logo === d.logo.name && settingName !== 'logo') {
                this.settings.logo = 'default';
                this.settings.logoType = 'image';
            }
            if (d.font && this.settings.font === d.font.name && settingName !== 'font') {
                this.settings.font = 'Sans Flex';
                this.settings.fontWeight = 400;
                this.settings.fontSize = 1;
                document.body.style.fontFamily = '';
                document.body.style.fontWeight = '';
                document.body.style.fontSize = '';
            }
            // 清理主题专用的配色残留（'theme-add' 在非主题模式下无意义）
            if (this.settings.colorScheme === 'theme-add') {
                this.settings.colorScheme = 'green';
                this.settings.themeColorScheme = null;
            }
            this.saveSettings();
            this.showNotification('主题功能已关闭');
            // 左面板顶部下拉显示"自定义主题"
            const selectedDisplay = document.getElementById('theme-select-selected');
            if (selectedDisplay) selectedDisplay.textContent = '自定义主题';
            // 若右面板正显示主题菜单，刷新高亮
            const rpu = document.getElementById('right-panel-upper');
            if (rpu && rpu.dataset.menuType === 'theme') {
                rpu.querySelectorAll('.settings-menu-option').forEach(opt => opt.classList.remove('selected'));
            }
        }
    }

    // 获取当前活动主题的显示信息（仅限非自定义主题模式）
    getThemeDisplayInfo() {
        if (!this.settings.themeEnabled || !this.settings.theme) return null;
        const theme = this.themes[this.settings.theme];
        if (!theme || !theme.details) return null;
        return {
            themeName: theme.info.name,
            fontName: theme.details.font?.name || null,
            fontLocation: theme.details.font?.location || null,
            wallpaperName: theme.details.wallpaper?.name || null,
            logoName: theme.details.logo?.name || null,
            colorName: theme.details.color?.name || null
        };
    }

    // 预设字体名称到字体文件路径的映射
    static get PRESET_FONT_PATHS() {
        return {
            'Sans Flex': '../fonts/GoogleSansFlex-VariableFont_GRAD,ROND,opsz,slnt,wdth,wght.ttf',
            'Ginto': '../fonts/ABCGintoVariable.ttf',
            'Josefin': '../fonts/JosefinSans.ttf',
            'Code': '../fonts/GoogleSansCode.ttf',
            'HMSC': '../fonts/HarmonyOS_SansSC.ttf'
        };
    }

    // 应用右键菜单样式
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
    }

    // 更新右键菜单配色
    updateContextMenuColors() {
        const contextMenu = document.getElementById('context-menu');
        if (!contextMenu) return;

        const menuItems = document.querySelectorAll('.context-menu-item');
        const colorConfig = this.getColorConfig();
        const isDark = this.isDarkMode;
        const accent = isDark ? colorConfig.accentDark : colorConfig.accent;
        const accentRgb = isDark ? colorConfig.accentDarkRgb : colorConfig.accentRgb;

        let hoverColor, textColor;
        if (this.settings.dynamicBlur) {
            hoverColor = accent;
            textColor = isDark ? colorConfig.contextMenuTextColorDark : colorConfig.contextMenuTextColor;
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
    }

    // ========== 壁纸模糊填充系统 ==========

    createWallpaperLayers() {
        // 创建模糊填充层
        this.wallpaperBlur = document.createElement('div');
        this.wallpaperBlur.id = 'wallpaper-blur';
        document.body.insertBefore(this.wallpaperBlur, document.body.firstChild);

        // 创建清晰主层
        this.wallpaperMain = document.createElement('div');
        this.wallpaperMain.id = 'wallpaper-main';
        document.body.insertBefore(this.wallpaperMain, document.body.firstChild);

        // 标记body，CSS层面覆盖自带的背景图
        document.body.classList.add('wallpaper-layers-ready');

        // 如果没有启用壁纸，隐藏两层
        if (!this.settings.persistentWallpaper && !this.isScrolled) {
            this.wallpaperBlur.classList.remove('active');
            this.wallpaperMain.classList.remove('active');
        }
    }

    // 获取当前壁纸URL
    getWallpaperUrl() {
        if (this.settings.wallpaper === 'default') {
            return this.localBackgroundUrl;
        } else if (this.settings.wallpaper === 'bing' && this.settings.wallpaperUrl) {
            return this.settings.wallpaperUrl;
        } else if (this.settings.wallpaper === 'url' && this.settings.wallpaperUrl) {
            return this.settings.wallpaperUrl;
        } else if (this.settings.wallpaper && this.settings.wallpaper !== 'default' && this.settings.wallpaper !== 'bing' && this.settings.wallpaper !== 'url') {
            return this.settings.wallpaper; // 自定义上传壁纸 data URL
        }
        return null;
    }

    // 更新两层壁纸（统一入口）
    setWallpaperOnLayers(url) {
        if (!url) {
            this.clearWallpaperLayers();
            return;
        }
        if (this.wallpaperBlur) {
            this.wallpaperBlur.style.backgroundImage = `url('${url}')`;
            // 填充模式下模糊层由CSS控制隐藏，适配模式下显示
            this.wallpaperBlur.classList.add('active');
        }
        if (this.wallpaperMain) {
            this.wallpaperMain.style.backgroundImage = `url('${url}')`;
            this.wallpaperMain.classList.add('active');
            // 根据 wallpaperFill 设置填充/适配模式
            this.wallpaperMain.classList.toggle('fill-mode', this.settings.wallpaperFill === true);
        }

        this.updateStatusBarTextContrast();
    }

    // 清除两层壁纸
    clearWallpaperLayers() {
        if (this.wallpaperBlur) {
            this.wallpaperBlur.style.backgroundImage = '';
            this.wallpaperBlur.classList.remove('active');
        }
        if (this.wallpaperMain) {
            this.wallpaperMain.style.backgroundImage = '';
            this.wallpaperMain.classList.remove('active');
            this.wallpaperMain.classList.remove('fill-mode');
            this.wallpaperMain.style.backgroundSize = '';
            this.wallpaperMain.style.backgroundPosition = '';
            this.wallpaperMain.style.transform = '';
            this.wallpaperMain.style.transition = '';
        }

        this.wallpaperAnalysisImage = null;
        this.wallpaperAnalysisUrl = null;
        this.wallpaperAnalysisPromise = null;
        this.updateStatusBarTextContrast();
    }

    // 统一计算壁纸变换（合并壁纸缩放模式和侧边栏推入效果）
    applyWallpaperTransform() {
        const wm = this.wallpaperMain;
        if (!wm || !this.settings.wallpaperScale) return;

        let transform = '';

        // 基础缩放：壁纸模式 scale(1.4)，主页模式不缩放
        if (this.isScrolled) {
            transform = 'scale(1.4)';
        }

        // 侧边栏推入：叠加偏移和额外缩放（仅在主页模式需要补偿）
        if (this._sidebarPushing) {
            if (transform) {
                // 壁纸模式：已有 scale(1.4) 覆盖边缘，只需偏移
                transform += ' translateX(-80px)';
            } else {
                // 主页模式：根据屏幕宽度动态计算缩放和偏移，确保不露黑边
                const vw = window.innerWidth;
                // 大屏固定偏移80px，窄屏按比例缩小偏移
                const pushPx = Math.min(80, vw * 0.1);
                // CSS transform 从右到左执行: scale(S) translateX(T) → 先平移再缩放
                // 缩放原点在中心: 右边缘最终位置 = vw/2 + (vw/2 + T) * S
                // 要求 >= vw → S >= vw / (vw + 2T), T = -pushPx
                const neededScale = vw / (vw - 2 * pushPx);
                // 取整到小数点后3位，加 10% 余量确保无黑边
                const scale = Math.min(Math.max(Math.round(neededScale * 1.10 * 1000) / 1000, 1.16), 1.6);
                transform = 'scale(' + scale + ') translateX(-' + pushPx + 'px)';
            }
        }

        wm.style.transform = transform;
        this.updateStatusBarTextContrast();
    }

    applyDefaultWallpaper() {
        // 使用层系统，body上不设背景图；本地优先，异步升级到在线
        this.setWallpaperOnLayers(this.localBackgroundUrl);
        document.body.style.backgroundImage = 'none';
        const testImg = new Image();
        testImg.onload = () => {
            if (this.settings.persistentWallpaper || document.body.classList.contains('scrolled')) {
                this.setWallpaperOnLayers(this.onlineBackgroundUrl);
            }
        };
        testImg.src = this.onlineBackgroundUrl;
    }

    applyWallpaper() {
        if (this.settings.persistentWallpaper || document.body.classList.contains('scrolled')) {
            const url = this.getWallpaperUrl();
            if (url) {
                this.setWallpaperOnLayers(url);
                // body上不设背景图，避免与CSS类冲突和黑边
                document.body.style.backgroundImage = 'none';

                // 主题壁纸：在线优先，失败回退本地
                const themeOnline = this.settings.themeEnabled && this.themeOverrides?.wallpaper?.online;
                if (themeOnline && url !== themeOnline) {
                    const localUrl = url;
                    const onlineUrl = themeOnline;
                    const testImg = new Image();
                    testImg.onload = () => {
                        // 异步回执时再次确认主题仍开启且仍是同一张壁纸
                        // 同时确认壁纸仍应显示（未在异步期间被关闭）
                        if (this.settings.themeEnabled
                            && (this.settings.persistentWallpaper || document.body.classList.contains('scrolled'))
                            && this.themeOverrides?.wallpaper?.online === onlineUrl
                            && this.settings.wallpaperUrl === localUrl) {
                            this.setWallpaperOnLayers(onlineUrl);
                        }
                    };
                    testImg.src = onlineUrl;
                }

                // 默认壁纸：本地优先，在线升级（同上的异步测试模式）
                if (this.settings.wallpaper === 'default') {
                    const testImg = new Image();
                    testImg.onload = () => {
                        if (this.settings.wallpaper === 'default'
                            && (this.settings.persistentWallpaper || document.body.classList.contains('scrolled'))) {
                            this.setWallpaperOnLayers(this.onlineBackgroundUrl);
                        }
                    };
                    testImg.src = this.onlineBackgroundUrl;
                }
            }
        } else {
            this.clearWallpaperLayers();
            document.body.style.backgroundImage = '';
        }
    }

    // 处理壁纸常显功能的状态切换
    handlePersistentWallpaperToggle() {
        if (this.settings.persistentWallpaper) {
            this.applyWallpaper();
            if (!this.isScrolled) {
                document.body.classList.add('homepage-wallpaper');
            }
        } else {
            document.body.classList.remove('homepage-wallpaper');
            if (!this.isScrolled) {
                this.clearWallpaperLayers();
                document.body.style.backgroundImage = '';
            }
        }
    }

    applyFont() {
        // 移除所有字体类
        const fontClasses = ['font-ginto', 'font-josefin', 'font-code', 'font-hmsc'];
        fontClasses.forEach(fontClass => {
            document.body.classList.remove(fontClass);
        });

        // 移除自定义字体类
        this.settings.customFonts.forEach(font => {
            document.body.classList.remove(`font-${font.name.toLowerCase()}`);
        });

        // 直接设置字体而不是使用CSS类
        if (this.settings.customFonts.some(font => font.name === this.settings.font)) {
            // 对于自定义字体，直接设置font-family
            document.body.style.fontFamily = this.settings.font;
        } else {
            // 对于预定义字体，使用CSS类
            document.body.style.fontFamily = ''; // 重置为默认
            switch (this.settings.font) {
                case 'Ginto':
                    document.body.classList.add('font-ginto');
                    break;
                case 'Josefin':
                    document.body.classList.add('font-josefin');
                    break;
                case 'Code':
                    document.body.classList.add('font-code');
                    break;
                case 'HMSC':
                    document.body.classList.add('font-hmsc');
                    break;
            }
        }
    }

    // 动态图标加载：优先在线，失败回退本地
    loadIconWithFallback(iconName, logoElement) {
        const onlineUrl = this.onlineIcons[iconName];
        const localUrl = `images/${iconName}`;

        if (!onlineUrl) {
            logoElement.src = localUrl;
            return;
        }

        if (this.iconLoadStatus[iconName] === 'online') {
            logoElement.src = onlineUrl;
            return;
        }

        if (this.iconLoadStatus[iconName] === 'local') {
            logoElement.src = localUrl;
            return;
        }

        const testImg = new Image();
        testImg.onload = () => {
            this.iconLoadStatus[iconName] = 'online';
            logoElement.src = onlineUrl;
        };
        testImg.onerror = () => {
            this.iconLoadStatus[iconName] = 'local';
            logoElement.src = localUrl;
        };
        testImg.src = onlineUrl;

        logoElement.src = localUrl;
    }

    applyLogo() {
        const logoElement = document.getElementById('logo');
        const textLogoElement = document.getElementById('text-logo');

        this.updateContextMenuColors();

        if (this.infoManager) {
            this.infoManager.updateInfoIndicatorColor();
        }

        if (this.settings.logo === 'text-logo') {
            // 显示文字Logo
            logoElement.style.display = 'none';
            textLogoElement.style.display = 'block';
            textLogoElement.textContent = this.settings.textLogo;

            // 设置文字Logo字体
            textLogoElement.style.fontFamily = this.getFontFamily();

            // 设置文字Logo颜色（日间黑色，夜间白色）
            textLogoElement.style.color = this.isDarkMode ? '#ffffff' : '#000000';
        } else {
            // 显示图片Logo
            logoElement.style.display = 'block';
            textLogoElement.style.display = 'none';

            // 主题 Logo 覆盖：使用主题定义的 location / dark / online / 尺寸
            if (this.settings.themeEnabled && this.themeOverrides?.logo) {
                const o = this.themeOverrides.logo;
                const isDark = this.isDarkMode;
                if (o.width) logoElement.style.width = o.width;
                else logoElement.style.width = '';
                if (o.height) logoElement.style.height = o.height;
                else logoElement.style.height = '';

                const onlineUrl = isDark ? (o.onlineDark || o.online) : o.online;
                const localUrl = isDark && o.dark ? o.dark : o.location;
                this.loadThemeLogoWithFallback(onlineUrl, localUrl, logoElement);
                logoElement.alt = this.settings.logo;
            } else {
                // 清除主题遗留的尺寸样式
                logoElement.style.width = '';
                logoElement.style.height = '';

                // 根据当前主题选择对应的Logo文件
                const logoMap = {
                    'default': this.isDarkMode ? 'dln.png' : 'dll.png',
                    'Google': this.isDarkMode ? 'gln.png' : 'gll.png',
                    'Microsoft': this.isDarkMode ? 'mln.png' : 'mll.png',
                    'Apple': this.isDarkMode ? 'aln.png' : 'all.png',
                    'HUAWEI': this.isDarkMode ? 'hln.png' : 'hll.png'
                };

                // 自动模式逻辑
                let currentLogo = this.settings.logo;
                if (currentLogo === 'auto') {
                    currentLogo = this.currentEngine === 'google' ? 'Google' : 'Microsoft';
                }

                // 检查是否是自定义Logo
                const customLogo = this.settings.customLogos.find(logo => logo.name === currentLogo);
                if (customLogo) {
                    if (this.isDarkMode && customLogo.darkData) {
                        logoElement.src = customLogo.darkData;
                    } else {
                        logoElement.src = customLogo.data;
                    }
                } else if (logoMap[currentLogo]) {
                    const iconName = logoMap[currentLogo];
                    if (currentLogo === 'default' && this.onlineIcons[iconName]) {
                        this.loadIconWithFallback(iconName, logoElement);
                    } else {
                        logoElement.src = `images/${iconName}`;
                    }
                }
                logoElement.alt = this.settings.logo;
            }
        }

        // 更新搜索引擎按钮类名
        this.updateEngineButtonClasses();

        // 更新侧边栏图标配色
        this.updateSidebarIconColors();
    }

    // 获取字体族
    getFontFamily() {
        if (this.settings.customFonts.some(font => font.name === this.settings.font)) {
            return this.settings.font;
        } else {
            switch (this.settings.font) {
                case 'Ginto': return 'Ginto';
                case 'Josefin': return 'Josefin';
                case 'Code': return 'Code';
                default: return 'Ginto';
            }
        }
    }

    updateEngineButtonClasses() {
        // 移除所有logo类名
        const googleBtn = document.getElementById('google-engine');
        const bingBtn = document.getElementById('bing-engine');

        const logoClasses = ['logo-google', 'logo-microsoft', 'logo-apple', 'logo-huawei', 'logo-custom', 'logo-text'];
        logoClasses.forEach(logoClass => {
            googleBtn.classList.remove(logoClass);
            bingBtn.classList.remove(logoClass);
        });

        // 添加当前logo类名
        let logoClass;
        if (this.settings.logo === 'text-logo') {
            logoClass = 'logo-text';
        } else if (this.settings.customLogos.some(logo => logo.name === this.settings.logo)) {
            logoClass = 'logo-custom';
        } else if (this.settings.logo === 'default') {
            logoClass = 'logo-default';
        } else if (this.settings.logo === 'auto') {
            // 自动模式下使用Google的样式
            logoClass = 'logo-google';
        } else {
            logoClass = `logo-${this.settings.logo.toLowerCase()}`;
        }

        googleBtn.classList.add(logoClass);
        bingBtn.classList.add(logoClass);

        // 确保按钮状态正确
        googleBtn.classList.toggle('active', this.currentEngine === 'google');
        bingBtn.classList.toggle('active', this.currentEngine === 'bing');
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    var storedVersion = localStorage.getItem('welcVersion');
    if (storedVersion && compareVersions(VERSION, storedVersion) > 0) {
        localStorage.removeItem('hasVisited');
        localStorage.removeItem('welcVersion');
        window.location.href = 'welc/welc.html';
        return;
    }
    if (!storedVersion && localStorage.getItem('hasVisited')) {
        localStorage.removeItem('hasVisited');
        window.location.href = 'welc/welc.html';
        return;
    }
    if (!localStorage.getItem('hasVisited')) {
        window.location.href = 'welc/welc.html';
    } else {
        window.oooInterface = new OOOInterface();
    }
});

// 添加错误处理
window.addEventListener('error', (e) => {
    console.error('OOOInterface Error:', e.error);
});

// 添加未处理的Promise拒绝处理
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
});

// 右侧面板设置菜单方法
OOOInterface.prototype.showSettingsMenuInRightPanel = function (items, selected, hiddenSelect, skipAnimation) {
    const self = this;
    const rightPanelUpper = document.getElementById('right-panel-upper');
    if (!rightPanelUpper) return;

    let menuType = '';
    if (selected.id === 'font-select-selected' || selected.parentElement.querySelector('#font-select')) {
        menuType = 'font';
    } else if (selected.id === 'logo-select-selected' || selected.parentElement.querySelector('#logo-select')) {
        menuType = 'logo';
    } else if (selected.id === 'wallpaper-select-selected' || selected.parentElement.querySelector('#wallpaper-select')) {
        menuType = 'wallpaper';
    } else if (selected.id === 'proxy-select-selected' || selected.parentElement.querySelector('#proxy-select')) {
        menuType = 'proxy';
    } else if (selected.id === 'context-menu-style-selected' || selected.parentElement.querySelector('#context-menu-style')) {
        menuType = 'context-menu';
    } else if (selected.id === 'color-scheme-select-selected' || selected.parentElement.querySelector('#color-scheme-select')) {
        menuType = 'color-scheme';
    } else if (selected.id === 'theme-select-selected' || selected.parentElement.querySelector('#theme-select')) {
        menuType = 'theme';
    }

    rightPanelUpper.innerHTML = '';
    delete rightPanelUpper.dataset.subView;
    rightPanelUpper.dataset.menuType = menuType;

    const container = document.createElement('div');
    container.className = 'settings-menu-container' + (skipAnimation ? '' : ' slide-in-right');

    const optionsList = document.createElement('div');
    optionsList.className = 'settings-menu-options';

    // 主题菜单：特殊渲染（名称 + 版本 + 设计师），不走通用 select-item 遍历
    if (menuType === 'theme') {
        const isCustomTheme = (key) => self.settings.customThemes && self.settings.customThemes.some(ct => ct.key === key);

        Object.keys(self.themes).forEach(key => {
            const theme = self.themes[key];
            const option = document.createElement('div');
            option.className = 'settings-menu-option theme-menu-option';
            option.setAttribute('data-value', key);

            const isCustom = isCustomTheme(key);

            if (isCustom) {
                const contentWrapper = document.createElement('div');
                contentWrapper.style.cssText = 'display:flex;align-items:center;justify-content:space-between;width:100%';

                const infoWrapper = document.createElement('div');
                infoWrapper.style.cssText = 'flex:1;min-width:0';

                const nameLine = document.createElement('div');
                nameLine.className = 'theme-option-name';
                nameLine.textContent = theme.info.name;

                const versionSpan = document.createElement('span');
                versionSpan.className = 'theme-option-version';
                versionSpan.textContent = theme.info.version;
                nameLine.appendChild(versionSpan);
                infoWrapper.appendChild(nameLine);

                const designerLine = document.createElement('div');
                designerLine.className = 'theme-option-designer';
                designerLine.textContent = theme.info.designer;
                infoWrapper.appendChild(designerLine);

                contentWrapper.appendChild(infoWrapper);

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'custom-theme-delete-btn';
                deleteBtn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
                deleteBtn.title = '删除此主题';
                contentWrapper.appendChild(deleteBtn);

                option.appendChild(contentWrapper);

                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const idx = self.settings.customThemes.findIndex(ct => ct.key === key);
                    if (idx !== -1) {
                        self.settings.customThemes.splice(idx, 1);
                        delete self.themes[key];
                        self.saveSettings();
                        const updatedItems = document.getElementById('theme-select-items');
                        self.populateThemeSelect();
                        self.showSettingsMenuInRightPanel(updatedItems, selected, hiddenSelect, true);
                    }
                });
            } else {
                const nameLine = document.createElement('div');
                nameLine.className = 'theme-option-name';
                nameLine.textContent = theme.info.name;

                const versionSpan = document.createElement('span');
                versionSpan.className = 'theme-option-version';
                versionSpan.textContent = theme.info.version;
                nameLine.appendChild(versionSpan);

                const designerLine = document.createElement('div');
                designerLine.className = 'theme-option-designer';
                designerLine.textContent = theme.info.designer;

                option.appendChild(nameLine);
                option.appendChild(designerLine);
            }

            // 高亮判定
            if (self.settings.themeEnabled && self.settings.theme === key) {
                option.classList.add('selected');
            }

            option.addEventListener('click', (e) => {
                if (isCustom && e.target.closest('.custom-theme-delete-btn')) return;
                self.applyTheme(key);
                selected.textContent = theme.info.name;
                hiddenSelect.value = key;
                optionsList.querySelectorAll('.settings-menu-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                option.classList.add('selected');
            });

            optionsList.appendChild(option);
        });

        container.appendChild(optionsList);

        // "+" 按钮
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'settings-menu-button-container';
        const plusBtn = document.createElement('button');
        plusBtn.className = 'upload-btn settings-plus-btn';
        plusBtn.textContent = '+';
        plusBtn.title = '导入自定义主题';
        plusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            document.getElementById('theme-upload').click();
        });
        buttonContainer.appendChild(plusBtn);
        container.appendChild(buttonContainer);

        // 拖放导入支持
        let dragCounter = 0;
        const showDropOverlay = () => {
            let overlay = rightPanelUpper.querySelector('.theme-drop-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'theme-drop-overlay';
                overlay.innerHTML = '<div class="theme-drop-overlay-text">释放 .js / .json 文件以导入主题</div>';
                rightPanelUpper.appendChild(overlay);
            }
            overlay.style.display = 'flex';
        };
        const hideDropOverlay = () => {
            const overlay = rightPanelUpper.querySelector('.theme-drop-overlay');
            if (overlay) overlay.style.display = 'none';
        };

        rightPanelUpper.addEventListener('dragenter', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter++;
            if (dragCounter === 1) showDropOverlay();
        });
        rightPanelUpper.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        rightPanelUpper.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter--;
            if (dragCounter <= 0) { dragCounter = 0; hideDropOverlay(); }
        });
        rightPanelUpper.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter = 0;
            hideDropOverlay();
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                if (file.name.endsWith('.js') || file.name.endsWith('.json')) {
                    self.handleThemeUpload(file);
                } else {
                    self.showNotification('请拖放 .js 或 .json 主题文件');
                }
            }
        });

        rightPanelUpper.appendChild(container);
        document.getElementById('settings-modal').classList.add('right-panel-open');
        return;
    }


    let colorSchemeGroup = null;
    let colorSchemeGroupList = null;
    let colorSchemeGroup2 = null;
    let colorSchemeGroupList2 = null;
    let colorSchemeGroup3 = null;
    let colorSchemeGroupList3 = null;
    if (menuType === 'color-scheme') {
        // 经典色组
        colorSchemeGroup = document.createElement('div');
        colorSchemeGroup.className = 'color-scheme-group';

        const groupLabel = document.createElement('div');
        groupLabel.className = 'color-scheme-group-label';
        groupLabel.textContent = '经典色';
        colorSchemeGroup.appendChild(groupLabel);

        colorSchemeGroupList = document.createElement('div');
        colorSchemeGroupList.className = 'color-scheme-group-list';
        colorSchemeGroup.appendChild(colorSchemeGroupList);
        colorSchemeGroup.addEventListener('click', (e) => {
            if (e.target.closest('.color-scheme-group-list')) return;
            colorSchemeGroup.scrollIntoView({ inline: 'center', behavior: 'smooth' });
        });

        // 新星调组
        colorSchemeGroup2 = document.createElement('div');
        colorSchemeGroup2.className = 'color-scheme-group';

        const groupLabel2 = document.createElement('div');
        groupLabel2.className = 'color-scheme-group-label';
        groupLabel2.textContent = '新星调';
        colorSchemeGroup2.appendChild(groupLabel2);

        colorSchemeGroupList2 = document.createElement('div');
        colorSchemeGroupList2.className = 'color-scheme-group-list';
        colorSchemeGroup2.appendChild(colorSchemeGroupList2);
        colorSchemeGroup2.addEventListener('click', (e) => {
            if (e.target.closest('.color-scheme-group-list')) return;
            colorSchemeGroup2.scrollIntoView({ inline: 'center', behavior: 'smooth' });
        });

        // 自定义组（默认隐藏，有自定义配色时显示）
        colorSchemeGroup3 = document.createElement('div');
        colorSchemeGroup3.className = 'color-scheme-group';
        colorSchemeGroup3.style.display = 'none';

        const groupLabel3 = document.createElement('div');
        groupLabel3.className = 'color-scheme-group-label';
        groupLabel3.textContent = '自定义';
        colorSchemeGroup3.appendChild(groupLabel3);

        colorSchemeGroupList3 = document.createElement('div');
        colorSchemeGroupList3.className = 'color-scheme-group-list';
        colorSchemeGroup3.appendChild(colorSchemeGroupList3);
        colorSchemeGroup3.addEventListener('click', (e) => {
            if (e.target.closest('.color-scheme-group-list')) return;
            colorSchemeGroup3.scrollIntoView({ inline: 'center', behavior: 'smooth' });
        });
    }

    const originalItems = items.querySelectorAll('.select-item');
    originalItems.forEach(originalItem => {
        const option = document.createElement('div');
        option.className = 'settings-menu-option';
        option.setAttribute('data-value', originalItem.getAttribute('data-value'));

        // 根据菜单类型处理
        if (menuType === 'logo') {
            // Logo菜单的特殊处理
            const isTextLogoOption = originalItem.getAttribute('data-value') === 'text-logo';

            if (isTextLogoOption) {
                // 创建包含文字和输入框的结构
                const textSpan = document.createElement('span');
                textSpan.textContent = '自定义文字Logo';
                option.appendChild(textSpan);

                // 创建输入框组
                const inputGroup = document.createElement('div');
                inputGroup.className = 'text-logo-inline-group';
                inputGroup.style.display = 'none';

                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'text-logo-inline-input';
                input.placeholder = '输入文字';
                input.id = 'text-logo-input-panel';

                const btn = document.createElement('button');
                btn.className = 'text-logo-inline-btn';
                btn.title = '确定';

                inputGroup.appendChild(input);
                inputGroup.appendChild(btn);
                option.appendChild(inputGroup);

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
                const checkInputLength = () => {
                    const text = input.value;
                    const length = getCharLength(text);
                    if (length > 25) {
                        btn.disabled = true;
                        btn.classList.add('disabled');
                        input.classList.add('error');
                        self.showNotification('超出输入范围');
                        return false;
                    } else {
                        btn.disabled = false;
                        btn.classList.remove('disabled');
                        input.classList.remove('error');
                        return true;
                    }
                };

                // 检查是否是当前选中的值
                if (self.settings.logo === 'text-logo') {
                    option.classList.add('selected');
                    inputGroup.style.display = 'flex';
                    input.value = self.settings.textLogo || '';
                    checkInputLength();
                }

                // 点击选项时显示输入框
                option.addEventListener('click', (e) => {
                    // 如果点击的是输入框或按钮，不处理
                    if (e.target === input || e.target === btn) {
                        return;
                    }

                    // 显示输入框
                    inputGroup.style.display = 'flex';
                    option.classList.add('selected');
                    input.focus();
                });

                // 输入框事件
                input.addEventListener('click', (e) => {
                    e.stopPropagation();
                });

                input.addEventListener('input', () => {
                    checkInputLength();
                });

                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        btn.click();
                    }
                });

                // 确定按钮事件
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (btn.disabled) return;

                    const text = input.value.trim();
                    if (text) {
                        self.settings.logoType = 'text';
                        self.settings.logo = 'text-logo';
                        self.settings.textLogo = text;
                        self.userChangedLogo = true;
                        self.applyLogo();
                        self.saveSettings();
                        self.showNotification('文字Logo设置');

                        selected.textContent = '自定义文字Logo';
                        hiddenSelect.value = 'text-logo';
                        self.closeSettingsMenuInRightPanel();
                    } else {
                        self.showNotification('请输入文本');
                    }
                });
            } else {
                // 检查是否是自定义Logo
                const logoValue = originalItem.getAttribute('data-value');
                const isCustomLogoClass = originalItem.classList.contains('select-item-custom-logo');

                // 预设Logo列表
                const presetLogos = ['default', 'auto', 'Google', 'Microsoft', 'Bing', 'Baidu', 'DuckDuckGo', 'Sogou', '360', 'Yahoo', 'Yandex', 'Apple', 'HUAWEI', 'text-logo'];
                const isPresetLogo = presetLogos.includes(logoValue);

                // 如果是预设Logo，直接显示文本
                if (isPresetLogo && !isCustomLogoClass) {
                    option.textContent = originalItem.textContent;

                    if (self.settings.logo === logoValue) {
                        option.classList.add('selected');
                    }

                    option.addEventListener('click', () => {
                        const value = option.getAttribute('data-value');
                        const text = option.textContent;
                        selected.textContent = text;

                        hiddenSelect.value = value;
                        const event = new Event('change', { bubbles: true });
                        hiddenSelect.dispatchEvent(event);

                        self.closeSettingsMenuInRightPanel();
                    });
                }
                // 如果是自定义Logo（通过类名或不在预设列表中）
                else if (isCustomLogoClass || !isPresetLogo) {
                    // 直接从settings.customLogos中查找
                    const logoName = logoValue || originalItem.textContent.trim();
                    const customLogo = self.settings.customLogos.find(logo => logo.name === logoName);

                    if (customLogo) {
                        // 创建包含Logo名称和上传暗色Logo按钮的结构
                        const contentWrapper = document.createElement('div');
                        contentWrapper.className = 'custom-logo-option-wrapper';

                        const textSpan = document.createElement('span');
                        textSpan.className = 'custom-logo-name';
                        // 显示Logo名称，过长时用省略号
                        const displayName = customLogo.name.length > 10 ? customLogo.name.substring(0, 10) + '...' : customLogo.name;
                        textSpan.textContent = displayName;
                        textSpan.title = customLogo.name;
                        contentWrapper.appendChild(textSpan);

                        // 创建按钮容器
                        const btnContainer = document.createElement('div');
                        btnContainer.className = 'custom-logo-btn-container';

                        // 创建上传暗色Logo按钮
                        const darkLogoBtn = document.createElement('button');
                        darkLogoBtn.className = 'dark-logo-upload-btn-inline';
                        darkLogoBtn.textContent = customLogo.darkData ? '更换暗色' : '上传暗色';
                        darkLogoBtn.title = customLogo.darkData ? '更换暗色Logo' : '上传暗色Logo';
                        btnContainer.appendChild(darkLogoBtn);

                        // 创建删除按钮
                        const deleteBtn = document.createElement('button');
                        deleteBtn.className = 'custom-logo-delete-btn';
                        deleteBtn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
                        deleteBtn.title = '删除此Logo';
                        btnContainer.appendChild(deleteBtn);

                        contentWrapper.appendChild(btnContainer);

                        option.appendChild(contentWrapper);

                        // 检查是否是当前选中的值
                        if (self.settings.logo === customLogo.name) {
                            option.classList.add('selected');
                        }

                        // 点击选项时选中并应用
                        option.addEventListener('click', (e) => {
                            if (e.target === darkLogoBtn || e.target === deleteBtn || e.target.closest('.custom-logo-delete-btn')) {
                                return;
                            }

                            // 移除其他选项的selected类
                            optionsList.querySelectorAll('.settings-menu-option').forEach(opt => {
                                opt.classList.remove('selected');
                            });
                            option.classList.add('selected');

                            // 应用Logo
                            selected.textContent = displayName;
                            hiddenSelect.value = customLogo.name;
                            const event = new Event('change', { bubbles: true });
                            hiddenSelect.dispatchEvent(event);

                            self.closeSettingsMenuInRightPanel();
                        });

                        // 上传暗色Logo按钮点击事件
                        darkLogoBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            // 设置当前正在上传暗色Logo的目标
                            self._currentDarkLogoTarget = customLogo.name;
                            document.getElementById('dark-logo-upload').click();
                        });

                        // 删除按钮点击事件
                        deleteBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            // 找到并删除这个Logo
                            const logoIndex = self.settings.customLogos.findIndex(logo => logo.name === customLogo.name);
                            if (logoIndex !== -1) {
                                self.deleteCustomLogo(logoIndex);
                                // 重新获取更新后的items
                                const updatedItems = document.getElementById('logo-select-items');
                                self.showSettingsMenuInRightPanel(updatedItems, selected, hiddenSelect, true);
                            }
                        });
                    } else {
                        // 如果在customLogos中找不到，可能是DOM残留，跳过
                        return;
                    }
                } else {
                    // 其他情况，显示文本
                    option.textContent = originalItem.textContent;

                    if (self.settings.logo === logoValue) {
                        option.classList.add('selected');
                    }

                    option.addEventListener('click', () => {
                        const value = option.getAttribute('data-value');
                        const text = option.textContent;
                        selected.textContent = text;

                        hiddenSelect.value = value;
                        const event = new Event('change', { bubbles: true });
                        hiddenSelect.dispatchEvent(event);

                        self.closeSettingsMenuInRightPanel();
                    });
                }
            }
        } else if (menuType === 'font') {
            // 字体菜单的处理
            const fontValue = originalItem.getAttribute('data-value');
            const isCustomFontClass = originalItem.classList.contains('select-item-custom-font');

            // 预设字体列表
            const presetFonts = ['Sans Flex', 'HMSC', 'Ginto', 'Josefin', 'Code'];
            const isPresetFont = presetFonts.includes(fontValue);

            // 如果是自定义字体
            if (isCustomFontClass || !isPresetFont) {
                const customFont = self.settings.customFonts.find(font => font.name === fontValue);

                if (customFont) {
                    // 创建包含字体名称和删除按钮的结构
                    const contentWrapper = document.createElement('div');
                    contentWrapper.className = 'custom-font-option-wrapper';

                    const textSpan = document.createElement('span');
                    textSpan.className = 'custom-font-name';
                    // 显示字体名称，过长时用省略号
                    const displayName = customFont.name.length > 15 ? customFont.name.substring(0, 15) + '...' : customFont.name;
                    textSpan.textContent = displayName;
                    textSpan.title = customFont.name;
                    contentWrapper.appendChild(textSpan);

                    // 创建删除按钮
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'custom-font-delete-btn';
                    deleteBtn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
                    deleteBtn.title = '删除此字体';
                    contentWrapper.appendChild(deleteBtn);

                    option.appendChild(contentWrapper);

                    // 检查是否是当前选中的值
                    if (self.settings.font === customFont.name) {
                        // 主题模式下需确认字体名匹配后才高亮
                        const themeInfo = self.getThemeDisplayInfo();
                        if (!themeInfo || themeInfo.fontName === customFont.name) {
                            option.classList.add('selected');
                        }
                    }

                    // 点击选项时选中并应用
                    option.addEventListener('click', (e) => {
                        if (e.target === deleteBtn || e.target.closest('.custom-font-delete-btn')) {
                            return;
                        }

                        // 移除其他选项的selected类
                        optionsList.querySelectorAll('.settings-menu-option').forEach(opt => {
                            opt.classList.remove('selected');
                        });
                        option.classList.add('selected');

                        // 应用字体
                        selected.textContent = displayName;
                        hiddenSelect.value = customFont.name;
                        const event = new Event('change', { bubbles: true });
                        hiddenSelect.dispatchEvent(event);

                        self.closeSettingsMenuInRightPanel();
                    });

                    // 删除按钮点击事件
                    deleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        // 找到并删除这个字体
                        const fontIndex = self.settings.customFonts.findIndex(font => font.name === customFont.name);
                        if (fontIndex !== -1) {
                            self.deleteCustomFont(fontIndex);
                            // 重新获取更新后的items
                            const updatedItems = document.getElementById('font-select-items');
                            self.showSettingsMenuInRightPanel(updatedItems, selected, hiddenSelect, true);
                        }
                    });
                } else {
                    // 如果在customFonts中找不到，可能是DOM残留，跳过
                    return;
                }
            } else {
                // 预设字体，直接显示文本
                option.textContent = originalItem.textContent;

                if (self.settings.font === fontValue) {
                    // 主题模式下：字体名称匹配预设即高亮（路径由 normalizeThemePaths 处理过，不做字符串对比）
                    const themeInfo = self.getThemeDisplayInfo();
                    if (!themeInfo || themeInfo.fontName === fontValue) {
                        option.classList.add('selected');
                    }
                }

                option.addEventListener('click', () => {
                    const value = option.getAttribute('data-value');
                    const text = option.textContent;
                    selected.textContent = text;

                    hiddenSelect.value = value;
                    const event = new Event('change', { bubbles: true });
                    hiddenSelect.dispatchEvent(event);

                    self.closeSettingsMenuInRightPanel();
                });
            }
        } else if (menuType === 'wallpaper') {
            // 壁纸菜单的处理
            const wallpaperValue = originalItem.getAttribute('data-value');
            const isCustomWallpaperClass = originalItem.classList.contains('select-item-custom-wallpaper');

            // 预设壁纸列表
            const presetWallpapers = ['default', 'bing', 'url'];
            const isPresetWallpaper = presetWallpapers.includes(wallpaperValue);

            // 如果是自定义壁纸
            if (isCustomWallpaperClass || !isPresetWallpaper) {
                const customWallpaper = self.settings.customWallpapers.find(wp => wp.name === wallpaperValue);

                if (customWallpaper) {
                    // 创建包含壁纸名称和删除按钮的结构
                    const contentWrapper = document.createElement('div');
                    contentWrapper.className = 'custom-wallpaper-option-wrapper';

                    const textSpan = document.createElement('span');
                    textSpan.className = 'custom-wallpaper-name';
                    // 显示壁纸名称，过长时用省略号
                    const displayName = customWallpaper.name.length > 15 ? customWallpaper.name.substring(0, 15) + '...' : customWallpaper.name;
                    textSpan.textContent = displayName;
                    textSpan.title = customWallpaper.name;
                    contentWrapper.appendChild(textSpan);

                    // 创建删除按钮
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'custom-wallpaper-delete-btn';
                    deleteBtn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
                    deleteBtn.title = '删除此壁纸';
                    contentWrapper.appendChild(deleteBtn);

                    option.appendChild(contentWrapper);

                    // 检查是否是当前选中的值
                    if (self.settings.wallpaper === customWallpaper.data) {
                        option.classList.add('selected');
                    }

                    // 点击选项时选中并应用
                    option.addEventListener('click', (e) => {
                        if (e.target === deleteBtn || e.target.closest('.custom-wallpaper-delete-btn')) {
                            return;
                        }

                        // 移除其他选项的selected类
                        optionsList.querySelectorAll('.settings-menu-option').forEach(opt => {
                            opt.classList.remove('selected');
                        });
                        option.classList.add('selected');

                        // 应用壁纸
                        selected.textContent = displayName;
                        hiddenSelect.value = customWallpaper.name;
                        const event = new Event('change', { bubbles: true });
                        hiddenSelect.dispatchEvent(event);

                        self.closeSettingsMenuInRightPanel();
                    });

                    // 删除按钮点击事件
                    deleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        // 找到并删除这个壁纸
                        const wallpaperIndex = self.settings.customWallpapers.findIndex(wp => wp.name === customWallpaper.name);
                        if (wallpaperIndex !== -1) {
                            self.deleteCustomWallpaper(wallpaperIndex);
                            // 重新获取更新后的items
                            const updatedItems = document.getElementById('wallpaper-select-items');
                            self.showSettingsMenuInRightPanel(updatedItems, selected, hiddenSelect, true);
                        }
                    });
                } else {
                    // 如果在customWallpapers中找不到，可能是DOM残留，跳过
                    return;
                }
            } else {
                // 预设壁纸处理
                if (wallpaperValue === 'bing') {
                    // 必应壁纸特殊处理：显示文本、图标和配置
                    option.style.flexDirection = 'column';
                    option.style.alignItems = 'stretch';
                    option.style.gap = '0';
                    const contentWrapper = document.createElement('div');
                    contentWrapper.className = 'bing-wallpaper-option-wrapper';
                    contentWrapper.style.display = 'flex';
                    contentWrapper.style.alignItems = 'center';
                    contentWrapper.style.justifyContent = 'space-between';

                    const textSpan = document.createElement('span');
                    textSpan.textContent = '必应每日壁纸';
                    contentWrapper.appendChild(textSpan);

                    const infoIcon = document.createElement('span');
                    infoIcon.className = 'material-icons info-icon';
                    infoIcon.textContent = 'info';
                    infoIcon.style.fontSize = '16px';
                    infoIcon.style.color = 'rgba(255, 255, 255, 0.6)';
                    infoIcon.style.cursor = 'pointer';
                    infoIcon.style.marginLeft = '8px';
                    infoIcon.addEventListener('click', (e) => {
                        e.stopPropagation();
                        self.showBingTooltip();
                    });
                    contentWrapper.appendChild(infoIcon);

                    option.appendChild(contentWrapper);

                    // 创建配置区域（参考代理配置样式）
                    const configWrapper = document.createElement('div');
                    configWrapper.className = 'bing-config-wrapper';
                    configWrapper.style.display = 'none';
                    configWrapper.style.marginTop = '8px';
                    configWrapper.style.paddingTop = '8px';
                    configWrapper.style.width = '100%';

                    // 配置行：开关 + 输入框 + 确认按钮
                    const configRow = document.createElement('div');
                    configRow.style.display = 'flex';
                    configRow.style.alignItems = 'center';
                    configRow.style.gap = '8px';
                    configRow.style.width = '100%';

                    // 开关（与页面其他开关样式一致）
                    const switchToggle = document.createElement('label');
                    switchToggle.className = 'switch';
                    switchToggle.style.position = 'relative';
                    switchToggle.style.display = 'inline-block';
                    switchToggle.style.width = '52px';
                    switchToggle.style.height = '28px';
                    switchToggle.style.verticalAlign = 'middle';
                    switchToggle.style.flexShrink = '0';

                    const switchInput = document.createElement('input');
                    switchInput.type = 'checkbox';
                    switchInput.checked = self.settings.bingRefreshEveryTime;
                    switchInput.style.opacity = '0';
                    switchInput.style.width = '0';
                    switchInput.style.height = '0';

                    const switchSlider = document.createElement('span');
                    switchSlider.className = 'slider';
                    switchSlider.style.position = 'absolute';
                    switchSlider.style.cursor = 'pointer';
                    switchSlider.style.top = '0';
                    switchSlider.style.left = '0';
                    switchSlider.style.right = '0';
                    switchSlider.style.bottom = '0';
                    switchSlider.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                    switchSlider.style.transition = 'all 0.2s ease';
                    switchSlider.style.borderRadius = '28px';

                    const sliderKnob = document.createElement('span');
                    sliderKnob.style.position = 'absolute';
                    sliderKnob.style.height = '22px';
                    sliderKnob.style.width = '22px';
                    sliderKnob.style.left = '3px';
                    sliderKnob.style.bottom = '3px';
                    sliderKnob.style.backgroundColor = 'white';
                    sliderKnob.style.transition = 'all 0.2s ease';
                    sliderKnob.style.borderRadius = '50%';
                    sliderKnob.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
                    switchSlider.appendChild(sliderKnob);

                    const updateSwitchState = () => {
                        if (switchInput.checked) {
                            const colorConfig = this.getColorConfig();
                            switchSlider.style.backgroundColor = colorConfig.accent;
                            sliderKnob.style.transform = 'translateX(24px)';
                        } else {
                            switchSlider.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                            sliderKnob.style.transform = 'translateX(0)';
                        }
                    };
                    updateSwitchState();

                    switchToggle.appendChild(switchInput);
                    switchToggle.appendChild(switchSlider);
                    configRow.appendChild(switchToggle);

                    // 输入框
                    const intervalInput = document.createElement('input');
                    intervalInput.type = 'number';
                    intervalInput.className = 'bing-interval-input';
                    intervalInput.placeholder = '刷新间隔(小时)';
                    intervalInput.min = '0.1';
                    intervalInput.max = '9999';
                    intervalInput.step = '0.1';
                    intervalInput.disabled = self.settings.bingRefreshEveryTime;
                    intervalInput.style.flex = '1';
                    intervalInput.style.minWidth = '0';
                    intervalInput.style.padding = '6px 10px';
                    intervalInput.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                    intervalInput.style.borderRadius = '6px';
                    intervalInput.style.background = 'transparent';
                    intervalInput.style.color = 'white';
                    intervalInput.style.fontFamily = 'inherit';
                    intervalInput.style.fontSize = '12px';
                    intervalInput.style.outline = 'none';
                    intervalInput.style.transition = 'border-color 0.2s ease';
                    intervalInput.style.MozAppearance = 'textfield';
                    intervalInput.style.WebkitAppearance = 'none';
                    intervalInput.style.appearance = 'textfield';
                    if (!self.settings.bingRefreshEveryTime && self.settings.bingRefreshInterval > 0) {
                        intervalInput.value = self.settings.bingRefreshInterval;
                    }
                    configRow.appendChild(intervalInput);

                    // 确认按钮
                    const confirmBtn = document.createElement('button');
                    confirmBtn.className = 'bing-interval-confirm-btn';
                    confirmBtn.disabled = self.settings.bingRefreshEveryTime;
                    confirmBtn.style.width = '28px';
                    confirmBtn.style.height = '28px';
                    confirmBtn.style.padding = '0';
                    confirmBtn.style.border = 'none';
                    confirmBtn.style.borderRadius = '6px';
                    confirmBtn.style.background = 'transparent';
                    confirmBtn.style.color = 'white';
                    confirmBtn.style.cursor = 'pointer';
                    confirmBtn.style.transition = 'all 0.2s ease';
                    confirmBtn.style.display = 'flex';
                    confirmBtn.style.alignItems = 'center';
                    confirmBtn.style.justifyContent = 'center';
                    confirmBtn.style.flexShrink = '0';
                    confirmBtn.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'20 6 9 17 4 12\'%3E%3C/polyline%3E%3C/svg%3E")';
                    confirmBtn.style.backgroundRepeat = 'no-repeat';
                    confirmBtn.style.backgroundPosition = 'center';
                    confirmBtn.style.backgroundSize = '16px';
                    configRow.appendChild(confirmBtn);

                    configWrapper.appendChild(configRow);
                    option.appendChild(configWrapper);

                    // 开关事件
                    switchInput.addEventListener('change', (e) => {
                        const isChecked = e.target.checked;
                        self.settings.bingRefreshEveryTime = isChecked;
                        intervalInput.disabled = isChecked;
                        confirmBtn.disabled = isChecked;
                        if (isChecked) {
                            self.settings.bingRefreshInterval = 0;
                            localStorage.removeItem('bingLastRefreshTime');
                            intervalInput.value = '';
                            intervalInput.style.opacity = '0.5';
                        } else {
                            self.settings.bingRefreshInterval = 0;
                            localStorage.removeItem('bingLastRefreshTime');
                            intervalInput.value = '';
                            intervalInput.style.opacity = '1';
                        }
                        self.saveSettings();
                        updateSwitchState();
                    });

                    // 输入框焦点样式
                    intervalInput.addEventListener('focus', () => {
                        intervalInput.style.borderColor = 'white';
                    });

                    intervalInput.addEventListener('blur', () => {
                        intervalInput.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    });

                    // 输入验证
                    intervalInput.addEventListener('input', (e) => {
                        let value = parseFloat(e.target.value);
                        if (value < 0.1) e.target.value = 0.1;
                        if (value > 9999) e.target.value = 9999;
                    });

                    // 确认按钮事件
                    confirmBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const inputValue = intervalInput.value.trim();
                        if (!inputValue) {
                            self.settings.bingRefreshInterval = 0;
                            localStorage.removeItem('bingLastRefreshTime');
                            self.saveSettings();
                            self.showNotification('已设置为不自动刷新');
                            return;
                        }
                        const value = parseFloat(inputValue);
                        if (isNaN(value) || value < 0.1 || value > 9999) {
                            self.showNotification('请输入0.1-9999之间的数字');
                            return;
                        }
                        self.settings.bingRefreshInterval = value;
                        localStorage.setItem('bingLastRefreshTime', Date.now().toString());
                        self.saveSettings();
                        self.showNotification(`必应壁纸刷新间隔已设置为 ${value} 小时`);
                    });

                    // 确认按钮悬停样式
                    confirmBtn.addEventListener('mouseenter', () => {
                        if (!confirmBtn.disabled) {
                            confirmBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                        }
                    });

                    confirmBtn.addEventListener('mouseleave', () => {
                        confirmBtn.style.backgroundColor = 'transparent';
                    });

                    // 检查是否是当前选中的值
                    if (self.settings.wallpaper === 'bing') {
                        // 主题模式下不自动高亮
                        if (!self.getThemeDisplayInfo()) {
                            option.classList.add('selected');
                            configWrapper.style.display = 'block';
                        }
                    }

                    // 点击选项时显示/隐藏配置
                    option.addEventListener('click', (e) => {
                        if (e.target === intervalInput || e.target === confirmBtn || e.target.closest('.switch')) {
                            return;
                        }

                        // 移除其他选项的selected类
                        optionsList.querySelectorAll('.settings-menu-option').forEach(opt => {
                            opt.classList.remove('selected');
                        });
                        option.classList.add('selected');

                        if (configWrapper.style.display === 'none') {
                            configWrapper.style.display = 'block';
                        } else {
                            configWrapper.style.display = 'none';
                        }

                        // 应用必应壁纸
                        selected.textContent = '必应每日壁纸';
                        hiddenSelect.value = 'bing';
                        const event = new Event('change', { bubbles: true });
                        hiddenSelect.dispatchEvent(event);
                    });
                } else if (wallpaperValue === 'url') {
                    // URL壁纸特殊处理：参考必应壁纸样式优化布局
                    option.style.flexDirection = 'column';
                    option.style.alignItems = 'stretch';
                    option.style.gap = '0';

                    const contentWrapper = document.createElement('div');
                    contentWrapper.style.display = 'flex';
                    contentWrapper.style.alignItems = 'center';
                    contentWrapper.style.justifyContent = 'space-between';
                    const textSpan = document.createElement('span');
                    textSpan.textContent = 'URL链接';
                    contentWrapper.appendChild(textSpan);
                    option.appendChild(contentWrapper);

                    // 创建配置区域
                    const configWrapper = document.createElement('div');
                    configWrapper.className = 'url-config-wrapper';
                    configWrapper.style.display = 'none';
                    configWrapper.style.marginTop = '8px';
                    configWrapper.style.paddingTop = '8px';
                    configWrapper.style.width = '100%';

                    const inputRow = document.createElement('div');
                    inputRow.style.display = 'flex';
                    inputRow.style.alignItems = 'center';
                    inputRow.style.gap = '8px';
                    inputRow.style.width = '100%';

                    const urlInput = document.createElement('input');
                    urlInput.type = 'text';
                    urlInput.className = 'setting-input';
                    urlInput.placeholder = '输入壁纸图片URL链接';
                    urlInput.style.flex = '1';
                    urlInput.style.padding = '6px 10px';
                    urlInput.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                    urlInput.style.borderRadius = '6px';
                    urlInput.style.background = 'transparent';
                    urlInput.style.color = 'white';
                    urlInput.style.fontFamily = 'inherit';
                    urlInput.style.fontSize = '12px';
                    urlInput.style.outline = 'none';
                    urlInput.style.transition = 'border-color 0.2s ease';
                    if (self.settings.wallpaperUrl) {
                        urlInput.value = self.settings.wallpaperUrl;
                    }
                    inputRow.appendChild(urlInput);

                    const applyBtn = document.createElement('button');
                    applyBtn.className = 'text-logo-btn';
                    applyBtn.style.width = '28px';
                    applyBtn.style.height = '28px';
                    applyBtn.style.padding = '0';
                    applyBtn.style.border = 'none';
                    applyBtn.style.borderRadius = '6px';
                    applyBtn.style.background = 'transparent';
                    applyBtn.style.cursor = 'pointer';
                    applyBtn.style.transition = 'background 0.2s ease';
                    applyBtn.style.display = 'flex';
                    applyBtn.style.alignItems = 'center';
                    applyBtn.style.justifyContent = 'center';
                    applyBtn.style.flexShrink = '0';
                    applyBtn.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'20 6 9 17 4 12\'%3E%3C/polyline%3E%3C/svg%3E")';
                    applyBtn.style.backgroundRepeat = 'no-repeat';
                    applyBtn.style.backgroundPosition = 'center';
                    applyBtn.style.backgroundSize = '16px';
                    inputRow.appendChild(applyBtn);

                    configWrapper.appendChild(inputRow);
                    option.appendChild(configWrapper);

                    // 应用按钮事件
                    applyBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const url = urlInput.value.trim();
                        if (!url) {
                            self.showNotification('请输入URL');
                            return;
                        }
                        try {
                            new URL(url);
                        } catch (err) {
                            self.showNotification('URL格式错误');
                            return;
                        }

                        self.settings.wallpaper = 'url';
                        self.settings.wallpaperUrl = url;
                        self.applySettings();
                        self.saveSettings();
                        self.showNotification('URL壁纸已应用');
                        self.closeSettingsMenuInRightPanel();
                    });

                    // 输入框焦点样式
                    urlInput.addEventListener('focus', () => {
                        urlInput.style.borderColor = 'white';
                    });
                    urlInput.addEventListener('blur', () => {
                        urlInput.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    });

                    // 确认按钮悬停样式
                    applyBtn.addEventListener('mouseenter', () => {
                        applyBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                    });
                    applyBtn.addEventListener('mouseleave', () => {
                        applyBtn.style.backgroundColor = 'transparent';
                    });

                    // 输入框回车事件
                    urlInput.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            applyBtn.click();
                        }
                    });

                    // 检查是否是当前选中的值
                    if (self.settings.wallpaper === 'url') {
                        // 主题模式下不自动高亮
                        if (!self.getThemeDisplayInfo()) {
                            option.classList.add('selected');
                            configWrapper.style.display = 'block';
                        }
                    }

                    // 点击选项时显示/隐藏配置
                    option.addEventListener('click', (e) => {
                        if (e.target === urlInput || e.target === applyBtn) {
                            return;
                        }

                        // 移除其他选项的selected类
                        optionsList.querySelectorAll('.settings-menu-option').forEach(opt => {
                            opt.classList.remove('selected');
                        });
                        option.classList.add('selected');

                        if (configWrapper.style.display === 'none') {
                            configWrapper.style.display = 'block';
                            urlInput.focus();
                        } else {
                            configWrapper.style.display = 'none';
                        }
                    });
                } else {
                    // 默认壁纸
                    option.textContent = originalItem.textContent;

                    // 检查是否是当前选中的值
                    if (self.settings.wallpaper === 'default' && wallpaperValue === 'default') {
                        // 主题模式下不自动高亮
                        if (!self.getThemeDisplayInfo()) {
                            option.classList.add('selected');
                        }
                    }

                    option.addEventListener('click', () => {
                        const value = option.getAttribute('data-value');
                        const text = option.textContent;
                        selected.textContent = text;

                        hiddenSelect.value = value;
                        const event = new Event('change', { bubbles: true });
                        hiddenSelect.dispatchEvent(event);

                        self.closeSettingsMenuInRightPanel();
                    });
                }
            }
        } else if (menuType === 'proxy') {
            const isCustomProxy = originalItem.getAttribute('data-value') === 'custom';

            if (isCustomProxy) {
                option.textContent = '自定义端口';

                const inputWrapper = document.createElement('div');
                inputWrapper.className = 'proxy-custom-input-wrapper';
                inputWrapper.style.display = 'none';

                const portInput = document.createElement('input');
                portInput.type = 'number';
                portInput.className = 'proxy-custom-port-input';
                portInput.placeholder = '输入端口号...';
                portInput.min = 1;
                portInput.max = 65535;

                const confirmProxyBtn = document.createElement('button');
                confirmProxyBtn.className = 'proxy-custom-confirm-btn';
                confirmProxyBtn.setAttribute('aria-label', '确认代理端口');
                confirmProxyBtn.setAttribute('data-action', 'confirm-proxy');

                inputWrapper.appendChild(portInput);
                inputWrapper.appendChild(confirmProxyBtn);
                option.appendChild(inputWrapper);

                confirmProxyBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const portValue = portInput.value.trim();
                    if (portValue && !isNaN(portValue) && parseInt(portValue, 10) >= 1 && parseInt(portValue, 10) <= 65535) {
                        const port = parseInt(portValue, 10);
                        self.settings.proxyPort = port;
                        ProxyManager.setProxy(port);
                        self.saveSettings();
                        self.updateProxySelectedText(port);
                        hiddenSelect.value = 'custom';
                        self.showNotification('代理端口已设置为 ' + port);
                        self.closeSettingsMenuInRightPanel();
                    } else {
                        self.showNotification('请输入有效的端口号 (1-65535)');
                    }
                });

                option.addEventListener('click', (e) => {
                    if (e.target.closest('.proxy-custom-confirm-btn') || e.target === portInput) {
                        return;
                    }
                    if (inputWrapper.style.display === 'none' || inputWrapper.style.display === '') {
                        inputWrapper.style.display = 'block';
                    } else {
                        inputWrapper.style.display = 'none';
                    }
                });
            } else {
                option.textContent = originalItem.textContent;

                const currentProxyPort = ProxyManager.getProxyPort();
                const itemValue = originalItem.getAttribute('data-value');

                if (itemValue && parseInt(itemValue) === currentProxyPort) {
                    option.classList.add('selected');
                }

                option.addEventListener('click', () => {
                    const value = option.getAttribute('data-value');
                    let text = '';
                    let portNum = null;

                    if (value === '') {
                        text = '不使用代理';
                        portNum = null;
                    } else {
                        portNum = parseInt(value, 10);
                        text = option.textContent.replace(/\s*\(.*?\)\s*/, '').trim();
                    }

                    selected.textContent = text;
                    hiddenSelect.value = value;
                    const event = new Event('change', { bubbles: true });
                    hiddenSelect.dispatchEvent(event);

                    self.settings.proxyPort = portNum;
                    ProxyManager.setProxy(portNum);
                    self.saveSettings();
                    self.showNotification(portNum ? '代理端口已设置为 ' + portNum : '代理已关闭');

                    self.closeSettingsMenuInRightPanel();
                });
            }
        } else if (menuType === 'context-menu') {
            // 右键菜单样式选项
            option.textContent = originalItem.textContent;

            const currentValue = originalItem.getAttribute('data-value');
            if (hiddenSelect.value === currentValue) {
                option.classList.add('selected');
            }

            option.addEventListener('click', () => {
                const value = option.getAttribute('data-value');
                const text = option.textContent;
                selected.textContent = text;
                hiddenSelect.value = value;

                // 更新选中态
                optionsList.querySelectorAll('.settings-menu-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                option.classList.add('selected');

                self.settings.contextMenuStyle = value;

                // 实时切换设置图标显隐（需 important 覆盖 CSS）
                const btn = rightPanelUpper.querySelector('.upload-btn.settings-plus-btn');
                if (btn) {
                    if (value === 'minimal') {
                        btn.style.setProperty('display', 'none', 'important');
                    } else {
                        btn.style.removeProperty('display');
                    }
                }

                // 立即应用到右键菜单（添加/移除 compact/minimal 类）
                self.applyContextMenuStyle();

                self.closeSettingsMenuInRightPanel();
            });
        } else if (menuType === 'color-scheme') {
            const dot = originalItem.querySelector('.color-scheme-dot');
            if (dot) {
                const dotClone = dot.cloneNode(true);
                dotClone.classList.add('selected-dot');
                option.appendChild(dotClone);
            }
            const textSpan = document.createElement('span');
            textSpan.textContent = COLOR_SCHEME_NAMES[originalItem.getAttribute('data-value')] || originalItem.textContent;
            option.appendChild(textSpan);

            const currentValue = originalItem.getAttribute('data-value');
            if (hiddenSelect.value === currentValue) {
                // 主题模式下若配色为 add 组（自定义配色方案），不高亮任何选项
                const themeInfo = self.getThemeDisplayInfo();
                const isAddGroup = themeInfo && self.themes[self.settings.theme]?.details?.color?.specialStyle?.colorGroup === 'add';
                if (!isAddGroup) {
                    option.classList.add('selected');
                }
            }

            option.addEventListener('click', () => {
                const value = option.getAttribute('data-value');
                const text = textSpan.textContent;

                // 自定义配色
                if (value === 'custom') {
                    const hasColor = self.settings.customPrimaryColor && self.settings.customPrimaryColor.trim();
                    if (hasColor) {
                        self.settings.colorScheme = 'custom';
                        self.saveSettings();
                        self.applyColorScheme();
                        optionsList.querySelectorAll('.settings-menu-option').forEach(opt => {
                            opt.classList.remove('selected');
                        });
                        option.classList.add('selected');
                        selected.textContent = text;
                        hiddenSelect.value = value;
                        const event = new Event('change', { bubbles: true });
                        hiddenSelect.dispatchEvent(event);
                    }
                    self.showCustomColorEditorInPanel(rightPanelUpper, selected, hiddenSelect, text, optionsList);
                    return;
                }

                optionsList.querySelectorAll('.settings-menu-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                option.classList.add('selected');

                selected.textContent = text;

                hiddenSelect.value = value;
                const event = new Event('change', { bubbles: true });
                hiddenSelect.dispatchEvent(event);

                self.closeSettingsMenuInRightPanel();
            });
        } else {
            // 其他菜单的通用处理
            option.textContent = originalItem.textContent;

            // 检查是否是当前选中的值
            const currentValue = originalItem.getAttribute('data-value');
            if (hiddenSelect.value === currentValue) {
                option.classList.add('selected');
            }

            option.addEventListener('click', () => {
                const value = option.getAttribute('data-value');
                const text = option.textContent;
                selected.textContent = text;

                hiddenSelect.value = value;
                const event = new Event('change', { bubbles: true });
                hiddenSelect.dispatchEvent(event);

                self.closeSettingsMenuInRightPanel();
            });
        }

        const itemGroup = originalItem.getAttribute('data-group');
        if (itemGroup === 'classic' && colorSchemeGroupList) {
            colorSchemeGroupList.appendChild(option);
        } else if (itemGroup === 'newstar' && colorSchemeGroupList2) {
            colorSchemeGroupList2.appendChild(option);
        } else if (itemGroup === 'custom' && colorSchemeGroupList3) {
            colorSchemeGroupList3.appendChild(option);
        } else if (colorSchemeGroupList) {
            colorSchemeGroupList.appendChild(option);
        } else {
            optionsList.appendChild(option);
        }
    });

    // 渲染自定义配色方案选项
    function renderCustomOptions() {
        if (!colorSchemeGroupList3) return;
        colorSchemeGroupList3.innerHTML = '';
        const customColors = self.settings.customColors || [];
        customColors.forEach((cc, idx) => {
            const opt = document.createElement('div');
            opt.className = 'settings-menu-option';
            opt.setAttribute('data-value', 'custom');
            opt.setAttribute('data-custom-index', idx);

            const dot = document.createElement('span');
            dot.className = 'color-scheme-dot';
            const p = cc.primaryColor || '#cccccc';
            const s = cc.secondaryColor && cc.secondaryColor.trim() ? cc.secondaryColor : p;
            if (cc.gradientEnabled && cc.secondaryColor && cc.secondaryColor.trim()) {
                dot.style.background = 'linear-gradient(135deg, ' + p + ', ' + s + ')';
            } else {
                dot.style.background = p;
            }
            opt.appendChild(dot);

            const nameSpan = document.createElement('span');
            nameSpan.textContent = cc.name || '未命名';
            nameSpan.style.flex = '1';
            opt.appendChild(nameSpan);

            // 删除按钮
            const delBtn = document.createElement('button');
            delBtn.className = 'custom-color-delete-btn';
            delBtn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
            delBtn.title = '删除此配色';
            delBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const arr = self.settings.customColors || [];
                const delIdx = parseInt(idx, 10);
                if (isNaN(delIdx) || delIdx < 0 || delIdx >= arr.length) return;
                arr.splice(delIdx, 1);
                self.settings.customColors = arr;
                // 如果删除的是当前激活的方案，重置为默认
                if (self.settings.colorScheme === 'custom' && self.settings.activeCustomColorIndex === delIdx) {
                    self.settings.activeCustomColorIndex = -1;
                    self.settings.colorScheme = 'green';
                } else if (self.settings.colorScheme === 'custom' && self.settings.activeCustomColorIndex > delIdx) {
                    self.settings.activeCustomColorIndex -= 1;
                }
                self.saveSettings();
                self.applyColorScheme();
                renderCustomOptions();
            });
            opt.appendChild(delBtn);

            if (self.settings.colorScheme === 'custom' && self.settings.activeCustomColorIndex === idx) {
                opt.classList.add('selected');
            }

            colorSchemeGroupList3.appendChild(opt);
        });
        if (customColors.length > 0) {
            colorSchemeGroup3.style.display = '';
        } else {
            colorSchemeGroup3.style.display = 'none';
        }
    }

    renderCustomOptions();

    // 自定义配色选项点击事件（事件委托，只需绑定一次）
    if (menuType === 'color-scheme' && colorSchemeGroupList3 && !colorSchemeGroupList3._clickBound) {
        colorSchemeGroupList3._clickBound = true;
        colorSchemeGroupList3.addEventListener('click', (e) => {
            const opt = e.target.closest('.settings-menu-option');
            if (!opt) return;
            const idx = parseInt(opt.getAttribute('data-custom-index'), 10);
            if (isNaN(idx) || idx < 0) return;
            const cc = (self.settings.customColors || [])[idx];
            if (!cc) return;

            self.settings.colorScheme = 'custom';
            self.settings.activeCustomColorIndex = idx;
            self.saveSettings();
            self.applyColorScheme();
            self.closeSettingsMenuInRightPanel();
        });
    }

    if (colorSchemeGroup) {
        optionsList.appendChild(colorSchemeGroup);
    }
    if (colorSchemeGroup2) {
        optionsList.appendChild(colorSchemeGroup2);
    }
    if (colorSchemeGroup3) {
        optionsList.appendChild(colorSchemeGroup3);
    }
    // 选中经典色时居中经典色组
    const classicSchemes = ['green', 'blue', 'black-white'];
    if (colorSchemeGroup && classicSchemes.includes(self.settings.colorScheme)) {
        requestAnimationFrame(() => {
            colorSchemeGroup.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
        });
    }
    // 选中新星调时居中新星调组
    const newSchemes = ['tianyi-blue', 'vibrant-red', 'classic-gold', 'isolation'];
    if (colorSchemeGroup2 && newSchemes.includes(self.settings.colorScheme)) {
        requestAnimationFrame(() => {
            colorSchemeGroup2.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
        });
    }
    // 选中自定义时居中自定义组
    if (colorSchemeGroup3 && self.settings.colorScheme === 'custom') {
        requestAnimationFrame(() => {
            colorSchemeGroup3.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
        });
    }

    container.appendChild(optionsList);

    if (menuType === 'color-scheme') {
        let isDragging = false;
        let dragStarted = false;
        let startX = 0;
        let scrollLeft = 0;
        const onMouseMove = (e) => {
            if (!isDragging) return;
            const dx = e.pageX - startX;
            if (Math.abs(dx) > 5) {
                if (!dragStarted) {
                    dragStarted = true;
                }
                e.preventDefault();
                optionsList.scrollLeft = scrollLeft - dx;
            }
        };
        const onMouseUp = () => {
            if (isDragging) {
                isDragging = false;
                optionsList.classList.remove('dragging');
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                if (dragStarted) {
                    optionsList.dataset.dragJustHappened = 'true';
                    setTimeout(() => { delete optionsList.dataset.dragJustHappened; }, 200);
                }
                dragStarted = false;
            }
        };
        optionsList.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragStarted = false;
            startX = e.pageX;
            scrollLeft = optionsList.scrollLeft;
            optionsList.classList.add('dragging');
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'settings-menu-button-container';

    if (menuType === 'font' || menuType === 'logo' || menuType === 'wallpaper') {
        const plusBtn = document.createElement('button');
        plusBtn.className = 'upload-btn settings-plus-btn';
        plusBtn.textContent = '+';
        plusBtn.title = `上传自定义${menuType === 'font' ? '字体' : menuType === 'logo' ? 'Logo' : '壁纸'}`;

        plusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();

            if (menuType === 'font') {
                document.getElementById('font-upload').click();
            } else if (menuType === 'logo') {
                document.getElementById('logo-upload').click();
            } else if (menuType === 'wallpaper') {
                self.showWallpaperImportSelector(plusBtn);
            }
        });

        buttonContainer.appendChild(plusBtn);

        // 壁纸菜单：在加号旁边添加填满全屏开关
        if (menuType === 'wallpaper') {
            const fillWrapper = document.createElement('div');
            fillWrapper.className = 'wallpaper-fill-toggle-wrapper';
            fillWrapper.title = '壁纸填满全屏（关闭则显示完整画面，空隙用模糊填充）';

            const fillLabel = document.createElement('label');
            fillLabel.className = 'wallpaper-fill-toggle-label';

            const fillSpan = document.createElement('span');
            fillSpan.className = 'wallpaper-fill-toggle-text';
            fillSpan.textContent = '填满';

            const fillSwitch = document.createElement('label');
            fillSwitch.className = 'switch wallpaper-fill-switch';

            const fillInput = document.createElement('input');
            fillInput.type = 'checkbox';
            fillInput.id = 'wallpaper-fill-toggle-panel';
            fillInput.checked = self.settings.wallpaperFill;

            const fillSlider = document.createElement('span');
            fillSlider.className = 'slider';

            fillSwitch.appendChild(fillInput);
            fillSwitch.appendChild(fillSlider);
            fillLabel.appendChild(fillSpan);
            fillLabel.appendChild(fillSwitch);
            fillWrapper.appendChild(fillLabel);

            buttonContainer.insertBefore(fillWrapper, plusBtn);
        }

        // 一键清除按钮（超过5个自定义壁纸时显示）
        if (menuType === 'wallpaper' && self.settings.customWallpapers.length > 5) {
            const clearAllBtn = document.createElement('button');
            clearAllBtn.className = 'quick-link-clear-all-btn';
            clearAllBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> ';
            clearAllBtn.title = '删除所有自定义壁纸';
            clearAllBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                self.settings.customWallpapers = [];
                self.settings.wallpaperSeries = [];
                self.settings.wallpaper = 'default';
                self.saveSettings();
                self.updateCustomWallpapersList();
                self.applySettings();
                const selected = document.getElementById('wallpaper-select-selected');
                const hiddenSelect = document.getElementById('wallpaper-select');
                const items = document.getElementById('wallpaper-select-items');
                self.showSettingsMenuInRightPanel(items, selected, hiddenSelect);
                self.showNotification('已清除所有自定义壁纸');
            });
            optionsList.appendChild(clearAllBtn);
        }
    } else if (menuType === 'color-scheme') {
        const plusBtn = document.createElement('button');
        plusBtn.className = 'upload-btn settings-plus-btn';
        plusBtn.textContent = '+';
        plusBtn.title = '添加自定义配色';
        plusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            self.showCustomColorEditorInPanel(rightPanelUpper, selected, hiddenSelect, selected.textContent, optionsList);
        });
        buttonContainer.appendChild(plusBtn);
    }

    // 字体 / Logo / 壁纸菜单：拖放导入
    // 先清理旧拖拽监听器，避免残留影响其他菜单
    if (rightPanelUpper._dragCleanup) {
        if (rightPanelUpper._dragenter) rightPanelUpper.removeEventListener('dragenter', rightPanelUpper._dragenter);
        if (rightPanelUpper._dragover) rightPanelUpper.removeEventListener('dragover', rightPanelUpper._dragover);
        if (rightPanelUpper._dragleave) rightPanelUpper.removeEventListener('dragleave', rightPanelUpper._dragleave);
        if (rightPanelUpper._drop) rightPanelUpper.removeEventListener('drop', rightPanelUpper._drop);
        rightPanelUpper._dragCleanup = false;
    }
    if (menuType === 'font' || menuType === 'logo' || menuType === 'wallpaper') {
        let dragCounter = 0;
        const showOverlay = () => {
            let overlay = rightPanelUpper.querySelector('.theme-drop-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'theme-drop-overlay';
                overlay.innerHTML = '<div class="theme-drop-overlay-text">释放文件以导入</div>';
                rightPanelUpper.appendChild(overlay);
            }
            overlay.style.display = 'flex';
        };
        const hideOverlay = () => {
            const overlay = rightPanelUpper.querySelector('.theme-drop-overlay');
            if (overlay) overlay.style.display = 'none';
        };
        rightPanelUpper._dragenter = (e) => { e.preventDefault(); e.stopPropagation(); dragCounter++; if (dragCounter === 1) showOverlay(); };
        rightPanelUpper._dragover = (e) => { e.preventDefault(); e.stopPropagation(); };
        rightPanelUpper._dragleave = (e) => { e.preventDefault(); e.stopPropagation(); dragCounter--; if (dragCounter <= 0) { dragCounter = 0; hideOverlay(); } };
        rightPanelUpper._drop = (e) => {
            e.preventDefault(); e.stopPropagation();
            dragCounter = 0; hideOverlay();
            const file = e.dataTransfer.files[0];
            if (!file) return;
            if (menuType === 'font' && (file.name.endsWith('.ttf') || file.name.endsWith('.otf'))) {
                self.handleFontUpload(file);
            } else if (menuType === 'logo' && file.type.startsWith('image/')) {
                self.handleLogoUpload(file);
            } else if (menuType === 'wallpaper' && file.type.startsWith('image/')) {
                self.handleWallpaperUpload(file);
            } else {
                self.showNotification(`不支持的${menuType === 'font' ? '字体' : menuType === 'logo' ? 'Logo' : '壁纸'}文件格式`);
            }
        };
        rightPanelUpper.addEventListener('dragenter', rightPanelUpper._dragenter);
        rightPanelUpper.addEventListener('dragover', rightPanelUpper._dragover);
        rightPanelUpper.addEventListener('dragleave', rightPanelUpper._dragleave);
        rightPanelUpper.addEventListener('drop', rightPanelUpper._drop);
        rightPanelUpper._dragCleanup = true;
    }

    if (menuType === 'context-menu') {
        const customizeBtn = document.createElement('button');
        customizeBtn.className = 'upload-btn settings-plus-btn';
        customizeBtn.innerHTML = '<span class="material-icons md3-icon" style="font-size:18px;display:flex;">settings</span>';
        customizeBtn.title = '自定义菜单项';
        if (self.settings.contextMenuStyle === 'minimal') {
            customizeBtn.style.setProperty('display', 'none', 'important');
        }

        customizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            self.renderContextMenuCustomizeView(rightPanelUpper);
        });

        buttonContainer.appendChild(customizeBtn);
    }

    container.appendChild(buttonContainer);
    rightPanelUpper.appendChild(container);
    document.getElementById('settings-modal').classList.add('right-panel-open');
};

OOOInterface.prototype.backToContextMenuStyleView = function (rightPanelUpper) {
    this._doBackToContextMenuStyleView(rightPanelUpper);
};

OOOInterface.prototype._doBackToContextMenuStyleView = function (rightPanelUpper) {
    delete rightPanelUpper.dataset.customizeEntered;
    const items = document.getElementById('context-menu-style-items');
    if (!items) return;
    const selected = document.getElementById('context-menu-style-selected');
    const hiddenSelect = document.getElementById('context-menu-style');
    if (!selected || !hiddenSelect) return;
    this.showSettingsMenuInRightPanel(items, selected, hiddenSelect, true);
};

OOOInterface.prototype.renderContextMenuCustomizeView = function (rightPanelUpper) {
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
        { key: 'wallpaper-toggle', label: '壁纸常显示' },
        { key: 'enhanced-display-toggle', label: '高级视觉效果' },
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
};

OOOInterface.prototype.showCustomColorEditorInPanel = function (rightPanelUpper, selected, hiddenSelect, text, optionsList) {
    const self = this;

    rightPanelUpper.innerHTML = '';
    rightPanelUpper.dataset.subView = 'custom-color-editor';

    const container = document.createElement('div');
    container.className = 'settings-menu-container slide-in-right';

    // 名称输入框
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = '自定义配色';
    nameInput.maxLength = 20;
    nameInput.value = '';
    nameInput.style.cssText = 'width:100%;padding:8px 10px;border:1px solid var(--border-color);border-radius:12px;font-size:13px;color:var(--text-color);background:transparent;margin-bottom:16px;box-sizing:border-box;';
    container.appendChild(nameInput);

    const updatePreview = (hexInput, previewEl) => {
        let val = hexInput.value.trim();
        if (val.startsWith('#')) val = val.substring(1);
        if (/^[0-9a-f]{6}$/i.test(val)) {
            previewEl.style.background = '#' + val;
        } else if (!val) {
            previewEl.style.background = 'transparent';
        }
    };

    // 临时保存编辑中的颜色值
    const editData = {
        primaryColor: '',
        secondaryColor: '',
        gradientEnabled: false,
        gradientStart: 0,
        gradientEnd: 100
    };

    // 主色
    const primaryRow = document.createElement('div');
    primaryRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;';
    const primaryLabel = document.createElement('span');
    primaryLabel.style.cssText = 'font-size:13px;color:var(--text-color);font-weight:500;';
    primaryLabel.textContent = '主色';
    primaryRow.appendChild(primaryLabel);
    const primaryWrapper = document.createElement('div');
    primaryWrapper.style.cssText = 'display:flex;align-items:center;gap:8px;';
    const primaryPreview = document.createElement('span');
    primaryPreview.style.cssText = 'width:24px;height:24px;border-radius:50%;border:1px solid var(--border-color);flex-shrink:0;background:transparent;';
    primaryWrapper.appendChild(primaryPreview);
    const primaryHex = document.createElement('input');
    primaryHex.type = 'text';
    primaryHex.value = '';
    primaryHex.placeholder = '#RRGGBB';
    primaryHex.maxLength = 7;
    primaryHex.spellcheck = false;
    primaryHex.style.cssText = 'width:90px;padding:8px 10px;border:1px solid var(--border-color);border-radius:12px;font-size:13px;font-family:\'SF Mono\',\'Cascadia Code\',Consolas,monospace;color:var(--text-color);background:transparent;text-transform:uppercase;letter-spacing:0.3px;';
    primaryWrapper.appendChild(primaryHex);
    primaryRow.appendChild(primaryWrapper);
    container.appendChild(primaryRow);

    // 副色
    const secondaryRow = document.createElement('div');
    secondaryRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;';
    const secondaryLabel = document.createElement('span');
    secondaryLabel.style.cssText = 'font-size:13px;color:var(--text-color);font-weight:500;';
    secondaryLabel.textContent = '副色（可选）';
    secondaryRow.appendChild(secondaryLabel);
    const secondaryWrapper = document.createElement('div');
    secondaryWrapper.style.cssText = 'display:flex;align-items:center;gap:8px;';
    const secondaryPreview = document.createElement('span');
    secondaryPreview.style.cssText = 'width:24px;height:24px;border-radius:50%;border:1px solid var(--border-color);flex-shrink:0;background:transparent;';
    secondaryWrapper.appendChild(secondaryPreview);
    const secondaryHex = document.createElement('input');
    secondaryHex.type = 'text';
    secondaryHex.value = '';
    secondaryHex.placeholder = '#RRGGBB';
    secondaryHex.maxLength = 7;
    secondaryHex.spellcheck = false;
    secondaryHex.style.cssText = 'width:90px;padding:8px 10px;border:1px solid var(--border-color);border-radius:12px;font-size:13px;font-family:\'SF Mono\',\'Cascadia Code\',Consolas,monospace;color:var(--text-color);background:transparent;text-transform:uppercase;letter-spacing:0.3px;';
    secondaryWrapper.appendChild(secondaryHex);
    secondaryRow.appendChild(secondaryWrapper);
    container.appendChild(secondaryRow);

    // 渐变开关
    const gradientRow = document.createElement('div');
    gradientRow.style.cssText = 'display:none;align-items:center;justify-content:space-between;margin-bottom:12px;';
    const gradientLabel = document.createElement('span');
    gradientLabel.style.cssText = 'font-size:13px;color:var(--text-color);font-weight:500;';
    gradientLabel.textContent = '渐变开关';
    gradientRow.appendChild(gradientLabel);
    const gradientSwitch = document.createElement('label');
    gradientSwitch.className = 'switch';
    const gradientCheckbox = document.createElement('input');
    gradientCheckbox.type = 'checkbox';
    gradientCheckbox.checked = false;
    const gradientSlider = document.createElement('span');
    gradientSlider.className = 'slider';
    gradientSwitch.appendChild(gradientCheckbox);
    gradientSwitch.appendChild(gradientSlider);
    gradientRow.appendChild(gradientSwitch);
    container.appendChild(gradientRow);

    // 渐变位置控制（直接在渐变条上拖拽）
    const gPosRow = document.createElement('div');
    gPosRow.style.cssText = 'display:none;margin-bottom:0;';
    gPosRow.id = 'gradient-position-row';

    // 拖拽状态
    let dragging = null; // 'start' | 'end' | null

    const commitGradientPos = () => {
        editData.gradientStart = curS;
        editData.gradientEnd = curE;
    };

    let curS = 0, curE = 100;

    const updateGradientUI = () => {
        gMarkerS.style.left = curS + '%';
        gMarkerE.style.left = curE + '%';
        gStartInput.value = curS;
        gEndInput.value = curE;
    };

    const posFromEvent = (e) => {
        const rect = gPreview.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        return Math.round(Math.max(0, Math.min(100, (x / rect.width) * 100)));
    };

    const onPointerDown = (e) => {
        e.preventDefault();
        const pos = posFromEvent(e);
        const dS = Math.abs(pos - curS);
        const dE = Math.abs(pos - curE);
        dragging = dS <= dE ? 'start' : 'end';
        gPreview.setPointerCapture(e.pointerId);
        gPreview.style.cursor = 'grabbing';
    };

    const onPointerMove = (e) => {
        if (!dragging) return;
        e.preventDefault();
        const pos = posFromEvent(e);
        if (dragging === 'start') {
            curS = Math.min(pos, curE);
        } else {
            curE = Math.max(pos, curS);
        }
        updateGradientUI();
    };

    const onPointerUp = (e) => {
        if (!dragging) return;
        dragging = null;
        gPreview.style.cursor = 'grab';
        commitGradientPos();
    };

    const updateGradientPreview = () => {
        const p = primaryHex.value.trim() ? primaryHex.value : '#cccccc';
        const s = secondaryHex.value.trim() ? secondaryHex.value : p;
        gPreview.style.background = 'linear-gradient(90deg, ' + p + ' 0%, ' + s + ' 100%)';
    };

    // 渐变条（可拖拽）
    const gPreview = document.createElement('div');
    gPreview.style.cssText = 'height:20px;border-radius:8px;margin:8px 0 12px;background:linear-gradient(90deg, #cccccc 0%, #cccccc 100%);border:1px solid var(--border-color);position:relative;cursor:grab;touch-action:none;';
    gPreview.addEventListener('pointerdown', onPointerDown);
    gPreview.addEventListener('pointermove', onPointerMove);
    gPreview.addEventListener('pointerup', onPointerUp);
    gPreview.addEventListener('pointercancel', onPointerUp);
    const gMarkerS = document.createElement('div');
    gMarkerS.style.cssText = 'position:absolute;top:-4px;left:' + curS + '%;width:4px;height:28px;border-radius:2px;background:var(--text-color);transform:translateX(-50%);transition:left 0.05s;pointer-events:none;';
    const gMarkerE = document.createElement('div');
    gMarkerE.style.cssText = 'position:absolute;top:-4px;left:' + curE + '%;width:4px;height:28px;border-radius:2px;background:var(--text-color);transform:translateX(-50%);transition:left 0.05s;pointer-events:none;';
    gPreview.appendChild(gMarkerS);
    gPreview.appendChild(gMarkerE);
    gPosRow.appendChild(gPreview);

    // 数值输入行（左右对称带标签）
    const gInputRow = document.createElement('div');
    gInputRow.style.cssText = 'display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:4px;';

    const makeInputGroup = (label, value, onChange) => {
        const group = document.createElement('div');
        group.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;';
        const lbl = document.createElement('span');
        lbl.style.cssText = 'font-size:12px;color:var(--text-secondary);font-weight:500;';
        lbl.textContent = label;
        group.appendChild(lbl);
        const inp = document.createElement('input');
        inp.type = 'number';
        inp.className = 'slider-value-input';
        inp.min = 0;
        inp.max = 100;
        inp.step = 1;
        inp.value = value;
        inp.style.width = '100%';
        inp.addEventListener('change', onChange);
        group.appendChild(inp);
        return group;
    };

    const gStartGroup = makeInputGroup('起始', curS, () => {
        let v = parseInt(gStartInput.value);
        if (isNaN(v) || v < 0) v = 0; if (v > 100) v = 100;
        if (v > curE) v = curE;
        curS = v; gStartInput.value = v;
        updateGradientUI();
        commitGradientPos();
    });
    const gStartInput = gStartGroup.querySelector('input');

    const gEndGroup = makeInputGroup('结束', curE, () => {
        let v = parseInt(gEndInput.value);
        if (isNaN(v) || v < 0) v = 0; if (v > 100) v = 100;
        if (v < curS) v = curS;
        curE = v; gEndInput.value = v;
        updateGradientUI();
        commitGradientPos();
    });
    const gEndInput = gEndGroup.querySelector('input');

    gInputRow.appendChild(gStartGroup);
    gInputRow.appendChild(gEndGroup);
    gPosRow.appendChild(gInputRow);

    updateGradientUI();
    container.appendChild(gPosRow);

    // 渐变行可见性
    const updateGradientRowVisibility = () => {
        const hasSec = secondaryHex.value.trim() ? true : false;
        gradientRow.style.display = hasSec ? 'flex' : 'none';
        gPosRow.style.display = (hasSec && gradientCheckbox.checked) ? 'block' : 'none';
    };
    updateGradientRowVisibility();

    const parseHex = (raw) => {
        let val = raw.trim();
        if (!val) return '';
        if (val.startsWith('#')) val = val.substring(1);
        if (/^[0-9a-f]{6}$/i.test(val)) return '#' + val.toUpperCase();
        return null;
    };

    // 事件 - 仅更新 UI，不保存
    primaryHex.addEventListener('input', () => {
        updatePreview(primaryHex, primaryPreview);
        editData.primaryColor = parseHex(primaryHex.value) || primaryHex.value.trim();
        updateGradientPreview();
    });
    primaryHex.addEventListener('blur', () => {
        const val = primaryHex.value.trim();
        if (!val) { primaryHex.value = ''; return; }
        const parsed = parseHex(primaryHex.value);
        if (!parsed) primaryHex.value = '';
        else primaryHex.value = parsed;
    });

    secondaryHex.addEventListener('input', () => {
        updatePreview(secondaryHex, secondaryPreview);
        editData.secondaryColor = parseHex(secondaryHex.value) || secondaryHex.value.trim();
        updateGradientRowVisibility();
        updateGradientPreview();
    });
    secondaryHex.addEventListener('blur', () => {
        const val = secondaryHex.value.trim();
        if (!val) { secondaryHex.value = ''; return; }
        const parsed = parseHex(secondaryHex.value);
        if (!parsed) secondaryHex.value = '';
        else secondaryHex.value = parsed;
    });

    gradientCheckbox.addEventListener('change', () => {
        editData.gradientEnabled = gradientCheckbox.checked;
        if (gradientCheckbox.checked && secondaryHex.value.trim()) {
            gPosRow.style.display = 'block';
        } else {
            gPosRow.style.display = 'none';
        }
    });

    // 底部按钮容器
    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;justify-content:flex-end;gap:10px;margin-top:auto;padding-top:12px;border-top:1px solid var(--border-color);';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    cancelBtn.style.cssText = 'padding:8px 20px;border:1px solid var(--border-color);border-radius:12px;font-size:13px;color:var(--text-color);background:transparent;cursor:pointer;';
    cancelBtn.addEventListener('click', () => {
        delete rightPanelUpper.dataset.subView;
        const items = document.getElementById('color-scheme-select-items');
        if (items && selected && hiddenSelect) {
            self.showSettingsMenuInRightPanel(items, selected, hiddenSelect, true);
        }
    });
    btnRow.appendChild(cancelBtn);

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = '确定';
    confirmBtn.style.cssText = 'padding:8px 20px;border:none;border-radius:12px;font-size:13px;color:#fff;background:var(--primary-color);cursor:pointer;';
    confirmBtn.addEventListener('click', () => {
        // 验证名称
        let name = nameInput.value.trim();
        if (!name) name = '自定义配色';
        // 验证主色
        const primaryParsed = parseHex(primaryHex.value);
        if (!primaryParsed) {
            self.showNotification('请输入有效的主色值');
            primaryHex.focus();
            return;
        }
        const secondaryParsed = parseHex(secondaryHex.value);
        const gradientEnabled = gradientCheckbox.checked;

        // 检查名称重复，生成唯一名称
        const existingNames = (self.settings.customColors || []).map(c => c.name);
        let finalName = name;
        if (existingNames.includes(finalName)) {
            let suffix = 2;
            while (existingNames.includes(finalName + '(' + suffix + ')')) {
                suffix++;
            }
            finalName = name + '(' + suffix + ')';
        }

        // 保存到 customColors
        const newScheme = {
            name: finalName,
            primaryColor: primaryParsed,
            secondaryColor: secondaryParsed || '',
            gradientEnabled: gradientEnabled,
            gradientStart: curS,
            gradientEnd: curE
        };

        if (!self.settings.customColors) {
            self.settings.customColors = [];
        }
        self.settings.customColors.push(newScheme);
        const newIndex = self.settings.customColors.length - 1;
        self.settings.activeCustomColorIndex = newIndex;
        self.settings.colorScheme = 'custom';
        self.saveSettings();
        self.applyColorScheme();

        // 重新渲染颜色方案列表并选中新创建的方案
        delete rightPanelUpper.dataset.subView;
        const items = document.getElementById('color-scheme-select-items');
        if (items && selected && hiddenSelect) {
            self.showSettingsMenuInRightPanel(items, selected, hiddenSelect, true);
        }
        self.showNotification('已保存配色方案"' + finalName + '"');
    });
    btnRow.appendChild(confirmBtn);

    container.appendChild(btnRow);
    rightPanelUpper.appendChild(container);
    // 强制限制容器高度，防止撑高弹窗
    const constrainHeight = () => {
        const parent = rightPanelUpper.parentElement;
        if (parent) {
            const px = parent.clientHeight - 60;
            if (px > 100) container.style.maxHeight = px + 'px';
        }
    };
    constrainHeight();
    // 窗口尺寸变化时重新计算
    const resizeHandler = () => constrainHeight();
    window.addEventListener('resize', resizeHandler);
    // 清理监听器
    const origHide = self.hideSettingsQuickLinksAddInterface || self.hideCustomColorEditor;
    const cleanup = () => window.removeEventListener('resize', resizeHandler);
    // 观察面板隐藏时清理
    const mo = new MutationObserver(() => {
        if (!rightPanelUpper.isConnected || rightPanelUpper.innerHTML === '') {
            cleanup();
            mo.disconnect();
        }
    });
    mo.observe(rightPanelUpper, { childList: true, subtree: false });
};

OOOInterface.prototype.backToCustomColorView = function (rightPanelUpper) {
    if (rightPanelUpper) {
        delete rightPanelUpper.dataset.subView;
    }
    this._doBackToCustomColorView(rightPanelUpper);
};

OOOInterface.prototype._doBackToCustomColorView = function (rightPanelUpper) {
    const items = document.getElementById('color-scheme-select-items');
    if (!items) return;
    const selected = document.getElementById('color-scheme-select-selected');
    const hiddenSelect = document.getElementById('color-scheme-select');
    if (!selected || !hiddenSelect) return;
    this.showSettingsMenuInRightPanel(items, selected, hiddenSelect, true);
};

OOOInterface.prototype.closeSettingsMenuInRightPanel = function () {
    const rightPanelUpper = document.getElementById('right-panel-upper');
    if (!rightPanelUpper) return;

    document.getElementById('settings-modal').classList.remove('right-panel-open');

    requestAnimationFrame(() => {
        rightPanelUpper.innerHTML = '';
        delete rightPanelUpper.dataset.menuType;
        delete rightPanelUpper.dataset.subView;
        this.showDefaultRightPanelContent(rightPanelUpper);
    });

    // 清理 body 上的弹窗
    const dd = document.querySelector('[data-import-dropdown]');
    if (dd) dd.remove();
    const fs = document.querySelector('[data-folder-submenu]');
    if (fs) fs.remove();
};

OOOInterface.prototype.confirmRightPanelChanges = function () {
    const rightPanelUpper = document.getElementById('right-panel-upper');
    if (!rightPanelUpper) return;
    const menuType = rightPanelUpper.dataset.menuType;

    // 保存文字Logo输入
    if (menuType === 'logo') {
        const textLogoInput = document.getElementById('text-logo-input-panel');
        if (textLogoInput && textLogoInput.value.trim()) {
            const text = textLogoInput.value.trim();
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
            if (getCharLength(text) <= 25) {
                this.settings.logoType = 'text';
                this.settings.logo = 'text-logo';
                this.settings.textLogo = text;
                this.userChangedLogo = true;
                this.applyLogo();
                this.saveSettings();
                this.showNotification('文字Logo设置');
                const selected = document.getElementById('logo-select-selected');
                const hiddenSelect = document.getElementById('logo-select');
                if (selected) selected.textContent = '自定义文字Logo';
                if (hiddenSelect) hiddenSelect.value = 'text-logo';
            }
        }
    }

    // 保存壁纸填满开关状态
    if (menuType === 'wallpaper') {
        const panelToggle = document.getElementById('wallpaper-fill-toggle-panel');
        if (panelToggle) {
            this.settings.wallpaperFill = panelToggle.checked;
            this.saveSettings();
            this.applyWallpaper();
        }
    }
};

OOOInterface.prototype.showDefaultRightPanelContent = function (rightPanelUpper) {
    rightPanelUpper.innerHTML = '<div class="right-panel-placeholder-container"><div class="right-panel-placeholder"></div></div>';

    const placeholder = rightPanelUpper.querySelector('.right-panel-placeholder');
    if (placeholder) {
        if (this.settings.font === 'Ginto') {
            placeholder.style.fontFamily = `'Ginto', system-ui, -apple-system, sans-serif`;
        } else if (this.settings.font === 'Josefin') {
            placeholder.style.fontFamily = `'Josefin Sans', 'Ginto', system-ui, -apple-system, sans-serif`;
        } else if (this.settings.font === 'Code') {
            placeholder.style.fontFamily = `'Google Sans Code', 'Ginto', system-ui, -apple-system, sans-serif`;
        } else if (this.settings.font === 'Sans Flex') {
            placeholder.style.fontFamily = `'Google Sans Flex', 'Ginto', system-ui, -apple-system, sans-serif`;
        } else {
            placeholder.style.fontFamily = `'${this.settings.font}', system-ui, -apple-system, sans-serif`;
        }
    }
};

OOOInterface.prototype.updateSettingsButtonsPosition = function () {
    var buttons = document.querySelector('.setting-group.action-buttons');
    if (!buttons) return;
    var mobileContainer = document.getElementById('mobile-buttons-container');
    var rightPanelContent = document.querySelector('.right-panel-content');
    if (!mobileContainer || !rightPanelContent) return;
    if (window.innerWidth < 600) {
        if (buttons.parentElement !== mobileContainer) {
            mobileContainer.appendChild(buttons);
        }
    } else {
        if (buttons.parentElement !== rightPanelContent) {
            rightPanelContent.appendChild(buttons);
        }
    }
};

OOOInterface.prototype.initSettingsMenus = function () {
    const rightPanelUpper = document.getElementById('right-panel-upper');
    if (rightPanelUpper) {
        this.showDefaultRightPanelContent(rightPanelUpper);
    }
};

OOOInterface.prototype.showQuickLinksMenuInRightPanel = function () {
    const self = this;
    const rightPanelUpper = document.getElementById('right-panel-upper');
    if (!rightPanelUpper) return;
    document.getElementById('settings-modal').classList.add('right-panel-open');

    rightPanelUpper.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'settings-menu-container slide-in-right';

    const listContainer = document.createElement('div');
    listContainer.className = 'quick-links-list-container';
    container.appendChild(listContainer);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'settings-menu-button-container';

    const plusBtn = document.createElement('button');
    plusBtn.className = 'upload-btn settings-plus-btn';
    plusBtn.textContent = '+';
    plusBtn.title = '添加快速访问链接';

    // 书签导入按钮
    const importBtn = document.createElement('button');
    importBtn.className = 'settings-import-btn';
    importBtn.title = '从Chrome书签导入';
    importBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';

    // 导入下拉菜单（挂到 body 避免被父容器裁剪）
    const importDropdown = document.createElement('div');
    importDropdown.className = 'bookmark-import-dropdown';
    importDropdown.setAttribute('data-import-dropdown', '');
    document.body.appendChild(importDropdown);

    // 文件夹选择子菜单
    const folderSubmenu = document.createElement('div');
    folderSubmenu.className = 'bookmark-folder-submenu';
    folderSubmenu.setAttribute('data-folder-submenu', '');
    document.body.appendChild(folderSubmenu);

    buttonContainer.appendChild(importBtn);
    buttonContainer.appendChild(plusBtn);
    container.appendChild(buttonContainer);

    rightPanelUpper.appendChild(container);

    this.updateQuickLinksListInMenu(listContainer);

    plusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        self.showQuickLinksAddInterface(container, listContainer, buttonContainer);
    });

    // 导入按钮点击事件
    importBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        self.toggleBookmarkImportDropdown(importDropdown, folderSubmenu, importBtn);
    });

    // 点击外部关闭下拉菜单
    document.addEventListener('click', (e) => {
        if (e.target !== importBtn && !importDropdown.contains(e.target) && !folderSubmenu.contains(e.target)) {
            importDropdown.classList.remove('active');
            folderSubmenu.classList.remove('active');
        }
    });
};

OOOInterface.prototype.showQuickLinksAddInterface = function (container, listContainer, buttonContainer, editIndex) {
    const self = this;
    const isEdit = typeof editIndex === 'number' && editIndex >= 0;
    const existingLink = isEdit ? (this.settings.quickLinks[editIndex] || null) : null;

    listContainer.style.display = 'none';
    buttonContainer.style.display = 'none';

    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'quick-links-input-wrapper';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'setting-input';
    nameInput.id = 'quick-link-name';
    nameInput.placeholder = '网站名称';
    if (isEdit && existingLink) {
        nameInput.value = existingLink.name;
    }

    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.className = 'setting-input';
    urlInput.id = 'quick-link-url';
    urlInput.placeholder = '网站地址';
    if (isEdit && existingLink) {
        urlInput.value = existingLink.url;
    }

    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.className = 'settings-menu-button-container quick-links-add-buttons';

    const handleSave = () => {
        const name = nameInput.value.trim();
        const url = urlInput.value.trim();

        if (!name || !url) {
            self.hideQuickLinksAddInterface(container, inputWrapper, listContainer, buttonContainer);
            return;
        }

        if (isEdit) {
            self.settings.quickLinks[editIndex] = { name, url };
            self.saveSettings();
            self.showNotification('快速访问链接已更新');
        } else {
            self.addQuickLink();
        }
        self.updateQuickLinksListInMenu(listContainer);
        self.hideQuickLinksAddInterface(container, inputWrapper, listContainer, buttonContainer);
    };

    const confirmAddBtn = document.createElement('button');
    confirmAddBtn.className = 'settings-menu-confirm-primary';
    confirmAddBtn.textContent = '确定';

    // 编辑模式添加取消按钮
    if (isEdit) {
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.style.cssText = 'padding:8px 20px;border:1px solid var(--border-color);border-radius:12px;font-size:13px;color:var(--text-color);background:transparent;cursor:pointer;';
        cancelBtn.addEventListener('click', () => {
            self.hideQuickLinksAddInterface(container, inputWrapper, listContainer, buttonContainer);
        });
        buttonsWrapper.appendChild(cancelBtn);
    }

    nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            urlInput.focus();
        }
    });

    urlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    });

    confirmAddBtn.addEventListener('click', handleSave);

    buttonsWrapper.appendChild(confirmAddBtn);

    inputWrapper.appendChild(nameInput);
    inputWrapper.appendChild(urlInput);
    container.appendChild(inputWrapper);
    container.appendChild(buttonsWrapper);

    const rpu = document.getElementById('right-panel-upper');
    if (rpu) {
        rpu.dataset.subView = isEdit ? 'quick-link-edit' : 'quick-link-add';
    }

    container._qlinput = inputWrapper;
    container._qllist = listContainer;
    container._qlbtn = buttonContainer;

    requestAnimationFrame(() => {
        inputWrapper.classList.add('slide-in-right');
        buttonsWrapper.classList.add('slide-in-right');
    });

    nameInput.focus();
};

OOOInterface.prototype.hideQuickLinksAddInterface = function (container, inputWrapper, listContainer, buttonContainer) {
    const buttonsWrapper = container.querySelector('.quick-links-add-buttons');

    delete container._qlinput;
    delete container._qllist;
    delete container._qlbtn;

    const rpu = document.getElementById('right-panel-upper');
    if (rpu && (rpu.dataset.subView === 'quick-link-add' || rpu.dataset.subView === 'quick-link-edit')) {
        delete rpu.dataset.subView;
    }

    inputWrapper.classList.remove('slide-in-right');
    inputWrapper.classList.add('slide-out-right');
    if (buttonsWrapper) {
        buttonsWrapper.classList.remove('slide-in-right');
        buttonsWrapper.classList.add('slide-out-right');
    }

    setTimeout(() => {
        if (buttonsWrapper && buttonsWrapper.parentNode) {
            container.removeChild(buttonsWrapper);
        }
        if (inputWrapper.parentNode) {
            container.removeChild(inputWrapper);
        }
        listContainer.style.display = 'flex';
        buttonContainer.style.display = 'flex';
    }, 180);
};

OOOInterface.prototype.updateQuickLinksListInMenu = function (listContainer) {
    if (!listContainer) return;

    const self = this;
    listContainer.innerHTML = '';

    if (this.settings.quickLinks.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'quick-links-empty';
        emptyMessage.textContent = '暂无快速访问链接';
        listContainer.appendChild(emptyMessage);
        return;
    }

    this.settings.quickLinks.forEach((link, index) => {
        const item = document.createElement('div');
        item.className = 'quick-link-menu-item';
        item.setAttribute('data-index', index);
        item.draggable = true;

        const dragHandle = document.createElement('div');
        dragHandle.className = 'quick-link-drag-handle';
        dragHandle.innerHTML = '<span></span><span></span>';
        dragHandle.title = '拖拽排序';

        const info = document.createElement('div');
        info.className = 'quick-link-menu-info';

        const name = document.createElement('div');
        name.className = 'quick-link-menu-name';
        name.textContent = link.name;

        const url = document.createElement('div');
        url.className = 'quick-link-menu-url';
        url.textContent = link.url;

        info.appendChild(name);
        info.appendChild(url);

        // 点击编辑链接
        info.addEventListener('click', (e) => {
            e.stopPropagation();
            const container = listContainer.closest('.settings-menu-container');
            const buttonContainer = container ? container.querySelector('.settings-menu-button-container') : null;
            if (container) {
                self.showQuickLinksAddInterface(container, listContainer, buttonContainer, index);
            }
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-link-menu-btn';
        deleteBtn.textContent = '×';
        deleteBtn.title = '删除';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.settings.quickLinks.splice(index, 1);
            this.saveSettings();
            this.updateQuickLinksListInMenu(listContainer);

            this.showNotification('快速访问链接已删除');
        });

        item.appendChild(dragHandle);
        item.appendChild(info);
        item.appendChild(deleteBtn);
        listContainer.appendChild(item);

        item.addEventListener('dragstart', (e) => {
            item.classList.add('dragging');
            e.dataTransfer.setData('text/plain', 'move');
            e.dataTransfer.effectAllowed = 'move';
            // 清除默认拖拽半透明预览
            const blankImg = new Image();
            blankImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            e.dataTransfer.setDragImage(blankImg, 0, 0);
        });

        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
            // 移除所有拖拽指示线
            listContainer.querySelectorAll('.drag-indicator').forEach(el => el.remove());
            listContainer.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
        });

        item.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            const dragged = listContainer.querySelector('.dragging');
            if (!dragged || dragged === item) return;

            // 移除其他指示线
            listContainer.querySelectorAll('.drag-indicator').forEach(el => el.remove());

            // 根据鼠标在项目中的位置决定插入上方还是下方
            const rect = item.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;
            const insertBefore = e.clientY < midY;

            const indicator = document.createElement('div');
            indicator.className = 'drag-indicator';
            if (insertBefore) {
                item.parentNode.insertBefore(indicator, item);
            } else {
                item.parentNode.insertBefore(indicator, item.nextSibling);
            }
        });

        item.addEventListener('dragleave', (e) => {
            // 只在离开此元素时移除自身的指示线（不处理子元素冒泡）
            if (e.target === item) {
                const indicator = item.parentNode.querySelector('.drag-indicator');
                if (indicator) indicator.remove();
            }
        });

        item.addEventListener('drop', (e) => {
            e.preventDefault();
            const dragged = listContainer.querySelector('.dragging');
            if (!dragged) return;

            const indicator = listContainer.querySelector('.drag-indicator');
            if (!indicator) return;

            // 根据指示线位置移动DOM元素
            const referenceNode = indicator.nextSibling;
            indicator.remove();

            if (referenceNode) {
                listContainer.insertBefore(dragged, referenceNode);
            } else {
                listContainer.appendChild(dragged);
            }

            // 更新所有项的 data-index
            const allItems = listContainer.querySelectorAll('.quick-link-menu-item');
            allItems.forEach((el, i) => {
                el.setAttribute('data-index', i);
            });

            // 根据DOM顺序重建设置数组（不重新渲染，避免闪烁）
            const newLinks = [];
            allItems.forEach(el => {
                const nameEl = el.querySelector('.quick-link-menu-name');
                const urlEl = el.querySelector('.quick-link-menu-url');
                if (nameEl && urlEl) {
                    newLinks.push({ name: nameEl.textContent, url: urlEl.textContent });
                }
            });

            self.settings.quickLinks = newLinks;
            self.saveSettings();
            self.showNotification('顺序已调整');
        });
    });

    // 一键清除按钮（超过5个链接时显示）
    if (this.settings.quickLinks.length > 5) {
        const clearAllBtn = document.createElement('button');
        clearAllBtn.className = 'quick-link-clear-all-btn';
        clearAllBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> ';
        clearAllBtn.title = '删除所有快速访问链接';
        clearAllBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (self.settings.quickLinks.length === 0) {
                self.showNotification('没有可清除的链接');
                return;
            }
            self.settings.quickLinks = [];
            self.saveSettings();
            self.applyQuickLinks();
            self.updateQuickLinksListInMenu(listContainer);
            self.showNotification('已清除所有快速访问链接');
        });
        listContainer.appendChild(clearAllBtn);
    }
};

// ========== Chrome 书签导入功能 ==========

OOOInterface.prototype.toggleBookmarkImportDropdown = function (dropdown, folderSubmenu, anchorBtn) {
    const isActive = dropdown.classList.contains('active');
    folderSubmenu.classList.remove('active');
    if (isActive) {
        dropdown.classList.remove('active');
        return;
    }

    // 先渲染内容
    this.renderBookmarkImportDropdown(dropdown, folderSubmenu);

    // 测量并定位到按钮上方
    if (anchorBtn) {
        const rect = anchorBtn.getBoundingClientRect();
        const ddWidth = 200;
        let leftPos = Math.round(rect.left + rect.width / 2 - ddWidth / 2);
        if (leftPos < 8) leftPos = 8;

        // 临时显示测量高度
        dropdown.style.left = leftPos + 'px';
        dropdown.style.top = '-999px';
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'visible';
        dropdown.style.transform = 'none';

        const ddHeight = dropdown.offsetHeight;
        const gap = 10;
        let topPos = Math.round(rect.top - ddHeight - gap);
        if (topPos < 8) topPos = 8;

        // 清除测量用内联样式
        dropdown.style.top = topPos + 'px';
        dropdown.style.left = leftPos + 'px';
        dropdown.style.opacity = '';
        dropdown.style.visibility = '';
        dropdown.style.transform = '';

        dropdown._anchorRect = rect;
    }

    // 显示弹窗（触发 CSS 动画）
    requestAnimationFrame(() => {
        dropdown.classList.add('active');
    });
};

OOOInterface.prototype.renderBookmarkImportDropdown = function (dropdown, folderSubmenu) {
    const self = this;
    dropdown.innerHTML = '';

    // 全部导入
    const optionAll = document.createElement('div');
    optionAll.className = 'bookmark-import-option';
    optionAll.innerHTML = '<span class="bookmark-import-option-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></span><span>全部导入</span>';
    optionAll.addEventListener('click', (e) => {
        e.stopPropagation();
        self.importBookmarksFromChrome('all', null, dropdown, folderSubmenu);
    });
    dropdown.appendChild(optionAll);

    // 指定文件夹
    const optionFolder = document.createElement('div');
    optionFolder.className = 'bookmark-import-option';
    optionFolder.innerHTML = '<span class="bookmark-import-option-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></span><span>指定文件夹</span>';
    optionFolder.addEventListener('click', (e) => {
        e.stopPropagation();
        self.showBookmarkFolderSelection(folderSubmenu, dropdown);
    });
    dropdown.appendChild(optionFolder);

    // 去重（开关样式）
    const optionDedup = document.createElement('div');
    optionDedup.className = 'bookmark-import-option';
    optionDedup.style.justifyContent = 'space-between';
    optionDedup.innerHTML = '<span style="display:flex;align-items:center;gap:10px;min-width:0"><span class="bookmark-import-option-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></span><span>去重</span></span>';

    const dedupToggle = document.createElement('label');
    dedupToggle.className = 'switch bookmark-dedup-switch';
    dedupToggle.style.margin = '0';
    dedupToggle.style.flexShrink = '0';
    dedupToggle.style.marginRight = '-5px';
    const dedupCheckbox = document.createElement('input');
    dedupCheckbox.type = 'checkbox';
    dedupCheckbox.checked = true;
    dedupCheckbox.id = 'bookmark-dedup-toggle';
    const dedupSlider = document.createElement('span');
    dedupSlider.className = 'slider';
    dedupToggle.appendChild(dedupCheckbox);
    dedupToggle.appendChild(dedupSlider);
    optionDedup.appendChild(dedupToggle);
    dropdown.appendChild(optionDedup);
};

OOOInterface.prototype.showBookmarkFolderSelection = function (folderSubmenu, dropdown) {
    const self = this;
    dropdown.classList.remove('active');
    folderSubmenu.innerHTML = '';

    // 定位文件夹子菜单位置
    const anchor = dropdown._anchorRect;
    if (anchor) {
        folderSubmenu.style.left = Math.round(anchor.left + anchor.width / 2 - 120) + 'px';
        folderSubmenu.style.top = Math.round(anchor.top - 8) + 'px';
    }

    // 返回按钮
    const backBtn = document.createElement('div');
    backBtn.className = 'bookmark-folder-back';
    backBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg><span>返回</span>';
    backBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        folderSubmenu.classList.remove('active');
        dropdown.classList.add('active');
    });
    folderSubmenu.appendChild(backBtn);

    // 加载中提示
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'bookmark-import-option';
    loadingMsg.style.justifyContent = 'center';
    loadingMsg.style.color = 'var(--text-secondary)';
    loadingMsg.textContent = '加载中...';
    folderSubmenu.appendChild(loadingMsg);
    folderSubmenu.classList.add('active');

    // 获取书签文件夹
    try {
        chrome.bookmarks.getTree(function (bookmarkTree) {
            // 移除加载提示
            folderSubmenu.innerHTML = '';

            // 重新添加返回按钮
            const backBtn2 = document.createElement('div');
            backBtn2.className = 'bookmark-folder-back';
            backBtn2.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg><span>返回</span>';
            backBtn2.addEventListener('click', (e) => {
                e.stopPropagation();
                folderSubmenu.classList.remove('active');
                dropdown.classList.add('active');
            });
            folderSubmenu.appendChild(backBtn2);

            // 提取所有文件夹
            const folders = [];
            const extractFolders = (nodes, depth) => {
                nodes.forEach(node => {
                    // 是文件夹（有children且无url）
                    if (node.children && !node.url) {
                        const bookmarkCount = node.children.filter(c => c.url).length;
                        folders.push({
                            id: node.id,
                            title: node.title || '书签',
                            count: bookmarkCount,
                            depth: depth
                        });
                        if (node.children) {
                            extractFolders(node.children, depth + 1);
                        }
                    }
                });
            };
            // 从根的子节点开始（跳过根节点本身）
            if (bookmarkTree && bookmarkTree[0] && bookmarkTree[0].children) {
                extractFolders(bookmarkTree[0].children, 0);
            }

            if (folders.length === 0) {
                const emptyMsg = document.createElement('div');
                emptyMsg.className = 'bookmark-import-option';
                emptyMsg.style.justifyContent = 'center';
                emptyMsg.style.color = 'var(--text-secondary)';
                emptyMsg.textContent = '未找到书签文件夹';
                folderSubmenu.appendChild(emptyMsg);
                return;
            }

            folders.forEach(folder => {
                const item = document.createElement('div');
                item.className = 'bookmark-folder-item';
                item.style.paddingLeft = (14 + folder.depth * 16) + 'px';

                const icon = document.createElement('span');
                icon.className = 'bookmark-folder-item-icon';
                icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>';
                item.appendChild(icon);

                const nameSpan = document.createElement('span');
                nameSpan.className = 'bookmark-folder-item-name';
                nameSpan.textContent = folder.title || '(无标题)';
                item.appendChild(nameSpan);

                const countSpan = document.createElement('span');
                countSpan.className = 'bookmark-folder-item-count';
                countSpan.textContent = folder.count + '个链接';
                item.appendChild(countSpan);

                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    self.importBookmarksFromChrome('folder', folder.id, dropdown, folderSubmenu);
                });

                folderSubmenu.appendChild(item);
            });
        });
    } catch (e) {
        folderSubmenu.innerHTML = '';
        const errorMsg = document.createElement('div');
        errorMsg.className = 'bookmark-import-option';
        errorMsg.style.justifyContent = 'center';
        errorMsg.style.color = '#ef4444';
        errorMsg.style.flexDirection = 'column';
        errorMsg.style.alignItems = 'center';
        errorMsg.style.gap = '8px';
        errorMsg.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg><span>无法访问书签数据</span>';
        folderSubmenu.appendChild(errorMsg);
    }
};

OOOInterface.prototype.importBookmarksFromChrome = function (mode, folderId, dropdown, folderSubmenu) {
    const self = this;
    dropdown.classList.remove('active');
    folderSubmenu.classList.remove('active');

    const dedupEnabled = document.getElementById('bookmark-dedup-toggle') ? document.getElementById('bookmark-dedup-toggle').checked : true;

    try {
        chrome.bookmarks.getTree(function (bookmarkTree) {
            let bookmarksToImport = [];

            if (mode === 'all') {
                // 提取所有书签
                const extractAll = (nodes) => {
                    nodes.forEach(node => {
                        if (node.url) {
                            bookmarksToImport.push({
                                name: node.title || self.extractDomain(node.url),
                                url: node.url
                            });
                        }
                        if (node.children) {
                            extractAll(node.children);
                        }
                    });
                };
                extractAll(bookmarkTree);
            } else if (mode === 'folder' && folderId) {
                // 查找指定文件夹
                const findFolderAndExtract = (nodes) => {
                    for (const node of nodes) {
                        if (node.id === folderId && node.children) {
                            node.children.forEach(child => {
                                if (child.url) {
                                    bookmarksToImport.push({
                                        name: child.title || self.extractDomain(child.url),
                                        url: child.url
                                    });
                                }
                            });
                            return true;
                        }
                        if (node.children) {
                            if (findFolderAndExtract(node.children)) return true;
                        }
                    }
                    return false;
                };
                findFolderAndExtract(bookmarkTree);
            }

            if (bookmarksToImport.length === 0) {
                self.showNotification('未找到可导入的书签');
                return;
            }

            // 去重
            let imported = 0;
            let skipped = 0;

            bookmarksToImport.forEach(bookmark => {
                const exists = self.settings.quickLinks.some(
                    link => link.url === bookmark.url || link.name === bookmark.name
                );
                if (dedupEnabled && exists) {
                    skipped++;
                } else {
                    self.settings.quickLinks.push({
                        name: bookmark.name,
                        url: bookmark.url
                    });
                    imported++;
                }
            });

            self.saveSettings();
            // 更新侧边栏显示
            self.applyQuickLinks();
            // 查找当前活动的列表容器
            const activeListContainer = document.querySelector('#right-panel-upper .quick-links-list-container');
            if (activeListContainer) {
                self.updateQuickLinksListInMenu(activeListContainer);
            }

            // 显示导入结果
            if (imported > 0) {
                self.showNotification('成功导入 ' + imported + ' 个书签' + (skipped > 0 ? '，已跳过 ' + skipped + ' 个重复项' : ''));
            } else {
                self.showNotification('未导入新书签' + (skipped > 0 ? '，已跳过 ' + skipped + ' 个重复项' : ''));
            }
        });
    } catch (e) {
        self.showNotification('无法访问Chrome书签数据');
    }
};

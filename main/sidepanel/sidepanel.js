/**
 * OOOInterface 侧边栏面板（Chrome Side Panel）
 * 复用主页面的设置数据（chrome.storage.local 的 oooInterfaceSettings）、
 * DOM 结构与类名，同步主页面的外观状态（高级视觉效果/配色/壁纸），
 * 并按"侧边栏功能"设置渲染：小组件、快速访问链接、底部搜索框与引擎切换。
 */

(function () {
    'use strict';

    // 出厂预设中与本面板相关的设置（与 script.js 的 defaultSettings 保持一致）
    var DEFAULT_SETTINGS = {
        quickLinks: [],
        quickAccessSidebar: true,
        showQuickLinkIcons: true,
        dynamicBlur: false,
        enhancedDisplay: false,
        colorScheme: 'green',
        themeColorScheme: null,
        customColors: [],
        activeCustomColorIndex: -1,
        customPrimaryColor: '',
        customSecondaryColor: '',
        customGradientEnabled: false,
        customGradientStart: 0,
        customGradientEnd: 100,
        font: 'Sans Flex',
        customFonts: [],
        // 侧边栏功能：默认全部关闭，与主页面 defaultSettings 保持一致
        sidePanelEnabled: false,
        sidePanelShowWidgets: false,
        sidePanelShowQuickLinks: false,
        sidePanelShowSearch: false,
        sidePanelShowEngineButtons: false,
        sidePanelWallpaperEnabled: false,
        sidePanelWallpaperSync: false,
        sidePanelWallpaperUrl: '',
        sidePanelWidgetsSync: false,
        sidePanelWidgetPanel: { widgets: [] },
        sidePanelQuickLinksSync: false,
        sidePanelQuickLinks: [],
        sidePanelSearchSync: false,
        sidePanelSearchBoxHeight: 50,
        // 小组件面板配置（与主页面共用）
        widgetPanel: { enabled: true, widgets: [] }
    };

    var settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    var isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // 记录上次渲染的小组件配置，避免无关设置变化时重建小组件
    var lastWidgetsJson = null;
    var widgetInstances = [];

    // 主页面 app 的轻量替身：小组件仅依赖这三个方法（均有 typeof 守卫）
    var panelOOO = {
        settings: settings,
        saveWidgetData: saveWidgetData,
        showNotification: showPanelToast,
        openWidgetSettings: function () {
            openMainPage('');
        }
    };

    // ========== 设置读取 ==========

    function mergeSettings(saved) {
        // 完整保留已存的全部设置键（面板保存时会整体回写，若只保留白名单键会清掉
        // 主页面的壁纸/小组件等其余设置），默认值仅用于补缺
        return Object.assign(JSON.parse(JSON.stringify(DEFAULT_SETTINGS)), saved || {});
    }

    async function loadSettings() {
        var saved = null;
        try {
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                var result = await chrome.storage.local.get('oooInterfaceSettings');
                saved = result.oooInterfaceSettings || null;
            }
        } catch (e) {
            console.warn('侧边栏面板: chrome.storage.local 读取失败，尝试 localStorage:', e);
        }
        if (!saved) {
            try {
                var lsRaw = localStorage.getItem('oooInterfaceSettings');
                if (lsRaw) saved = JSON.parse(lsRaw);
            } catch (e) {
                console.error('侧边栏面板: localStorage 解析失败:', e);
            }
        }
        settings = mergeSettings(saved);
        panelOOO.settings = settings;
        // 与主页面 loadSettings 一致：高级视觉效果自动启用标志由两项状态派生
    }

    function saveSettings() {
        try {
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                var result = chrome.storage.local.set({ oooInterfaceSettings: settings });
                if (result && typeof result.catch === 'function') {
                    result.catch(function (error) {
                        console.warn('侧边栏面板: chrome.storage 保存失败，尝试 localStorage:', error);
                        try { localStorage.setItem('oooInterfaceSettings', JSON.stringify(settings)); } catch (e) { }
                    });
                }
            } else {
                localStorage.setItem('oooInterfaceSettings', JSON.stringify(settings));
            }
        } catch (error) {
            console.warn('侧边栏面板: 保存设置失败:', error);
        }
    }

    // ========== 提示浮层（小组件 saveWidgetData/showNotification 的面板版） ==========

    function showPanelToast(message) {
        var toast = document.getElementById('qa-panel-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'qa-panel-toast';
            toast.className = 'qa-panel-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(function () {
            toast.classList.remove('show');
        }, 2200);
    }

    // ========== 配色方案（与主页面 getColorConfig/applyColorScheme 逻辑一致） ==========

    // color.js 的全局 getColorConfig（IIFE 内同名函数声明会提升遮蔽全局，必须经 window 取用）
    var getColorConfigBase = typeof window.getColorConfig === 'function' ? window.getColorConfig : null;

    function getColorConfig() {
        var scheme = settings.colorScheme || 'green';
        if (scheme === 'theme-add') {
            return settings.themeColorScheme || getColorConfigBase('green');
        }
        if (scheme === 'custom') {
            var customItem = settings.customColors && settings.customColors.length > 0 && settings.activeCustomColorIndex >= 0
                ? settings.customColors[settings.activeCustomColorIndex]
                : null;
            var customColors = customItem ? {
                primaryColor: customItem.primaryColor || '',
                secondaryColor: customItem.secondaryColor || '',
                gradientEnabled: customItem.gradientEnabled || false,
                gradientStart: customItem.gradientStart !== undefined ? customItem.gradientStart : 0,
                gradientEnd: customItem.gradientEnd !== undefined ? customItem.gradientEnd : 100
            } : {
                primaryColor: settings.customPrimaryColor || '',
                secondaryColor: settings.customSecondaryColor || '',
                gradientEnabled: settings.customGradientEnabled || false,
                gradientStart: settings.customGradientStart !== undefined ? settings.customGradientStart : 0,
                gradientEnd: settings.customGradientEnd !== undefined ? settings.customGradientEnd : 100
            };
            return getColorConfigBase('custom', customColors);
        }
        return getColorConfigBase(scheme);
    }

    function applyColorScheme() {
        var body = document.body;
        var scheme = settings.colorScheme || 'green';
        var colorConfig = getColorConfig();

        var colorClasses = ['color-scheme-green', 'color-scheme-blue', 'color-scheme-black-white', 'color-scheme-tianyi-blue', 'color-scheme-vibrant-red', 'color-scheme-classic-gold', 'color-scheme-isolation', 'color-scheme-earth', 'color-scheme-custom', 'color-scheme-theme-add'];
        colorClasses.forEach(function (cls) { body.classList.remove(cls); });
        body.classList.add('color-scheme-' + scheme);

        var accent = isDarkMode ? colorConfig.accentDark : colorConfig.accent;
        var accentRgb = isDarkMode ? colorConfig.accentDarkRgb : colorConfig.accentRgb;
        var gradient = isDarkMode ? (colorConfig.gradientDark || colorConfig.accentDark) : (colorConfig.gradient || colorConfig.accent);
        body.style.setProperty('--primary-color', accent);
        body.style.setProperty('--scheme-accent', accent);
        body.style.setProperty('--scheme-accent-rgb', accentRgb);
        body.style.setProperty('--scheme-gradient', gradient);
        body.style.setProperty('--scheme-accent-hover', colorConfig.accentHover);
        body.style.setProperty('--scheme-accent-active', colorConfig.accentActive);

        // 侧边栏图标配色（与主页面 updateSidebarIconColors 一致）
        var container = document.getElementById('quick-access-sidebar-container');
        if (container) {
            container.style.setProperty('--sidebar-icon-bg', colorConfig.sidebarIcon);
            // 面板中侧边栏常驻显示（主页面由 hover/固定逻辑添加 visible，这里始终可见）
            container.classList.add('visible');
        }
    }

    // ========== 字体（与主页面 applyFont 逻辑一致） ==========

    function loadCustomFonts() {
        var promises = (settings.customFonts || []).map(function (font) {
            try {
                var buffer = dataUrlToArrayBuffer(font.data);
                var fontFace = new FontFace(font.name, buffer);
                return fontFace.load().then(function (loadedFace) {
                    document.fonts.add(loadedFace);
                }).catch(function (error) {
                    console.error('侧边栏面板: 自定义字体加载失败:', error);
                });
            } catch (error) {
                console.error('侧边栏面板: 自定义字体解码失败:', error);
                return Promise.resolve();
            }
        });
        return Promise.all(promises);
    }

    function dataUrlToArrayBuffer(dataUrl) {
        var parts = dataUrl.split(',');
        var mime = parts[0].match(/:(.*?);/)[1];
        var binary = atob(parts[1]);
        var array = new Uint8Array(binary.length);
        for (var i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
        }
        return array.buffer;
    }

    function applyFont() {
        var body = document.body;
        var fontClasses = ['font-ginto', 'font-josefin', 'font-code', 'font-hmsc'];
        fontClasses.forEach(function (fontClass) {
            body.classList.remove(fontClass);
        });

        (settings.customFonts || []).forEach(function (font) {
            var safeClassName = 'font-' + font.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
            body.classList.remove(safeClassName);
        });

        if ((settings.customFonts || []).some(function (font) { return font.name === settings.font; })) {
            body.style.fontFamily = "'" + settings.font + "'";
        } else {
            body.style.fontFamily = '';
            switch (settings.font) {
                case 'Ginto':
                    body.classList.add('font-ginto');
                    break;
                case 'Josefin':
                    body.classList.add('font-josefin');
                    break;
                case 'Code':
                    body.classList.add('font-code');
                    break;
                case 'HMSC':
                    body.classList.add('font-hmsc');
                    break;
                default:
                    if (settings.font && settings.font !== 'Sans Flex') {
                        body.style.fontFamily = "'" + settings.font + "'";
                    }
                    break;
            }
        }
    }

    // ========== 壁纸（与主页面 getWallpaperUrl 解析一致） ==========

    function resolveMainWallpaperUrl() {
        if (settings.wallpaper === 'default') {
            return '../images/back.png';
        }
        if ((settings.wallpaper === 'bing' || settings.wallpaper === 'url') && settings.wallpaperUrl) {
            return settings.wallpaperUrl;
        }
        if (settings.wallpaper && settings.wallpaper !== 'default' && settings.wallpaper !== 'bing' && settings.wallpaper !== 'url') {
            return settings.wallpaper; // 自定义上传壁纸 data URL
        }
        return null;
    }

    function applyPanelWallpaper() {
        var wp = document.getElementById('qa-panel-wallpaper');
        if (!wp) return;

        var url = null;
        if (settings.sidePanelWallpaperEnabled) {
            if (settings.sidePanelWallpaperSync) {
                // 与主页面保持一致
                url = resolveMainWallpaperUrl();
            } else if (settings.sidePanelWallpaperUrl) {
                url = settings.sidePanelWallpaperUrl;
            } else {
                // 未填地址时使用默认壁纸
                url = '../images/back.png';
            }
        }

        wp.style.backgroundImage = url ? 'url("' + url + '")' : 'none';
        document.body.classList.toggle('qa-has-wallpaper', !!url);
    }

    // ========== 小组件（与主页面小组件面板同一套组件与配置） ==========

    var WIDGET_TYPES = {
        'clock': { name: '大时钟', defaultSize: 'square', allowSquare: true, allowSuper: false },
        'calendar': { name: '日历', defaultSize: 'square', allowSquare: true, allowSuper: true },
        'weather': { name: '天气', defaultSize: 'square', allowSquare: true, allowSuper: false },
        'tasks': { name: '任务', defaultSize: 'super', allowSquare: false, allowSuper: true },
        'ai-agent': { name: 'AI Agent', defaultSize: 'super', allowSquare: false, allowSuper: true },
        'email': { name: '邮箱', defaultSize: 'super', allowSquare: false, allowSuper: true },
        'upgrade-tool': { name: '升级工具', defaultSize: 'square', allowSquare: true, allowSuper: true }
    };

    function getWidgetAllowedSizes(type) {
        var meta = WIDGET_TYPES[type];
        if (!meta) return ['square', 'rectangle', 'super'];
        var sizes = [];
        if (meta.allowSquare !== false) sizes.push('square');
        sizes.push('rectangle');
        if (meta.allowSuper === true) sizes.push('super');
        return sizes;
    }

    function normalizeWidgetSize(type, size) {
        var allowed = getWidgetAllowedSizes(type);
        if (allowed.indexOf(size) >= 0) return size;
        var meta = WIDGET_TYPES[type];
        if (meta && allowed.indexOf(meta.defaultSize) >= 0) return meta.defaultSize;
        return allowed[allowed.length - 1] || 'rectangle';
    }

    function createWidgetInstance(config) {
        var baseConfig = {
            id: config.id,
            type: config.type,
            size: normalizeWidgetSize(config.type, config.size),
            data: config.data || {},
            ooo: panelOOO
        };
        switch (config.type) {
            case 'clock': return new ClockWidget(baseConfig);
            case 'calendar': return new CalendarWidget(baseConfig);
            case 'weather': return new WeatherWidget(baseConfig);
            case 'tasks': return new TasksWidget(baseConfig);
            case 'ai-agent': return new AiAgentWidget(baseConfig);
            case 'email': return new EmailWidget(baseConfig);
            case 'upgrade-tool': return new UpgradeToolWidget(baseConfig);
            default: return null;
        }
    }

    // 小组件数据保存：写入解析后的数据源并整体回写 storage（供主页面同步）
    function saveWidgetData(widgetId, data) {
        var widgets = getWidgetsSource();
        if (!Array.isArray(widgets)) return;
        var idx = widgets.findIndex(function (w) { return w.id === widgetId; });
        if (idx < 0) return;
        widgets[idx].data = data;
        saveSettings();
    }

    function renderWidgets() {
        var grid = document.getElementById('qa-widgets-grid');
        if (!grid) return;

        widgetInstances.forEach(function (w) {
            try { w.destroy(); } catch (e) { /* 忽略 */ }
        });
        widgetInstances = [];
        grid.innerHTML = '';

        var widgets = getWidgetsSource();

        if (widgets.length === 0) {
            var empty = document.createElement('div');
            empty.className = 'widget-panel-empty';
            empty.textContent = settings.sidePanelWidgetsSync
                ? '暂无小组件，可在主页面设置的"小组件列表"中添加'
                : '暂无小组件，可在侧边栏功能的"小组件"设置中添加';
            grid.appendChild(empty);
        } else {
            widgets.forEach(function (config) {
                var widget = createWidgetInstance(config);
                if (widget) {
                    try {
                        widget.render(grid);
                        widgetInstances.push(widget);
                    } catch (e) {
                        console.warn('侧边栏面板: 渲染小组件失败:', config.type, e);
                    }
                }
            });
        }

        syncWidgetScale();
        syncWidgetCardHeights();
    }

    // 与主页面小组件面板保持同一观感：主页面面板网格宽 240px（正方形卡片 116px），
    // 侧边栏按面板宽度整体等比缩放（zoom），卡片/字号/间距与主页面同比例。
    // 卡片尺寸恒定：组件放不下时不缩小，改由小组件区内部滚动（见 sidepanel.css）。
    var WIDGET_GRID_BASE_WIDTH = 240;
    var lastWidgetScale = null;

    function syncWidgetScale() {
        var wrap = document.getElementById('qa-panel-widgets');
        var grid = document.getElementById('qa-widgets-grid');
        if (!wrap || !grid) return;
        // 无小组件时不做缩放：空状态提示须按正常字号显示
        //（否则 zoom 会把提示文字放大数倍，呈现为"报错"般的大字）
        if (!getWidgetsSource().length) {
            if (lastWidgetScale !== 'empty') {
                lastWidgetScale = 'empty';
                grid.style.zoom = '';
                grid.style.width = '';
                grid.style.margin = '';
                grid.style.gridAutoRows = '';
            }
            return;
        }
        // 外层左右各 10px 内边距（外层未缩放），网格的目标可视宽度 = 面板宽 - 20
        var visualWidth = wrap.clientWidth - 20;
        if (!(visualWidth > 0)) return;
        var scale = Math.round((visualWidth / WIDGET_GRID_BASE_WIDTH) * 10000) / 10000;
        // 缩小时网格窄于面板，水平居中
        grid.style.margin = '0 auto';
        if (lastWidgetScale === scale) return;
        lastWidgetScale = scale;
        grid.style.zoom = String(scale);
        grid.style.width = WIDGET_GRID_BASE_WIDTH + 'px';
    }

    // 行高 = 列宽（与主页面 syncWidgetCardHeights 一致）
    function syncWidgetCardHeights() {
        var grid = document.getElementById('qa-widgets-grid');
        if (!grid) return;
        if (!getWidgetsSource().length) return;
        requestAnimationFrame(function () {
            if (!grid.isConnected) return;
            var gap = 8;
            // clientWidth 为缩放前的布局宽度（= 基准 240px），与卡片列宽同一坐标空间
            var colWidth = (grid.clientWidth - gap) / 2;
            if (!(colWidth > 0)) return;
            grid.style.gridAutoRows = colWidth + 'px';
        });
    }

    // ========== 数据源解析（与主页面保持一致 / 侧边栏独立配置） ==========

    function getQuickLinksSource() {
        if (settings.sidePanelQuickLinksSync) {
            return Array.isArray(settings.quickLinks) ? settings.quickLinks : [];
        }
        if (!Array.isArray(settings.sidePanelQuickLinks)) settings.sidePanelQuickLinks = [];
        return settings.sidePanelQuickLinks;
    }

    function getWidgetsSource() {
        if (settings.sidePanelWidgetsSync) {
            return (settings.widgetPanel && Array.isArray(settings.widgetPanel.widgets)) ? settings.widgetPanel.widgets : [];
        }
        if (!settings.sidePanelWidgetPanel || typeof settings.sidePanelWidgetPanel !== 'object') {
            settings.sidePanelWidgetPanel = { widgets: [] };
        }
        if (!Array.isArray(settings.sidePanelWidgetPanel.widgets)) settings.sidePanelWidgetPanel.widgets = [];
        return settings.sidePanelWidgetPanel.widgets;
    }

    // ========== 快速访问链接渲染（与主页面 renderQuickAccessSidebar 完全一致） ==========

    function extractDomain(url) {
        try {
            var u = new URL(url);
            return u.hostname;
        } catch (e) {
            return null;
        }
    }

    function cacheFavicon(link, index, domain, src) {
        if (src) {
            link._favicon = src;
        } else {
            link._favicon = '';
        }
        saveSettings();
    }

    function renderQuickAccessSidebar() {
        var sidebarLinks = document.getElementById('quick-access-sidebar-links');
        if (!sidebarLinks) return;

        sidebarLinks.innerHTML = '';

        const quickLinks = getQuickLinksSource();
        if (quickLinks.length === 0) {
            var emptyMsg = document.createElement('div');
            emptyMsg.className = 'quick-access-sidebar-empty';
            emptyMsg.textContent = '暂无快速访问链接';
            sidebarLinks.appendChild(emptyMsg);
        } else {
            quickLinks.forEach(function (link, index) {
                var linkItem = document.createElement('button');
                linkItem.className = 'quick-access-sidebar-link';
                linkItem.title = link.url;

                var iconEl = document.createElement('span');
                iconEl.className = 'quick-access-sidebar-link-icon';

                var letterEl = document.createElement('span');
                letterEl.className = 'quick-access-sidebar-link-letter';
                letterEl.textContent = link.name.charAt(0).toUpperCase();
                iconEl.appendChild(letterEl);

                var faviconImg = document.createElement('img');
                faviconImg.className = 'quick-access-sidebar-link-favicon';
                faviconImg.alt = '';
                faviconImg.style.display = 'none';

                var domain = extractDomain(link.url);
                var faviconUrl = null;
                var tryFallback = false;

                if (link._favicon !== undefined && link._favicon !== null) {
                    // _favicon 为空字符串表示之前已检测为无图标，直接用字母占位，不再重试
                    if (link._favicon !== '') {
                        faviconUrl = link._favicon;
                    }
                } else if (domain) {
                    faviconUrl = 'https://www.google.com/s2/favicons?domain=' + domain + '&sz=32';
                    tryFallback = true;
                }

                if (faviconUrl) {
                    faviconImg.src = faviconUrl;

                    var fallbackTried = false;

                    faviconImg.onerror = function () {
                        if (tryFallback && !fallbackTried && domain) {
                            fallbackTried = true;
                            this.src = 'https://icons.duckduckgo.com/ip3/' + domain + '.ico';
                            return;
                        }
                        this.style.display = 'none';
                        var letter = this.parentElement.querySelector('.quick-access-sidebar-link-letter');
                        if (letter) letter.style.display = 'flex';
                        // 仅在从未检测过时写入缓存，避免每次渲染重复回写设置
                        if (link._favicon === undefined && domain) {
                            cacheFavicon(link, index, domain, null);
                        }
                    };

                    faviconImg.onload = function () {
                        var isDefaultIcon = this.naturalWidth <= 20 || this.naturalHeight <= 20;

                        if (isDefaultIcon && link._favicon === undefined) {
                            this.style.display = 'none';
                            var letter = this.parentElement.querySelector('.quick-access-sidebar-link-letter');
                            if (letter) letter.style.display = 'flex';
                            cacheFavicon(link, index, domain, null);
                            return;
                        }

                        var letter = this.parentElement.querySelector('.quick-access-sidebar-link-letter');
                        if (letter) letter.style.display = 'none';
                        this.style.display = 'block';

                        if (link._favicon === undefined && domain) {
                            cacheFavicon(link, index, domain, this.src);
                        }
                    };
                }

                iconEl.appendChild(faviconImg);

                var textEl = document.createElement('span');
                textEl.className = 'quick-access-sidebar-link-text';
                textEl.textContent = link.name;

                linkItem.appendChild(iconEl);
                linkItem.appendChild(textEl);

                linkItem.addEventListener('click', function () {
                    openLink(link.url);
                });

                sidebarLinks.appendChild(linkItem);
            });
        }

        // 根据设置显示/隐藏图标（与主页面一致：类开关 + 内联兜底）
        var containerEl = document.getElementById('quick-access-sidebar-container');
        if (containerEl) {
            containerEl.classList.toggle('no-icons', !settings.showQuickLinkIcons);
            var linkItems = containerEl.querySelectorAll('.quick-access-sidebar-link');
            linkItems.forEach(function (item) {
                var icon = item.querySelector('.quick-access-sidebar-link-icon');
                if (icon) {
                    icon.style.display = settings.showQuickLinkIcons ? '' : 'none';
                }
            });
        }
    }

    // ========== 底部搜索框与引擎切换 ==========

    var currentEngine = localStorage.getItem('oooSidePanelEngine') === 'bing' ? 'bing' : 'google';

    function isUrlLike(text) {
        var t = text.trim();
        if (/^https?:\/\//i.test(t)) return true;
        return !/\s/.test(t) && /^[^\s]+\.[^\s]{2,}$/.test(t);
    }

    function getSearchUrl(query) {
        var enc = encodeURIComponent(query);
        return currentEngine === 'bing'
            ? 'https://www.bing.com/search?q=' + enc
            : 'https://www.google.com/search?q=' + enc;
    }

    function updateEngineButtons() {
        var googleBtn = document.getElementById('qa-google-engine');
        var bingBtn = document.getElementById('qa-bing-engine');
        if (googleBtn) googleBtn.classList.toggle('active', currentEngine === 'google');
        if (bingBtn) bingBtn.classList.toggle('active', currentEngine === 'bing');
    }

    // ========== 应用全部外观状态 ==========

    function applySectionsVisibility() {
        var widgetsSection = document.getElementById('qa-panel-widgets');
        if (widgetsSection) widgetsSection.style.display = settings.sidePanelShowWidgets ? '' : 'none';
        // 间距标记：小组件区可见时，它与链接卡的间距由小组件区底部内边距提供
        document.body.classList.toggle('qa-hide-widgets', !settings.sidePanelShowWidgets);

        var sidebar = document.getElementById('quick-access-sidebar');
        if (sidebar) sidebar.classList.toggle('active', !!settings.sidePanelShowQuickLinks);

        var search = document.getElementById('qa-panel-search');
        if (search) search.style.display = settings.sidePanelShowSearch ? '' : 'none';

        var engines = document.getElementById('qa-engine-buttons');
        if (engines) engines.style.display = (settings.sidePanelShowSearch && settings.sidePanelShowEngineButtons) ? '' : 'none';

        // 搜索框厚度：与主页面保持一致时跟随主页面的搜索框厚度设置
        var thickness = settings.sidePanelSearchSync
            ? (settings.searchBoxHeight || 50)
            : (settings.sidePanelSearchBoxHeight || 50);
        document.body.style.setProperty('--search-box-height', thickness + 'px');

        // 高度分配标记：链接区可见时小组件区最多占 50%（链接+搜索至少占 50%）；
        // 链接区隐藏时小组件可用全部剩余高度
        document.body.classList.toggle('qa-hide-links', !settings.sidePanelShowQuickLinks);
    }

    function applyAll() {
        var body = document.body;
        panelOOO.settings = settings;

        if (settings.dynamicBlur) {
            body.classList.add('dynamic-blur');
        } else {
            body.classList.remove('dynamic-blur');
        }

        if (settings.dynamicBlur && settings.enhancedDisplay) {
            body.classList.add('enhanced-display');
        } else {
            body.classList.remove('enhanced-display');
        }

        applyFont();
        applyColorScheme();
        applyPanelWallpaper();
        applySectionsVisibility();

        // 小组件仅在（解析后的）配置变化时重建，避免无关设置变更导致状态丢失
        var widgetsJson = JSON.stringify({ sync: settings.sidePanelWidgetsSync, w: getWidgetsSource() });
        if (widgetsJson !== lastWidgetsJson) {
            lastWidgetsJson = widgetsJson;
            renderWidgets();
        }

        renderQuickAccessSidebar();
        updateEngineButtons();
    }

    // ========== 交互 ==========

    function openLink(url) {
        try {
            if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
                chrome.tabs.create({ url: url, active: true });
                return;
            }
        } catch (e) { }
        window.open(url, '_blank');
    }

    function openMainPage(param) {
        var target;
        try {
            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
                target = chrome.runtime.getURL('main/index.html') + param;
            }
        } catch (e) { }
        if (!target) target = '../index.html' + param;
        openLink(target);
    }

    // 小组件区尺寸变化时重算缩放与行高：
    // 覆盖"面板拖拽调宽"与"设置里显隐切换小组件区"两种情况（后者尺寸从 0 恢复）
    function initWidgetScaleSync() {
        if (!window.ResizeObserver) return;
        var observer = new ResizeObserver(function () {
            syncWidgetScale();
            syncWidgetCardHeights();
        });
        var content = document.getElementById('qa-panel-content');
        if (content) observer.observe(content);
        var widgets = document.getElementById('qa-panel-widgets');
        if (widgets) observer.observe(widgets);
    }

    function initInteractions() {
        var addBtn = document.getElementById('quick-access-sidebar-add-btn');
        if (addBtn) {
            addBtn.addEventListener('click', function () {
                // 与主页面一致 → 打开主页面快速链接管理；独立配置 → 打开侧边栏的链接管理子视图
                if (settings.sidePanelQuickLinksSync) {
                    openMainPage('?openQuickLinks=1');
                } else {
                    openMainPage('?openSidePanel=quicklinks');
                }
            });
        }

        // 搜索框：Enter 搜索或直达网址
        var searchInput = document.getElementById('qa-search-input');
        if (searchInput) {
            searchInput.addEventListener('keydown', function (e) {
                if (e.key !== 'Enter') return;
                var value = searchInput.value.trim();
                if (!value) return;
                searchInput.value = '';
                openLink(isUrlLike(value) ? ( /^https?:\/\//i.test(value) ? value : 'https://' + value ) : getSearchUrl(value));
            });
        }

        // 引擎切换按钮
        var googleBtn = document.getElementById('qa-google-engine');
        var bingBtn = document.getElementById('qa-bing-engine');
        if (googleBtn) {
            googleBtn.addEventListener('click', function () {
                currentEngine = 'google';
                localStorage.setItem('oooSidePanelEngine', 'google');
                updateEngineButtons();
            });
        }
        if (bingBtn) {
            bingBtn.addEventListener('click', function () {
                currentEngine = 'bing';
                localStorage.setItem('oooSidePanelEngine', 'bing');
                updateEngineButtons();
            });
        }

        // 深色模式切换时重新应用配色（与主页面行为一致）
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
            isDarkMode = e.matches;
            applyColorScheme();
        });

        // 面板显示所需的设置键：只有这些键变化才需要重渲染；
        // 自己的回写与无关键（小组件数据等）的变化直接跳过，避免同步风暴
        var SYNC_KEYS = ['quickLinks', 'showQuickLinkIcons', 'enhancedDisplay', 'dynamicBlur', 'colorScheme',
            'themeColorScheme', 'customColors', 'activeCustomColorIndex', 'customPrimaryColor', 'customSecondaryColor',
            'customGradientEnabled', 'customGradientStart', 'customGradientEnd', 'font',
            'sidePanelEnabled', 'sidePanelShowWidgets', 'sidePanelShowQuickLinks', 'sidePanelShowSearch',
            'sidePanelShowEngineButtons', 'sidePanelWallpaperEnabled', 'sidePanelWallpaperSync', 'sidePanelWallpaperUrl',
            'sidePanelWidgetsSync', 'sidePanelWidgetPanel', 'sidePanelQuickLinksSync', 'sidePanelQuickLinks',
            'sidePanelSearchSync', 'sidePanelSearchBoxHeight',
            'widgetPanel', 'wallpaper', 'wallpaperUrl'];
        var syncTimer = null;
        var pendingSyncValue = null;

        function isSyncRelevant(next) {
            return SYNC_KEYS.some(function (key) {
                return JSON.stringify(next[key]) !== JSON.stringify(settings[key]);
            });
        }

        // 主页面设置变更时实时同步
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
            chrome.storage.onChanged.addListener(function (changes, areaName) {
                if (areaName !== 'local' || !changes.oooInterfaceSettings) return;
                var next = changes.oooInterfaceSettings.newValue;
                if (!next || !isSyncRelevant(next)) return;

                pendingSyncValue = next;
                clearTimeout(syncTimer);
                syncTimer = setTimeout(function () {
                    settings = mergeSettings(pendingSyncValue);
                                applyAll();
                }, 150);
            });
        }
    }

    // ========== 启动 ==========

    async function start() {
        try {
            await loadSettings();
            await loadCustomFonts();
        } catch (error) {
            // 设置加载失败时使用默认设置渲染，保证面板不至于空白
            console.error('侧边栏面板: 设置加载失败，使用默认设置:', error);
            settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
            panelOOO.settings = settings;
        }
        applyAll();
        initInteractions();
        initWidgetScaleSync();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();

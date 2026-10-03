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
        // 内置页打开：开启后搜索/访问的网页用 iframe 在面板内展示
        sidePanelBuiltinOpen: false,
        // 小组件面板配置（与主页面共用）
        widgetPanel: { enabled: true, widgets: [] }
    };

    var settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    var isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // 记录上次渲染的小组件配置，避免无关设置变化时重建小组件
    var lastWidgetsJson = null;
    var widgetInstances = [];

    // 内置页浏览器状态：是否展示、自有历史栈（iframe 跨域无法读取其历史，故自行维护）
    var browserOpen = false;
    var browserHistory = [];
    var browserIndex = -1;
    var browserCloseTimer = null;

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
        'ai-agent': { name: 'SI Agent', defaultSize: 'super', allowSquare: false, allowSuper: true },
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

    // 与主页面小组件面板保持同一观感：主页面为 2 列、网格宽 240px
    //（单列/正方形卡片 116px、间距 8px）。侧边栏铺满可用宽度，列数按宽度动态计算：
    // 面板越宽列数越多（3 列、4 列……），单列始终保持基准 116px 附近，
    // 再把整块网格按 zoom 等比缩放以铺满宽度（窄面板时缩放 <1，保证内容不溢出）。
    var WIDGET_COL_BASE = 116;   // 主页面单列（正方形卡片）宽度
    var WIDGET_GAP = 8;          // 网格间距，与 widget-panel.css 一致
    var lastWidgetScale = null;
    var currentWidgetColumns = 2;

    function syncWidgetScale() {
        var grid = document.getElementById('qa-widgets-grid');
        var scrollEl = document.getElementById('qa-widgets-scroll');
        if (!grid || !scrollEl) return;
        // 无小组件时不做缩放：空状态提示须按正常字号显示
        //（否则 zoom 会把提示文字放大数倍，呈现为"报错"般的大字）
        if (!getWidgetsSource().length) {
            if (lastWidgetScale !== 'empty') {
                lastWidgetScale = 'empty';
                currentWidgetColumns = 2;
                grid.style.zoom = '';
                grid.style.width = '';
                grid.style.margin = '';
                grid.style.gridAutoRows = '';
                grid.style.gridTemplateColumns = '';
            }
            return;
        }
        // 外框（滚动视口）的可视宽度 = 网格目标宽度
        var visualWidth = scrollEl.clientWidth;
        if (!(visualWidth > 0)) return;
        // 列数：只在可用宽度真正放得下下一列时才加列（向下取整）。
        // 首列没有前置间距，故分子要补一个间距：(宽度 + 间距) / (列宽 + 间距)；
        // 未加列时下面的 zoom 会把当前卡片等比放大铺满整宽，即"正常缩放"
        var cols = Math.max(2, Math.floor((visualWidth + WIDGET_GAP) / (WIDGET_COL_BASE + WIDGET_GAP)));
        // 该列数下网格的"设计宽度"（未缩放）：N 列 + N-1 个间距
        var localWidth = cols * WIDGET_COL_BASE + (cols - 1) * WIDGET_GAP;
        var scale = Math.round((visualWidth / localWidth) * 10000) / 10000;
        if (lastWidgetScale === scale && currentWidgetColumns === cols) return;
        lastWidgetScale = scale;
        currentWidgetColumns = cols;
        grid.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';
        grid.style.width = localWidth + 'px';
        grid.style.zoom = String(scale);
        grid.style.margin = '0 auto';
    }

    // 行高 = 列宽（与主页面 syncWidgetCardHeights 一致）。
    // 网格宽度 = N 列 × 116 + 间距、各列为 1fr，故列宽恒为基准 116px（缩放前的布局值）
    function syncWidgetCardHeights() {
        var grid = document.getElementById('qa-widgets-grid');
        if (!grid) return;
        if (!getWidgetsSource().length) return;
        grid.style.gridAutoRows = WIDGET_COL_BASE + 'px';
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

    // ========== “/” 命令系统（网址 / 翻译） ==========
    // 主页面把这套逻辑实现在 App 类里；面板是独立页面，这里按相同的语法与交互移植一份。
    // DOM 与样式仍复用主页面：styles.css 中的 search-command-container /
    // search-command-item / search-mode-chip / search-history-item 等类直接生效。

    var searchCommandMode = null;
    var translateSelectedPair = null;
    var commandListState = { visible: false, items: [], highlight: -1 };

    function escapeHtml(text) {
        return String(text === null || text === undefined ? '' : text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function getSlashCommands() {
        return [
            { name: 'web', icon: 'language', desc: '打开网页' },
            { name: 'translate', icon: 'translate', desc: '翻译文本' }
        ];
    }

    function isWebCommand(word) {
        return ['web', 'w', '网址'].indexOf((word || '').toLowerCase()) !== -1;
    }

    function isTranslateCommand(word) {
        return ['translate', 't', '翻译'].indexOf((word || '').toLowerCase()) !== -1;
    }

    // 语言别名表：sc/jp/en 等缩写映射到两家引擎各自的语言代码；key 为历史记录使用的规范键
    // （与主页面 resolveTranslateLanguage 的表保持一致）
    function getTranslateLanguages() {
        return [
            { key: 'auto', label: '自动检测', aliases: ['auto', 'a', '自动'], g: 'auto', m: 'auto-detect' },
            { key: 'sc', label: '简体中文', aliases: ['sc', 'zh-cn', 'zh', 'cn', '简体', '中文'], g: 'zh-CN', m: 'zh-Hans' },
            { key: 'tc', label: '繁体中文', aliases: ['tc', 'zh-tw', 'tw', '繁体'], g: 'zh-TW', m: 'zh-Hant' },
            { key: 'en', label: '英语', aliases: ['en', 'english', '英'], g: 'en', m: 'en' },
            { key: 'ja', label: '日语', aliases: ['jp', 'jpn', 'ja', '日'], g: 'ja', m: 'ja' },
            { key: 'ko', label: '韩语', aliases: ['kr', 'kor', 'ko', '韩'], g: 'ko', m: 'ko' },
            { key: 'fr', label: '法语', aliases: ['fr', '法'], g: 'fr', m: 'fr' },
            { key: 'de', label: '德语', aliases: ['de', '德'], g: 'de', m: 'de' },
            { key: 'ru', label: '俄语', aliases: ['ru', '俄'], g: 'ru', m: 'ru' },
            { key: 'pt', label: '葡萄牙语', aliases: ['pt', '葡'], g: 'pt', m: 'pt' },
            { key: 'it', label: '意大利语', aliases: ['it', '意'], g: 'it', m: 'it' },
            { key: 'th', label: '泰语', aliases: ['th', '泰'], g: 'th', m: 'th' },
            { key: 'vi', label: '越南语', aliases: ['vi', '越'], g: 'vi', m: 'vi' },
            { key: 'ar', label: '阿拉伯语', aliases: ['ar', '阿'], g: 'ar', m: 'ar' }
        ];
    }

    function resolveTranslateLanguage(rawCode) {
        var code = (rawCode || '').toLowerCase().trim();
        if (!code) return null;
        var table = getTranslateLanguages();
        for (var i = 0; i < table.length; i++) {
            if (table[i].key === code || table[i].aliases.indexOf(code) !== -1) return table[i];
        }
        return null;
    }

    // 解析语言对文本：'sc-jp' 或省略源语言的 'jp'
    function resolveLanguagePair(pairText) {
        var parts = (pairText || '').toLowerCase().split('-').filter(Boolean);
        if (parts.length === 0) return null;

        var fromEntry;
        var toEntry;
        if (parts.length >= 2) {
            fromEntry = resolveTranslateLanguage(parts[0]);
            toEntry = resolveTranslateLanguage(parts[1]);
        } else {
            fromEntry = resolveTranslateLanguage('auto');
            toEntry = resolveTranslateLanguage(parts[0]);
        }
        if (!fromEntry || !toEntry) return null;

        return { raw: fromEntry.key + '-' + toEntry.key, from: fromEntry, to: toEntry };
    }

    // ---- 翻译语言对 / 网址历史（localStorage，与主页面共用同一份存储） ----

    function getTranslateHistory() {
        try {
            return JSON.parse(localStorage.getItem('oooTranslateHistory') || '[]') || [];
        } catch (e) {
            return [];
        }
    }

    function setTranslateHistory(list) {
        localStorage.setItem('oooTranslateHistory', JSON.stringify(list || []));
    }

    function recordTranslateHistory(fromEntry, toEntry) {
        if (!fromEntry || !toEntry) return;
        var raw = fromEntry.key + '-' + toEntry.key;
        var list = getTranslateHistory().filter(function (item) { return item && item.pair !== raw; });
        list.unshift({ pair: raw });
        if (list.length > 12) list.length = 12;
        setTranslateHistory(list);
    }

    function getWebHistory() {
        try {
            return JSON.parse(localStorage.getItem('oooWebCommandHistory') || '[]') || [];
        } catch (e) {
            return [];
        }
    }

    function setWebHistory(list) {
        localStorage.setItem('oooWebCommandHistory', JSON.stringify(list || []));
    }

    // 记录通过命令打开的网址（存主机名用于展示，key 用于去重）
    function recordWebHistory(urlText) {
        var parsed;
        try {
            parsed = new URL(urlText);
        } catch (e) {
            return;
        }
        var rest = (parsed.pathname === '/' && !parsed.search) ? '' : parsed.pathname + parsed.search;
        var key = parsed.origin + (rest || '/');
        var list = getWebHistory().filter(function (item) { return item && item.key !== key; });
        list.unshift({ key: key, host: parsed.host.replace(/^www\./, ''), rest: rest });
        if (list.length > 12) list.length = 12;
        setWebHistory(list);
    }

    // ---- 翻译引擎（直连优先，配置了本地代理且直连抛错时走代理重试） ----

    async function slashFetch(url, options) {
        try {
            return await fetch(url, options);
        } catch (err) {
            if (typeof ProxyManager !== 'undefined' && ProxyManager.isProxyEnabled()) {
                return await ProxyManager.proxiedFetch(url, options);
            }
            throw err;
        }
    }

    async function fetchGoogleTranslate(text, sl, tl) {
        var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=' +
            encodeURIComponent(sl) + '&tl=' + encodeURIComponent(tl) + '&dt=t&q=' + encodeURIComponent(text);

        var response = await slashFetch(url);
        if (!response.ok) {
            throw new Error('Google 翻译服务响应异常 (HTTP ' + response.status + ')');
        }

        var data = await response.json();
        if (!Array.isArray(data) || !Array.isArray(data[0])) {
            throw new Error('Google 翻译结果解析失败');
        }

        return data[0].map(function (segment) {
            return (segment && segment[0]) ? segment[0] : '';
        }).join('');
    }

    // Microsoft(Bing) 免费接口：需先从 bing 首页抓取 IG 与防滥用 token
    async function getBingTranslateAuth(forceRefresh) {
        if (!forceRefresh) {
            try {
                var cached = JSON.parse(localStorage.getItem('oooBingTranslateAuth') || 'null');
                if (cached && cached.token && cached.ig && Date.now() - cached.ts < 20 * 60 * 1000) {
                    return cached;
                }
            } catch (e) { /* 缓存损坏则重新获取 */ }
        }

        var response = await slashFetch('https://www.bing.com/');
        var html = await response.text();

        var igMatch = html.match(/IG:"([^"]+)"/);
        var tokenMatch = html.match(/params_AbusePreventionHelper\s*=\s*\[\s*\d+\s*,\s*"([^"]+)"/);

        if (!igMatch || !tokenMatch) {
            throw new Error('无法获取 Microsoft 翻译凭证');
        }

        var auth = { ig: igMatch[1], token: tokenMatch[1], ts: Date.now() };
        localStorage.setItem('oooBingTranslateAuth', JSON.stringify(auth));
        return auth;
    }

    async function fetchBingTranslate(text, fromCode, toCode, forceNewAuth) {
        try {
            var auth = await getBingTranslateAuth(!!forceNewAuth);
            var body = new URLSearchParams({
                from: fromCode,
                to: toCode,
                text: text,
                token: auth.token,
                key: auth.ig
            }).toString();

            var response = await slashFetch('https://www.bing.com/ttranslatev3?isTanslateReq=true', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body
            });

            if (!response.ok) {
                throw new Error('Microsoft 翻译服务响应异常 (HTTP ' + response.status + ')');
            }

            var data = await response.json();
            if (Array.isArray(data) && data[0] && Array.isArray(data[0].translations)) {
                return data[0].translations.map(function (item) { return item.text || ''; }).join('');
            }
            throw new Error('Microsoft 翻译结果解析失败');
        } catch (err) {
            // 凭证失效等情况：强制刷新一次后重试
            if (!forceNewAuth) {
                return await fetchBingTranslate(text, fromCode, toCode, true);
            }
            throw err;
        }
    }

    // 引擎跟随面板当前选择的搜索引擎（与主页面同一套回退策略）
    async function translateText(text, fromEntry, toEntry) {
        if (currentEngine === 'bing') {
            try {
                return await fetchBingTranslate(text, fromEntry.m, toEntry.m, false);
            } catch (err) {
                console.warn('[面板翻译] Microsoft 翻译失败，回退到 Google 翻译:', err.message);
            }
        }
        return await fetchGoogleTranslate(text, fromEntry.g, toEntry.g);
    }

    // ---- 命令列表 / 模式 chip / 历史面板 UI ----

    // 统一同步搜索框辅助 UI：
    // - 组件模式（web/translate）激活时：左侧 chip 替代命令文字，下方展示对应历史
    // - 未进入模式且以“/”开头：显示命令候选列表，“/别名+空格”立即进入对应模式
    function syncSearchAssistantUI(value) {
        if (typeof value !== 'string') value = '';

        if (searchCommandMode === 'web') {
            hideSearchCommandList();
            updateSearchModeChip();
            refreshSearchDropdownPanels();
            return;
        }

        if (searchCommandMode === 'translate') {
            hideSearchCommandList();
            lockTranslatePairFromInput(value);
            updateSearchModeChip();
            refreshSearchDropdownPanels();
            return;
        }

        if (value.charAt(0) === '/') {
            // “/别名 + 空格”：把前缀替换为左侧 chip，剩余文本作为参数继续输入
            var entered = value.match(/^\/(\S+)\s([\s\S]*)$/);
            if (entered && (isWebCommand(entered[1]) || isTranslateCommand(entered[1]))) {
                var mode = isWebCommand(entered[1]) ? 'web' : 'translate';
                var input = document.getElementById('qa-search-input');
                if (input) input.value = entered[2] || '';
                enterSearchCommandMode(mode);
                if (mode === 'translate') {
                    lockTranslatePairFromInput(input ? input.value : '');
                    updateSearchModeChip();
                    refreshSearchDropdownPanels();
                }
                return;
            }

            updateSearchModeChip();
            showSearchCommandList(value);
            return;
        }

        hideSearchCommandList();
        updateSearchModeChip();
        refreshSearchDropdownPanels();
    }

    function showSearchCommandList(currentInput) {
        if ((currentInput || '').charAt(0) !== '/') {
            hideSearchCommandList();
            return;
        }

        // 只在第一个空格之前提供候选；出现空格说明已进入对应组件模式
        var partial = currentInput.slice(1);
        if (/\s/.test(partial)) {
            hideSearchCommandList();
            return;
        }

        var filter = partial.toLowerCase();
        var items = getSlashCommands().filter(function (cmd) {
            if (!filter) return true;
            if (cmd.name.toLowerCase().indexOf(filter) === 0) return true;
            var extraAliases = isWebCommand(cmd.name)
                ? ['w', '网址']
                : (isTranslateCommand(cmd.name) ? ['t', '翻译'] : []);
            return extraAliases.some(function (alias) {
                return alias.toLowerCase().indexOf(filter) === 0;
            });
        });

        if (items.length === 0) {
            hideSearchCommandList();
            return;
        }

        commandListState = { visible: true, items: items, highlight: -1 };
        renderSearchCommandItems();
        refreshSearchDropdownPanels();
    }

    function hideSearchCommandList() {
        var container = document.getElementById('qa-search-command-container');
        if (container) container.classList.remove('show');
        if (commandListState) {
            commandListState.visible = false;
            commandListState.highlight = -1;
        }
    }

    function renderSearchCommandItems() {
        var list = document.getElementById('qa-search-command-list');
        if (!list || !commandListState) return;

        list.innerHTML = '';
        commandListState.items.forEach(function (cmd, index) {
            var item = document.createElement('div');
            item.className = 'search-command-item' + (index === commandListState.highlight ? ' selected' : '');
            item.dataset.index = index;
            item.innerHTML =
                '<span class="search-command-icon material-icons">' + cmd.icon + '</span>' +
                '<div class="search-command-info">' +
                '<span class="search-command-name">/' + cmd.name + '</span>' +
                '<span class="search-command-desc">' + escapeHtml(cmd.desc) + '</span>' +
                '</div>';
            list.appendChild(item);
        });
    }

    function moveSearchCommandHighlight(delta) {
        var state = commandListState;
        if (!state || !state.visible || state.items.length === 0) return;

        var max = state.items.length - 1;
        state.highlight += delta;
        if (state.highlight > max) state.highlight = 0;
        if (state.highlight < 0) state.highlight = max;

        renderSearchCommandItems();
    }

    function applySearchCommand(cmd) {
        if (!cmd) return;
        var input = document.getElementById('qa-search-input');
        if (input) {
            input.value = '';
            input.focus();
        }
        enterSearchCommandMode(isWebCommand(cmd.name) ? 'web' : 'translate');
    }

    function enterSearchCommandMode(mode) {
        searchCommandMode = mode;
        translateSelectedPair = null;
        hideSearchCommandList();
        updateSearchModeChip();
        refreshSearchDropdownPanels();

        var input = document.getElementById('qa-search-input');
        if (input) input.focus();
    }

    // 退出组件模式；clearInput=false 时保留输入框现有内容（如翻译结果）
    function exitSearchCommandMode(clearInput) {
        searchCommandMode = null;
        translateSelectedPair = null;

        var input = document.getElementById('qa-search-input');
        if (clearInput !== false && input) input.value = '';

        updateSearchModeChip();
        hideSearchCommandList();
        refreshSearchDropdownPanels();
    }

    // 模式 chip：由组件模式状态驱动，位于输入框左侧。
    // 进入模式时放大镜图标收缩隐去、椭圆展开顶入（CSS 过渡联动），退出时反向还原
    function updateSearchModeChip() {
        var chip = document.getElementById('qa-search-mode-chip');
        if (!chip) return;

        var searchContainer = document.querySelector('.qa-panel-search .search-container');
        if (searchContainer) {
            searchContainer.classList.toggle('mode-active', !!searchCommandMode);
        }

        var iconEl = chip.querySelector('.search-mode-chip-icon');
        var textEl = chip.querySelector('.search-mode-chip-text');

        if (searchCommandMode === 'web') {
            iconEl.textContent = 'language';
            textEl.textContent = '网址';
            chip.classList.add('expanded');
        } else if (searchCommandMode === 'translate') {
            iconEl.textContent = 'translate';
            textEl.textContent = translateSelectedPair
                ? translateSelectedPair.from.label + '→' + translateSelectedPair.to.label
                : '翻译';
            chip.classList.add('expanded');
        } else {
            chip.classList.remove('expanded');
        }
    }

    // translate 模式下从输入中锁定语言对：首个空白之前的部分若可解析则锁定，并把它从输入中移除
    function lockTranslatePairFromInput(value) {
        if (translateSelectedPair || !value) return;

        var spIndex = value.search(/\s/);
        if (spIndex === -1) return; // 尚未出现空格，等待继续输入

        var pair = resolveLanguagePair(value.slice(0, spIndex));
        if (!pair) return; // 无法解析时保留原样，交由 Enter 时提示

        translateSelectedPair = pair;
        var input = document.getElementById('qa-search-input');
        if (input) input.value = value.slice(spIndex).replace(/^\s+/, '');
    }

    // 下方共享下拉面板：命令列表可见时优先；否则按当前组件模式展示使用历史。
    // 行样式复用原生搜索历史 search-history-item
    function refreshSearchDropdownPanels() {
        var container = document.getElementById('qa-search-command-container');
        if (!container) return;

        var commandVisible = !!(commandListState && commandListState.visible);

        var commandList = document.getElementById('qa-search-command-list');
        if (commandList && !commandVisible) commandList.innerHTML = '';

        var historyEntries = [];
        var historyKind = '';
        if (!commandVisible) {
            if (searchCommandMode === 'translate') {
                historyEntries = getTranslateHistory();
                historyKind = 'translate';
            } else if (searchCommandMode === 'web') {
                historyEntries = getWebHistory();
                historyKind = 'web';
            }
        }

        var historyList = document.getElementById('qa-translate-history-list');
        if (historyList) {
            historyList.innerHTML = '';

            if (historyKind === 'translate' && historyEntries.length > 0) {
                historyEntries.forEach(function (entry) {
                    if (!entry || !entry.pair) return;
                    var sides = String(entry.pair).split('-');
                    var fromE = resolveTranslateLanguage(sides[0]);
                    var toE = resolveTranslateLanguage(sides[1]);
                    var labels = (fromE ? fromE.label : sides[0]) + '→' + (toE ? toE.label : sides[1]);

                    var row = document.createElement('div');
                    row.className = 'search-history-item';
                    row.dataset.pair = entry.pair;
                    row.innerHTML =
                        '<span class="search-history-text">' + escapeHtml(entry.pair + ' · ' + labels) + '</span>' +
                        '<button class="search-history-delete" data-kind="translate" data-pair="' +
                        escapeHtml(entry.pair) + '">×</button>';
                    historyList.appendChild(row);
                });
            } else if (historyKind === 'web' && historyEntries.length > 0) {
                historyEntries.forEach(function (entry) {
                    if (!entry || !entry.host) return;

                    var row = document.createElement('div');
                    row.className = 'search-history-item';
                    row.dataset.key = entry.key || '';
                    row.innerHTML =
                        '<span class="search-history-text">' + escapeHtml(entry.host + (entry.rest || '')) + '</span>' +
                        '<button class="search-history-delete" data-kind="web" data-key="' +
                        escapeHtml(entry.key || '') + '">×</button>';
                    historyList.appendChild(row);
                });
            }
        }

        if (commandVisible || (historyList && historyList.children.length > 0)) {
            container.classList.add('show');
        } else {
            container.classList.remove('show');
        }
    }

    function applyTranslateHistoryPair(pairRaw) {
        if (searchCommandMode !== 'translate') {
            enterSearchCommandMode('translate');
        }

        var pair = resolveLanguagePair((pairRaw || '').replace(/→/g, '-'));
        if (!pair) return;

        translateSelectedPair = pair;
        updateSearchModeChip();
        refreshSearchDropdownPanels();

        var input = document.getElementById('qa-search-input');
        if (input) input.focus();
    }

    function applyWebHistoryEntry(entry) {
        if (!entry || !entry.host) return;

        if (searchCommandMode !== 'web') {
            enterSearchCommandMode('web');
        }

        var input = document.getElementById('qa-search-input');
        if (input) {
            input.value = entry.host + (entry.rest || '');
            input.focus();
        }
    }

    // ---- 执行 ----

    // 通过命令打开网址：记录历史；开启「内置页打开」时在面板 iframe 内展示，否则新标签页
    function openExternalUrl(urlText) {
        var url = (urlText || '').trim();
        if (!url) return false;
        if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

        try {
            new URL(url);
        } catch (e) {
            return false;
        }

        recordWebHistory(url);
        if (settings.sidePanelBuiltinOpen) {
            openBuiltinPage(url);
        } else {
            openLink(url);
        }
        return true;
    }

    // 翻译模式的回车执行：未锁定语言对时把首词作为语言对兜底解析
    async function executeTranslateModeQuery(rawText) {
        var text = (rawText || '').trim();
        if (!text) return;

        if (!translateSelectedPair) {
            var inlineMatch = text.match(/^(\S+)\s+([\s\S]+)$/);
            if (inlineMatch) {
                var inlinePair = resolveLanguagePair(inlineMatch[1]);
                if (inlinePair) {
                    translateSelectedPair = inlinePair;
                    updateSearchModeChip();
                    await runTranslateFlow(inlineMatch[2], inlinePair);
                    return;
                }
            }
            return;
        }

        await runTranslateFlow(text, translateSelectedPair);
    }

    // 统一翻译执行：调用引擎 → 结果输出到搜索框 → 复制 → 记录历史 → 退出模式（保留结果）
    async function runTranslateFlow(text, pair) {
        try {
            var result = await translateText(text, pair.from, pair.to);
            if (!result) throw new Error('未获得翻译结果');

            var input = document.getElementById('qa-search-input');
            if (input) input.value = result;

            recordTranslateHistory(pair.from, pair.to);
            exitSearchCommandMode(false);

            try {
                await navigator.clipboard.writeText(result);
            } catch (e) {
                console.warn('面板翻译: 复制到剪贴板失败:', e);
            }
        } catch (err) {
            console.error('面板翻译失败:', err.message);
        }
    }

    // “/” 命令语法兜底路径（正常流程中前缀在输入空格时已替换为 chip）
    async function executeSlashCommand(trimmedQuery) {
        var match = trimmedQuery.slice(1).match(/^(\S*)(?:\s+([\s\S]*))?$/);
        if (!match) return;

        var word = match[1] || '';

        if (isWebCommand(word)) {
            var url = (match[2] || '').replace(/\s+/g, '');
            if (!url) return;
            if (openExternalUrl(url)) {
                var input = document.getElementById('qa-search-input');
                if (input) input.value = '';
                exitSearchCommandMode(false);
            }
            return;
        }

        if (isTranslateCommand(word)) {
            var rest = (match[2] || '').trim();
            if (!rest) return;

            var parts = rest.match(/^(\S+)\s+([\s\S]+)$/);
            if (!parts) return;

            var pair = resolveLanguagePair(parts[1]);
            if (!pair) return;

            await runTranslateFlow(parts[2], pair);
        }
    }

    // 回车提交：分类处理组件模式 / “/” 命令，其余走搜索或直达网址
    function submitSearch(value) {
        var text = (value || '').trim();
        if (!text) return;

        var input = document.getElementById('qa-search-input');

        if (searchCommandMode === 'web') {
            if (openExternalUrl(text)) {
                if (input) input.value = '';
                exitSearchCommandMode(false);
            }
            return;
        }

        if (searchCommandMode === 'translate') {
            executeTranslateModeQuery(text);
            return;
        }

        if (text.charAt(0) === '/') {
            executeSlashCommand(text);
            hideSearchCommandList();
            return;
        }

        if (input) input.value = '';
        var target = resolveBrowserTarget(text);
        // 开启「内置页打开」时在面板内 iframe 展示，否则新标签页打开
        if (settings.sidePanelBuiltinOpen) {
            openBuiltinPage(target);
        } else {
            openLink(target);
        }
    }

    // ========== 内置页浏览器（开启「内置页打开」后，搜索/访问的网页在此以 iframe 展示） ==========

    // 移动端模式：面板窄于阈值时，把发往搜索引擎的「子帧」请求 UA 改为移动端，
    // 使其返回移动版页面。Chrome 不支持为单个 iframe 单独设置 UA，只能通过
    // DNR 会话规则实现；用 requestDomains 限定作用域，避免影响其它页面的 iframe。
    var MOBILE_UA = 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36';
    var MOBILE_UA_RULE_ID = 9001;
    var MOBILE_NARROW_MAX = 520;
    // 标准手机布局宽度：取略大于常见手机视口（Pixel 7 约 412px）的值，给移动版页面
    // 留出布局余量——站点的 min-width / 100vw（含滚动条）等固定宽元素常略超设备视口，
    // 若视口恰好等于设备宽度，超出的部分会被裁切导致右侧显示不全
    var MOBILE_VIEWPORT_WIDTH = 480;
    var MOBILE_UA_DOMAINS = ['google.com', 'bing.com'];
    var mobileUaRuleEnabled = false;
    var lastNarrowState = window.innerWidth < MOBILE_NARROW_MAX;

    function dnrAvailable() {
        try {
            return typeof chrome !== 'undefined' && !!chrome.declarativeNetRequest &&
                typeof chrome.declarativeNetRequest.updateSessionRules === 'function';
        } catch (e) {
            return false;
        }
    }

    // 依据「功能开关 + 面板宽度」同步移动端 UA 会话规则
    function syncMobileUaRule() {
        if (!dnrAvailable()) return;
        var shouldEnable = !!settings.sidePanelBuiltinOpen && window.innerWidth < MOBILE_NARROW_MAX;
        if (shouldEnable === mobileUaRuleEnabled) return;
        mobileUaRuleEnabled = shouldEnable;
        var options = shouldEnable
            ? {
                removeRuleIds: [MOBILE_UA_RULE_ID],
                addRules: [{
                    id: MOBILE_UA_RULE_ID,
                    priority: 1,
                    action: {
                        type: 'modifyHeaders',
                        requestHeaders: [
                            { header: 'user-agent', operation: 'set', value: MOBILE_UA }
                        ]
                    },
                    condition: {
                        requestDomains: MOBILE_UA_DOMAINS,
                        resourceTypes: ['sub_frame']
                    }
                }]
            }
            : { removeRuleIds: [MOBILE_UA_RULE_ID] };
        try {
            var p = chrome.declarativeNetRequest.updateSessionRules(options);
            if (p && typeof p.catch === 'function') p.catch(function () { });
        } catch (e) { }
    }

    // 窄屏移动端视口缩放：卡片宽度小于移动端设计宽度时，把 iframe 布局视口固定为
    // MOBILE_VIEWPORT_WIDTH 再等比缩放到卡片内，使移动版页面按标准手机宽度排版，
    // 避免站点 min-width 造成的横向溢出（超出屏幕边界）
    function applyMobileViewportScale() {
        // 尺寸读取与计算延后到下一帧：load / resize 回调触发时 DOM 布局可能尚未稳定，
        // 此刻读到的 clientWidth/clientHeight 会导致 scale 偏差、右侧被裁切
        requestAnimationFrame(function () {
            var card = document.getElementById('qa-browser-card');
            var frame = document.getElementById('qa-browser-frame');
            if (!card || !frame) return;
            var narrow = !!settings.sidePanelBuiltinOpen && window.innerWidth < MOBILE_NARROW_MAX;
            var cardW = card.clientWidth;
            var cardH = card.clientHeight;
            var scale = (narrow && cardW > 0 && cardW < MOBILE_VIEWPORT_WIDTH) ? cardW / MOBILE_VIEWPORT_WIDTH : 1;
            if (scale < 1) {
                card.classList.add('qa-mobile-mode');
                frame.style.width = MOBILE_VIEWPORT_WIDTH + 'px';
                // 视觉高度需等于卡片高度 => 布局高度 = 卡片高度 / scale
                frame.style.height = Math.round(cardH / scale) + 'px';
                frame.style.transform = 'scale(' + scale + ')';
            } else {
                card.classList.remove('qa-mobile-mode');
                frame.style.width = '';
                frame.style.height = '';
                frame.style.transform = '';
            }
        });
    }

    // 面板尺寸变化跨越阈值时，若内置页正打开则重新加载当前页，使 UA 立即生效
    function handlePanelResize() {
        syncMobileUaRule();
        applyMobileViewportScale();
        var narrow = window.innerWidth < MOBILE_NARROW_MAX;
        if (narrow === lastNarrowState) return;
        lastNarrowState = narrow;
        if (!browserOpen || browserIndex < 0) return;
        var frame = document.getElementById('qa-browser-frame');
        if (!frame) return;
        var url = browserHistory[browserIndex];
        // 同一 src 赋值不会触发重载，先清空再回填以强制刷新
        frame.src = 'about:blank';
        setTimeout(function () { frame.src = url; }, 0);
    }

    // 面板卸载时移除会话规则，避免规则残留影响其它页面的 iframe
    function removeMobileUaRule() {
        if (!dnrAvailable()) return;
        mobileUaRuleEnabled = false;
        try { chrome.declarativeNetRequest.updateSessionRules({ removeRuleIds: [MOBILE_UA_RULE_ID] }); } catch (e) { }
    }

    // 将输入内容解析为地址：网址直连，其余按当前引擎搜索
    function resolveBrowserTarget(text) {
        var value = (text || '').trim();
        if (!value) return '';
        return isUrlLike(value)
            ? (/^https?:\/\//i.test(value) ? value : 'https://' + value)
            : getSearchUrl(value);
    }

    function browserSetFrame(url) {
        var frame = document.getElementById('qa-browser-frame');
        if (frame) {
            // iframe 内容渲染完成后尺寸才稳定，需重算一次视口缩放，
            // 否则按加载前的卡片尺寸算出的 scale 会与实际不符
            if (!frame._scaleLoadBound) {
                frame._scaleLoadBound = true;
                frame.addEventListener('load', function () { applyMobileViewportScale(); });
            }
            frame.src = url;
        }
        var urlInput = document.getElementById('qa-browser-url');
        if (urlInput) urlInput.value = url;
    }

    function updateBrowserControls() {
        var backBtn = document.getElementById('qa-browser-back');
        var forwardBtn = document.getElementById('qa-browser-forward');
        if (backBtn) backBtn.disabled = browserIndex <= 0;
        if (forwardBtn) forwardBtn.disabled = browserIndex >= browserHistory.length - 1;
    }

    // 导航到目标地址并压入自有历史栈；push=false 用于前进/后退回放（不重复入栈）
    function browserNavigate(url, push) {
        if (!url) return;
        if (push !== false) {
            browserHistory = browserHistory.slice(0, browserIndex + 1);
            browserHistory.push(url);
            browserIndex = browserHistory.length - 1;
        }
        browserSetFrame(url);
        updateBrowserControls();
    }

    function browserBack() {
        if (browserIndex <= 0) return;
        browserIndex--;
        browserSetFrame(browserHistory[browserIndex]);
        updateBrowserControls();
    }

    function browserForward() {
        if (browserIndex >= browserHistory.length - 1) return;
        browserIndex++;
        browserSetFrame(browserHistory[browserIndex]);
        updateBrowserControls();
    }

    // 打开内置页：展示浏览器视图并播放进入动画，小组件/链接区让位
    function openBuiltinPage(url) {
        var wrap = document.getElementById('qa-panel-browser');
        if (!wrap) return;
        clearTimeout(browserCloseTimer);
        browserOpen = true;
        document.body.classList.add('qa-browser-open');
        wrap.setAttribute('aria-hidden', 'false');
        applySectionsVisibility();
        // 视图已显示，按当前卡片尺寸应用窄屏移动端视口缩放
        applyMobileViewportScale();
        // 先移除再强制回流，确保连续打开时进入动画可重放
        wrap.classList.remove('qa-browser-leave');
        wrap.classList.remove('qa-browser-enter');
        void wrap.offsetWidth;
        wrap.classList.add('qa-browser-enter');
        browserNavigate(url, true);
    }

    // 关闭内置页（Home）：播放退出动画后恢复默认视图并清空历史
    function closeBuiltinView() {
        var wrap = document.getElementById('qa-panel-browser');
        if (!wrap || !browserOpen) return;
        wrap.classList.remove('qa-browser-enter');
        wrap.classList.add('qa-browser-leave');
        clearTimeout(browserCloseTimer);
        browserCloseTimer = setTimeout(function () {
            browserOpen = false;
            document.body.classList.remove('qa-browser-open');
            wrap.classList.remove('qa-browser-leave');
            wrap.setAttribute('aria-hidden', 'true');
            var frame = document.getElementById('qa-browser-frame');
            if (frame) frame.src = 'about:blank';
            var urlInput = document.getElementById('qa-browser-url');
            if (urlInput) urlInput.value = '';
            browserHistory = [];
            browserIndex = -1;
            updateBrowserControls();
            applySectionsVisibility();
        }, 200);
    }

    // ========== 应用全部外观状态 ==========

    function applySectionsVisibility() {
        var widgetsSection = document.getElementById('qa-panel-widgets');
        // 内置页打开时，小组件/链接区让位于浏览器视图
        var widgetsVisible = settings.sidePanelShowWidgets && !browserOpen;
        if (widgetsSection) widgetsSection.style.display = widgetsVisible ? '' : 'none';
        // 间距标记：小组件区可见时，它与链接卡的间距由小组件区底部内边距提供
        document.body.classList.toggle('qa-hide-widgets', !widgetsVisible);

        var sidebar = document.getElementById('quick-access-sidebar');
        var linksVisible = !!settings.sidePanelShowQuickLinks && !browserOpen;
        if (sidebar) sidebar.classList.toggle('active', linksVisible);

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
        document.body.classList.toggle('qa-hide-links', !linksVisible);
    }

    function applyAll() {
        var body = document.body;
        panelOOO.settings = settings;

        // 「内置页打开」被关闭时，收起已打开的内置页，恢复默认视图
        if (!settings.sidePanelBuiltinOpen && browserOpen) {
            closeBuiltinView();
        }

        // 窄面板下启用移动端 UA（仅作用于搜索引擎域名的子帧请求）
        syncMobileUaRule();

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

        // 搜索框：同步 “/” 命令辅助 UI，回车按模式/命令/搜索分流
        var searchInput = document.getElementById('qa-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', function () {
                syncSearchAssistantUI(searchInput.value);
            });
            searchInput.addEventListener('focus', function () {
                syncSearchAssistantUI(searchInput.value);
            });

            // ArrowUp/Down 选择命令、Enter 插入命令、Esc/Backspace 退出模式（与主页面一致）
            searchInput.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') {
                    if ((commandListState && commandListState.visible) || searchCommandMode) {
                        e.preventDefault();
                        if (searchCommandMode) {
                            exitSearchCommandMode();
                        } else {
                            hideSearchCommandList();
                            searchInput.value = '';
                            syncSearchAssistantUI('');
                        }
                    }
                    return;
                }

                // 组件模式下按退格删除 chip：输入为空时才生效；
                // translate 已锁定语言对时先解锁语言对，再退格彻底退出
                if (e.key === 'Backspace' && searchCommandMode && searchInput.value === '') {
                    e.preventDefault();
                    if (searchCommandMode === 'translate' && translateSelectedPair) {
                        translateSelectedPair = null;
                        updateSearchModeChip();
                        refreshSearchDropdownPanels();
                    } else {
                        exitSearchCommandMode();
                    }
                    return;
                }

                if (commandListState && commandListState.visible) {
                    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                        e.preventDefault();
                        moveSearchCommandHighlight(e.key === 'ArrowDown' ? 1 : -1);
                        return;
                    }
                    if (e.key === 'Enter' && commandListState.highlight >= 0) {
                        e.preventDefault();
                        applySearchCommand(commandListState.items[commandListState.highlight]);
                        return;
                    }
                }

                if (e.key === 'Enter') {
                    e.preventDefault();
                    submitSearch(searchInput.value);
                }
            });
        }

        // 命令候选列表点击：套用对应命令
        var commandListEl = document.getElementById('qa-search-command-list');
        if (commandListEl) {
            commandListEl.addEventListener('click', function (e) {
                var item = e.target.closest('.search-command-item');
                if (!item) return;
                var index = parseInt(item.dataset.index, 10);
                if (commandListState && commandListState.items[index]) {
                    applySearchCommand(commandListState.items[index]);
                }
            });
        }

        // 翻译语言对 / 网址历史点击：删除按钮分流清理，行点击套用
        var historyListEl = document.getElementById('qa-translate-history-list');
        if (historyListEl) {
            historyListEl.addEventListener('click', function (e) {
                var deleteBtn = e.target.closest('.search-history-delete');
                if (deleteBtn) {
                    e.stopPropagation();
                    if (deleteBtn.dataset.kind === 'web') {
                        setWebHistory(getWebHistory().filter(function (x) {
                            return x && x.key !== deleteBtn.dataset.key;
                        }));
                    } else if (deleteBtn.dataset.kind === 'translate') {
                        setTranslateHistory(getTranslateHistory().filter(function (x) {
                            return x && x.pair !== deleteBtn.dataset.pair;
                        }));
                    }
                    refreshSearchDropdownPanels();
                    return;
                }

                var item = e.target.closest('.search-history-item');
                if (!item) return;

                if (item.dataset.key !== undefined) {
                    var entry = getWebHistory().filter(function (x) {
                        return x && x.key === item.dataset.key;
                    })[0];
                    if (entry) applyWebHistoryEntry(entry);
                } else {
                    applyTranslateHistoryPair(item.dataset.pair || '');
                }
            });
        }

        // 模式 chip 点击退出当前模式
        var modeChipEl = document.getElementById('qa-search-mode-chip');
        if (modeChipEl) {
            modeChipEl.addEventListener('click', function () {
                if (searchCommandMode) exitSearchCommandMode();
                if (searchInput) searchInput.focus();
            });
        }

        // 点击面板其它区域时收起命令列表
        document.addEventListener('click', function (e) {
            var container = document.getElementById('qa-search-command-container');
            if (!container) return;
            if (!container.contains(e.target) && (!searchInput || !searchInput.contains(e.target))) {
                hideSearchCommandList();
            }
        });

        // 内置页浏览器操作控件：Home（返回默认视图）/ Back / Next / 网址栏
        var browserHomeBtn = document.getElementById('qa-browser-home');
        if (browserHomeBtn) browserHomeBtn.addEventListener('click', closeBuiltinView);
        var browserBackBtn = document.getElementById('qa-browser-back');
        if (browserBackBtn) browserBackBtn.addEventListener('click', browserBack);
        var browserForwardBtn = document.getElementById('qa-browser-forward');
        if (browserForwardBtn) browserForwardBtn.addEventListener('click', browserForward);
        var browserUrlInput = document.getElementById('qa-browser-url');
        if (browserUrlInput) {
            browserUrlInput.addEventListener('keydown', function (e) {
                if (e.key !== 'Enter') return;
                var target = resolveBrowserTarget(browserUrlInput.value);
                if (!target) return;
                browserNavigate(target, true);
                browserUrlInput.blur();
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
            'sidePanelBuiltinOpen',
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
        window.addEventListener('resize', handlePanelResize);
        window.addEventListener('pagehide', removeMobileUaRule);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();

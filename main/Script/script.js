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
            wallpaperModeSearchHeight: 0,
            enhancedDisplay: false,
            wallpaperScale: false,
            contextMenuStyle: 'default',
            hideInfoPopup: { enabled: false, type: null, timestamp: null },
            badgeOpenMethod: 'both'
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

        this.init();
    }

    init() {
        this.loadSettings();

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

        this.applySettings();

        if (this.settings.wallpaper === 'bing') {
            this.fetchBingWallpaper();
        }

        this.primeWallpaperEffects();

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            this.isDarkMode = e.matches;
            this.applyLogo();
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
    }

    updateContextMenuIcons() {
        // 更新搜索历史开关图标
        const searchHistoryItem = document.querySelector('[data-action="search-history-toggle"] .md3-icon');
        if (searchHistoryItem) {
            searchHistoryItem.textContent = this.settings.searchHistory ? 'check_box' : 'check_box_outline_blank';
        }

        // 更新壁纸常显示开关图标
        const wallpaperItem = document.querySelector('[data-action="wallpaper-toggle"] .md3-icon');
        if (wallpaperItem) {
            wallpaperItem.textContent = this.settings.persistentWallpaper ? 'check_box' : 'check_box_outline_blank';
        }
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
        const hue = Math.random() * 60 + 180; // 蓝色到青色范围

        // 更高效的样式设置
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.background = `radial-gradient(circle, hsla(${hue}, 80%, 70%, 0.8) 0%, hsla(${hue}, 80%, 70%, 0) 70%)`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.boxShadow = `0 0 ${size * 2}px hsla(${hue}, 80%, 70%, 0.5)`;

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

        const colors = [
            'rgba(100, 150, 255, 0.25)',
            'rgba(100, 200, 255, 0.2)',
            'rgba(100, 255, 200, 0.2)',
            'rgba(255, 180, 120, 0.15)'
        ];

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
                    const spanEl = item.querySelector('span');
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
                    this.openSettings();
                });
            }

            if (method === 'both' || method === 'contextmenu') {
                newBadge.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    console.log('触发右键打开设置');
                    this.openSettings();
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
        if (savedSettings.wallpaperModeSearchHeight !== undefined) result.wallpaperModeSearchHeight = savedSettings.wallpaperModeSearchHeight;
        if (savedSettings.enhancedDisplay !== undefined) result.enhancedDisplay = savedSettings.enhancedDisplay;
        if (savedSettings.wallpaperScale !== undefined) result.wallpaperScale = savedSettings.wallpaperScale;
        if (savedSettings.badgeOpenMethod !== undefined) result.badgeOpenMethod = savedSettings.badgeOpenMethod;

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
        // 重置后刷新页面以显示欢迎页面
        location.reload();

        // 更新设置界面中的值
        if (document.getElementById('settings-modal').classList.contains('show')) {
            this.updateSettingsUI();
        }

        // 显示重置成功的提示
        this.showNotification('已重置');
    }

    // 显示通知
    showNotification(message) {
        // 移除已存在的通知
        const existingNotification = document.getElementById('ooo-interface-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.id = 'ooo-interface-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--surface-color);
            color: var(--text-color);
            padding: 12px 20px;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1001;
            border: 1px solid var(--border-color);
            font-family: inherit;
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateY(-10px);
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // 显示动画
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);

        // 3秒后自动隐藏
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
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
        beta.textContent = `[package.flag]Beta`;
        beta.style.cssText = `
            font-size: 14px;
            color: #000000;
            margin: 0;
            word-wrap: break-word;
        `;

        // 包ID
        const packageId = document.createElement('p');
        packageId.textContent = `[package.id]7a2f9d0c5b8e31670942abdf57c108e9`;
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

        // ESC键关闭设置窗口
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('settings-modal');
                if (modal && modal.classList.contains('show')) {
                    this.closeSettings();
                }
            }
        });

        document.getElementById('font-select').addEventListener('change', (e) => this.changeFont(e.target.value));
        document.getElementById('logo-select').addEventListener('change', (e) => this.handleLogoSelectChange(e.target.value));

        // 字体文件上传事件
        document.getElementById('font-upload').addEventListener('change', (e) => {
            this.handleFontUpload(e.target.files[0]);
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

        // URL壁纸应用按钮事件
        document.getElementById('apply-wallpaper-url').addEventListener('click', () => {
            this.handleWallpaperUrl();
        });

        // URL壁纸输入框回车事件
        document.getElementById('wallpaper-url-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleWallpaperUrl();
            }
        });

        // 必应壁纸信息提示图标点击事件
        const bingInfoIcon = document.getElementById('bing-wallpaper-info');
        if (bingInfoIcon) {
            bingInfoIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showBingTooltip();
            });
        }

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
            this.settings.searchHistory = document.getElementById('search-history-toggle').checked;
            this.settings.contextMenuStyle = document.getElementById('context-menu-style').value;

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
            this.saveSettings();
            this.closeSettings();
            this.showNotification('设置已应用');
            location.reload();
        });

        // 右键应用按钮打开/关闭开发者模式
        document.getElementById('apply-settings').addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.settings.developerMode = !this.settings.developerMode;
            this.saveSettings();
            this.updateDeveloperModeUI();
            this.applyDeveloperSettings();
            this.showNotification(this.settings.developerMode ? '开发者模式已开启' : '开发者模式已关闭');
        });

        // 恢复出厂设置按钮事件
        document.getElementById('reset-settings').addEventListener('click', () => {
            this.resetToDefaults();
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

        // 壁纸模式搜索框位置滑块事件
        document.getElementById('wallpaper-mode-search-height').addEventListener('input', (e) => {
            const value = parseInt(e.target.value) || 0;
            document.getElementById('wallpaper-mode-search-height-value').value = value;
            this.settings.wallpaperModeSearchHeight = value;
        });

        // 壁纸模式搜索框位置输入框事件
        document.getElementById('wallpaper-mode-search-height-value').addEventListener('input', (e) => {
            let value = parseInt(e.target.value) || 0;
            if (value < -300) value = -300;
            if (value > 300) value = 300;
            document.getElementById('wallpaper-mode-search-height').value = value;
            this.settings.wallpaperModeSearchHeight = value;
        });

        // 壁纸模式搜索框位置输入框滚轮事件
        document.getElementById('wallpaper-mode-search-height-value').addEventListener('wheel', (e) => {
            e.preventDefault();
            let value = parseInt(e.target.value) || 0;
            value += e.deltaY > 0 ? -1 : 1;
            if (value < -300) value = -300;
            if (value > 300) value = 300;
            e.target.value = value;
            document.getElementById('wallpaper-mode-search-height').value = value;
            this.settings.wallpaperModeSearchHeight = value;
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
                    } else if (targetId === 'wallpaper-mode-search-height') {
                        this.settings.wallpaperModeSearchHeight = parseInt(defaultValue);
                        document.getElementById('wallpaper-mode-search-height-value').value = defaultValue;
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
                this.closeSettings();
            }
        });

        // 滚轮事件 - 修改为向下滚动出现壁纸
        window.addEventListener('wheel', (e) => this.handleScroll(e), { passive: true });

        // 防止页面滚动
        window.addEventListener('keydown', (e) => {
            if (e.key === ' ' && e.target === document.body) {
                e.preventDefault();
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
                        this.saveSettings();
                        // 立即更新状态
                        updateToggleState();
                    }
                    clickCount = 0;
                }, 100);
            } else if (clickCount === 2) {
                clearTimeout(clickTimer);
                clickCount = 0;

                this.settings.hideInfoPopup = { enabled: true, type: 'permanent', timestamp: Date.now() };
                this.saveSettings();
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
                this.openSettings();
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
                    this.showNotification('已复制搜索框内容');
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
                this.showNotification('已粘贴到搜索框');
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
        this.showNotification(this.settings.searchHistory ? '搜索历史已开启' : '搜索历史已关闭');
    }

    // 切换壁纸常显示设置
    toggleWallpaperSetting() {
        this.settings.persistentWallpaper = !this.settings.persistentWallpaper;
        this.applySettings();
        this.saveSettings();
        this.updateContextMenuIcons();
        this.showNotification(this.settings.persistentWallpaper ? '壁纸常显示已开启' : '壁纸常显示已关闭');
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

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];

                // 检查文件类型
                if (file.type.startsWith('image/')) {
                    this.handleLogoUpload(file);
                } else if (file.name.endsWith('.ttf') || file.name.endsWith('.otf')) {
                    this.handleFontUpload(file);
                } else {
                    this.showNotification('不支持的文件类型');
                }
            }
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

        // 触摸设备支持
        let startTouchY;
        let touchScrollTop;

        // 触摸开始事件
        modalBody.addEventListener('touchstart', (e) => {
            // 如果触摸的是滑块、输入框或其他可交互元素，不处理
            if (e.target.tagName === 'INPUT' ||
                e.target.tagName === 'BUTTON' ||
                e.target.tagName === 'SELECT' ||
                e.target.tagName === 'TEXTAREA' ||
                e.target.closest('.slider-input') ||
                e.target.closest('input[type="range"]')) {
                return;
            }
            startTouchY = e.touches[0].pageY - modalBody.offsetTop;
            touchScrollTop = modalBody.scrollTop;
        }, { passive: false });

        // 触摸移动事件
        modalBody.addEventListener('touchmove', (e) => {
            const y = e.touches[0].pageY - modalBody.offsetTop;
            const walk = (y - startTouchY) * 2; // 滚动速度
            modalBody.scrollTop = touchScrollTop - walk;
        }, { passive: false });
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

                this.saveSettings();
                this.showNotification(`字体 "${fontName}" 上传成功`);

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
                this.showNotification('字体加载失败，请检查文件格式');
            });
        };

        reader.onerror = () => {
            this.showNotification('文件读取失败');
        };

        reader.readAsDataURL(file);
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
                this.showNotification(`Logo "${logoName}" 已存在`);
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

            this.saveSettings();
            this.showNotification(`Logo "${logoName}" 上传成功`);

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
                this.showNotification('暗色Logo上传成功');
                
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
                this.showNotification('请先选择一个自定义Logo');
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
            this.showNotification('图片文件过大（最大10MB）');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const wallpaperData = e.target.result;
            const wallpaperName = file.name.replace(/\.[^/.]+$/, "");

            // 检查是否已存在同名壁纸
            if (this.settings.customWallpapers.some(wp => wp.name === wallpaperName)) {
                this.showNotification(`壁纸 "${wallpaperName}" 已存在`);
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

            this.applySettings();
            this.saveSettings();
            this.showNotification(`壁纸 "${wallpaperName}" 上传成功`);

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

    changeWallpaper(wallpaper) {
        const wallpaperUrlGroup = document.getElementById('wallpaper-url-group');

        if (wallpaper === 'default') {
            this.settings.wallpaper = 'default';
            wallpaperUrlGroup.style.display = 'none';
        } else if (wallpaper === 'bing') {
            this.settings.wallpaper = 'bing';
            wallpaperUrlGroup.style.display = 'none';
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
            wallpaperUrlGroup.style.display = 'none';
        }
        this.saveSettings();
        this.applyWallpaper();
    }

    handleWallpaperUrl() {
        const urlInput = document.getElementById('wallpaper-url-input');
        const url = urlInput.value.trim();

        if (!url) {
            this.showNotification('请输入壁纸URL');
            return;
        }

        try {
            new URL(url);
        } catch (e) {
            this.showNotification('请输入有效的URL');
            return;
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            this.settings.wallpaper = 'url';
            this.settings.wallpaperUrl = url;
            this.applySettings();
            this.saveSettings();
            this.showNotification('壁纸已应用');
        };

        img.onerror = () => {
            this.showNotification('无法加载图片，请检查URL');
        };

        img.src = url;
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
                notify('正在获取必应壁纸' + (label ? ' (' + label + ')' : '') + '...');
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
            var result = await tryFetch(function(url) { return fetch(url); }, null);

            if (!result.ok && ProxyManager.isProxyEnabled()) {
                result = await tryFetch(function(url) { return ProxyManager.proxiedFetch(url); }, '代理');
            }

            if (!result.ok) {
                if (lastError && (lastError.message.indexOf('Failed to fetch') !== -1 || lastError.message.indexOf('NetworkError') !== -1 || lastError.message.indexOf('cors') !== -1)) {
                    if (ProxyManager.isProxyEnabled()) {
                        notify('直连和代理均失败，请确认代理服务正常运行（端口:' + ProxyManager.getProxyPort() + '）');
                    } else {
                        notify('网络请求被拦截（CORS限制）。请在开发者选项中配置代理端口，或以Chrome扩展模式加载');
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
            const selectedOption = logoSelect.querySelector(`option[value="${this.settings.logo}"]`);
            if (selectedOption) {
                logoSelectSelected.textContent = selectedOption.textContent;
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
        this.showNotification('自定义Logo已删除');
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
        this.showNotification('自定义字体已删除');
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
            const selectedOption = fontSelect.querySelector(`option[value="${this.settings.font}"]`);
            if (selectedOption) {
                fontSelectSelected.textContent = selectedOption.textContent;
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
        this.showNotification('自定义壁纸已删除');
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
            const selectedOption = wallpaperSelect.querySelector(`option[value="${this.settings.wallpaper}"]`);
            if (selectedOption) {
                wallpaperSelectSelected.textContent = selectedOption.textContent;
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
                this.showNotification('暗色Logo上传成功');
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
        this.showNotification('暗色Logo已删除');
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
            return;
        }

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
            this.showNotification('文字Logo已设置');
            
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
            this.showNotification('请输入文字');
        }
    }

    handleScroll(e) {
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
        let wallpaperUrl;
        if (this.settings.wallpaper === 'default') {
            wallpaperUrl = this.onlineBackgroundUrl;
        } else if (this.settings.wallpaper === 'bing' && this.settings.wallpaperUrl) {
            wallpaperUrl = this.settings.wallpaperUrl;
        } else if (this.settings.wallpaper === 'url' && this.settings.wallpaperUrl) {
            wallpaperUrl = this.settings.wallpaperUrl;
        } else {
            wallpaperUrl = this.settings.wallpaper;
        }

        if (wallpaperUrl) {
            const img = new Image();
            img.onload = () => {};
            img.src = wallpaperUrl;
            
            if (this.settings.wallpaper === 'default') {
                document.body.style.backgroundImage = `url('${this.onlineBackgroundUrl}')`;
            } else if ((this.settings.wallpaper === 'bing' || this.settings.wallpaper === 'url') && this.settings.wallpaperUrl) {
                document.body.style.backgroundImage = `url('${this.settings.wallpaperUrl}')`;
            } else {
                document.body.style.backgroundImage = `url('${this.settings.wallpaper}')`;
            }
            
            // 如果没有开启壁纸常显，并且不在壁纸模式，我们立即清除背景图片
            // 但是浏览器已经缓存了图片
            if (!this.settings.persistentWallpaper && !this.isScrolled) {
                setTimeout(() => {
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

        // 同步应用壁纸
        if (this.settings.wallpaper === 'default') {
            document.body.style.backgroundImage = `url('${this.onlineBackgroundUrl}')`;
        } else if ((this.settings.wallpaper === 'bing' || this.settings.wallpaper === 'url') && this.settings.wallpaperUrl) {
            document.body.style.backgroundImage = `url('${this.settings.wallpaperUrl}')`;
        } else {
            document.body.style.backgroundImage = `url('${this.settings.wallpaper}')`;
        }

        document.body.style.transition = 'none';
        document.body.style.backgroundSize = (this.settings.persistentWallpaper && this.settings.wallpaperScale) ? '100%' : '';
        document.body.style.backgroundPosition = (this.settings.persistentWallpaper && this.settings.wallpaperScale) ? 'center' : '';

        // 搜索框高度和其他样式变更
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.style.marginTop = `${this.settings.wallpaperModeSearchHeight}px`;
        }

        const engineButtons = document.querySelector('.engine-buttons');
        if (engineButtons) {
            engineButtons.style.marginTop = '';
        }

        const searchHistoryContainer = document.getElementById('search-history-container');
        if (searchHistoryContainer) {
            searchHistoryContainer.classList.remove('show');
            searchHistoryContainer.style.display = 'none';
            searchHistoryContainer.style.opacity = '0';
            searchHistoryContainer.style.pointerEvents = 'none';
        }

        const quickAccessLinks = document.getElementById('quick-access-links');
        if (quickAccessLinks) {
            quickAccessLinks.style.transform = '';
            quickAccessLinks.style.opacity = '';
            quickAccessLinks.style.pointerEvents = '';
        }

        // 壁纸缩放动画：仅在常显示模式下对已有壁纸进行连贯放大和偏移
        if (this.settings.persistentWallpaper && this.settings.wallpaperScale) {
            void document.body.offsetHeight;
            document.body.style.transition = 'background-size 0.6s cubic-bezier(0.4, 0, 0.2, 1), background-position 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            document.body.style.backgroundSize = '140%';
            document.body.style.backgroundPosition = 'center 35%';
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

        // 同步移除壁纸（不再延迟，避免壁纸在退出最后才消失）
        if (this.settings.persistentWallpaper) {
            if (this.settings.wallpaperScale) {
                void document.body.offsetHeight;
                document.body.style.transition = 'background-size 0.4s cubic-bezier(0.4, 0, 0.2, 1), background-position 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                document.body.style.backgroundSize = '100%';
                document.body.style.backgroundPosition = 'center';
                setTimeout(() => {
                    document.body.style.backgroundSize = '';
                    document.body.style.backgroundPosition = '';
                    document.body.style.transition = '';
                }, 400);
            }
        } else {
                document.body.style.backgroundImage = '';
                document.body.style.backgroundSize = '';
                document.body.style.backgroundPosition = '';
                document.body.style.transition = '';
        }

        // 恢复搜索框样式
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer && !this.settings.persistentWallpaper) {
            searchContainer.style.marginTop = '';
        }

        // 恢复搜索历史框的状态
        const searchHistoryContainer = document.getElementById('search-history-container');
        if (searchHistoryContainer) {
            searchHistoryContainer.classList.remove('show');
            searchHistoryContainer.style.display = '';
            searchHistoryContainer.style.opacity = '';
            searchHistoryContainer.style.pointerEvents = '';
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

        searchHistoryContainer.style.display = 'block';
        void searchHistoryContainer.offsetWidth;
        searchHistoryContainer.classList.add('show');

        if (quickAccessLinks) {
            quickAccessLinks.style.transform = 'translateY(1000px)';
            quickAccessLinks.style.opacity = '0';
            quickAccessLinks.style.pointerEvents = 'none';
        }

        if (engineButtons) {
            engineButtons.style.marginTop = '220px';
        }
    }

    hideSearchHistory() {
        const searchHistoryContainer = document.getElementById('search-history-container');
        const quickAccessLinks = document.getElementById('quick-access-links');
        const engineButtons = document.querySelector('.engine-buttons');

        if (searchHistoryContainer) {
            searchHistoryContainer.classList.remove('show');
            setTimeout(() => {
                if (!searchHistoryContainer.classList.contains('show')) {
                    searchHistoryContainer.style.display = 'none';
                }
            }, 200);
        }

        if (quickAccessLinks) {
            quickAccessLinks.style.transform = '';
            quickAccessLinks.style.opacity = '';
            quickAccessLinks.style.pointerEvents = '';
        }

        if (engineButtons) {
            engineButtons.style.marginTop = '';
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

    openSettings() {
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
            // 使用requestAnimationFrame确保动画在下一帧触发，更加流畅
            requestAnimationFrame(() => {
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
    }

    // 更新设置界面中的值
    updateSettingsUI() {
        const fontSelect = document.getElementById('font-select');

        // 保存当前选中的字体值
        const selectedFont = this.settings.font;

        // 设置选中的值
        fontSelect.value = selectedFont;

        // 更新其他设置
        const logoSelect = document.getElementById('logo-select');
        logoSelect.value = this.settings.logo;
        document.getElementById('text-logo-input').value = this.settings.textLogo || '';

        // 更新壁纸选择
        let wallpaperValue = 'default';
        if (this.settings.wallpaper === 'url') {
            wallpaperValue = 'url';
            document.getElementById('wallpaper-url-input').value = this.settings.wallpaperUrl || '';
            document.getElementById('wallpaper-url-group').style.display = 'flex';
            const bingGroup = document.getElementById('bing-wallpaper-group');
            if (bingGroup) bingGroup.style.display = 'flex';
        } else if (this.settings.wallpaper === 'bing') {
            wallpaperValue = 'bing';
            document.getElementById('wallpaper-url-group').style.display = 'none';
        } else if (this.settings.wallpaper !== 'default') {
            // 检查是否是自定义上传的壁纸
            const customWallpaper = this.settings.customWallpapers.find(wp => wp.data === this.settings.wallpaper);
            if (customWallpaper) {
                wallpaperValue = customWallpaper.name;
            } else {
                wallpaperValue = 'default';
            }
            document.getElementById('wallpaper-url-group').style.display = 'none';
        } else {
            document.getElementById('wallpaper-url-group').style.display = 'none';
        }

        const wallpaperSelect = document.getElementById('wallpaper-select');
        wallpaperSelect.value = wallpaperValue;

        // 更新壁纸选择框的显示文本
        const wallpaperSelectSelected = document.getElementById('wallpaper-select-selected');
        if (wallpaperSelectSelected) {
            if (wallpaperValue === 'default') {
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

        // 更新新增的设置选项
        document.getElementById('dynamic-blur-toggle').checked = this.settings.dynamicBlur;
        document.getElementById('enhanced-display-toggle').checked = this.settings.enhancedDisplay;
        document.getElementById('persistent-wallpaper-toggle').checked = this.settings.persistentWallpaper;
        document.getElementById('wallpaper-scale-toggle').checked = this.settings.wallpaperScale;
        document.getElementById('search-history-toggle').checked = this.settings.searchHistory;
        document.getElementById('hide-info-popup-toggle').checked = this.settings.hideInfoPopup.enabled;
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
            }, 350); // 等待动画完成，与CSS过渡时间匹配
        } else {
            // 直接执行后续操作，无动画
            // 移除 hiding 类
            modal.classList.remove('hiding');

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
        }
    }

    updateDeveloperModeUI() {
        const developerModeGroup = document.getElementById('developer-mode-group');
        if (developerModeGroup) {
            developerModeGroup.style.display = this.settings.developerMode ? 'block' : 'none';
        }

        if (this.settings.developerMode) {
            document.getElementById('font-size-slider').value = this.settings.fontSize;
            document.getElementById('font-size-value').value = this.settings.fontSize.toFixed(1);
            document.getElementById('font-weight-slider').value = this.settings.fontWeight;
            document.getElementById('font-weight-value').value = this.settings.fontWeight;
            document.getElementById('search-box-height').value = this.settings.searchBoxHeight;
            document.getElementById('search-box-height-value').value = this.settings.searchBoxHeight;
            document.getElementById('wallpaper-mode-search-height').value = this.settings.wallpaperModeSearchHeight;
            document.getElementById('wallpaper-mode-search-height-value').value = this.settings.wallpaperModeSearchHeight;
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
        root.style.setProperty('--base-font-size', this.settings.fontSize);
        root.style.setProperty('--base-font-weight', this.settings.fontWeight);

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
        this.settings.wallpaperModeSearchHeight = 0;
        this.settings.proxyPort = null;

        const fontSizeSlider = document.getElementById('font-size-slider');
        const fontWeightSlider = document.getElementById('font-weight-slider');
        const searchBoxHeightSlider = document.getElementById('search-box-height');
        const wallpaperModeSearchHeightSlider = document.getElementById('wallpaper-mode-search-height');

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

        if (wallpaperModeSearchHeightSlider) {
            wallpaperModeSearchHeightSlider.value = 0;
            document.getElementById('wallpaper-mode-search-height-value').value = 0;
        }

        const proxySelect = document.getElementById('proxy-select');
        const proxySelected = document.getElementById('proxy-select-selected');
        if (proxySelect) proxySelect.value = '';
        if (proxySelected) proxySelected.textContent = '不使用代理';
        ProxyManager.clearProxy();

        this.applyDeveloperSettings();
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
        this.saveSettings();
        // 不立即应用，等待用户点击应用按钮
    }

    changeLogo(logo) {
        this.settings.logo = logo;
        this.settings.logoType = 'image';
        this.userChangedLogo = true;
        this.saveSettings();
        this.applyLogo();

        // 移除应用按钮的所有logo类，保持蓝色
        this.updateApplyButtonColor();
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
    }

    // 应用右键菜单样式
    applyContextMenuStyle() {
        const contextMenuGrid = document.querySelector('.context-menu-grid');
        if (!contextMenuGrid) return;

        // 移除所有样式类
        contextMenuGrid.classList.remove('compact');

        // 添加选中的样式类
        if (this.settings.contextMenuStyle === 'compact') {
            contextMenuGrid.classList.add('compact');
        }

        // 根据Logo选择更新右键菜单配色
        this.updateContextMenuColors();
    }

    // 更新右键菜单配色
    updateContextMenuColors() {
        const contextMenu = document.getElementById('context-menu');
        if (!contextMenu) return;

        // 获取所有菜单项
        const menuItems = document.querySelectorAll('.context-menu-item');

        // 根据Logo选择设置配色
        const blackWhiteLogos = ['Apple', 'HUAWEI', 'text-logo'];
        const isCustomLogo = !blackWhiteLogos.includes(this.settings.logo) && 
                             !['default', 'auto', 'Google', 'Microsoft', 'Bing', 'Baidu', 'DuckDuckGo', 'Sogou', '360', 'Yahoo', 'Yandex'].includes(this.settings.logo);
        
        if (this.settings.logo === 'default') {
            // 默认Logo：使用绿色主题
            contextMenu.style.setProperty('--context-menu-color', '#00AE00');
            contextMenu.style.setProperty('--context-menu-text-color', 'white');
            menuItems.forEach(item => {
                item.style.setProperty('--context-menu-color', '#00AE00');
                item.style.setProperty('--context-menu-text-color', 'white');
            });
        } else if (blackWhiteLogos.includes(this.settings.logo) || isCustomLogo) {
            // Apple、Huawei、text-logo、自定义Logo：使用黑白配色
            const bgColor = this.isDarkMode ? '#ffffff' : '#000000';
            const textColor = this.isDarkMode ? '#000000' : '#ffffff';
            contextMenu.style.setProperty('--context-menu-color', bgColor);
            contextMenu.style.setProperty('--context-menu-text-color', textColor);
            menuItems.forEach(item => {
                item.style.setProperty('--context-menu-color', bgColor);
                item.style.setProperty('--context-menu-text-color', textColor);
            });
        } else {
            // 其他Logo：使用蓝色主题
            contextMenu.style.setProperty('--context-menu-color', 'var(--primary-color)');
            contextMenu.style.setProperty('--context-menu-text-color', 'white');
            menuItems.forEach(item => {
                item.style.setProperty('--context-menu-color', 'var(--primary-color)');
                item.style.setProperty('--context-menu-text-color', 'white');
            });
        }
    }

    applyDefaultWallpaper() {
        document.body.style.backgroundImage = `url('${this.onlineBackgroundUrl}')`;
    }

    applyWallpaper() {
        if (this.settings.persistentWallpaper || document.body.classList.contains('scrolled')) {
            if (this.settings.wallpaper === 'default') {
                this.applyDefaultWallpaper();
            } else if (this.settings.wallpaper === 'bing') {
                if (this.settings.wallpaperUrl) {
                    document.body.style.backgroundImage = `url('${this.settings.wallpaperUrl}')`;
                }
            } else if (this.settings.wallpaper === 'url' && this.settings.wallpaperUrl) {
                document.body.style.backgroundImage = `url('${this.settings.wallpaperUrl}')`;
            } else {
                document.body.style.backgroundImage = `url('${this.settings.wallpaper}')`;
            }
        } else {
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

        // 更新搜索引擎按钮类名
        this.updateEngineButtonClasses();
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
    // 检查是否需要显示欢迎页面 - 仅在首次安装或重置后显示
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
OOOInterface.prototype.showSettingsMenuInRightPanel = function (items, selected, hiddenSelect) {
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
    }

    rightPanelUpper.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'settings-menu-container';

    const optionsList = document.createElement('div');
    optionsList.className = 'settings-menu-options';

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
                        self.showNotification('文字Logo已设置');
                        
                        selected.textContent = '自定义文字Logo';
                        hiddenSelect.value = 'text-logo';
                        self.closeSettingsMenuInRightPanel();
                    } else {
                        self.showNotification('请输入文字');
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
                                self.showSettingsMenuInRightPanel(updatedItems, selected, hiddenSelect);
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
                        option.classList.add('selected');
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
                            self.showSettingsMenuInRightPanel(updatedItems, selected, hiddenSelect);
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
                            self.showSettingsMenuInRightPanel(updatedItems, selected, hiddenSelect);
                        }
                    });
                } else {
                    // 如果在customWallpapers中找不到，可能是DOM残留，跳过
                    return;
                }
            } else {
                // 预设壁纸，直接显示文本
                if (wallpaperValue === 'bing') {
                    // 必应壁纸特殊处理：显示文本和图标
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
                    infoIcon.style.color = '#666';
                    infoIcon.style.cursor = 'pointer';
                    infoIcon.style.opacity = '0.7';
                    infoIcon.style.marginLeft = '8px';
                    infoIcon.addEventListener('click', (e) => {
                        e.stopPropagation();
                        self.showBingTooltip();
                    });
                    contentWrapper.appendChild(infoIcon);

                    option.appendChild(contentWrapper);
                } else {
                    option.textContent = originalItem.textContent;
                }

                // 检查是否是当前选中的值
                if (wallpaperValue === 'default' && self.settings.wallpaper === 'default') {
                    option.classList.add('selected');
                } else if (wallpaperValue === 'url' && self.settings.wallpaperUrl && self.settings.wallpaper !== 'bing') {
                    option.classList.add('selected');
                } else if (wallpaperValue === 'bing' && self.settings.wallpaper === 'bing') {
                    option.classList.add('selected');
                }

                option.addEventListener('click', () => {
                    const value = option.getAttribute('data-value');
                    let text = '';
                    if (value === 'bing') {
                        text = '必应每日壁纸';
                    } else {
                        text = option.textContent;
                    }
                    selected.textContent = text;

                    hiddenSelect.value = value;
                    const event = new Event('change', { bubbles: true });
                    hiddenSelect.dispatchEvent(event);

                    self.closeSettingsMenuInRightPanel();
                });
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

        optionsList.appendChild(option);
    });

    container.appendChild(optionsList);

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
                document.getElementById('wallpaper-upload').click();
            }
        });

        buttonContainer.appendChild(plusBtn);
    }

    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'settings-menu-confirm';
    confirmBtn.textContent = '确定';

    confirmBtn.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        // 检查是否有文字Logo输入框内容需要保存
        if (menuType === 'logo') {
            const textLogoInput = document.getElementById('text-logo-input-panel');
            if (textLogoInput && textLogoInput.value.trim()) {
                const text = textLogoInput.value.trim();
                // 计算字符长度
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
                    self.settings.logoType = 'text';
                    self.settings.logo = 'text-logo';
                    self.settings.textLogo = text;
                    self.userChangedLogo = true;
                    self.applyLogo();
                    self.saveSettings();
                    self.showNotification('文字Logo已设置');
                    
                    selected.textContent = '自定义文字Logo';
                    hiddenSelect.value = 'text-logo';
                }
            }
        }
        
        self.closeSettingsMenuInRightPanel();
    };

    buttonContainer.appendChild(confirmBtn);
    container.appendChild(buttonContainer);
    rightPanelUpper.appendChild(container);
};

OOOInterface.prototype.closeSettingsMenuInRightPanel = function () {
    const rightPanelUpper = document.getElementById('right-panel-upper');
    if (!rightPanelUpper) return;

    rightPanelUpper.innerHTML = '';
    this.showDefaultRightPanelContent(rightPanelUpper);
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

    rightPanelUpper.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'settings-menu-container';

    const listContainer = document.createElement('div');
    listContainer.className = 'quick-links-list-container';
    container.appendChild(listContainer);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'settings-menu-button-container';

    const plusBtn = document.createElement('button');
    plusBtn.className = 'upload-btn settings-plus-btn';
    plusBtn.textContent = '+';
    plusBtn.title = '添加快速访问链接';

    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'settings-menu-confirm';
    confirmBtn.textContent = '确定';
    confirmBtn.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        self.closeSettingsMenuInRightPanel();
    };

    buttonContainer.appendChild(plusBtn);
    buttonContainer.appendChild(confirmBtn);
    container.appendChild(buttonContainer);

    rightPanelUpper.appendChild(container);

    this.updateQuickLinksListInMenu(listContainer);

    plusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        self.showQuickLinksAddInterface(container, listContainer, buttonContainer);
    });
};

OOOInterface.prototype.showQuickLinksAddInterface = function (container, listContainer, buttonContainer) {
    const self = this;

    listContainer.style.display = 'none';
    buttonContainer.style.display = 'none';

    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'quick-links-input-wrapper';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'setting-input';
    nameInput.id = 'quick-link-name';
    nameInput.placeholder = '网站名称';

    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.className = 'setting-input';
    urlInput.id = 'quick-link-url';
    urlInput.placeholder = '网站地址';

    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.className = 'settings-menu-button-container';

    const cancelButton = document.createElement('button');
    cancelButton.className = 'settings-menu-confirm';
    cancelButton.textContent = '取消';
    cancelButton.style.backgroundColor = 'var(--surface-color)';
    cancelButton.style.color = 'var(--text-color)';
    cancelButton.style.border = '1px solid var(--border-color)';

    const confirmAddBtn = document.createElement('button');
    confirmAddBtn.className = 'settings-menu-confirm';
    confirmAddBtn.textContent = '确定';

    const handleAdd = () => {
        const name = nameInput.value.trim();
        const url = urlInput.value.trim();

        if (!name || !url) {
            self.hideQuickLinksAddInterface(container, inputWrapper, listContainer, buttonContainer);
            return;
        }

        self.addQuickLink();
        self.updateQuickLinksListInMenu(listContainer);
        self.hideQuickLinksAddInterface(container, inputWrapper, listContainer, buttonContainer);
    };

    nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            urlInput.focus();
        }
    });

    urlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleAdd();
        }
    });

    confirmAddBtn.addEventListener('click', handleAdd);

    cancelButton.addEventListener('click', () => {
        self.hideQuickLinksAddInterface(container, inputWrapper, listContainer, buttonContainer);
    });

    buttonsWrapper.appendChild(cancelButton);
    buttonsWrapper.appendChild(confirmAddBtn);

    inputWrapper.appendChild(nameInput);
    inputWrapper.appendChild(urlInput);
    container.appendChild(inputWrapper);
    container.appendChild(buttonsWrapper);

    nameInput.focus();
};

OOOInterface.prototype.hideQuickLinksAddInterface = function (container, inputWrapper, listContainer, buttonContainer) {
    const buttonsWrapper = container.querySelector('.settings-menu-button-container:last-of-type');
    if (buttonsWrapper && buttonsWrapper !== buttonContainer) {
        container.removeChild(buttonsWrapper);
    }
    container.removeChild(inputWrapper);
    listContainer.style.display = 'flex';
    buttonContainer.style.display = 'flex';
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
            e.dataTransfer.setData('text/plain', index.toString());
            e.dataTransfer.effectAllowed = 'move';
        });

        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
        });

        item.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        item.addEventListener('drop', (e) => {
            e.preventDefault();
            const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
            const toIndex = index;

            if (fromIndex !== toIndex) {
                const links = self.settings.quickLinks;
                const [movedItem] = links.splice(fromIndex, 1);
                links.splice(toIndex, 0, movedItem);
                self.saveSettings();
                self.updateQuickLinksListInMenu(listContainer);
                self.showNotification('顺序已调整');
            }
        });
    });
};
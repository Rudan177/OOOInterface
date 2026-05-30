class OOOInterface {
    constructor() {
        // 在线图标URL配置
        this.onlineIcons = {
            'dll.png': 'https://rudan177.github.io/OOOInterface/images/dll.png',
            'dln.png': 'https://rudan177.github.io/OOOInterface/images/dln.png'
        };
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
            fontSize: 1,
            fontWeight: 400,
            searchBoxHeight: 0,
            wallpaperModeSearchHeight: 0,
            contextMenuStyle: 'default',
            hideInfoPopup: { enabled: false, type: null, timestamp: null }
        };
        
        this.currentEngine = 'google';
        this.settings = JSON.parse(JSON.stringify(this.defaultSettings)); // 深拷贝默认设置
        this.isBadgeExpanded = false;
        this.isScrolled = false;
        this.scrollTimeout = null;
        this.isAnimating = false;
        this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.isFirstRun = true;
        this.userChangedLogo = false; // 标记用户是否手动更改过Logo
        this.modalScrollHandler = null;
        
        this.init();
    }

    init() {
        this.loadSettings();
        
        // 初始化自定义下拉菜单
        this.initCustomSelect();
        
        // 初始化右键菜单
        this.initContextMenu();
        
        this.bindEvents();
        this.setupMouseScroll();
        
        // 加载自定义字体
        this.loadCustomFonts();
        
        this.applySettings();
        
        // 监听系统主题变化
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            this.isDarkMode = e.matches;
            this.applyLogo(); // 主题变化时更新Logo
        });
        
        // 连续点击底部铭牌10次打开信息界面
        let badgeClickCount = 0;
        const badge = document.getElementById('ooo-badge');
        if (badge) {
            badge.addEventListener('click', () => {
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
                    const text = item.textContent;
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
        
        // 添加双击底部铭牌打开设置页面的功能
        const badge = document.getElementById('ooo-badge');
        if (badge) {
            badge.addEventListener('dblclick', () => {
                this.openSettings();
            });
        }
        
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
        if (savedSettings.fontSize !== undefined) result.fontSize = savedSettings.fontSize;
        if (savedSettings.fontWeight !== undefined) result.fontWeight = savedSettings.fontWeight;
        if (savedSettings.searchBoxHeight !== undefined) result.searchBoxHeight = savedSettings.searchBoxHeight;
        if (savedSettings.wallpaperModeSearchHeight !== undefined) result.wallpaperModeSearchHeight = savedSettings.wallpaperModeSearchHeight;
        
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
            border-radius: 8px;
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
        // 创建弹窗容器
        const popup = document.createElement('div');
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
        version.textContent = `[component.over]5.1.2:24.3-RS42.3`;
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
        beta.textContent = `[package.flag]Release`;
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
        });
        
        searchInput.addEventListener('input', () => {
            if (this.settings.searchHistory && this.settings.searchHistoryItems.length > 0) {
                this.showSearchHistory(searchInput.value);
            }
        });

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

        // 铭牌点击事件 - 保留单击切换版本显示
        const badge = document.getElementById('ooo-badge');
        badge.addEventListener('click', () => this.toggleBadgeText());
        
        badge.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.openSettings();
        });

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
        
        // 暗色Logo上传按钮事件
        document.getElementById('dark-logo-upload-btn').addEventListener('click', () => {
            document.getElementById('dark-logo-upload').click();
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

        // 设置文字Logo事件
        document.getElementById('set-text-logo').addEventListener('click', () => {
            this.setTextLogo();
        });

        // 应用按钮事件
        document.getElementById('apply-settings').addEventListener('click', () => {
            this.settings.dynamicBlur = document.getElementById('dynamic-blur-toggle').checked;
            const oldPersistentWallpaper = this.settings.persistentWallpaper;
            this.settings.persistentWallpaper = document.getElementById('persistent-wallpaper-toggle').checked;
            this.settings.searchHistory = document.getElementById('search-history-toggle').checked;
            this.settings.contextMenuStyle = document.getElementById('context-menu-style').value;
            
            if (oldPersistentWallpaper !== this.settings.persistentWallpaper) {
                this.handlePersistentWallpaperToggle();
            }
            
            this.applySettings();
            this.saveSettings();
            this.closeSettings();
            this.showNotification('设置已应用');
            // 应用设置后刷新浏览器
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
            window.location.href = 'welc/welc.html';
        });

        // 反馈按钮事件
        document.getElementById('feedback-btn').addEventListener('contextmenu', (e) => {
            e.preventDefault();
            // 播放音频
            const audio = new Audio('images/wow.mp3');
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
            document.getElementById('font-size-value').textContent = value.toFixed(1) + 'x';
            this.settings.fontSize = value;
            this.applyDeveloperSettings();
        });

        // 字体粗细滑块事件
        document.getElementById('font-weight-slider').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('font-weight-value').textContent = value;
            this.settings.fontWeight = value;
            this.applyDeveloperSettings();
        });

        // 搜索框高度输入框事件
        document.getElementById('search-box-height').addEventListener('input', (e) => {
            const value = parseInt(e.target.value) || 0;
            this.settings.searchBoxHeight = value;
            this.applyDeveloperSettings();
        });

        // 壁纸模式搜索框高度输入框事件
        document.getElementById('wallpaper-mode-search-height').addEventListener('input', (e) => {
            const value = parseInt(e.target.value) || 0;
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
                        document.getElementById('font-size-value').textContent = defaultValue + 'x';
                    } else if (targetId === 'font-weight-slider') {
                        this.settings.fontWeight = parseInt(defaultValue);
                        document.getElementById('font-weight-value').textContent = defaultValue;
                    } else if (targetId === 'search-box-height') {
                        this.settings.searchBoxHeight = parseInt(defaultValue);
                    } else if (targetId === 'wallpaper-mode-search-height') {
                        this.settings.wallpaperModeSearchHeight = parseInt(defaultValue);
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
        window.addEventListener('wheel', (e) => this.handleScroll(e));
        
        // 防止页面滚动
        window.addEventListener('keydown', (e) => {
            if(e.key === ' ' && e.target === document.body) {
                e.preventDefault();
            }
        });

        // 右键菜单事件
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (!e.target.closest('.ooo-badge') && 
                !e.target.closest('.modal') &&
                !e.target.closest('.search-section') &&
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
        document.getElementById('text-logo-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.setTextLogo();
            }
        });
        
        // 快速访问链接相关事件
        const toggleQuickLinkInputBtn = document.getElementById('toggle-quick-link-input');
        const quickLinksInputGroup = document.getElementById('quick-links-input-group');
        const quickLinkNameInput = document.getElementById('quick-link-name');
        const quickLinkUrlInput = document.getElementById('quick-link-url');
        
        // 切换输入区域显示/隐藏或应用链接
        toggleQuickLinkInputBtn.addEventListener('click', () => {
            if (quickLinksInputGroup.style.display === 'none' || quickLinksInputGroup.style.display === '') {
                // 未展开列表时，展开列表并聚焦到名称输入框
                quickLinksInputGroup.style.display = 'flex';
                quickLinkNameInput.focus();
            } else {
                // 展开列表时，检查是否有输入内容
                const name = quickLinkNameInput.value.trim();
                const url = quickLinkUrlInput.value.trim();
                
                if (name && url) {
                    // 有输入内容，应用链接
                    this.addQuickLink();
                    // 应用后隐藏列表
                    quickLinksInputGroup.style.display = 'none';
                } else {
                    // 检查快速访问链接列表是否为空
                    if (this.settings.quickLinks.length === 0) {
                        // 列表为空，隐藏列表并提示
                        quickLinksInputGroup.style.display = 'none';
                        this.showNotification('列表为空');
                    } else {
                        // 列表不为空，直接隐藏列表
                        quickLinksInputGroup.style.display = 'none';
                    }
                }
            }
        });
        
        // 回车键聚焦URL输入框
        quickLinkNameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                quickLinkUrlInput.focus();
            }
        });
        
        // 回车键添加链接
        quickLinkUrlInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.addQuickLink();
                // 添加成功后保持输入区域显示，以便继续添加
            }
        });
        
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
            
            // 根据dynamicBlur设置决定是否等待动画完成
            if (this.settings.dynamicBlur) {
                // 等待动画完成后再隐藏
                setTimeout(() => {
                    this.contextMenu.style.display = 'none';
                }, 200);
            } else {
                // 直接隐藏，无动画
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
                // 直接打开设置页面，与右键铭牌的操作一致
                const modal = document.getElementById('settings-modal');
                modal.classList.add('show');
                
                // 禁用主页面滚动
                document.body.style.overflow = 'hidden';
                
                // 添加鼠标滚轮事件监听器，阻止事件冒泡
                this.modalScrollHandler = (e) => {
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
        const textLogoGroup = document.getElementById('text-logo-group');
        const customLogosGroup = document.getElementById('custom-logos-group');
        
        if (value === 'text-logo') {
            // 显示文字Logo输入框
            textLogoGroup.style.display = 'block';
            // 隐藏自定义Logo列表
            customLogosGroup.style.display = 'none';
            // 隐藏暗色Logo上传框
            document.getElementById('dark-logo-upload-group').style.display = 'none';
            
            // 如果已经有文字Logo内容，直接应用
            const textInput = document.getElementById('text-logo-input');
            if (textInput.value.trim()) {
                this.setTextLogo();
            }
        } else {
            // 隐藏文字Logo输入框
            textLogoGroup.style.display = 'none';
            
            // 检查是否是自定义Logo
            const isCustomLogo = this.settings.customLogos.some(logo => logo.name === value);
            if (isCustomLogo) {
                // 显示自定义Logo列表
                customLogosGroup.style.display = 'block';
                // 显示暗色Logo上传框
                document.getElementById('dark-logo-upload-group').style.display = 'block';
            } else {
                // 隐藏自定义Logo列表
                customLogosGroup.style.display = 'none';
                // 隐藏暗色Logo上传框
                document.getElementById('dark-logo-upload-group').style.display = 'none';
            }
            
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
                
                // 添加到字体选择器
                const fontSelect = document.getElementById('font-select');
                const option = document.createElement('option');
                option.value = fontName;
                option.textContent = fontName;
                fontSelect.appendChild(option);
                
                // 添加到自定义下拉菜单的select-items
                const fontSelectItems = document.getElementById('font-select-items');
                const selectItem = document.createElement('div');
                selectItem.className = 'select-item';
                selectItem.setAttribute('data-value', fontName);
                selectItem.textContent = fontName;
                fontSelectItems.appendChild(selectItem);
                
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
            
            // 添加到Logo选择器
            const logoSelect = document.getElementById('logo-select');
            const option = document.createElement('option');
            option.value = logoName;
            option.textContent = logoName;
            logoSelect.appendChild(option);
            
            // 添加到自定义下拉菜单的select-items
            const logoSelectItems = document.getElementById('logo-select-items');
            const selectItem = document.createElement('div');
            selectItem.className = 'select-item';
            selectItem.setAttribute('data-value', logoName);
            selectItem.textContent = logoName;
            logoSelectItems.appendChild(selectItem);
            
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
            const currentLogo = this.settings.logo;
            
            // 查找当前选中的自定义Logo
            const customLogo = this.settings.customLogos.find(logo => logo.name === currentLogo);
            if (customLogo) {
                customLogo.darkData = darkLogoData;
                this.saveSettings();
                this.applyLogo();
                this.showNotification('暗色Logo上传成功');
            } else {
                this.showNotification('请先选择一个自定义Logo');
            }
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
            
            const option = document.createElement('option');
            option.value = wallpaperName;
            option.textContent = wallpaperName;
            wallpaperSelect.appendChild(option);
            
            const wallpaperSelectItems = document.getElementById('wallpaper-select-items');
            const selectItem = document.createElement('div');
            selectItem.className = 'select-item';
            selectItem.setAttribute('data-value', wallpaperName);
            selectItem.textContent = wallpaperName;
            wallpaperSelectItems.appendChild(selectItem);
            
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
        } else if (wallpaper === 'url') {
            wallpaperUrlGroup.style.display = 'flex';
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
    
    // 更新自定义Logo列表显示
    updateCustomLogosList() {
        const customLogosList = document.getElementById('custom-logos-list');
        const customLogosGroup = document.getElementById('custom-logos-group');
        
        // 清空列表
        customLogosList.innerHTML = '';
        
        if (this.settings.customLogos.length > 0) {
            customLogosGroup.style.display = 'block';
            
            this.settings.customLogos.forEach((logo, index) => {
                const logoItem = document.createElement('div');
                logoItem.className = 'custom-logo-item';
                
                // 初始背景颜色为悬停颜色
                logoItem.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                
                const logoName = document.createElement('div');
                logoName.className = 'custom-logo-name';
                logoName.textContent = logo.name;
                
                const actionBtn = document.createElement('button');
                actionBtn.className = 'delete-logo-btn';
                
                if (logo.darkData) {
                    actionBtn.textContent = '删除';
                    actionBtn.addEventListener('click', () => {
                        this.deleteDarkLogo(index);
                    });
                } else {
                    actionBtn.textContent = '+';
                    actionBtn.style.backgroundColor = '#007bff';
                    actionBtn.style.color = 'white';
                    actionBtn.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.1)';
                    actionBtn.addEventListener('click', () => {
                        this.uploadDarkLogo(index);
                    });
                    
                    // 悬停效果
                    actionBtn.addEventListener('mouseover', () => {
                        actionBtn.style.backgroundColor = '#0056b3';
                        actionBtn.style.boxShadow = '0 4px 8px rgba(0, 123, 255, 0.3)';
                    });
                    
                    // 离开效果
                    actionBtn.addEventListener('mouseout', () => {
                        actionBtn.style.backgroundColor = '#007bff';
                        actionBtn.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.1)';
                    });
                }
                
                // 悬停效果（颠倒颜色逻辑）
                logoItem.addEventListener('mouseover', () => {
                    logoItem.style.backgroundColor = 'var(--surface-color)';
                });
                
                // 离开效果（颠倒颜色逻辑）
                logoItem.addEventListener('mouseout', () => {
                    logoItem.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                });
                
                logoItem.appendChild(logoName);
                logoItem.appendChild(actionBtn);
                customLogosList.appendChild(logoItem);
            });
        } else {
            customLogosGroup.style.display = 'none';
        }
    }
    
    // 删除自定义Logo
    deleteCustomLogo(index) {
        const logoName = this.settings.customLogos[index].name;
        
        // 从设置中移除
        this.settings.customLogos.splice(index, 1);
        
        // 从选择器中移除
        const logoSelect = document.getElementById('logo-select');
        const options = logoSelect.querySelectorAll('option');
        for (let i = 0; i < options.length; i++) {
            if (options[i].value === logoName) {
                logoSelect.removeChild(options[i]);
                break;
            }
        }
        
        // 如果当前使用的是被删除的Logo，则切换回默认Logo
        if (this.settings.logo === logoName) {
            this.settings.logo = 'Google';
            this.applyLogo();
        }
        
        this.updateCustomLogosList();
        this.saveSettings();
        this.showNotification('自定义Logo已删除');
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
        // 不再自动聚焦，因为列表会被隐藏
        
        // 更新列表和保存设置
        this.updateQuickLinksList();
        this.saveSettings();
    }
    
    // 更新快速访问链接列表UI
    updateQuickLinksList() {
        const quickLinksList = document.getElementById('quick-links-list');
        quickLinksList.innerHTML = '';
        
        if (this.settings.quickLinks.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.style.cssText = `
                padding: 20px;
                text-align: center;
                color: var(--text-secondary);
                font-size: 14px;
            `;
            emptyMessage.textContent = '暂无快速访问链接';
            quickLinksList.appendChild(emptyMessage);
            return;
        }
        
        this.settings.quickLinks.forEach((link, index) => {
            const linkItem = document.createElement('div');
            linkItem.className = 'quick-link-item';
            
            const linkInfo = document.createElement('div');
            linkInfo.className = 'quick-link-info';
            
            const linkName = document.createElement('div');
            linkName.className = 'quick-link-name';
            linkName.textContent = link.name;
            
            const linkUrl = document.createElement('div');
            linkUrl.className = 'quick-link-url';
            linkUrl.textContent = link.url;
            
            linkInfo.appendChild(linkName);
            linkInfo.appendChild(linkUrl);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-link-btn';
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
        
        if (text) {
            this.settings.logoType = 'text';
            this.settings.logo = 'text-logo';
            this.settings.textLogo = text;
            this.userChangedLogo = true;
            this.applyLogo();
            this.saveSettings();
            this.showNotification('文字Logo已设置');
        } else {
            this.showNotification('请输入文字');
        }
    }

    handleScroll(e) {
        if (this.isAnimating) return;
        
        // 向下滚动出现壁纸
        if (e.deltaY > 0 && !this.isScrolled) {
            this.showWallpaper();
            // 标记这是用户滚动触发的
            document.body.classList.add('user-scrolled');
        } 
        // 向上滚动恢复
        else if (e.deltaY < 0 && this.isScrolled) {
            this.restoreHomepage();
            // 移除用户滚动标记
            document.body.classList.remove('user-scrolled');
        }
    }

    showWallpaper() {
        // 如果启用了壁纸常显功能且已经显示壁纸，则直接返回
        if (this.settings.persistentWallpaper && this.isScrolled && document.body.classList.contains('user-scrolled')) {
            // 即使已经显示壁纸，也要根据设置更新动态模糊类
            if (this.settings.dynamicBlur) {
                document.body.classList.add('dynamic-blur');
            } else {
                document.body.classList.remove('dynamic-blur');
            }
            return;
        }
        
        this.isAnimating = true;
        this.isScrolled = true;
        document.body.classList.add('scrolled');
        
        // 设置壁纸模式下搜索框的高度
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.style.marginTop = `${this.settings.wallpaperModeSearchHeight}px`;
        }
        
        // 将搜索引擎切换按钮复位
        const engineButtons = document.querySelector('.engine-buttons');
        if (engineButtons) {
            engineButtons.style.marginTop = ''; // 恢复默认样式
        }
        
        // 隐藏搜索历史框并恢复其状态
        const searchHistoryContainer = document.getElementById('search-history-container');
        if (searchHistoryContainer) {
            searchHistoryContainer.classList.remove('show');
            searchHistoryContainer.style.display = 'none';
            searchHistoryContainer.style.opacity = '0';
            searchHistoryContainer.style.pointerEvents = 'none';
        }
        
        // 恢复快速访问链接的状态
        const quickAccessLinks = document.getElementById('quick-access-links');
        if (quickAccessLinks) {
            quickAccessLinks.style.transform = '';
            quickAccessLinks.style.opacity = '';
            quickAccessLinks.style.pointerEvents = '';
        }
        
        // 如果是壁纸常显功能触发的，不添加用户滚动标记
        if (!this.settings.persistentWallpaper) {
            // 标记这是用户滚动触发的
            document.body.classList.add('user-scrolled');
        }
        
        // 根据设置添加或移除动态模糊类
        if (this.settings.dynamicBlur) {
            document.body.classList.add('dynamic-blur');
            // 0.2秒后自动移除动态模糊类
            setTimeout(() => {
                document.body.classList.remove('dynamic-blur');
            }, 200);
        } else {
            document.body.classList.remove('dynamic-blur');
        }
        
        // 应用当前壁纸设置
        if (this.settings.wallpaper === 'default') {
            document.body.style.backgroundImage = "url('images/back.png')";
        } else {
            document.body.style.backgroundImage = `url('${this.settings.wallpaper}')`;
        }
        
        // 动画完成后重置标志
        setTimeout(() => {
            this.isAnimating = false;
        }, 500); // 与CSS过渡时间匹配
    }

    // 应用主页壁纸显示
    applyHomepageWallpaper() {
        if (this.settings.persistentWallpaper) {
            document.body.classList.add('homepage-wallpaper');
        } else {
            document.body.classList.remove('homepage-wallpaper');
        }
    }

    restoreHomepage() {
        if (this.isAnimating) return;
        
        // 如果启用了动态模糊，在退出壁纸模式时立即应用模糊效果
        if (this.settings.dynamicBlur) {
            document.body.classList.add('dynamic-blur');
            // 0.2秒后自动移除动态模糊类
            setTimeout(() => {
                document.body.classList.remove('dynamic-blur');
            }, 200);
        } else {
            document.body.classList.remove('dynamic-blur');
        }
        
        this.isAnimating = true;
        this.isScrolled = false;
        document.body.classList.remove('scrolled');
        
        // 移除用户滚动标记
        document.body.classList.remove('user-scrolled');
        
        // 如果未启用壁纸常显功能，则移除背景图片，恢复纯色背景
        if (!this.settings.persistentWallpaper) {
            document.body.style.backgroundImage = '';
        }
        
        // 恢复普通模式下的搜索框样式
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer && !this.settings.persistentWallpaper) {
            searchContainer.style.marginTop = ''; // 移除动态设置的margin-top，恢复CSS默认值
        }
        
        // 恢复搜索历史框的状态
        const searchHistoryContainer = document.getElementById('search-history-container');
        if (searchHistoryContainer) {
            searchHistoryContainer.classList.remove('show');
            searchHistoryContainer.style.display = '';
            searchHistoryContainer.style.opacity = '';
            searchHistoryContainer.style.pointerEvents = '';
        }
        
        // 动画完成后重置标志
        setTimeout(() => {
            this.isAnimating = false;
        }, 500); // 与CSS过渡时间匹配
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
        if (this.isBadgeExpanded) {
            badge.innerHTML = '<span>OOOInterface</span><div id="info-indicator" class="info-indicator"></div>';
        } else {
            badge.innerHTML = 'OOOInterface(5.1.2:24-RS42.2)<div id="info-indicator" class="info-indicator"></div>';
        }
        this.isBadgeExpanded = !this.isBadgeExpanded;
    }

    openSettings() {
        const modal = document.getElementById('settings-modal');
        
        // 先设置display属性，让浏览器渲染元素
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        
        // 禁用主页面滚动
        document.body.style.overflow = 'hidden';
        
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
            // 短暂延迟后添加show类，触发动画
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
        } else {
            // 添加no-animation类，禁用动画
            if (modalContent) modalContent.classList.add('no-animation');
            // 直接添加show类，无动画
            modal.classList.add('show');
        }
        
        // 根据当前Logo类型显示/隐藏文字Logo输入框
        if (this.settings.logo === 'text-logo') {
            document.getElementById('text-logo-group').style.display = 'block';
            document.getElementById('custom-logos-group').style.display = 'none';
        } else {
            document.getElementById('text-logo-group').style.display = 'none';
            const isCustomLogo = this.settings.customLogos.some(logo => logo.name === this.settings.logo);
            if (isCustomLogo) {
                document.getElementById('custom-logos-group').style.display = 'block';
            } else {
                document.getElementById('custom-logos-group').style.display = 'none';
            }
        }
    }

    // 更新设置界面中的值
    updateSettingsUI() {
        const fontSelect = document.getElementById('font-select');
        
        // 保存当前选中的字体值
        const selectedFont = this.settings.font;
        
        // 先清除所有自定义字体选项，避免重复添加
        const customFontOptions = fontSelect.querySelectorAll('option[data-custom="true"]');
        customFontOptions.forEach(option => option.remove());
        
        // 添加自定义字体到字体选择器
        this.settings.customFonts.forEach(font => {
            const option = document.createElement('option');
            option.value = font.name;
            option.textContent = font.name;
            option.setAttribute('data-custom', 'true');
            fontSelect.appendChild(option);
        });
        
        // 设置选中的值
        fontSelect.value = selectedFont;
        
        // 更新其他设置
        const logoSelect = document.getElementById('logo-select');
        
        // 先清除所有自定义Logo选项，避免重复添加
        const customLogoOptions = logoSelect.querySelectorAll('option[data-custom="true"]');
        customLogoOptions.forEach(option => option.remove());
        
        // 添加自定义Logo到Logo选择器
        this.settings.customLogos.forEach(logo => {
            const option = document.createElement('option');
            option.value = logo.name;
            option.textContent = logo.name;
            option.setAttribute('data-custom', 'true');
            logoSelect.appendChild(option);
        });
        
        logoSelect.value = this.settings.logo;
        document.getElementById('text-logo-input').value = this.settings.textLogo || '';
        
        // 更新壁纸选择
        let wallpaperValue = 'default';
        if (this.settings.wallpaper === 'url') {
            wallpaperValue = 'url';
            document.getElementById('wallpaper-url-input').value = this.settings.wallpaperUrl || '';
            document.getElementById('wallpaper-url-group').style.display = 'flex';
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
        // 先清除所有自定义壁纸选项，避免重复添加
        const customWallpaperOptions = wallpaperSelect.querySelectorAll('option[data-custom="true"]');
        customWallpaperOptions.forEach(option => option.remove());
        
        // 添加自定义壁纸到壁纸选择器
        this.settings.customWallpapers.forEach(wp => {
            const option = document.createElement('option');
            option.value = wp.name;
            option.textContent = wp.name;
            option.setAttribute('data-custom', 'true');
            wallpaperSelect.appendChild(option);
        });
        
        wallpaperSelect.value = wallpaperValue;
        
        // 更新右键菜单样式
        document.getElementById('context-menu-style').value = this.settings.contextMenuStyle;
        
        // 更新新增的设置选项
        document.getElementById('dynamic-blur-toggle').checked = this.settings.dynamicBlur;
        document.getElementById('persistent-wallpaper-toggle').checked = this.settings.persistentWallpaper;
        document.getElementById('search-history-toggle').checked = this.settings.searchHistory;
        
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
                // 先清除所有自定义选项
                const customItems = selectItems.querySelectorAll('.select-item[data-custom="true"]');
                customItems.forEach(item => item.remove());
                
                // 添加自定义选项
                const customOptions = select.querySelectorAll('option[data-custom="true"]');
                customOptions.forEach(option => {
                    const selectItem = document.createElement('div');
                    selectItem.className = 'select-item';
                    selectItem.setAttribute('data-value', option.value);
                    selectItem.setAttribute('data-custom', 'true');
                    selectItem.textContent = option.textContent;
                    selectItems.appendChild(selectItem);
                });
            }
        };
        
        // 更新每个自定义下拉菜单
        updateCustomSelectDisplay('font-select', selectedFont);
        updateCustomSelectDisplay('logo-select', this.settings.logo);
        updateCustomSelectDisplay('wallpaper-select', wallpaperValue);
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
        
        // 添加退出动画
        modal.classList.remove('show');
        
        // 根据dynamicBlur设置决定是否等待动画完成
        if (this.settings.dynamicBlur) {
            // 等待动画完成后再执行后续操作
            setTimeout(() => {
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
            }, 300); // 等待动画完成，与CSS过渡时间匹配
        } else {
            // 直接执行后续操作，无动画
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
        }
    }

    updateDeveloperModeUI() {
        const developerModeGroup = document.getElementById('developer-mode-group');
        if (developerModeGroup) {
            developerModeGroup.style.display = this.settings.developerMode ? 'block' : 'none';
        }
        
        if (this.settings.developerMode) {
            document.getElementById('font-size-slider').value = this.settings.fontSize;
            document.getElementById('font-size-value').textContent = this.settings.fontSize.toFixed(1) + 'x';
            document.getElementById('font-weight-slider').value = this.settings.fontWeight;
            document.getElementById('font-weight-value').textContent = this.settings.fontWeight;
            document.getElementById('search-box-height').value = this.settings.searchBoxHeight;
            document.getElementById('wallpaper-mode-search-height').value = this.settings.wallpaperModeSearchHeight;
        }
    }

    applyDeveloperSettings() {
        const root = document.documentElement;
        root.style.setProperty('--base-font-size', this.settings.fontSize);
        root.style.setProperty('--base-font-weight', this.settings.fontWeight);
        
        if (this.settings.searchBoxHeight > 0) {
            root.style.setProperty('--search-box-height', this.settings.searchBoxHeight + 'px');
        } else {
            root.style.setProperty('--search-box-height', '50px');
        }
    }

    resetDeveloperSettings() {
        this.settings.fontSize = 1;
        this.settings.fontWeight = 400;
        this.settings.searchBoxHeight = 0;
        this.settings.wallpaperModeSearchHeight = 0;
        
        const fontSizeSlider = document.getElementById('font-size-slider');
        const fontWeightSlider = document.getElementById('font-weight-slider');
        const searchBoxHeightInput = document.getElementById('search-box-height');
        const wallpaperModeSearchHeightInput = document.getElementById('wallpaper-mode-search-height');
        
        if (fontSizeSlider) {
            fontSizeSlider.value = 1;
            document.getElementById('font-size-value').textContent = '1x';
        }
        
        if (fontWeightSlider) {
            fontWeightSlider.value = 400;
            document.getElementById('font-weight-value').textContent = '400';
        }
        
        if (searchBoxHeightInput) {
            searchBoxHeightInput.value = 0;
        }
        
        if (wallpaperModeSearchHeightInput) {
            wallpaperModeSearchHeightInput.value = 0;
        }
        
        this.applyDeveloperSettings();
        this.saveSettings();
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
        this.applyHideInfoPopup();
        
        // 初始化badge文本
        const badge = document.getElementById('ooo-badge');
        if (badge) {
            badge.textContent = 'OOOInterface';
        }
        
        // 处理动态模糊设置
        if (this.settings.dynamicBlur) {
            document.body.classList.add('dynamic-blur');
        } else {
            document.body.classList.remove('dynamic-blur');
        }
        
        // 处理壁纸常显设置
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
        if (this.settings.logo === 'default') {
            // 默认Logo：使用绿色主题
            contextMenu.style.setProperty('--context-menu-color', '#00AE00');
            menuItems.forEach(item => {
                item.style.setProperty('--context-menu-color', '#00AE00');
            });
        } else {
            // 其他Logo：使用蓝色主题
            contextMenu.style.setProperty('--context-menu-color', 'var(--primary-color)');
            menuItems.forEach(item => {
                item.style.setProperty('--context-menu-color', 'var(--primary-color)');
            });
        }
    }

    applyHideInfoPopup() {
        const infoIframe = document.querySelector('.info-iframe-container');
        const infoIndicator = document.getElementById('info-indicator');

        if (this.isHideInfoPopupActive()) {
            infoIframe.style.opacity = '0';
            infoIframe.style.pointerEvents = 'none';
            if (infoIndicator) infoIndicator.classList.remove('visible');
            return;
        }

        this._infoIframeClosed = false;
        this._infoIframeHasContent = false;

        infoIframe.style.opacity = '';
        infoIframe.style.pointerEvents = '';
        const baseUrl = 'info/info.html';
        const timestamp = Date.now();
        const dynamicBlur = this.settings.dynamicBlur ? '1' : '0';
        infoIframe.src = `${baseUrl}?t=${timestamp}&blur=${dynamicBlur}`;

        if (infoIndicator) {
            infoIndicator.classList.remove('visible');
        }
        infoIframe.classList.add('has-content');

        this.initInfoPopupHover();

        clearTimeout(this._infoIframeLoadTimeout);
        this._infoIframeLoadTimeout = setTimeout(() => {
            if (!this._infoIframeClosed && !this._infoIframeHasContent) {
                if (infoIndicator) {
                    infoIndicator.classList.add('visible');
                }
                this.updateInfoIndicatorColor(infoIndicator);
            }
        }, 1500);
    }

    checkIframeContent(iframe, indicator) {
        if (!indicator) return;

        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            const body = iframeDoc.body;
            const hasContent = body && body.innerHTML.trim() !== '' && body.innerText.trim() !== '';

            if (hasContent) {
                indicator.style.display = 'block';
                iframe.classList.add('has-content');
            } else {
                indicator.style.display = 'block';
                iframe.classList.add('has-content');
            }
        } catch (e) {
            indicator.style.display = 'block';
            iframe.classList.add('has-content');
        }
    }

    updateInfoIndicatorColor(indicator) {
        if (!indicator) return;

        const isVisible = indicator.classList.contains('visible');
        indicator.className = 'info-indicator';
        if (isVisible) indicator.classList.add('visible');

        const logoColorMap = {
            'default': 'default',
            'Google': 'google',
            'Microsoft': 'microsoft',
            'Apple': 'apple',
            'HUAWEI': 'huawei',
            'text-logo': 'text-logo'
        };

        const blackWhiteLogos = ['Apple', 'HUAWEI', 'text-logo'];
        const presetLogos = ['default', 'auto', 'Google', 'Microsoft', 'Bing', 'Baidu', 'DuckDuckGo', 'Sogou', '360', 'Yahoo', 'Yandex'];
        const isCustomLogo = !blackWhiteLogos.includes(this.settings.logo) && !presetLogos.includes(this.settings.logo);
        
        let colorClass;
        if (isCustomLogo) {
            colorClass = 'text-logo';
        } else {
            colorClass = logoColorMap[this.settings.logo] || 'default';
        }
        
        indicator.classList.add(colorClass);
    }

    refreshInfoIndicator() {
        const infoIframe = document.querySelector('.info-iframe-container');
        const infoIndicator = document.getElementById('info-indicator');

        if (!infoIframe || !infoIndicator) return;

        if (this.isHideInfoPopupActive()) {
            infoIndicator.classList.remove('visible');
            return;
        }

        if (this._infoIframeClosed) {
            infoIndicator.classList.remove('visible');
            return;
        }

        infoIndicator.classList.add('visible');
        this.updateInfoIndicatorColor(infoIndicator);
    }

    initInfoPopupHover() {
        const badge = document.getElementById('ooo-badge');
        const infoIframe = document.querySelector('.info-iframe-container');
        const infoIndicator = document.getElementById('info-indicator');

        if (!badge || !infoIframe) return;

        if (this._infoHoverInitialized) return;
        this._infoHoverInitialized = true;

        let hoverTimeout = null;

        const showIframe = () => {
            if (this._infoIframeClosed) return;
            hoverTimeout = setTimeout(() => {
                if (infoIframe.classList.contains('has-content')) {
                    infoIframe.style.opacity = '';
                    infoIframe.style.pointerEvents = '';
                    if (this.settings.dynamicBlur) {
                        infoIframe.classList.remove('hiding-advanced');
                        void infoIframe.offsetWidth;
                        infoIframe.classList.add('show-advanced');
                    } else {
                        infoIframe.classList.add('show');
                    }
                }
            }, 200);
        };

        const hideIframe = () => {
            clearTimeout(hoverTimeout);
            this._infoIframeClosed = true;
            if (infoIndicator) infoIndicator.classList.remove('visible');
            if (this.settings.dynamicBlur) {
                infoIframe.classList.remove('show-advanced');
                infoIframe.classList.add('hiding-advanced');
                setTimeout(() => {
                    infoIframe.classList.remove('hiding-advanced');
                    infoIframe.style.opacity = '0';
                    infoIframe.style.pointerEvents = 'none';
                    this.refreshInfoIndicator();
                }, 400);
            } else {
                infoIframe.classList.remove('show');
                infoIframe.style.opacity = '0';
                infoIframe.style.pointerEvents = 'none';
                this.refreshInfoIndicator();
            }
        };

        badge.addEventListener('mouseenter', () => {
            if (!infoIframe.classList.contains('show') && !infoIframe.classList.contains('show-advanced')) {
                showIframe();
            }
        });

        window.addEventListener('message', (event) => {
            if (event.data === 'closeInfoIframe' || event.data?.type === 'closeInfoIframe') {
                hideIframe();
            }
            if (event.data === 'noContent') {
                clearTimeout(this._infoIframeLoadTimeout);
                this._infoIframeClosed = true;
                this._infoIframeHasContent = true;
                if (infoIndicator) infoIndicator.classList.remove('visible');
                infoIframe.style.opacity = '0';
                infoIframe.style.pointerEvents = 'none';
                infoIframe.classList.remove('has-content');
            }
        });
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

    applyWallpaper() {
        if (this.settings.persistentWallpaper || document.body.classList.contains('scrolled')) {
            if (this.settings.wallpaper === 'default') {
                document.body.style.backgroundImage = "url('images/back.png')";
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
            // 启用壁纸常显功能时，应用壁纸但不锁定到壁纸模式
            this.applyWallpaper();
        } else {
            // 禁用壁纸常显功能时，如果当前不在壁纸模式，则移除背景图片
            if (!this.isScrolled) {
                document.body.style.backgroundImage = '';
            }
        }
    }

    applyFont() {
        // 移除所有字体类
        const fontClasses = ['font-ginto', 'font-josefin', 'font-code'];
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
            switch(this.settings.font) {
                case 'Ginto':
                    document.body.classList.add('font-ginto');
                    break;
                case 'Josefin':
                    document.body.classList.add('font-josefin');
                    break;
                case 'Code':
                    document.body.classList.add('font-code');
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
        
        
        // 更新右键菜单配色
        this.updateContextMenuColors();
        
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
            switch(this.settings.font) {
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
        new OOOInterface();
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
OOOInterface.prototype.showSettingsMenuInRightPanel = function(items, selected, hiddenSelect) {
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
        option.textContent = originalItem.textContent;
        
        if (hiddenSelect.value === originalItem.getAttribute('data-value')) {
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
        self.closeSettingsMenuInRightPanel();
    };
    
    buttonContainer.appendChild(confirmBtn);
    container.appendChild(buttonContainer);
    rightPanelUpper.appendChild(container);
};

OOOInterface.prototype.closeSettingsMenuInRightPanel = function() {
    const rightPanelUpper = document.getElementById('right-panel-upper');
    if (!rightPanelUpper) return;
    
    rightPanelUpper.innerHTML = '';
    this.showDefaultRightPanelContent(rightPanelUpper);
};

OOOInterface.prototype.showDefaultRightPanelContent = function(rightPanelUpper) {
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

OOOInterface.prototype.initSettingsMenus = function() {
    const rightPanelUpper = document.getElementById('right-panel-upper');
    if (rightPanelUpper) {
        this.showDefaultRightPanelContent(rightPanelUpper);
    }
};
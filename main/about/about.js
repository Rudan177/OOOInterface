// 右键菜单功能
class ContextMenu {
    constructor() {
        this.menu = null;
        this.targetElement = null;
        this.isInputFocused = false;
        this.hasSelectedText = false;
        this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.init();
    }

    init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.loadMenu();
                this.attachEventListeners();
            });
        } else {
            this.loadMenu();
            this.attachEventListeners();
        }
    }

    attachEventListeners() {
        // 监听右键点击事件
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.handleContextMenu(e);
        });

        // 监听点击事件以关闭菜单
        document.addEventListener('click', () => {
            this.hideMenu();
        });

        // 监听文本选择变化
        document.addEventListener('selectionchange', () => {
            this.updateSelectedTextStatus();
        });

        // 监听系统深浅色模式变化
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            this.isDarkMode = e.matches;
            this.updateMenuTheme();
        });
    }

    updateMenuTheme() {
        if (!this.menu) return;
        
        // 可以在这里添加主题切换的动画效果
        this.menu.style.transition = 'background-color 0.3s, color 0.3s';
    }

    loadMenu() {
        // 直接获取页面中的右键菜单
        this.menu = document.getElementById('contextMenu');
        this.attachMenuItemListeners();
    }

    handleContextMenu(e) {
        if (!this.menu) return;

        // 记录目标元素
        this.targetElement = e.target;

        // 检查是否在输入框内
        this.isInputFocused = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';

        // 检查是否有选中文字
        this.hasSelectedText = window.getSelection().toString().trim() !== '';

        // 更新菜单项状态
        this.updateMenuItemStates();

        // 显示菜单
        this.showMenu(e.clientX, e.clientY);
    }

    updateMenuItemStates() {
        const selectAllItem = this.menu.querySelector('[data-action="selectAll"]');
        const copyItem = this.menu.querySelector('[data-action="copy"]');
        const pasteItem = this.menu.querySelector('[data-action="paste"]');

        // 全选：仅在输入框内可用
        if (this.isInputFocused) {
            selectAllItem.classList.remove('disabled');
        } else {
            selectAllItem.classList.add('disabled');
        }

        // 复制：仅当有选中文字时可用
        if (this.hasSelectedText) {
            copyItem.classList.remove('disabled');
        } else {
            copyItem.classList.add('disabled');
        }

        // 粘贴：仅在输入框内可用
        if (this.isInputFocused) {
            pasteItem.classList.remove('disabled');
        } else {
            pasteItem.classList.add('disabled');
        }
    }

    updateSelectedTextStatus() {
        this.hasSelectedText = window.getSelection().toString().trim() !== '';
    }

    showMenu(x, y) {
        if (!this.menu) return;

        // 设置菜单位置
        this.menu.style.display = 'block';
        this.menu.style.left = `${x}px`;
        this.menu.style.top = `${y}px`;

        // 确保菜单不超出视口
        this.adjustMenuPosition();
    }

    adjustMenuPosition() {
        if (!this.menu) return;

        const menuRect = this.menu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // 水平调整
        if (menuRect.right > viewportWidth) {
            this.menu.style.left = `${viewportWidth - menuRect.width - 10}px`;
        }

        // 垂直调整
        if (menuRect.bottom > viewportHeight) {
            this.menu.style.top = `${viewportHeight - menuRect.height - 10}px`;
        }
    }

    hideMenu() {
        if (this.menu) {
            this.menu.style.display = 'none';
        }
    }

    attachMenuItemListeners() {
        if (!this.menu) return;

        // 菜单项点击事件
        this.menu.querySelectorAll('.context-menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = item.dataset.action;
                this.handleAction(action);
                this.hideMenu();
            });
        });
    }

    handleAction(action) {
        switch (action) {
            case 'back':
                this.handleBack();
                break;
            case 'refresh':
                this.handleRefresh();
                break;
            case 'selectAll':
                this.handleSelectAll();
                break;
            case 'copy':
                this.handleCopy();
                break;
            case 'paste':
                this.handlePaste();
                break;
        }
    }

    handleBack() {
        // 导航到主页面
        window.location.href = '/main/index.html';
    }

    handleRefresh() {
        // 刷新当前页面
        window.location.reload();
    }

    handleSelectAll() {
        if (!this.isInputFocused || !this.targetElement) return;

        // 全选输入框内容
        this.targetElement.select();
    }

    handleCopy() {
        if (!this.hasSelectedText) return;

        // 复制选中的文本
        const selectedText = window.getSelection().toString();
        navigator.clipboard.writeText(selectedText)
            .then(() => {
                console.log('文本已复制到剪贴板');
            })
            .catch(err => {
                console.error('复制失败:', err);
            });
    }

    handlePaste() {
        if (!this.isInputFocused || !this.targetElement) return;

        // 粘贴文本到输入框
        navigator.clipboard.readText()
            .then(text => {
                this.targetElement.value += text;
            })
            .catch(err => {
                console.error('粘贴失败:', err);
            });
    }
}

// 初始化右键菜单
new ContextMenu();

// 双信息页面板块功能
class DoubleInfoPage {
    constructor() {
        this.isActive = false;
        this.originalContent = null;
        this.doubleInfoContainer = null;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.attachDoubleClickListener();
            // 页面加载时默认显示带图版式
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                const versionCard = aboutSection.querySelector('.version-card');
                if (versionCard) {
                    const versionContent = versionCard.querySelector('.version-content');
                    if (versionContent) {
                        // 保存原始内容
                        this.originalContent = versionContent.innerHTML;
                        // 创建双信息板块
                        this.createDoubleInfoSection(versionContent);
                        this.isActive = true;
                    }
                }
            }
        });
    }

    attachDoubleClickListener() {
        const tabs = document.querySelector('.tabs');
        if (tabs) {
            tabs.addEventListener('dblclick', (e) => {
                // 只在双击tab按钮时触发
                if (e.target.classList.contains('tab-button')) {
                    const aboutSection = document.getElementById('about');
                    if (aboutSection) {
                        const versionCard = aboutSection.querySelector('.version-card');
                        if (versionCard) {
                            const versionContent = versionCard.querySelector('.version-content');
                            if (versionContent) {
                                this.toggleDoubleInfo(versionContent);
                            }
                        }
                    }
                }
            });
        }
    }

    toggleDoubleInfo(versionContent) {
        if (!this.isActive) {
            // 切换到原始信息版式
            versionContent.innerHTML = this.originalContent;
            this.isActive = true;
        } else {
            // 切换回带图版式
            this.createDoubleInfoSection(versionContent);
            this.isActive = false;
        }
    }

    createDoubleInfoSection(versionContent) {
        // 创建双信息板块容器
        const doubleInfoContainer = document.createElement('div');
        doubleInfoContainer.style.cssText = `
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 20px 10px;
            margin: 20px 0;
        `;

        // 创建左侧图片部分
        const imageSection = document.createElement('div');
        imageSection.style.cssText = `
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const image = document.createElement('img');
        // 根据当前主题选择图片
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        image.src = isDarkMode ? 'dln.png' : 'db.png';
        image.alt = 'OOOInterface Logo';
        image.style.cssText = `
            max-width: 200px;
            max-height: 200px;
        `;
        
        // 监听主题变化
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            image.src = e.matches ? 'dln.png' : 'db.png';
        });
        
        // 双击图片显示弹窗
        image.addEventListener('dblclick', () => {
            this.showInfoPopup();
        });

        imageSection.appendChild(image);

        // 创建右侧文本部分
        const textSection = document.createElement('div');
        textSection.style.cssText = `
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 10px;
        `;

        const title = document.createElement('h2');
        title.textContent = 'OOOInterface';
        title.style.cssText = `
            font: var(--google-headline-medium);
            font-weight: 500;
            color: var(--google-text-primary);
            margin: 0;
        `;

        const version = document.createElement('p');
        version.textContent = '5.1.2:24-RS42.2';
        version.style.cssText = `
            font: var(--google-title-large);
            color: var(--google-text-secondary);
            margin: 0;
        `;

        const license = document.createElement('p');
        license.textContent = '许可证：ABCD-26W08A';
        license.style.cssText = `
            font: var(--google-body-medium);
            color: var(--google-text-secondary);
            margin: 0;
        `;

        const copyright = document.createElement('p');
        copyright.textContent = '© 2026 ByRUDAN 保留所有权利。';
        copyright.style.cssText = `
            font: var(--google-body-small);
            color: var(--google-text-secondary);
            margin: 0;
        `;

        textSection.appendChild(title);
        textSection.appendChild(version);
        textSection.appendChild(license);
        textSection.appendChild(copyright);

        // 将两部分添加到容器
        doubleInfoContainer.appendChild(imageSection);
        doubleInfoContainer.appendChild(textSection);

        // 清空原始内容并添加双信息板块
        versionContent.innerHTML = '';
        versionContent.appendChild(doubleInfoContainer);
    }

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
        version.textContent = `[component.over]5.1.2:24-RS42.2`;
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

    getOperatingSystem() {
        const userAgent = navigator.userAgent;
        if (userAgent.includes('Windows')) return 'Windows';
        if (userAgent.includes('Mac OS')) return 'Mac OS';
        if (userAgent.includes('Linux')) return 'Linux';
        if (userAgent.includes('Android')) return 'Android';
        if (userAgent.includes('iOS')) return 'iOS';
        return 'Unknown';
    }

    getMemoryUsage(type) {
        // 浏览器环境下无法直接获取内存信息，这里模拟返回
        if (type === 'pss') {
            return '~50MB';
        } else if (type === 'rss') {
            return '~100MB';
        }
        return 'N/A';
    }
}

// 初始化双信息页面板块
new DoubleInfoPage();

// 回到顶部按钮功能
window.addEventListener('scroll', function() {
    const backToTopBtn = document.getElementById('backToTop');
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

// 标签页点击跳转功能
function switchTab(tabName) {
    // 移除所有标签按钮的激活状态
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // 激活当前标签按钮
    const currentButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (currentButton) {
        currentButton.classList.add('active');
    }
    
    // 跳转到对应的部分
    const targetSection = document.getElementById(tabName);
    if (targetSection) {
        targetSection.scrollIntoView({
            behavior: 'smooth'
        });
    }
    
    // 控制搜索框的显示
    const searchContainer = document.getElementById('searchContainer');
    const versionSearchContainer = document.getElementById('versionSearchContainer');
    
    if (searchContainer) {
        searchContainer.style.display = 'none';
    }
    
    if (versionSearchContainer) {
        if (tabName === 'versions') {
            versionSearchContainer.style.display = 'block';
        } else {
            versionSearchContainer.style.display = 'none';
        }
    }
}

// 滚动监听，自动切换标签
function updateActiveTabOnScroll() {
    const sections = document.querySelectorAll('.section');
    const tabButtons = document.querySelectorAll('.tab-button');
    let currentTab = '';
    
    // 判断当前滚动位置对应的section，从后往前遍历，让后面的部分优先被选中
    [...sections].reverse().forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (window.pageYOffset >= sectionTop - 100 && 
            window.pageYOffset < sectionTop + sectionHeight - 100) {
            currentTab = section.id;
        }
    });
    
    // 当滚动到页面底部时，直接激活最后一个section的标签（support）
    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 50) {
        currentTab = sections[sections.length - 1].id;
    }
    
    // 更新标签按钮的激活状态
    if (currentTab) {
        tabButtons.forEach(button => {
            button.classList.remove('active');
        });
        
        const activeButton = document.querySelector(`[data-tab="${currentTab}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
        
        // 控制搜索框的显示
        const searchContainer = document.getElementById('searchContainer');
        const versionSearchContainer = document.getElementById('versionSearchContainer');
        
        if (searchContainer) {
            searchContainer.style.display = 'none';
        }
        
        if (versionSearchContainer) {
            if (currentTab === 'versions') {
                versionSearchContainer.style.display = 'block';
            } else {
                versionSearchContainer.style.display = 'none';
            }
        }
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 搜索功能
function searchVersions() {
    const searchTerm = document.getElementById('versionSearchInput').value.toLowerCase().trim();
    const versionCards = document.querySelectorAll('.version-card');
    
    versionCards.forEach((card, index) => {
        const badgeElement = card.querySelector('.version-badge');
        const badge = badgeElement ? badgeElement.textContent.toLowerCase().trim() : '';
        
        let showCard = false;
        
        if (searchTerm === '') {
            showCard = true;
        } else {
            // 提取版本号的主要部分（冒号之前的部分）
            const versionParts = badge.split(':');
            const mainVersion = versionParts.length > 0 ? versionParts[0].trim() : '';
            
            // 简单数字搜索（如1、2）或具体版本搜索（如1.0、1.1）
            const versionPattern = /^\d+(\.\d+)*$/;
            
            if (versionPattern.test(searchTerm)) {
                if (searchTerm.includes('.')) {
                    // 具体版本搜索（如1.1），只匹配完全相同的版本
                    if (mainVersion === searchTerm) {
                        showCard = true;
                    }
                } else {
                    // 单个数字搜索（如1），只匹配以该数字开头的版本
                    if (mainVersion.startsWith(searchTerm + '.') || mainVersion === searchTerm) {
                        showCard = true;
                    }
                }
            }
        }
        
        if (showCard) {
            card.style.display = 'block';
            card.style.animationDelay = `${index * 0.1 + 0.2}s`;
            card.style.animation = 'slideInUp 0.6s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
}

// 点击展开/折叠功能
function toggleVersion(header) {
    const card = header.closest('.version-card');
    if (card) {
        card.classList.toggle('expanded');
    }
}

// 滚动动画增强
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// 支持按钮点击事件
function toggleSupport() {
    const supportCard = document.getElementById('supportCard');
    supportCard.classList.toggle('expanded');
}

// 观察所有版本卡片
document.addEventListener('DOMContentLoaded', function() {
    const versionCards = document.querySelectorAll('.version-card');
    versionCards.forEach(card => {
        observer.observe(card);
    });
    
    // 添加支持卡片点击事件监听器
    const supportHeader = document.querySelector('.support-header');
    if (supportHeader) {
        supportHeader.addEventListener('click', toggleSupport);
    }
    
    // 添加回到顶部按钮点击事件监听器
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', scrollToTop);
    }
    
    // 添加搜索输入事件监听器
    const versionSearchInput = document.getElementById('versionSearchInput');
    if (versionSearchInput) {
        versionSearchInput.addEventListener('input', searchVersions);
    }
    
    // 添加版本卡片点击事件监听器
    const versionHeaders = document.querySelectorAll('.version-header');
    versionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            toggleVersion(this);
        });
    });
    
    // 添加标签页按钮点击事件监听器
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // 添加滚动监听事件
    window.addEventListener('scroll', updateActiveTabOnScroll);
    
    // 初始化搜索框显示
    const searchContainer = document.getElementById('searchContainer');
    const versionSearchContainer = document.getElementById('versionSearchContainer');
    
    if (searchContainer) {
        searchContainer.style.display = 'none';
    }
    
    if (versionSearchContainer) {
        versionSearchContainer.style.display = 'none';
    }
    
    // 初始化激活标签
    updateActiveTabOnScroll();
});

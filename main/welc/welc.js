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
        window.location.href = '../index.html';
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

// 页面切换逻辑
let currentPage = 1;

function goToPage(pageNumber) {
    // 隐藏当前页面
    document.querySelector(`.page-${currentPage}`).classList.remove('active');
    
    // 显示目标页面
    document.querySelector(`.page-${pageNumber}`).classList.add('active');
    
    // 更新当前页面
    currentPage = pageNumber;
}

function goToMainPage() {
    // 跳转到主页面
    localStorage.setItem('hasVisited', 'true');
    window.location.href = '../index.html';
}

// 键盘导航支持
document.addEventListener('keydown', function(e) {
    if (e.key === ' ') {
        e.preventDefault(); // 防止页面滚动
        if (currentPage === 1) {
            goToPage(2);
        } else if (currentPage === 2) {
            goToMainPage();
        }
    } else if (e.key === 'Backspace') {
        e.preventDefault(); // 防止浏览器后退
        if (currentPage === 1) {
            location.reload(); // 刷新页面
        } else if (currentPage === 2) {
            goToPage(1); // 返回第一页
        }
    }
});
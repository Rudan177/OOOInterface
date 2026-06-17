// 主题锁定状态
let themeLocked = false;

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

class FeedbackApp {
    constructor() {
        this.init();
        this.initContextMenu();
    }

    initContextMenu() {
        new ContextMenu();
    }

    init() {
        this.updateSeverityOptions();
        this.initTheme();
    }

    initTheme() {
        const lockBadge = document.getElementById('themeLockBadge');
        const themeIcon = document.getElementById('themeIcon');

        // 检查是否锁定
        const isLocked = localStorage.getItem('themeLocked') === 'true';
        themeLocked = isLocked;

        let theme;
        if (isLocked) {
            // 如果锁定，使用保存的主题
            theme = localStorage.getItem('lockedTheme') || 'dark';
            lockBadge.style.display = 'flex';
        } else {
            // 如果未锁定，根据系统主题自动检测
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            theme = prefersDark ? 'dark' : 'light';
            lockBadge.style.display = 'none';
        }

        document.body.setAttribute('data-theme', theme);
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
        }

        // 监听系统主题变化
        if (!isLocked) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                const newTheme = e.matches ? 'dark' : 'light';
                document.body.setAttribute('data-theme', newTheme);
                if (themeIcon) {
                    themeIcon.textContent = newTheme === 'dark' ? 'light_mode' : 'dark_mode';
                }
            });
        }
    }

    updateSeverityOptions() {
        const feedbackType = document.querySelector('input[name="feedbackType"]:checked').value;
        const severitySection = document.getElementById('severitySection');
        const severityLabel = document.getElementById('severityLabel');
        const severityOptions = document.getElementById('severityOptions');
        const environmentSection = document.getElementById('environmentSection');

        if (feedbackType === 'bug') {
            severityLabel.textContent = '严重程度';
            severityOptions.innerHTML = `
                <div class="radio-option">
                    <input type="radio" id="severity-critical" name="severity" value="非常严重">
                    <label for="severity-critical">非常严重</label>
                </div>
                <div class="radio-option">
                    <input type="radio" id="severity-high" name="severity" value="比较严重">
                    <label for="severity-high">比较严重</label>
                </div>
                <div class="radio-option">
                    <input type="radio" id="severity-medium" name="severity" value="一般" checked>
                    <label for="severity-medium">一般</label>
                </div>
                <div class="radio-option">
                    <input type="radio" id="severity-low" name="severity" value="不太严重">
                    <label for="severity-low">不太严重</label>
                </div>
                <div class="radio-option">
                    <input type="radio" id="severity-none" name="severity" value="没啥影响">
                    <label for="severity-none">没啥影响</label>
                </div>
            `;
            environmentSection.classList.remove('hidden');
        } else {
            severityLabel.textContent = '实用程度';
            severityOptions.innerHTML = `
                <div class="radio-option">
                    <input type="radio" id="usefulness-high" name="severity" value="非常实用" checked>
                    <label for="usefulness-high">非常实用</label>
                </div>
                <div class="radio-option">
                    <input type="radio" id="usefulness-medium" name="severity" value="一般">
                    <label for="usefulness-medium">一般</label>
                </div>
                <div class="radio-option">
                    <input type="radio" id="usefulness-low" name="severity" value="纯抽象">
                    <label for="usefulness-low">纯抽象</label>
                </div>
            `;
            environmentSection.classList.add('hidden');
        }
    }

    saveFeedback() {
        const feedbackType = document.querySelector('input[name="feedbackType"]:checked').value;
        const severity = document.querySelector('input[name="severity"]:checked').value;
        const description = document.getElementById('description').value.trim();
        const environment = document.getElementById('environment').value.trim();
        const author = document.getElementById('author').value.trim() || '匿名';

        if (!description) {
            this.showToast('请输入详细描述', 'error');
            return;
        }

        const saveBtn = document.getElementById('saveBtn');
        saveBtn.classList.add('loading');

        setTimeout(() => {
            // 获取当前时间和系统信息
            const now = new Date();
            const timeStr = now.toLocaleString('zh-CN');
            const os = this.getOS();

            // 构建RUD内容
            const rudContent = this.buildRUDContent(
                feedbackType,
                severity,
                description,
                environment,
                author,
                timeStr,
                os
            );

            // 下载文件
            const blob = new Blob([rudContent], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const timestamp = now.toISOString().slice(0, 10).replace(/-/g, '');
            a.href = url;
            a.download = `OI24_BS29_${timestamp}_${feedbackType === 'bug' ? 'Bug' : 'Feature'}.rud`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            saveBtn.classList.remove('loading');
            this.showToast('反馈已保存', 'success');
        }, 500);
    }

    buildRUDContent(feedbackType, severity, description, environment, author, timeStr, os) {
        const startContent = feedbackType === 'bug' ? '反馈Bug' : '功能建议';
        
        let content = `<rud>\n`;
        content += `    <start>\n`;
        content += `        ${startContent}\n`;
        content += `    <start.n>\n`;
        content += `    <part.1>\n`;
        content += `        <parg>\n`;
        content += `            ${severity}\n`;
        content += `        <parg.n>\n`;
        content += `    <part.1.n>\n`;
        content += `    <part.2>\n`;
        content += `        <parg>\n`;
        content += `            ${description}\n`;
        content += `        <parg.n>\n`;
        
        if (feedbackType === 'bug' && environment) {
            content += `        <parg>\n`;
            content += `            ${environment}\n`;
            content += `        <parg.n>\n`;
        }
        
        content += `    <part.2.n>\n`;
        content += `    <end>\n`;
        content += `        反馈时间：${timeStr}\n`;
        content += `        操作系统：${os}\n`;
        content += `        反馈人：${author}\n`;
        content += `    <end.n>\n`;
        content += `<rud.n>`;

        return content;
    }

    getOS() {
        const platform = navigator.platform;
        if (platform.includes('Win')) return 'Windows';
        if (platform.includes('Mac')) return 'macOS';
        if (platform.includes('Linux')) return 'Linux';
        if (platform.includes('iPhone') || platform.includes('iPad')) return 'iOS';
        if (platform.includes('Android')) return 'Android';
        return platform;
    }

    showToast(message, type = 'info') {
        const toastId = `toast-${Date.now()}`;

        const iconMap = {
            'success': 'check_circle',
            'error': 'error',
            'info': 'info'
        };

        const toast = document.createElement('div');
        toast.id = toastId;
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span class="material-icons">${iconMap[type] || 'info'}</span>
            <span>${message}</span>
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    clearForm() {
        document.getElementById('description').value = '';
        document.getElementById('environment').value = '';
        document.getElementById('author').value = '';
        document.querySelector('input[name="feedbackType"][value="bug"]').checked = true;
        this.updateSeverityOptions();
        this.showToast('表单已清空', 'success');
    }
}

// 全局应用实例
let feedbackApp;

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    feedbackApp = new FeedbackApp();
    initResizeHandles();
    bindEvents();
});

// 绑定事件监听器
function bindEvents() {
    // 反馈类型切换
    const feedbackTypeRadios = document.querySelectorAll('input[name="feedbackType"]');
    feedbackTypeRadios.forEach(radio => {
        radio.addEventListener('change', () => updateSeverityOptions());
    });

    // 保存按钮
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => saveFeedback());
    }

    // 清空按钮
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => clearForm());
    }

    // 主题切换按钮
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => toggleTheme());
        themeToggle.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            toggleThemeLock(e);
        });
    }
}

// 初始化文本框拖动功能
function initResizeHandles() {
    const handles = document.querySelectorAll('.resize-handle');
    
    handles.forEach(handle => {
        let startY, startHeight, textarea;
        
        handle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            const targetId = handle.getAttribute('data-target');
            textarea = document.getElementById(targetId);
            startY = e.clientY;
            startHeight = textarea.offsetHeight;
            
            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);
        });
        
        function resize(e) {
            const diff = e.clientY - startY;
            const newHeight = Math.max(80, Math.min(300, startHeight + diff));
            textarea.style.height = newHeight + 'px';
        }
        
        function stopResize() {
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResize);
        }
    });
}

// 全局函数
function updateSeverityOptions() {
    feedbackApp.updateSeverityOptions();
}

function saveFeedback() {
    feedbackApp.saveFeedback();
}

function clearForm() {
    feedbackApp.clearForm();
}

function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    body.setAttribute('data-theme', newTheme);
    themeIcon.textContent = newTheme === 'dark' ? 'light_mode' : 'dark_mode';

    // 如果锁定，更新保存的主题
    if (themeLocked) {
        localStorage.setItem('lockedTheme', newTheme);
    }
}

function toggleThemeLock(event) {
    event.preventDefault();
    themeLocked = !themeLocked;

    const lockBadge = document.getElementById('themeLockBadge');
    if (themeLocked) {
        lockBadge.style.display = 'flex';
        // 锁定时保存当前主题
        const currentTheme = document.body.getAttribute('data-theme');
        localStorage.setItem('lockedTheme', currentTheme);
        localStorage.setItem('themeLocked', 'true');
    } else {
        lockBadge.style.display = 'none';
        // 解锁时清除锁定状态
        localStorage.removeItem('themeLocked');
        localStorage.removeItem('lockedTheme');
    }
}
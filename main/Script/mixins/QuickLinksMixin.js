// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

import { QuickLinksExporter, QuickLinksImporter } from '../quicklinks-export.js';

export const QuickLinksMixin = {
    handleOpenQuickLinksParam() {
        try {
            const params = new URLSearchParams(window.location.search);
            if (params.get('openQuickLinks') === '1') {
                this.openSettings('badge');
                setTimeout(() => {
                    this.showQuickLinksMenuInRightPanel();
                }, 100);
                return;
            }
            const spView = params.get('openSidePanel');
            if (spView) {
                this.openSettings('badge');
                setTimeout(() => {
                    const rpu = document.getElementById('right-panel-upper');
                    if (!rpu) return;
                    this.renderSidePanelConfigView(rpu);
                    if (spView !== 'root') {
                        this.renderSidePanelSubView(rpu, spView);
                    }
                }, 100);
            }
        } catch (e) {
            console.warn('解析面板跳转参数失败:', e);
        }
    },
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
    },
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
    },
    deleteQuickLink(index) {
        if (index >= 0 && index < this.settings.quickLinks.length) {
            const linkName = this.settings.quickLinks[index].name;
            this.settings.quickLinks.splice(index, 1);
            this.updateQuickLinksList();
            this.saveSettings();
            this.showNotification(`快速访问链接 "${linkName}" 已删除`);
        }
    },
    applyQuickLinks() {
        // 侧边栏链接子视图交换期间挂起，避免主页面渲染侧边栏数据
        if (this._spSwap && this._spSwap.quickLinks !== undefined) return;
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
    },
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
                        // 仅在从未检测过时写入缓存，避免每次渲染重复回写设置
                        if (link._favicon === undefined && domain) {
                            self.cacheFavicon(link, index, domain, null);
                        }
                    };

                    faviconImg.onload = function () {
                        // 检测是否为默认图标（如 Google 的默认地球图标大小为 16x16）
                        const isDefaultIcon = this.naturalWidth <= 20 || this.naturalHeight <= 20;

                        if (isDefaultIcon && link._favicon === undefined) {
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

                        if (link._favicon === undefined && domain) {
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
    },
    extractDomain(url) {
        try {
            const u = new URL(url);
            return u.hostname;
        } catch (e) {
            return null;
        }
    },
    cacheFavicon(link, index, domain, src) {
        if (src) {
            this.settings.quickLinks[index]._favicon = src;
        } else {
            // 标记为无图标，存储空字符串避免下次重复请求
            this.settings.quickLinks[index]._favicon = '';
        }
        this.saveSettings();
    },
    updateSidebarIconColors() {
        const container = document.getElementById('quick-access-sidebar-container');
        if (!container) return;

        const colorConfig = this.getColorConfig();
        container.style.setProperty('--sidebar-icon-bg', colorConfig.sidebarIcon);
    },
    updateSidebarVisibility() {
        const sidebar = document.getElementById('quick-access-sidebar');
        if (!sidebar) return;

        if (this.settings.quickAccessSidebar) {
            sidebar.classList.add('active');
        } else {
            sidebar.classList.remove('active');
            // 侧边栏功能关闭时始终隐藏容器（固定侧边栏不生效）
            const container = document.getElementById('quick-access-sidebar-container');
            if (container) {
                container.classList.remove('visible');
                container.classList.add('hiding');
            }
        }
    },
    isSidebarFixed() {
        if (!this.settings.quickAccessSidebar) return false;
        return this.isScrolled
            ? this.settings.fixSidebarWallpaper
            : (this.settings.fixSidebarEnabled && this.settings.fixSidebarHomepage);
    },
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
        const TRIGGER_ZONE_WIDTH = 100;   // 右侧触发区域宽度（像素）
        const HIDE_DELAY = 0;            // 鼠标离开立即关闭

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
            const modal = document.getElementById('settings-modal');
            if (modal && modal.classList.contains('show')) return;
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
                // 当前视图处于固定模式时，不被 hover 隐藏
                if (this.isSidebarFixed()) return;
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

        // 全局鼠标移动检测：在右侧边缘触发区域显示容器（与小组件一致）
        document.addEventListener('mousemove', (e) => {
            if (!this.settings.quickAccessSidebar) return;
            const modal = document.getElementById('settings-modal');
            if (modal && modal.classList.contains('show')) return;
            const viewportWidth = window.innerWidth;
            const mouseX = e.clientX;

            if (mouseX >= viewportWidth - TRIGGER_ZONE_WIDTH) {
                // 当前视图处于固定模式时，无需 hover 触发
                if (this.isSidebarFixed()) return;
                showSidebar();
            } else if (isVisible && !this.isSidebarFixed()) {
                // 仅在容器可见且未固定时检查是否需要隐藏
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

        // 容器悬停维持显示（与小组件一致）
        container.addEventListener('mouseenter', () => {
            if (!this.settings.quickAccessSidebar) return;
            if (this.isSidebarFixed()) return;
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
        });

        container.addEventListener('mouseleave', () => {
            // 当前视图固定时鼠标移开不隐藏
            if (this.isSidebarFixed()) return;
            scheduleHide();
        });

        // 侧边栏滚轮：内容溢出时拦截（只滚动侧边栏内容，不触发壁纸模式进退）；
        // 内容不溢出时放行（交给页面滚动处理）
        const sidebarLinks = document.getElementById('quick-access-sidebar-links');
        const sidebarWheelHandler = (e) => {
            if (!sidebarLinks) return;
            const maxScroll = sidebarLinks.scrollHeight - sidebarLinks.clientHeight;
            if (maxScroll <= 0) return; // 内容不溢出，放行
            e.stopPropagation();        // 内容溢出：拦截，只滚动侧边栏内容
        };
        sidebar.addEventListener('wheel', sidebarWheelHandler, { passive: true });
        container.addEventListener('wheel', sidebarWheelHandler, { passive: true });
    },
showQuickLinksMenuInRightPanel (skipAnimation) {
    const self = this;
    const rightPanelUpper = document.getElementById('right-panel-upper');
    if (!rightPanelUpper) return;
    const settingsModal = document.getElementById('settings-modal');
    if (settingsModal) settingsModal.classList.add('right-panel-open');

    rightPanelUpper.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'settings-menu-container' + (skipAnimation ? '' : ' slide-in-right');

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
    importBtn.title = '从 Chrome 书签导入';
    importBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';

    // 导出按钮（左边是导出，右边是导入）
    const exportBtn = document.createElement('button');
    exportBtn.className = 'settings-import-btn settings-export-btn';
    exportBtn.title = '导出快速访问链接为 JSON';
    exportBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>';

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

    // 导出/导入按钮行：左边是导出，右边是导入
    const ioRow = document.createElement('div');
    ioRow.className = 'quick-links-io-row';
    ioRow.appendChild(exportBtn);
    ioRow.appendChild(importBtn);

    buttonContainer.appendChild(ioRow);
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

    // 导出按钮点击事件：将快速访问链接导出为 JSON 文件
    exportBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (typeof QuickLinksExporter !== 'undefined') {
            QuickLinksExporter.exportQuickLinks(self);
        }
    });

    // 点击外部关闭下拉菜单（先注销上一次的监听器，避免反复打开菜单导致监听器泄漏）
    if (this._quickLinksDocClickHandler) {
        document.removeEventListener('click', this._quickLinksDocClickHandler);
    }
    this._quickLinksDocClickHandler = (e) => {
        if (!importDropdown.isConnected) {
            // 下拉元素已被移除（菜单关闭），自动注销监听器
            document.removeEventListener('click', this._quickLinksDocClickHandler);
            this._quickLinksDocClickHandler = null;
            return;
        }
        if (e.target !== importBtn && !importDropdown.contains(e.target) && !folderSubmenu.contains(e.target)) {
            importDropdown.classList.remove('active');
            folderSubmenu.classList.remove('active');
        }
    };
    document.addEventListener('click', this._quickLinksDocClickHandler);
},
showQuickLinksAddInterface (container, listContainer, buttonContainer, editIndex) {
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

    // 从 JSON 导入：仅在"新增"模式下提供，编辑模式只保留取消和确定
    if (!isEdit) {
        // 从 JSON 导入按钮：与确定并排，配色与取消按钮同款
        const importFileBtn = document.createElement('button');
        importFileBtn.textContent = '从JSON导入';
        importFileBtn.title = '从 JSON 文件导入快速访问链接，也可直接拖入 JSON 文件';
        importFileBtn.style.cssText = 'padding:8px 20px;border:1px solid var(--border-color);border-radius:12px;font-size:13px;color:var(--text-color);background:transparent;cursor:pointer;';

        const importFileInput = document.createElement('input');
        importFileInput.type = 'file';
        importFileInput.accept = '.json,application/json';
        importFileInput.style.display = 'none';
        importFileInput.className = 'quick-links-json-file-input';

        // 读取文件并导入，成功后回到列表视图
        const readFileAndImport = (file) => {
            if (!file) return;
            const isJson = /\.json$/i.test(file.name) || (file.type && file.type.indexOf('json') !== -1);
            if (!isJson) {
                self.showNotification('请导入 JSON 文件');
                return;
            }
            const reader = new FileReader();
            reader.onload = (ev) => {
                const ok = typeof QuickLinksImporter !== 'undefined' &&
                    QuickLinksImporter.importQuickLinks(self, ev.target.result);
                if (ok) {
                    self.updateQuickLinksListInMenu(listContainer);
                    self.hideQuickLinksAddInterface(container, inputWrapper, listContainer, buttonContainer);
                }
            };
            reader.onerror = () => self.showNotification('文件读取失败');
            reader.readAsText(file);
        };

        importFileInput.addEventListener('change', (e) => {
            readFileAndImport(e.target.files[0]);
        });

        importFileBtn.addEventListener('click', () => importFileInput.click());

        // 支持直接拖入 JSON 文件导入（仅在添加视图内生效）
        const isAddViewActive = () => {
            const panel = document.getElementById('right-panel-upper');
            return panel && panel.dataset.subView === 'quick-link-add';
        };

        ['dragenter', 'dragover'].forEach(eventName => {
            container.addEventListener(eventName, (e) => {
                if (!isAddViewActive()) return;
                e.preventDefault();
                e.stopPropagation();
                container.classList.add('json-drag-over');
            });
        });
        ['dragleave', 'drop'].forEach(eventName => {
            container.addEventListener(eventName, (e) => {
                if (!isAddViewActive()) return;
                e.preventDefault();
                e.stopPropagation();
                container.classList.remove('json-drag-over');
            });
        });
        container.addEventListener('drop', (e) => {
            if (!isAddViewActive()) return;
            // 文件拖放过程中可能误触发排序逻辑，先清理可能残留的排序指示线
            listContainer.querySelectorAll('.drag-indicator').forEach(el => el.remove());
            const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
            readFileAndImport(file);
        });

        buttonsWrapper.appendChild(importFileBtn);
        container.appendChild(importFileInput);
    }

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
},
hideQuickLinksAddInterface (container, inputWrapper, listContainer, buttonContainer) {
    const buttonsWrapper = container.querySelector('.quick-links-add-buttons');

    // 移除隐藏的 JSON 文件选择输入框，避免残留在列表视图
    const jsonFileInput = container.querySelector('.quick-links-json-file-input');
    if (jsonFileInput && jsonFileInput.parentNode) {
        container.removeChild(jsonFileInput);
    }
    container.classList.remove('json-drag-over');

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

    // 立即恢复列表与按钮区显示，不依赖延迟回调，避免输入框与列表视图重叠残留
    listContainer.style.display = 'flex';
    buttonContainer.style.display = 'flex';

    setTimeout(() => {
        // 用实时查询兜底移除添加视图节点，确保无论闭包引用状态如何都不残留
        const leftoverButtons = container.querySelector('.quick-links-add-buttons');
        if (leftoverButtons && leftoverButtons.parentNode) {
            leftoverButtons.parentNode.removeChild(leftoverButtons);
        }
        const leftoverInput = container.querySelector('.quick-links-input-wrapper');
        if (leftoverInput && leftoverInput.parentNode) {
            leftoverInput.parentNode.removeChild(leftoverInput);
        }
    }, 200);
},
updateQuickLinksListInMenu (listContainer) {
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

    // 使用 DocumentFragment 批量构建条目，大量链接时一次性挂载，避免逐个插入引发多次重排
    const fragment = document.createDocumentFragment();

    this.settings.quickLinks.forEach((link, index) => {
        const item = document.createElement('div');
        item.className = 'quick-link-menu-item';
        item.setAttribute('data-index', index);
        item.draggable = true;

        // 拖入外部文件（如 JSON 导入）时不参与排序逻辑的判断
        const isFileDrag = (e) => {
            return !!(e.dataTransfer && e.dataTransfer.types &&
                Array.prototype.indexOf.call(e.dataTransfer.types, 'Files') !== -1);
        };

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
                // 拖拽排序后 DOM 顺序会变，必须实时读取 data-index，避免使用旧闭包索引
                const currentIndex = parseInt(item.getAttribute('data-index'), 10);
                self.showQuickLinksAddInterface(container, listContainer, buttonContainer, currentIndex);
            }
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-link-menu-btn';
        deleteBtn.textContent = '×';
        deleteBtn.title = '删除';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // 拖拽排序后 DOM 顺序会变，必须实时读取 data-index，避免删除错误项
            const currentIndex = parseInt(item.getAttribute('data-index'), 10);
            if (isNaN(currentIndex) || currentIndex < 0 || currentIndex >= this.settings.quickLinks.length) return;
            this.settings.quickLinks.splice(currentIndex, 1);
            this.saveSettings();
            this.updateQuickLinksListInMenu(listContainer);

            this.showNotification('快速访问链接已删除');
        });

        item.appendChild(dragHandle);
        item.appendChild(info);
        item.appendChild(deleteBtn);
        fragment.appendChild(item);

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
            // 外部文件拖入（JSON 导入）时跳过排序逻辑，交由容器导入处理器处理
            if (isFileDrag(e)) return;
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
            // 外部文件拖入（JSON 导入）时不拦截，让事件冒泡到容器完成导入
            if (isFileDrag(e)) return;
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

    // 全部条目构建完成后一次性挂载到列表容器
    listContainer.appendChild(fragment);

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
},
};

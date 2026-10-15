// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

export const BookmarkMixin = {
toggleBookmarkImportDropdown (dropdown, folderSubmenu, anchorBtn) {
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
},
renderBookmarkImportDropdown (dropdown, folderSubmenu) {
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
},
showBookmarkFolderSelection (folderSubmenu, dropdown) {
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
},
importBookmarksFromChrome (mode, folderId, dropdown, folderSubmenu) {
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
},
};

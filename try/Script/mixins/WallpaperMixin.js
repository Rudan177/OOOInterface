// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

import { ProxyManager } from '../proxy.js';

export const WallpaperMixin = {
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

            // 先更新自定义壁纸列表（创建 option），再设置选中值，
            // 否则 option 尚不存在，赋值不会生效
            this.updateCustomWallpapersList();

            const wallpaperSelect = document.getElementById('wallpaper-select');
            if (wallpaperSelect) {
                wallpaperSelect.value = wallpaperName;
            }

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
        reader.onerror = () => {
            this.showNotification('文件读取失败');
        };
        reader.readAsDataURL(file);
    },
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
    },
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
    },
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
    },
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
    },
    finishSeriesImport(seriesName, seriesWallpapers, imported, skipped, storageFull) {
        if (imported > 0) {
            this.settings.wallpaperSeries.push({
                name: seriesName,
                wallpapers: seriesWallpapers.map(w => w.name)
            });

            this.settings.wallpaper = seriesWallpapers[0].data;
            this.settings.persistentWallpaper = true;

            // 系列壁纸导入即应用，解除主题对壁纸方面的接管
            this.checkThemeConsistency('wallpaper', this.settings.wallpaper);

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
    },
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
    },
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
            // 需要刷新：只有在获取成功后才记录刷新时间，
            // 否则失败也会被记为已刷新，导致间隔内不再重试
            this.fetchBingWallpaper().then(success => {
                if (success) {
                    localStorage.setItem('bingLastRefreshTime', Date.now().toString());
                }
            });
        } else {
            // 不需要刷新，使用现有壁纸
            if (this.settings.wallpaperUrl) {
                this.applySettings();
            } else {
                // 如果没有壁纸URL，获取一次
                this.fetchBingWallpaper();
            }
        }
    },
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
                return false;
            }
            return true;
        } catch (error) {
            console.error('获取必应壁纸失败:', error);
            notify('获取必应壁纸异常：' + error.message);
            return false;
        }
    },
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
    },
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
    },
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
                // settings.wallpaper 可能存的是 data URL，需先映射回壁纸名称再查找 option
                const currentWp = this.settings.customWallpapers.find(wp => wp.data === this.settings.wallpaper);
                const lookupValue = currentWp ? currentWp.name : this.settings.wallpaper;
                const selectedOption = wallpaperSelect.querySelector(`option[value="${CSS.escape(lookupValue)}"]`);
                if (selectedOption) {
                    wallpaperSelectSelected.textContent = selectedOption.textContent;
                }
            }
        }
    },
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
    },
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
    },
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

        // 进入壁纸模式后铭牌不可交互，立即收起 OCP 播控，避免残留悬空
        this.hideOcpPlayer();

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

            // 壁纸模式下常显示侧边栏与小组件面板（清除 hiding 残留状态）
            // isScrolled 已在进入壁纸模式时置为 true，固定侧边栏按"壁纸模式固定"生效
            this.syncWidgetPanelsForWallpaper(true);

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
    },
    applyHomepageWallpaper() {
        if (this.settings.persistentWallpaper) {
            document.body.classList.add('homepage-wallpaper');
        } else {
            document.body.classList.remove('homepage-wallpaper');
        }
    },
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

        // 退出壁纸模式：恢复侧边栏与小组件面板由 hover 控制
        this.syncWidgetPanelsForWallpaper(false);
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
};

// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

import { ClockWidget } from '../widgets/ClockWidget.js';
import { CalendarWidget } from '../widgets/CalendarWidget.js';
import { WeatherWidget } from '../widgets/WeatherWidget.js';
import { TasksWidget } from '../widgets/TasksWidget.js';
import { AiAgentWidget } from '../widgets/AiAgentWidget.js';
import { EmailWidget } from '../widgets/EmailWidget.js';
import { UpgradeToolWidget } from '../widgets/UpgradeToolWidget.js';
// 类型表与尺寸辅助函数与侧边栏面板共用（Stage 9）。函数以别名导入，
// 避免与下面同名的委托方法在阅读时混淆。
import {
    WIDGET_TYPES,
    getWidgetAllowedSizes as allowedSizesOf,
    normalizeWidgetSize as normalizeSize,
    getWidgetSizeLabel as sizeLabelOf,
} from '../widgets/widget-types.js';
import { attachSortableList } from '../sortable.js';

export const WidgetMixin = {
// 类型表与尺寸辅助函数已提取到 widgets/widget-types.js，与侧边栏面板共用。
// 保留同名成员，使 this.WIDGET_TYPES / this.normalizeWidgetSize(...) 等
// 既有调用点一处都不用改。
WIDGET_TYPES,
getWidgetAllowedSizes (type) {
    return allowedSizesOf(type);
},
normalizeWidgetSize (type, size) {
    return normalizeSize(type, size);
},
getWidgetSizeLabel (type, size) {
    return sizeLabelOf(type, size);
},

createWidgetInstance (config) {
    const baseConfig = {
        id: config.id,
        type: config.type,
        size: this.normalizeWidgetSize(config.type, config.size),
        data: config.data || {},
        ooo: this
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
},
renderWidgetPanel () {
    const grid = document.getElementById('widget-panel-grid');
    if (!grid) return;
    // 侧边栏小组件子视图交换期间挂起，避免主页面网格渲染侧边栏数据
    if (this._spSwap && this._spSwap.widgetPanel !== undefined) return;

    // 销毁旧实例
    if (this.widgetInstances) {
        this.widgetInstances.forEach(w => {
            try { w.destroy(); } catch (e) { /* 忽略 */ }
        });
    }
    this.widgetInstances = [];
    grid.innerHTML = '';

    const widgets = (this.settings.widgetPanel && Array.isArray(this.settings.widgetPanel.widgets))
        ? this.settings.widgetPanel.widgets : [];

    if (widgets.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'widget-panel-empty';
        empty.textContent = '暂无小组件，可在设置中添加';
        grid.appendChild(empty);
    } else {
        widgets.forEach(config => {
            const widget = this.createWidgetInstance(config);
            if (widget) {
                try {
                    widget.render(grid);
                    this.widgetInstances.push(widget);
                } catch (e) {
                    console.warn('[WidgetPanel] 渲染小组件失败:', config.type, e);
                }
            }
        });
    }

    this.updateWidgetPanelVisibility();

    // 长方形高度 = 正方形宽度（列宽），通过 JS 计算确保与正方形完全一致
    this.syncWidgetCardHeights();
},
syncWidgetCardHeights () {
    const grid = document.getElementById('widget-panel-grid');
    if (!grid) return;

    // 等待布局完成后再测量
    requestAnimationFrame(() => {
        if (!grid.isConnected) return;
        const gap = 8; // grid gap（与 CSS 一致）
        const colWidth = (grid.clientWidth - gap) / 2;
        if (!(colWidth > 0)) return;

        // 设置 grid 行高 = 正方形宽度（列宽）
        // 正方形（1列）与长方形（2列）均被 stretch 填满行高，两者高度完全一致
        grid.style.gridAutoRows = colWidth + 'px';
    });
},
isWidgetPanelActive () {
    return !!(this.settings.widgetPanel
        && Array.isArray(this.settings.widgetPanel.widgets)
        && this.settings.widgetPanel.widgets.length > 0);
},
updateWidgetPanelVisibility () {
    const panel = document.getElementById('widget-panel');
    const container = document.getElementById('widget-panel-container');
    if (!panel) return;
    const enabled = this.isWidgetPanelActive();
    if (enabled) {
        panel.classList.add('active');
        // 重新初始化交互（处理"先禁用再启用"的情况，确保 mousemove 监听器已绑定）
        if (!this._widgetPanelMouseMoveHandler) {
            this.initWidgetPanel();
            return;
        }
        // 当前视图处于固定状态时，面板显隐由固定配置接管
        const fixed = this.isScrolled
            ? this.settings.fixSidebarWallpaper
            : (this.settings.fixSidebarEnabled && this.settings.fixSidebarHomepage);
        if (fixed) {
            this.syncSidebarFixedState();
            return;
        }
        // 确保容器初始为隐藏状态（与侧边栏保持一致）
        if (container) {
            container.classList.remove('visible');
            container.classList.add('hiding');
        }
    } else {
        panel.classList.remove('active');
        // 无小组件时始终隐藏面板容器（不显示空面板）
        if (container) {
            container.classList.remove('visible');
            container.classList.add('hiding');
        }
        document.body.classList.remove('widget-panel-open');
        this.cleanupWidgetPanel();
    }
},
syncWidgetPanelsForWallpaper (wallpaperMode) {
    // 进入壁纸模式：壁纸模式固定独立生效，一律由固定配置接管
    if (wallpaperMode) {
        this.syncSidebarFixedState();
        return;
    }

    // 退出壁纸模式：主开关开启时由固定配置接管（主页面固定）
    if (this.settings.fixSidebarEnabled) {
        this.syncSidebarFixedState();
        return;
    }

    // 恢复 hover 控制：清除 visible 与推动残留（widget-panel-open / sidebar-visible）
    const sidebarContainer = document.getElementById('quick-access-sidebar-container');
    const widgetContainer = document.getElementById('widget-panel-container');
    document.body.classList.remove('widget-panel-open');
    document.body.classList.remove('sidebar-visible');
    document.body.classList.remove('sidebar-fixed');
    [sidebarContainer, widgetContainer].forEach(container => {
        if (!container) return;
        container.classList.remove('visible');
        container.classList.add('hiding');
    });
},
syncSidebarFixedState () {
    const sidebarContainer = document.getElementById('quick-access-sidebar-container');
    const widgetContainer = document.getElementById('widget-panel-container');
    // sidebar-fixed 标记：主开关开启或壁纸模式固定关闭时需要（后者用于 CSS 覆盖 body.scrolled 的常显示规则）
    document.body.classList.toggle('sidebar-fixed', !!this.settings.fixSidebarEnabled || !this.settings.fixSidebarWallpaper);

    // 当前视图是否固定显示（壁纸模式固定独立生效）
    const fixed = this.isScrolled
        ? this.settings.fixSidebarWallpaper
        : (this.settings.fixSidebarEnabled && this.settings.fixSidebarHomepage);
    // 侧边栏固定还需快速访问侧边栏功能开启；小组件面板固定还需面板有内容
    const sidebarFixed = fixed && this.settings.quickAccessSidebar;
    const widgetFixed = fixed && this.isWidgetPanelActive();

    if (sidebarFixed) {
        // 固定显示：清除 hiding 残留，确保可见
        sidebarContainer.classList.remove('hiding');
        if (!sidebarContainer.classList.contains('visible')) {
            sidebarContainer.classList.add('visible');
        }
    } else {
        sidebarContainer.classList.remove('visible');
        sidebarContainer.classList.add('hiding');
    }

    if (widgetFixed) {
        // 固定显示：清除 hiding 残留，确保可见
        widgetContainer.classList.remove('hiding');
        if (!widgetContainer.classList.contains('visible')) {
            widgetContainer.classList.add('visible');
        }
    } else {
        widgetContainer.classList.remove('visible');
        widgetContainer.classList.add('hiding');
    }

    // 清除推动残留（widget-panel-open / sidebar-visible），避免固定状态误触发推挤
    document.body.classList.remove('widget-panel-open');
    document.body.classList.remove('sidebar-visible');
},
initWidgetPanel () {
    // 幂等：若 mousemove 监听器已绑定（非首次调用），跳过
    if (this._widgetPanelMouseMoveHandler) return;
    const container = document.getElementById('widget-panel-container');
    const panel = document.getElementById('widget-panel');

    if (!container || !panel) return;

    let hideTimeout = null;
    let isVisible = false;
    const TRIGGER_ZONE_WIDTH = 100;   // 左侧触发区域宽度（像素）
    const HIDE_DELAY = 0;            // 鼠标离开后延一帧隐藏（防抖窗口：快速移回则 clearTimeout 先于回调执行）

    const showPanel = () => {
        if (!this.isWidgetPanelActive()) return;
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
            document.body.classList.add('widget-panel-open');
            // 面板可见后重新同步卡片高度（隐藏时无法测量宽度）
            this.syncWidgetCardHeights();
        }
    };

    const scheduleHide = () => {
        if (hideTimeout) clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            if (!isVisible) return;
            // 当前视图处于固定模式时，不被 hover 隐藏
            if (this.isSidebarFixed()) return;
            // HIDE_DELAY=0 提供一帧窗口：若鼠标仍在面板上，下一帧 mousemove 会触发 showPanel 清除此回调
            isVisible = false;
            container.classList.remove('visible');
            container.classList.add('hiding');
            document.body.classList.remove('widget-panel-open');
            hideTimeout = null;
        }, HIDE_DELAY);
    };

    // 全局鼠标移动检测：触发区显示面板，鼠标进入面板范围维持显示，离开则关闭
    const widgetPanelMouseMoveHandler = (e) => {
        if (!this.isWidgetPanelActive()) return;
        const modal = document.getElementById('settings-modal');
        if (modal && modal.classList.contains('show')) return;
        const mouseX = e.clientX;

        if (mouseX <= TRIGGER_ZONE_WIDTH) {
            // 当前视图处于固定模式时，无需 hover 触发
            if (this.isSidebarFixed()) return;
            showPanel();
        } else if (!this.isSidebarFixed()) {
            const containerRect = container.getBoundingClientRect();
            const isOverContainer = (
                mouseX >= containerRect.left &&
                mouseX <= containerRect.right &&
                e.clientY >= containerRect.top &&
                e.clientY <= containerRect.bottom
            );
            if (isOverContainer) {
                showPanel();
            } else if (isVisible) {
                scheduleHide();
            }
        }
    };
    this._widgetPanelMouseMoveHandler = widgetPanelMouseMoveHandler;
    document.addEventListener('mousemove', widgetPanelMouseMoveHandler);

    // 面板滚轮：内容溢出时拦截（只滚动面板内容，不触发壁纸模式进退）；
    // 内容不溢出时放行（交给页面滚动处理）
    const panelWheelHandler = (e) => {
        const maxScroll = container.scrollHeight - container.clientHeight;
        if (maxScroll <= 0) return; // 内容不溢出，放行
        e.stopPropagation();        // 内容溢出：拦截，只滚动面板内容
    };
    this._widgetPanelEl = panel;
    this._widgetPanelContainer = container;
    this._widgetPanelWheelHandler = panelWheelHandler;
    panel.addEventListener('wheel', panelWheelHandler, { passive: true });
    container.addEventListener('wheel', panelWheelHandler, { passive: true });
},
cleanupWidgetPanel () {
    if (this._widgetPanelMouseMoveHandler) {
        document.removeEventListener('mousemove', this._widgetPanelMouseMoveHandler);
        this._widgetPanelMouseMoveHandler = null;
    }
    if (this._widgetPanelWheelHandler) {
        if (this._widgetPanelEl) this._widgetPanelEl.removeEventListener('wheel', this._widgetPanelWheelHandler);
        if (this._widgetPanelContainer) this._widgetPanelContainer.removeEventListener('wheel', this._widgetPanelWheelHandler);
        this._widgetPanelWheelHandler = null;
    }
},
syncWidgetPanelUI () {
    const manageGroup = document.getElementById('widget-panel-manage-group');
    if (!manageGroup) return;
    // 始终显示，列表为空时由管理界面提示"暂无小组件"
    manageGroup.style.display = 'block';
},
saveWidgetSettings () {
    this.saveSettings();
},
saveWidgetData (widgetId, data) {
    const widgets = this.settings.widgetPanel && this.settings.widgetPanel.widgets;
    if (!Array.isArray(widgets)) return;
    const idx = widgets.findIndex(w => w.id === widgetId);
    if (idx >= 0) {
        widgets[idx].data = data;
        this.saveSettings();
    }
},
openWidgetSettings (widgetId) {
    this.openSettings('badge');
    setTimeout(() => {
        this.showWidgetPanelMenuInRightPanel();
        // 尝试滚动到指定小组件
        if (widgetId) {
            setTimeout(() => {
                const item = document.querySelector(`.widget-menu-item[data-widget-id="${widgetId}"]`);
                if (item) item.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 150);
        }
    }, 100);
},
showWidgetPanelMenuInRightPanel (skipAnimation) {
    const self = this;
    const rightPanelUpper = document.getElementById('right-panel-upper');
    if (!rightPanelUpper) return;
    const settingsModal = document.getElementById('settings-modal');
    if (settingsModal) settingsModal.classList.add('right-panel-open');

    rightPanelUpper.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'settings-menu-container' + (skipAnimation ? '' : ' slide-in-right');

    const listContainer = document.createElement('div');
    listContainer.className = 'widget-panel-list-container';
    container.appendChild(listContainer);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'settings-menu-button-container';

    const plusBtn = document.createElement('button');
    plusBtn.className = 'upload-btn settings-plus-btn';
    plusBtn.textContent = '+';
    plusBtn.title = '添加小组件';

    // 导出按钮
    const exportBtn = document.createElement('button');
    exportBtn.className = 'settings-import-btn settings-export-btn';
    exportBtn.title = '导出小组件配置为 JSON';
    exportBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>';

    // 导入按钮
    const importBtn = document.createElement('button');
    importBtn.className = 'settings-import-btn';
    importBtn.title = '导入小组件配置';
    importBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';

    const ioRow = document.createElement('div');
    ioRow.className = 'quick-links-io-row';
    ioRow.appendChild(exportBtn);
    ioRow.appendChild(importBtn);

    buttonContainer.appendChild(ioRow);
    buttonContainer.appendChild(plusBtn);
    container.appendChild(buttonContainer);

    rightPanelUpper.appendChild(container);

    this.updateWidgetPanelListInMenu(listContainer);

    // "+" 按钮：显示类型选择器
    plusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        self.showWidgetTypePicker(container, listContainer, buttonContainer);
    });

    // 导出
    exportBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        self.exportWidgets();
    });

    // 导入
    importBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.addEventListener('change', () => {
            const file = input.files && input.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => self.importWidgets(reader.result, listContainer);
            reader.readAsText(file);
        });
        input.click();
    });
},
updateWidgetPanelListInMenu (listContainer) {
    const self = this;
    if (!listContainer) return;
    if (listContainer._sortable) { listContainer._sortable.destroy(); listContainer._sortable = null; }
    listContainer.innerHTML = '';

    const widgets = (this.settings.widgetPanel && Array.isArray(this.settings.widgetPanel.widgets))
        ? this.settings.widgetPanel.widgets : [];

    if (widgets.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'quick-links-empty';
        empty.textContent = '暂无小组件，可在设置中添加';
        listContainer.appendChild(empty);
        return;
    }

    // 使用 DocumentFragment 批量构建条目
    const fragment = document.createDocumentFragment();

    widgets.forEach((widget, index) => {
        const meta = this.WIDGET_TYPES[widget.type] || { name: widget.type, icon: 'widgets' };

        const item = document.createElement('div');
        item.className = 'widget-menu-item';
        item.setAttribute('data-index', index);
        item.setAttribute('data-widget-id', widget.id);
        // 保存对 settings 对象的引用：拖动提交时按此重排，保留 data/size 等配置
        item._sortRef = widget;

        // 拖拽手柄（复用快速访问链接样式）
        const dragHandle = document.createElement('div');
        dragHandle.className = 'quick-link-drag-handle';
        dragHandle.innerHTML = '<span></span><span></span>';
        dragHandle.title = '拖拽排序';

        const typeIcon = document.createElement('span');
        typeIcon.className = 'material-icons';
        typeIcon.style.cssText = 'font-size:20px;color:var(--scheme-accent);flex-shrink:0;';
        typeIcon.textContent = meta.icon;

        const info = document.createElement('div');
        info.className = 'widget-menu-info';

        const nameRow = document.createElement('div');
        nameRow.className = 'widget-menu-name';

        const name = document.createElement('span');
        name.textContent = meta.name;
        nameRow.appendChild(name);

        const typeLabel = document.createElement('span');
        typeLabel.className = 'widget-type-label';
        typeLabel.textContent = self.getWidgetSizeLabel(widget.type, widget.size);
        nameRow.appendChild(typeLabel);

        const sub = document.createElement('div');
        sub.className = 'widget-menu-sub';
        sub.textContent = self.getWidgetSubtitle(widget);

        info.appendChild(nameRow);
        info.appendChild(sub);

        // 点击条目编辑（参考快速访问链接）
        info.addEventListener('click', (e) => {
            e.stopPropagation();
            const container = listContainer.closest('.settings-menu-container');
            const currentIndex = parseInt(item.getAttribute('data-index'), 10);
            const currentWidget = self.settings.widgetPanel.widgets[currentIndex];
            if (currentWidget) {
                self.showWidgetConfigForm(listContainer, currentWidget);
            }
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-link-menu-btn';
        deleteBtn.textContent = '×';
        deleteBtn.title = '删除小组件';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const currentIndex = parseInt(item.getAttribute('data-index'), 10);
            if (isNaN(currentIndex) || currentIndex < 0 || currentIndex >= self.settings.widgetPanel.widgets.length) return;
            const removed = self.settings.widgetPanel.widgets[currentIndex];
            const removedName = self.WIDGET_TYPES[removed.type] ? self.WIDGET_TYPES[removed.type].name : '小组件';
            self.settings.widgetPanel.widgets.splice(currentIndex, 1);
            self.saveWidgetSettings();
            self.renderWidgetPanel();
            self.updateWidgetPanelListInMenu(listContainer);
            self.showNotification('"' + removedName + '" 已删除');
        });

        item.appendChild(dragHandle);
        item.appendChild(typeIcon);
        item.appendChild(info);
        item.appendChild(deleteBtn);
        fragment.appendChild(item);
    });

    listContainer.appendChild(fragment);

    // 接管拖动排序（整行可拖，移动超过阈值才算拖动；轻点仍进入编辑）
    listContainer._sortable = attachSortableList(listContainer, {
        itemSelector: '.widget-menu-item',
        onCommit: (items) => {
            // 按新 DOM 顺序重排同一批对象引用，保留 data/size 等配置
            self.settings.widgetPanel.widgets = items.map(el => el._sortRef);
            items.forEach((el, i) => el.setAttribute('data-index', i));
            self.saveWidgetSettings();
            self.renderWidgetPanel();
            self.showNotification('顺序已调整');
        }
    });
},
getWidgetSubtitle (widget) {
    const data = widget.data || {};
    switch (widget.type) {
        case 'weather': return data.city ? '城市：' + data.city : '默认城市：南昌';
        case 'ai-agent': return data.port ? '端口：' + data.port : '未配置端口';
        case 'email': return data.apiUrl ? 'API：' + data.apiUrl : (data.provider || 'gmail');
        case 'tasks': {
            const n = Array.isArray(data.items) ? data.items.length : 0;
            return '任务' + (n ? ' · ' + n + ' 个' : '');
        }
        case 'clock': return '本地时间';
        case 'calendar': return '本地日期与农历';
        default: return '';
    }
},
showWidgetTypePicker (container, listContainer, buttonContainer) {
    const self = this;

    // 标记当前子视图（ESC 返回列表用）
    const rpu = document.getElementById('right-panel-upper');
    if (rpu) rpu.dataset.subView = 'widget-type-picker';

    // 添加流程中隐藏底部导出/导入/+ 按钮
    if (buttonContainer) {
        const ioRow = buttonContainer.querySelector('.quick-links-io-row');
        const plusBtn = buttonContainer.querySelector('.settings-plus-btn');
        if (ioRow) ioRow.style.display = 'none';
        if (plusBtn) plusBtn.style.display = 'none';
    }

    const exitTo = (fn) => {
        self.exitWidgetFormView(listContainer, () => {
            self.restoreWidgetPanelButtons();
            fn && fn();
        });
    };

    this.showWidgetFormView(listContainer, (view) => {
        const title = document.createElement('div');
        title.className = 'widget-add-form';
        title.style.cssText = 'padding-bottom:0;';
        const tRow = document.createElement('div');
        tRow.className = 'widget-add-form-row';
        const tLabel = document.createElement('label');
        tLabel.textContent = '选择小组件类型';
        tRow.appendChild(tLabel);
        title.appendChild(tRow);
        view.appendChild(title);

        const picker = document.createElement('div');
        picker.className = 'widget-type-picker';

        Object.keys(self.WIDGET_TYPES).forEach(type => {
            const meta = self.WIDGET_TYPES[type];
            const item = document.createElement('button');
            item.className = 'widget-type-picker-item';
            item.innerHTML = '<span class="material-icons">' + meta.icon + '</span><span>' + meta.name + '</span>';
            item.addEventListener('click', () => {
                // 先滑出类型选择器，再进入配置表单
                self.exitWidgetFormView(listContainer, () => {
                    self.showWidgetConfigForm(listContainer, null, type);
                });
            });
            picker.appendChild(item);
        });

        view.appendChild(picker);

        // 返回按钮
        const backRow = document.createElement('div');
        backRow.className = 'widget-add-form';
        backRow.style.cssText = 'padding-top:0;';
        const backBtn = document.createElement('button');
        backBtn.className = 'widget-add-form-btn cancel';
        backBtn.textContent = '← 返回列表';
        backBtn.addEventListener('click', () => {
            exitTo(() => self.updateWidgetPanelListInMenu(listContainer));
        });
        backRow.appendChild(backBtn);
        view.appendChild(backRow);
    });
},
showWidgetFormView (listContainer, buildContentFn) {
    listContainer.innerHTML = '';
    const view = document.createElement('div');
    view.className = 'widget-form-view';
    buildContentFn(view);
    listContainer.appendChild(view);
    requestAnimationFrame(() => {
        view.classList.add('slide-in-right');
    });
    return view;
},
exitWidgetFormView (listContainer, callback) {
    const view = listContainer.querySelector('.widget-form-view');

    // 底部表单按钮（确定/取消）同步滑出
    const rpu = document.getElementById('right-panel-upper');
    const buttonContainer = rpu ? rpu.querySelector('.settings-menu-button-container') : null;
    const btnRow = buttonContainer ? buttonContainer.querySelector('.widget-form-bottom-buttons') : null;

    const targets = [];
    if (view) targets.push(view);
    if (btnRow) targets.push(btnRow);

    if (targets.length === 0) {
        if (callback) callback();
        return;
    }

    let pending = targets.length;
    const onDone = () => {
        pending--;
        if (pending > 0) return;
        targets.forEach(t => {
            if (t.parentNode) t.parentNode.removeChild(t);
        });
        if (callback) callback();
    };

    targets.forEach(t => {
        t.classList.remove('slide-in-right');
        t.classList.add('slide-out-right');
        t.addEventListener('animationend', onDone, { once: true });
        // 兜底：动画异常时 300ms 后强制完成
        setTimeout(() => {
            if (t.parentNode) {
                t.dispatchEvent(new Event('animationend'));
            }
        }, 300);
    });
},
restoreWidgetPanelButtons () {
    const rpu = document.getElementById('right-panel-upper');
    if (!rpu) return;
    const container = rpu.querySelector('.settings-menu-container');
    const buttonContainer = container ? container.querySelector('.settings-menu-button-container') : null;
    if (buttonContainer) {
        const ioRow = buttonContainer.querySelector('.quick-links-io-row');
        const plusBtn = buttonContainer.querySelector('.settings-plus-btn');
        const formBtns = buttonContainer.querySelector('.widget-form-bottom-buttons');
        if (ioRow) ioRow.style.display = '';
        if (plusBtn) plusBtn.style.display = '';
        if (formBtns && formBtns.parentNode) formBtns.parentNode.removeChild(formBtns);

        // 恢复的按钮滑入（避免闪现）
        requestAnimationFrame(() => {
            if (ioRow) {
                ioRow.classList.remove('slide-in-right');
                void ioRow.offsetWidth; // 强制回流以重启动画
                ioRow.classList.add('slide-in-right');
            }
            if (plusBtn) {
                plusBtn.classList.remove('slide-in-right');
                void plusBtn.offsetWidth;
                plusBtn.classList.add('slide-in-right');
            }
        });
    }
    delete rpu.dataset.subView;
},
showWidgetConfigForm (listContainer, widget, presetType) {
    const self = this;
    const type = widget ? widget.type : presetType;
    if (!type || !this.WIDGET_TYPES[type]) return;

    const meta = this.WIDGET_TYPES[type];
    const data = widget ? (widget.data || {}) : {};
    const currentSize = this.normalizeWidgetSize(type, widget ? widget.size : meta.defaultSize);

    // 找到底部按钮容器（导出/导入/+ 所在位置）
    const container = listContainer.closest('.settings-menu-container');
    const buttonContainer = container ? container.querySelector('.settings-menu-button-container') : null;

    // 标记当前子视图（ESC 返回列表用）
    const rpu = document.getElementById('right-panel-upper');
    if (rpu) rpu.dataset.subView = 'widget-config';

    // 进入表单模式：隐藏导出/导入/+ 按钮
    let ioRow = null, plusBtn = null;
    if (buttonContainer) {
        ioRow = buttonContainer.querySelector('.quick-links-io-row');
        plusBtn = buttonContainer.querySelector('.settings-plus-btn');
        if (ioRow) ioRow.style.display = 'none';
        if (plusBtn) plusBtn.style.display = 'none';
    }

    listContainer.innerHTML = '';

    // 表单视图容器（带滑入动画）
    const formView = document.createElement('div');
    formView.className = 'widget-form-view';
    listContainer.appendChild(formView);

    const form = document.createElement('div');
    form.className = 'widget-add-form';

    // 类型（只读展示）
    const typeRow = document.createElement('div');
    typeRow.className = 'widget-add-form-row';
    const typeLabel = document.createElement('label');
    typeLabel.textContent = '类型';
    const typeVal = document.createElement('div');
    typeVal.textContent = meta.name;
    typeVal.style.cssText = 'font-size:13px;color:var(--text-color);';
    typeRow.appendChild(typeLabel);
    typeRow.appendChild(typeVal);
    form.appendChild(typeRow);

    // 尺寸分段滑块（iOS 26 分段切换器风格：小 / 大 / 超大）
    // 允许尺寸由类型元信息决定：不允许小尺寸的类型（任务/AI Agent/邮箱）只显示 大/超大
    const allowedSizes = this.getWidgetAllowedSizes(type);
    const currentIdx = allowedSizes.indexOf(currentSize);
    const hasSuper = allowedSizes.indexOf('super') >= 0;
    const hasSquare = allowedSizes.indexOf('square') >= 0;

    const sizeRow = document.createElement('div');
    sizeRow.className = 'widget-size-row';
    const sizeLabel = document.createElement('label');
    sizeLabel.textContent = '尺寸';

    const seg = document.createElement('div');
    seg.className = 'widget-size-segmented ' + (allowedSizes.length === 3 ? 'seg-3' : 'seg-2')
        + (hasSquare ? '' : ' no-square');

    const segThumb = document.createElement('div');
    segThumb.className = 'widget-size-seg-thumb';

    let squareLbl = null;
    if (hasSquare) {
        squareLbl = document.createElement('span');
        squareLbl.className = 'widget-size-seg-label widget-size-seg-label-square';
        squareLbl.textContent = '小';
    }

    const rectLbl = document.createElement('span');
    rectLbl.className = 'widget-size-seg-label widget-size-seg-label-rect';
    rectLbl.textContent = '大';

    let superLbl = null;
    if (hasSuper) {
        superLbl = document.createElement('span');
        superLbl.className = 'widget-size-seg-label widget-size-seg-label-super';
        superLbl.textContent = '超大';
    }

    // 透明 range 覆盖层：负责拖动与点击切换（视觉由下方分段控件呈现）
    const sizeSlider = document.createElement('input');
    sizeSlider.type = 'range';
    sizeSlider.min = '0';
    sizeSlider.max = String(allowedSizes.length - 1);
    sizeSlider.step = '1';
    sizeSlider.className = 'widget-size-seg-input';
    sizeSlider.value = String(currentIdx >= 0 ? currentIdx : 0);

    seg.appendChild(segThumb);
    if (squareLbl) seg.appendChild(squareLbl);
    seg.appendChild(rectLbl);
    if (superLbl) seg.appendChild(superLbl);
    seg.appendChild(sizeSlider);

    const updateSeg = () => {
        const v = sizeSlider.value;
        const idx = parseInt(v, 10);
        const size = allowedSizes[idx] || allowedSizes[allowedSizes.length - 1];
        seg.classList.toggle('rect', size === 'rectangle');
        seg.classList.toggle('super', size === 'super');
        if (squareLbl) squareLbl.classList.toggle('active', size === 'square');
        rectLbl.classList.toggle('active', size === 'rectangle');
        if (superLbl) superLbl.classList.toggle('active', size === 'super');
    };
    sizeSlider.addEventListener('input', updateSeg);
    updateSeg();

    sizeRow.appendChild(sizeLabel);
    sizeRow.appendChild(seg);
    form.appendChild(sizeRow);

    // 类型专属配置
    const extraFields = {};

    if (type === 'weather') {
        const cityRow = document.createElement('div');
        cityRow.className = 'widget-add-form-row';
        const cityLabel = document.createElement('label');
        cityLabel.textContent = '城市（默认南昌，留空自动定位）';
        cityRow.appendChild(cityLabel);
        const inputWrap = document.createElement('div');
        inputWrap.className = 'widget-input-row';
        const cityInput = document.createElement('input');
        cityInput.type = 'text';
        cityInput.placeholder = '城市';
        cityInput.value = data.city && data.city !== '当前位置' ? data.city : '';
        inputWrap.appendChild(cityInput);
        const geoBtn = document.createElement('button');
        geoBtn.className = 'widget-input-btn';
        geoBtn.innerHTML = '<span class="material-icons" style="font-size:15px">my_location</span>定位';
        geoBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    pos => { cityInput.value = '当前位置'; },
                    () => { cityInput.value = '定位失败，请手动输入'; }
                );
            } else {
                cityInput.value = '浏览器不支持定位';
            }
        });
        inputWrap.appendChild(geoBtn);
        cityRow.appendChild(inputWrap);
        form.appendChild(cityRow);
        extraFields.city = cityInput;
    }

    if (type === 'ai-agent') {
        const portRow = document.createElement('div');
        portRow.className = 'widget-add-form-row';
        const portLabel = document.createElement('label');
        portLabel.textContent = '端口号';
        portRow.appendChild(portLabel);
        const inputWrap = document.createElement('div');
        inputWrap.className = 'widget-input-row';
        const portInput = document.createElement('input');
        portInput.type = 'number';
        portInput.min = '1';
        portInput.max = '65535';
        portInput.placeholder = '如：8899';
        portInput.value = data.port || '';
        inputWrap.appendChild(portInput);
        const testBtn = document.createElement('button');
        testBtn.className = 'widget-input-btn';
        testBtn.innerHTML = '<span class="material-icons" style="font-size:15px">speed</span>测试';
        testBtn.addEventListener('click', () => {
            const port = portInput.value.trim();
            if (!port) { portInput.value = '端口号'; return; }
            self.showNotification('正在测试 127.0.0.1:' + port + '…');
        });
        inputWrap.appendChild(testBtn);
        portRow.appendChild(inputWrap);
        const hint = document.createElement('div');
        hint.className = 'widget-add-form-hint';
        hint.textContent = 'SI Agent 服务地址为 127.0.0.1:' + (data.port || '端口号') + '，需本地已运行对应服务';
        portRow.appendChild(hint);
        form.appendChild(portRow);
        extraFields.port = portInput;
    }

    if (type === 'email') {
        // 服务商选择
        const providerRow = document.createElement('div');
        providerRow.className = 'widget-add-form-row';
        const providerLabel = document.createElement('label');
        providerLabel.textContent = '邮箱服务商';
        const providerSelect = document.createElement('select');
        const providers = [
            { v: 'gmail', t: 'Gmail' },
            { v: 'outlook', t: 'Outlook' },
            { v: 'qq', t: 'QQ邮箱' },
            { v: 'custom', t: '自定义' }
        ];
        providers.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.v;
            opt.textContent = p.t;
            providerSelect.appendChild(opt);
        });
        providerSelect.value = data.provider || 'gmail';
        providerRow.appendChild(providerLabel);
        providerRow.appendChild(providerSelect);
        form.appendChild(providerRow);

        extraFields.provider = providerSelect;

        // Gmail Google 连接面板
        const gmailPanel = document.createElement('div');
        gmailPanel.className = 'widget-add-form-row widget-google-tasks-panel';
        gmailPanel.style.display = (providerSelect.value === 'gmail') ? '' : 'none';

        const gmailIsConnected = !!(data && data.googleConnected);

        const topRow = document.createElement('div');
        topRow.className = 'gtasks-top';
        const statusDot = document.createElement('span');
        statusDot.className = 'gtasks-dot' + (gmailIsConnected ? ' on' : '');
        const statusLabel = document.createElement('span');
        statusLabel.className = 'gtasks-top-label';
        statusLabel.textContent = gmailIsConnected ? 'Gmail 已连接' : 'Gmail 未连接';
        const infoBtn = document.createElement('button');
        infoBtn.className = 'gtasks-info-btn';
        infoBtn.innerHTML = '<span class="material-icons">info_outline</span>';
        infoBtn.title = '查看连接教程';
        infoBtn.addEventListener('click', () => this.showGmailTutorial());
        topRow.appendChild(statusDot);
        topRow.appendChild(statusLabel);
        topRow.appendChild(infoBtn);
        gmailPanel.appendChild(topRow);

        if (gmailIsConnected) {
            const emailEl = document.createElement('div');
            emailEl.className = 'gtasks-email';
            emailEl.textContent = data.googleEmail || '';
            gmailPanel.appendChild(emailEl);

            const disconnectBtn = document.createElement('button');
            disconnectBtn.className = 'gtasks-btn gtasks-btn-disconnect';
            disconnectBtn.textContent = '断开连接';
            disconnectBtn.addEventListener('click', () => {
                const wi = (self.widgetInstances || []).find(w => w.id === widget.id);
                if (wi && typeof wi.disconnectGoogle === 'function') {
                    wi.disconnectGoogle();
                } else {
                    data.googleConnected = false;
                    data.googleEmail = '';
                    data.googleToken = '';
                    self.saveWidgetSettings();
                }
                self.showNotification('已断开 Gmail');
                self.showWidgetConfigForm(listContainer, widget, presetType);
            });
            gmailPanel.appendChild(disconnectBtn);
        } else {
            const inputRow = document.createElement('div');
            inputRow.className = 'gtasks-input-row';

            const clientIdInput = document.createElement('input');
            clientIdInput.type = 'text';
            clientIdInput.className = 'gtasks-clientid-input';
            clientIdInput.placeholder = 'Client ID';
            clientIdInput.value = data.googleClientId || '';
            clientIdInput.maxLength = 200;

            const connectBtn = document.createElement('button');
            connectBtn.className = 'gtasks-btn gtasks-btn-connect';
            connectBtn.innerHTML = '<span class="material-icons">link</span>连接';
            connectBtn.addEventListener('click', async () => {
                const clientId = clientIdInput.value.trim();
                if (!clientId || !clientId.endsWith('.apps.googleusercontent.com')) {
                    self.showNotification('请输入有效的 Client ID');
                    clientIdInput.focus();
                    return;
                }
                if (!widget) {
                    self.showNotification('请先点击"确定"保存小组件，再连接 Google');
                    return;
                }
                connectBtn.disabled = true;
                connectBtn.innerHTML = '<span class="material-icons">hourglass_top</span>';
                try {
                    const wi = (self.widgetInstances || []).find(w => w.id === widget.id);
                    if (wi && typeof wi.connectGoogle === 'function') {
                        await wi.connectGoogle(clientId);
                    } else {
                        throw new Error('小组件实例未就绪');
                    }
                    self.showNotification('Gmail 已连接');
                    self.showWidgetConfigForm(listContainer, widget, presetType);
                } catch (e) {
                    self.showNotification('连接失败：' + (e.message || '请检查 Client ID'));
                    connectBtn.disabled = false;
                    connectBtn.innerHTML = '<span class="material-icons">link</span>连接';
                }
            });

            inputRow.appendChild(clientIdInput);
            inputRow.appendChild(connectBtn);
            gmailPanel.appendChild(inputRow);
        }

        form.appendChild(gmailPanel);

        // 切换服务商时显示/隐藏 Gmail 面板
        providerSelect.addEventListener('change', () => {
            gmailPanel.style.display = providerSelect.value === 'gmail' ? '' : 'none';
        });

        // 其他服务商：API 地址（非 Gmail 时显示）
        const apiRow = document.createElement('div');
        apiRow.className = 'widget-add-form-row';
        apiRow.style.display = (providerSelect.value === 'gmail') ? 'none' : '';
        const apiLabel = document.createElement('label');
        apiLabel.textContent = '邮件 API 地址（可选）';
        apiRow.appendChild(apiLabel);
        const inputWrap = document.createElement('div');
        inputWrap.className = 'widget-input-row';
        const apiInput = document.createElement('input');
        apiInput.type = 'text';
        apiInput.placeholder = '如：http://127.0.0.1:8899/api/emails';
        apiInput.value = data.apiUrl || '';
        inputWrap.appendChild(apiInput);
        const testBtn = document.createElement('button');
        testBtn.className = 'widget-input-btn';
        testBtn.innerHTML = '<span class="material-icons" style="font-size:15px">test_activity</span>测试';
        testBtn.addEventListener('click', () => {
            const url = apiInput.value.trim();
            if (!url) { apiInput.value = '请输入 API 地址'; return; }
            self.showNotification('正在测试 ' + url + '…');
        });
        inputWrap.appendChild(testBtn);
        apiRow.appendChild(inputWrap);
        const apiHint = document.createElement('div');
        apiHint.className = 'widget-add-form-hint';
        apiHint.textContent = '留空则仅提供网页版入口；配置后返回 { emails: [{from, subject, time}] }';
        apiRow.appendChild(apiHint);
        form.appendChild(apiRow);
        extraFields.apiUrl = apiInput;

        // 切换时同步显示/隐藏 API 行
        providerSelect.addEventListener('change', () => {
            apiRow.style.display = providerSelect.value === 'gmail' ? 'none' : '';
        });
    }

    formView.appendChild(form);

    // 滑入动画
    requestAnimationFrame(() => {
        formView.classList.add('slide-in-right');
    });

    // 底部按钮：确定/取消（放入底部按钮容器，替代导出/导入/+）
    const btnRow = document.createElement('div');
    btnRow.className = 'widget-form-bottom-buttons';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'widget-add-form-btn cancel';
    cancelBtn.textContent = '取消';

    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'widget-add-form-btn confirm';
    confirmBtn.textContent = '确定';

    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(confirmBtn);

    if (buttonContainer) {
        buttonContainer.appendChild(btnRow);
        // 底部按钮与表单内容同步滑入
        requestAnimationFrame(() => {
            btnRow.classList.add('slide-in-right');
        });
    } else {
        form.appendChild(btnRow); // 兜底：找不到容器时直接放表单底部
    }

    // 退出表单：滑出动画后恢复导出/导入/+ 按钮，回到列表
    const exitForm = (backToList) => {
        self.exitWidgetFormView(listContainer, () => {
            self.restoreWidgetPanelButtons();
            if (backToList) self.updateWidgetPanelListInMenu(listContainer);
        });
    };

    cancelBtn.addEventListener('click', () => {
        exitForm(true);
    });

    confirmBtn.addEventListener('click', () => {
        // 尺寸映射：按当前类型允许的尺寸列表取索引对应的尺寸
        const size = allowedSizes[parseInt(sizeSlider.value, 10)] || allowedSizes[allowedSizes.length - 1];
        const newData = {};

        if (extraFields.city) {
            newData.city = extraFields.city.value.trim() || '南昌';
        }
        if (extraFields.port) {
            const port = extraFields.port.value.trim();
            if (port && (!/^\d+$/.test(port) || +port < 1 || +port > 65535)) {
                self.showNotification('端口号无效（1-65535）');
                return;
            }
            newData.port = port;
        }
        if (extraFields.provider) {
            newData.provider = extraFields.provider.value;
            newData.url = self.getEmailProviderUrl(extraFields.provider.value);
        }
        if (extraFields.apiUrl) {
            newData.apiUrl = extraFields.apiUrl.value.trim();
        }

        if (widget) {
            // 编辑：更新配置并重渲染
            widget.size = size;
            widget.data = Object.assign({}, widget.data, newData);
            const idx = self.settings.widgetPanel.widgets.findIndex(w => w.id === widget.id);
            if (idx >= 0) {
                self.settings.widgetPanel.widgets[idx] = {
                    id: widget.id,
                    type: widget.type,
                    size: size,
                    data: Object.assign({}, widget.data, newData)
                };
            }
            self.saveWidgetSettings();
            self.renderWidgetPanel();
            self.showNotification('小组件已更新');
        } else {
            // 添加
            const newWidget = {
                id: self.genWidgetId(),
                type: type,
                size: size,
                data: newData
            };
            self.settings.widgetPanel.widgets.push(newWidget);
            self.saveWidgetSettings();
            self.renderWidgetPanel();
            self.showNotification('小组件已添加');
        }
        exitForm(true);
    });
},
getEmailProviderUrl (provider) {
    const urls = {
        gmail: 'https://mail.google.com',
        outlook: 'https://outlook.live.com/mail/',
        qq: 'https://mail.qq.com',
        custom: ''
    };
    return urls[provider] || '';
},
showGmailTutorial () {
    const overlay = document.createElement('div');
    overlay.className = 'gtasks-tutorial-overlay';
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

    const card = document.createElement('div');
    card.className = 'gtasks-tutorial-card';

    card.innerHTML = [
        '<div class="gtasks-tutorial-header">',
        '  <span class="material-icons">school</span>',
        '  <span>连接 Gmail 教程</span>',
        '</div>',
        '<div class="gtasks-tutorial-steps">',
        '  <div class="gtasks-step"><span class="gtasks-step-num">1</span><div><b>打开</b> <a href="https://console.cloud.google.com" target="_blank">Google Cloud Console</a>，登录你的 Google 账号</div></div>',
        '  <div class="gtasks-step"><span class="gtasks-step-num">2</span><div><b>创建项目</b>（或选择已有项目），点击顶部项目选择器 → 新建项目</div></div>',
        '  <div class="gtasks-step"><span class="gtasks-step-num">3</span><div><b>启用 API</b>：左侧菜单 → API 和服务 → 库 → 搜索 "Gmail API" → 点击启用</div></div>',
        '  <div class="gtasks-step"><span class="gtasks-step-num">4</span><div><b>配置 OAuth 同意屏幕</b>：API 和服务 → OAuth 同意屏幕 → 选"外部" → 填写应用名称 → 保存</div></div>',
        '  <div class="gtasks-step"><span class="gtasks-step-num">5</span><div><b>添加测试用户</b>：OAuth 同意屏幕 → 测试用户 → 添加你的 Gmail 地址（测试阶段必须添加）</div></div>',
        '  <div class="gtasks-step"><span class="gtasks-step-num">6</span><div><b>创建凭据</b>：API 和服务 → 凭据 → 创建 OAuth 客户端 ID → 应用类型选 <b>Chrome 扩展</b></div></div>',
        '  <div class="gtasks-step"><span class="gtasks-step-num">7</span><div><b>填写扩展 ID</b>：打开 <code>chrome://extensions</code> → 复制本扩展的 ID → 粘贴到"已授权的重定向 URI"中，格式为 <code>https://&lt;扩展ID&gt;.chromiumapp.org/</code></div></div>',
        '  <div class="gtasks-step"><span class="gtasks-step-num">8</span><div><b>复制 Client ID</b>：创建完成后复制 Client ID（以 <code>.apps.googleusercontent.com</code> 结尾），粘贴到上方输入框</div></div>',
        '</div>',
        '<div class="gtasks-tutorial-footer">',
        '  <a href="https://console.cloud.google.com/apis/credentials" target="_blank" class="gtasks-btn gtasks-btn-connect" style="text-decoration:none">',
        '    <span class="material-icons">open_in_new</span>打开 Google Cloud Console',
        '  </a>',
        '</div>'
    ].join('');

    overlay.appendChild(card);
    document.body.appendChild(overlay);
},
genWidgetId () {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
        return window.crypto.randomUUID();
    }
    return 'w-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
},
deleteWidget (id) {
    const widgets = this.settings.widgetPanel && this.settings.widgetPanel.widgets;
    if (!Array.isArray(widgets)) return;
    const idx = widgets.findIndex(w => w.id === id);
    if (idx >= 0) {
        const name = this.WIDGET_TYPES[widgets[idx].type] ? this.WIDGET_TYPES[widgets[idx].type].name : '小组件';
        widgets.splice(idx, 1);
        this.saveWidgetSettings();
        this.renderWidgetPanel();
        this.showNotification('"' + name + '" 已删除');
    }
},
exportWidgets () {
    const widgets = (this.settings.widgetPanel && Array.isArray(this.settings.widgetPanel.widgets))
        ? this.settings.widgetPanel.widgets : [];
    if (widgets.length === 0) {
        this.showNotification('没有可导出的小组件');
        return;
    }
    const data = {
        app: 'OOOInterface',
        type: 'widgets',
        version: (typeof VERSION !== 'undefined') ? VERSION : '',
        exportedAt: new Date().toISOString(),
        widgets: widgets.map(w => ({
            id: w.id,
            type: w.type,
            size: this.normalizeWidgetSize(w.type, w.size),
            data: w.data || {}
        }))
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'OOOInterface-Widgets-' + new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-') + '.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        URL.revokeObjectURL(url);
        if (a.parentNode) a.parentNode.removeChild(a);
    }, 0);
    this.showNotification('已导出 ' + widgets.length + ' 个小组件');
},
importWidgets (text, listContainer) {
    const self = this;
    try {
        const data = JSON.parse(text);
        let incoming = [];
        if (Array.isArray(data)) {
            incoming = data;
        } else if (data && Array.isArray(data.widgets)) {
            incoming = data.widgets;
        } else {
            throw new Error('JSON 结构不正确');
        }

        let added = 0;
        incoming.forEach(w => {
            if (!w || !w.type || !this.WIDGET_TYPES[w.type]) return;
            const size = this.normalizeWidgetSize(w.type, w.size);
            const newWidget = {
                id: this.genWidgetId(),
                type: w.type,
                size: size,
                data: w.data || {}
            };
            this.settings.widgetPanel.widgets.push(newWidget);
            added++;
        });

        if (added === 0) {
            this.showNotification('文件中没有有效的小组件');
            return;
        }
        this.saveWidgetSettings();
        this.renderWidgetPanel();
        if (listContainer) this.updateWidgetPanelListInMenu(listContainer);
        this.showNotification('已导入 ' + added + ' 个小组件');
    } catch (e) {
        this.showNotification('导入失败：' + e.message);
    }
},
};

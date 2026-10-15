// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

export const SidePanelBridgeMixin = {
getSidePanelQuickLinksSource () {
    if (!Array.isArray(this.settings.sidePanelQuickLinks)) this.settings.sidePanelQuickLinks = [];
    return this.settings.sidePanelQuickLinks;
},
getSidePanelWidgetsSource () {
    if (!this.settings.sidePanelWidgetPanel || typeof this.settings.sidePanelWidgetPanel !== 'object') {
        this.settings.sidePanelWidgetPanel = { widgets: [] };
    }
    if (!Array.isArray(this.settings.sidePanelWidgetPanel.widgets)) this.settings.sidePanelWidgetPanel.widgets = [];
    return this.settings.sidePanelWidgetPanel.widgets;
},
enterSidePanelScope (needs) {
    this.exitSidePanelScope();
    const swap = {};
    if (needs.quicklinks && this.settings.sidePanelQuickLinksSync === false) {
        if (!Array.isArray(this.settings.sidePanelQuickLinks)) this.settings.sidePanelQuickLinks = [];
        swap.quickLinks = this.settings.quickLinks;
        this.settings.quickLinks = this.settings.sidePanelQuickLinks;
    }
    if (needs.widgets && this.settings.sidePanelWidgetsSync === false) {
        this.getSidePanelWidgetsSource();
        swap.widgetPanel = this.settings.widgetPanel;
        this.settings.widgetPanel = this.settings.sidePanelWidgetPanel;
    }
    if (swap.quickLinks !== undefined || swap.widgetPanel !== undefined) {
        this._spSwap = swap;
    }
},
exitSidePanelScope () {
    if (!this._spSwap) return;
    if (this._spSwap.quickLinks !== undefined) this.settings.quickLinks = this._spSwap.quickLinks;
    if (this._spSwap.widgetPanel !== undefined) this.settings.widgetPanel = this._spSwap.widgetPanel;
    this._spSwap = null;
    this.applyQuickLinks();
    this.renderWidgetPanel();
},
getSidePanelSummary () {
    if (!this.settings.sidePanelEnabled) return '关闭';
    const parts = [];
    if (this.settings.sidePanelShowWidgets) parts.push('小组件');
    if (this.settings.sidePanelShowQuickLinks) parts.push('快速访问');
    if (this.settings.sidePanelShowSearch) parts.push('搜索');
    if (this.settings.sidePanelWallpaperEnabled) parts.push('壁纸');
    return parts.length ? parts.join(' · ') : '开启';
},
spBuildSwitchRow (labelText, checked, onChange) {
    const group = document.createElement('div');
    group.className = 'setting-group';

    const row = document.createElement('div');
    row.className = 'switch-label';
    const label = document.createElement('span');
    label.className = 'setting-label';
    label.textContent = labelText;
    row.appendChild(label);

    const switchWrap = document.createElement('label');
    switchWrap.className = 'switch';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = !!checked;
    const slider = document.createElement('span');
    slider.className = 'slider';
    input.addEventListener('change', () => {
        if (typeof onChange === 'function') onChange(input.checked);
    });
    switchWrap.appendChild(input);
    switchWrap.appendChild(slider);
    row.appendChild(switchWrap);

    group.appendChild(row);
    return group;
},
spBuildNavRow (labelText, statusText, onClick) {
    const group = document.createElement('div');
    group.className = 'setting-group';

    const label = document.createElement('label');
    label.textContent = labelText + ':';
    group.appendChild(label);

    const box = document.createElement('div');
    box.className = 'custom-select';
    const selected = document.createElement('div');
    // select-drill：右向箭头，表示点击进入子页面而非展开下拉（与主设置页的
    // 「小组件列表 / 快速访问链接」两行同款）
    selected.className = 'select-selected select-drill';
    selected.textContent = statusText;
    selected.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick();
    });
    box.appendChild(selected);
    group.appendChild(box);
    return group;
},
getSidePanelNavItems () {
    const self = this;
    return [
        { key: 'widgets', label: '小组件', enabled: () => self.settings.sidePanelShowWidgets, sync: () => self.settings.sidePanelWidgetsSync },
        { key: 'quicklinks', label: '快速访问链接', enabled: () => self.settings.sidePanelShowQuickLinks, sync: () => self.settings.sidePanelQuickLinksSync },
        { key: 'search', label: '搜索框', enabled: () => self.settings.sidePanelShowSearch, sync: null },
        { key: 'wallpaper', label: '壁纸', enabled: () => self.settings.sidePanelWallpaperEnabled, sync: () => self.settings.sidePanelWallpaperSync }
    ];
},
getSidePanelNavStatus (item) {
    return item.enabled() ? (item.sync ? (item.sync() ? '与主页面一致' : '独立配置') : '显示') : '隐藏';
},
renderSidePanelConfigView (rightPanelUpper, skipAnimation) {
    const self = this;
    if (!rightPanelUpper) return;
    rightPanelUpper.innerHTML = '';
    delete rightPanelUpper.dataset.subView;
    rightPanelUpper.dataset.menuType = 'side-panel';
    this._sidePanelView = 'root';

    const wrapper = document.createElement('div');
    wrapper.className = 'side-panel-config-view';
    const container = document.createElement('div');
    container.className = 'settings-menu-container side-panel-root-view' + (skipAnimation ? '' : ' slide-in-right');

    // 主开关（设置主页面同款开关行）；关闭后其下四项直接隐藏，故重建根视图
    container.appendChild(this.spBuildSwitchRow('侧边栏功能', !!this.settings.sidePanelEnabled, (checked) => {
        self.settings.sidePanelEnabled = checked;
        // 侧边栏的主内容就是快速访问链接：开启侧边栏功能时把它一并带开，并与主页面保持一致，
        // 省去再进子视图开两次开关（仅 false → true 时带开，之后用户仍可手动关闭）
        if (checked) {
            self.settings.sidePanelShowQuickLinks = true;
            self.settings.sidePanelQuickLinksSync = true;
        }
        self.saveSettings();
        const selectedDisplay = document.getElementById('side-panel-select-selected');
        if (selectedDisplay) selectedDisplay.textContent = self.getSidePanelSummary();
        self.renderSidePanelConfigView(rightPanelUpper, true);
    }));

    // 侧边栏功能关闭时，四个功能项一并隐藏
    if (this.settings.sidePanelEnabled) {
        this.getSidePanelNavItems().forEach(item => {
            container.appendChild(this.spBuildNavRow(item.label, this.getSidePanelNavStatus(item), () => {
                // 进入子页面：根视图向左推出、子页面从右推入（iOS 式 push）
                self.panelTransition(rightPanelUpper, 'push', () => {
                    self.renderSidePanelSubView(rightPanelUpper, item.key, true);
                });
            }));
        });
    }

    wrapper.appendChild(container);
    rightPanelUpper.appendChild(wrapper);
    const modal = document.getElementById('settings-modal');
    if (modal) modal.classList.add('right-panel-open');
},
renderSidePanelSubView (rightPanelUpper, key, skipAnimation) {
    if (!rightPanelUpper) return;
    rightPanelUpper.dataset.menuType = 'side-panel';
    this._sidePanelView = key;

    if (key === 'widgets') {
        this.renderSPWidgetsView(rightPanelUpper, skipAnimation);
        return;
    }
    if (key === 'quicklinks') {
        this.renderSPQuickLinksView(rightPanelUpper, skipAnimation);
        return;
    }
    if (key === 'search' || key === 'wallpaper') {
        this.exitSidePanelScope();
        rightPanelUpper.innerHTML = '';
        // 与小组件/快速访问链接子视图同款的两层结构：外层包裹 + 内层滚动容器，
        // 保证四个子视图的内边距、滚动与滑入动画作用对象一致
        const wrapper = document.createElement('div');
        wrapper.className = 'side-panel-config-view';
        const container = document.createElement('div');
        container.className = 'settings-menu-container' + (skipAnimation ? '' : ' slide-in-right');
        if (key === 'search') this.renderSPSearchView(container);
        else this.renderSPWallpaperView(container);
        wrapper.appendChild(container);
        rightPanelUpper.appendChild(wrapper);
        const modal = document.getElementById('settings-modal');
        if (modal) modal.classList.add('right-panel-open');
    }
},
refreshSidePanelView (rightPanelUpper) {
    if (!rightPanelUpper || rightPanelUpper.dataset.menuType !== 'side-panel') return;
    if (this._sidePanelView && this._sidePanelView !== 'root') {
        this.renderSidePanelSubView(rightPanelUpper, this._sidePanelView, true);
        return;
    }
    // 根视图：原地同步主开关与四个导航项的状态文字
    const master = rightPanelUpper.querySelector('.switch input');
    if (master) master.checked = !!this.settings.sidePanelEnabled;
    const navItems = this.getSidePanelNavItems();
    rightPanelUpper.querySelectorAll('.setting-group').forEach(box => {
        const label = box.querySelector('label');
        const value = box.querySelector('.select-selected');
        if (!label || !value) return;
        const name = label.textContent.replace(':', '').trim();
        const item = navItems.find(it => it.label === name);
        if (item) value.textContent = this.getSidePanelNavStatus(item);
    });
},
spBuildSubViewHeader (rightPanelUpper, showKey, showLabel, syncKey, opts) {
    const self = this;
    const header = document.createElement('div');
    header.className = 'side-panel-subview-header';

    header.appendChild(this.spBuildSwitchRow(showLabel, !!this.settings[showKey], (checked) => {
        self.settings[showKey] = checked;
        if (opts && typeof opts.afterShowChange === 'function') opts.afterShowChange(checked);
        self.saveSettings();
        self.syncSidePanelSelectDisplay();
    }));

    if (syncKey) {
        header.appendChild(this.spBuildSwitchRow('与主页面保持一致', !!self.settings[syncKey], (checked) => {
            self.settings[syncKey] = checked;
            // 切到独立配置时，独立列表为空则从主页面复制一份作为起点
            if (!checked && syncKey === 'sidePanelWidgetsSync' && self.getSidePanelWidgetsSource().length === 0) {
                const mainWidgets = (self.settings.widgetPanel && Array.isArray(self.settings.widgetPanel.widgets)) ? self.settings.widgetPanel.widgets : [];
                self.settings.sidePanelWidgetPanel.widgets = JSON.parse(JSON.stringify(mainWidgets));
            }
            if (!checked && syncKey === 'sidePanelQuickLinksSync' && self.getSidePanelQuickLinksSource().length === 0) {
                const mainLinks = Array.isArray(self.settings.quickLinks) ? self.settings.quickLinks : [];
                self.settings.sidePanelQuickLinks = JSON.parse(JSON.stringify(mainLinks));
            }
            self.saveSettings();
            self.renderSidePanelSubView(rightPanelUpper, self._sidePanelView, true);
        }));
    }
    return header;
},
spRenderSyncableSubView (rightPanelUpper, cfg) {
    const wrapper = document.createElement('div');
    wrapper.className = 'side-panel-config-view';
    const header = this.spBuildSubViewHeader(rightPanelUpper, cfg.showKey, cfg.showLabel, cfg.syncKey, cfg);

    if (this.settings[cfg.syncKey]) {
        rightPanelUpper.innerHTML = '';
        wrapper.appendChild(header);
        rightPanelUpper.appendChild(wrapper);
    } else {
        cfg.renderManager();
        const mgr = rightPanelUpper.querySelector('.settings-menu-container');
        if (!mgr) return;
        wrapper.appendChild(header);
        wrapper.appendChild(mgr);
        rightPanelUpper.appendChild(wrapper);
    }

    const modal = document.getElementById('settings-modal');
    if (modal) modal.classList.add('right-panel-open');
},
renderSPWidgetsView (rightPanelUpper, skipAnimation) {
    this.enterSidePanelScope({ widgets: true });
    this.spRenderSyncableSubView(rightPanelUpper, {
        showKey: 'sidePanelShowWidgets',
        showLabel: '显示小组件',
        syncKey: 'sidePanelWidgetsSync',
        // 侧边栏以小组件 + 快速访问链接为主要内容：开启小组件时把快速访问链接
        // 一并默认开启并与主页面保持一致（仅 false → true 时带开，之后用户仍可手动关闭）
        afterShowChange: (checked) => {
            if (!checked) return;
            this.settings.sidePanelShowQuickLinks = true;
            this.settings.sidePanelQuickLinksSync = true;
        },
        renderManager: () => this.showWidgetPanelMenuInRightPanel(skipAnimation)
    });
},
renderSPQuickLinksView (rightPanelUpper, skipAnimation) {
    this.enterSidePanelScope({ quicklinks: true });
    this.spRenderSyncableSubView(rightPanelUpper, {
        showKey: 'sidePanelShowQuickLinks',
        showLabel: '显示快速访问链接',
        syncKey: 'sidePanelQuickLinksSync',
        renderManager: () => this.showQuickLinksMenuInRightPanel(skipAnimation)
    });
},
renderSPSearchView (container) {
    const self = this;

    container.appendChild(this.spBuildSwitchRow('显示搜索框', !!this.settings.sidePanelShowSearch, (checked) => {
        self.settings.sidePanelShowSearch = checked;
        self.saveSettings();
        self.syncSidePanelSelectDisplay();
    }));

    container.appendChild(this.spBuildSwitchRow('显示引擎切换按钮', !!this.settings.sidePanelShowEngineButtons, (checked) => {
        self.settings.sidePanelShowEngineButtons = checked;
        self.saveSettings();
        self.syncSidePanelSelectDisplay();
    }));

    // 内置页打开：开启后搜索/访问的网页在内置 iframe 浏览器中展示（不新开标签页）
    container.appendChild(this.spBuildSwitchRow('内置页打开', !!this.settings.sidePanelBuiltinOpen, (checked) => {
        self.settings.sidePanelBuiltinOpen = checked;
        self.saveSettings();
    }));

    container.appendChild(this.spBuildSwitchRow('与主页面保持一致', !!this.settings.sidePanelSearchSync, (checked) => {
        self.settings.sidePanelSearchSync = checked;
        self.saveSettings();
        self.syncSidePanelSelectDisplay();
    }));

    if (this.settings.sidePanelSearchSync) {
        return;
    }

    // 搜索框厚度与主页面开发者模式里的同名控件等价，属于低频调节项，同样只在开发者模式下露出
    // （设置仍然生效并持久化，只是普通用户看不到入口）
    if (!this.settings.developerMode) {
        return;
    }

    // 搜索框厚度（设置主页面开发者模式同款滑块 + 数值输入）
    const item = document.createElement('div');
    item.className = 'developer-control-item';
    const label = document.createElement('label');
    label.textContent = '搜索框厚度';
    item.appendChild(label);

    const row = document.createElement('div');
    row.className = 'control-with-reset';
    const range = document.createElement('input');
    range.type = 'range';
    range.className = 'slider-input';
    range.min = '20';
    range.max = '200';
    range.step = '1';
    range.value = String(this.settings.sidePanelSearchBoxHeight || 50);
    const num = document.createElement('input');
    num.type = 'number';
    num.className = 'slider-value-input';
    num.min = '20';
    num.max = '200';
    num.step = '1';
    num.value = String(this.settings.sidePanelSearchBoxHeight || 50);
    range.addEventListener('input', () => {
        num.value = range.value;
        this.settings.sidePanelSearchBoxHeight = parseInt(range.value, 10) || 50;
        this.saveSettings();
    });
    num.addEventListener('change', () => {
        let v = parseInt(num.value, 10);
        if (!(v > 0)) v = 50;
        v = Math.max(20, Math.min(200, v));
        num.value = String(v);
        range.value = String(v);
        this.settings.sidePanelSearchBoxHeight = v;
        this.saveSettings();
    });
    row.appendChild(range);
    row.appendChild(num);
    item.appendChild(row);
    container.appendChild(item);
},
renderSPWallpaperView (container) {
    const self = this;

    container.appendChild(this.spBuildSwitchRow('显示壁纸', !!this.settings.sidePanelWallpaperEnabled, (checked) => {
        self.settings.sidePanelWallpaperEnabled = checked;
        self.saveSettings();
        self.syncSidePanelSelectDisplay();
    }));

    container.appendChild(this.spBuildSwitchRow('与主页面保持一致', !!this.settings.sidePanelWallpaperSync, (checked) => {
        self.settings.sidePanelWallpaperSync = checked;
        self.saveSettings();
        self.syncSidePanelSelectDisplay();
    }));

    if (this.settings.sidePanelWallpaperSync) {
        return;
    }

    // 壁纸地址（与设置主页面下拉框同款外观的输入框）
    const group = document.createElement('div');
    group.className = 'setting-group';
    const label = document.createElement('label');
    label.textContent = '壁纸地址:';
    group.appendChild(label);
    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.className = 'side-panel-url-input';
    urlInput.placeholder = '留空使用默认壁纸';
    urlInput.value = this.settings.sidePanelWallpaperUrl || '';
    urlInput.addEventListener('change', () => {
        this.settings.sidePanelWallpaperUrl = urlInput.value.trim();
        this.saveSettings();
    });
    group.appendChild(urlInput);
    container.appendChild(group);
},
syncSidePanelSelectDisplay () {
    const selectedDisplay = document.getElementById('side-panel-select-selected');
    if (selectedDisplay) {
        selectedDisplay.textContent = this.getSidePanelSummary();
    }
    const rpu = document.getElementById('right-panel-upper');
    if (rpu && rpu.dataset.menuType === 'side-panel') {
        const ae = document.activeElement;
        const isTyping = !!(ae && rpu.contains(ae) && ((ae.tagName === 'INPUT' && (!ae.type || ae.type === 'text' || ae.type === 'url' || ae.type === 'number' || ae.type === 'range')) || ae.tagName === 'TEXTAREA'));
        if (isTyping) {
            return;
        }
        this.refreshSidePanelView(rpu);
    }
},
};

// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

export const BadgeMixin = {
    normalizeBadgeAction(value) {
        return (value === 'settings' || value === 'audio' || value === 'none') ? value : 'settings';
    },
    getBadgeActionLabel(value) {
        const action = this.normalizeBadgeAction(value);
        return action === 'audio' ? '播放OCP' : action === 'settings' ? '打开设置' : '无';
    },
    getBadgeActionSummary() {
        return this.getBadgeActionLabel(this.settings.badgeDblClickAction)
            + ' · ' + this.getBadgeActionLabel(this.settings.badgeContextMenuAction);
    },
    syncBadgeOpenMethodUI() {
        const group = document.getElementById('badge-open-method-group');
        if (group) {
            group.style.display = this.settings.hiddenBadge ? 'none' : '';
        }
        // OCP 播控依附于铭牌 hover，铭牌隐藏时一并隐藏设置项与已展开的播控
        const ocpGroup = document.getElementById('ocp-player-group');
        if (ocpGroup) {
            ocpGroup.style.display = this.settings.hiddenBadge ? 'none' : '';
        }
        if (this.settings.hiddenBadge) {
            this.hideOcpPlayer();
        }
        const selectedDisplay = document.getElementById('badge-open-method-selected');
        if (selectedDisplay) {
            selectedDisplay.textContent = this.getBadgeActionSummary();
        }
        // 铭牌已隐藏时，若右面板仍停留在该设置视图则退回占位内容，避免展示失效设置
        const rpu = document.getElementById('right-panel-upper');
        if (this.settings.hiddenBadge && rpu && rpu.dataset.menuType === 'badge-open-method') {
            this.closeSettingsMenuInRightPanel();
        }
        // 铭牌隐藏后停止音效与光效，避免在不可见元素上继续播放
        if (this.settings.hiddenBadge) {
            this.stopBadgeAudio();
        }
    },
    runBadgeAction(action) {
        if (action === 'settings') {
            this.openSettings('badge');
        } else if (action === 'audio') {
            this.toggleBadgeAudio();
        }
    },
    setupBadgeOpenMethod() {
        const badge = document.getElementById('ooo-badge');
        if (!badge) return;

        // 通过引用移除之前绑定的监听器，避免克隆替换元素导致
        // 其他监听器（10次点击彩蛋、悬停弹窗等）丢失
        if (this._badgeToggleHandler) {
            badge.removeEventListener('click', this._badgeToggleHandler);
        }
        if (this._badgeDblClickHandler) {
            badge.removeEventListener('dblclick', this._badgeDblClickHandler);
        }
        if (this._badgeContextMenuHandler) {
            badge.removeEventListener('contextmenu', this._badgeContextMenuHandler);
        }

        // 重新绑定点击事件（用于切换文本）
        this._badgeToggleHandler = () => this.toggleBadgeText();
        badge.addEventListener('click', this._badgeToggleHandler);

        const dblAction = this.normalizeBadgeAction(this.settings.badgeDblClickAction);
        const ctxAction = this.normalizeBadgeAction(this.settings.badgeContextMenuAction);

        // 当前配置已不再需要音效时，停掉可能在播的音频并收起光效
        if (dblAction !== 'audio' && ctxAction !== 'audio') {
            this.stopBadgeAudio();
        }

        if (dblAction !== 'none') {
            this._badgeDblClickHandler = () => this.runBadgeAction(dblAction);
            badge.addEventListener('dblclick', this._badgeDblClickHandler);
        }

        if (ctxAction !== 'none') {
            this._badgeContextMenuHandler = (e) => {
                e.preventDefault();
                this.runBadgeAction(ctxAction);
            };
            badge.addEventListener('contextmenu', this._badgeContextMenuHandler);
        }
    },
    toggleBadgeText() {
        const badge = document.getElementById('ooo-badge');
        const hasAnimation = this.settings.dynamicBlur || this.settings.enhancedDisplay;

        // 复用现有的 info-indicator 节点，避免 innerHTML 重建导致
        // InfoManager 持有的旧引用失效（颜色/显示状态无法更新）
        const rebuildBadgeContent = () => {
            let indicator = document.getElementById('info-indicator');
            if (!indicator) {
                indicator = document.createElement('div');
                indicator.id = 'info-indicator';
                indicator.className = 'info-indicator';
            }

            if (this.isBadgeExpanded) {
                badge.innerHTML = '<span>OOOInterface</span>';
            } else {
                badge.innerHTML = `OOOInterface(${this.currentVersion})`;
            }
            badge.appendChild(indicator);

            // 同步指示器颜色与可见状态
            if (this.infoManager && typeof this.infoManager.refreshInfoIndicator === 'function') {
                this.infoManager.refreshInfoIndicator();
            }
        };

        if (hasAnimation) {
            badge.style.transform = 'scale(0.95)';
            badge.style.opacity = '0.8';

            setTimeout(() => {
                rebuildBadgeContent();

                badge.style.transform = 'scale(1)';
                badge.style.opacity = '1';

                this.isBadgeExpanded = !this.isBadgeExpanded;
            }, 100);
        } else {
            rebuildBadgeContent();

            this.isBadgeExpanded = !this.isBadgeExpanded;
        }
    },
    calculateBadgeOrigin(modal) {
        const badge = document.getElementById('ooo-badge');
        const content = modal.querySelector('.modal-content');
        if (!badge || !content) return;

        const badgeRect = badge.getBoundingClientRect();
        const badgeCenterX = badgeRect.left + badgeRect.width / 2;
        const badgeCenterY = badgeRect.top + badgeRect.height / 2;

        // 临时候获取内容区未变换的尺寸（同在 rAF 内，不会触发重绘）
        const origTransform = content.style.transform;
        content.style.transform = 'none';
        const contentRect = content.getBoundingClientRect();
        content.style.transform = origTransform;

        const originX = ((badgeCenterX - contentRect.left) / contentRect.width) * 100;
        const originY = ((badgeCenterY - contentRect.top) / contentRect.height) * 100;

        content.style.setProperty('--badge-origin-x', Math.max(0, Math.min(100, originX)) + '%');
        content.style.setProperty('--badge-origin-y', Math.max(0, Math.min(100, originY)) + '%');
    },
renderBadgeConfigView (rightPanelUpper) {
    const self = this;
    if (!rightPanelUpper) return;

    rightPanelUpper.dataset.menuType = 'badge-open-method';

    const container = document.createElement('div');
    container.className = 'settings-menu-container slide-in-right';

    const actions = [
        { key: 'badgeDblClickAction', label: '双击' },
        { key: 'badgeContextMenuAction', label: '右键' }
    ];

    actions.forEach(({ key, label }) => {
        const row = document.createElement('div');
        row.className = 'badge-action-row';

        const rowLabel = document.createElement('label');
        rowLabel.textContent = label;
        row.appendChild(rowLabel);

        const options = [
            { value: 'settings', text: '打开设置' },
            { value: 'audio', text: '播放OCP' },
            { value: 'none', text: '无' }
        ];
        const current = self.normalizeBadgeAction(self.settings[key]);
        const currentIdx = Math.max(0, options.findIndex(o => o.value === current));

        const seg = document.createElement('div');
        seg.className = 'badge-action-segmented pos-' + currentIdx;

        const thumb = document.createElement('div');
        thumb.className = 'badge-action-thumb';
        seg.appendChild(thumb);

        options.forEach((opt, idx) => {
            const span = document.createElement('span');
            span.className = 'badge-action-label l' + idx + (idx === currentIdx ? ' active' : '');
            span.textContent = opt.text;
            span.setAttribute('role', 'button');
            span.setAttribute('tabindex', '0');
            span.setAttribute('title', opt.text);

            const select = () => {
                if (self.settings[key] === opt.value) return;
                const value = self.normalizeBadgeAction(opt.value);
                self.settings[key] = value;
                // 移动滑块并更新高亮
                seg.classList.remove('pos-0', 'pos-1', 'pos-2');
                seg.classList.add('pos-' + idx);
                seg.querySelectorAll('.badge-action-label').forEach((el, i) => {
                    el.classList.toggle('active', i === idx);
                });
                // 立即生效并持久化（与其他右面板选择器一致，不弹提示）
                self.setupBadgeOpenMethod();
                self.syncBadgeOpenMethodUI();
                self.saveSettings();
            };

            span.addEventListener('click', (e) => {
                e.stopPropagation();
                select();
            });
            span.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    select();
                }
            });

            seg.appendChild(span);
        });

        row.appendChild(seg);
        container.appendChild(row);
    });

    rightPanelUpper.appendChild(container);
    const modal = document.getElementById('settings-modal');
    if (modal) modal.classList.add('right-panel-open');
},
};

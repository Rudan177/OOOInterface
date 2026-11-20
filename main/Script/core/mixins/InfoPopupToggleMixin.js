/**
 * 「禁止提示」开关：单击设为 7 天临时禁止，双击设为永久禁止，并同步标签与设置页状态。
 * 由 main.js 通过 Object.assign 挂载到 OOOInterface.prototype。
 */

export const InfoPopupToggleMixin = {
    initHideInfoPopupToggle() {
        const toggle = document.getElementById('hide-info-popup-toggle');
        if (!toggle) return;

        // 监听必须绑在外层 label 上：checkbox 本身宽高为 0 不可见，dblclick 是物理事件，
        // 只会在 slider/label 上派发，浏览器不会向 input 转发合成的 dblclick。
        const switchLabel = toggle.closest('label');
        if (!switchLabel) return;

        const updateToggleState = () => {
            const isEnabled = this.settings.hideInfoPopup.enabled;
            // 用 requestAnimationFrame 把 DOM 更新放到下一个渲染周期。
            requestAnimationFrame(() => {
                toggle.checked = isEnabled;
                this.updateHideInfoPopupLabel();
            });
        };

        const applyHideInfoPopup = (value) => {
            this.settings.hideInfoPopup = value;
            this.applySettings();
            this.saveSettings();
            this.updateContextMenuIcons();
            // 同步主开关派生状态与子开关组的显隐。
            this.syncSettingsPageToggles();
            // 立即更新状态。
            updateToggleState();
        };

        // 单击即切换 7 天临时禁止。preventDefault 阻止 label 向 input 转发合成 click，避免一次点击触发两次；
        // 双击时前两次 click 先开临时再切回，最终由 dblclick 覆盖为永久。
        switchLabel.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            applyHideInfoPopup(this.settings.hideInfoPopup.enabled
                ? { enabled: false, type: null, timestamp: null }
                : { enabled: true, type: 'temporary', timestamp: Date.now() });
        });

        // 双击走浏览器原生判定，设为永久禁止（覆盖 click 产生的中间状态）。
        switchLabel.addEventListener('dblclick', (e) => {
            e.preventDefault();
            e.stopPropagation();

            applyHideInfoPopup({ enabled: true, type: 'permanent', timestamp: Date.now() });
        });

        // 初始化状态
        updateToggleState();
    },
    updateHideInfoPopupLabel() {
        const settingGroup = document.getElementById('hide-info-popup-toggle')?.closest('.setting-group');
        if (!settingGroup) return;

        const label = settingGroup.querySelector('.setting-label');
        if (!label) return;

        const hideInfoPopup = this.settings.hideInfoPopup;

        if (!hideInfoPopup.enabled) {
            label.textContent = '禁止提示';
        } else if (hideInfoPopup.type === 'temporary') {
            const daysLeft = this.getHideInfoPopupDaysLeft();
            label.innerHTML = `禁止提示 <span class="hide-info-popup-days" data-days-left="${daysLeft}">剩余${daysLeft}天</span>`;
        } else if (hideInfoPopup.type === 'permanent') {
            label.textContent = '禁止提示(永久)';
        }
    },
    getHideInfoPopupDaysLeft() {
        const hideInfoPopup = this.settings.hideInfoPopup;
        if (!hideInfoPopup.enabled || !hideInfoPopup.timestamp || hideInfoPopup.type !== 'temporary') return 0;

        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
        const elapsed = Date.now() - hideInfoPopup.timestamp;
        const remaining = sevenDaysMs - elapsed;

        if (remaining <= 0) return 0;
        return Math.ceil(remaining / (24 * 60 * 60 * 1000));
    },
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
    },
    toggleHideNotificationsSetting() {
        this.settings.hideNotifications = !this.settings.hideNotifications;
        this.saveSettings();
        this.updateContextMenuIcons();
        this.syncSettingsPageToggles();
        this.showNotification(this.settings.hideNotifications ? '隐藏弹窗：开启' : '隐藏弹窗：关闭');
    },
    toggleHideInfoPopupSetting() {
        if (this.settings.hideInfoPopup.enabled) {
            this.settings.hideInfoPopup = { enabled: false, type: null, timestamp: null };
        } else {
            this.settings.hideInfoPopup = { enabled: true, type: 'permanent', timestamp: Date.now() };
        }
        this.applySettings();
        this.saveSettings();
        this.updateContextMenuIcons();
        this.syncSettingsPageToggles();
        this.showNotification(this.settings.hideInfoPopup.enabled ? '禁止提示：开启' : '禁止提示：关闭');
    },
};

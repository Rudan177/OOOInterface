// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

export const InfoPopupToggleMixin = {
    initHideInfoPopupToggle() {
        const toggle = document.getElementById('hide-info-popup-toggle');
        if (!toggle) return;

        // 监听必须绑在外层label上:checkbox本身宽高为0不可见,双击的dblclick是物理事件,
        // 只会派发在slider/label上,浏览器不会向input转发合成的dblclick
        const switchLabel = toggle.closest('label');
        if (!switchLabel) return;

        const updateToggleState = () => {
            const isEnabled = this.settings.hideInfoPopup.enabled;
            // 使用 requestAnimationFrame 确保DOM更新在浏览器的下一个渲染周期执行
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
            // 同步主开关派生状态与子开关组显隐
            this.syncSettingsPageToggles();
            // 立即更新状态
            updateToggleState();
        };

        // 单击:立即切换临时禁止(7天)。preventDefault阻止label向input转发合成click,避免一次点击触发两次。
        // 双击时前两次click先开临时再切回,最终由dblclick设为永久
        switchLabel.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            applyHideInfoPopup(this.settings.hideInfoPopup.enabled
                ? { enabled: false, type: null, timestamp: null }
                : { enabled: true, type: 'temporary', timestamp: Date.now() });
        });

        // 双击:浏览器原生双击判定,设为永久禁止(覆盖click产生的中间状态)
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

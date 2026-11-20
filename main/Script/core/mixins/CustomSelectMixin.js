/**
 * 自定义下拉菜单：选中区域展开右面板菜单，选项点击后回写隐藏的 select 并触发 change。
 * 由 main.js 通过 Object.assign 挂载到 OOOInterface.prototype。
 */

export const CustomSelectMixin = {
    initCustomSelect() {
        // 获取所有自定义下拉菜单。
        const customSelects = document.querySelectorAll('.custom-select');

        customSelects.forEach(select => {
            const selected = select.querySelector('.select-selected');
            const items = select.querySelector('.select-items');
            const selectItems = select.querySelectorAll('.select-item');
            const hiddenSelect = select.querySelector('select');

            // 点击选中区域显示或隐藏选项。
            selected.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();

                this.showSettingsMenuInRightPanel(items, selected, hiddenSelect);
            });

            // 点击选项更新选中值。
            selectItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();

                    const value = item.getAttribute('data-value');

                    // 自定义文字 Logo 选项需要展开输入框，单独处理。
                    if (value === 'text-logo') {
                        const textLogoGroup = document.getElementById('text-logo-inline-group');
                        if (textLogoGroup) {
                            textLogoGroup.style.display = 'flex';
                        }
                        item.classList.add('selected');
                        // 不关闭下拉菜单，方便继续输入。
                        return;
                    }

                    // 其他选项需要收起文字 Logo 输入框并清除其选中态。
                    const textLogoGroup = document.getElementById('text-logo-inline-group');
                    const textLogoItem = document.querySelector('.select-item-text-logo');
                    if (textLogoGroup) {
                        textLogoGroup.style.display = 'none';
                    }
                    if (textLogoItem) {
                        textLogoItem.classList.remove('selected');
                    }

                    // 优先使用 span 元素的文本内容。
                    const spanEl = item.querySelector('span:last-child');
                    const text = spanEl ? spanEl.textContent : item.textContent;
                    selected.textContent = text;

                    // 同步隐藏的 select 并触发 change 事件。
                    hiddenSelect.value = value;
                    const event = new Event('change', { bubbles: true });
                    hiddenSelect.dispatchEvent(event);

                    // 关闭下拉菜单。
                    items.classList.add('select-hide');
                });
            });
        });

        // 点击页面其他地方关闭所有下拉菜单。
        document.addEventListener('click', () => {
            document.querySelectorAll('.select-items').forEach(item => {
                item.classList.add('select-hide');
            });
        });
    },
    rebindCustomSelectItems() {
        const logoSelectItems = document.getElementById('logo-select-items');
        const logoSelect = document.getElementById('logo-select');
        const logoSelectSelected = document.getElementById('logo-select-selected');

        if (!logoSelectItems || !logoSelect || !logoSelectSelected) return;

        const selectItems = logoSelectItems.querySelectorAll('.select-item');
        selectItems.forEach(item => {
            // 克隆节点以移除旧的点击监听器。
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);

            newItem.addEventListener('click', (e) => {
                e.stopPropagation();

                const value = newItem.getAttribute('data-value');

                // 自定义文字 Logo 选项需要展开输入框，单独处理。
                if (value === 'text-logo') {
                    const textLogoGroup = document.getElementById('text-logo-inline-group');
                    if (textLogoGroup) {
                        textLogoGroup.style.display = 'flex';
                    }
                    newItem.classList.add('selected');
                    return;
                }

                // 收起文字 Logo 输入框。
                const textLogoGroup = document.getElementById('text-logo-inline-group');
                if (textLogoGroup) {
                    textLogoGroup.style.display = 'none';
                }

                const text = newItem.textContent;
                logoSelectSelected.textContent = text;
                logoSelect.value = value;

                const event = new Event('change', { bubbles: true });
                logoSelect.dispatchEvent(event);

                // 关闭下拉菜单。
                logoSelectItems.classList.add('select-hide');
            });
        });
    },
};

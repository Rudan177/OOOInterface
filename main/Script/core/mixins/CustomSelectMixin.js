// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

export const CustomSelectMixin = {
    initCustomSelect() {
        // 获取所有自定义下拉菜单
        const customSelects = document.querySelectorAll('.custom-select');

        customSelects.forEach(select => {
            const selected = select.querySelector('.select-selected');
            const items = select.querySelector('.select-items');
            const selectItems = select.querySelectorAll('.select-item');
            const hiddenSelect = select.querySelector('select');

            // 点击选中区域显示/隐藏选项
            selected.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();

                this.showSettingsMenuInRightPanel(items, selected, hiddenSelect);
            });

            // 点击选项更新选中值
            selectItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();

                    // 更新显示的选中值
                    const value = item.getAttribute('data-value');

                    // 如果是自定义文字Logo选项，特殊处理
                    if (value === 'text-logo') {
                        // 显示输入框
                        const textLogoGroup = document.getElementById('text-logo-inline-group');
                        if (textLogoGroup) {
                            textLogoGroup.style.display = 'flex';
                        }
                        // 给选项添加selected类
                        item.classList.add('selected');
                        // 不关闭下拉菜单，让用户可以输入
                        return;
                    }

                    // 隐藏文字Logo输入框并移除selected类
                    const textLogoGroup = document.getElementById('text-logo-inline-group');
                    const textLogoItem = document.querySelector('.select-item-text-logo');
                    if (textLogoGroup) {
                        textLogoGroup.style.display = 'none';
                    }
                    if (textLogoItem) {
                        textLogoItem.classList.remove('selected');
                    }

                    // 获取文本内容，优先使用span元素
                    const spanEl = item.querySelector('span:last-child');
                    const text = spanEl ? spanEl.textContent : item.textContent;
                    selected.textContent = text;

                    // 更新隐藏的select元素的值并触发change事件
                    hiddenSelect.value = value;
                    const event = new Event('change', { bubbles: true });
                    hiddenSelect.dispatchEvent(event);

                    // 关闭下拉菜单
                    items.classList.add('select-hide');
                });
            });
        });

        // 点击页面其他地方关闭下拉菜单
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
            // 移除旧的事件监听器（通过克隆节点）
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);

            // 添加新的事件监听器
            newItem.addEventListener('click', (e) => {
                e.stopPropagation();

                const value = newItem.getAttribute('data-value');

                // 如果是自定义文字Logo选项，特殊处理
                if (value === 'text-logo') {
                    const textLogoGroup = document.getElementById('text-logo-inline-group');
                    if (textLogoGroup) {
                        textLogoGroup.style.display = 'flex';
                    }
                    newItem.classList.add('selected');
                    return;
                }

                // 隐藏文字Logo输入框
                const textLogoGroup = document.getElementById('text-logo-inline-group');
                if (textLogoGroup) {
                    textLogoGroup.style.display = 'none';
                }

                // 更新选中值
                const text = newItem.textContent;
                logoSelectSelected.textContent = text;
                logoSelect.value = value;

                const event = new Event('change', { bubbles: true });
                logoSelect.dispatchEvent(event);

                // 关闭下拉菜单
                logoSelectItems.classList.add('select-hide');
            });
        });
    },
};

/**
 * 设置弹窗内的交互：文件拖放与按住鼠标拖动滚动。
 * 由 main.js 通过 Object.assign 挂载到 OOOInterface.prototype。
 */

export const InteractionMixin = {
    setupDragAndDrop() {
        const modalBody = document.querySelector('.modal-body');

        modalBody.addEventListener('dragover', (e) => {
            e.preventDefault();
            modalBody.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
        });

        modalBody.addEventListener('dragleave', (e) => {
            e.preventDefault();
            modalBody.style.backgroundColor = '';
        });

        modalBody.addEventListener('drop', (e) => {
            e.preventDefault();
            modalBody.style.backgroundColor = '';
            // 各右面板菜单自行处理拖放，详见 showSettingsMenuInRightPanel。
        });
    },
    setupMouseScroll() {
        const modalBody = document.querySelector('.modal-body');
        let isDown = false;
        let startY;
        let scrollTop;

        // 鼠标按下事件
        modalBody.addEventListener('mousedown', (e) => {
            // 点击滑块、输入框等可交互元素时不处理。
            if (e.target.tagName === 'INPUT' ||
                e.target.tagName === 'BUTTON' ||
                e.target.tagName === 'SELECT' ||
                e.target.tagName === 'TEXTAREA' ||
                e.target.closest('.slider-input') ||
                e.target.closest('input[type="range"]')) {
                return;
            }
            isDown = true;
            startY = e.pageY - modalBody.offsetTop;
            scrollTop = modalBody.scrollTop;
            modalBody.style.cursor = 'grabbing';
        });

        // 鼠标离开事件
        modalBody.addEventListener('mouseleave', () => {
            isDown = false;
            modalBody.style.cursor = 'default';
        });

        // 鼠标松开事件
        modalBody.addEventListener('mouseup', () => {
            isDown = false;
            modalBody.style.cursor = 'default';
        });

        // 鼠标移动事件
        modalBody.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const y = e.pageY - modalBody.offsetTop;
            const walk = (y - startY) * 2; // 滚动速度
            modalBody.scrollTop = scrollTop - walk;
        });
    },
};

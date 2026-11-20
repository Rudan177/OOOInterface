/**
 * 页面内快捷键兜底：Chrome 的 commands suggested_key 只在扩展安装时分配一次，
 * 重新加载未打包扩展后可能没有绑定，与系统快捷键冲突时也可能被 Chrome 放弃。
 * 页面聚焦时在捕获阶段识别 Alt+Shift+O 并转发给后台，与 chrome.commands 触发
 * 共用后台的节流去重，一次按键只产生一次动作。
 */
(function () {
    'use strict';

    document.addEventListener('keydown', function (event) {
        if (!event.altKey || !event.shiftKey || event.ctrlKey || event.metaKey) return;
        if (event.code !== 'KeyO') return;
        event.preventDefault();
        try {
            var result = chrome.runtime.sendMessage({ type: 'shortcut-trigger' });
            if (result && typeof result.catch === 'function') result.catch(function () { });
        } catch (e) {
            // 扩展上下文失效（更新或卸载）时忽略。
        }
    }, true);
})();

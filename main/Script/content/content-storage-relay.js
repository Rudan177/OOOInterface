/**
 * 云端页面存储桥（隔离世界）：把页面发来的存储读写请求转发到扩展的 chrome.storage.local。
 * 与 content-storage-bridge.js 成对使用，两者只挂在滚动更新页面所在的路径下。
 */

(function () {
    'use strict';

    window.addEventListener('message', (event) => {
        if (event.source !== window || !event.data || event.data.__oooStorageRequest !== true) {
            return;
        }

        var message = event.data;
        (async () => {
            try {
                var result;
                if (message.op === 'get') {
                    result = await chrome.storage.local.get(message.keys);
                } else if (message.op === 'set') {
                    await chrome.storage.local.set(message.items);
                } else if (message.op === 'remove') {
                    await chrome.storage.local.remove(message.keys);
                } else if (message.op === 'clear') {
                    await chrome.storage.local.clear();
                }
                window.postMessage({ __oooStorageReply: true, id: message.id, result: result }, '*');
            } catch (error) {
                window.postMessage({
                    __oooStorageReply: true,
                    id: message.id,
                    error: String(error && error.message ? error.message : error)
                }, '*');
            }
        })();
    });

    // 扩展侧设置变化时同步给页面，让页面里的 onChanged 监听器正常工作。
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName !== 'local') {
            return;
        }
        window.postMessage({ __oooStorageChange: true, changes: changes, areaName: areaName }, '*');
    });
})();

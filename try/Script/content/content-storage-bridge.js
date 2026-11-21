/**
 * 云端页面存储桥（MAIN world）：为 github.io 上的滚动更新页面补一个 chrome.storage 接口。
 * 页面脚本与扩展页共用同一份设置；真正的读写由同源的隔离世界脚本经 postMessage 转发到扩展。
 */

(function () {
    'use strict';

    if (window.chrome && window.chrome.storage) {
        return;
    }

    var requestSeq = 0;
    var pending = {};
    var changeListeners = [];

    // 接收隔离世界返回的读写结果。
    window.addEventListener('message', (event) => {
        if (event.source !== window || !event.data || event.data.__oooStorageReply !== true) {
            return;
        }
        var handler = pending[event.data.id];
        if (!handler) {
            return;
        }
        delete pending[event.data.id];
        if (event.data.error) {
            handler.reject(new Error(event.data.error));
        } else {
            handler.resolve(event.data.result);
        }
    });

    // 接收扩展存储的变化通知，转交给页面的 onChanged 监听器。
    window.addEventListener('message', (event) => {
        if (event.source !== window || !event.data || event.data.__oooStorageChange !== true) {
            return;
        }
        changeListeners.forEach((listener) => {
            try {
                listener(event.data.changes, event.data.areaName);
            } catch (error) {
                // 页面自己的监听器异常不应影响其它监听器。
            }
        });
    });

    function request(payload) {
        return new Promise((resolve, reject) => {
            var id = ++requestSeq;
            pending[id] = { resolve: resolve, reject: reject };
            payload.__oooStorageRequest = true;
            payload.id = id;
            window.postMessage(payload, '*');
        });
    }

    var local = {
        get(keys) {
            return request({ op: 'get', keys: keys });
        },
        set(items) {
            return request({ op: 'set', items: items });
        },
        remove(keys) {
            return request({ op: 'remove', keys: keys });
        },
        clear() {
            return request({ op: 'clear' });
        }
    };

    var storageApi = {
        local: local,
        onChanged: {
            addListener(listener) {
                if (typeof listener === 'function' && changeListeners.indexOf(listener) < 0) {
                    changeListeners.push(listener);
                }
            },
            removeListener(listener) {
                var index = changeListeners.indexOf(listener);
                if (index >= 0) {
                    changeListeners.splice(index, 1);
                }
            },
            hasListener(listener) {
                return changeListeners.indexOf(listener) >= 0;
            }
        }
    };

    var chromeApi = window.chrome;
    if (!chromeApi) {
        chromeApi = {};
        try {
            window.chrome = chromeApi;
        } catch (error) {
            return;
        }
    }
    try {
        chromeApi.storage = storageApi;
    } catch (error) {
        try {
            Object.defineProperty(chromeApi, 'storage', { value: storageApi, configurable: true });
        } catch (defineError) {
            // 无法挂载时页面会按原有逻辑退回 localStorage。
        }
    }
})();

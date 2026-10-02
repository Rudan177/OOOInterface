// OOOInterface 后台 Service Worker
// "侧边栏功能"开启时：点击工具栏图标由 Chrome 直接打开侧边栏面板
// （openPanelOnActionClick 行为驱动，随设置实时切换，最可靠、无手势时序问题）；
// 关闭时：点击新建标签页打开主页。

// —— 设置缓存 ——
// 快捷键触发时 chrome.sidePanel.open() 依赖“用户手势”，
// 调用前若 await（读取 storage / 查询窗口）会打断手势链，导致打开侧边栏失败并回退成新标签页。
// 因此把开关状态与当前窗口 ID 缓存在内存中，供快捷键路径同步读取。
let cachedSidePanelEnabled = false;
let cachedShortcutsEnabled = true;
let cachedWindowId = chrome.windows.WINDOW_ID_NONE;

async function isSidePanelEnabled() {
    try {
        const result = await chrome.storage.local.get('oooInterfaceSettings');
        return !!(result.oooInterfaceSettings && result.oooInterfaceSettings.sidePanelEnabled);
    } catch (e) {
        return false;
    }
}

async function refreshSettingCache() {
    try {
        const result = await chrome.storage.local.get('oooInterfaceSettings');
        const s = result.oooInterfaceSettings || {};
        cachedSidePanelEnabled = !!s.sidePanelEnabled;
        cachedShortcutsEnabled = s.shortcutsEnabled === undefined ? true : !!s.shortcutsEnabled;
    } catch (e) {
        // 读取失败时维持默认值
    }
}

async function refreshFocusedWindow() {
    try {
        const win = await chrome.windows.getLastFocused();
        if (win && win.id !== undefined) cachedWindowId = win.id;
    } catch (e) {
        // 忽略
    }
}

// 激活扩展程序：与点击工具栏图标一致
// （侧边栏功能开启时打开侧边栏，否则打开主页）
async function activateExtension(tab) {
    if (await isSidePanelEnabled()) {
        try {
            let windowId = tab && tab.windowId;
            if (!windowId) {
                const win = await chrome.windows.getLastFocused();
                windowId = win && win.id;
            }
            await chrome.sidePanel.open({ windowId });
            return;
        } catch (e) {
            // 打开面板失败，回退到新标签页
        }
    }
    chrome.tabs.create({ url: 'main/index.html' });
}

async function applyPanelBehavior() {
    await refreshSettingCache();
    try {
        await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: cachedSidePanelEnabled });
    } catch (e) {
        console.warn('OOOInterface: 设置侧边栏打开行为失败:', e);
    }
}

// Service Worker 启动时按当前设置恢复行为（行为不跨浏览器会话持久化）
applyPanelBehavior();
refreshFocusedWindow();

// 浏览器启动 / 扩展安装或更新时显式恢复一次
chrome.runtime.onStartup.addListener(() => {
    applyPanelBehavior();
    refreshFocusedWindow();
});
chrome.runtime.onInstalled.addListener(() => {
    applyPanelBehavior();
    refreshFocusedWindow();
});

// 设置变更时实时切换行为
chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.oooInterfaceSettings) {
        applyPanelBehavior();
    }
});

// 记录当前聚焦窗口，供快捷键同步打开侧边栏使用
chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId !== chrome.windows.WINDOW_ID_NONE) cachedWindowId = windowId;
});

// 仅在侧边栏功能关闭（或冷启动竞态窗口内）触发：
// 开启状态下 Chrome 直接打开面板，本事件不会触发
chrome.action.onClicked.addListener((tab) => {
    activateExtension(tab);
});

// 快捷键 Alt+O：仅在设置中开启"快捷键"开关后生效；
// 侧边栏功能开启时激活侧边栏，否则打开主页。
// 注意：此处同步读取缓存并立即调用，避免 await 打断用户手势。
chrome.commands.onCommand.addListener((command) => {
    if (command !== 'activate-ooointerface') return;
    if (!cachedShortcutsEnabled) return;

    if (cachedSidePanelEnabled) {
        openSidePanel(cachedWindowId);
        return;
    }
    chrome.tabs.create({ url: 'main/index.html' });
});

function openSidePanel(windowId) {
    const fallback = () => chrome.tabs.create({ url: 'main/index.html' });
    if (windowId === undefined || windowId === chrome.windows.WINDOW_ID_NONE) {
        // 冷启动兜底：缓存尚未就绪时再取一次当前窗口
        chrome.windows.getLastFocused()
            .then((win) => chrome.sidePanel.open({ windowId: win && win.id }))
            .catch(fallback);
        return;
    }
    chrome.sidePanel.open({ windowId }).catch(fallback);
}

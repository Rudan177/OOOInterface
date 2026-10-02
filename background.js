// OOOInterface 后台 Service Worker
// "侧边栏功能"开启时：点击工具栏图标由 Chrome 直接打开侧边栏面板
// （openPanelOnActionClick 行为驱动，随设置实时切换，最可靠、无手势时序问题）；
// 关闭时：点击新建标签页打开主页。

async function isSidePanelEnabled() {
    try {
        const result = await chrome.storage.local.get('oooInterfaceSettings');
        return !!(result.oooInterfaceSettings && result.oooInterfaceSettings.sidePanelEnabled);
    } catch (e) {
        return false;
    }
}

async function applyPanelBehavior() {
    try {
        await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: await isSidePanelEnabled() });
    } catch (e) {
        console.warn('OOOInterface: 设置侧边栏打开行为失败:', e);
    }
}

// Service Worker 启动时按当前设置恢复行为（行为不跨浏览器会话持久化）
applyPanelBehavior();

// 浏览器启动 / 扩展安装或更新时显式恢复一次
chrome.runtime.onStartup.addListener(applyPanelBehavior);
chrome.runtime.onInstalled.addListener(applyPanelBehavior);

// 设置变更时实时切换行为
chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.oooInterfaceSettings) {
        applyPanelBehavior();
    }
});

// 仅在侧边栏功能关闭（或冷启动竞态窗口内）触发：
// 开启状态下 Chrome 直接打开面板，本事件不会触发
chrome.action.onClicked.addListener(async (tab) => {
    if (!(await isSidePanelEnabled())) {
        chrome.tabs.create({ url: 'main/index.html' });
        return;
    }
    // 冷启动竞态：行为尚未就位但功能已开启，直接补开面板，失败回退新标签页
    try {
        let windowId = tab && tab.windowId;
        if (!windowId) {
            const win = await chrome.windows.getLastFocused();
            windowId = win && win.id;
        }
        await chrome.sidePanel.open({ windowId });
    } catch (e) {
        chrome.tabs.create({ url: 'main/index.html' });
    }
});

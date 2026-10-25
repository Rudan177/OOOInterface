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

// —— 侧边栏开关状态（按窗口记录）——
// Chrome 141+ 才有 sidePanel.close()，141 / 142 起才有 onOpened / onClosed 事件。
// 快捷键必须在用户手势内同步决定"开还是关"（先 await 读状态会打断手势链，
// 随后的 open() 会直接失败），因此状态同时维护在两处：
//   · 内存 Set         —— 供快捷键同步读取
//   · storage.session  —— MV3 的 Service Worker 随时可能被回收，重启后据此恢复
const PANEL_OPEN_KEY = 'sidePanelOpenWindows';
const panelOpenWindows = new Set();
const canCloseSidePanel = typeof chrome.sidePanel.close === 'function';

function persistPanelOpenWindows() {
    try {
        chrome.storage.session.set({ [PANEL_OPEN_KEY]: Array.from(panelOpenWindows) }).catch(() => { });
    } catch (e) {
        // storage.session 不可用时退化为纯内存状态（本次会话内的快捷键切换仍可用）
    }
}

function markPanelOpen(windowId) {
    if (typeof windowId !== 'number' || windowId < 0) return;
    panelOpenWindows.add(windowId);
    persistPanelOpenWindows();
}

function markPanelClosed(windowId) {
    if (typeof windowId !== 'number' || windowId < 0) return;
    panelOpenWindows.delete(windowId);
    persistPanelOpenWindows();
}

// Service Worker 启动时从会话存储水合（用户按下快捷键时早已完成，不影响手势）
chrome.storage.session.get(PANEL_OPEN_KEY)
    .then((data) => {
        const list = data && data[PANEL_OPEN_KEY];
        if (!Array.isArray(list)) return;
        list.forEach((id) => {
            if (typeof id === 'number' && id >= 0) panelOpenWindows.add(id);
        });
    })
    .catch(() => { });

// 面板可能被用户（面板关闭按钮、工具栏图标、切换标签页）或我们自己的 close() 收起，
// 所以一律以 Chrome 的事件为准，而不是自己记账。
if (chrome.sidePanel.onOpened) {
    chrome.sidePanel.onOpened.addListener((info) => markPanelOpen(info && info.windowId));
}
if (chrome.sidePanel.onClosed) {
    chrome.sidePanel.onClosed.addListener((info) => markPanelClosed(info && info.windowId));
}

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
// 侧边栏功能开启时切换侧边栏（已打开则关闭），否则打开主页。
// 注意：此处同步读取缓存并立即调用，避免 await 打断用户手势。
chrome.commands.onCommand.addListener((command) => {
    if (command !== 'activate-ooointerface') return;
    if (!cachedShortcutsEnabled) return;

    if (cachedSidePanelEnabled) {
        toggleSidePanel(cachedWindowId);
        return;
    }
    chrome.tabs.create({ url: 'main/index.html' });
});

function openSidePanel(windowId) {
    const fallback = () => chrome.tabs.create({ url: 'main/index.html' });
    if (windowId === undefined || windowId === chrome.windows.WINDOW_ID_NONE) {
        // 冷启动兜底：缓存尚未就绪时再取一次当前窗口
        chrome.windows.getLastFocused()
            .then((win) => {
                const id = win && win.id;
                return chrome.sidePanel.open({ windowId: id }).then(() => markPanelOpen(id));
            })
            .catch(fallback);
        return;
    }
    chrome.sidePanel.open({ windowId }).then(() => markPanelOpen(windowId)).catch(fallback);
}

// Alt+O 的切换语义：面板已打开就关掉，否则打开（与点击工具栏图标的语义一致）。
// 状态来自内存 Set，不走 await，保住用户手势链。
function toggleSidePanel(windowId) {
    if (panelOpenWindows.has(windowId)) {
        closeSidePanel(windowId);
        return;
    }
    openSidePanel(windowId);
}

// 关闭侧边栏。windowId 未知（冷启动竞态）时退回当前聚焦窗口；
// 没有 close() 的旧版 Chrome 保持与工具栏图标一致——只会打开。
function closeSidePanel(windowId) {
    if (!canCloseSidePanel) {
        openSidePanel(windowId);
        return;
    }
    if (windowId === undefined || windowId === chrome.windows.WINDOW_ID_NONE) {
        chrome.windows.getLastFocused()
            .then((win) => {
                if (win && win.id !== undefined) closeSidePanel(win.id);
            })
            .catch(() => { });
        return;
    }
    // 自己先记账再关门：Chrome 141 有 onOpened 与 close() 却还没有 onClosed（142 起才有），
    // 若只等事件，"已关闭"状态就永远不更新，快捷键会卡在"一直关闭"、再也打不开面板。
    markPanelClosed(windowId);
    chrome.sidePanel.close({ windowId }).catch((e) => {
        // 关闭失败：回滚状态，免得下次快捷键误判成"已关闭"
        markPanelOpen(windowId);
        console.warn('OOOInterface: 关闭侧边栏失败:', e);
    });
}

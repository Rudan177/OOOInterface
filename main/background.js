/**
 * OOOInterface 后台 Service Worker：响应工具栏点击与快捷键，按设置打开侧边栏或主页。
 * 侧边栏功能开启时由 Chrome 的 openPanelOnActionClick 行为驱动直接打开面板，随设置实时切换；
 * 关闭时点击图标新建标签页打开主页。Alt+Shift+O 在面板打开时弹出快速链接编辑浮层，
 * 面板未打开时把当前网页写入快速访问链接。
 */

// ---------- 设置缓存 ----------
// 快捷键触发时 chrome.sidePanel.open() 依赖“用户手势”，
// 调用前若 await（读取 storage / 查询窗口）会打断手势链，导致打开侧边栏失败并回退成新标签页。
// 因此把开关状态与当前窗口 ID 缓存在内存中，供快捷键路径同步读取。
let cachedSidePanelEnabled = false;
let cachedShortcutsEnabled = true;
let cachedWindowId = chrome.windows.WINDOW_ID_NONE;

// ---------- 侧边栏开关状态（按窗口记录） ----------
// Chrome 141+ 才有 sidePanel.close()，141 / 142 起才有 onOpened / onClosed 事件。
// 快捷键必须在用户手势内同步决定“开还是关”（先 await 读状态会打断手势链，
// 随后的 open() 会直接失败），因此状态同时维护在两处：
//   - 内存 Set：供快捷键同步读取。
//   - storage.session：MV3 的 Service Worker 随时可能被回收，重启后据此恢复。
const PANEL_OPEN_KEY = 'sidePanelOpenWindows';
const panelOpenWindows = new Set();
const canCloseSidePanel = typeof chrome.sidePanel.close === 'function';

function persistPanelOpenWindows() {
    try {
        chrome.storage.session.set({ [PANEL_OPEN_KEY]: Array.from(panelOpenWindows) }).catch(() => { });
    } catch (e) {
        // storage.session 不可用时退化为纯内存状态（本次会话内的快捷键切换仍可用）。
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

// Service Worker 启动时从会话存储水合（用户按下快捷键时早已完成，不影响手势）。
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
        // 读取失败时维持默认值。
    }
}

async function refreshFocusedWindow() {
    try {
        const win = await chrome.windows.getLastFocused();
        if (win && win.id !== undefined) cachedWindowId = win.id;
    } catch (e) {
        // 忽略错误。
    }
}

// 激活扩展程序：行为与点击工具栏图标一致，侧边栏功能开启时打开侧边栏，否则打开主页。
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
            // 打开面板失败，回退到新标签页。
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

// Service Worker 启动时按当前设置恢复行为（行为不跨浏览器会话持久化）。
applyPanelBehavior();
refreshFocusedWindow();

// 浏览器启动 / 扩展安装或更新时显式恢复一次。
chrome.runtime.onStartup.addListener(() => {
    applyPanelBehavior();
    refreshFocusedWindow();
});
chrome.runtime.onInstalled.addListener(() => {
    applyPanelBehavior();
    refreshFocusedWindow();
});

// 设置变更时实时切换行为。
chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.oooInterfaceSettings) {
        applyPanelBehavior();
    }
});

// 记录当前聚焦窗口，供快捷键同步打开侧边栏使用。
chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId !== chrome.windows.WINDOW_ID_NONE) cachedWindowId = windowId;
});

// 仅在侧边栏功能关闭（或冷启动竞态窗口内）触发：
// 开启状态下 Chrome 直接打开面板，本事件不会触发。
chrome.action.onClicked.addListener((tab) => {
    activateExtension(tab);
});

// ---------- 快捷添加当前网页到快速访问链接 ----------

// 快捷键反馈：工具栏角标短暂显示结果。不依赖页面打开，任何标签页上都能看到。
let badgeTimer = null;

function flashActionBadge(text) {
    try {
        chrome.action.setBadgeBackgroundColor({ color: '#0aa37f' });
        chrome.action.setBadgeText({ text: text });
        clearTimeout(badgeTimer);
        badgeTimer = setTimeout(() => chrome.action.setBadgeText({ text: '' }), 1600);
    } catch (e) {
        // 角标不可用时静默忽略，写入结果仍以 storage 为准。
    }
}

// 只有 http(s) 网页能成为快速访问链接：chrome://、devtools:// 等内部页没有可复用的地址。
function isQuickLinkCandidate(url) {
    if (typeof url !== 'string' || !url) return false;
    try {
        const protocol = new URL(url).protocol;
        return protocol === 'http:' || protocol === 'https:';
    } catch (e) {
        return false;
    }
}

// 链接名优先用网页标题；标题为空（部分站点未设置）时退回域名。
// 标题中的换行与连续空白会压成单个空格，并限制长度，避免列表项被撑开。
function deriveQuickLinkName(tab, url) {
    const title = tab && typeof tab.title === 'string' ? tab.title.replace(/\s+/g, ' ').trim() : '';
    if (title) return title.length > 60 ? title.slice(0, 60) : title;
    try {
        return new URL(url).hostname || url;
    } catch (e) {
        return url;
    }
}

/**
 * 把当前活动标签页写入快速访问链接。
 * 写入目标跟随侧边栏实际展示的那份列表：侧边栏开启快速访问且为独立配置时写
 * sidePanelQuickLinks，其余情况写主页面的 quickLinks。同一网址已存在时不重复添加。
 * @param {string} [preferredKey] 面板指定的写入目标，省略时按设置推断。
 * @returns {Promise<string>} 写入结果：added / duplicate / invalid / error。
 */
async function addCurrentPageToQuickLinks(preferredKey) {
    let tab = null;
    try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        tab = tabs && tabs[0];
    } catch (e) {
        // 查询失败按无可用网页处理。
    }

    const url = tab && tab.url;
    if (!isQuickLinkCandidate(url)) {
        flashActionBadge('×');
        return 'invalid';
    }

    try {
        const result = await chrome.storage.local.get('oooInterfaceSettings');
        const settings = result.oooInterfaceSettings || {};
        const usePanelList = settings.sidePanelEnabled
            && settings.sidePanelShowQuickLinks
            && settings.sidePanelQuickLinksSync === false;
        let targetKey = usePanelList ? 'sidePanelQuickLinks' : 'quickLinks';
        // 面板编辑的就是当前展示的那份列表，显式指定时以面板为准。
        if (preferredKey === 'quickLinks' || preferredKey === 'sidePanelQuickLinks') {
            targetKey = preferredKey;
        }
        if (!Array.isArray(settings[targetKey])) settings[targetKey] = [];

        const links = settings[targetKey];
        if (links.some((link) => link && link.url === url)) {
            flashActionBadge('已有');
            return 'duplicate';
        }

        links.push({ name: deriveQuickLinkName(tab, url), url: url });
        await chrome.storage.local.set({ oooInterfaceSettings: settings });
        flashActionBadge('已加');
        return 'added';
    } catch (e) {
        console.warn('OOOInterface: 添加快速访问链接失败:', e);
        flashActionBadge('×');
        return 'error';
    }
}

// ---------- Alt+Shift+O 统一入口 ----------

// chrome.commands 与页面内 / 面板内的兜底监听可能同时收到同一次按键
// （命令是否真正分配取决于安装时的建议键），节流保证一次按键只产生一次动作。
let lastQuickAccessShortcutAt = 0;

/**
 * 面板打开时转发给面板弹出快速编辑浮层；面板未打开时把当前网页加入链接列表。
 * @param {number} [windowId] 触发按键的窗口，省略时使用最近聚焦窗口。
 */
function handleQuickAccessShortcut(windowId) {
    if (!cachedShortcutsEnabled) return;

    const now = Date.now();
    if (now - lastQuickAccessShortcutAt < 500) return;
    lastQuickAccessShortcutAt = now;

    const targetWindowId = typeof windowId === 'number' ? windowId : cachedWindowId;
    if (panelOpenWindows.has(targetWindowId)) {
        chrome.runtime.sendMessage({ type: 'open-quick-link-editor', windowId: targetWindowId })
            .catch(() => {
                // 记账的窗口里实际没有面板（关闭事件尚未到达）时退回添加当前网页。
                addCurrentPageToQuickLinks();
            });
        return;
    }
    addCurrentPageToQuickLinks();
}

// 页面内兜底监听与面板转发的统一接收端。
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message || typeof message.type !== 'string') return;

    if (message.type === 'shortcut-trigger') {
        const senderWindowId = sender && sender.tab ? sender.tab.windowId : message.windowId;
        handleQuickAccessShortcut(senderWindowId);
        return;
    }

    if (message.type === 'add-active-page-to-quick-links') {
        addCurrentPageToQuickLinks(message.targetKey).then((status) => {
            sendResponse({ status: status });
        });
        return true;
    }
});

// 快捷键 Alt+O：仅在设置中开启“快捷键”开关后生效；
// 侧边栏功能开启时切换侧边栏（已打开则关闭），否则打开主页。
// 注意：此处同步读取缓存并立即调用，避免 await 打断用户手势。
// Alt+Shift+O：面板打开时弹出快速编辑，否则异步写入快速访问链接，不需要用户手势，
// 故放在手势分支之后。
chrome.commands.onCommand.addListener((command) => {
    if (command === 'add-current-page') {
        handleQuickAccessShortcut();
        return;
    }
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
        // 冷启动兜底：缓存尚未就绪时再取一次当前窗口。
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
// 没有 close() 的旧版 Chrome 与工具栏图标的行为一致，只会打开面板。
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
    // 若只等事件，“已关闭”状态就永远不更新，快捷键会卡在“一直关闭”、再也打不开面板。
    markPanelClosed(windowId);
    chrome.sidePanel.close({ windowId }).catch((e) => {
        // 关闭失败：回滚状态，免得下次快捷键误判成“已关闭”。
        markPanelOpen(windowId);
        console.warn('OOOInterface: 关闭侧边栏失败:', e);
    });
}

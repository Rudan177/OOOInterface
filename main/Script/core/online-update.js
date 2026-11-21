/**
 * 网络滚动更新：按 sup-list 白名单与远程版本号判断是否有新版。
 * 检查与页面预载在界面启动后于后台进行，新版本只记录为待应用，
 * 下一次打开新标签页时才直接跳转到线上 index.html（命中已缓存资源）。
 */

'use strict';

const ONLINE_UPDATE_SUP_LIST_URL = 'https://rudan177.github.io/OOOInterface/info/sup-list.json';
const ONLINE_UPDATE_VERSION_URL = 'https://rudan177.github.io/OOOInterface/try/Script/version.js';
const ONLINE_UPDATE_PAGE_URL = 'https://rudan177.github.io/OOOInterface/try/index.html';
const ONLINE_UPDATE_PENDING_KEY = 'oooInterfaceOnlineUpdatePending';
const ONLINE_UPDATE_PREFETCH_LIMIT = 24;
const ONLINE_UPDATE_ORIGIN = 'https://rudan177.github.io';

// ---------- 远程读取 ----------

/**
 * 读取远程文本；网络异常、非 2xx 或空内容一律返回 null。
 * @param {string} url
 * @param {RequestCache} [cacheMode] 默认 no-store，页面预载时传 default 以便写入本地缓存。
 * @returns {Promise<string|null>}
 */
async function fetchOnlineUpdateText(url, cacheMode) {
    try {
        const response = await fetch(url, { cache: cacheMode || 'no-store' });
        if (!response.ok) {
            return null;
        }
        const text = await response.text();
        return text || null;
    } catch (error) {
        return null;
    }
}

/**
 * 从 version.js 文本中取出 VERSION 常量。
 * @param {string} source
 * @returns {string|null}
 */
function parseOnlineUpdateVersion(source) {
    if (typeof source !== 'string') {
        return null;
    }
    const match = source.match(/VERSION\s*=\s*['"]([^'"]+)['"]/);
    return match ? match[1] : null;
}

// ---------- 待应用版本 ----------

/**
 * 读取上次后台检查准备好的版本号；读不到返回 null。
 * @returns {string|null}
 */
function getPendingOnlineUpdate() {
    try {
        return localStorage.getItem(ONLINE_UPDATE_PENDING_KEY) || null;
    } catch (error) {
        return null;
    }
}

function setPendingOnlineUpdate(version) {
    try {
        localStorage.setItem(ONLINE_UPDATE_PENDING_KEY, version);
    } catch (error) {
        // 存储不可用时仅放弃预载，不影响本地页面。
    }
}

function clearPendingOnlineUpdate() {
    try {
        localStorage.removeItem(ONLINE_UPDATE_PENDING_KEY);
    } catch (error) {
        // 忽略。
    }
}

// ---------- 加载 ----------

/**
 * 用版本号作查询参数，确保升级后不会复用上一版页面的 HTTP 缓存。
 * @param {string} version
 * @returns {string}
 */
function getOnlineUpdatePageUrl(version) {
    return ONLINE_UPDATE_PAGE_URL + '?v=' + encodeURIComponent(version);
}

/**
 * 直接跳转到线上 index.html。
 * 用 replace 而不是 assign，避免用户返回时又落回本地页面并再次触发检查。
 * @param {string} version
 * @returns {boolean} 是否已发起跳转。
 */
function loadOnlineUpdatePage(version) {
    window.location.replace(getOnlineUpdatePageUrl(version));
    return true;
}

// ---------- 后台预载 ----------

/**
 * 从页面 HTML 中收集同源的脚本、样式、图片等资源地址。
 * @param {string} html
 * @param {string} pageUrl
 * @returns {string[]}
 */
function collectOnlineUpdateAssets(html, pageUrl) {
    const assets = new Set();
    const pattern = /(?:src|href)\s*=\s*["']([^"']+)["']/gi;
    let match;
    while ((match = pattern.exec(html))) {
        const raw = match[1].trim();
        if (!raw || raw.startsWith('#') || /^(data|blob|javascript|mailto):/i.test(raw)) {
            continue;
        }
        try {
            const url = new URL(raw, pageUrl);
            if (url.origin !== ONLINE_UPDATE_ORIGIN) {
                continue;
            }
            url.hash = '';
            assets.add(url.href);
        } catch (error) {
            // 非法地址直接跳过。
        }
    }
    return Array.from(assets);
}

/**
 * 把首页引用的同源资源一并取回，让下一次打开时直接命中浏览器缓存。
 * @param {string} html
 * @param {string} pageUrl
 * @returns {Promise<void>}
 */
async function prefetchOnlineUpdateAssets(html, pageUrl) {
    const assets = collectOnlineUpdateAssets(html, pageUrl)
        .filter(url => url !== pageUrl)
        .slice(0, ONLINE_UPDATE_PREFETCH_LIMIT);
    await Promise.allSettled(assets.map(async (url) => {
        try {
            const response = await fetch(url, { cache: 'default' });
            if (response.ok) {
                await response.text();
            }
        } catch (error) {
            // 单个资源失败不影响其它资源。
        }
    }));
}

// ---------- 入口 ----------

/**
 * 设置中的「网络滚动更新」是否开启。
 * @returns {Promise<boolean>}
 */
async function isOnlineRollingUpdateEnabled() {
    try {
        const result = await chrome.storage.local.get('oooInterfaceSettings');
        const settings = result && result.oooInterfaceSettings;
        return !!(settings && settings.onlineRollingUpdate);
    } catch (error) {
        return false;
    }
}

/**
 * 启动时应用上一次后台检查准备好的版本。
 * 没有待应用版本时同步返回，不会给正常启动增加等待。
 * @returns {Promise<boolean>} 是否已发起跳转。
 */
async function applyPendingOnlineUpdate() {
    const pendingVersion = getPendingOnlineUpdate();
    if (!pendingVersion) {
        return false;
    }
    if (typeof compareVersions !== 'function' || compareVersions(pendingVersion, VERSION) <= 0) {
        clearPendingOnlineUpdate();
        return false;
    }
    if (!(await isOnlineRollingUpdateEnabled())) {
        clearPendingOnlineUpdate();
        return false;
    }
    return loadOnlineUpdatePage(pendingVersion);
}

/**
 * 后台检查并预载新版页面，只记录待应用版本，不在本次启动里跳转。
 * 前置条件全部通过才继续：sup-list 含当前产品名、远程版本高于本地、页面可读取。
 * @param {{force?: boolean}} [options] force 为 true 时跳过存储读取（刚在设置页开启开关的场景）。
 * @returns {Promise<boolean>} 是否已准备好新版本。
 */
async function checkOnlineRollingUpdate(options) {
    const force = !!(options && options.force);
    if (!force && !(await isOnlineRollingUpdateEnabled())) {
        return false;
    }

    const supListText = await fetchOnlineUpdateText(ONLINE_UPDATE_SUP_LIST_URL);
    if (!supListText) {
        return false;
    }

    let supList = null;
    try {
        supList = JSON.parse(supListText);
    } catch (error) {
        return false;
    }
    if (!supList || !Array.isArray(supList['sup-list']) || !supList['sup-list'].includes(PRODUCT_NAME)) {
        clearPendingOnlineUpdate();
        return false;
    }

    const versionSource = await fetchOnlineUpdateText(ONLINE_UPDATE_VERSION_URL);
    const remoteVersion = parseOnlineUpdateVersion(versionSource);
    if (!remoteVersion || typeof compareVersions !== 'function') {
        return false;
    }
    if (compareVersions(remoteVersion, VERSION) <= 0) {
        clearPendingOnlineUpdate();
        return false;
    }

    const pageUrl = getOnlineUpdatePageUrl(remoteVersion);
    const pageHtml = await fetchOnlineUpdateText(pageUrl, 'default');
    if (!pageHtml || !/<html[\s>]/i.test(pageHtml)) {
        return false;
    }

    await prefetchOnlineUpdateAssets(pageHtml, pageUrl);
    setPendingOnlineUpdate(remoteVersion);
    return true;
}

export { applyPendingOnlineUpdate, checkOnlineRollingUpdate };

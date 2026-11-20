/**
 * 网络滚动更新：按 sup-list 白名单与远程版本号判断是否需要加载线上的新版页面。
 * 命中后直接跳转到线上的 index.html（带版本查询参数），页面与资源由浏览器缓存到本地。
 */

'use strict';

const ONLINE_UPDATE_SUP_LIST_URL = 'https://rudan177.github.io/OOOInterface/info/sup-list.json';
const ONLINE_UPDATE_VERSION_URL = 'https://rudan177.github.io/OOOInterface/try/Script/version.js';
const ONLINE_UPDATE_PAGE_URL = 'https://rudan177.github.io/OOOInterface/try/index.html';

// ---------- 远程读取 ----------

/**
 * 读取远程文本；网络异常、非 2xx 或空内容一律返回 null。
 * @param {string} url
 * @param {RequestCache} [cacheMode] 默认 no-store，页面预热时传 default 以便写入本地缓存。
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
 * 检查并加载新版页面。
 * 前置条件全部通过才继续：sup-list 含当前产品名、远程版本可解析且高于本地、页面可读取。
 * @param {{force?: boolean}} [options] force 为 true 时跳过存储读取（刚在设置页开启开关的场景）。
 * @returns {Promise<boolean>} 是否已切换到新版页面。
 */
async function applyOnlineRollingUpdate(options) {
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
        return false;
    }

    const versionSource = await fetchOnlineUpdateText(ONLINE_UPDATE_VERSION_URL);
    const remoteVersion = parseOnlineUpdateVersion(versionSource);
    if (!remoteVersion || typeof compareVersions !== 'function') {
        return false;
    }
    if (compareVersions(remoteVersion, VERSION) <= 0) {
        return false;
    }

    // 先确认页面可取，顺带把页面写入浏览器本地缓存，跳转后直接复用。
    const pageUrl = getOnlineUpdatePageUrl(remoteVersion);
    const pageHtml = await fetchOnlineUpdateText(pageUrl, 'default');
    if (!pageHtml || !/<html[\s>]/i.test(pageHtml)) {
        return false;
    }

    return loadOnlineUpdatePage(remoteVersion);
}

export { applyOnlineRollingUpdate };

// ⚠️ 本文件由 tools/build.js 自动生成，请勿直接编辑。
// 源码指纹: c14b8f157ff4f0ef    模块数: 15
// 入口: main/sidepanel/sidepanel.js
// 源码仍在 main/Script/** 按 mixin 拆分维护；改完源码后重新构建：
//     node tools/build.js          （或 node tools/build.js --watch）
// ==== main/Script/color.js ====
/**
 * 配色方案配置
 * 所有配色相关的常量和配置集中管理
 */
const COLOR_SCHEME_NAMES = {
    'green': '林绿色',
    'blue': '经典蓝',
    'black-white': '黑白色',
    'tianyi-blue': '天依蓝',
    'vibrant-red': '活力红',
    'classic-gold': '典藏金',
    'isolation': '隔离色',
    'earth': '地球色',
    'custom': '自定义'
};

const COLOR_SCHEME_CONFIGS = {
    'green': {
        accent: '#00AE90',
        accentRgb: '0, 174, 144',
        accentDark: '#00AE90',
        accentDarkRgb: '0, 174, 144',
        accentHover: '#009A7E',
        accentActive: '#00856C',
        contextMenuHover: '#00AE00',
        contextMenuHoverDark: '#00AE00',
        contextMenuTextColor: '#1a1a1a',
        contextMenuTextColorDark: '#d0d0d0',
        sidebarIcon: '#00AE90',
        notificationBg: 'rgba(0, 174, 0, 0.25)',
        notificationBgDark: 'rgba(0, 174, 0, 0.35)',
        notificationText: '#ffffff',
        notificationTextDark: '#ffffff',
        notificationBorder: 'rgba(0, 174, 0, 0.4)',
        infoClass: 'default',
        particleHueMin: 120,
        particleHueRange: 60,
        particleSaturation: 80,
        glowOrbs: [
            'rgba(0, 174, 144, 0.25)',
            'rgba(0, 200, 150, 0.2)',
            'rgba(100, 255, 200, 0.2)',
            'rgba(180, 255, 120, 0.15)'
        ]
    },
    'blue': {
        accent: '#1a73e8',
        accentRgb: '26, 115, 232',
        accentDark: '#0d47a1',
        accentDarkRgb: '13, 71, 161',
        accentHover: '#1557b2',
        accentActive: '#0f4698',
        contextMenuHover: 'var(--primary-color)',
        contextMenuHoverDark: 'var(--primary-color)',
        contextMenuTextColor: '#1a1a1a',
        contextMenuTextColorDark: '#d0d0d0',
        sidebarIcon: 'var(--primary-color)',
        notificationBg: 'rgba(26, 115, 232, 0.25)',
        notificationBgDark: 'rgba(26, 115, 232, 0.35)',
        notificationText: '#ffffff',
        notificationTextDark: '#ffffff',
        notificationBorder: 'rgba(26, 115, 232, 0.4)',
        infoClass: 'google',
        particleHueMin: 180,
        particleHueRange: 60,
        particleSaturation: 80,
        glowOrbs: [
            'rgba(100, 150, 255, 0.25)',
            'rgba(100, 200, 255, 0.2)',
            'rgba(100, 255, 200, 0.2)',
            'rgba(255, 180, 120, 0.15)'
        ]
    },
    'black-white': {
        accent: '#000000',
        accentRgb: '0, 0, 0',
        accentDark: '#ffffff',
        accentDarkRgb: '255, 255, 255',
        accentHover: '#333333',
        accentActive: '#555555',
        contextMenuHover: '#ffffff',
        contextMenuHoverDark: '#555555',
        contextMenuTextColor: '#000000',
        contextMenuTextColorDark: '#d0d0d0',
        sidebarIcon: '#555555',
        notificationBg: 'rgba(255, 255, 255, 0.75)',
        notificationBgDark: 'rgba(0, 0, 0, 0.55)',
        notificationText: '#000000',
        notificationTextDark: '#ffffff',
        notificationBorder: 'rgba(0, 0, 0, 0.1)',
        notificationBorderDark: 'rgba(255, 255, 255, 0.15)',
        infoClass: 'apple',
        particleHueMin: 0,
        particleHueRange: 360,
        particleSaturation: 10,
        glowOrbs: [
            'rgba(200, 200, 200, 0.2)',
            'rgba(255, 255, 255, 0.15)',
            'rgba(180, 180, 180, 0.15)',
            'rgba(220, 220, 220, 0.1)'
        ]
    },
    'tianyi-blue': {
        accent: '#66ccff',
        accentRgb: '102, 204, 255',
        accentDark: '#4db8e6',
        accentDarkRgb: '77, 184, 230',
        gradient: 'linear-gradient(135deg, #66ccff, #C0C0C0)',
        gradientDark: 'linear-gradient(135deg, #4db8e6, #a0a0a0)',
        accentHover: '#55bcee',
        accentActive: '#44aadd',
        contextMenuHover: '#66ccff',
        contextMenuHoverDark: '#66ccff',
        contextMenuTextColor: '#1a1a1a',
        contextMenuTextColorDark: '#d0d0d0',
        sidebarIcon: '#66ccff',
        notificationBg: 'rgba(102, 204, 255, 0.25)',
        notificationBgDark: 'rgba(102, 204, 255, 0.35)',
        notificationText: '#ffffff',
        notificationTextDark: '#ffffff',
        notificationBorder: 'rgba(102, 204, 255, 0.4)',
        infoClass: 'tianyi-blue',
        particleHueMin: 195,
        particleHueRange: 30,
        particleSaturation: 80,
        glowOrbs: [
            'rgba(102, 204, 255, 0.25)',
            'rgba(192, 192, 192, 0.2)',
            'rgba(150, 220, 255, 0.2)',
            'rgba(180, 200, 220, 0.15)'
        ]
    },
    'vibrant-red': {
        accent: '#FF0000',
        accentRgb: '255, 0, 0',
        accentDark: '#cc0000',
        accentDarkRgb: '204, 0, 0',
        gradient: 'linear-gradient(135deg, #FF0000, #F5F5DC)',
        gradientDark: 'linear-gradient(135deg, #cc0000, #d4d4b0)',
        accentHover: '#e60000',
        accentActive: '#cc0000',
        contextMenuHover: '#FF0000',
        contextMenuHoverDark: '#FF0000',
        contextMenuTextColor: '#1a1a1a',
        contextMenuTextColorDark: '#d0d0d0',
        sidebarIcon: '#FF0000',
        notificationBg: 'rgba(255, 0, 0, 0.25)',
        notificationBgDark: 'rgba(255, 0, 0, 0.35)',
        notificationText: '#ffffff',
        notificationTextDark: '#ffffff',
        notificationBorder: 'rgba(255, 0, 0, 0.4)',
        infoClass: 'vibrant-red',
        particleHueMin: 0,
        particleHueRange: 20,
        particleSaturation: 90,
        glowOrbs: [
            'rgba(255, 0, 0, 0.25)',
            'rgba(245, 245, 220, 0.2)',
            'rgba(255, 80, 80, 0.2)',
            'rgba(255, 150, 100, 0.15)'
        ]
    },
    'classic-gold': {
        accent: '#B46300',
        accentRgb: '180, 99, 0',
        accentDark: '#8c4e00',
        accentDarkRgb: '140, 78, 0',
        gradient: 'linear-gradient(135deg, #4A2F00, #B46300, #FFDB8F)',
        gradientDark: 'linear-gradient(135deg, #2a1a00, #8c4e00, #cca870)',
        accentHover: '#a05800',
        accentActive: '#8c4e00',
        contextMenuHover: '#B46300',
        contextMenuHoverDark: '#B46300',
        contextMenuTextColor: '#1a1a1a',
        contextMenuTextColorDark: '#d0d0d0',
        sidebarIcon: '#B46300',
        notificationBg: 'rgba(180, 99, 0, 0.25)',
        notificationBgDark: 'rgba(180, 99, 0, 0.35)',
        notificationText: '#ffffff',
        notificationTextDark: '#ffffff',
        notificationBorder: 'rgba(180, 99, 0, 0.4)',
        infoClass: 'classic-gold',
        particleHueMin: 35,
        particleHueRange: 25,
        particleSaturation: 90,
        glowOrbs: [
            'rgba(74, 47, 0, 0.25)',
            'rgba(180, 99, 0, 0.2)',
            'rgba(255, 219, 143, 0.2)',
            'rgba(200, 140, 50, 0.15)'
        ]
    },
    'isolation': {
        accent: '#FFD700',
        accentRgb: '255, 215, 0',
        accentDark: '#cca800',
        accentDarkRgb: '204, 168, 0',
        gradient: 'linear-gradient(135deg, #FFD700 0%, #FFD700 45%, #6B238E 55%, #6B238E 100%)',
        gradientDark: 'linear-gradient(135deg, #cca800 0%, #cca800 45%, #4a1a63 55%, #4a1a63 100%)',
        accentHover: '#e6c200',
        accentActive: '#cca800',
        contextMenuHover: '#FFD700',
        contextMenuHoverDark: '#FFD700',
        contextMenuTextColor: '#1a1a1a',
        contextMenuTextColorDark: '#d0d0d0',
        sidebarIcon: '#FFD700',
        notificationBg: 'rgba(255, 215, 0, 0.25)',
        notificationBgDark: 'rgba(255, 215, 0, 0.35)',
        notificationText: '#1a1a1a',
        notificationTextDark: '#1a1a1a',
        notificationBorder: 'rgba(255, 215, 0, 0.4)',
        infoClass: 'isolation',
        particleHueMin: 45,
        particleHueRange: 60,
        particleSaturation: 90,
        glowOrbs: [
            'rgba(255, 215, 0, 0.25)',
            'rgba(107, 35, 142, 0.2)',
            'rgba(255, 230, 100, 0.2)',
            'rgba(150, 80, 180, 0.15)'
        ]
    },
    'earth': {
        accent: '#1e88a8',
        accentRgb: '30, 136, 168',
        accentDark: '#145e78',
        accentDarkRgb: '20, 94, 120',
        gradient: 'linear-gradient(135deg, #1e88a8, #2eaa6e)',
        gradientDark: 'linear-gradient(135deg, #145e78, #1e7e4e)',
        accentHover: '#1a7898',
        accentActive: '#166888',
        contextMenuHover: '#1e88a8',
        contextMenuHoverDark: '#1e88a8',
        contextMenuTextColor: '#1a1a1a',
        contextMenuTextColorDark: '#d0d0d0',
        sidebarIcon: '#1e88a8',
        notificationBg: 'rgba(30, 136, 168, 0.25)',
        notificationBgDark: 'rgba(20, 94, 120, 0.35)',
        notificationText: '#ffffff',
        notificationTextDark: '#ffffff',
        notificationBorder: 'rgba(30, 136, 168, 0.4)',
        infoClass: 'earth',
        particleHueMin: 175,
        particleHueRange: 35,
        particleSaturation: 75,
        glowOrbs: [
            'rgba(30, 136, 168, 0.25)',
            'rgba(46, 170, 110, 0.2)',
            'rgba(80, 200, 160, 0.18)',
            'rgba(60, 180, 140, 0.12)'
        ]
    },
    'custom': {
        accent: '#1a73e8',
        accentRgb: '26, 115, 232',
        accentDark: '#0d47a1',
        accentDarkRgb: '13, 71, 161',
        accentHover: '#1557b2',
        accentActive: '#0f4698',
        contextMenuHover: 'var(--primary-color)',
        contextMenuHoverDark: 'var(--primary-color)',
        contextMenuTextColor: '#1a1a1a',
        contextMenuTextColorDark: '#d0d0d0',
        sidebarIcon: 'var(--primary-color)',
        notificationBg: 'rgba(26, 115, 232, 0.25)',
        notificationBgDark: 'rgba(26, 115, 232, 0.35)',
        notificationText: '#ffffff',
        notificationTextDark: '#ffffff',
        notificationBorder: 'rgba(26, 115, 232, 0.4)',
        infoClass: 'custom',
        particleHueMin: 180,
        particleHueRange: 60,
        particleSaturation: 80,
        glowOrbs: [
            'rgba(100, 150, 255, 0.25)',
            'rgba(100, 200, 255, 0.2)',
            'rgba(100, 255, 200, 0.2)',
            'rgba(255, 180, 120, 0.15)'
        ]
    }
};

function parseRgb(hex) {
    const val = hex.replace('#', '');
    if (val.length === 6) {
        const r = parseInt(val.substring(0, 2), 16);
        const g = parseInt(val.substring(2, 4), 16);
        const b = parseInt(val.substring(4, 6), 16);
        return `${r}, ${g}, ${b}`;
    }
    return '0, 0, 0';
}

function darkenColor(hex, amount) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, (num >> 16) - amount);
    const g = Math.max(0, ((num >> 8) & 0x00FF) - amount);
    const b = Math.max(0, (num & 0x0000FF) - amount);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

function buildCustomColorConfig(customColors) {
    const { primaryColor, secondaryColor, gradientEnabled, gradientStart, gradientEnd } = customColors;
    const hasSecondary = secondaryColor && secondaryColor.trim();
    const hasGradient = hasSecondary && gradientEnabled;
    const gStart = (gradientStart !== undefined ? gradientStart : 0);
    const gEnd = (gradientEnd !== undefined ? gradientEnd : 100);
    const rgb = parseRgb(primaryColor);
    const hoverColor = darkenColor(primaryColor, 30);
    const activeColor = darkenColor(primaryColor, 50);

    const config = {
        accent: primaryColor,
        accentRgb: rgb,
        accentDark: primaryColor,
        accentDarkRgb: rgb,
        accentHover: hoverColor,
        accentActive: activeColor,
        contextMenuHover: primaryColor,
        contextMenuHoverDark: primaryColor,
        contextMenuTextColor: '#1a1a1a',
        contextMenuTextColorDark: '#d0d0d0',
        sidebarIcon: primaryColor,
        notificationBg: `rgba(${rgb}, 0.25)`,
        notificationBgDark: `rgba(${rgb}, 0.35)`,
        notificationText: '#ffffff',
        notificationBorder: `rgba(${rgb}, 0.4)`,
        infoClass: 'custom',
        particleHueMin: 180,
        particleHueRange: 60,
        particleSaturation: 80,
        glowOrbs: [
            `rgba(${rgb}, 0.25)`,
            `rgba(${rgb}, 0.2)`,
            `rgba(${rgb}, 0.15)`,
            `rgba(${rgb}, 0.1)`
        ]
    };

    if (hasGradient) {
        config.gradient = `linear-gradient(135deg, ${primaryColor} ${gStart}%, ${secondaryColor} ${gEnd}%)`;
        config.gradientDark = `linear-gradient(135deg, ${primaryColor} ${gStart}%, ${secondaryColor} ${gEnd}%)`;
    }

    return config;
}

function getColorConfig(scheme, customColors) {
    if (scheme === 'custom') {
        if (customColors && customColors.primaryColor) {
            return buildCustomColorConfig(customColors);
        }
        return COLOR_SCHEME_CONFIGS['blue'];
    }
    return COLOR_SCHEME_CONFIGS[scheme] || COLOR_SCHEME_CONFIGS['green'];
}

// ==== main/Script/proxy.js ====
const ProxyManager = (function () {
    var proxyPort = null;

    function loadProxy() {
        var saved = localStorage.getItem('oooProxyPort');
        if (saved !== null && saved !== '') {
            proxyPort = parseInt(saved, 10);
            if (isNaN(proxyPort)) {
                proxyPort = null;
                localStorage.removeItem('oooProxyPort');
            }
        } else {
            proxyPort = null;
        }
        return proxyPort;
    }

    function setProxy(port) {
        if (port === null || port === undefined || port === '' || isNaN(port)) {
            proxyPort = null;
            localStorage.removeItem('oooProxyPort');
        } else {
            proxyPort = parseInt(port, 10);
            localStorage.setItem('oooProxyPort', proxyPort);
        }
    }

    function getProxyPort() {
        if (proxyPort === null) {
            loadProxy();
        }
        return proxyPort;
    }

    function isProxyEnabled() {
        return getProxyPort() !== null;
    }

    function buildProxyUrl(targetUrl) {
        var port = getProxyPort();
        if (!port) return targetUrl;
        return 'http://127.0.0.1:' + port + '/proxy?url=' + encodeURIComponent(targetUrl);
    }

    function proxiedFetch(url, options) {
        var port = getProxyPort();
        if (port) {
            var proxyUrl = buildProxyUrl(url);
            return fetch(proxyUrl, options || {}).then(function (response) {
                if (!response.ok) {
                    console.warn('[ProxyManager] 代理请求返回状态码:', response.status, 'URL:', url);
                }
                return response;
            }).catch(function (err) {
                console.error('[ProxyManager] 代理请求失败:', err.message, '端口:', port, '目标:', url);
                throw new Error('代理连接失败 (端口 ' + port + ')：' + err.message);
            });
        }
        return fetch(url, options || {});
    }

    function testProxyConnection(timeout) {
        timeout = timeout || 5000;
        return new Promise(function (resolve, reject) {
            var port = getProxyPort();
            if (!port) {
                reject(new Error('未配置代理端口'));
                return;
            }

            // 使用 /health 端点做真实连通性检测：
            // no-cors 模式得到的是 opaque 响应（无法读取状态码），会把失败误判为成功
            var testUrl = 'http://127.0.0.1:' + port + '/health';
            var timer = setTimeout(function () {
                reject(new Error('代理连接超时 (' + timeout + 'ms)，请确认代理服务正在运行'));
            }, timeout);

            fetch(testUrl, { method: 'GET', mode: 'cors', cache: 'no-store' })
                .then(function (res) {
                    clearTimeout(timer);
                    if (!res.ok) {
                        reject(new Error('代理服务响应异常，状态码: ' + res.status + ' 端口: ' + port));
                        return;
                    }
                    resolve({ ok: true, port: port });
                })
                .catch(function (err) {
                    clearTimeout(timer);
                    reject(new Error('无法连接到代理服务 端口:' + port + ' - ' + err.message));
                });
        });
    }

    function clearProxy() {
        proxyPort = null;
        localStorage.removeItem('oooProxyPort');
    }

    loadProxy();

    return {
        setProxy: setProxy,
        getProxyPort: getProxyPort,
        isProxyEnabled: isProxyEnabled,
        proxiedFetch: proxiedFetch,
        buildProxyUrl: buildProxyUrl,
        testProxyConnection: testProxyConnection,
        clearProxy: clearProxy,
        loadProxy: loadProxy
    };
})();

// ==== main/Script/widgets/WidgetBase.js ====
/**
 * OOOInterface 小组件基类
 * 所有小组件继承此基类，实现 render() 与 destroy()
 */
// [bundled] import { … } from '../proxy.js'

class WidgetBase {
    /**
     * @param {Object} config 小组件配置
     * @param {string} config.id 唯一 ID
     * @param {string} config.type 类型：clock/weather/tasks/ai-agent/email
     * @param {string} config.size 尺寸：square/rectangle/super
     * @param {Object} config.data 类型专属数据
     * @param {OOOInterface} config.ooo OOOInterface 实例（用于访问 settings/notification 等）
     */
    constructor(config) {
        this.id = config.id;
        this.type = config.type;
        this.size = config.size || 'square';
        this.data = config.data || {};
        this.ooo = config.ooo || null;
        this.element = null;
        this._timers = [];
        this._abortControllers = [];
    }

    /**
     * 渲染小组件到父容器
     * @param {HTMLElement} container 父容器（widget-panel-grid）
     */
    render(container) {
        this.element = document.createElement('div');
        this.element.className = 'widget-card ' + this.size;
        this.element.dataset.widgetId = this.id;
        this.element.dataset.widgetType = this.type;
        this.buildContent();
        container.appendChild(this.element);
        this.afterMount();
    }

    /**
     * 构建卡片内部内容（子类实现）
     */
    buildContent() {
        throw new Error('buildContent() 必须在子类中实现');
    }

    /**
     * 挂载后的回调（子类可覆写，用于启动定时器等）
     */
    afterMount() { }

    /**
     * 统一 fetch 封装：直连优先，失败时走代理（参照 fetchBingWallpaper 模式）
     * @param {string} url
     * @param {Object} options fetch 选项
     * @returns {Promise<Response>}
     */
    async fetchAPI(url, options) {
        try {
            const resp = await fetch(url, options);
            if (!resp.ok) throw new Error('HTTP ' + resp.status);
            return resp;
        } catch (err) {
            // 直连失败（CORS 拦截/网络错误）时，若已配置代理则走代理
            if (typeof ProxyManager !== 'undefined' && ProxyManager.isProxyEnabled()) {
                const proxied = await ProxyManager.proxiedFetch(url, options);
                if (!proxied.ok) throw new Error('HTTP ' + proxied.status);
                return proxied;
            }
            throw err;
        }
    }

    /**
     * 便捷 JSON 请求
     */
    async fetchJSON(url, options) {
        const resp = await this.fetchAPI(url, options);
        return resp.json();
    }

    /**
     * 注册定时器（组件销毁时自动清理）
     */
    setTimer(fn, ms) {
        const id = setTimeout(() => {
            const idx = this._timers.indexOf(id);
            if (idx >= 0) this._timers.splice(idx, 1);
            fn();
        }, ms);
        this._timers.push(id);
        return id;
    }

    /**
     * 注册循环定时器
     */
    setIntervalTimer(fn, ms) {
        const id = setInterval(fn, ms);
        this._timers.push(id);
        return id;
    }

    /**
     * 注册 AbortController（销毁时自动 abort）
     */
    trackAbort(controller) {
        this._abortControllers.push(controller);
        return controller;
    }

    /**
     * 销毁小组件：清理定时器与进行中的请求
     */
    destroy() {
        this._timers.forEach(id => {
            clearTimeout(id);
            clearInterval(id);
        });
        this._timers = [];
        this._abortControllers.forEach(c => {
            try { c.abort(); } catch (e) { /* 忽略 */ }
        });
        this._abortControllers = [];
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
    }

    /**
     * 显示通知（复用 OOOInterface.showNotification）
     */
    notify(message) {
        if (this.ooo && typeof this.ooo.showNotification === 'function') {
            this.ooo.showNotification(message);
        }
    }

    /**
     * 保存当前小组件数据（通过 OOOInterface 触发）
     */
    persist() {
        if (this.ooo && typeof this.ooo.saveWidgetData === 'function') {
            this.ooo.saveWidgetData(this.id, this.data);
        }
    }

    /**
     * 从设置中读取指定 ID 的 widget 配置
     */
    static getWidgetConfig(ooo, widgetId) {
        if (!ooo || !ooo.settings || !Array.isArray(ooo.settings.widgetPanel.widgets)) return null;
        return ooo.settings.widgetPanel.widgets.find(w => w.id === widgetId) || null;
    }

    /**
     * 更新设置中的 widget 配置并保存
     */
    static updateWidgetConfig(ooo, widgetId, patch) {
        if (!ooo || !ooo.settings || !Array.isArray(ooo.settings.widgetPanel.widgets)) return;
        const widgets = ooo.settings.widgetPanel.widgets;
        const idx = widgets.findIndex(w => w.id === widgetId);
        if (idx < 0) return;
        widgets[idx] = Object.assign({}, widgets[idx], patch);
        ooo.saveWidgetSettings();
    }
}

// ==== main/Script/widgets/ClockWidget.js ====
/**
 * 大时钟小组件
 * 纯客户端，本地时间，每秒刷新
 * - 正方形：垂直布局（时间在上，日期在下）
 * - 长方形：横向布局（时间在左，日期在右）
 */
// [bundled] import { … } from './WidgetBase.js'

class ClockWidget extends WidgetBase {
    constructor(config) {
        super(config);
        this.type = 'clock';
    }

    buildContent() {
        this.element.classList.add('widget-clock');
        this.isRect = this.size === 'rectangle';

        this.timeEl = document.createElement('div');
        this.timeEl.className = 'widget-clock-time' + (this.isRect ? ' rect' : '');

        this.dateEl = document.createElement('div');
        this.dateEl.className = 'widget-clock-date' + (this.isRect ? ' rect' : '');

        this.element.appendChild(this.timeEl);
        this.element.appendChild(this.dateEl);

        this.update();
    }

    afterMount() {
        this.setIntervalTimer(() => this.update(), 1000);
    }

    update() {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const dateText = weekdays[now.getDay()] + ' ' + (now.getMonth() + 1) + '月' + now.getDate() + '日';

        if (this.isRect) {
            // 长方形：时间 + 秒
            const ss = String(now.getSeconds()).padStart(2, '0');
            this.timeEl.textContent = hh + ':' + mm + ':' + ss;
        } else {
            this.timeEl.textContent = hh + ':' + mm;
        }
        this.dateEl.textContent = dateText;
    }
}

// ==== main/Script/widgets/CalendarWidget.js ====
/**
 * 日历小组件
 * 纯客户端，本地时间，农历转换（1900-2100 查表算法，无网络依赖）
 * - 小尺寸：当天日期（大号数字）+ 星期 + 农历
 * - 大尺寸：左侧为小尺寸同款（日期/星期/农历），右侧为本月迷你日历
 * - 超大尺寸：大号本月日历（周一起始、含翻月导航与每日农历标注，标题点击回到今天）
 * 每日零点自动刷新（日期/星期/农历跨天更新）
 */
// [bundled] import { … } from './WidgetBase.js'

class CalendarWidget extends WidgetBase {
    constructor(config) {
        super(config);
        this.type = 'calendar';
        this.now = new Date();
        // 超大尺寸的翻月视图（默认本月）
        this.viewYear = this.now.getFullYear();
        this.viewMonth = this.now.getMonth();
    }

    buildContent() {
        this.element.classList.add('widget-calendar');
        this.isRect = this.size === 'rectangle';
        this.isSuper = this.size === 'super';

        if (this.isSuper) {
            this.buildSuperLayout();
        } else if (this.isRect) {
            this.buildRectLayout();
        } else {
            this.buildSquareLayout();
        }
        this.update();
    }

    afterMount() {
        // 每天零点后自动刷新（跨天更新日期/星期/农历）
        this.scheduleMidnightRefresh();
    }

    scheduleMidnightRefresh() {
        const now = new Date();
        const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1, 0);
        this.setTimer(() => {
            if (!this.element || !this.element.parentNode) return; // 组件已销毁，跳过刷新
            const prev = this.now;
            this.now = new Date();
            // 若翻月视图仍停留在“昨天”所在月份，自动跟随到今天所在月份
            if (this.viewYear === prev.getFullYear() && this.viewMonth === prev.getMonth()) {
                this.viewYear = this.now.getFullYear();
                this.viewMonth = this.now.getMonth();
            }
            this.update();
            this.scheduleMidnightRefresh();
        }, Math.max(1000, next.getTime() - now.getTime()));
    }

    // ---------- 布局构建 ----------

    // “今天”信息区（小尺寸同款）：月份年份 / 大号日期 / 星期 / 农历
    buildTodayInfo(parent) {
        const monthEl = document.createElement('div');
        monthEl.className = 'widget-calendar-month';

        const dayEl = document.createElement('div');
        dayEl.className = 'widget-calendar-day';

        const weekdayEl = document.createElement('div');
        weekdayEl.className = 'widget-calendar-weekday';

        const lunarEl = document.createElement('div');
        lunarEl.className = 'widget-calendar-lunar';

        parent.appendChild(monthEl);
        parent.appendChild(dayEl);
        parent.appendChild(weekdayEl);
        parent.appendChild(lunarEl);
        return { monthEl, dayEl, weekdayEl, lunarEl };
    }

    buildSquareLayout() {
        this.info = this.buildTodayInfo(this.element);
    }

    buildRectLayout() {
        // 左侧：小尺寸同款
        this.leftEl = document.createElement('div');
        this.leftEl.className = 'widget-calendar-left';
        this.info = this.buildTodayInfo(this.leftEl);
        this.element.appendChild(this.leftEl);

        // 右侧：本月迷你日历
        this.rightEl = document.createElement('div');
        this.rightEl.className = 'widget-calendar-right';
        this.miniHeadEl = document.createElement('div');
        this.miniHeadEl.className = 'widget-calendar-mini-head';
        this.miniBodyEl = document.createElement('div');
        this.miniBodyEl.className = 'widget-calendar-mini-body';
        this.rightEl.appendChild(this.miniHeadEl);
        this.rightEl.appendChild(this.miniBodyEl);
        this.element.appendChild(this.rightEl);
    }

    buildSuperLayout() {
        // 顶栏：上月 / 年月标题 / 下月
        this.superHeadEl = document.createElement('div');
        this.superHeadEl.className = 'widget-calendar-super-head';

        this.prevBtn = this.buildNavButton('prev', '上个月');
        this.prevBtn.addEventListener('click', () => this.changeMonth(-1));

        this.superTitleEl = document.createElement('div');
        this.superTitleEl.className = 'widget-calendar-super-title';
        this.superTitleEl.title = '回到今天';
        this.superTitleEl.addEventListener('click', () => this.goToday());

        this.nextBtn = this.buildNavButton('next', '下个月');
        this.nextBtn.addEventListener('click', () => this.changeMonth(1));

        this.superHeadEl.appendChild(this.prevBtn);
        this.superHeadEl.appendChild(this.superTitleEl);
        this.superHeadEl.appendChild(this.nextBtn);
        this.element.appendChild(this.superHeadEl);

        // 星期表头
        this.gridHeadEl = document.createElement('div');
        this.gridHeadEl.className = 'widget-calendar-grid-head';
        this.element.appendChild(this.gridHeadEl);

        // 日期网格
        this.gridBodyEl = document.createElement('div');
        this.gridBodyEl.className = 'widget-calendar-grid';
        this.element.appendChild(this.gridBodyEl);
    }

    // 导航箭头（内联 SVG，无字体依赖，与页面返回按钮风格一致）
    buildNavButton(dir, label) {
        const btn = document.createElement('button');
        btn.className = 'widget-calendar-nav';
        btn.type = 'button';
        btn.title = label;
        btn.setAttribute('aria-label', label);
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', '18');
        svg.setAttribute('height', '18');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('fill', 'currentColor');
        // Material Design chevron_left / chevron_right
        path.setAttribute('d', dir === 'prev'
            ? 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z'
            : 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z');
        svg.appendChild(path);
        btn.appendChild(svg);
        return btn;
    }

    // ---------- 渲染 ----------

    // 更新显示（跨天/翻月后调用）
    update() {
        if (this.isSuper) {
            this.renderSuper();
            return;
        }
        const now = this.now;
        const lunar = CalendarWidget.formatLunar(now);

        this.info.monthEl.textContent = now.getFullYear() + '年' + (now.getMonth() + 1) + '月';
        this.info.dayEl.textContent = String(now.getDate());
        this.info.weekdayEl.textContent = '星期' + WEEKDAY_NAMES[now.getDay()];
        this.info.lunarEl.textContent = '农历' + lunar.full;

        if (this.isRect) {
            this.renderMini();
        }
    }

    // 本月迷你日历（大尺寸右侧）
    renderMini() {
        this.miniHeadEl.innerHTML = '';
        this.miniBodyEl.innerHTML = '';
        const y = this.now.getFullYear();
        const m = this.now.getMonth();

        WEEKDAY_HEADER.forEach(w => {
            const cell = document.createElement('span');
            cell.className = 'widget-calendar-mini-wd';
            cell.textContent = w;
            this.miniHeadEl.appendChild(cell);
        });

        const first = new Date(y, m, 1);
        const leading = (first.getDay() + 6) % 7; // 周一起始
        for (let i = 0; i < leading; i++) {
            const blank = document.createElement('span');
            blank.className = 'widget-calendar-mini-blank';
            this.miniBodyEl.appendChild(blank);
        }

        const daysInMonth = new Date(y, m + 1, 0).getDate();
        for (let d = 1; d <= daysInMonth; d++) {
            const cell = document.createElement('span');
            cell.className = 'widget-calendar-mini-cell';
            if (d === this.now.getDate()) cell.classList.add('today');
            cell.textContent = String(d);
            this.miniBodyEl.appendChild(cell);
        }
    }

    // 大号本月日历（超大尺寸）
    renderSuper() {
        this.superTitleEl.textContent = this.viewYear + '年' + (this.viewMonth + 1) + '月';
        this.gridHeadEl.innerHTML = '';
        this.gridBodyEl.innerHTML = '';

        WEEKDAY_HEADER.forEach(w => {
            const cell = document.createElement('span');
            cell.className = 'widget-calendar-grid-wd';
            cell.textContent = w;
            this.gridHeadEl.appendChild(cell);
        });

        const first = new Date(this.viewYear, this.viewMonth, 1);
        const leading = (first.getDay() + 6) % 7; // 周一起始
        const daysInMonth = new Date(this.viewYear, this.viewMonth + 1, 0).getDate();
        const prevDaysInMonth = new Date(this.viewYear, this.viewMonth, 0).getDate();
        const now = this.now;
        const isCurrentMonth = this.viewYear === now.getFullYear() && this.viewMonth === now.getMonth();

        // 上月补位日（弱化显示）
        for (let i = 0; i < leading; i++) {
            this.gridBodyEl.appendChild(this.buildSuperCell(prevDaysInMonth - leading + 1 + i, true, false));
        }

        // 本月日期
        for (let d = 1; d <= daysInMonth; d++) {
            const isToday = isCurrentMonth && d === now.getDate();
            this.gridBodyEl.appendChild(this.buildSuperCell(d, false, isToday));
        }

        // 下月补位日（补足最后一周）
        const total = leading + daysInMonth;
        const trailing = total % 7 === 0 ? 0 : 7 - (total % 7);
        for (let i = 1; i <= trailing; i++) {
            this.gridBodyEl.appendChild(this.buildSuperCell(i, true, false));
        }
    }

    // 构造单个日期格（超大尺寸）
    buildSuperCell(dayNum, isOtherMonth, isToday) {
        const cell = document.createElement('div');
        cell.className = 'widget-calendar-cell';
        if (isOtherMonth) cell.classList.add('other-month');
        if (isToday) cell.classList.add('today');

        const numEl = document.createElement('span');
        numEl.className = 'widget-calendar-cell-num';
        numEl.textContent = String(dayNum);
        cell.appendChild(numEl);

        // 本月日期显示农历：初一显示月份名（含闰月前缀）
        if (!isOtherMonth) {
            const lunar = CalendarWidget.solarToLunar(this.viewYear, this.viewMonth + 1, dayNum);
            const label = lunar.lunarDay === 1
                ? (lunar.isLeap ? '闰' : '') + LUNAR_MONTH_NAMES[lunar.lunarMonth - 1]
                : LUNAR_DAY_NAMES[lunar.lunarDay - 1];
            const lunarEl = document.createElement('span');
            lunarEl.className = 'widget-calendar-cell-lunar';
            lunarEl.textContent = label;
            cell.appendChild(lunarEl);
        }
        return cell;
    }

    // 翻月导航
    changeMonth(delta) {
        let m = this.viewMonth + delta;
        let y = this.viewYear;
        if (m < 0) { m = 11; y--; }
        if (m > 11) { m = 0; y++; }
        this.viewYear = y;
        this.viewMonth = m;
        this.renderSuper();
    }

    // 回到今天
    goToday() {
        this.now = new Date();
        this.viewYear = this.now.getFullYear();
        this.viewMonth = this.now.getMonth();
        this.renderSuper();
    }

    // ---------- 农历转换（1900-2100 查表） ----------

    // 农历月天数（含大小月）
    static monthDays(y, m) {
        return (LUNAR_INFO[y - 1899] & (0x10000 >> m)) ? 30 : 29;
    }

    // 农历闰月（0 = 无闰月）
    static leapMonth(y) {
        return LUNAR_INFO[y - 1899] & 0xf;
    }

    // 农历闰月天数
    static leapDays(y) {
        const l = CalendarWidget.leapMonth(y);
        return l > 0 ? ((LUNAR_INFO[y - 1899] & 0x10000) ? 30 : 29) : 0;
    }

    // 农历年总天数
    static lunarYearDays(y) {
        let sum = 0;
        for (let i = 1; i <= 12; i++) sum += CalendarWidget.monthDays(y, i);
        return sum + CalendarWidget.leapDays(y);
    }

    // 公历转农历（y/m/d 为公历年月日）
    static solarToLunar(y, m, d) {
        let offset = (Date.UTC(y, m - 1, d) - Date.UTC(1900, 0, 31)) / 86400000;
        let i, temp = 0;

        for (i = 1900; i <= 2100 && offset >= 0; i++) {
            temp = CalendarWidget.lunarYearDays(i);
            offset -= temp;
        }
        if (offset < 0) { offset += temp; i--; }

        const lunarYear = i;
        const leap = CalendarWidget.leapMonth(lunarYear);
        let isLeap = false;

        for (i = 1; i <= 12 && offset > 0; i++) {
            if (leap > 0 && i === (leap + 1) && isLeap === false) {
                --i;
                isLeap = true;
                temp = CalendarWidget.leapDays(lunarYear);
            } else {
                temp = CalendarWidget.monthDays(lunarYear, i);
            }
            if (isLeap === true && i === (leap + 1)) isLeap = false;
            offset -= temp;
            if (offset === 0 && leap > 0 && i === leap) { isLeap = true; break; }
        }

        if (offset === 0 && leap > 0 && i === leap + 1) {
            if (isLeap) { isLeap = false; }
            else { isLeap = true; --i; }
        }
        if (offset < 0) { offset += temp; --i; }

        return { lunarYear, lunarMonth: i, lunarDay: offset + 1, isLeap };
    }

    // 格式化农历（返回月份名 / 日名 / 完整串）
    static formatLunar(date) {
        const l = CalendarWidget.solarToLunar(date.getFullYear(), date.getMonth() + 1, date.getDate());
        const monthName = (l.isLeap ? '闰' : '') + LUNAR_MONTH_NAMES[l.lunarMonth - 1];
        const dayName = LUNAR_DAY_NAMES[l.lunarDay - 1];
        return {
            lunarYear: l.lunarYear,
            lunarMonth: l.lunarMonth,
            lunarDay: l.lunarDay,
            isLeap: l.isLeap,
            monthName,
            dayName,
            full: monthName + dayName
        };
    }
}

/* ---------- 农历查表数据（1899-2100，索引 = 年份 - 1899） ---------- */
const LUNAR_INFO = [
    0x0AB50, 0x04BD8, 0x04AE0, 0x0A570, 0x054D5, 0x0D260, 0x0D950, 0x16554, 0x056A0, 0x09AD0,
    0x055D2, 0x04AE0, 0x0A5B6, 0x0A4D0, 0x0D250, 0x1D255, 0x0B540, 0x0D6A0, 0x0ADA2, 0x095B0,
    0x14977, 0x04970, 0x0A4B0, 0x0B4B5, 0x06A50, 0x06D40, 0x1AB54, 0x02B60, 0x09570, 0x052F2,
    0x04970, 0x06566, 0x0D4A0, 0x0EA50, 0x16A95, 0x05AD0, 0x02B60, 0x186E3, 0x092E0, 0x1C8D7,
    0x0C950, 0x0D4A0, 0x1D8A6, 0x0B550, 0x056A0, 0x1A5B4, 0x025D0, 0x092D0, 0x0D2B2, 0x0A950,
    0x0B557, 0x06CA0, 0x0B550, 0x15355, 0x04DA0, 0x0A5B0, 0x14573, 0x052B0, 0x0A9A8, 0x0E950,
    0x06AA0, 0x0AEA6, 0x0AB50, 0x04B60, 0x0AAE4, 0x0A570, 0x05260, 0x0F263, 0x0D950, 0x05B57,
    0x056A0, 0x096D0, 0x04DD5, 0x04AD0, 0x0A4D0, 0x0D4D4, 0x0D250, 0x0D558, 0x0B540, 0x0B6A0,
    0x195A6, 0x095B0, 0x049B0, 0x0A974, 0x0A4B0, 0x0B27A, 0x06A50, 0x06D40, 0x0AF46, 0x0AB60,
    0x09570, 0x04AF5, 0x04970, 0x064B0, 0x074A3, 0x0EA50, 0x06B58, 0x05AC0, 0x0AB60, 0x096D5,
    0x092E0, 0x0C960, 0x0D954, 0x0D4A0, 0x0DA50, 0x07552, 0x056A0, 0x0ABB7, 0x025D0, 0x092D0,
    0x0CAB5, 0x0A950, 0x0B4A0, 0x0BAA4, 0x0AD50, 0x055D9, 0x04BA0, 0x0A5B0, 0x15176, 0x052B0,
    0x0A930, 0x07954, 0x06AA0, 0x0AD50, 0x05B52, 0x04B60, 0x0A6E6, 0x0A4E0, 0x0D260, 0x0EA65,
    0x0D530, 0x05AA0, 0x076A3, 0x096D0, 0x04AFB, 0x04AD0, 0x0A4D0, 0x1D0B6, 0x0D250, 0x0D520,
    0x0DD45, 0x0B5A0, 0x056D0, 0x055B2, 0x049B0, 0x0A577, 0x0A4B0, 0x0AA50, 0x1B255, 0x06D20,
    0x0ADA0, 0x14B63, 0x09370, 0x049F8, 0x04970, 0x064B0, 0x168A6, 0x0EA50, 0x06B20, 0x1A6C4,
    0x0AAE0, 0x092E0, 0x0D2E3, 0x0C960, 0x0D557, 0x0D4A0, 0x0DA50, 0x05D55, 0x056A0, 0x0A6D0,
    0x055D4, 0x052D0, 0x0A9B8, 0x0A950, 0x0B4A0, 0x0B6A6, 0x0AD50, 0x055A0, 0x0ABA4, 0x0A5B0,
    0x052B0, 0x0B273, 0x06930, 0x07337, 0x06AA0, 0x0AD50, 0x14B55, 0x04B60, 0x0A570, 0x054E4,
    0x0D160, 0x0E968, 0x0D520, 0x0DAA0, 0x16AA6, 0x056D0, 0x04AE0, 0x0A9D4, 0x0A2D0, 0x0D150,
    0x0F252, 0x0D520];

const LUNAR_MONTH_NAMES = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
const LUNAR_DAY_NAMES = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
const WEEKDAY_NAMES = ['日', '一', '二', '三', '四', '五', '六'];
const WEEKDAY_HEADER = ['一', '二', '三', '四', '五', '六', '日'];

// ==== main/Script/widgets/WeatherWidget.js ====
/**
 * 天气小组件
 * 数据源：Open-Meteo（免费无 Key）
 * - 定位优先（navigator.geolocation），失败回退到配置城市（默认南昌）
 * - 每 30 分钟刷新一次
 * - 天气图标使用 Material Symbols
 * - 正方形：垂直布局（图标+温度居中，城市/描述下方）
 * - 长方形：横向布局（左图标+温度，右城市+详情）
 */
// [bundled] import { … } from './WidgetBase.js'

class WeatherWidget extends WidgetBase {
    constructor(config) {
        super(config);
        this.type = 'weather';
        this.city = (this.data && this.data.city) || '南昌';
        // 仅当缓存坐标对应的城市与当前城市一致时才复用，避免改城市后仍用旧坐标
        const coordsMatch = !!(this.data && this.data.coordsCity === this.city);
        this.coords = (coordsMatch && this.data && this.data.lat && this.data.lon)
            ? { lat: this.data.lat, lon: this.data.lon }
            : null;
        this.lastUpdate = (this.data && this.data.lastUpdate) || 0;
        this.cachedWeather = (this.data && this.data.cached) || null;
        // 城市变更后旧缓存天气失效，强制重新获取
        if (!coordsMatch && this.cachedWeather) {
            this.cachedWeather = null;
            this.lastUpdate = 0;
        }
    }

    buildContent() {
        this.element.classList.add('widget-weather');
        this.isRect = this.size === 'rectangle';

        if (this.isRect) {
            this.buildRectangleLayout();
        } else {
            this.buildSquareLayout();
        }

        if (this.cachedWeather) {
            this.applyWeather(this.cachedWeather);
        } else {
            this.renderLoading();
        }
    }

    buildSquareLayout() {
        this.iconEl = document.createElement('span');
        this.iconEl.className = 'material-symbols-outlined widget-weather-icon';

        this.tempEl = document.createElement('div');
        this.tempEl.className = 'widget-weather-temp';

        this.descEl = document.createElement('div');
        this.descEl.className = 'widget-weather-desc';

        this.cityEl = document.createElement('div');
        this.cityEl.className = 'widget-weather-city';

        this.element.appendChild(this.iconEl);
        this.element.appendChild(this.tempEl);
        this.element.appendChild(this.descEl);
        this.element.appendChild(this.cityEl);
    }

    buildRectangleLayout() {
        // 左侧：图标 + 温度
        this.leftPanel = document.createElement('div');
        this.leftPanel.className = 'widget-weather-left';

        this.iconEl = document.createElement('span');
        this.iconEl.className = 'material-symbols-outlined widget-weather-icon-rect';

        this.tempEl = document.createElement('div');
        this.tempEl.className = 'widget-weather-temp-rect';

        this.leftPanel.appendChild(this.iconEl);
        this.leftPanel.appendChild(this.tempEl);

        // 右侧：城市 + 描述 + 湿度 + 风速
        this.rightPanel = document.createElement('div');
        this.rightPanel.className = 'widget-weather-right';

        this.cityEl = document.createElement('div');
        this.cityEl.className = 'widget-weather-city-rect';

        this.descEl = document.createElement('div');
        this.descEl.className = 'widget-weather-desc-rect';

        this.extraEl = document.createElement('div');
        this.extraEl.className = 'widget-weather-extra';

        this.humidityEl = document.createElement('span');
        this.humidityEl.className = 'widget-weather-extra-item';
        this.windEl = document.createElement('span');
        this.windEl.className = 'widget-weather-extra-item';

        this.extraEl.appendChild(this.humidityEl);
        this.extraEl.appendChild(this.windEl);

        this.rightPanel.appendChild(this.cityEl);
        this.rightPanel.appendChild(this.descEl);
        this.rightPanel.appendChild(this.extraEl);

        this.element.appendChild(this.leftPanel);
        this.element.appendChild(this.rightPanel);
    }

    renderLoading() {
        if (this.isRect) {
            this.iconEl.textContent = 'sunny';
            this.tempEl.textContent = '--°';
            this.cityEl.textContent = this.city;
            this.descEl.textContent = '加载中…';
            this.humidityEl.textContent = '';
            this.windEl.textContent = '';
        } else {
            this.iconEl.textContent = 'sunny';
            this.tempEl.textContent = '--°';
            this.descEl.textContent = '加载中…';
            this.cityEl.textContent = this.city;
        }
    }

    afterMount() {
        this.refresh();
        this.setIntervalTimer(() => this.refresh(), 30 * 60 * 1000);
    }

    async refresh() {
        if (this.cachedWeather && Date.now() - this.lastUpdate < 10 * 60 * 1000) {
            return;
        }

        // 解析坐标：留空/“当前位置”→ 浏览器定位；命名城市 → 地理编码
        if (!this.coords) {
            const resolved = await this.resolveCoords();
            if (!resolved) {
                this.showError('城市定位失败');
                return;
            }
            this.coords = resolved;
        }

        try {
            const url = 'https://api.open-meteo.com/v1/forecast' +
                '?latitude=' + this.coords.lat +
                '&longitude=' + this.coords.lon +
                '&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m' +
                '&timezone=auto';
            const data = await this.fetchJSON(url);
            if (data && data.current) {
                const wmo = this.mapWmoCode(data.current.weather_code);
                const weather = {
                    temp: Math.round(data.current.temperature_2m),
                    icon: wmo.icon,
                    desc: wmo.desc,
                    city: this.city,
                    humidity: data.current.relative_humidity_2m,
                    wind: data.current.wind_speed_10m
                };
                this.cachedWeather = weather;
                this.lastUpdate = Date.now();
                this.data.lat = this.coords.lat;
                this.data.lon = this.coords.lon;
                this.data.coordsCity = this.city;
                this.data.city = this.city;
                this.data.cached = weather;
                this.data.lastUpdate = this.lastUpdate;
                this.persist();
                this.applyWeather(weather);
            }
        } catch (err) {
            console.warn('[WeatherWidget] 天气获取失败:', err.message);
            if (!this.cachedWeather) {
                this.showError('天气获取失败');
            }
        }
    }

    applyWeather(w) {
        // 兼容旧缓存：Material Icons 图标名 → Material Symbols 图标名（历史数据仅 wb_sunny 需要转换）
        const iconFix = { 'wb_sunny': 'sunny' };
        if (iconFix[w.icon]) w.icon = iconFix[w.icon];
        if (!w.icon) w.icon = 'sunny'; // 兜底：缓存缺图标字段时使用默认
        this.iconEl.textContent = w.icon;
        this.tempEl.textContent = w.temp + '°';
        this.descEl.textContent = w.desc;
        this.descEl.classList.remove('widget-weather-error');
        this.cityEl.textContent = w.city || this.city;

        if (this.isRect && this.humidityEl) {
            this.humidityEl.textContent = w.humidity + '%';
            this.windEl.textContent = w.wind + 'km/h';
        }
    }

    tryGeolocate() {
        return new Promise((resolve) => {
            if (!('geolocation' in navigator)) { resolve(null); return; }
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
                () => resolve(null),
                { enableHighAccuracy: false, timeout: 5000, maximumAge: 10 * 60 * 1000 }
            );
        });
    }

    // 解析坐标：未配置城市或“当前位置”走浏览器定位，命名城市走地理编码
    async resolveCoords() {
        if (!this.city || this.city === '当前位置') {
            const located = await this.tryGeolocate();
            if (located) {
                this.city = '当前位置';
                return located;
            }
            // 定位失败回退到默认城市南昌
            return { lat: 28.68, lon: 115.8575 };
        }
        return this.geocodeCity(this.city);
    }

    // 使用 Open-Meteo 地理编码接口把城市名解析为经纬度
    async geocodeCity(name) {
        try {
            const url = 'https://geocoding-api.open-meteo.com/v1/search'
                + '?name=' + encodeURIComponent(name)
                + '&count=1&language=zh&format=json';
            const data = await this.fetchJSON(url);
            if (data && Array.isArray(data.results) && data.results.length) {
                return { lat: data.results[0].latitude, lon: data.results[0].longitude };
            }
        } catch (e) {
            console.warn('[WeatherWidget] 城市地理编码失败:', e.message);
        }
        return null;
    }

    showError(message) {
        if (!this.tempEl) return;
        this.tempEl.textContent = '--°';
        this.descEl.textContent = message;
        this.descEl.classList.add('widget-weather-error');
    }

    mapWmoCode(code) {
        const map = {
            0:  { icon: 'sunny',           desc: '晴朗' },
            1:  { icon: 'partly_cloudy_day', desc: '基本晴朗' },
            2:  { icon: 'cloud',          desc: '局部多云' },
            3:  { icon: 'cloud',          desc: '阴天' },
            45: { icon: 'foggy',          desc: '有雾' },
            48: { icon: 'foggy',          desc: '雾凇' },
            51: { icon: 'rainy_light',    desc: '小毛毛雨' },
            53: { icon: 'rainy',          desc: '毛毛雨' },
            55: { icon: 'rainy_heavy',    desc: '浓毛毛雨' },
            56: { icon: 'rainy_light',    desc: '冻毛毛雨' },
            57: { icon: 'rainy_heavy',    desc: '强冻毛毛雨' },
            61: { icon: 'rainy_light',    desc: '小雨' },
            63: { icon: 'rainy',          desc: '中雨' },
            65: { icon: 'rainy_heavy',    desc: '大雨' },
            66: { icon: 'rainy_light',    desc: '冻雨' },
            67: { icon: 'rainy_heavy',    desc: '强冻雨' },
            71: { icon: 'ac_unit',        desc: '小雪' },
            73: { icon: 'ac_unit',        desc: '中雪' },
            75: { icon: 'ac_unit',        desc: '大雪' },
            77: { icon: 'ac_unit',        desc: '雪粒' },
            80: { icon: 'rainy_light',    desc: '阵雨' },
            81: { icon: 'rainy',          desc: '强阵雨' },
            82: { icon: 'rainy_heavy',    desc: '暴雨' },
            85: { icon: 'ac_unit',        desc: '阵雪' },
            86: { icon: 'ac_unit',        desc: '强阵雪' },
            95: { icon: 'thunderstorm',   desc: '雷暴' },
            96: { icon: 'thunderstorm',   desc: '雷暴伴冰雹' },
            99: { icon: 'thunderstorm',   desc: '强雷暴' }
        };
        return map[code] || { icon: 'sunny', desc: '未知天气' };
    }
}

// ==== main/Script/widgets/TasksWidget.js ====
/**
 * 任务小组件（仅本地 localStorage）
 */
// [bundled] import { … } from './WidgetBase.js'

class TasksWidget extends WidgetBase {
    constructor(config) {
        super(config);
        this.type = 'tasks';
        this.tasks = (this.data && Array.isArray(this.data.items)) ? this.data.items : [];
    }

    buildContent() {
        this.element.classList.add('widget-tasks');

        this.headerEl = document.createElement('div');
        this.headerEl.className = 'widget-tasks-header';

        this.headerTitle = document.createElement('span');
        this.headerTitle.className = 'widget-tasks-header-title';
        this.headerEl.appendChild(this.headerTitle);

        this.listEl = document.createElement('div');
        this.listEl.className = 'widget-tasks-list';

        this.inputRow = document.createElement('div');
        this.inputRow.className = 'widget-tasks-input-row';

        this.inputEl = document.createElement('input');
        this.inputEl.className = 'widget-tasks-input';
        this.inputEl.type = 'text';
        this.inputEl.maxLength = 80;

        this.addBtn = document.createElement('button');
        this.addBtn.className = 'widget-tasks-add-btn';
        this.addBtn.textContent = '+';
        this.addBtn.title = '添加任务';

        this.inputRow.appendChild(this.inputEl);
        this.inputRow.appendChild(this.addBtn);

        this.element.appendChild(this.headerEl);
        this.element.appendChild(this.listEl);
        this.element.appendChild(this.inputRow);

        this.addBtn.addEventListener('click', () => this.addTask());
        this.inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        this.renderList();
    }

    afterMount() {
        // 在 header 右侧插入导出 / 导入按钮
        this._addHeaderActions();
    }

    _addHeaderActions() {
        const self = this;
        const actions = document.createElement('div');
        actions.className = 'widget-tasks-header-actions';

        const exportBtn = document.createElement('button');
        exportBtn.className = 'widget-task-io-btn';
        exportBtn.innerHTML = '<span class="material-icons" style="font-size:14px">download</span>';
        exportBtn.title = '导出此小组件任务';
        exportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            self._export();
        });

        const importBtn = document.createElement('button');
        importBtn.className = 'widget-task-io-btn';
        importBtn.innerHTML = '<span class="material-icons" style="font-size:14px">upload</span>';
        importBtn.title = '导入任务到此小组件';
        importBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            self._import();
        });

        actions.appendChild(exportBtn);
        actions.appendChild(importBtn);
        this.headerEl.appendChild(actions);
    }

    _export() {
        const items = this.tasks.map(t => ({ id: t.id, text: t.text || '', done: !!t.done }));
        if (items.length === 0) {
            oooInterface.showNotification('当前小组件没有任务');
            return;
        }
        const now = new Date();
        const timeStr = now.toLocaleString('zh-CN', { hour12: false });
        const json = JSON.stringify(items, null, 2);
        const md = [
            '# OOOInterface 任务列表备份',
            '',
            '- 导出时间：' + timeStr,
            '- 任务总数：' + items.length,
            '',
            '```json',
            json,
            '```'
        ].join('\n');
        const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
        a.href = url;
        a.download = 'OOOInterface-Tasks-' + dateStr + '.md';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            URL.revokeObjectURL(url);
            if (a.parentNode) a.parentNode.removeChild(a);
        }, 0);
        oooInterface.showNotification('已导出 ' + items.length + ' 条任务');
    }

    _import() {
        const self = this;
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.md,text/markdown';
        input.addEventListener('change', () => {
            const file = input.files && input.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function () {
                try {
                    const text = reader.result;
                    let jsonText = '';
                    const match = text.match(/```(?:json)?\s*\n([\s\S]*?)\n\s*```/);
                    if (match) {
                        jsonText = match[1].trim();
                    } else {
                        jsonText = text.trim();
                    }
                    const items = JSON.parse(jsonText);
                    if (!Array.isArray(items)) throw new Error('数据格式错误，期望 JSON 数组');

                    const existing = self.tasks;
                    const existingIds = new Set(existing.map(t => t.id));
                    let added = 0, skipped = 0;
                    items.forEach(item => {
                        if (!item || !item.text) { skipped++; return; }
                        if (existingIds.has(item.id)) { skipped++; return; }
                        existing.push({ id: item.id, text: item.text, done: !!item.done });
                        added++;
                    });

                    self.tasks = existing;
                    self.data.items = existing;
                    self.persist();
                    self.renderList();
                    oooInterface.showNotification('已导入 ' + added + ' 条任务（跳过 ' + skipped + ' 条重复）');
                } catch (e) {
                    oooInterface.showNotification('导入失败：' + (e.message || '未知错误'));
                    console.error('[TasksWidget._import]', e);
                }
            };
            reader.onerror = function () {
                oooInterface.showNotification('文件读取失败');
            };
            reader.readAsText(file);
        });
        input.click();
    }

    // ─── 任务操作 ───

    addTask() {
        const text = this.inputEl.value.trim();
        if (!text) return;
        this.tasks.push({ id: this.genId(), text, done: false });
        this.inputEl.value = '';
        this.data.items = this.tasks;
        this.persist();
        this.renderList();
    }

    toggleTask(id) {
        const t = this.tasks.find(x => x.id === id);
        if (!t) return;
        t.done = !t.done;
        this.data.items = this.tasks;
        this.persist();
        this.renderList();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(x => x.id !== id);
        this.data.items = this.tasks;
        this.persist();
        this.renderList();
    }

    // ─── 渲染 ───

    renderList() {
        const done = this.tasks.filter(t => t.done).length;
        const total = this.tasks.length;
        this.headerTitle.textContent = '任务' + (total ? '  ' + done + '/' + total : '');

        this.listEl.innerHTML = '';

        if (this.tasks.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'widget-task-empty';
            empty.textContent = '暂无任务';
            this.listEl.appendChild(empty);
            return;
        }

        const sorted = [...this.tasks].sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));
        sorted.forEach(t => {
            const item = document.createElement('div');
            item.className = 'widget-task-item' + (t.done ? ' done' : '');

            const box = document.createElement('span');
            box.className = 'widget-task-checkbox';
            box.textContent = t.done ? '✓' : '';

            const text = document.createElement('span');
            text.className = 'widget-task-text';
            text.textContent = t.text;
            text.title = t.text;

            const del = document.createElement('button');
            del.className = 'widget-task-delete';
            del.textContent = '✕';
            del.title = '删除';

            box.addEventListener('click', (e) => { e.stopPropagation(); this.toggleTask(t.id); });
            text.addEventListener('click', () => this.toggleTask(t.id));
            del.addEventListener('click', (e) => { e.stopPropagation(); this.deleteTask(t.id); });

            item.appendChild(box);
            item.appendChild(text);
            item.appendChild(del);
            this.listEl.appendChild(item);
        });
    }

    genId() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    }
}

// ==== main/Script/widgets/AiAgentWidget.js ====
/**
 * AI Agent 小组件
 * 本地接口：http://127.0.0.1:{port}
 * 交互：消息列表（可滚动）+ 输入框 + 流式响应 + 停止按钮
 */
// [bundled] import { … } from './WidgetBase.js'

class AiAgentWidget extends WidgetBase {
    constructor(config) {
        super(config);
        this.type = 'ai-agent';
        this.port = (this.data && this.data.port) || '';
        this.messages = (this.data && Array.isArray(this.data.messages)) ? this.data.messages : [];
        this.busy = false;
        this.abortController = null;
    }

    get baseUrl() {
        return this.port ? 'http://127.0.0.1:' + this.port : '';
    }

    buildContent() {
        this.element.classList.add('widget-ai');

        // 头部：标题 + 连接状态
        this.headerEl = document.createElement('div');
        this.headerEl.className = 'widget-ai-header';
        this.headerEl.innerHTML = '<span>SI Agent</span>';

        this.statusEl = document.createElement('span');
        this.statusEl.className = 'widget-ai-status';
        this.dotEl = document.createElement('span');
        this.dotEl.className = 'widget-ai-dot';
        this.statusText = document.createElement('span');
        this.statusText.textContent = '未连接';
        this.statusEl.appendChild(this.dotEl);
        this.statusEl.appendChild(this.statusText);
        this.headerEl.appendChild(this.statusEl);

        this.element.appendChild(this.headerEl);

        // 无配置时显示配置提示
        if (!this.port) {
            this.renderNoConfig();
            return;
        }

        this.buildChat();
        this.checkConnection();
    }

    renderNoConfig() {
        const noConfig = document.createElement('div');
        noConfig.className = 'widget-ai-no-config';
        noConfig.innerHTML = '<span>未配置 SI Agent 端口</span>';
        const btn = document.createElement('button');
        btn.className = 'widget-ai-no-config-btn';
        btn.textContent = '去设置端口';
        btn.addEventListener('click', () => {
            if (this.ooo && typeof this.ooo.openWidgetSettings === 'function') {
                this.ooo.openWidgetSettings(this.id);
            }
        });
        noConfig.appendChild(btn);
        this.element.appendChild(noConfig);
    }

    buildChat() {
        // 端口标签
        this.portLabel = document.createElement('div');
        this.portLabel.className = 'widget-ai-port-label';
        this.portLabel.textContent = '127.0.0.1:' + this.port;
        this.portLabel.title = this.baseUrl;

        // 消息列表
        this.messagesEl = document.createElement('div');
        this.messagesEl.className = 'widget-ai-messages';

        // 输入行
        this.inputRow = document.createElement('div');
        this.inputRow.className = 'widget-ai-input-row';

        this.inputEl = document.createElement('input');
        this.inputEl.className = 'widget-ai-input';
        this.inputEl.type = 'text';
        this.inputEl.placeholder = '输入消息…';
        this.inputEl.maxLength = 500;

        this.sendBtn = document.createElement('button');
        this.sendBtn.className = 'widget-ai-send-btn';
        this.sendBtn.innerHTML = '➤';
        this.sendBtn.title = '发送';

        this.inputRow.appendChild(this.inputEl);
        this.inputRow.appendChild(this.sendBtn);

        this.element.appendChild(this.portLabel);
        this.element.appendChild(this.messagesEl);
        this.element.appendChild(this.inputRow);

        // 恢复历史消息
        this.messages.forEach(m => this.appendMessage(m.role, m.content, false));

        // 事件
        this.sendBtn.addEventListener('click', () => this.send());
        this.inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.send();
        });
    }

    appendMessage(role, content, save = true) {
        if (!this.messagesEl) return;
        const msg = document.createElement('div');
        msg.className = 'widget-ai-msg ' + (role === 'user' ? 'user' : 'ai');
        msg.textContent = content;
        this.messagesEl.appendChild(msg);
        this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
        if (save) {
            this.messages.push({ role: role, content: content });
            this.persist();
        }
    }

    async checkConnection() {
        if (!this.baseUrl) return;
        try {
            const controller = this.trackAbort(new AbortController());
            const timeout = setTimeout(() => controller.abort(), 3000);
            const resp = await fetch(this.baseUrl + '/health', { signal: controller.signal });
            clearTimeout(timeout);
            if (resp.ok) {
                this.dotEl.classList.add('online');
                this.statusText.textContent = '已连接';
            } else {
                this.dotEl.classList.remove('online');
                this.statusText.textContent = '离线';
            }
        } catch (e) {
            this.dotEl.classList.remove('online');
            this.statusText.textContent = '离线';
        }
    }

    async send() {
        const text = this.inputEl.value.trim();
        if (!text || this.busy || !this.baseUrl) return;

        this.inputEl.value = '';
        this.appendMessage('user', text);

        this.busy = true;
        this.sendBtn.classList.add('stop');
        this.sendBtn.innerHTML = '■';
        this.sendBtn.title = '停止';
        this.inputEl.disabled = true;

        this.abortController = this.trackAbort(new AbortController());

        // AI 回复气泡
        const aiMsg = document.createElement('div');
        aiMsg.className = 'widget-ai-msg ai';
        this.messagesEl.appendChild(aiMsg);

        // 光标
        const cursor = document.createElement('span');
        cursor.className = 'widget-ai-cursor';
        aiMsg.appendChild(cursor);

        let fullText = '';
        const self = this;

        const finish = (save = true) => {
            if (cursor.parentNode) cursor.remove();
            self.busy = false;
            self.sendBtn.classList.remove('stop');
            self.sendBtn.innerHTML = '➤';
            self.sendBtn.title = '发送';
            self.inputEl.disabled = false;
            if (save && fullText.trim()) {
                self.messages.push({ role: 'assistant', content: fullText.trim() });
                self.persist();
            }
        };

        try {
            // messages 已包含刚加入的用户消息，直接传递
            const payload = {
                messages: this.messages
            };

            const resp = await this.fetchAPI(this.baseUrl + '/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: this.abortController.signal
            });

            if (!resp.ok) {
                throw new Error('HTTP ' + resp.status);
            }

            // 尝试流式读取；失败则回退整段 JSON
            try {
                const reader = resp.body.getReader();
                const decoder = new TextDecoder('utf-8');
                let buffer = '';
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    buffer += decoder.decode(value, { stream: true });
                    // 简单增量处理：新增长度追加
                    const newLen = buffer.length;
                    if (newLen > fullText.length) {
                        fullText = buffer.slice(0, newLen);
                        aiMsg.textContent = fullText;
                        if (cursor.parentNode) aiMsg.appendChild(cursor);
                        self.messagesEl.scrollTop = self.messagesEl.scrollHeight;
                    }
                }
            } catch (streamErr) {
                // 非流式响应：整段 JSON { reply: "..." }
                const data = JSON.parse(await resp.text());
                fullText = data.reply || data.content || data.message || JSON.stringify(data);
                aiMsg.textContent = fullText;
            }

            finish(true);
        } catch (err) {
            if (err.name === 'AbortError') {
                // 用户点击停止：保留已生成内容
                if (fullText.trim()) {
                    this.messages.push({ role: 'assistant', content: fullText.trim() });
                    this.persist();
                }
                finish(false);
            } else {
                aiMsg.classList.add('error');
                aiMsg.textContent = '连接失败：' + err.message;
                finish(false);
            }
        }
    }

    destroy() {
        super.destroy();
    }
}

// ==== main/Script/widgets/EmailWidget.js ====
// [bundled] import { … } from './WidgetBase.js'

class EmailWidget extends WidgetBase {
    constructor(config) {
        super(config);
        this.type = 'email';
        this.provider = (this.data && this.data.provider) || 'gmail';
        this.providerUrl = (this.data && this.data.url) || this.getDefaultProviderUrl(this.provider);
        this.cachedEmails = (this.data && Array.isArray(this.data.cachedEmails)) ? this.data.cachedEmails : [];
        this.providerMeta = this.getProviderMeta(this.provider);
        this.googleToken = (this.data && this.data.googleToken) || '';
        this.googleEmail = (this.data && this.data.googleEmail) || '';
        this.googleConnected = !!(this.data && this.data.googleConnected);
        this.apiUrl = (this.data && this.data.apiUrl) || '';
    }

    getProviderMeta(provider) {
        const meta = {
            gmail: { name: 'Gmail', url: 'https://mail.google.com', logo: 'G' },
            outlook: { name: 'Outlook', url: 'https://outlook.live.com/mail/', logo: 'O' },
            qq: { name: 'QQ邮箱', url: 'https://mail.qq.com', logo: 'Q' },
            custom: { name: '邮箱', url: '', logo: '✉' }
        };
        return meta[provider] || meta.custom;
    }

    getDefaultProviderUrl(provider) {
        return this.getProviderMeta(provider).url;
    }

    buildContent() {
        this.element.classList.add('widget-email');

        // 头部
        this.headerEl = document.createElement('div');
        this.headerEl.className = 'widget-email-header';

        this.logoEl = document.createElement('div');
        this.logoEl.className = 'widget-email-logo';
        this.logoEl.textContent = this.providerMeta.logo;

        const nameBox = document.createElement('div');
        nameBox.style.minWidth = '0';
        nameBox.style.flex = '1';

        this.nameEl = document.createElement('div');
        this.nameEl.className = 'widget-email-name';
        this.nameEl.textContent = this.providerMeta.name;

        this.addrEl = document.createElement('div');
        this.addrEl.className = 'widget-email-addr';
        if (this.provider === 'gmail' && this.googleConnected) {
            this.addrEl.textContent = this.googleEmail || '已连接';
        } else {
            this.addrEl.textContent = '最近邮件';
        }

        nameBox.appendChild(this.nameEl);
        nameBox.appendChild(this.addrEl);

        this.openBtn = document.createElement('button');
        this.openBtn.className = 'widget-email-open-btn';
        this.openBtn.textContent = '打开';
        this.openBtn.addEventListener('click', () => {
            if (this.providerUrl) window.open(this.providerUrl, '_blank');
        });

        this.headerEl.appendChild(this.logoEl);
        this.headerEl.appendChild(nameBox);
        this.headerEl.appendChild(this.openBtn);
        this.element.appendChild(this.headerEl);

        // 邮件列表
        this.bodyEl = document.createElement('div');
        this.bodyEl.className = 'widget-email-body';
        this.element.appendChild(this.bodyEl);

        if (this.provider === 'gmail') {
            if (this.googleConnected) {
                this.renderList();
                this.fetchGmail();
            } else {
                this.renderNoApi();
            }
        } else if (this.apiUrl) {
            this.renderList();
            this.fetchApiEmails();
        } else {
            this.renderNoApi();
        }
    }

    renderNoApi() {
        this.bodyEl.innerHTML = '';
        const hint = document.createElement('div');
        hint.className = 'widget-email-empty';
        if (this.provider === 'gmail') {
            hint.textContent = '连接 Google 账号后可直接查看收件箱';
        } else {
            hint.textContent = '配置邮件 API 地址后可直接查看邮件';
        }
        this.bodyEl.appendChild(hint);
    }

    async fetchGmail() {
        if (!this.googleToken) return;
        try {
            // 获取最近 20 封邮件的元数据
            const listRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=20', {
                headers: { Authorization: 'Bearer ' + this.googleToken }
            });
            if (!listRes.ok) throw new Error(listRes.status === 401 ? 'token无效或已过期' : '请求失败 ' + listRes.status);
            const listData = await listRes.json();
            const messages = listData.messages || [];

            // 批量获取邮件头
            const emails = [];
            for (const msg of messages) {
                try {
                    const msgRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/' + msg.id + '?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date', {
                        headers: { Authorization: 'Bearer ' + this.googleToken }
                    });
                    if (!msgRes.ok) continue;
                    const msgData = await msgRes.json();
                    const headers = {};
                    (msgData.payload && msgData.payload.headers || []).forEach(h => {
                        headers[h.name.toLowerCase()] = h.value;
                    });
                    emails.push({
                        from: (headers.from || '').replace(/<.*>/, '').trim() || '未知',
                        subject: headers.subject || '(无主题)',
                        time: headers.date || ''
                    });
                } catch (_) {}
            }

            this.cachedEmails = emails;
            this.data.cachedEmails = emails;
            this.persist();
            this.renderList();
        } catch (err) {
            console.warn('[EmailWidget] Gmail 拉取失败:', err.message);
            if (this.cachedEmails.length) {
                this.renderList(true);
                this.notify('邮件拉取失败，显示缓存');
            } else {
                this.bodyEl.innerHTML = '';
                const errEl = document.createElement('div');
                errEl.className = 'widget-email-empty';
                errEl.textContent = '获取失败：' + (err.message || '未知错误');
                this.bodyEl.appendChild(errEl);
            }
        }
    }

    async fetchApiEmails() {
        if (!this.apiUrl) return;
        try {
            const data = await this.fetchJSON(this.apiUrl);
            const emails = (data && Array.isArray(data.emails)) ? data.emails : [];
            this.cachedEmails = emails
                .filter(e => e && (e.from || e.subject))
                .map(e => ({
                    from: e.from || '未知',
                    subject: e.subject || '(无主题)',
                    time: e.time || ''
                }));
            this.data.cachedEmails = this.cachedEmails;
            this.persist();
            this.renderList();
        } catch (err) {
            console.warn('[EmailWidget] 邮件 API 拉取失败:', err.message);
            if (this.cachedEmails.length) {
                this.renderList(true);
                this.notify('邮件拉取失败，显示缓存');
            } else {
                this.bodyEl.innerHTML = '';
                const errEl = document.createElement('div');
                errEl.className = 'widget-email-empty';
                errEl.textContent = '获取失败：' + (err.message || '未知错误');
                this.bodyEl.appendChild(errEl);
            }
        }
    }

    renderList(offline = false) {
        this.bodyEl.innerHTML = '';

        if (offline) {
            const tag = document.createElement('div');
            tag.className = 'widget-email-empty';
            tag.textContent = '离线缓存 ' + this.cachedEmails.length + ' 封';
            this.bodyEl.appendChild(tag);
        }

        if (this.cachedEmails.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'widget-email-empty';
            empty.textContent = '暂无邮件';
            this.bodyEl.appendChild(empty);
            return;
        }

        this.cachedEmails.slice(0, 20).forEach(mail => {
            const item = document.createElement('div');
            item.className = 'widget-email-item';

            const avatar = document.createElement('div');
            avatar.className = 'widget-email-item-avatar';
            avatar.textContent = (mail.from || '?').charAt(0).toUpperCase();

            const info = document.createElement('div');
            info.className = 'widget-email-item-info';

            const from = document.createElement('div');
            from.className = 'widget-email-item-from';
            from.textContent = mail.from;

            const subject = document.createElement('div');
            subject.className = 'widget-email-item-subject';
            subject.textContent = mail.subject;

            info.appendChild(from);
            info.appendChild(subject);

            const time = document.createElement('div');
            time.className = 'widget-email-item-time';
            time.textContent = this.formatTime(mail.time);

            item.appendChild(avatar);
            item.appendChild(info);
            item.appendChild(time);

            item.addEventListener('click', () => {
                if (this.providerUrl) window.open(this.providerUrl, '_blank');
            });

            this.bodyEl.appendChild(item);
        });
    }

    formatTime(t) {
        if (!t) return '';
        const d = new Date(t);
        if (isNaN(d.getTime())) return String(t).slice(0, 10);
        const now = new Date();
        const sameDay = d.toDateString() === now.toDateString();
        if (sameDay) {
            return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
        }
        return (d.getMonth() + 1) + '/' + d.getDate();
    }

    // Google OAuth 连接
    async connectGoogle(clientId) {
        const scope = 'https://www.googleapis.com/auth/gmail.readonly';
        const redirectUri = 'https://' + chrome.runtime.id + '.chromiumapp.org/';
        const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
            + '?client_id=' + encodeURIComponent(clientId)
            + '&redirect_uri=' + encodeURIComponent(redirectUri)
            + '&response_type=token'
            + '&scope=' + encodeURIComponent(scope)
            + '&prompt=consent';

        return new Promise((resolve, reject) => {
            chrome.identity.launchWebAuthFlow({ url: authUrl, interactive: true }, async (redirectUrl) => {
                if (chrome.runtime.lastError || !redirectUrl) {
                    reject(new Error(chrome.runtime.lastError ? chrome.runtime.lastError.message : '授权取消'));
                    return;
                }
                try {
                    const hash = new URL(redirectUrl).hash.substring(1);
                    const params = new URLSearchParams(hash);
                    const token = params.get('access_token');
                    if (!token) throw new Error('未获取到 access_token');

                    // 获取用户邮箱
                    const meRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
                        headers: { Authorization: 'Bearer ' + token }
                    });
                    const meData = await meRes.json();
                    const email = meData.emailAddress || '';

                    this.googleToken = token;
                    this.googleEmail = email;
                    this.googleConnected = true;
                    this.data.googleToken = token;
                    this.data.googleEmail = email;
                    this.data.googleConnected = true;
                    this.data.googleClientId = clientId;
                    this.persist();

                    this.addrEl.textContent = email || '已连接';
                    this.bodyEl.innerHTML = '';
                    this.renderList();
                    this.fetchGmail();

                    resolve();
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    disconnectGoogle() {
        this.googleToken = '';
        this.googleEmail = '';
        this.googleConnected = false;
        this.data.googleToken = '';
        this.data.googleEmail = '';
        this.data.googleConnected = false;
        this.persist();
        this.addrEl.textContent = '最近邮件';
        this.bodyEl.innerHTML = '';
        this.renderNoApi();
    }
}

// ==== main/Script/widgets/UpgradeToolWidget.js ====
/**
 * 升级工具小组件
 * 支持小/大/超大三种尺寸，通过 OUA 后端接口检查更新
 * 挂载后自动检查一次；超大尺寸底部有手动检查按钮
 */
// [bundled] import { … } from './WidgetBase.js'

class UpgradeToolWidget extends WidgetBase {
    constructor(config) {
        super(config);
        this.type = 'upgrade-tool';
        this.installDir = '';
        this.branchLabel = '';
        this.dataSource = '';
        this.localVersion = '';
        this.remoteVersion = '';
        this.hasUpdate = false;
        this.isChecking = false;
        this.apiUrl = 'http://127.0.0.1:8964';
        this.activeBase = null;
    }

    buildContent() {
        this.element.classList.add('widget-upgrade-tool');
        this._isSquare = (this.size === 'square');
        this._isSuper = (this.size === 'super');

        // 先构建布局（创建 DOM 元素），再加载数据
        if (this._isSquare) {
            this._buildSquareLayout();
        } else if (this.size === 'rectangle') {
            this._buildRectLayout();
        } else {
            this._buildSuperLayout();
        }

        // 布局渲染后自动检查一次
        this._loadData();
    }

    /* -------- 布局 -------- */

    _buildSquareLayout() {
        // 上方：本地版本
        const localRow = document.createElement('div');
        localRow.className = 'widget-upgrade-tool-row';
        const localLabel = document.createElement('span');
        localLabel.className = 'widget-upgrade-tool-label';
        localLabel.textContent = '本地版本';
        const localVal = document.createElement('span');
        localVal.className = 'widget-upgrade-tool-val';
        localVal.id = 'localVer';
        localVal.textContent = '—';
        localRow.appendChild(localLabel);
        localRow.appendChild(localVal);
        this.element.appendChild(localRow);

        // 下方：云端版本
        const remoteRow = document.createElement('div');
        remoteRow.className = 'widget-upgrade-tool-row';
        const remoteLabel = document.createElement('span');
        remoteLabel.className = 'widget-upgrade-tool-label';
        remoteLabel.textContent = '云端版本';
        const remoteVal = document.createElement('span');
        remoteVal.className = 'widget-upgrade-tool-val';
        remoteVal.id = 'remoteVer';
        remoteVal.textContent = '—';
        remoteRow.appendChild(remoteLabel);
        remoteRow.appendChild(remoteVal);
        this.element.appendChild(remoteRow);
    }

    _buildRectLayout() {
        this._wrap = document.createElement('div');
        this._wrap.className = 'widget-upgrade-tool-wrap';

        // 左上：版本分支
        const branchRow = document.createElement('div');
        branchRow.className = 'widget-upgrade-tool-row';
        const branchLabel = document.createElement('span');
        branchLabel.className = 'widget-upgrade-tool-label';
        branchLabel.textContent = '版本分支';
        const branchVal = document.createElement('span');
        branchVal.className = 'widget-upgrade-tool-val';
        branchVal.id = 'branch';
        branchVal.textContent = '—';
        branchRow.appendChild(branchLabel);
        branchRow.appendChild(branchVal);
        this._wrap.appendChild(branchRow);

        // 右上：数据来源
        const dsRow = document.createElement('div');
        dsRow.className = 'widget-upgrade-tool-row';
        const dsLabel = document.createElement('span');
        dsLabel.className = 'widget-upgrade-tool-label';
        dsLabel.textContent = '数据来源';
        const dsVal = document.createElement('span');
        dsVal.className = 'widget-upgrade-tool-val';
        dsVal.id = 'dataSource';
        dsVal.textContent = '—';
        dsRow.appendChild(dsLabel);
        dsRow.appendChild(dsVal);
        this._wrap.appendChild(dsRow);

        // 左下：本地版本
        const localRow = document.createElement('div');
        localRow.className = 'widget-upgrade-tool-row';
        const localLabel = document.createElement('span');
        localLabel.className = 'widget-upgrade-tool-label';
        localLabel.textContent = '本地版本';
        const localVal = document.createElement('span');
        localVal.className = 'widget-upgrade-tool-val';
        localVal.id = 'localVer';
        localVal.textContent = '—';
        localRow.appendChild(localLabel);
        localRow.appendChild(localVal);
        this._wrap.appendChild(localRow);

        // 右下：云端版本
        const remoteRow = document.createElement('div');
        remoteRow.className = 'widget-upgrade-tool-row';
        const remoteLabel = document.createElement('span');
        remoteLabel.className = 'widget-upgrade-tool-label';
        remoteLabel.textContent = '云端版本';
        const remoteVal = document.createElement('span');
        remoteVal.className = 'widget-upgrade-tool-val';
        remoteVal.id = 'remoteVer';
        remoteVal.textContent = '—';
        remoteRow.appendChild(remoteLabel);
        remoteRow.appendChild(remoteVal);
        this._wrap.appendChild(remoteRow);

        this.element.appendChild(this._wrap);
    }

    _buildSuperLayout() {
        this._wrap = document.createElement('div');
        this._wrap.className = 'widget-upgrade-tool-wrap';
        this._content = document.createElement('div');
        this._content.className = 'widget-upgrade-tool-content';

        // 安装目录（带复制按钮）
        const dirRow = document.createElement('div');
        dirRow.className = 'widget-upgrade-tool-dir-row';
        const dirLabel = document.createElement('span');
        dirLabel.className = 'widget-upgrade-tool-label';
        dirLabel.textContent = '安装目录';
        const dirVal = document.createElement('span');
        dirVal.className = 'widget-upgrade-tool-val widget-upgrade-tool-dir-val';
        dirVal.id = 'dirVal';
        const dirText = document.createElement('div');
        dirText.className = 'widget-upgrade-tool-dir-text';
        dirText.textContent = '—';
        dirVal.appendChild(dirText);
        const copyBtn = document.createElement('button');
        copyBtn.className = 'widget-upgrade-tool-copy-btn';
        copyBtn.title = '复制路径';
        copyBtn.innerHTML = '<span class="material-icons" style="font-size:16px;">content_copy</span>';
        copyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this._copyInstallDir(this.installDir, copyBtn);
        });
        dirRow.appendChild(dirLabel);
        dirRow.appendChild(dirVal);
        dirRow.appendChild(copyBtn);
        this._content.appendChild(dirRow);

        // 版本分支 | 数据来源
        const infoRow1 = document.createElement('div');
        infoRow1.className = 'widget-upgrade-tool-grid-row';
        infoRow1.appendChild(this._makeCell('版本分支', 'branch'));
        infoRow1.appendChild(this._makeCell('数据来源', 'dataSource'));
        this._content.appendChild(infoRow1);

        // 本地版本（全宽）
        this._content.appendChild(this._makeFullRow('本地版本', 'localVer'));

        // 云端版本（全宽）
        this._content.appendChild(this._makeFullRow('云端版本', 'remoteVer'));

        this._wrap.appendChild(this._content);

        // 底部固定检查更新按钮
        const checkRow = document.createElement('div');
        checkRow.className = 'widget-upgrade-tool-check-row';
        const btn = document.createElement('button');
        btn.className = 'widget-upgrade-tool-check-btn';
        btn.id = 'checkBtn';
        btn.innerHTML = '<span class="material-icons" style="font-size:16px;">system_update</span> 检查更新';
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this._loadData();
        });
        checkRow.appendChild(btn);
        this._wrap.appendChild(checkRow);

        this.element.appendChild(this._wrap);
    }

    _makeFullRow(label, valId) {
        const row = document.createElement('div');
        row.className = 'widget-upgrade-tool-super-row';
        const lbl = document.createElement('span');
        lbl.className = 'widget-upgrade-tool-label';
        lbl.textContent = label;
        const val = document.createElement('span');
        val.className = 'widget-upgrade-tool-val';
        val.id = valId;
        val.textContent = '—';
        row.appendChild(lbl);
        row.appendChild(val);
        return row;
    }

    _makeCell(label, valId) {
        const cell = document.createElement('div');
        cell.className = 'widget-upgrade-tool-cell';
        const lbl = document.createElement('span');
        lbl.className = 'widget-upgrade-tool-label';
        lbl.textContent = label;
        const val = document.createElement('span');
        val.className = 'widget-upgrade-tool-val';
        val.id = valId;
        val.textContent = '—';
        cell.appendChild(lbl);
        cell.appendChild(val);
        return cell;
    }

    /* -------- 数据加载 -------- */

    async _loadData() {
        if (this.isChecking) return;
        this.isChecking = true;

        // 加载中状态
        const ids = ['branch', 'dataSource', 'localVer', 'remoteVer', 'dirVal'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const inner = el.querySelector('.widget-upgrade-tool-dir-text');
            if (inner) inner.textContent = '…';
            else el.textContent = '…';
        });
        const btn = document.getElementById('checkBtn');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<span class="material-icons" style="font-size:16px;">system_update</span> 检查中…';
        }

        try {
            const data = await this._apiFetch('/api/interface/check-update');
            this.installDir = data.installDir || '';
            this.branchLabel = data.branchLabel || data.branch || '未知';
            this.dataSource = data.dataSource || '—';
            this.localVersion = data.localVersion || '未检测到';
            this.remoteVersion = data.remoteVersion || (data.localMode ? '本地模式' : '获取失败');
            this.hasUpdate = !!data.hasUpdate;

            const set = (id, text) => {
                const el = document.getElementById(id);
                if (!el) return;
                const inner = el.querySelector('.widget-upgrade-tool-dir-text');
                if (inner) inner.textContent = text;
                else el.textContent = text;
            };
            set('dirVal', this._truncateDirPath(this.installDir || '未设置'));
            set('branch', this.branchLabel);
            set('dataSource', this.dataSource);
            set('localVer', this.localVersion);
            set('remoteVer', this.remoteVersion);
        } catch (err) {
            console.warn('[UpgradeToolWidget] 加载失败:', err);
            const set = (id, text) => {
                const el = document.getElementById(id);
                if (!el) return;
                const inner = el.querySelector('.widget-upgrade-tool-dir-text');
                if (inner) inner.textContent = text;
                else el.textContent = text;
            };
            set('branch', '—');
            set('dataSource', '—');
            set('localVer', '—');
            set('remoteVer', '连接失败');
            set('dirVal', '—');
        } finally {
            this.isChecking = false;
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<span class="material-icons" style="font-size:16px;">system_update</span> 检查更新';
            }
        }
    }

    async _apiFetch(path) {
        const bases = ['http://127.0.0.1:8964', 'http://localhost:8964'];
        let lastErr = null;
        for (const base of bases) {
            try {
                const resp = await fetch(base + path);
                const json = await resp.json();
                if (!resp.ok || !json.ok) throw new Error(json.error || 'HTTP ' + resp.status);
                this.activeBase = base;
                return json.data;
            } catch (e) {
                lastErr = e;
            }
        }
        throw lastErr || new Error('连接失败');
    }

    _truncateDirPath(raw) {
        if (!raw || raw === '未设置') return raw || '—';
        const parts = raw.split(/[\\/]/).filter(Boolean);
        if (parts.length <= 2) return raw;
        // 保留根目录前缀（C:\ 或 /home/ 等），后面最多显示两段，超出用 …
        const prefix = parts[0];
        const middle = parts.slice(1, -2);
        const suffix = parts.slice(-2);
        let result = prefix;
        if (middle.length > 0) result += '\\…\\';
        result += suffix.join('\\');
        return result;
    }

    _copyInstallDir(text, btn) {
        if (!text || text === '—' || text === '未设置') return;
        const copy = (str) => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(str);
            } else {
                const ta = document.createElement('textarea');
                ta.value = str;
                ta.style.cssText = 'position:fixed;opacity:0';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            }
        };
        copy(text);
        btn.classList.add('copied');
        const icon = btn.querySelector('.material-icons');
        if (icon) icon.textContent = 'check';
        this.setTimer(() => {
            btn.classList.remove('copied');
            if (icon) icon.textContent = 'content_copy';
        }, 1200);
    }
}

// ==== main/Script/settings-defaults.js ====
// 出厂默认设置：主页面与侧边栏共用的唯一来源（Stage 9）。
//
// 主页面的 OOOInterface 与侧边栏面板此前各存一份，侧边栏那份是主页面的子集，
// 两边靠注释约定“保持一致”，实际已经漂移过一次（语言表少了 es）。改到这里之后
// 只有一份，不会再漂。
//
// 注意：本对象只读。使用方一律先深拷贝再改（JSON.parse(JSON.stringify(...))），
// 或经 mergeSettings 合并，切勿就地修改。

const DEFAULT_SETTINGS = {
    font: 'Sans Flex',
    logo: 'default',
    logoType: 'image',
    textLogo: '',
    customLogos: [],
    customFonts: [],
    customWallpapers: [],
    wallpaperSeries: [],
    // 「存量壁纸已按哪版压缩参数重编码过」。加进默认值不是为了默认行为，
    // 而是因为主页面 mergeSettings 是逐键白名单 —— 不在这里登记，
    // 这个键每次读取都会被丢掉，迁移就会每次启动重跑一遍。
    wallpaperCompressVersion: 0,
    quickLinks: [],
    wallpaper: 'default',
    wallpaperUrl: '',
    dynamicBlur: false,
    persistentWallpaper: false,
    searchHistory: true,
    searchSuggestions: true,
    searchHistoryItems: [],
    engineLocked: false,
    developerMode: false,
    proxyPort: null,
    fontSize: 1,
    fontWeight: 400,
    searchBoxHeight: 50,
    enhancedDisplay: false,
    wallpaperScale: false,
    wallpaperDarkDim: true,
    wallpaperFill: true,
    colorScheme: 'green',
    customPrimaryColor: '',
    customSecondaryColor: '',
    customGradientEnabled: false,
    customGradientStart: 0,
    customGradientEnd: 100,
    customColors: [],
    activeCustomColorIndex: -1,
    contextMenuStyle: 'default',
    hideInfoPopup: { enabled: false, type: null, timestamp: null },
    // 底部铭牌功能：双击 / 右键分别对应的动作（settings 打开设置 / audio 播放音效 / none 无）
    badgeDblClickAction: 'settings',
    badgeContextMenuAction: 'settings',
    // OCP 播控：开启后，OCP 开始播放过一次即可 hover 底部铭牌呼出媒体播控
    ocpPlayerEnabled: false,
    bingRefreshEveryTime: true,
    bingRefreshInterval: 0,
    quickAccessSidebar: true,
    showQuickLinkIcons: true,
    // 固定侧边栏：主开关（false = 恢复 hover 控制）；开启主开关时子开关自动跟随
    fixSidebarEnabled: false,
    fixSidebarHomepage: false,
    fixSidebarWallpaper: false,
    // 壁纸格式角标：主页与壁纸模式右上角显示「当前壁纸」的 HDR / LIVE 标识。
    // 每个格式一个总开关；Homepage 是它的子开关 —— 关掉就是只在壁纸模式显示。
    // 总开关默认关（新 UI 元素不该不请自来），Homepage 默认开，
    // 于是「打开开关」得到的就是「主页面与壁纸模式都显示」。
    wallpaperBadgeHdr: false,
    wallpaperBadgeHdrHomepage: true,
    wallpaperBadgeLive: false,
    wallpaperBadgeLiveHomepage: true,
    // 侧边栏面板功能：默认全部关闭（主开关与内部各开关均关闭，
    // 由用户按需逐项开启；开启后点击工具栏图标打开侧边栏，关闭则新建标签页）
    sidePanelEnabled: false,
    sidePanelShowWidgets: false,
    sidePanelShowQuickLinks: false,
    sidePanelShowSearch: false,
    sidePanelShowEngineButtons: false,
    sidePanelWallpaperEnabled: false,
    sidePanelWallpaperSync: false,
    sidePanelWallpaperUrl: '',
    // 侧边栏各区域独立配置（与主页面保持一致关闭时生效）
    sidePanelWidgetsSync: false,
    sidePanelWidgetPanel: { widgets: [] },
    sidePanelQuickLinksSync: false,
    sidePanelQuickLinks: [],
    sidePanelSearchSync: false,
    sidePanelSearchBoxHeight: 50,
    // 内置页打开：开启后侧边栏搜索/访问的网页用 iframe 在面板内展示
    sidePanelBuiltinOpen: false,
    widgetPanel: {
        enabled: true,
        widgets: []
    },
    statusBarEnabled: false,
    showStatusBarSeconds: false,
    hideNotifications: false,
    // 简洁视觉效果：主开关，关闭时自动关闭全部子开关（隐藏弹窗/禁止提示/隐藏铭牌）
    simpleVisualMode: false,
    hiddenBadge: false,
    contextMenuCustomItems: ['wallpaper-toggle', 'search-history-toggle', 'search-suggestions-toggle'],
    shortcutsEnabled: true,
    theme: 'default',           // 当前主题 key（文件 basename 去扩展名）
    themeEnabled: false,        // 主题功能是否开启
    themeColorScheme: null,     // 当主题 color.colorGroup === 'add' 时存放完整配色配置
    themeAspects: null,         // 各方面是否仍由主题接管 {logo,font,wallpaper,color}（null 视为全部接管）
    customThemes: []             // 用户导入的自定义主题 [{key, name, designer, version, data}]
};

// ==== main/Script/storage-sync.js ====
// 主页面与侧边栏面板共用的 chrome.storage 同步白名单（Stage 9）。
//
// 语义：只有这个列表里的键发生变化时，另一侧才需要重新应用设置。
// 它是一道**门控**，不是权限清单——多一个键只是多一次无害的重算，
// 少一个键才会导致界面陈旧（这是真实的 bug 类别）。
//
// 因此这里取两侧原有列表的**并集**：以侧边栏那份为准，其中多出的
// 'wallpaper' / 'wallpaperUrl' 是主页面原先漏掉的——主页面换了壁纸时，
// 侧边栏此前不会被触发重应用。补上后两边行为一致。
//
// 不在列表中的键（小组件数据、壁纸缓存等）变化不触发重应用；
// 自身回写又因内容一致被跳过，以此避免两个页面之间的同步风暴。

const SYNC_KEYS = [
    'quickLinks', 'showQuickLinkIcons', 'enhancedDisplay', 'dynamicBlur', 'colorScheme',
    'themeColorScheme', 'customColors', 'activeCustomColorIndex', 'customPrimaryColor', 'customSecondaryColor',
    'customGradientEnabled', 'customGradientStart', 'customGradientEnd', 'font',
    'sidePanelEnabled', 'sidePanelShowWidgets', 'sidePanelShowQuickLinks', 'sidePanelShowSearch',
    'sidePanelShowEngineButtons', 'sidePanelWallpaperEnabled', 'sidePanelWallpaperSync', 'sidePanelWallpaperUrl',
    'sidePanelWidgetsSync', 'sidePanelWidgetPanel', 'sidePanelQuickLinksSync', 'sidePanelQuickLinks',
    'sidePanelSearchSync', 'sidePanelSearchBoxHeight',
    'sidePanelBuiltinOpen',
    'wallpaperDarkDim',
    'widgetPanel', 'wallpaper', 'wallpaperUrl'
];

// ==== main/Script/widgets/widget-types.js ====
// 小组件类型表与尺寸辅助函数：主页面与侧边栏面板共用（Stage 9）。
//
// 数据以主页面那份为准——它是侧边栏那份的**超集**（多一个 icon 字段，
// 侧边栏不使用该字段，多出来无害）。此前两份靠注释约定"保持一致"，
// 属于同一类漂移风险。
//
// 三个辅助函数此前两侧各写了一份，逻辑逐字等价，此处合并为纯函数；
// 主页面的同名实例方法改为委托到这里（方法名与模块绑定不冲突）。

const WIDGET_TYPES = {
    'clock':    { name: '大时钟', icon: 'schedule',        defaultSize: 'square', allowSquare: true,  allowSuper: false },
    'calendar': { name: '日历',   icon: 'calendar_month',  defaultSize: 'square', allowSquare: true,  allowSuper: true  },
    'weather':  { name: '天气',   icon: 'wb_sunny',        defaultSize: 'square', allowSquare: true,  allowSuper: false },
    'tasks':    { name: '任务',   icon: 'checklist',       defaultSize: 'super',   allowSquare: false, allowSuper: true  },
    'ai-agent': { name: 'SI Agent', icon: 'smart_toy',     defaultSize: 'super',   allowSquare: false, allowSuper: true  },
    'email':    { name: '邮箱',   icon: 'mail',            defaultSize: 'super',   allowSquare: false, allowSuper: true  },
    'upgrade-tool': { name: '升级工具', icon: 'system_update', defaultSize: 'square', allowSquare: true,  allowSuper: true  },
};

// 某类型允许的尺寸列表；未知类型按最宽松处理
function getWidgetAllowedSizes(type) {
    const meta = WIDGET_TYPES[type];
    if (!meta) return ['square', 'rectangle', 'super'];
    const sizes = [];
    if (meta.allowSquare !== false) sizes.push('square');
    sizes.push('rectangle');
    if (meta.allowSuper === true) sizes.push('super');
    return sizes;
}

// 把尺寸规范到该类型允许的取值：非法值回落到 defaultSize，再不行取最后一个
function normalizeWidgetSize(type, size) {
    const allowed = getWidgetAllowedSizes(type);
    if (allowed.indexOf(size) >= 0) return size;
    const meta = WIDGET_TYPES[type];
    if (meta && allowed.indexOf(meta.defaultSize) >= 0) return meta.defaultSize;
    return allowed[allowed.length - 1] || 'rectangle';
}

// 尺寸的中文展示名
function getWidgetSizeLabel(type, size) {
    const s = normalizeWidgetSize(type, size);
    return s === 'rectangle' ? '大' : s === 'super' ? '超大' : '小';
}

// ==== main/Script/translate-shared.js ====
// 翻译语言表与解析函数：主页面与侧边栏面板共用（Stage 9）。
//
// 此前两侧各存一份表，注释都写着"与主页面保持一致"，实际已经漂移：
// 侧边栏那份少了 es（西班牙语），导致面板里 /t es 解析不出来。
// 这里以主页面那份（超集）为准，两侧从此同源。
//
// 表只是数据，两处的翻译引擎（Google / Microsoft 直连与代理回退）实现
// 并不相同，本次**不合并**，仍各留各的。

const TRANSLATE_LANGUAGES = [
    { key: 'auto', label: '自动检测', aliases: ['auto', 'a', '自动'], g: 'auto', m: 'auto-detect' },
    { key: 'sc', label: '简体中文', aliases: ['sc', 'zh-cn', 'zh', 'cn', '简体', '中文'], g: 'zh-CN', m: 'zh-Hans' },
    { key: 'tc', label: '繁体中文', aliases: ['tc', 'zh-tw', 'tw', '繁体'], g: 'zh-TW', m: 'zh-Hant' },
    { key: 'en', label: '英语', aliases: ['en', 'english', '英'], g: 'en', m: 'en' },
    { key: 'ja', label: '日语', aliases: ['jp', 'jpn', 'ja', '日'], g: 'ja', m: 'ja' },
    { key: 'ko', label: '韩语', aliases: ['kr', 'kor', 'ko', '韩'], g: 'ko', m: 'ko' },
    { key: 'fr', label: '法语', aliases: ['fr', '法'], g: 'fr', m: 'fr' },
    { key: 'de', label: '德语', aliases: ['de', '德'], g: 'de', m: 'de' },
    { key: 'es', label: '西班牙语', aliases: ['es', '西'], g: 'es', m: 'es' },
    { key: 'ru', label: '俄语', aliases: ['ru', '俄'], g: 'ru', m: 'ru' },
    { key: 'pt', label: '葡萄牙语', aliases: ['pt', '葡'], g: 'pt', m: 'pt' },
    { key: 'it', label: '意大利语', aliases: ['it', '意'], g: 'it', m: 'it' },
    { key: 'th', label: '泰语', aliases: ['th', '泰'], g: 'th', m: 'th' },
    { key: 'vi', label: '越南语', aliases: ['vi', '越'], g: 'vi', m: 'vi' },
    { key: 'ar', label: '阿拉伯语', aliases: ['ar', '阿'], g: 'ar', m: 'ar' }
];;

// 把 'sc' / 'zh-cn' / '简体' 之类的写法解析成语言表条目；认不出返回 null
function resolveTranslateLanguage(rawCode) {
    const code = (rawCode || '').toLowerCase().trim();
    if (!code) return null;
    return TRANSLATE_LANGUAGES.find(entry => entry.key === code || entry.aliases.includes(code)) || null;
}

// 解析语言对文本：'sc-jp'（省略源语言则为 'jp'，默认源语言 auto）
function resolveLanguagePair(pairText) {
    const parts = (pairText || '').toLowerCase().split('-').filter(Boolean);
    if (parts.length === 0) return null;

    let fromEntry;
    let toEntry;
    if (parts.length >= 2) {
        fromEntry = resolveTranslateLanguage(parts[0]);
        toEntry = resolveTranslateLanguage(parts[1]);
    } else {
        fromEntry = resolveTranslateLanguage('auto');
        toEntry = resolveTranslateLanguage(parts[0]);
    }
    if (!fromEntry || !toEntry) return null;

    return { raw: fromEntry.key + '-' + toEntry.key, from: fromEntry, to: toEntry };
}

// ==== main/sidepanel/sidepanel.js ====
/**
 * OOOInterface 侧边栏面板（Chrome Side Panel）
 * 复用主页面的设置数据（chrome.storage.local 的 oooInterfaceSettings）、
 * DOM 结构与类名，同步主页面的外观状态（高级视觉效果/配色/壁纸），
 * 并按"侧边栏功能"设置渲染：小组件、快速访问链接、底部搜索框与引擎切换。
 */

// color.js 的 getColorConfig：本文件内还有一个同名包装函数（负责补充 themeColorScheme/自定义配色分支），
// 故以别名导入，避免与本文件内的函数声明重名。
const getColorConfigBase = getColorConfig; // [bundled] import { getColorConfig as getColorConfigBase }
// [bundled] import { … +1 个改名绑定 } from '../Script/color.js'
// [bundled] import { … } from '../Script/proxy.js'
// [bundled] import { … } from '../Script/widgets/ClockWidget.js'
// [bundled] import { … } from '../Script/widgets/CalendarWidget.js'
// [bundled] import { … } from '../Script/widgets/WeatherWidget.js'
// [bundled] import { … } from '../Script/widgets/TasksWidget.js'
// [bundled] import { … } from '../Script/widgets/AiAgentWidget.js'
// [bundled] import { … } from '../Script/widgets/EmailWidget.js'
// [bundled] import { … } from '../Script/widgets/UpgradeToolWidget.js'
// 出厂默认设置：与主页面共用同一来源（Stage 9）
// [bundled] import { … } from '../Script/settings-defaults.js'
// [bundled] import { … } from '../Script/storage-sync.js'
// 小组件类型表与尺寸辅助函数：与主页面共用同一来源（Stage 9）
// [bundled] import { … } from '../Script/widgets/widget-types.js'
// 翻译语言表与解析函数：与主页面共用同一来源（Stage 9）
// [bundled] import { … } from '../Script/translate-shared.js'

(function () {
    'use strict';

    // 出厂预设设置：由 settings-defaults.js 提供，与主页面同源（Stage 9）。
    // 此前这里只抄了本面板用到的一个子集，靠注释约定“与主页面保持一致”，
    // 实际已漂移；现在改为共用全集，多余默认键无害——本面板保存时整体回写，
    // 且 mergeSettings 会保留全部已存键，不会因此在两个页面间丢设置。

    var settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    var isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // 记录上次渲染的小组件配置，避免无关设置变化时重建小组件
    var lastWidgetsJson = null;
    var widgetInstances = [];

    // 内置页浏览器状态：是否展示、自有历史栈（iframe 跨域无法读取其历史，故自行维护）
    var browserOpen = false;
    var browserHistory = [];
    var browserIndex = -1;
    var browserCloseTimer = null;

    // 主页面 app 的轻量替身：小组件仅依赖这三个方法（均有 typeof 守卫）
    var panelOOO = {
        settings: settings,
        saveWidgetData: saveWidgetData,
        showNotification: showPanelToast,
        openWidgetSettings: function () {
            openMainPage('?openWidgets=1');
        }
    };

    // ========== 设置读取 ==========

    function mergeSettings(saved) {
        // 完整保留已存的全部设置键（面板保存时会整体回写，若只保留白名单键会清掉
        // 主页面的壁纸/小组件等其余设置），默认值仅用于补缺。
        //
        // 注意：这里**故意不与**主页面 SettingsMixin.mergeSettings 合并。那个版本是
        // 逐键白名单合并，带类型校验、旧数据迁移和取值 clamp，且只复制它认识的键；
        // 本面板需要的是「原样全量保留」，两者契约不同。若把这里换成主页那版，面板
        // 回写时会把主页的非默认设置冲回默认值；反过来则会让主页丢掉全部校验与迁移。
        // 共用的只是 DEFAULT_SETTINGS 这份默认值（settings-defaults.js）。
        return Object.assign(JSON.parse(JSON.stringify(DEFAULT_SETTINGS)), saved || {});
    }

    async function loadSettings() {
        var saved = null;
        try {
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                var result = await chrome.storage.local.get('oooInterfaceSettings');
                saved = result.oooInterfaceSettings || null;
            }
        } catch (e) {
            console.warn('侧边栏面板: chrome.storage.local 读取失败，尝试 localStorage:', e);
        }
        if (!saved) {
            try {
                var lsRaw = localStorage.getItem('oooInterfaceSettings');
                if (lsRaw) saved = JSON.parse(lsRaw);
            } catch (e) {
                console.error('侧边栏面板: localStorage 解析失败:', e);
            }
        }
        settings = mergeSettings(saved);
        panelOOO.settings = settings;
        // 与主页面 loadSettings 一致：高级视觉效果自动启用标志由两项状态派生
    }

    function saveSettings() {
        try {
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                var result = chrome.storage.local.set({ oooInterfaceSettings: settings });
                if (result && typeof result.catch === 'function') {
                    result.catch(function (error) {
                        console.warn('侧边栏面板: chrome.storage 保存失败，尝试 localStorage:', error);
                        try { localStorage.setItem('oooInterfaceSettings', JSON.stringify(settings)); } catch (e) { }
                    });
                }
            } else {
                localStorage.setItem('oooInterfaceSettings', JSON.stringify(settings));
            }
        } catch (error) {
            console.warn('侧边栏面板: 保存设置失败:', error);
        }
    }

    // ========== 提示浮层（小组件 saveWidgetData/showNotification 的面板版） ==========

    function showPanelToast(message) {
        var toast = document.getElementById('qa-panel-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'qa-panel-toast';
            toast.className = 'qa-panel-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(function () {
            toast.classList.remove('show');
        }, 2200);
    }

    // ========== 配色方案（与主页面 getColorConfig/applyColorScheme 逻辑一致） ==========

    function getColorConfig() {
        var scheme = settings.colorScheme || 'green';
        if (scheme === 'theme-add') {
            return settings.themeColorScheme || getColorConfigBase('green');
        }
        if (scheme === 'custom') {
            var customItem = settings.customColors && settings.customColors.length > 0 && settings.activeCustomColorIndex >= 0
                ? settings.customColors[settings.activeCustomColorIndex]
                : null;
            var customColors = customItem ? {
                primaryColor: customItem.primaryColor || '',
                secondaryColor: customItem.secondaryColor || '',
                gradientEnabled: customItem.gradientEnabled || false,
                gradientStart: customItem.gradientStart !== undefined ? customItem.gradientStart : 0,
                gradientEnd: customItem.gradientEnd !== undefined ? customItem.gradientEnd : 100
            } : {
                primaryColor: settings.customPrimaryColor || '',
                secondaryColor: settings.customSecondaryColor || '',
                gradientEnabled: settings.customGradientEnabled || false,
                gradientStart: settings.customGradientStart !== undefined ? settings.customGradientStart : 0,
                gradientEnd: settings.customGradientEnd !== undefined ? settings.customGradientEnd : 100
            };
            return getColorConfigBase('custom', customColors);
        }
        return getColorConfigBase(scheme);
    }

    function applyColorScheme() {
        var body = document.body;
        var scheme = settings.colorScheme || 'green';
        var colorConfig = getColorConfig();

        var colorClasses = ['color-scheme-green', 'color-scheme-blue', 'color-scheme-black-white', 'color-scheme-tianyi-blue', 'color-scheme-vibrant-red', 'color-scheme-classic-gold', 'color-scheme-isolation', 'color-scheme-earth', 'color-scheme-custom', 'color-scheme-theme-add'];
        colorClasses.forEach(function (cls) { body.classList.remove(cls); });
        body.classList.add('color-scheme-' + scheme);

        var accent = isDarkMode ? colorConfig.accentDark : colorConfig.accent;
        var accentRgb = isDarkMode ? colorConfig.accentDarkRgb : colorConfig.accentRgb;
        var gradient = isDarkMode ? (colorConfig.gradientDark || colorConfig.accentDark) : (colorConfig.gradient || colorConfig.accent);
        body.style.setProperty('--primary-color', accent);
        body.style.setProperty('--scheme-accent', accent);
        body.style.setProperty('--scheme-accent-rgb', accentRgb);
        body.style.setProperty('--scheme-gradient', gradient);
        body.style.setProperty('--scheme-accent-hover', colorConfig.accentHover);
        body.style.setProperty('--scheme-accent-active', colorConfig.accentActive);

        // 侧边栏图标配色（与主页面 updateSidebarIconColors 一致）
        var container = document.getElementById('quick-access-sidebar-container');
        if (container) {
            container.style.setProperty('--sidebar-icon-bg', colorConfig.sidebarIcon);
            // 面板中侧边栏常驻显示（主页面由 hover/固定逻辑添加 visible，这里始终可见）
            container.classList.add('visible');
        }
    }

    // ========== 字体（与主页面 applyFont 逻辑一致） ==========

    function loadCustomFonts() {
        var promises = (settings.customFonts || []).map(function (font) {
            try {
                var buffer = dataUrlToArrayBuffer(font.data);
                var fontFace = new FontFace(font.name, buffer);
                return fontFace.load().then(function (loadedFace) {
                    document.fonts.add(loadedFace);
                }).catch(function (error) {
                    console.error('侧边栏面板: 自定义字体加载失败:', error);
                });
            } catch (error) {
                console.error('侧边栏面板: 自定义字体解码失败:', error);
                return Promise.resolve();
            }
        });
        return Promise.all(promises);
    }

    function dataUrlToArrayBuffer(dataUrl) {
        var parts = dataUrl.split(',');
        var mime = parts[0].match(/:(.*?);/)[1];
        var binary = atob(parts[1]);
        var array = new Uint8Array(binary.length);
        for (var i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
        }
        return array.buffer;
    }

    function applyFont() {
        var body = document.body;
        var fontClasses = ['font-ginto', 'font-josefin', 'font-code', 'font-hmsc'];
        fontClasses.forEach(function (fontClass) {
            body.classList.remove(fontClass);
        });

        (settings.customFonts || []).forEach(function (font) {
            var safeClassName = 'font-' + font.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
            body.classList.remove(safeClassName);
        });

        if ((settings.customFonts || []).some(function (font) { return font.name === settings.font; })) {
            body.style.fontFamily = "'" + settings.font + "'";
        } else {
            body.style.fontFamily = '';
            switch (settings.font) {
                case 'Ginto':
                    body.classList.add('font-ginto');
                    break;
                case 'Josefin':
                    body.classList.add('font-josefin');
                    break;
                case 'Code':
                    body.classList.add('font-code');
                    break;
                case 'HMSC':
                    body.classList.add('font-hmsc');
                    break;
                default:
                    if (settings.font && settings.font !== 'Sans Flex') {
                        body.style.fontFamily = "'" + settings.font + "'";
                    }
                    break;
            }
        }
    }

    // ========== 壁纸（与主页面 getWallpaperUrl 解析一致） ==========

    function resolveMainWallpaperUrl() {
        if (settings.wallpaper === 'default') {
            return '../images/back.png';
        }
        if ((settings.wallpaper === 'bing' || settings.wallpaper === 'url') && settings.wallpaperUrl) {
            return settings.wallpaperUrl;
        }
        if (settings.wallpaper && settings.wallpaper !== 'default' && settings.wallpaper !== 'bing' && settings.wallpaper !== 'url') {
            return settings.wallpaper; // 自定义上传壁纸 data URL
        }
        return null;
    }

    function applyPanelWallpaper() {
        var wp = document.getElementById('qa-panel-wallpaper');
        if (!wp) return;

        var url = null;
        if (settings.sidePanelWallpaperEnabled) {
            if (settings.sidePanelWallpaperSync) {
                // 与主页面保持一致
                url = resolveMainWallpaperUrl();
            } else if (settings.sidePanelWallpaperUrl) {
                url = settings.sidePanelWallpaperUrl;
            } else {
                // 未填地址时使用默认壁纸
                url = '../images/back.png';
            }
        }

        wp.style.backgroundImage = url ? 'url("' + url + '")' : 'none';
        document.body.classList.toggle('qa-has-wallpaper', !!url);
    }

    // ========== 小组件（与主页面小组件面板同一套组件与配置） ==========
    //
    // 类型表 getWidgetAllowedSizes / normalizeWidgetSize 已提取到
    // ../Script/widgets/widget-types.js，与主页面共用（Stage 9）。
    // 此处只是本地副本删除，两个函数的调用点保持不变。

    function createWidgetInstance(config) {
        var baseConfig = {
            id: config.id,
            type: config.type,
            size: normalizeWidgetSize(config.type, config.size),
            data: config.data || {},
            ooo: panelOOO
        };
        switch (config.type) {
            case 'clock': return new ClockWidget(baseConfig);
            case 'calendar': return new CalendarWidget(baseConfig);
            case 'weather': return new WeatherWidget(baseConfig);
            case 'tasks': return new TasksWidget(baseConfig);
            case 'ai-agent': return new AiAgentWidget(baseConfig);
            case 'email': return new EmailWidget(baseConfig);
            case 'upgrade-tool': return new UpgradeToolWidget(baseConfig);
            default: return null;
        }
    }

    // 小组件数据保存：写入解析后的数据源并整体回写 storage（供主页面同步）
    function saveWidgetData(widgetId, data) {
        var widgets = getWidgetsSource();
        if (!Array.isArray(widgets)) return;
        var idx = widgets.findIndex(function (w) { return w.id === widgetId; });
        if (idx < 0) return;
        widgets[idx].data = data;
        saveSettings();
    }

    function renderWidgets() {
        var grid = document.getElementById('qa-widgets-grid');
        if (!grid) return;

        widgetInstances.forEach(function (w) {
            try { w.destroy(); } catch (e) { /* 忽略 */ }
        });
        widgetInstances = [];
        grid.innerHTML = '';

        var widgets = getWidgetsSource();

        if (widgets.length === 0) {
            var empty = document.createElement('div');
            empty.className = 'widget-panel-empty';
            empty.textContent = '暂无小组件';
            grid.appendChild(empty);
            // 空态引导：一键直达主页面的小组件管理
            var emptyCta = document.createElement('button');
            emptyCta.className = 'widget-panel-empty-cta';
            emptyCta.textContent = '去添加小组件';
            emptyCta.addEventListener('click', function () { openMainPage('?openWidgets=1'); });
            grid.appendChild(emptyCta);
        } else {
            widgets.forEach(function (config) {
                var widget = createWidgetInstance(config);
                if (widget) {
                    try {
                        widget.render(grid);
                        widgetInstances.push(widget);
                    } catch (e) {
                        console.warn('侧边栏面板: 渲染小组件失败:', config.type, e);
                    }
                }
            });
        }

        syncWidgetScale();
        syncWidgetCardHeights();
    }

    // 与主页面小组件面板保持同一观感：主页面为 2 列、网格宽 240px
    //（单列/正方形卡片 116px、间距 8px）。侧边栏铺满可用宽度，列数按宽度动态计算：
    // 面板越宽列数越多（3 列、4 列……），单列始终保持基准 116px 附近，
    // 再把整块网格按 zoom 等比缩放以铺满宽度（窄面板时缩放 <1，保证内容不溢出）。
    var WIDGET_COL_BASE = 116;   // 主页面单列（正方形卡片）宽度
    var WIDGET_GAP = 8;          // 网格间距，与 widget-panel.css 一致
    var lastWidgetScale = null;
    var currentWidgetColumns = 2;

    function syncWidgetScale() {
        var grid = document.getElementById('qa-widgets-grid');
        var scrollEl = document.getElementById('qa-widgets-scroll');
        if (!grid || !scrollEl) return;
        // 无小组件时不做缩放：空状态提示须按正常字号显示
        //（否则 zoom 会把提示文字放大数倍，呈现为"报错"般的大字）
        if (!getWidgetsSource().length) {
            if (lastWidgetScale !== 'empty') {
                lastWidgetScale = 'empty';
                currentWidgetColumns = 2;
                grid.style.zoom = '';
                grid.style.width = '';
                grid.style.margin = '';
                grid.style.gridAutoRows = '';
                grid.style.gridTemplateColumns = '';
            }
            return;
        }
        // 外框（滚动视口）的可视宽度 = 网格目标宽度
        var visualWidth = scrollEl.clientWidth;
        if (!(visualWidth > 0)) return;
        // 列数：只在可用宽度真正放得下下一列时才加列（向下取整）。
        // 首列没有前置间距，故分子要补一个间距：(宽度 + 间距) / (列宽 + 间距)；
        // 未加列时下面的 zoom 会把当前卡片等比放大铺满整宽，即"正常缩放"
        var cols = Math.max(2, Math.floor((visualWidth + WIDGET_GAP) / (WIDGET_COL_BASE + WIDGET_GAP)));
        // 该列数下网格的"设计宽度"（未缩放）：N 列 + N-1 个间距
        var localWidth = cols * WIDGET_COL_BASE + (cols - 1) * WIDGET_GAP;
        var scale = Math.round((visualWidth / localWidth) * 10000) / 10000;
        if (lastWidgetScale === scale && currentWidgetColumns === cols) return;
        lastWidgetScale = scale;
        currentWidgetColumns = cols;
        grid.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';
        grid.style.width = localWidth + 'px';
        grid.style.zoom = String(scale);
        grid.style.margin = '0 auto';
    }

    // 行高 = 列宽（与主页面 syncWidgetCardHeights 一致）。
    // 网格宽度 = N 列 × 116 + 间距、各列为 1fr，故列宽恒为基准 116px（缩放前的布局值）
    function syncWidgetCardHeights() {
        var grid = document.getElementById('qa-widgets-grid');
        if (!grid) return;
        if (!getWidgetsSource().length) return;
        grid.style.gridAutoRows = WIDGET_COL_BASE + 'px';
    }

    // ========== 数据源解析（与主页面保持一致 / 侧边栏独立配置） ==========

    function getQuickLinksSource() {
        if (settings.sidePanelQuickLinksSync) {
            return Array.isArray(settings.quickLinks) ? settings.quickLinks : [];
        }
        if (!Array.isArray(settings.sidePanelQuickLinks)) settings.sidePanelQuickLinks = [];
        return settings.sidePanelQuickLinks;
    }

    function getWidgetsSource() {
        if (settings.sidePanelWidgetsSync) {
            return (settings.widgetPanel && Array.isArray(settings.widgetPanel.widgets)) ? settings.widgetPanel.widgets : [];
        }
        if (!settings.sidePanelWidgetPanel || typeof settings.sidePanelWidgetPanel !== 'object') {
            settings.sidePanelWidgetPanel = { widgets: [] };
        }
        if (!Array.isArray(settings.sidePanelWidgetPanel.widgets)) settings.sidePanelWidgetPanel.widgets = [];
        return settings.sidePanelWidgetPanel.widgets;
    }

    // ========== 快速访问链接渲染（与主页面 renderQuickAccessSidebar 完全一致） ==========

    function extractDomain(url) {
        try {
            var u = new URL(url);
            return u.hostname;
        } catch (e) {
            return null;
        }
    }

    function cacheFavicon(link, index, domain, src) {
        if (src) {
            link._favicon = src;
        } else {
            link._favicon = '';
        }
        saveSettings();
    }

    function renderQuickAccessSidebar() {
        var sidebarLinks = document.getElementById('quick-access-sidebar-links');
        if (!sidebarLinks) return;

        sidebarLinks.innerHTML = '';

        const quickLinks = getQuickLinksSource();
        if (quickLinks.length === 0) {
            var emptyMsg = document.createElement('div');
            emptyMsg.className = 'quick-access-sidebar-empty';
            emptyMsg.textContent = '暂无快速访问链接';
            sidebarLinks.appendChild(emptyMsg);
        } else {
            quickLinks.forEach(function (link, index) {
                var linkItem = document.createElement('button');
                linkItem.className = 'quick-access-sidebar-link';
                linkItem.title = link.url;

                var iconEl = document.createElement('span');
                iconEl.className = 'quick-access-sidebar-link-icon';

                var letterEl = document.createElement('span');
                letterEl.className = 'quick-access-sidebar-link-letter';
                letterEl.textContent = link.name.charAt(0).toUpperCase();
                iconEl.appendChild(letterEl);

                var faviconImg = document.createElement('img');
                faviconImg.className = 'quick-access-sidebar-link-favicon';
                faviconImg.alt = '';
                faviconImg.style.display = 'none';

                var domain = extractDomain(link.url);
                var faviconUrl = null;
                var tryFallback = false;

                if (link._favicon !== undefined && link._favicon !== null) {
                    // _favicon 为空字符串表示之前已检测为无图标，直接用字母占位，不再重试
                    if (link._favicon !== '') {
                        faviconUrl = link._favicon;
                    }
                } else if (domain) {
                    faviconUrl = 'https://www.google.com/s2/favicons?domain=' + domain + '&sz=32';
                    tryFallback = true;
                }

                if (faviconUrl) {
                    faviconImg.src = faviconUrl;

                    var fallbackTried = false;

                    faviconImg.onerror = function () {
                        if (tryFallback && !fallbackTried && domain) {
                            fallbackTried = true;
                            this.src = 'https://icons.duckduckgo.com/ip3/' + domain + '.ico';
                            return;
                        }
                        this.style.display = 'none';
                        var letter = this.parentElement.querySelector('.quick-access-sidebar-link-letter');
                        if (letter) letter.style.display = 'flex';
                        // 仅在从未检测过时写入缓存，避免每次渲染重复回写设置
                        if (link._favicon === undefined && domain) {
                            cacheFavicon(link, index, domain, null);
                        }
                    };

                    faviconImg.onload = function () {
                        var isDefaultIcon = this.naturalWidth <= 20 || this.naturalHeight <= 20;

                        if (isDefaultIcon && link._favicon === undefined) {
                            this.style.display = 'none';
                            var letter = this.parentElement.querySelector('.quick-access-sidebar-link-letter');
                            if (letter) letter.style.display = 'flex';
                            cacheFavicon(link, index, domain, null);
                            return;
                        }

                        var letter = this.parentElement.querySelector('.quick-access-sidebar-link-letter');
                        if (letter) letter.style.display = 'none';
                        this.style.display = 'block';

                        if (link._favicon === undefined && domain) {
                            cacheFavicon(link, index, domain, this.src);
                        }
                    };
                }

                iconEl.appendChild(faviconImg);

                var textEl = document.createElement('span');
                textEl.className = 'quick-access-sidebar-link-text';
                textEl.textContent = link.name;

                linkItem.appendChild(iconEl);
                linkItem.appendChild(textEl);

                linkItem.addEventListener('click', function () {
                    openLink(link.url);
                });

                sidebarLinks.appendChild(linkItem);
            });
        }

        // 根据设置显示/隐藏图标（与主页面一致：类开关 + 内联兜底）
        var containerEl = document.getElementById('quick-access-sidebar-container');
        if (containerEl) {
            containerEl.classList.toggle('no-icons', !settings.showQuickLinkIcons);
            var linkItems = containerEl.querySelectorAll('.quick-access-sidebar-link');
            linkItems.forEach(function (item) {
                var icon = item.querySelector('.quick-access-sidebar-link-icon');
                if (icon) {
                    icon.style.display = settings.showQuickLinkIcons ? '' : 'none';
                }
            });
        }
    }

    // ========== 底部搜索框与引擎切换 ==========
    //
    // 与主页面的 oooEngineLocked（script.js / SearchMixin.js）不是一回事，**不要合并**：
    //   oooEngineLocked    = 主页面用户是否「锁定」了搜索引擎（锁定后不再跟随默认引擎）
    //   oooSidePanelEngine = 本面板当前选中的搜索引擎
    // 两者语义不同、可各自独立取值。

    var currentEngine = localStorage.getItem('oooSidePanelEngine') === 'bing' ? 'bing' : 'google';

    function isUrlLike(text) {
        var t = text.trim();
        if (/^https?:\/\//i.test(t)) return true;
        return !/\s/.test(t) && /^[^\s]+\.[^\s]{2,}$/.test(t);
    }

    function getSearchUrl(query) {
        var enc = encodeURIComponent(query);
        return currentEngine === 'bing'
            ? 'https://www.bing.com/search?q=' + enc
            : 'https://www.google.com/search?q=' + enc;
    }

    function updateEngineButtons() {
        var googleBtn = document.getElementById('qa-google-engine');
        var bingBtn = document.getElementById('qa-bing-engine');
        if (googleBtn) googleBtn.classList.toggle('active', currentEngine === 'google');
        if (bingBtn) bingBtn.classList.toggle('active', currentEngine === 'bing');
    }

    // ========== “/” 命令系统（网址 / 翻译） ==========
    // 主页面把这套逻辑实现在 App 类里；面板是独立页面，这里按相同的语法与交互移植一份。
    // DOM 与样式仍复用主页面：styles.css 中的 search-command-container /
    // search-command-item / search-mode-chip / search-history-item 等类直接生效。

    var searchCommandMode = null;
    var translateSelectedPair = null;
    var commandListState = { visible: false, items: [], highlight: -1 };

    function escapeHtml(text) {
        return String(text === null || text === undefined ? '' : text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function getSlashCommands() {
        return [
            { name: 'web', icon: 'language', desc: '打开网页' },
            { name: 'translate', icon: 'translate', desc: '翻译文本' }
        ];
    }

    function isWebCommand(word) {
        return ['web', 'w', '网址'].indexOf((word || '').toLowerCase()) !== -1;
    }

    function isTranslateCommand(word) {
        return ['translate', 't', '翻译'].indexOf((word || '').toLowerCase()) !== -1;
    }

    // 语言表与解析函数已提取到 ../Script/translate-shared.js，与主页面共用（Stage 9）。
    // 本地面板此前那份表少了 es（西班牙语），与主页面并不一致；改用共享表后
    // /t es 也能在面板里解析。下方 resolveTranslateLanguage / resolveLanguagePair
    // 的调用点保持不变。

    // ---- 翻译语言对 / 网址历史（localStorage，与主页面共用同一份存储） ----

    function getTranslateHistory() {
        try {
            return JSON.parse(localStorage.getItem('oooTranslateHistory') || '[]') || [];
        } catch (e) {
            return [];
        }
    }

    function setTranslateHistory(list) {
        localStorage.setItem('oooTranslateHistory', JSON.stringify(list || []));
    }

    function recordTranslateHistory(fromEntry, toEntry) {
        if (!fromEntry || !toEntry) return;
        var raw = fromEntry.key + '-' + toEntry.key;
        var list = getTranslateHistory().filter(function (item) { return item && item.pair !== raw; });
        list.unshift({ pair: raw });
        if (list.length > 12) list.length = 12;
        setTranslateHistory(list);
    }

    function getWebHistory() {
        try {
            return JSON.parse(localStorage.getItem('oooWebCommandHistory') || '[]') || [];
        } catch (e) {
            return [];
        }
    }

    function setWebHistory(list) {
        localStorage.setItem('oooWebCommandHistory', JSON.stringify(list || []));
    }

    // 记录通过命令打开的网址（存主机名用于展示，key 用于去重）
    function recordWebHistory(urlText) {
        var parsed;
        try {
            parsed = new URL(urlText);
        } catch (e) {
            return;
        }
        var rest = (parsed.pathname === '/' && !parsed.search) ? '' : parsed.pathname + parsed.search;
        var key = parsed.origin + (rest || '/');
        var list = getWebHistory().filter(function (item) { return item && item.key !== key; });
        list.unshift({ key: key, host: parsed.host.replace(/^www\./, ''), rest: rest });
        if (list.length > 12) list.length = 12;
        setWebHistory(list);
    }

    // ---- 翻译引擎（直连优先，配置了本地代理且直连抛错时走代理重试） ----

    async function slashFetch(url, options) {
        try {
            return await fetch(url, options);
        } catch (err) {
            if (typeof ProxyManager !== 'undefined' && ProxyManager.isProxyEnabled()) {
                return await ProxyManager.proxiedFetch(url, options);
            }
            throw err;
        }
    }

    async function fetchGoogleTranslate(text, sl, tl) {
        var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=' +
            encodeURIComponent(sl) + '&tl=' + encodeURIComponent(tl) + '&dt=t&q=' + encodeURIComponent(text);

        var response = await slashFetch(url);
        if (!response.ok) {
            throw new Error('Google 翻译服务响应异常 (HTTP ' + response.status + ')');
        }

        var data = await response.json();
        if (!Array.isArray(data) || !Array.isArray(data[0])) {
            throw new Error('Google 翻译结果解析失败');
        }

        return data[0].map(function (segment) {
            return (segment && segment[0]) ? segment[0] : '';
        }).join('');
    }

    // Microsoft(Bing) 免费接口：需先从 bing 首页抓取 IG 与防滥用 token
    async function getBingTranslateAuth(forceRefresh) {
        if (!forceRefresh) {
            try {
                var cached = JSON.parse(localStorage.getItem('oooBingTranslateAuth') || 'null');
                if (cached && cached.token && cached.ig && Date.now() - cached.ts < 20 * 60 * 1000) {
                    return cached;
                }
            } catch (e) { /* 缓存损坏则重新获取 */ }
        }

        var response = await slashFetch('https://www.bing.com/');
        var html = await response.text();

        var igMatch = html.match(/IG:"([^"]+)"/);
        var tokenMatch = html.match(/params_AbusePreventionHelper\s*=\s*\[\s*\d+\s*,\s*"([^"]+)"/);

        if (!igMatch || !tokenMatch) {
            throw new Error('无法获取 Microsoft 翻译凭证');
        }

        var auth = { ig: igMatch[1], token: tokenMatch[1], ts: Date.now() };
        localStorage.setItem('oooBingTranslateAuth', JSON.stringify(auth));
        return auth;
    }

    async function fetchBingTranslate(text, fromCode, toCode, forceNewAuth) {
        try {
            var auth = await getBingTranslateAuth(!!forceNewAuth);
            var body = new URLSearchParams({
                from: fromCode,
                to: toCode,
                text: text,
                token: auth.token,
                key: auth.ig
            }).toString();

            var response = await slashFetch('https://www.bing.com/ttranslatev3?isTanslateReq=true', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body
            });

            if (!response.ok) {
                throw new Error('Microsoft 翻译服务响应异常 (HTTP ' + response.status + ')');
            }

            var data = await response.json();
            if (Array.isArray(data) && data[0] && Array.isArray(data[0].translations)) {
                return data[0].translations.map(function (item) { return item.text || ''; }).join('');
            }
            throw new Error('Microsoft 翻译结果解析失败');
        } catch (err) {
            // 凭证失效等情况：强制刷新一次后重试
            if (!forceNewAuth) {
                return await fetchBingTranslate(text, fromCode, toCode, true);
            }
            throw err;
        }
    }

    // 引擎跟随面板当前选择的搜索引擎（与主页面同一套回退策略）
    async function translateText(text, fromEntry, toEntry) {
        if (currentEngine === 'bing') {
            try {
                return await fetchBingTranslate(text, fromEntry.m, toEntry.m, false);
            } catch (err) {
                console.warn('[面板翻译] Microsoft 翻译失败，回退到 Google 翻译:', err.message);
            }
        }
        return await fetchGoogleTranslate(text, fromEntry.g, toEntry.g);
    }

    // ---- 命令列表 / 模式 chip / 历史面板 UI ----

    // 统一同步搜索框辅助 UI：
    // - 组件模式（web/translate）激活时：左侧 chip 替代命令文字，下方展示对应历史
    // - 未进入模式且以“/”开头：显示命令候选列表，“/别名+空格”立即进入对应模式
    function syncSearchAssistantUI(value) {
        if (typeof value !== 'string') value = '';

        if (searchCommandMode === 'web') {
            hideSearchCommandList();
            updateSearchModeChip();
            refreshSearchDropdownPanels();
            return;
        }

        if (searchCommandMode === 'translate') {
            hideSearchCommandList();
            lockTranslatePairFromInput(value);
            updateSearchModeChip();
            refreshSearchDropdownPanels();
            return;
        }

        if (value.charAt(0) === '/') {
            // “/别名 + 空格”：把前缀替换为左侧 chip，剩余文本作为参数继续输入
            var entered = value.match(/^\/(\S+)\s([\s\S]*)$/);
            if (entered && (isWebCommand(entered[1]) || isTranslateCommand(entered[1]))) {
                var mode = isWebCommand(entered[1]) ? 'web' : 'translate';
                var input = document.getElementById('qa-search-input');
                if (input) input.value = entered[2] || '';
                enterSearchCommandMode(mode);
                if (mode === 'translate') {
                    lockTranslatePairFromInput(input ? input.value : '');
                    updateSearchModeChip();
                    refreshSearchDropdownPanels();
                }
                return;
            }

            updateSearchModeChip();
            showSearchCommandList(value);
            return;
        }

        hideSearchCommandList();
        updateSearchModeChip();
        refreshSearchDropdownPanels();
    }

    function showSearchCommandList(currentInput) {
        if ((currentInput || '').charAt(0) !== '/') {
            hideSearchCommandList();
            return;
        }

        // 只在第一个空格之前提供候选；出现空格说明已进入对应组件模式
        var partial = currentInput.slice(1);
        if (/\s/.test(partial)) {
            hideSearchCommandList();
            return;
        }

        var filter = partial.toLowerCase();
        var items = getSlashCommands().filter(function (cmd) {
            if (!filter) return true;
            if (cmd.name.toLowerCase().indexOf(filter) === 0) return true;
            var extraAliases = isWebCommand(cmd.name)
                ? ['w', '网址']
                : (isTranslateCommand(cmd.name) ? ['t', '翻译'] : []);
            return extraAliases.some(function (alias) {
                return alias.toLowerCase().indexOf(filter) === 0;
            });
        });

        if (items.length === 0) {
            hideSearchCommandList();
            return;
        }

        commandListState = { visible: true, items: items, highlight: -1 };
        renderSearchCommandItems();
        refreshSearchDropdownPanels();
    }

    function hideSearchCommandList() {
        var container = document.getElementById('qa-search-command-container');
        if (container) container.classList.remove('show');
        if (commandListState) {
            commandListState.visible = false;
            commandListState.highlight = -1;
        }
    }

    function renderSearchCommandItems() {
        var list = document.getElementById('qa-search-command-list');
        if (!list || !commandListState) return;

        list.innerHTML = '';
        commandListState.items.forEach(function (cmd, index) {
            var item = document.createElement('div');
            item.className = 'search-command-item' + (index === commandListState.highlight ? ' selected' : '');
            item.dataset.index = index;
            item.innerHTML =
                '<span class="search-command-icon material-icons">' + cmd.icon + '</span>' +
                '<div class="search-command-info">' +
                '<span class="search-command-name">/' + cmd.name + '</span>' +
                '<span class="search-command-desc">' + escapeHtml(cmd.desc) + '</span>' +
                '</div>';
            list.appendChild(item);
        });
    }

    function moveSearchCommandHighlight(delta) {
        var state = commandListState;
        if (!state || !state.visible || state.items.length === 0) return;

        var max = state.items.length - 1;
        state.highlight += delta;
        if (state.highlight > max) state.highlight = 0;
        if (state.highlight < 0) state.highlight = max;

        renderSearchCommandItems();
    }

    function applySearchCommand(cmd) {
        if (!cmd) return;
        var input = document.getElementById('qa-search-input');
        if (input) {
            input.value = '';
            input.focus();
        }
        enterSearchCommandMode(isWebCommand(cmd.name) ? 'web' : 'translate');
    }

    function enterSearchCommandMode(mode) {
        searchCommandMode = mode;
        translateSelectedPair = null;
        hideSearchCommandList();
        updateSearchModeChip();
        refreshSearchDropdownPanels();

        var input = document.getElementById('qa-search-input');
        if (input) input.focus();
    }

    // 退出组件模式；clearInput=false 时保留输入框现有内容（如翻译结果）
    function exitSearchCommandMode(clearInput) {
        searchCommandMode = null;
        translateSelectedPair = null;

        var input = document.getElementById('qa-search-input');
        if (clearInput !== false && input) input.value = '';

        updateSearchModeChip();
        hideSearchCommandList();
        refreshSearchDropdownPanels();
    }

    // 模式 chip：由组件模式状态驱动，位于输入框左侧。
    // 进入模式时放大镜图标收缩隐去、椭圆展开顶入（CSS 过渡联动），退出时反向还原
    function updateSearchModeChip() {
        var chip = document.getElementById('qa-search-mode-chip');
        if (!chip) return;

        var searchContainer = document.querySelector('.qa-panel-search .search-container');
        if (searchContainer) {
            searchContainer.classList.toggle('mode-active', !!searchCommandMode);
        }

        var iconEl = chip.querySelector('.search-mode-chip-icon');
        var textEl = chip.querySelector('.search-mode-chip-text');

        if (searchCommandMode === 'web') {
            iconEl.textContent = 'language';
            textEl.textContent = '网址';
            chip.classList.add('expanded');
        } else if (searchCommandMode === 'translate') {
            iconEl.textContent = 'translate';
            textEl.textContent = translateSelectedPair
                ? translateSelectedPair.from.label + '→' + translateSelectedPair.to.label
                : '翻译';
            chip.classList.add('expanded');
        } else {
            chip.classList.remove('expanded');
        }
    }

    // translate 模式下从输入中锁定语言对：首个空白之前的部分若可解析则锁定，并把它从输入中移除
    function lockTranslatePairFromInput(value) {
        if (translateSelectedPair || !value) return;

        var spIndex = value.search(/\s/);
        if (spIndex === -1) return; // 尚未出现空格，等待继续输入

        var pair = resolveLanguagePair(value.slice(0, spIndex));
        if (!pair) return; // 无法解析时保留原样，交由 Enter 时提示

        translateSelectedPair = pair;
        var input = document.getElementById('qa-search-input');
        if (input) input.value = value.slice(spIndex).replace(/^\s+/, '');
    }

    // 下方共享下拉面板：命令列表可见时优先；否则按当前组件模式展示使用历史。
    // 行样式复用原生搜索历史 search-history-item
    function refreshSearchDropdownPanels() {
        var container = document.getElementById('qa-search-command-container');
        if (!container) return;

        var commandVisible = !!(commandListState && commandListState.visible);

        var commandList = document.getElementById('qa-search-command-list');
        if (commandList && !commandVisible) commandList.innerHTML = '';

        var historyEntries = [];
        var historyKind = '';
        if (!commandVisible) {
            if (searchCommandMode === 'translate') {
                historyEntries = getTranslateHistory();
                historyKind = 'translate';
            } else if (searchCommandMode === 'web') {
                historyEntries = getWebHistory();
                historyKind = 'web';
            }
        }

        var historyList = document.getElementById('qa-translate-history-list');
        if (historyList) {
            historyList.innerHTML = '';

            if (historyKind === 'translate' && historyEntries.length > 0) {
                historyEntries.forEach(function (entry) {
                    if (!entry || !entry.pair) return;
                    var sides = String(entry.pair).split('-');
                    var fromE = resolveTranslateLanguage(sides[0]);
                    var toE = resolveTranslateLanguage(sides[1]);
                    var labels = (fromE ? fromE.label : sides[0]) + '→' + (toE ? toE.label : sides[1]);

                    var row = document.createElement('div');
                    row.className = 'search-history-item';
                    row.dataset.pair = entry.pair;
                    row.innerHTML =
                        '<span class="search-history-text">' + escapeHtml(entry.pair + ' · ' + labels) + '</span>' +
                        '<button class="search-history-delete" data-kind="translate" data-pair="' +
                        escapeHtml(entry.pair) + '">×</button>';
                    historyList.appendChild(row);
                });
            } else if (historyKind === 'web' && historyEntries.length > 0) {
                historyEntries.forEach(function (entry) {
                    if (!entry || !entry.host) return;

                    var row = document.createElement('div');
                    row.className = 'search-history-item';
                    row.dataset.key = entry.key || '';
                    row.innerHTML =
                        '<span class="search-history-text">' + escapeHtml(entry.host + (entry.rest || '')) + '</span>' +
                        '<button class="search-history-delete" data-kind="web" data-key="' +
                        escapeHtml(entry.key || '') + '">×</button>';
                    historyList.appendChild(row);
                });
            }
        }

        if (commandVisible || (historyList && historyList.children.length > 0)) {
            container.classList.add('show');
        } else {
            container.classList.remove('show');
        }
    }

    function applyTranslateHistoryPair(pairRaw) {
        if (searchCommandMode !== 'translate') {
            enterSearchCommandMode('translate');
        }

        var pair = resolveLanguagePair((pairRaw || '').replace(/→/g, '-'));
        if (!pair) return;

        translateSelectedPair = pair;
        updateSearchModeChip();
        refreshSearchDropdownPanels();

        var input = document.getElementById('qa-search-input');
        if (input) input.focus();
    }

    function applyWebHistoryEntry(entry) {
        if (!entry || !entry.host) return;

        if (searchCommandMode !== 'web') {
            enterSearchCommandMode('web');
        }

        var input = document.getElementById('qa-search-input');
        if (input) {
            input.value = entry.host + (entry.rest || '');
            input.focus();
        }
    }

    // ---- 执行 ----

    // 通过命令打开网址：记录历史；开启「内置页打开」时在面板 iframe 内展示，否则新标签页
    function openExternalUrl(urlText) {
        var url = (urlText || '').trim();
        if (!url) return false;
        if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

        try {
            new URL(url);
        } catch (e) {
            return false;
        }

        recordWebHistory(url);
        if (settings.sidePanelBuiltinOpen) {
            openBuiltinPage(url);
        } else {
            openLink(url);
        }
        return true;
    }

    // 翻译模式的回车执行：未锁定语言对时把首词作为语言对兜底解析
    async function executeTranslateModeQuery(rawText) {
        var text = (rawText || '').trim();
        if (!text) return;

        if (!translateSelectedPair) {
            var inlineMatch = text.match(/^(\S+)\s+([\s\S]+)$/);
            if (inlineMatch) {
                var inlinePair = resolveLanguagePair(inlineMatch[1]);
                if (inlinePair) {
                    translateSelectedPair = inlinePair;
                    updateSearchModeChip();
                    await runTranslateFlow(inlineMatch[2], inlinePair);
                    return;
                }
            }
            return;
        }

        await runTranslateFlow(text, translateSelectedPair);
    }

    // 统一翻译执行：调用引擎 → 结果输出到搜索框 → 复制 → 记录历史 → 退出模式（保留结果）
    async function runTranslateFlow(text, pair) {
        try {
            var result = await translateText(text, pair.from, pair.to);
            if (!result) throw new Error('未获得翻译结果');

            var input = document.getElementById('qa-search-input');
            if (input) input.value = result;

            recordTranslateHistory(pair.from, pair.to);
            exitSearchCommandMode(false);

            try {
                await navigator.clipboard.writeText(result);
            } catch (e) {
                console.warn('面板翻译: 复制到剪贴板失败:', e);
            }
        } catch (err) {
            console.error('面板翻译失败:', err.message);
        }
    }

    // “/” 命令语法兜底路径（正常流程中前缀在输入空格时已替换为 chip）
    async function executeSlashCommand(trimmedQuery) {
        var match = trimmedQuery.slice(1).match(/^(\S*)(?:\s+([\s\S]*))?$/);
        if (!match) return;

        var word = match[1] || '';

        if (isWebCommand(word)) {
            var url = (match[2] || '').replace(/\s+/g, '');
            if (!url) return;
            if (openExternalUrl(url)) {
                var input = document.getElementById('qa-search-input');
                if (input) input.value = '';
                exitSearchCommandMode(false);
            }
            return;
        }

        if (isTranslateCommand(word)) {
            var rest = (match[2] || '').trim();
            if (!rest) return;

            var parts = rest.match(/^(\S+)\s+([\s\S]+)$/);
            if (!parts) return;

            var pair = resolveLanguagePair(parts[1]);
            if (!pair) return;

            await runTranslateFlow(parts[2], pair);
        }
    }

    // 回车提交：分类处理组件模式 / “/” 命令，其余走搜索或直达网址
    function submitSearch(value) {
        var text = (value || '').trim();
        if (!text) return;

        var input = document.getElementById('qa-search-input');

        if (searchCommandMode === 'web') {
            if (openExternalUrl(text)) {
                if (input) input.value = '';
                exitSearchCommandMode(false);
            }
            return;
        }

        if (searchCommandMode === 'translate') {
            executeTranslateModeQuery(text);
            return;
        }

        if (text.charAt(0) === '/') {
            executeSlashCommand(text);
            hideSearchCommandList();
            return;
        }

        if (input) input.value = '';
        var target = resolveBrowserTarget(text);
        // 开启「内置页打开」时在面板内 iframe 展示，否则新标签页打开
        if (settings.sidePanelBuiltinOpen) {
            openBuiltinPage(target);
        } else {
            openLink(target);
        }
    }

    // ========== 内置页浏览器（开启「内置页打开」后，搜索/访问的网页在此以 iframe 展示） ==========

    // 移动端模式：面板窄于阈值时，把发往搜索引擎的「子帧」请求 UA 改为移动端，
    // 使其返回移动版页面。Chrome 不支持为单个 iframe 单独设置 UA，只能通过
    // DNR 会话规则实现；用 requestDomains 限定作用域，避免影响其它页面的 iframe。
    var MOBILE_UA = 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36';
    var MOBILE_UA_RULE_ID = 9001;
    var MOBILE_NARROW_MAX = 520;
    // 标准手机布局宽度：取略大于常见手机视口（Pixel 7 约 412px）的值，给移动版页面
    // 留出布局余量——站点的 min-width / 100vw（含滚动条）等固定宽元素常略超设备视口，
    // 若视口恰好等于设备宽度，超出的部分会被裁切导致右侧显示不全
    var MOBILE_VIEWPORT_WIDTH = 480;
    var MOBILE_UA_DOMAINS = ['google.com', 'bing.com'];
    var mobileUaRuleEnabled = false;
    var lastNarrowState = window.innerWidth < MOBILE_NARROW_MAX;

    function dnrAvailable() {
        try {
            return typeof chrome !== 'undefined' && !!chrome.declarativeNetRequest &&
                typeof chrome.declarativeNetRequest.updateSessionRules === 'function';
        } catch (e) {
            return false;
        }
    }

    // 依据「功能开关 + 面板宽度」同步移动端 UA 会话规则
    function syncMobileUaRule() {
        if (!dnrAvailable()) return;
        var shouldEnable = !!settings.sidePanelBuiltinOpen && window.innerWidth < MOBILE_NARROW_MAX;
        if (shouldEnable === mobileUaRuleEnabled) return;
        mobileUaRuleEnabled = shouldEnable;
        var options = shouldEnable
            ? {
                removeRuleIds: [MOBILE_UA_RULE_ID],
                addRules: [{
                    id: MOBILE_UA_RULE_ID,
                    priority: 1,
                    action: {
                        type: 'modifyHeaders',
                        requestHeaders: [
                            { header: 'user-agent', operation: 'set', value: MOBILE_UA }
                        ]
                    },
                    condition: {
                        requestDomains: MOBILE_UA_DOMAINS,
                        resourceTypes: ['sub_frame']
                    }
                }]
            }
            : { removeRuleIds: [MOBILE_UA_RULE_ID] };
        try {
            var p = chrome.declarativeNetRequest.updateSessionRules(options);
            if (p && typeof p.catch === 'function') p.catch(function () { });
        } catch (e) { }
    }

    // 窄屏移动端视口缩放：卡片宽度小于移动端设计宽度时，把 iframe 布局视口固定为
    // MOBILE_VIEWPORT_WIDTH 再等比缩放到卡片内，使移动版页面按标准手机宽度排版，
    // 避免站点 min-width 造成的横向溢出（超出屏幕边界）
    function applyMobileViewportScale() {
        // 尺寸读取与计算延后到下一帧：load / resize 回调触发时 DOM 布局可能尚未稳定，
        // 此刻读到的 clientWidth/clientHeight 会导致 scale 偏差、右侧被裁切
        requestAnimationFrame(function () {
            var card = document.getElementById('qa-browser-card');
            var frame = document.getElementById('qa-browser-frame');
            if (!card || !frame) return;
            var narrow = !!settings.sidePanelBuiltinOpen && window.innerWidth < MOBILE_NARROW_MAX;
            var cardW = card.clientWidth;
            var cardH = card.clientHeight;
            var scale = (narrow && cardW > 0 && cardW < MOBILE_VIEWPORT_WIDTH) ? cardW / MOBILE_VIEWPORT_WIDTH : 1;
            if (scale < 1) {
                card.classList.add('qa-mobile-mode');
                frame.style.width = MOBILE_VIEWPORT_WIDTH + 'px';
                // 视觉高度需等于卡片高度 => 布局高度 = 卡片高度 / scale
                frame.style.height = Math.round(cardH / scale) + 'px';
                frame.style.transform = 'scale(' + scale + ')';
            } else {
                card.classList.remove('qa-mobile-mode');
                frame.style.width = '';
                frame.style.height = '';
                frame.style.transform = '';
            }
        });
    }

    // 面板尺寸变化跨越阈值时，若内置页正打开则重新加载当前页，使 UA 立即生效
    function handlePanelResize() {
        syncMobileUaRule();
        applyMobileViewportScale();
        var narrow = window.innerWidth < MOBILE_NARROW_MAX;
        if (narrow === lastNarrowState) return;
        lastNarrowState = narrow;
        if (!browserOpen || browserIndex < 0) return;
        var frame = document.getElementById('qa-browser-frame');
        if (!frame) return;
        var url = browserHistory[browserIndex];
        // 同一 src 赋值不会触发重载，先清空再回填以强制刷新
        frame.src = 'about:blank';
        setTimeout(function () { frame.src = url; }, 0);
    }

    // 面板卸载时移除会话规则，避免规则残留影响其它页面的 iframe
    function removeMobileUaRule() {
        if (!dnrAvailable()) return;
        mobileUaRuleEnabled = false;
        try { chrome.declarativeNetRequest.updateSessionRules({ removeRuleIds: [MOBILE_UA_RULE_ID] }); } catch (e) { }
    }

    // 将输入内容解析为地址：网址直连，其余按当前引擎搜索
    function resolveBrowserTarget(text) {
        var value = (text || '').trim();
        if (!value) return '';
        return isUrlLike(value)
            ? (/^https?:\/\//i.test(value) ? value : 'https://' + value)
            : getSearchUrl(value);
    }

    function browserSetFrame(url) {
        var frame = document.getElementById('qa-browser-frame');
        if (frame) {
            // iframe 内容渲染完成后尺寸才稳定，需重算一次视口缩放，
            // 否则按加载前的卡片尺寸算出的 scale 会与实际不符
            if (!frame._scaleLoadBound) {
                frame._scaleLoadBound = true;
                frame.addEventListener('load', function () { applyMobileViewportScale(); });
            }
            frame.src = url;
        }
        var urlInput = document.getElementById('qa-browser-url');
        if (urlInput) urlInput.value = url;
    }

    function updateBrowserControls() {
        var backBtn = document.getElementById('qa-browser-back');
        var forwardBtn = document.getElementById('qa-browser-forward');
        if (backBtn) backBtn.disabled = browserIndex <= 0;
        if (forwardBtn) forwardBtn.disabled = browserIndex >= browserHistory.length - 1;
    }

    // 导航到目标地址并压入自有历史栈；push=false 用于前进/后退回放（不重复入栈）
    function browserNavigate(url, push) {
        if (!url) return;
        if (push !== false) {
            browserHistory = browserHistory.slice(0, browserIndex + 1);
            browserHistory.push(url);
            browserIndex = browserHistory.length - 1;
        }
        browserSetFrame(url);
        updateBrowserControls();
    }

    function browserBack() {
        if (browserIndex <= 0) return;
        browserIndex--;
        browserSetFrame(browserHistory[browserIndex]);
        updateBrowserControls();
    }

    function browserForward() {
        if (browserIndex >= browserHistory.length - 1) return;
        browserIndex++;
        browserSetFrame(browserHistory[browserIndex]);
        updateBrowserControls();
    }

    // 打开内置页：展示浏览器视图并播放进入动画，小组件/链接区让位
    function openBuiltinPage(url) {
        var wrap = document.getElementById('qa-panel-browser');
        if (!wrap) return;
        clearTimeout(browserCloseTimer);
        browserOpen = true;
        document.body.classList.add('qa-browser-open');
        wrap.setAttribute('aria-hidden', 'false');
        applySectionsVisibility();
        // 防御：与存储同步竞态时可见性可能被旧状态覆盖，稍后再应用一次
        setTimeout(applySectionsVisibility, 120);
        // 视图已显示，按当前卡片尺寸应用窄屏移动端视口缩放
        applyMobileViewportScale();
        // 先移除再强制回流，确保连续打开时进入动画可重放
        wrap.classList.remove('qa-browser-leave');
        wrap.classList.remove('qa-browser-enter');
        void wrap.offsetWidth;
        wrap.classList.add('qa-browser-enter');
        browserNavigate(url, true);
    }

    // 关闭内置页（Home）：播放退出动画后恢复默认视图并清空历史
    function closeBuiltinView() {
        var wrap = document.getElementById('qa-panel-browser');
        if (!wrap || !browserOpen) return;
        wrap.classList.remove('qa-browser-enter');
        wrap.classList.add('qa-browser-leave');
        clearTimeout(browserCloseTimer);
        browserCloseTimer = setTimeout(function () {
            browserOpen = false;
            document.body.classList.remove('qa-browser-open');
            wrap.classList.remove('qa-browser-leave');
            wrap.setAttribute('aria-hidden', 'true');
            var frame = document.getElementById('qa-browser-frame');
            if (frame) frame.src = 'about:blank';
            var urlInput = document.getElementById('qa-browser-url');
            if (urlInput) urlInput.value = '';
            browserHistory = [];
            browserIndex = -1;
            updateBrowserControls();
            applySectionsVisibility();
        }, 200);
    }

    // ========== 应用全部外观状态 ==========

    function applySectionsVisibility() {
        var widgetsSection = document.getElementById('qa-panel-widgets');
        // 内置页打开时，小组件/链接区让位于浏览器视图
        var widgetsVisible = settings.sidePanelShowWidgets && !browserOpen;
        if (widgetsSection) widgetsSection.style.display = widgetsVisible ? '' : 'none';
        // 间距标记：小组件区可见时，它与链接卡的间距由小组件区底部内边距提供
        document.body.classList.toggle('qa-hide-widgets', !widgetsVisible);

        var sidebar = document.getElementById('quick-access-sidebar');
        var linksVisible = !!settings.sidePanelShowQuickLinks && !browserOpen;
        if (sidebar) sidebar.classList.toggle('active', linksVisible);

        var search = document.getElementById('qa-panel-search');
        if (search) search.style.display = settings.sidePanelShowSearch ? '' : 'none';

        var engines = document.getElementById('qa-engine-buttons');
        if (engines) engines.style.display = (settings.sidePanelShowSearch && settings.sidePanelShowEngineButtons) ? '' : 'none';

        // 搜索框厚度：与主页面保持一致时跟随主页面的搜索框厚度设置
        var thickness = settings.sidePanelSearchSync
            ? (settings.searchBoxHeight || 50)
            : (settings.sidePanelSearchBoxHeight || 50);
        document.body.style.setProperty('--search-box-height', thickness + 'px');

        // 高度分配标记：链接区可见时小组件区最多占 50%（链接+搜索至少占 50%）；
        // 链接区隐藏时小组件可用全部剩余高度
        document.body.classList.toggle('qa-hide-links', !linksVisible);

        // 暗色压暗壁纸开关（与主页面共用设置键 wallpaperDarkDim）
        document.body.classList.toggle('wallpaper-dim-off', !settings.wallpaperDarkDim);

        // 未配置引导卡：三个内容区全关（或正被浏览器视图让位）时显示，
        // 避免新用户打开面板看到纯白空屏
        var guide = document.getElementById('qa-guide-card');
        if (guide) {
            var anyContent = (settings.sidePanelShowWidgets || settings.sidePanelShowQuickLinks || settings.sidePanelShowSearch) && !browserOpen;
            guide.style.display = anyContent ? 'none' : 'flex';
            document.body.classList.toggle('qa-guide-show', !anyContent);
        }
    }

    function applyAll() {
        var body = document.body;
        panelOOO.settings = settings;

        // 「内置页打开」被关闭时，收起已打开的内置页，恢复默认视图
        if (!settings.sidePanelBuiltinOpen && browserOpen) {
            closeBuiltinView();
        }

        // 窄面板下启用移动端 UA（仅作用于搜索引擎域名的子帧请求）
        syncMobileUaRule();

        if (settings.dynamicBlur) {
            body.classList.add('dynamic-blur');
        } else {
            body.classList.remove('dynamic-blur');
        }

        if (settings.dynamicBlur && settings.enhancedDisplay) {
            body.classList.add('enhanced-display');
        } else {
            body.classList.remove('enhanced-display');
        }

        applyFont();
        applyColorScheme();
        applyPanelWallpaper();
        applySectionsVisibility();

        // 小组件仅在（解析后的）配置变化时重建，避免无关设置变更导致状态丢失
        var widgetsJson = JSON.stringify({ sync: settings.sidePanelWidgetsSync, w: getWidgetsSource() });
        if (widgetsJson !== lastWidgetsJson) {
            lastWidgetsJson = widgetsJson;
            renderWidgets();
        }

        renderQuickAccessSidebar();
        updateEngineButtons();
    }

    // ========== 交互 ==========

    function openLink(url) {
        try {
            if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
                chrome.tabs.create({ url: url, active: true });
                return;
            }
        } catch (e) { }
        window.open(url, '_blank');
    }

    function openMainPage(param) {
        var target;
        try {
            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
                target = chrome.runtime.getURL('main/index.html') + param;
            }
        } catch (e) { }
        if (!target) target = '../index.html' + param;
        openLink(target);
    }

    // 小组件区尺寸变化时重算缩放与行高：
    // 覆盖"面板拖拽调宽"与"设置里显隐切换小组件区"两种情况（后者尺寸从 0 恢复）
    function initWidgetScaleSync() {
        if (!window.ResizeObserver) return;
        var observer = new ResizeObserver(function () {
            syncWidgetScale();
            syncWidgetCardHeights();
        });
        var content = document.getElementById('qa-panel-content');
        if (content) observer.observe(content);
        var widgets = document.getElementById('qa-panel-widgets');
        if (widgets) observer.observe(widgets);
    }

    function initInteractions() {
        // 引导卡按钮：跳转主页面并直达「侧边栏功能」设置
        var guideBtn = document.getElementById('qa-guide-open-settings');
        if (guideBtn) guideBtn.addEventListener('click', function () { openMainPage('?openSidePanel=root'); });

        var addBtn = document.getElementById('quick-access-sidebar-add-btn');
        if (addBtn) {
            addBtn.addEventListener('click', function () {
                // 与主页面一致 → 打开主页面快速链接管理；独立配置 → 打开侧边栏的链接管理子视图
                if (settings.sidePanelQuickLinksSync) {
                    openMainPage('?openQuickLinks=1');
                } else {
                    openMainPage('?openSidePanel=quicklinks');
                }
            });
        }

        // 搜索框：同步 “/” 命令辅助 UI，回车按模式/命令/搜索分流
        var searchInput = document.getElementById('qa-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', function () {
                syncSearchAssistantUI(searchInput.value);
            });
            searchInput.addEventListener('focus', function () {
                syncSearchAssistantUI(searchInput.value);
            });

            // ArrowUp/Down 选择命令、Enter 插入命令、Esc/Backspace 退出模式（与主页面一致）
            searchInput.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') {
                    if ((commandListState && commandListState.visible) || searchCommandMode) {
                        e.preventDefault();
                        if (searchCommandMode) {
                            exitSearchCommandMode();
                        } else {
                            hideSearchCommandList();
                            searchInput.value = '';
                            syncSearchAssistantUI('');
                        }
                    }
                    return;
                }

                // 组件模式下按退格删除 chip：输入为空时才生效；
                // translate 已锁定语言对时先解锁语言对，再退格彻底退出
                if (e.key === 'Backspace' && searchCommandMode && searchInput.value === '') {
                    e.preventDefault();
                    if (searchCommandMode === 'translate' && translateSelectedPair) {
                        translateSelectedPair = null;
                        updateSearchModeChip();
                        refreshSearchDropdownPanels();
                    } else {
                        exitSearchCommandMode();
                    }
                    return;
                }

                if (commandListState && commandListState.visible) {
                    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                        e.preventDefault();
                        moveSearchCommandHighlight(e.key === 'ArrowDown' ? 1 : -1);
                        return;
                    }
                    if (e.key === 'Enter' && commandListState.highlight >= 0) {
                        e.preventDefault();
                        applySearchCommand(commandListState.items[commandListState.highlight]);
                        return;
                    }
                }

                if (e.key === 'Enter') {
                    e.preventDefault();
                    submitSearch(searchInput.value);
                }
            });
        }

        // 命令候选列表点击：套用对应命令
        var commandListEl = document.getElementById('qa-search-command-list');
        if (commandListEl) {
            commandListEl.addEventListener('click', function (e) {
                var item = e.target.closest('.search-command-item');
                if (!item) return;
                var index = parseInt(item.dataset.index, 10);
                if (commandListState && commandListState.items[index]) {
                    applySearchCommand(commandListState.items[index]);
                }
            });
        }

        // 翻译语言对 / 网址历史点击：删除按钮分流清理，行点击套用
        var historyListEl = document.getElementById('qa-translate-history-list');
        if (historyListEl) {
            historyListEl.addEventListener('click', function (e) {
                var deleteBtn = e.target.closest('.search-history-delete');
                if (deleteBtn) {
                    e.stopPropagation();
                    if (deleteBtn.dataset.kind === 'web') {
                        setWebHistory(getWebHistory().filter(function (x) {
                            return x && x.key !== deleteBtn.dataset.key;
                        }));
                    } else if (deleteBtn.dataset.kind === 'translate') {
                        setTranslateHistory(getTranslateHistory().filter(function (x) {
                            return x && x.pair !== deleteBtn.dataset.pair;
                        }));
                    }
                    refreshSearchDropdownPanels();
                    return;
                }

                var item = e.target.closest('.search-history-item');
                if (!item) return;

                if (item.dataset.key !== undefined) {
                    var entry = getWebHistory().filter(function (x) {
                        return x && x.key === item.dataset.key;
                    })[0];
                    if (entry) applyWebHistoryEntry(entry);
                } else {
                    applyTranslateHistoryPair(item.dataset.pair || '');
                }
            });
        }

        // 模式 chip 点击退出当前模式
        var modeChipEl = document.getElementById('qa-search-mode-chip');
        if (modeChipEl) {
            modeChipEl.addEventListener('click', function () {
                if (searchCommandMode) exitSearchCommandMode();
                if (searchInput) searchInput.focus();
            });
        }

        // 点击面板其它区域时收起命令列表
        document.addEventListener('click', function (e) {
            var container = document.getElementById('qa-search-command-container');
            if (!container) return;
            if (!container.contains(e.target) && (!searchInput || !searchInput.contains(e.target))) {
                hideSearchCommandList();
            }
        });

        // 内置页浏览器操作控件：Home（返回默认视图）/ Back / Next / 网址栏
        var browserHomeBtn = document.getElementById('qa-browser-home');
        if (browserHomeBtn) browserHomeBtn.addEventListener('click', closeBuiltinView);
        var browserBackBtn = document.getElementById('qa-browser-back');
        if (browserBackBtn) browserBackBtn.addEventListener('click', browserBack);
        var browserForwardBtn = document.getElementById('qa-browser-forward');
        if (browserForwardBtn) browserForwardBtn.addEventListener('click', browserForward);
        var browserUrlInput = document.getElementById('qa-browser-url');
        if (browserUrlInput) {
            browserUrlInput.addEventListener('keydown', function (e) {
                if (e.key !== 'Enter') return;
                var target = resolveBrowserTarget(browserUrlInput.value);
                if (!target) return;
                browserNavigate(target, true);
                browserUrlInput.blur();
            });
        }

        // 引擎切换按钮
        var googleBtn = document.getElementById('qa-google-engine');
        var bingBtn = document.getElementById('qa-bing-engine');
        if (googleBtn) {
            googleBtn.addEventListener('click', function () {
                currentEngine = 'google';
                localStorage.setItem('oooSidePanelEngine', 'google');
                updateEngineButtons();
            });
        }
        if (bingBtn) {
            bingBtn.addEventListener('click', function () {
                currentEngine = 'bing';
                localStorage.setItem('oooSidePanelEngine', 'bing');
                updateEngineButtons();
            });
        }

        // 深色模式切换时重新应用配色（与主页面行为一致）
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
            isDarkMode = e.matches;
            applyColorScheme();
        });

        // 触发重渲染的门控键表：与主页面共用 storage-sync.js（Stage 9）。
        // 自己的回写与无关键（小组件数据等）的变化仍被跳过，不会产生同步风暴。

        var syncTimer = null;
        var pendingSyncValue = null;

        function isSyncRelevant(next) {
            return SYNC_KEYS.some(function (key) {
                return JSON.stringify(next[key]) !== JSON.stringify(settings[key]);
            });
        }

        // 主页面设置变更时实时同步
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
            chrome.storage.onChanged.addListener(function (changes, areaName) {
                if (areaName !== 'local' || !changes.oooInterfaceSettings) return;
                var next = changes.oooInterfaceSettings.newValue;
                if (!next || !isSyncRelevant(next)) return;

                pendingSyncValue = next;
                clearTimeout(syncTimer);
                syncTimer = setTimeout(function () {
                    settings = mergeSettings(pendingSyncValue);
                                applyAll();
                }, 150);
            });
        }
    }

    // ========== 启动 ==========

    async function start() {
        try {
            await loadSettings();
            await loadCustomFonts();
        } catch (error) {
            // 设置加载失败时使用默认设置渲染，保证面板不至于空白
            console.error('侧边栏面板: 设置加载失败，使用默认设置:', error);
            settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
            panelOOO.settings = settings;
        }
        applyAll();
        initInteractions();
        initWidgetScaleSync();
        window.addEventListener('resize', handlePanelResize);
        window.addEventListener('pagehide', removeMobileUaRule);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();

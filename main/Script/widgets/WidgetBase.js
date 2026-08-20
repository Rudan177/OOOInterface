/**
 * OOOInterface 小组件基类
 * 所有小组件继承此基类，实现 render() 与 destroy()
 */
class WidgetBase {
    /**
     * @param {Object} config 小组件配置
     * @param {string} config.id 唯一 ID
     * @param {string} config.type 类型：clock/weather/tasks/ai-agent/email/audio
     * @param {string} config.size 尺寸：square/rectangle
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
    setInterval(fn, ms) {
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

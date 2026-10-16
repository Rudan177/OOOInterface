// ⚠️ 本文件由 tools/build.js 自动生成，请勿直接编辑。
// 源码指纹: 03d2e42f782974c6    模块数: 47
// 入口: main/Script/core/main.js
// 源码仍在 main/Script/core/** 按 mixin 拆分维护；改完源码后重新构建：
//     node tools/build.js          （或 node tools/build.js --watch）
// ==== main/Script/core/color.js ====
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

// ==== main/Script/core/first-paint.js ====
// 「什么时候才起跑」的调度点。这里只决定**起跑时刻**：
// 请求发出之后，成功回填、去重守卫、重设图层这些逻辑一概不碰。

// ---------------------------------------------------------------------------
// afterLoad —— 给「在线高清版探测」用
//
// 为什么需要它：Image() 是文档资源的一部分。只要它在 load 之前开始加载，
// 就会把 window.load 一起拖到它下完为止。
//
// 而这些「在线版」全都指向国内访问很慢的 GitHub Pages。实测（冷启动，禁缓存）：
//   · 默认壁纸的在线版 images/back.png（3.7MB）下完要 3.6 秒
//   · 在线 logo images/dll.png（2MB）下完要 1.9 秒
// 于是 —— 页面 130ms 就画完了，标签页却要转 3 秒圈。把 GitHub Pages 整个拦掉，
// load 立刻从 3270ms 掉到 504ms；再拦掉 Google 字体，198ms。
//
// 关键：本地那份（images/back.png 3.7MB、images/dll.png 105KB）就在扩展里、
// 已经在显示，在线版纯粹是「有没有高清版」的升级。没有任何理由让它决定 load 时刻。
//
// 判据是「load 之后再开始」，不是「首屏之后再开始」—— 这两件事实测差 3 秒。
const LOAD_FALLBACK_MS = 5000;

function afterLoad(fn) {
    if (typeof fn !== 'function') {
        // 无参用法是一个「等到 load 之后」的 await 点：await afterLoad();
        return new Promise((resolve) => afterLoad(resolve));
    }
    let done = false;
    const run = () => {
        if (done) return;
        done = true;
        fn();
    };
    if (document.readyState === 'complete') {
        run();
        return;
    }
    window.addEventListener('load', run, { once: true });
    // 兜底：万一 load 被别的挂死连接卡住，别让在线版这一整轮永远不升级。
    // 走到这里时 load 早就不是这几张图拖的了，再晚一点不会让观感更差。
    setTimeout(run, LOAD_FALLBACK_MS);
}

// ---------------------------------------------------------------------------
// afterFirstPaint —— 给「不拖 load、但会和首屏抢带宽」的请求用（如公告 json 的 fetch）
//
// 两次 rAF：第一次 rAF 的回调在第一帧绘制前跑，套两层才保证第一帧已经画完。
//
// 但 rAF 只在页面可见时才跑，所以它有两条退路，缺一不可：
//   ① 调用时页面本来就是隐藏的（后台标签页、会话恢复里被冻结的页面）——
//      没有绘制可保护，也就没什么可等的，直接立刻执行；
//   ② 调用时可见、之后被藏起来 —— rAF 停了，靠 setTimeout 兜底。
// 兜底值不能定太宽：会一路走到兜底的那次调用，恰恰是「用户正在等」的那一次，
// 800ms 意味着切回标签页时壁纸/公告还没开始请求，看起来就是「卡了一下」。
const FALLBACK_MS = 200;

function afterFirstPaint(fn) {
    if (typeof fn !== 'function') {
        // 无参用法是一个「等到首屏之后」的 await 点：await afterFirstPaint();
        return new Promise((resolve) => afterFirstPaint(resolve));
    }
    let done = false;
    const run = () => {
        if (done) return;
        done = true;
        fn();
    };
    if (document.visibilityState === 'hidden') {
        run();
        return;
    }
    requestAnimationFrame(() => requestAnimationFrame(run));
    setTimeout(run, FALLBACK_MS);
}

// ---------------------------------------------------------------------------
// afterIdle —— 只在浏览器真的空下来之后才跑。
//
// 给「一次性、可以等、但一跑就要解码几十 MB 图」的维护性任务用：它只是「让以后变快」，
// 不该和首屏、也不该和用户刚打开页面那几秒抢主线程。requestIdleCallback 的 timeout
// 是兜底：页面一直忙（或标签页在后台、根本不产生空闲帧）时也保证最终会跑。
function afterIdle(fn, timeoutMs) {
    if (typeof fn !== 'function') {
        return new Promise((resolve) => afterIdle(resolve, timeoutMs));
    }
    if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(() => fn(), { timeout: timeoutMs || 4000 });
        return;
    }
    setTimeout(fn, 1000);
}

// ==== main/Script/core/info.js ====
// [bundled] import { … } from './color.js'
// [bundled] import { … } from './first-paint.js'

class InfoManager {
    constructor(app) {
        this.app = app;
        this.infoContainer = null;
        this.infoIndicator = null;
        this._infoIframeClosed = false;
        this._infoIframeHasContent = false;
        this._infoIframeLoadTimeout = null;
        this._infoHoverInitialized = false;
        this._closeBtnInitialized = false;
    }

    init() {
        this.infoContainer = document.getElementById('infoContainer');
        this.infoIndicator = document.getElementById('info-indicator');

        if (this.infoContainer) {
            this.setupInfoContainer();
        }
    }

    setupInfoContainer() {
        if (this._closeBtnInitialized) return;
        this._closeBtnInitialized = true;

        const closeBtn = this.infoContainer.querySelector('.info-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.hideInfoContainer();
            });
        }

        const scrollableContent = this.infoContainer.querySelector('.scrollable-content');
        if (scrollableContent) {
            scrollableContent.addEventListener('wheel', function (e) {
                e.preventDefault();
                e.stopPropagation();
                scrollableContent.scrollLeft += e.deltaY || e.deltaX;
            });
        }

        this.infoContainer.addEventListener('wheel', (e) => {
            e.stopPropagation();
        });
    }

    async applyHideInfoPopup() {
        if (!this.infoContainer || !this.infoIndicator) return;

        if (this.app.isHideInfoPopupActive()) {
            this.infoContainer.style.display = 'none';
            this.infoContainer.style.opacity = '0';
            this.infoContainer.style.pointerEvents = 'none';
            if (this.infoIndicator) this.infoIndicator.classList.remove('visible');
            return;
        }

        this._infoIframeClosed = false;
        this._infoIframeHasContent = false;

        this.infoContainer.style.opacity = '';
        this.infoContainer.style.pointerEvents = '';

        await this.loadInfoContent();

        if (this.infoIndicator) {
            this.infoIndicator.classList.remove('visible');
        }
        this.infoContainer.classList.add('has-content');

        this.initInfoPopupHover();

        clearTimeout(this._infoIframeLoadTimeout);
        this._infoIframeLoadTimeout = setTimeout(() => {
            if (!this._infoIframeClosed && !this._infoIframeHasContent) {
                if (this.infoIndicator) {
                    this.infoIndicator.classList.add('visible');
                }
                this.updateInfoIndicatorColor();
            }
        }, 1500);
    }

    async loadInfoContent() {
        const remoteUrl = 'https://rudan177.github.io/OOOInterface/info/info-interface-5.3.json';

        // 公告 json 是「锦上添花」，不挡界面。起跑推到首屏之后，别和首屏抢连接。
        // 后面读 response / 隐藏容器 / 填内容的分支一律不动。
        await afterFirstPaint();

        try {
            const response = await fetch(remoteUrl + '?t=' + Date.now());
            if (!response.ok) {
                this.hideInfoContainer();
                return;
            }

            const config = await response.json();
            const titleEmpty = !config.title || config.title.trim() === '';
            const linkEmpty = !config.link || config.link.trim() === '';
            const textEmpty = !config.text || config.text.trim() === '';

            if (titleEmpty && linkEmpty && textEmpty) {
                this.hideInfoContainer();
                return;
            }

            const h1Element = this.infoContainer.querySelector('h1');
            const spanElement = this.infoContainer.querySelector('p span');
            const dividers = this.infoContainer.querySelectorAll('.info-divider');

            if (h1Element && config.title) {
                h1Element.textContent = config.title;
                h1Element.style.display = '';
            } else if (h1Element) {
                h1Element.style.display = 'none';
            }

            if (spanElement && config.text) {
                if (config.link) {
                    // 远程 JSON 内容不可信：用 DOM API 构建链接避免 XSS，
                    // 且仅允许 http/https 协议，防止 javascript: 等危险链接
                    spanElement.textContent = '';
                    const trimmedLink = config.link.trim();
                    const isSafeLink = /^https?:\/\//i.test(trimmedLink);
                    if (isSafeLink) {
                        const linkEl = document.createElement('a');
                        linkEl.href = trimmedLink;
                        linkEl.target = '_blank';
                        linkEl.rel = 'noopener noreferrer';
                        linkEl.textContent = config.text;
                        spanElement.appendChild(linkEl);
                    } else {
                        spanElement.textContent = config.text;
                    }
                } else {
                    spanElement.textContent = config.text;
                }
                this.infoContainer.querySelector('.scrollable-content').style.display = '';
            } else if (spanElement) {
                spanElement.textContent = '';
                this.infoContainer.querySelector('.scrollable-content').style.display = 'none';
            }

            if (dividers[0]) {
                dividers[0].style.display = (!titleEmpty && !textEmpty) ? '' : 'none';
            }
            if (dividers[1]) {
                dividers[1].style.display = !textEmpty ? '' : 'none';
            }

        } catch (e) {
            this.hideInfoContainer();
        }
    }

    showInfoContainer() {
        if (!this.infoContainer) return;
        this.infoContainer.classList.add('show');
    }

    hideInfoContainer() {
        if (!this.infoContainer) return;
        this.infoContainer.classList.remove('show');
        this._infoIframeClosed = true;
        this._infoIframeHasContent = true;
    }

    updateInfoIndicatorColor() {
        if (!this.infoIndicator) return;

        const isVisible = this.infoIndicator.classList.contains('visible');
        this.infoIndicator.className = 'info-indicator';
        if (isVisible) this.infoIndicator.classList.add('visible');

        const colorScheme = this.app.settings.colorScheme || 'green';
        if (colorScheme === 'custom') {
            const customColors = {
                primaryColor: this.app.settings.customPrimaryColor || '#1a73e8',
                secondaryColor: this.app.settings.customSecondaryColor || '',
                gradientEnabled: this.app.settings.customGradientEnabled || false
            };
            const config = getColorConfig('custom', customColors);
            this.infoIndicator.classList.add('custom');
            this.infoIndicator.style.backgroundColor = config.accent;
        } else {
            const colorClass = getColorConfig(colorScheme).infoClass;
            this.infoIndicator.classList.add(colorClass);
            this.infoIndicator.style.backgroundColor = '';
        }
    }

    refreshInfoIndicator() {
        if (!this.infoContainer || !this.infoIndicator) return;

        if (this.app.isHideInfoPopupActive()) {
            this.infoIndicator.classList.remove('visible');
            return;
        }

        if (this._infoIframeClosed) {
            this.infoIndicator.classList.remove('visible');
            return;
        }

        this.infoIndicator.classList.add('visible');
        this.updateInfoIndicatorColor();
    }

    initInfoPopupHover() {
        const badge = document.getElementById('ooo-badge');

        if (!badge || !this.infoContainer) return;

        if (this._infoHoverInitialized) return;
        this._infoHoverInitialized = true;

        let hoverTimeout = null;
        let hideTimeout = null;
        let isHoveringBadge = false;
        let isHoveringInfo = false;

        const showInfo = () => {
            if (this._infoIframeClosed) return;
            clearTimeout(hideTimeout);
            hoverTimeout = setTimeout(() => {
                if (this.infoContainer.classList.contains('has-content')) {
                    this.infoContainer.classList.add('show');
                }
            }, 200);
        };

        const hideInfo = () => {
            clearTimeout(hoverTimeout);
            hideTimeout = setTimeout(() => {
                if (!isHoveringBadge && !isHoveringInfo) {
                    this.infoContainer.classList.remove('show');
                }
            }, 100);
        };

        badge.addEventListener('mouseenter', () => {
            isHoveringBadge = true;
            showInfo();
        });

        badge.addEventListener('mouseleave', () => {
            isHoveringBadge = false;
            hideInfo();
        });

        this.infoContainer.addEventListener('mouseenter', () => {
            isHoveringInfo = true;
            clearTimeout(hideTimeout);
        });

        this.infoContainer.addEventListener('mouseleave', () => {
            isHoveringInfo = false;
            hideInfo();
        });

        const closeBtn = this.infoContainer.querySelector('.info-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this._infoIframeClosed = true;
                this.infoContainer.classList.remove('show');
                this.infoContainer.style.display = 'none';
                if (this.infoIndicator) this.infoIndicator.classList.remove('visible');
                this.refreshInfoIndicator();
            });
        }
    }
}

// ==== main/Script/core/settings-defaults.js ====
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

// ==== main/Script/core/script.js ====
'use strict';

// 核心类仍直接使用：init 中创建 InfoManager
// [bundled] import { … } from './info.js'
// 出厂默认设置与侧边栏面板共用同一来源（Stage 9）
// [bundled] import { … } from './settings-defaults.js'

class OOOInterface {
    constructor() {
        // 在线图标URL配置
        this.onlineIcons = {
            'dll.png': 'https://rudan177.github.io/OOOInterface/images/dll.png',
            'dln.png': 'https://rudan177.github.io/OOOInterface/images/dln.png'
        };
        this.onlineBackgroundUrl = 'https://rudan177.github.io/OOOInterface/images/back.png';
        this.localBackgroundUrl = 'images/back.png';
        // OCP 音源：铭牌音效与播控共用，播控的封面/曲名/艺术家也读取自该文件
        this.ocpAudioUrl = 'https://rudan177.github.io/OOOInterface/images/wow.mp3';
        // 点击播控封面后打开的在线播放器
        this.ocpPlayerUrl = 'https://rudan177.github.io/CHAPTER/player.html';
        this.iconLoadStatus = {};

        // 出厂预设配置（与侧边栏面板共用 settings-defaults.js 中的唯一来源）
        // 深拷贝一份挂在实例上：下面的 Object.assign({}, this.defaultSettings, …)
        // 是浅合并，若直接引用共享对象，其嵌套对象可能被间接改写并污染另一个页面。
        this.defaultSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));

        this.currentEngine = 'google';
        this.settings = JSON.parse(JSON.stringify(this.defaultSettings)); // 深拷贝默认设置
        this.isBadgeExpanded = false;
        this.isScrolled = false;
        this.scrollTimeout = null;
        this.isAnimating = false;
        this.infoPopupOpen = false;
        this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.isFirstRun = true;
        this.userChangedLogo = false; // 标记用户是否手动更改过Logo
        this.modalScrollHandler = null;
        this.backendConnected = false; // OUA 后端连接状态，通过 localStorage 与 about.js 同步
        this.currentVersion = VERSION; // 使用 version.js 中的版本号
        this._sidebarPushing = false; // 侧边栏壁纸推入状态
        this.statusBarTimer = null;
        // 热搜词建议：防抖计时器 + 请求序号 + 结果缓存
        this.suggestDebounceTimer = null;
        this._suggestSeq = 0;
        this._suggestCache = null;
        this.statusBarContrastMode = 'dark';
        this.wallpaperAnalysisImage = null;
        this.wallpaperAnalysisUrl = null;
        this.wallpaperAnalysisPromise = null;

        // “/” 命令列表状态
        this.commandListState = { visible: false, items: [], highlight: -1 };

        // 搜索框组件模式：null | 'web' | 'translate'；translate 下已锁定的语言对
        this.searchCommandMode = null;
        this.translateSelectedPair = null;

        // 壁纸填充层
        this.wallpaperBlur = null;
        this.wallpaperMain = null;
        // 壁纸本地版 → 在线版的升级记录与在途探测（见 WallpaperMixin.probeOnlineWallpaper）
        this.onlineWallpaperMap = {};
        this._onlineWallpaperProbes = {};

        // 主题系统状态
        this.themes = {};           // { key: themeObject }
        this.themeOverrides = null; // { logo, font, wallpaper } 当前主题的覆盖配置
        this.builtinThemeKeys = new Set(); // themes.json 中登记的内置主题 key

        this.init();
    }

    async init() {
        await this.loadSettings();

        if (this.settings.engineLocked) {
            const savedEngine = localStorage.getItem('oooEngineLocked');
            if (savedEngine === 'google' || savedEngine === 'bing') {
                this.currentEngine = savedEngine;
            }
        }

        this.createWallpaperLayers();

        this.preloadWallpaper();

        // 首屏外观抢在几个 await 前面：这几项只依赖 this.settings（chrome.storage 已经读回来了），
        // 与自定义字体文件、主题文件都无关。实测热刷新时首屏 108ms 就出来了，
        // 而配色/侧边栏要等到 303ms（排在 loadCustomFonts/loadThemes 之后）——
        // 中间那段是「先默认外观、后变对」。先应用一次就没了。
        // 主题启用时 loadThemes() 末尾仍会按主题覆盖一遍（顺序与改动前一致，只是间隔变短）。
        // 不提前 applyFont：自定义字体的 FontFace 要等 loadCustomFonts() 才注册，
        // 提前设 font-family 只会先落回退字体、字体到位后再跳一下。
        // 放在 createWallpaperLayers() 之后：handlePersistentWallpaperToggle() 会调 applyWallpaper()，
        // 那时图层必须已经存在。
        this.applyColorScheme();
        this.syncSidebarFixedState();
        this.handlePersistentWallpaperToggle();

        // 存量壁纸的一次性重编码。自己挂 afterLoad，不占首屏；首屏之后才问、
        // 才一条一条地跑（见 WallpaperMixin.maybeShrinkStoredWallpapers）。
        this.maybeShrinkStoredWallpapers();

        this.initCustomSelect();

        this.initContextMenu();

        this.initAdvancedVisualEffects();

        this.infoManager = new InfoManager(this);
        this.infoManager.init();

        this.bindEvents();
        this.setupMouseScroll();

        await this.loadCustomFonts();

        this.updateCustomFontsList();

        this.updateCustomWallpapersList();

        this.initQuickAccessSidebar();

        this.initWidgetPanel();

        // 先加载主题列表（含用户导入的自定义主题），再应用外观设置，
        // 确保页面刷新后主题在首屏渲染前即恢复，避免出现默认外观闪动
        await this.loadThemes();

        try {
            this.applySettings();
        } catch (error) {
            console.error('初始化应用设置失败:', error);
        }

        this.updateCustomSchemeDropdownDots();

        this.updateDeveloperModeUI();

        if (this.settings.wallpaper === 'bing') {
            this.checkAndFetchBingWallpaper();
        }

        // 这里原本调 primeWallpaperEffects()：临时给 body 加 scrolled+dynamic-blur 一帧，
        // 逼浏览器先把动态模糊控件的 backdrop-filter 光栅化一次，免得第一次进壁纸模式卡一下。
        // 但 body.scrolled .container 的 padding-top 是 calc(100dvh - 145px)（styles.css:6477），
        // 于是这一帧搜索框瞬移到屏底、logo 胶囊消失，下一帧再弹回来 —— 实测合成帧在
        // 705ms 与 735ms 两次全屏变化就是这个，肉眼就是「莫名其妙闪一下壁纸模式」。
        // 以前首屏被 Google Fonts 的 <link> 堵着，这一帧发生在首帧之前所以看不见；
        // 字体改成异步之后首屏 196ms 就画出来了，预热帧落在 ~700ms，就露出来了。
        // 预热和「早出画面」构造上无法共存，取早出画面：删掉预热。代价是第一次进
        // 壁纸模式时那几个玻璃控件要现光栅化一次（一次性），远小于每次新标签页都闪一下。

        // 注册跨上下文设置同步（侧边栏面板 ⇄ 主页面），并处理面板跳转参数
        this.setupSettingsSync();
        this.handleOpenQuickLinksParam();

        // 自动聚焦搜索框，解决浏览器新标签页地址栏抢焦点的问题
        setTimeout(() => {
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }, 100);

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            this.isDarkMode = e.matches;
            this.applyLogo();
            this.applyColorScheme();
            this.updateStatusBarTextContrast();
        });

        window.addEventListener('resize', () => {
            this.updateStatusBarTextContrast();
            this.syncWidgetCardHeights();
            if (document.getElementById('settings-modal').style.display === 'flex') {
                this.updateSettingsButtonsPosition();
            }
        });

        let badgeClickCount = 0;
        const badge = document.getElementById('ooo-badge');
        if (badge) {
            badge.addEventListener('click', () => {
                if (this.settings.dynamicBlur) {
                    badge.classList.remove('badge-bounce');
                    void badge.offsetWidth;
                    badge.classList.add('badge-bounce');
                }

                badgeClickCount++;
                if (badgeClickCount >= 10) {
                    this.showInfoPopup();
                    badgeClickCount = 0;
                }
            });
        }

    }





















    bindEvents() {
        // 欢迎界面关闭按钮
        const welcomeCloseBtn = document.getElementById('welcome-close');
        if (welcomeCloseBtn) {
            welcomeCloseBtn.addEventListener('click', () => this.hideWelcomeScreen());
        }

        // 搜索引擎切换
        document.getElementById('google-engine').addEventListener('click', () => this.switchEngine('google'));
        document.getElementById('bing-engine').addEventListener('click', () => this.switchEngine('bing'));

        // Google按钮右键事件 - 手气不错功能
        document.getElementById('google-engine').addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.performGoogleLucky();
        });

        // 状态栏双击事件 - 切换显示秒钟
        const statusBarEl = document.getElementById('status-bar');
        if (statusBarEl) {
            statusBarEl.addEventListener('dblclick', () => {
                this.settings.showStatusBarSeconds = !this.settings.showStatusBarSeconds;
                this.saveSettings();
                const showSecondsToggle = document.getElementById('show-seconds-toggle');
                if (showSecondsToggle) showSecondsToggle.checked = this.settings.showStatusBarSeconds;
                if (this.settings.statusBarEnabled) {
                    this.updateStatusBarText();
                    this.startStatusBarTimer();
                }
                this.showNotification(this.settings.showStatusBarSeconds ? '显示秒钟：开启' : '显示秒钟：关闭');
            });
        }

        // 搜索功能
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(searchInput.value);
            }
        });

        // “/” 命令列表键盘导航（ArrowUp/Down 选择、Enter 插入命令、Esc/Backspace 删除模式 chip）
        // 注意：在拦截 Enter 时必须 preventDefault，否则随后的 keypress 仍会触发 performSearch
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const chipActive = !!this.searchCommandMode;
                if ((this.commandListState && this.commandListState.visible) || chipActive) {
                    e.preventDefault();
                    if (this.searchCommandMode) {
                        this.exitSearchCommandMode();
                    } else {
                        this.hideSearchCommandList();
                        searchInput.value = '';
                        this.syncSearchAssistantUI('');
                    }
                }
                return;
            }
            // 组件模式下按退格删除椭圆：输入为空时才生效；
            // translate 已锁定语言对时先解锁语言对，再退格彻底退出
            if (e.key === 'Backspace' && this.searchCommandMode && searchInput.value === '') {
                e.preventDefault();
                if (this.searchCommandMode === 'translate' && this.translateSelectedPair) {
                    this.translateSelectedPair = null;
                    this.updateSearchModeChip();
                    this.refreshSearchDropdownPanels();
                } else {
                    this.exitSearchCommandMode();
                }
                return;
            }
            if (!this.commandListState || !this.commandListState.visible) return;
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                this.moveSearchCommandHighlight(e.key === 'ArrowDown' ? 1 : -1);
                return;
            }
            if (e.key === 'Enter' && this.commandListState.highlight >= 0) {
                e.preventDefault();
                this.applySearchCommand(this.commandListState.items[this.commandListState.highlight]);
            }
        });

        // 搜索历史相关事件
        const searchHistoryContainer = document.getElementById('search-history-container');
        const searchHistoryList = document.querySelector('.search-history-list');

        searchInput.addEventListener('focus', () => {
            this.syncSearchAssistantUI(searchInput.value);
            const clearBtn = document.querySelector('.search-clear-btn');
            if (clearBtn) {
                clearBtn.style.display = searchInput.value.length > 0 ? 'flex' : 'none';
            }
        });

        searchInput.addEventListener('input', () => {
            this.syncSearchAssistantUI(searchInput.value);
            const clearBtn = document.querySelector('.search-clear-btn');
            if (clearBtn) {
                clearBtn.style.display = searchInput.value.length > 0 ? 'flex' : 'none';
            }
        });

        const searchClearBtn = document.querySelector('.search-clear-btn');
        if (searchClearBtn) {
            searchClearBtn.addEventListener('click', () => {
                if (this.searchCommandMode) {
                    this.exitSearchCommandMode();
                } else {
                    searchInput.value = '';
                    searchClearBtn.style.display = 'none';
                    this.syncSearchAssistantUI('');
                }
                searchInput.focus();
            });
        }

        document.addEventListener('click', (e) => {
            if (!searchHistoryContainer.contains(e.target) && !searchInput.contains(e.target)) {
                this.hideSearchHistory();
            }
            const commandContainer = document.getElementById('search-command-container');
            if (commandContainer && !commandContainer.contains(e.target) && !searchInput.contains(e.target)) {
                this.hideSearchCommandList();
            }
        });

        searchHistoryList.addEventListener('click', (e) => {
            // 删除按钮优先处理,避免命中同一行时误触发搜索
            const deleteBtn = e.target.closest('.search-history-delete');
            if (deleteBtn) {
                e.stopPropagation();
                const searchQuery = deleteBtn.dataset.query;
                if (searchQuery) {
                    this.removeFromSearchHistory(searchQuery);
                }
                return;
            }

            // 历史行与热搜行均保留 search-history-item + data-query,统一回填搜索框并搜索
            const item = e.target.closest('.search-history-item');
            if (item) {
                const searchQuery = item.dataset.query;
                if (searchQuery) {
                    searchInput.value = searchQuery;
                    this.performSearch(searchQuery);
                }
            }
        });

        // 阻止搜索历史框内的滚轮事件冒泡到window，避免触发壁纸模式
        searchHistoryContainer.addEventListener('wheel', (e) => {
            e.stopPropagation();
        });

        // “/” 命令列表 / 翻译语言历史 点击事件
        const searchCommandList = document.querySelector('.search-command-list');
        if (searchCommandList) {
            searchCommandList.addEventListener('click', (e) => {
                const item = e.target.closest('.search-command-item');
                if (!item) return;
                const index = parseInt(item.dataset.index, 10);
                if (this.commandListState && this.commandListState.items[index]) {
                    this.applySearchCommand(this.commandListState.items[index]);
                }
            });

            document.getElementById('search-command-container').addEventListener('wheel', (e) => {
                e.stopPropagation();
            });
        }

        const translateHistoryList = document.querySelector('.translate-history-list');
        if (translateHistoryList) {
            translateHistoryList.addEventListener('click', (e) => {
                // 删除按钮：按 kind 分流清理对应存储，然后刷新面板
                const deleteBtn = e.target.closest('.search-history-delete');
                if (deleteBtn) {
                    e.stopPropagation();
                    if (deleteBtn.dataset.kind === 'web') {
                        this.setWebHistory(this.getWebHistory().filter(x => x && x.key !== deleteBtn.dataset.key));
                    } else if (deleteBtn.dataset.kind === 'translate') {
                        this.setTranslateHistory(this.getTranslateHistory().filter(x => x && x.pair !== deleteBtn.dataset.pair));
                    }
                    this.refreshSearchDropdownPanels();
                    return;
                }

                // 行点击：web 按 key 回填网址；translate 套用语言对
                const item = e.target.closest('.search-history-item');
                if (!item) return;

                if (item.dataset.key !== undefined) {
                    const entry = this.getWebHistory().find(x => x && x.key === item.dataset.key);
                    if (entry) {
                        this.applyWebHistoryEntry(entry);
                    }
                } else {
                    this.applyTranslateHistoryPair(item.dataset.pair || '');
                }
            });
        }

        // 模式 chip 点击退出当前模式
        const modeChip = document.getElementById('search-mode-chip');
        if (modeChip) {
            modeChip.addEventListener('click', () => {
                if (this.searchCommandMode) {
                    this.exitSearchCommandMode();
                    this.showNotification('已退出模式');
                }
                searchInput.focus();
            });
        }

        // 铭牌点击事件 - 已在 setupBadgeOpenMethod() 中处理

        // 设置弹窗事件
        document.getElementById('close-modal').addEventListener('click', () => this.closeSettings());
        document.getElementById('export-settings-btn').addEventListener('click', () => this.exportSettingsAsMarkdown());
        document.getElementById('import-settings-btn').addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.md,text/markdown';
            input.addEventListener('change', () => {
                const file = input.files && input.files[0];
                if (!file) return;
                this.importSettingsFromMarkdown(file);
            });
            input.click();
        });
        document.getElementById('back-right-panel').addEventListener('click', () => {
            const rpu = document.getElementById('right-panel-upper');
            if (rpu && rpu.dataset.subView === 'customize-items') {
                this.backToContextMenuStyleView(rpu);
            } else if (rpu && (rpu.dataset.subView === 'quick-link-add' || rpu.dataset.subView === 'quick-link-edit')) {
                const container = rpu.querySelector('.settings-menu-container');
                if (container && container._qlinput) {
                    this.hideQuickLinksAddInterface(container, container._qlinput, container._qllist, container._qlbtn);
                }
            } else if (rpu && rpu.dataset.subView === 'custom-color-editor') {
                this.backToCustomColorView(rpu);
            } else if (rpu && rpu.dataset.subView === 'wallpaper-badge-config') {
                // 壁纸角标配置：返回壁纸列表（不带这条会一路掉到末尾，把整个右面板关掉）
                this.backToWallpaperMenu(rpu);
            } else if (rpu && rpu.dataset.menuType === 'side-panel'
                && this._sidePanelView && this._sidePanelView !== 'root') {
                // 侧边栏功能子视图：顶部返回按钮逐级返回（子视图 → 功能根视图 → 关闭右面板）
                // 子视图向右推出、功能根视图从左推入（iOS 式 pop）
                this.panelTransition(rpu, 'pop', () => {
                    this.exitSidePanelScope();
                    this.renderSidePanelConfigView(rpu, true);
                });
            } else {
                this.confirmRightPanelChanges();
                this.closeSettingsMenuInRightPanel();
            }
        });

        // ESC键关闭设置窗口
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('settings-modal');
                if (modal && modal.classList.contains('show')) {
                    if (modal.classList.contains('right-panel-open')) {
                        const rpu = document.getElementById('right-panel-upper');
                        if (rpu && rpu.dataset.subView === 'customize-items') {
                            this.backToContextMenuStyleView(rpu);
                        } else if (rpu && (rpu.dataset.subView === 'quick-link-add' || rpu.dataset.subView === 'quick-link-edit')) {
                            const container = rpu.querySelector('.settings-menu-container');
                            if (container && container._qlinput) {
                                this.hideQuickLinksAddInterface(container, container._qlinput, container._qllist, container._qlbtn);
                            }
                        } else if (rpu && (rpu.dataset.subView === 'widget-config' || rpu.dataset.subView === 'widget-type-picker')) {
                            // 小组件编辑/添加表单：ESC 返回列表（带滑出动画）
                            const listContainer = rpu.querySelector('.widget-panel-list-container');
                            if (listContainer) {
                                this.exitWidgetFormView(listContainer, () => {
                                    this.restoreWidgetPanelButtons();
                                    this.updateWidgetPanelListInMenu(listContainer);
                                });
                            }
                        } else if (rpu && rpu.dataset.subView === 'custom-color-editor') {
                            this.backToCustomColorView(rpu);
                        } else if (rpu && rpu.dataset.subView === 'wallpaper-badge-config') {
                            this.backToWallpaperMenu(rpu);
                        } else if (rpu && rpu.dataset.menuType === 'side-panel'
                            && this._sidePanelView && this._sidePanelView !== 'root') {
                            // 侧边栏功能子视图：逐级返回（子视图 → 功能根视图），同顶部返回按钮
                            this.panelTransition(rpu, 'pop', () => {
                                this.exitSidePanelScope();
                                this.renderSidePanelConfigView(rpu, true);
                            });
                        } else if (rpu) {
                            this.confirmRightPanelChanges();
                            this.closeSettingsMenuInRightPanel();
                        }
                    } else {
                        this.closeSettings();
                    }
                }
            }
        });

        document.getElementById('font-select').addEventListener('change', (e) => this.changeFont(e.target.value));
        document.getElementById('logo-select').addEventListener('change', (e) => this.handleLogoSelectChange(e.target.value));

        // 字体文件上传事件
        document.getElementById('font-upload').addEventListener('change', (e) => {
            this.handleFontUpload(e.target.files[0]);
            e.target.value = '';
        });

        // 主题文件上传事件
        document.getElementById('theme-upload').addEventListener('change', (e) => {
            this.handleThemeUpload(e.target.files[0]);
            e.target.value = '';
        });

        // 主题选择 change 事件：兜底应用主题（正常流程由下拉项直接调用 applyTheme）
        document.getElementById('theme-select').addEventListener('change', (e) => {
            if (e.target.value && this.themes[e.target.value]) {
                this.applyTheme(e.target.value);
            }
        });

        // Logo文件上传事件
        document.getElementById('logo-upload').addEventListener('change', (e) => {
            this.handleLogoUpload(e.target.files[0]);
        });

        // 暗色Logo文件上传事件
        document.getElementById('dark-logo-upload').addEventListener('change', (e) => {
            this.handleDarkLogoUpload(e.target.files[0]);
        });

        // 壁纸选择事件
        document.getElementById('wallpaper-select').addEventListener('change', (e) => {
            this.changeWallpaper(e.target.value);
        });

        // 壁纸文件上传事件
        document.getElementById('wallpaper-upload').addEventListener('change', (e) => {
            this.handleWallpaperUpload(e.target.files[0]);
        });

        // URL壁纸由右侧面板处理，此处无需事件绑定

        // 必应壁纸信息提示图标点击事件
        const bingInfoIcon = document.getElementById('bing-wallpaper-info');
        if (bingInfoIcon) {
            bingInfoIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showBingTooltip();
            });
        }

        // 配色方案选择事件
        document.getElementById('color-scheme-select').addEventListener('change', (e) => {
            this.settings.colorScheme = e.target.value;
            this.checkThemeConsistency('colorScheme', e.target.value);
            this.saveSettings();
            this.applyColorScheme();
            if (!this.settings.hideNotifications) {
                this.showNotification('配色已更新');
            }
        });

        // 代理端口选择事件
        document.getElementById('proxy-select').addEventListener('change', (e) => {
            this.handleProxyChange(e.target.value);
        });

        // 动态模糊开关改变时，立即写入设置并生效，同时实时显示/隐藏增强显示开关
        // （即时提交：勾选状态不再需要等到「应用」才被读取，避免中途的 UI 同步把待应用值写回旧值）
        document.getElementById('dynamic-blur-toggle').addEventListener('change', (e) => {
            this.settings.dynamicBlur = e.target.checked;
            const enhancedDisplayGroup = document.getElementById('enhanced-display-group');
            if (enhancedDisplayGroup) {
                enhancedDisplayGroup.style.display = e.target.checked ? 'block' : 'none';
            }
            // 弹窗自身的毛玻璃外观与 openSettings 保持一致
            const modal = document.getElementById('settings-modal');
            if (modal) modal.classList.toggle('blur-effect', e.target.checked);
            this.applySettings();
            this.saveSettings();
        });

        // 增强显示复选框改变时，立即同步到 settings 并更新右键菜单
        this._enhancedDisplayChangeHandler = (e) => {
            this.settings.enhancedDisplay = e.target.checked;
            this.applySettings();
            this.saveSettings();
            this.updateContextMenuIcons();
        };
        document.getElementById('enhanced-display-toggle').addEventListener('change', this._enhancedDisplayChangeHandler);

        // 快速访问侧边栏开关改变时，立即写入设置并生效，同时显示/隐藏子开关并同步状态
        // （子开关被主开关强制关闭时不回写 showQuickLinkIcons，保留用户的图标偏好，
        //   与 updateSettingsUI 里「主开关开启时才带出偏好」的读法一致）
        document.getElementById('quick-access-sidebar-toggle').addEventListener('change', (e) => {
            this.settings.quickAccessSidebar = e.target.checked;
            const iconsGroup = document.getElementById('show-quick-icons-group');
            const iconsToggle = document.getElementById('show-quick-icons');
            if (iconsGroup && iconsToggle) {
                if (e.target.checked) {
                    iconsGroup.style.display = 'block';
                    // 恢复上次保存的状态
                    iconsToggle.checked = this.settings.showQuickLinkIcons;
                } else {
                    iconsGroup.style.display = 'none';
                    iconsToggle.checked = false;
                }
            }
            this.applyQuickLinks();
            this.saveSettings();
        });

        // 显示图标子开关：即时生效
        document.getElementById('show-quick-icons').addEventListener('change', (e) => {
            this.settings.showQuickLinkIcons = e.target.checked;
            this.applyQuickLinks();
            this.saveSettings();
        });

        // 固定侧边栏主开关改变时，立即写入设置并生效，同时显示/隐藏两个子开关并同步状态
        // （子开关被主开关强制勾选/取消只是「显示派生」，不回写 fixSidebarHomepage/fixSidebarWallpaper，
        //   这样子开关的偏好能在主开关反复开关之间保留，与 updateSettingsUI 的读法一致）
        document.getElementById('fix-sidebar-toggle').addEventListener('change', (e) => {
            this.settings.fixSidebarEnabled = e.target.checked;
            const homepageGroup = document.getElementById('fix-homepage-group');
            const wallpaperGroup = document.getElementById('fix-wallpaper-group');
            const homepageToggle = document.getElementById('fix-sidebar-homepage-toggle');
            const wallpaperToggle = document.getElementById('fix-sidebar-wallpaper-toggle');
            if (e.target.checked) {
                if (homepageGroup) homepageGroup.style.display = 'block';
                if (wallpaperGroup) wallpaperGroup.style.display = 'block';
                // 开启主开关时，子开关一并开启（连同设置项一起写回，保持勾选与设置一致）
                if (homepageToggle) homepageToggle.checked = true;
                if (wallpaperToggle) wallpaperToggle.checked = true;
                this.settings.fixSidebarHomepage = true;
                this.settings.fixSidebarWallpaper = true;
            } else {
                if (homepageGroup) homepageGroup.style.display = 'none';
                if (wallpaperGroup) wallpaperGroup.style.display = 'none';
                // 关闭主开关时，子开关一并关闭
                if (homepageToggle) homepageToggle.checked = false;
                if (wallpaperToggle) wallpaperToggle.checked = false;
            }
            this.syncSidebarFixedState();
            this.saveSettings();
        });

        // 固定侧边栏的两个子开关：即时生效，各自独立写回自己的设置项
        [['fix-sidebar-homepage-toggle', 'fixSidebarHomepage'],
         ['fix-sidebar-wallpaper-toggle', 'fixSidebarWallpaper']].forEach(([id, key]) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('change', (e) => {
                this.settings[key] = e.target.checked;
                this.syncSidebarFixedState();
                this.saveSettings();
            });
        });

        // 简洁视觉效果主开关改变时，联动全部子开关并即时生效
        // （禁止提示按默认临时7天开启，设置页内双击该子开关才为永久；程序设置 checked 不触发子开关的 change 事件）
        document.getElementById('simple-visual-toggle').addEventListener('change', (e) => {
            const checked = e.target.checked;

            this.settings.hideNotifications = checked;
            this.settings.hideInfoPopup = checked
                ? { enabled: true, type: 'temporary', timestamp: Date.now() }
                : { enabled: false, type: null, timestamp: null };
            this.settings.hiddenBadge = checked;

            this.applySettings();
            this.saveSettings();
            this.syncSettingsPageToggles();
            this.updateContextMenuIcons();
            this.showNotification(checked ? '简洁视觉效果：开启' : '简洁视觉效果：关闭');
        });

        // 隐藏弹窗子开关：立即生效
        document.getElementById('hide-notifications-toggle').addEventListener('change', (e) => {
            this.settings.hideNotifications = e.target.checked;
            this.applySettings();
            this.saveSettings();
            this.syncSettingsPageToggles();
            this.updateContextMenuIcons();
            this.showNotification(e.target.checked ? '隐藏弹窗：开启' : '隐藏弹窗：关闭');
        });

        // 隐藏铭牌子开关：立即生效
        document.getElementById('hidden-badge-toggle').addEventListener('change', (e) => {
            this.settings.hiddenBadge = e.target.checked;
            this.applySettings();
            this.saveSettings();
            this.syncSettingsPageToggles();
            this.showNotification(e.target.checked ? '隐藏铭牌：开启' : '隐藏铭牌：关闭');
        });

        // 搜索历史 / 热搜词建议 / 引擎锁定：与右键菜单里的同名开关走同一套副作用
        // （此前设置页这三个勾选只在点「应用」时才被读取，中途任何 UI 同步都会把勾选写回旧值）
        document.getElementById('search-history-toggle').addEventListener('change', (e) => {
            this.settings.searchHistory = e.target.checked;
            this.saveSettings();
            this.updateContextMenuIcons();
            this.syncSettingsPageToggles();
            this.showNotification(e.target.checked ? '搜索历史：开启' : '搜索历史：关闭');
        });

        document.getElementById('search-suggestions-toggle').addEventListener('change', (e) => {
            this.settings.searchSuggestions = e.target.checked;
            this.saveSettings();
            this.updateContextMenuIcons();
            this.syncSettingsPageToggles();
            this.showNotification(e.target.checked ? '热搜词建议：开启' : '热搜词建议：关闭');
        });

        document.getElementById('engine-lock-toggle').addEventListener('change', (e) => {
            this.setEngineLock(e.target.checked);
            this.showNotification(e.target.checked ? '引擎锁定：开启' : '引擎锁定：关闭');
        });

        // OCP 播控开关：开启后 OCP 播放过一次即可 hover 铭牌呼出播控；关闭时立即收起
        document.getElementById('ocp-player-toggle').addEventListener('change', (e) => {
            this.settings.ocpPlayerEnabled = e.target.checked;
            if (!e.target.checked) {
                this.hideOcpPlayer();
            }
            this.saveSettings();
            this.showNotification(e.target.checked ? 'OCP播控：开启' : 'OCP播控：关闭');
        });

        // 小组件列表下拉点击 → 右面板管理界面
        const widgetPanelSelectSelected = document.getElementById('widget-panel-select-selected');
        if (widgetPanelSelectSelected) {
            widgetPanelSelectSelected.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showWidgetPanelMenuInRightPanel();
            });
        }

        // 状态栏主开关改变时，立即写入设置并生效，同时显示/隐藏子开关并保留上次保存的秒钟偏好
        // （子开关被主开关强制取消勾选只是显示派生，不回写 showStatusBarSeconds）
        document.getElementById('status-bar-toggle').addEventListener('change', (e) => {
            this.settings.statusBarEnabled = e.target.checked;
            const showSecondsGroup = document.getElementById('show-seconds-group');
            const showSecondsToggle = document.getElementById('show-seconds-toggle');
            if (showSecondsGroup && showSecondsToggle) {
                if (e.target.checked) {
                    showSecondsGroup.style.display = 'block';
                    showSecondsToggle.checked = this.settings.showStatusBarSeconds;
                } else {
                    showSecondsGroup.style.display = 'none';
                    showSecondsToggle.checked = false;
                }
            }
            this.applyStatusBarSettings();
            this.saveSettings();
        });

        // 显示秒数子开关：即时生效
        document.getElementById('show-seconds-toggle').addEventListener('change', (e) => {
            this.settings.showStatusBarSeconds = e.target.checked;
            this.applyStatusBarSettings();
            this.saveSettings();
        });

        document.getElementById('shortcuts-toggle').addEventListener('change', (e) => {
            this.settings.shortcutsEnabled = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('shortcuts-hint').addEventListener('click', (e) => {
            e.stopPropagation();
            this.showShortcutsHint();
        });

        // 壁纸常显示开关改变时，立即写入设置并生效，同时实时显示/隐藏壁纸缩放开关
        document.getElementById('persistent-wallpaper-toggle').addEventListener('change', (e) => {
            this.settings.persistentWallpaper = e.target.checked;
            const wallpaperScaleGroup = document.getElementById('wallpaper-scale-group');
            if (wallpaperScaleGroup) {
                wallpaperScaleGroup.style.display = e.target.checked ? 'block' : 'none';
            }
            this.applySettings();
            this.saveSettings();
        });

        // 壁纸缩放子开关：即时生效
        document.getElementById('wallpaper-scale-toggle').addEventListener('change', (e) => {
            this.settings.wallpaperScale = e.target.checked;
            this.applySettings();
            this.saveSettings();
        });

        // 暗色压暗壁纸开关：控制暗色模式下壁纸蒙版（主页面与侧边栏面板共用设置键）
        document.getElementById('wallpaper-dim-toggle').addEventListener('change', (e) => {
            this.settings.wallpaperDarkDim = e.target.checked;
            this.applySettings();
            this.saveSettings();
        });

        // 设置文字Logo事件
        document.getElementById('set-text-logo').addEventListener('click', (e) => {
            e.stopPropagation();
            this.setTextLogo();
        });

        // 应用按钮事件
        // 注：各开关现在都是「改动即提交」，下面的读取只是兜底的再同步；需要按主开关派生的
        // 子开关一律加了守卫，避免关闭主开关后点应用把用户设置的子项偏好抹掉。
        document.getElementById('apply-settings').addEventListener('click', () => {
            try {
                this.settings.dynamicBlur = document.getElementById('dynamic-blur-toggle').checked;
                this.settings.enhancedDisplay = document.getElementById('enhanced-display-toggle').checked;
                const oldPersistentWallpaper = this.settings.persistentWallpaper;
                this.settings.persistentWallpaper = document.getElementById('persistent-wallpaper-toggle').checked;
                this.settings.wallpaperDarkDim = document.getElementById('wallpaper-dim-toggle').checked;
                this.settings.wallpaperScale = document.getElementById('wallpaper-scale-toggle').checked;
                // 读取右侧面板填满开关（如果面板打开时）
                const panelFillToggle = document.getElementById('wallpaper-fill-toggle-panel');
                if (panelFillToggle) {
                    this.settings.wallpaperFill = panelFillToggle.checked;
                }
                // 读取固定侧边栏主开关与子开关
                const fixSidebarToggle = document.getElementById('fix-sidebar-toggle');
                if (fixSidebarToggle) {
                    this.settings.fixSidebarEnabled = fixSidebarToggle.checked;
                }
                const fixHomepageToggle = document.getElementById('fix-sidebar-homepage-toggle');
                if (fixHomepageToggle && this.settings.fixSidebarEnabled) {
                    this.settings.fixSidebarHomepage = fixHomepageToggle.checked;
                }
                const fixWallpaperToggle = document.getElementById('fix-sidebar-wallpaper-toggle');
                if (fixWallpaperToggle && this.settings.fixSidebarEnabled) {
                    this.settings.fixSidebarWallpaper = fixWallpaperToggle.checked;
                }
                this.settings.searchHistory = document.getElementById('search-history-toggle').checked;
                this.settings.searchSuggestions = document.getElementById('search-suggestions-toggle').checked;
                // 引擎锁定走统一写入口：锁定时需要把当前引擎写进 localStorage
                const engineLockToggle = document.getElementById('engine-lock-toggle');
                if (engineLockToggle) {
                    this.setEngineLock(engineLockToggle.checked);
                }
                this.settings.contextMenuStyle = document.getElementById('context-menu-style').value;

                // 读取快速访问侧边栏开关
                const newQuickLinkToggle = document.getElementById('quick-access-sidebar-toggle');
                if (newQuickLinkToggle) {
                    this.settings.quickAccessSidebar = newQuickLinkToggle.checked;
                }

                // 读取显示图标开关（主开关关闭时该子开关被强制取消勾选，同样加守卫保留偏好）
                const showIconsToggle = document.getElementById('show-quick-icons');
                if (showIconsToggle && this.settings.quickAccessSidebar) {
                    this.settings.showQuickLinkIcons = showIconsToggle.checked;
                }

                const statusBarToggle = document.getElementById('status-bar-toggle');
                if (statusBarToggle) {
                    this.settings.statusBarEnabled = statusBarToggle.checked;
                }

                const showSecondsToggle = document.getElementById('show-seconds-toggle');
                if (showSecondsToggle && this.settings.statusBarEnabled) {
                    this.settings.showStatusBarSeconds = showSecondsToggle.checked;
                }

                // 读取隐藏弹窗开关
                const hideNotifToggle = document.getElementById('hide-notifications-toggle');
                if (hideNotifToggle) {
                    this.settings.hideNotifications = hideNotifToggle.checked;
                }

                // 读取禁止提示开关
                const hideInfoToggle = document.getElementById('hide-info-popup-toggle');
                if (hideInfoToggle) {
                    this.settings.hideInfoPopup = {
                        enabled: hideInfoToggle.checked,
                        type: hideInfoToggle.checked ? 'permanent' : null,
                        timestamp: hideInfoToggle.checked ? Date.now() : null
                    };
                }

                // 读取隐藏铭牌开关（简洁视觉效果主开关由子开关状态派生，无需读取）
                const hiddenBadgeToggle = document.getElementById('hidden-badge-toggle');
                if (hiddenBadgeToggle) {
                    this.settings.hiddenBadge = hiddenBadgeToggle.checked;
                }

                // 底部铭牌功能（双击/右键动作）在右面板选择时已即时保存，此处无需再读取

                if (oldPersistentWallpaper !== this.settings.persistentWallpaper) {
                    this.handlePersistentWallpaperToggle();
                }

                this.applySettings();
                this.saveSettings();
                this.updateContextMenuIcons();
                this.closeSettings();
                this.showNotification('设置已应用');
                // 无需刷新页面，所有设置已通过组件级更新即时生效
            } catch (err) {
                console.error('[Apply] 点击处理异常:', err);
                this.showNotification('应用设置时出错: ' + err.message);
            }
        });

        // 右键应用按钮打开/关闭开发者模式
        document.getElementById('apply-settings').addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.settings.developerMode = !this.settings.developerMode;
            this.saveSettings();
            this.updateDeveloperModeUI();
            this.applyDeveloperSettings();
            this.applyStatusBarSettings();
            // 右面板若正停在使用开发者门槛的视图上，需要重渲染才能即时露出/收起其中的控件
            this.syncSidePanelSelectDisplay();
            this.showNotification(this.settings.developerMode ? '开发者模式已开启' : '开发者模式已关闭');
        });

        // 恢复出厂设置按钮事件（两步确认弹窗）
        document.getElementById('reset-settings').addEventListener('click', () => {
            this.showResetConfirmation(() => this.resetToDefaults());
        });

        // 关于按钮事件 - 左键打开UpdateLog.html
        document.getElementById('about-btn').addEventListener('click', () => {
            window.location.href = 'about/about.html';
        });

        // 关于按钮右键事件 - 右键打开welc.html
        document.getElementById('about-btn').addEventListener('contextmenu', (e) => {
            e.preventDefault();
            window.location.href = 'welc/welc.html?manual=true';
        });

        // 反馈按钮事件
        document.getElementById('feedback-btn').addEventListener('contextmenu', (e) => {
            e.preventDefault();
            // 播放音频
            this.playBadgeAudio();
        });
        document.getElementById('feedback-btn').addEventListener('click', () => {
            window.location.href = 'FB/fb.html';
        });

        // 字体大小滑块事件
        document.getElementById('font-size-slider').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            document.getElementById('font-size-value').value = value.toFixed(1);
            this.settings.fontSize = value;
            this.applyDeveloperSettings();
        });

        // 字体大小输入框事件
        document.getElementById('font-size-value').addEventListener('input', (e) => {
            let value = parseFloat(e.target.value);
            if (isNaN(value)) value = 1;
            if (value < 0.5) value = 0.5;
            if (value > 2) value = 2;
            document.getElementById('font-size-slider').value = value;
            this.settings.fontSize = value;
            this.applyDeveloperSettings();
        });

        // 字体大小输入框滚轮事件
        document.getElementById('font-size-value').addEventListener('wheel', (e) => {
            e.preventDefault();
            let value = parseFloat(e.target.value) || 1;
            value += e.deltaY > 0 ? -0.1 : 0.1;
            if (value < 0.5) value = 0.5;
            if (value > 2) value = 2;
            value = Math.round(value * 10) / 10;
            e.target.value = value.toFixed(1);
            document.getElementById('font-size-slider').value = value;
            this.settings.fontSize = value;
            this.applyDeveloperSettings();
        });

        // 字体粗细滑块事件
        document.getElementById('font-weight-slider').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('font-weight-value').value = value;
            this.settings.fontWeight = value;
            this.applyDeveloperSettings();
        });

        // 字体粗细输入框事件
        document.getElementById('font-weight-value').addEventListener('input', (e) => {
            let value = parseInt(e.target.value);
            if (isNaN(value)) value = 400;
            if (value < 100) value = 100;
            if (value > 900) value = 900;
            value = Math.round(value / 100) * 100;
            document.getElementById('font-weight-slider').value = value;
            this.settings.fontWeight = value;
            this.applyDeveloperSettings();
        });

        // 字体粗细输入框失焦时四舍五入显示
        document.getElementById('font-weight-value').addEventListener('blur', (e) => {
            let value = parseInt(e.target.value);
            if (isNaN(value)) value = 400;
            if (value < 100) value = 100;
            if (value > 900) value = 900;
            value = Math.round(value / 100) * 100;
            e.target.value = value;
        });

        // 字体粗细输入框滚轮事件
        document.getElementById('font-weight-value').addEventListener('wheel', (e) => {
            e.preventDefault();
            let value = parseInt(e.target.value) || 400;
            value += e.deltaY > 0 ? -100 : 100;
            if (value < 100) value = 100;
            if (value > 900) value = 900;
            e.target.value = value;
            document.getElementById('font-weight-slider').value = value;
            this.settings.fontWeight = value;
            this.applyDeveloperSettings();
        });

        // 搜索框高度滑块事件
        document.getElementById('search-box-height').addEventListener('input', (e) => {
            const value = parseInt(e.target.value) || 0;
            document.getElementById('search-box-height-value').value = value;
            this.settings.searchBoxHeight = value;
            this.applyDeveloperSettings();
        });

        // 搜索框高度输入框事件
        document.getElementById('search-box-height-value').addEventListener('input', (e) => {
            let value = parseInt(e.target.value) || 0;
            if (value < 0) value = 0;
            if (value > 600) value = 600;
            document.getElementById('search-box-height').value = value;
            this.settings.searchBoxHeight = value;
            this.applyDeveloperSettings();
        });

        // 搜索框高度输入框滚轮事件
        document.getElementById('search-box-height-value').addEventListener('wheel', (e) => {
            e.preventDefault();
            let value = parseInt(e.target.value) || 0;
            value += e.deltaY > 0 ? -1 : 1;
            if (value < 0) value = 0;
            if (value > 600) value = 600;
            e.target.value = value;
            document.getElementById('search-box-height').value = value;
            this.settings.searchBoxHeight = value;
            this.applyDeveloperSettings();
        });

        // 重置按钮事件
        document.querySelectorAll('.reset-control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetId = e.target.dataset.target;
                const defaultValue = e.target.dataset.default;
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    targetElement.value = defaultValue;

                    if (targetId === 'font-size-slider') {
                        this.settings.fontSize = parseFloat(defaultValue);
                        document.getElementById('font-size-value').value = defaultValue;
                    } else if (targetId === 'font-weight-slider') {
                        this.settings.fontWeight = parseInt(defaultValue);
                        document.getElementById('font-weight-value').value = defaultValue;
                    } else if (targetId === 'search-box-height') {
                        this.settings.searchBoxHeight = parseInt(defaultValue);
                        document.getElementById('search-box-height-value').value = defaultValue;
                    }

                    this.applyDeveloperSettings();
                    this.saveSettings();
                }
            });
        });

        // 开发者模式重置按钮事件
        const resetDeveloperBtn = document.getElementById('reset-developer-settings');
        if (resetDeveloperBtn) {
            resetDeveloperBtn.addEventListener('click', () => {
                this.resetDeveloperSettings();
            });
        }

        // 点击弹窗外部关闭
        document.getElementById('settings-modal').addEventListener('click', (e) => {
            if (e.target.id === 'settings-modal') {
                const rpu = document.getElementById('right-panel-upper');
                if (rpu && rpu.querySelector('[data-drag-just-happened]')) return;
                this.closeSettings();
            }
        });

        // 滚轮事件 - 向下滚动出现壁纸，向上恢复
        window.addEventListener('wheel', (e) => this.handleScroll(e), { passive: true });

        // 触摸滑动壁纸（移动端）
        let touchStartY = 0;
        let touchActive = false;

        window.addEventListener('touchstart', (e) => {
            if (document.body.classList.contains('widget-panel-open')) return;
            if (e.target.closest('.modal') ||
                e.target.closest('.search-section') ||
                e.target.closest('.engine-buttons') ||
                e.target.closest('.quick-access-links')) return;
            touchStartY = e.touches[0].pageY;
            touchActive = true;
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (document.body.classList.contains('widget-panel-open')) return;
            if (!touchActive || this.isAnimating) return;
            const deltaY = touchStartY - e.touches[0].pageY;
            if (Math.abs(deltaY) > 15) {
                this.handleScroll({ deltaY: deltaY, target: e.target });
                touchActive = false;
            }
        }, { passive: true });

        // 防止页面滚动
        window.addEventListener('keydown', (e) => {
            if (e.key === ' ' && e.target === document.body) {
                e.preventDefault();
            }
        });

        // 快捷键（开发者模式）
        document.addEventListener('keydown', (e) => {
            if (!this.settings.shortcutsEnabled) return;

            const ctrl = e.ctrlKey || e.metaKey;
            const modal = document.getElementById('settings-modal');
            const inSettings = modal && modal.classList.contains('show');

            // Ctrl+S - 应用设置（仅在设置页面中）
            if (ctrl && (e.key === 's' || e.key === 'S')) {
                e.preventDefault();
                if (inSettings) {
                    document.getElementById('apply-settings').click();
                }
                return;
            }

            // Ctrl+H - 切换搜索历史框
            if (ctrl && (e.key === 'h' || e.key === 'H')) {
                e.preventDefault();
                if (!inSettings) {
                    const container = document.getElementById('search-history-container');
                    if (container && container.classList.contains('show')) {
                        this.hideSearchHistory();
                    } else {
                        this.showSearchHistory(document.getElementById('search-input').value);
                    }
                }
                return;
            }

            // Ctrl+, - 打开设置页面
            if (ctrl && e.key === ',') {
                e.preventDefault();
                if (!inSettings) {
                    this.openSettings('shortcut');
                }
                return;
            }

            // Tab - 聚焦搜索框（不在设置页面时；快捷轮盘打开时跳过，避免打断选择）
            if (e.key === 'Tab' && !inSettings && !e.shiftKey &&
                !(window.oooController && window.oooController.radialActive)) {
                const searchInput = document.getElementById('search-input');
                if (searchInput && document.activeElement !== searchInput) {
                    e.preventDefault();
                    searchInput.focus();
                }
            }
        });

        // 右键菜单事件
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();

            // 搜索框右键自动粘贴剪贴板内容
            if (e.target.closest('.search-section')) {
                this.pasteToSearch();
                return;
            }

            if (!e.target.closest('.ooo-badge') &&
                !e.target.closest('.modal') &&
                !e.target.closest('.engine-buttons') &&
                !e.target.closest('.quick-access-links')) {
                this.showContextMenu(e);
            }
        });

        // 点击页面其他地方关闭右键菜单
        document.addEventListener('click', (e) => {
            if (this.contextMenu && !this.contextMenu.contains(e.target)) {
                this.hideContextMenu();
            }
        });

        // 右键菜单项目点击事件
        if (this.contextMenu) {
            this.contextMenu.addEventListener('click', (e) => {
                const menuItem = e.target.closest('.context-menu-item');
                if (menuItem) {
                    const action = menuItem.dataset.action;
                    this.handleContextMenuAction(action);
                    this.hideContextMenu();
                }
            });
        }

        // 拖拽上传功能
        this.setupDragAndDrop();

        // 文字Logo输入框回车键支持
        const textLogoInput = document.getElementById('text-logo-input');
        const textLogoInlineGroup = document.getElementById('text-logo-inline-group');
        const textLogoBtn = document.getElementById('set-text-logo');

        // 计算字符长度（中文算2个字符）
        const getCharLength = (str) => {
            let length = 0;
            for (let i = 0; i < str.length; i++) {
                const charCode = str.charCodeAt(i);
                if (charCode > 127) {
                    length += 2;
                } else {
                    length += 1;
                }
            }
            return length;
        };

        // 检查输入长度
        const checkTextLogoInputLength = () => {
            if (!textLogoInput || !textLogoBtn) return true;
            const text = textLogoInput.value;
            const length = getCharLength(text);
            if (length > 25) {
                textLogoBtn.disabled = true;
                textLogoBtn.classList.add('disabled');
                textLogoInput.classList.add('error');
                this.showNotification('超出输入范围');
                return false;
            } else {
                textLogoBtn.disabled = false;
                textLogoBtn.classList.remove('disabled');
                textLogoInput.classList.remove('error');
                return true;
            }
        };

        if (textLogoInput) {
            textLogoInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    if (!textLogoBtn.disabled) {
                        this.setTextLogo();
                    }
                }
            });
            textLogoInput.addEventListener('input', () => {
                checkTextLogoInputLength();
            });
            // 阻止点击事件冒泡，防止关闭下拉菜单
            textLogoInput.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        if (textLogoInlineGroup) {
            textLogoInlineGroup.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // 快速访问链接选择框点击事件
        const quickLinksSelectSelected = document.getElementById('quick-links-select-selected');
        const quickLinksSelectItems = document.getElementById('quick-links-select-items');

        if (quickLinksSelectSelected && quickLinksSelectItems) {
            quickLinksSelectSelected.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showQuickLinksMenuInRightPanel();
            });
        }

        this.initHideInfoPopupToggle();
    }






















    // 预设字体名称到字体文件路径的映射
    static get PRESET_FONT_PATHS() {
        return {
            'Sans Flex': '../fonts/GoogleSansFlex.ttf',
            'Ginto': '../fonts/ABCGintoVariable.ttf',
            'Josefin': '../fonts/JosefinSans.ttf',
            'Code': '../fonts/GoogleSansCode.ttf',
            'HMSC': '../fonts/HarmonyOS_SansSC.ttf'
        };
    }

}

// ==== main/Script/core/runtime.js ====
'use strict';

// 运行时注册表
// 用于解耦 OOOInterface 与 Controller 之间原本通过 window 全局互相引用的关系：
// Controller 需要拿到主应用实例（读设置、执行动作），主应用需要拿到手柄控制器
// （判断径向菜单是否激活）。改为经此注册表传递，避免模块之间隐式的 window 依赖。
//
// 注意：main.js 在实例化后会同时写入本表与 window.oooInterface / window.oooController，
// 后者仅作为调试与向后兼容的方便入口，不再作为跨模块通信的正式通道。
const runtime = {
    ooo: null,        // OOOInterface 实例
    controller: null  // Controller 实例
};

// ==== main/Script/core/Controller.js ====
'use strict';

// [bundled] import { … } from './runtime.js'

class Controller {
    constructor() {
        this.gamepadIndex = -1;
        this.connected = false;
        this.animationId = null;

        this.cursorX = window.innerWidth / 2;
        this.cursorY = window.innerHeight / 2;

        this.navTargets = [];
        this.navIndex = -1;

        this.btnState = {};
        this.prevBtnState = {};
        this._actPressTime = null;
        this._actLongFired = false;
        this.longPressThreshold = 500;

        this.tabHoldThreshold = 150;
        this.tabRadialThreshold = 45;
        this.tabRadialInnerRadius = 27;
        this.tabRadialConfirmDelay = 100;
        this.radialArrowComboDelay = 140;
        this._tabPressTimer = null;
        this._tabRadialOrigin = null;
        this._tabOriginDot = null;
        this._virtX = 0;
        this._virtY = 0;
        this._radialSelectedIdx = -1;
        this._radialCandidateIdx = -1;
        this._radialCandidateTime = 0;
        this._lastMouseX = window.innerWidth / 2;
        this._lastMouseY = window.innerHeight / 2;
        this._tabSummonX = 0;
        this._tabSummonY = 0;
        this._radialArrowDirs = new Set();
        this._radialArrowTimer = null;

        this.ltHeld = false;
        this.rtHeld = false;
        this.dpadDir = null;
        this.rStickDir = null;
        this.lastNavTime = 0;
        this.ignoreNextActivate = false;

        this.radialActive = false;
        this.radialEl = null;
        this.radialSelected = null;
        this._radialMode = null;
        this.radialItems = [
            { action: 'clear', label: '清空', icon: 'clear_all' },
            { action: 'paste', label: '粘贴', icon: 'content_paste' },
            { action: 'settings', label: '设置', icon: 'settings' },
            { action: 'about', label: '关于', icon: 'info' },
            { action: 'switch-engine', label: '搜索切换', icon: 'travel_explore' },
            { action: 'wallpaper', label: '壁纸模式', icon: 'unfold_more' },
            { action: 'refresh', label: '刷新', icon: 'refresh' },
            { action: 'copy', label: '复制', icon: 'content_copy' },
        ];

        this.settings = {
            enabled: false,
            cursorSpeed: 6,
            invertAB: false,
            customLS: 'none',
            customRS: 'none'
        };

        this.DZ = 0.15;
        this.NAV_DZ = 0.5;
        this.TRIG = 0.5;
        this.NAV_DELAY = 380;
        this.NAV_RATE = 140;
        this.init();
    }

    init() {
        this.loadSettings();
        this.createCursor();
        this.bindEvents();
        this.initUI();
        this.detectConnectedGamepad();
        this.startLoop();
        this.syncSettingsUI();
    }

    detectConnectedGamepad() {
        const pads = navigator.getGamepads ? navigator.getGamepads() : [];
        for (let i = 0; i < pads.length; i++) {
            if (pads[i] && pads[i].connected) {
                this.gamepadIndex = pads[i].index;
                this.connected = true;
                if (this.settings.enabled) {
                    this.showCursor(true);
                    this.updateNavTargets();
                }
                break;
            }
        }
    }

    get ooo() {
        return this._ooo || runtime.ooo || window.oooInterface || null;
    }

    set ooo(val) {
        this._ooo = val;
    }

    createCursor() {
        const existing = document.getElementById('controller-cursor');
        if (existing) existing.remove();

        this.cursor = document.createElement('div');
        this.cursor.id = 'controller-cursor';
        this.cursor.style.cssText =
            'position:fixed;width:28px;height:28px;border-radius:50%;' +
            'border:2px solid var(--scheme-accent,#1a73e8);' +
            'background:rgba(var(--scheme-accent-rgb,26,115,232),0.12);' +
            'pointer-events:none;z-index:99998;' +
            'transform:translate(-50%,-50%);display:none;' +
            'transition:width .15s,height .15s,background .15s;' +
            'box-shadow:0 0 8px rgba(var(--scheme-accent-rgb,26,115,232),0.25);';

        const ring = document.createElement('div');
        ring.style.cssText =
            'position:absolute;top:50%;left:50%;' +
            'width:18px;height:18px;border-radius:50%;' +
            'border:1px solid rgba(var(--scheme-accent-rgb,26,115,232),0.3);' +
            'transform:translate(-50%,-50%);';
        this.cursor.appendChild(ring);

        const dot = document.createElement('div');
        dot.style.cssText =
            'position:absolute;top:50%;left:50%;' +
            'width:4px;height:4px;border-radius:50%;' +
            'background:var(--scheme-accent,#1a73e8);' +
            'transform:translate(-50%,-50%);';
        this.cursor.appendChild(dot);

        document.body.appendChild(this.cursor);
        this.cursorActive = false;
    }

    loadSettings() {
        try {
            const raw = localStorage.getItem('oooControllerSettings');
            if (raw) {
                const parsed = JSON.parse(raw);
                Object.assign(this.settings, parsed);
            }
        } catch (e) { /* ignore */ }
    }

    saveSettings() {
        try {
            localStorage.setItem('oooControllerSettings', JSON.stringify(this.settings));
        } catch (e) { /* ignore */ }
    }

    bindEvents() {
        window.addEventListener('gamepadconnected', (e) => {
            this.gamepadIndex = e.gamepad.index;
            this.connected = true;
            if (this.settings.enabled) {
                this.showCursor(true);
                this.updateNavTargets();
                if (this.ooo && !this.ooo.settings.hideNotifications) {
                    this.ooo.showNotification('手柄已连接');
                }
            }
        });

        window.addEventListener('gamepaddisconnected', (e) => {
            if (e.gamepad.index === this.gamepadIndex) {
                this.connected = false;
                this.gamepadIndex = -1;
                this.showCursor(false);
                this.clearHighlight();
                if (this.ooo && this.settings.enabled && !this.ooo.settings.hideNotifications) {
                    this.ooo.showNotification('手柄已断开');
                }
            }
        });

        window.addEventListener('resize', () => {
            this.cursorX = Math.min(this.cursorX, window.innerWidth - 10);
            this.cursorY = Math.min(this.cursorY, window.innerHeight - 10);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.radialActive) {
                this.hideRadialMenu();
            }
        });

        // 鼠标位置跟踪：Tab 轮盘用"指针相对呼出点的位移"驱动虚拟指针（从圆心出发）
        document.addEventListener('mousemove', (e) => {
            this._lastMouseX = e.clientX;
            this._lastMouseY = e.clientY;
            if (this.radialActive && this._radialMode === 'tab') {
                this.handleRadialMouseMove(
                    e.clientX - this._tabSummonX,
                    e.clientY - this._tabSummonY
                );
            }
        });

        // 方向键选择轮盘：单键对应上下左右四项，斜向需两键组合（如左+上 = 左上角）
        document.addEventListener('keydown', (e) => {
            if (!this.radialActive) return;
            const dir = this.arrowKeyDir(e.key);
            if (!dir) return;
            e.preventDefault();
            if (e.repeat) return;
            this._radialArrowDirs.add(dir);
            this.resolveRadialArrowCombo();
        });

        document.addEventListener('keyup', (e) => {
            if (!this.radialActive) return;
            const dir = this.arrowKeyDir(e.key);
            if (!dir) return;
            e.preventDefault();
            this._radialArrowDirs.delete(dir);
            if (this._radialArrowDirs.size === 0 && this._radialArrowTimer) {
                // 单键快速敲击：松开时立即触发
                clearTimeout(this._radialArrowTimer);
                this._radialArrowTimer = null;
                this.fireRadialIndex(this.radialIndexForDirs([dir]));
            }
        });

        // Tab 长按打开快捷轮盘（与 Tab 单按聚焦搜索框共存）
        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            if (this.radialActive && this._radialMode === 'tab') {
                e.preventDefault();
                return;
            }
            if (this.radialActive) return;
            if (e.repeat || e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) return;
            if (!this.canTriggerTabRadial()) return;
            clearTimeout(this._tabPressTimer);
            this._tabPressTimer = setTimeout(() => {
                this._tabPressTimer = null;
                this.showRadialMenu('tab');
            }, this.tabHoldThreshold);
        });

        document.addEventListener('keyup', (e) => {
            if (e.key !== 'Tab') return;
            if (this._tabPressTimer) {
                clearTimeout(this._tabPressTimer);
                this._tabPressTimer = null;
            }
            if (this.radialActive && this._radialMode === 'tab') {
                const sel = this.radialSelected;
                this.hideRadialMenu();
                if (sel) this.doRadialAction(sel);
            }
        });

        // 窗口失焦时取消未触发的长按并关闭 Tab 轮盘（如 Alt+Tab 切窗口）
        window.addEventListener('blur', () => {
            if (this._tabPressTimer) {
                clearTimeout(this._tabPressTimer);
                this._tabPressTimer = null;
            }
            if (this.radialActive && this._radialMode === 'tab') {
                this.hideRadialMenu();
            }
        });
    }

    startLoop() {
        const loop = () => {
            this.poll();
            this.animationId = requestAnimationFrame(loop);
        };
        loop();
    }

    poll() {
        if (!this.settings.enabled) {
            if (this.cursor.style.display !== 'none') {
                this.cursor.style.display = 'none';
                this.clearHighlight();
            }
            this.ltHeld = false;
            this.rtHeld = false;
            return;
        }

        const gamepad = navigator.getGamepads ? navigator.getGamepads()[this.gamepadIndex] : null;
        if (!gamepad || !this.connected) {
            if (this.cursor.style.display !== 'none') {
                this.cursor.style.display = 'none';
                this.clearHighlight();
            }
            return;
        }

        this.prevBtnState = Object.assign({}, this.btnState);
        this.btnState = {};
        for (let i = 0; i < gamepad.buttons.length; i++) {
            this.btnState[i] = gamepad.buttons[i].pressed;
        }

        this.handleTriggers(gamepad);

        if (this._skipStick) {
            this._skipStick = false;
            this.handleButtons();
            this.handleDpad();
            return;
        }

        if (!this.radialActive) {
            if (this.btnState[4]) {
                this.showRadialMenu('hold');
                return;
            }
            if (this.btnPressed(2)) {
                this.showRadialMenu('toggle');
                return;
            }
        }

        if (this.radialActive) {
            this.handleRadialStick(gamepad);
            this.handleRadialButtons();
        } else {
            this.handleSticks(gamepad);
            this.handleButtons();
            this.handleDpad();
        }
    }

    handleSticks(gamepad) {
        const lx = gamepad.axes[0] || 0;
        const ly = gamepad.axes[1] || 0;
        const rx = gamepad.axes[2] || 0;
        const ry = gamepad.axes[3] || 0;

        const lMag = Math.sqrt(lx * lx + ly * ly);
        if (lMag > this.DZ) {
            const normX = lx / lMag;
            const normY = ly / lMag;
            const adjMag = Math.min(1, (lMag - this.DZ) / (1 - this.DZ));
            const speed = this.settings.cursorSpeed * adjMag;
            this.cursorX += normX * speed;
            this.cursorY += normY * speed;
        }

        this.cursorX = Math.max(0, Math.min(window.innerWidth, this.cursorX));
        this.cursorY = Math.max(0, Math.min(window.innerHeight, this.cursorY));

        const rMag = Math.sqrt(rx * rx + ry * ry);
        if (rMag > this.NAV_DZ) {
            const angle = Math.atan2(-ry, rx) * (180 / Math.PI);
            let dir = null;
            if (angle > -45 && angle <= 45) dir = 'right';
            else if (angle > 45 && angle <= 135) dir = 'up';
            else if (angle > -135 && angle <= -45) dir = 'down';
            else dir = 'left';
            this.handleNavDirection(dir);
            this.rStickDir = dir;
        } else {
            this.rStickDir = null;
        }

        this.showCursor(true);
        this.cursor.style.left = this.cursorX + 'px';
        this.cursor.style.top = this.cursorY + 'px';
    }

    handleTriggers(gamepad) {
        if (this.isSliderActive()) return;

        const lt = gamepad.buttons[6] ? gamepad.buttons[6].value : 0;
        const rt = gamepad.buttons[7] ? gamepad.buttons[7].value : 0;

        if (lt > this.TRIG && !this.ltHeld) {
            this.ltHeld = true;
            this.doDelete();
        } else if (lt <= this.TRIG) {
            this.ltHeld = false;
        }

        if (rt > this.TRIG && !this.rtHeld) {
            this.rtHeld = true;
            this.doPaste();
        } else if (rt <= this.TRIG) {
            this.rtHeld = false;
        }
    }

    handleButtons() {
        const escBtn = this.settings.invertAB ? 1 : 0;
        const actBtn = this.settings.invertAB ? 0 : 1;

        if (this.isSliderActive()) {
            this.handleSliderBtns();
            return;
        }

        if (this.btnPressed(escBtn)) this.doEscape();
        if (this.btnPressed(3)) this.doEnter();
        if (this.btnPressed(5)) this.doCopy();
        if (this.btnPressed(10)) this.doCustomAction(this.settings.customLS);
        if (this.btnPressed(11)) this.doCustomAction(this.settings.customRS);

        this.handleActivateBtn(actBtn);
    }

    isSliderActive() {
        if (this.navIndex < 0 || this.navIndex >= this.navTargets.length) return false;
        const el = this.navTargets[this.navIndex];
        return el && el.classList.contains('slider-input');
    }

    handleSliderBtns() {
        const el = this.navTargets[this.navIndex];
        if (!el) return;
        const min = parseFloat(el.min) || 0;
        const max = parseFloat(el.max) || 100;
        const step = parseFloat(el.step) || 1;
        let delta = 0;
        if (this.btnPressed(4) || this.btnPressed(6)) delta -= step;
        if (this.btnPressed(5) || this.btnPressed(7)) delta += step;
        if (this.btnPressed(1)) delta += step;
        if (this.btnPressed(3)) delta += (max - min) * 0.1;
        if (delta !== 0) {
            let v = Math.round(((parseFloat(el.value) || min) + delta) / step) * step;
            v = Math.max(min, Math.min(max, v));
            el.value = v;
            el.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    handleActivateBtn(idx) {
        const pressed = this.btnPressed(idx);
        const held = this.btnState[idx];
        const released = this.btnReleased(idx);

        if (pressed) {
            this._actPressTime = Date.now();
            this._actLongFired = false;
        }

        if (held && !this._actLongFired) {
            if (Date.now() - this._actPressTime >= this.longPressThreshold) {
                this._actLongFired = true;
                this.onActivateHold();
            }
        }

        if (released) {
            if (!this._actLongFired) {
                this.handleActivate();
            }
            this._actPressTime = null;
        }
    }

    handleDpad() {
        const up = this.btnState[12] || false;
        const down = this.btnState[13] || false;
        const left = this.btnState[14] || false;
        const right = this.btnState[15] || false;

        let dir = null;
        if (up) dir = 'up';
        else if (down) dir = 'down';
        else if (left) dir = 'left';
        else if (right) dir = 'right';

        if (dir) {
            this.handleNavDirection(dir);
            this.dpadDir = dir;
        } else {
            this.dpadDir = null;
            this.checkDpadAxes();
        }
    }

    checkDpadAxes() {
        const gamepad = navigator.getGamepads ? navigator.getGamepads()[this.gamepadIndex] : null;
        if (!gamepad) return;
        const a = gamepad.axes;
        if (a.length < 8) return;
        let dx = a[6] || 0;
        let dy = a[7] || 0;
        if (Math.abs(dx) < this.DZ) dx = 0;
        if (Math.abs(dy) < this.DZ) dy = 0;
        if (dx === 0 && dy === 0) return;
        let dir;
        if (Math.abs(dx) > Math.abs(dy)) {
            dir = dx > 0 ? 'right' : 'left';
        } else {
            dir = dy > 0 ? 'down' : 'up';
        }
        this.handleNavDirection(dir);
        this.dpadDir = dir;
    }

    onActivateHold() {
        const badge = document.getElementById('ooo-badge');
        if (!badge) return;
        const br = badge.getBoundingClientRect();
        const cx = this.cursorX;
        const cy = this.cursorY;
        if (cx >= br.left && cx <= br.right && cy >= br.top && cy <= br.bottom) {
            this.ignoreNextActivate = true;
            if (this.ooo) this.ooo.openSettings('badge');
        }
    }

    btnPressed(idx) {
        return this.btnState[idx] && !this.prevBtnState[idx];
    }

    btnReleased(idx) {
        return !this.btnState[idx] && this.prevBtnState[idx];
    }

    handleNavDirection(dir) {
        const now = Date.now();
        const isRepeat = this.dpadDir === dir || this.rStickDir === dir;
        const delay = isRepeat ? this.NAV_RATE : this.NAV_DELAY;
        if (isRepeat && this.lastNavTime && (now - this.lastNavTime < delay)) return;
        this.lastNavTime = now;
        this.navigate(dir);
    }

    navigate(dir) {
        this.updateNavTargets();
        if (this.navTargets.length === 0) return;

        if (this.navIndex < 0 || this.navIndex >= this.navTargets.length) {
            this.navIndex = 0;
            this.highlightNavElement(this.navTargets[this.navIndex]);
            return;
        }

        const current = this.navTargets[this.navIndex];
        const cr = current.getBoundingClientRect();
        let bestIdx = -1;
        let bestDist = Infinity;

        this.navTargets.forEach((el, i) => {
            if (i === this.navIndex) return;
            if (!el.offsetParent && el.id !== 'search-input') return;

            const r = el.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            const ccx = cr.left + cr.width / 2;
            const ccy = cr.top + cr.height / 2;

            let dx = cx - ccx;
            let dy = cy - ccy;
            let ok = false;
            switch (dir) {
                case 'up': ok = dy < -10; break;
                case 'down': ok = dy > 10; break;
                case 'left': ok = dx < -10; break;
                case 'right': ok = dx > 10; break;
            }
            if (!ok) return;

            const dist = dx * dx + dy * dy;
            const angleWeight = this.directionWeight(dir, dx, dy);
            const score = dist / (angleWeight || 0.01);

            if (score < bestDist) {
                bestDist = score;
                bestIdx = i;
            }
        });

        if (bestIdx >= 0) {
            this.navIndex = bestIdx;
            this.highlightNavElement(this.navTargets[this.navIndex]);
        }
    }

    directionWeight(dir, dx, dy) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        let targetAngle;
        switch (dir) {
            case 'right': targetAngle = 0; break;
            case 'down': targetAngle = 90; break;
            case 'left': targetAngle = 180; break;
            case 'up': targetAngle = -90; break;
            default: return 1;
        }
        let diff = Math.abs(angle - targetAngle);
        if (diff > 180) diff = 360 - diff;
        return Math.max(0.01, 1 - diff / 180);
    }

    updateNavTargets() {
        const modal = document.getElementById('settings-modal');
        const inSettings = modal && modal.classList.contains('show');

        if (inSettings) {
            const root = document.querySelector('.modal-content');
            if (!root) { this.navTargets = []; return; }
            const all = root.querySelectorAll(
                'button, .select-selected, .select-item, ' +
                'input:not([type="file"]):not([type="hidden"]), ' +
                '.slider-input, .slider-value-input, ' +
                '.settings-menu-option, .quick-link-menu-item, ' +
                '.switch'
            );
            this.navTargets = Array.from(all).filter(el => {
                const style = window.getComputedStyle(el);
                if (style.display === 'none' || style.visibility === 'hidden') return false;
                if (el.classList.contains('switch')) return true;
                return el.offsetWidth > 0 && el.offsetHeight > 0;
            });
        } else {
            const ql = document.getElementById('quick-access-links');
            const qlVisible = ql && ql.style.display !== 'none';

            let targets = [];
            const si = document.getElementById('search-input');
            if (si) targets.push(si);

            const ge = document.getElementById('google-engine');
            const be = document.getElementById('bing-engine');
            if (ge) targets.push(ge);
            if (be) targets.push(be);

            if (qlVisible) {
                targets = targets.concat(Array.from(document.querySelectorAll('.quick-access-btn')));
            }

            if (document.body.classList.contains('sidebar-visible')) {
                targets = targets.concat(Array.from(
                    document.querySelectorAll('#quick-access-sidebar-links .quick-access-sidebar-link')
                ));
            }

            const shc = document.getElementById('search-history-container');
            if (shc && shc.classList.contains('show')) {
                targets = targets.concat(Array.from(
                    shc.querySelectorAll('.search-history-item, .search-history-delete')
                ));
            }

            const badge = document.getElementById('ooo-badge');
            if (badge) targets.push(badge);

            this.navTargets = targets;
        }
    }

    highlightNavElement(el) {
        this.clearHighlight();
        if (!el) return;

        if (el.id === 'search-input') {
            const container = el.closest('.search-container');
            if (container) {
                container.classList.add('controller-focus');
                container.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                return;
            }
        }

        if (el.classList.contains('switch')) {
            el.classList.add('controller-focus');
            el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            return;
        }

        el.classList.add('controller-focus');
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    clearHighlight() {
        document.querySelectorAll('.controller-focus').forEach(el => {
            el.classList.remove('controller-focus');
        });
    }

    showCursor(show) {
        if (show && this.settings.enabled && this.connected) {
            this.cursor.style.display = 'block';
            this.cursorActive = true;
        } else {
            this.cursor.style.display = 'none';
            this.cursorActive = false;
        }
    }

    clickAtCursor() {
        const el = document.elementFromPoint(this.cursorX, this.cursorY);
        if (!el) return;

        if (el.closest('.switch')) {
            el.closest('.switch').querySelector('input[type="checkbox"]').click();
            return;
        }

        if (el.id === 'search-input' || el.closest('.search-container')) {
            const si = document.getElementById('search-input');
            if (si && document.activeElement !== si) si.focus();
            if (si) {
                si.dispatchEvent(new MouseEvent('click', {
                    bubbles: true, cancelable: true,
                    clientX: this.cursorX, clientY: this.cursorY
                }));
            }
            return;
        }

        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.focus();
            el.dispatchEvent(new MouseEvent('click', {
                bubbles: true, cancelable: true,
                clientX: this.cursorX, clientY: this.cursorY
            }));
            return;
        }

        const target = el.closest(
            'button, a, [role="button"], .select-item, .quick-access-btn, .context-menu-item, ' +
            'label, .engine-btn, .search-history-item, .search-history-delete, .quick-access-sidebar-link'
        );
        if (target) {
            target.dispatchEvent(new MouseEvent('click', {
                bubbles: true, cancelable: true,
                clientX: this.cursorX, clientY: this.cursorY
            }));
        } else {
            el.dispatchEvent(new MouseEvent('click', {
                bubbles: true, cancelable: true,
                clientX: this.cursorX, clientY: this.cursorY
            }));
        }
    }

    focusSearchInput() {
        const si = document.getElementById('search-input');
        if (si) si.focus();
    }

    handleActivate() {
        if (this.ignoreNextActivate) {
            this.ignoreNextActivate = false;
            return;
        }
        this.clickAtCursor();
    }

    doDelete() {
        if (this.navIndex >= 0 && this.navIndex < this.navTargets.length) {
            const el = this.navTargets[this.navIndex];
            if (el && el.classList.contains('search-history-item') && this.ooo) {
                const query = el.dataset.query;
                if (query) {
                    this.ooo.removeFromSearchHistory(query);
                    return;
                }
            }
        }

        const target = document.activeElement;
        const input = (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'))
            ? target : document.getElementById('search-input');
        if (input) {
            input.focus();
            input.value = '';
            input.dispatchEvent(new Event('input', { bubbles: true }));
            const clearBtn = document.querySelector('.search-clear-btn');
            if (clearBtn) clearBtn.style.display = 'none';
        }
        if (this.ooo) this.ooo.showNotification('清空');
    }

    doCopy() {
        if (this.ooo) {
            this.ooo.copySearchContent();
        } else {
            const si = document.getElementById('search-input');
            if (si && si.value) {
                navigator.clipboard.writeText(si.value);
            }
        }
    }

    doPaste() {
        if (this.ooo) {
            this.ooo.pasteToSearch();
        } else {
            navigator.clipboard.readText().then(text => {
                const si = document.getElementById('search-input');
                if (si) si.value = text;
            });
        }
    }

    doEnter() {
        const modal = document.getElementById('settings-modal');
        if (modal && modal.classList.contains('show')) {
            const applyBtn = document.getElementById('apply-settings');
            if (applyBtn) { applyBtn.click(); return; }
        }

        const si = document.getElementById('search-input');
        if (document.activeElement === si || !document.activeElement || document.activeElement === document.body) {
            if (si && si.value.trim()) {
                if (this.ooo) {
                    this.ooo.performSearch(si.value);
                } else {
                    si.dispatchEvent(new KeyboardEvent('keydown', {
                        key: 'Enter', code: 'Enter', bubbles: true
                    }));
                }
            } else if (si) {
                si.focus();
            }
        } else {
            const active = document.activeElement;
            active.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter', code: 'Enter', bubbles: true, cancelable: true
            }));
        }
    }

    doEscape() {
        if (this.radialActive) {
            this.hideRadialMenu();
            return;
        }

        const modal = document.getElementById('settings-modal');
        if (modal && modal.classList.contains('show')) {
            document.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Escape', code: 'Escape', bubbles: true, cancelable: true
            }));
            return;
        }

        const context = document.getElementById('context-menu');
        if (context && context.classList.contains('show')) {
            if (this.ooo) this.ooo.hideContextMenu();
            return;
        }

        if (document.body.classList.contains('sidebar-visible')) {
            const container = document.getElementById('quick-access-sidebar-container');
            if (container) {
                // 当前视图处于固定模式时，Escape 不隐藏固定的侧边栏
                if (this.ooo && this.ooo.isSidebarFixed()) {
                    document.body.classList.remove('sidebar-visible');
                    return;
                }
                container.classList.remove('visible');
                container.classList.add('hiding');
            }
            document.body.classList.remove('sidebar-visible');
            return;
        }

        const sh = document.getElementById('search-history-container');
        if (sh && sh.classList.contains('show')) {
            if (this.ooo) this.ooo.hideSearchHistory();
            return;
        }

        const si = document.getElementById('search-input');
        if (si && document.activeElement === si) {
            si.blur();
        }
    }

    doCustomAction(action) {
        if (!this.ooo) return;
        switch (action) {
            case 'settings': this.ooo.openSettings('shortcut'); break;
            case 'refresh': location.reload(); break;
            case 'history': this.ooo.toggleSearchHistorySetting(); break;
            case 'wallpaper': this.ooo.toggleWallpaperSetting(); break;
        }
    }

    doRadialAction(action) {
        if (action === 'copy') this.doCopy();
        else if (action === 'paste') this.doPaste();
        else if (action === 'clear') this.doDelete();
        else if (action === 'switch-engine' && this.ooo) {
            const next = this.ooo.currentEngine === 'google' ? 'bing' : 'google';
            this.ooo.currentEngine = next;
            // 引擎按钮可能不存在，需空值保护避免报错
            const googleEngine = document.getElementById('google-engine');
            const bingEngine = document.getElementById('bing-engine');
            if (googleEngine) googleEngine.classList.toggle('active', next === 'google');
            if (bingEngine) bingEngine.classList.toggle('active', next === 'bing');
            if (this.ooo.settings.engineLocked) {
                localStorage.setItem('oooEngineLocked', next);
            }
            this.updateNavTargets();
        }
        else if (action === 'wallpaper' && this.ooo) {
            if (this.ooo.settings.quickAccessSidebar) {
                // 当前视图处于固定模式时，径向菜单的壁纸操作不切换固定侧边栏的显示状态
                if (this.ooo.isSidebarFixed()) return;
                const container = document.getElementById('quick-access-sidebar-container');
                if (container && document.body.classList.contains('sidebar-visible')) {
                    container.classList.remove('visible');
                    container.classList.add('hiding');
                    document.body.classList.remove('sidebar-visible');
                } else if (container) {
                    container.classList.remove('hiding');
                    container.classList.add('visible');
                    document.body.classList.add('sidebar-visible');
                }
            } else {
                if (this.ooo.isScrolled) this.ooo.restoreHomepage();
                else this.ooo.showWallpaper();
            }
        }
        else if (action === 'settings' && this.ooo) this.ooo.openSettings('shortcut');
        else if (action === 'refresh') location.reload();
        else if (action === 'about') window.location.href = 'about/about.html';
    }

    showRadialMenu(mode) {
        if (this.radialActive) return;
        this.radialActive = true;
        this._radialMode = mode;
        this.radialSelected = null;

        const existing = document.getElementById('radial-menu');
        if (existing) existing.remove();

        const S = 380, R = 135, IS = 46, N = this.radialItems.length;

        const overlay = document.createElement('div');
        overlay.id = 'radial-menu';
        overlay.style.cssText =
            'position:fixed;top:0;left:0;width:100%;height:100%;' +
            'display:flex;align-items:center;justify-content:center;';

        const wheel = document.createElement('div');
        wheel.className = 'radial-wheel';
        wheel.style.cssText =
            'position:relative;width:' + S + 'px;height:' + S + 'px;border-radius:50%;' +
            'transform:scale(0.82);transition:transform .2s cubic-bezier(0.34,1.56,0.64,1);' +
            '-webkit-mask:radial-gradient(circle at ' + (S / 2) + 'px ' + (S / 2) + 'px,transparent 45px,black 47px);' +
            'mask:radial-gradient(circle at ' + (S / 2) + 'px ' + (S / 2) + 'px,transparent 45px,black 47px);';

        for (let i = 0; i < N; i++) {
            const dividerAngle = ((i + 0.5) / N) * 2 * Math.PI - Math.PI / 2;
            const line = document.createElement('div');
            line.style.cssText =
                'position:absolute;left:' + (S / 2 - 1.5) + 'px;top:' + (S / 2) + 'px;' +
                'width:3px;height:' + (S / 2) + 'px;' +
                'background:rgba(255,255,255,0.2);' +
                'transform-origin:50% 0%;' +
                'transform:rotate(' + (dividerAngle * 180 / Math.PI) + 'deg);' +
                'pointer-events:none;';
            wheel.appendChild(line);
        }

        this.radialItems.forEach((item, i) => {
            const angle = (i / N) * 2 * Math.PI - Math.PI / 2;
            const x = S / 2 + R * Math.cos(angle) - IS / 2;
            const y = S / 2 + R * Math.sin(angle) - IS / 2;

            let icon = item.icon;
            if (item.action === 'wallpaper' && this.ooo) {
                icon = this.ooo.settings.quickAccessSidebar ? 'vertical_split' : 'unfold_more';
            }

            const el = document.createElement('span');
            el.className = 'radial-item material-icons';
            el.dataset.action = item.action;
            el.textContent = icon;
            el.style.cssText =
                'position:absolute;left:' + x + 'px;top:' + y + 'px;' +
                'width:' + IS + 'px;height:' + IS + 'px;' +
                'display:flex;align-items:center;justify-content:center;' +
                'font-size:30px;color:rgba(255,255,255,0.7);' +
                'transition:all .1s ease;transform:scale(1);' +
                'text-shadow:0 1px 4px rgba(0,0,0,0.2);' +
                'line-height:1;';

            wheel.appendChild(el);
        });

        overlay.appendChild(wheel);
        document.body.appendChild(overlay);

        this.radialEl = overlay;
        this._radialWheel = wheel;
        this._wasStickActive = false;
        this._radialReleaseFired = false;
        this._skipStick = false;

        if (mode === 'tab') {
            // 虚拟指针从轮盘圆心（屏幕中心）出发，位移取指针相对呼出点的坐标差，
            // 边缘被系统钳制时也不会像增量累加那样单向漂移
            const ox = window.innerWidth / 2;
            const oy = window.innerHeight / 2;
            this._tabRadialOrigin = { x: ox, y: oy };
            this._virtX = ox;
            this._virtY = oy;
            this._tabSummonX = this._lastMouseX;
            this._tabSummonY = this._lastMouseY;
            this._radialSelectedIdx = -1;
            this._radialCandidateIdx = -1;
            this._radialCandidateTime = 0;
            const dot = document.createElement('div');
            dot.style.cssText =
                'position:fixed;left:' + ox + 'px;top:' + oy + 'px;width:12px;height:12px;' +
                'border-radius:50%;transform:translate(-50%,-50%);pointer-events:none;z-index:99999;' +
                'background:var(--scheme-accent,#1a73e8);' +
                'box-shadow:0 0 0 4px rgba(var(--scheme-accent-rgb,26,115,232),0.25),0 0 12px rgba(var(--scheme-accent-rgb,26,115,232),0.5);';
            document.body.appendChild(dot);
            this._tabOriginDot = dot;
            this.setCursorHidden(true);
        }

        requestAnimationFrame(() => {
            wheel.style.transform = 'scale(1)';
        });
    }

    hideRadialMenu() {
        if (!this.radialActive) return;
        const wasTab = this._radialMode === 'tab';
        this.radialActive = false;
        this._radialMode = null;
        this.radialSelected = null;
        if (this.radialEl && this.radialEl.parentNode) {
            this.radialEl.remove();
        }
        this.radialEl = null;
        this._radialWheel = null;
        this._skipStick = true;
        this._radialSelectedIdx = -1;
        this._resetRadialCandidate();
        this._radialArrowDirs.clear();
        if (this._radialArrowTimer) {
            clearTimeout(this._radialArrowTimer);
            this._radialArrowTimer = null;
        }
        if (wasTab) {
            this.setCursorHidden(false);
            if (this._tabOriginDot) {
                this._tabOriginDot.remove();
                this._tabOriginDot = null;
            }
            this._tabRadialOrigin = null;
        }
    }

    handleRadialStick(gamepad) {
        const rx = gamepad.axes[2] || 0;
        const ry = gamepad.axes[3] || 0;
        const rMag = Math.sqrt(rx * rx + ry * ry);

        if (!this._radialWheel) return;

        const active = rMag > this.NAV_DZ;

        if (active) {
            this._wasStickActive = true;
            const bestIdx = this.bestRadialIndex(rx, ry);
            this.radialSelected = this.radialItems[bestIdx].action;
            this.highlightRadialItem(bestIdx);
        } else if (this._wasStickActive && !this._radialReleaseFired) {
            this._wasStickActive = false;
            this._radialReleaseFired = true;
            if (this.radialSelected) {
                this.doRadialAction(this.radialSelected);
                this.hideRadialMenu();
            }
        }
    }

    highlightRadialItem(idx) {
        if (!this._radialWheel) return;
        const itemEls = this._radialWheel.querySelectorAll('.radial-item');
        itemEls.forEach((el, i) => {
            const on = i === idx;
            el.style.transform = 'scale(' + (on ? 1.35 : 1) + ')';
            el.style.color = on ? '#fff' : 'rgba(255,255,255,0.6)';
            el.style.textShadow = on
                ? '0 0 16px rgba(255,255,255,0.5),0 1px 4px rgba(0,0,0,0.3)'
                : '0 1px 4px rgba(0,0,0,0.2)';
        });
    }

    handleRadialMouseMove(dispX, dispY) {
        if (!this._radialWheel || !this._tabRadialOrigin) return;
        // dispX/dispY 为指针相对呼出点的位移，虚拟指针 = 圆心 + 位移
        this._virtX = Math.max(0, Math.min(window.innerWidth, this._tabRadialOrigin.x + dispX));
        this._virtY = Math.max(0, Math.min(window.innerHeight, this._tabRadialOrigin.y + dispY));
        if (this._tabOriginDot) {
            this._tabOriginDot.style.left = this._virtX + 'px';
            this._tabOriginDot.style.top = this._virtY + 'px';
        }

        const dx = this._virtX - this._tabRadialOrigin.x;
        const dy = this._virtY - this._tabRadialOrigin.y;
        const mag = Math.sqrt(dx * dx + dy * dy);

        if (mag > this.tabRadialThreshold) {
            const idx = this.bestRadialIndex(dx, dy);
            if (this._radialSelectedIdx === idx) return;
            // 同方向持续超过确认时间才选中，过滤晃动时的瞬时越界
            if (this._radialCandidateIdx === idx) {
                if (Date.now() - this._radialCandidateTime >= this.tabRadialConfirmDelay) {
                    this._radialSelectedIdx = idx;
                    this.radialSelected = this.radialItems[idx].action;
                    this.highlightRadialItem(idx);
                }
            } else {
                this._radialCandidateIdx = idx;
                this._radialCandidateTime = Date.now();
            }
        } else if (this._radialSelectedIdx >= 0) {
            // 迟滞：确认后拉回内圈才算取消，边界抖动不会反复触发
            if (mag <= this.tabRadialInnerRadius) {
                this._resetRadialCandidate();
                this._radialSelectedIdx = -1;
                this.radialSelected = null;
                this.highlightRadialItem(-1);
            }
        } else {
            this._resetRadialCandidate();
        }
    }

    bestRadialIndex(dx, dy) {
        const N = this.radialItems.length;
        let bestIdx = 0, bestDot = -Infinity;
        for (let i = 0; i < N; i++) {
            const a = (i / N) * 2 * Math.PI - Math.PI / 2;
            const dot = dx * Math.cos(a) + dy * Math.sin(a);
            if (dot > bestDot) { bestDot = dot; bestIdx = i; }
        }
        return bestIdx;
    }

    _resetRadialCandidate() {
        this._radialCandidateIdx = -1;
        this._radialCandidateTime = 0;
    }

    arrowKeyDir(key) {
        switch (key) {
            case 'ArrowUp': return 'up';
            case 'ArrowDown': return 'down';
            case 'ArrowLeft': return 'left';
            case 'ArrowRight': return 'right';
            default: return null;
        }
    }

    radialIndexForDirs(dirs) {
        const key = dirs.slice().sort().join('|');
        const map = {
            'up': 0,
            'up|right': 1,
            'right': 2,
            'down|right': 3,
            'down': 4,
            'down|left': 5,
            'left': 6,
            'left|up': 7
        };
        return (key in map) ? map[key] : -1;
    }

    resolveRadialArrowCombo() {
        clearTimeout(this._radialArrowTimer);
        this._radialArrowTimer = null;
        const dirs = Array.from(this._radialArrowDirs);
        if (dirs.length === 2) {
            // 两键组合（斜向）立即触发
            const idx = this.radialIndexForDirs(dirs);
            if (idx >= 0) this.fireRadialIndex(idx);
        } else if (dirs.length === 1) {
            // 单键稍作等待，若期间按下相邻键则构成斜向组合
            this._radialArrowTimer = setTimeout(() => {
                this._radialArrowTimer = null;
                this._radialArrowDirs.clear();
                if (this.radialActive) this.fireRadialIndex(this.radialIndexForDirs(dirs));
            }, this.radialArrowComboDelay);
        }
    }

    fireRadialIndex(idx) {
        if (!this.radialActive || idx < 0 || idx >= this.radialItems.length) return;
        this.highlightRadialItem(idx);
        const action = this.radialItems[idx].action;
        this.hideRadialMenu();
        this.doRadialAction(action);
    }

    canTriggerTabRadial() {
        const modal = document.getElementById('settings-modal');
        if (modal && modal.classList.contains('show')) return false;
        if (this.ooo && this.ooo.settings && this.ooo.settings.shortcutsEnabled === false) return false;
        return true;
    }

    setCursorHidden(hidden) {
        let style = document.getElementById('ooo-hide-cursor-style');
        if (hidden) {
            if (!style) {
                style = document.createElement('style');
                style.id = 'ooo-hide-cursor-style';
                style.textContent = '* { cursor: none !important; }';
                document.head.appendChild(style);
            }
        } else if (style) {
            style.remove();
        }
    }

    handleRadialButtons() {
        const escBtn = this.settings.invertAB ? 1 : 0;

        if (this._radialMode === 'hold') {
            if (!this.btnState[4] || this.btnPressed(escBtn)) {
                this.hideRadialMenu();
            }
        } else if (this._radialMode === 'toggle') {
            if (this.btnPressed(2) || this.btnPressed(escBtn)) {
                this.hideRadialMenu();
            }
        }
    }

    toggleController() {
        this.settings.enabled = !this.settings.enabled;
        if (this.settings.enabled) {
            if (this.connected) {
                this.showCursor(true);
                this.updateNavTargets();
            }
            this.focusSearchInput();
        } else {
            this.showCursor(false);
            this.clearHighlight();
            this.ltHeld = false;
            this.rtHeld = false;
            if (this.radialActive) this.hideRadialMenu();
        }
        this.saveSettings();
        this.updateSubSettingsUI();
        if (this.ooo) this.ooo.showNotification(this.settings.enabled ? '手柄控制器：开启' : '手柄控制器：关闭');
    }

    updateSubSettingsUI() {
        const container = document.getElementById('controller-settings');
        if (container) {
            container.style.display = this.settings.enabled ? 'block' : 'none';
        }
    }

    syncSettingsUI() {
        const toggle = document.getElementById('controller-toggle');
        if (toggle) toggle.checked = this.settings.enabled;
        const speed = document.getElementById('controller-speed');
        const speedVal = document.getElementById('controller-speed-value');
        if (speed) speed.value = this.settings.cursorSpeed;
        if (speedVal) speedVal.value = this.settings.cursorSpeed;
        const inv = document.getElementById('controller-invert-ab');
        if (inv) inv.checked = this.settings.invertAB;
        const ls = document.getElementById('controller-ls-select');
        if (ls) ls.value = this.settings.customLS;
        const rs = document.getElementById('controller-rs-select');
        if (rs) rs.value = this.settings.customRS;
        this.updateSubSettingsUI();
    }

    initUI() {
        const toggle = document.getElementById('controller-toggle');
        if (toggle) {
            toggle.addEventListener('change', () => this.toggleController());
        }

        const speed = document.getElementById('controller-speed');
        const speedVal = document.getElementById('controller-speed-value');
        if (speed && speedVal) {
            const updateSpeed = (v) => {
                const val = parseInt(v) || 6;
                speed.value = val;
                speedVal.value = val;
                this.settings.cursorSpeed = val;
                this.saveSettings();
            };
            speed.addEventListener('input', (e) => updateSpeed(e.target.value));
            speedVal.addEventListener('input', (e) => updateSpeed(e.target.value));
            speedVal.addEventListener('wheel', (e) => {
                e.preventDefault();
                let val = parseInt(e.target.value) || 6;
                val += e.deltaY > 0 ? -1 : 1;
                if (val < 1) val = 1;
                if (val > 20) val = 20;
                updateSpeed(val);
            });
        }

        const inv = document.getElementById('controller-invert-ab');
        if (inv) {
            inv.addEventListener('change', () => {
                this.settings.invertAB = inv.checked;
                this.saveSettings();
                if (this.ooo) this.ooo.showNotification(
                    this.settings.invertAB ? 'A/B键：已反转' : 'A/B键：正常'
                );
            });
        }

        document.getElementById('controller-ls-select').addEventListener('change', (e) => {
            this.settings.customLS = e.target.value;
            this.saveSettings();
        });
        document.getElementById('controller-rs-select').addEventListener('change', (e) => {
            this.settings.customRS = e.target.value;
            this.saveSettings();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const controller = new Controller();
        runtime.controller = controller;
        // 保留全局引用：script.js 判断径向菜单是否激活时读 window.oooController
        window.oooController = controller;
    }, 500);
});

// ==== main/Script/core/mixins/BadgeMixin.js ====
// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

const BadgeMixin = {
    normalizeBadgeAction(value) {
        return (value === 'settings' || value === 'audio' || value === 'none') ? value : 'settings';
    },
    getBadgeActionLabel(value) {
        const action = this.normalizeBadgeAction(value);
        return action === 'audio' ? '播放OCP' : action === 'settings' ? '打开设置' : '无';
    },
    getBadgeActionSummary() {
        return this.getBadgeActionLabel(this.settings.badgeDblClickAction)
            + ' · ' + this.getBadgeActionLabel(this.settings.badgeContextMenuAction);
    },
    syncBadgeOpenMethodUI() {
        const group = document.getElementById('badge-open-method-group');
        if (group) {
            group.style.display = this.settings.hiddenBadge ? 'none' : '';
        }
        // OCP 播控依附于铭牌 hover，铭牌隐藏时一并隐藏设置项与已展开的播控
        const ocpGroup = document.getElementById('ocp-player-group');
        if (ocpGroup) {
            ocpGroup.style.display = this.settings.hiddenBadge ? 'none' : '';
        }
        if (this.settings.hiddenBadge) {
            this.hideOcpPlayer();
        }
        const selectedDisplay = document.getElementById('badge-open-method-selected');
        if (selectedDisplay) {
            selectedDisplay.textContent = this.getBadgeActionSummary();
        }
        // 铭牌已隐藏时，若右面板仍停留在该设置视图则退回占位内容，避免展示失效设置
        const rpu = document.getElementById('right-panel-upper');
        if (this.settings.hiddenBadge && rpu && rpu.dataset.menuType === 'badge-open-method') {
            this.closeSettingsMenuInRightPanel();
        }
        // 铭牌隐藏后停止音效与光效，避免在不可见元素上继续播放
        if (this.settings.hiddenBadge) {
            this.stopBadgeAudio();
        }
    },
    runBadgeAction(action) {
        if (action === 'settings') {
            this.openSettings('badge');
        } else if (action === 'audio') {
            this.toggleBadgeAudio();
        }
    },
    setupBadgeOpenMethod() {
        const badge = document.getElementById('ooo-badge');
        if (!badge) return;

        // 通过引用移除之前绑定的监听器，避免克隆替换元素导致
        // 其他监听器（10次点击彩蛋、悬停弹窗等）丢失
        if (this._badgeToggleHandler) {
            badge.removeEventListener('click', this._badgeToggleHandler);
        }
        if (this._badgeDblClickHandler) {
            badge.removeEventListener('dblclick', this._badgeDblClickHandler);
        }
        if (this._badgeContextMenuHandler) {
            badge.removeEventListener('contextmenu', this._badgeContextMenuHandler);
        }

        // 重新绑定点击事件（用于切换文本）
        this._badgeToggleHandler = () => this.toggleBadgeText();
        badge.addEventListener('click', this._badgeToggleHandler);

        const dblAction = this.normalizeBadgeAction(this.settings.badgeDblClickAction);
        const ctxAction = this.normalizeBadgeAction(this.settings.badgeContextMenuAction);

        // 当前配置已不再需要音效时，停掉可能在播的音频并收起光效
        if (dblAction !== 'audio' && ctxAction !== 'audio') {
            this.stopBadgeAudio();
        }

        if (dblAction !== 'none') {
            this._badgeDblClickHandler = () => this.runBadgeAction(dblAction);
            badge.addEventListener('dblclick', this._badgeDblClickHandler);
        }

        if (ctxAction !== 'none') {
            this._badgeContextMenuHandler = (e) => {
                e.preventDefault();
                this.runBadgeAction(ctxAction);
            };
            badge.addEventListener('contextmenu', this._badgeContextMenuHandler);
        }
    },
    toggleBadgeText() {
        const badge = document.getElementById('ooo-badge');
        const hasAnimation = this.settings.dynamicBlur || this.settings.enhancedDisplay;

        // 复用现有的 info-indicator 节点，避免 innerHTML 重建导致
        // InfoManager 持有的旧引用失效（颜色/显示状态无法更新）
        const rebuildBadgeContent = () => {
            let indicator = document.getElementById('info-indicator');
            if (!indicator) {
                indicator = document.createElement('div');
                indicator.id = 'info-indicator';
                indicator.className = 'info-indicator';
            }

            if (this.isBadgeExpanded) {
                badge.innerHTML = '<span>OOOInterface</span>';
            } else {
                badge.innerHTML = `OOOInterface(${this.currentVersion})`;
            }
            badge.appendChild(indicator);

            // 同步指示器颜色与可见状态
            if (this.infoManager && typeof this.infoManager.refreshInfoIndicator === 'function') {
                this.infoManager.refreshInfoIndicator();
            }
        };

        if (hasAnimation) {
            badge.style.transform = 'scale(0.95)';
            badge.style.opacity = '0.8';

            setTimeout(() => {
                rebuildBadgeContent();

                badge.style.transform = 'scale(1)';
                badge.style.opacity = '1';

                this.isBadgeExpanded = !this.isBadgeExpanded;
            }, 100);
        } else {
            rebuildBadgeContent();

            this.isBadgeExpanded = !this.isBadgeExpanded;
        }
    },
    calculateBadgeOrigin(modal) {
        const badge = document.getElementById('ooo-badge');
        const content = modal.querySelector('.modal-content');
        if (!badge || !content) return;

        const badgeRect = badge.getBoundingClientRect();
        const badgeCenterX = badgeRect.left + badgeRect.width / 2;
        const badgeCenterY = badgeRect.top + badgeRect.height / 2;

        // 临时候获取内容区未变换的尺寸（同在 rAF 内，不会触发重绘）
        const origTransform = content.style.transform;
        content.style.transform = 'none';
        const contentRect = content.getBoundingClientRect();
        content.style.transform = origTransform;

        const originX = ((badgeCenterX - contentRect.left) / contentRect.width) * 100;
        const originY = ((badgeCenterY - contentRect.top) / contentRect.height) * 100;

        content.style.setProperty('--badge-origin-x', Math.max(0, Math.min(100, originX)) + '%');
        content.style.setProperty('--badge-origin-y', Math.max(0, Math.min(100, originY)) + '%');
    },
renderBadgeConfigView (rightPanelUpper) {
    const self = this;
    if (!rightPanelUpper) return;

    rightPanelUpper.dataset.menuType = 'badge-open-method';

    const container = document.createElement('div');
    container.className = 'settings-menu-container slide-in-right';

    const actions = [
        { key: 'badgeDblClickAction', label: '双击' },
        { key: 'badgeContextMenuAction', label: '右键' }
    ];

    actions.forEach(({ key, label }) => {
        const row = document.createElement('div');
        row.className = 'badge-action-row';

        const rowLabel = document.createElement('label');
        rowLabel.textContent = label;
        row.appendChild(rowLabel);

        const options = [
            { value: 'settings', text: '打开设置' },
            { value: 'audio', text: '播放OCP' },
            { value: 'none', text: '无' }
        ];
        const current = self.normalizeBadgeAction(self.settings[key]);
        const currentIdx = Math.max(0, options.findIndex(o => o.value === current));

        const seg = document.createElement('div');
        seg.className = 'badge-action-segmented pos-' + currentIdx;

        const thumb = document.createElement('div');
        thumb.className = 'badge-action-thumb';
        seg.appendChild(thumb);

        options.forEach((opt, idx) => {
            const span = document.createElement('span');
            span.className = 'badge-action-label l' + idx + (idx === currentIdx ? ' active' : '');
            span.textContent = opt.text;
            span.setAttribute('role', 'button');
            span.setAttribute('tabindex', '0');
            span.setAttribute('title', opt.text);

            const select = () => {
                if (self.settings[key] === opt.value) return;
                const value = self.normalizeBadgeAction(opt.value);
                self.settings[key] = value;
                // 移动滑块并更新高亮
                seg.classList.remove('pos-0', 'pos-1', 'pos-2');
                seg.classList.add('pos-' + idx);
                seg.querySelectorAll('.badge-action-label').forEach((el, i) => {
                    el.classList.toggle('active', i === idx);
                });
                // 立即生效并持久化（与其他右面板选择器一致，不弹提示）
                self.setupBadgeOpenMethod();
                self.syncBadgeOpenMethodUI();
                self.saveSettings();
            };

            span.addEventListener('click', (e) => {
                e.stopPropagation();
                select();
            });
            span.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    select();
                }
            });

            seg.appendChild(span);
        });

        row.appendChild(seg);
        container.appendChild(row);
    });

    rightPanelUpper.appendChild(container);
    const modal = document.getElementById('settings-modal');
    if (modal) modal.classList.add('right-panel-open');
},
};

// ==== main/Script/core/mixins/BadgeAudioMixin.js ====
// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

const BadgeAudioMixin = {
    getBadgeAudio() {
        if (!this._badgeAudio) {
            const audio = new Audio(this.ocpAudioUrl);
            audio.addEventListener('play', () => {
                // OCP 已开始播放：此后 hover 铭牌才允许呼出播控；同时惰性读取曲目元数据
                this._ocpHasStarted = true;
                this.loadOcpTrackMeta();
                this.setBadgeAudioGlow(true);
                this.syncOcpPlayerState();
                this.updateBadgeAudioProgress();
                // 先用占位文案顶上，读到音源标签后再刷新为真实曲目信息
                this.updateOcpMediaSessionMeta();
                this.updateOcpMediaSessionState();
            });
            audio.addEventListener('pause', () => {
                this.setBadgeAudioGlow(false);
                this.syncOcpPlayerState();
                this.updateOcpMediaSessionState();
            });
            audio.addEventListener('ended', () => {
                this.updateBadgeAudioProgress();
                this.setBadgeAudioGlow(false);
                this.syncOcpPlayerState();
                this.updateOcpMediaSessionState();
            });
            audio.addEventListener('error', () => {
                this.setBadgeAudioGlow(false);
                this.syncOcpPlayerState();
                this.updateOcpMediaSessionState();
            });
            // 进度光带长度跟随播放进度
            audio.addEventListener('timeupdate', () => this.updateBadgeAudioProgress());
            audio.addEventListener('loadedmetadata', () => this.updateBadgeAudioProgress());
            this._badgeAudio = audio;
            // 交给浏览器媒体播控（系统媒体面板 / 媒体键）接管
            this.setupOcpMediaSession();
            this.updateOcpMediaSessionState();
        }
        return this._badgeAudio;
    },
    updateBadgeAudioProgress() {
        const badge = document.getElementById('ooo-badge');
        const audio = this._badgeAudio;
        if (!badge || !audio) return;

        let ratio = 0;
        const duration = audio.duration;
        if (audio.ended) {
            ratio = 1;
        } else if (isFinite(duration) && duration > 0) {
            ratio = Math.min(1, Math.max(0, audio.currentTime / duration));
        }
        badge.style.setProperty('--badge-audio-progress', ratio.toFixed(4));
    },
    toggleBadgeAudio() {
        try {
            const audio = this.getBadgeAudio();
            if (!audio.paused && !audio.ended) {
                audio.pause();
                return;
            }
            // 播完后再次触发：从头播放
            if (audio.ended) audio.currentTime = 0;
            audio.play().catch(err => {
                this.setBadgeAudioGlow(false);
                console.error('播放音频失败:', err);
            });
        } catch (err) {
            this.setBadgeAudioGlow(false);
            console.error('播放音频失败:', err);
        }
    },
    playBadgeAudio() {
        try {
            const audio = this.getBadgeAudio();
            audio.currentTime = 0;
            audio.play().catch(err => {
                this.setBadgeAudioGlow(false);
                console.error('播放音频失败:', err);
            });
        } catch (err) {
            this.setBadgeAudioGlow(false);
            console.error('播放音频失败:', err);
        }
    },
    stopBadgeAudio() {
        if (this._badgeAudio && !this._badgeAudio.paused) {
            this._badgeAudio.pause();
        }
        this.setBadgeAudioGlow(false);
    },
    setBadgeAudioGlow(on) {
        const badge = document.getElementById('ooo-badge');
        if (badge) badge.classList.toggle('badge-audio-playing', !!on);
    },
    setupOcpPlayer() {
        if (this._ocpPlayerBound) return;
        const badge = document.getElementById('ooo-badge');
        const popover = document.getElementById('ocp-player-popover');
        if (!badge || !popover) return;
        this._ocpPlayerBound = true;

        // 播放按钮与铭牌双击/右键共用同一切换逻辑（播放中→暂停，暂停/播完→播放）
        const playBtn = document.getElementById('ocp-play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleBadgeAudio();
            });
        }

        // 点击封面：新标签页打开在线播放器（保留当前新标签页）
        const coverBtn = document.getElementById('ocp-cover-btn');
        if (coverBtn) {
            coverBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                window.open(this.ocpPlayerUrl, '_blank');
            });
        }

        // hover 铭牌显示；移出铭牌/播控延迟隐藏，跨越两者间隙时取消隐藏
        badge.addEventListener('mouseenter', () => this.showOcpPlayer());
        badge.addEventListener('mouseleave', () => this.scheduleHideOcpPlayer());
        popover.addEventListener('mouseenter', () => this.cancelHideOcpPlayer());
        popover.addEventListener('mouseleave', () => this.scheduleHideOcpPlayer());

        // 兜底：点击页面其他位置（含滚动进入壁纸模式前的点击）时收起播控
        document.addEventListener('click', (e) => {
            if (!popover.classList.contains('show')) return;
            if (popover.contains(e.target) || badge.contains(e.target)) return;
            this.hideOcpPlayer();
        });
    },
    isOcpPlayerAvailable() {
        if (!this.settings.ocpPlayerEnabled || !this._ocpHasStarted) return false;
        // 铭牌被隐藏（隐藏铭牌开关等）时不可呼出；壁纸模式由 pointer-events:none 天然拦截
        const badge = document.getElementById('ooo-badge');
        return !!(badge && badge.offsetParent !== null);
    },
    showOcpPlayer() {
        if (!this.isOcpPlayerAvailable()) return;
        const popover = document.getElementById('ocp-player-popover');
        if (!popover) return;
        this.cancelHideOcpPlayer();
        this.syncOcpPlayerState();
        popover.classList.add('show');
        popover.setAttribute('aria-hidden', 'false');
    },
    scheduleHideOcpPlayer() {
        this.cancelHideOcpPlayer();
        this._ocpHideTimer = setTimeout(() => {
            this._ocpHideTimer = null;
            this.hideOcpPlayer();
        }, 240);
    },
    cancelHideOcpPlayer() {
        if (this._ocpHideTimer) {
            clearTimeout(this._ocpHideTimer);
            this._ocpHideTimer = null;
        }
    },
    hideOcpPlayer() {
        this.cancelHideOcpPlayer();
        const popover = document.getElementById('ocp-player-popover');
        if (!popover) return;
        popover.classList.remove('show');
        popover.setAttribute('aria-hidden', 'true');
    },
    syncOcpPlayerState() {
        const card = document.querySelector('.ocp-player-card');
        const icon = document.querySelector('#ocp-play-btn .material-icons');
        const audio = this._badgeAudio;
        const playing = !!(audio && !audio.paused && !audio.ended);
        if (card) card.classList.toggle('playing', playing);
        if (icon) icon.textContent = playing ? 'pause' : 'play_arrow';
    },
    setupOcpMediaSession() {
        if (this._ocpMediaSessionBound) return;
        if (!('mediaSession' in navigator)) return;
        this._ocpMediaSessionBound = true;

        // 单个动作不被当前浏览器支持时 setActionHandler 会抛错，逐个静默跳过
        const bind = (action, handler) => {
            try {
                navigator.mediaSession.setActionHandler(action, handler);
            } catch (err) {
                /* 该动作在当前浏览器不受支持，忽略 */
            }
        };
        bind('play', () => this.resumeBadgeAudio());
        bind('pause', () => this.pauseBadgeAudio());
        // 系统面板的进度拖拽（单曲场景只做 seek，不提供上一首/下一首）
        bind('seekto', (details) => this.seekBadgeAudio(details && details.seekTime));
    },
    updateOcpMediaSessionMeta() {
        if (!('mediaSession' in navigator) || typeof MediaMetadata === 'undefined') return;
        const titleEl = document.querySelector('.ocp-player-title');
        const artistEl = document.querySelector('.ocp-player-artist');
        const track = this.getOcpTrackMeta();
        const title = (track.title || (titleEl && titleEl.textContent) || 'OCP').trim();
        const artist = (track.artist || (artistEl && artistEl.textContent) || 'ByRUDAN').trim();

        const artwork = [];
        if (this._ocpCoverUrl) {
            artwork.push({
                src: this._ocpCoverUrl,
                sizes: track.coverSizes || '512x512',
                type: track.coverType || 'image/jpeg'
            });
        }
        try {
            navigator.mediaSession.metadata = new MediaMetadata({ title, artist, artwork });
        } catch (err) {
            console.warn('设置媒体播控元数据失败:', err);
        }
    },
    updateOcpMediaSessionState() {
        if (!('mediaSession' in navigator)) return;
        const audio = this._badgeAudio;
        const state = !audio ? 'none' : (audio.paused || audio.ended ? 'paused' : 'playing');
        try {
            navigator.mediaSession.playbackState = state;
        } catch (err) {
            /* 状态同步失败不影响播放 */
        }
    },
    getOcpTrackMeta() {
        if (!this._ocpTrackMeta) {
            this._ocpTrackMeta = { title: null, artist: null, coverSizes: null, coverType: null };
        }
        return this._ocpTrackMeta;
    },
    resumeBadgeAudio() {
        try {
            const audio = this.getBadgeAudio();
            if (!audio.paused) return;
            audio.play().catch(err => {
                this.setBadgeAudioGlow(false);
                console.error('播放音频失败:', err);
            });
        } catch (err) {
            this.setBadgeAudioGlow(false);
            console.error('播放音频失败:', err);
        }
    },
    pauseBadgeAudio() {
        if (this._badgeAudio && !this._badgeAudio.paused) {
            this._badgeAudio.pause();
        }
    },
    seekBadgeAudio(seekTime) {
        const audio = this._badgeAudio;
        if (!audio || typeof seekTime !== 'number' || !isFinite(seekTime)) return;
        try {
            const duration = isFinite(audio.duration) && audio.duration > 0 ? audio.duration : seekTime;
            audio.currentTime = Math.max(0, Math.min(seekTime, duration));
        } catch (err) {
            /* 时长未知时无法定位，忽略 */
        }
    },
    loadOcpTrackMeta() {
        if (this._ocpMetaPromise) return this._ocpMetaPromise;
        this._ocpMetaPromise = (async () => {
            try {
                // 1) ID3v2：先取 10 字节标签头拿到标签长度，再按长度取标签本体
                let meta = null;
                const head = await this.readOcpSourceRange('0-9');
                if (head && this.isId3v2Tag(head)) {
                    const tagSize = this.readId3Size(head, 6);
                    const tag = tagSize > 0 ? await this.readOcpSourceRange(this.ocpHeadRange(tagSize + 9)) : null;
                    if (tag) meta = this.parseId3v2(tag);
                }
                // 2) 头部信息不全时，再读文件尾部 ID3v1 兜底
                if (!meta || !meta.title || !meta.artist) {
                    const tail = await this.readOcpSourceRange(this.ocpTailRange(128));
                    if (tail) {
                        const v1 = this.parseId3v1(tail);
                        if (v1) meta = Object.assign({ coverBlob: null }, v1, meta || {});
                    }
                }
                this.applyOcpTrackMeta(meta);
            } catch (err) {
                console.warn('读取 OCP 元数据失败，使用默认信息:', err);
            }
        })();
        return this._ocpMetaPromise;
    },
    ocpHeadRange(n) {
        const size = this._ocpSourceSize;
        const end = size ? Math.min(n, size - 1) : n;
        return `0-${end}`;
    },
    ocpTailRange(n) {
        const size = this._ocpSourceSize;
        return size && size > n ? `${size - n}-${size - 1}` : `-${n}`;
    },
    async readOcpSourceRange(range) {
        if (!this._ocpWholeSource) {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 10000);
            try {
                const res = await fetch(this.ocpAudioUrl, {
                    signal: controller.signal,
                    headers: range ? { Range: `bytes=${range}` } : undefined
                });
                if (!res.ok) return null;
                // 206 的 Content-Range（bytes 0-9/12375550）顺带给出文件总长，
                // 省掉一次 HEAD 请求；跨域未暴露该响应头时退化为「拿到多少算多少」
                const contentRange = res.headers.get('Content-Range');
                if (contentRange) {
                    const total = /\/(\d+)\s*$/.exec(contentRange);
                    if (total) this._ocpSourceSize = parseInt(total[1], 10) || 0;
                }
                const bytes = new Uint8Array(await res.arrayBuffer());
                if (res.status === 206 || !range) {
                    if (!range) this._ocpSourceSize = bytes.length;
                    return bytes;
                }
                // 服务器忽略了 Range：把整文件留作后续复用的缓存
                this._ocpWholeSource = bytes;
                this._ocpSourceSize = bytes.length;
            } catch (err) {
                return null;
            } finally {
                clearTimeout(timer);
            }
        }
        return this.sliceOcpRange(this._ocpWholeSource, range);
    },
    sliceOcpRange(bytes, range) {
        if (!range || !bytes) return bytes;
        const match = /^(\d*)-(\d*)$/.exec(range);
        if (!match) return bytes;
        const [, from, to] = match;
        if (from === '') {
            const n = parseInt(to, 10) || 0;
            return bytes.subarray(Math.max(0, bytes.length - n));
        }
        const start = parseInt(from, 10) || 0;
        const end = to === '' ? bytes.length - 1 : Math.min(parseInt(to, 10), bytes.length - 1);
        return bytes.subarray(start, end + 1);
    },
    isId3v2Tag(bytes) {
        return !!(bytes && bytes.length >= 10 && bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33);
    },
    readId3Size(bytes, offset) {
        return ((bytes[offset] & 0x7f) << 21) | ((bytes[offset + 1] & 0x7f) << 14) |
            ((bytes[offset + 2] & 0x7f) << 7) | (bytes[offset + 3] & 0x7f);
    },
    parseId3v2(bytes) {
        if (!this.isId3v2Tag(bytes)) return null;
        const major = bytes[3];
        if (major !== 3 && major !== 4) return null;
        const flags = bytes[5];
        // v2.4 帧长为 syncsafe（每字节 7 位），v2.3 为普通大端 uint32
        const syncsafe = (b, o) => this.readId3Size(b, o);
        const uint32 = (b, o) => (b[o] << 24) | (b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3];
        const tagSize = syncsafe(bytes, 6);
        let pos = 10;
        if (flags & 0x40) { // 扩展头：v2.4 长度含自身且 syncsafe，v2.3 不含自身
            if (major === 4) pos += syncsafe(bytes, pos);
            else pos += 4 + uint32(bytes, pos);
        }
        const end = Math.min(10 + tagSize, bytes.length);
        const result = {};
        const textFrames = { TIT2: 'title', TPE1: 'artist' };
        while (pos + 10 <= end) {
            const id = String.fromCharCode(bytes[pos], bytes[pos + 1], bytes[pos + 2], bytes[pos + 3]);
            if (!/^[A-Z0-9]{4}$/.test(id)) break; // 进入填充区
            const size = major === 4 ? syncsafe(bytes, pos + 4) : uint32(bytes, pos + 4);
            if (size <= 0 || pos + 10 + size > end) break;
            const body = bytes.subarray(pos + 10, pos + 10 + size);
            if (textFrames[id]) {
                const s = this.readId3String(body, 1, body[0]);
                if (s.text) result[textFrames[id]] = s.text;
            } else if (id === 'APIC' && !result.coverBlob) {
                const enc = body[0];
                let p = 1;
                while (p < body.length && body[p] !== 0) p++; // MIME（latin1，0x00 结尾）
                const mime = new TextDecoder('windows-1252').decode(body.subarray(1, p)) || 'image/jpeg';
                p += 2; // 跳过 MIME 终止符 + 图片类型字节
                const desc = this.readId3String(body, p, enc);
                p = desc.next;
                if (p < body.length) {
                    result.coverBlob = new Blob([body.subarray(p)], { type: mime });
                }
            }
            pos += 10 + size;
        }
        return result;
    },
    readId3String(bytes, start, encoding) {
        if (encoding === 1 || encoding === 2) {
            let i = start;
            while (i + 1 < bytes.length) {
                if (bytes[i] === 0 && bytes[i + 1] === 0) break;
                i += 2;
            }
            const raw = bytes.subarray(start, i);
            return {
                text: new TextDecoder(encoding === 2 ? 'utf-16be' : 'utf-16').decode(raw),
                next: i + 2
            };
        }
        let i = start;
        while (i < bytes.length && bytes[i] !== 0) i++;
        return {
            text: new TextDecoder(encoding === 3 ? 'utf-8' : 'windows-1252').decode(bytes.subarray(start, i)),
            next: i + 1
        };
    },
    parseId3v1(bytes) {
        if (bytes.length < 128) return null;
        const tail = bytes.subarray(bytes.length - 128);
        if (String.fromCharCode(tail[0], tail[1], tail[2]) !== 'TAG') return null;
        const field = (start, len) => new TextDecoder('windows-1252')
            .decode(tail.subarray(start, start + len))
            .replace(/\0[\s\S]*$/, '')
            .trim();
        return { title: field(3, 30) || null, artist: field(33, 30) || null };
    },
    applyOcpTrackMeta(meta) {
        if (!meta) return;
        const track = this.getOcpTrackMeta();
        const titleEl = document.querySelector('.ocp-player-title');
        const artistEl = document.querySelector('.ocp-player-artist');
        if (meta.title) {
            track.title = meta.title;
            if (titleEl) titleEl.textContent = meta.title;
        }
        if (meta.artist) {
            track.artist = meta.artist;
            if (artistEl) artistEl.textContent = meta.artist;
        }
        if (meta.coverBlob) {
            track.coverType = meta.coverBlob.type || null;
            this.applyOcpCover(meta.coverBlob);
        }
        // 曲目信息变了就刷新媒体播控（封面尺寸要等图片解码后才拿得到）
        this.updateOcpMediaSessionMeta();
    },
    applyOcpCover(blob) {
        const cover = document.querySelector('.ocp-player-cover');
        if (!cover) return;
        let url = null;
        try {
            url = URL.createObjectURL(blob);
        } catch (err) {
            console.warn('应用 OCP 封面失败:', err);
            return;
        }
        const probe = new Image();
        probe.onload = () => {
            // 期间可能已换成更新的封面：此时旧 URL 直接释放
            if (this._ocpCoverUrl) URL.revokeObjectURL(this._ocpCoverUrl);
            this._ocpCoverUrl = url;
            cover.classList.add('has-art');
            cover.style.backgroundImage = `url("${url}")`;
            // 图片解码后才有真实尺寸，媒体播控的 artwork 尺寸声明在此补上
            const track = this.getOcpTrackMeta();
            if (probe.naturalWidth && probe.naturalHeight) {
                track.coverSizes = `${probe.naturalWidth}x${probe.naturalHeight}`;
            }
            this.updateOcpMediaSessionMeta();
        };
        probe.onerror = () => {
            URL.revokeObjectURL(url);
            console.warn('音源封面无法解码，保留默认封面');
        };
        probe.src = url;
    },
};

// ==== main/Script/core/mixins/ContextMenuMixin.js ====
// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

const ContextMenuMixin = {
    initContextMenu() {
        this.contextMenu = document.getElementById('context-menu');
        this.contextMenuItems = document.querySelectorAll('.context-menu-item');
        this.updateContextMenuIcons();
        this.initContextMenuCustomize();
    },
    updateContextMenuIcons() {
        // 更新所有可切换菜单项的图标
        const toggleMap = {
            'search-history-toggle': () => this.settings.searchHistory ? 'check_box' : 'check_box_outline_blank',
            'search-suggestions-toggle': () => this.settings.searchSuggestions ? 'check_box' : 'check_box_outline_blank',
            'wallpaper-toggle': () => this.settings.persistentWallpaper ? 'check_box' : 'check_box_outline_blank',
            'enhanced-display-toggle': () => this.settings.enhancedDisplay ? 'check_box' : 'check_box_outline_blank',
            'engine-lock-toggle': () => this.settings.engineLocked ? 'check_box' : 'check_box_outline_blank',
            'hide-notifications-toggle': () => this.settings.hideNotifications ? 'check_box' : 'check_box_outline_blank',
            'hide-info-popup-toggle': () => this.settings.hideInfoPopup.enabled ? 'check_box' : 'check_box_outline_blank'
        };
        Object.keys(toggleMap).forEach(action => {
            const el = document.querySelector(`[data-action="${action}"] .md3-icon`);
            if (el) el.textContent = toggleMap[action]();
        });
    },
    initContextMenuCustomize() {
        const btn = document.getElementById('context-menu-customize-btn');
        const panel = document.getElementById('context-menu-customize-panel');
        if (!btn || !panel) return;

        // 切换面板显示
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.settings.contextMenuStyle === 'minimal') return;
            const isOpen = !panel.classList.contains('select-hide');
            panel.classList.toggle('select-hide');
            this.syncCustomizePanelUI();
        });

        // 面板内选项点击
        panel.addEventListener('click', (e) => {
            e.stopPropagation();
            const item = e.target.closest('.customize-item');
            if (!item || item.classList.contains('disabled')) return;
            const key = item.dataset.key;
            const idx = this.settings.contextMenuCustomItems.indexOf(key);
            if (idx >= 0) {
                // 取消选择
                this.settings.contextMenuCustomItems.splice(idx, 1);
            } else {
                // 选择（最多3个）
                if (this.settings.contextMenuCustomItems.length >= 3) return;
                this.settings.contextMenuCustomItems.push(key);
            }
            this.syncCustomizePanelUI();
            this.saveSettings();
        });

        // 点击外部关闭面板
        document.addEventListener('click', (e) => {
            if (!btn.contains(e.target) && !panel.contains(e.target)) {
                panel.classList.add('select-hide');
            }
        });
    },
    syncCustomizePanelUI() {
        const panel = document.getElementById('context-menu-customize-panel');
        const btn = document.getElementById('context-menu-customize-btn');
        if (!panel) return;

        const items = panel.querySelectorAll('.customize-item');
        const selected = this.settings.contextMenuCustomItems;
        const atMax = selected.length >= 3;

        items.forEach(item => {
            const key = item.dataset.key;
            const isSelected = selected.includes(key);
            item.classList.toggle('selected', isSelected);
            item.classList.toggle('disabled', !isSelected && atMax);
            const icon = item.querySelector('.checkbox-icon');
            if (icon) {
                icon.textContent = isSelected ? 'check_box' : 'check_box_outline_blank';
            }
        });

        // 更新计数
        const countEl = document.getElementById('customize-selected-count');
        if (countEl) {
            countEl.textContent = `${selected.length}/3 已选择`;
        }

        // 极简模式下禁用
        const isMinimal = this.settings.contextMenuStyle === 'minimal';
        if (btn) btn.disabled = isMinimal;
        if (isMinimal) {
            panel.classList.add('select-hide');
        }
    },
    applyContextMenuCustomItems() {
        const toggleActions = [
            'search-history-toggle',
            'search-suggestions-toggle',
            'wallpaper-toggle',
            'enhanced-display-toggle',
            'engine-lock-toggle',
            'hide-notifications-toggle',
            'hide-info-popup-toggle'
        ];
        const selected = this.settings.contextMenuCustomItems;
        const isMinimal = this.settings.contextMenuStyle === 'minimal';

        toggleActions.forEach(action => {
            const el = document.querySelector(`.context-menu-item[data-action="${action}"]`);
            if (el) {
                if (isMinimal || !selected.includes(action)) {
                    el.style.display = 'none';
                } else {
                    el.style.display = '';
                }
            }
        });

        // 同步更新面板UI
        this.syncCustomizePanelUI();
    },
    showContextMenu(e) {
        if (!this.contextMenu) return;

        // 应用右键菜单样式（compact/minimal 类）
        this.applyContextMenuStyle();

        // 根据自定义设置显示/隐藏菜单项
        this.applyContextMenuCustomItems();

        // 先设置位置，再显示菜单
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // 计算菜单位置，确保在视口内
        let left = e.clientX;
        let top = e.clientY;

        // 临时显示菜单以获取尺寸
        this.contextMenu.style.display = 'block';
        const rect = this.contextMenu.getBoundingClientRect();

        if (left + rect.width > viewportWidth) {
            left = viewportWidth - rect.width - 10;
        }

        // 根据鼠标位置决定菜单展开方向
        const screenMidpoint = viewportHeight / 2;
        if (e.clientY < screenMidpoint) {
            // 鼠标在屏幕上半部分，菜单最高点在鼠标位置
            top = e.clientY;
        } else {
            // 鼠标在屏幕下半部分，菜单最低点在鼠标位置
            top = e.clientY - rect.height;
        }

        // 确保菜单不会超出视口
        if (top < 0) {
            top = 10;
        }
        if (top + rect.height > viewportHeight) {
            top = viewportHeight - rect.height - 10;
        }

        this.contextMenu.style.left = `${left}px`;
        this.contextMenu.style.top = `${top}px`;

        // 移除 hiding 类
        this.contextMenu.classList.remove('hiding');

        // 根据dynamicBlur设置决定是否添加动画
        if (this.settings.dynamicBlur) {
            // 移除no-animation类，启用动画
            this.contextMenu.classList.remove('no-animation');
            // 显示菜单并触发动画
            setTimeout(() => {
                this.contextMenu.classList.add('show');
            }, 10);
        } else {
            // 添加no-animation类，禁用动画
            this.contextMenu.classList.add('no-animation');
            // 直接显示菜单，无动画
            this.contextMenu.classList.add('show');
        }
    },
    hideContextMenu() {
        if (this.contextMenu && this.contextMenu.classList.contains('show')) {
            // 根据dynamicBlur设置决定是否添加动画
            if (!this.settings.dynamicBlur) {
                // 添加no-animation类，禁用动画
                this.contextMenu.classList.add('no-animation');
            }

            this.contextMenu.classList.remove('show');
            this.contextMenu.classList.add('hiding');

            // 根据dynamicBlur设置决定是否等待动画完成
            if (this.settings.dynamicBlur) {
                // 等待动画完成后再隐藏
                setTimeout(() => {
                    this.contextMenu.classList.remove('hiding');
                    this.contextMenu.style.display = 'none';
                }, 200);
            } else {
                // 直接隐藏，无动画
                this.contextMenu.classList.remove('hiding');
                this.contextMenu.style.display = 'none';
            }
        }
    },
    handleContextMenuAction(action) {
        switch (action) {
            case 'copy':
                this.copySearchContent();
                break;
            case 'paste':
                this.pasteToSearch();
                break;
            case 'settings':
                this.openSettings('context');
                break;
            case 'refresh':
                location.reload();
                break;
            case 'search-history-toggle':
                this.toggleSearchHistorySetting();
                break;
            case 'search-suggestions-toggle':
                this.toggleSearchSuggestionsSetting();
                break;
            case 'wallpaper-toggle':
                this.toggleWallpaperSetting();
                break;
            case 'enhanced-display-toggle':
                this.toggleEnhancedDisplaySetting();
                break;
            case 'engine-lock-toggle':
                this.toggleEngineLockSetting();
                break;
            case 'hide-notifications-toggle':
                this.toggleHideNotificationsSetting();
                break;
            case 'hide-info-popup-toggle':
                this.toggleHideInfoPopupSetting();
                break;
            case 'about':
                window.location.href = 'about/about.html';
                break;
            case 'feedback':
                window.location.href = 'FB/fb.html';
                break;
        }
    },
    applyContextMenuStyle() {
        const contextMenuGrid = document.querySelector('.context-menu-grid');
        if (!contextMenuGrid) return;

        // 移除所有样式类
        contextMenuGrid.classList.remove('compact', 'minimal');

        // 添加选中的样式类
        if (this.settings.contextMenuStyle === 'compact') {
            contextMenuGrid.classList.add('compact');
        } else if (this.settings.contextMenuStyle === 'minimal') {
            contextMenuGrid.classList.add('minimal');
        }

        // 根据Logo选择更新右键菜单配色
        this.updateContextMenuColors();

        // 同步自定义面板状态（极简模式禁用）
        this.syncCustomizePanelUI();
    },
    updateContextMenuColors() {
        const contextMenu = document.getElementById('context-menu');
        if (!contextMenu) return;

        const menuItems = document.querySelectorAll('.context-menu-item');
        const colorConfig = this.getColorConfig();
        const isDark = this.isDarkMode;

        let hoverColor, textColor;
        if (this.settings.dynamicBlur) {
            hoverColor = isDark ? colorConfig.accentDark : colorConfig.accent;
            // 黑白色在深色模式下：白色背景（accentDark=#ffffff）+ #d0d0d0 灰色文字 = 对比度 1.54:1 不可读
            // 改为黑色文字，对比度 21:1；其他配色保持原来的 contextMenuTextColorDark 不变
            if (this.settings.colorScheme === 'black-white' && isDark) {
                textColor = '#000000';
            } else {
                textColor = isDark ? colorConfig.contextMenuTextColorDark : colorConfig.contextMenuTextColor;
            }
        } else {
            hoverColor = isDark ? colorConfig.contextMenuHoverDark : colorConfig.contextMenuHover;
            textColor = isDark ? colorConfig.contextMenuTextColorDark : colorConfig.contextMenuTextColor;
        }

        contextMenu.style.setProperty('--context-menu-color', hoverColor);
        contextMenu.style.setProperty('--context-menu-text-color', textColor);
        menuItems.forEach(item => {
            item.style.setProperty('--context-menu-color', hoverColor);
            item.style.setProperty('--context-menu-text-color', textColor);
        });
    },
backToContextMenuStyleView (rightPanelUpper) {
    this._doBackToContextMenuStyleView(rightPanelUpper);
},
_doBackToContextMenuStyleView (rightPanelUpper) {
    delete rightPanelUpper.dataset.customizeEntered;
    const items = document.getElementById('context-menu-style-items');
    if (!items) return;
    const selected = document.getElementById('context-menu-style-selected');
    const hiddenSelect = document.getElementById('context-menu-style');
    if (!selected || !hiddenSelect) return;
    // 自定义项面板向右推出、右键菜单样式列表从左推入（iOS 式 pop）
    this.panelTransition(rightPanelUpper, 'pop', () => {
        this.showSettingsMenuInRightPanel(items, selected, hiddenSelect, true);
    });
},
renderContextMenuCustomizeView (rightPanelUpper) {
    const self = this;

    rightPanelUpper.innerHTML = '';
    rightPanelUpper.dataset.subView = 'customize-items';

    const isFirstEnter = !rightPanelUpper.dataset.customizeEntered;
    if (isFirstEnter) {
        rightPanelUpper.dataset.customizeEntered = 'true';
    }

    const container = document.createElement('div');
    container.className = 'settings-menu-container' + (isFirstEnter ? ' slide-in-right' : '');

    const title = document.createElement('div');
    title.style.cssText = 'font-size:14px;font-weight:600;color:var(--text-color);margin-bottom:12px;';
    title.textContent = '自定义菜单项 (' + self.settings.contextMenuCustomItems.length + '/3)';
    container.appendChild(title);

    const itemsList = document.createElement('div');
    itemsList.className = 'settings-menu-options';

    const allItems = [
        { key: 'search-history-toggle', label: '搜索历史' },
        { key: 'search-suggestions-toggle', label: '热搜词建议' },
        { key: 'wallpaper-toggle', label: '壁纸常显示' },
        { key: 'enhanced-display-toggle', label: '高级视觉效果' },
        { key: 'engine-lock-toggle', label: '引擎锁定' },
        { key: 'hide-notifications-toggle', label: '隐藏弹窗' },
        { key: 'hide-info-popup-toggle', label: '禁止提示' }
    ];

    allItems.forEach(item => {
        const isSelected = self.settings.contextMenuCustomItems.includes(item.key);
        const atMax = self.settings.contextMenuCustomItems.length >= 3;

        const icon = document.createElement('span');
        icon.className = 'material-icons md3-icon';
        icon.textContent = isSelected ? 'check_box' : 'check_box_outline_blank';
        icon.style.cssText = 'font-size:20px;color:var(--text-secondary);transition:all 0.2s ease;';

        const label = document.createElement('span');
        label.textContent = item.label;
        label.style.cssText = 'font-size:13px;color:var(--text-color);flex:1;';

        const option = document.createElement('div');
        option.className = 'settings-menu-option';
        option.style.cssText = 'display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:pointer;border-radius:8px;transition:background 0.15s;user-select:none;';
        option.addEventListener('mouseenter', () => {
            option.style.background = 'rgba(128,128,128,0.08)';
            icon.style.transform = 'scale(1.1)';
        });
        option.addEventListener('mouseleave', () => {
            option.style.background = 'transparent';
            icon.style.transform = 'scale(1)';
        });

        option.appendChild(icon);
        option.appendChild(label);

        if (!isSelected && atMax) {
            option.style.opacity = '0.4';
            option.style.cursor = 'not-allowed';
        } else {
            option.addEventListener('click', () => {
                const idx = self.settings.contextMenuCustomItems.indexOf(item.key);
                if (idx >= 0) {
                    self.settings.contextMenuCustomItems.splice(idx, 1);
                } else {
                    if (self.settings.contextMenuCustomItems.length >= 3) {
                        self.showNotification('最多只能选择3个菜单项');
                        return;
                    }
                    self.settings.contextMenuCustomItems.push(item.key);
                }
                self.saveSettings();
                self.renderContextMenuCustomizeView(rightPanelUpper);
            });
        }

        itemsList.appendChild(option);
    });

    container.appendChild(itemsList);
    rightPanelUpper.appendChild(container);
},
};

// ==== main/Script/core/mixins/VisualEffectsMixin.js ====
// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

const VisualEffectsMixin = {
    syncSimpleVisualMode() {
        this.settings.simpleVisualMode = !!(this.settings.hideNotifications
            || (this.settings.hideInfoPopup && this.settings.hideInfoPopup.enabled)
            || this.settings.hiddenBadge);
    },
    initAdvancedVisualEffects() {
        // 创建粒子容器
        if (!document.getElementById('particles-container')) {
            const particlesContainer = document.createElement('div');
            particlesContainer.id = 'particles-container';
            document.body.appendChild(particlesContainer);
        }

        // 创建光晕容器
        if (!document.getElementById('glow-orbs-container')) {
            const glowOrbsContainer = document.createElement('div');
            glowOrbsContainer.id = 'glow-orbs-container';
            document.body.appendChild(glowOrbsContainer);
        }

        // 初始化粒子
        this.particles = [];
        this.glowOrbs = [];
        this.particleInterval = null;
        this.isAdvancedEffectsActive = false;

        // 如果开启了动态模糊（高级视觉效果），立即预启动动画
        if (this.settings.dynamicBlur) {
            // 等待 DOM 加载完成后启动
            requestAnimationFrame(() => {
                this.startAdvancedVisualEffects();
            });
        }
    },
    startAdvancedVisualEffects() {
        if (this.isAdvancedEffectsActive) return;
        this.isAdvancedEffectsActive = true;

        // 立即创建光晕
        this.createGlowOrbs();
    },
    stopAdvancedVisualEffects() {
        this.isAdvancedEffectsActive = false;

        // 停止粒子生成
        if (this.particleInterval) {
            clearInterval(this.particleInterval);
            this.particleInterval = null;
        }

        // 移除所有粒子
        const particlesContainer = document.getElementById('particles-container');
        if (particlesContainer) {
            particlesContainer.innerHTML = '';
        }

        // 移除所有光晕
        const glowOrbsContainer = document.getElementById('glow-orbs-container');
        if (glowOrbsContainer) {
            glowOrbsContainer.innerHTML = '';
        }

        this.particles = [];
        this.glowOrbs = [];
    },
    createParticle() {
        const container = document.getElementById('particles-container');
        if (!container) return;

        // 限制同时存在的粒子数量，避免性能问题
        if (container.children.length >= 20) return;

        const particle = document.createElement('div');
        particle.className = 'particle';

        // 随机属性 - 减少计算量
        const size = Math.random() * 6 + 2;
        const left = Math.random() * 100;
        const duration = Math.random() * 8 + 6; // 缩短动画时间
        const delay = Math.random() * 2;
        const colorConfig = this.getColorConfig();
        const hue = colorConfig.particleHueMin + Math.random() * colorConfig.particleHueRange;
        const saturation = colorConfig.particleSaturation || 80;

        // 更高效的样式设置
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.background = `radial-gradient(circle, hsla(${hue}, ${saturation}%, 70%, 0.8) 0%, hsla(${hue}, ${saturation}%, 70%, 0) 70%)`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.boxShadow = `0 0 ${size * 2}px hsla(${hue}, ${saturation}%, 70%, 0.5)`;

        // 使用 requestAnimationFrame 优化渲染
        requestAnimationFrame(() => {
            container.appendChild(particle);
        });

        // 动画结束后移除粒子
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, (duration + delay) * 1000);
    },
    createGlowOrbs() {
        const container = document.getElementById('glow-orbs-container');
        if (!container) return;

        // 清空现有光晕
        container.innerHTML = '';

        const colorConfig = this.getColorConfig();
        const colors = colorConfig.glowOrbs;

        for (let i = 0; i < 4; i++) {
            const orb = document.createElement('div');
            orb.className = 'glow-orb';

            const size = Math.random() * 150 + 120;
            const left = Math.random() * 80 + 10;
            const top = Math.random() * 80 + 10;
            const delay = Math.random() * -20;

            // 柔边由渐变自己画：从本色渐变到「同色但 alpha=0」。
            // 不要退回 `background: ${colors[i]}` + CSS 里的 filter: blur(60px) —— 见
            // styles.css 那条 .glow-orb 注释：带动画的元素上挂 blur 滤镜每帧都要重算，
            // 实测把 60fps 打到 20fps。
            // 透明端必须写 rgba(r,g,b,0) 而不是 `transparent`：后者是 rgba(0,0,0,0)，
            // 与本色之间插值会经过灰色，光晕边缘会发脏。
            const fade = colors[i].replace(/[\d.]+\s*\)$/, '0)');

            orb.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                top: ${top}%;
                background: radial-gradient(circle, ${colors[i]} 0%, ${fade} 70%);
                animation-delay: ${delay}s;
            `;

            container.appendChild(orb);
            this.glowOrbs.push(orb);
        }
    },
};

// ==== main/Script/core/mixins/CustomSelectMixin.js ====
// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

const CustomSelectMixin = {
    initCustomSelect() {
        // 获取所有自定义下拉菜单
        const customSelects = document.querySelectorAll('.custom-select');

        customSelects.forEach(select => {
            const selected = select.querySelector('.select-selected');
            const items = select.querySelector('.select-items');
            const selectItems = select.querySelectorAll('.select-item');
            const hiddenSelect = select.querySelector('select');

            // 点击选中区域显示/隐藏选项
            selected.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();

                this.showSettingsMenuInRightPanel(items, selected, hiddenSelect);
            });

            // 点击选项更新选中值
            selectItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();

                    // 更新显示的选中值
                    const value = item.getAttribute('data-value');

                    // 如果是自定义文字Logo选项，特殊处理
                    if (value === 'text-logo') {
                        // 显示输入框
                        const textLogoGroup = document.getElementById('text-logo-inline-group');
                        if (textLogoGroup) {
                            textLogoGroup.style.display = 'flex';
                        }
                        // 给选项添加selected类
                        item.classList.add('selected');
                        // 不关闭下拉菜单，让用户可以输入
                        return;
                    }

                    // 隐藏文字Logo输入框并移除selected类
                    const textLogoGroup = document.getElementById('text-logo-inline-group');
                    const textLogoItem = document.querySelector('.select-item-text-logo');
                    if (textLogoGroup) {
                        textLogoGroup.style.display = 'none';
                    }
                    if (textLogoItem) {
                        textLogoItem.classList.remove('selected');
                    }

                    // 获取文本内容，优先使用span元素
                    const spanEl = item.querySelector('span:last-child');
                    const text = spanEl ? spanEl.textContent : item.textContent;
                    selected.textContent = text;

                    // 更新隐藏的select元素的值并触发change事件
                    hiddenSelect.value = value;
                    const event = new Event('change', { bubbles: true });
                    hiddenSelect.dispatchEvent(event);

                    // 关闭下拉菜单
                    items.classList.add('select-hide');
                });
            });
        });

        // 点击页面其他地方关闭下拉菜单
        document.addEventListener('click', () => {
            document.querySelectorAll('.select-items').forEach(item => {
                item.classList.add('select-hide');
            });
        });
    },
    rebindCustomSelectItems() {
        const logoSelectItems = document.getElementById('logo-select-items');
        const logoSelect = document.getElementById('logo-select');
        const logoSelectSelected = document.getElementById('logo-select-selected');

        if (!logoSelectItems || !logoSelect || !logoSelectSelected) return;

        const selectItems = logoSelectItems.querySelectorAll('.select-item');
        selectItems.forEach(item => {
            // 移除旧的事件监听器（通过克隆节点）
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);

            // 添加新的事件监听器
            newItem.addEventListener('click', (e) => {
                e.stopPropagation();

                const value = newItem.getAttribute('data-value');

                // 如果是自定义文字Logo选项，特殊处理
                if (value === 'text-logo') {
                    const textLogoGroup = document.getElementById('text-logo-inline-group');
                    if (textLogoGroup) {
                        textLogoGroup.style.display = 'flex';
                    }
                    newItem.classList.add('selected');
                    return;
                }

                // 隐藏文字Logo输入框
                const textLogoGroup = document.getElementById('text-logo-inline-group');
                if (textLogoGroup) {
                    textLogoGroup.style.display = 'none';
                }

                // 更新选中值
                const text = newItem.textContent;
                logoSelectSelected.textContent = text;
                logoSelect.value = value;

                const event = new Event('change', { bubbles: true });
                logoSelect.dispatchEvent(event);

                // 关闭下拉菜单
                logoSelectItems.classList.add('select-hide');
            });
        });
    },
};

// ==== main/Script/core/mixins/ThemeMixin.js ====
// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

// [bundled] import { … } from '../first-paint.js'

const ThemeMixin = {
    async loadThemes() {
        this.themes = {};
        let fileNames = [];

        try {
            const response = await fetch('Themes/themes.json');
            if (response.ok) {
                const data = await response.json();
                fileNames = Array.isArray(data.themes) ? data.themes : [];
            }
        } catch (e) {
            console.warn('themes.json 加载失败:', e);
        }

        // 记录内置主题 key，供导入时避免冲突
        this.builtinThemeKeys = new Set(fileNames.map(f => f.replace(/\.js$/, '')));

        // 并行加载：主题文件之间没有任何依赖，串行 await 只是把 5 个十几毫秒的请求
        // 排成一队，瀑布上会留下两段几十毫秒的空窗（实测 139→208、208→256）。
        // Promise.all 的结果数组保持 fileNames 的顺序，下面按序写入 this.themes，
        // 键顺序与串行时完全一致（下拉列表顺序、主题导入去重都依赖它）。
        const loadedThemes = await Promise.all(fileNames.map(async (fileName) => {
            if (!fileName.endsWith('.js')) return null;
            try {
                const theme = await this.loadThemeFile(fileName);
                if (theme && theme.info && theme.details) {
                    const key = fileName.replace(/\.js$/, '');
                    return [key, this.normalizeThemePaths(theme)];
                }
            } catch (e) {
                console.warn(`主题文件 ${fileName} 加载失败:`, e);
            }
            return null;
        }));
        for (const entry of loadedThemes) {
            if (entry) this.themes[entry[0]] = entry[1];
        }

        // 注册已导入的自定义主题
        if (this.settings.customThemes) {
            this.settings.customThemes.forEach(ct => {
                if (ct.data && !this.themes[ct.key]) {
                    this.themes[ct.key] = ct.data;
                }
            });
        }

        // 待内置 + 自定义主题全部注册后再填充下拉列表
        this.populateThemeSelect();

        // 页面刷新后恢复主题样式
        if (this.settings.themeEnabled) {
            if (this.settings.theme && this.themes[this.settings.theme]) {
                const theme = this.themes[this.settings.theme];
                const aspects = this.settings.themeAspects || { logo: true, font: true, wallpaper: true, color: true };
                // 快照用户手动覆盖的方面，应用主题后再恢复，避免刷新时主题覆盖用户的改动
                const overridden = {};
                if (aspects.wallpaper === false) {
                    overridden.wallpaper = {
                        wallpaper: this.settings.wallpaper,
                        wallpaperUrl: this.settings.wallpaperUrl,
                        wallpaperFill: this.settings.wallpaperFill
                    };
                }
                if (aspects.logo === false) {
                    overridden.logo = { logo: this.settings.logo, logoType: this.settings.logoType };
                }
                if (aspects.font === false) {
                    overridden.font = { font: this.settings.font, fontWeight: this.settings.fontWeight, fontSize: this.settings.fontSize };
                }
                if (aspects.color === false) {
                    overridden.color = { colorScheme: this.settings.colorScheme, themeColorScheme: this.settings.themeColorScheme };
                }
                this.applyTheme(this.settings.theme, { silent: true });
                // 恢复用户手动覆盖的方面：还原设置值并清空对应主题覆盖，走常规渲染路径
                if (overridden.wallpaper) {
                    Object.assign(this.settings, overridden.wallpaper);
                    this.themeOverrides.wallpaper = null;
                }
                if (overridden.logo) {
                    Object.assign(this.settings, overridden.logo);
                    this.themeOverrides.logo = null;
                }
                if (overridden.font) {
                    Object.assign(this.settings, overridden.font);
                    this.themeOverrides.font = null;
                }
                if (overridden.color) {
                    Object.assign(this.settings, overridden.color);
                }
                this.settings.themeAspects = aspects;
                this.applySettings();
                // 恢复手动覆盖后重绘主题下拉，正确显示"自定义主题"状态
                this.populateThemeSelect();
            } else {
                // 存档指向的主题已不存在或加载失败，关闭主题避免残留旧外观
                this.deactivateTheme();
            }
        }
    },
    async loadThemeFile(fileName) {
        const url = new URL(`Themes/${fileName}`, document.baseURI).href;
        const mod = await import(url);
        const theme = mod && mod.default;
        if (!theme) {
            throw new Error(`${fileName} 未声明默认导出`);
        }
        return theme;
    },
    normalizeThemePaths(theme) {
        const fix = (p) => (typeof p === 'string' && p.startsWith('../')) ? p.substring(3) : p;
        const d = theme.details;
        if (!d) return theme;
        if (d.logo) {
            d.logo.location = fix(d.logo.location);
            if (d.logo.specialStyle) {
                if (d.logo.specialStyle.dark) d.logo.specialStyle.dark = fix(d.logo.specialStyle.dark);
                // online/onlineDark 是绝对 URL，不动
            }
        }
        if (d.font) d.font.location = fix(d.font.location);
        if (d.wallpaper) {
            d.wallpaper.location = fix(d.wallpaper.location);
            // online 是绝对 URL，不动
        }
        if (d.moreStyle) d.moreStyle.location = fix(d.moreStyle.location);
        return theme;
    },
    populateThemeSelect() {
        const itemsContainer = document.getElementById('theme-select-items');
        const hiddenSelect = document.getElementById('theme-select');
        const selectedDisplay = document.getElementById('theme-select-selected');
        if (!itemsContainer || !hiddenSelect) return;

        itemsContainer.innerHTML = '';
        hiddenSelect.innerHTML = '';

        const addItem = (value, label, onClick) => {
            const item = document.createElement('div');
            item.className = 'select-item';
            item.setAttribute('data-value', value);
            item.textContent = label;
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                onClick();
                itemsContainer.querySelectorAll('.select-item').forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
                itemsContainer.classList.add('select-hide');
            });
            itemsContainer.appendChild(item);
            return item;
        };

        // "不使用主题"选项：允许用户主动关闭主题功能
        addItem('', '自定义主题（不使用主题）', () => {
            this.deactivateTheme();
            if (selectedDisplay) selectedDisplay.textContent = '自定义主题';
            hiddenSelect.value = '';
            this.applySettings();
        });

        const keys = Object.keys(this.themes);
        keys.forEach(key => {
            const theme = this.themes[key];
            addItem(key, theme.info.name, () => {
                this.applyTheme(key);
                if (selectedDisplay) selectedDisplay.textContent = theme.info.name;
                hiddenSelect.value = key;
            });

            const option = document.createElement('option');
            option.value = key;
            option.textContent = theme.info.name;
            hiddenSelect.appendChild(option);
        });

        // 高亮当前状态项：主题被激活且未被手动定制时高亮主题，否则高亮"不使用主题"
        const themeActive = this.settings.themeEnabled && this.settings.theme && this.themes[this.settings.theme];
        if (themeActive && !this.isThemeCustomized()) {
            itemsContainer.querySelector(`.select-item[data-value="${this.settings.theme}"]`)?.classList.add('selected');
        } else {
            itemsContainer.querySelector('.select-item[data-value=""]')?.classList.add('selected');
        }

        // 更新顶部显示：无主题或被手动定制时显示"自定义主题"
        if (selectedDisplay) {
            selectedDisplay.textContent = (themeActive && !this.isThemeCustomized()) ? this.themes[this.settings.theme].info.name : '自定义主题';
        }
    },
    handleThemeUpload(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                const themeData = this.parseThemeContent(content);

                if (!themeData) {
                    this.showNotification('无法解析主题文件');
                    return;
                }
                if (!themeData.info || !themeData.details) {
                    this.showNotification('主题文件格式无效');
                    return;
                }

                const key = file.name.replace(/\.[^/.]+$/, '');
                const normalized = this.normalizeThemePaths(JSON.parse(JSON.stringify(themeData)));

                // 避免自定义主题 key 与内置主题冲突（如上传 default.js），冲突时自动加后缀
                let finalKey = key;
                if (this.builtinThemeKeys.has(key)) {
                    // 同名内置冲突：优先复用已导入的副本（如 default-2），避免重复导入产生 default-2、default-3...
                    const imported = this.settings.customThemes.find(ct =>
                        ct.key === key || (ct.key.startsWith(key + '-') && /^-\d+$/.test(ct.key.slice(key.length)))
                    );
                    if (imported) {
                        finalKey = imported.key;
                    } else {
                        let suffix = 2;
                        while (this.themes[key + '-' + suffix]) suffix++;
                        finalKey = key + '-' + suffix;
                    }
                }

                // 检查是否已存在同名自定义主题（按实际 key 匹配）
                const existing = this.settings.customThemes.findIndex(ct => ct.key === finalKey);
                if (existing !== -1) {
                    this.settings.customThemes[existing] = {
                        key: finalKey, name: themeData.info.name,
                        designer: themeData.info.designer || '',
                        version: themeData.info.version || '',
                        data: normalized
                    };
                } else {
                    this.settings.customThemes.push({
                        key: finalKey, name: themeData.info.name,
                        designer: themeData.info.designer || '',
                        version: themeData.info.version || '',
                        data: normalized
                    });
                }

                this.themes[finalKey] = normalized;
                this.saveSettings();
                this.populateThemeSelect();
                this.showNotification(`主题"${themeData.info.name}"导入成功`);

                // 刷新右面板
                const rpu = document.getElementById('right-panel-upper');
                if (rpu && rpu.querySelector('.settings-menu-container')) {
                    const selected = document.getElementById('theme-select-selected');
                    const hiddenSelect = document.getElementById('theme-select');
                    const items = document.getElementById('theme-select-items');
                    this.showSettingsMenuInRightPanel(items, selected, hiddenSelect);
                }
            } catch (err) {
                console.error('主题导入失败:', err);
                this.showNotification('主题导入失败');
            }
        };

        reader.onerror = () => this.showNotification('文件读取失败');
        reader.readAsText(file);
    },
    parseThemeContent(content) {
        if (!content) return null;
        const text = String(content).trim();

        // 1. 纯 JSON
        try { return JSON.parse(text); } catch (e) { /* 继续尝试 JS 写法 */ }

        // 2. 去除 `var/let/const [window.]DEFAULT_THEME =` 前缀与末尾分号后再按 JSON 解析
        const objText = text
            .replace(/^(?:var|let|const)\s+(?:window\.)?[A-Za-z_$][\w$]*\s*=\s*/i, '')
            .replace(/;+\s*$/, '')
            .trim();
        try { return JSON.parse(objText); } catch (e) { /* 继续尝试 JS 风格修正 */ }

        // 3. JS 风格对象字面量修正：仅补齐未加引号的键、把单引号转双引号
        //    注意：补齐键的正则只匹配 `{`/`,` 后紧跟的单词，避免误改字符串内的 URL 等
        try {
            const fixed = objText
                .replace(/([{,]\s*)([A-Za-z_$][\w$]*)\s*:/g, '$1"$2":')
                .replace(/'/g, '"');
            return JSON.parse(fixed);
        } catch (e) {
            return null;
        }
    },
    applyTheme(themeKey, opts = {}) {
        const theme = this.themes[themeKey];
        if (!theme || !theme.details) return;
        const d = theme.details;

        // 清空上一主题的残留覆盖，避免不完整主题继承旧属性
        this.themeOverrides = {};

        // 1. Logo
        if (d.logo) {
            this.settings.logo = d.logo.name;
            this.settings.logoType = 'image';
            this.themeOverrides.logo = {
                location: d.logo.location,
                dark: d.logo.specialStyle?.dark || null,
                online: d.logo.specialStyle?.online || null,
                onlineDark: d.logo.specialStyle?.onlineDark || null,
                width: d.logo.specialStyle?.width || null,
                height: d.logo.specialStyle?.height || null
            };
        } else {
            // 主题未定义 Logo：回退到默认 Logo，避免残留上一主题设置
            this.settings.logo = 'default';
            this.settings.logoType = 'image';
            this.themeOverrides.logo = null;
        }

        // 2. 字体
        if (d.font) {
            this.loadThemeFont(d.font);
            this.settings.font = d.font.name;
            this.themeOverrides.font = {
                weight: d.font.specialStyle?.['font-weight'] || null,
                size: d.font.specialStyle?.['font-size'] || null
            };
        } else {
            // 主题未定义字体：回退到默认字体（不覆盖用户设置的粗细/大小）
            this.settings.font = 'Sans Flex';
            this.themeOverrides.font = null;
        }

        // 3. 壁纸
        if (d.wallpaper) {
            this.settings.wallpaper = 'url';
            this.settings.wallpaperUrl = d.wallpaper.location;
            this.settings.wallpaperFill = d.wallpaper.specialStyle?.wallpaperFill === true;
            // 不修改 persistentWallpaper，避免保存到用户设置中
            this.themeOverrides.wallpaper = {
                online: d.wallpaper.specialStyle?.online || null
            };
        } else {
            // 主题未定义壁纸：回退到默认壁纸，避免残留上一主题壁纸
            this.settings.wallpaper = 'default';
            this.settings.wallpaperUrl = this.localBackgroundUrl || '';
            this.settings.wallpaperFill = true;
            this.themeOverrides.wallpaper = null;
        }

        // 4. 配色
        if (d.color && d.color.specialStyle) {
            if (d.color.specialStyle.colorGroup === 'cjs') {
                this.settings.colorScheme = d.color.specialStyle.colorScheme;
                this.settings.themeColorScheme = null;
            } else if (d.color.specialStyle.colorGroup === 'add') {
                this.settings.colorScheme = 'theme-add';
                this.settings.themeColorScheme = d.color.specialStyle.colorScheme;
            } else {
                // 未知 colorGroup：按内置默认配色处理
                this.settings.colorScheme = 'green';
                this.settings.themeColorScheme = null;
            }
        } else {
            // 主题未定义配色：回退到默认配色
            this.settings.colorScheme = 'green';
            this.settings.themeColorScheme = null;
        }

        // 5. more / moreStyle
        if (d.more === true && d.moreStyle) {
            this.applyThemeMoreStyle(d.moreStyle);
        } else {
            this.applyThemeMoreStyle(null);
        }

        // 6. 记录主题状态
        this.settings.theme = themeKey;
        this.settings.themeEnabled = true;
        // 主题接管全部四个方面；用户手动改动的方面会在 checkThemeConsistency 中标记为 false
        this.settings.themeAspects = { logo: true, font: true, wallpaper: true, color: true };

        // 7. 保存与应用
        if (!opts.silent) {
            this.saveSettings();
            this.showNotification('已切换主题：' + theme.info.name);
        }
        this.applySettings();

        // 8. 主题壁纸独立渲染：在 applySettings 之后确保壁纸在主页面显示
        // 不修改 persistentWallpaper，复选框保持用户原有状态
        // 只有 persistentWallpaper 为 true 时才在主页面添加壁纸并显示
        if (d.wallpaper) {
            const wpUrl = this.getWallpaperUrl();
            if (wpUrl) {
                if (this.settings.persistentWallpaper) {
                    this.setWallpaperOnLayers(wpUrl);
                    document.body.style.backgroundImage = 'none';
                    if (!this.isScrolled) {
                        document.body.classList.add('homepage-wallpaper');
                    }
                } else {
                    this.clearWallpaperLayers();
                }
                // 主题壁纸本地优先、在线升级（探测结果会被记住，后续重设不再退回本地）
                this.probeOnlineWallpaper(wpUrl);
            }
        }

        // 9. 更新顶部下拉显示（含高亮与"自定义主题"状态）
        this.populateThemeSelect();

        // 10. 更新所有设置选择框的显示文本（主题名：项目名）
        const fontSelected = document.getElementById('font-select-selected');
        if (fontSelected && d.font) {
            fontSelected.textContent = theme.info.name + '：' + d.font.name;
        }
        const wallpaperSelected = document.getElementById('wallpaper-select-selected');
        if (wallpaperSelected && d.wallpaper) {
            wallpaperSelected.textContent = theme.info.name + '：' + d.wallpaper.name;
        }
        const logoSelected = document.getElementById('logo-select-selected');
        if (logoSelected && d.logo) {
            logoSelected.textContent = theme.info.name + '：' + d.logo.name;
        }
        const colorSelected = document.getElementById('color-scheme-select-selected');
        if (colorSelected && d.color) {
            colorSelected.textContent = theme.info.name + '：' + d.color.name;
        }
    },
    loadThemeFont(fontDef) {
        if (!fontDef || !fontDef.location) return;
        try {
            const fontFace = new FontFace(fontDef.name, `url("${fontDef.location}")`);
            fontFace.load().then((loadedFace) => {
                document.fonts.add(loadedFace);
            }).catch((error) => {
                console.warn('主题字体加载失败:', fontDef.name, error);
            });
        } catch (e) {
            console.warn('主题字体 FontFace 创建失败:', e);
        }
    },
    applyThemeMoreStyle(moreStyle) {
        const existing = document.getElementById('theme-more-style');
        if (existing) existing.remove();
        if (!moreStyle || !moreStyle.specialStyle) return;

        const styleEl = document.createElement('style');
        styleEl.id = 'theme-more-style';
        let cssText = '';
        Object.keys(moreStyle.specialStyle).forEach(selector => {
            const rules = moreStyle.specialStyle[selector];
            if (Array.isArray(rules)) {
                cssText += `${selector} { ${rules.join(' ')} }\n`;
            } else if (typeof rules === 'string') {
                cssText += `${selector} { ${rules} }\n`;
            }
        });
        styleEl.textContent = cssText;
        document.head.appendChild(styleEl);
    },
    loadThemeLogoWithFallback(onlineUrl, localUrl, logoElement) {
        if (!onlineUrl) {
            logoElement.src = localUrl;
            return;
        }
        // 先用本地占位，避免等待
        logoElement.src = localUrl;
        // 与 AssetsMixin.loadIconWithFallback 同一个道理：这个 new Image() 若在 load
        // 之前开始加载，会把 window.load 拖到图片下完。本地占位图已经在显示，探测推到
        // load 之后。回填路径不变。
        afterLoad(() => {
            const testImg = new Image();
            testImg.onload = () => {
                logoElement.src = onlineUrl;
            };
            testImg.onerror = () => {
                logoElement.src = localUrl;
            };
            testImg.src = onlineUrl;
        });
    },
    checkThemeConsistency(settingName, newValue) {
        if (!this.settings.themeEnabled || !this.settings.theme) return;
        const theme = this.themes[this.settings.theme];
        if (!theme || !theme.details) return;
        const d = theme.details;
        let expected, aspect;
        switch (settingName) {
            case 'font':
                expected = d.font?.name;
                aspect = 'font';
                break;
            case 'logo':
                expected = d.logo?.name;
                aspect = 'logo';
                break;
            case 'wallpaper':
                // 主题壁纸用 location 标识
                expected = d.wallpaper?.location;
                aspect = 'wallpaper';
                break;
            case 'colorScheme':
                // 与 applyTheme 步骤 4 的判定保持一致
                const colorGroup = d.color?.specialStyle?.colorGroup;
                if (colorGroup === 'cjs') {
                    expected = d.color.specialStyle.colorScheme;
                } else if (colorGroup === 'add') {
                    expected = 'theme-add';
                } else {
                    // 主题未定义配色或 colorGroup 未知：applyTheme 会回退到默认配色
                    expected = 'green';
                }
                aspect = 'color';
                break;
            default:
                return;
        }
        if (expected === undefined) return;
        // 当主题壁纸就是默认壁纸时，切换到"默认壁纸"选项不算不一致
        if (settingName === 'wallpaper' && newValue === 'default' && expected === this.localBackgroundUrl) {
            return;
        }
        if (newValue !== expected) {
            // 用户手动覆盖该方面：仅解除该方面的主题控制，主题其余方面保持不变
            if (!this.settings.themeAspects) {
                this.settings.themeAspects = { logo: true, font: true, wallpaper: true, color: true };
            }
            this.settings.themeAspects[aspect] = false;
            // 清空该方面的主题渲染覆盖，使常规渲染逻辑生效
            if (this.themeOverrides && aspect !== 'color') {
                this.themeOverrides[aspect] = null;
            }
            // 若该方面当前值仍是主题设定的值（如仅上传未选择），回退到该方面的默认值
            switch (aspect) {
                case 'logo':
                    if (d.logo && this.settings.logo === d.logo.name) {
                        this.settings.logo = 'default';
                        this.settings.logoType = 'image';
                    }
                    break;
                case 'font':
                    if (d.font && this.settings.font === d.font.name) {
                        this.settings.font = 'Sans Flex';
                        this.settings.fontWeight = 400;
                        this.settings.fontSize = 1;
                    }
                    break;
                case 'wallpaper':
                    if (d.wallpaper && this.settings.wallpaper === 'url' && this.settings.wallpaperUrl === d.wallpaper.location) {
                        this.settings.wallpaper = 'default';
                        this.settings.wallpaperUrl = this.localBackgroundUrl || '';
                        this.clearWallpaperLayers();
                    }
                    break;
                case 'color':
                    if (this.settings.colorScheme === expected || this.settings.colorScheme === 'theme-add') {
                        this.settings.colorScheme = 'green';
                        this.settings.themeColorScheme = null;
                    }
                    break;
            }
            this.saveSettings();
            // 主题已被手动定制：刷新左面板主题下拉（显示"自定义主题"并高亮"不使用主题"）
            this.populateThemeSelect();
        }
    },
    deactivateTheme(theme, opts = {}) {
        const activeTheme = theme || (this.settings.theme && this.themes[this.settings.theme]);
        const d = activeTheme && activeTheme.details;

        this.settings.themeEnabled = false;
        this.settings.theme = 'default';
        this.settings.themeColorScheme = null;
        this.settings.themeAspects = { logo: false, font: false, wallpaper: false, color: false };
        this.themeOverrides = null;
        this.applyThemeMoreStyle(null);
        // 移除主题的壁纸显示（homepage-wallpaper 类由 applyTheme 步骤 8 添加）
        document.body.classList.remove('homepage-wallpaper');

        // 重置仍为主题旧值的设置为默认值
        if (d) {
            if (d.logo && this.settings.logo === d.logo.name) {
                this.settings.logo = 'default';
                this.settings.logoType = 'image';
            }
            if (d.font && this.settings.font === d.font.name) {
                this.settings.font = 'Sans Flex';
                this.settings.fontWeight = 400;
                this.settings.fontSize = 1;
                document.body.style.fontFamily = '';
                document.body.style.fontWeight = '';
                document.body.style.fontSize = '';
            }
            if (d.wallpaper && this.settings.wallpaperUrl === d.wallpaper.location) {
                this.settings.wallpaper = 'default';
                this.settings.wallpaperUrl = this.localBackgroundUrl || '';
                this.clearWallpaperLayers();
                document.body.style.backgroundImage = '';
            }
        }
        // 清理主题专用的配色残留（'theme-add' 在非主题模式下无意义）
        if (this.settings.colorScheme === 'theme-add') {
            this.settings.colorScheme = 'green';
            this.settings.themeColorScheme = null;
        }
        this.saveSettings();

        // 重绘左面板主题下拉，同步显示文本与高亮（无主题时显示"自定义主题"）
        this.populateThemeSelect();
        // 若右面板正显示主题菜单，刷新高亮
        const rpu = document.getElementById('right-panel-upper');
        if (rpu && rpu.dataset.menuType === 'theme') {
            rpu.querySelectorAll('.settings-menu-option').forEach(opt => opt.classList.remove('selected'));
        }
        if (opts.notify) {
            this.showNotification('主题功能已关闭');
        }
    },
    getThemeDisplayInfo() {
        if (!this.settings.themeEnabled || !this.settings.theme) return null;
        const theme = this.themes[this.settings.theme];
        if (!theme || !theme.details) return null;
        const aspects = this.settings.themeAspects || {};
        const still = (aspect) => aspects[aspect] !== false;
        return {
            themeName: theme.info.name,
            fontName: still('font') ? (theme.details.font?.name || null) : null,
            fontLocation: still('font') ? (theme.details.font?.location || null) : null,
            wallpaperName: still('wallpaper') ? (theme.details.wallpaper?.name || null) : null,
            logoName: still('logo') ? (theme.details.logo?.name || null) : null,
            colorName: still('color') ? (theme.details.color?.name || null) : null
        };
    },
    isThemeCustomized() {
        if (!this.settings.themeEnabled || !this.settings.theme) return false;
        const a = this.settings.themeAspects;
        return !!(a && (a.logo === false || a.font === false || a.wallpaper === false || a.color === false));
    },
    isThemeWallpaperActive() {
        return !!this.getThemeDisplayInfo()?.wallpaperName;
    },
};

// ==== main/Script/core/mixins/ColorMixin.js ====
// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

// [bundled] import { … } from '../color.js'

const ColorMixin = {
    getColorConfig() {
        const scheme = this.settings.colorScheme || 'green';
        if (scheme === 'theme-add') {
            // 主题 add 模式：使用主题内联的完整配色配置
            return this.settings.themeColorScheme || getColorConfig('green');
        }
        if (scheme === 'custom') {
            const customItem = this.settings.customColors && this.settings.customColors.length > 0 && this.settings.activeCustomColorIndex >= 0
                ? this.settings.customColors[this.settings.activeCustomColorIndex]
                : null;
            const customColors = customItem ? {
                primaryColor: customItem.primaryColor || '',
                secondaryColor: customItem.secondaryColor || '',
                gradientEnabled: customItem.gradientEnabled || false,
                gradientStart: customItem.gradientStart !== undefined ? customItem.gradientStart : 0,
                gradientEnd: customItem.gradientEnd !== undefined ? customItem.gradientEnd : 100
            } : {
                primaryColor: this.settings.customPrimaryColor || '',
                secondaryColor: this.settings.customSecondaryColor || '',
                gradientEnabled: this.settings.customGradientEnabled || false,
                gradientStart: this.settings.customGradientStart !== undefined ? this.settings.customGradientStart : 0,
                gradientEnd: this.settings.customGradientEnd !== undefined ? this.settings.customGradientEnd : 100
            };
            return getColorConfig('custom', customColors);
        }
        return getColorConfig(scheme);
    },
    applyColorScheme() {
        const body = document.body;
        const scheme = this.settings.colorScheme || 'green';
        const colorConfig = this.getColorConfig();

        // 移除所有旧的配色方案类
        const colorClasses = ['color-scheme-green', 'color-scheme-blue', 'color-scheme-black-white', 'color-scheme-tianyi-blue', 'color-scheme-vibrant-red', 'color-scheme-classic-gold', 'color-scheme-isolation', 'color-scheme-custom', 'color-scheme-theme-add'];
        body.classList.remove(...colorClasses);
        // 添加新的配色方案类
        body.classList.add('color-scheme-' + scheme);

        if (scheme === 'custom') {
            this.updateCustomSchemeDropdownDots();
        }

        // 设置 CSS 自定义属性，让所有 UI 元素跟随配色方案
        const isDark = this.isDarkMode;
        const accent = isDark ? colorConfig.accentDark : colorConfig.accent;
        const accentRgb = isDark ? colorConfig.accentDarkRgb : colorConfig.accentRgb;
        const gradient = isDark ? (colorConfig.gradientDark || colorConfig.accentDark) : (colorConfig.gradient || colorConfig.accent);
        body.style.setProperty('--primary-color', accent);
        body.style.setProperty('--scheme-accent', accent);
        body.style.setProperty('--scheme-accent-rgb', accentRgb);
        body.style.setProperty('--scheme-gradient', gradient);
        body.style.setProperty('--scheme-accent-hover', colorConfig.accentHover);
        body.style.setProperty('--scheme-accent-active', colorConfig.accentActive);

        // 更新右键菜单配色
        this.updateContextMenuColors();

        // 更新侧边栏图标配色
        this.updateSidebarIconColors();

        // 更新引擎按钮配色类
        this.updateEngineButtonClasses();

        // 重新创建光晕（如果高级视觉效果已激活）
        if (this.isAdvancedEffectsActive) {
            this.createGlowOrbs();
        }
    },
    updateCustomSchemeDropdownDots() {
        // 兼容旧版：更新静态自定义选项的圆点（如果存在）
        const staticDot = document.querySelector('#color-scheme-select-items .color-scheme-item[data-value="custom"] .color-scheme-dot');
        if (staticDot) {
            const primary = this.settings.customPrimaryColor || '';
            const secondary = this.settings.customSecondaryColor || '';
            if (primary) {
                if (secondary) {
                    staticDot.style.background = 'linear-gradient(135deg, ' + primary + ', ' + secondary + ')';
                } else {
                    staticDot.style.background = primary;
                }
            } else {
                staticDot.style.background = 'linear-gradient(135deg, #cccccc, #dddddd)';
            }
        }
    },
    updateColorSchemeSelectDisplay() {
        const colorSchemeValue = this.settings.colorScheme || 'green';
        const colorSchemeSelect = document.getElementById('color-scheme-select');
        if (colorSchemeSelect) {
            // 'theme-add' 不是有效 <option>，跳过设值避免 select 回退到第一个选项
            if (colorSchemeValue !== 'theme-add') {
                colorSchemeSelect.value = colorSchemeValue;
            }
        }
        const colorSchemeSelected = document.getElementById('color-scheme-select-selected');
        if (!colorSchemeSelected) return;
        const themeInfo = this.getThemeDisplayInfo();
        if (themeInfo && themeInfo.colorName) {
            colorSchemeSelected.textContent = themeInfo.themeName + '：' + themeInfo.colorName;
        } else if (colorSchemeValue === 'custom') {
            const cc = this.settings.activeCustomColorIndex >= 0 && Array.isArray(this.settings.customColors)
                ? this.settings.customColors[this.settings.activeCustomColorIndex]
                : null;
            colorSchemeSelected.textContent = (cc && cc.name) || '自定义';
        } else {
            colorSchemeSelected.textContent = COLOR_SCHEME_NAMES[colorSchemeValue] || '自定义';
        }
    },
};

// ==== main/Script/core/mixins/StatusBarMixin.js ====
// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

const StatusBarMixin = {
    syncStatusBarUI() {
        const statusBarToggle = document.getElementById('status-bar-toggle');
        const showSecondsGroup = document.getElementById('show-seconds-group');
        const showSecondsToggle = document.getElementById('show-seconds-toggle');
        if (statusBarToggle) {
            statusBarToggle.checked = this.settings.statusBarEnabled;
        }
        if (showSecondsGroup && showSecondsToggle) {
            if (this.settings.statusBarEnabled) {
                showSecondsGroup.style.display = 'block';
                showSecondsToggle.checked = this.settings.showStatusBarSeconds;
            } else {
                showSecondsGroup.style.display = 'none';
                showSecondsToggle.checked = false;
            }
        }
    },
    formatStatusBarDateTime(date) {
        const pad = (value) => String(value).padStart(2, '0');
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());

        if (this.settings.showStatusBarSeconds) {
            return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
        }

        return `${year}年${month}月${day}日 ${hours}:${minutes}`;
    },
    updateStatusBarText() {
        const statusBar = document.getElementById('status-bar');
        if (!statusBar) return;

        statusBar.textContent = this.formatStatusBarDateTime(new Date());
    },
    stopStatusBarTimer() {
        if (this.statusBarTimer) {
            clearTimeout(this.statusBarTimer);
            this.statusBarTimer = null;
        }
    },
    applyStatusBarTextTone(mode) {
        const statusBar = document.getElementById('status-bar');
        if (!statusBar) return;

        const resolvedMode = mode === 'light' ? 'light' : 'dark';
        const color = resolvedMode === 'light' ? '#f8fafc' : '#202124';
        const shadow = resolvedMode === 'light'
            ? '0 1px 2px rgba(0, 0, 0, 0.28)'
            : '0 1px 2px rgba(255, 255, 255, 0.18)';

        this.statusBarContrastMode = resolvedMode;
        statusBar.style.setProperty('--status-bar-text-color', color);
        statusBar.style.textShadow = shadow;
    },
    getColorBrightness(colorString) {
        const match = colorString && colorString.match(/rgba?\(([^)]+)\)/);
        if (!match) {
            return this.isDarkMode ? 32 : 245;
        }

        const parts = match[1].split(',').map(part => Number.parseFloat(part.trim()));
        if (parts.length < 3 || parts.some(value => Number.isNaN(value))) {
            return this.isDarkMode ? 32 : 245;
        }

        return (parts[0] * 0.299) + (parts[1] * 0.587) + (parts[2] * 0.114);
    },
    getFallbackStatusBarTextTone() {
        return this.isDarkMode ? 'light' : 'dark';
    },
    async ensureWallpaperAnalysisImage(url) {
        if (!url) {
            this.wallpaperAnalysisImage = null;
            this.wallpaperAnalysisUrl = null;
            this.wallpaperAnalysisPromise = null;
            return null;
        }

        if (this.wallpaperAnalysisImage && this.wallpaperAnalysisUrl === url) {
            return this.wallpaperAnalysisImage;
        }

        if (this.wallpaperAnalysisPromise && this.wallpaperAnalysisUrl === url) {
            return this.wallpaperAnalysisPromise;
        }

        this.wallpaperAnalysisUrl = url;
        this.wallpaperAnalysisPromise = new Promise((resolve) => {
            const done = (image) => {
                this.wallpaperAnalysisImage = image;
                this.wallpaperAnalysisPromise = null;
                resolve(image);
            };
            const fail = () => {
                this.wallpaperAnalysisImage = null;
                this.wallpaperAnalysisPromise = null;
                resolve(null);
            };

            // data: URL 不走 <img>：<img> 是文档资源，在 load 之前起跑会把 window.load
            // 拖到它解码完（实测一张几 MB 的上传壁纸在这里再拖约 330ms）。
            // 这条路径只要像素 —— ImageBitmap 一样能 drawImage、一样有 width/height，
            // 而 fetch（含 data: URL）不占文档的 load。HTTP 壁纸仍走 <img>：
            // 那条路要靠 crossOrigin='anonymous' 才能把像素读进 canvas。
            if (/^data:/i.test(url)) {
                fetch(url)
                    .then((res) => res.blob())
                    .then((blob) => createImageBitmap(blob))
                    .then(done)
                    .catch(fail);
                return;
            }

            const image = new Image();
            image.crossOrigin = 'anonymous';
            image.onload = () => done(image);
            image.onerror = fail;

            image.src = url;
        });

        return this.wallpaperAnalysisPromise;
    },
    drawWallpaperPreviewToCanvas(context, viewportWidth, viewportHeight, image) {
        const fillMode = this.settings.wallpaperFill === true;
        const scale = fillMode
            ? Math.max(viewportWidth / image.width, viewportHeight / image.height)
            : Math.min(viewportWidth / image.width, viewportHeight / image.height);

        const drawWidth = image.width * scale;
        const drawHeight = image.height * scale;
        const drawX = (viewportWidth - drawWidth) / 2;
        const drawY = (viewportHeight - drawHeight) / 2;
        const wallpaperElement = this.wallpaperMain;
        const transformValue = wallpaperElement ? getComputedStyle(wallpaperElement).transform : 'none';

        context.save();
        context.clearRect(0, 0, viewportWidth, viewportHeight);

        if (transformValue && transformValue !== 'none') {
            const matrix = new DOMMatrixReadOnly(transformValue);
            context.translate(viewportWidth / 2, viewportHeight / 2);
            context.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
            context.translate(-viewportWidth / 2, -viewportHeight / 2);
        }

        context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
        context.restore();
    },
    getStatusBarSampleRect(viewportWidth, viewportHeight) {
        const statusBar = document.getElementById('status-bar');
        if (!statusBar) return null;

        const rect = statusBar.getBoundingClientRect();
        const sampleWidth = Math.max(120, rect.width * 0.42);
        const sampleHeight = Math.max(18, rect.height * 0.7);
        const sampleX = Math.max(0, (viewportWidth - sampleWidth) / 2);
        const sampleY = Math.max(0, rect.top);

        return {
            x: sampleX,
            y: sampleY,
            width: Math.min(sampleWidth, viewportWidth - sampleX),
            height: Math.min(sampleHeight, viewportHeight - sampleY)
        };
    },
    getAverageBrightnessFromCanvas(context, sampleRect) {
        try {
            const imageData = context.getImageData(
                Math.round(sampleRect.x),
                Math.round(sampleRect.y),
                Math.max(1, Math.round(sampleRect.width)),
                Math.max(1, Math.round(sampleRect.height))
            );

            let totalBrightness = 0;
            let pixelCount = 0;
            const { data } = imageData;

            for (let index = 0; index < data.length; index += 4) {
                const alpha = data[index + 3] / 255;
                if (alpha <= 0) continue;

                totalBrightness += (
                    (data[index] * 0.299) +
                    (data[index + 1] * 0.587) +
                    (data[index + 2] * 0.114)
                ) * alpha;
                pixelCount += alpha;
            }

            if (pixelCount === 0) {
                return null;
            }

            return totalBrightness / pixelCount;
        } catch (error) {
            return null;
        }
    },
    async updateStatusBarTextContrast() {
        const statusBar = document.getElementById('status-bar');
        if (!statusBar) return;

        const wallpaperUrl = this.getWallpaperUrl();
        const hasWallpaper = !!(wallpaperUrl && this.wallpaperMain && this.wallpaperMain.classList.contains('active'));

        if (!hasWallpaper) {
            this.applyStatusBarTextTone(this.getFallbackStatusBarTextTone());
            return;
        }

        const analysisUrl = wallpaperUrl;
        const image = await this.ensureWallpaperAnalysisImage(analysisUrl);
        if (!image || analysisUrl !== this.getWallpaperUrl()) {
            this.applyStatusBarTextTone(this.getFallbackStatusBarTextTone());
            return;
        }

        const viewportWidth = Math.max(1, window.innerWidth);
        const viewportHeight = Math.max(1, window.innerHeight);
        const canvas = document.createElement('canvas');
        canvas.width = viewportWidth;
        canvas.height = viewportHeight;

        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) {
            this.applyStatusBarTextTone(this.getFallbackStatusBarTextTone());
            return;
        }

        this.drawWallpaperPreviewToCanvas(context, viewportWidth, viewportHeight, image);

        const sampleRect = this.getStatusBarSampleRect(viewportWidth, viewportHeight);
        if (!sampleRect) {
            this.applyStatusBarTextTone(this.getFallbackStatusBarTextTone());
            return;
        }

        const brightness = this.getAverageBrightnessFromCanvas(context, sampleRect);
        if (brightness === null) {
            this.applyStatusBarTextTone(this.getFallbackStatusBarTextTone());
            return;
        }

        this.applyStatusBarTextTone(brightness >= 160 ? 'dark' : 'light');
    },
    startStatusBarTimer() {
        this.stopStatusBarTimer();

        const shouldShow = this.settings.statusBarEnabled;
        if (!shouldShow) {
            return;
        }

        const scheduleNextTick = () => {
            const now = new Date();
            const showSeconds = this.settings.showStatusBarSeconds;
            let delay = showSeconds
                ? 1000 - now.getMilliseconds()
                : ((60 - now.getSeconds()) * 1000) - now.getMilliseconds();

            if (delay <= 0) {
                delay = showSeconds ? 1000 : 60000;
            }

            this.statusBarTimer = setTimeout(() => {
                this.updateStatusBarText();
                scheduleNextTick();
            }, delay);
        };

        this.updateStatusBarText();
        scheduleNextTick();
    },
    applyStatusBarSettings() {
        const statusBar = document.getElementById('status-bar');
        if (!statusBar) return;

        const shouldShow = this.settings.statusBarEnabled;

        if (!shouldShow) {
            statusBar.classList.remove('visible');
            statusBar.textContent = '';
            this.stopStatusBarTimer();
            document.documentElement.style.setProperty('--status-bar-offset', '10px');
            return;
        }

        statusBar.classList.add('visible');
        document.documentElement.style.setProperty('--status-bar-offset', '44px');
        this.startStatusBarTimer();
        this.updateStatusBarTextContrast();
    },
};

// ==== main/Script/core/mixins/NotificationsMixin.js ====
// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

const NotificationsMixin = {
    getNotificationColors() {
        const colorConfig = this.getColorConfig();
        const scheme = this.settings.colorScheme || 'green';

        function rgbaEffectiveLuminance(rgbaStr, pageBgLum) {
            var m = rgbaStr.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
            if (!m) return null;
            var r = parseFloat(m[1]) / 255, g = parseFloat(m[2]) / 255, b = parseFloat(m[3]) / 255, a = parseFloat(m[4]);
            function lin(v) { return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
            var cLum = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
            return cLum * a + pageBgLum * (1 - a);
        }

        if (this.settings.dynamicBlur) {
            if (scheme === 'green') {
                const bgColor = this.isDarkMode ? 'rgba(48, 49, 52, 0.85)' : 'rgba(241, 243, 244, 0.85)';
                const textColor = this.isDarkMode ? colorConfig.notificationTextDark : colorConfig.notificationText;
                const borderColor = this.isDarkMode ? 'rgba(95, 99, 104, 0.5)' : 'rgba(223, 225, 229, 0.6)';
                return { bg: bgColor, text: textColor, border: borderColor, blur: true };
            }
            if (scheme === 'black-white') {
                const isDark = this.isDarkMode;
                const bgColor = isDark ? colorConfig.notificationBgDark : colorConfig.notificationBg;
                const textColor = isDark ? colorConfig.notificationTextDark : colorConfig.notificationText;
                const borderColor = isDark ? colorConfig.notificationBorderDark : colorConfig.notificationBorder;
                return { bg: bgColor, text: textColor, border: borderColor, blur: true };
            }
            if (scheme === 'custom') {
                const bgColor = this.isDarkMode ? colorConfig.notificationBgDark : colorConfig.notificationBg;
                const textColor = this.isDarkMode ? colorConfig.notificationTextDark : colorConfig.notificationText;
                return { bg: bgColor, text: textColor, border: colorConfig.notificationBorder, blur: true };
            }
            // 蓝色主题及其他
            const bgColor = this.isDarkMode ? colorConfig.notificationBgDark : colorConfig.notificationBg;
            const textColorDark = colorConfig.notificationTextDark || '#ffffff';
            const textColorLight = colorConfig.notificationText || '#ffffff';
            // 浅色模式下，若背景有效亮度较高（偏亮），自动切换为深色文字确保对比度
            let textColor = textColorDark;
            if (!this.isDarkMode) {
                var effLum = rgbaEffectiveLuminance(bgColor, 1.0);
                textColor = effLum !== null && effLum > 0.45 ? textColorLight : textColorDark;
            }
            return { bg: bgColor, text: textColor, border: colorConfig.notificationBorder, blur: true };
        }

        // 非高级视觉效果：使用表面色
        return { bg: 'var(--surface-color)', text: 'var(--text-color)', border: 'var(--border-color)', blur: false };
    },
    // 提示框里的文字视觉上并不居中：line-height 的半行距对齐的是字体的内容区
    // （ascent + descent），而字体的 ascent/descent 本就不对称，实际画出来的墨迹
    // 因此整体偏上。偏移量随字体变（本次量到 0.8~1.6px），在 45px 高的胶囊里肉眼可辨。
    // 这里量出真实偏移，交给调用方用不对称内边距压回去。
    getNotificationInkOffset(notification) {
        // 基线探针：零尺寸 inline-block 的底边正好压在基线上（vertical-align: baseline），
        // 这是 DOM 里唯一能直接读出基线的办法。首尾各放一个，多行文案也能框住整块墨迹
        // （单行时两者重合）。只测位置、不参与布局：宽高都是 0，不会影响居中和换行。
        const probeStyle = 'display:inline-block;width:0;height:0;vertical-align:baseline;';
        const head = document.createElement('span');
        const tail = document.createElement('span');
        head.style.cssText = probeStyle;
        tail.style.cssText = probeStyle;
        notification.insertBefore(head, notification.firstChild);
        notification.appendChild(tail);

        const rect = notification.getBoundingClientRect();
        const firstBaseline = head.getBoundingClientRect().bottom;
        const lastBaseline = tail.getBoundingClientRect().bottom;
        head.remove();
        tail.remove();

        const computed = getComputedStyle(notification);
        const ink = this.measureTextInk(
            notification.textContent,
            computed.fontFamily,
            parseFloat(computed.fontSize) || 14
        );
        if (!ink) return 0;

        const inkCenter = (firstBaseline - ink.ascent + lastBaseline + ink.descent) / 2;
        const boxCenter = rect.top + rect.height / 2;
        // 限幅：万一量出离谱的值，也不至于把提示框撑歪
        return Math.max(-4, Math.min(4, inkCenter - boxCenter));
    },
    // 量一段文字"墨迹"（真正落笔的部分）相对基线的上下沿，单位是 CSS px
    measureTextInk(text, fontFamily, fontSize) {
        try {
            // 光栅化比 measureText 准：actualBoundingBoxAscent/Descent 被 Chrome 量化成
            // 整数，中文字体上能差 1px 以上；扫 alpha 通道得到的是真实落笔范围
            // （实测与逐像素量截图的结果相差 0.02px）。放大 200px 再画，1px 的量化误差
            // 摊回 14px 只剩 0.07px。
            const big = 200;
            const scale = big / fontSize;
            // 墨迹上下沿由字形决定，取开头一小段就够，长文案不必画满整张画布
            const sample = String(text || '').slice(0, 16);
            if (!sample) return null;

            const canvas = document.createElement('canvas');
            const measureCtx = canvas.getContext('2d');
            measureCtx.font = `${big}px ${fontFamily}`;
            const width = Math.ceil(measureCtx.measureText(sample).width) + 40;
            const height = 500;
            const baseline = 350;
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.font = `${big}px ${fontFamily}`;
            ctx.textBaseline = 'alphabetic';
            ctx.fillStyle = '#000000';
            ctx.fillText(sample, 20, baseline);

            const data = ctx.getImageData(0, 0, width, height).data;
            let top = -1;
            let bottom = -1;
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    // alpha > 100 ≈ 四成覆盖率，与肉眼判定"有墨"的界线接近
                    if (data[(y * width + x) * 4 + 3] > 100) {
                        if (top < 0) top = y;
                        bottom = y;
                        break;
                    }
                }
            }
            if (top < 0) return null;
            return { ascent: (baseline - top) / scale, descent: (bottom + 1 - baseline) / scale };
        } catch (_) {
            // 画布不可用（取不到像素等）时不修正，退回对称内边距
            return null;
        }
    },
    showNotification(message) {
        // 隐藏弹窗开启时，仅设置在设置页面内仍弹出
        if (this.settings && this.settings.hideNotifications) {
            const modal = document.getElementById('settings-modal');
            if (!modal || !modal.classList.contains('show')) {
                return;
            }
        }

        // 移除已存在的通知
        const existingNotification = document.getElementById('ooo-interface-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.id = 'ooo-interface-notification';

        // 获取配色（与右键菜单一致：背景/描边/文字）
        const colors = this.getNotificationColors();
        const blurStyle = colors.blur
            ? 'backdrop-filter: blur(40px) saturate(1.4); -webkit-backdrop-filter: blur(40px) saturate(1.4);'
            : '';

        // 居中底部：水平居中靠 left: 50% + translateX(-50%)，所以这个 -50% 必须并进出/入场
        // 的 transform 里，否则动画的 transform 会覆盖掉定位用的位移，提示框会甩到屏幕右半边。
        // 竖向贴底 20px——主页铭牌（bottom: 32px）和壁纸模式的引擎按钮都占着底部居中，
        // 提示框既然要贴底就必然压到它们身上，由 styles.css 里那条 :has() 规则让它们先淡出。
        // transition 先留空：下面量完墨迹要改内边距，过渡开着的话这不到 1px 的修正
        // 也会走一遍 350ms 动画，提示框刚露头时文字还在慢慢往下滑。
        notification.style.cssText = `
            position: fixed;
            left: 50%;
            bottom: 20px;
            /* width: max-content 不能省：left: 50% 且宽度 auto 时，可用宽度只剩视口右半
               （390px 屏上只有 195px），长文案会被压成一条又高又窄的竖条。给出 max-content
               让宽度先按内容算，再由 max-width 夹紧并在必要时折行。 */
            width: max-content;
            max-width: calc(100% - 40px);
            box-sizing: border-box;
            background: ${colors.bg};
            color: ${colors.text};
            padding: 12px 20px;
            border-radius: 999px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
            z-index: 1001;
            border: 1px solid ${colors.border};
            font-family: inherit;
            font-size: 14px;
            line-height: 1.5;
            text-align: center;
            ${blurStyle}
            transition: none;
            opacity: 0;
            transform: translateX(-50%);
            pointer-events: none;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // 文字纵向修正：把墨迹（而不是字体的内容区）摆到胶囊正中。上下内边距之和不变，
        // 胶囊高度和贴底位置都不动，动的只是文字。必须赶在摆入场姿势之前量——入场动画
        // 带 translateY(12px)，先摆姿势会把量到的中心整体带偏 12px。
        const inkOffset = this.getNotificationInkOffset(notification);
        if (inkOffset) {
            notification.style.paddingTop = `${12 - inkOffset}px`;
            notification.style.paddingBottom = `${12 + inkOffset}px`;
        }

        // 入场初态：自下而上浮入。先强制一次重排把修正后的几何定下来，再打开过渡，
        // 否则修正内边距这件事本身也会被当成一次过渡的起点。
        notification.style.transform = 'translateX(-50%) translateY(12px) scale(0.96)';
        void notification.offsetHeight;
        notification.style.transition = 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(-50%) translateY(0) scale(1)';
        }, 10);

        // 3秒后自动隐藏
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(12px) scale(0.96)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 350);
        }, 3000);
    },
    showInfoPopup() {
        // 禁止提示开启时不弹出
        if (this.isHideInfoPopupActive()) return;

        // 同步 UAC 连接状态
        try { this.backendConnected = localStorage.getItem('oooBackendConnected') === 'true'; } catch (_) {}
        if (this.infoPopupOpen) return;
        this.infoPopupOpen = true;

        const popup = document.createElement('div');
        popup.className = 'ooo-info-popup';
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #ffffff;
            padding: 30px;
            z-index: 10000;
            max-width: 400px;
            font-family: 'Courier New', monospace;
        `;

        // 创建弹窗内容
        const content = document.createElement('div');
        content.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 15px;
        `;

        // 版本信息
        const version = document.createElement('p');
        version.textContent = `[component.over]${this.currentVersion}`;
        version.style.cssText = `
            font-size: 14px;
            color: #000000;
            margin: 0;
            word-wrap: break-word;
        `;

        // 操作系统
        const os = document.createElement('p');
        const osName = this.getOperatingSystem();
        os.textContent = `[devtype]${osName}`;
        os.style.cssText = `
            font-size: 14px;
            color: #000000;
            margin: 0;
            word-wrap: break-word;
        `;

        // 版本标志
        const beta = document.createElement('p');
        beta.textContent = `[package.flag]${PACKAGE_FLAG}`;
        beta.style.cssText = `
            font-size: 14px;
            color: #000000;
            margin: 0;
            word-wrap: break-word;
        `;

        // 包ID
        const packageId = document.createElement('p');
        packageId.textContent = `[package.id]${PACKAGE_ID}`;
        packageId.style.cssText = `
            font-size: 14px;
            color: #000000;
            margin: 0;
            word-wrap: break-word;
        `;

        // 后端连接状态
        const uac = document.createElement('p');
        uac.textContent = `[UAC]${this.getMemoryUsage('uac')}`;
        uac.style.cssText = `
            font-size: 14px;
            color: #000000;
            margin: 0;
            word-wrap: break-word;
        `;

        // 组装弹窗
        content.appendChild(version);
        content.appendChild(os);
        content.appendChild(beta);
        content.appendChild(packageId);
        content.appendChild(uac);
        popup.appendChild(content);

        // 添加到页面
        document.body.appendChild(popup);

        // ESC键关闭弹窗（带 parentNode 检查避免重复移除报错，并及时注销监听器避免泄漏）
        const closePopup = () => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
            document.removeEventListener('keydown', handleEsc);
            popup.removeEventListener('click', closePopup);
            this.infoPopupOpen = false;
        };

        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                closePopup();
            }
        };
        document.addEventListener('keydown', handleEsc);

        // 点击弹窗也可关闭，避免弹窗长期驻留时监听器泄漏
        popup.addEventListener('click', closePopup);
    },
    showShortcutsHint() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        const box = document.createElement('div');
        box.style.cssText = `
            background: var(--background-color);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 24px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 24px 48px rgba(0,0,0,0.2);
            font-family: inherit;
        `;

        const title = document.createElement('div');
        title.textContent = '快捷键说明';
        title.style.cssText = `
            font-size: 16px;
            font-weight: 500;
            color: var(--text-color);
            letter-spacing: 0.0125em;
            margin-bottom: 16px;
        `;

        box.appendChild(title);

        const items = [
            { key: 'Alt + O', desc: '激活 OOOInterface 扩展程序' },
            { key: 'Tab', desc: '快速聚焦到搜索框' },
            { key: 'Tab（长按）', desc: '打开快捷轮盘，移动鼠标或方向键选择（斜向按两键）' },
            { key: 'Ctrl + ,', desc: '打开设置页面' },
            { key: 'Ctrl + H', desc: '展开 / 收起搜索历史框' },
            { key: 'Ctrl + S（设置页面内）', desc: '应用当前设置' }
        ];

        items.forEach((item, i) => {
            const row = document.createElement('div');
            row.style.cssText = `
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px 12px;
                background: var(--surface-color);
                border-radius: 12px;
                ${i < items.length - 1 ? 'margin-bottom: 8px;' : ''}
            `;

            const keySpan = document.createElement('span');
            keySpan.textContent = item.key;
            keySpan.style.cssText = `
                display: inline-block;
                background: var(--background-color);
                padding: 4px 12px;
                border-radius: 8px;
                font-size: 13px;
                font-weight: 600;
                color: var(--text-color);
                white-space: nowrap;
                border: 1px solid var(--border-color);
                min-width: 100px;
                text-align: center;
            `;

            const descSpan = document.createElement('span');
            descSpan.textContent = item.desc;
            descSpan.style.cssText = `
                font-size: 14px;
                color: var(--text-color);
                flex: 1;
                line-height: 1.5;
            `;

            row.appendChild(keySpan);
            row.appendChild(descSpan);
            box.appendChild(row);
        });

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.style.cssText = `
            margin-top: 16px;
            padding: 8px 24px;
            background: var(--surface-color);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            font-family: inherit;
            cursor: pointer;
            transition: all 0.2s ease;
            display: block;
            margin-left: auto;
        `;
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = 'var(--surface-variant)';
            closeBtn.style.borderColor = 'var(--primary-color)';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'var(--surface-color)';
            closeBtn.style.borderColor = 'var(--border-color)';
        });
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.removeEventListener('keydown', handleEsc);
        });

        box.appendChild(closeBtn);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                if (overlay.parentNode) {
                    document.body.removeChild(overlay);
                }
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
                document.removeEventListener('keydown', handleEsc);
            }
        });
    },
};

// ==== main/Script/core/mixins/InfoPopupToggleMixin.js ====
// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

const InfoPopupToggleMixin = {
    initHideInfoPopupToggle() {
        const toggle = document.getElementById('hide-info-popup-toggle');
        if (!toggle) return;

        // 监听必须绑在外层label上:checkbox本身宽高为0不可见,双击的dblclick是物理事件,
        // 只会派发在slider/label上,浏览器不会向input转发合成的dblclick
        const switchLabel = toggle.closest('label');
        if (!switchLabel) return;

        const updateToggleState = () => {
            const isEnabled = this.settings.hideInfoPopup.enabled;
            // 使用 requestAnimationFrame 确保DOM更新在浏览器的下一个渲染周期执行
            requestAnimationFrame(() => {
                toggle.checked = isEnabled;
                this.updateHideInfoPopupLabel();
            });
        };

        const applyHideInfoPopup = (value) => {
            this.settings.hideInfoPopup = value;
            this.applySettings();
            this.saveSettings();
            this.updateContextMenuIcons();
            // 同步主开关派生状态与子开关组显隐
            this.syncSettingsPageToggles();
            // 立即更新状态
            updateToggleState();
        };

        // 单击:立即切换临时禁止(7天)。preventDefault阻止label向input转发合成click,避免一次点击触发两次。
        // 双击时前两次click先开临时再切回,最终由dblclick设为永久
        switchLabel.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            applyHideInfoPopup(this.settings.hideInfoPopup.enabled
                ? { enabled: false, type: null, timestamp: null }
                : { enabled: true, type: 'temporary', timestamp: Date.now() });
        });

        // 双击:浏览器原生双击判定,设为永久禁止(覆盖click产生的中间状态)
        switchLabel.addEventListener('dblclick', (e) => {
            e.preventDefault();
            e.stopPropagation();

            applyHideInfoPopup({ enabled: true, type: 'permanent', timestamp: Date.now() });
        });

        // 初始化状态
        updateToggleState();
    },
    updateHideInfoPopupLabel() {
        const settingGroup = document.getElementById('hide-info-popup-toggle')?.closest('.setting-group');
        if (!settingGroup) return;

        const label = settingGroup.querySelector('.setting-label');
        if (!label) return;

        const hideInfoPopup = this.settings.hideInfoPopup;

        if (!hideInfoPopup.enabled) {
            label.textContent = '禁止提示';
        } else if (hideInfoPopup.type === 'temporary') {
            const daysLeft = this.getHideInfoPopupDaysLeft();
            label.innerHTML = `禁止提示 <span class="hide-info-popup-days" data-days-left="${daysLeft}">剩余${daysLeft}天</span>`;
        } else if (hideInfoPopup.type === 'permanent') {
            label.textContent = '禁止提示(永久)';
        }
    },
    getHideInfoPopupDaysLeft() {
        const hideInfoPopup = this.settings.hideInfoPopup;
        if (!hideInfoPopup.enabled || !hideInfoPopup.timestamp || hideInfoPopup.type !== 'temporary') return 0;

        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
        const elapsed = Date.now() - hideInfoPopup.timestamp;
        const remaining = sevenDaysMs - elapsed;

        if (remaining <= 0) return 0;
        return Math.ceil(remaining / (24 * 60 * 60 * 1000));
    },
    isHideInfoPopupActive() {
        const hideInfoPopup = this.settings.hideInfoPopup;
        if (!hideInfoPopup.enabled) return false;

        if (hideInfoPopup.type === 'permanent') return true;

        if (hideInfoPopup.type === 'temporary' && hideInfoPopup.timestamp) {
            const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
            const elapsed = Date.now() - hideInfoPopup.timestamp;

            if (elapsed >= sevenDaysMs) {
                this.settings.hideInfoPopup = { enabled: false, type: null, timestamp: null };
                this.saveSettings();
                return false;
            }
            return true;
        }

        return false;
    },
    toggleHideNotificationsSetting() {
        this.settings.hideNotifications = !this.settings.hideNotifications;
        this.saveSettings();
        this.updateContextMenuIcons();
        this.syncSettingsPageToggles();
        this.showNotification(this.settings.hideNotifications ? '隐藏弹窗：开启' : '隐藏弹窗：关闭');
    },
    toggleHideInfoPopupSetting() {
        if (this.settings.hideInfoPopup.enabled) {
            this.settings.hideInfoPopup = { enabled: false, type: null, timestamp: null };
        } else {
            this.settings.hideInfoPopup = { enabled: true, type: 'permanent', timestamp: Date.now() };
        }
        this.applySettings();
        this.saveSettings();
        this.updateContextMenuIcons();
        this.syncSettingsPageToggles();
        this.showNotification(this.settings.hideInfoPopup.enabled ? '禁止提示：开启' : '禁止提示：关闭');
    },
};

// ==== main/Script/core/mixins/ResetMixin.js ====
// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

const ResetMixin = {
    resetToDefaults() {
        this.settings = JSON.parse(JSON.stringify(this.defaultSettings));
        this.userChangedLogo = false;
        this.applySettings();
        this.saveSettings();

        // 重置欢迎界面状态
        localStorage.removeItem('hasVisited');
        localStorage.removeItem('oooInterfaceFirstRun');
        localStorage.removeItem('welcVersion');

        // 更新设置界面中的值（需在 reload 前执行，否则不会生效）
        if (document.getElementById('settings-modal').classList.contains('show')) {
            this.updateSettingsUI();
        }

        // 显示重置成功的提示（需在 reload 前执行，否则不会显示）
        this.showNotification('已重置');

        // 重置后刷新页面以显示欢迎页面
        location.reload();
    },
    showResetConfirmation(onConfirm) {
        const overlay = document.createElement('div');
        overlay.className = 'confirm-overlay';

        if (this.settings.dynamicBlur) {
            overlay.classList.add('blur-effect');
        }

        const close = () => {
            overlay.classList.remove('show');
            setTimeout(() => {
                if (overlay.parentNode) document.body.removeChild(overlay);
            }, 350);
        };

        // ---- 第一步：红色警报确认 ----
        overlay.innerHTML = `
            <div class="confirm-dialog" id="reset-confirm-dialog">
                <div class="confirm-dialog-icon">
                    <span class="material-icons" style="font-size:48px;color:#ffffff;">warning</span>
                </div>
                <div class="confirm-dialog-title">请确认重置</div>
                <div class="confirm-dialog-message">此操作将不可逆</div>
                <div class="confirm-dialog-buttons">
                    <button class="confirm-dialog-btn confirm-dialog-btn-cancel" id="reset-confirm-cancel1">取消</button>
                    <button class="confirm-dialog-btn confirm-dialog-btn-confirm" id="reset-confirm-ok1">确认</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('show'));

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });

        document.getElementById('reset-confirm-cancel1').addEventListener('click', close);

        document.getElementById('reset-confirm-ok1').addEventListener('click', () => {
            const d1 = document.getElementById('reset-confirm-dialog');
            d1.style.transform = 'scale(0.92) translateY(20px)';
            d1.style.opacity = '0';

            setTimeout(() => this._showCaptcha(overlay, close, onConfirm), 250);
        });
    },
    _showCaptcha(overlay, close, onConfirm) {
        const pieceSize = 44;
        const imgH = 170;
        const targetY = Math.floor((imgH - pieceSize) / 2);

        overlay.innerHTML = `
            <div class="captcha-dialog" id="captcha-dialog">
                <div class="captcha-image" id="captcha-image">
                    <div class="captcha-hole" id="captcha-hole" style="top:${targetY}px;"></div>
                    <div class="captcha-piece" id="captcha-piece" style="top:${targetY}px;"></div>
                </div>
                <div class="captcha-slider-wrapper" id="captcha-track">
                    <div class="captcha-slider-fill" id="captcha-fill"></div>
                    <div class="captcha-slider-thumb" id="captcha-thumb">▶</div>
                </div>
                <div class="captcha-hint" id="captcha-hint">拖动滑块完成验证</div>
            </div>
        `;

        requestAnimationFrame(() => {
            const d = document.getElementById('captcha-dialog');
            const imgContainer = document.getElementById('captcha-image');
            const imgW = imgContainer.offsetWidth;
            const maxPiece = imgW - pieceSize;
            const minTarget = 20;
            const maxTarget = maxPiece - 20;
            const targetX = minTarget + Math.floor(Math.random() * Math.max(1, maxTarget - minTarget));

            document.getElementById('captcha-hole').style.left = targetX + 'px';
            const piece = document.getElementById('captcha-piece');
            piece.style.left = '0';
            piece.style.background = "url('images/back.png') -" + targetX + "px -" + targetY + "px / " + imgW + "px " + imgH + "px no-repeat";

            d.style.transform = 'scale(1) translateY(0)';
            d.style.opacity = '1';

            this._initCaptchaSlider(targetX, imgW, close, () => {
                d.style.transform = 'scale(0.92) translateY(20px)';
                d.style.opacity = '0';
                setTimeout(() => this._showFinalConfirm(overlay, close, onConfirm), 250);
            });
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });
    },
    _showFinalConfirm(overlay, close, onConfirm) {
        overlay.innerHTML = `
            <div class="confirm-dialog" id="reset-confirm-dialog">
                <div class="confirm-dialog-icon">
                    <span class="material-icons" style="font-size:48px;color:#ffffff;">warning</span>
                </div>
                <div class="confirm-dialog-title">请确认已知晓</div>
                <div class="confirm-dialog-message">此操作不可逆</div>
                <div class="confirm-dialog-checkbox">
                    <input type="checkbox" id="irreversible-checkbox">
                    <label for="irreversible-checkbox">我已知晓此操作不可逆</label>
                </div>
                <div class="confirm-dialog-buttons">
                    <button class="confirm-dialog-btn confirm-dialog-btn-cancel" id="reset-confirm-cancel2">取消</button>
                    <button class="confirm-dialog-btn confirm-dialog-btn-confirm" id="reset-confirm-ok2" disabled>确认</button>
                </div>
            </div>
        `;

        requestAnimationFrame(() => {
            const d = document.getElementById('reset-confirm-dialog');
            d.style.transform = 'scale(1) translateY(0)';
            d.style.opacity = '1';
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });

        document.getElementById('reset-confirm-cancel2').addEventListener('click', close);

        const checkbox = document.getElementById('irreversible-checkbox');
        const okBtn = document.getElementById('reset-confirm-ok2');

        checkbox.addEventListener('change', () => {
            okBtn.disabled = !checkbox.checked;
        });

        okBtn.addEventListener('click', () => {
            if (checkbox.checked) {
                close();
                setTimeout(() => onConfirm(), 350);
            }
        });
    },
    _initCaptchaSlider(targetX, imgW, close, onSuccess) {
        const track = document.getElementById('captcha-track');
        const thumb = document.getElementById('captcha-thumb');
        const fill = document.getElementById('captcha-fill');
        const piece = document.getElementById('captcha-piece');
        const hint = document.getElementById('captcha-hint');
        const tolerance = 4;
        let dragging = false;
        let startX = 0;
        let thumbLeft = 0;
        let verified = false;
        let dragStartTime = 0;

        const halfThumb = 22;
        const maxOffset = track.offsetWidth - 44;
        const maxPiece = imgW - 44;

        thumb.style.left = '0';
        fill.style.width = halfThumb + 'px';
        piece.style.left = '0';

        function updatePos(clientX) {
            let dx = clientX - startX + thumbLeft;
            dx = Math.max(0, Math.min(maxOffset, dx));
            thumb.style.left = dx + 'px';
            fill.style.width = (dx + halfThumb) + 'px';
            const piecePos = (dx / maxOffset) * maxPiece;
            piece.style.left = Math.max(0, Math.min(maxPiece, piecePos)) + 'px';
            return dx;
        }

        function onStart(e) {
            if (verified) return;
            e.preventDefault();
            const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            dragging = true;
            startX = clientX;
            thumbLeft = parseInt(thumb.style.left) || 0;
            thumb.classList.remove('failed');
            hint.textContent = '拖动滑块完成验证';
            hint.className = 'captcha-hint';
            dragStartTime = Date.now();
        }

        function onMove(e) {
            if (!dragging || verified) return;
            e.preventDefault();
            updatePos(e.type === 'touchmove' ? e.touches[0].clientX : e.clientX);
        }

        function onEnd(e) {
            if (!dragging || verified) return;
            dragging = false;
            const pieceLeft = parseFloat(piece.style.left) || 0;

            if (Math.abs(pieceLeft - targetX) > tolerance) {
                thumb.classList.add('failed');
                hint.textContent = '验证失败，请重试';
                hint.className = 'captcha-hint error';
                setTimeout(() => {
                    thumb.classList.remove('failed');
                    thumb.style.left = '0';
                    fill.style.width = halfThumb + 'px';
                    piece.style.left = '0';
                }, 400);
                return;
            }

            const elapsed = Date.now() - dragStartTime;

            if (elapsed >= 1500) {
                thumb.classList.add('failed');
                hint.textContent = '验证失败，请重试';
                hint.className = 'captcha-hint error';
                setTimeout(() => {
                    thumb.classList.remove('failed');
                    thumb.style.left = '0';
                    fill.style.width = halfThumb + 'px';
                    piece.style.left = '0';
                }, 400);
                return;
            }

            verified = true;
            thumb.classList.add('verified');
            thumb.innerHTML = '<span class="material-icons" style="font-size:22px;">check</span>';

            if (elapsed < 1000) {
                hint.textContent = '我操，这么快，简直是神';
                hint.className = 'captcha-hint legend';
            } else {
                hint.textContent = '您已超过99.99%的用户';
                hint.className = 'captcha-hint top';
            }

            setTimeout(() => {
                hint.textContent = '';
                hint.className = 'captcha-hint';
                onSuccess();
            }, 1000);
        }

        thumb.addEventListener('mousedown', onStart);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);

        thumb.addEventListener('touchstart', onStart, { passive: false });
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onEnd);

    },
};

// ==== main/Script/core/mixins/AssetsMixin.js ====
// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

// [bundled] import { … } from '../first-paint.js'

// 画完再看像素里有没有透明。判容器是不够的：PNG 的调色板 + tRNS、WebP/AVIF 的
// alpha 通道都不体现在容器名上，而这里宁可多花一次 getImageData 也不能把用户的
// 透明壁纸压成黑底。读不出来（理论上不会，同源）就当有 alpha，退回原样存。
//
// 12MP 上这一次扫描实测 78ms（PNG 156ms），是整条压缩路径里最贵的一段。所以两头都收：
//   1) 「格式上装不下 alpha」的（JPEG、color type 0/2 的 PNG）在调用方就跳过，压根不进这里；
//   2) 真要扫时按 4 字节整字比，而不是逐字节跳 4 —— 实测 78ms → 13ms。
function canvasHasTransparency(ctx, w, h) {
    let d;
    try {
        d = ctx.getImageData(0, 0, w, h).data;
    } catch (e) {
        return true;   // 读不出来（理论上不会，同源）就当有 alpha，退回原样存
    }
    // 按 4 字节整字比：12MP 实测 78ms → 13ms。
    // alpha 是每个像素的第 4 个字节，小端机上就是 32 位字的最高字节，用 `>>> 24` 取。
    // **不能写 `(u[i] & 0xFF000000) !== 0xFF000000`** —— `&` 会把结果当 int32，最高位
    // 为 1 时是负数（-16777216），永远不等于那个正值字面量，于是每一张不透明图都被判成
    // 「有透明」、所有壁纸都被改存成 PNG（体积反而涨）。矩阵测试逮到的就是这个。
    try {
        const u = new Uint32Array(d.buffer, d.byteOffset, d.length >> 2);
        for (let i = 0; i < u.length; i++) {
            if ((u[i] >>> 24) !== 255) return true;
        }
        return false;
    } catch (e) {
        // 视图建不起来（理论上不会）就退回逐字节扫，别把「工具失败」当成「有 alpha」
        for (let i = 3; i < d.length; i += 4) {
            if (d[i] !== 255) return true;
        }
        return false;
    }
}

// 「这份字节在格式上就装不下 alpha 通道」—— 这是证明，不是猜测，所以可以据此跳过
// 上面那次全画布扫描。JPEG 的段结构里没有 alpha 可言；PNG 的 IHDR color type
// 0（灰度）与 2（真彩）也没有（3=调色板可能带 tRNS、4=灰度+alpha、6=RGBA 都得扫）。
// PNG 布局：8 字节签名 + 4 长度 + 'IHDR'，于是 data 从头算起是 16 宽 / 20 高 /
// 24 位深 / **25 颜色类型**。
function containerCannotHaveAlpha(bytes) {
    if (!bytes || bytes.length < 26) return false;
    if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) return true;
    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
        const colorType = bytes[25];
        return colorType === 0 || colorType === 2;
    }
    return false;
}

const AssetsMixin = {
    loadCustomFonts() {
        const promises = this.settings.customFonts.map(font => {
            try {
                const buffer = this.dataUrlToArrayBuffer(font.data);
                const fontFace = new FontFace(font.name, buffer);
                return fontFace.load().then((loadedFace) => {
                    document.fonts.add(loadedFace);
                }).catch((error) => {
                    console.error('自定义字体加载失败:', error);
                });
            } catch (error) {
                console.error('自定义字体解码失败:', error);
                return Promise.resolve();
            }
        });
        return Promise.all(promises);
    },
    handleLogoSelectChange(value) {
        const textLogoGroup = document.getElementById('text-logo-inline-group');
        const textLogoItem = document.querySelector('.select-item-text-logo');

        // 移除所有选项的selected类
        document.querySelectorAll('#logo-select-items .select-item').forEach(item => {
            item.classList.remove('selected');
        });

        if (value === 'text-logo') {
            // 给文字Logo选项添加selected类
            textLogoItem.classList.add('selected');
            // 显示文字Logo输入框
            textLogoGroup.style.display = 'flex';

            // 如果已经有文字Logo内容，直接应用
            const textInput = document.getElementById('text-logo-input');
            if (textInput.value.trim()) {
                this.setTextLogo();
            }
        } else {
            // 隐藏文字Logo输入框
            textLogoGroup.style.display = 'none';

            this.changeLogo(value);
        }

        this.updateSettingsUI();
    },
    dataUrlToArrayBuffer(dataUrl) {
        const base64 = dataUrl.split(',')[1];
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer;
    },
    handleFontUpload(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const fontData = e.target.result;
            const fontName = file.name.replace(/\.[^/.]+$/, ""); // 移除扩展名

            // 检查是否已存在同名字体
            if (this.settings.customFonts.some(font => font.name === fontName)) {
                this.showNotification(`字体"${fontName}"已存在`);
                return;
            }

            try {
                // 使用 ArrayBuffer 直接构造 FontFace，绕过 CSP url() 限制
                const buffer = this.dataUrlToArrayBuffer(fontData);
                const fontFace = new FontFace(fontName, buffer);

                fontFace.load().then((loadedFace) => {
                    try {
                        document.fonts.add(loadedFace);

                        // 添加到自定义字体列表
                        this.settings.customFonts.push({
                            name: fontName,
                            data: fontData
                        });

                        // 更新自定义字体列表
                        this.updateCustomFontsList();

                        // 自定义字体上传必然与主题字体不一致
                        this.checkThemeConsistency('font', fontName);

                        this.saveSettings();
                        this.showNotification(`字体"${fontName}"上传成功`);

                        // 刷新右侧面板菜单（如果打开）
                        const rightPanelUpper = document.getElementById('right-panel-upper');
                        if (rightPanelUpper && rightPanelUpper.querySelector('.settings-menu-container')) {
                            const selected = document.getElementById('font-select-selected');
                            const hiddenSelect = document.getElementById('font-select');
                            const items = document.getElementById('font-select-items');
                            this.showSettingsMenuInRightPanel(items, selected, hiddenSelect);
                        }
                    } catch (err) {
                        console.error('字体上传后处理异常:', err);
                        this.showNotification('字体上传处理出错: ' + err.message);
                    }
                }).catch((error) => {
                    console.error('字体加载失败:', error);
                    this.showNotification('字体加载失败');
                });
            } catch (error) {
                console.error('字体解码失败:', error);
                this.showNotification('字体文件格式不支持');
            }
        };

        reader.onerror = () => {
            this.showNotification('文件读取失败');
        };

        reader.readAsDataURL(file);
    },
    handleLogoUpload(file) {
        if (!file) return;

        // 检查文件大小（限制为2MB）
        if (file.size > 2 * 1024 * 1024) {
            this.showNotification('图片文件过大，请选择小于2MB的文件');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const logoData = e.target.result;
            const logoName = file.name.replace(/\.[^/.]+$/, ""); // 移除扩展名

            // 检查是否已存在同名Logo
            if (this.settings.customLogos.some(logo => logo.name === logoName)) {
                this.showNotification(`Logo"${logoName}"已存在`);
                return;
            }

            // 添加到自定义Logo列表
            this.settings.customLogos.push({
                name: logoName,
                data: logoData,
                darkData: null
            });

            // 更新自定义Logo列表显示
            this.updateCustomLogosList();

            // 自定义 Logo 上传必然与主题 Logo 不一致
            this.checkThemeConsistency('logo', logoName);

            this.saveSettings();
            this.showNotification(`Logo"${logoName}"上传成功`);

            // 刷新右侧面板菜单（如果打开）
            const rightPanelUpper = document.getElementById('right-panel-upper');
            if (rightPanelUpper && rightPanelUpper.querySelector('.settings-menu-container')) {
                const selected = document.getElementById('logo-select-selected');
                const hiddenSelect = document.getElementById('logo-select');
                const items = document.getElementById('logo-select-items');
                this.showSettingsMenuInRightPanel(items, selected, hiddenSelect);
            }
        };

        reader.onerror = () => {
            this.showNotification('文件读取失败');
        };

        reader.readAsDataURL(file);
    },
    handleDarkLogoUpload(file) {
        if (!file) return;

        // 检查文件大小（限制为2MB）
        if (file.size > 2 * 1024 * 1024) {
            this.showNotification('图片文件过大，请选择小于2MB的文件');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const darkLogoData = e.target.result;

            // 优先使用_currentDarkLogoTarget，否则使用当前选中的Logo
            const targetLogoName = this._currentDarkLogoTarget || this.settings.logo;

            // 查找目标自定义Logo
            const customLogo = this.settings.customLogos.find(logo => logo.name === targetLogoName);
            if (customLogo) {
                customLogo.darkData = darkLogoData;
                this.saveSettings();
                this.applyLogo();
                this.showNotification('暗色Logo上传');

                // 刷新右侧面板以更新按钮文字
                const rightPanelUpper = document.getElementById('right-panel-upper');
                if (rightPanelUpper && rightPanelUpper.querySelector('.settings-menu-container')) {
                    const selected = document.getElementById('logo-select-selected');
                    const hiddenSelect = document.getElementById('logo-select');
                    const items = document.getElementById('logo-select-items');
                    if (selected && hiddenSelect && items) {
                        this.showSettingsMenuInRightPanel(items, selected, hiddenSelect);
                    }
                }
            } else {
                this.showNotification('请先选择一个Logo');
            }

            // 清除临时目标
            this._currentDarkLogoTarget = null;
        };
        reader.onerror = () => {
            this.showNotification('文件读取失败');
        };

        reader.readAsDataURL(file);
    },
    // File 入口，实现在 compressImageBytes 里
    compressImage(file, maxWidth, maxHeight, quality) {
        return file.arrayBuffer()
            .then((buf) => this.compressImageBytes(new Uint8Array(buf), file.type, maxWidth, maxHeight, quality));
    },
    // 从字节压缩。走 Blob URL 而不是 FileReader.readAsDataURL —— 后者会先造一份
    // base64 字符串（10MB 的文件就是 13MB 的字符串），而我们紧接着就要把它解码成
    // 像素，那份字符串纯属白造。迁移已有壁纸时手里也只有字节，没有 File。
    // 出口是 JPEG：canvas.toDataURL 只有 JPEG 能调质量，尺寸压下来之后再编码成 PNG
    // 只会更大。preserveAlpha 为真时，若原图确实带透明像素就改用 PNG ——
    // 壁纸是满屏铺的，把透明区域压成黑色是实打实的观感变化。
    compressImageBytes(bytes, mime, maxWidth, maxHeight, quality, preserveAlpha) {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(new Blob([bytes], { type: mime || 'image/jpeg' }));
            const img = new Image();
            const done = () => {
                img.onload = null;
                img.onerror = null;
                URL.revokeObjectURL(url);
            };
            img.onload = () => {
                let w = img.width;
                let h = img.height;
                if (w > maxWidth || h > maxHeight) {
                    const ratio = Math.min(maxWidth / w, maxHeight / h);
                    w = Math.round(w * ratio);
                    h = Math.round(h * ratio);
                }
                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);
                let out;
                // preserveAlpha 的调用方（壁纸）宁愿多扫一次，也不愿把透明图压成黑底；
                // 但「格式上不可能有 alpha」时那次扫描是白扫，直接跳过（12MP 实测省 78ms）。
                if (preserveAlpha && !containerCannotHaveAlpha(bytes) && canvasHasTransparency(ctx, w, h)) {
                    out = canvas.toDataURL('image/png');
                } else {
                    out = canvas.toDataURL('image/jpeg', quality);
                }
                done();
                resolve(out);
            };
            img.onerror = () => {
                done();
                reject(new Error('图片加载失败'));
            };
            img.src = url;
        });
    },
    updateCustomLogosList() {
        // 更新下拉菜单中的自定义Logo选项
        const logoSelectItems = document.getElementById('logo-select-items');
        const logoSelect = document.getElementById('logo-select');
        const logoSelectSelected = document.getElementById('logo-select-selected');

        if (!logoSelectItems || !logoSelect) return;

        // 移除已有的自定义Logo选项（支持多种标识符）
        const existingCustomItems = logoSelectItems.querySelectorAll('.select-item-custom-logo, .select-item[data-custom="true"]');
        existingCustomItems.forEach(item => item.remove());

        const existingCustomOptions = logoSelect.querySelectorAll('option.custom-logo-option, option[data-custom="true"]');
        existingCustomOptions.forEach(option => option.remove());

        // 添加自定义Logo选项
        this.settings.customLogos.forEach(logo => {
            // 添加到下拉菜单
            const selectItem = document.createElement('div');
            selectItem.className = 'select-item select-item-custom-logo';
            selectItem.setAttribute('data-value', logo.name);
            selectItem.textContent = logo.name;
            logoSelectItems.appendChild(selectItem);

            // 添加到隐藏的select
            const option = document.createElement('option');
            option.value = logo.name;
            option.textContent = logo.name;
            option.className = 'custom-logo-option';
            logoSelect.appendChild(option);
        });

        // 更新显示的文本
        if (logoSelectSelected) {
            // 主题模式下保持"主题名：Logo名"格式，不覆盖
            const themeInfo = this.getThemeDisplayInfo();
            if (themeInfo && themeInfo.logoName) {
                // 保持不变
            } else {
                const selectedOption = logoSelect.querySelector(`option[value="${this.settings.logo}"]`);
                if (selectedOption) {
                    logoSelectSelected.textContent = selectedOption.textContent;
                }
            }
        }

        // 重新绑定下拉菜单点击事件
        this.rebindCustomSelectItems();
    },
    deleteCustomLogo(index) {
        const logoName = this.settings.customLogos[index].name;

        // 从设置中移除
        this.settings.customLogos.splice(index, 1);

        // 如果当前使用的是被删除的Logo，则切换回默认Logo
        if (this.settings.logo === logoName) {
            this.settings.logo = 'default';
            this.applyLogo();
        }

        // 更新自定义Logo列表显示（会自动清理DOM）
        this.updateCustomLogosList();
        this.saveSettings();
        this.showNotification('自定义Logo删除');
    },
    deleteCustomFont(index) {
        const fontName = this.settings.customFonts[index].name;

        // 从设置中移除
        this.settings.customFonts.splice(index, 1);

        // 从 document.fonts 中移除对应的 FontFace
        for (const face of document.fonts) {
            if (face.family === fontName) {
                document.fonts.delete(face);
                break;
            }
        }

        // 如果当前使用的是被删除的字体，则切换回默认字体
        if (this.settings.font === fontName) {
            this.settings.font = 'Sans Flex';
            this.applyFont();
        }

        // 更新自定义字体列表显示
        this.updateCustomFontsList();
        this.saveSettings();
        this.showNotification('字体已删除');
    },
    updateCustomFontsList() {
        const fontSelectItems = document.getElementById('font-select-items');
        const fontSelect = document.getElementById('font-select');
        const fontSelectSelected = document.getElementById('font-select-selected');

        if (!fontSelectItems || !fontSelect) return;

        // 移除已有的自定义字体选项（支持多种标识符）
        const existingCustomItems = fontSelectItems.querySelectorAll('.select-item-custom-font, .select-item[data-custom="true"]');
        existingCustomItems.forEach(item => item.remove());

        const existingCustomOptions = fontSelect.querySelectorAll('option.custom-font-option, option[data-custom="true"]');
        existingCustomOptions.forEach(option => option.remove());

        // 添加自定义字体选项
        this.settings.customFonts.forEach(font => {
            // 添加到下拉菜单
            const selectItem = document.createElement('div');
            selectItem.className = 'select-item select-item-custom-font';
            selectItem.setAttribute('data-value', font.name);
            selectItem.textContent = font.name;
            fontSelectItems.appendChild(selectItem);

            // 添加到隐藏的select
            const option = document.createElement('option');
            option.value = font.name;
            option.textContent = font.name;
            option.className = 'custom-font-option';
            fontSelect.appendChild(option);
        });

        // 更新显示的文本
        if (fontSelectSelected) {
            const themeInfo = this.getThemeDisplayInfo();
            if (!themeInfo || !themeInfo.fontName) {
                const selectedOption = fontSelect.querySelector(`option[value="${this.settings.font}"]`);
                if (selectedOption) {
                    fontSelectSelected.textContent = selectedOption.textContent;
                }
            }
        }
    },
    uploadDarkLogo(index) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        // 安全移除 fileInput（click 后立即移除会导致部分浏览器文件对话框失效）
        const removeFileInput = () => {
            setTimeout(() => {
                if (fileInput.parentNode) {
                    fileInput.parentNode.removeChild(fileInput);
                }
            }, 0);
        };

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) {
                removeFileInput();
                return;
            }

            // 检查文件大小（限制为2MB）
            if (file.size > 2 * 1024 * 1024) {
                this.showNotification('图片文件过大，请选择小于2MB的文件');
                removeFileInput();
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const darkLogoData = e.target.result;
                this.settings.customLogos[index].darkData = darkLogoData;
                this.saveSettings();
                this.applyLogo();
                this.updateCustomLogosList();
                this.showNotification('暗色Logo上传');
            };
            reader.onerror = () => {
                this.showNotification('文件读取失败');
            };

            reader.readAsDataURL(file);
            removeFileInput();
        });

        // 用户取消选择时也移除输入元素
        fileInput.addEventListener('cancel', removeFileInput);

        document.body.appendChild(fileInput);
        fileInput.click();
    },
    deleteDarkLogo(index) {
        this.settings.customLogos[index].darkData = null;
        this.saveSettings();
        this.applyLogo();
        this.updateCustomLogosList();
        this.showNotification('暗色Logo删除');
    },
    setTextLogo() {
        const textInput = document.getElementById('text-logo-input');
        const text = textInput.value.trim();

        // 计算字符长度（中文算2个字符）
        const getCharLength = (str) => {
            let length = 0;
            for (let i = 0; i < str.length; i++) {
                const charCode = str.charCodeAt(i);
                if (charCode > 127) {
                    length += 2;
                } else {
                    length += 1;
                }
            }
            return length;
        };

        if (text) {
            // 检查字符长度
            if (getCharLength(text) > 25) {
                this.showNotification('超出输入范围');
                return;
            }

            this.settings.logoType = 'text';
            this.settings.logo = 'text-logo';
            this.settings.textLogo = text;
            this.userChangedLogo = true;
            this.checkThemeConsistency('logo', 'text-logo');
            this.applyLogo();
            this.saveSettings();
            this.showNotification('文字Logo设置');

            // 更新select-selected的显示文本
            const selected = document.getElementById('logo-select-selected');
            if (selected) {
                selected.textContent = '自定义文字Logo';
            }

            // 更新隐藏的select元素的值
            const hiddenSelect = document.getElementById('logo-select');
            if (hiddenSelect) {
                hiddenSelect.value = 'text-logo';
            }

            // 关闭下拉菜单
            const items = document.getElementById('logo-select-items');
            if (items) {
                items.classList.add('select-hide');
            }
        } else {
            this.showNotification('请输入文本');
        }
    },
    changeFont(font) {
        this.settings.font = font;
        this.checkThemeConsistency('font', font);
        this.saveSettings();
        // 不立即应用，等待用户点击应用按钮
    },
    changeLogo(logo) {
        this.settings.logo = logo;
        this.settings.logoType = 'image';
        this.userChangedLogo = true;
        this.checkThemeConsistency('logo', logo);
        this.saveSettings();
        this.applyLogo();

        // 移除应用按钮的所有logo类，保持蓝色
        this.updateApplyButtonColor();
    },
    applyFont() {
        // 移除所有字体类
        const fontClasses = ['font-ginto', 'font-josefin', 'font-code', 'font-hmsc'];
        fontClasses.forEach(fontClass => {
            document.body.classList.remove(fontClass);
        });

        // 移除自定义字体类
        this.settings.customFonts.forEach(font => {
            const safeClassName = 'font-' + font.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
            document.body.classList.remove(safeClassName);
        });

        // 直接设置字体而不是使用CSS类
        if (this.settings.customFonts.some(font => font.name === this.settings.font)) {
            // 对于自定义字体，直接设置font-family（加引号防止含空格的字体名被拆分）
            document.body.style.fontFamily = `'${this.settings.font}'`;
        } else {
            // 对于预定义字体，使用CSS类
            document.body.style.fontFamily = ''; // 重置为默认
            switch (this.settings.font) {
                case 'Ginto':
                    document.body.classList.add('font-ginto');
                    break;
                case 'Josefin':
                    document.body.classList.add('font-josefin');
                    break;
                case 'Code':
                    document.body.classList.add('font-code');
                    break;
                case 'HMSC':
                    document.body.classList.add('font-hmsc');
                    break;
                default:
                    if (this.settings.font && this.settings.font !== 'Sans Flex') {
                        document.body.style.fontFamily = `'${this.settings.font}'`;
                    }
                    break;
            }
        }
    },
    loadIconWithFallback(iconName, logoElement) {
        const onlineUrl = this.onlineIcons[iconName];
        const localUrl = `images/${iconName}`;

        if (!onlineUrl) {
            logoElement.src = localUrl;
            return;
        }

        if (this.iconLoadStatus[iconName] === 'online') {
            logoElement.src = onlineUrl;
            return;
        }

        if (this.iconLoadStatus[iconName] === 'local') {
            logoElement.src = localUrl;
            return;
        }

        logoElement.src = localUrl;

        // 在线 logo 探测是「锦上添花」：本地图已经在显示（images/dll.png 就在扩展里）。
        // 起跑推到 **load 之后** —— 这个 new Image() 在 load 之前开始加载的话，
        // 会把 window.load 一起拖到图片下完（线上这张 2MB，实测 1.9 秒）。
        // 判定结果与回填路径不变。
        afterLoad(() => {
            const testImg = new Image();
            testImg.onload = () => {
                this.iconLoadStatus[iconName] = 'online';
                logoElement.src = onlineUrl;
            };
            testImg.onerror = () => {
                this.iconLoadStatus[iconName] = 'local';
                logoElement.src = localUrl;
            };
            testImg.src = onlineUrl;
        });
    },
    applyLogo() {
        const logoElement = document.getElementById('logo');
        const textLogoElement = document.getElementById('text-logo');

        this.updateContextMenuColors();

        if (this.infoManager) {
            this.infoManager.updateInfoIndicatorColor();
        }

        if (this.settings.logo === 'text-logo') {
            // 显示文字Logo
            logoElement.style.display = 'none';
            textLogoElement.style.display = 'block';
            textLogoElement.textContent = this.settings.textLogo;

            // 设置文字Logo字体（加引号防止含空格的字体名被拆分）
            textLogoElement.style.fontFamily = `'${this.getFontFamily()}'`;

            // 设置文字Logo颜色（日间黑色，夜间白色）
            textLogoElement.style.color = this.isDarkMode ? '#ffffff' : '#000000';
        } else {
            // 显示图片Logo
            logoElement.style.display = 'block';
            textLogoElement.style.display = 'none';

            // 主题 Logo 覆盖：使用主题定义的 location / dark / online / 尺寸
            if (this.settings.themeEnabled && this.themeOverrides?.logo) {
                const o = this.themeOverrides.logo;
                const isDark = this.isDarkMode;
                if (o.width) logoElement.style.width = o.width;
                else logoElement.style.width = '';
                if (o.height) logoElement.style.height = o.height;
                else logoElement.style.height = '';

                const onlineUrl = isDark ? (o.onlineDark || o.online) : o.online;
                const localUrl = isDark && o.dark ? o.dark : o.location;
                this.loadThemeLogoWithFallback(onlineUrl, localUrl, logoElement);
                logoElement.alt = this.settings.logo;
            } else {
                // 清除主题遗留的尺寸样式
                logoElement.style.width = '';
                logoElement.style.height = '';

                // 根据当前主题选择对应的Logo文件
                const logoMap = {
                    'default': this.isDarkMode ? 'dln.png' : 'dll.png',
                    'Google': this.isDarkMode ? 'gln.png' : 'gll.png',
                    'Microsoft': this.isDarkMode ? 'mln.png' : 'mll.png',
                    'Apple': this.isDarkMode ? 'aln.png' : 'all.png',
                    'HUAWEI': this.isDarkMode ? 'hln.png' : 'hll.png'
                };

                // 自动模式逻辑
                let currentLogo = this.settings.logo;
                if (currentLogo === 'auto') {
                    currentLogo = this.currentEngine === 'google' ? 'Google' : 'Microsoft';
                }

                // 检查是否是自定义Logo
                const customLogo = this.settings.customLogos.find(logo => logo.name === currentLogo);
                if (customLogo) {
                    if (this.isDarkMode && customLogo.darkData) {
                        logoElement.src = customLogo.darkData;
                    } else {
                        logoElement.src = customLogo.data;
                    }
                } else if (logoMap[currentLogo]) {
                    const iconName = logoMap[currentLogo];
                    if (currentLogo === 'default' && this.onlineIcons[iconName]) {
                        this.loadIconWithFallback(iconName, logoElement);
                    } else {
                        logoElement.src = `images/${iconName}`;
                    }
                }
                logoElement.alt = this.settings.logo;
            }
        }

        // 更新搜索引擎按钮类名
        this.updateEngineButtonClasses();

        // 更新侧边栏图标配色
        this.updateSidebarIconColors();
    },
    getFontFamily() {
        if (this.settings.customFonts.some(font => font.name === this.settings.font)) {
            return this.settings.font;
        } else {
            switch (this.settings.font) {
                case 'Ginto': return 'Ginto';
                case 'Josefin': return 'Josefin';
                case 'Code': return 'Code';
                case 'HMSC': return 'HMSC';
                case 'Sans Flex': return 'Sans Flex';
                default: return this.settings.font || 'Sans Flex';
            }
        }
    },
};

// ==== main/Script/core/proxy.js ====
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

// ==== main/Script/core/wallpaper-formats.js ====
'use strict';

// 壁纸格式识别：HDR（HDR10 / HDR10+ / HDR Vivid / Dolby Vision / HLG / Ultra HDR）
// 与 Live 图（Apple 实况照片 / 华为动态照片 / 安卓系动态照片）。
//
// 为什么不用现成的开源库：
//   本插件是纯前端 MV3 扩展，manifest.json 的 CSP 是 `script-src 'self'`，
//   既加载不了 CDN 脚本，也跑不了 WebAssembly（那需要额外开放 'wasm-unsafe-eval'）。
//   libheif / heic2any / exifreader 这类库要么是 WASM，要么依赖打包流程，
//   而本项目是没有构建步骤的裸 ES module 目录 —— 所以这里自己走容器格式。
//
// 本模块只吃字节、只吐描述：不碰 DOM、不碰 chrome.*，可以单独喂 fixture 测。
// 唯一的外部 API 是 ZIP 解压用的 DecompressionStream（Chrome 103+ 原生，非 WASM）。

// ============================ 字节小工具 ============================

function readU16(b, p) {
    return (b[p] << 8) | b[p + 1];
}

function readU32(b, p) {
    return ((b[p] << 24) | (b[p + 1] << 16) | (b[p + 2] << 8) | b[p + 3]) >>> 0;
}

function readU64(b, p) {
    // 只用得到文件内偏移，超过 2^53 的交给浮点即可，不做 BigInt
    return readU32(b, p) * 4294967296 + readU32(b, p + 4);
}

// 大端、长度可变的整数（ISO-BMFF 的 iloc 用 4/8 字节长度字段）
function readVarInt(b, p, size) {
    let v = 0;
    for (let i = 0; i < size; i++) v = v * 256 + b[p + i];
    return v;
}

// ZIP 是**小端**的（JPEG/ISO-BMFF 都是大端），别混用
function readLE16(b, p) {
    return b[p] | (b[p + 1] << 8);
}

function readLE32(b, p) {
    return (b[p] | (b[p + 1] << 8) | (b[p + 2] << 16) | (b[p + 3] << 24)) >>> 0;
}

function ascii(b, p, len) {
    let s = '';
    const end = Math.min(p + len, b.length);
    for (let i = p; i < end; i++) s += String.fromCharCode(b[i]);
    return s;
}

function readCString(b, p, end) {
    let s = '';
    while (p < end && b[p] !== 0) {
        s += String.fromCharCode(b[p]);
        p++;
    }
    return s;
}

// 在 [from, to) 里找 ASCII 串。比逐段解析更能容忍各家厂商的自定义写法。
function indexOfAscii(b, needle, from, to) {
    const start = from || 0;
    const end = Math.min(to === undefined ? b.length : to, b.length);
    const n = needle.length;
    const first = needle.charCodeAt(0);
    for (let i = start; i <= end - n; i++) {
        if (b[i] !== first) continue;
        let ok = true;
        for (let j = 1; j < n; j++) {
            if (b[i + j] !== needle.charCodeAt(j)) { ok = false; break; }
        }
        if (ok) return i;
    }
    return -1;
}

function hasAscii(b, needle, from, to) {
    return indexOfAscii(b, needle, from, to) !== -1;
}

// 取 XMP / XML 里的 `name="value"` 属性，命名空间前缀原样保留（写成正则要转义冒号，不如纯扫）
const ATTR_CACHE = Object.create(null);

function attr(text, name) {
    let re = ATTR_CACHE[name];
    if (!re) {
        // 前缀里的 ':' 与 '-' 在正则里不需要转义，直接拼更省事
        re = ATTR_CACHE[name] = new RegExp(name + '\\s*=\\s*"([^"]*)"');
    }
    const m = text.match(re);
    return m ? m[1] : null;
}

function attrNumber(text, name) {
    const v = attr(text, name);
    if (v === null) return null;
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : null;
}

// ============================ 容器嗅探 ============================

const HEIF_BRANDS = ['heic', 'heix', 'hevc', 'hevx', 'heim', 'heis', 'hevm', 'hevs', 'mif1', 'msf1'];
const AVIF_BRANDS = ['avif', 'avis'];

function sniffContainer(bytes) {
    if (!bytes || bytes.length < 12) return 'unknown';

    if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) return 'jpeg';
    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) return 'png';
    // Apple 实况照片包 .livp 就是 ZIP（本地/中央目录头都以 PK 开头）
    if (bytes[0] === 0x50 && bytes[1] === 0x4B &&
        (bytes[2] === 0x03 || bytes[2] === 0x05 || bytes[2] === 0x07)) return 'zip';
    if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) return 'gif';
    if (bytes[0] === 0x42 && bytes[1] === 0x4D) return 'bmp';
    // WebP: RIFF....WEBP
    if (ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 4) === 'WEBP') return 'webp';
    // JPEG XL 裸码流
    if (bytes[0] === 0xFF && bytes[1] === 0x0A) return 'jxl';

    if (ascii(bytes, 4, 4) === 'ftyp') {
        const brands = readFtypBrands(bytes);
        if (brands.some(b => AVIF_BRANDS.includes(b))) return 'avif';
        if (brands.some(b => HEIF_BRANDS.includes(b))) return 'heif';
        if (brands.includes('jxl ')) return 'jxl';
        return 'isobmff';
    }
    return 'unknown';
}

function readFtypBrands(bytes) {
    const size = readU32(bytes, 0);
    const end = Math.min(size || bytes.length, bytes.length);
    const brands = [ascii(bytes, 8, 4)];
    for (let p = 16; p + 4 <= end; p += 4) brands.push(ascii(bytes, p, 4));
    return brands.filter(Boolean);
}

// ============================ 通用兜底扫描 ============================
//
// 各家的 XMP 写法差异很大（尤其华为），只按已知字段判定会漏掉真实文件。
// 这里补两条与厂商无关的结构性判据。

// 内嵌视频一定是一段独立的 ISO-BMFF 接在图片字节之后 —— 不管调用方在 XMP 里
// 怎么写，这段视频自己的结构骗不了人。按结构找比猜字段可靠得多。
const VIDEO_BRANDS = ['mp4', 'isom', 'iso2', 'iso4', 'iso5', 'iso6', 'avc1', 'hvc1',
    'hev1', 'mp41', 'mp42', '3gp4', '3gp5', '3g2a', 'm4v', 'M4V', 'MSNV', 'qt', 'dash'];
const APPENDED_SCAN_LIMIT = 4 * 1024 * 1024;

function findAppendedVideo(bytes) {
    if (!bytes || bytes.length < 1024) return null;

    // 主判据：追加在 JPEG 后面的视频，起点就是主图的 EOI 之后那一字节，与视频多长无关。
    // 原来只按「尾部 4MB 里找最后一个 ftyp」找，手机拍的动图视频动辄 5–15MB，
    // ftyp 落在窗口之外就整条判不出来 —— 表现成「方框不出现」。
    const eoi = findJpegEnd(bytes);
    if (eoi > 0 && eoi + 12 <= bytes.length) {
        const box = appendedBoxAt(bytes, eoi);
        if (box) return box;
    }

    // 兜底：图片不是 JPEG（或视频前面还垫着别的数据）时，从尾部往前找 ftyp
    const from = Math.max(2, bytes.length - APPENDED_SCAN_LIMIT);

    for (let i = bytes.length - 12; i >= from; i--) {
        if (bytes[i] !== 0x66 || bytes[i + 1] !== 0x74 || bytes[i + 2] !== 0x79 || bytes[i + 3] !== 0x70) continue;

        const boxStart = i - 4;
        if (boxStart < 2) continue;                    // 文件开头的 ftyp 是图片自己的
        const size = readU32(bytes, boxStart);
        if (size < 8 || size > 4096) continue;         // ftyp 头本身很短
        const brand = ascii(bytes, i + 4, 4);
        if (VIDEO_BRANDS.indexOf(brand) < 0) continue;

        // 视频一定带 moov（mov/mp4 都一样），用它把图片数据里偶然出现的
        // 「ftyp + 像样的 brand」这种巧合排掉
        if (indexOfAscii(bytes, 'moov', i, bytes.length) < 0) continue;

        return { offset: boxStart, length: bytes.length - boxStart, brand };
    }
    return null;
}

// JPEG 的熵编码数据里 `FF` 后面只能跟 `00`（字节填充）或 RSTn 标记（D0–D7），
// 所以 SOS 之后的第一个 `FF D9` 一定是真正的 EOI —— 不会撞上图像数据里的巧合。
// 返回 EOI 之后那一字节的下标（文件到 EOI 就结束时返回 0）。
function findJpegEnd(bytes) {
    if (!bytes || bytes.length < 4 || bytes[0] !== 0xFF || bytes[1] !== 0xD8) return 0;
    let i = 2;
    while (i + 1 < bytes.length) {
        if (bytes[i] !== 0xFF) { i++; continue; }      // 不在段头时往后挪（容错）
        const marker = bytes[i + 1];
        if (marker === 0xFF) { i++; continue; }        // 填充
        if (marker === 0xD9) return i + 2;             // 结构性的 EOI：到这就完了
        if (marker === 0xDA) {                         // SOS：后面是熵编码数据，只能扫
            let next = 0;
            for (let p = i + 2; p + 1 < bytes.length; p++) {
                if (bytes[p] !== 0xFF) continue;
                const m = bytes[p + 1];
                if (m === 0xD9) return p + 2;
                if (m === 0x00 || (m >= 0xD0 && m <= 0xD7)) { p++; continue; }  // 填充字节 / 重启标记
                // 别的标记：这一遍扫描到头了（多扫描的渐进式 JPEG 后面还有 SOS 和段），
                // 交回外层按段结构继续走，别当成 EOI
                next = p;
                break;
            }
            if (!next) return 0;
            i = next;
            continue;
        }
        if (marker === 0x01 || (marker >= 0xD0 && marker <= 0xD7)) { i += 2; continue; }
        const size = readU16(bytes, i + 2);
        if (size < 2 || i + 2 + size > bytes.length) return 0;
        i = i + 2 + size;
    }
    return 0;
}

// 紧跟图片字节的那段 ISO-BMFF 是不是一段视频（带 moov 才算，能播的才有）
function appendedBoxAt(bytes, offset) {
    if (offset + 12 > bytes.length) return null;
    if (ascii(bytes, offset + 4, 4) !== 'ftyp') return null;
    const size = readU32(bytes, offset);
    if (size < 8 || size > 4096) return null;          // ftyp 头本身很短
    const brand = ascii(bytes, offset + 8, 4);
    if (VIDEO_BRANDS.indexOf(brand) < 0) return null;
    if (indexOfAscii(bytes, 'moov', offset, bytes.length) < 0) return null;
    return { offset, length: bytes.length - offset, brand };
}

// XMP 被拆成扩展段、或厂商把标记写在别处时的兜底：直接在头部字节里找判据串。
// 分成两组、各自映射到对应的信号 —— 增益图的串不能拿去当 HDR Vivid 的证据。
// 只用不会出现在图像数据里的长串，避免误报（HDR 方框报错的代价比漏报高）。
const GAINMAP_MARKERS = ['hdrgm:Version', 'GContainer:Version'];
const VIVID_MARKERS = ['HDR_VIVID', 'hdr_vivid', 'HUAWEI_HDR', 'SL_HDR'];

function scanMarkers(bytes, list, limit) {
    const head = ascii(bytes, 0, Math.min(bytes.length, limit || 262144));
    return list.some(m => head.indexOf(m) >= 0);
}

// ============================ JPEG ============================

const XMP_SIG = 'http://ns.adobe.com/xap/1.0/';
const XMP_EXT_SIG = 'http://ns.adobe.com/xmp/extension/';
const EXIF_SIG = 'Exif';
// ISO/IEC 21496-1 增益图的标识段（APP2）。Ultra HDR 与华为的 HDR 照片都用它，
// 且 Google 与华为的真实文件里这一段必定存在 —— 比 XMP 可靠得多。
const ISO_GAINMAP_SIG = 'urn:iso:std:iso:ts:21496';
// ITU-T T.35 信令段（APP8）。HDR Vivid 用它声明静态/动态元数据的存在。
const ITU_T35_SIG = 'ITUT35';
// 华为 HDR Vivid 的 EXIF ImageDescription 标记（CUVA 联盟），逐字就这 5 个字符
const CUVA_DESCRIPTION = '_cuva';

// EXIF 的 ImageDescription（IFD0 tag 0x010E）。华为把 HDR Vivid 的标记写在这里，
// 只能精确解出来 —— 拿 `_cuva` 去头部字节里做子串扫描，普通照片的图像数据里
// 也可能凑巧出现同样的字节。解不出来就返回空串（判定方直接用 === 比）。
function parseExifDescription(exif) {
    if (!exif || exif.length < 16) return '';
    const tiff = ascii(exif, 0, 4) === EXIF_SIG ? 6 : 0;      // 载荷含 'Exif\0\0' 前缀
    const order = ascii(exif, tiff, 2);
    if (order !== 'II' && order !== 'MM') return '';
    const le = order === 'II';
    const u16 = p => (le ? exif[p] | (exif[p + 1] << 8) : readU16(exif, p));
    const u32 = p => (le ? readLE32(exif, p) : readU32(exif, p));
    if (u16(tiff + 2) !== 0x2A) return '';                   // TIFF 魔数
    const ifd = tiff + u32(tiff + 4);
    if (ifd + 2 > exif.length) return '';
    const count = u16(ifd);
    for (let k = 0; k < count; k++) {
        const e = ifd + 2 + k * 12;
        if (e + 12 > exif.length) break;
        if (u16(e) !== 0x010E || u16(e + 2) !== 2) continue;  // 2 = ASCII
        const len = u32(e + 4);
        if (len < 1 || len > 64) continue;
        const p = len > 4 ? tiff + u32(e + 8) : e + 8;        // 短值直接内联在条目里
        if (p + len > exif.length) continue;
        return readCString(exif, p, p + len);
    }
    return '';
}

// 遍历 JPEG 的 marker 段，捞出 APP1(XMP/Exif)、APP2(MPF/ISO 21496-1)、APP8(T.35)、APP11(JUMBF)。
// 段头遇到 SOS 就停 —— 后面是熵编码数据，再扫下去只会误判。
function readJpegSegments(bytes) {
    const out = { xmp: '', exif: null, mpf: null, jumbf: null, isoGainMap: false, ituT35: false };
    let i = 2;
    const len = bytes.length;

    while (i + 4 <= len) {
        if (bytes[i] !== 0xFF) { i++; continue; }
        const marker = bytes[i + 1];
        if (marker === 0xFF) { i++; continue; }                  // 填充
        if (marker === 0x01 || (marker >= 0xD0 && marker <= 0xD9)) { i += 2; continue; }
        if (marker === 0xDA) break;                              // SOS

        const size = readU16(bytes, i + 2);
        if (size < 2 || i + 2 + size > len) break;
        const payloadStart = i + 4;
        const payloadEnd = i + 2 + size;

        if (marker === 0xE1) {
            if (ascii(bytes, payloadStart, XMP_SIG.length) === XMP_SIG) {
                out.xmp += readCString(bytes, payloadStart + XMP_SIG.length + 1, payloadEnd);
            } else if (ascii(bytes, payloadStart, XMP_EXT_SIG.length) === XMP_EXT_SIG) {
                // 扩展 XMP：32 字节 GUID + 4 字节总长 + 4 字节偏移，按偏移顺序拼回
                let p = payloadStart + XMP_EXT_SIG.length + 1 + 32 + 4 + 4;
                out.xmpChunks = out.xmpChunks || [];
                out.xmpChunks.push(readCString(bytes, p, payloadEnd));
            } else if (ascii(bytes, payloadStart, EXIF_SIG.length) === EXIF_SIG) {
                out.exif = bytes.subarray(payloadStart, payloadEnd);
                out.exifDescription = parseExifDescription(out.exif);
            }
        } else if (marker === 0xE2) {
            if (ascii(bytes, payloadStart, 3) === 'MPF') {
                out.mpf = bytes.subarray(payloadStart, payloadEnd);
            } else if (ascii(bytes, payloadStart, ISO_GAINMAP_SIG.length) === ISO_GAINMAP_SIG) {
                out.isoGainMap = true;
            }
        } else if (marker === 0xE8) {
            if (ascii(bytes, payloadStart, ITU_T35_SIG.length) === ITU_T35_SIG) out.ituT35 = true;
        } else if (marker === 0xEB) {
            out.jumbf = bytes.subarray(payloadStart, payloadEnd);
        }

        i = payloadEnd;
    }

    if (out.xmpChunks) {
        out.xmp += out.xmpChunks.join('');
        delete out.xmpChunks;
    }
    return out;
}

// ============================ XMP 判读 ============================

// XMP 里 `Container:Directory` 的目录项。Ultra HDR 的增益图与新版安卓动态照片
// 用的是同一套结构，只是 Item:Semantic 不同（GainMap / MotionPhoto / Primary）。
function parseContainerDirectory(xmp) {
    const items = [];
    const re = /<Container:Item\b([^>]*)>/g;
    let m;
    while ((m = re.exec(xmp)) !== null) {
        const attrs = m[1];
        items.push({
            semantic: attr(attrs, 'Item:Semantic') || attr(attrs, 'Semantic'),
            mime: attr(attrs, 'Item:Mime') || attr(attrs, 'Mime'),
            length: attrNumber(attrs, 'Item:Length'),
            padding: attrNumber(attrs, 'Item:Padding') || 0,
        });
    }
    return items;
}

// 与 WallpaperMixin 里方框 tooltip 的措辞保持一致：
// 同一个 vendor 在存储字段和界面上必须是同一个名字。
const LIVE_VENDOR_LABELS = {
    apple: 'Apple 实况照片',
    huawei: '华为实况照片',
    android: '安卓实况照片',
    generic: '实况照片',
};

function classifyLive(xmp, isobmff, bytes) {
    // 1) Apple：实况照片的配对标识。单文件 .livp 由 ZIP 那条路处理。
    if (attr(xmp, 'apple:ContentIdentifier') || xmp.includes('com.apple.quicktime.content.identifier')) {
        return { vendor: 'apple', mime: 'video/quicktime' };
    }

    // 2) ISO-BMFF 里的内嵌视频 item —— 华为 / Google 的单文件 HEIC 动态照片走这条
    if (isobmff && isobmff.videoItem) {
        return { vendor: 'huawei', mime: isobmff.videoItem.contentType, item: isobmff.videoItem };
    }

    const dir = parseContainerDirectory(xmp);
    const motionItem = dir.find(it => it.semantic === 'MotionPhoto' ||
        (it.mime && it.mime.indexOf('video/') === 0));

    // 3) 华为：XMP 里带厂商私有标记。
    //    华为有把标记写成元素（`<HUAWEI_MOTION_PHOTO>1</...>`）而非属性的版本，
    //    所以不能只靠 attr()，子串判定也要留着。
    if (xmp.includes('HUAWEI_MOTION_PHOTO') || attr(xmp, 'HUAWEI_MOTION_PHOTO') !== null ||
        xmp.includes('HUAWEI_MOTION') || xmp.includes('hw_motionphoto')) {
        return { vendor: 'huawei', mime: 'video/mp4', directoryItem: motionItem };
    }

    // 4) 安卓系（Google / 三星 / 小米 / OPPO / vivo）：Google 的 MicroVideo 家族
    const microOffset = attrNumber(xmp, 'GCamera:MicroVideoOffset');
    const cameraMicroOffset = attrNumber(xmp, 'Camera:MicroVideoOffset');
    const isMicroVideo = attr(xmp, 'GCamera:MicroVideo') === '1' || attr(xmp, 'Camera:MicroVideo') === '1';

    if (isMicroVideo || microOffset !== null || cameraMicroOffset !== null) {
        const fromEnd = microOffset !== null ? microOffset : cameraMicroOffset;
        return { vendor: 'android', mime: 'video/mp4', offsetFromEnd: fromEnd };
    }

    // 5) 新版安卓：MotionPhoto 标志 + Container 目录（没有 MicroVideoOffset）
    if (attr(xmp, 'MotionPhoto') === '1' || attr(xmp, 'GCamera:MotionPhoto') === '1' || motionItem) {
        return { vendor: 'android', mime: 'video/mp4', directoryItem: motionItem };
    }

    // 6) 兜底：XMP 没给出任何可用字段（华为的私有写法、被裁掉的 XMP、新机型…），
    //    直接按结构找图片尾部那段视频。找得到就当实况照片，厂商交给下面判。
    const appended = findAppendedVideo(bytes);
    if (appended) {
        return {
            vendor: /HUAWEI|HUAWEI_HDR|hw_/i.test(xmp) ? 'huawei' : 'generic',
            mime: /qt {2}|quicktime/i.test(appended.brand) ? 'video/quicktime' : 'video/mp4',
            appended,
        };
    }

    return null;
}

const HDR_STANDARD_LABELS = {
    'ultra-hdr': 'HDR',
    'hdr10': 'HDR10',
    'hdr-vivid': 'Vivid',
    'dolby-vision': 'DV',
    'hlg': 'HLG',
    'pq': 'HDR',
};

const HDR_STANDARD_DETAILS = {
    'ultra-hdr': 'Ultra HDR（JPEG 增益图，ISO 21496-1）',
    'hdr10': 'HDR10（BT.2020 + PQ）',
    'hdr-vivid': 'HDR Vivid（BT.2020 + PQ；与 HDR10 同信号，按华为/Vivid 特征判定）',
    'dolby-vision': 'Dolby Vision',
    'hlg': 'HLG（BT.2020 混合对数伽马）',
    'pq': 'HDR（PQ 传输曲线）',
};

// [bundled] export {...}

// PQ / HLG 的 nclx 传输特性取值（ITU-T H.273）
const TRANSFER_PQ = 16;
const TRANSFER_HLG = 18;
const PRIMARIES_BT2020 = 9;

function buildHdr(signals) {
    const hints = signals.vendorHints || null;

    // 增益图优先：Ultra HDR 的底图本身是 SDR，真正让它「HDR」的是那张增益图。
    // 华为的 HDR Vivid 照片也是这套（SDR 底图 + ISO 21496-1 增益图），只是额外
    // 用 EXIF 的 `_cuva` 标记声明自己 —— 机制相同、家数不同，标准报增益图这一侧，
    // 把厂商标记写进 detail，不冒名也不吞掉。
    if (signals.gainMap) {
        const cuva = !!(hints && hints.cuva);
        return {
            standard: 'ultra-hdr',
            label: HDR_STANDARD_LABELS['ultra-hdr'],
            detail: HDR_STANDARD_DETAILS['ultra-hdr'] + (cuva ? '，华为 HDR Vivid 标记' : ''),
            gainMap: true,
            transfer: signals.transfer,
            primaries: signals.primaries,
        };
    }
    if (signals.dolbyVision) {
        return {
            standard: 'dolby-vision',
            label: HDR_STANDARD_LABELS['dolby-vision'],
            detail: HDR_STANDARD_DETAILS['dolby-vision'] + '（Profile ' + signals.dolbyVision.profile + '.' + signals.dolbyVision.level + '）',
            dolbyVision: signals.dolbyVision,
            transfer: signals.transfer,
            primaries: signals.primaries,
        };
    }
    if (signals.transfer === TRANSFER_PQ) {
        // 静态图容器里 HDR Vivid 与 HDR10 都是「BT.2020 + PQ」，靠厂商特征区分；
        // 判不出来就老实报 HDR10，不假装精确。PQ 配非 BT.2020 原色（如 DCI-P3）
        // 不属于任何一个具名标准，退到泛化的 HDR 标识。
        //
        // 注：mdcv + clli 是 HDR10 的静态元数据（ST 2086 / CTA-861.3），**不是** HDR10+ ——
        // HDR10+ 的动态元数据逐帧存在 SEI 里，静态图容器没有可靠的判定依据，
        // 所以这里不用它去升级标准，只作为附加信息带出去。
        const bt2020 = signals.primaries === PRIMARIES_BT2020;
        const vivid = hints && hints.vivid;
        const standard = !bt2020 ? 'pq' : (vivid ? 'hdr-vivid' : 'hdr10');
        return {
            standard,
            label: HDR_STANDARD_LABELS[standard],
            detail: HDR_STANDARD_DETAILS[standard] + (signals.staticMetadata ? '，含母版显示信息' : ''),
            transfer: signals.transfer,
            primaries: signals.primaries,
            staticMetadata: !!signals.staticMetadata,
        };
    }
    if (signals.transfer === TRANSFER_HLG) {
        return {
            standard: 'hlg',
            label: HDR_STANDARD_LABELS.hlg,
            detail: HDR_STANDARD_DETAILS.hlg,
            transfer: signals.transfer,
            primaries: signals.primaries,
        };
    }
    if (signals.primaries === PRIMARIES_BT2020 && signals.transfer && signals.transfer !== 1 && signals.transfer !== 13) {
        return {
            standard: 'pq',
            label: HDR_STANDARD_LABELS.pq,
            detail: HDR_STANDARD_DETAILS.pq,
            transfer: signals.transfer,
            primaries: signals.primaries,
        };
    }

    // 兜底：华为的 HDR 照片不打 XMP，底图之外若连增益图/传输特性都读不到，
    // 只剩 EXIF 里的 `_cuva` 声明可用。这是厂商自己的标记，报出来，
    // 但不假装知道具体信号（detail 里写清楚依据是什么）。
    if (hints && hints.cuva) {
        return {
            standard: 'hdr-vivid',
            label: HDR_STANDARD_LABELS['hdr-vivid'],
            detail: 'HDR Vivid（华为 _cuva 标记' + (hints.ituT35 ? ' + ITU-T T.35 信令段' : '') +
                '；未读到增益图与传输特性，按厂商标记判定）',
            transfer: signals.transfer,
            primaries: signals.primaries,
            tagged: true,
        };
    }
    return null;
}

// ============================ ISO-BMFF（HEIF / AVIF）============================

function walkBoxes(bytes, start, end, visit, depth) {
    let i = start;
    while (i + 8 <= end) {
        let size = readU32(bytes, i);
        const type = ascii(bytes, i + 4, 4);
        let header = 8;
        if (size === 1) {
            if (i + 16 > end) break;
            size = readU64(bytes, i + 8);
            header = 16;
        } else if (size === 0) {
            size = end - i;
        }
        if (size < header || i + size > end) break;
        visit(type, i + header, i + size, depth);
        i += size;
    }
}

const FULLBOX_CONTAINERS = ['meta', 'iinf', 'iref', 'dref', 'stsd', 'mvex'];
const PLAIN_CONTAINERS = ['iprp', 'ipco', 'moov', 'trak', 'mdia', 'minf', 'stbl', 'dinf', 'udta', 'edts', 'grpl'];

function readIsoBmff(bytes) {
    const out = { brands: [], items: [], colr: [], dolbyVision: null, mdcv: false, clli: false, gainMap: false, videoItem: null, hdrgm: false };

    const visit = (type, start, end, depth) => {
        if (depth > 8) return;

        if (PLAIN_CONTAINERS.includes(type)) {
            walkBoxes(bytes, start, end, visit, depth + 1);
            return;
        }
        if (FULLBOX_CONTAINERS.includes(type)) {
            if (type === 'iinf') { readIinf(bytes, start, end, out); return; }
            if (type === 'stsd') return; // 静态图用不到样本表，跳过免得多解析一层
            walkBoxes(bytes, start + 4, end, visit, depth + 1);
            return;
        }
        if (type === 'iloc') { out.iloc = readIloc(bytes, start, end); return; }
        if (type === 'colr') { readColr(bytes, start, end, out); return; }
        if (type === 'dvcC' || type === 'dvvC') { out.dolbyVision = readDovi(bytes, start); return; }
        if (type === 'mdcv') { out.mdcv = true; return; }
        if (type === 'clli') { out.clli = true; return; }
        if (type === 'hdrgm' || type === 'tmap') { out.gainMap = true; out.hdrgm = true; return; }
    };

    walkBoxes(bytes, 0, bytes.length, visit, 0);
    out.brands = readFtypBrands(bytes);

    // 把 iloc 里的 extent 接到 iinf 的 item 上，找出内嵌视频
    if (out.items.length && out.iloc) {
        for (const item of out.items) {
            if (item.contentType && item.contentType.indexOf('video/') === 0) {
                const loc = out.iloc.find(l => l.itemId === item.itemId);
                if (loc && loc.extents.length) {
                    item.offset = loc.extents[0].offset;
                    item.length = loc.extents[0].length;
                    out.videoItem = item;
                    break;
                }
            }
        }
    }
    return out;
}

function readIinf(bytes, start, end, out) {
    let p = start + 4;
    const version = bytes[start];
    const count = version === 0 ? readU16(bytes, p) : readU32(bytes, p);
    p += version === 0 ? 2 : 4;

    let seen = 0;
    let i = p;
    while (i + 8 <= end && seen < count) {
        const size = readU32(bytes, i);
        if (size < 8 || i + size > end) break;
        if (ascii(bytes, i + 4, 4) === 'infe') out.items.push(readInfe(bytes, i + 8, i + size));
        i += size;
        seen++;
    }
}

// ISO/IEC 14496-12 ItemInfoEntry。注意两个易错点：
//   · version 2 的 item_ID 是 16 位、version 3 是 32 位；
//   · v2+ 里 `item_name` 在 `content_type` **之前**（v0/v1 才是反的）。
function readInfe(bytes, start, end) {
    const version = bytes[start];
    let p = start + 4;
    const itemId = version === 3 ? readU32(bytes, p) : readU16(bytes, p);
    p += version === 3 ? 4 : 2;
    p += 2; // item_protection_index

    let contentType = null;
    let name = '';
    if (version >= 2) {
        const itemType = ascii(bytes, p, 4);
        p += 4;
        name = readCString(bytes, p, end);
        p += name.length + 1;
        if (itemType === 'mime' || itemType === 'uri ') {
            contentType = readCString(bytes, p, end);
        }
    } else {
        name = readCString(bytes, p, end);
        p += name.length + 1;
        contentType = readCString(bytes, p, end);
    }
    return { itemId, contentType, name };
}

// iloc 的 item_count / extent_count 是文件里读出来的，遇到畸形或截断的容器会把
// 循环放飞（每个 extent 都要读两个变长整数，能一路读到文件尾产生上千个废 item）。
// 静态图的 item 数以个位计，这里给硬上限兜底。
const MAX_ILOC_ITEMS = 512;
const MAX_EXTENTS_PER_ITEM = 64;

function readIloc(bytes, start, end) {
    const version = bytes[start];
    let p = start + 4;
    const offsetSize = bytes[p] >> 4;
    const lengthSize = bytes[p] & 0x0F;
    p++;
    const baseOffsetSize = bytes[p] >> 4;
    const indexSize = (version === 1 || version === 2) ? (bytes[p] & 0x0F) : 0;
    p++;
    const itemCount = Math.min(version < 2 ? readU16(bytes, p) : readU32(bytes, p), MAX_ILOC_ITEMS);
    p += version < 2 ? 2 : 4;

    const items = [];
    for (let i = 0; i < itemCount; i++) {
        if (p + 4 > end) break;
        const itemId = version < 2 ? readU16(bytes, p) : readU32(bytes, p);
        p += version < 2 ? 2 : 4;
        if (version === 1 || version === 2) p += 2; // construction_method(4) + reserved(12)
        p += 2;                                     // data_reference_index
        if (p > end) break;
        const baseOffset = readVarInt(bytes, p, baseOffsetSize);
        p += baseOffsetSize;
        if (p + 2 > end) break;
        const extentCount = Math.min(readU16(bytes, p), MAX_EXTENTS_PER_ITEM);
        p += 2;

        const extents = [];
        for (let e = 0; e < extentCount; e++) {
            if ((version === 1 || version === 2) && indexSize > 0) p += indexSize;
            if (p + offsetSize + lengthSize > end) break;
            const offset = readVarInt(bytes, p, offsetSize);
            p += offsetSize;
            const length = readVarInt(bytes, p, lengthSize);
            p += lengthSize;
            extents.push({ offset: baseOffset + offset, length });
        }
        items.push({ itemId, extents });
    }
    return items;
}

function readColr(bytes, start, end, out) {
    const type = ascii(bytes, start, 4);
    if (type !== 'nclx') return;
    out.colr.push({
        primaries: readU16(bytes, start + 4),
        transfer: readU16(bytes, start + 6),
        matrix: readU16(bytes, start + 8),
        fullRange: (bytes[start + 10] & 0x80) !== 0,
    });
}

function readDovi(bytes, start) {
    // dvcC/dvvC: FullBox(4) + dv_version_major(8) dv_version_minor(8)
    //            + dv_profile(7) dv_level(6) rpu/el/bl 各 1 bit
    const p = start + 4;
    const profile = (bytes[p + 2] >> 1) & 0x7F;
    const level = ((bytes[p + 2] & 0x01) << 5) | ((bytes[p + 3] >> 3) & 0x1F);
    return { profile, level };
}

// ============================ PNG ============================

const PNG_HDR_CHUNKS = ['cICP', 'mDCV', 'cLLI'];

function readPngChunks(bytes) {
    const out = { cicp: null, mdcv: false, clli: false, animated: false };
    let p = 8;
    while (p + 8 <= bytes.length) {
        const len = readU32(bytes, p);
        const type = ascii(bytes, p + 4, 4);
        if (type === 'cICP' && p + 8 + 4 <= bytes.length) {
            out.cicp = {
                primaries: bytes[p + 8],
                transfer: bytes[p + 9],
                matrix: bytes[p + 10],
                fullRange: bytes[p + 11] !== 0,
            };
        } else if (type === 'mDCV') {
            out.mdcv = true;
        } else if (type === 'cLLI') {
            out.clli = true;
        } else if (type === 'acTL') {
            out.animated = true;
        } else if (type === 'IEND') {
            break;
        }
        p += 12 + len;
    }
    return out;
}

// ============================ ZIP（Apple .livp）============================

function readZipEntries(bytes) {
    // 从尾部找 EOCD（PK\x05\x06），前面最多 64KB 注释
    const eocd = (() => {
        const from = Math.max(0, bytes.length - 66000);
        for (let i = bytes.length - 22; i >= from; i--) {
            if (bytes[i] === 0x50 && bytes[i + 1] === 0x4B && bytes[i + 2] === 0x05 && bytes[i + 3] === 0x06) return i;
        }
        return -1;
    })();
    if (eocd < 0) return [];

    const count = readLE16(bytes, eocd + 10);
    let p = readLE32(bytes, eocd + 16);
    const entries = [];

    for (let i = 0; i < count && p + 46 <= bytes.length; i++) {
        if (ascii(bytes, p, 4) !== 'PK\x01\x02') break;
        const method = readLE16(bytes, p + 10);
        const compressedSize = readLE32(bytes, p + 20);
        const uncompressedSize = readLE32(bytes, p + 24);
        const nameLen = readLE16(bytes, p + 28);
        const extraLen = readLE16(bytes, p + 30);
        const commentLen = readLE16(bytes, p + 32);
        const localOffset = readLE32(bytes, p + 42);
        const name = ascii(bytes, p + 46, nameLen);

        // 本地头的 extra 长度可能与中央目录不同，必须按本地头现读
        const localExtraLen = readLE16(bytes, localOffset + 28);
        const dataStart = localOffset + 30 + nameLen + localExtraLen;

        entries.push({ name, method, compressedSize, uncompressedSize, dataStart });
        p += 46 + nameLen + extraLen + commentLen;
    }
    return entries;
}

async function extractZipEntry(bytes, entry) {
    const raw = bytes.subarray(entry.dataStart, entry.dataStart + entry.compressedSize);
    if (entry.method === 0) return raw;
    if (entry.method !== 8) throw new Error('不支持的 ZIP 压缩方式：' + entry.method);
    if (typeof DecompressionStream === 'undefined') throw new Error('当前环境不支持解压此实况照片包');

    const stream = new Blob([raw]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
}

// ============================ 主入口 ============================

// 识别规则的版本号。判据一变就 +1：用户库里**已经存了 format** 的壁纸要靠它触发重判，
// 否则老图永远停在旧判定的结果上 —— 华为 HDR 的方框一直不出现就是这么来的：
// 文件在旧规则下被写成了 { hdr: null }，而「只在缺 format 时才补判」的回填会整个绕过它。
const FORMAT_RULE_VERSION = 2;

function detectWallpaperFormat(bytes) {
    if (!bytes || !bytes.length) {
        return { container: 'unknown', hdr: null, live: null };
    }

    const container = sniffContainer(bytes);
    let hdr = null;
    let live = null;

    if (container === 'jpeg') {
        const seg = readJpegSegments(bytes);
        // 兜底：XMP 可能藏在扩展段或厂商私有段里，直接在头部扫一遍关键串
        const xmp = seg.xmp || ascii(bytes, 0, Math.min(bytes.length, 262144));

        const dir = parseContainerDirectory(xmp);
        // 华为 HDR Vivid 的照片不打 XMP：HDR 证据全在段结构里 —— APP2 的
        // ISO 21496-1 增益图标识、APP8 的 ITU-T T.35 信令段，以及 EXIF 里
        // ImageDescription 逐字等于 `_cuva` 的厂商标记。
        const cuva = (seg.exifDescription || '').trim().toLowerCase() === CUVA_DESCRIPTION;
        const signals = {
            gainMap: seg.isoGainMap ||
                xmp.includes('hdrgm:Version') ||
                dir.some(it => it.semantic === 'GainMap') ||
                attr(xmp, 'GContainer:Version') !== null ||
                scanMarkers(bytes, GAINMAP_MARKERS),
            vendorHints: {
                vivid: cuva || xmp.includes('vivid') || xmp.includes('Vivid') ||
                    xmp.includes('HUAWEI') || scanMarkers(bytes, VIVID_MARKERS),
                cuva,
                ituT35: seg.ituT35,
            },
        };
        hdr = buildHdr(signals);

        const rawLive = classifyLive(xmp, null, bytes);
        if (rawLive) live = resolveLive(rawLive, bytes, dir);

    } else if (container === 'heif' || container === 'avif' || container === 'isobmff') {
        const box = readIsoBmff(bytes);
        const colr = box.colr[0] || null;

        // HEIF/AVIF 的 XMP 也可能带厂商标记（华为动态照片就是写在这里的）
        const xmpStart = indexOfAscii(bytes, '<x:xmpmeta');
        const xmp = xmpStart >= 0 ? ascii(bytes, xmpStart, Math.min(bytes.length, xmpStart + 262144)) : '';
        const dir = parseContainerDirectory(xmp);

        const signals = {
            gainMap: box.gainMap || dir.some(it => it.semantic === 'GainMap'),
            dolbyVision: box.dolbyVision,
            transfer: colr ? colr.transfer : null,
            primaries: colr ? colr.primaries : null,
            staticMetadata: box.mdcv && box.clli,
            vendorHints: { vivid: box.brands.includes('hevm') || xmp.includes('HUAWEI') || xmp.includes('Vivid') },
        };
        hdr = buildHdr(signals);

        const rawLive = classifyLive(xmp, box, bytes);
        if (rawLive) live = resolveLive(rawLive, bytes, dir);

    } else if (container === 'jxl') {
        // JPEG XL 的容器形态也是 ISO-BMFF（裸码流没有元数据，读不到就算了）
        const box = readIsoBmff(bytes);
        const colr = box.colr[0] || null;
        hdr = buildHdr({
            gainMap: box.gainMap || scanMarkers(bytes, GAINMAP_MARKERS),
            dolbyVision: box.dolbyVision,
            transfer: colr ? colr.transfer : null,
            primaries: colr ? colr.primaries : null,
            staticMetadata: box.mdcv && box.clli,
            vendorHints: { vivid: scanMarkers(bytes, VIVID_MARKERS) },
        });

    } else if (container === 'png') {
        const png = readPngChunks(bytes);
        if (png.cicp) {
            hdr = buildHdr({
                transfer: png.cicp.transfer,
                primaries: png.cicp.primaries,
                staticMetadata: png.mdcv && png.clli,
                gainMap: false,
                vendorHints: null,
            });
        }
    } else if (container === 'zip') {
        // Apple .livp：包内一对 heic + mov。这里同步只做「是实况照片」的判定，
        // 具体条目等 applyLiveWallpaper 时再取（解压是异步的）。
        const entries = readZipEntries(bytes);
        const mov = entries.find(e => /\.(mov|mp4)$/i.test(e.name));
        if (mov) {
            live = {
                vendor: 'apple',
                label: LIVE_VENDOR_LABELS.apple,
                mime: /\.mov$/i.test(mov.name) ? 'video/quicktime' : 'video/mp4',
                source: 'zip-entry',
                zipEntry: mov,
            };
        }
    }

    // 方框上的开关：每张壁纸各自记住这项兼容开不开。
    // 开关是「用户意图」：已经在 hdr / live 里的 enabled 一律原样保留，
    // 回填（backfill）只重判那些当时什么都没认出来的条目。
    if (hdr && hdr.enabled === undefined) hdr.enabled = true;
    if (live) {
        if (live.enabled === undefined) live.enabled = true;
        live.label = LIVE_VENDOR_LABELS[live.vendor] || '实况照片';
    }
    // v 跟着结果一起落盘：它是「这份判定出自哪版规则」的凭据，回填靠它判断要不要重判
    return { container, hdr, live, v: FORMAT_RULE_VERSION };
}

// 开关状态的唯一读法：字段缺失一律视为「开」（老数据没有这个字段）
function isHdrEnabled(format) {
    return !!(format && format.hdr && format.hdr.enabled !== false);
}

function isLiveEnabled(format) {
    return !!(format && format.live && format.live.enabled !== false);
}

// 把 classifyLive 给出的「厂商语义」落成具体的字节区间
function resolveLive(raw, bytes, dir) {
    const base = { vendor: raw.vendor, mime: raw.mime || 'video/mp4' };

    // 结构性定位（图片尾部那段 ISO-BMFF）：绝对偏移已经算好，最可靠
    if (raw.appended) {
        return Object.assign(base, {
            source: 'embedded',
            offset: raw.appended.offset,
            length: raw.appended.length,
            offsetFromEnd: false,
        });
    }

    // ISO-BMFF 内嵌视频 item：iloc 已经给出绝对偏移
    if (raw.item && raw.item.offset !== undefined) {
        return Object.assign(base, {
            source: 'embedded',
            offset: raw.item.offset,
            length: raw.item.length,
            offsetFromEnd: false,
        });
    }

    // Container:Directory 的 Item:Length —— 视频是文件末尾的 N 字节
    const item = raw.directoryItem || dir.find(it => it.semantic === 'MotionPhoto' || (it.mime && it.mime.indexOf('video/') === 0));
    if (item && item.length) {
        return Object.assign(base, {
            mime: item.mime || base.mime,
            source: 'embedded',
            offset: 0,
            length: item.length,
            offsetFromEnd: true,
        });
    }

    // 老的 GCamera:MicroVideoOffset —— 同样是从文件末尾算起
    if (raw.offsetFromEnd !== undefined && raw.offsetFromEnd !== null) {
        return Object.assign(base, {
            source: 'embedded',
            offset: 0,
            length: raw.offsetFromEnd,
            offsetFromEnd: true,
        });
    }

    // XMP 只给了厂商标记、没给长度或偏移（华为的私有写法就属于这种）：
    // 先按结构去文件尾部找那段 ISO-BMFF，找到了照样能提取
    const appended = findAppendedVideo(bytes);
    if (appended) {
        return Object.assign(base, {
            source: 'embedded',
            offset: appended.offset,
            length: appended.length,
            offsetFromEnd: false,
        });
    }

    // 实在定位不到视频区间：保留 LIVE 标识，但标记为不可提取，界面照常显示方框。
    return Object.assign(base, { source: 'marker-only', offset: null, length: null, offsetFromEnd: false });
}

// 从整份字节里切出内嵌视频
function extractLiveVideo(bytes, live) {
    if (!live) return null;
    if (live.source === 'embedded' && live.length > 0) {
        const start = live.offsetFromEnd ? Math.max(0, bytes.length - live.length) : live.offset;
        const end = start + live.length;
        if (start >= 0 && end <= bytes.length && end > start) return bytes.subarray(start, end);
    }
    return null;
}

// 容器 → MIME。用来给 data URL 打标，不能用 file.type 顶替（.heic/.livp 常常是空串）。
const CONTAINER_MIME = {
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    bmp: 'image/bmp',
    avif: 'image/avif',
    heif: 'image/heic',
    jxl: 'image/jxl',
    zip: 'application/zip',
};

function mimeForContainer(container) {
    return CONTAINER_MIME[container] || 'application/octet-stream';
}

// 壁纸管线用的联合判定：这份文件到底该不该跳过 canvas 重编码。
// HDR 一旦重编码增益图/10bit 就没了，动态照片一旦重编码内嵌视频也没了。
// 用户在方框上把开关关掉，就等于放弃这项保护，回到普通 SDR 图的处理。
function mustPreserveBytes(format) {
    if (!format) return false;
    if (isHdrEnabled(format)) return true;
    return isLiveEnabled(format) && !!format.live && format.live.source !== 'marker-only';
}

// 上传前的类型判定。不信 file.type —— Chrome 对 .heic/.livp 给不出可靠 MIME，
// 而 .heic 恰好是本需求里最主要的容器之一。
const KNOWN_EXT = /\.(jpe?g|png|webp|gif|bmp|avif|heic|heif|jxl|livp)$/i;
const LIVE_EXT = /\.(livp|mov|mp4)$/i;

function isSupportedWallpaperFile(file) {
    if (!file) return false;
    if (KNOWN_EXT.test(file.name || '')) return true;
    if (file.type && file.type.indexOf('image/') === 0) return true;
    // .livp 走 ZIP 分支，是唯一一种「文件名必须认识」的形态
    return LIVE_EXT.test(file.name || '');
}

// ==== main/Script/core/mixins/WallpaperMixin.js ====
// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

// [bundled] import { … } from '../proxy.js'
// [bundled] import { … } from '../first-paint.js'
// [bundled] import { … } from '../wallpaper-formats.js'

// 普通图片会被压缩到 1280px/q0.5，10MB 进去也够用；
// HDR 与实况照片要原样保留（重编码会抹掉增益图、10bit 色彩和内嵌视频），
// 体积没法指望压缩兜底，上限放宽到 24MB。
const MAX_IMAGE_FILE_SIZE = 10 * 1024 * 1024;
const MAX_PRESERVE_FILE_SIZE = 24 * 1024 * 1024;

// 存库前把普通图片压到这一档。单张上传此前是**原样存文件字节**：一张 2606x1440 的
// PNG 进去就是 4.72MB base64。而整份 settings 是单一的 chrome.storage.local 键，
// 于是读（6ms/MB）、结构化克隆（2ms/MB）、以及把当前壁纸当背景画出来（19ms/MB）
// 全都随壁纸库体积线性变慢。
// 实测同一张真照片：原样 4.72MB → 2560px/q0.85 是 0.38MB（12×），满屏铺开看不出差别；
// 3 张的库启动 load 从 832ms 掉到 ~350ms 档。
// 系列导入仍走 1280px/q0.5（见 prepareSeriesWallpaper）：那是一次几十张的批量导入，
// 体积优先。两条路用途不同，参数也就不同。
const WALLPAPER_MAX_DIMENSION = 2560;
const WALLPAPER_COMPRESS_QUALITY = 0.85;

// 小于这个体积（data URL 字符数）的壁纸不值得重编码一次 —— 省不下多少，
// 还可能压完反而更大。
const WALLPAPER_SHRINK_MIN_CHARS = 700 * 1024;

// 「存量库已按哪版参数重编码过」的凭据，与 FORMAT_RULE_VERSION 同一个套路：
// 改参数就得 bump，否则老用户的旧数据永不重跑（老库里存的还是原图）。
// 0 = 从没跑过。
const WALLPAPER_COMPRESS_VERSION = 1;

// 用户拒绝过一次就记住（放 localStorage，不塞进那份很大的 settings 里），
// 免得每次启动都问一遍；版本号 bump 后自然会再问。
const SHRINK_DECLINE_KEY = 'oooWallpaperShrinkDeclined';

// Chrome 桌面端能直接塞进 background-image 的容器。
// HEIC/HEIF 不在其中 —— 苹果与华为的 HDR 照片大多就是这个容器，
// 没有 WASM 解码器（manifest CSP 是 script-src 'self'）只能识别不能渲染。
const RENDERABLE_CONTAINERS = ['jpeg', 'png', 'webp', 'gif', 'bmp', 'avif'];

const LIVE_VENDOR_SHORT = {
    apple: 'Apple',
    huawei: '华为',
    android: '安卓',
    generic: '',
};

// 「会动」的容器不能压：canvas 只画得到第一帧，压完动画就没了。
// GIF 一律会动；WebP 看 RIFF 里有没有 ANIM 块（有 VP8X 时它落在偏移 30 附近）；
// AVIF 看 ftyp 的 brand 是不是 avis。
// 系列导入那条路本来就有这个毛病（compressImage 不看这些），单张上传不该跟着丢动画。
function isAnimatedContainer(bytes, container) {
    if (container === 'gif') return true;
    if (container === 'webp') {
        for (let i = 12; i + 4 <= bytes.length && i < 64; i++) {
            if (bytes[i] === 0x41 && bytes[i + 1] === 0x4E && bytes[i + 2] === 0x49 && bytes[i + 3] === 0x4D) return true; // 'ANIM'
        }
        return false;
    }
    if (container === 'avif') {
        return bytes.length > 12 && bytes[8] === 0x61 && bytes[9] === 0x76 && bytes[10] === 0x69 && bytes[11] === 0x73; // 'avis'
    }
    return false;
}

// 方框的 tooltip：写清楚是哪家的实况照片、视频是内嵌还是另存
function describeLiveFormat(live) {
    // generic 是「认不出厂商但结构上确实带一段内嵌视频」，短码留空，
    // 拼出来就是干净的「实况照片」而不是「实况照片实况照片」
    const parts = [(LIVE_VENDOR_SHORT[live.vendor] || '') + '实况照片'];
    if (live.source === 'external') parts.push('视频单独存储');
    else if (live.source === 'embedded') parts.push('视频内嵌于原图');
    else parts.push('仅识别到标记，无法提取视频');
    if (live.mime) parts.push(live.mime);
    return parts.join(' · ');
}

// 上传成功后的通知后缀，如「（HDR10 · 安卓实况照片）」。
// 用方框上的短码而不是 hdr.detail —— detail 自己带全角括号，
// 套进这里的括号会变成「（HDR10（BT.2020 + PQ））」这种双层括号。
// 完整说明在方框的 tooltip 里，通知只报「是什么」。
function describeWallpaperFormat(format) {
    if (!format) return '';
    const tags = [];
    if (format.hdr) tags.push(format.hdr.label);
    if (format.live) tags.push(format.live.label || describeLiveFormat(format.live));
    return tags.length ? `（${tags.join(' · ')}）` : '';
}

// ==================== 方框上的 Material 图标 ====================
//
// 取自 Material Symbols Rounded（Apache-2.0）。CSP 是 script-src 'self'，
// 引不了 CDN；图标字体要多挂一次网络请求、还得处理字形没到时的空白，
// 而这里只要 4 个字形，直接把 path 内联进 DOM 最省事 —— <svg>/<path> 是
// 普通元素不是脚本，不受 CSP 限制。
// viewBox 是 Material Symbols 的 960 网格（不是老 Material Icons 的 24 网格）。
const MD_ICON_VIEWBOX = '0 -960 960 960';
const MD_ICON_PATHS = {
    // 开：hdr_on / motion_photos_on；关：hdr_off / motion_photos_off（带斜杠划掉）
    hdr: {
        on: 'M640-390v-180q0-13 8.5-21.5T670-600h110q24 0 42 18t18 42v40q0 23-10.5 35.5T804-444l20 46q6 14-2 26t-24 12q-8 0-15-4t-10-12l-29-64h-44v50q0 13-8.5 21.5T670-360q-13 0-21.5-8.5T640-390Zm60-110h80v-40h-80v40Zm-520 40v70q0 13-8.5 21.5T150-360q-13 0-21.5-8.5T120-390v-180q0-13 8.5-21.5T150-600q13 0 21.5 8.5T180-570v50h80v-50q0-13 8.5-21.5T290-600q13 0 21.5 8.5T320-570v180q0 13-8.5 21.5T290-360q-13 0-21.5-8.5T260-390v-70h-80Zm340 100H410q-13 0-21.5-8.5T380-390v-180q0-13 8.5-21.5T410-600h110q24 0 42 18t18 42v120q0 24-18 42t-42 18Zm-80-60h80v-120h-80v120Z',
        off: 'M763-85 84-764q-11-11-11.5-27.5T84-820q11-11 28-11t28 11l680 678q12 12 11.5 28T820-86q-12 12-28.5 12.5T763-85Zm-63-355v66l-60-60v-136q0-13 8.5-21.5T670-600h110q24 0 42 18t18 42v40q0 18-10.5 32.5T804-444l20 46q6 14-2 26t-24 12q-8 0-15-4t-10-12l-29-64h-44Zm0-60h80v-40h-80v40Zm-120 6L474-600h46q24 0 42 18t18 42v46Zm-400 34v70q0 13-8.5 21.5T150-360q-13 0-21.5-8.5T120-390v-180q0-13 8.5-21.5T150-600q13 0 21.5 8.5T180-570v50h80v-50q0-13 8.5-21.5T290-600q13 0 21.5 8.5T320-570v180q0 13-8.5 21.5T290-360q-13 0-21.5-8.5T260-390v-70h-80Zm200-64 60 60v44h45l55 56q-5 2-10 3t-10 1H410q-13 0-21.5-8.5T380-390v-134Z',
    },
    live: {
        on: 'M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-32 5-64t15-63q5-16 20.5-21.5T150-626q15 8 21.5 23.5T173-570q-6 22-9.5 44.5T160-480q0 134 93 227t227 93q134 0 227-93t93-227q0-134-93-227t-227-93q-24 0-47.5 3.5T386-786q-17 5-32-1t-22-21q-7-15-.5-30.5T354-859q30-11 62-16t64-5q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80ZM220-680q-25 0-42.5-17.5T160-740q0-25 17.5-42.5T220-800q25 0 42.5 17.5T280-740q0 25-17.5 42.5T220-680Zm260 200Z',
        off: 'm763-84-63-62q-49 32-104.5 49T480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-60 17-115.5T146-700l-63-63q-12-12-12-28.5T83-820q12-12 28.5-12t28.5 12l680 680q12 12 12 28t-12 28q-12 12-28.5 12T763-84Zm-283-76q43 0 83.5-11t78.5-33L204-642q-22 38-33 78.5T160-480q0 133 93.5 226.5T480-160Zm0-640q-33 0-64.5 6.5T354-774q-16 7-32 2t-24-19q-8-14-3.5-30t19.5-23q39-18 80.5-27t85.5-9q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 44-9 85.5T844-314q-7 15-23 19.5t-30-3.5q-14-8-19-24t2-32q13-30 19.5-61.5T800-480q0-133-93.5-226.5T480-800Zm57 263ZM423-423Z',
    },
};

function buildMdIcon(kind, enabled) {
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', MD_ICON_VIEWBOX);
    svg.setAttribute('width', '12');
    svg.setAttribute('height', '12');
    svg.setAttribute('fill', 'currentColor');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', MD_ICON_PATHS[kind][enabled ? 'on' : 'off']);
    svg.appendChild(path);
    return svg;
}

// 纯图标方框的读屏名
const FORMAT_BADGE_LABELS = { hdr: 'HDR 兼容', live: '实况照片播放' };

// 方框本体：一枚纯图标开关按钮，开/关两态都从 enabled 现算。
// 方框上不放文字（省下横向空间给壁纸名），也不放 title —— 悬停弹出的
// 那串说明文字是浏览器系统级提示，按需求一律不要。
// 语义只剩 aria-label（读屏短名）：图标没了文字，读屏就再也读不出它是什么。
function buildFormatBadge(kind, format) {
    const enabled = kind === 'hdr' ? isHdrEnabled(format) : isLiveEnabled(format);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'wallpaper-format-badge ' + kind + (enabled ? '' : ' off');
    btn.dataset.kind = kind;
    btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    btn.setAttribute('aria-label', FORMAT_BADGE_LABELS[kind]);
    btn.appendChild(buildMdIcon(kind, enabled));
    return btn;
}

// 就地翻状态，不重建整个菜单 —— 菜单是同步渲染的，重建会顺带把滚动位置丢掉
function syncFormatBadge(btn, kind, enabled) {
    btn.classList.toggle('off', !enabled);
    btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    const path = btn.querySelector('svg path');
    if (path) path.setAttribute('d', MD_ICON_PATHS[kind][enabled ? 'on' : 'off']);
}

const WallpaperMixin = {
    async handleWallpaperUpload(file) {
        if (!file) return;

        // 不信 file.type：Chrome 对 .heic / .livp 给不出可靠 MIME，
        // 而这两个恰好是本次要兼容的主力容器。改按扩展名 + 容器魔数判。
        if (!isSupportedWallpaperFile(file)) {
            this.showNotification('请上传图片文件');
            return;
        }

        let bytes;
        try {
            bytes = new Uint8Array(await file.arrayBuffer());
        } catch (e) {
            this.showNotification('文件读取失败');
            return;
        }

        const format = detectWallpaperFormat(bytes);
        if (format.container === 'unknown' && !(file.type || '').startsWith('image/')) {
            this.showNotification('无法识别的图片格式');
            return;
        }

        const limit = mustPreserveBytes(format) ? MAX_PRESERVE_FILE_SIZE : MAX_IMAGE_FILE_SIZE;
        if (file.size > limit) {
            this.showNotification(`文件过大，请选择小于${Math.round(limit / 1024 / 1024)}MB的文件`);
            return;
        }

        const wallpaperName = file.name.replace(/\.[^/.]+$/, '');
        if (this.settings.customWallpapers.some(wp => wp.name === wallpaperName)) {
            this.showNotification(`壁纸"${wallpaperName}"已存在`);
            return;
        }

        // Apple 的 .livp 是「heic 静帧 + mov 视频」的压缩包：
        // 静帧是 HEIC，Chrome 桌面端渲染不了，改从实况视频首帧取静帧。
        let liveVideoData = null;
        let wallpaperData = null;
        if (format.container === 'zip' && format.live) {
            const packed = await this.unpackLivePhoto(bytes, format);
            if (!packed) {
                this.showNotification('实况照片包解析失败');
                return;
            }
            wallpaperData = packed.stillDataUrl;
            liveVideoData = packed.videoData;
            format.container = packed.stillContainer;
            this.stampLiveVideo(format, liveVideoData);
        }

        if (!wallpaperData) {
            try {
                wallpaperData = await this.shrinkWallpaperForStorage(bytes, format);
            } catch (e) {
                this.showNotification('文件读取失败');
                return;
            }
        }

        // `.livp` 解包后判定结果要跟着落地：静帧已换成视频首帧，
        // 视频本体另存成 data URL，包内条目的偏移信息从此没用了。
        if (format.live && !liveVideoData) delete format.live.videoData;

        this.settings.customWallpapers.push({
            name: wallpaperName,
            data: wallpaperData,
            format,
        });

        this.settings.wallpaper = wallpaperData;
        this.settings.persistentWallpaper = true;

        // 先更新自定义壁纸列表（创建 option），再设置选中值，
        // 否则 option 尚不存在，赋值不会生效
        this.updateCustomWallpapersList();

        const wallpaperSelect = document.getElementById('wallpaper-select');
        if (wallpaperSelect) {
            wallpaperSelect.value = wallpaperName;
        }

        // 自定义壁纸上传必然与主题壁纸不一致
        this.checkThemeConsistency('wallpaper', wallpaperData);

        this.applySettings();
        this.saveSettings();
        this.showNotification(`壁纸"${wallpaperName}"上传${describeWallpaperFormat(format)}`);

        // 刷新右侧面板菜单（如果打开）
        const rightPanelUpper = document.getElementById('right-panel-upper');
        if (rightPanelUpper && rightPanelUpper.querySelector('.settings-menu-container')) {
            const selected = document.getElementById('wallpaper-select-selected');
            const hiddenSelect = document.getElementById('wallpaper-select');
            const items = document.getElementById('wallpaper-select-items');
            this.showSettingsMenuInRightPanel(items, selected, hiddenSelect);
        }
    },
    // ==================== 壁纸格式（HDR / 实况照片）====================
    //
    // 判定在 main/Script/core/wallpaper-formats.js 里做（纯字节解析），
    // 这里只负责把判定结果接进「存储 / 渲染 / 界面」三条链。

    // 存库前的压缩。返回可直接落盘的 data URL。
    // 三种情况原样存：
    //   1. HDR / 实况照片 —— canvas 重编码会把增益图、10bit 色彩和内嵌视频一起抹掉；
    //   2. Chrome 渲染不了的容器（HEIC 等）—— 没得压，只能原样留着（现状行为）；
    //   3. 会动的（GIF / 动态 WebP / 动态 AVIF）—— canvas 只画第一帧，压完动画就没了；
    //   4. 压完反而更大 —— 本来就很小的图不该被重新编码一遍。
    async shrinkWallpaperForStorage(bytes, format) {
        const container = sniffContainer(bytes);
        const mime = mimeForContainer(container);
        const raw = await this.bytesToDataUrl(bytes, mime);
        if (mustPreserveBytes(format)) return raw;
        if (RENDERABLE_CONTAINERS.indexOf(container) < 0) return raw;
        if (isAnimatedContainer(bytes, container)) return raw;
        try {
            const shrunk = await this.compressImageBytes(
                bytes, mime, WALLPAPER_MAX_DIMENSION, WALLPAPER_MAX_DIMENSION,
                WALLPAPER_COMPRESS_QUALITY, true,
            );
            return shrunk.length < raw.length ? shrunk : raw;
        } catch (e) {
            // 解不开就按现状原样存。压缩是省空间的手段，不该变成新的失败点。
            return raw;
        }
    },
    bytesToDataUrl(bytes, mime) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('文件读取失败'));
            reader.readAsDataURL(new Blob([bytes], { type: mime || 'application/octet-stream' }));
        });
    },

    dataUrlToBytes(dataUrl) {
        if (typeof dataUrl !== 'string') return null;
        const comma = dataUrl.indexOf(',');
        if (comma < 0) return null;
        const meta = dataUrl.slice(0, comma);
        try {
            if (meta.indexOf(';base64') >= 0) {
                const bin = atob(dataUrl.slice(comma + 1));
                const out = new Uint8Array(bin.length);
                for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
                return out;
            }
            const text = decodeURIComponent(dataUrl.slice(comma + 1));
            const out = new Uint8Array(text.length);
            for (let i = 0; i < text.length; i++) out[i] = text.charCodeAt(i) & 0xff;
            return out;
        } catch (e) {
            return null;
        }
    },

    // data URL 整段解成字节。回填识别走这里（不再有「只解头部 128KB」那条快路径：
    // base64 每 3 字节编成 4 个字符，切一段出来还要对齐 4 的整数倍，而手机厂商的判据
    // 完全可能落在尾部 —— 省下的那几毫秒不值得拿「判错并永久冻住」去换）。
    dataUrlBytes(dataUrl) {
        if (typeof dataUrl !== 'string') return null;
        const comma = dataUrl.indexOf(',');
        if (comma < 0) return null;
        if (dataUrl.slice(0, comma).indexOf(';base64') < 0) return null;
        try {
            const bin = atob(dataUrl.slice(comma + 1));
            const out = new Uint8Array(bin.length);
            for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
            return out;
        } catch (e) {
            return null;
        }
    },

    // 这张壁纸要不要（重新）识别格式。两类要：从没识别过的；识别过但什么都没认出来、
    // 而且是旧规则判的（缺 v 或 v 落后于当前 FORMAT_RULE_VERSION）。
    // 用户手动关掉方框**不算**「没认出来」：那种条目的 hdr / live 仍在，不会走到这里，
    // 重判也就不会把开关掰回开启。
    wallpaperFormatNeedsDetect(wp) {
        if (!wp || !wp.data) return false;
        const f = wp.format;
        if (!f) return true;
        // 已经认出东西的，尊重现有判定：开关（enabled）是用户意图，不能被重判抹掉
        if (f.hdr || f.live) return false;
        return f.v !== FORMAT_RULE_VERSION;
    },

    // Apple .livp：包内一对 heic + mov。静帧是 HEIC，Chrome 桌面端渲染不了，
    // 而实况视频本身是可解码的 —— 退一步用视频首帧当底图。
    async unpackLivePhoto(bytes, format) {
        const entries = readZipEntries(bytes);
        const movEntry = entries.find(e => /\.(mov|mp4)$/i.test(e.name));
        if (!movEntry) return null;

        let videoBytes;
        try {
            videoBytes = await extractZipEntry(bytes, movEntry);
        } catch (e) {
            return null;
        }

        const stillEntry = entries.find(e => /\.(heic|heif|jpe?g|png|avif|webp)$/i.test(e.name));
        let stillDataUrl = null;
        let stillContainer = 'jpeg';

        if (stillEntry) {
            try {
                const stillBytes = await extractZipEntry(bytes, stillEntry);
                const container = sniffContainer(stillBytes);
                if (RENDERABLE_CONTAINERS.indexOf(container) >= 0) {
                    stillDataUrl = await this.bytesToDataUrl(stillBytes, mimeForContainer(container));
                    stillContainer = container;
                }
            } catch (e) {
                stillDataUrl = null;
            }
        }

        if (!stillDataUrl) {
            try {
                stillDataUrl = await this.captureVideoFirstFrame(videoBytes, format.live.mime);
            } catch (e) {
                return null;
            }
        }

        return {
            stillDataUrl,
            stillContainer,
            videoData: await this.bytesToDataUrl(videoBytes, format.live.mime || 'video/mp4'),
        };
    },

    // `.livp` 解包后判定结果要跟着落地：静帧已换成视频首帧，
    // 视频本体另存成 data URL，包内条目的偏移信息从此没用了。
    stampLiveVideo(format, videoData) {
        if (!format || !format.live) return;
        delete format.live.zipEntry;
        format.live.videoData = videoData;
        format.live.source = 'external';
        format.live.offset = null;
        format.live.length = null;
    },

    // 系列导入的单张处理。普通图沿用 1280px / q0.5 压缩；
    // HDR 与实况照片原样保留 —— canvas 重编码会把增益图、10bit 色彩和内嵌视频全抹掉。
    async prepareSeriesWallpaper(file, name, maxDim, quality) {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const format = detectWallpaperFormat(bytes);

        if (format.container === 'zip' && format.live) {
            const packed = await this.unpackLivePhoto(bytes, format);
            if (!packed) throw new Error('实况照片包解析失败');
            format.container = packed.stillContainer;
            this.stampLiveVideo(format, packed.videoData);
            return { name, data: packed.stillDataUrl, format };
        }

        if (mustPreserveBytes(format)) {
            return {
                name,
                data: await this.bytesToDataUrl(bytes, mimeForContainer(sniffContainer(bytes))),
                format,
            };
        }
        return { name, data: await this.compressImage(file, maxDim, maxDim, quality), format };
    },

    captureVideoFirstFrame(videoBytes, mime) {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(new Blob([videoBytes], { type: mime || 'video/mp4' }));
            const video = document.createElement('video');
            let done = false;

            const finish = (fn, arg) => {
                if (done) return;
                done = true;
                clearTimeout(timer);
                URL.revokeObjectURL(url);
                fn(arg);
            };
            const timer = setTimeout(() => finish(reject, new Error('实况视频解码超时')), 8000);

            video.muted = true;
            video.playsInline = true;
            video.preload = 'auto';
            video.addEventListener('loadeddata', () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth || 1280;
                    canvas.height = video.videoHeight || 720;
                    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                    finish(resolve, canvas.toDataURL('image/jpeg', 0.85));
                } catch (e) {
                    finish(reject, e);
                }
            }, { once: true });
            video.addEventListener('error', () => finish(reject, new Error('实况视频无法解码')), { once: true });
            video.src = url;
        });
    },

    // 右侧面板壁纸条目里、删除按钮左侧的那两个方框（可点击的兼容开关）
    buildWallpaperFormatBadges(wp) {
        const format = wp && wp.format;
        if (!format) return null;

        const wrap = document.createElement('span');
        wrap.className = 'wallpaper-format-badges';

        if (format.hdr) wrap.appendChild(buildFormatBadge('hdr', format));
        if (format.live) wrap.appendChild(buildFormatBadge('live', format));
        if (!wrap.childElementCount) return null;

        // 方框落在条目的点击热区里：不拦住冒泡，点一下开关会顺手把这张壁纸
        // 选中并应用（还会关掉这个菜单）。删除按钮当初也是这么办的。
        wrap.addEventListener('click', (e) => {
            const btn = e.target.closest ? e.target.closest('.wallpaper-format-badge') : null;
            if (!btn) return;
            e.preventDefault();
            e.stopPropagation();
            this.toggleWallpaperFormat(wp, btn.dataset.kind, btn);
        });

        return wrap;
    },

    // 右上角的当前壁纸格式角标（主页面与壁纸模式都看得到）。
    //
    // 它是指示灯不是开关 —— 开关在壁纸列表的方框上，所以这里既不响应点击也不改字节。
    // 显隐全交给 CSS：这里只写每枚图标该在哪个范围出现（data-scope），
    // body.scrolled 的进/出因此不必在每条路径上重算，CSS 自己就跟上了。
    updateWallpaperFormatCorner() {
        const box = document.getElementById('wallpaper-format-corner');
        if (!box) return;
        box.innerHTML = '';

        // 只报「当前正在用的这张」：默认 / 必应 / URL 壁纸都没有 format，自然什么都不显示
        const wp = (this.settings.customWallpapers || []).find(w => w.data === this.settings.wallpaper);
        const format = wp && wp.format;
        if (!format) return;

        const add = (kind, on, onHomepage) => {
            // 总开关关掉 → 不出现；这张壁纸的方框被用户关过（isHdrEnabled / isLiveEnabled）
            // → 也不出现：角标不能声称一件已经关掉的事
            if (!on) return;
            if (kind === 'hdr' ? !isHdrEnabled(format) : !isLiveEnabled(format)) return;

            const chip = document.createElement('span');
            chip.className = 'wallpaper-format-corner-badge ' + kind;
            // home = 主页面与壁纸模式都显示；wallpaper = 只在壁纸模式（body.scrolled）显示
            chip.dataset.scope = onHomepage ? 'home' : 'wallpaper';
            chip.setAttribute('role', 'img');
            chip.setAttribute('aria-label', kind === 'hdr' ? '当前壁纸支持 HDR' : '当前壁纸是实况照片');
            chip.appendChild(buildMdIcon(kind, true));
            box.appendChild(chip);
        };

        add('hdr', this.settings.wallpaperBadgeHdr, this.settings.wallpaperBadgeHdrHomepage);
        add('live', this.settings.wallpaperBadgeLive, this.settings.wallpaperBadgeLiveHomepage);
    },

    // 方框开关。HDR 与实况各一个，都存在自己那张壁纸的 format 里。
    //
    // 关掉 HDR 必须真的做点什么：判定是在导入那一刻现算的（detectWallpaperFormat 每次
    // 对新文件重新跑，认不出「这张图的开关被关过」），光记一个 enabled=false 的话
    // 用户点了方框什么都看不到。所以这里直接把这张壁纸转存成普通 SDR 图 ——
    // 也顺手给了「HDR 图在我这块屏上发灰」一条出路。原件留在 format.hdr.sourceData，
    // 再点一次原样还原，不可逆的事一件都不做。
    async toggleWallpaperFormat(wp, kind, btn) {
        const format = wp && wp.format;
        if (!format || !format[kind] || (kind !== 'hdr' && kind !== 'live')) return;

        const enabled = kind === 'hdr' ? !isHdrEnabled(format) : !isLiveEnabled(format);
        const name = wp.name || '壁纸';

        if (kind === 'hdr') {
            if (btn) btn.disabled = true;
            let changed;
            try {
                changed = enabled ? this.restoreWallpaperHdr(wp) : await this.convertWallpaperToSdr(wp);
            } finally {
                if (btn) btn.disabled = false;
            }
            if (!changed) {
                // 转不了（HEIC 这类 Chrome 自己解不开的容器）就原样不动，开关回滚
                if (btn) syncFormatBadge(btn, 'hdr', isHdrEnabled(format));
                this.showNotification(`"${name}"无法转成 SDR，HDR 兼容保持开启`);
                return;
            }
        }

        format[kind].enabled = enabled;

        if (kind === 'live') {
            if (!enabled) {
                // 只收「当前正在放的这张」；在别人的菜单项上点关闭不该打断正在放的实况
                if (this.settings.wallpaper === wp.data) this.stopLiveWallpaper();
            } else if (this.settings.wallpaper === wp.data) {
                this.playLiveWallpaper(wp);
            }
        }

        if (btn) syncFormatBadge(btn, kind, enabled);
        this.saveSettings();
        // 方框关掉/开回会改变「当前壁纸是不是 HDR / 实况」，右上角角标要跟着
        this.updateWallpaperFormatCorner();

        if (kind === 'live') this.showNotification(`已${enabled ? '开启' : '关闭'}"${name}"的实况播放`);
        else if (enabled) this.showNotification(`已还原"${name}"的 HDR 原图`);
        else this.showNotification(`已将"${name}"转存为普通 SDR 图（原图已保留）`);
    },

    // HDR 关：canvas 重编码成 8bit JPEG。尺寸不缩 —— 这毕竟是张壁纸，
    // 只是不要 HDR，不该顺带降分辨率。
    async convertWallpaperToSdr(wp) {
        const format = wp.format;
        const oldData = wp.data;
        if (!oldData) return false;

        let sdrData;
        try {
            const bytes = this.dataUrlToBytes(oldData);
            if (!bytes) return false;
            sdrData = await this.compressImage(
                new File([bytes], (wp.name || 'wallpaper') + '.jpg', { type: 'image/jpeg' }),
                100000, 100000, 0.92);
        } catch (e) {
            // Chrome 解不开这个容器（HEIC/HEIF），没法转
            return false;
        }
        if (!sdrData || sdrData === oldData) return false;

        // 重编码会把「图片字节后面接着的那段实况视频」一起抹掉，先单独切出来另存，
        // 否则关掉 HDR 会把同一张图上的实况一起弄没
        if (format.live && format.live.source === 'embedded') {
            const videoBytes = extractLiveVideo(this.dataUrlToBytes(oldData), format.live);
            if (videoBytes && videoBytes.length) {
                this.stampLiveVideo(format, await this.bytesToDataUrl(videoBytes, format.live.mime || 'video/mp4'));
            }
        }

        format.hdr.sourceData = oldData;
        format.hdr.sourceContainer = format.container;
        format.container = 'jpeg';
        this.swapWallpaperData(wp, sdrData);
        return true;
    },

    restoreWallpaperHdr(wp) {
        const hdr = wp.format && wp.format.hdr;
        if (!hdr || !hdr.sourceData) return false;
        if (hdr.sourceContainer) wp.format.container = hdr.sourceContainer;
        const original = hdr.sourceData;
        delete hdr.sourceData;
        delete hdr.sourceContainer;
        this.swapWallpaperData(wp, original);
        return true;
    },

    // 换掉一张壁纸的 data 时，settings.wallpaper 里可能正指着同一份字符串，
    // 只改 wp.data 不动它，当前壁纸就成了一条悬空引用。顺带重画一次。
    swapWallpaperData(wp, newData) {
        const previous = wp.data;
        wp.data = newData;
        if (this.settings.wallpaper === previous) {
            this.settings.wallpaper = newData;
            this.applyWallpaper();
        }
    },

    // ==================== 存量库的一次性重编码 ====================
    //
    // 老用户的库里存的还是**原图字节**（一张 2606x1440 的 PNG 就是 4.72MB base64）。
    // 光改上传路径对他们毫无作用 —— 而「加载慢」的正是这批人。用
    // WALLPAPER_COMPRESS_VERSION 当凭据，改参数 bump 一下就重跑。
    //
    // 挂在 afterLoad 之后、一条一条地跑：这条路要解码几十 MB 的图再重编码，
    // 一口气跑完就是几秒的主线程卡死，而它只是「让以后变快」，不该让当下变卡。
    maybeShrinkStoredWallpapers() {
        if ((this.settings.wallpaperCompressVersion || 0) >= WALLPAPER_COMPRESS_VERSION) return;

        let declined = null;
        try { declined = localStorage.getItem(SHRINK_DECLINE_KEY); } catch (e) { /* 隐私模式下读不到就算了 */ }
        if (String(declined) === String(WALLPAPER_COMPRESS_VERSION)) return;

        // 两层推迟：先等 load，再等浏览器真有空。这段要解每张大壁纸的字节去判格式，
        // 是纯维护性开销 —— 实测它值 200ms 左右的主线程长任务，压在启动那段最亏。
        afterLoad(() => afterIdle(async () => {
            const pending = await this.shrinkCandidates();
            if (!pending.length) {
                // 没得压也把版本号记上，免得每次启动都白跑一遍扫描
                this.settings.wallpaperCompressVersion = WALLPAPER_COMPRESS_VERSION;
                this.saveSettings();
                return;
            }
            const chars = pending.reduce((a, wp) => a + wp.data.length, 0);
            this.showShrinkConfirmation(pending.length, chars, () => this.runShrinkStoredWallpapers());
        }, 4000));
    },

    // 会被压的条目：体积够大、而且不是 HDR / 实况照片。
    // HDR / 实况那两张的重编码是不可逆的损失（增益图、10bit 色彩、内嵌视频），
    // 所以既不能压、也不该算进「会省下多少」里，否则用户以为原图没了。
    async shrinkCandidates() {
        const out = [];
        for (const wp of (this.settings.customWallpapers || [])) {
            if (!wp || !wp.data || wp.data.length < WALLPAPER_SHRINK_MIN_CHARS) continue;
            if (mustPreserveBytes(wp.format)) continue;
            // format 可能还没判过（回填只在打开壁纸菜单时才跑）。这里判一次 ——
            // 不判就压，等于把一张还没认出来的 HDR 原图直接重编码了。
            // 解码走异步那条（见 dataUrlBytesAsync）：atob 一张 13MB 的 data URL
            // 实测要 ~150ms 且全堵在主线程上，而这里可能一次要判好几张。
            if (this.wallpaperFormatNeedsDetect(wp)) {
                const bytes = await this.dataUrlBytesAsync(wp.data);
                if (bytes) {
                    try {
                        wp.format = detectWallpaperFormat(bytes);
                    } catch (e) { /* 判不出来就当普通图，下面的 mustPreserveBytes 兜底 */ }
                }
            }
            if (!mustPreserveBytes(wp.format)) out.push(wp);
        }
        return out;
    },

    // data URL → 字节，且**不在主线程上解 base64**。
    // 迁移和格式判定都要这份字节，而 atob(13MB) 再加一趟逐字符搬进 Uint8Array 是两次
    // 全量遍历。fetch 一条 data: URL 会把解码交给浏览器自己的网络栈，主线程只等结果。
    // 拿不到（理论上不会）就退回原来那条同步的路。
    async dataUrlBytesAsync(dataUrl) {
        if (typeof dataUrl !== 'string' || dataUrl.indexOf(';base64,') < 0) return null;
        try {
            const res = await fetch(dataUrl);
            return new Uint8Array(await res.arrayBuffer());
        } catch (e) {
            return this.dataUrlBytes(dataUrl);
        }
    },

    // 不可逆（原图只剩压缩后的版本），所以先问一次。用的是设置页那套
    // .confirm-overlay / .confirm-dialog 的样式，不自造一套。
    showShrinkConfirmation(count, chars, onConfirm) {
        const overlay = document.createElement('div');
        overlay.className = 'confirm-overlay';
        if (this.settings.dynamicBlur) overlay.classList.add('blur-effect');

        const close = () => {
            overlay.classList.remove('show');
            setTimeout(() => {
                if (overlay.parentNode) document.body.removeChild(overlay);
            }, 350);
        };

        // 记在 localStorage 而不是 settings 里：拒绝这件事不值得为它写一次几 MB 的存储。
        // 记上之后就不再每次启动都问了；版本号 bump 会重新问。
        const markDeclined = () => {
            try { localStorage.setItem(SHRINK_DECLINE_KEY, String(WALLPAPER_COMPRESS_VERSION)); } catch (e) { /* 隐私模式读不到就算了 */ }
        };

        overlay.innerHTML = `
            <div class="confirm-dialog" id="shrink-confirm-dialog">
                <div class="confirm-dialog-icon">
                    <span class="material-icons" style="font-size:48px;color:#ffffff;">compress</span>
                </div>
                <div class="confirm-dialog-title">压缩已有壁纸</div>
                <div class="confirm-dialog-message">
                    库里有 ${count} 张壁纸存的是原图（约 ${Math.round(chars / 1048576)}MB）。<br>
                    压到 ${WALLPAPER_MAX_DIMENSION}px 后加载会明显变快。<br>
                    此操作不可逆：原图不会保留。
                </div>
                <div class="confirm-dialog-buttons">
                    <button class="confirm-dialog-btn confirm-dialog-btn-cancel" id="shrink-confirm-cancel">以后再说</button>
                    <button class="confirm-dialog-btn confirm-dialog-btn-confirm" id="shrink-confirm-ok">压缩</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('show'));

        // 点空白处也算「现在不做」，同样要记下来。不记的话这次询问会**在每个新标签页
        // 重来一次**：一个全屏 .confirm-overlay（开了动态模糊时还挂 backdrop-filter）
        // 盖着整页，而它前面的 shrinkCandidates() 还要把每张大壁纸的 base64 解一遍。
        // 用户会看到的现象就是「每开一个新标签页都慢、都糊一下」。
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                markDeclined();
                close();
            }
        });

        document.getElementById('shrink-confirm-cancel').addEventListener('click', () => {
            markDeclined();
            close();
        });

        document.getElementById('shrink-confirm-ok').addEventListener('click', () => {
            close();
            onConfirm();
        });
    },

    async runShrinkStoredWallpapers() {
        if (this._shrinkRunning) return;
        this._shrinkRunning = true;

        const list = this.settings.customWallpapers || [];
        let shrunkCount = 0;
        let savedChars = 0;

        for (const wp of list) {
            if (!wp || !wp.data || wp.data.length < WALLPAPER_SHRINK_MIN_CHARS) continue;
            let after = null;
            try {
                const bytes = await this.dataUrlBytesAsync(wp.data);
                if (bytes && !mustPreserveBytes(wp.format)) {
                    after = await this.shrinkWallpaperForStorage(bytes, wp.format);
                }
            } catch (e) {
                after = null;   // 单张失败不影响其余
            }
            if (after && after.length < wp.data.length) {
                // 活动壁纸存的就是同一条数据（settings.wallpaper 对自定义壁纸直接存
                // 整份 data URL，是 customWallpapers[i].data 的第二份拷贝）。
                // 换了新串就必须跟着换，否则 getWallpaperUrl() 又指回那张大图，
                // 而且 maybePlayLiveWallpaper 的 w.data === settings.wallpaper 也对不上了。
                if (this.settings.wallpaper === wp.data) this.settings.wallpaper = after;
                savedChars += wp.data.length - after.length;
                wp.data = after;
                shrunkCount++;
            }
            // 每张之间让出主线程，而且要真的让出**一段空闲**：setTimeout(0) 只是把任务
            // 排到队列尾部，紧接着又是一条几百毫秒的长任务，中间那一下用户什么也做不了。
            // requestIdleCallback 会把这一张和下一张之间的间隙还给浏览器。
            await new Promise((r) => {
                if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(() => r(), { timeout: 200 });
                else setTimeout(r, 0);
            });
        }

        this._shrinkRunning = false;
        // 先记版本号再落盘：这两件事在同一次 saveSettings 里写完，
        // 中途关掉标签页则什么也没写，下次启动从头再来（幂等，不会压两遍）。
        this.settings.wallpaperCompressVersion = WALLPAPER_COMPRESS_VERSION;
        this.saveSettings();

        if (shrunkCount > 0) {
            this.updateCustomWallpapersList();
            this.applyWallpaper();
            this.showNotification(`已压缩 ${shrunkCount} 张壁纸，省下约 ${Math.round(savedChars / 1048576)}MB`);
        }
    },

    // 打开壁纸菜单时把该重判的条目重判一遍。两类会走到这里：
    //   1）本次改动之前上传的、压根没有 format 字段的老壁纸；
    //   2）识别规则升级（FORMAT_RULE_VERSION 变了）之前判过、而且当时什么都没认出来的 ——
    //      华为 HDR 就是这么漏的：旧规则只认 XMP，那个文件通篇没 XMP，被判成 { hdr: null }，
    //      而「只在缺 format 时才补判」的写法会整个绕过它，于是方框永远不出现。
    // 已经认出 hdr / live 的条目一律不重判，方框上的开关（用户意图）因此不会被覆盖。
    // 刻意做成同步的：菜单渲染是同步的，异步回填要么闪烁要么得处理重入。
    // 落盘则推迟到菜单画完之后（见 scheduleWallpaperFormatSave）——那一步才是真正的大头。
    backfillWallpaperFormats() {
        const pending = (this.settings.customWallpapers || []).filter(wp => this.wallpaperFormatNeedsDetect(wp));
        if (!pending.length) return;

        let changed = false;
        for (const wp of pending) {
            // 整段判，不做「先切 128KB 头部试试」那种省法：厂商的判据可能整段落在尾部
            // （华为动图的视频线索、.livp 的 ZIP 中央目录都在文件末尾），只看头部会得出
            // marker-only 甚至「没有实况」，而结论一旦落盘就带着规则版本号不会再重判 ——
            // 于是一张本来能播的实况照片被永久冻住。
            const bytes = this.dataUrlBytes(wp.data);
            if (!bytes) continue;
            try {
                wp.format = detectWallpaperFormat(bytes);
                changed = true;
            } catch (e) {
                // 单张解析失败不影响其余壁纸
            }
        }
        if (changed) this.scheduleWallpaperFormatSave();
    },

    // 回填跑在菜单渲染的同步路径上，而 saveSettings 每次都会把整份 settings 序列化一遍 ——
    // 壁纸的 data URL 全在里面，库里只有一张 10MB 的图时这一步实测就要 360ms（几十 MB 的库更久）。
    // 判定结果这一帧渲染就要用，落盘不用：推迟到菜单画出来之后再写，点开菜单才不会先卡住。
    // 一屏多张时也只挂一个定时器，只落盘一次。
    scheduleWallpaperFormatSave() {
        if (this._wallpaperFormatSaveTimer) return;
        this._wallpaperFormatSaveTimer = setTimeout(() => {
            this._wallpaperFormatSaveTimer = null;
            try {
                this.saveSettings();
            } catch (e) {
                // 落盘失败就下次开菜单再判一遍，不值得打断用户
            }
        }, 0);
    },

    // Live 图作为壁纸出现时播放一遍内嵌视频，播完淡出、露出下面的静帧。
    // 只在 applyWallpaper 这一个入口调用，避免 scrolled / 重设壁纸时反复重播。
    maybePlayLiveWallpaper() {
        const wp = (this.settings.customWallpapers || []).find(w => w.data === this.settings.wallpaper);
        // 方框上的 LIVE 开关关掉之后，这张图就当普通静帧壁纸，不再播内嵌视频
        const isLive = !!(wp && wp.format && wp.format.live) && isLiveEnabled(wp.format);

        // 「本张已播过」时既不能重播、也不能收。一次上传会连着走两遍 applyWallpaper
        // （applySettings 的 applyWallpaper + 末尾 handlePersistentWallpaperToggle 里又一遍），
        // 若第二遍走 else 分支，视频刚起播就被收掉，表现成「实况图根本不放」。
        // 收的职责只归「当前壁纸不是这张实况图」。
        if (isLive && wp.data === this._livePlayedFor) return;
        if (isLive) this.playLiveWallpaper(wp);
        else this.stopLiveWallpaper();
    },

    async playLiveWallpaper(wp) {
        const video = this.wallpaperLive;
        const live = wp.format.live;
        if (!video || live.source === 'marker-only') return;
        if (!isLiveEnabled(wp.format)) return;

        // 系统开了「减弱动态效果」就不播
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // 换到另一张实况图时先把上一条收干净，否则旧 blob URL 会一直挂着
        if (video.src) this.stopLiveWallpaper();

        this._livePlayedFor = wp.data;

        let videoBytes = null;
        if (live.videoData) {
            videoBytes = this.dataUrlToBytes(live.videoData);
        } else {
            const bytes = this.dataUrlToBytes(wp.data);
            if (bytes) videoBytes = extractLiveVideo(bytes, live);
        }
        if (!videoBytes || !videoBytes.length) return;

        const url = URL.createObjectURL(new Blob([videoBytes], { type: live.mime || 'video/mp4' }));
        const cleanup = () => {
            if (video.src === url) {
                video.classList.remove('active');
                video.removeAttribute('src');
                video.load();
            }
            URL.revokeObjectURL(url);
        };

        video.addEventListener('ended', cleanup, { once: true });
        video.addEventListener('error', cleanup, { once: true });
        video.src = url;
        video.classList.toggle('fill-mode', this.settings.wallpaperFill === true);

        try {
            await video.play();
            video.classList.add('active');
        } catch (e) {
            // 自动播放被拒（或格式解不了）就干脆留在静帧，不弹错
            cleanup();
        }
    },

    stopLiveWallpaper() {
        const video = this.wallpaperLive;
        if (!video) return;
        video.pause();
        video.classList.remove('active');
        if (video.src) {
            URL.revokeObjectURL(video.src);
            video.removeAttribute('src');
            video.load();
        }
        this._livePlayedFor = null;
    },

    showWallpaperImportSelector(btnElement) {
        const existing = document.querySelector('.wallpaper-import-selector');
        const existingOverlay = document.querySelector('.wallpaper-import-selector-overlay');
        if (existing) existing.remove();
        if (existingOverlay) existingOverlay.remove();

        const overlay = document.createElement('div');
        overlay.className = 'wallpaper-import-selector-overlay';

        const selector = document.createElement('div');
        selector.className = 'wallpaper-import-selector';

        const singleOption = document.createElement('button');
        singleOption.className = 'wallpaper-import-selector-option';
        singleOption.innerHTML = `
            <span class="wallpaper-import-selector-option-icon"><span class="material-icons">image</span></span>
            <span class="wallpaper-import-selector-option-title">单张壁纸</span>
        `;

        const divider = document.createElement('div');
        divider.className = 'wallpaper-import-selector-divider';

        const seriesOption = document.createElement('button');
        seriesOption.className = 'wallpaper-import-selector-option';
        seriesOption.innerHTML = `
            <span class="wallpaper-import-selector-option-icon"><span class="material-icons">photo_library</span></span>
            <span class="wallpaper-import-selector-option-title">系列壁纸</span>
        `;

        selector.appendChild(singleOption);
        selector.appendChild(divider);
        selector.appendChild(seriesOption);

        const rect = btnElement.getBoundingClientRect();
        document.body.appendChild(overlay);
        document.body.appendChild(selector);

        selector.style.visibility = 'hidden';
        selector.style.pointerEvents = 'none';
        selector.style.position = 'fixed';

        let leftPos = Math.round(rect.left + rect.width / 2 - 85);
        if (leftPos < 8) leftPos = 8;
        selector.style.left = leftPos + 'px';
        selector.style.top = '0px';

        const ddHeight = selector.offsetHeight;
        const gap = 10;
        let topPos = Math.round(rect.top - ddHeight - gap);
        if (topPos < 8) topPos = rect.bottom + gap;
        selector.style.top = topPos + 'px';

        selector.style.visibility = '';
        selector.style.pointerEvents = '';

        requestAnimationFrame(() => {
            selector.classList.add('show');
        });

        const closeSelector = () => {
            selector.classList.remove('show');
            setTimeout(() => {
                if (overlay.parentNode) overlay.remove();
                if (selector.parentNode) selector.remove();
                document.removeEventListener('click', handleOutsideClick);
                document.removeEventListener('keydown', handleEsc);
            }, 200);
        };

        const handleOutsideClick = (e) => {
            if (!selector.contains(e.target) && !btnElement.contains(e.target)) {
                closeSelector();
            }
        };

        const handleEsc = (e) => {
            if (e.key === 'Escape') closeSelector();
        };

        setTimeout(() => {
            document.addEventListener('click', handleOutsideClick);
            document.addEventListener('keydown', handleEsc);
        }, 0);

        singleOption.addEventListener('click', (e) => {
            e.stopPropagation();
            closeSelector();
            document.getElementById('wallpaper-upload').click();
        });

        seriesOption.addEventListener('click', (e) => {
            e.stopPropagation();
            closeSelector();
            this.handleSeriesFolderImport();
        });
    },
    handleSeriesFolderImport() {
        if (window.showDirectoryPicker) {
            window.showDirectoryPicker({ mode: 'read' }).then(async (dirHandle) => {
                const images = [];
                for await (const entry of dirHandle.values()) {
                    if (entry.kind === 'file') {
                        const file = await entry.getFile();
                        if (isSupportedWallpaperFile(file)) {
                            images.push(file);
                        }
                    }
                }

                if (images.length === 0) {
                    this.showNotification('所选文件夹中没有支持的图片');
                    return;
                }

                this.showSeriesImportPreview(images, dirHandle.name);
            }).catch((err) => {
                if (err.name !== 'AbortError') {
                    this.showNotification('文件夹选择失败');
                }
            });
        } else {
            let folderInput = document.getElementById('wallpaper-folder-upload');
            if (!folderInput) {
                folderInput = document.createElement('input');
                folderInput.id = 'wallpaper-folder-upload';
                folderInput.type = 'file';
                folderInput.accept = 'image/*,.heic,.heif,.avif,.livp,.mov';
                folderInput.multiple = true;
                folderInput.setAttribute('webkitdirectory', '');
                folderInput.style.display = 'none';
                document.body.appendChild(folderInput);
            }

            folderInput.value = '';

            const handleFolderChange = (e) => {
                const files = Array.from(e.target.files).filter(f => isSupportedWallpaperFile(f));
                if (files.length === 0) {
                    this.showNotification('所选文件夹中没有支持的图片');
                    return;
                }
                const folderName = files[0].webkitRelativePath.split('/')[0] || '未命名系列';
                this.showSeriesImportPreview(files, folderName);
                folderInput.removeEventListener('change', handleFolderChange);
            };

            folderInput.addEventListener('change', handleFolderChange);
            folderInput.click();
        }
    },
    showSeriesImportPreview(files, seriesName) {
        const existing = document.querySelector('.series-preview-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.className = 'series-preview-overlay';

        const panel = document.createElement('div');
        panel.className = 'series-preview-panel';

        const selectedFiles = new Set(files);

        const header = document.createElement('div');
        header.className = 'series-preview-header';
        const title = document.createElement('div');
        title.className = 'series-preview-title';
        title.textContent = seriesName;
        const count = document.createElement('div');
        count.className = 'series-preview-count';
        count.textContent = `${files.length} 张图片`;
        header.appendChild(title);
        header.appendChild(count);

        const COLS = 4;
        const BUFFER_ROWS = 2;
        const totalRows = Math.ceil(files.length / COLS);

        const grid = document.createElement('div');
        grid.className = 'series-preview-grid';

        const spacer = document.createElement('div');
        spacer.style.position = 'relative';
        spacer.style.width = '100%';
        grid.appendChild(spacer);

        let rowHeight = 108;
        const renderedMap = new Map();

        const calcRowHeight = () => {
            const w = grid.clientWidth - 48;
            rowHeight = Math.floor((w - (COLS - 1) * 8) / COLS) + 8;
        };

        const renderItem = (idx) => {
            if (idx < 0 || idx >= files.length || renderedMap.has(idx)) return;
            const file = files[idx];
            const row = Math.floor(idx / COLS);
            const col = idx % COLS;

            const item = document.createElement('div');
            item.className = 'series-preview-item' + (selectedFiles.has(file) ? ' selected' : ' unselected');
            item.dataset.idx = idx;

            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.onload = () => URL.revokeObjectURL(img.src);
            item.appendChild(img);

            const check = document.createElement('span');
            check.className = 'material-icons check-icon';
            check.textContent = 'check';
            item.appendChild(check);

            item.addEventListener('click', () => {
                if (selectedFiles.has(file)) {
                    selectedFiles.delete(file);
                    item.classList.remove('selected');
                    item.classList.add('unselected');
                } else {
                    selectedFiles.add(file);
                    item.classList.add('selected');
                    item.classList.remove('unselected');
                }
                updateCount();
            });

            item.style.position = 'absolute';
            item.style.top = (row * rowHeight) + 'px';
            item.style.left = `calc(${col * 25}% + ${col * 2}px)`;
            item.style.width = `calc(25% - 6px)`;
            item.style.height = (rowHeight - 8) + 'px';

            spacer.appendChild(item);
            renderedMap.set(idx, item);
        };

        const removeItem = (idx) => {
            const el = renderedMap.get(idx);
            if (el) {
                el.remove();
                renderedMap.delete(idx);
            }
        };

        const updateVisibleRange = () => {
            calcRowHeight();
            const scrollTop = grid.scrollTop;
            const viewH = grid.clientHeight;
            const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - BUFFER_ROWS);
            const endRow = Math.min(totalRows - 1, Math.ceil((scrollTop + viewH) / rowHeight) + BUFFER_ROWS);

            const startIdx = startRow * COLS;
            const endIdx = Math.min(files.length - 1, endRow * COLS + COLS - 1);

            spacer.style.height = (totalRows * rowHeight) + 'px';

            for (let i = startIdx; i <= endIdx; i++) renderItem(i);

            const toRemove = [];
            renderedMap.forEach((_, idx) => {
                if (idx < startIdx || idx > endIdx) toRemove.push(idx);
            });
            toRemove.forEach(removeItem);
        };

        let scrollTicking = false;
        grid.addEventListener('scroll', () => {
            if (!scrollTicking) {
                requestAnimationFrame(() => {
                    updateVisibleRange();
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        }, { passive: true });

        const updateCount = () => {
            count.textContent = `${selectedFiles.size} / ${files.length} 张`;
            importBtn.disabled = selectedFiles.size === 0;
            toggleAllBtn.textContent = selectedFiles.size === files.length ? '取消全选' : '全选';
        };

        const footer = document.createElement('div');
        footer.className = 'series-preview-footer';

        const selectActions = document.createElement('div');
        selectActions.className = 'series-preview-select-actions';

        const toggleAllBtn = document.createElement('button');
        toggleAllBtn.className = 'series-preview-select-btn';
        toggleAllBtn.textContent = '全选';
        toggleAllBtn.addEventListener('click', () => {
            if (selectedFiles.size === files.length) {
                selectedFiles.clear();
                renderedMap.forEach((el) => {
                    el.classList.remove('selected');
                    el.classList.add('unselected');
                });
            } else {
                files.forEach(f => selectedFiles.add(f));
                renderedMap.forEach((el) => {
                    el.classList.add('selected');
                    el.classList.remove('unselected');
                });
            }
            updateCount();
        });

        selectActions.appendChild(toggleAllBtn);

        const importBtn = document.createElement('button');
        importBtn.className = 'series-preview-import-btn';
        importBtn.textContent = '导入';
        importBtn.addEventListener('click', () => {
            if (selectedFiles.size === 0) return;
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 300);
            this.batchImportWallpapers(Array.from(selectedFiles), seriesName);
        });

        footer.appendChild(selectActions);
        footer.appendChild(importBtn);

        panel.appendChild(header);
        panel.appendChild(grid);
        panel.appendChild(footer);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        requestAnimationFrame(() => {
            overlay.classList.add('show');
            calcRowHeight();
            updateVisibleRange();
        });

        const closePreview = () => {
            overlay.classList.remove('show');
            setTimeout(() => {
                if (overlay.parentNode) overlay.remove();
                document.removeEventListener('keydown', handleEsc);
            }, 300);
        };

        const handleEsc = (e) => {
            if (e.key === 'Escape') closePreview();
        };

        document.addEventListener('keydown', handleEsc);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closePreview();
        });

        updateCount();
    },
    batchImportWallpapers(files, seriesName) {
        const MAX_DIMENSION = 1280;
        const COMPRESS_QUALITY = 0.5;
        const BATCH_SIZE = 10;
        const MAX_WALLPAPERS = 50;
        const validFiles = files.filter(f => isSupportedWallpaperFile(f));

        if (validFiles.length === 0) {
            this.showNotification('没有符合要求的图片');
            return;
        }

        let totalImported = 0;
        let totalSkipped = 0;
        const allSeriesWallpapers = [];
        let storageFull = false;

        const processBatch = (batchStart) => {
            if (storageFull || batchStart >= validFiles.length) {
                this.finishSeriesImport(seriesName, allSeriesWallpapers, totalImported, totalSkipped, storageFull);
                return;
            }

            const batchEnd = Math.min(batchStart + BATCH_SIZE, validFiles.length);
            const batch = validFiles.slice(batchStart, batchEnd);
            let batchProcessed = 0;

            this.showNotification(`正在导入 ${batchStart + 1}-${batchEnd}/${validFiles.length}...`);

            const onBatchDone = () => {
                batchProcessed++;
                if (batchProcessed < batch.length) return;

                try { this.saveSettings(); } catch (e) { }

                setTimeout(() => processBatch(batchEnd), 0);
            };

            batch.forEach((file) => {
                const wallpaperName = seriesName + '/' + file.name.replace(/\.[^/.]+$/, '');

                if (this.settings.customWallpapers.some(wp => wp.name === wallpaperName)) {
                    totalSkipped++;
                    onBatchDone();
                    return;
                }

                if (this.settings.customWallpapers.length >= MAX_WALLPAPERS) {
                    storageFull = true;
                    onBatchDone();
                    return;
                }

                this.prepareSeriesWallpaper(file, wallpaperName, MAX_DIMENSION, COMPRESS_QUALITY)
                    .then((entry) => {
                        if (storageFull) { onBatchDone(); return; }

                        this.settings.customWallpapers.push(entry);
                        allSeriesWallpapers.push(entry);
                        totalImported++;

                        onBatchDone();
                    }).catch(() => {
                        totalSkipped++;
                        onBatchDone();
                    });
            });
        };

        processBatch(0);
    },
    finishSeriesImport(seriesName, seriesWallpapers, imported, skipped, storageFull) {
        if (imported > 0) {
            this.settings.wallpaperSeries.push({
                name: seriesName,
                wallpapers: seriesWallpapers.map(w => w.name)
            });

            this.settings.wallpaper = seriesWallpapers[0].data;
            this.settings.persistentWallpaper = true;

            // 系列壁纸导入即应用，解除主题对壁纸方面的接管
            this.checkThemeConsistency('wallpaper', this.settings.wallpaper);

            try {
                this.saveSettings();
            } catch (e) {
                console.error('保存设置失败:', e);
            }

            try {
                this.updateCustomWallpapersList();
                this.applySettings();
                const rightPanelUpper = document.getElementById('right-panel-upper');
                if (rightPanelUpper && rightPanelUpper.querySelector('.settings-menu-container')) {
                    const selected = document.getElementById('wallpaper-select-selected');
                    const hiddenSelect = document.getElementById('wallpaper-select');
                    const items = document.getElementById('wallpaper-select-items');
                    this.showSettingsMenuInRightPanel(items, selected, hiddenSelect);
                }
            } catch (e) {
                console.error('更新界面失败:', e);
            }
        }

        let msg = '';
        if (imported === 0) {
            msg = storageFull ? '已达50张上限，无法导入更多壁纸' : '所有图片均已存在或不符合要求';
        } else {
            msg = `系列"${seriesName}": ${imported}张壁纸已导入`;
            if (skipped > 0) msg += `，${skipped}张已跳过`;
            if (storageFull) msg += '（已达50张上限）';
        }
        this.showNotification(msg);
    },
    changeWallpaper(wallpaper) {
        if (wallpaper === 'default') {
            this.settings.wallpaper = 'default';
        } else if (wallpaper === 'bing') {
            this.settings.wallpaper = 'bing';
            this.settings.wallpaperUrl = '';  // 清空旧URL，避免异步获取前显示主题壁纸残留
            this.fetchBingWallpaper();
        } else if (wallpaper === 'url') {
            if (!this.settings.wallpaperUrl) {
                this.settings.wallpaper = 'url';
            }
        } else {
            // 处理自定义上传的壁纸
            const customWallpaper = this.settings.customWallpapers.find(wp => wp.name === wallpaper);
            if (customWallpaper) {
                this.settings.wallpaper = customWallpaper.data;
                this.settings.persistentWallpaper = true;
            }
        }

        // 一致性检测：主题壁纸用 location 标识，此处用实际生效的壁纸值对比
        const theme = this.themes[this.settings.theme];
        const expectedWp = theme?.details?.wallpaper?.location;
        let actualWp = wallpaper;
        if (wallpaper === 'url' && expectedWp && this.settings.wallpaperUrl === expectedWp) {
            actualWp = expectedWp;
        }
        this.checkThemeConsistency('wallpaper', actualWp);

        this.saveSettings();
        this.applyWallpaper();
    },
    checkAndFetchBingWallpaper() {
        // 如果开关打开，每次刷新都更新壁纸
        if (this.settings.bingRefreshEveryTime) {
            this.fetchBingWallpaper();
            return;
        }

        // 如果开关关闭且刷新间隔为0，不自动刷新
        if (this.settings.bingRefreshInterval === 0) {
            // 如果已有壁纸URL，直接使用
            if (this.settings.wallpaperUrl) {
                this.applySettings();
            } else {
                // 如果没有壁纸URL，获取一次
                this.fetchBingWallpaper();
            }
            return;
        }

        // 如果设置了刷新间隔，检查是否需要刷新
        const lastRefreshTime = localStorage.getItem('bingLastRefreshTime');
        const now = Date.now();
        const intervalMs = this.settings.bingRefreshInterval * 60 * 60 * 1000; // 小时转毫秒

        if (!lastRefreshTime || (now - parseInt(lastRefreshTime)) >= intervalMs) {
            // 需要刷新：只有在获取成功后才记录刷新时间，
            // 否则失败也会被记为已刷新，导致间隔内不再重试
            this.fetchBingWallpaper().then(success => {
                if (success) {
                    localStorage.setItem('bingLastRefreshTime', Date.now().toString());
                }
            });
        } else {
            // 不需要刷新，使用现有壁纸
            if (this.settings.wallpaperUrl) {
                this.applySettings();
            } else {
                // 如果没有壁纸URL，获取一次
                this.fetchBingWallpaper();
            }
        }
    },
    async fetchBingWallpaper() {
        var randomIdx = Math.floor(Math.random() * 8);
        var self = this;
        var lastError = null;

        // 多级接口回退：官方 www → 官方 cn（国内直连，返回数据一致）→ biturl 镜像（CORS 开放）。
        // 官方接口不发送 CORS 头，仅扩展页（host_permissions 覆盖 bing.com）可读；
        // biturl 的 CORS 头为 *，即使未来迁移到普通网页上下文也可跨域读取。
        var endpoints = [
            { label: null, url: 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=' + randomIdx + '&n=1&mkt=zh-CN' },
            { label: 'cn', url: 'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=' + randomIdx + '&n=1&mkt=zh-CN' },
            { label: '镜像', url: 'https://bing.biturl.top/?resolution=1920&format=json&index=' + randomIdx + '&mkt=zh-CN' }
        ];

        function notify(msg) {
            var modal = document.getElementById('settings-modal');
            if (modal && modal.classList.contains('show')) {
                self.showNotification(msg);
            }
        }

        function tryApply(data) {
            var imageUrl = null;
            if (data && data.images && data.images.length > 0 && data.images[0].url) {
                // 官方接口返回相对路径（/th?id=...），拼接到 www.bing.com
                imageUrl = 'https://www.bing.com' + data.images[0].url;
            } else if (data && data.url) {
                // biturl 镜像返回绝对地址
                imageUrl = data.url;
            }
            if (imageUrl) {
                self.settings.wallpaperUrl = imageUrl;
                self.applySettings();
                self.saveSettings();
                notify('必应壁纸已应用');
                return true;
            }
            return false;
        }

        async function tryFetch(fetchFn, label, apiUrl) {
            try {
                notify('正在获取壁纸' + (label ? ' (' + label + ')' : ''));
                var response = await fetchFn(apiUrl);
                if (!response.ok) throw new Error('HTTP ' + response.status);
                var data = await response.json();
                if (tryApply(data)) return { ok: true };
                throw new Error('返回数据为空');
            } catch (err) {
                console.warn('[BingWallpaper] ' + (label || '直连') + '失败:', err.message);
                lastError = err;
                return { ok: false };
            }
        }

        try {
            var result = { ok: false };
            for (var i = 0; i < endpoints.length; i++) {
                result = await tryFetch(function (url) { return fetch(url); }, endpoints[i].label, endpoints[i].url);
                if (result.ok) break;
            }

            if (!result.ok && ProxyManager.isProxyEnabled()) {
                for (var j = 0; j < endpoints.length; j++) {
                    result = await tryFetch(function (url) { return ProxyManager.proxiedFetch(url); }, '代理' + (endpoints[j].label ? '·' + endpoints[j].label : ''), endpoints[j].url);
                    if (result.ok) break;
                }
            }

            if (!result.ok) {
                if (lastError && (lastError.message.indexOf('Failed to fetch') !== -1 || lastError.message.indexOf('NetworkError') !== -1 || lastError.message.indexOf('cors') !== -1)) {
                    if (ProxyManager.isProxyEnabled()) {
                        notify('直连和代理均失败，请确认代理服务正常运行（端口:' + ProxyManager.getProxyPort() + '）');
                    } else {
                        notify('网络请求被拦截');
                    }
                } else {
                    notify('获取必应壁纸失败：' + (lastError ? lastError.message : '未知错误'));
                }
                return false;
            }
            return true;
        } catch (error) {
            console.error('获取必应壁纸失败:', error);
            notify('获取必应壁纸异常：' + error.message);
            return false;
        }
    },
    showBingTooltip() {
        let overlay = document.getElementById('bing-tooltip-overlay');
        let tooltip = document.getElementById('bing-tooltip');

        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'bing-tooltip-overlay';
            overlay.className = 'bing-tooltip-overlay';
            document.body.appendChild(overlay);
        }

        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'bing-tooltip';
            tooltip.className = 'bing-tooltip';
            tooltip.textContent = '来源于Microsoft Bing，每次刷新都将切换壁纸';
            document.body.appendChild(tooltip);
        }

        setTimeout(() => {
            overlay.classList.add('show');
            tooltip.classList.add('show');
        }, 10);

        const closeTooltip = () => {
            overlay.classList.remove('show');
            tooltip.classList.remove('show');
            setTimeout(() => {
                overlay.removeEventListener('click', closeTooltip);
                document.removeEventListener('keydown', handleEsc);
            }, 300);
        };

        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                closeTooltip();
            }
        };

        overlay.addEventListener('click', closeTooltip);
        document.addEventListener('keydown', handleEsc);
    },
    deleteCustomWallpaper(index) {
        const wallpaperName = this.settings.customWallpapers[index].name;
        const wallpaperData = this.settings.customWallpapers[index].data;

        // 从设置中移除
        this.settings.customWallpapers.splice(index, 1);

        // 如果当前使用的是被删除的壁纸，则切换回默认壁纸
        if (this.settings.wallpaper === wallpaperData) {
            this.settings.wallpaper = 'default';
            this.applyWallpaper();
        }

        // 更新自定义壁纸列表显示
        this.updateCustomWallpapersList();
        this.saveSettings();
        this.showNotification('壁纸：删除');
    },
    updateCustomWallpapersList() {
        const wallpaperSelectItems = document.getElementById('wallpaper-select-items');
        const wallpaperSelect = document.getElementById('wallpaper-select');
        const wallpaperSelectSelected = document.getElementById('wallpaper-select-selected');

        if (!wallpaperSelectItems || !wallpaperSelect) return;

        // 移除已有的自定义壁纸选项（支持多种标识符）
        const existingCustomItems = wallpaperSelectItems.querySelectorAll('.select-item-custom-wallpaper, .select-item[data-custom="true"]');
        existingCustomItems.forEach(item => item.remove());

        const existingCustomOptions = wallpaperSelect.querySelectorAll('option.custom-wallpaper-option, option[data-custom="true"]');
        existingCustomOptions.forEach(option => option.remove());

        // 添加自定义壁纸选项
        this.settings.customWallpapers.forEach(wp => {
            // 添加到下拉菜单
            const selectItem = document.createElement('div');
            selectItem.className = 'select-item select-item-custom-wallpaper';
            selectItem.setAttribute('data-value', wp.name);
            selectItem.textContent = wp.name;
            wallpaperSelectItems.appendChild(selectItem);

            // 添加到隐藏的select
            const option = document.createElement('option');
            option.value = wp.name;
            option.textContent = wp.name;
            option.className = 'custom-wallpaper-option';
            wallpaperSelect.appendChild(option);
        });

        // 更新显示的文本
        if (wallpaperSelectSelected) {
            const themeInfo = this.getThemeDisplayInfo();
            if (!themeInfo || !themeInfo.wallpaperName) {
                // settings.wallpaper 可能存的是 data URL，需先映射回壁纸名称再查找 option
                const currentWp = this.settings.customWallpapers.find(wp => wp.data === this.settings.wallpaper);
                const lookupValue = currentWp ? currentWp.name : this.settings.wallpaper;
                const selectedOption = wallpaperSelect.querySelector(`option[value="${CSS.escape(lookupValue)}"]`);
                if (selectedOption) {
                    wallpaperSelectSelected.textContent = selectedOption.textContent;
                }
            }
        }
    },
    preloadWallpaper() {
        const wallpaperUrl = this.getWallpaperUrl();

        if (wallpaperUrl) {
            // 尽早开始探测在线版，用户滚动进壁纸模式时可直接用在线版
            this.probeOnlineWallpaper(wallpaperUrl);

            // 这里原先还有一次「预加载」：`const img = new Image(); img.src = wallpaperUrl`。
            // 但紧接着的 setWallpaperOnLayers() 会把**同一个 URL**贴到两层上，浏览器本来
            // 就会发起同一个请求 —— 那次 new Image() 是纯粹的重复：实测本地 back.png 在
            // 瀑布上出现 2~3 次，其中一次就是它。去掉后请求仍由下面的背景图发出，
            // URL 完全一致，行为不变。
            // 顺带：<img> 是文档资源，非 data: 的壁纸（自定义 URL / Bing）在 load 之前
            // 起跑会把 window.load 一直拖到它下完，去掉后 load 不再被壁纸拖住。
            // data: URL 那几 MB 的解码代价、以及在线高清版推迟到 load 之后，
            // 都见 probeOnlineWallpaper 里的注释。

            // 在两层的 blur 层和 main 层上设置背景图
            this.setWallpaperOnLayers(wallpaperUrl);
            // body上不设背景图（避免CSS类冲突和黑边）
            document.body.style.backgroundImage = 'none';

            // 如果没有开启壁纸常显，并且不在壁纸模式，立即隐藏层
            if (!this.settings.persistentWallpaper && !this.isScrolled) {
                setTimeout(() => {
                    this.clearWallpaperLayers();
                    document.body.style.backgroundImage = '';
                }, 0);
            }
        }
    },
    showWallpaper() {
        // 如果启用了壁纸常显功能且已经显示壁纸，则直接返回
        if (this.settings.persistentWallpaper && this.isScrolled && document.body.classList.contains('user-scrolled')) {
            if (this.settings.dynamicBlur) {
                document.body.classList.add('dynamic-blur');
            } else {
                document.body.classList.remove('dynamic-blur');
            }
            return;
        }

        this.isScrolled = true;

        // 进入壁纸模式后铭牌不可交互，立即收起 OCP 播控，避免残留悬空
        this.hideOcpPlayer();

        // 先添加退出动画类（确保从当前状态开始动画）
        document.body.classList.add('exit-animation');

        // 使用requestAnimationFrame确保浏览器已渲染初始状态
        requestAnimationFrame(() => {
            // 下一帧再修改其他class，触发CSS transition
            document.body.classList.add('scrolled');
            document.body.classList.remove('homepage-wallpaper');

            if (!this.settings.persistentWallpaper) {
                document.body.classList.add('user-scrolled');
            }

            // 壁纸模式下常显示侧边栏与小组件面板（清除 hiding 残留状态）
            // isScrolled 已在进入壁纸模式时置为 true，固定侧边栏按"壁纸模式固定"生效
            this.syncWidgetPanelsForWallpaper(true);

            // 动画完成后移除退出动画类（350ms + 缓冲）
            setTimeout(() => {
                document.body.classList.remove('exit-animation');
            }, 400);
        });

        if (this.settings.dynamicBlur) {
            document.body.classList.add('dynamic-blur');
            this.startAdvancedVisualEffects();
        } else {
            document.body.classList.remove('dynamic-blur');
        }

        // 同步应用壁纸（使用模糊填充层，无黑边）
        const url = this.getWallpaperUrl();
        if (url) {
            this.setWallpaperOnLayers(url);
            // 冷启动未走 applyWallpaper 时补一次在线版探测
            this.probeOnlineWallpaper(url);
        }
        document.body.style.backgroundImage = 'none';

        document.body.style.transition = 'none';

        // 壁纸缩放动画：根据填充模式选择不同动画方式
        if (this.settings.persistentWallpaper && this.settings.wallpaperScale && this.wallpaperMain) {
            this.wallpaperMain.style.transition = 'none';
            // 两种模式统一使用 transform scale 做缩放动画
            // 填满模式：background-size: cover；适配模式：background-size: contain（CSS控制）
            this.wallpaperMain.style.backgroundSize = '';
            this.wallpaperMain.style.backgroundPosition = '';
            // 不在此处设置 transform，保持当前状态作为动画起点
        } else if (this.wallpaperMain) {
            this.wallpaperMain.style.backgroundSize = '';
            this.wallpaperMain.style.backgroundPosition = '';
            this.wallpaperMain.style.transform = '';
            this.wallpaperMain.style.transition = '';
        }

        const engineButtons = document.querySelector('.engine-buttons');
        if (engineButtons) {
            engineButtons.style.marginTop = '';
        }

        const searchHistoryContainer = document.getElementById('search-history-container');
        if (searchHistoryContainer) {
            searchHistoryContainer.classList.remove('show');
        }

        const quickAccessLinks = document.getElementById('quick-access-links');
        if (quickAccessLinks) {
            quickAccessLinks.style.transform = '';
            quickAccessLinks.style.opacity = '';
            quickAccessLinks.style.pointerEvents = '';
        }

        // 壁纸缩放动画：仅在常显示模式下对主层进行连贯放大和偏移
        // 两种模式统一使用 transform scale 实现缩放，background-size 由 CSS fill-mode 类控制
        if (this.settings.persistentWallpaper && this.settings.wallpaperScale && this.wallpaperMain) {
            void this.wallpaperMain.offsetHeight;
            this.wallpaperMain.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            this.applyWallpaperTransform();
        }

        this.isAnimating = true;
        this._animationTimeout = setTimeout(() => {
            this.isAnimating = false;
            this._animationTimeout = null;
        }, 450);
    },
    applyHomepageWallpaper() {
        if (this.settings.persistentWallpaper) {
            document.body.classList.add('homepage-wallpaper');
        } else {
            document.body.classList.remove('homepage-wallpaper');
        }
    },
    restoreHomepage(immediate = false) {
        // 不停止高级视觉效果，让它在后台继续运行，下次进入更流畅

        if (this.settings.dynamicBlur) {
            document.body.classList.add('dynamic-blur');
        } else {
            document.body.classList.remove('dynamic-blur');
        }

        this.isScrolled = false;

        if (!immediate) {
            document.body.classList.add('enter-animation');
        }

        document.body.classList.remove('scrolled');

        // 退出壁纸模式：恢复侧边栏与小组件面板由 hover 控制
        this.syncWidgetPanelsForWallpaper(false);
        document.body.classList.remove('user-scrolled');

        if (this.settings.persistentWallpaper) {
            document.body.classList.add('homepage-wallpaper');
        }

        // 同步移除壁纸（使用层系统，模糊层始终覆盖无黑边）
        if (this.settings.persistentWallpaper) {
            // 壁纸常显模式下保持壁纸，但处理缩放动画
            if (this.settings.wallpaperScale && this.wallpaperMain) {
                void this.wallpaperMain.offsetHeight;
                // 两种模式统一使用 transform scale 回缩
                this.wallpaperMain.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                this.applyWallpaperTransform();
                setTimeout(() => {
                    if (this.wallpaperMain) {
                        // 动画结束后若没有侧边栏推入，清除空变换
                        if (!this._sidebarPushing) {
                            this.wallpaperMain.style.transform = '';
                        }
                        this.wallpaperMain.style.transition = '';
                    }
                }, 400);
            }
        } else {
            this.clearWallpaperLayers();
            document.body.style.backgroundImage = '';
        }

        const searchHistoryContainer = document.getElementById('search-history-container');
        if (searchHistoryContainer) {
            searchHistoryContainer.classList.remove('show');
        }

        if (!immediate) {
            requestAnimationFrame(() => {
                document.body.classList.add('enter-active');
                setTimeout(() => {
                    document.body.classList.remove('enter-animation');
                    document.body.classList.remove('enter-active');
                }, 400);
            });
        }

        if (immediate) {
            this.isAnimating = false;
            if (this._animationTimeout) {
                clearTimeout(this._animationTimeout);
                this._animationTimeout = null;
            }
        } else {
            this.isAnimating = true;
            this._animationTimeout = setTimeout(() => {
                this.isAnimating = false;
                this._animationTimeout = null;
            }, 450);
        }
    },
    createWallpaperLayers() {
        // 层是全新创建的空元素，_appliedWallpaperUrl 必须一起清掉，
        // 否则后面贴同一张图时会走「URL 没变」的短路，图根本贴不上去。
        this._appliedWallpaperUrl = null;

        // 创建模糊填充层
        this.wallpaperBlur = document.createElement('div');
        this.wallpaperBlur.id = 'wallpaper-blur';
        document.body.insertBefore(this.wallpaperBlur, document.body.firstChild);

        // 创建清晰主层
        this.wallpaperMain = document.createElement('div');
        this.wallpaperMain.id = 'wallpaper-main';
        document.body.insertBefore(this.wallpaperMain, document.body.firstChild);

        // Live 图专用层：静帧之上再叠一层视频，播放期间盖住静帧，播完淡出。
        // 插在模糊层之后 —— 它和 #wallpaper-main 同为 z-index:-1，
        // 同层级下由 DOM 顺序决定谁盖谁，必须排在 main 后面才能压住静帧。
        this.wallpaperLive = document.createElement('video');
        this.wallpaperLive.id = 'wallpaper-live';
        this.wallpaperLive.muted = true;
        this.wallpaperLive.playsInline = true;
        this.wallpaperLive.setAttribute('playsinline', '');
        this.wallpaperLive.preload = 'metadata';
        document.body.insertBefore(this.wallpaperLive, this.wallpaperBlur.nextSibling);

        // 标记body，CSS层面覆盖自带的背景图
        document.body.classList.add('wallpaper-layers-ready');

        // 如果没有启用壁纸，隐藏两层
        if (!this.settings.persistentWallpaper && !this.isScrolled) {
            this.wallpaperBlur.classList.remove('active');
            this.wallpaperMain.classList.remove('active');
        }
    },
    getWallpaperUrl() {
        let url = null;
        if (this.settings.wallpaper === 'default') {
            url = this.localBackgroundUrl;
        } else if (this.settings.wallpaper === 'bing' && this.settings.wallpaperUrl) {
            url = this.settings.wallpaperUrl;
        } else if (this.settings.wallpaper === 'url' && this.settings.wallpaperUrl) {
            url = this.settings.wallpaperUrl;
        } else if (this.settings.wallpaper && this.settings.wallpaper !== 'default' && this.settings.wallpaper !== 'bing' && this.settings.wallpaper !== 'url') {
            url = this.settings.wallpaper; // 自定义上传壁纸 data URL
        }
        if (!url) return null;
        // 已探测成功的在线版直接返回，避免每次重设壁纸都先退回本地再异步升级
        return this.onlineWallpaperMap[url] || url;
    },
    // 默认壁纸与主题壁纸都是同一张图的「本地路径 + 在线路径」两份（在线为高清版）：
    // 给出某个本地 URL 对应的在线 URL，非此类壁纸返回 null。
    getOnlineWallpaperUrl(localUrl) {
        if (!localUrl) return null;
        if (this.settings.wallpaper === 'default' && localUrl === this.localBackgroundUrl) {
            return this.onlineBackgroundUrl;
        }
        if (this.settings.themeEnabled && this.settings.wallpaperUrl === localUrl) {
            return this.themeOverrides?.wallpaper?.online || null;
        }
        return null;
    },
    // 探测本地壁纸的在线版并记住结果。所有重设壁纸的路径都调它
    // （此前 applyWallpaper/applyTheme 各写一份内联探测，而 showWallpaper/preloadWallpaper
    //  只 set 本地、没有探测，于是「动一下」就永久回落到本地）。
    probeOnlineWallpaper(localUrl) {
        const onlineUrl = this.getOnlineWallpaperUrl(localUrl);
        if (!onlineUrl || onlineUrl === localUrl) return;
        if (this.onlineWallpaperMap[localUrl] === onlineUrl || this._onlineWallpaperProbes[localUrl]) return;

        this._onlineWallpaperProbes[localUrl] = true;
        // 在线高清版探测是「锦上添花」：本地图已经在显示（images/back.png 就在扩展里）。
        // 起跑推到 **load 之后** —— 这个 new Image() 若在 load 之前开始加载，会把
        // window.load 一起拖到它下完（线上这张 3.7MB，实测 3.6 秒，是整页 load 的头号大户）。
        // 占位标记（上面那行）仍然同步打上 —— 它在这段窗口里就是去重键，
        // 晚打会让同一次加载里的多次调用各起一个探测。
        // onload 里的「仅在仍指向同一张在线版且壁纸应显示时才升级」守卫一律不动。
        afterLoad(() => {
            const testImg = new Image();
            testImg.onload = () => {
                delete this._onlineWallpaperProbes[localUrl];
                this.onlineWallpaperMap[localUrl] = onlineUrl;
                // 探测期间壁纸可能已被切走或关闭：仅在仍指向同一张在线版且壁纸应显示时升级
                if (this.getOnlineWallpaperUrl(localUrl) === onlineUrl
                    && (this.settings.persistentWallpaper
                        || this.isScrolled
                        || document.body.classList.contains('scrolled'))) {
                    this.setWallpaperOnLayers(onlineUrl);
                }
            };
            testImg.onerror = () => {
                delete this._onlineWallpaperProbes[localUrl];
            };
            testImg.src = onlineUrl;
        });
    },
    setWallpaperOnLayers(url) {
        if (!url) {
            this.clearWallpaperLayers();
            return;
        }

        // 同一个 URL 不重贴。给层赋 backgroundImage 会让浏览器重新解码 + 光栅化这张图，
        // 实测单次 44~59ms（4032×3024 的壁纸）。启动路径上 preloadWallpaper、壁纸常显开关、
        // applySettings 会把同一张图先后贴 4 遍 —— 实测 setWallpaperOnLayers ×4 = 193ms，
        // 正是首屏画出来之后那三段长任务的主体。URL 没变时只补类名，不碰 backgroundImage。
        // 副作用只剩状态栏文字明暗，见下面那个 active 翻转判据。
        if (this._appliedWallpaperUrl === url) {
            // 状态栏文字的明暗只由 wallpaperMain 的 active 类决定，其余输入都没变。
            // 所以只有 active 真的翻转时才重算 —— updateStatusBarTextContrast() 每次
            // 要把壁纸画进一张全屏 canvas 采样亮度，实测 ~10ms，不能白跑。
            const wasActive = !!(this.wallpaperMain && this.wallpaperMain.classList.contains('active'));
            if (this.wallpaperBlur) {
                this.wallpaperBlur.classList.add('active');
            }
            if (this.wallpaperMain) {
                this.wallpaperMain.classList.add('active');
                this.wallpaperMain.classList.toggle('fill-mode', this.settings.wallpaperFill === true);
            }
            if (!wasActive) {
                this.updateStatusBarTextContrast();
            }
            return;
        }

        if (this.wallpaperBlur) {
            this.wallpaperBlur.style.backgroundImage = `url('${url}')`;
            // 填充模式下模糊层由CSS控制隐藏，适配模式下显示
            this.wallpaperBlur.classList.add('active');
        }
        if (this.wallpaperMain) {
            this.wallpaperMain.style.backgroundImage = `url('${url}')`;
            this.wallpaperMain.classList.add('active');
            // 根据 wallpaperFill 设置填充/适配模式
            this.wallpaperMain.classList.toggle('fill-mode', this.settings.wallpaperFill === true);
        }

        this._appliedWallpaperUrl = url;
        this.updateStatusBarTextContrast();
    },
    clearWallpaperLayers() {
        this._appliedWallpaperUrl = null;
        if (this.wallpaperBlur) {
            this.wallpaperBlur.style.backgroundImage = '';
            this.wallpaperBlur.classList.remove('active');
        }
        if (this.wallpaperMain) {
            this.wallpaperMain.style.backgroundImage = '';
            this.wallpaperMain.classList.remove('active');
            this.wallpaperMain.classList.remove('fill-mode');
            this.wallpaperMain.style.backgroundSize = '';
            this.wallpaperMain.style.backgroundPosition = '';
            this.wallpaperMain.style.transform = '';
            this.wallpaperMain.style.transition = '';
        }
        // 实况视频也要一起收掉，否则它会盖在下一张壁纸上
        this.stopLiveWallpaper();

        this.wallpaperAnalysisImage = null;
        this.wallpaperAnalysisUrl = null;
        this.wallpaperAnalysisPromise = null;
        this.updateStatusBarTextContrast();
    },
    applyWallpaperTransform() {
        const wm = this.wallpaperMain;
        if (!wm || !this.settings.wallpaperScale) return;

        let transform = '';

        // 基础缩放：壁纸模式 scale(1.4)，主页模式不缩放
        if (this.isScrolled) {
            transform = 'scale(1.4)';
        }

        // 侧边栏推入：叠加偏移和额外缩放（仅在主页模式需要补偿）
        if (this._sidebarPushing) {
            if (transform) {
                // 壁纸模式：已有 scale(1.4) 覆盖边缘，只需偏移
                transform += ' translateX(-80px)';
            } else {
                // 主页模式：根据屏幕宽度动态计算缩放和偏移，确保不露黑边
                const vw = window.innerWidth;
                // 大屏固定偏移80px，窄屏按比例缩小偏移
                const pushPx = Math.min(80, vw * 0.1);
                // CSS transform 从右到左执行: scale(S) translateX(T) → 先平移再缩放
                // 缩放原点在中心: 右边缘最终位置 = vw/2 + (vw/2 + T) * S
                // 要求 >= vw → S >= vw / (vw + 2T), T = -pushPx
                const neededScale = vw / (vw - 2 * pushPx);
                // 取整到小数点后3位，加 10% 余量确保无黑边
                const scale = Math.min(Math.max(Math.round(neededScale * 1.10 * 1000) / 1000, 1.16), 1.6);
                transform = 'scale(' + scale + ') translateX(-' + pushPx + 'px)';
            }
        }

        wm.style.transform = transform;
        this.updateStatusBarTextContrast();
    },
    applyDefaultWallpaper() {
        // 使用层系统，body上不设背景图；本地优先，异步升级到在线
        const url = this.getWallpaperUrl();
        this.setWallpaperOnLayers(url);
        document.body.style.backgroundImage = 'none';
        this.probeOnlineWallpaper(url);
    },
    applyWallpaper() {
        // 壁纸视觉状态的唯一总入口：切壁纸、应用设置、壁纸常显示开关、重置、启动都走这里，
        // 右上角角标挂在开头最省心（那时 settings.wallpaper 已是新值）
        this.updateWallpaperFormatCorner();
        if (this.settings.persistentWallpaper || document.body.classList.contains('scrolled')) {
            const url = this.getWallpaperUrl();
            if (url) {
                this.setWallpaperOnLayers(url);
                // body上不设背景图，避免与CSS类冲突和黑边
                document.body.style.backgroundImage = 'none';

                // 本地优先、在线升级：探测结果会被记住，后续重设壁纸直接给在线版
                this.probeOnlineWallpaper(url);

                // 实况照片：壁纸就位后播一遍内嵌视频（非实况则顺手收掉上一个）
                this.maybePlayLiveWallpaper();
            }
        } else {
            this.clearWallpaperLayers();
            document.body.style.backgroundImage = '';
        }
    },
    handlePersistentWallpaperToggle() {
        if (this.settings.persistentWallpaper) {
            this.applyWallpaper();
            if (!this.isScrolled) {
                document.body.classList.add('homepage-wallpaper');
            }
        } else {
            document.body.classList.remove('homepage-wallpaper');
            if (!this.isScrolled) {
                this.clearWallpaperLayers();
                document.body.style.backgroundImage = '';
            }
        }
    },
};

// ==== main/Script/core/quicklinks-export.js ====
/**
 * OOOInterface 快速访问链接导出模块
 * 将快速访问链接导出为 JSON 文件并触发下载
 */
const QuickLinksExporter = (function () {
    'use strict';

    /**
     * 构建导出数据（JSON 结构）
     * @param {Object} ooo OOOInterface 实例
     * @returns {Object} 导出数据对象
     */
    function buildExportData(ooo) {
        var links = [];
        if (ooo && ooo.settings && Array.isArray(ooo.settings.quickLinks)) {
            links = ooo.settings.quickLinks.filter(function (link) {
                return link && link.name && link.url;
            }).map(function (link) {
                return { name: link.name, url: link.url };
            });
        }

        return {
            app: 'OOOInterface',
            type: 'quick-links',
            version: (typeof VERSION !== 'undefined') ? VERSION : '',
            exportedAt: new Date().toISOString(),
            links: links
        };
    }

    /**
     * 生成导出文件名，如 OOOInterface-QuickLinks-20260806-153000.json
     */
    function buildFileName() {
        var now = new Date();
        var pad = function (n) {
            return n < 10 ? '0' + n : '' + n;
        };
        return 'OOOInterface-QuickLinks-' +
            now.getFullYear() +
            pad(now.getMonth() + 1) +
            pad(now.getDate()) + '-' +
            pad(now.getHours()) +
            pad(now.getMinutes()) +
            pad(now.getSeconds()) +
            '.json';
    }

    /**
     * 将数据对象以 JSON 格式下载
     */
    function downloadJson(data, filename) {
        var json = JSON.stringify(data, null, 2);
        var blob = new Blob([json], { type: 'application/json;charset=utf-8' });
        var url = URL.createObjectURL(blob);

        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        setTimeout(function () {
            URL.revokeObjectURL(url);
            if (a.parentNode) {
                a.parentNode.removeChild(a);
            }
        }, 0);
    }

    /**
     * 导出当前快速访问链接
     * @param {Object} ooo OOOInterface 实例
     * @returns {boolean} 是否成功导出
     */
    function exportQuickLinks(ooo) {
        var data = buildExportData(ooo);

        if (!data.links.length) {
            if (ooo && typeof ooo.showNotification === 'function') {
                ooo.showNotification('没有可导出的快速访问链接');
            }
            return false;
        }

        downloadJson(data, buildFileName());

        if (ooo && typeof ooo.showNotification === 'function') {
            ooo.showNotification('已导出 ' + data.links.length + ' 个快速访问链接');
        }
        return true;
    }

    return {
        buildExportData: buildExportData,
        exportQuickLinks: exportQuickLinks
    };
})();

/**
 * OOOInterface 快速访问链接导入模块
 * 支持导入导出生成的 JSON 文件（含 { links: [...] } 结构）或纯链接数组
 */
const QuickLinksImporter = (function () {
    'use strict';

    /**
     * 解析 JSON 文本，提取链接列表
     * @param {string} text JSON 文本
     * @returns {Array} [{name, url}] 列表，解析失败时抛出 Error
     */
    function parseImportJson(text) {
        var data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            throw new Error('JSON 格式错误，无法解析');
        }

        var rawLinks;
        if (Array.isArray(data)) {
            rawLinks = data;
        } else if (data && Array.isArray(data.links)) {
            rawLinks = data.links;
        } else {
            throw new Error('JSON 结构不正确，未找到链接列表');
        }

        var links = [];
        rawLinks.forEach(function (item) {
            if (item && typeof item === 'object') {
                var name = typeof item.name === 'string' ? item.name.trim() : '';
                var url = typeof item.url === 'string' ? item.url.trim() : '';
                if (name && url) {
                    links.push({ name: name, url: url });
                }
            }
        });

        return links;
    }

    /**
     * 将链接列表合并到现有快速访问链接（同名同址去重）
     * @param {Array} existing 现有链接列表
     * @param {Array} incoming 待导入链接列表
     * @returns {{added: Array, skipped: number}}
     */
    function mergeLinks(existing, incoming) {
        var seen = {};
        (existing || []).forEach(function (link) {
            if (link && link.name && link.url) {
                seen[link.name + '\n' + link.url] = true;
            }
        });

        var added = [];
        var skipped = 0;
        (incoming || []).forEach(function (link) {
            var key = link.name + '\n' + link.url;
            if (seen[key]) {
                skipped++;
            } else {
                seen[key] = true;
                added.push(link);
            }
        });

        return { added: added, skipped: skipped };
    }

    /**
     * 导入 JSON 文本到快速访问链接
     * @param {Object} ooo OOOInterface 实例
     * @param {string} text JSON 文本
     * @returns {boolean} 是否导入成功
     */
    function importQuickLinks(ooo, text) {
        var notify = function (msg) {
            if (ooo && typeof ooo.showNotification === 'function') {
                ooo.showNotification(msg);
            }
        };

        if (!ooo || !ooo.settings || !Array.isArray(ooo.settings.quickLinks)) {
            return false;
        }

        var links;
        try {
            links = parseImportJson(text);
        } catch (e) {
            notify('导入失败：' + e.message);
            return false;
        }

        if (!links.length) {
            notify('文件中没有有效的快速访问链接');
            return false;
        }

        var result = mergeLinks(ooo.settings.quickLinks, links);
        if (!result.added.length) {
            notify('导入的链接均已存在，无需重复导入');
            return false;
        }

        result.added.forEach(function (link) {
            ooo.settings.quickLinks.push(link);
        });

        if (typeof ooo.saveSettings === 'function') {
            ooo.saveSettings();
        }

        var msg = '已导入 ' + result.added.length + ' 个快速访问链接';
        if (result.skipped > 0) {
            msg += '，跳过 ' + result.skipped + ' 个重复项';
        }
        notify(msg);
        return true;
    }

    return {
        parseImportJson: parseImportJson,
        mergeLinks: mergeLinks,
        importQuickLinks: importQuickLinks
    };
})();

// ==== main/Script/core/sortable.js ====
'use strict';

// 纵向列表的 Pointer Events 拖拽排序实现。
//
// 用途：设置页「快速访问链接 / 小组件」列表共用的拖动排序。
// 设计要点：
//   - 抓起后原条目就地隐藏成一个占位槽（.sortable-source），占位槽保留原有尺寸，
//     所以列表总高度不变，不会像旧的"往列表里插指示线"那样让布局抖动；
//   - 另造一个跟随光标的悬浮克隆体（.sortable-float）提供即时反馈；
//   - 其它条目用 FLIP（Web Animations API）平滑让位；
//   - 光标靠近可视区上/下边缘时自动滚动；
//   - 松手即提交（DOM 顺序 = 最终顺序），取消（Escape / pointercancel）则复位。
//
// 跟手性/性能注意事项（改动前务必阅读）：
//   1. 克隆体是 source.cloneNode(true)，会继承行样式里的 `transition: all`。
//      若不显式禁用，浏览器会用缓动去"追"我们写入的位移 —— 表现为明显滞后。
//      因此 .sortable-float 必须 `transition: none`，且位移走 transform（合成层），
//      不要写 top/left。
//   2. 所有 DOM 读写都收敛到每帧一次的 rAF 回调里：pointermove 只记录坐标，
//      避免高频事件引发的布局抖动。
//   3. 被拖行的矩形只在起拖时缓存一次（拖动期间它们彼此的相对顺序不变），
//      每帧最多一次读取、一次写入。
//
// 本模块不读写 settings、也不维护 data-index —— 持久化交给调用方的 onCommit。

// 整行可拖，但这些交互元素上的按下不视为起拖（避免和删除键等冲突）
const INTERACTIVE_SELECTOR =
    'button, input, textarea, select, a, [contenteditable], [role="button"]';

const DEFAULTS = {
    itemSelector: '',
    handleSelector: '.quick-link-drag-handle',
    threshold: 4,          // 判定为拖动所需的最小位移(px)
    edgeSize: 48,          // 触发自动滚动的边缘带宽(px)
    maxScrollSpeed: 18,    // 自动滚动最大速度(px/帧)
    flipDuration: 180,     // 其它条目让位动画时长(ms)
    settleDuration: 160,   // 松手后克隆体归位动画时长(ms)
    clickSuppressMs: 350,  // 拖动结束后吞掉尾随 click 的时间窗(ms)
    liftScale: 1.02,       // 抓起的放大比例
    onCommit: null,
    onCancel: null,
};

function attachSortableList(listContainer, options) {
    if (!listContainer) throw new Error('attachSortableList: 缺少 listContainer');
    const opts = Object.assign({}, DEFAULTS, options || {});
    if (!opts.itemSelector) throw new Error('attachSortableList: 缺少 itemSelector');

    const getItems = () => Array.prototype.slice.call(listContainer.querySelectorAll(opts.itemSelector));

    // ---- 拖拽状态（同一时刻至多一个）----
    let phase = 'idle';        // idle | pending | dragging
    let pointerId = null;
    let source = null;         // 被拖条目（DOM 中的占位槽）
    let clone = null;          // 跟随光标的悬浮克隆体
    let startX = 0;
    let startY = 0;
    let pendingX = 0;          // pointermove 记录的最新光标位置
    let pendingY = 0;
    let lastFrameX = 0;        // 上一帧已应用的位置，用于跳过无变化的帧
    let lastFrameY = 0;
    let cloneBaseLeft = 0;     // 克隆体初始位置（原条目矩形），位移在此基础上做 transform
    let cloneBaseTop = 0;
    let lastTarget = -1;       // 上次计算出的目标位，未变化则跳过 DOM 操作
    let originalNextSibling = null; // 起拖时的右邻居，用于取消时复位
    let dragItems = [];        // 起拖时缓存的行（不含 source）；期间彼此相对顺序不变
    let scroller = null;       // 实际滚动的容器
    let viewTop = 0;           // 滚动容器可视区上下沿（起拖时缓存，拖动中不变）
    let viewBottom = 0;
    let rafId = 0;
    let dragSeq = 0;           // 每次起拖自增，用于让旧的收尾动画不干扰新拖动
    let destroyed = false;

    // 找到真正在滚动的祖先（列表短时不溢出，滚动可能落在更外层）
    function findScroller(el) {
        let node = el;
        while (node && node !== document.body && node !== document.documentElement) {
            const style = getComputedStyle(node);
            if (/(auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight + 1) {
                return node;
            }
            node = node.parentElement;
        }
        return el;
    }

    function onPointerDown(e) {
        if (destroyed || phase !== 'idle') return;
        if (e.button !== 0 || e.isPrimary === false) return;

        if (e.pointerType === 'touch') {
            // 触屏：只有手柄能起拖（手柄上有 touch-action:none），其余区域保留列表滚动
            if (!e.target.closest(opts.handleSelector)) return;
        } else if (e.target.closest(INTERACTIVE_SELECTOR)) {
            return;
        }

        const item = e.target.closest(opts.itemSelector);
        if (!item || item.parentNode !== listContainer) return;
        if (getItems().length < 2) return;

        phase = 'pending';
        pointerId = e.pointerId;
        source = item;
        startX = e.clientX;
        startY = e.clientY;
        pendingX = e.clientX;
        pendingY = e.clientY;
        lastTarget = -1;
        originalNextSibling = item.nextSibling;

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerCancel);
        // 此处不 preventDefault：轻点（未越过阈值）仍要正常触发 click → 编辑
    }

    function startDrag() {
        phase = 'dragging';
        dragSeq++;
        try { source.setPointerCapture(pointerId); } catch (_) { /* 合成事件下会抛，忽略 */ }

        const rect = source.getBoundingClientRect();
        cloneBaseLeft = rect.left;
        cloneBaseTop = rect.top;
        // 起始帧尚未应用位移：以起拖点为准，让第一帧就能算出正确位移
        lastFrameX = startX;
        lastFrameY = startY;

        clone = source.cloneNode(true);
        clone.removeAttribute('data-index');
        clone.classList.remove('sortable-source');
        clone.classList.add('sortable-float');
        clone.style.left = rect.left + 'px';
        clone.style.top = rect.top + 'px';
        clone.style.width = rect.width + 'px';
        // 以"抓取点"为缩放原点：抬起放大时该点不动，避免起拖瞬间视觉一跳
        clone.style.transformOrigin = (startX - rect.left) + 'px ' + (startY - rect.top) + 'px';
        document.body.appendChild(clone);

        source.classList.add('sortable-source');
        document.body.classList.add('sortable-active');

        // 缓存：拖动期间被拖行之外的条目集合与彼此相对顺序都不变
        dragItems = getItems().filter(el => el !== source);

        scroller = findScroller(listContainer);
        const vrect = scroller.getBoundingClientRect();
        viewTop = vrect.top;
        viewBottom = vrect.bottom;

        window.addEventListener('keydown', onKeyDown);
    }

    function cloneTransform(x, y) {
        return 'translate3d(' + (x - startX) + 'px,' + (y - startY) + 'px,0) scale(' + opts.liftScale + ')';
    }

    function scheduleFrame() {
        if (!rafId && phase === 'dragging') rafId = requestAnimationFrame(frame);
    }

    // 单帧处理：自动滚动 → 悬浮体跟随 → 目标位重算。
    // 所有 DOM 读写都收敛到这里，pointermove 只负责记坐标。
    // allowScroll=false 时不自动滚动（松手前的同步冲刷用）。
    function processFrame(allowScroll, reschedule) {
        if (phase !== 'dragging' || !source) return;
        if (!source.isConnected || source.parentNode !== listContainer) { cancelDrag(); return; }

        const x = pendingX;
        const y = pendingY;
        const moved = (x !== lastFrameX) || (y !== lastFrameY);

        // 1) 自动滚动：只在边缘带内动 scrollTop；容器矩形已在起拖时缓存
        let scrolled = false;
        if (allowScroll && scroller) {
            const viewH = viewBottom - viewTop;
            const band = Math.min(opts.edgeSize, viewH / 3);
            let dir = 0;
            if (y < viewTop + band) dir = -1;
            else if (y > viewBottom - band) dir = 1;

            if (dir !== 0) {
                const dist = dir < 0 ? y - viewTop : viewBottom - y;
                const ratio = 1 - Math.max(0, dist) / band;
                const speed = Math.max(1, Math.round(ratio * opts.maxScrollSpeed));
                const before = scroller.scrollTop;
                scroller.scrollTop = before + dir * speed;
                scrolled = scroller.scrollTop !== before;
            }
        }

        // 2) 先读后写：先算目标位（读矩形），再写悬浮体位移。
        //    反过来的话"写 transform 后再读矩形"会强制同步布局，逐帧掉性能。
        if (moved || scrolled) applyTarget(y);

        // 3) 悬浮体跟随（transform，合成层，不触发重排）
        if (moved) {
            lastFrameX = x;
            lastFrameY = y;
            if (clone) clone.style.transform = cloneTransform(x, y);
        }

        // 指针停着但仍在滚动时需要继续跑帧，否则等下一次 pointermove 唤醒
        if (reschedule && scrolled) scheduleFrame();
    }

    function frame() {
        rafId = 0;
        processFrame(true, true);
    }

    // 依据光标位置把 source 移到目标槽位，并让被挤开的条目 FLIP 让位
    function applyTarget(y) {
        const items = dragItems;
        if (!items.length) return;

        // 单次读取：一次布局，把 N 个矩形全取出来，之后再统一写入
        const rects = [];
        for (let i = 0; i < items.length; i++) rects.push(items[i].getBoundingClientRect());

        // items 的顺序即它们当前的视觉顺序（拖动期间彼此相对顺序不变），
        // 因此第一个中点位于光标下方者就是正确的插入参考。
        let target = items.length;
        for (let i = 0; i < items.length; i++) {
            if (y < rects[i].top + rects[i].height / 2) { target = i; break; }
        }
        if (target === lastTarget) return;
        lastTarget = target;

        // 单次写入
        if (target < items.length) {
            listContainer.insertBefore(source, items[target]);
        } else {
            // 插到最后一个条目之后、尾部非条目节点（如清空按钮）之前
            listContainer.insertBefore(source, items[items.length - 1].nextSibling);
        }

        // FLIP：用写入前的矩形算位移。WAAPI 不受行上的 CSS transition 影响
        for (let i = 0; i < items.length; i++) {
            const el = items[i];
            const dy = rects[i].top - el.getBoundingClientRect().top;
            if (Math.abs(dy) < 0.5) continue;
            if (el._sortAnim) el._sortAnim.cancel();
            el._sortAnim = el.animate(
                [{ transform: 'translateY(' + dy + 'px)' }, { transform: 'translateY(0)' }],
                { duration: opts.flipDuration, easing: 'cubic-bezier(.2,.7,.2,1)' }
            );
        }
    }

    function onPointerMove(e) {
        if (e.pointerId !== pointerId || !source) return;
        pendingX = e.clientX;
        pendingY = e.clientY;

        if (phase === 'pending') {
            if (Math.hypot(pendingX - startX, pendingY - startY) < opts.threshold) return;
            startDrag();
        }
        if (phase !== 'dragging') return;

        e.preventDefault();
        scheduleFrame();
    }

    function onPointerUp(e) {
        if (e.pointerId !== pointerId) return;
        if (phase === 'dragging') {
            // 拖动途中列表若被重渲染（source 已脱离），不要用失效的 DOM 提交
            if (!source.isConnected || source.parentNode !== listContainer) {
                cancelDrag();
            } else {
                // 同步冲刷最后一帧：快速甩动后立刻松手时，最后一个 pointermove
                // 可能还没等到 rAF，不能丢掉它，否则落点是上一帧的旧位置。
                processFrame(false, false);
                if (phase === 'dragging') commit();
            }
        } else {
            reset();
        }
    }

    function onPointerCancel(e) {
        if (e.pointerId !== pointerId) return;
        if (phase === 'dragging') cancelDrag();
        else reset();
    }

    function onKeyDown(e) {
        if (e.key === 'Escape' && phase === 'dragging') {
            e.preventDefault();
            cancelDrag();
        }
    }

    function detachListeners() {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerCancel);
        window.removeEventListener('keydown', onKeyDown);
        if (source && pointerId !== null) {
            try { source.releasePointerCapture(pointerId); } catch (_) { /* 未捕获时忽略 */ }
        }
    }

    // 松手：保持当前 DOM 顺序，提交，并播放克隆体归位动画
    function commit() {
        const items = getItems();
        const seq = dragSeq;
        const floatEl = clone;
        const srcEl = source;
        const dst = srcEl.getBoundingClientRect();

        armClickGuard();
        detachListeners();
        if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }

        // 立即释放共享状态，允许马上开始下一次拖动
        phase = 'idle';
        pointerId = null;
        clone = null;
        source = null;
        dragItems = [];
        if (srcEl) srcEl.classList.remove('sortable-source');

        if (typeof opts.onCommit === 'function') {
            try { opts.onCommit(items); } catch (err) { console.error('sortable onCommit 失败:', err); }
        }

        const cleanup = () => {
            if (floatEl) floatEl.remove();
            // 若期间已开始新拖动，body 上的 grabbing 光标留给新拖动
            if (seq === dragSeq) document.body.classList.remove('sortable-active');
        };

        if (floatEl) {
            // 从当前实际位移动画到落点，避免与上一帧不一致造成跳变
            const from = getComputedStyle(floatEl).transform;
            const to = 'translate3d(' + (dst.left - cloneBaseLeft) + 'px,' +
                (dst.top - cloneBaseTop) + 'px,0) scale(1)';
            const anim = floatEl.animate(
                [{ transform: from && from !== 'none' ? from : 'translate3d(0,0,0) scale(' + opts.liftScale + ')', opacity: 1 },
                 { transform: to, opacity: 0 }],
                { duration: opts.settleDuration, easing: 'ease-out', fill: 'forwards' }
            );
            anim.onfinish = cleanup;
            setTimeout(cleanup, opts.settleDuration + 120); // 动画被打断时的兜底
        } else {
            cleanup();
        }
    }

    // 取消：把 source 插回原位并清除所有临时状态
    function cancelDrag() {
        const srcEl = source;
        const floatEl = clone;
        if (!srcEl) { reset(); return; }

        if (originalNextSibling && originalNextSibling.parentNode === listContainer) {
            listContainer.insertBefore(srcEl, originalNextSibling);
        } else {
            const items = getItems().filter(el => el !== srcEl);
            if (items.length) listContainer.insertBefore(srcEl, items[items.length - 1].nextSibling);
        }

        detachListeners();
        if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }

        phase = 'idle';
        pointerId = null;
        clone = null;
        source = null;
        dragItems = [];
        srcEl.classList.remove('sortable-source');
        if (floatEl) floatEl.remove();
        document.body.classList.remove('sortable-active');

        if (typeof opts.onCancel === 'function') {
            try { opts.onCancel(); } catch (_) { /* 忽略 */ }
        }
    }

    // 起拖前的清理（轻点/pointercancel 未构成拖动）
    function reset() {
        detachListeners();
        if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
        phase = 'idle';
        pointerId = null;
        clone = null;
        source = null;
        dragItems = [];
    }

    // 拖动结束后的尾随 click 会误触"点击编辑/删除"，在捕获阶段吞掉。
    // 监听器只在拖动结束后的抑制窗口内存在，避免面板反复开关时在 document 上堆积。
    function onClickCapture(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    let clickGuardTimer = 0;

    function armClickGuard() {
        if (!clickGuardTimer) document.addEventListener('click', onClickCapture, true);
        else clearTimeout(clickGuardTimer);
        clickGuardTimer = setTimeout(disarmClickGuard, opts.clickSuppressMs + 50);
    }

    function disarmClickGuard() {
        if (clickGuardTimer) { clearTimeout(clickGuardTimer); clickGuardTimer = 0; }
        document.removeEventListener('click', onClickCapture, true);
    }

    listContainer.addEventListener('pointerdown', onPointerDown);

    return {
        destroy() {
            if (destroyed) return;
            destroyed = true;
            if (phase === 'dragging') cancelDrag();
            else reset();
            listContainer.removeEventListener('pointerdown', onPointerDown);
            disarmClickGuard();
            if (source === null) document.body.classList.remove('sortable-active');
        },
    };
}

// ==== main/Script/core/mixins/QuickLinksMixin.js ====
// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

// [bundled] import { … } from '../quicklinks-export.js'
// [bundled] import { … } from '../sortable.js'

const QuickLinksMixin = {
    handleOpenQuickLinksParam() {
        try {
            const params = new URLSearchParams(window.location.search);
            if (params.get('openQuickLinks') === '1') {
                this.openSettings('badge');
                setTimeout(() => {
                    this.showQuickLinksMenuInRightPanel();
                }, 100);
                return;
            }
            // 侧边栏小组件空态/设置跳转直达：打开设置并进入小组件列表管理器
            if (params.get('openWidgets') === '1') {
                this.openSettings('badge');
                setTimeout(() => {
                    this.showWidgetPanelMenuInRightPanel();
                }, 100);
                return;
            }
            const spView = params.get('openSidePanel');
            if (spView) {
                this.openSettings('badge');
                setTimeout(() => {
                    const rpu = document.getElementById('right-panel-upper');
                    if (!rpu) return;
                    this.renderSidePanelConfigView(rpu);
                    if (spView !== 'root') {
                        this.renderSidePanelSubView(rpu, spView);
                    }
                }, 100);
            }
        } catch (e) {
            console.warn('解析面板跳转参数失败:', e);
        }
    },
    addQuickLink() {
        const nameInput = document.getElementById('quick-link-name');
        const urlInput = document.getElementById('quick-link-url');

        const name = nameInput.value.trim();
        let url = urlInput.value.trim();

        if (!name) {
            this.showNotification('请输入网站名称');
            nameInput.focus();
            return;
        }

        if (!url) {
            this.showNotification('请输入网站地址');
            urlInput.focus();
            return;
        }

        // 确保URL包含协议
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        // 检查URL格式
        try {
            new URL(url);
        } catch (e) {
            this.showNotification('网站地址格式不正确');
            urlInput.focus();
            return;
        }

        // 检查是否已存在同名链接
        const existingIndex = this.settings.quickLinks.findIndex(link => link.name === name);
        if (existingIndex >= 0) {
            // 更新现有链接
            this.settings.quickLinks[existingIndex].url = url;
            this.showNotification('快速访问链接已更新');
        } else {
            // 添加新链接
            this.settings.quickLinks.push({ name, url });
            this.showNotification('快速访问链接已添加');
        }

        // 清空输入框
        nameInput.value = '';
        urlInput.value = '';

        // 更新列表和保存设置
        this.updateQuickLinksList();
        this.saveSettings();
    },
    updateQuickLinksList() {
        const quickLinksList = document.getElementById('quick-links-list');
        if (!quickLinksList) return;

        quickLinksList.innerHTML = '';

        if (this.settings.quickLinks.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'quick-links-empty';
            emptyMessage.textContent = '暂无快速访问链接';
            quickLinksList.appendChild(emptyMessage);
            return;
        }

        this.settings.quickLinks.forEach((link, index) => {
            const linkItem = document.createElement('div');
            linkItem.className = 'quick-link-menu-item';

            const linkInfo = document.createElement('div');
            linkInfo.className = 'quick-link-menu-info';

            const linkName = document.createElement('div');
            linkName.className = 'quick-link-menu-name';
            linkName.textContent = link.name;

            const linkUrl = document.createElement('div');
            linkUrl.className = 'quick-link-menu-url';
            linkUrl.textContent = link.url;

            linkInfo.appendChild(linkName);
            linkInfo.appendChild(linkUrl);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-link-menu-btn';
            deleteBtn.textContent = '删除';
            deleteBtn.addEventListener('click', () => this.deleteQuickLink(index));

            linkItem.appendChild(linkInfo);
            linkItem.appendChild(deleteBtn);

            quickLinksList.appendChild(linkItem);
        });
    },
    deleteQuickLink(index) {
        if (index >= 0 && index < this.settings.quickLinks.length) {
            const linkName = this.settings.quickLinks[index].name;
            this.settings.quickLinks.splice(index, 1);
            this.updateQuickLinksList();
            this.saveSettings();
            this.showNotification(`快速访问链接 "${linkName}" 已删除`);
        }
    },
    applyQuickLinks() {
        // 侧边栏链接子视图交换期间挂起，避免主页面渲染侧边栏数据
        if (this._spSwap && this._spSwap.quickLinks !== undefined) return;
        const quickAccessContainer = document.getElementById('quick-access-links');
        quickAccessContainer.innerHTML = '';

        if (this.settings.quickLinks.length === 0) {
            quickAccessContainer.style.display = 'none';
        } else if (this.settings.quickAccessSidebar) {
            // 快速访问侧边栏：隐藏原始底部链接，显示侧边栏
            quickAccessContainer.style.display = 'none';
        } else {
            quickAccessContainer.style.display = 'flex';

            this.settings.quickLinks.forEach(link => {
                const linkBtn = document.createElement('button');
                linkBtn.className = 'quick-access-btn';
                linkBtn.textContent = link.name;
                linkBtn.addEventListener('click', () => {
                    window.open(link.url, '_blank');
                });

                quickAccessContainer.appendChild(linkBtn);
            });
        }

        // 渲染侧边栏版本
        this.renderQuickAccessSidebar();
    },
    renderQuickAccessSidebar() {
        const sidebarLinks = document.getElementById('quick-access-sidebar-links');
        if (!sidebarLinks) return;

        sidebarLinks.innerHTML = '';

        if (this.settings.quickLinks.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'quick-access-sidebar-empty';
            emptyMsg.textContent = '暂无快速访问链接';
            sidebarLinks.appendChild(emptyMsg);
            this.updateSidebarVisibility();
            this.updateSidebarIconColors();
            // 不 return，继续渲染底部的添加按钮
        } else {

            this.settings.quickLinks.forEach((link, index) => {
                const linkItem = document.createElement('button');
                linkItem.className = 'quick-access-sidebar-link';
                linkItem.title = link.url;

                // 图标容器
                const iconEl = document.createElement('span');
                iconEl.className = 'quick-access-sidebar-link-icon';

                // 字母占位（默认显示）
                const letterEl = document.createElement('span');
                letterEl.className = 'quick-access-sidebar-link-letter';
                letterEl.textContent = link.name.charAt(0).toUpperCase();
                iconEl.appendChild(letterEl);

                // 尝试显示已缓存的 favicon
                const faviconImg = document.createElement('img');
                faviconImg.className = 'quick-access-sidebar-link-favicon';
                faviconImg.alt = '';
                faviconImg.style.display = 'none';

                const domain = this.extractDomain(link.url);
                let faviconUrl = null;
                let tryFallback = false;

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

                    const self = this;
                    let fallbackTried = false;

                    faviconImg.onerror = function () {
                        if (tryFallback && !fallbackTried && domain) {
                            fallbackTried = true;
                            this.src = 'https://icons.duckduckgo.com/ip3/' + domain + '.ico';
                            return;
                        }
                        // 两个源都失败，回退到字母占位
                        this.style.display = 'none';
                        const letter = this.parentElement.querySelector('.quick-access-sidebar-link-letter');
                        if (letter) letter.style.display = 'flex';
                        // 仅在从未检测过时写入缓存，避免每次渲染重复回写设置
                        if (link._favicon === undefined && domain) {
                            self.cacheFavicon(link, index, domain, null);
                        }
                    };

                    faviconImg.onload = function () {
                        // 检测是否为默认图标（如 Google 的默认地球图标大小为 16x16）
                        const isDefaultIcon = this.naturalWidth <= 20 || this.naturalHeight <= 20;

                        if (isDefaultIcon && link._favicon === undefined) {
                            // 无真实图标，回退到字母占位
                            this.style.display = 'none';
                            const letter = this.parentElement.querySelector('.quick-access-sidebar-link-letter');
                            if (letter) letter.style.display = 'flex';
                            // 标记为无图标，下次不再尝试加载
                            self.cacheFavicon(link, index, domain, null);
                            return;
                        }

                        const letter = this.parentElement.querySelector('.quick-access-sidebar-link-letter');
                        if (letter) letter.style.display = 'none';
                        this.style.display = 'block';

                        if (link._favicon === undefined && domain) {
                            self.cacheFavicon(link, index, domain, this.src);
                        }
                    };
                }

                iconEl.appendChild(faviconImg);

                // 文字
                const textEl = document.createElement('span');
                textEl.className = 'quick-access-sidebar-link-text';
                textEl.textContent = link.name;

                linkItem.appendChild(iconEl);
                linkItem.appendChild(textEl);

                linkItem.addEventListener('click', () => {
                    window.open(link.url, '_blank');
                });

                sidebarLinks.appendChild(linkItem);
            });
        } // else 结束

        // 根据设置显示/隐藏图标
        const containerEl = document.getElementById('quick-access-sidebar-container');
        if (containerEl) {
            containerEl.classList.toggle('no-icons', !this.settings.showQuickLinkIcons);
            // 内联样式兜底，确保图标隐藏
            const linkItems = containerEl.querySelectorAll('.quick-access-sidebar-link');
            linkItems.forEach(item => {
                const icon = item.querySelector('.quick-access-sidebar-link-icon');
                if (icon) {
                    icon.style.display = this.settings.showQuickLinkIcons ? '' : 'none';
                }
            });
        }

        this.updateSidebarVisibility();
        this.updateSidebarIconColors();
    },
    extractDomain(url) {
        try {
            const u = new URL(url);
            return u.hostname;
        } catch (e) {
            return null;
        }
    },
    cacheFavicon(link, index, domain, src) {
        if (src) {
            this.settings.quickLinks[index]._favicon = src;
        } else {
            // 标记为无图标，存储空字符串避免下次重复请求
            this.settings.quickLinks[index]._favicon = '';
        }
        this.saveSettings();
    },
    updateSidebarIconColors() {
        const container = document.getElementById('quick-access-sidebar-container');
        if (!container) return;

        const colorConfig = this.getColorConfig();
        container.style.setProperty('--sidebar-icon-bg', colorConfig.sidebarIcon);
    },
    updateSidebarVisibility() {
        const sidebar = document.getElementById('quick-access-sidebar');
        if (!sidebar) return;

        if (this.settings.quickAccessSidebar) {
            sidebar.classList.add('active');
        } else {
            sidebar.classList.remove('active');
            // 侧边栏功能关闭时始终隐藏容器（固定侧边栏不生效）
            const container = document.getElementById('quick-access-sidebar-container');
            if (container) {
                container.classList.remove('visible');
                container.classList.add('hiding');
            }
        }
    },
    isSidebarFixed() {
        if (!this.settings.quickAccessSidebar) return false;
        return this.isScrolled
            ? this.settings.fixSidebarWallpaper
            : (this.settings.fixSidebarEnabled && this.settings.fixSidebarHomepage);
    },
    initQuickAccessSidebar() {
        const trigger = document.getElementById('quick-access-sidebar-trigger');
        const container = document.getElementById('quick-access-sidebar-container');
        const sidebar = document.getElementById('quick-access-sidebar');
        const addBtn = document.getElementById('quick-access-sidebar-add-btn');

        if (!trigger || !container || !sidebar) return;

        // 添加按钮：打开设置并跳转到快速链接管理
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.openSettings('badge');
                // 等待设置面板打开后，显示快速链接管理
                setTimeout(() => {
                    this.showQuickLinksMenuInRightPanel();
                }, 100);
            });
        }

        let hideTimeout = null;
        let isVisible = false;
        const TRIGGER_ZONE_WIDTH = 100;   // 右侧触发区域宽度（像素）
        const HIDE_DELAY = 0;            // 鼠标离开立即关闭

        const pushWallpaper = (pushIn) => {
            this._sidebarPushing = pushIn && window.innerWidth >= 750;
            if (this.wallpaperMain && this.settings.wallpaperScale &&
                (this.settings.persistentWallpaper || this.isScrolled)) {
                this.wallpaperMain.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                this.applyWallpaperTransform();
            }
        };

        const showSidebar = () => {
            if (!this.settings.quickAccessSidebar) return;
            const modal = document.getElementById('settings-modal');
            if (modal && modal.classList.contains('show')) return;
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
            if (!isVisible) {
                isVisible = true;
                container.classList.remove('hiding');
                container.classList.add('visible');

                document.body.classList.add('sidebar-visible');

                pushWallpaper(true);
            }
        };

        const scheduleHide = () => {
            if (hideTimeout) clearTimeout(hideTimeout);
            hideTimeout = setTimeout(() => {
                // 当前视图处于固定模式时，不被 hover 隐藏
                if (this.isSidebarFixed()) return;
                if (isVisible) {
                    isVisible = false;
                    container.classList.remove('visible');
                    container.classList.add('hiding');
                    document.body.classList.remove('sidebar-visible');
                    pushWallpaper(false);
                }
                hideTimeout = null;
            }, HIDE_DELAY);
        };

        // 全局鼠标移动检测：在右侧边缘触发区域显示容器（与小组件一致）
        document.addEventListener('mousemove', (e) => {
            if (!this.settings.quickAccessSidebar) return;
            const modal = document.getElementById('settings-modal');
            if (modal && modal.classList.contains('show')) return;
            const viewportWidth = window.innerWidth;
            const mouseX = e.clientX;

            if (mouseX >= viewportWidth - TRIGGER_ZONE_WIDTH) {
                // 当前视图处于固定模式时，无需 hover 触发
                if (this.isSidebarFixed()) return;
                showSidebar();
            } else if (isVisible && !this.isSidebarFixed()) {
                // 仅在容器可见且未固定时检查是否需要隐藏
                const containerRect = container.getBoundingClientRect();
                const isOverContainer = (
                    mouseX >= containerRect.left &&
                    mouseX <= containerRect.right &&
                    e.clientY >= containerRect.top &&
                    e.clientY <= containerRect.bottom
                );
                if (!isOverContainer) {
                    scheduleHide();
                }
            }
        });

        // 容器悬停维持显示（与小组件一致）
        container.addEventListener('mouseenter', () => {
            if (!this.settings.quickAccessSidebar) return;
            if (this.isSidebarFixed()) return;
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
            if (!isVisible) {
                isVisible = true;
                container.classList.remove('hiding');
                container.classList.add('visible');
                document.body.classList.add('sidebar-visible');
                pushWallpaper(true);
            }
        });

        container.addEventListener('mouseleave', () => {
            // 当前视图固定时鼠标移开不隐藏
            if (this.isSidebarFixed()) return;
            scheduleHide();
        });

        // 侧边栏滚轮：内容溢出时拦截（只滚动侧边栏内容，不触发壁纸模式进退）；
        // 内容不溢出时放行（交给页面滚动处理）
        const sidebarLinks = document.getElementById('quick-access-sidebar-links');
        const sidebarWheelHandler = (e) => {
            if (!sidebarLinks) return;
            const maxScroll = sidebarLinks.scrollHeight - sidebarLinks.clientHeight;
            if (maxScroll <= 0) return; // 内容不溢出，放行
            e.stopPropagation();        // 内容溢出：拦截，只滚动侧边栏内容
        };
        sidebar.addEventListener('wheel', sidebarWheelHandler, { passive: true });
        container.addEventListener('wheel', sidebarWheelHandler, { passive: true });
    },
showQuickLinksMenuInRightPanel (skipAnimation) {
    const self = this;
    const rightPanelUpper = document.getElementById('right-panel-upper');
    if (!rightPanelUpper) return;
    const settingsModal = document.getElementById('settings-modal');
    if (settingsModal) settingsModal.classList.add('right-panel-open');

    rightPanelUpper.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'settings-menu-container' + (skipAnimation ? '' : ' slide-in-right');

    const listContainer = document.createElement('div');
    listContainer.className = 'quick-links-list-container';
    container.appendChild(listContainer);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'settings-menu-button-container';

    const plusBtn = document.createElement('button');
    plusBtn.className = 'upload-btn settings-plus-btn';
    plusBtn.textContent = '+';
    plusBtn.title = '添加快速访问链接';

    // 书签导入按钮
    const importBtn = document.createElement('button');
    importBtn.className = 'settings-import-btn';
    importBtn.title = '从 Chrome 书签导入';
    importBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';

    // 导出按钮（左边是导出，右边是导入）
    const exportBtn = document.createElement('button');
    exportBtn.className = 'settings-import-btn settings-export-btn';
    exportBtn.title = '导出快速访问链接为 JSON';
    exportBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>';

    // 导入下拉菜单（挂到 body 避免被父容器裁剪）
    const importDropdown = document.createElement('div');
    importDropdown.className = 'bookmark-import-dropdown';
    importDropdown.setAttribute('data-import-dropdown', '');
    document.body.appendChild(importDropdown);

    // 文件夹选择子菜单
    const folderSubmenu = document.createElement('div');
    folderSubmenu.className = 'bookmark-folder-submenu';
    folderSubmenu.setAttribute('data-folder-submenu', '');
    document.body.appendChild(folderSubmenu);

    // 导出/导入按钮行：左边是导出，右边是导入
    const ioRow = document.createElement('div');
    ioRow.className = 'quick-links-io-row';
    ioRow.appendChild(exportBtn);
    ioRow.appendChild(importBtn);

    buttonContainer.appendChild(ioRow);
    buttonContainer.appendChild(plusBtn);
    container.appendChild(buttonContainer);

    rightPanelUpper.appendChild(container);

    this.updateQuickLinksListInMenu(listContainer);

    plusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        self.showQuickLinksAddInterface(container, listContainer, buttonContainer);
    });

    // 导入按钮点击事件
    importBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        self.toggleBookmarkImportDropdown(importDropdown, folderSubmenu, importBtn);
    });

    // 导出按钮点击事件：将快速访问链接导出为 JSON 文件
    exportBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (typeof QuickLinksExporter !== 'undefined') {
            QuickLinksExporter.exportQuickLinks(self);
        }
    });

    // 点击外部关闭下拉菜单（先注销上一次的监听器，避免反复打开菜单导致监听器泄漏）
    if (this._quickLinksDocClickHandler) {
        document.removeEventListener('click', this._quickLinksDocClickHandler);
    }
    this._quickLinksDocClickHandler = (e) => {
        if (!importDropdown.isConnected) {
            // 下拉元素已被移除（菜单关闭），自动注销监听器
            document.removeEventListener('click', this._quickLinksDocClickHandler);
            this._quickLinksDocClickHandler = null;
            return;
        }
        if (e.target !== importBtn && !importDropdown.contains(e.target) && !folderSubmenu.contains(e.target)) {
            importDropdown.classList.remove('active');
            folderSubmenu.classList.remove('active');
        }
    };
    document.addEventListener('click', this._quickLinksDocClickHandler);
},
showQuickLinksAddInterface (container, listContainer, buttonContainer, editIndex) {
    const self = this;
    const isEdit = typeof editIndex === 'number' && editIndex >= 0;
    const existingLink = isEdit ? (this.settings.quickLinks[editIndex] || null) : null;

    listContainer.style.display = 'none';
    buttonContainer.style.display = 'none';

    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'quick-links-input-wrapper';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'setting-input';
    nameInput.id = 'quick-link-name';
    nameInput.placeholder = '网站名称';
    if (isEdit && existingLink) {
        nameInput.value = existingLink.name;
    }

    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.className = 'setting-input';
    urlInput.id = 'quick-link-url';
    urlInput.placeholder = '网站地址';
    if (isEdit && existingLink) {
        urlInput.value = existingLink.url;
    }

    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.className = 'settings-menu-button-container quick-links-add-buttons';

    const handleSave = () => {
        const name = nameInput.value.trim();
        const url = urlInput.value.trim();

        if (!name || !url) {
            self.hideQuickLinksAddInterface(container, inputWrapper, listContainer, buttonContainer);
            return;
        }

        if (isEdit) {
            self.settings.quickLinks[editIndex] = { name, url };
            self.saveSettings();
            self.showNotification('快速访问链接已更新');
        } else {
            self.addQuickLink();
        }
        self.updateQuickLinksListInMenu(listContainer);
        self.hideQuickLinksAddInterface(container, inputWrapper, listContainer, buttonContainer);
    };

    const confirmAddBtn = document.createElement('button');
    confirmAddBtn.className = 'settings-menu-confirm-primary';
    confirmAddBtn.textContent = '确定';

    // 编辑模式添加取消按钮
    if (isEdit) {
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.style.cssText = 'padding:8px 20px;border:1px solid var(--border-color);border-radius:12px;font-size:13px;color:var(--text-color);background:transparent;cursor:pointer;';
        cancelBtn.addEventListener('click', () => {
            self.hideQuickLinksAddInterface(container, inputWrapper, listContainer, buttonContainer);
        });
        buttonsWrapper.appendChild(cancelBtn);
    }

    nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            urlInput.focus();
        }
    });

    urlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    });

    confirmAddBtn.addEventListener('click', handleSave);

    // 从 JSON 导入：仅在"新增"模式下提供，编辑模式只保留取消和确定
    if (!isEdit) {
        // 从 JSON 导入按钮：与确定并排，配色与取消按钮同款
        const importFileBtn = document.createElement('button');
        importFileBtn.textContent = '从JSON导入';
        importFileBtn.title = '从 JSON 文件导入快速访问链接，也可直接拖入 JSON 文件';
        importFileBtn.style.cssText = 'padding:8px 20px;border:1px solid var(--border-color);border-radius:12px;font-size:13px;color:var(--text-color);background:transparent;cursor:pointer;';

        const importFileInput = document.createElement('input');
        importFileInput.type = 'file';
        importFileInput.accept = '.json,application/json';
        importFileInput.style.display = 'none';
        importFileInput.className = 'quick-links-json-file-input';

        // 读取文件并导入，成功后回到列表视图
        const readFileAndImport = (file) => {
            if (!file) return;
            const isJson = /\.json$/i.test(file.name) || (file.type && file.type.indexOf('json') !== -1);
            if (!isJson) {
                self.showNotification('请导入 JSON 文件');
                return;
            }
            const reader = new FileReader();
            reader.onload = (ev) => {
                const ok = typeof QuickLinksImporter !== 'undefined' &&
                    QuickLinksImporter.importQuickLinks(self, ev.target.result);
                if (ok) {
                    self.updateQuickLinksListInMenu(listContainer);
                    self.hideQuickLinksAddInterface(container, inputWrapper, listContainer, buttonContainer);
                }
            };
            reader.onerror = () => self.showNotification('文件读取失败');
            reader.readAsText(file);
        };

        importFileInput.addEventListener('change', (e) => {
            readFileAndImport(e.target.files[0]);
        });

        importFileBtn.addEventListener('click', () => importFileInput.click());

        // 支持直接拖入 JSON 文件导入（仅在添加视图内生效）
        const isAddViewActive = () => {
            const panel = document.getElementById('right-panel-upper');
            return panel && panel.dataset.subView === 'quick-link-add';
        };

        ['dragenter', 'dragover'].forEach(eventName => {
            container.addEventListener(eventName, (e) => {
                if (!isAddViewActive()) return;
                e.preventDefault();
                e.stopPropagation();
                container.classList.add('json-drag-over');
            });
        });
        ['dragleave', 'drop'].forEach(eventName => {
            container.addEventListener(eventName, (e) => {
                if (!isAddViewActive()) return;
                e.preventDefault();
                e.stopPropagation();
                container.classList.remove('json-drag-over');
            });
        });
        container.addEventListener('drop', (e) => {
            if (!isAddViewActive()) return;
            const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
            readFileAndImport(file);
        });

        buttonsWrapper.appendChild(importFileBtn);
        container.appendChild(importFileInput);
    }

    buttonsWrapper.appendChild(confirmAddBtn);

    inputWrapper.appendChild(nameInput);
    inputWrapper.appendChild(urlInput);
    container.appendChild(inputWrapper);
    container.appendChild(buttonsWrapper);

    const rpu = document.getElementById('right-panel-upper');
    if (rpu) {
        rpu.dataset.subView = isEdit ? 'quick-link-edit' : 'quick-link-add';
    }

    container._qlinput = inputWrapper;
    container._qllist = listContainer;
    container._qlbtn = buttonContainer;

    requestAnimationFrame(() => {
        inputWrapper.classList.add('slide-in-right');
        buttonsWrapper.classList.add('slide-in-right');
    });

    nameInput.focus();
},
hideQuickLinksAddInterface (container, inputWrapper, listContainer, buttonContainer) {
    const buttonsWrapper = container.querySelector('.quick-links-add-buttons');

    // 移除隐藏的 JSON 文件选择输入框，避免残留在列表视图
    const jsonFileInput = container.querySelector('.quick-links-json-file-input');
    if (jsonFileInput && jsonFileInput.parentNode) {
        container.removeChild(jsonFileInput);
    }
    container.classList.remove('json-drag-over');

    delete container._qlinput;
    delete container._qllist;
    delete container._qlbtn;

    const rpu = document.getElementById('right-panel-upper');
    if (rpu && (rpu.dataset.subView === 'quick-link-add' || rpu.dataset.subView === 'quick-link-edit')) {
        delete rpu.dataset.subView;
    }

    inputWrapper.classList.remove('slide-in-right');
    inputWrapper.classList.add('slide-out-right');
    if (buttonsWrapper) {
        buttonsWrapper.classList.remove('slide-in-right');
        buttonsWrapper.classList.add('slide-out-right');
    }

    // 立即恢复列表与按钮区显示，不依赖延迟回调，避免输入框与列表视图重叠残留
    listContainer.style.display = 'flex';
    buttonContainer.style.display = 'flex';

    setTimeout(() => {
        // 用实时查询兜底移除添加视图节点，确保无论闭包引用状态如何都不残留
        const leftoverButtons = container.querySelector('.quick-links-add-buttons');
        if (leftoverButtons && leftoverButtons.parentNode) {
            leftoverButtons.parentNode.removeChild(leftoverButtons);
        }
        const leftoverInput = container.querySelector('.quick-links-input-wrapper');
        if (leftoverInput && leftoverInput.parentNode) {
            leftoverInput.parentNode.removeChild(leftoverInput);
        }
    }, 200);
},
updateQuickLinksListInMenu (listContainer) {
    if (!listContainer) return;

    const self = this;
    if (listContainer._sortable) { listContainer._sortable.destroy(); listContainer._sortable = null; }
    listContainer.innerHTML = '';

    if (this.settings.quickLinks.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'quick-links-empty';
        emptyMessage.textContent = '暂无快速访问链接';
        listContainer.appendChild(emptyMessage);
        return;
    }

    // 使用 DocumentFragment 批量构建条目，大量链接时一次性挂载，避免逐个插入引发多次重排
    const fragment = document.createDocumentFragment();

    this.settings.quickLinks.forEach((link, index) => {
        const item = document.createElement('div');
        item.className = 'quick-link-menu-item';
        item.setAttribute('data-index', index);
        // 保存对 settings 对象的引用：拖动提交时按此重排，而不是从 DOM 文本重建
        item._sortRef = link;

        const dragHandle = document.createElement('div');
        dragHandle.className = 'quick-link-drag-handle';
        dragHandle.innerHTML = '<span></span><span></span>';
        dragHandle.title = '拖拽排序';

        const info = document.createElement('div');
        info.className = 'quick-link-menu-info';

        const name = document.createElement('div');
        name.className = 'quick-link-menu-name';
        name.textContent = link.name;

        const url = document.createElement('div');
        url.className = 'quick-link-menu-url';
        url.textContent = link.url;

        info.appendChild(name);
        info.appendChild(url);

        // 点击编辑链接
        info.addEventListener('click', (e) => {
            e.stopPropagation();
            const container = listContainer.closest('.settings-menu-container');
            const buttonContainer = container ? container.querySelector('.settings-menu-button-container') : null;
            if (container) {
                // 拖拽排序后 DOM 顺序会变，必须实时读取 data-index，避免使用旧闭包索引
                const currentIndex = parseInt(item.getAttribute('data-index'), 10);
                self.showQuickLinksAddInterface(container, listContainer, buttonContainer, currentIndex);
            }
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-link-menu-btn';
        deleteBtn.textContent = '×';
        deleteBtn.title = '删除';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // 拖拽排序后 DOM 顺序会变，必须实时读取 data-index，避免删除错误项
            const currentIndex = parseInt(item.getAttribute('data-index'), 10);
            if (isNaN(currentIndex) || currentIndex < 0 || currentIndex >= this.settings.quickLinks.length) return;
            this.settings.quickLinks.splice(currentIndex, 1);
            this.saveSettings();
            this.updateQuickLinksListInMenu(listContainer);

            this.showNotification('快速访问链接已删除');
        });

        item.appendChild(dragHandle);
        item.appendChild(info);
        item.appendChild(deleteBtn);
        fragment.appendChild(item);
    });

    // 全部条目构建完成后一次性挂载到列表容器
    listContainer.appendChild(fragment);

    // 一键清除按钮（超过5个链接时显示）
    if (this.settings.quickLinks.length > 5) {
        const clearAllBtn = document.createElement('button');
        clearAllBtn.className = 'quick-link-clear-all-btn';
        clearAllBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> ';
        clearAllBtn.title = '删除所有快速访问链接';
        clearAllBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (self.settings.quickLinks.length === 0) {
                self.showNotification('没有可清除的链接');
                return;
            }
            self.settings.quickLinks = [];
            self.saveSettings();
            self.applyQuickLinks();
            self.updateQuickLinksListInMenu(listContainer);
            self.showNotification('已清除所有快速访问链接');
        });
        listContainer.appendChild(clearAllBtn);
    }

    // 接管拖动排序（整行可拖，移动超过阈值才算拖动；轻点仍进入编辑）
    listContainer._sortable = attachSortableList(listContainer, {
        itemSelector: '.quick-link-menu-item',
        onCommit: (items) => {
            // 按新 DOM 顺序重排同一批对象引用，保留对象上的其它字段
            self.settings.quickLinks = items.map(el => el._sortRef);
            items.forEach((el, i) => el.setAttribute('data-index', i));
            self.saveSettings();
            self.showNotification('顺序已调整');
        }
    });
},
};

// ==== main/Script/core/mixins/SearchMixin.js ====
// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

const SearchMixin = {
    copySearchContent() {
        const searchInput = document.getElementById('search-input');
        if (searchInput && searchInput.value.trim()) {
            navigator.clipboard.writeText(searchInput.value.trim())
                .then(() => {
                    this.showNotification('复制');
                })
                .catch(err => {
                    console.error('复制失败:', err);
                    this.showNotification('复制失败');
                });
        } else {
            this.showNotification('搜索框为空');
        }
    },
    pasteToSearch() {
        const searchInput = document.getElementById('search-input');
        navigator.clipboard.readText()
            .then(text => {
                searchInput.value = text.trim();
                const clearBtn = document.querySelector('.search-clear-btn');
                if (clearBtn) {
                    clearBtn.style.display = searchInput.value.length > 0 ? 'flex' : 'none';
                }
                this.syncSearchAssistantUI(searchInput.value);
                this.showNotification('粘贴');
            })
            .catch(err => {
                console.error('粘贴失败:', err);
                this.showNotification('粘贴失败');
            });
    },
    handleScroll(e) {
        // 设置页面打开时，完全禁用滚动检测（避免触发壁纸模式）
        const settingsModal = document.getElementById('settings-modal');
        if (settingsModal && (settingsModal.classList.contains('show') || settingsModal.classList.contains('hiding'))) {
            return;
        }

        // Info框打开时，完全禁用滚动检测（避免误触壁纸模式）
        if (this.infoPopupOpen) {
            // 自动恢复：如果弹窗DOM已被外部移除，重置标志位
            if (!document.querySelector('.ooo-info-popup')) {
                this.infoPopupOpen = false;
            } else {
                return;
            }
        }

        // 节流：如果正在动画中，忽略新的滚动事件
        if (this.isAnimating) return;

        // 清除之前的动画定时器，允许打断
        if (this._animationTimeout) {
            clearTimeout(this._animationTimeout);
            this._animationTimeout = null;
        }

        // 向下滚动出现壁纸
        if (e.deltaY > 0 && !this.isScrolled) {
            this.showWallpaper();
        }
        // 向上滚动恢复
        else if (e.deltaY < 0 && this.isScrolled) {
            this.restoreHomepage();
        }
    },
    switchEngine(engine) {
        this.currentEngine = engine;
        // 引擎切换后建议来源改变,作废旧缓存
        this._suggestCache = null;

        // 更新按钮状态
        document.getElementById('google-engine').classList.toggle('active', engine === 'google');
        document.getElementById('bing-engine').classList.toggle('active', engine === 'bing');

        // 自动切换Logo（仅当用户没有手动更改过Logo，且Logo未被主题接管时）
        const themeLogoManaged = this.settings.themeEnabled
            && this.settings.themeAspects?.logo !== false
            && this.themeOverrides?.logo;
        if (!this.userChangedLogo && !themeLogoManaged && this.settings.logo !== 'default') {
            if (engine === 'google') {
                this.settings.logo = 'Google';
                this.settings.logoType = 'image';
            } else {
                this.settings.logo = 'Microsoft';
                this.settings.logoType = 'image';
            }
            this.applyLogo();
            this.saveSettings();
        } else if (this.settings.logo === 'auto') {
            // 自动模式下切换引擎时更新Logo
            this.applyLogo();
        }

        // 如果引擎锁定，保存到localStorage
        if (this.settings.engineLocked) {
            localStorage.setItem('oooEngineLocked', engine);
        }

        // 为按钮添加logo类名
        this.updateEngineButtonClasses();

        // 如果有搜索文字，立即搜索
        const searchInput = document.getElementById('search-input');
        if (searchInput.value.trim()) {
            this.performSearch(searchInput.value);
        }
    },
    performSearch(query) {
        if (!query.trim()) return;

        const trimmedQuery = query.trim();

        // 组件模式激活时（chip 在左，输入内容为纯参数），按模式执行
        if (this.searchCommandMode === 'web') {
            if (!trimmedQuery) {
                this.showNotification('请输入网址，例如：google.com');
                return;
            }
            this.openExternalUrl(trimmedQuery);
            this.searchCommandMode = null;
            return;
        }
        if (this.searchCommandMode === 'translate') {
            this.executeTranslateModeQuery(trimmedQuery);
            return;
        }

        // “/” 命令语法兜底路径（正常流程中前缀在输入空格时已被替换）：不进入搜索历史
        if (trimmedQuery.startsWith('/')) {
            this.executeSlashCommand(trimmedQuery);
            this.hideSearchCommandList();
            return;
        }

        this.addToSearchHistory(query);

        const lowerQuery = trimmedQuery.toLowerCase();

        if (lowerQuery.startsWith('网址/') || lowerQuery.startsWith('web/')) {
            let url = trimmedQuery.substring(trimmedQuery.indexOf('/') + 1).trim();

            if (!url) return;

            this.openExternalUrl(url);
            return;
        }

        let searchUrl;
        if (this.currentEngine === 'google') {
            searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        } else {
            searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
        }

        window.location.href = searchUrl;
    },
    openExternalUrl(urlText) {
        let url = (urlText || '').trim();
        if (!url) return;

        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        try {
            new URL(url);
            this.recordWebHistory(url);
            window.location.href = url;
        } catch (e) {
            this.showNotification('无效的URL地址');
        }
    },
    getSlashCommands() {
        return [
            { name: 'web', icon: 'language', desc: '打开网页' },
            { name: 'translate', icon: 'translate', desc: '翻译文本' }
        ];
    },
    isWebCommand(word) {
        return ['web', 'w', '网址'].includes((word || '').toLowerCase());
    },
    isTranslateCommand(word) {
        return ['translate', 't', '翻译'].includes((word || '').toLowerCase());
    },
    syncSearchAssistantUI(value) {
        if (typeof value !== 'string') value = '';

        if (this.searchCommandMode === 'web') {
            this.hideSearchCommandList();
            this.updateSearchModeChip();
            this.refreshSearchDropdownPanels();
            return;
        }

        if (this.searchCommandMode === 'translate') {
            this.hideSearchCommandList();
            this.lockTranslatePairFromInput(value);
            this.updateSearchModeChip();
            this.refreshSearchDropdownPanels();
            return;
        }

        if (value.startsWith('/')) {
            this.hideSearchHistory();

            // “/别名 + 空格”：把前缀替换为左侧 chip，剩余文本作为参数继续输入
            const entered = value.match(/^\/(\S+)\s([\s\S]*)$/);
            if (entered && (this.isWebCommand(entered[1]) || this.isTranslateCommand(entered[1]))) {
                const mode = this.isWebCommand(entered[1]) ? 'web' : 'translate';
                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                    searchInput.value = entered[2] || '';
                    const clearBtn = document.querySelector('.search-clear-btn');
                    if (clearBtn) {
                        clearBtn.style.display = searchInput.value.length > 0 ? 'flex' : 'none';
                    }
                }
                this.enterSearchCommandMode(mode);
                if (mode === 'translate') {
                    const restValue = searchInput ? searchInput.value : '';
                    this.lockTranslatePairFromInput(restValue);
                    this.updateSearchModeChip();
                    this.refreshSearchDropdownPanels();
                }
                return;
            }

            this.updateSearchModeChip();
            this.showSearchCommandList(value);
            return;
        }

        this.hideSearchCommandList();
        this.updateSearchModeChip();

        // 输入有效长度超过 4 且开启"热搜词建议":先同步展示历史作即时反馈,再调度拉取热搜
        // 中文每个字算 2 个有效字符(3-4 字即可触发),英文每字母算 1(5-6 字母触发)
        // 其余情况(≤4 字符或开关关闭)维持原有搜索历史逻辑
        const trimmedValue = value.trim();
        if (this.settings.searchSuggestions && this._effectiveLength(trimmedValue) > 4) {
            this.renderSearchSuggestions(trimmedValue, null);
            this.scheduleSearchSuggestions(trimmedValue);
            return;
        }
        this.cancelSearchSuggestions();
        if (this.settings.searchHistory && this.settings.searchHistoryItems.length > 0) {
            this.showSearchHistory(value);
        } else {
            this.hideSearchHistory();
        }
    },
    showSearchCommandList(currentInput = '') {
        if (!currentInput.startsWith('/')) {
            this.hideSearchCommandList();
            return;
        }

        // 只在第一个空格之前提供候选；出现空格说明已进入对应组件模式
        const partial = currentInput.slice(1);
        if (/\s/.test(partial)) {
            this.hideSearchCommandList();
            return;
        }

        const filter = partial.toLowerCase();
        const items = this.getSlashCommands().filter(cmd => {
            if (!filter) return true;
            if (cmd.name.toLowerCase().startsWith(filter)) return true;
            const extraAliases = this.isWebCommand(cmd.name)
                ? ['w', '网址']
                : (this.isTranslateCommand(cmd.name) ? ['t', '翻译'] : []);
            return extraAliases.some(alias => alias.toLowerCase().startsWith(filter));
        });

        if (items.length === 0) {
            this.hideSearchCommandList();
            return;
        }

        this.commandListState = { visible: true, items: items, highlight: -1 };
        this.renderSearchCommandItems();
        this.refreshSearchDropdownPanels();
    },
    hideSearchCommandList() {
        const container = document.getElementById('search-command-container');
        if (container) {
            container.classList.remove('show');
        }
        if (this.commandListState) {
            this.commandListState.visible = false;
            this.commandListState.highlight = -1;
        }
    },
    renderSearchCommandItems() {
        const list = document.querySelector('.search-command-list');
        if (!list || !this.commandListState) return;

        list.innerHTML = '';

        this.commandListState.items.forEach((cmd, index) => {
            const item = document.createElement('div');
            item.className = 'search-command-item' + (index === this.commandListState.highlight ? ' selected' : '');
            item.dataset.index = index;
            item.innerHTML = `
                <span class="search-command-icon material-icons">${cmd.icon}</span>
                <div class="search-command-info">
                    <span class="search-command-name">/${cmd.name}</span>
                    <span class="search-command-desc">${this.escapeHtml(cmd.desc)}</span>
                </div>
            `;
            list.appendChild(item);
        });
    },
    moveSearchCommandHighlight(delta) {
        const state = this.commandListState;
        if (!state || !state.visible || state.items.length === 0) return;

        const max = state.items.length - 1;
        state.highlight += delta;
        if (state.highlight > max) state.highlight = 0;
        if (state.highlight < 0) state.highlight = max;

        this.renderSearchCommandItems();
    },
    applySearchCommand(cmd) {
        if (!cmd) return;

        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = '';
            searchInput.focus();
        }
        const clearBtn = document.querySelector('.search-clear-btn');
        if (clearBtn) {
            clearBtn.style.display = 'none';
        }

        this.enterSearchCommandMode(this.isWebCommand(cmd.name) ? 'web' : 'translate');
    },
    enterSearchCommandMode(mode) {
        this.searchCommandMode = mode;
        this.translateSelectedPair = null;
        this.hideSearchCommandList();
        this.updateSearchModeChip();
        this.refreshSearchDropdownPanels();

        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.focus();
        }
        this.showNotification('已进入' + (mode === 'web' ? '网址' : '翻译') + '模式');
    },
    exitSearchCommandMode(clearInput = true) {
        this.searchCommandMode = null;
        this.translateSelectedPair = null;

        const searchInput = document.getElementById('search-input');
        if (clearInput && searchInput) {
            searchInput.value = '';
        }
        const clearBtn = document.querySelector('.search-clear-btn');
        if (clearBtn && searchInput) {
            clearBtn.style.display = searchInput.value.length > 0 ? 'flex' : 'none';
        }
        this.updateSearchModeChip();
        this.hideSearchCommandList();
    },
    updateSearchModeChip() {
        const chip = document.getElementById('search-mode-chip');
        if (!chip) return;

        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.classList.toggle('mode-active', !!this.searchCommandMode);
        }

        const iconEl = chip.querySelector('.search-mode-chip-icon');
        const textEl = chip.querySelector('.search-mode-chip-text');

        if (this.searchCommandMode === 'web') {
            iconEl.textContent = 'language';
            textEl.textContent = '网址';
            chip.classList.add('expanded');
        } else if (this.searchCommandMode === 'translate') {
            iconEl.textContent = 'translate';
            textEl.textContent = this.translateSelectedPair
                ? this.translateSelectedPair.from.label + '→' + this.translateSelectedPair.to.label
                : '翻译';
            chip.classList.add('expanded');
        } else {
            chip.classList.remove('expanded');
        }
    },
    refreshSearchDropdownPanels() {
        const container = document.getElementById('search-command-container');
        if (!container) return;

        const commandVisible = !!(this.commandListState && this.commandListState.visible);

        const commandList = container.querySelector('.search-command-list');
        if (commandList && !commandVisible) {
            commandList.innerHTML = '';
        }

        // 组装历史内容（仅 translate / web 模式且命令列表不可见时）
        const historyEntries = [];
        let historyKind = '';
        if (!commandVisible) {
            if (this.searchCommandMode === 'translate') {
                historyEntries.push(...this.getTranslateHistory());
                historyKind = 'translate';
            } else if (this.searchCommandMode === 'web') {
                historyEntries.push(...this.getWebHistory());
                historyKind = 'web';
            }
        }

        const historyList = container.querySelector('.translate-history-list');
        if (historyList) {
            historyList.innerHTML = '';

            // 行结构与原生搜索历史一致（search-history-item），含悬停出现的删除按钮
            if (historyKind === 'translate' && historyEntries.length > 0) {
                historyEntries.forEach(entry => {
                    if (!entry || !entry.pair) return;
                    const sides = String(entry.pair).split('-');
                    const fromE = this.resolveTranslateLanguage(sides[0]);
                    const toE = this.resolveTranslateLanguage(sides[1]);
                    const labels = (fromE ? fromE.label : sides[0]) + '→' + (toE ? toE.label : sides[1]);
                    const display = entry.pair + ' · ' + labels;

                    const row = document.createElement('div');
                    row.className = 'search-history-item';
                    row.dataset.pair = entry.pair;
                    row.innerHTML = `
                        <span class="search-history-text">${this.escapeHtml(display)}</span>
                        <button class="search-history-delete" data-kind="translate" data-pair="${this.escapeHtml(entry.pair)}">
                            ×
                        </button>
                    `;
                    historyList.appendChild(row);
                });
            } else if (historyKind === 'web' && historyEntries.length > 0) {
                historyEntries.forEach(entry => {
                    if (!entry || !entry.host) return;

                    const row = document.createElement('div');
                    row.className = 'search-history-item';
                    row.dataset.key = entry.key || '';
                    row.innerHTML = `
                        <span class="search-history-text">${this.escapeHtml(entry.host + (entry.rest || ''))}</span>
                        <button class="search-history-delete" data-kind="web" data-key="${this.escapeHtml(entry.key || '')}">
                            ×
                        </button>
                    `;
                    historyList.appendChild(row);
                });
            }
        }

        if (commandVisible || (historyList && historyList.children.length > 0)) {
            container.classList.add('show');
        } else {
            container.classList.remove('show');
        }
    },
    addToSearchHistory(query) {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return;

        this.settings.searchHistoryItems = this.settings.searchHistoryItems.filter(item => item !== trimmedQuery);
        this.settings.searchHistoryItems.unshift(trimmedQuery);

        if (this.settings.searchHistoryItems.length > 20) {
            this.settings.searchHistoryItems = this.settings.searchHistoryItems.slice(0, 20);
        }

        this.saveSettings();
    },
    showSearchHistory(currentInput = '') {
        if (document.body.classList.contains('scrolled')) {
            return;
        }

        const searchHistoryContainer = document.getElementById('search-history-container');
        const searchHistoryList = document.querySelector('.search-history-list');
        const quickAccessLinks = document.getElementById('quick-access-links');
        const engineButtons = document.querySelector('.engine-buttons');

        if (!searchHistoryContainer || !searchHistoryList) return;

        searchHistoryList.innerHTML = '';

        let historyItems = [...this.settings.searchHistoryItems];

        if (currentInput.trim()) {
            const inputLower = currentInput.toLowerCase();

            historyItems.sort((a, b) => {
                const aLower = a.toLowerCase();
                const bLower = b.toLowerCase();

                const scoreA = this.calculateRelevance(aLower, inputLower);
                const scoreB = this.calculateRelevance(bLower, inputLower);

                return scoreB - scoreA;
            });
        }

        historyItems.forEach((query) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'search-history-item';
            historyItem.dataset.query = query;
            historyItem.innerHTML = `
                <span class="search-history-text">${this.escapeHtml(query)}</span>
                <button class="search-history-delete" data-query="${this.escapeHtml(query)}">
                    ×
                </button>
            `;
            searchHistoryList.appendChild(historyItem);
        });

        searchHistoryContainer.classList.add('show');

        if (quickAccessLinks) {
            quickAccessLinks.style.transform = 'translateY(1000px)';
            quickAccessLinks.style.opacity = '0';
            quickAccessLinks.style.pointerEvents = 'none';
        }
    },
    hideSearchHistory() {
        const searchHistoryContainer = document.getElementById('search-history-container');
        const quickAccessLinks = document.getElementById('quick-access-links');
        const engineButtons = document.querySelector('.engine-buttons');

        if (searchHistoryContainer) {
            searchHistoryContainer.classList.remove('show');
        }

        if (quickAccessLinks) {
            quickAccessLinks.style.transform = '';
            quickAccessLinks.style.opacity = '';
            quickAccessLinks.style.pointerEvents = '';
        }
    },
    removeFromSearchHistory(query) {
        this.settings.searchHistoryItems = this.settings.searchHistoryItems.filter(item => item !== query);
        this.saveSettings();
        // 走统一入口重渲染,使"历史 + 热搜"合并列表保持一致
        this.syncSearchAssistantUI(document.getElementById('search-input').value);
    },
    calculateRelevance(text, query) {
        if (!query) return 0;

        let score = 0;

        if (text.startsWith(query)) {
            score += 10;
        }

        if (text.includes(query)) {
            score += 5;
        }

        const words = query.split(' ');
        words.forEach(word => {
            if (text.includes(word)) {
                score += 2;
            }
        });

        return score;
    },
    _effectiveLength(str) {
        const s = str || '';
        let len = 0;
        for (let i = 0; i < s.length; i++) {
            const c = s.charCodeAt(i);
            // CJK Unified Ideographs U+4E00-U+9FFF
            // Hiragana & Katakana U+3040-U+30FF
            // CJK Symbols & Punctuation U+3000-U+303F
            if ((c >= 0x4E00 && c <= 0x9FFF) || (c >= 0x3000 && c <= 0x30FF)) {
                len += 2;
            } else {
                len += 1;
            }
        }
        return len;
    },
    calculateCombinedScore(text, query, kind) {
        const a = String(text).toLowerCase();
        const b = String(query).toLowerCase();
        let score = this.calculateRelevance(a, b);
        if (kind === 'history') {
            if (a === b) score += 100;
            score += 1;
        }
        return score;
    },
    cancelSearchSuggestions() {
        if (this.suggestDebounceTimer) {
            clearTimeout(this.suggestDebounceTimer);
            this.suggestDebounceTimer = null;
        }
        this._suggestSeq += 1;
    },
    scheduleSearchSuggestions(query) {
        if (this.suggestDebounceTimer) {
            clearTimeout(this.suggestDebounceTimer);
            this.suggestDebounceTimer = null;
        }
        const seq = ++this._suggestSeq;

        this.suggestDebounceTimer = setTimeout(async () => {
            this.suggestDebounceTimer = null;
            if (seq !== this._suggestSeq) return;

            const input = document.getElementById('search-input');
            if (document.body.classList.contains('scrolled') || !input || input.value.trim() !== query) {
                return;
            }

            // 同引擎同查询 60 秒内直接复用缓存,避免聚焦/重复输入造成无谓请求
            let suggestions = null;
            const cache = this._suggestCache;
            if (cache && cache.engine === this.currentEngine && cache.query === query && (Date.now() - cache.ts < 60000)) {
                suggestions = cache.items;
            } else {
                try {
                    suggestions = await this.fetchSearchSuggestions(query);
                    this._suggestCache = { engine: this.currentEngine, query: query, items: suggestions, ts: Date.now() };
                } catch (err) {
                    suggestions = [];
                }
            }

            if (seq !== this._suggestSeq) return;
            const container = document.getElementById('search-history-container');
            if (document.body.classList.contains('scrolled') || !container) {
                return;
            }
            // 用户已点击外部关闭或移开焦点:本次下拉不应被异步结果重新打开
            const stillOpen = container.classList.contains('show');
            const inputFocused = document.activeElement === document.getElementById('search-input');
            if (!stillOpen && !inputFocused) {
                return;
            }
            this.renderSearchSuggestions(query, suggestions);
        }, 250);
    },
    async fetchSearchSuggestions(query) {
        const trimmed = String(query || '').trim();
        if (!trimmed) return [];

        // 最简 URL,不传 locale 参数,避免 mkt/hl 对结果的干扰
        const params = 'query=' + encodeURIComponent(trimmed);
        const bingUrl = 'https://www.bing.com/osjson.aspx?' + params;
        const googleUrl = 'https://suggestqueries.google.com/complete/search?client=firefox&q=' + params;

        // 先试 Bing
        let response;
        try {
            response = await this.slashFetch(bingUrl);
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data) && Array.isArray(data[1]) && data[1].length > 0) {
                    return data[1]
                        .map(item => (Array.isArray(item) ? (item[0] || '') : item))
                        .map(item => String(item).trim())
                        .filter(item => item)
                        .slice(0, 10);
                }
                console.warn('[热搜建议] Bing 未返回建议,回退 Google');
            } else {
                console.warn('[热搜建议] Bing HTTP', response.status, '| 回退 Google');
            }
        } catch (err) {
            console.warn('[热搜建议] Bing 不可用,回退 Google:', err.message);
        }

        // 回退 Google
        try {
            response = await this.slashFetch(googleUrl);
            if (!response.ok) {
                console.warn('[热搜建议] Google HTTP', response.status, '|', googleUrl);
                throw new Error('热搜建议接口响应异常 (HTTP ' + response.status + ')');
            }
            const data = await response.json();
            if (!Array.isArray(data) || !Array.isArray(data[1])) {
                console.warn('[热搜建议] 非预期响应格式', typeof data, Object.keys(data || {}));
                throw new Error('热搜建议接口解析失败');
            }
            return data[1]
                .map(item => (Array.isArray(item) ? (item[0] || '') : item))
                .map(item => String(item).trim())
                .filter(item => item)
                .slice(0, 10);
        } catch (err) {
            throw err;
        }
    },
    renderSearchSuggestions(query, suggestions) {
        if (document.body.classList.contains('scrolled')) return;

        const searchHistoryContainer = document.getElementById('search-history-container');
        const searchHistoryList = document.querySelector('.search-history-list');
        const quickAccessLinks = document.getElementById('quick-access-links');

        if (!searchHistoryContainer || !searchHistoryList) return;

        const q = String(query || '').trim();
        const rows = [];

        // 历史项:仅搜索历史开关开启时混入(搜索历史本身已保证去重,无需额外检查)
        if (this.settings.searchHistory && Array.isArray(this.settings.searchHistoryItems)) {
            this.settings.searchHistoryItems.forEach(raw => {
                const text = String(raw || '').trim();
                if (!text) return;
                rows.push({ text: text, kind: 'history' });
            });
        }

        // 热搜建议项:与历史同词的项也保留,由排序规则决定先后(同词历史 +100 分必排最上)
        if (Array.isArray(suggestions) && this.settings.searchSuggestions) {
            suggestions.forEach(raw => {
                const text = String(raw || '').trim();
                if (!text) return;
                rows.push({ text: text, kind: 'suggestion' });
            });
        }

        if (rows.length === 0) {
            this.hideSearchHistory();
            return;
        }

        if (q) {
            rows.sort((a, b) => {
                const scoreA = this.calculateCombinedScore(a.text, q, a.kind);
                const scoreB = this.calculateCombinedScore(b.text, q, b.kind);
                return scoreB - scoreA;
            });
        }

        searchHistoryList.innerHTML = '';

        rows.forEach(row => {
            const item = document.createElement('div');
            item.className = 'search-history-item' + (row.kind === 'suggestion' ? ' search-suggestion-item' : '');
            item.dataset.query = row.text;

            if (row.kind === 'history') {
                item.innerHTML = `
                    <span class="search-history-text">${this.escapeHtml(row.text)}</span>
                    <button class="search-history-delete" data-query="${this.escapeHtml(row.text)}">
                        ×
                    </button>
                `;
            } else {
                item.innerHTML = `
                    <span class="material-icons md3-icon search-suggestion-trend">trending_up</span>
                    <span class="search-history-text">${this.escapeHtml(row.text)}</span>
                    <span class="search-suggestion-badge">热搜</span>
                `;
            }
            searchHistoryList.appendChild(item);
        });

        searchHistoryContainer.classList.add('show');

        if (quickAccessLinks) {
            quickAccessLinks.style.transform = 'translateY(1000px)';
            quickAccessLinks.style.opacity = '0';
            quickAccessLinks.style.pointerEvents = 'none';
        }
    },
        escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    updateEngineButtonClasses() {
        // 移除所有logo类名
        const googleBtn = document.getElementById('google-engine');
        const bingBtn = document.getElementById('bing-engine');

        const logoClasses = ['logo-google', 'logo-microsoft', 'logo-apple', 'logo-huawei', 'logo-custom', 'logo-text'];
        logoClasses.forEach(logoClass => {
            googleBtn.classList.remove(logoClass);
            bingBtn.classList.remove(logoClass);
        });

        // 添加当前logo类名
        let logoClass;
        if (this.settings.logo === 'text-logo') {
            logoClass = 'logo-text';
        } else if (this.settings.customLogos.some(logo => logo.name === this.settings.logo)) {
            logoClass = 'logo-custom';
        } else if (this.settings.logo === 'default') {
            logoClass = 'logo-default';
        } else if (this.settings.logo === 'auto') {
            // 自动模式下使用Google的样式
            logoClass = 'logo-google';
        } else {
            logoClass = `logo-${this.settings.logo.toLowerCase()}`;
        }

        googleBtn.classList.add(logoClass);
        bingBtn.classList.add(logoClass);

        // 确保按钮状态正确
        googleBtn.classList.toggle('active', this.currentEngine === 'google');
        bingBtn.classList.toggle('active', this.currentEngine === 'bing');
    },
};

// ==== main/Script/core/translate-shared.js ====
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

// ==== main/Script/core/mixins/TranslateMixin.js ====
// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

// [bundled] import { … } from '../proxy.js'
// [bundled] import { … } from '../translate-shared.js'

const TranslateMixin = {
    lockTranslatePairFromInput(value) {
        if (this.translateSelectedPair || !value) return;

        const spIndex = value.search(/\s/);
        if (spIndex === -1) return; // 尚未出现空格，等待继续输入

        const pair = this.resolveLanguagePair(value.slice(0, spIndex));
        if (!pair) return; // 无法解析时保留原样，交由 Enter 时提示

        this.translateSelectedPair = pair;
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = value.slice(spIndex).replace(/^\s+/, '');
            const clearBtn = document.querySelector('.search-clear-btn');
            if (clearBtn) {
                clearBtn.style.display = searchInput.value.length > 0 ? 'flex' : 'none';
            }
        }
    },
    resolveLanguagePair(pairText) {
        const parts = (pairText || '').toLowerCase().split('-').filter(Boolean);
        if (parts.length === 0) return null;

        let fromEntry;
        let toEntry;
        if (parts.length >= 2) {
            fromEntry = this.resolveTranslateLanguage(parts[0]);
            toEntry = this.resolveTranslateLanguage(parts[1]);
        } else {
            fromEntry = this.resolveTranslateLanguage('auto');
            toEntry = this.resolveTranslateLanguage(parts[0]);
        }
        if (!fromEntry || !toEntry) return null;

        return { raw: fromEntry.key + '-' + toEntry.key, from: fromEntry, to: toEntry };
    },
    getTranslateHistory() {
        try {
            return JSON.parse(localStorage.getItem('oooTranslateHistory') || '[]') || [];
        } catch (e) {
            return [];
        }
    },
    setTranslateHistory(list) {
        localStorage.setItem('oooTranslateHistory', JSON.stringify(list || []));
    },
    recordTranslateHistory(fromEntry, toEntry) {
        if (!fromEntry || !toEntry) return;

        let list = this.getTranslateHistory();
        const raw = fromEntry.key + '-' + toEntry.key;
        list = list.filter(item => item && item.pair !== raw);
        list.unshift({ pair: raw });
        if (list.length > 12) {
            list.length = 12;
        }
        this.setTranslateHistory(list);
    },
    applyTranslateHistoryPair(pairRaw) {
        if (this.searchCommandMode !== 'translate') {
            this.enterSearchCommandMode('translate');
        }

        const pair = this.resolveLanguagePair((pairRaw || '').replace(/→/g, '-'));
        if (!pair) {
            this.showNotification('语言对不可用：' + pairRaw);
            return;
        }

        this.translateSelectedPair = pair;
        this.updateSearchModeChip();
        this.refreshSearchDropdownPanels();

        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.focus();
        }
        this.showNotification('已选择 ' + pair.from.label + '→' + pair.to.label);
    },
    getWebHistory() {
        try {
            return JSON.parse(localStorage.getItem('oooWebCommandHistory') || '[]') || [];
        } catch (e) {
            return [];
        }
    },
    setWebHistory(list) {
        localStorage.setItem('oooWebCommandHistory', JSON.stringify(list || []));
    },
    recordWebHistory(urlText) {
        let parsed;
        try {
            parsed = new URL(urlText);
        } catch (e) {
            return;
        }

        let list = this.getWebHistory();
        const rest = (parsed.pathname === '/' && !parsed.search) ? '' : parsed.pathname + parsed.search;
        const key = parsed.origin + (rest || '/');

        list = list.filter(item => item && item.key !== key);
        list.unshift({
            key: key,
            host: parsed.host.replace(/^www\./, ''),
            rest: rest
        });
        if (list.length > 12) {
            list.length = 12;
        }
        this.setWebHistory(list);
    },
    applyWebHistoryEntry(entry) {
        if (!entry || !entry.host) return;

        if (this.searchCommandMode !== 'web') {
            this.enterSearchCommandMode('web');
        }

        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = entry.host + (entry.rest || '');
            const clearBtn = document.querySelector('.search-clear-btn');
            if (clearBtn) {
                clearBtn.style.display = 'flex';
            }
            searchInput.focus();
        }
    },
    async executeTranslateModeQuery(rawText) {
        const text = (rawText || '').trim();

        if (!text) return;

        if (!this.translateSelectedPair) {
            const inlineMatch = text.match(/^(\S+)\s+([\s\S]+)$/);
            if (inlineMatch) {
                const inlinePair = this.resolveLanguagePair(inlineMatch[1]);
                if (inlinePair) {
                    this.translateSelectedPair = inlinePair;
                    this.updateSearchModeChip();
                    await this.runTranslateFlow(inlineMatch[2], inlinePair);
                    return;
                }
            }
            this.showNotification('请输入语言对和文本，例如：sc-jp 你好');
            return;
        }

        await this.runTranslateFlow(text, this.translateSelectedPair);
    },
    async runTranslateFlow(text, pair) {
        try {
            const result = await this.translateText(text, pair.from, pair.to);
            if (!result) {
                throw new Error('未获得翻译结果');
            }

            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.value = result;
                const clearBtn = document.querySelector('.search-clear-btn');
                if (clearBtn) {
                    clearBtn.style.display = 'flex';
                }
            }
            this.recordTranslateHistory(pair.from, pair.to);
            this.exitSearchCommandMode(false);

            navigator.clipboard.writeText(result).then(() => {
                this.showNotification('翻译完成，结果已输出并复制');
            }).catch(() => {
                this.showNotification('翻译完成，但复制到剪贴板失败');
            });
        } catch (err) {
            this.showNotification('翻译失败：' + err.message);
        }
    },
    async executeSlashCommand(trimmedQuery) {
        const match = trimmedQuery.slice(1).match(/^(\S*)(?:\s+([\s\S]*))?$/);
        if (!match) return;

        const word = match[1] || '';

        if (this.isWebCommand(word)) {
            const url = (match[2] || '').replace(/\s+/g, '');
            if (!url) {
                this.showNotification('请输入网址，例如：/w google.com');
                return;
            }
            this.openExternalUrl(url);
            return;
        }

        if (this.isTranslateCommand(word)) {
            const rest = (match[2] || '').trim();
            if (!rest) {
                this.showNotification('请输入语言对和文本，例如：/t sc-jp 你好');
                return;
            }

            const parts = rest.match(/^(\S+)\s+([\s\S]+)$/);
            if (!parts) {
                if (/^[^\s]+-[^\s]+$/.test(rest)) {
                    this.showNotification('请输入要翻译的文本');
                } else {
                    this.showNotification('格式：/t 源语言-目标语言 文本，例如：/t sc-jp 你好');
                }
                return;
            }

            const pair = this.resolveLanguagePair(parts[1]);
            if (!pair) {
                const sides = parts[1].toLowerCase().split('-');
                this.showNotification('不支持的语言：' + sides.join(' / '));
                return;
            }

            await this.runTranslateFlow(parts[2], pair);
            return;
        }

        this.showNotification('未知命令：“/' + word + '”，可用命令：web(w)、translate(t)');
    },
    resolveTranslateLanguage(rawCode) {
        const code = (rawCode || '').toLowerCase().trim();
        if (!code) return null;

        // 语言表已提取到 translate-shared.js，与侧边栏面板共用（Stage 9）
        return TRANSLATE_LANGUAGES.find(entry => entry.key === code || entry.aliases.includes(code)) || null;
    },
    async translateText(text, fromEntry, toEntry) {
        if (this.currentEngine === 'bing') {
            try {
                return await this.fetchBingTranslate(text, fromEntry.m, toEntry.m, false);
            } catch (err) {
                console.warn('[搜索框翻译] Microsoft 翻译失败，回退到 Google 翻译:', err.message);
                this.showNotification('Microsoft 翻译不可用，已改用 Google 翻译');
            }
        }
        return await this.fetchGoogleTranslate(text, fromEntry.g, toEntry.g);
    },
    async slashFetch(url, options) {
        try {
            return await fetch(url, options);
        } catch (err) {
            if (typeof ProxyManager !== 'undefined' && ProxyManager.isProxyEnabled()) {
                return await ProxyManager.proxiedFetch(url, options);
            }
            throw err;
        }
    },
    async fetchGoogleTranslate(text, sl, tl) {
        const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=' +
            encodeURIComponent(sl) + '&tl=' + encodeURIComponent(tl) + '&dt=t&q=' + encodeURIComponent(text);

        const response = await this.slashFetch(url);
        if (!response.ok) {
            throw new Error('Google 翻译服务响应异常 (HTTP ' + response.status + ')');
        }

        const data = await response.json();
        if (!Array.isArray(data) || !Array.isArray(data[0])) {
            throw new Error('Google 翻译结果解析失败');
        }

        return data[0].map(segment => (segment && segment[0]) ? segment[0] : '').join('');
    },
    async getBingTranslateAuth(forceRefresh = false) {
        if (!forceRefresh) {
            try {
                const cached = JSON.parse(localStorage.getItem('oooBingTranslateAuth') || 'null');
                if (cached && cached.token && cached.ig && Date.now() - cached.ts < 20 * 60 * 1000) {
                    return cached;
                }
            } catch (e) { /* 缓存损坏则重新获取 */ }
        }

        const response = await this.slashFetch('https://www.bing.com/');
        const html = await response.text();

        const igMatch = html.match(/IG:"([^"]+)"/);
        const tokenMatch = html.match(/params_AbusePreventionHelper\s*=\s*\[\s*\d+\s*,\s*"([^"]+)"/);

        if (!igMatch || !tokenMatch) {
            throw new Error('无法获取 Microsoft 翻译凭证');
        }

        const auth = { ig: igMatch[1], token: tokenMatch[1], ts: Date.now() };
        localStorage.setItem('oooBingTranslateAuth', JSON.stringify(auth));
        return auth;
    },
    async fetchBingTranslate(text, fromCode, toCode, forceNewAuth) {
        try {
            const auth = await this.getBingTranslateAuth(!!forceNewAuth);

            const body = new URLSearchParams({
                from: fromCode,
                to: toCode,
                text: text,
                token: auth.token,
                key: auth.ig
            }).toString();

            const response = await this.slashFetch('https://www.bing.com/ttranslatev3?isTanslateReq=true', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body
            });

            if (!response.ok) {
                throw new Error('Microsoft 翻译服务响应异常 (HTTP ' + response.status + ')');
            }

            const data = await response.json();
            if (Array.isArray(data) && data[0] && Array.isArray(data[0].translations)) {
                return data[0].translations.map(item => item.text || '').join('');
            }
            throw new Error('Microsoft 翻译结果解析失败');
        } catch (err) {
            // 凭证失效等情况：强制刷新一次后重试
            if (!forceNewAuth) {
                return await this.fetchBingTranslate(text, fromCode, toCode, true);
            }
            throw err;
        }
    },
    performGoogleLucky() {
        const searchInput = document.getElementById('search-input');
        const query = searchInput.value.trim();

        if (!query) {
            this.showNotification('请输入搜索内容');
            return;
        }

        this.addToSearchHistory(query);

        const luckyUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&btnI=1`;
        window.location.href = luckyUrl;
    },
};

// ==== main/Script/core/storage-sync.js ====
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

// ==== main/Script/core/mixins/SettingsMixin.js ====
// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

// [bundled] import { … } from '../proxy.js'
// [bundled] import { … } from '../storage-sync.js'

const SettingsMixin = {
    syncSettingsPageToggles() {
        // 主开关状态派生后再同步 UI
        this.syncSimpleVisualMode();
        const dyn = document.getElementById('dynamic-blur-toggle');
        if (dyn) dyn.checked = this.settings.dynamicBlur;
        const enh = document.getElementById('enhanced-display-toggle');
        if (enh) enh.checked = this.settings.enhancedDisplay;
        const enhancedDisplayGroup = document.getElementById('enhanced-display-group');
        if (enhancedDisplayGroup) {
            enhancedDisplayGroup.style.display = this.settings.dynamicBlur ? 'block' : 'none';
        }
        const wp = document.getElementById('persistent-wallpaper-toggle');
        if (wp) wp.checked = this.settings.persistentWallpaper;
        const wd = document.getElementById('wallpaper-dim-toggle');
        if (wd) wd.checked = this.settings.wallpaperDarkDim;
        const sh = document.getElementById('search-history-toggle');
        if (sh) sh.checked = this.settings.searchHistory;
        const ss = document.getElementById('search-suggestions-toggle');
        if (ss) ss.checked = this.settings.searchSuggestions;
        // 固定侧边栏主开关与两个子开关
        const fs = document.getElementById('fix-sidebar-toggle');
        if (fs) fs.checked = this.settings.fixSidebarEnabled;
        const fh = document.getElementById('fix-sidebar-homepage-toggle');
        if (fh) { fh.checked = this.settings.fixSidebarEnabled && this.settings.fixSidebarHomepage; }
        const fw = document.getElementById('fix-sidebar-wallpaper-toggle');
        if (fw) { fw.checked = this.settings.fixSidebarEnabled && this.settings.fixSidebarWallpaper; }
        const fsHomepageGroup = document.getElementById('fix-homepage-group');
        if (fsHomepageGroup) fsHomepageGroup.style.display = this.settings.fixSidebarEnabled ? 'block' : 'none';
        const fsWallpaperGroup = document.getElementById('fix-wallpaper-group');
        if (fsWallpaperGroup) fsWallpaperGroup.style.display = this.settings.fixSidebarEnabled ? 'block' : 'none';
        // 侧边栏功能：摘要文字与（如打开的）右面板配置视图
        this.syncSidePanelSelectDisplay();
        const el = document.getElementById('engine-lock-toggle');
        if (el) el.checked = this.settings.engineLocked;
        const hn = document.getElementById('hide-notifications-toggle');
        if (hn) hn.checked = this.settings.hideNotifications;
        const hip = document.getElementById('hide-info-popup-toggle');
        if (hip) hip.checked = this.settings.hideInfoPopup.enabled;
        // 简洁视觉效果主开关与三个子开关（主开关开启时才显示子开关）
        const sv = document.getElementById('simple-visual-toggle');
        if (sv) sv.checked = this.settings.simpleVisualMode;
        const svSubGroups = [
            document.getElementById('simple-notifications-group'),
            document.getElementById('simple-infopopup-group'),
            document.getElementById('simple-badge-group')
        ];
        svSubGroups.forEach(group => {
            if (group) group.style.display = this.settings.simpleVisualMode ? 'block' : 'none';
        });
        const hb = document.getElementById('hidden-badge-toggle');
        if (hb) hb.checked = this.settings.hiddenBadge;
        const op = document.getElementById('ocp-player-toggle');
        if (op) op.checked = this.settings.ocpPlayerEnabled;
        this.updateHideInfoPopupLabel();
        this.syncStatusBarUI();
        this.syncWidgetPanelUI();
        this.syncBadgeOpenMethodUI();
    },
    async loadSettings() {
        const isFirstRun = localStorage.getItem('oooInterfaceFirstRun');

        if (isFirstRun === null) {
            // 首次运行，使用出厂预设
            this.isFirstRun = true;
            localStorage.setItem('oooInterfaceFirstRun', 'false');
            this.showWelcomeScreen();
        } else {
            this.isFirstRun = false;
        }

        // 优先从 chrome.storage.local 加载，回退到 localStorage（兼容旧版）
        let savedSettings = null;
        try {
            const result = await chrome.storage.local.get('oooInterfaceSettings');
            savedSettings = result.oooInterfaceSettings || null;
        } catch (e) {
            console.warn('chrome.storage.local 读取失败，尝试 localStorage:', e);
        }
        if (!savedSettings) {
            const lsRaw = localStorage.getItem('oooInterfaceSettings');
            if (lsRaw) {
                try {
                    savedSettings = JSON.parse(lsRaw);
                    // 迁移到 chrome.storage.local
                    chrome.storage.local.set({ oooInterfaceSettings: savedSettings });
                } catch (e) {
                    console.error('localStorage 解析失败:', e);
                }
            }
        }

        if (savedSettings) {
            try {
                this.settings = this.mergeSettings(savedSettings);
            } catch (error) {
                console.error('设置加载失败，使用默认设置:', error);
                this.settings = JSON.parse(JSON.stringify(this.defaultSettings));
            }
        }

        // 初始化高级视觉效果自动启用标志
        this._dynamicBlurAutoEnabled = this.settings.enhancedDisplay && this.settings.dynamicBlur;

        // 绑定底部铭牌的双击/右键动作（依设置决定，幂等）
        this.setupBadgeOpenMethod();

        // 绑定 OCP 播控的 hover 显隐与播放按钮（幂等）
        this.setupOcpPlayer();
    },
    mergeSettings(savedSettings) {
        const result = JSON.parse(JSON.stringify(this.defaultSettings));

        // 合并基础设置
        if (savedSettings.font) result.font = savedSettings.font;
        if (savedSettings.logo) result.logo = savedSettings.logo;
        if (savedSettings.logoType) result.logoType = savedSettings.logoType;
        if (savedSettings.textLogo) result.textLogo = savedSettings.textLogo;
        if (savedSettings.wallpaper) result.wallpaper = savedSettings.wallpaper;
        if (savedSettings.wallpaperUrl !== undefined) result.wallpaperUrl = savedSettings.wallpaperUrl;
        if (savedSettings.wallpaperCompressVersion !== undefined) result.wallpaperCompressVersion = savedSettings.wallpaperCompressVersion;
        if (savedSettings.dynamicBlur !== undefined) result.dynamicBlur = savedSettings.dynamicBlur;
        if (savedSettings.persistentWallpaper !== undefined) result.persistentWallpaper = savedSettings.persistentWallpaper;
        if (savedSettings.searchHistory !== undefined) result.searchHistory = savedSettings.searchHistory;
        if (savedSettings.searchSuggestions !== undefined) result.searchSuggestions = savedSettings.searchSuggestions;
        if (savedSettings.contextMenuStyle !== undefined) result.contextMenuStyle = savedSettings.contextMenuStyle;
        if (savedSettings.hideInfoPopup !== undefined) {
            if (typeof savedSettings.hideInfoPopup === 'boolean') {
                result.hideInfoPopup = { enabled: savedSettings.hideInfoPopup, type: savedSettings.hideInfoPopup ? 'permanent' : null, timestamp: savedSettings.hideInfoPopup ? Date.now() : null };
            } else if (typeof savedSettings.hideInfoPopup === 'object') {
                result.hideInfoPopup = { enabled: savedSettings.hideInfoPopup.enabled || false, type: savedSettings.hideInfoPopup.type || null, timestamp: savedSettings.hideInfoPopup.timestamp || null };
            }
        }

        if (savedSettings.searchHistoryItems && Array.isArray(savedSettings.searchHistoryItems)) {
            result.searchHistoryItems = savedSettings.searchHistoryItems.filter(item => typeof item === 'string' && item.trim());
        }

        if (savedSettings.engineLocked !== undefined) result.engineLocked = savedSettings.engineLocked;

        if (savedSettings.developerMode !== undefined) result.developerMode = savedSettings.developerMode;
        if (savedSettings.proxyPort !== undefined) result.proxyPort = savedSettings.proxyPort;
        if (savedSettings.fontSize !== undefined) result.fontSize = savedSettings.fontSize;
        if (savedSettings.fontWeight !== undefined) result.fontWeight = savedSettings.fontWeight;
        if (savedSettings.searchBoxHeight !== undefined) result.searchBoxHeight = savedSettings.searchBoxHeight;
        if (savedSettings.enhancedDisplay !== undefined) result.enhancedDisplay = savedSettings.enhancedDisplay;
        if (savedSettings.wallpaperScale !== undefined) result.wallpaperScale = savedSettings.wallpaperScale;
        if (savedSettings.wallpaperDarkDim !== undefined) result.wallpaperDarkDim = savedSettings.wallpaperDarkDim;
        if (savedSettings.wallpaperFill !== undefined) result.wallpaperFill = savedSettings.wallpaperFill;
        if (savedSettings.colorScheme !== undefined) result.colorScheme = savedSettings.colorScheme;
        if (savedSettings.customPrimaryColor !== undefined) result.customPrimaryColor = savedSettings.customPrimaryColor;
        if (savedSettings.customSecondaryColor !== undefined) result.customSecondaryColor = savedSettings.customSecondaryColor;
        if (savedSettings.customGradientEnabled !== undefined) result.customGradientEnabled = savedSettings.customGradientEnabled;
        if (savedSettings.customGradientStart !== undefined) result.customGradientStart = savedSettings.customGradientStart;
        if (savedSettings.customGradientEnd !== undefined) result.customGradientEnd = savedSettings.customGradientEnd;
        if (savedSettings.customColors !== undefined) result.customColors = savedSettings.customColors;
        if (savedSettings.activeCustomColorIndex !== undefined) result.activeCustomColorIndex = savedSettings.activeCustomColorIndex;
        // 旧数据迁移：如果旧版有 customPrimaryColor 且 customColors 为空，迁移到 customColors[0]
        if (savedSettings.customPrimaryColor && savedSettings.customPrimaryColor.trim() && (!result.customColors || result.customColors.length === 0)) {
            result.customColors = [{
                name: '我的配色',
                primaryColor: savedSettings.customPrimaryColor || '',
                secondaryColor: savedSettings.customSecondaryColor || '',
                gradientEnabled: savedSettings.customGradientEnabled || false,
                gradientStart: savedSettings.customGradientStart !== undefined ? savedSettings.customGradientStart : 0,
                gradientEnd: savedSettings.customGradientEnd !== undefined ? savedSettings.customGradientEnd : 100
            }];
            if (savedSettings.colorScheme === 'custom') {
                result.activeCustomColorIndex = 0;
            }
        }
        if (savedSettings.badgeDblClickAction !== undefined) {
            result.badgeDblClickAction = this.normalizeBadgeAction(savedSettings.badgeDblClickAction);
        }
        if (savedSettings.badgeContextMenuAction !== undefined) {
            result.badgeContextMenuAction = this.normalizeBadgeAction(savedSettings.badgeContextMenuAction);
        }
        // 旧版 badgeOpenMethod 迁移：both / dblclick / contextmenu / none
        if (savedSettings.badgeDblClickAction === undefined && savedSettings.badgeContextMenuAction === undefined
            && savedSettings.badgeOpenMethod !== undefined) {
            const legacy = savedSettings.badgeOpenMethod;
            result.badgeDblClickAction = (legacy === 'none' || legacy === 'contextmenu') ? 'none' : 'settings';
            result.badgeContextMenuAction = (legacy === 'none' || legacy === 'dblclick') ? 'none' : 'settings';
        }
        if (savedSettings.bingRefreshEveryTime !== undefined) result.bingRefreshEveryTime = savedSettings.bingRefreshEveryTime;
        if (savedSettings.bingRefreshInterval !== undefined) result.bingRefreshInterval = savedSettings.bingRefreshInterval;
        if (savedSettings.quickAccessSidebar !== undefined) result.quickAccessSidebar = savedSettings.quickAccessSidebar;
        if (savedSettings.showQuickLinkIcons !== undefined) result.showQuickLinkIcons = savedSettings.showQuickLinkIcons;
        if (savedSettings.fixSidebarEnabled !== undefined) result.fixSidebarEnabled = savedSettings.fixSidebarEnabled;
        if (savedSettings.fixSidebarHomepage !== undefined) result.fixSidebarHomepage = savedSettings.fixSidebarHomepage;
        if (savedSettings.fixSidebarWallpaper !== undefined) result.fixSidebarWallpaper = savedSettings.fixSidebarWallpaper;
        if (savedSettings.wallpaperBadgeHdr !== undefined) result.wallpaperBadgeHdr = savedSettings.wallpaperBadgeHdr;
        if (savedSettings.wallpaperBadgeHdrHomepage !== undefined) result.wallpaperBadgeHdrHomepage = savedSettings.wallpaperBadgeHdrHomepage;
        if (savedSettings.wallpaperBadgeLive !== undefined) result.wallpaperBadgeLive = savedSettings.wallpaperBadgeLive;
        if (savedSettings.wallpaperBadgeLiveHomepage !== undefined) result.wallpaperBadgeLiveHomepage = savedSettings.wallpaperBadgeLiveHomepage;

        // 侧边栏面板功能
        if (savedSettings.sidePanelEnabled !== undefined) result.sidePanelEnabled = savedSettings.sidePanelEnabled;
        if (savedSettings.sidePanelShowWidgets !== undefined) result.sidePanelShowWidgets = savedSettings.sidePanelShowWidgets;
        if (savedSettings.sidePanelShowQuickLinks !== undefined) result.sidePanelShowQuickLinks = savedSettings.sidePanelShowQuickLinks;
        if (savedSettings.sidePanelShowSearch !== undefined) result.sidePanelShowSearch = savedSettings.sidePanelShowSearch;
        if (savedSettings.sidePanelShowEngineButtons !== undefined) result.sidePanelShowEngineButtons = savedSettings.sidePanelShowEngineButtons;
        if (savedSettings.sidePanelWallpaperEnabled !== undefined) result.sidePanelWallpaperEnabled = savedSettings.sidePanelWallpaperEnabled;
        if (savedSettings.sidePanelWallpaperSync !== undefined) result.sidePanelWallpaperSync = savedSettings.sidePanelWallpaperSync;
        if (savedSettings.sidePanelWallpaperUrl !== undefined) result.sidePanelWallpaperUrl = savedSettings.sidePanelWallpaperUrl;
        if (savedSettings.sidePanelWidgetsSync !== undefined) result.sidePanelWidgetsSync = savedSettings.sidePanelWidgetsSync;
        if (savedSettings.sidePanelWidgetPanel !== undefined) result.sidePanelWidgetPanel = savedSettings.sidePanelWidgetPanel;
        if (savedSettings.sidePanelQuickLinksSync !== undefined) result.sidePanelQuickLinksSync = savedSettings.sidePanelQuickLinksSync;
        if (savedSettings.sidePanelQuickLinks !== undefined) result.sidePanelQuickLinks = savedSettings.sidePanelQuickLinks;
        if (savedSettings.sidePanelSearchSync !== undefined) result.sidePanelSearchSync = savedSettings.sidePanelSearchSync;
        if (savedSettings.sidePanelSearchBoxHeight !== undefined) result.sidePanelSearchBoxHeight = savedSettings.sidePanelSearchBoxHeight;
        if (savedSettings.sidePanelBuiltinOpen !== undefined) result.sidePanelBuiltinOpen = savedSettings.sidePanelBuiltinOpen;
        if (savedSettings.hiddenBadge !== undefined) result.hiddenBadge = savedSettings.hiddenBadge;
        if (savedSettings.ocpPlayerEnabled !== undefined) result.ocpPlayerEnabled = savedSettings.ocpPlayerEnabled;

        // 合并小组件面板配置
        // enabled 字段已废弃（开关已移除，面板显示完全由列表是否为空决定），固定为 true
        if (savedSettings.widgetPanel && typeof savedSettings.widgetPanel === 'object') {
            result.widgetPanel = {
                enabled: true,
                widgets: Array.isArray(savedSettings.widgetPanel.widgets)
                    ? savedSettings.widgetPanel.widgets.filter(w =>
                        w && typeof w === 'object' && w.type && w.id
                      )
                    : []
            };
        }
        if (savedSettings.statusBarEnabled !== undefined) result.statusBarEnabled = savedSettings.statusBarEnabled;
        if (savedSettings.showStatusBarSeconds !== undefined) result.showStatusBarSeconds = savedSettings.showStatusBarSeconds;
        if (savedSettings.hideNotifications !== undefined) result.hideNotifications = savedSettings.hideNotifications;
        if (savedSettings.shortcutsEnabled !== undefined) result.shortcutsEnabled = savedSettings.shortcutsEnabled;
        if (savedSettings.contextMenuCustomItems && Array.isArray(savedSettings.contextMenuCustomItems)) {
            result.contextMenuCustomItems = savedSettings.contextMenuCustomItems.filter(
                item => ['enhanced-display-toggle', 'wallpaper-toggle', 'search-history-toggle', 'search-suggestions-toggle', 'engine-lock-toggle', 'hide-notifications-toggle', 'hide-info-popup-toggle'].includes(item)
            );
        }

        // 合并主题相关字段
        if (savedSettings.theme !== undefined) result.theme = savedSettings.theme;
        if (savedSettings.themeEnabled !== undefined) result.themeEnabled = savedSettings.themeEnabled;
        if (savedSettings.themeColorScheme !== undefined) result.themeColorScheme = savedSettings.themeColorScheme;
        if (savedSettings.themeAspects !== undefined) result.themeAspects = savedSettings.themeAspects;

        // 合并自定义Logo列表
        if (savedSettings.customLogos && Array.isArray(savedSettings.customLogos)) {
            result.customLogos = savedSettings.customLogos.filter(logo =>
                logo && logo.name && logo.data
            );
        }

        // 合并自定义字体列表
        if (savedSettings.customFonts && Array.isArray(savedSettings.customFonts)) {
            result.customFonts = savedSettings.customFonts.filter(font =>
                font && font.name && font.data
            );
        }

        // 合并自定义壁纸列表
        if (savedSettings.customWallpapers && Array.isArray(savedSettings.customWallpapers)) {
            result.customWallpapers = savedSettings.customWallpapers.filter(wp =>
                wp && wp.name && wp.data
            );
        }

        // 合并自定义主题列表
        if (savedSettings.customThemes && Array.isArray(savedSettings.customThemes)) {
            result.customThemes = savedSettings.customThemes.filter(ct =>
                ct && ct.key && ct.data && ct.data.info && ct.data.details
            );
        }

        // 合并快速访问链接列表
        if (savedSettings.quickLinks && Array.isArray(savedSettings.quickLinks)) {
            result.quickLinks = savedSettings.quickLinks.filter(link =>
                link && link.name && link.url
            );
        }

        // 恢复用户更改Logo标记
        if (savedSettings.userChangedLogo !== undefined) {
            this.userChangedLogo = savedSettings.userChangedLogo;
        }

        // 简洁视觉效果主开关由子开关状态派生（所有恢复完成后计算，兼容旧版本数据）
        result.simpleVisualMode = !!(result.hideNotifications
            || (result.hideInfoPopup && result.hideInfoPopup.enabled)
            || result.hiddenBadge);

        return result;
    },
    showWelcomeScreen() {
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            welcomeScreen.style.display = 'flex';
        }
    },
    hideWelcomeScreen() {
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            welcomeScreen.style.display = 'none';
        }
    },
    saveSettings() {
        const settingsToSave = {
            ...this.settings,
            userChangedLogo: this.userChangedLogo
        };
        // 侧边栏子视图数据交换期间：快照里把交换出去的键还原为原始引用，
        // 避免把独立数据序列化进主槽位（内存引用在退出交换时本就会恢复）
        if (this._spSwap) {
            if (this._spSwap.quickLinks !== undefined) settingsToSave.quickLinks = this._spSwap.quickLinks;
            if (this._spSwap.widgetPanel !== undefined) settingsToSave.widgetPanel = this._spSwap.widgetPanel;
        }
        try {
            const result = chrome.storage.local.set({ oooInterfaceSettings: settingsToSave });
            if (result && typeof result.catch === 'function') {
                result.catch(error => {
                    console.warn('chrome.storage 保存失败，尝试 localStorage:', error);
                    try {
                        localStorage.setItem('oooInterfaceSettings', JSON.stringify(settingsToSave));
                    } catch (e) {
                        console.error('localStorage 保存也失败:', e);
                        this.showNotification('保存设置失败');
                    }
                });
            }
        } catch (error) {
            console.warn('chrome.storage 保存失败，尝试 localStorage:', error);
            try {
                localStorage.setItem('oooInterfaceSettings', JSON.stringify(settingsToSave));
            } catch (e) {
                console.error('localStorage 保存也失败:', e);
                this.showNotification('保存设置失败');
            }
        }
    },
    setupSettingsSync() {
        try {
            if (!chrome.storage || !chrome.storage.onChanged) return;
        } catch (e) {
            return;
        }
        // 触发重应用的门控键表：与侧边栏面板共用 storage-sync.js（Stage 9）。
        // 其中 wallpaper / wallpaperUrl 是此前这里漏掉的，补上后主页面换壁纸
        // 也能触发侧边栏重应用。语义与并集理由见该模块头部说明。

        let syncTimer = null;
        let pendingValue = null;

        chrome.storage.onChanged.addListener((changes, areaName) => {
            if (areaName !== 'local' || !changes.oooInterfaceSettings) return;
            const next = changes.oooInterfaceSettings.newValue;
            if (!next) return;

            const relevant = SYNC_KEYS.some(key => JSON.stringify(next[key]) !== JSON.stringify(this.settings[key]));
            if (!relevant) return;

            pendingValue = next;
            clearTimeout(syncTimer);
            syncTimer = setTimeout(() => {
                // 完整回填：保留全部已存键（含壁纸/字体/小组件数据），仅用默认值补缺，避免丢设置
                this.settings = Object.assign({}, this.defaultSettings, pendingValue);
                // 侧边栏子视图交换期间：重挂交换，保证管理视图继续作用于独立数据
                if (this._spSwap) {
                    if (this._spSwap.quickLinks !== undefined) this.settings.quickLinks = this.settings.sidePanelQuickLinks;
                    if (this._spSwap.widgetPanel !== undefined) this.settings.widgetPanel = this.settings.sidePanelWidgetPanel;
                }
                this._dynamicBlurAutoEnabled = this.settings.enhancedDisplay && this.settings.dynamicBlur;
                this.applySettings();
                this.updateContextMenuIcons();
                this.syncSettingsPageToggles();
            }, 150);
        });
    },
    toggleSearchHistorySetting() {
        this.settings.searchHistory = !this.settings.searchHistory;
        this.saveSettings();
        this.updateContextMenuIcons();
        this.syncSettingsPageToggles();
        this.showNotification(this.settings.searchHistory ? '搜索历史：开启' : '搜索历史：关闭');
    },
    toggleSearchSuggestionsSetting() {
        this.settings.searchSuggestions = !this.settings.searchSuggestions;
        this.saveSettings();
        this.updateContextMenuIcons();
        this.syncSettingsPageToggles();
        this.showNotification(this.settings.searchSuggestions ? '热搜词建议：开启' : '热搜词建议：关闭');
    },
    // 引擎锁定的唯一写入口：设置页开关与右键菜单开关都走这里，
    // 保证「锁定时把当前引擎写进 localStorage」这一步不会被绕过（此前设置页只改 settings，
    // 走「应用」提交时不会写 oooEngineLocked，锁定的引擎丢失）。
    setEngineLock(enabled) {
        this.settings.engineLocked = !!enabled;
        if (enabled) {
            localStorage.setItem('oooEngineLocked', this.currentEngine);
        } else {
            localStorage.removeItem('oooEngineLocked');
        }
        this.saveSettings();
        this.updateContextMenuIcons();
        this.syncSettingsPageToggles();
    },
    toggleEngineLockSetting() {
        this.setEngineLock(!this.settings.engineLocked);
        this.showNotification(this.settings.engineLocked ? '引擎锁定：开启' : '引擎锁定：关闭');
    },
    toggleWallpaperSetting() {
        this.settings.persistentWallpaper = !this.settings.persistentWallpaper;
        this.applySettings();
        this.saveSettings();
        this.updateContextMenuIcons();
        this.syncSettingsPageToggles();
        this.showNotification(this.settings.persistentWallpaper ? '壁纸常显示：开启' : '壁纸常显示：关闭');
    },
    toggleEnhancedDisplaySetting() {
        this.settings.enhancedDisplay = !this.settings.enhancedDisplay;
        if (this.settings.enhancedDisplay && !this.settings.dynamicBlur) {
            this.settings.dynamicBlur = true;
            this._dynamicBlurAutoEnabled = true;
        } else if (!this.settings.enhancedDisplay && this._dynamicBlurAutoEnabled) {
            this.settings.dynamicBlur = false;
            this._dynamicBlurAutoEnabled = false;
        }
        this.applySettings();
        this.saveSettings();
        this.updateContextMenuIcons();
        // 直接同步设置页复选框（移除监听器避免循环触发）
        const cb = document.getElementById('enhanced-display-toggle');
        if (cb) {
            cb.removeEventListener('change', this._enhancedDisplayChangeHandler);
            cb.checked = this.settings.enhancedDisplay;
            cb.addEventListener('change', this._enhancedDisplayChangeHandler);
        }
        // 同步动态模糊复选框和增强显示分组可见性
        const dyn = document.getElementById('dynamic-blur-toggle');
        if (dyn) dyn.checked = this.settings.dynamicBlur;
        const group = document.getElementById('enhanced-display-group');
        if (group) group.style.display = this.settings.dynamicBlur ? 'block' : 'none';
        this.showNotification(this.settings.enhancedDisplay ? '高级视觉效果：开启' : '高级视觉效果：关闭');
    },
    openSettings(source) {
        if (this.contextMenu) {
            this.hideContextMenu();
        }

        const modal = document.getElementById('settings-modal');

        // 记录是否需要切换回常规模式
        const needRestoreHomepage = this.isScrolled;

        // 先设置display属性，让浏览器渲染元素
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';

        // 禁用主页面滚动
        document.body.style.overflow = 'hidden';

        // 清除上一次的来源标记类
        modal.classList.remove('badge-source');
        modal.classList.remove('context-source');

        // 如果开启了高级视效，给 modal 添加 blur-effect 类
        if (this.settings.dynamicBlur) {
            modal.classList.add('blur-effect');
        } else {
            modal.classList.remove('blur-effect');
        }

        // 添加鼠标滚轮事件监听器，阻止事件冒泡
        this.modalScrollHandler = (e) => {
            // 如果事件目标在模态框内，阻止事件传播到主页面
            if (e.target.closest('.modal')) {
                e.stopPropagation();
            }
        };
        document.addEventListener('wheel', this.modalScrollHandler, { passive: false });

        // 更新设置界面
        this.updateSettingsUI();

        // 更新自定义Logo列表
        this.updateCustomLogosList();

        // 更新快速访问链接列表
        this.updateQuickLinksList();

        // 更新开发者模式UI
        this.updateDeveloperModeUI();

        // 根据dynamicBlur设置决定是否添加动画
        const modalContent = modal.querySelector('.modal-content');
        if (this.settings.dynamicBlur) {
            // 移除no-animation类，启用动画
            if (modalContent) modalContent.classList.remove('no-animation');
            // 根据来源添加标识类，用于差异化动画
            if (source === 'badge') {
                modal.classList.add('badge-source');
            } else {
                modal.classList.add('context-source');
            }
            // 使用requestAnimationFrame确保动画在下一帧触发，更加流畅
            requestAnimationFrame(() => {
                // 从铭牌打开：在渲染前计算铭牌相对弹窗的实际位置
                if (source === 'badge') {
                    this.calculateBadgeOrigin(modal);
                }
                requestAnimationFrame(() => {
                    modal.classList.add('show');

                    // 设置弹窗开始显示后，再切换回常规模式
                    if (needRestoreHomepage) {
                        this.restoreHomepage(false);
                    }
                });
            });
        } else {
            // 添加no-animation类，禁用动画
            if (modalContent) modalContent.classList.add('no-animation');
            // 无动画时仍记录来源，供关闭动画使用
            if (source === 'badge') {
                modal.classList.add('badge-source');
                this.calculateBadgeOrigin(modal);
            }
            // 直接添加show类，无动画
            modal.classList.add('show');

            // 立即切换回常规模式
            if (needRestoreHomepage) {
                this.restoreHomepage(true);
            }
        }

        // 根据当前Logo类型显示/隐藏文字Logo输入框
        const textLogoItem = document.querySelector('.select-item-text-logo');
        if (this.settings.logo === 'text-logo') {
            document.getElementById('text-logo-inline-group').style.display = 'flex';
            if (textLogoItem) textLogoItem.classList.add('selected');
        } else {
            document.getElementById('text-logo-inline-group').style.display = 'none';
            if (textLogoItem) textLogoItem.classList.remove('selected');
        }

        // 根据窗口宽度调整按钮位置
        this.updateSettingsButtonsPosition();
    },
    updateSettingsUI() {
        const fontSelect = document.getElementById('font-select');

        // 保存当前选中的字体值
        const selectedFont = this.settings.font;

        // 设置选中的值
        fontSelect.value = selectedFont;

        // 更新字体选择框的显示文本
        const fontSelectSelected = document.getElementById('font-select-selected');
        if (fontSelectSelected) {
            const themeInfo = this.getThemeDisplayInfo();
            if (themeInfo && themeInfo.fontName) {
                fontSelectSelected.textContent = themeInfo.themeName + '：' + themeInfo.fontName;
            } else {
                const fontOption = fontSelect.querySelector(`option[value="${selectedFont}"]`);
                fontSelectSelected.textContent = fontOption ? fontOption.textContent : selectedFont;
            }
        }

        // 更新其他设置
        const logoSelect = document.getElementById('logo-select');
        logoSelect.value = this.settings.logo;
        document.getElementById('text-logo-input').value = this.settings.textLogo || '';

        // 更新Logo选择框的显示文本
        const logoSelectSelected = document.getElementById('logo-select-selected');
        if (logoSelectSelected) {
            const themeInfo = this.getThemeDisplayInfo();
            if (themeInfo && themeInfo.logoName) {
                logoSelectSelected.textContent = themeInfo.themeName + '：' + themeInfo.logoName;
            } else {
                const logoOption = logoSelect.querySelector(`option[value="${this.settings.logo}"]`);
                if (logoOption) logoSelectSelected.textContent = logoOption.textContent;
            }
        }

        // 更新壁纸选择
        let wallpaperValue = 'default';
        if (this.settings.wallpaper === 'url') {
            wallpaperValue = 'url';
        } else if (this.settings.wallpaper === 'bing') {
            wallpaperValue = 'bing';
        } else if (this.settings.wallpaper !== 'default') {
            // 检查是否是自定义上传的壁纸
            const customWallpaper = this.settings.customWallpapers.find(wp => wp.data === this.settings.wallpaper);
            if (customWallpaper) {
                wallpaperValue = customWallpaper.name;
            } else {
                wallpaperValue = 'default';
            }
        }

        const wallpaperSelect = document.getElementById('wallpaper-select');
        wallpaperSelect.value = wallpaperValue;

        // 更新壁纸选择框的显示文本
        const wallpaperSelectSelected = document.getElementById('wallpaper-select-selected');
        if (wallpaperSelectSelected) {
            const themeInfo = this.getThemeDisplayInfo();
            if (themeInfo && themeInfo.wallpaperName) {
                wallpaperSelectSelected.textContent = themeInfo.themeName + '：' + themeInfo.wallpaperName;
            } else if (wallpaperValue === 'default') {
                wallpaperSelectSelected.textContent = '默认壁纸';
            } else if (wallpaperValue === 'bing') {
                wallpaperSelectSelected.textContent = '必应每日壁纸';
            } else if (wallpaperValue === 'url') {
                wallpaperSelectSelected.textContent = 'URL链接';
            } else {
                // 自定义壁纸
                const customWallpaper = this.settings.customWallpapers.find(wp => wp.name === wallpaperValue);
                if (customWallpaper) {
                    wallpaperSelectSelected.textContent = customWallpaper.name;
                }
            }
        }

        // 更新右键菜单样式
        document.getElementById('context-menu-style').value = this.settings.contextMenuStyle;

        // 更新配色方案选择
        this.updateColorSchemeSelectDisplay();

        // 更新新增的设置选项
        document.getElementById('dynamic-blur-toggle').checked = this.settings.dynamicBlur;
        document.getElementById('enhanced-display-toggle').checked = this.settings.enhancedDisplay;
        document.getElementById('persistent-wallpaper-toggle').checked = this.settings.persistentWallpaper;
        document.getElementById('wallpaper-dim-toggle').checked = this.settings.wallpaperDarkDim;
        document.getElementById('wallpaper-scale-toggle').checked = this.settings.wallpaperScale;
        document.getElementById('search-history-toggle').checked = this.settings.searchHistory;
        document.getElementById('search-suggestions-toggle').checked = this.settings.searchSuggestions;
        document.getElementById('engine-lock-toggle').checked = this.settings.engineLocked;
        document.getElementById('hide-info-popup-toggle').checked = this.settings.hideInfoPopup.enabled;
        document.getElementById('quick-access-sidebar-toggle').checked = this.settings.quickAccessSidebar;
        document.getElementById('hide-notifications-toggle').checked = this.settings.hideNotifications;
        // 简洁视觉效果主开关与子开关（主开关开启时才显示子开关）
        this.syncSimpleVisualMode();
        document.getElementById('simple-visual-toggle').checked = this.settings.simpleVisualMode;
        document.getElementById('hidden-badge-toggle').checked = this.settings.hiddenBadge;
        document.getElementById('ocp-player-toggle').checked = this.settings.ocpPlayerEnabled;
        // 固定侧边栏主开关与两个子开关
        document.getElementById('fix-sidebar-toggle').checked = this.settings.fixSidebarEnabled;
        document.getElementById('fix-sidebar-homepage-toggle').checked = this.settings.fixSidebarEnabled && this.settings.fixSidebarHomepage;
        document.getElementById('fix-sidebar-wallpaper-toggle').checked = this.settings.fixSidebarEnabled && this.settings.fixSidebarWallpaper;
        // 侧边栏功能：左侧下拉摘要与右面板视图
        this.syncSidePanelSelectDisplay();
        this.updateHideInfoPopupLabel();

        // 根据动态模糊的状态显示/隐藏增强显示开关
        const enhancedDisplayGroup = document.getElementById('enhanced-display-group');
        if (enhancedDisplayGroup) {
            enhancedDisplayGroup.style.display = this.settings.dynamicBlur ? 'block' : 'none';
        }

        // 根据壁纸常显示的状态显示/隐藏壁纸缩放开关
        const wallpaperScaleGroup = document.getElementById('wallpaper-scale-group');
        if (wallpaperScaleGroup) {
            wallpaperScaleGroup.style.display = this.settings.persistentWallpaper ? 'block' : 'none';
        }

        // 根据快速访问侧边栏开关状态显示/隐藏子开关
        const iconsGroup = document.getElementById('show-quick-icons-group');
        const showIconsToggle = document.getElementById('show-quick-icons');
        if (iconsGroup && showIconsToggle) {
            iconsGroup.style.display = this.settings.quickAccessSidebar ? 'block' : 'none';
            showIconsToggle.checked = this.settings.quickAccessSidebar ? this.settings.showQuickLinkIcons : false;
        }

        // 根据固定侧边栏主开关状态显示/隐藏子开关
        const fsHomepageGroup = document.getElementById('fix-homepage-group');
        const fsWallpaperGroup = document.getElementById('fix-wallpaper-group');
        if (fsHomepageGroup) {
            fsHomepageGroup.style.display = this.settings.fixSidebarEnabled ? 'block' : 'none';
        }
        if (fsWallpaperGroup) {
            fsWallpaperGroup.style.display = this.settings.fixSidebarEnabled ? 'block' : 'none';
        }

        // 根据简洁视觉效果主开关状态显示/隐藏子开关
        const simpleVisualGroups = [
            document.getElementById('simple-notifications-group'),
            document.getElementById('simple-infopopup-group'),
            document.getElementById('simple-badge-group')
        ];
        simpleVisualGroups.forEach(group => {
            if (group) group.style.display = this.settings.simpleVisualMode ? 'block' : 'none';
        });

        this.syncWidgetPanelUI();

        // 更新底部铭牌功能（摘要文本 + 隐藏铭牌时隐藏该项）
        this.syncBadgeOpenMethodUI();

        // 更新自定义下拉菜单的显示文本
        const updateCustomSelectDisplay = (selectId, selectedValue) => {
            const select = document.getElementById(selectId);
            const customSelect = select.parentElement;
            const selectedDisplay = customSelect.querySelector('.select-selected');
            const selectItems = customSelect.querySelector('.select-items');

            if (selectedDisplay) {
                const selectedOption = select.querySelector(`option[value="${selectedValue}"]`);
                if (selectedOption) {
                    selectedDisplay.textContent = selectedOption.textContent;
                }
            }

            // 更新下拉菜单选项
            if (selectItems) {
                // 先清除所有自定义选项（支持两种标识符）
                const customItems = selectItems.querySelectorAll('.select-item[data-custom="true"], .select-item-custom-logo');
                customItems.forEach(item => item.remove());

                // 添加自定义选项（支持两种标识符）
                const customOptions = select.querySelectorAll('option[data-custom="true"], option.custom-logo-option');
                customOptions.forEach(option => {
                    const selectItem = document.createElement('div');
                    selectItem.className = 'select-item select-item-custom-logo';
                    selectItem.setAttribute('data-value', option.value);
                    selectItem.textContent = option.textContent;
                    selectItems.appendChild(selectItem);
                });
            }
        };

        // 更新每个自定义下拉菜单
        // font-select 由 updateCustomFontsList 处理
        // logo-select 由 updateCustomLogosList 处理
        // wallpaper-select 由 updateCustomWallpapersList 处理
        updateCustomSelectDisplay('context-menu-style', this.settings.contextMenuStyle);

        // 移除应用按钮的所有logo类，保持蓝色
        this.updateApplyButtonColor();
    },
    updateApplyButtonColor() {
        const applyBtn = document.getElementById('apply-settings');

        // 移除所有logo类，确保应用按钮始终为蓝色
        const logoClasses = ['logo-google', 'logo-microsoft', 'logo-apple', 'logo-huawei', 'logo-custom', 'logo-text'];
        logoClasses.forEach(logoClass => {
            applyBtn.classList.remove(logoClass);
        });

        // 应用按钮始终使用蓝色样式，不随Logo变化
        applyBtn.style.backgroundColor = '';
        applyBtn.style.color = '';
        applyBtn.style.borderColor = '';
    },
    closeSettings() {
        // 侧边栏子视图的数据交换随设置关闭而恢复
        this.exitSidePanelScope();
        const modal = document.getElementById('settings-modal');
        const modalContent = modal.querySelector('.modal-content');

        // 关闭前读取设置页的增强显示复选框，同步到 this.settings
        const enhBox = document.getElementById('enhanced-display-toggle');
        if (enhBox && this.settings.enhancedDisplay !== enhBox.checked) {
            this.settings.enhancedDisplay = enhBox.checked;
            this.applySettings();
            this.saveSettings();
        }

        // 根据dynamicBlur设置决定是否添加动画
        if (!this.settings.dynamicBlur) {
            // 添加no-animation类，禁用动画
            if (modalContent) modalContent.classList.add('no-animation');
        }

        // 添加退出动画 - 使用 hiding 类
        modal.classList.remove('show');
        modal.classList.add('hiding');

        // 根据dynamicBlur设置决定是否等待动画完成
        if (this.settings.dynamicBlur) {
            // 等待动画完成后再执行后续操作
            setTimeout(() => {
                // 移除 hiding 类和 blur-effect 类
                modal.classList.remove('hiding');
                modal.classList.remove('blur-effect');
                modal.classList.remove('badge-source');

                // 恢复主页面滚动
                document.body.style.overflow = '';

                // 移除鼠标滚轮事件监听器
                if (this.modalScrollHandler) {
                    document.removeEventListener('wheel', this.modalScrollHandler);
                    this.modalScrollHandler = null;
                }

                // 隐藏快速访问链接输入区域
                const quickLinksInputGroup = document.getElementById('quick-links-input-group');
                if (quickLinksInputGroup) {
                    quickLinksInputGroup.style.display = 'none';
                }

                // 隐藏模态框
                modal.style.display = 'none';

                // 重新读取设置状态，更新右键菜单图标
                this.updateContextMenuIcons();
            }, 400); // 等待动画完成，与CSS过渡时间匹配
        } else {
            // 直接执行后续操作，无动画
            // 移除 hiding 类
            modal.classList.remove('hiding');
            modal.classList.remove('badge-source');

            // 恢复主页面滚动
            document.body.style.overflow = '';

            // 移除 blur-effect 类
            modal.classList.remove('blur-effect');

            // 移除鼠标滚轮事件监听器
            if (this.modalScrollHandler) {
                document.removeEventListener('wheel', this.modalScrollHandler);
                this.modalScrollHandler = null;
            }

            // 隐藏快速访问链接输入区域
            const quickLinksInputGroup = document.getElementById('quick-links-input-group');
            if (quickLinksInputGroup) {
                quickLinksInputGroup.style.display = 'none';
            }

            // 隐藏模态框
            modal.style.display = 'none';

            // 重新读取设置状态，更新右键菜单图标
            this.updateContextMenuIcons();
        }
    },
    updateDeveloperModeUI() {
        const developerModeGroup = document.getElementById('developer-mode-group');
        if (developerModeGroup) {
            developerModeGroup.style.display = this.settings.developerMode ? 'block' : 'none';
        }

        const feedbackBtn = document.getElementById('feedback-btn');
        if (feedbackBtn) {
            feedbackBtn.style.display = this.settings.developerMode ? 'flex' : 'none';
        }

        const contextFeedbackItem = document.querySelector('.context-menu-item[data-action="feedback"]');
        if (contextFeedbackItem) {
            contextFeedbackItem.style.display = this.settings.developerMode ? '' : 'none';
        }

        // 仅开发者模式可见的导出/导入按钮
        document.querySelectorAll('.dev-only').forEach(btn => {
            btn.style.display = this.settings.developerMode ? '' : 'none';
        });

        if (this.settings.developerMode) {
            document.getElementById('font-size-slider').value = this.settings.fontSize;
            document.getElementById('font-size-value').value = this.settings.fontSize.toFixed(1);
            document.getElementById('font-weight-slider').value = this.settings.fontWeight;
            document.getElementById('font-weight-value').value = this.settings.fontWeight;
            document.getElementById('search-box-height').value = this.settings.searchBoxHeight;
            document.getElementById('search-box-height-value').value = this.settings.searchBoxHeight;
        }
        this.syncStatusBarUI();

        // 快捷键开关独立于开发者模式
        const shortcutsToggle = document.getElementById('shortcuts-toggle');
        if (shortcutsToggle) {
            shortcutsToggle.checked = this.settings.shortcutsEnabled;
        }

        const proxySelect = document.getElementById('proxy-select');
        const proxySelected = document.getElementById('proxy-select-selected');
        if (proxySelect && proxySelected) {
            if (this.settings.proxyPort) {
                proxySelect.value = 'custom';
                this.updateProxySelectedText(this.settings.proxyPort);
            } else {
                proxySelect.value = '';
                proxySelected.textContent = '不使用代理';
            }
            ProxyManager.setProxy(this.settings.proxyPort);
        }
    },
    applyWallpaperDim() {
        // 暗色压暗壁纸：暗色模式下壁纸蒙版的开关（主页面与侧边栏面板共用设置键 wallpaperDarkDim）
        document.body.classList.toggle('wallpaper-dim-off', !this.settings.wallpaperDarkDim);
    },
    applyDeveloperSettings() {
        const root = document.documentElement;

        // 主题字体粗细/大小覆盖优先
        let fontSize = this.settings.fontSize;
        let fontWeight = this.settings.fontWeight;
        if (this.settings.themeEnabled && this.themeOverrides?.font) {
            const o = this.themeOverrides.font;
            if (o.weight) {
                const w = parseInt(o.weight, 10);
                if (!isNaN(w)) fontWeight = w;
            }
            if (o.size) {
                const emMatch = String(o.size).match(/^([\d.]+)em$/);
                if (emMatch) fontSize = parseFloat(emMatch[1]);
            }
        }
        root.style.setProperty('--base-font-size', fontSize);
        root.style.setProperty('--base-font-weight', fontWeight);

        if (this.settings.searchBoxHeight > 0) {
            root.style.setProperty('--search-box-height', this.settings.searchBoxHeight + 'px');
        } else if (this.settings.searchBoxHeight === 0) {
            root.style.setProperty('--search-box-height', '1px');
        } else {
            root.style.setProperty('--search-box-height', '50px');
        }
    },
    resetDeveloperSettings() {
        this.settings.fontSize = 1;
        this.settings.fontWeight = 400;
        this.settings.searchBoxHeight = 50;
        this.settings.proxyPort = null;
        this.settings.statusBarEnabled = false;
        this.settings.showStatusBarSeconds = false;
        this.settings.hideNotifications = false;

        const fontSizeSlider = document.getElementById('font-size-slider');
        const fontWeightSlider = document.getElementById('font-weight-slider');
        const searchBoxHeightSlider = document.getElementById('search-box-height');

        if (fontSizeSlider) {
            fontSizeSlider.value = 1;
            document.getElementById('font-size-value').value = 1;
        }

        if (fontWeightSlider) {
            fontWeightSlider.value = 400;
            document.getElementById('font-weight-value').value = 400;
        }

        if (searchBoxHeightSlider) {
            searchBoxHeightSlider.value = 50;
            document.getElementById('search-box-height-value').value = 50;
        }

        const proxySelect = document.getElementById('proxy-select');
        const proxySelected = document.getElementById('proxy-select-selected');
        if (proxySelect) proxySelect.value = '';
        if (proxySelected) proxySelected.textContent = '不使用代理';
        ProxyManager.clearProxy();

        this.applyDeveloperSettings();
        this.updateDeveloperModeUI();
        this.applyStatusBarSettings();
        this.saveSettings();
    },
    handleProxyChange(value) {
        const proxySelected = document.getElementById('proxy-select-selected');
        if (!proxySelected) return;

        if (value === 'custom') {
            this.updateProxySelectedText(this.settings.proxyPort);
            const customItem = document.querySelector('#proxy-select-items .proxy-custom-item');
            if (customItem) {
                const inputWrapper = customItem.querySelector('.proxy-custom-input-wrapper');
                if (inputWrapper) {
                    inputWrapper.style.display = 'flex';
                }
            }
            return;
        }

        if (value === '') {
            this.settings.proxyPort = null;
            ProxyManager.clearProxy();
            proxySelected.textContent = '不使用代理';
            this.saveSettings();
            return;
        }

        const portNum = parseInt(value, 10);
        if (!isNaN(portNum) && portNum >= 1 && portNum <= 65535) {
            this.settings.proxyPort = portNum;
            ProxyManager.setProxy(portNum);
            proxySelected.textContent = value;
            this.saveSettings();
        }
    },
    updateProxySelectedText(port) {
        const proxySelected = document.getElementById('proxy-select-selected');
        if (proxySelected) {
            proxySelected.textContent = port ? port.toString() : '不使用代理';
        }
    },
    applySettings() {
        // 各应用分支独立容错：单个分支异常（如历史数据形态异常）不影响主页其余部分
        const safe = (name, fn) => {
            try { fn.call(this); } catch (error) { console.error('应用设置失败 [' + name + ']:', error); }
        };
        safe('applyFont', this.applyFont);
        safe('applyLogo', this.applyLogo);
        safe('applyQuickLinks', this.applyQuickLinks);
        safe('applyWallpaper', this.applyWallpaper);
        safe('applyWallpaperDim', this.applyWallpaperDim);
        safe('applyDeveloperSettings', this.applyDeveloperSettings);
        safe('applyContextMenuStyle', this.applyContextMenuStyle);
        safe('renderWidgetPanel', this.renderWidgetPanel);

        if (this.infoManager) {
            this.infoManager.applyHideInfoPopup();
        }

        if (this.settings.dynamicBlur) {
            document.body.classList.add('dynamic-blur');
        } else {
            document.body.classList.remove('dynamic-blur');
        }

        if (this.settings.dynamicBlur && this.settings.enhancedDisplay) {
            document.body.classList.add('enhanced-display');
        } else {
            document.body.classList.remove('enhanced-display');
        }

        if (this.settings.wallpaperScale) {
            document.body.classList.add('wallpaper-scale');
        } else {
            document.body.classList.remove('wallpaper-scale');
        }

        this.handlePersistentWallpaperToggle();
        this.applyStatusBarSettings();
        this.applyColorScheme();

        // 隐藏铭牌（简洁视觉效果子项）：隐藏主页面底部铭牌
        const badge = document.getElementById('ooo-badge');
        if (badge) {
            badge.style.display = this.settings.hiddenBadge ? 'none' : '';
        }

        // 底部铭牌功能：动作绑定幂等；同步子项显隐与摘要，覆盖导入设置等整体替换路径
        this.setupBadgeOpenMethod();
        this.syncBadgeOpenMethodUI();

        // OCP 播控：绑定幂等；整体替换设置（导入等）后如已关闭则立即收起
        this.setupOcpPlayer();
        if (!this.settings.ocpPlayerEnabled) {
            this.hideOcpPlayer();
        }

        // 同步固定侧边栏状态（关闭时内部负责移除 sidebar-fixed 标记并恢复 hover 控制）
        this.syncSidebarFixedState();
    },
};

// ==== main/Script/core/mixins/SidePanelBridgeMixin.js ====
// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

const SidePanelBridgeMixin = {
getSidePanelQuickLinksSource () {
    if (!Array.isArray(this.settings.sidePanelQuickLinks)) this.settings.sidePanelQuickLinks = [];
    return this.settings.sidePanelQuickLinks;
},
getSidePanelWidgetsSource () {
    if (!this.settings.sidePanelWidgetPanel || typeof this.settings.sidePanelWidgetPanel !== 'object') {
        this.settings.sidePanelWidgetPanel = { widgets: [] };
    }
    if (!Array.isArray(this.settings.sidePanelWidgetPanel.widgets)) this.settings.sidePanelWidgetPanel.widgets = [];
    return this.settings.sidePanelWidgetPanel.widgets;
},
enterSidePanelScope (needs) {
    this.exitSidePanelScope();
    const swap = {};
    if (needs.quicklinks && this.settings.sidePanelQuickLinksSync === false) {
        if (!Array.isArray(this.settings.sidePanelQuickLinks)) this.settings.sidePanelQuickLinks = [];
        swap.quickLinks = this.settings.quickLinks;
        this.settings.quickLinks = this.settings.sidePanelQuickLinks;
    }
    if (needs.widgets && this.settings.sidePanelWidgetsSync === false) {
        this.getSidePanelWidgetsSource();
        swap.widgetPanel = this.settings.widgetPanel;
        this.settings.widgetPanel = this.settings.sidePanelWidgetPanel;
    }
    if (swap.quickLinks !== undefined || swap.widgetPanel !== undefined) {
        this._spSwap = swap;
    }
},
exitSidePanelScope () {
    if (!this._spSwap) return;
    if (this._spSwap.quickLinks !== undefined) this.settings.quickLinks = this._spSwap.quickLinks;
    if (this._spSwap.widgetPanel !== undefined) this.settings.widgetPanel = this._spSwap.widgetPanel;
    this._spSwap = null;
    this.applyQuickLinks();
    this.renderWidgetPanel();
},
getSidePanelSummary () {
    if (!this.settings.sidePanelEnabled) return '关闭';
    const parts = [];
    if (this.settings.sidePanelShowWidgets) parts.push('小组件');
    if (this.settings.sidePanelShowQuickLinks) parts.push('快速访问');
    if (this.settings.sidePanelShowSearch) parts.push('搜索');
    if (this.settings.sidePanelWallpaperEnabled) parts.push('壁纸');
    return parts.length ? parts.join(' · ') : '开启';
},
spBuildSwitchRow (labelText, checked, onChange) {
    const group = document.createElement('div');
    group.className = 'setting-group';

    const row = document.createElement('div');
    row.className = 'switch-label';
    const label = document.createElement('span');
    label.className = 'setting-label';
    label.textContent = labelText;
    row.appendChild(label);

    const switchWrap = document.createElement('label');
    switchWrap.className = 'switch';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = !!checked;
    const slider = document.createElement('span');
    slider.className = 'slider';
    input.addEventListener('change', () => {
        if (typeof onChange === 'function') onChange(input.checked);
    });
    switchWrap.appendChild(input);
    switchWrap.appendChild(slider);
    row.appendChild(switchWrap);

    group.appendChild(row);
    return group;
},
spBuildNavRow (labelText, statusText, onClick) {
    const group = document.createElement('div');
    group.className = 'setting-group';

    const label = document.createElement('label');
    label.textContent = labelText + ':';
    group.appendChild(label);

    const box = document.createElement('div');
    box.className = 'custom-select';
    const selected = document.createElement('div');
    // select-drill：右向箭头，表示点击进入子页面而非展开下拉（与主设置页的
    // 「小组件列表 / 快速访问链接」两行同款）
    selected.className = 'select-selected select-drill';
    selected.textContent = statusText;
    selected.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick();
    });
    box.appendChild(selected);
    group.appendChild(box);
    return group;
},
getSidePanelNavItems () {
    const self = this;
    return [
        { key: 'widgets', label: '小组件', enabled: () => self.settings.sidePanelShowWidgets, sync: () => self.settings.sidePanelWidgetsSync },
        { key: 'quicklinks', label: '快速访问链接', enabled: () => self.settings.sidePanelShowQuickLinks, sync: () => self.settings.sidePanelQuickLinksSync },
        { key: 'search', label: '搜索框', enabled: () => self.settings.sidePanelShowSearch, sync: null },
        { key: 'wallpaper', label: '壁纸', enabled: () => self.settings.sidePanelWallpaperEnabled, sync: () => self.settings.sidePanelWallpaperSync }
    ];
},
getSidePanelNavStatus (item) {
    return item.enabled() ? (item.sync ? (item.sync() ? '与主页面一致' : '独立配置') : '显示') : '隐藏';
},
renderSidePanelConfigView (rightPanelUpper, skipAnimation) {
    const self = this;
    if (!rightPanelUpper) return;
    rightPanelUpper.innerHTML = '';
    delete rightPanelUpper.dataset.subView;
    rightPanelUpper.dataset.menuType = 'side-panel';
    this._sidePanelView = 'root';

    const wrapper = document.createElement('div');
    wrapper.className = 'side-panel-config-view';
    const container = document.createElement('div');
    container.className = 'settings-menu-container side-panel-root-view' + (skipAnimation ? '' : ' slide-in-right');

    // 主开关（设置主页面同款开关行）；关闭后其下四项直接隐藏，故重建根视图
    container.appendChild(this.spBuildSwitchRow('侧边栏功能', !!this.settings.sidePanelEnabled, (checked) => {
        self.settings.sidePanelEnabled = checked;
        // 侧边栏的主内容就是快速访问链接：开启侧边栏功能时把它一并带开，并与主页面保持一致，
        // 省去再进子视图开两次开关（仅 false → true 时带开，之后用户仍可手动关闭）
        if (checked) {
            self.settings.sidePanelShowQuickLinks = true;
            self.settings.sidePanelQuickLinksSync = true;
        }
        self.saveSettings();
        const selectedDisplay = document.getElementById('side-panel-select-selected');
        if (selectedDisplay) selectedDisplay.textContent = self.getSidePanelSummary();
        self.renderSidePanelConfigView(rightPanelUpper, true);
    }));

    // 侧边栏功能关闭时，四个功能项一并隐藏
    if (this.settings.sidePanelEnabled) {
        this.getSidePanelNavItems().forEach(item => {
            container.appendChild(this.spBuildNavRow(item.label, this.getSidePanelNavStatus(item), () => {
                // 进入子页面：根视图向左推出、子页面从右推入（iOS 式 push）
                self.panelTransition(rightPanelUpper, 'push', () => {
                    self.renderSidePanelSubView(rightPanelUpper, item.key, true);
                });
            }));
        });
    }

    wrapper.appendChild(container);
    rightPanelUpper.appendChild(wrapper);
    const modal = document.getElementById('settings-modal');
    if (modal) modal.classList.add('right-panel-open');
},
renderSidePanelSubView (rightPanelUpper, key, skipAnimation) {
    if (!rightPanelUpper) return;
    rightPanelUpper.dataset.menuType = 'side-panel';
    this._sidePanelView = key;

    if (key === 'widgets') {
        this.renderSPWidgetsView(rightPanelUpper, skipAnimation);
        return;
    }
    if (key === 'quicklinks') {
        this.renderSPQuickLinksView(rightPanelUpper, skipAnimation);
        return;
    }
    if (key === 'search' || key === 'wallpaper') {
        this.exitSidePanelScope();
        rightPanelUpper.innerHTML = '';
        // 与小组件/快速访问链接子视图同款的两层结构：外层包裹 + 内层滚动容器，
        // 保证四个子视图的内边距、滚动与滑入动画作用对象一致
        const wrapper = document.createElement('div');
        wrapper.className = 'side-panel-config-view';
        const container = document.createElement('div');
        container.className = 'settings-menu-container' + (skipAnimation ? '' : ' slide-in-right');
        if (key === 'search') this.renderSPSearchView(container);
        else this.renderSPWallpaperView(container);
        wrapper.appendChild(container);
        rightPanelUpper.appendChild(wrapper);
        const modal = document.getElementById('settings-modal');
        if (modal) modal.classList.add('right-panel-open');
    }
},
refreshSidePanelView (rightPanelUpper) {
    if (!rightPanelUpper || rightPanelUpper.dataset.menuType !== 'side-panel') return;
    if (this._sidePanelView && this._sidePanelView !== 'root') {
        this.renderSidePanelSubView(rightPanelUpper, this._sidePanelView, true);
        return;
    }
    // 根视图：原地同步主开关与四个导航项的状态文字
    const master = rightPanelUpper.querySelector('.switch input');
    if (master) master.checked = !!this.settings.sidePanelEnabled;
    const navItems = this.getSidePanelNavItems();
    rightPanelUpper.querySelectorAll('.setting-group').forEach(box => {
        const label = box.querySelector('label');
        const value = box.querySelector('.select-selected');
        if (!label || !value) return;
        const name = label.textContent.replace(':', '').trim();
        const item = navItems.find(it => it.label === name);
        if (item) value.textContent = this.getSidePanelNavStatus(item);
    });
},
spBuildSubViewHeader (rightPanelUpper, showKey, showLabel, syncKey, opts) {
    const self = this;
    const header = document.createElement('div');
    header.className = 'side-panel-subview-header';

    header.appendChild(this.spBuildSwitchRow(showLabel, !!this.settings[showKey], (checked) => {
        self.settings[showKey] = checked;
        if (opts && typeof opts.afterShowChange === 'function') opts.afterShowChange(checked);
        self.saveSettings();
        self.syncSidePanelSelectDisplay();
    }));

    if (syncKey) {
        header.appendChild(this.spBuildSwitchRow('与主页面保持一致', !!self.settings[syncKey], (checked) => {
            self.settings[syncKey] = checked;
            // 切到独立配置时，独立列表为空则从主页面复制一份作为起点
            if (!checked && syncKey === 'sidePanelWidgetsSync' && self.getSidePanelWidgetsSource().length === 0) {
                const mainWidgets = (self.settings.widgetPanel && Array.isArray(self.settings.widgetPanel.widgets)) ? self.settings.widgetPanel.widgets : [];
                self.settings.sidePanelWidgetPanel.widgets = JSON.parse(JSON.stringify(mainWidgets));
            }
            if (!checked && syncKey === 'sidePanelQuickLinksSync' && self.getSidePanelQuickLinksSource().length === 0) {
                const mainLinks = Array.isArray(self.settings.quickLinks) ? self.settings.quickLinks : [];
                self.settings.sidePanelQuickLinks = JSON.parse(JSON.stringify(mainLinks));
            }
            self.saveSettings();
            self.renderSidePanelSubView(rightPanelUpper, self._sidePanelView, true);
        }));
    }
    return header;
},
spRenderSyncableSubView (rightPanelUpper, cfg) {
    const wrapper = document.createElement('div');
    wrapper.className = 'side-panel-config-view';
    const header = this.spBuildSubViewHeader(rightPanelUpper, cfg.showKey, cfg.showLabel, cfg.syncKey, cfg);

    if (this.settings[cfg.syncKey]) {
        rightPanelUpper.innerHTML = '';
        wrapper.appendChild(header);
        rightPanelUpper.appendChild(wrapper);
    } else {
        cfg.renderManager();
        const mgr = rightPanelUpper.querySelector('.settings-menu-container');
        if (!mgr) return;
        wrapper.appendChild(header);
        wrapper.appendChild(mgr);
        rightPanelUpper.appendChild(wrapper);
    }

    const modal = document.getElementById('settings-modal');
    if (modal) modal.classList.add('right-panel-open');
},
renderSPWidgetsView (rightPanelUpper, skipAnimation) {
    this.enterSidePanelScope({ widgets: true });
    this.spRenderSyncableSubView(rightPanelUpper, {
        showKey: 'sidePanelShowWidgets',
        showLabel: '显示小组件',
        syncKey: 'sidePanelWidgetsSync',
        // 侧边栏以小组件 + 快速访问链接为主要内容：开启小组件时把快速访问链接
        // 一并默认开启并与主页面保持一致（仅 false → true 时带开，之后用户仍可手动关闭）
        afterShowChange: (checked) => {
            if (!checked) return;
            this.settings.sidePanelShowQuickLinks = true;
            this.settings.sidePanelQuickLinksSync = true;
        },
        renderManager: () => this.showWidgetPanelMenuInRightPanel(skipAnimation)
    });
},
renderSPQuickLinksView (rightPanelUpper, skipAnimation) {
    this.enterSidePanelScope({ quicklinks: true });
    this.spRenderSyncableSubView(rightPanelUpper, {
        showKey: 'sidePanelShowQuickLinks',
        showLabel: '显示快速访问链接',
        syncKey: 'sidePanelQuickLinksSync',
        renderManager: () => this.showQuickLinksMenuInRightPanel(skipAnimation)
    });
},
renderSPSearchView (container) {
    const self = this;

    container.appendChild(this.spBuildSwitchRow('显示搜索框', !!this.settings.sidePanelShowSearch, (checked) => {
        self.settings.sidePanelShowSearch = checked;
        self.saveSettings();
        self.syncSidePanelSelectDisplay();
    }));

    container.appendChild(this.spBuildSwitchRow('显示引擎切换按钮', !!this.settings.sidePanelShowEngineButtons, (checked) => {
        self.settings.sidePanelShowEngineButtons = checked;
        self.saveSettings();
        self.syncSidePanelSelectDisplay();
    }));

    // 内置页打开：开启后搜索/访问的网页在内置 iframe 浏览器中展示（不新开标签页）
    container.appendChild(this.spBuildSwitchRow('内置页打开', !!this.settings.sidePanelBuiltinOpen, (checked) => {
        self.settings.sidePanelBuiltinOpen = checked;
        self.saveSettings();
    }));

    container.appendChild(this.spBuildSwitchRow('与主页面保持一致', !!this.settings.sidePanelSearchSync, (checked) => {
        self.settings.sidePanelSearchSync = checked;
        self.saveSettings();
        self.syncSidePanelSelectDisplay();
    }));

    if (this.settings.sidePanelSearchSync) {
        return;
    }

    // 搜索框厚度与主页面开发者模式里的同名控件等价，属于低频调节项，同样只在开发者模式下露出
    // （设置仍然生效并持久化，只是普通用户看不到入口）
    if (!this.settings.developerMode) {
        return;
    }

    // 搜索框厚度（设置主页面开发者模式同款滑块 + 数值输入）
    const item = document.createElement('div');
    item.className = 'developer-control-item';
    const label = document.createElement('label');
    label.textContent = '搜索框厚度';
    item.appendChild(label);

    const row = document.createElement('div');
    row.className = 'control-with-reset';
    const range = document.createElement('input');
    range.type = 'range';
    range.className = 'slider-input';
    range.min = '20';
    range.max = '200';
    range.step = '1';
    range.value = String(this.settings.sidePanelSearchBoxHeight || 50);
    const num = document.createElement('input');
    num.type = 'number';
    num.className = 'slider-value-input';
    num.min = '20';
    num.max = '200';
    num.step = '1';
    num.value = String(this.settings.sidePanelSearchBoxHeight || 50);
    range.addEventListener('input', () => {
        num.value = range.value;
        this.settings.sidePanelSearchBoxHeight = parseInt(range.value, 10) || 50;
        this.saveSettings();
    });
    num.addEventListener('change', () => {
        let v = parseInt(num.value, 10);
        if (!(v > 0)) v = 50;
        v = Math.max(20, Math.min(200, v));
        num.value = String(v);
        range.value = String(v);
        this.settings.sidePanelSearchBoxHeight = v;
        this.saveSettings();
    });
    row.appendChild(range);
    row.appendChild(num);
    item.appendChild(row);
    container.appendChild(item);
},
renderSPWallpaperView (container) {
    const self = this;

    container.appendChild(this.spBuildSwitchRow('显示壁纸', !!this.settings.sidePanelWallpaperEnabled, (checked) => {
        self.settings.sidePanelWallpaperEnabled = checked;
        self.saveSettings();
        self.syncSidePanelSelectDisplay();
    }));

    container.appendChild(this.spBuildSwitchRow('与主页面保持一致', !!this.settings.sidePanelWallpaperSync, (checked) => {
        self.settings.sidePanelWallpaperSync = checked;
        self.saveSettings();
        self.syncSidePanelSelectDisplay();
    }));

    if (this.settings.sidePanelWallpaperSync) {
        return;
    }

    // 壁纸地址（与设置主页面下拉框同款外观的输入框）
    const group = document.createElement('div');
    group.className = 'setting-group';
    const label = document.createElement('label');
    label.textContent = '壁纸地址:';
    group.appendChild(label);
    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.className = 'side-panel-url-input';
    urlInput.placeholder = '留空使用默认壁纸';
    urlInput.value = this.settings.sidePanelWallpaperUrl || '';
    urlInput.addEventListener('change', () => {
        this.settings.sidePanelWallpaperUrl = urlInput.value.trim();
        this.saveSettings();
    });
    group.appendChild(urlInput);
    container.appendChild(group);
},
syncSidePanelSelectDisplay () {
    const selectedDisplay = document.getElementById('side-panel-select-selected');
    if (selectedDisplay) {
        selectedDisplay.textContent = this.getSidePanelSummary();
    }
    const rpu = document.getElementById('right-panel-upper');
    if (rpu && rpu.dataset.menuType === 'side-panel') {
        const ae = document.activeElement;
        const isTyping = !!(ae && rpu.contains(ae) && ((ae.tagName === 'INPUT' && (!ae.type || ae.type === 'text' || ae.type === 'url' || ae.type === 'number' || ae.type === 'range')) || ae.tagName === 'TEXTAREA'));
        if (isTyping) {
            return;
        }
        this.refreshSidePanelView(rpu);
    }
},
};

// ==== main/Script/core/mixins/RightPanelMixin.js ====
// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

// [bundled] import { … } from '../color.js'
// [bundled] import { … } from '../proxy.js'

const RightPanelMixin = {
// 右侧面板内下钻视图的切换动画（iOS 式 push / pop）：
//   push：当前视图向左推出，新视图从右推入
//   pop ：子视图向右推出，父视图从左推入
// 切换前把面板现有内容整体搬进一个脱离文档流的「幽灵层」——是直接搬移节点而非克隆，
// 滚动位置与事件监听都留在原节点上；新视图照常渲染后与幽灵层同帧反向滑动，播完移除幽灵层。
// render 由调用方提供，内部应以 skipAnimation = true 渲染，避免与这里的方向动画叠加。
panelTransition (rightPanelUpper, direction, render) {
    const panel = rightPanelUpper || document.getElementById('right-panel-upper');
    if (!panel) { render(); return; }

    const isPush = direction !== 'pop';

    // 面板滚动位置归零：新视图与幽灵层都按内容顶部定位，退出时不会错位
    panel.scrollTop = 0;

    const ghost = document.createElement('div');
    ghost.className = 'panel-transition-ghost';
    while (panel.firstChild) ghost.appendChild(panel.firstChild);

    render();

    const inClass = isPush ? 'panel-in-right' : 'panel-in-left';
    Array.from(panel.children).forEach(el => {
        // 清掉渲染函数可能自带的滑入/滑出类，同一帧内完成替换，不会真的播出来
        el.classList.remove('slide-in-right', 'slide-out-right', 'slide-in-left', 'slide-out-left');
        void el.offsetWidth;
        el.classList.add(inClass);
        el.addEventListener('animationend', () => el.classList.remove(inClass), { once: true });
        setTimeout(() => el.classList.remove(inClass), 400);
    });

    if (!ghost.firstChild) return;

    ghost.classList.add(isPush ? 'panel-out-left' : 'panel-out-right');
    ghost.addEventListener('animationend', () => ghost.remove(), { once: true });
    panel.appendChild(ghost);
    // 兜底：动画事件在后台标签页等场景可能不触发，避免幽灵层长期压在面板上
    setTimeout(() => { if (ghost.parentNode) ghost.remove(); }, 600);
},
showSettingsMenuInRightPanel (items, selected, hiddenSelect, skipAnimation) {
    const self = this;
    const rightPanelUpper = document.getElementById('right-panel-upper');
    if (!rightPanelUpper) return;
    // 离开侧边栏子视图时恢复数据交换
    this.exitSidePanelScope();

    let menuType = '';
    if (selected.id === 'font-select-selected' || selected.parentElement.querySelector('#font-select')) {
        menuType = 'font';
    } else if (selected.id === 'logo-select-selected' || selected.parentElement.querySelector('#logo-select')) {
        menuType = 'logo';
    } else if (selected.id === 'wallpaper-select-selected' || selected.parentElement.querySelector('#wallpaper-select')) {
        menuType = 'wallpaper';
    } else if (selected.id === 'proxy-select-selected' || selected.parentElement.querySelector('#proxy-select')) {
        menuType = 'proxy';
    } else if (selected.id === 'context-menu-style-selected' || selected.parentElement.querySelector('#context-menu-style')) {
        menuType = 'context-menu';
    } else if (selected.id === 'color-scheme-select-selected' || selected.parentElement.querySelector('#color-scheme-select')) {
        menuType = 'color-scheme';
    } else if (selected.id === 'theme-select-selected' || selected.parentElement.querySelector('#theme-select')) {
        menuType = 'theme';
    } else if (selected.id === 'badge-open-method-selected' || selected.parentElement.querySelector('#badge-open-method-select')) {
        menuType = 'badge-open-method';
    } else if (selected.id === 'side-panel-select-selected' || selected.parentElement.querySelector('#side-panel-select')) {
        menuType = 'side-panel';
    }

    rightPanelUpper.innerHTML = '';
    delete rightPanelUpper.dataset.subView;
    rightPanelUpper.dataset.menuType = menuType;

    // 底部铭牌功能：独立的三段式双选项视图，不走通用列表渲染
    if (menuType === 'badge-open-method') {
        this.renderBadgeConfigView(rightPanelUpper);
        return;
    }

    // 侧边栏功能：独立配置视图（功能开关组），不走通用列表渲染
    if (menuType === 'side-panel') {
        this.renderSidePanelConfigView(rightPanelUpper);
        return;
    }

    const container = document.createElement('div');
    container.className = 'settings-menu-container' + (skipAnimation ? '' : ' slide-in-right');

    const optionsList = document.createElement('div');
    optionsList.className = 'settings-menu-options';

    // 主题菜单：特殊渲染（名称 + 版本 + 设计师），不走通用 select-item 遍历
    if (menuType === 'theme') {
        const isCustomTheme = (key) => self.settings.customThemes && self.settings.customThemes.some(ct => ct.key === key);

        // "不使用主题"选项：允许用户主动关闭主题功能
        const offOption = document.createElement('div');
        offOption.className = 'settings-menu-option theme-menu-option';
        const offName = document.createElement('div');
        offName.className = 'theme-option-name';
        offName.textContent = '不使用主题';
        const offDesigner = document.createElement('div');
        offDesigner.className = 'theme-option-designer';
        offDesigner.textContent = '自定义设置';
        offOption.appendChild(offName);
        offOption.appendChild(offDesigner);
        if (!self.settings.themeEnabled || self.isThemeCustomized()) {
            offOption.classList.add('selected');
        }
        offOption.addEventListener('click', (e) => {
            e.stopPropagation();
            self.deactivateTheme();
            selected.textContent = '自定义主题';
            hiddenSelect.value = '';
            optionsList.querySelectorAll('.settings-menu-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            offOption.classList.add('selected');
            self.applySettings();
        });
        optionsList.appendChild(offOption);

        Object.keys(self.themes).forEach(key => {
            const theme = self.themes[key];
            const option = document.createElement('div');
            option.className = 'settings-menu-option theme-menu-option';
            option.setAttribute('data-value', key);

            const isCustom = isCustomTheme(key);

            if (isCustom) {
                const contentWrapper = document.createElement('div');
                contentWrapper.style.cssText = 'display:flex;align-items:center;justify-content:space-between;width:100%';

                const infoWrapper = document.createElement('div');
                infoWrapper.style.cssText = 'flex:1;min-width:0';

                const nameLine = document.createElement('div');
                nameLine.className = 'theme-option-name';
                nameLine.textContent = theme.info.name;

                const versionSpan = document.createElement('span');
                versionSpan.className = 'theme-option-version';
                versionSpan.textContent = theme.info.version;
                nameLine.appendChild(versionSpan);
                infoWrapper.appendChild(nameLine);

                const designerLine = document.createElement('div');
                designerLine.className = 'theme-option-designer';
                designerLine.textContent = theme.info.designer;
                infoWrapper.appendChild(designerLine);

                contentWrapper.appendChild(infoWrapper);

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'custom-theme-delete-btn';
                deleteBtn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
                deleteBtn.title = '删除此主题';
                contentWrapper.appendChild(deleteBtn);

                option.appendChild(contentWrapper);

                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const idx = self.settings.customThemes.findIndex(ct => ct.key === key);
                    if (idx === -1) return;
                    // 记录是否正在使用该主题
                    const wasActive = self.settings.themeEnabled && self.settings.theme === key;
                    const deletingTheme = self.themes[key];
                    self.settings.customThemes.splice(idx, 1);
                    delete self.themes[key];
                    if (wasActive) {
                        // 删除的是当前正在使用的主题：彻底关闭主题并回退到默认外观
                        self.deactivateTheme(deletingTheme, { notify: true });
                        self.applySettings();
                    } else {
                        self.saveSettings();
                    }
                    const updatedItems = document.getElementById('theme-select-items');
                    self.populateThemeSelect();
                    self.showSettingsMenuInRightPanel(updatedItems, selected, hiddenSelect, true);
                });
            } else {
                const nameLine = document.createElement('div');
                nameLine.className = 'theme-option-name';
                nameLine.textContent = theme.info.name;

                const versionSpan = document.createElement('span');
                versionSpan.className = 'theme-option-version';
                versionSpan.textContent = theme.info.version;
                nameLine.appendChild(versionSpan);

                const designerLine = document.createElement('div');
                designerLine.className = 'theme-option-designer';
                designerLine.textContent = theme.info.designer;

                option.appendChild(nameLine);
                option.appendChild(designerLine);
            }

            // 高亮判定
            if (self.settings.themeEnabled && self.settings.theme === key && !self.isThemeCustomized()) {
                option.classList.add('selected');
            }

            option.addEventListener('click', (e) => {
                if (isCustom && e.target.closest('.custom-theme-delete-btn')) return;
                self.applyTheme(key);
                selected.textContent = theme.info.name;
                hiddenSelect.value = key;
                optionsList.querySelectorAll('.settings-menu-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                option.classList.add('selected');
            });

            optionsList.appendChild(option);
        });

        container.appendChild(optionsList);

        // 底部按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'settings-menu-button-container';

        // 主题商店按钮
        const storeBtn = document.createElement('button');
        storeBtn.className = 'settings-import-btn';
        storeBtn.innerHTML = '<span class="material-icons">store</span>';
        storeBtn.title = '打开主题商店';
        storeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            window.open('https://rudan177.github.io/OOOInterface/themes/store.html', '_blank');
        });
        buttonContainer.appendChild(storeBtn);

        // "+" 按钮
        const plusBtn = document.createElement('button');
        plusBtn.className = 'upload-btn settings-plus-btn';
        plusBtn.textContent = '+';
        plusBtn.title = '导入自定义主题';
        plusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            document.getElementById('theme-upload').click();
        });
        buttonContainer.appendChild(plusBtn);
        container.appendChild(buttonContainer);

        // 拖放导入支持
        let dragCounter = 0;
        const showDropOverlay = () => {
            let overlay = rightPanelUpper.querySelector('.theme-drop-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'theme-drop-overlay';
                overlay.innerHTML = '<div class="theme-drop-overlay-text">释放 .js / .json 文件以导入主题</div>';
                rightPanelUpper.appendChild(overlay);
            }
            overlay.style.display = 'flex';
        };
        const hideDropOverlay = () => {
            const overlay = rightPanelUpper.querySelector('.theme-drop-overlay');
            if (overlay) overlay.style.display = 'none';
        };

        rightPanelUpper.addEventListener('dragenter', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter++;
            if (dragCounter === 1) showDropOverlay();
        });
        rightPanelUpper.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        rightPanelUpper.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter--;
            if (dragCounter <= 0) { dragCounter = 0; hideDropOverlay(); }
        });
        rightPanelUpper.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter = 0;
            hideDropOverlay();
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                if (file.name.endsWith('.js') || file.name.endsWith('.json')) {
                    self.handleThemeUpload(file);
                } else {
                    self.showNotification('请拖放 .js 或 .json 主题文件');
                }
            }
        });

        rightPanelUpper.appendChild(container);
        document.getElementById('settings-modal').classList.add('right-panel-open');
        return;
    }


    let colorSchemeGroup = null;
    let colorSchemeGroupList = null;
    let colorSchemeGroup2 = null;
    let colorSchemeGroupList2 = null;
    let colorSchemeGroup3 = null;
    let colorSchemeGroupList3 = null;
    if (menuType === 'color-scheme') {
        // 经典色组
        colorSchemeGroup = document.createElement('div');
        colorSchemeGroup.className = 'color-scheme-group';

        const groupLabel = document.createElement('div');
        groupLabel.className = 'color-scheme-group-label';
        groupLabel.textContent = '经典色';
        colorSchemeGroup.appendChild(groupLabel);

        colorSchemeGroupList = document.createElement('div');
        colorSchemeGroupList.className = 'color-scheme-group-list';
        colorSchemeGroup.appendChild(colorSchemeGroupList);
        colorSchemeGroup.addEventListener('click', (e) => {
            if (e.target.closest('.color-scheme-group-list')) return;
            colorSchemeGroup.scrollIntoView({ inline: 'center', behavior: 'smooth' });
        });

        // 新星调组
        colorSchemeGroup2 = document.createElement('div');
        colorSchemeGroup2.className = 'color-scheme-group';

        const groupLabel2 = document.createElement('div');
        groupLabel2.className = 'color-scheme-group-label';
        groupLabel2.textContent = '新星调';
        colorSchemeGroup2.appendChild(groupLabel2);

        colorSchemeGroupList2 = document.createElement('div');
        colorSchemeGroupList2.className = 'color-scheme-group-list';
        colorSchemeGroup2.appendChild(colorSchemeGroupList2);
        colorSchemeGroup2.addEventListener('click', (e) => {
            if (e.target.closest('.color-scheme-group-list')) return;
            colorSchemeGroup2.scrollIntoView({ inline: 'center', behavior: 'smooth' });
        });

        // 自定义组（默认隐藏，有自定义配色时显示）
        colorSchemeGroup3 = document.createElement('div');
        colorSchemeGroup3.className = 'color-scheme-group';
        colorSchemeGroup3.style.display = 'none';

        const groupLabel3 = document.createElement('div');
        groupLabel3.className = 'color-scheme-group-label';
        groupLabel3.textContent = '自定义';
        colorSchemeGroup3.appendChild(groupLabel3);

        colorSchemeGroupList3 = document.createElement('div');
        colorSchemeGroupList3.className = 'color-scheme-group-list';
        colorSchemeGroup3.appendChild(colorSchemeGroupList3);
        colorSchemeGroup3.addEventListener('click', (e) => {
            if (e.target.closest('.color-scheme-group-list')) return;
            colorSchemeGroup3.scrollIntoView({ inline: 'center', behavior: 'smooth' });
        });
    }

    const originalItems = items.querySelectorAll('.select-item');
    originalItems.forEach(originalItem => {
        const option = document.createElement('div');
        option.className = 'settings-menu-option';
        option.setAttribute('data-value', originalItem.getAttribute('data-value'));

        // 根据菜单类型处理
        if (menuType === 'logo') {
            // Logo菜单的特殊处理
            const isTextLogoOption = originalItem.getAttribute('data-value') === 'text-logo';

            if (isTextLogoOption) {
                // 创建包含文字和输入框的结构
                const textSpan = document.createElement('span');
                textSpan.textContent = '自定义文字Logo';
                option.appendChild(textSpan);

                // 创建输入框组
                const inputGroup = document.createElement('div');
                inputGroup.className = 'text-logo-inline-group';
                inputGroup.style.display = 'none';

                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'text-logo-inline-input';
                input.placeholder = '输入文字';
                input.id = 'text-logo-input-panel';

                const btn = document.createElement('button');
                btn.className = 'text-logo-inline-btn';
                btn.title = '确定';

                inputGroup.appendChild(input);
                inputGroup.appendChild(btn);
                option.appendChild(inputGroup);

                // 计算字符长度（中文算2个字符）
                const getCharLength = (str) => {
                    let length = 0;
                    for (let i = 0; i < str.length; i++) {
                        const charCode = str.charCodeAt(i);
                        if (charCode > 127) {
                            length += 2;
                        } else {
                            length += 1;
                        }
                    }
                    return length;
                };

                // 检查输入长度
                const checkInputLength = () => {
                    const text = input.value;
                    const length = getCharLength(text);
                    if (length > 25) {
                        btn.disabled = true;
                        btn.classList.add('disabled');
                        input.classList.add('error');
                        self.showNotification('超出输入范围');
                        return false;
                    } else {
                        btn.disabled = false;
                        btn.classList.remove('disabled');
                        input.classList.remove('error');
                        return true;
                    }
                };

                // 检查是否是当前选中的值
                if (self.settings.logo === 'text-logo') {
                    option.classList.add('selected');
                    inputGroup.style.display = 'flex';
                    input.value = self.settings.textLogo || '';
                    checkInputLength();
                }

                // 点击选项时显示输入框
                option.addEventListener('click', (e) => {
                    // 如果点击的是输入框或按钮，不处理
                    if (e.target === input || e.target === btn) {
                        return;
                    }

                    // 显示输入框
                    inputGroup.style.display = 'flex';
                    option.classList.add('selected');
                    input.focus();
                });

                // 输入框事件
                input.addEventListener('click', (e) => {
                    e.stopPropagation();
                });

                input.addEventListener('input', () => {
                    checkInputLength();
                });

                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        btn.click();
                    }
                });

                // 确定按钮事件
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (btn.disabled) return;

                    const text = input.value.trim();
                    if (text) {
                        self.settings.logoType = 'text';
                        self.settings.logo = 'text-logo';
                        self.settings.textLogo = text;
                        self.userChangedLogo = true;
                        self.applyLogo();
                        self.saveSettings();
                        self.showNotification('文字Logo设置');

                        selected.textContent = '自定义文字Logo';
                        hiddenSelect.value = 'text-logo';
                        self.closeSettingsMenuInRightPanel();
                    } else {
                        self.showNotification('请输入文本');
                    }
                });
            } else {
                // 检查是否是自定义Logo
                const logoValue = originalItem.getAttribute('data-value');
                const isCustomLogoClass = originalItem.classList.contains('select-item-custom-logo');

                // 预设Logo列表
                const presetLogos = ['default', 'auto', 'Google', 'Microsoft', 'Bing', 'Baidu', 'DuckDuckGo', 'Sogou', '360', 'Yahoo', 'Yandex', 'Apple', 'HUAWEI', 'text-logo'];
                const isPresetLogo = presetLogos.includes(logoValue);

                // 如果是预设Logo，直接显示文本
                if (isPresetLogo && !isCustomLogoClass) {
                    option.textContent = originalItem.textContent;

                    if (self.settings.logo === logoValue) {
                        option.classList.add('selected');
                    }

                    option.addEventListener('click', () => {
                        const value = option.getAttribute('data-value');
                        const text = option.textContent;
                        selected.textContent = text;

                        hiddenSelect.value = value;
                        const event = new Event('change', { bubbles: true });
                        hiddenSelect.dispatchEvent(event);

                        self.closeSettingsMenuInRightPanel();
                    });
                }
                // 如果是自定义Logo（通过类名或不在预设列表中）
                else if (isCustomLogoClass || !isPresetLogo) {
                    // 直接从settings.customLogos中查找
                    const logoName = logoValue || originalItem.textContent.trim();
                    const customLogo = self.settings.customLogos.find(logo => logo.name === logoName);

                    if (customLogo) {
                        // 创建包含Logo名称和上传暗色Logo按钮的结构
                        const contentWrapper = document.createElement('div');
                        contentWrapper.className = 'custom-logo-option-wrapper';

                        const textSpan = document.createElement('span');
                        textSpan.className = 'custom-logo-name';
                        // 显示Logo名称，过长时用省略号
                        const displayName = customLogo.name.length > 10 ? customLogo.name.substring(0, 10) + '...' : customLogo.name;
                        textSpan.textContent = displayName;
                        textSpan.title = customLogo.name;
                        contentWrapper.appendChild(textSpan);

                        // 创建按钮容器
                        const btnContainer = document.createElement('div');
                        btnContainer.className = 'custom-logo-btn-container';

                        // 创建上传暗色Logo按钮
                        const darkLogoBtn = document.createElement('button');
                        darkLogoBtn.className = 'dark-logo-upload-btn-inline';
                        darkLogoBtn.textContent = customLogo.darkData ? '更换暗色' : '上传暗色';
                        darkLogoBtn.title = customLogo.darkData ? '更换暗色Logo' : '上传暗色Logo';
                        btnContainer.appendChild(darkLogoBtn);

                        // 创建删除按钮
                        const deleteBtn = document.createElement('button');
                        deleteBtn.className = 'custom-logo-delete-btn';
                        deleteBtn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
                        deleteBtn.title = '删除此Logo';
                        btnContainer.appendChild(deleteBtn);

                        contentWrapper.appendChild(btnContainer);

                        option.appendChild(contentWrapper);

                        // 检查是否是当前选中的值
                        if (self.settings.logo === customLogo.name) {
                            option.classList.add('selected');
                        }

                        // 点击选项时选中并应用
                        option.addEventListener('click', (e) => {
                            if (e.target === darkLogoBtn || e.target === deleteBtn || e.target.closest('.custom-logo-delete-btn')) {
                                return;
                            }

                            // 移除其他选项的selected类
                            optionsList.querySelectorAll('.settings-menu-option').forEach(opt => {
                                opt.classList.remove('selected');
                            });
                            option.classList.add('selected');

                            // 应用Logo
                            selected.textContent = displayName;
                            hiddenSelect.value = customLogo.name;
                            const event = new Event('change', { bubbles: true });
                            hiddenSelect.dispatchEvent(event);

                            self.closeSettingsMenuInRightPanel();
                        });

                        // 上传暗色Logo按钮点击事件
                        darkLogoBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            // 设置当前正在上传暗色Logo的目标
                            self._currentDarkLogoTarget = customLogo.name;
                            document.getElementById('dark-logo-upload').click();
                        });

                        // 删除按钮点击事件
                        deleteBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            // 找到并删除这个Logo
                            const logoIndex = self.settings.customLogos.findIndex(logo => logo.name === customLogo.name);
                            if (logoIndex !== -1) {
                                self.deleteCustomLogo(logoIndex);
                                // 重新获取更新后的items
                                const updatedItems = document.getElementById('logo-select-items');
                                self.showSettingsMenuInRightPanel(updatedItems, selected, hiddenSelect, true);
                            }
                        });
                    } else {
                        // 如果在customLogos中找不到，可能是DOM残留，跳过
                        return;
                    }
                } else {
                    // 其他情况，显示文本
                    option.textContent = originalItem.textContent;

                    if (self.settings.logo === logoValue) {
                        option.classList.add('selected');
                    }

                    option.addEventListener('click', () => {
                        const value = option.getAttribute('data-value');
                        const text = option.textContent;
                        selected.textContent = text;

                        hiddenSelect.value = value;
                        const event = new Event('change', { bubbles: true });
                        hiddenSelect.dispatchEvent(event);

                        self.closeSettingsMenuInRightPanel();
                    });
                }
            }
        } else if (menuType === 'font') {
            // 字体菜单的处理
            const fontValue = originalItem.getAttribute('data-value');
            const isCustomFontClass = originalItem.classList.contains('select-item-custom-font');

            // 预设字体列表
            const presetFonts = ['Sans Flex', 'HMSC', 'Ginto', 'Josefin', 'Code'];
            const isPresetFont = presetFonts.includes(fontValue);

            // 如果是自定义字体
            if (isCustomFontClass || !isPresetFont) {
                const customFont = self.settings.customFonts.find(font => font.name === fontValue);

                if (customFont) {
                    // 创建包含字体名称和删除按钮的结构
                    const contentWrapper = document.createElement('div');
                    contentWrapper.className = 'custom-font-option-wrapper';

                    const textSpan = document.createElement('span');
                    textSpan.className = 'custom-font-name';
                    // 显示字体名称，过长时用省略号
                    const displayName = customFont.name.length > 15 ? customFont.name.substring(0, 15) + '...' : customFont.name;
                    textSpan.textContent = displayName;
                    textSpan.title = customFont.name;
                    contentWrapper.appendChild(textSpan);

                    // 创建删除按钮
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'custom-font-delete-btn';
                    deleteBtn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
                    deleteBtn.title = '删除此字体';
                    contentWrapper.appendChild(deleteBtn);

                    option.appendChild(contentWrapper);

                    // 检查是否是当前选中的值
                    if (self.settings.font === customFont.name) {
                        // 字体仍由主题接管时仅字体名匹配才高亮
                        const themeInfo = self.getThemeDisplayInfo();
                        if (!themeInfo || !themeInfo.fontName || themeInfo.fontName === customFont.name) {
                            option.classList.add('selected');
                        }
                    }

                    // 点击选项时选中并应用
                    option.addEventListener('click', (e) => {
                        if (e.target === deleteBtn || e.target.closest('.custom-font-delete-btn')) {
                            return;
                        }

                        // 移除其他选项的selected类
                        optionsList.querySelectorAll('.settings-menu-option').forEach(opt => {
                            opt.classList.remove('selected');
                        });
                        option.classList.add('selected');

                        // 应用字体
                        selected.textContent = displayName;
                        hiddenSelect.value = customFont.name;
                        const event = new Event('change', { bubbles: true });
                        hiddenSelect.dispatchEvent(event);

                        self.closeSettingsMenuInRightPanel();
                    });

                    // 删除按钮点击事件
                    deleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        // 找到并删除这个字体
                        const fontIndex = self.settings.customFonts.findIndex(font => font.name === customFont.name);
                        if (fontIndex !== -1) {
                            self.deleteCustomFont(fontIndex);
                            // 重新获取更新后的items
                            const updatedItems = document.getElementById('font-select-items');
                            self.showSettingsMenuInRightPanel(updatedItems, selected, hiddenSelect, true);
                        }
                    });
                } else {
                    // 如果在customFonts中找不到，可能是DOM残留，跳过
                    return;
                }
            } else {
                // 预设字体，直接显示文本
                option.textContent = originalItem.textContent;

                if (self.settings.font === fontValue) {
                    // 字体仍由主题接管时仅字体名匹配预设才高亮（路径由 normalizeThemePaths 处理过，不做字符串对比）
                    const themeInfo = self.getThemeDisplayInfo();
                    if (!themeInfo || !themeInfo.fontName || themeInfo.fontName === fontValue) {
                        option.classList.add('selected');
                    }
                }

                option.addEventListener('click', () => {
                    const value = option.getAttribute('data-value');
                    const text = option.textContent;
                    selected.textContent = text;

                    hiddenSelect.value = value;
                    const event = new Event('change', { bubbles: true });
                    hiddenSelect.dispatchEvent(event);

                    self.closeSettingsMenuInRightPanel();
                });
            }
        } else if (menuType === 'wallpaper') {
            // 壁纸菜单的处理
            //
            // 本次格式识别上线前上传的壁纸没有 format 字段，先补一次识别再渲染，
            // 否则老用户的壁纸库一个方框都不会显示（同步返回，无缺项时零开销）。
            self.backfillWallpaperFormats();

            const wallpaperValue = originalItem.getAttribute('data-value');
            const isCustomWallpaperClass = originalItem.classList.contains('select-item-custom-wallpaper');

            // 预设壁纸列表
            const presetWallpapers = ['default', 'bing', 'url'];
            const isPresetWallpaper = presetWallpapers.includes(wallpaperValue);

            // 如果是自定义壁纸
            if (isCustomWallpaperClass || !isPresetWallpaper) {
                const customWallpaper = self.settings.customWallpapers.find(wp => wp.name === wallpaperValue);

                if (customWallpaper) {
                    // 创建包含壁纸名称和删除按钮的结构
                    const contentWrapper = document.createElement('div');
                    contentWrapper.className = 'custom-wallpaper-option-wrapper';

                    const textSpan = document.createElement('span');
                    textSpan.className = 'custom-wallpaper-name';
                    // 显示壁纸名称，过长时用省略号
                    const displayName = customWallpaper.name.length > 15 ? customWallpaper.name.substring(0, 15) + '...' : customWallpaper.name;
                    textSpan.textContent = displayName;
                    textSpan.title = customWallpaper.name;
                    contentWrapper.appendChild(textSpan);

                    // 创建删除按钮
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'custom-wallpaper-delete-btn';
                    deleteBtn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
                    deleteBtn.title = '删除此壁纸';
                    contentWrapper.appendChild(deleteBtn);

                    // HDR / 实况照片方框，放在删除按钮左侧
                    const formatBadges = self.buildWallpaperFormatBadges(customWallpaper);
                    if (formatBadges) contentWrapper.insertBefore(formatBadges, deleteBtn);

                    option.appendChild(contentWrapper);

                    // 检查是否是当前选中的值
                    if (self.settings.wallpaper === customWallpaper.data) {
                        option.classList.add('selected');
                    }

                    // 点击选项时选中并应用
                    option.addEventListener('click', (e) => {
                        if (e.target === deleteBtn || e.target.closest('.custom-wallpaper-delete-btn')) {
                            return;
                        }
                        // 格式方框是开关，点它不该等于选中这张壁纸（它自己已经 stopPropagation，
                        // 这里再挡一道，免得以后方框挪出 wrapper 就漏了）
                        if (e.target.closest && e.target.closest('.wallpaper-format-badge')) {
                            return;
                        }

                        // 移除其他选项的selected类
                        optionsList.querySelectorAll('.settings-menu-option').forEach(opt => {
                            opt.classList.remove('selected');
                        });
                        option.classList.add('selected');

                        // 应用壁纸
                        selected.textContent = displayName;
                        hiddenSelect.value = customWallpaper.name;
                        const event = new Event('change', { bubbles: true });
                        hiddenSelect.dispatchEvent(event);

                        self.closeSettingsMenuInRightPanel();
                    });

                    // 删除按钮点击事件
                    deleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        // 找到并删除这个壁纸
                        const wallpaperIndex = self.settings.customWallpapers.findIndex(wp => wp.name === customWallpaper.name);
                        if (wallpaperIndex !== -1) {
                            self.deleteCustomWallpaper(wallpaperIndex);
                            // 重新获取更新后的items
                            const updatedItems = document.getElementById('wallpaper-select-items');
                            self.showSettingsMenuInRightPanel(updatedItems, selected, hiddenSelect, true);
                        }
                    });
                } else {
                    // 如果在customWallpapers中找不到，可能是DOM残留，跳过
                    return;
                }
            } else {
                // 预设壁纸处理
                if (wallpaperValue === 'bing') {
                    // 必应壁纸特殊处理：显示文本、图标和配置
                    option.style.flexDirection = 'column';
                    option.style.alignItems = 'stretch';
                    option.style.gap = '0';
                    const contentWrapper = document.createElement('div');
                    contentWrapper.className = 'bing-wallpaper-option-wrapper';
                    contentWrapper.style.display = 'flex';
                    contentWrapper.style.alignItems = 'center';
                    contentWrapper.style.justifyContent = 'space-between';

                    const textSpan = document.createElement('span');
                    textSpan.textContent = '必应每日壁纸';
                    contentWrapper.appendChild(textSpan);

                    const infoIcon = document.createElement('span');
                    infoIcon.className = 'material-icons info-icon';
                    infoIcon.textContent = 'info';
                    infoIcon.style.fontSize = '16px';
                    infoIcon.style.color = 'rgba(255, 255, 255, 0.6)';
                    infoIcon.style.cursor = 'pointer';
                    infoIcon.style.marginLeft = '8px';
                    infoIcon.addEventListener('click', (e) => {
                        e.stopPropagation();
                        self.showBingTooltip();
                    });
                    contentWrapper.appendChild(infoIcon);

                    option.appendChild(contentWrapper);

                    // 创建配置区域（参考代理配置样式）
                    const configWrapper = document.createElement('div');
                    configWrapper.className = 'bing-config-wrapper';
                    configWrapper.style.display = 'none';
                    configWrapper.style.marginTop = '8px';
                    configWrapper.style.paddingTop = '8px';
                    configWrapper.style.width = '100%';

                    // 配置行：开关 + 输入框 + 确认按钮
                    const configRow = document.createElement('div');
                    configRow.style.display = 'flex';
                    configRow.style.alignItems = 'center';
                    configRow.style.gap = '8px';
                    configRow.style.width = '100%';

                    // 开关（与页面其他开关样式一致）
                    const switchToggle = document.createElement('label');
                    switchToggle.className = 'switch';
                    switchToggle.style.position = 'relative';
                    switchToggle.style.display = 'inline-block';
                    switchToggle.style.width = '52px';
                    switchToggle.style.height = '28px';
                    switchToggle.style.verticalAlign = 'middle';
                    switchToggle.style.flexShrink = '0';

                    const switchInput = document.createElement('input');
                    switchInput.type = 'checkbox';
                    switchInput.checked = self.settings.bingRefreshEveryTime;
                    switchInput.style.opacity = '0';
                    switchInput.style.width = '0';
                    switchInput.style.height = '0';

                    const switchSlider = document.createElement('span');
                    switchSlider.className = 'slider';
                    switchSlider.style.position = 'absolute';
                    switchSlider.style.cursor = 'pointer';
                    switchSlider.style.top = '0';
                    switchSlider.style.left = '0';
                    switchSlider.style.right = '0';
                    switchSlider.style.bottom = '0';
                    switchSlider.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                    switchSlider.style.transition = 'all 0.2s ease';
                    switchSlider.style.borderRadius = '28px';

                    const sliderKnob = document.createElement('span');
                    sliderKnob.style.position = 'absolute';
                    sliderKnob.style.height = '22px';
                    sliderKnob.style.width = '22px';
                    sliderKnob.style.left = '3px';
                    sliderKnob.style.bottom = '3px';
                    sliderKnob.style.backgroundColor = 'white';
                    sliderKnob.style.transition = 'all 0.2s ease';
                    sliderKnob.style.borderRadius = '50%';
                    sliderKnob.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
                    switchSlider.appendChild(sliderKnob);

                    const updateSwitchState = () => {
                        if (switchInput.checked) {
                            const colorConfig = this.getColorConfig();
                            switchSlider.style.backgroundColor = colorConfig.accent;
                            sliderKnob.style.transform = 'translateX(24px)';
                        } else {
                            switchSlider.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                            sliderKnob.style.transform = 'translateX(0)';
                        }
                    };
                    updateSwitchState();

                    switchToggle.appendChild(switchInput);
                    switchToggle.appendChild(switchSlider);
                    configRow.appendChild(switchToggle);

                    // 输入框
                    const intervalInput = document.createElement('input');
                    intervalInput.type = 'number';
                    intervalInput.className = 'bing-interval-input';
                    intervalInput.placeholder = '刷新间隔(小时)';
                    intervalInput.min = '0.1';
                    intervalInput.max = '9999';
                    intervalInput.step = '0.1';
                    intervalInput.disabled = self.settings.bingRefreshEveryTime;
                    intervalInput.style.flex = '1';
                    intervalInput.style.minWidth = '0';
                    intervalInput.style.padding = '6px 10px';
                    intervalInput.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                    intervalInput.style.borderRadius = '6px';
                    intervalInput.style.background = 'transparent';
                    intervalInput.style.color = 'white';
                    intervalInput.style.fontFamily = 'inherit';
                    intervalInput.style.fontSize = '12px';
                    intervalInput.style.outline = 'none';
                    intervalInput.style.transition = 'border-color 0.2s ease';
                    intervalInput.style.MozAppearance = 'textfield';
                    intervalInput.style.WebkitAppearance = 'none';
                    intervalInput.style.appearance = 'textfield';
                    if (!self.settings.bingRefreshEveryTime && self.settings.bingRefreshInterval > 0) {
                        intervalInput.value = self.settings.bingRefreshInterval;
                    }
                    configRow.appendChild(intervalInput);

                    // 确认按钮
                    const confirmBtn = document.createElement('button');
                    confirmBtn.className = 'bing-interval-confirm-btn';
                    confirmBtn.disabled = self.settings.bingRefreshEveryTime;
                    confirmBtn.style.width = '28px';
                    confirmBtn.style.height = '28px';
                    confirmBtn.style.padding = '0';
                    confirmBtn.style.border = 'none';
                    confirmBtn.style.borderRadius = '6px';
                    confirmBtn.style.background = 'transparent';
                    confirmBtn.style.color = 'white';
                    confirmBtn.style.cursor = 'pointer';
                    confirmBtn.style.transition = 'all 0.2s ease';
                    confirmBtn.style.display = 'flex';
                    confirmBtn.style.alignItems = 'center';
                    confirmBtn.style.justifyContent = 'center';
                    confirmBtn.style.flexShrink = '0';
                    confirmBtn.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'20 6 9 17 4 12\'%3E%3C/polyline%3E%3C/svg%3E")';
                    confirmBtn.style.backgroundRepeat = 'no-repeat';
                    confirmBtn.style.backgroundPosition = 'center';
                    confirmBtn.style.backgroundSize = '16px';
                    configRow.appendChild(confirmBtn);

                    configWrapper.appendChild(configRow);
                    option.appendChild(configWrapper);

                    // 开关事件
                    switchInput.addEventListener('change', (e) => {
                        const isChecked = e.target.checked;
                        self.settings.bingRefreshEveryTime = isChecked;
                        intervalInput.disabled = isChecked;
                        confirmBtn.disabled = isChecked;
                        // 开关两个分支共用同一套重置逻辑，仅透明度不同
                        self.settings.bingRefreshInterval = 0;
                        localStorage.removeItem('bingLastRefreshTime');
                        intervalInput.value = '';
                        intervalInput.style.opacity = isChecked ? '0.5' : '1';
                        self.saveSettings();
                        updateSwitchState();
                    });

                    // 输入框焦点样式
                    intervalInput.addEventListener('focus', () => {
                        intervalInput.style.borderColor = 'white';
                    });

                    intervalInput.addEventListener('blur', () => {
                        intervalInput.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    });

                    // 输入验证：不在输入过程中钳制下限（否则无法输入如 0.5 的中间态），
                    // 下限由确认按钮统一校验；仅限制上限避免超大输入
                    intervalInput.addEventListener('input', (e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value) && value > 9999) e.target.value = 9999;
                    });

                    // 确认按钮事件
                    confirmBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const inputValue = intervalInput.value.trim();
                        if (!inputValue) {
                            self.settings.bingRefreshInterval = 0;
                            localStorage.removeItem('bingLastRefreshTime');
                            self.saveSettings();
                            self.showNotification('已设置为不自动刷新');
                            return;
                        }
                        const value = parseFloat(inputValue);
                        if (isNaN(value) || value < 0.1 || value > 9999) {
                            self.showNotification('请输入0.1-9999之间的数字');
                            return;
                        }
                        self.settings.bingRefreshInterval = value;
                        localStorage.setItem('bingLastRefreshTime', Date.now().toString());
                        self.saveSettings();
                        self.showNotification(`必应壁纸刷新间隔已设置为 ${value} 小时`);
                    });

                    // 确认按钮悬停样式
                    confirmBtn.addEventListener('mouseenter', () => {
                        if (!confirmBtn.disabled) {
                            confirmBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                        }
                    });

                    confirmBtn.addEventListener('mouseleave', () => {
                        confirmBtn.style.backgroundColor = 'transparent';
                    });

                    // 检查是否是当前选中的值
                    if (self.settings.wallpaper === 'bing') {
                        // 壁纸仍由主题接管时不自动高亮
                        if (!self.isThemeWallpaperActive()) {
                            option.classList.add('selected');
                            configWrapper.style.display = 'block';
                        }
                    }

                    // 点击选项时显示/隐藏配置
                    option.addEventListener('click', (e) => {
                        if (e.target === intervalInput || e.target === confirmBtn || e.target.closest('.switch')) {
                            return;
                        }

                        // 移除其他选项的selected类
                        optionsList.querySelectorAll('.settings-menu-option').forEach(opt => {
                            opt.classList.remove('selected');
                        });
                        option.classList.add('selected');

                        if (configWrapper.style.display === 'none') {
                            configWrapper.style.display = 'block';
                        } else {
                            configWrapper.style.display = 'none';
                        }

                        // 应用必应壁纸
                        selected.textContent = '必应每日壁纸';
                        hiddenSelect.value = 'bing';
                        const event = new Event('change', { bubbles: true });
                        hiddenSelect.dispatchEvent(event);
                    });
                } else if (wallpaperValue === 'url') {
                    // URL壁纸特殊处理：参考必应壁纸样式优化布局
                    option.style.flexDirection = 'column';
                    option.style.alignItems = 'stretch';
                    option.style.gap = '0';

                    const contentWrapper = document.createElement('div');
                    contentWrapper.style.display = 'flex';
                    contentWrapper.style.alignItems = 'center';
                    contentWrapper.style.justifyContent = 'space-between';
                    const textSpan = document.createElement('span');
                    textSpan.textContent = 'URL链接';
                    contentWrapper.appendChild(textSpan);
                    option.appendChild(contentWrapper);

                    // 创建配置区域
                    const configWrapper = document.createElement('div');
                    configWrapper.className = 'url-config-wrapper';
                    configWrapper.style.display = 'none';
                    configWrapper.style.marginTop = '8px';
                    configWrapper.style.paddingTop = '8px';
                    configWrapper.style.width = '100%';

                    const inputRow = document.createElement('div');
                    inputRow.style.display = 'flex';
                    inputRow.style.alignItems = 'center';
                    inputRow.style.gap = '8px';
                    inputRow.style.width = '100%';

                    const urlInput = document.createElement('input');
                    urlInput.type = 'text';
                    urlInput.className = 'setting-input';
                    urlInput.placeholder = '输入壁纸图片URL链接';
                    urlInput.style.flex = '1';
                    urlInput.style.padding = '6px 10px';
                    urlInput.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                    urlInput.style.borderRadius = '6px';
                    urlInput.style.background = 'transparent';
                    urlInput.style.color = 'white';
                    urlInput.style.fontFamily = 'inherit';
                    urlInput.style.fontSize = '12px';
                    urlInput.style.outline = 'none';
                    urlInput.style.transition = 'border-color 0.2s ease';
                    if (self.settings.wallpaperUrl) {
                        urlInput.value = self.settings.wallpaperUrl;
                    }
                    inputRow.appendChild(urlInput);

                    const applyBtn = document.createElement('button');
                    applyBtn.className = 'text-logo-btn';
                    applyBtn.style.width = '28px';
                    applyBtn.style.height = '28px';
                    applyBtn.style.padding = '0';
                    applyBtn.style.border = 'none';
                    applyBtn.style.borderRadius = '6px';
                    applyBtn.style.background = 'transparent';
                    applyBtn.style.cursor = 'pointer';
                    applyBtn.style.transition = 'background 0.2s ease';
                    applyBtn.style.display = 'flex';
                    applyBtn.style.alignItems = 'center';
                    applyBtn.style.justifyContent = 'center';
                    applyBtn.style.flexShrink = '0';
                    applyBtn.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'20 6 9 17 4 12\'%3E%3C/polyline%3E%3C/svg%3E")';
                    applyBtn.style.backgroundRepeat = 'no-repeat';
                    applyBtn.style.backgroundPosition = 'center';
                    applyBtn.style.backgroundSize = '16px';
                    inputRow.appendChild(applyBtn);

                    configWrapper.appendChild(inputRow);
                    option.appendChild(configWrapper);

                    // 应用按钮事件
                    applyBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const url = urlInput.value.trim();
                        if (!url) {
                            self.showNotification('请输入URL');
                            return;
                        }
                        try {
                            new URL(url);
                        } catch (err) {
                            self.showNotification('URL格式错误');
                            return;
                        }

                        self.settings.wallpaper = 'url';
                        self.settings.wallpaperUrl = url;
                        self.applySettings();
                        self.saveSettings();
                        self.showNotification('URL壁纸已应用');
                        self.closeSettingsMenuInRightPanel();
                    });

                    // 输入框焦点样式
                    urlInput.addEventListener('focus', () => {
                        urlInput.style.borderColor = 'white';
                    });
                    urlInput.addEventListener('blur', () => {
                        urlInput.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    });

                    // 确认按钮悬停样式
                    applyBtn.addEventListener('mouseenter', () => {
                        applyBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                    });
                    applyBtn.addEventListener('mouseleave', () => {
                        applyBtn.style.backgroundColor = 'transparent';
                    });

                    // 输入框回车事件
                    urlInput.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            applyBtn.click();
                        }
                    });

                    // 检查是否是当前选中的值
                    if (self.settings.wallpaper === 'url') {
                        // 壁纸仍由主题接管时不自动高亮
                        if (!self.isThemeWallpaperActive()) {
                            option.classList.add('selected');
                            configWrapper.style.display = 'block';
                        }
                    }

                    // 点击选项时显示/隐藏配置
                    option.addEventListener('click', (e) => {
                        if (e.target === urlInput || e.target === applyBtn) {
                            return;
                        }

                        // 移除其他选项的selected类
                        optionsList.querySelectorAll('.settings-menu-option').forEach(opt => {
                            opt.classList.remove('selected');
                        });
                        option.classList.add('selected');

                        if (configWrapper.style.display === 'none') {
                            configWrapper.style.display = 'block';
                            urlInput.focus();
                        } else {
                            configWrapper.style.display = 'none';
                        }
                    });
                } else {
                    // 默认壁纸
                    option.textContent = originalItem.textContent;

                    // 检查是否是当前选中的值
                    if (self.settings.wallpaper === 'default' && wallpaperValue === 'default') {
                        // 壁纸仍由主题接管时不自动高亮
                        if (!self.isThemeWallpaperActive()) {
                            option.classList.add('selected');
                        }
                    }

                    option.addEventListener('click', () => {
                        const value = option.getAttribute('data-value');
                        const text = option.textContent;
                        selected.textContent = text;

                        hiddenSelect.value = value;
                        const event = new Event('change', { bubbles: true });
                        hiddenSelect.dispatchEvent(event);

                        self.closeSettingsMenuInRightPanel();
                    });
                }
            }
        } else if (menuType === 'proxy') {
            const isCustomProxy = originalItem.getAttribute('data-value') === 'custom';

            if (isCustomProxy) {
                option.textContent = '自定义端口';

                const inputWrapper = document.createElement('div');
                inputWrapper.className = 'proxy-custom-input-wrapper';
                inputWrapper.style.display = 'none';

                const portInput = document.createElement('input');
                portInput.type = 'number';
                portInput.className = 'proxy-custom-port-input';
                portInput.placeholder = '输入端口号...';
                portInput.min = 1;
                portInput.max = 65535;

                const confirmProxyBtn = document.createElement('button');
                confirmProxyBtn.className = 'proxy-custom-confirm-btn';
                confirmProxyBtn.setAttribute('aria-label', '确认代理端口');
                confirmProxyBtn.setAttribute('data-action', 'confirm-proxy');

                inputWrapper.appendChild(portInput);
                inputWrapper.appendChild(confirmProxyBtn);
                option.appendChild(inputWrapper);

                confirmProxyBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const portValue = portInput.value.trim();
                    if (portValue && !isNaN(portValue) && parseInt(portValue, 10) >= 1 && parseInt(portValue, 10) <= 65535) {
                        const port = parseInt(portValue, 10);
                        self.settings.proxyPort = port;
                        ProxyManager.setProxy(port);
                        self.saveSettings();
                        self.updateProxySelectedText(port);
                        hiddenSelect.value = 'custom';
                        self.showNotification('代理端口已设置为 ' + port);
                        self.closeSettingsMenuInRightPanel();
                    } else {
                        self.showNotification('请输入有效的端口号 (1-65535)');
                    }
                });

                option.addEventListener('click', (e) => {
                    if (e.target.closest('.proxy-custom-confirm-btn') || e.target === portInput) {
                        return;
                    }
                    if (inputWrapper.style.display === 'none' || inputWrapper.style.display === '') {
                        inputWrapper.style.display = 'block';
                    } else {
                        inputWrapper.style.display = 'none';
                    }
                });
            } else {
                option.textContent = originalItem.textContent;

                const currentProxyPort = ProxyManager.getProxyPort();
                const itemValue = originalItem.getAttribute('data-value');

                if (itemValue && parseInt(itemValue) === currentProxyPort) {
                    option.classList.add('selected');
                }

                option.addEventListener('click', () => {
                    const value = option.getAttribute('data-value');
                    let text = '';
                    let portNum = null;

                    if (value === '') {
                        text = '不使用代理';
                        portNum = null;
                    } else {
                        portNum = parseInt(value, 10);
                        text = option.textContent.replace(/\s*\(.*?\)\s*/, '').trim();
                    }

                    selected.textContent = text;
                    hiddenSelect.value = value;
                    const event = new Event('change', { bubbles: true });
                    hiddenSelect.dispatchEvent(event);

                    self.settings.proxyPort = portNum;
                    ProxyManager.setProxy(portNum);
                    self.saveSettings();
                    self.showNotification(portNum ? '代理端口已设置为 ' + portNum : '代理已关闭');

                    self.closeSettingsMenuInRightPanel();
                });
            }
        } else if (menuType === 'context-menu') {
            // 右键菜单样式选项
            option.textContent = originalItem.textContent;

            const currentValue = originalItem.getAttribute('data-value');
            if (hiddenSelect.value === currentValue) {
                option.classList.add('selected');
            }

            option.addEventListener('click', () => {
                const value = option.getAttribute('data-value');
                const text = option.textContent;
                selected.textContent = text;
                hiddenSelect.value = value;

                // 更新选中态
                optionsList.querySelectorAll('.settings-menu-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                option.classList.add('selected');

                self.settings.contextMenuStyle = value;

                // 实时切换设置图标显隐（需 important 覆盖 CSS）
                const btn = rightPanelUpper.querySelector('.upload-btn.settings-plus-btn');
                if (btn) {
                    if (value === 'minimal') {
                        btn.style.setProperty('display', 'none', 'important');
                    } else {
                        btn.style.removeProperty('display');
                    }
                }

                // 立即应用到右键菜单（添加/移除 compact/minimal 类）
                self.applyContextMenuStyle();

                self.closeSettingsMenuInRightPanel();
            });
        } else if (menuType === 'color-scheme') {
            const dot = originalItem.querySelector('.color-scheme-dot');
            if (dot) {
                const dotClone = dot.cloneNode(true);
                dotClone.classList.add('selected-dot');
                option.appendChild(dotClone);
            }
            const textSpan = document.createElement('span');
            textSpan.textContent = COLOR_SCHEME_NAMES[originalItem.getAttribute('data-value')] || originalItem.textContent;
            option.appendChild(textSpan);

            const currentValue = originalItem.getAttribute('data-value');
            if (hiddenSelect.value === currentValue) {
                // 主题模式下若配色为 add 组（自定义配色方案），不高亮任何选项（配色被手动定制后不再抑制）
                const themeInfo = self.getThemeDisplayInfo();
                const isAddGroup = themeInfo && themeInfo.colorName && self.themes[self.settings.theme]?.details?.color?.specialStyle?.colorGroup === 'add';
                if (!isAddGroup) {
                    option.classList.add('selected');
                }
            }

            option.addEventListener('click', () => {
                const value = option.getAttribute('data-value');
                const text = textSpan.textContent;

                // 自定义配色
                if (value === 'custom') {
                    const hasColor = self.settings.customPrimaryColor && self.settings.customPrimaryColor.trim();
                    if (hasColor) {
                        self.settings.colorScheme = 'custom';
                        self.saveSettings();
                        self.applyColorScheme();
                        optionsList.querySelectorAll('.settings-menu-option').forEach(opt => {
                            opt.classList.remove('selected');
                        });
                        option.classList.add('selected');
                        selected.textContent = text;
                        hiddenSelect.value = value;
                        const event = new Event('change', { bubbles: true });
                        hiddenSelect.dispatchEvent(event);
                        // 立即更新左面板配色显示
                        self.updateColorSchemeSelectDisplay();
                    }
                    self.panelTransition(rightPanelUpper, 'push', () => self.showCustomColorEditorInPanel(rightPanelUpper, selected, hiddenSelect, text, optionsList));
                    return;
                }

                optionsList.querySelectorAll('.settings-menu-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                option.classList.add('selected');

                selected.textContent = text;

                hiddenSelect.value = value;
                const event = new Event('change', { bubbles: true });
                hiddenSelect.dispatchEvent(event);

                self.closeSettingsMenuInRightPanel();
            });
        } else {
            // 其他菜单的通用处理
            option.textContent = originalItem.textContent;

            // 检查是否是当前选中的值
            const currentValue = originalItem.getAttribute('data-value');
            if (hiddenSelect.value === currentValue) {
                option.classList.add('selected');
            }

            option.addEventListener('click', () => {
                const value = option.getAttribute('data-value');
                const text = option.textContent;
                selected.textContent = text;

                hiddenSelect.value = value;
                const event = new Event('change', { bubbles: true });
                hiddenSelect.dispatchEvent(event);

                self.closeSettingsMenuInRightPanel();
            });
        }

        const itemGroup = originalItem.getAttribute('data-group');
        if (itemGroup === 'classic' && colorSchemeGroupList) {
            colorSchemeGroupList.appendChild(option);
        } else if (itemGroup === 'newstar' && colorSchemeGroupList2) {
            colorSchemeGroupList2.appendChild(option);
        } else if (itemGroup === 'custom' && colorSchemeGroupList3) {
            colorSchemeGroupList3.appendChild(option);
        } else if (colorSchemeGroupList) {
            colorSchemeGroupList.appendChild(option);
        } else {
            optionsList.appendChild(option);
        }
    });

    // 渲染自定义配色方案选项
    function renderCustomOptions() {
        if (!colorSchemeGroupList3) return;
        colorSchemeGroupList3.innerHTML = '';
        const customColors = self.settings.customColors || [];
        customColors.forEach((cc, idx) => {
            const opt = document.createElement('div');
            opt.className = 'settings-menu-option';
            opt.setAttribute('data-value', 'custom');
            opt.setAttribute('data-custom-index', idx);

            const dot = document.createElement('span');
            dot.className = 'color-scheme-dot';
            const p = cc.primaryColor || '#cccccc';
            const s = cc.secondaryColor && cc.secondaryColor.trim() ? cc.secondaryColor : p;
            if (cc.gradientEnabled && cc.secondaryColor && cc.secondaryColor.trim()) {
                dot.style.background = 'linear-gradient(135deg, ' + p + ', ' + s + ')';
            } else {
                dot.style.background = p;
            }
            opt.appendChild(dot);

            const nameSpan = document.createElement('span');
            nameSpan.textContent = cc.name || '未命名';
            nameSpan.style.flex = '1';
            nameSpan.style.minWidth = '0';
            nameSpan.style.whiteSpace = 'nowrap';
            nameSpan.style.overflow = 'hidden';
            nameSpan.style.textOverflow = 'ellipsis';
            opt.appendChild(nameSpan);

            // 编辑按钮（删除移入编辑界面内）
            const editBtn = document.createElement('button');
            editBtn.className = 'custom-color-edit-btn';
            editBtn.innerHTML = '<span class="material-icons">edit</span>';
            editBtn.title = '编辑此配色';
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const name = cc.name || '自定义';
                self.panelTransition(rightPanelUpper, 'push', () => self.showCustomColorEditorInPanel(rightPanelUpper, selected, hiddenSelect, name, optionsList, idx));
            });
            opt.appendChild(editBtn);

            if (self.settings.colorScheme === 'custom' && self.settings.activeCustomColorIndex === idx) {
                opt.classList.add('selected');
            }

            colorSchemeGroupList3.appendChild(opt);
        });
        if (customColors.length > 0) {
            colorSchemeGroup3.style.display = '';
        } else {
            colorSchemeGroup3.style.display = 'none';
        }
    }

    renderCustomOptions();

    // 自定义配色选项点击事件（事件委托，只需绑定一次）
    if (menuType === 'color-scheme' && colorSchemeGroupList3 && !colorSchemeGroupList3._clickBound) {
        colorSchemeGroupList3._clickBound = true;
        colorSchemeGroupList3.addEventListener('click', (e) => {
            const opt = e.target.closest('.settings-menu-option');
            if (!opt) return;
            const idx = parseInt(opt.getAttribute('data-custom-index'), 10);
            if (isNaN(idx) || idx < 0) return;
            const cc = (self.settings.customColors || [])[idx];
            if (!cc) return;

            self.settings.colorScheme = 'custom';
            self.settings.activeCustomColorIndex = idx;
            // 手动改配色：解除主题对配色方面的接管
            self.checkThemeConsistency('colorScheme', 'custom');
            self.saveSettings();
            self.applyColorScheme();
            // 立即更新左面板配色显示
            self.updateColorSchemeSelectDisplay();
            self.closeSettingsMenuInRightPanel();
        });
    }

    if (colorSchemeGroup) {
        optionsList.appendChild(colorSchemeGroup);
    }
    if (colorSchemeGroup2) {
        optionsList.appendChild(colorSchemeGroup2);
    }
    if (colorSchemeGroup3) {
        optionsList.appendChild(colorSchemeGroup3);
    }
    // 选中经典色时居中经典色组
    const classicSchemes = ['green', 'blue', 'black-white'];
    if (colorSchemeGroup && classicSchemes.includes(self.settings.colorScheme)) {
        requestAnimationFrame(() => {
            colorSchemeGroup.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
        });
    }
    // 选中新星调时居中新星调组
    const newSchemes = ['tianyi-blue', 'vibrant-red', 'classic-gold', 'isolation'];
    if (colorSchemeGroup2 && newSchemes.includes(self.settings.colorScheme)) {
        requestAnimationFrame(() => {
            colorSchemeGroup2.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
        });
    }
    // 选中自定义时居中自定义组
    if (colorSchemeGroup3 && self.settings.colorScheme === 'custom') {
        requestAnimationFrame(() => {
            colorSchemeGroup3.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
        });
    }

    container.appendChild(optionsList);

    if (menuType === 'color-scheme') {
        let isDragging = false;
        let dragStarted = false;
        let startX = 0;
        let scrollLeft = 0;
        const onMouseMove = (e) => {
            if (!isDragging) return;
            const dx = e.pageX - startX;
            if (Math.abs(dx) > 5) {
                if (!dragStarted) {
                    dragStarted = true;
                }
                e.preventDefault();
                optionsList.scrollLeft = scrollLeft - dx;
            }
        };
        const onMouseUp = () => {
            if (isDragging) {
                isDragging = false;
                optionsList.classList.remove('dragging');
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                if (dragStarted) {
                    optionsList.dataset.dragJustHappened = 'true';
                    setTimeout(() => { delete optionsList.dataset.dragJustHappened; }, 200);
                }
                dragStarted = false;
            }
        };
        optionsList.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragStarted = false;
            startX = e.pageX;
            scrollLeft = optionsList.scrollLeft;
            optionsList.classList.add('dragging');
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'settings-menu-button-container';

    if (menuType === 'font' || menuType === 'logo' || menuType === 'wallpaper') {
        const plusBtn = document.createElement('button');
        plusBtn.className = 'upload-btn settings-plus-btn';
        plusBtn.textContent = '+';
        plusBtn.title = `上传自定义${menuType === 'font' ? '字体' : menuType === 'logo' ? 'Logo' : '壁纸'}`;

        plusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();

            if (menuType === 'font') {
                document.getElementById('font-upload').click();
            } else if (menuType === 'logo') {
                document.getElementById('logo-upload').click();
            } else if (menuType === 'wallpaper') {
                self.showWallpaperImportSelector(plusBtn);
            }
        });

        buttonContainer.appendChild(plusBtn);

        // 壁纸菜单：加号左边一枚设置齿轮（就用全站其它地方那枚 settings 字形，
        // 不自绘 SVG —— 图标形状必须与「设置」按钮、右键菜单里的那枚逐像素一致），
        // 点开面板内的「壁纸显示设置」视图。
        // 原先铺在底栏的那颗「填满」药丸已收进该视图，底栏因此只剩 [齿轮][+]。
        if (menuType === 'wallpaper') {
            const settingsEntry = document.createElement('button');
            settingsEntry.type = 'button';
            settingsEntry.className = 'wallpaper-badge-config-entry';
            // 只要 aria-label，不要 title：title 会变成浏览器系统级的悬停提示，
            // 而这一屏（含入口）要求没有任何悬停说明文字。
            settingsEntry.setAttribute('aria-label', '壁纸显示设置');
            const icon = document.createElement('span');
            icon.className = 'material-icons';
            icon.textContent = 'settings';
            settingsEntry.appendChild(icon);
            settingsEntry.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                self.panelTransition(rightPanelUpper, 'push', () => self.renderWallpaperBadgeConfigView(rightPanelUpper, true));
            });
            buttonContainer.insertBefore(settingsEntry, plusBtn);
        }

        // 一键清除按钮（超过5个自定义壁纸时显示）
        if (menuType === 'wallpaper' && self.settings.customWallpapers.length > 5) {
            const clearAllBtn = document.createElement('button');
            clearAllBtn.className = 'quick-link-clear-all-btn';
            clearAllBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> ';
            clearAllBtn.title = '删除所有自定义壁纸';
            clearAllBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                self.settings.customWallpapers = [];
                self.settings.wallpaperSeries = [];
                self.settings.wallpaper = 'default';
                self.saveSettings();
                self.updateCustomWallpapersList();
                self.applySettings();
                const selected = document.getElementById('wallpaper-select-selected');
                const hiddenSelect = document.getElementById('wallpaper-select');
                const items = document.getElementById('wallpaper-select-items');
                self.showSettingsMenuInRightPanel(items, selected, hiddenSelect);
                self.showNotification('已清除所有自定义壁纸');
            });
            optionsList.appendChild(clearAllBtn);
        }
    } else if (menuType === 'color-scheme') {
        const plusBtn = document.createElement('button');
        plusBtn.className = 'upload-btn settings-plus-btn';
        plusBtn.textContent = '+';
        plusBtn.title = '添加自定义配色';
        plusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            self.panelTransition(rightPanelUpper, 'push', () => self.showCustomColorEditorInPanel(rightPanelUpper, selected, hiddenSelect, selected.textContent, optionsList));
        });
        buttonContainer.appendChild(plusBtn);
    }

    // 字体 / Logo / 壁纸菜单：拖放导入
    // 先清理旧拖拽监听器，避免残留影响其他菜单
    if (rightPanelUpper._dragCleanup) {
        if (rightPanelUpper._dragenter) rightPanelUpper.removeEventListener('dragenter', rightPanelUpper._dragenter);
        if (rightPanelUpper._dragover) rightPanelUpper.removeEventListener('dragover', rightPanelUpper._dragover);
        if (rightPanelUpper._dragleave) rightPanelUpper.removeEventListener('dragleave', rightPanelUpper._dragleave);
        if (rightPanelUpper._drop) rightPanelUpper.removeEventListener('drop', rightPanelUpper._drop);
        rightPanelUpper._dragCleanup = false;
    }
    if (menuType === 'font' || menuType === 'logo' || menuType === 'wallpaper') {
        let dragCounter = 0;
        const showOverlay = () => {
            let overlay = rightPanelUpper.querySelector('.theme-drop-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'theme-drop-overlay';
                overlay.innerHTML = '<div class="theme-drop-overlay-text">释放文件以导入</div>';
                rightPanelUpper.appendChild(overlay);
            }
            overlay.style.display = 'flex';
        };
        const hideOverlay = () => {
            const overlay = rightPanelUpper.querySelector('.theme-drop-overlay');
            if (overlay) overlay.style.display = 'none';
        };
        rightPanelUpper._dragenter = (e) => { e.preventDefault(); e.stopPropagation(); dragCounter++; if (dragCounter === 1) showOverlay(); };
        rightPanelUpper._dragover = (e) => { e.preventDefault(); e.stopPropagation(); };
        rightPanelUpper._dragleave = (e) => { e.preventDefault(); e.stopPropagation(); dragCounter--; if (dragCounter <= 0) { dragCounter = 0; hideOverlay(); } };
        rightPanelUpper._drop = (e) => {
            e.preventDefault(); e.stopPropagation();
            dragCounter = 0; hideOverlay();
            const file = e.dataTransfer.files[0];
            if (!file) return;
            if (menuType === 'font' && (file.name.endsWith('.ttf') || file.name.endsWith('.otf'))) {
                self.handleFontUpload(file);
            } else if (menuType === 'logo' && file.type.startsWith('image/')) {
                self.handleLogoUpload(file);
            } else if (menuType === 'wallpaper' && file.type.startsWith('image/')) {
                self.handleWallpaperUpload(file);
            } else {
                self.showNotification(`不支持的${menuType === 'font' ? '字体' : menuType === 'logo' ? 'Logo' : '壁纸'}文件格式`);
            }
        };
        rightPanelUpper.addEventListener('dragenter', rightPanelUpper._dragenter);
        rightPanelUpper.addEventListener('dragover', rightPanelUpper._dragover);
        rightPanelUpper.addEventListener('dragleave', rightPanelUpper._dragleave);
        rightPanelUpper.addEventListener('drop', rightPanelUpper._drop);
        rightPanelUpper._dragCleanup = true;
    }

    if (menuType === 'context-menu') {
        const customizeBtn = document.createElement('button');
        customizeBtn.className = 'upload-btn settings-plus-btn';
        customizeBtn.innerHTML = '<span class="material-icons md3-icon" style="font-size:18px;display:flex;">settings</span>';
        customizeBtn.title = '自定义菜单项';
        if (self.settings.contextMenuStyle === 'minimal') {
            customizeBtn.style.setProperty('display', 'none', 'important');
        }

        customizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            self.panelTransition(rightPanelUpper, 'push', () => self.renderContextMenuCustomizeView(rightPanelUpper));
        });

        buttonContainer.appendChild(customizeBtn);
    }

    container.appendChild(buttonContainer);
    rightPanelUpper.appendChild(container);
    document.getElementById('settings-modal').classList.add('right-panel-open');
},
// 壁纸菜单那枚齿轮点开的「壁纸显示设置」视图，三段的顺序是：
//   ① 铺满            —— 壁纸是否填满全屏（原来底栏那颗药丸收进了这里）
//   ② 是否显示对应角标 —— LIVE / HDR 两个总开关
//   ③ 在哪显示角标     —— 一个「主页面显示」同时管两个格式（关掉 = 只在壁纸模式显示）
// 段与段之间不额外留间距、也不写组名：一行行开关等距排下来，与设置主页面一致
//（分组靠 .setting-group 的 14px 下边距，无分隔线、无组名）。
// 各项都是改动即生效：保存 + 就地重算。角标只是显示开关，不调 applyWallpaper
//（没理由顺带重设壁纸图层、重播一遍实况视频）；铺满要重排画面，必须走总入口。
renderWallpaperBadgeConfigView (rightPanelUpper, skipAnimation) {
    const self = this;
    if (!rightPanelUpper) return;
    rightPanelUpper.dataset.subView = 'wallpaper-badge-config';

    // 与侧边栏配置视图同款的两层结构（外层包裹 + 内层滚动容器），
    // 内边距、滚动与滑入动画的作用对象才对得上
    const wrapper = document.createElement('div');
    wrapper.className = 'side-panel-config-view';
    const container = document.createElement('div');
    container.className = 'settings-menu-container' + (skipAnimation ? '' : ' slide-in-right');

    // ① 铺满
    // 沿用原来底栏那颗的 id：设置主页面的「应用」兜底同步与面板关闭时的回写都按 id 找它
    const fillRow = this.spBuildSwitchRow('壁纸铺满全屏', this.settings.wallpaperFill !== false, (checked) => {
        self.settings.wallpaperFill = checked;
        self.saveSettings();
        self.applyWallpaper();   // 铺满要重排画面，必须走总入口
    });
    fillRow.querySelector('input').id = 'wallpaper-fill-toggle-panel';
    container.appendChild(fillRow);

    // ② 是否显示对应角标（顺序：LIVE 在前、HDR 在后，与方框的排列一致）
    const kinds = [
        { on: 'wallpaperBadgeLive', label: 'LIVE 角标' },
        { on: 'wallpaperBadgeHdr', label: 'HDR 角标' }
    ];
    kinds.forEach(item => {
        container.appendChild(this.spBuildSwitchRow(item.label, !!this.settings[item.on], (checked) => {
            self.settings[item.on] = checked;
            self.saveSettings();
            self.updateWallpaperFormatCorner();
            // 开关会决定第三段那行在不在，整视图重渲染一次最省事（同侧边栏主开关）
            self.renderWallpaperBadgeConfigView(rightPanelUpper, true);
        }));
    });

    // ③ 在哪显示角标：两个格式共用一个「主页面显示」，拨一下同时写两个键
    //（两个键各自的意义不变，updateWallpaperFormatCorner 照旧分别读它们）。
    // 两个总开关都没开时这行没有意义，整行不出现。
    if (this.settings.wallpaperBadgeLive || this.settings.wallpaperBadgeHdr) {
        const homeOn = this.settings.wallpaperBadgeLiveHomepage !== false
            || this.settings.wallpaperBadgeHdrHomepage !== false;
        container.appendChild(this.spBuildSwitchRow('主页面显示', homeOn, (checked) => {
            self.settings.wallpaperBadgeLiveHomepage = checked;
            self.settings.wallpaperBadgeHdrHomepage = checked;
            self.saveSettings();
            self.updateWallpaperFormatCorner();
        }));
    }

    wrapper.appendChild(container);
    rightPanelUpper.innerHTML = '';
    rightPanelUpper.appendChild(wrapper);
    const modal = document.getElementById('settings-modal');
    if (modal) modal.classList.add('right-panel-open');
},

// 从角标配置视图返回壁纸列表：配置视图向右推出、列表从左推入（iOS 式 pop）。
// showSettingsMenuInRightPanel 自己会清掉 dataset.subView。
backToWallpaperMenu (rightPanelUpper) {
    const items = document.getElementById('wallpaper-select-items');
    const selected = document.getElementById('wallpaper-select-selected');
    const hiddenSelect = document.getElementById('wallpaper-select');
    if (!items || !selected || !hiddenSelect) return;
    this.panelTransition(rightPanelUpper, 'pop', () => {
        this.showSettingsMenuInRightPanel(items, selected, hiddenSelect, true);
    });
},

showCustomColorEditorInPanel (rightPanelUpper, selected, hiddenSelect, text, optionsList, editIndex) {
    const self = this;

    // 编辑已有配色方案（editIndex 为 customColors 下标）时为编辑模式
    const editing = (typeof editIndex === 'number' && editIndex >= 0
        && Array.isArray(self.settings.customColors) && !!self.settings.customColors[editIndex]);
    const existing = editing ? self.settings.customColors[editIndex] : null;

    rightPanelUpper.innerHTML = '';
    rightPanelUpper.dataset.subView = 'custom-color-editor';

    const container = document.createElement('div');
    container.className = 'settings-menu-container slide-in-right';

    // 名称输入框
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = '自定义配色';
    nameInput.maxLength = 20;
    nameInput.value = '';
    nameInput.style.cssText = 'width:100%;padding:8px 10px;border:1px solid var(--border-color);border-radius:12px;font-size:13px;color:var(--text-color);background:transparent;margin-bottom:16px;box-sizing:border-box;';
    container.appendChild(nameInput);

    const updatePreview = (hexInput, previewEl) => {
        let val = hexInput.value.trim();
        if (val.startsWith('#')) val = val.substring(1);
        if (/^[0-9a-f]{6}$/i.test(val)) {
            previewEl.style.background = '#' + val;
        } else if (!val) {
            previewEl.style.background = 'transparent';
        }
    };

    // 临时保存编辑中的颜色值
    const editData = {
        primaryColor: '',
        secondaryColor: '',
        gradientEnabled: false,
        gradientStart: 0,
        gradientEnd: 100
    };

    // 主色
    const primaryRow = document.createElement('div');
    primaryRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;';
    const primaryLabel = document.createElement('span');
    primaryLabel.style.cssText = 'font-size:13px;color:var(--text-color);font-weight:500;';
    primaryLabel.textContent = '主色';
    primaryRow.appendChild(primaryLabel);
    const primaryWrapper = document.createElement('div');
    primaryWrapper.style.cssText = 'display:flex;align-items:center;gap:8px;';
    const primaryPreview = document.createElement('span');
    primaryPreview.style.cssText = 'width:24px;height:24px;border-radius:50%;border:1px solid var(--border-color);flex-shrink:0;background:transparent;';
    primaryWrapper.appendChild(primaryPreview);
    const primaryHex = document.createElement('input');
    primaryHex.type = 'text';
    primaryHex.value = '';
    primaryHex.placeholder = '#RRGGBB';
    primaryHex.maxLength = 7;
    primaryHex.spellcheck = false;
    primaryHex.style.cssText = 'width:90px;padding:8px 10px;border:1px solid var(--border-color);border-radius:12px;font-size:13px;font-family:\'SF Mono\',\'Cascadia Code\',Consolas,monospace;color:var(--text-color);background:transparent;text-transform:uppercase;letter-spacing:0.3px;';
    primaryWrapper.appendChild(primaryHex);
    primaryRow.appendChild(primaryWrapper);
    container.appendChild(primaryRow);

    // 副色
    const secondaryRow = document.createElement('div');
    secondaryRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;';
    const secondaryLabel = document.createElement('span');
    secondaryLabel.style.cssText = 'font-size:13px;color:var(--text-color);font-weight:500;';
    secondaryLabel.textContent = '副色（可选）';
    secondaryRow.appendChild(secondaryLabel);
    const secondaryWrapper = document.createElement('div');
    secondaryWrapper.style.cssText = 'display:flex;align-items:center;gap:8px;';
    const secondaryPreview = document.createElement('span');
    secondaryPreview.style.cssText = 'width:24px;height:24px;border-radius:50%;border:1px solid var(--border-color);flex-shrink:0;background:transparent;';
    secondaryWrapper.appendChild(secondaryPreview);
    const secondaryHex = document.createElement('input');
    secondaryHex.type = 'text';
    secondaryHex.value = '';
    secondaryHex.placeholder = '#RRGGBB';
    secondaryHex.maxLength = 7;
    secondaryHex.spellcheck = false;
    secondaryHex.style.cssText = 'width:90px;padding:8px 10px;border:1px solid var(--border-color);border-radius:12px;font-size:13px;font-family:\'SF Mono\',\'Cascadia Code\',Consolas,monospace;color:var(--text-color);background:transparent;text-transform:uppercase;letter-spacing:0.3px;';
    secondaryWrapper.appendChild(secondaryHex);
    secondaryRow.appendChild(secondaryWrapper);
    container.appendChild(secondaryRow);

    // 渐变开关
    const gradientRow = document.createElement('div');
    gradientRow.style.cssText = 'display:none;align-items:center;justify-content:space-between;margin-bottom:12px;';
    const gradientLabel = document.createElement('span');
    gradientLabel.style.cssText = 'font-size:13px;color:var(--text-color);font-weight:500;';
    gradientLabel.textContent = '渐变开关';
    gradientRow.appendChild(gradientLabel);
    const gradientSwitch = document.createElement('label');
    gradientSwitch.className = 'switch';
    const gradientCheckbox = document.createElement('input');
    gradientCheckbox.type = 'checkbox';
    gradientCheckbox.checked = false;
    const gradientSlider = document.createElement('span');
    gradientSlider.className = 'slider';
    gradientSwitch.appendChild(gradientCheckbox);
    gradientSwitch.appendChild(gradientSlider);
    gradientRow.appendChild(gradientSwitch);
    container.appendChild(gradientRow);

    // 渐变位置控制（直接在渐变条上拖拽）
    const gPosRow = document.createElement('div');
    gPosRow.style.cssText = 'display:none;margin-bottom:0;';
    gPosRow.id = 'gradient-position-row';

    // 拖拽状态
    let dragging = null; // 'start' | 'end' | null

    const commitGradientPos = () => {
        editData.gradientStart = curS;
        editData.gradientEnd = curE;
    };

    let curS = 0, curE = 100;

    const updateGradientUI = () => {
        gMarkerS.style.left = curS + '%';
        gMarkerE.style.left = curE + '%';
        gStartInput.value = curS;
        gEndInput.value = curE;
    };

    const posFromEvent = (e) => {
        const rect = gPreview.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        return Math.round(Math.max(0, Math.min(100, (x / rect.width) * 100)));
    };

    const onPointerDown = (e) => {
        e.preventDefault();
        const pos = posFromEvent(e);
        const dS = Math.abs(pos - curS);
        const dE = Math.abs(pos - curE);
        dragging = dS <= dE ? 'start' : 'end';
        gPreview.setPointerCapture(e.pointerId);
        gPreview.style.cursor = 'grabbing';
    };

    const onPointerMove = (e) => {
        if (!dragging) return;
        e.preventDefault();
        const pos = posFromEvent(e);
        if (dragging === 'start') {
            curS = Math.min(pos, curE);
        } else {
            curE = Math.max(pos, curS);
        }
        updateGradientUI();
    };

    const onPointerUp = (e) => {
        if (!dragging) return;
        dragging = null;
        gPreview.style.cursor = 'grab';
        commitGradientPos();
    };

    const updateGradientPreview = () => {
        const p = primaryHex.value.trim() ? primaryHex.value : '#cccccc';
        const s = secondaryHex.value.trim() ? secondaryHex.value : p;
        gPreview.style.background = 'linear-gradient(90deg, ' + p + ' 0%, ' + s + ' 100%)';
    };

    // 渐变条（可拖拽）
    const gPreview = document.createElement('div');
    gPreview.style.cssText = 'height:20px;border-radius:8px;margin:8px 0 12px;background:linear-gradient(90deg, #cccccc 0%, #cccccc 100%);border:1px solid var(--border-color);position:relative;cursor:grab;touch-action:none;';
    gPreview.addEventListener('pointerdown', onPointerDown);
    gPreview.addEventListener('pointermove', onPointerMove);
    gPreview.addEventListener('pointerup', onPointerUp);
    gPreview.addEventListener('pointercancel', onPointerUp);
    const gMarkerS = document.createElement('div');
    gMarkerS.style.cssText = 'position:absolute;top:-4px;left:' + curS + '%;width:4px;height:28px;border-radius:2px;background:var(--text-color);transform:translateX(-50%);transition:left 0.05s;pointer-events:none;';
    const gMarkerE = document.createElement('div');
    gMarkerE.style.cssText = 'position:absolute;top:-4px;left:' + curE + '%;width:4px;height:28px;border-radius:2px;background:var(--text-color);transform:translateX(-50%);transition:left 0.05s;pointer-events:none;';
    gPreview.appendChild(gMarkerS);
    gPreview.appendChild(gMarkerE);
    gPosRow.appendChild(gPreview);

    // 数值输入行（左右对称带标签）
    const gInputRow = document.createElement('div');
    gInputRow.style.cssText = 'display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:4px;';

    const makeInputGroup = (label, value, onChange) => {
        const group = document.createElement('div');
        group.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;';
        const lbl = document.createElement('span');
        lbl.style.cssText = 'font-size:12px;color:var(--text-secondary);font-weight:500;';
        lbl.textContent = label;
        group.appendChild(lbl);
        const inp = document.createElement('input');
        inp.type = 'number';
        inp.className = 'slider-value-input';
        inp.min = 0;
        inp.max = 100;
        inp.step = 1;
        inp.value = value;
        inp.style.width = '100%';
        inp.addEventListener('change', onChange);
        group.appendChild(inp);
        return group;
    };

    const gStartGroup = makeInputGroup('起始', curS, () => {
        let v = parseInt(gStartInput.value);
        if (isNaN(v) || v < 0) v = 0; if (v > 100) v = 100;
        if (v > curE) v = curE;
        curS = v; gStartInput.value = v;
        updateGradientUI();
        commitGradientPos();
    });
    const gStartInput = gStartGroup.querySelector('input');

    const gEndGroup = makeInputGroup('结束', curE, () => {
        let v = parseInt(gEndInput.value);
        if (isNaN(v) || v < 0) v = 0; if (v > 100) v = 100;
        if (v < curS) v = curS;
        curE = v; gEndInput.value = v;
        updateGradientUI();
        commitGradientPos();
    });
    const gEndInput = gEndGroup.querySelector('input');

    gInputRow.appendChild(gStartGroup);
    gInputRow.appendChild(gEndGroup);
    gPosRow.appendChild(gInputRow);

    updateGradientUI();
    container.appendChild(gPosRow);

    // 渐变行可见性
    const updateGradientRowVisibility = () => {
        const hasSec = secondaryHex.value.trim() ? true : false;
        gradientRow.style.display = hasSec ? 'flex' : 'none';
        gPosRow.style.display = (hasSec && gradientCheckbox.checked) ? 'block' : 'none';
    };
    updateGradientRowVisibility();

    // 编辑模式：预填已有配色方案的数值
    if (editing && existing) {
        nameInput.value = existing.name || '';
        primaryHex.value = existing.primaryColor || '';
        secondaryHex.value = existing.secondaryColor || '';
        gradientCheckbox.checked = !!existing.gradientEnabled;
        curS = (existing.gradientStart !== undefined && existing.gradientStart !== null) ? existing.gradientStart : 0;
        curE = (existing.gradientEnd !== undefined && existing.gradientEnd !== null) ? existing.gradientEnd : 100;
        updatePreview(primaryHex, primaryPreview);
        updatePreview(secondaryHex, secondaryPreview);
        updateGradientPreview();
        updateGradientRowVisibility();
        updateGradientUI();
    }

    const parseHex = (raw) => {
        let val = raw.trim();
        if (!val) return '';
        if (val.startsWith('#')) val = val.substring(1);
        if (/^[0-9a-f]{6}$/i.test(val)) return '#' + val.toUpperCase();
        return null;
    };

    // 事件 - 仅更新 UI，不保存
    primaryHex.addEventListener('input', () => {
        updatePreview(primaryHex, primaryPreview);
        editData.primaryColor = parseHex(primaryHex.value) || primaryHex.value.trim();
        updateGradientPreview();
    });
    primaryHex.addEventListener('blur', () => {
        const val = primaryHex.value.trim();
        if (!val) { primaryHex.value = ''; return; }
        const parsed = parseHex(primaryHex.value);
        if (!parsed) primaryHex.value = '';
        else primaryHex.value = parsed;
    });

    secondaryHex.addEventListener('input', () => {
        updatePreview(secondaryHex, secondaryPreview);
        editData.secondaryColor = parseHex(secondaryHex.value) || secondaryHex.value.trim();
        updateGradientRowVisibility();
        updateGradientPreview();
    });
    secondaryHex.addEventListener('blur', () => {
        const val = secondaryHex.value.trim();
        if (!val) { secondaryHex.value = ''; return; }
        const parsed = parseHex(secondaryHex.value);
        if (!parsed) secondaryHex.value = '';
        else secondaryHex.value = parsed;
    });

    gradientCheckbox.addEventListener('change', () => {
        editData.gradientEnabled = gradientCheckbox.checked;
        if (gradientCheckbox.checked && secondaryHex.value.trim()) {
            gPosRow.style.display = 'block';
        } else {
            gPosRow.style.display = 'none';
        }
    });

    // 底部按钮容器
    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;justify-content:flex-end;gap:10px;margin-top:auto;padding-top:12px;border-top:1px solid var(--border-color);';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = editing ? '删除' : '取消';
    cancelBtn.style.cssText = 'padding:8px 20px;border:1px solid var(--border-color);border-radius:12px;font-size:13px;color:var(--text-color);background:transparent;cursor:pointer;';
    if (editing) {
        cancelBtn.style.border = '1px solid rgba(220, 53, 69, 0.5)';
        cancelBtn.style.color = '#dc3545';
        cancelBtn.style.background = 'rgba(220, 53, 69, 0.1)';
    }
    cancelBtn.addEventListener('click', () => {
        if (editing) {
            // 编辑模式：左侧按钮为"删除"，删除该配色方案
            const arr = self.settings.customColors || [];
            const delIdx = editIndex;
            if (delIdx >= 0 && delIdx < arr.length) {
                arr.splice(delIdx, 1);
                self.settings.customColors = arr;
                if (self.settings.colorScheme === 'custom' && self.settings.activeCustomColorIndex === delIdx) {
                    self.settings.activeCustomColorIndex = -1;
                    self.settings.colorScheme = 'green';
                } else if (self.settings.colorScheme === 'custom' && self.settings.activeCustomColorIndex > delIdx) {
                    self.settings.activeCustomColorIndex -= 1;
                }
                // 手动改配色：解除主题对配色方面的接管
                self.checkThemeConsistency('colorScheme', self.settings.colorScheme);
                self.saveSettings();
                self.applyColorScheme();
                self.updateColorSchemeSelectDisplay();
            }
        }
        delete rightPanelUpper.dataset.subView;
        const items = document.getElementById('color-scheme-select-items');
        if (items && selected && hiddenSelect) {
            self.showSettingsMenuInRightPanel(items, selected, hiddenSelect, true);
        }
    });
    btnRow.appendChild(cancelBtn);

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = '确定';
    confirmBtn.style.cssText = 'padding:8px 20px;border:none;border-radius:12px;font-size:13px;color:#fff;background:var(--primary-color);cursor:pointer;';
    confirmBtn.addEventListener('click', () => {
        // 验证名称
        let name = nameInput.value.trim();
        if (!name) name = editing ? (existing.name || '自定义配色') : '自定义配色';
        // 验证主色
        const primaryParsed = parseHex(primaryHex.value);
        if (!primaryParsed) {
            self.showNotification('请输入有效的主色值');
            primaryHex.focus();
            return;
        }
        const secondaryParsed = parseHex(secondaryHex.value);
        const gradientEnabled = gradientCheckbox.checked;

        // 检查名称重复，生成唯一名称（编辑模式下保留自身原名不算重复）
        const existingNames = (self.settings.customColors || []).map((c, i) => (editing && i === editIndex) ? null : c.name).filter(Boolean);
        let finalName = name;
        if (existingNames.includes(finalName)) {
            let suffix = 2;
            while (existingNames.includes(finalName + '(' + suffix + ')')) {
                suffix++;
            }
            finalName = name + '(' + suffix + ')';
        }

        if (editing) {
            // 编辑模式：更新已有配色方案并激活
            const arr = self.settings.customColors || [];
            if (editIndex >= 0 && editIndex < arr.length) {
                arr[editIndex] = {
                    ...arr[editIndex],
                    name: finalName,
                    primaryColor: primaryParsed,
                    secondaryColor: secondaryParsed || '',
                    gradientEnabled: gradientEnabled,
                    gradientStart: curS,
                    gradientEnd: curE
                };
                self.settings.customColors = arr;
                self.settings.activeCustomColorIndex = editIndex;
                self.settings.colorScheme = 'custom';
                // 手动改配色：解除主题对配色方面的接管
                self.checkThemeConsistency('colorScheme', 'custom');
                self.saveSettings();
                self.applyColorScheme();
                // 立即更新左面板配色显示
                self.updateColorSchemeSelectDisplay();
            }
        } else {
            // 新建模式：保存到 customColors
            const newScheme = {
                name: finalName,
                primaryColor: primaryParsed,
                secondaryColor: secondaryParsed || '',
                gradientEnabled: gradientEnabled,
                gradientStart: curS,
                gradientEnd: curE
            };

            if (!self.settings.customColors) {
                self.settings.customColors = [];
            }
            self.settings.customColors.push(newScheme);
            const newIndex = self.settings.customColors.length - 1;
            self.settings.activeCustomColorIndex = newIndex;
            self.settings.colorScheme = 'custom';
            // 手动改配色：解除主题对配色方面的接管
            self.checkThemeConsistency('colorScheme', 'custom');
            self.saveSettings();
            self.applyColorScheme();
            // 立即更新左面板配色显示
            self.updateColorSchemeSelectDisplay();
        }

        // 重新渲染颜色方案列表并选中新创建的方案
        delete rightPanelUpper.dataset.subView;
        const items = document.getElementById('color-scheme-select-items');
        if (items && selected && hiddenSelect) {
            self.showSettingsMenuInRightPanel(items, selected, hiddenSelect, true);
        }
        self.showNotification('已保存配色方案"' + finalName + '"');
    });
    btnRow.appendChild(confirmBtn);

    container.appendChild(btnRow);
    rightPanelUpper.appendChild(container);
    // 强制限制容器高度，防止撑高弹窗
    const constrainHeight = () => {
        const parent = rightPanelUpper.parentElement;
        if (parent) {
            const px = parent.clientHeight - 60;
            if (px > 100) container.style.maxHeight = px + 'px';
        }
    };
    constrainHeight();
    // 窗口尺寸变化时重新计算
    const resizeHandler = () => constrainHeight();
    window.addEventListener('resize', resizeHandler);
    // 清理监听器
    const cleanup = () => window.removeEventListener('resize', resizeHandler);
    // 观察面板隐藏时清理
    const mo = new MutationObserver(() => {
        if (!rightPanelUpper.isConnected || rightPanelUpper.innerHTML === '') {
            cleanup();
            mo.disconnect();
        }
    });
    mo.observe(rightPanelUpper, { childList: true, subtree: false });
},
backToCustomColorView (rightPanelUpper) {
    if (rightPanelUpper) {
        delete rightPanelUpper.dataset.subView;
    }
    this._doBackToCustomColorView(rightPanelUpper);
},
_doBackToCustomColorView (rightPanelUpper) {
    const items = document.getElementById('color-scheme-select-items');
    if (!items) return;
    const selected = document.getElementById('color-scheme-select-selected');
    const hiddenSelect = document.getElementById('color-scheme-select');
    if (!selected || !hiddenSelect) return;
    // 配色编辑器向右推出、配色列表从左推入（iOS 式 pop）
    this.panelTransition(rightPanelUpper, 'pop', () => {
        this.showSettingsMenuInRightPanel(items, selected, hiddenSelect, true);
    });
},
closeSettingsMenuInRightPanel () {
    const rightPanelUpper = document.getElementById('right-panel-upper');
    if (!rightPanelUpper) return;

    document.getElementById('settings-modal').classList.remove('right-panel-open');

    requestAnimationFrame(() => {
        rightPanelUpper.innerHTML = '';
        delete rightPanelUpper.dataset.menuType;
        delete rightPanelUpper.dataset.subView;
        this.showDefaultRightPanelContent(rightPanelUpper);
    });

    // 清理 body 上的弹窗
    const dd = document.querySelector('[data-import-dropdown]');
    if (dd) dd.remove();
    const fs = document.querySelector('[data-folder-submenu]');
    if (fs) fs.remove();
},
confirmRightPanelChanges () {
    const rightPanelUpper = document.getElementById('right-panel-upper');
    if (!rightPanelUpper) return;
    const menuType = rightPanelUpper.dataset.menuType;

    // 保存文字Logo输入
    if (menuType === 'logo') {
        const textLogoInput = document.getElementById('text-logo-input-panel');
        if (textLogoInput && textLogoInput.value.trim()) {
            const text = textLogoInput.value.trim();
            const getCharLength = (str) => {
                let length = 0;
                for (let i = 0; i < str.length; i++) {
                    const charCode = str.charCodeAt(i);
                    if (charCode > 127) {
                        length += 2;
                    } else {
                        length += 1;
                    }
                }
                return length;
            };
            if (getCharLength(text) <= 25) {
                this.settings.logoType = 'text';
                this.settings.logo = 'text-logo';
                this.settings.textLogo = text;
                this.userChangedLogo = true;
                this.checkThemeConsistency('logo', 'text-logo');
                this.applyLogo();
                this.saveSettings();
                this.showNotification('文字Logo设置');
                const selected = document.getElementById('logo-select-selected');
                const hiddenSelect = document.getElementById('logo-select');
                if (selected) selected.textContent = '自定义文字Logo';
                if (hiddenSelect) hiddenSelect.value = 'text-logo';
            }
        }
    }

    // 保存壁纸填满开关状态
    if (menuType === 'wallpaper') {
        const panelToggle = document.getElementById('wallpaper-fill-toggle-panel');
        if (panelToggle) {
            this.settings.wallpaperFill = panelToggle.checked;
            this.saveSettings();
            this.applyWallpaper();
        }
    }
},
showDefaultRightPanelContent (rightPanelUpper) {
    rightPanelUpper.innerHTML = '<div class="right-panel-placeholder-container"><div class="right-panel-placeholder"></div></div>';

    const placeholder = rightPanelUpper.querySelector('.right-panel-placeholder');
    if (placeholder) {
        if (this.settings.font === 'Ginto') {
            placeholder.style.fontFamily = `'Ginto', system-ui, -apple-system, sans-serif`;
        } else if (this.settings.font === 'Josefin') {
            placeholder.style.fontFamily = `'Josefin', 'Ginto', system-ui, -apple-system, sans-serif`;
        } else if (this.settings.font === 'Code') {
            placeholder.style.fontFamily = `'Code', 'Ginto', system-ui, -apple-system, sans-serif`;
        } else if (this.settings.font === 'HMSC') {
            placeholder.style.fontFamily = `'HMSC', system-ui, -apple-system, sans-serif`;
        } else if (this.settings.font === 'Sans Flex') {
            placeholder.style.fontFamily = `'Sans Flex', 'Ginto', system-ui, -apple-system, sans-serif`;
        } else {
            placeholder.style.fontFamily = `'${this.settings.font}', system-ui, -apple-system, sans-serif`;
        }
    }
},
updateSettingsButtonsPosition () {
    var buttons = document.querySelector('.setting-group.action-buttons');
    if (!buttons) return;
    var mobileContainer = document.getElementById('mobile-buttons-container');
    var rightPanelContent = document.querySelector('.right-panel-content');
    if (!mobileContainer || !rightPanelContent) return;
    if (window.innerWidth < 600) {
        if (buttons.parentElement !== mobileContainer) {
            mobileContainer.appendChild(buttons);
        }
    } else {
        if (buttons.parentElement !== rightPanelContent) {
            rightPanelContent.appendChild(buttons);
        }
    }
},
initSettingsMenus () {
    const rightPanelUpper = document.getElementById('right-panel-upper');
    if (rightPanelUpper) {
        this.showDefaultRightPanelContent(rightPanelUpper);
    }
},
};

// ==== main/Script/core/mixins/BookmarkMixin.js ====
// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

const BookmarkMixin = {
toggleBookmarkImportDropdown (dropdown, folderSubmenu, anchorBtn) {
    const isActive = dropdown.classList.contains('active');
    folderSubmenu.classList.remove('active');
    if (isActive) {
        dropdown.classList.remove('active');
        return;
    }

    // 先渲染内容
    this.renderBookmarkImportDropdown(dropdown, folderSubmenu);

    // 测量并定位到按钮上方
    if (anchorBtn) {
        const rect = anchorBtn.getBoundingClientRect();
        const ddWidth = 200;
        let leftPos = Math.round(rect.left + rect.width / 2 - ddWidth / 2);
        if (leftPos < 8) leftPos = 8;

        // 临时显示测量高度
        dropdown.style.left = leftPos + 'px';
        dropdown.style.top = '-999px';
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'visible';
        dropdown.style.transform = 'none';

        const ddHeight = dropdown.offsetHeight;
        const gap = 10;
        let topPos = Math.round(rect.top - ddHeight - gap);
        if (topPos < 8) topPos = 8;

        // 清除测量用内联样式
        dropdown.style.top = topPos + 'px';
        dropdown.style.left = leftPos + 'px';
        dropdown.style.opacity = '';
        dropdown.style.visibility = '';
        dropdown.style.transform = '';

        dropdown._anchorRect = rect;
    }

    // 显示弹窗（触发 CSS 动画）
    requestAnimationFrame(() => {
        dropdown.classList.add('active');
    });
},
renderBookmarkImportDropdown (dropdown, folderSubmenu) {
    const self = this;
    dropdown.innerHTML = '';

    // 全部导入
    const optionAll = document.createElement('div');
    optionAll.className = 'bookmark-import-option';
    optionAll.innerHTML = '<span class="bookmark-import-option-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></span><span>全部导入</span>';
    optionAll.addEventListener('click', (e) => {
        e.stopPropagation();
        self.importBookmarksFromChrome('all', null, dropdown, folderSubmenu);
    });
    dropdown.appendChild(optionAll);

    // 指定文件夹
    const optionFolder = document.createElement('div');
    optionFolder.className = 'bookmark-import-option';
    optionFolder.innerHTML = '<span class="bookmark-import-option-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></span><span>指定文件夹</span>';
    optionFolder.addEventListener('click', (e) => {
        e.stopPropagation();
        self.showBookmarkFolderSelection(folderSubmenu, dropdown);
    });
    dropdown.appendChild(optionFolder);

    // 去重（开关样式）
    const optionDedup = document.createElement('div');
    optionDedup.className = 'bookmark-import-option';
    optionDedup.style.justifyContent = 'space-between';
    optionDedup.innerHTML = '<span style="display:flex;align-items:center;gap:10px;min-width:0"><span class="bookmark-import-option-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></span><span>去重</span></span>';

    const dedupToggle = document.createElement('label');
    dedupToggle.className = 'switch bookmark-dedup-switch';
    dedupToggle.style.margin = '0';
    dedupToggle.style.flexShrink = '0';
    dedupToggle.style.marginRight = '-5px';
    const dedupCheckbox = document.createElement('input');
    dedupCheckbox.type = 'checkbox';
    dedupCheckbox.checked = true;
    dedupCheckbox.id = 'bookmark-dedup-toggle';
    const dedupSlider = document.createElement('span');
    dedupSlider.className = 'slider';
    dedupToggle.appendChild(dedupCheckbox);
    dedupToggle.appendChild(dedupSlider);
    optionDedup.appendChild(dedupToggle);
    dropdown.appendChild(optionDedup);
},
showBookmarkFolderSelection (folderSubmenu, dropdown) {
    const self = this;
    dropdown.classList.remove('active');
    folderSubmenu.innerHTML = '';

    // 定位文件夹子菜单位置
    const anchor = dropdown._anchorRect;
    if (anchor) {
        folderSubmenu.style.left = Math.round(anchor.left + anchor.width / 2 - 120) + 'px';
        folderSubmenu.style.top = Math.round(anchor.top - 8) + 'px';
    }

    // 返回按钮
    const backBtn = document.createElement('div');
    backBtn.className = 'bookmark-folder-back';
    backBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg><span>返回</span>';
    backBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        folderSubmenu.classList.remove('active');
        dropdown.classList.add('active');
    });
    folderSubmenu.appendChild(backBtn);

    // 加载中提示
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'bookmark-import-option';
    loadingMsg.style.justifyContent = 'center';
    loadingMsg.style.color = 'var(--text-secondary)';
    loadingMsg.textContent = '加载中...';
    folderSubmenu.appendChild(loadingMsg);
    folderSubmenu.classList.add('active');

    // 获取书签文件夹
    try {
        chrome.bookmarks.getTree(function (bookmarkTree) {
            // 移除加载提示
            folderSubmenu.innerHTML = '';

            // 重新添加返回按钮
            const backBtn2 = document.createElement('div');
            backBtn2.className = 'bookmark-folder-back';
            backBtn2.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg><span>返回</span>';
            backBtn2.addEventListener('click', (e) => {
                e.stopPropagation();
                folderSubmenu.classList.remove('active');
                dropdown.classList.add('active');
            });
            folderSubmenu.appendChild(backBtn2);

            // 提取所有文件夹
            const folders = [];
            const extractFolders = (nodes, depth) => {
                nodes.forEach(node => {
                    // 是文件夹（有children且无url）
                    if (node.children && !node.url) {
                        const bookmarkCount = node.children.filter(c => c.url).length;
                        folders.push({
                            id: node.id,
                            title: node.title || '书签',
                            count: bookmarkCount,
                            depth: depth
                        });
                        if (node.children) {
                            extractFolders(node.children, depth + 1);
                        }
                    }
                });
            };
            // 从根的子节点开始（跳过根节点本身）
            if (bookmarkTree && bookmarkTree[0] && bookmarkTree[0].children) {
                extractFolders(bookmarkTree[0].children, 0);
            }

            if (folders.length === 0) {
                const emptyMsg = document.createElement('div');
                emptyMsg.className = 'bookmark-import-option';
                emptyMsg.style.justifyContent = 'center';
                emptyMsg.style.color = 'var(--text-secondary)';
                emptyMsg.textContent = '未找到书签文件夹';
                folderSubmenu.appendChild(emptyMsg);
                return;
            }

            folders.forEach(folder => {
                const item = document.createElement('div');
                item.className = 'bookmark-folder-item';
                item.style.paddingLeft = (14 + folder.depth * 16) + 'px';

                const icon = document.createElement('span');
                icon.className = 'bookmark-folder-item-icon';
                icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>';
                item.appendChild(icon);

                const nameSpan = document.createElement('span');
                nameSpan.className = 'bookmark-folder-item-name';
                nameSpan.textContent = folder.title || '(无标题)';
                item.appendChild(nameSpan);

                const countSpan = document.createElement('span');
                countSpan.className = 'bookmark-folder-item-count';
                countSpan.textContent = folder.count + '个链接';
                item.appendChild(countSpan);

                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    self.importBookmarksFromChrome('folder', folder.id, dropdown, folderSubmenu);
                });

                folderSubmenu.appendChild(item);
            });
        });
    } catch (e) {
        folderSubmenu.innerHTML = '';
        const errorMsg = document.createElement('div');
        errorMsg.className = 'bookmark-import-option';
        errorMsg.style.justifyContent = 'center';
        errorMsg.style.color = '#ef4444';
        errorMsg.style.flexDirection = 'column';
        errorMsg.style.alignItems = 'center';
        errorMsg.style.gap = '8px';
        errorMsg.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg><span>无法访问书签数据</span>';
        folderSubmenu.appendChild(errorMsg);
    }
},
importBookmarksFromChrome (mode, folderId, dropdown, folderSubmenu) {
    const self = this;
    dropdown.classList.remove('active');
    folderSubmenu.classList.remove('active');

    const dedupEnabled = document.getElementById('bookmark-dedup-toggle') ? document.getElementById('bookmark-dedup-toggle').checked : true;

    try {
        chrome.bookmarks.getTree(function (bookmarkTree) {
            let bookmarksToImport = [];

            if (mode === 'all') {
                // 提取所有书签
                const extractAll = (nodes) => {
                    nodes.forEach(node => {
                        if (node.url) {
                            bookmarksToImport.push({
                                name: node.title || self.extractDomain(node.url),
                                url: node.url
                            });
                        }
                        if (node.children) {
                            extractAll(node.children);
                        }
                    });
                };
                extractAll(bookmarkTree);
            } else if (mode === 'folder' && folderId) {
                // 查找指定文件夹
                const findFolderAndExtract = (nodes) => {
                    for (const node of nodes) {
                        if (node.id === folderId && node.children) {
                            node.children.forEach(child => {
                                if (child.url) {
                                    bookmarksToImport.push({
                                        name: child.title || self.extractDomain(child.url),
                                        url: child.url
                                    });
                                }
                            });
                            return true;
                        }
                        if (node.children) {
                            if (findFolderAndExtract(node.children)) return true;
                        }
                    }
                    return false;
                };
                findFolderAndExtract(bookmarkTree);
            }

            if (bookmarksToImport.length === 0) {
                self.showNotification('未找到可导入的书签');
                return;
            }

            // 去重
            let imported = 0;
            let skipped = 0;

            bookmarksToImport.forEach(bookmark => {
                const exists = self.settings.quickLinks.some(
                    link => link.url === bookmark.url || link.name === bookmark.name
                );
                if (dedupEnabled && exists) {
                    skipped++;
                } else {
                    self.settings.quickLinks.push({
                        name: bookmark.name,
                        url: bookmark.url
                    });
                    imported++;
                }
            });

            self.saveSettings();
            // 更新侧边栏显示
            self.applyQuickLinks();
            // 查找当前活动的列表容器
            const activeListContainer = document.querySelector('#right-panel-upper .quick-links-list-container');
            if (activeListContainer) {
                self.updateQuickLinksListInMenu(activeListContainer);
            }

            // 显示导入结果
            if (imported > 0) {
                self.showNotification('成功导入 ' + imported + ' 个书签' + (skipped > 0 ? '，已跳过 ' + skipped + ' 个重复项' : ''));
            } else {
                self.showNotification('未导入新书签' + (skipped > 0 ? '，已跳过 ' + skipped + ' 个重复项' : ''));
            }
        });
    } catch (e) {
        self.showNotification('无法访问Chrome书签数据');
    }
},
};

// ==== main/Script/core/widgets/WidgetBase.js ====
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

// ==== main/Script/core/widgets/ClockWidget.js ====
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

// ==== main/Script/core/widgets/CalendarWidget.js ====
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

// ==== main/Script/core/widgets/WeatherWidget.js ====
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

// ==== main/Script/core/widgets/TasksWidget.js ====
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

// ==== main/Script/core/widgets/AiAgentWidget.js ====
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

// ==== main/Script/core/widgets/EmailWidget.js ====
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

// ==== main/Script/core/widgets/UpgradeToolWidget.js ====
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

// ==== main/Script/core/widgets/widget-types.js ====
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

// ==== main/Script/core/mixins/WidgetMixin.js ====
// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

// [bundled] import { … } from '../widgets/ClockWidget.js'
// [bundled] import { … } from '../widgets/CalendarWidget.js'
// [bundled] import { … } from '../widgets/WeatherWidget.js'
// [bundled] import { … } from '../widgets/TasksWidget.js'
// [bundled] import { … } from '../widgets/AiAgentWidget.js'
// [bundled] import { … } from '../widgets/EmailWidget.js'
// [bundled] import { … } from '../widgets/UpgradeToolWidget.js'
// 类型表与尺寸辅助函数与侧边栏面板共用（Stage 9）。函数以别名导入，
// 避免与下面同名的委托方法在阅读时混淆。
const allowedSizesOf = getWidgetAllowedSizes; // [bundled] import { getWidgetAllowedSizes as allowedSizesOf }
const normalizeSize = normalizeWidgetSize; // [bundled] import { normalizeWidgetSize as normalizeSize }
const sizeLabelOf = getWidgetSizeLabel; // [bundled] import { getWidgetSizeLabel as sizeLabelOf }
// [bundled] import { … +3 个改名绑定 } from '../widgets/widget-types.js'
// [bundled] import { … } from '../sortable.js'

const WidgetMixin = {
// 类型表与尺寸辅助函数已提取到 widgets/widget-types.js，与侧边栏面板共用。
// 保留同名成员，使 this.WIDGET_TYPES / this.normalizeWidgetSize(...) 等
// 既有调用点一处都不用改。
WIDGET_TYPES,
getWidgetAllowedSizes (type) {
    return allowedSizesOf(type);
},
normalizeWidgetSize (type, size) {
    return normalizeSize(type, size);
},
getWidgetSizeLabel (type, size) {
    return sizeLabelOf(type, size);
},

createWidgetInstance (config) {
    const baseConfig = {
        id: config.id,
        type: config.type,
        size: this.normalizeWidgetSize(config.type, config.size),
        data: config.data || {},
        ooo: this
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
},
renderWidgetPanel () {
    const grid = document.getElementById('widget-panel-grid');
    if (!grid) return;
    // 侧边栏小组件子视图交换期间挂起，避免主页面网格渲染侧边栏数据
    if (this._spSwap && this._spSwap.widgetPanel !== undefined) return;

    // 销毁旧实例
    if (this.widgetInstances) {
        this.widgetInstances.forEach(w => {
            try { w.destroy(); } catch (e) { /* 忽略 */ }
        });
    }
    this.widgetInstances = [];
    grid.innerHTML = '';

    const widgets = (this.settings.widgetPanel && Array.isArray(this.settings.widgetPanel.widgets))
        ? this.settings.widgetPanel.widgets : [];

    if (widgets.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'widget-panel-empty';
        empty.textContent = '暂无小组件';
        grid.appendChild(empty);
    } else {
        widgets.forEach(config => {
            const widget = this.createWidgetInstance(config);
            if (widget) {
                try {
                    widget.render(grid);
                    this.widgetInstances.push(widget);
                } catch (e) {
                    console.warn('[WidgetPanel] 渲染小组件失败:', config.type, e);
                }
            }
        });
    }

    this.updateWidgetPanelVisibility();

    // 长方形高度 = 正方形宽度（列宽），通过 JS 计算确保与正方形完全一致
    this.syncWidgetCardHeights();
},
syncWidgetCardHeights () {
    const grid = document.getElementById('widget-panel-grid');
    if (!grid) return;

    // 等待布局完成后再测量
    requestAnimationFrame(() => {
        if (!grid.isConnected) return;
        const gap = 8; // grid gap（与 CSS 一致）
        const colWidth = (grid.clientWidth - gap) / 2;
        if (!(colWidth > 0)) return;

        // 设置 grid 行高 = 正方形宽度（列宽）
        // 正方形（1列）与长方形（2列）均被 stretch 填满行高，两者高度完全一致
        grid.style.gridAutoRows = colWidth + 'px';
    });
},
isWidgetPanelActive () {
    return !!(this.settings.widgetPanel
        && Array.isArray(this.settings.widgetPanel.widgets)
        && this.settings.widgetPanel.widgets.length > 0);
},
updateWidgetPanelVisibility () {
    const panel = document.getElementById('widget-panel');
    const container = document.getElementById('widget-panel-container');
    if (!panel) return;
    const enabled = this.isWidgetPanelActive();
    if (enabled) {
        panel.classList.add('active');
        // 重新初始化交互（处理"先禁用再启用"的情况，确保 mousemove 监听器已绑定）
        if (!this._widgetPanelMouseMoveHandler) {
            this.initWidgetPanel();
            return;
        }
        // 当前视图处于固定状态时，面板显隐由固定配置接管
        const fixed = this.isScrolled
            ? this.settings.fixSidebarWallpaper
            : (this.settings.fixSidebarEnabled && this.settings.fixSidebarHomepage);
        if (fixed) {
            this.syncSidebarFixedState();
            return;
        }
        // 确保容器初始为隐藏状态（与侧边栏保持一致）
        if (container) {
            container.classList.remove('visible');
            container.classList.add('hiding');
        }
    } else {
        panel.classList.remove('active');
        // 无小组件时始终隐藏面板容器（不显示空面板）
        if (container) {
            container.classList.remove('visible');
            container.classList.add('hiding');
        }
        document.body.classList.remove('widget-panel-open');
        this.cleanupWidgetPanel();
    }
},
syncWidgetPanelsForWallpaper (wallpaperMode) {
    // 进入壁纸模式：壁纸模式固定独立生效，一律由固定配置接管
    if (wallpaperMode) {
        this.syncSidebarFixedState();
        return;
    }

    // 退出壁纸模式：主开关开启时由固定配置接管（主页面固定）
    if (this.settings.fixSidebarEnabled) {
        this.syncSidebarFixedState();
        return;
    }

    // 恢复 hover 控制：清除 visible 与推动残留（widget-panel-open / sidebar-visible）
    const sidebarContainer = document.getElementById('quick-access-sidebar-container');
    const widgetContainer = document.getElementById('widget-panel-container');
    document.body.classList.remove('widget-panel-open');
    document.body.classList.remove('sidebar-visible');
    document.body.classList.remove('sidebar-fixed');
    [sidebarContainer, widgetContainer].forEach(container => {
        if (!container) return;
        container.classList.remove('visible');
        container.classList.add('hiding');
    });
},
syncSidebarFixedState () {
    const sidebarContainer = document.getElementById('quick-access-sidebar-container');
    const widgetContainer = document.getElementById('widget-panel-container');
    // sidebar-fixed 标记：主开关开启或壁纸模式固定关闭时需要（后者用于 CSS 覆盖 body.scrolled 的常显示规则）
    document.body.classList.toggle('sidebar-fixed', !!this.settings.fixSidebarEnabled || !this.settings.fixSidebarWallpaper);

    // 当前视图是否固定显示（壁纸模式固定独立生效）
    const fixed = this.isScrolled
        ? this.settings.fixSidebarWallpaper
        : (this.settings.fixSidebarEnabled && this.settings.fixSidebarHomepage);
    // 侧边栏固定还需快速访问侧边栏功能开启；小组件面板固定还需面板有内容
    const sidebarFixed = fixed && this.settings.quickAccessSidebar;
    const widgetFixed = fixed && this.isWidgetPanelActive();

    if (sidebarFixed) {
        // 固定显示：清除 hiding 残留，确保可见
        sidebarContainer.classList.remove('hiding');
        if (!sidebarContainer.classList.contains('visible')) {
            sidebarContainer.classList.add('visible');
        }
    } else {
        sidebarContainer.classList.remove('visible');
        sidebarContainer.classList.add('hiding');
    }

    if (widgetFixed) {
        // 固定显示：清除 hiding 残留，确保可见
        widgetContainer.classList.remove('hiding');
        if (!widgetContainer.classList.contains('visible')) {
            widgetContainer.classList.add('visible');
        }
    } else {
        widgetContainer.classList.remove('visible');
        widgetContainer.classList.add('hiding');
    }

    // 清除推动残留（widget-panel-open / sidebar-visible），避免固定状态误触发推挤
    document.body.classList.remove('widget-panel-open');
    document.body.classList.remove('sidebar-visible');
},
initWidgetPanel () {
    // 幂等：若 mousemove 监听器已绑定（非首次调用），跳过
    if (this._widgetPanelMouseMoveHandler) return;
    const container = document.getElementById('widget-panel-container');
    const panel = document.getElementById('widget-panel');

    if (!container || !panel) return;

    let hideTimeout = null;
    let isVisible = false;
    const TRIGGER_ZONE_WIDTH = 100;   // 左侧触发区域宽度（像素）
    const HIDE_DELAY = 0;            // 鼠标离开后延一帧隐藏（防抖窗口：快速移回则 clearTimeout 先于回调执行）

    const showPanel = () => {
        if (!this.isWidgetPanelActive()) return;
        const modal = document.getElementById('settings-modal');
        if (modal && modal.classList.contains('show')) return;
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }
        if (!isVisible) {
            isVisible = true;
            container.classList.remove('hiding');
            container.classList.add('visible');
            document.body.classList.add('widget-panel-open');
            // 面板可见后重新同步卡片高度（隐藏时无法测量宽度）
            this.syncWidgetCardHeights();
        }
    };

    const scheduleHide = () => {
        if (hideTimeout) clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            if (!isVisible) return;
            // 当前视图处于固定模式时，不被 hover 隐藏
            if (this.isSidebarFixed()) return;
            // HIDE_DELAY=0 提供一帧窗口：若鼠标仍在面板上，下一帧 mousemove 会触发 showPanel 清除此回调
            isVisible = false;
            container.classList.remove('visible');
            container.classList.add('hiding');
            document.body.classList.remove('widget-panel-open');
            hideTimeout = null;
        }, HIDE_DELAY);
    };

    // 全局鼠标移动检测：触发区显示面板，鼠标进入面板范围维持显示，离开则关闭
    const widgetPanelMouseMoveHandler = (e) => {
        if (!this.isWidgetPanelActive()) return;
        const modal = document.getElementById('settings-modal');
        if (modal && modal.classList.contains('show')) return;
        const mouseX = e.clientX;

        if (mouseX <= TRIGGER_ZONE_WIDTH) {
            // 当前视图处于固定模式时，无需 hover 触发
            if (this.isSidebarFixed()) return;
            showPanel();
        } else if (!this.isSidebarFixed()) {
            const containerRect = container.getBoundingClientRect();
            const isOverContainer = (
                mouseX >= containerRect.left &&
                mouseX <= containerRect.right &&
                e.clientY >= containerRect.top &&
                e.clientY <= containerRect.bottom
            );
            if (isOverContainer) {
                showPanel();
            } else if (isVisible) {
                scheduleHide();
            }
        }
    };
    this._widgetPanelMouseMoveHandler = widgetPanelMouseMoveHandler;
    document.addEventListener('mousemove', widgetPanelMouseMoveHandler);

    // 面板滚轮：内容溢出时拦截（只滚动面板内容，不触发壁纸模式进退）；
    // 内容不溢出时放行（交给页面滚动处理）
    const panelWheelHandler = (e) => {
        const maxScroll = container.scrollHeight - container.clientHeight;
        if (maxScroll <= 0) return; // 内容不溢出，放行
        e.stopPropagation();        // 内容溢出：拦截，只滚动面板内容
    };
    this._widgetPanelEl = panel;
    this._widgetPanelContainer = container;
    this._widgetPanelWheelHandler = panelWheelHandler;
    panel.addEventListener('wheel', panelWheelHandler, { passive: true });
    container.addEventListener('wheel', panelWheelHandler, { passive: true });
},
cleanupWidgetPanel () {
    if (this._widgetPanelMouseMoveHandler) {
        document.removeEventListener('mousemove', this._widgetPanelMouseMoveHandler);
        this._widgetPanelMouseMoveHandler = null;
    }
    if (this._widgetPanelWheelHandler) {
        if (this._widgetPanelEl) this._widgetPanelEl.removeEventListener('wheel', this._widgetPanelWheelHandler);
        if (this._widgetPanelContainer) this._widgetPanelContainer.removeEventListener('wheel', this._widgetPanelWheelHandler);
        this._widgetPanelWheelHandler = null;
    }
},
syncWidgetPanelUI () {
    const manageGroup = document.getElementById('widget-panel-manage-group');
    if (!manageGroup) return;
    // 始终显示，列表为空时由管理界面提示"暂无小组件"
    manageGroup.style.display = 'block';
},
saveWidgetSettings () {
    this.saveSettings();
},
saveWidgetData (widgetId, data) {
    const widgets = this.settings.widgetPanel && this.settings.widgetPanel.widgets;
    if (!Array.isArray(widgets)) return;
    const idx = widgets.findIndex(w => w.id === widgetId);
    if (idx >= 0) {
        widgets[idx].data = data;
        this.saveSettings();
    }
},
openWidgetSettings (widgetId) {
    this.openSettings('badge');
    setTimeout(() => {
        this.showWidgetPanelMenuInRightPanel();
        // 尝试滚动到指定小组件
        if (widgetId) {
            setTimeout(() => {
                const item = document.querySelector(`.widget-menu-item[data-widget-id="${widgetId}"]`);
                if (item) item.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 150);
        }
    }, 100);
},
showWidgetPanelMenuInRightPanel (skipAnimation) {
    const self = this;
    const rightPanelUpper = document.getElementById('right-panel-upper');
    if (!rightPanelUpper) return;
    const settingsModal = document.getElementById('settings-modal');
    if (settingsModal) settingsModal.classList.add('right-panel-open');

    rightPanelUpper.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'settings-menu-container' + (skipAnimation ? '' : ' slide-in-right');

    const listContainer = document.createElement('div');
    listContainer.className = 'widget-panel-list-container';
    container.appendChild(listContainer);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'settings-menu-button-container';

    const plusBtn = document.createElement('button');
    plusBtn.className = 'upload-btn settings-plus-btn';
    plusBtn.textContent = '+';
    plusBtn.title = '添加小组件';

    // 导出按钮
    const exportBtn = document.createElement('button');
    exportBtn.className = 'settings-import-btn settings-export-btn';
    exportBtn.title = '导出小组件配置为 JSON';
    exportBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>';

    // 导入按钮
    const importBtn = document.createElement('button');
    importBtn.className = 'settings-import-btn';
    importBtn.title = '导入小组件配置';
    importBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';

    const ioRow = document.createElement('div');
    ioRow.className = 'quick-links-io-row';
    ioRow.appendChild(exportBtn);
    ioRow.appendChild(importBtn);

    buttonContainer.appendChild(ioRow);
    buttonContainer.appendChild(plusBtn);
    container.appendChild(buttonContainer);

    rightPanelUpper.appendChild(container);

    this.updateWidgetPanelListInMenu(listContainer);

    // "+" 按钮：显示类型选择器
    plusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        self.showWidgetTypePicker(container, listContainer, buttonContainer);
    });

    // 导出
    exportBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        self.exportWidgets();
    });

    // 导入
    importBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.addEventListener('change', () => {
            const file = input.files && input.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => self.importWidgets(reader.result, listContainer);
            reader.readAsText(file);
        });
        input.click();
    });
},
updateWidgetPanelListInMenu (listContainer) {
    const self = this;
    if (!listContainer) return;
    if (listContainer._sortable) { listContainer._sortable.destroy(); listContainer._sortable = null; }
    listContainer.innerHTML = '';

    const widgets = (this.settings.widgetPanel && Array.isArray(this.settings.widgetPanel.widgets))
        ? this.settings.widgetPanel.widgets : [];

    if (widgets.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'quick-links-empty';
        empty.textContent = '暂无小组件';
        listContainer.appendChild(empty);
        return;
    }

    // 使用 DocumentFragment 批量构建条目
    const fragment = document.createDocumentFragment();

    widgets.forEach((widget, index) => {
        const meta = this.WIDGET_TYPES[widget.type] || { name: widget.type, icon: 'widgets' };

        const item = document.createElement('div');
        item.className = 'widget-menu-item';
        item.setAttribute('data-index', index);
        item.setAttribute('data-widget-id', widget.id);
        // 保存对 settings 对象的引用：拖动提交时按此重排，保留 data/size 等配置
        item._sortRef = widget;

        // 拖拽手柄（复用快速访问链接样式）
        const dragHandle = document.createElement('div');
        dragHandle.className = 'quick-link-drag-handle';
        dragHandle.innerHTML = '<span></span><span></span>';
        dragHandle.title = '拖拽排序';

        const typeIcon = document.createElement('span');
        typeIcon.className = 'material-icons';
        typeIcon.style.cssText = 'font-size:20px;color:var(--scheme-accent);flex-shrink:0;';
        typeIcon.textContent = meta.icon;

        const info = document.createElement('div');
        info.className = 'widget-menu-info';

        const nameRow = document.createElement('div');
        nameRow.className = 'widget-menu-name';

        const name = document.createElement('span');
        name.textContent = meta.name;
        nameRow.appendChild(name);

        const typeLabel = document.createElement('span');
        typeLabel.className = 'widget-type-label';
        typeLabel.textContent = self.getWidgetSizeLabel(widget.type, widget.size);
        nameRow.appendChild(typeLabel);

        const subText = self.getWidgetSubtitle(widget);
        info.appendChild(nameRow);
        // 无实际配置信息时不生成第二行，条目保持单行紧凑
        if (subText) {
            const sub = document.createElement('div');
            sub.className = 'widget-menu-sub';
            sub.textContent = subText;
            info.appendChild(sub);
        }

        // 点击条目编辑（参考快速访问链接）
        info.addEventListener('click', (e) => {
            e.stopPropagation();
            const container = listContainer.closest('.settings-menu-container');
            const currentIndex = parseInt(item.getAttribute('data-index'), 10);
            const currentWidget = self.settings.widgetPanel.widgets[currentIndex];
            if (currentWidget) {
                self.showWidgetConfigForm(listContainer, currentWidget);
            }
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-link-menu-btn';
        deleteBtn.textContent = '×';
        deleteBtn.title = '删除小组件';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const currentIndex = parseInt(item.getAttribute('data-index'), 10);
            if (isNaN(currentIndex) || currentIndex < 0 || currentIndex >= self.settings.widgetPanel.widgets.length) return;
            const removed = self.settings.widgetPanel.widgets[currentIndex];
            const removedName = self.WIDGET_TYPES[removed.type] ? self.WIDGET_TYPES[removed.type].name : '小组件';
            self.settings.widgetPanel.widgets.splice(currentIndex, 1);
            self.saveWidgetSettings();
            self.renderWidgetPanel();
            self.updateWidgetPanelListInMenu(listContainer);
            self.showNotification('"' + removedName + '" 已删除');
        });

        item.appendChild(dragHandle);
        item.appendChild(typeIcon);
        item.appendChild(info);
        item.appendChild(deleteBtn);
        fragment.appendChild(item);
    });

    listContainer.appendChild(fragment);

    // 接管拖动排序（整行可拖，移动超过阈值才算拖动；轻点仍进入编辑）
    listContainer._sortable = attachSortableList(listContainer, {
        itemSelector: '.widget-menu-item',
        onCommit: (items) => {
            // 按新 DOM 顺序重排同一批对象引用，保留 data/size 等配置
            self.settings.widgetPanel.widgets = items.map(el => el._sortRef);
            items.forEach((el, i) => el.setAttribute('data-index', i));
            self.saveWidgetSettings();
            self.renderWidgetPanel();
            self.showNotification('顺序已调整');
        }
    });
},
getWidgetSubtitle (widget) {
    const data = widget.data || {};
    switch (widget.type) {
        case 'weather': return data.city ? '城市：' + data.city : '默认城市：南昌';
        case 'ai-agent': return data.port ? '端口：' + data.port : '未配置端口';
        case 'email': return data.apiUrl ? 'API：' + data.apiUrl : (data.provider || 'gmail');
        case 'tasks': {
            const n = Array.isArray(data.items) ? data.items.length : 0;
            return '任务' + (n ? ' · ' + n + ' 个' : '');
        }
        // 时钟 / 日历的第二行只是复述类型名，无实际配置信息，交由调用方收起该行
        default: return '';
    }
},
showWidgetTypePicker (container, listContainer, buttonContainer) {
    const self = this;

    // 标记当前子视图（ESC 返回列表用）
    const rpu = document.getElementById('right-panel-upper');
    if (rpu) rpu.dataset.subView = 'widget-type-picker';

    // 添加流程中隐藏底部导出/导入/+ 按钮
    if (buttonContainer) {
        const ioRow = buttonContainer.querySelector('.quick-links-io-row');
        const plusBtn = buttonContainer.querySelector('.settings-plus-btn');
        if (ioRow) ioRow.style.display = 'none';
        if (plusBtn) plusBtn.style.display = 'none';
    }

    const exitTo = (fn) => {
        self.exitWidgetFormView(listContainer, () => {
            self.restoreWidgetPanelButtons();
            fn && fn();
        });
    };

    this.showWidgetFormView(listContainer, (view) => {
        const title = document.createElement('div');
        title.className = 'widget-add-form';
        title.style.cssText = 'padding-bottom:0;';
        const tRow = document.createElement('div');
        tRow.className = 'widget-add-form-row';
        const tLabel = document.createElement('label');
        tLabel.textContent = '选择小组件类型';
        tRow.appendChild(tLabel);
        title.appendChild(tRow);
        view.appendChild(title);

        const picker = document.createElement('div');
        picker.className = 'widget-type-picker';

        Object.keys(self.WIDGET_TYPES).forEach(type => {
            const meta = self.WIDGET_TYPES[type];
            const item = document.createElement('button');
            item.className = 'widget-type-picker-item';
            item.innerHTML = '<span class="material-icons">' + meta.icon + '</span><span>' + meta.name + '</span>';
            item.addEventListener('click', () => {
                // 先滑出类型选择器，再进入配置表单
                self.exitWidgetFormView(listContainer, () => {
                    self.showWidgetConfigForm(listContainer, null, type);
                });
            });
            picker.appendChild(item);
        });

        view.appendChild(picker);

        // 返回按钮
        const backRow = document.createElement('div');
        backRow.className = 'widget-add-form';
        backRow.style.cssText = 'padding-top:0;';
        const backBtn = document.createElement('button');
        backBtn.className = 'widget-add-form-btn cancel';
        backBtn.textContent = '← 返回列表';
        backBtn.addEventListener('click', () => {
            exitTo(() => self.updateWidgetPanelListInMenu(listContainer));
        });
        backRow.appendChild(backBtn);
        view.appendChild(backRow);
    });
},
showWidgetFormView (listContainer, buildContentFn) {
    listContainer.innerHTML = '';
    const view = document.createElement('div');
    view.className = 'widget-form-view';
    buildContentFn(view);
    listContainer.appendChild(view);
    requestAnimationFrame(() => {
        view.classList.add('slide-in-right');
    });
    return view;
},
exitWidgetFormView (listContainer, callback) {
    const view = listContainer.querySelector('.widget-form-view');

    // 底部表单按钮（确定/取消）同步滑出
    const rpu = document.getElementById('right-panel-upper');
    const buttonContainer = rpu ? rpu.querySelector('.settings-menu-button-container') : null;
    const btnRow = buttonContainer ? buttonContainer.querySelector('.widget-form-bottom-buttons') : null;

    const targets = [];
    if (view) targets.push(view);
    if (btnRow) targets.push(btnRow);

    if (targets.length === 0) {
        if (callback) callback();
        return;
    }

    let pending = targets.length;
    const onDone = () => {
        pending--;
        if (pending > 0) return;
        targets.forEach(t => {
            if (t.parentNode) t.parentNode.removeChild(t);
        });
        if (callback) callback();
    };

    targets.forEach(t => {
        t.classList.remove('slide-in-right');
        t.classList.add('slide-out-right');
        t.addEventListener('animationend', onDone, { once: true });
        // 兜底：动画异常时 300ms 后强制完成
        setTimeout(() => {
            if (t.parentNode) {
                t.dispatchEvent(new Event('animationend'));
            }
        }, 300);
    });
},
restoreWidgetPanelButtons () {
    const rpu = document.getElementById('right-panel-upper');
    if (!rpu) return;
    const container = rpu.querySelector('.settings-menu-container');
    const buttonContainer = container ? container.querySelector('.settings-menu-button-container') : null;
    if (buttonContainer) {
        const ioRow = buttonContainer.querySelector('.quick-links-io-row');
        const plusBtn = buttonContainer.querySelector('.settings-plus-btn');
        const formBtns = buttonContainer.querySelector('.widget-form-bottom-buttons');
        if (ioRow) ioRow.style.display = '';
        if (plusBtn) plusBtn.style.display = '';
        if (formBtns && formBtns.parentNode) formBtns.parentNode.removeChild(formBtns);

        // 恢复的按钮滑入（避免闪现）
        requestAnimationFrame(() => {
            if (ioRow) {
                ioRow.classList.remove('slide-in-right');
                void ioRow.offsetWidth; // 强制回流以重启动画
                ioRow.classList.add('slide-in-right');
            }
            if (plusBtn) {
                plusBtn.classList.remove('slide-in-right');
                void plusBtn.offsetWidth;
                plusBtn.classList.add('slide-in-right');
            }
        });
    }
    delete rpu.dataset.subView;
},
showWidgetConfigForm (listContainer, widget, presetType) {
    const self = this;
    const type = widget ? widget.type : presetType;
    if (!type || !this.WIDGET_TYPES[type]) return;

    const meta = this.WIDGET_TYPES[type];
    const data = widget ? (widget.data || {}) : {};
    const currentSize = this.normalizeWidgetSize(type, widget ? widget.size : meta.defaultSize);

    // 找到底部按钮容器（导出/导入/+ 所在位置）
    const container = listContainer.closest('.settings-menu-container');
    const buttonContainer = container ? container.querySelector('.settings-menu-button-container') : null;

    // 标记当前子视图（ESC 返回列表用）
    const rpu = document.getElementById('right-panel-upper');
    if (rpu) rpu.dataset.subView = 'widget-config';

    // 进入表单模式：隐藏导出/导入/+ 按钮
    let ioRow = null, plusBtn = null;
    if (buttonContainer) {
        ioRow = buttonContainer.querySelector('.quick-links-io-row');
        plusBtn = buttonContainer.querySelector('.settings-plus-btn');
        if (ioRow) ioRow.style.display = 'none';
        if (plusBtn) plusBtn.style.display = 'none';
    }

    listContainer.innerHTML = '';

    // 表单视图容器（带滑入动画）
    const formView = document.createElement('div');
    formView.className = 'widget-form-view';
    listContainer.appendChild(formView);

    const form = document.createElement('div');
    form.className = 'widget-add-form';

    // 类型（只读展示）
    const typeRow = document.createElement('div');
    typeRow.className = 'widget-add-form-row';
    const typeLabel = document.createElement('label');
    typeLabel.textContent = '类型';
    const typeVal = document.createElement('div');
    typeVal.textContent = meta.name;
    typeVal.style.cssText = 'font-size:13px;color:var(--text-color);';
    typeRow.appendChild(typeLabel);
    typeRow.appendChild(typeVal);
    form.appendChild(typeRow);

    // 尺寸分段滑块（iOS 26 分段切换器风格：小 / 大 / 超大）
    // 允许尺寸由类型元信息决定：不允许小尺寸的类型（任务/AI Agent/邮箱）只显示 大/超大
    const allowedSizes = this.getWidgetAllowedSizes(type);
    const currentIdx = allowedSizes.indexOf(currentSize);
    const hasSuper = allowedSizes.indexOf('super') >= 0;
    const hasSquare = allowedSizes.indexOf('square') >= 0;

    const sizeRow = document.createElement('div');
    sizeRow.className = 'widget-size-row';
    const sizeLabel = document.createElement('label');
    sizeLabel.textContent = '尺寸';

    const seg = document.createElement('div');
    seg.className = 'widget-size-segmented ' + (allowedSizes.length === 3 ? 'seg-3' : 'seg-2')
        + (hasSquare ? '' : ' no-square');

    const segThumb = document.createElement('div');
    segThumb.className = 'widget-size-seg-thumb';

    let squareLbl = null;
    if (hasSquare) {
        squareLbl = document.createElement('span');
        squareLbl.className = 'widget-size-seg-label widget-size-seg-label-square';
        squareLbl.textContent = '小';
    }

    const rectLbl = document.createElement('span');
    rectLbl.className = 'widget-size-seg-label widget-size-seg-label-rect';
    rectLbl.textContent = '大';

    let superLbl = null;
    if (hasSuper) {
        superLbl = document.createElement('span');
        superLbl.className = 'widget-size-seg-label widget-size-seg-label-super';
        superLbl.textContent = '超大';
    }

    // 透明 range 覆盖层：负责拖动与点击切换（视觉由下方分段控件呈现）
    const sizeSlider = document.createElement('input');
    sizeSlider.type = 'range';
    sizeSlider.min = '0';
    sizeSlider.max = String(allowedSizes.length - 1);
    sizeSlider.step = '1';
    sizeSlider.className = 'widget-size-seg-input';
    sizeSlider.value = String(currentIdx >= 0 ? currentIdx : 0);

    seg.appendChild(segThumb);
    if (squareLbl) seg.appendChild(squareLbl);
    seg.appendChild(rectLbl);
    if (superLbl) seg.appendChild(superLbl);
    seg.appendChild(sizeSlider);

    const updateSeg = () => {
        const v = sizeSlider.value;
        const idx = parseInt(v, 10);
        const size = allowedSizes[idx] || allowedSizes[allowedSizes.length - 1];
        seg.classList.toggle('rect', size === 'rectangle');
        seg.classList.toggle('super', size === 'super');
        if (squareLbl) squareLbl.classList.toggle('active', size === 'square');
        rectLbl.classList.toggle('active', size === 'rectangle');
        if (superLbl) superLbl.classList.toggle('active', size === 'super');
    };
    sizeSlider.addEventListener('input', updateSeg);
    updateSeg();

    sizeRow.appendChild(sizeLabel);
    sizeRow.appendChild(seg);
    form.appendChild(sizeRow);

    // 类型专属配置
    const extraFields = {};

    if (type === 'weather') {
        const cityRow = document.createElement('div');
        cityRow.className = 'widget-add-form-row';
        const cityLabel = document.createElement('label');
        cityLabel.textContent = '城市（默认南昌，留空自动定位）';
        cityRow.appendChild(cityLabel);
        const inputWrap = document.createElement('div');
        inputWrap.className = 'widget-input-row';
        const cityInput = document.createElement('input');
        cityInput.type = 'text';
        cityInput.placeholder = '城市';
        cityInput.value = data.city && data.city !== '当前位置' ? data.city : '';
        inputWrap.appendChild(cityInput);
        const geoBtn = document.createElement('button');
        geoBtn.className = 'widget-input-btn';
        geoBtn.innerHTML = '<span class="material-icons" style="font-size:15px">my_location</span>定位';
        geoBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    pos => { cityInput.value = '当前位置'; },
                    () => { cityInput.value = '定位失败，请手动输入'; }
                );
            } else {
                cityInput.value = '浏览器不支持定位';
            }
        });
        inputWrap.appendChild(geoBtn);
        cityRow.appendChild(inputWrap);
        form.appendChild(cityRow);
        extraFields.city = cityInput;
    }

    if (type === 'ai-agent') {
        const portRow = document.createElement('div');
        portRow.className = 'widget-add-form-row';
        const portLabel = document.createElement('label');
        portLabel.textContent = '端口号';
        portRow.appendChild(portLabel);
        const inputWrap = document.createElement('div');
        inputWrap.className = 'widget-input-row';
        const portInput = document.createElement('input');
        portInput.type = 'number';
        portInput.min = '1';
        portInput.max = '65535';
        portInput.placeholder = '如：8899';
        portInput.value = data.port || '';
        inputWrap.appendChild(portInput);
        const testBtn = document.createElement('button');
        testBtn.className = 'widget-input-btn';
        testBtn.innerHTML = '<span class="material-icons" style="font-size:15px">speed</span>测试';
        testBtn.addEventListener('click', () => {
            const port = portInput.value.trim();
            if (!port) { portInput.value = '端口号'; return; }
            self.showNotification('正在测试 127.0.0.1:' + port + '…');
        });
        inputWrap.appendChild(testBtn);
        portRow.appendChild(inputWrap);
        const hint = document.createElement('div');
        hint.className = 'widget-add-form-hint';
        hint.textContent = 'SI Agent 服务地址为 127.0.0.1:' + (data.port || '端口号') + '，需本地已运行对应服务';
        portRow.appendChild(hint);
        form.appendChild(portRow);
        extraFields.port = portInput;
    }

    if (type === 'email') {
        // 服务商选择
        const providerRow = document.createElement('div');
        providerRow.className = 'widget-add-form-row';
        const providerLabel = document.createElement('label');
        providerLabel.textContent = '邮箱服务商';
        const providerSelect = document.createElement('select');
        const providers = [
            { v: 'gmail', t: 'Gmail' },
            { v: 'outlook', t: 'Outlook' },
            { v: 'qq', t: 'QQ邮箱' },
            { v: 'custom', t: '自定义' }
        ];
        providers.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.v;
            opt.textContent = p.t;
            providerSelect.appendChild(opt);
        });
        providerSelect.value = data.provider || 'gmail';
        providerRow.appendChild(providerLabel);
        providerRow.appendChild(providerSelect);
        form.appendChild(providerRow);

        extraFields.provider = providerSelect;

        // Gmail Google 连接面板
        const gmailPanel = document.createElement('div');
        gmailPanel.className = 'widget-add-form-row widget-google-tasks-panel';
        gmailPanel.style.display = (providerSelect.value === 'gmail') ? '' : 'none';

        const gmailIsConnected = !!(data && data.googleConnected);

        const topRow = document.createElement('div');
        topRow.className = 'gtasks-top';
        const statusDot = document.createElement('span');
        statusDot.className = 'gtasks-dot' + (gmailIsConnected ? ' on' : '');
        const statusLabel = document.createElement('span');
        statusLabel.className = 'gtasks-top-label';
        statusLabel.textContent = gmailIsConnected ? 'Gmail 已连接' : 'Gmail 未连接';
        const infoBtn = document.createElement('button');
        infoBtn.className = 'gtasks-info-btn';
        infoBtn.innerHTML = '<span class="material-icons">info_outline</span>';
        infoBtn.title = '查看连接教程';
        infoBtn.addEventListener('click', () => this.showGmailTutorial());
        topRow.appendChild(statusDot);
        topRow.appendChild(statusLabel);
        topRow.appendChild(infoBtn);
        gmailPanel.appendChild(topRow);

        if (gmailIsConnected) {
            const emailEl = document.createElement('div');
            emailEl.className = 'gtasks-email';
            emailEl.textContent = data.googleEmail || '';
            gmailPanel.appendChild(emailEl);

            const disconnectBtn = document.createElement('button');
            disconnectBtn.className = 'gtasks-btn gtasks-btn-disconnect';
            disconnectBtn.textContent = '断开连接';
            disconnectBtn.addEventListener('click', () => {
                const wi = (self.widgetInstances || []).find(w => w.id === widget.id);
                if (wi && typeof wi.disconnectGoogle === 'function') {
                    wi.disconnectGoogle();
                } else {
                    data.googleConnected = false;
                    data.googleEmail = '';
                    data.googleToken = '';
                    self.saveWidgetSettings();
                }
                self.showNotification('已断开 Gmail');
                self.showWidgetConfigForm(listContainer, widget, presetType);
            });
            gmailPanel.appendChild(disconnectBtn);
        } else {
            const inputRow = document.createElement('div');
            inputRow.className = 'gtasks-input-row';

            const clientIdInput = document.createElement('input');
            clientIdInput.type = 'text';
            clientIdInput.className = 'gtasks-clientid-input';
            clientIdInput.placeholder = 'Client ID';
            clientIdInput.value = data.googleClientId || '';
            clientIdInput.maxLength = 200;

            const connectBtn = document.createElement('button');
            connectBtn.className = 'gtasks-btn gtasks-btn-connect';
            connectBtn.innerHTML = '<span class="material-icons">link</span>连接';
            connectBtn.addEventListener('click', async () => {
                const clientId = clientIdInput.value.trim();
                if (!clientId || !clientId.endsWith('.apps.googleusercontent.com')) {
                    self.showNotification('请输入有效的 Client ID');
                    clientIdInput.focus();
                    return;
                }
                if (!widget) {
                    self.showNotification('请先点击"确定"保存小组件，再连接 Google');
                    return;
                }
                connectBtn.disabled = true;
                connectBtn.innerHTML = '<span class="material-icons">hourglass_top</span>';
                try {
                    const wi = (self.widgetInstances || []).find(w => w.id === widget.id);
                    if (wi && typeof wi.connectGoogle === 'function') {
                        await wi.connectGoogle(clientId);
                    } else {
                        throw new Error('小组件实例未就绪');
                    }
                    self.showNotification('Gmail 已连接');
                    self.showWidgetConfigForm(listContainer, widget, presetType);
                } catch (e) {
                    self.showNotification('连接失败：' + (e.message || '请检查 Client ID'));
                    connectBtn.disabled = false;
                    connectBtn.innerHTML = '<span class="material-icons">link</span>连接';
                }
            });

            inputRow.appendChild(clientIdInput);
            inputRow.appendChild(connectBtn);
            gmailPanel.appendChild(inputRow);
        }

        form.appendChild(gmailPanel);

        // 切换服务商时显示/隐藏 Gmail 面板
        providerSelect.addEventListener('change', () => {
            gmailPanel.style.display = providerSelect.value === 'gmail' ? '' : 'none';
        });

        // 其他服务商：API 地址（非 Gmail 时显示）
        const apiRow = document.createElement('div');
        apiRow.className = 'widget-add-form-row';
        apiRow.style.display = (providerSelect.value === 'gmail') ? 'none' : '';
        const apiLabel = document.createElement('label');
        apiLabel.textContent = '邮件 API 地址（可选）';
        apiRow.appendChild(apiLabel);
        const inputWrap = document.createElement('div');
        inputWrap.className = 'widget-input-row';
        const apiInput = document.createElement('input');
        apiInput.type = 'text';
        apiInput.placeholder = '如：http://127.0.0.1:8899/api/emails';
        apiInput.value = data.apiUrl || '';
        inputWrap.appendChild(apiInput);
        const testBtn = document.createElement('button');
        testBtn.className = 'widget-input-btn';
        testBtn.innerHTML = '<span class="material-icons" style="font-size:15px">test_activity</span>测试';
        testBtn.addEventListener('click', () => {
            const url = apiInput.value.trim();
            if (!url) { apiInput.value = '请输入 API 地址'; return; }
            self.showNotification('正在测试 ' + url + '…');
        });
        inputWrap.appendChild(testBtn);
        apiRow.appendChild(inputWrap);
        const apiHint = document.createElement('div');
        apiHint.className = 'widget-add-form-hint';
        apiHint.textContent = '留空则仅提供网页版入口；配置后返回 { emails: [{from, subject, time}] }';
        apiRow.appendChild(apiHint);
        form.appendChild(apiRow);
        extraFields.apiUrl = apiInput;

        // 切换时同步显示/隐藏 API 行
        providerSelect.addEventListener('change', () => {
            apiRow.style.display = providerSelect.value === 'gmail' ? 'none' : '';
        });
    }

    formView.appendChild(form);

    // 滑入动画
    requestAnimationFrame(() => {
        formView.classList.add('slide-in-right');
    });

    // 底部按钮：确定/取消（放入底部按钮容器，替代导出/导入/+）
    const btnRow = document.createElement('div');
    btnRow.className = 'widget-form-bottom-buttons';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'widget-add-form-btn cancel';
    cancelBtn.textContent = '取消';

    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'widget-add-form-btn confirm';
    confirmBtn.textContent = '确定';

    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(confirmBtn);

    if (buttonContainer) {
        buttonContainer.appendChild(btnRow);
        // 底部按钮与表单内容同步滑入
        requestAnimationFrame(() => {
            btnRow.classList.add('slide-in-right');
        });
    } else {
        form.appendChild(btnRow); // 兜底：找不到容器时直接放表单底部
    }

    // 退出表单：滑出动画后恢复导出/导入/+ 按钮，回到列表
    const exitForm = (backToList) => {
        self.exitWidgetFormView(listContainer, () => {
            self.restoreWidgetPanelButtons();
            if (backToList) self.updateWidgetPanelListInMenu(listContainer);
        });
    };

    cancelBtn.addEventListener('click', () => {
        exitForm(true);
    });

    confirmBtn.addEventListener('click', () => {
        // 尺寸映射：按当前类型允许的尺寸列表取索引对应的尺寸
        const size = allowedSizes[parseInt(sizeSlider.value, 10)] || allowedSizes[allowedSizes.length - 1];
        const newData = {};

        if (extraFields.city) {
            newData.city = extraFields.city.value.trim() || '南昌';
        }
        if (extraFields.port) {
            const port = extraFields.port.value.trim();
            if (port && (!/^\d+$/.test(port) || +port < 1 || +port > 65535)) {
                self.showNotification('端口号无效（1-65535）');
                return;
            }
            newData.port = port;
        }
        if (extraFields.provider) {
            newData.provider = extraFields.provider.value;
            newData.url = self.getEmailProviderUrl(extraFields.provider.value);
        }
        if (extraFields.apiUrl) {
            newData.apiUrl = extraFields.apiUrl.value.trim();
        }

        if (widget) {
            // 编辑：更新配置并重渲染
            widget.size = size;
            widget.data = Object.assign({}, widget.data, newData);
            const idx = self.settings.widgetPanel.widgets.findIndex(w => w.id === widget.id);
            if (idx >= 0) {
                self.settings.widgetPanel.widgets[idx] = {
                    id: widget.id,
                    type: widget.type,
                    size: size,
                    data: Object.assign({}, widget.data, newData)
                };
            }
            self.saveWidgetSettings();
            self.renderWidgetPanel();
            self.showNotification('小组件已更新');
        } else {
            // 添加
            const newWidget = {
                id: self.genWidgetId(),
                type: type,
                size: size,
                data: newData
            };
            self.settings.widgetPanel.widgets.push(newWidget);
            self.saveWidgetSettings();
            self.renderWidgetPanel();
            self.showNotification('小组件已添加');
        }
        exitForm(true);
    });
},
getEmailProviderUrl (provider) {
    const urls = {
        gmail: 'https://mail.google.com',
        outlook: 'https://outlook.live.com/mail/',
        qq: 'https://mail.qq.com',
        custom: ''
    };
    return urls[provider] || '';
},
showGmailTutorial () {
    const overlay = document.createElement('div');
    overlay.className = 'gtasks-tutorial-overlay';
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

    const card = document.createElement('div');
    card.className = 'gtasks-tutorial-card';

    card.innerHTML = [
        '<div class="gtasks-tutorial-header">',
        '  <span class="material-icons">school</span>',
        '  <span>连接 Gmail 教程</span>',
        '</div>',
        '<div class="gtasks-tutorial-steps">',
        '  <div class="gtasks-step"><span class="gtasks-step-num">1</span><div><b>打开</b> <a href="https://console.cloud.google.com" target="_blank">Google Cloud Console</a>，登录你的 Google 账号</div></div>',
        '  <div class="gtasks-step"><span class="gtasks-step-num">2</span><div><b>创建项目</b>（或选择已有项目），点击顶部项目选择器 → 新建项目</div></div>',
        '  <div class="gtasks-step"><span class="gtasks-step-num">3</span><div><b>启用 API</b>：左侧菜单 → API 和服务 → 库 → 搜索 "Gmail API" → 点击启用</div></div>',
        '  <div class="gtasks-step"><span class="gtasks-step-num">4</span><div><b>配置 OAuth 同意屏幕</b>：API 和服务 → OAuth 同意屏幕 → 选"外部" → 填写应用名称 → 保存</div></div>',
        '  <div class="gtasks-step"><span class="gtasks-step-num">5</span><div><b>添加测试用户</b>：OAuth 同意屏幕 → 测试用户 → 添加你的 Gmail 地址（测试阶段必须添加）</div></div>',
        '  <div class="gtasks-step"><span class="gtasks-step-num">6</span><div><b>创建凭据</b>：API 和服务 → 凭据 → 创建 OAuth 客户端 ID → 应用类型选 <b>Chrome 扩展</b></div></div>',
        '  <div class="gtasks-step"><span class="gtasks-step-num">7</span><div><b>填写扩展 ID</b>：打开 <code>chrome://extensions</code> → 复制本扩展的 ID → 粘贴到"已授权的重定向 URI"中，格式为 <code>https://&lt;扩展ID&gt;.chromiumapp.org/</code></div></div>',
        '  <div class="gtasks-step"><span class="gtasks-step-num">8</span><div><b>复制 Client ID</b>：创建完成后复制 Client ID（以 <code>.apps.googleusercontent.com</code> 结尾），粘贴到上方输入框</div></div>',
        '</div>',
        '<div class="gtasks-tutorial-footer">',
        '  <a href="https://console.cloud.google.com/apis/credentials" target="_blank" class="gtasks-btn gtasks-btn-connect" style="text-decoration:none">',
        '    <span class="material-icons">open_in_new</span>打开 Google Cloud Console',
        '  </a>',
        '</div>'
    ].join('');

    overlay.appendChild(card);
    document.body.appendChild(overlay);
},
genWidgetId () {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
        return window.crypto.randomUUID();
    }
    return 'w-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
},
deleteWidget (id) {
    const widgets = this.settings.widgetPanel && this.settings.widgetPanel.widgets;
    if (!Array.isArray(widgets)) return;
    const idx = widgets.findIndex(w => w.id === id);
    if (idx >= 0) {
        const name = this.WIDGET_TYPES[widgets[idx].type] ? this.WIDGET_TYPES[widgets[idx].type].name : '小组件';
        widgets.splice(idx, 1);
        this.saveWidgetSettings();
        this.renderWidgetPanel();
        this.showNotification('"' + name + '" 已删除');
    }
},
exportWidgets () {
    const widgets = (this.settings.widgetPanel && Array.isArray(this.settings.widgetPanel.widgets))
        ? this.settings.widgetPanel.widgets : [];
    if (widgets.length === 0) {
        this.showNotification('没有可导出的小组件');
        return;
    }
    const data = {
        app: 'OOOInterface',
        type: 'widgets',
        version: (typeof VERSION !== 'undefined') ? VERSION : '',
        exportedAt: new Date().toISOString(),
        widgets: widgets.map(w => ({
            id: w.id,
            type: w.type,
            size: this.normalizeWidgetSize(w.type, w.size),
            data: w.data || {}
        }))
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'OOOInterface-Widgets-' + new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-') + '.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        URL.revokeObjectURL(url);
        if (a.parentNode) a.parentNode.removeChild(a);
    }, 0);
    this.showNotification('已导出 ' + widgets.length + ' 个小组件');
},
importWidgets (text, listContainer) {
    const self = this;
    try {
        const data = JSON.parse(text);
        let incoming = [];
        if (Array.isArray(data)) {
            incoming = data;
        } else if (data && Array.isArray(data.widgets)) {
            incoming = data.widgets;
        } else {
            throw new Error('JSON 结构不正确');
        }

        let added = 0;
        incoming.forEach(w => {
            if (!w || !w.type || !this.WIDGET_TYPES[w.type]) return;
            const size = this.normalizeWidgetSize(w.type, w.size);
            const newWidget = {
                id: this.genWidgetId(),
                type: w.type,
                size: size,
                data: w.data || {}
            };
            this.settings.widgetPanel.widgets.push(newWidget);
            added++;
        });

        if (added === 0) {
            this.showNotification('文件中没有有效的小组件');
            return;
        }
        this.saveWidgetSettings();
        this.renderWidgetPanel();
        if (listContainer) this.updateWidgetPanelListInMenu(listContainer);
        this.showNotification('已导入 ' + added + ' 个小组件');
    } catch (e) {
        this.showNotification('导入失败：' + e.message);
    }
},
};

// ==== main/Script/core/mixins/ImportExportMixin.js ====
// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

const ImportExportMixin = {
exportSettingsAsMarkdown () {
    const version = (typeof VERSION !== 'undefined') ? VERSION : 'unknown';
    const now = new Date();
    const timeStr = now.toLocaleString('zh-CN', { hour12: false });
    const timestamp = now.toISOString();

    const json = JSON.stringify(this.settings, null, 2);
    const md = [
        '# OOOInterface 配置备份',
        '',
        '- 导出时间：' + timeStr,
        '- ISO 时间戳：' + timestamp,
        '- 版本：' + version,
        '',
        '```json',
        json,
        '```'
    ].join('\n');

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'OOOInterface-Settings-' + timestamp.replace(/[:T]/g, '-').slice(0, 19) + '.md';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        URL.revokeObjectURL(url);
        if (a.parentNode) a.parentNode.removeChild(a);
    }, 0);
    this.showNotification('配置已导出为 Markdown');
},
importSettingsFromMarkdown (file) {
    const self = this;
    if (!file || !file.name.toLowerCase().endsWith('.md')) {
        this.showNotification('请选择 .md 文件');
        return;
    }
    const reader = new FileReader();
    reader.onload = function () {
        try {
            const text = reader.result;
            // 提取 ```json ... ``` 块
            const match = text.match(/```(?:json)?\s*\n([\s\S]*?)\n\s*```/);
            if (!match) throw new Error('未找到 ```json 代码块，文件格式不正确');
            const settings = JSON.parse(match[1].trim());
            if (!settings || typeof settings !== 'object') throw new Error('JSON 解析失败，根节点不是对象');

            // 写入并立即保存
            self.settings = settings;
            self.saveSettings();
            self.applySettings();
            self.showNotification('配置导入成功，已刷新页面');
        } catch (e) {
            self.showNotification('导入失败：' + (e.message || '未知错误'));
            console.error('[importSettingsFromMarkdown]', e);
        }
    };
    reader.onerror = function () {
        self.showNotification('文件读取失败');
    };
    reader.readAsText(file);
},
};

// ==== main/Script/core/mixins/SystemInfoMixin.js ====
// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

const SystemInfoMixin = {
    getOperatingSystem() {
        const userAgent = navigator.userAgent;
        if (userAgent.includes('Windows')) return 'Windows';
        if (userAgent.includes('Mac OS')) return 'Mac OS';
        if (userAgent.includes('Linux')) return 'Linux';
        if (userAgent.includes('Android')) return 'Android';
        if (userAgent.includes('iOS')) return 'iOS';
        return 'Unknown';
    },
    getMemoryUsage(type) {
        if (type === 'uac') {
            return String(this.backendConnected);
        }
        return 'N/A';
    },
};

// ==== main/Script/core/mixins/InteractionMixin.js ====
// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

const InteractionMixin = {
    setupDragAndDrop() {
        const modalBody = document.querySelector('.modal-body');

        modalBody.addEventListener('dragover', (e) => {
            e.preventDefault();
            modalBody.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
        });

        modalBody.addEventListener('dragleave', (e) => {
            e.preventDefault();
            modalBody.style.backgroundColor = '';
        });

        modalBody.addEventListener('drop', (e) => {
            e.preventDefault();
            modalBody.style.backgroundColor = '';
            // 各右面板菜单自行处理拖放，详见 showSettingsMenuInRightPanel
        });
    },
    setupMouseScroll() {
        const modalBody = document.querySelector('.modal-body');
        let isDown = false;
        let startY;
        let scrollTop;

        // 鼠标按下事件
        modalBody.addEventListener('mousedown', (e) => {
            // 如果点击的是滑块、输入框或其他可交互元素，不处理
            if (e.target.tagName === 'INPUT' ||
                e.target.tagName === 'BUTTON' ||
                e.target.tagName === 'SELECT' ||
                e.target.tagName === 'TEXTAREA' ||
                e.target.closest('.slider-input') ||
                e.target.closest('input[type="range"]')) {
                return;
            }
            isDown = true;
            startY = e.pageY - modalBody.offsetTop;
            scrollTop = modalBody.scrollTop;
            modalBody.style.cursor = 'grabbing';
        });

        // 鼠标离开事件
        modalBody.addEventListener('mouseleave', () => {
            isDown = false;
            modalBody.style.cursor = 'default';
        });

        // 鼠标松开事件
        modalBody.addEventListener('mouseup', () => {
            isDown = false;
            modalBody.style.cursor = 'default';
        });

        // 鼠标移动事件
        modalBody.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const y = e.pageY - modalBody.offsetTop;
            const walk = (y - startY) * 2; // 滚动速度
            modalBody.scrollTop = scrollTop - walk;
        });
    },
};

// ==== main/Script/core/main.js ====
'use strict';

// 新标签页（main/index.html）的模块入口。
//
// 职责：
//   1. 引入主应用类与手柄控制器；
//   2. 承接原先写在 script.js 末尾的启动引导（首启/版本升级跳欢迎页）；
//   3. 维护 runtime 注册表，供 OOOInterface 与 Controller 互相取用。
//
// 加载顺序说明：index.html 中 version.js 仍以经典脚本标签加载，且排在 bundle 之前。
// bundle 自己用 <script defer>：经典脚本，同样是文档解析完成后、DOMContentLoaded
// 之前执行（与原来的 type="module" 时机一致），因此此处可以安全地以裸名读取
// version.js 的全局（VERSION / compareVersions 等）。
//
// 为什么不用 type="module"：扩展页里 Chromium 会为同一个模块 URL 发两次 parser 请求，
// 910KB 的 bundle 因此要读两遍；换成经典 defer 脚本只读一次，实测 DCL 66→41ms、
// app-constructed 76→55ms。副作用是经典脚本共享全局词法作用域：bundle 顶层的
// const/class 会进入全局，改名时注意别和 version.js（VERSION 等）重名。

// [bundled] import { … } from './script.js'
// [bundled] import { … } from './runtime.js'
// 仅为其自带的 DOMContentLoaded 引导（延迟 500ms 创建手柄控制器）而引入
// [bundled] import './Controller.js'

// ========== 域混入模块（Stage 8 拆分产物）==========
// 每个 mixin 导出一个对象，方法在此统一挂到 OOOInterface.prototype 上。
// 拆分只搬家、不改写调用点，因此 this 语义与原文件完全一致。
// [bundled] import { … } from './mixins/BadgeMixin.js'
// [bundled] import { … } from './mixins/BadgeAudioMixin.js'
// [bundled] import { … } from './mixins/ContextMenuMixin.js'
// [bundled] import { … } from './mixins/VisualEffectsMixin.js'
// [bundled] import { … } from './mixins/CustomSelectMixin.js'
// [bundled] import { … } from './mixins/ThemeMixin.js'
// [bundled] import { … } from './mixins/ColorMixin.js'
// [bundled] import { … } from './mixins/StatusBarMixin.js'
// [bundled] import { … } from './mixins/NotificationsMixin.js'
// [bundled] import { … } from './mixins/InfoPopupToggleMixin.js'
// [bundled] import { … } from './mixins/ResetMixin.js'
// [bundled] import { … } from './mixins/AssetsMixin.js'
// [bundled] import { … } from './mixins/WallpaperMixin.js'
// [bundled] import { … } from './mixins/QuickLinksMixin.js'
// [bundled] import { … } from './mixins/SearchMixin.js'
// [bundled] import { … } from './mixins/TranslateMixin.js'
// [bundled] import { … } from './mixins/SettingsMixin.js'
// [bundled] import { … } from './mixins/SidePanelBridgeMixin.js'
// [bundled] import { … } from './mixins/RightPanelMixin.js'
// [bundled] import { … } from './mixins/BookmarkMixin.js'
// [bundled] import { … } from './mixins/WidgetMixin.js'
// [bundled] import { … } from './mixins/ImportExportMixin.js'
// [bundled] import { … } from './mixins/SystemInfoMixin.js'
// [bundled] import { … } from './mixins/InteractionMixin.js'

const MIXINS = [
    BadgeMixin,
    BadgeAudioMixin,
    ContextMenuMixin,
    VisualEffectsMixin,
    CustomSelectMixin,
    ThemeMixin,
    ColorMixin,
    StatusBarMixin,
    NotificationsMixin,
    InfoPopupToggleMixin,
    ResetMixin,
    AssetsMixin,
    WallpaperMixin,
    QuickLinksMixin,
    SearchMixin,
    TranslateMixin,
    SettingsMixin,
    SidePanelBridgeMixin,
    RightPanelMixin,
    BookmarkMixin,
    WidgetMixin,
    ImportExportMixin,
    SystemInfoMixin,
    InteractionMixin,
];

// 组装前先查重：mixins 唯一的静默失败模式就是两个域定义了同名方法，
// 后挂的会悄悄覆盖先挂的。这里把它变成一声响亮的启动错误。
(function assembleMixins() {
    const seen = new Map();
    const conflicts = [];
    MIXINS.forEach((mixin, i) => {
        Object.keys(mixin).forEach((key) => {
            if (seen.has(key)) {
                conflicts.push(`${key}（第 ${seen.get(key) + 1} 个与第 ${i + 1} 个 mixin）`);
            } else {
                seen.set(key, i);
            }
        });
    });
    if (conflicts.length) {
        throw new Error('mixin 方法名冲突：' + conflicts.join('、'));
    }
    MIXINS.forEach((mixin) => Object.assign(OOOInterface.prototype, mixin));
})();

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    var storedVersion = localStorage.getItem('welcVersion');
    if (storedVersion && compareVersions(VERSION, storedVersion) > 0) {
        localStorage.removeItem('hasVisited');
        localStorage.removeItem('welcVersion');
        window.location.href = 'welc/welc.html';
        return;
    }
    if (!storedVersion && localStorage.getItem('hasVisited')) {
        localStorage.removeItem('hasVisited');
        window.location.href = 'welc/welc.html';
        return;
    }
    if (!localStorage.getItem('hasVisited')) {
        window.location.href = 'welc/welc.html';
    } else {
        const app = new OOOInterface();
        runtime.ooo = app;
        // 保留全局引用：仅供调试与既有外部调用（Controller 的兜底读取）使用
        window.oooInterface = app;
    }
});

// 添加错误处理
window.addEventListener('error', (e) => {
    console.error('OOOInterface Error:', e.error);
});

// 添加未处理的Promise拒绝处理
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
});

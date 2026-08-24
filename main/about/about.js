(function () {
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent);
    var isSmallScreen = window.innerWidth <= 768;
    if (isMobile || isSmallScreen) {
        document.documentElement.classList.add('mobile');
        document.body.classList.add('mobile-device');
    }
    window.addEventListener('resize', function () {
        if (window.innerWidth <= 768) {
            document.documentElement.classList.add('mobile');
            document.body.classList.add('mobile-device');
        } else {
            document.documentElement.classList.remove('mobile');
            document.body.classList.remove('mobile-device');
        }
    });
})();

(function initVisualEffects() {
    try {
        const settings = JSON.parse(localStorage.getItem('oooInterfaceSettings') || '{}');
        const isDynamicBlur = settings.dynamicBlur === true;
        const isEnhancedDisplay = settings.dynamicBlur === true && settings.enhancedDisplay === true;

        if (isDynamicBlur) {
            document.body.classList.add('dynamic-blur');
        }
        if (isEnhancedDisplay) {
            document.body.classList.add('enhanced-display');
        }
    } catch (e) {
        console.warn('Failed to read visual effects settings');
    }
})();

const floatBtn = document.querySelector('.float-btn');
const iconLock = document.querySelector('.icon-lock');

let hoverTimer = null;
let isScrolled = false;
let isThemeMode = false;
let isLocked = localStorage.getItem('themeLocked') === 'true';
let currentTheme = localStorage.getItem('currentTheme');
/** 记录 OUA 后端是否已成功连接（activeBase 非空时置 true） */
var backendConnected = false;

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
    } else {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    }
}

function updateLockIcon() {
    iconLock.style.display = isLocked ? 'block' : 'none';
}

function updateButtonState() {
    if (isScrolled) {
        floatBtn.classList.add('scrolled');
        if (isThemeMode) {
            floatBtn.classList.add('theme-mode');
        } else {
            floatBtn.classList.remove('theme-mode');
        }
    } else {
        floatBtn.classList.remove('scrolled');
        floatBtn.classList.remove('theme-mode');
    }
}

if (isLocked && currentTheme) {
    applyTheme(currentTheme);
} else if (!isLocked) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
}
updateLockIcon();

floatBtn.addEventListener('mouseenter', function () {
    if (isScrolled) {
        hoverTimer = setTimeout(function () {
            isThemeMode = true;
            updateButtonState();
        }, 1000);
    }
});

floatBtn.addEventListener('mouseleave', function () {
    if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
    }
    setTimeout(function () {
        if (!floatBtn.matches(':hover')) {
            isThemeMode = false;
            updateButtonState();
        }
    }, 100);
});

floatBtn.addEventListener('click', function (e) {
    if (isScrolled && isThemeMode) {
        e.preventDefault();
        const currentIsDark = document.body.classList.contains('dark-theme');

        if (currentIsDark) {
            applyTheme('light');
            if (isLocked) localStorage.setItem('currentTheme', 'light');
        } else {
            applyTheme('dark');
            if (isLocked) localStorage.setItem('currentTheme', 'dark');
        }
    } else if (isScrolled) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        const currentIsDark = document.body.classList.contains('dark-theme');

        if (currentIsDark) {
            applyTheme('light');
            if (isLocked) localStorage.setItem('currentTheme', 'light');
        } else {
            applyTheme('dark');
            if (isLocked) localStorage.setItem('currentTheme', 'dark');
        }
    }
});

floatBtn.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    isLocked = !isLocked;
    localStorage.setItem('themeLocked', isLocked);

    if (isLocked) {
        const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('currentTheme', theme);
    } else {
        localStorage.removeItem('currentTheme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }
    updateLockIcon();
});

window.addEventListener('scroll', function () {
    if (window.scrollY > 100) {
        isScrolled = true;
    } else {
        isScrolled = false;
        isThemeMode = false;
    }
    updateButtonState();
});

// 与主页面铭牌彩蛋完全同款（样式 + 文本信息）
let infoPopupOpen = false;

function getOperatingSystem() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac OS')) return 'Mac OS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
}

function getMemoryUsage(type) {
    // 不再返回假数据，改为实时检测 OUA 后端连接状态
    if (type === 'uac') {
        return String(backendConnected);
    }
    return 'N/A';
}

function showInfoPopup() {
    if (infoPopupOpen) return;
    infoPopupOpen = true;

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
    version.textContent = `[component.over]${VERSION}`;
    version.style.cssText = `
        font-size: 14px;
        color: #000000;
        margin: 0;
        word-wrap: break-word;
    `;

    // 操作系统
    const os = document.createElement('p');
    const osName = getOperatingSystem();
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

    // 后端连接状态（UA Connection）
    const uac = document.createElement('p');
    const uacValue = getMemoryUsage('uac');
    uac.textContent = `[UAC]${uacValue}`;
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
        infoPopupOpen = false;
    };

    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            closePopup();
        }
    };
    document.addEventListener('keydown', handleEsc);

    // 点击弹窗也可关闭，避免弹窗长期驻留时监听器泄漏
    popup.addEventListener('click', closePopup);
}

const VERSIONS_JSON_URL = 'https://rudan177.github.io/OOOInterface/info/versions.json';
let versionsData = [];

function loadVersionsData() {
    return fetch(VERSIONS_JSON_URL)
        .then(response => {
            if (!response.ok) throw new Error('网络响应异常');
            return response.json();
        })
        .then(data => {
            versionsData = data.versions || [];
            return versionsData;
        });
}

function renderVersions(versions) {
    const container = document.getElementById('versionsList');
    if (!container) return;

    if (versions.length === 0) {
        container.innerHTML = '<div class="changelog-loading">暂无版本数据</div>';
        return;
    }

    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '12px';
    container.innerHTML = '';

    // 远程 JSON 内容一律用 textContent 写入，避免 innerHTML 拼接导致 XSS
    versions.forEach((version, index) => {
        const card = document.createElement('div');
        card.className = 'version-card';
        card.style.setProperty('--i', index);

        const titleDiv = document.createElement('div');
        titleDiv.className = 'version-card-title';

        const badge = document.createElement('span');
        badge.className = 'version-card-badge';
        badge.textContent = version.version || '';
        titleDiv.appendChild(badge);
        titleDiv.appendChild(document.createTextNode(version.title || ''));
        card.appendChild(titleDiv);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'version-card-content';

        if (version.content && Array.isArray(version.content)) {
            version.content.forEach(item => {
                if (item.type === 'paragraph') {
                    const p = document.createElement('p');
                    p.textContent = item.text || '';
                    contentDiv.appendChild(p);
                } else if (item.type === 'heading') {
                    const h3 = document.createElement('h3');
                    h3.textContent = item.text || '';
                    contentDiv.appendChild(h3);
                } else if (item.type === 'list' && item.items) {
                    const ol = document.createElement('ol');
                    item.items.forEach(li => {
                        const liEl = document.createElement('li');
                        liEl.textContent = li || '';
                        ol.appendChild(liEl);
                    });
                    contentDiv.appendChild(ol);
                }
            });
        }

        card.appendChild(contentDiv);
        container.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const logoImage = document.getElementById('logoImage');
    if (logoImage) {
        logoImage.addEventListener('dblclick', showInfoPopup);
    }

    const trademarkNames = document.querySelectorAll('.trademark-name');
    const trademarkDesc = document.getElementById('trademarkDesc');

    if (trademarkNames.length > 0 && trademarkDesc) {
        trademarkNames.forEach(function (name) {
            name.addEventListener('click', function () {
                const desc = this.getAttribute('data-desc');
                const isActive = this.classList.contains('active');

                trademarkNames.forEach(function (n) {
                    n.classList.remove('active');
                });

                if (isActive) {
                    trademarkDesc.classList.remove('show');
                    trademarkDesc.textContent = '';
                } else {
                    this.classList.add('active');
                    trademarkDesc.textContent = desc;
                    trademarkDesc.classList.add('show');
                }
            });
        });
    }

    loadVersionsData()
        .then(() => {
            renderVersions(versionsData);
        })
        .catch(error => {
            console.error('加载版本数据失败:', error);
            const container = document.getElementById('versionsList');
            if (container) {
                container.innerHTML = '<div class="changelog-error">⚠️ 加载失败，请检查网络连接</div>';
            }
        });
});

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('version-text').textContent = VERSION;
    document.getElementById('version-info').textContent = VERSION;
    document.getElementById('product-name').textContent = PRODUCT_NAME;
    document.getElementById('release-date').textContent = RELEASE_DATE;
    document.getElementById('license-id').textContent = LICENSE_ID;
    document.getElementById('copyright-text').textContent = COPYRIGHT;
    document.getElementById('about-footer').textContent = `许可证：${LICENSE_ID} · ${COPYRIGHT}`;
});

// =============================================
// OUA 联动：点击版本徽章检查更新 / 从云端更新
// 通过 OUA 可访问性 HTTP 服务（127.0.0.1:8964）调用后端
// =============================================
(function () {
    var API_BASES = ['http://127.0.0.1:8964', 'http://localhost:8964'];

    var overlay = null;
    var dialog = null;
    var footer = null;
    var checkingEl = null;
    var infoEl = null;
    var infoGrid = null;
    var progressEl = null;
    var progressFill = null;
    var tipEl = null;
    var closeBtn = null;
    var titleEl = null;
    var badge = null;
    var badgeText = null;

    var busy = false;      // 检查 / 更新进行中
    var updating = false;  // 更新进行中（禁止关闭弹窗）
    var activeBase = null; // 检查成功后记录的可用后端地址，用于 SSE 进度订阅
    var isEnhancedDisplay = false; // 是否开启高级视觉效果

    function YuanJian(id) {
        return document.getElementById(id);
    }

    function applyDialogScale() {
        if (!dialog || !isEnhancedDisplay) return;
        // 根据窗口宽度计算缩放比例，保持弹窗不超过视口
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        var baseW = 460; // max-width from CSS
        var pct = Math.min(1, (vw * 0.92) / baseW);
        var targetScale = Math.max(0.7, Math.min(1, pct));
        // 缩放中心偏上，让弹窗从下方“舒展”出来
        dialog.style.transformOrigin = 'center 30%';
        dialog.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        dialog.style.transform = 'scale(' + targetScale + ') translateY(' + (1 - targetScale) * 20 + 'px)';
    }

    function init() {
        overlay = YuanJian('updateOverlay');
        if (!overlay) return;
        dialog = overlay.querySelector('.update-dialog');
        footer = YuanJian('updateDialogFooter');
        checkingEl = YuanJian('updateChecking');
        infoEl = YuanJian('updateInfo');
        infoGrid = infoEl ? infoEl.querySelector('.info-grid') : null;
        progressEl = YuanJian('updateProgress');
        progressFill = YuanJian('updateProgressFill');
        tipEl = YuanJian('updateTip');
        closeBtn = YuanJian('updateDialogClose');
        titleEl = YuanJian('updateDialogTitle');
        badge = YuanJian('versionBadge');
        badgeText = YuanJian('version-text');

        try {
            var s = JSON.parse(localStorage.getItem('oooInterfaceSettings') || '{}');
            isEnhancedDisplay = s.dynamicBlur === true && s.enhancedDisplay === true;
        } catch (_) {}

        if (isEnhancedDisplay) {
            applyDialogScale();
            var resizeTimer = null;
            window.addEventListener('resize', function () {
                if (resizeTimer) cancelAnimationFrame(resizeTimer);
                resizeTimer = requestAnimationFrame(function () { applyDialogScale(); });
            });
        }

        if (badge) {
            badge.addEventListener('click', function (e) {
                e.preventDefault();
                checkUpdate();
            });
        }
        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                if (!updating) hideOverlay();
            });
        }
        if (overlay) {
            overlay.addEventListener('click', function (e) {
                if (e.target === overlay && !updating) hideOverlay();
            });
        }
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && overlay && overlay.classList.contains('show') && !updating) {
                hideOverlay();
            }
        });

        // 安装目录复制按钮
        var copyBtn = YuanJian('copyInstallDirBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                var dir = YuanJian('updateInstallDir') ? YuanJian('updateInstallDir').textContent : '';
                if (!dir || dir === '未设置') return;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(dir).then(function () {
                        flashCopied(copyBtn);
                    });
                } else {
                    // 降级方案
                    var ta = document.createElement('textarea');
                    ta.value = dir;
                    ta.style.cssText = 'position:fixed;opacity:0';
                    document.body.appendChild(ta);
                    ta.select();
                    document.execCommand('copy');
                    document.body.removeChild(ta);
                    flashCopied(copyBtn);
                }
            });
        }
        function flashCopied(btn) {
            btn.classList.add('copied');
            var icon = btn.querySelector('.material-icons');
            var origIcon = icon ? icon.textContent : '';
            if (icon) icon.textContent = 'check';
            setTimeout(function () {
                btn.classList.remove('copied');
                if (icon) icon.textContent = origIcon;
            }, 1200);
        }
    }

    /**
     * 调用 OUA 后端接口：依次尝试各 base 地址，连接类错误时自动回退
     * 成功后记录可用的 base，供后续 SSE 进度订阅复用
     */
    function apiFetch(path, options) {
        var lastError = null;
        var succeeded = false;

        function attempt(base) {
            return fetch(base + path, options).then(function (res) {
                return res.json().then(function (payload) {
                    if (!res.ok || !payload.ok) {
                        throw new Error(payload.error || ('HTTP ' + res.status));
                    }
                    if (!succeeded) {
                        succeeded = true;
                        activeBase = base;
                        backendConnected = true;
                        try { localStorage.setItem('oooBackendConnected', 'true'); } catch (_) {}
                    }
                    return payload.data;
                });
            });
        }

        var chain = Promise.reject(new Error('未连接 OUA'));
        for (var i = 0; i < API_BASES.length; i++) {
            (function (base) {
                chain = chain.catch(function (err) {
                    lastError = err;
                    return attempt(base);
                });
            })(API_BASES[i]);
        }
        return chain.catch(function (err) {
            throw (lastError || err);
        });
    }

    function showOverlay() {
        if (isEnhancedDisplay) {
            dialog.style.transition = 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
            dialog.style.transformOrigin = 'center 30%';
            dialog.style.transform = '';       // 清除 resize 缩放，让 CSS 类接管弹窗动画
        }
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function hideOverlay() {
        if (updating) return;
        overlay.classList.remove('show');
        document.body.style.overflow = '';
        if (isEnhancedDisplay) {
            dialog.style.transform = '';
            requestAnimationFrame(function () { applyDialogScale(); });
        }
    }

    function setBadgeBusy(isBusy) {
        if (!badge) return;
        if (isBusy) {
            badge.style.pointerEvents = 'none';
            badge.style.opacity = '0.75';
            if (badgeText) badgeText.textContent = '检查中…';
        } else {
            badge.style.pointerEvents = '';
            badge.style.opacity = '';
            if (badgeText) badgeText.textContent = VERSION;
        }
    }

    function renderButtons(buttons) {
        footer.innerHTML = '';
        buttons.forEach(function (cfg, i) {
            var cls = 'update-btn';
            if (buttons.length === 1) {
                cls += ' update-btn-full';
            } else if (!cfg.primary) {
                cls += ' update-btn-cancel';
            }
            if (cfg.primary) cls += ' update-btn-primary';
            else cls += ' update-btn-secondary';
            var btn = document.createElement('button');
            btn.className = cls;
            btn.textContent = cfg.text;
            btn.addEventListener('click', cfg.onClick);
            footer.appendChild(btn);
        });
    }

    function showChecking() {
        titleEl.textContent = '检查更新';
        checkingEl.style.display = '';
        infoEl.style.display = 'none';
        progressEl.style.display = 'none';
        footer.innerHTML = '';
        closeBtn.style.visibility = 'hidden';
    }

    function setProgress(percent, message) {
        var p = Math.max(0, Math.min(100, percent || 0));
        progressFill.style.transform = 'scaleX(' + (p / 100) + ')';
    }

    function renderCheckResult(data) {
        checkingEl.style.display = 'none';
        infoEl.style.display = '';
        if (infoGrid) infoGrid.style.display = '';
        tipEl.style.display = '';
        progressEl.style.display = 'none';
        closeBtn.style.visibility = '';

        YuanJian('updateInstallDir').textContent = data.installDir || '未设置';
        YuanJian('updateBranch').textContent = data.branchLabel || data.branch || '未知';
        YuanJian('updateUpdateData').textContent = data.dataSource || '—';
        YuanJian('updateLocalVersion').textContent = data.localVersion || '未检测到';
        YuanJian('updateRemoteVersion').textContent =
            data.remoteVersion || (data.localMode ? '本地模式' : '获取失败');

        var buttons = [];
        if (data.localMode) {
            tipEl.textContent = '当前为本地导入模式，无法从云端更新。如需更新，请在 OUA 中切换到远程模式。';
            buttons.push({ text: '确定', primary: true, onClick: hideOverlay });
        } else if (!data.installDir) {
            tipEl.textContent = '尚未设置安装目录，请先在 OUA 主界面中设置安装目录。';
            buttons.push({ text: '确定', primary: true, onClick: hideOverlay });
        } else if (!data.remoteVersion) {
            tipEl.textContent = '无法获取云端版本，请检查网络连接后重试。';
            buttons.push({ text: '确定', primary: true, onClick: hideOverlay });
        } else if (data.isNewer) {
            tipEl.textContent = '我操，有挂！';
            buttons.push({ text: '确定', primary: true, onClick: hideOverlay });
        } else if (data.hasUpdate) {
            tipEl.textContent = '检测到新版本，点击「更新」将从云端拉取并覆盖安装。';
            buttons.push({ text: '取消', primary: false, onClick: hideOverlay });
            buttons.push({ text: '更新', primary: true, onClick: startUpdate });
        } else {
            tipEl.textContent = '当前已是最新版本。';
            buttons.push({ text: '确定', primary: true, onClick: hideOverlay });
        }
        renderButtons(buttons);
    }

    function renderError(message) {
        checkingEl.style.display = 'none';
        infoEl.style.display = '';
        if (infoGrid) infoGrid.style.display = 'none';
        tipEl.style.display = '';
        progressEl.style.display = 'none';
        closeBtn.style.visibility = '';
        tipEl.textContent = message;
        renderButtons([{ text: '确定', primary: true, onClick: hideOverlay }]);
    }

    function checkUpdate() {
        if (busy) return;
        busy = true;
        backendConnected = false; // 每次检查前重置连接状态
        try { localStorage.setItem('oooBackendConnected', 'false'); } catch (_) {}
        setBadgeBusy(true);
        showOverlay();
        showChecking();

        apiFetch('/api/interface/check-update')
            .then(function (data) {
                renderCheckResult(data);
            })
            .catch(function (err) {
                var msg = err.message || '';
                if (!msg || msg === 'Failed to fetch' || msg.includes('fetch')) {
                    msg = '连接失败，请尝试启动升级工具或打开外部访问接口。';
                }
                renderError(msg);
            })
            .then(function () {
                busy = false;
                setBadgeBusy(false);
            });
    }

    function startUpdate() {
        if (updating || busy) return;
        updating = true;
        busy = true;

        titleEl.textContent = '正在更新';
        tipEl.style.display = 'none';
        footer.innerHTML = '';
        closeBtn.style.visibility = 'hidden';
        progressEl.style.display = '';
        setProgress(0, '正在连接 OUA 后端…');

        // 伪进度：0~80% 匀速平滑动画，SSE 真实进度到达后接管
        var fakeDone = false;
        var fakeStart = performance.now();
        var fakeTimer = requestAnimationFrame(function tick() {
            if (fakeDone) return;
            var elapsed = performance.now() - fakeStart;
            var shown = Math.min(78, (elapsed / 4000) * 78);
            progressFill.style.transform = 'scaleX(' + (shown / 100) + ')';
            if (!fakeDone) fakeTimer = requestAnimationFrame(tick);
        });
        function stopFake() {
            fakeDone = true;
            cancelAnimationFrame(fakeTimer);
        }

        // 通过 SSE 订阅更新进度（优先使用检查成功时确认可用的后端地址）
        var es = null;
        try {
            es = new EventSource((activeBase || API_BASES[0]) + '/api/events');
        } catch (e) {
            es = null;
        }
        if (es) {
            es.addEventListener('progress', function (e) {
                var data;
                try {
                    data = JSON.parse(e.data);
                } catch (_) {
                    return;
                }
                if (data.channel === 'update-progress') {
                    stopFake();
                    // 真实进度 0~100 映射到 80~100 区间
                    var mapped = 80 + (data.percent / 100) * 20;
                    setProgress(mapped, data.message || '');
                }
            });
        }

        apiFetch('/api/interface/update', { method: 'POST' })
            .then(function () {
                stopFake();
                if (es) es.close();
                updating = false;
                busy = false;
                setProgress(100, '更新完成');
                titleEl.textContent = '更新完成';
                tipEl.style.display = '';
                tipEl.textContent = '更新已完成，点击「确定」刷新页面。';
                progressEl.style.display = 'none';
                renderButtons([{
                    text: '确定',
                    primary: true,
                    onClick: function () {
                        hideOverlay();
                        location.reload();
                    }
                }]);
            })
            .catch(function (err) {
                stopFake();
                if (es) es.close();
                updating = false;
                busy = false;
                setProgress(100, '');
                titleEl.textContent = '更新失败';
                tipEl.style.display = '';
                var msg = err.message || '';
                if (!msg || msg === 'Failed to fetch' || msg.includes('fetch')) {
                    msg = '连接失败，请尝试启动升级工具或打开外部访问接口。';
                }
                tipEl.textContent = msg;
                progressEl.style.display = 'none';
                renderButtons([{ text: '确定', primary: true, onClick: hideOverlay }]);
            });
    }

    init();
})();

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
        console.log('Failed to read visual effects settings');
    }
})();

const floatBtn = document.querySelector('.float-btn');
const iconLock = document.querySelector('.icon-lock');

let hoverTimer = null;
let isScrolled = false;
let isThemeMode = false;
let isLocked = localStorage.getItem('themeLocked') === 'true';
let currentTheme = localStorage.getItem('currentTheme');

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

function showInfoPopup() {
    const popup = document.createElement('div');
    popup.id = 'infoPopup';
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
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    `;

    const isDarkMode = document.body.classList.contains('dark-theme');
    if (isDarkMode) {
        popup.style.backgroundColor = '#2a2a2a';
        popup.style.color = '#e8eaed';
    }

    const content = document.createElement('div');
    content.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 15px;
    `;

    const version = document.createElement('p');
    version.textContent = `[component.over]${this.currentVersion}`;
    version.style.cssText = `
        font-size: 14px;
        color: #000000;
        margin: 0;
        word-wrap: break-word;
    `;

    infoItems.forEach(text => {
        const p = document.createElement('p');
        p.textContent = text;
        p.style.cssText = `
            font-size: 14px;
            margin: 0;
            word-wrap: break-word;
            color: ${isDarkMode ? '#e8eaed' : '#000000'};
        `;
        content.appendChild(p);
    });

    popup.appendChild(content);
    document.body.appendChild(popup);

    popup.addEventListener('click', () => {
        document.body.removeChild(popup);
    });

    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            if (document.getElementById('infoPopup')) {
                document.body.removeChild(popup);
            }
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
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
    
    versions.forEach((version, index) => {
        const card = document.createElement('div');
        card.className = 'version-card';
        card.style.setProperty('--i', index);
        
        let contentHTML = `
            <div class="version-card-title">
                <span class="version-card-badge">${version.version}</span>
                ${version.title}
            </div>
            <div class="version-card-content">
        `;
        
        if (version.content && Array.isArray(version.content)) {
            version.content.forEach(item => {
                if (item.type === 'paragraph') {
                    contentHTML += `<p>${item.text}</p>`;
                } else if (item.type === 'heading') {
                    contentHTML += `<h3>${item.text}</h3>`;
                } else if (item.type === 'list' && item.items) {
                    contentHTML += '<ol>';
                    item.items.forEach(li => {
                        contentHTML += `<li>${li}</li>`;
                    });
                    contentHTML += '</ol>';
                }
            });
        }
        
        contentHTML += '</div>';
        card.innerHTML = contentHTML;
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

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('version-text').textContent = VERSION;
    document.getElementById('version-info').textContent = VERSION;
    document.getElementById('product-name').textContent = PRODUCT_NAME;
    document.getElementById('release-date').textContent = RELEASE_DATE;
    document.getElementById('license-id').textContent = LICENSE_ID;
    document.getElementById('copyright-text').textContent = COPYRIGHT;
    document.getElementById('about-footer').textContent = `许可证：${LICENSE_ID} · ${COPYRIGHT}`;
});

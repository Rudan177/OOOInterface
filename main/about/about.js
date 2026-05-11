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
let iframeOverlay = null;
let iframeContainer = null;
let changelogIframe = null;
let wheelAccumulator = 0;
let wheelTimeout = null;
let isWheelTriggered = false;
const changelogUrl = 'https://rudan177.github.io/OOOInterface/about/aboutRapid.html';

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

    const changelogIframe = document.getElementById('changelogIframe');
    if (changelogIframe && changelogIframe.src !== 'about:blank') {
        try {
            if (changelogIframe.contentWindow && changelogIframe.contentWindow.setTheme) {
                changelogIframe.contentWindow.setTheme(theme);
            }
        } catch (e) {
            const changelogUrl = 'https://rudan177.github.io/OOOInterface/about/aboutRapid.html';
            changelogIframe.src = changelogUrl + '?theme=' + theme;
        }
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

function hideIframeOverlay() {
    if (iframeOverlay) {
        if (iframeContainer) {
            iframeContainer.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
            iframeContainer.style.transform = 'translateY(100%)';
        }
        setTimeout(function () {
            iframeOverlay.classList.remove('show');
            resetWheelState();
        }, 400);
    }
}

function resetWheelState() {
    wheelAccumulator = 0;
    isWheelTriggered = false;
    if (wheelTimeout) {
        clearTimeout(wheelTimeout);
        wheelTimeout = null;
    }
}

floatBtn.addEventListener('click', function (e) {
    if (iframeOverlay && iframeOverlay.classList.contains('show')) {
        hideIframeOverlay();
    }

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

        // 版本信息
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

function getOperatingSystem() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac OS')) return 'Mac OS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
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

    iframeOverlay = document.getElementById('iframeOverlay');
    const iframeCloseBtn = document.getElementById('iframeCloseBtn');
    changelogIframe = document.getElementById('changelogIframe');
    iframeContainer = document.querySelector('.iframe-container');

    let isAtBottom = false;
    let touchStartY = 0;
    let currentTranslateY = 0;
    let isDragging = false;
    let velocity = 0;
    let lastTouchY = 0;
    let lastTouchTime = 0;
    const threshold = 150;

    function checkIfAtBottom() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        return scrollTop + windowHeight >= documentHeight - 10;
    }

    function showIframeOverlay() {
        if (iframeOverlay && changelogIframe) {
            if (changelogIframe.src === 'about:blank') {
                const isDark = document.body.classList.contains('dark-theme');
                const themeParam = isDark ? 'dark' : 'light';
                changelogIframe.src = changelogUrl + '?theme=' + themeParam;
            } else {
                try {
                    const isDark = document.body.classList.contains('dark-theme');
                    if (changelogIframe.contentWindow && changelogIframe.contentWindow.setTheme) {
                        changelogIframe.contentWindow.setTheme(isDark ? 'dark' : 'light');
                    }
                } catch (e) {
                    const isDark = document.body.classList.contains('dark-theme');
                    const themeParam = isDark ? 'dark' : 'light';
                    changelogIframe.src = changelogUrl + '?theme=' + themeParam;
                }
            }
            iframeOverlay.classList.add('show');
            isWheelTriggered = true;
            if (iframeContainer) {
                iframeContainer.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
                iframeContainer.style.transform = 'translateY(0)';
            }
            setTimeout(function () {
                isWheelTriggered = false;
            }, 600);
        }
    }



    function setIframeTranslateY(y) {
        if (iframeContainer) {
            iframeContainer.style.transition = 'none';
            iframeContainer.style.transform = `translateY(${Math.max(0, y)}px)`;
        }
    }

    if (iframeCloseBtn) {
        iframeCloseBtn.addEventListener('click', hideIframeOverlay);
    }

    let isHeaderDragging = false;
    let headerStartY = 0;
    let headerCurrentTranslateY = 0;

    const iframeHeader = document.querySelector('.iframe-header');
    if (iframeHeader) {
        iframeHeader.addEventListener('touchstart', function (e) {
            if (iframeOverlay.classList.contains('show')) {
                isHeaderDragging = true;
                headerStartY = e.touches[0].clientY;
                headerCurrentTranslateY = 0;
            }
        }, { passive: true });

        iframeHeader.addEventListener('touchmove', function (e) {
            if (isHeaderDragging && iframeOverlay.classList.contains('show')) {
                const touchY = e.touches[0].clientY;
                const deltaY = touchY - headerStartY;

                if (deltaY > 0) {
                    const dampedY = deltaY * 0.8;
                    setIframeTranslateY(dampedY);
                    headerCurrentTranslateY = dampedY;
                } else {
                    setIframeTranslateY(0);
                    headerCurrentTranslateY = 0;
                }
            }
        }, { passive: true });

        iframeHeader.addEventListener('touchend', function () {
            if (isHeaderDragging && iframeOverlay.classList.contains('show')) {
                if (headerCurrentTranslateY > 80) {
                    hideIframeOverlay();
                } else {
                    if (iframeContainer) {
                        iframeContainer.style.transition = 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)';
                        iframeContainer.style.transform = 'translateY(0)';
                    }
                }
            }
            isHeaderDragging = false;
            headerCurrentTranslateY = 0;
        });

        iframeHeader.addEventListener('mousedown', function (e) {
            if (iframeOverlay.classList.contains('show')) {
                isHeaderDragging = true;
                headerStartY = e.clientY;
                headerCurrentTranslateY = 0;
                e.preventDefault();
            }
        });

        document.addEventListener('mousemove', function (e) {
            if (isHeaderDragging && iframeOverlay.classList.contains('show')) {
                const deltaY = e.clientY - headerStartY;

                if (deltaY > 0) {
                    const dampedY = deltaY * 0.8;
                    setIframeTranslateY(dampedY);
                    headerCurrentTranslateY = dampedY;
                } else {
                    setIframeTranslateY(0);
                    headerCurrentTranslateY = 0;
                }
            }
        });

        document.addEventListener('mouseup', function () {
            if (isHeaderDragging && iframeOverlay.classList.contains('show')) {
                if (headerCurrentTranslateY > 80) {
                    hideIframeOverlay();
                } else {
                    if (iframeContainer) {
                        iframeContainer.style.transition = 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)';
                        iframeContainer.style.transform = 'translateY(0)';
                    }
                }
            }
            isHeaderDragging = false;
            headerCurrentTranslateY = 0;
        });
    }

    window.addEventListener('scroll', function () {
        isAtBottom = checkIfAtBottom();
    });

    document.addEventListener('touchstart', function (e) {
        if (isAtBottom && !iframeOverlay.classList.contains('show')) {
            touchStartY = e.touches[0].clientY;
            lastTouchY = touchStartY;
            lastTouchTime = Date.now();
        }

        if (iframeOverlay && iframeOverlay.classList.contains('show')) {
            touchStartY = e.touches[0].clientY;
            lastTouchY = touchStartY;
            lastTouchTime = Date.now();
            isDragging = true;
            currentTranslateY = 0;
        }
    }, { passive: true });

    document.addEventListener('touchmove', function (e) {
        const now = Date.now();
        const touchY = e.touches[0].clientY;

        if (isAtBottom && touchStartY > 0 && !iframeOverlay.classList.contains('show')) {
            const deltaY = touchStartY - touchY;

            if (deltaY > threshold) {
                showIframeOverlay();
                touchStartY = 0;
            }
        }

        if (isDragging && iframeOverlay.classList.contains('show')) {
            const deltaY = touchY - touchStartY;

            velocity = (touchY - lastTouchY) / (now - lastTouchTime || 1);
            lastTouchY = touchY;
            lastTouchTime = now;

            if (deltaY > 0) {
                const dampedY = deltaY * 0.6;
                setIframeTranslateY(dampedY);
                currentTranslateY = dampedY;
            } else {
                setIframeTranslateY(0);
                currentTranslateY = 0;
            }
        }
    }, { passive: true });

    document.addEventListener('touchend', function () {
        if (isDragging && iframeOverlay.classList.contains('show')) {
            if (currentTranslateY > threshold * 0.8 || velocity > 0.8) {
                hideIframeOverlay();
            } else {
                if (iframeContainer) {
                    iframeContainer.style.transition = 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)';
                    iframeContainer.style.transform = 'translateY(0)';
                }
            }
        }

        touchStartY = 0;
        isDragging = false;
        currentTranslateY = 0;
        velocity = 0;
    });

    document.addEventListener('wheel', function (e) {
        if (isWheelTriggered) {
            return;
        }

        if (isAtBottom && e.deltaY > 0 && !iframeOverlay.classList.contains('show')) {
            wheelAccumulator += Math.abs(e.deltaY);

            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(function () {
                wheelAccumulator = 0;
            }, 150);

            if (wheelAccumulator > threshold * 3) {
                showIframeOverlay();
                wheelAccumulator = 0;
            }
        } else if (iframeOverlay && iframeOverlay.classList.contains('show') && e.deltaY > 0) {
            wheelAccumulator += Math.abs(e.deltaY);

            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(function () {
                wheelAccumulator = 0;
            }, 150);

            if (wheelAccumulator > threshold * 4) {
                hideIframeOverlay();
                wheelAccumulator = 0;
            }
        } else {
            wheelAccumulator = 0;
        }
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
        resetWheelState();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && iframeOverlay && iframeOverlay.classList.contains('show')) {
            hideIframeOverlay();
            resetWheelState();
        }
    });

    window.addEventListener('beforeunload', function () {
        resetWheelState();
    });
});

document.getElementById('version-text').textContent = VERSION;
document.getElementById('version-info').textContent = VERSION;
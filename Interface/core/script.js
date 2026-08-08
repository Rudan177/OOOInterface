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
        var settings = JSON.parse(localStorage.getItem('oooInterfaceSettings') || '{}');
        if (settings.dynamicBlur === true) {
            document.body.classList.add('dynamic-blur');
        }
        if (settings.dynamicBlur === true && settings.enhancedDisplay === true) {
            document.body.classList.add('enhanced-display');
        }
    } catch (e) { }
})();

var floatBtn = document.querySelector('.float-btn');
var iconLock = document.querySelector('.icon-lock');
var hoverTimer = null;
var isScrolled = false;
var isThemeMode = false;
var isLocked = localStorage.getItem('themeLocked') === 'true';
var currentTheme = localStorage.getItem('currentTheme');

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
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
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
        var currentIsDark = document.body.classList.contains('dark-theme');
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
        var currentIsDark = document.body.classList.contains('dark-theme');
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
        var theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('currentTheme', theme);
    } else {
        localStorage.removeItem('currentTheme');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
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

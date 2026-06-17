var splashOverlay = document.getElementById('splashOverlay');
var splashLogo = document.getElementById('splashLogo');
var splashTitle = document.getElementById('splashTitle');
var splashHint = document.getElementById('splashHint');
var container = document.querySelector('.container');
var heroTagline = document.querySelector('.hero-tagline');
var versionBadge = document.querySelector('.version-badge');
var welcomeCard = document.querySelector('.welcome-card');
var startBtn = document.getElementById('startBtn');
var sections = document.querySelectorAll('.changelog-section');
var currentIndex = 0;
var hasEntered = false;
var isTransitioning = false;

var urlParams = new URLSearchParams(window.location.search);
var isManualOpen = urlParams.get('manual') === 'true';

if (localStorage.getItem('hasVisited') === 'true' && !isManualOpen) {
    window.location.href = '../index.html';
}

function enterMain() {
    if (isTransitioning) return;
    isTransitioning = true;

    document.body.classList.add('ready');
    container.classList.add('show');

    splashLogo.classList.add('exit');
    splashTitle.classList.add('exit');
    splashHint.classList.add('exit');
    splashOverlay.classList.add('exit');

    setTimeout(function () {
        heroTagline.classList.add('show');
        versionBadge.classList.add('show');
        welcomeCard.classList.add('show');
        startBtn.classList.add('show');
    }, 400);

    setTimeout(function () {
        hasEntered = true;
        isTransitioning = false;
    }, 900);
}

function advance() {
    if (isTransitioning) return;

    if (currentIndex + 1 < sections.length) {
        sections[currentIndex].classList.remove('active');
        currentIndex++;
        sections[currentIndex].classList.add('active');
        if (currentIndex + 1 >= sections.length) {
            startBtn.innerHTML = '开始使用';
        }
    } else {
        localStorage.setItem('hasVisited', 'true');
        window.location.href = '../index.html';
    }
}

function handleAction() {
    if (!hasEntered) {
        enterMain();
    } else {
        advance();
    }
}

document.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
        e.preventDefault();
        handleAction();
    }
});

splashOverlay.addEventListener('click', function () {
    handleAction();
});

startBtn.addEventListener('click', function () {
    if (hasEntered) {
        advance();
    }
});

document.getElementById('version').textContent = VERSION;
document.getElementById('welc-footer').textContent = COPYRIGHT;

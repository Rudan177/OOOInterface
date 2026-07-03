// 从 update.js 的 WELC_CONTENT 读取文字内容并渲染到页面
(function () {
    var C = WELC_CONTENT;

    // 渲染闪屏文字
    document.getElementById('splashTitle').textContent = C.splashTitle;
    document.getElementById('splashHint').textContent = C.splashHint;

    // 渲染主页面文字
    document.querySelector('.hero-tagline').textContent = C.heroTagline;
    document.getElementById('cardHeaderText').textContent = C.cardHeader;

    // 渲染更新日志章节
    var changelogContainer = document.querySelector('.changelog');
    changelogContainer.innerHTML = '';
    C.changelog.forEach(function (section, i) {
        var div = document.createElement('div');
        div.className = 'changelog-section' + (i === 0 ? ' active' : '');
        var header = document.createElement('div');
        header.className = 'section-header';
        header.textContent = section.header;
        var ul = document.createElement('ul');
        ul.className = 'section-list';
        section.items.forEach(function (item) {
            var li = document.createElement('li');
            li.textContent = item;
            ul.appendChild(li);
        });
        div.appendChild(header);
        div.appendChild(ul);
        changelogContainer.appendChild(div);
    });

    // 重新获取动态生成的元素
    var sections = document.querySelectorAll('.changelog-section');
    var currentIndex = 0;
    var hasEntered = false;
    var isTransitioning = false;

    // 渲染按钮文字
    document.getElementById('startBtn').textContent = C.nextBtn;

    // 渲染页脚
    document.getElementById('welc-footer').textContent = C.footer;

    // 渲染版本号
    document.getElementById('version').textContent = VERSION;

    // ===== 交互逻辑 =====
    var splashOverlay = document.getElementById('splashOverlay');
    var splashLogo = document.getElementById('splashLogo');
    var splashTitle = document.getElementById('splashTitle');
    var splashHint = document.getElementById('splashHint');
    var container = document.querySelector('.container');
    var heroTagline = document.querySelector('.hero-tagline');
    var versionBadge = document.querySelector('.version-badge');
    var welcomeCard = document.querySelector('.welcome-card');
    var startBtn = document.getElementById('startBtn');

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
                startBtn.textContent = C.finishBtn;
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
})();

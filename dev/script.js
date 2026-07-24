(function () {
    var meta = DOC_DATA.meta;
    var bindMap = {
        pageTitle: 'title',
        pageBrand: '.doc-brand',
        pageTitleMain: '.doc-head h1',
        pageSubtitle: '.doc-head .doc-subtitle',
        docNumber: '[data-bind="docNumber"]',
        version: '[data-bind="version"]',
        date: '[data-bind="date"]',
        status: '[data-bind="status"]',
        footerLeft: '.doc-footer span:nth-child(1)',
        footerRight: '.doc-footer span:nth-child(2)'
    };

    if (!meta.footerRight) {
        meta.footerRight = meta.docNumber + ' ' + meta.version + ' · ' + meta.date;
    }

    Object.keys(bindMap).forEach(function (key) {
        if (meta[key] === undefined) return;
        var el = document.querySelector(bindMap[key]);
        if (el) el.textContent = meta[key];
    });

    document.title = meta.pageTitle || document.title;

    var nav = document.getElementById('tabNav');
    var scrollWrap = document.getElementById('tabSidebarScroll');
    var content = document.getElementById('tabContent');
    var sections = DOC_DATA.sections;

    sections.forEach(function (sec, i) {
        var num = String(i + 1).padStart(2, '0');

        var btn = document.createElement('button');
        btn.className = 'tab-sidebar-btn' + (i === 0 ? ' active' : '');
        btn.setAttribute('data-tab', i);
        btn.innerHTML = '<span class="s-num">' + num + '</span>' + sec.label;
        scrollWrap.appendChild(btn);

        var div = document.createElement('div');
        div.className = 'section' + (i === 0 ? ' active' : '');
        div.id = 'sec-' + i;
        div.innerHTML = '<div class="section-head"><span class="section-num">\u00a7' + (i + 1) + '</span><h2 class="section-title">' + sec.title + '</h2></div><div class="section-body">' + sec.content.join('') + '</div>';
        content.appendChild(div);
    });

    var btns = scrollWrap.querySelectorAll('.tab-sidebar-btn');
    var secs = content.querySelectorAll('.section');
    var body = document.querySelector('.doc-body');
    btns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var idx = this.getAttribute('data-tab');
            // 移动端：自动滚动侧边栏使点击的按钮可见
            if (window.innerWidth <= 700) {
                scrollWrap.scrollLeft = this.offsetLeft - scrollWrap.clientWidth / 2 + this.offsetWidth / 2;
            }
            if (body.classList.contains('merge-mode')) {
                // Temporarily unlock for scrollIntoView
                content.style.overflowY = 'auto';
                document.getElementById('sec-' + idx).scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                btns.forEach(function (b) { b.classList.remove('active'); });
                secs.forEach(function (s) { s.classList.remove('active'); });
                this.classList.add('active');
                document.getElementById('sec-' + idx).classList.add('active');
                initCodeBlocks();
            }
        });
    });

    function initCodeBlocks() {
        var pres = document.querySelectorAll('.section-body pre[data-lang]');
        pres.forEach(function (pre) {
            if (pre.parentElement.classList.contains('code-block')) return;

            var lang = pre.getAttribute('data-lang') || 'CODE';
            var code = pre.querySelector('code');
            var text = code ? code.textContent : pre.textContent;

            var lines = text.split('\n');
            var minIndent = Infinity;
            lines.forEach(function (line) {
                if (line.trim() === '') return;
                var indent = line.match(/^(\s*)/)[1].length;
                if (indent < minIndent) minIndent = indent;
            });
            if (minIndent === Infinity) minIndent = 0;
            if (minIndent > 0) {
                var dedentedLines = lines.map(function (line) {
                    return line.length >= minIndent ? line.substring(minIndent) : line;
                });
                code.textContent = dedentedLines.join('\n');
            }

            var wrapper = document.createElement('div');
            wrapper.className = 'code-block';

            var header = document.createElement('div');
            header.className = 'code-block-header';

            var langSpan = document.createElement('span');
            langSpan.className = 'code-block-lang';
            langSpan.textContent = lang;

            var actions = document.createElement('div');
            actions.className = 'code-block-actions';

            var isDarkPage = document.body.classList.contains('dark-theme') ||
                (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !document.body.classList.contains('light-theme'));

            var themeBtn = document.createElement('button');
            themeBtn.className = 'code-block-btn';
            themeBtn.setAttribute('data-action', 'theme');
            themeBtn.setAttribute('title', '深浅切换');
            themeBtn.innerHTML = isDarkPage
                ? '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
                : '<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
            themeBtn.addEventListener('click', function () {
                var block = this.closest('.code-block');
                if (!block.classList.contains('code-light') && !block.classList.contains('code-dark')) {
                    block.classList.add('code-light');
                    this.innerHTML = '<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
                    this.setAttribute('title', '强制亮色');
                } else if (block.classList.contains('code-light')) {
                    block.classList.remove('code-light');
                    block.classList.add('code-dark');
                    this.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
                    this.setAttribute('title', '强制暗色');
                } else {
                    block.classList.remove('code-dark');
                    var darkPage = document.body.classList.contains('dark-theme') ||
                        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !document.body.classList.contains('light-theme'));
                    this.innerHTML = darkPage
                        ? '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
                        : '<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
                    this.setAttribute('title', '深浅切换');
                }
            });

            var copyBtn = document.createElement('button');
            copyBtn.className = 'code-block-btn';
            copyBtn.setAttribute('data-action', 'copy');
            copyBtn.setAttribute('title', '复制');
            copyBtn.innerHTML = '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
            copyBtn.addEventListener('click', function () {
                var block = this.closest('.code-block');
                var codeEl = block.querySelector('code');
                var textToCopy = codeEl ? codeEl.textContent : '';

                var origHtml = this.innerHTML;
                this.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>';
                this.classList.add('copied');
                var self = this;
                setTimeout(function () {
                    self.innerHTML = origHtml;
                    self.classList.remove('copied');
                }, 2000);

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(textToCopy);
                } else {
                    var ta = document.createElement('textarea');
                    ta.value = textToCopy;
                    ta.style.position = 'fixed';
                    ta.style.opacity = '0';
                    document.body.appendChild(ta);
                    ta.select();
                    document.execCommand('copy');
                    document.body.removeChild(ta);
                }
            });

            actions.appendChild(themeBtn);
            actions.appendChild(copyBtn);

            header.appendChild(langSpan);
            header.appendChild(actions);

            wrapper.appendChild(header);
            pre.parentElement.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);
        });
    }

    initCodeBlocks();

    // --- Merge mode ---
    (function () {
        var toggle = document.getElementById('mergeToggle');
        var observer = null;
        var isMobile = window.innerWidth <= 700;

        function enableMerge() {
            body.classList.add('merge-mode');
            toggle.classList.add('active');
            toggle.innerHTML = '<svg viewBox="0 0 20 20"><line x1="4" y1="6" x2="16" y2="6"/><line x1="4" y1="14" x2="16" y2="14"/><line x1="10" y1="6" x2="10" y2="14"/></svg>';

            content.style.overflowY = 'auto';
            content.scrollIntoView({ behavior: 'smooth', block: 'start' });

            observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var idx = entry.target.id.replace('sec-', '');
                        btns.forEach(function (b) { b.classList.remove('active'); });
                        var btn = document.querySelector('.tab-sidebar-btn[data-tab="' + idx + '"]');
                        if (btn) btn.classList.add('active');
                    }
                });
            }, { threshold: 0, rootMargin: '-80px 0px -55% 0px' });

            secs.forEach(function (s) { observer.observe(s); });
            initCodeBlocks();
        }

        function disableMerge() {
            body.classList.remove('merge-mode');
            toggle.classList.remove('active');
            toggle.innerHTML = '<svg viewBox="0 0 20 20"><line x1="4" y1="6" x2="16" y2="6"/><line x1="4" y1="14" x2="16" y2="14"/></svg>';

            if (observer) {
                observer.disconnect();
                observer = null;
            }

            secs.forEach(function (s) { s.classList.remove('active'); });
            var activeBtn = document.querySelector('.tab-sidebar-btn.active');
            var activeIdx = activeBtn ? activeBtn.getAttribute('data-tab') : 0;
            document.getElementById('sec-' + activeIdx).classList.add('active');
            initCodeBlocks();
        }

        if (isMobile) {
            enableMerge();
        }

        toggle.addEventListener('click', function () {
            if (body.classList.contains('merge-mode')) {
                disableMerge();
            } else {
                enableMerge();
            }
        });
    })();

    // --- 响应式比例插值（300px-960px 之间平滑过渡） ---
    (function () {
        var prevMerge = null;

        function lerp(a, b, t) { return a + (b - a) * t; }

        function updateResponsive() {
            var w = window.innerWidth;
            // 360px→0(手机竖屏), 960px→1(桌面)
            var t = Math.max(0, Math.min(1, (w - 360) / (960 - 360)));
            // smoothstep 让中间过渡更自然
            if (t > 0 && t < 1) t = t * t * (3 - 2 * t);

            var s = document.documentElement.style;

            // —— 页面间距 ——
            s.setProperty('--r-page-pad-x', lerp(12, 32, t) + 'px');
            s.setProperty('--r-page-pad-t', lerp(36, 24, t) + 'px');
            s.setProperty('--r-page-pad-b', lerp(0, 12, t) + 'px');

            // —— 导航 ——
            s.setProperty('--r-nav-mb', lerp(18, 40, t) + 'px');
            s.setProperty('--r-nav-gap', lerp(4, 8, t) + 'px');
            s.setProperty('--r-nav-btn-size', lerp(0.7, 0.82, t) + 'rem');
            s.setProperty('--r-nav-btn-py', lerp(4, 7, t) + 'px');
            s.setProperty('--r-nav-btn-px', lerp(8, 14, t) + 'px');

            // —— 品牌 ——
            s.setProperty('--r-brand-size', lerp(0.55, 0.75, t) + 'rem');
            s.setProperty('--r-brand-ls', lerp(0.5, 2, t) + 'px');

            // —— 标题区 ——
            s.setProperty('--r-head-pb', lerp(10, 22, t) + 'px');
            s.setProperty('--r-head-mb', lerp(14, 28, t) + 'px');
            s.setProperty('--r-h1-size', lerp(1.15, 2, t) + 'rem');
            s.setProperty('--r-h1-ls', lerp(-0.3, -0.5, t) + 'px');
            s.setProperty('--r-sub-size', lerp(0.78, 1, t) + 'rem');

            // —— 元数据 ——
            var metaEl = document.getElementById('docMeta');
            if (metaEl) { metaEl.classList.toggle('meta-2col', w <= 700); }
            s.setProperty('--r-meta-mb', lerp(16, 40, t) + 'px');
            s.setProperty('--r-meta-radius', lerp(8, 10, t) + 'px');
            s.setProperty('--r-meta-item-py', lerp(8, 16, t) + 'px');
            s.setProperty('--r-meta-item-px', lerp(10, 20, t) + 'px');
            s.setProperty('--r-meta-label-size', lerp(0.55, 0.7, t) + 'rem');
            s.setProperty('--r-meta-label-ls', lerp(0.5, 1, t) + 'px');
            s.setProperty('--r-meta-val-size', lerp(0.75, 0.88, t) + 'rem');

            // —— 正文框 ——
            s.setProperty('--r-body-radius', lerp(8, 10, t) + 'px');

            // —— 标签栏按钮 ——
            s.setProperty('--r-btn-size', lerp(0.7, 0.85, t) + 'rem');
            s.setProperty('--r-btn-py', lerp(7, 13, t) + 'px');
            s.setProperty('--r-btn-px', lerp(7, 20, t) + 'px');
            s.setProperty('--r-btn-gap', lerp(3, 10, t) + 'px');

            // —— 内容区 ——
            s.setProperty('--r-tab-pad-x', lerp(12, 36, t) + 'px');
            s.setProperty('--r-tab-pad-t', lerp(6, 10, t) + 'px');
            s.setProperty('--r-tab-pad-b', lerp(32, 20, t) + 'px');

            // —— 章节 ——
            s.setProperty('--r-sec-gap', lerp(6, 12, t) + 'px');
            s.setProperty('--r-sec-head-mb', lerp(12, 22, t) + 'px');
            s.setProperty('--r-sec-head-pb', lerp(8, 14, t) + 'px');
            s.setProperty('--r-sec-num-size', lerp(0.65, 0.72, t) + 'rem');
            s.setProperty('--r-sec-num-py', lerp(2, 3, t) + 'px');
            s.setProperty('--r-sec-num-px', lerp(6, 8, t) + 'px');
            s.setProperty('--r-sec-title', lerp(0.92, 1.2, t) + 'rem');

            // —— 段落 ——
            s.setProperty('--r-body-text', lerp(0.85, 0.92, t) + 'rem');
            s.setProperty('--r-body-ul', lerp(16, 22, t) + 'px');

            // —— 版本卡片 ——
            s.setProperty('--r-card-py', lerp(12, 18, t) + 'px');
            s.setProperty('--r-card-px', lerp(14, 20, t) + 'px');
            s.setProperty('--r-card-my', lerp(12, 16, t) + 'px');
            s.setProperty('--r-card-mb', lerp(14, 18, t) + 'px');
            s.setProperty('--r-ver-title', lerp(0.9, 1, t) + 'rem');
            s.setProperty('--r-ver-num-size', lerp(0.7, 0.78, t) + 'rem');
            s.setProperty('--r-ver-num-minw', lerp(48, 60, t) + 'px');
            s.setProperty('--r-ver-num-py', lerp(2, 3, t) + 'px');
            s.setProperty('--r-ver-num-px', lerp(6, 8, t) + 'px');
            s.setProperty('--r-card-text', lerp(0.85, 0.92, t) + 'rem');

            // —— 目录头 ——
            s.setProperty('--r-tab-header-py', lerp(4, 18, t) + 'px');
            s.setProperty('--r-tab-header-px', lerp(6, 20, t) + 'px');
            s.setProperty('--r-tab-title-size', lerp(0.55, 0.68, t) + 'rem');

            // —— footer ——
            s.setProperty('--r-footer-pt', lerp(8, 12, t) + 'px');
            s.setProperty('--r-footer-pb', lerp(10, 14, t) + 'px');
            s.setProperty('--r-footer-gap', lerp(6, 8, t) + 'px');
            s.setProperty('--r-footer-text', lerp(0.65, 0.75, t) + 'rem');
            s.setProperty('--r-body-ft-gap', lerp(12, 20, t) + 'px');

            // —— merge-toggle ——
            s.setProperty('--r-toggle-size', lerp(20, 28, t) + 'px');

            // 窗口变化时自动切换合并模式
            var nowMobile = w <= 700;
            if (nowMobile !== prevMerge) {
                prevMerge = nowMobile;
                var body = document.querySelector('.doc-body');
                var toggle = document.querySelector('.merge-toggle');
                if (body && toggle) {
                    if (nowMobile && !body.classList.contains('merge-mode')) {
                        body.classList.add('merge-mode');
                        toggle.classList.add('active');
                        toggle.innerHTML = '<svg viewBox="0 0 20 20"><line x1="4" y1="6" x2="16" y2="6"/><line x1="4" y1="14" x2="16" y2="14"/><line x1="10" y1="6" x2="10" y2="14"/></svg>';
                    } else if (!nowMobile && body.classList.contains('merge-mode')) {
                        body.classList.remove('merge-mode');
                        toggle.classList.remove('active');
                        toggle.innerHTML = '<svg viewBox="0 0 20 20"><line x1="4" y1="6" x2="16" y2="6"/><line x1="4" y1="14" x2="16" y2="14"/></svg>';
                    }
                }
            }

        }

        // 首次执行
        updateResponsive();

        // resize 时同步更新 CSS 变量（廉价操作，实时刷新）
        var resizeTimer;
        window.addEventListener('resize', function () {
            updateResponsive();

            // 防抖 body 宽度同步（涉及 layout 读取）
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.__syncBodyFixedWidth) window.__syncBodyFixedWidth();
            }, 16);
        });
    })();

    // --- 自定义虚拟滚动系统（手动控制所有元素变换） ---
    (function () {
        var bodyEl = document.querySelector('.doc-body');
        var metaEl = document.getElementById('docMeta');
        var contentEl = document.getElementById('tabContent');
        var navEl = document.querySelector('.doc-nav');
        var headEl = document.querySelector('.doc-head');
        var h1El = document.querySelector('.doc-head h1');
        var subtitleEl = document.querySelector('.doc-subtitle');
        var footerEl = document.querySelector('.doc-footer');

        // 禁用浏览器原生滚动
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100%';

        // 虚拟滚动参数
        var LERP = 0.12;
        var VELOCITY_DECAY = 0.92;
        var SCROLL_DISTANCE = 440;
        var SCROLLED_NAV_GAP = 24;

        // 状态
        var vScroll = 0;
        var targetVScroll = 0;
        var contentScroll = 0;
        var inputVelocity = 0;
        var isAnimating = false;
        var touchStartY = 0;

        // Body 平滑过渡到 fixed
        var bodyFixed = false;
        var bodyFixedStartTop = 0;
        var bodyFixedStartScroll = 0;

        // h1 固定定位初始位置
        var h1FixLeft = 0;
        var h1FixTop = 0;

        // h1 占位元素
        var h1Spacer = document.createElement('div');
        h1Spacer.style.pointerEvents = 'none';
        h1Spacer.style.flexShrink = '0';
        h1Spacer.style.marginBottom = '6px';
        headEl.insertBefore(h1Spacer, h1El.nextSibling);

        // 内容区域最大可溢出滚动
        function getMaxContentScroll() {
            return Math.max(0, contentEl.scrollHeight - contentEl.clientHeight);
        }
        function getMaxVScroll() {
            return SCROLL_DISTANCE + getMaxContentScroll();
        }

        // 记录 body 初始位置尺寸
        var bodyInitLeft = '0px';
        var bodyInitWidth = '100%';
        function updateBodyRect() {
            var page = document.querySelector('.doc-page');
            var pr = page.getBoundingClientRect();
            var pl = parseInt(getComputedStyle(page).paddingLeft) || 32;
            bodyInitLeft = (pr.left + pl) + 'px';
            bodyInitWidth = (pr.width - pl * 2) + 'px';
        }
        updateBodyRect();
        window.__syncBodyFixedWidth = function () {
            if (!bodyFixed) return;
            var bp = document.querySelector('.doc-page');
            var bpr = bp.getBoundingClientRect();
            var bpad = parseInt(getComputedStyle(bp).paddingLeft) || 32;
            bodyEl.style.left = (bpr.left + bpad) + 'px';
            bodyEl.style.width = (bpr.width - bpad * 2) + 'px';
            render();
        };
        // 记录 h1 初始固定位置，并立即设为 fixed + 占位
        var h1InitRect = h1El.getBoundingClientRect();
        h1FixLeft = h1InitRect.left;
        h1FixTop = h1InitRect.top;
        h1Spacer.style.height = h1El.offsetHeight + 'px';
        h1El.style.position = 'fixed';
        h1El.style.left = h1FixLeft + 'px';
        h1El.style.top = h1FixTop + 'px';
        h1El.style.margin = '0';

        // footer 常驻底部
        var footerFixedInitLeft = '';
        var footerFixedInitWidth = '';
        var pageRect = document.querySelector('.doc-page').getBoundingClientRect();
        footerFixedInitLeft = pageRect.left + 'px';
        footerFixedInitWidth = pageRect.width + 'px';
        footerEl.style.position = 'fixed';
        footerEl.style.bottom = '0';
        footerEl.style.left = footerFixedInitLeft;
        footerEl.style.width = footerFixedInitWidth;
        footerEl.style.zIndex = '20';
        footerEl.style.margin = '0';

        // --- 触控状态（位置跟踪模式） ---
        var touchTracking = false;
        var touchStartScroll = 0;
        var lastTouchY = 0;
        var lastTouchTime = 0;
        var releaseVelocity = 0;

        // --- 输入事件 ---
        function onWheel(e) {
            e.preventDefault();
            inputVelocity += e.deltaY * 0.15;
            startAnim();
        }

        function onTouchStart(e) {
            var target = e.target;
            var mergeBtn = document.getElementById('mergeToggle');
            if ((nav && nav.contains(target)) || (mergeBtn && mergeBtn.contains(target))) {
                touchTracking = false;
                return;
            }
            e.preventDefault();
            touchTracking = true;
            touchStartY = e.touches[0].clientY;
            touchStartScroll = targetVScroll;
            lastTouchY = touchStartY;
            lastTouchTime = Date.now();
            inputVelocity = 0;
            releaseVelocity = 0;
            startAnim();
        }
        function onTouchMove(e) {
            if (!touchTracking) return;
            var curY = e.touches[0].clientY;
            var dy = (touchStartY - curY) * 1.5;
            targetVScroll = touchStartScroll + dy;
            targetVScroll = Math.max(0, Math.min(getMaxVScroll(), targetVScroll));

            var now = Date.now();
            var dt = Math.max(now - lastTouchTime, 1);
            releaseVelocity = (lastTouchY - curY) / dt * 16;
            lastTouchY = curY;
            lastTouchTime = now;

            startAnim();
            e.preventDefault();
        }
        function onTouchEnd() {
            if (!touchTracking) return;
            touchTracking = false;
            inputVelocity = releaseVelocity * 0.8;
            releaseVelocity = 0;
            startAnim();
        }

        function onKeyDown(e) {
            var delta = 0;
            if (e.key === 'ArrowDown' || (e.key === ' ' && e.target === document.body)) { delta = 40; e.preventDefault(); }
            else if (e.key === 'ArrowUp') { delta = -40; e.preventDefault(); }
            else if (e.key === 'PageDown') { delta = 200; e.preventDefault(); }
            else if (e.key === 'PageUp') { delta = -200; e.preventDefault(); }
            else if (e.key === 'Home') { targetVScroll = 0; e.preventDefault(); }
            else if (e.key === 'End') { targetVScroll = getMaxVScroll(); e.preventDefault(); }
            if (delta !== 0) {
                targetVScroll += delta;
                targetVScroll = Math.max(0, Math.min(getMaxVScroll(), targetVScroll));
                startAnim();
            }
        }

        // --- 动画循环 ---
        function startAnim() {
            if (isAnimating) return;
            isAnimating = true;
            requestAnimationFrame(tick);
        }

        function tick() {
            if (touchTracking) {
                vScroll = targetVScroll;
            } else {
                if (Math.abs(inputVelocity) > 0.5) {
                    targetVScroll += inputVelocity;
                    inputVelocity *= VELOCITY_DECAY;
                    targetVScroll = Math.max(0, Math.min(getMaxVScroll(), targetVScroll));
                }
                var diff = targetVScroll - vScroll;
                var currentLERP = diff < 0 ? LERP * 1.8 : LERP;
                if (Math.abs(diff) < 0.5 && Math.abs(inputVelocity) < 0.5) {
                    vScroll = targetVScroll;
                    render();
                    isAnimating = false;
                    return;
                }
                vScroll += diff * currentLERP;
            }
            render();
            requestAnimationFrame(tick);
        }

        // --- 渲染核心 ---
        function render() {
            var p = Math.min(vScroll / SCROLL_DISTANCE, 1);
            var ep = 1 - Math.pow(1 - p, 2);

            // ————— 未滚动 / 回到顶部时 —————
            if (ep < 0.001) {
                navEl.style.marginBottom = '';
                headEl.style.paddingBottom = '';
                headEl.style.marginBottom = '';
                headEl.style.borderBottomColor = '';

                metaEl.style.transform = '';
                metaEl.style.opacity = '';
                metaEl.style.marginBottom = '';
                subtitleEl.style.opacity = '';
                subtitleEl.style.transform = '';
                subtitleEl.style.pointerEvents = '';

                h1El.style.zIndex = '1';
                h1El.style.pointerEvents = 'none';
                h1El.style.left = h1FixLeft + 'px';
                h1El.style.top = h1FixTop + 'px';
                h1El.style.transform = 'scale(1)';

                if (bodyFixed) {
                    var cs = getComputedStyle(document.documentElement);
                    bodyEl.style.left = bodyInitLeft;
                    bodyEl.style.width = bodyInitWidth;
                    var bVh = window.innerHeight;
                    var bNavH = navEl.offsetHeight || 36;
                    var bFooterH = footerEl.offsetHeight || 24;
                    var bTargetTop = 10 + bNavH + SCROLLED_NAV_GAP;
                    var bProg = (vScroll - bodyFixedStartScroll) /
                                (Math.max(SCROLL_DISTANCE - bodyFixedStartScroll, 1));
                    var bSp = Math.min(Math.max(bProg, 0), 1);
                    var bSmoothTop = bodyFixedStartTop + (bTargetTop - bodyFixedStartTop) * bSp;
                    bodyEl.style.top = bSmoothTop + 'px';
                    var bAvailH = bVh - bSmoothTop - bFooterH - (parseFloat(cs.getPropertyValue('--r-body-ft-gap')) || 20);
                    bodyEl.style.height = Math.max(bAvailH, 200) + 'px';
                    bodyEl.style.overflow = 'hidden';
                } else {
                    var cs = getComputedStyle(document.documentElement);
                    var initFtGap = parseFloat(cs.getPropertyValue('--r-body-ft-gap')) || 20;
                    initFtGap = isNaN(initFtGap) ? 20 : initFtGap;
                    var initFooterH = footerEl.offsetHeight || 24;
                    var bodyRect = bodyEl.getBoundingClientRect();
                    var initMaxH = window.innerHeight - bodyRect.top - initFooterH - initFtGap;
                    bodyEl.style.height = Math.max(initMaxH, 200) + 'px';
                    bodyEl.style.overflow = 'hidden';
                    contentEl.style.overflowY = 'hidden';
                    contentEl.scrollTop = 0;
                    contentScroll = 0;
                }
                return;
            }

            // ————— 滚动中 —————
            var rootCS = getComputedStyle(document.documentElement);
            var rNavMb = parseFloat(rootCS.getPropertyValue('--r-nav-mb')) || 40;
            var rHeadPb = parseFloat(rootCS.getPropertyValue('--r-head-pb')) || 22;
            var rHeadMb = parseFloat(rootCS.getPropertyValue('--r-head-mb')) || 28;
            var rMetaMb = parseFloat(rootCS.getPropertyValue('--r-meta-mb')) || 40;

            navEl.style.marginBottom = (rNavMb - (rNavMb - SCROLLED_NAV_GAP) * ep) + 'px';

            headEl.style.paddingBottom = (rHeadPb * (1 - ep)) + 'px';
            headEl.style.marginBottom = (rHeadMb - (rHeadMb - 18) * ep) + 'px';
            headEl.style.borderBottomColor = ep > 0.3 ? 'transparent' : '';


            if (ep > 0.005) {
                h1El.style.pointerEvents = '';
                h1El.style.zIndex = '25';
                var navLink = navEl.querySelector('a');
                var linkRect = navLink.getBoundingClientRect();
                var h1TargetX = linkRect.right + 8;
                var h1TargetY = linkRect.top + 1;
                h1El.style.left = (h1FixLeft + (h1TargetX - h1FixLeft) * ep) + 'px';
                h1El.style.top = (h1FixTop + (h1TargetY - h1FixTop) * ep) + 'px';
                h1El.style.transform = 'scale(' + (1 - 0.4 * ep) + ')';
                h1El.style.transformOrigin = 'left top';
            } else {
                h1El.style.zIndex = '1';
                h1El.style.pointerEvents = 'none';
                h1El.style.left = h1FixLeft + 'px';
                h1El.style.top = h1FixTop + 'px';
                h1El.style.transform = 'scale(1)';
            }

            var subOpacity = Math.max(0, 1 - ep * 4);
            subtitleEl.style.opacity = subOpacity;
            subtitleEl.style.transform = 'translateY(' + (-10 * ep) + 'px)';
            subtitleEl.style.pointerEvents = subOpacity === 0 ? 'none' : '';

            metaEl.style.transform = 'translateY(' + (-60 * ep) + 'px)';
            metaEl.style.opacity = 1 - ep;
            metaEl.style.marginBottom = (rMetaMb * (1 - ep)) + 'px';

            if (vScroll > 20 && !bodyFixed) {
                bodyFixed = true;
                bodyFixedStartTop = bodyEl.getBoundingClientRect().top;
                bodyFixedStartScroll = vScroll;

                bodyEl.style.position = 'fixed';
                bodyEl.style.left = bodyInitLeft;
                bodyEl.style.width = bodyInitWidth;
                bodyEl.style.zIndex = '10';
                bodyEl.style.top = bodyFixedStartTop + 'px';
                contentEl.style.overflowY = 'auto';
            }

            if (bodyFixed) {
                var vh = window.innerHeight;
                var navH = navEl.offsetHeight || 36;
                var footerH = footerEl.offsetHeight || 24;
                var targetTop = 10 + navH + SCROLLED_NAV_GAP;

                var prog = (vScroll - bodyFixedStartScroll) /
                            (Math.max(SCROLL_DISTANCE - bodyFixedStartScroll, 1));
                var sp = Math.min(Math.max(prog, 0), 1);

                var smoothTop = bodyFixedStartTop + (targetTop - bodyFixedStartTop) * sp;
                bodyEl.style.top = smoothTop + 'px';

                var bodyPage = document.querySelector('.doc-page');
                var bodyPageRect = bodyPage.getBoundingClientRect();
                var bodyPad = parseInt(getComputedStyle(bodyPage).paddingLeft) || 32;
                bodyEl.style.left = (bodyPageRect.left + bodyPad) + 'px';
                bodyEl.style.width = (bodyPageRect.width - bodyPad * 2) + 'px';

                var ftGap = parseFloat(rootCS.getPropertyValue('--r-body-ft-gap')) || 20;
                var availH = vh - smoothTop - footerH - ftGap;
                bodyEl.style.height = Math.max(availH, 200) + 'px';
                bodyEl.style.overflow = 'hidden';

                var targetContentScroll = Math.max(0, vScroll - SCROLL_DISTANCE);
                var contentDiff = targetContentScroll - contentScroll;
                contentScroll += contentDiff * 0.12;
                contentEl.scrollTop = contentScroll;
            } else {
                bodyEl.style.height = '';
                contentEl.style.overflowY = 'hidden';
                contentEl.scrollTop = 0;
                contentScroll = 0;
            }
        }

        // --- 事件绑定 ---
        window.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('touchstart', onTouchStart, { passive: false });
        window.addEventListener('touchmove', onTouchMove, { passive: false });
        window.addEventListener('touchend', onTouchEnd, { passive: true });
        window.addEventListener('keydown', onKeyDown);

        // --- 窗口变化 ---
        window.addEventListener('resize', function () {
            var pageRect = document.querySelector('.doc-page').getBoundingClientRect();
            var pagePad = parseInt(getComputedStyle(document.querySelector('.doc-page')).paddingLeft) || 32;

            h1FixLeft = pageRect.left + pagePad;
            h1FixTop = h1Spacer.getBoundingClientRect().top;
            h1Spacer.style.height = h1El.offsetHeight + 'px';

            if (bodyFixed) {
                var navMb = parseInt(getComputedStyle(navEl).marginBottom) || 40;
                var headHeight = headEl.getBoundingClientRect().height;
                var pagePadT = parseInt(getComputedStyle(document.querySelector('.doc-page')).paddingTop) || 24;
                bodyFixedStartTop = pageRect.top + pagePadT + navEl.offsetHeight + navMb + headHeight;
            }

            footerFixedInitLeft = pageRect.left + 'px';
            footerFixedInitWidth = pageRect.width + 'px';
            footerEl.style.left = footerFixedInitLeft;
            footerEl.style.width = footerFixedInitWidth;

            if (bodyFixed) {
                updateBodyRect();
                bodyEl.style.left = bodyInitLeft;
                bodyEl.style.width = bodyInitWidth;
            }

            render();
        });

        // 初始渲染
        render();
    })();
})();

/**
 * 图标字体（Google Fonts）的异步挂载器：用 fetch 取 CSS 文本再注入 <style>，避免字体 CDN 阻塞渲染与 load。
 * 动态插入的 <link rel=stylesheet> 同样会延迟 load，因此只在 fetch 明确失败时退回 <link>；
 * 超时中止说明网络在黑洞，此时不能退回 <link>；字形到位前由 styles.css 留白，CSP 禁止内联，脚本只能放在外部文件。
 */
(function () {
    'use strict';

    // 等多久就认输（毫秒）：超过它就不再留白，空着的图标比字面文字更糟。
    var GIVE_UP_MS = 2000;

    // 每项包含 href 与这份 CSS 有定论后要加的标记类。
    var FONTS = [
        { href: 'https://fonts.googleapis.com/icon?family=Material+Icons', mark: 'icons-ready' },
        { href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0', mark: 'symbols-ready' }
    ];

    function mark(name) { document.documentElement.classList.add(name); }

    // 退路：仅当 fetch 明确失败（CORS / CSP / 404）时走 <link>，那种情况下它还能拿到字体，
    // 代价只是会把 load 拖到自己下完。超时中止（AbortError）不走这条路：网络在黑洞，
    // <link> 会以同样方式挂死，正是要避免的那个场景。
    function attachViaLink(font) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = font.href;
        var settle = function () { mark(font.mark); };
        link.addEventListener('load', settle);
        link.addEventListener('error', settle);
        setTimeout(settle, GIVE_UP_MS);
        document.head.appendChild(link);
    }

    function attach(font) {
        var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
        var timer = setTimeout(function () {
            // 到点就认输：放开可见性，并中止这个挂着的请求（别让它一直占着一个连接）。
            mark(font.mark);
            if (ctrl) { try { ctrl.abort(); } catch (e) { /* 已经结束了 */ } }
        }, GIVE_UP_MS);

        fetch(font.href, ctrl ? { signal: ctrl.signal } : undefined)
            .then(function (res) {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.text();
            })
            .then(function (css) {
                clearTimeout(timer);
                var style = document.createElement('style');
                style.textContent = css;
                document.head.appendChild(style);
                // 样式表已应用，即字体族可用的第一帧。
                mark(font.mark);
            })
            .catch(function (err) {
                var aborted = err && err.name === 'AbortError';
                clearTimeout(timer);
                if (aborted) {
                    // 已经被上面的超时分支处理过（可见性已放开），这里不再插 <link>。
                    return;
                }
                attachViaLink(font);
            });
    }

    FONTS.forEach(attach);
})();

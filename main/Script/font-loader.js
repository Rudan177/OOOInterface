// 图标字体（Google Fonts）的异步挂载器。
//
// 这两条 CSS 原来写死在 index.html 的 <head> 里，是**渲染阻塞资源**：字体 CDN 一慢，
// 整页零绘制（实测把 CDN 每个请求拖 5 秒 → 3 秒内连 DOMContentLoaded 都到不了，
// paint 记录为空）。
//
// 改成异步之后还有个**更隐蔽**的坑，这里必须记下来：动态插入的 <link rel=stylesheet>
// 同样是「延迟 load 的资源」。实测把 fonts.googleapis.com 拦成黑洞（连接既不成功也不
// 失败）后 —— 页面画得出来（FCP 96ms），但 **load 到第 9 秒仍未触发**，63 个资源全悬着，
// 标签页一直转圈；而挂在 load 之后的那些升级（在线壁纸/在线 logo/存量迁移）就全被拖着，
// 要等 afterLoad 那个 5 秒兜底才放行。现象是「页面出来了，但整体就是慢」。
//
// 所以这里**不插 <link>，改成 fetch 取 CSS 文本再注入 <style>**：
//   · <style> 不是外部资源，不参与渲染阻塞；
//   · fetch 也不是「延迟 load 的资源」（那不是文档资源，是脚本发起的请求）；
//   两者都不影响 load 时刻。样式内容与 <link> 完全一致（同一份 CSS 文本）。
// CSP 的 style-src 里有 'unsafe-inline'，<style> 合法；扩展页带 <all_urls> 主机权限，
// 跨源 fetch 不受 CORS 限制。
//
// 字形到位前由 styles.css 里 html:not(.icons-ready) 那两条规则留白（见那里的注释）。
// CSP 是 script-src 'self'，内联脚本与内联事件处理器（onload="..."）都会被挡，
// 所以这件事只能放在一个外部文件里做。
(function () {
    'use strict';

    // 等多久就认输（毫秒）。超过它就别再留白了 —— 空着的图标比字面文字更糟。
    var GIVE_UP_MS = 2000;

    // 每项：href + 这份 CSS 有定论之后要加的标记类
    var FONTS = [
        { href: 'https://fonts.googleapis.com/icon?family=Material+Icons', mark: 'icons-ready' },
        { href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0', mark: 'symbols-ready' }
    ];

    function mark(name) { document.documentElement.classList.add(name); }

    // 退路：老写法。只有在 fetch **明确失败**（CORS/CSP/404）时才走 —— 那种情况下
    // <link> 是能拿到字体的，代价只是它会把 load 拖到自己下完。
    // 注意超时中止（AbortError）**不**走这条路：那说明网络在黑洞，<link> 会以同样方式挂死，
    // 正是要避免的那个场景。
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
            // 到点就认输：放开可见性，并中止这个挂着的请求（别让它一直占着一个连接）
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
                // 样式表已应用 = 字体族可用的第一帧
                mark(font.mark);
            })
            .catch(function (err) {
                var aborted = err && err.name === 'AbortError';
                clearTimeout(timer);
                if (aborted) {
                    // 已经被上面的超时分支处理过（可见性已放开），这里不再插 <link>
                    return;
                }
                attachViaLink(font);
            });
    }

    FONTS.forEach(attach);
})();

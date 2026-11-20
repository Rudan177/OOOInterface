/**
 * 首屏调度工具：决定在线高清图、公告请求与维护任务各自的起跑时刻。
 * 这里只管起跑时机，请求发出后的回填、去重守卫与图层重设都不在此处理。
 */

// ---------- afterLoad ----------
// 给「在线高清版探测」用：Image() 属于文档资源，在 load 之前开始加载会把 window.load 一起拖住。
// 在线版都指向国内访问很慢的 GitHub Pages，实测 3.7MB 的 back.png 要 3.6 秒，
// 而本地版本已在扩展内显示，没有理由让它决定 load 时刻。判据是「load 之后再开始」，
// 不是「首屏之后再开始」——两者实测差 3 秒。
const LOAD_FALLBACK_MS = 5000;

export function afterLoad(fn) {
    if (typeof fn !== 'function') {
        // 无参用法是一个「等到 load 之后」的 await 点（await afterLoad()）。
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
    // 走到这里时 load 早已不是这几张图拖的了，再晚一点不会让观感更差。
    setTimeout(run, LOAD_FALLBACK_MS);
}

// ---------- afterFirstPaint ----------
// 给「不拖 load、但会和首屏抢带宽」的请求用（如公告 JSON 的 fetch）。
// 两次 rAF：第一次回调在第一帧绘制前跑，套两层才保证第一帧已经画完。
// rAF 只在页面可见时才跑，因此有两条退路：
//   1. 调用时页面本就隐藏（后台标签页、会话恢复里被冻结）——没有绘制可保护，直接执行；
//   2. 调用时可见、之后被藏起来——rAF 停了，靠 setTimeout 兜底。
// 兜底值不能太大：走到兜底的那次恰恰是用户正在等的那次，晚了会让人觉得「卡了一下」。
const FALLBACK_MS = 200;

export function afterFirstPaint(fn) {
    if (typeof fn !== 'function') {
        // 无参用法是一个「等到首屏之后」的 await 点（await afterFirstPaint()）。
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

// ---------- afterIdle ----------
// 只在浏览器真的空下来之后才跑，给「一次性、可以等、但一跑就要解码几十 MB 图」的维护任务用：
// 这类任务只是让以后变快，不该和首屏或用户刚打开页面那几秒抢主线程。
// requestIdleCallback 的 timeout 是兜底，页面一直忙或在后台时也保证最终会跑。
export function afterIdle(fn, timeoutMs) {
    if (typeof fn !== 'function') {
        return new Promise((resolve) => afterIdle(resolve, timeoutMs));
    }
    if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(() => fn(), { timeout: timeoutMs || 4000 });
        return;
    }
    setTimeout(fn, 1000);
}

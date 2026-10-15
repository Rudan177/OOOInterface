// 「什么时候才起跑」的调度点。这里只决定**起跑时刻**：
// 请求发出之后，成功回填、去重守卫、重设图层这些逻辑一概不碰。

// ---------------------------------------------------------------------------
// afterLoad —— 给「在线高清版探测」用
//
// 为什么需要它：Image() 是文档资源的一部分。只要它在 load 之前开始加载，
// 就会把 window.load 一起拖到它下完为止。
//
// 而这些「在线版」全都指向国内访问很慢的 GitHub Pages。实测（冷启动，禁缓存）：
//   · 默认壁纸的在线版 images/back.png（3.7MB）下完要 3.6 秒
//   · 在线 logo images/dll.png（2MB）下完要 1.9 秒
// 于是 —— 页面 130ms 就画完了，标签页却要转 3 秒圈。把 GitHub Pages 整个拦掉，
// load 立刻从 3270ms 掉到 504ms；再拦掉 Google 字体，198ms。
//
// 关键：本地那份（images/back.png 3.7MB、images/dll.png 105KB）就在扩展里、
// 已经在显示，在线版纯粹是「有没有高清版」的升级。没有任何理由让它决定 load 时刻。
//
// 判据是「load 之后再开始」，不是「首屏之后再开始」—— 这两件事实测差 3 秒。
const LOAD_FALLBACK_MS = 5000;

export function afterLoad(fn) {
    if (typeof fn !== 'function') {
        // 无参用法是一个「等到 load 之后」的 await 点：await afterLoad();
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
    // 走到这里时 load 早就不是这几张图拖的了，再晚一点不会让观感更差。
    setTimeout(run, LOAD_FALLBACK_MS);
}

// ---------------------------------------------------------------------------
// afterFirstPaint —— 给「不拖 load、但会和首屏抢带宽」的请求用（如公告 json 的 fetch）
//
// 两次 rAF：第一次 rAF 的回调在第一帧绘制前跑，套两层才保证第一帧已经画完。
//
// 但 rAF 只在页面可见时才跑，所以它有两条退路，缺一不可：
//   ① 调用时页面本来就是隐藏的（后台标签页、会话恢复里被冻结的页面）——
//      没有绘制可保护，也就没什么可等的，直接立刻执行；
//   ② 调用时可见、之后被藏起来 —— rAF 停了，靠 setTimeout 兜底。
// 兜底值不能定太宽：会一路走到兜底的那次调用，恰恰是「用户正在等」的那一次，
// 800ms 意味着切回标签页时壁纸/公告还没开始请求，看起来就是「卡了一下」。
const FALLBACK_MS = 200;

export function afterFirstPaint(fn) {
    if (typeof fn !== 'function') {
        // 无参用法是一个「等到首屏之后」的 await 点：await afterFirstPaint();
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

// ---------------------------------------------------------------------------
// afterIdle —— 只在浏览器真的空下来之后才跑。
//
// 给「一次性、可以等、但一跑就要解码几十 MB 图」的维护性任务用：它只是「让以后变快」，
// 不该和首屏、也不该和用户刚打开页面那几秒抢主线程。requestIdleCallback 的 timeout
// 是兜底：页面一直忙（或标签页在后台、根本不产生空闲帧）时也保证最终会跑。
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

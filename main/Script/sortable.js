'use strict';

// 纵向列表的 Pointer Events 拖拽排序实现。
//
// 用途：设置页「快速访问链接 / 小组件」列表共用的拖动排序。
// 设计要点：
//   - 抓起后原条目就地隐藏成一个占位槽（.sortable-source），占位槽保留原有尺寸，
//     所以列表总高度不变，不会像旧的"往列表里插指示线"那样让布局抖动；
//   - 另造一个跟随光标的悬浮克隆体（.sortable-float）提供即时反馈；
//   - 其它条目用 FLIP（Web Animations API）平滑让位；
//   - 光标靠近可视区上/下边缘时自动滚动；
//   - 松手即提交（DOM 顺序 = 最终顺序），取消（Escape / pointercancel）则复位。
//
// 跟手性/性能注意事项（改动前务必阅读）：
//   1. 克隆体是 source.cloneNode(true)，会继承行样式里的 `transition: all`。
//      若不显式禁用，浏览器会用缓动去"追"我们写入的位移 —— 表现为明显滞后。
//      因此 .sortable-float 必须 `transition: none`，且位移走 transform（合成层），
//      不要写 top/left。
//   2. 所有 DOM 读写都收敛到每帧一次的 rAF 回调里：pointermove 只记录坐标，
//      避免高频事件引发的布局抖动。
//   3. 被拖行的矩形只在起拖时缓存一次（拖动期间它们彼此的相对顺序不变），
//      每帧最多一次读取、一次写入。
//
// 本模块不读写 settings、也不维护 data-index —— 持久化交给调用方的 onCommit。

// 整行可拖，但这些交互元素上的按下不视为起拖（避免和删除键等冲突）
const INTERACTIVE_SELECTOR =
    'button, input, textarea, select, a, [contenteditable], [role="button"]';

const DEFAULTS = {
    itemSelector: '',
    handleSelector: '.quick-link-drag-handle',
    threshold: 4,          // 判定为拖动所需的最小位移(px)
    edgeSize: 48,          // 触发自动滚动的边缘带宽(px)
    maxScrollSpeed: 18,    // 自动滚动最大速度(px/帧)
    flipDuration: 180,     // 其它条目让位动画时长(ms)
    settleDuration: 160,   // 松手后克隆体归位动画时长(ms)
    clickSuppressMs: 350,  // 拖动结束后吞掉尾随 click 的时间窗(ms)
    liftScale: 1.02,       // 抓起的放大比例
    onCommit: null,
    onCancel: null,
};

export function attachSortableList(listContainer, options) {
    if (!listContainer) throw new Error('attachSortableList: 缺少 listContainer');
    const opts = Object.assign({}, DEFAULTS, options || {});
    if (!opts.itemSelector) throw new Error('attachSortableList: 缺少 itemSelector');

    const getItems = () => Array.prototype.slice.call(listContainer.querySelectorAll(opts.itemSelector));

    // ---- 拖拽状态（同一时刻至多一个）----
    let phase = 'idle';        // idle | pending | dragging
    let pointerId = null;
    let source = null;         // 被拖条目（DOM 中的占位槽）
    let clone = null;          // 跟随光标的悬浮克隆体
    let startX = 0;
    let startY = 0;
    let pendingX = 0;          // pointermove 记录的最新光标位置
    let pendingY = 0;
    let lastFrameX = 0;        // 上一帧已应用的位置，用于跳过无变化的帧
    let lastFrameY = 0;
    let cloneBaseLeft = 0;     // 克隆体初始位置（原条目矩形），位移在此基础上做 transform
    let cloneBaseTop = 0;
    let lastTarget = -1;       // 上次计算出的目标位，未变化则跳过 DOM 操作
    let originalNextSibling = null; // 起拖时的右邻居，用于取消时复位
    let dragItems = [];        // 起拖时缓存的行（不含 source）；期间彼此相对顺序不变
    let scroller = null;       // 实际滚动的容器
    let viewTop = 0;           // 滚动容器可视区上下沿（起拖时缓存，拖动中不变）
    let viewBottom = 0;
    let rafId = 0;
    let dragSeq = 0;           // 每次起拖自增，用于让旧的收尾动画不干扰新拖动
    let destroyed = false;

    // 找到真正在滚动的祖先（列表短时不溢出，滚动可能落在更外层）
    function findScroller(el) {
        let node = el;
        while (node && node !== document.body && node !== document.documentElement) {
            const style = getComputedStyle(node);
            if (/(auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight + 1) {
                return node;
            }
            node = node.parentElement;
        }
        return el;
    }

    function onPointerDown(e) {
        if (destroyed || phase !== 'idle') return;
        if (e.button !== 0 || e.isPrimary === false) return;

        if (e.pointerType === 'touch') {
            // 触屏：只有手柄能起拖（手柄上有 touch-action:none），其余区域保留列表滚动
            if (!e.target.closest(opts.handleSelector)) return;
        } else if (e.target.closest(INTERACTIVE_SELECTOR)) {
            return;
        }

        const item = e.target.closest(opts.itemSelector);
        if (!item || item.parentNode !== listContainer) return;
        if (getItems().length < 2) return;

        phase = 'pending';
        pointerId = e.pointerId;
        source = item;
        startX = e.clientX;
        startY = e.clientY;
        pendingX = e.clientX;
        pendingY = e.clientY;
        lastTarget = -1;
        originalNextSibling = item.nextSibling;

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerCancel);
        // 此处不 preventDefault：轻点（未越过阈值）仍要正常触发 click → 编辑
    }

    function startDrag() {
        phase = 'dragging';
        dragSeq++;
        try { source.setPointerCapture(pointerId); } catch (_) { /* 合成事件下会抛，忽略 */ }

        const rect = source.getBoundingClientRect();
        cloneBaseLeft = rect.left;
        cloneBaseTop = rect.top;
        // 起始帧尚未应用位移：以起拖点为准，让第一帧就能算出正确位移
        lastFrameX = startX;
        lastFrameY = startY;

        clone = source.cloneNode(true);
        clone.removeAttribute('data-index');
        clone.classList.remove('sortable-source');
        clone.classList.add('sortable-float');
        clone.style.left = rect.left + 'px';
        clone.style.top = rect.top + 'px';
        clone.style.width = rect.width + 'px';
        // 以"抓取点"为缩放原点：抬起放大时该点不动，避免起拖瞬间视觉一跳
        clone.style.transformOrigin = (startX - rect.left) + 'px ' + (startY - rect.top) + 'px';
        document.body.appendChild(clone);

        source.classList.add('sortable-source');
        document.body.classList.add('sortable-active');

        // 缓存：拖动期间被拖行之外的条目集合与彼此相对顺序都不变
        dragItems = getItems().filter(el => el !== source);

        scroller = findScroller(listContainer);
        const vrect = scroller.getBoundingClientRect();
        viewTop = vrect.top;
        viewBottom = vrect.bottom;

        window.addEventListener('keydown', onKeyDown);
    }

    function cloneTransform(x, y) {
        return 'translate3d(' + (x - startX) + 'px,' + (y - startY) + 'px,0) scale(' + opts.liftScale + ')';
    }

    function scheduleFrame() {
        if (!rafId && phase === 'dragging') rafId = requestAnimationFrame(frame);
    }

    // 单帧处理：自动滚动 → 悬浮体跟随 → 目标位重算。
    // 所有 DOM 读写都收敛到这里，pointermove 只负责记坐标。
    // allowScroll=false 时不自动滚动（松手前的同步冲刷用）。
    function processFrame(allowScroll, reschedule) {
        if (phase !== 'dragging' || !source) return;
        if (!source.isConnected || source.parentNode !== listContainer) { cancelDrag(); return; }

        const x = pendingX;
        const y = pendingY;
        const moved = (x !== lastFrameX) || (y !== lastFrameY);

        // 1) 自动滚动：只在边缘带内动 scrollTop；容器矩形已在起拖时缓存
        let scrolled = false;
        if (allowScroll && scroller) {
            const viewH = viewBottom - viewTop;
            const band = Math.min(opts.edgeSize, viewH / 3);
            let dir = 0;
            if (y < viewTop + band) dir = -1;
            else if (y > viewBottom - band) dir = 1;

            if (dir !== 0) {
                const dist = dir < 0 ? y - viewTop : viewBottom - y;
                const ratio = 1 - Math.max(0, dist) / band;
                const speed = Math.max(1, Math.round(ratio * opts.maxScrollSpeed));
                const before = scroller.scrollTop;
                scroller.scrollTop = before + dir * speed;
                scrolled = scroller.scrollTop !== before;
            }
        }

        // 2) 先读后写：先算目标位（读矩形），再写悬浮体位移。
        //    反过来的话"写 transform 后再读矩形"会强制同步布局，逐帧掉性能。
        if (moved || scrolled) applyTarget(y);

        // 3) 悬浮体跟随（transform，合成层，不触发重排）
        if (moved) {
            lastFrameX = x;
            lastFrameY = y;
            if (clone) clone.style.transform = cloneTransform(x, y);
        }

        // 指针停着但仍在滚动时需要继续跑帧，否则等下一次 pointermove 唤醒
        if (reschedule && scrolled) scheduleFrame();
    }

    function frame() {
        rafId = 0;
        processFrame(true, true);
    }

    // 依据光标位置把 source 移到目标槽位，并让被挤开的条目 FLIP 让位
    function applyTarget(y) {
        const items = dragItems;
        if (!items.length) return;

        // 单次读取：一次布局，把 N 个矩形全取出来，之后再统一写入
        const rects = [];
        for (let i = 0; i < items.length; i++) rects.push(items[i].getBoundingClientRect());

        // items 的顺序即它们当前的视觉顺序（拖动期间彼此相对顺序不变），
        // 因此第一个中点位于光标下方者就是正确的插入参考。
        let target = items.length;
        for (let i = 0; i < items.length; i++) {
            if (y < rects[i].top + rects[i].height / 2) { target = i; break; }
        }
        if (target === lastTarget) return;
        lastTarget = target;

        // 单次写入
        if (target < items.length) {
            listContainer.insertBefore(source, items[target]);
        } else {
            // 插到最后一个条目之后、尾部非条目节点（如清空按钮）之前
            listContainer.insertBefore(source, items[items.length - 1].nextSibling);
        }

        // FLIP：用写入前的矩形算位移。WAAPI 不受行上的 CSS transition 影响
        for (let i = 0; i < items.length; i++) {
            const el = items[i];
            const dy = rects[i].top - el.getBoundingClientRect().top;
            if (Math.abs(dy) < 0.5) continue;
            if (el._sortAnim) el._sortAnim.cancel();
            el._sortAnim = el.animate(
                [{ transform: 'translateY(' + dy + 'px)' }, { transform: 'translateY(0)' }],
                { duration: opts.flipDuration, easing: 'cubic-bezier(.2,.7,.2,1)' }
            );
        }
    }

    function onPointerMove(e) {
        if (e.pointerId !== pointerId || !source) return;
        pendingX = e.clientX;
        pendingY = e.clientY;

        if (phase === 'pending') {
            if (Math.hypot(pendingX - startX, pendingY - startY) < opts.threshold) return;
            startDrag();
        }
        if (phase !== 'dragging') return;

        e.preventDefault();
        scheduleFrame();
    }

    function onPointerUp(e) {
        if (e.pointerId !== pointerId) return;
        if (phase === 'dragging') {
            // 拖动途中列表若被重渲染（source 已脱离），不要用失效的 DOM 提交
            if (!source.isConnected || source.parentNode !== listContainer) {
                cancelDrag();
            } else {
                // 同步冲刷最后一帧：快速甩动后立刻松手时，最后一个 pointermove
                // 可能还没等到 rAF，不能丢掉它，否则落点是上一帧的旧位置。
                processFrame(false, false);
                if (phase === 'dragging') commit();
            }
        } else {
            reset();
        }
    }

    function onPointerCancel(e) {
        if (e.pointerId !== pointerId) return;
        if (phase === 'dragging') cancelDrag();
        else reset();
    }

    function onKeyDown(e) {
        if (e.key === 'Escape' && phase === 'dragging') {
            e.preventDefault();
            cancelDrag();
        }
    }

    function detachListeners() {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerCancel);
        window.removeEventListener('keydown', onKeyDown);
        if (source && pointerId !== null) {
            try { source.releasePointerCapture(pointerId); } catch (_) { /* 未捕获时忽略 */ }
        }
    }

    // 松手：保持当前 DOM 顺序，提交，并播放克隆体归位动画
    function commit() {
        const items = getItems();
        const seq = dragSeq;
        const floatEl = clone;
        const srcEl = source;
        const dst = srcEl.getBoundingClientRect();

        armClickGuard();
        detachListeners();
        if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }

        // 立即释放共享状态，允许马上开始下一次拖动
        phase = 'idle';
        pointerId = null;
        clone = null;
        source = null;
        dragItems = [];
        if (srcEl) srcEl.classList.remove('sortable-source');

        if (typeof opts.onCommit === 'function') {
            try { opts.onCommit(items); } catch (err) { console.error('sortable onCommit 失败:', err); }
        }

        const cleanup = () => {
            if (floatEl) floatEl.remove();
            // 若期间已开始新拖动，body 上的 grabbing 光标留给新拖动
            if (seq === dragSeq) document.body.classList.remove('sortable-active');
        };

        if (floatEl) {
            // 从当前实际位移动画到落点，避免与上一帧不一致造成跳变
            const from = getComputedStyle(floatEl).transform;
            const to = 'translate3d(' + (dst.left - cloneBaseLeft) + 'px,' +
                (dst.top - cloneBaseTop) + 'px,0) scale(1)';
            const anim = floatEl.animate(
                [{ transform: from && from !== 'none' ? from : 'translate3d(0,0,0) scale(' + opts.liftScale + ')', opacity: 1 },
                 { transform: to, opacity: 0 }],
                { duration: opts.settleDuration, easing: 'ease-out', fill: 'forwards' }
            );
            anim.onfinish = cleanup;
            setTimeout(cleanup, opts.settleDuration + 120); // 动画被打断时的兜底
        } else {
            cleanup();
        }
    }

    // 取消：把 source 插回原位并清除所有临时状态
    function cancelDrag() {
        const srcEl = source;
        const floatEl = clone;
        if (!srcEl) { reset(); return; }

        if (originalNextSibling && originalNextSibling.parentNode === listContainer) {
            listContainer.insertBefore(srcEl, originalNextSibling);
        } else {
            const items = getItems().filter(el => el !== srcEl);
            if (items.length) listContainer.insertBefore(srcEl, items[items.length - 1].nextSibling);
        }

        detachListeners();
        if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }

        phase = 'idle';
        pointerId = null;
        clone = null;
        source = null;
        dragItems = [];
        srcEl.classList.remove('sortable-source');
        if (floatEl) floatEl.remove();
        document.body.classList.remove('sortable-active');

        if (typeof opts.onCancel === 'function') {
            try { opts.onCancel(); } catch (_) { /* 忽略 */ }
        }
    }

    // 起拖前的清理（轻点/pointercancel 未构成拖动）
    function reset() {
        detachListeners();
        if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
        phase = 'idle';
        pointerId = null;
        clone = null;
        source = null;
        dragItems = [];
    }

    // 拖动结束后的尾随 click 会误触"点击编辑/删除"，在捕获阶段吞掉。
    // 监听器只在拖动结束后的抑制窗口内存在，避免面板反复开关时在 document 上堆积。
    function onClickCapture(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    let clickGuardTimer = 0;

    function armClickGuard() {
        if (!clickGuardTimer) document.addEventListener('click', onClickCapture, true);
        else clearTimeout(clickGuardTimer);
        clickGuardTimer = setTimeout(disarmClickGuard, opts.clickSuppressMs + 50);
    }

    function disarmClickGuard() {
        if (clickGuardTimer) { clearTimeout(clickGuardTimer); clickGuardTimer = 0; }
        document.removeEventListener('click', onClickCapture, true);
    }

    listContainer.addEventListener('pointerdown', onPointerDown);

    return {
        destroy() {
            if (destroyed) return;
            destroyed = true;
            if (phase === 'dragging') cancelDrag();
            else reset();
            listContainer.removeEventListener('pointerdown', onPointerDown);
            disarmClickGuard();
            if (source === null) document.body.classList.remove('sortable-active');
        },
    };
}

// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

import { ProxyManager } from '../proxy.js';
import { afterLoad, afterIdle } from '../first-paint.js';
import {
    detectWallpaperFormat,
    sniffContainer,
    extractLiveVideo,
    extractZipEntry,
    readZipEntries,
    isSupportedWallpaperFile,
    mustPreserveBytes,
    mimeForContainer,
    isHdrEnabled,
    isLiveEnabled,
    FORMAT_RULE_VERSION,
} from '../wallpaper-formats.js';

// 普通图片会被压缩到 1280px/q0.5，10MB 进去也够用；
// HDR 与实况照片要原样保留（重编码会抹掉增益图、10bit 色彩和内嵌视频），
// 体积没法指望压缩兜底，上限放宽到 24MB。
const MAX_IMAGE_FILE_SIZE = 10 * 1024 * 1024;
const MAX_PRESERVE_FILE_SIZE = 24 * 1024 * 1024;

// 存库前把普通图片压到这一档。单张上传此前是**原样存文件字节**：一张 2606x1440 的
// PNG 进去就是 4.72MB base64。而整份 settings 是单一的 chrome.storage.local 键，
// 于是读（6ms/MB）、结构化克隆（2ms/MB）、以及把当前壁纸当背景画出来（19ms/MB）
// 全都随壁纸库体积线性变慢。
// 实测同一张真照片：原样 4.72MB → 2560px/q0.85 是 0.38MB（12×），满屏铺开看不出差别；
// 3 张的库启动 load 从 832ms 掉到 ~350ms 档。
// 系列导入仍走 1280px/q0.5（见 prepareSeriesWallpaper）：那是一次几十张的批量导入，
// 体积优先。两条路用途不同，参数也就不同。
const WALLPAPER_MAX_DIMENSION = 2560;
const WALLPAPER_COMPRESS_QUALITY = 0.85;

// 小于这个体积（data URL 字符数）的壁纸不值得重编码一次 —— 省不下多少，
// 还可能压完反而更大。
const WALLPAPER_SHRINK_MIN_CHARS = 700 * 1024;

// 「存量库已按哪版参数重编码过」的凭据，与 FORMAT_RULE_VERSION 同一个套路：
// 改参数就得 bump，否则老用户的旧数据永不重跑（老库里存的还是原图）。
// 0 = 从没跑过。
const WALLPAPER_COMPRESS_VERSION = 1;

// 用户拒绝过一次就记住（放 localStorage，不塞进那份很大的 settings 里），
// 免得每次启动都问一遍；版本号 bump 后自然会再问。
const SHRINK_DECLINE_KEY = 'oooWallpaperShrinkDeclined';

// Chrome 桌面端能直接塞进 background-image 的容器。
// HEIC/HEIF 不在其中 —— 苹果与华为的 HDR 照片大多就是这个容器，
// 没有 WASM 解码器（manifest CSP 是 script-src 'self'）只能识别不能渲染。
const RENDERABLE_CONTAINERS = ['jpeg', 'png', 'webp', 'gif', 'bmp', 'avif'];

const LIVE_VENDOR_SHORT = {
    apple: 'Apple',
    huawei: '华为',
    android: '安卓',
    generic: '',
};

// 「会动」的容器不能压：canvas 只画得到第一帧，压完动画就没了。
// GIF 一律会动；WebP 看 RIFF 里有没有 ANIM 块（有 VP8X 时它落在偏移 30 附近）；
// AVIF 看 ftyp 的 brand 是不是 avis。
// 系列导入那条路本来就有这个毛病（compressImage 不看这些），单张上传不该跟着丢动画。
function isAnimatedContainer(bytes, container) {
    if (container === 'gif') return true;
    if (container === 'webp') {
        for (let i = 12; i + 4 <= bytes.length && i < 64; i++) {
            if (bytes[i] === 0x41 && bytes[i + 1] === 0x4E && bytes[i + 2] === 0x49 && bytes[i + 3] === 0x4D) return true; // 'ANIM'
        }
        return false;
    }
    if (container === 'avif') {
        return bytes.length > 12 && bytes[8] === 0x61 && bytes[9] === 0x76 && bytes[10] === 0x69 && bytes[11] === 0x73; // 'avis'
    }
    return false;
}

// 方框的 tooltip：写清楚是哪家的实况照片、视频是内嵌还是另存
function describeLiveFormat(live) {
    // generic 是「认不出厂商但结构上确实带一段内嵌视频」，短码留空，
    // 拼出来就是干净的「实况照片」而不是「实况照片实况照片」
    const parts = [(LIVE_VENDOR_SHORT[live.vendor] || '') + '实况照片'];
    if (live.source === 'external') parts.push('视频单独存储');
    else if (live.source === 'embedded') parts.push('视频内嵌于原图');
    else parts.push('仅识别到标记，无法提取视频');
    if (live.mime) parts.push(live.mime);
    return parts.join(' · ');
}

// 上传成功后的通知后缀，如「（HDR10 · 安卓实况照片）」。
// 用方框上的短码而不是 hdr.detail —— detail 自己带全角括号，
// 套进这里的括号会变成「（HDR10（BT.2020 + PQ））」这种双层括号。
// 完整说明在方框的 tooltip 里，通知只报「是什么」。
function describeWallpaperFormat(format) {
    if (!format) return '';
    const tags = [];
    if (format.hdr) tags.push(format.hdr.label);
    if (format.live) tags.push(format.live.label || describeLiveFormat(format.live));
    return tags.length ? `（${tags.join(' · ')}）` : '';
}

// ==================== 方框上的 Material 图标 ====================
//
// 取自 Material Symbols Rounded（Apache-2.0）。CSP 是 script-src 'self'，
// 引不了 CDN；图标字体要多挂一次网络请求、还得处理字形没到时的空白，
// 而这里只要 4 个字形，直接把 path 内联进 DOM 最省事 —— <svg>/<path> 是
// 普通元素不是脚本，不受 CSP 限制。
// viewBox 是 Material Symbols 的 960 网格（不是老 Material Icons 的 24 网格）。
const MD_ICON_VIEWBOX = '0 -960 960 960';
const MD_ICON_PATHS = {
    // 开：hdr_on / motion_photos_on；关：hdr_off / motion_photos_off（带斜杠划掉）
    hdr: {
        on: 'M640-390v-180q0-13 8.5-21.5T670-600h110q24 0 42 18t18 42v40q0 23-10.5 35.5T804-444l20 46q6 14-2 26t-24 12q-8 0-15-4t-10-12l-29-64h-44v50q0 13-8.5 21.5T670-360q-13 0-21.5-8.5T640-390Zm60-110h80v-40h-80v40Zm-520 40v70q0 13-8.5 21.5T150-360q-13 0-21.5-8.5T120-390v-180q0-13 8.5-21.5T150-600q13 0 21.5 8.5T180-570v50h80v-50q0-13 8.5-21.5T290-600q13 0 21.5 8.5T320-570v180q0 13-8.5 21.5T290-360q-13 0-21.5-8.5T260-390v-70h-80Zm340 100H410q-13 0-21.5-8.5T380-390v-180q0-13 8.5-21.5T410-600h110q24 0 42 18t18 42v120q0 24-18 42t-42 18Zm-80-60h80v-120h-80v120Z',
        off: 'M763-85 84-764q-11-11-11.5-27.5T84-820q11-11 28-11t28 11l680 678q12 12 11.5 28T820-86q-12 12-28.5 12.5T763-85Zm-63-355v66l-60-60v-136q0-13 8.5-21.5T670-600h110q24 0 42 18t18 42v40q0 18-10.5 32.5T804-444l20 46q6 14-2 26t-24 12q-8 0-15-4t-10-12l-29-64h-44Zm0-60h80v-40h-80v40Zm-120 6L474-600h46q24 0 42 18t18 42v46Zm-400 34v70q0 13-8.5 21.5T150-360q-13 0-21.5-8.5T120-390v-180q0-13 8.5-21.5T150-600q13 0 21.5 8.5T180-570v50h80v-50q0-13 8.5-21.5T290-600q13 0 21.5 8.5T320-570v180q0 13-8.5 21.5T290-360q-13 0-21.5-8.5T260-390v-70h-80Zm200-64 60 60v44h45l55 56q-5 2-10 3t-10 1H410q-13 0-21.5-8.5T380-390v-134Z',
    },
    live: {
        on: 'M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-32 5-64t15-63q5-16 20.5-21.5T150-626q15 8 21.5 23.5T173-570q-6 22-9.5 44.5T160-480q0 134 93 227t227 93q134 0 227-93t93-227q0-134-93-227t-227-93q-24 0-47.5 3.5T386-786q-17 5-32-1t-22-21q-7-15-.5-30.5T354-859q30-11 62-16t64-5q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80ZM220-680q-25 0-42.5-17.5T160-740q0-25 17.5-42.5T220-800q25 0 42.5 17.5T280-740q0 25-17.5 42.5T220-680Zm260 200Z',
        off: 'm763-84-63-62q-49 32-104.5 49T480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-60 17-115.5T146-700l-63-63q-12-12-12-28.5T83-820q12-12 28.5-12t28.5 12l680 680q12 12 12 28t-12 28q-12 12-28.5 12T763-84Zm-283-76q43 0 83.5-11t78.5-33L204-642q-22 38-33 78.5T160-480q0 133 93.5 226.5T480-160Zm0-640q-33 0-64.5 6.5T354-774q-16 7-32 2t-24-19q-8-14-3.5-30t19.5-23q39-18 80.5-27t85.5-9q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 44-9 85.5T844-314q-7 15-23 19.5t-30-3.5q-14-8-19-24t2-32q13-30 19.5-61.5T800-480q0-133-93.5-226.5T480-800Zm57 263ZM423-423Z',
    },
};

function buildMdIcon(kind, enabled) {
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', MD_ICON_VIEWBOX);
    svg.setAttribute('width', '12');
    svg.setAttribute('height', '12');
    svg.setAttribute('fill', 'currentColor');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', MD_ICON_PATHS[kind][enabled ? 'on' : 'off']);
    svg.appendChild(path);
    return svg;
}

// 纯图标方框的读屏名
const FORMAT_BADGE_LABELS = { hdr: 'HDR 兼容', live: '实况照片播放' };

// 方框本体：一枚纯图标开关按钮，开/关两态都从 enabled 现算。
// 方框上不放文字（省下横向空间给壁纸名），也不放 title —— 悬停弹出的
// 那串说明文字是浏览器系统级提示，按需求一律不要。
// 语义只剩 aria-label（读屏短名）：图标没了文字，读屏就再也读不出它是什么。
function buildFormatBadge(kind, format) {
    const enabled = kind === 'hdr' ? isHdrEnabled(format) : isLiveEnabled(format);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'wallpaper-format-badge ' + kind + (enabled ? '' : ' off');
    btn.dataset.kind = kind;
    btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    btn.setAttribute('aria-label', FORMAT_BADGE_LABELS[kind]);
    btn.appendChild(buildMdIcon(kind, enabled));
    return btn;
}

// 就地翻状态，不重建整个菜单 —— 菜单是同步渲染的，重建会顺带把滚动位置丢掉
function syncFormatBadge(btn, kind, enabled) {
    btn.classList.toggle('off', !enabled);
    btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    const path = btn.querySelector('svg path');
    if (path) path.setAttribute('d', MD_ICON_PATHS[kind][enabled ? 'on' : 'off']);
}

export const WallpaperMixin = {
    async handleWallpaperUpload(file) {
        if (!file) return;

        // 不信 file.type：Chrome 对 .heic / .livp 给不出可靠 MIME，
        // 而这两个恰好是本次要兼容的主力容器。改按扩展名 + 容器魔数判。
        if (!isSupportedWallpaperFile(file)) {
            this.showNotification('请上传图片文件');
            return;
        }

        let bytes;
        try {
            bytes = new Uint8Array(await file.arrayBuffer());
        } catch (e) {
            this.showNotification('文件读取失败');
            return;
        }

        const format = detectWallpaperFormat(bytes);
        if (format.container === 'unknown' && !(file.type || '').startsWith('image/')) {
            this.showNotification('无法识别的图片格式');
            return;
        }

        const limit = mustPreserveBytes(format) ? MAX_PRESERVE_FILE_SIZE : MAX_IMAGE_FILE_SIZE;
        if (file.size > limit) {
            this.showNotification(`文件过大，请选择小于${Math.round(limit / 1024 / 1024)}MB的文件`);
            return;
        }

        const wallpaperName = file.name.replace(/\.[^/.]+$/, '');
        if (this.settings.customWallpapers.some(wp => wp.name === wallpaperName)) {
            this.showNotification(`壁纸"${wallpaperName}"已存在`);
            return;
        }

        // Apple 的 .livp 是「heic 静帧 + mov 视频」的压缩包：
        // 静帧是 HEIC，Chrome 桌面端渲染不了，改从实况视频首帧取静帧。
        let liveVideoData = null;
        let wallpaperData = null;
        if (format.container === 'zip' && format.live) {
            const packed = await this.unpackLivePhoto(bytes, format);
            if (!packed) {
                this.showNotification('实况照片包解析失败');
                return;
            }
            wallpaperData = packed.stillDataUrl;
            liveVideoData = packed.videoData;
            format.container = packed.stillContainer;
            this.stampLiveVideo(format, liveVideoData);
        }

        if (!wallpaperData) {
            try {
                wallpaperData = await this.shrinkWallpaperForStorage(bytes, format);
            } catch (e) {
                this.showNotification('文件读取失败');
                return;
            }
        }

        // `.livp` 解包后判定结果要跟着落地：静帧已换成视频首帧，
        // 视频本体另存成 data URL，包内条目的偏移信息从此没用了。
        if (format.live && !liveVideoData) delete format.live.videoData;

        this.settings.customWallpapers.push({
            name: wallpaperName,
            data: wallpaperData,
            format,
        });

        this.settings.wallpaper = wallpaperData;
        this.settings.persistentWallpaper = true;

        // 先更新自定义壁纸列表（创建 option），再设置选中值，
        // 否则 option 尚不存在，赋值不会生效
        this.updateCustomWallpapersList();

        const wallpaperSelect = document.getElementById('wallpaper-select');
        if (wallpaperSelect) {
            wallpaperSelect.value = wallpaperName;
        }

        // 自定义壁纸上传必然与主题壁纸不一致
        this.checkThemeConsistency('wallpaper', wallpaperData);

        this.applySettings();
        this.saveSettings();
        this.showNotification(`壁纸"${wallpaperName}"上传${describeWallpaperFormat(format)}`);

        // 刷新右侧面板菜单（如果打开）
        const rightPanelUpper = document.getElementById('right-panel-upper');
        if (rightPanelUpper && rightPanelUpper.querySelector('.settings-menu-container')) {
            const selected = document.getElementById('wallpaper-select-selected');
            const hiddenSelect = document.getElementById('wallpaper-select');
            const items = document.getElementById('wallpaper-select-items');
            this.showSettingsMenuInRightPanel(items, selected, hiddenSelect);
        }
    },
    // ==================== 壁纸格式（HDR / 实况照片）====================
    //
    // 判定在 main/Script/wallpaper-formats.js 里做（纯字节解析），
    // 这里只负责把判定结果接进「存储 / 渲染 / 界面」三条链。

    // 存库前的压缩。返回可直接落盘的 data URL。
    // 三种情况原样存：
    //   1. HDR / 实况照片 —— canvas 重编码会把增益图、10bit 色彩和内嵌视频一起抹掉；
    //   2. Chrome 渲染不了的容器（HEIC 等）—— 没得压，只能原样留着（现状行为）；
    //   3. 会动的（GIF / 动态 WebP / 动态 AVIF）—— canvas 只画第一帧，压完动画就没了；
    //   4. 压完反而更大 —— 本来就很小的图不该被重新编码一遍。
    async shrinkWallpaperForStorage(bytes, format) {
        const container = sniffContainer(bytes);
        const mime = mimeForContainer(container);
        const raw = await this.bytesToDataUrl(bytes, mime);
        if (mustPreserveBytes(format)) return raw;
        if (RENDERABLE_CONTAINERS.indexOf(container) < 0) return raw;
        if (isAnimatedContainer(bytes, container)) return raw;
        try {
            const shrunk = await this.compressImageBytes(
                bytes, mime, WALLPAPER_MAX_DIMENSION, WALLPAPER_MAX_DIMENSION,
                WALLPAPER_COMPRESS_QUALITY, true,
            );
            return shrunk.length < raw.length ? shrunk : raw;
        } catch (e) {
            // 解不开就按现状原样存。压缩是省空间的手段，不该变成新的失败点。
            return raw;
        }
    },
    bytesToDataUrl(bytes, mime) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('文件读取失败'));
            reader.readAsDataURL(new Blob([bytes], { type: mime || 'application/octet-stream' }));
        });
    },

    dataUrlToBytes(dataUrl) {
        if (typeof dataUrl !== 'string') return null;
        const comma = dataUrl.indexOf(',');
        if (comma < 0) return null;
        const meta = dataUrl.slice(0, comma);
        try {
            if (meta.indexOf(';base64') >= 0) {
                const bin = atob(dataUrl.slice(comma + 1));
                const out = new Uint8Array(bin.length);
                for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
                return out;
            }
            const text = decodeURIComponent(dataUrl.slice(comma + 1));
            const out = new Uint8Array(text.length);
            for (let i = 0; i < text.length; i++) out[i] = text.charCodeAt(i) & 0xff;
            return out;
        } catch (e) {
            return null;
        }
    },

    // data URL 整段解成字节。回填识别走这里（不再有「只解头部 128KB」那条快路径：
    // base64 每 3 字节编成 4 个字符，切一段出来还要对齐 4 的整数倍，而手机厂商的判据
    // 完全可能落在尾部 —— 省下的那几毫秒不值得拿「判错并永久冻住」去换）。
    dataUrlBytes(dataUrl) {
        if (typeof dataUrl !== 'string') return null;
        const comma = dataUrl.indexOf(',');
        if (comma < 0) return null;
        if (dataUrl.slice(0, comma).indexOf(';base64') < 0) return null;
        try {
            const bin = atob(dataUrl.slice(comma + 1));
            const out = new Uint8Array(bin.length);
            for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
            return out;
        } catch (e) {
            return null;
        }
    },

    // 这张壁纸要不要（重新）识别格式。两类要：从没识别过的；识别过但什么都没认出来、
    // 而且是旧规则判的（缺 v 或 v 落后于当前 FORMAT_RULE_VERSION）。
    // 用户手动关掉方框**不算**「没认出来」：那种条目的 hdr / live 仍在，不会走到这里，
    // 重判也就不会把开关掰回开启。
    wallpaperFormatNeedsDetect(wp) {
        if (!wp || !wp.data) return false;
        const f = wp.format;
        if (!f) return true;
        // 已经认出东西的，尊重现有判定：开关（enabled）是用户意图，不能被重判抹掉
        if (f.hdr || f.live) return false;
        return f.v !== FORMAT_RULE_VERSION;
    },

    // Apple .livp：包内一对 heic + mov。静帧是 HEIC，Chrome 桌面端渲染不了，
    // 而实况视频本身是可解码的 —— 退一步用视频首帧当底图。
    async unpackLivePhoto(bytes, format) {
        const entries = readZipEntries(bytes);
        const movEntry = entries.find(e => /\.(mov|mp4)$/i.test(e.name));
        if (!movEntry) return null;

        let videoBytes;
        try {
            videoBytes = await extractZipEntry(bytes, movEntry);
        } catch (e) {
            return null;
        }

        const stillEntry = entries.find(e => /\.(heic|heif|jpe?g|png|avif|webp)$/i.test(e.name));
        let stillDataUrl = null;
        let stillContainer = 'jpeg';

        if (stillEntry) {
            try {
                const stillBytes = await extractZipEntry(bytes, stillEntry);
                const container = sniffContainer(stillBytes);
                if (RENDERABLE_CONTAINERS.indexOf(container) >= 0) {
                    stillDataUrl = await this.bytesToDataUrl(stillBytes, mimeForContainer(container));
                    stillContainer = container;
                }
            } catch (e) {
                stillDataUrl = null;
            }
        }

        if (!stillDataUrl) {
            try {
                stillDataUrl = await this.captureVideoFirstFrame(videoBytes, format.live.mime);
            } catch (e) {
                return null;
            }
        }

        return {
            stillDataUrl,
            stillContainer,
            videoData: await this.bytesToDataUrl(videoBytes, format.live.mime || 'video/mp4'),
        };
    },

    // `.livp` 解包后判定结果要跟着落地：静帧已换成视频首帧，
    // 视频本体另存成 data URL，包内条目的偏移信息从此没用了。
    stampLiveVideo(format, videoData) {
        if (!format || !format.live) return;
        delete format.live.zipEntry;
        format.live.videoData = videoData;
        format.live.source = 'external';
        format.live.offset = null;
        format.live.length = null;
    },

    // 系列导入的单张处理。普通图沿用 1280px / q0.5 压缩；
    // HDR 与实况照片原样保留 —— canvas 重编码会把增益图、10bit 色彩和内嵌视频全抹掉。
    async prepareSeriesWallpaper(file, name, maxDim, quality) {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const format = detectWallpaperFormat(bytes);

        if (format.container === 'zip' && format.live) {
            const packed = await this.unpackLivePhoto(bytes, format);
            if (!packed) throw new Error('实况照片包解析失败');
            format.container = packed.stillContainer;
            this.stampLiveVideo(format, packed.videoData);
            return { name, data: packed.stillDataUrl, format };
        }

        if (mustPreserveBytes(format)) {
            return {
                name,
                data: await this.bytesToDataUrl(bytes, mimeForContainer(sniffContainer(bytes))),
                format,
            };
        }
        return { name, data: await this.compressImage(file, maxDim, maxDim, quality), format };
    },

    captureVideoFirstFrame(videoBytes, mime) {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(new Blob([videoBytes], { type: mime || 'video/mp4' }));
            const video = document.createElement('video');
            let done = false;

            const finish = (fn, arg) => {
                if (done) return;
                done = true;
                clearTimeout(timer);
                URL.revokeObjectURL(url);
                fn(arg);
            };
            const timer = setTimeout(() => finish(reject, new Error('实况视频解码超时')), 8000);

            video.muted = true;
            video.playsInline = true;
            video.preload = 'auto';
            video.addEventListener('loadeddata', () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth || 1280;
                    canvas.height = video.videoHeight || 720;
                    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                    finish(resolve, canvas.toDataURL('image/jpeg', 0.85));
                } catch (e) {
                    finish(reject, e);
                }
            }, { once: true });
            video.addEventListener('error', () => finish(reject, new Error('实况视频无法解码')), { once: true });
            video.src = url;
        });
    },

    // 右侧面板壁纸条目里、删除按钮左侧的那两个方框（可点击的兼容开关）
    buildWallpaperFormatBadges(wp) {
        const format = wp && wp.format;
        if (!format) return null;

        const wrap = document.createElement('span');
        wrap.className = 'wallpaper-format-badges';

        if (format.hdr) wrap.appendChild(buildFormatBadge('hdr', format));
        if (format.live) wrap.appendChild(buildFormatBadge('live', format));
        if (!wrap.childElementCount) return null;

        // 方框落在条目的点击热区里：不拦住冒泡，点一下开关会顺手把这张壁纸
        // 选中并应用（还会关掉这个菜单）。删除按钮当初也是这么办的。
        wrap.addEventListener('click', (e) => {
            const btn = e.target.closest ? e.target.closest('.wallpaper-format-badge') : null;
            if (!btn) return;
            e.preventDefault();
            e.stopPropagation();
            this.toggleWallpaperFormat(wp, btn.dataset.kind, btn);
        });

        return wrap;
    },

    // 右上角的当前壁纸格式角标（主页面与壁纸模式都看得到）。
    //
    // 它是指示灯不是开关 —— 开关在壁纸列表的方框上，所以这里既不响应点击也不改字节。
    // 显隐全交给 CSS：这里只写每枚图标该在哪个范围出现（data-scope），
    // body.scrolled 的进/出因此不必在每条路径上重算，CSS 自己就跟上了。
    updateWallpaperFormatCorner() {
        const box = document.getElementById('wallpaper-format-corner');
        if (!box) return;
        box.innerHTML = '';

        // 只报「当前正在用的这张」：默认 / 必应 / URL 壁纸都没有 format，自然什么都不显示
        const wp = (this.settings.customWallpapers || []).find(w => w.data === this.settings.wallpaper);
        const format = wp && wp.format;
        if (!format) return;

        const add = (kind, on, onHomepage) => {
            // 总开关关掉 → 不出现；这张壁纸的方框被用户关过（isHdrEnabled / isLiveEnabled）
            // → 也不出现：角标不能声称一件已经关掉的事
            if (!on) return;
            if (kind === 'hdr' ? !isHdrEnabled(format) : !isLiveEnabled(format)) return;

            const chip = document.createElement('span');
            chip.className = 'wallpaper-format-corner-badge ' + kind;
            // home = 主页面与壁纸模式都显示；wallpaper = 只在壁纸模式（body.scrolled）显示
            chip.dataset.scope = onHomepage ? 'home' : 'wallpaper';
            chip.setAttribute('role', 'img');
            chip.setAttribute('aria-label', kind === 'hdr' ? '当前壁纸支持 HDR' : '当前壁纸是实况照片');
            chip.appendChild(buildMdIcon(kind, true));
            box.appendChild(chip);
        };

        add('hdr', this.settings.wallpaperBadgeHdr, this.settings.wallpaperBadgeHdrHomepage);
        add('live', this.settings.wallpaperBadgeLive, this.settings.wallpaperBadgeLiveHomepage);
    },

    // 方框开关。HDR 与实况各一个，都存在自己那张壁纸的 format 里。
    //
    // 关掉 HDR 必须真的做点什么：判定是在导入那一刻现算的（detectWallpaperFormat 每次
    // 对新文件重新跑，认不出「这张图的开关被关过」），光记一个 enabled=false 的话
    // 用户点了方框什么都看不到。所以这里直接把这张壁纸转存成普通 SDR 图 ——
    // 也顺手给了「HDR 图在我这块屏上发灰」一条出路。原件留在 format.hdr.sourceData，
    // 再点一次原样还原，不可逆的事一件都不做。
    async toggleWallpaperFormat(wp, kind, btn) {
        const format = wp && wp.format;
        if (!format || !format[kind] || (kind !== 'hdr' && kind !== 'live')) return;

        const enabled = kind === 'hdr' ? !isHdrEnabled(format) : !isLiveEnabled(format);
        const name = wp.name || '壁纸';

        if (kind === 'hdr') {
            if (btn) btn.disabled = true;
            let changed;
            try {
                changed = enabled ? this.restoreWallpaperHdr(wp) : await this.convertWallpaperToSdr(wp);
            } finally {
                if (btn) btn.disabled = false;
            }
            if (!changed) {
                // 转不了（HEIC 这类 Chrome 自己解不开的容器）就原样不动，开关回滚
                if (btn) syncFormatBadge(btn, 'hdr', isHdrEnabled(format));
                this.showNotification(`"${name}"无法转成 SDR，HDR 兼容保持开启`);
                return;
            }
        }

        format[kind].enabled = enabled;

        if (kind === 'live') {
            if (!enabled) {
                // 只收「当前正在放的这张」；在别人的菜单项上点关闭不该打断正在放的实况
                if (this.settings.wallpaper === wp.data) this.stopLiveWallpaper();
            } else if (this.settings.wallpaper === wp.data) {
                this.playLiveWallpaper(wp);
            }
        }

        if (btn) syncFormatBadge(btn, kind, enabled);
        this.saveSettings();
        // 方框关掉/开回会改变「当前壁纸是不是 HDR / 实况」，右上角角标要跟着
        this.updateWallpaperFormatCorner();

        if (kind === 'live') this.showNotification(`已${enabled ? '开启' : '关闭'}"${name}"的实况播放`);
        else if (enabled) this.showNotification(`已还原"${name}"的 HDR 原图`);
        else this.showNotification(`已将"${name}"转存为普通 SDR 图（原图已保留）`);
    },

    // HDR 关：canvas 重编码成 8bit JPEG。尺寸不缩 —— 这毕竟是张壁纸，
    // 只是不要 HDR，不该顺带降分辨率。
    async convertWallpaperToSdr(wp) {
        const format = wp.format;
        const oldData = wp.data;
        if (!oldData) return false;

        let sdrData;
        try {
            const bytes = this.dataUrlToBytes(oldData);
            if (!bytes) return false;
            sdrData = await this.compressImage(
                new File([bytes], (wp.name || 'wallpaper') + '.jpg', { type: 'image/jpeg' }),
                100000, 100000, 0.92);
        } catch (e) {
            // Chrome 解不开这个容器（HEIC/HEIF），没法转
            return false;
        }
        if (!sdrData || sdrData === oldData) return false;

        // 重编码会把「图片字节后面接着的那段实况视频」一起抹掉，先单独切出来另存，
        // 否则关掉 HDR 会把同一张图上的实况一起弄没
        if (format.live && format.live.source === 'embedded') {
            const videoBytes = extractLiveVideo(this.dataUrlToBytes(oldData), format.live);
            if (videoBytes && videoBytes.length) {
                this.stampLiveVideo(format, await this.bytesToDataUrl(videoBytes, format.live.mime || 'video/mp4'));
            }
        }

        format.hdr.sourceData = oldData;
        format.hdr.sourceContainer = format.container;
        format.container = 'jpeg';
        this.swapWallpaperData(wp, sdrData);
        return true;
    },

    restoreWallpaperHdr(wp) {
        const hdr = wp.format && wp.format.hdr;
        if (!hdr || !hdr.sourceData) return false;
        if (hdr.sourceContainer) wp.format.container = hdr.sourceContainer;
        const original = hdr.sourceData;
        delete hdr.sourceData;
        delete hdr.sourceContainer;
        this.swapWallpaperData(wp, original);
        return true;
    },

    // 换掉一张壁纸的 data 时，settings.wallpaper 里可能正指着同一份字符串，
    // 只改 wp.data 不动它，当前壁纸就成了一条悬空引用。顺带重画一次。
    swapWallpaperData(wp, newData) {
        const previous = wp.data;
        wp.data = newData;
        if (this.settings.wallpaper === previous) {
            this.settings.wallpaper = newData;
            this.applyWallpaper();
        }
    },

    // ==================== 存量库的一次性重编码 ====================
    //
    // 老用户的库里存的还是**原图字节**（一张 2606x1440 的 PNG 就是 4.72MB base64）。
    // 光改上传路径对他们毫无作用 —— 而「加载慢」的正是这批人。用
    // WALLPAPER_COMPRESS_VERSION 当凭据，改参数 bump 一下就重跑。
    //
    // 挂在 afterLoad 之后、一条一条地跑：这条路要解码几十 MB 的图再重编码，
    // 一口气跑完就是几秒的主线程卡死，而它只是「让以后变快」，不该让当下变卡。
    maybeShrinkStoredWallpapers() {
        if ((this.settings.wallpaperCompressVersion || 0) >= WALLPAPER_COMPRESS_VERSION) return;

        let declined = null;
        try { declined = localStorage.getItem(SHRINK_DECLINE_KEY); } catch (e) { /* 隐私模式下读不到就算了 */ }
        if (String(declined) === String(WALLPAPER_COMPRESS_VERSION)) return;

        // 两层推迟：先等 load，再等浏览器真有空。这段要解每张大壁纸的字节去判格式，
        // 是纯维护性开销 —— 实测它值 200ms 左右的主线程长任务，压在启动那段最亏。
        afterLoad(() => afterIdle(async () => {
            const pending = await this.shrinkCandidates();
            if (!pending.length) {
                // 没得压也把版本号记上，免得每次启动都白跑一遍扫描
                this.settings.wallpaperCompressVersion = WALLPAPER_COMPRESS_VERSION;
                this.saveSettings();
                return;
            }
            const chars = pending.reduce((a, wp) => a + wp.data.length, 0);
            this.showShrinkConfirmation(pending.length, chars, () => this.runShrinkStoredWallpapers());
        }, 4000));
    },

    // 会被压的条目：体积够大、而且不是 HDR / 实况照片。
    // HDR / 实况那两张的重编码是不可逆的损失（增益图、10bit 色彩、内嵌视频），
    // 所以既不能压、也不该算进「会省下多少」里，否则用户以为原图没了。
    async shrinkCandidates() {
        const out = [];
        for (const wp of (this.settings.customWallpapers || [])) {
            if (!wp || !wp.data || wp.data.length < WALLPAPER_SHRINK_MIN_CHARS) continue;
            if (mustPreserveBytes(wp.format)) continue;
            // format 可能还没判过（回填只在打开壁纸菜单时才跑）。这里判一次 ——
            // 不判就压，等于把一张还没认出来的 HDR 原图直接重编码了。
            // 解码走异步那条（见 dataUrlBytesAsync）：atob 一张 13MB 的 data URL
            // 实测要 ~150ms 且全堵在主线程上，而这里可能一次要判好几张。
            if (this.wallpaperFormatNeedsDetect(wp)) {
                const bytes = await this.dataUrlBytesAsync(wp.data);
                if (bytes) {
                    try {
                        wp.format = detectWallpaperFormat(bytes);
                    } catch (e) { /* 判不出来就当普通图，下面的 mustPreserveBytes 兜底 */ }
                }
            }
            if (!mustPreserveBytes(wp.format)) out.push(wp);
        }
        return out;
    },

    // data URL → 字节，且**不在主线程上解 base64**。
    // 迁移和格式判定都要这份字节，而 atob(13MB) 再加一趟逐字符搬进 Uint8Array 是两次
    // 全量遍历。fetch 一条 data: URL 会把解码交给浏览器自己的网络栈，主线程只等结果。
    // 拿不到（理论上不会）就退回原来那条同步的路。
    async dataUrlBytesAsync(dataUrl) {
        if (typeof dataUrl !== 'string' || dataUrl.indexOf(';base64,') < 0) return null;
        try {
            const res = await fetch(dataUrl);
            return new Uint8Array(await res.arrayBuffer());
        } catch (e) {
            return this.dataUrlBytes(dataUrl);
        }
    },

    // 不可逆（原图只剩压缩后的版本），所以先问一次。用的是设置页那套
    // .confirm-overlay / .confirm-dialog 的样式，不自造一套。
    showShrinkConfirmation(count, chars, onConfirm) {
        const overlay = document.createElement('div');
        overlay.className = 'confirm-overlay';
        if (this.settings.dynamicBlur) overlay.classList.add('blur-effect');

        const close = () => {
            overlay.classList.remove('show');
            setTimeout(() => {
                if (overlay.parentNode) document.body.removeChild(overlay);
            }, 350);
        };

        // 记在 localStorage 而不是 settings 里：拒绝这件事不值得为它写一次几 MB 的存储。
        // 记上之后就不再每次启动都问了；版本号 bump 会重新问。
        const markDeclined = () => {
            try { localStorage.setItem(SHRINK_DECLINE_KEY, String(WALLPAPER_COMPRESS_VERSION)); } catch (e) { /* 隐私模式读不到就算了 */ }
        };

        overlay.innerHTML = `
            <div class="confirm-dialog" id="shrink-confirm-dialog">
                <div class="confirm-dialog-icon">
                    <span class="material-icons" style="font-size:48px;color:#ffffff;">compress</span>
                </div>
                <div class="confirm-dialog-title">压缩已有壁纸</div>
                <div class="confirm-dialog-message">
                    库里有 ${count} 张壁纸存的是原图（约 ${Math.round(chars / 1048576)}MB）。<br>
                    压到 ${WALLPAPER_MAX_DIMENSION}px 后加载会明显变快。<br>
                    此操作不可逆：原图不会保留。
                </div>
                <div class="confirm-dialog-buttons">
                    <button class="confirm-dialog-btn confirm-dialog-btn-cancel" id="shrink-confirm-cancel">以后再说</button>
                    <button class="confirm-dialog-btn confirm-dialog-btn-confirm" id="shrink-confirm-ok">压缩</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('show'));

        // 点空白处也算「现在不做」，同样要记下来。不记的话这次询问会**在每个新标签页
        // 重来一次**：一个全屏 .confirm-overlay（开了动态模糊时还挂 backdrop-filter）
        // 盖着整页，而它前面的 shrinkCandidates() 还要把每张大壁纸的 base64 解一遍。
        // 用户会看到的现象就是「每开一个新标签页都慢、都糊一下」。
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                markDeclined();
                close();
            }
        });

        document.getElementById('shrink-confirm-cancel').addEventListener('click', () => {
            markDeclined();
            close();
        });

        document.getElementById('shrink-confirm-ok').addEventListener('click', () => {
            close();
            onConfirm();
        });
    },

    async runShrinkStoredWallpapers() {
        if (this._shrinkRunning) return;
        this._shrinkRunning = true;

        const list = this.settings.customWallpapers || [];
        let shrunkCount = 0;
        let savedChars = 0;

        for (const wp of list) {
            if (!wp || !wp.data || wp.data.length < WALLPAPER_SHRINK_MIN_CHARS) continue;
            let after = null;
            try {
                const bytes = await this.dataUrlBytesAsync(wp.data);
                if (bytes && !mustPreserveBytes(wp.format)) {
                    after = await this.shrinkWallpaperForStorage(bytes, wp.format);
                }
            } catch (e) {
                after = null;   // 单张失败不影响其余
            }
            if (after && after.length < wp.data.length) {
                // 活动壁纸存的就是同一条数据（settings.wallpaper 对自定义壁纸直接存
                // 整份 data URL，是 customWallpapers[i].data 的第二份拷贝）。
                // 换了新串就必须跟着换，否则 getWallpaperUrl() 又指回那张大图，
                // 而且 maybePlayLiveWallpaper 的 w.data === settings.wallpaper 也对不上了。
                if (this.settings.wallpaper === wp.data) this.settings.wallpaper = after;
                savedChars += wp.data.length - after.length;
                wp.data = after;
                shrunkCount++;
            }
            // 每张之间让出主线程，而且要真的让出**一段空闲**：setTimeout(0) 只是把任务
            // 排到队列尾部，紧接着又是一条几百毫秒的长任务，中间那一下用户什么也做不了。
            // requestIdleCallback 会把这一张和下一张之间的间隙还给浏览器。
            await new Promise((r) => {
                if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(() => r(), { timeout: 200 });
                else setTimeout(r, 0);
            });
        }

        this._shrinkRunning = false;
        // 先记版本号再落盘：这两件事在同一次 saveSettings 里写完，
        // 中途关掉标签页则什么也没写，下次启动从头再来（幂等，不会压两遍）。
        this.settings.wallpaperCompressVersion = WALLPAPER_COMPRESS_VERSION;
        this.saveSettings();

        if (shrunkCount > 0) {
            this.updateCustomWallpapersList();
            this.applyWallpaper();
            this.showNotification(`已压缩 ${shrunkCount} 张壁纸，省下约 ${Math.round(savedChars / 1048576)}MB`);
        }
    },

    // 打开壁纸菜单时把该重判的条目重判一遍。两类会走到这里：
    //   1）本次改动之前上传的、压根没有 format 字段的老壁纸；
    //   2）识别规则升级（FORMAT_RULE_VERSION 变了）之前判过、而且当时什么都没认出来的 ——
    //      华为 HDR 就是这么漏的：旧规则只认 XMP，那个文件通篇没 XMP，被判成 { hdr: null }，
    //      而「只在缺 format 时才补判」的写法会整个绕过它，于是方框永远不出现。
    // 已经认出 hdr / live 的条目一律不重判，方框上的开关（用户意图）因此不会被覆盖。
    // 刻意做成同步的：菜单渲染是同步的，异步回填要么闪烁要么得处理重入。
    // 落盘则推迟到菜单画完之后（见 scheduleWallpaperFormatSave）——那一步才是真正的大头。
    backfillWallpaperFormats() {
        const pending = (this.settings.customWallpapers || []).filter(wp => this.wallpaperFormatNeedsDetect(wp));
        if (!pending.length) return;

        let changed = false;
        for (const wp of pending) {
            // 整段判，不做「先切 128KB 头部试试」那种省法：厂商的判据可能整段落在尾部
            // （华为动图的视频线索、.livp 的 ZIP 中央目录都在文件末尾），只看头部会得出
            // marker-only 甚至「没有实况」，而结论一旦落盘就带着规则版本号不会再重判 ——
            // 于是一张本来能播的实况照片被永久冻住。
            const bytes = this.dataUrlBytes(wp.data);
            if (!bytes) continue;
            try {
                wp.format = detectWallpaperFormat(bytes);
                changed = true;
            } catch (e) {
                // 单张解析失败不影响其余壁纸
            }
        }
        if (changed) this.scheduleWallpaperFormatSave();
    },

    // 回填跑在菜单渲染的同步路径上，而 saveSettings 每次都会把整份 settings 序列化一遍 ——
    // 壁纸的 data URL 全在里面，库里只有一张 10MB 的图时这一步实测就要 360ms（几十 MB 的库更久）。
    // 判定结果这一帧渲染就要用，落盘不用：推迟到菜单画出来之后再写，点开菜单才不会先卡住。
    // 一屏多张时也只挂一个定时器，只落盘一次。
    scheduleWallpaperFormatSave() {
        if (this._wallpaperFormatSaveTimer) return;
        this._wallpaperFormatSaveTimer = setTimeout(() => {
            this._wallpaperFormatSaveTimer = null;
            try {
                this.saveSettings();
            } catch (e) {
                // 落盘失败就下次开菜单再判一遍，不值得打断用户
            }
        }, 0);
    },

    // Live 图作为壁纸出现时播放一遍内嵌视频，播完淡出、露出下面的静帧。
    // 只在 applyWallpaper 这一个入口调用，避免 scrolled / 重设壁纸时反复重播。
    maybePlayLiveWallpaper() {
        const wp = (this.settings.customWallpapers || []).find(w => w.data === this.settings.wallpaper);
        // 方框上的 LIVE 开关关掉之后，这张图就当普通静帧壁纸，不再播内嵌视频
        const isLive = !!(wp && wp.format && wp.format.live) && isLiveEnabled(wp.format);

        // 「本张已播过」时既不能重播、也不能收。一次上传会连着走两遍 applyWallpaper
        // （applySettings 的 applyWallpaper + 末尾 handlePersistentWallpaperToggle 里又一遍），
        // 若第二遍走 else 分支，视频刚起播就被收掉，表现成「实况图根本不放」。
        // 收的职责只归「当前壁纸不是这张实况图」。
        if (isLive && wp.data === this._livePlayedFor) return;
        if (isLive) this.playLiveWallpaper(wp);
        else this.stopLiveWallpaper();
    },

    async playLiveWallpaper(wp) {
        const video = this.wallpaperLive;
        const live = wp.format.live;
        if (!video || live.source === 'marker-only') return;
        if (!isLiveEnabled(wp.format)) return;

        // 系统开了「减弱动态效果」就不播
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // 换到另一张实况图时先把上一条收干净，否则旧 blob URL 会一直挂着
        if (video.src) this.stopLiveWallpaper();

        this._livePlayedFor = wp.data;

        let videoBytes = null;
        if (live.videoData) {
            videoBytes = this.dataUrlToBytes(live.videoData);
        } else {
            const bytes = this.dataUrlToBytes(wp.data);
            if (bytes) videoBytes = extractLiveVideo(bytes, live);
        }
        if (!videoBytes || !videoBytes.length) return;

        const url = URL.createObjectURL(new Blob([videoBytes], { type: live.mime || 'video/mp4' }));
        const cleanup = () => {
            if (video.src === url) {
                video.classList.remove('active');
                video.removeAttribute('src');
                video.load();
            }
            URL.revokeObjectURL(url);
        };

        video.addEventListener('ended', cleanup, { once: true });
        video.addEventListener('error', cleanup, { once: true });
        video.src = url;
        video.classList.toggle('fill-mode', this.settings.wallpaperFill === true);

        try {
            await video.play();
            video.classList.add('active');
        } catch (e) {
            // 自动播放被拒（或格式解不了）就干脆留在静帧，不弹错
            cleanup();
        }
    },

    stopLiveWallpaper() {
        const video = this.wallpaperLive;
        if (!video) return;
        video.pause();
        video.classList.remove('active');
        if (video.src) {
            URL.revokeObjectURL(video.src);
            video.removeAttribute('src');
            video.load();
        }
        this._livePlayedFor = null;
    },

    showWallpaperImportSelector(btnElement) {
        const existing = document.querySelector('.wallpaper-import-selector');
        const existingOverlay = document.querySelector('.wallpaper-import-selector-overlay');
        if (existing) existing.remove();
        if (existingOverlay) existingOverlay.remove();

        const overlay = document.createElement('div');
        overlay.className = 'wallpaper-import-selector-overlay';

        const selector = document.createElement('div');
        selector.className = 'wallpaper-import-selector';

        const singleOption = document.createElement('button');
        singleOption.className = 'wallpaper-import-selector-option';
        singleOption.innerHTML = `
            <span class="wallpaper-import-selector-option-icon"><span class="material-icons">image</span></span>
            <span class="wallpaper-import-selector-option-title">单张壁纸</span>
        `;

        const divider = document.createElement('div');
        divider.className = 'wallpaper-import-selector-divider';

        const seriesOption = document.createElement('button');
        seriesOption.className = 'wallpaper-import-selector-option';
        seriesOption.innerHTML = `
            <span class="wallpaper-import-selector-option-icon"><span class="material-icons">photo_library</span></span>
            <span class="wallpaper-import-selector-option-title">系列壁纸</span>
        `;

        selector.appendChild(singleOption);
        selector.appendChild(divider);
        selector.appendChild(seriesOption);

        const rect = btnElement.getBoundingClientRect();
        document.body.appendChild(overlay);
        document.body.appendChild(selector);

        selector.style.visibility = 'hidden';
        selector.style.pointerEvents = 'none';
        selector.style.position = 'fixed';

        let leftPos = Math.round(rect.left + rect.width / 2 - 85);
        if (leftPos < 8) leftPos = 8;
        selector.style.left = leftPos + 'px';
        selector.style.top = '0px';

        const ddHeight = selector.offsetHeight;
        const gap = 10;
        let topPos = Math.round(rect.top - ddHeight - gap);
        if (topPos < 8) topPos = rect.bottom + gap;
        selector.style.top = topPos + 'px';

        selector.style.visibility = '';
        selector.style.pointerEvents = '';

        requestAnimationFrame(() => {
            selector.classList.add('show');
        });

        const closeSelector = () => {
            selector.classList.remove('show');
            setTimeout(() => {
                if (overlay.parentNode) overlay.remove();
                if (selector.parentNode) selector.remove();
                document.removeEventListener('click', handleOutsideClick);
                document.removeEventListener('keydown', handleEsc);
            }, 200);
        };

        const handleOutsideClick = (e) => {
            if (!selector.contains(e.target) && !btnElement.contains(e.target)) {
                closeSelector();
            }
        };

        const handleEsc = (e) => {
            if (e.key === 'Escape') closeSelector();
        };

        setTimeout(() => {
            document.addEventListener('click', handleOutsideClick);
            document.addEventListener('keydown', handleEsc);
        }, 0);

        singleOption.addEventListener('click', (e) => {
            e.stopPropagation();
            closeSelector();
            document.getElementById('wallpaper-upload').click();
        });

        seriesOption.addEventListener('click', (e) => {
            e.stopPropagation();
            closeSelector();
            this.handleSeriesFolderImport();
        });
    },
    handleSeriesFolderImport() {
        if (window.showDirectoryPicker) {
            window.showDirectoryPicker({ mode: 'read' }).then(async (dirHandle) => {
                const images = [];
                for await (const entry of dirHandle.values()) {
                    if (entry.kind === 'file') {
                        const file = await entry.getFile();
                        if (isSupportedWallpaperFile(file)) {
                            images.push(file);
                        }
                    }
                }

                if (images.length === 0) {
                    this.showNotification('所选文件夹中没有支持的图片');
                    return;
                }

                this.showSeriesImportPreview(images, dirHandle.name);
            }).catch((err) => {
                if (err.name !== 'AbortError') {
                    this.showNotification('文件夹选择失败');
                }
            });
        } else {
            let folderInput = document.getElementById('wallpaper-folder-upload');
            if (!folderInput) {
                folderInput = document.createElement('input');
                folderInput.id = 'wallpaper-folder-upload';
                folderInput.type = 'file';
                folderInput.accept = 'image/*,.heic,.heif,.avif,.livp,.mov';
                folderInput.multiple = true;
                folderInput.setAttribute('webkitdirectory', '');
                folderInput.style.display = 'none';
                document.body.appendChild(folderInput);
            }

            folderInput.value = '';

            const handleFolderChange = (e) => {
                const files = Array.from(e.target.files).filter(f => isSupportedWallpaperFile(f));
                if (files.length === 0) {
                    this.showNotification('所选文件夹中没有支持的图片');
                    return;
                }
                const folderName = files[0].webkitRelativePath.split('/')[0] || '未命名系列';
                this.showSeriesImportPreview(files, folderName);
                folderInput.removeEventListener('change', handleFolderChange);
            };

            folderInput.addEventListener('change', handleFolderChange);
            folderInput.click();
        }
    },
    showSeriesImportPreview(files, seriesName) {
        const existing = document.querySelector('.series-preview-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.className = 'series-preview-overlay';

        const panel = document.createElement('div');
        panel.className = 'series-preview-panel';

        const selectedFiles = new Set(files);

        const header = document.createElement('div');
        header.className = 'series-preview-header';
        const title = document.createElement('div');
        title.className = 'series-preview-title';
        title.textContent = seriesName;
        const count = document.createElement('div');
        count.className = 'series-preview-count';
        count.textContent = `${files.length} 张图片`;
        header.appendChild(title);
        header.appendChild(count);

        const COLS = 4;
        const BUFFER_ROWS = 2;
        const totalRows = Math.ceil(files.length / COLS);

        const grid = document.createElement('div');
        grid.className = 'series-preview-grid';

        const spacer = document.createElement('div');
        spacer.style.position = 'relative';
        spacer.style.width = '100%';
        grid.appendChild(spacer);

        let rowHeight = 108;
        const renderedMap = new Map();

        const calcRowHeight = () => {
            const w = grid.clientWidth - 48;
            rowHeight = Math.floor((w - (COLS - 1) * 8) / COLS) + 8;
        };

        const renderItem = (idx) => {
            if (idx < 0 || idx >= files.length || renderedMap.has(idx)) return;
            const file = files[idx];
            const row = Math.floor(idx / COLS);
            const col = idx % COLS;

            const item = document.createElement('div');
            item.className = 'series-preview-item' + (selectedFiles.has(file) ? ' selected' : ' unselected');
            item.dataset.idx = idx;

            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.onload = () => URL.revokeObjectURL(img.src);
            item.appendChild(img);

            const check = document.createElement('span');
            check.className = 'material-icons check-icon';
            check.textContent = 'check';
            item.appendChild(check);

            item.addEventListener('click', () => {
                if (selectedFiles.has(file)) {
                    selectedFiles.delete(file);
                    item.classList.remove('selected');
                    item.classList.add('unselected');
                } else {
                    selectedFiles.add(file);
                    item.classList.add('selected');
                    item.classList.remove('unselected');
                }
                updateCount();
            });

            item.style.position = 'absolute';
            item.style.top = (row * rowHeight) + 'px';
            item.style.left = `calc(${col * 25}% + ${col * 2}px)`;
            item.style.width = `calc(25% - 6px)`;
            item.style.height = (rowHeight - 8) + 'px';

            spacer.appendChild(item);
            renderedMap.set(idx, item);
        };

        const removeItem = (idx) => {
            const el = renderedMap.get(idx);
            if (el) {
                el.remove();
                renderedMap.delete(idx);
            }
        };

        const updateVisibleRange = () => {
            calcRowHeight();
            const scrollTop = grid.scrollTop;
            const viewH = grid.clientHeight;
            const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - BUFFER_ROWS);
            const endRow = Math.min(totalRows - 1, Math.ceil((scrollTop + viewH) / rowHeight) + BUFFER_ROWS);

            const startIdx = startRow * COLS;
            const endIdx = Math.min(files.length - 1, endRow * COLS + COLS - 1);

            spacer.style.height = (totalRows * rowHeight) + 'px';

            for (let i = startIdx; i <= endIdx; i++) renderItem(i);

            const toRemove = [];
            renderedMap.forEach((_, idx) => {
                if (idx < startIdx || idx > endIdx) toRemove.push(idx);
            });
            toRemove.forEach(removeItem);
        };

        let scrollTicking = false;
        grid.addEventListener('scroll', () => {
            if (!scrollTicking) {
                requestAnimationFrame(() => {
                    updateVisibleRange();
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        }, { passive: true });

        const updateCount = () => {
            count.textContent = `${selectedFiles.size} / ${files.length} 张`;
            importBtn.disabled = selectedFiles.size === 0;
            toggleAllBtn.textContent = selectedFiles.size === files.length ? '取消全选' : '全选';
        };

        const footer = document.createElement('div');
        footer.className = 'series-preview-footer';

        const selectActions = document.createElement('div');
        selectActions.className = 'series-preview-select-actions';

        const toggleAllBtn = document.createElement('button');
        toggleAllBtn.className = 'series-preview-select-btn';
        toggleAllBtn.textContent = '全选';
        toggleAllBtn.addEventListener('click', () => {
            if (selectedFiles.size === files.length) {
                selectedFiles.clear();
                renderedMap.forEach((el) => {
                    el.classList.remove('selected');
                    el.classList.add('unselected');
                });
            } else {
                files.forEach(f => selectedFiles.add(f));
                renderedMap.forEach((el) => {
                    el.classList.add('selected');
                    el.classList.remove('unselected');
                });
            }
            updateCount();
        });

        selectActions.appendChild(toggleAllBtn);

        const importBtn = document.createElement('button');
        importBtn.className = 'series-preview-import-btn';
        importBtn.textContent = '导入';
        importBtn.addEventListener('click', () => {
            if (selectedFiles.size === 0) return;
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 300);
            this.batchImportWallpapers(Array.from(selectedFiles), seriesName);
        });

        footer.appendChild(selectActions);
        footer.appendChild(importBtn);

        panel.appendChild(header);
        panel.appendChild(grid);
        panel.appendChild(footer);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        requestAnimationFrame(() => {
            overlay.classList.add('show');
            calcRowHeight();
            updateVisibleRange();
        });

        const closePreview = () => {
            overlay.classList.remove('show');
            setTimeout(() => {
                if (overlay.parentNode) overlay.remove();
                document.removeEventListener('keydown', handleEsc);
            }, 300);
        };

        const handleEsc = (e) => {
            if (e.key === 'Escape') closePreview();
        };

        document.addEventListener('keydown', handleEsc);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closePreview();
        });

        updateCount();
    },
    batchImportWallpapers(files, seriesName) {
        const MAX_DIMENSION = 1280;
        const COMPRESS_QUALITY = 0.5;
        const BATCH_SIZE = 10;
        const MAX_WALLPAPERS = 50;
        const validFiles = files.filter(f => isSupportedWallpaperFile(f));

        if (validFiles.length === 0) {
            this.showNotification('没有符合要求的图片');
            return;
        }

        let totalImported = 0;
        let totalSkipped = 0;
        const allSeriesWallpapers = [];
        let storageFull = false;

        const processBatch = (batchStart) => {
            if (storageFull || batchStart >= validFiles.length) {
                this.finishSeriesImport(seriesName, allSeriesWallpapers, totalImported, totalSkipped, storageFull);
                return;
            }

            const batchEnd = Math.min(batchStart + BATCH_SIZE, validFiles.length);
            const batch = validFiles.slice(batchStart, batchEnd);
            let batchProcessed = 0;

            this.showNotification(`正在导入 ${batchStart + 1}-${batchEnd}/${validFiles.length}...`);

            const onBatchDone = () => {
                batchProcessed++;
                if (batchProcessed < batch.length) return;

                try { this.saveSettings(); } catch (e) { }

                setTimeout(() => processBatch(batchEnd), 0);
            };

            batch.forEach((file) => {
                const wallpaperName = seriesName + '/' + file.name.replace(/\.[^/.]+$/, '');

                if (this.settings.customWallpapers.some(wp => wp.name === wallpaperName)) {
                    totalSkipped++;
                    onBatchDone();
                    return;
                }

                if (this.settings.customWallpapers.length >= MAX_WALLPAPERS) {
                    storageFull = true;
                    onBatchDone();
                    return;
                }

                this.prepareSeriesWallpaper(file, wallpaperName, MAX_DIMENSION, COMPRESS_QUALITY)
                    .then((entry) => {
                        if (storageFull) { onBatchDone(); return; }

                        this.settings.customWallpapers.push(entry);
                        allSeriesWallpapers.push(entry);
                        totalImported++;

                        onBatchDone();
                    }).catch(() => {
                        totalSkipped++;
                        onBatchDone();
                    });
            });
        };

        processBatch(0);
    },
    finishSeriesImport(seriesName, seriesWallpapers, imported, skipped, storageFull) {
        if (imported > 0) {
            this.settings.wallpaperSeries.push({
                name: seriesName,
                wallpapers: seriesWallpapers.map(w => w.name)
            });

            this.settings.wallpaper = seriesWallpapers[0].data;
            this.settings.persistentWallpaper = true;

            // 系列壁纸导入即应用，解除主题对壁纸方面的接管
            this.checkThemeConsistency('wallpaper', this.settings.wallpaper);

            try {
                this.saveSettings();
            } catch (e) {
                console.error('保存设置失败:', e);
            }

            try {
                this.updateCustomWallpapersList();
                this.applySettings();
                const rightPanelUpper = document.getElementById('right-panel-upper');
                if (rightPanelUpper && rightPanelUpper.querySelector('.settings-menu-container')) {
                    const selected = document.getElementById('wallpaper-select-selected');
                    const hiddenSelect = document.getElementById('wallpaper-select');
                    const items = document.getElementById('wallpaper-select-items');
                    this.showSettingsMenuInRightPanel(items, selected, hiddenSelect);
                }
            } catch (e) {
                console.error('更新界面失败:', e);
            }
        }

        let msg = '';
        if (imported === 0) {
            msg = storageFull ? '已达50张上限，无法导入更多壁纸' : '所有图片均已存在或不符合要求';
        } else {
            msg = `系列"${seriesName}": ${imported}张壁纸已导入`;
            if (skipped > 0) msg += `，${skipped}张已跳过`;
            if (storageFull) msg += '（已达50张上限）';
        }
        this.showNotification(msg);
    },
    changeWallpaper(wallpaper) {
        if (wallpaper === 'default') {
            this.settings.wallpaper = 'default';
        } else if (wallpaper === 'bing') {
            this.settings.wallpaper = 'bing';
            this.settings.wallpaperUrl = '';  // 清空旧URL，避免异步获取前显示主题壁纸残留
            this.fetchBingWallpaper();
        } else if (wallpaper === 'url') {
            if (!this.settings.wallpaperUrl) {
                this.settings.wallpaper = 'url';
            }
        } else {
            // 处理自定义上传的壁纸
            const customWallpaper = this.settings.customWallpapers.find(wp => wp.name === wallpaper);
            if (customWallpaper) {
                this.settings.wallpaper = customWallpaper.data;
                this.settings.persistentWallpaper = true;
            }
        }

        // 一致性检测：主题壁纸用 location 标识，此处用实际生效的壁纸值对比
        const theme = this.themes[this.settings.theme];
        const expectedWp = theme?.details?.wallpaper?.location;
        let actualWp = wallpaper;
        if (wallpaper === 'url' && expectedWp && this.settings.wallpaperUrl === expectedWp) {
            actualWp = expectedWp;
        }
        this.checkThemeConsistency('wallpaper', actualWp);

        this.saveSettings();
        this.applyWallpaper();
    },
    checkAndFetchBingWallpaper() {
        // 如果开关打开，每次刷新都更新壁纸
        if (this.settings.bingRefreshEveryTime) {
            this.fetchBingWallpaper();
            return;
        }

        // 如果开关关闭且刷新间隔为0，不自动刷新
        if (this.settings.bingRefreshInterval === 0) {
            // 如果已有壁纸URL，直接使用
            if (this.settings.wallpaperUrl) {
                this.applySettings();
            } else {
                // 如果没有壁纸URL，获取一次
                this.fetchBingWallpaper();
            }
            return;
        }

        // 如果设置了刷新间隔，检查是否需要刷新
        const lastRefreshTime = localStorage.getItem('bingLastRefreshTime');
        const now = Date.now();
        const intervalMs = this.settings.bingRefreshInterval * 60 * 60 * 1000; // 小时转毫秒

        if (!lastRefreshTime || (now - parseInt(lastRefreshTime)) >= intervalMs) {
            // 需要刷新：只有在获取成功后才记录刷新时间，
            // 否则失败也会被记为已刷新，导致间隔内不再重试
            this.fetchBingWallpaper().then(success => {
                if (success) {
                    localStorage.setItem('bingLastRefreshTime', Date.now().toString());
                }
            });
        } else {
            // 不需要刷新，使用现有壁纸
            if (this.settings.wallpaperUrl) {
                this.applySettings();
            } else {
                // 如果没有壁纸URL，获取一次
                this.fetchBingWallpaper();
            }
        }
    },
    async fetchBingWallpaper() {
        var randomIdx = Math.floor(Math.random() * 8);
        var self = this;
        var lastError = null;

        // 多级接口回退：官方 www → 官方 cn（国内直连，返回数据一致）→ biturl 镜像（CORS 开放）。
        // 官方接口不发送 CORS 头，仅扩展页（host_permissions 覆盖 bing.com）可读；
        // biturl 的 CORS 头为 *，即使未来迁移到普通网页上下文也可跨域读取。
        var endpoints = [
            { label: null, url: 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=' + randomIdx + '&n=1&mkt=zh-CN' },
            { label: 'cn', url: 'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=' + randomIdx + '&n=1&mkt=zh-CN' },
            { label: '镜像', url: 'https://bing.biturl.top/?resolution=1920&format=json&index=' + randomIdx + '&mkt=zh-CN' }
        ];

        function notify(msg) {
            var modal = document.getElementById('settings-modal');
            if (modal && modal.classList.contains('show')) {
                self.showNotification(msg);
            }
        }

        function tryApply(data) {
            var imageUrl = null;
            if (data && data.images && data.images.length > 0 && data.images[0].url) {
                // 官方接口返回相对路径（/th?id=...），拼接到 www.bing.com
                imageUrl = 'https://www.bing.com' + data.images[0].url;
            } else if (data && data.url) {
                // biturl 镜像返回绝对地址
                imageUrl = data.url;
            }
            if (imageUrl) {
                self.settings.wallpaperUrl = imageUrl;
                self.applySettings();
                self.saveSettings();
                notify('必应壁纸已应用');
                return true;
            }
            return false;
        }

        async function tryFetch(fetchFn, label, apiUrl) {
            try {
                notify('正在获取壁纸' + (label ? ' (' + label + ')' : ''));
                var response = await fetchFn(apiUrl);
                if (!response.ok) throw new Error('HTTP ' + response.status);
                var data = await response.json();
                if (tryApply(data)) return { ok: true };
                throw new Error('返回数据为空');
            } catch (err) {
                console.warn('[BingWallpaper] ' + (label || '直连') + '失败:', err.message);
                lastError = err;
                return { ok: false };
            }
        }

        try {
            var result = { ok: false };
            for (var i = 0; i < endpoints.length; i++) {
                result = await tryFetch(function (url) { return fetch(url); }, endpoints[i].label, endpoints[i].url);
                if (result.ok) break;
            }

            if (!result.ok && ProxyManager.isProxyEnabled()) {
                for (var j = 0; j < endpoints.length; j++) {
                    result = await tryFetch(function (url) { return ProxyManager.proxiedFetch(url); }, '代理' + (endpoints[j].label ? '·' + endpoints[j].label : ''), endpoints[j].url);
                    if (result.ok) break;
                }
            }

            if (!result.ok) {
                if (lastError && (lastError.message.indexOf('Failed to fetch') !== -1 || lastError.message.indexOf('NetworkError') !== -1 || lastError.message.indexOf('cors') !== -1)) {
                    if (ProxyManager.isProxyEnabled()) {
                        notify('直连和代理均失败，请确认代理服务正常运行（端口:' + ProxyManager.getProxyPort() + '）');
                    } else {
                        notify('网络请求被拦截');
                    }
                } else {
                    notify('获取必应壁纸失败：' + (lastError ? lastError.message : '未知错误'));
                }
                return false;
            }
            return true;
        } catch (error) {
            console.error('获取必应壁纸失败:', error);
            notify('获取必应壁纸异常：' + error.message);
            return false;
        }
    },
    showBingTooltip() {
        let overlay = document.getElementById('bing-tooltip-overlay');
        let tooltip = document.getElementById('bing-tooltip');

        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'bing-tooltip-overlay';
            overlay.className = 'bing-tooltip-overlay';
            document.body.appendChild(overlay);
        }

        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'bing-tooltip';
            tooltip.className = 'bing-tooltip';
            tooltip.textContent = '来源于Microsoft Bing，每次刷新都将切换壁纸';
            document.body.appendChild(tooltip);
        }

        setTimeout(() => {
            overlay.classList.add('show');
            tooltip.classList.add('show');
        }, 10);

        const closeTooltip = () => {
            overlay.classList.remove('show');
            tooltip.classList.remove('show');
            setTimeout(() => {
                overlay.removeEventListener('click', closeTooltip);
                document.removeEventListener('keydown', handleEsc);
            }, 300);
        };

        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                closeTooltip();
            }
        };

        overlay.addEventListener('click', closeTooltip);
        document.addEventListener('keydown', handleEsc);
    },
    deleteCustomWallpaper(index) {
        const wallpaperName = this.settings.customWallpapers[index].name;
        const wallpaperData = this.settings.customWallpapers[index].data;

        // 从设置中移除
        this.settings.customWallpapers.splice(index, 1);

        // 如果当前使用的是被删除的壁纸，则切换回默认壁纸
        if (this.settings.wallpaper === wallpaperData) {
            this.settings.wallpaper = 'default';
            this.applyWallpaper();
        }

        // 更新自定义壁纸列表显示
        this.updateCustomWallpapersList();
        this.saveSettings();
        this.showNotification('壁纸：删除');
    },
    updateCustomWallpapersList() {
        const wallpaperSelectItems = document.getElementById('wallpaper-select-items');
        const wallpaperSelect = document.getElementById('wallpaper-select');
        const wallpaperSelectSelected = document.getElementById('wallpaper-select-selected');

        if (!wallpaperSelectItems || !wallpaperSelect) return;

        // 移除已有的自定义壁纸选项（支持多种标识符）
        const existingCustomItems = wallpaperSelectItems.querySelectorAll('.select-item-custom-wallpaper, .select-item[data-custom="true"]');
        existingCustomItems.forEach(item => item.remove());

        const existingCustomOptions = wallpaperSelect.querySelectorAll('option.custom-wallpaper-option, option[data-custom="true"]');
        existingCustomOptions.forEach(option => option.remove());

        // 添加自定义壁纸选项
        this.settings.customWallpapers.forEach(wp => {
            // 添加到下拉菜单
            const selectItem = document.createElement('div');
            selectItem.className = 'select-item select-item-custom-wallpaper';
            selectItem.setAttribute('data-value', wp.name);
            selectItem.textContent = wp.name;
            wallpaperSelectItems.appendChild(selectItem);

            // 添加到隐藏的select
            const option = document.createElement('option');
            option.value = wp.name;
            option.textContent = wp.name;
            option.className = 'custom-wallpaper-option';
            wallpaperSelect.appendChild(option);
        });

        // 更新显示的文本
        if (wallpaperSelectSelected) {
            const themeInfo = this.getThemeDisplayInfo();
            if (!themeInfo || !themeInfo.wallpaperName) {
                // settings.wallpaper 可能存的是 data URL，需先映射回壁纸名称再查找 option
                const currentWp = this.settings.customWallpapers.find(wp => wp.data === this.settings.wallpaper);
                const lookupValue = currentWp ? currentWp.name : this.settings.wallpaper;
                const selectedOption = wallpaperSelect.querySelector(`option[value="${CSS.escape(lookupValue)}"]`);
                if (selectedOption) {
                    wallpaperSelectSelected.textContent = selectedOption.textContent;
                }
            }
        }
    },
    preloadWallpaper() {
        const wallpaperUrl = this.getWallpaperUrl();

        if (wallpaperUrl) {
            // 尽早开始探测在线版，用户滚动进壁纸模式时可直接用在线版
            this.probeOnlineWallpaper(wallpaperUrl);

            // 这里原先还有一次「预加载」：`const img = new Image(); img.src = wallpaperUrl`。
            // 但紧接着的 setWallpaperOnLayers() 会把**同一个 URL**贴到两层上，浏览器本来
            // 就会发起同一个请求 —— 那次 new Image() 是纯粹的重复：实测本地 back.png 在
            // 瀑布上出现 2~3 次，其中一次就是它。去掉后请求仍由下面的背景图发出，
            // URL 完全一致，行为不变。
            // 顺带：<img> 是文档资源，非 data: 的壁纸（自定义 URL / Bing）在 load 之前
            // 起跑会把 window.load 一直拖到它下完，去掉后 load 不再被壁纸拖住。
            // data: URL 那几 MB 的解码代价、以及在线高清版推迟到 load 之后，
            // 都见 probeOnlineWallpaper 里的注释。

            // 在两层的 blur 层和 main 层上设置背景图
            this.setWallpaperOnLayers(wallpaperUrl);
            // body上不设背景图（避免CSS类冲突和黑边）
            document.body.style.backgroundImage = 'none';

            // 如果没有开启壁纸常显，并且不在壁纸模式，立即隐藏层
            if (!this.settings.persistentWallpaper && !this.isScrolled) {
                setTimeout(() => {
                    this.clearWallpaperLayers();
                    document.body.style.backgroundImage = '';
                }, 0);
            }
        }
    },
    showWallpaper() {
        // 如果启用了壁纸常显功能且已经显示壁纸，则直接返回
        if (this.settings.persistentWallpaper && this.isScrolled && document.body.classList.contains('user-scrolled')) {
            if (this.settings.dynamicBlur) {
                document.body.classList.add('dynamic-blur');
            } else {
                document.body.classList.remove('dynamic-blur');
            }
            return;
        }

        this.isScrolled = true;

        // 进入壁纸模式后铭牌不可交互，立即收起 OCP 播控，避免残留悬空
        this.hideOcpPlayer();

        // 先添加退出动画类（确保从当前状态开始动画）
        document.body.classList.add('exit-animation');

        // 使用requestAnimationFrame确保浏览器已渲染初始状态
        requestAnimationFrame(() => {
            // 下一帧再修改其他class，触发CSS transition
            document.body.classList.add('scrolled');
            document.body.classList.remove('homepage-wallpaper');

            if (!this.settings.persistentWallpaper) {
                document.body.classList.add('user-scrolled');
            }

            // 壁纸模式下常显示侧边栏与小组件面板（清除 hiding 残留状态）
            // isScrolled 已在进入壁纸模式时置为 true，固定侧边栏按"壁纸模式固定"生效
            this.syncWidgetPanelsForWallpaper(true);

            // 动画完成后移除退出动画类（350ms + 缓冲）
            setTimeout(() => {
                document.body.classList.remove('exit-animation');
            }, 400);
        });

        if (this.settings.dynamicBlur) {
            document.body.classList.add('dynamic-blur');
            this.startAdvancedVisualEffects();
        } else {
            document.body.classList.remove('dynamic-blur');
        }

        // 同步应用壁纸（使用模糊填充层，无黑边）
        const url = this.getWallpaperUrl();
        if (url) {
            this.setWallpaperOnLayers(url);
            // 冷启动未走 applyWallpaper 时补一次在线版探测
            this.probeOnlineWallpaper(url);
        }
        document.body.style.backgroundImage = 'none';

        document.body.style.transition = 'none';

        // 壁纸缩放动画：根据填充模式选择不同动画方式
        if (this.settings.persistentWallpaper && this.settings.wallpaperScale && this.wallpaperMain) {
            this.wallpaperMain.style.transition = 'none';
            // 两种模式统一使用 transform scale 做缩放动画
            // 填满模式：background-size: cover；适配模式：background-size: contain（CSS控制）
            this.wallpaperMain.style.backgroundSize = '';
            this.wallpaperMain.style.backgroundPosition = '';
            // 不在此处设置 transform，保持当前状态作为动画起点
        } else if (this.wallpaperMain) {
            this.wallpaperMain.style.backgroundSize = '';
            this.wallpaperMain.style.backgroundPosition = '';
            this.wallpaperMain.style.transform = '';
            this.wallpaperMain.style.transition = '';
        }

        const engineButtons = document.querySelector('.engine-buttons');
        if (engineButtons) {
            engineButtons.style.marginTop = '';
        }

        const searchHistoryContainer = document.getElementById('search-history-container');
        if (searchHistoryContainer) {
            searchHistoryContainer.classList.remove('show');
        }

        const quickAccessLinks = document.getElementById('quick-access-links');
        if (quickAccessLinks) {
            quickAccessLinks.style.transform = '';
            quickAccessLinks.style.opacity = '';
            quickAccessLinks.style.pointerEvents = '';
        }

        // 壁纸缩放动画：仅在常显示模式下对主层进行连贯放大和偏移
        // 两种模式统一使用 transform scale 实现缩放，background-size 由 CSS fill-mode 类控制
        if (this.settings.persistentWallpaper && this.settings.wallpaperScale && this.wallpaperMain) {
            void this.wallpaperMain.offsetHeight;
            this.wallpaperMain.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            this.applyWallpaperTransform();
        }

        this.isAnimating = true;
        this._animationTimeout = setTimeout(() => {
            this.isAnimating = false;
            this._animationTimeout = null;
        }, 450);
    },
    applyHomepageWallpaper() {
        if (this.settings.persistentWallpaper) {
            document.body.classList.add('homepage-wallpaper');
        } else {
            document.body.classList.remove('homepage-wallpaper');
        }
    },
    restoreHomepage(immediate = false) {
        // 不停止高级视觉效果，让它在后台继续运行，下次进入更流畅

        if (this.settings.dynamicBlur) {
            document.body.classList.add('dynamic-blur');
        } else {
            document.body.classList.remove('dynamic-blur');
        }

        this.isScrolled = false;

        if (!immediate) {
            document.body.classList.add('enter-animation');
        }

        document.body.classList.remove('scrolled');

        // 退出壁纸模式：恢复侧边栏与小组件面板由 hover 控制
        this.syncWidgetPanelsForWallpaper(false);
        document.body.classList.remove('user-scrolled');

        if (this.settings.persistentWallpaper) {
            document.body.classList.add('homepage-wallpaper');
        }

        // 同步移除壁纸（使用层系统，模糊层始终覆盖无黑边）
        if (this.settings.persistentWallpaper) {
            // 壁纸常显模式下保持壁纸，但处理缩放动画
            if (this.settings.wallpaperScale && this.wallpaperMain) {
                void this.wallpaperMain.offsetHeight;
                // 两种模式统一使用 transform scale 回缩
                this.wallpaperMain.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                this.applyWallpaperTransform();
                setTimeout(() => {
                    if (this.wallpaperMain) {
                        // 动画结束后若没有侧边栏推入，清除空变换
                        if (!this._sidebarPushing) {
                            this.wallpaperMain.style.transform = '';
                        }
                        this.wallpaperMain.style.transition = '';
                    }
                }, 400);
            }
        } else {
            this.clearWallpaperLayers();
            document.body.style.backgroundImage = '';
        }

        const searchHistoryContainer = document.getElementById('search-history-container');
        if (searchHistoryContainer) {
            searchHistoryContainer.classList.remove('show');
        }

        if (!immediate) {
            requestAnimationFrame(() => {
                document.body.classList.add('enter-active');
                setTimeout(() => {
                    document.body.classList.remove('enter-animation');
                    document.body.classList.remove('enter-active');
                }, 400);
            });
        }

        if (immediate) {
            this.isAnimating = false;
            if (this._animationTimeout) {
                clearTimeout(this._animationTimeout);
                this._animationTimeout = null;
            }
        } else {
            this.isAnimating = true;
            this._animationTimeout = setTimeout(() => {
                this.isAnimating = false;
                this._animationTimeout = null;
            }, 450);
        }
    },
    createWallpaperLayers() {
        // 层是全新创建的空元素，_appliedWallpaperUrl 必须一起清掉，
        // 否则后面贴同一张图时会走「URL 没变」的短路，图根本贴不上去。
        this._appliedWallpaperUrl = null;

        // 创建模糊填充层
        this.wallpaperBlur = document.createElement('div');
        this.wallpaperBlur.id = 'wallpaper-blur';
        document.body.insertBefore(this.wallpaperBlur, document.body.firstChild);

        // 创建清晰主层
        this.wallpaperMain = document.createElement('div');
        this.wallpaperMain.id = 'wallpaper-main';
        document.body.insertBefore(this.wallpaperMain, document.body.firstChild);

        // Live 图专用层：静帧之上再叠一层视频，播放期间盖住静帧，播完淡出。
        // 插在模糊层之后 —— 它和 #wallpaper-main 同为 z-index:-1，
        // 同层级下由 DOM 顺序决定谁盖谁，必须排在 main 后面才能压住静帧。
        this.wallpaperLive = document.createElement('video');
        this.wallpaperLive.id = 'wallpaper-live';
        this.wallpaperLive.muted = true;
        this.wallpaperLive.playsInline = true;
        this.wallpaperLive.setAttribute('playsinline', '');
        this.wallpaperLive.preload = 'metadata';
        document.body.insertBefore(this.wallpaperLive, this.wallpaperBlur.nextSibling);

        // 标记body，CSS层面覆盖自带的背景图
        document.body.classList.add('wallpaper-layers-ready');

        // 如果没有启用壁纸，隐藏两层
        if (!this.settings.persistentWallpaper && !this.isScrolled) {
            this.wallpaperBlur.classList.remove('active');
            this.wallpaperMain.classList.remove('active');
        }
    },
    getWallpaperUrl() {
        let url = null;
        if (this.settings.wallpaper === 'default') {
            url = this.localBackgroundUrl;
        } else if (this.settings.wallpaper === 'bing' && this.settings.wallpaperUrl) {
            url = this.settings.wallpaperUrl;
        } else if (this.settings.wallpaper === 'url' && this.settings.wallpaperUrl) {
            url = this.settings.wallpaperUrl;
        } else if (this.settings.wallpaper && this.settings.wallpaper !== 'default' && this.settings.wallpaper !== 'bing' && this.settings.wallpaper !== 'url') {
            url = this.settings.wallpaper; // 自定义上传壁纸 data URL
        }
        if (!url) return null;
        // 已探测成功的在线版直接返回，避免每次重设壁纸都先退回本地再异步升级
        return this.onlineWallpaperMap[url] || url;
    },
    // 默认壁纸与主题壁纸都是同一张图的「本地路径 + 在线路径」两份（在线为高清版）：
    // 给出某个本地 URL 对应的在线 URL，非此类壁纸返回 null。
    getOnlineWallpaperUrl(localUrl) {
        if (!localUrl) return null;
        if (this.settings.wallpaper === 'default' && localUrl === this.localBackgroundUrl) {
            return this.onlineBackgroundUrl;
        }
        if (this.settings.themeEnabled && this.settings.wallpaperUrl === localUrl) {
            return this.themeOverrides?.wallpaper?.online || null;
        }
        return null;
    },
    // 探测本地壁纸的在线版并记住结果。所有重设壁纸的路径都调它
    // （此前 applyWallpaper/applyTheme 各写一份内联探测，而 showWallpaper/preloadWallpaper
    //  只 set 本地、没有探测，于是「动一下」就永久回落到本地）。
    probeOnlineWallpaper(localUrl) {
        const onlineUrl = this.getOnlineWallpaperUrl(localUrl);
        if (!onlineUrl || onlineUrl === localUrl) return;
        if (this.onlineWallpaperMap[localUrl] === onlineUrl || this._onlineWallpaperProbes[localUrl]) return;

        this._onlineWallpaperProbes[localUrl] = true;
        // 在线高清版探测是「锦上添花」：本地图已经在显示（images/back.png 就在扩展里）。
        // 起跑推到 **load 之后** —— 这个 new Image() 若在 load 之前开始加载，会把
        // window.load 一起拖到它下完（线上这张 3.7MB，实测 3.6 秒，是整页 load 的头号大户）。
        // 占位标记（上面那行）仍然同步打上 —— 它在这段窗口里就是去重键，
        // 晚打会让同一次加载里的多次调用各起一个探测。
        // onload 里的「仅在仍指向同一张在线版且壁纸应显示时才升级」守卫一律不动。
        afterLoad(() => {
            const testImg = new Image();
            testImg.onload = () => {
                delete this._onlineWallpaperProbes[localUrl];
                this.onlineWallpaperMap[localUrl] = onlineUrl;
                // 探测期间壁纸可能已被切走或关闭：仅在仍指向同一张在线版且壁纸应显示时升级
                if (this.getOnlineWallpaperUrl(localUrl) === onlineUrl
                    && (this.settings.persistentWallpaper
                        || this.isScrolled
                        || document.body.classList.contains('scrolled'))) {
                    this.setWallpaperOnLayers(onlineUrl);
                }
            };
            testImg.onerror = () => {
                delete this._onlineWallpaperProbes[localUrl];
            };
            testImg.src = onlineUrl;
        });
    },
    setWallpaperOnLayers(url) {
        if (!url) {
            this.clearWallpaperLayers();
            return;
        }

        // 同一个 URL 不重贴。给层赋 backgroundImage 会让浏览器重新解码 + 光栅化这张图，
        // 实测单次 44~59ms（4032×3024 的壁纸）。启动路径上 preloadWallpaper、壁纸常显开关、
        // applySettings 会把同一张图先后贴 4 遍 —— 实测 setWallpaperOnLayers ×4 = 193ms，
        // 正是首屏画出来之后那三段长任务的主体。URL 没变时只补类名，不碰 backgroundImage。
        // 副作用只剩状态栏文字明暗，见下面那个 active 翻转判据。
        if (this._appliedWallpaperUrl === url) {
            // 状态栏文字的明暗只由 wallpaperMain 的 active 类决定，其余输入都没变。
            // 所以只有 active 真的翻转时才重算 —— updateStatusBarTextContrast() 每次
            // 要把壁纸画进一张全屏 canvas 采样亮度，实测 ~10ms，不能白跑。
            const wasActive = !!(this.wallpaperMain && this.wallpaperMain.classList.contains('active'));
            if (this.wallpaperBlur) {
                this.wallpaperBlur.classList.add('active');
            }
            if (this.wallpaperMain) {
                this.wallpaperMain.classList.add('active');
                this.wallpaperMain.classList.toggle('fill-mode', this.settings.wallpaperFill === true);
            }
            if (!wasActive) {
                this.updateStatusBarTextContrast();
            }
            return;
        }

        if (this.wallpaperBlur) {
            this.wallpaperBlur.style.backgroundImage = `url('${url}')`;
            // 填充模式下模糊层由CSS控制隐藏，适配模式下显示
            this.wallpaperBlur.classList.add('active');
        }
        if (this.wallpaperMain) {
            this.wallpaperMain.style.backgroundImage = `url('${url}')`;
            this.wallpaperMain.classList.add('active');
            // 根据 wallpaperFill 设置填充/适配模式
            this.wallpaperMain.classList.toggle('fill-mode', this.settings.wallpaperFill === true);
        }

        this._appliedWallpaperUrl = url;
        this.updateStatusBarTextContrast();
    },
    clearWallpaperLayers() {
        this._appliedWallpaperUrl = null;
        if (this.wallpaperBlur) {
            this.wallpaperBlur.style.backgroundImage = '';
            this.wallpaperBlur.classList.remove('active');
        }
        if (this.wallpaperMain) {
            this.wallpaperMain.style.backgroundImage = '';
            this.wallpaperMain.classList.remove('active');
            this.wallpaperMain.classList.remove('fill-mode');
            this.wallpaperMain.style.backgroundSize = '';
            this.wallpaperMain.style.backgroundPosition = '';
            this.wallpaperMain.style.transform = '';
            this.wallpaperMain.style.transition = '';
        }
        // 实况视频也要一起收掉，否则它会盖在下一张壁纸上
        this.stopLiveWallpaper();

        this.wallpaperAnalysisImage = null;
        this.wallpaperAnalysisUrl = null;
        this.wallpaperAnalysisPromise = null;
        this.updateStatusBarTextContrast();
    },
    applyWallpaperTransform() {
        const wm = this.wallpaperMain;
        if (!wm || !this.settings.wallpaperScale) return;

        let transform = '';

        // 基础缩放：壁纸模式 scale(1.4)，主页模式不缩放
        if (this.isScrolled) {
            transform = 'scale(1.4)';
        }

        // 侧边栏推入：叠加偏移和额外缩放（仅在主页模式需要补偿）
        if (this._sidebarPushing) {
            if (transform) {
                // 壁纸模式：已有 scale(1.4) 覆盖边缘，只需偏移
                transform += ' translateX(-80px)';
            } else {
                // 主页模式：根据屏幕宽度动态计算缩放和偏移，确保不露黑边
                const vw = window.innerWidth;
                // 大屏固定偏移80px，窄屏按比例缩小偏移
                const pushPx = Math.min(80, vw * 0.1);
                // CSS transform 从右到左执行: scale(S) translateX(T) → 先平移再缩放
                // 缩放原点在中心: 右边缘最终位置 = vw/2 + (vw/2 + T) * S
                // 要求 >= vw → S >= vw / (vw + 2T), T = -pushPx
                const neededScale = vw / (vw - 2 * pushPx);
                // 取整到小数点后3位，加 10% 余量确保无黑边
                const scale = Math.min(Math.max(Math.round(neededScale * 1.10 * 1000) / 1000, 1.16), 1.6);
                transform = 'scale(' + scale + ') translateX(-' + pushPx + 'px)';
            }
        }

        wm.style.transform = transform;
        this.updateStatusBarTextContrast();
    },
    applyDefaultWallpaper() {
        // 使用层系统，body上不设背景图；本地优先，异步升级到在线
        const url = this.getWallpaperUrl();
        this.setWallpaperOnLayers(url);
        document.body.style.backgroundImage = 'none';
        this.probeOnlineWallpaper(url);
    },
    applyWallpaper() {
        // 壁纸视觉状态的唯一总入口：切壁纸、应用设置、壁纸常显示开关、重置、启动都走这里，
        // 右上角角标挂在开头最省心（那时 settings.wallpaper 已是新值）
        this.updateWallpaperFormatCorner();
        if (this.settings.persistentWallpaper || document.body.classList.contains('scrolled')) {
            const url = this.getWallpaperUrl();
            if (url) {
                this.setWallpaperOnLayers(url);
                // body上不设背景图，避免与CSS类冲突和黑边
                document.body.style.backgroundImage = 'none';

                // 本地优先、在线升级：探测结果会被记住，后续重设壁纸直接给在线版
                this.probeOnlineWallpaper(url);

                // 实况照片：壁纸就位后播一遍内嵌视频（非实况则顺手收掉上一个）
                this.maybePlayLiveWallpaper();
            }
        } else {
            this.clearWallpaperLayers();
            document.body.style.backgroundImage = '';
        }
    },
    handlePersistentWallpaperToggle() {
        if (this.settings.persistentWallpaper) {
            this.applyWallpaper();
            if (!this.isScrolled) {
                document.body.classList.add('homepage-wallpaper');
            }
        } else {
            document.body.classList.remove('homepage-wallpaper');
            if (!this.isScrolled) {
                this.clearWallpaperLayers();
                document.body.style.backgroundImage = '';
            }
        }
    },
};

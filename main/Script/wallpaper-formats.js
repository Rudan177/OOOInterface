'use strict';

// 壁纸格式识别：HDR（HDR10 / HDR10+ / HDR Vivid / Dolby Vision / HLG / Ultra HDR）
// 与 Live 图（Apple 实况照片 / 华为动态照片 / 安卓系动态照片）。
//
// 为什么不用现成的开源库：
//   本插件是纯前端 MV3 扩展，manifest.json 的 CSP 是 `script-src 'self'`，
//   既加载不了 CDN 脚本，也跑不了 WebAssembly（那需要额外开放 'wasm-unsafe-eval'）。
//   libheif / heic2any / exifreader 这类库要么是 WASM，要么依赖打包流程，
//   而本项目是没有构建步骤的裸 ES module 目录 —— 所以这里自己走容器格式。
//
// 本模块只吃字节、只吐描述：不碰 DOM、不碰 chrome.*，可以单独喂 fixture 测。
// 唯一的外部 API 是 ZIP 解压用的 DecompressionStream（Chrome 103+ 原生，非 WASM）。

// ============================ 字节小工具 ============================

function readU16(b, p) {
    return (b[p] << 8) | b[p + 1];
}

function readU32(b, p) {
    return ((b[p] << 24) | (b[p + 1] << 16) | (b[p + 2] << 8) | b[p + 3]) >>> 0;
}

function readU64(b, p) {
    // 只用得到文件内偏移，超过 2^53 的交给浮点即可，不做 BigInt
    return readU32(b, p) * 4294967296 + readU32(b, p + 4);
}

// 大端、长度可变的整数（ISO-BMFF 的 iloc 用 4/8 字节长度字段）
function readVarInt(b, p, size) {
    let v = 0;
    for (let i = 0; i < size; i++) v = v * 256 + b[p + i];
    return v;
}

// ZIP 是**小端**的（JPEG/ISO-BMFF 都是大端），别混用
function readLE16(b, p) {
    return b[p] | (b[p + 1] << 8);
}

function readLE32(b, p) {
    return (b[p] | (b[p + 1] << 8) | (b[p + 2] << 16) | (b[p + 3] << 24)) >>> 0;
}

function ascii(b, p, len) {
    let s = '';
    const end = Math.min(p + len, b.length);
    for (let i = p; i < end; i++) s += String.fromCharCode(b[i]);
    return s;
}

function readCString(b, p, end) {
    let s = '';
    while (p < end && b[p] !== 0) {
        s += String.fromCharCode(b[p]);
        p++;
    }
    return s;
}

// 在 [from, to) 里找 ASCII 串。比逐段解析更能容忍各家厂商的自定义写法。
function indexOfAscii(b, needle, from, to) {
    const start = from || 0;
    const end = Math.min(to === undefined ? b.length : to, b.length);
    const n = needle.length;
    const first = needle.charCodeAt(0);
    for (let i = start; i <= end - n; i++) {
        if (b[i] !== first) continue;
        let ok = true;
        for (let j = 1; j < n; j++) {
            if (b[i + j] !== needle.charCodeAt(j)) { ok = false; break; }
        }
        if (ok) return i;
    }
    return -1;
}

function hasAscii(b, needle, from, to) {
    return indexOfAscii(b, needle, from, to) !== -1;
}

// 取 XMP / XML 里的 `name="value"` 属性，命名空间前缀原样保留（写成正则要转义冒号，不如纯扫）
const ATTR_CACHE = Object.create(null);

function attr(text, name) {
    let re = ATTR_CACHE[name];
    if (!re) {
        // 前缀里的 ':' 与 '-' 在正则里不需要转义，直接拼更省事
        re = ATTR_CACHE[name] = new RegExp(name + '\\s*=\\s*"([^"]*)"');
    }
    const m = text.match(re);
    return m ? m[1] : null;
}

function attrNumber(text, name) {
    const v = attr(text, name);
    if (v === null) return null;
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : null;
}

// ============================ 容器嗅探 ============================

const HEIF_BRANDS = ['heic', 'heix', 'hevc', 'hevx', 'heim', 'heis', 'hevm', 'hevs', 'mif1', 'msf1'];
const AVIF_BRANDS = ['avif', 'avis'];

export function sniffContainer(bytes) {
    if (!bytes || bytes.length < 12) return 'unknown';

    if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) return 'jpeg';
    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) return 'png';
    // Apple 实况照片包 .livp 就是 ZIP（本地/中央目录头都以 PK 开头）
    if (bytes[0] === 0x50 && bytes[1] === 0x4B &&
        (bytes[2] === 0x03 || bytes[2] === 0x05 || bytes[2] === 0x07)) return 'zip';
    if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) return 'gif';
    if (bytes[0] === 0x42 && bytes[1] === 0x4D) return 'bmp';
    // WebP: RIFF....WEBP
    if (ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 4) === 'WEBP') return 'webp';
    // JPEG XL 裸码流
    if (bytes[0] === 0xFF && bytes[1] === 0x0A) return 'jxl';

    if (ascii(bytes, 4, 4) === 'ftyp') {
        const brands = readFtypBrands(bytes);
        if (brands.some(b => AVIF_BRANDS.includes(b))) return 'avif';
        if (brands.some(b => HEIF_BRANDS.includes(b))) return 'heif';
        if (brands.includes('jxl ')) return 'jxl';
        return 'isobmff';
    }
    return 'unknown';
}

function readFtypBrands(bytes) {
    const size = readU32(bytes, 0);
    const end = Math.min(size || bytes.length, bytes.length);
    const brands = [ascii(bytes, 8, 4)];
    for (let p = 16; p + 4 <= end; p += 4) brands.push(ascii(bytes, p, 4));
    return brands.filter(Boolean);
}

// ============================ 通用兜底扫描 ============================
//
// 各家的 XMP 写法差异很大（尤其华为），只按已知字段判定会漏掉真实文件。
// 这里补两条与厂商无关的结构性判据。

// 内嵌视频一定是一段独立的 ISO-BMFF 接在图片字节之后 —— 不管调用方在 XMP 里
// 怎么写，这段视频自己的结构骗不了人。按结构找比猜字段可靠得多。
const VIDEO_BRANDS = ['mp4', 'isom', 'iso2', 'iso4', 'iso5', 'iso6', 'avc1', 'hvc1',
    'hev1', 'mp41', 'mp42', '3gp4', '3gp5', '3g2a', 'm4v', 'M4V', 'MSNV', 'qt', 'dash'];
const APPENDED_SCAN_LIMIT = 4 * 1024 * 1024;

export function findAppendedVideo(bytes) {
    if (!bytes || bytes.length < 1024) return null;

    // 主判据：追加在 JPEG 后面的视频，起点就是主图的 EOI 之后那一字节，与视频多长无关。
    // 原来只按「尾部 4MB 里找最后一个 ftyp」找，手机拍的动图视频动辄 5–15MB，
    // ftyp 落在窗口之外就整条判不出来 —— 表现成「方框不出现」。
    const eoi = findJpegEnd(bytes);
    if (eoi > 0 && eoi + 12 <= bytes.length) {
        const box = appendedBoxAt(bytes, eoi);
        if (box) return box;
    }

    // 兜底：图片不是 JPEG（或视频前面还垫着别的数据）时，从尾部往前找 ftyp
    const from = Math.max(2, bytes.length - APPENDED_SCAN_LIMIT);

    for (let i = bytes.length - 12; i >= from; i--) {
        if (bytes[i] !== 0x66 || bytes[i + 1] !== 0x74 || bytes[i + 2] !== 0x79 || bytes[i + 3] !== 0x70) continue;

        const boxStart = i - 4;
        if (boxStart < 2) continue;                    // 文件开头的 ftyp 是图片自己的
        const size = readU32(bytes, boxStart);
        if (size < 8 || size > 4096) continue;         // ftyp 头本身很短
        const brand = ascii(bytes, i + 4, 4);
        if (VIDEO_BRANDS.indexOf(brand) < 0) continue;

        // 视频一定带 moov（mov/mp4 都一样），用它把图片数据里偶然出现的
        // 「ftyp + 像样的 brand」这种巧合排掉
        if (indexOfAscii(bytes, 'moov', i, bytes.length) < 0) continue;

        return { offset: boxStart, length: bytes.length - boxStart, brand };
    }
    return null;
}

// JPEG 的熵编码数据里 `FF` 后面只能跟 `00`（字节填充）或 RSTn 标记（D0–D7），
// 所以 SOS 之后的第一个 `FF D9` 一定是真正的 EOI —— 不会撞上图像数据里的巧合。
// 返回 EOI 之后那一字节的下标（文件到 EOI 就结束时返回 0）。
export function findJpegEnd(bytes) {
    if (!bytes || bytes.length < 4 || bytes[0] !== 0xFF || bytes[1] !== 0xD8) return 0;
    let i = 2;
    while (i + 1 < bytes.length) {
        if (bytes[i] !== 0xFF) { i++; continue; }      // 不在段头时往后挪（容错）
        const marker = bytes[i + 1];
        if (marker === 0xFF) { i++; continue; }        // 填充
        if (marker === 0xD9) return i + 2;             // 结构性的 EOI：到这就完了
        if (marker === 0xDA) {                         // SOS：后面是熵编码数据，只能扫
            let next = 0;
            for (let p = i + 2; p + 1 < bytes.length; p++) {
                if (bytes[p] !== 0xFF) continue;
                const m = bytes[p + 1];
                if (m === 0xD9) return p + 2;
                if (m === 0x00 || (m >= 0xD0 && m <= 0xD7)) { p++; continue; }  // 填充字节 / 重启标记
                // 别的标记：这一遍扫描到头了（多扫描的渐进式 JPEG 后面还有 SOS 和段），
                // 交回外层按段结构继续走，别当成 EOI
                next = p;
                break;
            }
            if (!next) return 0;
            i = next;
            continue;
        }
        if (marker === 0x01 || (marker >= 0xD0 && marker <= 0xD7)) { i += 2; continue; }
        const size = readU16(bytes, i + 2);
        if (size < 2 || i + 2 + size > bytes.length) return 0;
        i = i + 2 + size;
    }
    return 0;
}

// 紧跟图片字节的那段 ISO-BMFF 是不是一段视频（带 moov 才算，能播的才有）
function appendedBoxAt(bytes, offset) {
    if (offset + 12 > bytes.length) return null;
    if (ascii(bytes, offset + 4, 4) !== 'ftyp') return null;
    const size = readU32(bytes, offset);
    if (size < 8 || size > 4096) return null;          // ftyp 头本身很短
    const brand = ascii(bytes, offset + 8, 4);
    if (VIDEO_BRANDS.indexOf(brand) < 0) return null;
    if (indexOfAscii(bytes, 'moov', offset, bytes.length) < 0) return null;
    return { offset, length: bytes.length - offset, brand };
}

// XMP 被拆成扩展段、或厂商把标记写在别处时的兜底：直接在头部字节里找判据串。
// 分成两组、各自映射到对应的信号 —— 增益图的串不能拿去当 HDR Vivid 的证据。
// 只用不会出现在图像数据里的长串，避免误报（HDR 方框报错的代价比漏报高）。
const GAINMAP_MARKERS = ['hdrgm:Version', 'GContainer:Version'];
const VIVID_MARKERS = ['HDR_VIVID', 'hdr_vivid', 'HUAWEI_HDR', 'SL_HDR'];

function scanMarkers(bytes, list, limit) {
    const head = ascii(bytes, 0, Math.min(bytes.length, limit || 262144));
    return list.some(m => head.indexOf(m) >= 0);
}

// ============================ JPEG ============================

const XMP_SIG = 'http://ns.adobe.com/xap/1.0/';
const XMP_EXT_SIG = 'http://ns.adobe.com/xmp/extension/';
const EXIF_SIG = 'Exif';
// ISO/IEC 21496-1 增益图的标识段（APP2）。Ultra HDR 与华为的 HDR 照片都用它，
// 且 Google 与华为的真实文件里这一段必定存在 —— 比 XMP 可靠得多。
const ISO_GAINMAP_SIG = 'urn:iso:std:iso:ts:21496';
// ITU-T T.35 信令段（APP8）。HDR Vivid 用它声明静态/动态元数据的存在。
const ITU_T35_SIG = 'ITUT35';
// 华为 HDR Vivid 的 EXIF ImageDescription 标记（CUVA 联盟），逐字就这 5 个字符
const CUVA_DESCRIPTION = '_cuva';

// EXIF 的 ImageDescription（IFD0 tag 0x010E）。华为把 HDR Vivid 的标记写在这里，
// 只能精确解出来 —— 拿 `_cuva` 去头部字节里做子串扫描，普通照片的图像数据里
// 也可能凑巧出现同样的字节。解不出来就返回空串（判定方直接用 === 比）。
function parseExifDescription(exif) {
    if (!exif || exif.length < 16) return '';
    const tiff = ascii(exif, 0, 4) === EXIF_SIG ? 6 : 0;      // 载荷含 'Exif\0\0' 前缀
    const order = ascii(exif, tiff, 2);
    if (order !== 'II' && order !== 'MM') return '';
    const le = order === 'II';
    const u16 = p => (le ? exif[p] | (exif[p + 1] << 8) : readU16(exif, p));
    const u32 = p => (le ? readLE32(exif, p) : readU32(exif, p));
    if (u16(tiff + 2) !== 0x2A) return '';                   // TIFF 魔数
    const ifd = tiff + u32(tiff + 4);
    if (ifd + 2 > exif.length) return '';
    const count = u16(ifd);
    for (let k = 0; k < count; k++) {
        const e = ifd + 2 + k * 12;
        if (e + 12 > exif.length) break;
        if (u16(e) !== 0x010E || u16(e + 2) !== 2) continue;  // 2 = ASCII
        const len = u32(e + 4);
        if (len < 1 || len > 64) continue;
        const p = len > 4 ? tiff + u32(e + 8) : e + 8;        // 短值直接内联在条目里
        if (p + len > exif.length) continue;
        return readCString(exif, p, p + len);
    }
    return '';
}

// 遍历 JPEG 的 marker 段，捞出 APP1(XMP/Exif)、APP2(MPF/ISO 21496-1)、APP8(T.35)、APP11(JUMBF)。
// 段头遇到 SOS 就停 —— 后面是熵编码数据，再扫下去只会误判。
export function readJpegSegments(bytes) {
    const out = { xmp: '', exif: null, mpf: null, jumbf: null, isoGainMap: false, ituT35: false };
    let i = 2;
    const len = bytes.length;

    while (i + 4 <= len) {
        if (bytes[i] !== 0xFF) { i++; continue; }
        const marker = bytes[i + 1];
        if (marker === 0xFF) { i++; continue; }                  // 填充
        if (marker === 0x01 || (marker >= 0xD0 && marker <= 0xD9)) { i += 2; continue; }
        if (marker === 0xDA) break;                              // SOS

        const size = readU16(bytes, i + 2);
        if (size < 2 || i + 2 + size > len) break;
        const payloadStart = i + 4;
        const payloadEnd = i + 2 + size;

        if (marker === 0xE1) {
            if (ascii(bytes, payloadStart, XMP_SIG.length) === XMP_SIG) {
                out.xmp += readCString(bytes, payloadStart + XMP_SIG.length + 1, payloadEnd);
            } else if (ascii(bytes, payloadStart, XMP_EXT_SIG.length) === XMP_EXT_SIG) {
                // 扩展 XMP：32 字节 GUID + 4 字节总长 + 4 字节偏移，按偏移顺序拼回
                let p = payloadStart + XMP_EXT_SIG.length + 1 + 32 + 4 + 4;
                out.xmpChunks = out.xmpChunks || [];
                out.xmpChunks.push(readCString(bytes, p, payloadEnd));
            } else if (ascii(bytes, payloadStart, EXIF_SIG.length) === EXIF_SIG) {
                out.exif = bytes.subarray(payloadStart, payloadEnd);
                out.exifDescription = parseExifDescription(out.exif);
            }
        } else if (marker === 0xE2) {
            if (ascii(bytes, payloadStart, 3) === 'MPF') {
                out.mpf = bytes.subarray(payloadStart, payloadEnd);
            } else if (ascii(bytes, payloadStart, ISO_GAINMAP_SIG.length) === ISO_GAINMAP_SIG) {
                out.isoGainMap = true;
            }
        } else if (marker === 0xE8) {
            if (ascii(bytes, payloadStart, ITU_T35_SIG.length) === ITU_T35_SIG) out.ituT35 = true;
        } else if (marker === 0xEB) {
            out.jumbf = bytes.subarray(payloadStart, payloadEnd);
        }

        i = payloadEnd;
    }

    if (out.xmpChunks) {
        out.xmp += out.xmpChunks.join('');
        delete out.xmpChunks;
    }
    return out;
}

// ============================ XMP 判读 ============================

// XMP 里 `Container:Directory` 的目录项。Ultra HDR 的增益图与新版安卓动态照片
// 用的是同一套结构，只是 Item:Semantic 不同（GainMap / MotionPhoto / Primary）。
function parseContainerDirectory(xmp) {
    const items = [];
    const re = /<Container:Item\b([^>]*)>/g;
    let m;
    while ((m = re.exec(xmp)) !== null) {
        const attrs = m[1];
        items.push({
            semantic: attr(attrs, 'Item:Semantic') || attr(attrs, 'Semantic'),
            mime: attr(attrs, 'Item:Mime') || attr(attrs, 'Mime'),
            length: attrNumber(attrs, 'Item:Length'),
            padding: attrNumber(attrs, 'Item:Padding') || 0,
        });
    }
    return items;
}

// 与 WallpaperMixin 里方框 tooltip 的措辞保持一致：
// 同一个 vendor 在存储字段和界面上必须是同一个名字。
const LIVE_VENDOR_LABELS = {
    apple: 'Apple 实况照片',
    huawei: '华为实况照片',
    android: '安卓实况照片',
    generic: '实况照片',
};

export function classifyLive(xmp, isobmff, bytes) {
    // 1) Apple：实况照片的配对标识。单文件 .livp 由 ZIP 那条路处理。
    if (attr(xmp, 'apple:ContentIdentifier') || xmp.includes('com.apple.quicktime.content.identifier')) {
        return { vendor: 'apple', mime: 'video/quicktime' };
    }

    // 2) ISO-BMFF 里的内嵌视频 item —— 华为 / Google 的单文件 HEIC 动态照片走这条
    if (isobmff && isobmff.videoItem) {
        return { vendor: 'huawei', mime: isobmff.videoItem.contentType, item: isobmff.videoItem };
    }

    const dir = parseContainerDirectory(xmp);
    const motionItem = dir.find(it => it.semantic === 'MotionPhoto' ||
        (it.mime && it.mime.indexOf('video/') === 0));

    // 3) 华为：XMP 里带厂商私有标记。
    //    华为有把标记写成元素（`<HUAWEI_MOTION_PHOTO>1</...>`）而非属性的版本，
    //    所以不能只靠 attr()，子串判定也要留着。
    if (xmp.includes('HUAWEI_MOTION_PHOTO') || attr(xmp, 'HUAWEI_MOTION_PHOTO') !== null ||
        xmp.includes('HUAWEI_MOTION') || xmp.includes('hw_motionphoto')) {
        return { vendor: 'huawei', mime: 'video/mp4', directoryItem: motionItem };
    }

    // 4) 安卓系（Google / 三星 / 小米 / OPPO / vivo）：Google 的 MicroVideo 家族
    const microOffset = attrNumber(xmp, 'GCamera:MicroVideoOffset');
    const cameraMicroOffset = attrNumber(xmp, 'Camera:MicroVideoOffset');
    const isMicroVideo = attr(xmp, 'GCamera:MicroVideo') === '1' || attr(xmp, 'Camera:MicroVideo') === '1';

    if (isMicroVideo || microOffset !== null || cameraMicroOffset !== null) {
        const fromEnd = microOffset !== null ? microOffset : cameraMicroOffset;
        return { vendor: 'android', mime: 'video/mp4', offsetFromEnd: fromEnd };
    }

    // 5) 新版安卓：MotionPhoto 标志 + Container 目录（没有 MicroVideoOffset）
    if (attr(xmp, 'MotionPhoto') === '1' || attr(xmp, 'GCamera:MotionPhoto') === '1' || motionItem) {
        return { vendor: 'android', mime: 'video/mp4', directoryItem: motionItem };
    }

    // 6) 兜底：XMP 没给出任何可用字段（华为的私有写法、被裁掉的 XMP、新机型…），
    //    直接按结构找图片尾部那段视频。找得到就当实况照片，厂商交给下面判。
    const appended = findAppendedVideo(bytes);
    if (appended) {
        return {
            vendor: /HUAWEI|HUAWEI_HDR|hw_/i.test(xmp) ? 'huawei' : 'generic',
            mime: /qt {2}|quicktime/i.test(appended.brand) ? 'video/quicktime' : 'video/mp4',
            appended,
        };
    }

    return null;
}

const HDR_STANDARD_LABELS = {
    'ultra-hdr': 'HDR',
    'hdr10': 'HDR10',
    'hdr-vivid': 'Vivid',
    'dolby-vision': 'DV',
    'hlg': 'HLG',
    'pq': 'HDR',
};

const HDR_STANDARD_DETAILS = {
    'ultra-hdr': 'Ultra HDR（JPEG 增益图，ISO 21496-1）',
    'hdr10': 'HDR10（BT.2020 + PQ）',
    'hdr-vivid': 'HDR Vivid（BT.2020 + PQ；与 HDR10 同信号，按华为/Vivid 特征判定）',
    'dolby-vision': 'Dolby Vision',
    'hlg': 'HLG（BT.2020 混合对数伽马）',
    'pq': 'HDR（PQ 传输曲线）',
};

export { HDR_STANDARD_LABELS, HDR_STANDARD_DETAILS, LIVE_VENDOR_LABELS };

// PQ / HLG 的 nclx 传输特性取值（ITU-T H.273）
const TRANSFER_PQ = 16;
const TRANSFER_HLG = 18;
const PRIMARIES_BT2020 = 9;

function buildHdr(signals) {
    const hints = signals.vendorHints || null;

    // 增益图优先：Ultra HDR 的底图本身是 SDR，真正让它「HDR」的是那张增益图。
    // 华为的 HDR Vivid 照片也是这套（SDR 底图 + ISO 21496-1 增益图），只是额外
    // 用 EXIF 的 `_cuva` 标记声明自己 —— 机制相同、家数不同，标准报增益图这一侧，
    // 把厂商标记写进 detail，不冒名也不吞掉。
    if (signals.gainMap) {
        const cuva = !!(hints && hints.cuva);
        return {
            standard: 'ultra-hdr',
            label: HDR_STANDARD_LABELS['ultra-hdr'],
            detail: HDR_STANDARD_DETAILS['ultra-hdr'] + (cuva ? '，华为 HDR Vivid 标记' : ''),
            gainMap: true,
            transfer: signals.transfer,
            primaries: signals.primaries,
        };
    }
    if (signals.dolbyVision) {
        return {
            standard: 'dolby-vision',
            label: HDR_STANDARD_LABELS['dolby-vision'],
            detail: HDR_STANDARD_DETAILS['dolby-vision'] + '（Profile ' + signals.dolbyVision.profile + '.' + signals.dolbyVision.level + '）',
            dolbyVision: signals.dolbyVision,
            transfer: signals.transfer,
            primaries: signals.primaries,
        };
    }
    if (signals.transfer === TRANSFER_PQ) {
        // 静态图容器里 HDR Vivid 与 HDR10 都是「BT.2020 + PQ」，靠厂商特征区分；
        // 判不出来就老实报 HDR10，不假装精确。PQ 配非 BT.2020 原色（如 DCI-P3）
        // 不属于任何一个具名标准，退到泛化的 HDR 标识。
        //
        // 注：mdcv + clli 是 HDR10 的静态元数据（ST 2086 / CTA-861.3），**不是** HDR10+ ——
        // HDR10+ 的动态元数据逐帧存在 SEI 里，静态图容器没有可靠的判定依据，
        // 所以这里不用它去升级标准，只作为附加信息带出去。
        const bt2020 = signals.primaries === PRIMARIES_BT2020;
        const vivid = hints && hints.vivid;
        const standard = !bt2020 ? 'pq' : (vivid ? 'hdr-vivid' : 'hdr10');
        return {
            standard,
            label: HDR_STANDARD_LABELS[standard],
            detail: HDR_STANDARD_DETAILS[standard] + (signals.staticMetadata ? '，含母版显示信息' : ''),
            transfer: signals.transfer,
            primaries: signals.primaries,
            staticMetadata: !!signals.staticMetadata,
        };
    }
    if (signals.transfer === TRANSFER_HLG) {
        return {
            standard: 'hlg',
            label: HDR_STANDARD_LABELS.hlg,
            detail: HDR_STANDARD_DETAILS.hlg,
            transfer: signals.transfer,
            primaries: signals.primaries,
        };
    }
    if (signals.primaries === PRIMARIES_BT2020 && signals.transfer && signals.transfer !== 1 && signals.transfer !== 13) {
        return {
            standard: 'pq',
            label: HDR_STANDARD_LABELS.pq,
            detail: HDR_STANDARD_DETAILS.pq,
            transfer: signals.transfer,
            primaries: signals.primaries,
        };
    }

    // 兜底：华为的 HDR 照片不打 XMP，底图之外若连增益图/传输特性都读不到，
    // 只剩 EXIF 里的 `_cuva` 声明可用。这是厂商自己的标记，报出来，
    // 但不假装知道具体信号（detail 里写清楚依据是什么）。
    if (hints && hints.cuva) {
        return {
            standard: 'hdr-vivid',
            label: HDR_STANDARD_LABELS['hdr-vivid'],
            detail: 'HDR Vivid（华为 _cuva 标记' + (hints.ituT35 ? ' + ITU-T T.35 信令段' : '') +
                '；未读到增益图与传输特性，按厂商标记判定）',
            transfer: signals.transfer,
            primaries: signals.primaries,
            tagged: true,
        };
    }
    return null;
}

// ============================ ISO-BMFF（HEIF / AVIF）============================

function walkBoxes(bytes, start, end, visit, depth) {
    let i = start;
    while (i + 8 <= end) {
        let size = readU32(bytes, i);
        const type = ascii(bytes, i + 4, 4);
        let header = 8;
        if (size === 1) {
            if (i + 16 > end) break;
            size = readU64(bytes, i + 8);
            header = 16;
        } else if (size === 0) {
            size = end - i;
        }
        if (size < header || i + size > end) break;
        visit(type, i + header, i + size, depth);
        i += size;
    }
}

const FULLBOX_CONTAINERS = ['meta', 'iinf', 'iref', 'dref', 'stsd', 'mvex'];
const PLAIN_CONTAINERS = ['iprp', 'ipco', 'moov', 'trak', 'mdia', 'minf', 'stbl', 'dinf', 'udta', 'edts', 'grpl'];

export function readIsoBmff(bytes) {
    const out = { brands: [], items: [], colr: [], dolbyVision: null, mdcv: false, clli: false, gainMap: false, videoItem: null, hdrgm: false };

    const visit = (type, start, end, depth) => {
        if (depth > 8) return;

        if (PLAIN_CONTAINERS.includes(type)) {
            walkBoxes(bytes, start, end, visit, depth + 1);
            return;
        }
        if (FULLBOX_CONTAINERS.includes(type)) {
            if (type === 'iinf') { readIinf(bytes, start, end, out); return; }
            if (type === 'stsd') return; // 静态图用不到样本表，跳过免得多解析一层
            walkBoxes(bytes, start + 4, end, visit, depth + 1);
            return;
        }
        if (type === 'iloc') { out.iloc = readIloc(bytes, start, end); return; }
        if (type === 'colr') { readColr(bytes, start, end, out); return; }
        if (type === 'dvcC' || type === 'dvvC') { out.dolbyVision = readDovi(bytes, start); return; }
        if (type === 'mdcv') { out.mdcv = true; return; }
        if (type === 'clli') { out.clli = true; return; }
        if (type === 'hdrgm' || type === 'tmap') { out.gainMap = true; out.hdrgm = true; return; }
    };

    walkBoxes(bytes, 0, bytes.length, visit, 0);
    out.brands = readFtypBrands(bytes);

    // 把 iloc 里的 extent 接到 iinf 的 item 上，找出内嵌视频
    if (out.items.length && out.iloc) {
        for (const item of out.items) {
            if (item.contentType && item.contentType.indexOf('video/') === 0) {
                const loc = out.iloc.find(l => l.itemId === item.itemId);
                if (loc && loc.extents.length) {
                    item.offset = loc.extents[0].offset;
                    item.length = loc.extents[0].length;
                    out.videoItem = item;
                    break;
                }
            }
        }
    }
    return out;
}

function readIinf(bytes, start, end, out) {
    let p = start + 4;
    const version = bytes[start];
    const count = version === 0 ? readU16(bytes, p) : readU32(bytes, p);
    p += version === 0 ? 2 : 4;

    let seen = 0;
    let i = p;
    while (i + 8 <= end && seen < count) {
        const size = readU32(bytes, i);
        if (size < 8 || i + size > end) break;
        if (ascii(bytes, i + 4, 4) === 'infe') out.items.push(readInfe(bytes, i + 8, i + size));
        i += size;
        seen++;
    }
}

// ISO/IEC 14496-12 ItemInfoEntry。注意两个易错点：
//   · version 2 的 item_ID 是 16 位、version 3 是 32 位；
//   · v2+ 里 `item_name` 在 `content_type` **之前**（v0/v1 才是反的）。
function readInfe(bytes, start, end) {
    const version = bytes[start];
    let p = start + 4;
    const itemId = version === 3 ? readU32(bytes, p) : readU16(bytes, p);
    p += version === 3 ? 4 : 2;
    p += 2; // item_protection_index

    let contentType = null;
    let name = '';
    if (version >= 2) {
        const itemType = ascii(bytes, p, 4);
        p += 4;
        name = readCString(bytes, p, end);
        p += name.length + 1;
        if (itemType === 'mime' || itemType === 'uri ') {
            contentType = readCString(bytes, p, end);
        }
    } else {
        name = readCString(bytes, p, end);
        p += name.length + 1;
        contentType = readCString(bytes, p, end);
    }
    return { itemId, contentType, name };
}

// iloc 的 item_count / extent_count 是文件里读出来的，遇到畸形或截断的容器会把
// 循环放飞（每个 extent 都要读两个变长整数，能一路读到文件尾产生上千个废 item）。
// 静态图的 item 数以个位计，这里给硬上限兜底。
const MAX_ILOC_ITEMS = 512;
const MAX_EXTENTS_PER_ITEM = 64;

function readIloc(bytes, start, end) {
    const version = bytes[start];
    let p = start + 4;
    const offsetSize = bytes[p] >> 4;
    const lengthSize = bytes[p] & 0x0F;
    p++;
    const baseOffsetSize = bytes[p] >> 4;
    const indexSize = (version === 1 || version === 2) ? (bytes[p] & 0x0F) : 0;
    p++;
    const itemCount = Math.min(version < 2 ? readU16(bytes, p) : readU32(bytes, p), MAX_ILOC_ITEMS);
    p += version < 2 ? 2 : 4;

    const items = [];
    for (let i = 0; i < itemCount; i++) {
        if (p + 4 > end) break;
        const itemId = version < 2 ? readU16(bytes, p) : readU32(bytes, p);
        p += version < 2 ? 2 : 4;
        if (version === 1 || version === 2) p += 2; // construction_method(4) + reserved(12)
        p += 2;                                     // data_reference_index
        if (p > end) break;
        const baseOffset = readVarInt(bytes, p, baseOffsetSize);
        p += baseOffsetSize;
        if (p + 2 > end) break;
        const extentCount = Math.min(readU16(bytes, p), MAX_EXTENTS_PER_ITEM);
        p += 2;

        const extents = [];
        for (let e = 0; e < extentCount; e++) {
            if ((version === 1 || version === 2) && indexSize > 0) p += indexSize;
            if (p + offsetSize + lengthSize > end) break;
            const offset = readVarInt(bytes, p, offsetSize);
            p += offsetSize;
            const length = readVarInt(bytes, p, lengthSize);
            p += lengthSize;
            extents.push({ offset: baseOffset + offset, length });
        }
        items.push({ itemId, extents });
    }
    return items;
}

function readColr(bytes, start, end, out) {
    const type = ascii(bytes, start, 4);
    if (type !== 'nclx') return;
    out.colr.push({
        primaries: readU16(bytes, start + 4),
        transfer: readU16(bytes, start + 6),
        matrix: readU16(bytes, start + 8),
        fullRange: (bytes[start + 10] & 0x80) !== 0,
    });
}

function readDovi(bytes, start) {
    // dvcC/dvvC: FullBox(4) + dv_version_major(8) dv_version_minor(8)
    //            + dv_profile(7) dv_level(6) rpu/el/bl 各 1 bit
    const p = start + 4;
    const profile = (bytes[p + 2] >> 1) & 0x7F;
    const level = ((bytes[p + 2] & 0x01) << 5) | ((bytes[p + 3] >> 3) & 0x1F);
    return { profile, level };
}

// ============================ PNG ============================

const PNG_HDR_CHUNKS = ['cICP', 'mDCV', 'cLLI'];

export function readPngChunks(bytes) {
    const out = { cicp: null, mdcv: false, clli: false, animated: false };
    let p = 8;
    while (p + 8 <= bytes.length) {
        const len = readU32(bytes, p);
        const type = ascii(bytes, p + 4, 4);
        if (type === 'cICP' && p + 8 + 4 <= bytes.length) {
            out.cicp = {
                primaries: bytes[p + 8],
                transfer: bytes[p + 9],
                matrix: bytes[p + 10],
                fullRange: bytes[p + 11] !== 0,
            };
        } else if (type === 'mDCV') {
            out.mdcv = true;
        } else if (type === 'cLLI') {
            out.clli = true;
        } else if (type === 'acTL') {
            out.animated = true;
        } else if (type === 'IEND') {
            break;
        }
        p += 12 + len;
    }
    return out;
}

// ============================ ZIP（Apple .livp）============================

export function readZipEntries(bytes) {
    // 从尾部找 EOCD（PK\x05\x06），前面最多 64KB 注释
    const eocd = (() => {
        const from = Math.max(0, bytes.length - 66000);
        for (let i = bytes.length - 22; i >= from; i--) {
            if (bytes[i] === 0x50 && bytes[i + 1] === 0x4B && bytes[i + 2] === 0x05 && bytes[i + 3] === 0x06) return i;
        }
        return -1;
    })();
    if (eocd < 0) return [];

    const count = readLE16(bytes, eocd + 10);
    let p = readLE32(bytes, eocd + 16);
    const entries = [];

    for (let i = 0; i < count && p + 46 <= bytes.length; i++) {
        if (ascii(bytes, p, 4) !== 'PK\x01\x02') break;
        const method = readLE16(bytes, p + 10);
        const compressedSize = readLE32(bytes, p + 20);
        const uncompressedSize = readLE32(bytes, p + 24);
        const nameLen = readLE16(bytes, p + 28);
        const extraLen = readLE16(bytes, p + 30);
        const commentLen = readLE16(bytes, p + 32);
        const localOffset = readLE32(bytes, p + 42);
        const name = ascii(bytes, p + 46, nameLen);

        // 本地头的 extra 长度可能与中央目录不同，必须按本地头现读
        const localExtraLen = readLE16(bytes, localOffset + 28);
        const dataStart = localOffset + 30 + nameLen + localExtraLen;

        entries.push({ name, method, compressedSize, uncompressedSize, dataStart });
        p += 46 + nameLen + extraLen + commentLen;
    }
    return entries;
}

export async function extractZipEntry(bytes, entry) {
    const raw = bytes.subarray(entry.dataStart, entry.dataStart + entry.compressedSize);
    if (entry.method === 0) return raw;
    if (entry.method !== 8) throw new Error('不支持的 ZIP 压缩方式：' + entry.method);
    if (typeof DecompressionStream === 'undefined') throw new Error('当前环境不支持解压此实况照片包');

    const stream = new Blob([raw]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
}

// ============================ 主入口 ============================

// 识别规则的版本号。判据一变就 +1：用户库里**已经存了 format** 的壁纸要靠它触发重判，
// 否则老图永远停在旧判定的结果上 —— 华为 HDR 的方框一直不出现就是这么来的：
// 文件在旧规则下被写成了 { hdr: null }，而「只在缺 format 时才补判」的回填会整个绕过它。
export const FORMAT_RULE_VERSION = 2;

export function detectWallpaperFormat(bytes) {
    if (!bytes || !bytes.length) {
        return { container: 'unknown', hdr: null, live: null };
    }

    const container = sniffContainer(bytes);
    let hdr = null;
    let live = null;

    if (container === 'jpeg') {
        const seg = readJpegSegments(bytes);
        // 兜底：XMP 可能藏在扩展段或厂商私有段里，直接在头部扫一遍关键串
        const xmp = seg.xmp || ascii(bytes, 0, Math.min(bytes.length, 262144));

        const dir = parseContainerDirectory(xmp);
        // 华为 HDR Vivid 的照片不打 XMP：HDR 证据全在段结构里 —— APP2 的
        // ISO 21496-1 增益图标识、APP8 的 ITU-T T.35 信令段，以及 EXIF 里
        // ImageDescription 逐字等于 `_cuva` 的厂商标记。
        const cuva = (seg.exifDescription || '').trim().toLowerCase() === CUVA_DESCRIPTION;
        const signals = {
            gainMap: seg.isoGainMap ||
                xmp.includes('hdrgm:Version') ||
                dir.some(it => it.semantic === 'GainMap') ||
                attr(xmp, 'GContainer:Version') !== null ||
                scanMarkers(bytes, GAINMAP_MARKERS),
            vendorHints: {
                vivid: cuva || xmp.includes('vivid') || xmp.includes('Vivid') ||
                    xmp.includes('HUAWEI') || scanMarkers(bytes, VIVID_MARKERS),
                cuva,
                ituT35: seg.ituT35,
            },
        };
        hdr = buildHdr(signals);

        const rawLive = classifyLive(xmp, null, bytes);
        if (rawLive) live = resolveLive(rawLive, bytes, dir);

    } else if (container === 'heif' || container === 'avif' || container === 'isobmff') {
        const box = readIsoBmff(bytes);
        const colr = box.colr[0] || null;

        // HEIF/AVIF 的 XMP 也可能带厂商标记（华为动态照片就是写在这里的）
        const xmpStart = indexOfAscii(bytes, '<x:xmpmeta');
        const xmp = xmpStart >= 0 ? ascii(bytes, xmpStart, Math.min(bytes.length, xmpStart + 262144)) : '';
        const dir = parseContainerDirectory(xmp);

        const signals = {
            gainMap: box.gainMap || dir.some(it => it.semantic === 'GainMap'),
            dolbyVision: box.dolbyVision,
            transfer: colr ? colr.transfer : null,
            primaries: colr ? colr.primaries : null,
            staticMetadata: box.mdcv && box.clli,
            vendorHints: { vivid: box.brands.includes('hevm') || xmp.includes('HUAWEI') || xmp.includes('Vivid') },
        };
        hdr = buildHdr(signals);

        const rawLive = classifyLive(xmp, box, bytes);
        if (rawLive) live = resolveLive(rawLive, bytes, dir);

    } else if (container === 'jxl') {
        // JPEG XL 的容器形态也是 ISO-BMFF（裸码流没有元数据，读不到就算了）
        const box = readIsoBmff(bytes);
        const colr = box.colr[0] || null;
        hdr = buildHdr({
            gainMap: box.gainMap || scanMarkers(bytes, GAINMAP_MARKERS),
            dolbyVision: box.dolbyVision,
            transfer: colr ? colr.transfer : null,
            primaries: colr ? colr.primaries : null,
            staticMetadata: box.mdcv && box.clli,
            vendorHints: { vivid: scanMarkers(bytes, VIVID_MARKERS) },
        });

    } else if (container === 'png') {
        const png = readPngChunks(bytes);
        if (png.cicp) {
            hdr = buildHdr({
                transfer: png.cicp.transfer,
                primaries: png.cicp.primaries,
                staticMetadata: png.mdcv && png.clli,
                gainMap: false,
                vendorHints: null,
            });
        }
    } else if (container === 'zip') {
        // Apple .livp：包内一对 heic + mov。这里同步只做「是实况照片」的判定，
        // 具体条目等 applyLiveWallpaper 时再取（解压是异步的）。
        const entries = readZipEntries(bytes);
        const mov = entries.find(e => /\.(mov|mp4)$/i.test(e.name));
        if (mov) {
            live = {
                vendor: 'apple',
                label: LIVE_VENDOR_LABELS.apple,
                mime: /\.mov$/i.test(mov.name) ? 'video/quicktime' : 'video/mp4',
                source: 'zip-entry',
                zipEntry: mov,
            };
        }
    }

    // 方框上的开关：每张壁纸各自记住这项兼容开不开。
    // 开关是「用户意图」：已经在 hdr / live 里的 enabled 一律原样保留，
    // 回填（backfill）只重判那些当时什么都没认出来的条目。
    if (hdr && hdr.enabled === undefined) hdr.enabled = true;
    if (live) {
        if (live.enabled === undefined) live.enabled = true;
        live.label = LIVE_VENDOR_LABELS[live.vendor] || '实况照片';
    }
    // v 跟着结果一起落盘：它是「这份判定出自哪版规则」的凭据，回填靠它判断要不要重判
    return { container, hdr, live, v: FORMAT_RULE_VERSION };
}

// 开关状态的唯一读法：字段缺失一律视为「开」（老数据没有这个字段）
export function isHdrEnabled(format) {
    return !!(format && format.hdr && format.hdr.enabled !== false);
}

export function isLiveEnabled(format) {
    return !!(format && format.live && format.live.enabled !== false);
}

// 把 classifyLive 给出的「厂商语义」落成具体的字节区间
function resolveLive(raw, bytes, dir) {
    const base = { vendor: raw.vendor, mime: raw.mime || 'video/mp4' };

    // 结构性定位（图片尾部那段 ISO-BMFF）：绝对偏移已经算好，最可靠
    if (raw.appended) {
        return Object.assign(base, {
            source: 'embedded',
            offset: raw.appended.offset,
            length: raw.appended.length,
            offsetFromEnd: false,
        });
    }

    // ISO-BMFF 内嵌视频 item：iloc 已经给出绝对偏移
    if (raw.item && raw.item.offset !== undefined) {
        return Object.assign(base, {
            source: 'embedded',
            offset: raw.item.offset,
            length: raw.item.length,
            offsetFromEnd: false,
        });
    }

    // Container:Directory 的 Item:Length —— 视频是文件末尾的 N 字节
    const item = raw.directoryItem || dir.find(it => it.semantic === 'MotionPhoto' || (it.mime && it.mime.indexOf('video/') === 0));
    if (item && item.length) {
        return Object.assign(base, {
            mime: item.mime || base.mime,
            source: 'embedded',
            offset: 0,
            length: item.length,
            offsetFromEnd: true,
        });
    }

    // 老的 GCamera:MicroVideoOffset —— 同样是从文件末尾算起
    if (raw.offsetFromEnd !== undefined && raw.offsetFromEnd !== null) {
        return Object.assign(base, {
            source: 'embedded',
            offset: 0,
            length: raw.offsetFromEnd,
            offsetFromEnd: true,
        });
    }

    // XMP 只给了厂商标记、没给长度或偏移（华为的私有写法就属于这种）：
    // 先按结构去文件尾部找那段 ISO-BMFF，找到了照样能提取
    const appended = findAppendedVideo(bytes);
    if (appended) {
        return Object.assign(base, {
            source: 'embedded',
            offset: appended.offset,
            length: appended.length,
            offsetFromEnd: false,
        });
    }

    // 实在定位不到视频区间：保留 LIVE 标识，但标记为不可提取，界面照常显示方框。
    return Object.assign(base, { source: 'marker-only', offset: null, length: null, offsetFromEnd: false });
}

// 从整份字节里切出内嵌视频
export function extractLiveVideo(bytes, live) {
    if (!live) return null;
    if (live.source === 'embedded' && live.length > 0) {
        const start = live.offsetFromEnd ? Math.max(0, bytes.length - live.length) : live.offset;
        const end = start + live.length;
        if (start >= 0 && end <= bytes.length && end > start) return bytes.subarray(start, end);
    }
    return null;
}

// 容器 → MIME。用来给 data URL 打标，不能用 file.type 顶替（.heic/.livp 常常是空串）。
const CONTAINER_MIME = {
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    bmp: 'image/bmp',
    avif: 'image/avif',
    heif: 'image/heic',
    jxl: 'image/jxl',
    zip: 'application/zip',
};

export function mimeForContainer(container) {
    return CONTAINER_MIME[container] || 'application/octet-stream';
}

// 壁纸管线用的联合判定：这份文件到底该不该跳过 canvas 重编码。
// HDR 一旦重编码增益图/10bit 就没了，动态照片一旦重编码内嵌视频也没了。
// 用户在方框上把开关关掉，就等于放弃这项保护，回到普通 SDR 图的处理。
export function mustPreserveBytes(format) {
    if (!format) return false;
    if (isHdrEnabled(format)) return true;
    return isLiveEnabled(format) && !!format.live && format.live.source !== 'marker-only';
}

// 上传前的类型判定。不信 file.type —— Chrome 对 .heic/.livp 给不出可靠 MIME，
// 而 .heic 恰好是本需求里最主要的容器之一。
const KNOWN_EXT = /\.(jpe?g|png|webp|gif|bmp|avif|heic|heif|jxl|livp)$/i;
const LIVE_EXT = /\.(livp|mov|mp4)$/i;

export function isSupportedWallpaperFile(file) {
    if (!file) return false;
    if (KNOWN_EXT.test(file.name || '')) return true;
    if (file.type && file.type.indexOf('image/') === 0) return true;
    // .livp 走 ZIP 分支，是唯一一种「文件名必须认识」的形态
    return LIVE_EXT.test(file.name || '');
}

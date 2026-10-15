// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

export const BadgeAudioMixin = {
    getBadgeAudio() {
        if (!this._badgeAudio) {
            const audio = new Audio(this.ocpAudioUrl);
            audio.addEventListener('play', () => {
                // OCP 已开始播放：此后 hover 铭牌才允许呼出播控；同时惰性读取曲目元数据
                this._ocpHasStarted = true;
                this.loadOcpTrackMeta();
                this.setBadgeAudioGlow(true);
                this.syncOcpPlayerState();
                this.updateBadgeAudioProgress();
                // 先用占位文案顶上，读到音源标签后再刷新为真实曲目信息
                this.updateOcpMediaSessionMeta();
                this.updateOcpMediaSessionState();
            });
            audio.addEventListener('pause', () => {
                this.setBadgeAudioGlow(false);
                this.syncOcpPlayerState();
                this.updateOcpMediaSessionState();
            });
            audio.addEventListener('ended', () => {
                this.updateBadgeAudioProgress();
                this.setBadgeAudioGlow(false);
                this.syncOcpPlayerState();
                this.updateOcpMediaSessionState();
            });
            audio.addEventListener('error', () => {
                this.setBadgeAudioGlow(false);
                this.syncOcpPlayerState();
                this.updateOcpMediaSessionState();
            });
            // 进度光带长度跟随播放进度
            audio.addEventListener('timeupdate', () => this.updateBadgeAudioProgress());
            audio.addEventListener('loadedmetadata', () => this.updateBadgeAudioProgress());
            this._badgeAudio = audio;
            // 交给浏览器媒体播控（系统媒体面板 / 媒体键）接管
            this.setupOcpMediaSession();
            this.updateOcpMediaSessionState();
        }
        return this._badgeAudio;
    },
    updateBadgeAudioProgress() {
        const badge = document.getElementById('ooo-badge');
        const audio = this._badgeAudio;
        if (!badge || !audio) return;

        let ratio = 0;
        const duration = audio.duration;
        if (audio.ended) {
            ratio = 1;
        } else if (isFinite(duration) && duration > 0) {
            ratio = Math.min(1, Math.max(0, audio.currentTime / duration));
        }
        badge.style.setProperty('--badge-audio-progress', ratio.toFixed(4));
    },
    toggleBadgeAudio() {
        try {
            const audio = this.getBadgeAudio();
            if (!audio.paused && !audio.ended) {
                audio.pause();
                return;
            }
            // 播完后再次触发：从头播放
            if (audio.ended) audio.currentTime = 0;
            audio.play().catch(err => {
                this.setBadgeAudioGlow(false);
                console.error('播放音频失败:', err);
            });
        } catch (err) {
            this.setBadgeAudioGlow(false);
            console.error('播放音频失败:', err);
        }
    },
    playBadgeAudio() {
        try {
            const audio = this.getBadgeAudio();
            audio.currentTime = 0;
            audio.play().catch(err => {
                this.setBadgeAudioGlow(false);
                console.error('播放音频失败:', err);
            });
        } catch (err) {
            this.setBadgeAudioGlow(false);
            console.error('播放音频失败:', err);
        }
    },
    stopBadgeAudio() {
        if (this._badgeAudio && !this._badgeAudio.paused) {
            this._badgeAudio.pause();
        }
        this.setBadgeAudioGlow(false);
    },
    setBadgeAudioGlow(on) {
        const badge = document.getElementById('ooo-badge');
        if (badge) badge.classList.toggle('badge-audio-playing', !!on);
    },
    setupOcpPlayer() {
        if (this._ocpPlayerBound) return;
        const badge = document.getElementById('ooo-badge');
        const popover = document.getElementById('ocp-player-popover');
        if (!badge || !popover) return;
        this._ocpPlayerBound = true;

        // 播放按钮与铭牌双击/右键共用同一切换逻辑（播放中→暂停，暂停/播完→播放）
        const playBtn = document.getElementById('ocp-play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleBadgeAudio();
            });
        }

        // 点击封面：新标签页打开在线播放器（保留当前新标签页）
        const coverBtn = document.getElementById('ocp-cover-btn');
        if (coverBtn) {
            coverBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                window.open(this.ocpPlayerUrl, '_blank');
            });
        }

        // hover 铭牌显示；移出铭牌/播控延迟隐藏，跨越两者间隙时取消隐藏
        badge.addEventListener('mouseenter', () => this.showOcpPlayer());
        badge.addEventListener('mouseleave', () => this.scheduleHideOcpPlayer());
        popover.addEventListener('mouseenter', () => this.cancelHideOcpPlayer());
        popover.addEventListener('mouseleave', () => this.scheduleHideOcpPlayer());

        // 兜底：点击页面其他位置（含滚动进入壁纸模式前的点击）时收起播控
        document.addEventListener('click', (e) => {
            if (!popover.classList.contains('show')) return;
            if (popover.contains(e.target) || badge.contains(e.target)) return;
            this.hideOcpPlayer();
        });
    },
    isOcpPlayerAvailable() {
        if (!this.settings.ocpPlayerEnabled || !this._ocpHasStarted) return false;
        // 铭牌被隐藏（隐藏铭牌开关等）时不可呼出；壁纸模式由 pointer-events:none 天然拦截
        const badge = document.getElementById('ooo-badge');
        return !!(badge && badge.offsetParent !== null);
    },
    showOcpPlayer() {
        if (!this.isOcpPlayerAvailable()) return;
        const popover = document.getElementById('ocp-player-popover');
        if (!popover) return;
        this.cancelHideOcpPlayer();
        this.syncOcpPlayerState();
        popover.classList.add('show');
        popover.setAttribute('aria-hidden', 'false');
    },
    scheduleHideOcpPlayer() {
        this.cancelHideOcpPlayer();
        this._ocpHideTimer = setTimeout(() => {
            this._ocpHideTimer = null;
            this.hideOcpPlayer();
        }, 240);
    },
    cancelHideOcpPlayer() {
        if (this._ocpHideTimer) {
            clearTimeout(this._ocpHideTimer);
            this._ocpHideTimer = null;
        }
    },
    hideOcpPlayer() {
        this.cancelHideOcpPlayer();
        const popover = document.getElementById('ocp-player-popover');
        if (!popover) return;
        popover.classList.remove('show');
        popover.setAttribute('aria-hidden', 'true');
    },
    syncOcpPlayerState() {
        const card = document.querySelector('.ocp-player-card');
        const icon = document.querySelector('#ocp-play-btn .material-icons');
        const audio = this._badgeAudio;
        const playing = !!(audio && !audio.paused && !audio.ended);
        if (card) card.classList.toggle('playing', playing);
        if (icon) icon.textContent = playing ? 'pause' : 'play_arrow';
    },
    setupOcpMediaSession() {
        if (this._ocpMediaSessionBound) return;
        if (!('mediaSession' in navigator)) return;
        this._ocpMediaSessionBound = true;

        // 单个动作不被当前浏览器支持时 setActionHandler 会抛错，逐个静默跳过
        const bind = (action, handler) => {
            try {
                navigator.mediaSession.setActionHandler(action, handler);
            } catch (err) {
                /* 该动作在当前浏览器不受支持，忽略 */
            }
        };
        bind('play', () => this.resumeBadgeAudio());
        bind('pause', () => this.pauseBadgeAudio());
        // 系统面板的进度拖拽（单曲场景只做 seek，不提供上一首/下一首）
        bind('seekto', (details) => this.seekBadgeAudio(details && details.seekTime));
    },
    updateOcpMediaSessionMeta() {
        if (!('mediaSession' in navigator) || typeof MediaMetadata === 'undefined') return;
        const titleEl = document.querySelector('.ocp-player-title');
        const artistEl = document.querySelector('.ocp-player-artist');
        const track = this.getOcpTrackMeta();
        const title = (track.title || (titleEl && titleEl.textContent) || 'OCP').trim();
        const artist = (track.artist || (artistEl && artistEl.textContent) || 'ByRUDAN').trim();

        const artwork = [];
        if (this._ocpCoverUrl) {
            artwork.push({
                src: this._ocpCoverUrl,
                sizes: track.coverSizes || '512x512',
                type: track.coverType || 'image/jpeg'
            });
        }
        try {
            navigator.mediaSession.metadata = new MediaMetadata({ title, artist, artwork });
        } catch (err) {
            console.warn('设置媒体播控元数据失败:', err);
        }
    },
    updateOcpMediaSessionState() {
        if (!('mediaSession' in navigator)) return;
        const audio = this._badgeAudio;
        const state = !audio ? 'none' : (audio.paused || audio.ended ? 'paused' : 'playing');
        try {
            navigator.mediaSession.playbackState = state;
        } catch (err) {
            /* 状态同步失败不影响播放 */
        }
    },
    getOcpTrackMeta() {
        if (!this._ocpTrackMeta) {
            this._ocpTrackMeta = { title: null, artist: null, coverSizes: null, coverType: null };
        }
        return this._ocpTrackMeta;
    },
    resumeBadgeAudio() {
        try {
            const audio = this.getBadgeAudio();
            if (!audio.paused) return;
            audio.play().catch(err => {
                this.setBadgeAudioGlow(false);
                console.error('播放音频失败:', err);
            });
        } catch (err) {
            this.setBadgeAudioGlow(false);
            console.error('播放音频失败:', err);
        }
    },
    pauseBadgeAudio() {
        if (this._badgeAudio && !this._badgeAudio.paused) {
            this._badgeAudio.pause();
        }
    },
    seekBadgeAudio(seekTime) {
        const audio = this._badgeAudio;
        if (!audio || typeof seekTime !== 'number' || !isFinite(seekTime)) return;
        try {
            const duration = isFinite(audio.duration) && audio.duration > 0 ? audio.duration : seekTime;
            audio.currentTime = Math.max(0, Math.min(seekTime, duration));
        } catch (err) {
            /* 时长未知时无法定位，忽略 */
        }
    },
    loadOcpTrackMeta() {
        if (this._ocpMetaPromise) return this._ocpMetaPromise;
        this._ocpMetaPromise = (async () => {
            try {
                // 1) ID3v2：先取 10 字节标签头拿到标签长度，再按长度取标签本体
                let meta = null;
                const head = await this.readOcpSourceRange('0-9');
                if (head && this.isId3v2Tag(head)) {
                    const tagSize = this.readId3Size(head, 6);
                    const tag = tagSize > 0 ? await this.readOcpSourceRange(this.ocpHeadRange(tagSize + 9)) : null;
                    if (tag) meta = this.parseId3v2(tag);
                }
                // 2) 头部信息不全时，再读文件尾部 ID3v1 兜底
                if (!meta || !meta.title || !meta.artist) {
                    const tail = await this.readOcpSourceRange(this.ocpTailRange(128));
                    if (tail) {
                        const v1 = this.parseId3v1(tail);
                        if (v1) meta = Object.assign({ coverBlob: null }, v1, meta || {});
                    }
                }
                this.applyOcpTrackMeta(meta);
            } catch (err) {
                console.warn('读取 OCP 元数据失败，使用默认信息:', err);
            }
        })();
        return this._ocpMetaPromise;
    },
    ocpHeadRange(n) {
        const size = this._ocpSourceSize;
        const end = size ? Math.min(n, size - 1) : n;
        return `0-${end}`;
    },
    ocpTailRange(n) {
        const size = this._ocpSourceSize;
        return size && size > n ? `${size - n}-${size - 1}` : `-${n}`;
    },
    async readOcpSourceRange(range) {
        if (!this._ocpWholeSource) {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 10000);
            try {
                const res = await fetch(this.ocpAudioUrl, {
                    signal: controller.signal,
                    headers: range ? { Range: `bytes=${range}` } : undefined
                });
                if (!res.ok) return null;
                // 206 的 Content-Range（bytes 0-9/12375550）顺带给出文件总长，
                // 省掉一次 HEAD 请求；跨域未暴露该响应头时退化为「拿到多少算多少」
                const contentRange = res.headers.get('Content-Range');
                if (contentRange) {
                    const total = /\/(\d+)\s*$/.exec(contentRange);
                    if (total) this._ocpSourceSize = parseInt(total[1], 10) || 0;
                }
                const bytes = new Uint8Array(await res.arrayBuffer());
                if (res.status === 206 || !range) {
                    if (!range) this._ocpSourceSize = bytes.length;
                    return bytes;
                }
                // 服务器忽略了 Range：把整文件留作后续复用的缓存
                this._ocpWholeSource = bytes;
                this._ocpSourceSize = bytes.length;
            } catch (err) {
                return null;
            } finally {
                clearTimeout(timer);
            }
        }
        return this.sliceOcpRange(this._ocpWholeSource, range);
    },
    sliceOcpRange(bytes, range) {
        if (!range || !bytes) return bytes;
        const match = /^(\d*)-(\d*)$/.exec(range);
        if (!match) return bytes;
        const [, from, to] = match;
        if (from === '') {
            const n = parseInt(to, 10) || 0;
            return bytes.subarray(Math.max(0, bytes.length - n));
        }
        const start = parseInt(from, 10) || 0;
        const end = to === '' ? bytes.length - 1 : Math.min(parseInt(to, 10), bytes.length - 1);
        return bytes.subarray(start, end + 1);
    },
    isId3v2Tag(bytes) {
        return !!(bytes && bytes.length >= 10 && bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33);
    },
    readId3Size(bytes, offset) {
        return ((bytes[offset] & 0x7f) << 21) | ((bytes[offset + 1] & 0x7f) << 14) |
            ((bytes[offset + 2] & 0x7f) << 7) | (bytes[offset + 3] & 0x7f);
    },
    parseId3v2(bytes) {
        if (!this.isId3v2Tag(bytes)) return null;
        const major = bytes[3];
        if (major !== 3 && major !== 4) return null;
        const flags = bytes[5];
        // v2.4 帧长为 syncsafe（每字节 7 位），v2.3 为普通大端 uint32
        const syncsafe = (b, o) => this.readId3Size(b, o);
        const uint32 = (b, o) => (b[o] << 24) | (b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3];
        const tagSize = syncsafe(bytes, 6);
        let pos = 10;
        if (flags & 0x40) { // 扩展头：v2.4 长度含自身且 syncsafe，v2.3 不含自身
            if (major === 4) pos += syncsafe(bytes, pos);
            else pos += 4 + uint32(bytes, pos);
        }
        const end = Math.min(10 + tagSize, bytes.length);
        const result = {};
        const textFrames = { TIT2: 'title', TPE1: 'artist' };
        while (pos + 10 <= end) {
            const id = String.fromCharCode(bytes[pos], bytes[pos + 1], bytes[pos + 2], bytes[pos + 3]);
            if (!/^[A-Z0-9]{4}$/.test(id)) break; // 进入填充区
            const size = major === 4 ? syncsafe(bytes, pos + 4) : uint32(bytes, pos + 4);
            if (size <= 0 || pos + 10 + size > end) break;
            const body = bytes.subarray(pos + 10, pos + 10 + size);
            if (textFrames[id]) {
                const s = this.readId3String(body, 1, body[0]);
                if (s.text) result[textFrames[id]] = s.text;
            } else if (id === 'APIC' && !result.coverBlob) {
                const enc = body[0];
                let p = 1;
                while (p < body.length && body[p] !== 0) p++; // MIME（latin1，0x00 结尾）
                const mime = new TextDecoder('windows-1252').decode(body.subarray(1, p)) || 'image/jpeg';
                p += 2; // 跳过 MIME 终止符 + 图片类型字节
                const desc = this.readId3String(body, p, enc);
                p = desc.next;
                if (p < body.length) {
                    result.coverBlob = new Blob([body.subarray(p)], { type: mime });
                }
            }
            pos += 10 + size;
        }
        return result;
    },
    readId3String(bytes, start, encoding) {
        if (encoding === 1 || encoding === 2) {
            let i = start;
            while (i + 1 < bytes.length) {
                if (bytes[i] === 0 && bytes[i + 1] === 0) break;
                i += 2;
            }
            const raw = bytes.subarray(start, i);
            return {
                text: new TextDecoder(encoding === 2 ? 'utf-16be' : 'utf-16').decode(raw),
                next: i + 2
            };
        }
        let i = start;
        while (i < bytes.length && bytes[i] !== 0) i++;
        return {
            text: new TextDecoder(encoding === 3 ? 'utf-8' : 'windows-1252').decode(bytes.subarray(start, i)),
            next: i + 1
        };
    },
    parseId3v1(bytes) {
        if (bytes.length < 128) return null;
        const tail = bytes.subarray(bytes.length - 128);
        if (String.fromCharCode(tail[0], tail[1], tail[2]) !== 'TAG') return null;
        const field = (start, len) => new TextDecoder('windows-1252')
            .decode(tail.subarray(start, start + len))
            .replace(/\0[\s\S]*$/, '')
            .trim();
        return { title: field(3, 30) || null, artist: field(33, 30) || null };
    },
    applyOcpTrackMeta(meta) {
        if (!meta) return;
        const track = this.getOcpTrackMeta();
        const titleEl = document.querySelector('.ocp-player-title');
        const artistEl = document.querySelector('.ocp-player-artist');
        if (meta.title) {
            track.title = meta.title;
            if (titleEl) titleEl.textContent = meta.title;
        }
        if (meta.artist) {
            track.artist = meta.artist;
            if (artistEl) artistEl.textContent = meta.artist;
        }
        if (meta.coverBlob) {
            track.coverType = meta.coverBlob.type || null;
            this.applyOcpCover(meta.coverBlob);
        }
        // 曲目信息变了就刷新媒体播控（封面尺寸要等图片解码后才拿得到）
        this.updateOcpMediaSessionMeta();
    },
    applyOcpCover(blob) {
        const cover = document.querySelector('.ocp-player-cover');
        if (!cover) return;
        let url = null;
        try {
            url = URL.createObjectURL(blob);
        } catch (err) {
            console.warn('应用 OCP 封面失败:', err);
            return;
        }
        const probe = new Image();
        probe.onload = () => {
            // 期间可能已换成更新的封面：此时旧 URL 直接释放
            if (this._ocpCoverUrl) URL.revokeObjectURL(this._ocpCoverUrl);
            this._ocpCoverUrl = url;
            cover.classList.add('has-art');
            cover.style.backgroundImage = `url("${url}")`;
            // 图片解码后才有真实尺寸，媒体播控的 artwork 尺寸声明在此补上
            const track = this.getOcpTrackMeta();
            if (probe.naturalWidth && probe.naturalHeight) {
                track.coverSizes = `${probe.naturalWidth}x${probe.naturalHeight}`;
            }
            this.updateOcpMediaSessionMeta();
        };
        probe.onerror = () => {
            URL.revokeObjectURL(url);
            console.warn('音源封面无法解码，保留默认封面');
        };
        probe.src = url;
    },
};

/**
 * 音频播控小组件（Apple Music 风格）
 * - 检测当前播放音频的标签页（chrome.tabs.query({audible:true})）
 * - 展示封面、曲名、作者、进度、暂停/上一首/下一首
 * - 通过 content script（media-control.js）控制页面媒体
 */
class AudioWidget extends WidgetBase {
    constructor(config) {
        super(config);
        this.type = 'audio';
        this.currentTab = null;
    }

    buildContent() {
        this.element.classList.add('widget-audio');

        // 正在播放区
        this.npEl = document.createElement('div');
        this.npEl.className = 'widget-audio-nowplaying';

        this.coverEl = document.createElement('div');
        this.coverEl.className = 'widget-audio-cover';
        this.coverEl.innerHTML = '<span class="material-icons">music_note</span>';

        this.metaEl = document.createElement('div');
        this.metaEl.className = 'widget-audio-meta';

        this.titleEl = document.createElement('div');
        this.titleEl.className = 'widget-audio-title';
        this.titleEl.textContent = '未在播放';

        this.artistEl = document.createElement('div');
        this.artistEl.className = 'widget-audio-artist';
        this.artistEl.textContent = '—';

        this.metaEl.appendChild(this.titleEl);
        this.metaEl.appendChild(this.artistEl);

        this.npEl.appendChild(this.coverEl);
        this.npEl.appendChild(this.metaEl);

        // 进度条
        this.progressEl = document.createElement('div');
        this.progressEl.className = 'widget-audio-progress';
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'widget-audio-progress-bar';
        this.progressEl.appendChild(this.progressBar);

        // 控制按钮
        this.controlsEl = document.createElement('div');
        this.controlsEl.className = 'widget-audio-controls';

        this.prevBtn = this.makeBtn('skip_previous', '上一首', () => this.control('prev'));
        this.playBtn = this.makeBtn('play_arrow', '播放/暂停', () => this.control('toggle'));
        this.nextBtn = this.makeBtn('skip_next', '下一首', () => this.control('next'));

        this.controlsEl.appendChild(this.prevBtn);
        this.controlsEl.appendChild(this.playBtn);
        this.controlsEl.appendChild(this.nextBtn);

        this.element.appendChild(this.npEl);
        this.element.appendChild(this.progressEl);
        this.element.appendChild(this.controlsEl);
    }

    afterMount() {
        this.poll();
        // 每 5 秒轮询一次播放状态
        this.setInterval(() => this.poll(), 5000);
        // 进度条动画（播放时缓慢流动）
        this.setInterval(() => {
            if (this.currentTab && this.currentTab.audible) {
                this.progressBar.style.width = (30 + Math.random() * 60) + '%';
            } else {
                this.progressBar.style.width = '0%';
            }
        }, 3000);
    }

    makeBtn(icon, title, onClick) {
        const btn = document.createElement('button');
        btn.className = 'widget-audio-btn' + (icon === 'play_arrow' ? ' play-pause' : '');
        btn.innerHTML = '<span class="material-icons">' + icon + '</span>';
        btn.title = title;
        btn.addEventListener('click', onClick);
        return btn;
    }

    async poll() {
        try {
            if (typeof chrome === 'undefined' || !chrome.tabs) return;
            const tabs = await chrome.tabs.query({ audible: true });
            const playing = tabs.filter(t => t.audible !== false && t.id != null);
            if (playing.length > 0) {
                this.currentTab = playing[0];
                const title = this.cleanTitle(this.currentTab.title || '');
                const domain = this.extractDomain(this.currentTab.url || '');
                this.titleEl.textContent = title || '正在播放';
                this.artistEl.textContent = domain || '—';
                this.playBtn.innerHTML = '<span class="material-icons">pause</span>';
                this.playBtn.title = '暂停';
                // 封面：尝试读取媒体信息
                this.fetchMediaInfo(this.currentTab.id);
                this.coverEl.classList.add('has-art');
            } else {
                this.currentTab = null;
                this.titleEl.textContent = '未在播放';
                this.artistEl.textContent = '—';
                this.playBtn.innerHTML = '<span class="material-icons">play_arrow</span>';
                this.playBtn.title = '播放';
                this.coverEl.classList.remove('has-art');
                this.coverEl.innerHTML = '<span class="material-icons">music_note</span>';
            }
        } catch (e) {
            // 无 tabs 权限时静默降级
        }
    }

    /**
     * 通过 content script 读取媒体信息（标题/作者/封面）
     */
    async fetchMediaInfo(tabId) {
        try {
            const resp = await chrome.tabs.sendMessage(tabId, { type: 'ooo-media-get-state' });
            if (resp && resp.title) {
                this.titleEl.textContent = resp.title;
                if (resp.artist) this.artistEl.textContent = resp.artist;
                if (resp.artwork) {
                    this.coverEl.innerHTML = '';
                    const img = document.createElement('img');
                    img.src = resp.artwork;
                    img.alt = '';
                    this.coverEl.appendChild(img);
                }
            }
        } catch (e) {
            // 页面无内容脚本，使用 tab title 降级
        }
    }

    /**
     * 发送媒体控制指令到当前播放的标签页
     */
    async control(action) {
        if (!this.currentTab || this.currentTab.id == null) {
            // 无播放时：打开第一个音乐平台快捷入口
            if (this.shortcuts.length) {
                window.open(this.shortcuts[0].url, '_blank');
            }
            return;
        }
        try {
            await chrome.tabs.sendMessage(this.currentTab.id, {
                type: 'ooo-media-control',
                action: action
            });
        } catch (e) {
            // 页面不支持：点击打开该标签页
            chrome.tabs.update(this.currentTab.id, { active: true });
        }
    }

    /**
     * 清理标签标题：去掉末尾的站点名（如 " - YouTube Music"）
     */
    cleanTitle(title) {
        return title
            .replace(/\s*[-–—|]\s*(YouTube Music|Spotify|网易云音乐|QQ音乐|酷狗音乐|bilibili|Bilibili|B站).*$/, '')
            .replace(/\s*[-–—|]\s*(YouTube|Netflix|Twitch).*$/, '')
            .trim() || title;
    }

    extractDomain(url) {
        try {
            const u = new URL(url);
            return u.hostname.replace(/^www\./, '');
        } catch (e) {
            return '';
        }
    }
}

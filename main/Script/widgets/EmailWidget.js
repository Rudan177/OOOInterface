/**
 * 邮箱小组件
 * - 若配置了本地 API 地址（如 http://127.0.0.1:端口/api/emails），则拉取最近邮件列表展示
 * - 未配置 API 时，显示邮箱服务商入口（Gmail/Outlook/QQ），点击打开
 * - 拉取结果缓存到设置中，离线时展示缓存并提示
 */
class EmailWidget extends WidgetBase {
    constructor(config) {
        super(config);
        this.type = 'email';
        this.apiUrl = (this.data && this.data.apiUrl) || '';
        this.provider = (this.data && this.data.provider) || 'gmail';
        this.providerUrl = (this.data && this.data.url) || this.getDefaultProviderUrl(this.provider);
        this.cachedEmails = (this.data && Array.isArray(this.data.cachedEmails)) ? this.data.cachedEmails : [];
        this.providerMeta = this.getProviderMeta(this.provider);
    }

    getProviderMeta(provider) {
        const meta = {
            gmail: { name: 'Gmail', url: 'https://mail.google.com', logo: 'G' },
            outlook: { name: 'Outlook', url: 'https://outlook.live.com/mail/', logo: 'O' },
            qq: { name: 'QQ邮箱', url: 'https://mail.qq.com', logo: 'Q' },
            custom: { name: '邮箱', url: '', logo: '✉' }
        };
        return meta[provider] || meta.custom;
    }

    getDefaultProviderUrl(provider) {
        return this.getProviderMeta(provider).url;
    }

    buildContent() {
        this.element.classList.add('widget-email');

        // 头部：Logo + 名称 + 打开按钮
        this.headerEl = document.createElement('div');
        this.headerEl.className = 'widget-email-header';

        this.logoEl = document.createElement('div');
        this.logoEl.className = 'widget-email-logo';
        this.logoEl.textContent = this.providerMeta.logo;

        const nameBox = document.createElement('div');
        nameBox.style.minWidth = '0';
        nameBox.style.flex = '1';

        this.nameEl = document.createElement('div');
        this.nameEl.className = 'widget-email-name';
        this.nameEl.textContent = this.providerMeta.name;

        this.addrEl = document.createElement('div');
        this.addrEl.className = 'widget-email-addr';
        this.addrEl.textContent = this.apiUrl ? 'API: ' + this.apiUrl.replace(/^https?:\/\//, '') : '最近邮件';

        nameBox.appendChild(this.nameEl);
        nameBox.appendChild(this.addrEl);

        this.openBtn = document.createElement('button');
        this.openBtn.className = 'widget-email-open-btn';
        this.openBtn.textContent = '打开';
        this.openBtn.addEventListener('click', () => {
            if (this.providerUrl) window.open(this.providerUrl, '_blank');
        });

        this.headerEl.appendChild(this.logoEl);
        this.headerEl.appendChild(nameBox);
        this.headerEl.appendChild(this.openBtn);

        this.element.appendChild(this.headerEl);

        // 邮件列表（可滚动）
        this.bodyEl = document.createElement('div');
        this.bodyEl.className = 'widget-email-body';
        this.element.appendChild(this.bodyEl);

        if (this.apiUrl) {
            this.renderList();
            this.refresh();
        } else {
            this.renderNoApi();
        }
    }

    renderNoApi() {
        this.bodyEl.innerHTML = '';
        const hint = document.createElement('div');
        hint.className = 'widget-email-empty';
        hint.textContent = '未配置邮件 API，可打开网页版查看';
        this.bodyEl.appendChild(hint);
    }

    async refresh() {
        try {
            const data = await this.fetchJSON(this.apiUrl);
            const emails = (data && Array.isArray(data.emails)) ? data.emails : (Array.isArray(data) ? data : []);
            this.cachedEmails = emails.map(e => ({
                from: e.from || e.sender || '未知发件人',
                subject: e.subject || '(无主题)',
                time: e.time || e.date || ''
            }));
            this.data.cachedEmails = this.cachedEmails;
            this.persist();
            this.renderList();
        } catch (err) {
            console.warn('[EmailWidget] 邮件获取失败:', err.message);
            if (this.cachedEmails.length) {
                this.renderList(true);
                this.notify('邮件拉取失败，显示缓存');
            } else {
                this.bodyEl.innerHTML = '';
                const errEl = document.createElement('div');
                errEl.className = 'widget-email-empty';
                errEl.textContent = '获取失败：' + (err.message || '未知错误');
                this.bodyEl.appendChild(errEl);
            }
        }
    }

    renderList(offline = false) {
        this.bodyEl.innerHTML = '';

        if (offline) {
            const tag = document.createElement('div');
            tag.className = 'widget-email-empty';
            tag.textContent = '离线缓存 ' + this.cachedEmails.length + ' 封';
            this.bodyEl.appendChild(tag);
        }

        if (this.cachedEmails.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'widget-email-empty';
            empty.textContent = '暂无邮件';
            this.bodyEl.appendChild(empty);
            return;
        }

        this.cachedEmails.slice(0, 20).forEach(mail => {
            const item = document.createElement('div');
            item.className = 'widget-email-item';

            const avatar = document.createElement('div');
            avatar.className = 'widget-email-item-avatar';
            avatar.textContent = (mail.from || '?').charAt(0).toUpperCase();

            const info = document.createElement('div');
            info.className = 'widget-email-item-info';

            const from = document.createElement('div');
            from.className = 'widget-email-item-from';
            from.textContent = mail.from;

            const subject = document.createElement('div');
            subject.className = 'widget-email-item-subject';
            subject.textContent = mail.subject;

            info.appendChild(from);
            info.appendChild(subject);

            const time = document.createElement('div');
            time.className = 'widget-email-item-time';
            time.textContent = this.formatTime(mail.time);

            item.appendChild(avatar);
            item.appendChild(info);
            item.appendChild(time);

            item.addEventListener('click', () => {
                if (this.providerUrl) window.open(this.providerUrl, '_blank');
            });

            this.bodyEl.appendChild(item);
        });
    }

    formatTime(t) {
        if (!t) return '';
        // 支持 ISO 字符串或时间戳
        const d = new Date(t);
        if (isNaN(d.getTime())) return String(t).slice(0, 10);
        const now = new Date();
        const sameDay = d.toDateString() === now.toDateString();
        if (sameDay) {
            return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
        }
        return (d.getMonth() + 1) + '/' + d.getDate();
    }
}

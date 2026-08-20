class EmailWidget extends WidgetBase {
    constructor(config) {
        super(config);
        this.type = 'email';
        this.provider = (this.data && this.data.provider) || 'gmail';
        this.providerUrl = (this.data && this.data.url) || this.getDefaultProviderUrl(this.provider);
        this.cachedEmails = (this.data && Array.isArray(this.data.cachedEmails)) ? this.data.cachedEmails : [];
        this.providerMeta = this.getProviderMeta(this.provider);
        this.googleToken = (this.data && this.data.googleToken) || '';
        this.googleEmail = (this.data && this.data.googleEmail) || '';
        this.googleConnected = !!(this.data && this.data.googleConnected);
        this.apiUrl = (this.data && this.data.apiUrl) || '';
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

        // 头部
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
        if (this.provider === 'gmail' && this.googleConnected) {
            this.addrEl.textContent = this.googleEmail || '已连接';
        } else {
            this.addrEl.textContent = '最近邮件';
        }

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

        // 邮件列表
        this.bodyEl = document.createElement('div');
        this.bodyEl.className = 'widget-email-body';
        this.element.appendChild(this.bodyEl);

        if (this.provider === 'gmail') {
            if (this.googleConnected) {
                this.renderList();
                this.fetchGmail();
            } else {
                this.renderNoApi();
            }
        } else if (this.apiUrl) {
            this.renderList();
            this.fetchApiEmails();
        } else {
            this.renderNoApi();
        }
    }

    renderNoApi() {
        this.bodyEl.innerHTML = '';
        const hint = document.createElement('div');
        hint.className = 'widget-email-empty';
        if (this.provider === 'gmail') {
            hint.textContent = '连接 Google 账号后可直接查看收件箱';
        } else {
            hint.textContent = '配置邮件 API 地址后可直接查看邮件';
        }
        this.bodyEl.appendChild(hint);
    }

    async fetchGmail() {
        if (!this.googleToken) return;
        try {
            // 获取最近 20 封邮件的元数据
            const listRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=20', {
                headers: { Authorization: 'Bearer ' + this.googleToken }
            });
            if (!listRes.ok) throw new Error(listRes.status === 401 ? 'token无效或已过期' : '请求失败 ' + listRes.status);
            const listData = await listRes.json();
            const messages = listData.messages || [];

            // 批量获取邮件头
            const emails = [];
            for (const msg of messages) {
                try {
                    const msgRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/' + msg.id + '?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date', {
                        headers: { Authorization: 'Bearer ' + this.googleToken }
                    });
                    if (!msgRes.ok) continue;
                    const msgData = await msgRes.json();
                    const headers = {};
                    (msgData.payload && msgData.payload.headers || []).forEach(h => {
                        headers[h.name.toLowerCase()] = h.value;
                    });
                    emails.push({
                        from: (headers.from || '').replace(/<.*>/, '').trim() || '未知',
                        subject: headers.subject || '(无主题)',
                        time: headers.date || ''
                    });
                } catch (_) {}
            }

            this.cachedEmails = emails;
            this.data.cachedEmails = emails;
            this.persist();
            this.renderList();
        } catch (err) {
            console.warn('[EmailWidget] Gmail 拉取失败:', err.message);
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

    async fetchApiEmails() {
        if (!this.apiUrl) return;
        try {
            const data = await this.fetchJSON(this.apiUrl);
            const emails = (data && Array.isArray(data.emails)) ? data.emails : [];
            this.cachedEmails = emails
                .filter(e => e && (e.from || e.subject))
                .map(e => ({
                    from: e.from || '未知',
                    subject: e.subject || '(无主题)',
                    time: e.time || ''
                }));
            this.data.cachedEmails = this.cachedEmails;
            this.persist();
            this.renderList();
        } catch (err) {
            console.warn('[EmailWidget] 邮件 API 拉取失败:', err.message);
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
        const d = new Date(t);
        if (isNaN(d.getTime())) return String(t).slice(0, 10);
        const now = new Date();
        const sameDay = d.toDateString() === now.toDateString();
        if (sameDay) {
            return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
        }
        return (d.getMonth() + 1) + '/' + d.getDate();
    }

    // Google OAuth 连接
    async connectGoogle(clientId) {
        const scope = 'https://www.googleapis.com/auth/gmail.readonly';
        const redirectUri = 'https://' + chrome.runtime.id + '.chromiumapp.org/';
        const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
            + '?client_id=' + encodeURIComponent(clientId)
            + '&redirect_uri=' + encodeURIComponent(redirectUri)
            + '&response_type=token'
            + '&scope=' + encodeURIComponent(scope)
            + '&prompt=consent';

        return new Promise((resolve, reject) => {
            chrome.identity.launchWebAuthFlow({ url: authUrl, interactive: true }, async (redirectUrl) => {
                if (chrome.runtime.lastError || !redirectUrl) {
                    reject(new Error(chrome.runtime.lastError ? chrome.runtime.lastError.message : '授权取消'));
                    return;
                }
                try {
                    const hash = new URL(redirectUrl).hash.substring(1);
                    const params = new URLSearchParams(hash);
                    const token = params.get('access_token');
                    if (!token) throw new Error('未获取到 access_token');

                    // 获取用户邮箱
                    const meRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
                        headers: { Authorization: 'Bearer ' + token }
                    });
                    const meData = await meRes.json();
                    const email = meData.emailAddress || '';

                    this.googleToken = token;
                    this.googleEmail = email;
                    this.googleConnected = true;
                    this.data.googleToken = token;
                    this.data.googleEmail = email;
                    this.data.googleConnected = true;
                    this.data.googleClientId = clientId;
                    this.persist();

                    this.addrEl.textContent = email || '已连接';
                    this.bodyEl.innerHTML = '';
                    this.renderList();
                    this.fetchGmail();

                    resolve();
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    disconnectGoogle() {
        this.googleToken = '';
        this.googleEmail = '';
        this.googleConnected = false;
        this.data.googleToken = '';
        this.data.googleEmail = '';
        this.data.googleConnected = false;
        this.persist();
        this.addrEl.textContent = '最近邮件';
        this.bodyEl.innerHTML = '';
        this.renderNoApi();
    }
}

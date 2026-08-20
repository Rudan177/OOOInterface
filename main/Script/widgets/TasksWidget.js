/**
 * 任务小组件（支持 Google Tasks）
 * - 未登录：本地 localStorage 任务
 * - 已登录：同步 Google Tasks API（默认任务列表）
 * - 通过 chrome.identity.launchWebAuthFlow 授权（用户在设置中填入 Client ID）
 */
class TasksWidget extends WidgetBase {
    constructor(config) {
        super(config);
        this.type = 'tasks';
        this.tasks = (this.data && Array.isArray(this.data.items)) ? this.data.items : [];
        this.useGoogle = !!(this.data && this.data.googleConnected);
        this.token = this.data.googleToken || null;
    }

    buildContent() {
        this.element.classList.add('widget-tasks');

        this.headerEl = document.createElement('div');
        this.headerEl.className = 'widget-tasks-header';

        this.listEl = document.createElement('div');
        this.listEl.className = 'widget-tasks-list';

        this.inputRow = document.createElement('div');
        this.inputRow.className = 'widget-tasks-input-row';

        this.inputEl = document.createElement('input');
        this.inputEl.className = 'widget-tasks-input';
        this.inputEl.type = 'text';
        this.inputEl.maxLength = 80;

        this.addBtn = document.createElement('button');
        this.addBtn.className = 'widget-tasks-add-btn';
        this.addBtn.textContent = '+';
        this.addBtn.title = '添加任务';

        this.inputRow.appendChild(this.inputEl);
        this.inputRow.appendChild(this.addBtn);

        this.element.appendChild(this.headerEl);
        this.element.appendChild(this.listEl);
        this.element.appendChild(this.inputRow);

        this.addBtn.addEventListener('click', () => this.addTask());
        this.inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        this.renderList();
    }

    afterMount() {
        if (this.useGoogle && this.token) {
            this.trySync();
        }
    }

    // ─── OAuth2 ───

    getRedirectUri() {
        if (typeof chrome !== 'undefined' && chrome.identity && chrome.identity.getRedirectURL) {
            return chrome.identity.getRedirectURL();
        }
        return 'https://' + (typeof chrome !== 'undefined' && chrome.runtime ? chrome.runtime.id : '') + '.chromiumapp.org/';
    }

    async connectGoogle(clientId) {
        if (!clientId) throw new Error('请先填写 Client ID');
        if (typeof chrome === 'undefined' || !chrome.identity) {
            throw new Error('chrome.identity 不可用，请检查扩展权限');
        }

        const redirectUri = this.getRedirectUri();
        const scopes = ['https://www.googleapis.com/auth/tasks'];
        const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
            + '?client_id=' + encodeURIComponent(clientId)
            + '&redirect_uri=' + encodeURIComponent(redirectUri)
            + '&response_type=token'
            + '&scope=' + encodeURIComponent(scopes.join(' '))
            + '&prompt=consent';

        const responseUrl = await new Promise((resolve, reject) => {
            chrome.identity.launchWebAuthFlow({
                url: authUrl,
                interactive: true
            }, (url) => {
                if (chrome.runtime.lastError || !url) {
                    reject(chrome.runtime.lastError || new Error('授权被取消'));
                } else {
                    resolve(url);
                }
            });
        });

        const token = this.parseToken(responseUrl);
        if (!token) throw new Error('未能获取访问令牌');

        this.token = token;
        this.useGoogle = true;
        this.data.googleConnected = true;
        this.data.googleClientId = clientId;
        this.data.googleToken = token;

        // 获取用户邮箱
        try {
            const resp = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            if (resp.ok) {
                const profile = await resp.json();
                this.data.googleEmail = profile.email || '';
            }
        } catch (e) { /* 忽略 */ }

        this.persist();
        this.inputEl.placeholder = '添加任务到 Google Tasks…';
        await this.fetchGoogleTasks();
        this.renderList();
    }

    parseToken(url) {
        try {
            const hash = new URL(url).hash;
            const params = new URLSearchParams(hash.replace(/^#/, ''));
            return params.get('access_token') || null;
        } catch (e) { return null; }
    }

    disconnectGoogle() {
        this.token = null;
        this.useGoogle = false;
        this.data.googleConnected = false;
        this.data.googleToken = '';
        this.data.googleEmail = '';
        this.inputEl.placeholder = '添加任务…';
        this.persist();
        this.renderList();
    }

    // ─── Google Tasks API ───

    async apiFetch(path) {
        const resp = await fetch('https://www.googleapis.com/tasks/v1' + path, {
            headers: { 'Authorization': 'Bearer ' + this.token }
        });
        if (resp.status === 401 || resp.status === 403) {
            this.disconnectGoogle();
            return null;
        }
        if (!resp.ok) throw new Error('API ' + resp.status);
        return resp.json();
    }

    async apiPost(path, body) {
        const resp = await fetch('https://www.googleapis.com/tasks/v1' + path, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + this.token, 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (resp.status === 401 || resp.status === 403) { this.disconnectGoogle(); return null; }
        if (!resp.ok) throw new Error('API ' + resp.status);
        return resp.json();
    }

    async apiPatch(path, body) {
        const resp = await fetch('https://www.googleapis.com/tasks/v1' + path, {
            method: 'PATCH',
            headers: { 'Authorization': 'Bearer ' + this.token, 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (resp.status === 401 || resp.status === 403) { this.disconnectGoogle(); return null; }
        if (!resp.ok) throw new Error('API ' + resp.status);
        return resp.json();
    }

    async apiDelete(path) {
        const resp = await fetch('https://www.googleapis.com/tasks/v1' + path, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + this.token }
        });
        if (resp.status === 401 || resp.status === 403) this.disconnectGoogle();
    }

    async fetchGoogleTasks() {
        const data = await this.apiFetch('/lists/@default/tasks?showCompleted=true&showHidden=true');
        if (!data || !data.items) return;
        this.tasks = data.items.map(item => ({
            id: item.id,
            text: item.title || '',
            done: item.status === 'completed',
            googleId: item.id
        })).filter(t => t.text);
        this.data.items = this.tasks;
        this.persist();
    }

    async trySync() {
        if (!this.token || !this.useGoogle) return;
        try {
            await this.fetchGoogleTasks();
            this.renderList();
        } catch (e) {
            // token 过期等，不做处理
        }
    }

    // ─── 任务操作 ───

    async addTask() {
        const text = this.inputEl.value.trim();
        if (!text) return;

        if (this.useGoogle && this.token) {
            try {
                const item = await this.apiPost('/lists/@default/tasks', { title: text, status: 'needsAction' });
                if (item && item.id) {
                    this.tasks.push({ id: item.id, text, done: false, googleId: item.id });
                }
            } catch (e) {
                this.tasks.push({ id: this.genId(), text, done: false });
            }
        } else {
            this.tasks.push({ id: this.genId(), text, done: false });
        }
        this.inputEl.value = '';
        this.data.items = this.tasks;
        this.persist();
        this.renderList();
    }

    async toggleTask(id) {
        const t = this.tasks.find(x => x.id === id);
        if (!t) return;
        t.done = !t.done;
        if (this.useGoogle && this.token && t.googleId) {
            try {
                await this.apiPatch('/lists/@default/tasks/' + t.googleId, {
                    status: t.done ? 'completed' : 'needsAction'
                });
            } catch (e) { /* 本地已更新 */ }
        }
        this.data.items = this.tasks;
        this.persist();
        this.renderList();
    }

    async deleteTask(id) {
        const t = this.tasks.find(x => x.id === id);
        if (t && this.useGoogle && this.token && t.googleId) {
            try { await this.apiDelete('/lists/@default/tasks/' + t.googleId); } catch (e) { /* 继续 */ }
        }
        this.tasks = this.tasks.filter(x => x.id !== id);
        this.data.items = this.tasks;
        this.persist();
        this.renderList();
    }

    // ─── 渲染 ───

    renderList() {
        const done = this.tasks.filter(t => t.done).length;
        const total = this.tasks.length;
        const prefix = this.useGoogle ? 'Google Tasks' : '任务';
        this.headerEl.textContent = prefix + (total ? '  ' + done + '/' + total : '');

        this.listEl.innerHTML = '';

        if (this.tasks.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'widget-task-empty';
            empty.textContent = this.useGoogle ? '暂无任务' : '暂无任务';
            this.listEl.appendChild(empty);
            return;
        }

        const sorted = [...this.tasks].sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));
        sorted.forEach(t => {
            const item = document.createElement('div');
            item.className = 'widget-task-item' + (t.done ? ' done' : '');

            const box = document.createElement('span');
            box.className = 'widget-task-checkbox';
            box.textContent = t.done ? '✓' : '';

            const text = document.createElement('span');
            text.className = 'widget-task-text';
            text.textContent = t.text;
            text.title = t.text;

            const del = document.createElement('button');
            del.className = 'widget-task-delete';
            del.textContent = '✕';
            del.title = '删除';

            box.addEventListener('click', (e) => { e.stopPropagation(); this.toggleTask(t.id); });
            text.addEventListener('click', () => this.toggleTask(t.id));
            del.addEventListener('click', (e) => { e.stopPropagation(); this.deleteTask(t.id); });

            item.appendChild(box);
            item.appendChild(text);
            item.appendChild(del);
            this.listEl.appendChild(item);
        });
    }

    genId() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    }
}

/**
 * AI Agent 小组件
 * 本地接口：http://127.0.0.1:{port}
 * 交互：消息列表（可滚动）+ 输入框 + 流式响应 + 停止按钮
 */
class AiAgentWidget extends WidgetBase {
    constructor(config) {
        super(config);
        this.type = 'ai-agent';
        this.port = (this.data && this.data.port) || '';
        this.messages = (this.data && Array.isArray(this.data.messages)) ? this.data.messages : [];
        this.busy = false;
        this.abortController = null;
    }

    get baseUrl() {
        return this.port ? 'http://127.0.0.1:' + this.port : '';
    }

    buildContent() {
        this.element.classList.add('widget-ai');

        // 头部：标题 + 连接状态
        this.headerEl = document.createElement('div');
        this.headerEl.className = 'widget-ai-header';
        this.headerEl.innerHTML = '<span>AI Agent</span>';

        this.statusEl = document.createElement('span');
        this.statusEl.className = 'widget-ai-status';
        this.dotEl = document.createElement('span');
        this.dotEl.className = 'widget-ai-dot';
        this.statusText = document.createElement('span');
        this.statusText.textContent = '未连接';
        this.statusEl.appendChild(this.dotEl);
        this.statusEl.appendChild(this.statusText);
        this.headerEl.appendChild(this.statusEl);

        this.element.appendChild(this.headerEl);

        // 无配置时显示配置提示
        if (!this.port) {
            this.renderNoConfig();
            return;
        }

        this.buildChat();
        this.checkConnection();
    }

    renderNoConfig() {
        const noConfig = document.createElement('div');
        noConfig.className = 'widget-ai-no-config';
        noConfig.innerHTML = '<span>未配置 AI Agent 端口</span>';
        const btn = document.createElement('button');
        btn.className = 'widget-ai-no-config-btn';
        btn.textContent = '去设置端口';
        btn.addEventListener('click', () => {
            if (this.ooo && typeof this.ooo.openWidgetSettings === 'function') {
                this.ooo.openWidgetSettings(this.id);
            }
        });
        noConfig.appendChild(btn);
        this.element.appendChild(noConfig);
    }

    buildChat() {
        // 端口标签
        this.portLabel = document.createElement('div');
        this.portLabel.className = 'widget-ai-port-label';
        this.portLabel.textContent = '127.0.0.1:' + this.port;
        this.portLabel.title = this.baseUrl;

        // 消息列表
        this.messagesEl = document.createElement('div');
        this.messagesEl.className = 'widget-ai-messages';

        // 输入行
        this.inputRow = document.createElement('div');
        this.inputRow.className = 'widget-ai-input-row';

        this.inputEl = document.createElement('input');
        this.inputEl.className = 'widget-ai-input';
        this.inputEl.type = 'text';
        this.inputEl.placeholder = '输入消息…';
        this.inputEl.maxLength = 500;

        this.sendBtn = document.createElement('button');
        this.sendBtn.className = 'widget-ai-send-btn';
        this.sendBtn.innerHTML = '➤';
        this.sendBtn.title = '发送';

        this.inputRow.appendChild(this.inputEl);
        this.inputRow.appendChild(this.sendBtn);

        this.element.appendChild(this.portLabel);
        this.element.appendChild(this.messagesEl);
        this.element.appendChild(this.inputRow);

        // 恢复历史消息
        this.messages.forEach(m => this.appendMessage(m.role, m.content, false));

        // 事件
        this.sendBtn.addEventListener('click', () => this.send());
        this.inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.send();
        });
    }

    appendMessage(role, content, save = true) {
        if (!this.messagesEl) return;
        const msg = document.createElement('div');
        msg.className = 'widget-ai-msg ' + (role === 'user' ? 'user' : 'ai');
        msg.textContent = content;
        this.messagesEl.appendChild(msg);
        this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
        if (save) {
            this.messages.push({ role: role, content: content });
            this.persist();
        }
    }

    async checkConnection() {
        if (!this.baseUrl) return;
        try {
            const controller = this.trackAbort(new AbortController());
            const timeout = setTimeout(() => controller.abort(), 3000);
            const resp = await fetch(this.baseUrl + '/health', { signal: controller.signal });
            clearTimeout(timeout);
            if (resp.ok) {
                this.dotEl.classList.add('online');
                this.statusText.textContent = '已连接';
            } else {
                this.dotEl.classList.remove('online');
                this.statusText.textContent = '离线';
            }
        } catch (e) {
            this.dotEl.classList.remove('online');
            this.statusText.textContent = '离线';
        }
    }

    async send() {
        const text = this.inputEl.value.trim();
        if (!text || this.busy || !this.baseUrl) return;

        this.inputEl.value = '';
        this.appendMessage('user', text);

        this.busy = true;
        this.sendBtn.classList.add('stop');
        this.sendBtn.innerHTML = '■';
        this.sendBtn.title = '停止';
        this.inputEl.disabled = true;

        this.abortController = this.trackAbort(new AbortController());

        // AI 回复气泡
        const aiMsg = document.createElement('div');
        aiMsg.className = 'widget-ai-msg ai';
        this.messagesEl.appendChild(aiMsg);

        // 光标
        const cursor = document.createElement('span');
        cursor.className = 'widget-ai-cursor';
        aiMsg.appendChild(cursor);

        let fullText = '';
        const self = this;

        const finish = (save = true) => {
            if (cursor.parentNode) cursor.remove();
            self.busy = false;
            self.sendBtn.classList.remove('stop');
            self.sendBtn.innerHTML = '➤';
            self.sendBtn.title = '发送';
            self.inputEl.disabled = false;
            if (save && fullText.trim()) {
                self.messages.push({ role: 'assistant', content: fullText.trim() });
                self.persist();
            }
        };

        try {
            // messages 已包含刚加入的用户消息，直接传递
            const payload = {
                messages: this.messages
            };

            const resp = await this.fetchAPI(this.baseUrl + '/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: this.abortController.signal
            });

            if (!resp.ok) {
                throw new Error('HTTP ' + resp.status);
            }

            // 尝试流式读取；失败则回退整段 JSON
            try {
                const reader = resp.body.getReader();
                const decoder = new TextDecoder('utf-8');
                let buffer = '';
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    buffer += decoder.decode(value, { stream: true });
                    // 简单增量处理：新增长度追加
                    const newLen = buffer.length;
                    if (newLen > fullText.length) {
                        fullText = buffer.slice(0, newLen);
                        aiMsg.textContent = fullText;
                        if (cursor.parentNode) aiMsg.appendChild(cursor);
                        self.messagesEl.scrollTop = self.messagesEl.scrollHeight;
                    }
                }
            } catch (streamErr) {
                // 非流式响应：整段 JSON { reply: "..." }
                const data = JSON.parse(await resp.text());
                fullText = data.reply || data.content || data.message || JSON.stringify(data);
                aiMsg.textContent = fullText;
            }

            finish(true);
        } catch (err) {
            if (err.name === 'AbortError') {
                // 用户点击停止：保留已生成内容
                if (fullText.trim()) {
                    this.messages.push({ role: 'assistant', content: fullText.trim() });
                    this.persist();
                }
                finish(false);
            } else {
                aiMsg.classList.add('error');
                aiMsg.textContent = '连接失败：' + err.message;
                finish(false);
            }
        }
    }

    destroy() {
        super.destroy();
    }
}

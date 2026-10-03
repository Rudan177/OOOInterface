// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

export const SearchMixin = {
    copySearchContent() {
        const searchInput = document.getElementById('search-input');
        if (searchInput && searchInput.value.trim()) {
            navigator.clipboard.writeText(searchInput.value.trim())
                .then(() => {
                    this.showNotification('复制');
                })
                .catch(err => {
                    console.error('复制失败:', err);
                    this.showNotification('复制失败');
                });
        } else {
            this.showNotification('搜索框为空');
        }
    },
    pasteToSearch() {
        const searchInput = document.getElementById('search-input');
        navigator.clipboard.readText()
            .then(text => {
                searchInput.value = text.trim();
                const clearBtn = document.querySelector('.search-clear-btn');
                if (clearBtn) {
                    clearBtn.style.display = searchInput.value.length > 0 ? 'flex' : 'none';
                }
                this.syncSearchAssistantUI(searchInput.value);
                this.showNotification('粘贴');
            })
            .catch(err => {
                console.error('粘贴失败:', err);
                this.showNotification('粘贴失败');
            });
    },
    handleScroll(e) {
        // 设置页面打开时，完全禁用滚动检测（避免触发壁纸模式）
        const settingsModal = document.getElementById('settings-modal');
        if (settingsModal && (settingsModal.classList.contains('show') || settingsModal.classList.contains('hiding'))) {
            return;
        }

        // Info框打开时，完全禁用滚动检测（避免误触壁纸模式）
        if (this.infoPopupOpen) {
            // 自动恢复：如果弹窗DOM已被外部移除，重置标志位
            if (!document.querySelector('.ooo-info-popup')) {
                this.infoPopupOpen = false;
            } else {
                return;
            }
        }

        // 节流：如果正在动画中，忽略新的滚动事件
        if (this.isAnimating) return;

        // 清除之前的动画定时器，允许打断
        if (this._animationTimeout) {
            clearTimeout(this._animationTimeout);
            this._animationTimeout = null;
        }

        // 向下滚动出现壁纸
        if (e.deltaY > 0 && !this.isScrolled) {
            this.showWallpaper();
        }
        // 向上滚动恢复
        else if (e.deltaY < 0 && this.isScrolled) {
            this.restoreHomepage();
        }
    },
    switchEngine(engine) {
        this.currentEngine = engine;
        // 引擎切换后建议来源改变,作废旧缓存
        this._suggestCache = null;

        // 更新按钮状态
        document.getElementById('google-engine').classList.toggle('active', engine === 'google');
        document.getElementById('bing-engine').classList.toggle('active', engine === 'bing');

        // 自动切换Logo（仅当用户没有手动更改过Logo，且Logo未被主题接管时）
        const themeLogoManaged = this.settings.themeEnabled
            && this.settings.themeAspects?.logo !== false
            && this.themeOverrides?.logo;
        if (!this.userChangedLogo && !themeLogoManaged && this.settings.logo !== 'default') {
            if (engine === 'google') {
                this.settings.logo = 'Google';
                this.settings.logoType = 'image';
            } else {
                this.settings.logo = 'Microsoft';
                this.settings.logoType = 'image';
            }
            this.applyLogo();
            this.saveSettings();
        } else if (this.settings.logo === 'auto') {
            // 自动模式下切换引擎时更新Logo
            this.applyLogo();
        }

        // 如果引擎锁定，保存到localStorage
        if (this.settings.engineLocked) {
            localStorage.setItem('oooEngineLocked', engine);
        }

        // 为按钮添加logo类名
        this.updateEngineButtonClasses();

        // 如果有搜索文字，立即搜索
        const searchInput = document.getElementById('search-input');
        if (searchInput.value.trim()) {
            this.performSearch(searchInput.value);
        }
    },
    performSearch(query) {
        if (!query.trim()) return;

        const trimmedQuery = query.trim();

        // 组件模式激活时（chip 在左，输入内容为纯参数），按模式执行
        if (this.searchCommandMode === 'web') {
            if (!trimmedQuery) {
                this.showNotification('请输入网址，例如：google.com');
                return;
            }
            this.openExternalUrl(trimmedQuery);
            this.searchCommandMode = null;
            return;
        }
        if (this.searchCommandMode === 'translate') {
            this.executeTranslateModeQuery(trimmedQuery);
            return;
        }

        // “/” 命令语法兜底路径（正常流程中前缀在输入空格时已被替换）：不进入搜索历史
        if (trimmedQuery.startsWith('/')) {
            this.executeSlashCommand(trimmedQuery);
            this.hideSearchCommandList();
            return;
        }

        this.addToSearchHistory(query);

        const lowerQuery = trimmedQuery.toLowerCase();

        if (lowerQuery.startsWith('网址/') || lowerQuery.startsWith('web/')) {
            let url = trimmedQuery.substring(trimmedQuery.indexOf('/') + 1).trim();

            if (!url) return;

            this.openExternalUrl(url);
            return;
        }

        let searchUrl;
        if (this.currentEngine === 'google') {
            searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        } else {
            searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
        }

        window.location.href = searchUrl;
    },
    openExternalUrl(urlText) {
        let url = (urlText || '').trim();
        if (!url) return;

        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        try {
            new URL(url);
            this.recordWebHistory(url);
            window.location.href = url;
        } catch (e) {
            this.showNotification('无效的URL地址');
        }
    },
    getSlashCommands() {
        return [
            { name: 'web', icon: 'language', desc: '打开网页' },
            { name: 'translate', icon: 'translate', desc: '翻译文本' }
        ];
    },
    isWebCommand(word) {
        return ['web', 'w', '网址'].includes((word || '').toLowerCase());
    },
    isTranslateCommand(word) {
        return ['translate', 't', '翻译'].includes((word || '').toLowerCase());
    },
    syncSearchAssistantUI(value) {
        if (typeof value !== 'string') value = '';

        if (this.searchCommandMode === 'web') {
            this.hideSearchCommandList();
            this.updateSearchModeChip();
            this.refreshSearchDropdownPanels();
            return;
        }

        if (this.searchCommandMode === 'translate') {
            this.hideSearchCommandList();
            this.lockTranslatePairFromInput(value);
            this.updateSearchModeChip();
            this.refreshSearchDropdownPanels();
            return;
        }

        if (value.startsWith('/')) {
            this.hideSearchHistory();

            // “/别名 + 空格”：把前缀替换为左侧 chip，剩余文本作为参数继续输入
            const entered = value.match(/^\/(\S+)\s([\s\S]*)$/);
            if (entered && (this.isWebCommand(entered[1]) || this.isTranslateCommand(entered[1]))) {
                const mode = this.isWebCommand(entered[1]) ? 'web' : 'translate';
                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                    searchInput.value = entered[2] || '';
                    const clearBtn = document.querySelector('.search-clear-btn');
                    if (clearBtn) {
                        clearBtn.style.display = searchInput.value.length > 0 ? 'flex' : 'none';
                    }
                }
                this.enterSearchCommandMode(mode);
                if (mode === 'translate') {
                    const restValue = searchInput ? searchInput.value : '';
                    this.lockTranslatePairFromInput(restValue);
                    this.updateSearchModeChip();
                    this.refreshSearchDropdownPanels();
                }
                return;
            }

            this.updateSearchModeChip();
            this.showSearchCommandList(value);
            return;
        }

        this.hideSearchCommandList();
        this.updateSearchModeChip();

        // 输入有效长度超过 4 且开启"热搜词建议":先同步展示历史作即时反馈,再调度拉取热搜
        // 中文每个字算 2 个有效字符(3-4 字即可触发),英文每字母算 1(5-6 字母触发)
        // 其余情况(≤4 字符或开关关闭)维持原有搜索历史逻辑
        const trimmedValue = value.trim();
        if (this.settings.searchSuggestions && this._effectiveLength(trimmedValue) > 4) {
            this.renderSearchSuggestions(trimmedValue, null);
            this.scheduleSearchSuggestions(trimmedValue);
            return;
        }
        this.cancelSearchSuggestions();
        if (this.settings.searchHistory && this.settings.searchHistoryItems.length > 0) {
            this.showSearchHistory(value);
        } else {
            this.hideSearchHistory();
        }
    },
    showSearchCommandList(currentInput = '') {
        if (!currentInput.startsWith('/')) {
            this.hideSearchCommandList();
            return;
        }

        // 只在第一个空格之前提供候选；出现空格说明已进入对应组件模式
        const partial = currentInput.slice(1);
        if (/\s/.test(partial)) {
            this.hideSearchCommandList();
            return;
        }

        const filter = partial.toLowerCase();
        const items = this.getSlashCommands().filter(cmd => {
            if (!filter) return true;
            if (cmd.name.toLowerCase().startsWith(filter)) return true;
            const extraAliases = this.isWebCommand(cmd.name)
                ? ['w', '网址']
                : (this.isTranslateCommand(cmd.name) ? ['t', '翻译'] : []);
            return extraAliases.some(alias => alias.toLowerCase().startsWith(filter));
        });

        if (items.length === 0) {
            this.hideSearchCommandList();
            return;
        }

        this.commandListState = { visible: true, items: items, highlight: -1 };
        this.renderSearchCommandItems();
        this.refreshSearchDropdownPanels();
    },
    hideSearchCommandList() {
        const container = document.getElementById('search-command-container');
        if (container) {
            container.classList.remove('show');
        }
        if (this.commandListState) {
            this.commandListState.visible = false;
            this.commandListState.highlight = -1;
        }
    },
    renderSearchCommandItems() {
        const list = document.querySelector('.search-command-list');
        if (!list || !this.commandListState) return;

        list.innerHTML = '';

        this.commandListState.items.forEach((cmd, index) => {
            const item = document.createElement('div');
            item.className = 'search-command-item' + (index === this.commandListState.highlight ? ' selected' : '');
            item.dataset.index = index;
            item.innerHTML = `
                <span class="search-command-icon material-icons">${cmd.icon}</span>
                <div class="search-command-info">
                    <span class="search-command-name">/${cmd.name}</span>
                    <span class="search-command-desc">${this.escapeHtml(cmd.desc)}</span>
                </div>
            `;
            list.appendChild(item);
        });
    },
    moveSearchCommandHighlight(delta) {
        const state = this.commandListState;
        if (!state || !state.visible || state.items.length === 0) return;

        const max = state.items.length - 1;
        state.highlight += delta;
        if (state.highlight > max) state.highlight = 0;
        if (state.highlight < 0) state.highlight = max;

        this.renderSearchCommandItems();
    },
    applySearchCommand(cmd) {
        if (!cmd) return;

        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = '';
            searchInput.focus();
        }
        const clearBtn = document.querySelector('.search-clear-btn');
        if (clearBtn) {
            clearBtn.style.display = 'none';
        }

        this.enterSearchCommandMode(this.isWebCommand(cmd.name) ? 'web' : 'translate');
    },
    enterSearchCommandMode(mode) {
        this.searchCommandMode = mode;
        this.translateSelectedPair = null;
        this.hideSearchCommandList();
        this.updateSearchModeChip();
        this.refreshSearchDropdownPanels();

        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.focus();
        }
        this.showNotification('已进入' + (mode === 'web' ? '网址' : '翻译') + '模式');
    },
    exitSearchCommandMode(clearInput = true) {
        this.searchCommandMode = null;
        this.translateSelectedPair = null;

        const searchInput = document.getElementById('search-input');
        if (clearInput && searchInput) {
            searchInput.value = '';
        }
        const clearBtn = document.querySelector('.search-clear-btn');
        if (clearBtn && searchInput) {
            clearBtn.style.display = searchInput.value.length > 0 ? 'flex' : 'none';
        }
        this.updateSearchModeChip();
        this.hideSearchCommandList();
    },
    updateSearchModeChip() {
        const chip = document.getElementById('search-mode-chip');
        if (!chip) return;

        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.classList.toggle('mode-active', !!this.searchCommandMode);
        }

        const iconEl = chip.querySelector('.search-mode-chip-icon');
        const textEl = chip.querySelector('.search-mode-chip-text');

        if (this.searchCommandMode === 'web') {
            iconEl.textContent = 'language';
            textEl.textContent = '网址';
            chip.classList.add('expanded');
        } else if (this.searchCommandMode === 'translate') {
            iconEl.textContent = 'translate';
            textEl.textContent = this.translateSelectedPair
                ? this.translateSelectedPair.from.label + '→' + this.translateSelectedPair.to.label
                : '翻译';
            chip.classList.add('expanded');
        } else {
            chip.classList.remove('expanded');
        }
    },
    refreshSearchDropdownPanels() {
        const container = document.getElementById('search-command-container');
        if (!container) return;

        const commandVisible = !!(this.commandListState && this.commandListState.visible);

        const commandList = container.querySelector('.search-command-list');
        if (commandList && !commandVisible) {
            commandList.innerHTML = '';
        }

        // 组装历史内容（仅 translate / web 模式且命令列表不可见时）
        const historyEntries = [];
        let historyKind = '';
        if (!commandVisible) {
            if (this.searchCommandMode === 'translate') {
                historyEntries.push(...this.getTranslateHistory());
                historyKind = 'translate';
            } else if (this.searchCommandMode === 'web') {
                historyEntries.push(...this.getWebHistory());
                historyKind = 'web';
            }
        }

        const historyList = container.querySelector('.translate-history-list');
        if (historyList) {
            historyList.innerHTML = '';

            // 行结构与原生搜索历史一致（search-history-item），含悬停出现的删除按钮
            if (historyKind === 'translate' && historyEntries.length > 0) {
                historyEntries.forEach(entry => {
                    if (!entry || !entry.pair) return;
                    const sides = String(entry.pair).split('-');
                    const fromE = this.resolveTranslateLanguage(sides[0]);
                    const toE = this.resolveTranslateLanguage(sides[1]);
                    const labels = (fromE ? fromE.label : sides[0]) + '→' + (toE ? toE.label : sides[1]);
                    const display = entry.pair + ' · ' + labels;

                    const row = document.createElement('div');
                    row.className = 'search-history-item';
                    row.dataset.pair = entry.pair;
                    row.innerHTML = `
                        <span class="search-history-text">${this.escapeHtml(display)}</span>
                        <button class="search-history-delete" data-kind="translate" data-pair="${this.escapeHtml(entry.pair)}">
                            ×
                        </button>
                    `;
                    historyList.appendChild(row);
                });
            } else if (historyKind === 'web' && historyEntries.length > 0) {
                historyEntries.forEach(entry => {
                    if (!entry || !entry.host) return;

                    const row = document.createElement('div');
                    row.className = 'search-history-item';
                    row.dataset.key = entry.key || '';
                    row.innerHTML = `
                        <span class="search-history-text">${this.escapeHtml(entry.host + (entry.rest || ''))}</span>
                        <button class="search-history-delete" data-kind="web" data-key="${this.escapeHtml(entry.key || '')}">
                            ×
                        </button>
                    `;
                    historyList.appendChild(row);
                });
            }
        }

        if (commandVisible || (historyList && historyList.children.length > 0)) {
            container.classList.add('show');
        } else {
            container.classList.remove('show');
        }
    },
    addToSearchHistory(query) {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return;

        this.settings.searchHistoryItems = this.settings.searchHistoryItems.filter(item => item !== trimmedQuery);
        this.settings.searchHistoryItems.unshift(trimmedQuery);

        if (this.settings.searchHistoryItems.length > 20) {
            this.settings.searchHistoryItems = this.settings.searchHistoryItems.slice(0, 20);
        }

        this.saveSettings();
    },
    showSearchHistory(currentInput = '') {
        if (document.body.classList.contains('scrolled')) {
            return;
        }

        const searchHistoryContainer = document.getElementById('search-history-container');
        const searchHistoryList = document.querySelector('.search-history-list');
        const quickAccessLinks = document.getElementById('quick-access-links');
        const engineButtons = document.querySelector('.engine-buttons');

        if (!searchHistoryContainer || !searchHistoryList) return;

        searchHistoryList.innerHTML = '';

        let historyItems = [...this.settings.searchHistoryItems];

        if (currentInput.trim()) {
            const inputLower = currentInput.toLowerCase();

            historyItems.sort((a, b) => {
                const aLower = a.toLowerCase();
                const bLower = b.toLowerCase();

                const scoreA = this.calculateRelevance(aLower, inputLower);
                const scoreB = this.calculateRelevance(bLower, inputLower);

                return scoreB - scoreA;
            });
        }

        historyItems.forEach((query) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'search-history-item';
            historyItem.dataset.query = query;
            historyItem.innerHTML = `
                <span class="search-history-text">${this.escapeHtml(query)}</span>
                <button class="search-history-delete" data-query="${this.escapeHtml(query)}">
                    ×
                </button>
            `;
            searchHistoryList.appendChild(historyItem);
        });

        searchHistoryContainer.classList.add('show');

        if (quickAccessLinks) {
            quickAccessLinks.style.transform = 'translateY(1000px)';
            quickAccessLinks.style.opacity = '0';
            quickAccessLinks.style.pointerEvents = 'none';
        }
    },
    hideSearchHistory() {
        const searchHistoryContainer = document.getElementById('search-history-container');
        const quickAccessLinks = document.getElementById('quick-access-links');
        const engineButtons = document.querySelector('.engine-buttons');

        if (searchHistoryContainer) {
            searchHistoryContainer.classList.remove('show');
        }

        if (quickAccessLinks) {
            quickAccessLinks.style.transform = '';
            quickAccessLinks.style.opacity = '';
            quickAccessLinks.style.pointerEvents = '';
        }
    },
    removeFromSearchHistory(query) {
        this.settings.searchHistoryItems = this.settings.searchHistoryItems.filter(item => item !== query);
        this.saveSettings();
        // 走统一入口重渲染,使"历史 + 热搜"合并列表保持一致
        this.syncSearchAssistantUI(document.getElementById('search-input').value);
    },
    calculateRelevance(text, query) {
        if (!query) return 0;

        let score = 0;

        if (text.startsWith(query)) {
            score += 10;
        }

        if (text.includes(query)) {
            score += 5;
        }

        const words = query.split(' ');
        words.forEach(word => {
            if (text.includes(word)) {
                score += 2;
            }
        });

        return score;
    },
    _effectiveLength(str) {
        const s = str || '';
        let len = 0;
        for (let i = 0; i < s.length; i++) {
            const c = s.charCodeAt(i);
            // CJK Unified Ideographs U+4E00-U+9FFF
            // Hiragana & Katakana U+3040-U+30FF
            // CJK Symbols & Punctuation U+3000-U+303F
            if ((c >= 0x4E00 && c <= 0x9FFF) || (c >= 0x3000 && c <= 0x30FF)) {
                len += 2;
            } else {
                len += 1;
            }
        }
        return len;
    },
    calculateCombinedScore(text, query, kind) {
        const a = String(text).toLowerCase();
        const b = String(query).toLowerCase();
        let score = this.calculateRelevance(a, b);
        if (kind === 'history') {
            if (a === b) score += 100;
            score += 1;
        }
        return score;
    },
    cancelSearchSuggestions() {
        if (this.suggestDebounceTimer) {
            clearTimeout(this.suggestDebounceTimer);
            this.suggestDebounceTimer = null;
        }
        this._suggestSeq += 1;
    },
    scheduleSearchSuggestions(query) {
        if (this.suggestDebounceTimer) {
            clearTimeout(this.suggestDebounceTimer);
            this.suggestDebounceTimer = null;
        }
        const seq = ++this._suggestSeq;

        this.suggestDebounceTimer = setTimeout(async () => {
            this.suggestDebounceTimer = null;
            if (seq !== this._suggestSeq) return;

            const input = document.getElementById('search-input');
            if (document.body.classList.contains('scrolled') || !input || input.value.trim() !== query) {
                return;
            }

            // 同引擎同查询 60 秒内直接复用缓存,避免聚焦/重复输入造成无谓请求
            let suggestions = null;
            const cache = this._suggestCache;
            if (cache && cache.engine === this.currentEngine && cache.query === query && (Date.now() - cache.ts < 60000)) {
                suggestions = cache.items;
            } else {
                try {
                    suggestions = await this.fetchSearchSuggestions(query);
                    this._suggestCache = { engine: this.currentEngine, query: query, items: suggestions, ts: Date.now() };
                } catch (err) {
                    suggestions = [];
                }
            }

            if (seq !== this._suggestSeq) return;
            const container = document.getElementById('search-history-container');
            if (document.body.classList.contains('scrolled') || !container) {
                return;
            }
            // 用户已点击外部关闭或移开焦点:本次下拉不应被异步结果重新打开
            const stillOpen = container.classList.contains('show');
            const inputFocused = document.activeElement === document.getElementById('search-input');
            if (!stillOpen && !inputFocused) {
                return;
            }
            this.renderSearchSuggestions(query, suggestions);
        }, 250);
    },
    async fetchSearchSuggestions(query) {
        const trimmed = String(query || '').trim();
        if (!trimmed) return [];

        // 最简 URL,不传 locale 参数,避免 mkt/hl 对结果的干扰
        const params = 'query=' + encodeURIComponent(trimmed);
        const bingUrl = 'https://www.bing.com/osjson.aspx?' + params;
        const googleUrl = 'https://suggestqueries.google.com/complete/search?client=firefox&q=' + params;

        // 先试 Bing
        let response;
        try {
            response = await this.slashFetch(bingUrl);
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data) && Array.isArray(data[1]) && data[1].length > 0) {
                    return data[1]
                        .map(item => (Array.isArray(item) ? (item[0] || '') : item))
                        .map(item => String(item).trim())
                        .filter(item => item)
                        .slice(0, 10);
                }
                console.warn('[热搜建议] Bing 未返回建议,回退 Google');
            } else {
                console.warn('[热搜建议] Bing HTTP', response.status, '| 回退 Google');
            }
        } catch (err) {
            console.warn('[热搜建议] Bing 不可用,回退 Google:', err.message);
        }

        // 回退 Google
        try {
            response = await this.slashFetch(googleUrl);
            if (!response.ok) {
                console.warn('[热搜建议] Google HTTP', response.status, '|', googleUrl);
                throw new Error('热搜建议接口响应异常 (HTTP ' + response.status + ')');
            }
            const data = await response.json();
            if (!Array.isArray(data) || !Array.isArray(data[1])) {
                console.warn('[热搜建议] 非预期响应格式', typeof data, Object.keys(data || {}));
                throw new Error('热搜建议接口解析失败');
            }
            return data[1]
                .map(item => (Array.isArray(item) ? (item[0] || '') : item))
                .map(item => String(item).trim())
                .filter(item => item)
                .slice(0, 10);
        } catch (err) {
            throw err;
        }
    },
    renderSearchSuggestions(query, suggestions) {
        if (document.body.classList.contains('scrolled')) return;

        const searchHistoryContainer = document.getElementById('search-history-container');
        const searchHistoryList = document.querySelector('.search-history-list');
        const quickAccessLinks = document.getElementById('quick-access-links');

        if (!searchHistoryContainer || !searchHistoryList) return;

        const q = String(query || '').trim();
        const rows = [];

        // 历史项:仅搜索历史开关开启时混入(搜索历史本身已保证去重,无需额外检查)
        if (this.settings.searchHistory && Array.isArray(this.settings.searchHistoryItems)) {
            this.settings.searchHistoryItems.forEach(raw => {
                const text = String(raw || '').trim();
                if (!text) return;
                rows.push({ text: text, kind: 'history' });
            });
        }

        // 热搜建议项:与历史同词的项也保留,由排序规则决定先后(同词历史 +100 分必排最上)
        if (Array.isArray(suggestions) && this.settings.searchSuggestions) {
            suggestions.forEach(raw => {
                const text = String(raw || '').trim();
                if (!text) return;
                rows.push({ text: text, kind: 'suggestion' });
            });
        }

        if (rows.length === 0) {
            this.hideSearchHistory();
            return;
        }

        if (q) {
            rows.sort((a, b) => {
                const scoreA = this.calculateCombinedScore(a.text, q, a.kind);
                const scoreB = this.calculateCombinedScore(b.text, q, b.kind);
                return scoreB - scoreA;
            });
        }

        searchHistoryList.innerHTML = '';

        rows.forEach(row => {
            const item = document.createElement('div');
            item.className = 'search-history-item' + (row.kind === 'suggestion' ? ' search-suggestion-item' : '');
            item.dataset.query = row.text;

            if (row.kind === 'history') {
                item.innerHTML = `
                    <span class="search-history-text">${this.escapeHtml(row.text)}</span>
                    <button class="search-history-delete" data-query="${this.escapeHtml(row.text)}">
                        ×
                    </button>
                `;
            } else {
                item.innerHTML = `
                    <span class="material-icons md3-icon search-suggestion-trend">trending_up</span>
                    <span class="search-history-text">${this.escapeHtml(row.text)}</span>
                    <span class="search-suggestion-badge">热搜</span>
                `;
            }
            searchHistoryList.appendChild(item);
        });

        searchHistoryContainer.classList.add('show');

        if (quickAccessLinks) {
            quickAccessLinks.style.transform = 'translateY(1000px)';
            quickAccessLinks.style.opacity = '0';
            quickAccessLinks.style.pointerEvents = 'none';
        }
    },
        escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    updateEngineButtonClasses() {
        // 移除所有logo类名
        const googleBtn = document.getElementById('google-engine');
        const bingBtn = document.getElementById('bing-engine');

        const logoClasses = ['logo-google', 'logo-microsoft', 'logo-apple', 'logo-huawei', 'logo-custom', 'logo-text'];
        logoClasses.forEach(logoClass => {
            googleBtn.classList.remove(logoClass);
            bingBtn.classList.remove(logoClass);
        });

        // 添加当前logo类名
        let logoClass;
        if (this.settings.logo === 'text-logo') {
            logoClass = 'logo-text';
        } else if (this.settings.customLogos.some(logo => logo.name === this.settings.logo)) {
            logoClass = 'logo-custom';
        } else if (this.settings.logo === 'default') {
            logoClass = 'logo-default';
        } else if (this.settings.logo === 'auto') {
            // 自动模式下使用Google的样式
            logoClass = 'logo-google';
        } else {
            logoClass = `logo-${this.settings.logo.toLowerCase()}`;
        }

        googleBtn.classList.add(logoClass);
        bingBtn.classList.add(logoClass);

        // 确保按钮状态正确
        googleBtn.classList.toggle('active', this.currentEngine === 'google');
        bingBtn.classList.toggle('active', this.currentEngine === 'bing');
    },
};

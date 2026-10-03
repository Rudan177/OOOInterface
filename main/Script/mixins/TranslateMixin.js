// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

import { ProxyManager } from '../proxy.js';
import { TRANSLATE_LANGUAGES } from '../translate-shared.js';

export const TranslateMixin = {
    lockTranslatePairFromInput(value) {
        if (this.translateSelectedPair || !value) return;

        const spIndex = value.search(/\s/);
        if (spIndex === -1) return; // 尚未出现空格，等待继续输入

        const pair = this.resolveLanguagePair(value.slice(0, spIndex));
        if (!pair) return; // 无法解析时保留原样，交由 Enter 时提示

        this.translateSelectedPair = pair;
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = value.slice(spIndex).replace(/^\s+/, '');
            const clearBtn = document.querySelector('.search-clear-btn');
            if (clearBtn) {
                clearBtn.style.display = searchInput.value.length > 0 ? 'flex' : 'none';
            }
        }
    },
    resolveLanguagePair(pairText) {
        const parts = (pairText || '').toLowerCase().split('-').filter(Boolean);
        if (parts.length === 0) return null;

        let fromEntry;
        let toEntry;
        if (parts.length >= 2) {
            fromEntry = this.resolveTranslateLanguage(parts[0]);
            toEntry = this.resolveTranslateLanguage(parts[1]);
        } else {
            fromEntry = this.resolveTranslateLanguage('auto');
            toEntry = this.resolveTranslateLanguage(parts[0]);
        }
        if (!fromEntry || !toEntry) return null;

        return { raw: fromEntry.key + '-' + toEntry.key, from: fromEntry, to: toEntry };
    },
    getTranslateHistory() {
        try {
            return JSON.parse(localStorage.getItem('oooTranslateHistory') || '[]') || [];
        } catch (e) {
            return [];
        }
    },
    setTranslateHistory(list) {
        localStorage.setItem('oooTranslateHistory', JSON.stringify(list || []));
    },
    recordTranslateHistory(fromEntry, toEntry) {
        if (!fromEntry || !toEntry) return;

        let list = this.getTranslateHistory();
        const raw = fromEntry.key + '-' + toEntry.key;
        list = list.filter(item => item && item.pair !== raw);
        list.unshift({ pair: raw });
        if (list.length > 12) {
            list.length = 12;
        }
        this.setTranslateHistory(list);
    },
    applyTranslateHistoryPair(pairRaw) {
        if (this.searchCommandMode !== 'translate') {
            this.enterSearchCommandMode('translate');
        }

        const pair = this.resolveLanguagePair((pairRaw || '').replace(/→/g, '-'));
        if (!pair) {
            this.showNotification('语言对不可用：' + pairRaw);
            return;
        }

        this.translateSelectedPair = pair;
        this.updateSearchModeChip();
        this.refreshSearchDropdownPanels();

        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.focus();
        }
        this.showNotification('已选择 ' + pair.from.label + '→' + pair.to.label);
    },
    getWebHistory() {
        try {
            return JSON.parse(localStorage.getItem('oooWebCommandHistory') || '[]') || [];
        } catch (e) {
            return [];
        }
    },
    setWebHistory(list) {
        localStorage.setItem('oooWebCommandHistory', JSON.stringify(list || []));
    },
    recordWebHistory(urlText) {
        let parsed;
        try {
            parsed = new URL(urlText);
        } catch (e) {
            return;
        }

        let list = this.getWebHistory();
        const rest = (parsed.pathname === '/' && !parsed.search) ? '' : parsed.pathname + parsed.search;
        const key = parsed.origin + (rest || '/');

        list = list.filter(item => item && item.key !== key);
        list.unshift({
            key: key,
            host: parsed.host.replace(/^www\./, ''),
            rest: rest
        });
        if (list.length > 12) {
            list.length = 12;
        }
        this.setWebHistory(list);
    },
    applyWebHistoryEntry(entry) {
        if (!entry || !entry.host) return;

        if (this.searchCommandMode !== 'web') {
            this.enterSearchCommandMode('web');
        }

        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = entry.host + (entry.rest || '');
            const clearBtn = document.querySelector('.search-clear-btn');
            if (clearBtn) {
                clearBtn.style.display = 'flex';
            }
            searchInput.focus();
        }
    },
    async executeTranslateModeQuery(rawText) {
        const text = (rawText || '').trim();

        if (!text) return;

        if (!this.translateSelectedPair) {
            const inlineMatch = text.match(/^(\S+)\s+([\s\S]+)$/);
            if (inlineMatch) {
                const inlinePair = this.resolveLanguagePair(inlineMatch[1]);
                if (inlinePair) {
                    this.translateSelectedPair = inlinePair;
                    this.updateSearchModeChip();
                    await this.runTranslateFlow(inlineMatch[2], inlinePair);
                    return;
                }
            }
            this.showNotification('请输入语言对和文本，例如：sc-jp 你好');
            return;
        }

        await this.runTranslateFlow(text, this.translateSelectedPair);
    },
    async runTranslateFlow(text, pair) {
        try {
            const result = await this.translateText(text, pair.from, pair.to);
            if (!result) {
                throw new Error('未获得翻译结果');
            }

            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.value = result;
                const clearBtn = document.querySelector('.search-clear-btn');
                if (clearBtn) {
                    clearBtn.style.display = 'flex';
                }
            }
            this.recordTranslateHistory(pair.from, pair.to);
            this.exitSearchCommandMode(false);

            navigator.clipboard.writeText(result).then(() => {
                this.showNotification('翻译完成，结果已输出并复制');
            }).catch(() => {
                this.showNotification('翻译完成，但复制到剪贴板失败');
            });
        } catch (err) {
            this.showNotification('翻译失败：' + err.message);
        }
    },
    async executeSlashCommand(trimmedQuery) {
        const match = trimmedQuery.slice(1).match(/^(\S*)(?:\s+([\s\S]*))?$/);
        if (!match) return;

        const word = match[1] || '';

        if (this.isWebCommand(word)) {
            const url = (match[2] || '').replace(/\s+/g, '');
            if (!url) {
                this.showNotification('请输入网址，例如：/w google.com');
                return;
            }
            this.openExternalUrl(url);
            return;
        }

        if (this.isTranslateCommand(word)) {
            const rest = (match[2] || '').trim();
            if (!rest) {
                this.showNotification('请输入语言对和文本，例如：/t sc-jp 你好');
                return;
            }

            const parts = rest.match(/^(\S+)\s+([\s\S]+)$/);
            if (!parts) {
                if (/^[^\s]+-[^\s]+$/.test(rest)) {
                    this.showNotification('请输入要翻译的文本');
                } else {
                    this.showNotification('格式：/t 源语言-目标语言 文本，例如：/t sc-jp 你好');
                }
                return;
            }

            const pair = this.resolveLanguagePair(parts[1]);
            if (!pair) {
                const sides = parts[1].toLowerCase().split('-');
                this.showNotification('不支持的语言：' + sides.join(' / '));
                return;
            }

            await this.runTranslateFlow(parts[2], pair);
            return;
        }

        this.showNotification('未知命令：“/' + word + '”，可用命令：web(w)、translate(t)');
    },
    resolveTranslateLanguage(rawCode) {
        const code = (rawCode || '').toLowerCase().trim();
        if (!code) return null;

        // 语言表已提取到 translate-shared.js，与侧边栏面板共用（Stage 9）
        return TRANSLATE_LANGUAGES.find(entry => entry.key === code || entry.aliases.includes(code)) || null;
    },
    async translateText(text, fromEntry, toEntry) {
        if (this.currentEngine === 'bing') {
            try {
                return await this.fetchBingTranslate(text, fromEntry.m, toEntry.m, false);
            } catch (err) {
                console.warn('[搜索框翻译] Microsoft 翻译失败，回退到 Google 翻译:', err.message);
                this.showNotification('Microsoft 翻译不可用，已改用 Google 翻译');
            }
        }
        return await this.fetchGoogleTranslate(text, fromEntry.g, toEntry.g);
    },
    async slashFetch(url, options) {
        try {
            return await fetch(url, options);
        } catch (err) {
            if (typeof ProxyManager !== 'undefined' && ProxyManager.isProxyEnabled()) {
                return await ProxyManager.proxiedFetch(url, options);
            }
            throw err;
        }
    },
    async fetchGoogleTranslate(text, sl, tl) {
        const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=' +
            encodeURIComponent(sl) + '&tl=' + encodeURIComponent(tl) + '&dt=t&q=' + encodeURIComponent(text);

        const response = await this.slashFetch(url);
        if (!response.ok) {
            throw new Error('Google 翻译服务响应异常 (HTTP ' + response.status + ')');
        }

        const data = await response.json();
        if (!Array.isArray(data) || !Array.isArray(data[0])) {
            throw new Error('Google 翻译结果解析失败');
        }

        return data[0].map(segment => (segment && segment[0]) ? segment[0] : '').join('');
    },
    async getBingTranslateAuth(forceRefresh = false) {
        if (!forceRefresh) {
            try {
                const cached = JSON.parse(localStorage.getItem('oooBingTranslateAuth') || 'null');
                if (cached && cached.token && cached.ig && Date.now() - cached.ts < 20 * 60 * 1000) {
                    return cached;
                }
            } catch (e) { /* 缓存损坏则重新获取 */ }
        }

        const response = await this.slashFetch('https://www.bing.com/');
        const html = await response.text();

        const igMatch = html.match(/IG:"([^"]+)"/);
        const tokenMatch = html.match(/params_AbusePreventionHelper\s*=\s*\[\s*\d+\s*,\s*"([^"]+)"/);

        if (!igMatch || !tokenMatch) {
            throw new Error('无法获取 Microsoft 翻译凭证');
        }

        const auth = { ig: igMatch[1], token: tokenMatch[1], ts: Date.now() };
        localStorage.setItem('oooBingTranslateAuth', JSON.stringify(auth));
        return auth;
    },
    async fetchBingTranslate(text, fromCode, toCode, forceNewAuth) {
        try {
            const auth = await this.getBingTranslateAuth(!!forceNewAuth);

            const body = new URLSearchParams({
                from: fromCode,
                to: toCode,
                text: text,
                token: auth.token,
                key: auth.ig
            }).toString();

            const response = await this.slashFetch('https://www.bing.com/ttranslatev3?isTanslateReq=true', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body
            });

            if (!response.ok) {
                throw new Error('Microsoft 翻译服务响应异常 (HTTP ' + response.status + ')');
            }

            const data = await response.json();
            if (Array.isArray(data) && data[0] && Array.isArray(data[0].translations)) {
                return data[0].translations.map(item => item.text || '').join('');
            }
            throw new Error('Microsoft 翻译结果解析失败');
        } catch (err) {
            // 凭证失效等情况：强制刷新一次后重试
            if (!forceNewAuth) {
                return await this.fetchBingTranslate(text, fromCode, toCode, true);
            }
            throw err;
        }
    },
    performGoogleLucky() {
        const searchInput = document.getElementById('search-input');
        const query = searchInput.value.trim();

        if (!query) {
            this.showNotification('请输入搜索内容');
            return;
        }

        this.addToSearchHistory(query);

        const luckyUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&btnI=1`;
        window.location.href = luckyUrl;
    },
};

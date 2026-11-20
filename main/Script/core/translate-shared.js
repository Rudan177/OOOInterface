/**
 * 翻译语言表与语言对解析函数，主页面与侧边栏面板共用同一份数据来源。
 * 只共享语言数据；两侧的翻译引擎（Google / Microsoft 直连与代理回退）实现不同，仍各自保留。
 */

export const TRANSLATE_LANGUAGES = [
    { key: 'auto', label: '自动检测', aliases: ['auto', 'a', '自动'], g: 'auto', m: 'auto-detect' },
    { key: 'sc', label: '简体中文', aliases: ['sc', 'zh-cn', 'zh', 'cn', '简体', '中文'], g: 'zh-CN', m: 'zh-Hans' },
    { key: 'tc', label: '繁体中文', aliases: ['tc', 'zh-tw', 'tw', '繁体'], g: 'zh-TW', m: 'zh-Hant' },
    { key: 'en', label: '英语', aliases: ['en', 'english', '英'], g: 'en', m: 'en' },
    { key: 'ja', label: '日语', aliases: ['jp', 'jpn', 'ja', '日'], g: 'ja', m: 'ja' },
    { key: 'ko', label: '韩语', aliases: ['kr', 'kor', 'ko', '韩'], g: 'ko', m: 'ko' },
    { key: 'fr', label: '法语', aliases: ['fr', '法'], g: 'fr', m: 'fr' },
    { key: 'de', label: '德语', aliases: ['de', '德'], g: 'de', m: 'de' },
    { key: 'es', label: '西班牙语', aliases: ['es', '西'], g: 'es', m: 'es' },
    { key: 'ru', label: '俄语', aliases: ['ru', '俄'], g: 'ru', m: 'ru' },
    { key: 'pt', label: '葡萄牙语', aliases: ['pt', '葡'], g: 'pt', m: 'pt' },
    { key: 'it', label: '意大利语', aliases: ['it', '意'], g: 'it', m: 'it' },
    { key: 'th', label: '泰语', aliases: ['th', '泰'], g: 'th', m: 'th' },
    { key: 'vi', label: '越南语', aliases: ['vi', '越'], g: 'vi', m: 'vi' },
    { key: 'ar', label: '阿拉伯语', aliases: ['ar', '阿'], g: 'ar', m: 'ar' }
];;

// 把 'sc' / 'zh-cn' / '简体' 之类的写法解析成语言表条目，认不出返回 null。
export function resolveTranslateLanguage(rawCode) {
    const code = (rawCode || '').toLowerCase().trim();
    if (!code) return null;
    return TRANSLATE_LANGUAGES.find(entry => entry.key === code || entry.aliases.includes(code)) || null;
}

// 解析语言对文本：'sc-jp'（省略源语言则为 'jp'，默认源语言 auto）。
export function resolveLanguagePair(pairText) {
    const parts = (pairText || '').toLowerCase().split('-').filter(Boolean);
    if (parts.length === 0) return null;

    let fromEntry;
    let toEntry;
    if (parts.length >= 2) {
        fromEntry = resolveTranslateLanguage(parts[0]);
        toEntry = resolveTranslateLanguage(parts[1]);
    } else {
        fromEntry = resolveTranslateLanguage('auto');
        toEntry = resolveTranslateLanguage(parts[0]);
    }
    if (!fromEntry || !toEntry) return null;

    return { raw: fromEntry.key + '-' + toEntry.key, from: fromEntry, to: toEntry };
}

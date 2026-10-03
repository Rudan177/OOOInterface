// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

export const ImportExportMixin = {
exportSettingsAsMarkdown () {
    const version = (typeof VERSION !== 'undefined') ? VERSION : 'unknown';
    const now = new Date();
    const timeStr = now.toLocaleString('zh-CN', { hour12: false });
    const timestamp = now.toISOString();

    const json = JSON.stringify(this.settings, null, 2);
    const md = [
        '# OOOInterface 配置备份',
        '',
        '- 导出时间：' + timeStr,
        '- ISO 时间戳：' + timestamp,
        '- 版本：' + version,
        '',
        '```json',
        json,
        '```'
    ].join('\n');

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'OOOInterface-Settings-' + timestamp.replace(/[:T]/g, '-').slice(0, 19) + '.md';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        URL.revokeObjectURL(url);
        if (a.parentNode) a.parentNode.removeChild(a);
    }, 0);
    this.showNotification('配置已导出为 Markdown');
},
importSettingsFromMarkdown (file) {
    const self = this;
    if (!file || !file.name.toLowerCase().endsWith('.md')) {
        this.showNotification('请选择 .md 文件');
        return;
    }
    const reader = new FileReader();
    reader.onload = function () {
        try {
            const text = reader.result;
            // 提取 ```json ... ``` 块
            const match = text.match(/```(?:json)?\s*\n([\s\S]*?)\n\s*```/);
            if (!match) throw new Error('未找到 ```json 代码块，文件格式不正确');
            const settings = JSON.parse(match[1].trim());
            if (!settings || typeof settings !== 'object') throw new Error('JSON 解析失败，根节点不是对象');

            // 写入并立即保存
            self.settings = settings;
            self.saveSettings();
            self.applySettings();
            self.showNotification('配置导入成功，已刷新页面');
        } catch (e) {
            self.showNotification('导入失败：' + (e.message || '未知错误'));
            console.error('[importSettingsFromMarkdown]', e);
        }
    };
    reader.onerror = function () {
        self.showNotification('文件读取失败');
    };
    reader.readAsText(file);
},
};

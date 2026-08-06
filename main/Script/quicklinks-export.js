/**
 * OOOInterface 快速访问链接导出模块
 * 将快速访问链接导出为 JSON 文件并触发下载
 */
var QuickLinksExporter = (function () {
    'use strict';

    /**
     * 构建导出数据（JSON 结构）
     * @param {Object} ooo OOOInterface 实例
     * @returns {Object} 导出数据对象
     */
    function buildExportData(ooo) {
        var links = [];
        if (ooo && ooo.settings && Array.isArray(ooo.settings.quickLinks)) {
            links = ooo.settings.quickLinks.filter(function (link) {
                return link && link.name && link.url;
            }).map(function (link) {
                return { name: link.name, url: link.url };
            });
        }

        return {
            app: 'OOOInterface',
            type: 'quick-links',
            version: (typeof VERSION !== 'undefined') ? VERSION : '',
            exportedAt: new Date().toISOString(),
            links: links
        };
    }

    /**
     * 生成导出文件名，如 OOOInterface-QuickLinks-20260806-153000.json
     */
    function buildFileName() {
        var now = new Date();
        var pad = function (n) {
            return n < 10 ? '0' + n : '' + n;
        };
        return 'OOOInterface-QuickLinks-' +
            now.getFullYear() +
            pad(now.getMonth() + 1) +
            pad(now.getDate()) + '-' +
            pad(now.getHours()) +
            pad(now.getMinutes()) +
            pad(now.getSeconds()) +
            '.json';
    }

    /**
     * 将数据对象以 JSON 格式下载
     */
    function downloadJson(data, filename) {
        var json = JSON.stringify(data, null, 2);
        var blob = new Blob([json], { type: 'application/json;charset=utf-8' });
        var url = URL.createObjectURL(blob);

        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        setTimeout(function () {
            URL.revokeObjectURL(url);
            if (a.parentNode) {
                a.parentNode.removeChild(a);
            }
        }, 0);
    }

    /**
     * 导出当前快速访问链接
     * @param {Object} ooo OOOInterface 实例
     * @returns {boolean} 是否成功导出
     */
    function exportQuickLinks(ooo) {
        var data = buildExportData(ooo);

        if (!data.links.length) {
            if (ooo && typeof ooo.showNotification === 'function') {
                ooo.showNotification('没有可导出的快速访问链接');
            }
            return false;
        }

        downloadJson(data, buildFileName());

        if (ooo && typeof ooo.showNotification === 'function') {
            ooo.showNotification('已导出 ' + data.links.length + ' 个快速访问链接');
        }
        return true;
    }

    return {
        buildExportData: buildExportData,
        exportQuickLinks: exportQuickLinks
    };
})();

/**
 * OOOInterface 快速访问链接导入模块
 * 支持导入导出生成的 JSON 文件（含 { links: [...] } 结构）或纯链接数组
 */
var QuickLinksImporter = (function () {
    'use strict';

    /**
     * 解析 JSON 文本，提取链接列表
     * @param {string} text JSON 文本
     * @returns {Array} [{name, url}] 列表，解析失败时抛出 Error
     */
    function parseImportJson(text) {
        var data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            throw new Error('JSON 格式错误，无法解析');
        }

        var rawLinks;
        if (Array.isArray(data)) {
            rawLinks = data;
        } else if (data && Array.isArray(data.links)) {
            rawLinks = data.links;
        } else {
            throw new Error('JSON 结构不正确，未找到链接列表');
        }

        var links = [];
        rawLinks.forEach(function (item) {
            if (item && typeof item === 'object') {
                var name = typeof item.name === 'string' ? item.name.trim() : '';
                var url = typeof item.url === 'string' ? item.url.trim() : '';
                if (name && url) {
                    links.push({ name: name, url: url });
                }
            }
        });

        return links;
    }

    /**
     * 将链接列表合并到现有快速访问链接（同名同址去重）
     * @param {Array} existing 现有链接列表
     * @param {Array} incoming 待导入链接列表
     * @returns {{added: Array, skipped: number}}
     */
    function mergeLinks(existing, incoming) {
        var seen = {};
        (existing || []).forEach(function (link) {
            if (link && link.name && link.url) {
                seen[link.name + '\n' + link.url] = true;
            }
        });

        var added = [];
        var skipped = 0;
        (incoming || []).forEach(function (link) {
            var key = link.name + '\n' + link.url;
            if (seen[key]) {
                skipped++;
            } else {
                seen[key] = true;
                added.push(link);
            }
        });

        return { added: added, skipped: skipped };
    }

    /**
     * 导入 JSON 文本到快速访问链接
     * @param {Object} ooo OOOInterface 实例
     * @param {string} text JSON 文本
     * @returns {boolean} 是否导入成功
     */
    function importQuickLinks(ooo, text) {
        var notify = function (msg) {
            if (ooo && typeof ooo.showNotification === 'function') {
                ooo.showNotification(msg);
            }
        };

        if (!ooo || !ooo.settings || !Array.isArray(ooo.settings.quickLinks)) {
            return false;
        }

        var links;
        try {
            links = parseImportJson(text);
        } catch (e) {
            notify('导入失败：' + e.message);
            return false;
        }

        if (!links.length) {
            notify('文件中没有有效的快速访问链接');
            return false;
        }

        var result = mergeLinks(ooo.settings.quickLinks, links);
        if (!result.added.length) {
            notify('导入的链接均已存在，无需重复导入');
            return false;
        }

        result.added.forEach(function (link) {
            ooo.settings.quickLinks.push(link);
        });

        if (typeof ooo.saveSettings === 'function') {
            ooo.saveSettings();
        }

        var msg = '已导入 ' + result.added.length + ' 个快速访问链接';
        if (result.skipped > 0) {
            msg += '，跳过 ' + result.skipped + ' 个重复项';
        }
        notify(msg);
        return true;
    }

    return {
        parseImportJson: parseImportJson,
        mergeLinks: mergeLinks,
        importQuickLinks: importQuickLinks
    };
})();

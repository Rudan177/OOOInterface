/**
 * 升级工具小组件
 * 支持小/大/超大三种尺寸，通过 OUA 后端接口检查更新
 * 挂载后自动检查一次；超大尺寸底部有手动检查按钮
 */
class UpgradeToolWidget extends WidgetBase {
    constructor(config) {
        super(config);
        this.type = 'upgrade-tool';
        this.installDir = '';
        this.branchLabel = '';
        this.dataSource = '';
        this.localVersion = '';
        this.remoteVersion = '';
        this.hasUpdate = false;
        this.isChecking = false;
        this.apiUrl = 'http://127.0.0.1:8964';
        this.activeBase = null;
    }

    buildContent() {
        this.element.classList.add('widget-upgrade-tool');
        this._isSquare = (this.size === 'square');
        this._isSuper = (this.size === 'super');

        // 先构建布局（创建 DOM 元素），再加载数据
        if (this._isSquare) {
            this._buildSquareLayout();
        } else if (this.size === 'rectangle') {
            this._buildRectLayout();
        } else {
            this._buildSuperLayout();
        }

        // 布局渲染后自动检查一次
        this._loadData();
    }

    /* -------- 布局 -------- */

    _buildSquareLayout() {
        // 上方：本地版本
        const localRow = document.createElement('div');
        localRow.className = 'widget-upgrade-tool-row';
        const localLabel = document.createElement('span');
        localLabel.className = 'widget-upgrade-tool-label';
        localLabel.textContent = '本地版本';
        const localVal = document.createElement('span');
        localVal.className = 'widget-upgrade-tool-val';
        localVal.id = 'localVer';
        localVal.textContent = '—';
        localRow.appendChild(localLabel);
        localRow.appendChild(localVal);
        this.element.appendChild(localRow);

        // 下方：云端版本
        const remoteRow = document.createElement('div');
        remoteRow.className = 'widget-upgrade-tool-row';
        const remoteLabel = document.createElement('span');
        remoteLabel.className = 'widget-upgrade-tool-label';
        remoteLabel.textContent = '云端版本';
        const remoteVal = document.createElement('span');
        remoteVal.className = 'widget-upgrade-tool-val';
        remoteVal.id = 'remoteVer';
        remoteVal.textContent = '—';
        remoteRow.appendChild(remoteLabel);
        remoteRow.appendChild(remoteVal);
        this.element.appendChild(remoteRow);
    }

    _buildRectLayout() {
        this._wrap = document.createElement('div');
        this._wrap.className = 'widget-upgrade-tool-wrap';

        // 左上：版本分支
        const branchRow = document.createElement('div');
        branchRow.className = 'widget-upgrade-tool-row';
        const branchLabel = document.createElement('span');
        branchLabel.className = 'widget-upgrade-tool-label';
        branchLabel.textContent = '版本分支';
        const branchVal = document.createElement('span');
        branchVal.className = 'widget-upgrade-tool-val';
        branchVal.id = 'branch';
        branchVal.textContent = '—';
        branchRow.appendChild(branchLabel);
        branchRow.appendChild(branchVal);
        this._wrap.appendChild(branchRow);

        // 右上：数据来源
        const dsRow = document.createElement('div');
        dsRow.className = 'widget-upgrade-tool-row';
        const dsLabel = document.createElement('span');
        dsLabel.className = 'widget-upgrade-tool-label';
        dsLabel.textContent = '数据来源';
        const dsVal = document.createElement('span');
        dsVal.className = 'widget-upgrade-tool-val';
        dsVal.id = 'dataSource';
        dsVal.textContent = '—';
        dsRow.appendChild(dsLabel);
        dsRow.appendChild(dsVal);
        this._wrap.appendChild(dsRow);

        // 左下：本地版本
        const localRow = document.createElement('div');
        localRow.className = 'widget-upgrade-tool-row';
        const localLabel = document.createElement('span');
        localLabel.className = 'widget-upgrade-tool-label';
        localLabel.textContent = '本地版本';
        const localVal = document.createElement('span');
        localVal.className = 'widget-upgrade-tool-val';
        localVal.id = 'localVer';
        localVal.textContent = '—';
        localRow.appendChild(localLabel);
        localRow.appendChild(localVal);
        this._wrap.appendChild(localRow);

        // 右下：云端版本
        const remoteRow = document.createElement('div');
        remoteRow.className = 'widget-upgrade-tool-row';
        const remoteLabel = document.createElement('span');
        remoteLabel.className = 'widget-upgrade-tool-label';
        remoteLabel.textContent = '云端版本';
        const remoteVal = document.createElement('span');
        remoteVal.className = 'widget-upgrade-tool-val';
        remoteVal.id = 'remoteVer';
        remoteVal.textContent = '—';
        remoteRow.appendChild(remoteLabel);
        remoteRow.appendChild(remoteVal);
        this._wrap.appendChild(remoteRow);

        this.element.appendChild(this._wrap);
    }

    _buildSuperLayout() {
        this._wrap = document.createElement('div');
        this._wrap.className = 'widget-upgrade-tool-wrap';
        this._content = document.createElement('div');
        this._content.className = 'widget-upgrade-tool-content';

        // 安装目录（带复制按钮）
        const dirRow = document.createElement('div');
        dirRow.className = 'widget-upgrade-tool-dir-row';
        const dirLabel = document.createElement('span');
        dirLabel.className = 'widget-upgrade-tool-label';
        dirLabel.textContent = '安装目录';
        const dirVal = document.createElement('span');
        dirVal.className = 'widget-upgrade-tool-val widget-upgrade-tool-dir-val';
        dirVal.id = 'dirVal';
        const dirText = document.createElement('div');
        dirText.className = 'widget-upgrade-tool-dir-text';
        dirText.textContent = '—';
        dirVal.appendChild(dirText);
        const copyBtn = document.createElement('button');
        copyBtn.className = 'widget-upgrade-tool-copy-btn';
        copyBtn.title = '复制路径';
        copyBtn.innerHTML = '<span class="material-icons" style="font-size:16px;">content_copy</span>';
        copyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this._copyInstallDir(this.installDir, copyBtn);
        });
        dirRow.appendChild(dirLabel);
        dirRow.appendChild(dirVal);
        dirRow.appendChild(copyBtn);
        this._content.appendChild(dirRow);

        // 版本分支 | 数据来源
        const infoRow1 = document.createElement('div');
        infoRow1.className = 'widget-upgrade-tool-grid-row';
        infoRow1.appendChild(this._makeCell('版本分支', 'branch'));
        infoRow1.appendChild(this._makeCell('数据来源', 'dataSource'));
        this._content.appendChild(infoRow1);

        // 本地版本（全宽）
        this._content.appendChild(this._makeFullRow('本地版本', 'localVer'));

        // 云端版本（全宽）
        this._content.appendChild(this._makeFullRow('云端版本', 'remoteVer'));

        this._wrap.appendChild(this._content);

        // 底部固定检查更新按钮
        const checkRow = document.createElement('div');
        checkRow.className = 'widget-upgrade-tool-check-row';
        const btn = document.createElement('button');
        btn.className = 'widget-upgrade-tool-check-btn';
        btn.id = 'checkBtn';
        btn.innerHTML = '<span class="material-icons" style="font-size:16px;">system_update</span> 检查更新';
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this._loadData();
        });
        checkRow.appendChild(btn);
        this._wrap.appendChild(checkRow);

        this.element.appendChild(this._wrap);
    }

    _makeFullRow(label, valId) {
        const row = document.createElement('div');
        row.className = 'widget-upgrade-tool-super-row';
        const lbl = document.createElement('span');
        lbl.className = 'widget-upgrade-tool-label';
        lbl.textContent = label;
        const val = document.createElement('span');
        val.className = 'widget-upgrade-tool-val';
        val.id = valId;
        val.textContent = '—';
        row.appendChild(lbl);
        row.appendChild(val);
        return row;
    }

    _makeCell(label, valId) {
        const cell = document.createElement('div');
        cell.className = 'widget-upgrade-tool-cell';
        const lbl = document.createElement('span');
        lbl.className = 'widget-upgrade-tool-label';
        lbl.textContent = label;
        const val = document.createElement('span');
        val.className = 'widget-upgrade-tool-val';
        val.id = valId;
        val.textContent = '—';
        cell.appendChild(lbl);
        cell.appendChild(val);
        return cell;
    }

    /* -------- 数据加载 -------- */

    async _loadData() {
        if (this.isChecking) return;
        this.isChecking = true;

        // 加载中状态
        const ids = ['branch', 'dataSource', 'localVer', 'remoteVer', 'dirVal'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const inner = el.querySelector('.widget-upgrade-tool-dir-text');
            if (inner) inner.textContent = '…';
            else el.textContent = '…';
        });
        const btn = document.getElementById('checkBtn');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<span class="material-icons" style="font-size:16px;">system_update</span> 检查中…';
        }

        try {
            const data = await this._apiFetch('/api/interface/check-update');
            this.installDir = data.installDir || '';
            this.branchLabel = data.branchLabel || data.branch || '未知';
            this.dataSource = data.dataSource || '—';
            this.localVersion = data.localVersion || '未检测到';
            this.remoteVersion = data.remoteVersion || (data.localMode ? '本地模式' : '获取失败');
            this.hasUpdate = !!data.hasUpdate;

            const set = (id, text) => {
                const el = document.getElementById(id);
                if (!el) return;
                const inner = el.querySelector('.widget-upgrade-tool-dir-text');
                if (inner) inner.textContent = text;
                else el.textContent = text;
            };
            set('dirVal', this._truncateDirPath(this.installDir || '未设置'));
            set('branch', this.branchLabel);
            set('dataSource', this.dataSource);
            set('localVer', this.localVersion);
            set('remoteVer', this.remoteVersion);
        } catch (err) {
            console.warn('[UpgradeToolWidget] 加载失败:', err);
            const set = (id, text) => {
                const el = document.getElementById(id);
                if (!el) return;
                const inner = el.querySelector('.widget-upgrade-tool-dir-text');
                if (inner) inner.textContent = text;
                else el.textContent = text;
            };
            set('branch', '—');
            set('dataSource', '—');
            set('localVer', '—');
            set('remoteVer', '连接失败');
            set('dirVal', '—');
        } finally {
            this.isChecking = false;
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<span class="material-icons" style="font-size:16px;">system_update</span> 检查更新';
            }
        }
    }

    async _apiFetch(path) {
        const bases = ['http://127.0.0.1:8964', 'http://localhost:8964'];
        let lastErr = null;
        for (const base of bases) {
            try {
                const resp = await fetch(base + path);
                const json = await resp.json();
                if (!resp.ok || !json.ok) throw new Error(json.error || 'HTTP ' + resp.status);
                this.activeBase = base;
                return json.data;
            } catch (e) {
                lastErr = e;
            }
        }
        throw lastErr || new Error('连接失败');
    }

    _truncateDirPath(raw) {
        if (!raw || raw === '未设置') return raw || '—';
        const parts = raw.split(/[\\/]/).filter(Boolean);
        if (parts.length <= 2) return raw;
        // 保留根目录前缀（C:\ 或 /home/ 等），后面最多显示两段，超出用 …
        const prefix = parts[0];
        const middle = parts.slice(1, -2);
        const suffix = parts.slice(-2);
        let result = prefix;
        if (middle.length > 0) result += '\\…\\';
        result += suffix.join('\\');
        return result;
    }

    _copyInstallDir(text, btn) {
        if (!text || text === '—' || text === '未设置') return;
        const copy = (str) => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(str);
            } else {
                const ta = document.createElement('textarea');
                ta.value = str;
                ta.style.cssText = 'position:fixed;opacity:0';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            }
        };
        copy(text);
        btn.classList.add('copied');
        const icon = btn.querySelector('.material-icons');
        if (icon) icon.textContent = 'check';
        this.setTimer(() => {
            btn.classList.remove('copied');
            if (icon) icon.textContent = 'content_copy';
        }, 1200);
    }
}

/**
 * 任务小组件（仅本地 localStorage）
 */
class TasksWidget extends WidgetBase {
    constructor(config) {
        super(config);
        this.type = 'tasks';
        this.tasks = (this.data && Array.isArray(this.data.items)) ? this.data.items : [];
    }

    buildContent() {
        this.element.classList.add('widget-tasks');

        this.headerEl = document.createElement('div');
        this.headerEl.className = 'widget-tasks-header';

        this.headerTitle = document.createElement('span');
        this.headerTitle.className = 'widget-tasks-header-title';
        this.headerEl.appendChild(this.headerTitle);

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
        // 在 header 右侧插入导出 / 导入按钮
        this._addHeaderActions();
    }

    _addHeaderActions() {
        const self = this;
        const actions = document.createElement('div');
        actions.className = 'widget-tasks-header-actions';

        const exportBtn = document.createElement('button');
        exportBtn.className = 'widget-task-io-btn';
        exportBtn.innerHTML = '<span class="material-icons" style="font-size:14px">download</span>';
        exportBtn.title = '导出此小组件任务';
        exportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            self._export();
        });

        const importBtn = document.createElement('button');
        importBtn.className = 'widget-task-io-btn';
        importBtn.innerHTML = '<span class="material-icons" style="font-size:14px">upload</span>';
        importBtn.title = '导入任务到此小组件';
        importBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            self._import();
        });

        actions.appendChild(exportBtn);
        actions.appendChild(importBtn);
        this.headerEl.appendChild(actions);
    }

    _export() {
        const items = this.tasks.map(t => ({ id: t.id, text: t.text || '', done: !!t.done }));
        if (items.length === 0) {
            oooInterface.showNotification('当前小组件没有任务');
            return;
        }
        const now = new Date();
        const timeStr = now.toLocaleString('zh-CN', { hour12: false });
        const json = JSON.stringify(items, null, 2);
        const md = [
            '# OOOInterface 任务列表备份',
            '',
            '- 导出时间：' + timeStr,
            '- 任务总数：' + items.length,
            '',
            '```json',
            json,
            '```'
        ].join('\n');
        const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
        a.href = url;
        a.download = 'OOOInterface-Tasks-' + dateStr + '.md';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            URL.revokeObjectURL(url);
            if (a.parentNode) a.parentNode.removeChild(a);
        }, 0);
        oooInterface.showNotification('已导出 ' + items.length + ' 条任务');
    }

    _import() {
        const self = this;
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.md,text/markdown';
        input.addEventListener('change', () => {
            const file = input.files && input.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function () {
                try {
                    const text = reader.result;
                    let jsonText = '';
                    const match = text.match(/```(?:json)?\s*\n([\s\S]*?)\n\s*```/);
                    if (match) {
                        jsonText = match[1].trim();
                    } else {
                        jsonText = text.trim();
                    }
                    const items = JSON.parse(jsonText);
                    if (!Array.isArray(items)) throw new Error('数据格式错误，期望 JSON 数组');

                    const existing = self.tasks;
                    const existingIds = new Set(existing.map(t => t.id));
                    let added = 0, skipped = 0;
                    items.forEach(item => {
                        if (!item || !item.text) { skipped++; return; }
                        if (existingIds.has(item.id)) { skipped++; return; }
                        existing.push({ id: item.id, text: item.text, done: !!item.done });
                        added++;
                    });

                    self.tasks = existing;
                    self.data.items = existing;
                    self.persist();
                    self.renderList();
                    oooInterface.showNotification('已导入 ' + added + ' 条任务（跳过 ' + skipped + ' 条重复）');
                } catch (e) {
                    oooInterface.showNotification('导入失败：' + (e.message || '未知错误'));
                    console.error('[TasksWidget._import]', e);
                }
            };
            reader.onerror = function () {
                oooInterface.showNotification('文件读取失败');
            };
            reader.readAsText(file);
        });
        input.click();
    }

    // ─── 任务操作 ───

    addTask() {
        const text = this.inputEl.value.trim();
        if (!text) return;
        this.tasks.push({ id: this.genId(), text, done: false });
        this.inputEl.value = '';
        this.data.items = this.tasks;
        this.persist();
        this.renderList();
    }

    toggleTask(id) {
        const t = this.tasks.find(x => x.id === id);
        if (!t) return;
        t.done = !t.done;
        this.data.items = this.tasks;
        this.persist();
        this.renderList();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(x => x.id !== id);
        this.data.items = this.tasks;
        this.persist();
        this.renderList();
    }

    // ─── 渲染 ───

    renderList() {
        const done = this.tasks.filter(t => t.done).length;
        const total = this.tasks.length;
        this.headerTitle.textContent = '任务' + (total ? '  ' + done + '/' + total : '');

        this.listEl.innerHTML = '';

        if (this.tasks.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'widget-task-empty';
            empty.textContent = '暂无任务';
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

/**
 * 任务小组件
 * 数据源：localStorage（通过 settings 持久化），纯客户端
 * 交互：勾选完成 / 删除 / 添加
 */
class TasksWidget extends WidgetBase {
    constructor(config) {
        super(config);
        this.type = 'tasks';
        this.tasks = (this.data && Array.isArray(this.data.items)) ? this.data.items : [];
    }

    buildContent() {
        this.element.classList.add('widget-tasks');

        // 头部统计
        this.headerEl = document.createElement('div');
        this.headerEl.className = 'widget-tasks-header';

        // 列表
        this.listEl = document.createElement('div');
        this.listEl.className = 'widget-tasks-list';

        // 输入行
        this.inputRow = document.createElement('div');
        this.inputRow.className = 'widget-tasks-input-row';

        this.inputEl = document.createElement('input');
        this.inputEl.className = 'widget-tasks-input';
        this.inputEl.type = 'text';
        this.inputEl.placeholder = '添加任务…';
        this.inputEl.maxLength = 60;

        this.addBtn = document.createElement('button');
        this.addBtn.className = 'widget-tasks-add-btn';
        this.addBtn.textContent = '+';
        this.addBtn.title = '添加任务';

        this.inputRow.appendChild(this.inputEl);
        this.inputRow.appendChild(this.addBtn);

        this.element.appendChild(this.headerEl);
        this.element.appendChild(this.listEl);
        this.element.appendChild(this.inputRow);

        // 事件
        this.addBtn.addEventListener('click', () => this.addTask());
        this.inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        this.renderList();
    }

    addTask() {
        const text = this.inputEl.value.trim();
        if (!text) return;
        this.tasks.push({ id: this.genId(), text: text, done: false });
        this.inputEl.value = '';
        this.persist();
        this.renderList();
    }

    toggleTask(id) {
        const t = this.tasks.find(x => x.id === id);
        if (t) {
            t.done = !t.done;
            this.persist();
            this.renderList();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(x => x.id !== id);
        this.persist();
        this.renderList();
    }

    renderList() {
        const done = this.tasks.filter(t => t.done).length;
        const total = this.tasks.length;
        this.headerEl.textContent = '任务 ' + (total ? (done + '/' + total + ' 完成') : '');

        this.listEl.innerHTML = '';

        if (this.tasks.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'widget-task-empty';
            empty.textContent = '暂无任务';
            this.listEl.appendChild(empty);
            return;
        }

        // 未完成在前
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

            box.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleTask(t.id);
            });
            text.addEventListener('click', () => this.toggleTask(t.id));
            del.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteTask(t.id);
            });

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

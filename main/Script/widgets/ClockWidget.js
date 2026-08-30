/**
 * 大时钟小组件
 * 纯客户端，本地时间，每秒刷新
 * - 正方形：垂直布局（时间在上，日期在下）
 * - 长方形：横向布局（时间在左，日期在右）
 */
class ClockWidget extends WidgetBase {
    constructor(config) {
        super(config);
        this.type = 'clock';
    }

    buildContent() {
        this.element.classList.add('widget-clock');
        this.isRect = this.size === 'rectangle';

        this.timeEl = document.createElement('div');
        this.timeEl.className = 'widget-clock-time' + (this.isRect ? ' rect' : '');

        this.dateEl = document.createElement('div');
        this.dateEl.className = 'widget-clock-date' + (this.isRect ? ' rect' : '');

        this.element.appendChild(this.timeEl);
        this.element.appendChild(this.dateEl);

        this.update();
    }

    afterMount() {
        this.setIntervalTimer(() => this.update(), 1000);
    }

    update() {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const dateText = weekdays[now.getDay()] + ' ' + (now.getMonth() + 1) + '月' + now.getDate() + '日';

        if (this.isRect) {
            // 长方形：时间 + 秒
            const ss = String(now.getSeconds()).padStart(2, '0');
            this.timeEl.textContent = hh + ':' + mm + ':' + ss;
        } else {
            this.timeEl.textContent = hh + ':' + mm;
        }
        this.dateEl.textContent = dateText;
    }
}

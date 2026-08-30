/**
 * 日历小组件
 * 纯客户端，本地时间，农历转换（1900-2100 查表算法，无网络依赖）
 * - 小尺寸：当天日期（大号数字）+ 星期 + 农历
 * - 大尺寸：左侧为小尺寸同款（日期/星期/农历），右侧为本月迷你日历
 * - 超大尺寸：大号本月日历（周一起始、含翻月导航与每日农历标注，标题点击回到今天）
 * 每日零点自动刷新（日期/星期/农历跨天更新）
 */
class CalendarWidget extends WidgetBase {
    constructor(config) {
        super(config);
        this.type = 'calendar';
        this.now = new Date();
        // 超大尺寸的翻月视图（默认本月）
        this.viewYear = this.now.getFullYear();
        this.viewMonth = this.now.getMonth();
    }

    buildContent() {
        this.element.classList.add('widget-calendar');
        this.isRect = this.size === 'rectangle';
        this.isSuper = this.size === 'super';

        if (this.isSuper) {
            this.buildSuperLayout();
        } else if (this.isRect) {
            this.buildRectLayout();
        } else {
            this.buildSquareLayout();
        }
        this.update();
    }

    afterMount() {
        // 每天零点后自动刷新（跨天更新日期/星期/农历）
        this.scheduleMidnightRefresh();
    }

    scheduleMidnightRefresh() {
        const now = new Date();
        const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1, 0);
        this.setTimer(() => {
            if (!this.element || !this.element.parentNode) return; // 组件已销毁，跳过刷新
            const prev = this.now;
            this.now = new Date();
            // 若翻月视图仍停留在“昨天”所在月份，自动跟随到今天所在月份
            if (this.viewYear === prev.getFullYear() && this.viewMonth === prev.getMonth()) {
                this.viewYear = this.now.getFullYear();
                this.viewMonth = this.now.getMonth();
            }
            this.update();
            this.scheduleMidnightRefresh();
        }, Math.max(1000, next.getTime() - now.getTime()));
    }

    // ---------- 布局构建 ----------

    // “今天”信息区（小尺寸同款）：月份年份 / 大号日期 / 星期 / 农历
    buildTodayInfo(parent) {
        const monthEl = document.createElement('div');
        monthEl.className = 'widget-calendar-month';

        const dayEl = document.createElement('div');
        dayEl.className = 'widget-calendar-day';

        const weekdayEl = document.createElement('div');
        weekdayEl.className = 'widget-calendar-weekday';

        const lunarEl = document.createElement('div');
        lunarEl.className = 'widget-calendar-lunar';

        parent.appendChild(monthEl);
        parent.appendChild(dayEl);
        parent.appendChild(weekdayEl);
        parent.appendChild(lunarEl);
        return { monthEl, dayEl, weekdayEl, lunarEl };
    }

    buildSquareLayout() {
        this.info = this.buildTodayInfo(this.element);
    }

    buildRectLayout() {
        // 左侧：小尺寸同款
        this.leftEl = document.createElement('div');
        this.leftEl.className = 'widget-calendar-left';
        this.info = this.buildTodayInfo(this.leftEl);
        this.element.appendChild(this.leftEl);

        // 右侧：本月迷你日历
        this.rightEl = document.createElement('div');
        this.rightEl.className = 'widget-calendar-right';
        this.miniHeadEl = document.createElement('div');
        this.miniHeadEl.className = 'widget-calendar-mini-head';
        this.miniBodyEl = document.createElement('div');
        this.miniBodyEl.className = 'widget-calendar-mini-body';
        this.rightEl.appendChild(this.miniHeadEl);
        this.rightEl.appendChild(this.miniBodyEl);
        this.element.appendChild(this.rightEl);
    }

    buildSuperLayout() {
        // 顶栏：上月 / 年月标题 / 下月
        this.superHeadEl = document.createElement('div');
        this.superHeadEl.className = 'widget-calendar-super-head';

        this.prevBtn = this.buildNavButton('prev', '上个月');
        this.prevBtn.addEventListener('click', () => this.changeMonth(-1));

        this.superTitleEl = document.createElement('div');
        this.superTitleEl.className = 'widget-calendar-super-title';
        this.superTitleEl.title = '回到今天';
        this.superTitleEl.addEventListener('click', () => this.goToday());

        this.nextBtn = this.buildNavButton('next', '下个月');
        this.nextBtn.addEventListener('click', () => this.changeMonth(1));

        this.superHeadEl.appendChild(this.prevBtn);
        this.superHeadEl.appendChild(this.superTitleEl);
        this.superHeadEl.appendChild(this.nextBtn);
        this.element.appendChild(this.superHeadEl);

        // 星期表头
        this.gridHeadEl = document.createElement('div');
        this.gridHeadEl.className = 'widget-calendar-grid-head';
        this.element.appendChild(this.gridHeadEl);

        // 日期网格
        this.gridBodyEl = document.createElement('div');
        this.gridBodyEl.className = 'widget-calendar-grid';
        this.element.appendChild(this.gridBodyEl);
    }

    // 导航箭头（内联 SVG，无字体依赖，与页面返回按钮风格一致）
    buildNavButton(dir, label) {
        const btn = document.createElement('button');
        btn.className = 'widget-calendar-nav';
        btn.type = 'button';
        btn.title = label;
        btn.setAttribute('aria-label', label);
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', '18');
        svg.setAttribute('height', '18');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('fill', 'currentColor');
        // Material Design chevron_left / chevron_right
        path.setAttribute('d', dir === 'prev'
            ? 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z'
            : 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z');
        svg.appendChild(path);
        btn.appendChild(svg);
        return btn;
    }

    // ---------- 渲染 ----------

    // 更新显示（跨天/翻月后调用）
    update() {
        if (this.isSuper) {
            this.renderSuper();
            return;
        }
        const now = this.now;
        const lunar = CalendarWidget.formatLunar(now);

        this.info.monthEl.textContent = now.getFullYear() + '年' + (now.getMonth() + 1) + '月';
        this.info.dayEl.textContent = String(now.getDate());
        this.info.weekdayEl.textContent = '星期' + WEEKDAY_NAMES[now.getDay()];
        this.info.lunarEl.textContent = '农历' + lunar.full;

        if (this.isRect) {
            this.renderMini();
        }
    }

    // 本月迷你日历（大尺寸右侧）
    renderMini() {
        this.miniHeadEl.innerHTML = '';
        this.miniBodyEl.innerHTML = '';
        const y = this.now.getFullYear();
        const m = this.now.getMonth();

        WEEKDAY_HEADER.forEach(w => {
            const cell = document.createElement('span');
            cell.className = 'widget-calendar-mini-wd';
            cell.textContent = w;
            this.miniHeadEl.appendChild(cell);
        });

        const first = new Date(y, m, 1);
        const leading = (first.getDay() + 6) % 7; // 周一起始
        for (let i = 0; i < leading; i++) {
            const blank = document.createElement('span');
            blank.className = 'widget-calendar-mini-blank';
            this.miniBodyEl.appendChild(blank);
        }

        const daysInMonth = new Date(y, m + 1, 0).getDate();
        for (let d = 1; d <= daysInMonth; d++) {
            const cell = document.createElement('span');
            cell.className = 'widget-calendar-mini-cell';
            if (d === this.now.getDate()) cell.classList.add('today');
            cell.textContent = String(d);
            this.miniBodyEl.appendChild(cell);
        }
    }

    // 大号本月日历（超大尺寸）
    renderSuper() {
        this.superTitleEl.textContent = this.viewYear + '年' + (this.viewMonth + 1) + '月';
        this.gridHeadEl.innerHTML = '';
        this.gridBodyEl.innerHTML = '';

        WEEKDAY_HEADER.forEach(w => {
            const cell = document.createElement('span');
            cell.className = 'widget-calendar-grid-wd';
            cell.textContent = w;
            this.gridHeadEl.appendChild(cell);
        });

        const first = new Date(this.viewYear, this.viewMonth, 1);
        const leading = (first.getDay() + 6) % 7; // 周一起始
        const daysInMonth = new Date(this.viewYear, this.viewMonth + 1, 0).getDate();
        const prevDaysInMonth = new Date(this.viewYear, this.viewMonth, 0).getDate();
        const now = this.now;
        const isCurrentMonth = this.viewYear === now.getFullYear() && this.viewMonth === now.getMonth();

        // 上月补位日（弱化显示）
        for (let i = 0; i < leading; i++) {
            this.gridBodyEl.appendChild(this.buildSuperCell(prevDaysInMonth - leading + 1 + i, true, false));
        }

        // 本月日期
        for (let d = 1; d <= daysInMonth; d++) {
            const isToday = isCurrentMonth && d === now.getDate();
            this.gridBodyEl.appendChild(this.buildSuperCell(d, false, isToday));
        }

        // 下月补位日（补足最后一周）
        const total = leading + daysInMonth;
        const trailing = total % 7 === 0 ? 0 : 7 - (total % 7);
        for (let i = 1; i <= trailing; i++) {
            this.gridBodyEl.appendChild(this.buildSuperCell(i, true, false));
        }
    }

    // 构造单个日期格（超大尺寸）
    buildSuperCell(dayNum, isOtherMonth, isToday) {
        const cell = document.createElement('div');
        cell.className = 'widget-calendar-cell';
        if (isOtherMonth) cell.classList.add('other-month');
        if (isToday) cell.classList.add('today');

        const numEl = document.createElement('span');
        numEl.className = 'widget-calendar-cell-num';
        numEl.textContent = String(dayNum);
        cell.appendChild(numEl);

        // 本月日期显示农历：初一显示月份名（含闰月前缀）
        if (!isOtherMonth) {
            const lunar = CalendarWidget.solarToLunar(this.viewYear, this.viewMonth + 1, dayNum);
            const label = lunar.lunarDay === 1
                ? (lunar.isLeap ? '闰' : '') + LUNAR_MONTH_NAMES[lunar.lunarMonth - 1]
                : LUNAR_DAY_NAMES[lunar.lunarDay - 1];
            const lunarEl = document.createElement('span');
            lunarEl.className = 'widget-calendar-cell-lunar';
            lunarEl.textContent = label;
            cell.appendChild(lunarEl);
        }
        return cell;
    }

    // 翻月导航
    changeMonth(delta) {
        let m = this.viewMonth + delta;
        let y = this.viewYear;
        if (m < 0) { m = 11; y--; }
        if (m > 11) { m = 0; y++; }
        this.viewYear = y;
        this.viewMonth = m;
        this.renderSuper();
    }

    // 回到今天
    goToday() {
        this.now = new Date();
        this.viewYear = this.now.getFullYear();
        this.viewMonth = this.now.getMonth();
        this.renderSuper();
    }

    // ---------- 农历转换（1900-2100 查表） ----------

    // 农历月天数（含大小月）
    static monthDays(y, m) {
        return (LUNAR_INFO[y - 1899] & (0x10000 >> m)) ? 30 : 29;
    }

    // 农历闰月（0 = 无闰月）
    static leapMonth(y) {
        return LUNAR_INFO[y - 1899] & 0xf;
    }

    // 农历闰月天数
    static leapDays(y) {
        const l = CalendarWidget.leapMonth(y);
        return l > 0 ? ((LUNAR_INFO[y - 1899] & 0x10000) ? 30 : 29) : 0;
    }

    // 农历年总天数
    static lunarYearDays(y) {
        let sum = 0;
        for (let i = 1; i <= 12; i++) sum += CalendarWidget.monthDays(y, i);
        return sum + CalendarWidget.leapDays(y);
    }

    // 公历转农历（y/m/d 为公历年月日）
    static solarToLunar(y, m, d) {
        let offset = (Date.UTC(y, m - 1, d) - Date.UTC(1900, 0, 31)) / 86400000;
        let i, temp = 0;

        for (i = 1900; i <= 2100 && offset >= 0; i++) {
            temp = CalendarWidget.lunarYearDays(i);
            offset -= temp;
        }
        if (offset < 0) { offset += temp; i--; }

        const lunarYear = i;
        const leap = CalendarWidget.leapMonth(lunarYear);
        let isLeap = false;

        for (i = 1; i <= 12 && offset > 0; i++) {
            if (leap > 0 && i === (leap + 1) && isLeap === false) {
                --i;
                isLeap = true;
                temp = CalendarWidget.leapDays(lunarYear);
            } else {
                temp = CalendarWidget.monthDays(lunarYear, i);
            }
            if (isLeap === true && i === (leap + 1)) isLeap = false;
            offset -= temp;
            if (offset === 0 && leap > 0 && i === leap) { isLeap = true; break; }
        }

        if (offset === 0 && leap > 0 && i === leap + 1) {
            if (isLeap) { isLeap = false; }
            else { isLeap = true; --i; }
        }
        if (offset < 0) { offset += temp; --i; }

        return { lunarYear, lunarMonth: i, lunarDay: offset + 1, isLeap };
    }

    // 格式化农历（返回月份名 / 日名 / 完整串）
    static formatLunar(date) {
        const l = CalendarWidget.solarToLunar(date.getFullYear(), date.getMonth() + 1, date.getDate());
        const monthName = (l.isLeap ? '闰' : '') + LUNAR_MONTH_NAMES[l.lunarMonth - 1];
        const dayName = LUNAR_DAY_NAMES[l.lunarDay - 1];
        return {
            lunarYear: l.lunarYear,
            lunarMonth: l.lunarMonth,
            lunarDay: l.lunarDay,
            isLeap: l.isLeap,
            monthName,
            dayName,
            full: monthName + dayName
        };
    }
}

/* ---------- 农历查表数据（1899-2100，索引 = 年份 - 1899） ---------- */
const LUNAR_INFO = [
    0x0AB50, 0x04BD8, 0x04AE0, 0x0A570, 0x054D5, 0x0D260, 0x0D950, 0x16554, 0x056A0, 0x09AD0,
    0x055D2, 0x04AE0, 0x0A5B6, 0x0A4D0, 0x0D250, 0x1D255, 0x0B540, 0x0D6A0, 0x0ADA2, 0x095B0,
    0x14977, 0x04970, 0x0A4B0, 0x0B4B5, 0x06A50, 0x06D40, 0x1AB54, 0x02B60, 0x09570, 0x052F2,
    0x04970, 0x06566, 0x0D4A0, 0x0EA50, 0x16A95, 0x05AD0, 0x02B60, 0x186E3, 0x092E0, 0x1C8D7,
    0x0C950, 0x0D4A0, 0x1D8A6, 0x0B550, 0x056A0, 0x1A5B4, 0x025D0, 0x092D0, 0x0D2B2, 0x0A950,
    0x0B557, 0x06CA0, 0x0B550, 0x15355, 0x04DA0, 0x0A5B0, 0x14573, 0x052B0, 0x0A9A8, 0x0E950,
    0x06AA0, 0x0AEA6, 0x0AB50, 0x04B60, 0x0AAE4, 0x0A570, 0x05260, 0x0F263, 0x0D950, 0x05B57,
    0x056A0, 0x096D0, 0x04DD5, 0x04AD0, 0x0A4D0, 0x0D4D4, 0x0D250, 0x0D558, 0x0B540, 0x0B6A0,
    0x195A6, 0x095B0, 0x049B0, 0x0A974, 0x0A4B0, 0x0B27A, 0x06A50, 0x06D40, 0x0AF46, 0x0AB60,
    0x09570, 0x04AF5, 0x04970, 0x064B0, 0x074A3, 0x0EA50, 0x06B58, 0x05AC0, 0x0AB60, 0x096D5,
    0x092E0, 0x0C960, 0x0D954, 0x0D4A0, 0x0DA50, 0x07552, 0x056A0, 0x0ABB7, 0x025D0, 0x092D0,
    0x0CAB5, 0x0A950, 0x0B4A0, 0x0BAA4, 0x0AD50, 0x055D9, 0x04BA0, 0x0A5B0, 0x15176, 0x052B0,
    0x0A930, 0x07954, 0x06AA0, 0x0AD50, 0x05B52, 0x04B60, 0x0A6E6, 0x0A4E0, 0x0D260, 0x0EA65,
    0x0D530, 0x05AA0, 0x076A3, 0x096D0, 0x04AFB, 0x04AD0, 0x0A4D0, 0x1D0B6, 0x0D250, 0x0D520,
    0x0DD45, 0x0B5A0, 0x056D0, 0x055B2, 0x049B0, 0x0A577, 0x0A4B0, 0x0AA50, 0x1B255, 0x06D20,
    0x0ADA0, 0x14B63, 0x09370, 0x049F8, 0x04970, 0x064B0, 0x168A6, 0x0EA50, 0x06B20, 0x1A6C4,
    0x0AAE0, 0x092E0, 0x0D2E3, 0x0C960, 0x0D557, 0x0D4A0, 0x0DA50, 0x05D55, 0x056A0, 0x0A6D0,
    0x055D4, 0x052D0, 0x0A9B8, 0x0A950, 0x0B4A0, 0x0B6A6, 0x0AD50, 0x055A0, 0x0ABA4, 0x0A5B0,
    0x052B0, 0x0B273, 0x06930, 0x07337, 0x06AA0, 0x0AD50, 0x14B55, 0x04B60, 0x0A570, 0x054E4,
    0x0D160, 0x0E968, 0x0D520, 0x0DAA0, 0x16AA6, 0x056D0, 0x04AE0, 0x0A9D4, 0x0A2D0, 0x0D150,
    0x0F252, 0x0D520];

const LUNAR_MONTH_NAMES = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
const LUNAR_DAY_NAMES = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
const WEEKDAY_NAMES = ['日', '一', '二', '三', '四', '五', '六'];
const WEEKDAY_HEADER = ['一', '二', '三', '四', '五', '六', '日'];

// 小组件类型表与尺寸辅助函数：主页面与侧边栏面板共用（Stage 9）。
//
// 数据以主页面那份为准——它是侧边栏那份的**超集**（多一个 icon 字段，
// 侧边栏不使用该字段，多出来无害）。此前两份靠注释约定"保持一致"，
// 属于同一类漂移风险。
//
// 三个辅助函数此前两侧各写了一份，逻辑逐字等价，此处合并为纯函数；
// 主页面的同名实例方法改为委托到这里（方法名与模块绑定不冲突）。

export const WIDGET_TYPES = {
    'clock':    { name: '大时钟', icon: 'schedule',        defaultSize: 'square', allowSquare: true,  allowSuper: false },
    'calendar': { name: '日历',   icon: 'calendar_month',  defaultSize: 'square', allowSquare: true,  allowSuper: true  },
    'weather':  { name: '天气',   icon: 'wb_sunny',        defaultSize: 'square', allowSquare: true,  allowSuper: false },
    'tasks':    { name: '任务',   icon: 'checklist',       defaultSize: 'super',   allowSquare: false, allowSuper: true  },
    'ai-agent': { name: 'SI Agent', icon: 'smart_toy',     defaultSize: 'super',   allowSquare: false, allowSuper: true  },
    'email':    { name: '邮箱',   icon: 'mail',            defaultSize: 'super',   allowSquare: false, allowSuper: true  },
    'upgrade-tool': { name: '升级工具', icon: 'system_update', defaultSize: 'square', allowSquare: true,  allowSuper: true  },
};

// 某类型允许的尺寸列表；未知类型按最宽松处理
export function getWidgetAllowedSizes(type) {
    const meta = WIDGET_TYPES[type];
    if (!meta) return ['square', 'rectangle', 'super'];
    const sizes = [];
    if (meta.allowSquare !== false) sizes.push('square');
    sizes.push('rectangle');
    if (meta.allowSuper === true) sizes.push('super');
    return sizes;
}

// 把尺寸规范到该类型允许的取值：非法值回落到 defaultSize，再不行取最后一个
export function normalizeWidgetSize(type, size) {
    const allowed = getWidgetAllowedSizes(type);
    if (allowed.indexOf(size) >= 0) return size;
    const meta = WIDGET_TYPES[type];
    if (meta && allowed.indexOf(meta.defaultSize) >= 0) return meta.defaultSize;
    return allowed[allowed.length - 1] || 'rectangle';
}

// 尺寸的中文展示名
export function getWidgetSizeLabel(type, size) {
    const s = normalizeWidgetSize(type, size);
    return s === 'rectangle' ? '大' : s === 'super' ? '超大' : '小';
}

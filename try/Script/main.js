'use strict';

// 新标签页（main/index.html）的模块入口。
//
// 职责：
//   1. 引入主应用类与手柄控制器；
//   2. 承接原先写在 script.js 末尾的启动引导（首启/版本升级跳欢迎页）；
//   3. 维护 runtime 注册表，供 OOOInterface 与 Controller 互相取用。
//
// 加载顺序说明：index.html 中 version.js 仍以经典脚本标签加载，且排在模块标签之前。
// 经典脚本在解析时立即执行，模块脚本延迟到文档解析完成后执行，因此此处可以安全地
// 以裸名读取 version.js 的全局（VERSION / compareVersions 等）。

import { OOOInterface } from './script.js';
import { runtime } from './runtime.js';
// 仅为其自带的 DOMContentLoaded 引导（延迟 500ms 创建手柄控制器）而引入
import './Controller.js';

// ========== 域混入模块（Stage 8 拆分产物）==========
// 每个 mixin 导出一个对象，方法在此统一挂到 OOOInterface.prototype 上。
// 拆分只搬家、不改写调用点，因此 this 语义与原文件完全一致。
import { BadgeMixin } from './mixins/BadgeMixin.js';
import { BadgeAudioMixin } from './mixins/BadgeAudioMixin.js';
import { ContextMenuMixin } from './mixins/ContextMenuMixin.js';
import { VisualEffectsMixin } from './mixins/VisualEffectsMixin.js';
import { CustomSelectMixin } from './mixins/CustomSelectMixin.js';
import { ThemeMixin } from './mixins/ThemeMixin.js';
import { ColorMixin } from './mixins/ColorMixin.js';
import { StatusBarMixin } from './mixins/StatusBarMixin.js';
import { NotificationsMixin } from './mixins/NotificationsMixin.js';
import { InfoPopupToggleMixin } from './mixins/InfoPopupToggleMixin.js';
import { ResetMixin } from './mixins/ResetMixin.js';
import { AssetsMixin } from './mixins/AssetsMixin.js';
import { WallpaperMixin } from './mixins/WallpaperMixin.js';
import { QuickLinksMixin } from './mixins/QuickLinksMixin.js';
import { SearchMixin } from './mixins/SearchMixin.js';
import { TranslateMixin } from './mixins/TranslateMixin.js';
import { SettingsMixin } from './mixins/SettingsMixin.js';
import { SidePanelBridgeMixin } from './mixins/SidePanelBridgeMixin.js';
import { RightPanelMixin } from './mixins/RightPanelMixin.js';
import { BookmarkMixin } from './mixins/BookmarkMixin.js';
import { WidgetMixin } from './mixins/WidgetMixin.js';
import { ImportExportMixin } from './mixins/ImportExportMixin.js';
import { SystemInfoMixin } from './mixins/SystemInfoMixin.js';
import { InteractionMixin } from './mixins/InteractionMixin.js';

const MIXINS = [
    BadgeMixin,
    BadgeAudioMixin,
    ContextMenuMixin,
    VisualEffectsMixin,
    CustomSelectMixin,
    ThemeMixin,
    ColorMixin,
    StatusBarMixin,
    NotificationsMixin,
    InfoPopupToggleMixin,
    ResetMixin,
    AssetsMixin,
    WallpaperMixin,
    QuickLinksMixin,
    SearchMixin,
    TranslateMixin,
    SettingsMixin,
    SidePanelBridgeMixin,
    RightPanelMixin,
    BookmarkMixin,
    WidgetMixin,
    ImportExportMixin,
    SystemInfoMixin,
    InteractionMixin,
];

// 组装前先查重：mixins 唯一的静默失败模式就是两个域定义了同名方法，
// 后挂的会悄悄覆盖先挂的。这里把它变成一声响亮的启动错误。
(function assembleMixins() {
    const seen = new Map();
    const conflicts = [];
    MIXINS.forEach((mixin, i) => {
        Object.keys(mixin).forEach((key) => {
            if (seen.has(key)) {
                conflicts.push(`${key}（第 ${seen.get(key) + 1} 个与第 ${i + 1} 个 mixin）`);
            } else {
                seen.set(key, i);
            }
        });
    });
    if (conflicts.length) {
        throw new Error('mixin 方法名冲突：' + conflicts.join('、'));
    }
    MIXINS.forEach((mixin) => Object.assign(OOOInterface.prototype, mixin));
})();

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    var storedVersion = localStorage.getItem('welcVersion');
    if (storedVersion && compareVersions(VERSION, storedVersion) > 0) {
        localStorage.removeItem('hasVisited');
        localStorage.removeItem('welcVersion');
        window.location.href = 'welc/welc.html';
        return;
    }
    if (!storedVersion && localStorage.getItem('hasVisited')) {
        localStorage.removeItem('hasVisited');
        window.location.href = 'welc/welc.html';
        return;
    }
    if (!localStorage.getItem('hasVisited')) {
        window.location.href = 'welc/welc.html';
    } else {
        const app = new OOOInterface();
        runtime.ooo = app;
        // 保留全局引用：仅供调试与既有外部调用（Controller 的兜底读取）使用
        window.oooInterface = app;
    }
});

// 添加错误处理
window.addEventListener('error', (e) => {
    console.error('OOOInterface Error:', e.error);
});

// 添加未处理的Promise拒绝处理
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
});

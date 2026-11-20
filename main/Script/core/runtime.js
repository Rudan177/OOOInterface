/**
 * 运行时注册表：OOOInterface 与 Controller 之间的实例传递通道，避免经 window 全局互相引用。
 * 双方改为经此表取用实例，避免模块之间隐式的 window 依赖。
 * 注意：main.js 仍会同时写入 window.oooInterface / window.oooController，仅作调试与兼容入口。
 */

'use strict';
export const runtime = {
    ooo: null,        // OOOInterface 实例
    controller: null  // Controller 实例
};

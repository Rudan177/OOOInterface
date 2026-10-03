'use strict';

// 运行时注册表
// 用于解耦 OOOInterface 与 Controller 之间原本通过 window 全局互相引用的关系：
// Controller 需要拿到主应用实例（读设置、执行动作），主应用需要拿到手柄控制器
// （判断径向菜单是否激活）。改为经此注册表传递，避免模块之间隐式的 window 依赖。
//
// 注意：main.js 在实例化后会同时写入本表与 window.oooInterface / window.oooController，
// 后者仅作为调试与向后兼容的方便入口，不再作为跨模块通信的正式通道。
export const runtime = {
    ooo: null,        // OOOInterface 实例
    controller: null  // Controller 实例
};

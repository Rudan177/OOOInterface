// welc 页面核心文字内容配置
var WELC_CONTENT = {
    // 闪屏
    splashTitle: 'OOOInterface',
    splashHint: '按空格键或点击继续',

    // 主页面
    heroTagline: '欢 迎 使 用',
    cardHeader: '更新日志',

    // 更新日志章节
    changelog: [
        {
            header: '主页面',
            items: [
                '优化壁纸模式搜索框显示效果',
                '优化底部铭牌动画',
                '优化高级视觉效果壁纸模式搜索框、右键菜单模糊效果'
            ]
        },
        {
            header: '设置页面',
            items: [
                '头部新增"关于"和"反馈"按钮，与关闭按钮并排，用于代替原有底部按钮（原有按钮即将删除）',
                '反馈图标从 feedback 改为 bug_report',
                '优化组间间距',
                '优化部分页面模糊效果',
            ]
        },
        {
            header: '右键菜单',
            items: [
                '新增“极简”右键菜单样式选项',
                '隐藏非开发者模式下“反馈”按钮'
            ]
        },
        {
            header: '重构底层代码',
            items: [
                '欢迎页文字内容抽离到 update.js ，HTML改为动态渲染',
                '大幅精简CSS样式代码',
                '新增 content_security_policy 配置',
            ]
        }
    ],

    // 按钮文字
    nextBtn: '下一步',
    finishBtn: '开始使用',

    // 页脚
    footer: '© 2026 ByRUDAN'
};

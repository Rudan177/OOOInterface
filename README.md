# OOOInterface

一个用于替换浏览器新标签页的 Chrome 扩展插件。

## 项目信息

- **产品名称**: OOOInterface5.2
- **当前版本**: 5.2:25-RS120
- **发布日期**: 2026年6月18日
- **许可证**: ABCD-26W08A
- **Manifest 版本**: V3

## 开发团队

- **团队名称**: ByRUDAN
- **主要开发者**: RUDAN
- **贡献者**: ZSCC

## 功能描述

本插件会在您打开浏览器新标签页时，显示一个自定义的首页界面，替代浏览器默认的新标签页。

## 项目结构

```
OOOInterface/
├── main/                    # 主页面资源
│   ├── index.html          # 主入口页面
│   ├── FB/                 # 反馈页面
│   │   ├── fb.html        # 反馈页面HTML
│   │   └── fb.js          # 反馈页面脚本
│   ├── Script/             # 脚本文件
│   │   ├── script.js      # 主脚本
│   │   ├── version.js     # 版本信息
│   │   ├── info.js        # 信息页面脚本
│   │   ├── proxy.js       # 代理脚本
│   │   └── proxy-server.js # 代理服务器脚本
│   ├── Style/              # 样式文件
│   │   ├── styles.css     # 主样式表
│   │   ├── info.css       # 信息页面样式
│   │   └── dynamic-blur.css # 动态模糊效果样式
│   ├── about/              # 关于页面
│   │   ├── about.html     # 关于页面HTML
│   │   ├── about.js       # 关于页面脚本
│   │   └── [图片资源]     # 页面相关图片
│   ├── welc/               # 欢迎页面
│   │   ├── welc.html      # 欢迎页面HTML
│   │   ├── welc.js        # 欢迎页面脚本
│   │   └── [图片资源]     # 页面相关图片
│   ├── fonts/              # 字体文件
│   │   └── [字体文件]     # 各种字体文件
│   └── images/             # 图片资源
│       └── [图片文件]     # 各种图片文件
├── images/                  # 扩展图标
│   ├── icon16.png         # 16x16图标
│   ├── icon48.png         # 48x48图标
│   └── icon128.png        # 128x128图标
├── manifest.json           # 扩展配置文件
└── README.md               # 项目说明
```

## 安装方法

1. 打开 Chrome 浏览器，进入 `chrome://extensions/`
2. 开启右上角的"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择本项目所在文件夹

## 联系方式

- **电子邮件**: wyjcrtu@proton.me
- **官方网站**: https://rudan177.github.io/OOOInterface/index.html

## 权限说明

- **storage**: 用于存储用户设置和偏好

## 技术栈

- HTML/CSS/JavaScript
- Chrome Extension Manifest V3

## 版权信息

- **版权所有**: © 2026 ByRUDAN 保留所有权利
- **产品商标**: OOOInterface 是 ByRUDAN 的注册商标

## 许可证

本项目使用 ABCD-26W08A 许可证

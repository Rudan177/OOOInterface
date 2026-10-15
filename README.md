# OOOInterface

一个用于替换浏览器新标签页的 Chrome 扩展插件。

## 项目信息

- **产品名称**: OOOInterface 33
- **当前版本**: 5.3:33-BS256
- **发布日期**: 2026年10月11日
- **许可证**: ABCD-26W08A
- **Manifest 版本**: V3

## 开发团队

- **团队名称**: ByRUDAN
- **主要开发者**: RUDAN、ZSCC
- **贡献者**: ZLCjjlr、lsa、DeepSeek、GLM、Agnes、XIAOMI Mimo

## 功能描述

本插件会在您打开浏览器新标签页时，显示一个自定义的首页界面，替代浏览器默认的新标签页。

## 安装方法

1. 打开 Chrome 浏览器，进入 `chrome://extensions/`
2. 开启右上角的"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择本项目所在文件夹

## 开发：改完源码需要重新构建

`main/index.html` 和 `main/sidepanel/sidepanel.html` 加载的是**打包产物**，源码仍按 mixin
拆分在 `main/Script/**`、`main/sidepanel/sidepanel.js`。改完源码必须重新构建，否则页面跑的还是旧产物：

```bash
node tools/build.js            # 构建一次
node tools/build.js --watch    # 常驻监听，改动后自动重建（开发时推荐）
node tools/build.js --check    # 只检查产物是否为最新（提交前 / CI 用，不写文件）
node tools/build.js --verbose  # 顺带打印打包进去的模块清单
```

改完源码后到 `chrome://extensions/` 点一下"重新加载"即可。

**为什么要打包**：Chrome 读取 `chrome-extension://` 资源时几乎不并行（实测 50 个文件：
并发 58ms / 串行 107ms，每个文件约 1.2~2ms），而 ES 模块是"边下载边发现"的——`main.js`
里那 24 个 mixin 要等 `main.js` 下载并解析完才会发出请求，往下还有两层。结果是主页启动
要串行拉 70 个文件（其中 55 个是 JS），中间还夹着一段时间没有任何请求发出的空窗期。
打包成单文件后降到 23 个文件（9 个 JS），实测：

| 指标 | 打包前 | 打包后 |
| --- | --- | --- |
| 扩展内请求数 | 69 | 23 |
| JS 请求数 | 55 | 9 |
| 首次内容绘制 (FCP) | 68~76 ms | 52~56 ms |
| `DOMContentLoaded` | 96~101 ms | 65~67 ms |
| 应用开始执行 | 114~116 ms | 71~74 ms |

机器越慢、单文件读取开销越大（例如 Windows 上杀软逐个扫描 js），这个差距越明显。

**产物**：`main/Script/bundle.main.js`、`main/sidepanel/bundle.sidepanel.js` —— 由脚本生成，
不要手工编辑。构建脚本只做"按依赖顺序拼接 + 去掉 import/export 关键字"，因此：

- 新加的模块正常写 `import`/`export` 即可，构建时自动处理；
- 顶层不能重名（两个 mixin 声明同名 `const`/`function` 会拼坏），脚本会检测并报错；
- 不支持 `export default`、`export ... from`、默认导入、`import * as`（出现时会报错，不会静默产出坏文件）；
- `import { a as b }` 已支持（自动补一条改名绑定）；
- 动态 `import()` 保持原样，例如 `Themes/*.js` 主题文件仍按需单独加载。

**引入方式**：两个页面都用 `<script defer src="...">`（经典脚本）引入产物，不要写回
`type="module"` —— 扩展页里 Chromium 会为同一个模块 URL 发两次 parser 请求（bundle 要读
两遍），经典脚本只读一次；执行时机不变（解析完成后、`DOMContentLoaded` 之前）。

## 联系方式

- **电子邮件**: <wyjcrtu@proton.me>
- **官方网站**: <https://rudan177.github.io/OOOInterface/index.html>

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

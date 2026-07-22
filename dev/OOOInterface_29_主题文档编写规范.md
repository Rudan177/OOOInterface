# OOOInterface主题文档编写规范

## 文档信息

- 文档名称：OOOInterface主题文档编写规范
- 适用人群：主题设计师、前端开发者、自定义主题爱好者
- 适配版本：OOOInterface 29.0 或更高版本
- 文档日期：2026年7月xx日
- 前置基础：基础 JSON、JavaScript、CSS（非必要） 知识

## 目录

1. 基本介绍
2. 原理概述
3. 文件结构
4. 测试方式

## 一、基本介绍

OOOInterface Themes 是 OOOInterface 29 推出的全新主题系统。Themes 允许用户自定义 OOOInterface 的外观。基础的，有 LOGO、字体、壁纸、主题色；此外，还支持高级内容自定义————开发者可以完全自定义 Style.css 中任何定义项的内容。

OOOInterface 认为，仅仅由极少量开发者设计的主题无法满足所有用户的需求，因此 OOOInterface 决定开放主题系统，允许开发者设计自己的主题。后续，OOOInterface 还将不断完善主题开发者的开发体验，提供更加便捷的开发体验。

## 二、原理概述

OOOInterface Themes 基于 JSON 配置文件，但为保证添加主题的稳定体验，将以 JavaScript 格式保存。将 Themes 导入 OOOInterface 有两种方案：

- 开发者方案：将完成编译的主题文件添加至 OOOInterface 的 Themes 目录下，遂手动编辑 themes.json 。该方案有利于主题长期存在而不受浏览器更换影响。该方案仅支持 JavaScript 格式。
- 标准方案：将编译完成的主题文件添加/拖入 OOOInterface 设置页主题选择面板。该方案支持 JavaScript 和 JSON 双格式。

Themes 的核心加载逻辑在 script.js 中。`applyTheme(themeKey)` 是主题应用的核心函数。其读取主题文件中元数据并将其应用到 OOOInterface 中。

除了基本的主题应用，为保证 Themes 能够逻辑通畅，内还包含以下逻辑。

    1. `this.themeOverrides` 对象用于存储当前主题对 logo / font / wallpaper 的专用配置，与用户普通设置区分开，确保主题切换时能正确应用和清理。

    2. `checkThemeConsistency()`：
        - 当用户手动修改了字体、Logo、壁纸或配色中的任一项，如果新值与当前主题定义的不一致， 自动关闭主题功能
        - 这避免了"主题已启用但实际显示是自定义混搭"的不一致状态

    3. `handleThemeUpload()` 支持用户导入自定义主题文件，兼容 JSON 和 JS 两种格式，导入后存入 settings.customThemes 持久化保存。

## 三、文件结构

主题文件的基本结构如下：

``` JSON
{
    "info": {                 // 主题元信息
        "name": "",           // 主题名称
        "designer": "",       // 设计师
        "version": ""         // 版本号
    },
    "details": {              // 主题具体配置
        "logo": { ... },      // Logo 配置
        "font": { ... },      // 字体配置
        "wallpaper": { ... }, // 壁纸配置
        "color": { ... },     // 配色方案
        "more": false         // 是否有额外自定义 CSS
    }
}
```

接下来将详细介绍各字段的详细内容。

### 1.主题元信息

主题原信息皆为字符串，因此可以畅所欲言。但如若您希望未来您的主题能够收录入 OOOInterface 主题库，您需要遵守以下规范：

- name、designer：10字符以内，不限制语言，禁止使用非文本字符，尤其禁止使用emoji表情。
- version：请严格按照 BRD 版本号规范。
    - BRD 版本号规范：`x.y(.z):a`。
    - x：主版本号，y：次版本号，z：修订版本号（可选），a：发布次号（>10时十位填0）。
    - 例：`1.0:01`，`1.0.1:02`，`2.0:03`。

### 2. Logo 配置

``` JSON
        "logo": {
            "name": "",             // Logo 名称
            "location": "",         // Logo 本地相对路径
            "specialStyle": {       // 其他定义（选填）
                "dark": "",         // 暗色 Logo 本地相对路径
                "online": "",       // 在线 Logo 云端路径
                "onlineDark": "",   // 在线 Logo 暗色 Logo 云端路径
                "width": "",        // Logo 宽度（如不填则等同于高度，两者都不填默认120px）
                "height": ""        // Logo 高度（如不填则等同于宽度）
            }
        },
```

注：

1. LOGO 会先加载本地 LOGO，随后检测云端连通性，并在云端 LOGO 加载完毕后显示云端 LOGO。
2. `location` 允许直接填写云端路径，无需本地相对路径。但如果同时存在本地和云端 LOGO，则`location`必须填写本地相对路径，云端链接填写在`specialStyle`中`online`。
3. 若存在`dark`，但不存在`onlineDark`，则暗色模式使用`dark`。

### 3.字体配置
``` JSON
        "font": {
            "name": "",             // 字体名称
            "location": "",         // 字体本地相对路径
            "specialStyle": {       // 其他定义（选填）
                "font-weight": "",    // 字体粗细
                "font-size": ""        // 字体大小
            }
        },
```
注：

1. 字体粗细留空默认400。
2. 字体大小单位为em，即倍数。留空默认1em。
3. 字体暂不提供`online`。

### 4.壁纸配置
``` JSON
        "wallpaper": {
            "name": "",             // 壁纸名称
            "location": "",         // 壁纸本地相对路径
            "specialStyle": {       // 其他定义（选填）
                "online": "",       // 在线壁纸云端路径
                "wallpaperFill":    // 是否填充壁纸（true/false）
            }
        },
```
注：

1. `wallpaperFill` 对应设置页壁纸面板“填满”开关，请填写true（开）false（关）。留空则遵循用户设定。建议打开（不想被用户骂的话）。

### 5.配色方案
``` JSON
        "color": {
            "name": "",             // 配色方案名称
            "specialStyle": {       // 其他定义（选填）
                "colorGroup": "",     // 配色方案组（cjs、add）
                "colorScheme": ""     // 配色方案
            }
        },
```

#### `colorGroup`和`colorScheme`

1. 引用内置配色`colorGroup`: "cjs" ：直接引用系统内置的配色方案：

- `colorGroup`: "cjs" — 表示使用 color.js 中预定义的配色方案
- `colorScheme` — 配色方案的 key，从内置方案中选一个

    内置方案都定义在 color.js 的 `COLOR_SCHEME_CONFIGS` 中：

    | colorScheme 值 | 名称 | 主色 |
    |:---|:---|:---|
    | green | 林绿色 | #00AE90 |
    | blue | 经典蓝 | #1a73e8 |
    | black-white | 黑白色 | #000000 |
    | tianyi-blue | 天依蓝 | #66ccff |
    | vibrant-red | 活力红 | #FF0000 |
    | classic-gold | 典藏金 | #B46300 |
    | isolation | 隔离色 | #FFD700 |
    | custom | 自定义 | — |

2. 主题自带完整配色`colorGroup`: "add" ：自带一套完整的配色配置，不依赖内置方案：

- `colorGroup`: "add" — 表示主题自带完整配色
- `colorScheme` — 直接放完整的配色配置对象（字段见下方说明）

    如果使用 `colorGroup`: "add" ， `colorScheme` 对象中可以包含以下字段：

    | 字段 | 类型 | 说明 |
    |:---|:---|:---|
    | accent | string | 主色（亮色模式） |
    | accentRgb | string | 主色 RGB 格式（如 "255, 102, 0" ），用于 rgba 透明度 |
    | accentDark | string | 主色（暗色模式） |
    | accentDarkRgb | string | 暗色模式主色 RGB |
    | accentHover | string | 悬停态颜色 |
    | accentActive | string | 激活/按下态颜色 |
    | gradient | string | 可选，渐变色（亮色），如 linear-gradient(135deg, #xxx, #yyy) |
    | gradientDark | string | 可选，渐变色（暗色） |
    | contextMenuHover | string | 右键菜单悬停背景色 |
    | contextMenuHoverDark | string | 暗色模式右键菜单悬停背景色 |
    | contextMenuTextColor | string | 右键菜单文字色 |
    | contextMenuTextColorDark | string | 暗色模式右键菜单文字色 |
    | sidebarIcon | string | 侧边栏图标颜色 |
    | notificationBg | string | 通知背景色（带透明度） |
    | notificationBgDark | string | 暗色模式通知背景色 |
    | notificationText | string | 通知文字颜色 |
    | notificationBorder | string | 通知边框颜色 |
    | infoClass | string | 信息面板样式类名 |
    | particleHueMin | number | 粒子效果最小色相（0-360） |
    | particleHueRange | number | 粒子色相范围 |
    | particleSaturation | number | 粒子饱和度（0-100） |   
    | glowOrbs | string[] | 光晕球颜色数组（4 个，带透明度） |

### 6.额外CSS
``` JSON
        "more": ,            // 额外CSS（true/false）
        "moreStyle"{}        // 额外CSS样式（当more为true时）
```

注：

1. 在使用`moreStyle`自定义 CSS 时，请确保您有必要的 CSS 知识，且已熟悉 OOOInterface CSS内容和规范。
2. `moreStyle` 中的 CSS 代码关联 style.css ，因此无法影响高级视觉效果。
3. `moreStyle` 编写实例：
    1. 注意到 style.css 中
        ``` CSS
        .search-container {
            position: relative;
            z-index: 1;
            display: flex;
            align-items: center;
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);            // 圆角
            background: #F1F3F4;
            transition: border-color 0.2s ease,
                        box-shadow 0.2s ease,
                        background 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                        backdrop-filter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            padding: 0 16px;
            height: 48px;
            width: 100%;
            max-width: 560px;
            margin: 0 auto;
            box-sizing: border-box;
        }
        ```

    2. 那么我们便可 `moreStyle` 中添加自定义 CSS 代码将圆角更改为定值 `50px` 。
        ``` CSS
            "moreStyle": {
                "specialStyle": {
                    ".search-container": "border-radius: 50px !important;"
                }
            }
        ```

## 四、测试方式

晚些时候会发布 OOOInterface 29 测试版，您可以在测试版中测试您的主题。

为确保稳定，建议：
1. 测试时使用“开发者方案”导入，随后通过多次重置验证效果。
2. 若无法确保自己精通CSS，请不要乱改 `more` 在 OOOInterface 的 CSS 上拉屎，这会影响您自身使用体验。
3. 自己写配色，请一定要检查深浅色、高级视觉效果下的显示效果。若发现有逻辑错误，请第一时间联系 wyjcrtu@proton.me。

<hr>

为更棒的 OOOInterface 预备好！
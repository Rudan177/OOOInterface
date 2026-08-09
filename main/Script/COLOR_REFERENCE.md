# color.js 配色变量说明文档

## 文件结构

```
COLOR_SCHEME_NAMES     — 方案名称映射（用于 UI 显示）
COLOR_SCHEME_CONFIGS   — 三套方案的完整配色配置
getColorConfig(scheme) — 根据方案名返回对应配置对象
```

---

## COLOR_SCHEME_NAMES

| 键 | 值 | 说明 |
|---|---|---|
| `'green'` | `'绿色'` | 绿色方案的 UI 显示名称 |
| `'blue'` | `'蓝色'` | 蓝色方案的 UI 显示名称 |
| `'black-white'` | `'黑白色'` | 黑白方案的 UI 显示名称 |

---

## COLOR_SCHEME_CONFIGS — 逐变量说明

### 主色调

| 变量 | 类型 | 说明 |
|---|---|---|
| `accent` | `string` | 浅色模式下的主题强调色（hex）。用于按钮、滑块、引擎按钮激活态、侧边栏图标等所有 UI 元素的主色。通过 JS 动态设置为 CSS 变量 `--primary-color` 和 `--scheme-accent`。 |
| `accentRgb` | `string` | `accent` 的 RGB 逗号分隔值，用于 `rgba()` 半透明场景。如 `'0, 174, 144'`。通过 JS 设置为 CSS 变量 `--scheme-accent-rgb`。 |
| `accentDark` | `string` | 暗色模式下的主题强调色（hex）。`applyColorScheme()` 中根据 `isDark` 决定用 `accent` 还是 `accentDark`。 |
| `accentDarkRgb` | `string` | `accentDark` 的 RGB 逗号分隔值，用于暗色模式的 `rgba()` 半透明场景。 |

### 交互态颜色

| 变量 | 类型 | 说明 |
|---|---|---|
| `accentHover` | `string` | 浅色模式下按钮的 hover（悬停）背景色。通过 CSS 变量 `--scheme-accent-hover` 应用于 `:hover` 伪类。 |
| `accentActive` | `string` | 按钮的 active（按下）背景色。通过 CSS 变量 `--scheme-accent-active` 应用于 `:active` 伪类。亮暗通用。 |

### 右键菜单

| 变量 | 类型 | 说明 |
|---|---|---|
| `contextMenuHover` | `string` | 浅色模式下右键菜单项的 hover 背景色。非 dynamicBlur 模式时使用。可为 hex 或 CSS 变量字符串如 `'var(--primary-color)'`。 |
| `contextMenuHoverDark` | `string` | 暗色模式下右键菜单项的 hover 背景色。非 dynamicBlur 模式时使用。 |
| `contextMenuTextColor` | `string` | 浅色模式下右键菜单项的文字颜色。避免 hover 背景色与文字颜色相同导致不可见（如黑白方案白底白字问题）。 |
| `contextMenuTextColorDark` | `string` | 暗色模式下右键菜单项的文字颜色。dynamicBlur 模式下也使用此值。 |

### 侧边栏

| 变量 | 类型 | 说明 |
|---|---|---|
| `sidebarIcon` | `string` | 快捷访问侧边栏图标的颜色。可通过 hex 或 CSS 变量如 `'var(--primary-color)'`。 |

### 通知弹窗

| 变量 | 类型 | 说明 |
|---|---|---|
| `notificationBg` | `string` | 浅色模式下通知弹窗的背景色，通常用 `rgba()` 半透明值。 |
| `notificationBgDark` | `string` | 暗色模式下通知弹窗的背景色。 |
| `notificationText` | `string` | 浅色模式下通知弹窗的文字颜色。 |
| `notificationTextDark` | `string` | 暗色模式下通知弹窗的文字颜色。仅 `black-white` 方案定义了此字段，其他方案不定义（无专属暗色文字色）。 |
| `notificationBorder` | `string` | 浅色模式下通知弹窗的边框颜色，通常用 `rgba()` 半透明值。 |
| `notificationBorderDark` | `string` | 暗色模式下通知弹窗的边框颜色。仅 `black-white` 方案定义了此字段。 |

### 信息指示器

| 变量 | 类型 | 说明 |
|---|---|---|
| `infoClass` | `string` | 信息弹窗右上角指示器的 CSS 类名。对应 `styles.css` 中 `.info-indicator.{value}` 的样式。`'default'`=绿色圆点，`'google'`=Google 蓝，`'apple'`=灰色。 |

### 粒子效果

| 变量 | 类型 | 说明 |
|---|---|---|
| `particleHueMin` | `number` | 粒子颜色的 HSL 色相最小值（0-360）。`createParticle()` 中用 `particleHueMin + Math.random() * particleHueRange` 计算随机色相。 |
| `particleHueRange` | `number` | 粒子色相的变化范围。实际色相 = `particleHueMin` ~ `particleHueMin + particleHueRange`。范围越大颜色越丰富。 |
| `particleSaturation` | `number` | 粒子颜色的 HSL 饱和度百分比（0-100）。值越小越灰，值越大越鲜艳。默认 `80`，黑白方案用 `10` 几乎无彩色。 |

### 光晕效果

| 变量 | 类型 | 说明 |
|---|---|---|
| `glowOrbs` | `string[]` | 高级视觉效果（dynamicBlur）下光晕圆球的颜色数组。`createGlowOrbs()` 中为每个光晕球随机选择。通常包含 4 个 `rgba()` 值，从深到浅排列，营造层次感。 |

---

## 三套方案对比速查

| 变量 | green | blue | black-white |
|---|---|---|---|
| `accent` | `#00AE90` (青绿) | `#1a73e8` (蓝) | `#000000` (黑) |
| `accentDark` | `#00AE90` (同浅色) | `#0d47a1` (深蓝) | `#ffffff` (白) |
| `accentHover` | `#009A7E` | `#1557b2` | `#333333` |
| `accentActive` | `#00856C` | `#0f4698` | `#555555` |
| `contextMenuHover` | `#00AE00` (绿) | `var(--primary-color)` | `#ffffff` (白) |
| `contextMenuHoverDark` | `#00AE00` (绿) | `var(--primary-color)` | `#555555` (灰) |
| `contextMenuTextColor` | `white` | `white` | `#000000` (黑) |
| `contextMenuTextColorDark` | `#d0d0d0` | `#d0d0d0` | `#d0d0d0` |
| `sidebarIcon` | `#00AE90` | `var(--primary-color)` | `#555555` |
| `infoClass` | `default` | `google` | `apple` |
| `particleHueMin` | `120` (绿色域) | `180` (青色域) | `0` (全色域) |
| `particleHueRange` | `60` | `60` | `360` |
| `particleSaturation` | `80` | `80` | `10` (近灰) |
| `glowOrbs` | 绿色调 | 蓝色调 | 灰白色调 |

---

## 使用流程

1. **`applyColorScheme()`** 读取 `settings.colorScheme`，调用 `getColorConfig(scheme)` 获取配置
2. 根据 `isDarkMode` 决定使用 `accent` 还是 `accentDark`，设置 CSS 变量到 `document.body`
3. **`updateContextMenuColors()`** 读取 `contextMenuHover*` 和 `contextMenuTextColor*`，设置 `--context-menu-color` 和 `--context-menu-text-color`
4. **`createParticle()`** 读取 `particleHueMin/Range/Saturation` 生成随机粒子颜色
5. **`createGlowOrbs()`** 读取 `glowOrbs` 数组创建光晕
6. **`updateInfoIndicatorColor()`** 读取 `infoClass` 设置信息指示器样式
7. **`updateNotificationColors()`** 读取 `notification*` 系列变量设置通知弹窗样式

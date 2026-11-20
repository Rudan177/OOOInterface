/**
 * 配色方案：解析当前配色配置，并把 accent 等 CSS 变量与各类 UI 配色同步到页面。
 * 由 main.js 通过 Object.assign 挂载到 OOOInterface.prototype。
 */

import { getColorConfig, COLOR_SCHEME_NAMES } from '../color.js';

export const ColorMixin = {
    getColorConfig() {
        const scheme = this.settings.colorScheme || 'green';
        if (scheme === 'theme-add') {
            // 主题 add 模式使用主题内联的完整配色配置。
            return this.settings.themeColorScheme || getColorConfig('green');
        }
        if (scheme === 'custom') {
            const customItem = this.settings.customColors && this.settings.customColors.length > 0 && this.settings.activeCustomColorIndex >= 0
                ? this.settings.customColors[this.settings.activeCustomColorIndex]
                : null;
            const customColors = customItem ? {
                primaryColor: customItem.primaryColor || '',
                secondaryColor: customItem.secondaryColor || '',
                gradientEnabled: customItem.gradientEnabled || false,
                gradientStart: customItem.gradientStart !== undefined ? customItem.gradientStart : 0,
                gradientEnd: customItem.gradientEnd !== undefined ? customItem.gradientEnd : 100
            } : {
                primaryColor: this.settings.customPrimaryColor || '',
                secondaryColor: this.settings.customSecondaryColor || '',
                gradientEnabled: this.settings.customGradientEnabled || false,
                gradientStart: this.settings.customGradientStart !== undefined ? this.settings.customGradientStart : 0,
                gradientEnd: this.settings.customGradientEnd !== undefined ? this.settings.customGradientEnd : 100
            };
            return getColorConfig('custom', customColors);
        }
        return getColorConfig(scheme);
    },
    applyColorScheme() {
        const body = document.body;
        const scheme = this.settings.colorScheme || 'green';
        const colorConfig = this.getColorConfig();

        // 先移除所有旧配色方案类，再加回当前方案。
        const colorClasses = ['color-scheme-green', 'color-scheme-blue', 'color-scheme-black-white', 'color-scheme-tianyi-blue', 'color-scheme-vibrant-red', 'color-scheme-classic-gold', 'color-scheme-isolation', 'color-scheme-custom', 'color-scheme-theme-add'];
        body.classList.remove(...colorClasses);
        body.classList.add('color-scheme-' + scheme);

        if (scheme === 'custom') {
            this.updateCustomSchemeDropdownDots();
        }

        // 设置 CSS 自定义属性，让所有 UI 元素跟随配色方案。
        const isDark = this.isDarkMode;
        const accent = isDark ? colorConfig.accentDark : colorConfig.accent;
        const accentRgb = isDark ? colorConfig.accentDarkRgb : colorConfig.accentRgb;
        const gradient = isDark ? (colorConfig.gradientDark || colorConfig.accentDark) : (colorConfig.gradient || colorConfig.accent);
        body.style.setProperty('--primary-color', accent);
        body.style.setProperty('--scheme-accent', accent);
        body.style.setProperty('--scheme-accent-rgb', accentRgb);
        body.style.setProperty('--scheme-gradient', gradient);
        body.style.setProperty('--scheme-accent-hover', colorConfig.accentHover);
        body.style.setProperty('--scheme-accent-active', colorConfig.accentActive);

        // 同步依赖配色的子模块：右键菜单、侧边栏图标、引擎按钮。
        this.updateContextMenuColors();
        this.updateSidebarIconColors();
        this.updateEngineButtonClasses();

        // 高级视觉效果激活时重建光晕。
        if (this.isAdvancedEffectsActive) {
            this.createGlowOrbs();
        }
    },
    updateCustomSchemeDropdownDots() {
        // 兼容旧版：更新静态自定义选项的圆点（如果存在）。
        const staticDot = document.querySelector('#color-scheme-select-items .color-scheme-item[data-value="custom"] .color-scheme-dot');
        if (staticDot) {
            const primary = this.settings.customPrimaryColor || '';
            const secondary = this.settings.customSecondaryColor || '';
            if (primary) {
                if (secondary) {
                    staticDot.style.background = 'linear-gradient(135deg, ' + primary + ', ' + secondary + ')';
                } else {
                    staticDot.style.background = primary;
                }
            } else {
                staticDot.style.background = 'linear-gradient(135deg, #cccccc, #dddddd)';
            }
        }
    },
    updateColorSchemeSelectDisplay() {
        const colorSchemeValue = this.settings.colorScheme || 'green';
        const colorSchemeSelect = document.getElementById('color-scheme-select');
        if (colorSchemeSelect) {
            // 'theme-add' 不是有效 <option>，跳过设值以避免 select 回退到第一个选项。
            if (colorSchemeValue !== 'theme-add') {
                colorSchemeSelect.value = colorSchemeValue;
            }
        }
        const colorSchemeSelected = document.getElementById('color-scheme-select-selected');
        if (!colorSchemeSelected) return;
        const themeInfo = this.getThemeDisplayInfo();
        if (themeInfo && themeInfo.colorName) {
            colorSchemeSelected.textContent = themeInfo.themeName + '：' + themeInfo.colorName;
        } else if (colorSchemeValue === 'custom') {
            const cc = this.settings.activeCustomColorIndex >= 0 && Array.isArray(this.settings.customColors)
                ? this.settings.customColors[this.settings.activeCustomColorIndex]
                : null;
            colorSchemeSelected.textContent = (cc && cc.name) || '自定义';
        } else {
            colorSchemeSelected.textContent = COLOR_SCHEME_NAMES[colorSchemeValue] || '自定义';
        }
    },
};

// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

export const ThemeMixin = {
    async loadThemes() {
        this.themes = {};
        let fileNames = [];

        try {
            const response = await fetch('Themes/themes.json');
            if (response.ok) {
                const data = await response.json();
                fileNames = Array.isArray(data.themes) ? data.themes : [];
            }
        } catch (e) {
            console.warn('themes.json 加载失败:', e);
        }

        // 记录内置主题 key，供导入时避免冲突
        this.builtinThemeKeys = new Set(fileNames.map(f => f.replace(/\.js$/, '')));

        for (const fileName of fileNames) {
            if (!fileName.endsWith('.js')) continue;
            try {
                const theme = await this.loadThemeFile(fileName);
                if (theme && theme.info && theme.details) {
                    const key = fileName.replace(/\.js$/, '');
                    this.themes[key] = this.normalizeThemePaths(theme);
                }
            } catch (e) {
                console.warn(`主题文件 ${fileName} 加载失败:`, e);
            }
        }

        // 注册已导入的自定义主题
        if (this.settings.customThemes) {
            this.settings.customThemes.forEach(ct => {
                if (ct.data && !this.themes[ct.key]) {
                    this.themes[ct.key] = ct.data;
                }
            });
        }

        // 待内置 + 自定义主题全部注册后再填充下拉列表
        this.populateThemeSelect();

        // 页面刷新后恢复主题样式
        if (this.settings.themeEnabled) {
            if (this.settings.theme && this.themes[this.settings.theme]) {
                const theme = this.themes[this.settings.theme];
                const aspects = this.settings.themeAspects || { logo: true, font: true, wallpaper: true, color: true };
                // 快照用户手动覆盖的方面，应用主题后再恢复，避免刷新时主题覆盖用户的改动
                const overridden = {};
                if (aspects.wallpaper === false) {
                    overridden.wallpaper = {
                        wallpaper: this.settings.wallpaper,
                        wallpaperUrl: this.settings.wallpaperUrl,
                        wallpaperFill: this.settings.wallpaperFill
                    };
                }
                if (aspects.logo === false) {
                    overridden.logo = { logo: this.settings.logo, logoType: this.settings.logoType };
                }
                if (aspects.font === false) {
                    overridden.font = { font: this.settings.font, fontWeight: this.settings.fontWeight, fontSize: this.settings.fontSize };
                }
                if (aspects.color === false) {
                    overridden.color = { colorScheme: this.settings.colorScheme, themeColorScheme: this.settings.themeColorScheme };
                }
                this.applyTheme(this.settings.theme, { silent: true });
                // 恢复用户手动覆盖的方面：还原设置值并清空对应主题覆盖，走常规渲染路径
                if (overridden.wallpaper) {
                    Object.assign(this.settings, overridden.wallpaper);
                    this.themeOverrides.wallpaper = null;
                }
                if (overridden.logo) {
                    Object.assign(this.settings, overridden.logo);
                    this.themeOverrides.logo = null;
                }
                if (overridden.font) {
                    Object.assign(this.settings, overridden.font);
                    this.themeOverrides.font = null;
                }
                if (overridden.color) {
                    Object.assign(this.settings, overridden.color);
                }
                this.settings.themeAspects = aspects;
                this.applySettings();
                // 恢复手动覆盖后重绘主题下拉，正确显示"自定义主题"状态
                this.populateThemeSelect();
            } else {
                // 存档指向的主题已不存在或加载失败，关闭主题避免残留旧外观
                this.deactivateTheme();
            }
        }
    },
    async loadThemeFile(fileName) {
        const url = new URL(`Themes/${fileName}`, document.baseURI).href;
        const mod = await import(url);
        const theme = mod && mod.default;
        if (!theme) {
            throw new Error(`${fileName} 未声明默认导出`);
        }
        return theme;
    },
    normalizeThemePaths(theme) {
        const fix = (p) => (typeof p === 'string' && p.startsWith('../')) ? p.substring(3) : p;
        const d = theme.details;
        if (!d) return theme;
        if (d.logo) {
            d.logo.location = fix(d.logo.location);
            if (d.logo.specialStyle) {
                if (d.logo.specialStyle.dark) d.logo.specialStyle.dark = fix(d.logo.specialStyle.dark);
                // online/onlineDark 是绝对 URL，不动
            }
        }
        if (d.font) d.font.location = fix(d.font.location);
        if (d.wallpaper) {
            d.wallpaper.location = fix(d.wallpaper.location);
            // online 是绝对 URL，不动
        }
        if (d.moreStyle) d.moreStyle.location = fix(d.moreStyle.location);
        return theme;
    },
    populateThemeSelect() {
        const itemsContainer = document.getElementById('theme-select-items');
        const hiddenSelect = document.getElementById('theme-select');
        const selectedDisplay = document.getElementById('theme-select-selected');
        if (!itemsContainer || !hiddenSelect) return;

        itemsContainer.innerHTML = '';
        hiddenSelect.innerHTML = '';

        const addItem = (value, label, onClick) => {
            const item = document.createElement('div');
            item.className = 'select-item';
            item.setAttribute('data-value', value);
            item.textContent = label;
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                onClick();
                itemsContainer.querySelectorAll('.select-item').forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
                itemsContainer.classList.add('select-hide');
            });
            itemsContainer.appendChild(item);
            return item;
        };

        // "不使用主题"选项：允许用户主动关闭主题功能
        addItem('', '自定义主题（不使用主题）', () => {
            this.deactivateTheme();
            if (selectedDisplay) selectedDisplay.textContent = '自定义主题';
            hiddenSelect.value = '';
            this.applySettings();
        });

        const keys = Object.keys(this.themes);
        keys.forEach(key => {
            const theme = this.themes[key];
            addItem(key, theme.info.name, () => {
                this.applyTheme(key);
                if (selectedDisplay) selectedDisplay.textContent = theme.info.name;
                hiddenSelect.value = key;
            });

            const option = document.createElement('option');
            option.value = key;
            option.textContent = theme.info.name;
            hiddenSelect.appendChild(option);
        });

        // 高亮当前状态项：主题被激活且未被手动定制时高亮主题，否则高亮"不使用主题"
        const themeActive = this.settings.themeEnabled && this.settings.theme && this.themes[this.settings.theme];
        if (themeActive && !this.isThemeCustomized()) {
            itemsContainer.querySelector(`.select-item[data-value="${this.settings.theme}"]`)?.classList.add('selected');
        } else {
            itemsContainer.querySelector('.select-item[data-value=""]')?.classList.add('selected');
        }

        // 更新顶部显示：无主题或被手动定制时显示"自定义主题"
        if (selectedDisplay) {
            selectedDisplay.textContent = (themeActive && !this.isThemeCustomized()) ? this.themes[this.settings.theme].info.name : '自定义主题';
        }
    },
    handleThemeUpload(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                const themeData = this.parseThemeContent(content);

                if (!themeData) {
                    this.showNotification('无法解析主题文件');
                    return;
                }
                if (!themeData.info || !themeData.details) {
                    this.showNotification('主题文件格式无效');
                    return;
                }

                const key = file.name.replace(/\.[^/.]+$/, '');
                const normalized = this.normalizeThemePaths(JSON.parse(JSON.stringify(themeData)));

                // 避免自定义主题 key 与内置主题冲突（如上传 default.js），冲突时自动加后缀
                let finalKey = key;
                if (this.builtinThemeKeys.has(key)) {
                    // 同名内置冲突：优先复用已导入的副本（如 default-2），避免重复导入产生 default-2、default-3...
                    const imported = this.settings.customThemes.find(ct =>
                        ct.key === key || (ct.key.startsWith(key + '-') && /^-\d+$/.test(ct.key.slice(key.length)))
                    );
                    if (imported) {
                        finalKey = imported.key;
                    } else {
                        let suffix = 2;
                        while (this.themes[key + '-' + suffix]) suffix++;
                        finalKey = key + '-' + suffix;
                    }
                }

                // 检查是否已存在同名自定义主题（按实际 key 匹配）
                const existing = this.settings.customThemes.findIndex(ct => ct.key === finalKey);
                if (existing !== -1) {
                    this.settings.customThemes[existing] = {
                        key: finalKey, name: themeData.info.name,
                        designer: themeData.info.designer || '',
                        version: themeData.info.version || '',
                        data: normalized
                    };
                } else {
                    this.settings.customThemes.push({
                        key: finalKey, name: themeData.info.name,
                        designer: themeData.info.designer || '',
                        version: themeData.info.version || '',
                        data: normalized
                    });
                }

                this.themes[finalKey] = normalized;
                this.saveSettings();
                this.populateThemeSelect();
                this.showNotification(`主题"${themeData.info.name}"导入成功`);

                // 刷新右面板
                const rpu = document.getElementById('right-panel-upper');
                if (rpu && rpu.querySelector('.settings-menu-container')) {
                    const selected = document.getElementById('theme-select-selected');
                    const hiddenSelect = document.getElementById('theme-select');
                    const items = document.getElementById('theme-select-items');
                    this.showSettingsMenuInRightPanel(items, selected, hiddenSelect);
                }
            } catch (err) {
                console.error('主题导入失败:', err);
                this.showNotification('主题导入失败');
            }
        };

        reader.onerror = () => this.showNotification('文件读取失败');
        reader.readAsText(file);
    },
    parseThemeContent(content) {
        if (!content) return null;
        const text = String(content).trim();

        // 1. 纯 JSON
        try { return JSON.parse(text); } catch (e) { /* 继续尝试 JS 写法 */ }

        // 2. 去除 `var/let/const [window.]DEFAULT_THEME =` 前缀与末尾分号后再按 JSON 解析
        const objText = text
            .replace(/^(?:var|let|const)\s+(?:window\.)?[A-Za-z_$][\w$]*\s*=\s*/i, '')
            .replace(/;+\s*$/, '')
            .trim();
        try { return JSON.parse(objText); } catch (e) { /* 继续尝试 JS 风格修正 */ }

        // 3. JS 风格对象字面量修正：仅补齐未加引号的键、把单引号转双引号
        //    注意：补齐键的正则只匹配 `{`/`,` 后紧跟的单词，避免误改字符串内的 URL 等
        try {
            const fixed = objText
                .replace(/([{,]\s*)([A-Za-z_$][\w$]*)\s*:/g, '$1"$2":')
                .replace(/'/g, '"');
            return JSON.parse(fixed);
        } catch (e) {
            return null;
        }
    },
    applyTheme(themeKey, opts = {}) {
        const theme = this.themes[themeKey];
        if (!theme || !theme.details) return;
        const d = theme.details;

        // 清空上一主题的残留覆盖，避免不完整主题继承旧属性
        this.themeOverrides = {};

        // 1. Logo
        if (d.logo) {
            this.settings.logo = d.logo.name;
            this.settings.logoType = 'image';
            this.themeOverrides.logo = {
                location: d.logo.location,
                dark: d.logo.specialStyle?.dark || null,
                online: d.logo.specialStyle?.online || null,
                onlineDark: d.logo.specialStyle?.onlineDark || null,
                width: d.logo.specialStyle?.width || null,
                height: d.logo.specialStyle?.height || null
            };
        } else {
            // 主题未定义 Logo：回退到默认 Logo，避免残留上一主题设置
            this.settings.logo = 'default';
            this.settings.logoType = 'image';
            this.themeOverrides.logo = null;
        }

        // 2. 字体
        if (d.font) {
            this.loadThemeFont(d.font);
            this.settings.font = d.font.name;
            this.themeOverrides.font = {
                weight: d.font.specialStyle?.['font-weight'] || null,
                size: d.font.specialStyle?.['font-size'] || null
            };
        } else {
            // 主题未定义字体：回退到默认字体（不覆盖用户设置的粗细/大小）
            this.settings.font = 'Sans Flex';
            this.themeOverrides.font = null;
        }

        // 3. 壁纸
        if (d.wallpaper) {
            this.settings.wallpaper = 'url';
            this.settings.wallpaperUrl = d.wallpaper.location;
            this.settings.wallpaperFill = d.wallpaper.specialStyle?.wallpaperFill === true;
            // 不修改 persistentWallpaper，避免保存到用户设置中
            this.themeOverrides.wallpaper = {
                online: d.wallpaper.specialStyle?.online || null
            };
        } else {
            // 主题未定义壁纸：回退到默认壁纸，避免残留上一主题壁纸
            this.settings.wallpaper = 'default';
            this.settings.wallpaperUrl = this.localBackgroundUrl || '';
            this.settings.wallpaperFill = true;
            this.themeOverrides.wallpaper = null;
        }

        // 4. 配色
        if (d.color && d.color.specialStyle) {
            if (d.color.specialStyle.colorGroup === 'cjs') {
                this.settings.colorScheme = d.color.specialStyle.colorScheme;
                this.settings.themeColorScheme = null;
            } else if (d.color.specialStyle.colorGroup === 'add') {
                this.settings.colorScheme = 'theme-add';
                this.settings.themeColorScheme = d.color.specialStyle.colorScheme;
            } else {
                // 未知 colorGroup：按内置默认配色处理
                this.settings.colorScheme = 'green';
                this.settings.themeColorScheme = null;
            }
        } else {
            // 主题未定义配色：回退到默认配色
            this.settings.colorScheme = 'green';
            this.settings.themeColorScheme = null;
        }

        // 5. more / moreStyle
        if (d.more === true && d.moreStyle) {
            this.applyThemeMoreStyle(d.moreStyle);
        } else {
            this.applyThemeMoreStyle(null);
        }

        // 6. 记录主题状态
        this.settings.theme = themeKey;
        this.settings.themeEnabled = true;
        // 主题接管全部四个方面；用户手动改动的方面会在 checkThemeConsistency 中标记为 false
        this.settings.themeAspects = { logo: true, font: true, wallpaper: true, color: true };

        // 7. 保存与应用
        if (!opts.silent) {
            this.saveSettings();
            this.showNotification('已切换主题：' + theme.info.name);
        }
        this.applySettings();

        // 8. 主题壁纸独立渲染：在 applySettings 之后确保壁纸在主页面显示
        // 不修改 persistentWallpaper，复选框保持用户原有状态
        // 只有 persistentWallpaper 为 true 时才在主页面添加壁纸并显示
        if (d.wallpaper) {
            const wpUrl = this.getWallpaperUrl();
            if (wpUrl) {
                if (this.settings.persistentWallpaper) {
                    this.setWallpaperOnLayers(wpUrl);
                    document.body.style.backgroundImage = 'none';
                    if (!this.isScrolled) {
                        document.body.classList.add('homepage-wallpaper');
                    }
                } else {
                    this.clearWallpaperLayers();
                }
                // 主题壁纸在线优先回退（与 applyWallpaper 中逻辑一致）
                const onlineUrl = this.themeOverrides?.wallpaper?.online;
                if (onlineUrl && wpUrl !== onlineUrl) {
                    const localUrl = wpUrl;
                    const testImg = new Image();
                    testImg.onload = () => {
                        if (this.settings.themeEnabled
                            && (this.settings.persistentWallpaper || document.body.classList.contains('scrolled'))
                            && this.themeOverrides?.wallpaper?.online === onlineUrl
                            && this.settings.wallpaperUrl === localUrl) {
                            this.setWallpaperOnLayers(onlineUrl);
                        }
                    };
                    testImg.src = onlineUrl;
                }
            }
        }

        // 9. 更新顶部下拉显示（含高亮与"自定义主题"状态）
        this.populateThemeSelect();

        // 10. 更新所有设置选择框的显示文本（主题名：项目名）
        const fontSelected = document.getElementById('font-select-selected');
        if (fontSelected && d.font) {
            fontSelected.textContent = theme.info.name + '：' + d.font.name;
        }
        const wallpaperSelected = document.getElementById('wallpaper-select-selected');
        if (wallpaperSelected && d.wallpaper) {
            wallpaperSelected.textContent = theme.info.name + '：' + d.wallpaper.name;
        }
        const logoSelected = document.getElementById('logo-select-selected');
        if (logoSelected && d.logo) {
            logoSelected.textContent = theme.info.name + '：' + d.logo.name;
        }
        const colorSelected = document.getElementById('color-scheme-select-selected');
        if (colorSelected && d.color) {
            colorSelected.textContent = theme.info.name + '：' + d.color.name;
        }
    },
    loadThemeFont(fontDef) {
        if (!fontDef || !fontDef.location) return;
        try {
            const fontFace = new FontFace(fontDef.name, `url("${fontDef.location}")`);
            fontFace.load().then((loadedFace) => {
                document.fonts.add(loadedFace);
            }).catch((error) => {
                console.warn('主题字体加载失败:', fontDef.name, error);
            });
        } catch (e) {
            console.warn('主题字体 FontFace 创建失败:', e);
        }
    },
    applyThemeMoreStyle(moreStyle) {
        const existing = document.getElementById('theme-more-style');
        if (existing) existing.remove();
        if (!moreStyle || !moreStyle.specialStyle) return;

        const styleEl = document.createElement('style');
        styleEl.id = 'theme-more-style';
        let cssText = '';
        Object.keys(moreStyle.specialStyle).forEach(selector => {
            const rules = moreStyle.specialStyle[selector];
            if (Array.isArray(rules)) {
                cssText += `${selector} { ${rules.join(' ')} }\n`;
            } else if (typeof rules === 'string') {
                cssText += `${selector} { ${rules} }\n`;
            }
        });
        styleEl.textContent = cssText;
        document.head.appendChild(styleEl);
    },
    loadThemeLogoWithFallback(onlineUrl, localUrl, logoElement) {
        if (!onlineUrl) {
            logoElement.src = localUrl;
            return;
        }
        const testImg = new Image();
        testImg.onload = () => {
            logoElement.src = onlineUrl;
        };
        testImg.onerror = () => {
            logoElement.src = localUrl;
        };
        testImg.src = onlineUrl;
        // 先用本地占位，避免等待
        logoElement.src = localUrl;
    },
    checkThemeConsistency(settingName, newValue) {
        if (!this.settings.themeEnabled || !this.settings.theme) return;
        const theme = this.themes[this.settings.theme];
        if (!theme || !theme.details) return;
        const d = theme.details;
        let expected, aspect;
        switch (settingName) {
            case 'font':
                expected = d.font?.name;
                aspect = 'font';
                break;
            case 'logo':
                expected = d.logo?.name;
                aspect = 'logo';
                break;
            case 'wallpaper':
                // 主题壁纸用 location 标识
                expected = d.wallpaper?.location;
                aspect = 'wallpaper';
                break;
            case 'colorScheme':
                // 与 applyTheme 步骤 4 的判定保持一致
                const colorGroup = d.color?.specialStyle?.colorGroup;
                if (colorGroup === 'cjs') {
                    expected = d.color.specialStyle.colorScheme;
                } else if (colorGroup === 'add') {
                    expected = 'theme-add';
                } else {
                    // 主题未定义配色或 colorGroup 未知：applyTheme 会回退到默认配色
                    expected = 'green';
                }
                aspect = 'color';
                break;
            default:
                return;
        }
        if (expected === undefined) return;
        // 当主题壁纸就是默认壁纸时，切换到"默认壁纸"选项不算不一致
        if (settingName === 'wallpaper' && newValue === 'default' && expected === this.localBackgroundUrl) {
            return;
        }
        if (newValue !== expected) {
            // 用户手动覆盖该方面：仅解除该方面的主题控制，主题其余方面保持不变
            if (!this.settings.themeAspects) {
                this.settings.themeAspects = { logo: true, font: true, wallpaper: true, color: true };
            }
            this.settings.themeAspects[aspect] = false;
            // 清空该方面的主题渲染覆盖，使常规渲染逻辑生效
            if (this.themeOverrides && aspect !== 'color') {
                this.themeOverrides[aspect] = null;
            }
            // 若该方面当前值仍是主题设定的值（如仅上传未选择），回退到该方面的默认值
            switch (aspect) {
                case 'logo':
                    if (d.logo && this.settings.logo === d.logo.name) {
                        this.settings.logo = 'default';
                        this.settings.logoType = 'image';
                    }
                    break;
                case 'font':
                    if (d.font && this.settings.font === d.font.name) {
                        this.settings.font = 'Sans Flex';
                        this.settings.fontWeight = 400;
                        this.settings.fontSize = 1;
                    }
                    break;
                case 'wallpaper':
                    if (d.wallpaper && this.settings.wallpaper === 'url' && this.settings.wallpaperUrl === d.wallpaper.location) {
                        this.settings.wallpaper = 'default';
                        this.settings.wallpaperUrl = this.localBackgroundUrl || '';
                        this.clearWallpaperLayers();
                    }
                    break;
                case 'color':
                    if (this.settings.colorScheme === expected || this.settings.colorScheme === 'theme-add') {
                        this.settings.colorScheme = 'green';
                        this.settings.themeColorScheme = null;
                    }
                    break;
            }
            this.saveSettings();
            // 主题已被手动定制：刷新左面板主题下拉（显示"自定义主题"并高亮"不使用主题"）
            this.populateThemeSelect();
        }
    },
    deactivateTheme(theme, opts = {}) {
        const activeTheme = theme || (this.settings.theme && this.themes[this.settings.theme]);
        const d = activeTheme && activeTheme.details;

        this.settings.themeEnabled = false;
        this.settings.theme = 'default';
        this.settings.themeColorScheme = null;
        this.settings.themeAspects = { logo: false, font: false, wallpaper: false, color: false };
        this.themeOverrides = null;
        this.applyThemeMoreStyle(null);
        // 移除主题的壁纸显示（homepage-wallpaper 类由 applyTheme 步骤 8 添加）
        document.body.classList.remove('homepage-wallpaper');

        // 重置仍为主题旧值的设置为默认值
        if (d) {
            if (d.logo && this.settings.logo === d.logo.name) {
                this.settings.logo = 'default';
                this.settings.logoType = 'image';
            }
            if (d.font && this.settings.font === d.font.name) {
                this.settings.font = 'Sans Flex';
                this.settings.fontWeight = 400;
                this.settings.fontSize = 1;
                document.body.style.fontFamily = '';
                document.body.style.fontWeight = '';
                document.body.style.fontSize = '';
            }
            if (d.wallpaper && this.settings.wallpaperUrl === d.wallpaper.location) {
                this.settings.wallpaper = 'default';
                this.settings.wallpaperUrl = this.localBackgroundUrl || '';
                this.clearWallpaperLayers();
                document.body.style.backgroundImage = '';
            }
        }
        // 清理主题专用的配色残留（'theme-add' 在非主题模式下无意义）
        if (this.settings.colorScheme === 'theme-add') {
            this.settings.colorScheme = 'green';
            this.settings.themeColorScheme = null;
        }
        this.saveSettings();

        // 重绘左面板主题下拉，同步显示文本与高亮（无主题时显示"自定义主题"）
        this.populateThemeSelect();
        // 若右面板正显示主题菜单，刷新高亮
        const rpu = document.getElementById('right-panel-upper');
        if (rpu && rpu.dataset.menuType === 'theme') {
            rpu.querySelectorAll('.settings-menu-option').forEach(opt => opt.classList.remove('selected'));
        }
        if (opts.notify) {
            this.showNotification('主题功能已关闭');
        }
    },
    getThemeDisplayInfo() {
        if (!this.settings.themeEnabled || !this.settings.theme) return null;
        const theme = this.themes[this.settings.theme];
        if (!theme || !theme.details) return null;
        const aspects = this.settings.themeAspects || {};
        const still = (aspect) => aspects[aspect] !== false;
        return {
            themeName: theme.info.name,
            fontName: still('font') ? (theme.details.font?.name || null) : null,
            fontLocation: still('font') ? (theme.details.font?.location || null) : null,
            wallpaperName: still('wallpaper') ? (theme.details.wallpaper?.name || null) : null,
            logoName: still('logo') ? (theme.details.logo?.name || null) : null,
            colorName: still('color') ? (theme.details.color?.name || null) : null
        };
    },
    isThemeCustomized() {
        if (!this.settings.themeEnabled || !this.settings.theme) return false;
        const a = this.settings.themeAspects;
        return !!(a && (a.logo === false || a.font === false || a.wallpaper === false || a.color === false));
    },
    isThemeWallpaperActive() {
        return !!this.getThemeDisplayInfo()?.wallpaperName;
    },
};

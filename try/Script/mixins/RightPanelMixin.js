// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

import { COLOR_SCHEME_NAMES } from '../color.js';
import { ProxyManager } from '../proxy.js';

export const RightPanelMixin = {
showSettingsMenuInRightPanel (items, selected, hiddenSelect, skipAnimation) {
    const self = this;
    const rightPanelUpper = document.getElementById('right-panel-upper');
    if (!rightPanelUpper) return;
    // 离开侧边栏子视图时恢复数据交换
    this.exitSidePanelScope();

    let menuType = '';
    if (selected.id === 'font-select-selected' || selected.parentElement.querySelector('#font-select')) {
        menuType = 'font';
    } else if (selected.id === 'logo-select-selected' || selected.parentElement.querySelector('#logo-select')) {
        menuType = 'logo';
    } else if (selected.id === 'wallpaper-select-selected' || selected.parentElement.querySelector('#wallpaper-select')) {
        menuType = 'wallpaper';
    } else if (selected.id === 'proxy-select-selected' || selected.parentElement.querySelector('#proxy-select')) {
        menuType = 'proxy';
    } else if (selected.id === 'context-menu-style-selected' || selected.parentElement.querySelector('#context-menu-style')) {
        menuType = 'context-menu';
    } else if (selected.id === 'color-scheme-select-selected' || selected.parentElement.querySelector('#color-scheme-select')) {
        menuType = 'color-scheme';
    } else if (selected.id === 'theme-select-selected' || selected.parentElement.querySelector('#theme-select')) {
        menuType = 'theme';
    } else if (selected.id === 'badge-open-method-selected' || selected.parentElement.querySelector('#badge-open-method-select')) {
        menuType = 'badge-open-method';
    } else if (selected.id === 'side-panel-select-selected' || selected.parentElement.querySelector('#side-panel-select')) {
        menuType = 'side-panel';
    }

    rightPanelUpper.innerHTML = '';
    delete rightPanelUpper.dataset.subView;
    rightPanelUpper.dataset.menuType = menuType;

    // 底部铭牌功能：独立的三段式双选项视图，不走通用列表渲染
    if (menuType === 'badge-open-method') {
        this.renderBadgeConfigView(rightPanelUpper);
        return;
    }

    // 侧边栏功能：独立配置视图（功能开关组），不走通用列表渲染
    if (menuType === 'side-panel') {
        this.renderSidePanelConfigView(rightPanelUpper);
        return;
    }

    const container = document.createElement('div');
    container.className = 'settings-menu-container' + (skipAnimation ? '' : ' slide-in-right');

    const optionsList = document.createElement('div');
    optionsList.className = 'settings-menu-options';

    // 主题菜单：特殊渲染（名称 + 版本 + 设计师），不走通用 select-item 遍历
    if (menuType === 'theme') {
        const isCustomTheme = (key) => self.settings.customThemes && self.settings.customThemes.some(ct => ct.key === key);

        // "不使用主题"选项：允许用户主动关闭主题功能
        const offOption = document.createElement('div');
        offOption.className = 'settings-menu-option theme-menu-option';
        const offName = document.createElement('div');
        offName.className = 'theme-option-name';
        offName.textContent = '不使用主题';
        const offDesigner = document.createElement('div');
        offDesigner.className = 'theme-option-designer';
        offDesigner.textContent = '自定义设置';
        offOption.appendChild(offName);
        offOption.appendChild(offDesigner);
        if (!self.settings.themeEnabled || self.isThemeCustomized()) {
            offOption.classList.add('selected');
        }
        offOption.addEventListener('click', (e) => {
            e.stopPropagation();
            self.deactivateTheme();
            selected.textContent = '自定义主题';
            hiddenSelect.value = '';
            optionsList.querySelectorAll('.settings-menu-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            offOption.classList.add('selected');
            self.applySettings();
        });
        optionsList.appendChild(offOption);

        Object.keys(self.themes).forEach(key => {
            const theme = self.themes[key];
            const option = document.createElement('div');
            option.className = 'settings-menu-option theme-menu-option';
            option.setAttribute('data-value', key);

            const isCustom = isCustomTheme(key);

            if (isCustom) {
                const contentWrapper = document.createElement('div');
                contentWrapper.style.cssText = 'display:flex;align-items:center;justify-content:space-between;width:100%';

                const infoWrapper = document.createElement('div');
                infoWrapper.style.cssText = 'flex:1;min-width:0';

                const nameLine = document.createElement('div');
                nameLine.className = 'theme-option-name';
                nameLine.textContent = theme.info.name;

                const versionSpan = document.createElement('span');
                versionSpan.className = 'theme-option-version';
                versionSpan.textContent = theme.info.version;
                nameLine.appendChild(versionSpan);
                infoWrapper.appendChild(nameLine);

                const designerLine = document.createElement('div');
                designerLine.className = 'theme-option-designer';
                designerLine.textContent = theme.info.designer;
                infoWrapper.appendChild(designerLine);

                contentWrapper.appendChild(infoWrapper);

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'custom-theme-delete-btn';
                deleteBtn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
                deleteBtn.title = '删除此主题';
                contentWrapper.appendChild(deleteBtn);

                option.appendChild(contentWrapper);

                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const idx = self.settings.customThemes.findIndex(ct => ct.key === key);
                    if (idx === -1) return;
                    // 记录是否正在使用该主题
                    const wasActive = self.settings.themeEnabled && self.settings.theme === key;
                    const deletingTheme = self.themes[key];
                    self.settings.customThemes.splice(idx, 1);
                    delete self.themes[key];
                    if (wasActive) {
                        // 删除的是当前正在使用的主题：彻底关闭主题并回退到默认外观
                        self.deactivateTheme(deletingTheme, { notify: true });
                        self.applySettings();
                    } else {
                        self.saveSettings();
                    }
                    const updatedItems = document.getElementById('theme-select-items');
                    self.populateThemeSelect();
                    self.showSettingsMenuInRightPanel(updatedItems, selected, hiddenSelect, true);
                });
            } else {
                const nameLine = document.createElement('div');
                nameLine.className = 'theme-option-name';
                nameLine.textContent = theme.info.name;

                const versionSpan = document.createElement('span');
                versionSpan.className = 'theme-option-version';
                versionSpan.textContent = theme.info.version;
                nameLine.appendChild(versionSpan);

                const designerLine = document.createElement('div');
                designerLine.className = 'theme-option-designer';
                designerLine.textContent = theme.info.designer;

                option.appendChild(nameLine);
                option.appendChild(designerLine);
            }

            // 高亮判定
            if (self.settings.themeEnabled && self.settings.theme === key && !self.isThemeCustomized()) {
                option.classList.add('selected');
            }

            option.addEventListener('click', (e) => {
                if (isCustom && e.target.closest('.custom-theme-delete-btn')) return;
                self.applyTheme(key);
                selected.textContent = theme.info.name;
                hiddenSelect.value = key;
                optionsList.querySelectorAll('.settings-menu-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                option.classList.add('selected');
            });

            optionsList.appendChild(option);
        });

        container.appendChild(optionsList);

        // 底部按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'settings-menu-button-container';

        // 主题商店按钮
        const storeBtn = document.createElement('button');
        storeBtn.className = 'settings-import-btn';
        storeBtn.innerHTML = '<span class="material-icons">store</span>';
        storeBtn.title = '打开主题商店';
        storeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            window.open('https://rudan177.github.io/OOOInterface/themes/store.html', '_blank');
        });
        buttonContainer.appendChild(storeBtn);

        // "+" 按钮
        const plusBtn = document.createElement('button');
        plusBtn.className = 'upload-btn settings-plus-btn';
        plusBtn.textContent = '+';
        plusBtn.title = '导入自定义主题';
        plusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            document.getElementById('theme-upload').click();
        });
        buttonContainer.appendChild(plusBtn);
        container.appendChild(buttonContainer);

        // 拖放导入支持
        let dragCounter = 0;
        const showDropOverlay = () => {
            let overlay = rightPanelUpper.querySelector('.theme-drop-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'theme-drop-overlay';
                overlay.innerHTML = '<div class="theme-drop-overlay-text">释放 .js / .json 文件以导入主题</div>';
                rightPanelUpper.appendChild(overlay);
            }
            overlay.style.display = 'flex';
        };
        const hideDropOverlay = () => {
            const overlay = rightPanelUpper.querySelector('.theme-drop-overlay');
            if (overlay) overlay.style.display = 'none';
        };

        rightPanelUpper.addEventListener('dragenter', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter++;
            if (dragCounter === 1) showDropOverlay();
        });
        rightPanelUpper.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        rightPanelUpper.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter--;
            if (dragCounter <= 0) { dragCounter = 0; hideDropOverlay(); }
        });
        rightPanelUpper.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter = 0;
            hideDropOverlay();
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                if (file.name.endsWith('.js') || file.name.endsWith('.json')) {
                    self.handleThemeUpload(file);
                } else {
                    self.showNotification('请拖放 .js 或 .json 主题文件');
                }
            }
        });

        rightPanelUpper.appendChild(container);
        document.getElementById('settings-modal').classList.add('right-panel-open');
        return;
    }


    let colorSchemeGroup = null;
    let colorSchemeGroupList = null;
    let colorSchemeGroup2 = null;
    let colorSchemeGroupList2 = null;
    let colorSchemeGroup3 = null;
    let colorSchemeGroupList3 = null;
    if (menuType === 'color-scheme') {
        // 经典色组
        colorSchemeGroup = document.createElement('div');
        colorSchemeGroup.className = 'color-scheme-group';

        const groupLabel = document.createElement('div');
        groupLabel.className = 'color-scheme-group-label';
        groupLabel.textContent = '经典色';
        colorSchemeGroup.appendChild(groupLabel);

        colorSchemeGroupList = document.createElement('div');
        colorSchemeGroupList.className = 'color-scheme-group-list';
        colorSchemeGroup.appendChild(colorSchemeGroupList);
        colorSchemeGroup.addEventListener('click', (e) => {
            if (e.target.closest('.color-scheme-group-list')) return;
            colorSchemeGroup.scrollIntoView({ inline: 'center', behavior: 'smooth' });
        });

        // 新星调组
        colorSchemeGroup2 = document.createElement('div');
        colorSchemeGroup2.className = 'color-scheme-group';

        const groupLabel2 = document.createElement('div');
        groupLabel2.className = 'color-scheme-group-label';
        groupLabel2.textContent = '新星调';
        colorSchemeGroup2.appendChild(groupLabel2);

        colorSchemeGroupList2 = document.createElement('div');
        colorSchemeGroupList2.className = 'color-scheme-group-list';
        colorSchemeGroup2.appendChild(colorSchemeGroupList2);
        colorSchemeGroup2.addEventListener('click', (e) => {
            if (e.target.closest('.color-scheme-group-list')) return;
            colorSchemeGroup2.scrollIntoView({ inline: 'center', behavior: 'smooth' });
        });

        // 自定义组（默认隐藏，有自定义配色时显示）
        colorSchemeGroup3 = document.createElement('div');
        colorSchemeGroup3.className = 'color-scheme-group';
        colorSchemeGroup3.style.display = 'none';

        const groupLabel3 = document.createElement('div');
        groupLabel3.className = 'color-scheme-group-label';
        groupLabel3.textContent = '自定义';
        colorSchemeGroup3.appendChild(groupLabel3);

        colorSchemeGroupList3 = document.createElement('div');
        colorSchemeGroupList3.className = 'color-scheme-group-list';
        colorSchemeGroup3.appendChild(colorSchemeGroupList3);
        colorSchemeGroup3.addEventListener('click', (e) => {
            if (e.target.closest('.color-scheme-group-list')) return;
            colorSchemeGroup3.scrollIntoView({ inline: 'center', behavior: 'smooth' });
        });
    }

    const originalItems = items.querySelectorAll('.select-item');
    originalItems.forEach(originalItem => {
        const option = document.createElement('div');
        option.className = 'settings-menu-option';
        option.setAttribute('data-value', originalItem.getAttribute('data-value'));

        // 根据菜单类型处理
        if (menuType === 'logo') {
            // Logo菜单的特殊处理
            const isTextLogoOption = originalItem.getAttribute('data-value') === 'text-logo';

            if (isTextLogoOption) {
                // 创建包含文字和输入框的结构
                const textSpan = document.createElement('span');
                textSpan.textContent = '自定义文字Logo';
                option.appendChild(textSpan);

                // 创建输入框组
                const inputGroup = document.createElement('div');
                inputGroup.className = 'text-logo-inline-group';
                inputGroup.style.display = 'none';

                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'text-logo-inline-input';
                input.placeholder = '输入文字';
                input.id = 'text-logo-input-panel';

                const btn = document.createElement('button');
                btn.className = 'text-logo-inline-btn';
                btn.title = '确定';

                inputGroup.appendChild(input);
                inputGroup.appendChild(btn);
                option.appendChild(inputGroup);

                // 计算字符长度（中文算2个字符）
                const getCharLength = (str) => {
                    let length = 0;
                    for (let i = 0; i < str.length; i++) {
                        const charCode = str.charCodeAt(i);
                        if (charCode > 127) {
                            length += 2;
                        } else {
                            length += 1;
                        }
                    }
                    return length;
                };

                // 检查输入长度
                const checkInputLength = () => {
                    const text = input.value;
                    const length = getCharLength(text);
                    if (length > 25) {
                        btn.disabled = true;
                        btn.classList.add('disabled');
                        input.classList.add('error');
                        self.showNotification('超出输入范围');
                        return false;
                    } else {
                        btn.disabled = false;
                        btn.classList.remove('disabled');
                        input.classList.remove('error');
                        return true;
                    }
                };

                // 检查是否是当前选中的值
                if (self.settings.logo === 'text-logo') {
                    option.classList.add('selected');
                    inputGroup.style.display = 'flex';
                    input.value = self.settings.textLogo || '';
                    checkInputLength();
                }

                // 点击选项时显示输入框
                option.addEventListener('click', (e) => {
                    // 如果点击的是输入框或按钮，不处理
                    if (e.target === input || e.target === btn) {
                        return;
                    }

                    // 显示输入框
                    inputGroup.style.display = 'flex';
                    option.classList.add('selected');
                    input.focus();
                });

                // 输入框事件
                input.addEventListener('click', (e) => {
                    e.stopPropagation();
                });

                input.addEventListener('input', () => {
                    checkInputLength();
                });

                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        btn.click();
                    }
                });

                // 确定按钮事件
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (btn.disabled) return;

                    const text = input.value.trim();
                    if (text) {
                        self.settings.logoType = 'text';
                        self.settings.logo = 'text-logo';
                        self.settings.textLogo = text;
                        self.userChangedLogo = true;
                        self.applyLogo();
                        self.saveSettings();
                        self.showNotification('文字Logo设置');

                        selected.textContent = '自定义文字Logo';
                        hiddenSelect.value = 'text-logo';
                        self.closeSettingsMenuInRightPanel();
                    } else {
                        self.showNotification('请输入文本');
                    }
                });
            } else {
                // 检查是否是自定义Logo
                const logoValue = originalItem.getAttribute('data-value');
                const isCustomLogoClass = originalItem.classList.contains('select-item-custom-logo');

                // 预设Logo列表
                const presetLogos = ['default', 'auto', 'Google', 'Microsoft', 'Bing', 'Baidu', 'DuckDuckGo', 'Sogou', '360', 'Yahoo', 'Yandex', 'Apple', 'HUAWEI', 'text-logo'];
                const isPresetLogo = presetLogos.includes(logoValue);

                // 如果是预设Logo，直接显示文本
                if (isPresetLogo && !isCustomLogoClass) {
                    option.textContent = originalItem.textContent;

                    if (self.settings.logo === logoValue) {
                        option.classList.add('selected');
                    }

                    option.addEventListener('click', () => {
                        const value = option.getAttribute('data-value');
                        const text = option.textContent;
                        selected.textContent = text;

                        hiddenSelect.value = value;
                        const event = new Event('change', { bubbles: true });
                        hiddenSelect.dispatchEvent(event);

                        self.closeSettingsMenuInRightPanel();
                    });
                }
                // 如果是自定义Logo（通过类名或不在预设列表中）
                else if (isCustomLogoClass || !isPresetLogo) {
                    // 直接从settings.customLogos中查找
                    const logoName = logoValue || originalItem.textContent.trim();
                    const customLogo = self.settings.customLogos.find(logo => logo.name === logoName);

                    if (customLogo) {
                        // 创建包含Logo名称和上传暗色Logo按钮的结构
                        const contentWrapper = document.createElement('div');
                        contentWrapper.className = 'custom-logo-option-wrapper';

                        const textSpan = document.createElement('span');
                        textSpan.className = 'custom-logo-name';
                        // 显示Logo名称，过长时用省略号
                        const displayName = customLogo.name.length > 10 ? customLogo.name.substring(0, 10) + '...' : customLogo.name;
                        textSpan.textContent = displayName;
                        textSpan.title = customLogo.name;
                        contentWrapper.appendChild(textSpan);

                        // 创建按钮容器
                        const btnContainer = document.createElement('div');
                        btnContainer.className = 'custom-logo-btn-container';

                        // 创建上传暗色Logo按钮
                        const darkLogoBtn = document.createElement('button');
                        darkLogoBtn.className = 'dark-logo-upload-btn-inline';
                        darkLogoBtn.textContent = customLogo.darkData ? '更换暗色' : '上传暗色';
                        darkLogoBtn.title = customLogo.darkData ? '更换暗色Logo' : '上传暗色Logo';
                        btnContainer.appendChild(darkLogoBtn);

                        // 创建删除按钮
                        const deleteBtn = document.createElement('button');
                        deleteBtn.className = 'custom-logo-delete-btn';
                        deleteBtn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
                        deleteBtn.title = '删除此Logo';
                        btnContainer.appendChild(deleteBtn);

                        contentWrapper.appendChild(btnContainer);

                        option.appendChild(contentWrapper);

                        // 检查是否是当前选中的值
                        if (self.settings.logo === customLogo.name) {
                            option.classList.add('selected');
                        }

                        // 点击选项时选中并应用
                        option.addEventListener('click', (e) => {
                            if (e.target === darkLogoBtn || e.target === deleteBtn || e.target.closest('.custom-logo-delete-btn')) {
                                return;
                            }

                            // 移除其他选项的selected类
                            optionsList.querySelectorAll('.settings-menu-option').forEach(opt => {
                                opt.classList.remove('selected');
                            });
                            option.classList.add('selected');

                            // 应用Logo
                            selected.textContent = displayName;
                            hiddenSelect.value = customLogo.name;
                            const event = new Event('change', { bubbles: true });
                            hiddenSelect.dispatchEvent(event);

                            self.closeSettingsMenuInRightPanel();
                        });

                        // 上传暗色Logo按钮点击事件
                        darkLogoBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            // 设置当前正在上传暗色Logo的目标
                            self._currentDarkLogoTarget = customLogo.name;
                            document.getElementById('dark-logo-upload').click();
                        });

                        // 删除按钮点击事件
                        deleteBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            // 找到并删除这个Logo
                            const logoIndex = self.settings.customLogos.findIndex(logo => logo.name === customLogo.name);
                            if (logoIndex !== -1) {
                                self.deleteCustomLogo(logoIndex);
                                // 重新获取更新后的items
                                const updatedItems = document.getElementById('logo-select-items');
                                self.showSettingsMenuInRightPanel(updatedItems, selected, hiddenSelect, true);
                            }
                        });
                    } else {
                        // 如果在customLogos中找不到，可能是DOM残留，跳过
                        return;
                    }
                } else {
                    // 其他情况，显示文本
                    option.textContent = originalItem.textContent;

                    if (self.settings.logo === logoValue) {
                        option.classList.add('selected');
                    }

                    option.addEventListener('click', () => {
                        const value = option.getAttribute('data-value');
                        const text = option.textContent;
                        selected.textContent = text;

                        hiddenSelect.value = value;
                        const event = new Event('change', { bubbles: true });
                        hiddenSelect.dispatchEvent(event);

                        self.closeSettingsMenuInRightPanel();
                    });
                }
            }
        } else if (menuType === 'font') {
            // 字体菜单的处理
            const fontValue = originalItem.getAttribute('data-value');
            const isCustomFontClass = originalItem.classList.contains('select-item-custom-font');

            // 预设字体列表
            const presetFonts = ['Sans Flex', 'HMSC', 'Ginto', 'Josefin', 'Code'];
            const isPresetFont = presetFonts.includes(fontValue);

            // 如果是自定义字体
            if (isCustomFontClass || !isPresetFont) {
                const customFont = self.settings.customFonts.find(font => font.name === fontValue);

                if (customFont) {
                    // 创建包含字体名称和删除按钮的结构
                    const contentWrapper = document.createElement('div');
                    contentWrapper.className = 'custom-font-option-wrapper';

                    const textSpan = document.createElement('span');
                    textSpan.className = 'custom-font-name';
                    // 显示字体名称，过长时用省略号
                    const displayName = customFont.name.length > 15 ? customFont.name.substring(0, 15) + '...' : customFont.name;
                    textSpan.textContent = displayName;
                    textSpan.title = customFont.name;
                    contentWrapper.appendChild(textSpan);

                    // 创建删除按钮
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'custom-font-delete-btn';
                    deleteBtn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
                    deleteBtn.title = '删除此字体';
                    contentWrapper.appendChild(deleteBtn);

                    option.appendChild(contentWrapper);

                    // 检查是否是当前选中的值
                    if (self.settings.font === customFont.name) {
                        // 字体仍由主题接管时仅字体名匹配才高亮
                        const themeInfo = self.getThemeDisplayInfo();
                        if (!themeInfo || !themeInfo.fontName || themeInfo.fontName === customFont.name) {
                            option.classList.add('selected');
                        }
                    }

                    // 点击选项时选中并应用
                    option.addEventListener('click', (e) => {
                        if (e.target === deleteBtn || e.target.closest('.custom-font-delete-btn')) {
                            return;
                        }

                        // 移除其他选项的selected类
                        optionsList.querySelectorAll('.settings-menu-option').forEach(opt => {
                            opt.classList.remove('selected');
                        });
                        option.classList.add('selected');

                        // 应用字体
                        selected.textContent = displayName;
                        hiddenSelect.value = customFont.name;
                        const event = new Event('change', { bubbles: true });
                        hiddenSelect.dispatchEvent(event);

                        self.closeSettingsMenuInRightPanel();
                    });

                    // 删除按钮点击事件
                    deleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        // 找到并删除这个字体
                        const fontIndex = self.settings.customFonts.findIndex(font => font.name === customFont.name);
                        if (fontIndex !== -1) {
                            self.deleteCustomFont(fontIndex);
                            // 重新获取更新后的items
                            const updatedItems = document.getElementById('font-select-items');
                            self.showSettingsMenuInRightPanel(updatedItems, selected, hiddenSelect, true);
                        }
                    });
                } else {
                    // 如果在customFonts中找不到，可能是DOM残留，跳过
                    return;
                }
            } else {
                // 预设字体，直接显示文本
                option.textContent = originalItem.textContent;

                if (self.settings.font === fontValue) {
                    // 字体仍由主题接管时仅字体名匹配预设才高亮（路径由 normalizeThemePaths 处理过，不做字符串对比）
                    const themeInfo = self.getThemeDisplayInfo();
                    if (!themeInfo || !themeInfo.fontName || themeInfo.fontName === fontValue) {
                        option.classList.add('selected');
                    }
                }

                option.addEventListener('click', () => {
                    const value = option.getAttribute('data-value');
                    const text = option.textContent;
                    selected.textContent = text;

                    hiddenSelect.value = value;
                    const event = new Event('change', { bubbles: true });
                    hiddenSelect.dispatchEvent(event);

                    self.closeSettingsMenuInRightPanel();
                });
            }
        } else if (menuType === 'wallpaper') {
            // 壁纸菜单的处理
            const wallpaperValue = originalItem.getAttribute('data-value');
            const isCustomWallpaperClass = originalItem.classList.contains('select-item-custom-wallpaper');

            // 预设壁纸列表
            const presetWallpapers = ['default', 'bing', 'url'];
            const isPresetWallpaper = presetWallpapers.includes(wallpaperValue);

            // 如果是自定义壁纸
            if (isCustomWallpaperClass || !isPresetWallpaper) {
                const customWallpaper = self.settings.customWallpapers.find(wp => wp.name === wallpaperValue);

                if (customWallpaper) {
                    // 创建包含壁纸名称和删除按钮的结构
                    const contentWrapper = document.createElement('div');
                    contentWrapper.className = 'custom-wallpaper-option-wrapper';

                    const textSpan = document.createElement('span');
                    textSpan.className = 'custom-wallpaper-name';
                    // 显示壁纸名称，过长时用省略号
                    const displayName = customWallpaper.name.length > 15 ? customWallpaper.name.substring(0, 15) + '...' : customWallpaper.name;
                    textSpan.textContent = displayName;
                    textSpan.title = customWallpaper.name;
                    contentWrapper.appendChild(textSpan);

                    // 创建删除按钮
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'custom-wallpaper-delete-btn';
                    deleteBtn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
                    deleteBtn.title = '删除此壁纸';
                    contentWrapper.appendChild(deleteBtn);

                    option.appendChild(contentWrapper);

                    // 检查是否是当前选中的值
                    if (self.settings.wallpaper === customWallpaper.data) {
                        option.classList.add('selected');
                    }

                    // 点击选项时选中并应用
                    option.addEventListener('click', (e) => {
                        if (e.target === deleteBtn || e.target.closest('.custom-wallpaper-delete-btn')) {
                            return;
                        }

                        // 移除其他选项的selected类
                        optionsList.querySelectorAll('.settings-menu-option').forEach(opt => {
                            opt.classList.remove('selected');
                        });
                        option.classList.add('selected');

                        // 应用壁纸
                        selected.textContent = displayName;
                        hiddenSelect.value = customWallpaper.name;
                        const event = new Event('change', { bubbles: true });
                        hiddenSelect.dispatchEvent(event);

                        self.closeSettingsMenuInRightPanel();
                    });

                    // 删除按钮点击事件
                    deleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        // 找到并删除这个壁纸
                        const wallpaperIndex = self.settings.customWallpapers.findIndex(wp => wp.name === customWallpaper.name);
                        if (wallpaperIndex !== -1) {
                            self.deleteCustomWallpaper(wallpaperIndex);
                            // 重新获取更新后的items
                            const updatedItems = document.getElementById('wallpaper-select-items');
                            self.showSettingsMenuInRightPanel(updatedItems, selected, hiddenSelect, true);
                        }
                    });
                } else {
                    // 如果在customWallpapers中找不到，可能是DOM残留，跳过
                    return;
                }
            } else {
                // 预设壁纸处理
                if (wallpaperValue === 'bing') {
                    // 必应壁纸特殊处理：显示文本、图标和配置
                    option.style.flexDirection = 'column';
                    option.style.alignItems = 'stretch';
                    option.style.gap = '0';
                    const contentWrapper = document.createElement('div');
                    contentWrapper.className = 'bing-wallpaper-option-wrapper';
                    contentWrapper.style.display = 'flex';
                    contentWrapper.style.alignItems = 'center';
                    contentWrapper.style.justifyContent = 'space-between';

                    const textSpan = document.createElement('span');
                    textSpan.textContent = '必应每日壁纸';
                    contentWrapper.appendChild(textSpan);

                    const infoIcon = document.createElement('span');
                    infoIcon.className = 'material-icons info-icon';
                    infoIcon.textContent = 'info';
                    infoIcon.style.fontSize = '16px';
                    infoIcon.style.color = 'rgba(255, 255, 255, 0.6)';
                    infoIcon.style.cursor = 'pointer';
                    infoIcon.style.marginLeft = '8px';
                    infoIcon.addEventListener('click', (e) => {
                        e.stopPropagation();
                        self.showBingTooltip();
                    });
                    contentWrapper.appendChild(infoIcon);

                    option.appendChild(contentWrapper);

                    // 创建配置区域（参考代理配置样式）
                    const configWrapper = document.createElement('div');
                    configWrapper.className = 'bing-config-wrapper';
                    configWrapper.style.display = 'none';
                    configWrapper.style.marginTop = '8px';
                    configWrapper.style.paddingTop = '8px';
                    configWrapper.style.width = '100%';

                    // 配置行：开关 + 输入框 + 确认按钮
                    const configRow = document.createElement('div');
                    configRow.style.display = 'flex';
                    configRow.style.alignItems = 'center';
                    configRow.style.gap = '8px';
                    configRow.style.width = '100%';

                    // 开关（与页面其他开关样式一致）
                    const switchToggle = document.createElement('label');
                    switchToggle.className = 'switch';
                    switchToggle.style.position = 'relative';
                    switchToggle.style.display = 'inline-block';
                    switchToggle.style.width = '52px';
                    switchToggle.style.height = '28px';
                    switchToggle.style.verticalAlign = 'middle';
                    switchToggle.style.flexShrink = '0';

                    const switchInput = document.createElement('input');
                    switchInput.type = 'checkbox';
                    switchInput.checked = self.settings.bingRefreshEveryTime;
                    switchInput.style.opacity = '0';
                    switchInput.style.width = '0';
                    switchInput.style.height = '0';

                    const switchSlider = document.createElement('span');
                    switchSlider.className = 'slider';
                    switchSlider.style.position = 'absolute';
                    switchSlider.style.cursor = 'pointer';
                    switchSlider.style.top = '0';
                    switchSlider.style.left = '0';
                    switchSlider.style.right = '0';
                    switchSlider.style.bottom = '0';
                    switchSlider.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                    switchSlider.style.transition = 'all 0.2s ease';
                    switchSlider.style.borderRadius = '28px';

                    const sliderKnob = document.createElement('span');
                    sliderKnob.style.position = 'absolute';
                    sliderKnob.style.height = '22px';
                    sliderKnob.style.width = '22px';
                    sliderKnob.style.left = '3px';
                    sliderKnob.style.bottom = '3px';
                    sliderKnob.style.backgroundColor = 'white';
                    sliderKnob.style.transition = 'all 0.2s ease';
                    sliderKnob.style.borderRadius = '50%';
                    sliderKnob.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
                    switchSlider.appendChild(sliderKnob);

                    const updateSwitchState = () => {
                        if (switchInput.checked) {
                            const colorConfig = this.getColorConfig();
                            switchSlider.style.backgroundColor = colorConfig.accent;
                            sliderKnob.style.transform = 'translateX(24px)';
                        } else {
                            switchSlider.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                            sliderKnob.style.transform = 'translateX(0)';
                        }
                    };
                    updateSwitchState();

                    switchToggle.appendChild(switchInput);
                    switchToggle.appendChild(switchSlider);
                    configRow.appendChild(switchToggle);

                    // 输入框
                    const intervalInput = document.createElement('input');
                    intervalInput.type = 'number';
                    intervalInput.className = 'bing-interval-input';
                    intervalInput.placeholder = '刷新间隔(小时)';
                    intervalInput.min = '0.1';
                    intervalInput.max = '9999';
                    intervalInput.step = '0.1';
                    intervalInput.disabled = self.settings.bingRefreshEveryTime;
                    intervalInput.style.flex = '1';
                    intervalInput.style.minWidth = '0';
                    intervalInput.style.padding = '6px 10px';
                    intervalInput.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                    intervalInput.style.borderRadius = '6px';
                    intervalInput.style.background = 'transparent';
                    intervalInput.style.color = 'white';
                    intervalInput.style.fontFamily = 'inherit';
                    intervalInput.style.fontSize = '12px';
                    intervalInput.style.outline = 'none';
                    intervalInput.style.transition = 'border-color 0.2s ease';
                    intervalInput.style.MozAppearance = 'textfield';
                    intervalInput.style.WebkitAppearance = 'none';
                    intervalInput.style.appearance = 'textfield';
                    if (!self.settings.bingRefreshEveryTime && self.settings.bingRefreshInterval > 0) {
                        intervalInput.value = self.settings.bingRefreshInterval;
                    }
                    configRow.appendChild(intervalInput);

                    // 确认按钮
                    const confirmBtn = document.createElement('button');
                    confirmBtn.className = 'bing-interval-confirm-btn';
                    confirmBtn.disabled = self.settings.bingRefreshEveryTime;
                    confirmBtn.style.width = '28px';
                    confirmBtn.style.height = '28px';
                    confirmBtn.style.padding = '0';
                    confirmBtn.style.border = 'none';
                    confirmBtn.style.borderRadius = '6px';
                    confirmBtn.style.background = 'transparent';
                    confirmBtn.style.color = 'white';
                    confirmBtn.style.cursor = 'pointer';
                    confirmBtn.style.transition = 'all 0.2s ease';
                    confirmBtn.style.display = 'flex';
                    confirmBtn.style.alignItems = 'center';
                    confirmBtn.style.justifyContent = 'center';
                    confirmBtn.style.flexShrink = '0';
                    confirmBtn.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'20 6 9 17 4 12\'%3E%3C/polyline%3E%3C/svg%3E")';
                    confirmBtn.style.backgroundRepeat = 'no-repeat';
                    confirmBtn.style.backgroundPosition = 'center';
                    confirmBtn.style.backgroundSize = '16px';
                    configRow.appendChild(confirmBtn);

                    configWrapper.appendChild(configRow);
                    option.appendChild(configWrapper);

                    // 开关事件
                    switchInput.addEventListener('change', (e) => {
                        const isChecked = e.target.checked;
                        self.settings.bingRefreshEveryTime = isChecked;
                        intervalInput.disabled = isChecked;
                        confirmBtn.disabled = isChecked;
                        // 开关两个分支共用同一套重置逻辑，仅透明度不同
                        self.settings.bingRefreshInterval = 0;
                        localStorage.removeItem('bingLastRefreshTime');
                        intervalInput.value = '';
                        intervalInput.style.opacity = isChecked ? '0.5' : '1';
                        self.saveSettings();
                        updateSwitchState();
                    });

                    // 输入框焦点样式
                    intervalInput.addEventListener('focus', () => {
                        intervalInput.style.borderColor = 'white';
                    });

                    intervalInput.addEventListener('blur', () => {
                        intervalInput.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    });

                    // 输入验证：不在输入过程中钳制下限（否则无法输入如 0.5 的中间态），
                    // 下限由确认按钮统一校验；仅限制上限避免超大输入
                    intervalInput.addEventListener('input', (e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value) && value > 9999) e.target.value = 9999;
                    });

                    // 确认按钮事件
                    confirmBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const inputValue = intervalInput.value.trim();
                        if (!inputValue) {
                            self.settings.bingRefreshInterval = 0;
                            localStorage.removeItem('bingLastRefreshTime');
                            self.saveSettings();
                            self.showNotification('已设置为不自动刷新');
                            return;
                        }
                        const value = parseFloat(inputValue);
                        if (isNaN(value) || value < 0.1 || value > 9999) {
                            self.showNotification('请输入0.1-9999之间的数字');
                            return;
                        }
                        self.settings.bingRefreshInterval = value;
                        localStorage.setItem('bingLastRefreshTime', Date.now().toString());
                        self.saveSettings();
                        self.showNotification(`必应壁纸刷新间隔已设置为 ${value} 小时`);
                    });

                    // 确认按钮悬停样式
                    confirmBtn.addEventListener('mouseenter', () => {
                        if (!confirmBtn.disabled) {
                            confirmBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                        }
                    });

                    confirmBtn.addEventListener('mouseleave', () => {
                        confirmBtn.style.backgroundColor = 'transparent';
                    });

                    // 检查是否是当前选中的值
                    if (self.settings.wallpaper === 'bing') {
                        // 壁纸仍由主题接管时不自动高亮
                        if (!self.isThemeWallpaperActive()) {
                            option.classList.add('selected');
                            configWrapper.style.display = 'block';
                        }
                    }

                    // 点击选项时显示/隐藏配置
                    option.addEventListener('click', (e) => {
                        if (e.target === intervalInput || e.target === confirmBtn || e.target.closest('.switch')) {
                            return;
                        }

                        // 移除其他选项的selected类
                        optionsList.querySelectorAll('.settings-menu-option').forEach(opt => {
                            opt.classList.remove('selected');
                        });
                        option.classList.add('selected');

                        if (configWrapper.style.display === 'none') {
                            configWrapper.style.display = 'block';
                        } else {
                            configWrapper.style.display = 'none';
                        }

                        // 应用必应壁纸
                        selected.textContent = '必应每日壁纸';
                        hiddenSelect.value = 'bing';
                        const event = new Event('change', { bubbles: true });
                        hiddenSelect.dispatchEvent(event);
                    });
                } else if (wallpaperValue === 'url') {
                    // URL壁纸特殊处理：参考必应壁纸样式优化布局
                    option.style.flexDirection = 'column';
                    option.style.alignItems = 'stretch';
                    option.style.gap = '0';

                    const contentWrapper = document.createElement('div');
                    contentWrapper.style.display = 'flex';
                    contentWrapper.style.alignItems = 'center';
                    contentWrapper.style.justifyContent = 'space-between';
                    const textSpan = document.createElement('span');
                    textSpan.textContent = 'URL链接';
                    contentWrapper.appendChild(textSpan);
                    option.appendChild(contentWrapper);

                    // 创建配置区域
                    const configWrapper = document.createElement('div');
                    configWrapper.className = 'url-config-wrapper';
                    configWrapper.style.display = 'none';
                    configWrapper.style.marginTop = '8px';
                    configWrapper.style.paddingTop = '8px';
                    configWrapper.style.width = '100%';

                    const inputRow = document.createElement('div');
                    inputRow.style.display = 'flex';
                    inputRow.style.alignItems = 'center';
                    inputRow.style.gap = '8px';
                    inputRow.style.width = '100%';

                    const urlInput = document.createElement('input');
                    urlInput.type = 'text';
                    urlInput.className = 'setting-input';
                    urlInput.placeholder = '输入壁纸图片URL链接';
                    urlInput.style.flex = '1';
                    urlInput.style.padding = '6px 10px';
                    urlInput.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                    urlInput.style.borderRadius = '6px';
                    urlInput.style.background = 'transparent';
                    urlInput.style.color = 'white';
                    urlInput.style.fontFamily = 'inherit';
                    urlInput.style.fontSize = '12px';
                    urlInput.style.outline = 'none';
                    urlInput.style.transition = 'border-color 0.2s ease';
                    if (self.settings.wallpaperUrl) {
                        urlInput.value = self.settings.wallpaperUrl;
                    }
                    inputRow.appendChild(urlInput);

                    const applyBtn = document.createElement('button');
                    applyBtn.className = 'text-logo-btn';
                    applyBtn.style.width = '28px';
                    applyBtn.style.height = '28px';
                    applyBtn.style.padding = '0';
                    applyBtn.style.border = 'none';
                    applyBtn.style.borderRadius = '6px';
                    applyBtn.style.background = 'transparent';
                    applyBtn.style.cursor = 'pointer';
                    applyBtn.style.transition = 'background 0.2s ease';
                    applyBtn.style.display = 'flex';
                    applyBtn.style.alignItems = 'center';
                    applyBtn.style.justifyContent = 'center';
                    applyBtn.style.flexShrink = '0';
                    applyBtn.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'20 6 9 17 4 12\'%3E%3C/polyline%3E%3C/svg%3E")';
                    applyBtn.style.backgroundRepeat = 'no-repeat';
                    applyBtn.style.backgroundPosition = 'center';
                    applyBtn.style.backgroundSize = '16px';
                    inputRow.appendChild(applyBtn);

                    configWrapper.appendChild(inputRow);
                    option.appendChild(configWrapper);

                    // 应用按钮事件
                    applyBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const url = urlInput.value.trim();
                        if (!url) {
                            self.showNotification('请输入URL');
                            return;
                        }
                        try {
                            new URL(url);
                        } catch (err) {
                            self.showNotification('URL格式错误');
                            return;
                        }

                        self.settings.wallpaper = 'url';
                        self.settings.wallpaperUrl = url;
                        self.applySettings();
                        self.saveSettings();
                        self.showNotification('URL壁纸已应用');
                        self.closeSettingsMenuInRightPanel();
                    });

                    // 输入框焦点样式
                    urlInput.addEventListener('focus', () => {
                        urlInput.style.borderColor = 'white';
                    });
                    urlInput.addEventListener('blur', () => {
                        urlInput.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    });

                    // 确认按钮悬停样式
                    applyBtn.addEventListener('mouseenter', () => {
                        applyBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                    });
                    applyBtn.addEventListener('mouseleave', () => {
                        applyBtn.style.backgroundColor = 'transparent';
                    });

                    // 输入框回车事件
                    urlInput.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            applyBtn.click();
                        }
                    });

                    // 检查是否是当前选中的值
                    if (self.settings.wallpaper === 'url') {
                        // 壁纸仍由主题接管时不自动高亮
                        if (!self.isThemeWallpaperActive()) {
                            option.classList.add('selected');
                            configWrapper.style.display = 'block';
                        }
                    }

                    // 点击选项时显示/隐藏配置
                    option.addEventListener('click', (e) => {
                        if (e.target === urlInput || e.target === applyBtn) {
                            return;
                        }

                        // 移除其他选项的selected类
                        optionsList.querySelectorAll('.settings-menu-option').forEach(opt => {
                            opt.classList.remove('selected');
                        });
                        option.classList.add('selected');

                        if (configWrapper.style.display === 'none') {
                            configWrapper.style.display = 'block';
                            urlInput.focus();
                        } else {
                            configWrapper.style.display = 'none';
                        }
                    });
                } else {
                    // 默认壁纸
                    option.textContent = originalItem.textContent;

                    // 检查是否是当前选中的值
                    if (self.settings.wallpaper === 'default' && wallpaperValue === 'default') {
                        // 壁纸仍由主题接管时不自动高亮
                        if (!self.isThemeWallpaperActive()) {
                            option.classList.add('selected');
                        }
                    }

                    option.addEventListener('click', () => {
                        const value = option.getAttribute('data-value');
                        const text = option.textContent;
                        selected.textContent = text;

                        hiddenSelect.value = value;
                        const event = new Event('change', { bubbles: true });
                        hiddenSelect.dispatchEvent(event);

                        self.closeSettingsMenuInRightPanel();
                    });
                }
            }
        } else if (menuType === 'proxy') {
            const isCustomProxy = originalItem.getAttribute('data-value') === 'custom';

            if (isCustomProxy) {
                option.textContent = '自定义端口';

                const inputWrapper = document.createElement('div');
                inputWrapper.className = 'proxy-custom-input-wrapper';
                inputWrapper.style.display = 'none';

                const portInput = document.createElement('input');
                portInput.type = 'number';
                portInput.className = 'proxy-custom-port-input';
                portInput.placeholder = '输入端口号...';
                portInput.min = 1;
                portInput.max = 65535;

                const confirmProxyBtn = document.createElement('button');
                confirmProxyBtn.className = 'proxy-custom-confirm-btn';
                confirmProxyBtn.setAttribute('aria-label', '确认代理端口');
                confirmProxyBtn.setAttribute('data-action', 'confirm-proxy');

                inputWrapper.appendChild(portInput);
                inputWrapper.appendChild(confirmProxyBtn);
                option.appendChild(inputWrapper);

                confirmProxyBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const portValue = portInput.value.trim();
                    if (portValue && !isNaN(portValue) && parseInt(portValue, 10) >= 1 && parseInt(portValue, 10) <= 65535) {
                        const port = parseInt(portValue, 10);
                        self.settings.proxyPort = port;
                        ProxyManager.setProxy(port);
                        self.saveSettings();
                        self.updateProxySelectedText(port);
                        hiddenSelect.value = 'custom';
                        self.showNotification('代理端口已设置为 ' + port);
                        self.closeSettingsMenuInRightPanel();
                    } else {
                        self.showNotification('请输入有效的端口号 (1-65535)');
                    }
                });

                option.addEventListener('click', (e) => {
                    if (e.target.closest('.proxy-custom-confirm-btn') || e.target === portInput) {
                        return;
                    }
                    if (inputWrapper.style.display === 'none' || inputWrapper.style.display === '') {
                        inputWrapper.style.display = 'block';
                    } else {
                        inputWrapper.style.display = 'none';
                    }
                });
            } else {
                option.textContent = originalItem.textContent;

                const currentProxyPort = ProxyManager.getProxyPort();
                const itemValue = originalItem.getAttribute('data-value');

                if (itemValue && parseInt(itemValue) === currentProxyPort) {
                    option.classList.add('selected');
                }

                option.addEventListener('click', () => {
                    const value = option.getAttribute('data-value');
                    let text = '';
                    let portNum = null;

                    if (value === '') {
                        text = '不使用代理';
                        portNum = null;
                    } else {
                        portNum = parseInt(value, 10);
                        text = option.textContent.replace(/\s*\(.*?\)\s*/, '').trim();
                    }

                    selected.textContent = text;
                    hiddenSelect.value = value;
                    const event = new Event('change', { bubbles: true });
                    hiddenSelect.dispatchEvent(event);

                    self.settings.proxyPort = portNum;
                    ProxyManager.setProxy(portNum);
                    self.saveSettings();
                    self.showNotification(portNum ? '代理端口已设置为 ' + portNum : '代理已关闭');

                    self.closeSettingsMenuInRightPanel();
                });
            }
        } else if (menuType === 'context-menu') {
            // 右键菜单样式选项
            option.textContent = originalItem.textContent;

            const currentValue = originalItem.getAttribute('data-value');
            if (hiddenSelect.value === currentValue) {
                option.classList.add('selected');
            }

            option.addEventListener('click', () => {
                const value = option.getAttribute('data-value');
                const text = option.textContent;
                selected.textContent = text;
                hiddenSelect.value = value;

                // 更新选中态
                optionsList.querySelectorAll('.settings-menu-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                option.classList.add('selected');

                self.settings.contextMenuStyle = value;

                // 实时切换设置图标显隐（需 important 覆盖 CSS）
                const btn = rightPanelUpper.querySelector('.upload-btn.settings-plus-btn');
                if (btn) {
                    if (value === 'minimal') {
                        btn.style.setProperty('display', 'none', 'important');
                    } else {
                        btn.style.removeProperty('display');
                    }
                }

                // 立即应用到右键菜单（添加/移除 compact/minimal 类）
                self.applyContextMenuStyle();

                self.closeSettingsMenuInRightPanel();
            });
        } else if (menuType === 'color-scheme') {
            const dot = originalItem.querySelector('.color-scheme-dot');
            if (dot) {
                const dotClone = dot.cloneNode(true);
                dotClone.classList.add('selected-dot');
                option.appendChild(dotClone);
            }
            const textSpan = document.createElement('span');
            textSpan.textContent = COLOR_SCHEME_NAMES[originalItem.getAttribute('data-value')] || originalItem.textContent;
            option.appendChild(textSpan);

            const currentValue = originalItem.getAttribute('data-value');
            if (hiddenSelect.value === currentValue) {
                // 主题模式下若配色为 add 组（自定义配色方案），不高亮任何选项（配色被手动定制后不再抑制）
                const themeInfo = self.getThemeDisplayInfo();
                const isAddGroup = themeInfo && themeInfo.colorName && self.themes[self.settings.theme]?.details?.color?.specialStyle?.colorGroup === 'add';
                if (!isAddGroup) {
                    option.classList.add('selected');
                }
            }

            option.addEventListener('click', () => {
                const value = option.getAttribute('data-value');
                const text = textSpan.textContent;

                // 自定义配色
                if (value === 'custom') {
                    const hasColor = self.settings.customPrimaryColor && self.settings.customPrimaryColor.trim();
                    if (hasColor) {
                        self.settings.colorScheme = 'custom';
                        self.saveSettings();
                        self.applyColorScheme();
                        optionsList.querySelectorAll('.settings-menu-option').forEach(opt => {
                            opt.classList.remove('selected');
                        });
                        option.classList.add('selected');
                        selected.textContent = text;
                        hiddenSelect.value = value;
                        const event = new Event('change', { bubbles: true });
                        hiddenSelect.dispatchEvent(event);
                        // 立即更新左面板配色显示
                        self.updateColorSchemeSelectDisplay();
                    }
                    self.showCustomColorEditorInPanel(rightPanelUpper, selected, hiddenSelect, text, optionsList);
                    return;
                }

                optionsList.querySelectorAll('.settings-menu-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                option.classList.add('selected');

                selected.textContent = text;

                hiddenSelect.value = value;
                const event = new Event('change', { bubbles: true });
                hiddenSelect.dispatchEvent(event);

                self.closeSettingsMenuInRightPanel();
            });
        } else {
            // 其他菜单的通用处理
            option.textContent = originalItem.textContent;

            // 检查是否是当前选中的值
            const currentValue = originalItem.getAttribute('data-value');
            if (hiddenSelect.value === currentValue) {
                option.classList.add('selected');
            }

            option.addEventListener('click', () => {
                const value = option.getAttribute('data-value');
                const text = option.textContent;
                selected.textContent = text;

                hiddenSelect.value = value;
                const event = new Event('change', { bubbles: true });
                hiddenSelect.dispatchEvent(event);

                self.closeSettingsMenuInRightPanel();
            });
        }

        const itemGroup = originalItem.getAttribute('data-group');
        if (itemGroup === 'classic' && colorSchemeGroupList) {
            colorSchemeGroupList.appendChild(option);
        } else if (itemGroup === 'newstar' && colorSchemeGroupList2) {
            colorSchemeGroupList2.appendChild(option);
        } else if (itemGroup === 'custom' && colorSchemeGroupList3) {
            colorSchemeGroupList3.appendChild(option);
        } else if (colorSchemeGroupList) {
            colorSchemeGroupList.appendChild(option);
        } else {
            optionsList.appendChild(option);
        }
    });

    // 渲染自定义配色方案选项
    function renderCustomOptions() {
        if (!colorSchemeGroupList3) return;
        colorSchemeGroupList3.innerHTML = '';
        const customColors = self.settings.customColors || [];
        customColors.forEach((cc, idx) => {
            const opt = document.createElement('div');
            opt.className = 'settings-menu-option';
            opt.setAttribute('data-value', 'custom');
            opt.setAttribute('data-custom-index', idx);

            const dot = document.createElement('span');
            dot.className = 'color-scheme-dot';
            const p = cc.primaryColor || '#cccccc';
            const s = cc.secondaryColor && cc.secondaryColor.trim() ? cc.secondaryColor : p;
            if (cc.gradientEnabled && cc.secondaryColor && cc.secondaryColor.trim()) {
                dot.style.background = 'linear-gradient(135deg, ' + p + ', ' + s + ')';
            } else {
                dot.style.background = p;
            }
            opt.appendChild(dot);

            const nameSpan = document.createElement('span');
            nameSpan.textContent = cc.name || '未命名';
            nameSpan.style.flex = '1';
            nameSpan.style.minWidth = '0';
            nameSpan.style.whiteSpace = 'nowrap';
            nameSpan.style.overflow = 'hidden';
            nameSpan.style.textOverflow = 'ellipsis';
            opt.appendChild(nameSpan);

            // 编辑按钮（删除移入编辑界面内）
            const editBtn = document.createElement('button');
            editBtn.className = 'custom-color-edit-btn';
            editBtn.innerHTML = '<span class="material-icons">edit</span>';
            editBtn.title = '编辑此配色';
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const name = cc.name || '自定义';
                self.showCustomColorEditorInPanel(rightPanelUpper, selected, hiddenSelect, name, optionsList, idx);
            });
            opt.appendChild(editBtn);

            if (self.settings.colorScheme === 'custom' && self.settings.activeCustomColorIndex === idx) {
                opt.classList.add('selected');
            }

            colorSchemeGroupList3.appendChild(opt);
        });
        if (customColors.length > 0) {
            colorSchemeGroup3.style.display = '';
        } else {
            colorSchemeGroup3.style.display = 'none';
        }
    }

    renderCustomOptions();

    // 自定义配色选项点击事件（事件委托，只需绑定一次）
    if (menuType === 'color-scheme' && colorSchemeGroupList3 && !colorSchemeGroupList3._clickBound) {
        colorSchemeGroupList3._clickBound = true;
        colorSchemeGroupList3.addEventListener('click', (e) => {
            const opt = e.target.closest('.settings-menu-option');
            if (!opt) return;
            const idx = parseInt(opt.getAttribute('data-custom-index'), 10);
            if (isNaN(idx) || idx < 0) return;
            const cc = (self.settings.customColors || [])[idx];
            if (!cc) return;

            self.settings.colorScheme = 'custom';
            self.settings.activeCustomColorIndex = idx;
            // 手动改配色：解除主题对配色方面的接管
            self.checkThemeConsistency('colorScheme', 'custom');
            self.saveSettings();
            self.applyColorScheme();
            // 立即更新左面板配色显示
            self.updateColorSchemeSelectDisplay();
            self.closeSettingsMenuInRightPanel();
        });
    }

    if (colorSchemeGroup) {
        optionsList.appendChild(colorSchemeGroup);
    }
    if (colorSchemeGroup2) {
        optionsList.appendChild(colorSchemeGroup2);
    }
    if (colorSchemeGroup3) {
        optionsList.appendChild(colorSchemeGroup3);
    }
    // 选中经典色时居中经典色组
    const classicSchemes = ['green', 'blue', 'black-white'];
    if (colorSchemeGroup && classicSchemes.includes(self.settings.colorScheme)) {
        requestAnimationFrame(() => {
            colorSchemeGroup.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
        });
    }
    // 选中新星调时居中新星调组
    const newSchemes = ['tianyi-blue', 'vibrant-red', 'classic-gold', 'isolation'];
    if (colorSchemeGroup2 && newSchemes.includes(self.settings.colorScheme)) {
        requestAnimationFrame(() => {
            colorSchemeGroup2.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
        });
    }
    // 选中自定义时居中自定义组
    if (colorSchemeGroup3 && self.settings.colorScheme === 'custom') {
        requestAnimationFrame(() => {
            colorSchemeGroup3.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
        });
    }

    container.appendChild(optionsList);

    if (menuType === 'color-scheme') {
        let isDragging = false;
        let dragStarted = false;
        let startX = 0;
        let scrollLeft = 0;
        const onMouseMove = (e) => {
            if (!isDragging) return;
            const dx = e.pageX - startX;
            if (Math.abs(dx) > 5) {
                if (!dragStarted) {
                    dragStarted = true;
                }
                e.preventDefault();
                optionsList.scrollLeft = scrollLeft - dx;
            }
        };
        const onMouseUp = () => {
            if (isDragging) {
                isDragging = false;
                optionsList.classList.remove('dragging');
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                if (dragStarted) {
                    optionsList.dataset.dragJustHappened = 'true';
                    setTimeout(() => { delete optionsList.dataset.dragJustHappened; }, 200);
                }
                dragStarted = false;
            }
        };
        optionsList.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragStarted = false;
            startX = e.pageX;
            scrollLeft = optionsList.scrollLeft;
            optionsList.classList.add('dragging');
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'settings-menu-button-container';

    if (menuType === 'font' || menuType === 'logo' || menuType === 'wallpaper') {
        const plusBtn = document.createElement('button');
        plusBtn.className = 'upload-btn settings-plus-btn';
        plusBtn.textContent = '+';
        plusBtn.title = `上传自定义${menuType === 'font' ? '字体' : menuType === 'logo' ? 'Logo' : '壁纸'}`;

        plusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();

            if (menuType === 'font') {
                document.getElementById('font-upload').click();
            } else if (menuType === 'logo') {
                document.getElementById('logo-upload').click();
            } else if (menuType === 'wallpaper') {
                self.showWallpaperImportSelector(plusBtn);
            }
        });

        buttonContainer.appendChild(plusBtn);

        // 壁纸菜单：在加号旁边添加填满全屏开关
        if (menuType === 'wallpaper') {
            const fillWrapper = document.createElement('div');
            fillWrapper.className = 'wallpaper-fill-toggle-wrapper';
            fillWrapper.title = '壁纸填满全屏（关闭则显示完整画面，空隙用模糊填充）';

            const fillLabel = document.createElement('label');
            fillLabel.className = 'wallpaper-fill-toggle-label';

            const fillSpan = document.createElement('span');
            fillSpan.className = 'wallpaper-fill-toggle-text';
            fillSpan.textContent = '填满';

            const fillSwitch = document.createElement('label');
            fillSwitch.className = 'switch wallpaper-fill-switch';

            const fillInput = document.createElement('input');
            fillInput.type = 'checkbox';
            fillInput.id = 'wallpaper-fill-toggle-panel';
            fillInput.checked = self.settings.wallpaperFill;

            const fillSlider = document.createElement('span');
            fillSlider.className = 'slider';

            fillSwitch.appendChild(fillInput);
            fillSwitch.appendChild(fillSlider);
            fillLabel.appendChild(fillSpan);
            fillLabel.appendChild(fillSwitch);
            fillWrapper.appendChild(fillLabel);

            buttonContainer.insertBefore(fillWrapper, plusBtn);
        }

        // 一键清除按钮（超过5个自定义壁纸时显示）
        if (menuType === 'wallpaper' && self.settings.customWallpapers.length > 5) {
            const clearAllBtn = document.createElement('button');
            clearAllBtn.className = 'quick-link-clear-all-btn';
            clearAllBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> ';
            clearAllBtn.title = '删除所有自定义壁纸';
            clearAllBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                self.settings.customWallpapers = [];
                self.settings.wallpaperSeries = [];
                self.settings.wallpaper = 'default';
                self.saveSettings();
                self.updateCustomWallpapersList();
                self.applySettings();
                const selected = document.getElementById('wallpaper-select-selected');
                const hiddenSelect = document.getElementById('wallpaper-select');
                const items = document.getElementById('wallpaper-select-items');
                self.showSettingsMenuInRightPanel(items, selected, hiddenSelect);
                self.showNotification('已清除所有自定义壁纸');
            });
            optionsList.appendChild(clearAllBtn);
        }
    } else if (menuType === 'color-scheme') {
        const plusBtn = document.createElement('button');
        plusBtn.className = 'upload-btn settings-plus-btn';
        plusBtn.textContent = '+';
        plusBtn.title = '添加自定义配色';
        plusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            self.showCustomColorEditorInPanel(rightPanelUpper, selected, hiddenSelect, selected.textContent, optionsList);
        });
        buttonContainer.appendChild(plusBtn);
    }

    // 字体 / Logo / 壁纸菜单：拖放导入
    // 先清理旧拖拽监听器，避免残留影响其他菜单
    if (rightPanelUpper._dragCleanup) {
        if (rightPanelUpper._dragenter) rightPanelUpper.removeEventListener('dragenter', rightPanelUpper._dragenter);
        if (rightPanelUpper._dragover) rightPanelUpper.removeEventListener('dragover', rightPanelUpper._dragover);
        if (rightPanelUpper._dragleave) rightPanelUpper.removeEventListener('dragleave', rightPanelUpper._dragleave);
        if (rightPanelUpper._drop) rightPanelUpper.removeEventListener('drop', rightPanelUpper._drop);
        rightPanelUpper._dragCleanup = false;
    }
    if (menuType === 'font' || menuType === 'logo' || menuType === 'wallpaper') {
        let dragCounter = 0;
        const showOverlay = () => {
            let overlay = rightPanelUpper.querySelector('.theme-drop-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'theme-drop-overlay';
                overlay.innerHTML = '<div class="theme-drop-overlay-text">释放文件以导入</div>';
                rightPanelUpper.appendChild(overlay);
            }
            overlay.style.display = 'flex';
        };
        const hideOverlay = () => {
            const overlay = rightPanelUpper.querySelector('.theme-drop-overlay');
            if (overlay) overlay.style.display = 'none';
        };
        rightPanelUpper._dragenter = (e) => { e.preventDefault(); e.stopPropagation(); dragCounter++; if (dragCounter === 1) showOverlay(); };
        rightPanelUpper._dragover = (e) => { e.preventDefault(); e.stopPropagation(); };
        rightPanelUpper._dragleave = (e) => { e.preventDefault(); e.stopPropagation(); dragCounter--; if (dragCounter <= 0) { dragCounter = 0; hideOverlay(); } };
        rightPanelUpper._drop = (e) => {
            e.preventDefault(); e.stopPropagation();
            dragCounter = 0; hideOverlay();
            const file = e.dataTransfer.files[0];
            if (!file) return;
            if (menuType === 'font' && (file.name.endsWith('.ttf') || file.name.endsWith('.otf'))) {
                self.handleFontUpload(file);
            } else if (menuType === 'logo' && file.type.startsWith('image/')) {
                self.handleLogoUpload(file);
            } else if (menuType === 'wallpaper' && file.type.startsWith('image/')) {
                self.handleWallpaperUpload(file);
            } else {
                self.showNotification(`不支持的${menuType === 'font' ? '字体' : menuType === 'logo' ? 'Logo' : '壁纸'}文件格式`);
            }
        };
        rightPanelUpper.addEventListener('dragenter', rightPanelUpper._dragenter);
        rightPanelUpper.addEventListener('dragover', rightPanelUpper._dragover);
        rightPanelUpper.addEventListener('dragleave', rightPanelUpper._dragleave);
        rightPanelUpper.addEventListener('drop', rightPanelUpper._drop);
        rightPanelUpper._dragCleanup = true;
    }

    if (menuType === 'context-menu') {
        const customizeBtn = document.createElement('button');
        customizeBtn.className = 'upload-btn settings-plus-btn';
        customizeBtn.innerHTML = '<span class="material-icons md3-icon" style="font-size:18px;display:flex;">settings</span>';
        customizeBtn.title = '自定义菜单项';
        if (self.settings.contextMenuStyle === 'minimal') {
            customizeBtn.style.setProperty('display', 'none', 'important');
        }

        customizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            self.renderContextMenuCustomizeView(rightPanelUpper);
        });

        buttonContainer.appendChild(customizeBtn);
    }

    container.appendChild(buttonContainer);
    rightPanelUpper.appendChild(container);
    document.getElementById('settings-modal').classList.add('right-panel-open');
},
showCustomColorEditorInPanel (rightPanelUpper, selected, hiddenSelect, text, optionsList, editIndex) {
    const self = this;

    // 编辑已有配色方案（editIndex 为 customColors 下标）时为编辑模式
    const editing = (typeof editIndex === 'number' && editIndex >= 0
        && Array.isArray(self.settings.customColors) && !!self.settings.customColors[editIndex]);
    const existing = editing ? self.settings.customColors[editIndex] : null;

    rightPanelUpper.innerHTML = '';
    rightPanelUpper.dataset.subView = 'custom-color-editor';

    const container = document.createElement('div');
    container.className = 'settings-menu-container slide-in-right';

    // 名称输入框
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = '自定义配色';
    nameInput.maxLength = 20;
    nameInput.value = '';
    nameInput.style.cssText = 'width:100%;padding:8px 10px;border:1px solid var(--border-color);border-radius:12px;font-size:13px;color:var(--text-color);background:transparent;margin-bottom:16px;box-sizing:border-box;';
    container.appendChild(nameInput);

    const updatePreview = (hexInput, previewEl) => {
        let val = hexInput.value.trim();
        if (val.startsWith('#')) val = val.substring(1);
        if (/^[0-9a-f]{6}$/i.test(val)) {
            previewEl.style.background = '#' + val;
        } else if (!val) {
            previewEl.style.background = 'transparent';
        }
    };

    // 临时保存编辑中的颜色值
    const editData = {
        primaryColor: '',
        secondaryColor: '',
        gradientEnabled: false,
        gradientStart: 0,
        gradientEnd: 100
    };

    // 主色
    const primaryRow = document.createElement('div');
    primaryRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;';
    const primaryLabel = document.createElement('span');
    primaryLabel.style.cssText = 'font-size:13px;color:var(--text-color);font-weight:500;';
    primaryLabel.textContent = '主色';
    primaryRow.appendChild(primaryLabel);
    const primaryWrapper = document.createElement('div');
    primaryWrapper.style.cssText = 'display:flex;align-items:center;gap:8px;';
    const primaryPreview = document.createElement('span');
    primaryPreview.style.cssText = 'width:24px;height:24px;border-radius:50%;border:1px solid var(--border-color);flex-shrink:0;background:transparent;';
    primaryWrapper.appendChild(primaryPreview);
    const primaryHex = document.createElement('input');
    primaryHex.type = 'text';
    primaryHex.value = '';
    primaryHex.placeholder = '#RRGGBB';
    primaryHex.maxLength = 7;
    primaryHex.spellcheck = false;
    primaryHex.style.cssText = 'width:90px;padding:8px 10px;border:1px solid var(--border-color);border-radius:12px;font-size:13px;font-family:\'SF Mono\',\'Cascadia Code\',Consolas,monospace;color:var(--text-color);background:transparent;text-transform:uppercase;letter-spacing:0.3px;';
    primaryWrapper.appendChild(primaryHex);
    primaryRow.appendChild(primaryWrapper);
    container.appendChild(primaryRow);

    // 副色
    const secondaryRow = document.createElement('div');
    secondaryRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;';
    const secondaryLabel = document.createElement('span');
    secondaryLabel.style.cssText = 'font-size:13px;color:var(--text-color);font-weight:500;';
    secondaryLabel.textContent = '副色（可选）';
    secondaryRow.appendChild(secondaryLabel);
    const secondaryWrapper = document.createElement('div');
    secondaryWrapper.style.cssText = 'display:flex;align-items:center;gap:8px;';
    const secondaryPreview = document.createElement('span');
    secondaryPreview.style.cssText = 'width:24px;height:24px;border-radius:50%;border:1px solid var(--border-color);flex-shrink:0;background:transparent;';
    secondaryWrapper.appendChild(secondaryPreview);
    const secondaryHex = document.createElement('input');
    secondaryHex.type = 'text';
    secondaryHex.value = '';
    secondaryHex.placeholder = '#RRGGBB';
    secondaryHex.maxLength = 7;
    secondaryHex.spellcheck = false;
    secondaryHex.style.cssText = 'width:90px;padding:8px 10px;border:1px solid var(--border-color);border-radius:12px;font-size:13px;font-family:\'SF Mono\',\'Cascadia Code\',Consolas,monospace;color:var(--text-color);background:transparent;text-transform:uppercase;letter-spacing:0.3px;';
    secondaryWrapper.appendChild(secondaryHex);
    secondaryRow.appendChild(secondaryWrapper);
    container.appendChild(secondaryRow);

    // 渐变开关
    const gradientRow = document.createElement('div');
    gradientRow.style.cssText = 'display:none;align-items:center;justify-content:space-between;margin-bottom:12px;';
    const gradientLabel = document.createElement('span');
    gradientLabel.style.cssText = 'font-size:13px;color:var(--text-color);font-weight:500;';
    gradientLabel.textContent = '渐变开关';
    gradientRow.appendChild(gradientLabel);
    const gradientSwitch = document.createElement('label');
    gradientSwitch.className = 'switch';
    const gradientCheckbox = document.createElement('input');
    gradientCheckbox.type = 'checkbox';
    gradientCheckbox.checked = false;
    const gradientSlider = document.createElement('span');
    gradientSlider.className = 'slider';
    gradientSwitch.appendChild(gradientCheckbox);
    gradientSwitch.appendChild(gradientSlider);
    gradientRow.appendChild(gradientSwitch);
    container.appendChild(gradientRow);

    // 渐变位置控制（直接在渐变条上拖拽）
    const gPosRow = document.createElement('div');
    gPosRow.style.cssText = 'display:none;margin-bottom:0;';
    gPosRow.id = 'gradient-position-row';

    // 拖拽状态
    let dragging = null; // 'start' | 'end' | null

    const commitGradientPos = () => {
        editData.gradientStart = curS;
        editData.gradientEnd = curE;
    };

    let curS = 0, curE = 100;

    const updateGradientUI = () => {
        gMarkerS.style.left = curS + '%';
        gMarkerE.style.left = curE + '%';
        gStartInput.value = curS;
        gEndInput.value = curE;
    };

    const posFromEvent = (e) => {
        const rect = gPreview.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        return Math.round(Math.max(0, Math.min(100, (x / rect.width) * 100)));
    };

    const onPointerDown = (e) => {
        e.preventDefault();
        const pos = posFromEvent(e);
        const dS = Math.abs(pos - curS);
        const dE = Math.abs(pos - curE);
        dragging = dS <= dE ? 'start' : 'end';
        gPreview.setPointerCapture(e.pointerId);
        gPreview.style.cursor = 'grabbing';
    };

    const onPointerMove = (e) => {
        if (!dragging) return;
        e.preventDefault();
        const pos = posFromEvent(e);
        if (dragging === 'start') {
            curS = Math.min(pos, curE);
        } else {
            curE = Math.max(pos, curS);
        }
        updateGradientUI();
    };

    const onPointerUp = (e) => {
        if (!dragging) return;
        dragging = null;
        gPreview.style.cursor = 'grab';
        commitGradientPos();
    };

    const updateGradientPreview = () => {
        const p = primaryHex.value.trim() ? primaryHex.value : '#cccccc';
        const s = secondaryHex.value.trim() ? secondaryHex.value : p;
        gPreview.style.background = 'linear-gradient(90deg, ' + p + ' 0%, ' + s + ' 100%)';
    };

    // 渐变条（可拖拽）
    const gPreview = document.createElement('div');
    gPreview.style.cssText = 'height:20px;border-radius:8px;margin:8px 0 12px;background:linear-gradient(90deg, #cccccc 0%, #cccccc 100%);border:1px solid var(--border-color);position:relative;cursor:grab;touch-action:none;';
    gPreview.addEventListener('pointerdown', onPointerDown);
    gPreview.addEventListener('pointermove', onPointerMove);
    gPreview.addEventListener('pointerup', onPointerUp);
    gPreview.addEventListener('pointercancel', onPointerUp);
    const gMarkerS = document.createElement('div');
    gMarkerS.style.cssText = 'position:absolute;top:-4px;left:' + curS + '%;width:4px;height:28px;border-radius:2px;background:var(--text-color);transform:translateX(-50%);transition:left 0.05s;pointer-events:none;';
    const gMarkerE = document.createElement('div');
    gMarkerE.style.cssText = 'position:absolute;top:-4px;left:' + curE + '%;width:4px;height:28px;border-radius:2px;background:var(--text-color);transform:translateX(-50%);transition:left 0.05s;pointer-events:none;';
    gPreview.appendChild(gMarkerS);
    gPreview.appendChild(gMarkerE);
    gPosRow.appendChild(gPreview);

    // 数值输入行（左右对称带标签）
    const gInputRow = document.createElement('div');
    gInputRow.style.cssText = 'display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:4px;';

    const makeInputGroup = (label, value, onChange) => {
        const group = document.createElement('div');
        group.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;';
        const lbl = document.createElement('span');
        lbl.style.cssText = 'font-size:12px;color:var(--text-secondary);font-weight:500;';
        lbl.textContent = label;
        group.appendChild(lbl);
        const inp = document.createElement('input');
        inp.type = 'number';
        inp.className = 'slider-value-input';
        inp.min = 0;
        inp.max = 100;
        inp.step = 1;
        inp.value = value;
        inp.style.width = '100%';
        inp.addEventListener('change', onChange);
        group.appendChild(inp);
        return group;
    };

    const gStartGroup = makeInputGroup('起始', curS, () => {
        let v = parseInt(gStartInput.value);
        if (isNaN(v) || v < 0) v = 0; if (v > 100) v = 100;
        if (v > curE) v = curE;
        curS = v; gStartInput.value = v;
        updateGradientUI();
        commitGradientPos();
    });
    const gStartInput = gStartGroup.querySelector('input');

    const gEndGroup = makeInputGroup('结束', curE, () => {
        let v = parseInt(gEndInput.value);
        if (isNaN(v) || v < 0) v = 0; if (v > 100) v = 100;
        if (v < curS) v = curS;
        curE = v; gEndInput.value = v;
        updateGradientUI();
        commitGradientPos();
    });
    const gEndInput = gEndGroup.querySelector('input');

    gInputRow.appendChild(gStartGroup);
    gInputRow.appendChild(gEndGroup);
    gPosRow.appendChild(gInputRow);

    updateGradientUI();
    container.appendChild(gPosRow);

    // 渐变行可见性
    const updateGradientRowVisibility = () => {
        const hasSec = secondaryHex.value.trim() ? true : false;
        gradientRow.style.display = hasSec ? 'flex' : 'none';
        gPosRow.style.display = (hasSec && gradientCheckbox.checked) ? 'block' : 'none';
    };
    updateGradientRowVisibility();

    // 编辑模式：预填已有配色方案的数值
    if (editing && existing) {
        nameInput.value = existing.name || '';
        primaryHex.value = existing.primaryColor || '';
        secondaryHex.value = existing.secondaryColor || '';
        gradientCheckbox.checked = !!existing.gradientEnabled;
        curS = (existing.gradientStart !== undefined && existing.gradientStart !== null) ? existing.gradientStart : 0;
        curE = (existing.gradientEnd !== undefined && existing.gradientEnd !== null) ? existing.gradientEnd : 100;
        updatePreview(primaryHex, primaryPreview);
        updatePreview(secondaryHex, secondaryPreview);
        updateGradientPreview();
        updateGradientRowVisibility();
        updateGradientUI();
    }

    const parseHex = (raw) => {
        let val = raw.trim();
        if (!val) return '';
        if (val.startsWith('#')) val = val.substring(1);
        if (/^[0-9a-f]{6}$/i.test(val)) return '#' + val.toUpperCase();
        return null;
    };

    // 事件 - 仅更新 UI，不保存
    primaryHex.addEventListener('input', () => {
        updatePreview(primaryHex, primaryPreview);
        editData.primaryColor = parseHex(primaryHex.value) || primaryHex.value.trim();
        updateGradientPreview();
    });
    primaryHex.addEventListener('blur', () => {
        const val = primaryHex.value.trim();
        if (!val) { primaryHex.value = ''; return; }
        const parsed = parseHex(primaryHex.value);
        if (!parsed) primaryHex.value = '';
        else primaryHex.value = parsed;
    });

    secondaryHex.addEventListener('input', () => {
        updatePreview(secondaryHex, secondaryPreview);
        editData.secondaryColor = parseHex(secondaryHex.value) || secondaryHex.value.trim();
        updateGradientRowVisibility();
        updateGradientPreview();
    });
    secondaryHex.addEventListener('blur', () => {
        const val = secondaryHex.value.trim();
        if (!val) { secondaryHex.value = ''; return; }
        const parsed = parseHex(secondaryHex.value);
        if (!parsed) secondaryHex.value = '';
        else secondaryHex.value = parsed;
    });

    gradientCheckbox.addEventListener('change', () => {
        editData.gradientEnabled = gradientCheckbox.checked;
        if (gradientCheckbox.checked && secondaryHex.value.trim()) {
            gPosRow.style.display = 'block';
        } else {
            gPosRow.style.display = 'none';
        }
    });

    // 底部按钮容器
    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;justify-content:flex-end;gap:10px;margin-top:auto;padding-top:12px;border-top:1px solid var(--border-color);';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = editing ? '删除' : '取消';
    cancelBtn.style.cssText = 'padding:8px 20px;border:1px solid var(--border-color);border-radius:12px;font-size:13px;color:var(--text-color);background:transparent;cursor:pointer;';
    if (editing) {
        cancelBtn.style.border = '1px solid rgba(220, 53, 69, 0.5)';
        cancelBtn.style.color = '#dc3545';
        cancelBtn.style.background = 'rgba(220, 53, 69, 0.1)';
    }
    cancelBtn.addEventListener('click', () => {
        if (editing) {
            // 编辑模式：左侧按钮为"删除"，删除该配色方案
            const arr = self.settings.customColors || [];
            const delIdx = editIndex;
            if (delIdx >= 0 && delIdx < arr.length) {
                arr.splice(delIdx, 1);
                self.settings.customColors = arr;
                if (self.settings.colorScheme === 'custom' && self.settings.activeCustomColorIndex === delIdx) {
                    self.settings.activeCustomColorIndex = -1;
                    self.settings.colorScheme = 'green';
                } else if (self.settings.colorScheme === 'custom' && self.settings.activeCustomColorIndex > delIdx) {
                    self.settings.activeCustomColorIndex -= 1;
                }
                // 手动改配色：解除主题对配色方面的接管
                self.checkThemeConsistency('colorScheme', self.settings.colorScheme);
                self.saveSettings();
                self.applyColorScheme();
                self.updateColorSchemeSelectDisplay();
            }
        }
        delete rightPanelUpper.dataset.subView;
        const items = document.getElementById('color-scheme-select-items');
        if (items && selected && hiddenSelect) {
            self.showSettingsMenuInRightPanel(items, selected, hiddenSelect, true);
        }
    });
    btnRow.appendChild(cancelBtn);

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = '确定';
    confirmBtn.style.cssText = 'padding:8px 20px;border:none;border-radius:12px;font-size:13px;color:#fff;background:var(--primary-color);cursor:pointer;';
    confirmBtn.addEventListener('click', () => {
        // 验证名称
        let name = nameInput.value.trim();
        if (!name) name = editing ? (existing.name || '自定义配色') : '自定义配色';
        // 验证主色
        const primaryParsed = parseHex(primaryHex.value);
        if (!primaryParsed) {
            self.showNotification('请输入有效的主色值');
            primaryHex.focus();
            return;
        }
        const secondaryParsed = parseHex(secondaryHex.value);
        const gradientEnabled = gradientCheckbox.checked;

        // 检查名称重复，生成唯一名称（编辑模式下保留自身原名不算重复）
        const existingNames = (self.settings.customColors || []).map((c, i) => (editing && i === editIndex) ? null : c.name).filter(Boolean);
        let finalName = name;
        if (existingNames.includes(finalName)) {
            let suffix = 2;
            while (existingNames.includes(finalName + '(' + suffix + ')')) {
                suffix++;
            }
            finalName = name + '(' + suffix + ')';
        }

        if (editing) {
            // 编辑模式：更新已有配色方案并激活
            const arr = self.settings.customColors || [];
            if (editIndex >= 0 && editIndex < arr.length) {
                arr[editIndex] = {
                    ...arr[editIndex],
                    name: finalName,
                    primaryColor: primaryParsed,
                    secondaryColor: secondaryParsed || '',
                    gradientEnabled: gradientEnabled,
                    gradientStart: curS,
                    gradientEnd: curE
                };
                self.settings.customColors = arr;
                self.settings.activeCustomColorIndex = editIndex;
                self.settings.colorScheme = 'custom';
                // 手动改配色：解除主题对配色方面的接管
                self.checkThemeConsistency('colorScheme', 'custom');
                self.saveSettings();
                self.applyColorScheme();
                // 立即更新左面板配色显示
                self.updateColorSchemeSelectDisplay();
            }
        } else {
            // 新建模式：保存到 customColors
            const newScheme = {
                name: finalName,
                primaryColor: primaryParsed,
                secondaryColor: secondaryParsed || '',
                gradientEnabled: gradientEnabled,
                gradientStart: curS,
                gradientEnd: curE
            };

            if (!self.settings.customColors) {
                self.settings.customColors = [];
            }
            self.settings.customColors.push(newScheme);
            const newIndex = self.settings.customColors.length - 1;
            self.settings.activeCustomColorIndex = newIndex;
            self.settings.colorScheme = 'custom';
            // 手动改配色：解除主题对配色方面的接管
            self.checkThemeConsistency('colorScheme', 'custom');
            self.saveSettings();
            self.applyColorScheme();
            // 立即更新左面板配色显示
            self.updateColorSchemeSelectDisplay();
        }

        // 重新渲染颜色方案列表并选中新创建的方案
        delete rightPanelUpper.dataset.subView;
        const items = document.getElementById('color-scheme-select-items');
        if (items && selected && hiddenSelect) {
            self.showSettingsMenuInRightPanel(items, selected, hiddenSelect, true);
        }
        self.showNotification('已保存配色方案"' + finalName + '"');
    });
    btnRow.appendChild(confirmBtn);

    container.appendChild(btnRow);
    rightPanelUpper.appendChild(container);
    // 强制限制容器高度，防止撑高弹窗
    const constrainHeight = () => {
        const parent = rightPanelUpper.parentElement;
        if (parent) {
            const px = parent.clientHeight - 60;
            if (px > 100) container.style.maxHeight = px + 'px';
        }
    };
    constrainHeight();
    // 窗口尺寸变化时重新计算
    const resizeHandler = () => constrainHeight();
    window.addEventListener('resize', resizeHandler);
    // 清理监听器
    const cleanup = () => window.removeEventListener('resize', resizeHandler);
    // 观察面板隐藏时清理
    const mo = new MutationObserver(() => {
        if (!rightPanelUpper.isConnected || rightPanelUpper.innerHTML === '') {
            cleanup();
            mo.disconnect();
        }
    });
    mo.observe(rightPanelUpper, { childList: true, subtree: false });
},
backToCustomColorView (rightPanelUpper) {
    if (rightPanelUpper) {
        delete rightPanelUpper.dataset.subView;
    }
    this._doBackToCustomColorView(rightPanelUpper);
},
_doBackToCustomColorView (rightPanelUpper) {
    const items = document.getElementById('color-scheme-select-items');
    if (!items) return;
    const selected = document.getElementById('color-scheme-select-selected');
    const hiddenSelect = document.getElementById('color-scheme-select');
    if (!selected || !hiddenSelect) return;
    this.showSettingsMenuInRightPanel(items, selected, hiddenSelect, true);
},
closeSettingsMenuInRightPanel () {
    const rightPanelUpper = document.getElementById('right-panel-upper');
    if (!rightPanelUpper) return;

    document.getElementById('settings-modal').classList.remove('right-panel-open');

    requestAnimationFrame(() => {
        rightPanelUpper.innerHTML = '';
        delete rightPanelUpper.dataset.menuType;
        delete rightPanelUpper.dataset.subView;
        this.showDefaultRightPanelContent(rightPanelUpper);
    });

    // 清理 body 上的弹窗
    const dd = document.querySelector('[data-import-dropdown]');
    if (dd) dd.remove();
    const fs = document.querySelector('[data-folder-submenu]');
    if (fs) fs.remove();
},
confirmRightPanelChanges () {
    const rightPanelUpper = document.getElementById('right-panel-upper');
    if (!rightPanelUpper) return;
    const menuType = rightPanelUpper.dataset.menuType;

    // 保存文字Logo输入
    if (menuType === 'logo') {
        const textLogoInput = document.getElementById('text-logo-input-panel');
        if (textLogoInput && textLogoInput.value.trim()) {
            const text = textLogoInput.value.trim();
            const getCharLength = (str) => {
                let length = 0;
                for (let i = 0; i < str.length; i++) {
                    const charCode = str.charCodeAt(i);
                    if (charCode > 127) {
                        length += 2;
                    } else {
                        length += 1;
                    }
                }
                return length;
            };
            if (getCharLength(text) <= 25) {
                this.settings.logoType = 'text';
                this.settings.logo = 'text-logo';
                this.settings.textLogo = text;
                this.userChangedLogo = true;
                this.checkThemeConsistency('logo', 'text-logo');
                this.applyLogo();
                this.saveSettings();
                this.showNotification('文字Logo设置');
                const selected = document.getElementById('logo-select-selected');
                const hiddenSelect = document.getElementById('logo-select');
                if (selected) selected.textContent = '自定义文字Logo';
                if (hiddenSelect) hiddenSelect.value = 'text-logo';
            }
        }
    }

    // 保存壁纸填满开关状态
    if (menuType === 'wallpaper') {
        const panelToggle = document.getElementById('wallpaper-fill-toggle-panel');
        if (panelToggle) {
            this.settings.wallpaperFill = panelToggle.checked;
            this.saveSettings();
            this.applyWallpaper();
        }
    }
},
showDefaultRightPanelContent (rightPanelUpper) {
    rightPanelUpper.innerHTML = '<div class="right-panel-placeholder-container"><div class="right-panel-placeholder"></div></div>';

    const placeholder = rightPanelUpper.querySelector('.right-panel-placeholder');
    if (placeholder) {
        if (this.settings.font === 'Ginto') {
            placeholder.style.fontFamily = `'Ginto', system-ui, -apple-system, sans-serif`;
        } else if (this.settings.font === 'Josefin') {
            placeholder.style.fontFamily = `'Josefin', 'Ginto', system-ui, -apple-system, sans-serif`;
        } else if (this.settings.font === 'Code') {
            placeholder.style.fontFamily = `'Code', 'Ginto', system-ui, -apple-system, sans-serif`;
        } else if (this.settings.font === 'HMSC') {
            placeholder.style.fontFamily = `'HMSC', system-ui, -apple-system, sans-serif`;
        } else if (this.settings.font === 'Sans Flex') {
            placeholder.style.fontFamily = `'Sans Flex', 'Ginto', system-ui, -apple-system, sans-serif`;
        } else {
            placeholder.style.fontFamily = `'${this.settings.font}', system-ui, -apple-system, sans-serif`;
        }
    }
},
updateSettingsButtonsPosition () {
    var buttons = document.querySelector('.setting-group.action-buttons');
    if (!buttons) return;
    var mobileContainer = document.getElementById('mobile-buttons-container');
    var rightPanelContent = document.querySelector('.right-panel-content');
    if (!mobileContainer || !rightPanelContent) return;
    if (window.innerWidth < 600) {
        if (buttons.parentElement !== mobileContainer) {
            mobileContainer.appendChild(buttons);
        }
    } else {
        if (buttons.parentElement !== rightPanelContent) {
            rightPanelContent.appendChild(buttons);
        }
    }
},
initSettingsMenus () {
    const rightPanelUpper = document.getElementById('right-panel-upper');
    if (rightPanelUpper) {
        this.showDefaultRightPanelContent(rightPanelUpper);
    }
},
};

// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

import { afterLoad } from '../first-paint.js';

// 画完再看像素里有没有透明。判容器是不够的：PNG 的调色板 + tRNS、WebP/AVIF 的
// alpha 通道都不体现在容器名上，而这里宁可多花一次 getImageData 也不能把用户的
// 透明壁纸压成黑底。读不出来（理论上不会，同源）就当有 alpha，退回原样存。
//
// 12MP 上这一次扫描实测 78ms（PNG 156ms），是整条压缩路径里最贵的一段。所以两头都收：
//   1) 「格式上装不下 alpha」的（JPEG、color type 0/2 的 PNG）在调用方就跳过，压根不进这里；
//   2) 真要扫时按 4 字节整字比，而不是逐字节跳 4 —— 实测 78ms → 13ms。
function canvasHasTransparency(ctx, w, h) {
    let d;
    try {
        d = ctx.getImageData(0, 0, w, h).data;
    } catch (e) {
        return true;   // 读不出来（理论上不会，同源）就当有 alpha，退回原样存
    }
    // 按 4 字节整字比：12MP 实测 78ms → 13ms。
    // alpha 是每个像素的第 4 个字节，小端机上就是 32 位字的最高字节，用 `>>> 24` 取。
    // **不能写 `(u[i] & 0xFF000000) !== 0xFF000000`** —— `&` 会把结果当 int32，最高位
    // 为 1 时是负数（-16777216），永远不等于那个正值字面量，于是每一张不透明图都被判成
    // 「有透明」、所有壁纸都被改存成 PNG（体积反而涨）。矩阵测试逮到的就是这个。
    try {
        const u = new Uint32Array(d.buffer, d.byteOffset, d.length >> 2);
        for (let i = 0; i < u.length; i++) {
            if ((u[i] >>> 24) !== 255) return true;
        }
        return false;
    } catch (e) {
        // 视图建不起来（理论上不会）就退回逐字节扫，别把「工具失败」当成「有 alpha」
        for (let i = 3; i < d.length; i += 4) {
            if (d[i] !== 255) return true;
        }
        return false;
    }
}

// 「这份字节在格式上就装不下 alpha 通道」—— 这是证明，不是猜测，所以可以据此跳过
// 上面那次全画布扫描。JPEG 的段结构里没有 alpha 可言；PNG 的 IHDR color type
// 0（灰度）与 2（真彩）也没有（3=调色板可能带 tRNS、4=灰度+alpha、6=RGBA 都得扫）。
// PNG 布局：8 字节签名 + 4 长度 + 'IHDR'，于是 data 从头算起是 16 宽 / 20 高 /
// 24 位深 / **25 颜色类型**。
function containerCannotHaveAlpha(bytes) {
    if (!bytes || bytes.length < 26) return false;
    if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) return true;
    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
        const colorType = bytes[25];
        return colorType === 0 || colorType === 2;
    }
    return false;
}

export const AssetsMixin = {
    loadCustomFonts() {
        const promises = this.settings.customFonts.map(font => {
            try {
                const buffer = this.dataUrlToArrayBuffer(font.data);
                const fontFace = new FontFace(font.name, buffer);
                return fontFace.load().then((loadedFace) => {
                    document.fonts.add(loadedFace);
                }).catch((error) => {
                    console.error('自定义字体加载失败:', error);
                });
            } catch (error) {
                console.error('自定义字体解码失败:', error);
                return Promise.resolve();
            }
        });
        return Promise.all(promises);
    },
    handleLogoSelectChange(value) {
        const textLogoGroup = document.getElementById('text-logo-inline-group');
        const textLogoItem = document.querySelector('.select-item-text-logo');

        // 移除所有选项的selected类
        document.querySelectorAll('#logo-select-items .select-item').forEach(item => {
            item.classList.remove('selected');
        });

        if (value === 'text-logo') {
            // 给文字Logo选项添加selected类
            textLogoItem.classList.add('selected');
            // 显示文字Logo输入框
            textLogoGroup.style.display = 'flex';

            // 如果已经有文字Logo内容，直接应用
            const textInput = document.getElementById('text-logo-input');
            if (textInput.value.trim()) {
                this.setTextLogo();
            }
        } else {
            // 隐藏文字Logo输入框
            textLogoGroup.style.display = 'none';

            this.changeLogo(value);
        }

        this.updateSettingsUI();
    },
    dataUrlToArrayBuffer(dataUrl) {
        const base64 = dataUrl.split(',')[1];
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer;
    },
    handleFontUpload(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const fontData = e.target.result;
            const fontName = file.name.replace(/\.[^/.]+$/, ""); // 移除扩展名

            // 检查是否已存在同名字体
            if (this.settings.customFonts.some(font => font.name === fontName)) {
                this.showNotification(`字体"${fontName}"已存在`);
                return;
            }

            try {
                // 使用 ArrayBuffer 直接构造 FontFace，绕过 CSP url() 限制
                const buffer = this.dataUrlToArrayBuffer(fontData);
                const fontFace = new FontFace(fontName, buffer);

                fontFace.load().then((loadedFace) => {
                    try {
                        document.fonts.add(loadedFace);

                        // 添加到自定义字体列表
                        this.settings.customFonts.push({
                            name: fontName,
                            data: fontData
                        });

                        // 更新自定义字体列表
                        this.updateCustomFontsList();

                        // 自定义字体上传必然与主题字体不一致
                        this.checkThemeConsistency('font', fontName);

                        this.saveSettings();
                        this.showNotification(`字体"${fontName}"上传成功`);

                        // 刷新右侧面板菜单（如果打开）
                        const rightPanelUpper = document.getElementById('right-panel-upper');
                        if (rightPanelUpper && rightPanelUpper.querySelector('.settings-menu-container')) {
                            const selected = document.getElementById('font-select-selected');
                            const hiddenSelect = document.getElementById('font-select');
                            const items = document.getElementById('font-select-items');
                            this.showSettingsMenuInRightPanel(items, selected, hiddenSelect);
                        }
                    } catch (err) {
                        console.error('字体上传后处理异常:', err);
                        this.showNotification('字体上传处理出错: ' + err.message);
                    }
                }).catch((error) => {
                    console.error('字体加载失败:', error);
                    this.showNotification('字体加载失败');
                });
            } catch (error) {
                console.error('字体解码失败:', error);
                this.showNotification('字体文件格式不支持');
            }
        };

        reader.onerror = () => {
            this.showNotification('文件读取失败');
        };

        reader.readAsDataURL(file);
    },
    handleLogoUpload(file) {
        if (!file) return;

        // 检查文件大小（限制为2MB）
        if (file.size > 2 * 1024 * 1024) {
            this.showNotification('图片文件过大，请选择小于2MB的文件');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const logoData = e.target.result;
            const logoName = file.name.replace(/\.[^/.]+$/, ""); // 移除扩展名

            // 检查是否已存在同名Logo
            if (this.settings.customLogos.some(logo => logo.name === logoName)) {
                this.showNotification(`Logo"${logoName}"已存在`);
                return;
            }

            // 添加到自定义Logo列表
            this.settings.customLogos.push({
                name: logoName,
                data: logoData,
                darkData: null
            });

            // 更新自定义Logo列表显示
            this.updateCustomLogosList();

            // 自定义 Logo 上传必然与主题 Logo 不一致
            this.checkThemeConsistency('logo', logoName);

            this.saveSettings();
            this.showNotification(`Logo"${logoName}"上传成功`);

            // 刷新右侧面板菜单（如果打开）
            const rightPanelUpper = document.getElementById('right-panel-upper');
            if (rightPanelUpper && rightPanelUpper.querySelector('.settings-menu-container')) {
                const selected = document.getElementById('logo-select-selected');
                const hiddenSelect = document.getElementById('logo-select');
                const items = document.getElementById('logo-select-items');
                this.showSettingsMenuInRightPanel(items, selected, hiddenSelect);
            }
        };

        reader.onerror = () => {
            this.showNotification('文件读取失败');
        };

        reader.readAsDataURL(file);
    },
    handleDarkLogoUpload(file) {
        if (!file) return;

        // 检查文件大小（限制为2MB）
        if (file.size > 2 * 1024 * 1024) {
            this.showNotification('图片文件过大，请选择小于2MB的文件');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const darkLogoData = e.target.result;

            // 优先使用_currentDarkLogoTarget，否则使用当前选中的Logo
            const targetLogoName = this._currentDarkLogoTarget || this.settings.logo;

            // 查找目标自定义Logo
            const customLogo = this.settings.customLogos.find(logo => logo.name === targetLogoName);
            if (customLogo) {
                customLogo.darkData = darkLogoData;
                this.saveSettings();
                this.applyLogo();
                this.showNotification('暗色Logo上传');

                // 刷新右侧面板以更新按钮文字
                const rightPanelUpper = document.getElementById('right-panel-upper');
                if (rightPanelUpper && rightPanelUpper.querySelector('.settings-menu-container')) {
                    const selected = document.getElementById('logo-select-selected');
                    const hiddenSelect = document.getElementById('logo-select');
                    const items = document.getElementById('logo-select-items');
                    if (selected && hiddenSelect && items) {
                        this.showSettingsMenuInRightPanel(items, selected, hiddenSelect);
                    }
                }
            } else {
                this.showNotification('请先选择一个Logo');
            }

            // 清除临时目标
            this._currentDarkLogoTarget = null;
        };
        reader.onerror = () => {
            this.showNotification('文件读取失败');
        };

        reader.readAsDataURL(file);
    },
    // File 入口，实现在 compressImageBytes 里
    compressImage(file, maxWidth, maxHeight, quality) {
        return file.arrayBuffer()
            .then((buf) => this.compressImageBytes(new Uint8Array(buf), file.type, maxWidth, maxHeight, quality));
    },
    // 从字节压缩。走 Blob URL 而不是 FileReader.readAsDataURL —— 后者会先造一份
    // base64 字符串（10MB 的文件就是 13MB 的字符串），而我们紧接着就要把它解码成
    // 像素，那份字符串纯属白造。迁移已有壁纸时手里也只有字节，没有 File。
    // 出口是 JPEG：canvas.toDataURL 只有 JPEG 能调质量，尺寸压下来之后再编码成 PNG
    // 只会更大。preserveAlpha 为真时，若原图确实带透明像素就改用 PNG ——
    // 壁纸是满屏铺的，把透明区域压成黑色是实打实的观感变化。
    compressImageBytes(bytes, mime, maxWidth, maxHeight, quality, preserveAlpha) {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(new Blob([bytes], { type: mime || 'image/jpeg' }));
            const img = new Image();
            const done = () => {
                img.onload = null;
                img.onerror = null;
                URL.revokeObjectURL(url);
            };
            img.onload = () => {
                let w = img.width;
                let h = img.height;
                if (w > maxWidth || h > maxHeight) {
                    const ratio = Math.min(maxWidth / w, maxHeight / h);
                    w = Math.round(w * ratio);
                    h = Math.round(h * ratio);
                }
                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);
                let out;
                // preserveAlpha 的调用方（壁纸）宁愿多扫一次，也不愿把透明图压成黑底；
                // 但「格式上不可能有 alpha」时那次扫描是白扫，直接跳过（12MP 实测省 78ms）。
                if (preserveAlpha && !containerCannotHaveAlpha(bytes) && canvasHasTransparency(ctx, w, h)) {
                    out = canvas.toDataURL('image/png');
                } else {
                    out = canvas.toDataURL('image/jpeg', quality);
                }
                done();
                resolve(out);
            };
            img.onerror = () => {
                done();
                reject(new Error('图片加载失败'));
            };
            img.src = url;
        });
    },
    updateCustomLogosList() {
        // 更新下拉菜单中的自定义Logo选项
        const logoSelectItems = document.getElementById('logo-select-items');
        const logoSelect = document.getElementById('logo-select');
        const logoSelectSelected = document.getElementById('logo-select-selected');

        if (!logoSelectItems || !logoSelect) return;

        // 移除已有的自定义Logo选项（支持多种标识符）
        const existingCustomItems = logoSelectItems.querySelectorAll('.select-item-custom-logo, .select-item[data-custom="true"]');
        existingCustomItems.forEach(item => item.remove());

        const existingCustomOptions = logoSelect.querySelectorAll('option.custom-logo-option, option[data-custom="true"]');
        existingCustomOptions.forEach(option => option.remove());

        // 添加自定义Logo选项
        this.settings.customLogos.forEach(logo => {
            // 添加到下拉菜单
            const selectItem = document.createElement('div');
            selectItem.className = 'select-item select-item-custom-logo';
            selectItem.setAttribute('data-value', logo.name);
            selectItem.textContent = logo.name;
            logoSelectItems.appendChild(selectItem);

            // 添加到隐藏的select
            const option = document.createElement('option');
            option.value = logo.name;
            option.textContent = logo.name;
            option.className = 'custom-logo-option';
            logoSelect.appendChild(option);
        });

        // 更新显示的文本
        if (logoSelectSelected) {
            // 主题模式下保持"主题名：Logo名"格式，不覆盖
            const themeInfo = this.getThemeDisplayInfo();
            if (themeInfo && themeInfo.logoName) {
                // 保持不变
            } else {
                const selectedOption = logoSelect.querySelector(`option[value="${this.settings.logo}"]`);
                if (selectedOption) {
                    logoSelectSelected.textContent = selectedOption.textContent;
                }
            }
        }

        // 重新绑定下拉菜单点击事件
        this.rebindCustomSelectItems();
    },
    deleteCustomLogo(index) {
        const logoName = this.settings.customLogos[index].name;

        // 从设置中移除
        this.settings.customLogos.splice(index, 1);

        // 如果当前使用的是被删除的Logo，则切换回默认Logo
        if (this.settings.logo === logoName) {
            this.settings.logo = 'default';
            this.applyLogo();
        }

        // 更新自定义Logo列表显示（会自动清理DOM）
        this.updateCustomLogosList();
        this.saveSettings();
        this.showNotification('自定义Logo删除');
    },
    deleteCustomFont(index) {
        const fontName = this.settings.customFonts[index].name;

        // 从设置中移除
        this.settings.customFonts.splice(index, 1);

        // 从 document.fonts 中移除对应的 FontFace
        for (const face of document.fonts) {
            if (face.family === fontName) {
                document.fonts.delete(face);
                break;
            }
        }

        // 如果当前使用的是被删除的字体，则切换回默认字体
        if (this.settings.font === fontName) {
            this.settings.font = 'Sans Flex';
            this.applyFont();
        }

        // 更新自定义字体列表显示
        this.updateCustomFontsList();
        this.saveSettings();
        this.showNotification('字体已删除');
    },
    updateCustomFontsList() {
        const fontSelectItems = document.getElementById('font-select-items');
        const fontSelect = document.getElementById('font-select');
        const fontSelectSelected = document.getElementById('font-select-selected');

        if (!fontSelectItems || !fontSelect) return;

        // 移除已有的自定义字体选项（支持多种标识符）
        const existingCustomItems = fontSelectItems.querySelectorAll('.select-item-custom-font, .select-item[data-custom="true"]');
        existingCustomItems.forEach(item => item.remove());

        const existingCustomOptions = fontSelect.querySelectorAll('option.custom-font-option, option[data-custom="true"]');
        existingCustomOptions.forEach(option => option.remove());

        // 添加自定义字体选项
        this.settings.customFonts.forEach(font => {
            // 添加到下拉菜单
            const selectItem = document.createElement('div');
            selectItem.className = 'select-item select-item-custom-font';
            selectItem.setAttribute('data-value', font.name);
            selectItem.textContent = font.name;
            fontSelectItems.appendChild(selectItem);

            // 添加到隐藏的select
            const option = document.createElement('option');
            option.value = font.name;
            option.textContent = font.name;
            option.className = 'custom-font-option';
            fontSelect.appendChild(option);
        });

        // 更新显示的文本
        if (fontSelectSelected) {
            const themeInfo = this.getThemeDisplayInfo();
            if (!themeInfo || !themeInfo.fontName) {
                const selectedOption = fontSelect.querySelector(`option[value="${this.settings.font}"]`);
                if (selectedOption) {
                    fontSelectSelected.textContent = selectedOption.textContent;
                }
            }
        }
    },
    uploadDarkLogo(index) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        // 安全移除 fileInput（click 后立即移除会导致部分浏览器文件对话框失效）
        const removeFileInput = () => {
            setTimeout(() => {
                if (fileInput.parentNode) {
                    fileInput.parentNode.removeChild(fileInput);
                }
            }, 0);
        };

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) {
                removeFileInput();
                return;
            }

            // 检查文件大小（限制为2MB）
            if (file.size > 2 * 1024 * 1024) {
                this.showNotification('图片文件过大，请选择小于2MB的文件');
                removeFileInput();
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const darkLogoData = e.target.result;
                this.settings.customLogos[index].darkData = darkLogoData;
                this.saveSettings();
                this.applyLogo();
                this.updateCustomLogosList();
                this.showNotification('暗色Logo上传');
            };
            reader.onerror = () => {
                this.showNotification('文件读取失败');
            };

            reader.readAsDataURL(file);
            removeFileInput();
        });

        // 用户取消选择时也移除输入元素
        fileInput.addEventListener('cancel', removeFileInput);

        document.body.appendChild(fileInput);
        fileInput.click();
    },
    deleteDarkLogo(index) {
        this.settings.customLogos[index].darkData = null;
        this.saveSettings();
        this.applyLogo();
        this.updateCustomLogosList();
        this.showNotification('暗色Logo删除');
    },
    setTextLogo() {
        const textInput = document.getElementById('text-logo-input');
        const text = textInput.value.trim();

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

        if (text) {
            // 检查字符长度
            if (getCharLength(text) > 25) {
                this.showNotification('超出输入范围');
                return;
            }

            this.settings.logoType = 'text';
            this.settings.logo = 'text-logo';
            this.settings.textLogo = text;
            this.userChangedLogo = true;
            this.checkThemeConsistency('logo', 'text-logo');
            this.applyLogo();
            this.saveSettings();
            this.showNotification('文字Logo设置');

            // 更新select-selected的显示文本
            const selected = document.getElementById('logo-select-selected');
            if (selected) {
                selected.textContent = '自定义文字Logo';
            }

            // 更新隐藏的select元素的值
            const hiddenSelect = document.getElementById('logo-select');
            if (hiddenSelect) {
                hiddenSelect.value = 'text-logo';
            }

            // 关闭下拉菜单
            const items = document.getElementById('logo-select-items');
            if (items) {
                items.classList.add('select-hide');
            }
        } else {
            this.showNotification('请输入文本');
        }
    },
    changeFont(font) {
        this.settings.font = font;
        this.checkThemeConsistency('font', font);
        this.saveSettings();
        // 不立即应用，等待用户点击应用按钮
    },
    changeLogo(logo) {
        this.settings.logo = logo;
        this.settings.logoType = 'image';
        this.userChangedLogo = true;
        this.checkThemeConsistency('logo', logo);
        this.saveSettings();
        this.applyLogo();

        // 移除应用按钮的所有logo类，保持蓝色
        this.updateApplyButtonColor();
    },
    applyFont() {
        // 移除所有字体类
        const fontClasses = ['font-ginto', 'font-josefin', 'font-code', 'font-hmsc'];
        fontClasses.forEach(fontClass => {
            document.body.classList.remove(fontClass);
        });

        // 移除自定义字体类
        this.settings.customFonts.forEach(font => {
            const safeClassName = 'font-' + font.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
            document.body.classList.remove(safeClassName);
        });

        // 直接设置字体而不是使用CSS类
        if (this.settings.customFonts.some(font => font.name === this.settings.font)) {
            // 对于自定义字体，直接设置font-family（加引号防止含空格的字体名被拆分）
            document.body.style.fontFamily = `'${this.settings.font}'`;
        } else {
            // 对于预定义字体，使用CSS类
            document.body.style.fontFamily = ''; // 重置为默认
            switch (this.settings.font) {
                case 'Ginto':
                    document.body.classList.add('font-ginto');
                    break;
                case 'Josefin':
                    document.body.classList.add('font-josefin');
                    break;
                case 'Code':
                    document.body.classList.add('font-code');
                    break;
                case 'HMSC':
                    document.body.classList.add('font-hmsc');
                    break;
                default:
                    if (this.settings.font && this.settings.font !== 'Sans Flex') {
                        document.body.style.fontFamily = `'${this.settings.font}'`;
                    }
                    break;
            }
        }
    },
    loadIconWithFallback(iconName, logoElement) {
        const onlineUrl = this.onlineIcons[iconName];
        const localUrl = `images/${iconName}`;

        if (!onlineUrl) {
            logoElement.src = localUrl;
            return;
        }

        if (this.iconLoadStatus[iconName] === 'online') {
            logoElement.src = onlineUrl;
            return;
        }

        if (this.iconLoadStatus[iconName] === 'local') {
            logoElement.src = localUrl;
            return;
        }

        logoElement.src = localUrl;

        // 在线 logo 探测是「锦上添花」：本地图已经在显示（images/dll.png 就在扩展里）。
        // 起跑推到 **load 之后** —— 这个 new Image() 在 load 之前开始加载的话，
        // 会把 window.load 一起拖到图片下完（线上这张 2MB，实测 1.9 秒）。
        // 判定结果与回填路径不变。
        afterLoad(() => {
            const testImg = new Image();
            testImg.onload = () => {
                this.iconLoadStatus[iconName] = 'online';
                logoElement.src = onlineUrl;
            };
            testImg.onerror = () => {
                this.iconLoadStatus[iconName] = 'local';
                logoElement.src = localUrl;
            };
            testImg.src = onlineUrl;
        });
    },
    applyLogo() {
        const logoElement = document.getElementById('logo');
        const textLogoElement = document.getElementById('text-logo');

        this.updateContextMenuColors();

        if (this.infoManager) {
            this.infoManager.updateInfoIndicatorColor();
        }

        if (this.settings.logo === 'text-logo') {
            // 显示文字Logo
            logoElement.style.display = 'none';
            textLogoElement.style.display = 'block';
            textLogoElement.textContent = this.settings.textLogo;

            // 设置文字Logo字体（加引号防止含空格的字体名被拆分）
            textLogoElement.style.fontFamily = `'${this.getFontFamily()}'`;

            // 设置文字Logo颜色（日间黑色，夜间白色）
            textLogoElement.style.color = this.isDarkMode ? '#ffffff' : '#000000';
        } else {
            // 显示图片Logo
            logoElement.style.display = 'block';
            textLogoElement.style.display = 'none';

            // 主题 Logo 覆盖：使用主题定义的 location / dark / online / 尺寸
            if (this.settings.themeEnabled && this.themeOverrides?.logo) {
                const o = this.themeOverrides.logo;
                const isDark = this.isDarkMode;
                if (o.width) logoElement.style.width = o.width;
                else logoElement.style.width = '';
                if (o.height) logoElement.style.height = o.height;
                else logoElement.style.height = '';

                const onlineUrl = isDark ? (o.onlineDark || o.online) : o.online;
                const localUrl = isDark && o.dark ? o.dark : o.location;
                this.loadThemeLogoWithFallback(onlineUrl, localUrl, logoElement);
                logoElement.alt = this.settings.logo;
            } else {
                // 清除主题遗留的尺寸样式
                logoElement.style.width = '';
                logoElement.style.height = '';

                // 根据当前主题选择对应的Logo文件
                const logoMap = {
                    'default': this.isDarkMode ? 'dln.png' : 'dll.png',
                    'Google': this.isDarkMode ? 'gln.png' : 'gll.png',
                    'Microsoft': this.isDarkMode ? 'mln.png' : 'mll.png',
                    'Apple': this.isDarkMode ? 'aln.png' : 'all.png',
                    'HUAWEI': this.isDarkMode ? 'hln.png' : 'hll.png'
                };

                // 自动模式逻辑
                let currentLogo = this.settings.logo;
                if (currentLogo === 'auto') {
                    currentLogo = this.currentEngine === 'google' ? 'Google' : 'Microsoft';
                }

                // 检查是否是自定义Logo
                const customLogo = this.settings.customLogos.find(logo => logo.name === currentLogo);
                if (customLogo) {
                    if (this.isDarkMode && customLogo.darkData) {
                        logoElement.src = customLogo.darkData;
                    } else {
                        logoElement.src = customLogo.data;
                    }
                } else if (logoMap[currentLogo]) {
                    const iconName = logoMap[currentLogo];
                    if (currentLogo === 'default' && this.onlineIcons[iconName]) {
                        this.loadIconWithFallback(iconName, logoElement);
                    } else {
                        logoElement.src = `images/${iconName}`;
                    }
                }
                logoElement.alt = this.settings.logo;
            }
        }

        // 更新搜索引擎按钮类名
        this.updateEngineButtonClasses();

        // 更新侧边栏图标配色
        this.updateSidebarIconColors();
    },
    getFontFamily() {
        if (this.settings.customFonts.some(font => font.name === this.settings.font)) {
            return this.settings.font;
        } else {
            switch (this.settings.font) {
                case 'Ginto': return 'Ginto';
                case 'Josefin': return 'Josefin';
                case 'Code': return 'Code';
                case 'HMSC': return 'HMSC';
                case 'Sans Flex': return 'Sans Flex';
                default: return this.settings.font || 'Sans Flex';
            }
        }
    },
};

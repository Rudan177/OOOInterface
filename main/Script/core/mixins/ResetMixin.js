// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

export const ResetMixin = {
    resetToDefaults() {
        this.settings = JSON.parse(JSON.stringify(this.defaultSettings));
        this.userChangedLogo = false;
        this.applySettings();
        this.saveSettings();

        // 重置欢迎界面状态
        localStorage.removeItem('hasVisited');
        localStorage.removeItem('oooInterfaceFirstRun');
        localStorage.removeItem('welcVersion');

        // 更新设置界面中的值（需在 reload 前执行，否则不会生效）
        if (document.getElementById('settings-modal').classList.contains('show')) {
            this.updateSettingsUI();
        }

        // 显示重置成功的提示（需在 reload 前执行，否则不会显示）
        this.showNotification('已重置');

        // 重置后刷新页面以显示欢迎页面
        location.reload();
    },
    showResetConfirmation(onConfirm) {
        const overlay = document.createElement('div');
        overlay.className = 'confirm-overlay';

        if (this.settings.dynamicBlur) {
            overlay.classList.add('blur-effect');
        }

        const close = () => {
            overlay.classList.remove('show');
            setTimeout(() => {
                if (overlay.parentNode) document.body.removeChild(overlay);
            }, 350);
        };

        // ---- 第一步：红色警报确认 ----
        overlay.innerHTML = `
            <div class="confirm-dialog" id="reset-confirm-dialog">
                <div class="confirm-dialog-icon">
                    <span class="material-icons" style="font-size:48px;color:#ffffff;">warning</span>
                </div>
                <div class="confirm-dialog-title">请确认重置</div>
                <div class="confirm-dialog-message">此操作将不可逆</div>
                <div class="confirm-dialog-buttons">
                    <button class="confirm-dialog-btn confirm-dialog-btn-cancel" id="reset-confirm-cancel1">取消</button>
                    <button class="confirm-dialog-btn confirm-dialog-btn-confirm" id="reset-confirm-ok1">确认</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('show'));

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });

        document.getElementById('reset-confirm-cancel1').addEventListener('click', close);

        document.getElementById('reset-confirm-ok1').addEventListener('click', () => {
            const d1 = document.getElementById('reset-confirm-dialog');
            d1.style.transform = 'scale(0.92) translateY(20px)';
            d1.style.opacity = '0';

            setTimeout(() => this._showCaptcha(overlay, close, onConfirm), 250);
        });
    },
    _showCaptcha(overlay, close, onConfirm) {
        const pieceSize = 44;
        const imgH = 170;
        const targetY = Math.floor((imgH - pieceSize) / 2);

        overlay.innerHTML = `
            <div class="captcha-dialog" id="captcha-dialog">
                <div class="captcha-image" id="captcha-image">
                    <div class="captcha-hole" id="captcha-hole" style="top:${targetY}px;"></div>
                    <div class="captcha-piece" id="captcha-piece" style="top:${targetY}px;"></div>
                </div>
                <div class="captcha-slider-wrapper" id="captcha-track">
                    <div class="captcha-slider-fill" id="captcha-fill"></div>
                    <div class="captcha-slider-thumb" id="captcha-thumb">▶</div>
                </div>
                <div class="captcha-hint" id="captcha-hint">拖动滑块完成验证</div>
            </div>
        `;

        requestAnimationFrame(() => {
            const d = document.getElementById('captcha-dialog');
            const imgContainer = document.getElementById('captcha-image');
            const imgW = imgContainer.offsetWidth;
            const maxPiece = imgW - pieceSize;
            const minTarget = 20;
            const maxTarget = maxPiece - 20;
            const targetX = minTarget + Math.floor(Math.random() * Math.max(1, maxTarget - minTarget));

            document.getElementById('captcha-hole').style.left = targetX + 'px';
            const piece = document.getElementById('captcha-piece');
            piece.style.left = '0';
            piece.style.background = "url('images/back.png') -" + targetX + "px -" + targetY + "px / " + imgW + "px " + imgH + "px no-repeat";

            d.style.transform = 'scale(1) translateY(0)';
            d.style.opacity = '1';

            this._initCaptchaSlider(targetX, imgW, close, () => {
                d.style.transform = 'scale(0.92) translateY(20px)';
                d.style.opacity = '0';
                setTimeout(() => this._showFinalConfirm(overlay, close, onConfirm), 250);
            });
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });
    },
    _showFinalConfirm(overlay, close, onConfirm) {
        overlay.innerHTML = `
            <div class="confirm-dialog" id="reset-confirm-dialog">
                <div class="confirm-dialog-icon">
                    <span class="material-icons" style="font-size:48px;color:#ffffff;">warning</span>
                </div>
                <div class="confirm-dialog-title">请确认已知晓</div>
                <div class="confirm-dialog-message">此操作不可逆</div>
                <div class="confirm-dialog-checkbox">
                    <input type="checkbox" id="irreversible-checkbox">
                    <label for="irreversible-checkbox">我已知晓此操作不可逆</label>
                </div>
                <div class="confirm-dialog-buttons">
                    <button class="confirm-dialog-btn confirm-dialog-btn-cancel" id="reset-confirm-cancel2">取消</button>
                    <button class="confirm-dialog-btn confirm-dialog-btn-confirm" id="reset-confirm-ok2" disabled>确认</button>
                </div>
            </div>
        `;

        requestAnimationFrame(() => {
            const d = document.getElementById('reset-confirm-dialog');
            d.style.transform = 'scale(1) translateY(0)';
            d.style.opacity = '1';
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });

        document.getElementById('reset-confirm-cancel2').addEventListener('click', close);

        const checkbox = document.getElementById('irreversible-checkbox');
        const okBtn = document.getElementById('reset-confirm-ok2');

        checkbox.addEventListener('change', () => {
            okBtn.disabled = !checkbox.checked;
        });

        okBtn.addEventListener('click', () => {
            if (checkbox.checked) {
                close();
                setTimeout(() => onConfirm(), 350);
            }
        });
    },
    _initCaptchaSlider(targetX, imgW, close, onSuccess) {
        const track = document.getElementById('captcha-track');
        const thumb = document.getElementById('captcha-thumb');
        const fill = document.getElementById('captcha-fill');
        const piece = document.getElementById('captcha-piece');
        const hint = document.getElementById('captcha-hint');
        const tolerance = 4;
        let dragging = false;
        let startX = 0;
        let thumbLeft = 0;
        let verified = false;
        let dragStartTime = 0;

        const halfThumb = 22;
        const maxOffset = track.offsetWidth - 44;
        const maxPiece = imgW - 44;

        thumb.style.left = '0';
        fill.style.width = halfThumb + 'px';
        piece.style.left = '0';

        function updatePos(clientX) {
            let dx = clientX - startX + thumbLeft;
            dx = Math.max(0, Math.min(maxOffset, dx));
            thumb.style.left = dx + 'px';
            fill.style.width = (dx + halfThumb) + 'px';
            const piecePos = (dx / maxOffset) * maxPiece;
            piece.style.left = Math.max(0, Math.min(maxPiece, piecePos)) + 'px';
            return dx;
        }

        function onStart(e) {
            if (verified) return;
            e.preventDefault();
            const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            dragging = true;
            startX = clientX;
            thumbLeft = parseInt(thumb.style.left) || 0;
            thumb.classList.remove('failed');
            hint.textContent = '拖动滑块完成验证';
            hint.className = 'captcha-hint';
            dragStartTime = Date.now();
        }

        function onMove(e) {
            if (!dragging || verified) return;
            e.preventDefault();
            updatePos(e.type === 'touchmove' ? e.touches[0].clientX : e.clientX);
        }

        function onEnd(e) {
            if (!dragging || verified) return;
            dragging = false;
            const pieceLeft = parseFloat(piece.style.left) || 0;

            if (Math.abs(pieceLeft - targetX) > tolerance) {
                thumb.classList.add('failed');
                hint.textContent = '验证失败，请重试';
                hint.className = 'captcha-hint error';
                setTimeout(() => {
                    thumb.classList.remove('failed');
                    thumb.style.left = '0';
                    fill.style.width = halfThumb + 'px';
                    piece.style.left = '0';
                }, 400);
                return;
            }

            const elapsed = Date.now() - dragStartTime;

            if (elapsed >= 1500) {
                thumb.classList.add('failed');
                hint.textContent = '验证失败，请重试';
                hint.className = 'captcha-hint error';
                setTimeout(() => {
                    thumb.classList.remove('failed');
                    thumb.style.left = '0';
                    fill.style.width = halfThumb + 'px';
                    piece.style.left = '0';
                }, 400);
                return;
            }

            verified = true;
            thumb.classList.add('verified');
            thumb.innerHTML = '<span class="material-icons" style="font-size:22px;">check</span>';

            if (elapsed < 1000) {
                hint.textContent = '我操，这么快，简直是神';
                hint.className = 'captcha-hint legend';
            } else {
                hint.textContent = '您已超过99.99%的用户';
                hint.className = 'captcha-hint top';
            }

            setTimeout(() => {
                hint.textContent = '';
                hint.className = 'captcha-hint';
                onSuccess();
            }, 1000);
        }

        thumb.addEventListener('mousedown', onStart);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);

        thumb.addEventListener('touchstart', onStart, { passive: false });
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onEnd);

    },
};

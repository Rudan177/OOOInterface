class Controller {
    constructor() {
        this.gamepadIndex = -1;
        this.connected = false;
        this.animationId = null;

        this.cursorX = window.innerWidth / 2;
        this.cursorY = window.innerHeight / 2;

        this.navTargets = [];
        this.navIndex = -1;

        this.btnState = {};
        this.prevBtnState = {};
        this._actPressTime = null;
        this._actLongFired = false;
        this.longPressThreshold = 500;

        this.ltHeld = false;
        this.rtHeld = false;
        this.dpadDir = null;
        this.rStickDir = null;
        this.lastNavTime = 0;
        this.ignoreNextActivate = false;

        this.radialActive = false;
        this.radialEl = null;
        this.radialSelected = null;
        this._radialMode = null;
        this.radialItems = [
            { action: 'clear', label: '清空', icon: 'clear_all' },
            { action: 'paste', label: '粘贴', icon: 'content_paste' },
            { action: 'settings', label: '设置', icon: 'settings' },
            { action: 'about', label: '关于', icon: 'info' },
            { action: 'switch-engine', label: '搜索切换', icon: 'travel_explore' },
            { action: 'wallpaper', label: '壁纸模式', icon: 'unfold_more' },
            { action: 'refresh', label: '刷新', icon: 'refresh' },
            { action: 'copy', label: '复制', icon: 'content_copy' },
        ];

        this.settings = {
            enabled: false,
            cursorSpeed: 6,
            invertAB: false,
            customLS: 'none',
            customRS: 'none'
        };

        this.DZ = 0.15;
        this.NAV_DZ = 0.5;
        this.TRIG = 0.5;
        this.NAV_DELAY = 380;
        this.NAV_RATE = 140;
        this.init();
    }

    init() {
        this.loadSettings();
        this.createCursor();
        this.bindEvents();
        this.initUI();
        this.detectConnectedGamepad();
        this.startLoop();
        this.syncSettingsUI();
    }

    detectConnectedGamepad() {
        const pads = navigator.getGamepads ? navigator.getGamepads() : [];
        for (let i = 0; i < pads.length; i++) {
            if (pads[i] && pads[i].connected) {
                this.gamepadIndex = pads[i].index;
                this.connected = true;
                if (this.settings.enabled) {
                    this.showCursor(true);
                    this.updateNavTargets();
                }
                break;
            }
        }
    }

    get ooo() {
        return this._ooo || window.oooInterface || null;
    }

    set ooo(val) {
        this._ooo = val;
    }

    createCursor() {
        const existing = document.getElementById('controller-cursor');
        if (existing) existing.remove();

        this.cursor = document.createElement('div');
        this.cursor.id = 'controller-cursor';
        this.cursor.style.cssText =
            'position:fixed;width:28px;height:28px;border-radius:50%;' +
            'border:2px solid var(--scheme-accent,#1a73e8);' +
            'background:rgba(var(--scheme-accent-rgb,26,115,232),0.12);' +
            'pointer-events:none;z-index:99998;' +
            'transform:translate(-50%,-50%);display:none;' +
            'transition:width .15s,height .15s,background .15s;' +
            'box-shadow:0 0 8px rgba(var(--scheme-accent-rgb,26,115,232),0.25);';

        const ring = document.createElement('div');
        ring.style.cssText =
            'position:absolute;top:50%;left:50%;' +
            'width:18px;height:18px;border-radius:50%;' +
            'border:1px solid rgba(var(--scheme-accent-rgb,26,115,232),0.3);' +
            'transform:translate(-50%,-50%);';
        this.cursor.appendChild(ring);

        const dot = document.createElement('div');
        dot.style.cssText =
            'position:absolute;top:50%;left:50%;' +
            'width:4px;height:4px;border-radius:50%;' +
            'background:var(--scheme-accent,#1a73e8);' +
            'transform:translate(-50%,-50%);';
        this.cursor.appendChild(dot);

        document.body.appendChild(this.cursor);
        this.cursorActive = false;
    }

    loadSettings() {
        try {
            const raw = localStorage.getItem('oooControllerSettings');
            if (raw) {
                const parsed = JSON.parse(raw);
                Object.assign(this.settings, parsed);
            }
        } catch (e) { /* ignore */ }
    }

    saveSettings() {
        try {
            localStorage.setItem('oooControllerSettings', JSON.stringify(this.settings));
        } catch (e) { /* ignore */ }
    }

    bindEvents() {
        window.addEventListener('gamepadconnected', (e) => {
            this.gamepadIndex = e.gamepad.index;
            this.connected = true;
            if (this.settings.enabled) {
                this.showCursor(true);
                this.updateNavTargets();
                if (this.ooo && !this.ooo.settings.hideNotifications) {
                    this.ooo.showNotification('手柄已连接');
                }
            }
        });

        window.addEventListener('gamepaddisconnected', (e) => {
            if (e.gamepad.index === this.gamepadIndex) {
                this.connected = false;
                this.gamepadIndex = -1;
                this.showCursor(false);
                this.clearHighlight();
                if (this.ooo && this.settings.enabled && !this.ooo.settings.hideNotifications) {
                    this.ooo.showNotification('手柄已断开');
                }
            }
        });

        window.addEventListener('resize', () => {
            this.cursorX = Math.min(this.cursorX, window.innerWidth - 10);
            this.cursorY = Math.min(this.cursorY, window.innerHeight - 10);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.radialActive) {
                this.hideRadialMenu();
            }
        });
    }

    startLoop() {
        const loop = () => {
            this.poll();
            this.animationId = requestAnimationFrame(loop);
        };
        loop();
    }

    poll() {
        if (!this.settings.enabled) {
            if (this.cursor.style.display !== 'none') {
                this.cursor.style.display = 'none';
                this.clearHighlight();
            }
            this.ltHeld = false;
            this.rtHeld = false;
            return;
        }

        const gamepad = navigator.getGamepads ? navigator.getGamepads()[this.gamepadIndex] : null;
        if (!gamepad || !this.connected) {
            if (this.cursor.style.display !== 'none') {
                this.cursor.style.display = 'none';
                this.clearHighlight();
            }
            return;
        }

        this.prevBtnState = Object.assign({}, this.btnState);
        this.btnState = {};
        for (let i = 0; i < gamepad.buttons.length; i++) {
            this.btnState[i] = gamepad.buttons[i].pressed;
        }

        this.handleTriggers(gamepad);

        if (this._skipStick) {
            this._skipStick = false;
            this.handleButtons();
            this.handleDpad();
            return;
        }

        if (!this.radialActive) {
            if (this.btnState[4]) {
                this.showRadialMenu('hold');
                return;
            }
            if (this.btnPressed(2)) {
                this.showRadialMenu('toggle');
                return;
            }
        }

        if (this.radialActive) {
            this.handleRadialStick(gamepad);
            this.handleRadialButtons();
        } else {
            this.handleSticks(gamepad);
            this.handleButtons();
            this.handleDpad();
        }
    }

    handleSticks(gamepad) {
        const lx = gamepad.axes[0] || 0;
        const ly = gamepad.axes[1] || 0;
        const rx = gamepad.axes[2] || 0;
        const ry = gamepad.axes[3] || 0;

        const lMag = Math.sqrt(lx * lx + ly * ly);
        if (lMag > this.DZ) {
            const normX = lx / lMag;
            const normY = ly / lMag;
            const adjMag = Math.min(1, (lMag - this.DZ) / (1 - this.DZ));
            const speed = this.settings.cursorSpeed * adjMag;
            this.cursorX += normX * speed;
            this.cursorY += normY * speed;
        }

        this.cursorX = Math.max(0, Math.min(window.innerWidth, this.cursorX));
        this.cursorY = Math.max(0, Math.min(window.innerHeight, this.cursorY));

        const rMag = Math.sqrt(rx * rx + ry * ry);
        if (rMag > this.NAV_DZ) {
            const angle = Math.atan2(-ry, rx) * (180 / Math.PI);
            let dir = null;
            if (angle > -45 && angle <= 45) dir = 'right';
            else if (angle > 45 && angle <= 135) dir = 'up';
            else if (angle > -135 && angle <= -45) dir = 'down';
            else dir = 'left';
            this.handleNavDirection(dir);
            this.rStickDir = dir;
        } else {
            this.rStickDir = null;
        }

        this.showCursor(true);
        this.cursor.style.left = this.cursorX + 'px';
        this.cursor.style.top = this.cursorY + 'px';
    }

    handleTriggers(gamepad) {
        if (this.isSliderActive()) return;

        const lt = gamepad.buttons[6] ? gamepad.buttons[6].value : 0;
        const rt = gamepad.buttons[7] ? gamepad.buttons[7].value : 0;

        if (lt > this.TRIG && !this.ltHeld) {
            this.ltHeld = true;
            this.doDelete();
        } else if (lt <= this.TRIG) {
            this.ltHeld = false;
        }

        if (rt > this.TRIG && !this.rtHeld) {
            this.rtHeld = true;
            this.doPaste();
        } else if (rt <= this.TRIG) {
            this.rtHeld = false;
        }
    }

    handleButtons() {
        const escBtn = this.settings.invertAB ? 1 : 0;
        const actBtn = this.settings.invertAB ? 0 : 1;

        if (this.isSliderActive()) {
            this.handleSliderBtns();
            return;
        }

        if (this.btnPressed(escBtn)) this.doEscape();
        if (this.btnPressed(3)) this.doEnter();
        if (this.btnPressed(5)) this.doCopy();
        if (this.btnPressed(10)) this.doCustomAction(this.settings.customLS);
        if (this.btnPressed(11)) this.doCustomAction(this.settings.customRS);

        this.handleActivateBtn(actBtn);
    }

    isSliderActive() {
        if (this.navIndex < 0 || this.navIndex >= this.navTargets.length) return false;
        const el = this.navTargets[this.navIndex];
        return el && el.classList.contains('slider-input');
    }

    handleSliderBtns() {
        const el = this.navTargets[this.navIndex];
        if (!el) return;
        const min = parseFloat(el.min) || 0;
        const max = parseFloat(el.max) || 100;
        const step = parseFloat(el.step) || 1;
        let delta = 0;
        if (this.btnPressed(4) || this.btnPressed(6)) delta -= step;
        if (this.btnPressed(5) || this.btnPressed(7)) delta += step;
        if (this.btnPressed(1)) delta += step;
        if (this.btnPressed(3)) delta += (max - min) * 0.1;
        if (delta !== 0) {
            let v = Math.round(((parseFloat(el.value) || min) + delta) / step) * step;
            v = Math.max(min, Math.min(max, v));
            el.value = v;
            el.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    handleActivateBtn(idx) {
        const pressed = this.btnPressed(idx);
        const held = this.btnState[idx];
        const released = this.btnReleased(idx);

        if (pressed) {
            this._actPressTime = Date.now();
            this._actLongFired = false;
        }

        if (held && !this._actLongFired) {
            if (Date.now() - this._actPressTime >= this.longPressThreshold) {
                this._actLongFired = true;
                this.onActivateHold();
            }
        }

        if (released) {
            if (!this._actLongFired) {
                this.handleActivate();
            }
            this._actPressTime = null;
        }
    }

    handleDpad() {
        const up = this.btnState[12] || false;
        const down = this.btnState[13] || false;
        const left = this.btnState[14] || false;
        const right = this.btnState[15] || false;

        let dir = null;
        if (up) dir = 'up';
        else if (down) dir = 'down';
        else if (left) dir = 'left';
        else if (right) dir = 'right';

        if (dir) {
            this.handleNavDirection(dir);
            this.dpadDir = dir;
        } else {
            this.dpadDir = null;
            this.checkDpadAxes();
        }
    }

    checkDpadAxes() {
        const gamepad = navigator.getGamepads ? navigator.getGamepads()[this.gamepadIndex] : null;
        if (!gamepad) return;
        const a = gamepad.axes;
        if (a.length < 8) return;
        let dx = a[6] || 0;
        let dy = a[7] || 0;
        if (Math.abs(dx) < this.DZ) dx = 0;
        if (Math.abs(dy) < this.DZ) dy = 0;
        if (dx === 0 && dy === 0) return;
        let dir;
        if (Math.abs(dx) > Math.abs(dy)) {
            dir = dx > 0 ? 'right' : 'left';
        } else {
            dir = dy > 0 ? 'down' : 'up';
        }
        this.handleNavDirection(dir);
        this.dpadDir = dir;
    }

    onActivateHold() {
        const badge = document.getElementById('ooo-badge');
        if (!badge) return;
        const br = badge.getBoundingClientRect();
        const cx = this.cursorX;
        const cy = this.cursorY;
        if (cx >= br.left && cx <= br.right && cy >= br.top && cy <= br.bottom) {
            this.ignoreNextActivate = true;
            if (this.ooo) this.ooo.openSettings('badge');
        }
    }

    btnPressed(idx) {
        return this.btnState[idx] && !this.prevBtnState[idx];
    }

    btnReleased(idx) {
        return !this.btnState[idx] && this.prevBtnState[idx];
    }

    handleNavDirection(dir) {
        const now = Date.now();
        const isRepeat = this.dpadDir === dir || this.rStickDir === dir;
        const delay = isRepeat ? this.NAV_RATE : this.NAV_DELAY;
        if (isRepeat && this.lastNavTime && (now - this.lastNavTime < delay)) return;
        this.lastNavTime = now;
        this.navigate(dir);
    }

    navigate(dir) {
        this.updateNavTargets();
        if (this.navTargets.length === 0) return;

        if (this.navIndex < 0 || this.navIndex >= this.navTargets.length) {
            this.navIndex = 0;
            this.highlightNavElement(this.navTargets[this.navIndex]);
            return;
        }

        const current = this.navTargets[this.navIndex];
        const cr = current.getBoundingClientRect();
        let bestIdx = -1;
        let bestDist = Infinity;

        this.navTargets.forEach((el, i) => {
            if (i === this.navIndex) return;
            if (!el.offsetParent && el.id !== 'search-input') return;

            const r = el.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            const ccx = cr.left + cr.width / 2;
            const ccy = cr.top + cr.height / 2;

            let dx = cx - ccx;
            let dy = cy - ccy;
            let ok = false;
            switch (dir) {
                case 'up': ok = dy < -10; break;
                case 'down': ok = dy > 10; break;
                case 'left': ok = dx < -10; break;
                case 'right': ok = dx > 10; break;
            }
            if (!ok) return;

            const dist = dx * dx + dy * dy;
            const angleWeight = this.directionWeight(dir, dx, dy);
            const score = dist / (angleWeight || 0.01);

            if (score < bestDist) {
                bestDist = score;
                bestIdx = i;
            }
        });

        if (bestIdx >= 0) {
            this.navIndex = bestIdx;
            this.highlightNavElement(this.navTargets[this.navIndex]);
        }
    }

    directionWeight(dir, dx, dy) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        let targetAngle;
        switch (dir) {
            case 'right': targetAngle = 0; break;
            case 'down': targetAngle = 90; break;
            case 'left': targetAngle = 180; break;
            case 'up': targetAngle = -90; break;
            default: return 1;
        }
        let diff = Math.abs(angle - targetAngle);
        if (diff > 180) diff = 360 - diff;
        return Math.max(0.01, 1 - diff / 180);
    }

    updateNavTargets() {
        const modal = document.getElementById('settings-modal');
        const inSettings = modal && modal.classList.contains('show');

        if (inSettings) {
            const root = document.querySelector('.modal-content');
            if (!root) { this.navTargets = []; return; }
            const all = root.querySelectorAll(
                'button, .select-selected, .select-item, ' +
                'input:not([type="file"]):not([type="hidden"]), ' +
                '.slider-input, .slider-value-input, ' +
                '.settings-menu-option, .quick-link-menu-item, ' +
                '.switch'
            );
            this.navTargets = Array.from(all).filter(el => {
                const style = window.getComputedStyle(el);
                if (style.display === 'none' || style.visibility === 'hidden') return false;
                if (el.classList.contains('switch')) return true;
                return el.offsetWidth > 0 && el.offsetHeight > 0;
            });
        } else {
            const ql = document.getElementById('quick-access-links');
            const qlVisible = ql && ql.style.display !== 'none';

            let targets = [];
            const si = document.getElementById('search-input');
            if (si) targets.push(si);

            const ge = document.getElementById('google-engine');
            const be = document.getElementById('bing-engine');
            if (ge) targets.push(ge);
            if (be) targets.push(be);

            if (qlVisible) {
                targets = targets.concat(Array.from(document.querySelectorAll('.quick-access-btn')));
            }

            if (document.body.classList.contains('sidebar-visible')) {
                targets = targets.concat(Array.from(
                    document.querySelectorAll('#quick-access-sidebar-links .quick-access-sidebar-link')
                ));
            }

            const shc = document.getElementById('search-history-container');
            if (shc && shc.classList.contains('show')) {
                targets = targets.concat(Array.from(
                    shc.querySelectorAll('.search-history-item, .search-history-delete')
                ));
            }

            const badge = document.getElementById('ooo-badge');
            if (badge) targets.push(badge);

            this.navTargets = targets;
        }
    }

    highlightNavElement(el) {
        this.clearHighlight();
        if (!el) return;

        if (el.id === 'search-input') {
            const container = el.closest('.search-container');
            if (container) {
                container.classList.add('controller-focus');
                container.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                return;
            }
        }

        if (el.classList.contains('switch')) {
            el.classList.add('controller-focus');
            el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            return;
        }

        el.classList.add('controller-focus');
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    clearHighlight() {
        document.querySelectorAll('.controller-focus').forEach(el => {
            el.classList.remove('controller-focus');
        });
    }

    showCursor(show) {
        if (show && this.settings.enabled && this.connected) {
            this.cursor.style.display = 'block';
            this.cursorActive = true;
        } else {
            this.cursor.style.display = 'none';
            this.cursorActive = false;
        }
    }

    clickAtCursor() {
        const el = document.elementFromPoint(this.cursorX, this.cursorY);
        if (!el) return;

        if (el.closest('.switch')) {
            el.closest('.switch').querySelector('input[type="checkbox"]').click();
            return;
        }

        if (el.id === 'search-input' || el.closest('.search-container')) {
            const si = document.getElementById('search-input');
            if (si && document.activeElement !== si) si.focus();
            if (si) {
                si.dispatchEvent(new MouseEvent('click', {
                    bubbles: true, cancelable: true,
                    clientX: this.cursorX, clientY: this.cursorY
                }));
            }
            return;
        }

        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.focus();
            el.dispatchEvent(new MouseEvent('click', {
                bubbles: true, cancelable: true,
                clientX: this.cursorX, clientY: this.cursorY
            }));
            return;
        }

        const target = el.closest(
            'button, a, [role="button"], .select-item, .quick-access-btn, .context-menu-item, ' +
            'label, .engine-btn, .search-history-item, .search-history-delete, .quick-access-sidebar-link'
        );
        if (target) {
            target.dispatchEvent(new MouseEvent('click', {
                bubbles: true, cancelable: true,
                clientX: this.cursorX, clientY: this.cursorY
            }));
        } else {
            el.dispatchEvent(new MouseEvent('click', {
                bubbles: true, cancelable: true,
                clientX: this.cursorX, clientY: this.cursorY
            }));
        }
    }

    focusSearchInput() {
        const si = document.getElementById('search-input');
        if (si) si.focus();
    }

    handleActivate() {
        if (this.ignoreNextActivate) {
            this.ignoreNextActivate = false;
            return;
        }
        this.clickAtCursor();
    }

    doDelete() {
        if (this.navIndex >= 0 && this.navIndex < this.navTargets.length) {
            const el = this.navTargets[this.navIndex];
            if (el && el.classList.contains('search-history-item') && this.ooo) {
                const query = el.dataset.query;
                if (query) {
                    this.ooo.removeFromSearchHistory(query);
                    return;
                }
            }
        }

        const target = document.activeElement;
        const input = (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'))
            ? target : document.getElementById('search-input');
        if (input) {
            input.focus();
            input.value = '';
            input.dispatchEvent(new Event('input', { bubbles: true }));
            const clearBtn = document.querySelector('.search-clear-btn');
            if (clearBtn) clearBtn.style.display = 'none';
        }
        if (this.ooo) this.ooo.showNotification('清空');
    }

    doCopy() {
        if (this.ooo) {
            this.ooo.copySearchContent();
        } else {
            const si = document.getElementById('search-input');
            if (si && si.value) {
                navigator.clipboard.writeText(si.value);
            }
        }
    }

    doPaste() {
        if (this.ooo) {
            this.ooo.pasteToSearch();
        } else {
            navigator.clipboard.readText().then(text => {
                const si = document.getElementById('search-input');
                if (si) si.value = text;
            });
        }
    }

    doEnter() {
        const modal = document.getElementById('settings-modal');
        if (modal && modal.classList.contains('show')) {
            const applyBtn = document.getElementById('apply-settings');
            if (applyBtn) { applyBtn.click(); return; }
        }

        const si = document.getElementById('search-input');
        if (document.activeElement === si || !document.activeElement || document.activeElement === document.body) {
            if (si && si.value.trim()) {
                if (this.ooo) {
                    this.ooo.performSearch(si.value);
                } else {
                    si.dispatchEvent(new KeyboardEvent('keydown', {
                        key: 'Enter', code: 'Enter', bubbles: true
                    }));
                }
            } else if (si) {
                si.focus();
            }
        } else {
            const active = document.activeElement;
            active.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter', code: 'Enter', bubbles: true, cancelable: true
            }));
        }
    }

    doEscape() {
        if (this.radialActive) {
            this.hideRadialMenu();
            return;
        }

        const modal = document.getElementById('settings-modal');
        if (modal && modal.classList.contains('show')) {
            document.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Escape', code: 'Escape', bubbles: true, cancelable: true
            }));
            return;
        }

        const context = document.getElementById('context-menu');
        if (context && context.classList.contains('show')) {
            if (this.ooo) this.ooo.hideContextMenu();
            return;
        }

        if (document.body.classList.contains('sidebar-visible')) {
            const container = document.getElementById('quick-access-sidebar-container');
            if (container) {
                container.classList.remove('visible');
                container.classList.add('hiding');
            }
            document.body.classList.remove('sidebar-visible');
            return;
        }

        const sh = document.getElementById('search-history-container');
        if (sh && sh.classList.contains('show')) {
            if (this.ooo) this.ooo.hideSearchHistory();
            return;
        }

        const si = document.getElementById('search-input');
        if (si && document.activeElement === si) {
            si.blur();
        }
    }

    doCustomAction(action) {
        if (!this.ooo) return;
        switch (action) {
            case 'settings': this.ooo.openSettings('shortcut'); break;
            case 'refresh': location.reload(); break;
            case 'history': this.ooo.toggleSearchHistorySetting(); break;
            case 'wallpaper': this.ooo.toggleWallpaperSetting(); break;
        }
    }

    doRadialAction(action) {
        if (action === 'copy') this.doCopy();
        else if (action === 'paste') this.doPaste();
        else if (action === 'clear') this.doDelete();
        else if (action === 'switch-engine' && this.ooo) {
            const next = this.ooo.currentEngine === 'google' ? 'bing' : 'google';
            this.ooo.currentEngine = next;
            document.getElementById('google-engine').classList.toggle('active', next === 'google');
            document.getElementById('bing-engine').classList.toggle('active', next === 'bing');
            if (this.ooo.settings.engineLocked) {
                localStorage.setItem('oooEngineLocked', next);
            }
            this.updateNavTargets();
        }
        else if (action === 'wallpaper' && this.ooo) {
            if (this.ooo.settings.quickAccessSidebar) {
                const container = document.getElementById('quick-access-sidebar-container');
                if (document.body.classList.contains('sidebar-visible')) {
                    container.classList.remove('visible');
                    container.classList.add('hiding');
                    document.body.classList.remove('sidebar-visible');
                } else {
                    container.classList.remove('hiding');
                    container.classList.add('visible');
                    document.body.classList.add('sidebar-visible');
                }
            } else {
                if (this.ooo.isScrolled) this.ooo.restoreHomepage();
                else this.ooo.showWallpaper();
            }
        }
        else if (action === 'settings' && this.ooo) this.ooo.openSettings('shortcut');
        else if (action === 'refresh') location.reload();
        else if (action === 'about') window.location.href = 'about/about.html';
    }

    showRadialMenu(mode) {
        if (this.radialActive) return;
        this.radialActive = true;
        this._radialMode = mode;
        this.radialSelected = null;

        const existing = document.getElementById('radial-menu');
        if (existing) existing.remove();

        const S = 380, R = 135, IS = 46, N = this.radialItems.length;

        const overlay = document.createElement('div');
        overlay.id = 'radial-menu';
        overlay.style.cssText =
            'position:fixed;top:0;left:0;width:100%;height:100%;' +
            'display:flex;align-items:center;justify-content:center;';

        const wheel = document.createElement('div');
        wheel.className = 'radial-wheel';
        wheel.style.cssText =
            'position:relative;width:' + S + 'px;height:' + S + 'px;border-radius:50%;' +
            'transform:scale(0.82);transition:transform .2s cubic-bezier(0.34,1.56,0.64,1);' +
            '-webkit-mask:radial-gradient(circle at ' + (S/2) + 'px ' + (S/2) + 'px,transparent 45px,black 47px);' +
            'mask:radial-gradient(circle at ' + (S/2) + 'px ' + (S/2) + 'px,transparent 45px,black 47px);';

        for (let i = 0; i < N; i++) {
            const dividerAngle = ((i + 0.5) / N) * 2 * Math.PI - Math.PI / 2;
            const line = document.createElement('div');
            line.style.cssText =
                'position:absolute;left:' + (S / 2 - 1.5) + 'px;top:' + (S / 2) + 'px;' +
                'width:3px;height:' + (S / 2) + 'px;' +
                'background:rgba(255,255,255,0.2);' +
                'transform-origin:50% 0%;' +
                'transform:rotate(' + (dividerAngle * 180 / Math.PI) + 'deg);' +
                'pointer-events:none;';
            wheel.appendChild(line);
        }

        this.radialItems.forEach((item, i) => {
            const angle = (i / N) * 2 * Math.PI - Math.PI / 2;
            const x = S / 2 + R * Math.cos(angle) - IS / 2;
            const y = S / 2 + R * Math.sin(angle) - IS / 2;

            let icon = item.icon;
            if (item.action === 'wallpaper' && this.ooo) {
                icon = this.ooo.settings.quickAccessSidebar ? 'vertical_split' : 'unfold_more';
            }

            const el = document.createElement('span');
            el.className = 'radial-item material-icons';
            el.dataset.action = item.action;
            el.textContent = icon;
            el.style.cssText =
                'position:absolute;left:' + x + 'px;top:' + y + 'px;' +
                'width:' + IS + 'px;height:' + IS + 'px;' +
                'display:flex;align-items:center;justify-content:center;' +
                'font-size:30px;color:rgba(255,255,255,0.7);' +
                'transition:all .1s ease;transform:scale(1);' +
                'text-shadow:0 1px 4px rgba(0,0,0,0.2);' +
                'line-height:1;';

            wheel.appendChild(el);
        });

        overlay.appendChild(wheel);
        document.body.appendChild(overlay);

        this.radialEl = overlay;
        this._radialWheel = wheel;
        this._wasStickActive = false;
        this._radialReleaseFired = false;
        this._skipStick = false;

        requestAnimationFrame(() => {
            wheel.style.transform = 'scale(1)';
        });
    }

    hideRadialMenu() {
        if (!this.radialActive) return;
        this.radialActive = false;
        this._radialMode = null;
        this.radialSelected = null;
        if (this.radialEl && this.radialEl.parentNode) {
            this.radialEl.remove();
        }
        this.radialEl = null;
        this._radialWheel = null;
        this._skipStick = true;
    }

    poll() {
        if (!this.settings.enabled) {
            if (this.cursor.style.display !== 'none') {
                this.cursor.style.display = 'none';
                this.clearHighlight();
            }
            this.ltHeld = false;
            this.rtHeld = false;
            return;
        }

        const gamepad = navigator.getGamepads ? navigator.getGamepads()[this.gamepadIndex] : null;
        if (!gamepad || !this.connected) {
            if (this.cursor.style.display !== 'none') {
                this.cursor.style.display = 'none';
                this.clearHighlight();
            }
            return;
        }

        this.prevBtnState = Object.assign({}, this.btnState);
        this.btnState = {};
        for (let i = 0; i < gamepad.buttons.length; i++) {
            this.btnState[i] = gamepad.buttons[i].pressed;
        }

        this.handleTriggers(gamepad);

        if (this._skipStick) {
            this._skipStick = false;
            this.handleButtons();
            this.handleDpad();
            return;
        }

        if (!this.radialActive) {
            if (this.btnState[4]) {
                this.showRadialMenu('hold');
                return;
            }
            if (this.btnPressed(2)) {
                this.showRadialMenu('toggle');
                return;
            }
        }

        if (this.radialActive) {
            this.handleRadialStick(gamepad);
            this.handleRadialButtons();
        } else {
            this.handleSticks(gamepad);
            this.handleButtons();
            this.handleDpad();
        }
    }

    handleRadialStick(gamepad) {
        const rx = gamepad.axes[2] || 0;
        const ry = gamepad.axes[3] || 0;
        const rMag = Math.sqrt(rx * rx + ry * ry);

        if (!this._radialWheel) return;
        const itemEls = this._radialWheel.querySelectorAll('.radial-item');

        const active = rMag > this.NAV_DZ;

        if (active) {
            this._wasStickActive = true;
            const N = this.radialItems.length;
            let bestIdx = 0, bestDot = -Infinity;
            for (let i = 0; i < N; i++) {
                const a = (i / N) * 2 * Math.PI - Math.PI / 2;
                const dot = rx * Math.cos(a) + ry * Math.sin(a);
                if (dot > bestDot) { bestDot = dot; bestIdx = i; }
            }

            const action = this.radialItems[bestIdx].action;
            this.radialSelected = action;

            itemEls.forEach((el, i) => {
                const on = i === bestIdx;
                el.style.transform = 'scale(' + (on ? 1.35 : 1) + ')';
                el.style.color = on ? '#fff' : 'rgba(255,255,255,0.6)';
                el.style.textShadow = on
                    ? '0 0 16px rgba(255,255,255,0.5),0 1px 4px rgba(0,0,0,0.3)'
                    : '0 1px 4px rgba(0,0,0,0.2)';
            });
        } else if (this._wasStickActive && !this._radialReleaseFired) {
            this._wasStickActive = false;
            this._radialReleaseFired = true;
            if (this.radialSelected) {
                this.doRadialAction(this.radialSelected);
                this.hideRadialMenu();
            }
        }
    }

    handleRadialButtons() {
        const escBtn = this.settings.invertAB ? 1 : 0;

        if (this._radialMode === 'hold') {
            if (!this.btnState[4] || this.btnPressed(escBtn)) {
                this.hideRadialMenu();
            }
        } else if (this._radialMode === 'toggle') {
            if (this.btnPressed(2) || this.btnPressed(escBtn)) {
                this.hideRadialMenu();
            }
        }
    }

    toggleController() {
        this.settings.enabled = !this.settings.enabled;
        if (this.settings.enabled) {
            if (this.connected) {
                this.showCursor(true);
                this.updateNavTargets();
            }
            this.focusSearchInput();
        } else {
            this.showCursor(false);
            this.clearHighlight();
            this.ltHeld = false;
            this.rtHeld = false;
            if (this.radialActive) this.hideRadialMenu();
        }
        this.saveSettings();
        this.updateSubSettingsUI();
        if (this.ooo) this.ooo.showNotification(this.settings.enabled ? '手柄控制器：开启' : '手柄控制器：关闭');
    }

    updateSubSettingsUI() {
        const container = document.getElementById('controller-settings');
        if (container) {
            container.style.display = this.settings.enabled ? 'block' : 'none';
        }
    }

    syncSettingsUI() {
        const toggle = document.getElementById('controller-toggle');
        if (toggle) toggle.checked = this.settings.enabled;
        const speed = document.getElementById('controller-speed');
        const speedVal = document.getElementById('controller-speed-value');
        if (speed) speed.value = this.settings.cursorSpeed;
        if (speedVal) speedVal.value = this.settings.cursorSpeed;
        const inv = document.getElementById('controller-invert-ab');
        if (inv) inv.checked = this.settings.invertAB;
        const ls = document.getElementById('controller-ls-select');
        if (ls) ls.value = this.settings.customLS;
        const rs = document.getElementById('controller-rs-select');
        if (rs) rs.value = this.settings.customRS;
        this.updateSubSettingsUI();
    }

    initUI() {
        const toggle = document.getElementById('controller-toggle');
        if (toggle) {
            toggle.addEventListener('change', () => this.toggleController());
        }

        const speed = document.getElementById('controller-speed');
        const speedVal = document.getElementById('controller-speed-value');
        if (speed && speedVal) {
            const updateSpeed = (v) => {
                const val = parseInt(v) || 6;
                speed.value = val;
                speedVal.value = val;
                this.settings.cursorSpeed = val;
                this.saveSettings();
            };
            speed.addEventListener('input', (e) => updateSpeed(e.target.value));
            speedVal.addEventListener('input', (e) => updateSpeed(e.target.value));
        }

        const inv = document.getElementById('controller-invert-ab');
        if (inv) {
            inv.addEventListener('change', () => {
                this.settings.invertAB = inv.checked;
                this.saveSettings();
                if (this.ooo) this.ooo.showNotification(
                    this.settings.invertAB ? 'A/B键：已反转' : 'A/B键：正常'
                );
            });
        }

        document.getElementById('controller-ls-select').addEventListener('change', (e) => {
            this.settings.customLS = e.target.value;
            this.saveSettings();
        });
        document.getElementById('controller-rs-select').addEventListener('change', (e) => {
            this.settings.customRS = e.target.value;
            this.saveSettings();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.oooController = new Controller();
    }, 500);
});

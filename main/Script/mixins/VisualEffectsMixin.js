// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

export const VisualEffectsMixin = {
    syncSimpleVisualMode() {
        this.settings.simpleVisualMode = !!(this.settings.hideNotifications
            || (this.settings.hideInfoPopup && this.settings.hideInfoPopup.enabled)
            || this.settings.hiddenBadge);
    },
    initAdvancedVisualEffects() {
        // 创建粒子容器
        if (!document.getElementById('particles-container')) {
            const particlesContainer = document.createElement('div');
            particlesContainer.id = 'particles-container';
            document.body.appendChild(particlesContainer);
        }

        // 创建光晕容器
        if (!document.getElementById('glow-orbs-container')) {
            const glowOrbsContainer = document.createElement('div');
            glowOrbsContainer.id = 'glow-orbs-container';
            document.body.appendChild(glowOrbsContainer);
        }

        // 初始化粒子
        this.particles = [];
        this.glowOrbs = [];
        this.particleInterval = null;
        this.isAdvancedEffectsActive = false;

        // 如果开启了动态模糊（高级视觉效果），立即预启动动画
        if (this.settings.dynamicBlur) {
            // 等待 DOM 加载完成后启动
            requestAnimationFrame(() => {
                this.startAdvancedVisualEffects();
            });
        }
    },
    startAdvancedVisualEffects() {
        if (this.isAdvancedEffectsActive) return;
        this.isAdvancedEffectsActive = true;

        // 立即创建光晕
        this.createGlowOrbs();
    },
    stopAdvancedVisualEffects() {
        this.isAdvancedEffectsActive = false;

        // 停止粒子生成
        if (this.particleInterval) {
            clearInterval(this.particleInterval);
            this.particleInterval = null;
        }

        // 移除所有粒子
        const particlesContainer = document.getElementById('particles-container');
        if (particlesContainer) {
            particlesContainer.innerHTML = '';
        }

        // 移除所有光晕
        const glowOrbsContainer = document.getElementById('glow-orbs-container');
        if (glowOrbsContainer) {
            glowOrbsContainer.innerHTML = '';
        }

        this.particles = [];
        this.glowOrbs = [];
    },
    createParticle() {
        const container = document.getElementById('particles-container');
        if (!container) return;

        // 限制同时存在的粒子数量，避免性能问题
        if (container.children.length >= 20) return;

        const particle = document.createElement('div');
        particle.className = 'particle';

        // 随机属性 - 减少计算量
        const size = Math.random() * 6 + 2;
        const left = Math.random() * 100;
        const duration = Math.random() * 8 + 6; // 缩短动画时间
        const delay = Math.random() * 2;
        const colorConfig = this.getColorConfig();
        const hue = colorConfig.particleHueMin + Math.random() * colorConfig.particleHueRange;
        const saturation = colorConfig.particleSaturation || 80;

        // 更高效的样式设置
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.background = `radial-gradient(circle, hsla(${hue}, ${saturation}%, 70%, 0.8) 0%, hsla(${hue}, ${saturation}%, 70%, 0) 70%)`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.boxShadow = `0 0 ${size * 2}px hsla(${hue}, ${saturation}%, 70%, 0.5)`;

        // 使用 requestAnimationFrame 优化渲染
        requestAnimationFrame(() => {
            container.appendChild(particle);
        });

        // 动画结束后移除粒子
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, (duration + delay) * 1000);
    },
    createGlowOrbs() {
        const container = document.getElementById('glow-orbs-container');
        if (!container) return;

        // 清空现有光晕
        container.innerHTML = '';

        const colorConfig = this.getColorConfig();
        const colors = colorConfig.glowOrbs;

        for (let i = 0; i < 4; i++) {
            const orb = document.createElement('div');
            orb.className = 'glow-orb';

            const size = Math.random() * 150 + 120;
            const left = Math.random() * 80 + 10;
            const top = Math.random() * 80 + 10;
            const delay = Math.random() * -20;

            // 柔边由渐变自己画：从本色渐变到「同色但 alpha=0」。
            // 不要退回 `background: ${colors[i]}` + CSS 里的 filter: blur(60px) —— 见
            // styles.css 那条 .glow-orb 注释：带动画的元素上挂 blur 滤镜每帧都要重算，
            // 实测把 60fps 打到 20fps。
            // 透明端必须写 rgba(r,g,b,0) 而不是 `transparent`：后者是 rgba(0,0,0,0)，
            // 与本色之间插值会经过灰色，光晕边缘会发脏。
            const fade = colors[i].replace(/[\d.]+\s*\)$/, '0)');

            orb.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                top: ${top}%;
                background: radial-gradient(circle, ${colors[i]} 0%, ${fade} 70%);
                animation-delay: ${delay}s;
            `;

            container.appendChild(orb);
            this.glowOrbs.push(orb);
        }
    },
};

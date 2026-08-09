/**
 * 配色方案配置
 * 所有配色相关的常量和配置集中管理
 */
const COLOR_SCHEME_NAMES = {
    'green': '林绿色',
    'blue': '经典蓝',
    'black-white': '黑白色',
    'tianyi-blue': '天依蓝',
    'vibrant-red': '活力红',
    'classic-gold': '典藏金',
    'isolation': '隔离色',
    'custom': '自定义'
};

const COLOR_SCHEME_CONFIGS = {
    'green': {
        accent: '#00AE90',
        accentRgb: '0, 174, 144',
        accentDark: '#00AE90',
        accentDarkRgb: '0, 174, 144',
        accentHover: '#009A7E',
        accentActive: '#00856C',
        contextMenuHover: '#00AE00',
        contextMenuHoverDark: '#00AE00',
        contextMenuTextColor: '#1a1a1a',
        contextMenuTextColorDark: '#d0d0d0',
        sidebarIcon: '#00AE90',
        notificationBg: 'rgba(0, 174, 0, 0.25)',
        notificationBgDark: 'rgba(0, 174, 0, 0.35)',
        notificationText: '#ffffff',
        notificationBorder: 'rgba(0, 174, 0, 0.4)',
        infoClass: 'default',
        particleHueMin: 120,
        particleHueRange: 60,
        particleSaturation: 80,
        glowOrbs: [
            'rgba(0, 174, 144, 0.25)',
            'rgba(0, 200, 150, 0.2)',
            'rgba(100, 255, 200, 0.2)',
            'rgba(180, 255, 120, 0.15)'
        ]
    },
    'blue': {
        accent: '#1a73e8',
        accentRgb: '26, 115, 232',
        accentDark: '#0d47a1',
        accentDarkRgb: '13, 71, 161',
        accentHover: '#1557b2',
        accentActive: '#0f4698',
        contextMenuHover: 'var(--primary-color)',
        contextMenuHoverDark: 'var(--primary-color)',
        contextMenuTextColor: '#1a1a1a',
        contextMenuTextColorDark: '#d0d0d0',
        sidebarIcon: 'var(--primary-color)',
        notificationBg: 'rgba(26, 115, 232, 0.25)',
        notificationBgDark: 'rgba(26, 115, 232, 0.35)',
        notificationText: '#ffffff',
        notificationBorder: 'rgba(26, 115, 232, 0.4)',
        infoClass: 'google',
        particleHueMin: 180,
        particleHueRange: 60,
        particleSaturation: 80,
        glowOrbs: [
            'rgba(100, 150, 255, 0.25)',
            'rgba(100, 200, 255, 0.2)',
            'rgba(100, 255, 200, 0.2)',
            'rgba(255, 180, 120, 0.15)'
        ]
    },
    'black-white': {
        accent: '#000000',
        accentRgb: '0, 0, 0',
        accentDark: '#ffffff',
        accentDarkRgb: '255, 255, 255',
        accentHover: '#333333',
        accentActive: '#555555',
        contextMenuHover: '#ffffff',
        contextMenuHoverDark: '#555555',
        contextMenuTextColor: '#000000',
        contextMenuTextColorDark: '#d0d0d0',
        sidebarIcon: '#555555',
        notificationBg: 'rgba(255, 255, 255, 0.75)',
        notificationBgDark: 'rgba(0, 0, 0, 0.55)',
        notificationText: '#000000',
        notificationTextDark: '#ffffff',
        notificationBorder: 'rgba(0, 0, 0, 0.1)',
        notificationBorderDark: 'rgba(255, 255, 255, 0.15)',
        infoClass: 'apple',
        particleHueMin: 0,
        particleHueRange: 360,
        particleSaturation: 10,
        glowOrbs: [
            'rgba(200, 200, 200, 0.2)',
            'rgba(255, 255, 255, 0.15)',
            'rgba(180, 180, 180, 0.15)',
            'rgba(220, 220, 220, 0.1)'
        ]
    },
    'tianyi-blue': {
        accent: '#66ccff',
        accentRgb: '102, 204, 255',
        accentDark: '#4db8e6',
        accentDarkRgb: '77, 184, 230',
        gradient: 'linear-gradient(135deg, #66ccff, #C0C0C0)',
        gradientDark: 'linear-gradient(135deg, #4db8e6, #a0a0a0)',
        accentHover: '#55bcee',
        accentActive: '#44aadd',
        contextMenuHover: '#66ccff',
        contextMenuHoverDark: '#66ccff',
        contextMenuTextColor: '#1a1a1a',
        contextMenuTextColorDark: '#d0d0d0',
        sidebarIcon: '#66ccff',
        notificationBg: 'rgba(102, 204, 255, 0.25)',
        notificationBgDark: 'rgba(102, 204, 255, 0.35)',
        notificationText: '#ffffff',
        notificationBorder: 'rgba(102, 204, 255, 0.4)',
        infoClass: 'tianyi-blue',
        particleHueMin: 195,
        particleHueRange: 30,
        particleSaturation: 80,
        glowOrbs: [
            'rgba(102, 204, 255, 0.25)',
            'rgba(192, 192, 192, 0.2)',
            'rgba(150, 220, 255, 0.2)',
            'rgba(180, 200, 220, 0.15)'
        ]
    },
    'vibrant-red': {
        accent: '#FF0000',
        accentRgb: '255, 0, 0',
        accentDark: '#cc0000',
        accentDarkRgb: '204, 0, 0',
        gradient: 'linear-gradient(135deg, #FF0000, #F5F5DC)',
        gradientDark: 'linear-gradient(135deg, #cc0000, #d4d4b0)',
        accentHover: '#e60000',
        accentActive: '#cc0000',
        contextMenuHover: '#FF0000',
        contextMenuHoverDark: '#FF0000',
        contextMenuTextColor: '#1a1a1a',
        contextMenuTextColorDark: '#d0d0d0',
        sidebarIcon: '#FF0000',
        notificationBg: 'rgba(255, 0, 0, 0.25)',
        notificationBgDark: 'rgba(255, 0, 0, 0.35)',
        notificationText: '#ffffff',
        notificationBorder: 'rgba(255, 0, 0, 0.4)',
        infoClass: 'vibrant-red',
        particleHueMin: 0,
        particleHueRange: 20,
        particleSaturation: 90,
        glowOrbs: [
            'rgba(255, 0, 0, 0.25)',
            'rgba(245, 245, 220, 0.2)',
            'rgba(255, 80, 80, 0.2)',
            'rgba(255, 150, 100, 0.15)'
        ]
    },
    'classic-gold': {
        accent: '#B46300',
        accentRgb: '180, 99, 0',
        accentDark: '#8c4e00',
        accentDarkRgb: '140, 78, 0',
        gradient: 'linear-gradient(135deg, #4A2F00, #B46300, #FFDB8F)',
        gradientDark: 'linear-gradient(135deg, #2a1a00, #8c4e00, #cca870)',
        accentHover: '#a05800',
        accentActive: '#8c4e00',
        contextMenuHover: '#B46300',
        contextMenuHoverDark: '#B46300',
        contextMenuTextColor: '#1a1a1a',
        contextMenuTextColorDark: '#d0d0d0',
        sidebarIcon: '#B46300',
        notificationBg: 'rgba(180, 99, 0, 0.25)',
        notificationBgDark: 'rgba(180, 99, 0, 0.35)',
        notificationText: '#ffffff',
        notificationBorder: 'rgba(180, 99, 0, 0.4)',
        infoClass: 'classic-gold',
        particleHueMin: 35,
        particleHueRange: 25,
        particleSaturation: 90,
        glowOrbs: [
            'rgba(74, 47, 0, 0.25)',
            'rgba(180, 99, 0, 0.2)',
            'rgba(255, 219, 143, 0.2)',
            'rgba(200, 140, 50, 0.15)'
        ]
    },
    'isolation': {
        accent: '#FFD700',
        accentRgb: '255, 215, 0',
        accentDark: '#cca800',
        accentDarkRgb: '204, 168, 0',
        gradient: 'linear-gradient(135deg, #FFD700 0%, #FFD700 45%, #6B238E 55%, #6B238E 100%)',
        gradientDark: 'linear-gradient(135deg, #cca800 0%, #cca800 45%, #4a1a63 55%, #4a1a63 100%)',
        accentHover: '#e6c200',
        accentActive: '#cca800',
        contextMenuHover: '#FFD700',
        contextMenuHoverDark: '#FFD700',
        contextMenuTextColor: '#1a1a1a',
        contextMenuTextColorDark: '#d0d0d0',
        sidebarIcon: '#FFD700',
        notificationBg: 'rgba(255, 215, 0, 0.25)',
        notificationBgDark: 'rgba(255, 215, 0, 0.35)',
        notificationText: '#1a1a1a',
        notificationBorder: 'rgba(255, 215, 0, 0.4)',
        infoClass: 'isolation',
        particleHueMin: 45,
        particleHueRange: 60,
        particleSaturation: 90,
        glowOrbs: [
            'rgba(255, 215, 0, 0.25)',
            'rgba(107, 35, 142, 0.2)',
            'rgba(255, 230, 100, 0.2)',
            'rgba(150, 80, 180, 0.15)'
        ]
    },
    'custom': {
        accent: '#1a73e8',
        accentRgb: '26, 115, 232',
        accentDark: '#0d47a1',
        accentDarkRgb: '13, 71, 161',
        accentHover: '#1557b2',
        accentActive: '#0f4698',
        contextMenuHover: 'var(--primary-color)',
        contextMenuHoverDark: 'var(--primary-color)',
        contextMenuTextColor: '#1a1a1a',
        contextMenuTextColorDark: '#d0d0d0',
        sidebarIcon: 'var(--primary-color)',
        notificationBg: 'rgba(26, 115, 232, 0.25)',
        notificationBgDark: 'rgba(26, 115, 232, 0.35)',
        notificationText: '#ffffff',
        notificationBorder: 'rgba(26, 115, 232, 0.4)',
        infoClass: 'custom',
        particleHueMin: 180,
        particleHueRange: 60,
        particleSaturation: 80,
        glowOrbs: [
            'rgba(100, 150, 255, 0.25)',
            'rgba(100, 200, 255, 0.2)',
            'rgba(100, 255, 200, 0.2)',
            'rgba(255, 180, 120, 0.15)'
        ]
    }
};

function parseRgb(hex) {
    const val = hex.replace('#', '');
    if (val.length === 6) {
        const r = parseInt(val.substring(0, 2), 16);
        const g = parseInt(val.substring(2, 4), 16);
        const b = parseInt(val.substring(4, 6), 16);
        return `${r}, ${g}, ${b}`;
    }
    return '0, 0, 0';
}

function darkenColor(hex, amount) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, (num >> 16) - amount);
    const g = Math.max(0, ((num >> 8) & 0x00FF) - amount);
    const b = Math.max(0, (num & 0x0000FF) - amount);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

function buildCustomColorConfig(customColors) {
    const { primaryColor, secondaryColor, gradientEnabled, gradientStart, gradientEnd } = customColors;
    const hasSecondary = secondaryColor && secondaryColor.trim();
    const hasGradient = hasSecondary && gradientEnabled;
    const gStart = (gradientStart !== undefined ? gradientStart : 0);
    const gEnd = (gradientEnd !== undefined ? gradientEnd : 100);
    const rgb = parseRgb(primaryColor);
    const hoverColor = darkenColor(primaryColor, 30);
    const activeColor = darkenColor(primaryColor, 50);

    const config = {
        accent: primaryColor,
        accentRgb: rgb,
        accentDark: primaryColor,
        accentDarkRgb: rgb,
        accentHover: hoverColor,
        accentActive: activeColor,
        contextMenuHover: primaryColor,
        contextMenuHoverDark: primaryColor,
        contextMenuTextColor: '#1a1a1a',
        contextMenuTextColorDark: '#d0d0d0',
        sidebarIcon: primaryColor,
        notificationBg: `rgba(${rgb}, 0.25)`,
        notificationBgDark: `rgba(${rgb}, 0.35)`,
        notificationText: '#ffffff',
        notificationBorder: `rgba(${rgb}, 0.4)`,
        infoClass: 'custom',
        particleHueMin: 180,
        particleHueRange: 60,
        particleSaturation: 80,
        glowOrbs: [
            `rgba(${rgb}, 0.25)`,
            `rgba(${rgb}, 0.2)`,
            `rgba(${rgb}, 0.15)`,
            `rgba(${rgb}, 0.1)`
        ]
    };

    if (hasGradient) {
        config.gradient = `linear-gradient(135deg, ${primaryColor} ${gStart}%, ${secondaryColor} ${gEnd}%)`;
        config.gradientDark = `linear-gradient(135deg, ${primaryColor} ${gStart}%, ${secondaryColor} ${gEnd}%)`;
    }

    return config;
}

function getColorConfig(scheme, customColors) {
    if (scheme === 'custom') {
        if (customColors && customColors.primaryColor) {
            return buildCustomColorConfig(customColors);
        }
        return COLOR_SCHEME_CONFIGS['blue'];
    }
    return COLOR_SCHEME_CONFIGS[scheme] || COLOR_SCHEME_CONFIGS['green'];
}

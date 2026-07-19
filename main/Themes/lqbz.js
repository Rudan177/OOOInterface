var DEFAULT_THEME = {
    "info": {
        "name": "测试主题",
        "designer": "admin",
        "version": "0.8"
    },
    "details": {
        "logo": {
            "name": "apple",
            "location": "../images/all.png",
            "specialStyle": {
                "dark":"../images/aln.png",
                "width": "120px",
                "height": "120px"
            }
        },
        "font": {
            "name": "Code",
            "location": "../fonts/GoogleSansCode.ttf",
            "specialStyle":{
                "font-weight": "500",
                "font-size": "1.1em"
            }
        },
        "wallpaper": {
            "name": "default",
            "location": "../images/back.png",
            "specialStyle":{
                "wallpaperFill": false
            }
        },
        "color": {
            "name": "green",
            "specialStyle":{
                "colorGroup": "add",
                "colorScheme":{
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
                }
            }
        },
        "more": true,
        "moreStyle": {
            "location": "../Style/style.css",
            "specialStyle": {
                ".ooo-badge": [
                "background-color: var(--surface-color);border-radius: 999px;padding: 50px 50px;font-size: 14px;color: var(--text-secondary);cursor: pointer;transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;border: 1px solid var(--border-color);font-family: inherit;position: relative;overflow: visible;white-space: nowrap;min-width: 120px;text-align: center;user-select: none;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;"
                ]
            }
        }
    }
}
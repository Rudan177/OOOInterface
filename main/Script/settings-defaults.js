// 出厂默认设置：主页面与侧边栏共用的唯一来源（Stage 9）。
//
// 主页面的 OOOInterface 与侧边栏面板此前各存一份，侧边栏那份是主页面的子集，
// 两边靠注释约定“保持一致”，实际已经漂移过一次（语言表少了 es）。改到这里之后
// 只有一份，不会再漂。
//
// 注意：本对象只读。使用方一律先深拷贝再改（JSON.parse(JSON.stringify(...))），
// 或经 mergeSettings 合并，切勿就地修改。

export const DEFAULT_SETTINGS = {
    font: 'Sans Flex',
    logo: 'default',
    logoType: 'image',
    textLogo: '',
    customLogos: [],
    customFonts: [],
    customWallpapers: [],
    wallpaperSeries: [],
    quickLinks: [],
    wallpaper: 'default',
    wallpaperUrl: '',
    dynamicBlur: false,
    persistentWallpaper: false,
    searchHistory: true,
    searchSuggestions: true,
    searchHistoryItems: [],
    engineLocked: false,
    developerMode: false,
    proxyPort: null,
    fontSize: 1,
    fontWeight: 400,
    searchBoxHeight: 50,
    enhancedDisplay: false,
    wallpaperScale: false,
    wallpaperFill: true,
    colorScheme: 'green',
    customPrimaryColor: '',
    customSecondaryColor: '',
    customGradientEnabled: false,
    customGradientStart: 0,
    customGradientEnd: 100,
    customColors: [],
    activeCustomColorIndex: -1,
    contextMenuStyle: 'default',
    hideInfoPopup: { enabled: false, type: null, timestamp: null },
    // 底部铭牌功能：双击 / 右键分别对应的动作（settings 打开设置 / audio 播放音效 / none 无）
    badgeDblClickAction: 'settings',
    badgeContextMenuAction: 'settings',
    // OCP 播控：开启后，OCP 开始播放过一次即可 hover 底部铭牌呼出媒体播控
    ocpPlayerEnabled: false,
    bingRefreshEveryTime: true,
    bingRefreshInterval: 0,
    quickAccessSidebar: true,
    showQuickLinkIcons: true,
    // 固定侧边栏：主开关（false = 恢复 hover 控制）；开启主开关时子开关自动跟随
    fixSidebarEnabled: false,
    fixSidebarHomepage: false,
    fixSidebarWallpaper: false,
    // 侧边栏面板功能：默认全部关闭（主开关与内部各开关均关闭，
    // 由用户按需逐项开启；开启后点击工具栏图标打开侧边栏，关闭则新建标签页）
    sidePanelEnabled: false,
    sidePanelShowWidgets: false,
    sidePanelShowQuickLinks: false,
    sidePanelShowSearch: false,
    sidePanelShowEngineButtons: false,
    sidePanelWallpaperEnabled: false,
    sidePanelWallpaperSync: false,
    sidePanelWallpaperUrl: '',
    // 侧边栏各区域独立配置（与主页面保持一致关闭时生效）
    sidePanelWidgetsSync: false,
    sidePanelWidgetPanel: { widgets: [] },
    sidePanelQuickLinksSync: false,
    sidePanelQuickLinks: [],
    sidePanelSearchSync: false,
    sidePanelSearchBoxHeight: 50,
    // 内置页打开：开启后侧边栏搜索/访问的网页用 iframe 在面板内展示
    sidePanelBuiltinOpen: false,
    widgetPanel: {
        enabled: true,
        widgets: []
    },
    statusBarEnabled: false,
    showStatusBarSeconds: false,
    hideNotifications: false,
    // 简洁视觉效果：主开关，关闭时自动关闭全部子开关（隐藏弹窗/禁止提示/隐藏铭牌）
    simpleVisualMode: false,
    hiddenBadge: false,
    contextMenuCustomItems: ['wallpaper-toggle', 'search-history-toggle', 'search-suggestions-toggle'],
    shortcutsEnabled: true,
    theme: 'default',           // 当前主题 key（文件 basename 去扩展名）
    themeEnabled: false,        // 主题功能是否开启
    themeColorScheme: null,     // 当主题 color.colorGroup === 'add' 时存放完整配色配置
    themeAspects: null,         // 各方面是否仍由主题接管 {logo,font,wallpaper,color}（null 视为全部接管）
    customThemes: []             // 用户导入的自定义主题 [{key, name, designer, version, data}]
};

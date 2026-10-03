// 主页面与侧边栏面板共用的 chrome.storage 同步白名单（Stage 9）。
//
// 语义：只有这个列表里的键发生变化时，另一侧才需要重新应用设置。
// 它是一道**门控**，不是权限清单——多一个键只是多一次无害的重算，
// 少一个键才会导致界面陈旧（这是真实的 bug 类别）。
//
// 因此这里取两侧原有列表的**并集**：以侧边栏那份为准，其中多出的
// 'wallpaper' / 'wallpaperUrl' 是主页面原先漏掉的——主页面换了壁纸时，
// 侧边栏此前不会被触发重应用。补上后两边行为一致。
//
// 不在列表中的键（小组件数据、壁纸缓存等）变化不触发重应用；
// 自身回写又因内容一致被跳过，以此避免两个页面之间的同步风暴。

export const SYNC_KEYS = [
    'quickLinks', 'showQuickLinkIcons', 'enhancedDisplay', 'dynamicBlur', 'colorScheme',
    'themeColorScheme', 'customColors', 'activeCustomColorIndex', 'customPrimaryColor', 'customSecondaryColor',
    'customGradientEnabled', 'customGradientStart', 'customGradientEnd', 'font',
    'sidePanelEnabled', 'sidePanelShowWidgets', 'sidePanelShowQuickLinks', 'sidePanelShowSearch',
    'sidePanelShowEngineButtons', 'sidePanelWallpaperEnabled', 'sidePanelWallpaperSync', 'sidePanelWallpaperUrl',
    'sidePanelWidgetsSync', 'sidePanelWidgetPanel', 'sidePanelQuickLinksSync', 'sidePanelQuickLinks',
    'sidePanelSearchSync', 'sidePanelSearchBoxHeight',
    'sidePanelBuiltinOpen',
    'widgetPanel', 'wallpaper', 'wallpaperUrl'
];

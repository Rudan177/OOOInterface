/**
 * 主页面与侧边栏面板共用的 chrome.storage 同步白名单：只有列表内的键变化时才触发重应用。
 * 列表取两侧并集（含 'wallpaper' / 'wallpaperUrl'），少一个键会让界面陈旧，多一个键只是无害重算。
 * 不在表内的键（小组件数据、壁纸缓存等）不触发，自身回写因内容一致被跳过，避免同步风暴。
 */

export const SYNC_KEYS = [
    'quickLinks', 'showQuickLinkIcons', 'focusSearch', 'focusSearchWallpaper', 'focusSearchScale',
    'enhancedDisplay', 'dynamicBlur', 'colorScheme',
    'themeColorScheme', 'customColors', 'activeCustomColorIndex', 'customPrimaryColor', 'customSecondaryColor',
    'customGradientEnabled', 'customGradientStart', 'customGradientEnd', 'font',
    'sidePanelEnabled', 'sidePanelShowWidgets', 'sidePanelShowQuickLinks', 'sidePanelShowSearch',
    'sidePanelShowEngineButtons', 'sidePanelWallpaperEnabled', 'sidePanelWallpaperSync', 'sidePanelWallpaperUrl',
    'sidePanelWidgetsSync', 'sidePanelWidgetPanel', 'sidePanelQuickLinksSync', 'sidePanelQuickLinks',
    'sidePanelSearchSync', 'sidePanelSearchBoxHeight',
    'sidePanelBuiltinOpen',
    'wallpaperDarkDim',
    'widgetPanel', 'wallpaper', 'wallpaperUrl'
];

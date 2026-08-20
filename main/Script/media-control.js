/**
 * OOOInterface 媒体控制内容脚本
 * 注入所有页面，接收小组件面板的媒体控制指令：
 * - ooo-media-get-state : 返回当前播放媒体信息（标题/作者/封面）
 * - ooo-media-control   : 执行 play/pause/toggle/prev/next
 */
(function () {
    'use strict';

    if (window.__OOO_MEDIA_CONTROL_LOADED__) return;
    window.__OOO_MEDIA_CONTROL_LOADED__ = true;

    function getPlayingMedia() {
        var elements = document.querySelectorAll('video, audio');
        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            if (!el.paused && !el.ended && el.readyState > 2) {
                return el;
            }
        }
        // 回退：返回第一个存在的媒体元素
        return elements.length ? elements[0] : null;
    }

    function getAllMedia() {
        return Array.prototype.slice.call(document.querySelectorAll('video, audio'));
    }

    function getMediaState() {
        var meta = {};
        try {
            if (navigator.mediaSession && navigator.mediaSession.metadata) {
                var m = navigator.mediaSession.metadata;
                meta.title = m.title || '';
                meta.artist = m.artist || '';
                meta.album = m.album || '';
                if (m.artwork && m.artwork.length) {
                    meta.artwork = m.artwork[0].src || '';
                }
            }
        } catch (e) { /* 忽略 */ }

        var el = getPlayingMedia();
        if (!el) {
            // 无播放中媒体：尝试用 document.title
            if (!meta.title) {
                meta.title = document.title || '';
            }
            return meta;
        }

        if (!meta.title) {
            // 从页面标题中推测（常见格式 "曲名 - 歌手"）
            var title = document.title || '';
            var parts = title.split(/[-–—|·]/).map(function (s) { return s.trim(); });
            if (parts.length >= 2) {
                meta.title = parts[0];
                meta.artist = parts.slice(1).join(' - ');
            } else {
                meta.title = title;
            }
        }

        meta.duration = el.duration || 0;
        meta.currentTime = el.currentTime || 0;
        meta.paused = el.paused;
        meta.playing = !el.paused;

        return meta;
    }

    function doControl(action) {
        var media = getAllMedia();
        if (!media.length) {
            // 无媒体元素：派发媒体键事件（部分站点监听）
            try {
                var keyMap = {
                    'toggle': 'MediaPlayPause',
                    'play': 'MediaPlayPause',
                    'pause': 'MediaPlayPause',
                    'next': 'MediaTrackNext',
                    'prev': 'MediaTrackPrevious'
                };
                var key = keyMap[action];
                if (key) {
                    window.dispatchEvent(new KeyboardEvent('keydown', { key: key, code: key, bubbles: true }));
                }
            } catch (e) { /* 忽略 */ }
            return { ok: false, reason: 'no-media' };
        }

        var playing = media.filter(function (m) { return !m.paused; });
        var target = playing.length ? playing[0] : media[0];

        if (action === 'toggle' || action === 'play') {
            if (target.paused) {
                var p = target.play();
                if (p && p.catch) p.catch(function () {});
            }
        } else if (action === 'pause') {
            media.forEach(function (m) { m.pause(); });
        } else if (action === 'next' || action === 'prev') {
            // 尝试媒体会话 action handler（站点通过 navigator.mediaSession.setActionHandler 注册）
            try {
                if (navigator.mediaSession) {
                    // 无法直接调用已注册的 handler，改为派发媒体键事件
                    var key = action === 'next' ? 'MediaTrackNext' : 'MediaTrackPrevious';
                    window.dispatchEvent(new KeyboardEvent('keydown', { key: key, code: key, bubbles: true }));
                }
            } catch (e) { /* 忽略 */ }
        }

        return { ok: true };
    }

    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (!message || typeof message.type !== 'string') return;
        if (message.type === 'ooo-media-get-state') {
            sendResponse(getMediaState());
            return;
        }
        if (message.type === 'ooo-media-control') {
            sendResponse(doControl(message.action));
            return;
        }
    });
})();

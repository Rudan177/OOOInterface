var http = require('http');
var https = require('https');
var url = require('url');

var SERVER_PORT = 8899;

// 校验目标 URL：仅允许 http/https，且禁止指向内网/回环地址（防 SSRF，
// 避免本机恶意网页借助本服务探测内网）
function isAllowedTarget(targetUrl) {
    var parsed;
    try {
        parsed = new URL(targetUrl);
    } catch (e) {
        return false;
    }

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return false;
    }

    var hostname = parsed.hostname.toLowerCase();
    var privatePatterns = [
        /^localhost$/,
        /^127\./,
        /^0\.0\.0\.0$/,
        /^10\./,
        /^192\.168\./,
        /^172\.(1[6-9]|2[0-9]|3[01])\./,
        /^169\.254\./,
        /^\[?::1\]?$/,
        /^\[?f[c-d][0-9a-f]{2}:/i
    ];

    for (var i = 0; i < privatePatterns.length; i++) {
        if (privatePatterns[i].test(hostname)) {
            return false;
        }
    }

    return true;
}

function fetchDirect(targetUrl, res) {
    console.log('[直连] →', targetUrl);

    var parsed = new URL(targetUrl);
    var mod = parsed.protocol === 'https:' ? https : http;

    // 统一的错误响应：若响应头已写出则不再 writeHead，避免抛错
    var sendError = function (status, message) {
        if (res.headersSent) {
            try { res.end(); } catch (e) { /* 忽略已关闭的连接 */ }
            return;
        }
        res.writeHead(status, { 'Content-Type': 'text/plain' });
        res.end(message);
    };

    var req = mod.get(parsed.href, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': '*/*'
        },
        timeout: 15000
    }, function (proxyRes) {
        console.log('[直连] ←', proxyRes.statusCode, targetUrl);
        if (res.headersSent) return;
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
    });

    req.on('error', function (err) {
        console.error('[直连] ✗', err.message);
        sendError(502, 'Direct connection failed: ' + err.message);
    });

    req.on('timeout', function () {
        req.destroy();
        sendError(504, 'Gateway Timeout');
    });
}

var server = http.createServer(function (req, res) {
    var parsed = url.parse(req.url, true);

    res.setHeader('Access-Control-Allow-Origin', '*');

    if (parsed.pathname === '/proxy') {
        var targetUrl = parsed.query && parsed.query.url;

        if (!targetUrl) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Missing ?url=');
            return;
        }

        try {
            new URL(targetUrl);
        } catch (e) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Invalid URL');
            return;
        }

        // 拒绝内网/非法协议目标，防止被用作开放代理探测内网
        if (!isAllowedTarget(targetUrl)) {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end('Target not allowed');
            return;
        }

        fetchDirect(targetUrl, res);
    } else if (parsed.pathname === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', port: SERVER_PORT }));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(SERVER_PORT, '127.0.0.1', function () {
    console.log('');
    console.log('==========================================');
    console.log('  OOOInterface Proxy Server v2');
    console.log('==========================================');
    console.log('  Port:     ' + SERVER_PORT);
    console.log('  Mode:     Direct (Node.js no CORS)');
    console.log('  Fill in:  ' + SERVER_PORT);
    console.log('==========================================');
});
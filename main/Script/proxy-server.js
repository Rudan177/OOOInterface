var http = require('http');
var https = require('https');
var url = require('url');

var SERVER_PORT = 8899;

function fetchDirect(targetUrl, res) {
    console.log('[直连] →', targetUrl);

    var parsed = new URL(targetUrl);
    var mod = parsed.protocol === 'https:' ? https : http;

    var req = mod.get(parsed.href, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': '*/*'
        },
        timeout: 15000
    }, function(proxyRes) {
        console.log('[直连] ←', proxyRes.statusCode, targetUrl);
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
    });

    req.on('error', function(err) {
        console.error('[直连] ✗', err.message);
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end('Direct connection failed: ' + err.message);
    });

    req.on('timeout', function() {
        req.destroy();
        res.writeHead(504, { 'Content-Type': 'text/plain' });
        res.end('Gateway Timeout');
    });
}

function fetchViaClash(clashPort, targetUrl, res) {
    console.log('[代理] →', targetUrl, '(via :' + clashPort + ')');

    var options = {
        hostname: '127.0.0.1',
        port: clashPort,
        path: targetUrl,
        method: 'GET',
        headers: {
            'Host': new URL(targetUrl).host,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': '*/*'
        },
        timeout: 15000
    };

    var req = http.request(options, function(proxyRes) {
        console.log('[代理] ←', proxyRes.statusCode, targetUrl);
        if (proxyRes.statusCode >= 200 && proxyRes.statusCode < 400) {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res);
        } else {
            var body = '';
            proxyRes.on('data', function(c) { body += c; });
            proxyRes.on('end', function() {
                res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
                res.end(body);
            });
        }
    });

    req.on('error', function(err) {
        console.error('[代理] ✗', err.message);
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end('Proxy failed: ' + err.message);
    });

    req.on('timeout', function() {
        req.destroy();
        res.writeHead(504, { 'Content-Type': 'text/plain' });
        res.end('Proxy Timeout');
    });

    req.end();
}

var server = http.createServer(function(req, res) {
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
        } catch(e) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Invalid URL');
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

server.listen(SERVER_PORT, '127.0.0.1', function() {
    console.log('');
    console.log('==========================================');
    console.log('  OOOInterface Proxy Server v2');
    console.log('==========================================');
    console.log('  Port:     ' + SERVER_PORT);
    console.log('  Mode:     Direct (Node.js no CORS)');
    console.log('  Fill in:  ' + SERVER_PORT);
    console.log('==========================================');
});
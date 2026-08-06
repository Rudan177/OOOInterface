var ProxyManager = (function () {
    var proxyPort = null;

    function loadProxy() {
        var saved = localStorage.getItem('oooProxyPort');
        if (saved !== null && saved !== '') {
            proxyPort = parseInt(saved, 10);
            if (isNaN(proxyPort)) {
                proxyPort = null;
                localStorage.removeItem('oooProxyPort');
            }
        } else {
            proxyPort = null;
        }
        return proxyPort;
    }

    function setProxy(port) {
        if (port === null || port === undefined || port === '' || isNaN(port)) {
            proxyPort = null;
            localStorage.removeItem('oooProxyPort');
        } else {
            proxyPort = parseInt(port, 10);
            localStorage.setItem('oooProxyPort', proxyPort);
        }
    }

    function getProxyPort() {
        if (proxyPort === null) {
            loadProxy();
        }
        return proxyPort;
    }

    function isProxyEnabled() {
        return getProxyPort() !== null;
    }

    function buildProxyUrl(targetUrl) {
        var port = getProxyPort();
        if (!port) return targetUrl;
        return 'http://127.0.0.1:' + port + '/proxy?url=' + encodeURIComponent(targetUrl);
    }

    function proxiedFetch(url, options) {
        var port = getProxyPort();
        if (port) {
            var proxyUrl = buildProxyUrl(url);
            return fetch(proxyUrl, options || {}).then(function (response) {
                if (!response.ok) {
                    console.warn('[ProxyManager] 代理请求返回状态码:', response.status, 'URL:', url);
                }
                return response;
            }).catch(function (err) {
                console.error('[ProxyManager] 代理请求失败:', err.message, '端口:', port, '目标:', url);
                throw new Error('代理连接失败 (端口 ' + port + ')：' + err.message);
            });
        }
        return fetch(url, options || {});
    }

    function testProxyConnection(timeout) {
        timeout = timeout || 5000;
        return new Promise(function (resolve, reject) {
            var port = getProxyPort();
            if (!port) {
                reject(new Error('未配置代理端口'));
                return;
            }

            // 使用 /health 端点做真实连通性检测：
            // no-cors 模式得到的是 opaque 响应（无法读取状态码），会把失败误判为成功
            var testUrl = 'http://127.0.0.1:' + port + '/health';
            var timer = setTimeout(function () {
                reject(new Error('代理连接超时 (' + timeout + 'ms)，请确认代理服务正在运行'));
            }, timeout);

            fetch(testUrl, { method: 'GET', mode: 'cors', cache: 'no-store' })
                .then(function (res) {
                    clearTimeout(timer);
                    if (!res.ok) {
                        reject(new Error('代理服务响应异常，状态码: ' + res.status + ' 端口: ' + port));
                        return;
                    }
                    resolve({ ok: true, port: port });
                })
                .catch(function (err) {
                    clearTimeout(timer);
                    reject(new Error('无法连接到代理服务 端口:' + port + ' - ' + err.message));
                });
        });
    }

    function clearProxy() {
        proxyPort = null;
        localStorage.removeItem('oooProxyPort');
    }

    loadProxy();

    return {
        setProxy: setProxy,
        getProxyPort: getProxyPort,
        isProxyEnabled: isProxyEnabled,
        proxiedFetch: proxiedFetch,
        buildProxyUrl: buildProxyUrl,
        testProxyConnection: testProxyConnection,
        clearProxy: clearProxy,
        loadProxy: loadProxy
    };
})();
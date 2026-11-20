/**
 * 系统信息探测：从 User-Agent 识别操作系统，并提供内存占用的查询入口。
 * 由 main.js 通过 Object.assign 挂载到 OOOInterface.prototype。
 */

export const SystemInfoMixin = {
    getOperatingSystem() {
        const userAgent = navigator.userAgent;
        if (userAgent.includes('Windows')) return 'Windows';
        if (userAgent.includes('Mac OS')) return 'Mac OS';
        if (userAgent.includes('Linux')) return 'Linux';
        if (userAgent.includes('Android')) return 'Android';
        if (userAgent.includes('iOS')) return 'iOS';
        return 'Unknown';
    },
    getMemoryUsage(type) {
        if (type === 'uac') {
            return String(this.backendConnected);
        }
        return 'N/A';
    },
};

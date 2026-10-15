// 本文件由 script.js 拆分而来（Stage 8）。
// 方法正文与原文件逐字节一致，仅签名头改为对象字面量成员。
// 由 main.js 通过 Object.assign(OOOInterface.prototype, ...) 组装。

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

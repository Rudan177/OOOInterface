const VERSION = "5.3:34-BS258.2";
const PACKAGE_ID = "0xB9c4E5DCAC4201bf";
const PACKAGE_FLAG = "Release";
const PRODUCT_NAME = "OOOInterface 34";
const RELEASE_DATE = "2026年11月21日";
const LICENSE_ID = "ABCD-26W08A";
const COPYRIGHT = "© 2026 ByRUDAN 保留所有权利";

function compareVersionNumber(a, b) {
    var pa = String(a).split('.');
    var pb = String(b).split('.');
    var len = Math.max(pa.length, pb.length);
    for (var i = 0; i < len; i++) {
        var n1 = parseInt(pa[i], 10) || 0;
        var n2 = parseInt(pb[i], 10) || 0;
        if (n1 > n2) return 1;
        if (n1 < n2) return -1;
    }
    return 0;
}

function compareVersions(v1, v2) {
    var r = /^(\d+)\.(\d+):([\d.]+)-([A-Za-z]*)([\d.]+)$/;
    var m1 = v1.match(r);
    var m2 = v2.match(r);
    if (!m1 || !m2) return v1.localeCompare(v2);
    var result = compareVersionNumber(m1[1], m2[1]);
    if (result) return result;
    result = compareVersionNumber(m1[2], m2[2]);
    if (result) return result;
    result = compareVersionNumber(m1[3], m2[3]);
    if (result) return result;
    return compareVersionNumber(m1[5], m2[5]);
}

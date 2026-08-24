const VERSION = "5.3:31-BS211";
const PACKAGE_ID = "0x8F2a4C7e1B9d3A6f";
const PACKAGE_FLAG = "Beta";
const PRODUCT_NAME = "OOOInterface 31";
const RELEASE_DATE = "2026年8月21日";
const LICENSE_ID = "ABCD-26W08A";
const COPYRIGHT = "© 2026 ByRUDAN 保留所有权利";

function compareVersions(v1, v2) {
    var r = /^(\d+)\.(\d+):(\d+)-[A-Za-z]*(\d*)$/;
    var m1 = v1.match(r);
    var m2 = v2.match(r);
    if (!m1 || !m2) return v1.localeCompare(v2);
    for (var i = 1; i <= 4; i++) {
        var n1 = parseInt(m1[i], 10) || 0;
        var n2 = parseInt(m2[i], 10) || 0;
        if (n1 > n2) return 1;
        if (n1 < n2) return -1;
    }
    return 0;
}

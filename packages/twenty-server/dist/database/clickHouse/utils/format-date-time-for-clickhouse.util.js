// ClickHouse DateTime64(3) expects YYYY-MM-DD HH:mm:ss.SSS (no 'T' separator,
// no 'Z' suffix), while toISOString() returns YYYY-MM-DDTHH:mm:ss.SSSZ.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "formatDateTimeForClickHouse", {
    enumerable: true,
    get: function() {
        return formatDateTimeForClickHouse;
    }
});
const formatDateTimeForClickHouse = (date)=>{
    const iso = typeof date === 'string' ? date : date.toISOString();
    return `${iso.slice(0, 10)} ${iso.slice(11, 23)}`;
};

//# sourceMappingURL=format-date-time-for-clickhouse.util.js.map
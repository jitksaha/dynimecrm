// ClickHouse returns DateTime64 values as naive strings (YYYY-MM-DD HH:mm:ss.SSS) in UTC.
// Parse them as UTC explicitly, otherwise `new Date` assumes the server's local timezone.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseClickHouseDateTime", {
    enumerable: true,
    get: function() {
        return parseClickHouseDateTime;
    }
});
const parseClickHouseDateTime = (value)=>new Date(`${value.replace(' ', 'T')}Z`);

//# sourceMappingURL=parse-clickhouse-date-time.util.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "formatDateForClickHouse", {
    enumerable: true,
    get: function() {
        return formatDateForClickHouse;
    }
});
const formatDateForClickHouse = (date)=>date.toISOString().slice(0, 10);

//# sourceMappingURL=format-date-for-clickhouse.util.js.map
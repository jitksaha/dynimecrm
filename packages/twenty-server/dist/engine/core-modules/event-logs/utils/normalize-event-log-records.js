"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "normalizeEventLogRecords", {
    enumerable: true,
    get: function() {
        return normalizeEventLogRecords;
    }
});
const _parseclickhousedatetimeutil = require("../../../../database/clickhouse/utils/parse-clickhouse-date-time.util");
const _eventlogregistry = require("../registry/event-log-registry");
const normalizeEventLogRecords = (records, table)=>records.map((row)=>({
            ..._eventlogregistry.EVENT_LOG_TYPES[table].normalize(row),
            timestamp: (0, _parseclickhousedatetimeutil.parseClickHouseDateTime)(row.timestamp)
        }));

//# sourceMappingURL=normalize-event-log-records.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildApplicationLogEnvelopes", {
    enumerable: true,
    get: function() {
        return buildApplicationLogEnvelopes;
    }
});
const _formatdatetimeforclickhouseutil = require("../../../../../database/clickhouse/utils/format-date-time-for-clickhouse.util");
const buildApplicationLogEnvelopes = (entries)=>entries.map((entry)=>({
            table: 'applicationLog',
            row: {
                timestamp: (0, _formatdatetimeforclickhouseutil.formatDateTimeForClickHouse)(entry.timestamp),
                workspaceId: entry.workspaceId,
                applicationId: entry.applicationId,
                logicFunctionId: entry.logicFunctionId,
                logicFunctionName: entry.logicFunctionName,
                executionId: entry.executionId,
                level: entry.level,
                message: entry.message
            }
        }));

//# sourceMappingURL=build-application-log-envelopes.js.map
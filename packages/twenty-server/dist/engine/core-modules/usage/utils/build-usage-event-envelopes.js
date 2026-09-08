/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildUsageEventEnvelopes", {
    enumerable: true,
    get: function() {
        return buildUsageEventEnvelopes;
    }
});
const _formatdatetimeforclickhouseutil = require("../../../../database/clickhouse/utils/format-date-time-for-clickhouse.util");
const buildUsageEventEnvelopes = (workspaceId, usageEvents)=>{
    const now = (0, _formatdatetimeforclickhouseutil.formatDateTimeForClickHouse)(new Date());
    return usageEvents.map((usageEvent)=>({
            table: 'usageEvent',
            row: {
                timestamp: now,
                workspaceId,
                periodStart: usageEvent.periodStart ? (0, _formatdatetimeforclickhouseutil.formatDateTimeForClickHouse)(usageEvent.periodStart) : undefined,
                userWorkspaceId: usageEvent.spenders?.userWorkspaceId ?? '',
                apiKeyId: usageEvent.spenders?.apiKeyId ?? '',
                applicationId: usageEvent.spenders?.applicationId ?? '',
                agentId: usageEvent.spenders?.agentId ?? '',
                workflowId: usageEvent.spenders?.workflowId ?? '',
                logicFunctionId: usageEvent.spenders?.logicFunctionId ?? '',
                resourceType: usageEvent.resourceType,
                operationType: usageEvent.operationType,
                quantity: usageEvent.quantity,
                unit: usageEvent.unit,
                creditsUsedMicro: usageEvent.creditsUsedMicro,
                resourceId: usageEvent.resourceId ?? '',
                resourceContext: usageEvent.resourceContext ?? '',
                metadata: usageEvent.metadata ?? {}
            }
        }));
};

//# sourceMappingURL=build-usage-event-envelopes.js.map
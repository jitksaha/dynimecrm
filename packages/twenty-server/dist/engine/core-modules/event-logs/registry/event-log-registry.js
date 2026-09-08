/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get EVENT_LOG_TYPES () {
        return EVENT_LOG_TYPES;
    },
    get getClickHouseTableName () {
        return getClickHouseTableName;
    }
});
const _types = require("twenty-shared/types");
const _billingentitlementkeyenum = require("../../billing/enums/billing-entitlement-key.enum");
const normalizeGenericEvent = (eventFieldName)=>(row)=>{
        const record = row;
        return {
            event: record[eventFieldName] ?? '',
            userId: record.userId ?? undefined,
            properties: record.properties,
            recordId: record.recordId,
            objectMetadataId: record.objectMetadataId,
            isCustom: record.isCustom
        };
    };
const EVENT_LOG_TYPES = {
    [_types.EventLogTable.WORKSPACE_EVENT]: {
        clickHouseTable: 'workspaceEvent',
        requiresEntitlement: _billingentitlementkeyenum.BillingEntitlementKey.AUDIT_LOGS,
        eventFieldName: 'event',
        normalize: normalizeGenericEvent('event')
    },
    [_types.EventLogTable.PAGEVIEW]: {
        clickHouseTable: 'pageview',
        requiresEntitlement: _billingentitlementkeyenum.BillingEntitlementKey.AUDIT_LOGS,
        eventFieldName: 'name',
        normalize: normalizeGenericEvent('name')
    },
    [_types.EventLogTable.OBJECT_EVENT]: {
        clickHouseTable: 'objectEvent',
        requiresEntitlement: _billingentitlementkeyenum.BillingEntitlementKey.AUDIT_LOGS,
        eventFieldName: 'event',
        normalize: normalizeGenericEvent('event')
    },
    [_types.EventLogTable.USAGE_EVENT]: {
        clickHouseTable: 'usageEvent',
        requiresEntitlement: _billingentitlementkeyenum.BillingEntitlementKey.AUDIT_LOGS,
        eventFieldName: 'resourceType',
        normalize: (row)=>{
            const record = row;
            return {
                event: record.resourceType ?? '',
                userId: record.userWorkspaceId,
                properties: {
                    ...record.metadata ?? {},
                    operationType: record.operationType,
                    quantity: record.quantity,
                    unit: record.unit,
                    creditsUsedMicro: record.creditsUsedMicro,
                    resourceId: record.resourceId,
                    resourceContext: record.resourceContext
                }
            };
        }
    },
    [_types.EventLogTable.APPLICATION_LOG]: {
        clickHouseTable: 'applicationLog',
        requiresEntitlement: null,
        eventFieldName: 'logicFunctionName',
        normalize: (row)=>{
            const record = row;
            return {
                event: record.logicFunctionName ?? '',
                properties: {
                    level: record.level,
                    message: record.message,
                    executionId: record.executionId,
                    logicFunctionId: record.logicFunctionId,
                    applicationId: record.applicationId
                }
            };
        }
    }
};
const getClickHouseTableName = (table)=>EVENT_LOG_TYPES[table].clickHouseTable;

//# sourceMappingURL=event-log-registry.js.map
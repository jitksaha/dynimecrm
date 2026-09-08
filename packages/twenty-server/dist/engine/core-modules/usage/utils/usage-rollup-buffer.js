/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsageRollupBuffer", {
    enumerable: true,
    get: function() {
        return UsageRollupBuffer;
    }
});
const _utils = require("twenty-shared/utils");
const ABSENT = '-';
const buildRollupKey = (workspaceId, usageEvent)=>[
        workspaceId,
        usageEvent.resourceType,
        usageEvent.operationType,
        usageEvent.unit,
        usageEvent.resourceContext || ABSENT,
        usageEvent.resourceId || ABSENT,
        usageEvent.periodStart?.toISOString() ?? ABSENT,
        usageEvent.spenders?.userWorkspaceId || ABSENT,
        usageEvent.spenders?.apiKeyId || ABSENT,
        usageEvent.spenders?.applicationId || ABSENT,
        usageEvent.spenders?.agentId || ABSENT,
        usageEvent.spenders?.workflowId || ABSENT,
        usageEvent.spenders?.logicFunctionId || ABSENT
    ].join('|');
let UsageRollupBuffer = class UsageRollupBuffer {
    get isFull() {
        return this.rollupByKey.size >= this.maxEntries;
    }
    increment(workspaceId, usageEvent) {
        const rollupKey = buildRollupKey(workspaceId, usageEvent);
        const bufferedRollup = this.rollupByKey.get(rollupKey);
        if ((0, _utils.isDefined)(bufferedRollup)) {
            bufferedRollup.usageEvent.quantity += usageEvent.quantity;
            bufferedRollup.usageEvent.creditsUsedMicro += usageEvent.creditsUsedMicro;
            return;
        }
        this.rollupByKey.set(rollupKey, {
            workspaceId,
            usageEvent: {
                ...usageEvent
            }
        });
    }
    drain() {
        const drainedRollups = [
            ...this.rollupByKey.values()
        ];
        this.rollupByKey = new Map();
        const usageEventsByWorkspaceId = new Map();
        for (const { workspaceId, usageEvent } of drainedRollups){
            const usageEvents = usageEventsByWorkspaceId.get(workspaceId) ?? [];
            usageEvents.push(usageEvent);
            usageEventsByWorkspaceId.set(workspaceId, usageEvents);
        }
        return usageEventsByWorkspaceId;
    }
    constructor(maxEntries){
        this.maxEntries = maxEntries;
        this.rollupByKey = new Map();
    }
};

//# sourceMappingURL=usage-rollup-buffer.js.map
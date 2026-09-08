"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeTargetReconciliationOperations", {
    enumerable: true,
    get: function() {
        return computeTargetReconciliationOperations;
    }
});
const _utils = require("twenty-shared/utils");
const getTargetIdentityKey = ({ parentId, targetPersonId, targetCompanyId, targetOpportunityId })=>[
        parentId,
        targetPersonId ?? '',
        targetCompanyId ?? '',
        targetOpportunityId ?? ''
    ].join(':');
const computeTargetReconciliationOperations = ({ desiredTargets, existingTargets })=>{
    const desiredTargetByKey = new Map(desiredTargets.map((target)=>[
            getTargetIdentityKey(target),
            target
        ]));
    const liveTargetByKey = new Map(existingTargets.filter((target)=>!(0, _utils.isDefined)(target.deletedAt)).map((target)=>[
            getTargetIdentityKey(target),
            target
        ]));
    const tombstoneKeys = new Set(existingTargets.filter((target)=>(0, _utils.isDefined)(target.deletedAt)).map(getTargetIdentityKey));
    const targetsToCreate = [
        ...desiredTargetByKey.entries()
    ].filter(([key])=>!liveTargetByKey.has(key) && !tombstoneKeys.has(key)).map(([, target])=>target);
    const targetsToMarkAutomatic = [
        ...desiredTargetByKey.keys()
    ].map((key)=>liveTargetByKey.get(key)).filter(_utils.isDefined).filter((target)=>!target.isAutomaticallyAssigned).map((target)=>target.id);
    const obsoleteLiveTargets = [
        ...liveTargetByKey.entries()
    ].filter(([key])=>!desiredTargetByKey.has(key)).map(([, target])=>target);
    return {
        targetsToCreate,
        targetsToMarkAutomatic,
        targetsToMarkNotAutomatic: obsoleteLiveTargets.filter((target)=>target.isAutomaticallyAssigned && target.isManuallyAssigned).map((target)=>target.id),
        targetIdsToDelete: obsoleteLiveTargets.filter((target)=>!target.isManuallyAssigned).map((target)=>target.id)
    };
};

//# sourceMappingURL=compute-target-reconciliation-operations.util.js.map
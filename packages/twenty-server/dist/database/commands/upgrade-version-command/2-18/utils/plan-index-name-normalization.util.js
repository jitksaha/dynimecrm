"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "planIndexNameNormalization", {
    enumerable: true,
    get: function() {
        return planIndexNameNormalization;
    }
});
const planIndexNameNormalization = (indexStatuses)=>{
    const operations = [];
    const statusesByExpectedName = new Map();
    for (const status of indexStatuses){
        const group = statusesByExpectedName.get(status.expectedName) ?? [];
        group.push(status);
        statusesByExpectedName.set(status.expectedName, group);
    }
    for (const [expectedName, group] of statusesByExpectedName){
        const survivor = group.find((status)=>status.currentName === expectedName) ?? group[0];
        if (survivor.currentName !== expectedName) {
            operations.push({
                type: 'rename',
                indexMetadataId: survivor.indexMetadataId,
                objectMetadataId: survivor.objectMetadataId,
                fromName: survivor.currentName,
                toName: expectedName
            });
        }
        for (const status of group){
            if (status.indexMetadataId === survivor.indexMetadataId) {
                continue;
            }
            operations.push({
                type: 'dropRedundant',
                indexMetadataId: status.indexMetadataId,
                objectMetadataId: status.objectMetadataId,
                redundantName: status.currentName,
                keptName: expectedName
            });
        }
    }
    return operations;
};

//# sourceMappingURL=plan-index-name-normalization.util.js.map
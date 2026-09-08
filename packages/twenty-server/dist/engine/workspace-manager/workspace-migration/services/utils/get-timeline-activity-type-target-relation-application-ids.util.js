"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getTimelineActivityTypeTargetRelationApplicationIds", {
    enumerable: true,
    get: function() {
        return getTimelineActivityTypeTargetRelationApplicationIds;
    }
});
const _utils = require("twenty-shared/utils");
const getTimelineActivityTypeTargetRelationApplicationIds = ({ flatFieldMetadataMaps, timelineActivityTypeOperations })=>{
    if (!(0, _utils.isDefined)(flatFieldMetadataMaps) || !(0, _utils.isDefined)(timelineActivityTypeOperations)) {
        return [];
    }
    const applicationIds = new Set();
    for (const timelineActivityType of [
        ...Object.values(timelineActivityTypeOperations.flatEntityToCreate),
        ...Object.values(timelineActivityTypeOperations.flatEntityToUpdate),
        ...Object.values(timelineActivityTypeOperations.flatEntityToDelete)
    ]){
        if (!(0, _utils.isDefined)(timelineActivityType)) {
            continue;
        }
        const targetRelationFieldUniversalIdentifier = timelineActivityType.targetRelationFieldUniversalIdentifier;
        if (!(0, _utils.isDefined)(targetRelationFieldUniversalIdentifier)) {
            continue;
        }
        const targetRelationField = flatFieldMetadataMaps.byUniversalIdentifier[targetRelationFieldUniversalIdentifier];
        if ((0, _utils.isDefined)(targetRelationField)) {
            applicationIds.add(targetRelationField.applicationId);
        }
    }
    return [
        ...applicationIds
    ];
};

//# sourceMappingURL=get-timeline-activity-type-target-relation-application-ids.util.js.map
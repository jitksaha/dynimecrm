"use strict";
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
    get isValidTimelineActivityTypeOverride () {
        return isValidTimelineActivityTypeOverride;
    },
    get partitionTimelineActivityTypesByValidity () {
        return partitionTimelineActivityTypesByValidity;
    }
});
const _utils = require("twenty-shared/utils");
const containSameValues = (firstValues, secondValues)=>{
    if (!(0, _utils.isDefined)(firstValues) || !(0, _utils.isDefined)(secondValues)) {
        return firstValues === secondValues;
    }
    const firstValueSet = new Set(firstValues);
    const secondValueSet = new Set(secondValues);
    return firstValueSet.size === secondValueSet.size && [
        ...firstValueSet
    ].every((value)=>secondValueSet.has(value));
};
const isValidTimelineActivityTypeOverride = ({ timelineActivityType, objectOwner, overriddenTimelineActivityType })=>{
    if ((0, _utils.isDefined)(timelineActivityType.objectUniversalIdentifier) && !(0, _utils.isDefined)(objectOwner)) {
        return false;
    }
    const targetsAnotherApplication = (0, _utils.isDefined)(objectOwner) && objectOwner.applicationUniversalIdentifier !== timelineActivityType.applicationUniversalIdentifier;
    const overrideUniversalIdentifier = timelineActivityType.replacesTimelineActivityTypeUniversalIdentifier;
    if (!(0, _utils.isDefined)(timelineActivityType.action)) {
        return !(0, _utils.isDefined)(overrideUniversalIdentifier);
    }
    if (!targetsAnotherApplication) {
        return !(0, _utils.isDefined)(overrideUniversalIdentifier);
    }
    return (0, _utils.isDefined)(overrideUniversalIdentifier) && (0, _utils.isDefined)(overriddenTimelineActivityType) && overriddenTimelineActivityType.applicationUniversalIdentifier === objectOwner.applicationUniversalIdentifier && overriddenTimelineActivityType.action === timelineActivityType.action && (!(0, _utils.isDefined)(overriddenTimelineActivityType.objectUniversalIdentifier) || overriddenTimelineActivityType.objectUniversalIdentifier === timelineActivityType.objectUniversalIdentifier) && overriddenTimelineActivityType.targetRelationFieldUniversalIdentifier === timelineActivityType.targetRelationFieldUniversalIdentifier && containSameValues(overriddenTimelineActivityType.triggerFieldUniversalIdentifiers, timelineActivityType.triggerFieldUniversalIdentifiers);
};
const partitionTimelineActivityTypesByValidity = ({ timelineActivityTypes, objectMetadataByUniversalIdentifier, timelineActivityTypeByUniversalIdentifier })=>{
    const validTimelineActivityTypes = [];
    const invalidTimelineActivityTypes = [];
    for (const timelineActivityType of timelineActivityTypes){
        const isValid = isValidTimelineActivityTypeOverride({
            timelineActivityType,
            objectOwner: (0, _utils.isDefined)(timelineActivityType.objectUniversalIdentifier) ? objectMetadataByUniversalIdentifier[timelineActivityType.objectUniversalIdentifier] : undefined,
            overriddenTimelineActivityType: (0, _utils.isDefined)(timelineActivityType.replacesTimelineActivityTypeUniversalIdentifier) ? timelineActivityTypeByUniversalIdentifier[timelineActivityType.replacesTimelineActivityTypeUniversalIdentifier] : undefined
        });
        (isValid ? validTimelineActivityTypes : invalidTimelineActivityTypes).push(timelineActivityType);
    }
    return {
        validTimelineActivityTypes,
        invalidTimelineActivityTypes
    };
};

//# sourceMappingURL=is-valid-timeline-activity-type-override.util.js.map
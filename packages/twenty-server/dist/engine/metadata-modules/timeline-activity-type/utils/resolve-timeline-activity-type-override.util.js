"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveTimelineActivityTypeOverride", {
    enumerable: true,
    get: function() {
        return resolveTimelineActivityTypeOverride;
    }
});
const _utils = require("twenty-shared/utils");
const resolveTimelineActivityTypeOverride = (timelineActivityTypes, allTimelineActivityTypeUniversalIdentifiers)=>{
    const validCandidates = timelineActivityTypes.filter((timelineActivityType)=>!(0, _utils.isDefined)(timelineActivityType.replacesTimelineActivityTypeUniversalIdentifier) || allTimelineActivityTypeUniversalIdentifiers.has(timelineActivityType.replacesTimelineActivityTypeUniversalIdentifier));
    const overriddenUniversalIdentifiers = new Set(validCandidates.map((timelineActivityType)=>timelineActivityType.replacesTimelineActivityTypeUniversalIdentifier).filter(_utils.isDefined));
    const effectiveCandidates = validCandidates.filter((timelineActivityType)=>!overriddenUniversalIdentifiers.has(timelineActivityType.universalIdentifier));
    return effectiveCandidates.length === 1 ? effectiveCandidates[0] : undefined;
};

//# sourceMappingURL=resolve-timeline-activity-type-override.util.js.map
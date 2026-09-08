"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveTimelineActivityTypeRouting", {
    enumerable: true,
    get: function() {
        return resolveTimelineActivityTypeRouting;
    }
});
const _application = require("twenty-shared/application");
const _utils = require("twenty-shared/utils");
const _standardtimelineactivityhappensat238constant = require("../../../engine/metadata-modules/timeline-activity-type/constants/standard-timeline-activity-happens-at-2-38.constant");
const _standardtimelineactivityrouting234constant = require("../../../engine/metadata-modules/timeline-activity-type/constants/standard-timeline-activity-routing-2-34.constant");
const STANDARD_ROUTING_BY_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER = new Map(_standardtimelineactivityrouting234constant.STANDARD_TIMELINE_ACTIVITY_ROUTINGS_2_34.map((routing)=>[
        routing.universalIdentifier,
        {
            targetRelationFieldUniversalIdentifier: routing.targetRelationFieldUniversalIdentifier,
            triggerFieldUniversalIdentifiers: (0, _utils.isDefined)(routing.triggerFieldUniversalIdentifiers) ? [
                ...routing.triggerFieldUniversalIdentifiers
            ] : null
        }
    ]));
const STANDARD_HAPPENS_AT_BY_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER = new Map(_standardtimelineactivityhappensat238constant.STANDARD_TIMELINE_ACTIVITY_HAPPENS_AT_2_38.map((happensAt)=>[
        happensAt.universalIdentifier,
        happensAt.happensAtFieldUniversalIdentifier
    ]));
const resolveHappensAtFieldUniversalIdentifier = (timelineActivityType)=>{
    if ((0, _utils.isDefined)(timelineActivityType.happensAtFieldUniversalIdentifier)) {
        return timelineActivityType.happensAtFieldUniversalIdentifier;
    }
    // Standard rows can be served before their 2.38 workspace command runs.
    if (timelineActivityType.applicationUniversalIdentifier !== _application.TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER) {
        return null;
    }
    return STANDARD_HAPPENS_AT_BY_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER.get(timelineActivityType.universalIdentifier) ?? null;
};
const resolveTimelineActivityTypeRouting = (timelineActivityType)=>{
    const happensAtFieldUniversalIdentifier = resolveHappensAtFieldUniversalIdentifier(timelineActivityType);
    if ((0, _utils.isDefined)(timelineActivityType.targetRelationFieldUniversalIdentifier)) {
        return {
            targetRelationFieldUniversalIdentifier: timelineActivityType.targetRelationFieldUniversalIdentifier,
            triggerFieldUniversalIdentifiers: timelineActivityType.triggerFieldUniversalIdentifiers,
            happensAtFieldUniversalIdentifier
        };
    }
    // Standard rows can be served before their 2.34 workspace command runs.
    if (timelineActivityType.applicationUniversalIdentifier !== _application.TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER) {
        return undefined;
    }
    const standardRouting = STANDARD_ROUTING_BY_TIMELINE_ACTIVITY_TYPE_UNIVERSAL_IDENTIFIER.get(timelineActivityType.universalIdentifier);
    return (0, _utils.isDefined)(standardRouting) ? {
        ...standardRouting,
        happensAtFieldUniversalIdentifier
    } : undefined;
};

//# sourceMappingURL=resolve-timeline-activity-type-routing.util.js.map
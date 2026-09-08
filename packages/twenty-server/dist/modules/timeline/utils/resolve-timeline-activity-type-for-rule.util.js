"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveTimelineActivityTypeForRule", {
    enumerable: true,
    get: function() {
        return resolveTimelineActivityTypeForRule;
    }
});
const resolveTimelineActivityTypeForRule = ({ rule, ruleAction, resolveTimelineActivityType })=>rule.timelineActivityType ?? resolveTimelineActivityType({
        action: ruleAction,
        objectUniversalIdentifier: rule.sourceFlatObjectMetadata.universalIdentifier
    });

//# sourceMappingURL=resolve-timeline-activity-type-for-rule.util.js.map
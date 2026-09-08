"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildTimelineActivitySelfRule", {
    enumerable: true,
    get: function() {
        return buildTimelineActivitySelfRule;
    }
});
const _utils = require("twenty-shared/utils");
const DEFAULT_SELF_RULE_ACTIONS = [
    'created',
    'updated',
    'deleted',
    'restored'
];
const buildTimelineActivitySelfRule = ({ flatObjectMetadata, timelineActivityTypes })=>{
    const declaredActions = timelineActivityTypes.filter((timelineActivityType)=>timelineActivityType.objectUniversalIdentifier === flatObjectMetadata.universalIdentifier && !(0, _utils.isDefined)(timelineActivityType.targetRelationFieldUniversalIdentifier)).map(({ action })=>action).filter(_utils.isDefined);
    const defaultActions = flatObjectMetadata.isAuditLogged && !flatObjectMetadata.isSystem ? DEFAULT_SELF_RULE_ACTIONS : [];
    const actions = [
        ...new Set([
            ...defaultActions,
            ...declaredActions
        ])
    ];
    if (!(0, _utils.isNonEmptyArray)(actions)) {
        return undefined;
    }
    return {
        sourceFlatObjectMetadata: flatObjectMetadata,
        actions,
        triggerFieldNames: null,
        happensAtFieldName: null,
        targetShape: {
            kind: 'SELF'
        }
    };
};

//# sourceMappingURL=build-timeline-activity-self-rule.util.js.map
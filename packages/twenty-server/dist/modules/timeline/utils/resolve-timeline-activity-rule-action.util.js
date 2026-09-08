"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveTimelineActivityRuleAction", {
    enumerable: true,
    get: function() {
        return resolveTimelineActivityRuleAction;
    }
});
const _utils = require("twenty-shared/utils");
const SOURCE_EVENT_ACTIONS = {
    created: 'created',
    updated: 'updated',
    deleted: 'deleted',
    restored: 'restored'
};
const resolveTimelineActivityRuleAction = ({ actions, targetShape, eventAction, eventSource })=>{
    const sourceEventAction = SOURCE_EVENT_ACTIONS[eventAction];
    if (eventSource === 'SOURCE' && (0, _utils.isDefined)(sourceEventAction) && actions.includes(sourceEventAction)) {
        return sourceEventAction;
    }
    if (eventSource === 'SOURCE' && targetShape.kind !== 'DIRECT_RELATION' || eventSource === 'JUNCTION' && targetShape.kind !== 'JUNCTION') {
        return undefined;
    }
    if ((eventAction === 'created' || eventAction === 'restored') && actions.includes('linked')) {
        return 'linked';
    }
    if (eventAction === 'deleted' && actions.includes('unlinked')) {
        return 'unlinked';
    }
    if (eventAction === 'updated') {
        return actions.find((action)=>action === 'linked' || action === 'unlinked');
    }
    return undefined;
};

//# sourceMappingURL=resolve-timeline-activity-rule-action.util.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildTimelineActivityTypeResolver", {
    enumerable: true,
    get: function() {
        return buildTimelineActivityTypeResolver;
    }
});
const _utils = require("twenty-shared/utils");
const buildTimelineActivityTypeResolver = (flatTimelineActivityTypeMaps)=>{
    const idByObjectAndAction = new Map();
    const idByAction = new Map();
    const orderedFlatTimelineActivityTypes = Object.entries(flatTimelineActivityTypeMaps.byUniversalIdentifier).sort(([leftUniversalIdentifier], [rightUniversalIdentifier])=>leftUniversalIdentifier.localeCompare(rightUniversalIdentifier)).map(([, flatTimelineActivityType])=>flatTimelineActivityType);
    for (const flatTimelineActivityType of orderedFlatTimelineActivityTypes){
        if (!(0, _utils.isDefined)(flatTimelineActivityType) || !(0, _utils.isDefined)(flatTimelineActivityType.action)) {
            continue;
        }
        const { action, objectUniversalIdentifier, id } = flatTimelineActivityType;
        if (!(0, _utils.isDefined)(objectUniversalIdentifier)) {
            if (!idByAction.has(action)) {
                idByAction.set(action, id);
            }
            continue;
        }
        const key = `${objectUniversalIdentifier}|${action}`;
        if (!idByObjectAndAction.has(key)) {
            idByObjectAndAction.set(key, id);
        }
    }
    return ({ action, objectUniversalIdentifier })=>((0, _utils.isDefined)(objectUniversalIdentifier) ? idByObjectAndAction.get(`${objectUniversalIdentifier}|${action}`) : undefined) ?? idByAction.get(action);
};

//# sourceMappingURL=resolve-timeline-activity-type-id.util.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildLinkedTimelineActivityHappensAtSyncUpdates", {
    enumerable: true,
    get: function() {
        return buildLinkedTimelineActivityHappensAtSyncUpdates;
    }
});
const _utils = require("twenty-shared/utils");
const _doesobjectrecordeventchangefieldsutil = require("./does-object-record-event-change-fields.util");
const _resolvetimelineactivitytypeforruleutil = require("./resolve-timeline-activity-type-for-rule.util");
const buildLinkedTimelineActivityHappensAtSyncUpdates = ({ rules, events, resolveTimelineActivityType })=>{
    const linkedRules = rules.filter((rule)=>rule.targetShape.kind !== 'SELF' && rule.actions.includes('linked'));
    if (linkedRules.length === 0) {
        return [];
    }
    const updates = [];
    for (const rule of linkedRules){
        const happensAtFieldName = rule.happensAtFieldName;
        const timelineActivityTypeId = (0, _resolvetimelineactivitytypeforruleutil.resolveTimelineActivityTypeForRule)({
            rule,
            ruleAction: 'linked',
            resolveTimelineActivityType
        })?.id;
        if (!(0, _utils.isDefined)(happensAtFieldName) || !(0, _utils.isDefined)(timelineActivityTypeId)) {
            continue;
        }
        const linkedRecordIds = [
            ...new Set(events.filter((event)=>(0, _doesobjectrecordeventchangefieldsutil.doesObjectRecordEventChangeFields)({
                    event,
                    fieldNames: [
                        happensAtFieldName
                    ]
                })).map((event)=>event.recordId))
        ];
        if (linkedRecordIds.length === 0) {
            continue;
        }
        updates.push({
            sourceObjectNameSingular: rule.sourceFlatObjectMetadata.nameSingular,
            happensAtFieldName,
            timelineActivityTypeIds: [
                timelineActivityTypeId
            ],
            linkedRecordIds
        });
    }
    return updates;
};

//# sourceMappingURL=build-linked-timeline-activity-happens-at-sync-updates.util.js.map
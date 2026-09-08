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
    get buildTimelineActivityTypeResolution () {
        return buildTimelineActivityTypeResolution;
    },
    get toResolvedTimelineActivityType () {
        return toResolvedTimelineActivityType;
    }
});
const _utils = require("twenty-shared/utils");
const _resolveoverridableentitypropertyutil = require("../../../engine/metadata-modules/utils/resolve-overridable-entity-property.util");
const _isvalidtimelineactivitytypeoverrideutil = require("../../../engine/metadata-modules/timeline-activity-type/utils/is-valid-timeline-activity-type-override.util");
const _resolvetimelineactivitytypeoverrideutil = require("../../../engine/metadata-modules/timeline-activity-type/utils/resolve-timeline-activity-type-override.util");
const _resolvetimelineactivitytyperoutingutil = require("./resolve-timeline-activity-type-routing.util");
const toResolvedTimelineActivityType = (timelineActivityType)=>({
        id: timelineActivityType.id,
        applicationId: timelineActivityType.applicationId,
        snapshot: {
            id: timelineActivityType.id,
            universalIdentifier: timelineActivityType.universalIdentifier,
            name: timelineActivityType.name,
            label: (0, _resolveoverridableentitypropertyutil.resolveOverridableEntityProperty)(timelineActivityType, 'label'),
            action: timelineActivityType.action,
            icon: (0, _resolveoverridableentitypropertyutil.resolveOverridableEntityProperty)(timelineActivityType, 'icon'),
            objectUniversalIdentifier: timelineActivityType.objectUniversalIdentifier,
            frontComponentUniversalIdentifier: timelineActivityType.frontComponentUniversalIdentifier
        }
    });
const buildTimelineActivityTypeResolution = (flatTimelineActivityTypeMaps)=>{
    const allUnvalidatedTimelineActivityTypes = Object.values(flatTimelineActivityTypeMaps.byUniversalIdentifier).filter(_utils.isDefined);
    const timelineActivityTypeByUniversalIdentifier = Object.fromEntries(allUnvalidatedTimelineActivityTypes.map((timelineActivityType)=>[
            timelineActivityType.universalIdentifier,
            timelineActivityType
        ]));
    const { validTimelineActivityTypes, invalidTimelineActivityTypes } = (0, _isvalidtimelineactivitytypeoverrideutil.partitionTimelineActivityTypesByValidity)({
        timelineActivityTypes: allUnvalidatedTimelineActivityTypes,
        objectMetadataByUniversalIdentifier: flatTimelineActivityTypeMaps.objectMetadataByUniversalIdentifier,
        timelineActivityTypeByUniversalIdentifier
    });
    const allTimelineActivityTypes = validTimelineActivityTypes.map((timelineActivityType)=>{
        const routing = (0, _resolvetimelineactivitytyperoutingutil.resolveTimelineActivityTypeRouting)(timelineActivityType);
        return (0, _utils.isDefined)(routing) ? {
            ...timelineActivityType,
            ...routing
        } : timelineActivityType;
    });
    const allTimelineActivityTypeUniversalIdentifiers = new Set(allTimelineActivityTypes.map((timelineActivityType)=>timelineActivityType.universalIdentifier));
    const candidatesByEmitKey = new Map();
    for (const timelineActivityType of allTimelineActivityTypes){
        if (!(0, _utils.isDefined)(timelineActivityType.action)) {
            continue;
        }
        const emitKey = [
            timelineActivityType.action,
            timelineActivityType.objectUniversalIdentifier ?? 'ANY_OBJECT',
            timelineActivityType.targetRelationFieldUniversalIdentifier ?? 'SELF'
        ].join('|');
        const candidates = candidatesByEmitKey.get(emitKey);
        if ((0, _utils.isDefined)(candidates)) {
            candidates.push(timelineActivityType);
        } else {
            candidatesByEmitKey.set(emitKey, [
                timelineActivityType
            ]);
        }
    }
    const effectiveTimelineActivityTypes = [];
    const routingConflicts = [];
    const resolverConflicts = [];
    const conflictedObjectAndActionKeys = new Set();
    for (const candidates of candidatesByEmitKey.values()){
        const effectiveTimelineActivityType = (0, _resolvetimelineactivitytypeoverrideutil.resolveTimelineActivityTypeOverride)(candidates, allTimelineActivityTypeUniversalIdentifiers);
        if ((0, _utils.isDefined)(effectiveTimelineActivityType)) {
            effectiveTimelineActivityTypes.push(effectiveTimelineActivityType);
            continue;
        }
        const [candidate] = candidates;
        if (!(0, _utils.isDefined)(candidate.action)) {
            continue;
        }
        const conflict = {
            action: candidate.action,
            objectUniversalIdentifier: candidate.objectUniversalIdentifier
        };
        if ((0, _utils.isDefined)(candidate.targetRelationFieldUniversalIdentifier)) {
            routingConflicts.push(conflict);
            continue;
        }
        resolverConflicts.push(conflict);
        if ((0, _utils.isDefined)(conflict.objectUniversalIdentifier)) {
            conflictedObjectAndActionKeys.add(`${conflict.objectUniversalIdentifier}|${conflict.action}`);
        }
    }
    const typeByAction = new Map();
    const typeByObjectAndAction = new Map();
    const suppressedObjectAndActionKeys = new Set();
    for (const timelineActivityType of effectiveTimelineActivityTypes){
        const { action, objectUniversalIdentifier } = timelineActivityType;
        if (!(0, _utils.isDefined)(action) || (0, _utils.isDefined)(timelineActivityType.targetRelationFieldUniversalIdentifier)) {
            continue;
        }
        if (!(0, _utils.isDefined)(objectUniversalIdentifier)) {
            if (timelineActivityType.isActive) {
                typeByAction.set(action, toResolvedTimelineActivityType(timelineActivityType));
            }
            continue;
        }
        const key = `${objectUniversalIdentifier}|${action}`;
        if (timelineActivityType.isActive) {
            typeByObjectAndAction.set(key, toResolvedTimelineActivityType(timelineActivityType));
        } else {
            suppressedObjectAndActionKeys.add(key);
        }
    }
    const resolveTimelineActivityType = ({ action, objectUniversalIdentifier })=>{
        const objectAndActionKey = (0, _utils.isDefined)(objectUniversalIdentifier) ? `${objectUniversalIdentifier}|${action}` : undefined;
        if ((0, _utils.isDefined)(objectAndActionKey) && (conflictedObjectAndActionKeys.has(objectAndActionKey) || suppressedObjectAndActionKeys.has(objectAndActionKey))) {
            return undefined;
        }
        return ((0, _utils.isDefined)(objectAndActionKey) ? typeByObjectAndAction.get(objectAndActionKey) : undefined) ?? typeByAction.get(action);
    };
    return {
        resolveTimelineActivityType,
        effectiveTimelineActivityTypes,
        routingConflicts,
        resolverConflicts,
        invalidContracts: invalidTimelineActivityTypes.flatMap(({ action, objectUniversalIdentifier })=>(0, _utils.isDefined)(action) ? [
                {
                    action,
                    objectUniversalIdentifier
                }
            ] : [])
    };
};

//# sourceMappingURL=resolve-timeline-activity-type.util.js.map
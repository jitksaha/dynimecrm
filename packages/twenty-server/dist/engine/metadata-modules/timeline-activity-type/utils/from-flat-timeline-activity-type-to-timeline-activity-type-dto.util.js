"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromFlatTimelineActivityTypeToTimelineActivityTypeDto", {
    enumerable: true,
    get: function() {
        return fromFlatTimelineActivityTypeToTimelineActivityTypeDto;
    }
});
const _utils = require("twenty-shared/utils");
const _resolveoverridableentitypropertyutil = require("../../utils/resolve-overridable-entity-property.util");
const fromFlatTimelineActivityTypeToTimelineActivityTypeDto = (flatTimelineActivityType)=>({
        id: flatTimelineActivityType.id,
        universalIdentifier: flatTimelineActivityType.universalIdentifier,
        name: flatTimelineActivityType.name,
        label: (0, _resolveoverridableentitypropertyutil.resolveOverridableEntityProperty)(flatTimelineActivityType, 'label'),
        emit: (0, _utils.isDefined)(flatTimelineActivityType.action) ? {
            on: flatTimelineActivityType.action,
            objectUniversalIdentifier: flatTimelineActivityType.objectUniversalIdentifier,
            through: (0, _utils.isDefined)(flatTimelineActivityType.targetRelationFieldUniversalIdentifier) ? {
                relationFieldUniversalIdentifier: flatTimelineActivityType.targetRelationFieldUniversalIdentifier,
                triggerFieldUniversalIdentifiers: flatTimelineActivityType.triggerFieldUniversalIdentifiers,
                happensAtFieldUniversalIdentifier: flatTimelineActivityType.happensAtFieldUniversalIdentifier
            } : null
        } : null,
        action: flatTimelineActivityType.action,
        icon: (0, _resolveoverridableentitypropertyutil.resolveOverridableEntityProperty)(flatTimelineActivityType, 'icon'),
        frontComponentUniversalIdentifier: flatTimelineActivityType.frontComponentUniversalIdentifier,
        objectUniversalIdentifier: flatTimelineActivityType.objectUniversalIdentifier,
        replacesTimelineActivityTypeUniversalIdentifier: flatTimelineActivityType.replacesTimelineActivityTypeUniversalIdentifier,
        isActive: flatTimelineActivityType.isActive,
        workspaceId: flatTimelineActivityType.workspaceId,
        applicationId: flatTimelineActivityType.applicationId,
        overrides: flatTimelineActivityType.overrides,
        createdAt: new Date(flatTimelineActivityType.createdAt),
        updatedAt: new Date(flatTimelineActivityType.updatedAt)
    });

//# sourceMappingURL=from-flat-timeline-activity-type-to-timeline-activity-type-dto.util.js.map
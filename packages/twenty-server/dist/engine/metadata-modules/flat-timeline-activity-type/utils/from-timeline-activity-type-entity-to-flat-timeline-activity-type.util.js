"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromTimelineActivityTypeEntityToFlatTimelineActivityType", {
    enumerable: true,
    get: function() {
        return fromTimelineActivityTypeEntityToFlatTimelineActivityType;
    }
});
const _fromentitytoscalarentityutil = require("../../flat-entity/utils/from-entity-to-scalar-entity.util");
const _resolvemanytoonerelationidstouniversalidentifiersutil = require("../../../workspace-manager/workspace-migration/universal-flat-entity/utils/resolve-many-to-one-relation-ids-to-universal-identifiers.util");
const fromTimelineActivityTypeEntityToFlatTimelineActivityType = (args)=>{
    const { entity: timelineActivityTypeEntity } = args;
    const timelineActivityTypeScalarEntity = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)({
        metadataName: 'timelineActivityType',
        entity: timelineActivityTypeEntity
    });
    const relationUniversalIdentifiers = (0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)({
        metadataName: 'timelineActivityType',
        ...args
    });
    return {
        ...timelineActivityTypeScalarEntity,
        ...relationUniversalIdentifiers
    };
};

//# sourceMappingURL=from-timeline-activity-type-entity-to-flat-timeline-activity-type.util.js.map
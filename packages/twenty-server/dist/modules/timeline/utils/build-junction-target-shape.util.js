"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildJunctionTargetShape", {
    enumerable: true,
    get: function() {
        return buildJunctionTargetShape;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _getjoincolumnnameforrelationfieldutil = require("../../../engine/metadata-modules/field-metadata/utils/get-join-column-name-for-relation-field.util");
const _isfieldmetadatasettingsoftypeutil = require("../../../engine/metadata-modules/field-metadata/utils/is-field-metadata-settings-of-type.util");
const _findflatentitybyidinflatentitymapsutil = require("../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _buildtimelineactivitytargetjoincolumnsutil = require("./build-timeline-activity-target-join-columns.util");
const buildJunctionTargetShape = ({ relationFlatFieldMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps })=>{
    const { settings } = relationFlatFieldMetadata;
    if (!(0, _isfieldmetadatasettingsoftypeutil.isFieldMetadataSettingsOfType)(settings, _types.FieldMetadataType.RELATION)) {
        return undefined;
    }
    if (settings.relationType !== _types.RelationType.ONE_TO_MANY) {
        return undefined;
    }
    const junctionTargetFieldId = settings.junctionTargetFieldId;
    if (!(0, _utils.isDefined)(junctionTargetFieldId)) {
        return undefined;
    }
    const { relationTargetObjectMetadataId, relationTargetFieldMetadataId } = relationFlatFieldMetadata;
    if (!(0, _utils.isDefined)(relationTargetObjectMetadataId) || !(0, _utils.isDefined)(relationTargetFieldMetadataId)) {
        return undefined;
    }
    const junctionFlatObjectMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
        flatEntityId: relationTargetObjectMetadataId,
        flatEntityMaps: flatObjectMetadataMaps
    });
    if (!(0, _utils.isDefined)(junctionFlatObjectMetadata)) {
        return undefined;
    }
    const junctionSourceFlatFieldMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
        flatEntityId: relationTargetFieldMetadataId,
        flatEntityMaps: flatFieldMetadataMaps
    });
    if (!(0, _utils.isDefined)(junctionSourceFlatFieldMetadata)) {
        return undefined;
    }
    const junctionSourceJoinColumnName = (0, _getjoincolumnnameforrelationfieldutil.getJoinColumnNameForRelationField)(junctionSourceFlatFieldMetadata);
    const junctionTargetFlatFieldMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
        flatEntityId: junctionTargetFieldId,
        flatEntityMaps: flatFieldMetadataMaps
    });
    if (!(0, _utils.isDefined)(junctionTargetFlatFieldMetadata)) {
        return undefined;
    }
    const targetJoinColumns = (0, _buildtimelineactivitytargetjoincolumnsutil.buildTimelineActivityTargetJoinColumns)({
        targetFlatFieldMetadata: junctionTargetFlatFieldMetadata,
        flatObjectMetadataMaps,
        flatFieldMetadataMaps
    });
    if (targetJoinColumns.length === 0) {
        return undefined;
    }
    return {
        kind: 'JUNCTION',
        junctionObjectMetadataId: junctionFlatObjectMetadata.id,
        junctionObjectNameSingular: junctionFlatObjectMetadata.nameSingular,
        junctionSourceJoinColumnName,
        targetJoinColumns
    };
};

//# sourceMappingURL=build-junction-target-shape.util.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildTimelineActivityTargetJoinColumns", {
    enumerable: true,
    get: function() {
        return buildTimelineActivityTargetJoinColumns;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _getjoincolumnnameforrelationfieldutil = require("../../../engine/metadata-modules/field-metadata/utils/get-join-column-name-for-relation-field.util");
const _flatentitymapsexception = require("../../../engine/metadata-modules/flat-entity/exceptions/flat-entity-maps.exception");
const _findflatentitybyidinflatentitymapsutil = require("../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _findallothersmorphrelationflatfieldmetadatasorthrowutil = require("../../../engine/metadata-modules/flat-field-metadata/utils/find-all-others-morph-relation-flat-field-metadatas-or-throw.util");
const _isflatfieldmetadataoftypeutil = require("../../../engine/metadata-modules/flat-field-metadata/utils/is-flat-field-metadata-of-type.util");
const buildTimelineActivityTargetJoinColumns = ({ targetFlatFieldMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps })=>{
    const containingFlatObjectMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
        flatEntityId: targetFlatFieldMetadata.objectMetadataId,
        flatEntityMaps: flatObjectMetadataMaps
    });
    if (!(0, _utils.isDefined)(containingFlatObjectMetadata)) {
        return [];
    }
    let targetFlatFieldMetadatas;
    try {
        targetFlatFieldMetadatas = (0, _isflatfieldmetadataoftypeutil.isFlatFieldMetadataOfType)(targetFlatFieldMetadata, _types.FieldMetadataType.MORPH_RELATION) ? [
            targetFlatFieldMetadata,
            ...(0, _findallothersmorphrelationflatfieldmetadatasorthrowutil.findAllOthersMorphRelationFlatFieldMetadatasOrThrow)({
                flatFieldMetadata: targetFlatFieldMetadata,
                flatFieldMetadataMaps,
                flatObjectMetadata: containingFlatObjectMetadata
            })
        ] : [
            targetFlatFieldMetadata
        ];
    } catch (error) {
        if (error instanceof _flatentitymapsexception.FlatEntityMapsException) {
            return [];
        }
        throw error;
    }
    return targetFlatFieldMetadatas.map((flatFieldMetadata)=>{
        const targetObjectMetadataId = flatFieldMetadata.relationTargetObjectMetadataId;
        if (!(0, _utils.isDefined)(targetObjectMetadataId)) {
            return undefined;
        }
        const targetFlatObjectMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: targetObjectMetadataId,
            flatEntityMaps: flatObjectMetadataMaps
        });
        if (!(0, _utils.isDefined)(targetFlatObjectMetadata)) {
            return undefined;
        }
        return {
            joinColumnName: (0, _getjoincolumnnameforrelationfieldutil.getJoinColumnNameForRelationField)(flatFieldMetadata),
            targetObjectNameSingular: targetFlatObjectMetadata.nameSingular
        };
    }).filter(_utils.isDefined);
};

//# sourceMappingURL=build-timeline-activity-target-join-columns.util.js.map
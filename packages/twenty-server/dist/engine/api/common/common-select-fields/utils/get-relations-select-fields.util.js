"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getRelationsSelectFields", {
    enumerable: true,
    get: function() {
        return getRelationsSelectFields;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _getallselectablefieldsutil = require("./get-all-selectable-fields.util");
const _getisflatfieldajoincolumnutil = require("./get-is-flat-field-a-join-column.util");
const _getisflatfieldajunctionrelationfield = require("./get-is-flat-field-a-junction-relation-field");
const _maxdepthconstant = require("../../../rest/input-request-parsers/constants/max-depth.constant");
const _findflatentitybyidinflatentitymapsorthrowutil = require("../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps-or-throw.util");
const _isflatfieldmetadataoftypeutil = require("../../../../metadata-modules/flat-field-metadata/utils/is-flat-field-metadata-of-type.util");
const getRelationsSelectFields = ({ flatObjectMetadataMaps, flatFieldMetadataMaps, flatObjectMetadata, objectsPermissions, depth, onlyUseLabelIdentifierFieldsInRelations = false, currentDepthLevelIsAJunctionTable = false, recurseIntoJunctionTableRelations = false })=>{
    if (!(0, _utils.isDefined)(depth) || depth === 0) return {};
    const relationsSelectFields = {};
    for (const fieldId of flatObjectMetadata.fieldIds){
        const flatField = (0, _findflatentitybyidinflatentitymapsorthrowutil.findFlatEntityByIdInFlatEntityMapsOrThrow)({
            flatEntityMaps: flatFieldMetadataMaps,
            flatEntityId: fieldId
        });
        if (!(0, _isflatfieldmetadataoftypeutil.isFlatFieldMetadataOfType)(flatField, _types.FieldMetadataType.RELATION) && !(0, _isflatfieldmetadataoftypeutil.isFlatFieldMetadataOfType)(flatField, _types.FieldMetadataType.MORPH_RELATION)) {
            continue;
        }
        if (objectsPermissions[flatObjectMetadata.id]?.restrictedFields[flatField.id]?.canRead === false) {
            continue;
        }
        if (currentDepthLevelIsAJunctionTable) {
            const fieldIsJunctionRelation = (0, _getisflatfieldajunctionrelationfield.getIsFlatFieldAJunctionRelationField)({
                flatField
            });
            if (!fieldIsJunctionRelation) {
                continue;
            }
        }
        const relationTargetObjectMetadata = (0, _findflatentitybyidinflatentitymapsorthrowutil.findFlatEntityByIdInFlatEntityMapsOrThrow)({
            flatEntityMaps: flatObjectMetadataMaps,
            flatEntityId: flatField.relationTargetObjectMetadataId
        });
        if (!objectsPermissions[relationTargetObjectMetadata.id]?.canReadObjectRecords) {
            continue;
        }
        const relationFieldSelectFields = (0, _getallselectablefieldsutil.getAllSelectableFields)({
            restrictedFields: objectsPermissions[relationTargetObjectMetadata.id].restrictedFields,
            flatObjectMetadata: relationTargetObjectMetadata,
            flatFieldMetadataMaps,
            onlyUseLabelIdentifierFieldsInRelations
        });
        if (Object.keys(relationFieldSelectFields).length === 0) continue;
        const flatFieldIsJoinColumn = (0, _getisflatfieldajoincolumnutil.getIsFlatFieldAJoinColumn)({
            flatField
        });
        const isFirstDepthLevel = depth === _maxdepthconstant.MAX_DEPTH && (0, _utils.isDefined)(flatField.relationTargetObjectMetadataId);
        const shouldRecurseIntoRelation = isFirstDepthLevel || flatFieldIsJoinColumn && recurseIntoJunctionTableRelations;
        const nextLevelIsAJunctionTable = flatFieldIsJoinColumn;
        if (shouldRecurseIntoRelation) {
            const nestedRelationFieldSelectFields = getRelationsSelectFields({
                flatObjectMetadataMaps,
                flatFieldMetadataMaps,
                flatObjectMetadata: relationTargetObjectMetadata,
                objectsPermissions,
                depth: 1,
                onlyUseLabelIdentifierFieldsInRelations,
                currentDepthLevelIsAJunctionTable: nextLevelIsAJunctionTable,
                recurseIntoJunctionTableRelations
            });
            relationsSelectFields[flatField.name] = {
                ...relationFieldSelectFields,
                ...nestedRelationFieldSelectFields
            };
        } else {
            relationsSelectFields[flatField.name] = relationFieldSelectFields;
        }
    }
    return relationsSelectFields;
};

//# sourceMappingURL=get-relations-select-fields.util.js.map
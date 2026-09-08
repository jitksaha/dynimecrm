"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateJunctionTargetSettings", {
    enumerable: true,
    get: function() {
        return validateJunctionTargetSettings;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _fieldmetadataexception = require("../../../field-metadata/field-metadata.exception");
const _findflatentitybyuniversalidentifierutil = require("../../../flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _ismorphorrelationflatfieldmetadatautil = require("../../utils/is-morph-or-relation-flat-field-metadata.util");
const createError = (code, message, userFriendlyMessage, value)=>({
        code,
        message,
        userFriendlyMessage,
        ...value !== undefined && {
            value
        }
    });
const validateJunctionTargetSettings = ({ universalFlatFieldMetadata, flatFieldMetadataMaps, remainingFlatFieldMetadataMaps })=>{
    const { universalSettings } = universalFlatFieldMetadata;
    if (!(0, _utils.isDefined)(universalSettings)) {
        return [];
    }
    const junctionTargetFieldUniversalIdentifier = universalSettings.junctionTargetFieldUniversalIdentifier;
    if (!(0, _utils.isDefined)(junctionTargetFieldUniversalIdentifier) || junctionTargetFieldUniversalIdentifier.length === 0) {
        return [];
    }
    if (universalSettings.relationType !== _types.RelationType.ONE_TO_MANY) {
        return [
            createError(_fieldmetadataexception.FieldMetadataExceptionCode.INVALID_FIELD_INPUT, 'Junction configuration can only be set on ONE_TO_MANY relations', /*i18n*/ {
                id: "ADIjmK",
                message: "Junction configuration is only valid for ONE_TO_MANY relations"
            })
        ];
    }
    const findFieldByUniversalIdentifier = (universalIdentifier)=>((0, _utils.isDefined)(remainingFlatFieldMetadataMaps) ? (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier,
            flatEntityMaps: remainingFlatFieldMetadataMaps
        }) : undefined) ?? (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier,
            flatEntityMaps: flatFieldMetadataMaps
        });
    const targetField = findFieldByUniversalIdentifier(junctionTargetFieldUniversalIdentifier);
    if (!(0, _utils.isDefined)(targetField)) {
        return [
            createError(_fieldmetadataexception.FieldMetadataExceptionCode.FIELD_METADATA_NOT_FOUND, `Junction target field not found: ${junctionTargetFieldUniversalIdentifier}`, /*i18n*/ {
                id: "qONLh7",
                message: "Junction target field not found"
            }, junctionTargetFieldUniversalIdentifier)
        ];
    }
    if (targetField.objectMetadataUniversalIdentifier !== universalFlatFieldMetadata.relationTargetObjectMetadataUniversalIdentifier) {
        return [
            createError(_fieldmetadataexception.FieldMetadataExceptionCode.INVALID_FIELD_INPUT, `Junction target field ${junctionTargetFieldUniversalIdentifier} is not on the junction object`, /*i18n*/ {
                id: "P+Gspf",
                message: "Junction target field must be on the junction object"
            }, junctionTargetFieldUniversalIdentifier)
        ];
    }
    if (!(0, _ismorphorrelationflatfieldmetadatautil.isMorphOrRelationUniversalFlatFieldMetadata)(targetField)) {
        return [
            createError(_fieldmetadataexception.FieldMetadataExceptionCode.INVALID_FIELD_INPUT, `Junction target field ${junctionTargetFieldUniversalIdentifier} is not a relation field`, /*i18n*/ {
                id: "hLEiPe",
                message: "Junction target field must be a relation field"
            }, junctionTargetFieldUniversalIdentifier)
        ];
    }
    // The frontend mirrors the direction and source-group checks in
    // isValidJunctionTargetField after resolving GraphQL relation groups. These
    // representations use different identifiers, so update both together.
    const sourceFieldUniversalIdentifier = universalFlatFieldMetadata.relationTargetFieldMetadataUniversalIdentifier;
    const sourceField = (0, _utils.isDefined)(sourceFieldUniversalIdentifier) ? findFieldByUniversalIdentifier(sourceFieldUniversalIdentifier) : undefined;
    const targetsSourceMorphRelation = (0, _utils.isDefined)(sourceField) && (0, _utils.isDefined)(sourceField.morphId) && sourceField.morphId === targetField.morphId;
    if (junctionTargetFieldUniversalIdentifier === sourceFieldUniversalIdentifier || targetsSourceMorphRelation) {
        return [
            createError(_fieldmetadataexception.FieldMetadataExceptionCode.INVALID_FIELD_INPUT, 'Junction source and target fields must be different', /*i18n*/ {
                id: "JmUgZR",
                message: "Junction source and target fields must be different"
            }, junctionTargetFieldUniversalIdentifier)
        ];
    }
    if (targetField.universalSettings.relationType !== _types.RelationType.MANY_TO_ONE) {
        return [
            createError(_fieldmetadataexception.FieldMetadataExceptionCode.INVALID_FIELD_INPUT, `Junction target field ${junctionTargetFieldUniversalIdentifier} is not a MANY_TO_ONE relation`, /*i18n*/ {
                id: "bpqhFq",
                message: "Junction target field must be a MANY_TO_ONE relation"
            }, junctionTargetFieldUniversalIdentifier)
        ];
    }
    return [];
};

//# sourceMappingURL=validate-junction-target-settings.util.js.map
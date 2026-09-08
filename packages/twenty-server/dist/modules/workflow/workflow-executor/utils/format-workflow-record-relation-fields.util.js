"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "formatWorkflowRecordRelationFields", {
    enumerable: true,
    get: function() {
        return formatWorkflowRecordRelationFields;
    }
});
const _guards = require("@sniptt/guards");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _getflatfieldsforflatobjectmetadatautil = require("../../../../engine/api/graphql/workspace-schema-builder/utils/get-flat-fields-for-flat-object-metadata.util");
const _computemorphorrelationfieldjoincolumnnameutil = require("../../../../engine/metadata-modules/field-metadata/utils/compute-morph-or-relation-field-join-column-name.util");
const _findflatentitybyidinflatentitymapsutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _isflatfieldmetadataoftypeutil = require("../../../../engine/metadata-modules/flat-field-metadata/utils/is-flat-field-metadata-of-type.util");
const _getmorphnamefrommorphfieldmetadatanameutil = require("../../../../engine/metadata-modules/flat-object-metadata/utils/get-morph-name-from-morph-field-metadata-name.util");
const _isnullrelationvalueutil = require("./is-null-relation-value.util");
const extractMorphValue = (value)=>{
    if (!(0, _guards.isObject)(value)) {
        return null;
    }
    const record = value;
    if ((0, _guards.isString)(record.targetObjectMetadataId) && (0, _guards.isString)(record.id) && (0, _utils.isDefined)(record.id)) {
        return {
            targetObjectMetadataId: record.targetObjectMetadataId,
            id: record.id
        };
    }
    return null;
};
const extractLegacyRelationId = (value)=>{
    if (!(0, _guards.isObject)(value)) {
        return undefined;
    }
    const record = value;
    if (Object.keys(record).length !== 1 || !(0, _guards.isString)(record.id)) {
        return undefined;
    }
    return record.id;
};
const formatWorkflowRecordMorphRelationFields = (record, objectMetadataInfo)=>{
    const { flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps } = objectMetadataInfo;
    const objectFields = (0, _getflatfieldsforflatobjectmetadatautil.getFlatFieldsFromFlatObjectMetadata)(flatObjectMetadata, flatFieldMetadataMaps);
    const targetJoinColumnsByMorphFieldName = new Map();
    for (const field of objectFields){
        if (!(0, _isflatfieldmetadataoftypeutil.isFlatFieldMetadataOfType)(field, _types.FieldMetadataType.MORPH_RELATION) || field.settings.relationType !== _types.RelationType.MANY_TO_ONE) {
            continue;
        }
        const targetObjectMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: field.relationTargetObjectMetadataId,
            flatEntityMaps: flatObjectMetadataMaps
        });
        if (!(0, _utils.isDefined)(targetObjectMetadata)) {
            continue;
        }
        const morphFieldName = (0, _getmorphnamefrommorphfieldmetadatanameutil.getMorphNameFromMorphFieldMetadataName)({
            morphRelationFlatFieldMetadata: field,
            nameSingular: targetObjectMetadata.nameSingular,
            namePlural: targetObjectMetadata.namePlural
        });
        const joinColumnName = (0, _computemorphorrelationfieldjoincolumnnameutil.computeMorphOrRelationFieldJoinColumnName)({
            name: field.name
        });
        const existing = targetJoinColumnsByMorphFieldName.get(morphFieldName) ?? [];
        targetJoinColumnsByMorphFieldName.set(morphFieldName, [
            ...existing,
            {
                joinColumnName,
                targetObjectMetadataId: field.relationTargetObjectMetadataId
            }
        ]);
    }
    const formattedRecord = {};
    const joinColumnNamesByMorphFieldName = {};
    for (const [key, value] of Object.entries(record)){
        const targetJoinColumns = targetJoinColumnsByMorphFieldName.get(key);
        if (!(0, _utils.isDefined)(targetJoinColumns)) {
            formattedRecord[key] = value;
            continue;
        }
        const registerJoinColumns = ()=>{
            joinColumnNamesByMorphFieldName[key] = targetJoinColumns.map((targetJoinColumn)=>targetJoinColumn.joinColumnName);
            for (const { joinColumnName } of targetJoinColumns){
                formattedRecord[joinColumnName] = null;
            }
        };
        if (value === null) {
            registerJoinColumns();
            continue;
        }
        const morphValue = extractMorphValue(value);
        const matchingTargetJoinColumn = (0, _utils.isDefined)(morphValue) ? targetJoinColumns.find((targetJoinColumn)=>targetJoinColumn.targetObjectMetadataId === morphValue.targetObjectMetadataId) : undefined;
        if (!(0, _utils.isDefined)(morphValue) || !(0, _utils.isDefined)(matchingTargetJoinColumn)) {
            continue;
        }
        registerJoinColumns();
        formattedRecord[matchingTargetJoinColumn.joinColumnName] = morphValue.id;
    }
    return {
        formattedRecord,
        joinColumnNamesByMorphFieldName
    };
};
const formatWorkflowRecordSimpleRelationFields = (record, objectMetadataInfo)=>{
    const { flatObjectMetadata, flatFieldMetadataMaps } = objectMetadataInfo;
    const objectFields = (0, _getflatfieldsforflatobjectmetadatautil.getFlatFieldsFromFlatObjectMetadata)(flatObjectMetadata, flatFieldMetadataMaps);
    const manyToOneRelationFieldNames = new Set();
    for (const field of objectFields){
        if (((0, _isflatfieldmetadataoftypeutil.isFlatFieldMetadataOfType)(field, _types.FieldMetadataType.RELATION) || (0, _isflatfieldmetadataoftypeutil.isFlatFieldMetadataOfType)(field, _types.FieldMetadataType.MORPH_RELATION)) && field.settings.relationType === _types.RelationType.MANY_TO_ONE) {
            manyToOneRelationFieldNames.add(field.name);
        }
    }
    const formattedRecord = {};
    for (const [key, value] of Object.entries(record)){
        if (!manyToOneRelationFieldNames.has(key)) {
            formattedRecord[key] = value;
            continue;
        }
        const joinColumnValue = (0, _isnullrelationvalueutil.isNullRelationValue)(value) ? null : extractLegacyRelationId(value);
        if ((0, _guards.isUndefined)(joinColumnValue)) {
            formattedRecord[key] = value;
            continue;
        }
        const joinColumnName = (0, _computemorphorrelationfieldjoincolumnnameutil.computeMorphOrRelationFieldJoinColumnName)({
            name: key
        });
        if (!(0, _utils.isDefined)(record[joinColumnName])) {
            formattedRecord[joinColumnName] = joinColumnValue;
        }
    }
    return formattedRecord;
};
const formatWorkflowRecordRelationFields = (record, objectMetadataInfo)=>{
    const { formattedRecord: recordWithMorphRelations, joinColumnNamesByMorphFieldName } = formatWorkflowRecordMorphRelationFields(record, objectMetadataInfo);
    const formattedRecord = formatWorkflowRecordSimpleRelationFields(recordWithMorphRelations, objectMetadataInfo);
    return {
        formattedRecord,
        joinColumnNamesByMorphFieldName
    };
};

//# sourceMappingURL=format-workflow-record-relation-fields.util.js.map
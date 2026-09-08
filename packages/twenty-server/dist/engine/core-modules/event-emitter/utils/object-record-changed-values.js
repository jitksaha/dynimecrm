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
    get computeUpdatedFieldsFromDiff () {
        return computeUpdatedFieldsFromDiff;
    },
    get objectRecordChangedValues () {
        return objectRecordChangedValues;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _getflatfieldsforflatobjectmetadatautil = require("../../../api/graphql/workspace-schema-builder/utils/get-flat-fields-for-flat-object-metadata.util");
const _computemorphorrelationfieldjoincolumnnameutil = require("../../../metadata-modules/field-metadata/utils/compute-morph-or-relation-field-join-column-name.util");
const _getjoincolumnnameforrelationfieldutil = require("../../../metadata-modules/field-metadata/utils/get-join-column-name-for-relation-field.util");
const _findflatentitybyidinflatentitymapsutil = require("../../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _buildfieldmapsfromflatobjectmetadatautil = require("../../../metadata-modules/flat-field-metadata/utils/build-field-maps-from-flat-object-metadata.util");
const _ismorphorrelationflatfieldmetadatautil = require("../../../metadata-modules/flat-field-metadata/utils/is-morph-or-relation-flat-field-metadata.util");
const buildRelationFieldChangeValue = (relationId)=>({
        id: (0, _utils.isDefined)(relationId) ? relationId : null
    });
const isManyToOneMorphOrRelationField = (field)=>{
    return (0, _ismorphorrelationflatfieldmetadatautil.isMorphOrRelationFlatFieldMetadata)(field) && field.settings?.relationType === _types.RelationType.MANY_TO_ONE;
};
const computeUpdatedFieldsFromDiff = (diff, objectMetadataItem, flatFieldMetadataMaps)=>{
    const { fieldIdByName } = (0, _buildfieldmapsfromflatobjectmetadatautil.buildFieldMapsFromFlatObjectMetadata)(flatFieldMetadataMaps, objectMetadataItem);
    return Object.keys(diff).flatMap((diffKey)=>{
        const fieldId = fieldIdByName[diffKey];
        if (!(0, _utils.isDefined)(fieldId)) {
            return [
                diffKey
            ];
        }
        const field = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: fieldId,
            flatEntityMaps: flatFieldMetadataMaps
        });
        if ((0, _utils.isDefined)(field) && isManyToOneMorphOrRelationField(field)) {
            return [
                diffKey,
                (0, _computemorphorrelationfieldjoincolumnnameutil.computeMorphOrRelationFieldJoinColumnName)({
                    name: field.name
                })
            ];
        }
        return [
            diffKey
        ];
    });
};
const objectRecordChangedValues = (oldRecord, newRecord, objectMetadataItem, flatFieldMetadataMaps)=>{
    const { fieldIdByName, fieldIdByJoinColumnName } = (0, _buildfieldmapsfromflatobjectmetadatautil.buildFieldMapsFromFlatObjectMetadata)(flatFieldMetadataMaps, objectMetadataItem);
    const findFieldForKey = (key)=>{
        const fieldId = fieldIdByName[key] ?? fieldIdByJoinColumnName[key];
        if (!(0, _utils.isDefined)(fieldId)) {
            return undefined;
        }
        return (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: fieldId,
            flatEntityMaps: flatFieldMetadataMaps
        });
    };
    const accumulator = Object.keys(newRecord).reduce((diffAccumulator, key)=>{
        const field = findFieldForKey(key);
        const oldRecordValue = oldRecord[key];
        const newRecordValue = newRecord[key];
        if (key === 'updatedAt' || key === 'searchVector' || (0, _utils.isDefined)(field) && isManyToOneMorphOrRelationField(field) || field?.type === _types.FieldMetadataType.RELATION || field?.type === _types.FieldMetadataType.MORPH_RELATION) {
            return diffAccumulator;
        }
        if ((0, _utils.fastDeepEqual)(oldRecordValue, newRecordValue)) {
            return diffAccumulator;
        }
        diffAccumulator[key] = {
            before: oldRecordValue,
            after: newRecordValue
        };
        return diffAccumulator;
    }, // oxlint-disable-next-line typescript/no-explicit-any
    {});
    const objectFields = (0, _getflatfieldsforflatobjectmetadatautil.getFlatFieldsFromFlatObjectMetadata)(objectMetadataItem, flatFieldMetadataMaps);
    for (const field of objectFields){
        if (!isManyToOneMorphOrRelationField(field) || (0, _utils.isDefined)(accumulator[field.name])) {
            continue;
        }
        const joinColumnName = (0, _getjoincolumnnameforrelationfieldutil.getJoinColumnNameForRelationField)(field);
        const oldJoinColumnValue = oldRecord[joinColumnName];
        const newJoinColumnValue = newRecord[joinColumnName];
        if ((0, _utils.fastDeepEqual)(oldJoinColumnValue, newJoinColumnValue)) {
            continue;
        }
        accumulator[field.name] = {
            before: buildRelationFieldChangeValue(oldJoinColumnValue),
            after: buildRelationFieldChangeValue(newJoinColumnValue)
        };
    }
    return accumulator;
};

//# sourceMappingURL=object-record-changed-values.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildFieldMapsFromFlatObjectMetadata", {
    enumerable: true,
    get: function() {
        return buildFieldMapsFromFlatObjectMetadata;
    }
});
const _types = require("twenty-shared/types");
const _computemorphorrelationfieldjoincolumnnameutil = require("../../field-metadata/utils/compute-morph-or-relation-field-join-column-name.util");
const _getflatfieldsforflatobjectmetadatautil = require("../../../api/graphql/workspace-schema-builder/utils/get-flat-fields-for-flat-object-metadata.util");
const _isflatfieldmetadataoftypeutil = require("./is-flat-field-metadata-of-type.util");
// Flat metadata snapshots are immutable and cached per workspace metadata
// version, so the maps derived from a given (fieldMaps, objectMetadata) pair can
// be memoized by identity: several helpers rebuild them per request otherwise
// (order parsing, cursor encoding per record, cursor conditions per key).
const fieldMapsCache = new WeakMap();
const buildFieldMapsFromFlatObjectMetadata = (flatFieldMetadataMaps, flatObjectMetadata)=>{
    const cachedByObjectMetadata = fieldMapsCache.get(flatFieldMetadataMaps);
    const cachedFieldMaps = cachedByObjectMetadata?.get(flatObjectMetadata);
    if (cachedFieldMaps) {
        return cachedFieldMaps;
    }
    const fieldIdByName = {};
    const fieldIdByJoinColumnName = {};
    const objectFields = (0, _getflatfieldsforflatobjectmetadatautil.getFlatFieldsFromFlatObjectMetadata)(flatObjectMetadata, flatFieldMetadataMaps);
    for (const field of objectFields){
        fieldIdByName[field.name] = field.id;
        if (((0, _isflatfieldmetadataoftypeutil.isFlatFieldMetadataOfType)(field, _types.FieldMetadataType.RELATION) || (0, _isflatfieldmetadataoftypeutil.isFlatFieldMetadataOfType)(field, _types.FieldMetadataType.MORPH_RELATION)) && field.settings.relationType === _types.RelationType.MANY_TO_ONE) {
            const joinColumnName = (0, _computemorphorrelationfieldjoincolumnnameutil.computeMorphOrRelationFieldJoinColumnName)({
                name: field.name
            });
            fieldIdByJoinColumnName[joinColumnName] = field.id;
        }
    }
    const fieldMaps = {
        fieldIdByName,
        fieldIdByJoinColumnName
    };
    const cacheForFieldMaps = cachedByObjectMetadata ?? new WeakMap();
    cacheForFieldMaps.set(flatObjectMetadata, fieldMaps);
    fieldMapsCache.set(flatFieldMetadataMaps, cacheForFieldMaps);
    return fieldMaps;
};

//# sourceMappingURL=build-field-maps-from-flat-object-metadata.util.js.map
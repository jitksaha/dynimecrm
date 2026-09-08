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
    get formatResult () {
        return formatResult;
    },
    get getCompositeFieldMetadataMap () {
        return getCompositeFieldMetadataMap;
    }
});
const _sharedutils = require("@nestjs/common/utils/shared.utils");
const _guards = require("@sniptt/guards");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _nullequivalentvaluesconstant = require("../../api/common/common-args-processors/data-arg-processor/constants/null-equivalent-values.constant");
const _getflatfieldsforflatobjectmetadatautil = require("../../api/graphql/workspace-schema-builder/utils/get-flat-fields-for-flat-object-metadata.util");
const _computecolumnnameutil = require("../../metadata-modules/field-metadata/utils/compute-column-name.util");
const _iscompositefieldmetadatatypeutil = require("../../metadata-modules/field-metadata/utils/is-composite-field-metadata-type.util");
const _findflatentitybyidinflatentitymapsutil = require("../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _buildfieldmapsfromflatobjectmetadatautil = require("../../metadata-modules/flat-field-metadata/utils/build-field-maps-from-flat-object-metadata.util");
const _formatcompositefieldvalueutil = require("./format-composite-field-value.util");
const _getcompositefieldmetadatacollection = require("./get-composite-field-metadata-collection");
const _isfieldmetadataoftypeutil = require("../../utils/is-field-metadata-of-type.util");
function formatResult(// oxlint-disable-next-line typescript/no-explicit-any
data, flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps, fieldMapsForObject) {
    return formatResultRecursively(data, flatObjectMetadata, {
        flatObjectMetadataMaps,
        flatFieldMetadataMaps,
        objectCacheByObjectMetadataId: new Map()
    }, fieldMapsForObject);
}
function formatResultRecursively(// oxlint-disable-next-line typescript/no-explicit-any
data, flatObjectMetadata, cache, fieldMapsForObject) {
    if (!(0, _utils.isDefined)(data)) {
        return data;
    }
    if (!(0, _sharedutils.isPlainObject)(data)) {
        if (Array.isArray(data)) {
            return data.map((item)=>formatResultRecursively(item, flatObjectMetadata, cache, fieldMapsForObject));
        }
        return data;
    }
    if (!flatObjectMetadata) {
        throw new Error('Object metadata is missing');
    }
    const objectCache = getOrCreateFormatResultObjectCache({
        cache,
        flatObjectMetadata,
        fieldMapsForObject
    });
    const { fieldIdByName, fieldIdByJoinColumnName } = objectCache.fieldMaps;
    const newData = {};
    for (const [key, value] of Object.entries(data)){
        const compositePropertyArgs = objectCache.compositeFieldMetadataMap.get(key);
        const fieldMetadataId = fieldIdByName[key] || fieldIdByJoinColumnName[key] || fieldIdByName[compositePropertyArgs?.parentField ?? ''];
        const fieldMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: fieldMetadataId,
            flatEntityMaps: cache.flatFieldMetadataMaps
        });
        if (!(0, _utils.isDefined)(fieldMetadata)) {
            continue;
        }
        const isRelation = fieldMetadata ? (0, _isfieldmetadataoftypeutil.isFieldMetadataEntityOfType)(fieldMetadata, _types.FieldMetadataType.RELATION) : false;
        if (isRelation) {
            if (!(0, _utils.isDefined)(fieldMetadata?.relationTargetObjectMetadataId)) {
                throw new Error(`Relation target object metadata ID is missing for field "${key}"`);
            }
            const targetObjectMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
                flatEntityId: fieldMetadata.relationTargetObjectMetadataId,
                flatEntityMaps: cache.flatObjectMetadataMaps
            });
            if (!targetObjectMetadata) {
                throw new Error(`Object metadata for object metadataId "${fieldMetadata.relationTargetObjectMetadataId}" is missing`);
            }
            // @ts-expect-error legacy noImplicitAny
            newData[key] = formatResultRecursively(value, targetObjectMetadata, cache);
            continue;
        }
        if ((0, _utils.isDefined)(compositePropertyArgs)) {
            const { parentField, ...compositeProperty } = compositePropertyArgs;
            // @ts-expect-error legacy noImplicitAny
            if (!newData[parentField]) {
                // @ts-expect-error legacy noImplicitAny
                newData[parentField] = {};
            }
            // @ts-expect-error legacy noImplicitAny
            newData[parentField][compositeProperty.name] = (0, _guards.isNull)(value) ? transformCompositeFieldNullValue(value, compositeProperty.name, fieldMetadata) : (0, _formatcompositefieldvalueutil.formatCompositeFieldValue)(value, compositeProperty.name, fieldMetadata);
            continue;
        }
        const formattedFieldValue = formatFieldMetadataValue(value, fieldMetadata.type);
        // @ts-expect-error legacy noImplicitAny
        newData[key] = formattedFieldValue;
    }
    handleEmptyCompositeFields(newData, objectCache.compositeFieldMetadataWithRequiredProperties);
    for (const dateTimeField of objectCache.dateTimeFieldMetadataItems){
        // @ts-expect-error legacy noImplicitAny
        const rawUpdatedDateTime = newData[dateTimeField.name];
        if (!(0, _utils.isDefined)(rawUpdatedDateTime)) {
            continue;
        }
        if (typeof rawUpdatedDateTime === 'string' || rawUpdatedDateTime instanceof Date || (0, _sharedutils.isPlainObject)(rawUpdatedDateTime)) {
            // @ts-expect-error legacy noImplicitAny
            newData[dateTimeField.name] = rawUpdatedDateTime;
        } else {
            const stringifiedUnknownValue = (0, _utils.stringifySafely)(rawUpdatedDateTime);
            throw new Error(`Invalid DATE_TIME field "${dateTimeField.name}", value: "${stringifiedUnknownValue}", it should be a string, Date instance or plain object, (current type : ${typeof rawUpdatedDateTime}).`);
        }
    }
    return newData;
}
function getOrCreateFormatResultObjectCache({ cache, flatObjectMetadata, fieldMapsForObject }) {
    const cachedObjectCache = cache.objectCacheByObjectMetadataId.get(flatObjectMetadata.id);
    if ((0, _utils.isDefined)(cachedObjectCache)) {
        return cachedObjectCache;
    }
    const flatFieldMetadataItems = (0, _getflatfieldsforflatobjectmetadatautil.getFlatFieldsFromFlatObjectMetadata)(flatObjectMetadata, cache.flatFieldMetadataMaps);
    const compositeFieldMetadataCollection = flatFieldMetadataItems.filter((fieldMetadata)=>(0, _iscompositefieldmetadatatypeutil.isCompositeFieldMetadataType)(fieldMetadata.type));
    const objectCache = {
        fieldMaps: fieldMapsForObject ?? (0, _buildfieldmapsfromflatobjectmetadatautil.buildFieldMapsFromFlatObjectMetadata)(cache.flatFieldMetadataMaps, flatObjectMetadata),
        compositeFieldMetadataMap: getCompositeFieldMetadataMapFromCollection(compositeFieldMetadataCollection),
        compositeFieldMetadataWithRequiredProperties: compositeFieldMetadataCollection.map((fieldMetadata)=>{
            const compositeType = _types.compositeTypeDefinitions.get(fieldMetadata.type);
            return {
                fieldMetadata,
                requiredPropertyNames: compositeType?.properties.filter((property)=>property.isRequired).map((property)=>property.name) ?? []
            };
        }),
        dateTimeFieldMetadataItems: flatFieldMetadataItems.filter((fieldMetadata)=>fieldMetadata.type === _types.FieldMetadataType.DATE_TIME)
    };
    cache.objectCacheByObjectMetadataId.set(flatObjectMetadata.id, objectCache);
    return objectCache;
}
function getCompositeFieldMetadataMap(flatObjectMetadata, flatFieldMetadataMaps) {
    const compositeFieldMetadataCollection = (0, _getcompositefieldmetadatacollection.getCompositeFieldMetadataCollection)(flatObjectMetadata, flatFieldMetadataMaps);
    return getCompositeFieldMetadataMapFromCollection(compositeFieldMetadataCollection);
}
function getCompositeFieldMetadataMapFromCollection(compositeFieldMetadataCollection) {
    return new Map(compositeFieldMetadataCollection.flatMap((fieldMetadata)=>{
        const compositeType = _types.compositeTypeDefinitions.get(fieldMetadata.type);
        if (!compositeType) return [];
        return compositeType.properties.map((compositeProperty)=>[
                (0, _computecolumnnameutil.computeCompositeColumnName)(fieldMetadata.name, compositeProperty),
                {
                    parentField: fieldMetadata.name,
                    ...compositeProperty
                }
            ]);
    }));
}
function formatFieldMetadataValue(// oxlint-disable-next-line typescript/no-explicit-any
value, fieldMetadataType) {
    if (typeof value === 'string' && (fieldMetadataType === _types.FieldMetadataType.MULTI_SELECT || fieldMetadataType === _types.FieldMetadataType.ARRAY)) {
        const cleanedValue = value.replace(/{|}/g, '').trim();
        return cleanedValue ? cleanedValue.split(',') : [];
    }
    if ((0, _guards.isNull)(value)) {
        if (fieldMetadataType === _types.FieldMetadataType.MULTI_SELECT || fieldMetadataType === _types.FieldMetadataType.ARRAY) {
            return _nullequivalentvaluesconstant.DEFAULT_ARRAY_FIELD_NULL_EQUIVALENT_VALUE;
        }
        if (fieldMetadataType === _types.FieldMetadataType.TEXT) {
            return _nullequivalentvaluesconstant.DEFAULT_TEXT_FIELD_NULL_EQUIVALENT_VALUE;
        }
        return value;
    }
    return value;
}
function transformCompositeFieldNullValue(value, compositePropertyName, fieldMetadata) {
    if (!(0, _guards.isNull)(value)) return value;
    return _nullequivalentvaluesconstant.DEFAULT_COMPOSITE_FIELDS_NULL_EQUIVALENT_VALUE[fieldMetadata.type]?.[compositePropertyName] ?? value;
}
/**
 * Handles composite fields with missing required subfields.
 * - For nullable fields: sets to null if all required subfields are null
 * - For non-nullable fields: provides a default value to prevent GraphQL errors
 *
 * This handles existing records that were created before the field was added
 * or records with incomplete data.
 */ function handleEmptyCompositeFields(// oxlint-disable-next-line typescript/no-explicit-any
data, compositeFieldMetadataWithRequiredProperties) {
    for (const { fieldMetadata, requiredPropertyNames } of compositeFieldMetadataWithRequiredProperties){
        const fieldValue = data[fieldMetadata.name];
        if (!(0, _utils.isDefined)(fieldValue) || !(0, _sharedutils.isPlainObject)(fieldValue)) {
            continue;
        }
        // oxlint-disable-next-line typescript/no-explicit-any
        const typedFieldValue = fieldValue;
        const allRequiredPropertiesAreNull = requiredPropertyNames.every((propertyName)=>!(0, _utils.isDefined)(typedFieldValue[propertyName]) || (0, _guards.isNull)(typedFieldValue[propertyName]));
        if (allRequiredPropertiesAreNull && requiredPropertyNames.length > 0) {
            if (fieldMetadata.isNullable) {
                data[fieldMetadata.name] = null;
            } else {
                data[fieldMetadata.name] = getDefaultCompositeFieldValue(fieldMetadata.type);
            }
        }
    }
}
function getDefaultCompositeFieldValue(fieldType) {
    switch(fieldType){
        case _types.FieldMetadataType.ACTOR:
            return {
                source: _types.FieldActorSource.MANUAL,
                name: '',
                workspaceMemberId: null,
                context: {}
            };
        default:
            // For other composite types, return null and let GraphQL handle the error
            // This should be extended as needed for other non-nullable composite fields
            return null;
    }
}

//# sourceMappingURL=format-result.util.js.map
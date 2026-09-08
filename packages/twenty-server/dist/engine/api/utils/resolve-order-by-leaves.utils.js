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
    get buildOrderByFromLeaves () {
        return buildOrderByFromLeaves;
    },
    get checkIfLeafCanCarryCursorValue () {
        return checkIfLeafCanCarryCursorValue;
    },
    get getCursorValueForLeaf () {
        return getCursorValueForLeaf;
    },
    get resolveOrderByLeaves () {
        return resolveOrderByLeaves;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _standarderrormessageconstant = require("../common/common-query-runners/errors/standard-error-message.constant");
const _graphqlqueryrunnerexception = require("../graphql/graphql-query-runner/errors/graphql-query-runner.exception");
const _assertfieldisreadableorthrowutil = require("../graphql/graphql-query-runner/graphql-query-parsers/utils/assert-field-is-readable-or-throw.util");
const _isorderbydirectionutil = require("../graphql/graphql-query-runner/graphql-query-parsers/graphql-query-order/utils/is-order-by-direction.util");
const _resolvefilterkeyfieldmetadatautil = require("../graphql/graphql-query-runner/graphql-query-parsers/utils/resolve-filter-key-field-metadata.util");
const _iscompositefieldmetadatatypeutil = require("../../metadata-modules/field-metadata/utils/is-composite-field-metadata-type.util");
const _findflatentitybyidinflatentitymapsutil = require("../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _buildfieldmapsfromflatobjectmetadatautil = require("../../metadata-modules/flat-field-metadata/utils/build-field-maps-from-flat-object-metadata.util");
const _ismorphorrelationflatfieldmetadatautil = require("../../metadata-modules/flat-field-metadata/utils/is-morph-or-relation-flat-field-metadata.util");
const checkIfLeafCanCarryCursorValue = (leaf)=>{
    switch(leaf.kind){
        case 'relation':
            return leaf.targetCompositeProperty?.type !== _types.FieldMetadataType.RAW_JSON;
        case 'composite':
            return leaf.compositeProperty.type !== _types.FieldMetadataType.RAW_JSON;
        case 'scalar':
            return true;
    }
};
const throwInvalidOrderByInput = (message)=>{
    throw new _graphqlqueryrunnerexception.GraphqlQueryRunnerException(message, _graphqlqueryrunnerexception.GraphqlQueryRunnerExceptionCode.INVALID_QUERY_INPUT, {
        userFriendlyMessage: _standarderrormessageconstant.STANDARD_ERROR_MESSAGE
    });
};
// Flattens the nested value of a relation orderBy entry into its leaf paths,
// e.g. { name: 'AscNullsLast' } -> [['name']] and, for a composite target
// field, { name: { firstName: 'AscNullsLast' } } -> [['name', 'firstName']].
const flattenNestedOrderByValue = (value)=>Object.entries(value).flatMap(([key, nestedValue])=>{
        if ((0, _utils.isPlainObject)(nestedValue)) {
            return flattenNestedOrderByValue(nestedValue).map(({ path, direction })=>({
                    path: [
                        key,
                        ...path
                    ],
                    direction
                }));
        }
        return (0, _isorderbydirectionutil.isOrderByDirection)(nestedValue) ? [
            {
                path: [
                    key
                ],
                direction: nestedValue
            }
        ] : [];
    });
// Resolves one flattened relation orderBy path (e.g. ['company', 'name'] or
// ['pointOfContact', 'name', 'firstName']) against the relation's target
// object. Without the object metadata maps the leaf stays unresolved, which is
// enough for consumers that ignore relation leaves (e.g. column selection).
const resolveRelationLeaf = ({ fieldMetadata, path, direction, flatObjectMetadataMaps, flatFieldMetadataMaps, strictValidation, objectsPermissions })=>{
    const targetObjectMetadata = (0, _utils.isDefined)(flatObjectMetadataMaps) && (0, _utils.isDefined)(fieldMetadata.relationTargetObjectMetadataId) ? (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
        flatEntityId: fieldMetadata.relationTargetObjectMetadataId,
        flatEntityMaps: flatObjectMetadataMaps
    }) : undefined;
    if (!(0, _utils.isDefined)(targetObjectMetadata)) {
        return {
            kind: 'relation',
            path,
            direction,
            fieldMetadata
        };
    }
    const [, targetFieldName, targetPropertyName, ...extraPath] = path;
    const targetFieldMetadataId = (0, _buildfieldmapsfromflatobjectmetadatautil.buildFieldMapsFromFlatObjectMetadata)(flatFieldMetadataMaps, targetObjectMetadata).fieldIdByName[targetFieldName];
    const targetFieldMetadata = (0, _utils.isDefined)(targetFieldMetadataId) ? (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
        flatEntityId: targetFieldMetadataId,
        flatEntityMaps: flatFieldMetadataMaps
    }) : undefined;
    if (!(0, _utils.isDefined)(targetFieldMetadata)) {
        if (strictValidation) {
            throw new _graphqlqueryrunnerexception.GraphqlQueryRunnerException(`Nested field "${targetFieldName}" not found in target object "${targetObjectMetadata.nameSingular}"`, _graphqlqueryrunnerexception.GraphqlQueryRunnerExceptionCode.FIELD_NOT_FOUND, {
                userFriendlyMessage: _standarderrormessageconstant.STANDARD_ERROR_MESSAGE
            });
        }
        return null;
    }
    (0, _assertfieldisreadableorthrowutil.assertFieldIsReadableOrThrow)({
        objectsPermissions,
        objectMetadataId: targetObjectMetadata.id,
        fieldMetadataId: targetFieldMetadata.id
    });
    if ((0, _iscompositefieldmetadatatypeutil.isCompositeFieldMetadataType)(targetFieldMetadata.type)) {
        const targetCompositeProperty = _types.compositeTypeDefinitions.get(targetFieldMetadata.type)?.properties.find((property)=>property.name === targetPropertyName);
        if (!(0, _utils.isDefined)(targetCompositeProperty) || extraPath.length > 0) {
            if (strictValidation) {
                throwInvalidOrderByInput(`Composite field "${path[0]}.${targetFieldName}" requires one of its sub fields to be ordered`);
            }
            return null;
        }
        return {
            kind: 'relation',
            path,
            direction,
            fieldMetadata,
            targetFieldMetadata,
            targetCompositeProperty
        };
    }
    if ((0, _utils.isDefined)(targetPropertyName)) {
        if (strictValidation) {
            throwInvalidOrderByInput(`Field "${path[0]}.${targetFieldName}" does not support nested ordering`);
        }
        return null;
    }
    return {
        kind: 'relation',
        path,
        direction,
        fieldMetadata,
        targetFieldMetadata
    };
};
const resolveOrderByLeaves = ({ orderBy, flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps, strictValidation = false, objectsPermissions })=>{
    if (!(0, _utils.isDefined)(orderBy) || !(0, _utils.isNonEmptyArray)(orderBy)) {
        return [];
    }
    const { fieldIdByName, fieldIdByJoinColumnName } = (0, _buildfieldmapsfromflatobjectmetadatautil.buildFieldMapsFromFlatObjectMetadata)(flatFieldMetadataMaps, flatObjectMetadata);
    const leaves = [];
    const seenPaths = new Set();
    const pushLeaf = (leaf)=>{
        const pathKey = leaf.path.join('.');
        if (seenPaths.has(pathKey)) {
            return;
        }
        seenPaths.add(pathKey);
        leaves.push(leaf);
    };
    for (const orderByEntry of orderBy){
        for (const [fieldName, orderByValue] of Object.entries(orderByEntry)){
            const { fieldMetadata, isReferencedByFieldName } = (0, _resolvefilterkeyfieldmetadatautil.resolveFilterKeyFieldMetadata)({
                filterKey: fieldName,
                fieldIdByName,
                fieldIdByJoinColumnName,
                flatFieldMetadataMaps
            });
            if (!(0, _utils.isDefined)(fieldMetadata)) {
                if (strictValidation) {
                    throw new _graphqlqueryrunnerexception.GraphqlQueryRunnerException(`Field "${fieldName}" does not exist or is not sortable`, _graphqlqueryrunnerexception.GraphqlQueryRunnerExceptionCode.FIELD_NOT_FOUND, {
                        userFriendlyMessage: _standarderrormessageconstant.STANDARD_ERROR_MESSAGE
                    });
                }
                continue;
            }
            (0, _assertfieldisreadableorthrowutil.assertFieldIsReadableOrThrow)({
                objectsPermissions,
                objectMetadataId: flatObjectMetadata.id,
                fieldMetadataId: fieldMetadata.id
            });
            if (isReferencedByFieldName && (0, _ismorphorrelationflatfieldmetadatautil.isMorphOrRelationFlatFieldMetadata)(fieldMetadata)) {
                if (!(0, _utils.isPlainObject)(orderByValue)) {
                    if (strictValidation) {
                        throwInvalidOrderByInput(`Relation field "${fieldName}" requires nested field ordering (e.g., { ${fieldName}: { fieldName: 'AscNullsFirst' } })`);
                    }
                    continue;
                }
                const flattenedRelationPaths = flattenNestedOrderByValue(orderByValue);
                // An entry whose nested values are no directions at all would
                // otherwise order by nothing without telling the caller
                if (flattenedRelationPaths.length === 0 && strictValidation) {
                    throwInvalidOrderByInput(`Relation field "${fieldName}" requires nested field ordering (e.g., { ${fieldName}: { fieldName: 'AscNullsFirst' } })`);
                }
                for (const { path, direction } of flattenedRelationPaths){
                    const relationLeaf = resolveRelationLeaf({
                        fieldMetadata,
                        path: [
                            fieldName,
                            ...path
                        ],
                        direction,
                        flatObjectMetadataMaps,
                        flatFieldMetadataMaps,
                        strictValidation,
                        objectsPermissions
                    });
                    if ((0, _utils.isDefined)(relationLeaf)) {
                        pushLeaf(relationLeaf);
                    }
                }
                continue;
            }
            if (isReferencedByFieldName && (0, _iscompositefieldmetadatatypeutil.isCompositeFieldMetadataType)(fieldMetadata.type)) {
                if (!(0, _utils.isPlainObject)(orderByValue)) {
                    if (strictValidation) {
                        throwInvalidOrderByInput(`Composite field "${fieldName}" requires subfield ordering (e.g., { ${fieldName}: { subFieldName: 'AscNullsFirst' } })`);
                    }
                    continue;
                }
                const compositeType = _types.compositeTypeDefinitions.get(fieldMetadata.type);
                for (const [propertyName, direction] of Object.entries(orderByValue)){
                    const compositeProperty = compositeType?.properties.find((property)=>property.name === propertyName);
                    if (!(0, _utils.isDefined)(compositeProperty)) {
                        if (strictValidation) {
                            throwInvalidOrderByInput(`Sub field "${propertyName}" not found for composite field "${fieldName}"`);
                        }
                        continue;
                    }
                    if (!(0, _isorderbydirectionutil.isOrderByDirection)(direction)) {
                        if (strictValidation) {
                            throwInvalidOrderByInput(`Composite sub field "${fieldName}.${propertyName}" requires a direction value (AscNullsFirst, AscNullsLast, DescNullsFirst, DescNullsLast)`);
                        }
                        continue;
                    }
                    pushLeaf({
                        kind: 'composite',
                        path: [
                            fieldName,
                            propertyName
                        ],
                        direction,
                        fieldMetadata,
                        compositeProperty
                    });
                }
                continue;
            }
            if (!(0, _isorderbydirectionutil.isOrderByDirection)(orderByValue)) {
                if (strictValidation) {
                    throwInvalidOrderByInput(`Scalar field "${fieldName}" requires a direction value (AscNullsFirst, AscNullsLast, DescNullsFirst, DescNullsLast)`);
                }
                continue;
            }
            pushLeaf({
                kind: 'scalar',
                path: [
                    fieldName
                ],
                direction: orderByValue,
                fieldMetadata
            });
        }
    }
    return leaves;
};
const buildOrderByFromLeaves = (leaves)=>leaves.map(({ path, direction })=>path.reduceRight((nested, key)=>({
                [key]: nested
            }), direction));
const getCursorValueForLeaf = (cursor, leaf)=>{
    let value = cursor;
    for (const key of leaf.path){
        if (!(0, _utils.isPlainObject)(value)) {
            value = undefined;
            break;
        }
        value = value[key];
    }
    if (value === undefined && leaf.path.length > 1) {
        return cursor[leaf.path.join('.')];
    }
    return value;
};

//# sourceMappingURL=resolve-order-by-leaves.utils.js.map
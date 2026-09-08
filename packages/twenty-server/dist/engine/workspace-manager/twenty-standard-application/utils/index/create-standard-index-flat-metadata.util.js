"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createStandardIndexFlatMetadata", {
    enumerable: true,
    get: function() {
        return createStandardIndexFlatMetadata;
    }
});
const _application = require("twenty-shared/application");
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _uuid = require("uuid");
const _findflatentitybyuniversalidentifierorthrowutil = require("../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier-or-throw.util");
const _findmanyflatentitybyuniversalidentifierinuniversalflatentitymapsorthrowutil = require("../../../../metadata-modules/flat-entity/utils/find-many-flat-entity-by-universal-identifier-in-universal-flat-entity-maps-or-throw.util");
const _types = require("twenty-shared/types");
const _computeflatindexnameutil = require("../../../../metadata-modules/index-metadata/utils/compute-flat-index-name.util");
const _twentystandardapplications = require("../../constants/twenty-standard-applications");
const createStandardIndexFlatMetadata = ({ workspaceId, objectName, context: { indexName, relatedFieldNames, indexType = _types.IndexType.BTREE, indexWhereClause = null, isUnique = false, hasDeterministicUniversalIdentifier = false }, standardObjectMetadataRelatedEntityIds, dependencyFlatEntityMaps: { flatFieldMetadataMaps, flatObjectMetadataMaps }, twentyStandardApplicationId, now })=>{
    const objectIndexes = _metadata.STANDARD_OBJECTS[objectName].indexes;
    if (!(0, _utils.isDefined)(objectIndexes)) {
        throw new Error(`Invalid index configuration ${objectName} ${indexName.toString()}`);
    }
    // @ts-expect-error ignore
    const indexDefinition = objectIndexes[indexName];
    const objectFields = _metadata.STANDARD_OBJECTS[objectName].fields;
    const objectMetadataId = standardObjectMetadataRelatedEntityIds[objectName].id;
    const relatedFieldIds = relatedFieldNames.map((fieldName)=>standardObjectMetadataRelatedEntityIds[objectName].fields[fieldName].id);
    const objectMetadataUniversalIdentifier = _metadata.STANDARD_OBJECTS[objectName].universalIdentifier;
    const flatObjectMetadata = (0, _findflatentitybyuniversalidentifierorthrowutil.findFlatEntityByUniversalIdentifierOrThrow)({
        universalIdentifier: objectMetadataUniversalIdentifier,
        flatEntityMaps: flatObjectMetadataMaps
    });
    const relatedFieldUniversalIdentifiers = relatedFieldNames.map((fieldName)=>objectFields[fieldName].universalIdentifier);
    const flatFieldMetadatas = (0, _findmanyflatentitybyuniversalidentifierinuniversalflatentitymapsorthrowutil.findManyFlatEntityByUniversalIdentifierInUniversalFlatEntityMapsOrThrow)({
        universalIdentifiers: relatedFieldUniversalIdentifiers,
        flatEntityMaps: flatFieldMetadataMaps
    });
    const indexId = (0, _uuid.v4)();
    const computedIndexName = (0, _computeflatindexnameutil.computeFlatIndexNameOrThrow)({
        flatObjectMetadata,
        objectFlatFieldMetadatas: flatFieldMetadatas,
        indexFields: flatFieldMetadatas.map((flatFieldMetadata, index)=>({
                order: index,
                fieldMetadataUniversalIdentifier: flatFieldMetadata.universalIdentifier,
                subFieldName: null
            })),
        isUnique,
        indexWhereClause
    });
    const universalIdentifier = hasDeterministicUniversalIdentifier ? (0, _application.getIndexUniversalIdentifier)({
        applicationUniversalIdentifier: _twentystandardapplications.TWENTY_STANDARD_APPLICATION.universalIdentifier,
        objectUniversalIdentifier: flatObjectMetadata.universalIdentifier,
        name: computedIndexName
    }) : indexDefinition.universalIdentifier;
    const universalFlatIndex = {
        createdAt: now,
        applicationUniversalIdentifier: _twentystandardapplications.TWENTY_STANDARD_APPLICATION.universalIdentifier,
        indexType,
        indexWhereClause,
        isCustom: false,
        isUnique,
        isSystemSideEffect: true,
        name: computedIndexName,
        objectMetadataUniversalIdentifier: flatObjectMetadata.universalIdentifier,
        universalIdentifier,
        updatedAt: now,
        universalFlatIndexFieldMetadatas: flatFieldMetadatas.map(({ universalIdentifier: fieldMetadataUniversalIdentifier }, index)=>({
                createdAt: now,
                order: index,
                subFieldName: null,
                updatedAt: now,
                fieldMetadataUniversalIdentifier,
                indexMetadataUniversalIdentifier: universalIdentifier
            }))
    };
    return {
        ...universalFlatIndex,
        applicationId: twentyStandardApplicationId,
        id: (0, _uuid.v4)(),
        flatIndexFieldMetadatas: relatedFieldIds.map((fieldMetadataId, index)=>({
                createdAt: now,
                fieldMetadataId,
                id: (0, _uuid.v4)(),
                indexMetadataId: indexId,
                order: index,
                subFieldName: null,
                updatedAt: now,
                workspaceId
            })),
        workspaceId,
        objectMetadataId
    };
};

//# sourceMappingURL=create-standard-index-flat-metadata.util.js.map
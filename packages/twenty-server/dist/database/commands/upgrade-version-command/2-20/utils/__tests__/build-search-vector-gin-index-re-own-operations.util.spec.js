"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _application = require("twenty-shared/application");
const _types = require("twenty-shared/types");
const _buildsearchvectorginindexreownoperationsutil = require("../build-search-vector-gin-index-re-own-operations.util");
const _getflatfieldmetadatamock = require("../../../../../../engine/metadata-modules/flat-field-metadata/__mocks__/get-flat-field-metadata.mock");
const _getflatindexmetadatamock = require("../../../../../../engine/metadata-modules/flat-index-metadata/__mocks__/get-flat-index-metadata.mock");
const _getflatobjectmetadatamock = require("../../../../../../engine/metadata-modules/flat-object-metadata/__mocks__/get-flat-object-metadata.mock");
const _searchvectorfieldconstants = require("../../../../../../engine/metadata-modules/search-field-metadata/constants/search-vector-field.constants");
const STANDARD_APPLICATION_ID = 'standard-application-id';
// Application universal identifiers must be valid UUIDs: they are used as the v5
// namespace by the deterministic identifier helpers.
const STANDARD_APPLICATION_UID = '11111111-1111-4111-8111-111111111111';
const applicationUniversalIdentifierById = new Map([
    [
        STANDARD_APPLICATION_ID,
        STANDARD_APPLICATION_UID
    ]
]);
const buildFlatObjectMetadataMaps = (flatObjectMetadatas)=>({
        byUniversalIdentifier: Object.fromEntries(flatObjectMetadatas.map((flatObjectMetadata)=>[
                flatObjectMetadata.universalIdentifier,
                flatObjectMetadata
            ])),
        universalIdentifierById: Object.fromEntries(flatObjectMetadatas.map((flatObjectMetadata)=>[
                flatObjectMetadata.id,
                flatObjectMetadata.universalIdentifier
            ])),
        universalIdentifiersByApplicationId: {}
    });
const buildFlatFieldMetadataMaps = (flatFieldMetadatas)=>({
        byUniversalIdentifier: Object.fromEntries(flatFieldMetadatas.map((flatFieldMetadata)=>[
                flatFieldMetadata.universalIdentifier,
                flatFieldMetadata
            ])),
        universalIdentifierById: Object.fromEntries(flatFieldMetadatas.map((flatFieldMetadata)=>[
                flatFieldMetadata.id,
                flatFieldMetadata.universalIdentifier
            ])),
        universalIdentifiersByApplicationId: {}
    });
const buildFlatIndexMaps = (flatIndexMetadatas)=>({
        byUniversalIdentifier: Object.fromEntries(flatIndexMetadatas.map((flatIndexMetadata)=>[
                flatIndexMetadata.universalIdentifier,
                flatIndexMetadata
            ])),
        universalIdentifierById: Object.fromEntries(flatIndexMetadatas.map((flatIndexMetadata)=>[
                flatIndexMetadata.id,
                flatIndexMetadata.universalIdentifier
            ])),
        universalIdentifiersByApplicationId: {}
    });
const buildFlatIndexFieldMetadata = ({ fieldMetadataId })=>{
    const createdAt = '2024-01-01T00:00:00.000Z';
    return {
        id: `${fieldMetadataId}-index-field-id`,
        workspaceId: 'workspace-id',
        indexMetadataId: 'index-metadata-id',
        fieldMetadataId,
        order: 0,
        subFieldName: null,
        createdAt,
        updatedAt: createdAt
    };
};
const buildSearchableObjectFixture = ({ objectId, objectUniversalIdentifier })=>{
    const searchVectorFlatFieldMetadata = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
        id: `${objectId}-search-vector-field-id`,
        universalIdentifier: `${objectUniversalIdentifier}-search-vector-field-uid`,
        objectMetadataId: objectId,
        objectMetadataUniversalIdentifier: objectUniversalIdentifier,
        type: _types.FieldMetadataType.TS_VECTOR,
        name: _searchvectorfieldconstants.SEARCH_VECTOR_FIELD.name,
        applicationId: STANDARD_APPLICATION_ID,
        applicationUniversalIdentifier: STANDARD_APPLICATION_UID
    });
    const flatObjectMetadata = (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
        id: objectId,
        universalIdentifier: objectUniversalIdentifier,
        isSearchable: true,
        applicationId: STANDARD_APPLICATION_ID,
        applicationUniversalIdentifier: STANDARD_APPLICATION_UID,
        fieldUniversalIdentifiers: [
            searchVectorFlatFieldMetadata.universalIdentifier
        ]
    });
    return {
        flatObjectMetadata,
        searchVectorFlatFieldMetadata
    };
};
describe('buildSearchVectorGinIndexReOwnOperations', ()=>{
    it('re-owns an existing GIN searchVector index carrying a non-deterministic universal identifier (all applications)', ()=>{
        const { flatObjectMetadata, searchVectorFlatFieldMetadata } = buildSearchableObjectFixture({
            objectId: 'standard-object-id',
            objectUniversalIdentifier: 'standard-object-uid'
        });
        const indexName = 'IDX_SEARCH_VECTOR_STANDARD';
        const ginIndex = (0, _getflatindexmetadatamock.getFlatIndexMetadataMock)({
            id: 'standard-gin-index-id',
            universalIdentifier: 'legacy-v4-index-uid',
            objectMetadataId: flatObjectMetadata.id,
            objectMetadataUniversalIdentifier: flatObjectMetadata.universalIdentifier,
            applicationId: STANDARD_APPLICATION_ID,
            applicationUniversalIdentifier: STANDARD_APPLICATION_UID,
            name: indexName,
            indexType: _types.IndexType.GIN,
            flatIndexFieldMetadatas: [
                buildFlatIndexFieldMetadata({
                    fieldMetadataId: searchVectorFlatFieldMetadata.id
                })
            ]
        });
        const indexUniversalIdentifierUpdates = (0, _buildsearchvectorginindexreownoperationsutil.buildSearchVectorGinIndexReOwnOperations)({
            flatObjectMetadataMaps: buildFlatObjectMetadataMaps([
                flatObjectMetadata
            ]),
            flatFieldMetadataMaps: buildFlatFieldMetadataMaps([
                searchVectorFlatFieldMetadata
            ]),
            flatIndexMaps: buildFlatIndexMaps([
                ginIndex
            ]),
            applicationUniversalIdentifierById
        });
        expect(indexUniversalIdentifierUpdates).toEqual([
            {
                id: ginIndex.id,
                name: indexName,
                deterministicUniversalIdentifier: (0, _application.getIndexUniversalIdentifier)({
                    applicationUniversalIdentifier: STANDARD_APPLICATION_UID,
                    objectUniversalIdentifier: flatObjectMetadata.universalIdentifier,
                    name: indexName
                })
            }
        ]);
    });
    it('is a no-op for a GIN searchVector index already carrying its deterministic universal identifier', ()=>{
        const { flatObjectMetadata, searchVectorFlatFieldMetadata } = buildSearchableObjectFixture({
            objectId: 'standard-object-id',
            objectUniversalIdentifier: 'standard-object-uid'
        });
        const indexName = 'IDX_SEARCH_VECTOR_STANDARD';
        const ginIndex = (0, _getflatindexmetadatamock.getFlatIndexMetadataMock)({
            id: 'standard-gin-index-id',
            universalIdentifier: (0, _application.getIndexUniversalIdentifier)({
                applicationUniversalIdentifier: STANDARD_APPLICATION_UID,
                objectUniversalIdentifier: flatObjectMetadata.universalIdentifier,
                name: indexName
            }),
            objectMetadataId: flatObjectMetadata.id,
            objectMetadataUniversalIdentifier: flatObjectMetadata.universalIdentifier,
            applicationId: STANDARD_APPLICATION_ID,
            applicationUniversalIdentifier: STANDARD_APPLICATION_UID,
            name: indexName,
            indexType: _types.IndexType.GIN,
            flatIndexFieldMetadatas: [
                buildFlatIndexFieldMetadata({
                    fieldMetadataId: searchVectorFlatFieldMetadata.id
                })
            ]
        });
        const indexUniversalIdentifierUpdates = (0, _buildsearchvectorginindexreownoperationsutil.buildSearchVectorGinIndexReOwnOperations)({
            flatObjectMetadataMaps: buildFlatObjectMetadataMaps([
                flatObjectMetadata
            ]),
            flatFieldMetadataMaps: buildFlatFieldMetadataMaps([
                searchVectorFlatFieldMetadata
            ]),
            flatIndexMaps: buildFlatIndexMaps([
                ginIndex
            ]),
            applicationUniversalIdentifierById
        });
        expect(indexUniversalIdentifierUpdates).toHaveLength(0);
    });
});

//# sourceMappingURL=build-search-vector-gin-index-re-own-operations.util.spec.js.map
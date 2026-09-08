"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _issearchvectorginflatindexmetadatautil = require("../is-search-vector-gin-flat-index-metadata.util");
const _getflatfieldmetadatamock = require("../../../../../../engine/metadata-modules/flat-field-metadata/__mocks__/get-flat-field-metadata.mock");
const _getflatindexmetadatamock = require("../../../../../../engine/metadata-modules/flat-index-metadata/__mocks__/get-flat-index-metadata.mock");
const _searchvectorfieldconstants = require("../../../../../../engine/metadata-modules/search-field-metadata/constants/search-vector-field.constants");
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
const SEARCH_VECTOR_FIELD_ID = 'search-vector-field-id';
const TEXT_FIELD_ID = 'text-field-id';
const OTHER_TS_VECTOR_FIELD_ID = 'other-ts-vector-field-id';
const searchVectorFlatFieldMetadata = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
    id: SEARCH_VECTOR_FIELD_ID,
    universalIdentifier: 'search-vector-field-uid',
    objectMetadataId: 'object-id',
    type: _types.FieldMetadataType.TS_VECTOR,
    name: _searchvectorfieldconstants.SEARCH_VECTOR_FIELD.name
});
const textFlatFieldMetadata = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
    id: TEXT_FIELD_ID,
    universalIdentifier: 'text-field-uid',
    objectMetadataId: 'object-id',
    type: _types.FieldMetadataType.TEXT,
    name: 'name'
});
const otherTsVectorFlatFieldMetadata = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
    id: OTHER_TS_VECTOR_FIELD_ID,
    universalIdentifier: 'other-ts-vector-field-uid',
    objectMetadataId: 'object-id',
    type: _types.FieldMetadataType.TS_VECTOR,
    name: 'customSearchVector'
});
const flatFieldMetadataMaps = buildFlatFieldMetadataMaps([
    searchVectorFlatFieldMetadata,
    textFlatFieldMetadata,
    otherTsVectorFlatFieldMetadata
]);
describe('isSearchVectorGinFlatIndexMetadata', ()=>{
    it('returns true for a single-field GIN index on the TS_VECTOR field', ()=>{
        const flatIndexMetadata = (0, _getflatindexmetadatamock.getFlatIndexMetadataMock)({
            universalIdentifier: 'gin-index-uid',
            objectMetadataId: 'object-id',
            objectMetadataUniversalIdentifier: 'object-uid',
            applicationUniversalIdentifier: 'application-uid',
            indexType: _types.IndexType.GIN,
            flatIndexFieldMetadatas: [
                buildFlatIndexFieldMetadata({
                    fieldMetadataId: SEARCH_VECTOR_FIELD_ID
                })
            ]
        });
        expect((0, _issearchvectorginflatindexmetadatautil.isSearchVectorGinFlatIndexMetadata)({
            flatIndexMetadata,
            flatFieldMetadataMaps
        })).toBe(true);
    });
    it('returns false for a GIN index on a non-TS_VECTOR field', ()=>{
        const flatIndexMetadata = (0, _getflatindexmetadatamock.getFlatIndexMetadataMock)({
            universalIdentifier: 'gin-index-uid',
            objectMetadataId: 'object-id',
            objectMetadataUniversalIdentifier: 'object-uid',
            applicationUniversalIdentifier: 'application-uid',
            indexType: _types.IndexType.GIN,
            flatIndexFieldMetadatas: [
                buildFlatIndexFieldMetadata({
                    fieldMetadataId: TEXT_FIELD_ID
                })
            ]
        });
        expect((0, _issearchvectorginflatindexmetadatautil.isSearchVectorGinFlatIndexMetadata)({
            flatIndexMetadata,
            flatFieldMetadataMaps
        })).toBe(false);
    });
    it('returns false for a non-GIN (BTREE) index on the TS_VECTOR field', ()=>{
        const flatIndexMetadata = (0, _getflatindexmetadatamock.getFlatIndexMetadataMock)({
            universalIdentifier: 'btree-index-uid',
            objectMetadataId: 'object-id',
            objectMetadataUniversalIdentifier: 'object-uid',
            applicationUniversalIdentifier: 'application-uid',
            indexType: _types.IndexType.BTREE,
            flatIndexFieldMetadatas: [
                buildFlatIndexFieldMetadata({
                    fieldMetadataId: SEARCH_VECTOR_FIELD_ID
                })
            ]
        });
        expect((0, _issearchvectorginflatindexmetadatautil.isSearchVectorGinFlatIndexMetadata)({
            flatIndexMetadata,
            flatFieldMetadataMaps
        })).toBe(false);
    });
    it('returns false for a single-field GIN index on a TS_VECTOR field that is not the searchVector field', ()=>{
        const flatIndexMetadata = (0, _getflatindexmetadatamock.getFlatIndexMetadataMock)({
            universalIdentifier: 'gin-index-uid',
            objectMetadataId: 'object-id',
            objectMetadataUniversalIdentifier: 'object-uid',
            applicationUniversalIdentifier: 'application-uid',
            indexType: _types.IndexType.GIN,
            flatIndexFieldMetadatas: [
                buildFlatIndexFieldMetadata({
                    fieldMetadataId: OTHER_TS_VECTOR_FIELD_ID
                })
            ]
        });
        expect((0, _issearchvectorginflatindexmetadatautil.isSearchVectorGinFlatIndexMetadata)({
            flatIndexMetadata,
            flatFieldMetadataMaps
        })).toBe(false);
    });
    it('returns false for a multi-column GIN index', ()=>{
        const flatIndexMetadata = (0, _getflatindexmetadatamock.getFlatIndexMetadataMock)({
            universalIdentifier: 'gin-index-uid',
            objectMetadataId: 'object-id',
            objectMetadataUniversalIdentifier: 'object-uid',
            applicationUniversalIdentifier: 'application-uid',
            indexType: _types.IndexType.GIN,
            flatIndexFieldMetadatas: [
                buildFlatIndexFieldMetadata({
                    fieldMetadataId: SEARCH_VECTOR_FIELD_ID
                }),
                buildFlatIndexFieldMetadata({
                    fieldMetadataId: TEXT_FIELD_ID
                })
            ]
        });
        expect((0, _issearchvectorginflatindexmetadatautil.isSearchVectorGinFlatIndexMetadata)({
            flatIndexMetadata,
            flatFieldMetadataMaps
        })).toBe(false);
    });
});

//# sourceMappingURL=is-search-vector-gin-flat-index-metadata.util.spec.js.map
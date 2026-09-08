"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _getflatfieldmetadatamock = require("../../../../../engine/metadata-modules/flat-field-metadata/__mocks__/get-flat-field-metadata.mock");
const _getflatobjectmetadatamock = require("../../../../../engine/metadata-modules/flat-object-metadata/__mocks__/get-flat-object-metadata.mock");
const _generateworkspaceschemaddlutil = require("../generate-workspace-schema-ddl.util");
describe('generateWorkspaceSchemaDdl', ()=>{
    const workspaceId = '20202020-1c25-4d02-bf25-6aeccf7ea419';
    const objectMetadataId = '20202020-object-id';
    const nameFieldId = '20202020-name-field-id';
    const searchVectorFieldId = '20202020-search-vector-field-id';
    const objectMetadata = {
        ...(0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
            universalIdentifier: 'person',
            id: objectMetadataId,
            nameSingular: 'person',
            namePlural: 'persons'
        }),
        isActive: true
    };
    const nameField = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
        universalIdentifier: 'name',
        id: nameFieldId,
        objectMetadataId,
        type: _types.FieldMetadataType.TEXT,
        name: 'name'
    });
    const searchVectorField = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
        universalIdentifier: 'searchVector',
        id: searchVectorFieldId,
        objectMetadataId,
        type: _types.FieldMetadataType.TS_VECTOR,
        name: 'searchVector'
    });
    const fieldsByObjectId = new Map([
        [
            objectMetadataId,
            [
                nameField,
                searchVectorField
            ]
        ]
    ]);
    const buildSearchFieldMetadata = (overrides = {})=>({
            universalIdentifier: 'search-name',
            objectMetadataId,
            fieldMetadataId: nameFieldId,
            tsVectorFieldMetadataId: searchVectorFieldId,
            position: 0,
            ...overrides
        });
    const generateSearchVectorColumnSql = (searchFieldMetadatasByObjectId)=>{
        const statements = (0, _generateworkspaceschemaddlutil.generateWorkspaceSchemaDdl)(workspaceId, 'workspace_schema', [
            objectMetadata
        ], fieldsByObjectId, searchFieldMetadatasByObjectId);
        const createTableStatement = statements.find((statement)=>statement.includes('"searchVector"'));
        expect(createTableStatement).toBeDefined();
        return createTableStatement;
    };
    it('should emit the searchVector column as a STORED generated column derived from searchFieldMetadata', ()=>{
        const createTableStatement = generateSearchVectorColumnSql(new Map([
            [
                objectMetadataId,
                [
                    buildSearchFieldMetadata()
                ]
            ]
        ]));
        expect(createTableStatement).toContain(`"searchVector" tsvector GENERATED ALWAYS AS (to_tsvector('simple', COALESCE(public.unaccent_immutable("name"), ''))) STORED`);
    });
    it('should tolerate a legacy NULL tsVectorFieldMetadataId row (pre-2.18 backfill)', ()=>{
        const createTableStatement = generateSearchVectorColumnSql(new Map([
            [
                objectMetadataId,
                [
                    buildSearchFieldMetadata({
                        tsVectorFieldMetadataId: null
                    })
                ]
            ]
        ]));
        expect(createTableStatement).toContain(`GENERATED ALWAYS AS (to_tsvector('simple', COALESCE(public.unaccent_immutable("name"), ''))) STORED`);
    });
    it('should still emit a valid STORED generated column when no searchFieldMetadata rows exist', ()=>{
        const createTableStatement = generateSearchVectorColumnSql(new Map());
        expect(createTableStatement).toContain(`"searchVector" tsvector GENERATED ALWAYS AS (to_tsvector('simple', NULL)) STORED`);
    });
});

//# sourceMappingURL=generate-workspace-schema-ddl.util.spec.js.map
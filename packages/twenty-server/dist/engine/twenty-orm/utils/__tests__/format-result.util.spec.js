"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _getflatfieldsforflatobjectmetadatautil = require("../../../api/graphql/workspace-schema-builder/utils/get-flat-fields-for-flat-object-metadata.util");
const _createemptyflatentitymapsconstant = require("../../../metadata-modules/flat-entity/constant/create-empty-flat-entity-maps.constant");
const _addflatentitytoflatentitymapsorthrowutil = require("../../../metadata-modules/flat-entity/utils/add-flat-entity-to-flat-entity-maps-or-throw.util");
const _getflatfieldmetadatamock = require("../../../metadata-modules/flat-field-metadata/__mocks__/get-flat-field-metadata.mock");
const _getflatobjectmetadatamock = require("../../../metadata-modules/flat-object-metadata/__mocks__/get-flat-object-metadata.mock");
const _formatresultutil = require("../format-result.util");
jest.mock('src/engine/api/graphql/workspace-schema-builder/utils/get-flat-fields-for-flat-object-metadata.util', ()=>{
    const actual = jest.requireActual('src/engine/api/graphql/workspace-schema-builder/utils/get-flat-fields-for-flat-object-metadata.util');
    return {
        ...actual,
        getFlatFieldsFromFlatObjectMetadata: jest.fn(actual.getFlatFieldsFromFlatObjectMetadata)
    };
});
const buildFlatEntityMaps = (flatEntities)=>flatEntities.reduce((maps, flatEntity)=>(0, _addflatentitytoflatentitymapsorthrowutil.addFlatEntityToFlatEntityMapsOrThrow)({
            flatEntity,
            flatEntityMaps: maps
        }), (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)());
describe('formatResult', ()=>{
    afterEach(()=>{
        jest.clearAllMocks();
    });
    it('reuses derived field metadata per object type within one invocation', ()=>{
        const companyObjectMetadataId = '20202020-3c25-4d02-bf25-6aeccf7ea419';
        const personObjectMetadataId = '20202020-4c25-4d02-bf25-6aeccf7ea419';
        const companyNameFieldMetadata = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
            id: '20202020-5c25-4d02-bf25-6aeccf7ea419',
            universalIdentifier: '20202020-6c25-4d02-bf25-6aeccf7ea419',
            objectMetadataId: companyObjectMetadataId,
            objectMetadataUniversalIdentifier: '20202020-7c25-4d02-bf25-6aeccf7ea419',
            name: 'name',
            type: _types.FieldMetadataType.TEXT
        });
        const companyPeopleFieldMetadata = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
            id: '20202020-8c25-4d02-bf25-6aeccf7ea419',
            universalIdentifier: '20202020-9c25-4d02-bf25-6aeccf7ea419',
            objectMetadataId: companyObjectMetadataId,
            objectMetadataUniversalIdentifier: companyNameFieldMetadata.objectMetadataUniversalIdentifier,
            name: 'people',
            type: _types.FieldMetadataType.RELATION,
            relationTargetObjectMetadataId: personObjectMetadataId,
            settings: {
                relationType: _types.RelationType.ONE_TO_MANY
            }
        });
        const personNameFieldMetadata = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
            id: '20202020-ac25-4d02-bf25-6aeccf7ea419',
            universalIdentifier: '20202020-bc25-4d02-bf25-6aeccf7ea419',
            objectMetadataId: personObjectMetadataId,
            objectMetadataUniversalIdentifier: '20202020-cc25-4d02-bf25-6aeccf7ea419',
            name: 'name',
            type: _types.FieldMetadataType.TEXT
        });
        const companyObjectMetadata = (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
            id: companyObjectMetadataId,
            universalIdentifier: companyNameFieldMetadata.objectMetadataUniversalIdentifier,
            fieldIds: [
                companyNameFieldMetadata.id,
                companyPeopleFieldMetadata.id
            ]
        });
        const personObjectMetadata = (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
            id: personObjectMetadataId,
            universalIdentifier: personNameFieldMetadata.objectMetadataUniversalIdentifier,
            fieldIds: [
                personNameFieldMetadata.id
            ]
        });
        const flatObjectMetadataMaps = buildFlatEntityMaps([
            companyObjectMetadata,
            personObjectMetadata
        ]);
        const flatFieldMetadataMaps = buildFlatEntityMaps([
            companyNameFieldMetadata,
            companyPeopleFieldMetadata,
            personNameFieldMetadata
        ]);
        const records = [
            {
                name: 'Acme',
                people: [
                    {
                        name: 'Alice'
                    },
                    {
                        name: 'Bob'
                    }
                ]
            },
            {
                name: 'Globex',
                people: [
                    {
                        name: 'Carol'
                    }
                ]
            }
        ];
        const formattedRecords = (0, _formatresultutil.formatResult)(records, companyObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps);
        expect(formattedRecords).toEqual(records);
        const firstInvocationMetadataLookupCount = jest.mocked(_getflatfieldsforflatobjectmetadatautil.getFlatFieldsFromFlatObjectMetadata).mock.calls.length;
        expect(firstInvocationMetadataLookupCount).toBeGreaterThan(0);
        expect(firstInvocationMetadataLookupCount).toBeLessThanOrEqual(4);
        // Field maps derived from a metadata snapshot are memoized by object
        // identity, so a second invocation only re-runs the lookups when it receives
        // fresh snapshot objects
        const rebuiltFlatFieldMetadataMaps = buildFlatEntityMaps([
            companyNameFieldMetadata,
            companyPeopleFieldMetadata,
            personNameFieldMetadata
        ]);
        (0, _formatresultutil.formatResult)(records, companyObjectMetadata, flatObjectMetadataMaps, rebuiltFlatFieldMetadataMaps);
        expect(jest.mocked(_getflatfieldsforflatobjectmetadatautil.getFlatFieldsFromFlatObjectMetadata).mock.calls.length).toBe(firstInvocationMetadataLookupCount * 2);
    });
});

//# sourceMappingURL=format-result.util.spec.js.map
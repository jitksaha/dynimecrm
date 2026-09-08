"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _flatindexmetadatavalidatorservice = require("../flat-index-metadata-validator.service");
const INDEX_UNIVERSAL_IDENTIFIER = '11111111-1111-4111-8111-111111111111';
const OBJECT_UNIVERSAL_IDENTIFIER = '22222222-2222-4222-8222-222222222222';
const FIELD_UNIVERSAL_IDENTIFIER = '33333333-3333-4333-8333-333333333333';
const buildCreationArgs = (relationType)=>({
        flatEntityToValidate: {
            universalIdentifier: INDEX_UNIVERSAL_IDENTIFIER,
            name: 'targetUniqueIndex',
            objectMetadataUniversalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
            isUnique: true,
            universalFlatIndexFieldMetadatas: [
                {
                    indexMetadataUniversalIdentifier: INDEX_UNIVERSAL_IDENTIFIER,
                    fieldMetadataUniversalIdentifier: FIELD_UNIVERSAL_IDENTIFIER
                }
            ]
        },
        optimisticFlatEntityMapsAndRelatedFlatEntityMaps: {
            flatIndexMaps: {
                byUniversalIdentifier: {}
            },
            flatObjectMetadataMaps: {
                byUniversalIdentifier: {
                    [OBJECT_UNIVERSAL_IDENTIFIER]: {
                        universalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER
                    }
                }
            },
            flatFieldMetadataMaps: {
                byUniversalIdentifier: {
                    [FIELD_UNIVERSAL_IDENTIFIER]: {
                        universalIdentifier: FIELD_UNIVERSAL_IDENTIFIER,
                        objectMetadataUniversalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
                        name: 'targetPerson',
                        type: _types.FieldMetadataType.MORPH_RELATION,
                        defaultValue: null,
                        isUnique: false,
                        universalSettings: {
                            relationType
                        }
                    }
                }
            }
        }
    });
describe('FlatIndexValidatorService', ()=>{
    const service = new _flatindexmetadatavalidatorservice.FlatIndexValidatorService();
    it('accepts a unique index on a many-to-one morph member join column', ()=>{
        const result = service.validateFlatIndexCreation(buildCreationArgs(_types.RelationType.MANY_TO_ONE));
        expect(result.errors).toEqual([]);
    });
    it('rejects a unique index on an inverse morph relation', ()=>{
        const result = service.validateFlatIndexCreation(buildCreationArgs(_types.RelationType.ONE_TO_MANY));
        expect(result.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({
                message: 'Unique index cannot be created for field targetPerson of type MORPH_RELATION'
            })
        ]));
    });
});

//# sourceMappingURL=flat-index-metadata-validator.service.spec.js.map
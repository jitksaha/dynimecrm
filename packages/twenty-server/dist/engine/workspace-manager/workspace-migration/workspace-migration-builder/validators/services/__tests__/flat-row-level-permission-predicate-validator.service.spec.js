"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _flatrowlevelpermissionpredicatevalidatorservice = require("../flat-row-level-permission-predicate-validator.service");
const PREDICATE_UNIVERSAL_IDENTIFIER = '00000000-0000-4000-8000-0000000000a1';
const FIELD_UNIVERSAL_IDENTIFIER = '00000000-0000-4000-8000-0000000000b1';
const OBJECT_UNIVERSAL_IDENTIFIER = '00000000-0000-4000-8000-0000000000c1';
const ROLE_UNIVERSAL_IDENTIFIER = '00000000-0000-4000-8000-0000000000d1';
const RECORD_ID = '20202020-1c25-4d02-bf25-6aeccf7ea419';
const mapsFrom = (entities)=>({
        byUniversalIdentifier: Object.fromEntries(entities.map((entity)=>[
                entity.universalIdentifier,
                entity
            ]))
    });
const buildPredicate = ({ operand, value, workspaceMemberFieldMetadataUniversalIdentifier = null })=>({
        universalIdentifier: PREDICATE_UNIVERSAL_IDENTIFIER,
        fieldMetadataUniversalIdentifier: FIELD_UNIVERSAL_IDENTIFIER,
        objectMetadataUniversalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
        roleUniversalIdentifier: ROLE_UNIVERSAL_IDENTIFIER,
        rowLevelPermissionPredicateGroupUniversalIdentifier: null,
        operand,
        value,
        subFieldName: null,
        workspaceMemberFieldMetadataUniversalIdentifier
    });
const relatedMaps = (fieldType)=>({
        flatRowLevelPermissionPredicateGroupMaps: mapsFrom([]),
        flatFieldMetadataMaps: mapsFrom([
            {
                universalIdentifier: FIELD_UNIVERSAL_IDENTIFIER,
                type: fieldType,
                label: 'Account Owner'
            }
        ]),
        flatObjectMetadataMaps: mapsFrom([
            {
                universalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER
            }
        ]),
        flatRoleMaps: mapsFrom([
            {
                universalIdentifier: ROLE_UNIVERSAL_IDENTIFIER
            }
        ])
    });
const buildCreationArgs = ({ fieldType, operand, value, workspaceMemberFieldMetadataUniversalIdentifier = null })=>({
        flatEntityToValidate: buildPredicate({
            operand,
            value,
            workspaceMemberFieldMetadataUniversalIdentifier
        }),
        optimisticFlatEntityMapsAndRelatedFlatEntityMaps: {
            flatRowLevelPermissionPredicateMaps: mapsFrom([]),
            ...relatedMaps(fieldType)
        }
    });
const buildUpdateArgs = ({ fieldType, operand, value, flatEntityUpdate, workspaceMemberFieldMetadataUniversalIdentifier = null })=>({
        universalIdentifier: PREDICATE_UNIVERSAL_IDENTIFIER,
        flatEntityUpdate,
        optimisticFlatEntityMapsAndRelatedFlatEntityMaps: {
            flatRowLevelPermissionPredicateMaps: mapsFrom([
                buildPredicate({
                    operand,
                    value,
                    workspaceMemberFieldMetadataUniversalIdentifier
                })
            ]),
            ...relatedMaps(fieldType)
        }
    });
describe('FlatRowLevelPermissionPredicateValidatorService', ()=>{
    let service;
    beforeEach(()=>{
        service = new _flatrowlevelpermissionpredicatevalidatorservice.FlatRowLevelPermissionPredicateValidatorService();
    });
    describe('creation', ()=>{
        it('should reject a relation value that resolves to no record id', ()=>{
            const result = service.validateFlatRowLevelPermissionPredicateCreation(buildCreationArgs({
                fieldType: _types.FieldMetadataType.RELATION,
                operand: _types.RowLevelPermissionPredicateOperand.IS,
                value: {
                    direction: 'NEXT',
                    amount: 30,
                    unit: 'DAY'
                }
            }));
            expect(result.errors).toHaveLength(1);
        });
        it('should reject the object form of a relative date predicate', ()=>{
            const result = service.validateFlatRowLevelPermissionPredicateCreation(buildCreationArgs({
                fieldType: _types.FieldMetadataType.DATE,
                operand: _types.RowLevelPermissionPredicateOperand.IS_RELATIVE,
                value: {
                    direction: 'NEXT',
                    amount: 30,
                    unit: 'DAY'
                }
            }));
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].message).toContain('NEXT_30_DAY');
        });
        it('should accept a valid predicate value', ()=>{
            const result = service.validateFlatRowLevelPermissionPredicateCreation(buildCreationArgs({
                fieldType: _types.FieldMetadataType.RELATION,
                operand: _types.RowLevelPermissionPredicateOperand.IS,
                value: {
                    selectedRecordIds: [
                        RECORD_ID
                    ]
                }
            }));
            expect(result.errors).toEqual([]);
        });
        it.each([
            [
                ''
            ],
            [
                '[]'
            ],
            [
                []
            ]
        ])('should reject %p on an operand that expects a value', (value)=>{
            const result = service.validateFlatRowLevelPermissionPredicateCreation(buildCreationArgs({
                fieldType: _types.FieldMetadataType.RELATION,
                operand: _types.RowLevelPermissionPredicateOperand.IS,
                value
            }));
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].message).toContain('requires a value');
        });
        it.each([
            [
                null
            ],
            [
                undefined
            ]
        ])('should accept %p, a predicate whose value is not filled in yet', (value)=>{
            const result = service.validateFlatRowLevelPermissionPredicateCreation(buildCreationArgs({
                fieldType: _types.FieldMetadataType.TEXT,
                operand: _types.RowLevelPermissionPredicateOperand.CONTAINS,
                value
            }));
            expect(result.errors).toEqual([]);
        });
        it('should accept a value-less operand with no value', ()=>{
            const result = service.validateFlatRowLevelPermissionPredicateCreation(buildCreationArgs({
                fieldType: _types.FieldMetadataType.RELATION,
                operand: _types.RowLevelPermissionPredicateOperand.IS_NOT_EMPTY,
                value: null
            }));
            expect(result.errors).toEqual([]);
        });
        it('should skip validation when the value is resolved from the workspace member', ()=>{
            const result = service.validateFlatRowLevelPermissionPredicateCreation(buildCreationArgs({
                fieldType: _types.FieldMetadataType.RELATION,
                operand: _types.RowLevelPermissionPredicateOperand.IS,
                value: null,
                workspaceMemberFieldMetadataUniversalIdentifier: FIELD_UNIVERSAL_IDENTIFIER
            }));
            expect(result.errors).toEqual([]);
        });
    });
    describe('update', ()=>{
        it('should validate the retained value when workspace member resolution is cleared', ()=>{
            const result = service.validateFlatRowLevelPermissionPredicateUpdate(buildUpdateArgs({
                fieldType: _types.FieldMetadataType.RELATION,
                operand: _types.RowLevelPermissionPredicateOperand.IS,
                value: {
                    direction: 'NEXT',
                    amount: 30,
                    unit: 'DAY'
                },
                workspaceMemberFieldMetadataUniversalIdentifier: FIELD_UNIVERSAL_IDENTIFIER,
                flatEntityUpdate: {
                    workspaceMemberFieldMetadataUniversalIdentifier: null
                }
            }));
            expect(result.errors).toHaveLength(1);
        });
        it('should not validate the value when it is not part of the update', ()=>{
            const result = service.validateFlatRowLevelPermissionPredicateUpdate(buildUpdateArgs({
                fieldType: _types.FieldMetadataType.RELATION,
                operand: _types.RowLevelPermissionPredicateOperand.IS,
                value: {
                    direction: 'NEXT',
                    amount: 30,
                    unit: 'DAY'
                },
                flatEntityUpdate: {
                    positionInRowLevelPermissionPredicateGroup: 2
                }
            }));
            expect(result.errors).toEqual([]);
        });
    });
});

//# sourceMappingURL=flat-row-level-permission-predicate-validator.service.spec.js.map
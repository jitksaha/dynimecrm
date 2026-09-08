"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _getrelationfieldorderbyutil = require("../get-relation-field-order-by.util");
const createMockFieldMetadata = (overrides)=>({
        id: 'test-id',
        name: 'testField',
        type: _types.FieldMetadataType.RELATION,
        universalIdentifier: 'test-universal-id',
        ...overrides
    });
const createMockObjectMetadata = (overrides)=>({
        id: 'test-object-id',
        nameSingular: 'testObject',
        namePlural: 'testObjects',
        fieldIds: [],
        universalIdentifier: 'test-object-universal-id',
        ...overrides
    });
const buildFlatEntityMaps = (entities)=>({
        byUniversalIdentifier: Object.fromEntries(entities.map((entity)=>[
                entity.universalIdentifier,
                entity
            ])),
        universalIdentifierById: Object.fromEntries(entities.map((entity)=>[
                entity.id,
                entity.universalIdentifier
            ])),
        universalIdentifiersByApplicationId: {}
    });
describe('getRelationFieldOrderBy', ()=>{
    const companyNameField = createMockFieldMetadata({
        id: 'company-name-field-id',
        name: 'name',
        type: _types.FieldMetadataType.TEXT,
        universalIdentifier: 'company-name-universal-id'
    });
    const companyObject = createMockObjectMetadata({
        id: 'company-object-id',
        nameSingular: 'company',
        namePlural: 'companies',
        labelIdentifierFieldMetadataId: companyNameField.id,
        universalIdentifier: 'company-object-universal-id'
    });
    const workspaceMemberNameField = createMockFieldMetadata({
        id: 'workspace-member-name-field-id',
        name: 'name',
        type: _types.FieldMetadataType.FULL_NAME,
        universalIdentifier: 'workspace-member-name-universal-id'
    });
    const workspaceMemberObject = createMockObjectMetadata({
        id: 'workspace-member-object-id',
        nameSingular: 'workspaceMember',
        namePlural: 'workspaceMembers',
        labelIdentifierFieldMetadataId: workspaceMemberNameField.id,
        universalIdentifier: 'workspace-member-object-universal-id'
    });
    const flatObjectMetadataMaps = buildFlatEntityMaps([
        companyObject,
        workspaceMemberObject
    ]);
    const flatFieldMetadataMaps = buildFlatEntityMaps([
        companyNameField,
        workspaceMemberNameField
    ]);
    const relationFieldMetadata = createMockFieldMetadata({
        name: 'company',
        type: _types.FieldMetadataType.RELATION,
        relationTargetObjectMetadataId: companyObject.id
    });
    describe('without subFieldName', ()=>{
        it('should order by the target label identifier then id for a TEXT label', ()=>{
            const result = (0, _getrelationfieldorderbyutil.getRelationFieldOrderBy)({
                groupByFieldMetadata: relationFieldMetadata,
                groupBySubFieldName: null,
                direction: _types.OrderByDirection.AscNullsLast,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps
            });
            expect(result).toEqual([
                {
                    company: {
                        name: _types.OrderByDirection.AscNullsLast
                    }
                },
                {
                    company: {
                        id: _types.OrderByDirection.AscNullsLast
                    }
                }
            ]);
        });
        it('should order by firstName then lastName then id for a FULL_NAME label', ()=>{
            const workspaceMemberRelationField = createMockFieldMetadata({
                name: 'assignee',
                type: _types.FieldMetadataType.RELATION,
                relationTargetObjectMetadataId: workspaceMemberObject.id
            });
            const result = (0, _getrelationfieldorderbyutil.getRelationFieldOrderBy)({
                groupByFieldMetadata: workspaceMemberRelationField,
                groupBySubFieldName: null,
                direction: _types.OrderByDirection.DescNullsLast,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps
            });
            expect(result).toEqual([
                {
                    assignee: {
                        name: {
                            firstName: _types.OrderByDirection.DescNullsLast
                        }
                    }
                },
                {
                    assignee: {
                        name: {
                            lastName: _types.OrderByDirection.DescNullsLast
                        }
                    }
                },
                {
                    assignee: {
                        id: _types.OrderByDirection.DescNullsLast
                    }
                }
            ]);
        });
        it('should order by the target label identifier for a MORPH_RELATION field', ()=>{
            const morphRelationField = createMockFieldMetadata({
                name: 'owner',
                type: _types.FieldMetadataType.MORPH_RELATION,
                relationTargetObjectMetadataId: companyObject.id
            });
            const result = (0, _getrelationfieldorderbyutil.getRelationFieldOrderBy)({
                groupByFieldMetadata: morphRelationField,
                groupBySubFieldName: undefined,
                direction: _types.OrderByDirection.AscNullsLast,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps
            });
            expect(result).toEqual([
                {
                    owner: {
                        name: _types.OrderByDirection.AscNullsLast
                    }
                },
                {
                    owner: {
                        id: _types.OrderByDirection.AscNullsLast
                    }
                }
            ]);
        });
        it('should fall back to id when the target has no label identifier', ()=>{
            const objectWithoutLabelIdentifier = createMockObjectMetadata({
                id: 'no-label-object-id',
                nameSingular: 'noLabel',
                namePlural: 'noLabels',
                labelIdentifierFieldMetadataId: null,
                universalIdentifier: 'no-label-object-universal-id'
            });
            const result = (0, _getrelationfieldorderbyutil.getRelationFieldOrderBy)({
                groupByFieldMetadata: createMockFieldMetadata({
                    name: 'noLabel',
                    relationTargetObjectMetadataId: objectWithoutLabelIdentifier.id
                }),
                groupBySubFieldName: null,
                direction: _types.OrderByDirection.AscNullsLast,
                flatObjectMetadataMaps: buildFlatEntityMaps([
                    objectWithoutLabelIdentifier
                ]),
                flatFieldMetadataMaps
            });
            expect(result).toEqual([
                {
                    noLabel: {
                        id: _types.OrderByDirection.AscNullsLast
                    }
                }
            ]);
        });
        it('should fall back to id when the label identifier is the id field', ()=>{
            const idField = createMockFieldMetadata({
                id: 'id-field-id',
                name: 'id',
                type: _types.FieldMetadataType.UUID,
                universalIdentifier: 'id-field-universal-id'
            });
            const objectWithIdLabel = createMockObjectMetadata({
                id: 'id-label-object-id',
                nameSingular: 'idLabel',
                namePlural: 'idLabels',
                labelIdentifierFieldMetadataId: idField.id,
                universalIdentifier: 'id-label-object-universal-id'
            });
            const result = (0, _getrelationfieldorderbyutil.getRelationFieldOrderBy)({
                groupByFieldMetadata: createMockFieldMetadata({
                    name: 'idLabel',
                    relationTargetObjectMetadataId: objectWithIdLabel.id
                }),
                groupBySubFieldName: null,
                direction: _types.OrderByDirection.AscNullsLast,
                flatObjectMetadataMaps: buildFlatEntityMaps([
                    objectWithIdLabel
                ]),
                flatFieldMetadataMaps: buildFlatEntityMaps([
                    idField
                ])
            });
            expect(result).toEqual([
                {
                    idLabel: {
                        id: _types.OrderByDirection.AscNullsLast
                    }
                }
            ]);
        });
        it('should fall back to id when the label identifier type is unsupported', ()=>{
            const numberField = createMockFieldMetadata({
                id: 'number-field-id',
                name: 'amount',
                type: _types.FieldMetadataType.NUMBER,
                universalIdentifier: 'number-field-universal-id'
            });
            const objectWithNumberLabel = createMockObjectMetadata({
                id: 'number-label-object-id',
                nameSingular: 'numberLabel',
                namePlural: 'numberLabels',
                labelIdentifierFieldMetadataId: numberField.id,
                universalIdentifier: 'number-label-object-universal-id'
            });
            const result = (0, _getrelationfieldorderbyutil.getRelationFieldOrderBy)({
                groupByFieldMetadata: createMockFieldMetadata({
                    name: 'numberLabel',
                    relationTargetObjectMetadataId: objectWithNumberLabel.id
                }),
                groupBySubFieldName: null,
                direction: _types.OrderByDirection.AscNullsLast,
                flatObjectMetadataMaps: buildFlatEntityMaps([
                    objectWithNumberLabel
                ]),
                flatFieldMetadataMaps: buildFlatEntityMaps([
                    numberField
                ])
            });
            expect(result).toEqual([
                {
                    numberLabel: {
                        id: _types.OrderByDirection.AscNullsLast
                    }
                }
            ]);
        });
        it('should fall back to id when the target object metadata is missing', ()=>{
            const result = (0, _getrelationfieldorderbyutil.getRelationFieldOrderBy)({
                groupByFieldMetadata: createMockFieldMetadata({
                    name: 'company',
                    relationTargetObjectMetadataId: 'unknown-object-id'
                }),
                groupBySubFieldName: null,
                direction: _types.OrderByDirection.DescNullsLast,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps
            });
            expect(result).toEqual([
                {
                    company: {
                        id: _types.OrderByDirection.DescNullsLast
                    }
                }
            ]);
        });
    });
    describe('with simple subFieldName', ()=>{
        it('should return nested object for simple subfield', ()=>{
            const result = (0, _getrelationfieldorderbyutil.getRelationFieldOrderBy)({
                groupByFieldMetadata: relationFieldMetadata,
                groupBySubFieldName: 'name',
                direction: _types.OrderByDirection.AscNullsLast,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps
            });
            expect(result).toEqual([
                {
                    company: {
                        name: _types.OrderByDirection.AscNullsLast
                    }
                }
            ]);
        });
        it('should handle descending direction', ()=>{
            const result = (0, _getrelationfieldorderbyutil.getRelationFieldOrderBy)({
                groupByFieldMetadata: relationFieldMetadata,
                groupBySubFieldName: 'name',
                direction: _types.OrderByDirection.DescNullsLast,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps
            });
            expect(result).toEqual([
                {
                    company: {
                        name: _types.OrderByDirection.DescNullsLast
                    }
                }
            ]);
        });
    });
    describe('with composite subFieldName', ()=>{
        it('should return deeply nested object for composite subfield', ()=>{
            const result = (0, _getrelationfieldorderbyutil.getRelationFieldOrderBy)({
                groupByFieldMetadata: relationFieldMetadata,
                groupBySubFieldName: 'address.addressCity',
                direction: _types.OrderByDirection.AscNullsLast,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps
            });
            expect(result).toEqual([
                {
                    company: {
                        address: {
                            addressCity: _types.OrderByDirection.AscNullsLast
                        }
                    }
                }
            ]);
        });
    });
    describe('with date granularity', ()=>{
        it('should return date order by with granularity', ()=>{
            const result = (0, _getrelationfieldorderbyutil.getRelationFieldOrderBy)({
                groupByFieldMetadata: relationFieldMetadata,
                groupBySubFieldName: 'createdAt',
                direction: _types.OrderByDirection.AscNullsLast,
                dateGranularity: _types.ObjectRecordGroupByDateGranularity.MONTH,
                isNestedDateField: true,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps
            });
            expect(result).toEqual([
                {
                    company: {
                        createdAt: {
                            orderBy: _types.OrderByDirection.AscNullsLast,
                            granularity: _types.ObjectRecordGroupByDateGranularity.MONTH
                        }
                    }
                }
            ]);
        });
        it('should use default granularity when isNestedDateField is true but granularity not provided', ()=>{
            const result = (0, _getrelationfieldorderbyutil.getRelationFieldOrderBy)({
                groupByFieldMetadata: relationFieldMetadata,
                groupBySubFieldName: 'createdAt',
                direction: _types.OrderByDirection.AscNullsLast,
                isNestedDateField: true,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps
            });
            expect(result).toEqual([
                {
                    company: {
                        createdAt: {
                            orderBy: _types.OrderByDirection.AscNullsLast,
                            granularity: _types.ObjectRecordGroupByDateGranularity.DAY
                        }
                    }
                }
            ]);
        });
        it('should return date order by when dateGranularity is provided', ()=>{
            const result = (0, _getrelationfieldorderbyutil.getRelationFieldOrderBy)({
                groupByFieldMetadata: relationFieldMetadata,
                groupBySubFieldName: 'createdAt',
                direction: _types.OrderByDirection.DescNullsLast,
                dateGranularity: _types.ObjectRecordGroupByDateGranularity.YEAR,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps
            });
            expect(result).toEqual([
                {
                    company: {
                        createdAt: {
                            orderBy: _types.OrderByDirection.DescNullsLast,
                            granularity: _types.ObjectRecordGroupByDateGranularity.YEAR
                        }
                    }
                }
            ]);
        });
    });
});

//# sourceMappingURL=get-relation-field-order-by.util.spec.js.map
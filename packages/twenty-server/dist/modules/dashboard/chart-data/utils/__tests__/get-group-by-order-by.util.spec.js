"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _graphorderbyenum = require("../../../../../engine/metadata-modules/page-layout-widget/enums/graph-order-by.enum");
const _getgroupbyorderbyutil = require("../get-group-by-order-by.util");
const createMockFieldMetadata = (overrides)=>({
        id: 'test-id',
        name: 'testField',
        type: _types.FieldMetadataType.TEXT,
        universalIdentifier: 'test-universal-id',
        ...overrides
    });
const emptyFlatObjectMetadataMaps = {
    byUniversalIdentifier: {},
    universalIdentifierById: {},
    universalIdentifiersByApplicationId: {}
};
const emptyFlatFieldMetadataMaps = {
    byUniversalIdentifier: {},
    universalIdentifierById: {},
    universalIdentifiersByApplicationId: {}
};
const emptyMetadataMaps = {
    flatObjectMetadataMaps: emptyFlatObjectMetadataMaps,
    flatFieldMetadataMaps: emptyFlatFieldMetadataMaps
};
describe('getGroupByOrderBy', ()=>{
    const groupByFieldMetadata = createMockFieldMetadata({
        name: 'status',
        type: _types.FieldMetadataType.TEXT
    });
    const aggregateFieldMetadata = createMockFieldMetadata({
        name: 'amount',
        type: _types.FieldMetadataType.NUMBER
    });
    describe('FIELD_ASC', ()=>{
        it('should return field order by ascending', ()=>{
            const result = (0, _getgroupbyorderbyutil.getGroupByOrderBy)({
                graphOrderBy: _graphorderbyenum.GraphOrderBy.FIELD_ASC,
                groupByFieldMetadata,
                ...emptyMetadataMaps
            });
            expect(result).toEqual([
                {
                    status: _types.OrderByDirection.AscNullsLast
                }
            ]);
        });
        it('should handle date field with granularity', ()=>{
            const dateFieldMetadata = createMockFieldMetadata({
                name: 'createdAt',
                type: _types.FieldMetadataType.DATE
            });
            const result = (0, _getgroupbyorderbyutil.getGroupByOrderBy)({
                graphOrderBy: _graphorderbyenum.GraphOrderBy.FIELD_ASC,
                groupByFieldMetadata: dateFieldMetadata,
                dateGranularity: _types.ObjectRecordGroupByDateGranularity.MONTH,
                ...emptyMetadataMaps
            });
            expect(result).toEqual([
                {
                    createdAt: {
                        orderBy: _types.OrderByDirection.AscNullsLast,
                        granularity: _types.ObjectRecordGroupByDateGranularity.MONTH
                    }
                }
            ]);
        });
    });
    describe('FIELD_DESC', ()=>{
        it('should return field order by descending', ()=>{
            const result = (0, _getgroupbyorderbyutil.getGroupByOrderBy)({
                graphOrderBy: _graphorderbyenum.GraphOrderBy.FIELD_DESC,
                groupByFieldMetadata,
                ...emptyMetadataMaps
            });
            expect(result).toEqual([
                {
                    status: _types.OrderByDirection.DescNullsLast
                }
            ]);
        });
    });
    describe('VALUE_ASC', ()=>{
        it('should return aggregate order by ascending', ()=>{
            const result = (0, _getgroupbyorderbyutil.getGroupByOrderBy)({
                graphOrderBy: _graphorderbyenum.GraphOrderBy.VALUE_ASC,
                groupByFieldMetadata,
                aggregateOperation: _types.AggregateOperations.SUM,
                aggregateFieldMetadata,
                ...emptyMetadataMaps
            });
            expect(result).toEqual([
                {
                    aggregate: {
                        sumAmount: _types.OrderByDirection.AscNullsLast
                    }
                }
            ]);
        });
        it('should throw error when aggregate operation is missing', ()=>{
            expect(()=>(0, _getgroupbyorderbyutil.getGroupByOrderBy)({
                    graphOrderBy: _graphorderbyenum.GraphOrderBy.VALUE_ASC,
                    groupByFieldMetadata,
                    aggregateFieldMetadata,
                    ...emptyMetadataMaps
                })).toThrow('Aggregate operation or field metadata not found (field: status)');
        });
        it('should throw error when aggregate field metadata is missing', ()=>{
            expect(()=>(0, _getgroupbyorderbyutil.getGroupByOrderBy)({
                    graphOrderBy: _graphorderbyenum.GraphOrderBy.VALUE_ASC,
                    groupByFieldMetadata,
                    aggregateOperation: _types.AggregateOperations.SUM,
                    ...emptyMetadataMaps
                })).toThrow('Aggregate operation or field metadata not found (field: status)');
        });
    });
    describe('VALUE_DESC', ()=>{
        it('should return aggregate order by descending', ()=>{
            const result = (0, _getgroupbyorderbyutil.getGroupByOrderBy)({
                graphOrderBy: _graphorderbyenum.GraphOrderBy.VALUE_DESC,
                groupByFieldMetadata,
                aggregateOperation: _types.AggregateOperations.COUNT,
                aggregateFieldMetadata,
                ...emptyMetadataMaps
            });
            expect(result).toEqual([
                {
                    aggregate: {
                        totalCount: _types.OrderByDirection.DescNullsLast
                    }
                }
            ]);
        });
        it('should handle different aggregate operations', ()=>{
            const result = (0, _getgroupbyorderbyutil.getGroupByOrderBy)({
                graphOrderBy: _graphorderbyenum.GraphOrderBy.VALUE_DESC,
                groupByFieldMetadata,
                aggregateOperation: _types.AggregateOperations.AVG,
                aggregateFieldMetadata,
                ...emptyMetadataMaps
            });
            expect(result).toEqual([
                {
                    aggregate: {
                        avgAmount: _types.OrderByDirection.DescNullsLast
                    }
                }
            ]);
        });
    });
    describe('FIELD_POSITION_ASC', ()=>{
        it('should return undefined', ()=>{
            const result = (0, _getgroupbyorderbyutil.getGroupByOrderBy)({
                graphOrderBy: _graphorderbyenum.GraphOrderBy.FIELD_POSITION_ASC,
                groupByFieldMetadata,
                ...emptyMetadataMaps
            });
            expect(result).toBeUndefined();
        });
    });
    describe('FIELD_POSITION_DESC', ()=>{
        it('should return undefined', ()=>{
            const result = (0, _getgroupbyorderbyutil.getGroupByOrderBy)({
                graphOrderBy: _graphorderbyenum.GraphOrderBy.FIELD_POSITION_DESC,
                groupByFieldMetadata,
                ...emptyMetadataMaps
            });
            expect(result).toBeUndefined();
        });
    });
    describe('MANUAL', ()=>{
        it('should return undefined', ()=>{
            const result = (0, _getgroupbyorderbyutil.getGroupByOrderBy)({
                graphOrderBy: _graphorderbyenum.GraphOrderBy.MANUAL,
                groupByFieldMetadata,
                ...emptyMetadataMaps
            });
            expect(result).toBeUndefined();
        });
    });
    describe('with subFieldName', ()=>{
        it('should handle composite field with subFieldName', ()=>{
            const compositeFieldMetadata = createMockFieldMetadata({
                name: 'name',
                type: _types.FieldMetadataType.FULL_NAME
            });
            const result = (0, _getgroupbyorderbyutil.getGroupByOrderBy)({
                graphOrderBy: _graphorderbyenum.GraphOrderBy.FIELD_ASC,
                groupByFieldMetadata: compositeFieldMetadata,
                groupBySubFieldName: 'firstName',
                ...emptyMetadataMaps
            });
            expect(result).toEqual([
                {
                    name: {
                        firstName: _types.OrderByDirection.AscNullsLast
                    }
                }
            ]);
        });
        it('should handle relation field with subFieldName', ()=>{
            const relationFieldMetadata = createMockFieldMetadata({
                name: 'company',
                type: _types.FieldMetadataType.RELATION,
                relationTargetObjectMetadataId: 'target-id'
            });
            const result = (0, _getgroupbyorderbyutil.getGroupByOrderBy)({
                graphOrderBy: _graphorderbyenum.GraphOrderBy.FIELD_DESC,
                groupByFieldMetadata: relationFieldMetadata,
                groupBySubFieldName: 'name',
                ...emptyMetadataMaps
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
    describe('with bare relation field', ()=>{
        it('should order by the target label identifier then id', ()=>{
            const targetNameField = createMockFieldMetadata({
                id: 'target-name-field-id',
                name: 'name',
                type: _types.FieldMetadataType.TEXT,
                universalIdentifier: 'target-name-universal-id'
            });
            const targetObjectMetadata = {
                id: 'target-object-id',
                nameSingular: 'company',
                namePlural: 'companies',
                labelIdentifierFieldMetadataId: targetNameField.id,
                universalIdentifier: 'target-object-universal-id'
            };
            const relationFieldMetadata = createMockFieldMetadata({
                name: 'company',
                type: _types.FieldMetadataType.RELATION,
                relationTargetObjectMetadataId: targetObjectMetadata.id
            });
            const result = (0, _getgroupbyorderbyutil.getGroupByOrderBy)({
                graphOrderBy: _graphorderbyenum.GraphOrderBy.FIELD_ASC,
                groupByFieldMetadata: relationFieldMetadata,
                flatObjectMetadataMaps: {
                    byUniversalIdentifier: {
                        [targetObjectMetadata.universalIdentifier]: targetObjectMetadata
                    },
                    universalIdentifierById: {
                        [targetObjectMetadata.id]: targetObjectMetadata.universalIdentifier
                    },
                    universalIdentifiersByApplicationId: {}
                },
                flatFieldMetadataMaps: {
                    byUniversalIdentifier: {
                        [targetNameField.universalIdentifier]: targetNameField
                    },
                    universalIdentifierById: {
                        [targetNameField.id]: targetNameField.universalIdentifier
                    },
                    universalIdentifiersByApplicationId: {}
                }
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
    });
});

//# sourceMappingURL=get-group-by-order-by.util.spec.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _convertchartfiltertogqloperationfilterutil = require("../convert-chart-filter-to-gql-operation-filter.util");
const userTimezone = 'Europe/Paris';
const currentWorkspaceMemberId = 'd9f0e9c0-1a3b-4f6f-9c1f-7b1d6a2c8b11';
const createdByFieldMetadata = {
    id: 'created-by-field-id',
    name: 'createdBy',
    type: _types.FieldMetadataType.RELATION,
    universalIdentifier: 'created-by-universal-id',
    relationTargetObjectMetadataId: 'workspace-member-object-id'
};
const flatFieldMetadataMaps = {
    byUniversalIdentifier: {
        [createdByFieldMetadata.universalIdentifier]: createdByFieldMetadata
    },
    universalIdentifierById: {
        [createdByFieldMetadata.id]: createdByFieldMetadata.universalIdentifier
    },
    universalIdentifiersByApplicationId: {}
};
describe('convertChartFilterToGqlOperationFilter', ()=>{
    it('returns an empty filter when no filter is provided', ()=>{
        const result = (0, _convertchartfiltertogqloperationfilterutil.convertChartFilterToGqlOperationFilter)({
            filter: undefined,
            flatFieldMetadataMaps,
            userTimezone
        });
        expect(result).toEqual({});
    });
    it('forwards currentWorkspaceMemberId so the "me" filter resolves to the current workspace member', ()=>{
        const filter = {
            recordFilters: [
                {
                    fieldMetadataId: createdByFieldMetadata.id,
                    operand: _types.ViewFilterOperand.IS,
                    value: JSON.stringify({
                        isCurrentWorkspaceMemberSelected: true,
                        selectedRecordIds: []
                    }),
                    type: _types.FieldMetadataType.RELATION
                }
            ]
        };
        const result = (0, _convertchartfiltertogqloperationfilterutil.convertChartFilterToGqlOperationFilter)({
            filter,
            flatFieldMetadataMaps,
            userTimezone,
            currentWorkspaceMemberId
        });
        expect(result).toEqual({
            [`${createdByFieldMetadata.name}Id`]: {
                in: [
                    currentWorkspaceMemberId
                ]
            }
        });
    });
    it('discards a "me" filter when no currentWorkspaceMemberId is provided', ()=>{
        const filter = {
            recordFilters: [
                {
                    fieldMetadataId: createdByFieldMetadata.id,
                    operand: _types.ViewFilterOperand.IS,
                    value: JSON.stringify({
                        isCurrentWorkspaceMemberSelected: true,
                        selectedRecordIds: []
                    }),
                    type: _types.FieldMetadataType.RELATION
                }
            ]
        };
        const result = (0, _convertchartfiltertogqloperationfilterutil.convertChartFilterToGqlOperationFilter)({
            filter,
            flatFieldMetadataMaps,
            userTimezone
        });
        expect(result).toEqual({});
    });
});

//# sourceMappingURL=convert-chart-filter-to-gql-operation-filter.util.spec.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _buildorderbycolumnstoselect = require("../build-order-by-columns-to-select");
const buildMockField = (id, name, type, overrides = {})=>({
        id,
        universalIdentifier: id,
        name,
        type,
        objectMetadataId: 'obj-id',
        workspaceId: 'ws-id',
        label: name,
        isNullable: true,
        ...overrides
    });
const closeDateField = buildMockField('closedate-id', 'closeDate', _types.FieldMetadataType.DATE_TIME);
const fullNameField = buildMockField('fullname-id', 'name', _types.FieldMetadataType.FULL_NAME);
const companyField = buildMockField('company-id', 'company', _types.FieldMetadataType.RELATION, {
    settings: {
        relationType: _types.RelationType.MANY_TO_ONE
    }
});
const ownerField = buildMockField('owner-id', 'owner', _types.FieldMetadataType.MORPH_RELATION, {
    settings: {
        relationType: _types.RelationType.MANY_TO_ONE
    }
});
const flatFieldMetadataMaps = {
    byUniversalIdentifier: {
        'closedate-id': closeDateField,
        'fullname-id': fullNameField,
        'company-id': companyField,
        'owner-id': ownerField
    },
    universalIdentifierById: {
        'closedate-id': 'closedate-id',
        'fullname-id': 'fullname-id',
        'company-id': 'company-id',
        'owner-id': 'owner-id'
    },
    universalIdentifiersByApplicationId: {}
};
const flatObjectMetadata = {
    id: 'obj-id',
    universalIdentifier: 'obj-id',
    nameSingular: 'opportunity',
    fieldIds: [
        'closedate-id',
        'fullname-id',
        'company-id',
        'owner-id'
    ]
};
describe('buildOrderByColumnsToSelect', ()=>{
    it('should select the column of a scalar orderBy field', ()=>{
        const result = (0, _buildorderbycolumnstoselect.buildOrderByColumnsToSelect)({
            orderBy: [
                {
                    closeDate: _types.OrderByDirection.AscNullsLast
                }
            ],
            flatObjectMetadata,
            flatFieldMetadataMaps
        });
        expect(result).toEqual({
            closeDate: true
        });
    });
    it('should expand composite orderBy fields to their flat sub-field columns', ()=>{
        const result = (0, _buildorderbycolumnstoselect.buildOrderByColumnsToSelect)({
            orderBy: [
                {
                    name: {
                        firstName: _types.OrderByDirection.AscNullsLast,
                        lastName: _types.OrderByDirection.DescNullsLast
                    }
                }
            ],
            flatObjectMetadata,
            flatFieldMetadataMaps
        });
        expect(result).toEqual({
            nameFirstName: true,
            nameLastName: true
        });
    });
    it('should skip relation orderBy fields accessed by relation name', ()=>{
        const result = (0, _buildorderbycolumnstoselect.buildOrderByColumnsToSelect)({
            orderBy: [
                {
                    company: {
                        name: _types.OrderByDirection.AscNullsLast
                    }
                },
                {
                    closeDate: _types.OrderByDirection.AscNullsLast
                }
            ],
            flatObjectMetadata,
            flatFieldMetadataMaps
        });
        expect(result).toEqual({
            closeDate: true
        });
    });
    it('should skip morph relation orderBy fields like relation ones', ()=>{
        const result = (0, _buildorderbycolumnstoselect.buildOrderByColumnsToSelect)({
            orderBy: [
                {
                    owner: {
                        name: _types.OrderByDirection.AscNullsLast
                    }
                },
                {
                    closeDate: _types.OrderByDirection.AscNullsLast
                }
            ],
            flatObjectMetadata,
            flatFieldMetadataMaps
        });
        expect(result).toEqual({
            closeDate: true
        });
    });
    it('should select the join column when ordering by the foreign key', ()=>{
        const result = (0, _buildorderbycolumnstoselect.buildOrderByColumnsToSelect)({
            orderBy: [
                {
                    companyId: _types.OrderByDirection.AscNullsLast
                }
            ],
            flatObjectMetadata,
            flatFieldMetadataMaps
        });
        expect(result).toEqual({
            companyId: true
        });
    });
    it('should skip unknown fields and handle undefined orderBy', ()=>{
        expect((0, _buildorderbycolumnstoselect.buildOrderByColumnsToSelect)({
            orderBy: [
                {
                    unknownField: _types.OrderByDirection.AscNullsLast
                }
            ],
            flatObjectMetadata,
            flatFieldMetadataMaps
        })).toEqual({});
        expect((0, _buildorderbycolumnstoselect.buildOrderByColumnsToSelect)({
            orderBy: undefined,
            flatObjectMetadata,
            flatFieldMetadataMaps
        })).toEqual({});
    });
});

//# sourceMappingURL=build-order-by-columns-to-select.spec.js.map
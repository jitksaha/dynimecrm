"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _graphqlqueryorderparser = require("../graphql-query-order.parser");
describe('GraphqlQueryOrderFieldParser', ()=>{
    const workspaceId = 'workspace-id';
    const objectMetadataId = 'object-id';
    const createMockField = (overrides)=>({
            workspaceId,
            objectMetadataId,
            isNullable: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            universalIdentifier: overrides.id,
            label: overrides.name,
            ...overrides
        });
    const closeDateField = createMockField({
        id: 'closedate-id',
        type: _types.FieldMetadataType.DATE_TIME,
        name: 'closeDate'
    });
    const stageField = createMockField({
        id: 'stage-id',
        type: _types.FieldMetadataType.TEXT,
        name: 'stage'
    });
    const fullNameField = createMockField({
        id: 'fullname-id',
        type: _types.FieldMetadataType.FULL_NAME,
        name: 'fullName'
    });
    const companyField = createMockField({
        id: 'company-id',
        type: _types.FieldMetadataType.RELATION,
        name: 'company',
        relationTargetObjectMetadataId: 'company-object-id',
        settings: {
            relationType: 'MANY_TO_ONE',
            joinColumnName: 'companyId'
        }
    });
    const companyNameField = createMockField({
        id: 'company-name-id',
        type: _types.FieldMetadataType.TEXT,
        name: 'name',
        objectMetadataId: 'company-object-id'
    });
    const companyContactNameField = createMockField({
        id: 'company-contactname-id',
        type: _types.FieldMetadataType.FULL_NAME,
        name: 'contactName',
        objectMetadataId: 'company-object-id'
    });
    const rootFields = [
        closeDateField,
        stageField,
        fullNameField,
        companyField
    ];
    const fields = [
        ...rootFields,
        companyNameField,
        companyContactNameField
    ];
    const flatFieldMetadataMaps = {
        byUniversalIdentifier: Object.fromEntries(fields.map((field)=>[
                field.universalIdentifier,
                field
            ])),
        universalIdentifierById: Object.fromEntries(fields.map((field)=>[
                field.id,
                field.universalIdentifier
            ])),
        universalIdentifiersByApplicationId: {}
    };
    const flatObjectMetadata = {
        id: objectMetadataId,
        workspaceId,
        nameSingular: 'opportunity',
        fieldIds: rootFields.map((field)=>field.id)
    };
    const companyObjectMetadata = {
        id: 'company-object-id',
        universalIdentifier: 'company-object-id',
        workspaceId,
        nameSingular: 'company',
        fieldIds: [
            'company-name-id',
            'company-contactname-id'
        ]
    };
    const flatObjectMetadataMaps = {
        byUniversalIdentifier: {
            [objectMetadataId]: flatObjectMetadata,
            'company-object-id': companyObjectMetadata
        },
        universalIdentifierById: {
            [objectMetadataId]: objectMetadataId,
            'company-object-id': 'company-object-id'
        },
        universalIdentifiersByApplicationId: {}
    };
    const parser = new _graphqlqueryorderparser.GraphqlQueryOrderFieldParser(flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps);
    it('should compile scalar, composite and relation leaves to their columns', ()=>{
        const result = parser.parse([
            {
                closeDate: _types.OrderByDirection.DescNullsLast
            },
            {
                fullName: {
                    firstName: _types.OrderByDirection.AscNullsLast
                }
            },
            {
                company: {
                    name: _types.OrderByDirection.AscNullsLast
                }
            }
        ], 'opportunity');
        expect(result.orderBy).toEqual({
            'opportunity.closeDate': {
                order: 'DESC',
                nulls: 'NULLS LAST',
                useLower: false,
                castToText: false
            },
            'opportunity.fullNameFirstName': {
                order: 'ASC',
                nulls: 'NULLS LAST',
                useLower: true,
                castToText: false
            },
            'company.name': {
                order: 'ASC',
                nulls: 'NULLS LAST',
                useLower: true,
                castToText: false
            }
        });
        expect(result.relationJoins).toEqual([
            {
                joinAlias: 'company'
            }
        ]);
    });
    it('should compile a composite target field of a relation onto the join alias', ()=>{
        const result = parser.parse([
            {
                company: {
                    contactName: {
                        firstName: _types.OrderByDirection.AscNullsLast
                    }
                }
            },
            {
                company: {
                    contactName: {
                        lastName: _types.OrderByDirection.AscNullsLast
                    }
                }
            }
        ], 'opportunity');
        expect(Object.keys(result.orderBy)).toEqual([
            'company.contactNameFirstName',
            'company.contactNameLastName'
        ]);
        // Two leaves through the same relation share one join
        expect(result.relationJoins).toEqual([
            {
                joinAlias: 'company'
            }
        ]);
    });
    it('should treat a join column access as a scalar of the root object', ()=>{
        const result = parser.parse([
            {
                companyId: _types.OrderByDirection.AscNullsFirst
            }
        ], 'opportunity');
        expect(result.orderBy).toEqual({
            'opportunity.companyId': {
                order: 'ASC',
                nulls: 'NULLS FIRST',
                useLower: false,
                castToText: false
            }
        });
        expect(result.relationJoins).toEqual([]);
    });
    it('should reverse direction and NULLS placement for backward pagination', ()=>{
        const result = parser.parse([
            {
                stage: _types.OrderByDirection.AscNullsLast
            }
        ], 'opportunity', false);
        expect(result.orderBy['opportunity.stage']).toMatchObject({
            order: 'DESC',
            nulls: 'NULLS FIRST'
        });
    });
    it('should keep the first direction when the same field is ordered twice', ()=>{
        const result = parser.parse([
            {
                stage: _types.OrderByDirection.AscNullsLast
            },
            {
                stage: _types.OrderByDirection.DescNullsFirst
            }
        ], 'opportunity');
        expect(result.orderBy['opportunity.stage']).toMatchObject({
            order: 'ASC',
            nulls: 'NULLS LAST'
        });
    });
    it('should reject ordering by a field the role cannot read', ()=>{
        expect(()=>parser.parse([
                {
                    stage: _types.OrderByDirection.AscNullsLast
                }
            ], 'opportunity', true, {
                [objectMetadataId]: {
                    restrictedFields: {
                        'stage-id': {
                            canRead: false
                        }
                    }
                }
            })).toThrow('does not have permission');
    });
    it('should reject unknown fields', ()=>{
        expect(()=>parser.parse([
                {
                    unknownField: _types.OrderByDirection.AscNullsLast
                }
            ], 'opportunity')).toThrow('does not exist or is not sortable');
    });
});

//# sourceMappingURL=graphql-query-order.parser.spec.js.map
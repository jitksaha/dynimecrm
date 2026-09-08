"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _getobjectaliasforgroupbyutil = require("../../../../../common/common-query-runners/utils/get-object-alias-for-group-by.util");
const _graphqlqueryordergroupbyparser = require("../graphql-query-order-group-by.parser");
const _getflatfieldmetadatamock = require("../../../../../../metadata-modules/flat-field-metadata/__mocks__/get-flat-field-metadata.mock");
const _getflatobjectmetadatamock = require("../../../../../../metadata-modules/flat-object-metadata/__mocks__/get-flat-object-metadata.mock");
const _computeobjecttargettableutil = require("../../../../../../utils/compute-object-target-table.util");
// The query builder aliases the FROM table with `getObjectAlias` (= nameSingular),
// NOT the physical table name (which is `_`-prefixed for custom objects via
// `computeObjectTargetTable`). These tests pin order-by clauses to that alias so the
// parser stays in sync if the alias convention ever changes.
describe('GraphqlQueryOrderGroupByParser - object alias in order-by clauses', ()=>{
    const OBJECT_ID = 'rocket-object-id';
    const OBJECT_UNIVERSAL_ID = 'rocket-object-universal-id';
    const NAME_FIELD_ID = 'rocket-name-field-id';
    const NAME_FIELD_UNIVERSAL_ID = 'rocket-name-field-universal-id';
    const DATE_FIELD_ID = 'rocket-launched-at-field-id';
    const DATE_FIELD_UNIVERSAL_ID = 'rocket-launched-at-field-universal-id';
    const nameField = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
        universalIdentifier: NAME_FIELD_UNIVERSAL_ID,
        objectMetadataId: OBJECT_ID,
        type: _types.FieldMetadataType.TEXT,
        id: NAME_FIELD_ID,
        name: 'name'
    });
    const launchedAtField = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
        universalIdentifier: DATE_FIELD_UNIVERSAL_ID,
        objectMetadataId: OBJECT_ID,
        type: _types.FieldMetadataType.DATE,
        id: DATE_FIELD_ID,
        name: 'launchedAt'
    });
    // Custom object: physical table is `_rocket`, while the alias is `rocket`.
    const flatObjectMetadata = (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
        universalIdentifier: OBJECT_UNIVERSAL_ID,
        id: OBJECT_ID,
        nameSingular: 'rocket',
        namePlural: 'rockets',
        isCustom: true,
        fieldIds: [
            NAME_FIELD_ID,
            DATE_FIELD_ID
        ]
    });
    const flatFieldMetadataMaps = {
        byUniversalIdentifier: {
            [NAME_FIELD_UNIVERSAL_ID]: nameField,
            [DATE_FIELD_UNIVERSAL_ID]: launchedAtField
        },
        universalIdentifierById: {
            [NAME_FIELD_ID]: NAME_FIELD_UNIVERSAL_ID,
            [DATE_FIELD_ID]: DATE_FIELD_UNIVERSAL_ID
        },
        universalIdentifiersByApplicationId: {}
    };
    const flatObjectMetadataMaps = {
        byUniversalIdentifier: {
            [OBJECT_UNIVERSAL_ID]: flatObjectMetadata
        },
        universalIdentifierById: {
            [OBJECT_ID]: OBJECT_UNIVERSAL_ID
        },
        universalIdentifiersByApplicationId: {}
    };
    const objectAlias = (0, _getobjectaliasforgroupbyutil.getObjectAlias)(flatObjectMetadata);
    const physicalTableName = (0, _computeobjecttargettableutil.computeObjectTargetTable)(flatObjectMetadata);
    const buildParser = ()=>new _graphqlqueryordergroupbyparser.GraphqlQueryOrderGroupByParser(flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps);
    it('uses the object alias as the table prefix for a custom object', ()=>{
        // Guards the assumption being tested: a custom object has a `_`-prefixed
        // physical table that is different from its query alias.
        expect(physicalTableName).toBe('_rocket');
        expect(objectAlias).toBe('rocket');
        expect(physicalTableName).not.toBe(objectAlias);
    });
    it('prefixes a scalar group-by order-by with the alias, not the physical table', ()=>{
        const parser = buildParser();
        const groupByField = {
            fieldMetadata: nameField
        };
        const result = parser.parse({
            orderBy: [
                {
                    name: _types.OrderByDirection.AscNullsFirst
                }
            ],
            groupByFields: [
                groupByField
            ]
        });
        expect(result).toHaveLength(1);
        const orderByKey = Object.keys(result[0])[0];
        expect(orderByKey).toBe(`"${objectAlias}"."name"`);
        expect(orderByKey).not.toContain(physicalTableName);
    });
    it('prefixes a date-granularity group-by order-by with the alias, not the physical table', ()=>{
        const parser = buildParser();
        const groupByField = {
            fieldMetadata: launchedAtField,
            dateGranularity: _types.ObjectRecordGroupByDateGranularity.NONE
        };
        const result = parser.parse({
            orderBy: [
                {
                    launchedAt: {
                        orderBy: _types.OrderByDirection.AscNullsFirst,
                        granularity: _types.ObjectRecordGroupByDateGranularity.NONE
                    }
                }
            ],
            groupByFields: [
                groupByField
            ]
        });
        expect(result).toHaveLength(1);
        const orderByKey = Object.keys(result[0])[0];
        expect(orderByKey).toContain(`"${objectAlias}".`);
        expect(orderByKey).not.toContain(physicalTableName);
    });
});
describe('GraphqlQueryOrderGroupByParser - relation order-by under target primary key group-by', ()=>{
    const SOURCE_OBJECT_ID = 'person-object-id';
    const SOURCE_OBJECT_UNIVERSAL_ID = 'person-object-universal-id';
    const COMPANY_RELATION_FIELD_ID = 'person-company-field-id';
    const COMPANY_RELATION_FIELD_UNIVERSAL_ID = 'person-company-field-universal-id';
    const MEMBER_RELATION_FIELD_ID = 'person-member-field-id';
    const MEMBER_RELATION_FIELD_UNIVERSAL_ID = 'person-member-field-universal-id';
    const COMPANY_OBJECT_ID = 'company-object-id';
    const COMPANY_OBJECT_UNIVERSAL_ID = 'company-object-universal-id';
    const COMPANY_ID_FIELD_ID = 'company-id-field-id';
    const COMPANY_ID_FIELD_UNIVERSAL_ID = 'company-id-field-universal-id';
    const COMPANY_NAME_FIELD_ID = 'company-name-field-id';
    const COMPANY_NAME_FIELD_UNIVERSAL_ID = 'company-name-field-universal-id';
    const COMPANY_OWNER_FIELD_ID = 'company-owner-field-id';
    const COMPANY_OWNER_FIELD_UNIVERSAL_ID = 'company-owner-field-universal-id';
    const MEMBER_OBJECT_ID = 'member-object-id';
    const MEMBER_OBJECT_UNIVERSAL_ID = 'member-object-universal-id';
    const MEMBER_ID_FIELD_ID = 'member-id-field-id';
    const MEMBER_ID_FIELD_UNIVERSAL_ID = 'member-id-field-universal-id';
    const MEMBER_NAME_FIELD_ID = 'member-name-field-id';
    const MEMBER_NAME_FIELD_UNIVERSAL_ID = 'member-name-field-universal-id';
    const companyRelationField = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
        universalIdentifier: COMPANY_RELATION_FIELD_UNIVERSAL_ID,
        objectMetadataId: SOURCE_OBJECT_ID,
        type: _types.FieldMetadataType.RELATION,
        id: COMPANY_RELATION_FIELD_ID,
        name: 'company',
        relationTargetObjectMetadataId: COMPANY_OBJECT_ID,
        settings: {
            relationType: _types.RelationType.MANY_TO_ONE,
            joinColumnName: 'companyId'
        }
    });
    const memberRelationField = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
        universalIdentifier: MEMBER_RELATION_FIELD_UNIVERSAL_ID,
        objectMetadataId: SOURCE_OBJECT_ID,
        type: _types.FieldMetadataType.RELATION,
        id: MEMBER_RELATION_FIELD_ID,
        name: 'member',
        relationTargetObjectMetadataId: MEMBER_OBJECT_ID,
        settings: {
            relationType: _types.RelationType.MANY_TO_ONE,
            joinColumnName: 'memberId'
        }
    });
    const companyIdField = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
        universalIdentifier: COMPANY_ID_FIELD_UNIVERSAL_ID,
        objectMetadataId: COMPANY_OBJECT_ID,
        type: _types.FieldMetadataType.UUID,
        id: COMPANY_ID_FIELD_ID,
        name: 'id'
    });
    const companyNameField = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
        universalIdentifier: COMPANY_NAME_FIELD_UNIVERSAL_ID,
        objectMetadataId: COMPANY_OBJECT_ID,
        type: _types.FieldMetadataType.TEXT,
        id: COMPANY_NAME_FIELD_ID,
        name: 'name'
    });
    const companyOwnerField = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
        universalIdentifier: COMPANY_OWNER_FIELD_UNIVERSAL_ID,
        objectMetadataId: COMPANY_OBJECT_ID,
        type: _types.FieldMetadataType.RELATION,
        id: COMPANY_OWNER_FIELD_ID,
        name: 'owner',
        relationTargetObjectMetadataId: MEMBER_OBJECT_ID,
        settings: {
            relationType: _types.RelationType.MANY_TO_ONE,
            joinColumnName: 'ownerId'
        }
    });
    const memberIdField = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
        universalIdentifier: MEMBER_ID_FIELD_UNIVERSAL_ID,
        objectMetadataId: MEMBER_OBJECT_ID,
        type: _types.FieldMetadataType.UUID,
        id: MEMBER_ID_FIELD_ID,
        name: 'id'
    });
    const memberNameField = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
        universalIdentifier: MEMBER_NAME_FIELD_UNIVERSAL_ID,
        objectMetadataId: MEMBER_OBJECT_ID,
        type: _types.FieldMetadataType.FULL_NAME,
        id: MEMBER_NAME_FIELD_ID,
        name: 'name'
    });
    const sourceObjectMetadata = (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
        universalIdentifier: SOURCE_OBJECT_UNIVERSAL_ID,
        id: SOURCE_OBJECT_ID,
        nameSingular: 'person',
        namePlural: 'people',
        fieldIds: [
            COMPANY_RELATION_FIELD_ID,
            MEMBER_RELATION_FIELD_ID
        ]
    });
    const companyObjectMetadata = (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
        universalIdentifier: COMPANY_OBJECT_UNIVERSAL_ID,
        id: COMPANY_OBJECT_ID,
        nameSingular: 'company',
        namePlural: 'companies',
        fieldIds: [
            COMPANY_ID_FIELD_ID,
            COMPANY_NAME_FIELD_ID,
            COMPANY_OWNER_FIELD_ID
        ]
    });
    const memberObjectMetadata = (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
        universalIdentifier: MEMBER_OBJECT_UNIVERSAL_ID,
        id: MEMBER_OBJECT_ID,
        nameSingular: 'member',
        namePlural: 'members',
        fieldIds: [
            MEMBER_ID_FIELD_ID,
            MEMBER_NAME_FIELD_ID
        ]
    });
    const flatFieldMetadataMaps = {
        byUniversalIdentifier: {
            [COMPANY_RELATION_FIELD_UNIVERSAL_ID]: companyRelationField,
            [MEMBER_RELATION_FIELD_UNIVERSAL_ID]: memberRelationField,
            [COMPANY_ID_FIELD_UNIVERSAL_ID]: companyIdField,
            [COMPANY_NAME_FIELD_UNIVERSAL_ID]: companyNameField,
            [COMPANY_OWNER_FIELD_UNIVERSAL_ID]: companyOwnerField,
            [MEMBER_ID_FIELD_UNIVERSAL_ID]: memberIdField,
            [MEMBER_NAME_FIELD_UNIVERSAL_ID]: memberNameField
        },
        universalIdentifierById: {
            [COMPANY_RELATION_FIELD_ID]: COMPANY_RELATION_FIELD_UNIVERSAL_ID,
            [MEMBER_RELATION_FIELD_ID]: MEMBER_RELATION_FIELD_UNIVERSAL_ID,
            [COMPANY_ID_FIELD_ID]: COMPANY_ID_FIELD_UNIVERSAL_ID,
            [COMPANY_NAME_FIELD_ID]: COMPANY_NAME_FIELD_UNIVERSAL_ID,
            [COMPANY_OWNER_FIELD_ID]: COMPANY_OWNER_FIELD_UNIVERSAL_ID,
            [MEMBER_ID_FIELD_ID]: MEMBER_ID_FIELD_UNIVERSAL_ID,
            [MEMBER_NAME_FIELD_ID]: MEMBER_NAME_FIELD_UNIVERSAL_ID
        },
        universalIdentifiersByApplicationId: {}
    };
    const flatObjectMetadataMaps = {
        byUniversalIdentifier: {
            [SOURCE_OBJECT_UNIVERSAL_ID]: sourceObjectMetadata,
            [COMPANY_OBJECT_UNIVERSAL_ID]: companyObjectMetadata,
            [MEMBER_OBJECT_UNIVERSAL_ID]: memberObjectMetadata
        },
        universalIdentifierById: {
            [SOURCE_OBJECT_ID]: SOURCE_OBJECT_UNIVERSAL_ID,
            [COMPANY_OBJECT_ID]: COMPANY_OBJECT_UNIVERSAL_ID,
            [MEMBER_OBJECT_ID]: MEMBER_OBJECT_UNIVERSAL_ID
        },
        universalIdentifiersByApplicationId: {}
    };
    const groupByCompanyId = {
        fieldMetadata: companyRelationField,
        nestedFieldMetadata: companyIdField
    };
    const groupByMemberId = {
        fieldMetadata: memberRelationField,
        nestedFieldMetadata: memberIdField
    };
    const buildParser = ()=>new _graphqlqueryordergroupbyparser.GraphqlQueryOrderGroupByParser(sourceObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps);
    it('orders by a target scalar field when grouping by the target id', ()=>{
        const parser = buildParser();
        const result = parser.parse({
            orderBy: [
                {
                    company: {
                        name: _types.OrderByDirection.AscNullsLast
                    }
                }
            ],
            groupByFields: [
                groupByCompanyId
            ]
        });
        expect(result).toEqual([
            {
                '"company"."name"': {
                    order: 'ASC',
                    nulls: 'NULLS LAST'
                }
            }
        ]);
    });
    it('orders by FULL_NAME subfields when grouping by the target id', ()=>{
        const parser = buildParser();
        const result = parser.parse({
            orderBy: [
                {
                    member: {
                        name: {
                            firstName: _types.OrderByDirection.AscNullsLast
                        }
                    }
                },
                {
                    member: {
                        name: {
                            lastName: _types.OrderByDirection.AscNullsLast
                        }
                    }
                }
            ],
            groupByFields: [
                groupByMemberId
            ]
        });
        expect(result).toEqual([
            {
                '"member"."nameFirstName"': {
                    order: 'ASC',
                    nulls: 'NULLS LAST'
                }
            },
            {
                '"member"."nameLastName"': {
                    order: 'ASC',
                    nulls: 'NULLS LAST'
                }
            }
        ]);
    });
    it('still orders by the exact nested field present in groupBy', ()=>{
        const parser = buildParser();
        const groupByCompanyName = {
            fieldMetadata: companyRelationField,
            nestedFieldMetadata: companyNameField
        };
        const result = parser.parse({
            orderBy: [
                {
                    company: {
                        name: _types.OrderByDirection.DescNullsLast
                    }
                }
            ],
            groupByFields: [
                groupByCompanyName
            ]
        });
        expect(result).toEqual([
            {
                '"company"."name"': {
                    order: 'DESC',
                    nulls: 'NULLS LAST'
                }
            }
        ]);
    });
    it('throws when ordering by a relation absent from groupBy', ()=>{
        const parser = buildParser();
        expect(()=>parser.parse({
                orderBy: [
                    {
                        member: {
                            name: {
                                firstName: _types.OrderByDirection.AscNullsLast
                            }
                        }
                    }
                ],
                groupByFields: [
                    groupByCompanyId
                ]
            })).toThrow('Cannot order by a relation field that is not in groupBy criteria: member.name');
    });
    it('throws when ordering by an unknown composite subfield under target id group-by', ()=>{
        const parser = buildParser();
        expect(()=>parser.parse({
                orderBy: [
                    {
                        member: {
                            name: {
                                unknownSubField: _types.OrderByDirection.AscNullsLast
                            }
                        }
                    }
                ],
                groupByFields: [
                    groupByMemberId
                ]
            })).toThrow('Composite subfield "unknownSubField" is not orderable for "name"');
    });
    it('throws when ordering by a nested relation field under target id group-by', ()=>{
        const parser = buildParser();
        expect(()=>parser.parse({
                orderBy: [
                    {
                        company: {
                            owner: _types.OrderByDirection.AscNullsLast
                        }
                    }
                ],
                groupByFields: [
                    groupByCompanyId
                ]
            })).toThrow('Cannot order by a relation field that is not in groupBy criteria: company.owner');
    });
});

//# sourceMappingURL=graphql-query-order-group-by.parser.spec.js.map
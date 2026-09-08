"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _graphqlqueryrunnerexception = require("../../graphql/graphql-query-runner/errors/graphql-query-runner.exception");
const _resolveorderbyleavesutils = require("../resolve-order-by-leaves.utils");
describe('resolveOrderByLeaves', ()=>{
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
    const idField = createMockField({
        id: 'id-id',
        type: _types.FieldMetadataType.UUID,
        name: 'id',
        isNullable: false
    });
    const closeDateField = createMockField({
        id: 'closedate-id',
        type: _types.FieldMetadataType.DATE_TIME,
        name: 'closeDate'
    });
    const fullNameField = createMockField({
        id: 'fullname-id',
        type: _types.FieldMetadataType.FULL_NAME,
        name: 'fullName'
    });
    const linksField = createMockField({
        id: 'links-id',
        type: _types.FieldMetadataType.LINKS,
        name: 'domainName'
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
        idField,
        closeDateField,
        fullNameField,
        linksField,
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
    const resolve = (// oxlint-disable-next-line typescript/no-explicit-any
    orderBy, strictValidation = false)=>(0, _resolveorderbyleavesutils.resolveOrderByLeaves)({
            orderBy,
            flatObjectMetadata,
            flatFieldMetadataMaps,
            strictValidation
        });
    const resolveWithObjectMaps = (// oxlint-disable-next-line typescript/no-explicit-any
    orderBy, strictValidation = false)=>(0, _resolveorderbyleavesutils.resolveOrderByLeaves)({
            orderBy,
            flatObjectMetadata,
            flatObjectMetadataMaps,
            flatFieldMetadataMaps,
            strictValidation
        });
    it('should flatten scalar, composite and relation entries into leaves with their own direction', ()=>{
        const leaves = resolve([
            {
                closeDate: _types.OrderByDirection.DescNullsLast
            },
            {
                fullName: {
                    firstName: _types.OrderByDirection.AscNullsLast,
                    lastName: _types.OrderByDirection.DescNullsFirst
                }
            },
            {
                company: {
                    name: _types.OrderByDirection.AscNullsLast
                }
            },
            {
                companyId: _types.OrderByDirection.AscNullsFirst
            }
        ]);
        expect(leaves.map(({ path, direction, kind })=>({
                path,
                direction,
                kind
            }))).toEqual([
            {
                path: [
                    'closeDate'
                ],
                direction: _types.OrderByDirection.DescNullsLast,
                kind: 'scalar'
            },
            {
                path: [
                    'fullName',
                    'firstName'
                ],
                direction: _types.OrderByDirection.AscNullsLast,
                kind: 'composite'
            },
            {
                path: [
                    'fullName',
                    'lastName'
                ],
                direction: _types.OrderByDirection.DescNullsFirst,
                kind: 'composite'
            },
            {
                path: [
                    'company',
                    'name'
                ],
                direction: _types.OrderByDirection.AscNullsLast,
                kind: 'relation'
            },
            {
                path: [
                    'companyId'
                ],
                direction: _types.OrderByDirection.AscNullsFirst,
                kind: 'scalar'
            }
        ]);
    });
    it('should keep the first occurrence when a leaf is duplicated', ()=>{
        const leaves = resolve([
            {
                closeDate: _types.OrderByDirection.AscNullsLast
            },
            {
                closeDate: _types.OrderByDirection.DescNullsFirst
            }
        ]);
        expect(leaves).toHaveLength(1);
        expect(leaves[0].direction).toBe(_types.OrderByDirection.AscNullsLast);
    });
    it('should let a caller-provided id ordering win over the appended tie-breaker', ()=>{
        const leaves = resolve([
            {
                id: _types.OrderByDirection.DescNullsLast
            },
            {
                id: _types.OrderByDirection.AscNullsFirst
            }
        ]);
        expect(leaves).toHaveLength(1);
        expect(leaves[0].direction).toBe(_types.OrderByDirection.DescNullsLast);
    });
    it('should rebuild the canonical orderBy from the leaves', ()=>{
        const leaves = resolve([
            {
                fullName: {
                    firstName: _types.OrderByDirection.AscNullsLast,
                    lastName: _types.OrderByDirection.AscNullsLast
                }
            },
            {
                company: {
                    name: _types.OrderByDirection.DescNullsLast
                }
            },
            {
                id: _types.OrderByDirection.AscNullsFirst
            }
        ]);
        expect((0, _resolveorderbyleavesutils.buildOrderByFromLeaves)(leaves)).toEqual([
            {
                fullName: {
                    firstName: _types.OrderByDirection.AscNullsLast
                }
            },
            {
                fullName: {
                    lastName: _types.OrderByDirection.AscNullsLast
                }
            },
            {
                company: {
                    name: _types.OrderByDirection.DescNullsLast
                }
            },
            {
                id: _types.OrderByDirection.AscNullsFirst
            }
        ]);
    });
    it('should flatten a relation entry ordered by a composite target field', ()=>{
        const leaves = resolve([
            {
                company: {
                    name: {
                        firstName: _types.OrderByDirection.AscNullsLast
                    }
                }
            },
            {
                company: {
                    name: {
                        lastName: _types.OrderByDirection.AscNullsLast
                    }
                }
            }
        ]);
        expect(leaves.map(({ path })=>path)).toEqual([
            [
                'company',
                'name',
                'firstName'
            ],
            [
                'company',
                'name',
                'lastName'
            ]
        ]);
        expect((0, _resolveorderbyleavesutils.buildOrderByFromLeaves)(leaves)).toEqual([
            {
                company: {
                    name: {
                        firstName: _types.OrderByDirection.AscNullsLast
                    }
                }
            },
            {
                company: {
                    name: {
                        lastName: _types.OrderByDirection.AscNullsLast
                    }
                }
            }
        ]);
    });
    it('should skip unknown fields when lenient and throw when strict', ()=>{
        expect(resolve([
            {
                unknownField: _types.OrderByDirection.AscNullsLast
            }
        ])).toEqual([]);
        expect(()=>resolve([
                {
                    unknownField: _types.OrderByDirection.AscNullsLast
                }
            ], true)).toThrow(_graphqlqueryrunnerexception.GraphqlQueryRunnerException);
    });
    it('should reject malformed entries in strict mode', ()=>{
        expect(()=>resolve([
                {
                    closeDate: {
                        nested: 'value'
                    }
                }
            ], true)).toThrow('requires a direction value');
        expect(()=>resolve([
                {
                    fullName: _types.OrderByDirection.AscNullsLast
                }
            ], true)).toThrow('requires subfield ordering');
        expect(()=>resolve([
                {
                    fullName: {
                        unknownSub: _types.OrderByDirection.AscNullsLast
                    }
                }
            ], true)).toThrow('not found for composite field');
        expect(()=>resolve([
                {
                    company: _types.OrderByDirection.AscNullsLast
                }
            ], true)).toThrow('requires nested field ordering');
    });
    it('should exclude RAW_JSON leaves from cursor use', ()=>{
        const leaves = resolve([
            {
                company: {
                    name: _types.OrderByDirection.AscNullsLast
                }
            },
            {
                domainName: {
                    primaryLinkUrl: _types.OrderByDirection.AscNullsLast
                }
            },
            {
                domainName: {
                    secondaryLinks: _types.OrderByDirection.AscNullsLast
                }
            },
            {
                id: _types.OrderByDirection.AscNullsFirst
            }
        ]);
        expect(leaves.filter(_resolveorderbyleavesutils.checkIfLeafCanCarryCursorValue).map(({ path })=>path.join('.'))).toEqual([
            'company.name',
            'domainName.primaryLinkUrl',
            'id'
        ]);
    });
    describe('relation leaf resolution against the target object', ()=>{
        it('should resolve the target field and composite property when object maps are provided', ()=>{
            const [scalarTargetLeaf, compositeTargetLeaf] = resolveWithObjectMaps([
                {
                    company: {
                        name: _types.OrderByDirection.AscNullsLast
                    }
                },
                {
                    company: {
                        contactName: {
                            firstName: _types.OrderByDirection.AscNullsLast
                        }
                    }
                }
            ]);
            expect(scalarTargetLeaf).toMatchObject({
                kind: 'relation',
                path: [
                    'company',
                    'name'
                ],
                targetFieldMetadata: {
                    id: 'company-name-id'
                }
            });
            expect(compositeTargetLeaf).toMatchObject({
                kind: 'relation',
                path: [
                    'company',
                    'contactName',
                    'firstName'
                ],
                targetFieldMetadata: {
                    id: 'company-contactname-id'
                },
                targetCompositeProperty: {
                    name: 'firstName'
                }
            });
        });
        it('should reject unknown or malformed target orderings in strict mode', ()=>{
            expect(()=>resolveWithObjectMaps([
                    {
                        company: {
                            unknownField: _types.OrderByDirection.AscNullsLast
                        }
                    }
                ], true)).toThrow('not found in target object "company"');
            expect(()=>resolveWithObjectMaps([
                    {
                        company: {
                            name: {
                                nested: _types.OrderByDirection.AscNullsLast
                            }
                        }
                    }
                ], true)).toThrow('does not support nested ordering');
            expect(()=>resolveWithObjectMaps([
                    {
                        company: {
                            contactName: {
                                unknownSub: _types.OrderByDirection.AscNullsLast
                            }
                        }
                    }
                ], true)).toThrow('requires one of its sub fields to be ordered');
        });
    });
    describe('field read permissions', ()=>{
        const permissionsRestricting = (fieldMetadataId, objectId)=>({
                [objectId]: {
                    canReadObjectRecords: true,
                    canUpdateObjectRecords: true,
                    canSoftDeleteObjectRecords: true,
                    canDestroyObjectRecords: true,
                    restrictedFields: {
                        [fieldMetadataId]: {
                            canRead: false
                        }
                    }
                }
            });
        it('should reject ordering by a role-restricted root field', ()=>{
            expect(()=>(0, _resolveorderbyleavesutils.resolveOrderByLeaves)({
                    orderBy: [
                        {
                            closeDate: _types.OrderByDirection.AscNullsLast
                        }
                    ],
                    flatObjectMetadata,
                    flatFieldMetadataMaps,
                    objectsPermissions: permissionsRestricting('closedate-id', objectMetadataId)
                })).toThrow('does not have permission');
        });
        it('should reject ordering by a role-restricted relation target field', ()=>{
            expect(()=>(0, _resolveorderbyleavesutils.resolveOrderByLeaves)({
                    orderBy: [
                        {
                            company: {
                                name: _types.OrderByDirection.AscNullsLast
                            }
                        }
                    ],
                    flatObjectMetadata,
                    flatObjectMetadataMaps,
                    flatFieldMetadataMaps,
                    objectsPermissions: permissionsRestricting('company-name-id', 'company-object-id')
                })).toThrow('does not have permission');
        });
    });
    it('should reject a relation entry with no valid nested direction in strict mode', ()=>{
        expect(()=>resolve([
                {
                    company: {
                        name: 5
                    }
                }
            ], true)).toThrow('requires nested field ordering');
    });
    describe('getCursorValueForLeaf', ()=>{
        const firstNameLeaf = resolve([
            {
                fullName: {
                    firstName: _types.OrderByDirection.AscNullsLast
                }
            }
        ])[0];
        it('should read nested values, including null', ()=>{
            expect((0, _resolveorderbyleavesutils.getCursorValueForLeaf)({
                fullName: {
                    firstName: 'Ada'
                }
            }, firstNameLeaf)).toBe('Ada');
            expect((0, _resolveorderbyleavesutils.getCursorValueForLeaf)({
                fullName: {
                    firstName: null
                }
            }, firstNameLeaf)).toBeNull();
            expect((0, _resolveorderbyleavesutils.getCursorValueForLeaf)({}, firstNameLeaf)).toBeUndefined();
        });
        it('should fall back to legacy dotted cursor keys', ()=>{
            expect((0, _resolveorderbyleavesutils.getCursorValueForLeaf)({
                'fullName.firstName': 'Ada'
            }, firstNameLeaf)).toBe('Ada');
        });
    });
});

//# sourceMappingURL=resolve-order-by-leaves.utils.spec.js.map
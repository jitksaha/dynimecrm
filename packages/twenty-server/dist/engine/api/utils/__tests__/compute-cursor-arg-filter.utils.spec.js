"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _graphqlqueryrunnerexception = require("../../graphql/graphql-query-runner/errors/graphql-query-runner.exception");
const _computecursorargfilterutils = require("../compute-cursor-arg-filter.utils");
describe('computeCursorArgFilter', ()=>{
    const workspaceId = 'workspace-id';
    const objectMetadataId = 'object-id';
    const createMockField = (overrides)=>({
            workspaceId,
            objectMetadataId,
            isNullable: true,
            isLabelSyncedWithName: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            universalIdentifier: overrides.id,
            viewFieldIds: [],
            viewFilterIds: [],
            kanbanAggregateOperationViewIds: [],
            calendarViewIds: [],
            applicationId: null,
            label: overrides.name,
            ...overrides
        });
    const nameField = createMockField({
        id: 'name-id',
        type: _types.FieldMetadataType.TEXT,
        name: 'name',
        label: 'Name'
    });
    const ageField = createMockField({
        id: 'age-id',
        type: _types.FieldMetadataType.NUMBER,
        name: 'age',
        label: 'Age'
    });
    const fullNameField = createMockField({
        id: 'fullname-id',
        type: _types.FieldMetadataType.FULL_NAME,
        name: 'fullName',
        label: 'Full Name'
    });
    const idField = createMockField({
        id: 'id-id',
        type: _types.FieldMetadataType.UUID,
        name: 'id',
        label: 'Id',
        isNullable: false
    });
    const closeDateField = createMockField({
        id: 'closedate-id',
        type: _types.FieldMetadataType.DATE_TIME,
        name: 'closeDate',
        label: 'Close Date',
        isNullable: true
    });
    const companyField = {
        ...createMockField({
            id: 'company-id',
            type: _types.FieldMetadataType.RELATION,
            name: 'company',
            label: 'Company'
        }),
        settings: {
            relationType: _types.RelationType.MANY_TO_ONE
        },
        relationTargetObjectMetadataId: 'company-object-id'
    };
    const companyNameField = {
        ...createMockField({
            id: 'company-name-id',
            type: _types.FieldMetadataType.TEXT,
            name: 'name',
            label: 'Name'
        }),
        objectMetadataId: 'company-object-id'
    };
    const companyContactNameField = {
        ...createMockField({
            id: 'company-contactname-id',
            type: _types.FieldMetadataType.FULL_NAME,
            name: 'contactName',
            label: 'Contact Name'
        }),
        objectMetadataId: 'company-object-id'
    };
    const buildFlatFieldMetadataMaps = (fields)=>({
            byUniversalIdentifier: fields.reduce((acc, field)=>{
                acc[field.universalIdentifier] = field;
                return acc;
            }, {}),
            universalIdentifierById: fields.reduce((acc, field)=>{
                acc[field.id] = field.universalIdentifier;
                return acc;
            }, {}),
            universalIdentifiersByApplicationId: {}
        });
    const flatFieldMetadataMaps = buildFlatFieldMetadataMaps([
        nameField,
        ageField,
        fullNameField,
        idField,
        closeDateField,
        companyField,
        companyNameField,
        companyContactNameField
    ]);
    const flatObjectMetadata = {
        id: objectMetadataId,
        workspaceId,
        nameSingular: 'person',
        namePlural: 'people',
        labelSingular: 'Person',
        labelPlural: 'People',
        targetTableName: 'person',
        isRemote: false,
        isActive: true,
        isSystem: false,
        isAuditLogged: false,
        isSearchable: false,
        icon: 'Icon123',
        createdAt: new Date(),
        updatedAt: new Date(),
        universalIdentifier: objectMetadataId,
        fieldIds: [
            'name-id',
            'age-id',
            'fullname-id',
            'id-id',
            'closedate-id',
            'company-id'
        ],
        indexMetadataIds: [],
        viewIds: [],
        applicationId: null
    };
    const companyObjectMetadata = {
        id: 'company-object-id',
        universalIdentifier: 'company-object-id',
        workspaceId,
        nameSingular: 'company',
        namePlural: 'companies',
        fieldIds: [
            'company-name-id',
            'company-contactname-id'
        ]
    };
    const flatObjectMetadataMaps = {
        byUniversalIdentifier: {
            'object-id': flatObjectMetadata,
            'company-object-id': companyObjectMetadata
        },
        universalIdentifierById: {
            'object-id': 'object-id',
            'company-object-id': 'company-object-id'
        },
        universalIdentifiersByApplicationId: {}
    };
    describe('basic cursor filtering', ()=>{
        it('should return empty array when cursor is empty', ()=>{
            const result = (0, _computecursorargfilterutils.computeCursorArgFilter)({
                cursor: {},
                orderBy: [],
                flatObjectMetadata,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps,
                isForwardPagination: true
            });
            expect(result).toEqual([]);
        });
        it('should compute forward pagination filter for single field', ()=>{
            const cursor = {
                name: 'John'
            };
            const orderBy = [
                {
                    name: _types.OrderByDirection.AscNullsLast
                }
            ];
            const result = (0, _computecursorargfilterutils.computeCursorArgFilter)({
                cursor,
                orderBy,
                flatObjectMetadata,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps,
                isForwardPagination: true
            });
            // TEXT columns hold SQL NULL for rows written empty or without the
            // field, so the trailing NULL block is part of the continuation
            expect(result).toEqual([
                {
                    or: [
                        {
                            name: {
                                gt: 'John'
                            }
                        },
                        {
                            name: {
                                isStrictly: 'NULL'
                            }
                        }
                    ]
                }
            ]);
        });
        it('should compute backward pagination filter for single field', ()=>{
            const cursor = {
                name: 'John'
            };
            const orderBy = [
                {
                    name: _types.OrderByDirection.AscNullsLast
                }
            ];
            const result = (0, _computecursorargfilterutils.computeCursorArgFilter)({
                cursor,
                orderBy,
                flatObjectMetadata,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps,
                isForwardPagination: false
            });
            expect(result).toEqual([
                {
                    name: {
                        lt: 'John'
                    }
                }
            ]);
        });
    });
    describe('multiple fields cursor filtering', ()=>{
        it('should handle multiple cursor fields with forward pagination', ()=>{
            const cursor = {
                name: 'John',
                age: 30
            };
            const orderBy = [
                {
                    name: _types.OrderByDirection.AscNullsLast
                },
                {
                    age: _types.OrderByDirection.DescNullsLast
                }
            ];
            const result = (0, _computecursorargfilterutils.computeCursorArgFilter)({
                cursor,
                orderBy,
                flatObjectMetadata,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps,
                isForwardPagination: true
            });
            expect(result).toEqual([
                {
                    or: [
                        {
                            name: {
                                gt: 'John'
                            }
                        },
                        {
                            name: {
                                isStrictly: 'NULL'
                            }
                        }
                    ]
                },
                {
                    and: [
                        {
                            name: {
                                eqStrict: 'John'
                            }
                        },
                        {
                            or: [
                                {
                                    age: {
                                        lt: 30
                                    }
                                },
                                {
                                    age: {
                                        isStrictly: 'NULL'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]);
        });
    });
    describe('composite field handling', ()=>{
        it('should handle fullName composite field with proper ordering', ()=>{
            const cursor = {
                fullName: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            };
            const orderBy = [
                {
                    fullName: {
                        firstName: _types.OrderByDirection.AscNullsLast,
                        lastName: _types.OrderByDirection.AscNullsLast
                    }
                }
            ];
            const result = (0, _computecursorargfilterutils.computeCursorArgFilter)({
                cursor,
                orderBy,
                flatObjectMetadata,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps,
                isForwardPagination: true
            });
            expect(result).toEqual([
                {
                    or: [
                        {
                            fullName: {
                                firstName: {
                                    gt: 'John'
                                }
                            }
                        },
                        {
                            fullName: {
                                firstName: {
                                    isStrictly: 'NULL'
                                }
                            }
                        }
                    ]
                },
                {
                    and: [
                        {
                            fullName: {
                                firstName: {
                                    eqStrict: 'John'
                                }
                            }
                        },
                        {
                            or: [
                                {
                                    fullName: {
                                        lastName: {
                                            gt: 'Doe'
                                        }
                                    }
                                },
                                {
                                    fullName: {
                                        lastName: {
                                            isStrictly: 'NULL'
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]);
        });
        it('should handle single property composite field', ()=>{
            const cursor = {
                fullName: {
                    firstName: 'John'
                }
            };
            const orderBy = [
                {
                    fullName: {
                        firstName: _types.OrderByDirection.AscNullsLast
                    }
                }
            ];
            const result = (0, _computecursorargfilterutils.computeCursorArgFilter)({
                cursor,
                orderBy,
                flatObjectMetadata,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps,
                isForwardPagination: true
            });
            expect(result).toEqual([
                {
                    or: [
                        {
                            fullName: {
                                firstName: {
                                    gt: 'John'
                                }
                            }
                        },
                        {
                            fullName: {
                                firstName: {
                                    isStrictly: 'NULL'
                                }
                            }
                        }
                    ]
                }
            ]);
        });
        it('should handle dotted composite cursor keys', ()=>{
            const cursor = {
                'fullName.firstName': 'John',
                'fullName.lastName': 'Doe'
            };
            const orderBy = [
                {
                    fullName: {
                        firstName: _types.OrderByDirection.AscNullsLast,
                        lastName: _types.OrderByDirection.AscNullsLast
                    }
                }
            ];
            const result = (0, _computecursorargfilterutils.computeCursorArgFilter)({
                cursor,
                orderBy,
                flatObjectMetadata,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps,
                isForwardPagination: true
            });
            expect(result).toEqual([
                {
                    or: [
                        {
                            fullName: {
                                firstName: {
                                    gt: 'John'
                                }
                            }
                        },
                        {
                            fullName: {
                                firstName: {
                                    isStrictly: 'NULL'
                                }
                            }
                        }
                    ]
                },
                {
                    and: [
                        {
                            fullName: {
                                firstName: {
                                    eqStrict: 'John'
                                }
                            }
                        },
                        {
                            or: [
                                {
                                    fullName: {
                                        lastName: {
                                            gt: 'Doe'
                                        }
                                    }
                                },
                                {
                                    fullName: {
                                        lastName: {
                                            isStrictly: 'NULL'
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]);
        });
        it('should handle composite field with backward pagination', ()=>{
            const cursor = {
                fullName: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            };
            const orderBy = [
                {
                    fullName: {
                        firstName: _types.OrderByDirection.AscNullsLast,
                        lastName: _types.OrderByDirection.AscNullsLast
                    }
                }
            ];
            const result = (0, _computecursorargfilterutils.computeCursorArgFilter)({
                cursor,
                orderBy,
                flatObjectMetadata,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps,
                isForwardPagination: false
            });
            expect(result).toEqual([
                {
                    fullName: {
                        firstName: {
                            lt: 'John'
                        }
                    }
                },
                {
                    and: [
                        {
                            fullName: {
                                firstName: {
                                    eqStrict: 'John'
                                }
                            }
                        },
                        {
                            fullName: {
                                lastName: {
                                    lt: 'Doe'
                                }
                            }
                        }
                    ]
                }
            ]);
        });
    });
    describe('error handling', ()=>{
        it('should throw error for invalid field metadata', ()=>{
            const cursor = {
                invalidField: 'value'
            };
            const orderBy = [
                {
                    invalidField: _types.OrderByDirection.AscNullsLast
                }
            ];
            expect(()=>(0, _computecursorargfilterutils.computeCursorArgFilter)({
                    cursor,
                    orderBy,
                    flatObjectMetadata,
                    flatObjectMetadataMaps,
                    flatFieldMetadataMaps,
                    isForwardPagination: true
                })).toThrow(_graphqlqueryrunnerexception.GraphqlQueryRunnerException);
        });
        it('should throw error for missing orderBy entry', ()=>{
            const cursor = {
                name: 'John'
            };
            const orderBy = [
                {
                    age: _types.OrderByDirection.AscNullsLast
                }
            ];
            expect(()=>(0, _computecursorargfilterutils.computeCursorArgFilter)({
                    cursor,
                    orderBy,
                    flatObjectMetadata,
                    flatObjectMetadataMaps,
                    flatFieldMetadataMaps,
                    isForwardPagination: true
                })).toThrow(_graphqlqueryrunnerexception.GraphqlQueryRunnerException);
        });
    });
    describe('null-aware filtering on nullable fields', ()=>{
        it('should include the NULL block when nulls are scanned after the cursor', ()=>{
            const cursor = {
                closeDate: '2026-01-01T00:00:00Z'
            };
            const orderBy = [
                {
                    closeDate: _types.OrderByDirection.AscNullsLast
                }
            ];
            const result = (0, _computecursorargfilterutils.computeCursorArgFilter)({
                cursor,
                orderBy,
                flatObjectMetadata,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps,
                isForwardPagination: true
            });
            expect(result).toEqual([
                {
                    or: [
                        {
                            closeDate: {
                                gt: '2026-01-01T00:00:00Z'
                            }
                        },
                        {
                            closeDate: {
                                isStrictly: 'NULL'
                            }
                        }
                    ]
                }
            ]);
        });
        it('should not include the NULL block when nulls are scanned before the cursor', ()=>{
            const cursor = {
                closeDate: '2026-01-01T00:00:00Z'
            };
            const orderBy = [
                {
                    closeDate: _types.OrderByDirection.AscNullsFirst
                }
            ];
            const result = (0, _computecursorargfilterutils.computeCursorArgFilter)({
                cursor,
                orderBy,
                flatObjectMetadata,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps,
                isForwardPagination: true
            });
            expect(result).toEqual([
                {
                    closeDate: {
                        gt: '2026-01-01T00:00:00Z'
                    }
                }
            ]);
        });
        it('should continue on tie-breaking keys when the cursor sits in a trailing NULL block', ()=>{
            const cursor = {
                closeDate: null,
                id: 'uuid-1'
            };
            const orderBy = [
                {
                    closeDate: _types.OrderByDirection.AscNullsLast
                },
                {
                    id: _types.OrderByDirection.AscNullsFirst
                }
            ];
            const result = (0, _computecursorargfilterutils.computeCursorArgFilter)({
                cursor,
                orderBy,
                flatObjectMetadata,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps,
                isForwardPagination: true
            });
            expect(result).toEqual([
                {
                    and: [
                        {
                            closeDate: {
                                isStrictly: 'NULL'
                            }
                        },
                        {
                            id: {
                                gt: 'uuid-1'
                            }
                        }
                    ]
                }
            ]);
        });
        it('should advance into the non-null region when the cursor sits in a leading NULL block', ()=>{
            const cursor = {
                closeDate: null,
                id: 'uuid-1'
            };
            const orderBy = [
                {
                    closeDate: _types.OrderByDirection.AscNullsFirst
                },
                {
                    id: _types.OrderByDirection.AscNullsFirst
                }
            ];
            const result = (0, _computecursorargfilterutils.computeCursorArgFilter)({
                cursor,
                orderBy,
                flatObjectMetadata,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps,
                isForwardPagination: true
            });
            expect(result).toEqual([
                {
                    closeDate: {
                        isStrictly: 'NOT_NULL'
                    }
                },
                {
                    and: [
                        {
                            closeDate: {
                                isStrictly: 'NULL'
                            }
                        },
                        {
                            id: {
                                gt: 'uuid-1'
                            }
                        }
                    ]
                }
            ]);
        });
        it('should swap the NULL block side for backward pagination', ()=>{
            const cursor = {
                closeDate: '2026-01-01T00:00:00Z'
            };
            const orderBy = [
                {
                    closeDate: _types.OrderByDirection.AscNullsFirst
                }
            ];
            const result = (0, _computecursorargfilterutils.computeCursorArgFilter)({
                cursor,
                orderBy,
                flatObjectMetadata,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps,
                isForwardPagination: false
            });
            expect(result).toEqual([
                {
                    or: [
                        {
                            closeDate: {
                                lt: '2026-01-01T00:00:00Z'
                            }
                        },
                        {
                            closeDate: {
                                isStrictly: 'NULL'
                            }
                        }
                    ]
                }
            ]);
        });
        it('should not add a NULL block for non-nullable fields', ()=>{
            const cursor = {
                id: 'uuid-1'
            };
            const orderBy = [
                {
                    id: _types.OrderByDirection.AscNullsLast
                }
            ];
            const result = (0, _computecursorargfilterutils.computeCursorArgFilter)({
                cursor,
                orderBy,
                flatObjectMetadata,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps,
                isForwardPagination: true
            });
            expect(result).toEqual([
                {
                    id: {
                        gt: 'uuid-1'
                    }
                }
            ]);
        });
    });
    describe('cursor and orderBy mismatch guard', ()=>{
        it('should throw when the cursor is missing the value of an orderBy scalar field', ()=>{
            const cursor = {
                id: 'uuid-1'
            };
            const orderBy = [
                {
                    closeDate: _types.OrderByDirection.AscNullsLast
                },
                {
                    id: _types.OrderByDirection.AscNullsFirst
                }
            ];
            expect(()=>(0, _computecursorargfilterutils.computeCursorArgFilter)({
                    cursor,
                    orderBy,
                    flatObjectMetadata,
                    flatObjectMetadataMaps,
                    flatFieldMetadataMaps,
                    isForwardPagination: true
                })).toThrow('Cursor is missing the value for orderBy field "closeDate"');
        });
        it('should throw when the cursor is missing an ordered composite sub-field', ()=>{
            const cursor = {
                id: 'uuid-1'
            };
            const orderBy = [
                {
                    fullName: {
                        firstName: _types.OrderByDirection.AscNullsLast
                    }
                },
                {
                    id: _types.OrderByDirection.AscNullsFirst
                }
            ];
            expect(()=>(0, _computecursorargfilterutils.computeCursorArgFilter)({
                    cursor,
                    orderBy,
                    flatObjectMetadata,
                    flatObjectMetadataMaps,
                    flatFieldMetadataMaps,
                    isForwardPagination: true
                })).toThrow('Cursor is missing the value for orderBy field "fullName.firstName"');
        });
        it('should accept a null cursor value as covering its orderBy field', ()=>{
            const cursor = {
                closeDate: null,
                id: 'uuid-1'
            };
            const orderBy = [
                {
                    closeDate: _types.OrderByDirection.AscNullsLast
                },
                {
                    id: _types.OrderByDirection.AscNullsFirst
                }
            ];
            expect(()=>(0, _computecursorargfilterutils.computeCursorArgFilter)({
                    cursor,
                    orderBy,
                    flatObjectMetadata,
                    flatObjectMetadataMaps,
                    flatFieldMetadataMaps,
                    isForwardPagination: true
                })).not.toThrow();
        });
    });
    describe('relation orderBy cursor continuation', ()=>{
        const relationOrderBy = [
            {
                company: {
                    name: _types.OrderByDirection.AscNullsLast
                }
            },
            {
                id: _types.OrderByDirection.AscNullsFirst
            }
        ];
        it('should continue on the joined column with the missing-relation block last', ()=>{
            const cursor = {
                company: {
                    name: 'Acme'
                },
                id: 'uuid-1'
            };
            const result = (0, _computecursorargfilterutils.computeCursorArgFilter)({
                cursor,
                orderBy: relationOrderBy,
                flatObjectMetadata,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps,
                isForwardPagination: true
            });
            expect(result).toEqual([
                {
                    or: [
                        {
                            company: {
                                name: {
                                    gt: 'Acme'
                                }
                            }
                        },
                        {
                            company: {
                                name: {
                                    isStrictly: 'NULL'
                                }
                            }
                        }
                    ]
                },
                {
                    and: [
                        {
                            company: {
                                name: {
                                    eqStrict: 'Acme'
                                }
                            }
                        },
                        {
                            id: {
                                gt: 'uuid-1'
                            }
                        }
                    ]
                }
            ]);
        });
        it('should ride the tie-breaking keys inside the missing-relation block', ()=>{
            const cursor = {
                company: {
                    name: null
                },
                id: 'uuid-1'
            };
            const result = (0, _computecursorargfilterutils.computeCursorArgFilter)({
                cursor,
                orderBy: relationOrderBy,
                flatObjectMetadata,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps,
                isForwardPagination: true
            });
            expect(result).toEqual([
                {
                    and: [
                        {
                            company: {
                                name: {
                                    isStrictly: 'NULL'
                                }
                            }
                        },
                        {
                            id: {
                                gt: 'uuid-1'
                            }
                        }
                    ]
                }
            ]);
        });
        it('should reject a cursor without the relation orderBy value', ()=>{
            const cursor = {
                id: 'uuid-1'
            };
            expect(()=>(0, _computecursorargfilterutils.computeCursorArgFilter)({
                    cursor,
                    orderBy: relationOrderBy,
                    flatObjectMetadata,
                    flatObjectMetadataMaps,
                    flatFieldMetadataMaps,
                    isForwardPagination: true
                })).toThrow('Cursor is missing the value for orderBy field "company.name"');
        });
    });
    describe('relation orderBy on a composite target field', ()=>{
        // The web app sorts person-labeled relation columns exactly like this: one
        // entry per ordered FULL_NAME property of the target's label identifier
        const relationCompositeOrderBy = [
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
            },
            {
                id: _types.OrderByDirection.AscNullsFirst
            }
        ];
        it('should continue across both composite properties of the joined record', ()=>{
            const cursor = {
                company: {
                    contactName: {
                        firstName: 'Ada',
                        lastName: 'Lovelace'
                    }
                },
                id: 'uuid-1'
            };
            const result = (0, _computecursorargfilterutils.computeCursorArgFilter)({
                cursor,
                orderBy: relationCompositeOrderBy,
                flatObjectMetadata,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps,
                isForwardPagination: true
            });
            // The joined column is NULL both for rows without a related record and
            // for related records holding an empty value: they all sort into the
            // NULL block, which the exact nested check matches
            expect(result).toEqual([
                {
                    or: [
                        {
                            company: {
                                contactName: {
                                    firstName: {
                                        gt: 'Ada'
                                    }
                                }
                            }
                        },
                        {
                            company: {
                                contactName: {
                                    firstName: {
                                        isStrictly: 'NULL'
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    and: [
                        {
                            company: {
                                contactName: {
                                    firstName: {
                                        eqStrict: 'Ada'
                                    }
                                }
                            }
                        },
                        {
                            or: [
                                {
                                    company: {
                                        contactName: {
                                            lastName: {
                                                gt: 'Lovelace'
                                            }
                                        }
                                    }
                                },
                                {
                                    company: {
                                        contactName: {
                                            lastName: {
                                                isStrictly: 'NULL'
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    and: [
                        {
                            company: {
                                contactName: {
                                    firstName: {
                                        eqStrict: 'Ada'
                                    }
                                }
                            }
                        },
                        {
                            company: {
                                contactName: {
                                    lastName: {
                                        eqStrict: 'Lovelace'
                                    }
                                }
                            }
                        },
                        {
                            id: {
                                gt: 'uuid-1'
                            }
                        }
                    ]
                }
            ]);
        });
        it('should reject a cursor missing one composite property of the relation', ()=>{
            const cursor = {
                company: {
                    contactName: {
                        firstName: 'Ada'
                    }
                },
                id: 'uuid-1'
            };
            expect(()=>(0, _computecursorargfilterutils.computeCursorArgFilter)({
                    cursor,
                    orderBy: relationCompositeOrderBy,
                    flatObjectMetadata,
                    flatObjectMetadataMaps,
                    flatFieldMetadataMaps,
                    isForwardPagination: true
                })).toThrow('Cursor is missing the value for orderBy field "company.contactName.lastName"');
        });
    });
});

//# sourceMappingURL=compute-cursor-arg-filter.utils.spec.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _buildwhereconditionsutil = require("../build-where-conditions.util");
describe('buildWhereConditions', ()=>{
    const records = [
        {
            id: 'record-1',
            uniqueText: 'alpha',
            emailsField: {
                primaryEmail: 'alpha@example.com'
            }
        },
        {
            id: 'record-2',
            uniqueText: 'beta',
            emailsField: {
                primaryEmail: 'beta@example.com'
            }
        },
        {
            id: 'record-3',
            // uniqueText intentionally missing to validate filtering of undefined
            emailsField: {
                primaryEmail: undefined
            }
        }
    ];
    it('returns empty array when no conflicting fields provided', ()=>{
        const where = (0, _buildwhereconditionsutil.buildWhereConditions)(records, []);
        expect(where).toEqual([]);
    });
    it('collapses a single-column group into one IN condition with defined values', ()=>{
        const groups = [
            {
                baseFields: [
                    'uniqueText'
                ],
                conflictingProperties: [
                    {
                        fullPath: 'uniqueText',
                        column: 'uniqueText'
                    }
                ]
            }
        ];
        const where = (0, _buildwhereconditionsutil.buildWhereConditions)(records, groups);
        expect(where).toHaveLength(1);
        const operator = where[0].uniqueText;
        expect(operator.type.toLowerCase()).toBe('in');
        expect(operator.value).toEqual([
            'alpha',
            'beta'
        ]);
    });
    it('deduplicates values within a single-column IN condition', ()=>{
        const groups = [
            {
                baseFields: [
                    'uniqueText'
                ],
                conflictingProperties: [
                    {
                        fullPath: 'uniqueText',
                        column: 'uniqueText'
                    }
                ]
            }
        ];
        const where = (0, _buildwhereconditionsutil.buildWhereConditions)([
            {
                uniqueText: 'alpha'
            },
            {
                uniqueText: 'alpha'
            },
            {
                uniqueText: 'beta'
            }
        ], groups);
        expect(where).toHaveLength(1);
        expect(where[0].uniqueText.value).toEqual([
            'alpha',
            'beta'
        ]);
    });
    it('skips adding a condition when all values for a field are undefined', ()=>{
        const groups = [
            {
                baseFields: [
                    'uniqueText'
                ],
                conflictingProperties: [
                    {
                        fullPath: 'uniqueText',
                        column: 'uniqueText'
                    }
                ]
            }
        ];
        const where = (0, _buildwhereconditionsutil.buildWhereConditions)([
            {
                id: '1'
            },
            {
                id: '2'
            }
        ], groups);
        expect(where).toEqual([]);
    });
    it('collapses a nested single-column path into one IN condition', ()=>{
        const groups = [
            {
                baseFields: [
                    'emailsField'
                ],
                conflictingProperties: [
                    {
                        fullPath: 'emailsField.primaryEmail',
                        column: 'emailsFieldPrimaryEmail'
                    }
                ]
            }
        ];
        const where = (0, _buildwhereconditionsutil.buildWhereConditions)(records, groups);
        expect(where).toHaveLength(1);
        const operator = where[0].emailsFieldPrimaryEmail;
        expect(operator.type.toLowerCase()).toBe('in');
        expect(operator.value).toEqual([
            'alpha@example.com',
            'beta@example.com'
        ]);
    });
    it('builds one IN condition per single-column conflicting field group', ()=>{
        const groups = [
            {
                baseFields: [
                    'uniqueText'
                ],
                conflictingProperties: [
                    {
                        fullPath: 'uniqueText',
                        column: 'uniqueText'
                    }
                ]
            },
            {
                baseFields: [
                    'emailsField'
                ],
                conflictingProperties: [
                    {
                        fullPath: 'emailsField.primaryEmail',
                        column: 'emailsFieldPrimaryEmail'
                    }
                ]
            }
        ];
        const where = (0, _buildwhereconditionsutil.buildWhereConditions)(records, groups);
        expect(where).toHaveLength(2);
        expect(where.map((condition)=>Object.keys(condition)[0]).sort()).toEqual([
            'emailsFieldPrimaryEmail',
            'uniqueText'
        ]);
    });
    it('preserves numeric values instead of coercing them to strings', ()=>{
        const groups = [
            {
                baseFields: [
                    'externalId'
                ],
                conflictingProperties: [
                    {
                        fullPath: 'externalId',
                        column: 'externalId'
                    }
                ]
            }
        ];
        const where = (0, _buildwhereconditionsutil.buildWhereConditions)([
            {
                externalId: 42
            },
            {
                externalId: 43
            }
        ], groups);
        expect(where).toHaveLength(1);
        expect(where[0].externalId.value).toEqual([
            42,
            43
        ]);
    });
    it('builds composite group conditions with all properties ANDed together per record', ()=>{
        const groups = [
            {
                baseFields: [
                    'customerId',
                    'environment'
                ],
                conflictingProperties: [
                    {
                        fullPath: 'customerId',
                        column: 'customerId'
                    },
                    {
                        fullPath: 'environment',
                        column: 'environment'
                    }
                ]
            }
        ];
        const where = (0, _buildwhereconditionsutil.buildWhereConditions)([
            {
                customerId: 'customer-1',
                environment: 'prod'
            },
            {
                customerId: 'customer-2',
                environment: 'staging'
            }
        ], groups);
        expect(where).toHaveLength(2);
        expect(where).toEqual([
            {
                customerId: expect.objectContaining({
                    value: 'customer-1'
                }),
                environment: expect.objectContaining({
                    value: 'prod'
                })
            },
            {
                customerId: expect.objectContaining({
                    value: 'customer-2'
                }),
                environment: expect.objectContaining({
                    value: 'staging'
                })
            }
        ]);
        where.forEach((condition)=>{
            expect(condition.customerId.type.toLowerCase()).toBe('equal');
            expect(condition.environment.type.toLowerCase()).toBe('equal');
        });
    });
    it('skips a composite group for a record missing part of the key', ()=>{
        const groups = [
            {
                baseFields: [
                    'customerId',
                    'environment'
                ],
                conflictingProperties: [
                    {
                        fullPath: 'customerId',
                        column: 'customerId'
                    },
                    {
                        fullPath: 'environment',
                        column: 'environment'
                    }
                ]
            }
        ];
        const where = (0, _buildwhereconditionsutil.buildWhereConditions)([
            {
                customerId: 'customer-1',
                environment: 'prod'
            },
            {
                customerId: 'customer-2'
            }
        ], groups);
        expect(where).toHaveLength(1);
        expect(where[0]).toEqual({
            customerId: expect.objectContaining({
                value: 'customer-1'
            }),
            environment: expect.objectContaining({
                value: 'prod'
            })
        });
    });
    it('deduplicates identical composite conditions across records', ()=>{
        const groups = [
            {
                baseFields: [
                    'customerId',
                    'environment'
                ],
                conflictingProperties: [
                    {
                        fullPath: 'customerId',
                        column: 'customerId'
                    },
                    {
                        fullPath: 'environment',
                        column: 'environment'
                    }
                ]
            }
        ];
        const where = (0, _buildwhereconditionsutil.buildWhereConditions)([
            {
                customerId: 'customer-1',
                environment: 'prod'
            },
            {
                customerId: 'customer-1',
                environment: 'prod'
            }
        ], groups);
        expect(where).toHaveLength(1);
        expect(where[0]).toEqual({
            customerId: expect.objectContaining({
                value: 'customer-1'
            }),
            environment: expect.objectContaining({
                value: 'prod'
            })
        });
    });
    it('does not merge distinct composite tuples that share separator-like characters', ()=>{
        const groups = [
            {
                baseFields: [
                    'customerId',
                    'environment'
                ],
                conflictingProperties: [
                    {
                        fullPath: 'customerId',
                        column: 'customerId'
                    },
                    {
                        fullPath: 'environment',
                        column: 'environment'
                    }
                ]
            }
        ];
        const where = (0, _buildwhereconditionsutil.buildWhereConditions)([
            {
                customerId: 'a:b',
                environment: 'c'
            },
            {
                customerId: 'a',
                environment: 'b:c'
            }
        ], groups);
        expect(where).toHaveLength(2);
    });
    it('ORs single-column and composite groups together', ()=>{
        const groups = [
            {
                baseFields: [
                    'id'
                ],
                conflictingProperties: [
                    {
                        fullPath: 'id',
                        column: 'id'
                    }
                ]
            },
            {
                baseFields: [
                    'customerId',
                    'environment'
                ],
                conflictingProperties: [
                    {
                        fullPath: 'customerId',
                        column: 'customerId'
                    },
                    {
                        fullPath: 'environment',
                        column: 'environment'
                    }
                ]
            }
        ];
        const where = (0, _buildwhereconditionsutil.buildWhereConditions)([
            {
                id: 'record-1',
                customerId: 'customer-1',
                environment: 'prod'
            }
        ], groups);
        expect(where).toHaveLength(2);
        const idCondition = where.find((condition)=>'id' in condition);
        const compositeCondition = where.find((condition)=>'customerId' in condition);
        expect(idCondition?.id.type.toLowerCase()).toBe('in');
        expect(idCondition?.id.value).toEqual([
            'record-1'
        ]);
        expect(compositeCondition?.customerId.type.toLowerCase()).toBe('equal');
        expect(compositeCondition?.environment.type.toLowerCase()).toBe('equal');
    });
});

//# sourceMappingURL=build-where-conditions.util.spec.js.map
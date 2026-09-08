"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _createwhereexpressionrecorderutil = require("test/utils/create-where-expression-recorder.util");
const _types = require("twenty-shared/types");
const _graphqlqueryfilterconditionparser = require("../graphql-query-filter-condition.parser");
const createFlatFieldMetadata = (overrides)=>({
        id: 'field-id',
        name: 'field',
        type: _types.FieldMetadataType.TEXT,
        universalIdentifier: 'field-universal-id',
        ...overrides
    });
const nameField = createFlatFieldMetadata({
    id: 'name-field-id',
    name: 'name',
    type: _types.FieldMetadataType.TEXT,
    universalIdentifier: 'name-field-universal-id'
});
const employeesField = createFlatFieldMetadata({
    id: 'employees-field-id',
    name: 'employees',
    type: _types.FieldMetadataType.NUMBER,
    universalIdentifier: 'employees-field-universal-id'
});
const companyFields = [
    nameField,
    employeesField
];
const companyObjectMetadata = {
    id: 'company-object-id',
    nameSingular: 'company',
    namePlural: 'companies',
    fieldIds: companyFields.map((field)=>field.id),
    universalIdentifier: 'company-object-universal-id'
};
const flatFieldMetadataMaps = {
    byUniversalIdentifier: Object.fromEntries(companyFields.map((field)=>[
            field.universalIdentifier,
            field
        ])),
    universalIdentifierById: Object.fromEntries(companyFields.map((field)=>[
            field.id,
            field.universalIdentifier
        ])),
    universalIdentifiersByApplicationId: {}
};
const outerQueryBuilder = {
    objectRecordsPermissions: {}
};
const recordFilterEntries = (filter)=>{
    const recorder = (0, _createwhereexpressionrecorderutil.createWhereExpressionRecorder)();
    const parser = new _graphqlqueryfilterconditionparser.GraphqlQueryFilterConditionParser(companyObjectMetadata, flatFieldMetadataMaps);
    parser.applyFilterEntriesToWhereBrackets(recorder.whereExpression, outerQueryBuilder, 'company', filter);
    return recorder.calls;
};
const withNormalizedParameterKeys = (calls)=>calls.map(({ method, node })=>node.kind === 'sql' ? {
            method,
            sql: node.sql.replace(/(?<!:):[A-Za-z0-9_]+/g, ':parameter'),
            parameterValues: Object.values(node.parameters ?? {})
        } : {
            method,
            kind: node.kind,
            children: withNormalizedParameterKeys(node.children)
        });
describe('GraphqlQueryFilterConditionParser', ()=>{
    describe('applyFilterEntriesToWhereBrackets', ()=>{
        it('emits the first entry with where and later entries with andWhere', ()=>{
            const calls = recordFilterEntries({
                name: {
                    ilike: '%acme%'
                },
                employees: {
                    gte: 5
                }
            });
            expect(calls).toHaveLength(2);
            expect(calls[0].method).toBe('where');
            expect(calls[1].method).toBe('andWhere');
            expect(calls[0].node.kind).toBe('sql');
            expect(calls[1].node.kind).toBe('sql');
        });
        it('passes the leaf condition and its parameters through to the query builder', ()=>{
            const calls = recordFilterEntries({
                name: {
                    ilike: '%acme%'
                }
            });
            expect(calls).toHaveLength(1);
            const node = calls[0].node;
            if (node.kind !== 'sql') {
                throw new Error('Expected a sql node');
            }
            expect(node.sql).toContain('"company"."name"');
            expect(Object.values(node.parameters ?? {})).toEqual([
                '%acme%'
            ]);
        });
        it('wraps an and group in brackets and joins its elements with andWhere', ()=>{
            const calls = recordFilterEntries({
                and: [
                    {
                        name: {
                            ilike: '%a%'
                        }
                    },
                    {
                        employees: {
                            gte: 1
                        }
                    }
                ]
            });
            expect(calls).toEqual([
                {
                    method: 'where',
                    node: {
                        kind: 'brackets',
                        children: [
                            {
                                method: 'where',
                                node: {
                                    kind: 'brackets',
                                    children: [
                                        {
                                            method: 'where',
                                            node: expect.objectContaining({
                                                kind: 'sql'
                                            })
                                        }
                                    ]
                                }
                            },
                            {
                                method: 'andWhere',
                                node: {
                                    kind: 'brackets',
                                    children: [
                                        {
                                            method: 'where',
                                            node: expect.objectContaining({
                                                kind: 'sql'
                                            })
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]);
        });
        it('wraps an or group in brackets and joins its elements with orWhere', ()=>{
            const calls = recordFilterEntries({
                or: [
                    {
                        name: {
                            ilike: '%a%'
                        }
                    },
                    {
                        employees: {
                            gte: 1
                        }
                    }
                ]
            });
            expect(calls).toEqual([
                {
                    method: 'where',
                    node: {
                        kind: 'brackets',
                        children: [
                            {
                                method: 'where',
                                node: expect.objectContaining({
                                    kind: 'brackets'
                                })
                            },
                            {
                                method: 'orWhere',
                                node: expect.objectContaining({
                                    kind: 'brackets'
                                })
                            }
                        ]
                    }
                }
            ]);
        });
        it('applies an or group that is not wrapped in an array', ()=>{
            const calls = recordFilterEntries({
                or: {
                    name: {
                        ilike: '%acme%'
                    }
                }
            });
            expect(withNormalizedParameterKeys(calls)).toEqual(withNormalizedParameterKeys(recordFilterEntries({
                or: [
                    {
                        name: {
                            ilike: '%acme%'
                        }
                    }
                ]
            })));
            expect(calls).toEqual([
                {
                    method: 'where',
                    node: {
                        kind: 'brackets',
                        children: [
                            {
                                method: 'where',
                                node: {
                                    kind: 'brackets',
                                    children: [
                                        {
                                            method: 'where',
                                            node: expect.objectContaining({
                                                kind: 'sql'
                                            })
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]);
        });
        it('emits a not group as notBrackets', ()=>{
            const calls = recordFilterEntries({
                not: {
                    name: {
                        ilike: '%a%'
                    }
                }
            });
            expect(calls).toEqual([
                {
                    method: 'where',
                    node: {
                        kind: 'notBrackets',
                        children: [
                            {
                                method: 'where',
                                node: expect.objectContaining({
                                    kind: 'sql'
                                })
                            }
                        ]
                    }
                }
            ]);
        });
        it('attaches a logical group with andWhere when it is not the first entry', ()=>{
            const calls = recordFilterEntries({
                name: {
                    ilike: '%a%'
                },
                and: [
                    {
                        employees: {
                            gte: 1
                        }
                    }
                ]
            });
            expect(calls).toHaveLength(2);
            expect(calls[0]).toEqual({
                method: 'where',
                node: expect.objectContaining({
                    kind: 'sql'
                })
            });
            expect(calls[1]).toEqual({
                method: 'andWhere',
                node: expect.objectContaining({
                    kind: 'brackets'
                })
            });
        });
        it('recurses through nested logical groups', ()=>{
            const calls = recordFilterEntries({
                and: [
                    {
                        or: [
                            {
                                not: {
                                    name: {
                                        ilike: '%a%'
                                    }
                                }
                            }
                        ]
                    }
                ]
            });
            expect(calls).toEqual([
                {
                    method: 'where',
                    node: {
                        kind: 'brackets',
                        children: [
                            {
                                method: 'where',
                                node: {
                                    kind: 'brackets',
                                    children: [
                                        {
                                            method: 'where',
                                            node: {
                                                kind: 'brackets',
                                                children: [
                                                    {
                                                        method: 'where',
                                                        node: {
                                                            kind: 'brackets',
                                                            children: [
                                                                {
                                                                    method: 'where',
                                                                    node: {
                                                                        kind: 'notBrackets',
                                                                        children: [
                                                                            {
                                                                                method: 'where',
                                                                                node: expect.objectContaining({
                                                                                    kind: 'sql'
                                                                                })
                                                                            }
                                                                        ]
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]);
        });
        it('emits nothing for an empty filter', ()=>{
            expect(recordFilterEntries({})).toEqual([]);
        });
    });
});

//# sourceMappingURL=graphql-query-filter-condition.parser.spec.js.map
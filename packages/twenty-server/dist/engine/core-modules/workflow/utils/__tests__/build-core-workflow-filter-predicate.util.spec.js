"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _graphqlerrorsutil = require("../../../graphql/utils/graphql-errors.util");
const _coreworkflowfilterinput = require("../../dtos/core-workflow-filter.input");
const _buildcoreworkflowfilterpredicateutil = require("../build-core-workflow-filter-predicate.util");
const _computecoreworkflowstatusesutil = require("../compute-core-workflow-statuses.util");
const _workflowworkspaceentity = require("../../../../../modules/workflow/common/standard-objects/workflow.workspace-entity");
const FIRST_PARAMETER_INDEX = 2;
const RELATIVE_DATE_FILTER_VALUE = JSON.stringify({
    direction: 'PAST',
    amount: 3,
    unit: 'DAY',
    timezone: 'UTC'
});
const buildPredicate = (rules, logicalOperator = _coreworkflowfilterinput.CoreWorkflowFilterLogicalOperator.AND)=>(0, _buildcoreworkflowfilterpredicateutil.buildCoreWorkflowFilterPredicate)({
        filter: {
            logicalOperator,
            rules
        },
        firstParameterIndex: FIRST_PARAMETER_INDEX
    });
const ALL_VERSION_FLAG_COMBINATIONS = [
    false,
    true
].flatMap((hasDraftVersion)=>[
        false,
        true
    ].flatMap((hasActiveVersion)=>[
            false,
            true
        ].map((hasDeactivatedVersion)=>({
                hasDraftVersion,
                hasActiveVersion,
                hasDeactivatedVersion
            }))));
const evaluateStatusPredicate = (predicate, { hasDraftVersion, hasActiveVersion, hasDeactivatedVersion })=>{
    const booleanExpression = predicate.split(`coalesce(bool_or(v.status = 'DRAFT'), false)`).join(String(hasDraftVersion)).split(`coalesce(bool_or(v.status = 'ACTIVE'), false)`).join(String(hasActiveVersion)).split(`coalesce(bool_or(v.status = 'DEACTIVATED'), false)`).join(String(hasDeactivatedVersion)).split('NOT').join('!').split('AND').join('&&').split('OR').join('||');
    return new Function(`return ${booleanExpression};`)();
};
describe('buildCoreWorkflowFilterPredicate', ()=>{
    it('should not filter when no filter is provided', ()=>{
        expect((0, _buildcoreworkflowfilterpredicateutil.buildCoreWorkflowFilterPredicate)({
            firstParameterIndex: 2
        })).toEqual({
            parameters: []
        });
        expect((0, _buildcoreworkflowfilterpredicateutil.buildCoreWorkflowFilterPredicate)({
            filter: null,
            firstParameterIndex: 2
        })).toEqual({
            parameters: []
        });
    });
    it('should not filter when the rule list is empty', ()=>{
        expect(buildPredicate([])).toEqual({
            parameters: []
        });
    });
    describe('NAME rules', ()=>{
        it('should build a case-insensitive contains predicate', ()=>{
            expect(buildPredicate([
                {
                    fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.NAME,
                    operand: _coreworkflowfilterinput.CoreWorkflowFilterOperand.CONTAINS,
                    value: 'invoice'
                }
            ])).toEqual({
                predicate: `(c.name ILIKE $2 ESCAPE '\\')`,
                parameters: [
                    '%invoice%'
                ]
            });
        });
        it('should escape ILIKE wildcards in the bound pattern', ()=>{
            expect(buildPredicate([
                {
                    fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.NAME,
                    operand: _coreworkflowfilterinput.CoreWorkflowFilterOperand.CONTAINS,
                    value: '100%_off'
                }
            ]).parameters).toEqual([
                '%100\\%\\_off%'
            ]);
        });
        it('should let an unnamed workflow match a negative text predicate', ()=>{
            expect(buildPredicate([
                {
                    fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.NAME,
                    operand: _coreworkflowfilterinput.CoreWorkflowFilterOperand.DOES_NOT_CONTAIN,
                    value: 'invoice'
                }
            ])).toEqual({
                predicate: `((c.name IS NULL OR c.name NOT ILIKE $2 ESCAPE '\\'))`,
                parameters: [
                    '%invoice%'
                ]
            });
        });
        it('should reject IS and IS_NOT, which the builder does not offer on NAME', ()=>{
            for (const operand of [
                _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS,
                _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_NOT
            ]){
                expect(()=>buildPredicate([
                        {
                            fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.NAME,
                            operand,
                            value: 'Send invoice'
                        }
                    ])).toThrow(_graphqlerrorsutil.UserInputError);
            }
        });
        it('should treat a blank name as empty', ()=>{
            expect(buildPredicate([
                {
                    fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.NAME,
                    operand: _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_EMPTY
                }
            ])).toEqual({
                predicate: `((c.name IS NULL OR c.name = ''))`,
                parameters: []
            });
            expect(buildPredicate([
                {
                    fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.NAME,
                    operand: _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_NOT_EMPTY
                }
            ])).toEqual({
                predicate: `((c.name IS NOT NULL AND c.name <> ''))`,
                parameters: []
            });
        });
        it.each([
            _coreworkflowfilterinput.CoreWorkflowFilterOperand.CONTAINS,
            _coreworkflowfilterinput.CoreWorkflowFilterOperand.DOES_NOT_CONTAIN
        ])('should reject %s without a value', (operand)=>{
            expect(()=>buildPredicate([
                    {
                        fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.NAME,
                        operand,
                        value: '   '
                    }
                ])).toThrow(_graphqlerrorsutil.UserInputError);
        });
    });
    describe('STATUSES rules', ()=>{
        it('should build a predicate per selected status', ()=>{
            expect(buildPredicate([
                {
                    fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.STATUSES,
                    operand: _coreworkflowfilterinput.CoreWorkflowFilterOperand.CONTAINS,
                    value: JSON.stringify([
                        _workflowworkspaceentity.WorkflowStatus.DRAFT,
                        _workflowworkspaceentity.WorkflowStatus.ACTIVE
                    ])
                }
            ])).toEqual({
                predicate: `((coalesce(bool_or(v.status = 'DRAFT'), false) OR coalesce(bool_or(v.status = 'ACTIVE'), false)))`,
                parameters: []
            });
        });
        it('should accept a bare status alongside a JSON encoded array', ()=>{
            expect(buildPredicate([
                {
                    fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.STATUSES,
                    operand: _coreworkflowfilterinput.CoreWorkflowFilterOperand.CONTAINS,
                    value: 'ACTIVE'
                }
            ]).predicate).toBe(`((coalesce(bool_or(v.status = 'ACTIVE'), false)))`);
        });
        it('should negate the selected statuses for DOES NOT CONTAIN', ()=>{
            expect(buildPredicate([
                {
                    fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.STATUSES,
                    operand: _coreworkflowfilterinput.CoreWorkflowFilterOperand.DOES_NOT_CONTAIN,
                    value: JSON.stringify([
                        _workflowworkspaceentity.WorkflowStatus.ACTIVE
                    ])
                }
            ]).predicate).toBe(`((NOT (coalesce(bool_or(v.status = 'ACTIVE'), false))))`);
        });
        it('should reject an unknown status', ()=>{
            expect(()=>buildPredicate([
                    {
                        fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.STATUSES,
                        operand: _coreworkflowfilterinput.CoreWorkflowFilterOperand.CONTAINS,
                        value: JSON.stringify([
                            'ARCHIVED'
                        ])
                    }
                ])).toThrow(_graphqlerrorsutil.UserInputError);
        });
        it('should reject an empty status selection', ()=>{
            expect(()=>buildPredicate([
                    {
                        fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.STATUSES,
                        operand: _coreworkflowfilterinput.CoreWorkflowFilterOperand.CONTAINS,
                        value: JSON.stringify([])
                    }
                ])).toThrow(_graphqlerrorsutil.UserInputError);
        });
        it.each([
            _coreworkflowfilterinput.CoreWorkflowFilterOperand.CONTAINS,
            _coreworkflowfilterinput.CoreWorkflowFilterOperand.DOES_NOT_CONTAIN,
            _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_EMPTY,
            _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_NOT_EMPTY
        ])('should match exactly the workflows computeCoreWorkflowStatuses derives for %s', (operand)=>{
            const selectedStatuses = [
                _workflowworkspaceentity.WorkflowStatus.ACTIVE,
                _workflowworkspaceentity.WorkflowStatus.DEACTIVATED
            ];
            const { predicate } = buildPredicate([
                {
                    fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.STATUSES,
                    operand,
                    value: JSON.stringify(selectedStatuses)
                }
            ]);
            for (const versionFlags of ALL_VERSION_FLAG_COMBINATIONS){
                const derivedStatuses = (0, _computecoreworkflowstatusesutil.computeCoreWorkflowStatuses)(versionFlags);
                const matchesSelection = selectedStatuses.some((status)=>derivedStatuses.includes(status));
                const expectedMatchByOperand = {
                    [_coreworkflowfilterinput.CoreWorkflowFilterOperand.CONTAINS]: matchesSelection,
                    [_coreworkflowfilterinput.CoreWorkflowFilterOperand.DOES_NOT_CONTAIN]: !matchesSelection,
                    [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_EMPTY]: derivedStatuses.length === 0,
                    [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_NOT_EMPTY]: derivedStatuses.length > 0
                };
                const expectedMatch = expectedMatchByOperand[operand];
                expect(evaluateStatusPredicate(predicate ?? '', versionFlags)).toBe(expectedMatch);
            }
        });
    });
    describe('STATUSES value shapes', ()=>{
        it('should accept a bare status string but reject a JSON encoded scalar', ()=>{
            expect(buildPredicate([
                {
                    fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.STATUSES,
                    operand: _coreworkflowfilterinput.CoreWorkflowFilterOperand.CONTAINS,
                    value: 'ACTIVE'
                }
            ]).predicate).toContain("v.status = 'ACTIVE'");
            expect(()=>buildPredicate([
                    {
                        fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.STATUSES,
                        operand: _coreworkflowfilterinput.CoreWorkflowFilterOperand.CONTAINS,
                        value: JSON.stringify('ACTIVE')
                    }
                ])).toThrow(_graphqlerrorsutil.UserInputError);
        });
    });
    describe('UPDATED_AT rules', ()=>{
        it('should bind UTC day bounds for IS when no timezone travels with the rule', ()=>{
            expect(buildPredicate([
                {
                    fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.UPDATED_AT,
                    operand: _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS,
                    value: JSON.stringify('2026-08-31T13:45:00.000Z')
                }
            ])).toEqual({
                predicate: `((c."updatedAt" >= $2::timestamptz AND c."updatedAt" < $3::timestamptz))`,
                parameters: [
                    '2026-08-31T00:00:00Z',
                    '2026-09-01T00:00:00Z'
                ]
            });
        });
        it('should bind the day bounds of the rule timezone for IS', ()=>{
            expect(buildPredicate([
                {
                    fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.UPDATED_AT,
                    operand: _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS,
                    value: JSON.stringify('2026-08-31T23:30:00.000Z'),
                    timezone: 'Asia/Tokyo'
                }
            ])).toEqual({
                predicate: `((c."updatedAt" >= $2::timestamptz AND c."updatedAt" < $3::timestamptz))`,
                parameters: [
                    '2026-08-31T15:00:00Z',
                    '2026-09-01T15:00:00Z'
                ]
            });
        });
        it('should accept a bare ISO string alongside a JSON encoded one', ()=>{
            expect(buildPredicate([
                {
                    fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.UPDATED_AT,
                    operand: _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_BEFORE,
                    value: '2026-08-31T13:45:00.000Z'
                }
            ])).toEqual({
                predicate: `(c."updatedAt" < $2::timestamptz)`,
                parameters: [
                    '2026-08-31T13:45:00.000Z'
                ]
            });
        });
        it('should build an IS AFTER predicate', ()=>{
            expect(buildPredicate([
                {
                    fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.UPDATED_AT,
                    operand: _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_AFTER,
                    value: JSON.stringify('2026-08-31T13:45:00.000Z')
                }
            ])).toEqual({
                predicate: `(c."updatedAt" >= $2::timestamptz)`,
                parameters: [
                    '2026-08-31T13:45:00.000Z'
                ]
            });
        });
        it('should build emptiness predicates', ()=>{
            expect(buildPredicate([
                {
                    fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.UPDATED_AT,
                    operand: _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_EMPTY
                }
            ])).toEqual({
                predicate: `(c."updatedAt" IS NULL)`,
                parameters: []
            });
            expect(buildPredicate([
                {
                    fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.UPDATED_AT,
                    operand: _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_NOT_EMPTY
                }
            ])).toEqual({
                predicate: `(c."updatedAt" IS NOT NULL)`,
                parameters: []
            });
        });
        it('should compare against now for the operands that take now as reference', ()=>{
            expect(buildPredicate([
                {
                    fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.UPDATED_AT,
                    operand: _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_IN_PAST
                }
            ])).toEqual({
                predicate: `(c."updatedAt" < now())`,
                parameters: []
            });
            expect(buildPredicate([
                {
                    fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.UPDATED_AT,
                    operand: _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_IN_FUTURE
                }
            ])).toEqual({
                predicate: `(c."updatedAt" > now())`,
                parameters: []
            });
            const todayPredicate = buildPredicate([
                {
                    fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.UPDATED_AT,
                    operand: _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_TODAY,
                    timezone: 'Asia/Tokyo'
                }
            ]);
            expect(todayPredicate.predicate).toBe(`((c."updatedAt" >= $2::timestamptz AND c."updatedAt" < $3::timestamptz))`);
            const [todayStart, tomorrowStart] = todayPredicate.parameters;
            const dayInMilliseconds = 24 * 60 * 60 * 1000;
            expect(new Date(tomorrowStart).getTime() - new Date(todayStart).getTime()).toBe(dayInMilliseconds);
            expect(new Date(todayStart).getTime()).toBeLessThanOrEqual(Date.now());
            expect(new Date(tomorrowStart).getTime()).toBeGreaterThan(Date.now());
        });
        it('should fall back to the rule timezone when the relative value carries none', ()=>{
            const { parameters } = buildPredicate([
                {
                    fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.UPDATED_AT,
                    operand: _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_RELATIVE,
                    value: JSON.stringify({
                        direction: 'THIS',
                        unit: 'DAY'
                    }),
                    timezone: 'Asia/Tokyo'
                }
            ]);
            const [start, end] = parameters;
            expect(new Date(end).getTime() - new Date(start).getTime()).toBe(24 * 60 * 60 * 1000);
            expect(start.endsWith('T15:00:00Z')).toBe(true);
        });
        it('should reject a relative filter carrying an invalid timezone', ()=>{
            expect(()=>buildPredicate([
                    {
                        fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.UPDATED_AT,
                        operand: _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_RELATIVE,
                        value: JSON.stringify({
                            direction: 'PAST',
                            amount: 1,
                            unit: 'DAY',
                            timezone: 'Not/AZone'
                        })
                    }
                ])).toThrow(_graphqlerrorsutil.UserInputError);
        });
        it('should resolve a relative date filter into a bound range', ()=>{
            const { predicate, parameters } = buildPredicate([
                {
                    fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.UPDATED_AT,
                    operand: _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_RELATIVE,
                    value: RELATIVE_DATE_FILTER_VALUE
                }
            ]);
            expect(predicate).toBe(`((c."updatedAt" >= $2::timestamptz AND c."updatedAt" < $3::timestamptz))`);
            const [start, end] = parameters;
            expect(new Date(end).getTime() - new Date(start).getTime()).toBe(3 * 24 * 60 * 60 * 1000);
        });
        it('should reject a relative date filter value that cannot be parsed', ()=>{
            expect(()=>buildPredicate([
                    {
                        fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.UPDATED_AT,
                        operand: _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_RELATIVE,
                        value: JSON.stringify({
                            direction: 'SOMEDAY',
                            unit: 'DAY'
                        })
                    }
                ])).toThrow(_graphqlerrorsutil.UserInputError);
        });
        it('should reject a value that is not a date', ()=>{
            expect(()=>buildPredicate([
                    {
                        fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.UPDATED_AT,
                        operand: _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_AFTER,
                        value: 'not a date'
                    }
                ])).toThrow(_graphqlerrorsutil.UserInputError);
        });
    });
    describe('supported operands', ()=>{
        const VALUE_BY_FIELD_KEY = {
            [_coreworkflowfilterinput.CoreWorkflowFilterFieldKey.NAME]: 'invoice',
            [_coreworkflowfilterinput.CoreWorkflowFilterFieldKey.STATUSES]: JSON.stringify([
                _workflowworkspaceentity.WorkflowStatus.ACTIVE
            ]),
            [_coreworkflowfilterinput.CoreWorkflowFilterFieldKey.UPDATED_AT]: JSON.stringify('2026-08-31T13:45:00.000Z')
        };
        const SUPPORTED_OPERANDS_BY_FIELD_KEY = {
            [_coreworkflowfilterinput.CoreWorkflowFilterFieldKey.NAME]: [
                _coreworkflowfilterinput.CoreWorkflowFilterOperand.CONTAINS,
                _coreworkflowfilterinput.CoreWorkflowFilterOperand.DOES_NOT_CONTAIN,
                _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_EMPTY,
                _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_NOT_EMPTY
            ],
            [_coreworkflowfilterinput.CoreWorkflowFilterFieldKey.STATUSES]: [
                _coreworkflowfilterinput.CoreWorkflowFilterOperand.CONTAINS,
                _coreworkflowfilterinput.CoreWorkflowFilterOperand.DOES_NOT_CONTAIN,
                _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_EMPTY,
                _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_NOT_EMPTY
            ],
            [_coreworkflowfilterinput.CoreWorkflowFilterFieldKey.UPDATED_AT]: [
                _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS,
                _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_BEFORE,
                _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_AFTER,
                _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_IN_PAST,
                _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_IN_FUTURE,
                _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_TODAY,
                _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_RELATIVE,
                _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_EMPTY,
                _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_NOT_EMPTY
            ]
        };
        const fieldOperandPairs = Object.values(_coreworkflowfilterinput.CoreWorkflowFilterFieldKey).flatMap((fieldKey)=>Object.values(_coreworkflowfilterinput.CoreWorkflowFilterOperand).map((operand)=>[
                    fieldKey,
                    operand
                ]));
        it.each(fieldOperandPairs)('should accept %s only with the operands its type allows (%s)', (fieldKey, operand)=>{
            const value = operand === _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_RELATIVE ? RELATIVE_DATE_FILTER_VALUE : VALUE_BY_FIELD_KEY[fieldKey];
            const build = ()=>buildPredicate([
                    {
                        fieldKey,
                        operand,
                        value
                    }
                ]);
            if (SUPPORTED_OPERANDS_BY_FIELD_KEY[fieldKey].includes(operand)) {
                expect(build().predicate).toEqual(expect.any(String));
                return;
            }
            expect(build).toThrow(_graphqlerrorsutil.UserInputError);
        });
    });
    describe('rule composition', ()=>{
        const nameRule = {
            fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.NAME,
            operand: _coreworkflowfilterinput.CoreWorkflowFilterOperand.CONTAINS,
            value: 'invoice'
        };
        const statusRule = {
            fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.STATUSES,
            operand: _coreworkflowfilterinput.CoreWorkflowFilterOperand.CONTAINS,
            value: JSON.stringify([
                _workflowworkspaceentity.WorkflowStatus.ACTIVE
            ])
        };
        it('should join rules with AND', ()=>{
            expect(buildPredicate([
                nameRule,
                statusRule
            ], _coreworkflowfilterinput.CoreWorkflowFilterLogicalOperator.AND)).toEqual({
                predicate: `(c.name ILIKE $2 ESCAPE '\\' AND (coalesce(bool_or(v.status = 'ACTIVE'), false)))`,
                parameters: [
                    '%invoice%'
                ]
            });
        });
        it('should join a row level rule and a status rule with OR', ()=>{
            expect(buildPredicate([
                nameRule,
                statusRule
            ], _coreworkflowfilterinput.CoreWorkflowFilterLogicalOperator.OR)).toEqual({
                predicate: `(c.name ILIKE $2 ESCAPE '\\' OR (coalesce(bool_or(v.status = 'ACTIVE'), false)))`,
                parameters: [
                    '%invoice%'
                ]
            });
        });
        it('should number bound parameters from the given index across rules', ()=>{
            expect((0, _buildcoreworkflowfilterpredicateutil.buildCoreWorkflowFilterPredicate)({
                filter: {
                    logicalOperator: _coreworkflowfilterinput.CoreWorkflowFilterLogicalOperator.OR,
                    rules: [
                        nameRule,
                        {
                            fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.UPDATED_AT,
                            operand: _coreworkflowfilterinput.CoreWorkflowFilterOperand.IS,
                            value: JSON.stringify('2026-08-31T13:45:00.000Z')
                        },
                        statusRule,
                        {
                            fieldKey: _coreworkflowfilterinput.CoreWorkflowFilterFieldKey.NAME,
                            operand: _coreworkflowfilterinput.CoreWorkflowFilterOperand.DOES_NOT_CONTAIN,
                            value: 'Draft'
                        }
                    ]
                },
                firstParameterIndex: 5
            })).toEqual({
                predicate: `(c.name ILIKE $5 ESCAPE '\\' OR (c."updatedAt" >= $6::timestamptz AND c."updatedAt" < $7::timestamptz) OR (coalesce(bool_or(v.status = 'ACTIVE'), false)) OR (c.name IS NULL OR c.name NOT ILIKE $8 ESCAPE '\\'))`,
                parameters: [
                    '%invoice%',
                    '2026-08-31T00:00:00Z',
                    '2026-09-01T00:00:00Z',
                    '%Draft%'
                ]
            });
        });
    });
});

//# sourceMappingURL=build-core-workflow-filter-predicate.util.spec.js.map
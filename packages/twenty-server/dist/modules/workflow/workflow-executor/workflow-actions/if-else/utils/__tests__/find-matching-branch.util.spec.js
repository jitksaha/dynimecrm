"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _workflowstepexecutorexception = require("../../../../exceptions/workflow-step-executor.exception");
const _findmatchingbranchutil = require("../find-matching-branch.util");
describe('findMatchingBranch', ()=>{
    const realGroup = {
        id: 'real-group',
        logicalOperator: _types.StepLogicalOperator.AND
    };
    const matchingFilter = (stepFilterGroupId, matches)=>({
            id: 'filter-1',
            type: 'TEXT',
            operand: 'IS',
            stepFilterGroupId,
            rightOperand: 'expected-value',
            leftOperand: matches ? 'expected-value' : 'something-else'
        });
    it('should return the branch whose filter condition evaluates to true', ()=>{
        const branches = [
            {
                id: 'branch-a',
                filterGroupId: 'real-group',
                nextStepIds: []
            }
        ];
        const matched = (0, _findmatchingbranchutil.findMatchingBranch)({
            branches,
            stepFilterGroups: [
                realGroup
            ],
            resolvedFilters: [
                matchingFilter('real-group', true)
            ]
        });
        expect(matched.id).toBe('branch-a');
    });
    it('should return the trailing else branch when no conditional branch matches', ()=>{
        const branches = [
            {
                id: 'branch-a',
                filterGroupId: 'real-group',
                nextStepIds: []
            },
            {
                id: 'branch-else',
                nextStepIds: []
            }
        ];
        const matched = (0, _findmatchingbranchutil.findMatchingBranch)({
            branches,
            stepFilterGroups: [
                realGroup
            ],
            resolvedFilters: [
                matchingFilter('real-group', false)
            ]
        });
        expect(matched.id).toBe('branch-else');
    });
    it('should throw INVALID_STEP_INPUT instead of silently matching a branch whose filterGroupId does not resolve to any stepFilterGroup', ()=>{
        const branches = [
            {
                id: 'branch-dangling',
                filterGroupId: 'group-id-not-in-stepFilterGroups',
                nextStepIds: []
            },
            {
                id: 'branch-real',
                filterGroupId: 'real-group',
                nextStepIds: []
            }
        ];
        expect(()=>(0, _findmatchingbranchutil.findMatchingBranch)({
                branches,
                stepFilterGroups: [
                    realGroup
                ],
                resolvedFilters: [
                    matchingFilter('real-group', false)
                ]
            })).toThrow(expect.objectContaining({
            code: _workflowstepexecutorexception.WorkflowStepExecutorExceptionCode.INVALID_STEP_INPUT
        }));
    });
    it('should throw for a dangling branch even when an earlier branch already matches', ()=>{
        const branches = [
            {
                id: 'branch-match',
                filterGroupId: 'real-group',
                nextStepIds: []
            },
            {
                id: 'branch-dangling',
                filterGroupId: 'group-id-not-in-stepFilterGroups',
                nextStepIds: []
            }
        ];
        expect(()=>(0, _findmatchingbranchutil.findMatchingBranch)({
                branches,
                stepFilterGroups: [
                    realGroup
                ],
                resolvedFilters: [
                    matchingFilter('real-group', true)
                ]
            })).toThrow(expect.objectContaining({
            code: _workflowstepexecutorexception.WorkflowStepExecutorExceptionCode.INVALID_STEP_INPUT
        }));
    });
    it('should throw when no branch matches and there is no else branch', ()=>{
        const branches = [
            {
                id: 'branch-a',
                filterGroupId: 'real-group',
                nextStepIds: []
            }
        ];
        expect(()=>(0, _findmatchingbranchutil.findMatchingBranch)({
                branches,
                stepFilterGroups: [
                    realGroup
                ],
                resolvedFilters: [
                    matchingFilter('real-group', false)
                ]
            })).toThrow(_workflowstepexecutorexception.WorkflowStepExecutorException);
    });
});

//# sourceMappingURL=find-matching-branch.util.spec.js.map
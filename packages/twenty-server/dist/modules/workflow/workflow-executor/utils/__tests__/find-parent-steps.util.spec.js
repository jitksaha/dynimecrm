"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _createmockworkflowstepsutil = require("../create-mock-workflow-steps.util");
const _findparentstepsutil = require("../find-parent-steps.util");
describe('findParentSteps', ()=>{
    it('should find parent via nextStepIds', ()=>{
        const parent = (0, _createmockworkflowstepsutil.createMockCodeStep)('parent', [
            'child'
        ]);
        const child = (0, _createmockworkflowstepsutil.createMockCodeStep)('child');
        const steps = [
            parent,
            child
        ];
        const result = (0, _findparentstepsutil.findParentSteps)({
            step: child,
            steps
        });
        expect(result).toEqual([
            parent
        ]);
    });
    it('should return empty array when no parent exists', ()=>{
        const stepA = (0, _createmockworkflowstepsutil.createMockCodeStep)('a');
        const stepB = (0, _createmockworkflowstepsutil.createMockCodeStep)('b');
        const steps = [
            stepA,
            stepB
        ];
        const result = (0, _findparentstepsutil.findParentSteps)({
            step: stepB,
            steps
        });
        expect(result).toEqual([]);
    });
    it('should find IF-ELSE parent via branch nextStepIds', ()=>{
        const branchChild = (0, _createmockworkflowstepsutil.createMockCodeStep)('branch-child');
        const ifElseStep = (0, _createmockworkflowstepsutil.createMockIfElseStep)('if-else', [
            {
                id: 'true-branch',
                nextStepIds: [
                    'branch-child'
                ]
            },
            {
                id: 'false-branch',
                nextStepIds: [
                    'other-child'
                ]
            }
        ]);
        const steps = [
            ifElseStep,
            branchChild
        ];
        const result = (0, _findparentstepsutil.findParentSteps)({
            step: branchChild,
            steps
        });
        expect(result).toEqual([
            ifElseStep
        ]);
    });
    it('should find IF-ELSE parent for else branch child', ()=>{
        const elseChild = (0, _createmockworkflowstepsutil.createMockCodeStep)('else-child');
        const ifElseStep = (0, _createmockworkflowstepsutil.createMockIfElseStep)('if-else', [
            {
                id: 'true-branch',
                nextStepIds: [
                    'true-child'
                ]
            },
            {
                id: 'false-branch',
                nextStepIds: [
                    'else-child'
                ]
            }
        ]);
        const steps = [
            ifElseStep,
            elseChild
        ];
        const result = (0, _findparentstepsutil.findParentSteps)({
            step: elseChild,
            steps
        });
        expect(result).toEqual([
            ifElseStep
        ]);
    });
    it('should find nested IF-ELSE parent via branch', ()=>{
        const nestedIfElse = (0, _createmockworkflowstepsutil.createMockIfElseStep)('nested-if-else', [
            {
                id: 'nested-true',
                nextStepIds: [
                    'step-y'
                ]
            },
            {
                id: 'nested-false',
                nextStepIds: [
                    'step-z'
                ]
            }
        ]);
        const outerIfElse = (0, _createmockworkflowstepsutil.createMockIfElseStep)('outer-if-else', [
            {
                id: 'outer-true',
                nextStepIds: [
                    'step-x'
                ]
            },
            {
                id: 'outer-false',
                nextStepIds: [
                    'nested-if-else'
                ]
            }
        ]);
        const steps = [
            outerIfElse,
            nestedIfElse
        ];
        const result = (0, _findparentstepsutil.findParentSteps)({
            step: nestedIfElse,
            steps
        });
        expect(result).toEqual([
            outerIfElse
        ]);
    });
    it('should handle undefined steps gracefully', ()=>{
        const parent = (0, _createmockworkflowstepsutil.createMockCodeStep)('parent', [
            'child'
        ]);
        const child = (0, _createmockworkflowstepsutil.createMockCodeStep)('child');
        const steps = [
            parent,
            undefined,
            child
        ];
        const result = (0, _findparentstepsutil.findParentSteps)({
            step: child,
            steps
        });
        expect(result).toEqual([
            parent
        ]);
    });
    it('should find multiple parents from different sources', ()=>{
        const child = (0, _createmockworkflowstepsutil.createMockCodeStep)('child');
        const standardParent = (0, _createmockworkflowstepsutil.createMockCodeStep)('standard', [
            'child'
        ]);
        const ifElseParent = (0, _createmockworkflowstepsutil.createMockIfElseStep)('if-else', [
            {
                id: 'branch',
                nextStepIds: [
                    'child'
                ]
            }
        ]);
        const steps = [
            standardParent,
            ifElseParent,
            child
        ];
        const result = (0, _findparentstepsutil.findParentSteps)({
            step: child,
            steps
        });
        expect(result).toEqual([
            standardParent,
            ifElseParent
        ]);
    });
});

//# sourceMappingURL=find-parent-steps.util.spec.js.map
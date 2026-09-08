"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _workflow = require("twenty-shared/workflow");
const _createmockworkflowstepsutil = require("../../../workflow-executor/utils/create-mock-workflow-steps.util");
const _buildretryiteratorstepinfosutil = require("../build-retry-iterator-step-infos.util");
describe('buildRetryIteratorStepInfos', ()=>{
    const iteratorStep = (0, _createmockworkflowstepsutil.createMockIteratorStep)('iterator', [
        'post'
    ], [
        'body'
    ]);
    const steps = [
        iteratorStep,
        (0, _createmockworkflowstepsutil.createMockCodeStep)('body', [
            'iterator'
        ]),
        (0, _createmockworkflowstepsutil.createMockCodeStep)('post')
    ];
    it('restores an iterator that failed mid-loop to RUNNING with its cursor preserved', ()=>{
        const iteratorStepInfo = {
            status: _workflow.StepStatus.FAILED,
            result: {
                currentItemIndex: 2,
                currentItem: 'item-2',
                hasProcessedAllItems: false
            },
            error: 'ended before completion'
        };
        const { stepInfosToUpdate, stepIdsToRetry } = (0, _buildretryiteratorstepinfosutil.buildRetryIteratorStepInfos)({
            iteratorStep,
            iteratorStepInfo,
            steps
        });
        expect(stepIdsToRetry).toEqual([]);
        expect(stepInfosToUpdate).toEqual({
            iterator: {
                status: _workflow.StepStatus.RUNNING,
                result: {
                    currentItemIndex: 2,
                    currentItem: 'item-2',
                    hasProcessedAllItems: false
                },
                error: undefined
            }
        });
    });
    it('restarts the whole loop when the iterator itself failed', ()=>{
        const iteratorStepInfo = {
            status: _workflow.StepStatus.FAILED,
            error: 'invalid items input'
        };
        const { stepInfosToUpdate, stepIdsToRetry } = (0, _buildretryiteratorstepinfosutil.buildRetryIteratorStepInfos)({
            iteratorStep,
            iteratorStepInfo,
            steps
        });
        expect(stepIdsToRetry).toEqual([
            'iterator'
        ]);
        expect(stepInfosToUpdate).toEqual({
            body: {
                status: _workflow.StepStatus.NOT_STARTED
            },
            iterator: {
                status: _workflow.StepStatus.NOT_STARTED
            }
        });
    });
});

//# sourceMappingURL=build-retry-iterator-step-infos.util.spec.js.map
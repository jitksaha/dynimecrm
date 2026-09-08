"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _workflow = require("twenty-shared/workflow");
const _createmockworkflowstepsutil = require("../../../workflow-executor/utils/create-mock-workflow-steps.util");
const _buildretrystepinfosutil = require("../build-retry-step-infos.util");
describe('buildRetryStepInfos', ()=>{
    it('resets a plain failed step to NOT_STARTED and marks it for retry', ()=>{
        const steps = [
            (0, _createmockworkflowstepsutil.createMockCodeStep)('step-1', [
                'step-2'
            ]),
            (0, _createmockworkflowstepsutil.createMockCodeStep)('step-2')
        ];
        const stepInfos = {
            'step-1': {
                status: _workflow.StepStatus.SUCCESS
            },
            'step-2': {
                status: _workflow.StepStatus.FAILED,
                error: 'boom'
            }
        };
        const { stepInfosToUpdate, stepIdsToRetry } = (0, _buildretrystepinfosutil.buildRetryStepInfos)({
            steps,
            stepInfos
        });
        expect(stepIdsToRetry).toEqual([
            'step-2'
        ]);
        expect(stepInfosToUpdate).toEqual({
            'step-2': {
                status: _workflow.StepStatus.NOT_STARTED
            }
        });
    });
    it('leaves non-failed steps untouched', ()=>{
        const steps = [
            (0, _createmockworkflowstepsutil.createMockCodeStep)('success'),
            (0, _createmockworkflowstepsutil.createMockCodeStep)('failed-safely'),
            (0, _createmockworkflowstepsutil.createMockCodeStep)('skipped')
        ];
        const stepInfos = {
            success: {
                status: _workflow.StepStatus.SUCCESS
            },
            'failed-safely': {
                status: _workflow.StepStatus.FAILED_SAFELY
            },
            skipped: {
                status: _workflow.StepStatus.SKIPPED
            }
        };
        const { stepInfosToUpdate, stepIdsToRetry } = (0, _buildretrystepinfosutil.buildRetryStepInfos)({
            steps,
            stepInfos
        });
        expect(stepIdsToRetry).toEqual([]);
        expect(stepInfosToUpdate).toEqual({});
    });
    it('restores an iterator that failed mid-loop to RUNNING and resets the failed loop body step', ()=>{
        const steps = [
            (0, _createmockworkflowstepsutil.createMockIteratorStep)('iterator', [
                'post'
            ], [
                'body'
            ]),
            (0, _createmockworkflowstepsutil.createMockCodeStep)('body', [
                'iterator'
            ]),
            (0, _createmockworkflowstepsutil.createMockCodeStep)('post')
        ];
        const stepInfos = {
            iterator: {
                status: _workflow.StepStatus.FAILED,
                result: {
                    currentItemIndex: 2,
                    currentItem: 'item-2',
                    hasProcessedAllItems: false
                },
                error: 'ended before completion'
            },
            body: {
                status: _workflow.StepStatus.FAILED,
                error: 'boom'
            },
            post: {
                status: _workflow.StepStatus.NOT_STARTED
            }
        };
        const { stepInfosToUpdate, stepIdsToRetry } = (0, _buildretrystepinfosutil.buildRetryStepInfos)({
            steps,
            stepInfos
        });
        expect(stepIdsToRetry).toEqual([
            'body'
        ]);
        expect(stepInfosToUpdate.iterator).toEqual({
            status: _workflow.StepStatus.RUNNING,
            result: {
                currentItemIndex: 2,
                currentItem: 'item-2',
                hasProcessedAllItems: false
            },
            error: undefined
        });
        expect(stepInfosToUpdate.body).toEqual({
            status: _workflow.StepStatus.NOT_STARTED
        });
    });
    it('resets the whole loop when the iterator itself failed', ()=>{
        const steps = [
            (0, _createmockworkflowstepsutil.createMockIteratorStep)('iterator', [
                'post'
            ], [
                'body'
            ]),
            (0, _createmockworkflowstepsutil.createMockCodeStep)('body', [
                'iterator'
            ]),
            (0, _createmockworkflowstepsutil.createMockCodeStep)('post')
        ];
        const stepInfos = {
            iterator: {
                status: _workflow.StepStatus.FAILED,
                error: 'invalid items input'
            },
            body: {
                status: _workflow.StepStatus.NOT_STARTED
            },
            post: {
                status: _workflow.StepStatus.NOT_STARTED
            }
        };
        const { stepInfosToUpdate, stepIdsToRetry } = (0, _buildretrystepinfosutil.buildRetryStepInfos)({
            steps,
            stepInfos
        });
        expect(stepIdsToRetry).toEqual([
            'iterator'
        ]);
        expect(stepInfosToUpdate.iterator).toEqual({
            status: _workflow.StepStatus.NOT_STARTED
        });
        expect(stepInfosToUpdate.body).toEqual({
            status: _workflow.StepStatus.NOT_STARTED
        });
    });
});

//# sourceMappingURL=build-retry-step-infos.util.spec.js.map
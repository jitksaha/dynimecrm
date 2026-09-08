"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _workflow = require("twenty-shared/workflow");
const _createmockworkflowstepsutil = require("../../../workflow-executor/utils/create-mock-workflow-steps.util");
const _getrunnablestepidsutil = require("../get-runnable-step-ids.util");
describe('getRunnableStepIds', ()=>{
    it('returns NOT_STARTED steps whose parents are satisfied', ()=>{
        const steps = [
            (0, _createmockworkflowstepsutil.createMockCodeStep)('step-1', [
                'step-2'
            ]),
            (0, _createmockworkflowstepsutil.createMockCodeStep)('step-2', [
                'step-3'
            ]),
            (0, _createmockworkflowstepsutil.createMockCodeStep)('step-3')
        ];
        const stepInfos = {
            'step-1': {
                status: _workflow.StepStatus.SUCCESS
            },
            'step-2': {
                status: _workflow.StepStatus.NOT_STARTED
            },
            'step-3': {
                status: _workflow.StepStatus.NOT_STARTED
            }
        };
        expect((0, _getrunnablestepidsutil.getRunnableStepIds)({
            steps,
            stepInfos
        })).toEqual([
            'step-2'
        ]);
    });
    it('includes entry steps with no parents', ()=>{
        const steps = [
            (0, _createmockworkflowstepsutil.createMockCodeStep)('entry')
        ];
        const stepInfos = {
            entry: {
                status: _workflow.StepStatus.NOT_STARTED
            }
        };
        expect((0, _getrunnablestepidsutil.getRunnableStepIds)({
            steps,
            stepInfos
        })).toEqual([
            'entry'
        ]);
    });
    it('excludes steps that have already started', ()=>{
        const steps = [
            (0, _createmockworkflowstepsutil.createMockCodeStep)('done')
        ];
        const stepInfos = {
            done: {
                status: _workflow.StepStatus.SUCCESS
            }
        };
        expect((0, _getrunnablestepidsutil.getRunnableStepIds)({
            steps,
            stepInfos
        })).toEqual([]);
    });
    it('excludes loop-interior steps and keeps the iterator itself', ()=>{
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
                status: _workflow.StepStatus.NOT_STARTED
            },
            body: {
                status: _workflow.StepStatus.NOT_STARTED
            },
            post: {
                status: _workflow.StepStatus.NOT_STARTED
            }
        };
        expect((0, _getrunnablestepidsutil.getRunnableStepIds)({
            steps,
            stepInfos
        })).toEqual([
            'iterator'
        ]);
    });
    it('includes a parallel branch that never started while a sibling failed and was reset', ()=>{
        const steps = [
            (0, _createmockworkflowstepsutil.createMockCodeStep)('root', [
                'branch-a',
                'branch-b'
            ]),
            (0, _createmockworkflowstepsutil.createMockCodeStep)('branch-a'),
            (0, _createmockworkflowstepsutil.createMockCodeStep)('branch-b')
        ];
        const stepInfos = {
            root: {
                status: _workflow.StepStatus.SUCCESS
            },
            'branch-a': {
                status: _workflow.StepStatus.NOT_STARTED
            },
            'branch-b': {
                status: _workflow.StepStatus.NOT_STARTED
            }
        };
        expect((0, _getrunnablestepidsutil.getRunnableStepIds)({
            steps,
            stepInfos
        })).toEqual([
            'branch-a',
            'branch-b'
        ]);
    });
});

//# sourceMappingURL=get-runnable-step-ids.util.spec.js.map
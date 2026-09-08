"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _workflowversionstepexception = require("../../../../../common/exceptions/workflow-version-step.exception");
const _extractcodesteplogicfunctionidsfromworkflowstepsutil = require("../extract-code-step-logic-function-ids-from-workflow-steps.util");
const _workflow = require("twenty-shared/workflow");
const buildCodeStep = (logicFunctionId)=>({
        id: 'step-id',
        type: _workflow.WorkflowActionType.CODE,
        settings: {
            input: {
                logicFunctionId
            }
        }
    });
const buildNonCodeStep = ()=>({
        id: 'send-email-id',
        type: _workflow.WorkflowActionType.SEND_EMAIL
    });
describe('extractCodeStepLogicFunctionIdsFromWorkflowSteps', ()=>{
    it('should return logic function ids of CODE steps', ()=>{
        const steps = [
            buildCodeStep('logic-function-1'),
            buildCodeStep('logic-function-2')
        ];
        expect((0, _extractcodesteplogicfunctionidsfromworkflowstepsutil.extractCodeStepLogicFunctionIdsFromWorkflowSteps)(steps)).toEqual([
            'logic-function-1',
            'logic-function-2'
        ]);
    });
    it('should ignore non-CODE steps', ()=>{
        const steps = [
            buildCodeStep('logic-function-1'),
            buildNonCodeStep(),
            buildCodeStep('logic-function-2')
        ];
        expect((0, _extractcodesteplogicfunctionidsfromworkflowstepsutil.extractCodeStepLogicFunctionIdsFromWorkflowSteps)(steps)).toEqual([
            'logic-function-1',
            'logic-function-2'
        ]);
    });
    it('should throw when a CODE step has an empty logic function id', ()=>{
        const steps = [
            buildCodeStep(''),
            buildCodeStep('logic-function-1')
        ];
        expect(()=>(0, _extractcodesteplogicfunctionidsfromworkflowstepsutil.extractCodeStepLogicFunctionIdsFromWorkflowSteps)(steps)).toThrow(_workflowversionstepexception.WorkflowVersionStepException);
    });
    it('should return an empty array when there are no CODE steps', ()=>{
        expect((0, _extractcodesteplogicfunctionidsfromworkflowstepsutil.extractCodeStepLogicFunctionIdsFromWorkflowSteps)([
            buildNonCodeStep()
        ])).toEqual([]);
    });
    it('should return an empty array for an empty list of steps', ()=>{
        expect((0, _extractcodesteplogicfunctionidsfromworkflowstepsutil.extractCodeStepLogicFunctionIdsFromWorkflowSteps)([])).toEqual([]);
    });
});

//# sourceMappingURL=extract-code-step-logic-function-ids-from-workflow-steps.util.spec.js.map
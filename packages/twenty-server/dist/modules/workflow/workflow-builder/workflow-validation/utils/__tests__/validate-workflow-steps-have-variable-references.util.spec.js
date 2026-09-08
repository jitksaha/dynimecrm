"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _workflow = require("twenty-shared/workflow");
const _validateworkflowstepshavevariablereferencesutil = require("../validate-workflow-steps-have-variable-references.util");
const buildStep = ({ id = 'step-1', name = 'Step 1', type, input })=>({
        id,
        name,
        type,
        settings: {
            input
        }
    });
describe('validateWorkflowStepsHaveVariableReferences', ()=>{
    it('should return no issue for an empty step list', ()=>{
        expect((0, _validateworkflowstepshavevariablereferencesutil.validateWorkflowStepsHaveVariableReferences)([])).toEqual([]);
    });
    it('should warn when a variable-consuming step references no variable', ()=>{
        const issues = (0, _validateworkflowstepshavevariablereferencesutil.validateWorkflowStepsHaveVariableReferences)([
            buildStep({
                type: _workflow.WorkflowActionType.CODE,
                input: {
                    value: 'static'
                }
            })
        ]);
        expect(issues).toHaveLength(1);
        expect(issues[0].code).toBe('STEP_HAS_NO_VARIABLE_REFERENCE');
        expect(issues[0].severity).toBe('warning');
        expect(issues[0].stepId).toBe('step-1');
    });
    it('should not warn when the step references a variable', ()=>{
        const issues = (0, _validateworkflowstepshavevariablereferencesutil.validateWorkflowStepsHaveVariableReferences)([
            buildStep({
                type: _workflow.WorkflowActionType.CODE,
                input: {
                    value: '{{step-0.output}}'
                }
            })
        ]);
        expect(issues).toEqual([]);
    });
    it('should ignore action types that do not consume variables', ()=>{
        const issues = (0, _validateworkflowstepshavevariablereferencesutil.validateWorkflowStepsHaveVariableReferences)([
            buildStep({
                type: _workflow.WorkflowActionType.FILTER,
                input: {
                    value: 'static'
                }
            })
        ]);
        expect(issues).toEqual([]);
    });
    it('should fall back to the step id when the step has no name', ()=>{
        const issues = (0, _validateworkflowstepshavevariablereferencesutil.validateWorkflowStepsHaveVariableReferences)([
            {
                id: 'unnamed-step',
                type: _workflow.WorkflowActionType.CODE,
                settings: {
                    input: {}
                }
            }
        ]);
        expect(issues[0].message).toContain('unnamed-step');
    });
    it('should report one issue per offending step', ()=>{
        const issues = (0, _validateworkflowstepshavevariablereferencesutil.validateWorkflowStepsHaveVariableReferences)([
            buildStep({
                id: 'a',
                type: _workflow.WorkflowActionType.CODE,
                input: {}
            }),
            buildStep({
                id: 'b',
                type: _workflow.WorkflowActionType.HTTP_REQUEST,
                input: {}
            }),
            buildStep({
                id: 'c',
                type: _workflow.WorkflowActionType.CODE,
                input: {
                    value: '{{a.output}}'
                }
            })
        ]);
        expect(issues.map((issue)=>issue.stepId)).toEqual([
            'a',
            'b'
        ]);
    });
    it('should not throw when settings have no input', ()=>{
        const issues = (0, _validateworkflowstepshavevariablereferencesutil.validateWorkflowStepsHaveVariableReferences)([
            {
                id: 'a',
                type: _workflow.WorkflowActionType.CODE,
                settings: {}
            }
        ]);
        expect(issues).toHaveLength(1);
    });
});

//# sourceMappingURL=validate-workflow-steps-have-variable-references.util.spec.js.map
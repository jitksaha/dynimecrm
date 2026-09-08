"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _buildworkflowrunsourceutil = require("../build-workflow-run-source.util");
describe('buildWorkflowRunSource', ()=>{
    it('should name the run after the workflow', ()=>{
        expect((0, _buildworkflowrunsourceutil.buildWorkflowRunSource)('Send invoice')).toEqual({
            source: _types.FieldActorSource.WORKFLOW,
            name: 'Send invoice',
            context: {},
            workspaceMemberId: null
        });
    });
    it('should trim the name it uses', ()=>{
        expect((0, _buildworkflowrunsourceutil.buildWorkflowRunSource)('  Send invoice  ').name).toBe('Send invoice');
    });
    it('should fall back to the default name when there is none', ()=>{
        for (const workflowName of [
            null,
            undefined,
            '',
            '   '
        ]){
            expect((0, _buildworkflowrunsourceutil.buildWorkflowRunSource)(workflowName).name).toBe('Workflow');
        }
    });
});

//# sourceMappingURL=build-workflow-run-source.util.spec.js.map
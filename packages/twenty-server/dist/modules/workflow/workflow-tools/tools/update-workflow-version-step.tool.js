"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createUpdateWorkflowVersionStepTool", {
    enumerable: true,
    get: function() {
        return createUpdateWorkflowVersionStepTool;
    }
});
const _workflow = require("twenty-shared/workflow");
const _zod = require("zod");
const _summarizevalidationutil = require("../utils/summarize-validation.util");
const updateWorkflowVersionStepSchema = _zod.z.object({
    workflowVersionId: _zod.z.string().uuid().describe('The UUID of the workflow version containing the step'),
    step: _zod.z.union([
        _workflow.workflowActionSchema
    ]).describe('The updated step configuration'),
    validate: _zod.z.boolean().optional().default(true).describe('Run a quick validation and return a compact summary (default true). Set to false when making several edits in a row, then call validate_workflow once at the end instead.')
});
const createUpdateWorkflowVersionStepTool = (deps, context)=>({
        name: 'update_workflow_version_step',
        description: 'Update an existing step in a workflow version. This modifies the step configuration. Returns a compact validation summary; for the full report with available variable paths, call validate_workflow once after your edits — not after every change.',
        inputSchema: updateWorkflowVersionStepSchema,
        execute: async (parameters)=>{
            let result;
            try {
                result = await deps.workflowVersionStepService.updateWorkflowVersionStep({
                    workspaceId: context.workspaceId,
                    workflowVersionId: parameters.workflowVersionId,
                    step: parameters.step
                });
            } catch (error) {
                return {
                    success: false,
                    error: error.message,
                    message: `Failed to update workflow version step: ${error.message}`
                };
            }
            if (parameters.validate === false) {
                return result;
            }
            try {
                const validation = await deps.workflowValidationService.validateWorkflowVersion({
                    workspaceId: context.workspaceId,
                    workflowVersionId: parameters.workflowVersionId
                });
                return {
                    ...result,
                    validation: (0, _summarizevalidationutil.summarizeValidation)(validation)
                };
            } catch (error) {
                return {
                    ...result,
                    validationError: error.message,
                    message: `Step updated successfully, but validation could not be computed: ${error.message}`
                };
            }
        }
    });

//# sourceMappingURL=update-workflow-version-step.tool.js.map
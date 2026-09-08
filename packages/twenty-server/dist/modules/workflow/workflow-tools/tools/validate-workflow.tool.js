"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createValidateWorkflowTool", {
    enumerable: true,
    get: function() {
        return createValidateWorkflowTool;
    }
});
const _zod = require("zod");
const validateWorkflowSchema = _zod.z.object({
    workflowVersionId: _zod.z.string().uuid().describe('The UUID of the workflow version to validate')
});
const createValidateWorkflowTool = (deps, context)=>({
        name: 'validate_workflow',
        description: 'Validate a workflow version for correctness. Checks graph topology (connections, reachability, branches, loops), per-step configuration, references to other objects, and variable references between steps. Returns a list of errors and warnings to fix. Does not block or modify the workflow.',
        inputSchema: validateWorkflowSchema,
        execute: async (parameters)=>{
            try {
                const result = await deps.workflowValidationService.validateWorkflowVersion({
                    workspaceId: context.workspaceId,
                    workflowVersionId: parameters.workflowVersionId
                });
                return {
                    success: true,
                    valid: result.valid,
                    errors: result.errors,
                    warnings: result.warnings,
                    message: result.valid ? 'The workflow is valid.' : `The workflow has ${result.errors.length} error(s) that should be fixed.`
                };
            } catch (error) {
                return {
                    success: false,
                    error: error.message,
                    message: `Failed to validate workflow: ${error.message}`
                };
            }
        }
    });

//# sourceMappingURL=validate-workflow.tool.js.map
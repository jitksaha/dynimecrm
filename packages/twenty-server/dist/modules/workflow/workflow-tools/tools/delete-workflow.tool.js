"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createDeleteWorkflowTool", {
    enumerable: true,
    get: function() {
        return createDeleteWorkflowTool;
    }
});
const _zod = require("zod");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _utils = require("twenty-shared/utils");
const deleteWorkflowSchema = _zod.z.object({
    workflowId: _zod.z.string().uuid().describe('The UUID of the workflow to delete')
});
const createDeleteWorkflowTool = (deps, context)=>({
        name: 'delete_workflow',
        description: 'Delete a workflow by its ID. This also removes its versions, runs and automated triggers, and deactivates any active version. Use list_workflows to find the workflowId.',
        inputSchema: deleteWorkflowSchema,
        execute: async (parameters)=>{
            try {
                const { workflowId } = parameters;
                const { workspaceId } = context;
                const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
                const deleteResult = await deps.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
                    const workflowRepository = deps.workspaceOrmManager.getRepository('workflow', context.rolePermissionConfig);
                    return workflowRepository.softDelete(workflowId);
                }, authContext);
                if (!(0, _utils.isDefined)(deleteResult.affected)) {
                    return {
                        success: false,
                        error: 'Workflow not found',
                        message: `No workflow found with ID ${workflowId}`
                    };
                }
                await deps.workflowCommonService.handleWorkflowSubEntities({
                    workflowIds: [
                        workflowId
                    ],
                    workspaceId,
                    operation: 'delete'
                });
                return {
                    success: true,
                    message: `Successfully deleted workflow ${workflowId}`,
                    workflowId
                };
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                return {
                    success: false,
                    error: errorMessage,
                    message: `Failed to delete workflow: ${errorMessage}`
                };
            }
        }
    });

//# sourceMappingURL=delete-workflow.tool.js.map
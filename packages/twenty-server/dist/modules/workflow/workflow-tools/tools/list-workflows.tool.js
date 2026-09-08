"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createListWorkflowsTool", {
    enumerable: true,
    get: function() {
        return createListWorkflowsTool;
    }
});
const _zod = require("zod");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _workflowworkspaceentity = require("../../common/standard-objects/workflow.workspace-entity");
const listWorkflowsSchema = _zod.z.object({
    status: _zod.z.nativeEnum(_workflowworkspaceentity.WorkflowStatus).optional().describe('Filter by status (DRAFT, ACTIVE, DEACTIVATED)'),
    limit: _zod.z.number().int().min(1).max(100).optional().default(50),
    offset: _zod.z.number().int().min(0).optional().default(0)
});
const createListWorkflowsTool = (deps, context)=>({
        name: 'list_workflows',
        description: 'List all workflows in the workspace. Supports filtering by status and pagination.',
        inputSchema: listWorkflowsSchema,
        execute: async (parameters)=>{
            try {
                const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(context.workspaceId);
                return await deps.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
                    const workflowRepository = deps.workspaceOrmManager.getRepository('workflow', context.rolePermissionConfig);
                    const queryBuilder = workflowRepository.createQueryBuilder('workflow');
                    if (parameters.status) {
                        queryBuilder.where(':status = ANY(workflow.statuses)', {
                            status: parameters.status
                        });
                    }
                    queryBuilder.orderBy('workflow.createdAt', 'DESC').take(parameters.limit).skip(parameters.offset);
                    const workflows = await queryBuilder.getMany();
                    const totalCount = await queryBuilder.getCount();
                    return {
                        success: true,
                        workflows: workflows.map((workflow)=>({
                                id: workflow.id,
                                name: workflow.name,
                                statuses: workflow.statuses,
                                lastPublishedVersionId: workflow.lastPublishedVersionId,
                                createdAt: workflow.createdAt,
                                updatedAt: workflow.updatedAt
                            })),
                        totalCount
                    };
                }, authContext);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                return {
                    success: false,
                    error: errorMessage,
                    message: `Failed to list workflows: ${errorMessage}`
                };
            }
        }
    });

//# sourceMappingURL=list-workflows.tool.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createListWorkflowRunsTool", {
    enumerable: true,
    get: function() {
        return createListWorkflowRunsTool;
    }
});
const _utils = require("twenty-shared/utils");
const _zod = require("zod");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _workflowrunworkspaceentity = require("../../common/standard-objects/workflow-run.workspace-entity");
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;
const listWorkflowRunsSchema = _zod.z.object({
    workflowId: _zod.z.uuid().optional().describe('Filter runs by the UUID of the workflow they belong to'),
    status: _zod.z.nativeEnum(_workflowrunworkspaceentity.WorkflowRunStatus).optional().describe('Filter runs by status (e.g. FAILED to find runs that need troubleshooting)'),
    limit: _zod.z.number().int().min(1).max(MAX_LIMIT).optional().describe(`Maximum number of runs to return (default ${DEFAULT_LIMIT})`)
});
const createListWorkflowRunsTool = (deps, context)=>({
        name: 'list_workflow_runs',
        description: 'List workflow runs, optionally filtered by workflow and/or status, ordered from most to least recent. Use this to find the relevant run (for example the latest failed run of a workflow) before inspecting it in detail with get_workflow_run.',
        inputSchema: listWorkflowRunsSchema,
        execute: async (parameters)=>{
            try {
                const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(context.workspaceId);
                return await deps.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
                    const workflowRunRepository = deps.workspaceOrmManager.getRepository('workflowRun', context.rolePermissionConfig);
                    const where = {};
                    if ((0, _utils.isDefined)(parameters.workflowId)) {
                        where.workflowId = parameters.workflowId;
                    }
                    if ((0, _utils.isDefined)(parameters.status)) {
                        where.status = parameters.status;
                    }
                    const workflowRuns = await workflowRunRepository.find({
                        where,
                        order: {
                            createdAt: 'DESC'
                        },
                        take: parameters.limit ?? DEFAULT_LIMIT
                    });
                    return {
                        success: true,
                        workflowRuns: workflowRuns.map((workflowRun)=>({
                                id: workflowRun.id,
                                name: workflowRun.name,
                                status: workflowRun.status,
                                error: workflowRun.state?.workflowRunError,
                                startedAt: workflowRun.startedAt,
                                endedAt: workflowRun.endedAt,
                                workflowId: workflowRun.workflowId,
                                workflowVersionId: workflowRun.workflowVersionId
                            }))
                    };
                }, authContext);
            } catch (error) {
                return {
                    success: false,
                    error: error.message,
                    message: `Failed to list workflow runs: ${error.message}`
                };
            }
        }
    });

//# sourceMappingURL=list-workflow-runs.tool.js.map
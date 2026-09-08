"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createGetWorkflowRunTool", {
    enumerable: true,
    get: function() {
        return createGetWorkflowRunTool;
    }
});
const _utils = require("twenty-shared/utils");
const _workflow = require("twenty-shared/workflow");
const _zod = require("zod");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const getWorkflowRunSchema = _zod.z.object({
    workflowRunId: _zod.z.uuid().describe('The UUID of the workflow run to inspect')
});
const FAILED_STEP_STATUSES = [
    _workflow.StepStatus.FAILED,
    _workflow.StepStatus.FAILED_SAFELY
];
const createGetWorkflowRunTool = (deps, context)=>({
        name: 'get_workflow_run',
        description: 'Get the details of a single workflow run for troubleshooting. Returns the overall status, the run-level error, the status and error of each step, and the execution logs of the steps that failed. Use this to diagnose why a workflow run failed or behaved unexpectedly.',
        inputSchema: getWorkflowRunSchema,
        execute: async (parameters)=>{
            try {
                const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(context.workspaceId);
                return await deps.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
                    const workflowRunRepository = deps.workspaceOrmManager.getRepository('workflowRun', context.rolePermissionConfig);
                    const workflowRun = await workflowRunRepository.findOne({
                        where: {
                            id: parameters.workflowRunId
                        }
                    });
                    if (!(0, _utils.isDefined)(workflowRun)) {
                        return {
                            success: false,
                            error: `Workflow run ${parameters.workflowRunId} not found`
                        };
                    }
                    const stepInfos = workflowRun.state?.stepInfos ?? {};
                    const steps = (workflowRun.state?.flow?.steps ?? []).map((step)=>{
                        const stepInfo = stepInfos[step.id];
                        return {
                            id: step.id,
                            name: step.name,
                            type: step.type,
                            status: stepInfo?.status,
                            error: stepInfo?.error
                        };
                    });
                    const failedStepIds = Object.entries(stepInfos).filter(([, stepInfo])=>FAILED_STEP_STATUSES.includes(stepInfo.status)).map(([stepId])=>stepId);
                    const failedStepLogs = Object.fromEntries(Object.entries(workflowRun.stepLogs ?? {}).filter(([stepId])=>failedStepIds.includes(stepId)));
                    return {
                        success: true,
                        workflowRun: {
                            id: workflowRun.id,
                            name: workflowRun.name,
                            status: workflowRun.status,
                            error: workflowRun.state?.workflowRunError,
                            startedAt: workflowRun.startedAt,
                            endedAt: workflowRun.endedAt,
                            enqueuedAt: workflowRun.enqueuedAt,
                            workflowId: workflowRun.workflowId,
                            workflowVersionId: workflowRun.workflowVersionId,
                            steps,
                            failedStepLogs
                        }
                    };
                }, authContext);
            } catch (error) {
                return {
                    success: false,
                    error: error.message,
                    message: `Failed to get workflow run: ${error.message}`
                };
            }
        }
    });

//# sourceMappingURL=get-workflow-run.tool.js.map
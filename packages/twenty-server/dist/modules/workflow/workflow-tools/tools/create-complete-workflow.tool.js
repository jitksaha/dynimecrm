"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createCreateCompleteWorkflowTool", {
    enumerable: true,
    get: function() {
        return createCreateCompleteWorkflowTool;
    }
});
const _workflow = require("twenty-shared/workflow");
const _uuid = require("uuid");
const _zod = require("zod");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _workflowversionstepexception = require("../../common/exceptions/workflow-version-step.exception");
const _workflowversionworkspaceentity = require("../../common/standard-objects/workflow-version.workspace-entity");
const _workflowworkspaceentity = require("../../common/standard-objects/workflow.workspace-entity");
const _summarizevalidationutil = require("../utils/summarize-validation.util");
const createCompleteWorkflowSchema = _zod.z.object({
    name: _zod.z.string().describe('The name of the workflow'),
    description: _zod.z.string().optional().describe('Optional description of the workflow'),
    trigger: _workflow.workflowTriggerSchema,
    steps: _zod.z.array(_workflow.workflowActionSchema).describe('Array of workflow action steps'),
    edges: _zod.z.array(_zod.z.object({
        source: _zod.z.string().describe('The ID of the source step (use "trigger" for trigger step)'),
        target: _zod.z.string().describe('The ID of the target step')
    })).optional().describe('Optional array of connections between steps'),
    activate: _zod.z.boolean().optional().describe('Whether to activate the workflow immediately (default: false)')
});
const createCreateCompleteWorkflowTool = (deps, context)=>({
        name: 'create_complete_workflow',
        description: `Create a complete workflow with trigger, steps, and connections in a single operation.

CRITICAL SCHEMA REQUIREMENTS:
- Trigger type MUST be one of: DATABASE_EVENT, MANUAL, CRON, WEBHOOK
- NEVER use "RECORD_CREATED" - this is invalid. Use "DATABASE_EVENT" instead.
- Each step MUST include: id (must be a valid UUID), name, type, valid, settings
- CREATE_RECORD actions MUST have objectName and objectRecord in settings.input
- objectRecord must contain actual field values, not just field names
- Use "trigger" as the id for the trigger step in edges
- Step positions are computed automatically; do not provide coordinates

Common mistakes to avoid:
- Using "RECORD_CREATED" instead of "DATABASE_EVENT"
- Missing the "name" and "valid" fields in steps
- Missing the "objectRecord" field in CREATE_RECORD actions
- Using "fieldsToUpdate" instead of "objectRecord" in CREATE_RECORD actions
- Including CODE steps in this tool — this tool does NOT create the underlying logic function needed by CODE steps. Instead, create the workflow without CODE steps first, then add CODE steps individually using create_workflow_version_step (which properly creates the logic function), then call update_logic_function_source to define the code.
- Including AI_AGENT steps in this tool — this tool does NOT create the underlying agent needed by AI_AGENT steps. Instead, create the workflow without AI_AGENT steps first, then add AI_AGENT steps individually using create_workflow_version_step (which properly creates the agent), then call update_agent to configure the agent.

IMPORTANT: The tool schema provides comprehensive field descriptions, examples, and validation rules. Always refer to the schema for:
- Field requirements and data types
- Common object patterns and field structures
- Proper relationship field formats
- Variable reference syntax: {{trigger.fieldName}} for trigger data, {{<step-id>.result.fieldName}} for step outputs (step-id is the step's UUID, not its name)
- Error handling options

This is the most efficient way for AI to create workflows as it handles all the complexity in one call.

The response includes a compact validation summary. For the full validation report with available variable paths, call validate_workflow once after your edits — not after every change.`,
        inputSchema: createCompleteWorkflowSchema,
        execute: async (parameters)=>{
            try {
                const codeSteps = parameters.steps.filter((step)=>step.type === 'CODE');
                if (codeSteps.length > 0) {
                    throw new _workflowversionstepexception.WorkflowVersionStepException('CODE steps cannot be created via create_complete_workflow because it does not create the underlying logic function. Use create_workflow_version_step instead.', _workflowversionstepexception.WorkflowVersionStepExceptionCode.INVALID_REQUEST);
                }
                const aiAgentSteps = parameters.steps.filter((step)=>step.type === _workflow.WorkflowActionType.AI_AGENT);
                if (aiAgentSteps.length > 0) {
                    throw new _workflowversionstepexception.WorkflowVersionStepException('AI_AGENT steps cannot be created via create_complete_workflow because it does not create the underlying agent. Use create_workflow_version_step instead, then call update_agent to configure the agent.', _workflowversionstepexception.WorkflowVersionStepExceptionCode.INVALID_REQUEST);
                }
                const workflowId = await createWorkflow({
                    deps,
                    context,
                    name: parameters.name
                });
                const workflowVersionId = await createWorkflowVersion({
                    deps,
                    context,
                    workflowId,
                    trigger: parameters.trigger,
                    steps: parameters.steps
                });
                if (parameters.edges && parameters.edges.length > 0) {
                    for (const edge of parameters.edges){
                        await deps.workflowVersionEdgeService.createWorkflowVersionEdge({
                            source: edge.source === 'trigger' ? 'trigger' : edge.source,
                            target: edge.target,
                            workflowVersionId,
                            workspaceId: context.workspaceId
                        });
                    }
                }
                await deps.workflowVersionService.autoLayoutWorkflowVersion({
                    workflowVersionId,
                    workspaceId: context.workspaceId
                });
                if (parameters.activate) {
                    await deps.workflowTriggerService.activateWorkflowVersion(workflowVersionId, context.workspaceId);
                    await updateWorkflowStatus({
                        deps,
                        context,
                        workflowId,
                        workflowVersionId
                    });
                }
                const validation = await deps.workflowValidationService.validateWorkflowDefinition({
                    workspaceId: context.workspaceId,
                    trigger: parameters.trigger,
                    steps: parameters.steps
                });
                return {
                    success: true,
                    message: `Workflow "${parameters.name}" created successfully with ${parameters.steps.length} steps`,
                    result: {
                        workflowId,
                        workflowVersionId,
                        name: parameters.name,
                        stepIds: parameters.steps.map((step)=>step.id),
                        validation: (0, _summarizevalidationutil.summarizeValidation)(validation)
                    },
                    recordReferences: [
                        {
                            objectNameSingular: 'workflow',
                            recordId: workflowId,
                            displayName: parameters.name
                        }
                    ]
                };
            } catch (error) {
                return {
                    success: false,
                    message: `Failed to create workflow "${parameters.name}": ${error.message}`,
                    error: error.message
                };
            }
        }
    });
const createWorkflow = async ({ deps, context, name })=>{
    const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(context.workspaceId);
    return deps.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
        const workflowRepository = deps.workspaceOrmManager.getRepository('workflow', context.rolePermissionConfig);
        const workflowPosition = await deps.recordPositionService.buildRecordPosition({
            value: 'first',
            objectMetadata: {
                isCustom: false,
                nameSingular: 'workflow'
            },
            workspaceId: context.workspaceId
        });
        const workflow = {
            id: (0, _uuid.v4)(),
            name,
            statuses: [
                _workflowworkspaceentity.WorkflowStatus.DRAFT
            ],
            position: workflowPosition
        };
        await workflowRepository.insert(workflow);
        return workflow.id;
    }, authContext);
};
const createWorkflowVersion = async ({ deps, context, workflowId, trigger, steps })=>{
    const workflowVersionId = (0, _uuid.v4)();
    await deps.workflowVersionCoreSyncService.writeWorkflowVersionAndMirror(context.workspaceId, async (workflowVersionRepository)=>{
        const versionPosition = await deps.recordPositionService.buildRecordPosition({
            value: 'first',
            objectMetadata: {
                isCustom: false,
                nameSingular: 'workflowVersion'
            },
            workspaceId: context.workspaceId
        });
        await workflowVersionRepository.insert({
            id: workflowVersionId,
            workflowId,
            name: 'v1',
            status: _workflowversionworkspaceentity.WorkflowVersionStatus.DRAFT,
            trigger,
            steps,
            position: versionPosition
        });
        return workflowVersionId;
    });
    return workflowVersionId;
};
const updateWorkflowStatus = async ({ deps, context, workflowId, workflowVersionId })=>{
    const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(context.workspaceId);
    await deps.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
        const workflowRepository = deps.workspaceOrmManager.getRepository('workflow', context.rolePermissionConfig);
        await workflowRepository.update(workflowId, {
            statuses: [
                _workflowworkspaceentity.WorkflowStatus.ACTIVE
            ],
            lastPublishedVersionId: workflowVersionId
        });
    }, authContext);
};

//# sourceMappingURL=create-complete-workflow.tool.js.map
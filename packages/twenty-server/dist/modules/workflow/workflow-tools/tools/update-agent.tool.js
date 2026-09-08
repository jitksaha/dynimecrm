"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createUpdateAgentTool", {
    enumerable: true,
    get: function() {
        return createUpdateAgentTool;
    }
});
const _utils = require("twenty-shared/utils");
const _workflow = require("twenty-shared/workflow");
const _zod = require("zod");
const _workflowversionworkspaceentity = require("../../common/standard-objects/workflow-version.workspace-entity");
const agentResponseFormatSchema = _zod.z.union([
    _zod.z.object({
        type: _zod.z.literal('text')
    }),
    _zod.z.object({
        type: _zod.z.literal('json'),
        schema: _zod.z.object({
            type: _zod.z.literal('object'),
            properties: _zod.z.record(_zod.z.string(), _zod.z.object({
                type: _zod.z.enum([
                    'string',
                    'number',
                    'boolean'
                ]),
                description: _zod.z.string().optional()
            })),
            required: _zod.z.array(_zod.z.string()).optional(),
            additionalProperties: _zod.z.literal(false).optional()
        })
    })
]);
const updateAgentSchema = _zod.z.object({
    agentId: _zod.z.string().uuid().describe("The ID of the agent to update (from the AI_AGENT step's settings.input.agentId)"),
    prompt: _zod.z.string().optional().describe("The agent's system prompt describing its role, behavior and the task it must accomplish."),
    modelId: _zod.z.string().optional().describe('Optional model id to use for the agent. Leave empty to keep the auto-selected model.'),
    responseFormat: agentResponseFormatSchema.optional().describe('Optional response format. Use { type: "text" } for free-form text output, or { type: "json", schema: { type: "object", properties: { fieldName: { type: "string" } } } } for structured output. Downstream steps can reference structured fields via {{stepId.fieldName}} (or {{stepId.response}} for text format).')
});
const resyncAiAgentStepOutputSchemas = async (deps, { workspaceId, agentId })=>{
    await deps.flatEntityMapsCacheService.invalidateFlatEntityMaps({
        workspaceId,
        flatMapsKeys: [
            'flatAgentMaps'
        ]
    });
    const workflowVersionRepository = deps.workspaceOrmManager.getRepository('workflowVersion', {
        shouldBypassPermissionChecks: true
    });
    const draftVersions = await workflowVersionRepository.find({
        where: {
            status: _workflowversionworkspaceentity.WorkflowVersionStatus.DRAFT
        }
    });
    for (const version of draftVersions){
        const steps = version.steps;
        if (!(0, _utils.isDefined)(steps)) {
            continue;
        }
        const matchingStep = steps.find((step)=>step.type === _workflow.WorkflowActionType.AI_AGENT && step.settings?.input?.agentId === agentId);
        if (!(0, _utils.isDefined)(matchingStep)) {
            continue;
        }
        await deps.workflowVersionStepService.updateWorkflowVersionStep({
            workspaceId,
            workflowVersionId: version.id,
            step: matchingStep
        });
    }
};
const createUpdateAgentTool = (deps, context)=>({
        name: 'update_agent',
        description: `Update the AI agent used by a workflow AI_AGENT step.

Use this tool to configure the agent created when an AI_AGENT step is added: set its system prompt, the model it should use, and the format of its output.

- prompt: the agent's system prompt (its role, behavior and task).
- modelId: optional model id; omit to keep the auto-selected model.
- responseFormat: { type: "text" } for free-form text (referenced as {{stepId.response}}), or { type: "json", schema: { ... } } for structured output whose fields can be referenced as {{stepId.fieldName}}.

To find the agentId, look at the AI_AGENT step's settings.input.agentId field.`,
        inputSchema: updateAgentSchema,
        execute: async (parameters)=>{
            try {
                const { agentId, prompt, modelId, responseFormat } = parameters;
                const { workspaceId } = context;
                const updatedAgent = await deps.agentService.updateOneAgent({
                    input: {
                        id: agentId,
                        ...(0, _utils.isDefined)(prompt) ? {
                            prompt
                        } : {},
                        ...(0, _utils.isDefined)(modelId) ? {
                            modelId: modelId
                        } : {},
                        ...(0, _utils.isDefined)(responseFormat) ? {
                            responseFormat
                        } : {}
                    },
                    workspaceId
                });
                if ((0, _utils.isDefined)(responseFormat)) {
                    try {
                        await resyncAiAgentStepOutputSchemas(deps, {
                            workspaceId,
                            agentId
                        });
                    } catch (resyncError) {
                        return {
                            success: true,
                            message: `Successfully updated agent ${agentId}, but failed to resync workflow step output schema: ${resyncError.message}`,
                            agentId: updatedAgent.id
                        };
                    }
                }
                return {
                    success: true,
                    message: `Successfully updated agent ${agentId}`,
                    agentId: updatedAgent.id
                };
            } catch (error) {
                return {
                    success: false,
                    error: error.message,
                    message: `Failed to update agent: ${error.message}`
                };
            }
        }
    });

//# sourceMappingURL=update-agent.tool.js.map
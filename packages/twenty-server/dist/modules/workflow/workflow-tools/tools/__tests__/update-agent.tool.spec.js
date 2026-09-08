"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _updateagenttool = require("../update-agent.tool");
const AGENT_ID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
const WORKSPACE_ID = 'workspace-id';
const buildAiAgentStep = (agentId, stepId = 'step-1')=>({
        id: stepId,
        name: 'AI Agent',
        type: 'AI_AGENT',
        valid: true,
        settings: {
            input: {
                agentId
            },
            outputSchema: {}
        }
    });
const buildTool = ({ draftVersions = [] } = {})=>{
    const agentService = {
        updateOneAgent: jest.fn().mockResolvedValue({
            id: AGENT_ID
        })
    };
    const workflowVersionStepService = {
        updateWorkflowVersionStep: jest.fn().mockResolvedValue(undefined)
    };
    const workflowVersionRepository = {
        find: jest.fn().mockResolvedValue(draftVersions)
    };
    const workspaceOrmManager = {
        getRepository: jest.fn().mockReturnValue(workflowVersionRepository)
    };
    const flatEntityMapsCacheService = {
        invalidateFlatEntityMaps: jest.fn().mockResolvedValue(undefined)
    };
    const tool = (0, _updateagenttool.createUpdateAgentTool)({
        agentService,
        workflowVersionStepService,
        workspaceOrmManager,
        flatEntityMapsCacheService
    }, {
        workspaceId: WORKSPACE_ID
    });
    return {
        tool,
        agentService,
        workflowVersionStepService,
        workspaceOrmManager,
        flatEntityMapsCacheService
    };
};
describe('createUpdateAgentTool', ()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
    });
    it('should resync the linked AI_AGENT step output schema when responseFormat changes', async ()=>{
        const step = buildAiAgentStep(AGENT_ID);
        const { tool, workflowVersionStepService, flatEntityMapsCacheService } = buildTool({
            draftVersions: [
                {
                    id: 'version-1',
                    status: 'DRAFT',
                    steps: [
                        step
                    ]
                }
            ]
        });
        const result = await tool.execute({
            agentId: AGENT_ID,
            responseFormat: {
                type: 'json',
                schema: {
                    type: 'object',
                    properties: {
                        summary: {
                            type: 'string'
                        }
                    }
                }
            }
        });
        expect(result.success).toBe(true);
        expect(flatEntityMapsCacheService.invalidateFlatEntityMaps).toHaveBeenCalledWith({
            workspaceId: WORKSPACE_ID,
            flatMapsKeys: [
                'flatAgentMaps'
            ]
        });
        expect(workflowVersionStepService.updateWorkflowVersionStep).toHaveBeenCalledWith({
            workspaceId: WORKSPACE_ID,
            workflowVersionId: 'version-1',
            step
        });
    });
    it('should not resync when responseFormat is not provided', async ()=>{
        const step = buildAiAgentStep(AGENT_ID);
        const { tool, workflowVersionStepService, workspaceOrmManager } = buildTool({
            draftVersions: [
                {
                    id: 'version-1',
                    status: 'DRAFT',
                    steps: [
                        step
                    ]
                }
            ]
        });
        const result = await tool.execute({
            agentId: AGENT_ID,
            prompt: 'You are a helpful assistant'
        });
        expect(result.success).toBe(true);
        expect(workspaceOrmManager.getRepository).not.toHaveBeenCalled();
        expect(workflowVersionStepService.updateWorkflowVersionStep).not.toHaveBeenCalled();
    });
    it('should skip steps referencing a different agent', async ()=>{
        const { tool, workflowVersionStepService } = buildTool({
            draftVersions: [
                {
                    id: 'version-1',
                    status: 'DRAFT',
                    steps: [
                        buildAiAgentStep('another-agent-id')
                    ]
                }
            ]
        });
        await tool.execute({
            agentId: AGENT_ID,
            responseFormat: {
                type: 'text'
            }
        });
        expect(workflowVersionStepService.updateWorkflowVersionStep).not.toHaveBeenCalled();
    });
    it('should still report agent update success when the resync fails', async ()=>{
        const step = buildAiAgentStep(AGENT_ID);
        const { tool, workflowVersionStepService } = buildTool({
            draftVersions: [
                {
                    id: 'version-1',
                    status: 'DRAFT',
                    steps: [
                        step
                    ]
                }
            ]
        });
        workflowVersionStepService.updateWorkflowVersionStep.mockRejectedValue(new Error('boom'));
        const result = await tool.execute({
            agentId: AGENT_ID,
            responseFormat: {
                type: 'text'
            }
        });
        expect(result.success).toBe(true);
        expect(result.message).toContain('failed to resync');
    });
});

//# sourceMappingURL=update-agent.tool.spec.js.map
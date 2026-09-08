"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _deleteworkflowtool = require("../delete-workflow.tool");
const WORKFLOW_ID = 'b3b8a4f0-0000-4000-8000-000000000000';
const buildTool = ()=>{
    const workflowRepository = {
        softDelete: jest.fn().mockResolvedValue({
            affected: 1
        })
    };
    const workspaceOrmManager = {
        executeInWorkspaceContext: jest.fn((callback)=>callback()),
        getRepository: jest.fn().mockReturnValue(workflowRepository)
    };
    const workflowCommonService = {
        handleWorkflowSubEntities: jest.fn().mockResolvedValue(undefined)
    };
    const tool = (0, _deleteworkflowtool.createDeleteWorkflowTool)({
        workspaceOrmManager,
        workflowCommonService
    }, {
        workspaceId: 'workspace-id',
        rolePermissionConfig: {
            shouldBypassPermissionChecks: true
        }
    });
    return {
        tool,
        workflowRepository,
        workspaceOrmManager,
        workflowCommonService
    };
};
const baseInput = {
    workflowId: WORKFLOW_ID
};
describe('createDeleteWorkflowTool', ()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
    });
    it('should soft delete the workflow and clean up sub-entities', async ()=>{
        const { tool, workflowRepository, workflowCommonService } = buildTool();
        const result = await tool.execute(baseInput);
        expect(workflowRepository.softDelete).toHaveBeenCalledWith(WORKFLOW_ID);
        expect(workflowCommonService.handleWorkflowSubEntities).toHaveBeenCalledWith({
            workflowIds: [
                WORKFLOW_ID
            ],
            workspaceId: 'workspace-id',
            operation: 'delete'
        });
        expect(result.success).toBe(true);
        expect(result.workflowId).toBe(WORKFLOW_ID);
    });
    it('should return a failure result when deletion throws', async ()=>{
        const { tool, workflowRepository } = buildTool();
        workflowRepository.softDelete.mockRejectedValue(new Error('boom'));
        const result = await tool.execute(baseInput);
        expect(result.success).toBe(false);
        expect(result.error).toBe('boom');
        expect(result.message).toContain('boom');
    });
});

//# sourceMappingURL=delete-workflow.tool.spec.js.map
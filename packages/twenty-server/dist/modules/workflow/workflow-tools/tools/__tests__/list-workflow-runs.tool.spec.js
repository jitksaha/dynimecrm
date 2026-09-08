"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _workflowrunworkspaceentity = require("../../../common/standard-objects/workflow-run.workspace-entity");
const _listworkflowrunstool = require("../list-workflow-runs.tool");
const WORKSPACE_ID = '20202020-aaaa-4d02-bf25-6aeccf7ea419';
const ROLE_ID = '20202020-cccc-4d02-bf25-6aeccf7ea419';
const buildDeps = (findResult)=>({
        workspaceOrmManager: {
            executeInWorkspaceContext: jest.fn().mockImplementation(async (fn)=>fn()),
            getRepository: jest.fn().mockReturnValue({
                find: jest.fn().mockResolvedValue(findResult)
            })
        }
    });
const buildContext = ()=>({
        workspaceId: WORKSPACE_ID,
        rolePermissionConfig: {
            intersectionOf: [
                ROLE_ID
            ]
        }
    });
describe('list_workflow_runs tool', ()=>{
    it('should pass rolePermissionConfig to getRepository', async ()=>{
        const deps = buildDeps([]);
        const context = buildContext();
        const tool = (0, _listworkflowrunstool.createListWorkflowRunsTool)(deps, context);
        await tool.execute({});
        expect(deps.workspaceOrmManager.getRepository).toHaveBeenCalledWith('workflowRun', context.rolePermissionConfig);
    });
    it('should return workflow runs on success', async ()=>{
        const workflowRuns = [
            {
                id: 'run-1',
                name: 'Run 1',
                status: _workflowrunworkspaceentity.WorkflowRunStatus.COMPLETED,
                state: {},
                startedAt: '2025-01-01T00:00:00Z',
                endedAt: '2025-01-01T00:01:00Z',
                workflowId: 'wf-1',
                workflowVersionId: 'wfv-1'
            },
            {
                id: 'run-2',
                name: 'Run 2',
                status: _workflowrunworkspaceentity.WorkflowRunStatus.FAILED,
                state: {
                    workflowRunError: 'Timeout'
                },
                startedAt: '2025-01-02T00:00:00Z',
                endedAt: '2025-01-02T00:01:00Z',
                workflowId: 'wf-1',
                workflowVersionId: 'wfv-1'
            }
        ];
        const deps = buildDeps(workflowRuns);
        const context = buildContext();
        const tool = (0, _listworkflowrunstool.createListWorkflowRunsTool)(deps, context);
        const result = await tool.execute({});
        expect(result.success).toBe(true);
        if (!('workflowRuns' in result)) {
            throw new Error('Expected workflowRuns to be present in the result');
        }
        expect(result.workflowRuns).toHaveLength(2);
        expect(result.workflowRuns[0].id).toBe('run-1');
        expect(result.workflowRuns[1].error).toBe('Timeout');
    });
    it('should apply filters when provided', async ()=>{
        const findMock = jest.fn().mockResolvedValue([]);
        const deps = {
            workspaceOrmManager: {
                executeInWorkspaceContext: jest.fn().mockImplementation(async (fn)=>fn()),
                getRepository: jest.fn().mockReturnValue({
                    find: findMock
                })
            }
        };
        const context = buildContext();
        const tool = (0, _listworkflowrunstool.createListWorkflowRunsTool)(deps, context);
        await tool.execute({
            workflowId: 'wf-1',
            status: _workflowrunworkspaceentity.WorkflowRunStatus.FAILED,
            limit: 5
        });
        expect(findMock).toHaveBeenCalledWith({
            where: {
                workflowId: 'wf-1',
                status: _workflowrunworkspaceentity.WorkflowRunStatus.FAILED
            },
            order: {
                createdAt: 'DESC'
            },
            take: 5
        });
    });
});

//# sourceMappingURL=list-workflow-runs.tool.spec.js.map
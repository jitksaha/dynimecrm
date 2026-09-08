"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _workflow = require("twenty-shared/workflow");
const _httptool = require("../../../../../../engine/core-modules/tool/tools/http-tool/http-tool");
const _httprequestworkflowaction = require("../http-request.workflow-action");
const _workflowrunsteplogworkspaceservice = require("../../../../workflow-runner/workflow-run/workflow-run-step-log.workspace-service");
const baseSettings = {
    outputSchema: {},
    errorHandlingOptions: {
        retryOnFailure: {
            value: false
        },
        continueOnFailure: {
            value: false
        }
    },
    input: {}
};
const buildHttpRequestStep = (input)=>({
        id: 'step-1',
        type: _workflow.WorkflowActionType.HTTP_REQUEST,
        name: 'HTTP Request',
        valid: true,
        settings: {
            ...baseSettings,
            input
        }
    });
describe('HttpRequestWorkflowAction', ()=>{
    let action;
    let mockHttpTool;
    let mockSetStepLog;
    beforeEach(async ()=>{
        jest.clearAllMocks();
        mockHttpTool = {
            execute: jest.fn().mockResolvedValue({
                result: {
                    ok: true
                },
                error: undefined,
                status: 200
            })
        };
        mockSetStepLog = jest.fn();
        const module = await _testing.Test.createTestingModule({
            providers: [
                _httprequestworkflowaction.HttpRequestWorkflowAction,
                {
                    provide: _httptool.HttpTool,
                    useValue: mockHttpTool
                },
                {
                    provide: _workflowrunsteplogworkspaceservice.WorkflowRunStepLogWorkspaceService,
                    useValue: {
                        setStepLog: mockSetStepLog
                    }
                }
            ]
        }).compile();
        action = module.get(_httprequestworkflowaction.HttpRequestWorkflowAction);
    });
    it('resolves variables in the request input and forwards them to the HTTP tool', async ()=>{
        await action.execute({
            currentStepId: 'step-1',
            steps: [
                buildHttpRequestStep({
                    url: 'https://api.example.com/users/{{trigger.id}}',
                    method: 'GET'
                })
            ],
            context: {
                trigger: {
                    id: '42'
                }
            },
            runInfo: {
                workspaceId: 'workspace-1',
                workflowRunId: 'run-1'
            }
        });
        expect(mockHttpTool.execute).toHaveBeenCalledWith(expect.objectContaining({
            url: 'https://api.example.com/users/42',
            method: 'GET'
        }), expect.objectContaining({
            workspaceId: 'workspace-1'
        }));
    });
    it('persists an HTTP_REQUEST step log', async ()=>{
        await action.execute({
            currentStepId: 'step-1',
            steps: [
                buildHttpRequestStep({
                    url: 'https://api.example.com/users',
                    method: 'POST',
                    body: {
                        name: 'John'
                    }
                })
            ],
            context: {},
            runInfo: {
                workspaceId: 'workspace-1',
                workflowRunId: 'run-1'
            }
        });
        expect(mockSetStepLog).toHaveBeenCalledWith(expect.objectContaining({
            workflowRunId: 'run-1',
            workspaceId: 'workspace-1',
            stepId: 'step-1',
            stepLog: expect.objectContaining({
                details: expect.objectContaining({
                    type: 'HTTP_REQUEST'
                })
            })
        }));
    });
    it('throws when the current step is not an HTTP request action', async ()=>{
        await expect(action.execute({
            currentStepId: 'step-1',
            steps: [
                {
                    ...buildHttpRequestStep({
                        url: 'https://example.com',
                        method: 'GET'
                    }),
                    type: _workflow.WorkflowActionType.SEND_EMAIL
                }
            ],
            context: {},
            runInfo: {
                workspaceId: 'workspace-1',
                workflowRunId: 'run-1'
            }
        })).rejects.toThrow('Step is not an HTTP request action');
        expect(mockHttpTool.execute).not.toHaveBeenCalled();
    });
});

//# sourceMappingURL=http-request.workflow-action.spec.js.map
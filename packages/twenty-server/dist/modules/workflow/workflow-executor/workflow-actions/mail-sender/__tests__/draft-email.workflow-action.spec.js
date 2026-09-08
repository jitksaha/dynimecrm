"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _typeorm = require("@nestjs/typeorm");
const _workflow = require("twenty-shared/workflow");
const _draftemailtool = require("../../../../../../engine/core-modules/tool/tools/email-tool/draft-email-tool");
const _userworkspaceentity = require("../../../../../../engine/core-modules/user-workspace/user-workspace.entity");
const _connectedaccountentity = require("../../../../../../engine/metadata-modules/connected-account/entities/connected-account.entity");
const _workspaceormmanager = require("../../../../../../engine/twenty-orm/workspace-orm.manager");
const _draftemailworkflowaction = require("../draft-email.workflow-action");
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
const buildDraftEmailStep = (input)=>({
        id: 'step-1',
        type: _workflow.WorkflowActionType.DRAFT_EMAIL,
        name: 'Draft Email',
        valid: true,
        settings: {
            ...baseSettings,
            input
        }
    });
const WORKSPACE_MEMBER_ID = '20202020-2222-4222-8222-222222222222';
const USER_WORKSPACE_ID = '20202020-3333-4333-8333-333333333333';
const MEMBER_ACCOUNT_ID = '20202020-5555-4555-8555-555555555555';
describe('DraftEmailWorkflowAction', ()=>{
    let action;
    let mockDraftEmailTool;
    let mockSetStepLog;
    let connectedAccountRepository;
    let userWorkspaceRepository;
    let workspaceMemberRepository;
    beforeEach(async ()=>{
        jest.clearAllMocks();
        mockDraftEmailTool = {
            execute: jest.fn().mockResolvedValue({
                result: {
                    success: true
                },
                error: undefined
            })
        };
        mockSetStepLog = jest.fn();
        connectedAccountRepository = {
            findOne: jest.fn()
        };
        userWorkspaceRepository = {
            findOne: jest.fn()
        };
        workspaceMemberRepository = {
            findOne: jest.fn()
        };
        const module = await _testing.Test.createTestingModule({
            providers: [
                _draftemailworkflowaction.DraftEmailWorkflowAction,
                {
                    provide: _draftemailtool.DraftEmailTool,
                    useValue: mockDraftEmailTool
                },
                {
                    provide: _workflowrunsteplogworkspaceservice.WorkflowRunStepLogWorkspaceService,
                    useValue: {
                        setStepLog: mockSetStepLog
                    }
                },
                {
                    provide: _workspaceormmanager.WorkspaceOrmManager,
                    useValue: {
                        executeInWorkspaceContext: jest.fn((callback)=>callback()),
                        getRepository: jest.fn().mockReturnValue(workspaceMemberRepository)
                    }
                },
                {
                    provide: (0, _typeorm.getRepositoryToken)(_connectedaccountentity.ConnectedAccountEntity),
                    useValue: connectedAccountRepository
                },
                {
                    provide: (0, _typeorm.getRepositoryToken)(_userworkspaceentity.UserWorkspaceEntity),
                    useValue: userWorkspaceRepository
                }
            ]
        }).compile();
        action = module.get(_draftemailworkflowaction.DraftEmailWorkflowAction);
    });
    it('runs the draft email tool and resolves variables in the body', async ()=>{
        await action.execute({
            currentStepId: 'step-1',
            steps: [
                buildDraftEmailStep({
                    connectedAccountId: 'account-1',
                    recipients: {
                        to: 'test@example.com'
                    },
                    subject: 'Draft Test',
                    body: '{{trigger.name}}'
                })
            ],
            context: {
                trigger: {
                    name: 'John'
                }
            },
            runInfo: {
                workspaceId: 'workspace-1',
                workflowRunId: 'run-1'
            }
        });
        expect(mockDraftEmailTool.execute).toHaveBeenCalledWith(expect.objectContaining({
            body: 'John'
        }), expect.objectContaining({
            workspaceId: 'workspace-1'
        }));
    });
    it('persists a step log tagged with the DRAFT mode', async ()=>{
        await action.execute({
            currentStepId: 'step-1',
            steps: [
                buildDraftEmailStep({
                    connectedAccountId: 'account-1',
                    recipients: {
                        to: 'test@example.com'
                    },
                    subject: 'Draft Test',
                    body: 'hello'
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
                    type: 'EMAIL',
                    mode: 'DRAFT'
                })
            })
        }));
    });
    describe('sender resolution', ()=>{
        const executeWithSender = (connectedAccountId)=>action.execute({
                currentStepId: 'step-1',
                steps: [
                    buildDraftEmailStep({
                        connectedAccountId,
                        recipients: {
                            to: 'test@example.com'
                        },
                        subject: 'Draft Test',
                        body: 'hello'
                    })
                ],
                context: {},
                runInfo: {
                    workspaceId: 'workspace-1',
                    workflowRunId: 'run-1'
                }
            });
        it("resolves a workspace member id to the member's first connected account", async ()=>{
            workspaceMemberRepository.findOne.mockResolvedValue({
                userId: 'user-1'
            });
            userWorkspaceRepository.findOne.mockResolvedValue({
                id: USER_WORKSPACE_ID
            });
            connectedAccountRepository.findOne.mockResolvedValue({
                id: MEMBER_ACCOUNT_ID
            });
            await executeWithSender(WORKSPACE_MEMBER_ID);
            expect(mockDraftEmailTool.execute).toHaveBeenCalledWith(expect.objectContaining({
                connectedAccountId: MEMBER_ACCOUNT_ID
            }), expect.any(Object));
        });
        it('passes the id through unchanged when it is not a workspace member', async ()=>{
            workspaceMemberRepository.findOne.mockResolvedValue(null);
            await executeWithSender(WORKSPACE_MEMBER_ID);
            expect(connectedAccountRepository.findOne).not.toHaveBeenCalled();
            expect(mockDraftEmailTool.execute).toHaveBeenCalledWith(expect.objectContaining({
                connectedAccountId: WORKSPACE_MEMBER_ID
            }), expect.any(Object));
        });
        it('throws when the workspace member has no connected account', async ()=>{
            workspaceMemberRepository.findOne.mockResolvedValue({
                userId: 'user-1'
            });
            userWorkspaceRepository.findOne.mockResolvedValue({
                id: USER_WORKSPACE_ID
            });
            connectedAccountRepository.findOne.mockResolvedValue(null);
            await expect(executeWithSender(WORKSPACE_MEMBER_ID)).rejects.toThrow(`No connected account found for workspace member '${WORKSPACE_MEMBER_ID}'`);
            expect(mockDraftEmailTool.execute).not.toHaveBeenCalled();
        });
    });
    it('throws when the current step is not a draft-email action', async ()=>{
        await expect(action.execute({
            currentStepId: 'step-1',
            steps: [
                {
                    ...buildDraftEmailStep({
                        connectedAccountId: 'account-1',
                        recipients: {
                            to: 'test@example.com'
                        },
                        subject: 'Wrong type'
                    }),
                    type: _workflow.WorkflowActionType.SEND_EMAIL
                }
            ],
            context: {},
            runInfo: {
                workspaceId: 'workspace-1',
                workflowRunId: 'run-1'
            }
        })).rejects.toThrow('Step is not a draft-email action');
        expect(mockDraftEmailTool.execute).not.toHaveBeenCalled();
    });
});

//# sourceMappingURL=draft-email.workflow-action.spec.js.map
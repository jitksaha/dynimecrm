"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _typeorm = require("@nestjs/typeorm");
const _workflow = require("twenty-shared/workflow");
const _sendemailtool = require("../../../../../../engine/core-modules/tool/tools/email-tool/send-email-tool");
const _userworkspaceentity = require("../../../../../../engine/core-modules/user-workspace/user-workspace.entity");
const _connectedaccountentity = require("../../../../../../engine/metadata-modules/connected-account/entities/connected-account.entity");
const _workspaceormmanager = require("../../../../../../engine/twenty-orm/workspace-orm.manager");
const _sendemailworkflowaction = require("../send-email.workflow-action");
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
const emailInput = {
    connectedAccountId: 'account-1',
    recipients: {
        to: 'test@example.com'
    },
    subject: 'Test'
};
const buildSendEmailStep = (input)=>({
        id: 'step-1',
        type: _workflow.WorkflowActionType.SEND_EMAIL,
        name: 'Send Email',
        valid: true,
        settings: {
            ...baseSettings,
            input
        }
    });
const WORKSPACE_MEMBER_ID = '20202020-2222-4222-8222-222222222222';
const USER_WORKSPACE_ID = '20202020-3333-4333-8333-333333333333';
const MEMBER_ACCOUNT_ID = '20202020-5555-4555-8555-555555555555';
describe('SendEmailWorkflowAction', ()=>{
    let action;
    let mockSendEmailTool;
    let connectedAccountRepository;
    let userWorkspaceRepository;
    let workspaceMemberRepository;
    beforeEach(async ()=>{
        jest.clearAllMocks();
        mockSendEmailTool = {
            execute: jest.fn().mockResolvedValue({
                result: {
                    success: true
                },
                error: undefined
            })
        };
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
                _sendemailworkflowaction.SendEmailWorkflowAction,
                {
                    provide: _sendemailtool.SendEmailTool,
                    useValue: mockSendEmailTool
                },
                {
                    provide: _workflowrunsteplogworkspaceservice.WorkflowRunStepLogWorkspaceService,
                    useValue: {
                        setStepLog: jest.fn()
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
        action = module.get(_sendemailworkflowaction.SendEmailWorkflowAction);
    });
    const executeWithBody = (body)=>action.execute({
            currentStepId: 'step-1',
            steps: [
                buildSendEmailStep({
                    ...emailInput,
                    body
                })
            ],
            context: {
                trigger: {
                    name: 'John',
                    email: 'john@example.com'
                }
            },
            runInfo: {
                workspaceId: 'workspace-1',
                workflowRunId: 'run-1'
            }
        });
    const executedBodyDocument = ()=>JSON.parse(mockSendEmailTool.execute.mock.calls[0][0].body);
    describe('email body handling', ()=>{
        it('should prepare TipTap JSON for the shared email compiler', async ()=>{
            const tipTapBody = JSON.stringify({
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'Hello world'
                            }
                        ]
                    }
                ]
            });
            await executeWithBody(tipTapBody);
            expect(executedBodyDocument()).toEqual(JSON.parse(tipTapBody));
        });
        it('should resolve variableTag nodes inside TipTap JSON before compilation', async ()=>{
            const tipTapBodyWithVariable = JSON.stringify({
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'variableTag',
                                attrs: {
                                    variable: '{{trigger.name}}'
                                }
                            }
                        ]
                    }
                ]
            });
            await executeWithBody(tipTapBodyWithVariable);
            expect(executedBodyDocument()).toEqual({
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'John'
                            }
                        ]
                    }
                ]
            });
        });
        it('should resolve workflow variables throughout email blocks', async ()=>{
            await executeWithBody(JSON.stringify({
                type: 'doc',
                content: [
                    {
                        type: 'button',
                        attrs: {
                            href: 'https://example.com/{{trigger.name}}'
                        },
                        content: [
                            {
                                type: 'text',
                                text: 'Open'
                            }
                        ]
                    },
                    {
                        type: 'image',
                        attrs: {
                            src: 'https://example.com/{{trigger.name}}.png',
                            alt: 'Portrait of {{trigger.name}}'
                        }
                    },
                    {
                        type: 'html',
                        attrs: {
                            html: '<p>{{trigger.name}}</p>'
                        }
                    }
                ]
            }));
            expect(executedBodyDocument()).toEqual({
                type: 'doc',
                content: [
                    {
                        type: 'button',
                        attrs: {
                            href: 'https://example.com/John'
                        },
                        content: [
                            {
                                type: 'text',
                                text: 'Open'
                            }
                        ]
                    },
                    {
                        type: 'image',
                        attrs: {
                            src: 'https://example.com/John.png',
                            alt: 'Portrait of John'
                        }
                    },
                    {
                        type: 'html',
                        attrs: {
                            html: '<p>John</p>'
                        }
                    }
                ]
            });
        });
        it('should escape workflow values inserted into raw HTML blocks', async ()=>{
            const rawHtmlBody = JSON.stringify({
                type: 'doc',
                content: [
                    {
                        type: 'html',
                        attrs: {
                            html: '<p>{{trigger.name}}</p>'
                        }
                    }
                ]
            });
            await action.execute({
                currentStepId: 'step-1',
                steps: [
                    buildSendEmailStep({
                        ...emailInput,
                        body: rawHtmlBody
                    })
                ],
                context: {
                    trigger: {
                        name: '<b>John</b>'
                    }
                },
                runInfo: {
                    workspaceId: 'workspace-1',
                    workflowRunId: 'run-1'
                }
            });
            expect(executedBodyDocument()).toEqual({
                type: 'doc',
                content: [
                    {
                        type: 'html',
                        attrs: {
                            html: '<p>&lt;b&gt;John&lt;/b&gt;</p>'
                        }
                    }
                ]
            });
        });
        it('should keep placeholders from resolved values inert', async ()=>{
            await action.execute({
                currentStepId: 'step-1',
                steps: [
                    buildSendEmailStep({
                        ...emailInput,
                        body: JSON.stringify({
                            type: 'doc',
                            content: [
                                {
                                    type: 'paragraph',
                                    content: [
                                        {
                                            type: 'text',
                                            text: '{{trigger.name}}'
                                        }
                                    ]
                                }
                            ]
                        })
                    })
                ],
                context: {
                    trigger: {
                        name: '{{trigger.email}}',
                        email: 'john@example.com'
                    }
                },
                runInfo: {
                    workspaceId: 'workspace-1',
                    workflowRunId: 'run-1'
                }
            });
            expect(executedBodyDocument()).toEqual({
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: '{{trigger.email}}'
                            }
                        ]
                    }
                ]
            });
        });
        it('should reject an invalid structured email document', async ()=>{
            await expect(executeWithBody(JSON.stringify({
                type: 'doc',
                content: [
                    {
                        type: 'unknownBlock'
                    }
                ]
            }))).rejects.toThrow('Invalid workflow email document');
            expect(mockSendEmailTool.execute).not.toHaveBeenCalled();
        });
        it('should pass plain text body through without rendering', async ()=>{
            await executeWithBody('{{trigger.name}}\n{{trigger.email}}');
            expect(mockSendEmailTool.execute).toHaveBeenCalledWith(expect.objectContaining({
                body: 'John\njohn@example.com'
            }), expect.any(Object));
        });
        it('should treat non-TipTap JSON as plain text', async ()=>{
            await executeWithBody('{"key":"value"}');
            expect(mockSendEmailTool.execute).toHaveBeenCalledWith(expect.objectContaining({
                body: '{"key":"value"}'
            }), expect.any(Object));
        });
        it('should handle empty string body without crashing', async ()=>{
            await executeWithBody('');
            expect(mockSendEmailTool.execute).toHaveBeenCalled();
        });
        it('should handle undefined body without crashing', async ()=>{
            await executeWithBody(undefined);
            expect(mockSendEmailTool.execute).toHaveBeenCalled();
        });
    });
    describe('sender resolution', ()=>{
        const executeWithSender = (connectedAccountId)=>action.execute({
                currentStepId: 'step-1',
                steps: [
                    buildSendEmailStep({
                        connectedAccountId,
                        recipients: {
                            to: 'test@example.com'
                        },
                        subject: 'Test',
                        body: 'hi'
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
            expect(mockSendEmailTool.execute).toHaveBeenCalledWith(expect.objectContaining({
                connectedAccountId: MEMBER_ACCOUNT_ID
            }), expect.any(Object));
        });
        it('passes the id through unchanged when it is not a workspace member', async ()=>{
            workspaceMemberRepository.findOne.mockResolvedValue(null);
            await executeWithSender(WORKSPACE_MEMBER_ID);
            expect(connectedAccountRepository.findOne).not.toHaveBeenCalled();
            expect(mockSendEmailTool.execute).toHaveBeenCalledWith(expect.objectContaining({
                connectedAccountId: WORKSPACE_MEMBER_ID
            }), expect.any(Object));
        });
        it('forwards the configured from handle to the email tool', async ()=>{
            await action.execute({
                currentStepId: 'step-1',
                steps: [
                    buildSendEmailStep({
                        ...emailInput,
                        fromHandle: 'sales@company.com',
                        body: 'hi'
                    })
                ],
                context: {},
                runInfo: {
                    workspaceId: 'workspace-1',
                    workflowRunId: 'run-1'
                }
            });
            expect(mockSendEmailTool.execute).toHaveBeenCalledWith(expect.objectContaining({
                fromHandle: 'sales@company.com'
            }), expect.any(Object));
        });
        it('resolves workflow variables inside the from handle', async ()=>{
            await action.execute({
                currentStepId: 'step-1',
                steps: [
                    buildSendEmailStep({
                        ...emailInput,
                        fromHandle: '{{trigger.email}}',
                        body: 'hi'
                    })
                ],
                context: {
                    trigger: {
                        email: 'john@example.com'
                    }
                },
                runInfo: {
                    workspaceId: 'workspace-1',
                    workflowRunId: 'run-1'
                }
            });
            expect(mockSendEmailTool.execute).toHaveBeenCalledWith(expect.objectContaining({
                fromHandle: 'john@example.com'
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
            expect(mockSendEmailTool.execute).not.toHaveBeenCalled();
        });
    });
    describe('step type guard', ()=>{
        it('throws when the current step is not a send-email action', async ()=>{
            await expect(action.execute({
                currentStepId: 'step-1',
                steps: [
                    {
                        ...buildSendEmailStep({
                            ...emailInput,
                            body: 'hi'
                        }),
                        type: _workflow.WorkflowActionType.DRAFT_EMAIL
                    }
                ],
                context: {},
                runInfo: {
                    workspaceId: 'workspace-1',
                    workflowRunId: 'run-1'
                }
            })).rejects.toThrow('Step is not a send-email action');
            expect(mockSendEmailTool.execute).not.toHaveBeenCalled();
        });
    });
});

//# sourceMappingURL=send-email.workflow-action.spec.js.map
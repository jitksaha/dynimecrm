"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _messagequeueservice = require("../../../../../../engine/core-modules/message-queue/services/message-queue.service");
const _workspaceormmanager = require("../../../../../../engine/twenty-orm/workspace-orm.manager");
const _workspacecacheservice = require("../../../../../../engine/workspace-cache/services/workspace-cache.service");
const _workflowautomatedtriggerworkspaceentity = require("../../../../common/standard-objects/workflow-automated-trigger.workspace-entity");
const _workflowcommonworkspaceservice = require("../../../../common/workspace-services/workflow-common.workspace-service");
const _workflowdatabaseeventtriggerlistener = require("../workflow-database-event-trigger.listener");
const _workflowtriggerjob = require("../../../jobs/workflow-trigger.job");
describe('WorkflowDatabaseEventTriggerListener', ()=>{
    let listener;
    let workspaceOrmManager;
    let messageQueueService;
    let workspaceCacheService;
    const setTriggerMap = (listeners)=>{
        workspaceCacheService.getOrRecompute.mockResolvedValue({
            workflowAutomatedTriggerMaps: {
                byWorkflowId: Object.fromEntries(listeners.map((listener)=>[
                        listener.workflowId,
                        {
                            type: _workflowautomatedtriggerworkspaceentity.AutomatedTriggerType.DATABASE_EVENT,
                            coreWorkflowVersionId: `core-version-${listener.workflowId}`,
                            workspaceWorkflowVersionId: `workspace-version-${listener.workflowId}`,
                            ...listener
                        }
                    ]))
            }
        });
    };
    const createMockFlatObjectMetadata = (overrides)=>({
            id: 'test-object-metadata',
            workspaceId: 'test-workspace',
            nameSingular: 'testObject',
            namePlural: 'testObjects',
            labelSingular: 'Test Object',
            labelPlural: 'Test Objects',
            description: 'Test object for testing',
            targetTableName: 'test_objects',
            isSystem: false,
            isActive: true,
            isRemote: false,
            isAuditLogged: true,
            isSearchable: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            icon: 'Icon123',
            universalIdentifier: 'test-object-metadata',
            fieldIds: [],
            indexMetadataIds: [],
            viewIds: [],
            applicationId: null,
            ...overrides
        });
    beforeEach(async ()=>{
        workspaceOrmManager = {
            getRepository: jest.fn().mockReturnValue({
                find: jest.fn()
            }),
            executeInWorkspaceContext: jest.fn().mockImplementation((fn, _authContext)=>fn())
        };
        messageQueueService = {
            add: jest.fn()
        };
        workspaceCacheService = {
            getOrRecompute: jest.fn().mockResolvedValue({
                workflowAutomatedTriggerMaps: {
                    byWorkflowId: {}
                }
            })
        };
        const module = await _testing.Test.createTestingModule({
            providers: [
                _workflowdatabaseeventtriggerlistener.WorkflowDatabaseEventTriggerListener,
                {
                    provide: _workspaceormmanager.WorkspaceOrmManager,
                    useValue: workspaceOrmManager
                },
                {
                    provide: _messagequeueservice.MessageQueueService,
                    useValue: messageQueueService
                },
                {
                    provide: _workspacecacheservice.WorkspaceCacheService,
                    useValue: workspaceCacheService
                },
                {
                    provide: 'MESSAGE_QUEUE_workflow-queue',
                    useValue: messageQueueService
                },
                {
                    provide: _workflowcommonworkspaceservice.WorkflowCommonWorkspaceService,
                    useValue: {
                        getWorkflowById: jest.fn(),
                        getObjectMetadataInfo: jest.fn().mockResolvedValue({
                            flatObjectMetadata: createMockFlatObjectMetadata({}),
                            flatObjectMetadataMaps: {
                                byId: {},
                                byName: {}
                            },
                            flatFieldMetadataMaps: {
                                byId: {},
                                byName: {}
                            }
                        })
                    }
                }
            ]
        }).compile();
        listener = module.get(_workflowdatabaseeventtriggerlistener.WorkflowDatabaseEventTriggerListener);
    });
    describe('handleObjectRecordUpdateEvent', ()=>{
        const workspaceId = 'test-workspace';
        const databaseEventName = 'testEvent';
        const workflowId = 'test-workflow';
        const mockPayload = {
            workspaceId,
            name: databaseEventName,
            objectMetadata: createMockFlatObjectMetadata({}),
            events: [
                {
                    recordId: 'test-record',
                    properties: {
                        updatedFields: [
                            'field1',
                            'field2'
                        ],
                        before: {
                            field1: 'old',
                            field2: 'old'
                        },
                        after: {
                            field1: 'new',
                            field2: 'new'
                        }
                    }
                }
            ]
        };
        const mockEventListeners = [
            {
                type: _workflowautomatedtriggerworkspaceentity.AutomatedTriggerType.DATABASE_EVENT,
                workflowId,
                settings: {
                    eventName: databaseEventName,
                    fields: [
                        'field1',
                        'field3'
                    ]
                }
            }
        ];
        it('should trigger workflow when fields are specified and match updated fields', async ()=>{
            setTriggerMap(mockEventListeners);
            await listener.handleObjectRecordUpdateEvent(mockPayload);
            expect(messageQueueService.add).toHaveBeenCalledWith(_workflowtriggerjob.WorkflowTriggerJob.name, {
                workspaceId,
                workflowId,
                coreWorkflowVersionId: `core-version-${workflowId}`,
                workspaceWorkflowVersionId: `workspace-version-${workflowId}`,
                payload: mockPayload.events[0]
            }, {
                retryLimit: 3
            });
        });
        it('should trigger workflow when no fields are specified', async ()=>{
            setTriggerMap([
                {
                    ...mockEventListeners[0],
                    settings: {
                        eventName: databaseEventName,
                        fields: undefined
                    }
                }
            ]);
            await listener.handleObjectRecordUpdateEvent(mockPayload);
            expect(messageQueueService.add).toHaveBeenCalled();
        });
        it('should trigger workflow when fields array is empty', async ()=>{
            setTriggerMap([
                {
                    ...mockEventListeners[0],
                    settings: {
                        eventName: databaseEventName,
                        fields: []
                    }
                }
            ]);
            await listener.handleObjectRecordUpdateEvent(mockPayload);
            expect(messageQueueService.add).toHaveBeenCalled();
        });
        it('should not trigger workflow when fields are specified but none match updated fields', async ()=>{
            setTriggerMap([
                {
                    ...mockEventListeners[0],
                    settings: {
                        eventName: databaseEventName,
                        fields: [
                            'field3',
                            'field4'
                        ]
                    }
                }
            ]);
            await listener.handleObjectRecordUpdateEvent(mockPayload);
            expect(messageQueueService.add).not.toHaveBeenCalled();
        });
        it('should handle create events correctly', async ()=>{
            const createPayload = {
                ...mockPayload,
                name: 'createEvent',
                events: [
                    {
                        ...mockPayload.events[0],
                        properties: {
                            after: {
                                field1: 'new',
                                field2: 'new'
                            }
                        }
                    }
                ]
            };
            setTriggerMap([
                {
                    type: _workflowautomatedtriggerworkspaceentity.AutomatedTriggerType.DATABASE_EVENT,
                    workflowId,
                    settings: {
                        eventName: 'createEvent'
                    }
                }
            ]);
            await listener.handleObjectRecordCreateEvent(createPayload);
            expect(messageQueueService.add).toHaveBeenCalledWith(_workflowtriggerjob.WorkflowTriggerJob.name, {
                workspaceId,
                workflowId,
                coreWorkflowVersionId: `core-version-${workflowId}`,
                workspaceWorkflowVersionId: `workspace-version-${workflowId}`,
                payload: createPayload.events[0]
            }, {
                retryLimit: 3
            });
        });
        it('should handle delete events correctly', async ()=>{
            const deletePayload = {
                ...mockPayload,
                name: 'deleteEvent',
                events: [
                    {
                        ...mockPayload.events[0],
                        properties: {
                            before: {
                                field1: 'old',
                                field2: 'old'
                            }
                        }
                    }
                ]
            };
            setTriggerMap([
                {
                    type: _workflowautomatedtriggerworkspaceentity.AutomatedTriggerType.DATABASE_EVENT,
                    workflowId,
                    settings: {
                        eventName: 'deleteEvent'
                    }
                }
            ]);
            await listener.handleObjectRecordDeleteEvent(deletePayload);
            expect(messageQueueService.add).toHaveBeenCalledWith(_workflowtriggerjob.WorkflowTriggerJob.name, {
                workspaceId,
                workflowId,
                coreWorkflowVersionId: `core-version-${workflowId}`,
                workspaceWorkflowVersionId: `workspace-version-${workflowId}`,
                payload: deletePayload.events[0]
            }, {
                retryLimit: 3
            });
        });
        it('should handle destroy events correctly', async ()=>{
            const destroyPayload = {
                ...mockPayload,
                name: 'destroyEvent',
                events: [
                    {
                        ...mockPayload.events[0],
                        properties: {
                            before: {
                                field1: 'old',
                                field2: 'old'
                            }
                        }
                    }
                ]
            };
            setTriggerMap([
                {
                    type: _workflowautomatedtriggerworkspaceentity.AutomatedTriggerType.DATABASE_EVENT,
                    workflowId,
                    settings: {
                        eventName: 'destroyEvent'
                    }
                }
            ]);
            await listener.handleObjectRecordDestroyEvent(destroyPayload);
            expect(messageQueueService.add).toHaveBeenCalledWith(_workflowtriggerjob.WorkflowTriggerJob.name, {
                workspaceId,
                workflowId,
                coreWorkflowVersionId: `core-version-${workflowId}`,
                workspaceWorkflowVersionId: `workspace-version-${workflowId}`,
                payload: destroyPayload.events[0]
            }, {
                retryLimit: 3
            });
        });
        it('should handle multiple events in a batch', async ()=>{
            const batchPayload = {
                ...mockPayload,
                events: [
                    mockPayload.events[0],
                    {
                        ...mockPayload.events[0],
                        recordId: 'test-record-2',
                        properties: {
                            updatedFields: [
                                'field1'
                            ],
                            before: {
                                field1: 'old'
                            },
                            after: {
                                field1: 'new'
                            }
                        }
                    }
                ]
            };
            setTriggerMap([
                {
                    type: _workflowautomatedtriggerworkspaceentity.AutomatedTriggerType.DATABASE_EVENT,
                    workflowId,
                    settings: {
                        eventName: databaseEventName,
                        fields: [
                            'field1'
                        ]
                    }
                }
            ]);
            await listener.handleObjectRecordUpdateEvent(batchPayload);
            expect(messageQueueService.add).toHaveBeenCalledTimes(2);
            expect(messageQueueService.add).toHaveBeenNthCalledWith(1, _workflowtriggerjob.WorkflowTriggerJob.name, {
                workspaceId,
                workflowId,
                coreWorkflowVersionId: `core-version-${workflowId}`,
                workspaceWorkflowVersionId: `workspace-version-${workflowId}`,
                payload: batchPayload.events[0]
            }, {
                retryLimit: 3
            });
            expect(messageQueueService.add).toHaveBeenNthCalledWith(2, _workflowtriggerjob.WorkflowTriggerJob.name, {
                workspaceId,
                workflowId,
                coreWorkflowVersionId: `core-version-${workflowId}`,
                workspaceWorkflowVersionId: `workspace-version-${workflowId}`,
                payload: batchPayload.events[1]
            }, {
                retryLimit: 3
            });
        });
        it('should trigger workflow for position-only updates when no fields are specified', async ()=>{
            const positionOnlyPayload = {
                ...mockPayload,
                events: [
                    {
                        ...mockPayload.events[0],
                        properties: {
                            updatedFields: [
                                'position'
                            ],
                            before: {
                                position: 1
                            },
                            after: {
                                position: 2
                            }
                        }
                    }
                ]
            };
            setTriggerMap([
                {
                    ...mockEventListeners[0],
                    settings: {
                        eventName: databaseEventName,
                        fields: undefined
                    }
                }
            ]);
            await listener.handleObjectRecordUpdateEvent(positionOnlyPayload);
            expect(messageQueueService.add).toHaveBeenCalledWith(_workflowtriggerjob.WorkflowTriggerJob.name, {
                workspaceId,
                workflowId,
                coreWorkflowVersionId: `core-version-${workflowId}`,
                workspaceWorkflowVersionId: `workspace-version-${workflowId}`,
                payload: positionOnlyPayload.events[0]
            }, {
                retryLimit: 3
            });
        });
        it('should trigger workflow when position changes alongside another field', async ()=>{
            const positionAndFieldPayload = {
                ...mockPayload,
                events: [
                    {
                        ...mockPayload.events[0],
                        properties: {
                            updatedFields: [
                                'field1',
                                'position'
                            ],
                            before: {
                                field1: 'old',
                                position: 1
                            },
                            after: {
                                field1: 'new',
                                position: 2
                            }
                        }
                    }
                ]
            };
            setTriggerMap([
                {
                    ...mockEventListeners[0],
                    settings: {
                        eventName: databaseEventName,
                        fields: undefined
                    }
                }
            ]);
            await listener.handleObjectRecordUpdateEvent(positionAndFieldPayload);
            expect(messageQueueService.add).toHaveBeenCalled();
        });
        it('should not trigger workflow for position-only updates when fields are specified', async ()=>{
            const positionOnlyPayload = {
                ...mockPayload,
                events: [
                    {
                        ...mockPayload.events[0],
                        properties: {
                            updatedFields: [
                                'position'
                            ],
                            before: {
                                position: 1
                            },
                            after: {
                                position: 2
                            }
                        }
                    }
                ]
            };
            setTriggerMap([
                {
                    ...mockEventListeners[0],
                    settings: {
                        eventName: databaseEventName,
                        fields: [
                            'field1'
                        ]
                    }
                }
            ]);
            await listener.handleObjectRecordUpdateEvent(positionOnlyPayload);
            expect(messageQueueService.add).not.toHaveBeenCalled();
        });
    });
});

//# sourceMappingURL=workflow-database-event-trigger.listener.spec.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _agentmessageentity = require("../../../ai-agent-execution/entities/agent-message.entity");
const _agentchatstreamingservice = require("../agent-chat-streaming.service");
const _aiexception = require("../../../ai.exception");
describe('AgentChatStreamingService.startHiddenKickoffStream', ()=>{
    const workspace = {
        id: 'workspace-id'
    };
    const kickoffText = 'Set up the workspace for Acme Inc';
    const kickoffThread = {
        id: 'thread-id',
        title: 'Workspace setup',
        conversationSize: 0,
        activeStreamId: null,
        lastStreamError: null,
        pendingQuestionMessageId: null
    };
    const hiddenKickoffMessageEntity = {
        id: 'kickoff-message-id',
        role: _agentmessageentity.AgentMessageRole.USER,
        status: _agentmessageentity.AgentMessageStatus.SENT,
        isHidden: true,
        parts: [
            {
                type: 'text',
                textContent: kickoffText,
                orderIndex: 0
            }
        ]
    };
    const buildService = ({ claimAffected = 1, hasConversationMessages = false, threadMessages = [
        hiddenKickoffMessageEntity
    ] } = {})=>{
        const threadRepository = {
            findOne: jest.fn().mockResolvedValue(kickoffThread),
            update: jest.fn().mockResolvedValue({
                affected: claimAffected
            })
        };
        const messageQueueService = {
            add: jest.fn().mockResolvedValue(undefined)
        };
        const agentChatService = {
            hasConversationMessages: jest.fn().mockResolvedValue(hasConversationMessages),
            ensureHiddenKickoffMessage: jest.fn().mockResolvedValue({
                id: 'kickoff-message-id',
                turnId: 'kickoff-turn-id'
            }),
            getMessagesForThread: jest.fn().mockResolvedValue(threadMessages),
            getQueuedMessages: jest.fn().mockResolvedValue([]),
            queueMessage: jest.fn().mockResolvedValue({
                id: 'queued-message-id'
            }),
            notifyThreadActivityUpdated: jest.fn().mockResolvedValue(undefined)
        };
        const streamHeartbeatService = {
            markClaimed: jest.fn().mockResolvedValue(undefined),
            isAlive: jest.fn().mockResolvedValue(true),
            clear: jest.fn().mockResolvedValue(undefined)
        };
        const metricsService = {
            incrementCounterBy: jest.fn()
        };
        const service = new _agentchatstreamingservice.AgentChatStreamingService(threadRepository, {
            find: jest.fn().mockResolvedValue([])
        }, messageQueueService, agentChatService, {
            publish: jest.fn().mockResolvedValue(undefined)
        }, {
            signFileByIdUrl: jest.fn()
        }, streamHeartbeatService, metricsService);
        return {
            service,
            threadRepository,
            messageQueueService,
            agentChatService,
            streamHeartbeatService,
            metricsService
        };
    };
    const kickoffArguments = {
        thread: kickoffThread,
        userWorkspaceId: 'user-workspace-id',
        workspace,
        text: kickoffText,
        modelId: 'default-fast-model'
    };
    it('should return null without queueing a visible copy when the claim is lost', async ()=>{
        const { service, agentChatService, messageQueueService, streamHeartbeatService } = buildService({
            claimAffected: 0
        });
        const result = await service.startHiddenKickoffStream(kickoffArguments);
        expect(result).toBeNull();
        expect(agentChatService.queueMessage).not.toHaveBeenCalled();
        expect(agentChatService.ensureHiddenKickoffMessage).not.toHaveBeenCalled();
        expect(messageQueueService.add).not.toHaveBeenCalled();
        expect(streamHeartbeatService.clear).toHaveBeenCalled();
    });
    it('should release the claim, flush the queue and return null when the thread already has conversation messages', async ()=>{
        const { service, threadRepository, agentChatService, messageQueueService } = buildService({
            hasConversationMessages: true
        });
        const result = await service.startHiddenKickoffStream(kickoffArguments);
        expect(result).toBeNull();
        expect(agentChatService.ensureHiddenKickoffMessage).not.toHaveBeenCalled();
        expect(messageQueueService.add).not.toHaveBeenCalled();
        expect(threadRepository.update).toHaveBeenCalledWith('workspace-id', {
            id: 'thread-id',
            activeStreamId: expect.any(String)
        }, {
            activeStreamId: null
        });
        expect(agentChatService.getQueuedMessages).toHaveBeenCalledWith({
            threadId: 'thread-id',
            workspaceId: 'workspace-id'
        });
    });
    it('should enqueue the hidden kickoff turn with the given model and without notifying thread activity', async ()=>{
        const { service, threadRepository, agentChatService, messageQueueService } = buildService();
        const result = await service.startHiddenKickoffStream(kickoffArguments);
        expect(agentChatService.ensureHiddenKickoffMessage).toHaveBeenCalledWith({
            threadId: 'thread-id',
            workspaceId: 'workspace-id',
            text: kickoffText
        });
        expect(agentChatService.getMessagesForThread).toHaveBeenCalledWith(expect.objectContaining({
            includeHidden: true
        }));
        expect(messageQueueService.add).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            threadId: 'thread-id',
            browsingContext: null,
            modelId: 'default-fast-model',
            lastUserMessageText: kickoffText,
            lastUserMessageParts: [
                {
                    type: 'text',
                    text: kickoffText
                }
            ],
            hasTitle: true,
            existingTurnId: 'kickoff-turn-id'
        }));
        expect(agentChatService.notifyThreadActivityUpdated).not.toHaveBeenCalled();
        expect(result).toEqual({
            streamId: expect.any(String),
            messageId: 'kickoff-message-id',
            turnId: 'kickoff-turn-id'
        });
        expect(threadRepository.update).toHaveBeenCalledWith('workspace-id', expect.objectContaining({
            id: 'thread-id'
        }), {
            activeStreamId: result?.streamId,
            lastStreamError: null
        });
    });
    it('should throw MESSAGE_NOT_FOUND and release the claim when the loaded messages do not end with the kickoff message', async ()=>{
        const staleMessageEntity = {
            ...hiddenKickoffMessageEntity,
            id: 'other-message-id'
        };
        const { service, threadRepository, messageQueueService } = buildService({
            threadMessages: [
                staleMessageEntity
            ]
        });
        await expect(service.startHiddenKickoffStream(kickoffArguments)).rejects.toMatchObject({
            code: _aiexception.AiExceptionCode.MESSAGE_NOT_FOUND
        });
        expect(messageQueueService.add).not.toHaveBeenCalled();
        expect(threadRepository.update).toHaveBeenLastCalledWith('workspace-id', {
            id: 'thread-id',
            activeStreamId: expect.any(String)
        }, {
            activeStreamId: null
        });
    });
    it('should release the claim and report an enqueue failure when adding the job fails', async ()=>{
        const { service, threadRepository, messageQueueService, streamHeartbeatService, metricsService } = buildService();
        messageQueueService.add.mockRejectedValue(new Error('redis down'));
        await expect(service.startHiddenKickoffStream(kickoffArguments)).rejects.toThrow('redis down');
        expect(threadRepository.update).toHaveBeenLastCalledWith('workspace-id', {
            id: 'thread-id',
            activeStreamId: expect.any(String)
        }, {
            activeStreamId: null
        });
        expect(streamHeartbeatService.clear).toHaveBeenCalled();
        expect(metricsService.incrementCounterBy).toHaveBeenCalledWith(expect.objectContaining({
            attributes: expect.objectContaining({
                failure_phase: 'enqueue'
            })
        }));
    });
});

//# sourceMappingURL=agent-chat-streaming.service.kickoff.spec.js.map
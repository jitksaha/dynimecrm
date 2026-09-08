"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _agentmessageentity = require("../../../ai-agent-execution/entities/agent-message.entity");
const _agentchatstreamingservice = require("../agent-chat-streaming.service");
const _aiexception = require("../../../ai.exception");
describe('AgentChatStreamingService.retryLastFailedTurn', ()=>{
    const workspace = {
        id: 'workspace-id'
    };
    const failedThread = {
        id: 'thread-id',
        title: 'Thread title',
        conversationSize: 42,
        activeStreamId: null,
        lastStreamError: {
            code: 'STREAM_EXECUTION_FAILED',
            message: 'Provider timed out',
            failedAt: '2026-01-01T00:00:00.000Z'
        }
    };
    const userMessageEntity = {
        id: 'user-message-id',
        role: _agentmessageentity.AgentMessageRole.USER,
        status: _agentmessageentity.AgentMessageStatus.SENT,
        parts: [
            {
                type: 'text',
                textContent: 'hello',
                orderIndex: 0
            }
        ],
        createdAt: new Date('2026-01-01T00:00:00.000Z')
    };
    const buildService = ({ thread = failedThread, lastUserMessage = {
        id: 'user-message-id',
        turnId: 'turn-id'
    }, threadMessages = [
        userMessageEntity
    ] } = {})=>{
        const threadRepository = {
            findOne: jest.fn().mockResolvedValue(thread),
            update: jest.fn().mockResolvedValue({
                affected: 1
            })
        };
        const messageQueueService = {
            add: jest.fn().mockResolvedValue(undefined)
        };
        const agentChatService = {
            findLatestSentUserMessage: jest.fn().mockResolvedValue(lastUserMessage),
            deleteAssistantMessagesForTurn: jest.fn().mockResolvedValue(undefined),
            getMessagesForThread: jest.fn().mockResolvedValue(threadMessages)
        };
        const streamHeartbeatService = {
            markClaimed: jest.fn().mockResolvedValue(undefined),
            isAlive: jest.fn().mockResolvedValue(true),
            clear: jest.fn().mockResolvedValue(undefined)
        };
        const service = new _agentchatstreamingservice.AgentChatStreamingService(threadRepository, {
            find: jest.fn()
        }, messageQueueService, agentChatService, {
            publish: jest.fn()
        }, {
            signFileByIdUrl: jest.fn()
        }, streamHeartbeatService, {
            incrementCounterBy: jest.fn()
        });
        return {
            service,
            threadRepository,
            messageQueueService,
            agentChatService
        };
    };
    const retryArguments = {
        threadId: 'thread-id',
        userWorkspaceId: 'user-workspace-id',
        workspace
    };
    it('rejects when the thread has no persisted stream error', async ()=>{
        const { service, messageQueueService } = buildService({
            thread: {
                ...failedThread,
                lastStreamError: null
            }
        });
        await expect(service.retryLastFailedTurn(retryArguments)).rejects.toMatchObject({
            code: _aiexception.AiExceptionCode.NO_FAILED_TURN_TO_RETRY
        });
        expect(messageQueueService.add).not.toHaveBeenCalled();
    });
    it('rejects when a stream is already active', async ()=>{
        const { service, messageQueueService } = buildService({
            thread: {
                ...failedThread,
                activeStreamId: 'stream-id'
            }
        });
        await expect(service.retryLastFailedTurn(retryArguments)).rejects.toMatchObject({
            code: _aiexception.AiExceptionCode.NO_FAILED_TURN_TO_RETRY
        });
        expect(messageQueueService.add).not.toHaveBeenCalled();
    });
    it('rejects and restores the error state when a newer message exists', async ()=>{
        const newerAssistantMessage = {
            ...userMessageEntity,
            id: 'newer-message-id',
            role: _agentmessageentity.AgentMessageRole.ASSISTANT
        };
        const { service, threadRepository, messageQueueService } = buildService({
            threadMessages: [
                userMessageEntity,
                newerAssistantMessage
            ]
        });
        await expect(service.retryLastFailedTurn(retryArguments)).rejects.toMatchObject({
            code: _aiexception.AiExceptionCode.NO_FAILED_TURN_TO_RETRY
        });
        expect(messageQueueService.add).not.toHaveBeenCalled();
        expect(threadRepository.update).toHaveBeenLastCalledWith('workspace-id', {
            id: 'thread-id',
            activeStreamId: expect.any(String)
        }, {
            activeStreamId: null,
            lastStreamError: failedThread.lastStreamError
        });
    });
    it('drops the failed output, re-enqueues the turn, and clears the error', async ()=>{
        const { service, threadRepository, messageQueueService, agentChatService } = buildService();
        const result = await service.retryLastFailedTurn({
            ...retryArguments,
            modelId: 'model-id'
        });
        expect(agentChatService.deleteAssistantMessagesForTurn).toHaveBeenCalledWith({
            turnId: 'turn-id',
            workspaceId: 'workspace-id'
        });
        expect(messageQueueService.add).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            threadId: 'thread-id',
            existingTurnId: 'turn-id',
            lastUserMessageText: 'hello',
            modelId: 'model-id',
            hasTitle: true,
            conversationSizeTokens: 42
        }));
        expect(threadRepository.update).toHaveBeenCalledWith('workspace-id', expect.objectContaining({
            id: 'thread-id'
        }), {
            activeStreamId: result.streamId,
            lastStreamError: null
        });
        expect(result.messageId).toBe('user-message-id');
        expect(result.turnId).toBe('turn-id');
    });
    it('should retry the hidden kickoff turn when the thread only contains the kickoff message', async ()=>{
        const hiddenKickoffMessageEntity = {
            id: 'kickoff-message-id',
            role: _agentmessageentity.AgentMessageRole.USER,
            status: _agentmessageentity.AgentMessageStatus.SENT,
            isHidden: true,
            parts: [
                {
                    type: 'text',
                    textContent: 'kickoff prompt',
                    orderIndex: 0
                }
            ]
        };
        const { service, threadRepository, messageQueueService, agentChatService } = buildService({
            lastUserMessage: {
                id: 'kickoff-message-id',
                turnId: 'kickoff-turn-id',
                processedAt: new Date('2026-01-01T00:00:01.000Z')
            },
            threadMessages: [
                hiddenKickoffMessageEntity
            ]
        });
        const result = await service.retryLastFailedTurn(retryArguments);
        expect(threadRepository.update).toHaveBeenCalledWith('workspace-id', expect.objectContaining({
            id: 'thread-id'
        }), {
            activeStreamId: result.streamId,
            lastStreamError: null
        });
        expect(agentChatService.deleteAssistantMessagesForTurn).toHaveBeenCalledWith({
            turnId: 'kickoff-turn-id',
            workspaceId: 'workspace-id'
        });
        expect(messageQueueService.add).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            existingTurnId: 'kickoff-turn-id',
            lastUserMessageText: 'kickoff prompt',
            hasTitle: true
        }));
        expect(result.messageId).toBe('kickoff-message-id');
        expect(result.turnId).toBe('kickoff-turn-id');
    });
});

//# sourceMappingURL=agent-chat-streaming.service.retry.spec.js.map
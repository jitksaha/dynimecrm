"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AgentChatStreamingService", {
    enumerable: true,
    get: function() {
        return AgentChatStreamingService;
    }
});
const _common = require("@nestjs/common");
const _ai = require("ai");
const _ai1 = require("twenty-shared/ai");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _fileentity = require("../../../../core-modules/file/entities/file.entity");
const _fileurlservice = require("../../../../core-modules/file/file-url/file-url.service");
const _messagequeuedecorator = require("../../../../core-modules/message-queue/decorators/message-queue.decorator");
const _messagequeueconstants = require("../../../../core-modules/message-queue/message-queue.constants");
const _messagequeueservice = require("../../../../core-modules/message-queue/services/message-queue.service");
const _metricsservice = require("../../../../core-modules/metrics/metrics.service");
const _metricskeystype = require("../../../../core-modules/metrics/types/metrics-keys.type");
const _agentmessageentity = require("../../ai-agent-execution/entities/agent-message.entity");
const _mapDBPartsToUIMessageParts = require("../../ai-agent-execution/utils/mapDBPartsToUIMessageParts");
const _agentchatthreadentity = require("../entities/agent-chat-thread.entity");
const _streamagentchatjobnameconstant = require("../jobs/stream-agent-chat-job-name.constant");
const _agentchateventpublisherservice = require("./agent-chat-event-publisher.service");
const _agentchatstreamheartbeatservice = require("./agent-chat-stream-heartbeat.service");
const _agentchatservice = require("./agent-chat.service");
const _maperrortostreamerrorutil = require("../utils/map-error-to-stream-error.util");
const _aiexception = require("../../ai.exception");
const _injectworkspacescopedrepositorydecorator = require("../../../../twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../../../twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let AgentChatStreamingService = class AgentChatStreamingService {
    async reapDeadStream({ thread, workspaceId }) {
        if (!(0, _utils.isDefined)(thread.activeStreamId)) {
            return null;
        }
        if (await this.streamHeartbeatService.isAlive(thread.activeStreamId)) {
            return null;
        }
        const interruptedError = {
            code: _aiexception.AiExceptionCode.STREAM_INTERRUPTED,
            message: 'The response was interrupted before it could finish.',
            failedAt: new Date().toISOString()
        };
        const reap = await this.threadRepository.update(workspaceId, {
            id: thread.id,
            activeStreamId: thread.activeStreamId
        }, {
            activeStreamId: null,
            lastStreamError: interruptedError
        });
        if (!reap.affected) {
            return null;
        }
        this.metricsService.incrementCounterBy({
            key: _metricskeystype.MetricsKeys.AiChatTurnFailed,
            amount: 1,
            attributes: {
                failure_phase: 'interrupted',
                error_code: interruptedError.code
            }
        });
        await this.eventPublisherService.resetStreamState(thread.id);
        await this.eventPublisherService.publish({
            threadId: thread.id,
            workspaceId,
            event: {
                type: 'stream-error',
                code: interruptedError.code,
                message: interruptedError.message
            }
        }).catch(()=>{});
        return interruptedError;
    }
    async tryClaimStream({ threadId, workspaceId, streamId, where }) {
        await this.streamHeartbeatService.markClaimed(streamId);
        const claim = await this.threadRepository.update(workspaceId, {
            id: threadId,
            activeStreamId: (0, _typeorm.IsNull)(),
            ...where
        }, {
            activeStreamId: streamId,
            lastStreamError: null
        });
        if (!claim.affected) {
            await this.streamHeartbeatService.clear(streamId);
            return false;
        }
        return true;
    }
    async streamAgentChat({ threadId, userWorkspaceId, workspace, text, browsingContext, modelId, messageId, fileAttachments }) {
        const thread = await this.threadRepository.findOne(workspace.id, {
            where: {
                id: threadId,
                userWorkspaceId
            }
        });
        if (!thread) {
            throw new _aiexception.AiException('Thread not found', _aiexception.AiExceptionCode.THREAD_NOT_FOUND);
        }
        const hasQueuedBacklog = await this.agentChatService.hasQueuedMessages({
            threadId,
            workspaceId: workspace.id
        });
        const streamId = (0, _ai.generateId)();
        const claimed = !hasQueuedBacklog && await this.tryClaimStream({
            threadId,
            workspaceId: workspace.id,
            streamId,
            where: {
                pendingQuestionMessageId: (0, _typeorm.IsNull)()
            }
        });
        if (!claimed) {
            const queuedMessage = await this.agentChatService.queueMessage({
                threadId,
                text,
                id: messageId,
                fileAttachments,
                workspaceId: workspace.id,
                userWorkspaceId
            });
            if (hasQueuedBacklog) {
                await this.flushNextQueuedMessage(threadId, userWorkspaceId, workspace.id, !!thread.title);
            }
            return {
                queued: true,
                messageId: queuedMessage.id
            };
        }
        try {
            const fileParts = await this.buildFilePartsFromAttachments(fileAttachments, workspace.id);
            const userMessageParts = [
                {
                    type: 'text',
                    text
                },
                ...fileParts
            ];
            const savedUserMessage = await this.agentChatService.addMessage({
                threadId,
                id: messageId,
                uiMessage: {
                    role: _agentmessageentity.AgentMessageRole.USER,
                    parts: userMessageParts
                },
                workspaceId: workspace.id
            });
            await this.agentChatService.notifyThreadActivityUpdated({
                threadId,
                userWorkspaceId,
                workspaceId: workspace.id
            });
            const previousMessages = await this.loadMessagesFromDB(threadId, userWorkspaceId, workspace.id);
            await this.messageQueueService.add(_streamagentchatjobnameconstant.STREAM_AGENT_CHAT_JOB_NAME, {
                threadId: thread.id,
                streamId,
                userWorkspaceId,
                workspaceId: workspace.id,
                messages: previousMessages,
                browsingContext,
                modelId,
                lastUserMessageText: text,
                lastUserMessageParts: userMessageParts,
                hasTitle: !!thread.title,
                conversationSizeTokens: thread.conversationSize,
                existingTurnId: savedUserMessage.turnId ?? undefined
            });
            return {
                queued: false,
                streamId,
                messageId: savedUserMessage.id,
                turnId: savedUserMessage.turnId
            };
        } catch (error) {
            await this.releaseStreamClaim(threadId, workspace.id, streamId);
            const streamError = (0, _maperrortostreamerrorutil.mapErrorToStreamError)(error);
            this.metricsService.incrementCounterBy({
                key: _metricskeystype.MetricsKeys.AiChatTurnFailed,
                amount: 1,
                attributes: {
                    model: modelId ?? 'unknown',
                    failure_phase: 'enqueue',
                    error_code: streamError.code
                }
            });
            throw error;
        }
    }
    async startHiddenKickoffStream({ thread, userWorkspaceId, workspace, text, modelId }) {
        const threadId = thread.id;
        const streamId = (0, _ai.generateId)();
        const hasClaimedStreamForKickoff = await this.tryClaimStream({
            threadId,
            workspaceId: workspace.id,
            streamId,
            where: {
                pendingQuestionMessageId: (0, _typeorm.IsNull)()
            }
        });
        if (!hasClaimedStreamForKickoff) {
            return null;
        }
        try {
            const hasConversationMessages = await this.agentChatService.hasConversationMessages({
                threadId,
                workspaceId: workspace.id
            });
            if (hasConversationMessages) {
                await this.releaseStreamClaim(threadId, workspace.id, streamId);
                await this.flushNextQueuedMessage(threadId, userWorkspaceId, workspace.id, !!thread.title);
                return null;
            }
            const { id: messageId, turnId } = await this.agentChatService.ensureHiddenKickoffMessage({
                threadId,
                workspaceId: workspace.id,
                text
            });
            const messages = await this.loadMessagesFromDB(threadId, userWorkspaceId, workspace.id);
            const kickoffMessage = messages[messages.length - 1];
            if (!kickoffMessage || kickoffMessage.id !== messageId) {
                throw new _aiexception.AiException('Workspace setup kickoff message could not be loaded', _aiexception.AiExceptionCode.MESSAGE_NOT_FOUND);
            }
            await this.messageQueueService.add(_streamagentchatjobnameconstant.STREAM_AGENT_CHAT_JOB_NAME, {
                threadId,
                streamId,
                userWorkspaceId,
                workspaceId: workspace.id,
                messages,
                browsingContext: null,
                modelId,
                lastUserMessageText: text,
                lastUserMessageParts: [
                    {
                        type: 'text',
                        text
                    }
                ],
                hasTitle: !!thread.title,
                conversationSizeTokens: thread.conversationSize,
                existingTurnId: turnId
            });
            return {
                streamId,
                messageId,
                turnId
            };
        } catch (error) {
            await this.releaseStreamClaim(threadId, workspace.id, streamId);
            const streamError = (0, _maperrortostreamerrorutil.mapErrorToStreamError)(error);
            this.metricsService.incrementCounterBy({
                key: _metricskeystype.MetricsKeys.AiChatTurnFailed,
                amount: 1,
                attributes: {
                    model: modelId,
                    failure_phase: 'enqueue',
                    error_code: streamError.code
                }
            });
            throw error;
        }
    }
    async retryLastFailedTurn({ threadId, userWorkspaceId, workspace, modelId }) {
        const thread = await this.threadRepository.findOne(workspace.id, {
            where: {
                id: threadId,
                userWorkspaceId
            }
        });
        if (!thread) {
            throw new _aiexception.AiException('Thread not found', _aiexception.AiExceptionCode.THREAD_NOT_FOUND);
        }
        if (!(0, _utils.isDefined)(thread.lastStreamError) || (0, _utils.isDefined)(thread.activeStreamId)) {
            throw new _aiexception.AiException('There is no failed turn to retry on this thread', _aiexception.AiExceptionCode.NO_FAILED_TURN_TO_RETRY);
        }
        const streamId = (0, _ai.generateId)();
        const claimed = await this.tryClaimStream({
            threadId,
            workspaceId: workspace.id,
            streamId,
            where: {
                lastStreamError: (0, _typeorm.Not)((0, _typeorm.IsNull)())
            }
        });
        if (!claimed) {
            throw new _aiexception.AiException('There is no failed turn to retry on this thread', _aiexception.AiExceptionCode.NO_FAILED_TURN_TO_RETRY);
        }
        try {
            const lastUserMessage = await this.agentChatService.findLatestSentUserMessage({
                threadId,
                workspaceId: workspace.id
            });
            if (!(0, _utils.isDefined)(lastUserMessage) || !(0, _utils.isDefined)(lastUserMessage.turnId)) {
                throw new _aiexception.AiException('There is no failed turn to retry on this thread', _aiexception.AiExceptionCode.NO_FAILED_TURN_TO_RETRY);
            }
            await this.agentChatService.deleteAssistantMessagesForTurn({
                turnId: lastUserMessage.turnId,
                workspaceId: workspace.id
            });
            const messages = await this.loadMessagesFromDB(threadId, userWorkspaceId, workspace.id);
            const retriedMessage = messages[messages.length - 1];
            if (!retriedMessage || retriedMessage.id !== lastUserMessage.id) {
                throw new _aiexception.AiException('There is no failed turn to retry on this thread', _aiexception.AiExceptionCode.NO_FAILED_TURN_TO_RETRY);
            }
            const textPart = retriedMessage.parts.find((part)=>part.type === 'text');
            await this.messageQueueService.add(_streamagentchatjobnameconstant.STREAM_AGENT_CHAT_JOB_NAME, {
                threadId,
                streamId,
                userWorkspaceId,
                workspaceId: workspace.id,
                messages,
                browsingContext: null,
                modelId,
                lastUserMessageText: textPart?.text ?? '',
                lastUserMessageParts: retriedMessage.parts,
                hasTitle: !!thread.title,
                conversationSizeTokens: thread.conversationSize,
                existingTurnId: lastUserMessage.turnId
            });
            return {
                streamId,
                messageId: lastUserMessage.id,
                turnId: lastUserMessage.turnId
            };
        } catch (error) {
            await this.releaseStreamClaim(threadId, workspace.id, streamId, {
                lastStreamError: thread.lastStreamError
            });
            const streamError = (0, _maperrortostreamerrorutil.mapErrorToStreamError)(error);
            this.metricsService.incrementCounterBy({
                key: _metricskeystype.MetricsKeys.AiChatTurnFailed,
                amount: 1,
                attributes: {
                    model: modelId ?? 'unknown',
                    failure_phase: 'enqueue',
                    error_code: streamError.code
                }
            });
            throw error;
        }
    }
    async answerPendingQuestionAndResumeStream({ threadId, messageId, answers, userWorkspaceId, workspace, modelId, fileAttachments }) {
        const thread = await this.threadRepository.findOne(workspace.id, {
            where: {
                id: threadId
            },
            select: [
                'id',
                'activeStreamId'
            ]
        });
        if ((0, _utils.isDefined)(thread)) {
            await this.reapDeadStream({
                thread,
                workspaceId: workspace.id
            });
        }
        const streamId = (0, _ai.generateId)();
        await this.streamHeartbeatService.markClaimed(streamId);
        let resolved;
        try {
            resolved = await this.agentChatService.resolvePendingQuestion({
                threadId,
                messageId,
                answers,
                streamId,
                workspaceId: workspace.id
            });
        } catch (error) {
            await this.streamHeartbeatService.clear(streamId);
            throw error;
        }
        let attachmentMessageId = null;
        try {
            const fileParts = await this.buildFilePartsFromAttachments(fileAttachments, workspace.id);
            if ((0, _utils.isNonEmptyArray)(fileParts)) {
                const attachmentMessage = await this.agentChatService.addMessage({
                    threadId,
                    uiMessage: {
                        role: _agentmessageentity.AgentMessageRole.USER,
                        parts: fileParts
                    },
                    turnId: resolved.turnId ?? undefined,
                    workspaceId: workspace.id
                });
                attachmentMessageId = attachmentMessage.id;
            }
            await this.enqueueResumeStream({
                threadId,
                userWorkspaceId,
                workspace,
                turnId: resolved.turnId,
                streamId,
                modelId
            });
        } catch (error) {
            if ((0, _utils.isDefined)(attachmentMessageId)) {
                await this.agentChatService.deleteMessage({
                    messageId: attachmentMessageId,
                    workspaceId: workspace.id
                }).catch(()=>{});
            }
            await this.agentChatService.restorePendingQuestion({
                threadId,
                messageId,
                streamId,
                workspaceId: workspace.id,
                rollback: resolved.rollback
            });
            await this.streamHeartbeatService.clear(streamId);
            throw error;
        }
        await this.eventPublisherService.publish({
            threadId,
            workspaceId: workspace.id,
            event: {
                type: 'question-answered'
            }
        }).catch(()=>{});
        return {
            streamId,
            turnId: resolved.turnId
        };
    }
    async enqueueResumeStream({ threadId, userWorkspaceId, workspace, turnId, streamId, modelId }) {
        const thread = await this.threadRepository.findOneOrFail(workspace.id, {
            where: {
                id: threadId
            }
        });
        const messages = await this.loadMessagesFromDB(threadId, userWorkspaceId, workspace.id);
        await this.messageQueueService.add(_streamagentchatjobnameconstant.STREAM_AGENT_CHAT_JOB_NAME, {
            threadId,
            streamId,
            userWorkspaceId,
            workspaceId: workspace.id,
            messages,
            browsingContext: null,
            modelId,
            lastUserMessageText: '',
            lastUserMessageParts: [],
            hasTitle: !!thread.title,
            conversationSizeTokens: thread.conversationSize,
            existingTurnId: turnId ?? undefined,
            isResume: true
        });
    }
    async flushNextQueuedMessage(threadId, userWorkspaceId, workspaceId, hasTitle) {
        const threadStatus = await this.threadRepository.findOne(workspaceId, {
            where: {
                id: threadId
            },
            select: [
                'id',
                'deletedAt',
                'pendingQuestionMessageId'
            ]
        });
        if (!threadStatus || threadStatus.deletedAt) {
            return;
        }
        if ((0, _utils.isDefined)(threadStatus.pendingQuestionMessageId)) {
            return;
        }
        const queuedMessages = await this.agentChatService.getQueuedMessages({
            threadId,
            workspaceId
        });
        const nextQueued = queuedMessages[0];
        if (!nextQueued) {
            return;
        }
        const textPart = nextQueued.parts?.find((part)=>part.type === 'text');
        const messageText = textPart?.textContent ?? '';
        const fileParts = (nextQueued.parts ?? []).filter((part)=>part.type === 'file').map((part)=>({
                type: 'file',
                mediaType: part.file?.mimeType ?? 'application/octet-stream',
                filename: part.fileFilename ?? '',
                url: '',
                fileId: part.fileId ?? ''
            }));
        if (messageText === '' && fileParts.length === 0) {
            await this.agentChatService.deleteQueuedMessage({
                messageId: nextQueued.id,
                workspaceId
            });
            return;
        }
        const streamId = (0, _ai.generateId)();
        const claimed = await this.tryClaimStream({
            threadId,
            workspaceId,
            streamId,
            where: {
                pendingQuestionMessageId: (0, _typeorm.IsNull)()
            }
        });
        if (!claimed) {
            return;
        }
        try {
            const turnId = await this.agentChatService.promoteQueuedMessage({
                messageId: nextQueued.id,
                threadId,
                workspaceId
            });
            if (turnId === null) {
                await this.releaseStreamClaim(threadId, workspaceId, streamId);
                return;
            }
            await this.eventPublisherService.publish({
                threadId,
                workspaceId,
                event: {
                    type: 'queue-updated'
                }
            });
            await this.eventPublisherService.publish({
                threadId,
                workspaceId,
                event: {
                    type: 'message-persisted',
                    messageId: nextQueued.id
                }
            });
            const [uiMessages, thread] = await Promise.all([
                this.loadMessagesFromDB(threadId, userWorkspaceId, workspaceId),
                this.threadRepository.findOneOrFail(workspaceId, {
                    where: {
                        id: threadId
                    }
                })
            ]);
            const lastUserMessageParts = [
                ...messageText !== '' ? [
                    {
                        type: 'text',
                        text: messageText
                    }
                ] : [],
                ...fileParts
            ];
            await this.messageQueueService.add(_streamagentchatjobnameconstant.STREAM_AGENT_CHAT_JOB_NAME, {
                threadId,
                streamId,
                userWorkspaceId,
                workspaceId,
                messages: uiMessages,
                browsingContext: null,
                lastUserMessageText: messageText,
                lastUserMessageParts,
                hasTitle,
                conversationSizeTokens: thread.conversationSize,
                existingTurnId: turnId
            });
        } catch (error) {
            await this.releaseStreamClaim(threadId, workspaceId, streamId);
            const streamError = (0, _maperrortostreamerrorutil.mapErrorToStreamError)(error);
            this.metricsService.incrementCounterBy({
                key: _metricskeystype.MetricsKeys.AiChatTurnFailed,
                amount: 1,
                attributes: {
                    model: 'unknown',
                    failure_phase: 'enqueue',
                    error_code: streamError.code
                }
            });
            throw error;
        }
    }
    async releaseStreamClaim(threadId, workspaceId, streamId, restore) {
        await this.threadRepository.update(workspaceId, {
            id: threadId,
            activeStreamId: streamId
        }, {
            activeStreamId: null,
            ...restore
        }).catch((error)=>{
            this.logger.error(`Failed to release stream claim for thread ${threadId}: ${error instanceof Error ? error.message : String(error)}`);
        });
        await this.streamHeartbeatService.clear(streamId);
    }
    async loadMessagesFromDB(threadId, userWorkspaceId, workspaceId) {
        const allMessages = await this.agentChatService.getMessagesForThread({
            threadId,
            userWorkspaceId,
            workspaceId,
            includeHidden: true
        });
        // A hidden row without parts is an interrupted seed attempt: it carries no context and
        // would otherwise reach the model as an empty user message.
        const filteredMessages = allMessages.filter((message)=>message.status !== _agentmessageentity.AgentMessageStatus.QUEUED && (!message.isHidden || (0, _utils.isNonEmptyArray)(message.parts)));
        return Promise.all(filteredMessages.map(async (message)=>({
                id: message.id,
                role: message.role,
                parts: await Promise.all((0, _mapDBPartsToUIMessageParts.mapDBPartsToUIMessageParts)(message.parts ?? []).map(async (part)=>{
                    if ((0, _ai1.isExtendedFileUIPart)(part)) {
                        const filePart = part;
                        return {
                            ...filePart,
                            url: await this.fileUrlService.signFileByIdUrl({
                                fileId: filePart.fileId,
                                workspaceId,
                                fileFolder: _types.FileFolder.AgentChat
                            })
                        };
                    }
                    return part;
                })),
                // The hidden context seed gets no createdAt so injectMessageTimestamps skips it: its
                // insert time is meaningless and later than the first real message it sorts before.
                ...message.isHidden ? {} : {
                    metadata: {
                        createdAt: message.createdAt.toISOString()
                    }
                }
            })));
    }
    async buildFilePartsFromAttachments(fileAttachments, workspaceId) {
        if (!fileAttachments || fileAttachments.length === 0) {
            return [];
        }
        const fileIds = fileAttachments.map((attachment)=>attachment.id);
        const validFiles = await this.fileRepository.find(workspaceId, {
            where: {
                id: (0, _typeorm.In)(fileIds),
                path: (0, _typeorm.Like)(`${_types.FileFolder.AgentChat}/%`)
            }
        });
        const validFileIds = new Set(validFiles.map((file)=>file.id));
        return fileAttachments.filter((attachment)=>validFileIds.has(attachment.id)).map((attachment)=>{
            const file = validFiles.find((validFile)=>validFile.id === attachment.id);
            return {
                type: 'file',
                mediaType: file?.mimeType ?? 'application/octet-stream',
                filename: attachment.filename,
                url: '',
                fileId: attachment.id
            };
        });
    }
    constructor(threadRepository, fileRepository, messageQueueService, agentChatService, eventPublisherService, fileUrlService, streamHeartbeatService, metricsService){
        this.threadRepository = threadRepository;
        this.fileRepository = fileRepository;
        this.messageQueueService = messageQueueService;
        this.agentChatService = agentChatService;
        this.eventPublisherService = eventPublisherService;
        this.fileUrlService = fileUrlService;
        this.streamHeartbeatService = streamHeartbeatService;
        this.metricsService = metricsService;
        this.logger = new _common.Logger(AgentChatStreamingService.name);
    }
};
AgentChatStreamingService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_agentchatthreadentity.AgentChatThreadEntity)),
    _ts_param(1, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_fileentity.FileEntity)),
    _ts_param(2, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.aiStreamQueue)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService,
        typeof _agentchatservice.AgentChatService === "undefined" ? Object : _agentchatservice.AgentChatService,
        typeof _agentchateventpublisherservice.AgentChatEventPublisherService === "undefined" ? Object : _agentchateventpublisherservice.AgentChatEventPublisherService,
        typeof _fileurlservice.FileUrlService === "undefined" ? Object : _fileurlservice.FileUrlService,
        typeof _agentchatstreamheartbeatservice.AgentChatStreamHeartbeatService === "undefined" ? Object : _agentchatstreamheartbeatservice.AgentChatStreamHeartbeatService,
        typeof _metricsservice.MetricsService === "undefined" ? Object : _metricsservice.MetricsService
    ])
], AgentChatStreamingService);

//# sourceMappingURL=agent-chat-streaming.service.js.map
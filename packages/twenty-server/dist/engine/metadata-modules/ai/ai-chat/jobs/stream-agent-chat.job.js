"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get STREAM_AGENT_CHAT_JOB_NAME () {
        return _streamagentchatjobnameconstant.STREAM_AGENT_CHAT_JOB_NAME;
    },
    get StreamAgentChatJob () {
        return StreamAgentChatJob;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _guards = require("@sniptt/guards");
const _ai = require("ai");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _uuid = require("uuid");
const _processdecorator = require("../../../../core-modules/message-queue/decorators/process.decorator");
const _processordecorator = require("../../../../core-modules/message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../../core-modules/message-queue/message-queue.constants");
const _metricsservice = require("../../../../core-modules/metrics/metrics.service");
const _metricskeystype = require("../../../../core-modules/metrics/types/metrics-keys.type");
const _todisplaycreditsutil = require("../../../../core-modules/usage/utils/to-display-credits.util");
const _workspaceentity = require("../../../../core-modules/workspace/workspace.entity");
const _agentmessageentity = require("../../ai-agent-execution/entities/agent-message.entity");
const _computecostbreakdownutil = require("../../ai-billing/utils/compute-cost-breakdown.util");
const _convertdollarstobillingcreditsutil = require("../../ai-billing/utils/convert-dollars-to-billing-credits.util");
const _extractcachecreationtokensutil = require("../../ai-billing/utils/extract-cache-creation-tokens.util");
const _aiexception = require("../../ai.exception");
const _agentchatthreadentity = require("../entities/agent-chat-thread.entity");
const _agentchatcancelsubscriberservice = require("../services/agent-chat-cancel-subscriber.service");
const _agentchateventpublisherservice = require("../services/agent-chat-event-publisher.service");
const _agentchatstreamheartbeatservice = require("../services/agent-chat-stream-heartbeat.service");
const _agentchatstreamingservice = require("../services/agent-chat-streaming.service");
const _agentchatservice = require("../services/agent-chat.service");
const _chatexecutionservice = require("../services/chat-execution.service");
const _classifyagentchatturnoutcomeutil = require("../utils/classify-agent-chat-turn-outcome.util");
const _findpendingquestionpartutil = require("../utils/find-pending-question-part.util");
const _agentchatcheckpointintervalmsconstant = require("../constants/agent-chat-checkpoint-interval-ms.constant");
const _getcancelchannelutil = require("../utils/get-cancel-channel.util");
const _maperrortostreamerrorutil = require("../utils/map-error-to-stream-error.util");
const _tagaichatstreamscopeutil = require("../utils/tag-ai-chat-stream-scope.util");
const _aimodelregistryservice = require("../../ai-models/services/ai-model-registry.service");
const _injectworkspacescopedrepositorydecorator = require("../../../../twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../../../twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
const _streamagentchatjobnameconstant = require("./stream-agent-chat-job-name.constant");
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
// Derive assistantMessageId deterministically from streamId so assistant-message
// persistence is idempotent per stream: a retried job for the stream is skipped,
// while each distinct resume in a turn persists its own message.
const ASSISTANT_MESSAGE_ID_NAMESPACE = '0b9c2a3d-4e5f-4a1b-8c2d-3e4f5a6b7c8d';
let StreamAgentChatJob = class StreamAgentChatJob {
    async handle(data, context) {
        (0, _tagaichatstreamscopeutil.tagAiChatStreamScope)({
            streamId: data.streamId,
            turnId: data.existingTurnId,
            threadId: data.threadId,
            workspaceId: data.workspaceId
        });
        const thread = await this.threadRepository.findOne(data.workspaceId, {
            where: {
                id: data.threadId
            },
            select: [
                'id',
                'activeStreamId'
            ]
        });
        if (thread?.activeStreamId !== data.streamId) {
            this.logger.warn(`Skipping stream ${data.streamId} for thread ${data.threadId}: the thread no longer holds this claim`);
            return;
        }
        const workspace = await this.workspaceRepository.findOne({
            where: {
                id: data.workspaceId
            }
        });
        const turnModelId = this.resolveTurnModelId(data.modelId, workspace);
        this.metricsService.incrementCounterBy({
            key: _metricskeystype.MetricsKeys.AiChatTurnStarted,
            amount: 1,
            attributes: {
                model: turnModelId
            }
        });
        await this.eventPublisherService.resetStreamState(data.threadId);
        const abortController = new AbortController();
        const cancelChannel = (0, _getcancelchannelutil.getCancelChannel)(data.threadId, data.streamId);
        const stopHeartbeat = this.streamHeartbeatService.startRunning(data.streamId);
        await this.cancelSubscriberService.subscribe(cancelChannel, ()=>{
            abortController.abort();
        });
        context?.abortSignal?.addEventListener('abort', ()=>{
            abortController.abort(new _aiexception.AiException('The response was interrupted before it could finish.', _aiexception.AiExceptionCode.STREAM_INTERRUPTED));
        }, {
            once: true
        });
        try {
            if (!workspace) {
                throw new _aiexception.AiException(`Workspace ${data.workspaceId} not found`, _aiexception.AiExceptionCode.WORKSPACE_NOT_FOUND);
            }
            await this.executeStream(data, workspace, abortController.signal, turnModelId);
        } catch (error) {
            this.logger.error(`Stream ${data.streamId} failed: ${error instanceof Error ? error.message : String(error)}`);
            const streamError = (0, _maperrortostreamerrorutil.mapErrorToStreamError)(error);
            this.recordTurnOutcome({
                kind: 'failed',
                failurePhase: 'execution',
                errorCode: streamError.code
            }, turnModelId);
            await this.threadRepository.update(data.workspaceId, {
                id: data.threadId
            }, {
                lastStreamError: {
                    ...streamError,
                    failedAt: new Date().toISOString()
                }
            }).catch((persistError)=>{
                this.logger.error(`Failed to persist stream error for thread ${data.threadId}: ${persistError instanceof Error ? persistError.message : String(persistError)}`);
            });
            await this.eventPublisherService.publish({
                threadId: data.threadId,
                workspaceId: data.workspaceId,
                event: {
                    type: 'stream-error',
                    code: streamError.code,
                    message: streamError.message
                }
            }).catch(()=>{});
            await this.eventPublisherService.publish({
                threadId: data.threadId,
                workspaceId: data.workspaceId,
                event: {
                    type: 'queue-updated'
                }
            }).catch(()=>{});
            throw error;
        } finally{
            stopHeartbeat();
            await this.streamHeartbeatService.clear(data.streamId);
            await this.cancelSubscriberService.unsubscribe(cancelChannel);
            await this.threadRepository.update(data.workspaceId, {
                id: data.threadId,
                activeStreamId: data.streamId
            }, {
                activeStreamId: null
            }).catch(()=>{});
            if (!abortController.signal.aborted) {
                await this.agentChatStreamingService.flushNextQueuedMessage(data.threadId, data.userWorkspaceId, data.workspaceId, data.hasTitle).catch((error)=>{
                    this.logger.error(`Failed to flush queued message for thread ${data.threadId}: ${error instanceof Error ? error.message : String(error)}`);
                });
            }
        }
    }
    // The turn-started counter fires before the model is resolved downstream, so
    // resolve it here too: auto-select ids such as `default-fast-model` would
    // otherwise label the start of a turn differently from its outcome, and every
    // per-model rate is computed across the two.
    resolveTurnModelId(requestedModelId, workspace) {
        const modelId = requestedModelId ?? workspace?.smartModel;
        if (!(0, _guards.isNonEmptyString)(modelId)) {
            return 'unknown';
        }
        try {
            return this.aiModelRegistryService.getEffectiveModelConfig(modelId).modelId;
        } catch  {
            return modelId;
        }
    }
    recordTurnOutcome(outcome, turnModelId) {
        if (this.hasRecordedTurnOutcome) {
            return;
        }
        this.hasRecordedTurnOutcome = true;
        switch(outcome.kind){
            case 'completed':
                this.metricsService.incrementCounterBy({
                    key: _metricskeystype.MetricsKeys.AiChatTurnCompleted,
                    amount: 1,
                    attributes: {
                        model: turnModelId,
                        outcome: outcome.outcome
                    }
                });
                return;
            case 'cancelled':
                this.metricsService.incrementCounterBy({
                    key: _metricskeystype.MetricsKeys.AiChatTurnCancelled,
                    amount: 1,
                    attributes: {
                        model: turnModelId,
                        reason: outcome.reason
                    }
                });
                return;
            case 'failed':
                this.metricsService.incrementCounterBy({
                    key: _metricskeystype.MetricsKeys.AiChatTurnFailed,
                    amount: 1,
                    attributes: {
                        model: turnModelId,
                        failure_phase: outcome.failurePhase,
                        ...(0, _utils.isDefined)(outcome.errorCode) && {
                            error_code: outcome.errorCode
                        }
                    }
                });
                return;
            default:
                return (0, _utils.assertUnreachable)(outcome);
        }
    }
    async executeStream(data, workspace, abortSignal, turnModelId) {
        // When processing a promoted queued message, the user message already
        // exists in the DB with a turn — skip persisting it again.
        const userMessagePromise = data.existingTurnId ? Promise.resolve({
            turnId: data.existingTurnId
        }) : this.agentChatService.addMessage({
            threadId: data.threadId,
            uiMessage: {
                role: _agentmessageentity.AgentMessageRole.USER,
                parts: data.lastUserMessageParts.filter((part)=>part.type === 'text' || part.type === 'file')
            },
            workspaceId: data.workspaceId
        });
        userMessagePromise.catch(()=>{});
        const titlePromise = data.hasTitle ? Promise.resolve(null) : this.agentChatService.generateTitleIfNeeded({
            threadId: data.threadId,
            messageContent: data.lastUserMessageText,
            workspaceId: data.workspaceId
        }).catch(()=>null);
        await this.buildAndPublishStream({
            workspace,
            data,
            userMessagePromise,
            titlePromise,
            abortSignal,
            turnModelId
        });
    }
    async buildAndPublishStream({ workspace, data, userMessagePromise, titlePromise, abortSignal, turnModelId }) {
        const assistantMessageId = (0, _uuid.v5)(data.streamId, ASSISTANT_MESSAGE_ID_NAMESPACE);
        return new Promise((resolve, reject)=>{
            let streamUsage = {
                inputTokens: 0,
                outputTokens: 0,
                inputCredits: 0,
                outputCredits: 0,
                cacheReadTokens: 0
            };
            let lastStepConversationSize = 0;
            let totalCacheCreationTokens = 0;
            let streamError;
            let streamFinishError;
            let checkHasNoMoreAvailableCredits = ()=>false;
            let persistChain = Promise.resolve();
            let lastCheckpointAt = 0;
            let isFinalizingPersist = false;
            const enqueueAssistantPersist = (persist)=>{
                persistChain = persistChain.then(persist).catch((error)=>{
                    this.logger.warn(`Failed to checkpoint assistant message for stream ${data.streamId}: ${error instanceof Error ? error.message : String(error)}`);
                });
                return persistChain;
            };
            // onFinish fires before the uiStream is fully drained. We use this
            // promise to coordinate: the IIFE waits for DB persist to complete
            // before publishing message-persisted (after all chunks).
            let resolveStreamFinished;
            const streamFinishedPromise = new Promise((res)=>{
                resolveStreamFinished = res;
            });
            abortSignal.addEventListener('abort', ()=>{
                const reason = abortSignal.reason;
                void streamFinishedPromise.then(()=>{
                    if (reason instanceof _aiexception.AiException) {
                        reject(reason);
                    } else {
                        resolve();
                    }
                });
            }, {
                once: true
            });
            const uiStream = (0, _ai.createUIMessageStream)({
                execute: async ({ writer })=>{
                    const onCodeExecutionUpdate = (codeExecutionData)=>{
                        writer.write({
                            type: 'data-code-execution',
                            id: `code-execution-${codeExecutionData.executionId}`,
                            data: codeExecutionData
                        });
                    };
                    const onCompaction = ()=>{
                        writer.write({
                            type: 'data-compaction',
                            id: `compaction-${data.threadId}`,
                            data: {}
                        });
                    };
                    const { stream, modelConfig, hasNoMoreAvailableCredits } = await this.chatExecutionService.streamChat({
                        workspace,
                        userWorkspaceId: data.userWorkspaceId,
                        threadId: data.threadId,
                        streamId: data.streamId,
                        turnId: data.existingTurnId,
                        messages: data.messages,
                        browsingContext: data.browsingContext,
                        modelId: data.modelId,
                        onCodeExecutionUpdate,
                        onCompaction,
                        abortSignal,
                        conversationSizeTokens: data.conversationSizeTokens
                    });
                    checkHasNoMoreAvailableCredits = hasNoMoreAvailableCredits;
                    const titleWritePromise = titlePromise.then((generatedTitle)=>{
                        if (generatedTitle) {
                            writer.write({
                                type: 'data-thread-title',
                                id: `thread-title-${data.threadId}`,
                                data: {
                                    title: generatedTitle
                                }
                            });
                        }
                    });
                    writer.merge(stream.toUIMessageStream({
                        onError: (error)=>{
                            streamError = error;
                            return error instanceof Error ? error.message : String(error);
                        },
                        sendStart: true,
                        generateMessageId: ()=>assistantMessageId,
                        messageMetadata: ({ part })=>{
                            return this.computeMessageMetadata({
                                part,
                                modelConfig,
                                lastStepConversationSize,
                                totalCacheCreationTokens,
                                onUpdateUsage: (usage)=>{
                                    streamUsage = usage;
                                },
                                onUpdateConversationSize: (size)=>{
                                    lastStepConversationSize = size;
                                },
                                onUpdateCacheCreationTokens: (tokens)=>{
                                    totalCacheCreationTokens = tokens;
                                }
                            });
                        },
                        onFinish: async ({ responseMessage, isAborted })=>{
                            // Rejecting here would race chunks still draining.
                            try {
                                isFinalizingPersist = true;
                                await persistChain;
                                await this.handleStreamFinish({
                                    assistantMessageId,
                                    streamId: data.streamId,
                                    responseMessage,
                                    isAborted,
                                    streamError,
                                    outOfCredits: checkHasNoMoreAvailableCredits(),
                                    threadId: data.threadId,
                                    workspaceId: data.workspaceId,
                                    userWorkspaceId: data.userWorkspaceId,
                                    streamUsage,
                                    lastStepConversationSize,
                                    totalCacheCreationTokens,
                                    modelConfig,
                                    turnModelId,
                                    userMessagePromise
                                });
                                await titleWritePromise;
                            } catch (error) {
                                streamFinishError = error;
                            } finally{
                                resolveStreamFinished();
                            }
                        },
                        sendReasoning: true
                    }));
                },
                // Errors thrown before the model stream merges never reach onFinish.
                onError: (error)=>{
                    streamError = error;
                    resolveStreamFinished();
                    return error instanceof Error ? error.message : String(error);
                }
            });
            const [publishStream, checkpointStream] = uiStream.tee();
            void (async ()=>{
                try {
                    for await (const message of (0, _ai.readUIMessageStream)({
                        stream: checkpointStream,
                        terminateOnError: false
                    })){
                        if (isFinalizingPersist || message.parts.length === 0) {
                            continue;
                        }
                        const now = Date.now();
                        if (now - lastCheckpointAt < _agentchatcheckpointintervalmsconstant.AGENT_CHAT_CHECKPOINT_INTERVAL_MS) {
                            continue;
                        }
                        lastCheckpointAt = now;
                        const parts = message.parts;
                        void enqueueAssistantPersist(async ()=>{
                            if (isFinalizingPersist) {
                                return;
                            }
                            const { turnId } = await userMessagePromise;
                            if (!(0, _utils.isDefined)(turnId)) {
                                return;
                            }
                            await this.agentChatService.upsertAssistantMessage({
                                id: assistantMessageId,
                                threadId: data.threadId,
                                turnId,
                                parts,
                                workspaceId: data.workspaceId
                            });
                        });
                    }
                } catch  {
                // best-effort; the authoritative persist runs onFinish
                }
            })();
            // Publish all chunks first, then signal completion. This guarantees
            // message-persisted arrives after every stream-chunk on the client.
            void (async ()=>{
                try {
                    for await (const chunk of publishStream){
                        if (chunk.type === 'error') {
                            continue;
                        }
                        await this.eventPublisherService.publish({
                            threadId: data.threadId,
                            workspaceId: data.workspaceId,
                            event: {
                                type: 'stream-chunk',
                                chunk: chunk
                            }
                        });
                    }
                    await streamFinishedPromise;
                    if (streamError) {
                        reject(streamError);
                    } else if (streamFinishError) {
                        reject(streamFinishError);
                    } else if (checkHasNoMoreAvailableCredits()) {
                        await this.eventPublisherService.publish({
                            threadId: data.threadId,
                            workspaceId: data.workspaceId,
                            event: {
                                type: 'credits-exhausted'
                            }
                        });
                        resolve();
                    } else {
                        await this.eventPublisherService.publish({
                            threadId: data.threadId,
                            workspaceId: data.workspaceId,
                            event: {
                                type: 'message-persisted',
                                messageId: assistantMessageId
                            }
                        });
                        resolve();
                    }
                } catch (error) {
                    reject(error);
                }
            })();
        });
    }
    computeMessageMetadata({ part, modelConfig, lastStepConversationSize, totalCacheCreationTokens, onUpdateUsage, onUpdateConversationSize, onUpdateCacheCreationTokens }) {
        if (part.type === 'finish-step') {
            const stepInput = part.usage?.inputTokens ?? 0;
            const stepCacheCreation = (0, _extractcachecreationtokensutil.extractCacheCreationTokens)(part.providerMetadata);
            onUpdateCacheCreationTokens(totalCacheCreationTokens + stepCacheCreation);
            onUpdateConversationSize(stepInput);
        }
        if (part.type === 'finish') {
            const breakdown = (0, _computecostbreakdownutil.computeCostBreakdown)(modelConfig, {
                inputTokens: part.totalUsage?.inputTokens,
                outputTokens: part.totalUsage?.outputTokens,
                cachedInputTokens: part.totalUsage?.inputTokenDetails?.cacheReadTokens,
                reasoningTokens: part.totalUsage?.outputTokenDetails?.reasoningTokens,
                cacheCreationTokens: totalCacheCreationTokens
            });
            const inputCredits = Math.round((0, _convertdollarstobillingcreditsutil.convertDollarsToBillingCredits)(breakdown.inputCostInDollars));
            const outputCredits = Math.round((0, _convertdollarstobillingcreditsutil.convertDollarsToBillingCredits)(breakdown.outputCostInDollars));
            onUpdateUsage({
                inputTokens: breakdown.tokenCounts.totalInputTokens,
                outputTokens: part.totalUsage?.outputTokens ?? 0,
                inputCredits,
                outputCredits,
                cacheReadTokens: breakdown.tokenCounts.cachedInputTokens
            });
            return {
                createdAt: new Date().toISOString(),
                usage: {
                    inputTokens: breakdown.tokenCounts.totalInputTokens,
                    outputTokens: part.totalUsage?.outputTokens ?? 0,
                    cachedInputTokens: breakdown.tokenCounts.cachedInputTokens,
                    inputCredits: (0, _todisplaycreditsutil.toDisplayCredits)(inputCredits),
                    outputCredits: (0, _todisplaycreditsutil.toDisplayCredits)(outputCredits),
                    conversationSize: lastStepConversationSize
                },
                model: {
                    contextWindowTokens: modelConfig.contextWindowTokens
                }
            };
        }
        return undefined;
    }
    async handleStreamFinish(args) {
        const outcome = await this.persistStreamFinish(args);
        if ((0, _utils.isDefined)(outcome)) {
            this.recordTurnOutcome(outcome, args.turnModelId);
        }
    }
    // Returns null when the stream errored: that turn is accounted for by the
    // catch in handle(), and counting it here too would double it.
    async persistStreamFinish({ assistantMessageId, streamId, responseMessage, isAborted, streamError, outOfCredits, threadId, workspaceId, userWorkspaceId, streamUsage, lastStepConversationSize, totalCacheCreationTokens, modelConfig, turnModelId, userMessagePromise }) {
        const hasText = responseMessage.parts.some((part)=>part.type === 'text' && (0, _guards.isNonEmptyString)(part.text));
        const pendingQuestionPart = (0, _findpendingquestionpartutil.findPendingQuestionPart)(responseMessage.parts);
        if ((isAborted || !hasText) && !(0, _utils.isDefined)(pendingQuestionPart)) {
            this.logAssistantTurnWithoutText({
                responseMessage,
                isAborted,
                streamError,
                outOfCredits,
                hasText,
                threadId,
                workspaceId,
                streamUsage,
                modelId: turnModelId
            });
        }
        if ((0, _utils.isDefined)(streamError)) {
            return null;
        }
        const outcome = (0, _classifyagentchatturnoutcomeutil.classifyAgentChatTurnOutcome)({
            hasText,
            isAborted,
            isAwaitingUserAnswer: (0, _utils.isDefined)(pendingQuestionPart),
            outOfCredits
        });
        if (responseMessage.parts.length === 0) {
            return outcome;
        }
        const threadStatus = await this.threadRepository.findOne(workspaceId, {
            where: {
                id: threadId
            },
            select: [
                'id',
                'deletedAt'
            ]
        });
        if (!threadStatus || threadStatus.deletedAt) {
            return (0, _classifyagentchatturnoutcomeutil.resolveSupersededTurnOutcome)(outcome);
        }
        const userMessage = await userMessagePromise;
        if ((0, _utils.isDefined)(userMessage.turnId)) {
            await this.agentChatService.upsertAssistantMessage({
                id: assistantMessageId,
                threadId,
                turnId: userMessage.turnId,
                parts: responseMessage.parts,
                workspaceId
            });
        } else {
            await this.agentChatService.addMessage({
                threadId,
                uiMessage: responseMessage,
                id: assistantMessageId,
                workspaceId
            });
        }
        const totalsUpdate = await this.threadRepository.update(workspaceId, {
            id: threadId,
            activeStreamId: streamId
        }, {
            totalInputTokens: ()=>`"totalInputTokens" + ${streamUsage.inputTokens}`,
            totalOutputTokens: ()=>`"totalOutputTokens" + ${streamUsage.outputTokens}`,
            totalInputCredits: ()=>`"totalInputCredits" + ${streamUsage.inputCredits}`,
            totalOutputCredits: ()=>`"totalOutputCredits" + ${streamUsage.outputCredits}`,
            totalCacheReadTokens: ()=>`"totalCacheReadTokens" + ${streamUsage.cacheReadTokens}`,
            totalCacheCreationTokens: ()=>`"totalCacheCreationTokens" + ${totalCacheCreationTokens}`,
            contextWindowTokens: modelConfig.contextWindowTokens,
            conversationSize: lastStepConversationSize,
            pendingQuestionMessageId: (0, _utils.isDefined)(pendingQuestionPart) ? assistantMessageId : null,
            lastStreamError: null
        });
        if (!totalsUpdate.affected) {
            return (0, _classifyagentchatturnoutcomeutil.resolveSupersededTurnOutcome)(outcome);
        }
        await this.agentChatService.notifyThreadUsageUpdated({
            threadId,
            userWorkspaceId,
            workspaceId
        });
        return outcome;
    }
    logAssistantTurnWithoutText({ responseMessage, isAborted, streamError, outOfCredits, hasText, threadId, workspaceId, streamUsage, modelId }) {
        const reason = isAborted ? 'user-cancelled' : streamError ? 'stream-error' : outOfCredits ? 'credits-exhausted' : 'empty-completion';
        const errorDetail = streamError instanceof Error ? `${streamError.name}: ${streamError.message}` : (0, _utils.isDefined)(streamError) ? String(streamError) : 'none';
        this.logger.warn(`[AI_CHAT_NO_TEXT] Assistant turn ended without a text reply — ` + `reason=${reason}, model=${modelId}, ` + `threadId=${threadId}, workspaceId=${workspaceId}, ` + `isAborted=${isAborted}, outOfCredits=${outOfCredits}, hasText=${hasText}, ` + `streamError=${errorDetail}, ` + `inputTokens=${streamUsage.inputTokens},` + `responseMessage.parts=${JSON.stringify(responseMessage.parts)}`);
        if (streamError instanceof Error && (0, _utils.isDefined)(streamError.stack)) {
            this.logger.warn(`[AI_CHAT_NO_TEXT] streamError stack — threadId=${threadId}: ${streamError.stack}`);
        }
    }
    constructor(threadRepository, workspaceRepository, agentChatService, chatExecutionService, eventPublisherService, cancelSubscriberService, agentChatStreamingService, streamHeartbeatService, metricsService, aiModelRegistryService){
        this.threadRepository = threadRepository;
        this.workspaceRepository = workspaceRepository;
        this.agentChatService = agentChatService;
        this.chatExecutionService = chatExecutionService;
        this.eventPublisherService = eventPublisherService;
        this.cancelSubscriberService = cancelSubscriberService;
        this.agentChatStreamingService = agentChatStreamingService;
        this.streamHeartbeatService = streamHeartbeatService;
        this.metricsService = metricsService;
        this.aiModelRegistryService = aiModelRegistryService;
        this.logger = new _common.Logger(StreamAgentChatJob.name);
        // The processor is REQUEST-scoped, so this is per job. A publish failure
        // after the stream already classified its outcome reaches the catch in
        // handle(), which would otherwise count the same turn a second time.
        this.hasRecordedTurnOutcome = false;
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(_streamagentchatjobnameconstant.STREAM_AGENT_CHAT_JOB_NAME),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof StreamAgentChatJobData === "undefined" ? Object : StreamAgentChatJobData,
        typeof MessageQueueJobContext === "undefined" ? Object : MessageQueueJobContext
    ]),
    _ts_metadata("design:returntype", Promise)
], StreamAgentChatJob.prototype, "handle", null);
StreamAgentChatJob = _ts_decorate([
    (0, _processordecorator.Processor)({
        queueName: _messagequeueconstants.MessageQueue.aiStreamQueue,
        scope: _common.Scope.REQUEST
    }),
    _ts_param(0, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_agentchatthreadentity.AgentChatThreadEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _agentchatservice.AgentChatService === "undefined" ? Object : _agentchatservice.AgentChatService,
        typeof _chatexecutionservice.ChatExecutionService === "undefined" ? Object : _chatexecutionservice.ChatExecutionService,
        typeof _agentchateventpublisherservice.AgentChatEventPublisherService === "undefined" ? Object : _agentchateventpublisherservice.AgentChatEventPublisherService,
        typeof _agentchatcancelsubscriberservice.AgentChatCancelSubscriberService === "undefined" ? Object : _agentchatcancelsubscriberservice.AgentChatCancelSubscriberService,
        typeof _agentchatstreamingservice.AgentChatStreamingService === "undefined" ? Object : _agentchatstreamingservice.AgentChatStreamingService,
        typeof _agentchatstreamheartbeatservice.AgentChatStreamHeartbeatService === "undefined" ? Object : _agentchatstreamheartbeatservice.AgentChatStreamHeartbeatService,
        typeof _metricsservice.MetricsService === "undefined" ? Object : _metricsservice.MetricsService,
        typeof _aimodelregistryservice.AiModelRegistryService === "undefined" ? Object : _aimodelregistryservice.AiModelRegistryService
    ])
], StreamAgentChatJob);

//# sourceMappingURL=stream-agent-chat.job.js.map
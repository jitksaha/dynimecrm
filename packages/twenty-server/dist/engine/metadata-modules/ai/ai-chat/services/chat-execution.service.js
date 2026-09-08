"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ChatExecutionService", {
    enumerable: true,
    get: function() {
        return ChatExecutionService;
    }
});
const _common = require("@nestjs/common");
const _ai = require("ai");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _ailatencymsbucketboundariesconstant = require("../../../../core-modules/metrics/constants/ai-latency-ms-bucket-boundaries.constant");
const _toolexecutiondurationmsbucketboundariesconstant = require("../../../../core-modules/metrics/constants/tool-execution-duration-ms-bucket-boundaries.constant");
const _tooloutputtokensbucketboundariesconstant = require("../../../../core-modules/metrics/constants/tool-output-tokens-bucket-boundaries.constant");
const _metricsservice = require("../../../../core-modules/metrics/metrics.service");
const _metricskeystype = require("../../../../core-modules/metrics/types/metrics-keys.type");
const _usageoperationtypeenum = require("../../../../core-modules/usage/enums/usage-operation-type.enum");
const _codeinterpreterservice = require("../../../../core-modules/code-interpreter/code-interpreter.service");
const _workspacedomainsservice = require("../../../../core-modules/domain/workspace-domains/services/workspace-domains.service");
const _exceptionhandlerservice = require("../../../../core-modules/exception-handler/exception-handler.service");
const _toolregistryservice = require("../../../../core-modules/tool-provider/services/tool-registry.service");
const _tools = require("../../../../core-modules/tool-provider/tools");
const _estimatetooloutputtokensutil = require("../../../../core-modules/tool-provider/utils/estimate-tool-output-tokens.util");
const _gettoolmetricnameutil = require("../../../../core-modules/tool-provider/utils/get-tool-metric-name.util");
const _istooloutputsuccessfulutil = require("../../../../core-modules/tool-provider/utils/is-tool-output-successful.util");
const _resolvetoolnameutil = require("../../../../core-modules/tool-provider/utils/resolve-tool-name.util");
const _agentactorcontextservice = require("../../ai-agent-execution/services/agent-actor-context.service");
const _finalizedanglingtoolpartsutil = require("../../ai-agent-execution/utils/finalize-dangling-tool-parts.util");
const _guideuncallabletoolcallstometatoolutil = require("../../ai-agent-execution/utils/guide-uncallable-tool-calls-to-meta-tool.util");
const _agentconfigconst = require("../../ai-agent/constants/agent-config.const");
const _repairtoolcallutil = require("../../ai-agent/utils/repair-tool-call.util");
const _aibillingservice = require("../../ai-billing/services/ai-billing.service");
const _convertdollarstobillingcreditsutil = require("../../ai-billing/utils/convert-dollars-to-billing-credits.util");
const _countnativewebsearchcallsfromstepsutil = require("../../ai-billing/utils/count-native-web-search-calls-from-steps.util");
const _extractcachecreationtokensutil = require("../../ai-billing/utils/extract-cache-creation-tokens.util");
const _aichatstreamfunctionidconstant = require("../constants/ai-chat-stream-function-id.constant");
const _aichattoolnamestopreloadconst = require("../constants/ai-chat-tool-names-to-preload.const");
const _aichatworkspacesetupstreamfunctionidconstant = require("../constants/ai-chat-workspace-setup-stream-function-id.constant");
const _messagepruningservice = require("./message-pruning.service");
const _askquestionstool = require("../tools/ask-questions.tool");
const _completeworkspacesetuptool = require("../tools/complete-workspace-setup.tool");
const _buildworkspacesetupchatthreadidutil = require("../utils/build-workspace-setup-chat-thread-id.util");
const _buildfullsystempromptutil = require("../utils/build-full-system-prompt.util");
const _hasnoassistantmessageutil = require("../utils/has-no-assistant-message.util");
const _hassucceededworkspacesetupcompletionutil = require("../utils/has-succeeded-workspace-setup-completion.util");
const _collectuploadedfilereferencesutil = require("../utils/collect-uploaded-file-references.util");
const _extractcodeinterpreterfilesutil = require("../utils/extract-code-interpreter-files.util");
const _injectmessagetimestampsutil = require("../utils/inject-message-timestamps.util");
const _provideroptionsutil = require("../utils/provider-options.util");
const _replaceunsupportedfilepartsutil = require("../utils/replace-unsupported-file-parts.util");
const _tagaichatkindscopeutil = require("../utils/tag-ai-chat-kind-scope.util");
const _buildaitelemetryutil = require("../../ai-models/utils/build-ai-telemetry.util");
const _aimodelregistryservice = require("../../ai-models/services/ai-model-registry.service");
const _nativetoolbinderservice = require("../../ai-models/services/native-tool-binder.service");
const _getnativemodelcapabilitiesutil = require("../../ai-models/utils/get-native-model-capabilities.util");
const _aiexception = require("../../ai.exception");
const _skillservice = require("../../../skill/skill.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ChatExecutionService = class ChatExecutionService {
    async streamChat({ workspace, userWorkspaceId, threadId, streamId, turnId, messages, browsingContext, onCodeExecutionUpdate, onCompaction, modelId, abortSignal, conversationSizeTokens }) {
        const { actorContext, roleId, userId, userContext } = await this.agentActorContextService.buildUserAndAgentActorContext(userWorkspaceId, workspace.id);
        const locale = userContext.locale;
        const toolContext = {
            workspaceId: workspace.id,
            roleId,
            actorContext,
            userId,
            userWorkspaceId,
            threadId,
            locale,
            onCodeExecutionUpdate
        };
        const toolCatalog = await this.toolRegistry.buildToolIndex(workspace.id, roleId, {
            userId,
            userWorkspaceId,
            locale
        });
        const skillCatalog = await this.skillService.findAllFlatSkills(workspace.id);
        this.logger.log(`Built tool catalog with ${toolCatalog.length} tools, ${skillCatalog.length} skills available`);
        const preloadedTools = await this.toolRegistry.getToolsByName(_aichattoolnamestopreloadconst.AI_CHAT_TOOL_NAMES_TO_PRELOAD, toolContext, {
            compactOutput: true,
            spillLargeOutput: true
        });
        const resolvedModelId = modelId ?? workspace.smartModel;
        this.aiModelRegistryService.validateModelAvailability(resolvedModelId, workspace);
        const registeredModel = await this.aiModelRegistryService.resolveModelForAgent({
            modelId: resolvedModelId
        });
        const modelConfig = this.aiModelRegistryService.getEffectiveModelConfig(registeredModel.modelId);
        // Native and action search may both be bound here; the model picks at runtime.
        const nativeCapabilities = (0, _getnativemodelcapabilitiesutil.getNativeModelCapabilities)(registeredModel.sdkPackage);
        const nativeTools = this.nativeToolBinder.bind(registeredModel, {
            webSearch: nativeCapabilities?.webSearch === true,
            twitterSearch: nativeCapabilities?.twitterSearch === true
        });
        // Tools the model can call directly: preloaded registry tools (already
        // serialized by the hydrator) plus SDK-native tools (opaque, never
        // serialized). execute_tool routes discovered tools through the registry.
        const directTools = {
            ...preloadedTools,
            ...nativeTools
        };
        const isWorkspaceSetupThread = (0, _utils.isDefined)(threadId) && threadId === (0, _buildworkspacesetupchatthreadidutil.buildWorkspaceSetupChatThreadId)({
            workspaceId: workspace.id,
            userWorkspaceId
        }) && !(0, _hassucceededworkspacesetupcompletionutil.hasSucceededWorkspaceSetupCompletion)(messages);
        const isWorkspaceSetupKickoffTurn = isWorkspaceSetupThread && (0, _hasnoassistantmessageutil.hasNoAssistantMessage)(messages);
        (0, _tagaichatkindscopeutil.tagAiChatKindScope)({
            isWorkspaceSetupThread
        });
        const preloadedToolNames = [
            ...Object.keys(preloadedTools),
            ...Object.keys(nativeTools),
            _askquestionstool.ASK_QUESTIONS_TOOL_NAME,
            ...isWorkspaceSetupThread ? [
                _completeworkspacesetuptool.COMPLETE_WORKSPACE_SETUP_TOOL_NAME
            ] : []
        ];
        // ToolSet is constant for the entire conversation — no mutation.
        // learn_tools returns schemas as text; execute_tool dispatches via the registry.
        const activeTools = {
            ...directTools,
            [_askquestionstool.ASK_QUESTIONS_TOOL_NAME]: (0, _askquestionstool.createAskQuestionsTool)({
                isWorkspaceSetupThread
            }),
            ...isWorkspaceSetupThread ? {
                [_completeworkspacesetuptool.COMPLETE_WORKSPACE_SETUP_TOOL_NAME]: (0, _completeworkspacesetuptool.createCompleteWorkspaceSetupTool)()
            } : {},
            [_tools.LEARN_TOOLS_TOOL_NAME]: (0, _tools.createLearnToolsTool)(this.toolRegistry, toolContext, {
                spillLargeOutput: true
            }),
            [_tools.EXECUTE_TOOL_TOOL_NAME]: (0, _tools.createExecuteToolTool)(this.toolRegistry, toolContext, {
                compactOutput: true,
                spillLargeOutput: true
            }),
            [_tools.LOAD_SKILL_TOOL_NAME]: (0, _tools.createLoadSkillTool)((skillNames)=>this.skillService.findFlatSkillsByNames(skillNames, workspace.id), async ()=>{
                const allSkills = await this.skillService.findAllFlatSkills(workspace.id);
                return allSkills.map((skill)=>skill.name);
            })
        };
        const isCodeInterpreterEnabled = this.codeInterpreterService.isEnabled();
        const uploadedFiles = (0, _collectuploadedfilereferencesutil.collectUploadedFileReferences)(messages);
        let processedMessages = (0, _replaceunsupportedfilepartsutil.replaceUnsupportedFileParts)(messages, modelConfig.modalities, isCodeInterpreterEnabled);
        let storedFiles = [];
        if (isCodeInterpreterEnabled) {
            const extracted = (0, _extractcodeinterpreterfilesutil.extractCodeInterpreterFiles)(processedMessages);
            processedMessages = extracted.processedMessages;
            if (extracted.extractedFiles.length > 0) {
                storedFiles = await this.storeExtractedFiles(extracted.extractedFiles, workspace.id);
            }
        }
        if ((0, _utils.isDefined)(browsingContext)) {
            const contextString = this.buildContextFromBrowsingContext(workspace, browsingContext);
            processedMessages = this.injectBrowsingContextIntoLastUserMessage(processedMessages, contextString);
        }
        processedMessages = (0, _injectmessagetimestampsutil.injectMessageTimestamps)(processedMessages, userContext.timezone);
        const systemPrompt = (0, _buildfullsystempromptutil.buildFullSystemPrompt)({
            toolCatalog,
            skillCatalog,
            preloadedTools: preloadedToolNames,
            uploadedFilesContext: {
                uploadedFiles,
                codeInterpreterFiles: storedFiles
            },
            workspaceInstructions: workspace.aiAdditionalInstructions ?? undefined,
            userContext,
            isWorkspaceSetupThread
        });
        this.logger.log(`Starting chat execution with model ${registeredModel.modelId}, ${Object.keys(activeTools).length} active tools`);
        const systemMessage = {
            role: 'system',
            content: systemPrompt,
            providerOptions: (0, _provideroptionsutil.getCacheProviderOptions)(registeredModel.sdkPackage)
        };
        const sanitizedMessages = this.sanitizeMessagePartsForModel(processedMessages, new Set(Object.keys(activeTools)));
        const rawModelMessages = await (0, _ai.convertToModelMessages)(sanitizedMessages);
        const pruningResult = this.messagePruningService.pruneIfOverContextWindowLimit(rawModelMessages, modelConfig.contextWindowTokens, conversationSizeTokens);
        if (pruningResult.isStillOverLimit) {
            throw new _aiexception.AiException('This conversation is too long for the model to process. Please start a new thread.', _aiexception.AiExceptionCode.CONTEXT_WINDOW_EXCEEDED);
        }
        if (pruningResult.wasPruned) {
            onCompaction?.();
        }
        const modelMessages = pruningResult.messages;
        let hasNoMoreAvailableCredits = false;
        const streamStartedAt = performance.now();
        let stepStartedAt = streamStartedAt;
        let ttftRecorded = false;
        let stepIndex = 0;
        let lastUnderlyingStreamError;
        const emitTurnUsageEvent = async (steps)=>{
            const usage = steps.reduce((acc, step)=>({
                    inputTokens: (acc.inputTokens ?? 0) + (step.usage.inputTokens ?? 0),
                    outputTokens: (acc.outputTokens ?? 0) + (step.usage.outputTokens ?? 0),
                    totalTokens: (acc.totalTokens ?? 0) + (step.usage.totalTokens ?? 0),
                    inputTokenDetails: {
                        noCacheTokens: (acc.inputTokenDetails?.noCacheTokens ?? 0) + (step.usage.inputTokenDetails?.noCacheTokens ?? 0),
                        cacheReadTokens: (acc.inputTokenDetails?.cacheReadTokens ?? 0) + (step.usage.inputTokenDetails?.cacheReadTokens ?? 0),
                        cacheWriteTokens: (acc.inputTokenDetails?.cacheWriteTokens ?? 0) + (step.usage.inputTokenDetails?.cacheWriteTokens ?? 0)
                    },
                    outputTokenDetails: {
                        textTokens: (acc.outputTokenDetails?.textTokens ?? 0) + (step.usage.outputTokenDetails?.textTokens ?? 0),
                        reasoningTokens: (acc.outputTokenDetails?.reasoningTokens ?? 0) + (step.usage.outputTokenDetails?.reasoningTokens ?? 0)
                    }
                }), {
                inputTokens: 0,
                outputTokens: 0,
                totalTokens: 0,
                inputTokenDetails: {
                    noCacheTokens: 0,
                    cacheReadTokens: 0,
                    cacheWriteTokens: 0
                },
                outputTokenDetails: {
                    textTokens: 0,
                    reasoningTokens: 0
                }
            });
            const cacheCreationTokens = (0, _extractcachecreationtokensutil.extractCacheCreationTokensFromSteps)(steps);
            const totalTokens = (usage.inputTokens ?? 0) + (usage.outputTokens ?? 0);
            const costInDollars = this.aiBillingService.calculateCost(registeredModel.modelId, {
                usage,
                cacheCreationTokens
            });
            const creditsUsedMicro = Math.round((0, _convertdollarstobillingcreditsutil.convertDollarsToBillingCredits)(costInDollars));
            await this.aiBillingService.emitAiTokenUsageEvent(workspace.id, creditsUsedMicro, totalTokens, registeredModel.modelId, _usageoperationtypeenum.UsageOperationType.AI_CHAT_TOKEN, null, userWorkspaceId);
            // billNativeWebSearchUsage short-circuits when count <= 0, so calling
            // unconditionally is safe regardless of whether native search fired.
            void this.aiBillingService.billNativeWebSearchUsage((0, _countnativewebsearchcallsfromstepsutil.countNativeWebSearchCallsFromSteps)(steps), workspace.id, userWorkspaceId);
            const modelAttr = {
                model: registeredModel.modelId
            };
            this.metricsService.incrementCounterBy({
                key: _metricskeystype.MetricsKeys.AiChatInputTokens,
                amount: usage.inputTokens ?? 0,
                attributes: modelAttr
            });
            this.metricsService.incrementCounterBy({
                key: _metricskeystype.MetricsKeys.AiChatOutputTokens,
                amount: usage.outputTokens ?? 0,
                attributes: modelAttr
            });
            this.metricsService.incrementCounterBy({
                key: _metricskeystype.MetricsKeys.AiChatCacheReadTokens,
                amount: usage.inputTokenDetails?.cacheReadTokens ?? 0,
                attributes: modelAttr
            });
            this.metricsService.incrementCounterBy({
                key: _metricskeystype.MetricsKeys.AiChatCacheWriteTokens,
                amount: cacheCreationTokens,
                attributes: modelAttr
            });
            this.metricsService.recordHistogram({
                key: _metricskeystype.MetricsKeys.AiChatTurnLatencyMs,
                value: performance.now() - streamStartedAt,
                unit: 'ms',
                attributes: modelAttr,
                bucketBoundaries: _ailatencymsbucketboundariesconstant.AI_LATENCY_MS_BUCKET_BOUNDARIES
            });
        };
        const stream = (0, _ai.streamText)({
            model: registeredModel.model,
            messages: [
                systemMessage,
                ...modelMessages
            ],
            tools: activeTools,
            // Every step of the kickoff turn is forced so it cannot end in prose; stopWhen ends it at the first ask_questions.
            toolChoice: isWorkspaceSetupKickoffTurn ? 'required' : 'auto',
            abortSignal,
            stopWhen: (step)=>(0, _ai.stepCountIs)(_agentconfigconst.AGENT_CONFIG.MAX_STEPS)(step) || (0, _ai.hasToolCall)(_askquestionstool.ASK_QUESTIONS_TOOL_NAME)(step) || (0, _ai.hasToolCall)(_completeworkspacesetuptool.COMPLETE_WORKSPACE_SETUP_TOOL_NAME)(step) || hasNoMoreAvailableCredits,
            experimental_telemetry: (0, _buildaitelemetryutil.buildAiTelemetry)({
                functionId: isWorkspaceSetupThread ? _aichatworkspacesetupstreamfunctionidconstant.AI_CHAT_WORKSPACE_SETUP_STREAM_FUNCTION_ID : _aichatstreamfunctionidconstant.AI_CHAT_STREAM_FUNCTION_ID,
                workspaceId: workspace.id,
                userWorkspaceId,
                threadId,
                turnId,
                streamId
            }),
            providerOptions: (0, _provideroptionsutil.getCallLevelProviderOptions)({
                sdkPackage: registeredModel.sdkPackage,
                providerOptions: undefined,
                promptCacheKey: threadId
            }),
            prepareStep: ({ messages })=>{
                stepStartedAt = performance.now();
                return {
                    messages: (0, _provideroptionsutil.injectCacheBreakpoint)(messages, registeredModel.sdkPackage)
                };
            },
            onChunk: ({ chunk })=>{
                if (!ttftRecorded && (chunk.type === 'text-delta' || chunk.type === 'tool-call')) {
                    ttftRecorded = true;
                    this.metricsService.recordHistogram({
                        key: _metricskeystype.MetricsKeys.AiChatTtftMs,
                        value: performance.now() - streamStartedAt,
                        unit: 'ms',
                        attributes: {
                            model: registeredModel.modelId
                        },
                        bucketBoundaries: _ailatencymsbucketboundariesconstant.AI_LATENCY_MS_BUCKET_BOUNDARIES
                    });
                }
            },
            onError: ({ error })=>{
                lastUnderlyingStreamError = error;
                this.logger.error(`Stream ${streamId} emitted an error: ${error instanceof Error ? error.message : String(error)}`);
            },
            experimental_onToolCallFinish: (event)=>{
                this.metricsService.recordHistogram({
                    key: _metricskeystype.MetricsKeys.AiChatToolExecutionDurationMs,
                    value: event.durationMs,
                    unit: 'ms',
                    attributes: {
                        model: registeredModel.modelId,
                        tool: (0, _gettoolmetricnameutil.getToolMetricName)(event.toolCall.toolName)
                    },
                    bucketBoundaries: _toolexecutiondurationmsbucketboundariesconstant.TOOL_EXECUTION_DURATION_MS_BUCKET_BOUNDARIES
                });
            },
            onStepFinish: async (step)=>{
                this.metricsService.recordHistogram({
                    key: _metricskeystype.MetricsKeys.AiChatStepLatencyMs,
                    value: performance.now() - stepStartedAt,
                    unit: 'ms',
                    attributes: {
                        model: registeredModel.modelId
                    },
                    bucketBoundaries: _ailatencymsbucketboundariesconstant.AI_LATENCY_MS_BUCKET_BOUNDARIES
                });
                const { hasNoMoreAvailableCredits: stepHasNoMoreAvailableCredits } = await this.aiBillingService.decrementAndCheckAvailableCredits(registeredModel.modelId, {
                    usage: step.usage,
                    cacheCreationTokens: (0, _extractcachecreationtokensutil.extractCacheCreationTokens)(step.providerMetadata)
                }, workspace.id);
                if (stepHasNoMoreAvailableCredits) {
                    hasNoMoreAvailableCredits = true;
                }
                this.logger.log(`[AI_CHAT_TOKENS] step #${++stepIndex} — ` + `toolCallIds=[${step.toolCalls.map((toolCall)=>toolCall.toolCallId).join(', ')}]: ` + `outputTokens=${step.usage.outputTokens ?? 0}, ` + `reasoningTokens=${step.usage.outputTokenDetails?.reasoningTokens ?? 0}, ` + `inputTokens(fullContext)=${step.usage.inputTokens ?? 0}, ` + `cacheReadTokens=${step.usage.inputTokenDetails?.cacheReadTokens ?? 0}, ` + `cacheWriteTokens=${step.usage.inputTokenDetails?.cacheWriteTokens ?? 0}, ` + `cacheCreationTokens=${(0, _extractcachecreationtokensutil.extractCacheCreationTokens)(step.providerMetadata)}, ` + `totalTokens=${step.usage.totalTokens ?? 0}`);
                for (const part of step.content){
                    if (part.type !== 'tool-result' && part.type !== 'tool-error') {
                        continue;
                    }
                    const succeeded = part.type === 'tool-result' && (0, _istooloutputsuccessfulutil.isToolOutputSuccessful)(part.output);
                    const outputTokens = (0, _estimatetooloutputtokensutil.estimateToolOutputTokens)(part.type === 'tool-result' ? part.output : part.error);
                    const executionAttributes = {
                        model: registeredModel.modelId,
                        tool: (0, _gettoolmetricnameutil.getToolMetricName)((0, _resolvetoolnameutil.resolveToolName)(part))
                    };
                    this.metricsService.incrementCounterBy({
                        key: succeeded ? _metricskeystype.MetricsKeys.AiChatToolExecutionSucceeded : _metricskeystype.MetricsKeys.AiChatToolExecutionFailed,
                        amount: 1,
                        attributes: executionAttributes
                    });
                    this.metricsService.recordHistogram({
                        key: _metricskeystype.MetricsKeys.AiChatToolOutputTokens,
                        value: outputTokens,
                        unit: 'token',
                        attributes: executionAttributes,
                        bucketBoundaries: _tooloutputtokensbucketboundariesconstant.TOOL_OUTPUT_TOKENS_BUCKET_BOUNDARIES
                    });
                }
            },
            onAbort: async ({ steps })=>{
                await emitTurnUsageEvent(steps);
            },
            experimental_repairToolCall: async ({ toolCall, tools: toolsForRepair, inputSchema, error })=>{
                return (0, _repairtoolcallutil.repairToolCall)({
                    toolCall,
                    tools: toolsForRepair,
                    inputSchema,
                    error,
                    model: registeredModel.model,
                    billingContext: {
                        aiBillingService: this.aiBillingService,
                        modelId: registeredModel.modelId,
                        workspaceId: workspace.id,
                        userWorkspaceId,
                        operationType: _usageoperationtypeenum.UsageOperationType.AI_CHAT_TOKEN
                    }
                });
            }
        });
        Promise.all([
            stream.usage,
            stream.steps
        ]).then(async ([, steps])=>{
            await emitTurnUsageEvent(steps);
        }).catch((error)=>{
            if (error?.name === 'AbortError') {
                return;
            }
            if (error instanceof _aiexception.AiException && error.code === _aiexception.AiExceptionCode.STREAM_INTERRUPTED) {
                return;
            }
            if (_ai.NoOutputGeneratedError.isInstance(error)) {
                const underlying = lastUnderlyingStreamError;
                this.exceptionHandlerService.captureExceptions([
                    Object.assign(new Error(`AI chat stream produced no output. ${JSON.stringify({
                        modelId: registeredModel.modelId,
                        provider: registeredModel.sdkPackage,
                        workspaceId: workspace.id,
                        threadId,
                        streamId,
                        turnId,
                        messageCount: messages.length,
                        conversationSizeTokens,
                        elapsedMs: Math.round(performance.now() - streamStartedAt),
                        underlyingError: underlying instanceof Error ? `${underlying.name}: ${underlying.message}` : String(underlying ?? 'none-recorded')
                    })}`), {
                        cause: underlying
                    })
                ]);
                return;
            }
            this.exceptionHandlerService.captureExceptions([
                error
            ]);
        });
        return {
            stream,
            modelConfig,
            hasNoMoreAvailableCredits: ()=>hasNoMoreAvailableCredits
        };
    }
    sanitizeMessagePartsForModel(messages, directlyCallableToolNames) {
        return messages.map((message)=>({
                ...message,
                parts: (0, _guideuncallabletoolcallstometatoolutil.guideUncallableToolCallsToMetaTool)((0, _finalizedanglingtoolpartsutil.finalizeDanglingToolParts)(message.parts), directlyCallableToolNames)
            }));
    }
    injectBrowsingContextIntoLastUserMessage(messages, contextString) {
        const lastUserIndex = messages.map((message)=>message.role).lastIndexOf('user');
        if (lastUserIndex === -1) {
            return messages;
        }
        const lastUserMessage = messages[lastUserIndex];
        const browsingContextPart = {
            type: 'text',
            text: `<browsing_context note="Only use this if the user explicitly asks about the current page, record, or view. Do not call any tools based on this context.">\n${contextString}\n</browsing_context>`
        };
        return [
            ...messages.slice(0, lastUserIndex),
            {
                ...lastUserMessage,
                parts: [
                    ...lastUserMessage.parts,
                    browsingContextPart
                ]
            },
            ...messages.slice(lastUserIndex + 1)
        ];
    }
    buildContextFromBrowsingContext(workspace, browsingContext) {
        if (browsingContext.type === 'recordPage') {
            return this.buildRecordPageContext(workspace, browsingContext.objectNameSingular, browsingContext.recordId, browsingContext.pageLayoutId, browsingContext.activeTabId);
        }
        if (browsingContext.type === 'listView') {
            return this.buildListViewContext(browsingContext);
        }
        return '';
    }
    buildRecordPageContext(workspace, objectNameSingular, recordId, pageLayoutId, activeTabId) {
        const resourceUrl = this.workspaceDomainsService.buildWorkspaceURL({
            workspace,
            pathname: (0, _utils.getAppPath)(_types.AppPath.RecordShowPage, {
                objectNameSingular,
                objectRecordId: recordId
            })
        });
        let context = `The user is viewing a ${objectNameSingular} record (ID: ${recordId}, URL: ${resourceUrl}). Use tools to fetch record details if needed.`;
        if ((0, _utils.isDefined)(pageLayoutId)) {
            context += `\nPage layout ID: ${pageLayoutId}.`;
        }
        if ((0, _utils.isDefined)(activeTabId)) {
            context += `\nActive tab ID: ${activeTabId}.`;
        }
        return context;
    }
    buildListViewContext(browsingContext) {
        const { objectNameSingular, viewId, viewName, filterDescriptions } = browsingContext;
        let context = `The user is viewing a list of ${objectNameSingular} records in a view called "${viewName}" (viewId: ${viewId}).`;
        if (filterDescriptions.length > 0) {
            context += `\nFilters applied: ${filterDescriptions.join(', ')}`;
        }
        context += `\nUse get_view_query_parameters tool with this viewId to get the exact filter/sort parameters for querying records.`;
        return context;
    }
    async storeExtractedFiles(files, _workspaceId) {
        return files.map((file)=>({
                filename: file.filename,
                fileId: file.fileId
            }));
    }
    constructor(toolRegistry, skillService, aiModelRegistryService, aiBillingService, agentActorContextService, workspaceDomainsService, codeInterpreterService, exceptionHandlerService, nativeToolBinder, messagePruningService, metricsService){
        this.toolRegistry = toolRegistry;
        this.skillService = skillService;
        this.aiModelRegistryService = aiModelRegistryService;
        this.aiBillingService = aiBillingService;
        this.agentActorContextService = agentActorContextService;
        this.workspaceDomainsService = workspaceDomainsService;
        this.codeInterpreterService = codeInterpreterService;
        this.exceptionHandlerService = exceptionHandlerService;
        this.nativeToolBinder = nativeToolBinder;
        this.messagePruningService = messagePruningService;
        this.metricsService = metricsService;
        this.logger = new _common.Logger(ChatExecutionService.name);
    }
};
ChatExecutionService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _toolregistryservice.ToolRegistryService === "undefined" ? Object : _toolregistryservice.ToolRegistryService,
        typeof _skillservice.SkillService === "undefined" ? Object : _skillservice.SkillService,
        typeof _aimodelregistryservice.AiModelRegistryService === "undefined" ? Object : _aimodelregistryservice.AiModelRegistryService,
        typeof _aibillingservice.AiBillingService === "undefined" ? Object : _aibillingservice.AiBillingService,
        typeof _agentactorcontextservice.AgentActorContextService === "undefined" ? Object : _agentactorcontextservice.AgentActorContextService,
        typeof _workspacedomainsservice.WorkspaceDomainsService === "undefined" ? Object : _workspacedomainsservice.WorkspaceDomainsService,
        typeof _codeinterpreterservice.CodeInterpreterService === "undefined" ? Object : _codeinterpreterservice.CodeInterpreterService,
        typeof _exceptionhandlerservice.ExceptionHandlerService === "undefined" ? Object : _exceptionhandlerservice.ExceptionHandlerService,
        typeof _nativetoolbinderservice.NativeToolBinderService === "undefined" ? Object : _nativetoolbinderservice.NativeToolBinderService,
        typeof _messagepruningservice.MessagePruningService === "undefined" ? Object : _messagepruningservice.MessagePruningService,
        typeof _metricsservice.MetricsService === "undefined" ? Object : _metricsservice.MetricsService
    ])
], ChatExecutionService);

//# sourceMappingURL=chat-execution.service.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AgentAsyncExecutorService", {
    enumerable: true,
    get: function() {
        return AgentAsyncExecutorService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _ai = require("ai");
const _constants = require("twenty-shared/constants");
const _utils = require("twenty-shared/utils");
const _isuserauthcontextguard = require("../../../../core-modules/auth/guards/is-user-auth-context.guard");
const _billingusageservice = require("../../../../core-modules/billing/services/billing-usage.service");
const _toolexecutiondurationmsbucketboundariesconstant = require("../../../../core-modules/metrics/constants/tool-execution-duration-ms-bucket-boundaries.constant");
const _tooloutputtokensbucketboundariesconstant = require("../../../../core-modules/metrics/constants/tool-output-tokens-bucket-boundaries.constant");
const _metricsservice = require("../../../../core-modules/metrics/metrics.service");
const _metricskeystype = require("../../../../core-modules/metrics/types/metrics-keys.type");
const _toolregistryservice = require("../../../../core-modules/tool-provider/services/tool-registry.service");
const _tools = require("../../../../core-modules/tool-provider/tools");
const _buildtoolcatalogsectionutil = require("../../../../core-modules/tool-provider/utils/build-tool-catalog-section.util");
const _estimatetooloutputtokensutil = require("../../../../core-modules/tool-provider/utils/estimate-tool-output-tokens.util");
const _gettoolmetricnameutil = require("../../../../core-modules/tool-provider/utils/get-tool-metric-name.util");
const _istooloutputsuccessfulutil = require("../../../../core-modules/tool-provider/utils/is-tool-output-successful.util");
const _outputnavigationtoolnamesconstant = require("../../../../core-modules/tool/tools/output-navigation-tool/constants/output-navigation-tool-names.constant");
const _usageoperationtypeenum = require("../../../../core-modules/usage/enums/usage-operation-type.enum");
const _workspaceentity = require("../../../../core-modules/workspace/workspace.entity");
const _workflowagentregistrytoolcategoriesconst = require("../constants/workflow-agent-registry-tool-categories.const");
const _buildagentrolepermissionconfigutil = require("../utils/build-agent-role-permission-config.util");
const _agentconfigconst = require("../../ai-agent/constants/agent-config.const");
const _structuredoutputsystempromptconst = require("../../ai-agent/constants/structured-output-system-prompt.const");
const _repairtoolcallutil = require("../../ai-agent/utils/repair-tool-call.util");
const _nativewebsearchcostpercalldollars = require("../../ai-billing/constants/native-web-search-cost-per-call-dollars");
const _aibillingservice = require("../../ai-billing/services/ai-billing.service");
const _convertdollarstobillingcreditsutil = require("../../ai-billing/utils/convert-dollars-to-billing-credits.util");
const _countnativewebsearchcallsfromstepsutil = require("../../ai-billing/utils/count-native-web-search-calls-from-steps.util");
const _extractcachecreationtokensutil = require("../../ai-billing/utils/extract-cache-creation-tokens.util");
const _mergelanguagemodelusageutil = require("../../ai-billing/utils/merge-language-model-usage.util");
const _provideroptionsutil = require("../../ai-chat/utils/provider-options.util");
const _buildaitelemetryutil = require("../../ai-models/utils/build-ai-telemetry.util");
const _aimodelconfigservice = require("../../ai-models/services/ai-model-config.service");
const _aimodelregistryservice = require("../../ai-models/services/ai-model-registry.service");
const _nativetoolbinderservice = require("../../ai-models/services/native-tool-binder.service");
const _aiexception = require("../../ai.exception");
const _roletargetentity = require("../../../role-target/role-target.entity");
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
const EMPTY_USAGE = {
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
};
let AgentAsyncExecutorService = class AgentAsyncExecutorService {
    async getAgentRoleId(agentId, workspaceId) {
        const roleTarget = await this.roleTargetRepository.findOne(workspaceId, {
            where: {
                agentId
            },
            select: [
                'roleId'
            ]
        });
        return roleTarget?.roleId;
    }
    resolveUserIdentity(authContext) {
        if ((0, _utils.isDefined)(authContext) && (0, _isuserauthcontextguard.isUserAuthContext)(authContext)) {
            return {
                userId: authContext.user.id,
                userWorkspaceId: authContext.userWorkspaceId
            };
        }
        return {};
    }
    // Workflow agent nodes run a scoped task: pre-load the full schemas of the
    // few explicitly-granted objects so the model skips the learn_tools round trip.
    async buildPreloadedRegistryTools({ agent, agentRoleId, runAsRoleId, authContext, actorContext }) {
        const { userId, userWorkspaceId } = this.resolveUserIdentity(authContext);
        const toolProviderContext = {
            workspaceId: agent.workspaceId,
            roleId: agentRoleId,
            rolePermissionConfig: (0, _buildagentrolepermissionconfigutil.buildAgentRolePermissionConfig)({
                agentRoleId,
                runAsRoleId
            }),
            requireExplicitObjectGrants: true,
            authContext,
            actorContext,
            userId,
            userWorkspaceId
        };
        return this.toolRegistry.getToolsByCategories(toolProviderContext, {
            categories: _workflowagentregistrytoolcategoriesconst.WORKFLOW_AGENT_REGISTRY_TOOL_CATEGORIES,
            excludeTools: [
                ..._outputnavigationtoolnamesconstant.OUTPUT_NAVIGATION_TOOL_NAMES
            ],
            wrapWithErrorContext: false
        });
    }
    // Open-ended agents (runAgent / Slack) need broad object access, which would
    // make pre-loading ship every schema. Expose a compact catalog plus the
    // learn_tools / execute_tool meta-tools instead, using composed role
    // permissions rather than explicit grants only.
    async buildLazyRegistryTools({ agent, agentRoleId, runAsRoleId, authContext, actorContext }) {
        const { userId, userWorkspaceId } = this.resolveUserIdentity(authContext);
        const rolePermissionConfig = (0, _utils.isDefined)(runAsRoleId) ? (0, _buildagentrolepermissionconfigutil.buildAgentRolePermissionConfig)({
            agentRoleId,
            runAsRoleId
        }) : undefined;
        const toolContext = {
            workspaceId: agent.workspaceId,
            roleId: agentRoleId,
            rolePermissionConfig,
            authContext,
            actorContext,
            userId,
            userWorkspaceId
        };
        const fullCatalog = await this.toolRegistry.buildToolIndex(agent.workspaceId, agentRoleId, {
            userId,
            userWorkspaceId,
            rolePermissionConfig
        });
        const allowedCategories = new Set(_workflowagentregistrytoolcategoriesconst.WORKFLOW_AGENT_REGISTRY_TOOL_CATEGORIES);
        const excludedToolNames = new Set(_outputnavigationtoolnamesconstant.OUTPUT_NAVIGATION_TOOL_NAMES);
        const catalog = fullCatalog.filter((entry)=>allowedCategories.has(entry.category) && !excludedToolNames.has(entry.name));
        // Restrict the meta-tools to the shown catalog. Enforced at call time, so a
        // tool that appears after the catalog was built still can't be reached,
        // preserving the recursion guard.
        const allowedToolNames = new Set(catalog.map((entry)=>entry.name));
        const isToolAllowed = (toolName)=>allowedToolNames.has(toolName);
        const tools = {
            [_tools.LEARN_TOOLS_TOOL_NAME]: (0, _tools.createLearnToolsTool)(this.toolRegistry, toolContext, {
                isToolAllowed,
                spillLargeOutput: true
            }),
            [_tools.EXECUTE_TOOL_TOOL_NAME]: (0, _tools.createExecuteToolTool)(this.toolRegistry, toolContext, {
                isToolAllowed,
                compactOutput: true,
                spillLargeOutput: true
            })
        };
        return {
            tools,
            catalogSection: (0, _buildtoolcatalogsectionutil.buildToolCatalogSection)(catalog, [])
        };
    }
    async executeAgent({ agent, messages, baseSystemPrompt, actorContext, authContext, workspaceId, userWorkspaceId, runAsRoleId, operationType = _usageoperationtypeenum.UsageOperationType.AI_WORKFLOW_TOKEN, toolLoadingStrategy = 'preload' }) {
        if (!(0, _utils.isNonEmptyArray)(messages)) {
            throw new _aiexception.AiException('Provide at least one message to run an agent', _aiexception.AiExceptionCode.INVALID_AGENT_INPUT);
        }
        await this.billingUsageService.hasAvailableCreditsOrThrow(workspaceId);
        let accumulatedUsage = EMPTY_USAGE;
        let cacheCreationTokens = 0;
        let nativeWebSearchCallCount = 0;
        let executionSteps = [];
        try {
            if (agent) {
                const workspace = await this.workspaceRepository.findOneBy({
                    id: agent.workspaceId
                });
                if (workspace) {
                    this.aiModelRegistryService.validateModelAvailability(agent.modelId, workspace);
                }
            }
            const registeredModel = await this.aiModelRegistryService.resolveModelForAgent(agent);
            let tools = {};
            let toolCatalogSection = '';
            let providerOptions = (0, _provideroptionsutil.getCallLevelProviderOptions)({
                sdkPackage: registeredModel.sdkPackage,
                providerOptions: undefined,
                promptCacheKey: agent?.id
            });
            if (agent) {
                const agentRoleId = await this.getAgentRoleId(agent.id, agent.workspaceId);
                const nativeModelToolOptions = {
                    webSearch: agent.modelConfiguration?.webSearch?.enabled === true,
                    twitterSearch: agent.modelConfiguration?.twitterSearch?.enabled === true
                };
                let registryTools = {};
                // Registry tools are scoped exclusively by the agent permission-tab
                // role. No role means no registry tools.
                if ((0, _utils.isDefined)(agentRoleId)) {
                    if (toolLoadingStrategy === 'lazy') {
                        const lazyToolset = await this.buildLazyRegistryTools({
                            agent,
                            agentRoleId,
                            runAsRoleId,
                            authContext,
                            actorContext
                        });
                        registryTools = lazyToolset.tools;
                        toolCatalogSection = lazyToolset.catalogSection;
                    } else {
                        registryTools = await this.buildPreloadedRegistryTools({
                            agent,
                            agentRoleId,
                            runAsRoleId,
                            authContext,
                            actorContext
                        });
                    }
                }
                const nativeTools = this.nativeToolBinder.bind(registeredModel, nativeModelToolOptions);
                tools = {
                    ...registryTools,
                    ...nativeTools
                };
                providerOptions = (0, _provideroptionsutil.getCallLevelProviderOptions)({
                    sdkPackage: registeredModel.sdkPackage,
                    providerOptions: this.aiModelConfigService.getReasoningProviderOptions(registeredModel),
                    promptCacheKey: agent?.id
                });
            }
            this.logger.log(`Generated ${Object.keys(tools).length} tools for agent`);
            let hasNoMoreAvailableCredits = false;
            const textResponse = await (0, _ai.generateText)({
                system: `${baseSystemPrompt}\n\n${agent ? (0, _utils.tipTapDocumentToMarkdown)(agent.prompt) : ''}${toolCatalogSection}`,
                tools,
                model: registeredModel.model,
                messages: messages.map((message)=>({
                        role: message.role,
                        content: message.content
                    })),
                stopWhen: (step)=>(0, _ai.stepCountIs)(_agentconfigconst.AGENT_CONFIG.MAX_STEPS)(step) || hasNoMoreAvailableCredits,
                providerOptions,
                experimental_telemetry: (0, _buildaitelemetryutil.buildAiTelemetry)({
                    functionId: 'agent-execution',
                    workspaceId,
                    userWorkspaceId,
                    agentId: agent?.id
                }),
                experimental_onToolCallFinish: (event)=>{
                    this.metricsService.recordHistogram({
                        key: _metricskeystype.MetricsKeys.WorkflowAgentToolExecutionDurationMs,
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
                    const { hasNoMoreAvailableCredits: stepHasNoMoreAvailableCredits } = await this.aiBillingService.decrementAndCheckAvailableCredits(registeredModel.modelId, {
                        usage: step.usage,
                        cacheCreationTokens: (0, _extractcachecreationtokensutil.extractCacheCreationTokens)(step.providerMetadata)
                    }, workspaceId);
                    if (stepHasNoMoreAvailableCredits) {
                        hasNoMoreAvailableCredits = true;
                    }
                    for (const part of step.content){
                        if (part.type !== 'tool-result' && part.type !== 'tool-error') {
                            continue;
                        }
                        const succeeded = part.type === 'tool-result' && (0, _istooloutputsuccessfulutil.isToolOutputSuccessful)(part.output);
                        const toolAttributes = {
                            model: registeredModel.modelId,
                            tool: (0, _gettoolmetricnameutil.getToolMetricName)(part.toolName)
                        };
                        this.metricsService.incrementCounterBy({
                            key: succeeded ? _metricskeystype.MetricsKeys.WorkflowAgentToolExecutionSucceeded : _metricskeystype.MetricsKeys.WorkflowAgentToolExecutionFailed,
                            amount: 1,
                            attributes: toolAttributes
                        });
                        this.metricsService.recordHistogram({
                            key: _metricskeystype.MetricsKeys.WorkflowAgentToolOutputTokens,
                            value: (0, _estimatetooloutputtokensutil.estimateToolOutputTokens)(part.type === 'tool-result' ? part.output : part.error),
                            unit: 'token',
                            attributes: toolAttributes,
                            bucketBoundaries: _tooloutputtokensbucketboundariesconstant.TOOL_OUTPUT_TOKENS_BUCKET_BOUNDARIES
                        });
                    }
                },
                experimental_repairToolCall: async ({ toolCall, tools: toolsForRepair, inputSchema, error })=>{
                    return (0, _repairtoolcallutil.repairToolCall)({
                        toolCall,
                        tools: toolsForRepair,
                        inputSchema,
                        error,
                        model: registeredModel.model
                    });
                }
            });
            accumulatedUsage = textResponse.usage;
            cacheCreationTokens = (0, _extractcachecreationtokensutil.extractCacheCreationTokensFromSteps)(textResponse.steps);
            nativeWebSearchCallCount = (0, _countnativewebsearchcallsfromstepsutil.countNativeWebSearchCallsFromSteps)(textResponse.steps);
            executionSteps = textResponse.steps;
            const agentSchema = agent?.responseFormat?.type === 'json' ? agent.responseFormat.schema : undefined;
            let result = {
                response: textResponse.text
            };
            if (agentSchema) {
                const structuredResult = await (0, _ai.generateText)({
                    system: _structuredoutputsystempromptconst.STRUCTURED_OUTPUT_SYSTEM_PROMPT,
                    model: registeredModel.model,
                    prompt: `Based on the following execution results, generate the structured output according to the schema:

                 Execution Results: ${textResponse.text}

                 Please generate the structured output based on the execution results and context above.`,
                    output: _ai.Output.object({
                        schema: (0, _ai.jsonSchema)(agentSchema)
                    }),
                    providerOptions: (0, _provideroptionsutil.getCallLevelProviderOptions)({
                        sdkPackage: registeredModel.sdkPackage,
                        providerOptions: undefined,
                        promptCacheKey: agent?.id
                    }),
                    experimental_telemetry: (0, _buildaitelemetryutil.buildAiTelemetry)({
                        functionId: 'agent-structured-output',
                        workspaceId,
                        userWorkspaceId,
                        agentId: agent?.id
                    }),
                    onStepFinish: async (step)=>{
                        const { hasNoMoreAvailableCredits: stepHasNoMoreAvailableCredits } = await this.aiBillingService.decrementAndCheckAvailableCredits(registeredModel.modelId, {
                            usage: step.usage,
                            cacheCreationTokens: (0, _extractcachecreationtokensutil.extractCacheCreationTokens)(step.providerMetadata)
                        }, workspaceId);
                        if (stepHasNoMoreAvailableCredits) {
                            hasNoMoreAvailableCredits = true;
                        }
                    }
                });
                accumulatedUsage = (0, _mergelanguagemodelusageutil.mergeLanguageModelUsage)(textResponse.usage, structuredResult.usage);
                executionSteps = [
                    ...textResponse.steps,
                    ...structuredResult.steps
                ];
                if (structuredResult.output == null) {
                    throw new _aiexception.AiException('Failed to generate structured output from execution results', _aiexception.AiExceptionCode.AGENT_EXECUTION_FAILED);
                }
                result = structuredResult.output;
            }
            const resolvedModelId = registeredModel.modelId;
            const tokenCostInDollars = this.aiBillingService.calculateCost(resolvedModelId, {
                usage: accumulatedUsage,
                cacheCreationTokens
            });
            const totalCostInDollars = tokenCostInDollars + nativeWebSearchCallCount * _nativewebsearchcostpercalldollars.NATIVE_WEB_SEARCH_COST_PER_CALL_DOLLARS;
            const creditsUsedMicro = Math.round((0, _convertdollarstobillingcreditsutil.convertDollarsToBillingCredits)(totalCostInDollars));
            return {
                result,
                usage: accumulatedUsage,
                cacheCreationTokens,
                nativeWebSearchCallCount,
                hasNoMoreAvailableCredits,
                steps: executionSteps,
                modelId: resolvedModelId,
                totalCostInDollars,
                creditsUsedMicro
            };
        } catch (error) {
            if (error instanceof _aiexception.AiException) {
                throw error;
            }
            throw new _aiexception.AiException(error instanceof Error ? error.message : 'Agent execution failed', _aiexception.AiExceptionCode.AGENT_EXECUTION_FAILED);
        } finally{
            const modelId = agent?.modelId ?? _constants.AUTO_SELECT_SMART_MODEL_ID;
            const costInDollars = this.aiBillingService.calculateCost(modelId, {
                usage: accumulatedUsage,
                cacheCreationTokens
            });
            const creditsUsedMicro = Math.round((0, _convertdollarstobillingcreditsutil.convertDollarsToBillingCredits)(costInDollars));
            const totalTokens = (accumulatedUsage.inputTokens ?? 0) + (accumulatedUsage.outputTokens ?? 0);
            void this.aiBillingService.emitAiTokenUsageEvent(workspaceId, creditsUsedMicro, totalTokens, modelId, operationType, agent?.id ?? null, userWorkspaceId);
            void this.aiBillingService.billNativeWebSearchUsage(nativeWebSearchCallCount, workspaceId, userWorkspaceId);
        }
    }
    constructor(aiModelRegistryService, aiModelConfigService, toolRegistry, nativeToolBinder, aiBillingService, billingUsageService, metricsService, roleTargetRepository, workspaceRepository){
        this.aiModelRegistryService = aiModelRegistryService;
        this.aiModelConfigService = aiModelConfigService;
        this.toolRegistry = toolRegistry;
        this.nativeToolBinder = nativeToolBinder;
        this.aiBillingService = aiBillingService;
        this.billingUsageService = billingUsageService;
        this.metricsService = metricsService;
        this.roleTargetRepository = roleTargetRepository;
        this.workspaceRepository = workspaceRepository;
        this.logger = new _common.Logger(AgentAsyncExecutorService.name);
    }
};
AgentAsyncExecutorService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(7, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_roletargetentity.RoleTargetEntity)),
    _ts_param(8, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _aimodelregistryservice.AiModelRegistryService === "undefined" ? Object : _aimodelregistryservice.AiModelRegistryService,
        typeof _aimodelconfigservice.AiModelConfigService === "undefined" ? Object : _aimodelconfigservice.AiModelConfigService,
        typeof _toolregistryservice.ToolRegistryService === "undefined" ? Object : _toolregistryservice.ToolRegistryService,
        typeof _nativetoolbinderservice.NativeToolBinderService === "undefined" ? Object : _nativetoolbinderservice.NativeToolBinderService,
        typeof _aibillingservice.AiBillingService === "undefined" ? Object : _aibillingservice.AiBillingService,
        typeof _billingusageservice.BillingUsageService === "undefined" ? Object : _billingusageservice.BillingUsageService,
        typeof _metricsservice.MetricsService === "undefined" ? Object : _metricsservice.MetricsService,
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof Repository === "undefined" ? Object : Repository
    ])
], AgentAsyncExecutorService);

//# sourceMappingURL=agent-async-executor.service.js.map
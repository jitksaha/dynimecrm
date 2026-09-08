"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AgentRunService", {
    enumerable: true,
    get: function() {
        return AgentRunService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _applicationservice = require("../../../../core-modules/application/application.service");
const _usageoperationtypeenum = require("../../../../core-modules/usage/enums/usage-operation-type.enum");
const _agentactorcontextservice = require("./agent-actor-context.service");
const _agentasyncexecutorservice = require("./agent-async-executor.service");
const _agentrunbasesystempromptconst = require("../../ai-agent/constants/agent-run-base-system-prompt.const");
const _agententity = require("../../ai-agent/entities/agent.entity");
const _withdedicatedaitraceutil = require("../../ai-models/utils/with-dedicated-ai-trace.util");
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
let AgentRunService = class AgentRunService {
    async run({ workspace, requestUserWorkspaceId, requestWorkspaceMemberId, callerApplication, input }) {
        const prompt = input.prompt;
        // GraphQL cannot express XOR; enforce exactly one of prompt or messages
        if ((0, _utils.isNonEmptyArray)(input.messages) === (0, _guards.isNonEmptyString)(prompt)) {
            throw new _aiexception.AiException('Provide exactly one of prompt or messages', _aiexception.AiExceptionCode.INVALID_AGENT_INPUT);
        }
        const messages = (0, _guards.isNonEmptyString)(prompt) ? [
            {
                role: 'user',
                content: prompt
            }
        ] : input.messages ?? [];
        const agent = await this.agentRepository.findOne(workspace.id, {
            where: {
                universalIdentifier: input.agentUniversalIdentifier
            }
        });
        if (!agent) {
            throw new _common.NotFoundException(`Agent ${input.agentUniversalIdentifier} not found`);
        }
        if ((0, _utils.isDefined)(callerApplication) && agent.applicationId !== callerApplication.id) {
            throw new _aiexception.AiException(`Agent ${input.agentUniversalIdentifier} belongs to another application`, _aiexception.AiExceptionCode.RUN_AGENT_NOT_ALLOWED);
        }
        const application = await this.applicationService.findById(agent.applicationId);
        if (!application) {
            throw new _common.NotFoundException(`Application ${agent.applicationId} not found for agent ${input.agentUniversalIdentifier}`);
        }
        const runAsContext = await this.resolveRunAsContext({
            runAsWorkspaceMemberId: input.runAsWorkspaceMemberId,
            callerApplication,
            requestUserWorkspaceId,
            requestWorkspaceMemberId,
            workspaceId: workspace.id,
            application
        });
        const authContext = runAsContext?.authContext ?? {
            type: 'application',
            workspace,
            application
        };
        try {
            const executionResult = await (0, _withdedicatedaitraceutil.withDedicatedAiTrace)(()=>this.agentAsyncExecutorService.executeAgent({
                    agent,
                    messages,
                    baseSystemPrompt: _agentrunbasesystempromptconst.AGENT_RUN_BASE_SYSTEM_PROMPT,
                    actorContext: runAsContext?.actorContext,
                    authContext,
                    workspaceId: workspace.id,
                    userWorkspaceId: runAsContext?.authContext.userWorkspaceId ?? requestUserWorkspaceId,
                    runAsRoleId: runAsContext?.roleId,
                    operationType: _usageoperationtypeenum.UsageOperationType.AI_WORKFLOW_TOKEN,
                    toolLoadingStrategy: 'lazy'
                }));
            if (executionResult.hasNoMoreAvailableCredits) {
                return {
                    result: null,
                    error: 'AI agent stopped: no more available credits.',
                    success: false
                };
            }
            return {
                result: executionResult.result,
                error: null,
                success: true
            };
        } catch (error) {
            this.logger.error(`Agent execution failed for ${input.agentUniversalIdentifier}`, error instanceof Error ? error.stack : error);
            return {
                result: null,
                error: 'Agent execution failed.',
                success: false
            };
        }
    }
    async resolveRunAsContext({ runAsWorkspaceMemberId, callerApplication, requestUserWorkspaceId, requestWorkspaceMemberId, workspaceId, application }) {
        if (!(0, _utils.isDefined)(runAsWorkspaceMemberId)) {
            return undefined;
        }
        if (!(0, _utils.isDefined)(callerApplication)) {
            throw new _aiexception.AiException('Running an agent as a workspace member requires an application access token', _aiexception.AiExceptionCode.RUN_AS_WORKSPACE_MEMBER_NOT_ALLOWED);
        }
        if ((0, _utils.isDefined)(requestUserWorkspaceId) && requestWorkspaceMemberId !== runAsWorkspaceMemberId) {
            throw new _aiexception.AiException('An application token issued for a user can only run an agent as that user', _aiexception.AiExceptionCode.RUN_AS_WORKSPACE_MEMBER_NOT_ALLOWED);
        }
        return this.agentActorContextService.buildRunAsWorkspaceMemberContext({
            workspaceMemberId: runAsWorkspaceMemberId,
            workspaceId,
            viaApplication: application
        });
    }
    constructor(agentActorContextService, agentAsyncExecutorService, applicationService, agentRepository){
        this.agentActorContextService = agentActorContextService;
        this.agentAsyncExecutorService = agentAsyncExecutorService;
        this.applicationService = applicationService;
        this.agentRepository = agentRepository;
        this.logger = new _common.Logger(AgentRunService.name);
    }
};
AgentRunService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(3, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_agententity.AgentEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _agentactorcontextservice.AgentActorContextService === "undefined" ? Object : _agentactorcontextservice.AgentActorContextService,
        typeof _agentasyncexecutorservice.AgentAsyncExecutorService === "undefined" ? Object : _agentasyncexecutorservice.AgentAsyncExecutorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository
    ])
], AgentRunService);

//# sourceMappingURL=agent-run.service.js.map
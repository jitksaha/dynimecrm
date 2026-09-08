"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AiAgentWorkflowAction", {
    enumerable: true,
    get: function() {
        return AiAgentWorkflowAction;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _usageoperationtypeenum = require("../../../../../engine/core-modules/usage/enums/usage-operation-type.enum");
const _agentasyncexecutorservice = require("../../../../../engine/metadata-modules/ai/ai-agent-execution/services/agent-async-executor.service");
const _workflowbasesystempromptconst = require("../../../../../engine/metadata-modules/ai/ai-agent/constants/workflow-base-system-prompt.const");
const _agententity = require("../../../../../engine/metadata-modules/ai/ai-agent/entities/agent.entity");
const _injectworkspacescopedrepositorydecorator = require("../../../../../engine/twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../../../../engine/twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
const _workflowstepexecutorexception = require("../../exceptions/workflow-step-executor.exception");
const _workflowexecutioncontextservice = require("../../services/workflow-execution-context.service");
const _findsteporthrowutil = require("../../utils/find-step-or-throw.util");
const _buildaiagentsteplogutil = require("./utils/build-ai-agent-step-log.util");
const _workflowrunsteplogworkspaceservice = require("../../../workflow-runner/workflow-run/workflow-run-step-log.workspace-service");
const _isworkflowaiagentactionguard = require("./guards/is-workflow-ai-agent-action.guard");
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
let AiAgentWorkflowAction = class AiAgentWorkflowAction {
    async execute({ currentStepId, steps, context, runInfo }) {
        const step = (0, _findsteporthrowutil.findStepOrThrow)({
            stepId: currentStepId,
            steps
        });
        if (!(0, _isworkflowaiagentactionguard.isWorkflowAiAgentAction)(step)) {
            throw new _workflowstepexecutorexception.WorkflowStepExecutorException('Step is not an AI Agent action', _workflowstepexecutorexception.WorkflowStepExecutorExceptionCode.INVALID_STEP_TYPE);
        }
        const { agentId, prompt } = step.settings.input;
        const workspaceId = runInfo.workspaceId;
        let agent = null;
        if (agentId) {
            agent = await this.agentRepository.findOne(workspaceId, {
                where: {
                    id: agentId
                }
            });
        }
        if (agentId && !agent) {
            throw new _workflowstepexecutorexception.WorkflowStepExecutorException(`Agent with id ${agentId} not found`, _workflowstepexecutorexception.WorkflowStepExecutorExceptionCode.INVALID_STEP_INPUT);
        }
        const executionContext = await this.workflowExecutionContextService.getExecutionContext(runInfo);
        const userWorkspaceId = executionContext.authContext.type === 'user' ? executionContext.authContext.userWorkspaceId : null;
        const startedAtMs = Date.now();
        const executionResult = await this.aiAgentExecutionService.executeAgent({
            agent,
            messages: [
                {
                    role: 'user',
                    content: (0, _utils.resolveInput)(prompt, context)
                }
            ],
            baseSystemPrompt: _workflowbasesystempromptconst.WORKFLOW_BASE_SYSTEM_PROMPT,
            actorContext: executionContext.isActingOnBehalfOfUser ? executionContext.initiator : undefined,
            authContext: executionContext.authContext,
            workspaceId,
            userWorkspaceId,
            operationType: _usageoperationtypeenum.UsageOperationType.AI_WORKFLOW_TOKEN
        });
        const durationMs = Date.now() - startedAtMs;
        await this.persistStepLog({
            workflowRunId: runInfo.workflowRunId,
            workspaceId,
            stepId: currentStepId,
            executionResult,
            durationMs
        });
        if (executionResult.hasNoMoreAvailableCredits) {
            return {
                error: 'AI agent stopped: no more available credits.'
            };
        }
        return {
            result: executionResult.result
        };
    }
    async persistStepLog({ workflowRunId, workspaceId, stepId, executionResult, durationMs }) {
        const stepLog = (0, _buildaiagentsteplogutil.buildAiAgentStepLog)({
            executionResult,
            durationMs
        });
        if (!stepLog) {
            return;
        }
        try {
            await this.workflowRunStepLogService.setStepLog({
                workflowRunId,
                workspaceId,
                stepId,
                stepLog
            });
        } catch (error) {
            this.logger.warn(`Failed to persist step log for workflowRun=${workflowRunId} step=${stepId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    constructor(aiAgentExecutionService, workflowExecutionContextService, workflowRunStepLogService, agentRepository){
        this.aiAgentExecutionService = aiAgentExecutionService;
        this.workflowExecutionContextService = workflowExecutionContextService;
        this.workflowRunStepLogService = workflowRunStepLogService;
        this.agentRepository = agentRepository;
        this.logger = new _common.Logger(AiAgentWorkflowAction.name);
    }
};
AiAgentWorkflowAction = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(3, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_agententity.AgentEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _agentasyncexecutorservice.AgentAsyncExecutorService === "undefined" ? Object : _agentasyncexecutorservice.AgentAsyncExecutorService,
        typeof _workflowexecutioncontextservice.WorkflowExecutionContextService === "undefined" ? Object : _workflowexecutioncontextservice.WorkflowExecutionContextService,
        typeof _workflowrunsteplogworkspaceservice.WorkflowRunStepLogWorkspaceService === "undefined" ? Object : _workflowrunsteplogworkspaceservice.WorkflowRunStepLogWorkspaceService,
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository
    ])
], AiAgentWorkflowAction);

//# sourceMappingURL=ai-agent.workflow-action.js.map
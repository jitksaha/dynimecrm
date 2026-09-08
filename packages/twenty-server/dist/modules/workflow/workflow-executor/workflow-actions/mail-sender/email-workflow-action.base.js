"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmailWorkflowActionBase", {
    enumerable: true,
    get: function() {
        return EmailWorkflowActionBase;
    }
});
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _buildsystemauthcontextutil = require("../../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _workflowstepexecutorexception = require("../../exceptions/workflow-step-executor.exception");
const _buildemailsteplogutil = require("./utils/build-email-step-log.util");
const _resolveemailbodyutil = require("./utils/resolve-email-body.util");
const _resolveemailfilesutil = require("./utils/resolve-email-files.util");
const _toolbackedworkflowaction = require("../tool-backed/tool-backed.workflow-action");
let EmailWorkflowActionBase = class EmailWorkflowActionBase extends _toolbackedworkflowaction.ToolBackedWorkflowAction {
    async preprocessInput(rawInput, context) {
        const files = (0, _resolveemailfilesutil.resolveEmailFiles)(rawInput.files, context);
        const body = (0, _utils.isDefined)(rawInput.body) ? await (0, _resolveemailbodyutil.resolveEmailBody)(rawInput.body, context) : rawInput.body;
        return {
            ...rawInput,
            body,
            files
        };
    }
    resolveInput(input, context) {
        const { body, ...inputWithoutBody } = input;
        return {
            ...(0, _utils.resolveInput)(inputWithoutBody, context),
            body
        };
    }
    async postprocessInput(resolvedInput, workspaceId) {
        if (!(0, _utils.isDefined)(resolvedInput.connectedAccountId)) {
            return resolvedInput;
        }
        const connectedAccountId = await this.resolveSenderConnectedAccountId(resolvedInput.connectedAccountId, workspaceId);
        return {
            ...resolvedInput,
            connectedAccountId
        };
    }
    // The sender configured on an email step is either a connected account id
    // (static pick) or a workspace member id (from a resolved workflow variable).
    // When it is a workspace member id, resolve that member's first connected
    // account; otherwise return it unchanged so the regular connected account
    // flow applies. Only meaningful inside workflow email actions.
    async resolveSenderConnectedAccountId(senderId, workspaceId) {
        if (!(0, _utils.isValidUuid)(senderId)) {
            return senderId;
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const workspaceMember = await this.findWorkspaceMemberById(senderId);
            if (!(0, _utils.isDefined)(workspaceMember)) {
                return senderId;
            }
            const connectedAccountId = await this.findFirstConnectedAccountIdByWorkspaceMember(workspaceMember, workspaceId);
            if (!(0, _utils.isDefined)(connectedAccountId)) {
                throw new _workflowstepexecutorexception.WorkflowStepExecutorException(`No connected account found for workspace member '${senderId}'`, _workflowstepexecutorexception.WorkflowStepExecutorExceptionCode.INVALID_STEP_INPUT);
            }
            return connectedAccountId;
        }, authContext);
    }
    async findWorkspaceMemberById(workspaceMemberId) {
        const workspaceMemberRepository = this.workspaceOrmManager.getRepository('workspaceMember', {
            shouldBypassPermissionChecks: true
        });
        return workspaceMemberRepository.findOne({
            where: {
                id: workspaceMemberId
            }
        });
    }
    async findFirstConnectedAccountIdByWorkspaceMember(workspaceMember, workspaceId) {
        const userWorkspace = await this.userWorkspaceRepository.findOne({
            where: {
                userId: workspaceMember.userId,
                workspaceId
            }
        });
        if (!(0, _utils.isDefined)(userWorkspace)) {
            return null;
        }
        const connectedAccount = await this.connectedAccountRepository.findOne({
            where: {
                userWorkspaceId: userWorkspace.id,
                workspaceId,
                archivedAt: (0, _typeorm.IsNull)()
            },
            order: {
                createdAt: 'ASC'
            }
        });
        return connectedAccount?.id ?? null;
    }
    buildStepLog({ input, output, durationMs }) {
        return (0, _buildemailsteplogutil.buildEmailStepLog)({
            mode: this.getMode(),
            input,
            output,
            durationMs
        });
    }
    constructor(loggerName, workflowRunStepLogService, workspaceOrmManager, connectedAccountRepository, userWorkspaceRepository){
        super(loggerName, workflowRunStepLogService), this.workspaceOrmManager = workspaceOrmManager, this.connectedAccountRepository = connectedAccountRepository, this.userWorkspaceRepository = userWorkspaceRepository;
    }
};

//# sourceMappingURL=email-workflow-action.base.js.map
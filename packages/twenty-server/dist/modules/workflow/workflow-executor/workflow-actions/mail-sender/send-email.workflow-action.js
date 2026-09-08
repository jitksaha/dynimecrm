"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SendEmailWorkflowAction", {
    enumerable: true,
    get: function() {
        return SendEmailWorkflowAction;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _sendemailtool = require("../../../../../engine/core-modules/tool/tools/email-tool/send-email-tool");
const _userworkspaceentity = require("../../../../../engine/core-modules/user-workspace/user-workspace.entity");
const _connectedaccountentity = require("../../../../../engine/metadata-modules/connected-account/entities/connected-account.entity");
const _workspaceormmanager = require("../../../../../engine/twenty-orm/workspace-orm.manager");
const _workflowstepexecutorexception = require("../../exceptions/workflow-step-executor.exception");
const _emailworkflowactionbase = require("./email-workflow-action.base");
const _isworkflowsendemailactionguard = require("./guards/is-workflow-send-email-action.guard");
const _workflowrunsteplogworkspaceservice = require("../../../workflow-runner/workflow-run/workflow-run-step-log.workspace-service");
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
let SendEmailWorkflowAction = class SendEmailWorkflowAction extends _emailworkflowactionbase.EmailWorkflowActionBase {
    getTool() {
        return this.sendEmailTool;
    }
    getMode() {
        return 'SEND';
    }
    assertStep(step) {
        if (!(0, _isworkflowsendemailactionguard.isWorkflowSendEmailAction)(step)) {
            throw new _workflowstepexecutorexception.WorkflowStepExecutorException('Step is not a send-email action', _workflowstepexecutorexception.WorkflowStepExecutorExceptionCode.INVALID_STEP_TYPE);
        }
    }
    constructor(sendEmailTool, workflowRunStepLogService, workspaceOrmManager, connectedAccountRepository, userWorkspaceRepository){
        super(SendEmailWorkflowAction.name, workflowRunStepLogService, workspaceOrmManager, connectedAccountRepository, userWorkspaceRepository), this.sendEmailTool = sendEmailTool;
    }
};
SendEmailWorkflowAction = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(3, (0, _typeorm.InjectRepository)(_connectedaccountentity.ConnectedAccountEntity)),
    _ts_param(4, (0, _typeorm.InjectRepository)(_userworkspaceentity.UserWorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _sendemailtool.SendEmailTool === "undefined" ? Object : _sendemailtool.SendEmailTool,
        typeof _workflowrunsteplogworkspaceservice.WorkflowRunStepLogWorkspaceService === "undefined" ? Object : _workflowrunsteplogworkspaceservice.WorkflowRunStepLogWorkspaceService,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof Repository === "undefined" ? Object : Repository,
        typeof Repository === "undefined" ? Object : Repository
    ])
], SendEmailWorkflowAction);

//# sourceMappingURL=send-email.workflow-action.js.map
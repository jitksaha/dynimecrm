"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DraftEmailWorkflowAction", {
    enumerable: true,
    get: function() {
        return DraftEmailWorkflowAction;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _draftemailtool = require("../../../../../engine/core-modules/tool/tools/email-tool/draft-email-tool");
const _userworkspaceentity = require("../../../../../engine/core-modules/user-workspace/user-workspace.entity");
const _connectedaccountentity = require("../../../../../engine/metadata-modules/connected-account/entities/connected-account.entity");
const _workspaceormmanager = require("../../../../../engine/twenty-orm/workspace-orm.manager");
const _workflowstepexecutorexception = require("../../exceptions/workflow-step-executor.exception");
const _emailworkflowactionbase = require("./email-workflow-action.base");
const _isworkflowdraftemailactionguard = require("./guards/is-workflow-draft-email-action.guard");
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
let DraftEmailWorkflowAction = class DraftEmailWorkflowAction extends _emailworkflowactionbase.EmailWorkflowActionBase {
    getTool() {
        return this.draftEmailTool;
    }
    getMode() {
        return 'DRAFT';
    }
    assertStep(step) {
        if (!(0, _isworkflowdraftemailactionguard.isWorkflowDraftEmailAction)(step)) {
            throw new _workflowstepexecutorexception.WorkflowStepExecutorException('Step is not a draft-email action', _workflowstepexecutorexception.WorkflowStepExecutorExceptionCode.INVALID_STEP_TYPE);
        }
    }
    constructor(draftEmailTool, workflowRunStepLogService, workspaceOrmManager, connectedAccountRepository, userWorkspaceRepository){
        super(DraftEmailWorkflowAction.name, workflowRunStepLogService, workspaceOrmManager, connectedAccountRepository, userWorkspaceRepository), this.draftEmailTool = draftEmailTool;
    }
};
DraftEmailWorkflowAction = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(3, (0, _typeorm.InjectRepository)(_connectedaccountentity.ConnectedAccountEntity)),
    _ts_param(4, (0, _typeorm.InjectRepository)(_userworkspaceentity.UserWorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _draftemailtool.DraftEmailTool === "undefined" ? Object : _draftemailtool.DraftEmailTool,
        typeof _workflowrunsteplogworkspaceservice.WorkflowRunStepLogWorkspaceService === "undefined" ? Object : _workflowrunsteplogworkspaceservice.WorkflowRunStepLogWorkspaceService,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof Repository === "undefined" ? Object : Repository,
        typeof Repository === "undefined" ? Object : Repository
    ])
], DraftEmailWorkflowAction);

//# sourceMappingURL=draft-email.workflow-action.js.map
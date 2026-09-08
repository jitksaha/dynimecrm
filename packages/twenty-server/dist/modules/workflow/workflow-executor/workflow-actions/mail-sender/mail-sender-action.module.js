"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MailSenderActionModule", {
    enumerable: true,
    get: function() {
        return MailSenderActionModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _toolmodule = require("../../../../../engine/core-modules/tool/tool.module");
const _userworkspaceentity = require("../../../../../engine/core-modules/user-workspace/user-workspace.entity");
const _connectedaccountentity = require("../../../../../engine/metadata-modules/connected-account/entities/connected-account.entity");
const _draftemailworkflowaction = require("./draft-email.workflow-action");
const _sendemailworkflowaction = require("./send-email.workflow-action");
const _workflowrunmodule = require("../../../workflow-runner/workflow-run/workflow-run.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let MailSenderActionModule = class MailSenderActionModule {
};
MailSenderActionModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _toolmodule.ToolModule,
            _workflowrunmodule.WorkflowRunModule,
            _typeorm.TypeOrmModule.forFeature([
                _connectedaccountentity.ConnectedAccountEntity,
                _userworkspaceentity.UserWorkspaceEntity
            ])
        ],
        providers: [
            _sendemailworkflowaction.SendEmailWorkflowAction,
            _draftemailworkflowaction.DraftEmailWorkflowAction
        ],
        exports: [
            _sendemailworkflowaction.SendEmailWorkflowAction,
            _draftemailworkflowaction.DraftEmailWorkflowAction
        ]
    })
], MailSenderActionModule);

//# sourceMappingURL=mail-sender-action.module.js.map
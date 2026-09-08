"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LogicFunctionActionModule", {
    enumerable: true,
    get: function() {
        return LogicFunctionActionModule;
    }
});
const _common = require("@nestjs/common");
const _applicationmodule = require("../../../../../engine/core-modules/application/application.module");
const _logicfunctionmodule = require("../../../../../engine/core-modules/logic-function/logic-function.module");
const _userworkspacemodule = require("../../../../../engine/core-modules/user-workspace/user-workspace.module");
const _workspacemanyorallflatentitymapscachemodule = require("../../../../../engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.module");
const _rolemodule = require("../../../../../engine/metadata-modules/role/role.module");
const _userrolemodule = require("../../../../../engine/metadata-modules/user-role/user-role.module");
const _workflowcommonmodule = require("../../../common/workflow-common.module");
const _workflowexecutioncontextservice = require("../../services/workflow-execution-context.service");
const _logicfunctionworkflowaction = require("./logic-function.workflow-action");
const _workflowrunmodule = require("../../../workflow-runner/workflow-run/workflow-run.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let LogicFunctionActionModule = class LogicFunctionActionModule {
};
LogicFunctionActionModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _applicationmodule.ApplicationModule,
            _logicfunctionmodule.LogicFunctionModule,
            _workspacemanyorallflatentitymapscachemodule.WorkspaceManyOrAllFlatEntityMapsCacheModule,
            _workflowrunmodule.WorkflowRunModule,
            _userworkspacemodule.UserWorkspaceModule,
            _userrolemodule.UserRoleModule,
            _rolemodule.RoleModule,
            _workflowcommonmodule.WorkflowCommonModule
        ],
        providers: [
            _workflowexecutioncontextservice.WorkflowExecutionContextService,
            _logicfunctionworkflowaction.LogicFunctionWorkflowAction
        ],
        exports: [
            _logicfunctionworkflowaction.LogicFunctionWorkflowAction
        ]
    })
], LogicFunctionActionModule);

//# sourceMappingURL=logic-function-action.module.js.map
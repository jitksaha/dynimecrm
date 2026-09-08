"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HttpRequestActionModule", {
    enumerable: true,
    get: function() {
        return HttpRequestActionModule;
    }
});
const _common = require("@nestjs/common");
const _toolmodule = require("../../../../../engine/core-modules/tool/tool.module");
const _httprequestworkflowaction = require("./http-request.workflow-action");
const _workflowrunmodule = require("../../../workflow-runner/workflow-run/workflow-run.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let HttpRequestActionModule = class HttpRequestActionModule {
};
HttpRequestActionModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _toolmodule.ToolModule,
            _workflowrunmodule.WorkflowRunModule
        ],
        providers: [
            _httprequestworkflowaction.HttpRequestWorkflowAction
        ],
        exports: [
            _httprequestworkflowaction.HttpRequestWorkflowAction
        ]
    })
], HttpRequestActionModule);

//# sourceMappingURL=http-request-action.module.js.map
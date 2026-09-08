"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HttpRequestWorkflowAction", {
    enumerable: true,
    get: function() {
        return HttpRequestWorkflowAction;
    }
});
const _common = require("@nestjs/common");
const _httptool = require("../../../../../engine/core-modules/tool/tools/http-tool/http-tool");
const _workflowstepexecutorexception = require("../../exceptions/workflow-step-executor.exception");
const _isworkflowhttprequestactionguard = require("./guards/is-workflow-http-request-action.guard");
const _buildhttprequeststeplogutil = require("./utils/build-http-request-step-log.util");
const _toolbackedworkflowaction = require("../tool-backed/tool-backed.workflow-action");
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
let HttpRequestWorkflowAction = class HttpRequestWorkflowAction extends _toolbackedworkflowaction.ToolBackedWorkflowAction {
    getTool() {
        return this.httpTool;
    }
    assertStep(step) {
        if (!(0, _isworkflowhttprequestactionguard.isWorkflowHttpRequestAction)(step)) {
            throw new _workflowstepexecutorexception.WorkflowStepExecutorException('Step is not an HTTP request action', _workflowstepexecutorexception.WorkflowStepExecutorExceptionCode.INVALID_STEP_TYPE);
        }
    }
    buildStepLog({ input, output, durationMs }) {
        return (0, _buildhttprequeststeplogutil.buildHttpRequestStepLog)({
            input,
            output,
            durationMs
        });
    }
    constructor(httpTool, workflowRunStepLogService){
        super(HttpRequestWorkflowAction.name, workflowRunStepLogService), this.httpTool = httpTool;
    }
};
HttpRequestWorkflowAction = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _httptool.HttpTool === "undefined" ? Object : _httptool.HttpTool,
        typeof _workflowrunsteplogworkspaceservice.WorkflowRunStepLogWorkspaceService === "undefined" ? Object : _workflowrunsteplogworkspaceservice.WorkflowRunStepLogWorkspaceService
    ])
], HttpRequestWorkflowAction);

//# sourceMappingURL=http-request.workflow-action.js.map
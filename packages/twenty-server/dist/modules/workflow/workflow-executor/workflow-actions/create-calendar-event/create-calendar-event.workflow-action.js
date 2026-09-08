"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateCalendarEventWorkflowAction", {
    enumerable: true,
    get: function() {
        return CreateCalendarEventWorkflowAction;
    }
});
const _common = require("@nestjs/common");
const _createcalendareventtool = require("../../../../../engine/core-modules/tool/tools/calendar-tool/create-calendar-event-tool");
const _workflowstepexecutorexception = require("../../exceptions/workflow-step-executor.exception");
const _isworkflowcreatecalendareventactionguard = require("./guards/is-workflow-create-calendar-event-action.guard");
const _buildcreatecalendareventsteplogutil = require("./utils/build-create-calendar-event-step-log.util");
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
let CreateCalendarEventWorkflowAction = class CreateCalendarEventWorkflowAction extends _toolbackedworkflowaction.ToolBackedWorkflowAction {
    getTool() {
        return this.createCalendarEventTool;
    }
    assertStep(step) {
        if (!(0, _isworkflowcreatecalendareventactionguard.isWorkflowCreateCalendarEventAction)(step)) {
            throw new _workflowstepexecutorexception.WorkflowStepExecutorException('Step is not a create-calendar-event action', _workflowstepexecutorexception.WorkflowStepExecutorExceptionCode.INVALID_STEP_TYPE);
        }
    }
    buildStepLog({ input, output, durationMs }) {
        return (0, _buildcreatecalendareventsteplogutil.buildCreateCalendarEventStepLog)({
            input,
            output,
            durationMs
        });
    }
    constructor(createCalendarEventTool, workflowRunStepLogService){
        super(CreateCalendarEventWorkflowAction.name, workflowRunStepLogService), this.createCalendarEventTool = createCalendarEventTool;
    }
};
CreateCalendarEventWorkflowAction = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createcalendareventtool.CreateCalendarEventTool === "undefined" ? Object : _createcalendareventtool.CreateCalendarEventTool,
        typeof _workflowrunsteplogworkspaceservice.WorkflowRunStepLogWorkspaceService === "undefined" ? Object : _workflowrunsteplogworkspaceservice.WorkflowRunStepLogWorkspaceService
    ])
], CreateCalendarEventWorkflowAction);

//# sourceMappingURL=create-calendar-event.workflow-action.js.map
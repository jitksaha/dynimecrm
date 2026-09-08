"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkflowActionFactory", {
    enumerable: true,
    get: function() {
        return WorkflowActionFactory;
    }
});
const _common = require("@nestjs/common");
const _workflowstepexecutorexception = require("../exceptions/workflow-step-executor.exception");
const _aiagentworkflowaction = require("../workflow-actions/ai-agent/ai-agent.workflow-action");
const _codeworkflowaction = require("../workflow-actions/code/code.workflow-action");
const _delayworkflowaction = require("../workflow-actions/delay/delay.workflow-action");
const _emptyworkflowaction = require("../workflow-actions/empty/empty.workflow-action");
const _filterworkflowaction = require("../workflow-actions/filter/filter.workflow-action");
const _formworkflowaction = require("../workflow-actions/form/form.workflow-action");
const _httprequestworkflowaction = require("../workflow-actions/http-request/http-request.workflow-action");
const _ifelseworkflowaction = require("../workflow-actions/if-else/if-else.workflow-action");
const _createcalendareventworkflowaction = require("../workflow-actions/create-calendar-event/create-calendar-event.workflow-action");
const _iteratorworkflowaction = require("../workflow-actions/iterator/iterator.workflow-action");
const _logicfunctionworkflowaction = require("../workflow-actions/logic-function/logic-function.workflow-action");
const _draftemailworkflowaction = require("../workflow-actions/mail-sender/draft-email.workflow-action");
const _sendemailworkflowaction = require("../workflow-actions/mail-sender/send-email.workflow-action");
const _createrecordworkflowaction = require("../workflow-actions/record-crud/create-record.workflow-action");
const _deleterecordworkflowaction = require("../workflow-actions/record-crud/delete-record.workflow-action");
const _findrecordsworkflowaction = require("../workflow-actions/record-crud/find-records.workflow-action");
const _pickrecordworkflowaction = require("../workflow-actions/record-crud/pick-record.workflow-action");
const _updaterecordworkflowaction = require("../workflow-actions/record-crud/update-record.workflow-action");
const _upsertrecordworkflowaction = require("../workflow-actions/record-crud/upsert-record.workflow-action");
const _workflow = require("twenty-shared/workflow");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let WorkflowActionFactory = class WorkflowActionFactory {
    get(stepType) {
        switch(stepType){
            case _workflow.WorkflowActionType.CODE:
                return this.codeWorkflowAction;
            case _workflow.WorkflowActionType.LOGIC_FUNCTION:
                return this.logicFunctionWorkflowAction;
            case _workflow.WorkflowActionType.SEND_EMAIL:
                return this.sendEmailWorkflowAction;
            case _workflow.WorkflowActionType.DRAFT_EMAIL:
                return this.draftEmailWorkflowAction;
            case _workflow.WorkflowActionType.CREATE_CALENDAR_EVENT:
                return this.createCalendarEventWorkflowAction;
            case _workflow.WorkflowActionType.CREATE_RECORD:
                return this.createRecordWorkflowAction;
            case _workflow.WorkflowActionType.UPSERT_RECORD:
                return this.upsertRecordWorkflowAction;
            case _workflow.WorkflowActionType.UPDATE_RECORD:
                return this.updateRecordWorkflowAction;
            case _workflow.WorkflowActionType.DELETE_RECORD:
                return this.deleteRecordWorkflowAction;
            case _workflow.WorkflowActionType.FIND_RECORDS:
                return this.findRecordsWorkflowAction;
            case _workflow.WorkflowActionType.PICK_RECORD:
                return this.pickRecordWorkflowAction;
            case _workflow.WorkflowActionType.FORM:
                return this.formWorkflowAction;
            case _workflow.WorkflowActionType.FILTER:
                return this.filterWorkflowAction;
            case _workflow.WorkflowActionType.IF_ELSE:
                return this.ifElseWorkflowAction;
            case _workflow.WorkflowActionType.ITERATOR:
                return this.iteratorWorkflowAction;
            case _workflow.WorkflowActionType.HTTP_REQUEST:
                return this.httpRequestWorkflowAction;
            case _workflow.WorkflowActionType.AI_AGENT:
                return this.aiAgentWorkflowAction;
            case _workflow.WorkflowActionType.EMPTY:
                return this.emptyWorkflowAction;
            case _workflow.WorkflowActionType.DELAY:
                return this.delayWorkflowAction;
            default:
                throw new _workflowstepexecutorexception.WorkflowStepExecutorException(`Workflow step executor not found for step type '${stepType}'`, _workflowstepexecutorexception.WorkflowStepExecutorExceptionCode.INVALID_STEP_TYPE);
        }
    }
    constructor(codeWorkflowAction, logicFunctionWorkflowAction, createRecordWorkflowAction, upsertRecordWorkflowAction, updateRecordWorkflowAction, deleteRecordWorkflowAction, findRecordsWorkflowAction, pickRecordWorkflowAction, formWorkflowAction, filterWorkflowAction, ifElseWorkflowAction, iteratorWorkflowAction, httpRequestWorkflowAction, sendEmailWorkflowAction, draftEmailWorkflowAction, createCalendarEventWorkflowAction, aiAgentWorkflowAction, emptyWorkflowAction, delayWorkflowAction){
        this.codeWorkflowAction = codeWorkflowAction;
        this.logicFunctionWorkflowAction = logicFunctionWorkflowAction;
        this.createRecordWorkflowAction = createRecordWorkflowAction;
        this.upsertRecordWorkflowAction = upsertRecordWorkflowAction;
        this.updateRecordWorkflowAction = updateRecordWorkflowAction;
        this.deleteRecordWorkflowAction = deleteRecordWorkflowAction;
        this.findRecordsWorkflowAction = findRecordsWorkflowAction;
        this.pickRecordWorkflowAction = pickRecordWorkflowAction;
        this.formWorkflowAction = formWorkflowAction;
        this.filterWorkflowAction = filterWorkflowAction;
        this.ifElseWorkflowAction = ifElseWorkflowAction;
        this.iteratorWorkflowAction = iteratorWorkflowAction;
        this.httpRequestWorkflowAction = httpRequestWorkflowAction;
        this.sendEmailWorkflowAction = sendEmailWorkflowAction;
        this.draftEmailWorkflowAction = draftEmailWorkflowAction;
        this.createCalendarEventWorkflowAction = createCalendarEventWorkflowAction;
        this.aiAgentWorkflowAction = aiAgentWorkflowAction;
        this.emptyWorkflowAction = emptyWorkflowAction;
        this.delayWorkflowAction = delayWorkflowAction;
    }
};
WorkflowActionFactory = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _codeworkflowaction.CodeWorkflowAction === "undefined" ? Object : _codeworkflowaction.CodeWorkflowAction,
        typeof _logicfunctionworkflowaction.LogicFunctionWorkflowAction === "undefined" ? Object : _logicfunctionworkflowaction.LogicFunctionWorkflowAction,
        typeof _createrecordworkflowaction.CreateRecordWorkflowAction === "undefined" ? Object : _createrecordworkflowaction.CreateRecordWorkflowAction,
        typeof _upsertrecordworkflowaction.UpsertRecordWorkflowAction === "undefined" ? Object : _upsertrecordworkflowaction.UpsertRecordWorkflowAction,
        typeof _updaterecordworkflowaction.UpdateRecordWorkflowAction === "undefined" ? Object : _updaterecordworkflowaction.UpdateRecordWorkflowAction,
        typeof _deleterecordworkflowaction.DeleteRecordWorkflowAction === "undefined" ? Object : _deleterecordworkflowaction.DeleteRecordWorkflowAction,
        typeof _findrecordsworkflowaction.FindRecordsWorkflowAction === "undefined" ? Object : _findrecordsworkflowaction.FindRecordsWorkflowAction,
        typeof _pickrecordworkflowaction.PickRecordWorkflowAction === "undefined" ? Object : _pickrecordworkflowaction.PickRecordWorkflowAction,
        typeof _formworkflowaction.FormWorkflowAction === "undefined" ? Object : _formworkflowaction.FormWorkflowAction,
        typeof _filterworkflowaction.FilterWorkflowAction === "undefined" ? Object : _filterworkflowaction.FilterWorkflowAction,
        typeof _ifelseworkflowaction.IfElseWorkflowAction === "undefined" ? Object : _ifelseworkflowaction.IfElseWorkflowAction,
        typeof _iteratorworkflowaction.IteratorWorkflowAction === "undefined" ? Object : _iteratorworkflowaction.IteratorWorkflowAction,
        typeof _httprequestworkflowaction.HttpRequestWorkflowAction === "undefined" ? Object : _httprequestworkflowaction.HttpRequestWorkflowAction,
        typeof _sendemailworkflowaction.SendEmailWorkflowAction === "undefined" ? Object : _sendemailworkflowaction.SendEmailWorkflowAction,
        typeof _draftemailworkflowaction.DraftEmailWorkflowAction === "undefined" ? Object : _draftemailworkflowaction.DraftEmailWorkflowAction,
        typeof _createcalendareventworkflowaction.CreateCalendarEventWorkflowAction === "undefined" ? Object : _createcalendareventworkflowaction.CreateCalendarEventWorkflowAction,
        typeof _aiagentworkflowaction.AiAgentWorkflowAction === "undefined" ? Object : _aiagentworkflowaction.AiAgentWorkflowAction,
        typeof _emptyworkflowaction.EmptyWorkflowAction === "undefined" ? Object : _emptyworkflowaction.EmptyWorkflowAction,
        typeof _delayworkflowaction.DelayWorkflowAction === "undefined" ? Object : _delayworkflowaction.DelayWorkflowAction
    ])
], WorkflowActionFactory);

//# sourceMappingURL=workflow-action.factory.js.map
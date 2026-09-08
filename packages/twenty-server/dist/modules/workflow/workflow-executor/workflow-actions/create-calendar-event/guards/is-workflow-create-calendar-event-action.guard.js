"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isWorkflowCreateCalendarEventAction", {
    enumerable: true,
    get: function() {
        return isWorkflowCreateCalendarEventAction;
    }
});
const _workflow = require("twenty-shared/workflow");
const isWorkflowCreateCalendarEventAction = (action)=>{
    return action.type === _workflow.WorkflowActionType.CREATE_CALENDAR_EVENT;
};

//# sourceMappingURL=is-workflow-create-calendar-event-action.guard.js.map
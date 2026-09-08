"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get isCachedCronTrigger () {
        return isCachedCronTrigger;
    },
    get isCachedDatabaseEventTrigger () {
        return isCachedDatabaseEventTrigger;
    }
});
const _workflowautomatedtriggerworkspaceentity = require("../../../../modules/workflow/common/standard-objects/workflow-automated-trigger.workspace-entity");
const isCachedCronTrigger = (trigger)=>trigger.type === _workflowautomatedtriggerworkspaceentity.AutomatedTriggerType.CRON;
const isCachedDatabaseEventTrigger = (trigger)=>trigger.type === _workflowautomatedtriggerworkspaceentity.AutomatedTriggerType.DATABASE_EVENT;

//# sourceMappingURL=cached-workflow-automated-trigger.util.js.map
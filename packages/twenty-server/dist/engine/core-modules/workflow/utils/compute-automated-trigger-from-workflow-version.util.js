"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeAutomatedTriggerFromWorkflowVersion", {
    enumerable: true,
    get: function() {
        return computeAutomatedTriggerFromWorkflowVersion;
    }
});
const _buildcoredispatchidsutil = require("./build-core-dispatch-ids.util");
const _workflowautomatedtriggerworkspaceentity = require("../../../../modules/workflow/common/standard-objects/workflow-automated-trigger.workspace-entity");
const _workflowtriggertype = require("../../../../modules/workflow/workflow-trigger/types/workflow-trigger.type");
const _computecronpatternfromschedule = require("../../../../modules/workflow/workflow-trigger/utils/compute-cron-pattern-from-schedule");
const computeAutomatedTriggerFromWorkflowVersion = ({ workflowVersion, workspaceWorkflowVersionId })=>{
    const trigger = workflowVersion.triggers?.[0] ?? null;
    if (trigger === null) {
        return null;
    }
    switch(trigger.type){
        case _workflowtriggertype.WorkflowTriggerType.DATABASE_EVENT:
            return {
                workflowId: workflowVersion.workflowId,
                ...(0, _buildcoredispatchidsutil.buildCoreDispatchIds)({
                    coreWorkflowVersionId: workflowVersion.id,
                    workspaceWorkflowVersionId
                }),
                type: _workflowautomatedtriggerworkspaceentity.AutomatedTriggerType.DATABASE_EVENT,
                settings: trigger.settings
            };
        case _workflowtriggertype.WorkflowTriggerType.CRON:
            return {
                workflowId: workflowVersion.workflowId,
                ...(0, _buildcoredispatchidsutil.buildCoreDispatchIds)({
                    coreWorkflowVersionId: workflowVersion.id,
                    workspaceWorkflowVersionId
                }),
                type: _workflowautomatedtriggerworkspaceentity.AutomatedTriggerType.CRON,
                settings: {
                    pattern: (0, _computecronpatternfromschedule.computeCronPatternFromSchedule)(trigger)
                }
            };
        case _workflowtriggertype.WorkflowTriggerType.MANUAL:
        case _workflowtriggertype.WorkflowTriggerType.WEBHOOK:
            return null;
        default:
            return null;
    }
};

//# sourceMappingURL=compute-automated-trigger-from-workflow-version.util.js.map
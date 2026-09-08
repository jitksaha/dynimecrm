"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getRunnableStepIds", {
    enumerable: true,
    get: function() {
        return getRunnableStepIds;
    }
});
const _workflowrunworkspaceentity = require("../../common/standard-objects/workflow-run.workspace-entity");
const _shouldexecutesteputil = require("../../workflow-executor/utils/should-execute-step.util");
const _isworkflowiteratoractionguard = require("../../workflow-executor/workflow-actions/iterator/guards/is-workflow-iterator-action.guard");
const _getallstepidsinlooputil = require("../../workflow-executor/workflow-actions/iterator/utils/get-all-step-ids-in-loop.util");
const _getiteratorinitialloopstepidsutil = require("../../workflow-executor/workflow-actions/iterator/utils/get-iterator-initial-loop-step-ids.util");
const getRunnableStepIds = ({ steps, stepInfos })=>{
    const loopInteriorStepIds = new Set();
    for (const step of steps){
        if (!(0, _isworkflowiteratoractionguard.isWorkflowIteratorAction)(step)) {
            continue;
        }
        const loopStepIds = (0, _getallstepidsinlooputil.getAllStepIdsInLoop)({
            iteratorStepId: step.id,
            initialLoopStepIds: (0, _getiteratorinitialloopstepidsutil.getIteratorInitialLoopStepIds)(step),
            steps
        });
        for (const loopStepId of loopStepIds){
            loopInteriorStepIds.add(loopStepId);
        }
    }
    return steps.filter((step)=>{
        if (loopInteriorStepIds.has(step.id)) {
            return false;
        }
        return (0, _shouldexecutesteputil.shouldExecuteStep)({
            step,
            steps,
            stepInfos,
            workflowRunStatus: _workflowrunworkspaceentity.WorkflowRunStatus.RUNNING
        });
    }).map((step)=>step.id);
};

//# sourceMappingURL=get-runnable-step-ids.util.js.map
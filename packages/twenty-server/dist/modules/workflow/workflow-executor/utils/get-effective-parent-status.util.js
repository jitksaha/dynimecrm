"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getEffectiveParentStatus", {
    enumerable: true,
    get: function() {
        return getEffectiveParentStatus;
    }
});
const _utils = require("twenty-shared/utils");
const _workflow = require("twenty-shared/workflow");
const _isworkflowifelseactionguard = require("../workflow-actions/if-else/guards/is-workflow-if-else-action.guard");
const getEffectiveParentStatus = ({ parentStep, childStepId, stepInfos })=>{
    const parentStatus = stepInfos[parentStep.id]?.status;
    if (!(0, _isworkflowifelseactionguard.isWorkflowIfElseAction)(parentStep) || parentStep.nextStepIds?.includes(childStepId)) {
        return parentStatus;
    }
    const matchingBranchId = stepInfos[parentStep.id]?.result?.matchingBranchId;
    if (!(0, _utils.isDefined)(matchingBranchId)) {
        return parentStatus;
    }
    const matchingBranch = parentStep.settings.input.branches.find((branch)=>branch.id === matchingBranchId);
    return matchingBranch?.nextStepIds.includes(childStepId) ? parentStatus : _workflow.StepStatus.SKIPPED;
};

//# sourceMappingURL=get-effective-parent-status.util.js.map
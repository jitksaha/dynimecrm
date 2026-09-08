"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "shouldExecuteChildStep", {
    enumerable: true,
    get: function() {
        return shouldExecuteChildStep;
    }
});
const _workflow = require("twenty-shared/workflow");
const _geteffectiveparentstatusutil = require("./get-effective-parent-status.util");
const shouldExecuteChildStep = ({ parentSteps, childStepId, stepInfos })=>{
    if (parentSteps.length === 0) {
        return true;
    }
    const statuses = parentSteps.map((parentStep)=>(0, _geteffectiveparentstatusutil.getEffectiveParentStatus)({
            parentStep,
            childStepId,
            stepInfos
        }));
    const hasSuccessfulParentStep = statuses.some((status)=>status === _workflow.StepStatus.SUCCESS);
    const areAllParentsCompleted = statuses.every((status)=>status === _workflow.StepStatus.SUCCESS || status === _workflow.StepStatus.STOPPED || status === _workflow.StepStatus.SKIPPED);
    return hasSuccessfulParentStep && areAllParentsCompleted;
};

//# sourceMappingURL=should-execute-child-step.util.js.map
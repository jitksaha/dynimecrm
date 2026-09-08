"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "shouldSkipStepExecution", {
    enumerable: true,
    get: function() {
        return shouldSkipStepExecution;
    }
});
const _workflow = require("twenty-shared/workflow");
const _findparentstepsutil = require("./find-parent-steps.util");
const _geteffectiveparentstatusutil = require("./get-effective-parent-status.util");
const _isworkflowiteratoractionguard = require("../workflow-actions/iterator/guards/is-workflow-iterator-action.guard");
const _shouldskipiteratorstepexecutionutil = require("../workflow-actions/iterator/utils/should-skip-iterator-step-execution.util");
const shouldSkipStepExecution = ({ step, steps, stepInfos })=>{
    if ((0, _isworkflowiteratoractionguard.isWorkflowIteratorAction)(step)) {
        return (0, _shouldskipiteratorstepexecutionutil.shouldSkipIteratorStepExecution)({
            step,
            steps,
            stepInfos
        });
    }
    const parentSteps = (0, _findparentstepsutil.findParentSteps)({
        step,
        steps
    });
    if (parentSteps.length === 0) {
        return false;
    }
    return parentSteps.every((parentStep)=>{
        const status = (0, _geteffectiveparentstatusutil.getEffectiveParentStatus)({
            parentStep,
            childStepId: step.id,
            stepInfos
        });
        return status === _workflow.StepStatus.SKIPPED || status === _workflow.StepStatus.STOPPED || status === _workflow.StepStatus.FAILED_SAFELY;
    });
};

//# sourceMappingURL=should-skip-step-execution.util.js.map
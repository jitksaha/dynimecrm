"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "shouldSkipIteratorStepExecution", {
    enumerable: true,
    get: function() {
        return shouldSkipIteratorStepExecution;
    }
});
const _utils = require("twenty-shared/utils");
const _workflow = require("twenty-shared/workflow");
const _findparentstepsutil = require("../../../utils/find-parent-steps.util");
const _geteffectiveparentstatusutil = require("../../../utils/get-effective-parent-status.util");
const _stephasbeenstartedutil = require("../../../utils/step-has-been-started.util");
const _getallstepidsinlooputil = require("./get-all-step-ids-in-loop.util");
const shouldSkipIteratorStepExecution = ({ step, steps, stepInfos })=>{
    const allParentSteps = (0, _findparentstepsutil.findParentSteps)({
        step,
        steps
    });
    const initialLoopStepIds = step.settings.input.initialLoopStepIds;
    const stepIdsInLoop = (0, _utils.isDefined)(initialLoopStepIds) ? (0, _getallstepidsinlooputil.getAllStepIdsInLoop)({
        iteratorStepId: step.id,
        initialLoopStepIds,
        steps
    }) : [];
    const parentSteps = allParentSteps.filter((parentStep)=>!stepIdsInLoop.includes(parentStep.id));
    if ((0, _stephasbeenstartedutil.stepHasBeenStarted)(step.id, stepInfos) || parentSteps.length === 0) {
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

//# sourceMappingURL=should-skip-iterator-step-execution.util.js.map
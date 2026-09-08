"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildRetryStepInfos", {
    enumerable: true,
    get: function() {
        return buildRetryStepInfos;
    }
});
const _workflow = require("twenty-shared/workflow");
const _isworkflowiteratoractionguard = require("../../workflow-executor/workflow-actions/iterator/guards/is-workflow-iterator-action.guard");
const _buildretryiteratorstepinfosutil = require("./build-retry-iterator-step-infos.util");
const buildRetryStepInfos = ({ steps, stepInfos })=>{
    const stepInfosToUpdate = {};
    const stepIdsToRetry = [];
    for (const step of steps){
        const stepInfo = stepInfos[step.id];
        if (stepInfo?.status !== _workflow.StepStatus.FAILED) {
            continue;
        }
        if ((0, _isworkflowiteratoractionguard.isWorkflowIteratorAction)(step)) {
            const iteratorRetry = (0, _buildretryiteratorstepinfosutil.buildRetryIteratorStepInfos)({
                iteratorStep: step,
                iteratorStepInfo: stepInfo,
                steps
            });
            Object.assign(stepInfosToUpdate, iteratorRetry.stepInfosToUpdate);
            stepIdsToRetry.push(...iteratorRetry.stepIdsToRetry);
            continue;
        }
        stepInfosToUpdate[step.id] = {
            status: _workflow.StepStatus.NOT_STARTED
        };
        stepIdsToRetry.push(step.id);
    }
    return {
        stepInfosToUpdate,
        stepIdsToRetry
    };
};

//# sourceMappingURL=build-retry-step-infos.util.js.map
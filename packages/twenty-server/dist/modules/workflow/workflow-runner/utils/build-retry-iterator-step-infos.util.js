"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildRetryIteratorStepInfos", {
    enumerable: true,
    get: function() {
        return buildRetryIteratorStepInfos;
    }
});
const _utils = require("twenty-shared/utils");
const _workflow = require("twenty-shared/workflow");
const _getallstepidsinlooputil = require("../../workflow-executor/workflow-actions/iterator/utils/get-all-step-ids-in-loop.util");
const _getiteratorinitialloopstepidsutil = require("../../workflow-executor/workflow-actions/iterator/utils/get-iterator-initial-loop-step-ids.util");
const buildRetryIteratorStepInfos = ({ iteratorStep, iteratorStepInfo, steps })=>{
    const iteratorResult = iteratorStepInfo.result;
    const failedMidLoop = (0, _utils.isDefined)(iteratorResult) && iteratorResult.hasProcessedAllItems === false;
    if (failedMidLoop) {
        return {
            stepInfosToUpdate: {
                [iteratorStep.id]: {
                    ...iteratorStepInfo,
                    status: _workflow.StepStatus.RUNNING,
                    error: undefined
                }
            },
            stepIdsToRetry: []
        };
    }
    const loopStepIds = (0, _getallstepidsinlooputil.getAllStepIdsInLoop)({
        iteratorStepId: iteratorStep.id,
        initialLoopStepIds: (0, _getiteratorinitialloopstepidsutil.getIteratorInitialLoopStepIds)(iteratorStep),
        steps
    });
    const stepInfosToUpdate = {};
    for (const loopStepId of loopStepIds){
        stepInfosToUpdate[loopStepId] = {
            status: _workflow.StepStatus.NOT_STARTED
        };
    }
    stepInfosToUpdate[iteratorStep.id] = {
        status: _workflow.StepStatus.NOT_STARTED
    };
    return {
        stepInfosToUpdate,
        stepIdsToRetry: [
            iteratorStep.id
        ]
    };
};

//# sourceMappingURL=build-retry-iterator-step-infos.util.js.map
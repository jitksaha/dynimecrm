"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getNextStepIdsForIterator", {
    enumerable: true,
    get: function() {
        return getNextStepIdsForIterator;
    }
});
const _guards = require("@sniptt/guards");
const getNextStepIdsForIterator = ({ executedStep, executedStepOutput })=>{
    const initialLoopStepIds = (0, _guards.isString)(executedStep.settings.input.initialLoopStepIds) ? JSON.parse(executedStep.settings.input.initialLoopStepIds) : executedStep.settings.input.initialLoopStepIds ?? [];
    if (executedStepOutput.shouldSkipStepExecution) {
        return {
            nextStepIdsToSkip: initialLoopStepIds,
            nextStepIdsToExecute: executedStep.nextStepIds
        };
    }
    if (executedStepOutput.shouldFailSafely) {
        return {
            nextStepIdsToFailSafely: initialLoopStepIds,
            nextStepIdsToExecute: executedStep.nextStepIds
        };
    }
    const iteratorStepResult = executedStepOutput.result;
    if (!iteratorStepResult?.hasProcessedAllItems) {
        return {
            nextStepIdsToExecute: initialLoopStepIds
        };
    }
    return undefined;
};

//# sourceMappingURL=get-next-step-ids-for-iterator.util.js.map
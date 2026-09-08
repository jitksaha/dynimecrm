"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getNextStepIdsForIfElse", {
    enumerable: true,
    get: function() {
        return getNextStepIdsForIfElse;
    }
});
const getNextStepIdsForIfElse = ({ executedStep })=>({
        nextStepIdsToExecute: [
            ...new Set(executedStep.settings.input.branches.flatMap((branch)=>branch.nextStepIds))
        ]
    });

//# sourceMappingURL=get-next-step-ids-for-if-else.util.js.map
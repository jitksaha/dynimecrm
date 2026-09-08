"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getNextStepIdsForStepTypeChange", {
    enumerable: true,
    get: function() {
        return getNextStepIdsForStepTypeChange;
    }
});
const _isworkflowifelseactionguard = require("../../../workflow-executor/workflow-actions/if-else/guards/is-workflow-if-else-action.guard");
const getNextStepIdsForStepTypeChange = ({ existingStep, builtStep })=>{
    if ((0, _isworkflowifelseactionguard.isWorkflowIfElseAction)(builtStep)) {
        return [];
    }
    return existingStep.nextStepIds;
};

//# sourceMappingURL=get-next-step-ids-for-step-type-change.util.js.map
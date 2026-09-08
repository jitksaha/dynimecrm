"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "findParentSteps", {
    enumerable: true,
    get: function() {
        return findParentSteps;
    }
});
const _utils = require("twenty-shared/utils");
const _isworkflowifelseactionguard = require("../workflow-actions/if-else/guards/is-workflow-if-else-action.guard");
const findParentSteps = ({ step, steps })=>{
    return steps.filter((candidateParent)=>{
        if (!(0, _utils.isDefined)(candidateParent)) {
            return false;
        }
        if (candidateParent.nextStepIds?.includes(step.id)) {
            return true;
        }
        if ((0, _isworkflowifelseactionguard.isWorkflowIfElseAction)(candidateParent)) {
            return candidateParent.settings.input.branches.some((branch)=>branch.nextStepIds?.includes(step.id));
        }
        return false;
    });
};

//# sourceMappingURL=find-parent-steps.util.js.map
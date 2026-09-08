"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "shouldFailSafely", {
    enumerable: true,
    get: function() {
        return shouldFailSafely;
    }
});
const _utils = require("twenty-shared/utils");
const _workflow = require("twenty-shared/workflow");
const _terminalstepstatusesconstant = require("../constants/terminal-step-statuses.constant");
const _findparentstepsutil = require("./find-parent-steps.util");
const _geteffectiveparentstatusutil = require("./get-effective-parent-status.util");
const _isworkflowiteratoractionguard = require("../workflow-actions/iterator/guards/is-workflow-iterator-action.guard");
const _shouldfailsafelyiteratorsteputil = require("../workflow-actions/iterator/utils/should-fail-safely-iterator-step.util");
const shouldFailSafely = ({ step, steps, stepInfos })=>{
    if ((0, _isworkflowiteratoractionguard.isWorkflowIteratorAction)(step)) {
        return (0, _shouldfailsafelyiteratorsteputil.shouldFailSafelyIteratorStep)({
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
    const statuses = parentSteps.map((parentStep)=>(0, _geteffectiveparentstatusutil.getEffectiveParentStatus)({
            parentStep,
            childStepId: step.id,
            stepInfos
        }));
    const areAllParentsTerminal = statuses.every((status)=>(0, _utils.isDefined)(status) && _terminalstepstatusesconstant.TERMINAL_STEP_STATUSES.includes(status));
    const hasFailedSafelyParent = statuses.some((status)=>status === _workflow.StepStatus.FAILED_SAFELY);
    return areAllParentsTerminal && hasFailedSafelyParent;
};

//# sourceMappingURL=should-fail-safely.util.js.map
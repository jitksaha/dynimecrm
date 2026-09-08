"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "insertStep", {
    enumerable: true,
    get: function() {
        return insertStep;
    }
});
const _utils = require("twenty-shared/utils");
const _workflow = require("twenty-shared/workflow");
const _workflowversionstepexception = require("../../../common/exceptions/workflow-version-step.exception");
const insertStep = ({ existingSteps, existingTrigger, insertedStep, additionalCreatedSteps = [], nextStepId, parentStepId, parentStepConnectionOptions })=>{
    let { updatedSteps, updatedTrigger } = (0, _utils.isDefined)(parentStepId) ? updateParentStep({
        trigger: existingTrigger,
        steps: existingSteps,
        parentStepId,
        insertedStepId: insertedStep.id,
        nextStepId,
        parentStepConnectionOptions
    }) : {
        updatedSteps: existingSteps,
        updatedTrigger: existingTrigger
    };
    const isInsertedStepIfElse = insertedStep.type === _workflow.WorkflowActionType.IF_ELSE;
    const nextStepIds = (0, _utils.isDefined)(nextStepId) ? [
        nextStepId
    ] : undefined;
    const updatedInsertedStep = {
        ...insertedStep,
        nextStepIds: isInsertedStepIfElse ? undefined : nextStepIds
    };
    const branchStepIds = isInsertedStepIfElse ? insertedStep.settings.input.branches.flatMap((branch)=>branch.nextStepIds) : [];
    const updatedAdditionalSteps = additionalCreatedSteps.map((step)=>(0, _utils.isDefined)(nextStepId) && branchStepIds.includes(step.id) ? {
            ...step,
            nextStepIds
        } : step);
    return {
        updatedSteps: [
            ...updatedSteps,
            updatedInsertedStep,
            ...updatedAdditionalSteps
        ],
        updatedTrigger,
        updatedInsertedStep
    };
};
const updateParentStep = ({ steps, trigger, parentStepId, insertedStepId, nextStepId, parentStepConnectionOptions })=>{
    if ((0, _utils.isDefined)(parentStepConnectionOptions)) {
        return updateStepsWithOptions({
            steps,
            parentStepId,
            insertedStepId,
            parentStepConnectionOptions,
            trigger,
            nextStepId
        });
    } else {
        return updateParentStepNextStepIds({
            steps,
            trigger,
            parentStepId,
            insertedStepId,
            nextStepId
        });
    }
};
const updateParentStepNextStepIds = ({ steps, trigger, parentStepId, insertedStepId, nextStepId })=>{
    let updatedTrigger = trigger;
    let updatedSteps = steps;
    if (parentStepId === _workflow.TRIGGER_STEP_ID) {
        if (!trigger) {
            throw new _workflowversionstepexception.WorkflowVersionStepException('Cannot insert step from undefined trigger', _workflowversionstepexception.WorkflowVersionStepExceptionCode.INVALID_REQUEST);
        }
        updatedTrigger = {
            ...trigger,
            nextStepIds: [
                ...new Set([
                    ...trigger.nextStepIds?.filter((id)=>id !== nextStepId) || [],
                    insertedStepId
                ])
            ]
        };
    } else {
        updatedSteps = steps.map((step)=>{
            if (step.id === parentStepId) {
                return {
                    ...step,
                    nextStepIds: [
                        ...new Set([
                            ...step.nextStepIds?.filter((id)=>id !== nextStepId) || [],
                            insertedStepId
                        ])
                    ]
                };
            }
            return step;
        });
    }
    return {
        updatedSteps,
        updatedTrigger
    };
};
const updateStepsWithOptions = ({ parentStepId, insertedStepId, steps, parentStepConnectionOptions, trigger, nextStepId })=>{
    let updatedSteps = steps;
    switch(parentStepConnectionOptions.connectedStepType){
        case _workflow.WorkflowActionType.IF_ELSE:
            {
                const parentStep = steps.find((step)=>step.id === parentStepId);
                if (parentStep?.type !== _workflow.WorkflowActionType.IF_ELSE) {
                    throw new _workflowversionstepexception.WorkflowVersionStepException(`Step ${parentStepId} is not an If/Else action`, _workflowversionstepexception.WorkflowVersionStepExceptionCode.INVALID_REQUEST);
                }
                const branchId = parentStepConnectionOptions.settings.branchId;
                const branch = parentStep.settings.input.branches.find((branch)=>branch.id === branchId);
                if (!(0, _utils.isDefined)(branch) || (0, _utils.isDefined)(nextStepId) && !branch.nextStepIds.includes(nextStepId)) {
                    throw new _workflowversionstepexception.WorkflowVersionStepException(`Cannot insert a step on branch ${branchId}`, _workflowversionstepexception.WorkflowVersionStepExceptionCode.INVALID_REQUEST);
                }
                const updatedParentStep = {
                    ...parentStep,
                    settings: {
                        ...parentStep.settings,
                        input: {
                            ...parentStep.settings.input,
                            branches: parentStep.settings.input.branches.map((branch)=>branch.id === branchId ? {
                                    ...branch,
                                    nextStepIds: (0, _utils.isDefined)(nextStepId) ? branch.nextStepIds.map((stepId)=>stepId === nextStepId ? insertedStepId : stepId) : [
                                        ...branch.nextStepIds,
                                        insertedStepId
                                    ]
                                } : branch)
                        }
                    }
                };
                updatedSteps = steps.map((step)=>step.id === parentStepId ? updatedParentStep : step);
                break;
            }
        case _workflow.WorkflowActionType.ITERATOR:
            if (!parentStepConnectionOptions.settings.isConnectedToLoop) {
                break;
            }
            updatedSteps = steps.map((step)=>{
                if (step.id === parentStepId) {
                    if (step.type !== _workflow.WorkflowActionType.ITERATOR) {
                        throw new _workflowversionstepexception.WorkflowVersionStepException(`Step ${step.id} is not an iterator`, _workflowversionstepexception.WorkflowVersionStepExceptionCode.INVALID_REQUEST);
                    }
                    return {
                        ...step,
                        settings: {
                            ...step.settings,
                            input: {
                                ...step.settings.input,
                                initialLoopStepIds: [
                                    ...new Set([
                                        ...step.settings.input.initialLoopStepIds?.filter((id)=>id !== nextStepId) || [],
                                        insertedStepId
                                    ])
                                ]
                            }
                        }
                    };
                }
                return step;
            });
            break;
        default:
            break;
    }
    return {
        updatedSteps,
        updatedTrigger: trigger
    };
};

//# sourceMappingURL=insert-step.js.map
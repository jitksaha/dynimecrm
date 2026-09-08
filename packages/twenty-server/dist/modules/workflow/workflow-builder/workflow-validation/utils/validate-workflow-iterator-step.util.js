"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateWorkflowIteratorStep", {
    enumerable: true,
    get: function() {
        return validateWorkflowIteratorStep;
    }
});
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _workflow = require("twenty-shared/workflow");
const validateWorkflowIteratorStep = ({ step, steps, trigger })=>{
    const items = step.settings?.input?.items;
    if (!(0, _guards.isString)(items) || !(0, _utils.isValidVariable)(items)) {
        return [];
    }
    const [variable] = (0, _workflow.extractVariablesFromInput)(items);
    if (!(0, _utils.isDefined)(variable)) {
        return [];
    }
    const [referencedStepId, ...propertyPath] = (0, _workflow.parseVariablePath)(variable);
    if (!(0, _utils.isDefined)(referencedStepId)) {
        return [];
    }
    const outputSchema = referencedStepId === _workflow.TRIGGER_STEP_ID ? trigger?.settings?.outputSchema : steps.find((currentStep)=>currentStep.id === referencedStepId)?.settings?.outputSchema;
    if (!(0, _utils.isDefined)(outputSchema) || !(0, _guards.isObject)(outputSchema)) {
        return [];
    }
    const resolved = (0, _workflow.resolveVariablePathInOutputSchema)({
        schema: outputSchema,
        propertyPath
    });
    if (resolved.found && resolved.type === 'array') {
        return [];
    }
    const arrayPathSuggestions = (0, _workflow.collectOutputSchemaVariablePaths)(outputSchema).filter((path)=>(0, _workflow.resolveVariablePathInOutputSchema)({
            schema: outputSchema,
            propertyPath: path.split('.')
        }).type === 'array').map((path)=>`${referencedStepId}.${path}`);
    const hint = (0, _guards.isNonEmptyArray)(arrayPathSuggestions) ? `Did you mean "{{${arrayPathSuggestions[0]}}}"?${arrayPathSuggestions.length > 1 ? ` Other options: ${arrayPathSuggestions.slice(1).map((suggestion)=>`{{${suggestion}}}`).join(', ')}.` : ''}` : undefined;
    return [
        {
            severity: 'error',
            code: 'ITERATOR_ITEMS_NOT_ARRAY',
            message: `Iterator step "${step.name ?? step.id}" must iterate over an array, but "{{${variable}}}" is not an array.`,
            stepId: step.id,
            path: variable,
            ...(0, _utils.isDefined)(hint) ? {
                hint
            } : {},
            ...(0, _guards.isNonEmptyArray)(arrayPathSuggestions) ? {
                suggestions: arrayPathSuggestions
            } : {}
        }
    ];
};

//# sourceMappingURL=validate-workflow-iterator-step.util.js.map
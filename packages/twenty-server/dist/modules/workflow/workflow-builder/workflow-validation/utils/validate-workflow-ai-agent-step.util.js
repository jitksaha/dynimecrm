"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateWorkflowAiAgentStep", {
    enumerable: true,
    get: function() {
        return validateWorkflowAiAgentStep;
    }
});
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const validateWorkflowAiAgentStep = (step)=>{
    const issues = [];
    if (!(0, _guards.isNonEmptyString)(step.settings?.input?.agentId)) {
        issues.push({
            severity: 'error',
            code: 'AI_AGENT_MISSING_AGENT',
            message: `AI Agent step "${step.name ?? step.id}" has no agent selected.`,
            stepId: step.id
        });
    }
    const outputSchema = step.settings?.outputSchema;
    const hasWorkflowOutputSchema = (0, _utils.isDefined)(outputSchema) && Object.keys(outputSchema).length > 0;
    if (!hasWorkflowOutputSchema) {
        issues.push({
            severity: 'warning',
            code: 'AI_AGENT_MISSING_OUTPUT_VARIABLE',
            message: `AI Agent step "${step.name ?? step.id}" has no output variable defined. Downstream steps won't be able to reference its result.`,
            stepId: step.id
        });
    }
    return issues;
};

//# sourceMappingURL=validate-workflow-ai-agent-step.util.js.map
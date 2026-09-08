"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateWorkflowTriggerTypeRequirements", {
    enumerable: true,
    get: function() {
        return validateWorkflowTriggerTypeRequirements;
    }
});
const _workflow = require("twenty-shared/workflow");
const _workflowtriggertype = require("../../../workflow-trigger/types/workflow-trigger.type");
const _hasworkflowoutputschemautil = require("./has-workflow-output-schema.util");
const _buildmissingworkflowoutputschemaissueutil = require("./build-missing-workflow-output-schema-issue.util");
const validateWorkflowTriggerTypeRequirements = (trigger)=>{
    if (trigger?.type !== _workflowtriggertype.WorkflowTriggerType.WEBHOOK) {
        return [];
    }
    if ((0, _hasworkflowoutputschemautil.hasWorkflowOutputSchema)(trigger.settings)) {
        return [];
    }
    return [
        (0, _buildmissingworkflowoutputschemaissueutil.buildMissingWorkflowOutputSchemaIssue)({
            id: _workflow.TRIGGER_STEP_ID,
            name: trigger.name
        })
    ];
};

//# sourceMappingURL=validate-workflow-trigger-type-requirements.util.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "hasWorkflowOutputSchema", {
    enumerable: true,
    get: function() {
        return hasWorkflowOutputSchema;
    }
});
const _guards = require("@sniptt/guards");
const hasWorkflowOutputSchema = (settings)=>{
    const expectedOutputSchema = settings?.expectedOutputSchema;
    if ((0, _guards.isObject)(expectedOutputSchema) && Object.keys(expectedOutputSchema).length > 0) {
        return true;
    }
    const outputSchema = settings?.outputSchema;
    return (0, _guards.isObject)(outputSchema) && Object.keys(outputSchema).length > 0 && !('_outputSchemaType' in outputSchema && outputSchema._outputSchemaType === 'LINK');
};

//# sourceMappingURL=has-workflow-output-schema.util.js.map
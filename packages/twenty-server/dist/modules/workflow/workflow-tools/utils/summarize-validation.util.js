"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "summarizeValidation", {
    enumerable: true,
    get: function() {
        return summarizeValidation;
    }
});
const summarizeValidation = (result)=>{
    const summary = {
        valid: result.valid,
        errorCount: result.errors.length,
        warningCount: result.warnings.length,
        errors: result.errors.map(({ code, stepId, path, message, suggestions })=>({
                code,
                stepId,
                path,
                message,
                ...suggestions && suggestions.length > 0 ? {
                    suggestions
                } : {}
            }))
    };
    if (!result.valid || result.warnings.length > 0) {
        summary.hint = 'Compact summary. For the full report including warnings and available variable paths, call validate_workflow.';
    }
    return summary;
};

//# sourceMappingURL=summarize-validation.util.js.map
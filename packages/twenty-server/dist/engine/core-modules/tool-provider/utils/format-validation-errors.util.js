"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "formatValidationErrors", {
    enumerable: true,
    get: function() {
        return formatValidationErrors;
    }
});
const getFailureIdentifier = (failure)=>{
    const info = failure.flatEntityMinimalInformation;
    if (!info) {
        return undefined;
    }
    return info.name ?? info.nameSingular ?? info.label ?? info.id;
};
const formatValidationErrors = (error)=>{
    const report = error.failedWorkspaceMigrationBuildResult.report;
    const grouped = new Map();
    for (const [entityType, failures] of Object.entries(report)){
        if (!Array.isArray(failures) || failures.length === 0) {
            continue;
        }
        for (const failure of failures){
            if (!failure.errors || !Array.isArray(failure.errors)) {
                continue;
            }
            const identifier = getFailureIdentifier(failure);
            for (const validationError of failure.errors){
                const message = validationError.message || validationError.code;
                const key = `[${entityType}] ${message}`;
                const existing = grouped.get(key) ?? [];
                if (identifier) {
                    existing.push(identifier);
                }
                grouped.set(key, existing);
            }
        }
    }
    if (grouped.size === 0) {
        return error.message;
    }
    const lines = [];
    for (const [message, identifiers] of grouped){
        if (identifiers.length > 1) {
            lines.push(`${message} (${identifiers.join(', ')})`);
        } else if (identifiers.length === 1) {
            lines.push(`${message} (${identifiers[0]})`);
        } else {
            lines.push(message);
        }
    }
    return `Validation errors:\n${lines.join('\n')}`;
};

//# sourceMappingURL=format-validation-errors.util.js.map
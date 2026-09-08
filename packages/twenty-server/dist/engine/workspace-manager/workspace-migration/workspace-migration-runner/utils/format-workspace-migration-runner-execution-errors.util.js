"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "formatWorkspaceMigrationRunnerExecutionErrors", {
    enumerable: true,
    get: function() {
        return formatWorkspaceMigrationRunnerExecutionErrors;
    }
});
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const MAX_EXECUTION_ERRORS_SUMMARY_LENGTH = 1_500;
const TRUNCATION_MARKER = ' [truncated]';
const POSTGRES_TRANSACTION_ABORTED_CODE = '25P02';
// Ordered by execution phase: transpilation runs before the metadata and
// workspace schema writes.
const EXECUTION_ERROR_LABELS = [
    'actionTranspilation',
    'metadata',
    'workspaceSchema'
];
const getPostgresDriverError = (error)=>error instanceof _typeorm.QueryFailedError ? error.driverError : undefined;
const isTransactionAbortedError = (error)=>getPostgresDriverError(error)?.code === POSTGRES_TRANSACTION_ABORTED_CODE;
const formatSingleExecutionError = (error)=>{
    // Rejection reasons are typed as Error but nothing guarantees it at runtime.
    const baseMessage = error instanceof Error ? error.message : String(error);
    const driverError = getPostgresDriverError(error);
    const driverErrorParts = [
        (0, _utils.isDefined)(driverError?.code) ? `pg code: ${driverError.code}` : null,
        (0, _utils.isDefined)(driverError?.detail) ? `detail: ${driverError.detail}` : null
    ].filter(_utils.isDefined);
    return driverErrorParts.length > 0 ? `${baseMessage} (${driverErrorParts.join(', ')})` : baseMessage;
};
const formatWorkspaceMigrationRunnerExecutionErrors = (errors)=>{
    const entries = EXECUTION_ERROR_LABELS.map((label)=>({
            label,
            error: errors[label]
        })).filter((entry)=>(0, _utils.isDefined)(entry.error));
    if (entries.length === 0) {
        return undefined;
    }
    // A 25P02 failure is collateral noise from the statement that aborted the
    // transaction; hide it whenever a root-cause error is available.
    const rootCauseEntries = entries.filter((entry)=>!isTransactionAbortedError(entry.error));
    const relevantEntries = rootCauseEntries.length > 0 ? rootCauseEntries : entries;
    const summary = relevantEntries.map((entry)=>`[${entry.label}] ${formatSingleExecutionError(entry.error)}`).join('; ');
    return summary.length <= MAX_EXECUTION_ERRORS_SUMMARY_LENGTH ? summary : `${summary.slice(0, MAX_EXECUTION_ERRORS_SUMMARY_LENGTH - TRUNCATION_MARKER.length)}${TRUNCATION_MARKER}`;
};

//# sourceMappingURL=format-workspace-migration-runner-execution-errors.util.js.map
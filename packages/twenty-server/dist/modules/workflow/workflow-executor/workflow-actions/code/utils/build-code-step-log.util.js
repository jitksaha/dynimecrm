"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildCodeStepLog", {
    enumerable: true,
    get: function() {
        return buildCodeStepLog;
    }
});
const _parseapplicationloglines = require("../../../../../../engine/core-modules/event-logs/producers/application-log/parse-application-log-lines");
const MAX_ENTRIES = 500;
const MAX_MESSAGE_LENGTH = 4_000;
const MAX_STACK_TRACE_LENGTH = 8_000;
const truncate = (value, max)=>value.length > max ? `${value.slice(0, max)}…[truncated]` : value;
const LEVEL_BY_INPUT = {
    DEBUG: 'debug',
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error'
};
const normalizeLevel = (rawLevel)=>LEVEL_BY_INPUT[rawLevel.toUpperCase()] ?? 'info';
const flattenStackTrace = (stackTrace)=>Array.isArray(stackTrace) ? stackTrace.join('\n') : stackTrace ?? '';
const buildCodeStepLog = (result)=>{
    const parsedLines = (0, _parseapplicationloglines.parseApplicationLogLines)(result.logs ?? '');
    const droppedEntries = Math.max(0, parsedLines.length - MAX_ENTRIES);
    const entries = parsedLines.slice(0, MAX_ENTRIES).map((line)=>({
            timestamp: line.timestamp.toISOString(),
            level: normalizeLevel(line.level),
            message: truncate(line.message, MAX_MESSAGE_LENGTH)
        }));
    const error = result.error ? {
        type: result.error.errorType,
        message: truncate(result.error.errorMessage, MAX_MESSAGE_LENGTH),
        stackTrace: truncate(flattenStackTrace(result.error.stackTrace), MAX_STACK_TRACE_LENGTH)
    } : null;
    return {
        details: {
            type: 'CODE',
            durationMs: result.duration,
            status: result.error ? 'ERROR' : 'SUCCESS',
            error
        },
        entries,
        truncated: droppedEntries > 0 ? {
            droppedEntries,
            droppedBytes: 0
        } : undefined,
        sizeBytes: 0
    };
};

//# sourceMappingURL=build-code-step-log.util.js.map
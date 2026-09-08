"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "mapAiStepsToToolCallLogs", {
    enumerable: true,
    get: function() {
        return mapAiStepsToToolCallLogs;
    }
});
const _truncatestringtoutf8bytebudgetutil = require("../../../../../utils/truncate-string-to-utf8-byte-budget.util");
const DEFAULT_MAX_TOOL_INPUT_BYTES = 32_000;
const DEFAULT_MAX_TOOL_OUTPUT_BYTES = 64_000;
const DEFAULT_MAX_TOOL_CALLS_PER_STEP = 200;
const MAX_ERROR_MESSAGE_LENGTH = 2_000;
const NOISY_RECORD_KEYS = new Set([
    'searchVector'
]);
const stripNoisyKeysDeep = (value)=>{
    if (Array.isArray(value)) {
        return value.map(stripNoisyKeysDeep);
    }
    if (value !== null && typeof value === 'object') {
        const sanitized = {};
        for (const [key, nested] of Object.entries(value)){
            if (NOISY_RECORD_KEYS.has(key)) {
                continue;
            }
            sanitized[key] = stripNoisyKeysDeep(nested);
        }
        return sanitized;
    }
    return value;
};
const truncateUnknownForLog = (value, maxBytes)=>{
    if (value === undefined || value === null) {
        return value;
    }
    if (typeof value === 'string') {
        const { value: truncatedValue, truncated } = (0, _truncatestringtoutf8bytebudgetutil.truncateStringToUtf8ByteBudget)(value, maxBytes);
        return truncated ? truncatedValue : value;
    }
    let serialized;
    try {
        serialized = JSON.stringify(value);
    } catch  {
        return _truncatestringtoutf8bytebudgetutil.TRUNCATION_SENTINEL;
    }
    const { value: truncatedValue, truncated } = (0, _truncatestringtoutf8bytebudgetutil.truncateStringToUtf8ByteBudget)(serialized, maxBytes);
    return truncated ? truncatedValue : value;
};
const mapAiStepsToToolCallLogs = (steps, options = {})=>{
    const maxToolInputBytes = options.maxToolInputBytes ?? DEFAULT_MAX_TOOL_INPUT_BYTES;
    const maxToolOutputBytes = options.maxToolOutputBytes ?? DEFAULT_MAX_TOOL_OUTPUT_BYTES;
    const maxToolCallsPerStep = options.maxToolCallsPerStep ?? DEFAULT_MAX_TOOL_CALLS_PER_STEP;
    const ordered = [];
    const openByCallId = new Map();
    for (const step of steps){
        if (ordered.length >= maxToolCallsPerStep) {
            break;
        }
        for (const part of step.content){
            if (ordered.length >= maxToolCallsPerStep) {
                break;
            }
            if (part.type === 'tool-call') {
                const entry = {
                    toolName: part.toolName,
                    toolCallId: part.toolCallId,
                    input: truncateUnknownForLog(part.input, maxToolInputBytes),
                    state: 'started',
                    providerExecuted: 'providerExecuted' in part && part.providerExecuted === true
                };
                openByCallId.set(part.toolCallId, entry);
                ordered.push(entry);
                continue;
            }
            if (part.type === 'tool-result') {
                const entry = openByCallId.get(part.toolCallId);
                if (entry) {
                    entry.output = truncateUnknownForLog(stripNoisyKeysDeep(part.output), maxToolOutputBytes);
                    entry.state = 'success';
                }
                continue;
            }
            if (part.type === 'tool-error') {
                const entry = openByCallId.get(part.toolCallId);
                if (entry) {
                    entry.errorMessage = String(part.error).slice(0, MAX_ERROR_MESSAGE_LENGTH);
                    entry.state = 'error';
                }
                continue;
            }
        }
    }
    return ordered;
};

//# sourceMappingURL=map-ai-steps-to-tool-call-logs.util.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "finalizeDanglingToolParts", {
    enumerable: true,
    get: function() {
        return finalizeDanglingToolParts;
    }
});
const _ai = require("ai");
const INTERRUPTED_TOOL_ERROR_TEXT = 'Tool execution was interrupted.';
const finalizeDanglingToolParts = (parts)=>{
    const seenToolCallIds = new Set();
    return parts.filter((part)=>!((0, _ai.isToolUIPart)(part) && part.state === 'input-streaming')).filter((part)=>{
        if (!(0, _ai.isToolUIPart)(part)) {
            return true;
        }
        if (seenToolCallIds.has(part.toolCallId)) {
            return false;
        }
        seenToolCallIds.add(part.toolCallId);
        return true;
    }).map((part)=>{
        if (!(0, _ai.isToolUIPart)(part)) {
            return part;
        }
        // Dangling call interrupted mid-flight: resolve it as an error.
        if (part.state === 'input-available') {
            return {
                ...part,
                state: 'output-error',
                input: part.input ?? {},
                errorText: INTERRUPTED_TOOL_ERROR_TEXT
            };
        }
        // Errored before its input was captured (e.g. failed input validation).
        if (part.state === 'output-error' && part.input == null) {
            return {
                ...part,
                input: {}
            };
        }
        return part;
    });
};

//# sourceMappingURL=finalize-dangling-tool-parts.util.js.map
// Shared budget for inlining a tool result. Above this, outputs are spilled to
// a file and navigated via the output
// navigation tools. ~16 KB is roughly 4k tokens (~4-5% of a 100k context window).
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MAX_INLINE_TOOL_OUTPUT_BYTES", {
    enumerable: true,
    get: function() {
        return MAX_INLINE_TOOL_OUTPUT_BYTES;
    }
});
const MAX_INLINE_TOOL_OUTPUT_BYTES = 16000;

//# sourceMappingURL=max-inline-tool-output-bytes.constant.js.map
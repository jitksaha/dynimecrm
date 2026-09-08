"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "findPendingQuestionPart", {
    enumerable: true,
    get: function() {
        return findPendingQuestionPart;
    }
});
const _ai = require("ai");
const _ai1 = require("twenty-shared/ai");
const findPendingQuestionPart = (parts)=>{
    for (const part of parts){
        if (!(0, _ai.isToolUIPart)(part) || (0, _ai.getToolName)(part) !== _ai1.ASK_QUESTIONS_TOOL_NAME) {
            continue;
        }
        const output = part.output;
        if (output?.result?.status === 'pending') {
            return part;
        }
    }
    return undefined;
};

//# sourceMappingURL=find-pending-question-part.util.js.map
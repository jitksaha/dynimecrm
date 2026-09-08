"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "sanitizePromptContextLineArray", {
    enumerable: true,
    get: function() {
        return sanitizePromptContextLineArray;
    }
});
const _guards = require("@sniptt/guards");
const _sanitizepromptcontextlineutil = require("./sanitize-prompt-context-line.util");
const sanitizePromptContextLineArray = ({ value, maxLength, maxItems })=>Array.isArray(value) ? value.map((item)=>(0, _sanitizepromptcontextlineutil.sanitizePromptContextLine)({
            value: item,
            maxLength
        })).filter(_guards.isNonEmptyString).slice(0, maxItems) : [];

//# sourceMappingURL=sanitize-prompt-context-line-array.util.js.map
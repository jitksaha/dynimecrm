"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "sanitizePromptContextLine", {
    enumerable: true,
    get: function() {
        return sanitizePromptContextLine;
    }
});
const _guards = require("@sniptt/guards");
// NUL bytes break Postgres text inserts, and line breaks in single-line fields could forge
// extra lines inside the model-facing context message built from these values.
const CONTROL_CHARACTERS_AND_LINE_BREAKS_PATTERN = /[\u0000-\u001f\u007f\u0080-\u009f]+/g;
const sanitizePromptContextLine = ({ value, maxLength })=>{
    if (!(0, _guards.isNonEmptyString)(value)) {
        return null;
    }
    const cleanedValue = value.replace(CONTROL_CHARACTERS_AND_LINE_BREAKS_PATTERN, ' ').replace(/\s+/g, ' ').trim();
    return (0, _guards.isNonEmptyString)(cleanedValue) ? cleanedValue.slice(0, maxLength) : null;
};

//# sourceMappingURL=sanitize-prompt-context-line.util.js.map
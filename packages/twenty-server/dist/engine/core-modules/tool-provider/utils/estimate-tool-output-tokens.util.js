"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "estimateToolOutputTokens", {
    enumerable: true,
    get: function() {
        return estimateToolOutputTokens;
    }
});
const _utils = require("twenty-shared/utils");
const CHARS_PER_TOKEN = 4;
const estimateToolOutputTokens = (output)=>{
    if (!(0, _utils.isDefined)(output)) {
        return 0;
    }
    let serialized;
    try {
        serialized = typeof output === 'string' ? output : JSON.stringify(output) ?? '';
    } catch  {
        return 0;
    }
    return Math.ceil(serialized.length / CHARS_PER_TOKEN);
};

//# sourceMappingURL=estimate-tool-output-tokens.util.js.map
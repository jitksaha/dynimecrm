"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "sanitizeGeminiToolResultRefsMiddleware", {
    enumerable: true,
    get: function() {
        return sanitizeGeminiToolResultRefsMiddleware;
    }
});
const _sanitizetoolresultrefsutil = require("../utils/sanitize-tool-result-refs.util");
const sanitizeGeminiToolResultRefsMiddleware = {
    specificationVersion: 'v3',
    transformParams: async ({ params })=>({
            ...params,
            prompt: (0, _sanitizetoolresultrefsutil.sanitizeToolResultRefs)(params.prompt)
        })
};

//# sourceMappingURL=sanitize-gemini-tool-result-refs.middleware.js.map
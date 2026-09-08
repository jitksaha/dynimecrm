"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "sanitizeRouteTriggerPath", {
    enumerable: true,
    get: function() {
        return sanitizeRouteTriggerPath;
    }
});
const sanitizeRouteTriggerPath = (requestPath)=>requestPath.replace(/^\/s\//, '/');

//# sourceMappingURL=sanitize-route-trigger-path.util.js.map
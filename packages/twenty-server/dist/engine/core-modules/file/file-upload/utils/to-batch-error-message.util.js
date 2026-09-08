"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "toBatchErrorMessage", {
    enumerable: true,
    get: function() {
        return toBatchErrorMessage;
    }
});
const toBatchErrorMessage = (error)=>error instanceof Error ? error.message : String(error);

//# sourceMappingURL=to-batch-error-message.util.js.map
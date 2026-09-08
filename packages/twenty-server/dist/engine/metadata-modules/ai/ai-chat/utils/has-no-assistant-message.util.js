"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "hasNoAssistantMessage", {
    enumerable: true,
    get: function() {
        return hasNoAssistantMessage;
    }
});
const hasNoAssistantMessage = (messages)=>messages.every((message)=>message.role !== 'assistant');

//# sourceMappingURL=has-no-assistant-message.util.js.map
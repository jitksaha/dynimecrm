"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "hasSucceededWorkspaceSetupCompletion", {
    enumerable: true,
    get: function() {
        return hasSucceededWorkspaceSetupCompletion;
    }
});
const _ai = require("twenty-shared/ai");
const hasSucceededWorkspaceSetupCompletion = (messages)=>messages.some((message)=>message.parts.some(_ai.isSucceededCompleteWorkspaceSetupToolPart));

//# sourceMappingURL=has-succeeded-workspace-setup-completion.util.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildWorkspaceSetupChatThreadId", {
    enumerable: true,
    get: function() {
        return buildWorkspaceSetupChatThreadId;
    }
});
const _uuid = require("uuid");
const _workspacesetupchatthreadidnamespaceconstant = require("../constants/workspace-setup-chat-thread-id-namespace.constant");
const buildWorkspaceSetupChatThreadId = ({ workspaceId, userWorkspaceId })=>(0, _uuid.v5)(`${workspaceId}:${userWorkspaceId}`, _workspacesetupchatthreadidnamespaceconstant.WORKSPACE_SETUP_CHAT_THREAD_ID_NAMESPACE);

//# sourceMappingURL=build-workspace-setup-chat-thread-id.util.js.map
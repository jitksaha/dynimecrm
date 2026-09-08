"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceSetupChatOutcome", {
    enumerable: true,
    get: function() {
        return WorkspaceSetupChatOutcome;
    }
});
const _graphql = require("@nestjs/graphql");
var WorkspaceSetupChatOutcome = /*#__PURE__*/ function(WorkspaceSetupChatOutcome) {
    WorkspaceSetupChatOutcome["STARTED"] = "STARTED";
    WorkspaceSetupChatOutcome["ALREADY_STARTED"] = "ALREADY_STARTED";
    WorkspaceSetupChatOutcome["UNAVAILABLE"] = "UNAVAILABLE";
    return WorkspaceSetupChatOutcome;
}({});
(0, _graphql.registerEnumType)(WorkspaceSetupChatOutcome, {
    name: 'WorkspaceSetupChatOutcome'
});

//# sourceMappingURL=workspace-setup-chat-outcome.enum.js.map
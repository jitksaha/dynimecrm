"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RunAgentMessageRole", {
    enumerable: true,
    get: function() {
        return RunAgentMessageRole;
    }
});
const _graphql = require("@nestjs/graphql");
var RunAgentMessageRole = /*#__PURE__*/ function(RunAgentMessageRole) {
    RunAgentMessageRole["user"] = "user";
    RunAgentMessageRole["assistant"] = "assistant";
    return RunAgentMessageRole;
}({});
(0, _graphql.registerEnumType)(RunAgentMessageRole, {
    name: 'RunAgentMessageRole'
});

//# sourceMappingURL=run-agent-message-role.enum.js.map
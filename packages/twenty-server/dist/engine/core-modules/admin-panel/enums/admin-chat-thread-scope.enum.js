"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AdminChatThreadScope", {
    enumerable: true,
    get: function() {
        return AdminChatThreadScope;
    }
});
const _graphql = require("@nestjs/graphql");
var AdminChatThreadScope = /*#__PURE__*/ function(AdminChatThreadScope) {
    AdminChatThreadScope["ONBOARDING"] = "ONBOARDING";
    AdminChatThreadScope["ALL"] = "ALL";
    return AdminChatThreadScope;
}({});
(0, _graphql.registerEnumType)(AdminChatThreadScope, {
    name: 'AdminChatThreadScope',
    description: 'Scope of chat threads to list in the admin panel'
});

//# sourceMappingURL=admin-chat-thread-scope.enum.js.map
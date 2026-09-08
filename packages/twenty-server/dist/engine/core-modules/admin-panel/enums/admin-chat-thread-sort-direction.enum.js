"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AdminChatThreadSortDirection", {
    enumerable: true,
    get: function() {
        return AdminChatThreadSortDirection;
    }
});
const _graphql = require("@nestjs/graphql");
var AdminChatThreadSortDirection = /*#__PURE__*/ function(AdminChatThreadSortDirection) {
    AdminChatThreadSortDirection["ASC"] = "ASC";
    AdminChatThreadSortDirection["DESC"] = "DESC";
    return AdminChatThreadSortDirection;
}({});
(0, _graphql.registerEnumType)(AdminChatThreadSortDirection, {
    name: 'AdminChatThreadSortDirection',
    description: 'Direction to sort admin chat threads'
});

//# sourceMappingURL=admin-chat-thread-sort-direction.enum.js.map
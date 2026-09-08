"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AdminChatThreadSortField", {
    enumerable: true,
    get: function() {
        return AdminChatThreadSortField;
    }
});
const _graphql = require("@nestjs/graphql");
var AdminChatThreadSortField = /*#__PURE__*/ function(AdminChatThreadSortField) {
    AdminChatThreadSortField["MESSAGE_COUNT"] = "MESSAGE_COUNT";
    AdminChatThreadSortField["REPLY_COUNT"] = "REPLY_COUNT";
    AdminChatThreadSortField["CREATED_AT"] = "CREATED_AT";
    AdminChatThreadSortField["UPDATED_AT"] = "UPDATED_AT";
    return AdminChatThreadSortField;
}({});
(0, _graphql.registerEnumType)(AdminChatThreadSortField, {
    name: 'AdminChatThreadSortField',
    description: 'Field to sort admin chat threads by'
});

//# sourceMappingURL=admin-chat-thread-sort-field.enum.js.map
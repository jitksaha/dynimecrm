"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "formatMessageFromHeader", {
    enumerable: true,
    get: function() {
        return formatMessageFromHeader;
    }
});
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _mimeencodeutil = require("../../message-import-manager/utils/mime-encode.util");
const formatMessageFromHeader = ({ fromEmail, fromName })=>{
    return (0, _utils.formatEmailAddress)({
        address: fromEmail,
        name: (0, _guards.isNonEmptyString)(fromName) ? (0, _mimeencodeutil.mimeEncode)(fromName) : undefined
    });
};

//# sourceMappingURL=format-message-from-header.util.js.map
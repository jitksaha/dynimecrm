"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveReceivedAt", {
    enumerable: true,
    get: function() {
        return resolveReceivedAt;
    }
});
const _isValidDate = require("../../../../../../utils/date/isValidDate");
const resolveReceivedAt = ({ headerDate, internalDate })=>{
    const receivedAtFromHeader = headerDate ? new Date(headerDate) : undefined;
    if ((0, _isValidDate.isValidDate)(receivedAtFromHeader)) {
        return receivedAtFromHeader;
    }
    const receivedAtFromImap = internalDate ? new Date(internalDate) : undefined;
    if ((0, _isValidDate.isValidDate)(receivedAtFromImap)) {
        return receivedAtFromImap;
    }
    return new Date();
};

//# sourceMappingURL=resolve-received-at.util.js.map
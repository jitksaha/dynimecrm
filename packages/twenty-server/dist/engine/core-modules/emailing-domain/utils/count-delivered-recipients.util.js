"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "countDeliveredRecipients", {
    enumerable: true,
    get: function() {
        return countDeliveredRecipients;
    }
});
const countDeliveredRecipients = ({ to, cc, bcc })=>to.length + cc.length + bcc.length;

//# sourceMappingURL=count-delivered-recipients.util.js.map
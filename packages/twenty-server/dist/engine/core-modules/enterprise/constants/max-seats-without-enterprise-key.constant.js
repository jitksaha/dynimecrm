/* @license Enterprise */ // Custom AI providers stay complimentary for small organizations: an instance
// is only asked for an enterprise key once it grows past this many distinct
// users, so self-hosters and small teams are never gated.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MAX_SEATS_WITHOUT_ENTERPRISE_KEY", {
    enumerable: true,
    get: function() {
        return MAX_SEATS_WITHOUT_ENTERPRISE_KEY;
    }
});
const MAX_SEATS_WITHOUT_ENTERPRISE_KEY = 25;

//# sourceMappingURL=max-seats-without-enterprise-key.constant.js.map
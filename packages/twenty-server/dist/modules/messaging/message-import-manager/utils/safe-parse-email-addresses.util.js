"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "safeParseEmailAddresses", {
    enumerable: true,
    get: function() {
        return safeParseEmailAddresses;
    }
});
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const safeParseEmailAddresses = (header)=>{
    return (0, _utils.parseEmailAddressList)(header).filter((parsedAddress)=>(0, _guards.isNonEmptyString)(parsedAddress.address));
};

//# sourceMappingURL=safe-parse-email-addresses.util.js.map
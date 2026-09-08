"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get UsageLimitException () {
        return UsageLimitException;
    },
    get UsageLimitExceptionCode () {
        return UsageLimitExceptionCode;
    }
});
const _utils = require("twenty-shared/utils");
const _customexception = require("../../../../utils/custom-exception");
var UsageLimitExceptionCode = /*#__PURE__*/ function(UsageLimitExceptionCode) {
    UsageLimitExceptionCode["RATE_LIMITED"] = "RATE_LIMITED";
    UsageLimitExceptionCode["QUOTA_EXHAUSTED"] = "QUOTA_EXHAUSTED";
    UsageLimitExceptionCode["LIMIT_RULE_INVALID"] = "LIMIT_RULE_INVALID";
    return UsageLimitExceptionCode;
}({});
const getUsageLimitExceptionUserFriendlyMessage = (code)=>{
    switch(code){
        case "RATE_LIMITED":
            return /*i18n*/ {
                id: "xD2MTL",
                message: "Rate limit reached. Please try again later."
            };
        case "QUOTA_EXHAUSTED":
            return /*i18n*/ {
                id: "tGvlMG",
                message: "Usage quota exhausted for this period."
            };
        case "LIMIT_RULE_INVALID":
            return /*i18n*/ {
                id: "AFqkCe",
                message: "This limit cannot be saved."
            };
        default:
            (0, _utils.assertUnreachable)(code);
    }
};
let UsageLimitException = class UsageLimitException extends _customexception.CustomException {
    constructor(message, code, { userFriendlyMessage, exhaustedScope } = {}){
        super(message, code, {
            userFriendlyMessage: userFriendlyMessage ?? getUsageLimitExceptionUserFriendlyMessage(code)
        });
        this.exhaustedScope = exhaustedScope;
    }
};

//# sourceMappingURL=usage-limit.exception.js.map
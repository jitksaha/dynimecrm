/* @license Enterprise */ "use strict";
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
    get EnterpriseException () {
        return EnterpriseException;
    },
    get EnterpriseExceptionCode () {
        return EnterpriseExceptionCode;
    }
});
const _utils = require("twenty-shared/utils");
const _maxseatswithoutenterprisekeyconstant = require("./constants/max-seats-without-enterprise-key.constant");
const _customexception = require("../../../utils/custom-exception");
var EnterpriseExceptionCode = /*#__PURE__*/ function(EnterpriseExceptionCode) {
    EnterpriseExceptionCode["INVALID_ENTERPRISE_KEY"] = "INVALID_ENTERPRISE_KEY";
    EnterpriseExceptionCode["CONFIG_VARIABLES_IN_DB_DISABLED"] = "CONFIG_VARIABLES_IN_DB_DISABLED";
    EnterpriseExceptionCode["ENTERPRISE_KEY_BOUND_TO_ANOTHER_SERVER"] = "ENTERPRISE_KEY_BOUND_TO_ANOTHER_SERVER";
    EnterpriseExceptionCode["ENTERPRISE_MISSING_SERVER_ID"] = "ENTERPRISE_MISSING_SERVER_ID";
    EnterpriseExceptionCode["ENTERPRISE_DEV_REQUIRES_ACTIVE_PRODUCTION"] = "ENTERPRISE_DEV_REQUIRES_ACTIVE_PRODUCTION";
    EnterpriseExceptionCode["ENTERPRISE_DEV_SLOT_IN_USE"] = "ENTERPRISE_DEV_SLOT_IN_USE";
    EnterpriseExceptionCode["ENTERPRISE_RELEASE_RATE_LIMITED"] = "ENTERPRISE_RELEASE_RATE_LIMITED";
    EnterpriseExceptionCode["ENTERPRISE_VALIDITY_TOKEN_RATE_LIMITED"] = "ENTERPRISE_VALIDITY_TOKEN_RATE_LIMITED";
    EnterpriseExceptionCode["ENTERPRISE_SEAT_THRESHOLD_EXCEEDED"] = "ENTERPRISE_SEAT_THRESHOLD_EXCEEDED";
    return EnterpriseExceptionCode;
}({});
const getEnterpriseExceptionUserFriendlyMessage = (code)=>{
    switch(code){
        case "INVALID_ENTERPRISE_KEY":
            return /*i18n*/ {
                id: "pOHI+b",
                message: "Invalid enterprise key."
            };
        case "CONFIG_VARIABLES_IN_DB_DISABLED":
            return /*i18n*/ {
                id: "1bOGPq",
                message: "IS_CONFIG_VARIABLES_IN_DB_ENABLED is false on your server. Please add ENTERPRISE_KEY to your .env file manually."
            };
        case "ENTERPRISE_KEY_BOUND_TO_ANOTHER_SERVER":
            return /*i18n*/ {
                id: "i4wotH",
                message: "This enterprise key is already in use on another server instance. Release it from that server, or transfer it to this one."
            };
        case "ENTERPRISE_MISSING_SERVER_ID":
            return /*i18n*/ {
                id: "AGMd5o",
                message: "This instance did not report a server identifier. Set SERVER_ID on this instance, then try again."
            };
        case "ENTERPRISE_DEV_REQUIRES_ACTIVE_PRODUCTION":
            return /*i18n*/ {
                id: "cWaEaJ",
                message: "A free development instance requires an active production instance on this enterprise subscription."
            };
        case "ENTERPRISE_DEV_SLOT_IN_USE":
            return /*i18n*/ {
                id: "hmg/aY",
                message: "The development instance slot for this enterprise key is already in use on another server."
            };
        case "ENTERPRISE_RELEASE_RATE_LIMITED":
            return /*i18n*/ {
                id: "475gCs",
                message: "You have reached the maximum number of server transfers allowed in the last 30 days for this enterprise key. Please try again later."
            };
        case "ENTERPRISE_VALIDITY_TOKEN_RATE_LIMITED":
            return /*i18n*/ {
                id: "4kMeNM",
                message: "You have reached the maximum number of license refreshes allowed today for this enterprise key. Please try again later."
            };
        case "ENTERPRISE_SEAT_THRESHOLD_EXCEEDED":
            return /*i18n*/ {
                id: "uNp8ZA",
                message: "This feature is complimentary up to {MAX_SEATS_WITHOUT_ENTERPRISE_KEY} seats. Your instance is above that, so an enterprise key is required.",
                values: {
                    MAX_SEATS_WITHOUT_ENTERPRISE_KEY: _maxseatswithoutenterprisekeyconstant.MAX_SEATS_WITHOUT_ENTERPRISE_KEY
                }
            };
        default:
            (0, _utils.assertUnreachable)(code);
    }
};
let EnterpriseException = class EnterpriseException extends _customexception.CustomException {
    constructor(message, code, { userFriendlyMessage } = {}){
        super(message, code, {
            userFriendlyMessage: userFriendlyMessage ?? getEnterpriseExceptionUserFriendlyMessage(code)
        });
    }
};

//# sourceMappingURL=enterprise.exception.js.map
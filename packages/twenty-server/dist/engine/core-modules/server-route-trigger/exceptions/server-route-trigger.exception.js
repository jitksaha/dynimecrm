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
    get ServerRouteTriggerException () {
        return ServerRouteTriggerException;
    },
    get ServerRouteTriggerExceptionCode () {
        return ServerRouteTriggerExceptionCode;
    }
});
const _utils = require("twenty-shared/utils");
const _customexception = require("../../../../utils/custom-exception");
var ServerRouteTriggerExceptionCode = /*#__PURE__*/ function(ServerRouteTriggerExceptionCode) {
    ServerRouteTriggerExceptionCode["LOGIC_FUNCTION_NOT_FOUND"] = "LOGIC_FUNCTION_NOT_FOUND";
    ServerRouteTriggerExceptionCode["LOGIC_FUNCTION_DISABLED"] = "LOGIC_FUNCTION_DISABLED";
    ServerRouteTriggerExceptionCode["RATE_LIMIT_EXCEEDED"] = "RATE_LIMIT_EXCEEDED";
    ServerRouteTriggerExceptionCode["SERVER_ROUTE_USER_UNCAUGHT_ERROR"] = "SERVER_ROUTE_USER_UNCAUGHT_ERROR";
    ServerRouteTriggerExceptionCode["SERVER_ROUTE_PLATFORM_ERROR"] = "SERVER_ROUTE_PLATFORM_ERROR";
    ServerRouteTriggerExceptionCode["RESOLVER_INVALID_RESULT"] = "RESOLVER_INVALID_RESULT";
    ServerRouteTriggerExceptionCode["RESOLVER_REQUIRES_AUTHENTICATION"] = "RESOLVER_REQUIRES_AUTHENTICATION";
    ServerRouteTriggerExceptionCode["METHOD_NOT_ALLOWED"] = "METHOD_NOT_ALLOWED";
    return ServerRouteTriggerExceptionCode;
}({});
const getServerRouteTriggerExceptionUserFriendlyMessage = (code)=>{
    switch(code){
        case "LOGIC_FUNCTION_NOT_FOUND":
            return /*i18n*/ {
                id: "Q8FQ55",
                message: "Server logic function not found."
            };
        case "LOGIC_FUNCTION_DISABLED":
            return /*i18n*/ {
                id: "bypqPt",
                message: "This action is currently unavailable."
            };
        case "RATE_LIMIT_EXCEEDED":
            return /*i18n*/ {
                id: "V8OqY4",
                message: "Rate limit exceeded."
            };
        case "SERVER_ROUTE_USER_UNCAUGHT_ERROR":
            return /*i18n*/ {
                id: "mZvaAV",
                message: "Logic function execution failed."
            };
        case "SERVER_ROUTE_PLATFORM_ERROR":
            return /*i18n*/ {
                id: "zoIkfT",
                message: "An unexpected error occurred while handling the server route."
            };
        case "RESOLVER_INVALID_RESULT":
            return /*i18n*/ {
                id: "MU8Slt",
                message: "Resolver logic function returned an invalid result."
            };
        case "RESOLVER_REQUIRES_AUTHENTICATION":
            return /*i18n*/ {
                id: "a1zyh7",
                message: "Server logic function requires authentication."
            };
        case "METHOD_NOT_ALLOWED":
            return /*i18n*/ {
                id: "bHna44",
                message: "This HTTP method is not allowed on this server route."
            };
        default:
            (0, _utils.assertUnreachable)(code);
    }
};
let ServerRouteTriggerException = class ServerRouteTriggerException extends _customexception.CustomException {
    constructor(message, code, { userFriendlyMessage } = {}){
        super(message, code, {
            userFriendlyMessage: userFriendlyMessage ?? getServerRouteTriggerExceptionUserFriendlyMessage(code)
        });
    }
};

//# sourceMappingURL=server-route-trigger.exception.js.map
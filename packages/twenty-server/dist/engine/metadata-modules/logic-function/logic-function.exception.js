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
    get LogicFunctionException () {
        return LogicFunctionException;
    },
    get LogicFunctionExceptionCode () {
        return LogicFunctionExceptionCode;
    }
});
const _utils = require("twenty-shared/utils");
const _customexception = require("../../../utils/custom-exception");
var LogicFunctionExceptionCode = /*#__PURE__*/ function(LogicFunctionExceptionCode) {
    LogicFunctionExceptionCode["LOGIC_FUNCTION_NOT_FOUND"] = "LOGIC_FUNCTION_NOT_FOUND";
    LogicFunctionExceptionCode["LOGIC_FUNCTION_ALREADY_EXIST"] = "LOGIC_FUNCTION_ALREADY_EXIST";
    LogicFunctionExceptionCode["LOGIC_FUNCTION_NOT_READY"] = "LOGIC_FUNCTION_NOT_READY";
    LogicFunctionExceptionCode["LOGIC_FUNCTION_BUILDING"] = "LOGIC_FUNCTION_BUILDING";
    LogicFunctionExceptionCode["LOGIC_FUNCTION_CODE_UNCHANGED"] = "LOGIC_FUNCTION_CODE_UNCHANGED";
    LogicFunctionExceptionCode["LOGIC_FUNCTION_EXECUTION_LIMIT_REACHED"] = "LOGIC_FUNCTION_EXECUTION_LIMIT_REACHED";
    LogicFunctionExceptionCode["LOGIC_FUNCTION_CREATE_FAILED"] = "LOGIC_FUNCTION_CREATE_FAILED";
    LogicFunctionExceptionCode["LOGIC_FUNCTION_COMPILATION_FAILED"] = "LOGIC_FUNCTION_COMPILATION_FAILED";
    LogicFunctionExceptionCode["LOGIC_FUNCTION_EXECUTION_TIMEOUT"] = "LOGIC_FUNCTION_EXECUTION_TIMEOUT";
    LogicFunctionExceptionCode["LOGIC_FUNCTION_PLATFORM_EXECUTION_ERROR"] = "LOGIC_FUNCTION_PLATFORM_EXECUTION_ERROR";
    LogicFunctionExceptionCode["LOGIC_FUNCTION_LAYER_BUILD_FAILED"] = "LOGIC_FUNCTION_LAYER_BUILD_FAILED";
    LogicFunctionExceptionCode["LOGIC_FUNCTION_DEPENDENCIES_SIZE_EXCEEDED"] = "LOGIC_FUNCTION_DEPENDENCIES_SIZE_EXCEEDED";
    LogicFunctionExceptionCode["LOGIC_FUNCTION_DISABLED"] = "LOGIC_FUNCTION_DISABLED";
    LogicFunctionExceptionCode["LOGIC_FUNCTION_INVALID_SEED_PROJECT"] = "LOGIC_FUNCTION_INVALID_SEED_PROJECT";
    LogicFunctionExceptionCode["INVALID_LOGIC_FUNCTION_INPUT"] = "INVALID_LOGIC_FUNCTION_INPUT";
    LogicFunctionExceptionCode["LOGIC_FUNCTION_PREBUILT_BUNDLE_NOT_INSTALLED"] = "LOGIC_FUNCTION_PREBUILT_BUNDLE_NOT_INSTALLED";
    return LogicFunctionExceptionCode;
}({});
const getLogicFunctionExceptionUserFriendlyMessage = (code)=>{
    switch(code){
        case "LOGIC_FUNCTION_NOT_FOUND":
            return /*i18n*/ {
                id: "2ACKTg",
                message: "Function not found."
            };
        case "LOGIC_FUNCTION_ALREADY_EXIST":
            return /*i18n*/ {
                id: "+aAI33",
                message: "A function with this name already exists."
            };
        case "LOGIC_FUNCTION_NOT_READY":
            return /*i18n*/ {
                id: "GhVI/u",
                message: "Function is not ready."
            };
        case "LOGIC_FUNCTION_BUILDING":
            return /*i18n*/ {
                id: "IsdR/t",
                message: "Function is currently building."
            };
        case "LOGIC_FUNCTION_CODE_UNCHANGED":
            return /*i18n*/ {
                id: "pouguB",
                message: "Function code is unchanged."
            };
        case "LOGIC_FUNCTION_EXECUTION_LIMIT_REACHED":
            return /*i18n*/ {
                id: "Ho3UAo",
                message: "Function execution limit reached."
            };
        case "LOGIC_FUNCTION_CREATE_FAILED":
            return /*i18n*/ {
                id: "M1ZSSL",
                message: "Failed to create function."
            };
        case "LOGIC_FUNCTION_COMPILATION_FAILED":
            return /*i18n*/ {
                id: "yQDBsf",
                message: "Function code failed to compile."
            };
        case "LOGIC_FUNCTION_EXECUTION_TIMEOUT":
            return /*i18n*/ {
                id: "mdxF/u",
                message: "Function execution timed out."
            };
        case "LOGIC_FUNCTION_PLATFORM_EXECUTION_ERROR":
            return /*i18n*/ {
                id: "rqDhd1",
                message: "Function execution failed."
            };
        case "LOGIC_FUNCTION_LAYER_BUILD_FAILED":
            return /*i18n*/ {
                id: "rl11Jd",
                message: "Failed to build function dependencies."
            };
        case "LOGIC_FUNCTION_DEPENDENCIES_SIZE_EXCEEDED":
            return /*i18n*/ {
                id: "Lmx0IG",
                message: 'Your application\'s production dependencies are too large to install. Move packages that are not imported by your logic functions (UI libraries, dev tooling) out of "dependencies".'
            };
        case "LOGIC_FUNCTION_DISABLED":
            return /*i18n*/ {
                id: "6fc1FV",
                message: "Logic function execution is disabled."
            };
        case "LOGIC_FUNCTION_INVALID_SEED_PROJECT":
            return /*i18n*/ {
                id: "xzNMzS",
                message: "Invalid seed project configuration."
            };
        case "INVALID_LOGIC_FUNCTION_INPUT":
            return /*i18n*/ {
                id: "7SBmhB",
                message: "Invalid logic function input."
            };
        case "LOGIC_FUNCTION_PREBUILT_BUNDLE_NOT_INSTALLED":
            return /*i18n*/ {
                id: "YzUxdC",
                message: "Prebuilt bundle is not installed on the function. Rebuild and try again."
            };
        default:
            (0, _utils.assertUnreachable)(code);
    }
};
let LogicFunctionException = class LogicFunctionException extends _customexception.CustomException {
    constructor(message, code, { userFriendlyMessage } = {}){
        super(message, code, {
            userFriendlyMessage: userFriendlyMessage ?? getLogicFunctionExceptionUserFriendlyMessage(code)
        });
    }
};

//# sourceMappingURL=logic-function.exception.js.map
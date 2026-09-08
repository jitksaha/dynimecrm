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
    get CacheStorageException () {
        return CacheStorageException;
    },
    get CacheStorageExceptionCode () {
        return CacheStorageExceptionCode;
    }
});
const _utils = require("twenty-shared/utils");
const _customexception = require("../../../../utils/custom-exception");
var CacheStorageExceptionCode = /*#__PURE__*/ function(CacheStorageExceptionCode) {
    CacheStorageExceptionCode["SCRIPT_EXECUTION_FAILED"] = "SCRIPT_EXECUTION_FAILED";
    CacheStorageExceptionCode["REDIS_CACHE_REQUIRED"] = "REDIS_CACHE_REQUIRED";
    return CacheStorageExceptionCode;
}({});
const getCacheStorageExceptionUserFriendlyMessage = (code)=>{
    switch(code){
        case "SCRIPT_EXECUTION_FAILED":
        case "REDIS_CACHE_REQUIRED":
            return /*i18n*/ {
                id: "W5A0Ly",
                message: "An unexpected error occurred."
            };
        default:
            (0, _utils.assertUnreachable)(code);
    }
};
let CacheStorageException = class CacheStorageException extends _customexception.CustomException {
    constructor(message, code, { userFriendlyMessage } = {}){
        super(message, code, {
            userFriendlyMessage: userFriendlyMessage ?? getCacheStorageExceptionUserFriendlyMessage(code)
        });
    }
};

//# sourceMappingURL=cache-storage.exception.js.map
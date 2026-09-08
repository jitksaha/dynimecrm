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
    get CacheLockException () {
        return CacheLockException;
    },
    get CacheLockExceptionCode () {
        return CacheLockExceptionCode;
    }
});
const _customexception = require("../../../../utils/custom-exception");
let CacheLockException = class CacheLockException extends _customexception.CustomException {
    constructor(message, code, { userFriendlyMessage } = {}){
        super(message, code, {
            userFriendlyMessage: userFriendlyMessage ?? /*i18n*/ {
                id: "o0VLtQ",
                message: "A cache lock error occurred."
            }
        });
    }
};
const CacheLockExceptionCode = (0, _customexception.appendCommonExceptionCode)({
    LOCK_ACQUISITION_TIMEOUT: 'LOCK_ACQUISITION_TIMEOUT'
});

//# sourceMappingURL=cache-lock.exception.js.map
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
    get EmailGroupAccessException () {
        return EmailGroupAccessException;
    },
    get EmailGroupAccessExceptionCode () {
        return EmailGroupAccessExceptionCode;
    }
});
const _customexception = require("../../../../utils/custom-exception");
const EmailGroupAccessExceptionCode = (0, _customexception.appendCommonExceptionCode)({
    EMAIL_GROUP_ENTERPRISE_PLAN_REQUIRED: 'EMAIL_GROUP_ENTERPRISE_PLAN_REQUIRED'
});
const emailGroupAccessExceptionUserFriendlyMessages = {
    EMAIL_GROUP_ENTERPRISE_PLAN_REQUIRED: /*i18n*/ {
        id: "hog3m7",
        message: "Email group requires an Enterprise plan."
    },
    INTERNAL_SERVER_ERROR: /*i18n*/ {
        id: "W5A0Ly",
        message: "An unexpected error occurred."
    }
};
let EmailGroupAccessException = class EmailGroupAccessException extends _customexception.CustomException {
    constructor(message, code, { userFriendlyMessage } = {}){
        super(message, code, {
            userFriendlyMessage: userFriendlyMessage ?? emailGroupAccessExceptionUserFriendlyMessages[code]
        });
    }
};

//# sourceMappingURL=email-group-access.exception.js.map
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
    get VERSION_PROGRESSION_REASON_TO_DEPLOY_EXCEPTION_CODE () {
        return VERSION_PROGRESSION_REASON_TO_DEPLOY_EXCEPTION_CODE;
    },
    get VERSION_PROGRESSION_REASON_TO_INSTALL_EXCEPTION_CODE () {
        return VERSION_PROGRESSION_REASON_TO_INSTALL_EXCEPTION_CODE;
    },
    get VERSION_REASON_TO_APPLICATION_EXCEPTION_CODE () {
        return VERSION_REASON_TO_APPLICATION_EXCEPTION_CODE;
    },
    get VERSION_REASON_TO_APPLICATION_REGISTRATION_EXCEPTION_CODE () {
        return VERSION_REASON_TO_APPLICATION_REGISTRATION_EXCEPTION_CODE;
    }
});
const _applicationregistrationexception = require("../../application-registration/application-registration.exception");
const _applicationexception = require("../../application.exception");
const VERSION_REASON_TO_APPLICATION_EXCEPTION_CODE = {
    INVALID_REQUIRED_VERSION: _applicationexception.ApplicationExceptionCode.INVALID_APP_ENGINE_REQUIREMENT,
    INVALID_SERVER_VERSION: _applicationexception.ApplicationExceptionCode.INVALID_SERVER_VERSION,
    INVALID_WORKSPACE_VERSION: _applicationexception.ApplicationExceptionCode.INVALID_WORKSPACE_VERSION,
    INSTANCE_INCOMPATIBLE: _applicationexception.ApplicationExceptionCode.SERVER_VERSION_INCOMPATIBLE,
    WORKSPACE_INCOMPATIBLE: _applicationexception.ApplicationExceptionCode.WORKSPACE_VERSION_INCOMPATIBLE
};
const VERSION_REASON_TO_APPLICATION_REGISTRATION_EXCEPTION_CODE = {
    INVALID_REQUIRED_VERSION: _applicationregistrationexception.ApplicationRegistrationExceptionCode.INVALID_APP_ENGINE_REQUIREMENT,
    INVALID_SERVER_VERSION: _applicationregistrationexception.ApplicationRegistrationExceptionCode.INVALID_SERVER_VERSION,
    INVALID_WORKSPACE_VERSION: _applicationregistrationexception.ApplicationRegistrationExceptionCode.INVALID_SERVER_VERSION,
    INSTANCE_INCOMPATIBLE: _applicationregistrationexception.ApplicationRegistrationExceptionCode.SERVER_VERSION_INCOMPATIBLE,
    WORKSPACE_INCOMPATIBLE: _applicationregistrationexception.ApplicationRegistrationExceptionCode.SERVER_VERSION_INCOMPATIBLE
};
const VERSION_PROGRESSION_REASON_TO_INSTALL_EXCEPTION_CODE = {
    INVALID_INCOMING_VERSION: _applicationexception.ApplicationExceptionCode.INVALID_INPUT,
    SAME_VERSION: _applicationexception.ApplicationExceptionCode.APP_ALREADY_INSTALLED,
    DOWNGRADE: _applicationexception.ApplicationExceptionCode.CANNOT_DOWNGRADE_APPLICATION
};
const VERSION_PROGRESSION_REASON_TO_DEPLOY_EXCEPTION_CODE = {
    INVALID_INCOMING_VERSION: _applicationregistrationexception.ApplicationRegistrationExceptionCode.INVALID_INPUT,
    SAME_VERSION: _applicationregistrationexception.ApplicationRegistrationExceptionCode.VERSION_ALREADY_EXISTS,
    DOWNGRADE: _applicationregistrationexception.ApplicationRegistrationExceptionCode.VERSION_ALREADY_EXISTS
};

//# sourceMappingURL=version-reason-to-exception-code.constant.js.map
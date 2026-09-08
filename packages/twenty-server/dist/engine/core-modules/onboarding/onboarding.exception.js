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
    get OnboardingException () {
        return OnboardingException;
    },
    get OnboardingExceptionCode () {
        return OnboardingExceptionCode;
    }
});
const _utils = require("twenty-shared/utils");
const _customexception = require("../../../utils/custom-exception");
var OnboardingExceptionCode = /*#__PURE__*/ function(OnboardingExceptionCode) {
    OnboardingExceptionCode["NO_PREVIOUS_ONBOARDING_STEP"] = "NO_PREVIOUS_ONBOARDING_STEP";
    OnboardingExceptionCode["MISSING_TRANSACTION_QUERY_RUNNER"] = "MISSING_TRANSACTION_QUERY_RUNNER";
    OnboardingExceptionCode["INSTALL_APPS_JOB_ENQUEUE_FAILED"] = "INSTALL_APPS_JOB_ENQUEUE_FAILED";
    return OnboardingExceptionCode;
}({});
const getOnboardingExceptionUserFriendlyMessage = (code)=>{
    switch(code){
        case "NO_PREVIOUS_ONBOARDING_STEP":
            return /*i18n*/ {
                id: "jMDu2a",
                message: "There is no previous onboarding step to go back to."
            };
        case "MISSING_TRANSACTION_QUERY_RUNNER":
            return /*i18n*/ {
                id: "eAMUPx",
                message: "Something went wrong while saving your onboarding progress."
            };
        case "INSTALL_APPS_JOB_ENQUEUE_FAILED":
            return /*i18n*/ {
                id: "RjTo7h",
                message: "Something went wrong while starting the app installation. Please try again."
            };
        default:
            (0, _utils.assertUnreachable)(code);
    }
};
let OnboardingException = class OnboardingException extends _customexception.CustomException {
    constructor(message, code, { userFriendlyMessage } = {}){
        super(message, code, {
            userFriendlyMessage: userFriendlyMessage ?? getOnboardingExceptionUserFriendlyMessage(code)
        });
    }
};

//# sourceMappingURL=onboarding.exception.js.map
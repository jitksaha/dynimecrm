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
    get ConnectedAccountSyncWebhookException () {
        return ConnectedAccountSyncWebhookException;
    },
    get ConnectedAccountSyncWebhookExceptionCode () {
        return ConnectedAccountSyncWebhookExceptionCode;
    }
});
const _utils = require("twenty-shared/utils");
const _customexception = require("../../utils/custom-exception");
var ConnectedAccountSyncWebhookExceptionCode = /*#__PURE__*/ function(ConnectedAccountSyncWebhookExceptionCode) {
    ConnectedAccountSyncWebhookExceptionCode["MISSING_REQUEST_BODY"] = "MISSING_REQUEST_BODY";
    ConnectedAccountSyncWebhookExceptionCode["INVALID_PAYLOAD"] = "INVALID_PAYLOAD";
    ConnectedAccountSyncWebhookExceptionCode["INVALID_SIGNATURE"] = "INVALID_SIGNATURE";
    return ConnectedAccountSyncWebhookExceptionCode;
}({});
const getConnectedAccountSyncWebhookExceptionUserFriendlyMessage = (code)=>{
    switch(code){
        case "MISSING_REQUEST_BODY":
        case "INVALID_PAYLOAD":
            return /*i18n*/ {
                id: "3nHyuH",
                message: "The webhook request could not be processed."
            };
        case "INVALID_SIGNATURE":
            return /*i18n*/ {
                id: "9bYo5E",
                message: "The webhook request could not be authenticated."
            };
        default:
            (0, _utils.assertUnreachable)(code);
    }
};
let ConnectedAccountSyncWebhookException = class ConnectedAccountSyncWebhookException extends _customexception.CustomException {
    constructor(message, code, { userFriendlyMessage } = {}){
        super(message, code, {
            userFriendlyMessage: userFriendlyMessage ?? getConnectedAccountSyncWebhookExceptionUserFriendlyMessage(code)
        });
    }
};

//# sourceMappingURL=connected-account-sync-webhook.exception.js.map
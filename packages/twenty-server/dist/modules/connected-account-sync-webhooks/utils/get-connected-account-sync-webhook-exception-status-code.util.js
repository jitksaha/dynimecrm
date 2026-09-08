"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getConnectedAccountSyncWebhookExceptionStatusCode", {
    enumerable: true,
    get: function() {
        return getConnectedAccountSyncWebhookExceptionStatusCode;
    }
});
const _utils = require("twenty-shared/utils");
const _connectedaccountsyncwebhookexception = require("../connected-account-sync-webhook.exception");
const getConnectedAccountSyncWebhookExceptionStatusCode = (exception)=>{
    switch(exception.code){
        case _connectedaccountsyncwebhookexception.ConnectedAccountSyncWebhookExceptionCode.MISSING_REQUEST_BODY:
        case _connectedaccountsyncwebhookexception.ConnectedAccountSyncWebhookExceptionCode.INVALID_PAYLOAD:
            return 400;
        case _connectedaccountsyncwebhookexception.ConnectedAccountSyncWebhookExceptionCode.INVALID_SIGNATURE:
            return 403;
        default:
            {
                return (0, _utils.assertUnreachable)(exception.code);
            }
    }
};

//# sourceMappingURL=get-connected-account-sync-webhook-exception-status-code.util.js.map
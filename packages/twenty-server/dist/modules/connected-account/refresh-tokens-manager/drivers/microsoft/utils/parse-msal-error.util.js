"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseMsalError", {
    enumerable: true,
    get: function() {
        return parseMsalError;
    }
});
const _msalnode = require("@azure/msal-node");
const _connectedaccountrefreshtokensexception = require("../../../../../../engine/metadata-modules/connected-account/exceptions/connected-account-refresh-tokens.exception");
const _microsoftpermanentautherrorcodesconstant = require("../constants/microsoft-permanent-auth-error-codes.constant");
const parseMsalError = (error)=>{
    if (error instanceof _msalnode.InteractionRequiredAuthError) {
        return new _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenException(`Microsoft token refresh requires re-authentication: ${error.errorCode}`, _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenExceptionCode.INVALID_REFRESH_TOKEN);
    }
    if (error instanceof _msalnode.AuthError && _microsoftpermanentautherrorcodesconstant.MICROSOFT_PERMANENT_AUTH_ERROR_CODES.has(error.errorCode)) {
        return new _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenException(`Microsoft auth error: ${error.errorCode} - ${error.errorMessage}`, _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenExceptionCode.INVALID_REFRESH_TOKEN);
    }
    const message = error instanceof Error ? error.message : String(error);
    return new _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenException(`Microsoft token refresh failed: ${message}`, _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenExceptionCode.TEMPORARY_NETWORK_ERROR);
};

//# sourceMappingURL=parse-msal-error.util.js.map
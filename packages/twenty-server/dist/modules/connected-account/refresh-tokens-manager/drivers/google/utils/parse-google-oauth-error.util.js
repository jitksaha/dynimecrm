"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseGoogleOAuthError", {
    enumerable: true,
    get: function() {
        return parseGoogleOAuthError;
    }
});
const _connectedaccountrefreshtokensexception = require("../../../../../../engine/metadata-modules/connected-account/exceptions/connected-account-refresh-tokens.exception");
const _googlepermanentoautherrorcodesconstant = require("../constants/google-permanent-oauth-error-codes.constant");
const _isgmailnetworkerrorutil = require("../../../../../messaging/message-import-manager/drivers/gmail/utils/is-gmail-network-error.util");
const parseGoogleOAuthError = (error)=>{
    if ((0, _isgmailnetworkerrorutil.isGmailNetworkError)(error)) {
        return new _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenException(`Google refresh token network error: ${error.code} - ${error.message}`, _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenExceptionCode.TEMPORARY_NETWORK_ERROR);
    }
    const gaxiosError = error;
    const googleOAuthError = {
        code: gaxiosError.response?.status,
        reason: gaxiosError.response?.data?.error || 'Unknown reason',
        message: gaxiosError.response?.data?.error_description || gaxiosError.message || 'Unknown error'
    };
    if (_googlepermanentoautherrorcodesconstant.GOOGLE_PERMANENT_OAUTH_ERROR_CODES.has(googleOAuthError.reason)) {
        return new _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenException(`Google auth error: ${googleOAuthError.reason} - ${googleOAuthError.message}`, _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenExceptionCode.INVALID_REFRESH_TOKEN);
    }
    return new _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenException(`Google refresh token failed (${googleOAuthError.code ?? 'no status'}): ${googleOAuthError.reason} - ${googleOAuthError.message}`, _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenExceptionCode.TEMPORARY_NETWORK_ERROR);
};

//# sourceMappingURL=parse-google-oauth-error.util.js.map
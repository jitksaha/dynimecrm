"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseGoogleWebhookSubscriptionError", {
    enumerable: true,
    get: function() {
        return parseGoogleWebhookSubscriptionError;
    }
});
const _utils = require("twenty-shared/utils");
const _webhooksubscriptiondriverexception = require("../../exceptions/webhook-subscription-driver.exception");
const parseGoogleWebhookSubscriptionError = (error, options)=>{
    if (!(0, _utils.isDefined)(error.response)) {
        return new _webhooksubscriptiondriverexception.WebhookSubscriptionDriverException(`Google API transport error: ${error.message}`, _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.TEMPORARY_ERROR, options);
    }
    const googleApiError = {
        code: error.response?.status,
        reason: error.response?.data?.error?.errors?.[0].reason || error.response?.data?.error || 'Unknown reason',
        message: error.response?.data?.error?.errors?.[0].message || error.response?.data?.error_description || 'Unknown error'
    };
    switch(googleApiError.code){
        case 400:
            if (googleApiError.reason === 'invalid_grant') {
                return new _webhooksubscriptiondriverexception.WebhookSubscriptionDriverException(googleApiError.message, _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.INSUFFICIENT_PERMISSIONS, options);
            }
            if (googleApiError.reason === 'failedPrecondition') {
                return new _webhooksubscriptiondriverexception.WebhookSubscriptionDriverException(googleApiError.message, googleApiError.message.includes('Mail service not enabled') ? _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.INSUFFICIENT_PERMISSIONS : _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.TEMPORARY_ERROR, options);
            }
            return new _webhooksubscriptiondriverexception.WebhookSubscriptionDriverException(googleApiError.message, _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.UNKNOWN, options);
        case 401:
            return new _webhooksubscriptiondriverexception.WebhookSubscriptionDriverException(googleApiError.message, _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.INSUFFICIENT_PERMISSIONS, options);
        case 403:
            if (googleApiError.reason === 'rateLimitExceeded' || googleApiError.reason === 'userRateLimitExceeded' || googleApiError.reason === 'dailyLimitExceeded') {
                return new _webhooksubscriptiondriverexception.WebhookSubscriptionDriverException(googleApiError.message, _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.TEMPORARY_ERROR, options);
            }
            return new _webhooksubscriptiondriverexception.WebhookSubscriptionDriverException(googleApiError.message, _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.INSUFFICIENT_PERMISSIONS, options);
        case 404:
            return new _webhooksubscriptiondriverexception.WebhookSubscriptionDriverException(googleApiError.message, _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.NOT_FOUND, options);
        case 429:
        case 500:
        case 502:
        case 503:
        case 504:
            return new _webhooksubscriptiondriverexception.WebhookSubscriptionDriverException(googleApiError.message, _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.TEMPORARY_ERROR, options);
        default:
            return new _webhooksubscriptiondriverexception.WebhookSubscriptionDriverException(googleApiError.message, _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.UNKNOWN, options);
    }
};

//# sourceMappingURL=parse-google-webhook-subscription-error.util.js.map
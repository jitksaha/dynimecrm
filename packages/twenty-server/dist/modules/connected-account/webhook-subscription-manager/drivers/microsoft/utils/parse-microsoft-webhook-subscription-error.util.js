"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseMicrosoftWebhookSubscriptionError", {
    enumerable: true,
    get: function() {
        return parseMicrosoftWebhookSubscriptionError;
    }
});
const _utils = require("twenty-shared/utils");
const _webhooksubscriptiondriverexception = require("../../exceptions/webhook-subscription-driver.exception");
const MICROSOFT_MAILBOX_NOT_ENABLED_FOR_REST_API_ERROR_CODE = 'MailboxNotEnabledForRESTAPI';
const parseMicrosoftWebhookSubscriptionError = (error, options)=>{
    switch(error.statusCode){
        case 400:
            if (!(0, _utils.isDefined)(error.message)) {
                return new _webhooksubscriptiondriverexception.WebhookSubscriptionDriverException('Microsoft Graph API returned 400 with empty error body', _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.TEMPORARY_ERROR, options);
            }
            return new _webhooksubscriptiondriverexception.WebhookSubscriptionDriverException(`Invalid request to Microsoft Graph API: ${error.message}`, _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.UNKNOWN, options);
        case 401:
            return new _webhooksubscriptiondriverexception.WebhookSubscriptionDriverException(`Unauthorized access to Microsoft Graph API - code:${error.code} ${error.message}`, _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.TEMPORARY_ERROR, options);
        case 403:
            return new _webhooksubscriptiondriverexception.WebhookSubscriptionDriverException(`Forbidden access to Microsoft Graph API - code:${error.code} ${error.message}`, _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.INSUFFICIENT_PERMISSIONS, options);
        case 404:
            if (error.code === MICROSOFT_MAILBOX_NOT_ENABLED_FOR_REST_API_ERROR_CODE) {
                return new _webhooksubscriptiondriverexception.WebhookSubscriptionDriverException(`Disabled, deleted, inactive or no licence Microsoft account - code:${error.code}`, _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.INSUFFICIENT_PERMISSIONS, options);
            }
            return new _webhooksubscriptiondriverexception.WebhookSubscriptionDriverException(`Not found - code:${error.code}`, _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.NOT_FOUND, options);
        case 429:
        case 500:
        case 502:
        case 503:
        case 504:
        case 509:
            return new _webhooksubscriptiondriverexception.WebhookSubscriptionDriverException(`Microsoft Graph API ${error.code} ${error.statusCode} error: ${error.message}`, _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.TEMPORARY_ERROR, options);
        default:
            return new _webhooksubscriptiondriverexception.WebhookSubscriptionDriverException(`Microsoft Graph API unknown error: ${error.message} with status code ${error.statusCode}`, _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.UNKNOWN, options);
    }
};

//# sourceMappingURL=parse-microsoft-webhook-subscription-error.util.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _webhooksubscriptiondriverexception = require("../../../exceptions/webhook-subscription-driver.exception");
const _parsemicrosoftwebhooksubscriptionerrorutil = require("../parse-microsoft-webhook-subscription-error.util");
describe('parseMicrosoftWebhookSubscriptionError', ()=>{
    it('should return INSUFFICIENT_PERMISSIONS when the mailbox is not enabled for the REST API', ()=>{
        const exception = (0, _parsemicrosoftwebhooksubscriptionerrorutil.parseMicrosoftWebhookSubscriptionError)({
            statusCode: 404,
            code: 'MailboxNotEnabledForRESTAPI',
            message: 'The mailbox is either inactive, soft-deleted, or is hosted on-premise.'
        });
        expect(exception.code).toBe(_webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.INSUFFICIENT_PERMISSIONS);
    });
    it('should return NOT_FOUND when the subscription no longer exists', ()=>{
        const exception = (0, _parsemicrosoftwebhooksubscriptionerrorutil.parseMicrosoftWebhookSubscriptionError)({
            statusCode: 404,
            code: 'ResourceNotFound',
            message: 'The object was not found.'
        });
        expect(exception.code).toBe(_webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.NOT_FOUND);
    });
    it.each([
        [
            'InvalidRequest',
            'Failed to resolve domain example.invalid'
        ],
        [
            'ValidationError',
            'Subscription validation request failed.'
        ]
    ])('should return UNKNOWN for the 400 code %s', (code, message)=>{
        const exception = (0, _parsemicrosoftwebhooksubscriptionerrorutil.parseMicrosoftWebhookSubscriptionError)({
            statusCode: 400,
            code,
            message
        });
        expect(exception.code).toBe(_webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.UNKNOWN);
    });
    it('should return TEMPORARY_ERROR when a 400 carries no error body', ()=>{
        const exception = (0, _parsemicrosoftwebhooksubscriptionerrorutil.parseMicrosoftWebhookSubscriptionError)({
            statusCode: 400
        });
        expect(exception.code).toBe(_webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.TEMPORARY_ERROR);
    });
    it('should keep the provider error as the exception cause', ()=>{
        const providerError = new Error('graph exploded');
        const exception = (0, _parsemicrosoftwebhooksubscriptionerrorutil.parseMicrosoftWebhookSubscriptionError)({
            statusCode: 404,
            code: 'ResourceNotFound'
        }, {
            cause: providerError
        });
        expect(exception.cause).toBe(providerError);
    });
    it('should return INSUFFICIENT_PERMISSIONS on 403', ()=>{
        const exception = (0, _parsemicrosoftwebhooksubscriptionerrorutil.parseMicrosoftWebhookSubscriptionError)({
            statusCode: 403,
            code: 'ErrorAccessDenied',
            message: 'Access is denied.'
        });
        expect(exception.code).toBe(_webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.INSUFFICIENT_PERMISSIONS);
    });
    it.each([
        401,
        429,
        500,
        502,
        503,
        504,
        509
    ])('should return TEMPORARY_ERROR on %i', (statusCode)=>{
        const exception = (0, _parsemicrosoftwebhooksubscriptionerrorutil.parseMicrosoftWebhookSubscriptionError)({
            statusCode
        });
        expect(exception.code).toBe(_webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.TEMPORARY_ERROR);
    });
    it('should return TEMPORARY_ERROR when the application is throttled', ()=>{
        const exception = (0, _parsemicrosoftwebhooksubscriptionerrorutil.parseMicrosoftWebhookSubscriptionError)({
            statusCode: 429,
            code: 'ApplicationThrottled',
            message: 'Application is over its MailboxConcurrency limit.'
        });
        expect(exception.code).toBe(_webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.TEMPORARY_ERROR);
    });
    it('should return UNKNOWN on an unhandled status code', ()=>{
        const exception = (0, _parsemicrosoftwebhooksubscriptionerrorutil.parseMicrosoftWebhookSubscriptionError)({
            statusCode: 418
        });
        expect(exception.code).toBe(_webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.UNKNOWN);
    });
});

//# sourceMappingURL=parse-microsoft-webhook-subscription-error.util.spec.js.map
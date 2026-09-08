"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _webhooksubscriptiondriverexception = require("../../../exceptions/webhook-subscription-driver.exception");
const _parsegooglewebhooksubscriptionerrorutil = require("../parse-google-webhook-subscription-error.util");
const buildGaxiosError = ({ status, reason, message = 'error' })=>({
        response: {
            status,
            data: {
                error: {
                    errors: [
                        {
                            reason,
                            message
                        }
                    ]
                }
            }
        }
    });
describe('parseGoogleWebhookSubscriptionError', ()=>{
    it('should return NOT_FOUND when stopping a channel that no longer exists', ()=>{
        const exception = (0, _parsegooglewebhooksubscriptionerrorutil.parseGoogleWebhookSubscriptionError)(buildGaxiosError({
            status: 404,
            reason: 'notFound',
            message: "Channel '01cb40eb' not found for project '904792538077'"
        }));
        expect(exception.code).toBe(_webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.NOT_FOUND);
    });
    it('should return INSUFFICIENT_PERMISSIONS on 401', ()=>{
        const exception = (0, _parsegooglewebhooksubscriptionerrorutil.parseGoogleWebhookSubscriptionError)(buildGaxiosError({
            status: 401,
            reason: 'authError',
            message: 'Invalid Credentials'
        }));
        expect(exception.code).toBe(_webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.INSUFFICIENT_PERMISSIONS);
    });
    it('should return TEMPORARY_ERROR when concurrent requests are throttled', ()=>{
        const exception = (0, _parsegooglewebhooksubscriptionerrorutil.parseGoogleWebhookSubscriptionError)(buildGaxiosError({
            status: 429,
            reason: 'rateLimitExceeded',
            message: 'Too many concurrent requests for user.'
        }));
        expect(exception.code).toBe(_webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.TEMPORARY_ERROR);
    });
    it('should return TEMPORARY_ERROR when the per-minute quota is exhausted', ()=>{
        const exception = (0, _parsegooglewebhooksubscriptionerrorutil.parseGoogleWebhookSubscriptionError)(buildGaxiosError({
            status: 403,
            reason: 'rateLimitExceeded',
            message: "Quota exceeded for quota metric 'Queries' and limit 'Units per minute per user'"
        }));
        expect(exception.code).toBe(_webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.TEMPORARY_ERROR);
    });
    it('should return INSUFFICIENT_PERMISSIONS when the scope was not granted', ()=>{
        const exception = (0, _parsegooglewebhooksubscriptionerrorutil.parseGoogleWebhookSubscriptionError)(buildGaxiosError({
            status: 403,
            reason: 'insufficientPermissions',
            message: 'Request had insufficient authentication scopes.'
        }));
        expect(exception.code).toBe(_webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.INSUFFICIENT_PERMISSIONS);
    });
    it.each([
        429,
        500,
        502,
        503,
        504
    ])('should return TEMPORARY_ERROR on %i', (status)=>{
        const exception = (0, _parsegooglewebhooksubscriptionerrorutil.parseGoogleWebhookSubscriptionError)(buildGaxiosError({
            status
        }));
        expect(exception.code).toBe(_webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.TEMPORARY_ERROR);
    });
    it.each([
        [
            'push.webhookUrlNotHttps',
            'WebHook callback must be HTTPS'
        ],
        [
            'invalidArgument',
            'Invalid topicName does not match projects/x/topics/*'
        ]
    ])('should return UNKNOWN for the 400 reason %s', (reason, message)=>{
        const exception = (0, _parsegooglewebhooksubscriptionerrorutil.parseGoogleWebhookSubscriptionError)(buildGaxiosError({
            status: 400,
            reason,
            message
        }));
        expect(exception.code).toBe(_webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.UNKNOWN);
    });
    it('should return TEMPORARY_ERROR when the request never got a response', ()=>{
        const exception = (0, _parsegooglewebhooksubscriptionerrorutil.parseGoogleWebhookSubscriptionError)({
            message: 'connect ECONNRESET'
        });
        expect(exception.code).toBe(_webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.TEMPORARY_ERROR);
    });
    it('should return TEMPORARY_ERROR for a transient failed precondition', ()=>{
        const exception = (0, _parsegooglewebhooksubscriptionerrorutil.parseGoogleWebhookSubscriptionError)(buildGaxiosError({
            status: 400,
            reason: 'failedPrecondition',
            message: 'Precondition check failed.'
        }));
        expect(exception.code).toBe(_webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.TEMPORARY_ERROR);
    });
    it('should return INSUFFICIENT_PERMISSIONS when mail service is not enabled', ()=>{
        const exception = (0, _parsegooglewebhooksubscriptionerrorutil.parseGoogleWebhookSubscriptionError)(buildGaxiosError({
            status: 400,
            reason: 'failedPrecondition',
            message: 'Mail service not enabled for this account.'
        }));
        expect(exception.code).toBe(_webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.INSUFFICIENT_PERMISSIONS);
    });
    it('should keep the provider error as the exception cause', ()=>{
        const providerError = buildGaxiosError({
            status: 404,
            reason: 'notFound'
        });
        const exception = (0, _parsegooglewebhooksubscriptionerrorutil.parseGoogleWebhookSubscriptionError)(providerError, {
            cause: providerError
        });
        expect(exception.cause).toBe(providerError);
    });
    it('should return INSUFFICIENT_PERMISSIONS when the refresh token was revoked', ()=>{
        const exception = {
            response: {
                status: 400,
                data: {
                    error: 'invalid_grant'
                }
            }
        };
        expect((0, _parsegooglewebhooksubscriptionerrorutil.parseGoogleWebhookSubscriptionError)(exception).code).toBe(_webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.INSUFFICIENT_PERMISSIONS);
    });
});

//# sourceMappingURL=parse-google-webhook-subscription-error.util.spec.js.map
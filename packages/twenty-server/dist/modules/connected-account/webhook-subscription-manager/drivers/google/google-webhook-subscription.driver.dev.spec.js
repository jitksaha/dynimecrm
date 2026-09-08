"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _googleapis = require("googleapis");
const _types = require("twenty-shared/types");
const _webhooksubscriptiondriverexception = require("../exceptions/webhook-subscription-driver.exception");
const _googlewebhooksubscriptiondriver = require("./google-webhook-subscription.driver");
const accessToken = process.env.GOOGLE_DEV_ACCESS_TOKEN ?? '';
const connectedAccountId = 'dev-connected-account';
const buildDriver = ({ serverUrl = 'https://twenty-probe.invalid', pubSubTopic = 'projects/twenty-auth-dev/topics/gmail', token = accessToken } = {})=>{
    const oAuth2Client = new _googleapis.google.auth.OAuth2();
    oAuth2Client.setCredentials({
        access_token: token
    });
    const oAuth2ClientProvider = {
        getClient: async ()=>oAuth2Client
    };
    const twentyConfigService = {
        get: (key)=>key === 'MESSAGING_GMAIL_PUBSUB_TOPIC' ? pubSubTopic : serverUrl
    };
    return new _googlewebhooksubscriptiondriver.GoogleWebhookSubscriptionDriver(oAuth2ClientProvider, twentyConfigService);
};
const expectDriverExceptionCode = async (operation, expected)=>{
    await expect(operation).rejects.toBeInstanceOf(_webhooksubscriptiondriverexception.WebhookSubscriptionDriverException);
    await expect(operation).rejects.toMatchObject({
        code: expected
    });
};
xdescribe('Google dev tests : webhook subscription driver', ()=>{
    beforeAll(()=>{
        jest.useRealTimers();
    });
    it('should map a stopped channel that no longer exists to NOT_FOUND', async ()=>{
        await expectDriverExceptionCode(buildDriver().deleteSubscription({
            connectedAccountId,
            channelType: _types.WebhookSubscriptionChannelType.CALENDAR,
            externalSubscriptionId: '00000000-0000-4000-8000-000000000000',
            externalResourceId: 'does-not-exist',
            clientState: 'dev'
        }), _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.NOT_FOUND);
    });
    it('should map a non-https notification url to UNKNOWN', async ()=>{
        await expectDriverExceptionCode(buildDriver({
            serverUrl: 'http://insecure.example.com'
        }).createSubscription(connectedAccountId, _types.WebhookSubscriptionChannelType.CALENDAR, 'dev'), _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.UNKNOWN);
    });
    it('should map a pubsub topic owned by another project to UNKNOWN', async ()=>{
        await expectDriverExceptionCode(buildDriver({
            pubSubTopic: 'projects/twenty-probe-nonexistent/topics/nope'
        }).createSubscription(connectedAccountId, _types.WebhookSubscriptionChannelType.MESSAGING, 'dev'), _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.UNKNOWN);
    });
    it('should map an expired access token to INSUFFICIENT_PERMISSIONS', async ()=>{
        await expectDriverExceptionCode(buildDriver({
            token: 'not-a-real-token'
        }).createSubscription(connectedAccountId, _types.WebhookSubscriptionChannelType.CALENDAR, 'dev'), _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.INSUFFICIENT_PERMISSIONS);
    });
});

//# sourceMappingURL=google-webhook-subscription.driver.dev.spec.js.map
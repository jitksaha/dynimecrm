"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _microsoftgraphclient = require("@microsoft/microsoft-graph-client");
const _types = require("twenty-shared/types");
const _webhooksubscriptiondriverexception = require("../exceptions/webhook-subscription-driver.exception");
const _microsoftwebhooksubscriptiondriver = require("./microsoft-webhook-subscription.driver");
const accessToken = process.env.MICROSOFT_DEV_ACCESS_TOKEN ?? '';
const connectedAccountId = 'dev-connected-account';
const goneSubscriptionId = '00000000-0000-4000-8000-000000000000';
const buildDriver = ({ serverUrl = 'https://twenty-probe-does-not-exist.invalid', token = accessToken } = {})=>{
    const oAuth2ClientProvider = {
        getClient: async ()=>_microsoftgraphclient.Client.init({
                authProvider: (done)=>done(null, token)
            })
    };
    const twentyConfigService = {
        get: ()=>serverUrl
    };
    return new _microsoftwebhooksubscriptiondriver.MicrosoftWebhookSubscriptionDriver(oAuth2ClientProvider, twentyConfigService);
};
const context = {
    connectedAccountId,
    channelType: _types.WebhookSubscriptionChannelType.CALENDAR,
    externalSubscriptionId: goneSubscriptionId,
    externalResourceId: null,
    clientState: 'dev'
};
const expectDriverExceptionCode = async (operation, expected)=>{
    await expect(operation).rejects.toBeInstanceOf(_webhooksubscriptiondriverexception.WebhookSubscriptionDriverException);
    await expect(operation).rejects.toMatchObject({
        code: expected
    });
};
xdescribe('Microsoft dev tests : webhook subscription driver', ()=>{
    beforeAll(()=>{
        jest.useRealTimers();
    });
    it('should map renewing a removed subscription to NOT_FOUND', async ()=>{
        await expectDriverExceptionCode(buildDriver().renewSubscription(context), _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.NOT_FOUND);
    });
    it('should map deleting a removed subscription to NOT_FOUND', async ()=>{
        await expectDriverExceptionCode(buildDriver().deleteSubscription(context), _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.NOT_FOUND);
    });
    it('should map an unreachable notification url to UNKNOWN', async ()=>{
        await expectDriverExceptionCode(buildDriver().createSubscription(connectedAccountId, _types.WebhookSubscriptionChannelType.CALENDAR, 'dev'), _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.UNKNOWN);
    });
    it('should map an expired access token to TEMPORARY_ERROR', async ()=>{
        await expectDriverExceptionCode(buildDriver({
            token: 'not-a-real-token'
        }).renewSubscription(context), _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.TEMPORARY_ERROR);
    });
});

//# sourceMappingURL=microsoft-webhook-subscription.driver.dev.spec.js.map
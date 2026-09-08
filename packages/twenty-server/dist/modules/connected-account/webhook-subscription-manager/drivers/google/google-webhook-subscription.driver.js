"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GoogleWebhookSubscriptionDriver", {
    enumerable: true,
    get: function() {
        return GoogleWebhookSubscriptionDriver;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _googleapis = require("googleapis");
const _utils = require("twenty-shared/utils");
const _uuid = require("uuid");
const _types = require("twenty-shared/types");
const _twentyconfigservice = require("../../../../../engine/core-modules/twenty-config/twenty-config.service");
const _googlecalendarwatchttlmsconstant = require("./google-calendar-watch-ttl-ms.constant");
const _webhooksubscriptiondriverexception = require("../exceptions/webhook-subscription-driver.exception");
const _parsegooglewebhooksubscriptionerrorutil = require("./utils/parse-google-webhook-subscription-error.util");
const _googleoauth2clientprovider = require("../../../oauth2-client-manager/drivers/google/google-oauth2-client.provider");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let GoogleWebhookSubscriptionDriver = class GoogleWebhookSubscriptionDriver {
    async createSubscription(connectedAccountId, channelType, clientState) {
        return channelType === _types.WebhookSubscriptionChannelType.MESSAGING ? this.watchGmailMailbox(connectedAccountId) : this.watchPrimaryCalendar(connectedAccountId, clientState);
    }
    async renewSubscription(context) {
        if (context.channelType === _types.WebhookSubscriptionChannelType.CALENDAR) {
            // Google Calendar watches can't be extended, only replaced by a fresh channel.
            // Recreate before stopping the old watch so a failed recreate never leaves the account with no live watch.
            const result = await this.createSubscription(context.connectedAccountId, context.channelType, context.clientState);
            await this.deleteSubscription(context).catch(()=>undefined);
            return result;
        }
        return this.createSubscription(context.connectedAccountId, context.channelType, context.clientState);
    }
    async deleteSubscription(context) {
        return context.channelType === _types.WebhookSubscriptionChannelType.MESSAGING ? this.stopGmailMailboxWatch(context.connectedAccountId) : this.stopCalendarWatch(context);
    }
    async watchGmailMailbox(connectedAccountId) {
        const pubSubTopicName = this.twentyConfigService.get('MESSAGING_GMAIL_PUBSUB_TOPIC');
        if (!(0, _guards.isNonEmptyString)(pubSubTopicName)) {
            throw new _webhooksubscriptiondriverexception.WebhookSubscriptionDriverException('MESSAGING_GMAIL_PUBSUB_TOPIC is not configured', _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.PROVIDER_NOT_CONFIGURED);
        }
        const gmailClient = await this.getGmailClient(connectedAccountId);
        const { data } = await gmailClient.users.watch({
            userId: 'me',
            requestBody: {
                topicName: pubSubTopicName
            }
        }).catch((error)=>{
            throw (0, _parsegooglewebhooksubscriptionerrorutil.parseGoogleWebhookSubscriptionError)(error, {
                cause: error
            });
        });
        if (!(0, _utils.isDefined)(data.expiration)) {
            throw new _webhooksubscriptiondriverexception.WebhookSubscriptionDriverException('Gmail watch response did not include an expiration', _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.PROVIDER_RESPONSE_INVALID);
        }
        return {
            externalSubscriptionId: null,
            externalResourceId: null,
            expiresAt: new Date(Number(data.expiration))
        };
    }
    async stopGmailMailboxWatch(connectedAccountId) {
        const gmailClient = await this.getGmailClient(connectedAccountId);
        await gmailClient.users.stop({
            userId: 'me'
        }).catch((error)=>{
            throw (0, _parsegooglewebhooksubscriptionerrorutil.parseGoogleWebhookSubscriptionError)(error, {
                cause: error
            });
        });
    }
    async watchPrimaryCalendar(connectedAccountId, clientState) {
        const calendarClient = await this.getCalendarClient(connectedAccountId);
        const notificationAddress = `${this.twentyConfigService.get('SERVER_URL')}/webhooks/google/calendar`;
        const watchChannelId = (0, _uuid.v4)();
        const { data } = await calendarClient.events.watch({
            calendarId: 'primary',
            requestBody: {
                id: watchChannelId,
                type: 'web_hook',
                address: notificationAddress,
                token: clientState,
                params: {
                    ttl: String(_googlecalendarwatchttlmsconstant.GOOGLE_CALENDAR_WATCH_TTL_MS / 1000)
                }
            }
        }).catch((error)=>{
            throw (0, _parsegooglewebhooksubscriptionerrorutil.parseGoogleWebhookSubscriptionError)(error, {
                cause: error
            });
        });
        if (!(0, _utils.isDefined)(data.resourceId) || !(0, _utils.isDefined)(data.expiration)) {
            throw new _webhooksubscriptiondriverexception.WebhookSubscriptionDriverException('Google Calendar watch response did not include a resourceId or expiration', _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.PROVIDER_RESPONSE_INVALID);
        }
        return {
            externalSubscriptionId: watchChannelId,
            externalResourceId: data.resourceId,
            expiresAt: new Date(Number(data.expiration))
        };
    }
    async stopCalendarWatch(context) {
        if (!(0, _utils.isDefined)(context.externalSubscriptionId) || !(0, _utils.isDefined)(context.externalResourceId)) {
            return;
        }
        const calendarClient = await this.getCalendarClient(context.connectedAccountId);
        await calendarClient.channels.stop({
            requestBody: {
                id: context.externalSubscriptionId,
                resourceId: context.externalResourceId
            }
        }).catch((error)=>{
            throw (0, _parsegooglewebhooksubscriptionerrorutil.parseGoogleWebhookSubscriptionError)(error, {
                cause: error
            });
        });
    }
    async getGmailClient(connectedAccountId) {
        const oAuth2Client = await this.googleOAuth2ClientProvider.getClient(connectedAccountId);
        return _googleapis.google.gmail({
            version: 'v1',
            auth: oAuth2Client
        });
    }
    async getCalendarClient(connectedAccountId) {
        const oAuth2Client = await this.googleOAuth2ClientProvider.getClient(connectedAccountId);
        return _googleapis.google.calendar({
            version: 'v3',
            auth: oAuth2Client
        });
    }
    constructor(googleOAuth2ClientProvider, twentyConfigService){
        this.googleOAuth2ClientProvider = googleOAuth2ClientProvider;
        this.twentyConfigService = twentyConfigService;
    }
};
GoogleWebhookSubscriptionDriver = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _googleoauth2clientprovider.GoogleOAuth2ClientProvider === "undefined" ? Object : _googleoauth2clientprovider.GoogleOAuth2ClientProvider,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], GoogleWebhookSubscriptionDriver);

//# sourceMappingURL=google-webhook-subscription.driver.js.map
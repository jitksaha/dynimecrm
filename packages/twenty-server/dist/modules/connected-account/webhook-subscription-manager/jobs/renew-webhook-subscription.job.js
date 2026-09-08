"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RenewWebhookSubscriptionJob", {
    enumerable: true,
    get: function() {
        return RenewWebhookSubscriptionJob;
    }
});
const _types = require("twenty-shared/types");
const _processdecorator = require("../../../../engine/core-modules/message-queue/decorators/process.decorator");
const _processordecorator = require("../../../../engine/core-modules/message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../../engine/core-modules/message-queue/message-queue.constants");
const _calendarwebhooksubscriptionservice = require("../services/calendar-webhook-subscription.service");
const _messagingwebhooksubscriptionservice = require("../services/messaging-webhook-subscription.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let RenewWebhookSubscriptionJob = class RenewWebhookSubscriptionJob {
    async handle(data) {
        const { channelType, channelId, workspaceId } = data;
        switch(channelType){
            case _types.WebhookSubscriptionChannelType.MESSAGING:
                await this.messagingWebhookSubscriptionService.renewSubscription({
                    messageChannelId: channelId,
                    workspaceId
                });
                break;
            case _types.WebhookSubscriptionChannelType.CALENDAR:
                await this.calendarWebhookSubscriptionService.renewSubscription({
                    calendarChannelId: channelId,
                    workspaceId
                });
                break;
        }
    }
    constructor(messagingWebhookSubscriptionService, calendarWebhookSubscriptionService){
        this.messagingWebhookSubscriptionService = messagingWebhookSubscriptionService;
        this.calendarWebhookSubscriptionService = calendarWebhookSubscriptionService;
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(RenewWebhookSubscriptionJob.name),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof RenewWebhookSubscriptionJobData === "undefined" ? Object : RenewWebhookSubscriptionJobData
    ]),
    _ts_metadata("design:returntype", Promise)
], RenewWebhookSubscriptionJob.prototype, "handle", null);
RenewWebhookSubscriptionJob = _ts_decorate([
    (0, _processordecorator.Processor)(_messagequeueconstants.MessageQueue.webhookQueue),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _messagingwebhooksubscriptionservice.MessagingWebhookSubscriptionService === "undefined" ? Object : _messagingwebhooksubscriptionservice.MessagingWebhookSubscriptionService,
        typeof _calendarwebhooksubscriptionservice.CalendarWebhookSubscriptionService === "undefined" ? Object : _calendarwebhooksubscriptionservice.CalendarWebhookSubscriptionService
    ])
], RenewWebhookSubscriptionJob);

//# sourceMappingURL=renew-webhook-subscription.job.js.map
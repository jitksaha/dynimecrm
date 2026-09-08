"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WebhookSubscriptionChannelDeletedListener", {
    enumerable: true,
    get: function() {
        return WebhookSubscriptionChannelDeletedListener;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _oncustombatcheventdecorator = require("../../../../engine/api/graphql/graphql-query-runner/decorators/on-custom-batch-event.decorator");
const _calendarchanneldeletedconstant = require("../../../../engine/metadata-modules/calendar-channel/constants/calendar-channel-deleted.constant");
const _messagechanneldeletedconstant = require("../../../../engine/metadata-modules/message-channel/constants/message-channel-deleted.constant");
const _customworkspacebatcheventtype = require("../../../../engine/workspace-event-emitter/types/custom-workspace-batch-event.type");
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
let WebhookSubscriptionChannelDeletedListener = class WebhookSubscriptionChannelDeletedListener {
    async handleMessageChannelDeleted(batchEvent) {
        const { workspaceId } = batchEvent;
        if (!(0, _utils.isDefined)(workspaceId)) {
            return;
        }
        for (const event of batchEvent.events){
            await this.messagingWebhookSubscriptionService.deleteSubscription(event.messageChannelId, workspaceId);
        }
    }
    async handleCalendarChannelDeleted(batchEvent) {
        const { workspaceId } = batchEvent;
        if (!(0, _utils.isDefined)(workspaceId)) {
            return;
        }
        for (const event of batchEvent.events){
            await this.calendarWebhookSubscriptionService.deleteSubscription(event.calendarChannelId, workspaceId);
        }
    }
    constructor(messagingWebhookSubscriptionService, calendarWebhookSubscriptionService){
        this.messagingWebhookSubscriptionService = messagingWebhookSubscriptionService;
        this.calendarWebhookSubscriptionService = calendarWebhookSubscriptionService;
    }
};
_ts_decorate([
    (0, _oncustombatcheventdecorator.OnCustomBatchEvent)(_messagechanneldeletedconstant.MESSAGE_CHANNEL_DELETED_EVENT),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _customworkspacebatcheventtype.CustomWorkspaceEventBatch === "undefined" ? Object : _customworkspacebatcheventtype.CustomWorkspaceEventBatch
    ]),
    _ts_metadata("design:returntype", Promise)
], WebhookSubscriptionChannelDeletedListener.prototype, "handleMessageChannelDeleted", null);
_ts_decorate([
    (0, _oncustombatcheventdecorator.OnCustomBatchEvent)(_calendarchanneldeletedconstant.CALENDAR_CHANNEL_DELETED_EVENT),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _customworkspacebatcheventtype.CustomWorkspaceEventBatch === "undefined" ? Object : _customworkspacebatcheventtype.CustomWorkspaceEventBatch
    ]),
    _ts_metadata("design:returntype", Promise)
], WebhookSubscriptionChannelDeletedListener.prototype, "handleCalendarChannelDeleted", null);
WebhookSubscriptionChannelDeletedListener = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _messagingwebhooksubscriptionservice.MessagingWebhookSubscriptionService === "undefined" ? Object : _messagingwebhooksubscriptionservice.MessagingWebhookSubscriptionService,
        typeof _calendarwebhooksubscriptionservice.CalendarWebhookSubscriptionService === "undefined" ? Object : _calendarwebhooksubscriptionservice.CalendarWebhookSubscriptionService
    ])
], WebhookSubscriptionChannelDeletedListener);

//# sourceMappingURL=webhook-subscription-channel-deleted.listener.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GoogleCalendarNotificationHandler", {
    enumerable: true,
    get: function() {
        return GoogleCalendarNotificationHandler;
    }
});
const _crypto = require("crypto");
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _guards = require("@sniptt/guards");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _metricsservice = require("../../../../engine/core-modules/metrics/metrics.service");
const _metricskeystype = require("../../../../engine/core-modules/metrics/types/metrics-keys.type");
const _calendarchannelentity = require("../../../../engine/metadata-modules/calendar-channel/entities/calendar-channel.entity");
const _webhooksynctriggerservice = require("../../../connected-account/webhook-subscription-manager/services/webhook-sync-trigger.service");
const _connectedaccountsyncwebhookexception = require("../../connected-account-sync-webhook.exception");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
const GOOGLE_CALENDAR_SYNC_RESOURCE_STATE = 'sync';
let GoogleCalendarNotificationHandler = class GoogleCalendarNotificationHandler {
    async handle(request) {
        this.metricsService.incrementCounterBy({
            key: _metricskeystype.MetricsKeys.ConnectedAccountSyncWebhookReceivedCalendar,
            amount: 1
        });
        if (request.resourceState === GOOGLE_CALENDAR_SYNC_RESOURCE_STATE) {
            return;
        }
        if (!(0, _guards.isNonEmptyString)(request.channelId)) {
            return;
        }
        const calendarChannel = await this.calendarChannelRepository.findOne({
            where: {
                webhookSubscriptionExternalId: request.channelId,
                webhookSubscriptionStatus: _types.WebhookSubscriptionStatus.ACTIVE
            }
        });
        if (!(0, _utils.isDefined)(calendarChannel)) {
            this.logger.warn(`No calendar channel found for Google channel ${request.channelId}`);
            return;
        }
        const channelToken = request.channelToken;
        const clientState = calendarChannel.webhookSubscriptionClientState;
        const channelTokenBuffer = (0, _guards.isNonEmptyString)(channelToken) ? Buffer.from(channelToken) : null;
        const clientStateBuffer = (0, _guards.isNonEmptyString)(clientState) ? Buffer.from(clientState) : null;
        if (!(0, _utils.isDefined)(channelTokenBuffer) || !(0, _utils.isDefined)(clientStateBuffer) || channelTokenBuffer.length !== clientStateBuffer.length || !(0, _crypto.timingSafeEqual)(channelTokenBuffer, clientStateBuffer)) {
            throw new _connectedaccountsyncwebhookexception.ConnectedAccountSyncWebhookException('Google calendar channel token mismatch', _connectedaccountsyncwebhookexception.ConnectedAccountSyncWebhookExceptionCode.INVALID_SIGNATURE);
        }
        await this.webhookSyncTriggerService.triggerCalendarSync(calendarChannel.id, calendarChannel.workspaceId);
        this.logger.log(`Triggered calendar sync for calendar channel ${calendarChannel.id} from Google notification`);
    }
    constructor(calendarChannelRepository, webhookSyncTriggerService, metricsService){
        this.calendarChannelRepository = calendarChannelRepository;
        this.webhookSyncTriggerService = webhookSyncTriggerService;
        this.metricsService = metricsService;
        this.logger = new _common.Logger(GoogleCalendarNotificationHandler.name);
    }
};
GoogleCalendarNotificationHandler = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_calendarchannelentity.CalendarChannelEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _webhooksynctriggerservice.WebhookSyncTriggerService === "undefined" ? Object : _webhooksynctriggerservice.WebhookSyncTriggerService,
        typeof _metricsservice.MetricsService === "undefined" ? Object : _metricsservice.MetricsService
    ])
], GoogleCalendarNotificationHandler);

//# sourceMappingURL=google-calendar-notification.handler.js.map
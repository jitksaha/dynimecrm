"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WebhookSyncTriggerService", {
    enumerable: true,
    get: function() {
        return WebhookSyncTriggerService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _types = require("twenty-shared/types");
const _typeorm1 = require("typeorm");
const _messagequeuedecorator = require("../../../../engine/core-modules/message-queue/decorators/message-queue.decorator");
const _messagequeueconstants = require("../../../../engine/core-modules/message-queue/message-queue.constants");
const _messagequeueservice = require("../../../../engine/core-modules/message-queue/services/message-queue.service");
const _messagechannelentity = require("../../../../engine/metadata-modules/message-channel/entities/message-channel.entity");
const _calendareventwebhooksyncjob = require("../../../connected-account-sync-webhooks/calendar-event-webhook-sync/jobs/calendar-event-webhook-sync.job");
const _calendareventwebhooksyncretryinitialdelaymsconstant = require("../../../connected-account-sync-webhooks/calendar-event-webhook-sync/constants/calendar-event-webhook-sync-retry-initial-delay-ms.constant");
const _calendareventwebhooksyncretrylimitconstant = require("../../../connected-account-sync-webhooks/calendar-event-webhook-sync/constants/calendar-event-webhook-sync-retry-limit.constant");
const _messagingmessagelistfetchjob = require("../../../messaging/message-import-manager/jobs/messaging-message-list-fetch.job");
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
let WebhookSyncTriggerService = class WebhookSyncTriggerService {
    async triggerMessagingSync(messageChannelId, workspaceId) {
        const updateResult = await this.messageChannelRepository.createQueryBuilder().update().set({
            syncStage: _types.MessageChannelSyncStage.MESSAGE_LIST_FETCH_SCHEDULED,
            syncStageStartedAt: new Date()
        }).where({
            id: messageChannelId,
            workspaceId,
            isSyncEnabled: true,
            syncStage: _types.MessageChannelSyncStage.MESSAGE_LIST_FETCH_PENDING
        }).returning('id').execute();
        if (updateResult.raw.length === 0) {
            return;
        }
        try {
            await this.messagingQueueService.add(_messagingmessagelistfetchjob.MessagingMessageListFetchJob.name, {
                workspaceId,
                messageChannelId
            });
        } catch (error) {
            await this.messageChannelRepository.createQueryBuilder().update().set({
                syncStage: _types.MessageChannelSyncStage.MESSAGE_LIST_FETCH_PENDING
            }).where({
                id: messageChannelId,
                workspaceId
            }).execute();
            throw error;
        }
    }
    async triggerCalendarSync(calendarChannelId, workspaceId) {
        await this.connectedAccountSyncWebhookQueueService.add(_calendareventwebhooksyncjob.CalendarEventWebhookSyncJob.name, {
            workspaceId,
            calendarChannelId
        }, {
            id: `${_calendareventwebhooksyncjob.CalendarEventWebhookSyncJob.name}-${calendarChannelId}`,
            retryLimit: _calendareventwebhooksyncretrylimitconstant.CALENDAR_EVENT_WEBHOOK_SYNC_RETRY_LIMIT,
            backoff: {
                strategy: 'exponential',
                initialDelayMilliseconds: _calendareventwebhooksyncretryinitialdelaymsconstant.CALENDAR_EVENT_WEBHOOK_SYNC_RETRY_INITIAL_DELAY_MS
            }
        });
    }
    constructor(messagingQueueService, connectedAccountSyncWebhookQueueService, messageChannelRepository){
        this.messagingQueueService = messagingQueueService;
        this.connectedAccountSyncWebhookQueueService = connectedAccountSyncWebhookQueueService;
        this.messageChannelRepository = messageChannelRepository;
    }
};
WebhookSyncTriggerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.messagingQueue)),
    _ts_param(1, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.connectedAccountSyncWebhookQueue)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_messagechannelentity.MessageChannelEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService,
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], WebhookSyncTriggerService);

//# sourceMappingURL=webhook-sync-trigger.service.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WebhookSubscriptionRenewalCronJob", {
    enumerable: true,
    get: function() {
        return WebhookSubscriptionRenewalCronJob;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _types = require("twenty-shared/types");
const _workspace = require("twenty-shared/workspace");
const _typeorm1 = require("typeorm");
const _sentrycronmonitordecorator = require("../../../../../engine/core-modules/cron/sentry-cron-monitor.decorator");
const _messagequeuedecorator = require("../../../../../engine/core-modules/message-queue/decorators/message-queue.decorator");
const _processdecorator = require("../../../../../engine/core-modules/message-queue/decorators/process.decorator");
const _processordecorator = require("../../../../../engine/core-modules/message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../../../engine/core-modules/message-queue/message-queue.constants");
const _messagequeueservice = require("../../../../../engine/core-modules/message-queue/services/message-queue.service");
const _workspaceentity = require("../../../../../engine/core-modules/workspace/workspace.entity");
const _calendarchannelentity = require("../../../../../engine/metadata-modules/calendar-channel/entities/calendar-channel.entity");
const _messagechannelentity = require("../../../../../engine/metadata-modules/message-channel/entities/message-channel.entity");
const _webhooksubscriptionrenewalbuffermsconstant = require("../../constants/webhook-subscription-renewal-buffer-ms.constant");
const _webhooksubscriptionrenewalcronpatternconstant = require("../../constants/webhook-subscription-renewal-cron-pattern.constant");
const _renewwebhooksubscriptionjob = require("../../jobs/renew-webhook-subscription.job");
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
let WebhookSubscriptionRenewalCronJob = class WebhookSubscriptionRenewalCronJob {
    async handle() {
        const activeWorkspaces = await this.workspaceRepository.find({
            where: {
                activationStatus: _workspace.WorkspaceActivationStatus.ACTIVE
            },
            select: {
                id: true
            }
        });
        const activeWorkspaceIds = activeWorkspaces.map((workspace)=>workspace.id);
        if (activeWorkspaceIds.length === 0) {
            return;
        }
        const [messageChannels, calendarChannels] = await Promise.all([
            this.findStaleChannels(this.messageChannelRepository, activeWorkspaceIds),
            this.findStaleChannels(this.calendarChannelRepository, activeWorkspaceIds)
        ]);
        if (messageChannels.length === 0 && calendarChannels.length === 0) {
            return;
        }
        await Promise.all([
            this.enqueueRenewals(_types.WebhookSubscriptionChannelType.MESSAGING, messageChannels),
            this.enqueueRenewals(_types.WebhookSubscriptionChannelType.CALENDAR, calendarChannels)
        ]);
        this.logger.log(`Enqueued webhook subscription renewals: ${messageChannels.length} messaging, ${calendarChannels.length} calendar`);
    }
    findStaleChannels(repository, activeWorkspaceIds) {
        const workspaceScope = {
            workspaceId: (0, _typeorm1.In)(activeWorkspaceIds),
            connectedAccount: {
                authFailedAt: (0, _typeorm1.IsNull)()
            }
        };
        const renewalThreshold = new Date(Date.now() + _webhooksubscriptionrenewalbuffermsconstant.WEBHOOK_SUBSCRIPTION_RENEWAL_BUFFER_MS);
        const options = {
            where: [
                {
                    ...workspaceScope,
                    webhookSubscriptionStatus: _types.WebhookSubscriptionStatus.FAILED
                },
                {
                    ...workspaceScope,
                    webhookSubscriptionStatus: _types.WebhookSubscriptionStatus.ACTIVE,
                    webhookSubscriptionExpiresAt: (0, _typeorm1.LessThanOrEqual)(renewalThreshold)
                }
            ],
            select: {
                id: true,
                workspaceId: true
            }
        };
        return repository.find(options);
    }
    async enqueueRenewals(channelType, channels) {
        for (const channel of channels){
            await this.webhookQueueService.add(_renewwebhooksubscriptionjob.RenewWebhookSubscriptionJob.name, {
                channelType,
                channelId: channel.id,
                workspaceId: channel.workspaceId
            }, {
                id: `${_renewwebhooksubscriptionjob.RenewWebhookSubscriptionJob.name}:${channelType}:${channel.id}`,
                retryLimit: 3
            });
        }
    }
    constructor(workspaceRepository, messageChannelRepository, calendarChannelRepository, webhookQueueService){
        this.workspaceRepository = workspaceRepository;
        this.messageChannelRepository = messageChannelRepository;
        this.calendarChannelRepository = calendarChannelRepository;
        this.webhookQueueService = webhookQueueService;
        this.logger = new _common.Logger(WebhookSubscriptionRenewalCronJob.name);
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(WebhookSubscriptionRenewalCronJob.name),
    (0, _sentrycronmonitordecorator.SentryCronMonitor)(WebhookSubscriptionRenewalCronJob.name, _webhooksubscriptionrenewalcronpatternconstant.WEBHOOK_SUBSCRIPTION_RENEWAL_CRON_PATTERN),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], WebhookSubscriptionRenewalCronJob.prototype, "handle", null);
WebhookSubscriptionRenewalCronJob = _ts_decorate([
    (0, _processordecorator.Processor)(_messagequeueconstants.MessageQueue.cronQueue),
    _ts_param(0, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_messagechannelentity.MessageChannelEntity)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_calendarchannelentity.CalendarChannelEntity)),
    _ts_param(3, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.webhookQueue)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService
    ])
], WebhookSubscriptionRenewalCronJob);

//# sourceMappingURL=webhook-subscription-renewal.cron.job.js.map
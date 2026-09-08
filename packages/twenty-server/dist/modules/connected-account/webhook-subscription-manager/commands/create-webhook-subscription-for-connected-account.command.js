"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateWebhookSubscriptionForConnectedAccountCommand", {
    enumerable: true,
    get: function() {
        return CreateWebhookSubscriptionForConnectedAccountCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _types = require("twenty-shared/types");
const _typeorm1 = require("typeorm");
const _provisionedworkspacecommandrunner = require("../../../../database/commands/command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../../../database/commands/command-runners/workspace-iterator.service");
const _messagequeuedecorator = require("../../../../engine/core-modules/message-queue/decorators/message-queue.decorator");
const _messagequeueconstants = require("../../../../engine/core-modules/message-queue/message-queue.constants");
const _messagequeueservice = require("../../../../engine/core-modules/message-queue/services/message-queue.service");
const _calendarchannelentity = require("../../../../engine/metadata-modules/calendar-channel/entities/calendar-channel.entity");
const _messagechannelentity = require("../../../../engine/metadata-modules/message-channel/entities/message-channel.entity");
const _createwebhooksubscriptionjob = require("../jobs/create-webhook-subscription.job");
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
const WEBHOOK_BACKFILL_SPACING_MS = 2000;
const WEBHOOK_BACKFILL_RETRY_LIMIT = 3;
const WEBHOOK_CAPABLE_PROVIDERS = [
    _types.ConnectedAccountProvider.GOOGLE,
    _types.ConnectedAccountProvider.MICROSOFT
];
let CreateWebhookSubscriptionForConnectedAccountCommand = class CreateWebhookSubscriptionForConnectedAccountCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const messageChannelIds = await this.findEligibleChannelIds(this.messageChannelRepository, workspaceId);
        await this.enqueueChannels(_types.WebhookSubscriptionChannelType.MESSAGING, messageChannelIds, workspaceId, isDryRun);
        const calendarChannelIds = await this.findEligibleChannelIds(this.calendarChannelRepository, workspaceId);
        await this.enqueueChannels(_types.WebhookSubscriptionChannelType.CALENDAR, calendarChannelIds, workspaceId, isDryRun);
    }
    async findEligibleChannelIds(repository, workspaceId) {
        const rows = await repository.createQueryBuilder('core').select('core.id', 'id').innerJoin('core.connectedAccount', 'connectedAccount').where('core.workspaceId = :workspaceId', {
            workspaceId
        }).andWhere('core.isSyncEnabled = true').andWhere('connectedAccount.provider IN (:...providers)', {
            providers: WEBHOOK_CAPABLE_PROVIDERS
        }).andWhere('(core.webhookSubscriptionStatus IS NULL OR core.webhookSubscriptionStatus != :activeStatus)', {
            activeStatus: _types.WebhookSubscriptionStatus.ACTIVE
        }).getRawMany();
        return rows.map((row)=>row.id);
    }
    async enqueueChannels(channelType, channelIds, workspaceId, isDryRun) {
        if (channelIds.length === 0) {
            return;
        }
        if (isDryRun) {
            this.logger.log(`[DRY RUN] Workspace ${workspaceId}: ${channelIds.length} ${channelType} channels eligible for webhook backfill`);
            return;
        }
        for (const channelId of channelIds){
            await this.webhookQueueService.add(_createwebhooksubscriptionjob.CreateWebhookSubscriptionJob.name, {
                channelType,
                channelId,
                workspaceId
            }, {
                delay: this.enqueueCursorMs,
                retryLimit: WEBHOOK_BACKFILL_RETRY_LIMIT
            });
            this.enqueueCursorMs += WEBHOOK_BACKFILL_SPACING_MS;
        }
        this.logger.log(`Workspace ${workspaceId}: enqueued ${channelIds.length} ${channelType} webhook backfill jobs`);
    }
    constructor(messageChannelRepository, calendarChannelRepository, webhookQueueService, workspaceIteratorService){
        super(workspaceIteratorService), this.messageChannelRepository = messageChannelRepository, this.calendarChannelRepository = calendarChannelRepository, this.webhookQueueService = webhookQueueService, this.workspaceIteratorService = workspaceIteratorService, this.enqueueCursorMs = 0;
    }
};
CreateWebhookSubscriptionForConnectedAccountCommand = _ts_decorate([
    (0, _nestcommander.Command)({
        name: 'connected-account:create-webhook-subscription',
        description: 'Enqueue webhook subscription creation for existing Google/Microsoft channels still on polling, staggered to avoid provider rate limiting'
    }),
    _ts_param(0, (0, _typeorm.InjectRepository)(_messagechannelentity.MessageChannelEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_calendarchannelentity.CalendarChannelEntity)),
    _ts_param(2, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.webhookQueue)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService,
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService
    ])
], CreateWebhookSubscriptionForConnectedAccountCommand);

//# sourceMappingURL=create-webhook-subscription-for-connected-account.command.js.map
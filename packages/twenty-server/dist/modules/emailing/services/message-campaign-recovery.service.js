"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessageCampaignRecoveryService", {
    enumerable: true,
    get: function() {
        return MessageCampaignRecoveryService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("typeorm");
const _types = require("twenty-shared/types");
const _workspaceormmanager = require("../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _messagecampaignstatisticsservice = require("./message-campaign-statistics.service");
const _messagecampaignlifecycleservice = require("./message-campaign-lifecycle.service");
const _messagecampaignworkspaceentity = require("../standard-objects/message-campaign.workspace-entity");
const _messageworkspaceentity = require("../../messaging/common/standard-objects/message.workspace-entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const SENDING_STALE_THRESHOLD_MS = 60 * 60 * 1000;
let MessageCampaignRecoveryService = class MessageCampaignRecoveryService {
    async recoverOngoingStaleCampaigns({ workspaceId }) {
        const staleSince = new Date(Date.now() - SENDING_STALE_THRESHOLD_MS).toISOString();
        const staleCampaigns = await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const campaignRepository = this.workspaceOrmManager.getRepository(_messagecampaignworkspaceentity.MessageCampaignWorkspaceEntity, {
                shouldBypassPermissionChecks: true
            });
            return campaignRepository.find({
                where: {
                    status: (0, _typeorm.In)([
                        _types.MessageCampaignStatus.SENDING,
                        _types.MessageCampaignStatus.CANCELED
                    ]),
                    updatedAt: (0, _typeorm.LessThan)(staleSince)
                },
                select: {
                    id: true
                }
            });
        }, (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId));
        for (const campaign of staleCampaigns){
            await this.recoverStaleCampaign({
                workspaceId,
                campaignId: campaign.id,
                staleSince
            }).catch((error)=>{
                this.logger.error(`Failed to recover campaign ${campaign.id} of workspace ${workspaceId}: ${error instanceof Error ? error.message : String(error)}`);
            });
        }
    }
    async hasRecentMessageProgress({ workspaceId, campaignId, staleSince }) {
        return this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const messageRepository = this.workspaceOrmManager.getRepository(_messageworkspaceentity.MessageWorkspaceEntity, {
                shouldBypassPermissionChecks: true
            });
            return messageRepository.exists({
                where: {
                    messageCampaignId: campaignId,
                    updatedAt: (0, _typeorm.MoreThan)(staleSince)
                }
            });
        }, (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId));
    }
    async recoverStaleCampaign({ workspaceId, campaignId, staleSince }) {
        const hasProgress = await this.hasRecentMessageProgress({
            workspaceId,
            campaignId,
            staleSince
        });
        if (hasProgress) {
            return;
        }
        const counts = await this.messageCampaignStatisticsService.countDeliveriesByState({
            workspaceId,
            campaignId
        });
        if (counts.totalCount > 0) {
            await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
                const failedCount = await this.messageCampaignLifecycleService.failDeliveriesWithExpiredClaims({
                    workspaceId,
                    campaignId
                });
                if (failedCount > 0) {
                    this.logger.warn(`Campaign ${campaignId} of workspace ${workspaceId} had ${failedCount} message(s) stalled and they were failed`);
                }
                await this.messageCampaignLifecycleService.finalizeCampaignIfComplete({
                    workspaceId,
                    campaignId
                });
            }, (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId));
            return;
        }
        const released = await this.messageCampaignLifecycleService.transitionCampaignStatus({
            workspaceId,
            campaignId,
            from: _types.MessageCampaignStatus.SENDING,
            to: _types.MessageCampaignStatus.DRAFT
        });
        if (released) {
            this.logger.warn(`Campaign ${campaignId} of workspace ${workspaceId} materialized no message and was released back to draft`);
        }
    }
    constructor(workspaceOrmManager, messageCampaignLifecycleService, messageCampaignStatisticsService){
        this.workspaceOrmManager = workspaceOrmManager;
        this.messageCampaignLifecycleService = messageCampaignLifecycleService;
        this.messageCampaignStatisticsService = messageCampaignStatisticsService;
        this.logger = new _common.Logger(MessageCampaignRecoveryService.name);
    }
};
MessageCampaignRecoveryService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _messagecampaignlifecycleservice.MessageCampaignLifecycleService === "undefined" ? Object : _messagecampaignlifecycleservice.MessageCampaignLifecycleService,
        typeof _messagecampaignstatisticsservice.MessageCampaignStatisticsService === "undefined" ? Object : _messagecampaignstatisticsservice.MessageCampaignStatisticsService
    ])
], MessageCampaignRecoveryService);

//# sourceMappingURL=message-campaign-recovery.service.js.map
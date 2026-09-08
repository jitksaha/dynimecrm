"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessageCampaignStatisticsService", {
    enumerable: true,
    get: function() {
        return MessageCampaignStatisticsService;
    }
});
const _campaignjobretrylimitconstant = require("../../../engine/core-modules/emailing-domain/constants/campaign-job-retry-limit.constant");
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _types = require("twenty-shared/types");
const _cachestoragedecorator = require("../../../engine/core-modules/cache-storage/decorators/cache-storage.decorator");
const _cachestorageservice = require("../../../engine/core-modules/cache-storage/services/cache-storage.service");
const _cachestoragenamespaceenum = require("../../../engine/core-modules/cache-storage/types/cache-storage-namespace.enum");
const _campaignconstant = require("../../../engine/core-modules/emailing-domain/constants/campaign.constant");
const _campaigndeliveryentity = require("../../../engine/core-modules/emailing-domain/campaign-delivery.entity");
const _computecampaigncountsutil = require("../../../engine/core-modules/emailing-domain/utils/compute-campaign-counts.util");
const _injectworkspacescopedrepositorydecorator = require("../../../engine/twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../../engine/twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
const _messagequeuedecorator = require("../../../engine/core-modules/message-queue/decorators/message-queue.decorator");
const _messagequeueconstants = require("../../../engine/core-modules/message-queue/message-queue.constants");
const _messagequeueservice = require("../../../engine/core-modules/message-queue/services/message-queue.service");
const _workspaceormmanager = require("../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _messagecampaignworkspaceentity = require("../standard-objects/message-campaign.workspace-entity");
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
const RECONCILIATION_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const REFRESH_LOCK_TTL_MS = _campaignconstant.CAMPAIGN_STATS_REFRESH_DEBOUNCE_MS + 2_000;
let MessageCampaignStatisticsService = class MessageCampaignStatisticsService {
    async scheduleRefresh({ workspaceId, campaignId }) {
        const lockKey = `campaign-stats-refresh:${workspaceId}:${campaignId}`;
        const acquired = await this.cacheStorageService.acquireLock(lockKey, REFRESH_LOCK_TTL_MS);
        if (!acquired) {
            return;
        }
        await this.messageQueueService.add(_campaignconstant.REFRESH_CAMPAIGN_STATS_JOB, {
            workspaceId,
            campaignId
        }, {
            delay: _campaignconstant.CAMPAIGN_STATS_REFRESH_DEBOUNCE_MS,
            retryLimit: _campaignjobretrylimitconstant.CAMPAIGN_JOB_RETRY_LIMIT
        }).catch(async (error)=>{
            await this.cacheStorageService.releaseLock(lockKey);
            throw error;
        });
    }
    async countDeliveriesByState({ workspaceId, campaignId }) {
        const groups = await this.campaignDeliveryRepository.createQueryBuilder('delivery').select('delivery.state', 'state').addSelect('COUNT(*)', 'total').addSelect('COUNT(delivery."deliveredAt")', 'deliveredCount').addSelect('COUNT(delivery."bouncedAt")', 'bouncedCount').addSelect('COUNT(delivery."complainedAt")', 'complainedCount').addSelect(`COUNT(*) FILTER (WHERE delivery."rejectedAt" IS NOT NULL OR delivery."renderingFailedAt" IS NOT NULL)`, 'providerFailedCount').where('delivery."workspaceId" = :workspaceId', {
            workspaceId
        }).andWhere('delivery."campaignId" = :campaignId', {
            campaignId
        }).groupBy('delivery.state').getRawMany();
        return (0, _computecampaigncountsutil.computeCampaignCounts)({
            groups
        });
    }
    // The refresh lock is left to expire instead of being released here: a
    // backed-up queue can start this job after the lock TTL, and deleting the key
    // then would drop the lock a newer schedule already owns.
    async refreshCampaignCounts({ workspaceId, campaignId }) {
        const counts = await this.countDeliveriesByState({
            workspaceId,
            campaignId
        });
        await this.persistCampaignCounts({
            workspaceId,
            campaignId,
            counts
        });
    }
    async reconcileWorkspaceCampaignCounts({ workspaceId }) {
        const campaignIds = await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const campaignRepository = this.workspaceOrmManager.getRepository(_messagecampaignworkspaceentity.MessageCampaignWorkspaceEntity, {
                shouldBypassPermissionChecks: true
            });
            const campaigns = await campaignRepository.find({
                where: [
                    {
                        status: _types.MessageCampaignStatus.SENDING
                    },
                    {
                        sentAt: (0, _typeorm.MoreThanOrEqual)(new Date(Date.now() - RECONCILIATION_WINDOW_MS))
                    }
                ],
                select: {
                    id: true
                }
            });
            return campaigns.map((campaign)=>campaign.id);
        }, (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId));
        for (const campaignId of campaignIds){
            await this.refreshCampaignCounts({
                workspaceId,
                campaignId
            });
        }
    }
    async persistCampaignCounts({ workspaceId, campaignId, counts }) {
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const campaignRepository = this.workspaceOrmManager.getRepository(_messagecampaignworkspaceentity.MessageCampaignWorkspaceEntity, {
                shouldBypassPermissionChecks: true
            });
            const campaign = await campaignRepository.findOne({
                where: {
                    id: campaignId
                },
                select: {
                    id: true,
                    sentCount: true,
                    deliveredCount: true,
                    failedCount: true,
                    skippedCount: true,
                    bouncedCount: true,
                    complainedCount: true
                }
            });
            if (!(0, _utils.isDefined)(campaign)) {
                return;
            }
            const nextCounts = {
                sentCount: counts.sentCount,
                deliveredCount: counts.deliveredCount,
                failedCount: counts.failedCount,
                skippedCount: counts.skippedCount,
                bouncedCount: counts.bouncedCount,
                complainedCount: counts.complainedCount
            };
            const storedCounts = {
                sentCount: campaign.sentCount,
                deliveredCount: campaign.deliveredCount,
                failedCount: campaign.failedCount,
                skippedCount: campaign.skippedCount,
                bouncedCount: campaign.bouncedCount,
                complainedCount: campaign.complainedCount
            };
            if ((0, _utils.fastDeepEqual)(storedCounts, nextCounts)) {
                return;
            }
            await campaignRepository.update({
                id: campaignId
            }, nextCounts);
        }, (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId));
    }
    constructor(campaignDeliveryRepository, workspaceOrmManager, messageQueueService, cacheStorageService){
        this.campaignDeliveryRepository = campaignDeliveryRepository;
        this.workspaceOrmManager = workspaceOrmManager;
        this.messageQueueService = messageQueueService;
        this.cacheStorageService = cacheStorageService;
    }
};
MessageCampaignStatisticsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_campaigndeliveryentity.CampaignDeliveryEntity)),
    _ts_param(2, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.campaignQueue)),
    _ts_param(3, (0, _cachestoragedecorator.InjectCacheStorage)(_cachestoragenamespaceenum.CacheStorageNamespace.ModuleEmailing)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService,
        typeof _cachestorageservice.CacheStorageService === "undefined" ? Object : _cachestorageservice.CacheStorageService
    ])
], MessageCampaignStatisticsService);

//# sourceMappingURL=message-campaign-statistics.service.js.map
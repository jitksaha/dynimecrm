"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessageCampaignLifecycleService", {
    enumerable: true,
    get: function() {
        return MessageCampaignLifecycleService;
    }
});
const _common = require("@nestjs/common");
const _campaigndeliveryentity = require("../../../engine/core-modules/emailing-domain/campaign-delivery.entity");
const _campaigndeliverystateconstant = require("../../../engine/core-modules/emailing-domain/constants/campaign-delivery-state.constant");
const _campaignfailurereasonconstant = require("../../../engine/core-modules/emailing-domain/constants/campaign-failure-reason.constant");
const _campaignskipreasonconstant = require("../../../engine/core-modules/emailing-domain/constants/campaign-skip-reason.constant");
const _injectworkspacescopedrepositorydecorator = require("../../../engine/twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../../engine/twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
const _typeorm = require("typeorm");
const _emailingdomainexception = require("../../../engine/core-modules/emailing-domain/exceptions/emailing-domain.exception");
const _userroleservice = require("../../../engine/metadata-modules/user-role/user-role.service");
const _workspaceormmanager = require("../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _messagecampaignstatisticsservice = require("./message-campaign-statistics.service");
const _messagecampaignworkspaceentity = require("../standard-objects/message-campaign.workspace-entity");
const _computecampaignterminalstatusutil = require("../utils/compute-campaign-terminal-status.util");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
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
let MessageCampaignLifecycleService = class MessageCampaignLifecycleService {
    async transitionCampaignStatus({ workspaceId, campaignId, from, to, roleId }) {
        return this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const campaignRepository = this.workspaceOrmManager.getRepository(_messagecampaignworkspaceentity.MessageCampaignWorkspaceEntity, (0, _utils.isDefined)(roleId) ? {
                unionOf: [
                    roleId
                ]
            } : {
                shouldBypassPermissionChecks: true
            });
            const { affected } = await campaignRepository.update({
                id: campaignId,
                status: from
            }, {
                status: to
            });
            return affected === 1;
        }, (0, _utils.isDefined)(roleId) ? undefined : (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId));
    }
    async cancelCampaignOrThrow({ workspaceId, userWorkspaceId, campaignId }) {
        const roleId = await this.userRoleService.getRoleIdForUserWorkspace({
            workspaceId,
            userWorkspaceId
        });
        const canceled = await this.transitionCampaignStatus({
            workspaceId,
            campaignId,
            roleId,
            from: _types.MessageCampaignStatus.SENDING,
            to: _types.MessageCampaignStatus.CANCELED
        });
        if (!canceled) {
            throw new _emailingdomainexception.EmailingDomainException(`Campaign ${campaignId} is not sending`, _emailingdomainexception.EmailingDomainExceptionCode.MESSAGE_CAMPAIGN_NOT_CANCELABLE);
        }
        const canceledMessageCount = await this.settleDeliveries({
            workspaceId,
            criteria: {
                campaignId,
                state: _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.QUEUED
            },
            update: {
                state: _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.SKIPPED,
                skipReason: _campaignskipreasonconstant.CAMPAIGN_SKIP_REASON.CAMPAIGN_CANCELED
            }
        });
        await this.messageCampaignStatisticsService.scheduleRefresh({
            workspaceId,
            campaignId
        });
        return {
            campaignId,
            canceledMessageCount
        };
    }
    async failDeliveriesWithExpiredClaims({ workspaceId, campaignId }) {
        return this.settleDeliveries({
            workspaceId,
            criteria: {
                campaignId,
                state: _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.SENDING,
                claimExpiresAt: (0, _typeorm.LessThan)(new Date())
            },
            update: {
                state: _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.FAILED,
                failureReason: _campaignfailurereasonconstant.CAMPAIGN_FAILURE_REASON.CLAIM_EXPIRED,
                claimToken: null,
                claimExpiresAt: null
            }
        });
    }
    async settleDeliveries({ workspaceId, criteria, update }) {
        const { affected } = await this.campaignDeliveryRepository.update(workspaceId, criteria, update);
        return affected ?? 0;
    }
    async finalizeCampaignIfComplete({ workspaceId, campaignId }) {
        // Every settled delivery calls this, so the check must not scale with the
        // campaign. Counting reads every unfinished row only to compare it against
        // zero; the probe stops at the first row the partial index yields.
        const hasUnfinishedDelivery = await this.campaignDeliveryRepository.existsBy(workspaceId, {
            campaignId,
            state: (0, _typeorm.In)([
                _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.QUEUED,
                _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.SENDING
            ])
        });
        if (hasUnfinishedDelivery) {
            return;
        }
        const counts = await this.messageCampaignStatisticsService.countDeliveriesByState({
            workspaceId,
            campaignId
        });
        const terminalStatus = (0, _computecampaignterminalstatusutil.computeCampaignTerminalStatus)(counts);
        if (!(0, _utils.isDefined)(terminalStatus)) {
            return;
        }
        const correctableStatuses = terminalStatus === _types.MessageCampaignStatus.SENT ? [
            _types.MessageCampaignStatus.SENDING,
            _types.MessageCampaignStatus.SENT_WITH_ERRORS
        ] : [
            _types.MessageCampaignStatus.SENDING
        ];
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const campaignRepository = this.workspaceOrmManager.getRepository(_messagecampaignworkspaceentity.MessageCampaignWorkspaceEntity, {
                shouldBypassPermissionChecks: true
            });
            await campaignRepository.update({
                id: campaignId,
                status: (0, _typeorm.In)(correctableStatuses)
            }, {
                status: terminalStatus,
                sentAt: new Date()
            });
        }, (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId));
        await this.messageCampaignStatisticsService.persistCampaignCounts({
            workspaceId,
            campaignId,
            counts
        });
    }
    constructor(campaignDeliveryRepository, workspaceOrmManager, userRoleService, messageCampaignStatisticsService){
        this.campaignDeliveryRepository = campaignDeliveryRepository;
        this.workspaceOrmManager = workspaceOrmManager;
        this.userRoleService = userRoleService;
        this.messageCampaignStatisticsService = messageCampaignStatisticsService;
    }
};
MessageCampaignLifecycleService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_campaigndeliveryentity.CampaignDeliveryEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _userroleservice.UserRoleService === "undefined" ? Object : _userroleservice.UserRoleService,
        typeof _messagecampaignstatisticsservice.MessageCampaignStatisticsService === "undefined" ? Object : _messagecampaignstatisticsservice.MessageCampaignStatisticsService
    ])
], MessageCampaignLifecycleService);

//# sourceMappingURL=message-campaign-lifecycle.service.js.map
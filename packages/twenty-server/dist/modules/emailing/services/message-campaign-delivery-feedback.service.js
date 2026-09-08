"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessageCampaignDeliveryFeedbackService", {
    enumerable: true,
    get: function() {
        return MessageCampaignDeliveryFeedbackService;
    }
});
const _common = require("@nestjs/common");
const _campaigndeliveryentity = require("../../../engine/core-modules/emailing-domain/campaign-delivery.entity");
const _buildcampaigndeliveryoutcomeupdateutil = require("../../../engine/core-modules/emailing-domain/utils/build-campaign-delivery-outcome-update.util");
const _injectworkspacescopedrepositorydecorator = require("../../../engine/twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../../engine/twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
const _messagecampaignstatisticsservice = require("./message-campaign-statistics.service");
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
let MessageCampaignDeliveryFeedbackService = class MessageCampaignDeliveryFeedbackService {
    async recordProviderOutcomeByProviderMessageId({ workspaceId, providerMessageId, outcome }) {
        const update = (0, _buildcampaigndeliveryoutcomeupdateutil.buildCampaignDeliveryOutcomeUpdate)({
            outcome,
            occurredAt: new Date()
        });
        if (Object.keys(update).length === 0) {
            return;
        }
        // Matched and stamped in one statement rather than a lookup followed by an
        // update: providerMessageId is unique per workspace, so this settles the
        // same single row, halves the queries a webhook costs, and closes the
        // window where the row could change between the two.
        const { raw } = await this.campaignDeliveryRepository.createQueryBuilder().update().set(update).where('"workspaceId" = :workspaceId', {
            workspaceId
        }).andWhere('"providerMessageId" = :providerMessageId', {
            providerMessageId
        }).returning([
            'campaignId'
        ]).execute();
        const [updatedDelivery] = raw;
        if (!(0, _utils.isDefined)(updatedDelivery)) {
            return;
        }
        await this.messageCampaignStatisticsService.scheduleRefresh({
            workspaceId,
            campaignId: updatedDelivery.campaignId
        });
    }
    constructor(campaignDeliveryRepository, messageCampaignStatisticsService){
        this.campaignDeliveryRepository = campaignDeliveryRepository;
        this.messageCampaignStatisticsService = messageCampaignStatisticsService;
    }
};
MessageCampaignDeliveryFeedbackService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_campaigndeliveryentity.CampaignDeliveryEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _messagecampaignstatisticsservice.MessageCampaignStatisticsService === "undefined" ? Object : _messagecampaignstatisticsservice.MessageCampaignStatisticsService
    ])
], MessageCampaignDeliveryFeedbackService);

//# sourceMappingURL=message-campaign-delivery-feedback.service.js.map
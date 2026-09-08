"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReconcileWorkspaceCampaignStatsJob", {
    enumerable: true,
    get: function() {
        return ReconcileWorkspaceCampaignStatsJob;
    }
});
const _campaignconstant = require("../../../engine/core-modules/emailing-domain/constants/campaign.constant");
const _processdecorator = require("../../../engine/core-modules/message-queue/decorators/process.decorator");
const _processordecorator = require("../../../engine/core-modules/message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../engine/core-modules/message-queue/message-queue.constants");
const _messagecampaignstatisticsservice = require("../services/message-campaign-statistics.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ReconcileWorkspaceCampaignStatsJob = class ReconcileWorkspaceCampaignStatsJob {
    async handle(data) {
        await this.messageCampaignStatisticsService.reconcileWorkspaceCampaignCounts({
            workspaceId: data.workspaceId
        });
    }
    constructor(messageCampaignStatisticsService){
        this.messageCampaignStatisticsService = messageCampaignStatisticsService;
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(_campaignconstant.RECONCILE_WORKSPACE_CAMPAIGN_STATS_JOB),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof ReconcileWorkspaceCampaignStatsJobData === "undefined" ? Object : ReconcileWorkspaceCampaignStatsJobData
    ]),
    _ts_metadata("design:returntype", Promise)
], ReconcileWorkspaceCampaignStatsJob.prototype, "handle", null);
ReconcileWorkspaceCampaignStatsJob = _ts_decorate([
    (0, _processordecorator.Processor)(_messagequeueconstants.MessageQueue.campaignQueue),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _messagecampaignstatisticsservice.MessageCampaignStatisticsService === "undefined" ? Object : _messagecampaignstatisticsservice.MessageCampaignStatisticsService
    ])
], ReconcileWorkspaceCampaignStatsJob);

//# sourceMappingURL=reconcile-workspace-campaign-stats.job.js.map
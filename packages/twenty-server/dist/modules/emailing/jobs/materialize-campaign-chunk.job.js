"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MaterializeCampaignChunkJob", {
    enumerable: true,
    get: function() {
        return MaterializeCampaignChunkJob;
    }
});
const _campaignconstant = require("../../../engine/core-modules/emailing-domain/constants/campaign.constant");
const _processdecorator = require("../../../engine/core-modules/message-queue/decorators/process.decorator");
const _processordecorator = require("../../../engine/core-modules/message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../engine/core-modules/message-queue/message-queue.constants");
const _messagecampaignmaterializationservice = require("../services/message-campaign-materialization.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let MaterializeCampaignChunkJob = class MaterializeCampaignChunkJob {
    async handle(data) {
        await this.messageCampaignMaterializationService.processMaterializeChunkJob(data);
    }
    constructor(messageCampaignMaterializationService){
        this.messageCampaignMaterializationService = messageCampaignMaterializationService;
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(_campaignconstant.MATERIALIZE_CAMPAIGN_CHUNK_JOB),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof MaterializeCampaignChunkJobData === "undefined" ? Object : MaterializeCampaignChunkJobData
    ]),
    _ts_metadata("design:returntype", Promise)
], MaterializeCampaignChunkJob.prototype, "handle", null);
MaterializeCampaignChunkJob = _ts_decorate([
    (0, _processordecorator.Processor)(_messagequeueconstants.MessageQueue.campaignQueue),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _messagecampaignmaterializationservice.MessageCampaignMaterializationService === "undefined" ? Object : _messagecampaignmaterializationservice.MessageCampaignMaterializationService
    ])
], MaterializeCampaignChunkJob);

//# sourceMappingURL=materialize-campaign-chunk.job.js.map
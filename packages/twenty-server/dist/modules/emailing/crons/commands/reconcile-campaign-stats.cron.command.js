"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReconcileCampaignStatsCronCommand", {
    enumerable: true,
    get: function() {
        return ReconcileCampaignStatsCronCommand;
    }
});
const _reconcilecampaignstatscronpatternconstant = require("../../constants/reconcile-campaign-stats-cron-pattern.constant");
const _nestcommander = require("nest-commander");
const _messagequeuedecorator = require("../../../../engine/core-modules/message-queue/decorators/message-queue.decorator");
const _messagequeueconstants = require("../../../../engine/core-modules/message-queue/message-queue.constants");
const _messagequeueservice = require("../../../../engine/core-modules/message-queue/services/message-queue.service");
const _reconcilecampaignstatscronjob = require("../jobs/reconcile-campaign-stats.cron.job");
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
let ReconcileCampaignStatsCronCommand = class ReconcileCampaignStatsCronCommand extends _nestcommander.CommandRunner {
    async run() {
        await this.messageQueueService.addCron({
            jobName: _reconcilecampaignstatscronjob.ReconcileCampaignStatsCronJob.name,
            data: undefined,
            options: {
                repeat: {
                    pattern: _reconcilecampaignstatscronpatternconstant.RECONCILE_CAMPAIGN_STATS_CRON_PATTERN
                }
            }
        });
    }
    constructor(messageQueueService){
        super(), this.messageQueueService = messageQueueService;
    }
};
ReconcileCampaignStatsCronCommand = _ts_decorate([
    (0, _nestcommander.Command)({
        name: 'cron:emailing:reconcile-campaign-stats',
        description: 'Starts a cron job to recompute message campaign counters that a dropped stats refresh left stale'
    }),
    _ts_param(0, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.cronQueue)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService
    ])
], ReconcileCampaignStatsCronCommand);

//# sourceMappingURL=reconcile-campaign-stats.cron.command.js.map
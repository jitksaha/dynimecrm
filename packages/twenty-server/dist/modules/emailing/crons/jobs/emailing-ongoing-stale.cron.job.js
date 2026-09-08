"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmailingOngoingStaleCronJob", {
    enumerable: true,
    get: function() {
        return EmailingOngoingStaleCronJob;
    }
});
const _emailingongoingstalecronpatternconstant = require("../../constants/emailing-ongoing-stale-cron-pattern.constant");
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _workspace = require("twenty-shared/workspace");
const _sentrycronmonitordecorator = require("../../../../engine/core-modules/cron/sentry-cron-monitor.decorator");
const _processdecorator = require("../../../../engine/core-modules/message-queue/decorators/process.decorator");
const _processordecorator = require("../../../../engine/core-modules/message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../../engine/core-modules/message-queue/message-queue.constants");
const _workspaceentity = require("../../../../engine/core-modules/workspace/workspace.entity");
const _messagecampaignrecoveryservice = require("../../services/message-campaign-recovery.service");
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
let EmailingOngoingStaleCronJob = class EmailingOngoingStaleCronJob {
    async handle() {
        const workspaces = await this.workspaceRepository.find({
            where: {
                activationStatus: _workspace.WorkspaceActivationStatus.ACTIVE
            },
            select: [
                'id'
            ]
        });
        for (const workspace of workspaces){
            await this.messageCampaignRecoveryService.recoverOngoingStaleCampaigns({
                workspaceId: workspace.id
            }).catch((error)=>{
                this.logger.error(`[${EmailingOngoingStaleCronJob.name}] Cannot recover ongoing stale campaigns of workspace ${workspace.id}: ${error instanceof Error ? error.message : String(error)}`);
            });
        }
    }
    constructor(workspaceRepository, messageCampaignRecoveryService){
        this.workspaceRepository = workspaceRepository;
        this.messageCampaignRecoveryService = messageCampaignRecoveryService;
        this.logger = new _common.Logger(EmailingOngoingStaleCronJob.name);
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(EmailingOngoingStaleCronJob.name),
    (0, _sentrycronmonitordecorator.SentryCronMonitor)(EmailingOngoingStaleCronJob.name, _emailingongoingstalecronpatternconstant.EMAILING_ONGOING_STALE_CRON_PATTERN),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], EmailingOngoingStaleCronJob.prototype, "handle", null);
EmailingOngoingStaleCronJob = _ts_decorate([
    (0, _processordecorator.Processor)(_messagequeueconstants.MessageQueue.cronQueue),
    _ts_param(0, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _messagecampaignrecoveryservice.MessageCampaignRecoveryService === "undefined" ? Object : _messagecampaignrecoveryservice.MessageCampaignRecoveryService
    ])
], EmailingOngoingStaleCronJob);

//# sourceMappingURL=emailing-ongoing-stale.cron.job.js.map
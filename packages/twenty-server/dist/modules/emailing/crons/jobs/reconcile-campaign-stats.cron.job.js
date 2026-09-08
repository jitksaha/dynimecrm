"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReconcileCampaignStatsCronJob", {
    enumerable: true,
    get: function() {
        return ReconcileCampaignStatsCronJob;
    }
});
const _reconcilecampaignstatscronpatternconstant = require("../../constants/reconcile-campaign-stats-cron-pattern.constant");
const _campaignjobretrylimitconstant = require("../../../../engine/core-modules/emailing-domain/constants/campaign-job-retry-limit.constant");
const _campaignconstant = require("../../../../engine/core-modules/emailing-domain/constants/campaign.constant");
const _typeorm = require("@nestjs/typeorm");
const _lodashchunk = /*#__PURE__*/ _interop_require_default(require("lodash.chunk"));
const _workspace = require("twenty-shared/workspace");
const _typeorm1 = require("typeorm");
const _sentrycronmonitordecorator = require("../../../../engine/core-modules/cron/sentry-cron-monitor.decorator");
const _emailingdomainentity = require("../../../../engine/core-modules/emailing-domain/emailing-domain.entity");
const _exceptionhandlerservice = require("../../../../engine/core-modules/exception-handler/exception-handler.service");
const _messagequeuedecorator = require("../../../../engine/core-modules/message-queue/decorators/message-queue.decorator");
const _processdecorator = require("../../../../engine/core-modules/message-queue/decorators/process.decorator");
const _processordecorator = require("../../../../engine/core-modules/message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../../engine/core-modules/message-queue/message-queue.constants");
const _messagequeueservice = require("../../../../engine/core-modules/message-queue/services/message-queue.service");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
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
const ENQUEUE_BATCH_SIZE = 500;
let ReconcileCampaignStatsCronJob = class ReconcileCampaignStatsCronJob {
    async handle() {
        const workspaceIds = await this.findSendingWorkspaceIds();
        for (const workspaceIdsBatch of (0, _lodashchunk.default)(workspaceIds, ENQUEUE_BATCH_SIZE)){
            await this.messageQueueService.bulkAdd(_campaignconstant.RECONCILE_WORKSPACE_CAMPAIGN_STATS_JOB, workspaceIdsBatch.map((workspaceId)=>({
                    workspaceId
                })), {
                retryLimit: _campaignjobretrylimitconstant.CAMPAIGN_JOB_RETRY_LIMIT
            }).catch((error)=>{
                this.exceptionHandlerService.captureExceptions([
                    error
                ]);
            });
        }
    }
    async findSendingWorkspaceIds() {
        const emailingDomains = await this.emailingDomainRepository.find({
            select: {
                workspaceId: true
            },
            where: {
                workspace: {
                    deletedAt: (0, _typeorm1.IsNull)(),
                    activationStatus: _workspace.WorkspaceActivationStatus.ACTIVE
                }
            }
        });
        return [
            ...new Set(emailingDomains.map(({ workspaceId })=>workspaceId))
        ];
    }
    constructor(emailingDomainRepository, messageQueueService, exceptionHandlerService){
        this.emailingDomainRepository = emailingDomainRepository;
        this.messageQueueService = messageQueueService;
        this.exceptionHandlerService = exceptionHandlerService;
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(ReconcileCampaignStatsCronJob.name),
    (0, _sentrycronmonitordecorator.SentryCronMonitor)(ReconcileCampaignStatsCronJob.name, _reconcilecampaignstatscronpatternconstant.RECONCILE_CAMPAIGN_STATS_CRON_PATTERN),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], ReconcileCampaignStatsCronJob.prototype, "handle", null);
ReconcileCampaignStatsCronJob = _ts_decorate([
    (0, _processordecorator.Processor)(_messagequeueconstants.MessageQueue.cronQueue),
    _ts_param(0, (0, _typeorm.InjectRepository)(_emailingdomainentity.EmailingDomainEntity)),
    _ts_param(1, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.campaignQueue)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService,
        typeof _exceptionhandlerservice.ExceptionHandlerService === "undefined" ? Object : _exceptionhandlerservice.ExceptionHandlerService
    ])
], ReconcileCampaignStatsCronJob);

//# sourceMappingURL=reconcile-campaign-stats.cron.job.js.map
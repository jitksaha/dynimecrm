"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get MESSAGING_ONGOING_STALE_CRON_PATTERN () {
        return MESSAGING_ONGOING_STALE_CRON_PATTERN;
    },
    get MessagingOngoingStaleCronJob () {
        return MessagingOngoingStaleCronJob;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _workspace = require("twenty-shared/workspace");
const _typeorm1 = require("typeorm");
const _sentrycronmonitordecorator = require("../../../../../engine/core-modules/cron/sentry-cron-monitor.decorator");
const _exceptionhandlerservice = require("../../../../../engine/core-modules/exception-handler/exception-handler.service");
const _messagequeuedecorator = require("../../../../../engine/core-modules/message-queue/decorators/message-queue.decorator");
const _processdecorator = require("../../../../../engine/core-modules/message-queue/decorators/process.decorator");
const _processordecorator = require("../../../../../engine/core-modules/message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../../../engine/core-modules/message-queue/message-queue.constants");
const _messagequeueservice = require("../../../../../engine/core-modules/message-queue/services/message-queue.service");
const _messagechannelentity = require("../../../../../engine/metadata-modules/message-channel/entities/message-channel.entity");
const _messagingimportongoingsynctimeoutconstant = require("../../constants/messaging-import-ongoing-sync-timeout.constant");
const _messagingongoingstalesyncstagesconstant = require("../../constants/messaging-ongoing-stale-sync-stages.constant");
const _messagingongoingstalejob = require("../../jobs/messaging-ongoing-stale.job");
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
const MESSAGING_ONGOING_STALE_CRON_PATTERN = '0 * * * *';
let MessagingOngoingStaleCronJob = class MessagingOngoingStaleCronJob {
    async handle() {
        const staleWorkspaceIds = await this.findStaleWorkspaceIds();
        for (const workspaceId of staleWorkspaceIds){
            try {
                await this.messageQueueService.add(_messagingongoingstalejob.MessagingOngoingStaleJob.name, {
                    workspaceId
                });
            } catch (error) {
                this.exceptionHandlerService.captureExceptions([
                    error
                ], {
                    workspace: {
                        id: workspaceId
                    }
                });
            }
        }
    }
    async findStaleWorkspaceIds() {
        const staleBefore = new Date(Date.now() - _messagingimportongoingsynctimeoutconstant.MESSAGING_IMPORT_ONGOING_SYNC_TIMEOUT);
        const staleChannels = await this.messageChannelRepository.find({
            select: {
                workspaceId: true
            },
            where: {
                syncStage: (0, _typeorm1.In)(_messagingongoingstalesyncstagesconstant.MESSAGING_ONGOING_STALE_SYNC_STAGES),
                syncStageStartedAt: (0, _typeorm1.Or)((0, _typeorm1.IsNull)(), (0, _typeorm1.LessThan)(staleBefore)),
                workspace: {
                    deletedAt: (0, _typeorm1.IsNull)(),
                    activationStatus: _workspace.WorkspaceActivationStatus.ACTIVE
                }
            }
        });
        return [
            ...new Set(staleChannels.map(({ workspaceId })=>workspaceId))
        ];
    }
    constructor(messageChannelRepository, messageQueueService, exceptionHandlerService){
        this.messageChannelRepository = messageChannelRepository;
        this.messageQueueService = messageQueueService;
        this.exceptionHandlerService = exceptionHandlerService;
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(MessagingOngoingStaleCronJob.name),
    (0, _sentrycronmonitordecorator.SentryCronMonitor)(MessagingOngoingStaleCronJob.name, MESSAGING_ONGOING_STALE_CRON_PATTERN),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], MessagingOngoingStaleCronJob.prototype, "handle", null);
MessagingOngoingStaleCronJob = _ts_decorate([
    (0, _processordecorator.Processor)(_messagequeueconstants.MessageQueue.cronQueue),
    _ts_param(0, (0, _typeorm.InjectRepository)(_messagechannelentity.MessageChannelEntity)),
    _ts_param(1, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.messagingQueue)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService,
        typeof _exceptionhandlerservice.ExceptionHandlerService === "undefined" ? Object : _exceptionhandlerservice.ExceptionHandlerService
    ])
], MessagingOngoingStaleCronJob);

//# sourceMappingURL=messaging-ongoing-stale.cron.job.js.map
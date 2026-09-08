"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PendingFileCleanupCronJob", {
    enumerable: true,
    get: function() {
        return PendingFileCleanupCronJob;
    }
});
const _common = require("@nestjs/common");
const _sentrycronmonitordecorator = require("../../../../cron/sentry-cron-monitor.decorator");
const _exceptionhandlerservice = require("../../../../exception-handler/exception-handler.service");
const _pendingfilecleanupconstants = require("../constants/pending-file-cleanup.constants");
const _pendingfilecleanupservice = require("../../services/pending-file-cleanup.service");
const _processdecorator = require("../../../../message-queue/decorators/process.decorator");
const _processordecorator = require("../../../../message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../../message-queue/message-queue.constants");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let PendingFileCleanupCronJob = class PendingFileCleanupCronJob {
    async handle() {
        try {
            const deletedCount = await this.pendingFileCleanupService.cleanupStalePendingFiles();
            if (deletedCount > 0) {
                this.logger.log(`Pending file cleanup completed: ${deletedCount} stale file(s) deleted`);
            }
        } catch (error) {
            this.exceptionHandlerService.captureExceptions([
                error
            ]);
            throw error;
        }
    }
    constructor(pendingFileCleanupService, exceptionHandlerService){
        this.pendingFileCleanupService = pendingFileCleanupService;
        this.exceptionHandlerService = exceptionHandlerService;
        this.logger = new _common.Logger(PendingFileCleanupCronJob.name);
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(PendingFileCleanupCronJob.name),
    (0, _sentrycronmonitordecorator.SentryCronMonitor)(PendingFileCleanupCronJob.name, _pendingfilecleanupconstants.PENDING_FILE_CLEANUP_CRON_PATTERN),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], PendingFileCleanupCronJob.prototype, "handle", null);
PendingFileCleanupCronJob = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _processordecorator.Processor)(_messagequeueconstants.MessageQueue.cronQueue),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _pendingfilecleanupservice.PendingFileCleanupService === "undefined" ? Object : _pendingfilecleanupservice.PendingFileCleanupService,
        typeof _exceptionhandlerservice.ExceptionHandlerService === "undefined" ? Object : _exceptionhandlerservice.ExceptionHandlerService
    ])
], PendingFileCleanupCronJob);

//# sourceMappingURL=pending-file-cleanup.cron.job.js.map
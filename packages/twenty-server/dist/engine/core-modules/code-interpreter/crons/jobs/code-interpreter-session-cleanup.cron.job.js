"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CodeInterpreterSessionCleanupCronJob", {
    enumerable: true,
    get: function() {
        return CodeInterpreterSessionCleanupCronJob;
    }
});
const _common = require("@nestjs/common");
const _codeinterpreterservice = require("../../code-interpreter.service");
const _codeinterpretersessioncleanupcronpatternconstant = require("../../constants/code-interpreter-session-cleanup-cron-pattern.constant");
const _sentrycronmonitordecorator = require("../../../cron/sentry-cron-monitor.decorator");
const _processdecorator = require("../../../message-queue/decorators/process.decorator");
const _processordecorator = require("../../../message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../message-queue/message-queue.constants");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CodeInterpreterSessionCleanupCronJob = class CodeInterpreterSessionCleanupCronJob {
    async handle() {
        const reclaimedCount = await this.codeInterpreterService.sweepExpiredSandboxes();
        if (reclaimedCount > 0) {
            this.logger.log(`Reclaimed ${reclaimedCount} expired code interpreter sandbox(es)`);
        }
    }
    constructor(codeInterpreterService){
        this.codeInterpreterService = codeInterpreterService;
        this.logger = new _common.Logger(CodeInterpreterSessionCleanupCronJob.name);
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(CodeInterpreterSessionCleanupCronJob.name),
    (0, _sentrycronmonitordecorator.SentryCronMonitor)(CodeInterpreterSessionCleanupCronJob.name, _codeinterpretersessioncleanupcronpatternconstant.CODE_INTERPRETER_SESSION_CLEANUP_CRON_PATTERN),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], CodeInterpreterSessionCleanupCronJob.prototype, "handle", null);
CodeInterpreterSessionCleanupCronJob = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _processordecorator.Processor)(_messagequeueconstants.MessageQueue.cronQueue),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _codeinterpreterservice.CodeInterpreterService === "undefined" ? Object : _codeinterpreterservice.CodeInterpreterService
    ])
], CodeInterpreterSessionCleanupCronJob);

//# sourceMappingURL=code-interpreter-session-cleanup.cron.job.js.map
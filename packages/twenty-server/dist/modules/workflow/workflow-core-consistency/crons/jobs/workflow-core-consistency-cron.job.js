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
    get WORKFLOW_CORE_CONSISTENCY_CRON_PATTERN () {
        return WORKFLOW_CORE_CONSISTENCY_CRON_PATTERN;
    },
    get WorkflowCoreConsistencyCronJob () {
        return WorkflowCoreConsistencyCronJob;
    }
});
const _common = require("@nestjs/common");
const _sentrycronmonitordecorator = require("../../../../../engine/core-modules/cron/sentry-cron-monitor.decorator");
const _processdecorator = require("../../../../../engine/core-modules/message-queue/decorators/process.decorator");
const _processordecorator = require("../../../../../engine/core-modules/message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../../../engine/core-modules/message-queue/message-queue.constants");
const _workflowcoreconsistencyservice = require("../../services/workflow-core-consistency.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const WORKFLOW_CORE_CONSISTENCY_CRON_PATTERN = '0 */3 * * *';
let WorkflowCoreConsistencyCronJob = class WorkflowCoreConsistencyCronJob {
    async handle() {
        this.logger.log('WorkflowCoreConsistencyCronJob started');
        await this.workflowCoreConsistencyService.runConsistencyCheck();
        this.logger.log('WorkflowCoreConsistencyCronJob completed');
    }
    constructor(workflowCoreConsistencyService){
        this.workflowCoreConsistencyService = workflowCoreConsistencyService;
        this.logger = new _common.Logger(WorkflowCoreConsistencyCronJob.name);
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(WorkflowCoreConsistencyCronJob.name),
    (0, _sentrycronmonitordecorator.SentryCronMonitor)(WorkflowCoreConsistencyCronJob.name, WORKFLOW_CORE_CONSISTENCY_CRON_PATTERN),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], WorkflowCoreConsistencyCronJob.prototype, "handle", null);
WorkflowCoreConsistencyCronJob = _ts_decorate([
    (0, _processordecorator.Processor)(_messagequeueconstants.MessageQueue.cronQueue),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workflowcoreconsistencyservice.WorkflowCoreConsistencyService === "undefined" ? Object : _workflowcoreconsistencyservice.WorkflowCoreConsistencyService
    ])
], WorkflowCoreConsistencyCronJob);

//# sourceMappingURL=workflow-core-consistency-cron.job.js.map
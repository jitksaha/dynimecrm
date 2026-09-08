"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UpgradeApplicationsJob", {
    enumerable: true,
    get: function() {
        return UpgradeApplicationsJob;
    }
});
const _applicationupgradeservice = require("../application-upgrade/application-upgrade.service");
const _upgradeapplicationsjobconstants = require("./upgrade-applications.job-constants");
const _processdecorator = require("../../message-queue/decorators/process.decorator");
const _processordecorator = require("../../message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../message-queue/message-queue.constants");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UpgradeApplicationsJob = class UpgradeApplicationsJob {
    async handle(data) {
        await this.applicationUpgradeService.upgradeAllApplications({
            applicationRegistrationId: data.applicationRegistrationId,
            onlyAutoUpgrade: data.onlyAutoUpgrade
        });
    }
    constructor(applicationUpgradeService){
        this.applicationUpgradeService = applicationUpgradeService;
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(_upgradeapplicationsjobconstants.UPGRADE_APPLICATIONS_JOB_NAME),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof UpgradeApplicationsJobData === "undefined" ? Object : UpgradeApplicationsJobData
    ]),
    _ts_metadata("design:returntype", Promise)
], UpgradeApplicationsJob.prototype, "handle", null);
UpgradeApplicationsJob = _ts_decorate([
    (0, _processordecorator.Processor)(_messagequeueconstants.MessageQueue.workspaceQueue),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _applicationupgradeservice.ApplicationUpgradeService === "undefined" ? Object : _applicationupgradeservice.ApplicationUpgradeService
    ])
], UpgradeApplicationsJob);

//# sourceMappingURL=upgrade-applications.job.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "InstallPreInstalledAppsJob", {
    enumerable: true,
    get: function() {
        return InstallPreInstalledAppsJob;
    }
});
const _common = require("@nestjs/common");
const _installpreinstalledappsjobconstants = require("./install-pre-installed-apps.job-constants");
const _preinstalledappsservice = require("../pre-installed-apps.service");
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
let InstallPreInstalledAppsJob = class InstallPreInstalledAppsJob {
    async handle({ workspaceId }) {
        this.logger.log(`Installing pre-installed apps on workspace ${workspaceId}`);
        await this.preInstalledAppsService.installOnWorkspace(workspaceId);
    }
    constructor(preInstalledAppsService){
        this.preInstalledAppsService = preInstalledAppsService;
        this.logger = new _common.Logger(InstallPreInstalledAppsJob.name);
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(_installpreinstalledappsjobconstants.INSTALL_PRE_INSTALLED_APPS_JOB_NAME),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof InstallPreInstalledAppsJobData === "undefined" ? Object : InstallPreInstalledAppsJobData
    ]),
    _ts_metadata("design:returntype", Promise)
], InstallPreInstalledAppsJob.prototype, "handle", null);
InstallPreInstalledAppsJob = _ts_decorate([
    (0, _processordecorator.Processor)(_messagequeueconstants.MessageQueue.workspaceQueue),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _preinstalledappsservice.PreInstalledAppsService === "undefined" ? Object : _preinstalledappsservice.PreInstalledAppsService
    ])
], InstallPreInstalledAppsJob);

//# sourceMappingURL=install-pre-installed-apps.job.js.map
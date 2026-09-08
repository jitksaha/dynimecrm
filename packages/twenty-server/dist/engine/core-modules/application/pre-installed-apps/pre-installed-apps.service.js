"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PreInstalledAppsService", {
    enumerable: true,
    get: function() {
        return PreInstalledAppsService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _workspaceiteratorservice = require("../../../../database/commands/command-runners/workspace-iterator.service");
const _applicationinstallservice = require("../application-install/application-install.service");
const _applicationregistrationentity = require("../application-registration/application-registration.entity");
const _applicationexception = require("../application.exception");
const _installpreinstalledappsjobconstants = require("./jobs/install-pre-installed-apps.job-constants");
const _messagequeuedecorator = require("../../message-queue/decorators/message-queue.decorator");
const _messagequeueconstants = require("../../message-queue/message-queue.constants");
const _messagequeueservice = require("../../message-queue/services/message-queue.service");
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
let PreInstalledAppsService = class PreInstalledAppsService {
    async enqueueInstallOnWorkspace(workspaceId) {
        await this.messageQueueService.add(_installpreinstalledappsjobconstants.INSTALL_PRE_INSTALLED_APPS_JOB_NAME, {
            workspaceId
        }, {
            id: `${_installpreinstalledappsjobconstants.INSTALL_PRE_INSTALLED_APPS_JOB_NAME}-${workspaceId}`
        });
    }
    // Per-app failures are logged but never block the other installs —
    // `ApplicationInstallService` holds a per-app cache lock so parallel
    // installs are safe.
    async installOnWorkspace(workspaceId) {
        const registrations = await this.applicationRegistrationRepository.find({
            where: {
                isPreInstalled: true
            }
        });
        if (registrations.length === 0) {
            return;
        }
        await Promise.allSettled(registrations.map(async (registration)=>{
            try {
                await this.applicationInstallService.installApplication({
                    appRegistrationId: registration.id,
                    workspaceId
                });
            } catch (error) {
                this.logger.error(`Failed to install pre-installed app "${registration.name}" (${registration.id}) on workspace ${workspaceId}: ${error instanceof Error ? error.message : String(error)}`);
            }
        }));
    }
    async backfillApplicationOnAllWorkspaces(applicationRegistrationId) {
        const registration = await this.applicationRegistrationRepository.findOne({
            where: {
                id: applicationRegistrationId,
                isPreInstalled: true
            }
        });
        if (!registration) {
            throw new _applicationexception.ApplicationException(`Pre-installed application registration with id ${applicationRegistrationId} not found`, _applicationexception.ApplicationExceptionCode.APPLICATION_NOT_FOUND);
        }
        const report = await this.workspaceIteratorService.iterate({
            callback: async ({ workspaceId })=>{
                try {
                    await this.applicationInstallService.installApplication({
                        appRegistrationId: registration.id,
                        workspaceId
                    });
                } catch (error) {
                    if (error instanceof _applicationexception.ApplicationException && error.code === _applicationexception.ApplicationExceptionCode.APP_ALREADY_INSTALLED) {
                        return;
                    }
                    throw error;
                }
            }
        });
        this.logger.log(`Backfilled app "${registration.name}" (${registration.id}): ${report.success.length} succeeded, ${report.fail.length} failed`);
    }
    constructor(applicationInstallService, applicationRegistrationRepository, workspaceIteratorService, messageQueueService){
        this.applicationInstallService = applicationInstallService;
        this.applicationRegistrationRepository = applicationRegistrationRepository;
        this.workspaceIteratorService = workspaceIteratorService;
        this.messageQueueService = messageQueueService;
        this.logger = new _common.Logger(PreInstalledAppsService.name);
    }
};
PreInstalledAppsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(1, (0, _typeorm.InjectRepository)(_applicationregistrationentity.ApplicationRegistrationEntity)),
    _ts_param(3, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.workspaceQueue)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _applicationinstallservice.ApplicationInstallService === "undefined" ? Object : _applicationinstallservice.ApplicationInstallService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService
    ])
], PreInstalledAppsService);

//# sourceMappingURL=pre-installed-apps.service.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "InstallOnboardingAppsJob", {
    enumerable: true,
    get: function() {
        return InstallOnboardingAppsJob;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _applicationinstallservice = require("../../application/application-install/application-install.service");
const _applicationregistrationservice = require("../../application/application-registration/application-registration.service");
const _processdecorator = require("../../message-queue/decorators/process.decorator");
const _processordecorator = require("../../message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../message-queue/message-queue.constants");
const _installonboardingappsjobconstants = require("./install-onboarding-apps.job-constants");
const _onboardingservice = require("../onboarding.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let InstallOnboardingAppsJob = class InstallOnboardingAppsJob {
    async handle({ workspaceId, universalIdentifiers, userId }) {
        let installedAppsCount = 0;
        for (const universalIdentifier of universalIdentifiers){
            const hasInstalledApp = await this.installApp({
                universalIdentifier,
                workspaceId
            });
            if (hasInstalledApp) {
                installedAppsCount += 1;
            }
        }
        if (installedAppsCount === 0) {
            return;
        }
        await this.onboardingService.creditInstallAppsReward({
            workspaceId,
            rewardAppsCount: installedAppsCount
        });
        if ((0, _utils.isDefined)(userId)) {
            await this.onboardingService.clearReversibleOnboardingStepHistoryAfterAppsInstalled({
                userId,
                workspaceId
            });
        }
    }
    async installApp({ universalIdentifier, workspaceId }) {
        try {
            const registration = await this.applicationRegistrationService.findOneByUniversalIdentifier(universalIdentifier);
            if (!(0, _utils.isDefined)(registration)) {
                this.logger.error(`Onboarding app ${universalIdentifier} not found while installing for workspace ${workspaceId}`);
                return false;
            }
            await this.applicationInstallService.installApplication({
                appRegistrationId: registration.id,
                workspaceId
            });
            return true;
        } catch (error) {
            this.logger.error(`Failed to install onboarding app ${universalIdentifier} for workspace ${workspaceId}`, error);
            return false;
        }
    }
    constructor(applicationRegistrationService, applicationInstallService, onboardingService){
        this.applicationRegistrationService = applicationRegistrationService;
        this.applicationInstallService = applicationInstallService;
        this.onboardingService = onboardingService;
        this.logger = new _common.Logger(InstallOnboardingAppsJob.name);
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(_installonboardingappsjobconstants.INSTALL_ONBOARDING_APPS_JOB_NAME),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof InstallOnboardingAppsJobData === "undefined" ? Object : InstallOnboardingAppsJobData
    ]),
    _ts_metadata("design:returntype", Promise)
], InstallOnboardingAppsJob.prototype, "handle", null);
InstallOnboardingAppsJob = _ts_decorate([
    (0, _processordecorator.Processor)(_messagequeueconstants.MessageQueue.workspaceQueue),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _applicationregistrationservice.ApplicationRegistrationService === "undefined" ? Object : _applicationregistrationservice.ApplicationRegistrationService,
        typeof _applicationinstallservice.ApplicationInstallService === "undefined" ? Object : _applicationinstallservice.ApplicationInstallService,
        typeof _onboardingservice.OnboardingService === "undefined" ? Object : _onboardingservice.OnboardingService
    ])
], InstallOnboardingAppsJob);

//# sourceMappingURL=install-onboarding-apps.job.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationUpgradeService", {
    enumerable: true,
    get: function() {
        return ApplicationUpgradeService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _axios = /*#__PURE__*/ _interop_require_default(require("axios"));
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _zod = require("zod");
const _workspaceiteratorservice = require("../../../../database/commands/command-runners/workspace-iterator.service");
const _applicationinstallservice = require("../application-install/application-install.service");
const _applicationregistrationentity = require("../application-registration/application-registration.entity");
const _applicationregistrationservice = require("../application-registration/application-registration.service");
const _applicationregistrationsourcetypeenum = require("../application-registration/enums/application-registration-source-type.enum");
const _applicationentity = require("../application.entity");
const _applicationexception = require("../application.exception");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
const _workspaceversionservice = require("../../../workspace-manager/workspace-version/services/workspace-version.service");
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
const npmPackageMetadataSchema = _zod.z.object({
    version: _zod.z.string()
});
let ApplicationUpgradeService = class ApplicationUpgradeService {
    async checkForUpdates(appRegistration) {
        if (appRegistration.sourceType !== _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.NPM) {
            return null;
        }
        const registryUrl = this.twentyConfigService.get('APP_REGISTRY_URL');
        if (!appRegistration.sourcePackage) {
            return null;
        }
        try {
            const encodedPackage = encodeURIComponent(appRegistration.sourcePackage);
            const { data } = await _axios.default.get(`${registryUrl}/${encodedPackage}/latest`, {
                headers: {
                    'User-Agent': 'Twenty-AppUpgrade'
                },
                timeout: 10_000
            });
            const parsed = npmPackageMetadataSchema.safeParse(data);
            if (!parsed.success) {
                this.logger.warn(`Unexpected response shape from registry for ${appRegistration.sourcePackage}`);
                return null;
            }
            const isNewVersion = await this.applicationRegistrationService.setLatestAvailableVersionIfChanged(appRegistration.id, parsed.data.version);
            if (isNewVersion) {
                this.applicationRegistrationService.emitRegistrationPublishMetric({
                    isNewRegistration: false,
                    universalIdentifier: appRegistration.universalIdentifier,
                    name: appRegistration.name,
                    sourceType: appRegistration.sourceType,
                    version: parsed.data.version
                });
                await this.applicationRegistrationService.enqueueAutoUpgradeApplications(appRegistration.id);
            }
            return parsed.data.version;
        } catch (error) {
            this.logger.warn(`Failed to check updates for ${appRegistration.sourcePackage}: ${error}`);
            return null;
        }
    }
    async checkAllForUpdates() {
        const npmRegistrations = await this.appRegistrationRepository.find({
            where: {
                sourceType: _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.NPM
            }
        });
        for (const registration of npmRegistrations){
            await this.checkForUpdates(registration);
        }
    }
    async findApplicationsToUpgrade({ applicationRegistrationId, onlyAutoUpgrade = false, workspaceIds, workspaceCountLimit }) {
        const appRegistration = await this.appRegistrationRepository.findOneOrFail({
            where: {
                id: applicationRegistrationId
            }
        });
        const targetVersion = appRegistration.latestAvailableVersion;
        if (!(0, _utils.isDefined)(targetVersion)) {
            return {
                appRegistration,
                targetVersion: null,
                applicationsToUpgrade: [],
                skippedNonProvisionedWorkspaceIds: []
            };
        }
        const applications = await this.applicationRepository.find({
            where: {
                applicationRegistrationId,
                ...onlyAutoUpgrade ? {
                    autoUpgrade: true
                } : {},
                ...(0, _utils.isNonEmptyArray)(workspaceIds) ? {
                    workspaceId: (0, _typeorm1.In)(workspaceIds)
                } : {}
            }
        });
        const outdatedApplications = applications.filter((application)=>application.version !== targetVersion);
        const provisionedWorkspaceIds = new Set(await this.workspaceVersionService.getProvisionedWorkspaceIds());
        const provisionedApplications = outdatedApplications.filter((application)=>provisionedWorkspaceIds.has(application.workspaceId));
        const skippedNonProvisionedWorkspaceIds = outdatedApplications.filter((application)=>!provisionedWorkspaceIds.has(application.workspaceId)).map((application)=>application.workspaceId);
        const applicationsToUpgrade = (0, _utils.isDefined)(workspaceCountLimit) ? provisionedApplications.slice(0, workspaceCountLimit) : provisionedApplications;
        return {
            appRegistration,
            targetVersion,
            applicationsToUpgrade,
            skippedNonProvisionedWorkspaceIds
        };
    }
    async upgradeApplications({ appRegistration, targetVersion, applications }) {
        // An empty workspace id list makes the iterator fall back to every
        // provisioned workspace, which would upgrade workspaces that were
        // filtered out.
        if (!(0, _utils.isNonEmptyArray)(applications)) {
            return {
                success: [],
                fail: [],
                interrupted: false
            };
        }
        return this.workspaceIteratorService.iterate({
            workspaceIds: applications.map((application)=>application.workspaceId),
            callback: async ({ workspaceId })=>{
                await this.upgradeApplicationToVersion({
                    appRegistration,
                    targetVersion,
                    workspaceId
                });
            }
        });
    }
    async upgradeAllApplications({ applicationRegistrationId, onlyAutoUpgrade = false, workspaceIds, workspaceCountLimit }) {
        const { appRegistration, targetVersion, applicationsToUpgrade } = await this.findApplicationsToUpgrade({
            applicationRegistrationId,
            onlyAutoUpgrade,
            workspaceIds,
            workspaceCountLimit
        });
        if (!(0, _utils.isDefined)(targetVersion)) {
            return;
        }
        await this.upgradeApplications({
            appRegistration,
            targetVersion,
            applications: applicationsToUpgrade
        });
    }
    async upgradeApplication(params) {
        const appRegistration = await this.appRegistrationRepository.findOneOrFail({
            where: {
                id: params.appRegistrationId
            }
        });
        return this.upgradeApplicationToVersion({
            appRegistration,
            targetVersion: params.targetVersion,
            workspaceId: params.workspaceId,
            skipWorkspaceCompatibilityCheck: params.skipWorkspaceCompatibilityCheck
        });
    }
    async upgradeApplicationToVersion(params) {
        const { appRegistration } = params;
        // LOCAL apps are updated by dev sync and OAUTH_ONLY registrations have no
        // code artifacts.
        if (appRegistration.sourceType === _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.LOCAL || appRegistration.sourceType === _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.OAUTH_ONLY) {
            throw new _applicationexception.ApplicationException('Cannot upgrade an app installed from a local source or OAuth-only registration', _applicationexception.ApplicationExceptionCode.UPGRADE_FAILED);
        }
        try {
            return await this.applicationInstallService.installApplication({
                appRegistrationId: appRegistration.id,
                version: params.targetVersion,
                workspaceId: params.workspaceId,
                skipWorkspaceCompatibilityCheck: params.skipWorkspaceCompatibilityCheck
            });
        } catch (error) {
            const appName = appRegistration.sourcePackage ?? appRegistration.universalIdentifier;
            this.logger.error(`Upgrade failed for ${appName}`, error);
            if (error instanceof _applicationexception.ApplicationException) {
                throw error;
            }
            throw new _applicationexception.ApplicationException(`Upgrade failed for ${appName}`, _applicationexception.ApplicationExceptionCode.UPGRADE_FAILED);
        }
    }
    constructor(appRegistrationRepository, applicationRepository, applicationInstallService, applicationRegistrationService, twentyConfigService, workspaceIteratorService, workspaceVersionService){
        this.appRegistrationRepository = appRegistrationRepository;
        this.applicationRepository = applicationRepository;
        this.applicationInstallService = applicationInstallService;
        this.applicationRegistrationService = applicationRegistrationService;
        this.twentyConfigService = twentyConfigService;
        this.workspaceIteratorService = workspaceIteratorService;
        this.workspaceVersionService = workspaceVersionService;
        this.logger = new _common.Logger(ApplicationUpgradeService.name);
    }
};
ApplicationUpgradeService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_applicationregistrationentity.ApplicationRegistrationEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_applicationentity.ApplicationEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _applicationinstallservice.ApplicationInstallService === "undefined" ? Object : _applicationinstallservice.ApplicationInstallService,
        typeof _applicationregistrationservice.ApplicationRegistrationService === "undefined" ? Object : _applicationregistrationservice.ApplicationRegistrationService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _workspaceversionservice.WorkspaceVersionService === "undefined" ? Object : _workspaceversionservice.WorkspaceVersionService
    ])
], ApplicationUpgradeService);

//# sourceMappingURL=application-upgrade.service.js.map
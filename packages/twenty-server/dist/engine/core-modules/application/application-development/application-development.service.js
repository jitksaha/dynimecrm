"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationDevelopmentService", {
    enumerable: true,
    get: function() {
        return ApplicationDevelopmentService;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _applicationdevelopmentconstants = require("./constants/application-development.constants");
const _applicationmanifestapplyservice = require("../application-manifest/application-manifest-apply.service");
const _applicationsyncservice = require("../application-manifest/application-sync.service");
const _applicationversionvalidationservice = require("../application-package/application-version-validation.service");
const _versionreasontoexceptioncodeconstant = require("../application-package/constants/version-reason-to-exception-code.constant");
const _applicationregistrationassetservice = require("../application-registration/application-registration-asset.service");
const _applicationregistrationservice = require("../application-registration/application-registration.service");
const _applicationregistrationsourcetypeenum = require("../application-registration/enums/application-registration-source-type.enum");
const _applicationexception = require("../application.exception");
const _applicationservice = require("../application.service");
const _cachelockservice = require("../../cache-lock/cache-lock.service");
const _throttlerservice = require("../../throttler/throttler.service");
const _filestorageservice = require("../../file-storage/services/file-storage.service");
const _validatefilepathutil = require("../../file-storage/utils/validate-file-path.util");
const _streamtobuffer = require("../../../../utils/stream-to-buffer");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const APP_SYNC_LOCK_OPTIONS = {
    ttl: 60_000,
    ms: 500,
    maxRetries: 120
};
let ApplicationDevelopmentService = class ApplicationDevelopmentService {
    async createDevelopmentApplication({ universalIdentifier, name, workspaceId }) {
        await this.throttlePerApplication(universalIdentifier, workspaceId);
        const applicationRegistrationId = await this.findApplicationRegistrationId(universalIdentifier);
        const existing = await this.applicationService.findByUniversalIdentifier({
            universalIdentifier,
            workspaceId
        });
        if (existing) {
            return {
                id: existing.id,
                universalIdentifier: existing.universalIdentifier
            };
        }
        const application = await this.applicationService.create({
            universalIdentifier,
            name,
            sourcePath: universalIdentifier,
            sourceType: _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.LOCAL,
            applicationRegistrationId,
            workspaceId
        });
        return {
            id: application.id,
            universalIdentifier: application.universalIdentifier
        };
    }
    async syncApplication({ manifest, dryRun, workspaceId }) {
        await this.throttlePerApplication(manifest.application.universalIdentifier, workspaceId);
        const versionValidation = await this.applicationVersionValidationService.validateWorkspaceCompatibility({
            requiredServerVersion: manifest.application.requiredServerVersionRange ?? undefined,
            workspaceId
        });
        if (!versionValidation.compatible) {
            throw new _applicationexception.ApplicationException(versionValidation.message, _versionreasontoexceptioncodeconstant.VERSION_REASON_TO_APPLICATION_EXCEPTION_CODE[versionValidation.reason]);
        }
        if (dryRun === true) {
            const { workspaceMigration } = await this.applicationSyncService.synchronizeFromManifest({
                workspaceId,
                manifest,
                dryRun: true
            });
            return {
                applicationUniversalIdentifier: workspaceMigration.applicationUniversalIdentifier,
                actions: workspaceMigration.actions
            };
        }
        return this.cacheLockService.withLock(()=>this.applyManifestSync(manifest, workspaceId), `app-sync:${workspaceId}`, APP_SYNC_LOCK_OPTIONS);
    }
    async uploadApplicationFile({ workspaceId, applicationUniversalIdentifier, fileFolder, filePath, getFileBuffer }) {
        await this.throttlePerApplication(applicationUniversalIdentifier, workspaceId);
        if (!_applicationdevelopmentconstants.ALLOWED_APPLICATION_FILE_FOLDERS.includes(fileFolder)) {
            throw new _applicationexception.ApplicationException(`Invalid fileFolder for application file upload. Allowed values: ${_applicationdevelopmentconstants.ALLOWED_APPLICATION_FILE_FOLDERS.join(', ')}`, _applicationexception.ApplicationExceptionCode.INVALID_INPUT);
        }
        const pathValidationResult = (0, _validatefilepathutil.validateFilePath)({
            resourcePath: filePath,
            fileFolder
        });
        if (!pathValidationResult.isValid) {
            throw new _applicationexception.ApplicationException(pathValidationResult.error, _applicationexception.ApplicationExceptionCode.INVALID_INPUT);
        }
        const application = await this.applicationService.findByUniversalIdentifier({
            universalIdentifier: applicationUniversalIdentifier,
            workspaceId
        });
        if (!(0, _utils.isDefined)(application)) {
            throw new _applicationexception.ApplicationException('Application not found in workspace.', _applicationexception.ApplicationExceptionCode.APPLICATION_NOT_FOUND);
        }
        return await this.fileStorageService.writeFile({
            sourceFile: await getFileBuffer(),
            fileFolder,
            applicationUniversalIdentifier,
            workspaceId,
            resourcePath: filePath,
            settings: {
                isTemporaryFile: false,
                toDelete: false
            }
        });
    }
    async applyManifestSync(manifest, workspaceId) {
        const applicationRegistrationId = await this.findApplicationRegistrationId(manifest.application.universalIdentifier);
        const application = await this.applicationService.findByUniversalIdentifier({
            universalIdentifier: manifest.application.universalIdentifier,
            workspaceId
        });
        if (!(0, _utils.isDefined)(application)) {
            throw new _applicationexception.ApplicationException(`Application "${manifest.application.universalIdentifier}" not found in workspace "${workspaceId}". Run createDevelopmentApplication first.`, _applicationexception.ApplicationExceptionCode.APPLICATION_NOT_FOUND);
        }
        const { workspaceMigration } = await this.applicationManifestApplyService.applyManifestToWorkspace({
            workspaceId,
            manifest,
            applicationRegistrationId,
            application
        });
        await this.syncRegistrationMetadata(applicationRegistrationId, manifest, workspaceId);
        return {
            applicationUniversalIdentifier: workspaceMigration.applicationUniversalIdentifier,
            actions: workspaceMigration.actions
        };
    }
    async throttlePerApplication(applicationIdentifier, workspaceId) {
        await this.throttlerService.tokenBucketThrottleOrThrow(`app-dev:${workspaceId}:${applicationIdentifier}`, 1, _applicationdevelopmentconstants.APP_DEV_RATE_LIMIT_MAX, _applicationdevelopmentconstants.APP_DEV_RATE_LIMIT_WINDOW_MS);
    }
    async findApplicationRegistrationId(universalIdentifier) {
        const existingRegistration = await this.applicationRegistrationService.findOneByUniversalIdentifier(universalIdentifier);
        if (!existingRegistration) {
            throw new _applicationexception.ApplicationException(`No registration found for "${universalIdentifier}". Create one first with createApplicationRegistration.`, _applicationexception.ApplicationExceptionCode.APPLICATION_NOT_FOUND);
        }
        return existingRegistration.id;
    }
    async syncRegistrationMetadata(applicationRegistrationId, manifest, workspaceId) {
        const hasRefreshedRegistration = await this.applicationManifestApplyService.refreshRegistrationFromManifest({
            applicationRegistrationId,
            manifest,
            sourceType: _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.LOCAL,
            onlyIfOwnedByWorkspaceId: workspaceId
        });
        if (!hasRefreshedRegistration) {
            return;
        }
        // Public assets are uploaded to workspace storage before the sync, so the
        // logo and gallery images can be copied into the registration's
        // instance-global server files here.
        await this.applicationRegistrationAssetService.storeRegistrationAssets({
            applicationRegistrationId,
            manifestApplication: manifest.application,
            readAsset: (path)=>this.readPublicAssetFromWorkspaceStorage({
                    workspaceId,
                    applicationUniversalIdentifier: manifest.application.universalIdentifier,
                    path
                })
        });
    }
    async readPublicAssetFromWorkspaceStorage({ workspaceId, applicationUniversalIdentifier, path }) {
        try {
            const stream = await this.fileStorageService.readFile({
                workspaceId,
                applicationUniversalIdentifier,
                fileFolder: _types.FileFolder.PublicAsset,
                resourcePath: path
            });
            return await (0, _streamtobuffer.streamToBuffer)(stream);
        } catch (error) {
            // A missing or unreadable asset must not fail the whole dev sync; the
            // registration keeps its previously stored file for that path, if any.
            this.logger.warn(`Could not read public asset "${path}" for application ${applicationUniversalIdentifier}: ${error.message}`);
            return null;
        }
    }
    constructor(applicationService, applicationSyncService, applicationManifestApplyService, applicationRegistrationService, applicationRegistrationAssetService, applicationVersionValidationService, fileStorageService, throttlerService, cacheLockService){
        this.applicationService = applicationService;
        this.applicationSyncService = applicationSyncService;
        this.applicationManifestApplyService = applicationManifestApplyService;
        this.applicationRegistrationService = applicationRegistrationService;
        this.applicationRegistrationAssetService = applicationRegistrationAssetService;
        this.applicationVersionValidationService = applicationVersionValidationService;
        this.fileStorageService = fileStorageService;
        this.throttlerService = throttlerService;
        this.cacheLockService = cacheLockService;
        this.logger = new _common.Logger(ApplicationDevelopmentService.name);
    }
};
ApplicationDevelopmentService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _applicationsyncservice.ApplicationSyncService === "undefined" ? Object : _applicationsyncservice.ApplicationSyncService,
        typeof _applicationmanifestapplyservice.ApplicationManifestApplyService === "undefined" ? Object : _applicationmanifestapplyservice.ApplicationManifestApplyService,
        typeof _applicationregistrationservice.ApplicationRegistrationService === "undefined" ? Object : _applicationregistrationservice.ApplicationRegistrationService,
        typeof _applicationregistrationassetservice.ApplicationRegistrationAssetService === "undefined" ? Object : _applicationregistrationassetservice.ApplicationRegistrationAssetService,
        typeof _applicationversionvalidationservice.ApplicationVersionValidationService === "undefined" ? Object : _applicationversionvalidationservice.ApplicationVersionValidationService,
        typeof _filestorageservice.FileStorageService === "undefined" ? Object : _filestorageservice.FileStorageService,
        typeof _throttlerservice.ThrottlerService === "undefined" ? Object : _throttlerservice.ThrottlerService,
        typeof _cachelockservice.CacheLockService === "undefined" ? Object : _cachelockservice.CacheLockService
    ])
], ApplicationDevelopmentService);

//# sourceMappingURL=application-development.service.js.map
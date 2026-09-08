"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationSyncService", {
    enumerable: true,
    get: function() {
        return ApplicationSyncService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _uuid = require("uuid");
const _applicationregistrationsourcetypeenum = require("../application-registration/enums/application-registration-source-type.enum");
const _applicationmanifestmigrationservice = require("./application-manifest-migration.service");
const _applicationuninstallservice = require("./services/application-uninstall.service");
const _enrichapplicationmanifestsyncerrorutil = require("./utils/enrich-application-manifest-sync-error.util");
const _buildfromtoalluniversalflatentitymapsutil = require("./utils/build-from-to-all-universal-flat-entity-maps.util");
const _applicationtranslationsyncservice = require("../application-translation/application-translation-sync.service");
const _getapplicationsuballflatentitymapsutil = require("./utils/get-application-sub-all-flat-entity-maps.util");
const _applicationexception = require("../application.exception");
const _applicationservice = require("../application.service");
const _applicationstateenum = require("../enums/application-state.enum");
const _filestorageservice = require("../../file-storage/services/file-storage.service");
const _logicfunctiondriverfactorytoken = require("../../logic-function/logic-function-drivers/constants/logic-function-driver-factory.token");
const _createemptyallflatentitymapsconstant = require("../../../metadata-modules/flat-entity/constant/create-empty-all-flat-entity-maps.constant");
const _getmetadataflatentitymapskeyutil = require("../../../metadata-modules/flat-entity/utils/get-metadata-flat-entity-maps-key.util");
const _frontcomponententity = require("../../../metadata-modules/front-component/entities/front-component.entity");
const _workspaceeventbroadcasterservice = require("../../../subscriptions/workspace-event-broadcaster/workspace-event-broadcaster.service");
const _workspacecacheservice = require("../../../workspace-cache/services/workspace-cache.service");
const _workspacemigrationbuilderexception = require("../../../workspace-manager/workspace-migration/exceptions/workspace-migration-builder-exception");
const _workspacemigrationvalidatebuildandrunservice = require("../../../workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service");
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
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let ApplicationSyncService = class ApplicationSyncService {
    async synchronizeFromManifest({ workspaceId, manifest, applicationRegistrationId, dryRun = false }) {
        const ownerFlatApplication = dryRun ? await this.resolveDryRunOwnerFlatApplication({
            workspaceId,
            manifest
        }) : await this.syncApplication({
            workspaceId,
            manifest,
            applicationRegistrationId
        });
        let syncResult;
        try {
            syncResult = await this.applicationManifestMigrationService.syncMetadataFromManifest({
                manifest,
                workspaceId,
                ownerFlatApplication,
                dryRun
            });
        } catch (error) {
            throw (0, _enrichapplicationmanifestsyncerrorutil.enrichApplicationManifestSyncError)({
                error,
                manifest
            });
        }
        if (!dryRun && (0, _utils.isDefined)(ownerFlatApplication.applicationRegistrationId)) {
            // Translation sync runs after the metadata migration is already applied
            // and is non-critical to the application itself, so a failure here must
            // never abort an otherwise successful install/sync. It is idempotent and
            // self-heals on the next sync.
            try {
                await this.applicationTranslationSyncService.syncFromManifest({
                    applicationRegistrationId: ownerFlatApplication.applicationRegistrationId,
                    translations: manifest.translations
                });
            } catch (error) {
                this.logger.warn(`Failed to sync application translations for registration ${ownerFlatApplication.applicationRegistrationId}: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
        this.logger.log(`Application sync from manifest ${dryRun ? 'plan computed (dry run)' : 'completed'}`);
        return syncResult;
    }
    async resolveDryRunOwnerFlatApplication({ workspaceId, manifest }) {
        const installedApplication = await this.applicationService.findByUniversalIdentifier({
            universalIdentifier: manifest.application.universalIdentifier,
            workspaceId
        });
        return installedApplication ?? this.buildVirtualDryRunFlatApplication({
            manifest,
            workspaceId
        });
    }
    buildVirtualDryRunFlatApplication({ manifest, workspaceId }) {
        const now = new Date();
        return {
            id: (0, _uuid.v4)(),
            workspaceId,
            universalIdentifier: manifest.application.universalIdentifier,
            name: manifest.application.displayName,
            description: manifest.application.description ?? null,
            logo: manifest.application.logo ?? manifest.application.logoUrl ?? null,
            logoFileId: null,
            version: null,
            sourceType: _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.LOCAL,
            state: _applicationstateenum.ApplicationState.INSTALLED,
            sourcePath: manifest.application.universalIdentifier,
            packageJsonChecksum: null,
            packageJsonFileId: null,
            yarnLockChecksum: null,
            yarnLockFileId: null,
            availablePackages: {},
            logicFunctionLayerId: null,
            defaultRoleId: null,
            defaultRole: null,
            settingsCustomTabFrontComponentId: null,
            uninstallLogicFunctionId: null,
            uninstallHookCompletedForRequestedAt: null,
            canBeUninstalled: true,
            autoUpgrade: false,
            isSdkLayerStale: false,
            sdkClientCoreChecksum: null,
            frontComponentSharedDependenciesChecksum: null,
            frontComponentSharedDependenciesBuiltPath: null,
            applicationRegistrationId: null,
            primaryPublicDomainId: null,
            createdAt: now,
            updatedAt: now,
            deletedAt: null
        };
    }
    // Registers the application + only the pre-install logic function in
    // workspace metadata so the pre-install hook can resolve and execute it
    // before the main synchronizeFromManifest runs the full migrations.
    // No-op when the manifest does not declare a pre-install logic function.
    async preInstallSynchronizeFromManifest({ workspaceId, manifest, applicationRegistrationId }) {
        if (!(0, _utils.isDefined)(manifest.application.preInstallLogicFunction)) {
            return;
        }
        const application = await this.syncApplication({
            workspaceId,
            manifest,
            applicationRegistrationId
        });
        const ownerFlatApplication = application;
        await this.applicationManifestMigrationService.syncPreInstallLogicFunctionFromManifest({
            manifest,
            workspaceId,
            ownerFlatApplication
        });
        this.logger.log('Pre-install sync from manifest completed');
    }
    async syncApplication({ workspaceId, manifest, applicationRegistrationId }) {
        const name = manifest.application.displayName;
        const packageJson = JSON.parse((await (0, _streamtobuffer.streamToBuffer)(await this.fileStorageService.readFile({
            applicationUniversalIdentifier: manifest.application.universalIdentifier,
            fileFolder: _types.FileFolder.Dependencies,
            resourcePath: 'package.json',
            workspaceId
        }))).toString('utf-8'));
        const application = await this.applicationService.findOneApplicationOrThrow({
            universalIdentifier: manifest.application.universalIdentifier,
            workspaceId
        });
        const resolvedRegistrationId = applicationRegistrationId ?? application.applicationRegistrationId;
        const frontComponentSharedDependenciesChecksum = manifest.application.frontComponentSharedDependencies?.builtChecksum ?? null;
        const frontComponentSharedDependenciesBuiltPath = manifest.application.frontComponentSharedDependencies?.builtPath ?? null;
        const updatedApplication = await this.applicationService.update(application.id, {
            name,
            description: manifest.application.description,
            logo: manifest.application.logo ?? manifest.application.logoUrl ?? null,
            version: packageJson.version,
            packageJsonChecksum: manifest.application.packageJsonChecksum,
            yarnLockChecksum: manifest.application.yarnLockChecksum,
            frontComponentSharedDependenciesChecksum,
            frontComponentSharedDependenciesBuiltPath,
            applicationRegistrationId: resolvedRegistrationId,
            workspaceId
        });
        if (application.frontComponentSharedDependenciesChecksum !== frontComponentSharedDependenciesChecksum) {
            await this.broadcastFrontComponentSharedDependenciesChecksumUpdates({
                workspaceId,
                applicationId: application.id,
                frontComponentSharedDependenciesChecksum
            });
        }
        return updatedApplication;
    }
    async broadcastFrontComponentSharedDependenciesChecksumUpdates({ workspaceId, applicationId, frontComponentSharedDependenciesChecksum }) {
        try {
            const frontComponents = await this.frontComponentRepository.find({
                select: [
                    'id'
                ],
                where: {
                    applicationId,
                    workspaceId
                }
            });
            await this.workspaceEventBroadcaster.broadcast({
                workspaceId,
                events: frontComponents.map((frontComponent)=>({
                        type: 'updated',
                        entityName: 'frontComponent',
                        recordId: frontComponent.id,
                        properties: {
                            updatedFields: [
                                'frontComponentSharedDependenciesChecksum'
                            ],
                            after: {
                                id: frontComponent.id,
                                frontComponentSharedDependenciesChecksum
                            }
                        }
                    }))
            });
        } catch (error) {
            this.logger.warn(`Failed to broadcast the shared dependencies checksum update for application ${applicationId} in workspace ${workspaceId}`, error);
        }
    }
    async uninstallApplication({ workspaceId, applicationUniversalIdentifier, shouldRunUninstallHook = true }) {
        const application = await this.applicationService.findOneApplicationOrThrow({
            universalIdentifier: applicationUniversalIdentifier,
            workspaceId
        });
        if (!application.canBeUninstalled) {
            throw new _applicationexception.ApplicationException('This application cannot be uninstalled.', _applicationexception.ApplicationExceptionCode.FORBIDDEN);
        }
        const shouldTransitionState = application.state === _applicationstateenum.ApplicationState.INSTALLED;
        try {
            if (shouldTransitionState) {
                await this.applicationService.update(application.id, {
                    state: _applicationstateenum.ApplicationState.UNINSTALLING,
                    workspaceId
                });
            }
            return await this.runUninstall({
                application,
                workspaceId,
                applicationUniversalIdentifier,
                shouldRunUninstallHook
            });
        } catch (error) {
            if (shouldTransitionState) {
                await this.applicationService.revertStateToInstalledBestEffort({
                    applicationId: application.id,
                    universalIdentifier: applicationUniversalIdentifier,
                    workspaceId
                });
            }
            throw error;
        }
    }
    async runUninstall({ application, workspaceId, applicationUniversalIdentifier, shouldRunUninstallHook }) {
        if (shouldRunUninstallHook) {
            await this.applicationUninstallService.runUninstallHookBestEffort({
                application,
                workspaceId
            });
        }
        const flatEntityMapsCacheKeys = Object.values(_metadata.ALL_METADATA_NAME).map(_getmetadataflatentitymapskeyutil.getMetadataFlatEntityMapsKey);
        const cacheResult = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            ...flatEntityMapsCacheKeys,
            'featureFlagsMap'
        ]);
        const { featureFlagsMap, ...fromAllFlatEntityMaps } = cacheResult;
        const applicationFromAllFlatEntityMaps = (0, _getapplicationsuballflatentitymapsutil.getApplicationSubAllFlatEntityMaps)({
            applicationIds: [
                application.id
            ],
            fromAllFlatEntityMaps
        });
        const fromToAllFlatEntityMaps = (0, _buildfromtoalluniversalflatentitymapsutil.buildFromToAllUniversalFlatEntityMaps)({
            fromAllFlatEntityMaps: applicationFromAllFlatEntityMaps,
            toAllUniversalFlatEntityMaps: (0, _createemptyallflatentitymapsconstant.createEmptyAllFlatEntityMaps)()
        });
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigrationFromTo({
            buildOptions: {
                isSystemBuild: true,
                inferDeletionFromMissingEntities: true,
                applicationUniversalIdentifier
            },
            fromToAllFlatEntityMaps,
            workspaceId,
            additionalCacheDataMaps: {
                featureFlagsMap
            }
        });
        if (validateAndBuildResult.status === 'fail') {
            throw new _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException(validateAndBuildResult, 'Validation errors occurred while uninstalling application');
        }
        await this.applicationService.delete(applicationUniversalIdentifier, workspaceId);
        await this.cleanupApplicationRuntimeResources({
            workspaceId,
            applicationUniversalIdentifier
        });
        return validateAndBuildResult.workspaceMigration;
    }
    async cleanupApplicationRuntimeResources({ workspaceId, applicationUniversalIdentifier }) {
        try {
            const driver = this.logicFunctionDriverFactory.getCurrentDriver();
            await driver.deleteApplicationResources({
                workspaceId,
                applicationUniversalIdentifier
            });
        } catch (error) {
            this.logger.warn(`Failed to clean up runtime resources for application ${applicationUniversalIdentifier} in workspace ${workspaceId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    constructor(applicationService, applicationManifestMigrationService, workspaceMigrationValidateBuildAndRunService, workspaceCacheService, fileStorageService, applicationTranslationSyncService, logicFunctionDriverFactory, applicationUninstallService, frontComponentRepository, workspaceEventBroadcaster){
        this.applicationService = applicationService;
        this.applicationManifestMigrationService = applicationManifestMigrationService;
        this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
        this.workspaceCacheService = workspaceCacheService;
        this.fileStorageService = fileStorageService;
        this.applicationTranslationSyncService = applicationTranslationSyncService;
        this.logicFunctionDriverFactory = logicFunctionDriverFactory;
        this.applicationUninstallService = applicationUninstallService;
        this.frontComponentRepository = frontComponentRepository;
        this.workspaceEventBroadcaster = workspaceEventBroadcaster;
        this.logger = new _common.Logger(ApplicationSyncService.name);
    }
};
ApplicationSyncService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(6, (0, _common.Inject)(_logicfunctiondriverfactorytoken.LOGIC_FUNCTION_DRIVER_FACTORY_TOKEN)),
    _ts_param(8, (0, _typeorm.InjectRepository)(_frontcomponententity.FrontComponentEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _applicationmanifestmigrationservice.ApplicationManifestMigrationService === "undefined" ? Object : _applicationmanifestmigrationservice.ApplicationManifestMigrationService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _filestorageservice.FileStorageService === "undefined" ? Object : _filestorageservice.FileStorageService,
        typeof _applicationtranslationsyncservice.ApplicationTranslationSyncService === "undefined" ? Object : _applicationtranslationsyncservice.ApplicationTranslationSyncService,
        typeof LogicFunctionDriverFactory === "undefined" ? Object : LogicFunctionDriverFactory,
        typeof _applicationuninstallservice.ApplicationUninstallService === "undefined" ? Object : _applicationuninstallservice.ApplicationUninstallService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _workspaceeventbroadcasterservice.WorkspaceEventBroadcaster === "undefined" ? Object : _workspaceeventbroadcasterservice.WorkspaceEventBroadcaster
    ])
], ApplicationSyncService);

//# sourceMappingURL=application-sync.service.js.map
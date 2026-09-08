"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationManifestMigrationService", {
    enumerable: true,
    get: function() {
        return ApplicationManifestMigrationService;
    }
});
const _common = require("@nestjs/common");
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _computeapplicationmanifestalluniversalflatentitymapsservice = require("./services/compute-application-manifest-all-universal-flat-entity-maps.service");
const _buildallflatentityoperationrecordbymetadatanamefromfromtoutil = require("./utils/build-all-flat-entity-operation-record-by-metadata-name-from-from-to.util");
const _buildfromtoalluniversalflatentitymapsutil = require("./utils/build-from-to-all-universal-flat-entity-maps.util");
const _getapplicationsuballflatentitymapsutil = require("./utils/get-application-sub-all-flat-entity-maps.util");
const _resolveapplicationreferenceidorthrowutil = require("./utils/resolve-application-reference-id-or-throw.util");
const _applicationexception = require("../application.exception");
const _applicationservice = require("../application.service");
const _loggerservice = require("../../logger/logger.service");
const _getmetadataflatentitymapskeyutil = require("../../../metadata-modules/flat-entity/utils/get-metadata-flat-entity-maps-key.util");
const _workspacecacheservice = require("../../../workspace-cache/services/workspace-cache.service");
const _twentystandardapplications = require("../../../workspace-manager/twenty-standard-application/constants/twenty-standard-applications");
const _workspacemigrationbuilderexception = require("../../../workspace-manager/workspace-migration/exceptions/workspace-migration-builder-exception");
const _workspacemigrationvalidatebuildandrunservice = require("../../../workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ApplicationManifestMigrationService = class ApplicationManifestMigrationService {
    async syncPreInstallLogicFunctionFromManifest({ manifest, workspaceId, ownerFlatApplication }) {
        const preInstallLogicFunction = manifest.application.preInstallLogicFunction;
        if (!(0, _utils.isDefined)(preInstallLogicFunction)) {
            return;
        }
        const preInstallLogicFunctionManifest = manifest.logicFunctions.find((logicFunction)=>logicFunction.universalIdentifier === preInstallLogicFunction.universalIdentifier);
        if (!(0, _utils.isDefined)(preInstallLogicFunctionManifest)) {
            throw new _applicationexception.ApplicationException(`Pre-install logic function "${preInstallLogicFunction.universalIdentifier}" is declared on the application manifest but not present in manifest.logicFunctions`, _applicationexception.ApplicationExceptionCode.ENTITY_NOT_FOUND);
        }
        // Will be sync with inferDeletionFromMissingEntities: false to produces a purely
        // additive migration that registers the pre-install logic function without
        // touching any previously-synced metadata (important on upgrades).
        const preInstallOnlyManifest = {
            application: manifest.application,
            objects: [],
            fields: [],
            logicFunctions: [
                preInstallLogicFunctionManifest
            ],
            frontComponents: [],
            permissionFlags: [],
            roles: [],
            skills: [],
            agents: [],
            publicAssets: [],
            views: [],
            viewFields: [],
            navigationMenuItems: [],
            pageLayouts: [],
            pageLayoutTabs: [],
            commandMenuItems: [],
            timelineActivityTypes: []
        };
        const now = new Date().toISOString();
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const cacheResult = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            ...Object.values(_metadata.ALL_METADATA_NAME).map(_getmetadataflatentitymapskeyutil.getMetadataFlatEntityMapsKey),
            'featureFlagsMap'
        ]);
        const { featureFlagsMap, ...existingAllFlatEntityMaps } = cacheResult;
        const fromAllFlatEntityMaps = (0, _getapplicationsuballflatentitymapsutil.getApplicationSubAllFlatEntityMaps)({
            applicationIds: [
                ownerFlatApplication.id
            ],
            fromAllFlatEntityMaps: existingAllFlatEntityMaps
        });
        const toAllUniversalFlatEntityMaps = this.computeManifestFlatEntityMapsService.compute({
            manifest: preInstallOnlyManifest,
            ownerFlatApplication,
            fromAllFlatEntityMaps,
            isLogicFunctionPrebuiltModeEnabled: featureFlagsMap[_types.FeatureFlagKey.IS_LOGIC_FUNCTION_PREBUILT_MODE_ENABLED],
            now,
            workspaceId
        });
        const dependencyAllFlatEntityMaps = (0, _getapplicationsuballflatentitymapsutil.getApplicationSubAllFlatEntityMaps)({
            applicationIds: ownerFlatApplication.universalIdentifier === _twentystandardapplications.TWENTY_STANDARD_APPLICATION.universalIdentifier ? [
                twentyStandardFlatApplication.id
            ] : [
                ownerFlatApplication.id,
                twentyStandardFlatApplication.id
            ],
            fromAllFlatEntityMaps: existingAllFlatEntityMaps
        });
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigrationFromTo({
            // inferDeletionFromMissingEntities is intentionally omitted (undefined)
            // so this pared-down sync is purely additive — existing metadata for
            // objects/fields/other logic functions that are absent from
            // preInstallOnlyManifest are left untouched on upgrades.
            buildOptions: {
                isSystemBuild: false,
                applicationUniversalIdentifier: ownerFlatApplication.universalIdentifier
            },
            fromToAllFlatEntityMaps: (0, _buildfromtoalluniversalflatentitymapsutil.buildFromToAllUniversalFlatEntityMaps)({
                fromAllFlatEntityMaps,
                toAllUniversalFlatEntityMaps
            }),
            workspaceId,
            dependencyAllFlatEntityMaps,
            additionalCacheDataMaps: {
                featureFlagsMap
            }
        });
        if (validateAndBuildResult.status === 'fail') {
            throw new _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException(validateAndBuildResult, 'Validation errors occurred while syncing pre-install logic function');
        }
        this.logger.log(`Pre-install logic function synced for application ${ownerFlatApplication.universalIdentifier}`, ApplicationManifestMigrationService.name);
    }
    async syncMetadataFromManifest({ manifest, workspaceId, ownerFlatApplication, dryRun = false }) {
        const now = new Date().toISOString();
        const recomputeStart = performance.now();
        const cacheResult = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            ...Object.values(_metadata.ALL_METADATA_NAME).map(_getmetadataflatentitymapskeyutil.getMetadataFlatEntityMapsKey),
            'featureFlagsMap'
        ]);
        const recomputeMs = performance.now() - recomputeStart;
        this.logger.perf(`[install-perf] syncMetadataFromManifest ALL_METADATA_NAME getOrRecompute flat-maps took ${recomputeMs.toFixed(1)}ms (logicFunctions=${manifest.logicFunctions.length})`, ApplicationManifestMigrationService.name);
        const { featureFlagsMap, ...existingAllFlatEntityMaps } = cacheResult;
        const fromAllFlatEntityMaps = (0, _getapplicationsuballflatentitymapsutil.getApplicationSubAllFlatEntityMaps)({
            applicationIds: [
                ownerFlatApplication.id
            ],
            fromAllFlatEntityMaps: existingAllFlatEntityMaps
        });
        const toAllUniversalFlatEntityMaps = this.computeManifestFlatEntityMapsService.compute({
            manifest,
            ownerFlatApplication,
            fromAllFlatEntityMaps,
            isLogicFunctionPrebuiltModeEnabled: featureFlagsMap[_types.FeatureFlagKey.IS_LOGIC_FUNCTION_PREBUILT_MODE_ENABLED],
            now,
            workspaceId
        });
        const allFlatEntityOperationRecordByMetadataName = (0, _buildallflatentityoperationrecordbymetadatanamefromfromtoutil.buildAllFlatEntityOperationRecordByMetadataNameFromFromTo)({
            fromAllFlatEntityMaps,
            toAllUniversalFlatEntityMaps,
            buildOptions: {
                isSystemBuild: false,
                inferDeletionFromMissingEntities: true,
                applicationUniversalIdentifier: ownerFlatApplication.universalIdentifier
            }
        });
        const validateBuildRunStart = performance.now();
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigrationFromRecord({
            allFlatEntityOperationRecordByMetadataName,
            workspaceId,
            isSystemBuild: false,
            applicationUniversalIdentifier: ownerFlatApplication.universalIdentifier,
            dryRun
        });
        const validateBuildRunMs = performance.now() - validateBuildRunStart;
        this.logger.perf(`[install-perf] syncMetadataFromManifest validateBuildAndRunWorkspaceMigrationFromTo took ${validateBuildRunMs.toFixed(1)}ms (dryRun=${dryRun}, actions=${validateAndBuildResult.status === 'success' ? validateAndBuildResult.workspaceMigration.actions.length : 'n/a-failed'})`, ApplicationManifestMigrationService.name);
        if (validateAndBuildResult.status === 'fail') {
            throw new _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException(validateAndBuildResult, 'Validation errors occurred while syncing application manifest metadata');
        }
        this.logger.log(`Metadata migration ${dryRun ? 'plan computed (dry run)' : 'completed'} for application ${ownerFlatApplication.universalIdentifier}`, ApplicationManifestMigrationService.name);
        if (!dryRun) {
            await this.syncApplicationReferencesFromManifest({
                manifest,
                workspaceId,
                ownerFlatApplication
            });
        }
        return {
            workspaceMigration: validateAndBuildResult.workspaceMigration,
            hasSchemaMetadataChanged: validateAndBuildResult.hasSchemaMetadataChanged
        };
    }
    async syncApplicationReferencesFromManifest({ manifest, workspaceId, ownerFlatApplication }) {
        const { flatRoleMaps: refreshedFlatRoleMaps, flatFrontComponentMaps: refreshedFlatFrontComponentMaps, flatLogicFunctionMaps: refreshedFlatLogicFunctionMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatRoleMaps',
            'flatFrontComponentMaps',
            'flatLogicFunctionMaps'
        ]);
        let defaultRoleId = null;
        for (const role of manifest.roles){
            const flatRoleId = (0, _resolveapplicationreferenceidorthrowutil.resolveApplicationReferenceIdOrThrow)({
                flatEntityMaps: refreshedFlatRoleMaps,
                universalIdentifier: role.universalIdentifier,
                referenceLabel: 'role',
                exceptionCode: _applicationexception.ApplicationExceptionCode.ENTITY_NOT_FOUND
            });
            if (role.universalIdentifier === manifest.application.defaultRoleUniversalIdentifier) {
                defaultRoleId = flatRoleId;
            }
        }
        const settingsFrontComponentUniversalIdentifier = manifest.application.settingsFrontComponent?.universalIdentifier;
        const settingsCustomTabFrontComponentId = (0, _utils.isDefined)(settingsFrontComponentUniversalIdentifier) ? (0, _resolveapplicationreferenceidorthrowutil.resolveApplicationReferenceIdOrThrow)({
            flatEntityMaps: refreshedFlatFrontComponentMaps,
            universalIdentifier: settingsFrontComponentUniversalIdentifier,
            referenceLabel: 'settings front component',
            exceptionCode: _applicationexception.ApplicationExceptionCode.ENTITY_NOT_FOUND
        }) : null;
        const uninstallLogicFunctionUniversalIdentifier = manifest.application.uninstallLogicFunction?.universalIdentifier;
        const uninstallLogicFunctionId = (0, _utils.isDefined)(uninstallLogicFunctionUniversalIdentifier) ? (0, _resolveapplicationreferenceidorthrowutil.resolveApplicationReferenceIdOrThrow)({
            flatEntityMaps: refreshedFlatLogicFunctionMaps,
            universalIdentifier: uninstallLogicFunctionUniversalIdentifier,
            referenceLabel: 'uninstall logic function',
            exceptionCode: _applicationexception.ApplicationExceptionCode.LOGIC_FUNCTION_NOT_FOUND,
            ownerApplicationId: ownerFlatApplication.id
        }) : null;
        await this.applicationService.update(ownerFlatApplication.id, {
            workspaceId,
            settingsCustomTabFrontComponentId,
            uninstallLogicFunctionId,
            ...(0, _utils.isDefined)(defaultRoleId) ? {
                defaultRoleId
            } : {}
        });
    }
    constructor(workspaceCacheService, workspaceMigrationValidateBuildAndRunService, applicationService, computeManifestFlatEntityMapsService, logger){
        this.workspaceCacheService = workspaceCacheService;
        this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
        this.applicationService = applicationService;
        this.computeManifestFlatEntityMapsService = computeManifestFlatEntityMapsService;
        this.logger = logger;
    }
};
ApplicationManifestMigrationService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _computeapplicationmanifestalluniversalflatentitymapsservice.ComputeApplicationManifestAllUniversalFlatEntityMapsService === "undefined" ? Object : _computeapplicationmanifestalluniversalflatentitymapsservice.ComputeApplicationManifestAllUniversalFlatEntityMapsService,
        typeof _loggerservice.LoggerService === "undefined" ? Object : _loggerservice.LoggerService
    ])
], ApplicationManifestMigrationService);

//# sourceMappingURL=application-manifest-migration.service.js.map
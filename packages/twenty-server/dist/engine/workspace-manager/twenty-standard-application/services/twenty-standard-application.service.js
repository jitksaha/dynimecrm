"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TwentyStandardApplicationService", {
    enumerable: true,
    get: function() {
        return TwentyStandardApplicationService;
    }
});
const _common = require("@nestjs/common");
const _applicationservice = require("../../../core-modules/application/application.service");
const _getmetadataflatentitymapskeyutil = require("../../../metadata-modules/flat-entity/utils/get-metadata-flat-entity-maps-key.util");
const _getsubflatentitymapsbyapplicationidsorthrowutil = require("../../../metadata-modules/flat-entity/utils/get-sub-flat-entity-maps-by-application-ids-or-throw.util");
const _workspaceormmanager = require("../../../twenty-orm/workspace-orm.manager");
const _workspacecacheservice = require("../../../workspace-cache/services/workspace-cache.service");
const _twentystandardallmetadatanameconstant = require("../constants/twenty-standard-all-metadata-name.constant");
const _keepworkspaceownedpropertiesutil = require("../../../metadata-modules/flat-entity/utils/keep-workspace-owned-properties.util");
const _twentystandardapplicationallflatentitymapsconstant = require("../utils/twenty-standard-application-all-flat-entity-maps.constant");
const _workspacemigrationbuilderexception = require("../../workspace-migration/exceptions/workspace-migration-builder-exception");
const _workspacemigrationvalidatebuildandrunservice = require("../../workspace-migration/services/workspace-migration-validate-build-and-run-service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let TwentyStandardApplicationService = class TwentyStandardApplicationService {
    async synchronizeTwentyStandardApplicationOrThrow({ workspaceId }) {
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const { featureFlagsMap, ...fromTwentyStandardAllFlatEntityMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            ..._twentystandardallmetadatanameconstant.TWENTY_STANDARD_ALL_METADATA_NAME.map(_getmetadataflatentitymapskeyutil.getMetadataFlatEntityMapsKey),
            'featureFlagsMap'
        ]);
        const { allFlatEntityMaps: toTwentyStandardAllFlatEntityMaps, idByUniversalIdentifierByMetadataName } = (0, _twentystandardapplicationallflatentitymapsconstant.computeTwentyStandardApplicationAllFlatEntityMaps)({
            now: new Date().toISOString(),
            workspaceId,
            twentyStandardApplicationId: twentyStandardFlatApplication.id
        });
        const fromToAllFlatEntityMaps = {};
        for (const metadataName of _twentystandardallmetadatanameconstant.TWENTY_STANDARD_ALL_METADATA_NAME){
            const flatEntityMapsKey = (0, _getmetadataflatentitymapskeyutil.getMetadataFlatEntityMapsKey)(metadataName);
            const fromFlatEntityMaps = fromTwentyStandardAllFlatEntityMaps[flatEntityMapsKey];
            const from = (0, _getsubflatentitymapsbyapplicationidsorthrowutil.getSubFlatEntityMapsByApplicationIdsOrThrow)({
                applicationIds: [
                    twentyStandardFlatApplication.id
                ],
                flatEntityMaps: fromFlatEntityMaps
            });
            const fromTo = {
                from,
                to: (0, _keepworkspaceownedpropertiesutil.keepWorkspaceOwnedProperties)({
                    metadataName,
                    fromFlatEntityMaps: from,
                    toFlatEntityMaps: toTwentyStandardAllFlatEntityMaps[flatEntityMapsKey]
                })
            };
            // @ts-expect-error Metadata flat entity maps cache key and metadataName colliding
            fromToAllFlatEntityMaps[flatEntityMapsKey] = fromTo;
        }
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigrationFromTo({
            buildOptions: {
                isSystemBuild: true,
                inferDeletionFromMissingEntities: true,
                applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier
            },
            fromToAllFlatEntityMaps,
            workspaceId,
            additionalCacheDataMaps: {
                featureFlagsMap
            },
            idByUniversalIdentifierByMetadataName
        });
        if (validateAndBuildResult.status === 'fail') {
            throw new _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException(validateAndBuildResult, 'Multiple validation errors occurred while synchronizing twenty-standard application');
        }
    }
    constructor(applicationService, workspaceMigrationValidateBuildAndRunService, workspaceCacheService, workspaceOrmManager){
        this.applicationService = applicationService;
        this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
        this.workspaceCacheService = workspaceCacheService;
        this.workspaceOrmManager = workspaceOrmManager;
    }
};
TwentyStandardApplicationService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager
    ])
], TwentyStandardApplicationService);

//# sourceMappingURL=twenty-standard-application.service.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceMigrationFlatEntityMapsService", {
    enumerable: true,
    get: function() {
        return WorkspaceMigrationFlatEntityMapsService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _allmanytoonemetadatarelationsconstant = require("../../../metadata-modules/flat-entity/constant/all-many-to-one-metadata-relations.constant");
const _flatentitymapsexception = require("../../../metadata-modules/flat-entity/exceptions/flat-entity-maps.exception");
const _getmetadataflatentitymapskeyutil = require("../../../metadata-modules/flat-entity/utils/get-metadata-flat-entity-maps-key.util");
const _getmetadatarelatedmetadatanamesforvalidationutil = require("../../../metadata-modules/flat-entity/utils/get-metadata-related-metadata-names-for-validation.util");
const _getsuballflatentitymapsbyapplicationidsorthrowutil = require("../../../metadata-modules/flat-entity/utils/get-sub-all-flat-entity-maps-by-application-ids-or-throw.util");
const _metadatasideeffectengineservice = require("../../../metadata-modules/metadata-side-effect/services/metadata-side-effect-engine.service");
const _workspacecacheservice = require("../../../workspace-cache/services/workspace-cache.service");
const _twentystandardapplications = require("../../twenty-standard-application/constants/twenty-standard-applications");
const _workspacemigrationadditionalcachedatamapskeyconstant = require("../constant/workspace-migration-additional-cache-data-maps-key.constant");
const _gettimelineactivitytypetargetrelationapplicationidsutil = require("./utils/get-timeline-activity-type-target-relation-application-ids.util");
const _computeuniversalflatentitymapsfromtothroughmutationutil = require("../utils/compute-universal-flat-entity-maps-from-to-through-mutation.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let WorkspaceMigrationFlatEntityMapsService = class WorkspaceMigrationFlatEntityMapsService {
    async getOrRecomputeAllRelatedFlatEntityMaps({ workspaceId, callerMetadataNames }) {
        const allMetadataNameCacheToCompute = [
            ...new Set([
                ...callerMetadataNames,
                ...this.metadataSideEffectEngineService.getSideEffectRelatedMetadataNames(callerMetadataNames)
            ].flatMap((metadataName)=>[
                    metadataName,
                    ...(0, _getmetadatarelatedmetadatanamesforvalidationutil.getMetadataRelatedMetadataNamesForValidation)(metadataName)
                ]))
        ];
        const { flatApplicationMaps, ...allRelatedFlatEntityMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            ...allMetadataNameCacheToCompute.map(_getmetadataflatentitymapskeyutil.getMetadataFlatEntityMapsKey),
            ..._workspacemigrationadditionalcachedatamapskeyconstant.WORKSPACE_MIGRATION_ADDITIONAL_CACHE_DATA_MAPS_KEY,
            'flatApplicationMaps'
        ]);
        return {
            flatApplicationMaps,
            allRelatedFlatEntityMaps,
            allMetadataNameCacheToCompute
        };
    }
    computeFromToAllFlatEntityMapsAndBuildOptions({ allFlatEntityOperationRecordByMetadataName, applicationUniversalIdentifier, flatApplicationMaps, allRelatedFlatEntityMaps, allMetadataNameCacheToCompute }) {
        const { dependencyAllFlatEntityMaps, additionalCacheDataMaps } = this.computeDependencyAndAdditionalCacheDataMaps({
            allFlatEntityOperationRecordByMetadataName,
            applicationUniversalIdentifier,
            flatApplicationMaps,
            allRelatedFlatEntityMaps,
            allMetadataNameCacheToCompute
        });
        const fromToAllFlatEntityMaps = {};
        const idByUniversalIdentifierByMetadataName = {};
        const inferDeletionFromMissingEntities = {};
        const allMetadataNameToCompare = Object.keys(allFlatEntityOperationRecordByMetadataName);
        for (const metadataName of allMetadataNameToCompare){
            const flatEntityOperations = allFlatEntityOperationRecordByMetadataName[metadataName];
            if (!(0, _utils.isDefined)(flatEntityOperations)) {
                throw new _flatentitymapsexception.FlatEntityMapsException(`Could not load flat entity maps to compare for ${metadataName}, should never occur`, _flatentitymapsexception.FlatEntityMapsExceptionCode.INTERNAL_SERVER_ERROR);
            }
            // The record matrix is the canonical form; the from/to mutation helper still
            // consumes arrays, so we flatten each bucket at this boundary only.
            const flatEntityToCreate = Object.values(flatEntityOperations.flatEntityToCreate);
            const flatEntityToUpdate = Object.values(flatEntityOperations.flatEntityToUpdate);
            const flatEntityToDelete = Object.values(flatEntityOperations.flatEntityToDelete);
            const idByUniversalIdentifier = Object.fromEntries(flatEntityToCreate.filter((flatEntity)=>(0, _utils.isDefined)(flatEntity.id)).map((flatEntity)=>[
                    flatEntity.universalIdentifier,
                    flatEntity.id
                ]));
            if (Object.keys(idByUniversalIdentifier).length > 0) {
                idByUniversalIdentifierByMetadataName[metadataName] = idByUniversalIdentifier;
            }
            const flatEntityMapsKey = (0, _getmetadataflatentitymapskeyutil.getMetadataFlatEntityMapsKey)(metadataName);
            const flatEntityMaps = allRelatedFlatEntityMaps[flatEntityMapsKey];
            if (!(0, _utils.isDefined)(flatEntityMaps)) {
                throw new _flatentitymapsexception.FlatEntityMapsException(`Flat entity maps for ${metadataName} were not pre-fetched; the up-front cache key union must cover every metadata name the side-effect expansion can add`, _flatentitymapsexception.FlatEntityMapsExceptionCode.INTERNAL_SERVER_ERROR);
            }
            // @ts-expect-error Metadata flat entity maps cache key and metadataName colliding
            fromToAllFlatEntityMaps[flatEntityMapsKey] = (0, _computeuniversalflatentitymapsfromtothroughmutationutil.computeUniversalFlatEntityMapsFromToThroughMutation)({
                flatEntityMaps: structuredClone(flatEntityMaps),
                flatEntityToCreate,
                flatEntityToDelete,
                flatEntityToUpdate
            });
            if (flatEntityToDelete.length > 0) {
                inferDeletionFromMissingEntities[metadataName] = true;
            }
        }
        return {
            fromToAllFlatEntityMaps,
            inferDeletionFromMissingEntities,
            dependencyAllFlatEntityMaps,
            additionalCacheDataMaps,
            idByUniversalIdentifierByMetadataName
        };
    }
    computeDependencyAndAdditionalCacheDataMaps({ allFlatEntityOperationRecordByMetadataName, applicationUniversalIdentifier, flatApplicationMaps, allRelatedFlatEntityMaps, allMetadataNameCacheToCompute }) {
        const applicationIds = this.computeAllInvolvedApplicationIds({
            allFlatEntityOperationRecordByMetadataName,
            flatApplicationMaps,
            applicationUniversalIdentifier,
            allRelatedFlatEntityMaps
        });
        const dependencyAllFlatEntityMaps = (0, _getsuballflatentitymapsbyapplicationidsorthrowutil.getSubAllFlatEntityMapsByApplicationIdsOrThrow)({
            applicationIds,
            metadataNames: allMetadataNameCacheToCompute,
            fromAllFlatEntityMaps: allRelatedFlatEntityMaps
        });
        const additionalCacheDataMaps = _workspacemigrationadditionalcachedatamapskeyconstant.WORKSPACE_MIGRATION_ADDITIONAL_CACHE_DATA_MAPS_KEY.reduce((acc, additionalCacheDataMapsKey)=>{
            return {
                ...acc,
                [additionalCacheDataMapsKey]: allRelatedFlatEntityMaps[additionalCacheDataMapsKey]
            };
        }, {});
        return {
            dependencyAllFlatEntityMaps,
            additionalCacheDataMaps
        };
    }
    computeAllInvolvedApplicationIds({ allFlatEntityOperationRecordByMetadataName, flatApplicationMaps, applicationUniversalIdentifier, allRelatedFlatEntityMaps }) {
        const applicationIds = new Set();
        const applicationId = flatApplicationMaps.idByUniversalIdentifier[applicationUniversalIdentifier];
        const twentyStandardApplicationId = flatApplicationMaps.idByUniversalIdentifier[_twentystandardapplications.TWENTY_STANDARD_APPLICATION.universalIdentifier];
        if (!(0, _utils.isDefined)(twentyStandardApplicationId)) {
            throw new _flatentitymapsexception.FlatEntityMapsException('Twenty standard application not found in workspace', _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_NOT_FOUND);
        }
        if ((0, _utils.isDefined)(applicationId)) {
            applicationIds.add(applicationId);
        }
        const isBuildingTwentyStandardApplication = applicationUniversalIdentifier === _twentystandardapplications.TWENTY_STANDARD_APPLICATION.universalIdentifier;
        if (!isBuildingTwentyStandardApplication) {
            applicationIds.add(twentyStandardApplicationId);
        }
        for (const targetRelationApplicationId of (0, _gettimelineactivitytypetargetrelationapplicationidsutil.getTimelineActivityTypeTargetRelationApplicationIds)({
            timelineActivityTypeOperations: allFlatEntityOperationRecordByMetadataName.timelineActivityType,
            flatFieldMetadataMaps: allRelatedFlatEntityMaps.flatFieldMetadataMaps
        })){
            applicationIds.add(targetRelationApplicationId);
        }
        for (const metadataName of Object.keys(allFlatEntityOperationRecordByMetadataName)){
            const flatEntityOperations = allFlatEntityOperationRecordByMetadataName[metadataName];
            if (!(0, _utils.isDefined)(flatEntityOperations)) {
                continue;
            }
            const { flatEntityToCreate, flatEntityToUpdate, flatEntityToDelete } = flatEntityOperations;
            const relations = _allmanytoonemetadatarelationsconstant.ALL_MANY_TO_ONE_METADATA_RELATIONS[metadataName];
            for (const flatEntity of [
                ...Object.values(flatEntityToCreate),
                ...Object.values(flatEntityToUpdate),
                ...Object.values(flatEntityToDelete)
            ]){
                const entityApplicationId = flatApplicationMaps.idByUniversalIdentifier[flatEntity.applicationUniversalIdentifier];
                if ((0, _utils.isDefined)(entityApplicationId)) {
                    applicationIds.add(entityApplicationId);
                }
                for (const relation of Object.values(relations)){
                    if (!(0, _utils.isDefined)(relation)) {
                        continue;
                    }
                    const { universalForeignKey, metadataName: targetMetadataName } = relation;
                    const referencedUniversalIdentifier = flatEntity[universalForeignKey];
                    if (!(0, _utils.isDefined)(referencedUniversalIdentifier)) {
                        continue;
                    }
                    const targetFlatEntityMaps = allRelatedFlatEntityMaps[(0, _getmetadataflatentitymapskeyutil.getMetadataFlatEntityMapsKey)(targetMetadataName)];
                    if (!(0, _utils.isDefined)(targetFlatEntityMaps)) {
                        continue;
                    }
                    const referencedEntity = targetFlatEntityMaps.byUniversalIdentifier[referencedUniversalIdentifier];
                    if ((0, _utils.isDefined)(referencedEntity)) {
                        applicationIds.add(referencedEntity.applicationId);
                    }
                }
            }
        }
        return [
            ...applicationIds
        ];
    }
    constructor(workspaceCacheService, metadataSideEffectEngineService){
        this.workspaceCacheService = workspaceCacheService;
        this.metadataSideEffectEngineService = metadataSideEffectEngineService;
    }
};
WorkspaceMigrationFlatEntityMapsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _metadatasideeffectengineservice.MetadataSideEffectEngineService === "undefined" ? Object : _metadatasideeffectengineservice.MetadataSideEffectEngineService
    ])
], WorkspaceMigrationFlatEntityMapsService);

//# sourceMappingURL=workspace-migration-flat-entity-maps.service.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MetadataSideEffectEngineService", {
    enumerable: true,
    get: function() {
        return MetadataSideEffectEngineService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _getmetadatamanytoonerelatednamesutil = require("../../flat-entity/utils/get-metadata-many-to-one-related-names.util");
const _getmetadatasideeffectcompanionnamesutil = require("../../flat-entity/utils/get-metadata-side-effect-companion-names.util");
const _issystemsideeffectflatentityutil = require("../../flat-entity/utils/is-system-side-effect-flat-entity.util");
const _metadatasideeffecthandlerregistryservice = require("../registry/metadata-side-effect-handler-registry.service");
const _metadatasideeffectoperationtype = require("../types/metadata-side-effect-operation.type");
const _mapsystemsideeffectcollisiontofailureutil = require("../utils/map-system-side-effect-collision-to-failure.util");
const _emptyorchestratorfailurereportconstant = require("../../../workspace-manager/workspace-migration/constant/empty-orchestrator-failure-report.constant");
const _mergeorchestratorfailurereportsutil = require("../../../workspace-manager/workspace-migration/utils/merge-orchestrator-failure-reports.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const OPERATION_TO_FLAT_ENTITY_RECORD_KEY = {
    create: 'flatEntityToCreate',
    update: 'flatEntityToUpdate',
    delete: 'flatEntityToDelete'
};
let MetadataSideEffectEngineService = class MetadataSideEffectEngineService {
    getSideEffectRelatedMetadataNames(triggerMetadataNames) {
        const relatedMetadataNames = new Set();
        for (const { metadataName } of this.metadataSideEffectHandlerRegistryService.getRegisteredHandlerKeys()){
            if (!triggerMetadataNames.includes(metadataName)) {
                continue;
            }
            for (const relatedMetadataName of [
                metadataName,
                ...(0, _getmetadatamanytoonerelatednamesutil.getMetadataManyToOneRelatedNames)(metadataName),
                ...(0, _getmetadatasideeffectcompanionnamesutil.getMetadataSideEffectCompanionNames)(metadataName)
            ]){
                relatedMetadataNames.add(relatedMetadataName);
            }
        }
        return [
            ...relatedMetadataNames
        ];
    }
    expandWithSideEffects({ allFlatEntityOperationRecordByMetadataName, sideEffectRelatedFlatEntityMaps, context }) {
        const expandedMatrix = this.cloneMatrix(allFlatEntityOperationRecordByMetadataName);
        const systemSideEffectUniversalIdentifierCollisions = [];
        const sideEffectFailures = [];
        const triggerMatrix = allFlatEntityOperationRecordByMetadataName;
        for (const { operation, metadataName } of this.metadataSideEffectHandlerRegistryService.getRegisteredHandlerKeys()){
            const handlers = this.metadataSideEffectHandlerRegistryService.getHandlers(operation, metadataName);
            if (handlers.length === 0) {
                continue;
            }
            const triggerFlatEntities = Object.values(triggerMatrix[metadataName]?.[OPERATION_TO_FLAT_ENTITY_RECORD_KEY[operation]] ?? {});
            for (const triggerFlatEntity of triggerFlatEntities){
                for (const handler of handlers){
                    const sideEffectResult = handler.buildSideEffects({
                        flatEntity: triggerFlatEntity,
                        allFlatEntityOperationRecordByMetadataName: expandedMatrix,
                        relatedFlatEntityMaps: sideEffectRelatedFlatEntityMaps,
                        context
                    });
                    if (sideEffectResult.status === 'fail') {
                        sideEffectFailures.push(sideEffectResult);
                        continue;
                    }
                    if (sideEffectResult.status === 'noop') {
                        continue;
                    }
                    this.mergeSideEffectsIntoMatrix({
                        expandedMatrix,
                        sideEffectOperations: sideEffectResult.operations,
                        systemSideEffectUniversalIdentifierCollisions
                    });
                }
            }
        }
        const allSideEffectFailures = [
            ...sideEffectFailures,
            ...systemSideEffectUniversalIdentifierCollisions.map(_mapsystemsideeffectcollisiontofailureutil.mapSystemSideEffectCollisionToFailure)
        ];
        if (allSideEffectFailures.length > 0) {
            const report = (0, _emptyorchestratorfailurereportconstant.EMPTY_ORCHESTRATOR_FAILURE_REPORT)();
            for (const sideEffectFailure of allSideEffectFailures){
                (0, _mergeorchestratorfailurereportsutil.pushToOrchestratorFailureReport)({
                    report,
                    metadataName: sideEffectFailure.metadataName,
                    items: [
                        sideEffectFailure
                    ]
                });
            }
            return {
                status: 'fail',
                report
            };
        }
        return {
            status: 'success',
            allFlatEntityOperationRecordByMetadataName: expandedMatrix
        };
    }
    mergeSideEffectsIntoMatrix({ expandedMatrix, sideEffectOperations, systemSideEffectUniversalIdentifierCollisions }) {
        for (const metadataName of Object.keys(sideEffectOperations)){
            const operationBuckets = sideEffectOperations[metadataName];
            if (!(0, _utils.isDefined)(operationBuckets)) {
                continue;
            }
            for (const operation of _metadatasideeffectoperationtype.METADATA_SIDE_EFFECT_OPERATIONS){
                const sideEffectFlatEntities = Object.values(operationBuckets[OPERATION_TO_FLAT_ENTITY_RECORD_KEY[operation]] ?? {});
                for (const sideEffectFlatEntity of sideEffectFlatEntities){
                    this.addToOperationIfAbsent({
                        expandedMatrix,
                        operation,
                        metadataName,
                        flatEntity: sideEffectFlatEntity,
                        systemSideEffectUniversalIdentifierCollisions
                    });
                }
            }
        }
    }
    cloneMatrix(allFlatEntityOperationRecordByMetadataName) {
        const genericMatrix = allFlatEntityOperationRecordByMetadataName;
        const clonedMatrix = {};
        for (const metadataName of Object.keys(genericMatrix)){
            const operations = genericMatrix[metadataName];
            if (!(0, _utils.isDefined)(operations)) {
                continue;
            }
            clonedMatrix[metadataName] = {
                flatEntityToCreate: {
                    ...operations.flatEntityToCreate
                },
                flatEntityToUpdate: {
                    ...operations.flatEntityToUpdate
                },
                flatEntityToDelete: {
                    ...operations.flatEntityToDelete
                }
            };
        }
        return clonedMatrix;
    }
    addToOperationIfAbsent({ expandedMatrix, operation, metadataName, flatEntity, systemSideEffectUniversalIdentifierCollisions }) {
        const operations = expandedMatrix[metadataName] ??= {
            flatEntityToCreate: {},
            flatEntityToUpdate: {},
            flatEntityToDelete: {}
        };
        const flatEntityRecordKey = OPERATION_TO_FLAT_ENTITY_RECORD_KEY[operation];
        const flatEntityRecord = operations[flatEntityRecordKey];
        const existingFlatEntity = flatEntityRecord[flatEntity.universalIdentifier];
        if ((0, _utils.isDefined)(existingFlatEntity)) {
            this.recordUniversalIdentifierCollisionIfNeeded({
                existingFlatEntity,
                operation,
                metadataName,
                flatEntity,
                systemSideEffectUniversalIdentifierCollisions
            });
            return;
        }
        flatEntityRecord[flatEntity.universalIdentifier] = flatEntity;
    }
    recordUniversalIdentifierCollisionIfNeeded({ existingFlatEntity, operation, metadataName, flatEntity, systemSideEffectUniversalIdentifierCollisions }) {
        const isIncomingSystemSideEffect = (0, _issystemsideeffectflatentityutil.isSystemSideEffectFlatEntity)(flatEntity);
        if (!isIncomingSystemSideEffect) {
            return;
        }
        if ((0, _issystemsideeffectflatentityutil.isSystemSideEffectFlatEntity)(existingFlatEntity)) {
            return;
        }
        systemSideEffectUniversalIdentifierCollisions.push({
            metadataName: metadataName,
            operation,
            universalIdentifier: flatEntity.universalIdentifier,
            name: this.extractFlatEntityName(flatEntity)
        });
    }
    extractFlatEntityName(flatEntity) {
        const { name } = flatEntity;
        return typeof name === 'string' ? name : undefined;
    }
    constructor(metadataSideEffectHandlerRegistryService){
        this.metadataSideEffectHandlerRegistryService = metadataSideEffectHandlerRegistryService;
    }
};
MetadataSideEffectEngineService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _metadatasideeffecthandlerregistryservice.MetadataSideEffectHandlerRegistryService === "undefined" ? Object : _metadatasideeffecthandlerregistryservice.MetadataSideEffectHandlerRegistryService
    ])
], MetadataSideEffectEngineService);

//# sourceMappingURL=metadata-side-effect-engine.service.js.map
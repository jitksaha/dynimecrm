"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildAllFlatEntityOperationRecordByMetadataNameFromFromTo", {
    enumerable: true,
    get: function() {
        return buildAllFlatEntityOperationRecordByMetadataNameFromFromTo;
    }
});
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _preserveapplicationlocalmetadatastateutil = require("./preserve-application-local-metadata-state.util");
const _getmetadataflatentitymapskeyutil = require("../../../../metadata-modules/flat-entity/utils/get-metadata-flat-entity-maps-key.util");
const _issystemsideeffectflatentityutil = require("../../../../metadata-modules/flat-entity/utils/is-system-side-effect-flat-entity.util");
const _keepworkspaceownedpropertiesutil = require("../../../../metadata-modules/flat-entity/utils/keep-workspace-owned-properties.util");
const _comparetwouniversalflatentityutil = require("../../../../workspace-manager/workspace-migration/universal-flat-entity/utils/compare-two-universal-flat-entity.util");
const _shouldinferdeletionfrommissingentitiesutil = require("../../../../workspace-manager/workspace-migration/utils/should-infer-deletion-from-missing-entities.util");
const toRecordByUniversalIdentifier = (flatEntities)=>Object.fromEntries(flatEntities.map((flatEntity)=>[
            flatEntity.universalIdentifier,
            flatEntity
        ]));
const buildFlatEntityOperationRecordForMetadata = ({ metadataName, fromFlatEntityMaps, toFlatEntityMaps, buildOptions })=>{
    const fromByUniversalIdentifier = fromFlatEntityMaps.byUniversalIdentifier;
    const { byUniversalIdentifier: toByUniversalIdentifier } = (0, _keepworkspaceownedpropertiesutil.keepWorkspaceOwnedProperties)({
        metadataName,
        fromFlatEntityMaps,
        toFlatEntityMaps
    });
    const flatEntityToCreate = Object.values(toByUniversalIdentifier).filter(_utils.isDefined).filter((toFlatEntity)=>!(0, _utils.isDefined)(fromByUniversalIdentifier[toFlatEntity.universalIdentifier]));
    const flatEntityToDelete = (0, _shouldinferdeletionfrommissingentitiesutil.shouldInferDeletionFromMissingEntities)({
        buildOptions,
        metadataName
    }) ? Object.values(fromByUniversalIdentifier).filter(_utils.isDefined).filter((fromFlatEntity)=>!(0, _utils.isDefined)(toByUniversalIdentifier[fromFlatEntity.universalIdentifier])).filter((fromFlatEntity)=>!(0, _issystemsideeffectflatentityutil.isSystemSideEffectFlatEntity)(fromFlatEntity)) : [];
    const flatEntityToUpdate = Object.values(fromByUniversalIdentifier).filter(_utils.isDefined).map((fromFlatEntity)=>{
        const toFlatEntity = toByUniversalIdentifier[fromFlatEntity.universalIdentifier];
        if (!(0, _utils.isDefined)(toFlatEntity)) {
            return undefined;
        }
        const toFlatEntityWithLocalState = (0, _preserveapplicationlocalmetadatastateutil.preserveApplicationLocalMetadataState)({
            existingEntity: fromFlatEntity,
            manifestEntity: toFlatEntity
        });
        const update = (0, _comparetwouniversalflatentityutil.compareTwoFlatEntity)({
            fromUniversalFlatEntity: fromFlatEntity,
            toUniversalFlatEntity: toFlatEntityWithLocalState,
            metadataName
        });
        return (0, _utils.isDefined)(update) ? toFlatEntityWithLocalState : undefined;
    }).filter(_utils.isDefined);
    return {
        flatEntityToCreate: toRecordByUniversalIdentifier(flatEntityToCreate),
        flatEntityToUpdate: toRecordByUniversalIdentifier(flatEntityToUpdate),
        flatEntityToDelete: toRecordByUniversalIdentifier(flatEntityToDelete)
    };
};
const buildAllFlatEntityOperationRecordByMetadataNameFromFromTo = ({ fromAllFlatEntityMaps, toAllUniversalFlatEntityMaps, buildOptions })=>{
    const allFlatEntityOperationRecordByMetadataName = {};
    for (const metadataName of Object.values(_metadata.ALL_METADATA_NAME)){
        const flatEntityMapsKey = (0, _getmetadataflatentitymapskeyutil.getMetadataFlatEntityMapsKey)(metadataName);
        const flatEntityOperationRecord = buildFlatEntityOperationRecordForMetadata({
            metadataName,
            fromFlatEntityMaps: fromAllFlatEntityMaps[flatEntityMapsKey],
            toFlatEntityMaps: toAllUniversalFlatEntityMaps[flatEntityMapsKey],
            buildOptions
        });
        if (Object.keys(flatEntityOperationRecord.flatEntityToCreate).length === 0 && Object.keys(flatEntityOperationRecord.flatEntityToUpdate).length === 0 && Object.keys(flatEntityOperationRecord.flatEntityToDelete).length === 0) {
            continue;
        }
        allFlatEntityOperationRecordByMetadataName[metadataName] = flatEntityOperationRecord;
    }
    return allFlatEntityOperationRecordByMetadataName;
};

//# sourceMappingURL=build-all-flat-entity-operation-record-by-metadata-name-from-from-to.util.js.map
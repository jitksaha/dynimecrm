"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FieldUniqueBackingIndexOnUpdateSideEffectHandlerService", {
    enumerable: true,
    get: function() {
        return FieldUniqueBackingIndexOnUpdateSideEffectHandlerService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _generatedeterministicindexforflatfieldmetadataorthrowutil = require("../../../../flat-field-metadata/utils/generate-deterministic-index-for-flat-field-metadata-or-throw.util");
const _ismorphorrelationflatfieldmetadatautil = require("../../../../flat-field-metadata/utils/is-morph-or-relation-flat-field-metadata.util");
const _isprimarykeyflatfieldmetadatautil = require("../../../../flat-field-metadata/utils/is-primary-key-flat-field-metadata.util");
const _buildfieldsideeffectparentnotfoundfailureutil = require("../utils/build-field-side-effect-parent-not-found-failure.util");
const _resolveparentflatobjectmetadataafterstateforfieldsideeffectutil = require("../utils/resolve-parent-flat-object-metadata-after-state-for-field-side-effect.util");
const _basemetadatasideeffecthandlerservice = require("../../../interfaces/base-metadata-side-effect-handler.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let FieldUniqueBackingIndexOnUpdateSideEffectHandlerService = class FieldUniqueBackingIndexOnUpdateSideEffectHandlerService extends (0, _basemetadatasideeffecthandlerservice.MetadataSideEffectHandler)({
    operation: 'update',
    metadataName: 'fieldMetadata',
    name: 'fieldUniqueBackingIndexOnUpdate',
    description: "Keep a unique scalar field's backing UNIQUE index in sync when its `isUnique` flag flips or the field is renamed (drop the stale index and recreate the deterministic one)."
}) {
    buildSideEffects({ flatEntity: flatFieldMetadata, allFlatEntityOperationRecordByMetadataName, relatedFlatEntityMaps }) {
        if ((0, _ismorphorrelationflatfieldmetadatautil.isMorphOrRelationUniversalFlatFieldMetadata)(flatFieldMetadata)) {
            return {
                status: 'noop'
            };
        }
        if ((0, _isprimarykeyflatfieldmetadatautil.isPrimaryKeyFlatFieldMetadata)(flatFieldMetadata)) {
            return {
                status: 'noop'
            };
        }
        const existingFlatFieldMetadata = relatedFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[flatFieldMetadata.universalIdentifier];
        if (!(0, _utils.isDefined)(existingFlatFieldMetadata)) {
            return {
                status: 'noop'
            };
        }
        const wasRenamed = existingFlatFieldMetadata.name !== flatFieldMetadata.name;
        const uniquenessHasFlipped = existingFlatFieldMetadata.isUnique !== flatFieldMetadata.isUnique;
        const backingIndexMustFollowRename = existingFlatFieldMetadata.isUnique === true && flatFieldMetadata.isUnique === true && wasRenamed;
        if (!uniquenessHasFlipped && !backingIndexMustFollowRename) {
            return {
                status: 'noop'
            };
        }
        const existingFlatObjectMetadata = relatedFlatEntityMaps.flatObjectMetadataMaps.byUniversalIdentifier[flatFieldMetadata.objectMetadataUniversalIdentifier];
        const optimisticFlatObjectMetadata = (0, _resolveparentflatobjectmetadataafterstateforfieldsideeffectutil.resolveParentFlatObjectMetadataAfterStateForFieldSideEffect)({
            objectMetadataUniversalIdentifier: flatFieldMetadata.objectMetadataUniversalIdentifier,
            allFlatEntityOperationRecordByMetadataName,
            relatedFlatEntityMaps
        });
        const backingIndexMustBeDeleted = existingFlatFieldMetadata.isUnique === true;
        const backingIndexMustBeCreated = flatFieldMetadata.isUnique === true;
        if (backingIndexMustBeDeleted && !(0, _utils.isDefined)(existingFlatObjectMetadata) || backingIndexMustBeCreated && !(0, _utils.isDefined)(optimisticFlatObjectMetadata)) {
            return (0, _buildfieldsideeffectparentnotfoundfailureutil.buildFieldSideEffectParentNotFoundFailure)({
                flatFieldMetadata,
                operation: 'update'
            });
        }
        const previousFlatIndexMetadata = backingIndexMustBeDeleted && (0, _utils.isDefined)(existingFlatObjectMetadata) ? (0, _generatedeterministicindexforflatfieldmetadataorthrowutil.generateDeterministicIndexForFlatFieldMetadataOrThrow)({
            flatFieldMetadata: {
                ...flatFieldMetadata,
                name: existingFlatFieldMetadata.name,
                isUnique: true
            },
            flatObjectMetadata: existingFlatObjectMetadata
        }) : undefined;
        const flatIndexMetadataToDelete = (0, _utils.isDefined)(previousFlatIndexMetadata) && (0, _utils.isDefined)(relatedFlatEntityMaps.flatIndexMaps.byUniversalIdentifier[previousFlatIndexMetadata.universalIdentifier]) ? previousFlatIndexMetadata : undefined;
        const flatIndexMetadataToCreate = backingIndexMustBeCreated && (0, _utils.isDefined)(optimisticFlatObjectMetadata) ? (0, _generatedeterministicindexforflatfieldmetadataorthrowutil.generateDeterministicIndexForFlatFieldMetadataOrThrow)({
            flatFieldMetadata: {
                ...flatFieldMetadata,
                isUnique: true
            },
            flatObjectMetadata: optimisticFlatObjectMetadata
        }) : undefined;
        if (!(0, _utils.isDefined)(flatIndexMetadataToCreate) && !(0, _utils.isDefined)(flatIndexMetadataToDelete)) {
            return {
                status: 'noop'
            };
        }
        return {
            status: 'success',
            operations: {
                index: {
                    ...(0, _utils.isDefined)(flatIndexMetadataToCreate) ? {
                        flatEntityToCreate: {
                            [flatIndexMetadataToCreate.universalIdentifier]: flatIndexMetadataToCreate
                        }
                    } : {},
                    ...(0, _utils.isDefined)(flatIndexMetadataToDelete) ? {
                        flatEntityToDelete: {
                            [flatIndexMetadataToDelete.universalIdentifier]: flatIndexMetadataToDelete
                        }
                    } : {}
                }
            }
        };
    }
};
FieldUniqueBackingIndexOnUpdateSideEffectHandlerService = _ts_decorate([
    (0, _common.Injectable)()
], FieldUniqueBackingIndexOnUpdateSideEffectHandlerService);

//# sourceMappingURL=field-unique-backing-index-on-update-side-effect-handler.service.js.map
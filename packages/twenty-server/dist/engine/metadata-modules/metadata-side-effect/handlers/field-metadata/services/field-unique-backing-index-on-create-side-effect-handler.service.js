"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FieldUniqueBackingIndexOnCreateSideEffectHandlerService", {
    enumerable: true,
    get: function() {
        return FieldUniqueBackingIndexOnCreateSideEffectHandlerService;
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
let FieldUniqueBackingIndexOnCreateSideEffectHandlerService = class FieldUniqueBackingIndexOnCreateSideEffectHandlerService extends (0, _basemetadatasideeffecthandlerservice.MetadataSideEffectHandler)({
    operation: 'create',
    metadataName: 'fieldMetadata',
    name: 'fieldUniqueBackingIndexOnCreate',
    description: 'When a unique scalar field is created, generate the single-field UNIQUE index that enforces its uniqueness constraint at the database level.'
}) {
    buildSideEffects({ flatEntity: flatFieldMetadata, allFlatEntityOperationRecordByMetadataName, relatedFlatEntityMaps }) {
        if (flatFieldMetadata.isUnique !== true || (0, _ismorphorrelationflatfieldmetadatautil.isMorphOrRelationUniversalFlatFieldMetadata)(flatFieldMetadata)) {
            return {
                status: 'noop'
            };
        }
        if ((0, _isprimarykeyflatfieldmetadatautil.isPrimaryKeyFlatFieldMetadata)(flatFieldMetadata)) {
            return {
                status: 'noop'
            };
        }
        const parentFlatObjectMetadata = (0, _resolveparentflatobjectmetadataafterstateforfieldsideeffectutil.resolveParentFlatObjectMetadataAfterStateForFieldSideEffect)({
            objectMetadataUniversalIdentifier: flatFieldMetadata.objectMetadataUniversalIdentifier,
            allFlatEntityOperationRecordByMetadataName,
            relatedFlatEntityMaps
        });
        if (!(0, _utils.isDefined)(parentFlatObjectMetadata)) {
            return (0, _buildfieldsideeffectparentnotfoundfailureutil.buildFieldSideEffectParentNotFoundFailure)({
                flatFieldMetadata,
                operation: 'create'
            });
        }
        const flatIndexMetadata = (0, _generatedeterministicindexforflatfieldmetadataorthrowutil.generateDeterministicIndexForFlatFieldMetadataOrThrow)({
            flatFieldMetadata,
            flatObjectMetadata: parentFlatObjectMetadata
        });
        return {
            status: 'success',
            operations: {
                index: {
                    flatEntityToCreate: {
                        [flatIndexMetadata.universalIdentifier]: flatIndexMetadata
                    }
                }
            }
        };
    }
};
FieldUniqueBackingIndexOnCreateSideEffectHandlerService = _ts_decorate([
    (0, _common.Injectable)()
], FieldUniqueBackingIndexOnCreateSideEffectHandlerService);

//# sourceMappingURL=field-unique-backing-index-on-create-side-effect-handler.service.js.map
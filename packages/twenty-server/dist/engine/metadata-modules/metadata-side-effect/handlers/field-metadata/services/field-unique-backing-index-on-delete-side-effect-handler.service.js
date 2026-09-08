"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FieldUniqueBackingIndexOnDeleteSideEffectHandlerService", {
    enumerable: true,
    get: function() {
        return FieldUniqueBackingIndexOnDeleteSideEffectHandlerService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _generatedeterministicindexforflatfieldmetadataorthrowutil = require("../../../../flat-field-metadata/utils/generate-deterministic-index-for-flat-field-metadata-or-throw.util");
const _ismorphorrelationflatfieldmetadatautil = require("../../../../flat-field-metadata/utils/is-morph-or-relation-flat-field-metadata.util");
const _buildfieldsideeffectparentnotfoundfailureutil = require("../utils/build-field-side-effect-parent-not-found-failure.util");
const _basemetadatasideeffecthandlerservice = require("../../../interfaces/base-metadata-side-effect-handler.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let FieldUniqueBackingIndexOnDeleteSideEffectHandlerService = class FieldUniqueBackingIndexOnDeleteSideEffectHandlerService extends (0, _basemetadatasideeffecthandlerservice.MetadataSideEffectHandler)({
    operation: 'delete',
    metadataName: 'fieldMetadata',
    name: 'fieldUniqueBackingIndexOnDelete',
    description: 'When a unique scalar field is deleted, cascade-delete the single-field UNIQUE index that backed its uniqueness constraint.'
}) {
    buildSideEffects({ flatEntity: flatFieldMetadata, relatedFlatEntityMaps }) {
        if (flatFieldMetadata.isUnique !== true || (0, _ismorphorrelationflatfieldmetadatautil.isMorphOrRelationUniversalFlatFieldMetadata)(flatFieldMetadata)) {
            return {
                status: 'noop'
            };
        }
        const parentFlatObjectMetadata = relatedFlatEntityMaps.flatObjectMetadataMaps.byUniversalIdentifier[flatFieldMetadata.objectMetadataUniversalIdentifier];
        if (!(0, _utils.isDefined)(parentFlatObjectMetadata)) {
            return (0, _buildfieldsideeffectparentnotfoundfailureutil.buildFieldSideEffectParentNotFoundFailure)({
                flatFieldMetadata,
                operation: 'delete'
            });
        }
        const flatIndexMetadataToDelete = (0, _generatedeterministicindexforflatfieldmetadataorthrowutil.generateDeterministicIndexForFlatFieldMetadataOrThrow)({
            flatFieldMetadata,
            flatObjectMetadata: parentFlatObjectMetadata
        });
        const indexExistsInWorkspace = (0, _utils.isDefined)(relatedFlatEntityMaps.flatIndexMaps.byUniversalIdentifier[flatIndexMetadataToDelete.universalIdentifier]);
        if (!indexExistsInWorkspace) {
            return {
                status: 'noop'
            };
        }
        return {
            status: 'success',
            operations: {
                index: {
                    flatEntityToDelete: {
                        [flatIndexMetadataToDelete.universalIdentifier]: flatIndexMetadataToDelete
                    }
                }
            }
        };
    }
};
FieldUniqueBackingIndexOnDeleteSideEffectHandlerService = _ts_decorate([
    (0, _common.Injectable)()
], FieldUniqueBackingIndexOnDeleteSideEffectHandlerService);

//# sourceMappingURL=field-unique-backing-index-on-delete-side-effect-handler.service.js.map
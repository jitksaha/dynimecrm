"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ObjectSystemRelationsOnUpdateSideEffectHandlerService", {
    enumerable: true,
    get: function() {
        return ObjectSystemRelationsOnUpdateSideEffectHandlerService;
    }
});
const _core = require("@lingui/core");
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _renamerelatedmorphfieldonobjectnamesupdateutil = require("../../../../flat-object-metadata/utils/rename-related-morph-field-on-object-names-update.util");
const _metadatasideeffectexceptioncode = require("../../../exceptions/metadata-side-effect-exception-code");
const _basemetadatasideeffecthandlerservice = require("../../../interfaces/base-metadata-side-effect-handler.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ObjectSystemRelationsOnUpdateSideEffectHandlerService = class ObjectSystemRelationsOnUpdateSideEffectHandlerService extends (0, _basemetadatasideeffecthandlerservice.MetadataSideEffectHandler)({
    operation: 'update',
    metadataName: 'objectMetadata',
    name: 'objectSystemRelationsOnUpdate',
    description: 'When an object is renamed, rename the reverse MORPH_RELATION fields of its default relations to the standard objects (timelineActivity, attachment, noteTarget, taskTarget) and recompute their join-column index names. These reverse fields are isSystemSideEffect, so the engine is their sole authority on rename across both the API and manifest-sync paths (the API transpiler renames only user-authored morph relations). The reverse field universal identifier is name-free, so a rename stays a lossless update. The computed updates are emitted unconditionally; any universal identifier collision with a caller-provided operation is arbitrated by the engine merge.'
}) {
    buildSideEffects({ flatEntity: updatedFlatObjectMetadata, relatedFlatEntityMaps }) {
        const existingFlatObjectMetadata = relatedFlatEntityMaps.flatObjectMetadataMaps.byUniversalIdentifier[updatedFlatObjectMetadata.universalIdentifier];
        if (!(0, _utils.isDefined)(existingFlatObjectMetadata)) {
            return {
                status: 'fail',
                type: 'update',
                metadataName: 'objectMetadata',
                flatEntityMinimalInformation: {
                    universalIdentifier: updatedFlatObjectMetadata.universalIdentifier,
                    nameSingular: updatedFlatObjectMetadata.nameSingular
                },
                errors: [
                    {
                        code: _metadatasideeffectexceptioncode.MetadataSideEffectExceptionCode.SIDE_EFFECT_PARENT_METADATA_NOT_FOUND,
                        message: _core.i18n._(/*i18n*/ {
                            id: "NJXy7w",
                            message: 'Could not resolve the existing object "{0}" to rename its default relations',
                            values: {
                                0: updatedFlatObjectMetadata.nameSingular
                            }
                        }),
                        userFriendlyMessage: /*i18n*/ {
                            id: "w/9iNJ",
                            message: "The object to rename could not be found to update its default relations"
                        }
                    }
                ]
            };
        }
        const isRenamed = existingFlatObjectMetadata.nameSingular !== updatedFlatObjectMetadata.nameSingular || existingFlatObjectMetadata.namePlural !== updatedFlatObjectMetadata.namePlural;
        if (!isRenamed) {
            return {
                status: 'noop'
            };
        }
        const { morphFlatFieldMetadatasToUpdate, morphRelatedFlatIndexesToUpdate } = (0, _renamerelatedmorphfieldonobjectnamesupdateutil.renameRelatedMorphFieldOnObjectNamesUpdate)({
            fromFlatObjectMetadata: existingFlatObjectMetadata,
            toFlatObjectMetadata: {
                ...existingFlatObjectMetadata,
                nameSingular: updatedFlatObjectMetadata.nameSingular,
                namePlural: updatedFlatObjectMetadata.namePlural
            },
            flatFieldMetadataMaps: relatedFlatEntityMaps.flatFieldMetadataMaps,
            flatObjectMetadataMaps: relatedFlatEntityMaps.flatObjectMetadataMaps,
            flatIndexMaps: relatedFlatEntityMaps.flatIndexMaps,
            systemSideEffectMorphFieldsOnly: true
        });
        if (morphFlatFieldMetadatasToUpdate.length === 0 && morphRelatedFlatIndexesToUpdate.length === 0) {
            return {
                status: 'noop'
            };
        }
        return {
            status: 'success',
            operations: {
                fieldMetadata: {
                    flatEntityToUpdate: (0, _utils.fromArrayToUniqueKeyRecord)({
                        array: morphFlatFieldMetadatasToUpdate,
                        uniqueKey: 'universalIdentifier'
                    })
                },
                index: {
                    flatEntityToUpdate: (0, _utils.fromArrayToUniqueKeyRecord)({
                        array: morphRelatedFlatIndexesToUpdate,
                        uniqueKey: 'universalIdentifier'
                    })
                }
            }
        };
    }
};
ObjectSystemRelationsOnUpdateSideEffectHandlerService = _ts_decorate([
    (0, _common.Injectable)()
], ObjectSystemRelationsOnUpdateSideEffectHandlerService);

//# sourceMappingURL=object-system-relations-on-update-side-effect-handler.service.js.map
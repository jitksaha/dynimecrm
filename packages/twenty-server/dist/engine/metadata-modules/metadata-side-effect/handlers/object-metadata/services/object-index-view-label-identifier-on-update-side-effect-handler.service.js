"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ObjectIndexViewLabelIdentifierOnUpdateSideEffectHandlerService", {
    enumerable: true,
    get: function() {
        return ObjectIndexViewLabelIdentifierOnUpdateSideEffectHandlerService;
    }
});
const _core = require("@lingui/core");
const _common = require("@nestjs/common");
const _application = require("twenty-shared/application");
const _utils = require("twenty-shared/utils");
const _metadatasideeffectexceptioncode = require("../../../exceptions/metadata-side-effect-exception-code");
const _basemetadatasideeffecthandlerservice = require("../../../interfaces/base-metadata-side-effect-handler.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ObjectIndexViewLabelIdentifierOnUpdateSideEffectHandlerService = class ObjectIndexViewLabelIdentifierOnUpdateSideEffectHandlerService extends (0, _basemetadatasideeffecthandlerservice.MetadataSideEffectHandler)({
    operation: 'update',
    metadataName: 'objectMetadata',
    name: 'objectIndexViewLabelIdentifierOnUpdate',
    description: 'When an object label identifier changes onto a pre-existing field, keep that field INDEX view field strictly lowest and visible, as the flat view field validator requires. The engine owns the INDEX view, so this is a system side effect on both the API and manifest-sync paths, and only the engine-owned view field is touched. Relabeling onto a field created in the same operation is handled by fieldIndexViewFieldOnCreate instead (its view field does not exist yet to be updated), so this handler considers only synced view fields. Noop when the label identifier is unchanged, when the object has no engine-owned INDEX view, when the new label identifier has no synced INDEX view field, or when that view field is already visible and strictly lowest.'
}) {
    buildSideEffects({ flatEntity: updatedFlatObjectMetadata, relatedFlatEntityMaps }) {
        const existingFlatObjectMetadata = relatedFlatEntityMaps.flatObjectMetadataMaps.byUniversalIdentifier[updatedFlatObjectMetadata.universalIdentifier];
        if (!(0, _utils.isDefined)(existingFlatObjectMetadata)) {
            return {
                status: 'fail',
                type: 'update',
                metadataName: 'objectMetadata',
                flatEntityMinimalInformation: {
                    universalIdentifier: updatedFlatObjectMetadata.universalIdentifier
                },
                errors: [
                    {
                        code: _metadatasideeffectexceptioncode.MetadataSideEffectExceptionCode.SIDE_EFFECT_PARENT_METADATA_NOT_FOUND,
                        message: _core.i18n._(/*i18n*/ {
                            id: "5rS7nl",
                            message: "Could not resolve the existing object to reconcile its INDEX label identifier view field"
                        }),
                        userFriendlyMessage: /*i18n*/ {
                            id: "s9DUGk",
                            message: "The object to update could not be found to reconcile its INDEX view"
                        }
                    }
                ]
            };
        }
        const newLabelIdentifierFieldMetadataUniversalIdentifier = updatedFlatObjectMetadata.labelIdentifierFieldMetadataUniversalIdentifier;
        if (existingFlatObjectMetadata.labelIdentifierFieldMetadataUniversalIdentifier === newLabelIdentifierFieldMetadataUniversalIdentifier || !(0, _utils.isDefined)(newLabelIdentifierFieldMetadataUniversalIdentifier)) {
            return {
                status: 'noop'
            };
        }
        const indexViewUniversalIdentifier = (0, _application.getSystemViewUniversalIdentifier)({
            objectMetadataApplicationUniversalIdentifier: updatedFlatObjectMetadata.applicationUniversalIdentifier,
            objectUniversalIdentifier: updatedFlatObjectMetadata.universalIdentifier,
            viewKey: _application.SYSTEM_VIEW_KEYS.INDEX
        });
        const indexFlatView = relatedFlatEntityMaps.flatViewMaps.byUniversalIdentifier[indexViewUniversalIdentifier];
        if (!(0, _utils.isDefined)(indexFlatView) || indexFlatView.isSystemSideEffect !== true || (0, _utils.isDefined)(indexFlatView.deletedAt)) {
            return {
                status: 'noop'
            };
        }
        const indexFlatViewFields = indexFlatView.viewFieldUniversalIdentifiers.map((viewFieldUniversalIdentifier)=>relatedFlatEntityMaps.flatViewFieldMaps.byUniversalIdentifier[viewFieldUniversalIdentifier]).filter(_utils.isDefined).filter((flatViewField)=>flatViewField.isActive && !(0, _utils.isDefined)(flatViewField.deletedAt));
        const labelIdentifierFlatViewField = indexFlatViewFields.find((flatViewField)=>flatViewField.fieldMetadataUniversalIdentifier === newLabelIdentifierFieldMetadataUniversalIdentifier);
        if (!(0, _utils.isDefined)(labelIdentifierFlatViewField)) {
            return {
                status: 'noop'
            };
        }
        const otherPositions = indexFlatViewFields.filter((flatViewField)=>flatViewField.universalIdentifier !== labelIdentifierFlatViewField.universalIdentifier).map((flatViewField)=>flatViewField.position);
        const isAlreadyLowestAndVisible = labelIdentifierFlatViewField.isVisible && (otherPositions.length === 0 || labelIdentifierFlatViewField.position < Math.min(...otherPositions));
        if (isAlreadyLowestAndVisible) {
            return {
                status: 'noop'
            };
        }
        const targetPosition = otherPositions.length === 0 ? 0 : Math.min(...otherPositions) - 1;
        return {
            status: 'success',
            operations: {
                viewField: {
                    flatEntityToUpdate: {
                        [labelIdentifierFlatViewField.universalIdentifier]: {
                            ...labelIdentifierFlatViewField,
                            position: targetPosition,
                            isVisible: true
                        }
                    }
                }
            }
        };
    }
};
ObjectIndexViewLabelIdentifierOnUpdateSideEffectHandlerService = _ts_decorate([
    (0, _common.Injectable)()
], ObjectIndexViewLabelIdentifierOnUpdateSideEffectHandlerService);

//# sourceMappingURL=object-index-view-label-identifier-on-update-side-effect-handler.service.js.map
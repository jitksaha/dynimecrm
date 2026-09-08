"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ObjectRecordPageLabelIdentifierOnUpdateSideEffectHandlerService", {
    enumerable: true,
    get: function() {
        return ObjectRecordPageLabelIdentifierOnUpdateSideEffectHandlerService;
    }
});
const _core = require("@lingui/core");
const _common = require("@nestjs/common");
const _application = require("twenty-shared/application");
const _utils = require("twenty-shared/utils");
const _findmanyflatentitybyuniversalidentifierinuniversalflatentitymapsutil = require("../../../../flat-entity/utils/find-many-flat-entity-by-universal-identifier-in-universal-flat-entity-maps.util");
const _metadatasideeffectexceptioncode = require("../../../exceptions/metadata-side-effect-exception-code");
const _computerecordpageviewfieldforexistingobjectutil = require("../../utils/compute-record-page-view-field-for-existing-object.util");
const _basemetadatasideeffecthandlerservice = require("../../../interfaces/base-metadata-side-effect-handler.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ObjectRecordPageLabelIdentifierOnUpdateSideEffectHandlerService = class ObjectRecordPageLabelIdentifierOnUpdateSideEffectHandlerService extends (0, _basemetadatasideeffecthandlerservice.MetadataSideEffectHandler)({
    operation: 'update',
    metadataName: 'objectMetadata',
    name: 'objectRecordPageLabelIdentifierOnUpdate',
    description: 'When an object label identifier changes onto a pre-existing field, preserve the record-page exclusion invariant, the inverse of objectIndexViewLabelIdentifierOnUpdate: the engine-owned FIELDS_WIDGET record-page view never displays the label identifier (the record page shows it in the title), so the new label identifier engine-owned view field is deleted from the record-page view, and the previous label identifier gets its view field restored through the widget-driven builder (visibility from the FIELDS widget newFieldDefaultVisibility, appended into the last active group). Only engine-owned (isSystemSideEffect) view fields are touched. Relabeling onto a field created in the same operation is handled by fieldRecordPageViewFieldOnCreate instead. The restore is emitted even when the caller batch declares a view field for the same (view, field) pair: the engine always produces its system side effects, and the pair-uniqueness validator surfaces the conflict to the caller. Noop when the label identifier is unchanged, when the object has no engine-owned record-page view, when the new label identifier has no engine-owned record-page view field and the old one is already displayed or not restorable.'
}) {
    buildSideEffects({ flatEntity: updatedFlatObjectMetadata, allFlatEntityOperationRecordByMetadataName, relatedFlatEntityMaps }) {
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
                            id: "TYpgQ/",
                            message: "Could not resolve the existing object to reconcile its record-page label identifier view field"
                        }),
                        userFriendlyMessage: /*i18n*/ {
                            id: "/QTsIU",
                            message: "The object to update could not be found to reconcile its record page"
                        }
                    }
                ]
            };
        }
        const previousLabelIdentifierFieldMetadataUniversalIdentifier = existingFlatObjectMetadata.labelIdentifierFieldMetadataUniversalIdentifier;
        const newLabelIdentifierFieldMetadataUniversalIdentifier = updatedFlatObjectMetadata.labelIdentifierFieldMetadataUniversalIdentifier;
        if (previousLabelIdentifierFieldMetadataUniversalIdentifier === newLabelIdentifierFieldMetadataUniversalIdentifier || !(0, _utils.isDefined)(newLabelIdentifierFieldMetadataUniversalIdentifier)) {
            return {
                status: 'noop'
            };
        }
        const recordPageViewUniversalIdentifier = (0, _application.getSystemViewUniversalIdentifier)({
            objectMetadataApplicationUniversalIdentifier: updatedFlatObjectMetadata.applicationUniversalIdentifier,
            objectUniversalIdentifier: updatedFlatObjectMetadata.universalIdentifier,
            viewKey: _application.SYSTEM_VIEW_KEYS.FIELDS_WIDGET
        });
        const recordPageFlatView = relatedFlatEntityMaps.flatViewMaps.byUniversalIdentifier[recordPageViewUniversalIdentifier];
        if (!(0, _utils.isDefined)(recordPageFlatView) || recordPageFlatView.isSystemSideEffect !== true || (0, _utils.isDefined)(recordPageFlatView.deletedAt)) {
            return {
                status: 'noop'
            };
        }
        const recordPageFlatViewFields = (0, _findmanyflatentitybyuniversalidentifierinuniversalflatentitymapsutil.findManyFlatEntityByUniversalIdentifierInUniversalFlatEntityMaps)({
            flatEntityMaps: relatedFlatEntityMaps.flatViewFieldMaps,
            universalIdentifiers: recordPageFlatView.viewFieldUniversalIdentifiers
        }).filter((flatViewField)=>!(0, _utils.isDefined)(flatViewField.deletedAt));
        const newLabelIdentifierFlatViewFieldToDelete = recordPageFlatViewFields.find((flatViewField)=>flatViewField.fieldMetadataUniversalIdentifier === newLabelIdentifierFieldMetadataUniversalIdentifier && flatViewField.isSystemSideEffect === true);
        const previousLabelIdentifierFlatViewFieldToCreate = this.buildRestoredPreviousLabelIdentifierViewField({
            previousLabelIdentifierFieldMetadataUniversalIdentifier,
            recordPageViewUniversalIdentifier,
            recordPageFlatViewFields,
            allFlatEntityOperationRecordByMetadataName,
            relatedFlatEntityMaps
        });
        const operations = {};
        if ((0, _utils.isDefined)(newLabelIdentifierFlatViewFieldToDelete) || (0, _utils.isDefined)(previousLabelIdentifierFlatViewFieldToCreate)) {
            operations.viewField = {
                ...(0, _utils.isDefined)(newLabelIdentifierFlatViewFieldToDelete) ? {
                    flatEntityToDelete: {
                        [newLabelIdentifierFlatViewFieldToDelete.universalIdentifier]: newLabelIdentifierFlatViewFieldToDelete
                    }
                } : {},
                ...(0, _utils.isDefined)(previousLabelIdentifierFlatViewFieldToCreate) ? {
                    flatEntityToCreate: {
                        [previousLabelIdentifierFlatViewFieldToCreate.universalIdentifier]: previousLabelIdentifierFlatViewFieldToCreate
                    }
                } : {}
            };
        }
        if (Object.keys(operations).length === 0) {
            return {
                status: 'noop'
            };
        }
        return {
            status: 'success',
            operations
        };
    }
    buildRestoredPreviousLabelIdentifierViewField({ previousLabelIdentifierFieldMetadataUniversalIdentifier, recordPageViewUniversalIdentifier, recordPageFlatViewFields, allFlatEntityOperationRecordByMetadataName, relatedFlatEntityMaps }) {
        if (!(0, _utils.isDefined)(previousLabelIdentifierFieldMetadataUniversalIdentifier)) {
            return undefined;
        }
        const previousLabelIdentifierDeletedInSameBatch = (0, _utils.isDefined)(allFlatEntityOperationRecordByMetadataName.fieldMetadata?.flatEntityToDelete[previousLabelIdentifierFieldMetadataUniversalIdentifier]);
        if (previousLabelIdentifierDeletedInSameBatch) {
            return undefined;
        }
        const previousLabelIdentifierFlatFieldMetadata = relatedFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[previousLabelIdentifierFieldMetadataUniversalIdentifier];
        if (!(0, _utils.isDefined)(previousLabelIdentifierFlatFieldMetadata)) {
            return undefined;
        }
        const previousLabelIdentifierAlreadyDisplayed = recordPageFlatViewFields.some((flatViewField)=>flatViewField.fieldMetadataUniversalIdentifier === previousLabelIdentifierFieldMetadataUniversalIdentifier);
        if (previousLabelIdentifierAlreadyDisplayed) {
            return undefined;
        }
        return (0, _computerecordpageviewfieldforexistingobjectutil.computeRecordPageViewFieldForExistingObject)({
            sourceFlatFieldMetadata: previousLabelIdentifierFlatFieldMetadata,
            recordPageViewUniversalIdentifier,
            flatViewMaps: relatedFlatEntityMaps.flatViewMaps,
            flatViewFieldMaps: relatedFlatEntityMaps.flatViewFieldMaps,
            flatViewFieldGroupMaps: relatedFlatEntityMaps.flatViewFieldGroupMaps,
            flatPageLayoutWidgetMaps: relatedFlatEntityMaps.flatPageLayoutWidgetMaps
        });
    }
};
ObjectRecordPageLabelIdentifierOnUpdateSideEffectHandlerService = _ts_decorate([
    (0, _common.Injectable)()
], ObjectRecordPageLabelIdentifierOnUpdateSideEffectHandlerService);

//# sourceMappingURL=object-record-page-label-identifier-on-update-side-effect-handler.service.js.map
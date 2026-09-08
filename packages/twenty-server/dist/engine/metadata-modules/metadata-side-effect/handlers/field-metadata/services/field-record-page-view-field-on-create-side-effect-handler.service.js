"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FieldRecordPageViewFieldOnCreateSideEffectHandlerService", {
    enumerable: true,
    get: function() {
        return FieldRecordPageViewFieldOnCreateSideEffectHandlerService;
    }
});
const _common = require("@nestjs/common");
const _application = require("twenty-shared/application");
const _utils = require("twenty-shared/utils");
const _defaultviewfieldsizeconstant = require("../../../../flat-view-field/constants/default-view-field-size.constant");
const _buildfieldsideeffectparentnotfoundfailureutil = require("../utils/build-field-side-effect-parent-not-found-failure.util");
const _resolveparentflatobjectmetadataafterstateforfieldsideeffectutil = require("../utils/resolve-parent-flat-object-metadata-after-state-for-field-side-effect.util");
const _computerecordpageviewfieldforexistingobjectutil = require("../../utils/compute-record-page-view-field-for-existing-object.util");
const _computesamebatchviewfieldpositionbyfielduniversalidentifierutil = require("../../utils/compute-same-batch-view-field-position-by-field-universal-identifier.util");
const _basemetadatasideeffecthandlerservice = require("../../../interfaces/base-metadata-side-effect-handler.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let FieldRecordPageViewFieldOnCreateSideEffectHandlerService = class FieldRecordPageViewFieldOnCreateSideEffectHandlerService extends (0, _basemetadatasideeffecthandlerservice.MetadataSideEffectHandler)({
    operation: 'create',
    metadataName: 'fieldMetadata',
    name: 'fieldRecordPageViewFieldOnCreate',
    description: 'When a caller-provided field is created, provision its engine-owned view field on the engine-owned FIELDS_WIDGET record-page view, resolved strictly by its derived universal identifier. On an existing object the emission is widget-driven: visibility follows the FIELDS widget newFieldDefaultVisibility and the view field appends into the last active view field group, degrading to no group (the common case: custom objects are created with zero groups). On same-batch object+field creation no widget map exists yet, so the default widget configuration is derived statelessly from the constant (visible, no group, deterministic caller-then-system position shared with objectRecordPageOnCreate). Noop when the object has no engine record-page view, when no active FIELDS widget references it, when the widget does not declare newFieldDefaultVisibility, when the field is the object label identifier (the record page displays it in the title), or when the (view, field) pair is already synced, whatever its identifier. A caller-pending view field for the same pair is not deferred to: the engine always produces its system side effects, and the pair-uniqueness validator surfaces the conflict to the caller, exactly like INDEX. The INDEX counterpart is fieldIndexViewFieldOnCreate.'
}) {
    buildSideEffects({ flatEntity: sourceFlatFieldMetadata, allFlatEntityOperationRecordByMetadataName, relatedFlatEntityMaps }) {
        const { objectMetadataUniversalIdentifier } = sourceFlatFieldMetadata;
        const parentFlatObjectMetadata = (0, _resolveparentflatobjectmetadataafterstateforfieldsideeffectutil.resolveParentFlatObjectMetadataAfterStateForFieldSideEffect)({
            objectMetadataUniversalIdentifier,
            allFlatEntityOperationRecordByMetadataName,
            relatedFlatEntityMaps
        });
        if (!(0, _utils.isDefined)(parentFlatObjectMetadata)) {
            return (0, _buildfieldsideeffectparentnotfoundfailureutil.buildFieldSideEffectParentNotFoundFailure)({
                flatFieldMetadata: sourceFlatFieldMetadata,
                operation: 'create'
            });
        }
        const recordPageViewUniversalIdentifier = (0, _application.getSystemViewUniversalIdentifier)({
            objectMetadataApplicationUniversalIdentifier: parentFlatObjectMetadata.applicationUniversalIdentifier,
            objectUniversalIdentifier: objectMetadataUniversalIdentifier,
            viewKey: _application.SYSTEM_VIEW_KEYS.FIELDS_WIDGET
        });
        const parentObjectCreatedInSameBatch = (0, _utils.isDefined)(allFlatEntityOperationRecordByMetadataName.objectMetadata?.flatEntityToCreate[objectMetadataUniversalIdentifier]);
        const flatRecordPageViewFieldToCreate = parentObjectCreatedInSameBatch ? this.buildRecordPageViewFieldForObjectCreatedInSameBatch({
            sourceFlatFieldMetadata,
            parentFlatObjectMetadata,
            recordPageViewUniversalIdentifier,
            allFlatEntityOperationRecordByMetadataName
        }) : this.buildRecordPageViewFieldForExistingObject({
            sourceFlatFieldMetadata,
            parentFlatObjectMetadata,
            recordPageViewUniversalIdentifier,
            relatedFlatEntityMaps
        });
        if (!(0, _utils.isDefined)(flatRecordPageViewFieldToCreate)) {
            return {
                status: 'noop'
            };
        }
        return {
            status: 'success',
            operations: {
                viewField: {
                    flatEntityToCreate: {
                        [flatRecordPageViewFieldToCreate.universalIdentifier]: flatRecordPageViewFieldToCreate
                    }
                }
            }
        };
    }
    buildRecordPageViewFieldForObjectCreatedInSameBatch({ sourceFlatFieldMetadata, parentFlatObjectMetadata, recordPageViewUniversalIdentifier, allFlatEntityOperationRecordByMetadataName }) {
        const { labelIdentifierFieldMetadataUniversalIdentifier } = parentFlatObjectMetadata;
        if (sourceFlatFieldMetadata.universalIdentifier === labelIdentifierFieldMetadataUniversalIdentifier) {
            return undefined;
        }
        const positionByFieldUniversalIdentifier = (0, _computesamebatchviewfieldpositionbyfielduniversalidentifierutil.computeSameBatchViewFieldPositionByFieldUniversalIdentifier)({
            sourceFlatFieldMetadata,
            parentFlatObjectMetadata,
            allFlatEntityOperationRecordByMetadataName,
            labelIdentifierPolicy: 'excluded'
        });
        const createdAt = new Date().toISOString();
        const { applicationUniversalIdentifier } = sourceFlatFieldMetadata;
        return {
            universalIdentifier: (0, _application.getSystemViewFieldUniversalIdentifier)({
                fieldMetadataApplicationUniversalIdentifier: applicationUniversalIdentifier,
                viewUniversalIdentifier: recordPageViewUniversalIdentifier,
                fieldMetadataUniversalIdentifier: sourceFlatFieldMetadata.universalIdentifier
            }),
            applicationUniversalIdentifier,
            fieldMetadataUniversalIdentifier: sourceFlatFieldMetadata.universalIdentifier,
            viewUniversalIdentifier: recordPageViewUniversalIdentifier,
            viewFieldGroupUniversalIdentifier: null,
            isVisible: true,
            size: _defaultviewfieldsizeconstant.DEFAULT_VIEW_FIELD_SIZE,
            position: positionByFieldUniversalIdentifier.get(sourceFlatFieldMetadata.universalIdentifier) ?? 0,
            aggregateOperation: null,
            isActive: true,
            isSystemSideEffect: true,
            universalOverrides: null,
            createdAt,
            updatedAt: createdAt,
            deletedAt: null
        };
    }
    buildRecordPageViewFieldForExistingObject({ sourceFlatFieldMetadata, parentFlatObjectMetadata, recordPageViewUniversalIdentifier, relatedFlatEntityMaps }) {
        if (sourceFlatFieldMetadata.universalIdentifier === parentFlatObjectMetadata.labelIdentifierFieldMetadataUniversalIdentifier) {
            return undefined;
        }
        const existingRecordPageFlatView = relatedFlatEntityMaps.flatViewMaps.byUniversalIdentifier[recordPageViewUniversalIdentifier];
        const pairAlreadySynced = (0, _utils.isDefined)(existingRecordPageFlatView) && existingRecordPageFlatView.viewFieldUniversalIdentifiers.some((viewFieldUniversalIdentifier)=>{
            const existingFlatViewField = relatedFlatEntityMaps.flatViewFieldMaps.byUniversalIdentifier[viewFieldUniversalIdentifier];
            return (0, _utils.isDefined)(existingFlatViewField) && existingFlatViewField.fieldMetadataUniversalIdentifier === sourceFlatFieldMetadata.universalIdentifier && !(0, _utils.isDefined)(existingFlatViewField.deletedAt);
        });
        if (pairAlreadySynced) {
            return undefined;
        }
        return (0, _computerecordpageviewfieldforexistingobjectutil.computeRecordPageViewFieldForExistingObject)({
            sourceFlatFieldMetadata,
            recordPageViewUniversalIdentifier,
            flatViewMaps: relatedFlatEntityMaps.flatViewMaps,
            flatViewFieldMaps: relatedFlatEntityMaps.flatViewFieldMaps,
            flatViewFieldGroupMaps: relatedFlatEntityMaps.flatViewFieldGroupMaps,
            flatPageLayoutWidgetMaps: relatedFlatEntityMaps.flatPageLayoutWidgetMaps
        });
    }
};
FieldRecordPageViewFieldOnCreateSideEffectHandlerService = _ts_decorate([
    (0, _common.Injectable)()
], FieldRecordPageViewFieldOnCreateSideEffectHandlerService);

//# sourceMappingURL=field-record-page-view-field-on-create-side-effect-handler.service.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FieldIndexViewFieldOnCreateSideEffectHandlerService", {
    enumerable: true,
    get: function() {
        return FieldIndexViewFieldOnCreateSideEffectHandlerService;
    }
});
const _common = require("@nestjs/common");
const _application = require("twenty-shared/application");
const _utils = require("twenty-shared/utils");
const _defaultviewfieldsizeconstant = require("../../../../flat-view-field/constants/default-view-field-size.constant");
const _buildfieldsideeffectparentnotfoundfailureutil = require("../utils/build-field-side-effect-parent-not-found-failure.util");
const _resolveparentflatobjectmetadataafterstateforfieldsideeffectutil = require("../utils/resolve-parent-flat-object-metadata-after-state-for-field-side-effect.util");
const _computecallerflatfieldmetadatasforobjectutil = require("../../utils/compute-caller-flat-field-metadatas-for-object.util");
const _computesamebatchviewfieldpositionbyfielduniversalidentifierutil = require("../../utils/compute-same-batch-view-field-position-by-field-universal-identifier.util");
const _basemetadatasideeffecthandlerservice = require("../../../interfaces/base-metadata-side-effect-handler.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let FieldIndexViewFieldOnCreateSideEffectHandlerService = class FieldIndexViewFieldOnCreateSideEffectHandlerService extends (0, _basemetadatasideeffecthandlerservice.MetadataSideEffectHandler)({
    operation: 'create',
    metadataName: 'fieldMetadata',
    name: 'fieldIndexViewFieldOnCreate',
    description: 'When a caller-provided field is created, provision its visible engine-owned view field on the parent object INDEX table view (every caller-provided field, relations included; engine-emitted fields get their view fields from the handler that emits them). On same-batch object+field creation the position derives statelessly from the caller-then-system contract shared with objectIndexViewOnCreate, so the layout is contiguous without ordering dependency. On an existing object the view field appends after the existing active positions, except the label identifier, which is placed strictly lowest as the flat view field validator requires. Noop when the object INDEX view does not exist under its derived identifier (unreconciled workspace). A second writer claiming the same (view, field) pair is not deferred to: it is a genuine conflict left to surface downstream (engine collision, then the flat view field validator on the pair). The record-page counterpart is fieldRecordPageViewFieldOnCreate.'
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
        const indexViewUniversalIdentifier = (0, _application.getSystemViewUniversalIdentifier)({
            objectMetadataApplicationUniversalIdentifier: parentFlatObjectMetadata.applicationUniversalIdentifier,
            objectUniversalIdentifier: objectMetadataUniversalIdentifier,
            viewKey: _application.SYSTEM_VIEW_KEYS.INDEX
        });
        const parentObjectCreatedInSameBatch = (0, _utils.isDefined)(allFlatEntityOperationRecordByMetadataName.objectMetadata?.flatEntityToCreate[objectMetadataUniversalIdentifier]);
        const flatIndexViewFieldToCreate = parentObjectCreatedInSameBatch ? this.buildIndexViewFieldForObjectCreatedInSameBatch({
            sourceFlatFieldMetadata,
            parentFlatObjectMetadata,
            indexViewUniversalIdentifier,
            allFlatEntityOperationRecordByMetadataName
        }) : this.buildIndexViewFieldForExistingObject({
            sourceFlatFieldMetadata,
            parentFlatObjectMetadata,
            indexViewUniversalIdentifier,
            allFlatEntityOperationRecordByMetadataName,
            relatedFlatEntityMaps
        });
        if (!(0, _utils.isDefined)(flatIndexViewFieldToCreate)) {
            return {
                status: 'noop'
            };
        }
        return {
            status: 'success',
            operations: {
                viewField: {
                    flatEntityToCreate: {
                        [flatIndexViewFieldToCreate.universalIdentifier]: flatIndexViewFieldToCreate
                    }
                }
            }
        };
    }
    buildIndexViewFieldForObjectCreatedInSameBatch({ sourceFlatFieldMetadata, parentFlatObjectMetadata, indexViewUniversalIdentifier, allFlatEntityOperationRecordByMetadataName }) {
        const positionByFieldUniversalIdentifier = (0, _computesamebatchviewfieldpositionbyfielduniversalidentifierutil.computeSameBatchViewFieldPositionByFieldUniversalIdentifier)({
            sourceFlatFieldMetadata,
            parentFlatObjectMetadata,
            allFlatEntityOperationRecordByMetadataName,
            labelIdentifierPolicy: 'displayedFirst'
        });
        const position = positionByFieldUniversalIdentifier.get(sourceFlatFieldMetadata.universalIdentifier) ?? 0;
        return this.buildIndexFlatViewFieldToCreate({
            sourceFlatFieldMetadata,
            indexViewUniversalIdentifier,
            position
        });
    }
    buildIndexViewFieldForExistingObject({ sourceFlatFieldMetadata, parentFlatObjectMetadata, indexViewUniversalIdentifier, allFlatEntityOperationRecordByMetadataName, relatedFlatEntityMaps }) {
        const existingIndexFlatView = relatedFlatEntityMaps.flatViewMaps.byUniversalIdentifier[indexViewUniversalIdentifier];
        if (!(0, _utils.isDefined)(existingIndexFlatView) || (0, _utils.isDefined)(existingIndexFlatView.deletedAt)) {
            return undefined;
        }
        const existingActivePositions = existingIndexFlatView.viewFieldUniversalIdentifiers.map((viewFieldUniversalIdentifier)=>relatedFlatEntityMaps.flatViewFieldMaps.byUniversalIdentifier[viewFieldUniversalIdentifier]).filter(_utils.isDefined).filter((existingFlatViewField)=>existingFlatViewField.isActive && !(0, _utils.isDefined)(existingFlatViewField.deletedAt)).map((existingFlatViewField)=>existingFlatViewField.position);
        const isLabelIdentifierField = sourceFlatFieldMetadata.universalIdentifier === parentFlatObjectMetadata.labelIdentifierFieldMetadataUniversalIdentifier;
        if (isLabelIdentifierField) {
            const lowestExistingPosition = existingActivePositions.length > 0 ? Math.min(...existingActivePositions) : 1;
            return this.buildIndexFlatViewFieldToCreate({
                sourceFlatFieldMetadata,
                indexViewUniversalIdentifier,
                position: lowestExistingPosition - 1
            });
        }
        const appendBasePosition = existingActivePositions.reduce((maxPosition, position)=>Math.max(maxPosition, position), -1) + 1;
        const callerFlatFieldMetadatas = (0, _computecallerflatfieldmetadatasforobjectutil.computeCallerFlatFieldMetadatasForObject)({
            objectMetadataUniversalIdentifier: sourceFlatFieldMetadata.objectMetadataUniversalIdentifier,
            labelIdentifierFieldMetadataUniversalIdentifier: parentFlatObjectMetadata.labelIdentifierFieldMetadataUniversalIdentifier,
            allFlatEntityOperationRecordByMetadataName
        });
        const indexAmongCallerFlatFieldMetadatas = Math.max(callerFlatFieldMetadatas.findIndex((callerFlatFieldMetadata)=>callerFlatFieldMetadata.universalIdentifier === sourceFlatFieldMetadata.universalIdentifier), 0);
        return this.buildIndexFlatViewFieldToCreate({
            sourceFlatFieldMetadata,
            indexViewUniversalIdentifier,
            position: appendBasePosition + indexAmongCallerFlatFieldMetadatas
        });
    }
    buildIndexFlatViewFieldToCreate({ sourceFlatFieldMetadata, indexViewUniversalIdentifier, position }) {
        const createdAt = new Date().toISOString();
        const { applicationUniversalIdentifier } = sourceFlatFieldMetadata;
        return {
            universalIdentifier: (0, _application.getSystemViewFieldUniversalIdentifier)({
                fieldMetadataApplicationUniversalIdentifier: applicationUniversalIdentifier,
                viewUniversalIdentifier: indexViewUniversalIdentifier,
                fieldMetadataUniversalIdentifier: sourceFlatFieldMetadata.universalIdentifier
            }),
            applicationUniversalIdentifier,
            fieldMetadataUniversalIdentifier: sourceFlatFieldMetadata.universalIdentifier,
            viewUniversalIdentifier: indexViewUniversalIdentifier,
            viewFieldGroupUniversalIdentifier: null,
            isVisible: true,
            size: _defaultviewfieldsizeconstant.DEFAULT_VIEW_FIELD_SIZE,
            position,
            aggregateOperation: null,
            isActive: true,
            isSystemSideEffect: true,
            universalOverrides: null,
            createdAt,
            updatedAt: createdAt,
            deletedAt: null
        };
    }
};
FieldIndexViewFieldOnCreateSideEffectHandlerService = _ts_decorate([
    (0, _common.Injectable)()
], FieldIndexViewFieldOnCreateSideEffectHandlerService);

//# sourceMappingURL=field-index-view-field-on-create-side-effect-handler.service.js.map
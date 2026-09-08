"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromUpdateViewInputToFlatViewToUpdateOrThrow", {
    enumerable: true,
    get: function() {
        return fromUpdateViewInputToFlatViewToUpdateOrThrow;
    }
});
const _core = require("@lingui/core");
const _utils = require("twenty-shared/utils");
const _findflatentitybyidinflatentitymapsutil = require("../../flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _resolveentityrelationuniversalidentifiersutil = require("../../flat-entity/utils/resolve-entity-relation-universal-identifiers.util");
const _flatvieweditablepropertiesconstant = require("../constants/flat-view-editable-properties.constant");
const _fromviewoverridestouniversaloverridesutil = require("./from-view-overrides-to-universal-overrides.util");
const _handleflatviewupdatesideeffectutil = require("./handle-flat-view-update-side-effect.util");
const _iscalleroverridingentityutil = require("../../utils/is-caller-overriding-entity.util");
const _sanitizeoverridableentityinpututil = require("../../utils/sanitize-overridable-entity-input.util");
const _viewexception = require("../../view/exceptions/view.exception");
const _mergeupdateinexistingrecordutil = require("../../../../utils/merge-update-in-existing-record.util");
const fromUpdateViewInputToFlatViewToUpdateOrThrow = ({ updateViewInput: rawUpdateViewInput, flatViewMaps, flatViewGroupMaps, flatFieldMetadataMaps, userWorkspaceId, callerApplicationUniversalIdentifier, workspaceCustomApplicationUniversalIdentifier })=>{
    const { id: viewToUpdateId } = (0, _utils.trimAndRemoveDuplicatedWhitespacesFromObjectStringProperties)(rawUpdateViewInput, [
        'id'
    ]);
    const existingFlatViewToUpdate = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
        flatEntityId: viewToUpdateId,
        flatEntityMaps: flatViewMaps
    });
    if (!(0, _utils.isDefined)(existingFlatViewToUpdate)) {
        throw new _viewexception.ViewException(_core.i18n._(/*i18n*/ {
            id: "3+GbNY",
            message: "View to update not found"
        }), _viewexception.ViewExceptionCode.VIEW_NOT_FOUND);
    }
    const editableProperties = (0, _utils.extractAndSanitizeObjectStringFields)(rawUpdateViewInput, _flatvieweditablepropertiesconstant.FLAT_VIEW_EDITABLE_PROPERTIES);
    const shouldOverride = (0, _iscalleroverridingentityutil.isCallerOverridingEntity)({
        callerApplicationUniversalIdentifier,
        entityApplicationUniversalIdentifier: existingFlatViewToUpdate.applicationUniversalIdentifier,
        workspaceCustomApplicationUniversalIdentifier,
        isSystemSideEffect: existingFlatViewToUpdate.isSystemSideEffect
    });
    const { overrides, updatedEditableProperties } = (0, _sanitizeoverridableentityinpututil.sanitizeOverridableEntityInput)({
        metadataName: 'view',
        existingFlatEntity: existingFlatViewToUpdate,
        updatedEditableProperties: editableProperties,
        shouldOverride
    });
    const mergedRecord = (0, _mergeupdateinexistingrecordutil.mergeUpdateInExistingRecord)({
        existing: existingFlatViewToUpdate,
        properties: [
            ..._flatvieweditablepropertiesconstant.FLAT_VIEW_EDITABLE_PROPERTIES
        ],
        update: updatedEditableProperties
    });
    const flatViewToUpdate = {
        ...mergedRecord,
        overrides
    };
    if (updatedEditableProperties.kanbanAggregateOperationFieldMetadataId !== undefined) {
        const { kanbanAggregateOperationFieldMetadataUniversalIdentifier } = (0, _resolveentityrelationuniversalidentifiersutil.resolveEntityRelationUniversalIdentifiers)({
            metadataName: 'view',
            foreignKeyValues: {
                kanbanAggregateOperationFieldMetadataId: mergedRecord.kanbanAggregateOperationFieldMetadataId
            },
            flatEntityMaps: {
                flatFieldMetadataMaps
            }
        });
        flatViewToUpdate.kanbanAggregateOperationFieldMetadataUniversalIdentifier = kanbanAggregateOperationFieldMetadataUniversalIdentifier;
    }
    if (updatedEditableProperties.calendarFieldMetadataId !== undefined) {
        const { calendarFieldMetadataUniversalIdentifier } = (0, _resolveentityrelationuniversalidentifiersutil.resolveEntityRelationUniversalIdentifiers)({
            metadataName: 'view',
            foreignKeyValues: {
                calendarFieldMetadataId: mergedRecord.calendarFieldMetadataId
            },
            flatEntityMaps: {
                flatFieldMetadataMaps
            }
        });
        flatViewToUpdate.calendarFieldMetadataUniversalIdentifier = calendarFieldMetadataUniversalIdentifier;
    }
    if (updatedEditableProperties.calendarEndFieldMetadataId !== undefined) {
        const { calendarEndFieldMetadataUniversalIdentifier } = (0, _resolveentityrelationuniversalidentifiersutil.resolveEntityRelationUniversalIdentifiers)({
            metadataName: 'view',
            foreignKeyValues: {
                calendarEndFieldMetadataId: mergedRecord.calendarEndFieldMetadataId
            },
            flatEntityMaps: {
                flatFieldMetadataMaps
            }
        });
        flatViewToUpdate.calendarEndFieldMetadataUniversalIdentifier = calendarEndFieldMetadataUniversalIdentifier;
    }
    if (updatedEditableProperties.mainGroupByFieldMetadataId !== undefined) {
        const { mainGroupByFieldMetadataUniversalIdentifier } = (0, _resolveentityrelationuniversalidentifiersutil.resolveEntityRelationUniversalIdentifiers)({
            metadataName: 'view',
            foreignKeyValues: {
                mainGroupByFieldMetadataId: mergedRecord.mainGroupByFieldMetadataId
            },
            flatEntityMaps: {
                flatFieldMetadataMaps
            }
        });
        flatViewToUpdate.mainGroupByFieldMetadataUniversalIdentifier = mainGroupByFieldMetadataUniversalIdentifier;
    }
    if ((0, _utils.isDefined)(overrides)) {
        flatViewToUpdate.universalOverrides = (0, _fromviewoverridestouniversaloverridesutil.fromViewOverridesToUniversalOverrides)({
            overrides: overrides,
            fieldMetadataUniversalIdentifierById: flatFieldMetadataMaps.universalIdentifierById
        });
    } else {
        flatViewToUpdate.universalOverrides = null;
    }
    // If changing visibility from WORKSPACE to UNLISTED, ensure createdByUserWorkspaceId is set
    // This prevents the view from disappearing for the user making the change
    if ((0, _utils.isDefined)(rawUpdateViewInput.visibility) && rawUpdateViewInput.visibility === 'UNLISTED' && existingFlatViewToUpdate.visibility === 'WORKSPACE' && (0, _utils.isDefined)(userWorkspaceId)) {
        flatViewToUpdate.createdByUserWorkspaceId = userWorkspaceId;
    }
    const effectiveFlatViewToUpdate = {
        ...mergedRecord,
        ...overrides ?? {}
    };
    const { flatViewGroupsToDelete, flatViewGroupsToCreate } = (0, _handleflatviewupdatesideeffectutil.handleFlatViewUpdateSideEffect)({
        fromFlatView: existingFlatViewToUpdate,
        toFlatView: effectiveFlatViewToUpdate,
        flatViewGroupMaps: flatViewGroupMaps,
        flatFieldMetadataMaps: flatFieldMetadataMaps
    });
    return {
        flatViewToUpdate,
        flatViewGroupsToDelete,
        flatViewGroupsToCreate
    };
};

//# sourceMappingURL=from-update-view-input-to-flat-view-to-update-or-throw.util.js.map
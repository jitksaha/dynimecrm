"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateFlatViewUpdate", {
    enumerable: true,
    get: function() {
        return validateFlatViewUpdate;
    }
});
const _core = require("@lingui/core");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _findflatentitybyuniversalidentifierutil = require("../../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _viewexception = require("../../../../../metadata-modules/view/exceptions/view.exception");
const _getflatentityvalidationerrorutil = require("../../builders/utils/get-flat-entity-validation-error.util");
const _validateflatviewcalendarfieldsutil = require("./validate-flat-view-calendar-fields.util");
const _isallowedflatviewkanbanmaingroupbyfieldutil = require("./is-allowed-flat-view-kanban-main-group-by-field.util");
const validateFlatViewUpdate = ({ universalIdentifier, flatEntityUpdate, optimisticFlatEntityMapsAndRelatedFlatEntityMaps: { flatViewMaps: optimisticFlatViewMaps, flatFieldMetadataMaps } })=>{
    const existingFlatView = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
        universalIdentifier,
        flatEntityMaps: optimisticFlatViewMaps
    });
    const validationResult = (0, _getflatentityvalidationerrorutil.getEmptyFlatEntityValidationError)({
        flatEntityMinimalInformation: {
            universalIdentifier
        },
        metadataName: 'view',
        type: 'update'
    });
    if (!(0, _utils.isDefined)(existingFlatView)) {
        validationResult.errors.push({
            code: _viewexception.ViewExceptionCode.INVALID_VIEW_DATA,
            message: _core.i18n._(/*i18n*/ {
                id: "F4A9mL",
                message: "View not found"
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "F4A9mL",
                message: "View not found"
            }
        });
        return validationResult;
    }
    const updatedFlatView = {
        ...existingFlatView,
        ...flatEntityUpdate
    };
    const kanbanAggregateOperationFieldMetadataUniversalIdentifierUpdate = flatEntityUpdate.kanbanAggregateOperationFieldMetadataUniversalIdentifier;
    if ((0, _utils.isDefined)(kanbanAggregateOperationFieldMetadataUniversalIdentifierUpdate) && kanbanAggregateOperationFieldMetadataUniversalIdentifierUpdate !== null && !(0, _utils.isDefined)((0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
        universalIdentifier: kanbanAggregateOperationFieldMetadataUniversalIdentifierUpdate,
        flatEntityMaps: flatFieldMetadataMaps
    }))) {
        validationResult.errors.push({
            code: _viewexception.ViewExceptionCode.INVALID_VIEW_DATA,
            message: _core.i18n._(/*i18n*/ {
                id: "M7KWZV",
                message: "View kanban aggregate field metadata not found"
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "M7KWZV",
                message: "View kanban aggregate field metadata not found"
            }
        });
    }
    const viewBecomesKanban = (0, _utils.getViewLayoutFromViewType)(updatedFlatView.type) === _types.ViewType.KANBAN && (0, _utils.getViewLayoutFromViewType)(existingFlatView.type) !== _types.ViewType.KANBAN;
    if (viewBecomesKanban) {
        if (!(0, _utils.isDefined)(updatedFlatView.mainGroupByFieldMetadataUniversalIdentifier)) {
            validationResult.errors.push({
                code: _viewexception.ViewExceptionCode.INVALID_VIEW_DATA,
                message: _core.i18n._(/*i18n*/ {
                    id: "mAbBLH",
                    message: "Kanban view must have a main group by field"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "mAbBLH",
                    message: "Kanban view must have a main group by field"
                }
            });
            return validationResult;
        }
        const mainGroupByFieldMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier: updatedFlatView.mainGroupByFieldMetadataUniversalIdentifier,
            flatEntityMaps: flatFieldMetadataMaps
        });
        if (!(0, _utils.isDefined)(mainGroupByFieldMetadata)) {
            validationResult.errors.push({
                code: _viewexception.ViewExceptionCode.INVALID_VIEW_DATA,
                message: _core.i18n._(/*i18n*/ {
                    id: "QS/zML",
                    message: "Kanban main group by field metadata not found"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "QS/zML",
                    message: "Kanban main group by field metadata not found"
                }
            });
        } else if (!(0, _isallowedflatviewkanbanmaingroupbyfieldutil.isAllowedFlatViewKanbanMainGroupByField)({
            mainGroupByFieldMetadata
        })) {
            validationResult.errors.push({
                code: _viewexception.ViewExceptionCode.INVALID_VIEW_DATA,
                message: _core.i18n._(/*i18n*/ {
                    id: "9SKooF",
                    message: "Kanban main group by field must be a SELECT or a many-to-one relation field"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "Ce++y2",
                    message: "Kanban main group by field must be a select or a many-to-one relation field"
                }
            });
        }
    }
    const updatedMainGroupByFieldMetadataUniversalIdentifier = updatedFlatView.mainGroupByFieldMetadataUniversalIdentifier;
    const mainGroupByFieldMetadataIsAddedOrUpdated = (0, _utils.isDefined)(updatedMainGroupByFieldMetadataUniversalIdentifier) && existingFlatView.mainGroupByFieldMetadataUniversalIdentifier !== updatedMainGroupByFieldMetadataUniversalIdentifier;
    if (mainGroupByFieldMetadataIsAddedOrUpdated && !viewBecomesKanban) {
        const mainGroupByFieldMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier: updatedMainGroupByFieldMetadataUniversalIdentifier,
            flatEntityMaps: flatFieldMetadataMaps
        });
        if (!(0, _utils.isDefined)(mainGroupByFieldMetadata)) {
            validationResult.errors.push({
                code: _viewexception.ViewExceptionCode.INVALID_VIEW_DATA,
                message: _core.i18n._(/*i18n*/ {
                    id: "QS/zML",
                    message: "Kanban main group by field metadata not found"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "QS/zML",
                    message: "Kanban main group by field metadata not found"
                }
            });
        } else if (!(0, _isallowedflatviewkanbanmaingroupbyfieldutil.isAllowedFlatViewKanbanMainGroupByField)({
            mainGroupByFieldMetadata
        })) {
            validationResult.errors.push({
                code: _viewexception.ViewExceptionCode.INVALID_VIEW_DATA,
                message: _core.i18n._(/*i18n*/ {
                    id: "9SKooF",
                    message: "Kanban main group by field must be a SELECT or a many-to-one relation field"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "Ce++y2",
                    message: "Kanban main group by field must be a select or a many-to-one relation field"
                }
            });
        }
    }
    validationResult.errors.push(...(0, _validateflatviewcalendarfieldsutil.validateFlatViewCalendarFields)({
        flatView: updatedFlatView,
        flatFieldMetadataMaps
    }));
    return validationResult;
};

//# sourceMappingURL=validate-flat-view-update.util.js.map
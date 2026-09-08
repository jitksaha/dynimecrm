"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateFlatViewCreation", {
    enumerable: true,
    get: function() {
        return validateFlatViewCreation;
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
const validateFlatViewCreation = ({ flatEntityToValidate: flatViewToValidate, optimisticFlatEntityMapsAndRelatedFlatEntityMaps: { flatViewMaps: optimisticFlatViewMaps, flatFieldMetadataMaps, flatObjectMetadataMaps } })=>{
    const validationResult = (0, _getflatentityvalidationerrorutil.getEmptyFlatEntityValidationError)({
        flatEntityMinimalInformation: {
            universalIdentifier: flatViewToValidate.universalIdentifier
        },
        metadataName: 'view',
        type: 'create'
    });
    const optimisticFlatObjectMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
        universalIdentifier: flatViewToValidate.objectMetadataUniversalIdentifier,
        flatEntityMaps: flatObjectMetadataMaps
    });
    if (!(0, _utils.isDefined)(optimisticFlatObjectMetadata)) {
        validationResult.errors.push({
            code: _viewexception.ViewExceptionCode.INVALID_VIEW_DATA,
            message: _core.i18n._(/*i18n*/ {
                id: "xrblgA",
                message: "Object metadata not found"
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "xrblgA",
                message: "Object metadata not found"
            }
        });
    }
    if ((0, _utils.isDefined)((0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
        universalIdentifier: flatViewToValidate.universalIdentifier,
        flatEntityMaps: optimisticFlatViewMaps
    }))) {
        validationResult.errors.push({
            code: _viewexception.ViewExceptionCode.INVALID_VIEW_DATA,
            message: _core.i18n._(/*i18n*/ {
                id: "RvdHYC",
                message: "View with same universal identifier already exists"
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "HhN1Bv",
                message: "View already exists"
            }
        });
    }
    const reservedViewKey = flatViewToValidate.key;
    if ((0, _utils.isDefined)(reservedViewKey)) {
        if (flatViewToValidate.isSystemSideEffect !== true) {
            validationResult.errors.push({
                code: _viewexception.ViewExceptionCode.INVALID_VIEW_DATA,
                message: _core.i18n._(/*i18n*/ {
                    id: "7s8NoS",
                    message: "The {reservedViewKey} view key is reserved for the engine-owned default view; remove the key from the view definition",
                    values: {
                        reservedViewKey: reservedViewKey
                    }
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "kFsyD4",
                    message: "The {reservedViewKey} view key is reserved for the default view",
                    values: {
                        reservedViewKey: reservedViewKey
                    }
                }
            });
        }
        const objectAlreadyHasFlatViewWithSameKey = (0, _utils.isDefined)(optimisticFlatObjectMetadata) && optimisticFlatObjectMetadata.viewUniversalIdentifiers.some((viewUniversalIdentifier)=>{
            const flatView = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                universalIdentifier: viewUniversalIdentifier,
                flatEntityMaps: optimisticFlatViewMaps
            });
            return (0, _utils.isDefined)(flatView) && flatView.key === reservedViewKey && !(0, _utils.isDefined)(flatView.deletedAt);
        });
        if (objectAlreadyHasFlatViewWithSameKey) {
            validationResult.errors.push({
                code: _viewexception.ViewExceptionCode.INVALID_VIEW_DATA,
                message: _core.i18n._(/*i18n*/ {
                    id: "AV0hPh",
                    message: "Object already has a view with the {reservedViewKey} key",
                    values: {
                        reservedViewKey: reservedViewKey
                    }
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "/mGcny",
                    message: "This object already has a default view"
                }
            });
        }
    }
    if ((0, _utils.isDefined)(flatViewToValidate.kanbanAggregateOperationFieldMetadataUniversalIdentifier) && !(0, _utils.isDefined)((0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
        universalIdentifier: flatViewToValidate.kanbanAggregateOperationFieldMetadataUniversalIdentifier,
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
    const isKanban = (0, _utils.getViewLayoutFromViewType)(flatViewToValidate.type) === _types.ViewType.KANBAN;
    if (isKanban) {
        if (!(0, _utils.isDefined)(flatViewToValidate.mainGroupByFieldMetadataUniversalIdentifier)) {
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
            universalIdentifier: flatViewToValidate.mainGroupByFieldMetadataUniversalIdentifier,
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
        flatView: flatViewToValidate,
        flatFieldMetadataMaps
    }));
    return validationResult;
};

//# sourceMappingURL=validate-flat-view-creation.util.js.map
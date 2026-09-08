"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateFlatViewCalendarFields", {
    enumerable: true,
    get: function() {
        return validateFlatViewCalendarFields;
    }
});
const _core = require("@lingui/core");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _findflatentitybyuniversalidentifierutil = require("../../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _viewexception = require("../../../../../metadata-modules/view/exceptions/view.exception");
const validateFlatViewCalendarFields = ({ flatView, flatFieldMetadataMaps })=>{
    if ((0, _utils.getViewLayoutFromViewType)(flatView.type) !== _types.ViewType.CALENDAR) {
        return [];
    }
    const errors = [];
    if (!(0, _utils.isDefined)(flatView.calendarLayout)) {
        errors.push({
            code: _viewexception.ViewExceptionCode.INVALID_VIEW_DATA,
            message: _core.i18n._(/*i18n*/ {
                id: "JhktJw",
                message: "Calendar view must have a calendar layout"
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "JhktJw",
                message: "Calendar view must have a calendar layout"
            }
        });
    }
    if (!(0, _utils.isDefined)(flatView.calendarFieldMetadataUniversalIdentifier)) {
        errors.push({
            code: _viewexception.ViewExceptionCode.INVALID_VIEW_DATA,
            message: _core.i18n._(/*i18n*/ {
                id: "zfvgb0",
                message: "Calendar view must have a calendar field"
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "zfvgb0",
                message: "Calendar view must have a calendar field"
            }
        });
        return errors;
    }
    const calendarFieldMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
        universalIdentifier: flatView.calendarFieldMetadataUniversalIdentifier,
        flatEntityMaps: flatFieldMetadataMaps
    });
    if (!(0, _utils.isDefined)(calendarFieldMetadata)) {
        errors.push({
            code: _viewexception.ViewExceptionCode.INVALID_VIEW_DATA,
            message: _core.i18n._(/*i18n*/ {
                id: "Sn4xhy",
                message: "Calendar field metadata not found"
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "26b8pD",
                message: "Calendar field not found"
            }
        });
        return errors;
    }
    if (calendarFieldMetadata.objectMetadataUniversalIdentifier !== flatView.objectMetadataUniversalIdentifier) {
        errors.push({
            code: _viewexception.ViewExceptionCode.INVALID_VIEW_DATA,
            message: _core.i18n._(/*i18n*/ {
                id: "hUOMKq",
                message: "Calendar field must belong to the view object"
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "hUOMKq",
                message: "Calendar field must belong to the view object"
            }
        });
    }
    const calendarFieldIsDateKind = calendarFieldMetadata.type === _types.FieldMetadataType.DATE || calendarFieldMetadata.type === _types.FieldMetadataType.DATE_TIME;
    if (!calendarFieldIsDateKind) {
        errors.push({
            code: _viewexception.ViewExceptionCode.INVALID_VIEW_DATA,
            message: _core.i18n._(/*i18n*/ {
                id: "J3xD/M",
                message: "Calendar field must be a date or date time field"
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "J3xD/M",
                message: "Calendar field must be a date or date time field"
            }
        });
    }
    if (!(0, _utils.isDefined)(flatView.calendarEndFieldMetadataUniversalIdentifier)) {
        return errors;
    }
    if (flatView.calendarEndFieldMetadataUniversalIdentifier === flatView.calendarFieldMetadataUniversalIdentifier) {
        errors.push({
            code: _viewexception.ViewExceptionCode.INVALID_VIEW_DATA,
            message: _core.i18n._(/*i18n*/ {
                id: "/63r02",
                message: "Calendar start and end fields must be different"
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "/63r02",
                message: "Calendar start and end fields must be different"
            }
        });
        return errors;
    }
    const calendarEndFieldMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
        universalIdentifier: flatView.calendarEndFieldMetadataUniversalIdentifier,
        flatEntityMaps: flatFieldMetadataMaps
    });
    if (!(0, _utils.isDefined)(calendarEndFieldMetadata)) {
        errors.push({
            code: _viewexception.ViewExceptionCode.INVALID_VIEW_DATA,
            message: _core.i18n._(/*i18n*/ {
                id: "9uvvYS",
                message: "Calendar end field metadata not found"
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "k6cK5J",
                message: "Calendar end field not found"
            }
        });
        return errors;
    }
    if (calendarEndFieldMetadata.objectMetadataUniversalIdentifier !== flatView.objectMetadataUniversalIdentifier) {
        errors.push({
            code: _viewexception.ViewExceptionCode.INVALID_VIEW_DATA,
            message: _core.i18n._(/*i18n*/ {
                id: "PEXN0U",
                message: "Calendar end field must belong to the view object"
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "PEXN0U",
                message: "Calendar end field must belong to the view object"
            }
        });
    }
    const calendarEndFieldIsDateKind = calendarEndFieldMetadata.type === _types.FieldMetadataType.DATE || calendarEndFieldMetadata.type === _types.FieldMetadataType.DATE_TIME;
    if (!calendarEndFieldIsDateKind) {
        errors.push({
            code: _viewexception.ViewExceptionCode.INVALID_VIEW_DATA,
            message: _core.i18n._(/*i18n*/ {
                id: "6BRvIC",
                message: "Calendar end field must be a date or date time field"
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "6BRvIC",
                message: "Calendar end field must be a date or date time field"
            }
        });
    } else if (calendarFieldIsDateKind && calendarEndFieldMetadata.type !== calendarFieldMetadata.type) {
        errors.push({
            code: _viewexception.ViewExceptionCode.INVALID_VIEW_DATA,
            message: _core.i18n._(/*i18n*/ {
                id: "DRukEV",
                message: "Calendar start and end fields must have the same type"
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "DRukEV",
                message: "Calendar start and end fields must have the same type"
            }
        });
    }
    return errors;
};

//# sourceMappingURL=validate-flat-view-calendar-fields.util.js.map
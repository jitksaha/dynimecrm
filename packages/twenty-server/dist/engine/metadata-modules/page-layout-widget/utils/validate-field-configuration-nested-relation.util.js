"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateFieldConfigurationNestedRelationOrThrow", {
    enumerable: true,
    get: function() {
        return validateFieldConfigurationNestedRelationOrThrow;
    }
});
const _guards = require("@sniptt/guards");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _isflatfieldmetadataoftypeutil = require("../../flat-field-metadata/utils/is-flat-field-metadata-of-type.util");
const _fielddisplaymodeenum = require("../enums/field-display-mode.enum");
const _widgetconfigurationtypetype = require("../enums/widget-configuration-type.type");
const _pagelayoutwidgetexception = require("../exceptions/page-layout-widget.exception");
const _findactiveflatfieldmetadatabyidutil = require("./find-active-flat-field-metadata-by-id.util");
const buildNestedRelationValidationException = ({ message, userFriendlyMessage, widgetTitle })=>{
    const prefix = (0, _utils.isDefined)(widgetTitle) ? `Widget "${widgetTitle}": ` : '';
    return new _pagelayoutwidgetexception.PageLayoutWidgetException(prefix + message, _pagelayoutwidgetexception.PageLayoutWidgetExceptionCode.INVALID_PAGE_LAYOUT_WIDGET_DATA, {
        userFriendlyMessage
    });
};
// Junction relation fields also carry ONE_TO_MANY metadata but are rendered
// through a dedicated junction path, so they are not valid nested hops.
const isPlainOneToManyRelationFlatFieldMetadata = (field)=>(0, _isflatfieldmetadataoftypeutil.isFlatFieldMetadataOfType)(field, _types.FieldMetadataType.RELATION) && field.settings.relationType === _types.RelationType.ONE_TO_MANY && !(0, _guards.isNonEmptyString)(field.settings.junctionTargetFieldId);
// The first hop can also be many-to-one: the widget then scopes the terminal
// view directly by the single intermediate record the current record points
// at, instead of traversing the relation.
const isPlainRelationFlatFieldMetadata = (field)=>(0, _isflatfieldmetadataoftypeutil.isFlatFieldMetadataOfType)(field, _types.FieldMetadataType.RELATION) && (field.settings.relationType === _types.RelationType.ONE_TO_MANY || field.settings.relationType === _types.RelationType.MANY_TO_ONE) && !(0, _guards.isNonEmptyString)(field.settings.junctionTargetFieldId);
const validateFieldConfigurationNestedRelationOrThrow = ({ widgetConfiguration, widgetObjectMetadataId, widgetTitle, flatFieldMetadataMaps })=>{
    if (!(0, _utils.isDefined)(widgetConfiguration) || widgetConfiguration.configurationType !== _widgetconfigurationtypetype.WidgetConfigurationType.FIELD) {
        return;
    }
    const { fieldMetadataId, nestedRelationFieldMetadataId, fieldDisplayMode } = widgetConfiguration;
    if (!(0, _utils.isDefined)(nestedRelationFieldMetadataId)) {
        return;
    }
    const invalidNestedRelation = (message, userFriendlyMessage)=>buildNestedRelationValidationException({
            message,
            userFriendlyMessage,
            widgetTitle
        });
    // A nested widget lists the second hop through an embedded view, so any
    // inline display mode would render the first hop's relation field instead.
    if (fieldDisplayMode !== _fielddisplaymodeenum.FieldDisplayMode.TABLE) {
        throw invalidNestedRelation(`nestedRelationFieldMetadataId requires fieldDisplayMode "${_fielddisplaymodeenum.FieldDisplayMode.TABLE}", got "${fieldDisplayMode}".`, /*i18n*/ {
            id: "9er1TA",
            message: "A nested relation widget must use the table layout."
        });
    }
    const sourceField = (0, _findactiveflatfieldmetadatabyidutil.findActiveFlatFieldMetadataById)(fieldMetadataId, flatFieldMetadataMaps);
    if (!(0, _utils.isDefined)(sourceField)) {
        throw invalidNestedRelation(`fieldMetadataId "${fieldMetadataId}" not found.`, /*i18n*/ {
            id: "xM30Ha",
            message: "The field configured for this widget could not be found."
        });
    }
    if (!isPlainRelationFlatFieldMetadata(sourceField)) {
        throw invalidNestedRelation(`nestedRelationFieldMetadataId requires "${sourceField.label}" to be a one-to-many or many-to-one relation field.`, /*i18n*/ {
            id: "MTdK9i",
            message: "{0} must be a one-to-many or many-to-one relation field.",
            values: {
                0: sourceField.label
            }
        });
    }
    if ((0, _utils.isDefined)(widgetObjectMetadataId) && sourceField.objectMetadataId !== widgetObjectMetadataId) {
        throw invalidNestedRelation(`fieldMetadataId "${fieldMetadataId}" does not belong to the widget object.`, /*i18n*/ {
            id: "bSLhyc",
            message: "{0} does not belong to this widget's object.",
            values: {
                0: sourceField.label
            }
        });
    }
    const nestedField = (0, _findactiveflatfieldmetadatabyidutil.findActiveFlatFieldMetadataById)(nestedRelationFieldMetadataId, flatFieldMetadataMaps);
    if (!(0, _utils.isDefined)(nestedField)) {
        throw invalidNestedRelation(`nestedRelationFieldMetadataId "${nestedRelationFieldMetadataId}" not found.`, /*i18n*/ {
            id: "fIq00W",
            message: "The nested relation field configured for this widget could not be found."
        });
    }
    if (!isPlainOneToManyRelationFlatFieldMetadata(nestedField)) {
        throw invalidNestedRelation(`nestedRelationFieldMetadataId "${nestedField.label}" must be a one-to-many relation field.`, /*i18n*/ {
            id: "EIb+ss",
            message: "{0} must be a one-to-many relation field.",
            values: {
                0: nestedField.label
            }
        });
    }
    if (nestedField.objectMetadataId !== sourceField.relationTargetObjectMetadataId) {
        throw invalidNestedRelation(`nestedRelationFieldMetadataId "${nestedField.label}" does not belong to the relation target of "${sourceField.label}".`, /*i18n*/ {
            id: "ddGPbK",
            message: "{0} does not belong to the object {1} points to.",
            values: {
                0: nestedField.label,
                1: sourceField.label
            }
        });
    }
};

//# sourceMappingURL=validate-field-configuration-nested-relation.util.js.map
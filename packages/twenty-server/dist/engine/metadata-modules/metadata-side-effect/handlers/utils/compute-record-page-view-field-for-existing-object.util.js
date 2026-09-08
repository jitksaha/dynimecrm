"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeRecordPageViewFieldForExistingObject", {
    enumerable: true,
    get: function() {
        return computeRecordPageViewFieldForExistingObject;
    }
});
const _application = require("twenty-shared/application");
const _utils = require("twenty-shared/utils");
const _defaultviewfieldsizeconstant = require("../../../flat-view-field/constants/default-view-field-size.constant");
const _widgetconfigurationtypetype = require("../../../page-layout-widget/enums/widget-configuration-type.type");
const computeRecordPageViewFieldForExistingObject = ({ sourceFlatFieldMetadata, recordPageViewUniversalIdentifier, flatViewMaps, flatViewFieldMaps, flatViewFieldGroupMaps, flatPageLayoutWidgetMaps })=>{
    const recordPageFlatView = flatViewMaps.byUniversalIdentifier[recordPageViewUniversalIdentifier];
    if (!(0, _utils.isDefined)(recordPageFlatView) || recordPageFlatView.isSystemSideEffect !== true || (0, _utils.isDefined)(recordPageFlatView.deletedAt)) {
        return undefined;
    }
    const fieldsWidget = Object.values(flatPageLayoutWidgetMaps.byUniversalIdentifier).filter(_utils.isDefined).find((widget)=>widget.isActive && !(0, _utils.isDefined)(widget.deletedAt) && widget.universalConfiguration?.configurationType === _widgetconfigurationtypetype.WidgetConfigurationType.FIELDS && widget.universalConfiguration.viewUniversalIdentifier === recordPageViewUniversalIdentifier);
    if (!(0, _utils.isDefined)(fieldsWidget) || fieldsWidget.universalConfiguration.configurationType !== _widgetconfigurationtypetype.WidgetConfigurationType.FIELDS) {
        return undefined;
    }
    const { newFieldDefaultVisibility } = fieldsWidget.universalConfiguration;
    if (!(0, _utils.isDefined)(newFieldDefaultVisibility)) {
        return undefined;
    }
    const activeFlatViewFieldGroups = recordPageFlatView.viewFieldGroupUniversalIdentifiers.map((viewFieldGroupUniversalIdentifier)=>flatViewFieldGroupMaps.byUniversalIdentifier[viewFieldGroupUniversalIdentifier]).filter(_utils.isDefined).filter((group)=>group.isActive && !(0, _utils.isDefined)(group.deletedAt));
    const lastFlatViewFieldGroup = activeFlatViewFieldGroups.length > 0 ? activeFlatViewFieldGroups.reduce((maxGroup, group)=>group.position > maxGroup.position ? group : maxGroup) : undefined;
    const targetSystemViewFieldGroupUniversalIdentifier = lastFlatViewFieldGroup?.universalIdentifier ?? null;
    const existingActivePositions = recordPageFlatView.viewFieldUniversalIdentifiers.map((viewFieldUniversalIdentifier)=>flatViewFieldMaps.byUniversalIdentifier[viewFieldUniversalIdentifier]).filter(_utils.isDefined).filter((flatViewField)=>flatViewField.isActive && !(0, _utils.isDefined)(flatViewField.deletedAt) && flatViewField.viewFieldGroupUniversalIdentifier === targetSystemViewFieldGroupUniversalIdentifier).map((flatViewField)=>flatViewField.position);
    const position = existingActivePositions.reduce((maxPosition, existingPosition)=>Math.max(maxPosition, existingPosition), -1) + 1;
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
        viewFieldGroupUniversalIdentifier: targetSystemViewFieldGroupUniversalIdentifier,
        isVisible: newFieldDefaultVisibility,
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
};

//# sourceMappingURL=compute-record-page-view-field-for-existing-object.util.js.map
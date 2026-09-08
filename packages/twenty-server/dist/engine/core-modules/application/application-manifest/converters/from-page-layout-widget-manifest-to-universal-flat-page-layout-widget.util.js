"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromPageLayoutWidgetManifestToUniversalFlatPageLayoutWidget", {
    enumerable: true,
    get: function() {
        return fromPageLayoutWidgetManifestToUniversalFlatPageLayoutWidget;
    }
});
const _constants = require("twenty-shared/constants");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const getPageLayoutWidgetPosition = ({ pageLayoutWidgetManifest, pageLayoutTabLayoutMode, widgetIndex })=>{
    if ((0, _utils.isDefined)(pageLayoutWidgetManifest.position)) {
        return pageLayoutWidgetManifest.position;
    }
    const { gridPosition } = pageLayoutWidgetManifest;
    if ((0, _utils.isDefined)(gridPosition)) {
        return {
            layoutMode: _types.PageLayoutTabLayoutMode.GRID,
            ...gridPosition
        };
    }
    switch(pageLayoutTabLayoutMode){
        case _types.PageLayoutTabLayoutMode.GRID:
            return {
                layoutMode: _types.PageLayoutTabLayoutMode.GRID,
                row: 0,
                column: 0,
                rowSpan: _constants.DEFAULT_WIDGET_SIZE.default.h,
                columnSpan: _constants.DEFAULT_WIDGET_SIZE.default.w
            };
        case _types.PageLayoutTabLayoutMode.VERTICAL_LIST:
            return {
                layoutMode: _types.PageLayoutTabLayoutMode.VERTICAL_LIST,
                index: widgetIndex
            };
        case _types.PageLayoutTabLayoutMode.CANVAS:
            return {
                layoutMode: _types.PageLayoutTabLayoutMode.CANVAS
            };
        default:
            return (0, _utils.assertUnreachable)(pageLayoutTabLayoutMode);
    }
};
const fromPageLayoutWidgetManifestToUniversalFlatPageLayoutWidget = ({ pageLayoutWidgetManifest, pageLayoutTabUniversalIdentifier, pageLayoutTabLayoutMode = _types.PageLayoutTabLayoutMode.GRID, widgetIndex = 0, applicationUniversalIdentifier, now })=>{
    return {
        universalIdentifier: pageLayoutWidgetManifest.universalIdentifier,
        applicationUniversalIdentifier,
        pageLayoutTabUniversalIdentifier,
        title: pageLayoutWidgetManifest.title,
        isActive: true,
        isSystemSideEffect: false,
        type: pageLayoutWidgetManifest.type,
        objectMetadataUniversalIdentifier: pageLayoutWidgetManifest.objectUniversalIdentifier ?? null,
        conditionalDisplay: pageLayoutWidgetManifest.conditionalDisplay ?? null,
        position: getPageLayoutWidgetPosition({
            pageLayoutWidgetManifest,
            pageLayoutTabLayoutMode,
            widgetIndex
        }),
        universalConfiguration: pageLayoutWidgetManifest.configuration,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        conditionalAvailabilityExpression: null,
        universalOverrides: null
    };
};

//# sourceMappingURL=from-page-layout-widget-manifest-to-universal-flat-page-layout-widget.util.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createStandardPageLayoutTabFlatMetadata", {
    enumerable: true,
    get: function() {
        return createStandardPageLayoutTabFlatMetadata;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _standardpagelayoutconstant = require("../../constants/standard-page-layout.constant");
const _twentystandardapplications = require("../../constants/twenty-standard-applications");
const createStandardPageLayoutTabFlatMetadata = ({ context: { layoutName, tabTitle, title, position, icon, layoutMode }, workspaceId, twentyStandardApplicationId, standardPageLayoutMetadataRelatedEntityIds, now })=>{
    const layoutIds = standardPageLayoutMetadataRelatedEntityIds[layoutName];
    const layout = _standardpagelayoutconstant.STANDARD_PAGE_LAYOUTS[layoutName];
    const tabDefinition = layout.tabs[tabTitle];
    if (!(0, _utils.isDefined)(tabDefinition)) {
        throw new Error(`Invalid configuration ${layoutName} ${tabTitle}`);
    }
    const tabIds = layoutIds.tabs[tabTitle];
    const widgetIds = Object.values(tabIds.widgets).map((widget)=>widget.id);
    const widgetUniversalIdentifiers = Object.values(tabDefinition.widgets).map((widget)=>widget.universalIdentifier);
    return {
        id: tabIds.id,
        universalIdentifier: tabDefinition.universalIdentifier,
        applicationId: twentyStandardApplicationId,
        applicationUniversalIdentifier: _twentystandardapplications.TWENTY_STANDARD_APPLICATION.universalIdentifier,
        workspaceId,
        title,
        position,
        pageLayoutId: layoutIds.id,
        pageLayoutUniversalIdentifier: layout.universalIdentifier,
        widgetIds,
        widgetUniversalIdentifiers,
        isActive: true,
        isSystemSideEffect: layout.type === _types.PageLayoutType.RECORD_PAGE,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        icon,
        layoutMode,
        overrides: null
    };
};

//# sourceMappingURL=create-standard-page-layout-tab-flat-metadata.util.js.map
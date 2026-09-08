"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "collectMessageCampaignStandardUniversalIdentifiers", {
    enumerable: true,
    get: function() {
        return collectMessageCampaignStandardUniversalIdentifiers;
    }
});
const _utils = require("twenty-shared/utils");
const _messagecampaignmessageindexuniversalidentifiersconstant = require("../constants/message-campaign-message-index-universal-identifiers.constant");
const _messagecampaignstandardobjectuniversalidentifiersconstant = require("../constants/message-campaign-standard-object-universal-identifiers.constant");
const _standardcommandmenuitemconstant = require("../../../../../engine/workspace-manager/twenty-standard-application/constants/standard-command-menu-item.constant");
const collectMessageCampaignStandardUniversalIdentifiers = ({ standardAllFlatEntityMaps })=>{
    const objectUniversalIdentifiers = new Set(_messagecampaignstandardobjectuniversalidentifiersconstant.MESSAGE_CAMPAIGN_STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS);
    const fieldMetadata = Object.values(standardAllFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatFieldMetadata)=>objectUniversalIdentifiers.has(flatFieldMetadata.objectMetadataUniversalIdentifier) || (0, _utils.isDefined)(flatFieldMetadata.relationTargetObjectMetadataUniversalIdentifier) && objectUniversalIdentifiers.has(flatFieldMetadata.relationTargetObjectMetadataUniversalIdentifier)).map((flatFieldMetadata)=>flatFieldMetadata.universalIdentifier);
    const messageIndexUniversalIdentifiers = new Set(_messagecampaignmessageindexuniversalidentifiersconstant.MESSAGE_CAMPAIGN_MESSAGE_INDEX_UNIVERSAL_IDENTIFIERS);
    const index = Object.values(standardAllFlatEntityMaps.flatIndexMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatIndexMetadata)=>objectUniversalIdentifiers.has(flatIndexMetadata.objectMetadataUniversalIdentifier) || messageIndexUniversalIdentifiers.has(flatIndexMetadata.universalIdentifier)).map((flatIndexMetadata)=>flatIndexMetadata.universalIdentifier);
    const searchFieldMetadata = Object.values(standardAllFlatEntityMaps.flatSearchFieldMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatSearchFieldMetadata)=>objectUniversalIdentifiers.has(flatSearchFieldMetadata.objectMetadataUniversalIdentifier)).map((flatSearchFieldMetadata)=>flatSearchFieldMetadata.universalIdentifier);
    const flatViews = Object.values(standardAllFlatEntityMaps.flatViewMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatView)=>(0, _utils.isDefined)(flatView.objectMetadataUniversalIdentifier) && objectUniversalIdentifiers.has(flatView.objectMetadataUniversalIdentifier));
    const viewUniversalIdentifiers = new Set(flatViews.map((flatView)=>flatView.universalIdentifier));
    const viewFieldGroup = Object.values(standardAllFlatEntityMaps.flatViewFieldGroupMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatViewFieldGroup)=>viewUniversalIdentifiers.has(flatViewFieldGroup.viewUniversalIdentifier)).map((flatViewFieldGroup)=>flatViewFieldGroup.universalIdentifier);
    const viewField = Object.values(standardAllFlatEntityMaps.flatViewFieldMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatViewField)=>viewUniversalIdentifiers.has(flatViewField.viewUniversalIdentifier)).map((flatViewField)=>flatViewField.universalIdentifier);
    const flatPageLayouts = Object.values(standardAllFlatEntityMaps.flatPageLayoutMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatPageLayout)=>(0, _utils.isDefined)(flatPageLayout.objectMetadataUniversalIdentifier) && objectUniversalIdentifiers.has(flatPageLayout.objectMetadataUniversalIdentifier));
    const pageLayoutUniversalIdentifiers = new Set(flatPageLayouts.map((flatPageLayout)=>flatPageLayout.universalIdentifier));
    const flatPageLayoutTabs = Object.values(standardAllFlatEntityMaps.flatPageLayoutTabMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatPageLayoutTab)=>pageLayoutUniversalIdentifiers.has(flatPageLayoutTab.pageLayoutUniversalIdentifier));
    const pageLayoutTabUniversalIdentifiers = new Set(flatPageLayoutTabs.map((flatPageLayoutTab)=>flatPageLayoutTab.universalIdentifier));
    const pageLayoutWidget = Object.values(standardAllFlatEntityMaps.flatPageLayoutWidgetMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatPageLayoutWidget)=>pageLayoutTabUniversalIdentifiers.has(flatPageLayoutWidget.pageLayoutTabUniversalIdentifier)).map((flatPageLayoutWidget)=>flatPageLayoutWidget.universalIdentifier);
    const objectScopedCommandMenuItems = Object.values(standardAllFlatEntityMaps.flatCommandMenuItemMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatCommandMenuItem)=>(0, _utils.isDefined)(flatCommandMenuItem.availabilityObjectMetadataUniversalIdentifier) && objectUniversalIdentifiers.has(flatCommandMenuItem.availabilityObjectMetadataUniversalIdentifier)).map((flatCommandMenuItem)=>flatCommandMenuItem.universalIdentifier);
    return {
        objectMetadata: _messagecampaignstandardobjectuniversalidentifiersconstant.MESSAGE_CAMPAIGN_STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
        fieldMetadata,
        index,
        searchFieldMetadata,
        view: flatViews.map((flatView)=>flatView.universalIdentifier),
        viewFieldGroup,
        viewField,
        pageLayout: flatPageLayouts.map((flatPageLayout)=>flatPageLayout.universalIdentifier),
        pageLayoutTab: flatPageLayoutTabs.map((flatPageLayoutTab)=>flatPageLayoutTab.universalIdentifier),
        pageLayoutWidget,
        commandMenuItem: [
            ...objectScopedCommandMenuItems,
            _standardcommandmenuitemconstant.STANDARD_COMMAND_MENU_ITEMS.composeCampaign.universalIdentifier
        ]
    };
};

//# sourceMappingURL=collect-message-campaign-standard-universal-identifiers.util.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "STANDARD_MESSAGE_CAMPAIGN_PAGE_LAYOUT_CONFIG", {
    enumerable: true,
    get: function() {
        return STANDARD_MESSAGE_CAMPAIGN_PAGE_LAYOUT_CONFIG;
    }
});
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _standardpagelayouttabstemplate = require("../../constants/standard-page-layout-tabs.template");
const MESSAGE_CAMPAIGN_PAGE_TABS = {
    home: {
        universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.messageCampaignRecordPage.tabs.home.universalIdentifier,
        ..._standardpagelayouttabstemplate.TAB_PROPS.home,
        widgets: {
            recipients: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.messageCampaignRecordPage.tabs.home.widgets.recipients.universalIdentifier,
                title: 'Recipients',
                type: _types.WidgetType.FIELD,
                position: _standardpagelayouttabstemplate.VERTICAL_LIST_LAYOUT_POSITIONS.FOURTH,
                fieldUniversalIdentifier: _metadata.STANDARD_OBJECTS.messageCampaign.fields.recipients.universalIdentifier,
                conditionalAvailabilityExpression: 'noneEquals(selectedRecords, "status", "DRAFT")'
            },
            fields: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.messageCampaignRecordPage.tabs.home.widgets.fields.universalIdentifier,
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.fields,
                position: _standardpagelayouttabstemplate.VERTICAL_LIST_LAYOUT_POSITIONS.SECOND,
                conditionalAvailabilityExpression: 'noneEquals(selectedRecords, "status", "DRAFT")'
            }
        }
    },
    composer: {
        universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.messageCampaignRecordPage.tabs.composer.universalIdentifier,
        ..._standardpagelayouttabstemplate.TAB_PROPS.composer,
        widgets: {
            messageCampaign: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.messageCampaignRecordPage.tabs.composer.widgets.messageCampaign.universalIdentifier,
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.messageCampaign
            }
        }
    }
};
const STANDARD_MESSAGE_CAMPAIGN_PAGE_LAYOUT_CONFIG = {
    name: 'Default Campaign Layout',
    type: _types.PageLayoutType.RECORD_PAGE,
    objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.messageCampaign.universalIdentifier,
    universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.messageCampaignRecordPage.universalIdentifier,
    defaultTabUniversalIdentifier: null,
    tabs: MESSAGE_CAMPAIGN_PAGE_TABS
};

//# sourceMappingURL=standard-message-campaign-page-layout.config.js.map
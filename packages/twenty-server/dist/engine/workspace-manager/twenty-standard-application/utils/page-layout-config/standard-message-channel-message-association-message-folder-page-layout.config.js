"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "STANDARD_MESSAGE_CHANNEL_MESSAGE_ASSOCIATION_MESSAGE_FOLDER_PAGE_LAYOUT_CONFIG", {
    enumerable: true,
    get: function() {
        return STANDARD_MESSAGE_CHANNEL_MESSAGE_ASSOCIATION_MESSAGE_FOLDER_PAGE_LAYOUT_CONFIG;
    }
});
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _standardpagelayouttabstemplate = require("../../constants/standard-page-layout-tabs.template");
const MESSAGE_CHANNEL_MESSAGE_ASSOCIATION_MESSAGE_FOLDER_PAGE_TABS = {
    home: {
        universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.messageChannelMessageAssociationMessageFolderRecordPage.tabs.home.universalIdentifier,
        ..._standardpagelayouttabstemplate.TAB_PROPS.home,
        widgets: {
            fields: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.messageChannelMessageAssociationMessageFolderRecordPage.tabs.home.widgets.fields.universalIdentifier,
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.fields
            }
        }
    },
    timeline: {
        universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.messageChannelMessageAssociationMessageFolderRecordPage.tabs.timeline.universalIdentifier,
        ..._standardpagelayouttabstemplate.TAB_PROPS.timeline,
        widgets: {
            timeline: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.messageChannelMessageAssociationMessageFolderRecordPage.tabs.timeline.widgets.timeline.universalIdentifier,
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.timeline
            }
        }
    }
};
const STANDARD_MESSAGE_CHANNEL_MESSAGE_ASSOCIATION_MESSAGE_FOLDER_PAGE_LAYOUT_CONFIG = {
    name: 'Default Message Channel Message Association Message Folder Layout',
    type: _types.PageLayoutType.RECORD_PAGE,
    objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.messageChannelMessageAssociationMessageFolder.universalIdentifier,
    universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.messageChannelMessageAssociationMessageFolderRecordPage.universalIdentifier,
    defaultTabUniversalIdentifier: null,
    tabs: MESSAGE_CHANNEL_MESSAGE_ASSOCIATION_MESSAGE_FOLDER_PAGE_TABS
};

//# sourceMappingURL=standard-message-channel-message-association-message-folder-page-layout.config.js.map
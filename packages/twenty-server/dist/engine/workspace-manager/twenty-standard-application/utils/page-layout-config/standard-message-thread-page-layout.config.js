"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "STANDARD_MESSAGE_THREAD_PAGE_LAYOUT_CONFIG", {
    enumerable: true,
    get: function() {
        return STANDARD_MESSAGE_THREAD_PAGE_LAYOUT_CONFIG;
    }
});
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _standardpagelayouttabstemplate = require("../../constants/standard-page-layout-tabs.template");
const MESSAGE_THREAD_PAGE_TABS = {
    home: {
        universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.messageThreadRecordPage.tabs.home.universalIdentifier,
        ..._standardpagelayouttabstemplate.TAB_PROPS.home,
        widgets: {
            emailThread: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.messageThreadRecordPage.tabs.home.widgets.emailThread.universalIdentifier,
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.emailThread
            }
        }
    }
};
const STANDARD_MESSAGE_THREAD_PAGE_LAYOUT_CONFIG = {
    name: 'Default Message Thread Layout',
    type: _types.PageLayoutType.RECORD_PAGE,
    objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.messageThread.universalIdentifier,
    universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.messageThreadRecordPage.universalIdentifier,
    defaultTabUniversalIdentifier: null,
    tabs: MESSAGE_THREAD_PAGE_TABS
};

//# sourceMappingURL=standard-message-thread-page-layout.config.js.map
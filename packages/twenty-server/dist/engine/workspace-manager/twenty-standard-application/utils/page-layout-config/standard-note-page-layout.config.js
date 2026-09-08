"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "STANDARD_NOTE_PAGE_LAYOUT_CONFIG", {
    enumerable: true,
    get: function() {
        return STANDARD_NOTE_PAGE_LAYOUT_CONFIG;
    }
});
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _standardpagelayouttabstemplate = require("../../constants/standard-page-layout-tabs.template");
const NOTE_PAGE_TABS = {
    home: {
        universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.noteRecordPage.tabs.home.universalIdentifier,
        ..._standardpagelayouttabstemplate.TAB_PROPS.home,
        widgets: {
            fields: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.noteRecordPage.tabs.home.widgets.fields.universalIdentifier,
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.fields
            },
            noteRichText: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.noteRecordPage.tabs.home.widgets.noteRichText.universalIdentifier,
                title: _standardpagelayouttabstemplate.WIDGET_PROPS.noteRichText.title,
                type: _standardpagelayouttabstemplate.WIDGET_PROPS.noteRichText.type,
                position: {
                    layoutMode: _standardpagelayouttabstemplate.TAB_PROPS.home.layoutMode,
                    index: 1
                },
                conditionalDisplay: _standardpagelayouttabstemplate.CONDITIONAL_DISPLAY_DEVICE_MOBILE,
                conditionalAvailabilityExpression: _standardpagelayouttabstemplate.CONDITIONAL_AVAILABILITY_EXPRESSION_DEVICE_MOBILE
            }
        }
    },
    note: {
        universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.noteRecordPage.tabs.note.universalIdentifier,
        ..._standardpagelayouttabstemplate.TAB_PROPS.note,
        widgets: {
            noteRichText: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.noteRecordPage.tabs.note.widgets.noteRichText.universalIdentifier,
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.noteRichText,
                conditionalDisplay: _standardpagelayouttabstemplate.CONDITIONAL_DISPLAY_DEVICE_DESKTOP,
                conditionalAvailabilityExpression: _standardpagelayouttabstemplate.CONDITIONAL_AVAILABILITY_EXPRESSION_DEVICE_DESKTOP
            }
        }
    }
};
const STANDARD_NOTE_PAGE_LAYOUT_CONFIG = {
    name: 'Default Note Layout',
    type: _types.PageLayoutType.RECORD_PAGE,
    objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.note.universalIdentifier,
    universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.noteRecordPage.universalIdentifier,
    defaultTabUniversalIdentifier: null,
    tabs: NOTE_PAGE_TABS
};

//# sourceMappingURL=standard-note-page-layout.config.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "STANDARD_TASK_PAGE_LAYOUT_CONFIG", {
    enumerable: true,
    get: function() {
        return STANDARD_TASK_PAGE_LAYOUT_CONFIG;
    }
});
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _standardpagelayouttabstemplate = require("../../constants/standard-page-layout-tabs.template");
const TASK_PAGE_TABS = {
    home: {
        universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.taskRecordPage.tabs.home.universalIdentifier,
        ..._standardpagelayouttabstemplate.TAB_PROPS.home,
        widgets: {
            fields: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.taskRecordPage.tabs.home.widgets.fields.universalIdentifier,
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.fields
            },
            taskRichText: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.taskRecordPage.tabs.home.widgets.taskRichText.universalIdentifier,
                title: _standardpagelayouttabstemplate.WIDGET_PROPS.taskRichText.title,
                type: _standardpagelayouttabstemplate.WIDGET_PROPS.taskRichText.type,
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
        universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.taskRecordPage.tabs.note.universalIdentifier,
        ..._standardpagelayouttabstemplate.TAB_PROPS.note,
        widgets: {
            taskRichText: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.taskRecordPage.tabs.note.widgets.taskRichText.universalIdentifier,
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.taskRichText,
                conditionalDisplay: _standardpagelayouttabstemplate.CONDITIONAL_DISPLAY_DEVICE_DESKTOP,
                conditionalAvailabilityExpression: _standardpagelayouttabstemplate.CONDITIONAL_AVAILABILITY_EXPRESSION_DEVICE_DESKTOP
            }
        }
    }
};
const STANDARD_TASK_PAGE_LAYOUT_CONFIG = {
    name: 'Default Task Layout',
    type: _types.PageLayoutType.RECORD_PAGE,
    objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.task.universalIdentifier,
    universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.taskRecordPage.universalIdentifier,
    defaultTabUniversalIdentifier: null,
    tabs: TASK_PAGE_TABS
};

//# sourceMappingURL=standard-task-page-layout.config.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "STANDARD_WORKFLOW_VERSION_PAGE_LAYOUT_CONFIG", {
    enumerable: true,
    get: function() {
        return STANDARD_WORKFLOW_VERSION_PAGE_LAYOUT_CONFIG;
    }
});
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _standardpagelayouttabstemplate = require("../../constants/standard-page-layout-tabs.template");
const WORKFLOW_VERSION_PAGE_TABS = {
    home: {
        universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.workflowVersionRecordPage.tabs.home.universalIdentifier,
        ..._standardpagelayouttabstemplate.TAB_PROPS.home,
        widgets: {
            fields: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.workflowVersionRecordPage.tabs.home.widgets.fields.universalIdentifier,
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.fields
            },
            workflow: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.workflowVersionRecordPage.tabs.home.widgets.workflow.universalIdentifier,
                title: 'Workflow',
                type: _types.WidgetType.FIELD,
                position: _standardpagelayouttabstemplate.VERTICAL_LIST_LAYOUT_POSITIONS.SECOND,
                fieldUniversalIdentifier: _metadata.STANDARD_OBJECTS.workflowVersion.fields.workflow.universalIdentifier
            }
        }
    },
    flow: {
        universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.workflowVersionRecordPage.tabs.flow.universalIdentifier,
        ..._standardpagelayouttabstemplate.TAB_PROPS.flowSecondary,
        widgets: {
            workflowVersion: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.workflowVersionRecordPage.tabs.flow.widgets.workflowVersion.universalIdentifier,
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.workflowVersion
            }
        }
    }
};
const STANDARD_WORKFLOW_VERSION_PAGE_LAYOUT_CONFIG = {
    name: 'Default Workflow Version Layout',
    type: _types.PageLayoutType.RECORD_PAGE,
    objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.workflowVersion.universalIdentifier,
    universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.workflowVersionRecordPage.universalIdentifier,
    defaultTabUniversalIdentifier: WORKFLOW_VERSION_PAGE_TABS.flow.universalIdentifier,
    tabs: WORKFLOW_VERSION_PAGE_TABS
};

//# sourceMappingURL=standard-workflow-version-page-layout.config.js.map
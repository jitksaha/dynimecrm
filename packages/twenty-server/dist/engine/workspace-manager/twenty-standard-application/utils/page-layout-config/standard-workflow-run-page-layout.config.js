"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "STANDARD_WORKFLOW_RUN_PAGE_LAYOUT_CONFIG", {
    enumerable: true,
    get: function() {
        return STANDARD_WORKFLOW_RUN_PAGE_LAYOUT_CONFIG;
    }
});
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _standardpagelayouttabstemplate = require("../../constants/standard-page-layout-tabs.template");
const WORKFLOW_RUN_PAGE_TABS = {
    home: {
        universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.workflowRunRecordPage.tabs.home.universalIdentifier,
        ..._standardpagelayouttabstemplate.TAB_PROPS.home,
        widgets: {
            fields: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.workflowRunRecordPage.tabs.home.widgets.fields.universalIdentifier,
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.fields
            },
            workflow: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.workflowRunRecordPage.tabs.home.widgets.workflow.universalIdentifier,
                title: 'Workflow',
                type: _types.WidgetType.FIELD,
                position: _standardpagelayouttabstemplate.VERTICAL_LIST_LAYOUT_POSITIONS.THIRD,
                fieldUniversalIdentifier: _metadata.STANDARD_OBJECTS.workflowRun.fields.workflow.universalIdentifier
            }
        }
    },
    flow: {
        universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.workflowRunRecordPage.tabs.flow.universalIdentifier,
        ..._standardpagelayouttabstemplate.TAB_PROPS.flowSecondary,
        widgets: {
            workflowRun: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.workflowRunRecordPage.tabs.flow.widgets.workflowRun.universalIdentifier,
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.workflowRun
            }
        }
    }
};
const STANDARD_WORKFLOW_RUN_PAGE_LAYOUT_CONFIG = {
    name: 'Default Workflow Run Layout',
    type: _types.PageLayoutType.RECORD_PAGE,
    objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.workflowRun.universalIdentifier,
    universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.workflowRunRecordPage.universalIdentifier,
    defaultTabUniversalIdentifier: WORKFLOW_RUN_PAGE_TABS.flow.universalIdentifier,
    tabs: WORKFLOW_RUN_PAGE_TABS
};

//# sourceMappingURL=standard-workflow-run-page-layout.config.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "STANDARD_WORKFLOW_PAGE_LAYOUT_CONFIG", {
    enumerable: true,
    get: function() {
        return STANDARD_WORKFLOW_PAGE_LAYOUT_CONFIG;
    }
});
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _standardpagelayouttabstemplate = require("../../constants/standard-page-layout-tabs.template");
const WORKFLOW_PAGE_TABS = {
    flow: {
        universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.workflowRecordPage.tabs.flow.universalIdentifier,
        ..._standardpagelayouttabstemplate.TAB_PROPS.flow,
        widgets: {
            workflow: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.workflowRecordPage.tabs.flow.widgets.workflow.universalIdentifier,
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.workflow
            }
        }
    }
};
const STANDARD_WORKFLOW_PAGE_LAYOUT_CONFIG = {
    name: 'Default Workflow Layout',
    type: _types.PageLayoutType.RECORD_PAGE,
    objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.workflow.universalIdentifier,
    universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.workflowRecordPage.universalIdentifier,
    defaultTabUniversalIdentifier: null,
    tabs: WORKFLOW_PAGE_TABS
};

//# sourceMappingURL=standard-workflow-page-layout.config.js.map
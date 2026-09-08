"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardWorkflowAutomatedTriggerViewFieldGroups", {
    enumerable: true,
    get: function() {
        return computeStandardWorkflowAutomatedTriggerViewFieldGroups;
    }
});
const _i18nlabelutil = require("../i18n-label.util");
const _createstandardviewfieldgroupflatmetadatautil = require("./create-standard-view-field-group-flat-metadata.util");
const computeStandardWorkflowAutomatedTriggerViewFieldGroups = (args)=>{
    return {
        workflowAutomatedTriggerRecordPageFieldsGeneral: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'workflowAutomatedTrigger',
            context: {
                viewName: 'workflowAutomatedTriggerRecordPageFields',
                viewFieldGroupName: 'general',
                name: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Ddadau",
                    message: "General"
                }),
                position: 0,
                isVisible: true
            }
        }),
        workflowAutomatedTriggerRecordPageFieldsSystem: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'workflowAutomatedTrigger',
            context: {
                viewName: 'workflowAutomatedTriggerRecordPageFields',
                viewFieldGroupName: 'system',
                name: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "pxZPo7",
                    message: "System"
                }),
                position: 1,
                isVisible: true
            }
        })
    };
};

//# sourceMappingURL=compute-standard-workflow-automated-trigger-view-field-groups.util.js.map
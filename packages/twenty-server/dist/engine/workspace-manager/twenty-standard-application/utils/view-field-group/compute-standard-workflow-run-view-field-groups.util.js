"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardWorkflowRunViewFieldGroups", {
    enumerable: true,
    get: function() {
        return computeStandardWorkflowRunViewFieldGroups;
    }
});
const _i18nlabelutil = require("../i18n-label.util");
const _createstandardviewfieldgroupflatmetadatautil = require("./create-standard-view-field-group-flat-metadata.util");
const computeStandardWorkflowRunViewFieldGroups = (args)=>{
    return {
        workflowRunRecordPageFieldsGeneral: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'workflowRun',
            context: {
                viewName: 'workflowRunRecordPageFields',
                viewFieldGroupName: 'general',
                name: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Ddadau",
                    message: "General"
                }),
                position: 0,
                isVisible: true
            }
        }),
        workflowRunRecordPageFieldsSystem: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'workflowRun',
            context: {
                viewName: 'workflowRunRecordPageFields',
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

//# sourceMappingURL=compute-standard-workflow-run-view-field-groups.util.js.map
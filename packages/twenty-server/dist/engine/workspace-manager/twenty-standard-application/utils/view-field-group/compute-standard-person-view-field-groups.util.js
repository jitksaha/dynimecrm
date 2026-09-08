"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardPersonViewFieldGroups", {
    enumerable: true,
    get: function() {
        return computeStandardPersonViewFieldGroups;
    }
});
const _i18nlabelutil = require("../i18n-label.util");
const _createstandardviewfieldgroupflatmetadatautil = require("./create-standard-view-field-group-flat-metadata.util");
const computeStandardPersonViewFieldGroups = (args)=>{
    return {
        personRecordPageFieldsGeneral: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'person',
            context: {
                viewName: 'personRecordPageFields',
                viewFieldGroupName: 'general',
                name: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Ddadau",
                    message: "General"
                }),
                position: 0,
                isVisible: true
            }
        }),
        personRecordPageFieldsWork: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'person',
            context: {
                viewName: 'personRecordPageFields',
                viewFieldGroupName: 'work',
                name: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "ArK4kh",
                    message: "Work"
                }),
                position: 1,
                isVisible: true
            }
        }),
        personRecordPageFieldsSocial: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'person',
            context: {
                viewName: 'personRecordPageFields',
                viewFieldGroupName: 'social',
                name: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "NmDrpO",
                    message: "Social"
                }),
                position: 2,
                isVisible: true
            }
        }),
        personRecordPageFieldsSystem: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'person',
            context: {
                viewName: 'personRecordPageFields',
                viewFieldGroupName: 'system',
                name: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "pxZPo7",
                    message: "System"
                }),
                position: 3,
                isVisible: true
            }
        })
    };
};

//# sourceMappingURL=compute-standard-person-view-field-groups.util.js.map
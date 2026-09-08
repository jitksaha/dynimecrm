"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardCallRecordingViewFieldGroups", {
    enumerable: true,
    get: function() {
        return computeStandardCallRecordingViewFieldGroups;
    }
});
const _i18nlabelutil = require("../i18n-label.util");
const _createstandardviewfieldgroupflatmetadatautil = require("./create-standard-view-field-group-flat-metadata.util");
const computeStandardCallRecordingViewFieldGroups = (args)=>{
    return {
        callRecordingRecordPageFieldsGeneral: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'callRecording',
            context: {
                viewName: 'callRecordingRecordPageFields',
                viewFieldGroupName: 'general',
                name: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Ddadau",
                    message: "General"
                }),
                position: 0,
                isVisible: true
            }
        })
    };
};

//# sourceMappingURL=compute-standard-call-recording-view-field-groups.util.js.map
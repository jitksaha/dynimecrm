"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardNoteViewFieldGroups", {
    enumerable: true,
    get: function() {
        return computeStandardNoteViewFieldGroups;
    }
});
const _i18nlabelutil = require("../i18n-label.util");
const _createstandardviewfieldgroupflatmetadatautil = require("./create-standard-view-field-group-flat-metadata.util");
const computeStandardNoteViewFieldGroups = (args)=>{
    return {
        noteRecordPageFieldsGeneral: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'note',
            context: {
                viewName: 'noteRecordPageFields',
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

//# sourceMappingURL=compute-standard-note-view-field-groups.util.js.map
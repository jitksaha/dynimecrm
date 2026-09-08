"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardMessageChannelMessageAssociationViewFieldGroups", {
    enumerable: true,
    get: function() {
        return computeStandardMessageChannelMessageAssociationViewFieldGroups;
    }
});
const _i18nlabelutil = require("../i18n-label.util");
const _createstandardviewfieldgroupflatmetadatautil = require("./create-standard-view-field-group-flat-metadata.util");
const computeStandardMessageChannelMessageAssociationViewFieldGroups = (args)=>{
    return {
        messageChannelMessageAssociationRecordPageFieldsGeneral: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'messageChannelMessageAssociation',
            context: {
                viewName: 'messageChannelMessageAssociationRecordPageFields',
                viewFieldGroupName: 'general',
                name: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Ddadau",
                    message: "General"
                }),
                position: 0,
                isVisible: true
            }
        }),
        messageChannelMessageAssociationRecordPageFieldsSystem: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'messageChannelMessageAssociation',
            context: {
                viewName: 'messageChannelMessageAssociationRecordPageFields',
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

//# sourceMappingURL=compute-standard-message-channel-message-association-view-field-groups.util.js.map
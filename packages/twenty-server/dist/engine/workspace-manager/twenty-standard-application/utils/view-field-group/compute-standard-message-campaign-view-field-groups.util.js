"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardMessageCampaignViewFieldGroups", {
    enumerable: true,
    get: function() {
        return computeStandardMessageCampaignViewFieldGroups;
    }
});
const _i18nlabelutil = require("../i18n-label.util");
const _createstandardviewfieldgroupflatmetadatautil = require("./create-standard-view-field-group-flat-metadata.util");
const computeStandardMessageCampaignViewFieldGroups = (args)=>{
    return {
        messageCampaignRecordPageFieldsStats: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'messageCampaign',
            context: {
                viewName: 'messageCampaignRecordPageFields',
                viewFieldGroupName: 'stats',
                name: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "+Ekld4",
                    message: "Stats"
                }),
                position: 0,
                isVisible: true
            }
        })
    };
};

//# sourceMappingURL=compute-standard-message-campaign-view-field-groups.util.js.map
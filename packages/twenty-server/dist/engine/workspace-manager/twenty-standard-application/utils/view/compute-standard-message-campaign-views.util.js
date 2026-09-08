"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardMessageCampaignViews", {
    enumerable: true,
    get: function() {
        return computeStandardMessageCampaignViews;
    }
});
const _types = require("twenty-shared/types");
const _indexviewnameconstant = require("../../../../metadata-modules/view/constants/index-view-name.constant");
const _createstandardviewflatmetadatautil = require("./create-standard-view-flat-metadata.util");
const computeStandardMessageCampaignViews = (args)=>{
    return {
        allMessageCampaigns: (0, _createstandardviewflatmetadatautil.createStandardViewFlatMetadata)({
            ...args,
            objectName: 'messageCampaign',
            context: {
                viewName: 'allMessageCampaigns',
                name: _indexviewnameconstant.INDEX_VIEW_NAME,
                type: _types.ViewType.TABLE,
                key: _types.ViewKey.INDEX,
                position: 0,
                icon: 'IconSend'
            }
        }),
        messageCampaignRecordPageFields: (0, _createstandardviewflatmetadatautil.createStandardViewFlatMetadata)({
            ...args,
            objectName: 'messageCampaign',
            context: {
                viewName: 'messageCampaignRecordPageFields',
                name: 'Message Campaign Record Page Fields',
                type: _types.ViewType.FIELDS_WIDGET,
                key: null,
                position: 0,
                icon: 'IconListDetails'
            }
        })
    };
};

//# sourceMappingURL=compute-standard-message-campaign-views.util.js.map
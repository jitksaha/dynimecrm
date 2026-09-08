"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardMessageListViewFields", {
    enumerable: true,
    get: function() {
        return computeStandardMessageListViewFields;
    }
});
const _createstandardviewfieldflatmetadatautil = require("./create-standard-view-field-flat-metadata.util");
const computeStandardMessageListViewFields = (args)=>{
    return {
        allMessageListsName: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageList',
            context: {
                viewName: 'allMessageLists',
                viewFieldName: 'name',
                fieldName: 'name',
                position: 0,
                isVisible: true,
                size: 300
            }
        }),
        allMessageListsMembers: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageList',
            context: {
                viewName: 'allMessageLists',
                viewFieldName: 'members',
                fieldName: 'members',
                position: 1,
                isVisible: true,
                size: 150
            }
        }),
        allMessageListsCampaigns: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageList',
            context: {
                viewName: 'allMessageLists',
                viewFieldName: 'campaigns',
                fieldName: 'campaigns',
                position: 2,
                isVisible: true,
                size: 150
            }
        }),
        allMessageListsCreatedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageList',
            context: {
                viewName: 'allMessageLists',
                viewFieldName: 'createdAt',
                fieldName: 'createdAt',
                position: 3,
                isVisible: true,
                size: 150
            }
        })
    };
};

//# sourceMappingURL=compute-standard-message-list-view-fields.util.js.map
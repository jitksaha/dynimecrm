"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardMessageCampaignViewFields", {
    enumerable: true,
    get: function() {
        return computeStandardMessageCampaignViewFields;
    }
});
const _createstandardviewfieldflatmetadatautil = require("./create-standard-view-field-flat-metadata.util");
const computeStandardMessageCampaignViewFields = (args)=>{
    return {
        allMessageCampaignsName: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageCampaign',
            context: {
                viewName: 'allMessageCampaigns',
                viewFieldName: 'name',
                fieldName: 'name',
                position: 0,
                isVisible: true,
                size: 250
            }
        }),
        allMessageCampaignsSubject: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageCampaign',
            context: {
                viewName: 'allMessageCampaigns',
                viewFieldName: 'subject',
                fieldName: 'subject',
                position: 1,
                isVisible: true,
                size: 300
            }
        }),
        allMessageCampaignsStatus: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageCampaign',
            context: {
                viewName: 'allMessageCampaigns',
                viewFieldName: 'status',
                fieldName: 'status',
                position: 2,
                isVisible: true,
                size: 120
            }
        }),
        allMessageCampaignsList: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageCampaign',
            context: {
                viewName: 'allMessageCampaigns',
                viewFieldName: 'list',
                fieldName: 'list',
                position: 3,
                isVisible: true,
                size: 150
            }
        }),
        allMessageCampaignsFromAddress: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageCampaign',
            context: {
                viewName: 'allMessageCampaigns',
                viewFieldName: 'fromAddress',
                fieldName: 'fromAddress',
                position: 4,
                isVisible: true,
                size: 200
            }
        }),
        allMessageCampaignsSentAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageCampaign',
            context: {
                viewName: 'allMessageCampaigns',
                viewFieldName: 'sentAt',
                fieldName: 'sentAt',
                position: 5,
                isVisible: true,
                size: 150
            }
        }),
        allMessageCampaignsSentCount: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageCampaign',
            context: {
                viewName: 'allMessageCampaigns',
                viewFieldName: 'sentCount',
                fieldName: 'sentCount',
                position: 6,
                isVisible: true,
                size: 100
            }
        }),
        allMessageCampaignsDeliveredCount: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageCampaign',
            context: {
                viewName: 'allMessageCampaigns',
                viewFieldName: 'deliveredCount',
                fieldName: 'deliveredCount',
                position: 7,
                isVisible: true,
                size: 100
            }
        }),
        allMessageCampaignsFailedCount: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageCampaign',
            context: {
                viewName: 'allMessageCampaigns',
                viewFieldName: 'failedCount',
                fieldName: 'failedCount',
                position: 8,
                isVisible: true,
                size: 100
            }
        }),
        allMessageCampaignsSkippedCount: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageCampaign',
            context: {
                viewName: 'allMessageCampaigns',
                viewFieldName: 'skippedCount',
                fieldName: 'skippedCount',
                position: 9,
                isVisible: true,
                size: 100
            }
        }),
        allMessageCampaignsBouncedCount: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageCampaign',
            context: {
                viewName: 'allMessageCampaigns',
                viewFieldName: 'bouncedCount',
                fieldName: 'bouncedCount',
                position: 10,
                isVisible: true,
                size: 100
            }
        }),
        allMessageCampaignsComplainedCount: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageCampaign',
            context: {
                viewName: 'allMessageCampaigns',
                viewFieldName: 'complainedCount',
                fieldName: 'complainedCount',
                position: 11,
                isVisible: true,
                size: 120
            }
        }),
        allMessageCampaignsRecipients: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageCampaign',
            context: {
                viewName: 'allMessageCampaigns',
                viewFieldName: 'recipients',
                fieldName: 'recipients',
                position: 12,
                isVisible: true,
                size: 150
            }
        }),
        allMessageCampaignsCreatedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageCampaign',
            context: {
                viewName: 'allMessageCampaigns',
                viewFieldName: 'createdAt',
                fieldName: 'createdAt',
                position: 13,
                isVisible: true,
                size: 150
            }
        }),
        messageCampaignRecordPageFieldsStatus: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageCampaign',
            context: {
                viewName: 'messageCampaignRecordPageFields',
                viewFieldName: 'status',
                fieldName: 'status',
                position: 0,
                isVisible: true,
                size: 120,
                viewFieldGroupName: 'stats'
            }
        }),
        messageCampaignRecordPageFieldsSentAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageCampaign',
            context: {
                viewName: 'messageCampaignRecordPageFields',
                viewFieldName: 'sentAt',
                fieldName: 'sentAt',
                position: 1,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'stats'
            }
        }),
        messageCampaignRecordPageFieldsSentCount: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageCampaign',
            context: {
                viewName: 'messageCampaignRecordPageFields',
                viewFieldName: 'sentCount',
                fieldName: 'sentCount',
                position: 2,
                isVisible: true,
                size: 100,
                viewFieldGroupName: 'stats'
            }
        }),
        messageCampaignRecordPageFieldsDeliveredCount: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageCampaign',
            context: {
                viewName: 'messageCampaignRecordPageFields',
                viewFieldName: 'deliveredCount',
                fieldName: 'deliveredCount',
                position: 3,
                isVisible: true,
                size: 100,
                viewFieldGroupName: 'stats'
            }
        }),
        messageCampaignRecordPageFieldsFailedCount: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageCampaign',
            context: {
                viewName: 'messageCampaignRecordPageFields',
                viewFieldName: 'failedCount',
                fieldName: 'failedCount',
                position: 4,
                isVisible: true,
                size: 100,
                viewFieldGroupName: 'stats'
            }
        }),
        messageCampaignRecordPageFieldsSkippedCount: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageCampaign',
            context: {
                viewName: 'messageCampaignRecordPageFields',
                viewFieldName: 'skippedCount',
                fieldName: 'skippedCount',
                position: 5,
                isVisible: true,
                size: 100,
                viewFieldGroupName: 'stats'
            }
        }),
        messageCampaignRecordPageFieldsBouncedCount: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageCampaign',
            context: {
                viewName: 'messageCampaignRecordPageFields',
                viewFieldName: 'bouncedCount',
                fieldName: 'bouncedCount',
                position: 6,
                isVisible: true,
                size: 100,
                viewFieldGroupName: 'stats'
            }
        }),
        messageCampaignRecordPageFieldsComplainedCount: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageCampaign',
            context: {
                viewName: 'messageCampaignRecordPageFields',
                viewFieldName: 'complainedCount',
                fieldName: 'complainedCount',
                position: 7,
                isVisible: true,
                size: 120,
                viewFieldGroupName: 'stats'
            }
        })
    };
};

//# sourceMappingURL=compute-standard-message-campaign-view-fields.util.js.map
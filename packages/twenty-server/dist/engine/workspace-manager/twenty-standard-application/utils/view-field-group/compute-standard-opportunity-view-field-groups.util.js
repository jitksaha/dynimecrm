"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardOpportunityViewFieldGroups", {
    enumerable: true,
    get: function() {
        return computeStandardOpportunityViewFieldGroups;
    }
});
const _i18nlabelutil = require("../i18n-label.util");
const _createstandardviewfieldgroupflatmetadatautil = require("./create-standard-view-field-group-flat-metadata.util");
const computeStandardOpportunityViewFieldGroups = (args)=>{
    return {
        opportunityRecordPageFieldsDeal: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'opportunity',
            context: {
                viewName: 'opportunityRecordPageFields',
                viewFieldGroupName: 'deal',
                name: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "mX3ym7",
                    message: "Deal"
                }),
                position: 0,
                isVisible: true
            }
        }),
        opportunityRecordPageFieldsRelations: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'opportunity',
            context: {
                viewName: 'opportunityRecordPageFields',
                viewFieldGroupName: 'relations',
                name: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "/deTOT",
                    message: "Relations"
                }),
                position: 1,
                isVisible: true
            }
        }),
        opportunityRecordPageFieldsSystem: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'opportunity',
            context: {
                viewName: 'opportunityRecordPageFields',
                viewFieldGroupName: 'system',
                name: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "pxZPo7",
                    message: "System"
                }),
                position: 2,
                isVisible: true
            }
        })
    };
};

//# sourceMappingURL=compute-standard-opportunity-view-field-groups.util.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardCompanyViewFieldGroups", {
    enumerable: true,
    get: function() {
        return computeStandardCompanyViewFieldGroups;
    }
});
const _i18nlabelutil = require("../i18n-label.util");
const _createstandardviewfieldgroupflatmetadatautil = require("./create-standard-view-field-group-flat-metadata.util");
const computeStandardCompanyViewFieldGroups = (args)=>{
    return {
        companyRecordPageFieldsGeneral: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'company',
            context: {
                viewName: 'companyRecordPageFields',
                viewFieldGroupName: 'general',
                name: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Ddadau",
                    message: "General"
                }),
                position: 0,
                isVisible: true
            }
        }),
        companyRecordPageFieldsBusiness: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'company',
            context: {
                viewName: 'companyRecordPageFields',
                viewFieldGroupName: 'business',
                name: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "4pIUYY",
                    message: "Business"
                }),
                position: 1,
                isVisible: true
            }
        }),
        companyRecordPageFieldsContact: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'company',
            context: {
                viewName: 'companyRecordPageFields',
                viewFieldGroupName: 'contact',
                name: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "JEcSer",
                    message: "Contact"
                }),
                position: 2,
                isVisible: true
            }
        }),
        companyRecordPageFieldsSystem: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'company',
            context: {
                viewName: 'companyRecordPageFields',
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

//# sourceMappingURL=compute-standard-company-view-field-groups.util.js.map
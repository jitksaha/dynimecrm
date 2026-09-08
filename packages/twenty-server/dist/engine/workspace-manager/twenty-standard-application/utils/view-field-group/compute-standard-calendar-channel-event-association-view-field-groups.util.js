"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardCalendarChannelEventAssociationViewFieldGroups", {
    enumerable: true,
    get: function() {
        return computeStandardCalendarChannelEventAssociationViewFieldGroups;
    }
});
const _i18nlabelutil = require("../i18n-label.util");
const _createstandardviewfieldgroupflatmetadatautil = require("./create-standard-view-field-group-flat-metadata.util");
const computeStandardCalendarChannelEventAssociationViewFieldGroups = (args)=>{
    return {
        calendarChannelEventAssociationRecordPageFieldsGeneral: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'calendarChannelEventAssociation',
            context: {
                viewName: 'calendarChannelEventAssociationRecordPageFields',
                viewFieldGroupName: 'general',
                name: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Ddadau",
                    message: "General"
                }),
                position: 0,
                isVisible: true
            }
        }),
        calendarChannelEventAssociationRecordPageFieldsSystem: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'calendarChannelEventAssociation',
            context: {
                viewName: 'calendarChannelEventAssociationRecordPageFields',
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

//# sourceMappingURL=compute-standard-calendar-channel-event-association-view-field-groups.util.js.map
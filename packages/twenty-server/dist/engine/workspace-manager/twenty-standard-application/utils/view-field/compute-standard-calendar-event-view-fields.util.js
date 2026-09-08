"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardCalendarEventViewFields", {
    enumerable: true,
    get: function() {
        return computeStandardCalendarEventViewFields;
    }
});
const _createstandardviewfieldflatmetadatautil = require("./create-standard-view-field-flat-metadata.util");
const computeStandardCalendarEventViewFields = (args)=>{
    return {
        allCalendarEventsTitle: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarEvent',
            context: {
                viewName: 'allCalendarEvents',
                viewFieldName: 'title',
                fieldName: 'title',
                position: 0,
                isVisible: true,
                size: 180
            }
        }),
        allCalendarEventsStartsAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarEvent',
            context: {
                viewName: 'allCalendarEvents',
                viewFieldName: 'startsAt',
                fieldName: 'startsAt',
                position: 1,
                isVisible: true,
                size: 150
            }
        }),
        allCalendarEventsEndsAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarEvent',
            context: {
                viewName: 'allCalendarEvents',
                viewFieldName: 'endsAt',
                fieldName: 'endsAt',
                position: 2,
                isVisible: true,
                size: 150
            }
        }),
        allCalendarEventsIsFullDay: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarEvent',
            context: {
                viewName: 'allCalendarEvents',
                viewFieldName: 'isFullDay',
                fieldName: 'isFullDay',
                position: 3,
                isVisible: true,
                size: 100
            }
        }),
        allCalendarEventsLocation: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarEvent',
            context: {
                viewName: 'allCalendarEvents',
                viewFieldName: 'location',
                fieldName: 'location',
                position: 4,
                isVisible: true,
                size: 150
            }
        }),
        allCalendarEventsConferenceLink: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarEvent',
            context: {
                viewName: 'allCalendarEvents',
                viewFieldName: 'conferenceLink',
                fieldName: 'conferenceLink',
                position: 5,
                isVisible: true,
                size: 150
            }
        }),
        allCalendarEventsIsCanceled: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarEvent',
            context: {
                viewName: 'allCalendarEvents',
                viewFieldName: 'isCanceled',
                fieldName: 'isCanceled',
                position: 6,
                isVisible: true,
                size: 100
            }
        }),
        allCalendarEventsCreatedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarEvent',
            context: {
                viewName: 'allCalendarEvents',
                viewFieldName: 'createdAt',
                fieldName: 'createdAt',
                position: 7,
                isVisible: true,
                size: 150
            }
        }),
        calendarEventRecordPageFieldsTitle: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarEvent',
            context: {
                viewName: 'calendarEventRecordPageFields',
                viewFieldName: 'title',
                fieldName: 'title',
                position: 0,
                isVisible: false,
                size: 180,
                viewFieldGroupName: 'general'
            }
        }),
        calendarEventRecordPageFieldsStartsAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarEvent',
            context: {
                viewName: 'calendarEventRecordPageFields',
                viewFieldName: 'startsAt',
                fieldName: 'startsAt',
                position: 1,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        calendarEventRecordPageFieldsEndsAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarEvent',
            context: {
                viewName: 'calendarEventRecordPageFields',
                viewFieldName: 'endsAt',
                fieldName: 'endsAt',
                position: 2,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        calendarEventRecordPageFieldsIsFullDay: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarEvent',
            context: {
                viewName: 'calendarEventRecordPageFields',
                viewFieldName: 'isFullDay',
                fieldName: 'isFullDay',
                position: 3,
                isVisible: false,
                size: 100,
                viewFieldGroupName: 'general'
            }
        }),
        calendarEventRecordPageFieldsIsCanceled: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarEvent',
            context: {
                viewName: 'calendarEventRecordPageFields',
                viewFieldName: 'isCanceled',
                fieldName: 'isCanceled',
                position: 4,
                isVisible: false,
                size: 100,
                viewFieldGroupName: 'general'
            }
        }),
        calendarEventRecordPageFieldsConferenceLink: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarEvent',
            context: {
                viewName: 'calendarEventRecordPageFields',
                viewFieldName: 'conferenceLink',
                fieldName: 'conferenceLink',
                position: 5,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        calendarEventRecordPageFieldsLocation: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarEvent',
            context: {
                viewName: 'calendarEventRecordPageFields',
                viewFieldName: 'location',
                fieldName: 'location',
                position: 6,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        calendarEventRecordPageFieldsDescription: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarEvent',
            context: {
                viewName: 'calendarEventRecordPageFields',
                viewFieldName: 'description',
                fieldName: 'description',
                position: 7,
                isVisible: true,
                size: 200,
                viewFieldGroupName: 'general'
            }
        }),
        calendarEventRecordPageFieldsCalendarEventTargets: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarEvent',
            context: {
                viewName: 'calendarEventRecordPageFields',
                viewFieldName: 'calendarEventTargets',
                fieldName: 'calendarEventTargets',
                position: 8,
                isVisible: true,
                size: 200,
                viewFieldGroupName: 'general'
            }
        }),
        calendarEventRecordPageFieldsExternalCreatedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarEvent',
            context: {
                viewName: 'calendarEventRecordPageFields',
                viewFieldName: 'externalCreatedAt',
                fieldName: 'externalCreatedAt',
                position: 0,
                isVisible: false,
                size: 150,
                viewFieldGroupName: 'system'
            }
        }),
        calendarEventRecordPageFieldsExternalUpdatedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarEvent',
            context: {
                viewName: 'calendarEventRecordPageFields',
                viewFieldName: 'externalUpdatedAt',
                fieldName: 'externalUpdatedAt',
                position: 1,
                isVisible: false,
                size: 150,
                viewFieldGroupName: 'system'
            }
        }),
        calendarEventRecordPageFieldsICalUid: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarEvent',
            context: {
                viewName: 'calendarEventRecordPageFields',
                viewFieldName: 'iCalUid',
                fieldName: 'iCalUid',
                position: 2,
                isVisible: false,
                size: 150,
                viewFieldGroupName: 'system'
            }
        }),
        calendarEventRecordPageFieldsConferenceSolution: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarEvent',
            context: {
                viewName: 'calendarEventRecordPageFields',
                viewFieldName: 'conferenceSolution',
                fieldName: 'conferenceSolution',
                position: 3,
                isVisible: false,
                size: 150,
                viewFieldGroupName: 'system'
            }
        })
    };
};

//# sourceMappingURL=compute-standard-calendar-event-view-fields.util.js.map
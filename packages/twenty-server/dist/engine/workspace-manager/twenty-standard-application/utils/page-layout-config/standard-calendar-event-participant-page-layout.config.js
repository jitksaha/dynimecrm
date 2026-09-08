"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "STANDARD_CALENDAR_EVENT_PARTICIPANT_PAGE_LAYOUT_CONFIG", {
    enumerable: true,
    get: function() {
        return STANDARD_CALENDAR_EVENT_PARTICIPANT_PAGE_LAYOUT_CONFIG;
    }
});
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _standardpagelayouttabstemplate = require("../../constants/standard-page-layout-tabs.template");
const CALENDAR_EVENT_PARTICIPANT_PAGE_TABS = {
    home: {
        universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.calendarEventParticipantRecordPage.tabs.home.universalIdentifier,
        ..._standardpagelayouttabstemplate.TAB_PROPS.home,
        widgets: {
            fields: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.calendarEventParticipantRecordPage.tabs.home.widgets.fields.universalIdentifier,
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.fields
            }
        }
    },
    timeline: {
        universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.calendarEventParticipantRecordPage.tabs.timeline.universalIdentifier,
        ..._standardpagelayouttabstemplate.TAB_PROPS.timeline,
        widgets: {
            timeline: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.calendarEventParticipantRecordPage.tabs.timeline.widgets.timeline.universalIdentifier,
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.timeline
            }
        }
    }
};
const STANDARD_CALENDAR_EVENT_PARTICIPANT_PAGE_LAYOUT_CONFIG = {
    name: 'Default Calendar Event Participant Layout',
    type: _types.PageLayoutType.RECORD_PAGE,
    objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.calendarEventParticipant.universalIdentifier,
    universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.calendarEventParticipantRecordPage.universalIdentifier,
    defaultTabUniversalIdentifier: null,
    tabs: CALENDAR_EVENT_PARTICIPANT_PAGE_TABS
};

//# sourceMappingURL=standard-calendar-event-participant-page-layout.config.js.map
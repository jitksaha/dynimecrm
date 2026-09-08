"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "STANDARD_PERSON_PAGE_LAYOUT_CONFIG", {
    enumerable: true,
    get: function() {
        return STANDARD_PERSON_PAGE_LAYOUT_CONFIG;
    }
});
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _standardpagelayouttabstemplate = require("../../constants/standard-page-layout-tabs.template");
const PERSON_PAGE_TABS = {
    home: {
        universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.personRecordPage.tabs.home.universalIdentifier,
        ..._standardpagelayouttabstemplate.TAB_PROPS.home,
        widgets: {
            fields: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.personRecordPage.tabs.home.widgets.fields.universalIdentifier,
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.fields
            },
            company: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.personRecordPage.tabs.home.widgets.company.universalIdentifier,
                title: 'Company',
                type: _types.WidgetType.FIELD,
                position: _standardpagelayouttabstemplate.VERTICAL_LIST_LAYOUT_POSITIONS.SECOND,
                fieldUniversalIdentifier: _metadata.STANDARD_OBJECTS.person.fields.company.universalIdentifier
            },
            pointOfContactForOpportunities: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.personRecordPage.tabs.home.widgets.pointOfContactForOpportunities.universalIdentifier,
                title: 'Opportunities',
                type: _types.WidgetType.FIELD,
                position: _standardpagelayouttabstemplate.VERTICAL_LIST_LAYOUT_POSITIONS.THIRD,
                fieldUniversalIdentifier: _metadata.STANDARD_OBJECTS.person.fields.pointOfContactForOpportunities.universalIdentifier
            },
            listMemberships: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.personRecordPage.tabs.home.widgets.listMemberships.universalIdentifier,
                title: 'Lists',
                type: _types.WidgetType.FIELD,
                position: _standardpagelayouttabstemplate.VERTICAL_LIST_LAYOUT_POSITIONS.FIFTH,
                fieldUniversalIdentifier: _metadata.STANDARD_OBJECTS.person.fields.listMemberships.universalIdentifier
            }
        }
    },
    timeline: {
        universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.personRecordPage.tabs.timeline.universalIdentifier,
        ..._standardpagelayouttabstemplate.TAB_PROPS.timeline,
        widgets: {
            timeline: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.personRecordPage.tabs.timeline.widgets.timeline.universalIdentifier,
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.timeline
            }
        }
    },
    tasks: {
        universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.personRecordPage.tabs.tasks.universalIdentifier,
        ..._standardpagelayouttabstemplate.TAB_PROPS.tasks,
        widgets: {
            tasks: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.personRecordPage.tabs.tasks.widgets.tasks.universalIdentifier,
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.tasks
            }
        }
    },
    notes: {
        universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.personRecordPage.tabs.notes.universalIdentifier,
        ..._standardpagelayouttabstemplate.TAB_PROPS.notes,
        widgets: {
            notes: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.personRecordPage.tabs.notes.widgets.notes.universalIdentifier,
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.notes
            }
        }
    },
    files: {
        universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.personRecordPage.tabs.files.universalIdentifier,
        ..._standardpagelayouttabstemplate.TAB_PROPS.files,
        widgets: {
            files: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.personRecordPage.tabs.files.widgets.files.universalIdentifier,
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.files
            }
        }
    },
    emails: {
        universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.personRecordPage.tabs.emails.universalIdentifier,
        ..._standardpagelayouttabstemplate.TAB_PROPS.emails,
        widgets: {
            emails: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.personRecordPage.tabs.emails.widgets.emails.universalIdentifier,
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.emails
            }
        }
    },
    calendar: {
        universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.personRecordPage.tabs.calendar.universalIdentifier,
        ..._standardpagelayouttabstemplate.TAB_PROPS.calendar,
        widgets: {
            calendar: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.personRecordPage.tabs.calendar.widgets.calendar.universalIdentifier,
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.calendar
            }
        }
    }
};
const STANDARD_PERSON_PAGE_LAYOUT_CONFIG = {
    name: 'Default Person Layout',
    type: _types.PageLayoutType.RECORD_PAGE,
    objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.person.universalIdentifier,
    universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.personRecordPage.universalIdentifier,
    defaultTabUniversalIdentifier: null,
    tabs: PERSON_PAGE_TABS
};

//# sourceMappingURL=standard-person-page-layout.config.js.map
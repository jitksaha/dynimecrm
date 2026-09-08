"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "STANDARD_OPPORTUNITY_PAGE_LAYOUT_CONFIG", {
    enumerable: true,
    get: function() {
        return STANDARD_OPPORTUNITY_PAGE_LAYOUT_CONFIG;
    }
});
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _standardpagelayouttabstemplate = require("../../constants/standard-page-layout-tabs.template");
const OPPORTUNITY_PAGE_TABS = {
    home: {
        universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.opportunityRecordPage.tabs.home.universalIdentifier,
        ..._standardpagelayouttabstemplate.TAB_PROPS.home,
        widgets: {
            fields: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.opportunityRecordPage.tabs.home.widgets.fields.universalIdentifier,
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.fields
            },
            pointOfContact: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.opportunityRecordPage.tabs.home.widgets.pointOfContact.universalIdentifier,
                title: 'Point of Contact',
                type: _types.WidgetType.FIELD,
                position: _standardpagelayouttabstemplate.VERTICAL_LIST_LAYOUT_POSITIONS.SECOND,
                fieldUniversalIdentifier: _metadata.STANDARD_OBJECTS.opportunity.fields.pointOfContact.universalIdentifier
            },
            company: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.opportunityRecordPage.tabs.home.widgets.company.universalIdentifier,
                title: 'Company',
                type: _types.WidgetType.FIELD,
                position: _standardpagelayouttabstemplate.VERTICAL_LIST_LAYOUT_POSITIONS.THIRD,
                fieldUniversalIdentifier: _metadata.STANDARD_OBJECTS.opportunity.fields.company.universalIdentifier
            },
            owner: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.opportunityRecordPage.tabs.home.widgets.owner.universalIdentifier,
                title: 'Owner',
                type: _types.WidgetType.FIELD,
                position: _standardpagelayouttabstemplate.VERTICAL_LIST_LAYOUT_POSITIONS.FOURTH,
                fieldUniversalIdentifier: _metadata.STANDARD_OBJECTS.opportunity.fields.owner.universalIdentifier
            }
        }
    },
    timeline: {
        universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.opportunityRecordPage.tabs.timeline.universalIdentifier,
        ..._standardpagelayouttabstemplate.TAB_PROPS.timeline,
        widgets: {
            timeline: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.opportunityRecordPage.tabs.timeline.widgets.timeline.universalIdentifier,
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.timeline
            }
        }
    },
    tasks: {
        universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.opportunityRecordPage.tabs.tasks.universalIdentifier,
        ..._standardpagelayouttabstemplate.TAB_PROPS.tasks,
        widgets: {
            tasks: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.opportunityRecordPage.tabs.tasks.widgets.tasks.universalIdentifier,
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.tasks
            }
        }
    },
    notes: {
        universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.opportunityRecordPage.tabs.notes.universalIdentifier,
        ..._standardpagelayouttabstemplate.TAB_PROPS.notes,
        widgets: {
            notes: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.opportunityRecordPage.tabs.notes.widgets.notes.universalIdentifier,
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.notes
            }
        }
    },
    files: {
        universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.opportunityRecordPage.tabs.files.universalIdentifier,
        ..._standardpagelayouttabstemplate.TAB_PROPS.files,
        widgets: {
            files: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.opportunityRecordPage.tabs.files.widgets.files.universalIdentifier,
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.files
            }
        }
    },
    emails: {
        universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.opportunityRecordPage.tabs.emails.universalIdentifier,
        ..._standardpagelayouttabstemplate.TAB_PROPS.emails,
        widgets: {
            emails: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.opportunityRecordPage.tabs.emails.widgets.emails.universalIdentifier,
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.emails
            }
        }
    },
    calendar: {
        universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.opportunityRecordPage.tabs.calendar.universalIdentifier,
        ..._standardpagelayouttabstemplate.TAB_PROPS.calendar,
        widgets: {
            calendar: {
                universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.opportunityRecordPage.tabs.calendar.widgets.calendar.universalIdentifier,
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.calendar
            }
        }
    }
};
const STANDARD_OPPORTUNITY_PAGE_LAYOUT_CONFIG = {
    name: 'Default Opportunity Layout',
    type: _types.PageLayoutType.RECORD_PAGE,
    objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.opportunity.universalIdentifier,
    universalIdentifier: _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.opportunityRecordPage.universalIdentifier,
    defaultTabUniversalIdentifier: null,
    tabs: OPPORTUNITY_PAGE_TABS
};

//# sourceMappingURL=standard-opportunity-page-layout.config.js.map
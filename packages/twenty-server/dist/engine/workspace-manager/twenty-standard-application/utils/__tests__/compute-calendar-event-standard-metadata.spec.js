"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _widgetconfigurationtypetype = require("../../../../metadata-modules/page-layout-widget/enums/widget-configuration-type.type");
const _standardpagelayouttabstemplate = require("../../constants/standard-page-layout-tabs.template");
const _twentystandardapplicationallflatentitymapsconstant = require("../twenty-standard-application-all-flat-entity-maps.constant");
const WORKSPACE_ID = '20202020-1111-4111-8111-111111111111';
const TWENTY_STANDARD_APPLICATION_ID = '20202020-2222-4222-8222-222222222222';
const NOW = '2024-01-01T00:00:00.000Z';
describe('CalendarEvent standard metadata build', ()=>{
    const { allFlatEntityMaps } = (0, _twentystandardapplicationallflatentitymapsconstant.computeTwentyStandardApplicationAllFlatEntityMaps)({
        now: NOW,
        workspaceId: WORKSPACE_ID,
        twentyStandardApplicationId: TWENTY_STANDARD_APPLICATION_ID
    });
    it('builds the calendarEvent object', ()=>{
        const { byUniversalIdentifier } = allFlatEntityMaps.flatObjectMetadataMaps;
        expect(byUniversalIdentifier[_metadata.STANDARD_OBJECTS.calendarEvent.universalIdentifier]).toBeDefined();
    });
    it('uses the important calendar event detail fields on the record page', ()=>{
        const recordPageViewFields = Object.values(allFlatEntityMaps.flatViewFieldMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((viewField)=>viewField.viewUniversalIdentifier === _metadata.STANDARD_OBJECTS.calendarEvent.views.calendarEventRecordPageFields.universalIdentifier);
        const viewFieldFieldUniversalIdentifiers = recordPageViewFields.map((viewField)=>viewField.fieldMetadataUniversalIdentifier);
        expect(viewFieldFieldUniversalIdentifiers).toHaveLength(13);
        expect(viewFieldFieldUniversalIdentifiers).toEqual(expect.arrayContaining([
            _metadata.STANDARD_OBJECTS.calendarEvent.fields.title.universalIdentifier,
            _metadata.STANDARD_OBJECTS.calendarEvent.fields.startsAt.universalIdentifier,
            _metadata.STANDARD_OBJECTS.calendarEvent.fields.endsAt.universalIdentifier,
            _metadata.STANDARD_OBJECTS.calendarEvent.fields.isFullDay.universalIdentifier,
            _metadata.STANDARD_OBJECTS.calendarEvent.fields.isCanceled.universalIdentifier,
            _metadata.STANDARD_OBJECTS.calendarEvent.fields.conferenceLink.universalIdentifier,
            _metadata.STANDARD_OBJECTS.calendarEvent.fields.location.universalIdentifier,
            _metadata.STANDARD_OBJECTS.calendarEvent.fields.description.universalIdentifier,
            _metadata.STANDARD_OBJECTS.calendarEvent.fields.calendarEventTargets.universalIdentifier,
            _metadata.STANDARD_OBJECTS.calendarEvent.fields.externalCreatedAt.universalIdentifier,
            _metadata.STANDARD_OBJECTS.calendarEvent.fields.externalUpdatedAt.universalIdentifier,
            _metadata.STANDARD_OBJECTS.calendarEvent.fields.iCalUid.universalIdentifier,
            _metadata.STANDARD_OBJECTS.calendarEvent.fields.conferenceSolution.universalIdentifier
        ]));
        expect(viewFieldFieldUniversalIdentifiers).not.toContain(_metadata.STANDARD_OBJECTS.calendarEvent.fields.createdAt.universalIdentifier);
        expect(viewFieldFieldUniversalIdentifiers).not.toContain(_metadata.STANDARD_OBJECTS.calendarEvent.fields.calendarEventParticipants.universalIdentifier);
        expect(recordPageViewFields.filter((viewField)=>viewField.isVisible).sort((firstViewField, secondViewField)=>{
            return firstViewField.position - secondViewField.position;
        }).map((viewField)=>viewField.fieldMetadataUniversalIdentifier)).toEqual([
            _metadata.STANDARD_OBJECTS.calendarEvent.fields.startsAt.universalIdentifier,
            _metadata.STANDARD_OBJECTS.calendarEvent.fields.endsAt.universalIdentifier,
            _metadata.STANDARD_OBJECTS.calendarEvent.fields.conferenceLink.universalIdentifier,
            _metadata.STANDARD_OBJECTS.calendarEvent.fields.location.universalIdentifier,
            _metadata.STANDARD_OBJECTS.calendarEvent.fields.description.universalIdentifier,
            _metadata.STANDARD_OBJECTS.calendarEvent.fields.calendarEventTargets.universalIdentifier
        ]);
        expect(recordPageViewFields.filter((viewField)=>!viewField.isVisible).map((viewField)=>viewField.fieldMetadataUniversalIdentifier)).toEqual(expect.arrayContaining([
            _metadata.STANDARD_OBJECTS.calendarEvent.fields.title.universalIdentifier,
            _metadata.STANDARD_OBJECTS.calendarEvent.fields.isFullDay.universalIdentifier,
            _metadata.STANDARD_OBJECTS.calendarEvent.fields.isCanceled.universalIdentifier,
            _metadata.STANDARD_OBJECTS.calendarEvent.fields.externalCreatedAt.universalIdentifier,
            _metadata.STANDARD_OBJECTS.calendarEvent.fields.externalUpdatedAt.universalIdentifier,
            _metadata.STANDARD_OBJECTS.calendarEvent.fields.iCalUid.universalIdentifier,
            _metadata.STANDARD_OBJECTS.calendarEvent.fields.conferenceSolution.universalIdentifier
        ]));
    });
    it('groups the record page fields into general and system sections', ()=>{
        const generalGroup = allFlatEntityMaps.flatViewFieldGroupMaps.byUniversalIdentifier[_metadata.STANDARD_OBJECTS.calendarEvent.views.calendarEventRecordPageFields.viewFieldGroups.general.universalIdentifier];
        const systemGroup = allFlatEntityMaps.flatViewFieldGroupMaps.byUniversalIdentifier[_metadata.STANDARD_OBJECTS.calendarEvent.views.calendarEventRecordPageFields.viewFieldGroups.system.universalIdentifier];
        expect(generalGroup).toBeDefined();
        expect(systemGroup).toBeDefined();
    });
    it('links the calendar event fields widget to its record-page fields view', ()=>{
        const fieldsWidget = allFlatEntityMaps.flatPageLayoutWidgetMaps.byUniversalIdentifier[_metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.calendarEventRecordPage.tabs.home.widgets.fields.universalIdentifier];
        expect(fieldsWidget?.universalConfiguration).toMatchObject({
            configurationType: _widgetconfigurationtypetype.WidgetConfigurationType.FIELDS,
            viewUniversalIdentifier: _metadata.STANDARD_OBJECTS.calendarEvent.views.calendarEventRecordPageFields.universalIdentifier
        });
    });
    it('configures participants as a standard relation field widget', ()=>{
        const participantsWidget = allFlatEntityMaps.flatPageLayoutWidgetMaps.byUniversalIdentifier[_metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.calendarEventRecordPage.tabs.home.widgets.participants.universalIdentifier];
        expect(participantsWidget?.universalConfiguration).toMatchObject({
            configurationType: _widgetconfigurationtypetype.WidgetConfigurationType.FIELD,
            fieldMetadataId: _metadata.STANDARD_OBJECTS.calendarEvent.fields.calendarEventParticipants.universalIdentifier
        });
    });
    it('configures a timeline tab on the calendar event record page', ()=>{
        const timelineWidget = allFlatEntityMaps.flatPageLayoutWidgetMaps.byUniversalIdentifier[_metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.calendarEventRecordPage.tabs.timeline.widgets.timeline.universalIdentifier];
        expect(Object.keys(_metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.calendarEventRecordPage.tabs)).toEqual([
            'home',
            'timeline',
            'summary',
            'callRecording'
        ]);
        expect(timelineWidget?.universalConfiguration).toMatchObject({
            configurationType: _widgetconfigurationtypetype.WidgetConfigurationType.TIMELINE
        });
    });
    it('configures the native summary tab on the calendar event record page', ()=>{
        const summaryTabUniversalIdentifier = _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.calendarEventRecordPage.tabs.summary.universalIdentifier;
        const summaryWidgetUniversalIdentifier = _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.calendarEventRecordPage.tabs.summary.widgets.summary.universalIdentifier;
        const summaryTab = allFlatEntityMaps.flatPageLayoutTabMaps.byUniversalIdentifier[summaryTabUniversalIdentifier];
        const summaryWidget = allFlatEntityMaps.flatPageLayoutWidgetMaps.byUniversalIdentifier[summaryWidgetUniversalIdentifier];
        expect(summaryTab).toMatchObject({
            title: 'Summary',
            icon: 'IconFileText',
            position: 30,
            layoutMode: _types.PageLayoutTabLayoutMode.VERTICAL_LIST
        });
        expect(summaryWidget).toMatchObject({
            title: 'Summary',
            type: _types.WidgetType.CALL_RECORDING_SUMMARY,
            pageLayoutTabUniversalIdentifier: summaryTabUniversalIdentifier,
            position: _standardpagelayouttabstemplate.VERTICAL_LIST_LAYOUT_POSITIONS.FIRST,
            universalConfiguration: {
                configurationType: _widgetconfigurationtypetype.WidgetConfigurationType.CALL_RECORDING_SUMMARY
            }
        });
    });
    it('configures the native call recording tab on the calendar event record page', ()=>{
        const callRecordingTabUniversalIdentifier = _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.calendarEventRecordPage.tabs.callRecording.universalIdentifier;
        const transcriptWidgetUniversalIdentifier = _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.calendarEventRecordPage.tabs.callRecording.widgets.transcript.universalIdentifier;
        const callRecordingTab = allFlatEntityMaps.flatPageLayoutTabMaps.byUniversalIdentifier[callRecordingTabUniversalIdentifier];
        const transcriptWidget = allFlatEntityMaps.flatPageLayoutWidgetMaps.byUniversalIdentifier[transcriptWidgetUniversalIdentifier];
        expect(callRecordingTab).toMatchObject({
            title: 'Call Recording',
            icon: 'IconVideo',
            position: 40,
            layoutMode: _types.PageLayoutTabLayoutMode.VERTICAL_LIST
        });
        expect(transcriptWidget).toMatchObject({
            title: 'Transcript',
            type: _types.WidgetType.CALL_RECORDING_TRANSCRIPT,
            pageLayoutTabUniversalIdentifier: callRecordingTabUniversalIdentifier,
            position: _standardpagelayouttabstemplate.VERTICAL_LIST_LAYOUT_POSITIONS.FIRST,
            universalConfiguration: {
                configurationType: _widgetconfigurationtypetype.WidgetConfigurationType.CALL_RECORDING_TRANSCRIPT
            }
        });
    });
    it('renders call recordings through a standard relation field widget', ()=>{
        const callRecordingsWidget = allFlatEntityMaps.flatPageLayoutWidgetMaps.byUniversalIdentifier[_metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.calendarEventRecordPage.tabs.home.widgets.callRecordings.universalIdentifier];
        expect(callRecordingsWidget?.universalConfiguration).toMatchObject({
            configurationType: _widgetconfigurationtypetype.WidgetConfigurationType.FIELD,
            fieldMetadataId: _metadata.STANDARD_OBJECTS.calendarEvent.fields.callRecordings.universalIdentifier
        });
    });
});

//# sourceMappingURL=compute-calendar-event-standard-metadata.spec.js.map
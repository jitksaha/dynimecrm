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
describe('CallRecording standard metadata build', ()=>{
    const { allFlatEntityMaps } = (0, _twentystandardapplicationallflatentitymapsconstant.computeTwentyStandardApplicationAllFlatEntityMaps)({
        now: NOW,
        workspaceId: WORKSPACE_ID,
        twentyStandardApplicationId: TWENTY_STANDARD_APPLICATION_ID
    });
    it('builds the callRecording object', ()=>{
        const { byUniversalIdentifier } = allFlatEntityMaps.flatObjectMetadataMaps;
        expect(byUniversalIdentifier[_metadata.STANDARD_OBJECTS.callRecording.universalIdentifier]).toBeDefined();
    });
    it('marks the callRecording object as system', ()=>{
        const callRecording = allFlatEntityMaps.flatObjectMetadataMaps.byUniversalIdentifier[_metadata.STANDARD_OBJECTS.callRecording.universalIdentifier];
        expect(callRecording?.isSystem).toBe(true);
    });
    it('offers the full recording lifecycle as status options', ()=>{
        const statusField = allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[_metadata.STANDARD_OBJECTS.callRecording.fields.status.universalIdentifier];
        expect(statusField?.options?.map((option)=>option.value)).toEqual([
            'SCHEDULED',
            'JOINING',
            'RECORDING',
            'PROCESSING',
            'COMPLETED',
            'FAILED',
            'NOT_RECORDED'
        ]);
    });
    it('links callRecording to a calendarEvent through a direct relation', ()=>{
        const calendarEventField = allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[_metadata.STANDARD_OBJECTS.callRecording.fields.calendarEvent.universalIdentifier];
        expect(calendarEventField).toBeDefined();
    });
    it('indexes the calendarEvent foreign key', ()=>{
        const calendarEventIdIndex = allFlatEntityMaps.flatIndexMaps.byUniversalIdentifier[_metadata.STANDARD_OBJECTS.callRecording.indexes.calendarEventIdIndex.universalIdentifier];
        expect(calendarEventIdIndex).toBeDefined();
    });
    it('keeps the callRecording table view focused on its label identifier and statuses', ()=>{
        const viewFieldFieldUniversalIdentifiers = Object.values(allFlatEntityMaps.flatViewFieldMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((viewField)=>viewField.viewUniversalIdentifier === _metadata.STANDARD_OBJECTS.callRecording.views.allCallRecordings.universalIdentifier).map((viewField)=>viewField.fieldMetadataUniversalIdentifier);
        expect(viewFieldFieldUniversalIdentifiers).toHaveLength(4);
        expect(viewFieldFieldUniversalIdentifiers).toEqual(expect.arrayContaining([
            _metadata.STANDARD_OBJECTS.callRecording.fields.title.universalIdentifier,
            _metadata.STANDARD_OBJECTS.callRecording.fields.status.universalIdentifier,
            _metadata.STANDARD_OBJECTS.callRecording.fields.recordingRequestStatus.universalIdentifier,
            _metadata.STANDARD_OBJECTS.callRecording.fields.startedAt.universalIdentifier
        ]));
    });
    it('uses the important callRecording detail fields on the record page', ()=>{
        const viewFieldFieldUniversalIdentifiers = Object.values(allFlatEntityMaps.flatViewFieldMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((viewField)=>viewField.viewUniversalIdentifier === _metadata.STANDARD_OBJECTS.callRecording.views.callRecordingRecordPageFields.universalIdentifier).map((viewField)=>viewField.fieldMetadataUniversalIdentifier);
        expect(viewFieldFieldUniversalIdentifiers).toHaveLength(9);
        expect(viewFieldFieldUniversalIdentifiers).toEqual(expect.arrayContaining([
            _metadata.STANDARD_OBJECTS.callRecording.fields.title.universalIdentifier,
            _metadata.STANDARD_OBJECTS.callRecording.fields.status.universalIdentifier,
            _metadata.STANDARD_OBJECTS.callRecording.fields.recordingRequestStatus.universalIdentifier,
            _metadata.STANDARD_OBJECTS.callRecording.fields.startedAt.universalIdentifier,
            _metadata.STANDARD_OBJECTS.callRecording.fields.endedAt.universalIdentifier,
            _metadata.STANDARD_OBJECTS.callRecording.fields.video.universalIdentifier,
            _metadata.STANDARD_OBJECTS.callRecording.fields.audio.universalIdentifier,
            _metadata.STANDARD_OBJECTS.callRecording.fields.transcript.universalIdentifier,
            _metadata.STANDARD_OBJECTS.callRecording.fields.summary.universalIdentifier
        ]));
        expect(viewFieldFieldUniversalIdentifiers).not.toContain(_metadata.STANDARD_OBJECTS.callRecording.fields.createdAt.universalIdentifier);
        expect(viewFieldFieldUniversalIdentifiers).not.toContain(_metadata.STANDARD_OBJECTS.callRecording.fields.createdBy.universalIdentifier);
    });
    it('configures the native summary tab on the call recording record page', ()=>{
        const summaryTabUniversalIdentifier = _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.callRecordingRecordPage.tabs.summary.universalIdentifier;
        const summaryWidgetUniversalIdentifier = _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.callRecordingRecordPage.tabs.summary.widgets.summary.universalIdentifier;
        expect(Object.keys(_metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.callRecordingRecordPage.tabs)).toEqual([
            'home',
            'timeline',
            'summary',
            'callRecording'
        ]);
        expect(allFlatEntityMaps.flatPageLayoutTabMaps.byUniversalIdentifier[summaryTabUniversalIdentifier]).toMatchObject({
            title: 'Summary',
            icon: 'IconFileText',
            position: 30,
            layoutMode: _types.PageLayoutTabLayoutMode.VERTICAL_LIST
        });
        expect(allFlatEntityMaps.flatPageLayoutWidgetMaps.byUniversalIdentifier[summaryWidgetUniversalIdentifier]).toMatchObject({
            title: 'Summary',
            type: _types.WidgetType.CALL_RECORDING_SUMMARY,
            pageLayoutTabUniversalIdentifier: summaryTabUniversalIdentifier,
            position: _standardpagelayouttabstemplate.VERTICAL_LIST_LAYOUT_POSITIONS.FIRST,
            universalConfiguration: {
                configurationType: _widgetconfigurationtypetype.WidgetConfigurationType.CALL_RECORDING_SUMMARY
            }
        });
    });
    it('configures the native call recording tab on the call recording record page', ()=>{
        const callRecordingTabUniversalIdentifier = _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.callRecordingRecordPage.tabs.callRecording.universalIdentifier;
        const transcriptWidgetUniversalIdentifier = _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.callRecordingRecordPage.tabs.callRecording.widgets.transcript.universalIdentifier;
        expect(allFlatEntityMaps.flatPageLayoutTabMaps.byUniversalIdentifier[callRecordingTabUniversalIdentifier]).toMatchObject({
            title: 'Call Recording',
            icon: 'IconVideo',
            position: 40,
            layoutMode: _types.PageLayoutTabLayoutMode.VERTICAL_LIST
        });
        expect(allFlatEntityMaps.flatPageLayoutWidgetMaps.byUniversalIdentifier[transcriptWidgetUniversalIdentifier]).toMatchObject({
            title: 'Transcript',
            type: _types.WidgetType.CALL_RECORDING_TRANSCRIPT,
            pageLayoutTabUniversalIdentifier: callRecordingTabUniversalIdentifier,
            position: _standardpagelayouttabstemplate.VERTICAL_LIST_LAYOUT_POSITIONS.FIRST,
            universalConfiguration: {
                configurationType: _widgetconfigurationtypetype.WidgetConfigurationType.CALL_RECORDING_TRANSCRIPT
            }
        });
    });
    it('links the callRecording fields widget to its record-page fields view', ()=>{
        const fieldsWidget = allFlatEntityMaps.flatPageLayoutWidgetMaps.byUniversalIdentifier[_metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.callRecordingRecordPage.tabs.home.widgets.fields.universalIdentifier];
        expect(fieldsWidget?.universalConfiguration).toMatchObject({
            configurationType: _widgetconfigurationtypetype.WidgetConfigurationType.FIELDS,
            viewUniversalIdentifier: _metadata.STANDARD_OBJECTS.callRecording.views.callRecordingRecordPageFields.universalIdentifier
        });
    });
});

//# sourceMappingURL=compute-call-recording-standard-metadata.spec.js.map
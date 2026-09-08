"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardCallRecordingViewFields", {
    enumerable: true,
    get: function() {
        return computeStandardCallRecordingViewFields;
    }
});
const _createstandardviewfieldflatmetadatautil = require("./create-standard-view-field-flat-metadata.util");
const computeStandardCallRecordingViewFields = (args)=>{
    return {
        // title is the label identifier; it must hold the lowest position in non-widget views.
        allCallRecordingsTitle: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'callRecording',
            context: {
                viewName: 'allCallRecordings',
                viewFieldName: 'title',
                fieldName: 'title',
                position: 0,
                isVisible: true,
                size: 200
            }
        }),
        allCallRecordingsStatus: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'callRecording',
            context: {
                viewName: 'allCallRecordings',
                viewFieldName: 'status',
                fieldName: 'status',
                position: 1,
                isVisible: true,
                size: 150
            }
        }),
        allCallRecordingsStartedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'callRecording',
            context: {
                viewName: 'allCallRecordings',
                viewFieldName: 'startedAt',
                fieldName: 'startedAt',
                position: 3,
                isVisible: true,
                size: 150
            }
        }),
        allCallRecordingsRecordingRequestStatus: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'callRecording',
            context: {
                viewName: 'allCallRecordings',
                viewFieldName: 'recordingRequestStatus',
                fieldName: 'recordingRequestStatus',
                position: 2,
                isVisible: true,
                size: 150
            }
        }),
        callRecordingRecordPageFieldsTitle: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'callRecording',
            context: {
                viewName: 'callRecordingRecordPageFields',
                viewFieldName: 'title',
                fieldName: 'title',
                position: 0,
                isVisible: true,
                size: 200,
                viewFieldGroupName: 'general'
            }
        }),
        callRecordingRecordPageFieldsStatus: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'callRecording',
            context: {
                viewName: 'callRecordingRecordPageFields',
                viewFieldName: 'status',
                fieldName: 'status',
                position: 1,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        callRecordingRecordPageFieldsStartedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'callRecording',
            context: {
                viewName: 'callRecordingRecordPageFields',
                viewFieldName: 'startedAt',
                fieldName: 'startedAt',
                position: 3,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        callRecordingRecordPageFieldsEndedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'callRecording',
            context: {
                viewName: 'callRecordingRecordPageFields',
                viewFieldName: 'endedAt',
                fieldName: 'endedAt',
                position: 4,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        callRecordingRecordPageFieldsRecordingRequestStatus: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'callRecording',
            context: {
                viewName: 'callRecordingRecordPageFields',
                viewFieldName: 'recordingRequestStatus',
                fieldName: 'recordingRequestStatus',
                position: 2,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        callRecordingRecordPageFieldsVideo: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'callRecording',
            context: {
                viewName: 'callRecordingRecordPageFields',
                viewFieldName: 'video',
                fieldName: 'video',
                position: 5,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        callRecordingRecordPageFieldsAudio: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'callRecording',
            context: {
                viewName: 'callRecordingRecordPageFields',
                viewFieldName: 'audio',
                fieldName: 'audio',
                position: 6,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        callRecordingRecordPageFieldsTranscript: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'callRecording',
            context: {
                viewName: 'callRecordingRecordPageFields',
                viewFieldName: 'transcript',
                fieldName: 'transcript',
                position: 7,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        callRecordingRecordPageFieldsSummary: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'callRecording',
            context: {
                viewName: 'callRecordingRecordPageFields',
                viewFieldName: 'summary',
                fieldName: 'summary',
                position: 8,
                isVisible: true,
                size: 200,
                viewFieldGroupName: 'general'
            }
        })
    };
};

//# sourceMappingURL=compute-standard-call-recording-view-fields.util.js.map
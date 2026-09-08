"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildCallRecordingStandardFlatFieldMetadatas", {
    enumerable: true,
    get: function() {
        return buildCallRecordingStandardFlatFieldMetadatas;
    }
});
const _i18nlabelutil = require("../i18n-label.util");
const _types = require("twenty-shared/types");
const _createstandardfieldflatmetadatautil = require("./create-standard-field-flat-metadata.util");
const _createstandardrelationfieldflatmetadatautil = require("./create-standard-relation-field-flat-metadata.util");
const _callrecordingrequeststatusenum = require("../../../../../modules/call-recording/common/enums/call-recording-request-status.enum");
const _callrecordingstatusenum = require("../../../../../modules/call-recording/common/enums/call-recording-status.enum");
const buildCallRecordingStandardFlatFieldMetadatas = ({ now, objectName, workspaceId, standardObjectMetadataRelatedEntityIds, dependencyFlatEntityMaps, twentyStandardApplicationId })=>({
        id: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'id',
                type: _types.FieldMetadataType.UUID,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Jq9kVe",
                    message: "Id"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "tO7kqE",
                    message: "Id"
                }),
                icon: 'Icon123',
                isSystem: true,
                isNullable: false,
                isUIEditable: false,
                defaultValue: 'uuid'
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        createdAt: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'createdAt',
                type: _types.FieldMetadataType.DATE_TIME,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "MZxGED",
                    message: "Creation date"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "ezEYQZ",
                    message: "Creation date"
                }),
                icon: 'IconCalendar',
                isSystem: true,
                isNullable: false,
                isUIEditable: false,
                defaultValue: 'now',
                settings: {
                    displayFormat: _types.DateDisplayFormat.RELATIVE
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        updatedAt: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'updatedAt',
                type: _types.FieldMetadataType.DATE_TIME,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "hzBM8U",
                    message: "Last update"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "OBGY97",
                    message: "Last time the record was changed"
                }),
                icon: 'IconCalendarClock',
                isSystem: true,
                isNullable: false,
                isUIEditable: false,
                defaultValue: 'now',
                settings: {
                    displayFormat: _types.DateDisplayFormat.RELATIVE
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        deletedAt: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'deletedAt',
                type: _types.FieldMetadataType.DATE_TIME,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Sf3H2K",
                    message: "Deleted at"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "bCL+CN",
                    message: "Date when the record was deleted"
                }),
                icon: 'IconCalendarMinus',
                isSystem: true,
                isNullable: true,
                isUIEditable: false,
                settings: {
                    displayFormat: _types.DateDisplayFormat.RELATIVE
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        title: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'title',
                type: _types.FieldMetadataType.TEXT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "rB+mLn",
                    message: "Title"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "BV/hGy",
                    message: "Meeting title from the calendar event"
                }),
                icon: 'IconNotes',
                isNullable: true,
                isUIEditable: false
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        status: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'status',
                type: _types.FieldMetadataType.SELECT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "a1tUtz",
                    message: "Status"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "lTGIDF",
                    message: "Recording lifecycle status"
                }),
                icon: 'IconProgress',
                isNullable: false,
                isUIEditable: false,
                defaultValue: "'SCHEDULED'",
                options: [
                    {
                        id: '7fa515ba-e3cb-48f7-914f-e1f664d5d920',
                        value: _callrecordingstatusenum.CallRecordingStatus.SCHEDULED,
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "gqz/Jf",
                            message: "Scheduled"
                        }),
                        position: 0,
                        color: 'sky'
                    },
                    {
                        id: '96844ba3-364b-4975-8abc-886cca92ec99',
                        value: _callrecordingstatusenum.CallRecordingStatus.JOINING,
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "+KEn4d",
                            message: "Joining"
                        }),
                        position: 1,
                        color: 'blue'
                    },
                    {
                        id: 'eccdad8b-8424-48ba-ad7f-f38517fa83fc',
                        value: _callrecordingstatusenum.CallRecordingStatus.RECORDING,
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "tsYhp1",
                            message: "Recording"
                        }),
                        position: 2,
                        color: 'red'
                    },
                    {
                        id: 'c8222203-5b44-4ac6-8142-0a7eb2074d7b',
                        value: _callrecordingstatusenum.CallRecordingStatus.PROCESSING,
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "cTz6/1",
                            message: "Processing"
                        }),
                        position: 3,
                        color: 'orange'
                    },
                    {
                        id: 'd17faf71-af3c-4260-9021-2ffaaa5648c4',
                        value: _callrecordingstatusenum.CallRecordingStatus.COMPLETED,
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "DjvRWr",
                            message: "Completed"
                        }),
                        position: 4,
                        color: 'green'
                    },
                    {
                        id: '4800777e-54a8-4464-9c01-07d6eefd04da',
                        value: _callrecordingstatusenum.CallRecordingStatus.FAILED,
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "K9t/v4",
                            message: "Failed"
                        }),
                        position: 5,
                        color: 'gray'
                    },
                    {
                        id: 'cbd14df8-9cc2-4399-92f5-31fc41f3768b',
                        value: _callrecordingstatusenum.CallRecordingStatus.NOT_RECORDED,
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "WunOam",
                            message: "Not recorded"
                        }),
                        position: 6,
                        color: 'yellow'
                    }
                ]
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        recordingRequestStatus: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'recordingRequestStatus',
                type: _types.FieldMetadataType.SELECT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "GFNLkz",
                    message: "Request Status"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "9+tIiJ",
                    message: "Recording request status"
                }),
                icon: 'IconCircleCheck',
                isNullable: false,
                isUIEditable: false,
                defaultValue: "'REQUESTED'",
                options: [
                    {
                        id: 'fe992923-2f51-494d-bb32-42e96a703778',
                        value: _callrecordingrequeststatusenum.CallRecordingRequestStatus.REQUESTED,
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "2ydSiw",
                            message: "Requested"
                        }),
                        position: 0,
                        color: 'sky'
                    },
                    {
                        id: '485767c2-2dda-4b83-91d8-6025cdb4b9df',
                        value: _callrecordingrequeststatusenum.CallRecordingRequestStatus.CANCELED,
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "JrNGiU",
                            message: "Canceled"
                        }),
                        position: 1,
                        color: 'gray'
                    }
                ]
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        applicationId: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'applicationId',
                type: _types.FieldMetadataType.UUID,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "8O6Zab",
                    message: "Application ID"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "VUEkq2",
                    message: "Installed source app that manages or ingested this recording"
                }),
                icon: 'IconApps',
                isNullable: true,
                isUIEditable: false
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        externalBotId: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'externalBotId',
                type: _types.FieldMetadataType.TEXT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "jCBIuc",
                    message: "External Bot ID"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "SoRH5/",
                    message: "Source app bot/session id, when the source supports bots"
                }),
                icon: 'IconRobot',
                isNullable: true,
                isUIEditable: false
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        externalRecordingId: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'externalRecordingId',
                type: _types.FieldMetadataType.TEXT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "UUFPvo",
                    message: "External Recording ID"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "xkRCzV",
                    message: "Source app recording id, when present"
                }),
                icon: 'IconId',
                isNullable: true,
                isUIEditable: false
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        startedAt: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'startedAt',
                type: _types.FieldMetadataType.DATE_TIME,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "tCbiO2",
                    message: "Started At"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "sYutYQ",
                    message: "Actual recording start"
                }),
                icon: 'IconCalendarClock',
                isNullable: true,
                isUIEditable: false
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        endedAt: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'endedAt',
                type: _types.FieldMetadataType.DATE_TIME,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "BECIbc",
                    message: "Ended At"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "4LperZ",
                    message: "Actual recording end"
                }),
                icon: 'IconCalendarClock',
                isNullable: true,
                isUIEditable: false
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        video: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'video',
                type: _types.FieldMetadataType.FILES,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "j8p0F8",
                    message: "Video"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "5PQwBy",
                    message: "Video recording"
                }),
                icon: 'IconVideo',
                isNullable: true,
                isUIEditable: false,
                settings: {
                    maxNumberOfValues: 1
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        audio: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'audio',
                type: _types.FieldMetadataType.FILES,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "0N8sVQ",
                    message: "Audio"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Nde4yb",
                    message: "Audio-only recording"
                }),
                icon: 'IconHeadphones',
                isNullable: true,
                isUIEditable: false,
                settings: {
                    maxNumberOfValues: 1
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        transcript: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'transcript',
                type: _types.FieldMetadataType.RAW_JSON,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "4nPpGt",
                    message: "Transcript"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "a78k8n",
                    message: "Normalized diarized transcript"
                }),
                icon: 'IconFileText',
                isNullable: true,
                isUIEditable: false
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        summary: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'summary',
                type: _types.FieldMetadataType.RICH_TEXT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "RUXdNM",
                    message: "Summary"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "JWCRoS",
                    message: "Recording summary"
                }),
                icon: 'IconFileText',
                isNullable: true,
                isUIEditable: false
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        calendarEvent: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.RELATION,
                morphId: null,
                fieldName: 'calendarEvent',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "hmqhWD",
                    message: "Calendar Event"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "sskdm3",
                    message: "Calendar Event"
                }),
                icon: 'IconCalendar',
                isNullable: true,
                isUIEditable: false,
                targetObjectName: 'calendarEvent',
                targetFieldName: 'callRecordings',
                settings: {
                    relationType: _types.RelationType.MANY_TO_ONE,
                    onDelete: _types.RelationOnDeleteAction.SET_NULL,
                    joinColumnName: 'calendarEventId'
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        createdBy: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'createdBy',
                type: _types.FieldMetadataType.ACTOR,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "V+Pnck",
                    message: "Created by"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "WhUgpA",
                    message: "The creator of the record"
                }),
                icon: 'IconCreativeCommonsSa',
                isSystem: true,
                isUIEditable: false,
                isNullable: false,
                defaultValue: {
                    source: "'MANUAL'",
                    name: "'System'",
                    workspaceMemberId: null
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        updatedBy: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'updatedBy',
                type: _types.FieldMetadataType.ACTOR,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "U8sfYC",
                    message: "Updated by"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "AiP86c",
                    message: "The workspace member who last updated the record"
                }),
                icon: 'IconUserCircle',
                isSystem: true,
                isUIEditable: false,
                isNullable: false,
                defaultValue: {
                    source: "'MANUAL'",
                    name: "'System'",
                    workspaceMemberId: null
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        position: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'position',
                type: _types.FieldMetadataType.POSITION,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "rLOFsu",
                    message: "Position"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "f9u4+O",
                    message: "Call recording record position"
                }),
                icon: 'IconHierarchy2',
                isSystem: true,
                isNullable: false,
                defaultValue: 0
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        searchVector: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'searchVector',
                type: _types.FieldMetadataType.TS_VECTOR,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Zuw7oP",
                    message: "Search vector"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "pcBMew",
                    message: "Field used for full-text search"
                }),
                icon: 'IconUser',
                isSystem: true,
                isNullable: true
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        })
    });

//# sourceMappingURL=compute-call-recording-standard-flat-field-metadata.util.js.map
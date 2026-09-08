"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildMessageCampaignStandardFlatFieldMetadatas", {
    enumerable: true,
    get: function() {
        return buildMessageCampaignStandardFlatFieldMetadatas;
    }
});
const _i18nlabelutil = require("../i18n-label.util");
const _types = require("twenty-shared/types");
const _createstandardfieldflatmetadatautil = require("./create-standard-field-flat-metadata.util");
const _createstandardrelationfieldflatmetadatautil = require("./create-standard-relation-field-flat-metadata.util");
const buildMessageCampaignStandardFlatFieldMetadatas = ({ now, objectName, workspaceId, standardObjectMetadataRelatedEntityIds, dependencyFlatEntityMaps, twentyStandardApplicationId })=>{
    const base = {
        standardObjectMetadataRelatedEntityIds,
        dependencyFlatEntityMaps,
        twentyStandardApplicationId,
        now,
        objectName,
        workspaceId
    };
    return {
        id: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            ...base,
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
            }
        }),
        createdAt: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            ...base,
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
            }
        }),
        updatedAt: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            ...base,
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
            }
        }),
        deletedAt: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            ...base,
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
            }
        }),
        createdBy: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            ...base,
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
            }
        }),
        updatedBy: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            ...base,
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
            }
        }),
        position: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            ...base,
            context: {
                fieldName: 'position',
                type: _types.FieldMetadataType.POSITION,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "rLOFsu",
                    message: "Position"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "kUdj5v",
                    message: "Email campaign record position"
                }),
                icon: 'IconHierarchy2',
                isSystem: true,
                isNullable: false,
                defaultValue: 0
            }
        }),
        searchVector: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            ...base,
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
                icon: 'IconSend',
                isSystem: true,
                isNullable: true
            }
        }),
        name: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            ...base,
            context: {
                fieldName: 'name',
                type: _types.FieldMetadataType.TEXT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "WFhVi3",
                    message: "Name"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "9vWP4H",
                    message: "Internal name of the campaign"
                }),
                icon: 'IconAbc',
                isNullable: false,
                defaultValue: "''"
            }
        }),
        subject: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            ...base,
            context: {
                fieldName: 'subject',
                type: _types.FieldMetadataType.TEXT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "hr1Spc",
                    message: "Subject"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "su92Mw",
                    message: "Email subject line"
                }),
                icon: 'IconMail',
                isNullable: true,
                isUIEditable: false
            }
        }),
        bodyTemplate: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            ...base,
            context: {
                fieldName: 'bodyTemplate',
                type: _types.FieldMetadataType.TEXT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "FVjxXL",
                    message: "Body"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "tPOpjI",
                    message: "Email body sent to recipients"
                }),
                icon: 'IconFileText',
                isNullable: true,
                isUIEditable: false
            }
        }),
        fromAddress: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            ...base,
            context: {
                fieldName: 'fromAddress',
                type: _types.FieldMetadataType.EMAILS,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "F4T0xg",
                    message: "From address"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "nzBQFi",
                    message: "Sender address for the campaign"
                }),
                icon: 'IconAt',
                isNullable: true,
                isUIEditable: false,
                settings: {
                    maxNumberOfValues: 1
                }
            }
        }),
        status: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            ...base,
            context: {
                fieldName: 'status',
                type: _types.FieldMetadataType.SELECT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "a1tUtz",
                    message: "Status"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "BeCo7/",
                    message: "Campaign lifecycle status"
                }),
                icon: 'IconProgress',
                isNullable: false,
                isUIEditable: false,
                defaultValue: "'DRAFT'",
                options: [
                    {
                        id: '2bebe786-69e0-4673-8781-a85588b77c44',
                        value: 'DRAFT',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "Hw0zHo",
                            message: "Draft"
                        }),
                        position: 0,
                        color: 'gray'
                    },
                    {
                        id: 'dba0c513-d1dc-4c6a-980a-40795bdb0759',
                        value: 'SCHEDULED',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "gqz/Jf",
                            message: "Scheduled"
                        }),
                        position: 1,
                        color: 'blue'
                    },
                    {
                        id: '575b9ed5-1123-480c-9821-c73410841347',
                        value: 'SENDING',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "ZYK68w",
                            message: "Sending"
                        }),
                        position: 2,
                        color: 'yellow'
                    },
                    {
                        id: '0c311eae-0892-4319-84e6-b30e921dc01a',
                        value: 'SENT',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "qo/IO1",
                            message: "Sent"
                        }),
                        position: 3,
                        color: 'green'
                    },
                    {
                        id: 'c309536c-ceb7-4510-8481-c2cbd88ffe96',
                        value: 'SENT_WITH_ERRORS',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "CMPgl1",
                            message: "Sent with errors"
                        }),
                        position: 4,
                        color: 'orange'
                    },
                    {
                        id: '3f0d9c41-6a52-4e88-9b74-5c2ad83f1e60',
                        value: 'CANCELED',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "JrNGiU",
                            message: "Canceled"
                        }),
                        position: 5,
                        color: 'red'
                    }
                ]
            }
        }),
        sentAt: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            ...base,
            context: {
                fieldName: 'sentAt',
                type: _types.FieldMetadataType.DATE_TIME,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "7Zqw3n",
                    message: "Sent at"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "ofdfh5",
                    message: "When the campaign finished sending"
                }),
                icon: 'IconSend',
                isNullable: true,
                isUIEditable: false,
                settings: {
                    displayFormat: _types.DateDisplayFormat.RELATIVE
                }
            }
        }),
        sentCount: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            ...base,
            context: {
                fieldName: 'sentCount',
                type: _types.FieldMetadataType.NUMBER,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "M8jvbm",
                    message: "Sent count"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Y/owFW",
                    message: "Number of emails sent"
                }),
                icon: 'IconMailFast',
                isNullable: false,
                isUIEditable: false,
                defaultValue: 0
            }
        }),
        deliveredCount: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            ...base,
            context: {
                fieldName: 'deliveredCount',
                type: _types.FieldMetadataType.NUMBER,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "bMSh++",
                    message: "Delivered count"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "xaKXLa",
                    message: "Number of emails confirmed delivered"
                }),
                icon: 'IconMailCheck',
                isNullable: false,
                isUIEditable: false,
                defaultValue: 0
            }
        }),
        failedCount: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            ...base,
            context: {
                fieldName: 'failedCount',
                type: _types.FieldMetadataType.NUMBER,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "JZUzbz",
                    message: "Failed count"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "rfTW6d",
                    message: "Number of emails that failed to send"
                }),
                icon: 'IconMailX',
                isNullable: false,
                isUIEditable: false,
                defaultValue: 0
            }
        }),
        bouncedCount: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            ...base,
            context: {
                fieldName: 'bouncedCount',
                type: _types.FieldMetadataType.NUMBER,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "MUk11c",
                    message: "Bounced count"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "unOidh",
                    message: "Number of emails that bounced"
                }),
                icon: 'IconMailOff',
                isNullable: false,
                isUIEditable: false,
                defaultValue: 0
            }
        }),
        complainedCount: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            ...base,
            context: {
                fieldName: 'complainedCount',
                type: _types.FieldMetadataType.NUMBER,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "UdSbpW",
                    message: "Complained count"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "bgG8mY",
                    message: "Number of spam complaints received"
                }),
                icon: 'IconMoodSad',
                isNullable: false,
                isUIEditable: false,
                defaultValue: 0
            }
        }),
        skippedCount: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            ...base,
            context: {
                fieldName: 'skippedCount',
                type: _types.FieldMetadataType.NUMBER,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "9KFM/B",
                    message: "Skipped count"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "JUyrVC",
                    message: "Number of recipients skipped without being emailed"
                }),
                icon: 'IconMailOff',
                isNullable: false,
                isUIEditable: false,
                defaultValue: 0
            }
        }),
        unsubscribeTopicId: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            ...base,
            context: {
                fieldName: 'unsubscribeTopicId',
                type: _types.FieldMetadataType.UUID,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "deE0XW",
                    message: "Unsubscribe topic id"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "J1prza",
                    message: "The unsubscribe topic this campaign was sent under"
                }),
                icon: 'IconMailbox',
                isNullable: true,
                isUIEditable: false
            }
        }),
        list: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            ...base,
            context: {
                type: _types.FieldMetadataType.RELATION,
                morphId: null,
                fieldName: 'list',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "++iNv7",
                    message: "List"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "MW8RsI",
                    message: "The list this campaign was sent to"
                }),
                icon: 'IconUsersGroup',
                isNullable: true,
                isUIEditable: false,
                targetObjectName: 'messageList',
                targetFieldName: 'campaigns',
                settings: {
                    relationType: _types.RelationType.MANY_TO_ONE,
                    onDelete: _types.RelationOnDeleteAction.SET_NULL,
                    joinColumnName: 'listId'
                }
            }
        }),
        timelineActivities: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            ...base,
            context: {
                type: _types.FieldMetadataType.RELATION,
                morphId: null,
                fieldName: 'timelineActivities',
                isSystemSideEffect: true,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "XuTq0a",
                    message: "Events"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "QghriB",
                    message: "Events linked to the campaign"
                }),
                icon: 'IconTimelineEvent',
                isNullable: true,
                targetObjectName: 'timelineActivity',
                targetFieldName: 'targetMessageCampaign',
                settings: {
                    relationType: _types.RelationType.ONE_TO_MANY
                }
            }
        }),
        messages: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            ...base,
            context: {
                type: _types.FieldMetadataType.RELATION,
                morphId: null,
                fieldName: 'messages',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "KocG+N",
                    message: "Messages"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "YPsYLa",
                    message: "Messages sent as part of this campaign"
                }),
                icon: 'IconMessage',
                isNullable: true,
                isUIEditable: false,
                targetObjectName: 'message',
                targetFieldName: 'messageCampaign',
                settings: {
                    relationType: _types.RelationType.ONE_TO_MANY
                }
            }
        }),
        recipients: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            ...base,
            context: {
                type: _types.FieldMetadataType.RELATION,
                morphId: null,
                fieldName: 'recipients',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "ND12UB",
                    message: "Recipients"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "IMF5Er",
                    message: "The people this campaign was sent to"
                }),
                icon: 'IconUsers',
                isNullable: true,
                isUIEditable: false,
                targetObjectName: 'messageParticipant',
                targetFieldName: 'messageCampaign',
                settings: {
                    relationType: _types.RelationType.ONE_TO_MANY
                }
            }
        })
    };
};

//# sourceMappingURL=compute-message-campaign-standard-flat-field-metadata.util.js.map
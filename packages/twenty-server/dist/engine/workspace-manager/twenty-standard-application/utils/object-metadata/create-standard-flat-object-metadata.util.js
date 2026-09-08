"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "STANDARD_FLAT_OBJECT_METADATA_BUILDERS_BY_OBJECT_NAME", {
    enumerable: true,
    get: function() {
        return STANDARD_FLAT_OBJECT_METADATA_BUILDERS_BY_OBJECT_NAME;
    }
});
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _i18nlabelutil = require("../i18n-label.util");
const _createstandardobjectflatmetadatautil = require("./create-standard-object-flat-metadata.util");
const STANDARD_FLAT_OBJECT_METADATA_BUILDERS_BY_OBJECT_NAME = {
    attachment: ({ now, workspaceId, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, dependencyFlatEntityMaps })=>(0, _createstandardobjectflatmetadatautil.createStandardObjectFlatMetadata)({
            objectName: 'attachment',
            dependencyFlatEntityMaps,
            context: {
                universalIdentifier: _metadata.STANDARD_OBJECTS.attachment.universalIdentifier,
                nameSingular: 'attachment',
                namePlural: 'attachments',
                labelSingular: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "b1LFyn",
                    message: "Attachment"
                }),
                labelPlural: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "mUQTd+",
                    message: "Attachments"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "VID94s",
                    message: "An attachment"
                }),
                icon: 'IconFileImport',
                isSystem: true,
                isUICreatable: false,
                labelIdentifierFieldMetadataName: 'name'
            },
            workspaceId,
            standardObjectMetadataRelatedEntityIds,
            twentyStandardApplicationId,
            now
        }),
    blocklist: ({ now, workspaceId, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, dependencyFlatEntityMaps })=>(0, _createstandardobjectflatmetadatautil.createStandardObjectFlatMetadata)({
            objectName: 'blocklist',
            dependencyFlatEntityMaps,
            context: {
                universalIdentifier: _metadata.STANDARD_OBJECTS.blocklist.universalIdentifier,
                nameSingular: 'blocklist',
                namePlural: 'blocklists',
                labelSingular: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "XVb/r9",
                    message: "Blocklist"
                }),
                labelPlural: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "4rVmMh",
                    message: "Blocklists"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "KCzMA6",
                    message: "Blocklist"
                }),
                icon: 'IconForbid2',
                isSystem: true,
                isUICreatable: false,
                labelIdentifierFieldMetadataName: 'handle'
            },
            workspaceId,
            standardObjectMetadataRelatedEntityIds,
            twentyStandardApplicationId,
            now
        }),
    calendarChannelEventAssociation: ({ now, workspaceId, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, dependencyFlatEntityMaps })=>(0, _createstandardobjectflatmetadatautil.createStandardObjectFlatMetadata)({
            objectName: 'calendarChannelEventAssociation',
            dependencyFlatEntityMaps,
            context: {
                universalIdentifier: _metadata.STANDARD_OBJECTS.calendarChannelEventAssociation.universalIdentifier,
                nameSingular: 'calendarChannelEventAssociation',
                namePlural: 'calendarChannelEventAssociations',
                labelSingular: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "sI3ixq",
                    message: "Calendar Channel Event Association"
                }),
                labelPlural: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "WlACUp",
                    message: "Calendar Channel Event Associations"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "HKfT9k",
                    message: "Calendar Channel Event Associations"
                }),
                icon: 'IconCalendar',
                isSystem: true,
                isAuditLogged: false,
                isUICreatable: false,
                labelIdentifierFieldMetadataName: 'id'
            },
            workspaceId,
            standardObjectMetadataRelatedEntityIds,
            twentyStandardApplicationId,
            now
        }),
    calendarEventParticipant: ({ now, workspaceId, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, dependencyFlatEntityMaps })=>(0, _createstandardobjectflatmetadatautil.createStandardObjectFlatMetadata)({
            objectName: 'calendarEventParticipant',
            dependencyFlatEntityMaps,
            context: {
                universalIdentifier: _metadata.STANDARD_OBJECTS.calendarEventParticipant.universalIdentifier,
                nameSingular: 'calendarEventParticipant',
                namePlural: 'calendarEventParticipants',
                labelSingular: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "/yKslt",
                    message: "Calendar event participant"
                }),
                labelPlural: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "J++KJc",
                    message: "Calendar event participants"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "SKKDwB",
                    message: "Calendar event participants"
                }),
                icon: 'IconCalendar',
                isSystem: true,
                isAuditLogged: false,
                isUICreatable: false,
                labelIdentifierFieldMetadataName: 'handle'
            },
            workspaceId,
            standardObjectMetadataRelatedEntityIds,
            twentyStandardApplicationId,
            now
        }),
    calendarEvent: ({ now, workspaceId, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, dependencyFlatEntityMaps })=>(0, _createstandardobjectflatmetadatautil.createStandardObjectFlatMetadata)({
            objectName: 'calendarEvent',
            dependencyFlatEntityMaps,
            context: {
                universalIdentifier: _metadata.STANDARD_OBJECTS.calendarEvent.universalIdentifier,
                nameSingular: 'calendarEvent',
                openRecordIn: _types.ObjectOpenRecordIn.SIDE_PANEL,
                namePlural: 'calendarEvents',
                labelSingular: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "8brwDQ",
                    message: "Calendar event"
                }),
                labelPlural: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "qyMa3j",
                    message: "Calendar events"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "KfFFWa",
                    message: "Calendar events"
                }),
                icon: 'IconCalendar',
                isSystem: true,
                isAuditLogged: false,
                isUICreatable: false,
                labelIdentifierFieldMetadataName: 'title'
            },
            workspaceId,
            standardObjectMetadataRelatedEntityIds,
            twentyStandardApplicationId,
            now
        }),
    calendarEventTarget: ({ now, workspaceId, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, dependencyFlatEntityMaps })=>(0, _createstandardobjectflatmetadatautil.createStandardObjectFlatMetadata)({
            objectName: 'calendarEventTarget',
            dependencyFlatEntityMaps,
            context: {
                universalIdentifier: _metadata.STANDARD_OBJECTS.calendarEventTarget.universalIdentifier,
                nameSingular: 'calendarEventTarget',
                namePlural: 'calendarEventTargets',
                labelSingular: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "o5eNjt",
                    message: "Calendar Event Target"
                }),
                labelPlural: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Ps7oA0",
                    message: "Calendar Event Targets"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "BdG91f",
                    message: "A calendar event target"
                }),
                icon: 'IconCalendar',
                isSystem: true,
                isAuditLogged: false,
                isUICreatable: false,
                labelIdentifierFieldMetadataName: 'id'
            },
            workspaceId,
            standardObjectMetadataRelatedEntityIds,
            twentyStandardApplicationId,
            now
        }),
    callRecording: ({ now, workspaceId, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, dependencyFlatEntityMaps })=>(0, _createstandardobjectflatmetadatautil.createStandardObjectFlatMetadata)({
            objectName: 'callRecording',
            dependencyFlatEntityMaps,
            context: {
                universalIdentifier: _metadata.STANDARD_OBJECTS.callRecording.universalIdentifier,
                nameSingular: 'callRecording',
                namePlural: 'callRecordings',
                labelSingular: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "WwTvrh",
                    message: "Call Recording"
                }),
                labelPlural: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "kkeNYX",
                    message: "Call Recordings"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "9BQITM",
                    message: "A recording of a meeting"
                }),
                icon: 'IconVideo',
                isSystem: true,
                isAuditLogged: false,
                isUICreatable: false,
                labelIdentifierFieldMetadataName: 'title'
            },
            workspaceId,
            standardObjectMetadataRelatedEntityIds,
            twentyStandardApplicationId,
            now
        }),
    company: ({ now, workspaceId, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, dependencyFlatEntityMaps })=>(0, _createstandardobjectflatmetadatautil.createStandardObjectFlatMetadata)({
            objectName: 'company',
            dependencyFlatEntityMaps,
            context: {
                universalIdentifier: _metadata.STANDARD_OBJECTS.company.universalIdentifier,
                nameSingular: 'company',
                namePlural: 'companies',
                labelSingular: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Jk7iDd",
                    message: "Company"
                }),
                labelPlural: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "UMn+XF",
                    message: "Companies"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "OaxxOp",
                    message: "A company"
                }),
                icon: 'IconBuildingSkyscraper',
                isSearchable: true,
                shortcut: 'C',
                duplicateCriteria: [
                    [
                        'name'
                    ],
                    [
                        'domainNamePrimaryLinkUrl'
                    ]
                ],
                labelIdentifierFieldMetadataName: 'name',
                imageIdentifierFieldMetadataName: 'domainName'
            },
            workspaceId,
            standardObjectMetadataRelatedEntityIds,
            twentyStandardApplicationId,
            now
        }),
    dashboard: ({ now, workspaceId, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, dependencyFlatEntityMaps })=>(0, _createstandardobjectflatmetadatautil.createStandardObjectFlatMetadata)({
            objectName: 'dashboard',
            dependencyFlatEntityMaps,
            context: {
                universalIdentifier: _metadata.STANDARD_OBJECTS.dashboard.universalIdentifier,
                nameSingular: 'dashboard',
                openRecordIn: _types.ObjectOpenRecordIn.RECORD_PAGE,
                namePlural: 'dashboards',
                labelSingular: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "ha71hz",
                    message: "Dashboard"
                }),
                labelPlural: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "SdwgrQ",
                    message: "Dashboards"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "TjN8GI",
                    message: "A dashboard"
                }),
                icon: 'IconLayoutDashboard',
                isSearchable: true,
                shortcut: 'D',
                labelIdentifierFieldMetadataName: 'title'
            },
            workspaceId,
            standardObjectMetadataRelatedEntityIds,
            twentyStandardApplicationId,
            now
        }),
    messageCampaign: ({ now, workspaceId, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, dependencyFlatEntityMaps })=>(0, _createstandardobjectflatmetadatautil.createStandardObjectFlatMetadata)({
            objectName: 'messageCampaign',
            dependencyFlatEntityMaps,
            context: {
                universalIdentifier: _metadata.STANDARD_OBJECTS.messageCampaign.universalIdentifier,
                nameSingular: 'messageCampaign',
                openRecordIn: _types.ObjectOpenRecordIn.RECORD_PAGE,
                namePlural: 'messageCampaigns',
                labelSingular: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "CLcjHT",
                    message: "Campaign"
                }),
                labelPlural: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "3KT/1G",
                    message: "Campaigns"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "RsTRse",
                    message: "A bulk email send to an audience, with delivery stats"
                }),
                icon: 'IconSend',
                isSystem: true,
                isSearchable: true,
                isUICreatable: false,
                labelIdentifierFieldMetadataName: 'name'
            },
            workspaceId,
            standardObjectMetadataRelatedEntityIds,
            twentyStandardApplicationId,
            now
        }),
    messageList: ({ now, workspaceId, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, dependencyFlatEntityMaps })=>(0, _createstandardobjectflatmetadatautil.createStandardObjectFlatMetadata)({
            objectName: 'messageList',
            dependencyFlatEntityMaps,
            context: {
                universalIdentifier: _metadata.STANDARD_OBJECTS.messageList.universalIdentifier,
                nameSingular: 'messageList',
                namePlural: 'messageLists',
                labelSingular: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "7xBvLT",
                    message: "List"
                }),
                labelPlural: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "1SgH8v",
                    message: "Lists"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "AzzING",
                    message: "A hand-picked audience of people"
                }),
                icon: 'IconUsersGroup',
                isSystem: true,
                isSearchable: true,
                labelIdentifierFieldMetadataName: 'name'
            },
            workspaceId,
            standardObjectMetadataRelatedEntityIds,
            twentyStandardApplicationId,
            now
        }),
    messageListMember: ({ now, workspaceId, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, dependencyFlatEntityMaps })=>(0, _createstandardobjectflatmetadatautil.createStandardObjectFlatMetadata)({
            objectName: 'messageListMember',
            dependencyFlatEntityMaps,
            context: {
                universalIdentifier: _metadata.STANDARD_OBJECTS.messageListMember.universalIdentifier,
                nameSingular: 'messageListMember',
                namePlural: 'messageListMembers',
                labelSingular: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "i/ifeM",
                    message: "List Member"
                }),
                labelPlural: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "TJGiwQ",
                    message: "List Members"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "6EBM2x",
                    message: "A person's membership in a list"
                }),
                icon: 'IconUser',
                isSystem: true,
                labelIdentifierFieldMetadataName: 'id'
            },
            workspaceId,
            standardObjectMetadataRelatedEntityIds,
            twentyStandardApplicationId,
            now
        }),
    messageChannelMessageAssociation: ({ now, workspaceId, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, dependencyFlatEntityMaps })=>(0, _createstandardobjectflatmetadatautil.createStandardObjectFlatMetadata)({
            objectName: 'messageChannelMessageAssociation',
            dependencyFlatEntityMaps,
            context: {
                universalIdentifier: _metadata.STANDARD_OBJECTS.messageChannelMessageAssociation.universalIdentifier,
                nameSingular: 'messageChannelMessageAssociation',
                namePlural: 'messageChannelMessageAssociations',
                labelSingular: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "xFQ9H7",
                    message: "Message Channel Message Association"
                }),
                labelPlural: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "TxgEcG",
                    message: "Message Channel Message Associations"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "IyZnrr",
                    message: "Message Synced with a Message Channel"
                }),
                icon: 'IconMessage',
                isSystem: true,
                isAuditLogged: false,
                isUICreatable: false,
                labelIdentifierFieldMetadataName: 'id'
            },
            workspaceId,
            standardObjectMetadataRelatedEntityIds,
            twentyStandardApplicationId,
            now
        }),
    messageChannelMessageAssociationMessageFolder: ({ now, workspaceId, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, dependencyFlatEntityMaps })=>(0, _createstandardobjectflatmetadatautil.createStandardObjectFlatMetadata)({
            objectName: 'messageChannelMessageAssociationMessageFolder',
            dependencyFlatEntityMaps,
            context: {
                universalIdentifier: _metadata.STANDARD_OBJECTS.messageChannelMessageAssociationMessageFolder.universalIdentifier,
                nameSingular: 'messageChannelMessageAssociationMessageFolder',
                namePlural: 'messageChannelMessageAssociationMessageFolders',
                labelSingular: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "iXSQGo",
                    message: "Message Channel Message Association Message Folder"
                }),
                labelPlural: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "L7/nko",
                    message: "Message Channel Message Association Message Folders"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "qKYG4b",
                    message: "Join table linking message channel message associations to message folders"
                }),
                icon: 'IconFolder',
                isSystem: true,
                isAuditLogged: false,
                isUICreatable: false,
                labelIdentifierFieldMetadataName: 'id'
            },
            workspaceId,
            standardObjectMetadataRelatedEntityIds,
            twentyStandardApplicationId,
            now
        }),
    messageParticipant: ({ now, workspaceId, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, dependencyFlatEntityMaps })=>(0, _createstandardobjectflatmetadatautil.createStandardObjectFlatMetadata)({
            objectName: 'messageParticipant',
            dependencyFlatEntityMaps,
            context: {
                universalIdentifier: _metadata.STANDARD_OBJECTS.messageParticipant.universalIdentifier,
                nameSingular: 'messageParticipant',
                namePlural: 'messageParticipants',
                labelSingular: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "qfdnRM",
                    message: "Message Participant"
                }),
                labelPlural: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "OY58EQ",
                    message: "Message Participants"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "eMh4C2",
                    message: "Message Participants"
                }),
                icon: 'IconUserCircle',
                isSystem: true,
                isAuditLogged: false,
                isUICreatable: false,
                labelIdentifierFieldMetadataName: 'handle'
            },
            workspaceId,
            standardObjectMetadataRelatedEntityIds,
            twentyStandardApplicationId,
            now
        }),
    messageThread: ({ now, workspaceId, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, dependencyFlatEntityMaps })=>(0, _createstandardobjectflatmetadatautil.createStandardObjectFlatMetadata)({
            objectName: 'messageThread',
            dependencyFlatEntityMaps,
            context: {
                universalIdentifier: _metadata.STANDARD_OBJECTS.messageThread.universalIdentifier,
                nameSingular: 'messageThread',
                namePlural: 'messageThreads',
                labelSingular: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "9JKJzc",
                    message: "Message Thread"
                }),
                labelPlural: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "icQX0H",
                    message: "Message Threads"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "MLNdvD",
                    message: "Message Thread"
                }),
                icon: 'IconMessage',
                isSystem: true,
                isAuditLogged: false,
                isUICreatable: false,
                labelIdentifierFieldMetadataName: 'subject'
            },
            workspaceId,
            standardObjectMetadataRelatedEntityIds,
            twentyStandardApplicationId,
            now
        }),
    messageThreadTarget: ({ now, workspaceId, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, dependencyFlatEntityMaps })=>(0, _createstandardobjectflatmetadatautil.createStandardObjectFlatMetadata)({
            objectName: 'messageThreadTarget',
            dependencyFlatEntityMaps,
            context: {
                universalIdentifier: _metadata.STANDARD_OBJECTS.messageThreadTarget.universalIdentifier,
                nameSingular: 'messageThreadTarget',
                namePlural: 'messageThreadTargets',
                labelSingular: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "frnvp/",
                    message: "Message Thread Target"
                }),
                labelPlural: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "q03DOY",
                    message: "Message Thread Targets"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "gnMqGV",
                    message: "A message thread target"
                }),
                icon: 'IconMessage',
                isSystem: true,
                isAuditLogged: false,
                isUICreatable: false,
                labelIdentifierFieldMetadataName: 'id'
            },
            workspaceId,
            standardObjectMetadataRelatedEntityIds,
            twentyStandardApplicationId,
            now
        }),
    message: ({ now, workspaceId, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, dependencyFlatEntityMaps })=>(0, _createstandardobjectflatmetadatautil.createStandardObjectFlatMetadata)({
            objectName: 'message',
            dependencyFlatEntityMaps,
            context: {
                universalIdentifier: _metadata.STANDARD_OBJECTS.message.universalIdentifier,
                nameSingular: 'message',
                namePlural: 'messages',
                labelSingular: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "cOI7+n",
                    message: "Message"
                }),
                labelPlural: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "I+2uUa",
                    message: "Messages"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "EmFJ+H",
                    message: "Message"
                }),
                icon: 'IconMessage',
                isSystem: true,
                isAuditLogged: false,
                isUICreatable: false,
                labelIdentifierFieldMetadataName: 'subject'
            },
            workspaceId,
            standardObjectMetadataRelatedEntityIds,
            twentyStandardApplicationId,
            now
        }),
    note: ({ now, workspaceId, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, dependencyFlatEntityMaps })=>(0, _createstandardobjectflatmetadatautil.createStandardObjectFlatMetadata)({
            objectName: 'note',
            dependencyFlatEntityMaps,
            context: {
                universalIdentifier: _metadata.STANDARD_OBJECTS.note.universalIdentifier,
                nameSingular: 'note',
                namePlural: 'notes',
                labelSingular: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "wkRCkw",
                    message: "Note"
                }),
                labelPlural: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "uYdN1N",
                    message: "Notes"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "B6P+4g",
                    message: "A note"
                }),
                icon: 'IconNotes',
                isSearchable: true,
                shortcut: 'N',
                labelIdentifierFieldMetadataName: 'title'
            },
            workspaceId,
            standardObjectMetadataRelatedEntityIds,
            twentyStandardApplicationId,
            now
        }),
    noteTarget: ({ now, workspaceId, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, dependencyFlatEntityMaps })=>(0, _createstandardobjectflatmetadatautil.createStandardObjectFlatMetadata)({
            objectName: 'noteTarget',
            dependencyFlatEntityMaps,
            context: {
                universalIdentifier: _metadata.STANDARD_OBJECTS.noteTarget.universalIdentifier,
                nameSingular: 'noteTarget',
                namePlural: 'noteTargets',
                labelSingular: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "mFjkYL",
                    message: "Note Target"
                }),
                labelPlural: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "OkXmyu",
                    message: "Note Targets"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "ZtpeIz",
                    message: "A note target"
                }),
                icon: 'IconCheckbox',
                isSystem: true,
                isUICreatable: false,
                labelIdentifierFieldMetadataName: 'id'
            },
            workspaceId,
            standardObjectMetadataRelatedEntityIds,
            twentyStandardApplicationId,
            now
        }),
    opportunity: ({ now, workspaceId, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, dependencyFlatEntityMaps })=>(0, _createstandardobjectflatmetadatautil.createStandardObjectFlatMetadata)({
            objectName: 'opportunity',
            dependencyFlatEntityMaps,
            context: {
                universalIdentifier: _metadata.STANDARD_OBJECTS.opportunity.universalIdentifier,
                nameSingular: 'opportunity',
                namePlural: 'opportunities',
                labelSingular: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "98euLh",
                    message: "Opportunity"
                }),
                labelPlural: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "aflzUo",
                    message: "Opportunities"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "xAF1N9",
                    message: "An opportunity"
                }),
                icon: 'IconTargetArrow',
                isSearchable: true,
                shortcut: 'O',
                labelIdentifierFieldMetadataName: 'name'
            },
            workspaceId,
            standardObjectMetadataRelatedEntityIds,
            twentyStandardApplicationId,
            now
        }),
    person: ({ now, workspaceId, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, dependencyFlatEntityMaps })=>(0, _createstandardobjectflatmetadatautil.createStandardObjectFlatMetadata)({
            objectName: 'person',
            dependencyFlatEntityMaps,
            context: {
                universalIdentifier: _metadata.STANDARD_OBJECTS.person.universalIdentifier,
                nameSingular: 'person',
                namePlural: 'people',
                labelSingular: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "n+OC6R",
                    message: "Person"
                }),
                labelPlural: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "CJTgMk",
                    message: "People"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "K1qNjB",
                    message: "A person"
                }),
                icon: 'IconUser',
                isSearchable: true,
                shortcut: 'P',
                duplicateCriteria: [
                    [
                        'nameFirstName',
                        'nameLastName'
                    ],
                    [
                        'linkedinLinkPrimaryLinkUrl'
                    ],
                    [
                        'emailsPrimaryEmail'
                    ]
                ],
                labelIdentifierFieldMetadataName: 'name',
                imageIdentifierFieldMetadataName: 'avatarFile'
            },
            workspaceId,
            standardObjectMetadataRelatedEntityIds,
            twentyStandardApplicationId,
            now
        }),
    task: ({ now, workspaceId, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, dependencyFlatEntityMaps })=>(0, _createstandardobjectflatmetadatautil.createStandardObjectFlatMetadata)({
            objectName: 'task',
            dependencyFlatEntityMaps,
            context: {
                universalIdentifier: _metadata.STANDARD_OBJECTS.task.universalIdentifier,
                nameSingular: 'task',
                namePlural: 'tasks',
                labelSingular: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "+KxhfJ",
                    message: "Task"
                }),
                labelPlural: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "1MBLO9",
                    message: "Tasks"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "VzpL85",
                    message: "A task"
                }),
                icon: 'IconCheckbox',
                isSearchable: true,
                shortcut: 'T',
                labelIdentifierFieldMetadataName: 'title'
            },
            workspaceId,
            standardObjectMetadataRelatedEntityIds,
            twentyStandardApplicationId,
            now
        }),
    taskTarget: ({ now, workspaceId, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, dependencyFlatEntityMaps })=>(0, _createstandardobjectflatmetadatautil.createStandardObjectFlatMetadata)({
            objectName: 'taskTarget',
            dependencyFlatEntityMaps,
            context: {
                universalIdentifier: _metadata.STANDARD_OBJECTS.taskTarget.universalIdentifier,
                nameSingular: 'taskTarget',
                namePlural: 'taskTargets',
                labelSingular: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "nuFzWZ",
                    message: "Task Target"
                }),
                labelPlural: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "W5E1kS",
                    message: "Task Targets"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "OFAI1i",
                    message: "A task target"
                }),
                icon: 'IconCheckbox',
                isSystem: true,
                isUICreatable: false,
                labelIdentifierFieldMetadataName: 'id'
            },
            workspaceId,
            standardObjectMetadataRelatedEntityIds,
            twentyStandardApplicationId,
            now
        }),
    timelineActivity: ({ now, workspaceId, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, dependencyFlatEntityMaps })=>(0, _createstandardobjectflatmetadatautil.createStandardObjectFlatMetadata)({
            objectName: 'timelineActivity',
            dependencyFlatEntityMaps,
            context: {
                universalIdentifier: _metadata.STANDARD_OBJECTS.timelineActivity.universalIdentifier,
                nameSingular: 'timelineActivity',
                namePlural: 'timelineActivities',
                labelSingular: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "ApXfXx",
                    message: "Timeline Activity"
                }),
                labelPlural: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "qH6+tl",
                    message: "Timeline Activities"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "bKb5Ip",
                    message: "Aggregated / filtered event to be displayed on the timeline"
                }),
                icon: 'IconTimelineEvent',
                isSystem: true,
                isAuditLogged: false,
                isUICreatable: false,
                labelIdentifierFieldMetadataName: 'linkedRecordCachedName'
            },
            workspaceId,
            standardObjectMetadataRelatedEntityIds,
            twentyStandardApplicationId,
            now
        }),
    workflow: ({ now, workspaceId, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, dependencyFlatEntityMaps })=>(0, _createstandardobjectflatmetadatautil.createStandardObjectFlatMetadata)({
            objectName: 'workflow',
            dependencyFlatEntityMaps,
            context: {
                universalIdentifier: _metadata.STANDARD_OBJECTS.workflow.universalIdentifier,
                nameSingular: 'workflow',
                openRecordIn: _types.ObjectOpenRecordIn.RECORD_PAGE,
                namePlural: 'workflows',
                labelSingular: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Ybs2Ml",
                    message: "Workflow"
                }),
                labelPlural: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "O0tztx",
                    message: "Workflows"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "3VQj1J",
                    message: "A workflow"
                }),
                icon: 'IconSettingsAutomation',
                isSearchable: true,
                shortcut: 'W',
                labelIdentifierFieldMetadataName: 'name'
            },
            workspaceId,
            standardObjectMetadataRelatedEntityIds,
            twentyStandardApplicationId,
            now
        }),
    workflowAutomatedTrigger: ({ now, workspaceId, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, dependencyFlatEntityMaps })=>(0, _createstandardobjectflatmetadatautil.createStandardObjectFlatMetadata)({
            objectName: 'workflowAutomatedTrigger',
            dependencyFlatEntityMaps,
            context: {
                universalIdentifier: _metadata.STANDARD_OBJECTS.workflowAutomatedTrigger.universalIdentifier,
                nameSingular: 'workflowAutomatedTrigger',
                namePlural: 'workflowAutomatedTriggers',
                labelSingular: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "BwauV3",
                    message: "Workflow Automated Trigger"
                }),
                labelPlural: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "aANbrX",
                    message: "Workflow Automated Triggers"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "ePMKG3",
                    message: "A workflow automated trigger"
                }),
                icon: 'IconSettingsAutomation',
                isSystem: true,
                isUICreatable: false,
                labelIdentifierFieldMetadataName: 'id'
            },
            workspaceId,
            standardObjectMetadataRelatedEntityIds,
            twentyStandardApplicationId,
            now
        }),
    workflowRun: ({ now, workspaceId, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, dependencyFlatEntityMaps })=>(0, _createstandardobjectflatmetadatautil.createStandardObjectFlatMetadata)({
            objectName: 'workflowRun',
            dependencyFlatEntityMaps,
            context: {
                universalIdentifier: _metadata.STANDARD_OBJECTS.workflowRun.universalIdentifier,
                nameSingular: 'workflowRun',
                namePlural: 'workflowRuns',
                labelSingular: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "hqdwCt",
                    message: "Workflow Run"
                }),
                labelPlural: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Tinlvs",
                    message: "Workflow Runs"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "bQaMUu",
                    message: "A workflow run"
                }),
                icon: 'IconHistoryToggle',
                isSystem: true,
                isAuditLogged: false,
                isUICreatable: false,
                labelIdentifierFieldMetadataName: 'name'
            },
            workspaceId,
            standardObjectMetadataRelatedEntityIds,
            twentyStandardApplicationId,
            now
        }),
    workflowVersion: ({ now, workspaceId, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, dependencyFlatEntityMaps })=>(0, _createstandardobjectflatmetadatautil.createStandardObjectFlatMetadata)({
            objectName: 'workflowVersion',
            dependencyFlatEntityMaps,
            context: {
                universalIdentifier: _metadata.STANDARD_OBJECTS.workflowVersion.universalIdentifier,
                nameSingular: 'workflowVersion',
                openRecordIn: _types.ObjectOpenRecordIn.RECORD_PAGE,
                namePlural: 'workflowVersions',
                labelSingular: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "0w608/",
                    message: "Workflow Version"
                }),
                labelPlural: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "lrTHGl",
                    message: "Workflow Versions"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "W6HvkH",
                    message: "A workflow version"
                }),
                icon: 'IconVersions',
                isSystem: true,
                isUICreatable: false,
                labelIdentifierFieldMetadataName: 'name'
            },
            workspaceId,
            standardObjectMetadataRelatedEntityIds,
            twentyStandardApplicationId,
            now
        }),
    workspaceMember: ({ now, workspaceId, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, dependencyFlatEntityMaps })=>(0, _createstandardobjectflatmetadatautil.createStandardObjectFlatMetadata)({
            objectName: 'workspaceMember',
            dependencyFlatEntityMaps,
            context: {
                universalIdentifier: _metadata.STANDARD_OBJECTS.workspaceMember.universalIdentifier,
                nameSingular: 'workspaceMember',
                namePlural: 'workspaceMembers',
                labelSingular: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "j3uenD",
                    message: "Workspace Member"
                }),
                labelPlural: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "scar7N",
                    message: "Workspace Members"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "sDZaHF",
                    message: "A workspace member"
                }),
                icon: 'IconUserCircle',
                isSystem: true,
                isSearchable: true,
                isUICreatable: false,
                labelIdentifierFieldMetadataName: 'name',
                imageIdentifierFieldMetadataName: 'avatarUrl'
            },
            workspaceId,
            standardObjectMetadataRelatedEntityIds,
            twentyStandardApplicationId,
            now
        })
};

//# sourceMappingURL=create-standard-flat-object-metadata.util.js.map
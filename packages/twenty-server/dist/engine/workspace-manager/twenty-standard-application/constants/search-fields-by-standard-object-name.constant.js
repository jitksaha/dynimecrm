"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SEARCH_FIELDS_BY_STANDARD_OBJECT_NAME", {
    enumerable: true,
    get: function() {
        return SEARCH_FIELDS_BY_STANDARD_OBJECT_NAME;
    }
});
const _types = require("twenty-shared/types");
const SEARCH_FIELDS_BY_STANDARD_OBJECT_NAME = {
    attachment: [
        {
            name: 'name',
            type: _types.FieldMetadataType.TEXT
        }
    ],
    blocklist: [
        {
            name: 'handle',
            type: _types.FieldMetadataType.TEXT
        }
    ],
    calendarChannelEventAssociation: [
        {
            name: 'eventExternalId',
            type: _types.FieldMetadataType.TEXT
        }
    ],
    calendarEvent: [
        {
            name: 'title',
            type: _types.FieldMetadataType.TEXT
        }
    ],
    calendarEventTarget: [
        {
            name: 'id',
            type: _types.FieldMetadataType.UUID
        }
    ],
    calendarEventParticipant: [
        {
            name: 'handle',
            type: _types.FieldMetadataType.TEXT
        }
    ],
    callRecording: [
        {
            name: 'title',
            type: _types.FieldMetadataType.TEXT
        }
    ],
    company: [
        {
            name: 'name',
            type: _types.FieldMetadataType.TEXT
        },
        {
            name: 'domainName',
            type: _types.FieldMetadataType.LINKS
        }
    ],
    dashboard: [
        {
            name: 'title',
            type: _types.FieldMetadataType.TEXT
        }
    ],
    message: [
        {
            name: 'subject',
            type: _types.FieldMetadataType.TEXT
        }
    ],
    messageCampaign: [
        {
            name: 'name',
            type: _types.FieldMetadataType.TEXT
        },
        {
            name: 'subject',
            type: _types.FieldMetadataType.TEXT
        }
    ],
    messageChannelMessageAssociation: [
        {
            name: 'messageExternalId',
            type: _types.FieldMetadataType.TEXT
        }
    ],
    messageChannelMessageAssociationMessageFolder: [],
    messageList: [
        {
            name: 'name',
            type: _types.FieldMetadataType.TEXT
        }
    ],
    messageListMember: [
        {
            name: 'id',
            type: _types.FieldMetadataType.UUID
        }
    ],
    messageParticipant: [
        {
            name: 'handle',
            type: _types.FieldMetadataType.TEXT
        }
    ],
    messageThread: [
        {
            name: 'subject',
            type: _types.FieldMetadataType.TEXT
        }
    ],
    messageThreadTarget: [
        {
            name: 'id',
            type: _types.FieldMetadataType.UUID
        }
    ],
    note: [
        {
            name: 'title',
            type: _types.FieldMetadataType.TEXT
        },
        {
            name: 'bodyV2',
            type: _types.FieldMetadataType.RICH_TEXT
        }
    ],
    noteTarget: [
        {
            name: 'id',
            type: _types.FieldMetadataType.UUID
        }
    ],
    opportunity: [
        {
            name: 'name',
            type: _types.FieldMetadataType.TEXT
        }
    ],
    person: [
        {
            name: 'name',
            type: _types.FieldMetadataType.FULL_NAME
        },
        {
            name: 'emails',
            type: _types.FieldMetadataType.EMAILS
        },
        {
            name: 'phones',
            type: _types.FieldMetadataType.PHONES
        },
        {
            name: 'jobTitle',
            type: _types.FieldMetadataType.TEXT
        }
    ],
    task: [
        {
            name: 'title',
            type: _types.FieldMetadataType.TEXT
        },
        {
            name: 'bodyV2',
            type: _types.FieldMetadataType.RICH_TEXT
        }
    ],
    taskTarget: [
        {
            name: 'id',
            type: _types.FieldMetadataType.UUID
        }
    ],
    timelineActivity: [
        {
            name: 'linkedRecordCachedName',
            type: _types.FieldMetadataType.TEXT
        }
    ],
    workflow: [
        {
            name: 'name',
            type: _types.FieldMetadataType.TEXT
        }
    ],
    workflowAutomatedTrigger: [
        {
            name: 'id',
            type: _types.FieldMetadataType.UUID
        }
    ],
    workflowRun: [
        {
            name: 'name',
            type: _types.FieldMetadataType.TEXT
        }
    ],
    workflowVersion: [
        {
            name: 'name',
            type: _types.FieldMetadataType.TEXT
        }
    ],
    workspaceMember: [
        {
            name: 'name',
            type: _types.FieldMetadataType.FULL_NAME
        },
        {
            name: 'userEmail',
            type: _types.FieldMetadataType.TEXT
        }
    ]
};

//# sourceMappingURL=search-fields-by-standard-object-name.constant.js.map
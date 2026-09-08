"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildPersonStandardFlatFieldMetadatas", {
    enumerable: true,
    get: function() {
        return buildPersonStandardFlatFieldMetadatas;
    }
});
const _metadata = require("twenty-shared/metadata");
const _i18nlabelutil = require("../i18n-label.util");
const _types = require("twenty-shared/types");
const _standardrelationfieldpropertiesconstant = require("../../../../metadata-modules/object-metadata/constants/standard-relation-field-properties.constant");
const _createstandardfieldflatmetadatautil = require("./create-standard-field-flat-metadata.util");
const _createstandardrelationfieldflatmetadatautil = require("./create-standard-relation-field-flat-metadata.util");
const buildPersonStandardFlatFieldMetadatas = ({ now, objectName, workspaceId, standardObjectMetadataRelatedEntityIds, dependencyFlatEntityMaps, twentyStandardApplicationId })=>({
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
        name: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'name',
                type: _types.FieldMetadataType.FULL_NAME,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "WFhVi3",
                    message: "Name"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "1F/w2I",
                    message: "Contact's name"
                }),
                icon: 'IconUser',
                isNullable: true
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        emails: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'emails',
                type: _types.FieldMetadataType.EMAILS,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "nWIjgD",
                    message: "Emails"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "SKkz1Y",
                    message: "Contact's Emails"
                }),
                icon: 'IconMail',
                isNullable: true,
                isUnique: true,
                settings: {
                    maxNumberOfValues: 1
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        linkedinLink: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'linkedinLink',
                type: _types.FieldMetadataType.LINKS,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "z+srLp",
                    message: "Linkedin"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "RS0wew",
                    message: "Contact's Linkedin account"
                }),
                icon: 'IconBrandLinkedin',
                isNullable: true
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        jobTitle: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'jobTitle',
                type: _types.FieldMetadataType.TEXT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Xg3NMP",
                    message: "Job Title"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "eX6v+/",
                    message: "Contact's job title"
                }),
                icon: 'IconBriefcase',
                isNullable: true
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        phones: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'phones',
                type: _types.FieldMetadataType.PHONES,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "JrteyL",
                    message: "Phones"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "aNDPqw",
                    message: "Contact's phone numbers"
                }),
                icon: 'IconPhone',
                isNullable: true,
                settings: {
                    maxNumberOfValues: 1
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        //deprecated
        avatarUrl: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'avatarUrl',
                type: _types.FieldMetadataType.TEXT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "bhFnpx",
                    message: "Avatar"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "WXjfKi",
                    message: "Contact's avatar"
                }),
                icon: 'IconFileUpload',
                isSystem: true,
                isNullable: true
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        avatarFile: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'avatarFile',
                type: _types.FieldMetadataType.FILES,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "KEsv0p",
                    message: "Avatar File"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "bJZ2Tj",
                    message: "Contact's avatar file"
                }),
                icon: 'IconFileUpload',
                isSystem: true,
                isNullable: true,
                settings: {
                    maxNumberOfValues: 1
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
                    id: "qAQDfe",
                    message: "Person record Position"
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
        company: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.RELATION,
                morphId: null,
                fieldName: 'company',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "aNUhqB",
                    message: "Company"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Pjih6W",
                    message: "Contact's company"
                }),
                icon: 'IconBuildingSkyscraper',
                isNullable: true,
                targetObjectName: 'company',
                targetFieldName: 'people',
                settings: {
                    relationType: _types.RelationType.MANY_TO_ONE,
                    onDelete: _types.RelationOnDeleteAction.SET_NULL,
                    joinColumnName: 'companyId'
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        pointOfContactForOpportunities: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.RELATION,
                morphId: null,
                fieldName: 'pointOfContactForOpportunities',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "LXazcQ",
                    message: "Opportunities"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "GRxWmN",
                    message: "List of opportunities for which that person is the point of contact"
                }),
                icon: 'IconTargetArrow',
                isNullable: true,
                targetObjectName: 'opportunity',
                targetFieldName: 'pointOfContact',
                settings: {
                    relationType: _types.RelationType.ONE_TO_MANY
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        taskTargets: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.RELATION,
                morphId: null,
                fieldName: 'taskTargets',
                isSystemSideEffect: true,
                label: (0, _i18nlabelutil.i18nLabel)(_standardrelationfieldpropertiesconstant.STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.taskTarget.label),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "lPd6aN",
                    message: "Tasks tied to the contact"
                }),
                icon: _standardrelationfieldpropertiesconstant.STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.taskTarget.icon,
                isNullable: true,
                targetObjectName: 'taskTarget',
                targetFieldName: 'targetPerson',
                settings: {
                    relationType: _types.RelationType.ONE_TO_MANY
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        noteTargets: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.RELATION,
                morphId: null,
                fieldName: 'noteTargets',
                isSystemSideEffect: true,
                label: (0, _i18nlabelutil.i18nLabel)(_standardrelationfieldpropertiesconstant.STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.noteTarget.label),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "te+g0b",
                    message: "Notes tied to the contact"
                }),
                icon: _standardrelationfieldpropertiesconstant.STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.noteTarget.icon,
                isNullable: true,
                targetObjectName: 'noteTarget',
                targetFieldName: 'targetPerson',
                settings: {
                    relationType: _types.RelationType.ONE_TO_MANY
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        calendarEventTargets: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.RELATION,
                morphId: null,
                fieldName: 'calendarEventTargets',
                isSystemSideEffect: true,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "r20w41",
                    message: "Calendar events"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "E4Wz06",
                    message: "Calendar events tied to the contact"
                }),
                icon: 'IconCalendar',
                isUIEditable: false,
                isNullable: true,
                targetObjectName: 'calendarEventTarget',
                targetFieldName: 'targetPerson',
                settings: {
                    relationType: _types.RelationType.ONE_TO_MANY
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        messageThreadTargets: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.RELATION,
                morphId: null,
                fieldName: 'messageThreadTargets',
                isSystemSideEffect: true,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "nWIjgD",
                    message: "Emails"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "WGjTJT",
                    message: "Message threads tied to the contact"
                }),
                icon: 'IconMail',
                isUIEditable: false,
                isNullable: true,
                targetObjectName: 'messageThreadTarget',
                targetFieldName: 'targetPerson',
                settings: {
                    relationType: _types.RelationType.ONE_TO_MANY
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        attachments: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.RELATION,
                morphId: null,
                fieldName: 'attachments',
                isSystemSideEffect: true,
                label: (0, _i18nlabelutil.i18nLabel)(_standardrelationfieldpropertiesconstant.STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.attachment.label),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Z5N7sB",
                    message: "Attachments linked to the contact."
                }),
                icon: _standardrelationfieldpropertiesconstant.STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.attachment.icon,
                isNullable: true,
                targetObjectName: 'attachment',
                targetFieldName: 'targetPerson',
                settings: {
                    relationType: _types.RelationType.ONE_TO_MANY
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        messageParticipants: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.RELATION,
                morphId: null,
                fieldName: 'messageParticipants',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "OVVthS",
                    message: "Message Participants"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "yzSIu/",
                    message: "Message Participants"
                }),
                icon: 'IconUserCircle',
                isNullable: true,
                targetObjectName: 'messageParticipant',
                targetFieldName: 'person',
                settings: {
                    relationType: _types.RelationType.ONE_TO_MANY
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        calendarEventParticipants: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.RELATION,
                morphId: null,
                fieldName: 'calendarEventParticipants',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "50uIQG",
                    message: "Calendar Event Participants"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "4H8X9C",
                    message: "Calendar Event Participants"
                }),
                icon: 'IconCalendar',
                isNullable: true,
                targetObjectName: 'calendarEventParticipant',
                targetFieldName: 'person',
                settings: {
                    relationType: _types.RelationType.ONE_TO_MANY
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        timelineActivities: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
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
                    id: "0EMDOm",
                    message: "Events linked to the person"
                }),
                icon: 'IconTimelineEvent',
                isNullable: true,
                targetObjectName: 'timelineActivity',
                targetFieldName: 'targetPerson',
                settings: {
                    relationType: _types.RelationType.ONE_TO_MANY
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        listMemberships: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.RELATION,
                morphId: null,
                fieldName: 'listMemberships',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "R6I0Oa",
                    message: "Lists"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Ib2gge",
                    message: "Lists the contact belongs to"
                }),
                icon: 'IconUsersGroup',
                isUIEditable: true,
                isNullable: true,
                targetObjectName: 'messageListMember',
                targetFieldName: 'person',
                settings: {
                    relationType: _types.RelationType.ONE_TO_MANY
                },
                junctionTargetFieldUniversalIdentifier: _metadata.STANDARD_OBJECTS.messageListMember.fields.list.universalIdentifier
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

//# sourceMappingURL=compute-person-standard-flat-field-metadata.util.js.map
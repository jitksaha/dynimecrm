"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildTimelineActivityStandardFlatFieldMetadatas", {
    enumerable: true,
    get: function() {
        return buildTimelineActivityStandardFlatFieldMetadatas;
    }
});
const _i18nlabelutil = require("../i18n-label.util");
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _createstandardfieldflatmetadatautil = require("./create-standard-field-flat-metadata.util");
const _createstandardrelationfieldflatmetadatautil = require("./create-standard-relation-field-flat-metadata.util");
const buildTimelineActivityStandardFlatFieldMetadatas = ({ now, objectName, workspaceId, standardObjectMetadataRelatedEntityIds, dependencyFlatEntityMaps, twentyStandardApplicationId })=>({
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
                    id: "AOrWvh",
                    message: "Timeline activity record position"
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
        happensAt: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'happensAt',
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
                isNullable: false,
                isUIEditable: false,
                defaultValue: 'now'
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        timelineActivityTypeId: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'timelineActivityTypeId',
                type: _types.FieldMetadataType.UUID,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "KUIRIR",
                    message: "Event type"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "xFv7OI",
                    message: "Timeline activity type describing this event"
                }),
                icon: 'IconAbc',
                isSystem: true,
                isNullable: true,
                isUIEditable: false
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        timelineActivityTypeSnapshot: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'timelineActivityTypeSnapshot',
                type: _types.FieldMetadataType.RAW_JSON,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "KUIRIR",
                    message: "Event type"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "xFv7OI",
                    message: "Timeline activity type describing this event"
                }),
                icon: 'IconArchive',
                isSystem: true,
                isNullable: true,
                isUIEditable: false
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        properties: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'properties',
                type: _types.FieldMetadataType.RAW_JSON,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "++Dmjj",
                    message: "Event details"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "2aIAwH",
                    message: "Json value for event details"
                }),
                icon: 'IconListDetails',
                isNullable: true,
                isUIEditable: false
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        linkedRecordCachedName: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'linkedRecordCachedName',
                type: _types.FieldMetadataType.TEXT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Vo3NrU",
                    message: "Linked Record cached name"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "ma0oop",
                    message: "Cached record name"
                }),
                icon: 'IconAbc',
                isSystem: true,
                isNullable: true,
                isUIEditable: false
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        linkedRecordId: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'linkedRecordId',
                type: _types.FieldMetadataType.UUID,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "wj0hmG",
                    message: "Linked Record id"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "RczJQq",
                    message: "Linked Record id"
                }),
                icon: 'IconAbc',
                isSystem: true,
                isNullable: true,
                isUIEditable: false
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        linkedObjectMetadataId: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'linkedObjectMetadataId',
                type: _types.FieldMetadataType.UUID,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "8FSeC1",
                    message: "Linked Object Metadata Id"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "TUocGa",
                    message: "Linked Object Metadata Id"
                }),
                icon: 'IconAbc',
                isSystem: true,
                isNullable: true,
                isUIEditable: false
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        workspaceMember: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.RELATION,
                morphId: null,
                fieldName: 'workspaceMember',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "tz4ASG",
                    message: "Workspace Member"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "NZy2VR",
                    message: "Event workspace member"
                }),
                icon: 'IconUsers',
                isNullable: true,
                isUIEditable: false,
                targetObjectName: 'workspaceMember',
                targetFieldName: 'timelineActivities',
                settings: {
                    relationType: _types.RelationType.MANY_TO_ONE,
                    onDelete: _types.RelationOnDeleteAction.CASCADE,
                    joinColumnName: 'workspaceMemberId'
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        targetPerson: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.MORPH_RELATION,
                morphId: _metadata.STANDARD_OBJECTS.timelineActivity.morphIds.targetMorphId.morphId,
                fieldName: 'targetPerson',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "F8wyAu",
                    message: "Person"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "lr7Nsq",
                    message: "Event target"
                }),
                icon: 'IconTimelineEvent',
                isNullable: true,
                isUIEditable: false,
                isSystemSideEffect: true,
                targetObjectName: 'person',
                targetFieldName: 'timelineActivities',
                settings: {
                    relationType: _types.RelationType.MANY_TO_ONE,
                    onDelete: _types.RelationOnDeleteAction.CASCADE,
                    joinColumnName: 'targetPersonId'
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        targetCompany: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.MORPH_RELATION,
                morphId: _metadata.STANDARD_OBJECTS.timelineActivity.morphIds.targetMorphId.morphId,
                fieldName: 'targetCompany',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "aNUhqB",
                    message: "Company"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "lr7Nsq",
                    message: "Event target"
                }),
                icon: 'IconTimelineEvent',
                isNullable: true,
                isUIEditable: false,
                isSystemSideEffect: true,
                targetObjectName: 'company',
                targetFieldName: 'timelineActivities',
                settings: {
                    relationType: _types.RelationType.MANY_TO_ONE,
                    onDelete: _types.RelationOnDeleteAction.CASCADE,
                    joinColumnName: 'targetCompanyId'
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        targetOpportunity: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.MORPH_RELATION,
                morphId: _metadata.STANDARD_OBJECTS.timelineActivity.morphIds.targetMorphId.morphId,
                fieldName: 'targetOpportunity',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "JpA/cO",
                    message: "Opportunity"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "lr7Nsq",
                    message: "Event target"
                }),
                icon: 'IconTimelineEvent',
                isNullable: true,
                isUIEditable: false,
                isSystemSideEffect: true,
                targetObjectName: 'opportunity',
                targetFieldName: 'timelineActivities',
                settings: {
                    relationType: _types.RelationType.MANY_TO_ONE,
                    onDelete: _types.RelationOnDeleteAction.SET_NULL,
                    joinColumnName: 'targetOpportunityId'
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        targetNote: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.MORPH_RELATION,
                morphId: _metadata.STANDARD_OBJECTS.timelineActivity.morphIds.targetMorphId.morphId,
                fieldName: 'targetNote',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "O2bgDc",
                    message: "Note"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "lr7Nsq",
                    message: "Event target"
                }),
                icon: 'IconTimelineEvent',
                isNullable: true,
                isUIEditable: false,
                isSystemSideEffect: true,
                targetObjectName: 'note',
                targetFieldName: 'timelineActivities',
                settings: {
                    relationType: _types.RelationType.MANY_TO_ONE,
                    onDelete: _types.RelationOnDeleteAction.SET_NULL,
                    joinColumnName: 'targetNoteId'
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        targetTask: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.MORPH_RELATION,
                morphId: _metadata.STANDARD_OBJECTS.timelineActivity.morphIds.targetMorphId.morphId,
                fieldName: 'targetTask',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "g6X4T4",
                    message: "Task"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "lr7Nsq",
                    message: "Event target"
                }),
                icon: 'IconTimelineEvent',
                isNullable: true,
                isUIEditable: false,
                isSystemSideEffect: true,
                targetObjectName: 'task',
                targetFieldName: 'timelineActivities',
                settings: {
                    relationType: _types.RelationType.MANY_TO_ONE,
                    onDelete: _types.RelationOnDeleteAction.SET_NULL,
                    joinColumnName: 'targetTaskId'
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        targetWorkflow: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.MORPH_RELATION,
                morphId: _metadata.STANDARD_OBJECTS.timelineActivity.morphIds.targetMorphId.morphId,
                fieldName: 'targetWorkflow',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "y8IlfM",
                    message: "Workflow"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "lr7Nsq",
                    message: "Event target"
                }),
                icon: 'IconTimelineEvent',
                isNullable: true,
                isUIEditable: false,
                isSystemSideEffect: true,
                targetObjectName: 'workflow',
                targetFieldName: 'timelineActivities',
                settings: {
                    relationType: _types.RelationType.MANY_TO_ONE,
                    onDelete: _types.RelationOnDeleteAction.CASCADE,
                    joinColumnName: 'targetWorkflowId'
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        targetWorkflowVersion: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.MORPH_RELATION,
                morphId: _metadata.STANDARD_OBJECTS.timelineActivity.morphIds.targetMorphId.morphId,
                fieldName: 'targetWorkflowVersion',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "W5Wgz6",
                    message: "WorkflowVersion"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "lr7Nsq",
                    message: "Event target"
                }),
                icon: 'IconTimelineEvent',
                isNullable: true,
                isUIEditable: false,
                isSystemSideEffect: true,
                targetObjectName: 'workflowVersion',
                targetFieldName: 'timelineActivities',
                settings: {
                    relationType: _types.RelationType.MANY_TO_ONE,
                    onDelete: _types.RelationOnDeleteAction.CASCADE,
                    joinColumnName: 'targetWorkflowVersionId'
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        targetWorkflowRun: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.MORPH_RELATION,
                morphId: _metadata.STANDARD_OBJECTS.timelineActivity.morphIds.targetMorphId.morphId,
                fieldName: 'targetWorkflowRun',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "oxqc8m",
                    message: "WorkflowRun"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "lr7Nsq",
                    message: "Event target"
                }),
                icon: 'IconTimelineEvent',
                isNullable: true,
                isUIEditable: false,
                isSystemSideEffect: true,
                targetObjectName: 'workflowRun',
                targetFieldName: 'timelineActivities',
                settings: {
                    relationType: _types.RelationType.MANY_TO_ONE,
                    onDelete: _types.RelationOnDeleteAction.CASCADE,
                    joinColumnName: 'targetWorkflowRunId'
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        targetDashboard: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.MORPH_RELATION,
                morphId: _metadata.STANDARD_OBJECTS.timelineActivity.morphIds.targetMorphId.morphId,
                fieldName: 'targetDashboard',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "gmoxtb",
                    message: "Dashboard"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "lr7Nsq",
                    message: "Event target"
                }),
                icon: 'IconTimelineEvent',
                isNullable: true,
                isUIEditable: false,
                isSystemSideEffect: true,
                targetObjectName: 'dashboard',
                targetFieldName: 'timelineActivities',
                settings: {
                    relationType: _types.RelationType.MANY_TO_ONE,
                    onDelete: _types.RelationOnDeleteAction.SET_NULL,
                    joinColumnName: 'targetDashboardId'
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        targetMessageList: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.MORPH_RELATION,
                morphId: _metadata.STANDARD_OBJECTS.timelineActivity.morphIds.targetMorphId.morphId,
                fieldName: 'targetMessageList',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "j5w8z0",
                    message: "MessageList"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "lr7Nsq",
                    message: "Event target"
                }),
                icon: 'IconTimelineEvent',
                isNullable: true,
                isUIEditable: false,
                isSystemSideEffect: true,
                targetObjectName: 'messageList',
                targetFieldName: 'timelineActivities',
                settings: {
                    relationType: _types.RelationType.MANY_TO_ONE,
                    onDelete: _types.RelationOnDeleteAction.SET_NULL,
                    joinColumnName: 'targetMessageListId'
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        targetMessageCampaign: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.MORPH_RELATION,
                morphId: _metadata.STANDARD_OBJECTS.timelineActivity.morphIds.targetMorphId.morphId,
                fieldName: 'targetMessageCampaign',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "S6Ztef",
                    message: "MessageCampaign"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "lr7Nsq",
                    message: "Event target"
                }),
                icon: 'IconTimelineEvent',
                isNullable: true,
                isUIEditable: false,
                isSystemSideEffect: true,
                targetObjectName: 'messageCampaign',
                targetFieldName: 'timelineActivities',
                settings: {
                    relationType: _types.RelationType.MANY_TO_ONE,
                    onDelete: _types.RelationOnDeleteAction.SET_NULL,
                    joinColumnName: 'targetMessageCampaignId'
                }
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

//# sourceMappingURL=compute-timeline-activity-standard-flat-field-metadata.util.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildOpportunityStandardFlatFieldMetadatas", {
    enumerable: true,
    get: function() {
        return buildOpportunityStandardFlatFieldMetadatas;
    }
});
const _i18nlabelutil = require("../i18n-label.util");
const _types = require("twenty-shared/types");
const _standardrelationfieldpropertiesconstant = require("../../../../metadata-modules/object-metadata/constants/standard-relation-field-properties.constant");
const _createstandardfieldflatmetadatautil = require("./create-standard-field-flat-metadata.util");
const _createstandardrelationfieldflatmetadatautil = require("./create-standard-relation-field-flat-metadata.util");
const buildOpportunityStandardFlatFieldMetadatas = ({ now, objectName, workspaceId, standardObjectMetadataRelatedEntityIds, dependencyFlatEntityMaps, twentyStandardApplicationId })=>({
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
                type: _types.FieldMetadataType.TEXT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "WFhVi3",
                    message: "Name"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "jgWZQ6",
                    message: "The opportunity name"
                }),
                icon: 'IconTargetArrow',
                isNullable: true
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        amount: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'amount',
                type: _types.FieldMetadataType.CURRENCY,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "hbJg5A",
                    message: "Amount"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "yEL+R4",
                    message: "Opportunity amount"
                }),
                icon: 'IconCurrencyDollar',
                isNullable: true
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        closeDate: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'closeDate',
                type: _types.FieldMetadataType.DATE_TIME,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "VkdiTS",
                    message: "Close date"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "0zQFQ1",
                    message: "Opportunity close date"
                }),
                icon: 'IconCalendarEvent',
                isNullable: true
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        stage: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'stage',
                type: _types.FieldMetadataType.SELECT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "drcYgn",
                    message: "Stage"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "GvmK2O",
                    message: "Opportunity stage"
                }),
                icon: 'IconProgressCheck',
                isNullable: false,
                defaultValue: "'NEW'",
                options: [
                    {
                        id: '20202020-8e01-4afd-9c39-d2063097587a',
                        value: 'NEW',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "1NsPsQ",
                            message: "New"
                        }),
                        position: 0,
                        color: 'red'
                    },
                    {
                        id: '20202020-e685-4671-ac32-26d304dacb6e',
                        value: 'SCREENING',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "SiXwZL",
                            message: "Screening"
                        }),
                        position: 1,
                        color: 'purple'
                    },
                    {
                        id: '20202020-dde9-4acc-b5ca-f6531a8ecb4a',
                        value: 'MEETING',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "dTYtQr",
                            message: "Meeting"
                        }),
                        position: 2,
                        color: 'sky'
                    },
                    {
                        id: '20202020-696e-4f6b-91bc-f413e9b2f654',
                        value: 'PROPOSAL',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "IBJ/4j",
                            message: "Proposal"
                        }),
                        position: 3,
                        color: 'turquoise'
                    },
                    {
                        id: '20202020-0bb5-4a6f-a8b2-774bbad21104',
                        value: 'CUSTOMER',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "34/Ymp",
                            message: "Customer"
                        }),
                        position: 4,
                        color: 'yellow'
                    }
                ]
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
                    id: "ATrBjm",
                    message: "Opportunity record position"
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
        }),
        pointOfContact: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.RELATION,
                morphId: null,
                fieldName: 'pointOfContact',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "pxTMbt",
                    message: "Point of Contact"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "vqM7BR",
                    message: "Opportunity point of contact"
                }),
                icon: 'IconUser',
                isNullable: true,
                targetObjectName: 'person',
                targetFieldName: 'pointOfContactForOpportunities',
                settings: {
                    relationType: _types.RelationType.MANY_TO_ONE,
                    onDelete: _types.RelationOnDeleteAction.SET_NULL,
                    joinColumnName: 'pointOfContactId'
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
                    id: "bm66XQ",
                    message: "Opportunity company"
                }),
                icon: 'IconBuildingSkyscraper',
                isNullable: true,
                targetObjectName: 'company',
                targetFieldName: 'opportunities',
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
                    id: "rFV9W+",
                    message: "Tasks tied to the opportunity"
                }),
                icon: _standardrelationfieldpropertiesconstant.STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.taskTarget.icon,
                isNullable: true,
                targetObjectName: 'taskTarget',
                targetFieldName: 'targetOpportunity',
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
                    id: "z1WJHw",
                    message: "Notes tied to the opportunity"
                }),
                icon: _standardrelationfieldpropertiesconstant.STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.noteTarget.icon,
                isNullable: true,
                targetObjectName: 'noteTarget',
                targetFieldName: 'targetOpportunity',
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
                    id: "pyeAzD",
                    message: "Calendar events tied to the opportunity"
                }),
                icon: 'IconCalendar',
                isUIEditable: false,
                isNullable: true,
                targetObjectName: 'calendarEventTarget',
                targetFieldName: 'targetOpportunity',
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
                    id: "Z+Jdwp",
                    message: "Message threads tied to the opportunity"
                }),
                icon: 'IconMail',
                isUIEditable: false,
                isNullable: true,
                targetObjectName: 'messageThreadTarget',
                targetFieldName: 'targetOpportunity',
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
                    id: "KWwTpO",
                    message: "Attachments linked to the opportunity"
                }),
                icon: _standardrelationfieldpropertiesconstant.STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.attachment.icon,
                isNullable: true,
                targetObjectName: 'attachment',
                targetFieldName: 'targetOpportunity',
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
                label: (0, _i18nlabelutil.i18nLabel)(_standardrelationfieldpropertiesconstant.STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.timelineActivity.label),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "UkwlVE",
                    message: "Timeline Activities linked to the opportunity."
                }),
                icon: _standardrelationfieldpropertiesconstant.STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT.timelineActivity.icon,
                isNullable: true,
                targetObjectName: 'timelineActivity',
                targetFieldName: 'targetOpportunity',
                settings: {
                    relationType: _types.RelationType.ONE_TO_MANY
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        owner: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.RELATION,
                morphId: null,
                fieldName: 'owner',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "l/RVZK",
                    message: "Owner"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "3rJRbD",
                    message: "Opportunity owner"
                }),
                icon: 'IconUserCircle',
                isNullable: true,
                targetObjectName: 'workspaceMember',
                targetFieldName: 'ownedOpportunities',
                settings: {
                    relationType: _types.RelationType.MANY_TO_ONE,
                    onDelete: _types.RelationOnDeleteAction.SET_NULL,
                    joinColumnName: 'ownerId'
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        })
    });

//# sourceMappingURL=compute-opportunity-standard-flat-field-metadata.util.js.map
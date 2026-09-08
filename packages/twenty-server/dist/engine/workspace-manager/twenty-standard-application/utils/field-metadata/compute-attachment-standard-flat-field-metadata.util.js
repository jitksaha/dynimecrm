"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildAttachmentStandardFlatFieldMetadatas", {
    enumerable: true,
    get: function() {
        return buildAttachmentStandardFlatFieldMetadatas;
    }
});
const _i18nlabelutil = require("../i18n-label.util");
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _createstandardfieldflatmetadatautil = require("./create-standard-field-flat-metadata.util");
const _createstandardrelationfieldflatmetadatautil = require("./create-standard-relation-field-flat-metadata.util");
const buildAttachmentStandardFlatFieldMetadatas = ({ now, objectName, workspaceId, standardObjectMetadataRelatedEntityIds, dependencyFlatEntityMaps, twentyStandardApplicationId })=>({
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
                    id: "ZRbuaB",
                    message: "Attachment name"
                }),
                icon: 'IconFileUpload',
                isNullable: true,
                isUIEditable: false
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        file: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'file',
                type: _types.FieldMetadataType.FILES,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "NELxnm",
                    message: "File"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "D+muK8",
                    message: "Attachment file"
                }),
                icon: 'IconFileUpload',
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
        //deprecated
        fullPath: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'fullPath',
                type: _types.FieldMetadataType.TEXT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "DnqPI8",
                    message: "Full path"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "awsWDN",
                    message: "Attachment full path"
                }),
                icon: 'IconLink',
                isSystem: true,
                isNullable: true,
                isUIEditable: false
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        //deprecated
        fileCategory: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'fileCategory',
                type: _types.FieldMetadataType.SELECT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "iPSuof",
                    message: "File category"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Yp5Kn9",
                    message: "Attachment file category"
                }),
                icon: 'IconList',
                isSystem: true,
                isNullable: false,
                isUIEditable: false,
                defaultValue: "'OTHER'",
                options: [
                    {
                        id: '20202020-11bb-4a52-b1f2-2159b07eec37',
                        value: 'ARCHIVE',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "u9WDFH",
                            message: "Archive"
                        }),
                        position: 0,
                        color: 'gray'
                    },
                    {
                        id: '20202020-ac54-475d-ab0d-e250c28da774',
                        value: 'AUDIO',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "0N8sVQ",
                            message: "Audio"
                        }),
                        position: 1,
                        color: 'pink'
                    },
                    {
                        id: '20202020-66f7-41ba-81ad-f3371312247f',
                        value: 'IMAGE',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "FPbf64",
                            message: "Image"
                        }),
                        position: 2,
                        color: 'yellow'
                    },
                    {
                        id: '20202020-6113-4e3b-84e3-c617e9f25d0c',
                        value: 'PRESENTATION',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "1TLh3X",
                            message: "Presentation"
                        }),
                        position: 3,
                        color: 'orange'
                    },
                    {
                        id: '20202020-44c1-47c7-8e66-e63558d7233f',
                        value: 'SPREADSHEET',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "rWCYgN",
                            message: "Spreadsheet"
                        }),
                        position: 4,
                        color: 'turquoise'
                    },
                    {
                        id: '20202020-cf07-4843-877e-3804cde801d1',
                        value: 'TEXT_DOCUMENT',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "gaHTjP",
                            message: "Text Document"
                        }),
                        position: 5,
                        color: 'blue'
                    },
                    {
                        id: '20202020-443b-4159-a434-5fd9fc327639',
                        value: 'VIDEO',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "j8p0F8",
                            message: "Video"
                        }),
                        position: 6,
                        color: 'purple'
                    },
                    {
                        id: '20202020-bbca-4802-9146-fd1503e94e58',
                        value: 'OTHER',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "r4t1DT",
                            message: "Other"
                        }),
                        position: 7,
                        color: 'gray'
                    }
                ]
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
                    id: "CZMQSV",
                    message: "Attachment record position"
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
        }),
        targetTask: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.MORPH_RELATION,
                morphId: _metadata.STANDARD_OBJECTS.attachment.morphIds.targetMorphId.morphId,
                fieldName: 'targetTask',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "g6X4T4",
                    message: "Task"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "nOtYs7",
                    message: "Attachment target"
                }),
                icon: 'IconFileImport',
                isNullable: true,
                isUIEditable: false,
                isSystemSideEffect: true,
                targetObjectName: 'task',
                targetFieldName: 'attachments',
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
        targetNote: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.MORPH_RELATION,
                morphId: _metadata.STANDARD_OBJECTS.attachment.morphIds.targetMorphId.morphId,
                fieldName: 'targetNote',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "O2bgDc",
                    message: "Note"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "nOtYs7",
                    message: "Attachment target"
                }),
                icon: 'IconFileImport',
                isNullable: true,
                isUIEditable: false,
                isSystemSideEffect: true,
                targetObjectName: 'note',
                targetFieldName: 'attachments',
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
        targetPerson: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.MORPH_RELATION,
                morphId: _metadata.STANDARD_OBJECTS.attachment.morphIds.targetMorphId.morphId,
                fieldName: 'targetPerson',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "F8wyAu",
                    message: "Person"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "nOtYs7",
                    message: "Attachment target"
                }),
                icon: 'IconFileImport',
                isNullable: true,
                isUIEditable: false,
                isSystemSideEffect: true,
                targetObjectName: 'person',
                targetFieldName: 'attachments',
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
                morphId: _metadata.STANDARD_OBJECTS.attachment.morphIds.targetMorphId.morphId,
                fieldName: 'targetCompany',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "aNUhqB",
                    message: "Company"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "nOtYs7",
                    message: "Attachment target"
                }),
                icon: 'IconFileImport',
                isNullable: true,
                isUIEditable: false,
                isSystemSideEffect: true,
                targetObjectName: 'company',
                targetFieldName: 'attachments',
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
                morphId: _metadata.STANDARD_OBJECTS.attachment.morphIds.targetMorphId.morphId,
                fieldName: 'targetOpportunity',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "JpA/cO",
                    message: "Opportunity"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "nOtYs7",
                    message: "Attachment target"
                }),
                icon: 'IconFileImport',
                isNullable: true,
                isUIEditable: false,
                isSystemSideEffect: true,
                targetObjectName: 'opportunity',
                targetFieldName: 'attachments',
                settings: {
                    relationType: _types.RelationType.MANY_TO_ONE,
                    onDelete: _types.RelationOnDeleteAction.CASCADE,
                    joinColumnName: 'targetOpportunityId'
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
                morphId: _metadata.STANDARD_OBJECTS.attachment.morphIds.targetMorphId.morphId,
                fieldName: 'targetDashboard',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "gmoxtb",
                    message: "Dashboard"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "nOtYs7",
                    message: "Attachment target"
                }),
                icon: 'IconFileImport',
                isNullable: true,
                isUIEditable: false,
                isSystemSideEffect: true,
                targetObjectName: 'dashboard',
                targetFieldName: 'attachments',
                settings: {
                    relationType: _types.RelationType.MANY_TO_ONE,
                    onDelete: _types.RelationOnDeleteAction.CASCADE,
                    joinColumnName: 'targetDashboardId'
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
                morphId: _metadata.STANDARD_OBJECTS.attachment.morphIds.targetMorphId.morphId,
                fieldName: 'targetWorkflow',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "y8IlfM",
                    message: "Workflow"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "nOtYs7",
                    message: "Attachment target"
                }),
                icon: 'IconFileImport',
                isNullable: true,
                isUIEditable: false,
                isSystemSideEffect: true,
                targetObjectName: 'workflow',
                targetFieldName: 'attachments',
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
        })
    });

//# sourceMappingURL=compute-attachment-standard-flat-field-metadata.util.js.map
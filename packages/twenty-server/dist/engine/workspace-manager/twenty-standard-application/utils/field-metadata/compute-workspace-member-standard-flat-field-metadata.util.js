"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildWorkspaceMemberStandardFlatFieldMetadatas", {
    enumerable: true,
    get: function() {
        return buildWorkspaceMemberStandardFlatFieldMetadatas;
    }
});
const _i18nlabelutil = require("../i18n-label.util");
const _types = require("twenty-shared/types");
const _createstandardfieldflatmetadatautil = require("./create-standard-field-flat-metadata.util");
const _createstandardrelationfieldflatmetadatautil = require("./create-standard-relation-field-flat-metadata.util");
const _workspacememberworkspaceentity = require("../../../../../modules/workspace-member/standard-objects/workspace-member.workspace-entity");
const buildWorkspaceMemberStandardFlatFieldMetadatas = ({ now, objectName, workspaceId, standardObjectMetadataRelatedEntityIds, dependencyFlatEntityMaps, twentyStandardApplicationId })=>({
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
                    id: "tw1ElT",
                    message: "Workspace member position"
                }),
                icon: 'IconHierarchy2',
                isSystem: true,
                isNullable: false,
                isUIEditable: false,
                defaultValue: 0
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
                    id: "xTE+26",
                    message: "Workspace member name"
                }),
                icon: 'IconUsers',
                isNullable: false,
                isUIEditable: false
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        colorScheme: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'colorScheme',
                type: _types.FieldMetadataType.TEXT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "xp3jG9",
                    message: "Color Scheme"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "/h13bI",
                    message: "Preferred color scheme"
                }),
                icon: 'IconColorSwatch',
                isSystem: true,
                isNullable: false,
                isUIEditable: false,
                defaultValue: "'System'"
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        uiScale: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'uiScale',
                type: _types.FieldMetadataType.TEXT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "dE2rg+",
                    message: "Interface Scale"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "8BEhOO",
                    message: "Preferred interface scale"
                }),
                icon: 'IconZoomScan',
                isSystem: true,
                isNullable: false,
                isUIEditable: false,
                defaultValue: "'Default'"
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        openRecordIn: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'openRecordIn',
                type: _types.FieldMetadataType.TEXT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "lWLaJ5",
                    message: "Open Records In"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Kx3ltI",
                    message: "Where records open for objects that follow the member's preference"
                }),
                icon: 'IconLayoutSidebarRight',
                isSystem: true,
                isNullable: false,
                isUIEditable: false,
                defaultValue: `'${_types.OpenRecordIn.SIDE_PANEL}'`
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        locale: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'locale',
                type: _types.FieldMetadataType.TEXT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "bs1xxW",
                    message: "Language"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "wg/hr/",
                    message: "Preferred language"
                }),
                icon: 'IconLanguage',
                isSystem: true,
                isNullable: false,
                isUIEditable: false,
                defaultValue: "'en'"
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        avatarUrl: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'avatarUrl',
                type: _types.FieldMetadataType.TEXT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "nWgj2z",
                    message: "Avatar Url"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "EVUobL",
                    message: "Workspace member avatar"
                }),
                icon: 'IconFileUpload',
                isSystem: true,
                isNullable: true,
                isUIEditable: false
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        userEmail: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'userEmail',
                type: _types.FieldMetadataType.TEXT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "f0e8iZ",
                    message: "User Email"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "9LL5PC",
                    message: "Related user email address"
                }),
                icon: 'IconMail',
                isSystem: true,
                isNullable: true,
                isUIEditable: false,
                isUnique: true
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
                    id: "YvE7G6",
                    message: "Workspace member job title"
                }),
                icon: 'IconBriefcase',
                isSystem: true,
                isNullable: true,
                isUIEditable: false
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        calendarStartDay: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'calendarStartDay',
                type: _types.FieldMetadataType.NUMBER,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "/N2VrL",
                    message: "Start of the week"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Uadtry",
                    message: "User's preferred start day of the week"
                }),
                icon: 'IconCalendar',
                isSystem: true,
                isNullable: false,
                isUIEditable: false,
                defaultValue: 7,
                settings: {
                    dataType: _types.NumberDataType.INT
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        userId: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'userId',
                type: _types.FieldMetadataType.UUID,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "7OY0g+",
                    message: "User Id"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "AhhOBx",
                    message: "Associated User Id"
                }),
                icon: 'IconUsers',
                isSystem: true,
                isNullable: false,
                isUIEditable: false
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        timeZone: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'timeZone',
                type: _types.FieldMetadataType.TEXT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "3TjusZ",
                    message: "Time zone"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "qAkbUE",
                    message: "User time zone"
                }),
                icon: 'IconTimezone',
                isSystem: true,
                isNullable: false,
                isUIEditable: false,
                defaultValue: "'system'"
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        dateFormat: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'dateFormat',
                type: _types.FieldMetadataType.SELECT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "IakS6+",
                    message: "Date format"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "CUICZ7",
                    message: "User's preferred date format"
                }),
                icon: 'IconCalendarEvent',
                isSystem: true,
                isNullable: false,
                isUIEditable: false,
                defaultValue: "'SYSTEM'",
                options: [
                    {
                        id: '20202020-4b6a-4a08-8506-09bd59ef118e',
                        value: 'SYSTEM',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "7jCAIC",
                            message: "System"
                        }),
                        position: 0,
                        color: 'turquoise'
                    },
                    {
                        id: '20202020-6981-4e21-bb11-43ac1081be04',
                        value: 'MONTH_FIRST',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "mEl3m6",
                            message: "Month First"
                        }),
                        position: 1,
                        color: 'red'
                    },
                    {
                        id: '20202020-bf56-4199-b013-27ee921d046d',
                        value: 'DAY_FIRST',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "Ln7ys4",
                            message: "Day First"
                        }),
                        position: 2,
                        color: 'purple'
                    },
                    {
                        id: '20202020-fd23-47d3-b01d-0479c11e5a2d',
                        value: 'YEAR_FIRST',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "a7ym1l",
                            message: "Year First"
                        }),
                        position: 3,
                        color: 'sky'
                    }
                ]
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        timeFormat: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'timeFormat',
                type: _types.FieldMetadataType.SELECT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "SEdApj",
                    message: "Time format"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "ZIo8Cj",
                    message: "User's preferred time format"
                }),
                icon: 'IconClock2',
                isSystem: true,
                isNullable: false,
                isUIEditable: false,
                defaultValue: "'SYSTEM'",
                options: [
                    {
                        id: '20202020-349f-4ff8-82be-3eb52e7ec5f5',
                        value: 'SYSTEM',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "7jCAIC",
                            message: "System"
                        }),
                        position: 0,
                        color: 'sky'
                    },
                    {
                        id: '20202020-592c-4e33-a457-f4dcde59a3fc',
                        value: 'HOUR_24',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "tkDOSx",
                            message: "24HRS"
                        }),
                        position: 1,
                        color: 'red'
                    },
                    {
                        id: '20202020-151c-43c2-a463-5bc42e5ce434',
                        value: 'HOUR_12',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "dmxzg7",
                            message: "12HRS"
                        }),
                        position: 2,
                        color: 'purple'
                    }
                ]
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        numberFormat: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'numberFormat',
                type: _types.FieldMetadataType.SELECT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "4WLHxu",
                    message: "Number format"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Gy0Tk5",
                    message: "User's preferred number format"
                }),
                icon: 'IconNumbers',
                isSystem: true,
                isNullable: false,
                isUIEditable: false,
                defaultValue: `'${_workspacememberworkspaceentity.WorkspaceMemberNumberFormatEnum.SYSTEM}'`,
                options: [
                    {
                        id: '20202020-8b5b-4cee-8449-ca48d7c65c11',
                        value: _workspacememberworkspaceentity.WorkspaceMemberNumberFormatEnum.SYSTEM,
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "7jCAIC",
                            message: "System"
                        }),
                        position: 0,
                        color: 'turquoise'
                    },
                    {
                        id: '20202020-657d-409b-9c2a-d8c3b8842859',
                        value: _workspacememberworkspaceentity.WorkspaceMemberNumberFormatEnum.COMMAS_AND_DOT,
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "/SzXf6",
                            message: "Commas and dot"
                        }),
                        position: 1,
                        color: 'blue'
                    },
                    {
                        id: '20202020-8703-4475-a92b-42e631851d8b',
                        value: _workspacememberworkspaceentity.WorkspaceMemberNumberFormatEnum.SPACES_AND_COMMA,
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "Qc2uwm",
                            message: "Spaces and comma"
                        }),
                        position: 2,
                        color: 'green'
                    },
                    {
                        id: '20202020-2ea4-4b99-b72b-bebac01fd7db',
                        value: _workspacememberworkspaceentity.WorkspaceMemberNumberFormatEnum.DOTS_AND_COMMA,
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "WvWTez",
                            message: "Dots and comma"
                        }),
                        position: 3,
                        color: 'orange'
                    },
                    {
                        id: '20202020-9d07-4353-8ce9-d067d639abf5',
                        value: _workspacememberworkspaceentity.WorkspaceMemberNumberFormatEnum.APOSTROPHE_AND_DOT,
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "zrOFFt",
                            message: "Apostrophe and dot"
                        }),
                        position: 4,
                        color: 'purple'
                    }
                ]
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
                isNullable: true,
                isUIEditable: false
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        assignedTasks: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.RELATION,
                morphId: null,
                fieldName: 'assignedTasks',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "z2Vy8H",
                    message: "Assigned tasks"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "T+m2GO",
                    message: "Tasks assigned to the workspace member"
                }),
                icon: 'IconCheckbox',
                isNullable: false,
                isUIEditable: false,
                targetObjectName: 'task',
                targetFieldName: 'assignee',
                settings: {
                    relationType: _types.RelationType.ONE_TO_MANY
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        accountOwnerForCompanies: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.RELATION,
                morphId: null,
                fieldName: 'accountOwnerForCompanies',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "QDpiKg",
                    message: "Account Owner For Companies"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Q9JFdG",
                    message: "Account owner for companies"
                }),
                icon: 'IconBriefcase',
                isNullable: false,
                isUIEditable: false,
                targetObjectName: 'company',
                targetFieldName: 'accountOwner',
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
                isNullable: false,
                isUIEditable: false,
                targetObjectName: 'messageParticipant',
                targetFieldName: 'workspaceMember',
                settings: {
                    relationType: _types.RelationType.ONE_TO_MANY
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        blocklist: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.RELATION,
                morphId: null,
                fieldName: 'blocklist',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "IlqwEl",
                    message: "Blocklist"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "V2zJDX",
                    message: "Blocklisted handles"
                }),
                icon: 'IconForbid2',
                isNullable: false,
                isUIEditable: false,
                targetObjectName: 'blocklist',
                targetFieldName: 'workspaceMember',
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
                isNullable: false,
                isUIEditable: false,
                targetObjectName: 'calendarEventParticipant',
                targetFieldName: 'workspaceMember',
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
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "XuTq0a",
                    message: "Events"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "lYf9yG",
                    message: "Events linked to the workspace member"
                }),
                icon: 'IconTimelineEvent',
                isNullable: true,
                isUIEditable: false,
                targetObjectName: 'timelineActivity',
                targetFieldName: 'workspaceMember',
                settings: {
                    relationType: _types.RelationType.ONE_TO_MANY
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        ownedOpportunities: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.RELATION,
                morphId: null,
                fieldName: 'ownedOpportunities',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Bxs7Ar",
                    message: "Owned opportunities"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "I77mP4",
                    message: "Opportunities owned by the workspace member"
                }),
                icon: 'IconTargetArrow',
                isNullable: false,
                isUIEditable: false,
                targetObjectName: 'opportunity',
                targetFieldName: 'owner',
                settings: {
                    relationType: _types.RelationType.ONE_TO_MANY
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
        })
    });

//# sourceMappingURL=compute-workspace-member-standard-flat-field-metadata.util.js.map
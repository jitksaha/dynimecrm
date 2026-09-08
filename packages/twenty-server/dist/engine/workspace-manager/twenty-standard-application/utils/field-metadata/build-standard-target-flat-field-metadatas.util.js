"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildStandardTargetFlatFieldMetadatas", {
    enumerable: true,
    get: function() {
        return buildStandardTargetFlatFieldMetadatas;
    }
});
const _types = require("twenty-shared/types");
const _createstandardfieldflatmetadatautil = require("./create-standard-field-flat-metadata.util");
const _createstandardrelationfieldflatmetadatautil = require("./create-standard-relation-field-flat-metadata.util");
const _i18nlabelutil = require("../i18n-label.util");
const buildStandardTargetFlatFieldMetadatas = ({ objectName, inverseTargetFieldName, morphId, ...args })=>({
        id: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            ...args,
            objectName,
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
            ...args,
            objectName,
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
            ...args,
            objectName,
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
            ...args,
            objectName,
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
            ...args,
            objectName,
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
            ...args,
            objectName,
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
            ...args,
            objectName,
            context: {
                fieldName: 'position',
                type: _types.FieldMetadataType.POSITION,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "rLOFsu",
                    message: "Position"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "nTzzR8",
                    message: "Target record position"
                }),
                icon: 'IconHierarchy2',
                isSystem: true,
                isNullable: false,
                defaultValue: 0
            }
        }),
        searchVector: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            ...args,
            objectName,
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
            }
        }),
        isAutomaticallyAssigned: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            ...args,
            objectName,
            context: {
                fieldName: 'isAutomaticallyAssigned',
                type: _types.FieldMetadataType.BOOLEAN,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "wDnUny",
                    message: "Automatically assigned"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "YpNNWn",
                    message: "Whether current participant rules justify this target"
                }),
                icon: 'IconRobot',
                isSystem: true,
                isNullable: false,
                isUIEditable: false,
                defaultValue: false
            }
        }),
        isManuallyAssigned: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            ...args,
            objectName,
            context: {
                fieldName: 'isManuallyAssigned',
                type: _types.FieldMetadataType.BOOLEAN,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "dgxlIJ",
                    message: "Manually assigned"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "x9NQvE",
                    message: "Whether a user explicitly assigned this target"
                }),
                icon: 'IconUserCheck',
                isSystem: true,
                isNullable: false,
                isUIEditable: false,
                defaultValue: true
            }
        }),
        targetPerson: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            ...args,
            objectName,
            context: {
                type: _types.FieldMetadataType.MORPH_RELATION,
                morphId,
                fieldName: 'targetPerson',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "F8wyAu",
                    message: "Person"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "iVwZ6H",
                    message: "Target record"
                }),
                icon: 'IconUser',
                isNullable: true,
                isUIEditable: false,
                isSystemSideEffect: true,
                targetObjectName: 'person',
                targetFieldName: inverseTargetFieldName,
                settings: {
                    relationType: _types.RelationType.MANY_TO_ONE,
                    onDelete: _types.RelationOnDeleteAction.CASCADE,
                    joinColumnName: 'targetPersonId'
                }
            }
        }),
        targetCompany: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            ...args,
            objectName,
            context: {
                type: _types.FieldMetadataType.MORPH_RELATION,
                morphId,
                fieldName: 'targetCompany',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "aNUhqB",
                    message: "Company"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "iVwZ6H",
                    message: "Target record"
                }),
                icon: 'IconBuildingSkyscraper',
                isNullable: true,
                isUIEditable: false,
                isSystemSideEffect: true,
                targetObjectName: 'company',
                targetFieldName: inverseTargetFieldName,
                settings: {
                    relationType: _types.RelationType.MANY_TO_ONE,
                    onDelete: _types.RelationOnDeleteAction.CASCADE,
                    joinColumnName: 'targetCompanyId'
                }
            }
        }),
        targetOpportunity: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            ...args,
            objectName,
            context: {
                type: _types.FieldMetadataType.MORPH_RELATION,
                morphId,
                fieldName: 'targetOpportunity',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "JpA/cO",
                    message: "Opportunity"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "iVwZ6H",
                    message: "Target record"
                }),
                icon: 'IconTargetArrow',
                isNullable: true,
                isUIEditable: false,
                isSystemSideEffect: true,
                targetObjectName: 'opportunity',
                targetFieldName: inverseTargetFieldName,
                settings: {
                    relationType: _types.RelationType.MANY_TO_ONE,
                    onDelete: _types.RelationOnDeleteAction.CASCADE,
                    joinColumnName: 'targetOpportunityId'
                }
            }
        })
    });

//# sourceMappingURL=build-standard-target-flat-field-metadatas.util.js.map
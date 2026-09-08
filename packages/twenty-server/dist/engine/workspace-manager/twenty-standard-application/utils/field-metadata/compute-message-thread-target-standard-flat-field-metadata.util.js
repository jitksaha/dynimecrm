"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildMessageThreadTargetStandardFlatFieldMetadatas", {
    enumerable: true,
    get: function() {
        return buildMessageThreadTargetStandardFlatFieldMetadatas;
    }
});
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _buildstandardtargetflatfieldmetadatasutil = require("./build-standard-target-flat-field-metadatas.util");
const _createstandardrelationfieldflatmetadatautil = require("./create-standard-relation-field-flat-metadata.util");
const _i18nlabelutil = require("../i18n-label.util");
const buildMessageThreadTargetStandardFlatFieldMetadatas = ({ ...args })=>({
        ...(0, _buildstandardtargetflatfieldmetadatasutil.buildStandardTargetFlatFieldMetadatas)({
            ...args,
            inverseTargetFieldName: 'messageThreadTargets',
            morphId: _metadata.STANDARD_OBJECTS.messageThreadTarget.morphIds.targetMorphId.morphId
        }),
        messageThread: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            ...args,
            context: {
                type: _types.FieldMetadataType.RELATION,
                morphId: null,
                fieldName: 'messageThread',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "JZIhQu",
                    message: "Message thread"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "8VG+FR",
                    message: "Message thread target thread"
                }),
                icon: 'IconMessage',
                isNullable: false,
                isUIEditable: false,
                targetObjectName: 'messageThread',
                targetFieldName: 'messageThreadTargets',
                settings: {
                    relationType: _types.RelationType.MANY_TO_ONE,
                    onDelete: _types.RelationOnDeleteAction.CASCADE,
                    joinColumnName: 'messageThreadId'
                }
            }
        })
    });

//# sourceMappingURL=compute-message-thread-target-standard-flat-field-metadata.util.js.map
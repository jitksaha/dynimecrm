"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildCalendarEventTargetStandardFlatFieldMetadatas", {
    enumerable: true,
    get: function() {
        return buildCalendarEventTargetStandardFlatFieldMetadatas;
    }
});
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _buildstandardtargetflatfieldmetadatasutil = require("./build-standard-target-flat-field-metadatas.util");
const _createstandardrelationfieldflatmetadatautil = require("./create-standard-relation-field-flat-metadata.util");
const _i18nlabelutil = require("../i18n-label.util");
const buildCalendarEventTargetStandardFlatFieldMetadatas = ({ ...args })=>({
        ...(0, _buildstandardtargetflatfieldmetadatasutil.buildStandardTargetFlatFieldMetadatas)({
            ...args,
            inverseTargetFieldName: 'calendarEventTargets',
            morphId: _metadata.STANDARD_OBJECTS.calendarEventTarget.morphIds.targetMorphId.morphId
        }),
        calendarEvent: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            ...args,
            context: {
                type: _types.FieldMetadataType.RELATION,
                morphId: null,
                fieldName: 'calendarEvent',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "D3hM1L",
                    message: "Calendar event"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "XSZPL4",
                    message: "Calendar event target event"
                }),
                icon: 'IconCalendar',
                isNullable: false,
                isUIEditable: false,
                targetObjectName: 'calendarEvent',
                targetFieldName: 'calendarEventTargets',
                settings: {
                    relationType: _types.RelationType.MANY_TO_ONE,
                    onDelete: _types.RelationOnDeleteAction.CASCADE,
                    joinColumnName: 'calendarEventId'
                }
            }
        })
    });

//# sourceMappingURL=compute-calendar-event-target-standard-flat-field-metadata.util.js.map
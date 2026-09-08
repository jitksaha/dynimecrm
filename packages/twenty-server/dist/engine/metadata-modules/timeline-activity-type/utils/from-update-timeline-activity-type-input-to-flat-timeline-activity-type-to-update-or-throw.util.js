"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromUpdateTimelineActivityTypeInputToFlatTimelineActivityTypeToUpdateOrThrow", {
    enumerable: true,
    get: function() {
        return fromUpdateTimelineActivityTypeInputToFlatTimelineActivityTypeToUpdateOrThrow;
    }
});
const _utils = require("twenty-shared/utils");
const _findflatentitybyidinflatentitymapsutil = require("../../flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _timelineactivitytypeexceptioncodeenum = require("../enums/timeline-activity-type-exception-code.enum");
const _timelineactivitytypeexception = require("../timeline-activity-type.exception");
const _findinvalidtranslationoverridepropertiesutil = require("../../utils/find-invalid-translation-override-properties.util");
const _iscalleroverridingentityutil = require("../../utils/is-caller-overriding-entity.util");
const _mergetranslationsintooverridesutil = require("../../utils/merge-translations-into-overrides.util");
const _sanitizeoverridableentityinpututil = require("../../utils/sanitize-overridable-entity-input.util");
const _mergeupdateinexistingrecordutil = require("../../../../utils/merge-update-in-existing-record.util");
const WORKSPACE_EDITABLE_TIMELINE_ACTIVITY_TYPE_PROPERTIES = [
    'label',
    'icon',
    'isActive'
];
const fromUpdateTimelineActivityTypeInputToFlatTimelineActivityTypeToUpdateOrThrow = ({ flatTimelineActivityTypeMaps, updateTimelineActivityTypeInput, callerApplicationUniversalIdentifier, workspaceCustomApplicationUniversalIdentifier })=>{
    const existingFlatTimelineActivityType = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
        flatEntityId: updateTimelineActivityTypeInput.id,
        flatEntityMaps: flatTimelineActivityTypeMaps
    });
    if (!(0, _utils.isDefined)(existingFlatTimelineActivityType)) {
        throw new _timelineactivitytypeexception.TimelineActivityTypeException('Timeline activity type not found', _timelineactivitytypeexceptioncodeenum.TimelineActivityTypeExceptionCode.TIMELINE_ACTIVITY_TYPE_NOT_FOUND);
    }
    const { id: _id, translations = [], ...updates } = updateTimelineActivityTypeInput;
    const invalidTranslationProperties = (0, _findinvalidtranslationoverridepropertiesutil.findInvalidTranslationOverrideProperties)(translations, 'timelineActivityType');
    if ((0, _utils.isNonEmptyArray)(invalidTranslationProperties)) {
        throw new _timelineactivitytypeexception.TimelineActivityTypeException(`Cannot translate timeline activity type properties: ${invalidTranslationProperties.join(', ')}`, _timelineactivitytypeexceptioncodeenum.TimelineActivityTypeExceptionCode.INVALID_TIMELINE_ACTIVITY_TYPE_INPUT);
    }
    const shouldOverride = (0, _iscalleroverridingentityutil.isCallerOverridingEntity)({
        callerApplicationUniversalIdentifier,
        entityApplicationUniversalIdentifier: existingFlatTimelineActivityType.applicationUniversalIdentifier,
        workspaceCustomApplicationUniversalIdentifier,
        isSystemSideEffect: false
    });
    const { overrides, updatedEditableProperties } = (0, _sanitizeoverridableentityinpututil.sanitizeOverridableEntityInput)({
        metadataName: 'timelineActivityType',
        existingFlatEntity: existingFlatTimelineActivityType,
        updatedEditableProperties: updates,
        shouldOverride
    });
    return {
        ...(0, _mergeupdateinexistingrecordutil.mergeUpdateInExistingRecord)({
            existing: existingFlatTimelineActivityType,
            properties: [
                ...WORKSPACE_EDITABLE_TIMELINE_ACTIVITY_TYPE_PROPERTIES
            ],
            update: updatedEditableProperties
        }),
        overrides: (0, _mergetranslationsintooverridesutil.mergeTranslationsIntoOverrides)({
            existingOverrides: overrides,
            translationEntries: translations
        }),
        updatedAt: new Date().toISOString()
    };
};

//# sourceMappingURL=from-update-timeline-activity-type-input-to-flat-timeline-activity-type-to-update-or-throw.util.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get LEGACY_CALENDAR_EVENT_RECORDING_PREFERENCE_FIELD_UNIVERSAL_IDENTIFIER () {
        return LEGACY_CALENDAR_EVENT_RECORDING_PREFERENCE_FIELD_UNIVERSAL_IDENTIFIER;
    },
    get buildCalendarEventFieldRenameUpdates () {
        return buildCalendarEventFieldRenameUpdates;
    },
    get buildCallRecordingObjectRenameUpdates () {
        return buildCallRecordingObjectRenameUpdates;
    },
    get findCalendarEventFieldNameCollisionsForCallRecording () {
        return findCalendarEventFieldNameCollisionsForCallRecording;
    },
    get findCallRecordingObjectNameCollisions () {
        return findCallRecordingObjectNameCollisions;
    },
    get resolveAvailableOldCalendarEventFieldName () {
        return resolveAvailableOldCalendarEventFieldName;
    },
    get resolveAvailableOldCallRecordingObjectNames () {
        return resolveAvailableOldCallRecordingObjectNames;
    }
});
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const CALL_RECORDING_NAME_SINGULAR = 'callRecording';
const CALL_RECORDING_NAME_PLURAL = 'callRecordings';
const CALL_RECORDING_OLD_NAME_SINGULAR = 'callRecordingOld';
const CALL_RECORDING_OLD_NAME_PLURAL = 'callRecordingsOld';
const CALENDAR_EVENT_RECORDING_PREFERENCE_FIELD_NAME = 'recordingPreference';
const CALENDAR_EVENT_CALL_RECORDINGS_FIELD_NAME = 'callRecordings';
const FIELD_OLD_NAME_SUFFIX = 'Old';
const FIELD_OLD_LABEL_SUFFIX = ' (Old)';
const MAX_OLD_NAME_ATTEMPTS = 100;
const LEGACY_CALENDAR_EVENT_RECORDING_PREFERENCE_FIELD_UNIVERSAL_IDENTIFIER = '1d231e7e-9bbe-410b-8007-ea7678a83e58';
const CALL_RECORDING_CALENDAR_EVENT_FIELD_NAMES = [
    CALENDAR_EVENT_RECORDING_PREFERENCE_FIELD_NAME,
    CALENDAR_EVENT_CALL_RECORDINGS_FIELD_NAME
];
const CALL_RECORDING_CALENDAR_EVENT_FIELD_UNIVERSAL_IDENTIFIERS = new Set([
    LEGACY_CALENDAR_EVENT_RECORDING_PREFERENCE_FIELD_UNIVERSAL_IDENTIFIER,
    _metadata.STANDARD_OBJECTS.calendarEvent.fields.callRecordings.universalIdentifier
]);
const findCallRecordingObjectNameCollisions = (flatObjectMetadataMaps)=>Object.values(flatObjectMetadataMaps.byUniversalIdentifier).filter((flatObjectMetadata)=>(0, _utils.isDefined)(flatObjectMetadata) && flatObjectMetadata.universalIdentifier !== _metadata.STANDARD_OBJECTS.callRecording.universalIdentifier && [
            flatObjectMetadata.nameSingular,
            flatObjectMetadata.namePlural
        ].some((name)=>name === CALL_RECORDING_NAME_SINGULAR || name === CALL_RECORDING_NAME_PLURAL));
const resolveAvailableOldCallRecordingObjectNames = (flatObjectMetadataMaps, additionalTakenNames = new Set())=>{
    const takenNames = new Set([
        ...Object.values(flatObjectMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined).flatMap((flatObjectMetadata)=>[
                flatObjectMetadata.nameSingular,
                flatObjectMetadata.namePlural
            ]),
        ...additionalTakenNames
    ]);
    for(let attempt = 0; attempt < MAX_OLD_NAME_ATTEMPTS; attempt++){
        const discriminator = attempt === 0 ? '' : `${attempt + 1}`;
        const nameSingular = `${CALL_RECORDING_OLD_NAME_SINGULAR}${discriminator}`;
        const namePlural = `${CALL_RECORDING_OLD_NAME_PLURAL}${discriminator}`;
        if (!takenNames.has(nameSingular) && !takenNames.has(namePlural)) {
            const labelSuffix = discriminator === '' ? '' : ` ${discriminator}`;
            return {
                nameSingular,
                namePlural,
                labelSingular: `Call Recording (Old)${labelSuffix}`,
                labelPlural: `Call Recordings (Old)${labelSuffix}`
            };
        }
    }
    throw new Error(`Could not find an available callRecordingOld name after ${MAX_OLD_NAME_ATTEMPTS} attempts`);
};
const buildCallRecordingObjectRenameUpdates = ({ flatObjectMetadataMaps, now })=>{
    const reservedOldNames = new Set();
    return findCallRecordingObjectNameCollisions(flatObjectMetadataMaps).map((collidingObjectMetadata)=>{
        const { nameSingular, namePlural, labelSingular, labelPlural } = resolveAvailableOldCallRecordingObjectNames(flatObjectMetadataMaps, reservedOldNames);
        reservedOldNames.add(nameSingular);
        reservedOldNames.add(namePlural);
        return {
            ...collidingObjectMetadata,
            nameSingular,
            namePlural,
            labelSingular,
            labelPlural,
            isLabelSyncedWithName: false,
            updatedAt: now
        };
    });
};
const findCalendarEventFieldNameCollisionsForCallRecording = (flatFieldMetadataMaps)=>Object.values(flatFieldMetadataMaps.byUniversalIdentifier).filter((flatFieldMetadata)=>(0, _utils.isDefined)(flatFieldMetadata) && flatFieldMetadata.objectMetadataUniversalIdentifier === _metadata.STANDARD_OBJECTS.calendarEvent.universalIdentifier && !CALL_RECORDING_CALENDAR_EVENT_FIELD_UNIVERSAL_IDENTIFIERS.has(flatFieldMetadata.universalIdentifier) && CALL_RECORDING_CALENDAR_EVENT_FIELD_NAMES.includes(flatFieldMetadata.name));
const resolveAvailableOldCalendarEventFieldName = ({ flatFieldMetadataMaps, originalFieldName, additionalTakenNames = new Set() })=>{
    const takenFieldNames = new Set([
        ...Object.values(flatFieldMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatFieldMetadata)=>flatFieldMetadata.objectMetadataUniversalIdentifier === _metadata.STANDARD_OBJECTS.calendarEvent.universalIdentifier).map((flatFieldMetadata)=>flatFieldMetadata.name),
        ...additionalTakenNames
    ]);
    for(let attempt = 0; attempt < MAX_OLD_NAME_ATTEMPTS; attempt++){
        const discriminator = attempt === 0 ? '' : `${attempt + 1}`;
        const candidateName = `${originalFieldName}${FIELD_OLD_NAME_SUFFIX}${discriminator}`;
        if (!takenFieldNames.has(candidateName)) {
            return candidateName;
        }
    }
    throw new Error(`Could not find an available ${originalFieldName}Old name after ${MAX_OLD_NAME_ATTEMPTS} attempts`);
};
const buildCalendarEventFieldRenameUpdates = ({ flatFieldMetadataMaps, now })=>{
    const reservedOldFieldNames = new Set();
    return findCalendarEventFieldNameCollisionsForCallRecording(flatFieldMetadataMaps).map((collidingFieldMetadata)=>{
        const name = resolveAvailableOldCalendarEventFieldName({
            flatFieldMetadataMaps,
            originalFieldName: collidingFieldMetadata.name,
            additionalTakenNames: reservedOldFieldNames
        });
        const oldNamePrefix = `${collidingFieldMetadata.name}${FIELD_OLD_NAME_SUFFIX}`;
        const discriminator = name.slice(oldNamePrefix.length);
        const labelSuffix = discriminator === '' ? FIELD_OLD_LABEL_SUFFIX : `${FIELD_OLD_LABEL_SUFFIX} ${discriminator}`;
        reservedOldFieldNames.add(name);
        return {
            ...collidingFieldMetadata,
            name,
            label: `${collidingFieldMetadata.label}${labelSuffix}`,
            isLabelSyncedWithName: false,
            updatedAt: now
        };
    });
};

//# sourceMappingURL=call-recording-name-collision.util.js.map
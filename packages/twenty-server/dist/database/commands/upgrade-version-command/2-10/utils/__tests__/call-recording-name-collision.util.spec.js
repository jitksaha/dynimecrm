"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _callrecordingnamecollisionutil = require("../call-recording-name-collision.util");
const _getflatfieldmetadatamock = require("../../../../../../engine/metadata-modules/flat-field-metadata/__mocks__/get-flat-field-metadata.mock");
const _getflatobjectmetadatamock = require("../../../../../../engine/metadata-modules/flat-object-metadata/__mocks__/get-flat-object-metadata.mock");
const NOW = '2026-06-04T00:00:00.000Z';
const CALENDAR_EVENT_OBJECT_METADATA_ID = 'calendar-event-object-metadata-id';
const buildFlatObjectMetadataMaps = (flatObjectMetadatas)=>({
        byUniversalIdentifier: Object.fromEntries(flatObjectMetadatas.map((flatObjectMetadata)=>[
                flatObjectMetadata.universalIdentifier,
                flatObjectMetadata
            ])),
        universalIdentifierById: Object.fromEntries(flatObjectMetadatas.map((flatObjectMetadata)=>[
                flatObjectMetadata.id,
                flatObjectMetadata.universalIdentifier
            ])),
        universalIdentifiersByApplicationId: {}
    });
const buildFlatFieldMetadataMaps = (flatFieldMetadatas)=>({
        byUniversalIdentifier: Object.fromEntries(flatFieldMetadatas.map((flatFieldMetadata)=>[
                flatFieldMetadata.universalIdentifier,
                flatFieldMetadata
            ])),
        universalIdentifierById: Object.fromEntries(flatFieldMetadatas.map((flatFieldMetadata)=>[
                flatFieldMetadata.id,
                flatFieldMetadata.universalIdentifier
            ])),
        universalIdentifiersByApplicationId: {}
    });
const getCalendarEventFieldMetadataMock = (overrides)=>(0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
        objectMetadataId: CALENDAR_EVENT_OBJECT_METADATA_ID,
        objectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.calendarEvent.universalIdentifier,
        type: _types.FieldMetadataType.TEXT,
        label: overrides.name,
        ...overrides
    });
describe('findCallRecordingObjectNameCollisions', ()=>{
    it('returns an empty array when no object uses the callRecording name', ()=>{
        const maps = buildFlatObjectMetadataMaps([
            (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
                universalIdentifier: 'unrelated-object',
                nameSingular: 'invoice',
                namePlural: 'invoices'
            })
        ]);
        expect((0, _callrecordingnamecollisionutil.findCallRecordingObjectNameCollisions)(maps)).toEqual([]);
    });
    it('returns the custom object whose singular name collides', ()=>{
        const maps = buildFlatObjectMetadataMaps([
            (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
                universalIdentifier: 'colliding-singular',
                nameSingular: 'callRecording',
                namePlural: 'myRecordings'
            })
        ]);
        expect((0, _callrecordingnamecollisionutil.findCallRecordingObjectNameCollisions)(maps).map((object)=>object.universalIdentifier)).toEqual([
            'colliding-singular'
        ]);
    });
    it('returns the custom object whose plural name collides', ()=>{
        const maps = buildFlatObjectMetadataMaps([
            (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
                universalIdentifier: 'colliding-plural',
                nameSingular: 'myRecording',
                namePlural: 'callRecordings'
            })
        ]);
        expect((0, _callrecordingnamecollisionutil.findCallRecordingObjectNameCollisions)(maps).map((object)=>object.universalIdentifier)).toEqual([
            'colliding-plural'
        ]);
    });
    it('returns every colliding object when singular and plural collide on different objects', ()=>{
        const maps = buildFlatObjectMetadataMaps([
            (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
                universalIdentifier: 'colliding-singular',
                nameSingular: 'callRecording',
                namePlural: 'myRecordings'
            }),
            (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
                universalIdentifier: 'colliding-plural',
                nameSingular: 'myRecording',
                namePlural: 'callRecordings'
            })
        ]);
        expect((0, _callrecordingnamecollisionutil.findCallRecordingObjectNameCollisions)(maps).map((object)=>object.universalIdentifier).sort()).toEqual([
            'colliding-plural',
            'colliding-singular'
        ]);
    });
    it('excludes the standard callRecording object itself', ()=>{
        const maps = buildFlatObjectMetadataMaps([
            (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
                universalIdentifier: _metadata.STANDARD_OBJECTS.callRecording.universalIdentifier,
                nameSingular: 'callRecording',
                namePlural: 'callRecordings',
                isCustom: false,
                isSystem: true
            })
        ]);
        expect((0, _callrecordingnamecollisionutil.findCallRecordingObjectNameCollisions)(maps)).toEqual([]);
    });
});
describe('resolveAvailableOldCallRecordingObjectNames', ()=>{
    it('returns the unsuffixed Old names when none are taken', ()=>{
        const maps = buildFlatObjectMetadataMaps([
            (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
                universalIdentifier: 'colliding',
                nameSingular: 'callRecording',
                namePlural: 'callRecordings'
            })
        ]);
        expect((0, _callrecordingnamecollisionutil.resolveAvailableOldCallRecordingObjectNames)(maps)).toEqual({
            nameSingular: 'callRecordingOld',
            namePlural: 'callRecordingsOld',
            labelSingular: 'Call Recording (Old)',
            labelPlural: 'Call Recordings (Old)'
        });
    });
    it('advances to the next discriminator when the Old name is already taken', ()=>{
        const maps = buildFlatObjectMetadataMaps([
            (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
                universalIdentifier: 'colliding',
                nameSingular: 'callRecording',
                namePlural: 'callRecordings'
            }),
            (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
                universalIdentifier: 'old-already-taken',
                nameSingular: 'callRecordingOld',
                namePlural: 'callRecordingsOld'
            })
        ]);
        expect((0, _callrecordingnamecollisionutil.resolveAvailableOldCallRecordingObjectNames)(maps)).toEqual({
            nameSingular: 'callRecordingOld2',
            namePlural: 'callRecordingsOld2',
            labelSingular: 'Call Recording (Old) 2',
            labelPlural: 'Call Recordings (Old) 2'
        });
    });
    it('skips Old names provided as already reserved', ()=>{
        const maps = buildFlatObjectMetadataMaps([
            (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
                universalIdentifier: 'colliding',
                nameSingular: 'callRecording',
                namePlural: 'callRecordings'
            })
        ]);
        expect((0, _callrecordingnamecollisionutil.resolveAvailableOldCallRecordingObjectNames)(maps, new Set([
            'callRecordingOld',
            'callRecordingsOld'
        ]))).toEqual({
            nameSingular: 'callRecordingOld2',
            namePlural: 'callRecordingsOld2',
            labelSingular: 'Call Recording (Old) 2',
            labelPlural: 'Call Recordings (Old) 2'
        });
    });
    it('skips a discriminator when only the plural Old name is taken', ()=>{
        const maps = buildFlatObjectMetadataMaps([
            (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
                universalIdentifier: 'plural-old-taken',
                nameSingular: 'unrelatedSingular',
                namePlural: 'callRecordingsOld'
            })
        ]);
        expect((0, _callrecordingnamecollisionutil.resolveAvailableOldCallRecordingObjectNames)(maps)).toEqual({
            nameSingular: 'callRecordingOld2',
            namePlural: 'callRecordingsOld2',
            labelSingular: 'Call Recording (Old) 2',
            labelPlural: 'Call Recordings (Old) 2'
        });
    });
    it('throws when every candidate Old name is taken', ()=>{
        const blockedSingularNames = Array.from({
            length: 100
        }, (_, attempt)=>{
            const discriminator = attempt === 0 ? '' : `${attempt + 1}`;
            return `callRecordingOld${discriminator}`;
        });
        const maps = buildFlatObjectMetadataMaps(blockedSingularNames.map((nameSingular, index)=>(0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
                universalIdentifier: `taken-${index}`,
                nameSingular,
                namePlural: `${nameSingular}Filler`
            })));
        expect(()=>(0, _callrecordingnamecollisionutil.resolveAvailableOldCallRecordingObjectNames)(maps)).toThrow('Could not find an available callRecordingOld name after 100 attempts');
    });
});
describe('buildCallRecordingObjectRenameUpdates', ()=>{
    it('builds a migration update for a colliding object name', ()=>{
        const maps = buildFlatObjectMetadataMaps([
            (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
                universalIdentifier: 'colliding',
                nameSingular: 'callRecording',
                namePlural: 'callRecordings'
            })
        ]);
        expect((0, _callrecordingnamecollisionutil.buildCallRecordingObjectRenameUpdates)({
            flatObjectMetadataMaps: maps,
            now: NOW
        })).toMatchObject([
            {
                universalIdentifier: 'colliding',
                nameSingular: 'callRecordingOld',
                namePlural: 'callRecordingsOld',
                labelSingular: 'Call Recording (Old)',
                labelPlural: 'Call Recordings (Old)',
                isLabelSyncedWithName: false,
                updatedAt: NOW
            }
        ]);
    });
    it('reserves generated names across multiple object updates', ()=>{
        const maps = buildFlatObjectMetadataMaps([
            (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
                universalIdentifier: 'colliding-singular',
                nameSingular: 'callRecording',
                namePlural: 'myRecordings'
            }),
            (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
                universalIdentifier: 'colliding-plural',
                nameSingular: 'myRecording',
                namePlural: 'callRecordings'
            })
        ]);
        expect((0, _callrecordingnamecollisionutil.buildCallRecordingObjectRenameUpdates)({
            flatObjectMetadataMaps: maps,
            now: NOW
        }).map((objectMetadata)=>objectMetadata.nameSingular)).toEqual([
            'callRecordingOld',
            'callRecordingOld2'
        ]);
    });
});
describe('findCalendarEventFieldNameCollisionsForCallRecording', ()=>{
    it('finds calendarEvent fields that use a name reserved by CallRecording', ()=>{
        const maps = buildFlatFieldMetadataMaps([
            getCalendarEventFieldMetadataMock({
                universalIdentifier: 'colliding-recording-preference',
                name: 'recordingPreference',
                label: 'Recording Preference'
            }),
            getCalendarEventFieldMetadataMock({
                universalIdentifier: 'colliding-call-recordings',
                name: 'callRecordings',
                label: 'Call Recordings'
            })
        ]);
        expect((0, _callrecordingnamecollisionutil.findCalendarEventFieldNameCollisionsForCallRecording)(maps).map((fieldMetadata)=>fieldMetadata.universalIdentifier)).toEqual([
            'colliding-recording-preference',
            'colliding-call-recordings'
        ]);
    });
    it('excludes the CallRecording standard calendarEvent fields', ()=>{
        const maps = buildFlatFieldMetadataMaps([
            getCalendarEventFieldMetadataMock({
                universalIdentifier: _callrecordingnamecollisionutil.LEGACY_CALENDAR_EVENT_RECORDING_PREFERENCE_FIELD_UNIVERSAL_IDENTIFIER,
                name: 'recordingPreference'
            }),
            getCalendarEventFieldMetadataMock({
                universalIdentifier: _metadata.STANDARD_OBJECTS.calendarEvent.fields.callRecordings.universalIdentifier,
                name: 'callRecordings'
            })
        ]);
        expect((0, _callrecordingnamecollisionutil.findCalendarEventFieldNameCollisionsForCallRecording)(maps)).toEqual([]);
    });
    it('excludes fields on objects other than calendarEvent', ()=>{
        const maps = buildFlatFieldMetadataMaps([
            (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
                universalIdentifier: 'other-object-field',
                objectMetadataId: 'other-object-id',
                objectMetadataUniversalIdentifier: 'other-object',
                type: _types.FieldMetadataType.TEXT,
                name: 'recordingPreference',
                label: 'Recording Preference'
            })
        ]);
        expect((0, _callrecordingnamecollisionutil.findCalendarEventFieldNameCollisionsForCallRecording)(maps)).toEqual([]);
    });
});
describe('resolveAvailableOldCalendarEventFieldName', ()=>{
    it('returns the unsuffixed Old field name when it is available', ()=>{
        const maps = buildFlatFieldMetadataMaps([
            getCalendarEventFieldMetadataMock({
                universalIdentifier: 'colliding-field',
                name: 'recordingPreference'
            })
        ]);
        expect((0, _callrecordingnamecollisionutil.resolveAvailableOldCalendarEventFieldName)({
            flatFieldMetadataMaps: maps,
            originalFieldName: 'recordingPreference'
        })).toBe('recordingPreferenceOld');
    });
    it('advances to the next discriminator when the Old field name is taken', ()=>{
        const maps = buildFlatFieldMetadataMaps([
            getCalendarEventFieldMetadataMock({
                universalIdentifier: 'colliding-field',
                name: 'recordingPreference'
            }),
            getCalendarEventFieldMetadataMock({
                universalIdentifier: 'old-field-name-taken',
                name: 'recordingPreferenceOld'
            })
        ]);
        expect((0, _callrecordingnamecollisionutil.resolveAvailableOldCalendarEventFieldName)({
            flatFieldMetadataMaps: maps,
            originalFieldName: 'recordingPreference'
        })).toBe('recordingPreferenceOld2');
    });
    it('skips Old field names provided as already reserved', ()=>{
        const maps = buildFlatFieldMetadataMaps([
            getCalendarEventFieldMetadataMock({
                universalIdentifier: 'colliding-field',
                name: 'callRecordings'
            })
        ]);
        expect((0, _callrecordingnamecollisionutil.resolveAvailableOldCalendarEventFieldName)({
            flatFieldMetadataMaps: maps,
            originalFieldName: 'callRecordings',
            additionalTakenNames: new Set([
                'callRecordingsOld'
            ])
        })).toBe('callRecordingsOld2');
    });
});
describe('buildCalendarEventFieldRenameUpdates', ()=>{
    it('builds a migration update for a colliding calendarEvent field name', ()=>{
        const maps = buildFlatFieldMetadataMaps([
            getCalendarEventFieldMetadataMock({
                universalIdentifier: 'colliding-field',
                name: 'recordingPreference',
                label: 'Recording Preference'
            })
        ]);
        expect((0, _callrecordingnamecollisionutil.buildCalendarEventFieldRenameUpdates)({
            flatFieldMetadataMaps: maps,
            now: NOW
        })).toMatchObject([
            {
                universalIdentifier: 'colliding-field',
                name: 'recordingPreferenceOld',
                label: 'Recording Preference (Old)',
                isLabelSyncedWithName: false,
                updatedAt: NOW
            }
        ]);
    });
    it('reserves generated names across multiple field updates', ()=>{
        const maps = buildFlatFieldMetadataMaps([
            getCalendarEventFieldMetadataMock({
                universalIdentifier: 'colliding-field-one',
                name: 'recordingPreference',
                label: 'Recording Preference'
            }),
            getCalendarEventFieldMetadataMock({
                universalIdentifier: 'colliding-field-two',
                name: 'recordingPreference',
                label: 'Recording Preference'
            })
        ]);
        expect((0, _callrecordingnamecollisionutil.buildCalendarEventFieldRenameUpdates)({
            flatFieldMetadataMaps: maps,
            now: NOW
        }).map((fieldMetadata)=>fieldMetadata.name)).toEqual([
            'recordingPreferenceOld',
            'recordingPreferenceOld2'
        ]);
    });
});

//# sourceMappingURL=call-recording-name-collision.util.spec.js.map
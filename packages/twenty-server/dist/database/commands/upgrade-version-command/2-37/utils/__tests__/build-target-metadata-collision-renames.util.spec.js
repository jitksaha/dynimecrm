"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _metadata = require("twenty-shared/metadata");
const _buildtargetmetadatacollisionrenamesutil = require("../build-target-metadata-collision-renames.util");
const NOW = '2026-08-25T00:00:00.000Z';
describe('target metadata collision renames', ()=>{
    it('renames a custom object occupying a target object name', ()=>{
        const collidingObject = {
            universalIdentifier: 'custom-object',
            nameSingular: 'calendarEventTarget',
            namePlural: 'calendarEventTargets',
            labelSingular: 'Calendar Event Target',
            labelPlural: 'Calendar Event Targets'
        };
        const flatObjectMetadataMaps = {
            byUniversalIdentifier: {
                'custom-object': collidingObject
            }
        };
        expect((0, _buildtargetmetadatacollisionrenamesutil.buildTargetObjectCollisionRenameUpdates)({
            flatObjectMetadataMaps,
            now: NOW
        })).toEqual([
            expect.objectContaining({
                nameSingular: 'calendarEventTargetOld',
                namePlural: 'calendarEventTargetsOld',
                labelSingular: 'Calendar Event Target (Old)',
                updatedAt: NOW
            })
        ]);
    });
    it('bases both renamed names on the custom object during a partial collision', ()=>{
        const collidingObject = {
            universalIdentifier: 'custom-object',
            nameSingular: 'calendarEventTarget',
            namePlural: 'customerInteractions',
            labelSingular: 'Customer interaction',
            labelPlural: 'Customer interactions'
        };
        expect((0, _buildtargetmetadatacollisionrenamesutil.buildTargetObjectCollisionRenameUpdates)({
            flatObjectMetadataMaps: {
                byUniversalIdentifier: {
                    'custom-object': collidingObject
                }
            },
            now: NOW
        })).toEqual([
            expect.objectContaining({
                nameSingular: 'calendarEventTargetOld',
                namePlural: 'customerInteractionsOld'
            })
        ]);
    });
    it('renames only a conflicting field on the same parent object', ()=>{
        const collidingField = {
            universalIdentifier: 'custom-field',
            objectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.company.universalIdentifier,
            name: 'messageThreadTargets',
            label: 'Email history'
        };
        const unrelatedField = {
            universalIdentifier: 'unrelated-field',
            objectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.person.universalIdentifier,
            name: 'messageThreadTargetsOld',
            label: 'Unrelated'
        };
        const flatFieldMetadataMaps = {
            byUniversalIdentifier: {
                'custom-field': collidingField,
                'unrelated-field': unrelatedField
            }
        };
        expect((0, _buildtargetmetadatacollisionrenamesutil.buildTargetFieldCollisionRenameUpdates)({
            flatFieldMetadataMaps,
            now: NOW
        })).toEqual([
            expect.objectContaining({
                universalIdentifier: 'custom-field',
                name: 'messageThreadTargetsOld',
                label: 'Email history (Old)',
                updatedAt: NOW
            })
        ]);
    });
    it('does not rename the standard target fields themselves', ()=>{
        const standardField = {
            universalIdentifier: _metadata.STANDARD_OBJECTS.calendarEvent.fields.calendarEventTargets.universalIdentifier,
            objectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.calendarEvent.universalIdentifier,
            name: 'calendarEventTargets'
        };
        const flatFieldMetadataMaps = {
            byUniversalIdentifier: {
                standard: standardField
            }
        };
        expect((0, _buildtargetmetadatacollisionrenamesutil.buildTargetFieldCollisionRenameUpdates)({
            flatFieldMetadataMaps,
            now: NOW
        })).toEqual([]);
    });
});

//# sourceMappingURL=build-target-metadata-collision-renames.util.spec.js.map
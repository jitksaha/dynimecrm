"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _metadata = require("twenty-shared/metadata");
const _timeline = require("twenty-shared/timeline");
const _utils = require("twenty-shared/utils");
const _buildstandardflattimelineactivitytypemapsutil = require("../build-standard-flat-timeline-activity-type-maps.util");
const getTimelineActivityTypeOrThrow = (flatTimelineActivityTypeMaps, name)=>{
    const timelineActivityType = Object.values(flatTimelineActivityTypeMaps.byUniversalIdentifier).find((type)=>type?.name === name);
    if (!(0, _utils.isDefined)(timelineActivityType)) {
        throw new Error(`Timeline activity type ${name} not found`);
    }
    return timelineActivityType;
};
const buildMaps = (hiddenTimelineActivityTypeColumnPropertyNames)=>(0, _buildstandardflattimelineactivitytypemapsutil.buildStandardFlatTimelineActivityTypeMaps)({
        now: '2026-08-22T00:00:00.000Z',
        workspaceId: '20202020-0000-4000-8000-000000000001',
        twentyStandardApplicationId: '20202020-0000-4000-8000-000000000002',
        hiddenTimelineActivityTypeColumnPropertyNames
    });
describe('buildStandardFlatTimelineActivityTypeMaps', ()=>{
    it('should omit routing properties before their upgrade command is applied', ()=>{
        const maps = buildMaps(new Set([
            'targetRelationFieldUniversalIdentifier',
            'triggerFieldUniversalIdentifiers',
            'happensAtFieldUniversalIdentifier'
        ]));
        expect(getTimelineActivityTypeOrThrow(maps, 'messageLinked').targetRelationFieldUniversalIdentifier).toBeNull();
        expect(getTimelineActivityTypeOrThrow(maps, 'noteUpdated').triggerFieldUniversalIdentifiers).toBeNull();
        expect(getTimelineActivityTypeOrThrow(maps, 'messageLinked').happensAtFieldUniversalIdentifier).toBeNull();
    });
    it('should include routing properties after their upgrade command is applied', ()=>{
        const maps = buildMaps(new Set());
        expect(getTimelineActivityTypeOrThrow(maps, 'messageLinked').targetRelationFieldUniversalIdentifier).toBe(_metadata.STANDARD_OBJECTS.message.fields.messageParticipants.universalIdentifier);
        expect(getTimelineActivityTypeOrThrow(maps, 'noteUpdated').triggerFieldUniversalIdentifiers).toEqual([
            _metadata.STANDARD_OBJECTS.note.fields.title.universalIdentifier
        ]);
        expect(getTimelineActivityTypeOrThrow(maps, 'messageLinked').frontComponentUniversalIdentifier).toBe(_timeline.STANDARD_TIMELINE_ACTIVITY_RENDERER_UNIVERSAL_IDENTIFIERS.message);
        expect(getTimelineActivityTypeOrThrow(maps, 'attachmentLinked').targetRelationFieldUniversalIdentifier).toBe(_metadata.STANDARD_OBJECTS.attachment.fields.targetPerson.universalIdentifier);
        expect(getTimelineActivityTypeOrThrow(maps, 'messageLinked').happensAtFieldUniversalIdentifier).toBe(_metadata.STANDARD_OBJECTS.message.fields.receivedAt.universalIdentifier);
        expect(getTimelineActivityTypeOrThrow(maps, 'calendarEventLinked').happensAtFieldUniversalIdentifier).toBe(_metadata.STANDARD_OBJECTS.calendarEvent.fields.startsAt.universalIdentifier);
        expect(getTimelineActivityTypeOrThrow(maps, 'attachmentLinked').happensAtFieldUniversalIdentifier).toBeNull();
    });
});

//# sourceMappingURL=build-standard-flat-timeline-activity-type-maps.util.spec.js.map
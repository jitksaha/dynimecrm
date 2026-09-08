"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _metadata = require("twenty-shared/metadata");
const _buildlinkedtimelineactivityhappensatbackfillqueriesutil = require("../build-linked-timeline-activity-happens-at-backfill-queries.util");
const MESSAGE_LINKED_TYPE = {
    id: 'message-linked-type-id',
    action: 'linked',
    objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.message.universalIdentifier
};
const CALENDAR_EVENT_LINKED_TYPE = {
    id: 'calendar-event-linked-type-id',
    action: 'linked',
    objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.calendarEvent.universalIdentifier
};
describe('buildLinkedTimelineActivityHappensAtBackfillQueries', ()=>{
    const queries = (0, _buildlinkedtimelineactivityhappensatbackfillqueriesutil.buildLinkedTimelineActivityHappensAtBackfillQueries)({
        schemaName: 'workspace_test',
        batchSize: 5_000,
        flatTimelineActivityTypes: [
            MESSAGE_LINKED_TYPE,
            CALENDAR_EVENT_LINKED_TYPE
        ]
    });
    it('builds one bounded update per linked source object', ()=>{
        expect(queries.map(({ label })=>label)).toEqual([
            'message timeline activities',
            'calendar event timeline activities'
        ]);
        for (const { updateSql } of queries){
            expect(updateSql).toContain('LIMIT 5000');
            expect(updateSql).toContain('"workspace_test"');
            expect(updateSql).toContain(`"timelineActivityTypeId" = ANY($1::uuid[])`);
        }
    });
    it('rewrites happensAt from the source semantic timestamp column', ()=>{
        const [messageQuery, calendarEventQuery] = queries;
        expect(messageQuery.updateSql).toContain('SET "happensAt" = source."receivedAt"');
        expect(messageQuery.updateSql).toContain('"workspace_test"."message"');
        expect(messageQuery.parameters).toEqual([
            [
                MESSAGE_LINKED_TYPE.id
            ]
        ]);
        expect(calendarEventQuery.updateSql).toContain('SET "happensAt" = source."startsAt"');
        expect(calendarEventQuery.updateSql).toContain('"workspace_test"."calendarEvent"');
        expect(calendarEventQuery.parameters).toEqual([
            [
                CALENDAR_EVENT_LINKED_TYPE.id
            ]
        ]);
    });
    it('only ever picks rows still diverging from their source timestamp', ()=>{
        for (const { updateSql, countSql } of queries){
            expect(updateSql).toContain('IS DISTINCT FROM');
            expect(updateSql).toContain('IS NOT NULL');
            expect(countSql).toContain('IS DISTINCT FROM');
        }
    });
    it('ignores types with another action or object', ()=>{
        expect((0, _buildlinkedtimelineactivityhappensatbackfillqueriesutil.buildLinkedTimelineActivityHappensAtBackfillQueries)({
            schemaName: 'workspace_test',
            batchSize: 5_000,
            flatTimelineActivityTypes: [
                {
                    id: 'message-unlinked-type-id',
                    action: 'unlinked',
                    objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.message.universalIdentifier
                },
                {
                    id: 'note-linked-type-id',
                    action: 'linked',
                    objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.note.universalIdentifier
                }
            ]
        })).toEqual([]);
    });
});

//# sourceMappingURL=build-linked-timeline-activity-happens-at-backfill-queries.util.spec.js.map
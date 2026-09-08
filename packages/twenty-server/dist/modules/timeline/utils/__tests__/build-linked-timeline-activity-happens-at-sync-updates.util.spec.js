"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _metadata = require("twenty-shared/metadata");
const _buildlinkedtimelineactivityhappensatsyncupdatesutil = require("../build-linked-timeline-activity-happens-at-sync-updates.util");
const CALENDAR_EVENT_ID = 'calendar-event-id';
const LINKED_TYPE_ID = 'calendar-event-linked-type-id';
const buildCalendarEventRule = (overrides = {})=>({
        sourceFlatObjectMetadata: {
            universalIdentifier: _metadata.STANDARD_OBJECTS.calendarEvent.universalIdentifier,
            nameSingular: 'calendarEvent'
        },
        actions: [
            'linked'
        ],
        timelineActivityType: {
            id: LINKED_TYPE_ID,
            applicationId: 'application-id',
            snapshot: {}
        },
        triggerFieldNames: null,
        happensAtFieldName: 'startsAt',
        targetShape: {
            kind: 'JUNCTION'
        },
        ...overrides
    });
const buildStartsAtUpdatedEvent = (recordId = CALENDAR_EVENT_ID)=>({
        recordId,
        properties: {
            diff: {
                startsAt: {
                    before: '2026-09-01T10:00:00.000Z',
                    after: '2026-09-12T10:00:00.000Z'
                }
            }
        }
    });
const resolveTimelineActivityTypeToNothing = ()=>undefined;
describe('buildLinkedTimelineActivityHappensAtSyncUpdates', ()=>{
    it('collects the changed records when the semantic timestamp changes', ()=>{
        expect((0, _buildlinkedtimelineactivityhappensatsyncupdatesutil.buildLinkedTimelineActivityHappensAtSyncUpdates)({
            rules: [
                buildCalendarEventRule()
            ],
            events: [
                buildStartsAtUpdatedEvent(),
                buildStartsAtUpdatedEvent('other-calendar-event-id')
            ],
            resolveTimelineActivityType: resolveTimelineActivityTypeToNothing
        })).toEqual([
            {
                sourceObjectNameSingular: 'calendarEvent',
                happensAtFieldName: 'startsAt',
                timelineActivityTypeIds: [
                    LINKED_TYPE_ID
                ],
                linkedRecordIds: [
                    CALENDAR_EVENT_ID,
                    'other-calendar-event-id'
                ]
            }
        ]);
    });
    it('ignores updates not touching the semantic timestamp', ()=>{
        const titleOnlyEvent = {
            recordId: CALENDAR_EVENT_ID,
            properties: {
                diff: {
                    title: {
                        before: 'Old',
                        after: 'New'
                    }
                }
            }
        };
        expect((0, _buildlinkedtimelineactivityhappensatsyncupdatesutil.buildLinkedTimelineActivityHappensAtSyncUpdates)({
            rules: [
                buildCalendarEventRule()
            ],
            events: [
                titleOnlyEvent
            ],
            resolveTimelineActivityType: resolveTimelineActivityTypeToNothing
        })).toEqual([]);
    });
    it('ignores rules without a semantic timestamp field', ()=>{
        expect((0, _buildlinkedtimelineactivityhappensatsyncupdatesutil.buildLinkedTimelineActivityHappensAtSyncUpdates)({
            rules: [
                buildCalendarEventRule({
                    happensAtFieldName: null
                })
            ],
            events: [
                buildStartsAtUpdatedEvent()
            ],
            resolveTimelineActivityType: resolveTimelineActivityTypeToNothing
        })).toEqual([]);
    });
    it('ignores self rules and rules without a linked action', ()=>{
        expect((0, _buildlinkedtimelineactivityhappensatsyncupdatesutil.buildLinkedTimelineActivityHappensAtSyncUpdates)({
            rules: [
                buildCalendarEventRule({
                    targetShape: {
                        kind: 'SELF'
                    }
                }),
                buildCalendarEventRule({
                    actions: [
                        'unlinked'
                    ]
                })
            ],
            events: [
                buildStartsAtUpdatedEvent()
            ],
            resolveTimelineActivityType: resolveTimelineActivityTypeToNothing
        })).toEqual([]);
    });
    it('resolves the type through the resolver when the rule carries none', ()=>{
        expect((0, _buildlinkedtimelineactivityhappensatsyncupdatesutil.buildLinkedTimelineActivityHappensAtSyncUpdates)({
            rules: [
                buildCalendarEventRule({
                    timelineActivityType: undefined
                })
            ],
            events: [
                buildStartsAtUpdatedEvent()
            ],
            resolveTimelineActivityType: ()=>({
                    id: 'resolved-type-id',
                    applicationId: 'application-id',
                    snapshot: {}
                })
        })).toEqual([
            {
                sourceObjectNameSingular: 'calendarEvent',
                happensAtFieldName: 'startsAt',
                timelineActivityTypeIds: [
                    'resolved-type-id'
                ],
                linkedRecordIds: [
                    CALENDAR_EVENT_ID
                ]
            }
        ]);
    });
});

//# sourceMappingURL=build-linked-timeline-activity-happens-at-sync-updates.util.spec.js.map
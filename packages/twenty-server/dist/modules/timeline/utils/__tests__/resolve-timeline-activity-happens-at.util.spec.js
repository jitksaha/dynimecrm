"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _resolvetimelineactivityhappensatutil = require("../resolve-timeline-activity-happens-at.util");
const EVENT_TIME = new Date('2026-08-22T12:00:00.000Z');
const SOURCE_TIME = new Date('2024-03-15T09:30:00.000Z');
describe('resolveTimelineActivityHappensAt', ()=>{
    it('uses the mutation timestamp from the record after the event', ()=>{
        const event = {
            properties: {
                after: {
                    updatedAt: EVENT_TIME.toISOString()
                }
            }
        };
        expect((0, _resolvetimelineactivityhappensatutil.resolveTimelineActivityHappensAt)(event)).toEqual(EVENT_TIME);
    });
    it('uses the record before the event when no after record exists', ()=>{
        const event = {
            properties: {
                before: {
                    updatedAt: EVENT_TIME
                }
            }
        };
        expect((0, _resolvetimelineactivityhappensatutil.resolveTimelineActivityHappensAt)(event)).toEqual(EVENT_TIME);
    });
    it('falls back to the processing time for legacy events without timestamps', ()=>{
        jest.useFakeTimers().setSystemTime(EVENT_TIME);
        const event = {
            properties: {}
        };
        expect((0, _resolvetimelineactivityhappensatutil.resolveTimelineActivityHappensAt)(event)).toEqual(EVENT_TIME);
        jest.useRealTimers();
    });
});
describe('resolveLinkedTimelineActivityHappensAt', ()=>{
    const event = {
        properties: {
            after: {
                updatedAt: EVENT_TIME.toISOString()
            }
        }
    };
    it('anchors a linked activity at the source record semantic timestamp', ()=>{
        expect((0, _resolvetimelineactivityhappensatutil.resolveLinkedTimelineActivityHappensAt)({
            event,
            ruleAction: 'linked',
            happensAtFieldName: 'receivedAt',
            sourceRecord: {
                receivedAt: SOURCE_TIME.toISOString()
            }
        })).toEqual(SOURCE_TIME);
    });
    it('parses a semantic timestamp carried as a Date instance', ()=>{
        expect((0, _resolvetimelineactivityhappensatutil.resolveLinkedTimelineActivityHappensAt)({
            event,
            ruleAction: 'linked',
            happensAtFieldName: 'startsAt',
            sourceRecord: {
                startsAt: SOURCE_TIME
            }
        })).toEqual(SOURCE_TIME);
    });
    it('keeps the event timestamp for rule actions other than linked', ()=>{
        expect((0, _resolvetimelineactivityhappensatutil.resolveLinkedTimelineActivityHappensAt)({
            event,
            ruleAction: 'unlinked',
            happensAtFieldName: 'receivedAt',
            sourceRecord: {
                receivedAt: SOURCE_TIME.toISOString()
            }
        })).toEqual(EVENT_TIME);
    });
    it('keeps the event timestamp when the rule declares no semantic field', ()=>{
        expect((0, _resolvetimelineactivityhappensatutil.resolveLinkedTimelineActivityHappensAt)({
            event,
            ruleAction: 'linked',
            happensAtFieldName: null,
            sourceRecord: {
                receivedAt: SOURCE_TIME.toISOString()
            }
        })).toEqual(EVENT_TIME);
    });
    it('keeps the event timestamp when the source record read raced the write', ()=>{
        expect((0, _resolvetimelineactivityhappensatutil.resolveLinkedTimelineActivityHappensAt)({
            event,
            ruleAction: 'linked',
            happensAtFieldName: 'receivedAt',
            sourceRecord: undefined
        })).toEqual(EVENT_TIME);
    });
    it('keeps the event timestamp when the semantic timestamp is null', ()=>{
        expect((0, _resolvetimelineactivityhappensatutil.resolveLinkedTimelineActivityHappensAt)({
            event,
            ruleAction: 'linked',
            happensAtFieldName: 'receivedAt',
            sourceRecord: {
                receivedAt: null
            }
        })).toEqual(EVENT_TIME);
    });
});

//# sourceMappingURL=resolve-timeline-activity-happens-at.util.spec.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _togoogleeventinpututil = require("../to-google-event-input.util");
const baseInput = {
    title: 'Team Sync',
    description: 'Weekly sync',
    location: 'Room A',
    startsAt: '2026-07-01T14:00:00Z',
    endsAt: '2026-07-01T15:00:00Z',
    isFullDay: false,
    timeZone: 'America/New_York',
    attendees: [],
    sendInvitations: false,
    addConferencing: false
};
describe('toGoogleEventInput', ()=>{
    it('maps a timed event with a dateTime and time zone', ()=>{
        const event = (0, _togoogleeventinpututil.toGoogleEventInput)(baseInput);
        expect(event).toMatchObject({
            summary: 'Team Sync',
            description: 'Weekly sync',
            location: 'Room A',
            start: {
                dateTime: '2026-07-01T14:00:00Z',
                timeZone: 'America/New_York'
            },
            end: {
                dateTime: '2026-07-01T15:00:00Z',
                timeZone: 'America/New_York'
            }
        });
        expect(event.attendees).toBeUndefined();
        expect(event.conferenceData).toBeUndefined();
    });
    it('maps an all-day event with date-only boundaries and no time zone', ()=>{
        const event = (0, _togoogleeventinpututil.toGoogleEventInput)({
            ...baseInput,
            isFullDay: true,
            startsAt: '2026-07-01T00:00:00Z',
            endsAt: '2026-07-02T00:00:00Z'
        });
        expect(event.start).toEqual({
            date: '2026-07-01'
        });
        expect(event.end).toEqual({
            date: '2026-07-02'
        });
    });
    it('maps attendees when present', ()=>{
        const event = (0, _togoogleeventinpututil.toGoogleEventInput)({
            ...baseInput,
            attendees: [
                {
                    email: 'guest@example.com',
                    displayName: 'Guest'
                }
            ]
        });
        expect(event.attendees).toEqual([
            {
                email: 'guest@example.com',
                displayName: 'Guest'
            }
        ]);
    });
    it('adds a Google Meet conference request when conferencing is enabled', ()=>{
        const event = (0, _togoogleeventinpututil.toGoogleEventInput)({
            ...baseInput,
            addConferencing: true
        });
        expect(event.conferenceData?.createRequest?.conferenceSolutionKey).toEqual({
            type: 'hangoutsMeet'
        });
        expect(event.conferenceData?.createRequest?.requestId).toEqual(expect.any(String));
    });
});

//# sourceMappingURL=to-google-event-input.util.spec.js.map
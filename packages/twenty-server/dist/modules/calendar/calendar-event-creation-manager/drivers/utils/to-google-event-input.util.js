"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "toGoogleEventInput", {
    enumerable: true,
    get: function() {
        return toGoogleEventInput;
    }
});
const _uuid = require("uuid");
// Google represents all-day events with a date-only boundary, and timed events
// with an RFC 3339 dateTime paired with an IANA time zone.
const toGoogleEventDateTime = (isoDateTime, isFullDay, timeZone)=>isFullDay ? {
        date: isoDateTime.slice(0, 10)
    } : {
        dateTime: isoDateTime,
        timeZone
    };
const toGoogleEventInput = (input)=>{
    const event = {
        summary: input.title,
        description: input.description,
        location: input.location,
        start: toGoogleEventDateTime(input.startsAt, input.isFullDay, input.timeZone),
        end: toGoogleEventDateTime(input.endsAt, input.isFullDay, input.timeZone)
    };
    if (input.attendees.length > 0) {
        event.attendees = input.attendees.map((attendee)=>({
                email: attendee.email,
                displayName: attendee.displayName
            }));
    }
    if (input.addConferencing) {
        event.conferenceData = {
            createRequest: {
                requestId: (0, _uuid.v4)(),
                conferenceSolutionKey: {
                    type: 'hangoutsMeet'
                }
            }
        };
    }
    return event;
};

//# sourceMappingURL=to-google-event-input.util.js.map
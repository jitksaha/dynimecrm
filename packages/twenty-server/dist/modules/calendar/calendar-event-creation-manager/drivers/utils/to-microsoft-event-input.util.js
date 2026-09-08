"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "toMicrosoftEventInput", {
    enumerable: true,
    get: function() {
        return toMicrosoftEventInput;
    }
});
// Microsoft Graph interprets `dateTime` as a wall-clock time in the supplied
// `timeZone` and ignores any embedded offset, so an absolute instant must be
// converted to its wall-clock representation in the event time zone.
const toWallClockInTimeZone = (isoInstant, timeZone)=>{
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23'
    }).formatToParts(new Date(isoInstant));
    const part = (type)=>parts.find((candidate)=>candidate.type === type)?.value ?? '00';
    return `${part('year')}-${part('month')}-${part('day')}T${part('hour')}:${part('minute')}:${part('second')}`;
};
// All-day events are timezone-agnostic dates pinned to midnight; timed events are
// absolute instants expressed as wall-clock in the event time zone.
const toMicrosoftEventDateTime = (isoDateTime, isFullDay, timeZone)=>({
        dateTime: isFullDay ? `${isoDateTime.slice(0, 10)}T00:00:00` : toWallClockInTimeZone(isoDateTime, timeZone),
        timeZone
    });
const toMicrosoftEventInput = (input)=>{
    const event = {
        subject: input.title,
        body: {
            contentType: 'text',
            content: input.description ?? ''
        },
        start: toMicrosoftEventDateTime(input.startsAt, input.isFullDay, input.timeZone),
        end: toMicrosoftEventDateTime(input.endsAt, input.isFullDay, input.timeZone),
        isAllDay: input.isFullDay
    };
    if (input.location) {
        event.location = {
            displayName: input.location
        };
    }
    if (input.attendees.length > 0) {
        event.attendees = input.attendees.map((attendee)=>({
                emailAddress: {
                    address: attendee.email,
                    name: attendee.displayName
                },
                type: 'required'
            }));
    }
    if (input.addConferencing) {
        event.isOnlineMeeting = true;
        event.onlineMeetingProvider = 'teamsForBusiness';
    }
    return event;
};

//# sourceMappingURL=to-microsoft-event-input.util.js.map
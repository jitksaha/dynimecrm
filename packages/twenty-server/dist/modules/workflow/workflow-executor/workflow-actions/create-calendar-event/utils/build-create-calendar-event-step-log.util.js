"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildCreateCalendarEventStepLog", {
    enumerable: true,
    get: function() {
        return buildCreateCalendarEventStepLog;
    }
});
const buildCreateCalendarEventStepLog = ({ input, output, durationMs })=>{
    const result = output.result ?? {};
    const extractString = (key)=>typeof result[key] === 'string' ? result[key] : undefined;
    const extractNumber = (key)=>typeof result[key] === 'number' ? result[key] : undefined;
    return {
        details: {
            type: 'CREATE_CALENDAR_EVENT',
            status: output.success ? 'SUCCESS' : 'ERROR',
            title: extractString('title') ?? input.title,
            startsAt: extractString('startsAt') ?? input.startsAt,
            endsAt: extractString('endsAt') ?? input.endsAt,
            attendeeCount: extractNumber('attendeeCount'),
            conferenceLink: extractString('conferenceLink'),
            connectedAccountId: extractString('connectedAccountId') ?? input.connectedAccountId,
            iCalUid: extractString('iCalUid'),
            error: output.error,
            durationMs
        },
        entries: [],
        sizeBytes: 0
    };
};

//# sourceMappingURL=build-create-calendar-event-step-log.util.js.map
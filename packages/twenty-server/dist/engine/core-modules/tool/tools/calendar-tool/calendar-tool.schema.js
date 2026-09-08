"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateCalendarEventToolInputZodSchema", {
    enumerable: true,
    get: function() {
        return CreateCalendarEventToolInputZodSchema;
    }
});
const _utils = require("twenty-shared/utils");
const _zod = require("zod");
const CreateCalendarEventToolInputZodSchema = _zod.z.object({
    title: _zod.z.string().describe('The title of the calendar event'),
    description: _zod.z.string().describe('The event description or agenda').optional(),
    location: _zod.z.string().describe('The physical or virtual location of the event').optional(),
    startsAt: _zod.z.string().describe('Event start time as an ISO 8601 date-time with an offset (e.g. 2026-07-01T15:00:00Z). For all-day events pass a date (e.g. 2026-07-01).'),
    endsAt: _zod.z.string().describe('Event end time as an ISO 8601 date-time with an offset, after startsAt. For all-day events pass the exclusive end date (the day after the last day).'),
    isFullDay: _zod.z.boolean().describe('Whether the event lasts the whole day').default(false),
    timeZone: _zod.z.string().describe('IANA time zone for the event (e.g. America/New_York). Defaults to UTC.').optional(),
    attendees: _zod.z.string().describe('Comma-separated attendee email addresses. Only applied when sendInvitations is true; otherwise ignored.').optional().default(''),
    sendInvitations: _zod.z.boolean().describe('When true, attendees are added to the event and emailed an invitation. When false, the event is created with no attendees and nobody is notified.').default(false),
    addConferencing: _zod.z.boolean().describe('When true, a video conferencing link is generated (Google Meet for Google accounts, Microsoft Teams for Microsoft accounts).').default(false),
    connectedAccountId: _zod.z.string().refine((val)=>(0, _utils.isValidUuid)(val)).describe('The UUID of the connected account to create the event on. Provide only if known; otherwise leave blank to use the default calendar account.').optional()
});

//# sourceMappingURL=calendar-tool.schema.js.map
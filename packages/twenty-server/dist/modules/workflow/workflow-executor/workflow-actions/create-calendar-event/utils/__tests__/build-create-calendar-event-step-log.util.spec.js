"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _buildcreatecalendareventsteplogutil = require("../build-create-calendar-event-step-log.util");
const input = {
    connectedAccountId: 'account-1',
    title: 'Sync',
    startsAt: '2026-07-01T14:00:00Z',
    endsAt: '2026-07-01T15:00:00Z',
    isFullDay: false,
    sendInvitations: false,
    addConferencing: false
};
describe('buildCreateCalendarEventStepLog', ()=>{
    it('builds a success log from the tool result', ()=>{
        const output = {
            success: true,
            message: 'Calendar event "Sync" created',
            result: {
                iCalUid: 'uid-1',
                title: 'Sync',
                startsAt: '2026-07-01T14:00:00Z',
                endsAt: '2026-07-01T15:00:00Z',
                conferenceLink: 'https://meet.google.com/abc',
                attendeeCount: 2,
                connectedAccountId: 'resolved-account'
            }
        };
        const log = (0, _buildcreatecalendareventsteplogutil.buildCreateCalendarEventStepLog)({
            input,
            output,
            durationMs: 12
        });
        expect(log.details).toMatchObject({
            type: 'CREATE_CALENDAR_EVENT',
            status: 'SUCCESS',
            iCalUid: 'uid-1',
            conferenceLink: 'https://meet.google.com/abc',
            attendeeCount: 2,
            connectedAccountId: 'resolved-account',
            durationMs: 12
        });
    });
    it('builds an error log and falls back to the input fields', ()=>{
        const output = {
            success: false,
            message: 'Failed to create calendar event',
            error: 'boom'
        };
        const log = (0, _buildcreatecalendareventsteplogutil.buildCreateCalendarEventStepLog)({
            input,
            output,
            durationMs: 5
        });
        expect(log.details).toMatchObject({
            type: 'CREATE_CALENDAR_EVENT',
            status: 'ERROR',
            title: 'Sync',
            connectedAccountId: 'account-1',
            error: 'boom'
        });
    });
});

//# sourceMappingURL=build-create-calendar-event-step-log.util.spec.js.map
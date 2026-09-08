"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GoogleCalendarCreateEventService", {
    enumerable: true,
    get: function() {
        return GoogleCalendarCreateEventService;
    }
});
const _common = require("@nestjs/common");
const _googleapis = require("googleapis");
const _formatgooglecalendareventutil = require("../../../../calendar-event-import-manager/drivers/google-calendar/utils/format-google-calendar-event.util");
const _togoogleeventinpututil = require("../../utils/to-google-event-input.util");
const _calendareventcreationexception = require("../../../exceptions/calendar-event-creation.exception");
const _googleoauth2clientprovider = require("../../../../../connected-account/oauth2-client-manager/drivers/google/google-oauth2-client.provider");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const GOOGLE_CALENDAR_ID = 'primary';
let GoogleCalendarCreateEventService = class GoogleCalendarCreateEventService {
    async createCalendarEvent(input, connectedAccount) {
        const oAuth2Client = await this.googleOAuth2ClientProvider.getClient(connectedAccount.id);
        const googleCalendarClient = _googleapis.google.calendar({
            version: 'v3',
            auth: oAuth2Client
        });
        try {
            const { data } = await googleCalendarClient.events.insert({
                calendarId: GOOGLE_CALENDAR_ID,
                conferenceDataVersion: input.addConferencing ? 1 : 0,
                sendUpdates: input.sendInvitations ? 'all' : 'none',
                requestBody: (0, _togoogleeventinpututil.toGoogleEventInput)(input)
            });
            return (0, _formatgooglecalendareventutil.formatGoogleCalendarEvents)([
                data
            ])[0];
        } catch (error) {
            throw new _calendareventcreationexception.CalendarEventCreationException(`Failed to create Google calendar event: ${error instanceof Error ? error.message : 'unknown error'}`, _calendareventcreationexception.CalendarEventCreationExceptionCode.PROVIDER_REQUEST_FAILED);
        }
    }
    constructor(googleOAuth2ClientProvider){
        this.googleOAuth2ClientProvider = googleOAuth2ClientProvider;
    }
};
GoogleCalendarCreateEventService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _googleoauth2clientprovider.GoogleOAuth2ClientProvider === "undefined" ? Object : _googleoauth2clientprovider.GoogleOAuth2ClientProvider
    ])
], GoogleCalendarCreateEventService);

//# sourceMappingURL=google-calendar-create-event.service.js.map
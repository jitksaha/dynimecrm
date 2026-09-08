"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GoogleCalendarAttendeesService", {
    enumerable: true,
    get: function() {
        return GoogleCalendarAttendeesService;
    }
});
const _common = require("@nestjs/common");
const _googleapis = require("googleapis");
const _googleoauth2clientprovider = require("../../connected-account/oauth2-client-manager/drivers/google/google-oauth2-client.provider");
const _onboardinginvitesuggestionslookaheaddaysconstant = require("../constants/onboarding-invite-suggestions-lookahead-days.constant");
const _onboardinginvitesuggestionslookbackdaysconstant = require("../constants/onboarding-invite-suggestions-lookback-days.constant");
const _onboardinginvitesuggestionsmaxeventsconstant = require("../constants/onboarding-invite-suggestions-max-events.constant");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const MS_PER_DAY = 24 * 60 * 60 * 1000;
let GoogleCalendarAttendeesService = class GoogleCalendarAttendeesService {
    async getRecentAttendees(connectedAccountId) {
        const oAuth2Client = await this.googleOAuth2ClientProvider.getClient(connectedAccountId);
        const googleCalendarClient = _googleapis.google.calendar({
            version: 'v3',
            auth: oAuth2Client
        });
        const now = Date.now();
        const response = await googleCalendarClient.events.list({
            calendarId: 'primary',
            singleEvents: true,
            orderBy: 'startTime',
            maxResults: _onboardinginvitesuggestionsmaxeventsconstant.ONBOARDING_INVITE_SUGGESTIONS_MAX_EVENTS,
            timeMin: new Date(now - _onboardinginvitesuggestionslookbackdaysconstant.ONBOARDING_INVITE_SUGGESTIONS_LOOKBACK_DAYS * MS_PER_DAY).toISOString(),
            timeMax: new Date(now + _onboardinginvitesuggestionslookaheaddaysconstant.ONBOARDING_INVITE_SUGGESTIONS_LOOKAHEAD_DAYS * MS_PER_DAY).toISOString()
        });
        const events = response.data.items ?? [];
        const attendees = [];
        for (const event of events){
            const displayNameByEmail = new Map();
            const organizerEmail = event.organizer?.email?.toLowerCase();
            if (organizerEmail) {
                displayNameByEmail.set(organizerEmail, event.organizer?.displayName ?? undefined);
            }
            for (const attendee of event.attendees ?? []){
                const attendeeEmail = attendee.email?.toLowerCase();
                const isRoomOrResource = attendee.resource === true;
                if (!attendeeEmail || isRoomOrResource || displayNameByEmail.has(attendeeEmail)) {
                    continue;
                }
                displayNameByEmail.set(attendeeEmail, attendee.displayName ?? undefined);
            }
            for (const [email, displayName] of displayNameByEmail){
                attendees.push({
                    email,
                    displayName
                });
            }
        }
        return attendees;
    }
    constructor(googleOAuth2ClientProvider){
        this.googleOAuth2ClientProvider = googleOAuth2ClientProvider;
    }
};
GoogleCalendarAttendeesService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _googleoauth2clientprovider.GoogleOAuth2ClientProvider === "undefined" ? Object : _googleoauth2clientprovider.GoogleOAuth2ClientProvider
    ])
], GoogleCalendarAttendeesService);

//# sourceMappingURL=google-calendar-attendees.service.js.map
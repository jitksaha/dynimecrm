"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MicrosoftCalendarAttendeesService", {
    enumerable: true,
    get: function() {
        return MicrosoftCalendarAttendeesService;
    }
});
const _common = require("@nestjs/common");
const _microsoftoauth2clientprovider = require("../../connected-account/oauth2-client-manager/drivers/microsoft/microsoft-oauth2-client.provider");
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
let MicrosoftCalendarAttendeesService = class MicrosoftCalendarAttendeesService {
    async getRecentAttendees(connectedAccountId) {
        const microsoftClient = await this.microsoftOAuth2ClientProvider.getClient(connectedAccountId);
        const now = Date.now();
        const response = await microsoftClient.api('/me/calendarView').query({
            startDateTime: new Date(now - _onboardinginvitesuggestionslookbackdaysconstant.ONBOARDING_INVITE_SUGGESTIONS_LOOKBACK_DAYS * MS_PER_DAY).toISOString(),
            endDateTime: new Date(now + _onboardinginvitesuggestionslookaheaddaysconstant.ONBOARDING_INVITE_SUGGESTIONS_LOOKAHEAD_DAYS * MS_PER_DAY).toISOString()
        }).select('organizer,attendees').top(_onboardinginvitesuggestionsmaxeventsconstant.ONBOARDING_INVITE_SUGGESTIONS_MAX_EVENTS).get();
        const events = response.value ?? [];
        const attendees = [];
        for (const event of events){
            const displayNameByEmail = new Map();
            const organizerEmail = event.organizer?.emailAddress?.address?.toLowerCase();
            if (organizerEmail) {
                displayNameByEmail.set(organizerEmail, event.organizer?.emailAddress?.name ?? undefined);
            }
            for (const attendee of event.attendees ?? []){
                const attendeeEmail = attendee.emailAddress?.address?.toLowerCase();
                const isRoomOrResource = attendee.type === 'resource';
                if (!attendeeEmail || isRoomOrResource || displayNameByEmail.has(attendeeEmail)) {
                    continue;
                }
                displayNameByEmail.set(attendeeEmail, attendee.emailAddress?.name ?? undefined);
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
    constructor(microsoftOAuth2ClientProvider){
        this.microsoftOAuth2ClientProvider = microsoftOAuth2ClientProvider;
    }
};
MicrosoftCalendarAttendeesService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _microsoftoauth2clientprovider.MicrosoftOAuth2ClientProvider === "undefined" ? Object : _microsoftoauth2clientprovider.MicrosoftOAuth2ClientProvider
    ])
], MicrosoftCalendarAttendeesService);

//# sourceMappingURL=microsoft-calendar-attendees.service.js.map
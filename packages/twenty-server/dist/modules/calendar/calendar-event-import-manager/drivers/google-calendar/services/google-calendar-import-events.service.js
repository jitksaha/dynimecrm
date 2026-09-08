"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GoogleCalendarImportEventsService", {
    enumerable: true,
    get: function() {
        return GoogleCalendarImportEventsService;
    }
});
const _common = require("@nestjs/common");
const _googleapis = require("googleapis");
const _utils = require("twenty-shared/utils");
const _formatgooglecalendareventutil = require("../utils/format-google-calendar-event.util");
const _parsegaxioserrorutil = require("../utils/parse-gaxios-error.util");
const _parsegooglecalendarerrorutil = require("../utils/parse-google-calendar-error.util");
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
let GoogleCalendarImportEventsService = class GoogleCalendarImportEventsService {
    async getCalendarEvents(connectedAccount, eventExternalIds) {
        const oAuth2Client = await this.googleOAuth2ClientProvider.getClient(connectedAccount.id);
        const googleCalendarClient = _googleapis.google.calendar({
            version: 'v3',
            auth: oAuth2Client
        });
        const fetchedEvents = await Promise.all(eventExternalIds.map((eventExternalId)=>googleCalendarClient.events.get({
                calendarId: 'primary',
                eventId: eventExternalId
            }).then((response)=>response.data).catch((error)=>{
                const status = error.response?.status;
                if (status === 404 || status === 410) {
                    return null;
                }
                if (!(0, _utils.isDefined)(status)) {
                    throw (0, _parsegaxioserrorutil.parseGaxiosError)(error);
                }
                throw (0, _parsegooglecalendarerrorutil.parseGoogleCalendarError)({
                    code: status,
                    reason: error.response?.data?.error?.errors?.[0].reason || '',
                    message: error.response?.data?.error?.errors?.[0].message || ''
                });
            })));
        return (0, _formatgooglecalendareventutil.formatGoogleCalendarEvents)(fetchedEvents.filter(_utils.isDefined));
    }
    constructor(googleOAuth2ClientProvider){
        this.googleOAuth2ClientProvider = googleOAuth2ClientProvider;
    }
};
GoogleCalendarImportEventsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _googleoauth2clientprovider.GoogleOAuth2ClientProvider === "undefined" ? Object : _googleoauth2clientprovider.GoogleOAuth2ClientProvider
    ])
], GoogleCalendarImportEventsService);

//# sourceMappingURL=google-calendar-import-events.service.js.map
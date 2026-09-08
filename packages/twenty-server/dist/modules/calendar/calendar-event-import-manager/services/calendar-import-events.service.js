"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CalendarImportEventsService", {
    enumerable: true,
    get: function() {
        return CalendarImportEventsService;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _caldavimporteventsservice = require("../drivers/caldav/services/caldav-import-events.service");
const _googlecalendarimporteventsservice = require("../drivers/google-calendar/services/google-calendar-import-events.service");
const _microsoftcalendarimporteventsservice = require("../drivers/microsoft-calendar/services/microsoft-calendar-import-events.service");
const _calendareventimportexception = require("../exceptions/calendar-event-import.exception");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CalendarImportEventsService = class CalendarImportEventsService {
    async getCalendarEvents(connectedAccount, eventExternalIds) {
        switch(connectedAccount.provider){
            case _types.ConnectedAccountProvider.GOOGLE:
                return this.googleCalendarImportEventsService.getCalendarEvents(connectedAccount, eventExternalIds);
            case _types.ConnectedAccountProvider.MICROSOFT:
                return this.microsoftCalendarImportEventsService.getCalendarEvents(connectedAccount, eventExternalIds);
            case _types.ConnectedAccountProvider.IMAP_SMTP_CALDAV:
                return this.caldavCalendarImportEventsService.getCalendarEvents(connectedAccount.id, eventExternalIds);
            default:
                throw new _calendareventimportexception.CalendarEventImportException(`Provider ${connectedAccount.provider} is not supported`, _calendareventimportexception.CalendarEventImportExceptionCode.PROVIDER_NOT_SUPPORTED);
        }
    }
    constructor(googleCalendarImportEventsService, microsoftCalendarImportEventsService, caldavCalendarImportEventsService){
        this.googleCalendarImportEventsService = googleCalendarImportEventsService;
        this.microsoftCalendarImportEventsService = microsoftCalendarImportEventsService;
        this.caldavCalendarImportEventsService = caldavCalendarImportEventsService;
    }
};
CalendarImportEventsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _googlecalendarimporteventsservice.GoogleCalendarImportEventsService === "undefined" ? Object : _googlecalendarimporteventsservice.GoogleCalendarImportEventsService,
        typeof _microsoftcalendarimporteventsservice.MicrosoftCalendarImportEventsService === "undefined" ? Object : _microsoftcalendarimporteventsservice.MicrosoftCalendarImportEventsService,
        typeof _caldavimporteventsservice.CalDavImportEventsService === "undefined" ? Object : _caldavimporteventsservice.CalDavImportEventsService
    ])
], CalendarImportEventsService);

//# sourceMappingURL=calendar-import-events.service.js.map
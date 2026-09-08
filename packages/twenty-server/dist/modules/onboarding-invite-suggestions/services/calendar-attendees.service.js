"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CalendarAttendeesService", {
    enumerable: true,
    get: function() {
        return CalendarAttendeesService;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _googlecalendarattendeesservice = require("./google-calendar-attendees.service");
const _microsoftcalendarattendeesservice = require("./microsoft-calendar-attendees.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CalendarAttendeesService = class CalendarAttendeesService {
    async getRecentAttendees(connectedAccount) {
        switch(connectedAccount.provider){
            case _types.ConnectedAccountProvider.GOOGLE:
                return this.googleCalendarAttendeesService.getRecentAttendees(connectedAccount.id);
            case _types.ConnectedAccountProvider.MICROSOFT:
                return this.microsoftCalendarAttendeesService.getRecentAttendees(connectedAccount.id);
            default:
                return [];
        }
    }
    constructor(googleCalendarAttendeesService, microsoftCalendarAttendeesService){
        this.googleCalendarAttendeesService = googleCalendarAttendeesService;
        this.microsoftCalendarAttendeesService = microsoftCalendarAttendeesService;
    }
};
CalendarAttendeesService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _googlecalendarattendeesservice.GoogleCalendarAttendeesService === "undefined" ? Object : _googlecalendarattendeesservice.GoogleCalendarAttendeesService,
        typeof _microsoftcalendarattendeesservice.MicrosoftCalendarAttendeesService === "undefined" ? Object : _microsoftcalendarattendeesservice.MicrosoftCalendarAttendeesService
    ])
], CalendarAttendeesService);

//# sourceMappingURL=calendar-attendees.service.js.map
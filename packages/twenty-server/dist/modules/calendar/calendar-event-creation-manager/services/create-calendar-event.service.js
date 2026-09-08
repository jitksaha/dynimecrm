"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateCalendarEventService", {
    enumerable: true,
    get: function() {
        return CreateCalendarEventService;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _caldavcreateeventservice = require("../drivers/caldav/services/caldav-create-event.service");
const _googlecalendarcreateeventservice = require("../drivers/google-calendar/services/google-calendar-create-event.service");
const _microsoftcalendarcreateeventservice = require("../drivers/microsoft-calendar/services/microsoft-calendar-create-event.service");
const _calendareventcreationexception = require("../exceptions/calendar-event-creation.exception");
const _calendarsaveeventsservice = require("../../calendar-event-import-manager/services/calendar-save-events.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CreateCalendarEventService = class CreateCalendarEventService {
    async createComposedCalendarEvent(data) {
        switch(data.connectedAccount.provider){
            case _types.ConnectedAccountProvider.GOOGLE:
                return this.googleCalendarCreateEventService.createCalendarEvent(data.input, data.connectedAccount);
            case _types.ConnectedAccountProvider.MICROSOFT:
                return this.microsoftCalendarCreateEventService.createCalendarEvent(data.input, data.connectedAccount);
            case _types.ConnectedAccountProvider.IMAP_SMTP_CALDAV:
                return this.calDavCreateEventService.createCalendarEvent(data.input, data.connectedAccount);
            default:
                throw new _calendareventcreationexception.CalendarEventCreationException(`Calendar event creation is not supported for provider ${data.connectedAccount.provider}`, _calendareventcreationexception.CalendarEventCreationExceptionCode.PROVIDER_NOT_SUPPORTED);
        }
    }
    // Persist the created event right away so it is immediately visible in Twenty.
    // The next provider sync reconciles it via its external id, so a persistence
    // failure here is non-fatal.
    async persistCalendarEvent(createdEvent, data, workspaceId) {
        try {
            const { calendarEventIds } = await this.calendarSaveEventsService.saveCalendarEventsAndEnqueueContactCreationJob([
                createdEvent
            ], data.calendarChannel, data.connectedAccount, workspaceId);
            return calendarEventIds[0] ?? null;
        } catch (persistenceError) {
            this.logger.warn(`Failed to persist created calendar event (sync will recover): ${persistenceError}`);
            return null;
        }
    }
    constructor(googleCalendarCreateEventService, microsoftCalendarCreateEventService, calDavCreateEventService, calendarSaveEventsService){
        this.googleCalendarCreateEventService = googleCalendarCreateEventService;
        this.microsoftCalendarCreateEventService = microsoftCalendarCreateEventService;
        this.calDavCreateEventService = calDavCreateEventService;
        this.calendarSaveEventsService = calendarSaveEventsService;
        this.logger = new _common.Logger(CreateCalendarEventService.name);
    }
};
CreateCalendarEventService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _googlecalendarcreateeventservice.GoogleCalendarCreateEventService === "undefined" ? Object : _googlecalendarcreateeventservice.GoogleCalendarCreateEventService,
        typeof _microsoftcalendarcreateeventservice.MicrosoftCalendarCreateEventService === "undefined" ? Object : _microsoftcalendarcreateeventservice.MicrosoftCalendarCreateEventService,
        typeof _caldavcreateeventservice.CalDavCreateEventService === "undefined" ? Object : _caldavcreateeventservice.CalDavCreateEventService,
        typeof _calendarsaveeventsservice.CalendarSaveEventsService === "undefined" ? Object : _calendarsaveeventsservice.CalendarSaveEventsService
    ])
], CreateCalendarEventService);

//# sourceMappingURL=create-calendar-event.service.js.map
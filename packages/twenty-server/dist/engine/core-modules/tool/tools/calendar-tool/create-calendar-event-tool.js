"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateCalendarEventTool", {
    enumerable: true,
    get: function() {
        return CreateCalendarEventTool;
    }
});
const _common = require("@nestjs/common");
const _constants = require("twenty-shared/constants");
const _calendartoolschema = require("./calendar-tool.schema");
const _calendareventcreationexception = require("../../../../../modules/calendar/calendar-event-creation-manager/exceptions/calendar-event-creation.exception");
const _calendareventcomposerservice = require("../../../../../modules/calendar/calendar-event-creation-manager/services/calendar-event-composer.service");
const _createcalendareventservice = require("../../../../../modules/calendar/calendar-event-creation-manager/services/create-calendar-event.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CreateCalendarEventTool = class CreateCalendarEventTool {
    async execute(parameters, context) {
        try {
            const result = await this.calendarEventComposerService.composeCalendarEvent(parameters, context.workspaceId);
            if (!result.success) {
                return {
                    success: false,
                    message: 'Failed to create calendar event',
                    error: result.error
                };
            }
            const { data } = result;
            const createdEvent = await this.createCalendarEventService.createComposedCalendarEvent(data);
            await this.createCalendarEventService.persistCalendarEvent(createdEvent, data, context.workspaceId);
            this.logger.log(`Calendar event "${createdEvent.title}" created on connected account ${data.connectedAccount.id}`);
            return {
                success: true,
                message: `Calendar event "${createdEvent.title}" created`,
                result: {
                    iCalUid: createdEvent.iCalUid,
                    externalEventId: createdEvent.id,
                    title: createdEvent.title,
                    startsAt: createdEvent.startsAt,
                    endsAt: createdEvent.endsAt,
                    conferenceLink: createdEvent.conferenceLinkUrl || undefined,
                    attendeeCount: createdEvent.participants.length,
                    connectedAccountId: data.connectedAccount.id
                }
            };
        } catch (error) {
            if (error instanceof _calendareventcreationexception.CalendarEventCreationException) {
                return {
                    success: false,
                    message: 'Failed to create calendar event',
                    error: error.message
                };
            }
            this.logger.error(`Failed to create calendar event: ${error}`);
            return {
                success: false,
                message: 'Failed to create calendar event',
                error: error instanceof Error ? error.message : 'Failed to create calendar event'
            };
        }
    }
    constructor(calendarEventComposerService, createCalendarEventService){
        this.calendarEventComposerService = calendarEventComposerService;
        this.createCalendarEventService = createCalendarEventService;
        this.logger = new _common.Logger(CreateCalendarEventTool.name);
        this.description = 'Create a calendar event on a connected Google or Microsoft account. Requires CREATE_CALENDAR_EVENT_TOOL permission. Set sendInvitations to true to attach attendees and email them an invitation; when false the event is created with no attendees and nobody is notified.';
        this.inputSchema = _calendartoolschema.CreateCalendarEventToolInputZodSchema;
        this.flag = _constants.PermissionFlagType.CREATE_CALENDAR_EVENT_TOOL;
    }
};
CreateCalendarEventTool = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _calendareventcomposerservice.CalendarEventComposerService === "undefined" ? Object : _calendareventcomposerservice.CalendarEventComposerService,
        typeof _createcalendareventservice.CreateCalendarEventService === "undefined" ? Object : _createcalendareventservice.CreateCalendarEventService
    ])
], CreateCalendarEventTool);

//# sourceMappingURL=create-calendar-event-tool.js.map
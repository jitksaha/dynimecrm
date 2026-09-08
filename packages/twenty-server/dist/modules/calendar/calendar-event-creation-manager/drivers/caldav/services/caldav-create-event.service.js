"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CalDavCreateEventService", {
    enumerable: true,
    get: function() {
        return CalDavCreateEventService;
    }
});
const _common = require("@nestjs/common");
const _icalgenerator = /*#__PURE__*/ _interop_require_default(require("ical-generator"));
const _uuid = require("uuid");
const _calendareventcreationexception = require("../../../exceptions/calendar-event-creation.exception");
const _caldavclientprovider = require("../../../../calendar-event-import-manager/drivers/caldav/providers/caldav-client.provider");
const _caldavfetcheventsservice = require("../../../../calendar-event-import-manager/drivers/caldav/services/caldav-fetch-events.service");
const _calendareventparticipantworkspaceentity = require("../../../../common/standard-objects/calendar-event-participant.workspace-entity");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CalDavCreateEventService = class CalDavCreateEventService {
    async createCalendarEvent(input, connectedAccount) {
        try {
            const client = await this.calDavClientProvider.getClient(connectedAccount.id);
            const [targetCalendar] = await this.calDavFetchEventsService.listEventCalendars(client);
            if (!targetCalendar) {
                throw new _calendareventcreationexception.CalendarEventCreationException('No writable CalDAV calendar found', _calendareventcreationexception.CalendarEventCreationExceptionCode.PROVIDER_REQUEST_FAILED);
            }
            const uid = (0, _uuid.v4)();
            const calendar = (0, _icalgenerator.default)({
                prodId: '//Twenty//Calendar//EN'
            });
            calendar.createEvent({
                id: uid,
                start: new Date(input.startsAt),
                end: new Date(input.endsAt),
                allDay: input.isFullDay,
                summary: input.title,
                description: input.description,
                location: input.location,
                attendees: input.attendees.map((attendee)=>({
                        email: attendee.email,
                        name: attendee.displayName
                    }))
            });
            const filename = `${uid}.ics`;
            await client.createCalendarObject({
                calendar: targetCalendar,
                filename,
                iCalString: calendar.toString()
            });
            // Source the resource href from the server through the same path the
            // import keys on, so a later sync reconciles this event instead of
            // duplicating it. Reconstructing the href locally risks a format mismatch
            // (full URL vs the server-relative path the provider returns).
            const reconstructedHref = new URL(filename, targetCalendar.url).href;
            let id = reconstructedHref;
            try {
                const [syncedEvent] = await this.calDavFetchEventsService.fetchEventsByHrefs(client, [
                    reconstructedHref
                ]);
                id = syncedEvent?.id ?? reconstructedHref;
            } catch  {
            // The event was created; resolving its server href is best-effort, so
            // fall back to the reconstructed href rather than failing the create.
            }
            const now = new Date().toISOString();
            return {
                id,
                iCalUid: uid,
                title: input.title,
                description: input.description ?? '',
                location: input.location ?? '',
                startsAt: input.startsAt,
                endsAt: input.endsAt,
                isFullDay: input.isFullDay,
                isCanceled: false,
                status: 'CONFIRMED',
                conferenceLinkLabel: '',
                conferenceLinkUrl: '',
                conferenceSolution: '',
                externalCreatedAt: now,
                externalUpdatedAt: now,
                participants: input.attendees.map((attendee)=>({
                        displayName: attendee.displayName ?? '',
                        handle: attendee.email,
                        responseStatus: _calendareventparticipantworkspaceentity.CalendarEventParticipantResponseStatus.NEEDS_ACTION,
                        isOrganizer: false
                    }))
            };
        } catch (error) {
            if (error instanceof _calendareventcreationexception.CalendarEventCreationException) {
                throw error;
            }
            throw new _calendareventcreationexception.CalendarEventCreationException(`Failed to create CalDAV calendar event: ${error instanceof Error ? error.message : 'unknown error'}`, _calendareventcreationexception.CalendarEventCreationExceptionCode.PROVIDER_REQUEST_FAILED);
        }
    }
    constructor(calDavClientProvider, calDavFetchEventsService){
        this.calDavClientProvider = calDavClientProvider;
        this.calDavFetchEventsService = calDavFetchEventsService;
    }
};
CalDavCreateEventService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _caldavclientprovider.CalDavClientProvider === "undefined" ? Object : _caldavclientprovider.CalDavClientProvider,
        typeof _caldavfetcheventsservice.CalDavFetchEventsService === "undefined" ? Object : _caldavfetcheventsservice.CalDavFetchEventsService
    ])
], CalDavCreateEventService);

//# sourceMappingURL=caldav-create-event.service.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MicrosoftCalendarCreateEventService", {
    enumerable: true,
    get: function() {
        return MicrosoftCalendarCreateEventService;
    }
});
const _common = require("@nestjs/common");
const _formatmicrosoftcalendareventutil = require("../../../../calendar-event-import-manager/drivers/microsoft-calendar/utils/format-microsoft-calendar-event.util");
const _tomicrosofteventinpututil = require("../../utils/to-microsoft-event-input.util");
const _calendareventcreationexception = require("../../../exceptions/calendar-event-creation.exception");
const _microsoftoauth2clientprovider = require("../../../../../connected-account/oauth2-client-manager/drivers/microsoft/microsoft-oauth2-client.provider");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let MicrosoftCalendarCreateEventService = class MicrosoftCalendarCreateEventService {
    async createCalendarEvent(input, connectedAccount) {
        const microsoftClient = await this.microsoftOAuth2ClientProvider.getClient(connectedAccount.id);
        try {
            // Request the created event back in UTC so its start/end are absolute
            // instants. Graph otherwise echoes the request time zone, which the shared
            // formatter would persist as an ambiguous wall-clock time. This matches how
            // the import path consumes Graph datetimes.
            const createdEvent = await microsoftClient.api('/me/calendar/events').header('Prefer', 'outlook.timezone="UTC"').post((0, _tomicrosofteventinpututil.toMicrosoftEventInput)(input));
            return (0, _formatmicrosoftcalendareventutil.formatMicrosoftCalendarEvents)([
                createdEvent
            ])[0];
        } catch (error) {
            throw new _calendareventcreationexception.CalendarEventCreationException(`Failed to create Microsoft calendar event: ${error instanceof Error ? error.message : 'unknown error'}`, _calendareventcreationexception.CalendarEventCreationExceptionCode.PROVIDER_REQUEST_FAILED);
        }
    }
    constructor(microsoftOAuth2ClientProvider){
        this.microsoftOAuth2ClientProvider = microsoftOAuth2ClientProvider;
    }
};
MicrosoftCalendarCreateEventService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _microsoftoauth2clientprovider.MicrosoftOAuth2ClientProvider === "undefined" ? Object : _microsoftoauth2clientprovider.MicrosoftOAuth2ClientProvider
    ])
], MicrosoftCalendarCreateEventService);

//# sourceMappingURL=microsoft-calendar-create-event.service.js.map
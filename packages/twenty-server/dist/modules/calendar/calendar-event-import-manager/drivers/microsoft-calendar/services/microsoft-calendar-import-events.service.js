"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MicrosoftCalendarImportEventsService", {
    enumerable: true,
    get: function() {
        return MicrosoftCalendarImportEventsService;
    }
});
const _common = require("@nestjs/common");
const _microsoftcalendareventsimporterrorhandlerservice = require("./microsoft-calendar-events-import-error-handler.service");
const _formatmicrosoftcalendareventutil = require("../utils/format-microsoft-calendar-event.util");
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
let MicrosoftCalendarImportEventsService = class MicrosoftCalendarImportEventsService {
    async getCalendarEvents(connectedAccount, eventExternalIds) {
        const microsoftClient = await this.microsoftOAuth2ClientProvider.getClient(connectedAccount.id);
        const events = [];
        for (const eventExternalId of eventExternalIds){
            const event = await microsoftClient.api(`/me/calendar/events/${eventExternalId}`).header('Prefer', 'outlook.body-content-type="text"').get().catch((error)=>this.microsoftCalendarEventsImportErrorHandler.handleError(error));
            events.push(event);
        }
        return (0, _formatmicrosoftcalendareventutil.formatMicrosoftCalendarEvents)(events);
    }
    constructor(microsoftOAuth2ClientProvider, microsoftCalendarEventsImportErrorHandler){
        this.microsoftOAuth2ClientProvider = microsoftOAuth2ClientProvider;
        this.microsoftCalendarEventsImportErrorHandler = microsoftCalendarEventsImportErrorHandler;
    }
};
MicrosoftCalendarImportEventsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _microsoftoauth2clientprovider.MicrosoftOAuth2ClientProvider === "undefined" ? Object : _microsoftoauth2clientprovider.MicrosoftOAuth2ClientProvider,
        typeof _microsoftcalendareventsimporterrorhandlerservice.MicrosoftCalendarEventsImportErrorHandler === "undefined" ? Object : _microsoftcalendareventsimporterrorhandlerservice.MicrosoftCalendarEventsImportErrorHandler
    ])
], MicrosoftCalendarImportEventsService);

//# sourceMappingURL=microsoft-calendar-import-events.service.js.map
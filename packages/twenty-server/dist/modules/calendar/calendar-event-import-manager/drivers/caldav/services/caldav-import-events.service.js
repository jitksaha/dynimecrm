"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CalDavImportEventsService", {
    enumerable: true,
    get: function() {
        return CalDavImportEventsService;
    }
});
const _common = require("@nestjs/common");
const _caldavclientprovider = require("../providers/caldav-client.provider");
const _caldavfetcheventsservice = require("./caldav-fetch-events.service");
const _parsecaldaverrorutil = require("../utils/parse-caldav-error.util");
const _calendareventimportdriverexception = require("../../exceptions/calendar-event-import-driver.exception");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CalDavImportEventsService = class CalDavImportEventsService {
    async getCalendarEvents(connectedAccountId, eventExternalIds) {
        this.logger.debug(`Importing ${eventExternalIds.length} calendar events for ${connectedAccountId}`);
        try {
            const client = await this.calDavClientProvider.getClient(connectedAccountId);
            return await this.fetchEventsService.fetchEventsByHrefs(client, eventExternalIds);
        } catch (error) {
            this.logger.error(`Error in ${CalDavImportEventsService.name} - getCalendarEvents`, error);
            if (error instanceof _calendareventimportdriverexception.CalendarEventImportDriverException) {
                throw error;
            }
            throw (0, _parsecaldaverrorutil.parseCalDAVError)(error);
        }
    }
    constructor(calDavClientProvider, fetchEventsService){
        this.calDavClientProvider = calDavClientProvider;
        this.fetchEventsService = fetchEventsService;
        this.logger = new _common.Logger(CalDavImportEventsService.name);
    }
};
CalDavImportEventsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _caldavclientprovider.CalDavClientProvider === "undefined" ? Object : _caldavclientprovider.CalDavClientProvider,
        typeof _caldavfetcheventsservice.CalDavFetchEventsService === "undefined" ? Object : _caldavfetcheventsservice.CalDavFetchEventsService
    ])
], CalDavImportEventsService);

//# sourceMappingURL=caldav-import-events.service.js.map
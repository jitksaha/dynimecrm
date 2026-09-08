"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MicrosoftCalendarEventsImportErrorHandler", {
    enumerable: true,
    get: function() {
        return MicrosoftCalendarEventsImportErrorHandler;
    }
});
const _common = require("@nestjs/common");
const _microsoftcalendarnetworkerrorhandlerservice = require("./microsoft-calendar-network-error-handler.service");
const _parsemicrosoftcalendarerrorutil = require("../utils/parse-microsoft-calendar-error.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let MicrosoftCalendarEventsImportErrorHandler = class MicrosoftCalendarEventsImportErrorHandler {
    // oxlint-disable-next-line typescript/no-explicit-any
    handleError(error) {
        this.logger.error(`Error fetching calendar events: ${JSON.stringify(error)}`);
        const networkError = this.microsoftCalendarNetworkErrorHandler.handleError(error);
        if (networkError) {
            throw networkError;
        }
        throw (0, _parsemicrosoftcalendarerrorutil.parseMicrosoftCalendarError)(error);
    }
    constructor(microsoftCalendarNetworkErrorHandler){
        this.microsoftCalendarNetworkErrorHandler = microsoftCalendarNetworkErrorHandler;
        this.logger = new _common.Logger(MicrosoftCalendarEventsImportErrorHandler.name);
    }
};
MicrosoftCalendarEventsImportErrorHandler = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _microsoftcalendarnetworkerrorhandlerservice.MicrosoftCalendarNetworkErrorHandler === "undefined" ? Object : _microsoftcalendarnetworkerrorhandlerservice.MicrosoftCalendarNetworkErrorHandler
    ])
], MicrosoftCalendarEventsImportErrorHandler);

//# sourceMappingURL=microsoft-calendar-events-import-error-handler.service.js.map
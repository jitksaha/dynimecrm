"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MicrosoftCalendarNetworkErrorHandler", {
    enumerable: true,
    get: function() {
        return MicrosoftCalendarNetworkErrorHandler;
    }
});
const _common = require("@nestjs/common");
const _calendareventimportdriverexception = require("../../exceptions/calendar-event-import-driver.exception");
const _istemporaryerrorutils = require("../../../../../messaging/message-import-manager/drivers/microsoft/utils/is-temporary-error.utils");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let MicrosoftCalendarNetworkErrorHandler = class MicrosoftCalendarNetworkErrorHandler {
    // oxlint-disable-next-line typescript/no-explicit-any
    handleError(error) {
        const isBodyString = error.body && typeof error.body === 'string';
        const isTemporaryError = isBodyString && (0, _istemporaryerrorutils.isMicrosoftClientTemporaryError)(error.body);
        if (isTemporaryError) {
            return new _calendareventimportdriverexception.CalendarEventImportDriverException(`code: ${error.code} - body: ${error.body}`, _calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.TEMPORARY_ERROR);
        }
        return null;
    }
};
MicrosoftCalendarNetworkErrorHandler = _ts_decorate([
    (0, _common.Injectable)()
], MicrosoftCalendarNetworkErrorHandler);

//# sourceMappingURL=microsoft-calendar-network-error-handler.service.js.map
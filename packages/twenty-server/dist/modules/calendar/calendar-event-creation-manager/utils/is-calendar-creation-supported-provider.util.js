"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isCalendarCreationSupportedProvider", {
    enumerable: true,
    get: function() {
        return isCalendarCreationSupportedProvider;
    }
});
const _types = require("twenty-shared/types");
const isCalendarCreationSupportedProvider = (provider)=>provider === _types.ConnectedAccountProvider.GOOGLE || provider === _types.ConnectedAccountProvider.MICROSOFT || provider === _types.ConnectedAccountProvider.IMAP_SMTP_CALDAV;

//# sourceMappingURL=is-calendar-creation-supported-provider.util.js.map
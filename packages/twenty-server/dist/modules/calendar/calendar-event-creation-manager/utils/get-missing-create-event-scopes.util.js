"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getMissingCreateEventScopes", {
    enumerable: true,
    get: function() {
        return getMissingCreateEventScopes;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const GOOGLE_CALENDAR_EVENTS_SCOPE = 'https://www.googleapis.com/auth/calendar.events';
const MICROSOFT_CALENDARS_READ_WRITE_SCOPE = 'Calendars.ReadWrite';
const getMissingCreateEventScopes = (connectedAccount)=>{
    const scopes = connectedAccount.scopes;
    switch(connectedAccount.provider){
        case _types.ConnectedAccountProvider.GOOGLE:
            {
                const hasScope = (0, _utils.isDefined)(scopes) && scopes.includes(GOOGLE_CALENDAR_EVENTS_SCOPE);
                return hasScope ? [] : [
                    GOOGLE_CALENDAR_EVENTS_SCOPE
                ];
            }
        case _types.ConnectedAccountProvider.MICROSOFT:
            {
                const hasScope = (0, _utils.isDefined)(scopes) && scopes.includes(MICROSOFT_CALENDARS_READ_WRITE_SCOPE);
                return hasScope ? [] : [
                    MICROSOFT_CALENDARS_READ_WRITE_SCOPE
                ];
            }
        // Non-OAuth providers do not rely on OAuth scopes to create events.
        case _types.ConnectedAccountProvider.IMAP_SMTP_CALDAV:
        case _types.ConnectedAccountProvider.EMAIL_GROUP:
        case _types.ConnectedAccountProvider.APP:
        case _types.ConnectedAccountProvider.OIDC:
        case _types.ConnectedAccountProvider.SAML:
            return [];
        default:
            return (0, _utils.assertUnreachable)(connectedAccount.provider, `Unhandled connected account provider for create event scopes: ${connectedAccount.provider}`);
    }
};

//# sourceMappingURL=get-missing-create-event-scopes.util.js.map
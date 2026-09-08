"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getMissingDraftEmailScopes", {
    enumerable: true,
    get: function() {
        return getMissingDraftEmailScopes;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const GMAIL_COMPOSE_SCOPE = 'https://www.googleapis.com/auth/gmail.compose';
const MICROSOFT_SEND_SCOPE = 'Mail.Send';
const getMissingDraftEmailScopes = (connectedAccount)=>{
    const scopes = connectedAccount.scopes;
    switch(connectedAccount.provider){
        case _types.ConnectedAccountProvider.GOOGLE:
            {
                const hasScope = (0, _utils.isDefined)(scopes) && scopes.includes(GMAIL_COMPOSE_SCOPE);
                return hasScope ? [] : [
                    GMAIL_COMPOSE_SCOPE
                ];
            }
        case _types.ConnectedAccountProvider.MICROSOFT:
            {
                const hasScope = (0, _utils.isDefined)(scopes) && scopes.includes(MICROSOFT_SEND_SCOPE);
                return hasScope ? [] : [
                    MICROSOFT_SEND_SCOPE
                ];
            }
        // Non-OAuth providers do not rely on OAuth scopes to draft emails.
        case _types.ConnectedAccountProvider.IMAP_SMTP_CALDAV:
        case _types.ConnectedAccountProvider.EMAIL_GROUP:
        case _types.ConnectedAccountProvider.APP:
        case _types.ConnectedAccountProvider.OIDC:
        case _types.ConnectedAccountProvider.SAML:
            return [];
        default:
            return (0, _utils.assertUnreachable)(connectedAccount.provider, `Unhandled connected account provider for draft email scopes: ${connectedAccount.provider}`);
    }
};

//# sourceMappingURL=get-missing-draft-email-scopes.util.js.map
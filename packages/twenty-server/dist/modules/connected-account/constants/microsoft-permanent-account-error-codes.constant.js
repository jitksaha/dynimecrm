// dead/unlicensed/on-premise mailbox/calendar (yes MS returns same codes for calendar don't ask why)
// @see https://learn.microsoft.com/en-us/exchange/client-developer/web-service-reference/responsecode
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MICROSOFT_PERMANENT_ACCOUNT_ERROR_CODES", {
    enumerable: true,
    get: function() {
        return MICROSOFT_PERMANENT_ACCOUNT_ERROR_CODES;
    }
});
const MICROSOFT_PERMANENT_ACCOUNT_ERROR_CODES = [
    'MailboxNotEnabledForRESTAPI',
    'MailboxNotSupportedForRESTAPI',
    'RESTAPINotEnabledForComponentSharedMailbox',
    'ErrorInvalidLicense',
    'ErrorNonExistentMailbox',
    'ErrorAccountDisabled',
    'ErrorOrganizationAccessBlocked'
];

//# sourceMappingURL=microsoft-permanent-account-error-codes.constant.js.map
/**
 * @see https://developers.google.com/identity/protocols/oauth2/web-server#authorization-errors
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GOOGLE_PERMANENT_OAUTH_ERROR_CODES", {
    enumerable: true,
    get: function() {
        return GOOGLE_PERMANENT_OAUTH_ERROR_CODES;
    }
});
const GOOGLE_PERMANENT_OAUTH_ERROR_CODES = new Set([
    'invalid_grant',
    'invalid_client',
    'unauthorized_client',
    'unsupported_grant_type',
    'invalid_scope',
    'admin_policy_enforced',
    'policy_enforced'
]);

//# sourceMappingURL=google-permanent-oauth-error-codes.constant.js.map
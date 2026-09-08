"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "IMPERSONATION_DENIAL_BY_REASON", {
    enumerable: true,
    get: function() {
        return IMPERSONATION_DENIAL_BY_REASON;
    }
});
const _authexception = require("../../auth/auth.exception");
const IMPERSONATION_DENIAL_BY_REASON = {
    SERVER_LEVEL_NOT_ALLOWED: {
        message: 'Server level impersonation not allowed',
        exceptionCode: _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION,
        userFriendlyMessage: /*i18n*/ {
            id: "OUDI/C",
            message: "Server-level impersonation is not enabled for this user or workspace."
        }
    },
    SERVER_LEVEL_2FA_PROVISION_REQUIRED: {
        message: 'Two-factor authentication is required for server-level impersonation. Please enable 2FA in your workspace settings before attempting to impersonate users.',
        exceptionCode: _authexception.AuthExceptionCode.TWO_FACTOR_AUTHENTICATION_PROVISION_REQUIRED,
        userFriendlyMessage: /*i18n*/ {
            id: "U1u0hG",
            message: "Set up two-factor authentication before impersonating users in another workspace."
        }
    },
    SERVER_LEVEL_2FA_VERIFICATION_REQUIRED: {
        message: 'Two-factor authentication is required for server-level impersonation. Please verify your 2FA method before attempting to impersonate users.',
        exceptionCode: _authexception.AuthExceptionCode.TWO_FACTOR_AUTHENTICATION_VERIFICATION_REQUIRED,
        userFriendlyMessage: /*i18n*/ {
            id: "NzhR7p",
            message: "Verify your two-factor authentication before impersonating users in another workspace."
        }
    },
    WORKSPACE_LEVEL_NOT_ALLOWED: {
        message: 'Impersonation not allowed',
        exceptionCode: _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION,
        userFriendlyMessage: /*i18n*/ {
            id: "+wZ6RO",
            message: "You do not have permission to impersonate users in this workspace."
        }
    },
    TARGET_HAS_ADMIN_PRIVILEGES: {
        message: 'Cannot impersonate a user with admin privileges. Only administrators can impersonate other administrators.',
        exceptionCode: _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION,
        userFriendlyMessage: /*i18n*/ {
            id: "NYONBC",
            message: "Only administrators can impersonate users with admin privileges."
        }
    }
};

//# sourceMappingURL=impersonation-denial-by-reason.constant.js.map
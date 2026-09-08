"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "IMPERSONATION_DENIAL_LOG_MESSAGE_BY_REASON", {
    enumerable: true,
    get: function() {
        return IMPERSONATION_DENIAL_LOG_MESSAGE_BY_REASON;
    }
});
const IMPERSONATION_DENIAL_LOG_MESSAGE_BY_REASON = {
    SERVER_LEVEL_NOT_ALLOWED: ({ targetUserEmail, impersonatorUserId })=>`Server level impersonation not allowed for ${targetUserEmail} by userId ${impersonatorUserId}`,
    SERVER_LEVEL_2FA_PROVISION_REQUIRED: ({ targetUserEmail, impersonatorUserId })=>`Server level impersonation denied (2FA provisioning required) for ${targetUserEmail} by userId ${impersonatorUserId}`,
    SERVER_LEVEL_2FA_VERIFICATION_REQUIRED: ({ targetUserEmail, impersonatorUserId })=>`Server level impersonation denied (2FA verification required) for ${targetUserEmail} by userId ${impersonatorUserId}`,
    WORKSPACE_LEVEL_NOT_ALLOWED: ({ targetUserEmail, impersonatorUserId })=>`Impersonation not allowed for ${targetUserEmail} by userId ${impersonatorUserId}`,
    TARGET_HAS_ADMIN_PRIVILEGES: ({ targetUserEmail, impersonatorUserId })=>`Impersonation of admin user ${targetUserEmail} denied for non-admin userId ${impersonatorUserId}`
};

//# sourceMappingURL=impersonation-denial-log-message-by-reason.constant.js.map
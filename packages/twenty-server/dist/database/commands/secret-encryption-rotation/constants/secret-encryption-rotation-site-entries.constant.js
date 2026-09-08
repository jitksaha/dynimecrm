"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get SECRET_ENCRYPTION_ROTATION_SITE_ENTRIES () {
        return SECRET_ENCRYPTION_ROTATION_SITE_ENTRIES;
    },
    get SECRET_ENCRYPTION_ROTATION_UNTYPED_SITE_ENTRIES () {
        return SECRET_ENCRYPTION_ROTATION_UNTYPED_SITE_ENTRIES;
    }
});
const _connectionparametersrotationhandler = require("../handlers/connection-parameters-rotation.handler");
const _sensitiveconfigstoragerotationhandler = require("../handlers/sensitive-config-storage-rotation.handler");
const _applicationregistrationvariableentity = require("../../../../engine/core-modules/application/application-registration-variable/application-registration-variable.entity");
const _applicationvariableentity = require("../../../../engine/core-modules/application/application-variable/application-variable.entity");
const _signingkeyentity = require("../../../../engine/core-modules/jwt/entities/signing-key.entity");
const _twofactorauthenticationmethodentity = require("../../../../engine/core-modules/two-factor-authentication/entities/two-factor-authentication-method.entity");
const _connectedaccountentity = require("../../../../engine/metadata-modules/connected-account/entities/connected-account.entity");
const defineRotationRegistry = (registry)=>registry;
const SECRET_ENCRYPTION_ROTATION_SITE_ENTRIES = defineRotationRegistry({
    ApplicationRegistrationVariableEntity: {
        entity: _applicationregistrationvariableentity.ApplicationRegistrationVariableEntity,
        columnSiteNames: {
            encryptedValue: {
                siteName: 'application-registration-variable',
                customHandler: undefined,
                isWorkspaceScoped: false,
                extraWhere: undefined
            }
        }
    },
    ApplicationVariableEntity: {
        entity: _applicationvariableentity.ApplicationVariableEntity,
        columnSiteNames: {
            value: {
                siteName: 'application-variable',
                customHandler: undefined,
                isWorkspaceScoped: true,
                extraWhere: undefined
            }
        }
    },
    ConnectedAccountEntity: {
        entity: _connectedaccountentity.ConnectedAccountEntity,
        columnSiteNames: {
            accessToken: {
                siteName: 'connected-account-access-token',
                customHandler: undefined,
                isWorkspaceScoped: true,
                extraWhere: undefined
            },
            refreshToken: {
                siteName: 'connected-account-refresh-token',
                customHandler: undefined,
                isWorkspaceScoped: true,
                extraWhere: undefined
            },
            connectionParameters: {
                siteName: 'connected-account-connection-parameters',
                customHandler: _connectionparametersrotationhandler.ConnectionParametersRotationHandler,
                isWorkspaceScoped: false,
                extraWhere: undefined
            }
        }
    },
    SigningKeyEntity: {
        entity: _signingkeyentity.SigningKeyEntity,
        columnSiteNames: {
            privateKey: {
                siteName: 'signing-key-private-key',
                customHandler: undefined,
                isWorkspaceScoped: false,
                extraWhere: undefined
            }
        }
    },
    TwoFactorAuthenticationMethodEntity: {
        entity: _twofactorauthenticationmethodentity.TwoFactorAuthenticationMethodEntity,
        columnSiteNames: {
            secret: {
                siteName: 'totp-secret',
                customHandler: undefined,
                isWorkspaceScoped: true,
                extraWhere: undefined
            }
        }
    }
});
const SECRET_ENCRYPTION_ROTATION_UNTYPED_SITE_ENTRIES = {
    SENSITIVE_CONFIG_STORAGE: {
        siteName: 'sensitive-config-storage',
        handler: _sensitiveconfigstoragerotationhandler.SensitiveConfigStorageRotationHandler
    }
};

//# sourceMappingURL=secret-encryption-rotation-site-entries.constant.js.map
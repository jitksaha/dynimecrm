"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ImpersonationAuthorizationService", {
    enumerable: true,
    get: function() {
        return ImpersonationAuthorizationService;
    }
});
const _common = require("@nestjs/common");
const _constants = require("twenty-shared/constants");
const _utils = require("twenty-shared/utils");
const _userhasadminprivilegesutil = require("../utils/user-has-admin-privileges.util");
const _nodeenvironmentinterface = require("../../twenty-config/interfaces/node-environment.interface");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
const _twofactorauthenticationvalidation = require("../../two-factor-authentication/two-factor-authentication.validation");
const _permissionsservice = require("../../../metadata-modules/permissions/permissions.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ImpersonationAuthorizationService = class ImpersonationAuthorizationService {
    getImpersonationLevel(impersonatorUserWorkspace, targetUserWorkspace) {
        return targetUserWorkspace.workspace.id !== impersonatorUserWorkspace.workspace.id ? 'server' : 'workspace';
    }
    async checkImpersonationAuthorization(impersonatorUserWorkspace, targetUserWorkspace) {
        const level = this.getImpersonationLevel(impersonatorUserWorkspace, targetUserWorkspace);
        if (level === 'server') {
            const hasServerLevelImpersonatePermission = impersonatorUserWorkspace.user.canImpersonate === true && targetUserWorkspace.workspace.allowImpersonation === true;
            if (!hasServerLevelImpersonatePermission) {
                return {
                    allowed: false,
                    level,
                    reason: 'SERVER_LEVEL_NOT_ALLOWED'
                };
            }
            if (this.isTwoFactorRequiredForServerLevelImpersonation()) {
                const twoFactorDenialReason = this.getServerLevelTwoFactorDenialReason(impersonatorUserWorkspace);
                if ((0, _utils.isDefined)(twoFactorDenialReason)) {
                    return {
                        allowed: false,
                        level,
                        reason: twoFactorDenialReason
                    };
                }
            }
            return {
                allowed: true,
                level
            };
        }
        const hasWorkspaceLevelImpersonatePermission = await this.permissionsService.userHasWorkspaceSettingPermission({
            userWorkspaceId: impersonatorUserWorkspace.id,
            setting: _constants.PermissionFlagType.IMPERSONATE,
            workspaceId: targetUserWorkspace.workspace.id
        });
        if (!hasWorkspaceLevelImpersonatePermission) {
            return {
                allowed: false,
                level,
                reason: 'WORKSPACE_LEVEL_NOT_ALLOWED'
            };
        }
        if ((0, _userhasadminprivilegesutil.userHasAdminPrivileges)(targetUserWorkspace.user) && !(0, _userhasadminprivilegesutil.userHasAdminPrivileges)(impersonatorUserWorkspace.user)) {
            return {
                allowed: false,
                level,
                reason: 'TARGET_HAS_ADMIN_PRIVILEGES'
            };
        }
        return {
            allowed: true,
            level
        };
    }
    isTwoFactorRequiredForServerLevelImpersonation() {
        return this.twentyConfigService.get('NODE_ENV') !== _nodeenvironmentinterface.NodeEnvironment.DEVELOPMENT;
    }
    getServerLevelTwoFactorDenialReason(impersonatorUserWorkspace) {
        const twoFactorAuthenticationMethods = impersonatorUserWorkspace.twoFactorAuthenticationMethods;
        if (!_twofactorauthenticationvalidation.twoFactorAuthenticationMethodsValidator.areDefined(twoFactorAuthenticationMethods)) {
            return 'SERVER_LEVEL_2FA_PROVISION_REQUIRED';
        }
        if (!_twofactorauthenticationvalidation.twoFactorAuthenticationMethodsValidator.areVerified(twoFactorAuthenticationMethods)) {
            return 'SERVER_LEVEL_2FA_VERIFICATION_REQUIRED';
        }
        return undefined;
    }
    constructor(permissionsService, twentyConfigService){
        this.permissionsService = permissionsService;
        this.twentyConfigService = twentyConfigService;
    }
};
ImpersonationAuthorizationService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _permissionsservice.PermissionsService === "undefined" ? Object : _permissionsservice.PermissionsService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], ImpersonationAuthorizationService);

//# sourceMappingURL=impersonation-authorization.service.js.map
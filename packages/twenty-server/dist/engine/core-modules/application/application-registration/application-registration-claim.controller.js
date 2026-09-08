"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationRegistrationClaimController", {
    enumerable: true,
    get: function() {
        return ApplicationRegistrationClaimController;
    }
});
const _common = require("@nestjs/common");
const _express = require("express");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _applicationregistrationclaimservice = require("./application-registration-claim.service");
const _applicationregistrationexception = require("./application-registration.exception");
const _customexception = require("../../../../utils/custom-exception");
const _workspacedomainsservice = require("../../domain/workspace-domains/services/workspace-domains.service");
const _guardredirectservice = require("../../guard-redirect/services/guard-redirect.service");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
const _nopermissionguard = require("../../../guards/no-permission.guard");
const _publicendpointguard = require("../../../guards/public-endpoint.guard");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let ApplicationRegistrationClaimController = class ApplicationRegistrationClaimController {
    async githubCallback(code, state, oauthError, res) {
        let workspace = null;
        try {
            const statePayload = await this.applicationRegistrationClaimService.verifyClaimState(state ?? '');
            workspace = await this.applicationRegistrationClaimService.findWorkspaceById(statePayload.workspaceId);
            if (oauthError !== undefined || code === undefined) {
                throw new _applicationregistrationexception.ApplicationRegistrationException('GitHub authorization was denied', _applicationregistrationexception.ApplicationRegistrationExceptionCode.GITHUB_AUTH_FAILED);
            }
            await this.applicationRegistrationClaimService.completeGithubClaim({
                statePayload,
                code
            });
            if (workspace === null) {
                throw new Error('Workspace not found');
            }
            const url = this.workspaceDomainsService.buildWorkspaceURL({
                workspace,
                pathname: (0, _utils.getSettingsPath)(_types.SettingsPath.Applications)
            });
            url.hash = 'developer';
            return res.redirect(url.toString());
        } catch (error) {
            const claimErrorCode = error instanceof _customexception.CustomException ? error.code : 'CLAIM_FAILED';
            if (workspace !== null) {
                const url = this.workspaceDomainsService.buildWorkspaceURL({
                    workspace,
                    pathname: (0, _utils.getSettingsPath)(_types.SettingsPath.Applications)
                });
                url.searchParams.set('claimErrorCode', claimErrorCode);
                url.hash = 'developer';
                return res.redirect(url.toString());
            }
            return res.redirect(this.guardRedirectService.getRedirectErrorUrlAndCaptureExceptions({
                error,
                workspace: {
                    subdomain: this.twentyConfigService.get('DEFAULT_SUBDOMAIN'),
                    customDomain: null
                },
                pathname: (0, _utils.getSettingsPath)(_types.SettingsPath.Applications)
            }));
        }
    }
    constructor(applicationRegistrationClaimService, workspaceDomainsService, guardRedirectService, twentyConfigService){
        this.applicationRegistrationClaimService = applicationRegistrationClaimService;
        this.workspaceDomainsService = workspaceDomainsService;
        this.guardRedirectService = guardRedirectService;
        this.twentyConfigService = twentyConfigService;
    }
};
_ts_decorate([
    (0, _common.Get)('github/callback'),
    (0, _common.UseGuards)(_publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _common.Query)('code')),
    _ts_param(1, (0, _common.Query)('state')),
    _ts_param(2, (0, _common.Query)('error')),
    _ts_param(3, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        Object,
        Object,
        typeof _express.Response === "undefined" ? Object : _express.Response
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplicationRegistrationClaimController.prototype, "githubCallback", null);
ApplicationRegistrationClaimController = _ts_decorate([
    (0, _common.Controller)(_types.ApiPath.ApplicationRegistrationClaim),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _applicationregistrationclaimservice.ApplicationRegistrationClaimService === "undefined" ? Object : _applicationregistrationclaimservice.ApplicationRegistrationClaimService,
        typeof _workspacedomainsservice.WorkspaceDomainsService === "undefined" ? Object : _workspacedomainsservice.WorkspaceDomainsService,
        typeof _guardredirectservice.GuardRedirectService === "undefined" ? Object : _guardredirectservice.GuardRedirectService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], ApplicationRegistrationClaimController);

//# sourceMappingURL=application-registration-claim.controller.js.map
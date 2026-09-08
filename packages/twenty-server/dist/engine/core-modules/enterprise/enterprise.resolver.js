/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EnterpriseResolver", {
    enumerable: true,
    get: function() {
        return EnterpriseResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _utils = require("twenty-shared/utils");
const _enterpriselicenseinfodto = require("./dtos/enterprise-license-info.dto");
const _enterprisesubscriptionstatusdto = require("./dtos/enterprise-subscription-status.dto");
const _enterpriseexceptionfilter = require("./enterprise-exception.filter");
const _enterpriseexception = require("./enterprise.exception");
const _enterpriseplanservice = require("./services/enterprise-plan.service");
const _preventnesttoautologgraphqlerrorsfilter = require("../graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter");
const _resolvervalidationpipe = require("../graphql/pipes/resolver-validation.pipe");
const _twentyconfigexception = require("../twenty-config/twenty-config.exception");
const _adminpanelguard = require("../../guards/admin-panel-guard");
const _billingdisabledguard = require("../../guards/billing-disabled.guard");
const _nopermissionguard = require("../../guards/no-permission.guard");
const _workspaceauthguard = require("../../guards/workspace-auth.guard");
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
// Server-binding rejections that should surface as an activation failure with
// their own user-facing message (rather than being silently swallowed).
const SERVER_BINDING_REJECTION_CODES = [
    _enterpriseexception.EnterpriseExceptionCode.ENTERPRISE_KEY_BOUND_TO_ANOTHER_SERVER,
    _enterpriseexception.EnterpriseExceptionCode.ENTERPRISE_MISSING_SERVER_ID,
    _enterpriseexception.EnterpriseExceptionCode.ENTERPRISE_DEV_REQUIRES_ACTIVE_PRODUCTION,
    _enterpriseexception.EnterpriseExceptionCode.ENTERPRISE_DEV_SLOT_IN_USE
];
let EnterpriseResolver = class EnterpriseResolver {
    // Turn a server-binding rejection from the last refresh into a user-facing
    // error, so activation and manual refresh surface the real reason instead of
    // silently failing.
    throwIfServerBindingRejected() {
        const rejectionCode = this.enterprisePlanService.getLastRefreshRejectionCode();
        if ((0, _utils.isDefined)(rejectionCode) && SERVER_BINDING_REJECTION_CODES.includes(rejectionCode)) {
            throw new _enterpriseexception.EnterpriseException(`Enterprise key rejected: ${rejectionCode}`, rejectionCode);
        }
    }
    async enterprisePortalSession(// for existing subscriptions
    returnUrlPath) {
        return this.enterprisePlanService.getPortalUrl(returnUrlPath ?? undefined);
    }
    async enterpriseCheckoutSession(// for new subscriptions
    billingInterval) {
        const interval = billingInterval === 'yearly' ? 'yearly' : 'monthly';
        const seatCount = await this.enterprisePlanService.getBillableSeatCount();
        return this.enterprisePlanService.getCheckoutUrl(interval, seatCount);
    }
    async enterpriseSubscriptionStatus() {
        return this.enterprisePlanService.getSubscriptionStatus();
    }
    async refreshEnterpriseValidityToken() {
        const refreshed = await this.enterprisePlanService.refreshValidityToken();
        this.throwIfServerBindingRejected();
        return refreshed;
    }
    async releaseEnterpriseServerBinding() {
        await this.enterprisePlanService.releaseServerBinding();
        await this.enterprisePlanService.refreshValidityToken();
        const seatCount = await this.enterprisePlanService.getBillableSeatCount();
        await this.enterprisePlanService.reportSeats(seatCount);
        return this.enterprisePlanService.getLicenseInfo();
    }
    async setEnterpriseKey(enterpriseKey) {
        try {
            if (!this.enterprisePlanService.isValidEnterpriseKeyFormat(enterpriseKey)) {
                throw new _enterpriseexception.EnterpriseException('Invalid enterprise key', _enterpriseexception.EnterpriseExceptionCode.INVALID_ENTERPRISE_KEY);
            }
            await this.enterprisePlanService.setEnterpriseKey(enterpriseKey);
            await this.enterprisePlanService.refreshValidityToken();
            this.throwIfServerBindingRejected();
            const seatCount = await this.enterprisePlanService.getBillableSeatCount();
            await this.enterprisePlanService.reportSeats(seatCount);
            return await this.enterprisePlanService.getLicenseInfo();
        } catch (error) {
            if (error instanceof _enterpriseexception.EnterpriseException) {
                throw error;
            }
            if (error instanceof Error && 'code' in error && error.code === _twentyconfigexception.ConfigVariableExceptionCode.DATABASE_CONFIG_DISABLED) {
                throw new _enterpriseexception.EnterpriseException('IS_CONFIG_VARIABLES_IN_DB_ENABLED is false on the server. Please add ENTERPRISE_KEY to your .env file manually.', _enterpriseexception.EnterpriseExceptionCode.CONFIG_VARIABLES_IN_DB_DISABLED);
            }
            return {
                isValid: false,
                licensee: null,
                expiresAt: null,
                subscriptionId: null
            };
        }
    }
    constructor(enterprisePlanService){
        this.enterprisePlanService = enterprisePlanService;
    }
};
_ts_decorate([
    (0, _graphql.Query)(()=>String, {
        nullable: true
    }),
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, _billingdisabledguard.BillingDisabledGuard, _adminpanelguard.AdminPanelGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _graphql.Args)('returnUrlPath', {
        nullable: true
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], EnterpriseResolver.prototype, "enterprisePortalSession", null);
_ts_decorate([
    (0, _graphql.Query)(()=>String, {
        nullable: true
    }),
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, _billingdisabledguard.BillingDisabledGuard, _adminpanelguard.AdminPanelGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _graphql.Args)('billingInterval', {
        nullable: true
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], EnterpriseResolver.prototype, "enterpriseCheckoutSession", null);
_ts_decorate([
    (0, _graphql.Query)(()=>_enterprisesubscriptionstatusdto.EnterpriseSubscriptionStatusDTO, {
        nullable: true
    }),
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, _billingdisabledguard.BillingDisabledGuard, _adminpanelguard.AdminPanelGuard, _nopermissionguard.NoPermissionGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], EnterpriseResolver.prototype, "enterpriseSubscriptionStatus", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>Boolean),
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, _billingdisabledguard.BillingDisabledGuard, _adminpanelguard.AdminPanelGuard, _nopermissionguard.NoPermissionGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], EnterpriseResolver.prototype, "refreshEnterpriseValidityToken", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_enterpriselicenseinfodto.EnterpriseLicenseInfoDTO),
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, _billingdisabledguard.BillingDisabledGuard, _adminpanelguard.AdminPanelGuard, _nopermissionguard.NoPermissionGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], EnterpriseResolver.prototype, "releaseEnterpriseServerBinding", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_enterpriselicenseinfodto.EnterpriseLicenseInfoDTO),
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, _billingdisabledguard.BillingDisabledGuard, _adminpanelguard.AdminPanelGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _graphql.Args)('enterpriseKey')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], EnterpriseResolver.prototype, "setEnterpriseKey", null);
EnterpriseResolver = _ts_decorate([
    (0, _graphql.Resolver)(),
    (0, _common.UsePipes)(_resolvervalidationpipe.ResolverValidationPipe),
    (0, _common.UseFilters)(_enterpriseexceptionfilter.EnterpriseExceptionFilter, _preventnesttoautologgraphqlerrorsfilter.PreventNestToAutoLogGraphqlErrorsFilter),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _enterpriseplanservice.EnterprisePlanService === "undefined" ? Object : _enterpriseplanservice.EnterprisePlanService
    ])
], EnterpriseResolver);

//# sourceMappingURL=enterprise.resolver.js.map
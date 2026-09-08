"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmailingDomainResolver", {
    enumerable: true,
    get: function() {
        return EmailingDomainResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _constants = require("twenty-shared/constants");
const _types = require("twenty-shared/types");
const _metadataresolverdecorator = require("../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _createemailingdomaininput = require("./dtos/create-emailing-domain.input");
const _emailingdomaindto = require("./dtos/emailing-domain.dto");
const _emailgroupaccessgraphqlapiexceptionfilter = require("./filters/email-group-access-graphql-api-exception.filter");
const _emailingdomaingraphqlapiexceptionfilter = require("./filters/emailing-domain-graphql-api-exception.filter");
const _emailgroupaccessservice = require("./services/email-group-access.service");
const _emailingdomainservice = require("./services/emailing-domain.service");
const _resolvervalidationpipe = require("../graphql/pipes/resolver-validation.pipe");
const _workspaceentity = require("../workspace/workspace.entity");
const _authworkspacedecorator = require("../../decorators/auth/auth-workspace.decorator");
const _featureflagguard = require("../../guards/feature-flag.guard");
const _settingspermissionguard = require("../../guards/settings-permission.guard");
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
let EmailingDomainResolver = class EmailingDomainResolver {
    async createEmailingDomain(input, currentWorkspace) {
        this.emailGroupAccessService.validateEmailGroupAccessOrThrow();
        const emailingDomain = await this.emailingDomainService.createEmailingDomain(input.domain.trim().toLowerCase(), currentWorkspace.id);
        return emailingDomain;
    }
    async deleteEmailingDomain(id, currentWorkspace) {
        this.emailGroupAccessService.validateEmailGroupAccessOrThrow();
        await this.emailingDomainService.deleteEmailingDomain(currentWorkspace, id);
        return true;
    }
    async verifyEmailingDomain(id, currentWorkspace) {
        this.emailGroupAccessService.validateEmailGroupAccessOrThrow();
        const emailingDomain = await this.emailingDomainService.verifyEmailingDomain({
            workspaceId: currentWorkspace.id,
            emailingDomainId: id
        });
        return emailingDomain;
    }
    async getEmailingDomains(currentWorkspace) {
        this.emailGroupAccessService.validateEmailGroupAccessOrThrow();
        const emailingDomains = await this.emailingDomainService.getEmailingDomains(currentWorkspace);
        return emailingDomains;
    }
    constructor(emailingDomainService, emailGroupAccessService){
        this.emailingDomainService = emailingDomainService;
        this.emailGroupAccessService = emailGroupAccessService;
    }
};
_ts_decorate([
    (0, _graphql.Mutation)(()=>_emailingdomaindto.EmailingDomainDTO),
    (0, _featureflagguard.RequireFeatureFlag)(_types.FeatureFlagKey.IS_EMAIL_GROUP_ENABLED),
    _ts_param(0, (0, _graphql.Args)('input')),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createemailingdomaininput.CreateEmailingDomainInput === "undefined" ? Object : _createemailingdomaininput.CreateEmailingDomainInput,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], EmailingDomainResolver.prototype, "createEmailingDomain", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>Boolean),
    (0, _featureflagguard.RequireFeatureFlag)(_types.FeatureFlagKey.IS_EMAIL_GROUP_ENABLED),
    _ts_param(0, (0, _graphql.Args)('id')),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], EmailingDomainResolver.prototype, "deleteEmailingDomain", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_emailingdomaindto.EmailingDomainDTO),
    (0, _featureflagguard.RequireFeatureFlag)(_types.FeatureFlagKey.IS_EMAIL_GROUP_ENABLED),
    _ts_param(0, (0, _graphql.Args)('id')),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], EmailingDomainResolver.prototype, "verifyEmailingDomain", null);
_ts_decorate([
    (0, _graphql.Query)(()=>[
            _emailingdomaindto.EmailingDomainDTO
        ]),
    (0, _featureflagguard.RequireFeatureFlag)(_types.FeatureFlagKey.IS_EMAIL_GROUP_ENABLED),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], EmailingDomainResolver.prototype, "getEmailingDomains", null);
EmailingDomainResolver = _ts_decorate([
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, _featureflagguard.FeatureFlagGuard, (0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.WORKSPACE)),
    (0, _common.UseFilters)(_emailgroupaccessgraphqlapiexceptionfilter.EmailGroupAccessGraphqlApiExceptionFilter, _emailingdomaingraphqlapiexceptionfilter.EmailingDomainGraphqlApiExceptionFilter),
    (0, _common.UsePipes)(_resolvervalidationpipe.ResolverValidationPipe),
    (0, _metadataresolverdecorator.MetadataResolver)(()=>_emailingdomaindto.EmailingDomainDTO),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _emailingdomainservice.EmailingDomainService === "undefined" ? Object : _emailingdomainservice.EmailingDomainService,
        typeof _emailgroupaccessservice.EmailGroupAccessService === "undefined" ? Object : _emailgroupaccessservice.EmailGroupAccessService
    ])
], EmailingDomainResolver);

//# sourceMappingURL=emailing-domain.resolver.js.map
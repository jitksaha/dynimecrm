"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CompanyEnrichmentResolver", {
    enumerable: true,
    get: function() {
        return CompanyEnrichmentResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _metadataresolverdecorator = require("../../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _workspacecompanyenrichmentresultdto = require("../dtos/workspace-company-enrichment-result.dto");
const _workspacecompanyenrichmentoutcomeenum = require("../enums/workspace-company-enrichment-outcome.enum");
const _workspacepersonenrichmentoutcomeenum = require("../enums/workspace-person-enrichment-outcome.enum");
const _companyenrichmentservice = require("../services/company-enrichment.service");
const _personenrichmentservice = require("../services/person-enrichment.service");
const _preventnesttoautologgraphqlerrorsfilter = require("../../graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter");
const _resolvervalidationpipe = require("../../graphql/pipes/resolver-validation.pipe");
const _onboardingservice = require("../../onboarding/onboarding.service");
const _workspaceentity = require("../../workspace/workspace.entity");
const _authuserdecorator = require("../../../decorators/auth/auth-user.decorator");
const _authworkspacedecorator = require("../../../decorators/auth/auth-workspace.decorator");
const _nopermissionguard = require("../../../guards/no-permission.guard");
const _userauthguard = require("../../../guards/user-auth.guard");
const _workspaceauthguard = require("../../../guards/workspace-auth.guard");
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
let CompanyEnrichmentResolver = class CompanyEnrichmentResolver {
    async enrichWorkspaceCompany(user, workspace) {
        const [enrichmentResult, personEnrichmentResult] = await Promise.all([
            this.companyEnrichmentService.enrichCompanyForWorkspaceCreator({
                userId: user.id,
                email: user.email,
                workspaceId: workspace.id
            }),
            this.personEnrichmentService.enrichPersonForWorkspaceCreator({
                userId: user.id,
                email: user.email,
                workspaceId: workspace.id
            })
        ]);
        if (enrichmentResult.outcome === 'matched') {
            // Two independent bars on the same enrichment: a company worth a demo and
            // a company worth credits are not necessarily the same company.
            await this.onboardingService.setOnboardingBookCallPendingIfQualified({
                userId: user.id,
                workspaceId: workspace.id,
                employeeCount: enrichmentResult.enrichment.employeeCount
            });
            await this.onboardingService.creditEnrichmentQualificationReward({
                workspaceId: workspace.id,
                employeeCount: enrichmentResult.enrichment.employeeCount
            });
        }
        const isBookCallOnboardingStepPending = await this.onboardingService.isOnboardingBookCallPending({
            userId: user.id,
            workspaceId: workspace.id
        });
        return {
            ...enrichmentResult,
            outcome: _workspacecompanyenrichmentoutcomeenum.WorkspaceCompanyEnrichmentOutcome[enrichmentResult.outcome],
            personOutcome: _workspacepersonenrichmentoutcomeenum.WorkspacePersonEnrichmentOutcome[personEnrichmentResult.outcome],
            personEnrichment: personEnrichmentResult.enrichment,
            isBookCallOnboardingStepPending
        };
    }
    constructor(companyEnrichmentService, personEnrichmentService, onboardingService){
        this.companyEnrichmentService = companyEnrichmentService;
        this.personEnrichmentService = personEnrichmentService;
        this.onboardingService = onboardingService;
    }
};
_ts_decorate([
    (0, _graphql.Mutation)(()=>_workspacecompanyenrichmentresultdto.WorkspaceCompanyEnrichmentResultDTO),
    (0, _common.UseGuards)(_nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _authuserdecorator.AuthUser)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthContextUser === "undefined" ? Object : AuthContextUser,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], CompanyEnrichmentResolver.prototype, "enrichWorkspaceCompany", null);
CompanyEnrichmentResolver = _ts_decorate([
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, _userauthguard.UserAuthGuard),
    (0, _common.UsePipes)(_resolvervalidationpipe.ResolverValidationPipe),
    (0, _common.UseFilters)(_preventnesttoautologgraphqlerrorsfilter.PreventNestToAutoLogGraphqlErrorsFilter),
    (0, _metadataresolverdecorator.MetadataResolver)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _companyenrichmentservice.CompanyEnrichmentService === "undefined" ? Object : _companyenrichmentservice.CompanyEnrichmentService,
        typeof _personenrichmentservice.PersonEnrichmentService === "undefined" ? Object : _personenrichmentservice.PersonEnrichmentService,
        typeof _onboardingservice.OnboardingService === "undefined" ? Object : _onboardingservice.OnboardingService
    ])
], CompanyEnrichmentResolver);

//# sourceMappingURL=company-enrichment.resolver.js.map
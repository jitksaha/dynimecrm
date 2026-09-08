"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OnboardingResolver", {
    enumerable: true,
    get: function() {
        return OnboardingResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _metadataresolverdecorator = require("../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _preventnesttoautologgraphqlerrorsfilter = require("../graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter");
const _resolvervalidationpipe = require("../graphql/pipes/resolver-validation.pipe");
const _invitesuggestiondto = require("./dtos/invite-suggestion.dto");
const _onboardingstepnavigationdto = require("./dtos/onboarding-step-navigation.dto");
const _onboardingstepsuccessdto = require("./dtos/onboarding-step-success.dto");
const _onboardingservice = require("./onboarding.service");
const _onboardinginvitesuggestionsservice = require("../../../modules/onboarding-invite-suggestions/services/onboarding-invite-suggestions.service");
const _workspaceentity = require("../workspace/workspace.entity");
const _authuserdecorator = require("../../decorators/auth/auth-user.decorator");
const _authuserworkspaceiddecorator = require("../../decorators/auth/auth-user-workspace-id.decorator");
const _authworkspacedecorator = require("../../decorators/auth/auth-workspace.decorator");
const _nopermissionguard = require("../../guards/no-permission.guard");
const _userauthguard = require("../../guards/user-auth.guard");
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
let OnboardingResolver = class OnboardingResolver {
    async getInviteSuggestions(user, workspace, userWorkspaceId) {
        return this.onboardingInviteSuggestionsService.getOrComputeSuggestions({
            workspaceId: workspace.id,
            userId: user.id,
            userWorkspaceId
        });
    }
    async skipSyncEmailOnboardingStep(user, workspace, isAutoSkipped) {
        await this.onboardingService.skipOnboardingConnectAccountStep({
            userId: user.id,
            workspaceId: workspace.id,
            isAutoSkipped
        });
        return {
            success: true
        };
    }
    async completeBookCallOnboardingStep(user, workspace, hasBookedCall, isAutoSkipped) {
        await this.onboardingService.completeOnboardingBookCallStep({
            userId: user.id,
            workspaceId: workspace.id,
            hasBookedCall,
            isAutoSkipped
        });
        return {
            success: true
        };
    }
    async triggerInstallAppsOnboardingStep(user, workspace, universalIdentifiers, isAutoSkipped) {
        await this.onboardingService.triggerInstallAppsOnboardingStep({
            userId: user.id,
            workspaceId: workspace.id,
            universalIdentifiers,
            isAutoSkipped
        });
        return {
            success: true
        };
    }
    async goBackToPreviousOnboardingStep(user, workspace) {
        return this.onboardingService.goBackToPreviousOnboardingStep({
            userId: user.id,
            workspaceId: workspace.id
        });
    }
    constructor(onboardingService, onboardingInviteSuggestionsService){
        this.onboardingService = onboardingService;
        this.onboardingInviteSuggestionsService = onboardingInviteSuggestionsService;
    }
};
_ts_decorate([
    (0, _graphql.Query)(()=>[
            _invitesuggestiondto.InviteSuggestionDTO
        ]),
    (0, _common.UseGuards)(_nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _authuserdecorator.AuthUser)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(2, (0, _authuserworkspaceiddecorator.AuthUserWorkspaceId)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthContextUser === "undefined" ? Object : AuthContextUser,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], OnboardingResolver.prototype, "getInviteSuggestions", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_onboardingstepsuccessdto.OnboardingStepSuccessDTO),
    (0, _common.UseGuards)(_nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _authuserdecorator.AuthUser)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(2, (0, _graphql.Args)({
        name: 'isAutoSkipped',
        type: ()=>Boolean,
        defaultValue: false
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthContextUser === "undefined" ? Object : AuthContextUser,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        Boolean
    ]),
    _ts_metadata("design:returntype", Promise)
], OnboardingResolver.prototype, "skipSyncEmailOnboardingStep", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_onboardingstepsuccessdto.OnboardingStepSuccessDTO),
    (0, _common.UseGuards)(_nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _authuserdecorator.AuthUser)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(2, (0, _graphql.Args)({
        name: 'hasBookedCall',
        type: ()=>Boolean,
        defaultValue: false
    })),
    _ts_param(3, (0, _graphql.Args)({
        name: 'isAutoSkipped',
        type: ()=>Boolean,
        defaultValue: false
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthContextUser === "undefined" ? Object : AuthContextUser,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        Boolean,
        Boolean
    ]),
    _ts_metadata("design:returntype", Promise)
], OnboardingResolver.prototype, "completeBookCallOnboardingStep", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_onboardingstepsuccessdto.OnboardingStepSuccessDTO),
    (0, _common.UseGuards)(_nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _authuserdecorator.AuthUser)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(2, (0, _graphql.Args)({
        name: 'universalIdentifiers',
        type: ()=>[
                String
            ]
    })),
    _ts_param(3, (0, _graphql.Args)({
        name: 'isAutoSkipped',
        type: ()=>Boolean,
        defaultValue: false
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthContextUser === "undefined" ? Object : AuthContextUser,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        Array,
        Boolean
    ]),
    _ts_metadata("design:returntype", Promise)
], OnboardingResolver.prototype, "triggerInstallAppsOnboardingStep", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_onboardingstepnavigationdto.OnboardingStepNavigationDTO),
    (0, _common.UseGuards)(_nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _authuserdecorator.AuthUser)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthContextUser === "undefined" ? Object : AuthContextUser,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], OnboardingResolver.prototype, "goBackToPreviousOnboardingStep", null);
OnboardingResolver = _ts_decorate([
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, _userauthguard.UserAuthGuard),
    (0, _common.UsePipes)(_resolvervalidationpipe.ResolverValidationPipe),
    (0, _common.UseFilters)(_preventnesttoautologgraphqlerrorsfilter.PreventNestToAutoLogGraphqlErrorsFilter),
    (0, _metadataresolverdecorator.MetadataResolver)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _onboardingservice.OnboardingService === "undefined" ? Object : _onboardingservice.OnboardingService,
        typeof _onboardinginvitesuggestionsservice.OnboardingInviteSuggestionsService === "undefined" ? Object : _onboardinginvitesuggestionsservice.OnboardingInviteSuggestionsService
    ])
], OnboardingResolver);

//# sourceMappingURL=onboarding.resolver.js.map
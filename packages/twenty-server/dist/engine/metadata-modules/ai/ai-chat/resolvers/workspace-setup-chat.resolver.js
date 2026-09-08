"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceSetupChatResolver", {
    enumerable: true,
    get: function() {
        return WorkspaceSetupChatResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _graphqltypejson = /*#__PURE__*/ _interop_require_default(require("graphql-type-json"));
const _constants = require("twenty-shared/constants");
const _metadataresolverdecorator = require("../../../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _matchworkspacepersonenrichmenttouseremailutil = require("../../../../core-modules/company-enrichment/utils/match-workspace-person-enrichment-to-user-email.util");
const _sanitizeworkspacecompanyenrichmentutil = require("../../../../core-modules/company-enrichment/utils/sanitize-workspace-company-enrichment.util");
const _sanitizeworkspacepersonenrichmentutil = require("../../../../core-modules/company-enrichment/utils/sanitize-workspace-person-enrichment.util");
const _authuserdecorator = require("../../../../decorators/auth/auth-user.decorator");
const _authuserworkspaceiddecorator = require("../../../../decorators/auth/auth-user-workspace-id.decorator");
const _authworkspacedecorator = require("../../../../decorators/auth/auth-workspace.decorator");
const _settingspermissionguard = require("../../../../guards/settings-permission.guard");
const _userauthguard = require("../../../../guards/user-auth.guard");
const _workspaceauthguard = require("../../../../guards/workspace-auth.guard");
const _startworkspacesetupchatresultdto = require("../dtos/start-workspace-setup-chat-result.dto");
const _workspacesetupchatservice = require("../services/workspace-setup-chat.service");
const _aigraphqlapiexceptioninterceptor = require("../../interceptors/ai-graphql-api-exception.interceptor");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
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
let WorkspaceSetupChatResolver = class WorkspaceSetupChatResolver {
    async startWorkspaceSetupChat(companyContext, personContext, user, userWorkspaceId, workspace) {
        return this.workspaceSetupChatService.startWorkspaceSetupChat({
            userId: user.id,
            userEmail: user.email,
            userLocale: user.locale,
            userWorkspaceId,
            workspace,
            companyContext: (0, _sanitizeworkspacecompanyenrichmentutil.sanitizeWorkspaceCompanyEnrichment)(companyContext),
            personContext: (0, _matchworkspacepersonenrichmenttouseremailutil.matchWorkspacePersonEnrichmentToUserEmail)({
                personEnrichment: (0, _sanitizeworkspacepersonenrichmentutil.sanitizeWorkspacePersonEnrichment)(personContext),
                userEmail: user.email
            })
        });
    }
    constructor(workspaceSetupChatService){
        this.workspaceSetupChatService = workspaceSetupChatService;
    }
};
_ts_decorate([
    (0, _graphql.Mutation)(()=>_startworkspacesetupchatresultdto.StartWorkspaceSetupChatResultDTO),
    _ts_param(0, (0, _graphql.Args)('companyContext', {
        type: ()=>_graphqltypejson.default,
        nullable: true
    })),
    _ts_param(1, (0, _graphql.Args)('personContext', {
        type: ()=>_graphqltypejson.default,
        nullable: true
    })),
    _ts_param(2, (0, _authuserdecorator.AuthUser)()),
    _ts_param(3, (0, _authuserworkspaceiddecorator.AuthUserWorkspaceId)()),
    _ts_param(4, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        Object,
        typeof AuthContextUser === "undefined" ? Object : AuthContextUser,
        String,
        typeof WorkspaceEntity === "undefined" ? Object : WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], WorkspaceSetupChatResolver.prototype, "startWorkspaceSetupChat", null);
WorkspaceSetupChatResolver = _ts_decorate([
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, _userauthguard.UserAuthGuard, (0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.AI)),
    (0, _common.UseInterceptors)(_aigraphqlapiexceptioninterceptor.AiGraphqlApiExceptionInterceptor),
    (0, _metadataresolverdecorator.MetadataResolver)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacesetupchatservice.WorkspaceSetupChatService === "undefined" ? Object : _workspacesetupchatservice.WorkspaceSetupChatService
    ])
], WorkspaceSetupChatResolver);

//# sourceMappingURL=workspace-setup-chat.resolver.js.map
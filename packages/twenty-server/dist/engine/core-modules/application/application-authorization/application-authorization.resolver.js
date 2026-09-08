"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationAuthorizationResolver", {
    enumerable: true,
    get: function() {
        return ApplicationAuthorizationResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _metadataresolverdecorator = require("../../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _scalars = require("../../../api/graphql/workspace-schema-builder/graphql-types/scalars");
const _applicationauthorizationdto = require("./dtos/application-authorization.dto");
const _applicationauthorizationservice = require("./services/application-authorization.service");
const _authgraphqlapiexceptionfilter = require("../../auth/filters/auth-graphql-api-exception.filter");
const _utils = require("twenty-shared/utils");
const _resolvervalidationpipe = require("../../graphql/pipes/resolver-validation.pipe");
const _authuserdecorator = require("../../../decorators/auth/auth-user.decorator");
const _authworkspacedecorator = require("../../../decorators/auth/auth-workspace.decorator");
const _nopermissionguard = require("../../../guards/no-permission.guard");
const _userauthguard = require("../../../guards/user-auth.guard");
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
let ApplicationAuthorizationResolver = class ApplicationAuthorizationResolver {
    async currentUserApplicationAuthorizations(user, workspace) {
        // UserAuthGuard admits workspace-agnostic credentials, which have no
        // workspace to scope to. Nothing is in scope rather than everything.
        if (!(0, _utils.isDefined)(workspace)) {
            return [];
        }
        const authorizations = await this.applicationAuthorizationService.findActiveAuthorizationsForUserWorkspace({
            userId: user.id,
            workspaceId: workspace.id
        });
        return authorizations.map((authorization)=>this.toApplicationAuthorizationDTO(authorization));
    }
    async revokeApplicationAuthorization(user, workspace, applicationAuthorizationId) {
        if (!(0, _utils.isDefined)(workspace)) {
            return false;
        }
        return await this.applicationAuthorizationService.revokeAuthorizationByIdForUserWorkspace({
            authorizationId: applicationAuthorizationId,
            userId: user.id,
            workspaceId: workspace.id
        });
    }
    toApplicationAuthorizationDTO(authorization) {
        return {
            id: authorization.id,
            applicationId: authorization.applicationId,
            workspaceId: authorization.workspaceId,
            applicationName: authorization.application.name,
            applicationUniversalIdentifier: authorization.application.universalIdentifier,
            scopes: authorization.scopes,
            lastAuthorizedAt: authorization.lastAuthorizedAt,
            lastUsedAt: authorization.lastUsedAt,
            createdAt: authorization.createdAt
        };
    }
    constructor(applicationAuthorizationService){
        this.applicationAuthorizationService = applicationAuthorizationService;
    }
};
_ts_decorate([
    (0, _graphql.Query)(()=>[
            _applicationauthorizationdto.ApplicationAuthorizationDTO
        ]),
    (0, _common.UseGuards)(_userauthguard.UserAuthGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _authuserdecorator.AuthUser)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)({
        allowUndefined: true
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthContextUser === "undefined" ? Object : AuthContextUser,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplicationAuthorizationResolver.prototype, "currentUserApplicationAuthorizations", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>Boolean),
    (0, _common.UseGuards)(_userauthguard.UserAuthGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _authuserdecorator.AuthUser)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)({
        allowUndefined: true
    })),
    _ts_param(2, (0, _graphql.Args)('applicationAuthorizationId', {
        type: ()=>_scalars.UUIDScalarType
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthContextUser === "undefined" ? Object : AuthContextUser,
        Object,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplicationAuthorizationResolver.prototype, "revokeApplicationAuthorization", null);
ApplicationAuthorizationResolver = _ts_decorate([
    (0, _common.UsePipes)(_resolvervalidationpipe.ResolverValidationPipe),
    (0, _common.UseFilters)(_authgraphqlapiexceptionfilter.AuthGraphqlApiExceptionFilter),
    (0, _metadataresolverdecorator.MetadataResolver)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _applicationauthorizationservice.ApplicationAuthorizationService === "undefined" ? Object : _applicationauthorizationservice.ApplicationAuthorizationService
    ])
], ApplicationAuthorizationResolver);

//# sourceMappingURL=application-authorization.resolver.js.map
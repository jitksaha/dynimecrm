"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationConnectionsResolver", {
    enumerable: true,
    get: function() {
        return ApplicationConnectionsResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _metadataresolverdecorator = require("../../../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _appconnectionobject = require("./dtos/app-connection.object");
const _listappconnectionsinput = require("./dtos/list-app-connections.input");
const _applicationconnectionslistservice = require("./services/application-connections-list.service");
const _authapplicationdecorator = require("../../../../decorators/auth/auth-application.decorator");
const _authuserworkspaceiddecorator = require("../../../../decorators/auth/auth-user-workspace-id.decorator");
const _authworkspacedecorator = require("../../../../decorators/auth/auth-workspace.decorator");
const _nopermissionguard = require("../../../../guards/no-permission.guard");
const _workspaceauthguard = require("../../../../guards/workspace-auth.guard");
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
let ApplicationConnectionsResolver = class ApplicationConnectionsResolver {
    async appConnections(application, workspace, userWorkspaceId, filter) {
        return this.listService.list({
            applicationId: application.id,
            workspaceId: workspace.id,
            requestUserWorkspaceId: userWorkspaceId ?? null,
            filter: filter ?? {}
        });
    }
    async appConnection(application, workspace, userWorkspaceId, id) {
        return this.listService.getOne({
            applicationId: application.id,
            workspaceId: workspace.id,
            requestUserWorkspaceId: userWorkspaceId ?? null,
            id
        });
    }
    constructor(listService){
        this.listService = listService;
    }
};
_ts_decorate([
    (0, _graphql.Query)(()=>[
            _appconnectionobject.AppConnectionObjectDto
        ]),
    _ts_param(0, (0, _authapplicationdecorator.AuthApplication)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(2, (0, _authuserworkspaceiddecorator.AuthUserWorkspaceId)({
        allowUndefined: true
    })),
    _ts_param(3, (0, _graphql.Args)('filter', {
        nullable: true
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof FlatApplication === "undefined" ? Object : FlatApplication,
        typeof FlatWorkspace === "undefined" ? Object : FlatWorkspace,
        Object,
        typeof _listappconnectionsinput.ListAppConnectionsInput === "undefined" ? Object : _listappconnectionsinput.ListAppConnectionsInput
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplicationConnectionsResolver.prototype, "appConnections", null);
_ts_decorate([
    (0, _graphql.Query)(()=>_appconnectionobject.AppConnectionObjectDto),
    _ts_param(0, (0, _authapplicationdecorator.AuthApplication)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(2, (0, _authuserworkspaceiddecorator.AuthUserWorkspaceId)({
        allowUndefined: true
    })),
    _ts_param(3, (0, _graphql.Args)('id', {
        type: ()=>_graphql.ID
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof FlatApplication === "undefined" ? Object : FlatApplication,
        typeof FlatWorkspace === "undefined" ? Object : FlatWorkspace,
        Object,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplicationConnectionsResolver.prototype, "appConnection", null);
ApplicationConnectionsResolver = _ts_decorate([
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, _nopermissionguard.NoPermissionGuard),
    (0, _metadataresolverdecorator.MetadataResolver)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _applicationconnectionslistservice.ApplicationConnectionsListService === "undefined" ? Object : _applicationconnectionslistservice.ApplicationConnectionsListService
    ])
], ApplicationConnectionsResolver);

//# sourceMappingURL=application-connections.resolver.js.map
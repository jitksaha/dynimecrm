"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationKeyValueResolver", {
    enumerable: true,
    get: function() {
        return ApplicationKeyValueResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _metadataresolverdecorator = require("../../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _applicationexceptionfilter = require("../application-exception-filter");
const _appkeyvaluedto = require("./dtos/app-key-value.dto");
const _setappkeyvalueinput = require("./dtos/set-app-key-value.input");
const _appkeyvaluescopeenum = require("./enums/app-key-value-scope.enum");
const _applicationkeyvalueservice = require("./services/application-key-value.service");
const _authapplicationdecorator = require("../../../decorators/auth/auth-application.decorator");
const _authworkspacedecorator = require("../../../decorators/auth/auth-workspace.decorator");
const _nopermissionguard = require("../../../guards/no-permission.guard");
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
let ApplicationKeyValueResolver = class ApplicationKeyValueResolver {
    async appKeyValue(application, workspace, key, scope) {
        return this.applicationKeyValueService.get({
            application,
            workspaceId: workspace.id,
            key,
            scope
        });
    }
    async setAppKeyValue(application, workspace, input) {
        return this.applicationKeyValueService.set({
            application,
            workspaceId: workspace.id,
            key: input.key,
            value: input.value,
            scope: input.scope ?? _appkeyvaluescopeenum.AppKeyValueScope.WORKSPACE
        });
    }
    async deleteAppKeyValue(application, workspace, key, scope) {
        return this.applicationKeyValueService.delete({
            application,
            workspaceId: workspace.id,
            key,
            scope
        });
    }
    constructor(applicationKeyValueService){
        this.applicationKeyValueService = applicationKeyValueService;
    }
};
_ts_decorate([
    (0, _graphql.Query)(()=>_appkeyvaluedto.AppKeyValueDto, {
        nullable: true
    }),
    _ts_param(0, (0, _authapplicationdecorator.AuthApplication)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(2, (0, _graphql.Args)('key')),
    _ts_param(3, (0, _graphql.Args)('scope', {
        type: ()=>_appkeyvaluescopeenum.AppKeyValueScope,
        nullable: true,
        defaultValue: _appkeyvaluescopeenum.AppKeyValueScope.WORKSPACE
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof FlatApplication === "undefined" ? Object : FlatApplication,
        typeof FlatWorkspace === "undefined" ? Object : FlatWorkspace,
        String,
        typeof _appkeyvaluescopeenum.AppKeyValueScope === "undefined" ? Object : _appkeyvaluescopeenum.AppKeyValueScope
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplicationKeyValueResolver.prototype, "appKeyValue", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_appkeyvaluedto.AppKeyValueDto),
    _ts_param(0, (0, _authapplicationdecorator.AuthApplication)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(2, (0, _graphql.Args)('input')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof FlatApplication === "undefined" ? Object : FlatApplication,
        typeof FlatWorkspace === "undefined" ? Object : FlatWorkspace,
        typeof _setappkeyvalueinput.SetAppKeyValueInput === "undefined" ? Object : _setappkeyvalueinput.SetAppKeyValueInput
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplicationKeyValueResolver.prototype, "setAppKeyValue", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>Boolean),
    _ts_param(0, (0, _authapplicationdecorator.AuthApplication)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(2, (0, _graphql.Args)('key')),
    _ts_param(3, (0, _graphql.Args)('scope', {
        type: ()=>_appkeyvaluescopeenum.AppKeyValueScope,
        nullable: true,
        defaultValue: _appkeyvaluescopeenum.AppKeyValueScope.WORKSPACE
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof FlatApplication === "undefined" ? Object : FlatApplication,
        typeof FlatWorkspace === "undefined" ? Object : FlatWorkspace,
        String,
        typeof _appkeyvaluescopeenum.AppKeyValueScope === "undefined" ? Object : _appkeyvaluescopeenum.AppKeyValueScope
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplicationKeyValueResolver.prototype, "deleteAppKeyValue", null);
ApplicationKeyValueResolver = _ts_decorate([
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, _nopermissionguard.NoPermissionGuard),
    (0, _common.UseFilters)(_applicationexceptionfilter.ApplicationExceptionFilter),
    (0, _metadataresolverdecorator.MetadataResolver)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _applicationkeyvalueservice.ApplicationKeyValueService === "undefined" ? Object : _applicationkeyvalueservice.ApplicationKeyValueService
    ])
], ApplicationKeyValueResolver);

//# sourceMappingURL=application-key-value.resolver.js.map
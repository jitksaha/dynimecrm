"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsageLimitResolver", {
    enumerable: true,
    get: function() {
        return UsageLimitResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _constants = require("twenty-shared/constants");
const _scalars = require("../../api/graphql/workspace-schema-builder/graphql-types/scalars");
const _metadataresolverdecorator = require("../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _preventnesttoautologgraphqlerrorsfilter = require("../graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter");
const _resolvervalidationpipe = require("../graphql/pipes/resolver-validation.pipe");
const _upsertusagelimitinput = require("./dtos/upsert-usage-limit.input");
const _usagelimitgraphqlapiexceptionfilter = require("./filters/usage-limit-graphql-api-exception.filter");
const _usagelimitservice = require("./services/usage-limit.service");
const _usagelimitentity = require("./usage-limit.entity");
const _workspaceentity = require("../workspace/workspace.entity");
const _authworkspacedecorator = require("../../decorators/auth/auth-workspace.decorator");
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
let UsageLimitResolver = class UsageLimitResolver {
    async usageLimits(workspace) {
        return this.usageLimitService.findAll(workspace.id);
    }
    async upsertUsageLimit(workspace, input) {
        return this.usageLimitService.upsert({
            workspaceId: workspace.id,
            input
        });
    }
    async deleteUsageLimit(workspace, usageLimitId) {
        return this.usageLimitService.delete({
            workspaceId: workspace.id,
            usageLimitId
        });
    }
    constructor(usageLimitService){
        this.usageLimitService = usageLimitService;
    }
};
_ts_decorate([
    (0, _graphql.Query)(()=>[
            _usagelimitentity.UsageLimitEntity
        ]),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], UsageLimitResolver.prototype, "usageLimits", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_usagelimitentity.UsageLimitEntity),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(1, (0, _graphql.Args)('input')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        typeof _upsertusagelimitinput.UpsertUsageLimitInput === "undefined" ? Object : _upsertusagelimitinput.UpsertUsageLimitInput
    ]),
    _ts_metadata("design:returntype", Promise)
], UsageLimitResolver.prototype, "upsertUsageLimit", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>Boolean),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(1, (0, _graphql.Args)('usageLimitId', {
        type: ()=>_scalars.UUIDScalarType
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], UsageLimitResolver.prototype, "deleteUsageLimit", null);
UsageLimitResolver = _ts_decorate([
    (0, _metadataresolverdecorator.MetadataResolver)(()=>_usagelimitentity.UsageLimitEntity),
    (0, _common.UseFilters)(_usagelimitgraphqlapiexceptionfilter.UsageLimitGraphqlApiExceptionFilter, _preventnesttoautologgraphqlerrorsfilter.PreventNestToAutoLogGraphqlErrorsFilter),
    (0, _common.UsePipes)(_resolvervalidationpipe.ResolverValidationPipe),
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, (0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.WORKSPACE)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usagelimitservice.UsageLimitService === "undefined" ? Object : _usagelimitservice.UsageLimitService
    ])
], UsageLimitResolver);

//# sourceMappingURL=usage-limit.resolver.js.map
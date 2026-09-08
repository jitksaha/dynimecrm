"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AiWorkspaceStatsResolver", {
    enumerable: true,
    get: function() {
        return AiWorkspaceStatsResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _constants = require("twenty-shared/constants");
const _metadataresolverdecorator = require("../../../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _authuserworkspaceiddecorator = require("../../../../decorators/auth/auth-user-workspace-id.decorator");
const _authworkspacedecorator = require("../../../../decorators/auth/auth-workspace.decorator");
const _settingspermissionguard = require("../../../../guards/settings-permission.guard");
const _workspaceauthguard = require("../../../../guards/workspace-auth.guard");
const _workspaceaistatsdto = require("../dtos/workspace-ai-stats.dto");
const _aiworkspacestatsservice = require("../services/ai-workspace-stats.service");
const _userroleservice = require("../../../user-role/user-role.service");
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
let AiWorkspaceStatsResolver = class AiWorkspaceStatsResolver {
    async findWorkspaceAiStats({ id: workspaceId }, userWorkspaceId) {
        // The tool catalog is role-scoped, so resolve the caller's role to count
        // the tools they can actually see.
        const roleId = await this.userRoleService.getRoleIdForUserWorkspace({
            userWorkspaceId,
            workspaceId
        });
        return this.aiWorkspaceStatsService.computeStats(workspaceId, roleId);
    }
    constructor(aiWorkspaceStatsService, userRoleService){
        this.aiWorkspaceStatsService = aiWorkspaceStatsService;
        this.userRoleService = userRoleService;
    }
};
_ts_decorate([
    (0, _graphql.Query)(()=>_workspaceaistatsdto.WorkspaceAiStatsDTO),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(1, (0, _authuserworkspaceiddecorator.AuthUserWorkspaceId)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof WorkspaceEntity === "undefined" ? Object : WorkspaceEntity,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AiWorkspaceStatsResolver.prototype, "findWorkspaceAiStats", null);
AiWorkspaceStatsResolver = _ts_decorate([
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, (0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.AI_SETTINGS)),
    (0, _metadataresolverdecorator.MetadataResolver)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _aiworkspacestatsservice.AiWorkspaceStatsService === "undefined" ? Object : _aiworkspacestatsservice.AiWorkspaceStatsService,
        typeof _userroleservice.UserRoleService === "undefined" ? Object : _userroleservice.UserRoleService
    ])
], AiWorkspaceStatsResolver);

//# sourceMappingURL=ai-workspace-stats.resolver.js.map
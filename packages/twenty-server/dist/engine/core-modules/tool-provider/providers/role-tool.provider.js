"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RoleToolProvider", {
    enumerable: true,
    get: function() {
        return RoleToolProvider;
    }
});
const _common = require("@nestjs/common");
const _ai = require("twenty-shared/ai");
const _constants = require("twenty-shared/constants");
const _executetoolfromtoolsetutil = require("../utils/execute-tool-from-tool-set.util");
const _toolsettodescriptorsutil = require("../utils/tool-set-to-descriptors.util");
const _permissionsservice = require("../../../metadata-modules/permissions/permissions.service");
const _roletoolworkspaceservice = require("../../../metadata-modules/role/tools/services/role-tool.workspace-service");
const _getroleidsfromrolepermissionconfigutil = require("../../../twenty-orm/utils/get-role-ids-from-role-permission-config.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let RoleToolProvider = class RoleToolProvider {
    async isAvailable(context) {
        return this.permissionsService.checkRolesPermissions(context.rolePermissionConfig, context.workspaceId, _constants.PermissionFlagType.ROLES);
    }
    async generateDescriptors(context, options) {
        return (0, _toolsettodescriptorsutil.toolSetToDescriptors)(this.buildToolSet(context), _ai.ToolCategory.ROLE, {
            includeSchemas: options?.includeSchemas ?? true
        });
    }
    async executeStaticTool(toolName, args, context) {
        return (0, _executetoolfromtoolsetutil.executeToolFromToolSet)(this.buildToolSet(context), toolName, args, _ai.ToolCategory.ROLE);
    }
    buildToolSet(context) {
        const callerRoleIds = new Set([
            ...(0, _getroleidsfromrolepermissionconfigutil.getRoleIdsFromRolePermissionConfig)(context.rolePermissionConfig),
            context.roleId
        ]);
        return this.roleToolWorkspaceService.generateRoleTools({
            workspaceId: context.workspaceId,
            callerRoleIds: [
                ...callerRoleIds
            ],
            callerUserWorkspaceId: context.userWorkspaceId
        });
    }
    constructor(roleToolWorkspaceService, permissionsService){
        this.roleToolWorkspaceService = roleToolWorkspaceService;
        this.permissionsService = permissionsService;
        this.category = _ai.ToolCategory.ROLE;
    }
};
RoleToolProvider = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _roletoolworkspaceservice.RoleToolWorkspaceService === "undefined" ? Object : _roletoolworkspaceservice.RoleToolWorkspaceService,
        typeof _permissionsservice.PermissionsService === "undefined" ? Object : _permissionsservice.PermissionsService
    ])
], RoleToolProvider);

//# sourceMappingURL=role-tool.provider.js.map
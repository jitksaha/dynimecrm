"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceUserWorkspaceRoleMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceUserWorkspaceRoleMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("typeorm");
const _utils = require("twenty-shared/utils");
const _workspacecacheproviderservice = require("../../../workspace-cache/interfaces/workspace-cache-provider.service");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const USER_WORKSPACE_ROLE_ROWS_REQUIREMENT = {
    roleTarget: {
        columns: [
            'userWorkspaceId',
            'roleId'
        ],
        where: {
            userWorkspaceId: (0, _typeorm.Not)((0, _typeorm.IsNull)())
        }
    }
};
let WorkspaceUserWorkspaceRoleMapCacheService = class WorkspaceUserWorkspaceRoleMapCacheService extends _workspacecacheproviderservice.WorkspaceCacheProvider {
    computeForCache({ rows }) {
        const { roleTarget: roleTargets } = rows;
        return roleTargets.reduce((acc, { userWorkspaceId, roleId })=>{
            if ((0, _utils.isDefined)(userWorkspaceId)) {
                acc[userWorkspaceId] = roleId;
            }
            return acc;
        }, {});
    }
    constructor(...args){
        super(...args), this.rowsRequirement = USER_WORKSPACE_ROLE_ROWS_REQUIREMENT;
    }
};
WorkspaceUserWorkspaceRoleMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('userWorkspaceRoleMap', {
        packingPonderation: 1
    })
], WorkspaceUserWorkspaceRoleMapCacheService);

//# sourceMappingURL=workspace-user-workspace-role-map-cache.service.js.map
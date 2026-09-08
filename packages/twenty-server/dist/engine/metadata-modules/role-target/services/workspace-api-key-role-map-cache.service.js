"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceApiKeyRoleMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceApiKeyRoleMapCacheService;
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
const API_KEY_ROLE_ROWS_REQUIREMENT = {
    roleTarget: {
        columns: [
            'apiKeyId',
            'roleId'
        ],
        where: {
            apiKeyId: (0, _typeorm.Not)((0, _typeorm.IsNull)())
        }
    }
};
let WorkspaceApiKeyRoleMapCacheService = class WorkspaceApiKeyRoleMapCacheService extends _workspacecacheproviderservice.WorkspaceCacheProvider {
    computeForCache({ rows }) {
        const { roleTarget: roleTargets } = rows;
        return roleTargets.reduce((acc, { apiKeyId, roleId })=>{
            if ((0, _utils.isDefined)(apiKeyId)) {
                acc[apiKeyId] = roleId;
            }
            return acc;
        }, {});
    }
    constructor(...args){
        super(...args), this.rowsRequirement = API_KEY_ROLE_ROWS_REQUIREMENT;
    }
};
WorkspaceApiKeyRoleMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('apiKeyRoleMap', {
        packingPonderation: 1
    })
], WorkspaceApiKeyRoleMapCacheService);

//# sourceMappingURL=workspace-api-key-role-map-cache.service.js.map
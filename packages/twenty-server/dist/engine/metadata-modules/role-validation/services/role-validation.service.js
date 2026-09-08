"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RoleValidationService", {
    enumerable: true,
    get: function() {
        return RoleValidationService;
    }
});
const _common = require("@nestjs/common");
const _permissionsexception = require("../../permissions/permissions.exception");
const _workspacemanyorallflatentitymapscacheservice = require("../../flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _findflatentitybyidinflatentitymapsutil = require("../../flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let RoleValidationService = class RoleValidationService {
    async validateRoleAssignableToUsersOrThrow(roleId, workspaceId) {
        const { flatRoleMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatRoleMaps'
            ]
        });
        const role = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: roleId,
            flatEntityMaps: flatRoleMaps
        });
        if (!role) {
            throw new _permissionsexception.PermissionsException(_permissionsexception.PermissionsExceptionMessage.ROLE_NOT_FOUND, _permissionsexception.PermissionsExceptionCode.ROLE_NOT_FOUND);
        }
        if (!role.canBeAssignedToUsers) {
            throw new _permissionsexception.PermissionsException(_permissionsexception.PermissionsExceptionMessage.ROLE_CANNOT_BE_ASSIGNED_TO_USERS, _permissionsexception.PermissionsExceptionCode.ROLE_CANNOT_BE_ASSIGNED_TO_USERS);
        }
    }
    constructor(flatEntityMapsCacheService){
        this.flatEntityMapsCacheService = flatEntityMapsCacheService;
    }
};
RoleValidationService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService
    ])
], RoleValidationService);

//# sourceMappingURL=role-validation.service.js.map
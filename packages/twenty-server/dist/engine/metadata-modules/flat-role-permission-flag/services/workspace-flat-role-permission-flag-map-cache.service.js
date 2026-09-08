"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceFlatRolePermissionFlagMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceFlatRolePermissionFlagMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _createemptyflatentitymapsconstant = require("../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _fromrolepermissionflagentitytoflatrolepermissionflagutil = require("../utils/from-role-permission-flag-entity-to-flat-role-permission-flag.util");
const _metadataflatentitymapscacheproviderservice = require("../../../workspace-cache/interfaces/metadata-flat-entity-maps-cache-provider.service");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
const _createidtouniversalidentifiermaputil = require("../../../workspace-cache/utils/create-id-to-universal-identifier-map.util");
const _addflatentitytoflatentitymapsthroughmutationorthrowutil = require("../../../workspace-manager/workspace-migration/utils/add-flat-entity-to-flat-entity-maps-through-mutation-or-throw.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const FLAT_ROLE_PERMISSION_FLAG_ROWS_REQUIREMENT = {
    rolePermissionFlag: true,
    application: [
        'id',
        'universalIdentifier'
    ],
    role: [
        'id',
        'universalIdentifier'
    ],
    permissionFlag: [
        'id',
        'universalIdentifier'
    ]
};
let WorkspaceFlatRolePermissionFlagMapCacheService = class WorkspaceFlatRolePermissionFlagMapCacheService extends _metadataflatentitymapscacheproviderservice.MetadataFlatEntityMapsCacheProvider {
    computeForCache({ rows }) {
        const { rolePermissionFlag: rolePermissionFlags, application: applications, role: roles, permissionFlag: permissionFlags } = rows;
        const applicationIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(applications);
        const roleIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(roles);
        const permissionFlagIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(permissionFlags);
        const flatRolePermissionFlagMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
        for (const rolePermissionFlagEntity of rolePermissionFlags){
            const flatRolePermissionFlag = (0, _fromrolepermissionflagentitytoflatrolepermissionflagutil.fromRolePermissionFlagEntityToFlatRolePermissionFlag)({
                entity: rolePermissionFlagEntity,
                applicationIdToUniversalIdentifierMap,
                permissionFlagIdToUniversalIdentifierMap,
                roleIdToUniversalIdentifierMap
            });
            (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
                flatEntity: flatRolePermissionFlag,
                flatEntityMapsToMutate: flatRolePermissionFlagMaps
            });
        }
        return flatRolePermissionFlagMaps;
    }
    constructor(...args){
        super(...args), this.rowsRequirement = FLAT_ROLE_PERMISSION_FLAG_ROWS_REQUIREMENT;
    }
};
WorkspaceFlatRolePermissionFlagMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('flatRolePermissionFlagMaps', {
        packingPonderation: 1
    })
], WorkspaceFlatRolePermissionFlagMapCacheService);

//# sourceMappingURL=workspace-flat-role-permission-flag-map-cache.service.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceFlatRoleMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceFlatRoleMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _metadataflatentitymapscacheproviderservice = require("../../../workspace-cache/interfaces/metadata-flat-entity-maps-cache-provider.service");
const _createemptyflatentitymapsconstant = require("../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _fromroleentitytoflatroleutil = require("../../flat-role/utils/from-role-entity-to-flat-role.util");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
const _createidtouniversalidentifiermaputil = require("../../../workspace-cache/utils/create-id-to-universal-identifier-map.util");
const _addflatentitytoflatentitymapsthroughmutationorthrowutil = require("../../../workspace-manager/workspace-migration/utils/add-flat-entity-to-flat-entity-maps-through-mutation-or-throw.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const FLAT_ROLE_ROWS_REQUIREMENT = {
    role: true,
    application: [
        'id',
        'universalIdentifier'
    ],
    roleTarget: {
        columns: [
            'id',
            'universalIdentifier'
        ],
        groupBy: [
            'roleId'
        ]
    },
    objectPermission: {
        columns: [
            'id',
            'universalIdentifier'
        ],
        groupBy: [
            'roleId'
        ]
    },
    rolePermissionFlag: {
        columns: [
            'id',
            'universalIdentifier'
        ],
        groupBy: [
            'roleId'
        ]
    },
    fieldPermission: {
        columns: [
            'id',
            'universalIdentifier'
        ],
        groupBy: [
            'roleId'
        ]
    },
    rowLevelPermissionPredicate: {
        columns: [
            'id',
            'universalIdentifier'
        ],
        groupBy: [
            'roleId'
        ]
    },
    rowLevelPermissionPredicateGroup: {
        columns: [
            'id',
            'universalIdentifier'
        ],
        groupBy: [
            'roleId'
        ]
    }
};
let WorkspaceFlatRoleMapCacheService = class WorkspaceFlatRoleMapCacheService extends _metadataflatentitymapscacheproviderservice.MetadataFlatEntityMapsCacheProvider {
    computeForCache({ rows }) {
        const { role: roles, application: applications, roleTarget: roleTargets, objectPermission: objectPermissions, rolePermissionFlag: rolePermissionFlags, fieldPermission: fieldPermissions, rowLevelPermissionPredicate: rowLevelPermissionPredicates, rowLevelPermissionPredicateGroup: rowLevelPermissionPredicateGroups } = rows;
        const applicationIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(applications);
        const flatRoleMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
        for (const roleEntity of roles){
            const flatRole = (0, _fromroleentitytoflatroleutil.fromRoleEntityToFlatRole)({
                entity: {
                    ...roleEntity,
                    roleTargets: roleTargets.byRoleId.get(roleEntity.id) || [],
                    objectPermissions: objectPermissions.byRoleId.get(roleEntity.id) || [],
                    rolePermissionFlags: rolePermissionFlags.byRoleId.get(roleEntity.id) || [],
                    fieldPermissions: fieldPermissions.byRoleId.get(roleEntity.id) || [],
                    rowLevelPermissionPredicates: rowLevelPermissionPredicates.byRoleId.get(roleEntity.id) || [],
                    rowLevelPermissionPredicateGroups: rowLevelPermissionPredicateGroups.byRoleId.get(roleEntity.id) || []
                },
                applicationIdToUniversalIdentifierMap
            });
            (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
                flatEntity: flatRole,
                flatEntityMapsToMutate: flatRoleMaps
            });
        }
        return flatRoleMaps;
    }
    constructor(...args){
        super(...args), this.rowsRequirement = FLAT_ROLE_ROWS_REQUIREMENT;
    }
};
WorkspaceFlatRoleMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('flatRoleMaps', {
        packingPonderation: 1
    })
], WorkspaceFlatRoleMapCacheService);

//# sourceMappingURL=workspace-flat-role-map-cache.service.js.map
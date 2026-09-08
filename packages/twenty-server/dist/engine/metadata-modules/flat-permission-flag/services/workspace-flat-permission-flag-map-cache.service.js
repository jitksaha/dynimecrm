"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceFlatPermissionFlagMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceFlatPermissionFlagMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _createemptyflatentitymapsconstant = require("../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _frompermissionflagentitytoflatpermissionflagutil = require("../utils/from-permission-flag-entity-to-flat-permission-flag.util");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
const _metadataflatentitymapscacheproviderservice = require("../../../workspace-cache/interfaces/metadata-flat-entity-maps-cache-provider.service");
const _createidtouniversalidentifiermaputil = require("../../../workspace-cache/utils/create-id-to-universal-identifier-map.util");
const _addflatentitytoflatentitymapsthroughmutationorthrowutil = require("../../../workspace-manager/workspace-migration/utils/add-flat-entity-to-flat-entity-maps-through-mutation-or-throw.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const FLAT_PERMISSION_FLAG_ROWS_REQUIREMENT = {
    permissionFlag: true,
    application: [
        'id',
        'universalIdentifier'
    ],
    rolePermissionFlag: {
        columns: true,
        groupBy: [
            'permissionFlagId'
        ]
    }
};
let WorkspaceFlatPermissionFlagMapCacheService = class WorkspaceFlatPermissionFlagMapCacheService extends _metadataflatentitymapscacheproviderservice.MetadataFlatEntityMapsCacheProvider {
    computeForCache({ rows }) {
        const { permissionFlag: permissionFlags, application: applications, rolePermissionFlag: rolePermissionFlags } = rows;
        const applicationIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(applications);
        const flatPermissionFlagMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
        for (const definition of permissionFlags){
            const flatDefinition = (0, _frompermissionflagentitytoflatpermissionflagutil.fromPermissionFlagEntityToFlatPermissionFlag)({
                entity: {
                    ...definition,
                    rolePermissionFlags: rolePermissionFlags.byPermissionFlagId.get(definition.id) ?? []
                },
                applicationIdToUniversalIdentifierMap
            });
            (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
                flatEntity: flatDefinition,
                flatEntityMapsToMutate: flatPermissionFlagMaps
            });
        }
        return flatPermissionFlagMaps;
    }
    constructor(...args){
        super(...args), this.rowsRequirement = FLAT_PERMISSION_FLAG_ROWS_REQUIREMENT;
    }
};
WorkspaceFlatPermissionFlagMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('flatPermissionFlagMaps', {
        packingPonderation: 1
    })
], WorkspaceFlatPermissionFlagMapCacheService);

//# sourceMappingURL=workspace-flat-permission-flag-map-cache.service.js.map
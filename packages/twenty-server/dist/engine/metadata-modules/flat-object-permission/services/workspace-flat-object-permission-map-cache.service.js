"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceFlatObjectPermissionMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceFlatObjectPermissionMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _createemptyflatentitymapsconstant = require("../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _fromobjectpermissionentitytoflatobjectpermissionutil = require("../utils/from-object-permission-entity-to-flat-object-permission.util");
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
const FLAT_OBJECT_PERMISSION_ROWS_REQUIREMENT = {
    objectPermission: true,
    application: [
        'id',
        'universalIdentifier'
    ],
    role: [
        'id',
        'universalIdentifier'
    ],
    objectMetadata: [
        'id',
        'universalIdentifier'
    ]
};
let WorkspaceFlatObjectPermissionMapCacheService = class WorkspaceFlatObjectPermissionMapCacheService extends _metadataflatentitymapscacheproviderservice.MetadataFlatEntityMapsCacheProvider {
    computeForCache({ rows }) {
        const { objectPermission: objectPermissions, application: applications, role: roles, objectMetadata: objectMetadatas } = rows;
        const applicationIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(applications);
        const roleIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(roles);
        const objectMetadataIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(objectMetadatas);
        const flatObjectPermissionMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
        for (const objectPermissionEntity of objectPermissions){
            const flatObjectPermission = (0, _fromobjectpermissionentitytoflatobjectpermissionutil.fromObjectPermissionEntityToFlatObjectPermission)({
                entity: objectPermissionEntity,
                applicationIdToUniversalIdentifierMap,
                roleIdToUniversalIdentifierMap,
                objectMetadataIdToUniversalIdentifierMap
            });
            (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
                flatEntity: flatObjectPermission,
                flatEntityMapsToMutate: flatObjectPermissionMaps
            });
        }
        return flatObjectPermissionMaps;
    }
    constructor(...args){
        super(...args), this.rowsRequirement = FLAT_OBJECT_PERMISSION_ROWS_REQUIREMENT;
    }
};
WorkspaceFlatObjectPermissionMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('flatObjectPermissionMaps', {
        packingPonderation: 1
    })
], WorkspaceFlatObjectPermissionMapCacheService);

//# sourceMappingURL=workspace-flat-object-permission-map-cache.service.js.map
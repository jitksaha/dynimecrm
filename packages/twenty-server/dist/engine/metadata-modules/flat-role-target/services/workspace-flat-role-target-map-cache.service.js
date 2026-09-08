"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceFlatRoleTargetMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceFlatRoleTargetMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _metadataflatentitymapscacheproviderservice = require("../../../workspace-cache/interfaces/metadata-flat-entity-maps-cache-provider.service");
const _createemptyflatentitymapsconstant = require("../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _fromroletargetentitytoflatroletargetutil = require("../utils/from-role-target-entity-to-flat-role-target.util");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
const _createidtouniversalidentifiermaputil = require("../../../workspace-cache/utils/create-id-to-universal-identifier-map.util");
const _addflatentitytoflatentitymapsthroughmutationorthrowutil = require("../../../workspace-manager/workspace-migration/utils/add-flat-entity-to-flat-entity-maps-through-mutation-or-throw.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const FLAT_ROLE_TARGET_ROWS_REQUIREMENT = {
    roleTarget: true,
    application: [
        'id',
        'universalIdentifier'
    ],
    role: [
        'id',
        'universalIdentifier'
    ],
    agent: [
        'id',
        'universalIdentifier'
    ]
};
let WorkspaceFlatRoleTargetMapCacheService = class WorkspaceFlatRoleTargetMapCacheService extends _metadataflatentitymapscacheproviderservice.MetadataFlatEntityMapsCacheProvider {
    computeForCache({ rows }) {
        const { roleTarget: roleTargets, application: applications, role: roles, agent: agents } = rows;
        const applicationIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(applications);
        const roleIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(roles);
        const agentIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(agents);
        const flatRoleTargetMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
        for (const roleTargetEntity of roleTargets){
            const flatRoleTarget = (0, _fromroletargetentitytoflatroletargetutil.fromRoleTargetEntityToFlatRoleTarget)({
                entity: roleTargetEntity,
                applicationIdToUniversalIdentifierMap,
                roleIdToUniversalIdentifierMap,
                agentIdToUniversalIdentifierMap
            });
            (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
                flatEntity: flatRoleTarget,
                flatEntityMapsToMutate: flatRoleTargetMaps
            });
        }
        return flatRoleTargetMaps;
    }
    constructor(...args){
        super(...args), this.rowsRequirement = FLAT_ROLE_TARGET_ROWS_REQUIREMENT;
    }
};
WorkspaceFlatRoleTargetMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('flatRoleTargetMaps', {
        packingPonderation: 1
    })
], WorkspaceFlatRoleTargetMapCacheService);

//# sourceMappingURL=workspace-flat-role-target-map-cache.service.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceFlatViewGroupMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceFlatViewGroupMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _metadataflatentitymapscacheproviderservice = require("../../../workspace-cache/interfaces/metadata-flat-entity-maps-cache-provider.service");
const _createemptyflatentitymapsconstant = require("../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _fromviewgroupentitytoflatviewgrouputil = require("../utils/from-view-group-entity-to-flat-view-group.util");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
const _createidtouniversalidentifiermaputil = require("../../../workspace-cache/utils/create-id-to-universal-identifier-map.util");
const _addflatentitytoflatentitymapsthroughmutationorthrowutil = require("../../../workspace-manager/workspace-migration/utils/add-flat-entity-to-flat-entity-maps-through-mutation-or-throw.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const FLAT_VIEW_GROUP_ROWS_REQUIREMENT = {
    viewGroup: true,
    application: [
        'id',
        'universalIdentifier'
    ],
    view: [
        'id',
        'universalIdentifier'
    ]
};
let WorkspaceFlatViewGroupMapCacheService = class WorkspaceFlatViewGroupMapCacheService extends _metadataflatentitymapscacheproviderservice.MetadataFlatEntityMapsCacheProvider {
    computeForCache({ rows }) {
        const { viewGroup: viewGroups, application: applications, view: views } = rows;
        const applicationIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(applications);
        const viewIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(views);
        const flatViewGroupMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
        for (const viewGroupEntity of viewGroups){
            const flatViewGroup = (0, _fromviewgroupentitytoflatviewgrouputil.fromViewGroupEntityToFlatViewGroup)({
                entity: viewGroupEntity,
                applicationIdToUniversalIdentifierMap,
                viewIdToUniversalIdentifierMap
            });
            (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
                flatEntity: flatViewGroup,
                flatEntityMapsToMutate: flatViewGroupMaps
            });
        }
        return flatViewGroupMaps;
    }
    constructor(...args){
        super(...args), this.rowsRequirement = FLAT_VIEW_GROUP_ROWS_REQUIREMENT;
    }
};
WorkspaceFlatViewGroupMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('flatViewGroupMaps', {
        packingPonderation: 2
    })
], WorkspaceFlatViewGroupMapCacheService);

//# sourceMappingURL=workspace-flat-view-group-map-cache.service.js.map
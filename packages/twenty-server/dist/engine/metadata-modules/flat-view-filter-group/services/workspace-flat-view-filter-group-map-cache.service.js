"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceFlatViewFilterGroupMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceFlatViewFilterGroupMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _metadataflatentitymapscacheproviderservice = require("../../../workspace-cache/interfaces/metadata-flat-entity-maps-cache-provider.service");
const _createemptyflatentitymapsconstant = require("../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _fromviewfiltergroupentitytoflatviewfiltergrouputil = require("../utils/from-view-filter-group-entity-to-flat-view-filter-group.util");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
const _createidtouniversalidentifiermaputil = require("../../../workspace-cache/utils/create-id-to-universal-identifier-map.util");
const _addflatentitytoflatentitymapsthroughmutationorthrowutil = require("../../../workspace-manager/workspace-migration/utils/add-flat-entity-to-flat-entity-maps-through-mutation-or-throw.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const FLAT_VIEW_FILTER_GROUP_ROWS_REQUIREMENT = {
    viewFilterGroup: {
        columns: true,
        groupBy: [
            'parentViewFilterGroupId'
        ]
    },
    application: [
        'id',
        'universalIdentifier'
    ],
    viewFilter: {
        columns: [
            'id',
            'universalIdentifier'
        ],
        groupBy: [
            'viewFilterGroupId'
        ]
    },
    view: [
        'id',
        'universalIdentifier'
    ]
};
let WorkspaceFlatViewFilterGroupMapCacheService = class WorkspaceFlatViewFilterGroupMapCacheService extends _metadataflatentitymapscacheproviderservice.MetadataFlatEntityMapsCacheProvider {
    computeForCache({ rows }) {
        const { viewFilterGroup: viewFilterGroups, application: applications, viewFilter: viewFilters, view: views } = rows;
        const applicationIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(applications);
        const viewFilterGroupIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(viewFilterGroups.rows);
        const viewIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(views);
        const flatViewFilterGroupMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
        for (const viewFilterGroupEntity of viewFilterGroups.rows){
            const flatViewFilterGroup = (0, _fromviewfiltergroupentitytoflatviewfiltergrouputil.fromViewFilterGroupEntityToFlatViewFilterGroup)({
                entity: {
                    ...viewFilterGroupEntity,
                    viewFilters: viewFilters.byViewFilterGroupId.get(viewFilterGroupEntity.id) || [],
                    childViewFilterGroups: viewFilterGroups.byParentViewFilterGroupId.get(viewFilterGroupEntity.id) || []
                },
                applicationIdToUniversalIdentifierMap,
                viewFilterGroupIdToUniversalIdentifierMap,
                viewIdToUniversalIdentifierMap
            });
            (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
                flatEntity: flatViewFilterGroup,
                flatEntityMapsToMutate: flatViewFilterGroupMaps
            });
        }
        return flatViewFilterGroupMaps;
    }
    constructor(...args){
        super(...args), this.rowsRequirement = FLAT_VIEW_FILTER_GROUP_ROWS_REQUIREMENT;
    }
};
WorkspaceFlatViewFilterGroupMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('flatViewFilterGroupMaps', {
        packingPonderation: 1
    })
], WorkspaceFlatViewFilterGroupMapCacheService);

//# sourceMappingURL=workspace-flat-view-filter-group-map-cache.service.js.map
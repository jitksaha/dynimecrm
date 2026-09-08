"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceFlatViewFilterMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceFlatViewFilterMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _metadataflatentitymapscacheproviderservice = require("../../../workspace-cache/interfaces/metadata-flat-entity-maps-cache-provider.service");
const _createemptyflatentitymapsconstant = require("../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _fromviewfilterentitytoflatviewfilterutil = require("../utils/from-view-filter-entity-to-flat-view-filter.util");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
const _createidtouniversalidentifiermaputil = require("../../../workspace-cache/utils/create-id-to-universal-identifier-map.util");
const _addflatentitytoflatentitymapsthroughmutationorthrowutil = require("../../../workspace-manager/workspace-migration/utils/add-flat-entity-to-flat-entity-maps-through-mutation-or-throw.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const FLAT_VIEW_FILTER_ROWS_REQUIREMENT = {
    viewFilter: true,
    application: [
        'id',
        'universalIdentifier'
    ],
    fieldMetadata: [
        'id',
        'universalIdentifier'
    ],
    viewFilterGroup: [
        'id',
        'universalIdentifier'
    ],
    view: [
        'id',
        'universalIdentifier'
    ]
};
let WorkspaceFlatViewFilterMapCacheService = class WorkspaceFlatViewFilterMapCacheService extends _metadataflatentitymapscacheproviderservice.MetadataFlatEntityMapsCacheProvider {
    computeForCache({ rows }) {
        const { viewFilter: viewFilters, application: applications, fieldMetadata: fieldMetadatas, viewFilterGroup: viewFilterGroups, view: views } = rows;
        const applicationIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(applications);
        const fieldMetadataIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(fieldMetadatas);
        const viewFilterGroupIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(viewFilterGroups);
        const viewIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(views);
        const flatViewFilterMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
        for (const viewFilterEntity of viewFilters){
            const flatViewFilter = (0, _fromviewfilterentitytoflatviewfilterutil.fromViewFilterEntityToFlatViewFilter)({
                entity: viewFilterEntity,
                applicationIdToUniversalIdentifierMap,
                fieldMetadataIdToUniversalIdentifierMap,
                viewFilterGroupIdToUniversalIdentifierMap,
                viewIdToUniversalIdentifierMap
            });
            (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
                flatEntity: flatViewFilter,
                flatEntityMapsToMutate: flatViewFilterMaps
            });
        }
        return flatViewFilterMaps;
    }
    constructor(...args){
        super(...args), this.rowsRequirement = FLAT_VIEW_FILTER_ROWS_REQUIREMENT;
    }
};
WorkspaceFlatViewFilterMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('flatViewFilterMaps', {
        packingPonderation: 1
    })
], WorkspaceFlatViewFilterMapCacheService);

//# sourceMappingURL=workspace-flat-view-filter-map-cache.service.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceFlatViewSortMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceFlatViewSortMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _metadataflatentitymapscacheproviderservice = require("../../../workspace-cache/interfaces/metadata-flat-entity-maps-cache-provider.service");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
const _createemptyflatentitymapsconstant = require("../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _fromviewsortentitytoflatviewsortutil = require("../utils/from-view-sort-entity-to-flat-view-sort.util");
const _addflatentitytoflatentitymapsthroughmutationorthrowutil = require("../../../workspace-manager/workspace-migration/utils/add-flat-entity-to-flat-entity-maps-through-mutation-or-throw.util");
const _createidtouniversalidentifiermaputil = require("../../../workspace-cache/utils/create-id-to-universal-identifier-map.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const FLAT_VIEW_SORT_ROWS_REQUIREMENT = {
    viewSort: true,
    application: [
        'id',
        'universalIdentifier'
    ],
    view: [
        'id',
        'universalIdentifier'
    ],
    fieldMetadata: [
        'id',
        'universalIdentifier'
    ]
};
let WorkspaceFlatViewSortMapCacheService = class WorkspaceFlatViewSortMapCacheService extends _metadataflatentitymapscacheproviderservice.MetadataFlatEntityMapsCacheProvider {
    computeForCache({ rows }) {
        const { viewSort: existingViewSorts, application: applications, view: views, fieldMetadata: fieldMetadatas } = rows;
        const applicationIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(applications);
        const viewIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(views);
        const fieldMetadataIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(fieldMetadatas);
        const flatViewSortMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
        for (const viewSort of existingViewSorts){
            const flatViewSort = (0, _fromviewsortentitytoflatviewsortutil.fromViewSortEntityToFlatViewSort)({
                entity: viewSort,
                applicationIdToUniversalIdentifierMap,
                viewIdToUniversalIdentifierMap,
                fieldMetadataIdToUniversalIdentifierMap
            });
            (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
                flatEntity: flatViewSort,
                flatEntityMapsToMutate: flatViewSortMaps
            });
        }
        return flatViewSortMaps;
    }
    constructor(...args){
        super(...args), this.rowsRequirement = FLAT_VIEW_SORT_ROWS_REQUIREMENT;
    }
};
WorkspaceFlatViewSortMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('flatViewSortMaps', {
        packingPonderation: 1
    })
], WorkspaceFlatViewSortMapCacheService);

//# sourceMappingURL=workspace-flat-view-sort-map-cache.service.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceFlatPageLayoutMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceFlatPageLayoutMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _metadataflatentitymapscacheproviderservice = require("../../../workspace-cache/interfaces/metadata-flat-entity-maps-cache-provider.service");
const _createemptyflatentitymapsconstant = require("../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _transformpagelayoutentitytoflatpagelayoututil = require("../utils/transform-page-layout-entity-to-flat-page-layout.util");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
const _createidtouniversalidentifiermaputil = require("../../../workspace-cache/utils/create-id-to-universal-identifier-map.util");
const _addflatentitytoflatentitymapsthroughmutationorthrowutil = require("../../../workspace-manager/workspace-migration/utils/add-flat-entity-to-flat-entity-maps-through-mutation-or-throw.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const FLAT_PAGE_LAYOUT_ROWS_REQUIREMENT = {
    pageLayout: true,
    pageLayoutTab: {
        columns: [
            'id',
            'universalIdentifier'
        ],
        groupBy: [
            'pageLayoutId'
        ]
    },
    application: [
        'id',
        'universalIdentifier'
    ],
    objectMetadata: [
        'id',
        'universalIdentifier'
    ]
};
let WorkspaceFlatPageLayoutMapCacheService = class WorkspaceFlatPageLayoutMapCacheService extends _metadataflatentitymapscacheproviderservice.MetadataFlatEntityMapsCacheProvider {
    computeForCache({ rows }) {
        const { pageLayout: pageLayouts, pageLayoutTab: pageLayoutTabs, application: applications, objectMetadata: objectMetadatas } = rows;
        const applicationIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(applications);
        const objectMetadataIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(objectMetadatas);
        const pageLayoutTabIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(pageLayoutTabs.rows);
        const flatPageLayoutMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
        for (const pageLayoutEntity of pageLayouts){
            const flatPageLayout = (0, _transformpagelayoutentitytoflatpagelayoututil.transformPageLayoutEntityToFlatPageLayout)({
                entity: {
                    ...pageLayoutEntity,
                    tabs: pageLayoutTabs.byPageLayoutId.get(pageLayoutEntity.id) || []
                },
                applicationIdToUniversalIdentifierMap,
                objectMetadataIdToUniversalIdentifierMap,
                pageLayoutTabIdToUniversalIdentifierMap
            });
            (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
                flatEntity: flatPageLayout,
                flatEntityMapsToMutate: flatPageLayoutMaps
            });
        }
        return flatPageLayoutMaps;
    }
    constructor(...args){
        super(...args), this.rowsRequirement = FLAT_PAGE_LAYOUT_ROWS_REQUIREMENT;
    }
};
WorkspaceFlatPageLayoutMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('flatPageLayoutMaps', {
        packingPonderation: 1
    })
], WorkspaceFlatPageLayoutMapCacheService);

//# sourceMappingURL=workspace-flat-page-layout-map-cache.service.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceFlatPageLayoutTabMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceFlatPageLayoutTabMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _metadataflatentitymapscacheproviderservice = require("../../../workspace-cache/interfaces/metadata-flat-entity-maps-cache-provider.service");
const _createemptyflatentitymapsconstant = require("../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _transformpagelayouttabentitytoflatpagelayouttabutil = require("../utils/transform-page-layout-tab-entity-to-flat-page-layout-tab.util");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
const _createidtouniversalidentifiermaputil = require("../../../workspace-cache/utils/create-id-to-universal-identifier-map.util");
const _addflatentitytoflatentitymapsthroughmutationorthrowutil = require("../../../workspace-manager/workspace-migration/utils/add-flat-entity-to-flat-entity-maps-through-mutation-or-throw.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const FLAT_PAGE_LAYOUT_TAB_ROWS_REQUIREMENT = {
    pageLayoutTab: true,
    pageLayoutWidget: {
        columns: [
            'id',
            'universalIdentifier'
        ],
        groupBy: [
            'pageLayoutTabId'
        ]
    },
    application: [
        'id',
        'universalIdentifier'
    ],
    pageLayout: [
        'id',
        'universalIdentifier'
    ]
};
let WorkspaceFlatPageLayoutTabMapCacheService = class WorkspaceFlatPageLayoutTabMapCacheService extends _metadataflatentitymapscacheproviderservice.MetadataFlatEntityMapsCacheProvider {
    computeForCache({ rows }) {
        const { pageLayoutTab: pageLayoutTabs, pageLayoutWidget: pageLayoutWidgets, application: applications, pageLayout: pageLayouts } = rows;
        const applicationIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(applications);
        const pageLayoutIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(pageLayouts);
        const flatPageLayoutTabMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
        for (const pageLayoutTabEntity of pageLayoutTabs){
            const flatPageLayoutTab = (0, _transformpagelayouttabentitytoflatpagelayouttabutil.transformPageLayoutTabEntityToFlatPageLayoutTab)({
                entity: {
                    ...pageLayoutTabEntity,
                    widgets: pageLayoutWidgets.byPageLayoutTabId.get(pageLayoutTabEntity.id) || []
                },
                applicationIdToUniversalIdentifierMap,
                pageLayoutIdToUniversalIdentifierMap
            });
            (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
                flatEntity: flatPageLayoutTab,
                flatEntityMapsToMutate: flatPageLayoutTabMaps
            });
        }
        return flatPageLayoutTabMaps;
    }
    constructor(...args){
        super(...args), this.rowsRequirement = FLAT_PAGE_LAYOUT_TAB_ROWS_REQUIREMENT;
    }
};
WorkspaceFlatPageLayoutTabMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('flatPageLayoutTabMaps', {
        packingPonderation: 2
    })
], WorkspaceFlatPageLayoutTabMapCacheService);

//# sourceMappingURL=workspace-flat-page-layout-tab-map-cache.service.js.map
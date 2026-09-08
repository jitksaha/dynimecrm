"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceFlatPageLayoutWidgetMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceFlatPageLayoutWidgetMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _metadataflatentitymapscacheproviderservice = require("../../../workspace-cache/interfaces/metadata-flat-entity-maps-cache-provider.service");
const _createemptyflatentitymapsconstant = require("../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _frompagelayoutwidgetentitytoflatpagelayoutwidgetutil = require("../utils/from-page-layout-widget-entity-to-flat-page-layout-widget.util");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
const _createidtouniversalidentifiermaputil = require("../../../workspace-cache/utils/create-id-to-universal-identifier-map.util");
const _addflatentitytoflatentitymapsthroughmutationorthrowutil = require("../../../workspace-manager/workspace-migration/utils/add-flat-entity-to-flat-entity-maps-through-mutation-or-throw.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const FLAT_PAGE_LAYOUT_WIDGET_ROWS_REQUIREMENT = {
    pageLayoutWidget: true,
    application: [
        'id',
        'universalIdentifier'
    ],
    pageLayoutTab: [
        'id',
        'universalIdentifier'
    ],
    objectMetadata: [
        'id',
        'universalIdentifier'
    ],
    fieldMetadata: [
        'id',
        'universalIdentifier'
    ],
    frontComponent: [
        'id',
        'universalIdentifier'
    ],
    view: [
        'id',
        'universalIdentifier'
    ]
};
let WorkspaceFlatPageLayoutWidgetMapCacheService = class WorkspaceFlatPageLayoutWidgetMapCacheService extends _metadataflatentitymapscacheproviderservice.MetadataFlatEntityMapsCacheProvider {
    computeForCache({ rows }) {
        const { pageLayoutWidget: existingPageLayoutWidgets, application: applications, pageLayoutTab: pageLayoutTabs, objectMetadata: objectMetadatas, fieldMetadata: fieldMetadatas, frontComponent: frontComponents, view: views } = rows;
        const applicationIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(applications);
        const pageLayoutTabIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(pageLayoutTabs);
        const objectMetadataIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(objectMetadatas);
        const fieldMetadataUniversalIdentifierById = Object.fromEntries((0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(fieldMetadatas));
        const frontComponentUniversalIdentifierById = Object.fromEntries((0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(frontComponents));
        const viewUniversalIdentifierById = Object.fromEntries((0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(views));
        const flatPageLayoutWidgetMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
        for (const pageLayoutWidgetEntity of existingPageLayoutWidgets){
            const flatPageLayoutWidget = (0, _frompagelayoutwidgetentitytoflatpagelayoutwidgetutil.fromPageLayoutWidgetEntityToFlatPageLayoutWidget)({
                entity: pageLayoutWidgetEntity,
                applicationIdToUniversalIdentifierMap,
                pageLayoutTabIdToUniversalIdentifierMap,
                objectMetadataIdToUniversalIdentifierMap,
                fieldMetadataUniversalIdentifierById,
                frontComponentUniversalIdentifierById,
                viewUniversalIdentifierById
            });
            (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
                flatEntity: flatPageLayoutWidget,
                flatEntityMapsToMutate: flatPageLayoutWidgetMaps
            });
        }
        return flatPageLayoutWidgetMaps;
    }
    constructor(...args){
        super(...args), this.rowsRequirement = FLAT_PAGE_LAYOUT_WIDGET_ROWS_REQUIREMENT;
    }
};
WorkspaceFlatPageLayoutWidgetMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('flatPageLayoutWidgetMaps', {
        packingPonderation: 5
    })
], WorkspaceFlatPageLayoutWidgetMapCacheService);

//# sourceMappingURL=workspace-flat-page-layout-widget-map-cache.service.js.map
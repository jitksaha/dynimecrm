"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceFlatNavigationMenuItemMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceFlatNavigationMenuItemMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _metadataflatentitymapscacheproviderservice = require("../../../workspace-cache/interfaces/metadata-flat-entity-maps-cache-provider.service");
const _createemptyflatentitymapsconstant = require("../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _addflatnavigationmenuitemtomapsandupdateindexutil = require("../utils/add-flat-navigation-menu-item-to-maps-and-update-index.util");
const _fromnavigationmenuitementitytoflatnavigationmenuitemutil = require("../utils/from-navigation-menu-item-entity-to-flat-navigation-menu-item.util");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
const _createidtouniversalidentifiermaputil = require("../../../workspace-cache/utils/create-id-to-universal-identifier-map.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const FLAT_NAVIGATION_MENU_ITEM_ROWS_REQUIREMENT = {
    navigationMenuItem: true,
    application: [
        'id',
        'universalIdentifier'
    ],
    objectMetadata: [
        'id',
        'universalIdentifier'
    ],
    view: [
        'id',
        'universalIdentifier'
    ],
    pageLayout: [
        'id',
        'universalIdentifier'
    ]
};
let WorkspaceFlatNavigationMenuItemMapCacheService = class WorkspaceFlatNavigationMenuItemMapCacheService extends _metadataflatentitymapscacheproviderservice.MetadataFlatEntityMapsCacheProvider {
    computeForCache({ rows }) {
        const { navigationMenuItem: navigationMenuItems, application: applications, objectMetadata: objectMetadatas, view: views, pageLayout: pageLayouts } = rows;
        const applicationIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(applications);
        const objectMetadataIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(objectMetadatas);
        const navigationMenuItemIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(navigationMenuItems);
        const viewIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(views);
        const pageLayoutIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(pageLayouts);
        const flatNavigationMenuItemMaps = {
            ...(0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)(),
            byUserWorkspaceIdAndFolderId: {}
        };
        for (const navigationMenuItemEntity of navigationMenuItems){
            const flatNavigationMenuItem = (0, _fromnavigationmenuitementitytoflatnavigationmenuitemutil.fromNavigationMenuItemEntityToFlatNavigationMenuItem)({
                entity: navigationMenuItemEntity,
                applicationIdToUniversalIdentifierMap,
                objectMetadataIdToUniversalIdentifierMap,
                navigationMenuItemIdToUniversalIdentifierMap,
                viewIdToUniversalIdentifierMap,
                pageLayoutIdToUniversalIdentifierMap
            });
            (0, _addflatnavigationmenuitemtomapsandupdateindexutil.addFlatNavigationMenuItemToMapsAndUpdateIndex)({
                flatNavigationMenuItem,
                flatNavigationMenuItemMaps
            });
        }
        return flatNavigationMenuItemMaps;
    }
    constructor(...args){
        super(...args), this.rowsRequirement = FLAT_NAVIGATION_MENU_ITEM_ROWS_REQUIREMENT;
    }
};
WorkspaceFlatNavigationMenuItemMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('flatNavigationMenuItemMaps', {
        packingPonderation: 1
    })
], WorkspaceFlatNavigationMenuItemMapCacheService);

//# sourceMappingURL=workspace-flat-navigation-menu-item-map-cache.service.js.map
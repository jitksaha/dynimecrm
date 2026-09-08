"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceFlatCommandMenuItemMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceFlatCommandMenuItemMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _metadataflatentitymapscacheproviderservice = require("../../../workspace-cache/interfaces/metadata-flat-entity-maps-cache-provider.service");
const _fromcommandmenuitementitytoflatcommandmenuitemutil = require("../utils/from-command-menu-item-entity-to-flat-command-menu-item.util");
const _createemptyflatentitymapsconstant = require("../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
const _createidtouniversalidentifiermaputil = require("../../../workspace-cache/utils/create-id-to-universal-identifier-map.util");
const _addflatentitytoflatentitymapsthroughmutationorthrowutil = require("../../../workspace-manager/workspace-migration/utils/add-flat-entity-to-flat-entity-maps-through-mutation-or-throw.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const FLAT_COMMAND_MENU_ITEM_ROWS_REQUIREMENT = {
    commandMenuItem: true,
    application: [
        'id',
        'universalIdentifier'
    ],
    objectMetadata: [
        'id',
        'universalIdentifier'
    ],
    frontComponent: [
        'id',
        'universalIdentifier'
    ],
    pageLayout: [
        'id',
        'universalIdentifier'
    ]
};
let WorkspaceFlatCommandMenuItemMapCacheService = class WorkspaceFlatCommandMenuItemMapCacheService extends _metadataflatentitymapscacheproviderservice.MetadataFlatEntityMapsCacheProvider {
    computeForCache({ rows }) {
        const { commandMenuItem: commandMenuItems, application: applications, objectMetadata: objectMetadatas, frontComponent: frontComponents, pageLayout: pageLayouts } = rows;
        const applicationIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(applications);
        const objectMetadataIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(objectMetadatas);
        const frontComponentIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(frontComponents);
        const pageLayoutIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(pageLayouts);
        const flatCommandMenuItemMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
        for (const commandMenuItemEntity of commandMenuItems){
            const flatCommandMenuItem = (0, _fromcommandmenuitementitytoflatcommandmenuitemutil.fromCommandMenuItemEntityToFlatCommandMenuItem)({
                entity: commandMenuItemEntity,
                applicationIdToUniversalIdentifierMap,
                objectMetadataIdToUniversalIdentifierMap,
                frontComponentIdToUniversalIdentifierMap,
                pageLayoutIdToUniversalIdentifierMap
            });
            (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
                flatEntity: flatCommandMenuItem,
                flatEntityMapsToMutate: flatCommandMenuItemMaps
            });
        }
        return flatCommandMenuItemMaps;
    }
    constructor(...args){
        super(...args), this.rowsRequirement = FLAT_COMMAND_MENU_ITEM_ROWS_REQUIREMENT;
    }
};
WorkspaceFlatCommandMenuItemMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('flatCommandMenuItemMaps', {
        packingPonderation: 4
    })
], WorkspaceFlatCommandMenuItemMapCacheService);

//# sourceMappingURL=workspace-flat-command-menu-item-map-cache.service.js.map
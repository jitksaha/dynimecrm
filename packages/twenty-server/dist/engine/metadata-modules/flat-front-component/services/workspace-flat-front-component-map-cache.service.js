"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceFlatFrontComponentMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceFlatFrontComponentMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _metadataflatentitymapscacheproviderservice = require("../../../workspace-cache/interfaces/metadata-flat-entity-maps-cache-provider.service");
const _createemptyflatentitymapsconstant = require("../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _fromfrontcomponententitytoflatfrontcomponentutil = require("../utils/from-front-component-entity-to-flat-front-component.util");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
const _createidtouniversalidentifiermaputil = require("../../../workspace-cache/utils/create-id-to-universal-identifier-map.util");
const _addflatentitytoflatentitymapsthroughmutationorthrowutil = require("../../../workspace-manager/workspace-migration/utils/add-flat-entity-to-flat-entity-maps-through-mutation-or-throw.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const FLAT_FRONT_COMPONENT_ROWS_REQUIREMENT = {
    frontComponent: true,
    application: [
        'id',
        'universalIdentifier'
    ]
};
let WorkspaceFlatFrontComponentMapCacheService = class WorkspaceFlatFrontComponentMapCacheService extends _metadataflatentitymapscacheproviderservice.MetadataFlatEntityMapsCacheProvider {
    computeForCache({ rows }) {
        const { frontComponent: frontComponents, application: applications } = rows;
        const applicationIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(applications);
        const flatFrontComponentMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
        for (const frontComponentEntity of frontComponents){
            const flatFrontComponent = (0, _fromfrontcomponententitytoflatfrontcomponentutil.fromFrontComponentEntityToFlatFrontComponent)({
                entity: frontComponentEntity,
                applicationIdToUniversalIdentifierMap
            });
            (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
                flatEntity: flatFrontComponent,
                flatEntityMapsToMutate: flatFrontComponentMaps
            });
        }
        return flatFrontComponentMaps;
    }
    constructor(...args){
        super(...args), this.rowsRequirement = FLAT_FRONT_COMPONENT_ROWS_REQUIREMENT;
    }
};
WorkspaceFlatFrontComponentMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('flatFrontComponentMaps', {
        packingPonderation: 1
    })
], WorkspaceFlatFrontComponentMapCacheService);

//# sourceMappingURL=workspace-flat-front-component-map-cache.service.js.map
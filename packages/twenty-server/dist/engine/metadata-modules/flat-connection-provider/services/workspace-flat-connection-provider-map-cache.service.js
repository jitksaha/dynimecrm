"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceFlatConnectionProviderMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceFlatConnectionProviderMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _metadataflatentitymapscacheproviderservice = require("../../../workspace-cache/interfaces/metadata-flat-entity-maps-cache-provider.service");
const _createemptyflatentitymapsconstant = require("../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _fromconnectionproviderentitytoflatconnectionproviderutil = require("../utils/from-connection-provider-entity-to-flat-connection-provider.util");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
const _createidtouniversalidentifiermaputil = require("../../../workspace-cache/utils/create-id-to-universal-identifier-map.util");
const _addflatentitytoflatentitymapsthroughmutationorthrowutil = require("../../../workspace-manager/workspace-migration/utils/add-flat-entity-to-flat-entity-maps-through-mutation-or-throw.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const FLAT_CONNECTION_PROVIDER_ROWS_REQUIREMENT = {
    connectionProvider: true,
    application: [
        'id',
        'universalIdentifier',
        'deletedAt'
    ]
};
let WorkspaceFlatConnectionProviderMapCacheService = class WorkspaceFlatConnectionProviderMapCacheService extends _metadataflatentitymapscacheproviderservice.MetadataFlatEntityMapsCacheProvider {
    computeForCache({ rows }) {
        const { connectionProvider: connectionProviders, application: applications } = rows;
        const applicationIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(applications.filter((application)=>!(0, _utils.isDefined)(application.deletedAt)));
        const flatConnectionProviderMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
        for (const connectionProviderEntity of connectionProviders){
            const flatConnectionProvider = (0, _fromconnectionproviderentitytoflatconnectionproviderutil.fromConnectionProviderEntityToFlatConnectionProvider)({
                entity: connectionProviderEntity,
                applicationIdToUniversalIdentifierMap
            });
            (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
                flatEntity: flatConnectionProvider,
                flatEntityMapsToMutate: flatConnectionProviderMaps
            });
        }
        return flatConnectionProviderMaps;
    }
    constructor(...args){
        super(...args), this.rowsRequirement = FLAT_CONNECTION_PROVIDER_ROWS_REQUIREMENT;
    }
};
WorkspaceFlatConnectionProviderMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('flatConnectionProviderMaps', {
        packingPonderation: 1
    })
], WorkspaceFlatConnectionProviderMapCacheService);

//# sourceMappingURL=workspace-flat-connection-provider-map-cache.service.js.map
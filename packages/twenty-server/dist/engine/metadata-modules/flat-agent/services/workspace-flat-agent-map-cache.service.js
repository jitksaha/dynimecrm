"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceFlatAgentMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceFlatAgentMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _metadataflatentitymapscacheproviderservice = require("../../../workspace-cache/interfaces/metadata-flat-entity-maps-cache-provider.service");
const _transformagententitytoflatagentutil = require("../utils/transform-agent-entity-to-flat-agent.util");
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
const FLAT_AGENT_ROWS_REQUIREMENT = {
    agent: true,
    application: [
        'id',
        'universalIdentifier'
    ]
};
let WorkspaceFlatAgentMapCacheService = class WorkspaceFlatAgentMapCacheService extends _metadataflatentitymapscacheproviderservice.MetadataFlatEntityMapsCacheProvider {
    computeForCache({ rows }) {
        const { agent: agents, application: applications } = rows;
        const applicationIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(applications);
        const flatAgentMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
        for (const agentEntity of agents){
            const flatAgent = (0, _transformagententitytoflatagentutil.transformAgentEntityToFlatAgent)({
                entity: agentEntity,
                applicationIdToUniversalIdentifierMap
            });
            (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
                flatEntity: flatAgent,
                flatEntityMapsToMutate: flatAgentMaps
            });
        }
        return flatAgentMaps;
    }
    constructor(...args){
        super(...args), this.rowsRequirement = FLAT_AGENT_ROWS_REQUIREMENT;
    }
};
WorkspaceFlatAgentMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('flatAgentMaps', {
        packingPonderation: 1
    })
], WorkspaceFlatAgentMapCacheService);

//# sourceMappingURL=workspace-flat-agent-map-cache.service.js.map
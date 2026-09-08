"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceResolverNameMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceResolverNameMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _workspacecacheproviderservice = require("../../../../workspace-cache/interfaces/workspace-cache-provider.service");
const _buildresolvernamemaputil = require("../utils/build-resolver-name-map.util");
const _workspacecachedecorator = require("../../../../workspace-cache/decorators/workspace-cache.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const GRAPHQL_RESOLVER_NAME_ROWS_REQUIREMENT = {
    objectMetadata: [
        'universalIdentifier',
        'nameSingular',
        'namePlural'
    ]
};
let WorkspaceResolverNameMapCacheService = class WorkspaceResolverNameMapCacheService extends _workspacecacheproviderservice.WorkspaceCacheProvider {
    computeForCache({ rows }) {
        return (0, _buildresolvernamemaputil.buildResolverNameMap)(rows.objectMetadata);
    }
    constructor(...args){
        super(...args), this.rowsRequirement = GRAPHQL_RESOLVER_NAME_ROWS_REQUIREMENT;
    }
};
WorkspaceResolverNameMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('graphQLResolverNameMap', {
        packingPonderation: 4
    })
], WorkspaceResolverNameMapCacheService);

//# sourceMappingURL=workspace-resolver-name-map-cache.service.js.map
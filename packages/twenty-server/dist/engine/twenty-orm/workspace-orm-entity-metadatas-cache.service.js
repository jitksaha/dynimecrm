"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceORMEntityMetadatasCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceORMEntityMetadatasCacheService;
    }
});
const _common = require("@nestjs/common");
const _workspacecacheproviderservice = require("../workspace-cache/interfaces/workspace-cache-provider.service");
const _workspacecachedecorator = require("../workspace-cache/decorators/workspace-cache.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let WorkspaceORMEntityMetadatasCacheService = class WorkspaceORMEntityMetadatasCacheService extends _workspacecacheproviderservice.WorkspaceCacheProvider {
    async computeForCache() {
        return [];
    }
};
WorkspaceORMEntityMetadatasCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('ORMEntityMetadatas', {
        localDataOnly: true,
        packingPonderation: 128
    })
], WorkspaceORMEntityMetadatasCacheService);

//# sourceMappingURL=workspace-orm-entity-metadatas-cache.service.js.map
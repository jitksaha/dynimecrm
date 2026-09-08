"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceApiKeyMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceApiKeyMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _workspacecacheproviderservice = require("../../../workspace-cache/interfaces/workspace-cache-provider.service");
const _fromapikeyentitytoflatutil = require("../utils/from-api-key-entity-to-flat.util");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const API_KEY_ROWS_REQUIREMENT = {
    apiKey: true
};
let WorkspaceApiKeyMapCacheService = class WorkspaceApiKeyMapCacheService extends _workspacecacheproviderservice.WorkspaceCacheProvider {
    computeForCache({ rows }) {
        const { apiKey: apiKeys } = rows;
        return apiKeys.reduce((map, apiKey)=>{
            map[apiKey.id] = (0, _fromapikeyentitytoflatutil.fromApiKeyEntityToFlat)(apiKey);
            return map;
        }, {});
    }
    constructor(...args){
        super(...args), this.rowsRequirement = API_KEY_ROWS_REQUIREMENT;
    }
};
WorkspaceApiKeyMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('apiKeyMap', {
        packingPonderation: 1
    })
], WorkspaceApiKeyMapCacheService);

//# sourceMappingURL=workspace-api-key-map-cache.service.js.map
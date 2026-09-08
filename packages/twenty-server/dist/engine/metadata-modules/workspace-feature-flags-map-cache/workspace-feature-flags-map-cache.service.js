"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceFeatureFlagsMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceFeatureFlagsMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _workspacecacheproviderservice = require("../../workspace-cache/interfaces/workspace-cache-provider.service");
const _workspacecachedecorator = require("../../workspace-cache/decorators/workspace-cache.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const FEATURE_FLAGS_ROWS_REQUIREMENT = {
    featureFlag: true
};
let WorkspaceFeatureFlagsMapCacheService = class WorkspaceFeatureFlagsMapCacheService extends _workspacecacheproviderservice.WorkspaceCacheProvider {
    computeForCache({ rows }) {
        const { featureFlag: workspaceFeatureFlags } = rows;
        return workspaceFeatureFlags.reduce((result, currentFeatureFlag)=>{
            result[currentFeatureFlag.key] = currentFeatureFlag.value;
            return result;
        }, {});
    }
    constructor(...args){
        super(...args), this.rowsRequirement = FEATURE_FLAGS_ROWS_REQUIREMENT;
    }
};
WorkspaceFeatureFlagsMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('featureFlagsMap', {
        packingPonderation: 1
    })
], WorkspaceFeatureFlagsMapCacheService);

//# sourceMappingURL=workspace-feature-flags-map-cache.service.js.map
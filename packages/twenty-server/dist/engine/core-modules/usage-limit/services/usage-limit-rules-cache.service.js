"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsageLimitRulesCacheService", {
    enumerable: true,
    get: function() {
        return UsageLimitRulesCacheService;
    }
});
const _common = require("@nestjs/common");
const _workspacecacheproviderservice = require("../../../workspace-cache/interfaces/workspace-cache-provider.service");
const _fromusagelimitentitytoflatutil = require("../utils/from-usage-limit-entity-to-flat.util");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const USAGE_LIMIT_RULES_ROWS_REQUIREMENT = {
    usageLimit: true
};
let UsageLimitRulesCacheService = class UsageLimitRulesCacheService extends _workspacecacheproviderservice.WorkspaceCacheProvider {
    computeForCache({ rows }) {
        const { usageLimit: usageLimits } = rows;
        return usageLimits.reduce((rules, usageLimit)=>{
            const flat = (0, _fromusagelimitentitytoflatutil.fromUsageLimitEntityToFlat)(usageLimit);
            rules.byResourceType[flat.resourceType] = [
                ...rules.byResourceType[flat.resourceType] ?? [],
                flat
            ];
            return rules;
        }, {
            byResourceType: {}
        });
    }
    constructor(...args){
        super(...args), this.rowsRequirement = USAGE_LIMIT_RULES_ROWS_REQUIREMENT;
    }
};
UsageLimitRulesCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('usageLimitRules', {
        packingPonderation: 1
    })
], UsageLimitRulesCacheService);

//# sourceMappingURL=usage-limit-rules-cache.service.js.map
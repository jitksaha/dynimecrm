/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CustomAiProviderAccessService", {
    enumerable: true,
    get: function() {
        return CustomAiProviderAccessService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _customaiprovideraccessrefreshintervalconstant = require("../constants/custom-ai-provider-access-refresh-interval.constant");
const _customaiprovideraccessretryintervalconstant = require("../constants/custom-ai-provider-access-retry-interval.constant");
const _maxseatswithoutenterprisekeyconstant = require("../constants/max-seats-without-enterprise-key.constant");
const _enterpriseplanservice = require("./enterprise-plan.service");
const _hascustomaiprovideraccessutil = require("../utils/has-custom-ai-provider-access.util");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CustomAiProviderAccessService = class CustomAiProviderAccessService {
    async computeAccess() {
        // Stamped before the first await so concurrent synchronous readers cannot
        // each start their own count.
        this.lastRefreshStartedAt = Date.now();
        try {
            const seatCount = await this.enterprisePlanService.getBillableSeatCount();
            this.hasAccess = (0, _hascustomaiprovideraccessutil.hasCustomAiProviderAccess)({
                isBillingEnabled: this.twentyConfigService.get('IS_BILLING_ENABLED'),
                hasValidEnterprisePlan: this.enterprisePlanService.isValid(),
                seatCount
            });
            this.didLastRefreshFail = false;
            return {
                hasAccess: this.hasAccess,
                seatCount,
                seatThreshold: _maxseatswithoutenterprisekeyconstant.MAX_SEATS_WITHOUT_ENTERPRISE_KEY
            };
        } catch (error) {
            this.didLastRefreshFail = true;
            throw error;
        }
    }
    // Callers on the inference path resolve models synchronously and must not wait
    // on a seat count, so they get the last verdict and only start a refresh once
    // it has aged out — whoever reads next picks the new one up.
    getCachedHasAccess() {
        if (this.isVerdictStale()) {
            // computeAccess stamps the clock before its first await, so a second
            // synchronous caller cannot start a competing count.
            this.computeAccess().catch((error)=>{
                // A count that fails must never disable AI: the previous verdict stands
                // until a later refresh succeeds.
                this.logger.warn(`Could not refresh custom AI provider access: ${error instanceof Error ? error.message : 'Unknown error'}. Keeping the previous verdict.`);
            });
        }
        return this.hasAccess;
    }
    isVerdictStale() {
        if (!(0, _utils.isDefined)(this.lastRefreshStartedAt)) {
            return true;
        }
        const refreshInterval = this.didLastRefreshFail ? _customaiprovideraccessretryintervalconstant.CUSTOM_AI_PROVIDER_ACCESS_RETRY_INTERVAL_MS : _customaiprovideraccessrefreshintervalconstant.CUSTOM_AI_PROVIDER_ACCESS_REFRESH_INTERVAL_MS;
        return Date.now() - this.lastRefreshStartedAt >= refreshInterval;
    }
    constructor(twentyConfigService, enterprisePlanService){
        this.twentyConfigService = twentyConfigService;
        this.enterprisePlanService = enterprisePlanService;
        this.logger = new _common.Logger(CustomAiProviderAccessService.name);
        // Assumed granted until the first count returns, so a cold process never drops
        // an entitled instance's custom models while the query is still in flight.
        this.hasAccess = true;
        this.lastRefreshStartedAt = null;
        this.didLastRefreshFail = false;
    }
};
CustomAiProviderAccessService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _enterpriseplanservice.EnterprisePlanService === "undefined" ? Object : _enterpriseplanservice.EnterprisePlanService
    ])
], CustomAiProviderAccessService);

//# sourceMappingURL=custom-ai-provider-access.service.js.map
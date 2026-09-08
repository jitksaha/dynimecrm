/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BillingSubscriptionItemResolver", {
    enumerable: true,
    get: function() {
        return BillingSubscriptionItemResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _typeorm = require("@nestjs/typeorm");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _metadataresolverdecorator = require("../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _billingsubscriptionitemdto = require("./dtos/billing-subscription-item.dto");
const _billingsubscriptionitementity = require("./entities/billing-subscription-item.entity");
const _billingsubscriptionentity = require("./entities/billing-subscription.entity");
const _billingproductkeyenum = require("./enums/billing-product-key.enum");
const _billingusageservice = require("./services/billing-usage.service");
const _preventnesttoautologgraphqlerrorsfilter = require("../graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter");
const _resolvervalidationpipe = require("../graphql/pipes/resolver-validation.pipe");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let BillingSubscriptionItemResolver = class BillingSubscriptionItemResolver {
    // Derived from the live credit balance instead of read from the stored
    // column: a persisted flag that every balance-mutating path must remember to
    // sync drifts as soon as one path misses, and a workspace stuck with a stale
    // flag gets refused with no banner explaining why.
    async hasReachedCurrentPeriodCap(billingSubscriptionItem) {
        if (billingSubscriptionItem.billingProduct?.metadata?.productKey !== _billingproductkeyenum.BillingProductKey.RESOURCE_CREDIT) {
            return false;
        }
        // This field rides on the currentWorkspace query, which is app boot: a
        // billing read failure (stale period right after a rollover, ClickHouse or
        // Redis unavailable) must degrade to "no banner", never fail the query.
        // Failing open matches the usage gate, whose availability checks also fail
        // open so telemetry never blocks a paying customer.
        try {
            const billingSubscription = await this.billingSubscriptionRepository.findOne({
                where: {
                    id: billingSubscriptionItem.billingSubscriptionId
                }
            });
            if (!(0, _utils.isDefined)(billingSubscription)) {
                return false;
            }
            const creditAvailability = await this.billingUsageService.getCreditAvailability({
                workspaceId: billingSubscription.workspaceId
            });
            return !creditAvailability.hasAvailableCredits && creditAvailability.reason === 'no-credits';
        } catch (error) {
            this.logger.warn(`Failed to derive hasReachedCurrentPeriodCap for billing subscription item ${billingSubscriptionItem.id}: ${error instanceof Error ? error.message : String(error)}`);
            return false;
        }
    }
    constructor(billingUsageService, // Field resolver: the workspace is discovered from the parent item's
    // subscription row, so it cannot be an input here.
    // eslint-disable-next-line twenty/prefer-workspace-scoped-repository
    billingSubscriptionRepository){
        this.billingUsageService = billingUsageService;
        this.billingSubscriptionRepository = billingSubscriptionRepository;
        this.logger = new _common.Logger(BillingSubscriptionItemResolver.name);
    }
};
_ts_decorate([
    (0, _graphql.ResolveField)(()=>Boolean),
    _ts_param(0, (0, _graphql.Parent)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _billingsubscriptionitementity.BillingSubscriptionItemEntity === "undefined" ? Object : _billingsubscriptionitementity.BillingSubscriptionItemEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], BillingSubscriptionItemResolver.prototype, "hasReachedCurrentPeriodCap", null);
BillingSubscriptionItemResolver = _ts_decorate([
    (0, _metadataresolverdecorator.MetadataResolver)(()=>_billingsubscriptionitemdto.BillingSubscriptionItemDTO),
    (0, _common.UsePipes)(_resolvervalidationpipe.ResolverValidationPipe),
    (0, _common.UseFilters)(_preventnesttoautologgraphqlerrorsfilter.PreventNestToAutoLogGraphqlErrorsFilter),
    _ts_param(1, (0, _typeorm.InjectRepository)(_billingsubscriptionentity.BillingSubscriptionEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _billingusageservice.BillingUsageService === "undefined" ? Object : _billingusageservice.BillingUsageService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], BillingSubscriptionItemResolver);

//# sourceMappingURL=billing-subscription-item.resolver.js.map
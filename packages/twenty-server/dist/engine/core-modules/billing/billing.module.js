/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BillingModule", {
    enumerable: true,
    get: function() {
        return BillingModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _clickhousemodule = require("../../../database/clickhouse/clickhouse.module");
const _workspaceiteratormodule = require("../../../database/commands/command-runners/workspace-iterator.module");
const _coreentitycachemodule = require("../../core-entity-cache/core-entity-cache.module");
const _billinggaugeservice = require("./billing-gauge.service");
const _billingsubscriptionitemresolver = require("./billing-subscription-item.resolver");
const _billingresolver = require("./billing.resolver");
const _billingsynccustomerdatacommand = require("./commands/billing-sync-customer-data.command");
const _billingsyncplansdatacommand = require("./commands/billing-sync-plans-data.command");
const _billingupdatesubscriptionpricecommand = require("./commands/billing-update-subscription-price.command");
const _billingcreditgrantentity = require("./entities/billing-credit-grant.entity");
const _billingcustomerentity = require("./entities/billing-customer.entity");
const _billingentitlemententity = require("./entities/billing-entitlement.entity");
const _billingmeterentity = require("./entities/billing-meter.entity");
const _billingpriceentity = require("./entities/billing-price.entity");
const _billingproductentity = require("./entities/billing-product.entity");
const _billingsubscriptionitementity = require("./entities/billing-subscription-item.entity");
const _billingsubscriptionentity = require("./entities/billing-subscription.entity");
const _billingapiexceptionfilter = require("./filters/billing-api-exception.filter");
const _billingworkspacememberlistener = require("./listeners/billing-workspace-member.listener");
const _billingcreditgrantservice = require("./services/billing-credit-grant.service");
const _billingcreditrolloverservice = require("./services/billing-credit-rollover.service");
const _billingcreditservice = require("./services/billing-credit.service");
const _billingplanservice = require("./services/billing-plan.service");
const _billingportalworkspaceservice = require("./services/billing-portal.workspace-service");
const _billingpriceservice = require("./services/billing-price.service");
const _billingproductservice = require("./services/billing-product.service");
const _billingsubscriptionitemservice = require("./services/billing-subscription-item.service");
const _billingsubscriptionphaseservice = require("./services/billing-subscription-phase.service");
const _billingsubscriptionupdateservice = require("./services/billing-subscription-update.service");
const _billingsubscriptionservice = require("./services/billing-subscription.service");
const _billingusagecacheservice = require("./services/billing-usage-cache.service");
const _billingusageservice = require("./services/billing-usage.service");
const _billingservice = require("./services/billing.service");
const _resourcecreditservice = require("./services/resource-credit.service");
const _workspacecurrentbillingsubscriptioncacheservice = require("./services/workspace-current-billing-subscription-cache.service");
const _stripemodule = require("./stripe/stripe.module");
const _cachelockmodule = require("../cache-lock/cache-lock.module");
const _workspacedomainsmodule = require("../domain/workspace-domains/workspace-domains.module");
const _enterprisemodule = require("../enterprise/enterprise.module");
const _featureflagentity = require("../feature-flag/feature-flag.entity");
const _featureflagmodule = require("../feature-flag/feature-flag.module");
const _messagequeuemodule = require("../message-queue/message-queue.module");
const _metricsmodule = require("../metrics/metrics.module");
const _userworkspaceentity = require("../user-workspace/user-workspace.entity");
const _workspaceentity = require("../workspace/workspace.entity");
const _permissionsmodule = require("../../metadata-modules/permissions/permissions.module");
const _provideworkspacescopedrepository = require("../../twenty-orm/workspace-scoped-repository/provide-workspace-scoped-repository");
const _workspacecachemodule = require("../../workspace-cache/workspace-cache.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let BillingModule = class BillingModule {
};
BillingModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _cachelockmodule.CacheLockModule,
            _clickhousemodule.ClickHouseModule,
            _coreentitycachemodule.CoreEntityCacheModule,
            _featureflagmodule.FeatureFlagModule,
            _stripemodule.StripeModule,
            _messagequeuemodule.MessageQueueModule,
            _permissionsmodule.PermissionsModule,
            _workspacecachemodule.WorkspaceCacheModule,
            _workspacedomainsmodule.WorkspaceDomainsModule,
            _typeorm.TypeOrmModule.forFeature([
                _billingsubscriptionentity.BillingSubscriptionEntity,
                _billingsubscriptionitementity.BillingSubscriptionItemEntity,
                _billingcustomerentity.BillingCustomerEntity,
                _billingproductentity.BillingProductEntity,
                _billingpriceentity.BillingPriceEntity,
                _billingmeterentity.BillingMeterEntity,
                _billingentitlemententity.BillingEntitlementEntity,
                _billingcreditgrantentity.BillingCreditGrantEntity,
                _workspaceentity.WorkspaceEntity,
                _userworkspaceentity.UserWorkspaceEntity,
                _featureflagentity.FeatureFlagEntity
            ]),
            _metricsmodule.MetricsModule,
            _enterprisemodule.EnterpriseModule,
            _workspaceiteratormodule.WorkspaceIteratorModule
        ],
        providers: [
            _billingsubscriptionservice.BillingSubscriptionService,
            _billingsubscriptionupdateservice.BillingSubscriptionUpdateService,
            _billingsubscriptionitemservice.BillingSubscriptionItemService,
            _billingportalworkspaceservice.BillingPortalWorkspaceService,
            _billingproductservice.BillingProductService,
            _billingsubscriptionphaseservice.BillingSubscriptionPhaseService,
            _billingresolver.BillingResolver,
            _billingsubscriptionitemresolver.BillingSubscriptionItemResolver,
            _billingplanservice.BillingPlanService,
            _billingworkspacememberlistener.BillingWorkspaceMemberListener,
            _billingservice.BillingService,
            _billingapiexceptionfilter.BillingRestApiExceptionFilter,
            _billingsynccustomerdatacommand.BillingSyncCustomerDataCommand,
            _billingupdatesubscriptionpricecommand.BillingUpdateSubscriptionPriceCommand,
            _billingsyncplansdatacommand.BillingSyncPlansDataCommand,
            _billingusageservice.BillingUsageService,
            _billingusagecacheservice.BillingUsageCacheService,
            _billingpriceservice.BillingPriceService,
            _billingcreditrolloverservice.BillingCreditRolloverService,
            _billingcreditgrantservice.BillingCreditGrantService,
            _billingcreditservice.BillingCreditService,
            _resourcecreditservice.ResourceCreditService,
            _billinggaugeservice.BillingGaugeService,
            _workspacecurrentbillingsubscriptioncacheservice.WorkspaceCurrentBillingSubscriptionCacheService,
            (0, _provideworkspacescopedrepository.provideWorkspaceScopedRepository)(_billingentitlemententity.BillingEntitlementEntity),
            (0, _provideworkspacescopedrepository.provideWorkspaceScopedRepository)(_billingcreditgrantentity.BillingCreditGrantEntity),
            (0, _provideworkspacescopedrepository.provideWorkspaceScopedRepository)(_billingcustomerentity.BillingCustomerEntity),
            (0, _provideworkspacescopedrepository.provideWorkspaceScopedRepository)(_billingsubscriptionentity.BillingSubscriptionEntity)
        ],
        exports: [
            _billingsubscriptionservice.BillingSubscriptionService,
            _billingsubscriptionupdateservice.BillingSubscriptionUpdateService,
            _billingsubscriptionitemservice.BillingSubscriptionItemService,
            _billingsubscriptionphaseservice.BillingSubscriptionPhaseService,
            _billingportalworkspaceservice.BillingPortalWorkspaceService,
            _billingservice.BillingService,
            _billingusageservice.BillingUsageService,
            _billingusagecacheservice.BillingUsageCacheService,
            _billingcreditrolloverservice.BillingCreditRolloverService,
            _billingcreditgrantservice.BillingCreditGrantService,
            _billingcreditservice.BillingCreditService,
            _resourcecreditservice.ResourceCreditService
        ]
    })
], BillingModule);

//# sourceMappingURL=billing.module.js.map
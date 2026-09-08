"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmailBillingService", {
    enumerable: true,
    get: function() {
        return EmailBillingService;
    }
});
const _common = require("@nestjs/common");
const _nobillingsubscriptionconstant = require("../../../engine/core-modules/billing/constants/no-billing-subscription.constant");
const _billingusageservice = require("../../../engine/core-modules/billing/services/billing-usage.service");
const _billingservice = require("../../../engine/core-modules/billing/services/billing.service");
const _usageoperationtypeenum = require("../../../engine/core-modules/usage/enums/usage-operation-type.enum");
const _usageresourcetypeenum = require("../../../engine/core-modules/usage/enums/usage-resource-type.enum");
const _usageunitenum = require("../../../engine/core-modules/usage/enums/usage-unit.enum");
const _usagerecorderservice = require("../../../engine/core-modules/usage/services/usage-recorder.service");
const _convertdollarstobillingcreditsutil = require("../../../engine/metadata-modules/ai/ai-billing/utils/convert-dollars-to-billing-credits.util");
const _workspacecacheservice = require("../../../engine/workspace-cache/services/workspace-cache.service");
const _emailmarginmultiplier = require("../constants/email-margin-multiplier");
const _sesemailcostperthousanddollars = require("../constants/ses-email-cost-per-thousand-dollars");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let EmailBillingService = class EmailBillingService {
    async validateEmailCreditsOrThrow(workspaceId) {
        await this.billingUsageService.hasAvailableCreditsOrThrow(workspaceId);
    }
    async resolveEmailCreditContext(workspaceId) {
        if (!this.billingService.isBillingEnabled()) {
            return {
                hasCredits: true,
                currentBillingSubscription: _nobillingsubscriptionconstant.NO_BILLING_SUBSCRIPTION
            };
        }
        const { currentBillingSubscription } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'currentBillingSubscription'
        ]);
        const { hasAvailableCredits } = await this.billingUsageService.getCreditAvailability({
            workspaceId,
            currentBillingSubscription
        });
        return {
            hasCredits: hasAvailableCredits,
            currentBillingSubscription
        };
    }
    async billSentEmails({ workspaceId, sentEmailCount, userWorkspaceId, currentBillingSubscription: providedCurrentBillingSubscription }) {
        if (sentEmailCount <= 0) {
            return;
        }
        const providerCostInDollars = sentEmailCount / 1000 * _sesemailcostperthousanddollars.SES_EMAIL_COST_PER_THOUSAND_DOLLARS;
        const chargedInDollars = providerCostInDollars * _emailmarginmultiplier.EMAIL_MARGIN_MULTIPLIER;
        const creditsUsedMicro = Math.round((0, _convertdollarstobillingcreditsutil.convertDollarsToBillingCredits)(chargedInDollars));
        if (this.billingService.isBillingEnabled()) {
            const currentBillingSubscription = await this.billingUsageService.resolveCurrentBillingSubscription({
                workspaceId,
                providedCurrentBillingSubscription
            });
            if (currentBillingSubscription !== _nobillingsubscriptionconstant.NO_BILLING_SUBSCRIPTION) {
                await this.billingUsageService.decrementAvailableCreditsInCache({
                    workspaceId,
                    usedCredits: creditsUsedMicro,
                    currentBillingSubscription
                });
            }
        }
        await this.usageRecorderService.record(workspaceId, [
            {
                resourceType: _usageresourcetypeenum.UsageResourceType.EMAIL,
                operationType: _usageoperationtypeenum.UsageOperationType.EMAIL_SEND,
                creditsUsedMicro,
                quantity: sentEmailCount,
                unit: _usageunitenum.UsageUnit.INVOCATION,
                spenders: {
                    userWorkspaceId
                }
            }
        ]);
    }
    constructor(usageRecorderService, billingService, billingUsageService, workspaceCacheService){
        this.usageRecorderService = usageRecorderService;
        this.billingService = billingService;
        this.billingUsageService = billingUsageService;
        this.workspaceCacheService = workspaceCacheService;
    }
};
EmailBillingService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usagerecorderservice.UsageRecorderService === "undefined" ? Object : _usagerecorderservice.UsageRecorderService,
        typeof _billingservice.BillingService === "undefined" ? Object : _billingservice.BillingService,
        typeof _billingusageservice.BillingUsageService === "undefined" ? Object : _billingusageservice.BillingUsageService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService
    ])
], EmailBillingService);

//# sourceMappingURL=email-billing.service.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AiBillingService", {
    enumerable: true,
    get: function() {
        return AiBillingService;
    }
});
const _common = require("@nestjs/common");
const _nobillingsubscriptionconstant = require("../../../../core-modules/billing/constants/no-billing-subscription.constant");
const _billingusageservice = require("../../../../core-modules/billing/services/billing-usage.service");
const _billingservice = require("../../../../core-modules/billing/services/billing.service");
const _usageoperationtypeenum = require("../../../../core-modules/usage/enums/usage-operation-type.enum");
const _usageresourcetypeenum = require("../../../../core-modules/usage/enums/usage-resource-type.enum");
const _usageunitenum = require("../../../../core-modules/usage/enums/usage-unit.enum");
const _usagerecorderservice = require("../../../../core-modules/usage/services/usage-recorder.service");
const _nativewebsearchcostpercalldollars = require("../constants/native-web-search-cost-per-call-dollars");
const _computecostbreakdownutil = require("../utils/compute-cost-breakdown.util");
const _convertdollarstobillingcreditsutil = require("../utils/convert-dollars-to-billing-credits.util");
const _aimodelregistryservice = require("../../ai-models/services/ai-model-registry.service");
const _workspacecacheservice = require("../../../../workspace-cache/services/workspace-cache.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AiBillingService = class AiBillingService {
    calculateCost(modelId, billingInput) {
        const model = this.aiModelRegistryService.getEffectiveModelConfig(modelId);
        const { usage, cacheCreationTokens = 0 } = billingInput;
        const breakdown = (0, _computecostbreakdownutil.computeCostBreakdown)(model, {
            inputTokens: usage.inputTokens,
            outputTokens: usage.outputTokens,
            reasoningTokens: usage.outputTokenDetails?.reasoningTokens,
            cachedInputTokens: usage.inputTokenDetails?.cacheReadTokens,
            cacheCreationTokens
        });
        this.logger.log(`Cost for ${model.modelId}: $${breakdown.totalCostInDollars.toFixed(6)} ` + `(input: ${breakdown.tokenCounts.adjustedInputTokens}, ` + `cached: ${breakdown.tokenCounts.cachedInputTokens}, ` + `cacheCreation: ${breakdown.tokenCounts.cacheCreationTokens}, ` + `output: ${breakdown.tokenCounts.adjustedOutputTokens}, ` + `reasoning: ${breakdown.tokenCounts.reasoningTokens})`);
        return breakdown.totalCostInDollars;
    }
    async calculateAndBillUsage(modelId, billingInput, workspaceId, operationType, agentId, userWorkspaceId) {
        const costInDollars = this.calculateCost(modelId, billingInput);
        const creditsUsedMicro = Math.round((0, _convertdollarstobillingcreditsutil.convertDollarsToBillingCredits)(costInDollars));
        const totalTokens = (billingInput.usage.inputTokens ?? 0) + (billingInput.usage.outputTokens ?? 0);
        if (this.billingService.isBillingEnabled()) {
            await this.billingUsageService.decrementAvailableCreditsInCache({
                workspaceId,
                usedCredits: creditsUsedMicro
            });
        }
        await this.emitAiTokenUsageEvent(workspaceId, creditsUsedMicro, totalTokens, modelId, operationType, agentId, userWorkspaceId);
    }
    async decrementAndCheckAvailableCredits(modelId, billingInput, workspaceId) {
        if (!this.billingService.isBillingEnabled()) {
            return {
                hasNoMoreAvailableCredits: false
            };
        }
        const costInDollars = this.calculateCost(modelId, billingInput);
        const creditsUsedMicro = Math.round((0, _convertdollarstobillingcreditsutil.convertDollarsToBillingCredits)(costInDollars));
        const remainingCredits = await this.billingUsageService.decrementAvailableCreditsInCache({
            workspaceId,
            usedCredits: creditsUsedMicro
        });
        return {
            hasNoMoreAvailableCredits: remainingCredits <= 0
        };
    }
    async billNativeWebSearchUsage(nativeWebSearchCallCount, workspaceId, userWorkspaceId) {
        if (nativeWebSearchCallCount <= 0) {
            return;
        }
        const costInDollars = nativeWebSearchCallCount * _nativewebsearchcostpercalldollars.NATIVE_WEB_SEARCH_COST_PER_CALL_DOLLARS;
        const creditsUsedMicro = Math.round((0, _convertdollarstobillingcreditsutil.convertDollarsToBillingCredits)(costInDollars));
        this.logger.log(`Native web search billing: ${nativeWebSearchCallCount} calls, $${costInDollars.toFixed(4)}`);
        if (this.billingService.isBillingEnabled()) {
            const { currentBillingSubscription } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
                'currentBillingSubscription'
            ]);
            if (currentBillingSubscription !== _nobillingsubscriptionconstant.NO_BILLING_SUBSCRIPTION) {
                await this.billingUsageService.decrementAvailableCreditsInCache({
                    workspaceId,
                    usedCredits: creditsUsedMicro
                });
            }
        }
        await this.usageRecorderService.record(workspaceId, [
            {
                resourceType: _usageresourcetypeenum.UsageResourceType.AI,
                operationType: _usageoperationtypeenum.UsageOperationType.WEB_SEARCH,
                creditsUsedMicro,
                quantity: nativeWebSearchCallCount,
                unit: _usageunitenum.UsageUnit.INVOCATION,
                spenders: {
                    userWorkspaceId
                }
            }
        ]);
    }
    async emitAiTokenUsageEvent(workspaceId, creditsUsedMicro, totalTokens, modelId, operationType, agentId, userWorkspaceId) {
        await this.usageRecorderService.record(workspaceId, [
            {
                resourceType: _usageresourcetypeenum.UsageResourceType.AI,
                operationType,
                creditsUsedMicro,
                quantity: totalTokens,
                unit: _usageunitenum.UsageUnit.TOKEN,
                resourceId: agentId || null,
                resourceContext: modelId,
                spenders: {
                    userWorkspaceId,
                    agentId
                }
            }
        ]);
    }
    constructor(usageRecorderService, aiModelRegistryService, billingService, billingUsageService, workspaceCacheService){
        this.usageRecorderService = usageRecorderService;
        this.aiModelRegistryService = aiModelRegistryService;
        this.billingService = billingService;
        this.billingUsageService = billingUsageService;
        this.workspaceCacheService = workspaceCacheService;
        this.logger = new _common.Logger(AiBillingService.name);
    }
};
AiBillingService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usagerecorderservice.UsageRecorderService === "undefined" ? Object : _usagerecorderservice.UsageRecorderService,
        typeof _aimodelregistryservice.AiModelRegistryService === "undefined" ? Object : _aimodelregistryservice.AiModelRegistryService,
        typeof _billingservice.BillingService === "undefined" ? Object : _billingservice.BillingService,
        typeof _billingusageservice.BillingUsageService === "undefined" ? Object : _billingusageservice.BillingUsageService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService
    ])
], AiBillingService);

//# sourceMappingURL=ai-billing.service.js.map
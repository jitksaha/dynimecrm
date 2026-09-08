"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildSpeedBuckets", {
    enumerable: true,
    get: function() {
        return buildSpeedBuckets;
    }
});
const _utils = require("twenty-shared/utils");
const _spendertypespecificityconstant = require("../constants/spender-type-specificity.constant");
const _buildfallbackspeedbucketutil = require("./build-fallback-speed-bucket.util");
const _buildspeedbucketkeyutil = require("./build-speed-bucket-key.util");
const _buildspendersfromauthcontextutil = require("./build-spenders-from-auth-context.util");
const _findrulesforspenderutil = require("./find-rules-for-spender.util");
const bucketSpecificity = (bucket)=>_spendertypespecificityconstant.SPENDER_TYPE_SPECIFICITY[bucket.spenderType] * 2 + ((0, _utils.isDefined)(bucket.spenderId) ? 0 : 1);
const buildSpeedBuckets = ({ defaultUsageLimitFallbacks, rules, authContext, resourceType, operationType })=>{
    const spenders = (0, _buildspendersfromauthcontextutil.buildSpendersFromAuthContext)(authContext);
    const buckets = spenders.flatMap((spender)=>{
        const spenderRules = (0, _findrulesforspenderutil.findRulesForSpender)({
            rules,
            spender,
            operationType
        });
        const ruleBuckets = spenderRules.map((rule)=>({
                key: (0, _buildspeedbucketkeyutil.buildSpeedBucketKey)({
                    counterScope: 'perWorkspace',
                    workspaceId: authContext.workspace.id,
                    resourceType,
                    operationType,
                    spenderType: spender.spenderType,
                    spenderId: rule.spenderId,
                    windowSeconds: rule.windowSeconds
                }),
                burst: rule.burstValue ?? rule.limitValue,
                refillPerWindow: rule.limitValue,
                windowMs: rule.windowSeconds * 1000,
                spenderType: spender.spenderType,
                spenderId: rule.spenderId === '' ? null : rule.spenderId,
                isFallback: false
            }));
        const hasRuleForEverySpender = spenderRules.some((rule)=>rule.spenderId === '');
        const fallbackBuckets = defaultUsageLimitFallbacks.filter((fallback)=>fallback.spenderType === spender.spenderType && !(fallback.isOverridable && hasRuleForEverySpender)).map((fallback)=>(0, _buildfallbackspeedbucketutil.buildFallbackSpeedBucket)({
                fallback,
                spender,
                authContext,
                resourceType,
                operationType
            })).filter(_utils.isDefined);
        return [
            ...ruleBuckets,
            ...fallbackBuckets
        ];
    });
    return buckets.sort((a, b)=>bucketSpecificity(a) - bucketSpecificity(b));
};

//# sourceMappingURL=build-speed-buckets.util.js.map
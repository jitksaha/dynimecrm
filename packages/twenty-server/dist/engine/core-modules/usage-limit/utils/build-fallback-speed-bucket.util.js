"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildFallbackSpeedBucket", {
    enumerable: true,
    get: function() {
        return buildFallbackSpeedBucket;
    }
});
const _utils = require("twenty-shared/utils");
const _buildspeedbucketkeyutil = require("./build-speed-bucket-key.util");
const _getapplicationuniversalidentifierutil = require("./get-application-universal-identifier.util");
const buildFallbackSpeedBucket = ({ fallback, spender, authContext, resourceType, operationType })=>{
    const isCrossWorkspace = fallback.counterScope === 'crossWorkspace';
    const isIdentifiedAcrossWorkspaces = spender.spenderType === 'application';
    const universalIdentifier = (0, _getapplicationuniversalidentifierutil.getApplicationUniversalIdentifier)(authContext);
    if (isCrossWorkspace && isIdentifiedAcrossWorkspaces && !(0, _utils.isDefined)(universalIdentifier)) {
        return null;
    }
    const spenderId = isCrossWorkspace && isIdentifiedAcrossWorkspaces ? universalIdentifier : null;
    return {
        key: (0, _buildspeedbucketkeyutil.buildSpeedBucketKey)({
            counterScope: fallback.counterScope,
            workspaceId: authContext.workspace.id,
            resourceType,
            operationType,
            spenderType: spender.spenderType,
            spenderId,
            windowSeconds: Math.ceil(fallback.windowMs / 1000)
        }),
        burst: fallback.maxTokens,
        refillPerWindow: fallback.maxTokens,
        windowMs: fallback.windowMs,
        spenderType: spender.spenderType,
        spenderId,
        isFallback: true
    };
};

//# sourceMappingURL=build-fallback-speed-bucket.util.js.map
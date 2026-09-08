"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildAiAgentStepLog", {
    enumerable: true,
    get: function() {
        return buildAiAgentStepLog;
    }
});
const _mapaistepstotoolcalllogsutil = require("../../../../../../engine/metadata-modules/ai/ai-agent-execution/utils/map-ai-steps-to-tool-call-logs.util");
const buildAiAgentStepLog = ({ executionResult, durationMs })=>{
    if (!executionResult.modelId) {
        return null;
    }
    const toolCalls = executionResult.steps ? (0, _mapaistepstotoolcalllogsutil.mapAiStepsToToolCallLogs)(executionResult.steps) : [];
    const details = {
        type: 'AI_AGENT',
        modelId: executionResult.modelId,
        usage: {
            inputTokens: executionResult.usage.inputTokens ?? 0,
            outputTokens: executionResult.usage.outputTokens ?? 0,
            reasoningTokens: executionResult.usage.outputTokenDetails?.reasoningTokens,
            cacheReadTokens: executionResult.usage.inputTokenDetails?.cacheReadTokens,
            cacheCreationTokens: executionResult.cacheCreationTokens,
            totalTokens: executionResult.usage.totalTokens ?? 0
        },
        cost: {
            totalCostInDollars: executionResult.totalCostInDollars ?? 0,
            creditsUsedMicro: executionResult.creditsUsedMicro ?? 0
        },
        nativeWebSearchCallCount: executionResult.nativeWebSearchCallCount,
        toolCalls,
        durationMs
    };
    return {
        details,
        entries: [],
        sizeBytes: 0
    };
};

//# sourceMappingURL=build-ai-agent-step-log.util.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "repairToolCall", {
    enumerable: true,
    get: function() {
        return repairToolCall;
    }
});
const _ai = require("ai");
const _extractcachecreationtokensutil = require("../../ai-billing/utils/extract-cache-creation-tokens.util");
const _buildaitelemetryutil = require("../../ai-models/utils/build-ai-telemetry.util");
const repairToolCall = async ({ toolCall, tools, inputSchema, error, model, billingContext })=>{
    // Don't attempt to fix invalid tool names
    if (_ai.NoSuchToolError.isInstance(error)) {
        return null;
    }
    const tool = tools[toolCall.toolName];
    if (!tool || typeof tool !== 'object' || !('inputSchema' in tool)) {
        return null;
    }
    const schema = inputSchema(toolCall);
    if (!schema || typeof schema !== 'object') {
        return null;
    }
    let usage;
    let steps;
    try {
        const result = await (0, _ai.generateText)({
            model,
            output: _ai.Output.object({
                schema: schema
            }),
            prompt: [
                `The AI model attempted to call the tool "${toolCall.toolName}" with invalid input.`,
                ``,
                `Input provided:`,
                JSON.stringify(toolCall.input, null, 2),
                ``,
                `Error encountered:`,
                error.message,
                ``,
                `Please fix the input to exactly match the required schema.`,
                `Pay special attention to:`,
                `- Enum values must match exactly (e.g., "DescNullsLast" not "desc")`,
                `- Object structures must match the schema shape`,
                `- Array items must follow the specified format`
            ].join('\n'),
            experimental_telemetry: (0, _buildaitelemetryutil.buildAiTelemetry)({
                functionId: 'repair-tool-call',
                workspaceId: billingContext?.workspaceId,
                userWorkspaceId: billingContext?.userWorkspaceId
            })
        });
        usage = result.usage;
        steps = result.steps;
        const repairedInput = result.output;
        if (repairedInput == null) {
            return null;
        }
        return {
            type: 'tool-call',
            toolCallId: toolCall.toolCallId,
            toolName: toolCall.toolName,
            input: JSON.stringify(repairedInput)
        };
    } catch  {
        return null;
    } finally{
        if (billingContext && usage) {
            const cacheCreationTokens = steps ? (0, _extractcachecreationtokensutil.extractCacheCreationTokensFromSteps)(steps) : 0;
            void billingContext.aiBillingService.calculateAndBillUsage(billingContext.modelId, {
                usage,
                cacheCreationTokens
            }, billingContext.workspaceId, billingContext.operationType, null, billingContext.userWorkspaceId);
        }
    }
};

//# sourceMappingURL=repair-tool-call.util.js.map
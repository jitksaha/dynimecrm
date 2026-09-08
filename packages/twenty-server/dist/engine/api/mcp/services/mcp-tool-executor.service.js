"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "McpToolExecutorService", {
    enumerable: true,
    get: function() {
        return McpToolExecutorService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _toolexecutiondurationmsbucketboundariesconstant = require("../../../core-modules/metrics/constants/tool-execution-duration-ms-bucket-boundaries.constant");
const _tooloutputtokensbucketboundariesconstant = require("../../../core-modules/metrics/constants/tool-output-tokens-bucket-boundaries.constant");
const _metricsservice = require("../../../core-modules/metrics/metrics.service");
const _metricskeystype = require("../../../core-modules/metrics/types/metrics-keys.type");
const _estimatetooloutputtokensutil = require("../../../core-modules/tool-provider/utils/estimate-tool-output-tokens.util");
const _gettoolmetricnameutil = require("../../../core-modules/tool-provider/utils/get-tool-metric-name.util");
const _istooloutputsuccessfulutil = require("../../../core-modules/tool-provider/utils/is-tool-output-successful.util");
const _resolvetoolnameutil = require("../../../core-modules/tool-provider/utils/resolve-tool-name.util");
const _jsonrpcerrorcodeconst = require("../constants/json-rpc-error-code.const");
const _mcpprogressnotificationconst = require("../constants/mcp-progress-notification.const");
const _getprogresstokenutil = require("../utils/get-progress-token.util");
const _wrapjsonrpcresponseutil = require("../utils/wrap-jsonrpc-response.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const unwrapJsonSchema = (schema)=>schema && typeof schema === 'object' && 'jsonSchema' in schema ? schema.jsonSchema : schema;
let McpToolExecutorService = class McpToolExecutorService {
    async handleToolCall(id, toolSet, params, sseWriter) {
        if (!(0, _guards.isNonEmptyString)(params.name)) {
            return (0, _wrapjsonrpcresponseutil.wrapJsonRpcResponse)(id, {
                error: {
                    code: _jsonrpcerrorcodeconst.JSON_RPC_ERROR_CODE.INVALID_PARAMS,
                    message: 'Tool name is required'
                }
            });
        }
        const toolName = params.name;
        const tool = toolSet[toolName];
        if (!(0, _utils.isDefined)(tool) || !(0, _utils.isDefined)(tool.execute)) {
            return (0, _wrapjsonrpcresponseutil.wrapJsonRpcResponse)(id, {
                error: {
                    code: _jsonrpcerrorcodeconst.JSON_RPC_ERROR_CODE.INVALID_PARAMS,
                    message: `Unknown tool: ${toolName}`
                }
            });
        }
        const progressToken = (0, _getprogresstokenutil.getProgressToken)(params);
        if ((0, _utils.isDefined)(sseWriter) && (0, _utils.isDefined)(progressToken)) {
            sseWriter({
                jsonrpc: '2.0',
                method: _mcpprogressnotificationconst.MCP_PROGRESS_NOTIFICATION_METHOD,
                params: {
                    progressToken,
                    progress: 0,
                    total: 1
                }
            });
        }
        const metricToolName = (0, _gettoolmetricnameutil.getToolMetricName)((0, _resolvetoolnameutil.resolveToolName)({
            toolName,
            input: params.arguments
        }));
        const executionStartedAt = performance.now();
        try {
            const result = await tool.execute(params.arguments, {
                toolCallId: '1',
                messages: []
            });
            this.metricsService.recordHistogram({
                key: _metricskeystype.MetricsKeys.McpToolExecutionDurationMs,
                value: performance.now() - executionStartedAt,
                unit: 'ms',
                attributes: {
                    tool: metricToolName
                },
                bucketBoundaries: _toolexecutiondurationmsbucketboundariesconstant.TOOL_EXECUTION_DURATION_MS_BUCKET_BOUNDARIES
            });
            const succeeded = (0, _istooloutputsuccessfulutil.isToolOutputSuccessful)(result);
            this.metricsService.incrementCounterBy({
                key: succeeded ? _metricskeystype.MetricsKeys.McpToolExecutionSucceeded : _metricskeystype.MetricsKeys.McpToolExecutionFailed,
                amount: 1,
                attributes: {
                    tool: metricToolName
                }
            });
            this.metricsService.recordHistogram({
                key: _metricskeystype.MetricsKeys.McpToolOutputTokens,
                value: (0, _estimatetooloutputtokensutil.estimateToolOutputTokens)(result),
                unit: 'token',
                attributes: {
                    tool: metricToolName
                },
                bucketBoundaries: _tooloutputtokensbucketboundariesconstant.TOOL_OUTPUT_TOKENS_BUCKET_BOUNDARIES
            });
            return (0, _wrapjsonrpcresponseutil.wrapJsonRpcResponse)(id, {
                result: {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result)
                        }
                    ],
                    isError: !succeeded
                }
            });
        } catch (executionError) {
            this.metricsService.recordHistogram({
                key: _metricskeystype.MetricsKeys.McpToolExecutionDurationMs,
                value: performance.now() - executionStartedAt,
                unit: 'ms',
                attributes: {
                    tool: metricToolName
                },
                bucketBoundaries: _toolexecutiondurationmsbucketboundariesconstant.TOOL_EXECUTION_DURATION_MS_BUCKET_BOUNDARIES
            });
            this.metricsService.incrementCounterBy({
                key: _metricskeystype.MetricsKeys.McpToolExecutionFailed,
                amount: 1,
                attributes: {
                    tool: metricToolName
                }
            });
            return (0, _wrapjsonrpcresponseutil.wrapJsonRpcResponse)(id, {
                result: {
                    content: [
                        {
                            type: 'text',
                            text: executionError instanceof Error ? executionError.message : 'Tool execution failed'
                        }
                    ],
                    isError: true
                }
            });
        }
    }
    handleToolsListing(id, toolSet) {
        const toolsArray = Object.entries(toolSet).filter(([, def])=>!!def.inputSchema).map(([name, def])=>{
            const toolDefinition = def;
            // Unwrap the AI SDK's jsonSchema wrapper if present
            // The AI SDK serializes schemas as { jsonSchema: {...} } but MCP expects {...} directly
            const inputSchema = unwrapJsonSchema(toolDefinition.inputSchema);
            return {
                name,
                description: toolDefinition.description,
                inputSchema,
                ...(0, _utils.isDefined)(toolDefinition.annotations) && {
                    annotations: toolDefinition.annotations
                }
            };
        });
        return (0, _wrapjsonrpcresponseutil.wrapJsonRpcResponse)(id, {
            result: {
                tools: toolsArray
            }
        });
    }
    constructor(metricsService){
        this.metricsService = metricsService;
    }
};
McpToolExecutorService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _metricsservice.MetricsService === "undefined" ? Object : _metricsservice.MetricsService
    ])
], McpToolExecutorService);

//# sourceMappingURL=mcp-tool-executor.service.js.map
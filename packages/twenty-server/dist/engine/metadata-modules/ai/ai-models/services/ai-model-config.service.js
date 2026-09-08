"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AiModelConfigService", {
    enumerable: true,
    get: function() {
        return AiModelConfigService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _agentconfigconst = require("../../ai-agent/constants/agent-config.const");
const _aisdkpackageconst = require("../constants/ai-sdk-package.const");
const _aimodelregistryservice = require("./ai-model-registry.service");
const _sdkproviderfactoryservice = require("./sdk-provider-factory.service");
const _getnativemodeltoolsforsdkpackageutil = require("../utils/get-native-model-tools-for-sdk-package.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AiModelConfigService = class AiModelConfigService {
    getReasoningProviderOptions(model) {
        switch(model.sdkPackage){
            case _aisdkpackageconst.AI_SDK_ANTHROPIC:
                return this.getAnthropicProviderOptions(model);
            case _aisdkpackageconst.AI_SDK_BEDROCK:
                return this.getBedrockProviderOptions(model);
            default:
                return {};
        }
    }
    getNativeModelTools(model, options = {}) {
        const tools = {};
        const nativeTools = (0, _getnativemodeltoolsforsdkpackageutil.getNativeModelToolsForSdkPackage)(model.sdkPackage);
        const providerName = model.providerName;
        if (!(0, _utils.isDefined)(nativeTools) || !(0, _utils.isDefined)(providerName)) {
            return tools;
        }
        switch(model.sdkPackage){
            case _aisdkpackageconst.AI_SDK_ANTHROPIC:
                {
                    if (options.webSearch === true && (0, _utils.isDefined)(nativeTools.webSearch)) {
                        const anthropicProvider = this.sdkProviderFactory.getRawAnthropicProvider(providerName);
                        if ((0, _utils.isDefined)(anthropicProvider)) {
                            tools[nativeTools.webSearch.directToolName] = anthropicProvider.tools.webSearch_20250305();
                        }
                    }
                    break;
                }
            case _aisdkpackageconst.AI_SDK_OPENAI:
                {
                    if (options.webSearch === true && (0, _utils.isDefined)(nativeTools.webSearch)) {
                        const openaiProvider = this.sdkProviderFactory.getRawOpenAIProvider(providerName);
                        if ((0, _utils.isDefined)(openaiProvider)) {
                            tools[nativeTools.webSearch.directToolName] = openaiProvider.tools.webSearch();
                        }
                    }
                    break;
                }
            case _aisdkpackageconst.AI_SDK_XAI:
                {
                    const xaiProvider = this.sdkProviderFactory.getRawXaiProvider(providerName);
                    if (!(0, _utils.isDefined)(xaiProvider)) {
                        break;
                    }
                    if (options.webSearch === true && (0, _utils.isDefined)(nativeTools.webSearch)) {
                        tools[nativeTools.webSearch.directToolName] = xaiProvider.tools.webSearch();
                    }
                    if (options.twitterSearch === true && (0, _utils.isDefined)(nativeTools.twitterSearch)) {
                        tools[nativeTools.twitterSearch.directToolName] = xaiProvider.tools.xSearch();
                    }
                    break;
                }
        }
        return tools;
    }
    getAnthropicProviderOptions(model) {
        if (!model.supportsReasoning) {
            return {};
        }
        return {
            anthropic: {
                thinking: {
                    type: 'enabled',
                    budgetTokens: _agentconfigconst.AGENT_CONFIG.REASONING_BUDGET_TOKENS
                }
            }
        };
    }
    getBedrockProviderOptions(model) {
        if (!model.supportsReasoning) {
            return {};
        }
        return {
            bedrock: {
                thinking: {
                    type: 'enabled',
                    budgetTokens: _agentconfigconst.AGENT_CONFIG.REASONING_BUDGET_TOKENS
                }
            }
        };
    }
    constructor(aiModelRegistryService, sdkProviderFactory){
        this.aiModelRegistryService = aiModelRegistryService;
        this.sdkProviderFactory = sdkProviderFactory;
    }
};
AiModelConfigService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _aimodelregistryservice.AiModelRegistryService === "undefined" ? Object : _aimodelregistryservice.AiModelRegistryService,
        typeof _sdkproviderfactoryservice.SdkProviderFactoryService === "undefined" ? Object : _sdkproviderfactoryservice.SdkProviderFactoryService
    ])
], AiModelConfigService);

//# sourceMappingURL=ai-model-config.service.js.map
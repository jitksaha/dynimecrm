/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AdminPanelAiProviderService", {
    enumerable: true,
    get: function() {
        return AdminPanelAiProviderService;
    }
});
const _common = require("@nestjs/common");
const _maxseatswithoutenterprisekeyconstant = require("../../enterprise/constants/max-seats-without-enterprise-key.constant");
const _enterpriseexception = require("../../enterprise/enterprise.exception");
const _customaiprovideraccessservice = require("../../enterprise/services/custom-ai-provider-access.service");
const _graphqlerrorsutil = require("../../graphql/utils/graphql-errors.util");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
const _aimodelregistryservice = require("../../../metadata-modules/ai/ai-models/services/ai-model-registry.service");
const _defaultaicatalogservice = require("../../../metadata-modules/ai/ai-models/services/default-ai-catalog.service");
const _aiproviderconfigschema = require("../../../metadata-modules/ai/ai-models/types/ai-provider-config.schema");
const _aiprovidermodelconfigschema = require("../../../metadata-modules/ai/ai-models/types/ai-provider-model-config.schema");
const _extractconfigvariablenameutil = require("../../../metadata-modules/ai/ai-models/utils/extract-config-variable-name.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const PROVIDER_NAME_PATTERN = /^[a-zA-Z0-9_-]+$/;
let AdminPanelAiProviderService = class AdminPanelAiProviderService {
    // Counting here rather than reading the cached verdict keeps the admin panel
    // exact, and refreshes what model resolution will use on its next read.
    async getCustomAiProviderAccess() {
        return this.customAiProviderAccessService.computeAccess();
    }
    async assertCustomAiProviderAccess() {
        const { hasAccess, seatCount } = await this.getCustomAiProviderAccess();
        if (hasAccess) {
            return;
        }
        throw new _enterpriseexception.EnterpriseException(`Custom AI providers require a valid enterprise key above ${_maxseatswithoutenterprisekeyconstant.MAX_SEATS_WITHOUT_ENTERPRISE_KEY} seats (this instance has ${seatCount})`, _enterpriseexception.EnterpriseExceptionCode.ENTERPRISE_SEAT_THRESHOLD_EXCEEDED);
    }
    getMaskedProviders() {
        const providers = this.aiModelRegistryService.getResolvedProvidersForAdmin();
        const catalogNames = this.aiModelRegistryService.getCatalogProviderNames();
        const rawCatalog = this.defaultAiCatalogService.getDefaultAiCatalog();
        const masked = {};
        for (const [key, config] of Object.entries(providers)){
            const isCatalog = catalogNames.has(key);
            const rawConfig = isCatalog ? rawCatalog[key] : undefined;
            const apiKeyConfigVariable = rawConfig ? (0, _extractconfigvariablenameutil.extractConfigVariableName)(rawConfig.apiKey) : undefined;
            masked[key] = {
                npm: config.npm,
                label: config.label ?? key,
                source: isCatalog ? 'catalog' : 'custom',
                ...config.authType && {
                    authType: config.authType
                },
                ...config.name && {
                    name: config.name
                },
                ...config.baseUrl && {
                    baseUrl: config.baseUrl
                },
                ...config.region && {
                    region: config.region
                },
                ...config.dataResidency && {
                    dataResidency: config.dataResidency
                },
                ...config.apiKey && {
                    apiKey: `${config.apiKey.substring(0, 8)}...`
                },
                ...apiKeyConfigVariable && {
                    apiKeyConfigVariable
                },
                hasAccessKey: !!(config.accessKeyId && config.secretAccessKey)
            };
        }
        return masked;
    }
    // Both configs arrive as untyped JSON from the GraphQL layer, so they are
    // taken as unknown and given their shape by the schemas below.
    async addProvider({ providerName, providerConfig }) {
        await this.assertCustomAiProviderAccess();
        if (!PROVIDER_NAME_PATTERN.test(providerName)) {
            throw new _graphqlerrorsutil.UserInputError('Invalid provider name');
        }
        // The GraphQL arg is untyped JSON, so an unsupported npm package would only
        // surface later when the registry builds the provider, taking down model
        // resolution for every provider on the instance.
        const validatedProviderConfig = _aiproviderconfigschema.aiProviderConfigSchema.safeParse(providerConfig);
        if (!validatedProviderConfig.success) {
            throw new _graphqlerrorsutil.UserInputError(`Invalid provider configuration: ${validatedProviderConfig.error.issues.map((issue)=>`${issue.path.join('.')} ${issue.message}`).join(', ')}`);
        }
        const customProviders = {
            ...this.twentyConfigService.get('AI_PROVIDERS')
        };
        customProviders[providerName] = validatedProviderConfig.data;
        await this.twentyConfigService.set('AI_PROVIDERS', customProviders);
        return true;
    }
    // Removal stays open so an instance that grows past the threshold can still
    // clean up the providers it configured while it was under it.
    async removeProvider(providerName) {
        const customProviders = {
            ...this.twentyConfigService.get('AI_PROVIDERS')
        };
        delete customProviders[providerName];
        await this.twentyConfigService.set('AI_PROVIDERS', customProviders);
        return true;
    }
    async addModelToProvider({ providerName, modelConfig }) {
        await this.assertCustomAiProviderAccess();
        const validatedModelConfig = _aiprovidermodelconfigschema.aiProviderModelConfigSchema.safeParse(modelConfig);
        if (!validatedModelConfig.success) {
            throw new _graphqlerrorsutil.UserInputError(`Invalid model configuration: ${validatedModelConfig.error.issues.map((issue)=>`${issue.path.join('.')} ${issue.message}`).join(', ')}`);
        }
        const customProviders = {
            ...this.twentyConfigService.get('AI_PROVIDERS')
        };
        const existing = customProviders[providerName];
        if (!existing) {
            throw new _graphqlerrorsutil.UserInputError(`Provider "${providerName}" not found in custom providers`);
        }
        const existingModels = existing.models ?? [];
        const alreadyExists = existingModels.some((model)=>model.name === validatedModelConfig.data.name);
        if (alreadyExists) {
            throw new _graphqlerrorsutil.UserInputError(`Model "${validatedModelConfig.data.name}" already exists on provider "${providerName}"`);
        }
        customProviders[providerName] = {
            ...existing,
            models: [
                ...existingModels,
                {
                    ...validatedModelConfig.data,
                    source: 'manual'
                }
            ]
        };
        await this.twentyConfigService.set('AI_PROVIDERS', customProviders);
        return true;
    }
    async removeModelFromProvider({ providerName, modelName }) {
        const customProviders = {
            ...this.twentyConfigService.get('AI_PROVIDERS')
        };
        const existing = customProviders[providerName];
        if (!existing) {
            throw new _graphqlerrorsutil.UserInputError(`Provider "${providerName}" not found in custom providers`);
        }
        const existingModels = existing.models ?? [];
        customProviders[providerName] = {
            ...existing,
            models: existingModels.filter((model)=>model.name !== modelName)
        };
        await this.twentyConfigService.set('AI_PROVIDERS', customProviders);
        return true;
    }
    constructor(twentyConfigService, customAiProviderAccessService, aiModelRegistryService, defaultAiCatalogService){
        this.twentyConfigService = twentyConfigService;
        this.customAiProviderAccessService = customAiProviderAccessService;
        this.aiModelRegistryService = aiModelRegistryService;
        this.defaultAiCatalogService = defaultAiCatalogService;
    }
};
AdminPanelAiProviderService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _customaiprovideraccessservice.CustomAiProviderAccessService === "undefined" ? Object : _customaiprovideraccessservice.CustomAiProviderAccessService,
        typeof _aimodelregistryservice.AiModelRegistryService === "undefined" ? Object : _aimodelregistryservice.AiModelRegistryService,
        typeof _defaultaicatalogservice.DefaultAiCatalogService === "undefined" ? Object : _defaultaicatalogservice.DefaultAiCatalogService
    ])
], AdminPanelAiProviderService);

//# sourceMappingURL=admin-panel-ai-provider.service.js.map
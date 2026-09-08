/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AdminPanelAiProviderResolver", {
    enumerable: true,
    get: function() {
        return AdminPanelAiProviderResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _graphqltypejson = /*#__PURE__*/ _interop_require_default(require("graphql-type-json"));
const _constants = require("twenty-shared/constants");
const _adminresolverdecorator = require("../../api/graphql/graphql-config/decorators/admin-resolver.decorator");
const _customaiprovideraccessdto = require("./dtos/custom-ai-provider-access.dto");
const _adminpanelaiproviderservice = require("./services/admin-panel-ai-provider.service");
const _authgraphqlapiexceptionfilter = require("../auth/filters/auth-graphql-api-exception.filter");
const _enterpriseexceptionfilter = require("../enterprise/enterprise-exception.filter");
const _preventnesttoautologgraphqlerrorsfilter = require("../graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter");
const _resolvervalidationpipe = require("../graphql/pipes/resolver-validation.pipe");
const _configvariablegraphqlapiexceptionfilter = require("../twenty-config/filters/config-variable-graphql-api-exception.filter");
const _adminpanelguard = require("../../guards/admin-panel-guard");
const _settingspermissionguard = require("../../guards/settings-permission.guard");
const _userauthguard = require("../../guards/user-auth.guard");
const _workspaceauthguard = require("../../guards/workspace-auth.guard");
const _modelsdevmodelsuggestiondto = require("./dtos/models-dev-model-suggestion.dto");
const _modelsdevprovidersuggestiondto = require("./dtos/models-dev-provider-suggestion.dto");
const _modelsdevcatalogservice = require("../../metadata-modules/ai/ai-models/services/models-dev-catalog.service");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let AdminPanelAiProviderResolver = class AdminPanelAiProviderResolver {
    async getCustomAiProviderAccess() {
        return this.adminPanelAiProviderService.getCustomAiProviderAccess();
    }
    async getAiProviders() {
        return this.adminPanelAiProviderService.getMaskedProviders();
    }
    async addAiProvider(providerName, providerConfig) {
        return this.adminPanelAiProviderService.addProvider({
            providerName,
            providerConfig
        });
    }
    async removeAiProvider(providerName) {
        return this.adminPanelAiProviderService.removeProvider(providerName);
    }
    async getModelsDevProviders() {
        return this.modelsDevCatalogService.getProviderSuggestions();
    }
    async getModelsDevSuggestions(providerType) {
        return this.modelsDevCatalogService.getModelSuggestions(providerType);
    }
    async addModelToProvider(providerName, modelConfig) {
        return this.adminPanelAiProviderService.addModelToProvider({
            providerName,
            modelConfig
        });
    }
    async removeModelFromProvider(providerName, modelName) {
        return this.adminPanelAiProviderService.removeModelFromProvider({
            providerName,
            modelName
        });
    }
    constructor(adminPanelAiProviderService, modelsDevCatalogService){
        this.adminPanelAiProviderService = adminPanelAiProviderService;
        this.modelsDevCatalogService = modelsDevCatalogService;
    }
};
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>_customaiprovideraccessdto.CustomAiProviderAccessDTO),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], AdminPanelAiProviderResolver.prototype, "getCustomAiProviderAccess", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>_graphqltypejson.default),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], AdminPanelAiProviderResolver.prototype, "getAiProviders", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>Boolean),
    _ts_param(0, (0, _graphql.Args)('providerName', {
        type: ()=>String
    })),
    _ts_param(1, (0, _graphql.Args)('providerConfig', {
        type: ()=>_graphqltypejson.default
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelAiProviderResolver.prototype, "addAiProvider", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>Boolean),
    _ts_param(0, (0, _graphql.Args)('providerName', {
        type: ()=>String
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelAiProviderResolver.prototype, "removeAiProvider", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>[
            _modelsdevprovidersuggestiondto.ModelsDevProviderSuggestionDTO
        ]),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], AdminPanelAiProviderResolver.prototype, "getModelsDevProviders", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>[
            _modelsdevmodelsuggestiondto.ModelsDevModelSuggestionDTO
        ]),
    _ts_param(0, (0, _graphql.Args)('providerType', {
        type: ()=>String
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelAiProviderResolver.prototype, "getModelsDevSuggestions", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>Boolean),
    _ts_param(0, (0, _graphql.Args)('providerName', {
        type: ()=>String
    })),
    _ts_param(1, (0, _graphql.Args)('modelConfig', {
        type: ()=>_graphqltypejson.default
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelAiProviderResolver.prototype, "addModelToProvider", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>Boolean),
    _ts_param(0, (0, _graphql.Args)('providerName', {
        type: ()=>String
    })),
    _ts_param(1, (0, _graphql.Args)('modelName', {
        type: ()=>String
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelAiProviderResolver.prototype, "removeModelFromProvider", null);
AdminPanelAiProviderResolver = _ts_decorate([
    (0, _common.UsePipes)(_resolvervalidationpipe.ResolverValidationPipe),
    (0, _adminresolverdecorator.AdminResolver)(),
    (0, _common.UseFilters)(_authgraphqlapiexceptionfilter.AuthGraphqlApiExceptionFilter, _enterpriseexceptionfilter.EnterpriseExceptionFilter, _preventnesttoautologgraphqlerrorsfilter.PreventNestToAutoLogGraphqlErrorsFilter, _configvariablegraphqlapiexceptionfilter.ConfigVariableGraphqlApiExceptionFilter),
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, _userauthguard.UserAuthGuard, (0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.SECURITY)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _adminpanelaiproviderservice.AdminPanelAiProviderService === "undefined" ? Object : _adminpanelaiproviderservice.AdminPanelAiProviderService,
        typeof _modelsdevcatalogservice.ModelsDevCatalogService === "undefined" ? Object : _modelsdevcatalogservice.ModelsDevCatalogService
    ])
], AdminPanelAiProviderResolver);

//# sourceMappingURL=admin-panel-ai-provider.resolver.js.map
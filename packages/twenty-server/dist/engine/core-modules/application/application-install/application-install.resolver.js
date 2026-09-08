"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationInstallResolver", {
    enumerable: true,
    get: function() {
        return ApplicationInstallResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _constants = require("twenty-shared/constants");
const _utils = require("twenty-shared/utils");
const _metadataresolverdecorator = require("../../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _scalars = require("../../../api/graphql/workspace-schema-builder/graphql-types/scalars");
const _applicationexceptionfilter = require("../application-exception-filter");
const _applicationinstallservice = require("./application-install.service");
const _applicationsyncservice = require("../application-manifest/application-sync.service");
const _uninstallapplicationinput = require("../application-manifest/dtos/uninstall-application.input");
const _marketplacequeryservice = require("../application-marketplace/marketplace-query.service");
const _applicationexception = require("../application.exception");
const _applicationregistrationexceptionfilter = require("../application-registration/application-registration-exception-filter");
const _applicationservice = require("../application.service");
const _applicationdto = require("../dtos/application.dto");
const _updateapplicationinput = require("../dtos/update-application.input");
const _authgraphqlapiexceptionfilter = require("../../auth/filters/auth-graphql-api-exception.filter");
const _metricsservice = require("../../metrics/metrics.service");
const _metricskeystype = require("../../metrics/types/metrics-keys.type");
const _resolvervalidationpipe = require("../../graphql/pipes/resolver-validation.pipe");
const _authworkspacedecorator = require("../../../decorators/auth/auth-workspace.decorator");
const _settingspermissionguard = require("../../../guards/settings-permission.guard");
const _workspaceauthguard = require("../../../guards/workspace-auth.guard");
const _workspacemigrationgraphqlapiexceptioninterceptor = require("../../../workspace-manager/workspace-migration/interceptors/workspace-migration-graphql-api-exception.interceptor");
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
let ApplicationInstallResolver = class ApplicationInstallResolver {
    async findManyApplications({ id: workspaceId }) {
        return this.applicationService.findManyApplications(workspaceId);
    }
    async findOneApplication({ id: workspaceId }, id, universalIdentifier) {
        return await this.applicationService.findOneApplicationOrThrow({
            id,
            universalIdentifier,
            workspaceId
        });
    }
    async installMarketplaceApp(universalIdentifier, version, workspace) {
        await this.installRegisteredApplication({
            universalIdentifier,
            version,
            workspaceId: workspace.id
        });
        return true;
    }
    async installApplication(universalIdentifier, version, workspace) {
        await this.installRegisteredApplication({
            universalIdentifier,
            version,
            workspaceId: workspace.id
        });
        return this.applicationService.findOneApplicationOrThrow({
            universalIdentifier,
            workspaceId: workspace.id
        });
    }
    async installRegisteredApplication(params) {
        const registration = await this.marketplaceQueryService.findRegistrationByUniversalIdentifier(params.universalIdentifier);
        await this.applicationInstallService.installApplication({
            appRegistrationId: registration.id,
            version: params.version,
            workspaceId: params.workspaceId
        });
    }
    async updateApplication(id, input, { id: workspaceId }) {
        await this.applicationService.findOneApplicationOrThrow({
            id,
            workspaceId
        });
        return this.applicationService.update(id, {
            ...(0, _utils.isDefined)(input.autoUpgrade) ? {
                autoUpgrade: input.autoUpgrade
            } : {},
            workspaceId
        });
    }
    async uninstallApplication({ universalIdentifier }, { id: workspaceId }) {
        const application = await this.applicationService.findByUniversalIdentifier({
            universalIdentifier,
            workspaceId
        });
        const attributes = {
            universal_identifier: universalIdentifier,
            app_name: application?.name ?? 'unknown',
            source_type: application?.sourceType ?? 'unknown',
            version: application?.version ?? 'unknown'
        };
        try {
            await this.applicationSyncService.uninstallApplication({
                applicationUniversalIdentifier: universalIdentifier,
                workspaceId
            });
        } catch (error) {
            this.metricsService.incrementCounterBy({
                key: _metricskeystype.MetricsKeys.AppUninstallFailed,
                amount: 1,
                attributes: {
                    ...attributes,
                    error_code: error instanceof _applicationexception.ApplicationException ? error.code : 'UNKNOWN'
                }
            });
            throw error;
        }
        this.metricsService.incrementCounterBy({
            key: _metricskeystype.MetricsKeys.AppUninstallSucceeded,
            amount: 1,
            attributes
        });
        return true;
    }
    constructor(applicationService, applicationInstallService, applicationSyncService, marketplaceQueryService, metricsService){
        this.applicationService = applicationService;
        this.applicationInstallService = applicationInstallService;
        this.applicationSyncService = applicationSyncService;
        this.marketplaceQueryService = marketplaceQueryService;
        this.metricsService = metricsService;
    }
};
_ts_decorate([
    (0, _graphql.Query)(()=>[
            _applicationdto.ApplicationDTO
        ]),
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.APPLICATIONS)),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof WorkspaceEntity === "undefined" ? Object : WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplicationInstallResolver.prototype, "findManyApplications", null);
_ts_decorate([
    (0, _graphql.Query)(()=>_applicationdto.ApplicationDTO),
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.APPLICATIONS)),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(1, (0, _graphql.Args)('id', {
        type: ()=>_scalars.UUIDScalarType,
        nullable: true
    })),
    _ts_param(2, (0, _graphql.Args)('universalIdentifier', {
        type: ()=>_scalars.UUIDScalarType,
        nullable: true
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof WorkspaceEntity === "undefined" ? Object : WorkspaceEntity,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplicationInstallResolver.prototype, "findOneApplication", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>Boolean, {
        deprecationReason: 'Use installApplication instead'
    }),
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.APPLICATIONS)),
    _ts_param(0, (0, _graphql.Args)('universalIdentifier')),
    _ts_param(1, (0, _graphql.Args)('version', {
        type: ()=>String,
        nullable: true
    })),
    _ts_param(2, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object,
        typeof WorkspaceEntity === "undefined" ? Object : WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplicationInstallResolver.prototype, "installMarketplaceApp", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_applicationdto.ApplicationDTO),
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.APPLICATIONS)),
    _ts_param(0, (0, _graphql.Args)('universalIdentifier')),
    _ts_param(1, (0, _graphql.Args)('version', {
        type: ()=>String,
        nullable: true
    })),
    _ts_param(2, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object,
        typeof WorkspaceEntity === "undefined" ? Object : WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplicationInstallResolver.prototype, "installApplication", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_applicationdto.ApplicationDTO),
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.APPLICATIONS)),
    _ts_param(0, (0, _graphql.Args)('id', {
        type: ()=>_scalars.UUIDScalarType
    })),
    _ts_param(1, (0, _graphql.Args)('input')),
    _ts_param(2, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _updateapplicationinput.UpdateApplicationInput === "undefined" ? Object : _updateapplicationinput.UpdateApplicationInput,
        typeof WorkspaceEntity === "undefined" ? Object : WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplicationInstallResolver.prototype, "updateApplication", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>Boolean),
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.APPLICATIONS)),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _uninstallapplicationinput.UninstallApplicationInput === "undefined" ? Object : _uninstallapplicationinput.UninstallApplicationInput,
        typeof WorkspaceEntity === "undefined" ? Object : WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplicationInstallResolver.prototype, "uninstallApplication", null);
ApplicationInstallResolver = _ts_decorate([
    (0, _common.UsePipes)(_resolvervalidationpipe.ResolverValidationPipe),
    (0, _metadataresolverdecorator.MetadataResolver)(),
    (0, _common.UseFilters)(_applicationexceptionfilter.ApplicationExceptionFilter, _applicationregistrationexceptionfilter.ApplicationRegistrationExceptionFilter, _authgraphqlapiexceptionfilter.AuthGraphqlApiExceptionFilter),
    (0, _common.UseInterceptors)(_workspacemigrationgraphqlapiexceptioninterceptor.WorkspaceMigrationGraphqlApiExceptionInterceptor),
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _applicationinstallservice.ApplicationInstallService === "undefined" ? Object : _applicationinstallservice.ApplicationInstallService,
        typeof _applicationsyncservice.ApplicationSyncService === "undefined" ? Object : _applicationsyncservice.ApplicationSyncService,
        typeof _marketplacequeryservice.MarketplaceQueryService === "undefined" ? Object : _marketplacequeryservice.MarketplaceQueryService,
        typeof _metricsservice.MetricsService === "undefined" ? Object : _metricsservice.MetricsService
    ])
], ApplicationInstallResolver);

//# sourceMappingURL=application-install.resolver.js.map
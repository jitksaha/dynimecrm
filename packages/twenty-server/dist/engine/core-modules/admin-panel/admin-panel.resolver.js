"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AdminPanelResolver", {
    enumerable: true,
    get: function() {
        return AdminPanelResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _typeorm = require("@nestjs/typeorm");
const _graphqltypejson = /*#__PURE__*/ _interop_require_default(require("graphql-type-json"));
const _constants = require("twenty-shared/constants");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _scalars = require("../../api/graphql/workspace-schema-builder/graphql-types/scalars");
const _instanceandallworkspacesupgradestatusdto = require("../upgrade/dtos/instance-and-all-workspaces-upgrade-status.dto");
const _workspaceupgradestatusdto = require("../upgrade/dtos/workspace-upgrade-status.dto");
const _upgradestatusservice = require("../upgrade/services/upgrade-status.service");
const _adminresolverdecorator = require("../../api/graphql/graphql-config/decorators/admin-resolver.decorator");
const _adminpanelhealthservice = require("./admin-panel-health.service");
const _adminpanelqueueservice = require("./admin-panel-queue.service");
const _adminchatthreadmessagesdto = require("./dtos/admin-chat-thread-messages.dto");
const _adminpanelrecentuserdto = require("./dtos/admin-panel-recent-user.dto");
const _paginatedadminchatthreadsdto = require("./dtos/paginated-admin-chat-threads.dto");
const _adminpaneltopworkspacedto = require("./dtos/admin-panel-top-workspace.dto");
const _adminpanelworkspacebillingdto = require("./dtos/admin-panel-workspace-billing.dto");
const _adminpanelworkspacecreditgrantdto = require("./dtos/admin-panel-workspace-credit-grant.dto");
const _grantworkspacecreditsinput = require("./dtos/grant-workspace-credits.input");
const _revokeworkspacecreditgrantinput = require("./dtos/revoke-workspace-credit-grant.input");
const _adminworkspacechatthreaddto = require("./dtos/admin-workspace-chat-thread.dto");
const _configvariabledto = require("./dtos/config-variable.dto");
const _configvariablesdto = require("./dtos/config-variables.dto");
const _deletejobsresponsedto = require("./dtos/delete-jobs-response.dto");
const _queuejobsresponsedto = require("./dtos/queue-jobs-response.dto");
const _retryjobsresponsedto = require("./dtos/retry-jobs-response.dto");
const _revokesigningkeyinput = require("./dtos/revoke-signing-key.input");
const _serveradmindto = require("./dtos/server-admin.dto");
const _signingkeydto = require("./dtos/signing-key.dto");
const _signingkeysadminpaneldto = require("./dtos/signing-keys-admin-panel.dto");
const _systemhealthdto = require("./dtos/system-health.dto");
const _updateserveradminaccessinput = require("./dtos/update-server-admin-access.input");
const _updateworkspacefeatureflaginput = require("./dtos/update-workspace-feature-flag.input");
const _userlookupdto = require("./dtos/user-lookup.dto");
const _userlookupinput = require("./dtos/user-lookup.input");
const _versioninfodto = require("./dtos/version-info.dto");
const _adminchatthreadscopeenum = require("./enums/admin-chat-thread-scope.enum");
const _adminchatthreadsortdirectionenum = require("./enums/admin-chat-thread-sort-direction.enum");
const _adminchatthreadsortfieldenum = require("./enums/admin-chat-thread-sort-field.enum");
const _healthindicatoridenum = require("./enums/health-indicator-id.enum");
const _jobstateenum = require("./enums/job-state.enum");
const _queuemetricstimerangeenum = require("./enums/queue-metrics-time-range.enum");
const _maintenancemodeservice = require("./maintenance-mode.service");
const _adminpanelbillingservice = require("./services/admin-panel-billing.service");
const _adminpanelchatservice = require("./services/admin-panel-chat.service");
const _adminpanelglobalchatthreadsservice = require("./services/admin-panel-global-chat-threads.service");
const _adminpanelconfigservice = require("./services/admin-panel-config.service");
const _adminpanelsigningkeyservice = require("./services/admin-panel-signing-key.service");
const _adminpanelserveradminservice = require("./services/admin-panel-server-admin.service");
const _adminpanelstatisticsservice = require("./services/admin-panel-statistics.service");
const _adminpaneluserlookupservice = require("./services/admin-panel-user-lookup.service");
const _adminpanelversionservice = require("./services/admin-panel-version.service");
const _applicationregistrationvariabledto = require("../application/application-registration-variable/dtos/application-registration-variable.dto");
const _applicationregistrationvariableservice = require("../application/application-registration-variable/application-registration-variable.service");
const _updateapplicationregistrationvariableinput = require("../application/application-registration-variable/dtos/update-application-registration-variable.input");
const _applicationregistrationclaimservice = require("../application/application-registration/application-registration-claim.service");
const _applicationregistrationentity = require("../application/application-registration/application-registration.entity");
const _applicationregistrationservice = require("../application/application-registration/application-registration.service");
const _applicationregistrationsourcetypeenum = require("../application/application-registration/enums/application-registration-source-type.enum");
const _adminapplicationregistrationclaimdto = require("../application/application-registration/dtos/admin-application-registration-claim.dto");
const _applicationregistrationinstalledworkspacesdto = require("../application/application-registration/dtos/application-registration-installed-workspaces.dto");
const _applicationregistrationstatsdto = require("../application/application-registration/dtos/application-registration-stats.dto");
const _findapplicationregistrationinstalledworkspacesinput = require("../application/application-registration/dtos/find-application-registration-installed-workspaces.input");
const _paginatedapplicationregistrationsdto = require("../application/application-registration/dtos/paginated-application-registrations.dto");
const _updateapplicationregistrationinput = require("../application/application-registration/dtos/update-application-registration.input");
const _authgraphqlapiexceptionfilter = require("../auth/filters/auth-graphql-api-exception.filter");
const _clientconfigentity = require("../client-config/client-config.entity");
const _featureflagexception = require("../feature-flag/feature-flag.exception");
const _featureflagservice = require("../feature-flag/services/feature-flag.service");
const _preventnesttoautologgraphqlerrorsfilter = require("../graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter");
const _resolvervalidationpipe = require("../graphql/pipes/resolver-validation.pipe");
const _graphqlerrorsutil = require("../graphql/utils/graphql-errors.util");
const _marketplacecatalogsynccronjob = require("../application/application-marketplace/crons/marketplace-catalog-sync.cron.job");
const _messagequeuedecorator = require("../message-queue/decorators/message-queue.decorator");
const _messagequeueconstants = require("../message-queue/message-queue.constants");
const _messagequeueservice = require("../message-queue/services/message-queue.service");
const _configvariablegraphqlapiexceptionfilter = require("../twenty-config/filters/config-variable-graphql-api-exception.filter");
const _twentyconfigservice = require("../twenty-config/twenty-config.service");
const _twofactorauthenticationexceptionfilter = require("../two-factor-authentication/two-factor-authentication-exception.filter");
const _usagebreakdownitemdto = require("../usage/dtos/usage-breakdown-item.dto");
const _usageanalyticsservice = require("../usage/services/usage-analytics.service");
const _workspaceentity = require("../workspace/workspace.entity");
const _authuserdecorator = require("../../decorators/auth/auth-user.decorator");
const _authworkspacedecorator = require("../../decorators/auth/auth-workspace.decorator");
const _adminpanelguard = require("../../guards/admin-panel-guard");
const _adminpanelorimpersonateguard = require("../../guards/admin-panel-or-impersonate.guard");
const _noimpersonationguard = require("../../guards/no-impersonation.guard");
const _serverlevelimpersonateguard = require("../../guards/server-level-impersonate.guard");
const _settingspermissionguard = require("../../guards/settings-permission.guard");
const _userauthguard = require("../../guards/user-auth.guard");
const _workspaceauthguard = require("../../guards/workspace-auth.guard");
const _modelfamilylabelsconst = require("../../metadata-modules/ai/ai-models/constants/model-family-labels.const");
const _aimodelpreferencesservice = require("../../metadata-modules/ai/ai-models/services/ai-model-preferences.service");
const _aimodelregistryservice = require("../../metadata-modules/ai/ai-models/services/ai-model-registry.service");
const _aimodelroleenum = require("../../metadata-modules/ai/ai-models/types/ai-model-role.enum");
const _adminpanelhealthservicedatadto = require("./dtos/admin-panel-health-service-data.dto");
const _maintenancemodedto = require("./dtos/maintenance-mode.dto");
const _queuemetricsdatadto = require("./dtos/queue-metrics-data.dto");
const _setmaintenancemodeinput = require("./dtos/set-maintenance-mode.input");
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
let AdminPanelResolver = class AdminPanelResolver {
    async userLookupAdminPanel(userLookupInput) {
        return await this.adminUserLookupService.userLookup(userLookupInput.userIdentifier);
    }
    async adminPanelRecentUsers(searchTerm) {
        return this.adminStatisticsService.getRecentUsers(searchTerm);
    }
    async adminPanelTopWorkspaces(searchTerm) {
        return this.adminStatisticsService.getTopWorkspaces(searchTerm);
    }
    async getServerAdmins() {
        return this.adminServerAdminService.getServerAdmins();
    }
    async updateServerAdminAccess(input, actor, workspace) {
        return this.adminServerAdminService.updateServerAdminAccess({
            actor,
            actorWorkspaceId: workspace.id,
            targetUserId: input.userId,
            canAccessFullAdminPanel: input.canAccessFullAdminPanel,
            canImpersonate: input.canImpersonate,
            otp: input.otp
        });
    }
    async updateWorkspaceFeatureFlag(updateFlagInput) {
        try {
            await this.featureFlagService.upsertWorkspaceFeatureFlag({
                workspaceId: updateFlagInput.workspaceId,
                featureFlag: updateFlagInput.featureFlag,
                value: updateFlagInput.value
            });
            return true;
        } catch (error) {
            if (error instanceof _featureflagexception.FeatureFlagException) {
                throw new _graphqlerrorsutil.UserInputError(error.message);
            }
            throw error;
        }
    }
    async getConfigVariablesGrouped() {
        return this.adminConfigService.getConfigVariablesGrouped();
    }
    async getSystemHealthStatus() {
        return this.adminPanelHealthService.getSystemHealthStatus();
    }
    async getIndicatorHealthStatus(indicatorId) {
        return this.adminPanelHealthService.getIndicatorHealthStatus(indicatorId);
    }
    async getQueueMetrics(queueName, timeRange = _queuemetricstimerangeenum.QueueMetricsTimeRange.OneHour) {
        return await this.adminPanelHealthService.getQueueMetrics(queueName, timeRange);
    }
    async versionInfo() {
        return this.adminVersionService.getVersionInfo();
    }
    async getAdminAiModels() {
        const resolvedProviders = this.aiModelRegistryService.getResolvedProvidersForAdmin();
        const models = this.aiModelRegistryService.getAllModelsWithStatus().map(({ modelConfig, isAvailable, isAdminEnabled, isRecommended, providerName, name })=>({
                modelId: modelConfig.modelId,
                label: modelConfig.label,
                modelFamily: modelConfig.modelFamily,
                modelFamilyLabel: modelConfig.modelFamily ? _modelfamilylabelsconst.MODEL_FAMILY_LABELS[modelConfig.modelFamily] : undefined,
                sdkPackage: modelConfig.sdkPackage,
                isAvailable,
                isAdminEnabled,
                isDeprecated: modelConfig.isDeprecated ?? false,
                isRecommended,
                contextWindowTokens: modelConfig.contextWindowTokens,
                maxOutputTokens: modelConfig.maxOutputTokens,
                inputCostPerMillionTokens: modelConfig.inputCostPerMillionTokens,
                outputCostPerMillionTokens: modelConfig.outputCostPerMillionTokens,
                providerName,
                providerLabel: providerName ? resolvedProviders[providerName]?.label ?? providerName : undefined,
                name,
                dataResidency: modelConfig.dataResidency
            }));
        const prefs = this.aiModelPreferencesService.getPreferences();
        return {
            models,
            defaultSmartModelId: prefs.defaultSmartModels?.[0],
            defaultFastModelId: prefs.defaultFastModels?.[0]
        };
    }
    async setAdminAiModelEnabled(modelId, enabled) {
        await this.aiModelRegistryService.setModelAdminEnabled(modelId, enabled);
        return true;
    }
    async setAdminAiModelsEnabled(modelIds, enabled) {
        await this.aiModelRegistryService.setModelsAdminEnabled(modelIds, enabled);
        return true;
    }
    async setAdminAiModelRecommended(modelId, recommended) {
        await this.aiModelRegistryService.setModelRecommended(modelId, recommended);
        return true;
    }
    async setAdminAiModelsRecommended(modelIds, recommended) {
        await this.aiModelRegistryService.setModelsRecommended(modelIds, recommended);
        return true;
    }
    async setAdminDefaultAiModel(role, modelId) {
        await this.aiModelRegistryService.setDefaultModel(role, modelId);
        return true;
    }
    async getDatabaseConfigVariable(key) {
        this.twentyConfigService.validateConfigVariableExists(key);
        return this.adminConfigService.getConfigVariable(key);
    }
    async createDatabaseConfigVariable(key, value) {
        await this.twentyConfigService.set(key, value);
        return true;
    }
    async updateDatabaseConfigVariable(key, value) {
        await this.twentyConfigService.update(key, value);
        return true;
    }
    async deleteDatabaseConfigVariable(key) {
        await this.twentyConfigService.delete(key);
        return true;
    }
    async getQueueJobs(queueName, state, limit, offset) {
        return await this.adminPanelQueueService.getQueueJobs(queueName, state, limit, offset);
    }
    async retryJobs(queueName, jobIds) {
        return await this.adminPanelQueueService.retryJobs(queueName, jobIds);
    }
    async deleteJobs(queueName, jobIds) {
        return await this.adminPanelQueueService.deleteJobs(queueName, jobIds);
    }
    async findAllApplicationRegistrations(limit, offset, searchTerm, isPreInstalledOnly, sourceTypes, isListed, isConfigured) {
        return this.applicationRegistrationService.findAll({
            limit,
            offset,
            searchTerm,
            isPreInstalledOnly,
            sourceTypes,
            isListed,
            isConfigured
        });
    }
    async syncMarketplaceCatalog() {
        await this.cronQueueService.add(_marketplacecatalogsynccronjob.MarketplaceCatalogSyncCronJob.name, {}, {
            id: 'marketplace-catalog-sync'
        });
        return true;
    }
    async findAdminApplicationRegistrationClaims(applicationRegistrationId) {
        return this.applicationRegistrationClaimService.findClaimsForRegistration(applicationRegistrationId);
    }
    async updateAdminApplicationRegistration(input) {
        return this.applicationRegistrationService.updateGlobal(input);
    }
    async getAdminAiUsageByWorkspace(periodStart, periodEnd) {
        const defaultEnd = new Date();
        const defaultStart = new Date();
        defaultStart.setDate(defaultStart.getDate() - 30);
        const useDollarMode = !this.twentyConfigService.get('IS_BILLING_ENABLED');
        const items = await this.usageAnalyticsService.getAdminAiUsageByWorkspace({
            periodStart: periodStart ?? defaultStart,
            periodEnd: periodEnd ?? defaultEnd,
            useDollarMode
        });
        if (items.length === 0) {
            return items;
        }
        const workspaceIds = items.map((item)=>item.key);
        const workspaces = await this.workspaceRepository.find({
            where: {
                id: (0, _typeorm1.In)(workspaceIds)
            },
            select: {
                id: true,
                displayName: true
            }
        });
        const nameMap = new Map(workspaces.filter((workspace)=>(0, _utils.isDefined)(workspace.displayName)).map((workspace)=>[
                workspace.id,
                workspace.displayName
            ]));
        return items.map((item)=>({
                ...item,
                label: nameMap.get(item.key)
            }));
    }
    async getMaintenanceMode() {
        const value = await this.maintenanceModeService.getMaintenanceMode();
        if (!(0, _utils.isDefined)(value)) {
            return null;
        }
        return {
            startAt: new Date(value.startAt),
            endAt: new Date(value.endAt),
            link: value.link
        };
    }
    async setMaintenanceMode({ startAt, endAt, link }) {
        await this.maintenanceModeService.setMaintenanceMode({
            startAt: startAt.toISOString(),
            endAt: endAt.toISOString(),
            link
        });
        return true;
    }
    async clearMaintenanceMode() {
        await this.maintenanceModeService.clearMaintenanceMode();
        return true;
    }
    async workspaceLookupAdminPanel(workspaceId) {
        return this.adminUserLookupService.workspaceLookup(workspaceId);
    }
    async workspaceBillingAdminPanel(workspaceId) {
        return this.adminBillingService.getWorkspaceBilling(workspaceId);
    }
    async grantWorkspaceCredits(input, actor) {
        return this.adminBillingService.grantWorkspaceCredits({
            workspaceId: input.workspaceId,
            amount: input.amount,
            type: input.type,
            reason: input.reason,
            clientOperationId: input.clientOperationId,
            grantedByUserId: actor.id
        });
    }
    async revokeWorkspaceCreditGrant(input, actor) {
        return this.adminBillingService.revokeWorkspaceCreditGrant({
            workspaceId: input.workspaceId,
            creditGrantId: input.creditGrantId,
            revokedByUserId: actor.id
        });
    }
    async getAdminWorkspaceChatThreads(workspaceId) {
        return this.adminChatService.getWorkspaceChatThreads(workspaceId);
    }
    async getAdminChatThreadMessages(threadId) {
        return this.adminChatService.getChatThreadMessages(threadId);
    }
    async getAdminChatThreads(scope, hasErrorOnly, userNeverEngagedOnly, sortBy, sortDirection, limit, offset, searchTerm) {
        return this.adminGlobalChatThreadsService.getGlobalChatThreads({
            scope: scope ?? _adminchatthreadscopeenum.AdminChatThreadScope.ALL,
            hasErrorOnly: hasErrorOnly ?? false,
            userNeverEngagedOnly: userNeverEngagedOnly ?? false,
            searchTerm: searchTerm ?? undefined,
            sortBy: sortBy ?? _adminchatthreadsortfieldenum.AdminChatThreadSortField.CREATED_AT,
            sortDirection: sortDirection ?? _adminchatthreadsortdirectionenum.AdminChatThreadSortDirection.DESC,
            limit: limit ?? 25,
            offset: offset ?? 0
        });
    }
    async findOneAdminApplicationRegistration(id) {
        return this.applicationRegistrationService.findOneByIdGlobal(id);
    }
    async findAdminApplicationRegistrationVariables(applicationRegistrationId) {
        return this.applicationRegistrationVariableService.findVariablesWithObfuscatedValuesGlobal(applicationRegistrationId);
    }
    async findAdminApplicationRegistrationStats(id) {
        return this.applicationRegistrationService.getStatsGlobal(id);
    }
    async findAdminApplicationRegistrationInstalledWorkspaces({ id, limit, offset, searchTerm }) {
        return this.applicationRegistrationService.getInstalledWorkspacesGlobal(id, limit, offset, searchTerm);
    }
    async updateAdminApplicationRegistrationVariable(input) {
        return this.applicationRegistrationVariableService.updateVariableGlobal(input);
    }
    async getInstanceAndAllWorkspacesUpgradeStatus() {
        return this.upgradeStatusService.getInstanceAndAllWorkspacesStatus();
    }
    async refreshUpgradeStatus() {
        return this.upgradeStatusService.refreshInstanceAndAllWorkspacesStatus();
    }
    async getUpgradeStatus(workspaceIds) {
        if (workspaceIds.length === 0) {
            return [];
        }
        return this.upgradeStatusService.getWorkspaceStatuses(workspaceIds);
    }
    async getSigningKeys() {
        return this.adminPanelSigningKeyService.getSigningKeys();
    }
    async revokeSigningKey({ id }) {
        return this.adminPanelSigningKeyService.revokeSigningKey(id);
    }
    constructor(adminUserLookupService, adminServerAdminService, adminStatisticsService, adminBillingService, adminChatService, adminGlobalChatThreadsService, adminConfigService, adminVersionService, adminPanelHealthService, adminPanelSigningKeyService, applicationRegistrationService, applicationRegistrationClaimService, applicationRegistrationVariableService, adminPanelQueueService, featureFlagService, twentyConfigService, aiModelRegistryService, aiModelPreferencesService, usageAnalyticsService, maintenanceModeService, upgradeStatusService, workspaceRepository, cronQueueService){
        this.adminUserLookupService = adminUserLookupService;
        this.adminServerAdminService = adminServerAdminService;
        this.adminStatisticsService = adminStatisticsService;
        this.adminBillingService = adminBillingService;
        this.adminChatService = adminChatService;
        this.adminGlobalChatThreadsService = adminGlobalChatThreadsService;
        this.adminConfigService = adminConfigService;
        this.adminVersionService = adminVersionService;
        this.adminPanelHealthService = adminPanelHealthService;
        this.adminPanelSigningKeyService = adminPanelSigningKeyService;
        this.applicationRegistrationService = applicationRegistrationService;
        this.applicationRegistrationClaimService = applicationRegistrationClaimService;
        this.applicationRegistrationVariableService = applicationRegistrationVariableService;
        this.adminPanelQueueService = adminPanelQueueService;
        this.featureFlagService = featureFlagService;
        this.twentyConfigService = twentyConfigService;
        this.aiModelRegistryService = aiModelRegistryService;
        this.aiModelPreferencesService = aiModelPreferencesService;
        this.usageAnalyticsService = usageAnalyticsService;
        this.maintenanceModeService = maintenanceModeService;
        this.upgradeStatusService = upgradeStatusService;
        this.workspaceRepository = workspaceRepository;
        this.cronQueueService = cronQueueService;
    }
};
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelorimpersonateguard.AdminPanelOrImpersonateGuard),
    (0, _graphql.Query)(()=>_userlookupdto.UserLookup),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _userlookupinput.UserLookupInput === "undefined" ? Object : _userlookupinput.UserLookupInput
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "userLookupAdminPanel", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelorimpersonateguard.AdminPanelOrImpersonateGuard),
    (0, _graphql.Query)(()=>[
            _adminpanelrecentuserdto.AdminPanelRecentUserDTO
        ]),
    _ts_param(0, (0, _graphql.Args)('searchTerm', {
        type: ()=>String,
        nullable: true,
        defaultValue: ''
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "adminPanelRecentUsers", null);
_ts_decorate([
    (0, _common.UseGuards)(_serverlevelimpersonateguard.ServerLevelImpersonateGuard),
    (0, _graphql.Query)(()=>[
            _adminpaneltopworkspacedto.AdminPanelTopWorkspaceDTO
        ]),
    _ts_param(0, (0, _graphql.Args)('searchTerm', {
        type: ()=>String,
        nullable: true,
        defaultValue: ''
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "adminPanelTopWorkspaces", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard, _noimpersonationguard.NoImpersonationGuard),
    (0, _graphql.Query)(()=>[
            _serveradmindto.ServerAdminDTO
        ]),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "getServerAdmins", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard, _noimpersonationguard.NoImpersonationGuard),
    (0, _graphql.Mutation)(()=>_serveradmindto.ServerAdminDTO),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_param(1, (0, _authuserdecorator.AuthUser)()),
    _ts_param(2, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _updateserveradminaccessinput.UpdateServerAdminAccessInput === "undefined" ? Object : _updateserveradminaccessinput.UpdateServerAdminAccessInput,
        typeof AuthContextUser === "undefined" ? Object : AuthContextUser,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "updateServerAdminAccess", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>Boolean),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _updateworkspacefeatureflaginput.UpdateWorkspaceFeatureFlagInput === "undefined" ? Object : _updateworkspacefeatureflaginput.UpdateWorkspaceFeatureFlagInput
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "updateWorkspaceFeatureFlag", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>_configvariablesdto.ConfigVariablesDTO),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "getConfigVariablesGrouped", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>_systemhealthdto.SystemHealthDTO),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "getSystemHealthStatus", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>_adminpanelhealthservicedatadto.AdminPanelHealthServiceDataDTO),
    _ts_param(0, (0, _graphql.Args)('indicatorId', {
        type: ()=>_healthindicatoridenum.HealthIndicatorId
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _healthindicatoridenum.HealthIndicatorId === "undefined" ? Object : _healthindicatoridenum.HealthIndicatorId
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "getIndicatorHealthStatus", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>_queuemetricsdatadto.QueueMetricsDataDTO),
    _ts_param(0, (0, _graphql.Args)('queueName', {
        type: ()=>String
    })),
    _ts_param(1, (0, _graphql.Args)('timeRange', {
        nullable: true,
        defaultValue: _queuemetricstimerangeenum.QueueMetricsTimeRange.OneHour,
        type: ()=>_queuemetricstimerangeenum.QueueMetricsTimeRange
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _queuemetricstimerangeenum.QueueMetricsTimeRange === "undefined" ? Object : _queuemetricstimerangeenum.QueueMetricsTimeRange
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "getQueueMetrics", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>_versioninfodto.VersionInfoDTO),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "versionInfo", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>_clientconfigentity.AdminAiModelsDTO),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "getAdminAiModels", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>Boolean),
    _ts_param(0, (0, _graphql.Args)('modelId', {
        type: ()=>String
    })),
    _ts_param(1, (0, _graphql.Args)('enabled', {
        type: ()=>Boolean
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Boolean
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "setAdminAiModelEnabled", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>Boolean),
    _ts_param(0, (0, _graphql.Args)('modelIds', {
        type: ()=>[
                String
            ]
    })),
    _ts_param(1, (0, _graphql.Args)('enabled', {
        type: ()=>Boolean
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Array,
        Boolean
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "setAdminAiModelsEnabled", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>Boolean),
    _ts_param(0, (0, _graphql.Args)('modelId', {
        type: ()=>String
    })),
    _ts_param(1, (0, _graphql.Args)('recommended', {
        type: ()=>Boolean
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Boolean
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "setAdminAiModelRecommended", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>Boolean),
    _ts_param(0, (0, _graphql.Args)('modelIds', {
        type: ()=>[
                String
            ]
    })),
    _ts_param(1, (0, _graphql.Args)('recommended', {
        type: ()=>Boolean
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Array,
        Boolean
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "setAdminAiModelsRecommended", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>Boolean),
    _ts_param(0, (0, _graphql.Args)('role', {
        type: ()=>_aimodelroleenum.AiModelRole
    })),
    _ts_param(1, (0, _graphql.Args)('modelId', {
        type: ()=>String
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _aimodelroleenum.AiModelRole === "undefined" ? Object : _aimodelroleenum.AiModelRole,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "setAdminDefaultAiModel", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>_configvariabledto.ConfigVariableDTO),
    _ts_param(0, (0, _graphql.Args)('key', {
        type: ()=>String
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "getDatabaseConfigVariable", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>Boolean),
    _ts_param(0, (0, _graphql.Args)('key', {
        type: ()=>String
    })),
    _ts_param(1, (0, _graphql.Args)('value', {
        type: ()=>_graphqltypejson.default
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "createDatabaseConfigVariable", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>Boolean),
    _ts_param(0, (0, _graphql.Args)('key', {
        type: ()=>String
    })),
    _ts_param(1, (0, _graphql.Args)('value', {
        type: ()=>_graphqltypejson.default
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "updateDatabaseConfigVariable", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>Boolean),
    _ts_param(0, (0, _graphql.Args)('key', {
        type: ()=>String
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "deleteDatabaseConfigVariable", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>_queuejobsresponsedto.QueueJobsResponseDTO),
    _ts_param(0, (0, _graphql.Args)('queueName', {
        type: ()=>String
    })),
    _ts_param(1, (0, _graphql.Args)('state', {
        type: ()=>_jobstateenum.JobStateEnum
    })),
    _ts_param(2, (0, _graphql.Args)('limit', {
        type: ()=>_graphql.Int,
        nullable: true,
        defaultValue: 50
    })),
    _ts_param(3, (0, _graphql.Args)('offset', {
        type: ()=>_graphql.Int,
        nullable: true,
        defaultValue: 0
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _jobstateenum.JobStateEnum === "undefined" ? Object : _jobstateenum.JobStateEnum,
        Number,
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "getQueueJobs", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>_retryjobsresponsedto.RetryJobsResponseDTO),
    _ts_param(0, (0, _graphql.Args)('queueName', {
        type: ()=>String
    })),
    _ts_param(1, (0, _graphql.Args)('jobIds', {
        type: ()=>[
                String
            ]
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Array
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "retryJobs", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>_deletejobsresponsedto.DeleteJobsResponseDTO),
    _ts_param(0, (0, _graphql.Args)('queueName', {
        type: ()=>String
    })),
    _ts_param(1, (0, _graphql.Args)('jobIds', {
        type: ()=>[
                String
            ]
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Array
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "deleteJobs", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>_paginatedapplicationregistrationsdto.PaginatedApplicationRegistrationsDTO),
    _ts_param(0, (0, _graphql.Args)('limit', {
        type: ()=>_graphql.Int,
        nullable: true,
        defaultValue: 25
    })),
    _ts_param(1, (0, _graphql.Args)('offset', {
        type: ()=>_graphql.Int,
        nullable: true,
        defaultValue: 0
    })),
    _ts_param(2, (0, _graphql.Args)('searchTerm', {
        type: ()=>String,
        nullable: true
    })),
    _ts_param(3, (0, _graphql.Args)('isPreInstalledOnly', {
        type: ()=>Boolean,
        nullable: true
    })),
    _ts_param(4, (0, _graphql.Args)('sourceTypes', {
        type: ()=>[
                _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType
            ],
        nullable: true
    })),
    _ts_param(5, (0, _graphql.Args)('isListed', {
        type: ()=>Boolean,
        nullable: true
    })),
    _ts_param(6, (0, _graphql.Args)('isConfigured', {
        type: ()=>Boolean,
        nullable: true
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        Number,
        String,
        Boolean,
        Array,
        Boolean,
        Boolean
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "findAllApplicationRegistrations", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>Boolean),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "syncMarketplaceCatalog", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>[
            _adminapplicationregistrationclaimdto.AdminApplicationRegistrationClaimDTO
        ]),
    _ts_param(0, (0, _graphql.Args)('applicationRegistrationId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "findAdminApplicationRegistrationClaims", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>_applicationregistrationentity.ApplicationRegistrationEntity),
    _ts_param(0, (0, _graphql.Args)('input')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _updateapplicationregistrationinput.UpdateApplicationRegistrationInput === "undefined" ? Object : _updateapplicationregistrationinput.UpdateApplicationRegistrationInput
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "updateAdminApplicationRegistration", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>[
            _usagebreakdownitemdto.UsageBreakdownItemDTO
        ]),
    _ts_param(0, (0, _graphql.Args)('periodStart', {
        type: ()=>Date,
        nullable: true
    })),
    _ts_param(1, (0, _graphql.Args)('periodEnd', {
        type: ()=>Date,
        nullable: true
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Date === "undefined" ? Object : Date,
        typeof Date === "undefined" ? Object : Date
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "getAdminAiUsageByWorkspace", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>_maintenancemodedto.MaintenanceModeDTO, {
        nullable: true
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "getMaintenanceMode", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>Boolean),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _setmaintenancemodeinput.SetMaintenanceModeInput === "undefined" ? Object : _setmaintenancemodeinput.SetMaintenanceModeInput
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "setMaintenanceMode", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>Boolean),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "clearMaintenanceMode", null);
_ts_decorate([
    (0, _common.UseGuards)(_serverlevelimpersonateguard.ServerLevelImpersonateGuard),
    (0, _graphql.Query)(()=>_userlookupdto.UserLookup),
    _ts_param(0, (0, _graphql.Args)('workspaceId', {
        type: ()=>_scalars.UUIDScalarType
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "workspaceLookupAdminPanel", null);
_ts_decorate([
    (0, _common.UseGuards)(_serverlevelimpersonateguard.ServerLevelImpersonateGuard),
    (0, _graphql.Query)(()=>_adminpanelworkspacebillingdto.AdminPanelWorkspaceBillingDTO, {
        nullable: true
    }),
    _ts_param(0, (0, _graphql.Args)('workspaceId', {
        type: ()=>_scalars.UUIDScalarType
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "workspaceBillingAdminPanel", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>_adminpanelworkspacecreditgrantdto.AdminPanelWorkspaceCreditGrantDTO),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_param(1, (0, _authuserdecorator.AuthUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _grantworkspacecreditsinput.GrantWorkspaceCreditsInput === "undefined" ? Object : _grantworkspacecreditsinput.GrantWorkspaceCreditsInput,
        typeof AuthContextUser === "undefined" ? Object : AuthContextUser
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "grantWorkspaceCredits", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>_adminpanelworkspacecreditgrantdto.AdminPanelWorkspaceCreditGrantDTO),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_param(1, (0, _authuserdecorator.AuthUser)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _revokeworkspacecreditgrantinput.RevokeWorkspaceCreditGrantInput === "undefined" ? Object : _revokeworkspacecreditgrantinput.RevokeWorkspaceCreditGrantInput,
        typeof AuthContextUser === "undefined" ? Object : AuthContextUser
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "revokeWorkspaceCreditGrant", null);
_ts_decorate([
    (0, _common.UseGuards)(_serverlevelimpersonateguard.ServerLevelImpersonateGuard),
    (0, _graphql.Query)(()=>[
            _adminworkspacechatthreaddto.AdminWorkspaceChatThreadDTO
        ]),
    _ts_param(0, (0, _graphql.Args)('workspaceId', {
        type: ()=>_scalars.UUIDScalarType
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "getAdminWorkspaceChatThreads", null);
_ts_decorate([
    (0, _common.UseGuards)(_serverlevelimpersonateguard.ServerLevelImpersonateGuard),
    (0, _graphql.Query)(()=>_adminchatthreadmessagesdto.AdminChatThreadMessagesDTO),
    _ts_param(0, (0, _graphql.Args)('threadId', {
        type: ()=>_scalars.UUIDScalarType
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "getAdminChatThreadMessages", null);
_ts_decorate([
    (0, _common.UseGuards)(_serverlevelimpersonateguard.ServerLevelImpersonateGuard),
    (0, _graphql.Query)(()=>_paginatedadminchatthreadsdto.PaginatedAdminChatThreadsDTO),
    _ts_param(0, (0, _graphql.Args)('scope', {
        type: ()=>_adminchatthreadscopeenum.AdminChatThreadScope,
        nullable: true,
        defaultValue: _adminchatthreadscopeenum.AdminChatThreadScope.ALL
    })),
    _ts_param(1, (0, _graphql.Args)('hasErrorOnly', {
        type: ()=>Boolean,
        nullable: true,
        defaultValue: false
    })),
    _ts_param(2, (0, _graphql.Args)('userNeverEngagedOnly', {
        type: ()=>Boolean,
        nullable: true,
        defaultValue: false
    })),
    _ts_param(3, (0, _graphql.Args)('sortBy', {
        type: ()=>_adminchatthreadsortfieldenum.AdminChatThreadSortField,
        nullable: true,
        defaultValue: _adminchatthreadsortfieldenum.AdminChatThreadSortField.CREATED_AT
    })),
    _ts_param(4, (0, _graphql.Args)('sortDirection', {
        type: ()=>_adminchatthreadsortdirectionenum.AdminChatThreadSortDirection,
        nullable: true,
        defaultValue: _adminchatthreadsortdirectionenum.AdminChatThreadSortDirection.DESC
    })),
    _ts_param(5, (0, _graphql.Args)('limit', {
        type: ()=>_graphql.Int,
        nullable: true,
        defaultValue: 25
    })),
    _ts_param(6, (0, _graphql.Args)('offset', {
        type: ()=>_graphql.Int,
        nullable: true,
        defaultValue: 0
    })),
    _ts_param(7, (0, _graphql.Args)('searchTerm', {
        type: ()=>String,
        nullable: true
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        Object,
        Object,
        Object,
        Object,
        Object,
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "getAdminChatThreads", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>_applicationregistrationentity.ApplicationRegistrationEntity),
    _ts_param(0, (0, _graphql.Args)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "findOneAdminApplicationRegistration", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>[
            _applicationregistrationvariabledto.ApplicationRegistrationVariableDTO
        ]),
    _ts_param(0, (0, _graphql.Args)('applicationRegistrationId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "findAdminApplicationRegistrationVariables", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>_applicationregistrationstatsdto.ApplicationRegistrationStatsDTO),
    _ts_param(0, (0, _graphql.Args)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "findAdminApplicationRegistrationStats", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>_applicationregistrationinstalledworkspacesdto.ApplicationRegistrationInstalledWorkspacesDTO),
    _ts_param(0, (0, _graphql.Args)('input')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _findapplicationregistrationinstalledworkspacesinput.FindApplicationRegistrationInstalledWorkspacesInput === "undefined" ? Object : _findapplicationregistrationinstalledworkspacesinput.FindApplicationRegistrationInstalledWorkspacesInput
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "findAdminApplicationRegistrationInstalledWorkspaces", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>_applicationregistrationvariabledto.ApplicationRegistrationVariableDTO),
    _ts_param(0, (0, _graphql.Args)('input')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _updateapplicationregistrationvariableinput.UpdateApplicationRegistrationVariableInput === "undefined" ? Object : _updateapplicationregistrationvariableinput.UpdateApplicationRegistrationVariableInput
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "updateAdminApplicationRegistrationVariable", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>_instanceandallworkspacesupgradestatusdto.InstanceAndAllWorkspacesUpgradeStatusDTO),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "getInstanceAndAllWorkspacesUpgradeStatus", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>_instanceandallworkspacesupgradestatusdto.InstanceAndAllWorkspacesUpgradeStatusDTO),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "refreshUpgradeStatus", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>[
            _workspaceupgradestatusdto.WorkspaceUpgradeStatusDTO
        ]),
    _ts_param(0, (0, _graphql.Args)('workspaceIds', {
        type: ()=>[
                _scalars.UUIDScalarType
            ]
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Array
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "getUpgradeStatus", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>_signingkeysadminpaneldto.SigningKeysAdminPanelDTO),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "getSigningKeys", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>_signingkeydto.SigningKeyDTO),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _revokesigningkeyinput.RevokeSigningKeyInput === "undefined" ? Object : _revokesigningkeyinput.RevokeSigningKeyInput
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "revokeSigningKey", null);
AdminPanelResolver = _ts_decorate([
    (0, _common.UsePipes)(_resolvervalidationpipe.ResolverValidationPipe),
    (0, _adminresolverdecorator.AdminResolver)(),
    (0, _common.UseFilters)(_authgraphqlapiexceptionfilter.AuthGraphqlApiExceptionFilter, _twofactorauthenticationexceptionfilter.TwoFactorAuthenticationExceptionFilter, _preventnesttoautologgraphqlerrorsfilter.PreventNestToAutoLogGraphqlErrorsFilter, _configvariablegraphqlapiexceptionfilter.ConfigVariableGraphqlApiExceptionFilter),
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, _userauthguard.UserAuthGuard, (0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.SECURITY)),
    _ts_param(21, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_param(22, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.cronQueue)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _adminpaneluserlookupservice.AdminPanelUserLookupService === "undefined" ? Object : _adminpaneluserlookupservice.AdminPanelUserLookupService,
        typeof _adminpanelserveradminservice.AdminPanelServerAdminService === "undefined" ? Object : _adminpanelserveradminservice.AdminPanelServerAdminService,
        typeof _adminpanelstatisticsservice.AdminPanelStatisticsService === "undefined" ? Object : _adminpanelstatisticsservice.AdminPanelStatisticsService,
        typeof _adminpanelbillingservice.AdminPanelBillingService === "undefined" ? Object : _adminpanelbillingservice.AdminPanelBillingService,
        typeof _adminpanelchatservice.AdminPanelChatService === "undefined" ? Object : _adminpanelchatservice.AdminPanelChatService,
        typeof _adminpanelglobalchatthreadsservice.AdminPanelGlobalChatThreadsService === "undefined" ? Object : _adminpanelglobalchatthreadsservice.AdminPanelGlobalChatThreadsService,
        typeof _adminpanelconfigservice.AdminPanelConfigService === "undefined" ? Object : _adminpanelconfigservice.AdminPanelConfigService,
        typeof _adminpanelversionservice.AdminPanelVersionService === "undefined" ? Object : _adminpanelversionservice.AdminPanelVersionService,
        typeof _adminpanelhealthservice.AdminPanelHealthService === "undefined" ? Object : _adminpanelhealthservice.AdminPanelHealthService,
        typeof _adminpanelsigningkeyservice.AdminPanelSigningKeyService === "undefined" ? Object : _adminpanelsigningkeyservice.AdminPanelSigningKeyService,
        typeof _applicationregistrationservice.ApplicationRegistrationService === "undefined" ? Object : _applicationregistrationservice.ApplicationRegistrationService,
        typeof _applicationregistrationclaimservice.ApplicationRegistrationClaimService === "undefined" ? Object : _applicationregistrationclaimservice.ApplicationRegistrationClaimService,
        typeof _applicationregistrationvariableservice.ApplicationRegistrationVariableService === "undefined" ? Object : _applicationregistrationvariableservice.ApplicationRegistrationVariableService,
        typeof _adminpanelqueueservice.AdminPanelQueueService === "undefined" ? Object : _adminpanelqueueservice.AdminPanelQueueService,
        typeof _featureflagservice.FeatureFlagService === "undefined" ? Object : _featureflagservice.FeatureFlagService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _aimodelregistryservice.AiModelRegistryService === "undefined" ? Object : _aimodelregistryservice.AiModelRegistryService,
        typeof _aimodelpreferencesservice.AiModelPreferencesService === "undefined" ? Object : _aimodelpreferencesservice.AiModelPreferencesService,
        typeof _usageanalyticsservice.UsageAnalyticsService === "undefined" ? Object : _usageanalyticsservice.UsageAnalyticsService,
        typeof _maintenancemodeservice.MaintenanceModeService === "undefined" ? Object : _maintenancemodeservice.MaintenanceModeService,
        typeof _upgradestatusservice.UpgradeStatusService === "undefined" ? Object : _upgradestatusservice.UpgradeStatusService,
        typeof Repository === "undefined" ? Object : Repository,
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService
    ])
], AdminPanelResolver);

//# sourceMappingURL=admin-panel.resolver.js.map
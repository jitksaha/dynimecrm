"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ClientConfigService", {
    enumerable: true,
    get: function() {
        return ClientConfigService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _readiscompanyenrichmentenabledutil = require("../../company-enrichment/utils/read-is-company-enrichment-enabled.util");
const _readbookcallstepminemployeecountutil = require("../../onboarding/utils/read-book-call-step-min-employee-count.util");
const _nodeenvironmentinterface = require("../../twenty-config/interfaces/node-environment.interface");
const _supportinterface = require("../../twenty-config/interfaces/support.interface");
const _maintenancemodeservice = require("../../admin-panel/maintenance-mode.service");
const _domainserverconfigservice = require("../../domain/domain-server-config/services/domain-server-config.service");
const _emailingdomaindrivertype = require("../../emailing-domain/drivers/types/emailing-domain-driver.type");
const _publicfeatureflagconst = require("../../feature-flag/constants/public-feature-flag.const");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
const _todisplaycreditsutil = require("../../usage/utils/to-display-credits.util");
const _constants = require("twenty-shared/constants");
const _modelfamilylabelsconst = require("../../../metadata-modules/ai/ai-models/constants/model-family-labels.const");
const _getnativemodelcapabilitiesutil = require("../../../metadata-modules/ai/ai-models/utils/get-native-model-capabilities.util");
const _aimodelregistryservice = require("../../../metadata-modules/ai/ai-models/services/ai-model-registry.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ClientConfigService = class ClientConfigService {
    isCloudflareIntegrationEnabled() {
        return !!this.twentyConfigService.get('CLOUDFLARE_API_KEY') && !!this.twentyConfigService.get('CLOUDFLARE_ZONE_ID');
    }
    async getClientConfig() {
        const captchaProvider = this.twentyConfigService.get('CAPTCHA_DRIVER');
        const supportDriver = this.twentyConfigService.get('SUPPORT_DRIVER');
        const calendarBookingPageId = this.twentyConfigService.get('CALENDAR_BOOKING_PAGE_ID');
        const isBookCallOnboardingStepEnabled = (0, _utils.isDefined)((0, _readbookcallstepminemployeecountutil.readBookCallStepMinEmployeeCount)(this.twentyConfigService));
        const isCompanyEnrichmentEnabled = (0, _readiscompanyenrichmentenabledutil.readIsCompanyEnrichmentEnabled)(this.twentyConfigService);
        const isEmailingDomainInDemoMode = this.twentyConfigService.get('EMAILING_DOMAIN_DRIVER') === _emailingdomaindrivertype.EmailingDomainDriver.LOG;
        const isBillingEnabled = this.twentyConfigService.get('IS_BILLING_ENABLED');
        const availableModels = this.aiModelRegistryService.getAdminFilteredModels();
        const recommendedModelIds = this.aiModelRegistryService.getRecommendedModelIds();
        const resolvedProviders = this.aiModelRegistryService.getResolvedProvidersForAdmin();
        const getProviderLabel = (providerName)=>providerName ? resolvedProviders[providerName]?.label ?? providerName : undefined;
        const aiModels = availableModels.map((registeredModel)=>{
            const modelConfig = this.aiModelRegistryService.getModelConfig(registeredModel.modelId);
            const modelFamily = modelConfig?.modelFamily;
            const providerName = registeredModel.providerName;
            return {
                modelId: registeredModel.modelId,
                label: modelConfig?.label || registeredModel.modelId,
                modelFamily,
                modelFamilyLabel: modelFamily ? _modelfamilylabelsconst.MODEL_FAMILY_LABELS[modelFamily] : undefined,
                sdkPackage: registeredModel.sdkPackage,
                providerName,
                providerLabel: getProviderLabel(providerName),
                nativeCapabilities: (0, _getnativemodelcapabilitiesutil.getNativeModelCapabilities)(registeredModel.sdkPackage),
                inputCostPerMillionTokens: modelConfig?.inputCostPerMillionTokens,
                outputCostPerMillionTokens: modelConfig?.outputCostPerMillionTokens,
                contextWindowTokens: modelConfig?.contextWindowTokens,
                maxOutputTokens: modelConfig?.maxOutputTokens,
                isDeprecated: modelConfig?.isDeprecated,
                isRecommended: recommendedModelIds.has(registeredModel.modelId),
                dataResidency: modelConfig?.dataResidency
            };
        });
        if (aiModels.length > 0) {
            const defaultSpeedModel = this.aiModelRegistryService.getDefaultSpeedModel();
            const defaultSpeedModelConfig = this.aiModelRegistryService.getModelConfig(defaultSpeedModel?.modelId);
            const defaultPerformanceModel = this.aiModelRegistryService.getDefaultPerformanceModel();
            const defaultPerformanceModelConfig = this.aiModelRegistryService.getModelConfig(defaultPerformanceModel?.modelId);
            aiModels.unshift({
                modelId: _constants.AUTO_SELECT_SMART_MODEL_ID,
                label: defaultPerformanceModelConfig?.label || defaultPerformanceModel?.modelId || 'Default',
                modelFamily: defaultPerformanceModelConfig?.modelFamily,
                providerName: defaultPerformanceModel?.providerName,
                providerLabel: getProviderLabel(defaultPerformanceModel?.providerName),
                sdkPackage: defaultPerformanceModel?.sdkPackage ?? null,
                nativeCapabilities: (0, _getnativemodelcapabilitiesutil.getNativeModelCapabilities)(defaultPerformanceModel?.sdkPackage),
                inputCostPerMillionTokens: defaultPerformanceModelConfig?.inputCostPerMillionTokens,
                outputCostPerMillionTokens: defaultPerformanceModelConfig?.outputCostPerMillionTokens,
                contextWindowTokens: defaultPerformanceModelConfig?.contextWindowTokens,
                maxOutputTokens: defaultPerformanceModelConfig?.maxOutputTokens
            }, {
                modelId: _constants.AUTO_SELECT_FAST_MODEL_ID,
                label: defaultSpeedModelConfig?.label || defaultSpeedModel?.modelId || 'Default',
                modelFamily: defaultSpeedModelConfig?.modelFamily,
                providerName: defaultSpeedModel?.providerName,
                providerLabel: getProviderLabel(defaultSpeedModel?.providerName),
                sdkPackage: defaultSpeedModel?.sdkPackage ?? null,
                nativeCapabilities: (0, _getnativemodelcapabilitiesutil.getNativeModelCapabilities)(defaultSpeedModel?.sdkPackage),
                inputCostPerMillionTokens: defaultSpeedModelConfig?.inputCostPerMillionTokens,
                outputCostPerMillionTokens: defaultSpeedModelConfig?.outputCostPerMillionTokens,
                contextWindowTokens: defaultSpeedModelConfig?.contextWindowTokens,
                maxOutputTokens: defaultSpeedModelConfig?.maxOutputTokens
            });
        }
        const clientConfig = {
            appVersion: this.twentyConfigService.get('APP_VERSION'),
            billing: {
                isBillingEnabled,
                billingUrl: this.twentyConfigService.get('BILLING_PLAN_REQUIRED_LINK'),
                stripePublishableKey: this.twentyConfigService.get('BILLING_STRIPE_PUBLISHABLE_KEY'),
                trialPeriods: [
                    {
                        duration: this.twentyConfigService.get('BILLING_FREE_TRIAL_WITH_CREDIT_CARD_DURATION_IN_DAYS'),
                        isCreditCardRequired: true
                    },
                    {
                        duration: this.twentyConfigService.get('BILLING_FREE_TRIAL_WITHOUT_CREDIT_CARD_DURATION_IN_DAYS'),
                        isCreditCardRequired: false
                    }
                ]
            },
            aiModels,
            authProviders: {
                google: this.twentyConfigService.get('AUTH_GOOGLE_ENABLED'),
                magicLink: false,
                password: this.twentyConfigService.get('AUTH_PASSWORD_ENABLED'),
                microsoft: this.twentyConfigService.get('AUTH_MICROSOFT_ENABLED'),
                sso: []
            },
            signInPrefilled: this.twentyConfigService.get('SIGN_IN_PREFILLED'),
            isMultiWorkspaceEnabled: this.twentyConfigService.get('IS_MULTIWORKSPACE_ENABLED'),
            isEmailVerificationRequired: this.twentyConfigService.get('IS_EMAIL_VERIFICATION_REQUIRED'),
            defaultSubdomain: this.twentyConfigService.get('DEFAULT_SUBDOMAIN'),
            frontDomain: this.domainServerConfigService.getFrontUrl().hostname,
            publicFunctionDomain: this.domainServerConfigService.getPublicBaseHostnameOrUndefined() ?? null,
            support: {
                supportDriver: supportDriver ? supportDriver : _supportinterface.SupportDriver.NONE,
                supportFrontChatId: this.twentyConfigService.get('SUPPORT_FRONT_CHAT_ID')
            },
            sentry: {
                environment: this.twentyConfigService.get('SENTRY_ENVIRONMENT'),
                release: this.twentyConfigService.get('APP_VERSION'),
                dsn: this.twentyConfigService.get('SENTRY_FRONT_DSN'),
                tracesSampleRate: this.twentyConfigService.get('SENTRY_FRONT_TRACES_SAMPLE_RATE')
            },
            captcha: {
                provider: captchaProvider ? captchaProvider : undefined,
                siteKey: this.twentyConfigService.get('CAPTCHA_SITE_KEY')
            },
            api: {
                mutationMaximumAffectedRecords: this.twentyConfigService.get('MUTATION_MAXIMUM_AFFECTED_RECORDS')
            },
            onboarding: isBillingEnabled ? {
                importContactsCreditsReward: (0, _todisplaycreditsutil.toDisplayCredits)(this.twentyConfigService.get('ONBOARDING_IMPORT_CONTACTS_CREDITS_REWARD')),
                inviteTeamCreditsRewardPerUser: (0, _todisplaycreditsutil.toDisplayCredits)(this.twentyConfigService.get('ONBOARDING_INVITE_TEAM_CREDITS_REWARD_PER_USER')),
                upgradeCreditsReward: (0, _todisplaycreditsutil.toDisplayCredits)(this.twentyConfigService.get('BILLING_FREE_WORKFLOW_CREDITS_FOR_TRIAL_PERIOD_WITH_CREDIT_CARD')),
                installAppsCreditsRewardPerApp: (0, _todisplaycreditsutil.toDisplayCredits)(this.twentyConfigService.get('ONBOARDING_INSTALL_APPS_CREDITS_REWARD_PER_APP'))
            } : null,
            isAttachmentPreviewEnabled: this.twentyConfigService.get('IS_ATTACHMENT_PREVIEW_ENABLED'),
            analyticsEnabled: this.twentyConfigService.get('ANALYTICS_ENABLED'),
            canManageFeatureFlags: this.twentyConfigService.get('NODE_ENV') === _nodeenvironmentinterface.NodeEnvironment.DEVELOPMENT || isBillingEnabled || this.twentyConfigService.get('IS_FEATURE_FLAG_MANAGEMENT_ENABLED'),
            publicFeatureFlags: _publicfeatureflagconst.PUBLIC_FEATURE_FLAGS,
            isCookieSessionEnabled: true,
            isMicrosoftMessagingEnabled: this.twentyConfigService.get('MESSAGING_PROVIDER_MICROSOFT_ENABLED'),
            isMicrosoftCalendarEnabled: this.twentyConfigService.get('CALENDAR_PROVIDER_MICROSOFT_ENABLED'),
            isGoogleMessagingEnabled: this.twentyConfigService.get('MESSAGING_PROVIDER_GMAIL_ENABLED'),
            isGoogleCalendarEnabled: this.twentyConfigService.get('CALENDAR_PROVIDER_GOOGLE_ENABLED'),
            isConfigVariablesInDbEnabled: this.twentyConfigService.get('IS_CONFIG_VARIABLES_IN_DB_ENABLED'),
            isImapSmtpCaldavEnabled: this.twentyConfigService.get('IS_IMAP_SMTP_CALDAV_ENABLED'),
            isEmailingDomainInDemoMode,
            allowRequestsToTwentyIcons: this.twentyConfigService.get('ALLOW_REQUESTS_TO_TWENTY_ICONS'),
            calendarBookingPageId: (0, _guards.isNonEmptyString)(calendarBookingPageId) ? calendarBookingPageId : undefined,
            isBookCallOnboardingStepEnabled,
            isCompanyEnrichmentEnabled,
            isCloudflareIntegrationEnabled: this.isCloudflareIntegrationEnabled(),
            isClickHouseConfigured: !!this.twentyConfigService.get('CLICKHOUSE_URL'),
            isWorkspaceSchemaDDLLocked: this.twentyConfigService.get('WORKSPACE_SCHEMA_DDL_LOCKED'),
            isOnboardingAiChatEnabled: this.twentyConfigService.get('IS_ONBOARDING_AI_CHAT_ENABLED'),
            enterpriseInstanceType: this.twentyConfigService.get('ENTERPRISE_INSTANCE_TYPE') ?? _constants.ENTERPRISE_INSTANCE_TYPE.PRODUCTION
        };
        const maintenanceMode = await this.maintenanceModeService.getMaintenanceMode();
        if ((0, _utils.isDefined)(maintenanceMode)) {
            clientConfig.maintenance = {
                startAt: new Date(maintenanceMode.startAt),
                endAt: new Date(maintenanceMode.endAt),
                link: maintenanceMode.link
            };
        }
        return clientConfig;
    }
    constructor(twentyConfigService, domainServerConfigService, aiModelRegistryService, maintenanceModeService){
        this.twentyConfigService = twentyConfigService;
        this.domainServerConfigService = domainServerConfigService;
        this.aiModelRegistryService = aiModelRegistryService;
        this.maintenanceModeService = maintenanceModeService;
    }
};
ClientConfigService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _domainserverconfigservice.DomainServerConfigService === "undefined" ? Object : _domainserverconfigservice.DomainServerConfigService,
        typeof _aimodelregistryservice.AiModelRegistryService === "undefined" ? Object : _aimodelregistryservice.AiModelRegistryService,
        typeof _maintenancemodeservice.MaintenanceModeService === "undefined" ? Object : _maintenancemodeservice.MaintenanceModeService
    ])
], ClientConfigService);

//# sourceMappingURL=client-config.service.js.map
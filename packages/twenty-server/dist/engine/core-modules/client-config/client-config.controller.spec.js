"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _supportinterface = require("../twenty-config/interfaces/support.interface");
const _clientconfigservice = require("./services/client-config.service");
const _modelfamilyenum = require("../../metadata-modules/ai/ai-models/types/model-family.enum");
const _constants = require("twenty-shared/constants");
const _clientconfigcontroller = require("./client-config.controller");
describe('ClientConfigController', ()=>{
    let controller;
    let clientConfigService;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            controllers: [
                _clientconfigcontroller.ClientConfigController
            ],
            providers: [
                {
                    provide: _clientconfigservice.ClientConfigService,
                    useValue: {
                        getClientConfig: jest.fn()
                    }
                }
            ]
        }).compile();
        controller = module.get(_clientconfigcontroller.ClientConfigController);
        clientConfigService = module.get(_clientconfigservice.ClientConfigService);
    });
    it('should be defined', ()=>{
        expect(controller).toBeDefined();
    });
    describe('getClientConfig', ()=>{
        it('should return client config from service', async ()=>{
            const mockClientConfig = {
                billing: {
                    isBillingEnabled: true,
                    billingUrl: 'https://billing.example.com',
                    trialPeriods: [
                        {
                            duration: 7,
                            isCreditCardRequired: false
                        }
                    ]
                },
                aiModels: [
                    {
                        modelId: 'openai/gpt-4o',
                        label: 'GPT-4o',
                        modelFamily: _modelfamilyenum.ModelFamily.GPT,
                        sdkPackage: '@ai-sdk/openai',
                        inputCostPerMillionTokensInCredits: 2500000,
                        outputCostPerMillionTokensInCredits: 10000000
                    }
                ],
                authProviders: {
                    google: true,
                    magicLink: false,
                    password: true,
                    microsoft: false,
                    sso: []
                },
                signInPrefilled: false,
                isMultiWorkspaceEnabled: true,
                isEmailVerificationRequired: false,
                defaultSubdomain: 'app',
                frontDomain: 'localhost',
                publicFunctionDomain: null,
                support: {
                    supportDriver: _supportinterface.SupportDriver.NONE,
                    supportFrontChatId: undefined
                },
                sentry: {
                    environment: 'development',
                    release: '1.0.0',
                    dsn: undefined,
                    tracesSampleRate: 0.1
                },
                captcha: {
                    provider: undefined,
                    siteKey: undefined
                },
                api: {
                    mutationMaximumAffectedRecords: 100
                },
                onboarding: {
                    importContactsCreditsReward: 2,
                    inviteTeamCreditsRewardPerUser: 3,
                    upgradeCreditsReward: 5,
                    installAppsCreditsRewardPerApp: 1
                },
                isAttachmentPreviewEnabled: true,
                analyticsEnabled: false,
                canManageFeatureFlags: true,
                publicFeatureFlags: [],
                isCookieSessionEnabled: true,
                isMicrosoftMessagingEnabled: false,
                isMicrosoftCalendarEnabled: false,
                isGoogleMessagingEnabled: false,
                isGoogleCalendarEnabled: false,
                isConfigVariablesInDbEnabled: false,
                isImapSmtpCaldavEnabled: false,
                isEmailingDomainInDemoMode: false,
                calendarBookingPageId: undefined,
                isBookCallOnboardingStepEnabled: false,
                isCompanyEnrichmentEnabled: false,
                isTwoFactorAuthenticationEnabled: false,
                allowRequestsToTwentyIcons: true,
                isCloudflareIntegrationEnabled: false,
                isClickHouseConfigured: false,
                isWorkspaceSchemaDDLLocked: false,
                isOnboardingAiChatEnabled: false,
                enterpriseInstanceType: _constants.ENTERPRISE_INSTANCE_TYPE.PRODUCTION
            };
            jest.spyOn(clientConfigService, 'getClientConfig').mockResolvedValue(mockClientConfig);
            const result = await controller.getClientConfig();
            expect(result).toEqual(mockClientConfig);
            expect(clientConfigService.getClientConfig).toHaveBeenCalled();
        });
    });
});

//# sourceMappingURL=client-config.controller.spec.js.map
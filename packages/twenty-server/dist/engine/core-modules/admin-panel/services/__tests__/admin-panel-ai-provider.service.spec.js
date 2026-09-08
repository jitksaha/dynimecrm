/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _adminpanelaiproviderservice = require("../admin-panel-ai-provider.service");
const _maxseatswithoutenterprisekeyconstant = require("../../../enterprise/constants/max-seats-without-enterprise-key.constant");
const _enterpriseexception = require("../../../enterprise/enterprise.exception");
const _customaiprovideraccessservice = require("../../../enterprise/services/custom-ai-provider-access.service");
const _enterpriseplanservice = require("../../../enterprise/services/enterprise-plan.service");
const _twentyconfigservice = require("../../../twenty-config/twenty-config.service");
const _aimodelregistryservice = require("../../../../metadata-modules/ai/ai-models/services/ai-model-registry.service");
const _defaultaicatalogservice = require("../../../../metadata-modules/ai/ai-models/services/default-ai-catalog.service");
describe('AdminPanelAiProviderService', ()=>{
    let service;
    let providers;
    const twentyConfigService = {
        get: jest.fn(),
        set: jest.fn()
    };
    const enterprisePlanService = {
        isValid: jest.fn(),
        getBillableSeatCount: jest.fn()
    };
    const givenInstance = ({ seatCount, isBillingEnabled = false, isEnterpriseValid = false })=>{
        twentyConfigService.get.mockImplementation((key)=>key === 'IS_BILLING_ENABLED' ? isBillingEnabled : providers);
        enterprisePlanService.isValid.mockReturnValue(isEnterpriseValid);
        enterprisePlanService.getBillableSeatCount.mockResolvedValue(seatCount);
    };
    const addProvider = ()=>service.addProvider({
            providerName: 'my-gateway',
            providerConfig: {
                npm: '@ai-sdk/openai-compatible',
                baseUrl: 'https://gateway.internal'
            }
        });
    beforeEach(async ()=>{
        jest.clearAllMocks();
        providers = {};
        twentyConfigService.set.mockImplementation(async (_key, value)=>{
            providers = value;
        });
        const module = await _testing.Test.createTestingModule({
            providers: [
                _adminpanelaiproviderservice.AdminPanelAiProviderService,
                // The real gate is registered so these cover the seat rules end to end
                // rather than a stub of the very logic under test.
                _customaiprovideraccessservice.CustomAiProviderAccessService,
                {
                    provide: _twentyconfigservice.TwentyConfigService,
                    useValue: twentyConfigService
                },
                {
                    provide: _enterpriseplanservice.EnterprisePlanService,
                    useValue: enterprisePlanService
                },
                {
                    provide: _aimodelregistryservice.AiModelRegistryService,
                    useValue: {}
                },
                {
                    provide: _defaultaicatalogservice.DefaultAiCatalogService,
                    useValue: {}
                }
            ]
        }).compile();
        service = module.get(_adminpanelaiproviderservice.AdminPanelAiProviderService);
    });
    describe('addProvider', ()=>{
        it('persists the provider when the instance is under the seat threshold', async ()=>{
            givenInstance({
                seatCount: _maxseatswithoutenterprisekeyconstant.MAX_SEATS_WITHOUT_ENTERPRISE_KEY - 1
            });
            await expect(addProvider()).resolves.toBe(true);
            expect(providers).toHaveProperty('my-gateway');
        });
        it('refuses and persists nothing above the threshold without an enterprise key', async ()=>{
            givenInstance({
                seatCount: _maxseatswithoutenterprisekeyconstant.MAX_SEATS_WITHOUT_ENTERPRISE_KEY + 1
            });
            await expect(addProvider()).rejects.toMatchObject({
                code: _enterpriseexception.EnterpriseExceptionCode.ENTERPRISE_SEAT_THRESHOLD_EXCEEDED
            });
            expect(twentyConfigService.set).not.toHaveBeenCalled();
        });
        it('persists the provider above the threshold with a valid enterprise key', async ()=>{
            givenInstance({
                seatCount: _maxseatswithoutenterprisekeyconstant.MAX_SEATS_WITHOUT_ENTERPRISE_KEY + 100,
                isEnterpriseValid: true
            });
            await expect(addProvider()).resolves.toBe(true);
            expect(providers).toHaveProperty('my-gateway');
        });
        it('rejects a config whose npm package is not a supported SDK', async ()=>{
            givenInstance({
                seatCount: 1
            });
            await expect(service.addProvider({
                providerName: 'my-gateway',
                providerConfig: {
                    npm: 'not-an-ai-sdk-package'
                }
            })).rejects.toThrow('Invalid provider configuration');
            expect(twentyConfigService.set).not.toHaveBeenCalled();
        });
        it('rejects a provider name that is not slug-safe', async ()=>{
            givenInstance({
                seatCount: 1
            });
            await expect(service.addProvider({
                providerName: 'not a slug',
                providerConfig: {
                    npm: '@ai-sdk/openai-compatible',
                    baseUrl: 'https://gateway.internal'
                }
            })).rejects.toThrow('Invalid provider name');
        });
    });
    describe('addModelToProvider', ()=>{
        it('refuses above the threshold without an enterprise key', async ()=>{
            givenInstance({
                seatCount: _maxseatswithoutenterprisekeyconstant.MAX_SEATS_WITHOUT_ENTERPRISE_KEY + 1
            });
            await expect(service.addModelToProvider({
                providerName: 'my-gateway',
                modelConfig: {
                    name: 'gpt-4o',
                    label: 'GPT-4o'
                }
            })).rejects.toMatchObject({
                code: _enterpriseexception.EnterpriseExceptionCode.ENTERPRISE_SEAT_THRESHOLD_EXCEEDED
            });
        });
    });
    describe('removeProvider', ()=>{
        it('stays available above the threshold so providers can be cleaned up', async ()=>{
            givenInstance({
                seatCount: _maxseatswithoutenterprisekeyconstant.MAX_SEATS_WITHOUT_ENTERPRISE_KEY + 1
            });
            providers = {
                'my-gateway': {
                    npm: '@ai-sdk/openai-compatible'
                }
            };
            await expect(service.removeProvider('my-gateway')).resolves.toBe(true);
            expect(providers).not.toHaveProperty('my-gateway');
        });
    });
    describe('getCustomAiProviderAccess', ()=>{
        it('reports the threshold alongside the current seat count', async ()=>{
            givenInstance({
                seatCount: 42
            });
            await expect(service.getCustomAiProviderAccess()).resolves.toEqual({
                hasAccess: false,
                seatCount: 42,
                seatThreshold: _maxseatswithoutenterprisekeyconstant.MAX_SEATS_WITHOUT_ENTERPRISE_KEY
            });
        });
    });
});

//# sourceMappingURL=admin-panel-ai-provider.service.spec.js.map
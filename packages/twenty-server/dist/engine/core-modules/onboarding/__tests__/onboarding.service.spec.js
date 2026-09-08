"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _typeorm = require("@nestjs/typeorm");
const _billingcreditgranttypeenum = require("../../billing/enums/billing-credit-grant-type.enum");
const _billingcreditservice = require("../../billing/services/billing-credit.service");
const _billingservice = require("../../billing/services/billing.service");
const _exceptionhandlerservice = require("../../exception-handler/exception-handler.service");
const _messagequeueconstants = require("../../message-queue/message-queue.constants");
const _getqueuetokenutil = require("../../message-queue/utils/get-queue-token.util");
const _onboardingservice = require("../onboarding.service");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
const _uservarsservice = require("../../user/user-vars/services/user-vars.service");
const _userworkspaceentity = require("../../user-workspace/user-workspace.entity");
const _workspaceentity = require("../../workspace/workspace.entity");
describe('OnboardingService', ()=>{
    let service;
    const userId = 'user-id';
    const workspaceId = 'workspace-id';
    const creditTiers = {
        midMarket: {
            minEmployeeCount: 20,
            amountMicro: 5_000_000
        }
    };
    // The book-call step deliberately asks for a far bigger company than the
    // credit reward, so the two bars cannot be confused for one another.
    const bookCallMinEmployeeCount = 200;
    const configValues = {
        CALENDAR_BOOKING_PAGE_ID: 'team/twenty/talk-to-us',
        ONBOARDING_BOOK_CALL_MIN_EMPLOYEE_COUNT: bookCallMinEmployeeCount,
        ONBOARDING_ENRICHMENT_CREDIT_REWARD_TIERS: creditTiers
    };
    const grantCredits = jest.fn();
    const captureExceptions = jest.fn();
    const setIfNotExists = jest.fn();
    const getConfig = jest.fn();
    beforeEach(async ()=>{
        grantCredits.mockResolvedValue(null);
        setIfNotExists.mockResolvedValue(true);
        getConfig.mockImplementation((key)=>configValues[key]);
        const dataSource = {
            transaction: jest.fn((runInTransaction)=>runInTransaction({
                    queryRunner: {}
                }))
        };
        const module = await _testing.Test.createTestingModule({
            providers: [
                _onboardingservice.OnboardingService,
                {
                    provide: _billingservice.BillingService,
                    useValue: {
                        isBillingEnabled: jest.fn()
                    }
                },
                {
                    provide: _billingcreditservice.BillingCreditService,
                    useValue: {
                        grantCredits
                    }
                },
                {
                    provide: _exceptionhandlerservice.ExceptionHandlerService,
                    useValue: {
                        captureExceptions
                    }
                },
                {
                    provide: _uservarsservice.UserVarsService,
                    useValue: {
                        get: jest.fn(),
                        set: jest.fn(),
                        delete: jest.fn(),
                        setIfNotExists
                    }
                },
                {
                    provide: _twentyconfigservice.TwentyConfigService,
                    useValue: {
                        get: getConfig
                    }
                },
                {
                    provide: (0, _typeorm.getRepositoryToken)(_workspaceentity.WorkspaceEntity),
                    useValue: {}
                },
                {
                    provide: (0, _typeorm.getRepositoryToken)(_userworkspaceentity.UserWorkspaceEntity),
                    useValue: {}
                },
                {
                    provide: (0, _getqueuetokenutil.getQueueToken)(_messagequeueconstants.MessageQueue.workspaceQueue),
                    useValue: {
                        add: jest.fn()
                    }
                },
                {
                    provide: (0, _typeorm.getDataSourceToken)(),
                    useValue: dataSource
                }
            ]
        }).compile();
        service = module.get(_onboardingservice.OnboardingService);
    });
    afterEach(()=>{
        jest.resetAllMocks();
    });
    describe('creditEnrichmentQualificationReward', ()=>{
        it('grants the amount of the tier the enriched company lands in', async ()=>{
            await service.creditEnrichmentQualificationReward({
                workspaceId,
                employeeCount: 20
            });
            expect(grantCredits).toHaveBeenCalledTimes(1);
            expect(grantCredits).toHaveBeenCalledWith(expect.objectContaining({
                workspaceId,
                amountMicro: 5_000_000,
                type: _billingcreditgranttypeenum.BillingCreditGrantType.ONBOARDING_REWARD,
                idempotencyKey: `onboarding-enrichment-qualified:${workspaceId}`
            }));
        });
        it('grants nothing to a company below every tier', async ()=>{
            await service.creditEnrichmentQualificationReward({
                workspaceId,
                employeeCount: 19
            });
            expect(grantCredits).not.toHaveBeenCalled();
        });
        it('grants nothing to a workspace enrichment could not match', async ()=>{
            await service.creditEnrichmentQualificationReward({
                workspaceId,
                employeeCount: null
            });
            expect(grantCredits).not.toHaveBeenCalled();
        });
        it('grants nothing while no tier is configured', async ()=>{
            getConfig.mockImplementation((key)=>key === 'ONBOARDING_ENRICHMENT_CREDIT_REWARD_TIERS' ? {} : configValues[key]);
            await service.creditEnrichmentQualificationReward({
                workspaceId,
                employeeCount: 5000
            });
            expect(grantCredits).not.toHaveBeenCalled();
        });
        it('swallows a billing failure so enrichment still completes', async ()=>{
            grantCredits.mockRejectedValue(new Error('billing is down'));
            await expect(service.creditEnrichmentQualificationReward({
                workspaceId,
                employeeCount: 5000
            })).resolves.toBeUndefined();
        });
        it('reports malformed tiers to Sentry and pays the well-formed ones', async ()=>{
            getConfig.mockImplementation((key)=>key === 'ONBOARDING_ENRICHMENT_CREDIT_REWARD_TIERS' ? {
                    broken: {
                        minEmployeeCount: 'twenty'
                    },
                    ...creditTiers
                } : configValues[key]);
            await service.creditEnrichmentQualificationReward({
                workspaceId,
                employeeCount: 20
            });
            expect(captureExceptions).toHaveBeenCalledTimes(1);
            expect(captureExceptions.mock.calls[0][0][0].message).toContain('broken');
            expect(grantCredits).toHaveBeenCalledWith(expect.objectContaining({
                amountMicro: 5_000_000
            }));
        });
        it('survives a tier config too malformed to even read, and reports it', async ()=>{
            // The JSON config transformer throws rather than returning a value when
            // the configured tiers are not a parseable object.
            getConfig.mockImplementation((key)=>{
                if (key === 'ONBOARDING_ENRICHMENT_CREDIT_REWARD_TIERS') {
                    throw new Error('Failed to parse JSON string');
                }
                return configValues[key];
            });
            await expect(service.creditEnrichmentQualificationReward({
                workspaceId,
                employeeCount: 20
            })).resolves.toBeUndefined();
            expect(grantCredits).not.toHaveBeenCalled();
            expect(captureExceptions).toHaveBeenCalledTimes(1);
        });
        it('grants credits even when the book-a-call step is switched off', async ()=>{
            getConfig.mockImplementation((key)=>key === 'CALENDAR_BOOKING_PAGE_ID' || key === 'ONBOARDING_BOOK_CALL_MIN_EMPLOYEE_COUNT' ? undefined : configValues[key]);
            await service.creditEnrichmentQualificationReward({
                workspaceId,
                employeeCount: 20
            });
            expect(grantCredits).toHaveBeenCalledWith(expect.objectContaining({
                amountMicro: 5_000_000
            }));
        });
    });
    describe('setOnboardingBookCallPendingIfQualified', ()=>{
        it('offers the call without granting credits', async ()=>{
            const hasQualified = await service.setOnboardingBookCallPendingIfQualified({
                userId,
                workspaceId,
                employeeCount: bookCallMinEmployeeCount
            });
            expect(hasQualified).toBe(true);
            expect(grantCredits).not.toHaveBeenCalled();
        });
        it('withholds the call from a company that only clears the credit tier', async ()=>{
            const hasQualified = await service.setOnboardingBookCallPendingIfQualified({
                userId,
                workspaceId,
                employeeCount: 20
            });
            expect(hasQualified).toBe(false);
        });
    });
});

//# sourceMappingURL=onboarding.service.spec.js.map
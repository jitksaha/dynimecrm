/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _customaiprovideraccessrefreshintervalconstant = require("../../constants/custom-ai-provider-access-refresh-interval.constant");
const _customaiprovideraccessretryintervalconstant = require("../../constants/custom-ai-provider-access-retry-interval.constant");
const _maxseatswithoutenterprisekeyconstant = require("../../constants/max-seats-without-enterprise-key.constant");
const _customaiprovideraccessservice = require("../custom-ai-provider-access.service");
const _enterpriseplanservice = require("../enterprise-plan.service");
const _twentyconfigservice = require("../../../twenty-config/twenty-config.service");
describe('CustomAiProviderAccessService', ()=>{
    let service;
    const twentyConfigService = {
        get: jest.fn()
    };
    const enterprisePlanService = {
        isValid: jest.fn(),
        getBillableSeatCount: jest.fn()
    };
    const givenSeatCount = (seatCount)=>enterprisePlanService.getBillableSeatCount.mockResolvedValue(seatCount);
    // The refresh is deliberately not awaited by its caller, so the assertions
    // that follow one have to let the microtask queue drain first.
    const flushPendingRefresh = ()=>Promise.resolve();
    // The staleness rules are the point of these cases, so the clock is driven
    // rather than mocked per case — reading the real Date.now to build the next
    // value compounds against the previous mock and silently overshoots.
    const START_TIME = 1_700_000_000_000;
    let currentTime = START_TIME;
    const advanceClockTo = (millisecondsFromStart)=>{
        currentTime = START_TIME + millisecondsFromStart;
    };
    beforeEach(async ()=>{
        jest.clearAllMocks();
        currentTime = START_TIME;
        jest.spyOn(Date, 'now').mockImplementation(()=>currentTime);
        twentyConfigService.get.mockReturnValue(false);
        enterprisePlanService.isValid.mockReturnValue(false);
        givenSeatCount(1);
        const module = await _testing.Test.createTestingModule({
            providers: [
                _customaiprovideraccessservice.CustomAiProviderAccessService,
                {
                    provide: _twentyconfigservice.TwentyConfigService,
                    useValue: twentyConfigService
                },
                {
                    provide: _enterpriseplanservice.EnterprisePlanService,
                    useValue: enterprisePlanService
                }
            ]
        }).compile();
        service = module.get(_customaiprovideraccessservice.CustomAiProviderAccessService);
    });
    afterEach(()=>{
        jest.restoreAllMocks();
    });
    describe('computeAccess', ()=>{
        it('reports the threshold alongside the seat count it counted', async ()=>{
            givenSeatCount(_maxseatswithoutenterprisekeyconstant.MAX_SEATS_WITHOUT_ENTERPRISE_KEY + 1);
            await expect(service.computeAccess()).resolves.toEqual({
                hasAccess: false,
                seatCount: _maxseatswithoutenterprisekeyconstant.MAX_SEATS_WITHOUT_ENTERPRISE_KEY + 1,
                seatThreshold: _maxseatswithoutenterprisekeyconstant.MAX_SEATS_WITHOUT_ENTERPRISE_KEY
            });
        });
    });
    describe('getCachedHasAccess', ()=>{
        it('grants access before any count has come back', ()=>{
            givenSeatCount(_maxseatswithoutenterprisekeyconstant.MAX_SEATS_WITHOUT_ENTERPRISE_KEY + 1);
            expect(service.getCachedHasAccess()).toBe(true);
        });
        it('serves the verdict of the refresh it triggered to later callers', async ()=>{
            givenSeatCount(_maxseatswithoutenterprisekeyconstant.MAX_SEATS_WITHOUT_ENTERPRISE_KEY + 1);
            service.getCachedHasAccess();
            await flushPendingRefresh();
            expect(service.getCachedHasAccess()).toBe(false);
        });
        it('counts seats once per refresh interval however often it is read', async ()=>{
            service.getCachedHasAccess();
            await flushPendingRefresh();
            service.getCachedHasAccess();
            service.getCachedHasAccess();
            expect(enterprisePlanService.getBillableSeatCount).toHaveBeenCalledTimes(1);
        });
        it('counts again once the interval has elapsed', async ()=>{
            service.getCachedHasAccess();
            await flushPendingRefresh();
            advanceClockTo(_customaiprovideraccessrefreshintervalconstant.CUSTOM_AI_PROVIDER_ACCESS_REFRESH_INTERVAL_MS);
            service.getCachedHasAccess();
            await flushPendingRefresh();
            expect(enterprisePlanService.getBillableSeatCount).toHaveBeenCalledTimes(2);
        });
        it('retries a failed count on the short interval instead of waiting a full refresh', async ()=>{
            service.getCachedHasAccess();
            await flushPendingRefresh();
            enterprisePlanService.getBillableSeatCount.mockRejectedValue(new Error('connection terminated'));
            advanceClockTo(_customaiprovideraccessrefreshintervalconstant.CUSTOM_AI_PROVIDER_ACCESS_REFRESH_INTERVAL_MS);
            service.getCachedHasAccess();
            await flushPendingRefresh();
            expect(enterprisePlanService.getBillableSeatCount).toHaveBeenCalledTimes(2);
            // One retry interval past the failed count, and nowhere near another full
            // refresh interval: the stamp taken before that count would otherwise hold
            // the stale verdict for an hour.
            advanceClockTo(_customaiprovideraccessrefreshintervalconstant.CUSTOM_AI_PROVIDER_ACCESS_REFRESH_INTERVAL_MS + _customaiprovideraccessretryintervalconstant.CUSTOM_AI_PROVIDER_ACCESS_RETRY_INTERVAL_MS);
            service.getCachedHasAccess();
            await flushPendingRefresh();
            expect(enterprisePlanService.getBillableSeatCount).toHaveBeenCalledTimes(3);
        });
        it('keeps the previous verdict when the count fails, rather than disabling AI', async ()=>{
            service.getCachedHasAccess();
            await flushPendingRefresh();
            enterprisePlanService.getBillableSeatCount.mockRejectedValue(new Error('connection terminated'));
            advanceClockTo(_customaiprovideraccessrefreshintervalconstant.CUSTOM_AI_PROVIDER_ACCESS_REFRESH_INTERVAL_MS);
            service.getCachedHasAccess();
            await flushPendingRefresh();
            expect(service.getCachedHasAccess()).toBe(true);
        });
    });
});

//# sourceMappingURL=custom-ai-provider-access.service.spec.js.map
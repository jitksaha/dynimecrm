/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _maxseatswithoutenterprisekeyconstant = require("../../constants/max-seats-without-enterprise-key.constant");
const _hascustomaiprovideraccessutil = require("../has-custom-ai-provider-access.util");
describe('hasCustomAiProviderAccess', ()=>{
    const selfHosted = {
        isBillingEnabled: false,
        hasValidEnterprisePlan: false
    };
    it('grants access below the seat threshold', ()=>{
        expect((0, _hascustomaiprovideraccessutil.hasCustomAiProviderAccess)({
            ...selfHosted,
            seatCount: _maxseatswithoutenterprisekeyconstant.MAX_SEATS_WITHOUT_ENTERPRISE_KEY - 1
        })).toBe(true);
    });
    it('grants access exactly at the seat threshold', ()=>{
        expect((0, _hascustomaiprovideraccessutil.hasCustomAiProviderAccess)({
            ...selfHosted,
            seatCount: _maxseatswithoutenterprisekeyconstant.MAX_SEATS_WITHOUT_ENTERPRISE_KEY
        })).toBe(true);
    });
    it('denies access one seat above the threshold', ()=>{
        expect((0, _hascustomaiprovideraccessutil.hasCustomAiProviderAccess)({
            ...selfHosted,
            seatCount: _maxseatswithoutenterprisekeyconstant.MAX_SEATS_WITHOUT_ENTERPRISE_KEY + 1
        })).toBe(false);
    });
    it('grants access above the threshold with a valid enterprise plan', ()=>{
        expect((0, _hascustomaiprovideraccessutil.hasCustomAiProviderAccess)({
            isBillingEnabled: false,
            hasValidEnterprisePlan: true,
            seatCount: _maxseatswithoutenterprisekeyconstant.MAX_SEATS_WITHOUT_ENTERPRISE_KEY + 100
        })).toBe(true);
    });
    it('grants access on a billing-enabled instance whatever its seat count', ()=>{
        expect((0, _hascustomaiprovideraccessutil.hasCustomAiProviderAccess)({
            isBillingEnabled: true,
            hasValidEnterprisePlan: false,
            seatCount: 10_000
        })).toBe(true);
    });
});

//# sourceMappingURL=has-custom-ai-provider-access.util.spec.js.map
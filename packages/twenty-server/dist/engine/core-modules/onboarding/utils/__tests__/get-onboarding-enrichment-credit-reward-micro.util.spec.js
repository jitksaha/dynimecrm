"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _getonboardingenrichmentcreditrewardmicroutil = require("../get-onboarding-enrichment-credit-reward-micro.util");
describe('getOnboardingEnrichmentCreditRewardMicro', ()=>{
    const tiers = {
        midMarket: {
            minEmployeeCount: 20,
            amountMicro: 5_000_000
        },
        enterprise: {
            minEmployeeCount: 200,
            amountMicro: 10_000_000
        }
    };
    it('pays the tier an enriched company lands in', ()=>{
        expect((0, _getonboardingenrichmentcreditrewardmicroutil.getOnboardingEnrichmentCreditRewardMicro)({
            employeeCount: 20,
            tiers
        })).toEqual({
            amountMicro: 5_000_000,
            malformedTierKeys: []
        });
    });
    it('pays the most generous tier a company clears', ()=>{
        expect((0, _getonboardingenrichmentcreditrewardmicroutil.getOnboardingEnrichmentCreditRewardMicro)({
            employeeCount: 5000,
            tiers
        }).amountMicro).toBe(10_000_000);
    });
    it('pays nothing below every tier', ()=>{
        expect((0, _getonboardingenrichmentcreditrewardmicroutil.getOnboardingEnrichmentCreditRewardMicro)({
            employeeCount: 19,
            tiers
        }).amountMicro).toBeNull();
    });
    it('pays nothing when enrichment returned no employee count', ()=>{
        expect((0, _getonboardingenrichmentcreditrewardmicroutil.getOnboardingEnrichmentCreditRewardMicro)({
            employeeCount: null,
            tiers
        }).amountMicro).toBeNull();
    });
    it('pays nothing while no tier is configured', ()=>{
        expect((0, _getonboardingenrichmentcreditrewardmicroutil.getOnboardingEnrichmentCreditRewardMicro)({
            employeeCount: 5000,
            tiers: {}
        }).amountMicro).toBeNull();
        expect((0, _getonboardingenrichmentcreditrewardmicroutil.getOnboardingEnrichmentCreditRewardMicro)({
            employeeCount: 5000,
            tiers: undefined
        }).amountMicro).toBeNull();
    });
    it('pays every matched company when a tier asks for no minimum', ()=>{
        expect((0, _getonboardingenrichmentcreditrewardmicroutil.getOnboardingEnrichmentCreditRewardMicro)({
            employeeCount: 1,
            tiers: {
                anyCompany: {
                    minEmployeeCount: 0,
                    amountMicro: 5_000_000
                }
            }
        }).amountMicro).toBe(5_000_000);
    });
    describe('malformed tiers', ()=>{
        const malformedTiers = {
            wordThreshold: {
                minEmployeeCount: 'twenty',
                amountMicro: 9_000_000
            },
            zeroAmount: {
                minEmployeeCount: 20,
                amountMicro: 0
            },
            missingThreshold: {
                amountMicro: 8_000_000
            },
            missingAmount: {
                minEmployeeCount: 20
            }
        };
        it('drops them instead of reading them as a zero threshold', ()=>{
            expect((0, _getonboardingenrichmentcreditrewardmicroutil.getOnboardingEnrichmentCreditRewardMicro)({
                employeeCount: 5000,
                tiers: malformedTiers
            }).amountMicro).toBeNull();
        });
        it('names every dropped tier so the caller can report it', ()=>{
            expect((0, _getonboardingenrichmentcreditrewardmicroutil.getOnboardingEnrichmentCreditRewardMicro)({
                employeeCount: 5000,
                tiers: malformedTiers
            }).malformedTierKeys).toEqual([
                'wordThreshold',
                'zeroAmount',
                'missingThreshold',
                'missingAmount'
            ]);
        });
        it('still pays the tiers alongside them that are well formed', ()=>{
            expect((0, _getonboardingenrichmentcreditrewardmicroutil.getOnboardingEnrichmentCreditRewardMicro)({
                employeeCount: 5000,
                tiers: {
                    broken: {
                        minEmployeeCount: 'twenty'
                    },
                    midMarket: {
                        minEmployeeCount: 20,
                        amountMicro: 5_000_000
                    }
                }
            })).toEqual({
                amountMicro: 5_000_000,
                malformedTierKeys: [
                    'broken'
                ]
            });
        });
        it('names them even for a company no tier would have matched', ()=>{
            expect((0, _getonboardingenrichmentcreditrewardmicroutil.getOnboardingEnrichmentCreditRewardMicro)({
                employeeCount: null,
                tiers: malformedTiers
            }).malformedTierKeys).toHaveLength(4);
        });
    });
});

//# sourceMappingURL=get-onboarding-enrichment-credit-reward-micro.util.spec.js.map
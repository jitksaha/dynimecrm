"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _billingplankeyenum = require("../../enums/billing-plan-key.enum");
const _billingsubscriptionintervalenum = require("../../enums/billing-subscription-interval.enum");
const _billingsubscriptionupdatetype = require("../../types/billing-subscription-update.type");
const _computesubscriptionupdateoptionsutil = require("../compute-subscription-update-options.util");
describe('computeSubscriptionUpdateOptions', ()=>{
    it('returns proration and plan metadata for PLAN update type', ()=>{
        const result = (0, _computesubscriptionupdateoptionsutil.computeSubscriptionUpdateOptions)({
            type: _billingsubscriptionupdatetype.SubscriptionUpdateType.PLAN,
            newPlan: _billingplankeyenum.BillingPlanKey.PRO
        });
        expect(result).toEqual({
            proration: 'always_invoice',
            metadata: {
                plan: _billingplankeyenum.BillingPlanKey.PRO
            }
        });
    });
    it('returns proration and enterprise plan metadata for PLAN update type', ()=>{
        const result = (0, _computesubscriptionupdateoptionsutil.computeSubscriptionUpdateOptions)({
            type: _billingsubscriptionupdatetype.SubscriptionUpdateType.PLAN,
            newPlan: _billingplankeyenum.BillingPlanKey.ENTERPRISE
        });
        expect(result).toEqual({
            proration: 'always_invoice',
            metadata: {
                plan: _billingplankeyenum.BillingPlanKey.ENTERPRISE
            }
        });
    });
    it('returns no proration and plan metadata for PLAN update type during trial', ()=>{
        const result = (0, _computesubscriptionupdateoptionsutil.computeSubscriptionUpdateOptions)({
            type: _billingsubscriptionupdatetype.SubscriptionUpdateType.PLAN,
            newPlan: _billingplankeyenum.BillingPlanKey.ENTERPRISE
        }, {
            isTrialing: true
        });
        expect(result).toEqual({
            proration: 'none',
            metadata: {
                plan: _billingplankeyenum.BillingPlanKey.ENTERPRISE
            }
        });
    });
    it('returns proration and anchor for INTERVAL update type', ()=>{
        const result = (0, _computesubscriptionupdateoptionsutil.computeSubscriptionUpdateOptions)({
            type: _billingsubscriptionupdatetype.SubscriptionUpdateType.INTERVAL,
            newInterval: _billingsubscriptionintervalenum.SubscriptionInterval.Month
        });
        expect(result).toEqual({
            proration: 'create_prorations',
            anchor: 'now'
        });
    });
    it('returns no proration or anchor for INTERVAL update type during trial', ()=>{
        const result = (0, _computesubscriptionupdateoptionsutil.computeSubscriptionUpdateOptions)({
            type: _billingsubscriptionupdatetype.SubscriptionUpdateType.INTERVAL,
            newInterval: _billingsubscriptionintervalenum.SubscriptionInterval.Month
        }, {
            isTrialing: true
        });
        expect(result).toEqual({
            proration: 'none'
        });
    });
    it('returns always_invoice when increasing seats', ()=>{
        const result = (0, _computesubscriptionupdateoptionsutil.computeSubscriptionUpdateOptions)({
            type: _billingsubscriptionupdatetype.SubscriptionUpdateType.SEATS,
            newSeats: 10
        }, {
            currentSeats: 5
        });
        expect(result).toEqual({
            proration: 'always_invoice'
        });
    });
    it('returns create_prorations when decreasing seats', ()=>{
        const result = (0, _computesubscriptionupdateoptionsutil.computeSubscriptionUpdateOptions)({
            type: _billingsubscriptionupdatetype.SubscriptionUpdateType.SEATS,
            newSeats: 5
        }, {
            currentSeats: 10
        });
        expect(result).toEqual({
            proration: 'create_prorations'
        });
    });
    it('returns create_prorations when seat count is unchanged', ()=>{
        const result = (0, _computesubscriptionupdateoptionsutil.computeSubscriptionUpdateOptions)({
            type: _billingsubscriptionupdatetype.SubscriptionUpdateType.SEATS,
            newSeats: 10
        }, {
            currentSeats: 10
        });
        expect(result).toEqual({
            proration: 'create_prorations'
        });
    });
});

//# sourceMappingURL=compute-subscription-update-options.util.spec.js.map
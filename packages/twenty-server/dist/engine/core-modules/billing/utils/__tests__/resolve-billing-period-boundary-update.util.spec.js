/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _resolvebillingperiodboundaryupdateutil = require("../resolve-billing-period-boundary-update.util");
const JANUARY = new Date('2026-01-01T00:00:00.000Z');
const FEBRUARY = new Date('2026-02-01T00:00:00.000Z');
const MARCH = new Date('2026-03-01T00:00:00.000Z');
describe('resolveBillingPeriodBoundaryUpdate', ()=>{
    it('records the period the subscription just moved off', ()=>{
        expect((0, _resolvebillingperiodboundaryupdateutil.resolveBillingPeriodBoundaryUpdate)({
            incomingPeriodStart: FEBRUARY,
            storedSubscription: {
                currentPeriodStart: JANUARY,
                currentPeriodEnd: FEBRUARY
            }
        })).toEqual({
            previousPeriodStart: JANUARY
        });
    });
    it('leaves the boundary alone when the period has not moved', ()=>{
        expect((0, _resolvebillingperiodboundaryupdateutil.resolveBillingPeriodBoundaryUpdate)({
            incomingPeriodStart: FEBRUARY,
            storedSubscription: {
                currentPeriodStart: FEBRUARY,
                currentPeriodEnd: MARCH
            }
        })).toEqual({});
    });
    // Two subscription events for the same subscription can be processed out of
    // order, and the older one would otherwise rewind the window the rollover
    // settles against.
    it('keeps the stored window when a late event carries an older one', ()=>{
        expect((0, _resolvebillingperiodboundaryupdateutil.resolveBillingPeriodBoundaryUpdate)({
            incomingPeriodStart: JANUARY,
            storedSubscription: {
                currentPeriodStart: FEBRUARY,
                currentPeriodEnd: MARCH
            }
        })).toEqual({
            currentPeriodStart: FEBRUARY,
            currentPeriodEnd: MARCH
        });
    });
    it('has nothing to record for a subscription seen for the first time', ()=>{
        expect((0, _resolvebillingperiodboundaryupdateutil.resolveBillingPeriodBoundaryUpdate)({
            incomingPeriodStart: FEBRUARY,
            storedSubscription: null
        })).toEqual({});
    });
    it('has nothing to record when the event carries no period', ()=>{
        expect((0, _resolvebillingperiodboundaryupdateutil.resolveBillingPeriodBoundaryUpdate)({
            incomingPeriodStart: undefined,
            storedSubscription: {
                currentPeriodStart: JANUARY,
                currentPeriodEnd: FEBRUARY
            }
        })).toEqual({});
    });
});

//# sourceMappingURL=resolve-billing-period-boundary-update.util.spec.js.map
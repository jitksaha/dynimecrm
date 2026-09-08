"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _emailingdomaindriverexception = require("../../../../engine/core-modules/emailing-domain/drivers/exceptions/emailing-domain-driver.exception");
const _campaigndeliverystateconstant = require("../../../../engine/core-modules/emailing-domain/constants/campaign-delivery-state.constant");
const _campaignfailurereasonconstant = require("../../../../engine/core-modules/emailing-domain/constants/campaign-failure-reason.constant");
const _campaignskipreasonconstant = require("../../../../engine/core-modules/emailing-domain/constants/campaign-skip-reason.constant");
const _resolvecampaignsendfailureutil = require("../resolve-campaign-send-failure.util");
const driverException = (code)=>new _emailingdomaindriverexception.EmailingDomainDriverException('failure', code);
describe('resolveCampaignSendFailure', ()=>{
    it('should retry a failure that did not come from the driver', ()=>{
        const failure = (0, _resolvecampaignsendfailureutil.resolveCampaignSendFailure)(new Error('socket hang up'));
        expect(failure.state).toBe(_campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.FAILED);
        expect(failure.failureReason).toBe(_campaignfailurereasonconstant.CAMPAIGN_FAILURE_REASON.UNKNOWN);
        expect(failure.shouldRetry).toBe(true);
    });
    it('should skip a message whose recipients are all suppressed without retrying', ()=>{
        const failure = (0, _resolvecampaignsendfailureutil.resolveCampaignSendFailure)(driverException(_emailingdomaindriverexception.EmailingDomainDriverExceptionCode.ALL_RECIPIENTS_SUPPRESSED));
        expect(failure.state).toBe(_campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.SKIPPED);
        expect(failure.skipReason).toBe(_campaignskipreasonconstant.CAMPAIGN_SKIP_REASON.SUPPRESSED);
        expect(failure.shouldRetry).toBe(false);
    });
    it('should retry a temporary driver error', ()=>{
        const failure = (0, _resolvecampaignsendfailureutil.resolveCampaignSendFailure)(driverException(_emailingdomaindriverexception.EmailingDomainDriverExceptionCode.TEMPORARY_ERROR));
        expect(failure.failureReason).toBe(_campaignfailurereasonconstant.CAMPAIGN_FAILURE_REASON.TEMPORARY_ERROR);
        expect(failure.shouldRetry).toBe(true);
    });
    it('should keep a misconfiguration distinguishable from an unknown failure', ()=>{
        const configuration = (0, _resolvecampaignsendfailureutil.resolveCampaignSendFailure)(driverException(_emailingdomaindriverexception.EmailingDomainDriverExceptionCode.CONFIGURATION_ERROR));
        const permissions = (0, _resolvecampaignsendfailureutil.resolveCampaignSendFailure)(driverException(_emailingdomaindriverexception.EmailingDomainDriverExceptionCode.INSUFFICIENT_PERMISSIONS));
        expect(configuration.failureReason).toBe(_campaignfailurereasonconstant.CAMPAIGN_FAILURE_REASON.CONFIGURATION_ERROR);
        expect(permissions.failureReason).toBe(_campaignfailurereasonconstant.CAMPAIGN_FAILURE_REASON.INSUFFICIENT_PERMISSIONS);
        expect(configuration.shouldRetry).toBe(false);
        expect(permissions.shouldRetry).toBe(false);
    });
});

//# sourceMappingURL=resolve-campaign-send-failure.util.spec.js.map
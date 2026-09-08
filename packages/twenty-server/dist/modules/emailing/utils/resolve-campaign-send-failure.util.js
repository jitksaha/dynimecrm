"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveCampaignSendFailure", {
    enumerable: true,
    get: function() {
        return resolveCampaignSendFailure;
    }
});
const _emailingdomaindriverexception = require("../../../engine/core-modules/emailing-domain/drivers/exceptions/emailing-domain-driver.exception");
const _campaigndeliverystateconstant = require("../../../engine/core-modules/emailing-domain/constants/campaign-delivery-state.constant");
const _campaignfailurereasonconstant = require("../../../engine/core-modules/emailing-domain/constants/campaign-failure-reason.constant");
const _campaignskipreasonconstant = require("../../../engine/core-modules/emailing-domain/constants/campaign-skip-reason.constant");
const _utils = require("twenty-shared/utils");
const resolveCampaignSendFailure = (error)=>{
    if (!(error instanceof _emailingdomaindriverexception.EmailingDomainDriverException)) {
        return {
            state: _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.FAILED,
            skipReason: null,
            failureReason: _campaignfailurereasonconstant.CAMPAIGN_FAILURE_REASON.UNKNOWN,
            shouldRetry: true
        };
    }
    switch(error.code){
        case _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.ALL_RECIPIENTS_SUPPRESSED:
            return {
                state: _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.SKIPPED,
                skipReason: _campaignskipreasonconstant.CAMPAIGN_SKIP_REASON.SUPPRESSED,
                failureReason: null,
                shouldRetry: false
            };
        case _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.TEMPORARY_ERROR:
            return {
                state: _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.FAILED,
                skipReason: null,
                failureReason: _campaignfailurereasonconstant.CAMPAIGN_FAILURE_REASON.TEMPORARY_ERROR,
                shouldRetry: true
            };
        case _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.UNKNOWN:
            return {
                state: _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.FAILED,
                skipReason: null,
                failureReason: _campaignfailurereasonconstant.CAMPAIGN_FAILURE_REASON.UNKNOWN,
                shouldRetry: true
            };
        case _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.SENDING_SUSPENDED:
            return {
                state: _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.FAILED,
                skipReason: null,
                failureReason: _campaignfailurereasonconstant.CAMPAIGN_FAILURE_REASON.SENDING_SUSPENDED,
                shouldRetry: true
            };
        case _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.UNSUBSCRIBE_NOT_READY:
            return {
                state: _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.FAILED,
                skipReason: null,
                failureReason: _campaignfailurereasonconstant.CAMPAIGN_FAILURE_REASON.UNSUBSCRIBE_NOT_READY,
                shouldRetry: true
            };
        case _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.NOT_FOUND:
        case _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.CONFIGURATION_ERROR:
            return {
                state: _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.FAILED,
                skipReason: null,
                failureReason: _campaignfailurereasonconstant.CAMPAIGN_FAILURE_REASON.CONFIGURATION_ERROR,
                shouldRetry: false
            };
        case _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.INSUFFICIENT_PERMISSIONS:
            return {
                state: _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.FAILED,
                skipReason: null,
                failureReason: _campaignfailurereasonconstant.CAMPAIGN_FAILURE_REASON.INSUFFICIENT_PERMISSIONS,
                shouldRetry: false
            };
        case _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.SANDBOX_ACCOUNT:
            return {
                state: _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.FAILED,
                skipReason: null,
                failureReason: _campaignfailurereasonconstant.CAMPAIGN_FAILURE_REASON.SANDBOX_ACCOUNT,
                shouldRetry: false
            };
        case _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.UNSUBSCRIBE_MULTIPLE_RECIPIENTS:
            return {
                state: _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.FAILED,
                skipReason: null,
                failureReason: _campaignfailurereasonconstant.CAMPAIGN_FAILURE_REASON.UNSUBSCRIBE_MULTIPLE_RECIPIENTS,
                shouldRetry: false
            };
        default:
            {
                return (0, _utils.assertUnreachable)(error.code);
            }
    }
};

//# sourceMappingURL=resolve-campaign-send-failure.util.js.map
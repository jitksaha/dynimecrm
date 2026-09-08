"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _campaignprovideroutcomeconstant = require("../../../../../../engine/core-modules/emailing-domain/constants/campaign-provider-outcome.constant");
const _messagesuppressionreasontype = require("../../../../../../engine/core-modules/emailing-domain/types/message-suppression-reason.type");
const _resolveresendoutbounddeliveryoutcomeutil = require("../resolve-resend-outbound-delivery-outcome.util");
const buildEvent = (type, data)=>({
        type,
        data
    });
describe('resolveResendOutboundDeliveryOutcome', ()=>{
    it('should record a delivery without suppressing anyone', ()=>{
        expect((0, _resolveresendoutbounddeliveryoutcomeutil.resolveResendOutboundDeliveryOutcome)(buildEvent('email.delivered', {
            email_id: 'email-id'
        }))).toEqual({
            outcome: _campaignprovideroutcomeconstant.CAMPAIGN_PROVIDER_OUTCOME.DELIVERED,
            suppression: null,
            providerEventId: 'email-id'
        });
    });
    it('should record a send failure without suppressing the recipient', ()=>{
        expect((0, _resolveresendoutbounddeliveryoutcomeutil.resolveResendOutboundDeliveryOutcome)(buildEvent('email.failed', {
            email_id: 'email-id',
            to: [
                'someone@example.com'
            ]
        }))).toEqual({
            outcome: _campaignprovideroutcomeconstant.CAMPAIGN_PROVIDER_OUTCOME.REJECTED,
            suppression: null,
            providerEventId: 'email-id'
        });
    });
    it('should suppress the recipients of a permanent bounce', ()=>{
        expect((0, _resolveresendoutbounddeliveryoutcomeutil.resolveResendOutboundDeliveryOutcome)(buildEvent('email.bounced', {
            email_id: 'email-id',
            to: [
                'dead@example.com'
            ],
            bounce: {
                type: 'Permanent'
            }
        }))).toEqual({
            outcome: _campaignprovideroutcomeconstant.CAMPAIGN_PROVIDER_OUTCOME.BOUNCED,
            suppression: {
                reason: _messagesuppressionreasontype.MessageSuppressionReason.BOUNCE,
                emailAddresses: [
                    'dead@example.com'
                ]
            },
            providerEventId: 'email-id'
        });
    });
    it('should record a transient bounce without suppressing the recipient', ()=>{
        expect((0, _resolveresendoutbounddeliveryoutcomeutil.resolveResendOutboundDeliveryOutcome)(buildEvent('email.bounced', {
            email_id: 'email-id',
            to: [
                'full-mailbox@example.com'
            ],
            bounce: {
                type: 'Transient'
            }
        }))).toEqual({
            outcome: _campaignprovideroutcomeconstant.CAMPAIGN_PROVIDER_OUTCOME.SOFT_BOUNCED,
            suppression: null,
            providerEventId: 'email-id'
        });
    });
    it('should suppress the recipients of a complaint', ()=>{
        expect((0, _resolveresendoutbounddeliveryoutcomeutil.resolveResendOutboundDeliveryOutcome)(buildEvent('email.complained', {
            email_id: 'email-id',
            to: [
                'angry@example.com'
            ]
        }))).toEqual({
            outcome: _campaignprovideroutcomeconstant.CAMPAIGN_PROVIDER_OUTCOME.COMPLAINED,
            suppression: {
                reason: _messagesuppressionreasontype.MessageSuppressionReason.COMPLAINT,
                emailAddresses: [
                    'angry@example.com'
                ]
            },
            providerEventId: 'email-id'
        });
    });
    it('should not suppress anyone when the bounce cannot be attributed to a single recipient', ()=>{
        expect((0, _resolveresendoutbounddeliveryoutcomeutil.resolveResendOutboundDeliveryOutcome)(buildEvent('email.bounced', {
            email_id: 'email-id',
            to: [
                'first@example.com',
                'second@example.com'
            ],
            bounce: {
                type: 'Permanent'
            }
        }))).toEqual({
            outcome: _campaignprovideroutcomeconstant.CAMPAIGN_PROVIDER_OUTCOME.BOUNCED,
            suppression: null,
            providerEventId: 'email-id'
        });
    });
    it('should not suppress the to recipient when a copied address makes the bounce ambiguous', ()=>{
        expect((0, _resolveresendoutbounddeliveryoutcomeutil.resolveResendOutboundDeliveryOutcome)(buildEvent('email.bounced', {
            email_id: 'email-id',
            to: [
                'first@example.com'
            ],
            cc: [
                'copied@example.com'
            ],
            bounce: {
                type: 'Permanent'
            }
        }))).toEqual({
            outcome: _campaignprovideroutcomeconstant.CAMPAIGN_PROVIDER_OUTCOME.BOUNCED,
            suppression: null,
            providerEventId: 'email-id'
        });
    });
    it('should return null for an inbound event', ()=>{
        expect((0, _resolveresendoutbounddeliveryoutcomeutil.resolveResendOutboundDeliveryOutcome)(buildEvent('email.received'))).toBeNull();
    });
});

//# sourceMappingURL=resolve-resend-outbound-delivery-outcome.util.spec.js.map
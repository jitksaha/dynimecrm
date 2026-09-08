"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _mapresendsendingstatusutil = require("../map-resend-sending-status.util");
const _emailingdomainstatustype = require("../../../types/emailing-domain-status.type");
const sendingRecord = (status)=>({
        record: 'SPF',
        name: 'send.example.com',
        type: 'TXT',
        value: 'v=spf1 include:amazonses.com ~all',
        status
    });
const receivingRecord = (status)=>({
        record: 'MX',
        name: 'example.com',
        type: 'MX',
        value: 'inbound.resend.com',
        priority: 10,
        status
    });
describe('mapResendSendingStatus', ()=>{
    it('should report a fully verified domain as verified', ()=>{
        expect((0, _mapresendsendingstatusutil.mapResendSendingStatus)({
            id: 'dom_1',
            name: 'example.com',
            status: 'verified'
        })).toBe(_emailingdomainstatustype.EmailingDomainStatus.VERIFIED);
    });
    it('should report a partially verified domain as verified when sending records are verified', ()=>{
        expect((0, _mapresendsendingstatusutil.mapResendSendingStatus)({
            id: 'dom_1',
            name: 'example.com',
            status: 'partially_verified',
            records: [
                sendingRecord('verified'),
                {
                    ...sendingRecord('verified'),
                    record: 'DKIM'
                },
                receivingRecord('pending')
            ]
        })).toBe(_emailingdomainstatustype.EmailingDomainStatus.VERIFIED);
    });
    it('should stay pending while sending records are pending', ()=>{
        expect((0, _mapresendsendingstatusutil.mapResendSendingStatus)({
            id: 'dom_1',
            name: 'example.com',
            status: 'partially_verified',
            records: [
                sendingRecord('verified'),
                {
                    ...sendingRecord('pending'),
                    record: 'DKIM'
                },
                receivingRecord('verified')
            ]
        })).toBe(_emailingdomainstatustype.EmailingDomainStatus.PENDING);
    });
    it('should report failure when a sending record failed', ()=>{
        expect((0, _mapresendsendingstatusutil.mapResendSendingStatus)({
            id: 'dom_1',
            name: 'example.com',
            status: 'partially_failed',
            records: [
                sendingRecord('failure'),
                {
                    ...sendingRecord('verified'),
                    record: 'DKIM'
                }
            ]
        })).toBe(_emailingdomainstatustype.EmailingDomainStatus.FAILED);
    });
    it('should report temporary failure when a sending record is temporarily failing', ()=>{
        expect((0, _mapresendsendingstatusutil.mapResendSendingStatus)({
            id: 'dom_1',
            name: 'example.com',
            status: 'temporary_failure',
            records: [
                sendingRecord('temporary_failure'),
                {
                    ...sendingRecord('verified'),
                    record: 'DKIM'
                }
            ]
        })).toBe(_emailingdomainstatustype.EmailingDomainStatus.TEMPORARY_FAILURE);
    });
    it('should fall back to the aggregate status without records', ()=>{
        expect((0, _mapresendsendingstatusutil.mapResendSendingStatus)({
            id: 'dom_1',
            name: 'example.com',
            status: 'failure'
        })).toBe(_emailingdomainstatustype.EmailingDomainStatus.FAILED);
        expect((0, _mapresendsendingstatusutil.mapResendSendingStatus)({
            id: 'dom_1',
            name: 'example.com',
            status: 'pending',
            records: [
                receivingRecord('pending')
            ]
        })).toBe(_emailingdomainstatustype.EmailingDomainStatus.PENDING);
    });
});

//# sourceMappingURL=map-resend-sending-status.util.spec.js.map
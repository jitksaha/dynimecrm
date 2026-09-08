"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _getawssesdriverexceptioncodeutil = require("../get-aws-ses-driver-exception-code.util");
const _emailingdomaindriverexception = require("../../../exceptions/emailing-domain-driver.exception");
describe('getAwsSesDriverExceptionCode', ()=>{
    it('should classify a send-rate breach as temporary even though SES answers it with a 4xx status', ()=>{
        expect((0, _getawssesdriverexceptioncodeutil.getAwsSesDriverExceptionCode)({
            name: 'TooManyRequestsException',
            message: 'Maximum sending rate exceeded.',
            $metadata: {
                httpStatusCode: 400
            }
        })).toBe(_emailingdomaindriverexception.EmailingDomainDriverExceptionCode.TEMPORARY_ERROR);
    });
    it('should classify a 24-hour quota breach as temporary', ()=>{
        expect((0, _getawssesdriverexceptioncodeutil.getAwsSesDriverExceptionCode)({
            name: 'LimitExceededException',
            message: 'Daily message quota exceeded.',
            $metadata: {
                httpStatusCode: 400
            }
        })).toBe(_emailingdomaindriverexception.EmailingDomainDriverExceptionCode.TEMPORARY_ERROR);
    });
    it('should classify a throttling status without a recognized name as temporary', ()=>{
        expect((0, _getawssesdriverexceptioncodeutil.getAwsSesDriverExceptionCode)({
            name: 'SomeUnmappedError',
            $metadata: {
                httpStatusCode: 429
            }
        })).toBe(_emailingdomaindriverexception.EmailingDomainDriverExceptionCode.TEMPORARY_ERROR);
    });
    it('should classify a server error as temporary', ()=>{
        expect((0, _getawssesdriverexceptioncodeutil.getAwsSesDriverExceptionCode)({
            name: 'SomeUnmappedError',
            $metadata: {
                httpStatusCode: 503
            }
        })).toBe(_emailingdomaindriverexception.EmailingDomainDriverExceptionCode.TEMPORARY_ERROR);
    });
    it('should classify a denied or suspended account as insufficient permissions', ()=>{
        expect((0, _getawssesdriverexceptioncodeutil.getAwsSesDriverExceptionCode)({
            name: 'AccountSuspendedException',
            $metadata: {
                httpStatusCode: 400
            }
        })).toBe(_emailingdomaindriverexception.EmailingDomainDriverExceptionCode.INSUFFICIENT_PERMISSIONS);
        expect((0, _getawssesdriverexceptioncodeutil.getAwsSesDriverExceptionCode)({
            name: 'SomeUnmappedError',
            $metadata: {
                httpStatusCode: 403
            }
        })).toBe(_emailingdomaindriverexception.EmailingDomainDriverExceptionCode.INSUFFICIENT_PERMISSIONS);
    });
    it('should classify a rejected message as a configuration error', ()=>{
        expect((0, _getawssesdriverexceptioncodeutil.getAwsSesDriverExceptionCode)({
            name: 'MessageRejected',
            $metadata: {
                httpStatusCode: 400
            }
        })).toBe(_emailingdomaindriverexception.EmailingDomainDriverExceptionCode.CONFIGURATION_ERROR);
    });
    it('should classify an error carrying neither a known name nor a status as unknown', ()=>{
        expect((0, _getawssesdriverexceptioncodeutil.getAwsSesDriverExceptionCode)({})).toBe(_emailingdomaindriverexception.EmailingDomainDriverExceptionCode.UNKNOWN);
    });
});

//# sourceMappingURL=get-aws-ses-driver-exception-code.util.spec.js.map
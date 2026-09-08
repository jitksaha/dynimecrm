"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _getdomainfromemail = require("../get-domain-from-email");
describe('getDomainFromEmail', ()=>{
    it('returns the domain of a simple address', ()=>{
        expect((0, _getdomainfromemail.getDomainFromEmail)('user@example.com')).toBe('example.com');
    });
    it('returns the domain after the last "@" for a quoted local part', ()=>{
        expect((0, _getdomainfromemail.getDomainFromEmail)('"a@b"@example.com')).toBe('example.com');
    });
    it('returns subdomains intact', ()=>{
        expect((0, _getdomainfromemail.getDomainFromEmail)('user@mail.example.com')).toBe('mail.example.com');
    });
    it('preserves the original case', ()=>{
        expect((0, _getdomainfromemail.getDomainFromEmail)('User@Example.COM')).toBe('Example.COM');
    });
    it('returns an empty string when the domain part is missing', ()=>{
        expect((0, _getdomainfromemail.getDomainFromEmail)('user@')).toBe('');
    });
    it('returns undefined when there is no "@"', ()=>{
        expect((0, _getdomainfromemail.getDomainFromEmail)('not-an-email')).toBeUndefined();
    });
});

//# sourceMappingURL=get-domain-from-email.spec.js.map
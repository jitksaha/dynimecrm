"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _publicfunctiondomainutil = require("../public-function-domain.util");
describe('getHostnameFromUrlOrUndefined', ()=>{
    it('returns the lowercased hostname of a valid url', ()=>{
        expect((0, _publicfunctiondomainutil.getHostnameFromUrlOrUndefined)('https://WithTwenty.com')).toBe('withtwenty.com');
    });
    it('ignores the path and port', ()=>{
        expect((0, _publicfunctiondomainutil.getHostnameFromUrlOrUndefined)('https://withtwenty.com:8080/ignored')).toBe('withtwenty.com');
    });
    it('returns undefined for empty/nullish input', ()=>{
        expect((0, _publicfunctiondomainutil.getHostnameFromUrlOrUndefined)(undefined)).toBeUndefined();
        expect((0, _publicfunctiondomainutil.getHostnameFromUrlOrUndefined)(null)).toBeUndefined();
        expect((0, _publicfunctiondomainutil.getHostnameFromUrlOrUndefined)('')).toBeUndefined();
    });
    it('returns undefined for a non-url string', ()=>{
        expect((0, _publicfunctiondomainutil.getHostnameFromUrlOrUndefined)('not a url')).toBeUndefined();
    });
});
describe('isHostUnderPublicFunctionDomain', ()=>{
    const publicDomainBaseHostname = 'withtwenty.com';
    it('matches a strict subdomain of the base', ()=>{
        expect((0, _publicfunctiondomainutil.isHostUnderPublicFunctionDomain)({
            host: 'acme.withtwenty.com',
            publicDomainBaseHostname
        })).toBe(true);
    });
    it('matches deeper subdomains', ()=>{
        expect((0, _publicfunctiondomainutil.isHostUnderPublicFunctionDomain)({
            host: 'app.acme.withtwenty.com',
            publicDomainBaseHostname
        })).toBe(true);
    });
    it('is case-insensitive and strips the port', ()=>{
        expect((0, _publicfunctiondomainutil.isHostUnderPublicFunctionDomain)({
            host: 'ACME.WithTwenty.com:443',
            publicDomainBaseHostname
        })).toBe(true);
    });
    it('does not match the apex base itself', ()=>{
        expect((0, _publicfunctiondomainutil.isHostUnderPublicFunctionDomain)({
            host: 'withtwenty.com',
            publicDomainBaseHostname
        })).toBe(false);
    });
    it('does not match the main app domain', ()=>{
        expect((0, _publicfunctiondomainutil.isHostUnderPublicFunctionDomain)({
            host: 'acme.twenty.com',
            publicDomainBaseHostname
        })).toBe(false);
    });
    it('does not match a lookalike suffix', ()=>{
        expect((0, _publicfunctiondomainutil.isHostUnderPublicFunctionDomain)({
            host: 'evilwithtwenty.com',
            publicDomainBaseHostname
        })).toBe(false);
    });
    it('returns false when no base is configured', ()=>{
        expect((0, _publicfunctiondomainutil.isHostUnderPublicFunctionDomain)({
            host: 'acme.withtwenty.com',
            publicDomainBaseHostname: undefined
        })).toBe(false);
    });
    it('returns false when host is missing', ()=>{
        expect((0, _publicfunctiondomainutil.isHostUnderPublicFunctionDomain)({
            host: undefined,
            publicDomainBaseHostname
        })).toBe(false);
    });
});

//# sourceMappingURL=public-function-domain.util.spec.js.map
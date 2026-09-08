"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _authexception = require("../../auth.exception");
const _assertissuerispublishedutil = require("../assert-issuer-is-published.util");
describe('assertIssuerIsPublishedOrThrow', ()=>{
    const requestBaseUrl = 'https://app.twenty.com';
    const serverUrl = 'https://api.twenty.com';
    it('accepts the origin the request arrived on', ()=>{
        expect(()=>(0, _assertissuerispublishedutil.assertIssuerIsPublishedOrThrow)({
                issuer: 'https://app.twenty.com',
                requestBaseUrl,
                serverUrl
            })).not.toThrow();
    });
    it('accepts the api host, which delegates /authorize to this origin', ()=>{
        expect(()=>(0, _assertissuerispublishedutil.assertIssuerIsPublishedOrThrow)({
                issuer: 'https://api.twenty.com',
                requestBaseUrl,
                serverUrl
            })).not.toThrow();
    });
    it('tolerates a trailing slash on SERVER_URL', ()=>{
        expect(()=>(0, _assertissuerispublishedutil.assertIssuerIsPublishedOrThrow)({
                issuer: 'https://api.twenty.com',
                requestBaseUrl,
                serverUrl: 'https://api.twenty.com/'
            })).not.toThrow();
    });
    it('throws on an issuer this instance never published', ()=>{
        expect(()=>(0, _assertissuerispublishedutil.assertIssuerIsPublishedOrThrow)({
                issuer: 'https://attacker.example.com',
                requestBaseUrl,
                serverUrl
            })).toThrow(_authexception.AuthException);
    });
    it('throws when SERVER_URL is unset and the issuer is not the request origin', ()=>{
        expect(()=>(0, _assertissuerispublishedutil.assertIssuerIsPublishedOrThrow)({
                issuer: 'https://api.twenty.com',
                requestBaseUrl
            })).toThrow(_authexception.AuthException);
    });
});

//# sourceMappingURL=assert-issuer-is-published.util.spec.js.map
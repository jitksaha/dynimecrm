"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _common = require("@nestjs/common");
const _applycredentialedcorsutil = require("./apply-credentialed-cors.util");
describe('warnOnceOnDisallowedBrowserPreflight', ()=>{
    const defaultConfig = {
        NODE_ENV: 'production',
        SERVER_URL: 'https://crm.example.com',
        FRONTEND_URL: undefined,
        AUTH_COOKIE_ALLOWED_ORIGINS: ''
    };
    let mockConfig = {
        ...defaultConfig
    };
    const twentyConfigService = {
        get: jest.fn((key)=>mockConfig[key])
    };
    const buildPreflightRequest = ({ origin, host = 'crm.example.com', method = 'OPTIONS', requestedMethod = 'POST' })=>({
            method,
            protocol: 'https',
            headers: {
                origin,
                'access-control-request-method': requestedMethod
            },
            get: jest.fn().mockReturnValue(host)
        });
    let warnSpy;
    let warnedOrigins;
    beforeEach(()=>{
        mockConfig = {
            ...defaultConfig
        };
        warnedOrigins = new Set();
        warnSpy = jest.spyOn(_common.Logger.prototype, 'warn').mockImplementation();
    });
    afterEach(()=>{
        jest.restoreAllMocks();
    });
    it('should warn once per disallowed cross-origin preflight', ()=>{
        (0, _applycredentialedcorsutil.warnOnceOnDisallowedBrowserPreflight)({
            request: buildPreflightRequest({
                origin: 'https://tenant.example.net'
            }),
            twentyConfigService,
            warnedOrigins
        });
        (0, _applycredentialedcorsutil.warnOnceOnDisallowedBrowserPreflight)({
            request: buildPreflightRequest({
                origin: 'https://tenant.example.net'
            }),
            twentyConfigService,
            warnedOrigins
        });
        expect(warnSpy).toHaveBeenCalledTimes(1);
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('https://tenant.example.net'));
    });
    it('should not warn for an allowlisted origin', ()=>{
        mockConfig.AUTH_COOKIE_ALLOWED_ORIGINS = 'https://front.example.net';
        (0, _applycredentialedcorsutil.warnOnceOnDisallowedBrowserPreflight)({
            request: buildPreflightRequest({
                origin: 'https://front.example.net'
            }),
            twentyConfigService,
            warnedOrigins
        });
        expect(warnSpy).not.toHaveBeenCalled();
    });
    it('should not warn for a same-origin preflight since browsers do not enforce CORS on it', ()=>{
        (0, _applycredentialedcorsutil.warnOnceOnDisallowedBrowserPreflight)({
            request: buildPreflightRequest({
                origin: 'https://lan.example.internal',
                host: 'lan.example.internal'
            }),
            twentyConfigService,
            warnedOrigins
        });
        expect(warnSpy).not.toHaveBeenCalled();
    });
    it('should not warn for requests that are not browser preflights', ()=>{
        (0, _applycredentialedcorsutil.warnOnceOnDisallowedBrowserPreflight)({
            request: buildPreflightRequest({
                origin: 'https://tenant.example.net',
                method: 'POST'
            }),
            twentyConfigService,
            warnedOrigins
        });
        (0, _applycredentialedcorsutil.warnOnceOnDisallowedBrowserPreflight)({
            request: buildPreflightRequest({
                origin: 'https://tenant.example.net',
                requestedMethod: ''
            }),
            twentyConfigService,
            warnedOrigins
        });
        expect(warnSpy).not.toHaveBeenCalled();
    });
});

//# sourceMappingURL=apply-credentialed-cors.util.spec.js.map
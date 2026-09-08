"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get applyCredentialedCors () {
        return applyCredentialedCors;
    },
    get warnOnceOnDisallowedBrowserPreflight () {
        return warnOnceOnDisallowedBrowserPreflight;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _resolveallowedcredentialedoriginsutil = require("./resolve-allowed-credentialed-origins.util");
const _getrequestbaseurlutil = require("../../../../utils/get-request-base-url.util");
const logger = new _common.Logger('CredentialedCors');
// Prevents junk Origin headers from growing the warned set unbounded.
const WARNED_ORIGINS_MAX = 1_000;
const toComparableOrigin = (value)=>{
    try {
        return new URL(value).origin.toLowerCase();
    } catch  {
        return undefined;
    }
};
const warnOnceOnDisallowedBrowserPreflight = ({ request, twentyConfigService, warnedOrigins })=>{
    if (request.method !== 'OPTIONS' || !(0, _guards.isNonEmptyString)(request.headers['access-control-request-method'])) {
        return;
    }
    const origin = request.headers.origin;
    if (!(0, _guards.isNonEmptyString)(origin)) {
        return;
    }
    const comparableOrigin = toComparableOrigin(origin);
    if (!(0, _guards.isNonEmptyString)(comparableOrigin)) {
        return;
    }
    // Browsers do not enforce CORS on same-origin requests.
    if (comparableOrigin === toComparableOrigin((0, _getrequestbaseurlutil.getRequestBaseUrl)(request))) {
        return;
    }
    if ((0, _resolveallowedcredentialedoriginsutil.resolveAllowedCredentialedOrigins)(twentyConfigService).has(comparableOrigin)) {
        return;
    }
    if (warnedOrigins.has(comparableOrigin) || warnedOrigins.size >= WARNED_ORIGINS_MAX) {
        return;
    }
    warnedOrigins.add(comparableOrigin);
    logger.warn(`Cross-origin browser request from ${comparableOrigin} (API host: ${(0, _getrequestbaseurlutil.getRequestBaseUrl)(request)}); credentialed requests from it will be blocked by the browser. If this is your Twenty front-end, serve it same-origin with the API, or add the origin to AUTH_COOKIE_ALLOWED_ORIGINS. Logged once per origin.`);
};
const applyCredentialedCors = (app, twentyConfigService)=>{
    const warnedOrigins = new Set();
    // The cors package only emits Vary: Origin when it reflects one, so wildcard
    // and reflected responses would share a cache entry and a credentialed
    // request could be served the wildcard, which browsers reject.
    app.use((request, response, next)=>{
        response.vary('Origin');
        warnOnceOnDisallowedBrowserPreflight({
            request,
            twentyConfigService,
            warnedOrigins
        });
        next();
    });
    app.enableCors({
        // Resolved per request rather than once at boot: the origins derive from
        // config the admin panel can change, and a snapshot would drift from the
        // CSRF guard, which resolves them per request and would then disagree with
        // CORS about the same origin.
        origin: (origin, callback)=>{
            if (origin && (0, _resolveallowedcredentialedoriginsutil.resolveAllowedCredentialedOrigins)(twentyConfigService).has(origin.toLowerCase())) {
                return callback(null, true);
            }
            return callback(null, '*');
        },
        credentials: true,
        // Expose WWW-Authenticate so browser-based MCP clients can read the
        // resource_metadata pointer on 401. Required by MCP authorization spec.
        exposedHeaders: [
            'WWW-Authenticate'
        ]
    });
};

//# sourceMappingURL=apply-credentialed-cors.util.js.map
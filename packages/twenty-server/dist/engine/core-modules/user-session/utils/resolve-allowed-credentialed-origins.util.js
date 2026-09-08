"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveAllowedCredentialedOrigins", {
    enumerable: true,
    get: function() {
        return resolveAllowedCredentialedOrigins;
    }
});
const _guards = require("@sniptt/guards");
const _nodeenvironmentinterface = require("../../twenty-config/interfaces/node-environment.interface");
// Opaque schemes (file:, data:) serialise to the literal "null" origin, which
// would otherwise allowlist every sandboxed document that sends Origin: null.
const toOrigin = (url)=>{
    try {
        const parsedUrl = new URL(url);
        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
            return undefined;
        }
        return parsedUrl.origin.toLowerCase();
    } catch  {
        return undefined;
    }
};
// URL canonicalises [::ffff:127.0.0.1] to [::ffff:7f00:1], so only the hex
// spelling reaches here. All of 127.0.0.0/8 is loopback.
const IPV4_LOOPBACK_REGEX = /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
const IPV4_MAPPED_HEX_REGEX = /^::ffff:([0-9a-f]{1,4}):[0-9a-f]{1,4}$/;
const isLoopbackHostname = (hostname)=>{
    // A trailing DNS dot (localhost.) resolves the same but would not match.
    const host = hostname.replace(/^\[|\]$/g, '').replace(/\.$/, '').toLowerCase();
    if (host === 'localhost' || host === '::1') {
        return true;
    }
    if (IPV4_LOOPBACK_REGEX.test(host)) {
        return true;
    }
    const mappedHex = IPV4_MAPPED_HEX_REGEX.exec(host);
    // The high byte of the first hextet is the first octet of the v4 address.
    return mappedHex !== null && Number.parseInt(mappedHex[1], 16) >> 8 === 127;
};
const isLoopbackOrigin = (origin)=>{
    try {
        return isLoopbackHostname(new URL(origin).hostname);
    } catch  {
        return false;
    }
};
const resolveAllowedCredentialedOrigins = (twentyConfigService)=>{
    const allowedOrigins = new Set();
    const derivedUrls = [
        twentyConfigService.get('SERVER_URL'),
        twentyConfigService.get('FRONTEND_URL')
    ];
    const explicitUrls = twentyConfigService.get('AUTH_COOKIE_ALLOWED_ORIGINS').split(',').map((allowedOrigin)=>allowedOrigin.trim());
    // SERVER_URL defaults to http://localhost:3000, so a deployment that never
    // set it would hand any local page on that port a credentialed origin.
    // Explicit entries are still honoured, so dev setups keep working.
    const isProduction = twentyConfigService.get('NODE_ENV') === _nodeenvironmentinterface.NodeEnvironment.PRODUCTION;
    for (const candidateUrl of [
        ...derivedUrls,
        ...explicitUrls
    ]){
        if (!(0, _guards.isNonEmptyString)(candidateUrl)) {
            continue;
        }
        const origin = toOrigin(candidateUrl);
        if (!(0, _guards.isNonEmptyString)(origin)) {
            continue;
        }
        if (isProduction && isLoopbackOrigin(origin) && !explicitUrls.includes(candidateUrl)) {
            continue;
        }
        allowedOrigins.add(origin);
    }
    return allowedOrigins;
};

//# sourceMappingURL=resolve-allowed-credentialed-origins.util.js.map
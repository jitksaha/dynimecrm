"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isRequestOriginAllowed", {
    enumerable: true,
    get: function() {
        return isRequestOriginAllowed;
    }
});
const _utils = require("twenty-shared/utils");
const _resolveallowedcredentialedoriginsutil = require("./resolve-allowed-credentialed-origins.util");
const _getrequestbaseurlutil = require("../../../../utils/get-request-base-url.util");
const toComparableOrigin = (value)=>{
    try {
        return new URL(value).origin.toLowerCase();
    } catch  {
        return undefined;
    }
};
const isRequestOriginAllowed = ({ origin, request, twentyConfigService })=>{
    const normalizedOrigin = origin.toLowerCase();
    // Compared through URL rather than as strings: browsers omit :443 and :80
    // from Origin while Host keeps whatever port the client spelled, so a genuine
    // same-origin POST would otherwise 403 on the port alone.
    const comparableOrigin = toComparableOrigin(normalizedOrigin);
    const comparableRequestOrigin = toComparableOrigin((0, _getrequestbaseurlutil.getRequestBaseUrl)(request));
    if ((0, _utils.isDefined)(comparableOrigin) && comparableOrigin === comparableRequestOrigin) {
        return true;
    }
    return (0, _resolveallowedcredentialedoriginsutil.resolveAllowedCredentialedOrigins)(twentyConfigService).has(normalizedOrigin);
};

//# sourceMappingURL=is-request-origin-allowed.util.js.map
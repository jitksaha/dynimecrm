"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "assertIssuerIsPublishedOrThrow", {
    enumerable: true,
    get: function() {
        return assertIssuerIsPublishedOrThrow;
    }
});
const _utils = require("twenty-shared/utils");
const _authexception = require("../auth.exception");
const _cleanserverurl = require("../../../../utils/clean-server-url");
const assertIssuerIsPublishedOrThrow = ({ issuer, requestBaseUrl, serverUrl })=>{
    const publishedIssuers = [
        requestBaseUrl,
        (0, _cleanserverurl.cleanServerUrl)(serverUrl)
    ].filter(_utils.isDefined);
    if (!publishedIssuers.includes(issuer)) {
        throw new _authexception.AuthException(`Unknown issuer '${issuer}'`, _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION);
    }
};

//# sourceMappingURL=assert-issuer-is-published.util.js.map
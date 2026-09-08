"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getApplicationUniversalIdentifier", {
    enumerable: true,
    get: function() {
        return getApplicationUniversalIdentifier;
    }
});
const _isapplicationauthcontextguard = require("../../auth/guards/is-application-auth-context.guard");
const getApplicationUniversalIdentifier = (authContext)=>(0, _isapplicationauthcontextguard.isApplicationAuthContext)(authContext) ? authContext.application.universalIdentifier ?? null : null;

//# sourceMappingURL=get-application-universal-identifier.util.js.map
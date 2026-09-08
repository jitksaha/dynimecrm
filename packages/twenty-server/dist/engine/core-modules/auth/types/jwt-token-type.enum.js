"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "JwtTokenTypeEnum", {
    enumerable: true,
    get: function() {
        return JwtTokenTypeEnum;
    }
});
var JwtTokenTypeEnum = /*#__PURE__*/ function(JwtTokenTypeEnum) {
    JwtTokenTypeEnum["ACCESS"] = "ACCESS";
    JwtTokenTypeEnum["REFRESH"] = "REFRESH";
    JwtTokenTypeEnum["WORKSPACE_AGNOSTIC"] = "WORKSPACE_AGNOSTIC";
    JwtTokenTypeEnum["LOGIN"] = "LOGIN";
    JwtTokenTypeEnum["FILE"] = "FILE";
    JwtTokenTypeEnum["FILE_UPLOAD"] = "FILE_UPLOAD";
    JwtTokenTypeEnum["API_KEY"] = "API_KEY";
    JwtTokenTypeEnum["REMOTE_SERVER"] = "REMOTE_SERVER";
    JwtTokenTypeEnum["KEY_ENCRYPTION_KEY"] = "KEY_ENCRYPTION_KEY";
    JwtTokenTypeEnum["APPLICATION_ACCESS"] = "APPLICATION_ACCESS";
    JwtTokenTypeEnum["APPLICATION_REFRESH"] = "APPLICATION_REFRESH";
    JwtTokenTypeEnum["APP_OAUTH_STATE"] = "APP_OAUTH_STATE";
    JwtTokenTypeEnum["APPLICATION_REGISTRATION_GITHUB_CLAIM_STATE"] = "APPLICATION_REGISTRATION_GITHUB_CLAIM_STATE";
    JwtTokenTypeEnum["APPROVED_ACCESS_DOMAIN"] = "APPROVED_ACCESS_DOMAIN";
    JwtTokenTypeEnum["PLAYGROUND"] = "PLAYGROUND";
    return JwtTokenTypeEnum;
}({});

//# sourceMappingURL=jwt-token-type.enum.js.map
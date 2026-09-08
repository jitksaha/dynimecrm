"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RequireAccessTokenGuard", {
    enumerable: true,
    get: function() {
        return RequireAccessTokenGuard;
    }
});
const _common = require("@nestjs/common");
const _authexception = require("../core-modules/auth/auth.exception");
const _jwttokentypeenum = require("../core-modules/auth/types/jwt-token-type.enum");
const _extractrequest = require("../../utils/extract-request");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let RequireAccessTokenGuard = class RequireAccessTokenGuard {
    canActivate(context) {
        const request = (0, _extractrequest.getRequest)(context);
        if (!request) return false;
        if (request.tokenType !== _jwttokentypeenum.JwtTokenTypeEnum.ACCESS) {
            throw new _authexception.AuthException('This endpoint requires a session access token', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION);
        }
        return true;
    }
};
RequireAccessTokenGuard = _ts_decorate([
    (0, _common.Injectable)()
], RequireAccessTokenGuard);

//# sourceMappingURL=require-access-token.guard.js.map
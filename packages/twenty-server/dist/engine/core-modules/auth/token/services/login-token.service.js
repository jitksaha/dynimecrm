"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LoginTokenService", {
    enumerable: true,
    get: function() {
        return LoginTokenService;
    }
});
const _common = require("@nestjs/common");
const _datefns = require("date-fns");
const _ms = /*#__PURE__*/ _interop_require_default(require("ms"));
const _authexception = require("../../auth.exception");
const _jwttokentypeenum = require("../../types/jwt-token-type.enum");
const _jwtwrapperservice = require("../../../jwt/services/jwt-wrapper.service");
const _twentyconfigservice = require("../../../twenty-config/twenty-config.service");
const _workspacetype = require("../../../workspace/types/workspace.type");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let LoginTokenService = class LoginTokenService {
    async generateLoginToken(email, workspaceId, authProvider, options) {
        if (!Object.values(_workspacetype.AuthProviderEnum).includes(authProvider)) {
            throw new _authexception.AuthException('Authentication provider is required to generate a login token', _authexception.AuthExceptionCode.INVALID_INPUT);
        }
        const jwtPayload = {
            type: _jwttokentypeenum.JwtTokenTypeEnum.LOGIN,
            sub: email,
            workspaceId,
            authProvider,
            impersonatorUserWorkspaceId: options?.impersonatorUserWorkspaceId
        };
        const expiresIn = this.twentyConfigService.get('LOGIN_TOKEN_EXPIRES_IN');
        const expiresAt = (0, _datefns.addMilliseconds)(new Date().getTime(), (0, _ms.default)(expiresIn));
        return {
            token: await this.jwtWrapperService.signAsyncOrThrow(jwtPayload, {
                expiresIn
            }),
            expiresAt
        };
    }
    async verifyLoginToken(loginToken) {
        await this.jwtWrapperService.verifyJwtToken(loginToken);
        const decoded = this.jwtWrapperService.decode(loginToken, {
            json: true
        });
        if (decoded.type !== _jwttokentypeenum.JwtTokenTypeEnum.LOGIN) {
            throw new _authexception.AuthException('Expected a login token', _authexception.AuthExceptionCode.INVALID_JWT_TOKEN_TYPE);
        }
        if (!Object.values(_workspacetype.AuthProviderEnum).includes(decoded.authProvider)) {
            throw new _authexception.AuthException('Login token has an invalid authentication provider', _authexception.AuthExceptionCode.UNAUTHENTICATED);
        }
        return decoded;
    }
    constructor(jwtWrapperService, twentyConfigService){
        this.jwtWrapperService = jwtWrapperService;
        this.twentyConfigService = twentyConfigService;
    }
};
LoginTokenService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _jwtwrapperservice.JwtWrapperService === "undefined" ? Object : _jwtwrapperservice.JwtWrapperService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], LoginTokenService);

//# sourceMappingURL=login-token.service.js.map
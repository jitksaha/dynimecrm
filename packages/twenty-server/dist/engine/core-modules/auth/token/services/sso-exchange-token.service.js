"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SSOExchangeTokenService", {
    enumerable: true,
    get: function() {
        return SSOExchangeTokenService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _crypto = /*#__PURE__*/ _interop_require_default(require("crypto"));
const _datefns = require("date-fns");
const _ms = /*#__PURE__*/ _interop_require_default(require("ms"));
const _typeorm1 = require("typeorm");
const _utils = require("twenty-shared/utils");
const _apptokenentity = require("../../../app-token/app-token.entity");
const _authexception = require("../../auth.exception");
const _twentyconfigservice = require("../../../twenty-config/twenty-config.service");
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
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
const hashSSOExchangeToken = (ssoExchangeToken)=>_crypto.default.createHash('sha256').update(ssoExchangeToken).digest('hex');
// A single opaque error for missing, expired and already-consumed tokens:
// distinguishing them would turn this endpoint into a redemption oracle.
const buildInvalidSSOExchangeTokenException = ()=>new _authexception.AuthException('Invalid SSO exchange token', _authexception.AuthExceptionCode.INVALID_INPUT, {
        userFriendlyMessage: /*i18n*/ {
            id: "X7GoTa",
            message: "Authentication failed, please sign in again."
        }
    });
let SSOExchangeTokenService = class SSOExchangeTokenService {
    async generateSSOExchangeToken({ userId, authProvider }) {
        const expiresIn = this.twentyConfigService.get('SHORT_TERM_TOKEN_EXPIRES_IN');
        const expiresAt = (0, _datefns.addMilliseconds)(new Date().getTime(), (0, _ms.default)(expiresIn));
        const plainToken = _crypto.default.randomBytes(32).toString('hex');
        await this.appTokenRepository.save(this.appTokenRepository.create({
            userId,
            expiresAt,
            type: _apptokenentity.AppTokenType.SSOExchangeToken,
            value: hashSSOExchangeToken(plainToken),
            context: {
                authProvider
            }
        }));
        return {
            token: plainToken,
            expiresAt
        };
    }
    async validateAndConsumeSSOExchangeTokenOrThrow(ssoExchangeToken) {
        const appToken = await this.appTokenRepository.findOneBy({
            value: hashSSOExchangeToken(ssoExchangeToken),
            type: _apptokenentity.AppTokenType.SSOExchangeToken,
            revokedAt: (0, _typeorm1.IsNull)(),
            deletedAt: (0, _typeorm1.IsNull)()
        });
        if (!(0, _utils.isDefined)(appToken)) {
            throw buildInvalidSSOExchangeTokenException();
        }
        // Deleting the row is the single-use claim: under concurrent redemption
        // only the request whose delete affects the row proceeds to mint a token.
        // Re-checking revokedAt/deletedAt here keeps the claim atomic with
        // revocation: a token revoked after the lookup cannot redeem.
        const { affected } = await this.appTokenRepository.delete({
            id: appToken.id,
            revokedAt: (0, _typeorm1.IsNull)(),
            deletedAt: (0, _typeorm1.IsNull)()
        });
        if (affected !== 1) {
            throw buildInvalidSSOExchangeTokenException();
        }
        if (new Date() > appToken.expiresAt) {
            throw buildInvalidSSOExchangeTokenException();
        }
        if (!(0, _utils.isDefined)(appToken.userId) || !(0, _utils.isDefined)(appToken.context?.authProvider)) {
            throw buildInvalidSSOExchangeTokenException();
        }
        return {
            userId: appToken.userId,
            authProvider: appToken.context.authProvider
        };
    }
    constructor(appTokenRepository, twentyConfigService){
        this.appTokenRepository = appTokenRepository;
        this.twentyConfigService = twentyConfigService;
    }
};
SSOExchangeTokenService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_apptokenentity.AppTokenEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], SSOExchangeTokenService);

//# sourceMappingURL=sso-exchange-token.service.js.map
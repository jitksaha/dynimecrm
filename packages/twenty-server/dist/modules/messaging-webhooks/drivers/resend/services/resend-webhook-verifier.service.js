"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ResendWebhookVerifierService", {
    enumerable: true,
    get: function() {
        return ResendWebhookVerifierService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _twentyconfigservice = require("../../../../../engine/core-modules/twenty-config/twenty-config.service");
const _verifysvixsignatureutil = require("../utils/verify-svix-signature.util");
const _messagingwebhookexceptioncodeenum = require("../../../messaging-webhook-exception-code.enum");
const _messagingwebhookexception = require("../../../messaging-webhook.exception");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const TIMESTAMP_TOLERANCE_SECONDS = 5 * 60;
let ResendWebhookVerifierService = class ResendWebhookVerifierService {
    assertSigned(rawBody, headers) {
        const signingSecret = this.twentyConfigService.get('RESEND_WEBHOOK_SIGNING_SECRET');
        if (!(0, _guards.isNonEmptyString)(signingSecret)) {
            throw new _messagingwebhookexception.MessagingWebhookException('RESEND_WEBHOOK_SIGNING_SECRET is not configured', _messagingwebhookexceptioncodeenum.MessagingWebhookExceptionCode.MESSAGING_WEBHOOK_NOT_CONFIGURED);
        }
        const { svixId, svixTimestamp, svixSignature } = headers;
        if (!(0, _guards.isNonEmptyString)(svixId) || !(0, _guards.isNonEmptyString)(svixTimestamp) || !(0, _guards.isNonEmptyString)(svixSignature)) {
            throw new _messagingwebhookexception.MessagingWebhookException('Missing Svix signature headers', _messagingwebhookexceptioncodeenum.MessagingWebhookExceptionCode.MESSAGING_WEBHOOK_INVALID_SIGNATURE);
        }
        this.assertTimestampWithinTolerance(svixTimestamp);
        const isSigned = (0, _verifysvixsignatureutil.verifySvixSignature)({
            signingSecret,
            svixId,
            svixTimestamp,
            svixSignature,
            rawBody
        });
        if (!isSigned) {
            this.logger.warn('Resend webhook signature verification failed');
            throw new _messagingwebhookexception.MessagingWebhookException('Resend webhook signature invalid', _messagingwebhookexceptioncodeenum.MessagingWebhookExceptionCode.MESSAGING_WEBHOOK_INVALID_SIGNATURE);
        }
    }
    assertTimestampWithinTolerance(svixTimestamp) {
        const timestampSeconds = Number.parseInt(svixTimestamp, 10);
        const nowSeconds = Math.floor(Date.now() / 1000);
        if (!Number.isFinite(timestampSeconds) || Math.abs(nowSeconds - timestampSeconds) > TIMESTAMP_TOLERANCE_SECONDS) {
            throw new _messagingwebhookexception.MessagingWebhookException('Resend webhook timestamp outside tolerance', _messagingwebhookexceptioncodeenum.MessagingWebhookExceptionCode.MESSAGING_WEBHOOK_INVALID_SIGNATURE);
        }
    }
    constructor(twentyConfigService){
        this.twentyConfigService = twentyConfigService;
        this.logger = new _common.Logger(ResendWebhookVerifierService.name);
    }
};
ResendWebhookVerifierService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], ResendWebhookVerifierService);

//# sourceMappingURL=resend-webhook-verifier.service.js.map
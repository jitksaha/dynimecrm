"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SnsSignatureVerifierService", {
    enumerable: true,
    get: function() {
        return SnsSignatureVerifierService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _snspayloadvalidator = /*#__PURE__*/ _interop_require_default(require("sns-payload-validator"));
const _messagingwebhookexceptioncodeenum = require("../../../messaging-webhook-exception-code.enum");
const _messagingwebhookexception = require("../../../messaging-webhook.exception");
const _twentyconfigservice = require("../../../../../engine/core-modules/twenty-config/twenty-config.service");
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
let SnsSignatureVerifierService = class SnsSignatureVerifierService {
    async assertAllowedAndSigned(payload) {
        this.assertTopicAllowlistedOrThrow(payload.TopicArn);
        try {
            await this.validator.validate(payload);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.warn(`SNS signature verification failed: ${errorMessage}`);
            throw new _messagingwebhookexception.MessagingWebhookException('SNS signature invalid', _messagingwebhookexceptioncodeenum.MessagingWebhookExceptionCode.MESSAGING_WEBHOOK_INVALID_SIGNATURE);
        }
    }
    assertTopicAllowlistedOrThrow(topicArn) {
        const allowlist = this.twentyConfigService.get('SES_SNS_TOPIC_ARN_ALLOWLIST');
        const allowedTopicArns = (allowlist ?? '').split(',').map((entry)=>entry.trim()).filter(_guards.isNonEmptyString);
        if (!(0, _guards.isNonEmptyArray)(allowedTopicArns)) {
            throw new _messagingwebhookexception.MessagingWebhookException('SES_SNS_TOPIC_ARN_ALLOWLIST is not configured, every SES webhook payload is rejected', _messagingwebhookexceptioncodeenum.MessagingWebhookExceptionCode.MESSAGING_WEBHOOK_NOT_CONFIGURED);
        }
        if (!allowedTopicArns.includes(topicArn)) {
            this.logger.warn(`SNS topic ${topicArn} is not in allowlist`);
            throw new _messagingwebhookexception.MessagingWebhookException('SNS topic not allowed', _messagingwebhookexceptioncodeenum.MessagingWebhookExceptionCode.MESSAGING_WEBHOOK_FORBIDDEN_TOPIC);
        }
    }
    constructor(twentyConfigService){
        this.twentyConfigService = twentyConfigService;
        this.logger = new _common.Logger(SnsSignatureVerifierService.name);
        this.validator = new _snspayloadvalidator.default();
    }
};
SnsSignatureVerifierService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], SnsSignatureVerifierService);

//# sourceMappingURL=sns-signature-verifier.service.js.map
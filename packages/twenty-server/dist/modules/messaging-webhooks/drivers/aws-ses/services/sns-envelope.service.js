"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SnsEnvelopeService", {
    enumerable: true,
    get: function() {
        return SnsEnvelopeService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _snssignatureverifierservice = require("./sns-signature-verifier.service");
const _snssubscriptionconfirmerservice = require("./sns-subscription-confirmer.service");
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
let SnsEnvelopeService = class SnsEnvelopeService {
    async openNotification(rawBody) {
        const payload = (0, _utils.parseJson)(rawBody.toString('utf8'));
        if (!(0, _utils.isDefined)(payload)) {
            throw new _messagingwebhookexception.MessagingWebhookException('Invalid SNS payload', _messagingwebhookexceptioncodeenum.MessagingWebhookExceptionCode.MESSAGING_WEBHOOK_INVALID_PAYLOAD);
        }
        await this.snsSignatureVerifierService.assertAllowedAndSigned(payload);
        if (payload.Type === 'SubscriptionConfirmation' || payload.Type === 'UnsubscribeConfirmation') {
            await this.snsSubscriptionConfirmerService.confirm(payload.SubscribeURL);
            return null;
        }
        if (payload.Type !== 'Notification') {
            return null;
        }
        const notification = (0, _utils.parseJson)(payload.Message);
        // parseJson happily returns a JSON scalar, which every caller then reads as
        // a notification object.
        if (!(0, _guards.isObject)(notification)) {
            throw new _messagingwebhookexception.MessagingWebhookException('Invalid SNS notification message', _messagingwebhookexceptioncodeenum.MessagingWebhookExceptionCode.MESSAGING_WEBHOOK_INVALID_PAYLOAD);
        }
        return {
            notification,
            messageId: payload.MessageId
        };
    }
    constructor(snsSignatureVerifierService, snsSubscriptionConfirmerService){
        this.snsSignatureVerifierService = snsSignatureVerifierService;
        this.snsSubscriptionConfirmerService = snsSubscriptionConfirmerService;
    }
};
SnsEnvelopeService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _snssignatureverifierservice.SnsSignatureVerifierService === "undefined" ? Object : _snssignatureverifierservice.SnsSignatureVerifierService,
        typeof _snssubscriptionconfirmerservice.SnsSubscriptionConfirmerService === "undefined" ? Object : _snssubscriptionconfirmerservice.SnsSubscriptionConfirmerService
    ])
], SnsEnvelopeService);

//# sourceMappingURL=sns-envelope.service.js.map
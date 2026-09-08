"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SesInboundWebhookDriverService", {
    enumerable: true,
    get: function() {
        return SesInboundWebhookDriverService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _snsenvelopeservice = require("./sns-envelope.service");
const _inboundmailhandlerservice = require("../../../handlers/inbound-mail-handler.service");
const _inboundemailmessagesourceconstant = require("../../../../messaging/message-import-manager/drivers/inbound-email/constants/inbound-email-message-source.constant");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let SesInboundWebhookDriverService = class SesInboundWebhookDriverService {
    async handle(rawBody) {
        const envelope = await this.snsEnvelopeService.openNotification(rawBody);
        if (!(0, _utils.isDefined)(envelope)) {
            return;
        }
        const { notification, messageId } = envelope;
        await this.inboundMailHandlerService.handle(this.normalizeNotification(notification, messageId));
    }
    normalizeNotification(notification, snsMessageId) {
        const action = notification.receipt?.action;
        const recipients = notification.receipt?.recipients ?? [];
        const subject = notification.mail?.commonHeaders?.subject ?? null;
        if (action?.type !== 'S3') {
            this.logger.warn(`SNS message ${snsMessageId} has unsupported action type ${action?.type}`);
            return {
                recipients,
                subject,
                message: null,
                dedupeKey: snsMessageId
            };
        }
        const message = {
            source: _inboundemailmessagesourceconstant.INBOUND_EMAIL_MESSAGE_SOURCE.SES_S3,
            reference: action.objectKey
        };
        return {
            recipients,
            subject,
            message,
            dedupeKey: snsMessageId
        };
    }
    constructor(snsEnvelopeService, inboundMailHandlerService){
        this.snsEnvelopeService = snsEnvelopeService;
        this.inboundMailHandlerService = inboundMailHandlerService;
        this.logger = new _common.Logger(SesInboundWebhookDriverService.name);
    }
};
SesInboundWebhookDriverService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _snsenvelopeservice.SnsEnvelopeService === "undefined" ? Object : _snsenvelopeservice.SnsEnvelopeService,
        typeof _inboundmailhandlerservice.InboundMailHandlerService === "undefined" ? Object : _inboundmailhandlerservice.InboundMailHandlerService
    ])
], SesInboundWebhookDriverService);

//# sourceMappingURL=ses-inbound-webhook-driver.service.js.map
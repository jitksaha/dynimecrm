"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ResendWebhookDriverService", {
    enumerable: true,
    get: function() {
        return ResendWebhookDriverService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _resendworkspacetagnameconstant = require("../../../../../engine/core-modules/emailing-domain/drivers/resend/constants/resend-workspace-tag-name.constant");
const _resendwebhookverifierservice = require("./resend-webhook-verifier.service");
const _getresendeventtagvalueutil = require("../utils/get-resend-event-tag-value.util");
const _resolveresendoutbounddeliveryoutcomeutil = require("../utils/resolve-resend-outbound-delivery-outcome.util");
const _inboundmailhandlerservice = require("../../../handlers/inbound-mail-handler.service");
const _outbounddeliveryeventhandlerservice = require("../../../handlers/outbound-delivery-event-handler.service");
const _messagingwebhookexceptioncodeenum = require("../../../messaging-webhook-exception-code.enum");
const _messagingwebhookexception = require("../../../messaging-webhook.exception");
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
let ResendWebhookDriverService = class ResendWebhookDriverService {
    async handle(rawBody, headers) {
        this.resendWebhookVerifierService.assertSigned(rawBody, headers);
        const { svixId } = headers;
        if (!(0, _guards.isNonEmptyString)(svixId)) {
            throw new _messagingwebhookexception.MessagingWebhookException('Resend webhook payload has no svix-id header', _messagingwebhookexceptioncodeenum.MessagingWebhookExceptionCode.MESSAGING_WEBHOOK_INVALID_PAYLOAD);
        }
        const event = (0, _utils.parseJson)(rawBody.toString('utf8'));
        if (!(0, _utils.isDefined)(event) || !(0, _guards.isNonEmptyString)(event.type)) {
            throw new _messagingwebhookexception.MessagingWebhookException('Invalid Resend webhook payload', _messagingwebhookexceptioncodeenum.MessagingWebhookExceptionCode.MESSAGING_WEBHOOK_INVALID_PAYLOAD);
        }
        if (event.type === 'email.received') {
            await this.handleReceivedEvent(event);
            return;
        }
        await this.handleDeliveryEvent({
            event,
            dedupeKey: svixId
        });
    }
    async handleDeliveryEvent({ event, dedupeKey }) {
        const deliveryOutcome = (0, _resolveresendoutbounddeliveryoutcomeutil.resolveResendOutboundDeliveryOutcome)(event);
        if (!(0, _utils.isDefined)(deliveryOutcome)) {
            return;
        }
        const workspaceId = (0, _getresendeventtagvalueutil.getResendEventTagValue)(event.data?.tags, _resendworkspacetagnameconstant.RESEND_WORKSPACE_TAG_NAME);
        if (!(0, _guards.isNonEmptyString)(workspaceId)) {
            this.logger.warn(`Ignoring Resend ${event.type} event without a ${_resendworkspacetagnameconstant.RESEND_WORKSPACE_TAG_NAME} tag`);
            return;
        }
        await this.outboundDeliveryEventHandlerService.handle({
            workspaceId,
            outcome: deliveryOutcome.outcome,
            suppression: deliveryOutcome.suppression,
            providerMessageId: event.data?.email_id ?? null,
            providerEventId: deliveryOutcome.providerEventId,
            dedupeKey
        });
    }
    async handleReceivedEvent(event) {
        const emailId = event.data?.email_id;
        if (!(0, _guards.isNonEmptyString)(emailId)) {
            throw new _messagingwebhookexception.MessagingWebhookException('Resend email.received event has no email_id', _messagingwebhookexceptioncodeenum.MessagingWebhookExceptionCode.MESSAGING_WEBHOOK_INVALID_PAYLOAD);
        }
        // received_for carries the envelope recipients; to/cc cover mail
        // delivered through aliases or group expansion
        const recipients = [
            ...event.data?.received_for ?? [],
            ...event.data?.to ?? [],
            ...event.data?.cc ?? []
        ];
        await this.inboundMailHandlerService.handle({
            recipients,
            subject: event.data?.subject ?? null,
            message: {
                source: _inboundemailmessagesourceconstant.INBOUND_EMAIL_MESSAGE_SOURCE.RESEND,
                reference: emailId
            },
            dedupeKey: emailId
        });
    }
    constructor(resendWebhookVerifierService, outboundDeliveryEventHandlerService, inboundMailHandlerService){
        this.resendWebhookVerifierService = resendWebhookVerifierService;
        this.outboundDeliveryEventHandlerService = outboundDeliveryEventHandlerService;
        this.inboundMailHandlerService = inboundMailHandlerService;
        this.logger = new _common.Logger(ResendWebhookDriverService.name);
    }
};
ResendWebhookDriverService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _resendwebhookverifierservice.ResendWebhookVerifierService === "undefined" ? Object : _resendwebhookverifierservice.ResendWebhookVerifierService,
        typeof _outbounddeliveryeventhandlerservice.OutboundDeliveryEventHandlerService === "undefined" ? Object : _outbounddeliveryeventhandlerservice.OutboundDeliveryEventHandlerService,
        typeof _inboundmailhandlerservice.InboundMailHandlerService === "undefined" ? Object : _inboundmailhandlerservice.InboundMailHandlerService
    ])
], ResendWebhookDriverService);

//# sourceMappingURL=resend-webhook-driver.service.js.map
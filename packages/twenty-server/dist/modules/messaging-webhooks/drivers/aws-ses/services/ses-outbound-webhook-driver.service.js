"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SesOutboundWebhookDriverService", {
    enumerable: true,
    get: function() {
        return SesOutboundWebhookDriverService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _exceptionhandlerservice = require("../../../../../engine/core-modules/exception-handler/exception-handler.service");
const _snsenvelopeservice = require("./sns-envelope.service");
const _normalizesesoutboundeventutil = require("../utils/normalize-ses-outbound-event.util");
const _outbounddeliveryeventhandlerservice = require("../../../handlers/outbound-delivery-event-handler.service");
const _outboundsendingstatehandlerservice = require("../../../handlers/outbound-sending-state-handler.service");
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
let SesOutboundWebhookDriverService = class SesOutboundWebhookDriverService {
    async handle(rawBody) {
        const envelope = await this.snsEnvelopeService.openNotification(rawBody);
        if (!(0, _utils.isDefined)(envelope)) {
            return;
        }
        const { notification, messageId } = envelope;
        const event = (0, _normalizesesoutboundeventutil.normalizeSesOutboundEvent)(notification);
        switch(event.status){
            case 'DELIVERY':
                await this.outboundDeliveryEventHandlerService.handle({
                    ...event.delivery,
                    dedupeKey: messageId
                });
                return;
            case 'SENDING_STATE':
                await this.outboundSendingStateHandlerService.handle(event.sendingState);
                return;
            case 'UNPROCESSABLE':
                if (event.reason === 'UNSUPPORTED_EVENT_NAME') {
                    this.logger.log(`Ignored SES outbound event ${event.eventName}`);
                    return;
                }
                this.exceptionHandlerService.captureExceptions([
                    new _messagingwebhookexception.MessagingWebhookException(`Dropped SES outbound event ${event.eventName}: ${event.reason}`, _messagingwebhookexceptioncodeenum.MessagingWebhookExceptionCode.MESSAGING_WEBHOOK_UNHANDLED_ERROR)
                ]);
                return;
        }
    }
    constructor(exceptionHandlerService, snsEnvelopeService, outboundDeliveryEventHandlerService, outboundSendingStateHandlerService){
        this.exceptionHandlerService = exceptionHandlerService;
        this.snsEnvelopeService = snsEnvelopeService;
        this.outboundDeliveryEventHandlerService = outboundDeliveryEventHandlerService;
        this.outboundSendingStateHandlerService = outboundSendingStateHandlerService;
        this.logger = new _common.Logger(SesOutboundWebhookDriverService.name);
    }
};
SesOutboundWebhookDriverService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _exceptionhandlerservice.ExceptionHandlerService === "undefined" ? Object : _exceptionhandlerservice.ExceptionHandlerService,
        typeof _snsenvelopeservice.SnsEnvelopeService === "undefined" ? Object : _snsenvelopeservice.SnsEnvelopeService,
        typeof _outbounddeliveryeventhandlerservice.OutboundDeliveryEventHandlerService === "undefined" ? Object : _outbounddeliveryeventhandlerservice.OutboundDeliveryEventHandlerService,
        typeof _outboundsendingstatehandlerservice.OutboundSendingStateHandlerService === "undefined" ? Object : _outboundsendingstatehandlerservice.OutboundSendingStateHandlerService
    ])
], SesOutboundWebhookDriverService);

//# sourceMappingURL=ses-outbound-webhook-driver.service.js.map
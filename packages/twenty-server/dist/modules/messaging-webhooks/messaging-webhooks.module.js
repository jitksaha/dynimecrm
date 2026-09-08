"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessagingWebhooksModule", {
    enumerable: true,
    get: function() {
        return MessagingWebhooksModule;
    }
});
const _common = require("@nestjs/common");
const _emailingdomainmodule = require("../../engine/core-modules/emailing-domain/emailing-domain.module");
const _twentyconfigmodule = require("../../engine/core-modules/twenty-config/twenty-config.module");
const _emailingmodule = require("../emailing/emailing.module");
const _resendwebhookdriverservice = require("./drivers/resend/services/resend-webhook-driver.service");
const _resendwebhookverifierservice = require("./drivers/resend/services/resend-webhook-verifier.service");
const _sesinboundwebhookdriverservice = require("./drivers/aws-ses/services/ses-inbound-webhook-driver.service");
const _sesoutboundwebhookdriverservice = require("./drivers/aws-ses/services/ses-outbound-webhook-driver.service");
const _snsenvelopeservice = require("./drivers/aws-ses/services/sns-envelope.service");
const _snssignatureverifierservice = require("./drivers/aws-ses/services/sns-signature-verifier.service");
const _snssubscriptionconfirmerservice = require("./drivers/aws-ses/services/sns-subscription-confirmer.service");
const _inboundmailhandlerservice = require("./handlers/inbound-mail-handler.service");
const _inboundunsubscribehandlerservice = require("./handlers/inbound-unsubscribe-handler.service");
const _outbounddeliveryeventhandlerservice = require("./handlers/outbound-delivery-event-handler.service");
const _outbounddeliveryeventprocessorservice = require("./handlers/outbound-delivery-event-processor.service");
const _outboundsendingstatehandlerservice = require("./handlers/outbound-sending-state-handler.service");
const _messagingoutbounddeliveryeventjob = require("./jobs/messaging-outbound-delivery-event.job");
const _messagingwebhookscontroller = require("./messaging-webhooks.controller");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let MessagingWebhooksModule = class MessagingWebhooksModule {
};
MessagingWebhooksModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _twentyconfigmodule.TwentyConfigModule,
            _emailingdomainmodule.EmailingDomainModule,
            _emailingmodule.EmailingModule
        ],
        controllers: [
            _messagingwebhookscontroller.MessagingWebhooksController
        ],
        providers: [
            _inboundmailhandlerservice.InboundMailHandlerService,
            _inboundunsubscribehandlerservice.InboundUnsubscribeHandlerService,
            _outbounddeliveryeventhandlerservice.OutboundDeliveryEventHandlerService,
            _outbounddeliveryeventprocessorservice.OutboundDeliveryEventProcessorService,
            _outboundsendingstatehandlerservice.OutboundSendingStateHandlerService,
            _messagingoutbounddeliveryeventjob.MessagingOutboundDeliveryEventJob,
            _snsenvelopeservice.SnsEnvelopeService,
            _snssignatureverifierservice.SnsSignatureVerifierService,
            _snssubscriptionconfirmerservice.SnsSubscriptionConfirmerService,
            _sesinboundwebhookdriverservice.SesInboundWebhookDriverService,
            _sesoutboundwebhookdriverservice.SesOutboundWebhookDriverService,
            _resendwebhookverifierservice.ResendWebhookVerifierService,
            _resendwebhookdriverservice.ResendWebhookDriverService
        ]
    })
], MessagingWebhooksModule);

//# sourceMappingURL=messaging-webhooks.module.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OutboundDeliveryEventProcessorService", {
    enumerable: true,
    get: function() {
        return OutboundDeliveryEventProcessorService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _messagesuppressionsourcetype = require("../../../engine/core-modules/emailing-domain/types/message-suppression-source.type");
const _messagecampaigndeliveryfeedbackservice = require("../../emailing/services/message-campaign-delivery-feedback.service");
const _messagesuppressionservice = require("../../emailing/services/message-suppression.service");
const _messagingwebhookexceptioncodeenum = require("../messaging-webhook-exception-code.enum");
const _messagingwebhookexception = require("../messaging-webhook.exception");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let OutboundDeliveryEventProcessorService = class OutboundDeliveryEventProcessorService {
    async process(event) {
        const { suppression } = event;
        if ((0, _utils.isDefined)(suppression)) {
            const results = await Promise.allSettled(suppression.emailAddresses.map((emailAddress)=>this.messageSuppressionService.suppress({
                    workspaceId: event.workspaceId,
                    emailAddress,
                    reason: suppression.reason,
                    source: _messagesuppressionsourcetype.MessageSuppressionSource.WEBHOOK,
                    providerEventId: event.providerEventId
                })));
            if (results.some((result)=>result.status === 'rejected')) {
                throw new _messagingwebhookexception.MessagingWebhookException(`Failed to suppress one or more recipients for ${suppression.reason} event in workspace ${event.workspaceId}`, _messagingwebhookexceptioncodeenum.MessagingWebhookExceptionCode.MESSAGING_WEBHOOK_UNHANDLED_ERROR);
            }
        }
        if (!(0, _utils.isDefined)(event.providerMessageId)) {
            return;
        }
        await this.messageCampaignDeliveryFeedbackService.recordProviderOutcomeByProviderMessageId({
            workspaceId: event.workspaceId,
            providerMessageId: event.providerMessageId,
            outcome: event.outcome
        });
    }
    constructor(messageSuppressionService, messageCampaignDeliveryFeedbackService){
        this.messageSuppressionService = messageSuppressionService;
        this.messageCampaignDeliveryFeedbackService = messageCampaignDeliveryFeedbackService;
    }
};
OutboundDeliveryEventProcessorService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _messagesuppressionservice.MessageSuppressionService === "undefined" ? Object : _messagesuppressionservice.MessageSuppressionService,
        typeof _messagecampaigndeliveryfeedbackservice.MessageCampaignDeliveryFeedbackService === "undefined" ? Object : _messagecampaigndeliveryfeedbackservice.MessageCampaignDeliveryFeedbackService
    ])
], OutboundDeliveryEventProcessorService);

//# sourceMappingURL=outbound-delivery-event-processor.service.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OutboundDeliveryEventHandlerService", {
    enumerable: true,
    get: function() {
        return OutboundDeliveryEventHandlerService;
    }
});
const _common = require("@nestjs/common");
const _campaignsendretrybackoffconstant = require("../../../engine/core-modules/emailing-domain/constants/campaign-send-retry-backoff.constant");
const _messagequeuedecorator = require("../../../engine/core-modules/message-queue/decorators/message-queue.decorator");
const _messagequeueconstants = require("../../../engine/core-modules/message-queue/message-queue.constants");
const _messagequeueservice = require("../../../engine/core-modules/message-queue/services/message-queue.service");
const _messagingoutbounddeliveryeventjob = require("../jobs/messaging-outbound-delivery-event.job");
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
const DELIVERY_EVENT_RETRY_LIMIT = 5;
let OutboundDeliveryEventHandlerService = class OutboundDeliveryEventHandlerService {
    async handle(event) {
        await this.messageQueueService.add(_messagingoutbounddeliveryeventjob.MessagingOutboundDeliveryEventJob.name, event, {
            id: event.dedupeKey,
            allowDuplicatedPrefixes: true,
            retryLimit: DELIVERY_EVENT_RETRY_LIMIT,
            backoff: _campaignsendretrybackoffconstant.CAMPAIGN_SEND_RETRY_BACKOFF
        });
    }
    constructor(messageQueueService){
        this.messageQueueService = messageQueueService;
    }
};
OutboundDeliveryEventHandlerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.campaignQueue)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService
    ])
], OutboundDeliveryEventHandlerService);

//# sourceMappingURL=outbound-delivery-event-handler.service.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessagingOutboundDeliveryEventJob", {
    enumerable: true,
    get: function() {
        return MessagingOutboundDeliveryEventJob;
    }
});
const _processdecorator = require("../../../engine/core-modules/message-queue/decorators/process.decorator");
const _processordecorator = require("../../../engine/core-modules/message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../engine/core-modules/message-queue/message-queue.constants");
const _outbounddeliveryeventprocessorservice = require("../handlers/outbound-delivery-event-processor.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let MessagingOutboundDeliveryEventJob = class MessagingOutboundDeliveryEventJob {
    async handle(data) {
        await this.outboundDeliveryEventProcessorService.process(data);
    }
    constructor(outboundDeliveryEventProcessorService){
        this.outboundDeliveryEventProcessorService = outboundDeliveryEventProcessorService;
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(MessagingOutboundDeliveryEventJob.name),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof NormalizedOutboundDeliveryEvent === "undefined" ? Object : NormalizedOutboundDeliveryEvent
    ]),
    _ts_metadata("design:returntype", Promise)
], MessagingOutboundDeliveryEventJob.prototype, "handle", null);
MessagingOutboundDeliveryEventJob = _ts_decorate([
    (0, _processordecorator.Processor)(_messagequeueconstants.MessageQueue.campaignQueue),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _outbounddeliveryeventprocessorservice.OutboundDeliveryEventProcessorService === "undefined" ? Object : _outbounddeliveryeventprocessorservice.OutboundDeliveryEventProcessorService
    ])
], MessagingOutboundDeliveryEventJob);

//# sourceMappingURL=messaging-outbound-delivery-event.job.js.map
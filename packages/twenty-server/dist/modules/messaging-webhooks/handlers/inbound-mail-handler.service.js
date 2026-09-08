"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "InboundMailHandlerService", {
    enumerable: true,
    get: function() {
        return InboundMailHandlerService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _unsubscribemailboxconstant = require("../../../engine/core-modules/emailing-domain/constants/unsubscribe-mailbox.constant");
const _messagequeuedecorator = require("../../../engine/core-modules/message-queue/decorators/message-queue.decorator");
const _messagequeueconstants = require("../../../engine/core-modules/message-queue/message-queue.constants");
const _messagequeueservice = require("../../../engine/core-modules/message-queue/services/message-queue.service");
const _inboundunsubscribehandlerservice = require("./inbound-unsubscribe-handler.service");
const _messaginginboundemailimportjob = require("../../messaging/message-import-manager/jobs/messaging-inbound-email-import.job");
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
let InboundMailHandlerService = class InboundMailHandlerService {
    async handle(notification) {
        if (this.isAddressedToUnsubscribeMailbox(notification.recipients)) {
            await this.inboundUnsubscribeHandlerService.handle(notification.subject);
            return;
        }
        if (!(0, _utils.isDefined)(notification.message)) {
            this.logger.warn(`Inbound mail notification ${notification.dedupeKey} has no retrievable message content`);
            return;
        }
        await this.messageQueueService.add(_messaginginboundemailimportjob.MessagingInboundEmailImportJob.name, {
            source: notification.message.source,
            reference: notification.message.reference,
            envelopeRecipients: notification.recipients
        }, {
            id: notification.dedupeKey
        });
    }
    isAddressedToUnsubscribeMailbox(recipients) {
        return recipients.some((recipient)=>recipient.split('@')[0]?.toLowerCase() === _unsubscribemailboxconstant.UNSUBSCRIBE_MAILBOX_LOCAL_PART);
    }
    constructor(messageQueueService, inboundUnsubscribeHandlerService){
        this.messageQueueService = messageQueueService;
        this.inboundUnsubscribeHandlerService = inboundUnsubscribeHandlerService;
        this.logger = new _common.Logger(InboundMailHandlerService.name);
    }
};
InboundMailHandlerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.messagingQueue)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService,
        typeof _inboundunsubscribehandlerservice.InboundUnsubscribeHandlerService === "undefined" ? Object : _inboundunsubscribehandlerservice.InboundUnsubscribeHandlerService
    ])
], InboundMailHandlerService);

//# sourceMappingURL=inbound-mail-handler.service.js.map
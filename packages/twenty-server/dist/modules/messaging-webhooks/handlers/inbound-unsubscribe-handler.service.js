"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "InboundUnsubscribeHandlerService", {
    enumerable: true,
    get: function() {
        return InboundUnsubscribeHandlerService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _unsubscribetokenservice = require("../../../engine/core-modules/emailing-domain/services/unsubscribe-token.service");
const _messagesuppressionservice = require("../../emailing/services/message-suppression.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let InboundUnsubscribeHandlerService = class InboundUnsubscribeHandlerService {
    async handle(subject) {
        if (!(0, _guards.isNonEmptyString)(subject)) {
            this.logger.warn('Unsubscribe email received without a token subject');
            return;
        }
        const verification = this.unsubscribeTokenService.verify(subject.trim());
        if (!(0, _utils.isDefined)(verification)) {
            this.logger.warn('Unsubscribe email received with an invalid token');
            return;
        }
        const { payload } = verification;
        if (payload.preview === true) {
            return;
        }
        await this.messageSuppressionService.unsubscribeFromEverything({
            workspaceId: payload.workspaceId,
            emailAddress: payload.emailAddress
        });
    }
    constructor(unsubscribeTokenService, messageSuppressionService){
        this.unsubscribeTokenService = unsubscribeTokenService;
        this.messageSuppressionService = messageSuppressionService;
        this.logger = new _common.Logger(InboundUnsubscribeHandlerService.name);
    }
};
InboundUnsubscribeHandlerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _unsubscribetokenservice.UnsubscribeTokenService === "undefined" ? Object : _unsubscribetokenservice.UnsubscribeTokenService,
        typeof _messagesuppressionservice.MessageSuppressionService === "undefined" ? Object : _messagesuppressionservice.MessageSuppressionService
    ])
], InboundUnsubscribeHandlerService);

//# sourceMappingURL=inbound-unsubscribe-handler.service.js.map
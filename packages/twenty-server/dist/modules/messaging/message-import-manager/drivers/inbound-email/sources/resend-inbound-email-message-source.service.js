"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ResendInboundEmailMessageSourceService", {
    enumerable: true,
    get: function() {
        return ResendInboundEmailMessageSourceService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _emailingdomaindriverexception = require("../../../../../../engine/core-modules/emailing-domain/drivers/exceptions/emailing-domain-driver.exception");
const _resendapiclientservice = require("../../../../../../engine/core-modules/emailing-domain/drivers/resend/services/resend-api-client.service");
const _twentyconfigservice = require("../../../../../../engine/core-modules/twenty-config/twenty-config.service");
const _inboundemailparserservice = require("../services/inbound-email-parser.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ResendInboundEmailMessageSourceService = class ResendInboundEmailMessageSourceService {
    isConfigured() {
        return (0, _guards.isNonEmptyString)(this.twentyConfigService.get('RESEND_API_KEY'));
    }
    async fetchMessage(reference) {
        const receivedEmail = await this.resendApiClientService.getReceivedEmail(reference);
        const downloadUrl = receivedEmail.raw?.download_url;
        if (!(0, _guards.isNonEmptyString)(downloadUrl)) {
            throw new _emailingdomaindriverexception.EmailingDomainDriverException(`Received email ${reference} has no raw content download URL`, _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.NOT_FOUND, {
                userFriendlyMessage: /*i18n*/ {
                    id: "xKvSoz",
                    message: "The received email content is no longer available."
                }
            });
        }
        const rawMessage = await this.resendApiClientService.downloadRawEmail(downloadUrl);
        const { message } = await this.inboundEmailParserService.parse(rawMessage, reference);
        return message;
    }
    async cleanup(_reference) {
    // Resend retains received emails on their side; nothing to delete
    }
    constructor(twentyConfigService, resendApiClientService, inboundEmailParserService){
        this.twentyConfigService = twentyConfigService;
        this.resendApiClientService = resendApiClientService;
        this.inboundEmailParserService = inboundEmailParserService;
    }
};
ResendInboundEmailMessageSourceService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _resendapiclientservice.ResendApiClientService === "undefined" ? Object : _resendapiclientservice.ResendApiClientService,
        typeof _inboundemailparserservice.InboundEmailParserService === "undefined" ? Object : _inboundemailparserservice.InboundEmailParserService
    ])
], ResendInboundEmailMessageSourceService);

//# sourceMappingURL=resend-inbound-email-message-source.service.js.map
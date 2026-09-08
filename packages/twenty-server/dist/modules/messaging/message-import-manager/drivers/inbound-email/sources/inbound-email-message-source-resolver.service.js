"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "InboundEmailMessageSourceResolverService", {
    enumerable: true,
    get: function() {
        return InboundEmailMessageSourceResolverService;
    }
});
const _common = require("@nestjs/common");
const _resendinboundemailmessagesourceservice = require("./resend-inbound-email-message-source.service");
const _sess3inboundemailmessagesourceservice = require("./ses-s3-inbound-email-message-source.service");
const _inboundemailmessagesourceconstant = require("../constants/inbound-email-message-source.constant");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let InboundEmailMessageSourceResolverService = class InboundEmailMessageSourceResolverService {
    resolve(source) {
        switch(source){
            case _inboundemailmessagesourceconstant.INBOUND_EMAIL_MESSAGE_SOURCE.SES_S3:
                return this.sesS3InboundEmailMessageSourceService;
            case _inboundemailmessagesourceconstant.INBOUND_EMAIL_MESSAGE_SOURCE.RESEND:
                return this.resendInboundEmailMessageSourceService;
            default:
                throw new Error(`Unsupported inbound email message source: ${source}`);
        }
    }
    constructor(sesS3InboundEmailMessageSourceService, resendInboundEmailMessageSourceService){
        this.sesS3InboundEmailMessageSourceService = sesS3InboundEmailMessageSourceService;
        this.resendInboundEmailMessageSourceService = resendInboundEmailMessageSourceService;
    }
};
InboundEmailMessageSourceResolverService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _sess3inboundemailmessagesourceservice.SesS3InboundEmailMessageSourceService === "undefined" ? Object : _sess3inboundemailmessagesourceservice.SesS3InboundEmailMessageSourceService,
        typeof _resendinboundemailmessagesourceservice.ResendInboundEmailMessageSourceService === "undefined" ? Object : _resendinboundemailmessagesourceservice.ResendInboundEmailMessageSourceService
    ])
], InboundEmailMessageSourceResolverService);

//# sourceMappingURL=inbound-email-message-source-resolver.service.js.map
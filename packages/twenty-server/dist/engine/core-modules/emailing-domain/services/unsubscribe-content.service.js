"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UnsubscribeContentService", {
    enumerable: true,
    get: function() {
        return UnsubscribeContentService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _emailingdomaindriverexception = require("../drivers/exceptions/emailing-domain-driver.exception");
const _getsoleenveloperecipientutil = require("../utils/get-sole-envelope-recipient.util");
const _unsubscribetokenservice = require("./unsubscribe-token.service");
const _buildunsubscribeheadersutil = require("../utils/build-unsubscribe-headers.util");
const _appendhtmlfooterutil = require("../utils/append-html-footer.util");
const _buildunsubscribehtmlfooterutil = require("../utils/build-unsubscribe-html-footer.util");
const _buildunsubscribetextfooterutil = require("../utils/build-unsubscribe-text-footer.util");
const _buildunsubscribeweburlutil = require("../utils/build-unsubscribe-web-url.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UnsubscribeContentService = class UnsubscribeContentService {
    addTo(email, unsubscribeBaseUrl) {
        if (email.sendKind === 'TRANSACTIONAL') {
            return email;
        }
        if (!(0, _guards.isNonEmptyString)(unsubscribeBaseUrl)) {
            throw new _emailingdomaindriverexception.EmailingDomainDriverException('A marketing email cannot be sent before the unsubscribe domain is active, because it would ship with no way to unsubscribe', _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.UNSUBSCRIBE_NOT_READY);
        }
        const soleRecipient = (0, _getsoleenveloperecipientutil.getSoleEnvelopeRecipient)(email);
        if (soleRecipient === null) {
            throw new _emailingdomaindriverexception.EmailingDomainDriverException('A marketing email must have exactly one envelope recipient so the unsubscribe token identifies who is unsubscribing', _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.UNSUBSCRIBE_MULTIPLE_RECIPIENTS);
        }
        const token = this.unsubscribeTokenService.sign({
            workspaceId: email.workspaceId,
            emailAddress: soleRecipient
        });
        const webUrl = (0, _buildunsubscribeweburlutil.buildUnsubscribeWebUrl)({
            unsubscribeBaseUrl,
            token
        });
        return {
            ...email,
            text: `${email.text}${(0, _buildunsubscribetextfooterutil.buildUnsubscribeTextFooter)(webUrl)}`,
            html: (0, _guards.isNonEmptyString)(email.html) ? (0, _appendhtmlfooterutil.appendHtmlFooter)(email.html, (0, _buildunsubscribehtmlfooterutil.buildUnsubscribeHtmlFooter)(webUrl)) : email.html,
            headers: [
                ...email.headers ?? [],
                ...(0, _buildunsubscribeheadersutil.buildUnsubscribeHeaders)({
                    webUrl
                })
            ]
        };
    }
    constructor(unsubscribeTokenService){
        this.unsubscribeTokenService = unsubscribeTokenService;
    }
};
UnsubscribeContentService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _unsubscribetokenservice.UnsubscribeTokenService === "undefined" ? Object : _unsubscribetokenservice.UnsubscribeTokenService
    ])
], UnsubscribeContentService);

//# sourceMappingURL=unsubscribe-content.service.js.map
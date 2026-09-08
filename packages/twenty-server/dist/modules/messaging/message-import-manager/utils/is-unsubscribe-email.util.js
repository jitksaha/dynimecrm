"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isUnsubscribeEmail", {
    enumerable: true,
    get: function() {
        return isUnsubscribeEmail;
    }
});
const _guards = require("@sniptt/guards");
const _psl = /*#__PURE__*/ _interop_require_default(require("psl"));
const _ispslparseddomaintype = require("../../../contact-creation-manager/types/is-psl-parsed-domain.type");
const _unsubscribekeywordpatternconstant = require("../constants/unsubscribe-keyword-pattern.constant");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const isUnsubscribeEmail = (email)=>{
    const normalizedEmail = email.toLowerCase();
    const atIndex = normalizedEmail.lastIndexOf('@');
    const localPart = atIndex === -1 ? normalizedEmail : normalizedEmail.slice(0, atIndex);
    if (_unsubscribekeywordpatternconstant.UNSUBSCRIBE_KEYWORD_PATTERN.test(localPart)) {
        return true;
    }
    if (atIndex === -1) {
        return false;
    }
    const parsedDomain = _psl.default.parse(normalizedEmail.slice(atIndex + 1));
    if (!(0, _ispslparseddomaintype.isParsedDomain)(parsedDomain)) {
        return false;
    }
    // dedicated subdomains like unsubscribe2.customer.io count, registrable
    // domains like unsubscribe-tools.com or unsubscribe.co.uk do not
    const subdomain = parsedDomain.subdomain;
    return (0, _guards.isNonEmptyString)(subdomain) && subdomain.split('.').some((label)=>_unsubscribekeywordpatternconstant.UNSUBSCRIBE_KEYWORD_PATTERN.test(label));
};

//# sourceMappingURL=is-unsubscribe-email.util.js.map
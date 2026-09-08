"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "extractTextWithoutReplyQuotations", {
    enumerable: true,
    get: function() {
        return extractTextWithoutReplyQuotations;
    }
});
const _guards = require("@sniptt/guards");
const _emailreplyparser = /*#__PURE__*/ _interop_require_default(require("email-reply-parser"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const extractTextWithoutReplyQuotations = (text)=>{
    const textWithoutQuotations = new _emailreplyparser.default().read(text).getFragments().filter((fragment)=>!fragment.isQuoted()).map((fragment)=>fragment.getContent()).join('\n');
    return (0, _guards.isNonEmptyString)(textWithoutQuotations.trim()) ? textWithoutQuotations : text;
};

//# sourceMappingURL=extract-text-without-reply-quotations.util.js.map
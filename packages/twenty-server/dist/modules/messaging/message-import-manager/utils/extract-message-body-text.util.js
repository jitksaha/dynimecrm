"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "extractMessageBodyText", {
    enumerable: true,
    get: function() {
        return extractMessageBodyText;
    }
});
const _guards = require("@sniptt/guards");
const _createhtmltotextconverterutil = require("./create-html-to-text-converter.util");
const _extracttextwithoutreplyquotationsutil = require("./extract-text-without-reply-quotations.util");
const _normalizemessagetextutil = require("./normalize-message-text.util");
const _sanitizestringutil = require("./sanitize-string.util");
// createHtmlToTextConverter builds a JSDOM + DOMPurify instance, which is
// expensive. extractMessageBodyText runs once per message, so an import batch
// (hundreds of emails) would build hundreds of JSDOMs on the worker event loop.
// The converter is stateless across calls, so build it once and reuse it.
let htmlToTextConverter;
const getHtmlToTextConverter = ()=>{
    htmlToTextConverter ??= (0, _createhtmltotextconverterutil.createHtmlToTextConverter)();
    return htmlToTextConverter;
};
const extractMessageBodyText = ({ text, html })=>{
    const candidate = (0, _guards.isNonEmptyString)(text) ? text : (0, _guards.isNonEmptyString)(html) ? getHtmlToTextConverter()(html) : '';
    const textWithoutReplyQuotations = (0, _extracttextwithoutreplyquotationsutil.extractTextWithoutReplyQuotations)(candidate);
    const sanitizedText = (0, _sanitizestringutil.sanitizeString)(textWithoutReplyQuotations);
    return (0, _normalizemessagetextutil.normalizeMessageText)(sanitizedText);
};

//# sourceMappingURL=extract-message-body-text.util.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "compileOutboundEmailContent", {
    enumerable: true,
    get: function() {
        return compileOutboundEmailContent;
    }
});
const _twentyemails = require("twenty-emails");
const _utils = require("twenty-shared/utils");
const _sanitizeoutboundemailhtmlutil = require("./sanitize-outbound-email-html.util");
const renderContent = async (body)=>{
    const parsedBody = typeof body === 'string' ? (0, _utils.parseJson)(body) : body;
    const parseResult = (0, _utils.parseEmailDocument)(parsedBody);
    if (parseResult.success) {
        return (0, _twentyemails.render)((0, _twentyemails.reactMarkupFromJSON)(parseResult.document));
    }
    if (typeof body !== 'string' || (0, _utils.isEmailDocumentShape)(parsedBody)) {
        throw new Error(`Invalid outbound email document: ${parseResult.error}`);
    }
    return body;
};
const compileOutboundEmailContent = async (body)=>{
    const html = await (0, _sanitizeoutboundemailhtmlutil.sanitizeOutboundEmailHtml)(await renderContent(body));
    return {
        html,
        plainText: (0, _twentyemails.toPlainText)(html)
    };
};

//# sourceMappingURL=compile-outbound-email-content.util.js.map
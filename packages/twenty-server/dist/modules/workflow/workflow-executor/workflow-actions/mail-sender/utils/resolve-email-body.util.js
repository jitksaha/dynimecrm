"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveEmailBody", {
    enumerable: true,
    get: function() {
        return resolveEmailBody;
    }
});
const _utils = require("twenty-shared/utils");
const _resolveemaildocumentbindingsutil = require("../../../../../../engine/core-modules/email/utils/resolve-email-document-bindings.util");
const _resolveworkflowemailtemplatestringutil = require("./resolve-workflow-email-template-string.util");
const resolveEmailBody = async (body, context)=>{
    const unresolvedDocument = (0, _utils.parseJson)(body);
    if (!(0, _utils.isEmailDocumentShape)(unresolvedDocument)) {
        return (0, _resolveworkflowemailtemplatestringutil.resolveWorkflowEmailTemplateString)(body, context, {
            escapeValues: false
        });
    }
    const parseResult = (0, _utils.parseEmailDocument)(unresolvedDocument);
    if (!parseResult.success) {
        throw new Error(`Invalid workflow email document: ${parseResult.error}`);
    }
    return JSON.stringify((0, _resolveemaildocumentbindingsutil.resolveEmailDocumentBindings)(parseResult.document, (value, stringContext)=>(0, _resolveworkflowemailtemplatestringutil.resolveWorkflowEmailTemplateString)(value, context, {
            escapeValues: stringContext === 'html'
        })));
};

//# sourceMappingURL=resolve-email-body.util.js.map
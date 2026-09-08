"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "compileCampaignEmailContent", {
    enumerable: true,
    get: function() {
        return compileCampaignEmailContent;
    }
});
const _utils = require("twenty-shared/utils");
const _compileoutboundemailcontentutil = require("../../../engine/core-modules/email/utils/compile-outbound-email-content.util");
const _resolveemaildocumentbindingsutil = require("../../../engine/core-modules/email/utils/resolve-email-document-bindings.util");
const _emailingdomainexception = require("../../../engine/core-modules/emailing-domain/exceptions/emailing-domain.exception");
const _rendercampaigntemplateutil = require("./render-campaign-template.util");
const compileCampaignEmailContent = async (bodyTemplate, variables)=>{
    if (bodyTemplate.trim() === '') {
        return {
            html: '',
            plainText: ''
        };
    }
    const parseResult = (0, _utils.parseCanonicalEmailDocument)((0, _utils.parseJson)(bodyTemplate));
    if (!parseResult.success) {
        throw new _emailingdomainexception.EmailingDomainException(`Campaign bodyTemplate is not a renderable email document: ${parseResult.error}`, _emailingdomainexception.EmailingDomainExceptionCode.MESSAGE_CAMPAIGN_NOT_SENDABLE, {
            userFriendlyMessage: /*i18n*/ {
                id: "5MvgEo",
                message: "This campaign's email content is invalid."
            }
        });
    }
    return (0, _compileoutboundemailcontentutil.compileOutboundEmailContent)((0, _utils.isDefined)(variables) ? (0, _resolveemaildocumentbindingsutil.resolveEmailDocumentBindings)(parseResult.document, (value, context)=>(0, _rendercampaigntemplateutil.renderCampaignTemplate)(value, variables, {
            escapeValues: context === 'html'
        })) : parseResult.document);
};

//# sourceMappingURL=compile-campaign-email-content.util.js.map
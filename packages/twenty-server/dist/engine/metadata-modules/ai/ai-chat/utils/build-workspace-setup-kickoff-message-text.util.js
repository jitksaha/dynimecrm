"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildWorkspaceSetupKickoffMessageText", {
    enumerable: true,
    get: function() {
        return buildWorkspaceSetupKickoffMessageText;
    }
});
const _utils = require("twenty-shared/utils");
const _buildcompanycontextmessagetextutil = require("./build-company-context-message-text.util");
const _buildpersoncontextmessagetextutil = require("./build-person-context-message-text.util");
const _buildworkspacecontextmessagetextutil = require("./build-workspace-context-message-text.util");
const _getenglishlanguagenamefromlocaleutil = require("./get-english-language-name-from-locale.util");
const NO_COMPANY_CONTEXT_LINE = 'No information about the company that owns this workspace is available.';
const NO_PERSON_CONTEXT_LINE = 'No third-party information about the person setting up this workspace is available.';
const buildWorkspaceSetupKickoffMessageText = ({ companyEnrichment, personEnrichment, workspaceContext, locale })=>{
    const companyContextSection = (0, _utils.isDefined)(companyEnrichment) ? (0, _buildcompanycontextmessagetextutil.buildCompanyContextMessageText)(companyEnrichment) : NO_COMPANY_CONTEXT_LINE;
    const personContextSection = (0, _utils.isDefined)(personEnrichment) ? (0, _buildpersoncontextmessagetextutil.buildPersonContextMessageText)(personEnrichment) : NO_PERSON_CONTEXT_LINE;
    const workspaceContextSection = (0, _buildworkspacecontextmessagetextutil.buildWorkspaceContextMessageText)(workspaceContext);
    const userLanguageName = (0, _getenglishlanguagenamefromlocaleutil.getEnglishLanguageNameFromLocale)(locale);
    return `${companyContextSection}

${personContextSection}

${workspaceContextSection}

The user locale is ${userLanguageName}, please continue the discussion in that language.`;
};

//# sourceMappingURL=build-workspace-setup-kickoff-message-text.util.js.map
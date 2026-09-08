"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "sanitizeWorkspaceCompanyEnrichment", {
    enumerable: true,
    get: function() {
        return sanitizeWorkspaceCompanyEnrichment;
    }
});
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _workspacecompanyenrichmentfieldmaxlengthconstant = require("../constants/workspace-company-enrichment-field-max-length.constant");
const _workspacecompanyenrichmentmaxtagsconstant = require("../constants/workspace-company-enrichment-max-tags.constant");
const _workspacecompanyenrichmentsummarymaxlengthconstant = require("../constants/workspace-company-enrichment-summary-max-length.constant");
const _sanitizepromptcontextlinearrayutil = require("../../../../utils/sanitize-prompt-context-line-array.util");
const _sanitizepromptcontextlineutil = require("../../../../utils/sanitize-prompt-context-line.util");
const CONTROL_CHARACTERS_EXCEPT_LINE_BREAKS_PATTERN = /[\u0000-\u0009\u000b-\u001f\u007f\u0080-\u009f]+/g;
const sanitizeSingleLineText = (value)=>(0, _sanitizepromptcontextlineutil.sanitizePromptContextLine)({
        value,
        maxLength: _workspacecompanyenrichmentfieldmaxlengthconstant.WORKSPACE_COMPANY_ENRICHMENT_FIELD_MAX_LENGTH
    });
const sanitizeSummaryText = (value)=>{
    if (!(0, _guards.isNonEmptyString)(value)) {
        return null;
    }
    const cleanedValue = value.replace(/\r\n?/g, '\n').replace(CONTROL_CHARACTERS_EXCEPT_LINE_BREAKS_PATTERN, ' ').trim();
    return (0, _guards.isNonEmptyString)(cleanedValue) ? cleanedValue.slice(0, _workspacecompanyenrichmentsummarymaxlengthconstant.WORKSPACE_COMPANY_ENRICHMENT_SUMMARY_MAX_LENGTH) : null;
};
const sanitizeFiniteNumber = (value)=>(0, _guards.isNumber)(value) && Number.isFinite(value) ? value : null;
const sanitizeWorkspaceCompanyEnrichment = (value)=>{
    if (!(0, _utils.isPlainObject)(value)) {
        return null;
    }
    const domain = sanitizeSingleLineText(value.domain);
    const enrichedAt = sanitizeSingleLineText(value.enrichedAt);
    if (!(0, _utils.isDefined)(domain) || !(0, _utils.isDefined)(enrichedAt)) {
        return null;
    }
    return {
        domain,
        enrichedAt,
        name: sanitizeSingleLineText(value.name),
        website: sanitizeSingleLineText(value.website),
        industry: sanitizeSingleLineText(value.industry),
        employeeCount: sanitizeFiniteNumber(value.employeeCount),
        size: sanitizeSingleLineText(value.size),
        founded: sanitizeFiniteNumber(value.founded),
        headline: sanitizeSingleLineText(value.headline),
        summary: sanitizeSummaryText(value.summary),
        tags: (0, _sanitizepromptcontextlinearrayutil.sanitizePromptContextLineArray)({
            value: value.tags,
            maxLength: _workspacecompanyenrichmentfieldmaxlengthconstant.WORKSPACE_COMPANY_ENRICHMENT_FIELD_MAX_LENGTH,
            maxItems: _workspacecompanyenrichmentmaxtagsconstant.WORKSPACE_COMPANY_ENRICHMENT_MAX_TAGS
        }),
        locality: sanitizeSingleLineText(value.locality),
        region: sanitizeSingleLineText(value.region),
        country: sanitizeSingleLineText(value.country)
    };
};

//# sourceMappingURL=sanitize-workspace-company-enrichment.util.js.map
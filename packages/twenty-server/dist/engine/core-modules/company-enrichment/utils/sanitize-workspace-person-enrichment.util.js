"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "sanitizeWorkspacePersonEnrichment", {
    enumerable: true,
    get: function() {
        return sanitizeWorkspacePersonEnrichment;
    }
});
const _utils = require("twenty-shared/utils");
const _workspacepersonenrichmentfieldmaxlengthconstant = require("../constants/workspace-person-enrichment-field-max-length.constant");
const _workspacepersonenrichmentmaxjobtitlelevelsconstant = require("../constants/workspace-person-enrichment-max-job-title-levels.constant");
const _workspacepersonenrichmentmaxskillsconstant = require("../constants/workspace-person-enrichment-max-skills.constant");
const _sanitizepromptcontextlinearrayutil = require("../../../../utils/sanitize-prompt-context-line-array.util");
const _sanitizepromptcontextlineutil = require("../../../../utils/sanitize-prompt-context-line.util");
const sanitizeSingleLineText = (value)=>(0, _sanitizepromptcontextlineutil.sanitizePromptContextLine)({
        value,
        maxLength: _workspacepersonenrichmentfieldmaxlengthconstant.WORKSPACE_PERSON_ENRICHMENT_FIELD_MAX_LENGTH
    });
const sanitizeWorkspacePersonEnrichment = (value)=>{
    if (!(0, _utils.isPlainObject)(value)) {
        return null;
    }
    const email = sanitizeSingleLineText(value.email);
    const enrichedAt = sanitizeSingleLineText(value.enrichedAt);
    if (!(0, _utils.isDefined)(email) || !(0, _utils.isDefined)(enrichedAt)) {
        return null;
    }
    return {
        email,
        enrichedAt,
        fullName: sanitizeSingleLineText(value.fullName),
        jobTitle: sanitizeSingleLineText(value.jobTitle),
        jobTitleLevels: (0, _sanitizepromptcontextlinearrayutil.sanitizePromptContextLineArray)({
            value: value.jobTitleLevels,
            maxLength: _workspacepersonenrichmentfieldmaxlengthconstant.WORKSPACE_PERSON_ENRICHMENT_FIELD_MAX_LENGTH,
            maxItems: _workspacepersonenrichmentmaxjobtitlelevelsconstant.WORKSPACE_PERSON_ENRICHMENT_MAX_JOB_TITLE_LEVELS
        }),
        jobCompanyName: sanitizeSingleLineText(value.jobCompanyName),
        industry: sanitizeSingleLineText(value.industry),
        headline: sanitizeSingleLineText(value.headline),
        linkedinUrl: sanitizeSingleLineText(value.linkedinUrl),
        skills: (0, _sanitizepromptcontextlinearrayutil.sanitizePromptContextLineArray)({
            value: value.skills,
            maxLength: _workspacepersonenrichmentfieldmaxlengthconstant.WORKSPACE_PERSON_ENRICHMENT_FIELD_MAX_LENGTH,
            maxItems: _workspacepersonenrichmentmaxskillsconstant.WORKSPACE_PERSON_ENRICHMENT_MAX_SKILLS
        }),
        locality: sanitizeSingleLineText(value.locality),
        region: sanitizeSingleLineText(value.region),
        country: sanitizeSingleLineText(value.country)
    };
};

//# sourceMappingURL=sanitize-workspace-person-enrichment.util.js.map
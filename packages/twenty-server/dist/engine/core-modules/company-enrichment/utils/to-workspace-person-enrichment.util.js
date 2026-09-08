"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "toWorkspacePersonEnrichment", {
    enumerable: true,
    get: function() {
        return toWorkspacePersonEnrichment;
    }
});
const _sanitizeworkspacepersonenrichmentutil = require("./sanitize-workspace-person-enrichment.util");
const toWorkspacePersonEnrichment = ({ email, data, enrichedAt })=>(0, _sanitizeworkspacepersonenrichmentutil.sanitizeWorkspacePersonEnrichment)({
        email,
        enrichedAt: enrichedAt.toISOString(),
        fullName: data.full_name ?? null,
        jobTitle: data.job_title ?? null,
        jobTitleLevels: data.job_title_levels ?? [],
        jobCompanyName: data.job_company_name ?? null,
        industry: data.industry || data.job_company_industry || null,
        headline: data.headline ?? null,
        linkedinUrl: data.linkedin_url ?? null,
        skills: data.skills ?? [],
        locality: data.location_locality ?? null,
        region: data.location_region ?? null,
        country: data.location_country ?? null
    });

//# sourceMappingURL=to-workspace-person-enrichment.util.js.map
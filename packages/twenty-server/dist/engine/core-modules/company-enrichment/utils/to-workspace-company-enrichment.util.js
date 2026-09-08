"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "toWorkspaceCompanyEnrichment", {
    enumerable: true,
    get: function() {
        return toWorkspaceCompanyEnrichment;
    }
});
const _sanitizeworkspacecompanyenrichmentutil = require("./sanitize-workspace-company-enrichment.util");
const toWorkspaceCompanyEnrichment = ({ domain, data, enrichedAt })=>(0, _sanitizeworkspacecompanyenrichmentutil.sanitizeWorkspaceCompanyEnrichment)({
        domain,
        enrichedAt: enrichedAt.toISOString(),
        name: data.display_name || data.name || null,
        website: data.website ?? null,
        industry: data.industry ?? null,
        employeeCount: data.employee_count ?? null,
        size: data.size ?? null,
        founded: data.founded ?? null,
        headline: data.headline ?? null,
        summary: data.summary ?? null,
        tags: data.tags ?? [],
        locality: data.location?.locality ?? null,
        region: data.location?.region ?? null,
        country: data.location?.country ?? null
    });

//# sourceMappingURL=to-workspace-company-enrichment.util.js.map
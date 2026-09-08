"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceCompanyEnrichmentOutcome", {
    enumerable: true,
    get: function() {
        return WorkspaceCompanyEnrichmentOutcome;
    }
});
const _graphql = require("@nestjs/graphql");
var WorkspaceCompanyEnrichmentOutcome = /*#__PURE__*/ function(WorkspaceCompanyEnrichmentOutcome) {
    WorkspaceCompanyEnrichmentOutcome["matched"] = "matched";
    WorkspaceCompanyEnrichmentOutcome["unavailable"] = "unavailable";
    WorkspaceCompanyEnrichmentOutcome["transientError"] = "transientError";
    return WorkspaceCompanyEnrichmentOutcome;
}({});
(0, _graphql.registerEnumType)(WorkspaceCompanyEnrichmentOutcome, {
    name: 'WorkspaceCompanyEnrichmentOutcome'
});

//# sourceMappingURL=workspace-company-enrichment-outcome.enum.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspacePersonEnrichmentOutcome", {
    enumerable: true,
    get: function() {
        return WorkspacePersonEnrichmentOutcome;
    }
});
const _graphql = require("@nestjs/graphql");
var WorkspacePersonEnrichmentOutcome = /*#__PURE__*/ function(WorkspacePersonEnrichmentOutcome) {
    WorkspacePersonEnrichmentOutcome["matched"] = "matched";
    WorkspacePersonEnrichmentOutcome["unavailable"] = "unavailable";
    WorkspacePersonEnrichmentOutcome["transientError"] = "transientError";
    return WorkspacePersonEnrichmentOutcome;
}({});
(0, _graphql.registerEnumType)(WorkspacePersonEnrichmentOutcome, {
    name: 'WorkspacePersonEnrichmentOutcome'
});

//# sourceMappingURL=workspace-person-enrichment-outcome.enum.js.map
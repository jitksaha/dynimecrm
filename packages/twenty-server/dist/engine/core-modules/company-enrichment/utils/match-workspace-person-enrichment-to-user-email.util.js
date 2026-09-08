"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "matchWorkspacePersonEnrichmentToUserEmail", {
    enumerable: true,
    get: function() {
        return matchWorkspacePersonEnrichmentToUserEmail;
    }
});
const _utils = require("twenty-shared/utils");
const matchWorkspacePersonEnrichmentToUserEmail = ({ personEnrichment, userEmail })=>(0, _utils.isDefined)(personEnrichment) && personEnrichment.email.toLowerCase() === userEmail.trim().toLowerCase() ? personEnrichment : null;

//# sourceMappingURL=match-workspace-person-enrichment-to-user-email.util.js.map
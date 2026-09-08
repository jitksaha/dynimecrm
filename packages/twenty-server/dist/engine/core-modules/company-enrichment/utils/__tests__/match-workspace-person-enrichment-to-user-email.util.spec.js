"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _matchworkspacepersonenrichmenttouseremailutil = require("../match-workspace-person-enrichment-to-user-email.util");
const personEnrichment = {
    email: 'ada@acme.com',
    enrichedAt: '2026-07-21T10:00:00.000Z'
};
describe('matchWorkspacePersonEnrichmentToUserEmail', ()=>{
    it('should keep an enrichment matching the user email case-insensitively', ()=>{
        expect((0, _matchworkspacepersonenrichmenttouseremailutil.matchWorkspacePersonEnrichmentToUserEmail)({
            personEnrichment,
            userEmail: '  Ada@ACME.com '
        })).toBe(personEnrichment);
    });
    it('should drop an enrichment belonging to another email', ()=>{
        expect((0, _matchworkspacepersonenrichmenttouseremailutil.matchWorkspacePersonEnrichmentToUserEmail)({
            personEnrichment,
            userEmail: 'someone-else@acme.com'
        })).toBeNull();
    });
});

//# sourceMappingURL=match-workspace-person-enrichment-to-user-email.util.spec.js.map
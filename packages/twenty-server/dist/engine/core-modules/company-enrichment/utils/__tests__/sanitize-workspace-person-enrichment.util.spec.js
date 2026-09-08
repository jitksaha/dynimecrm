"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _workspacepersonenrichmentfieldmaxlengthconstant = require("../../constants/workspace-person-enrichment-field-max-length.constant");
const _workspacepersonenrichmentmaxjobtitlelevelsconstant = require("../../constants/workspace-person-enrichment-max-job-title-levels.constant");
const _workspacepersonenrichmentmaxskillsconstant = require("../../constants/workspace-person-enrichment-max-skills.constant");
const _sanitizeworkspacepersonenrichmentutil = require("../sanitize-workspace-person-enrichment.util");
describe('sanitizeWorkspacePersonEnrichment', ()=>{
    it('should return null for a non-object payload', ()=>{
        expect((0, _sanitizeworkspacepersonenrichmentutil.sanitizeWorkspacePersonEnrichment)(42)).toBeNull();
    });
    it('should return null when the email or enrichedAt is missing', ()=>{
        expect((0, _sanitizeworkspacepersonenrichmentutil.sanitizeWorkspacePersonEnrichment)({
            enrichedAt: '2026-07-21T10:00:00.000Z'
        })).toBeNull();
        expect((0, _sanitizeworkspacepersonenrichmentutil.sanitizeWorkspacePersonEnrichment)({
            email: 'ada@acme.com'
        })).toBeNull();
    });
    it('should keep only the known fields with valid types', ()=>{
        const result = (0, _sanitizeworkspacepersonenrichmentutil.sanitizeWorkspacePersonEnrichment)({
            email: 'ada@acme.com',
            enrichedAt: '2026-07-21T10:00:00.000Z',
            fullName: 'Ada Lovelace',
            jobTitle: 'Head of Sales',
            jobTitleLevels: [
                'director',
                42
            ],
            jobCompanyName: 'Acme Inc',
            industry: {
                nested: 'object'
            },
            headline: null,
            linkedinUrl: 'linkedin.com/in/ada',
            skills: [
                'sales',
                42,
                'negotiation'
            ],
            locality: 'Paris',
            region: 'Ile-de-France',
            country: 'France',
            injectedField: 'ignore me'
        });
        expect(result).toEqual({
            email: 'ada@acme.com',
            enrichedAt: '2026-07-21T10:00:00.000Z',
            fullName: 'Ada Lovelace',
            jobTitle: 'Head of Sales',
            jobTitleLevels: [
                'director'
            ],
            jobCompanyName: 'Acme Inc',
            industry: null,
            headline: null,
            linkedinUrl: 'linkedin.com/in/ada',
            skills: [
                'sales',
                'negotiation'
            ],
            locality: 'Paris',
            region: 'Ile-de-France',
            country: 'France'
        });
    });
    it('should cap oversized fields and arrays', ()=>{
        const result = (0, _sanitizeworkspacepersonenrichmentutil.sanitizeWorkspacePersonEnrichment)({
            email: 'ada@acme.com',
            enrichedAt: '2026-07-21T10:00:00.000Z',
            jobTitle: 'a'.repeat(_workspacepersonenrichmentfieldmaxlengthconstant.WORKSPACE_PERSON_ENRICHMENT_FIELD_MAX_LENGTH + 100),
            jobTitleLevels: Array.from({
                length: _workspacepersonenrichmentmaxjobtitlelevelsconstant.WORKSPACE_PERSON_ENRICHMENT_MAX_JOB_TITLE_LEVELS + 5
            }, (_, index)=>`level-${index}`),
            skills: Array.from({
                length: _workspacepersonenrichmentmaxskillsconstant.WORKSPACE_PERSON_ENRICHMENT_MAX_SKILLS + 5
            }, (_, index)=>`skill-${index}`)
        });
        expect(result?.jobTitle).toHaveLength(_workspacepersonenrichmentfieldmaxlengthconstant.WORKSPACE_PERSON_ENRICHMENT_FIELD_MAX_LENGTH);
        expect(result?.jobTitleLevels).toHaveLength(_workspacepersonenrichmentmaxjobtitlelevelsconstant.WORKSPACE_PERSON_ENRICHMENT_MAX_JOB_TITLE_LEVELS);
        expect(result?.skills).toHaveLength(_workspacepersonenrichmentmaxskillsconstant.WORKSPACE_PERSON_ENRICHMENT_MAX_SKILLS);
    });
});

//# sourceMappingURL=sanitize-workspace-person-enrichment.util.spec.js.map
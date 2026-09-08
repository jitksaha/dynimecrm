"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _companyenrichmentresolver = require("../company-enrichment.resolver");
const _companyenrichmentservice = require("../../services/company-enrichment.service");
const _personenrichmentservice = require("../../services/person-enrichment.service");
const _onboardingservice = require("../../../onboarding/onboarding.service");
describe('CompanyEnrichmentResolver', ()=>{
    let resolver;
    let companyEnrichmentService;
    let personEnrichmentService;
    let onboardingService;
    const user = {
        id: 'user-id',
        email: 'foo@acme.com'
    };
    const workspace = {
        id: 'workspace-id'
    };
    beforeEach(async ()=>{
        companyEnrichmentService = {
            enrichCompanyForWorkspaceCreator: jest.fn()
        };
        personEnrichmentService = {
            enrichPersonForWorkspaceCreator: jest.fn().mockResolvedValue({
                outcome: 'unavailable',
                enrichment: null
            })
        };
        onboardingService = {
            setOnboardingBookCallPendingIfQualified: jest.fn(),
            creditEnrichmentQualificationReward: jest.fn(),
            isOnboardingBookCallPending: jest.fn().mockResolvedValue(false)
        };
        const module = await _testing.Test.createTestingModule({
            providers: [
                _companyenrichmentresolver.CompanyEnrichmentResolver,
                {
                    provide: _companyenrichmentservice.CompanyEnrichmentService,
                    useValue: companyEnrichmentService
                },
                {
                    provide: _personenrichmentservice.PersonEnrichmentService,
                    useValue: personEnrichmentService
                },
                {
                    provide: _onboardingservice.OnboardingService,
                    useValue: onboardingService
                }
            ]
        }).compile();
        resolver = module.get(_companyenrichmentresolver.CompanyEnrichmentResolver);
    });
    afterEach(()=>{
        jest.clearAllMocks();
    });
    it('should hand the enriched employee count to the book-call qualification on a match', async ()=>{
        companyEnrichmentService.enrichCompanyForWorkspaceCreator.mockResolvedValue({
            outcome: 'matched',
            enrichment: {
                domain: 'acme.com',
                employeeCount: 320
            }
        });
        const result = await resolver.enrichWorkspaceCompany(user, workspace);
        expect(result.outcome).toBe('matched');
        expect(onboardingService.setOnboardingBookCallPendingIfQualified).toHaveBeenCalledWith({
            userId: user.id,
            workspaceId: workspace.id,
            employeeCount: 320
        });
    });
    it('should hand the enriched employee count to the credit reward on a match', async ()=>{
        companyEnrichmentService.enrichCompanyForWorkspaceCreator.mockResolvedValue({
            outcome: 'matched',
            enrichment: {
                domain: 'acme.com',
                employeeCount: 320
            }
        });
        await resolver.enrichWorkspaceCompany(user, workspace);
        expect(onboardingService.creditEnrichmentQualificationReward).toHaveBeenCalledTimes(1);
        expect(onboardingService.creditEnrichmentQualificationReward).toHaveBeenCalledWith({
            workspaceId: workspace.id,
            employeeCount: 320
        });
    });
    it.each([
        'unavailable',
        'transientError'
    ])('should not qualify for the book-call step on outcome %s', async (outcome)=>{
        companyEnrichmentService.enrichCompanyForWorkspaceCreator.mockResolvedValue({
            outcome,
            enrichment: null
        });
        await resolver.enrichWorkspaceCompany(user, workspace);
        expect(onboardingService.setOnboardingBookCallPendingIfQualified).not.toHaveBeenCalled();
        expect(onboardingService.creditEnrichmentQualificationReward).not.toHaveBeenCalled();
    });
    it('should report the stored pending flag rather than whether this call flagged it', async ()=>{
        companyEnrichmentService.enrichCompanyForWorkspaceCreator.mockResolvedValue({
            outcome: 'transientError',
            enrichment: null
        });
        onboardingService.isOnboardingBookCallPending.mockResolvedValue(true);
        const result = await resolver.enrichWorkspaceCompany(user, workspace);
        expect(result.isBookCallOnboardingStepPending).toBe(true);
    });
    it('should report no pending step when the user has none', async ()=>{
        companyEnrichmentService.enrichCompanyForWorkspaceCreator.mockResolvedValue({
            outcome: 'matched',
            enrichment: {
                domain: 'acme.com',
                employeeCount: 2
            }
        });
        const result = await resolver.enrichWorkspaceCompany(user, workspace);
        expect(result.isBookCallOnboardingStepPending).toBe(false);
    });
    it('should enrich the person alongside the company with the signup email', async ()=>{
        companyEnrichmentService.enrichCompanyForWorkspaceCreator.mockResolvedValue({
            outcome: 'unavailable',
            enrichment: null
        });
        personEnrichmentService.enrichPersonForWorkspaceCreator.mockResolvedValue({
            outcome: 'matched',
            enrichment: {
                email: 'foo@acme.com',
                fullName: 'Ada Lovelace'
            }
        });
        const result = await resolver.enrichWorkspaceCompany(user, workspace);
        expect(personEnrichmentService.enrichPersonForWorkspaceCreator).toHaveBeenCalledWith({
            userId: user.id,
            email: user.email,
            workspaceId: workspace.id
        });
        expect(result.personOutcome).toBe('matched');
        expect(result.personEnrichment).toEqual({
            email: 'foo@acme.com',
            fullName: 'Ada Lovelace'
        });
    });
    it('should never qualify the book-call step from the person outcome', async ()=>{
        companyEnrichmentService.enrichCompanyForWorkspaceCreator.mockResolvedValue({
            outcome: 'unavailable',
            enrichment: null
        });
        personEnrichmentService.enrichPersonForWorkspaceCreator.mockResolvedValue({
            outcome: 'matched',
            enrichment: {
                email: 'foo@acme.com'
            }
        });
        await resolver.enrichWorkspaceCompany(user, workspace);
        expect(onboardingService.setOnboardingBookCallPendingIfQualified).not.toHaveBeenCalled();
    });
});

//# sourceMappingURL=company-enrichment.resolver.spec.js.map
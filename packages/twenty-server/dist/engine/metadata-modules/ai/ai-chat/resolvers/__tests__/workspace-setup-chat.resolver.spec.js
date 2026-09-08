"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _workspacecompanyenrichmentsummarymaxlengthconstant = require("../../../../../core-modules/company-enrichment/constants/workspace-company-enrichment-summary-max-length.constant");
const _workspacepersonenrichmentmaxskillsconstant = require("../../../../../core-modules/company-enrichment/constants/workspace-person-enrichment-max-skills.constant");
const _workspacesetupchatoutcomeenum = require("../../enums/workspace-setup-chat-outcome.enum");
const _workspacesetupchatresolver = require("../workspace-setup-chat.resolver");
describe('WorkspaceSetupChatResolver startWorkspaceSetupChat', ()=>{
    const workspace = {
        id: 'workspace-id'
    };
    const user = {
        id: 'user-id',
        email: 'admin@acme.com',
        locale: 'en'
    };
    const serviceResult = {
        outcome: _workspacesetupchatoutcomeenum.WorkspaceSetupChatOutcome.STARTED,
        thread: {
            id: 'thread-id'
        }
    };
    const buildResolver = ()=>{
        const workspaceSetupChatService = {
            startWorkspaceSetupChat: jest.fn().mockResolvedValue(serviceResult)
        };
        const resolver = new _workspacesetupchatresolver.WorkspaceSetupChatResolver(workspaceSetupChatService);
        return {
            resolver,
            workspaceSetupChatService
        };
    };
    const start = (resolver, companyContext, personContext = null)=>resolver.startWorkspaceSetupChat(companyContext, personContext, user, 'user-workspace-id', workspace);
    it('should pass a null company context to the service when the client-supplied object is malformed', async ()=>{
        const { resolver, workspaceSetupChatService } = buildResolver();
        await start(resolver, {
            domain: 42,
            enrichedAt: true,
            injectedField: 'ignore me'
        });
        expect(workspaceSetupChatService.startWorkspaceSetupChat).toHaveBeenCalledWith({
            userId: 'user-id',
            userEmail: 'admin@acme.com',
            userLocale: 'en',
            userWorkspaceId: 'user-workspace-id',
            workspace,
            companyContext: null,
            personContext: null
        });
    });
    it('should pass the sanitized enrichment to the service when the company context is valid', async ()=>{
        const { resolver, workspaceSetupChatService } = buildResolver();
        await start(resolver, {
            domain: 'acme.com',
            enrichedAt: '2026-07-21T10:00:00.000Z',
            summary: 'a'.repeat(_workspacecompanyenrichmentsummarymaxlengthconstant.WORKSPACE_COMPANY_ENRICHMENT_SUMMARY_MAX_LENGTH + 100),
            employeeCount: 'not-a-number',
            injectedField: 'ignore me'
        });
        const { companyContext } = workspaceSetupChatService.startWorkspaceSetupChat.mock.calls[0][0];
        expect(companyContext.domain).toBe('acme.com');
        expect(companyContext.summary).toHaveLength(_workspacecompanyenrichmentsummarymaxlengthconstant.WORKSPACE_COMPANY_ENRICHMENT_SUMMARY_MAX_LENGTH);
        expect(companyContext.employeeCount).toBeNull();
        expect(companyContext).not.toHaveProperty('injectedField');
    });
    it('should pass the sanitized enrichment to the service when the person context is valid', async ()=>{
        const { resolver, workspaceSetupChatService } = buildResolver();
        await start(resolver, null, {
            email: 'admin@acme.com',
            enrichedAt: '2026-07-21T10:00:00.000Z',
            jobTitle: 'Line one\nLine two',
            skills: Array.from({
                length: _workspacepersonenrichmentmaxskillsconstant.WORKSPACE_PERSON_ENRICHMENT_MAX_SKILLS + 5
            }, (_, index)=>`skill-${index}`),
            injectedField: 'ignore me'
        });
        const { personContext } = workspaceSetupChatService.startWorkspaceSetupChat.mock.calls[0][0];
        expect(personContext.email).toBe('admin@acme.com');
        expect(personContext.jobTitle).toBe('Line one Line two');
        expect(personContext.skills).toHaveLength(_workspacepersonenrichmentmaxskillsconstant.WORKSPACE_PERSON_ENRICHMENT_MAX_SKILLS);
        expect(personContext).not.toHaveProperty('injectedField');
    });
    it('should drop a person context whose email does not match the authenticated user', async ()=>{
        const { resolver, workspaceSetupChatService } = buildResolver();
        await start(resolver, null, {
            email: 'someone-else@evil.com',
            enrichedAt: '2026-07-21T10:00:00.000Z',
            jobTitle: 'CEO'
        });
        const { personContext } = workspaceSetupChatService.startWorkspaceSetupChat.mock.calls[0][0];
        expect(personContext).toBeNull();
    });
    it('should return the service result untouched', async ()=>{
        const { resolver } = buildResolver();
        await expect(start(resolver, null)).resolves.toBe(serviceResult);
    });
});

//# sourceMappingURL=workspace-setup-chat.resolver.spec.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _types = require("twenty-shared/types");
const _draftemailtool = require("../draft-email-tool");
const _emailcomposerservice = require("../email-composer.service");
const _messagingmessageoutboundservice = require("../../../../../../modules/messaging/message-outbound-manager/services/messaging-message-outbound.service");
const GMAIL_COMPOSE_SCOPE = 'https://www.googleapis.com/auth/gmail.compose';
const buildComposedEmail = (connectedAccount)=>({
        recipients: {
            to: [
                'test@example.com'
            ],
            cc: [],
            bcc: []
        },
        toRecipientsDisplay: 'test@example.com',
        sanitizedSubject: 'Subject',
        plainTextBody: 'body',
        sanitizedHtmlBody: '<p>body</p>',
        attachments: [],
        connectedAccount,
        shouldPersistMessage: true
    });
const baseInput = {
    recipients: {
        to: 'test@example.com',
        cc: '',
        bcc: ''
    },
    subject: 'Subject',
    body: '<p>body</p>',
    files: []
};
describe('DraftEmailTool', ()=>{
    let tool;
    let mockComposeEmail;
    let mockCreateDraft;
    beforeEach(async ()=>{
        jest.clearAllMocks();
        mockComposeEmail = jest.fn();
        mockCreateDraft = jest.fn();
        const module = await _testing.Test.createTestingModule({
            providers: [
                _draftemailtool.DraftEmailTool,
                {
                    provide: _emailcomposerservice.EmailComposerService,
                    useValue: {
                        composeEmail: mockComposeEmail
                    }
                },
                {
                    provide: _messagingmessageoutboundservice.MessagingMessageOutboundService,
                    useValue: {
                        createDraft: mockCreateDraft
                    }
                }
            ]
        }).compile();
        tool = module.get(_draftemailtool.DraftEmailTool);
    });
    it('fails without drafting when the resolved account lacks the compose scope', async ()=>{
        mockComposeEmail.mockResolvedValue({
            success: true,
            data: buildComposedEmail({
                id: 'account-1',
                provider: _types.ConnectedAccountProvider.GOOGLE,
                scopes: []
            })
        });
        const result = await tool.execute(baseInput, {
            workspaceId: 'workspace-1'
        });
        expect(result.success).toBe(false);
        expect(result.message).toContain('insufficient permissions');
        expect(mockCreateDraft).not.toHaveBeenCalled();
    });
    it('creates the draft when the resolved account has the compose scope', async ()=>{
        const composedEmail = {
            ...buildComposedEmail({
                id: 'account-1',
                provider: _types.ConnectedAccountProvider.GOOGLE,
                scopes: [
                    GMAIL_COMPOSE_SCOPE
                ]
            }),
            inReplyTo: '<parent@example.com>',
            threadExternalId: 'thread-external-id',
            references: [
                '<ancestor@example.com>',
                '<parent@example.com>'
            ]
        };
        mockComposeEmail.mockResolvedValue({
            success: true,
            data: composedEmail
        });
        const result = await tool.execute(baseInput, {
            workspaceId: 'workspace-1'
        });
        expect(result.success).toBe(true);
        expect(mockCreateDraft).toHaveBeenCalledTimes(1);
        expect(mockCreateDraft).toHaveBeenCalledWith(expect.objectContaining({
            inReplyTo: composedEmail.inReplyTo,
            threadExternalId: composedEmail.threadExternalId,
            references: composedEmail.references
        }), composedEmail.connectedAccount);
    });
});

//# sourceMappingURL=draft-email-tool.spec.js.map
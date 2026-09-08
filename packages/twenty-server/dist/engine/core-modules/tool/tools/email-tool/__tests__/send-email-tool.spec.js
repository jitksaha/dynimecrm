"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _emailcomposerservice = require("../email-composer.service");
const _sendemailtool = require("../send-email-tool");
const _sendemailservice = require("../../../../../../modules/messaging/message-outbound-manager/services/send-email.service");
const buildComposedEmail = (shouldPersistMessage)=>({
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
        connectedAccount: {
            id: 'account-1'
        },
        messageChannelId: 'channel-1',
        shouldPersistMessage
    });
const sendResult = {
    headerMessageId: '<sent-message@mail.example.com>',
    messageExternalId: 'provider-message-id',
    threadExternalId: 'provider-thread-id'
};
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
describe('SendEmailTool', ()=>{
    let tool;
    let mockComposeEmail;
    let mockSendComposedEmail;
    let mockPersistSentMessage;
    beforeEach(async ()=>{
        jest.clearAllMocks();
        mockComposeEmail = jest.fn();
        mockSendComposedEmail = jest.fn().mockResolvedValue(sendResult);
        mockPersistSentMessage = jest.fn().mockResolvedValue({
            messageId: 'message-record-id',
            messageThreadId: 'message-thread-record-id'
        });
        const module = await _testing.Test.createTestingModule({
            providers: [
                _sendemailtool.SendEmailTool,
                {
                    provide: _emailcomposerservice.EmailComposerService,
                    useValue: {
                        composeEmail: mockComposeEmail
                    }
                },
                {
                    provide: _sendemailservice.SendEmailService,
                    useValue: {
                        sendComposedEmail: mockSendComposedEmail,
                        persistSentMessage: mockPersistSentMessage
                    }
                }
            ]
        }).compile();
        tool = module.get(_sendemailtool.SendEmailTool);
    });
    it('returns the sent message identifiers when the message is persisted', async ()=>{
        mockComposeEmail.mockResolvedValue({
            success: true,
            data: buildComposedEmail(true)
        });
        const result = await tool.execute(baseInput, {
            workspaceId: 'workspace-1'
        });
        expect(result.success).toBe(true);
        expect(result.result).toMatchObject({
            headerMessageId: '<sent-message@mail.example.com>',
            threadExternalId: 'provider-thread-id',
            messageId: 'message-record-id',
            messageThreadId: 'message-thread-record-id'
        });
    });
    it('returns the send identifiers without record ids when persistence is disabled', async ()=>{
        mockComposeEmail.mockResolvedValue({
            success: true,
            data: buildComposedEmail(false)
        });
        const result = await tool.execute(baseInput, {
            workspaceId: 'workspace-1'
        });
        expect(mockPersistSentMessage).not.toHaveBeenCalled();
        expect(result.success).toBe(true);
        expect(result.result).toMatchObject({
            headerMessageId: '<sent-message@mail.example.com>',
            threadExternalId: 'provider-thread-id',
            messageId: undefined,
            messageThreadId: undefined
        });
    });
    it('still succeeds without record ids when persistence fails', async ()=>{
        mockComposeEmail.mockResolvedValue({
            success: true,
            data: buildComposedEmail(true)
        });
        mockPersistSentMessage.mockResolvedValue(undefined);
        const result = await tool.execute(baseInput, {
            workspaceId: 'workspace-1'
        });
        expect(result.success).toBe(true);
        expect(result.result).toMatchObject({
            headerMessageId: '<sent-message@mail.example.com>',
            messageId: undefined,
            messageThreadId: undefined
        });
    });
});

//# sourceMappingURL=send-email-tool.spec.js.map
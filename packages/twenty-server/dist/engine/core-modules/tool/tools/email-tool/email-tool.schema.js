"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmailToolInputZodSchema", {
    enumerable: true,
    get: function() {
        return EmailToolInputZodSchema;
    }
});
const _utils = require("twenty-shared/utils");
const _workflow = require("twenty-shared/workflow");
const _zod = require("zod");
const EmailRecipientsZodSchema = _zod.z.object({
    to: _zod.z.string().describe('Comma-separated recipient email addresses (To)').default(''),
    cc: _zod.z.string().describe('Comma-separated CC email addresses').optional().default(''),
    bcc: _zod.z.string().describe('Comma-separated BCC email addresses').optional().default('')
});
const EmailToolInputZodSchema = _zod.z.object({
    recipients: EmailRecipientsZodSchema.describe('Recipients object with to, cc, and bcc fields (comma-separated)'),
    subject: _zod.z.string().describe('The email subject line'),
    body: _zod.z.union([
        _utils.emailDocumentSchema,
        _zod.z.string()
    ]).describe('The email body. Preferred: a structured email document ({type: "doc", content: [...]} with paragraph, heading, bulletList/orderedList, image, button, section, divider and html blocks), rendered to email-safe HTML server-side. An HTML string is also accepted. Campaign-style {{variables}} are not substituted in 1:1 emails.'),
    connectedAccountId: _zod.z.string().refine((val)=>(0, _utils.isValidUuid)(val)).describe('The UUID of the connected account to send the email from. Provide this only if you have it; otherwise, leave blank.').optional(),
    fromHandle: _zod.z.string().describe('The address to send from. Must be the connected account handle or one of its verified aliases. Leave blank to send from the connected account handle.').optional(),
    files: _zod.z.array(_workflow.workflowFileSchema).describe('Array of file objects to attach to the email').optional().default([]),
    inReplyTo: _zod.z.string().describe('The RFC 2822 Message-ID of an existing email to reply to. When provided, the email is sent as a reply in the same thread.').optional()
});

//# sourceMappingURL=email-tool.schema.js.map
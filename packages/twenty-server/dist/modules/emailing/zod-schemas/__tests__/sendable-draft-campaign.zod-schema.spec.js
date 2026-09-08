"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _sendabledraftcampaignzodschema = require("../sendable-draft-campaign.zod-schema");
describe('sendableDraftCampaignSchema', ()=>{
    const sendableDraftCampaign = {
        status: _types.MessageCampaignStatus.DRAFT,
        subject: 'Monthly newsletter',
        bodyTemplate: JSON.stringify({
            type: 'doc',
            attrs: {
                schemaVersion: _utils.EMAIL_DOCUMENT_SCHEMA_VERSION
            },
            content: [
                {
                    type: 'paragraph',
                    content: [
                        {
                            type: 'text',
                            text: 'Hello'
                        }
                    ]
                }
            ]
        }),
        fromAddress: {
            primaryEmail: 'news@company.com'
        },
        listId: '20202020-0000-4000-8000-000000000001'
    };
    it('should accept a draft campaign with a subject, body, from address and list', ()=>{
        expect(_sendabledraftcampaignzodschema.sendableDraftCampaignSchema.safeParse(sendableDraftCampaign).success).toBe(true);
    });
    it('should reject a campaign that already left DRAFT', ()=>{
        expect(_sendabledraftcampaignzodschema.sendableDraftCampaignSchema.safeParse({
            ...sendableDraftCampaign,
            status: _types.MessageCampaignStatus.SENT
        }).success).toBe(false);
    });
    it('should reject a draft without a subject', ()=>{
        expect(_sendabledraftcampaignzodschema.sendableDraftCampaignSchema.safeParse({
            ...sendableDraftCampaign,
            subject: ''
        }).success).toBe(false);
    });
    it('should reject a draft without a body', ()=>{
        expect(_sendabledraftcampaignzodschema.sendableDraftCampaignSchema.safeParse({
            ...sendableDraftCampaign,
            bodyTemplate: ''
        }).success).toBe(false);
    });
    it('should reject a draft with a malformed from address', ()=>{
        expect(_sendabledraftcampaignzodschema.sendableDraftCampaignSchema.safeParse({
            ...sendableDraftCampaign,
            fromAddress: {
                primaryEmail: 'not-an-email'
            }
        }).success).toBe(false);
    });
    it('should reject a draft without a from address', ()=>{
        expect(_sendabledraftcampaignzodschema.sendableDraftCampaignSchema.safeParse({
            ...sendableDraftCampaign,
            fromAddress: null
        }).success).toBe(false);
    });
    it('should reject a draft without a recipient list', ()=>{
        expect(_sendabledraftcampaignzodschema.sendableDraftCampaignSchema.safeParse({
            ...sendableDraftCampaign,
            listId: null
        }).success).toBe(false);
    });
    it('should accept a body holding a canonical TipTap document', ()=>{
        expect(_sendabledraftcampaignzodschema.sendableDraftCampaignSchema.safeParse({
            ...sendableDraftCampaign,
            bodyTemplate: JSON.stringify({
                type: 'doc',
                attrs: {
                    schemaVersion: _utils.EMAIL_DOCUMENT_SCHEMA_VERSION
                },
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'Hello'
                            }
                        ]
                    }
                ]
            })
        }).success).toBe(true);
    });
    it('should reject a versionless TipTap document', ()=>{
        expect(_sendabledraftcampaignzodschema.sendableDraftCampaignSchema.safeParse({
            ...sendableDraftCampaign,
            bodyTemplate: JSON.stringify({
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'Legacy body'
                            }
                        ]
                    }
                ]
            })
        }).success).toBe(false);
    });
    it('should reject a body that is not an email document', ()=>{
        expect(_sendabledraftcampaignzodschema.sendableDraftCampaignSchema.safeParse({
            ...sendableDraftCampaign,
            bodyTemplate: '<p>Hello {{firstName}}</p>'
        }).success).toBe(false);
    });
    it('should reject a body holding JSON that is not a document', ()=>{
        expect(_sendabledraftcampaignzodschema.sendableDraftCampaignSchema.safeParse({
            ...sendableDraftCampaign,
            bodyTemplate: JSON.stringify({
                type: 'paragraph'
            })
        }).success).toBe(false);
    });
    it('should reject a document with a malformed nested node', ()=>{
        expect(_sendabledraftcampaignzodschema.sendableDraftCampaignSchema.safeParse({
            ...sendableDraftCampaign,
            bodyTemplate: JSON.stringify({
                type: 'doc',
                attrs: {
                    schemaVersion: _utils.EMAIL_DOCUMENT_SCHEMA_VERSION
                },
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                text: 'no type'
                            }
                        ]
                    }
                ]
            })
        }).success).toBe(false);
    });
    it('should accept a document using email blocks', ()=>{
        expect(_sendabledraftcampaignzodschema.sendableDraftCampaignSchema.safeParse({
            ...sendableDraftCampaign,
            bodyTemplate: JSON.stringify({
                type: 'doc',
                attrs: {
                    schemaVersion: _utils.EMAIL_DOCUMENT_SCHEMA_VERSION
                },
                content: [
                    {
                        type: 'section',
                        attrs: {
                            style: {
                                padding: '12px'
                            }
                        },
                        content: [
                            {
                                type: 'paragraph',
                                content: [
                                    {
                                        type: 'text',
                                        text: 'Hello'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type: 'button',
                        attrs: {
                            href: 'https://example.com',
                            style: {}
                        },
                        content: [
                            {
                                type: 'text',
                                text: 'Open'
                            }
                        ]
                    }
                ]
            })
        }).success).toBe(true);
    });
    it('should reject a document holding an unknown block type', ()=>{
        expect(_sendabledraftcampaignzodschema.sendableDraftCampaignSchema.safeParse({
            ...sendableDraftCampaign,
            bodyTemplate: JSON.stringify({
                type: 'doc',
                attrs: {
                    schemaVersion: _utils.EMAIL_DOCUMENT_SCHEMA_VERSION
                },
                content: [
                    {
                        type: 'countdownTimer',
                        attrs: {}
                    }
                ]
            })
        }).success).toBe(false);
    });
    it('should reject a document from a future schema version', ()=>{
        expect(_sendabledraftcampaignzodschema.sendableDraftCampaignSchema.safeParse({
            ...sendableDraftCampaign,
            bodyTemplate: JSON.stringify({
                type: 'doc',
                attrs: {
                    schemaVersion: 999
                },
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'Hi'
                            }
                        ]
                    }
                ]
            })
        }).success).toBe(false);
    });
});

//# sourceMappingURL=sendable-draft-campaign.zod-schema.spec.js.map
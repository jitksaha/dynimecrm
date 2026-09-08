"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _collectcampaignvariablenamesutil = require("../collect-campaign-variable-names.util");
describe('collectCampaignVariableNames', ()=>{
    it('should collect variables from every substitution site', ()=>{
        const document = {
            type: 'doc',
            content: [
                {
                    type: 'paragraph',
                    content: [
                        {
                            type: 'text',
                            text: 'Hello {{firstName}}'
                        },
                        {
                            type: 'variableTag',
                            attrs: {
                                variable: '{{lastName}}'
                            }
                        },
                        {
                            type: 'text',
                            text: 'link',
                            marks: [
                                {
                                    type: 'link',
                                    attrs: {
                                        href: 'https://example.com/{{personId}}'
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'button',
                    attrs: {
                        href: 'https://example.com/?email={{email}}',
                        style: {}
                    },
                    content: [
                        {
                            type: 'text',
                            text: 'Open'
                        }
                    ]
                },
                {
                    type: 'image',
                    attrs: {
                        src: 'https://example.com/{{imagePath}}',
                        alt: '{{imageAlt}}',
                        title: '{{imageTitle}}'
                    }
                },
                {
                    type: 'section',
                    attrs: {
                        style: {}
                    },
                    content: [
                        {
                            type: 'html',
                            attrs: {
                                html: '<p>{{fullName}}</p>'
                            }
                        }
                    ]
                }
            ]
        };
        expect([
            ...(0, _collectcampaignvariablenamesutil.collectCampaignVariableNames)(document)
        ].sort()).toEqual([
            'email',
            'firstName',
            'fullName',
            'imageAlt',
            'imagePath',
            'imageTitle',
            'lastName',
            'personId'
        ]);
    });
    it('should collect nothing from a document without variables', ()=>{
        expect((0, _collectcampaignvariablenamesutil.collectCampaignVariableNames)({
            type: 'doc',
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
        }).size).toBe(0);
    });
    it('should deduplicate repeated variables', ()=>{
        expect([
            ...(0, _collectcampaignvariablenamesutil.collectCampaignVariableNames)({
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: '{{firstName}} and {{ firstName }}'
                            }
                        ]
                    }
                ]
            })
        ]).toEqual([
            'firstName'
        ]);
    });
});

//# sourceMappingURL=collect-campaign-variable-names.util.spec.js.map
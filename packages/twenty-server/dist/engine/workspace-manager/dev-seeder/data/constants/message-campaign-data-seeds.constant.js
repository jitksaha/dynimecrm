"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get MESSAGE_CAMPAIGN_DATA_SEEDS () {
        return MESSAGE_CAMPAIGN_DATA_SEEDS;
    },
    get MESSAGE_CAMPAIGN_DATA_SEED_COLUMNS () {
        return MESSAGE_CAMPAIGN_DATA_SEED_COLUMNS;
    },
    get MESSAGE_CAMPAIGN_DATA_SEED_IDS () {
        return MESSAGE_CAMPAIGN_DATA_SEED_IDS;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const MESSAGE_CAMPAIGN_DATA_SEED_COLUMNS = [
    'id',
    'position',
    'name',
    'subject',
    'bodyTemplate',
    'fromAddressPrimaryEmail',
    'status',
    'sentAt',
    'sentCount',
    'failedCount',
    'bouncedCount',
    'complainedCount'
];
const MESSAGE_CAMPAIGN_DATA_SEED_IDS = {
    PRODUCT_LAUNCH: '20202020-342c-4f7a-8c7e-37e2bc291101',
    FOUNDER_DIGEST: '20202020-342c-4f7a-8c7e-37e2bc291102'
};
const CAMPAIGN_FROM_ADDRESS = 'hello@apple.dev';
const createEmailBodyTemplate = ({ headline, introduction, highlights, callToAction })=>JSON.stringify({
        type: 'doc',
        attrs: {
            schemaVersion: _utils.EMAIL_DOCUMENT_SCHEMA_VERSION,
            canvasTheme: {
                pageBackground: '#F5F5F7',
                bodyBackground: '#FFFFFF',
                textColor: '#1D1D1F',
                width: '640px',
                padding: '48px',
                cornerRadius: '20px'
            }
        },
        content: [
            {
                type: 'heading',
                attrs: {
                    level: 1
                },
                content: [
                    {
                        type: 'text',
                        text: headline
                    }
                ]
            },
            {
                type: 'paragraph',
                content: [
                    {
                        type: 'text',
                        text: introduction
                    }
                ]
            },
            {
                type: 'bulletList',
                content: highlights.map((highlight)=>({
                        type: 'listItem',
                        content: [
                            {
                                type: 'paragraph',
                                content: [
                                    {
                                        type: 'text',
                                        text: highlight
                                    }
                                ]
                            }
                        ]
                    }))
            },
            {
                type: 'button',
                attrs: {
                    href: callToAction.href,
                    style: {
                        backgroundColor: '#0071E3',
                        color: '#FFFFFF'
                    }
                },
                content: [
                    {
                        type: 'text',
                        text: callToAction.label
                    }
                ]
            },
            {
                type: 'paragraph',
                content: [
                    {
                        type: 'text',
                        text: 'The Apple Developer Relations team'
                    }
                ]
            }
        ]
    });
const MESSAGE_CAMPAIGN_DATA_SEEDS = [
    {
        id: MESSAGE_CAMPAIGN_DATA_SEED_IDS.PRODUCT_LAUNCH,
        position: 0,
        name: 'Vision Pro developer launch',
        subject: 'Build what comes next with Apple Vision Pro',
        bodyTemplate: createEmailBodyTemplate({
            headline: 'A new canvas for your ideas.',
            introduction: 'Apple Vision Pro brings your apps into an infinite spatial canvas. Explore the tools designed to help you create remarkable experiences from day one.',
            highlights: [
                'Design immersive interfaces with visionOS and SwiftUI.',
                'Preview spatial experiences using the latest Xcode tools.',
                'Learn directly from Apple engineers in upcoming labs.'
            ],
            callToAction: {
                label: 'Start building',
                href: 'https://developer.apple.com/visionos/'
            }
        }),
        fromAddressPrimaryEmail: CAMPAIGN_FROM_ADDRESS,
        status: _types.MessageCampaignStatus.DRAFT,
        sentAt: null,
        sentCount: 0,
        failedCount: 0,
        bouncedCount: 0,
        complainedCount: 0
    },
    {
        id: MESSAGE_CAMPAIGN_DATA_SEED_IDS.FOUNDER_DIGEST,
        position: 1,
        name: 'June founder digest',
        subject: "The tools behind this month's standout apps",
        bodyTemplate: createEmailBodyTemplate({
            headline: 'Big ideas, beautifully built.',
            introduction: 'This month, founders across the community shipped faster, reached new customers, and turned ambitious ideas into delightful products.',
            highlights: [
                'Meet three teams rethinking health, focus, and collaboration.',
                'See how App Intents can make everyday actions effortless.',
                'Save your seat for our live founder Q&A.'
            ],
            callToAction: {
                label: 'Read the stories',
                href: 'https://developer.apple.com/news/'
            }
        }),
        fromAddressPrimaryEmail: CAMPAIGN_FROM_ADDRESS,
        status: _types.MessageCampaignStatus.SENT,
        sentAt: '2026-06-18T15:00:00.000Z',
        sentCount: 2486,
        failedCount: 9,
        bouncedCount: 21,
        complainedCount: 2
    }
];

//# sourceMappingURL=message-campaign-data-seeds.constant.js.map
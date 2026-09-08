"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _metadata = require("twenty-shared/metadata");
const _computestandardmessagecampaignviewfieldsutil = require("../compute-standard-message-campaign-view-fields.util");
const MESSAGE_CAMPAIGN = _metadata.STANDARD_OBJECTS.messageCampaign;
const buildArgs = ()=>{
    const views = Object.fromEntries(Object.entries(MESSAGE_CAMPAIGN.views).map(([viewName, view])=>[
            viewName,
            {
                id: `${viewName}-id`,
                viewFieldGroups: Object.fromEntries(Object.keys(view.viewFieldGroups ?? {}).map((groupName)=>[
                        groupName,
                        {
                            id: `${viewName}-${groupName}-id`
                        }
                    ]))
            }
        ]));
    const fields = Object.fromEntries(Object.keys(MESSAGE_CAMPAIGN.fields).map((fieldName)=>[
            fieldName,
            {
                id: `${fieldName}-id`
            }
        ]));
    const byUniversalIdentifier = Object.fromEntries(Object.values(MESSAGE_CAMPAIGN.views).map((view)=>[
            view.universalIdentifier,
            {
                isSystemSideEffect: false
            }
        ]));
    return {
        workspaceId: 'workspace-id',
        twentyStandardApplicationId: 'application-id',
        now: new Date('2026-01-01T00:00:00.000Z'),
        standardObjectMetadataRelatedEntityIds: {
            messageCampaign: {
                views,
                fields
            }
        },
        dependencyFlatEntityMaps: {
            flatViewMaps: {
                byUniversalIdentifier
            }
        }
    };
};
const collectViewFieldNames = (viewName)=>{
    const view = MESSAGE_CAMPAIGN.views[viewName];
    const nameByUniversalIdentifier = new Map(Object.entries(view.viewFields).map(([fieldName, viewField])=>[
            viewField.universalIdentifier,
            fieldName
        ]));
    return Object.values((0, _computestandardmessagecampaignviewfieldsutil.computeStandardMessageCampaignViewFields)(buildArgs())).filter((viewField)=>viewField.viewUniversalIdentifier === view.universalIdentifier).sort((a, b)=>a.position - b.position).map((viewField)=>nameByUniversalIdentifier.get(viewField.universalIdentifier) ?? viewField.universalIdentifier);
};
describe('computeStandardMessageCampaignViewFields', ()=>{
    it('builds every field the index view declares, in the declared order', ()=>{
        expect(collectViewFieldNames('allMessageCampaigns')).toEqual(Object.keys(MESSAGE_CAMPAIGN.views.allMessageCampaigns.viewFields));
    });
    it('builds every field the record page declares, in the declared order', ()=>{
        expect(collectViewFieldNames('messageCampaignRecordPageFields')).toEqual(Object.keys(MESSAGE_CAMPAIGN.views.messageCampaignRecordPageFields.viewFields));
    });
});

//# sourceMappingURL=compute-standard-message-campaign-view-fields.util.spec.js.map
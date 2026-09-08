"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _uuid = require("uuid");
const _collectmessagecampaignstandarduniversalidentifiersutil = require("../collect-message-campaign-standard-universal-identifiers.util");
const _standardcommandmenuitemconstant = require("../../../../../../engine/workspace-manager/twenty-standard-application/constants/standard-command-menu-item.constant");
const _twentystandardapplicationallflatentitymapsconstant = require("../../../../../../engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant");
describe('collectMessageCampaignStandardUniversalIdentifiers', ()=>{
    const { allFlatEntityMaps: standardAllFlatEntityMaps } = (0, _twentystandardapplicationallflatentitymapsconstant.computeTwentyStandardApplicationAllFlatEntityMaps)({
        now: new Date().toISOString(),
        workspaceId: (0, _uuid.v4)(),
        twentyStandardApplicationId: (0, _uuid.v4)()
    });
    const universalIdentifiers = (0, _collectmessagecampaignstandarduniversalidentifiersutil.collectMessageCampaignStandardUniversalIdentifiers)({
        standardAllFlatEntityMaps
    });
    it('should collect the three campaign standard objects', ()=>{
        expect(universalIdentifiers.objectMetadata).toEqual([
            _metadata.STANDARD_OBJECTS.messageCampaign.universalIdentifier,
            _metadata.STANDARD_OBJECTS.messageList.universalIdentifier,
            _metadata.STANDARD_OBJECTS.messageListMember.universalIdentifier
        ]);
    });
    it('should collect the campaign fields and the inverse relation fields living on other objects', ()=>{
        expect(universalIdentifiers.fieldMetadata).toContain(_metadata.STANDARD_OBJECTS.messageCampaign.fields.name.universalIdentifier);
        expect(universalIdentifiers.fieldMetadata).toContain(_metadata.STANDARD_OBJECTS.person.fields.listMemberships.universalIdentifier);
    });
    it('should collect the campaign index view and its view fields', ()=>{
        const allMessageCampaignsViewUniversalIdentifier = _metadata.STANDARD_OBJECTS.messageCampaign.views.allMessageCampaigns.universalIdentifier;
        expect(universalIdentifiers.view).toContain(allMessageCampaignsViewUniversalIdentifier);
        expect(universalIdentifiers.viewField).toContain(_metadata.STANDARD_OBJECTS.messageCampaign.views.allMessageCampaigns.viewFields.status.universalIdentifier);
    });
    it('should collect the campaign search field metadata and every campaign index', ()=>{
        expect(universalIdentifiers.index).toContain(_metadata.STANDARD_OBJECTS.messageCampaign.indexes.listIdIndex.universalIdentifier);
        expect(universalIdentifiers.index).toContain(_metadata.STANDARD_OBJECTS.messageListMember.indexes.personListUniqueIndex.universalIdentifier);
        expect(universalIdentifiers.searchFieldMetadata.length).toBeGreaterThan(0);
    });
    it('should collect the campaign command menu items including the global compose campaign entry', ()=>{
        expect(universalIdentifiers.commandMenuItem).toContain(_standardcommandmenuitemconstant.STANDARD_COMMAND_MENU_ITEMS.composeCampaign.universalIdentifier);
        expect(universalIdentifiers.commandMenuItem).toContain(_standardcommandmenuitemconstant.STANDARD_COMMAND_MENU_ITEMS.sendMessageCampaign.universalIdentifier);
    });
    it('should not collect metadata belonging to unrelated standard objects', ()=>{
        const companyFieldUniversalIdentifiers = Object.values(standardAllFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatFieldMetadata)=>flatFieldMetadata.objectMetadataUniversalIdentifier === _metadata.STANDARD_OBJECTS.company.universalIdentifier && !(0, _utils.isDefined)(flatFieldMetadata.relationTargetObjectMetadataUniversalIdentifier)).map((flatFieldMetadata)=>flatFieldMetadata.universalIdentifier);
        expect(companyFieldUniversalIdentifiers.length).toBeGreaterThan(0);
        expect(universalIdentifiers.fieldMetadata).toEqual(expect.not.arrayContaining(companyFieldUniversalIdentifiers));
    });
});

//# sourceMappingURL=collect-message-campaign-standard-universal-identifiers.util.spec.js.map
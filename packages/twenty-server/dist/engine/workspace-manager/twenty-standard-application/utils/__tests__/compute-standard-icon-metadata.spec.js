"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _metadata = require("twenty-shared/metadata");
const _standardcommandmenuitemconstant = require("../../constants/standard-command-menu-item.constant");
const _twentystandardapplicationallflatentitymapsconstant = require("../twenty-standard-application-all-flat-entity-maps.constant");
const WORKSPACE_ID = '20202020-1111-4111-8111-111111111111';
const TWENTY_STANDARD_APPLICATION_ID = '20202020-2222-4222-8222-222222222222';
const NOW = '2024-01-01T00:00:00.000Z';
describe('standard icon metadata', ()=>{
    const { allFlatEntityMaps } = (0, _twentystandardapplicationallflatentitymapsconstant.computeTwentyStandardApplicationAllFlatEntityMaps)({
        now: NOW,
        workspaceId: WORKSPACE_ID,
        twentyStandardApplicationId: TWENTY_STANDARD_APPLICATION_ID
    });
    it.each([
        _metadata.STANDARD_OBJECTS.timelineActivity.fields.workspaceMember.universalIdentifier,
        _metadata.STANDARD_OBJECTS.messageParticipant.fields.workspaceMember.universalIdentifier,
        _metadata.STANDARD_OBJECTS.blocklist.fields.workspaceMember.universalIdentifier,
        _metadata.STANDARD_OBJECTS.workspaceMember.fields.name.universalIdentifier,
        _metadata.STANDARD_OBJECTS.workspaceMember.fields.userId.universalIdentifier
    ])('uses the canonical member icon for field %s', (fieldUniversalIdentifier)=>{
        expect(allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[fieldUniversalIdentifier]?.icon).toBe('IconUsers');
    });
    it('keeps the time-zone field icon available for dynamic resolution', ()=>{
        expect(allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[_metadata.STANDARD_OBJECTS.workspaceMember.fields.timeZone.universalIdentifier]?.icon).toBe('IconTimezone');
    });
    it('uses the copy-plus icon for the duplicate-dashboard command', ()=>{
        expect(_standardcommandmenuitemconstant.STANDARD_COMMAND_MENU_ITEMS.duplicateDashboard.icon).toBe('IconCopyPlus');
    });
});

//# sourceMappingURL=compute-standard-icon-metadata.spec.js.map
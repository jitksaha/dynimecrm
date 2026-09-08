"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _metadata = require("twenty-shared/metadata");
const _buildobjectnavigationuniversalflatcommandmenuitemutil = require("../build-object-navigation-universal-flat-command-menu-item.util");
describe('buildNavigationConditionalAvailabilityExpression', ()=>{
    it('gates a feature-flagged standard object behind both the flag and read permission', ()=>{
        expect((0, _buildobjectnavigationuniversalflatcommandmenuitemutil.buildNavigationConditionalAvailabilityExpression)({
            universalIdentifier: _metadata.STANDARD_OBJECTS.messageCampaign.universalIdentifier,
            nameSingular: 'messageCampaign'
        })).toBe('featureFlags.IS_EMAIL_GROUP_ENABLED and targetObjectReadPermissions.messageCampaign');
    });
    it('returns only the read-permission expression for non-gated objects', ()=>{
        expect((0, _buildobjectnavigationuniversalflatcommandmenuitemutil.buildNavigationConditionalAvailabilityExpression)({
            universalIdentifier: 'obj-universal-1',
            nameSingular: 'person'
        })).toBe('targetObjectReadPermissions.person');
    });
    it('does not gate a custom object that reuses a feature-flagged object name', ()=>{
        expect((0, _buildobjectnavigationuniversalflatcommandmenuitemutil.buildNavigationConditionalAvailabilityExpression)({
            universalIdentifier: 'custom-object-universal-id',
            nameSingular: 'messageCampaign'
        })).toBe('targetObjectReadPermissions.messageCampaign');
    });
});

//# sourceMappingURL=build-object-navigation-universal-flat-command-menu-item.util.spec.js.map
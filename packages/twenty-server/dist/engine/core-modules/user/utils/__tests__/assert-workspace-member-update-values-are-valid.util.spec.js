"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _graphqlerrorsutil = require("../../../graphql/utils/graphql-errors.util");
const _assertworkspacememberupdatevaluesarevalidutil = require("../assert-workspace-member-update-values-are-valid.util");
describe('assertWorkspaceMemberUpdateValuesAreValid', ()=>{
    it.each([
        'Smaller',
        'Default',
        'Large',
        'Larger'
    ])('should accept uiScale %s', (uiScale)=>{
        expect(()=>(0, _assertworkspacememberupdatevaluesarevalidutil.assertWorkspaceMemberUpdateValuesAreValid)({
                update: {
                    uiScale
                }
            })).not.toThrow();
    });
    it('should ignore updates that do not touch a value-checked field', ()=>{
        expect(()=>(0, _assertworkspacememberupdatevaluesarevalidutil.assertWorkspaceMemberUpdateValuesAreValid)({
                update: {
                    timeZone: 'Europe/Paris'
                }
            })).not.toThrow();
    });
    it.each([
        'smaller',
        'XL',
        '',
        'constructor',
        1.25,
        null,
        [
            'Large'
        ]
    ])('should reject uiScale %p', (uiScale)=>{
        expect(()=>(0, _assertworkspacememberupdatevaluesarevalidutil.assertWorkspaceMemberUpdateValuesAreValid)({
                update: {
                    uiScale
                }
            })).toThrow(_graphqlerrorsutil.UserInputError);
    });
});

//# sourceMappingURL=assert-workspace-member-update-values-are-valid.util.spec.js.map
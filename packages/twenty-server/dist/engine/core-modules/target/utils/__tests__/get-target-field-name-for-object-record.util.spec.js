"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _gettargetfieldnameforobjectrecordutil = require("../get-target-field-name-for-object-record.util");
describe('getTargetFieldNameForObjectRecord', ()=>{
    it.each([
        [
            _types.CoreObjectNameSingular.Person,
            'targetPersonId'
        ],
        [
            _types.CoreObjectNameSingular.Company,
            'targetCompanyId'
        ],
        [
            _types.CoreObjectNameSingular.Opportunity,
            'targetOpportunityId'
        ]
    ])('maps %s to %s', (objectNameSingular, targetFieldName)=>{
        expect((0, _gettargetfieldnameforobjectrecordutil.getTargetFieldNameForObjectRecord)(objectNameSingular)).toBe(targetFieldName);
    });
    it('keeps custom objects on the related-person fallback', ()=>{
        expect((0, _gettargetfieldnameforobjectrecordutil.getTargetFieldNameForObjectRecord)('pet')).toBeNull();
    });
});

//# sourceMappingURL=get-target-field-name-for-object-record.util.spec.js.map
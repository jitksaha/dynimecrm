"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getTargetFieldNameForObjectRecord", {
    enumerable: true,
    get: function() {
        return getTargetFieldNameForObjectRecord;
    }
});
const _types = require("twenty-shared/types");
const getTargetFieldNameForObjectRecord = (objectNameSingular)=>{
    switch(objectNameSingular){
        case _types.CoreObjectNameSingular.Person:
            return 'targetPersonId';
        case _types.CoreObjectNameSingular.Company:
            return 'targetCompanyId';
        case _types.CoreObjectNameSingular.Opportunity:
            return 'targetOpportunityId';
        default:
            return null;
    }
};

//# sourceMappingURL=get-target-field-name-for-object-record.util.js.map
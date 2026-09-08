"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildCalendarEventTargetStandardFlatIndexMetadatas", {
    enumerable: true,
    get: function() {
        return buildCalendarEventTargetStandardFlatIndexMetadatas;
    }
});
const _buildstandardtargetflatindexmetadatasutil = require("./build-standard-target-flat-index-metadatas.util");
const buildCalendarEventTargetStandardFlatIndexMetadatas = (args)=>{
    const indexes = (0, _buildstandardtargetflatindexmetadatasutil.buildStandardTargetFlatIndexMetadatas)({
        args,
        fieldNames: {
            parent: 'calendarEvent',
            person: 'targetPerson',
            company: 'targetCompany',
            opportunity: 'targetOpportunity'
        },
        indexNames: {
            parentIdIndex: 'calendarEventIdIndex',
            personIdIndex: 'personIdIndex',
            companyIdIndex: 'companyIdIndex',
            opportunityIdIndex: 'opportunityIdIndex',
            personUniqueIndex: 'calendarEventPersonUniqueIndex',
            companyUniqueIndex: 'calendarEventCompanyUniqueIndex',
            opportunityUniqueIndex: 'calendarEventOpportunityUniqueIndex'
        }
    });
    return {
        calendarEventIdIndex: indexes.parentIdIndex,
        personIdIndex: indexes.personIdIndex,
        companyIdIndex: indexes.companyIdIndex,
        opportunityIdIndex: indexes.opportunityIdIndex,
        calendarEventPersonUniqueIndex: indexes.personUniqueIndex,
        calendarEventCompanyUniqueIndex: indexes.companyUniqueIndex,
        calendarEventOpportunityUniqueIndex: indexes.opportunityUniqueIndex
    };
};

//# sourceMappingURL=compute-calendar-event-target-standard-flat-index-metadata.util.js.map